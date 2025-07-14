const https = require('https');
require('dotenv').config({ path: '.env.local' });

// === Brand/Boutique List ===
const mockBoutiques = [
  {
    name: 'Atelier Nouveau',
    location: 'SoHo',
    style: 'Contemporary',
    rating: 4.8,
  },
  {
    name: 'Brooklyn Vintage Co.',
    location: 'Williamsburg',
    style: 'Vintage',
    rating: 4.6,
  },
  {
    name: 'Madison Couture',
    location: 'Upper East Side',
    style: 'Luxury',
    rating: 4.9,
  },
  {
    name: 'Village Thread',
    location: 'West Village',
    style: 'Bohemian',
    rating: 4.7,
  },
  {
    name: 'Tribeca Moderne',
    location: 'Tribeca',
    style: 'Minimalist',
    rating: 4.5,
  },
];

// === Product List ===
const prototypeProducts = [
  {
    name: 'Black & Gold Bikini Set',
    imageUrl: '/Products_for_prototype/black_gold_bikini_set.png',
    price: 120,
    style: 'Luxury',
    category: 'Swimwear',
  },
  {
    name: 'Embellished Mini Dress',
    imageUrl: '/Products_for_prototype/Embellished_mini_dress.png',
    price: 280,
    style: 'Luxury',
    category: 'Dresses',
  },
  {
    name: 'Lace Blouse',
    imageUrl: '/Products_for_prototype/lace_blouse.png',
    price: 160,
    style: 'Romantic',
    category: 'Tops',
  },
  {
    name: 'Jean Flowy Shorts',
    imageUrl: '/Products_for_prototype/jean_flowy-shorts.png',
    price: 95,
    style: 'Casual',
    category: 'Bottoms',
  },
  {
    name: 'White Ballerina Dress',
    imageUrl: '/Products_for_prototype/white_ballerina_dress.png',
    price: 220,
    style: 'Romantic',
    category: 'Dresses',
  },
  {
    name: 'Cutout Jeans',
    imageUrl: '/Products_for_prototype/Cutout_jeans.png',
    price: 140,
    style: 'Edgy',
    category: 'Bottoms',
  },
  {
    name: 'Gold Mini Skirt',
    imageUrl: '/Products_for_prototype/Gold_mini_skirt.png',
    price: 180,
    style: 'Luxury',
    category: 'Bottoms',
  },
  {
    name: 'Mesh Top',
    imageUrl: '/Products_for_prototype/Mesh_top.png',
    price: 90,
    style: 'Edgy',
    category: 'Tops',
  },
  {
    name: 'Heart Jeans',
    imageUrl: '/Products_for_prototype/Heart_jeans.png',
    price: 150,
    style: 'Romantic',
    category: 'Bottoms',
  },
  {
    name: 'Jean Leather Jacket',
    imageUrl: '/Products_for_prototype/Jean_leather_jacket.png',
    price: 320,
    style: 'Edgy',
    category: 'Outerwear',
  },
  {
    name: 'Red Maxi Embellished Dress',
    imageUrl: '/Products_for_prototype/Red_Maxi_Embellished_Dress.png',
    price: 290,
    style: 'Luxury',
    category: 'Dresses',
  },
  {
    name: 'Flower Earrings',
    imageUrl: '/Products_for_prototype/Flower_earrings.png',
    price: 85,
    style: 'Romantic',
    category: 'Accessories',
  },
  {
    name: 'Brown Clutch',
    imageUrl: '/Products_for_prototype/Brown_clutch.png',
    price: 160,
    style: 'Classic',
    category: 'Accessories',
  },
  {
    name: 'Grey Maxi Dress',
    imageUrl: '/Products_for_prototype/Grey_Maxi_Dress.png',
    price: 240,
    style: 'Minimalist',
    category: 'Dresses',
  },
  {
    name: 'Green Maxi Dress',
    imageUrl: '/Products_for_prototype/Green_maxi_dress.png',
    price: 260,
    style: 'Romantic',
    category: 'Dresses',
  },
  {
    name: 'Green Clutch Bag',
    imageUrl: '/Products_for_prototype/Green_clutch_bag.png',
    price: 140,
    style: 'Classic',
    category: 'Bags',
  },
  {
    name: 'Beige Pants',
    imageUrl: '/Products_for_prototype/Beige_pants.png',
    price: 110,
    style: 'Minimalist',
    category: 'Bottoms',
  },
  {
    name: 'Polo Beige Shirt',
    imageUrl: '/Products_for_prototype/Polo_beige_shirt.png',
    price: 95,
    style: 'Minimalist',
    category: 'Tops',
  },
  {
    name: 'Wide Boyfriend Jeans',
    imageUrl: '/Products_for_prototype/Wide_boyfriend_jeans.png',
    price: 130,
    style: 'Casual',
    category: 'Bottoms',
  },
  {
    name: 'Rose Beach Bag',
    imageUrl: '/Products_for_prototype/Rose_beach_bag.png',
    price: 120,
    style: 'Bohemian',
    category: 'Bags',
  },
  {
    name: 'Zigzag Pattern Dress',
    imageUrl: '/Products_for_prototype/Zigzag_pattern_dress.png',
    price: 210,
    style: 'Edgy',
    category: 'Dresses',
  },
  {
    name: 'Sandals',
    imageUrl: '/Products_for_prototype/Sandals.png',
    price: 80,
    style: 'Classic',
    category: 'Shoes',
  },
  {
    name: 'Brown Set Top',
    imageUrl: '/Products_for_prototype/Brown_set_top.png',
    price: 70,
    style: 'Casual',
    category: 'Tops',
  },
  {
    name: 'Brown Set Shorts',
    imageUrl: '/Products_for_prototype/Brown_set_shorts.png',
    price: 65,
    style: 'Casual',
    category: 'Bottoms',
  },
  {
    name: 'Silver Leather Mules Heels',
    imageUrl: '/Products_for_prototype/SIlver_leather_mules_heels.png',
    price: 150,
    style: 'Luxury',
    category: 'Shoes',
  },
  {
    name: 'White Sunglasses',
    imageUrl: '/Products_for_prototype/white_sunglasses.png',
    price: 60,
    style: 'Edgy',
    category: 'Accessories',
  },
  {
    name: 'Rose Pants',
    imageUrl: '/Products_for_prototype/Rose_pants.png',
    price: 105,
    style: 'Bohemian',
    category: 'Bottoms',
  },
  {
    name: 'Wideleg Jeans',
    imageUrl: '/Products_for_prototype/Wideleg_jeans.png',
    price: 135,
    style: 'Casual',
    category: 'Bottoms',
  },
  {
    name: 'White Strapless Top',
    imageUrl: '/Products_for_prototype/white_strapless_top.png',
    price: 75,
    style: 'Minimalist',
    category: 'Tops',
  },
  {
    name: 'White Gold Heels',
    imageUrl: '/Products_for_prototype/White_gold_heels.png',
    price: 170,
    style: 'Luxury',
    category: 'Shoes',
  },
  {
    name: 'Yellow Set Belted Shorts',
    imageUrl: '/Products_for_prototype/Yellow_set_belted_shorts.png',
    price: 85,
    style: 'Contemporary',
    category: 'Bottoms',
  },
  {
    name: 'Yellow Set Jacket',
    imageUrl: '/Products_for_prototype/Yellow_set_jacket.png',
    price: 130,
    style: 'Contemporary',
    category: 'Outerwear',
  },
  {
    name: 'Maxi Strapless Dress',
    imageUrl: '/Products_for_prototype/Maxi_strapless_dress.png',
    price: 230,
    style: 'Romantic',
    category: 'Dresses',
  },
  {
    name: 'Denim Dress',
    imageUrl: '/Products_for_prototype/Denim_dress.png',
    price: 150,
    style: 'Vintage',
    category: 'Dresses',
  },
  {
    name: 'Print Sarong Skirt',
    imageUrl: '/Products_for_prototype/print_sarog_skirt.png',
    price: 95,
    style: 'Bohemian',
    category: 'Bottoms',
  },
  {
    name: 'Flower Bag',
    imageUrl: '/Products_for_prototype/Flower_bag.png',
    price: 110,
    style: 'Romantic',
    category: 'Bags',
  },
  {
    name: 'Jelly Sandals',
    imageUrl: '/Products_for_prototype/jelly_sandals.png',
    price: 45,
    style: 'Casual',
    category: 'Shoes',
  },
  {
    name: 'White Swimsuit',
    imageUrl: '/Products_for_prototype/white_swimsuit.png',
    price: 95,
    style: 'Minimalist',
    category: 'Swimwear',
  },
  {
    name: 'Fruit Shoulder Bag',
    imageUrl: '/Products_for_prototype/fruit_shoulder_bag.png',
    price: 125,
    style: 'Bohemian',
    category: 'Bags',
  },
  {
    name: 'Beach Bag',
    imageUrl: '/Products_for_prototype/beach_bag.png',
    price: 85,
    style: 'Casual',
    category: 'Bags',
  },
  {
    name: 'Leather Sandals',
    imageUrl: '/Products_for_prototype/leather_sandals.png',
    price: 110,
    style: 'Classic',
    category: 'Shoes',
  },
  {
    name: 'One Piece Swimsuit',
    imageUrl: '/Products_for_prototype/one_piece_swimsuit.png',
    price: 105,
    style: 'Classic',
    category: 'Swimwear',
  },
  {
    name: 'Maxi Dress',
    imageUrl: '/Products_for_prototype/maxi_dress.png',
    price: 275,
    style: 'Romantic',
    category: 'Dresses',
  },
  {
    name: 'Ballet Flats',
    imageUrl: '/Products_for_prototype/ballet_flats.png',
    price: 95,
    style: 'Classic',
    category: 'Shoes',
  },
  {
    name: 'Colorful Bucket Hat',
    imageUrl: '/Products_for_prototype/colorful_bucket_hat.png',
    price: 55,
    style: 'Bohemian',
    category: 'Accessories',
  },
  {
    name: 'Bird Belt',
    imageUrl: '/Products_for_prototype/Bird_belt.png',
    price: 75,
    style: 'Bohemian',
    category: 'Accessories',
  },
  {
    name: 'Leather Card Holder',
    imageUrl: '/Products_for_prototype/Leather_card_colder.png',
    price: 65,
    style: 'Classic',
    category: 'Accessories',
  },
  {
    name: 'Beige Leather Wallet',
    imageUrl: '/Products_for_prototype/beige_leather_wallet.png',
    price: 85,
    style: 'Classic',
    category: 'Accessories',
  },
  {
    name: 'Oval Black Sunglasses',
    imageUrl: '/Products_for_prototype/oval_black_sunglasses.png',
    price: 70,
    style: 'Edgy',
    category: 'Accessories',
  },
  {
    name: 'Printed Scarf',
    imageUrl: '/Products_for_prototype/printed_scarf.png',
    price: 55,
    style: 'Bohemian',
    category: 'Accessories',
  },
  {
    name: 'Knitted Top',
    imageUrl: '/Products_for_prototype/knitted_top.png',
    price: 115,
    style: 'Casual',
    category: 'Tops',
  },
  {
    name: 'Black Top',
    imageUrl: '/Products_for_prototype/Black_top.png',
    price: 85,
    style: 'Minimalist',
    category: 'Tops',
  },
  {
    name: 'Brown Leather Skirt',
    imageUrl: '/Products_for_prototype/Brown_leather_skirt.png',
    price: 145,
    style: 'Edgy',
    category: 'Bottoms',
  },
  {
    name: 'Bracelet Black White',
    imageUrl: '/Products_for_prototype/Bracelet_black_white.png',
    price: 40,
    style: 'Minimalist',
    category: 'Accessories',
  },
  {
    name: 'Open Toe Sandals',
    imageUrl: '/Products_for_prototype/open_toe_sandals.png',
    price: 90,
    style: 'Classic',
    category: 'Shoes',
  },
];

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_BASE_URL = 'https://connect.squareupsandbox.com';

function toCents(price) {
  return Math.round(Number(price) * 100);
}

function makeSku(name, size) {
  return (
    name
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 16) + (size ? '-' + size.toUpperCase() : '')
  );
}

function makeHttpRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(requestOptions, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonBody = JSON.parse(body);
            resolve(jsonBody);
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function upsertCatalogObject(object, idempotencyKey) {
  const url = `${SQUARE_BASE_URL}/v2/catalog/object`;
  const options = {
    method: 'POST',
    headers: {
      'Square-Version': '2024-06-13',
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  const data = {
    idempotency_key: idempotencyKey,
    object: object,
  };

  return await makeHttpRequest(url, options, data);
}

async function uploadAll() {
  console.log('🚀 Starting bulk upload to Square Catalog...');
  console.log(`📊 Total products to upload: ${prototypeProducts.length}`);
  console.log('');

  for (let i = 0; i < prototypeProducts.length; i++) {
    const product = prototypeProducts[i];
    const boutique = mockBoutiques[i % mockBoutiques.length];
    const brand = boutique.name;
    const name = `${brand} ${product.name}`;
    const description = product.description || 'New Season';
    const priceCents = toCents(product.price);
    const variationId = `#VARIATION_${i}`;
    const itemId = `#ITEM_${i}`;
    const sku = makeSku(product.name);

    const itemObject = {
      type: 'ITEM',
      id: itemId,
      present_at_all_locations: true,
      item_data: {
        name: name,
        description: description,
        category_id: undefined,
        variations: [
          {
            type: 'ITEM_VARIATION',
            id: variationId,
            present_at_all_locations: true,
            item_variation_data: {
              item_id: itemId,
              name: 'Default',
              pricing_type: 'FIXED_PRICING',
              price_money: {
                amount: priceCents,
                currency: 'USD',
              },
              sku: sku,
              track_inventory: true,
            },
          },
        ],
      },
    };

    try {
      const idempotencyKey = `threadress-${Date.now()}-${i}`;
      const response = await upsertCatalogObject(itemObject, idempotencyKey);

      if (response.catalog_object) {
        const uploaded = response.catalog_object;
        console.log(
          `✅ Uploaded: ${name} | Item ID: ${uploaded.id} | Variation ID: ${uploaded.item_data.variations[0].id}`
        );
      } else {
        console.log(`⚠️ No object returned for: ${name}`);
        console.log('Full response:', JSON.stringify(response, null, 2));
      }

      // Add a longer delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to upload ${name}:`, error.message);
      if (error && error.stack) {
        console.error(error.stack);
      }
    }
  }

  console.log('');
  console.log('🎉 Bulk upload completed!');
}

uploadAll().catch(console.error);
