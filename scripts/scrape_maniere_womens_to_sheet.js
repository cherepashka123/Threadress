/*
  Scrape Manière De Voir women's collections and append to Google Sheet
  Columns (A→M):
  product_id, text, category, color, material, occasion, tags, price, store_name, address, lat, lng, image_url
*/

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const COLLECTIONS = [
  {
    url: 'https://www.manieredevoir.com/collections/womenswear',
    category: 'Womenswear',
  },
  {
    url: 'https://www.manieredevoir.com/collections/womens-tops',
    category: 'Tops',
  },
  {
    url: 'https://www.manieredevoir.com/collections/womens-dresses',
    category: 'Dresses',
  },
  {
    url: 'https://www.manieredevoir.com/collections/womens-trousers',
    category: 'Trousers',
  },
];

const SHEET_RANGE = 'Sheet1!A1:M';
const STORE_NAME = 'Maniere de Voir';
const STORE_ADDRESS = '521 Broadway, Soho, NYC';
const STORE_LAT = 40.7258074;
const STORE_LNG = -73.9952559;
const PRODUCT_ID_PREFIX = 'MDV_';
const FORCE_APPEND =
  process.env.FORCE_APPEND === '1' || process.argv.includes('--force');

function ensureEnv(name) {
  const val = process.env[name];
  if (!val || !String(val).trim()) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return val;
}

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: ensureEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
      private_key: ensureEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, spreadsheetId: ensureEnv('GOOGLE_SHEET_ID') };
}

function inferAttributes(text, description) {
  const src = `${text} ${description || ''}`.toLowerCase();

  let material = '';
  if (src.includes('leather')) material = 'Leather';
  else if (src.includes('satin')) material = 'Satin';
  else if (src.includes('silk')) material = 'Silk';
  else if (src.includes('denim')) material = 'Denim';
  else if (src.includes('linen')) material = 'Linen';
  else if (src.includes('ribbed')) material = 'Ribbed knit';
  else if (src.includes('knit')) material = 'Knit';
  else if (src.includes('jersey')) material = 'Jersey';

  let occasion = '';
  if (src.includes('evening')) occasion = 'Evening';
  else if (src.includes('party')) occasion = 'Party';
  else if (src.includes('work') || src.includes('office')) occasion = 'Work';
  else if (src.includes('casual')) occasion = 'Casual';
  else if (src.includes('wedding')) occasion = 'Wedding';

  let color = '';
  const colorMap = [
    'black',
    'white',
    'red',
    'blue',
    'green',
    'beige',
    'brown',
    'cream',
    'ivory',
    'grey',
    'gray',
    'pink',
    'purple',
    'orange',
    'yellow',
    'khaki',
    'navy',
  ];
  for (const c of colorMap) {
    if (src.includes(c)) {
      color = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  const tags = [];
  if (src.includes('ribbed')) tags.push('ribbed');
  if (src.includes('bodycon')) tags.push('bodycon');
  if (src.includes('oversized')) tags.push('oversized');
  if (src.includes('cropped')) tags.push('cropped');
  if (src.includes('tailored')) tags.push('tailored');

  return { color, material, occasion, tags: tags.join(', ') };
}

async function readExistingSheetData(sheets, spreadsheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: SHEET_RANGE,
  });
  const rows = res.data.values || [];
  if (rows.length < 2) {
    return {
      headers: rows[0] || [],
      items: [],
      lastIdNum: 0,
      existingTexts: new Set(),
      existingImages: new Set(),
    };
  }
  const headers = rows[0];
  const headerIndex = Object.fromEntries(headers.map((h, i) => [h, i]));
  const items = rows.slice(1);
  const existingTexts = new Set(
    items
      .map((r) => (r[headerIndex['text']] || '').toString().trim())
      .filter(Boolean)
  );
  const existingImages = new Set(
    items
      .map((r) => (r[headerIndex['image_url']] || '').toString().trim())
      .filter(Boolean)
  );

  let lastIdNum = 0;
  for (const r of items) {
    const pid = (r[headerIndex['product_id']] || '').toString().trim();
    const m = pid.match(/^MDV_(\d{3,})$/);
    if (m) lastIdNum = Math.max(lastIdNum, parseInt(m[1], 10));
  }

  return { headers, items, lastIdNum, existingTexts, existingImages };
}

function nextProductId(currentNum) {
  const n = currentNum + 1;
  return `${PRODUCT_ID_PREFIX}${String(n).padStart(3, '0')}`;
}

async function scrapeCollection(browser, { url, category }) {
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
  // Try to load lazy content by scrolling
  try {
    await page.waitForTimeout(1000);
    const scrollSteps = 20;
    for (let i = 0; i < scrollSteps; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(300);
    }
    await page.waitForSelector('a[href*="/products/"]', { timeout: 5000 });
  } catch {}

  // Collect product hrefs from collection grid
  const productLinks = await page.$$eval('a[href*="/products/"]', (as) => {
    const links = new Set();
    as.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.includes('/products/'))
        links.add(
          href.startsWith('http')
            ? href
            : `https://www.manieredevoir.com${href}`
        );
    });
    return Array.from(links);
  });

  const results = [];
  for (const href of productLinks) {
    try {
      const p = await browser.newPage();
      await p.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
      );
      await p.setViewport({ width: 1366, height: 900 });
      await p.goto(href, { waitUntil: 'networkidle2', timeout: 120000 });

      const data = await p.evaluate(() => {
        const getText = (sel) =>
          document.querySelector(sel)?.textContent?.trim() || '';
        const title = getText('h1, h1.product__title, .product-title');
        // Price often in elements with price class
        const priceRaw = (
          document.querySelector('[class*="price"], .price')?.textContent || ''
        )
          .replace(/\s+/g, ' ')
          .trim();
        let imageUrl = '';
        const imgSel = document.querySelector(
          'img[src*="cdn"], .product-media img, .product__media img, img'
        );
        if (imgSel)
          imageUrl =
            imgSel.getAttribute('src') || imgSel.getAttribute('data-src') || '';
        if (imageUrl && imageUrl.startsWith('//'))
          imageUrl = 'https:' + imageUrl;
        const desc =
          document.querySelector(
            'section[aria-label*="Description" i], .product__description, #description, [itemprop="description"]'
          )?.textContent || '';
        return { title, priceRaw, imageUrl, desc: desc.trim() };
      });

      // Parse price (remove currency, keep numeric)
      let price = '';
      const m = data.priceRaw.match(/([0-9]+(?:\.[0-9]{1,2})?)/);
      if (m) price = m[1];

      results.push({
        text: data.title,
        price,
        image_url: data.imageUrl,
        description: data.desc,
        category,
        url: href,
      });

      await p.close();
    } catch (err) {
      console.warn('Failed to scrape product:', href, err.message || err);
    }
  }

  await page.close();
  return results;
}

async function main() {
  const start = Date.now();
  const { sheets, spreadsheetId } = await getSheetsClient();

  const existing = await readExistingSheetData(sheets, spreadsheetId);
  let idCounter = existing.lastIdNum;

  const puppeteer = (await import('puppeteer')).default;
  const userDataDir = path.join(
    __dirname,
    `.puppeteer_profile_${Date.now()}_${process.pid}`
  );
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }
  const browser = await puppeteer.launch({
    headless: 'new',
    userDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-zygote',
      '--single-process',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-crash-reporter',
    ],
  });
  const all = [];
  try {
    for (const col of COLLECTIONS) {
      const items = await scrapeCollection(browser, col);
      all.push(...items);
    }
  } finally {
    await browser.close();
  }

  // Deduplicate and map (can be bypassed with FORCE_APPEND)
  const toAppend = [];
  for (const item of all) {
    const text = (item.text || '').trim();
    const imageUrl = (item.image_url || '').trim();
    if (!text || !imageUrl) continue;
    const isDup =
      existing.existingTexts.has(text) || existing.existingImages.has(imageUrl);
    if (isDup && !FORCE_APPEND) continue;

    const inferred = inferAttributes(text, item.description);
    idCounter += 1;
    const product_id = nextProductId(idCounter - 1); // nextProductId expects currentNum

    // Column order A→M
    toAppend.push([
      product_id,
      text,
      item.category || '',
      inferred.color || '',
      inferred.material || '',
      inferred.occasion || '',
      inferred.tags || '',
      item.price || '',
      STORE_NAME,
      STORE_ADDRESS,
      STORE_LAT,
      STORE_LNG,
      imageUrl,
    ]);
  }

  if (toAppend.length === 0) {
    console.log(
      FORCE_APPEND ? 'No items gathered to append.' : 'No new items to append.'
    );
    return;
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: SHEET_RANGE,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: toAppend },
  });

  console.log(
    `Appended ${toAppend.length} new items to Google Sheet in ${(Date.now() - start) / 1000}s.`
  );
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Scrape failed:', err?.stack || err);
    process.exit(1);
  });
}
