export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  boutiqueName: string;
  boutiqueId: string;
  location: {
    zip: string;
    neighborhood: string;
  };
  styleTags: string[];
  matchScore: number;
  fit: 'Cropped' | 'Oversized' | 'Slim' | 'Regular';
  style: 'Minimal' | 'Bold' | 'Classic' | 'Boho';
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Silk Wrap Dress',
    price: 280,
    imageUrl: 'https://source.unsplash.com/random/400x500/?silk,dress',
    boutiqueName: 'Spring & Mercer',
    boutiqueId: 'sm1',
    location: {
      zip: '10012',
      neighborhood: 'SoHo',
    },
    styleTags: ['elegant', 'feminine', 'silk'],
    matchScore: 95,
    fit: 'Regular',
    style: 'Classic',
  },
  {
    id: '2',
    name: 'Oversized Linen Blazer',
    price: 340,
    imageUrl: 'https://source.unsplash.com/random/400x500/?blazer',
    boutiqueName: 'Village Atelier',
    boutiqueId: 'va1',
    location: {
      zip: '10014',
      neighborhood: 'West Village',
    },
    styleTags: ['workwear', 'sustainable', 'linen'],
    matchScore: 88,
    fit: 'Oversized',
    style: 'Minimal',
  },
  {
    id: '3',
    name: 'Cropped Denim Jacket',
    price: 180,
    imageUrl: 'https://source.unsplash.com/random/400x500/?denim,jacket',
    boutiqueName: 'Bedford & Grove',
    boutiqueId: 'bg1',
    location: {
      zip: '11249',
      neighborhood: 'Williamsburg',
    },
    styleTags: ['casual', 'denim', 'streetwear'],
    matchScore: 92,
    fit: 'Cropped',
    style: 'Bold',
  },
  {
    id: '4',
    name: 'Floral Maxi Dress',
    price: 220,
    imageUrl: 'https://source.unsplash.com/random/400x500/?floral,dress',
    boutiqueName: 'Boheme Collection',
    boutiqueId: 'bc1',
    location: {
      zip: '11249',
      neighborhood: 'Williamsburg',
    },
    styleTags: ['boho', 'summer', 'floral'],
    matchScore: 85,
    fit: 'Regular',
    style: 'Boho',
  },
  {
    id: '5',
    name: 'Slim Fit Wool Pants',
    price: 160,
    imageUrl: 'https://source.unsplash.com/random/400x500/?wool,pants',
    boutiqueName: 'Spring & Mercer',
    boutiqueId: 'sm1',
    location: {
      zip: '10012',
      neighborhood: 'SoHo',
    },
    styleTags: ['workwear', 'wool', 'classic'],
    matchScore: 90,
    fit: 'Slim',
    style: 'Minimal',
  },
];

export const neighborhoods = ['SoHo', 'West Village', 'Williamsburg'];
export const fits = ['Cropped', 'Oversized', 'Slim', 'Regular'];
export const styles = ['Minimal', 'Bold', 'Classic', 'Boho'];
export const priceRanges = [
  { label: '$0-$100', min: 0, max: 100 },
  { label: '$100-$300', min: 100, max: 300 },
  { label: '$300+', min: 300, max: Infinity },
];
