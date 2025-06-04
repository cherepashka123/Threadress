// src/data/items.ts

export type Item = {
  id: number;
  name: string;
  price: number;
  image: string; // path under /public/products/
  storeName: string; // e.g. "SoHo Denim Co."
  latitude: number | null;
  longitude: number | null;
  category: 'dresses' | 'tops' | 'bottoms' | 'accessories';
  rating?: number; // optional 1–5 star rating
};

export const items: Item[] = [
  {
    id: 1,
    name: 'Denim Jacket',
    price: 120,
    image: '/products/jean jacket.webp',
    storeName: 'SoHo Denim Co.',
    latitude: 40.724, // approximate SoHo coordinates
    longitude: -73.9973,
    category: 'tops',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Silk Scarf',
    price: 45,
    image: '/products/silk_scarf.webp',
    storeName: 'East Village Scarves',
    latitude: 40.7267, // approximate East Village coordinates
    longitude: -73.9845,
    category: 'accessories',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Corduroy Pants',
    price: 80,
    image: '/products/corduroy_pants.avif',
    storeName: 'West Village Threads',
    latitude: 40.7359, // approximate West Village coordinates
    longitude: -74.0031,
    category: 'bottoms',
    rating: 4.0,
  },
  {
    id: 4,
    name: 'Crystal Bag',
    price: 175,
    image: '/products/Crystal_Bag.png',
    storeName: 'Maison de Luxe',
    latitude: 40.7466,
    longitude: -74.0012,
    category: 'accessories',
    rating: 4.8,
  },
  {
    id: 5,
    name: 'Tomatohead Hat',
    price: 35,
    image: '/products/Tomatohead_hat.png',
    storeName: 'Artisan & Vine',
    latitude: 40.7205,
    longitude: -73.987,
    category: 'accessories',
    rating: 4.3,
  },
  {
    id: 6,
    name: 'Gunmetal Necklace',
    price: 89,
    image: '/products/Gunmetal_necklace.png',
    storeName: 'Tribeca Jewelry',
    latitude: 40.7163,
    longitude: -74.0086,
    category: 'accessories',
    rating: 4.6,
  },
];
