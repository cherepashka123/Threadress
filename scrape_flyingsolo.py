#!/usr/bin/env python3
"""
Polite scraper for FlyingSolo.nyc product data.
Respects robots.txt and implements proper delays.
"""

import os
import re
import csv
import time
import json
import requests
from pathlib import Path
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('legal/scrape_log.txt'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class FlyingSoloScraper:
    def __init__(self):
        self.base_url = "https://flyingsolo.nyc"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'ThreadressDemoBot/1.0 (+founder@threadress.com)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
        
        # Create directories
        self.data_dir = Path("public/data/flyingsolo")
        self.images_dir = self.data_dir / "images"
        self.legal_dir = Path("legal")
        
        for dir_path in [self.data_dir, self.images_dir, self.legal_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        self.products = []
        self.scraped_urls = set()
        
    def check_robots_txt(self) -> bool:
        """Check if scraping is allowed according to robots.txt"""
        try:
            robots_url = urljoin(self.base_url, "/robots.txt")
            response = self.session.get(robots_url, timeout=10)
            
            if response.status_code == 200:
                robots_content = response.text.lower()
                # Check if our user agent or general scraping is disallowed
                if "user-agent: *" in robots_content:
                    disallow_section = robots_content.split("user-agent: *")[1].split("user-agent:")[0]
                    if "disallow: /" in disallow_section and "allow: /" not in disallow_section:
                        logger.warning("robots.txt may disallow scraping")
                        return False
                logger.info("robots.txt check passed")
                return True
            else:
                logger.warning("Could not fetch robots.txt, proceeding with caution")
                return True
        except Exception as e:
            logger.warning(f"Error checking robots.txt: {e}")
            return True
    
    def get_product_urls(self) -> List[str]:
        """Get product URLs by scraping the shop page"""
        try:
            # Try different shop page URLs
            shop_urls = [
                "/shop/",
                "/products/",
                "/product-category/",
                "/woocommerce/",
            ]
            
            all_urls = []
            
            for shop_path in shop_urls:
                try:
                    shop_url = urljoin(self.base_url, shop_path)
                    logger.info(f"Trying shop URL: {shop_url}")
                    
                    response = self.session.get(shop_url, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        
                        # Look for product links
                        product_links = []
                        
                        # WooCommerce product links
                        for link in soup.find_all('a', href=True):
                            href = link['href']
                            if '/product/' in href or '/products/' in href:
                                if href.startswith('/'):
                                    href = urljoin(self.base_url, href)
                                product_links.append(href)
                        
                        # Also look for product cards/containers
                        product_containers = soup.find_all(['div', 'article'], class_=re.compile(r'product|item'))
                        for container in product_containers:
                            link = container.find('a', href=True)
                            if link:
                                href = link['href']
                                if href.startswith('/'):
                                    href = urljoin(self.base_url, href)
                                if '/product/' in href or '/products/' in href:
                                    product_links.append(href)
                        
                        all_urls.extend(product_links)
                        logger.info(f"Found {len(product_links)} products from {shop_path}")
                        
                        if product_links:
                            break  # Found products, no need to try other URLs
                    
                    time.sleep(1.5)  # Be polite
                    
                except Exception as e:
                    logger.warning(f"Error with shop URL {shop_path}: {e}")
                    continue
            
            # Remove duplicates
            all_urls = list(set(all_urls))
            logger.info(f"Found {len(all_urls)} unique product URLs")
            return all_urls
            
        except Exception as e:
            logger.error(f"Error fetching product URLs: {e}")
            return []
    
    def extract_product_data(self, url: str) -> Optional[Dict]:
        """Extract product data from a single product page"""
        try:
            logger.info(f"Scraping: {url}")
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title = None
            og_title = soup.find('meta', property='og:title')
            if og_title:
                title = og_title.get('content', '').strip()
            else:
                h1 = soup.find('h1')
                if h1:
                    title = h1.get_text().strip()
            
            if not title:
                logger.warning(f"No title found for {url}")
                return None
            
            # Extract description
            description = ""
            og_desc = soup.find('meta', property='og:description')
            if og_desc:
                description = og_desc.get('content', '').strip()
            else:
                desc_elem = soup.find(class_='product-description')
                if desc_elem:
                    description = desc_elem.get_text().strip()
            
            # Extract price
            price = None
            price_meta = soup.find('meta', attrs={'property': 'product:price:amount'})
            if price_meta:
                price_str = price_meta.get('content', '').strip()
                # Extract numeric price
                price_match = re.search(r'[\d,]+\.?\d*', price_str.replace(',', ''))
                if price_match:
                    price = int(float(price_match.group()))
            else:
                # Look for price in various elements
                price_elements = soup.find_all(string=re.compile(r'\$[\d,]+'))
                for elem in price_elements:
                    price_match = re.search(r'\$([\d,]+)', elem)
                    if price_match:
                        price = int(price_match.group(1).replace(',', ''))
                        break
            
            # Extract tags/keywords
            tags = []
            keywords_meta = soup.find('meta', attrs={'name': 'keywords'})
            if keywords_meta:
                keywords = keywords_meta.get('content', '').strip()
                tags = [tag.strip() for tag in keywords.split(',') if tag.strip()]
            else:
                tag_elements = soup.select('.tags a, .product-tags a, .categories a')
                tags = [elem.get_text().strip() for elem in tag_elements]
            
            # Extract sizes
            sizes = []
            size_select = soup.find('select', attrs={'name': re.compile(r'size', re.I)})
            if size_select:
                size_options = size_select.find_all('option')
                sizes = [opt.get_text().strip() for opt in size_options if opt.get_text().strip()]
            
            # Extract images
            images = []
            og_image = soup.find('meta', attrs={'property': 'og:image'})
            if og_image:
                img_url = og_image.get('content', '').strip()
                if img_url:
                    images.append(img_url)
            
            # Find additional images
            img_elements = soup.find_all('img', attrs={'src': re.compile(r'\.(jpg|jpeg|png|webp)', re.I)})
            for img in img_elements[:5]:  # Limit to 5 additional images
                src = img.get('src', '')
                if src and src not in images:
                    # Convert relative URLs to absolute
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        src = urljoin(self.base_url, src)
                    elif not src.startswith('http'):
                        src = urljoin(url, src)
                    
                    if src.startswith('http'):
                        images.append(src)
            
            # Download images
            image_paths = []
            for i, img_url in enumerate(images[:6]):  # Max 6 images
                try:
                    img_response = self.session.get(img_url, timeout=10)
                    if img_response.status_code == 200:
                        # Create filename
                        parsed_url = urlparse(img_url)
                        filename = f"{len(self.products):03d}_{i}_{os.path.basename(parsed_url.path)}"
                        if not filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                            filename += '.jpg'
                        
                        # Save image
                        img_path = self.images_dir / filename
                        with open(img_path, 'wb') as f:
                            f.write(img_response.content)
                        
                        image_paths.append(f"/data/flyingsolo/images/{filename}")
                        
                except Exception as e:
                    logger.warning(f"Could not download image {img_url}: {e}")
                    continue
            
            # Create product data
            product_data = {
                'product_id': f"fs_{len(self.products):03d}",
                'title': title,
                'description': description,
                'tags': ', '.join(tags),
                'price': price or 0,
                'sizes': '|'.join(sizes) if sizes else 'One Size',
                'image_paths': '|'.join(image_paths),
                'source_url': url,
                'store': 'Flying Solo NYC'
            }
            
            logger.info(f"Extracted: {title} - ${price}")
            return product_data
            
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
            return None
    
    def scrape_products(self, max_products: int = 50):
        """Scrape products from FlyingSolo.nyc"""
        logger.info("Starting FlyingSolo.nyc scraping...")
        
        # Check robots.txt
        if not self.check_robots_txt():
            logger.error("robots.txt disallows scraping")
            return
        
        # Get product URLs
        product_urls = self.get_product_urls()
        if not product_urls:
            logger.error("No product URLs found")
            return
        
        # Limit to max_products
        product_urls = product_urls[:max_products]
        logger.info(f"Scraping {len(product_urls)} products...")
        
        # Scrape each product
        for i, url in enumerate(product_urls):
            if url in self.scraped_urls:
                continue
                
            product_data = self.extract_product_data(url)
            if product_data:
                self.products.append(product_data)
                self.scraped_urls.add(url)
            
            # Be polite - sleep between requests
            time.sleep(1.5)
            
            # Progress update
            if (i + 1) % 10 == 0:
                logger.info(f"Scraped {i + 1}/{len(product_urls)} products")
        
        # Save to CSV
        self.save_to_csv()
        
        # Log completion
        logger.info(f"Scraping completed. Found {len(self.products)} products.")
        self.log_completion()
    
    def save_to_csv(self):
        """Save products to CSV file"""
        csv_path = self.data_dir / "products.csv"
        
        fieldnames = [
            'product_id', 'title', 'description', 'tags', 'price', 
            'sizes', 'image_paths', 'source_url', 'store'
        ]
        
        with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(self.products)
        
        logger.info(f"Saved {len(self.products)} products to {csv_path}")
    
    def log_completion(self):
        """Log scraping completion details"""
        log_entry = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'site': 'FlyingSolo.nyc',
            'products_scraped': len(self.products),
            'sitemap_url': f"{self.base_url}/sitemap_index.xml",
            'data_directory': str(self.data_dir),
            'images_directory': str(self.images_dir)
        }
        
        with open(self.legal_dir / "scrape_log.txt", "a") as f:
            f.write(f"\n{json.dumps(log_entry, indent=2)}\n")

def main():
    """Main function"""
    scraper = FlyingSoloScraper()
    scraper.scrape_products(max_products=50)  # Limit to 50 products for demo

if __name__ == "__main__":
    main()
