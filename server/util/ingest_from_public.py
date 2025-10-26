#!/usr/bin/env python3
"""
Ingest products from public/Products_for_prototype/ directory.
Scans for images and generates product metadata with sensible defaults.
"""

import os
import re
import csv
import json
from pathlib import Path
from typing import List, Dict, Any
import random

def extract_product_info(filename: str) -> Dict[str, Any]:
    """Extract product information from filename."""
    # Remove extension
    name = Path(filename).stem
    
    # Common color keywords
    colors = [
        'black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple',
        'brown', 'grey', 'gray', 'beige', 'navy', 'coral', 'ivory', 'cream',
        'gold', 'silver', 'rose', 'violet', 'camel', 'tan', 'olive', 'maroon'
    ]
    
    # Common material keywords
    materials = [
        'leather', 'denim', 'cotton', 'silk', 'wool', 'cashmere', 'linen',
        'polyester', 'spandex', 'satin', 'chiffon', 'velvet', 'tweed',
        'lace', 'mesh', 'jersey', 'corduroy', 'canvas', 'suede'
    ]
    
    # Common garment types
    garment_types = [
        'dress', 'shirt', 'top', 'pants', 'jeans', 'skirt', 'jacket',
        'coat', 'blazer', 'shorts', 'swimsuit', 'bikini', 'bag', 'wallet',
        'belt', 'shoes', 'sandals', 'heels', 'flats', 'sunglasses', 'hat',
        'scarf', 'earrings', 'bracelet', 'necklace', 'clutch'
    ]
    
    # Extract color
    detected_color = None
    for color in colors:
        if color in name.lower():
            detected_color = color
            break
    
    # Extract material
    detected_material = None
    for material in materials:
        if material in name.lower():
            detected_material = material
            break
    
    # Extract garment type
    detected_type = None
    for garment in garment_types:
        if garment in name.lower():
            detected_type = garment
            break
    
    # Generate title
    title_parts = []
    if detected_color:
        title_parts.append(detected_color.title())
    if detected_material:
        title_parts.append(detected_material.title())
    if detected_type:
        title_parts.append(detected_type.title())
    
    if not title_parts:
        # Fallback: use filename with proper formatting
        title_parts = [name.replace('_', ' ').title()]
    
    title = ' '.join(title_parts)
    
    # Generate description
    description_parts = []
    if detected_color:
        description_parts.append(f"{detected_color} colored")
    if detected_material:
        description_parts.append(f"{detected_material} fabric")
    if detected_type:
        description_parts.append(f"{detected_type}")
    else:
        description_parts.append("fashion item")
    
    description = f"Beautiful {' '.join(description_parts)} perfect for any occasion."
    
    # Generate tags
    tags = []
    if detected_color:
        tags.append(detected_color)
    if detected_material:
        tags.append(detected_material)
    if detected_type:
        tags.append(detected_type)
    
    # Add style tags
    style_tags = ['casual', 'elegant', 'vintage', 'modern', 'chic', 'bohemian', 'minimalist']
    tags.extend(random.sample(style_tags, 2))
    
    # Generate price (realistic fashion prices)
    base_prices = {
        'dress': (80, 300),
        'jacket': (120, 400),
        'coat': (150, 500),
        'shirt': (40, 120),
        'top': (30, 100),
        'pants': (60, 200),
        'jeans': (70, 250),
        'skirt': (50, 150),
        'shorts': (40, 120),
        'bag': (50, 200),
        'wallet': (20, 80),
        'belt': (30, 100),
        'shoes': (60, 300),
        'sandals': (40, 150),
        'heels': (80, 250),
        'flats': (50, 150),
        'sunglasses': (30, 150),
        'hat': (25, 80),
        'scarf': (20, 60),
        'earrings': (15, 80),
        'bracelet': (20, 100),
        'necklace': (30, 150),
        'clutch': (40, 120)
    }
    
    price_range = base_prices.get(detected_type, (30, 150))
    price = random.randint(price_range[0], price_range[1])
    
    # Generate sizes
    sizes = ['XS', 'S', 'M', 'L', 'XL']
    if detected_type in ['shoes', 'sandals', 'heels', 'flats']:
        sizes = ['6', '7', '8', '9', '10', '11']
    elif detected_type in ['sunglasses', 'hat', 'scarf', 'earrings', 'bracelet', 'necklace']:
        sizes = ['One Size']
    
    return {
        'title': title,
        'description': description,
        'tags': ', '.join(tags),
        'color': detected_color or 'multi',
        'material': detected_material or 'mixed',
        'sizes': ', '.join(sizes),
        'price': price
    }

def scan_products_directory(public_dir: str) -> List[Dict[str, Any]]:
    """Scan the Products_for_prototype directory and generate product data."""
    products = []
    products_dir = Path(public_dir) / "Products_for_prototype"
    
    if not products_dir.exists():
        print(f"Directory {products_dir} does not exist!")
        return products
    
    # Supported image extensions
    image_extensions = {'.png', '.jpg', '.jpeg', '.webp', '.avif'}
    
    for file_path in products_dir.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            # Extract product info from filename
            product_info = extract_product_info(file_path.name)
            
            # Create product record
            product = {
                'product_id': f"prod_{len(products) + 1:03d}",
                'title': product_info['title'],
                'description': product_info['description'],
                'tags': product_info['tags'],
                'color': product_info['color'],
                'material': product_info['material'],
                'sizes': product_info['sizes'],
                'price': product_info['price'],
                'image_path': f"/Products_for_prototype/{file_path.name}"
            }
            
            products.append(product)
    
    return products

def augment_products(products: List[Dict[str, Any]], count: int) -> List[Dict[str, Any]]:
    """Generate synthetic products by cloning and perturbing existing ones."""
    augmented = []
    
    # Variation templates
    color_variations = {
        'black': ['navy', 'charcoal', 'dark gray'],
        'white': ['ivory', 'cream', 'off-white'],
        'red': ['burgundy', 'crimson', 'rose'],
        'blue': ['navy', 'royal', 'sky'],
        'green': ['emerald', 'forest', 'mint'],
        'brown': ['tan', 'camel', 'chocolate'],
        'pink': ['rose', 'coral', 'blush'],
        'purple': ['violet', 'lavender', 'plum']
    }
    
    material_variations = {
        'cotton': ['organic cotton', 'cotton blend'],
        'denim': ['vintage denim', 'stretch denim'],
        'leather': ['genuine leather', 'vegan leather'],
        'silk': ['pure silk', 'silk blend'],
        'wool': ['merino wool', 'cashmere blend']
    }
    
    for i in range(count):
        # Pick a random existing product
        base_product = random.choice(products)
        
        # Create variation
        new_product = base_product.copy()
        new_product['product_id'] = f"aug_{len(products) + len(augmented) + 1:03d}"
        
        # Vary the title
        title_parts = new_product['title'].split()
        if len(title_parts) >= 2:
            # Sometimes change the first word (color)
            if random.random() < 0.3:
                original_color = title_parts[0].lower()
                if original_color in color_variations:
                    title_parts[0] = random.choice(color_variations[original_color]).title()
                else:
                    title_parts[0] = random.choice(['Vintage', 'Classic', 'Modern', 'Elegant'])
        
        new_product['title'] = ' '.join(title_parts)
        
        # Vary the description
        desc_words = new_product['description'].split()
        if len(desc_words) > 3:
            # Add an adjective
            adjectives = ['stunning', 'gorgeous', 'elegant', 'chic', 'sophisticated']
            desc_words.insert(1, random.choice(adjectives))
        new_product['description'] = ' '.join(desc_words)
        
        # Vary the color
        if random.random() < 0.4:
            original_color = new_product['color']
            if original_color in color_variations:
                new_product['color'] = random.choice(color_variations[original_color])
            else:
                new_product['color'] = random.choice(['navy', 'coral', 'sage', 'burgundy'])
        
        # Vary the material
        if random.random() < 0.3:
            original_material = new_product['material']
            if original_material in material_variations:
                new_product['material'] = random.choice(material_variations[original_material])
            else:
                new_product['material'] = random.choice(['cotton blend', 'polyester', 'viscose'])
        
        # Vary the price (±20%)
        price_variation = random.uniform(0.8, 1.2)
        new_product['price'] = max(20, int(new_product['price'] * price_variation))
        
        # Add some new tags
        new_tags = new_product['tags'].split(', ')
        style_additions = ['trendy', 'versatile', 'comfortable', 'stylish', 'fashionable']
        new_tags.extend(random.sample(style_additions, 1))
        new_product['tags'] = ', '.join(new_tags)
        
        augmented.append(new_product)
    
    return augmented

def main():
    """Main function to ingest products and create CSV."""
    # Get the project root (assuming this script is in server/util/)
    project_root = Path(__file__).parent.parent.parent
    public_dir = project_root / "public"
    server_data_dir = project_root / "server" / "data"
    
    # Create data directory if it doesn't exist
    server_data_dir.mkdir(parents=True, exist_ok=True)
    
    # Scan for products
    print("Scanning Products_for_prototype directory...")
    products = scan_products_directory(str(public_dir))
    print(f"Found {len(products)} products")
    
    # Augment with synthetic products to reach 80-100 items
    target_count = 80
    if len(products) < target_count:
        needed = target_count - len(products)
        print(f"Augmenting with {needed} synthetic products...")
        augmented = augment_products(products, needed)
        products.extend(augmented)
        print(f"Total products: {len(products)}")
    
    # Write to CSV
    csv_path = server_data_dir / "products.csv"
    fieldnames = ['product_id', 'title', 'description', 'tags', 'color', 'material', 'sizes', 'price', 'image_path']
    
    with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(products)
    
    print(f"Products written to {csv_path}")
    print(f"Total products: {len(products)}")
    
    # Print sample products
    print("\nSample products:")
    for i, product in enumerate(products[:3]):
        print(f"{i+1}. {product['title']} - ${product['price']} ({product['color']} {product['material']})")

if __name__ == "__main__":
    main()
