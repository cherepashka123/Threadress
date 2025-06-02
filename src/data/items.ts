// src/data/items.ts

export type Item = {
  id: number;
  name: string;
  price: number;
  image: string;      // path under /public/products/
  storeName: string;  // e.g. “SoHo Denim Co.”
  latitude: number;   // store’s latitude
  longitude: number;  // store’s longitude
  rating?: number;    // optional 1–5 star rating
};

export const items: Item[] = [
  {
    id: 1,
    name: 'Denim Jacket',
    price: 120,
    image: '/products/jean jacket.webp',
    storeName: 'SoHo Denim Co.',
    latitude: 40.7240,    // approximate SoHo coordinates
    longitude: -73.9973,
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Silk Scarf',
    price: 45,
    image: '/products/silk_scarf.webp',
    storeName: 'East Village Scarves',
    latitude: 40.7267,    // approximate East Village coordinates
    longitude: -73.9845,
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Corduroy Pants',
    price: 80,
    image: '/products/corduroy_pants.avif',
    storeName: 'West Village Threads',
    latitude: 40.7359,    // approximate West Village coordinates
    longitude: -74.0031,
    rating: 4.0,
  },
];
