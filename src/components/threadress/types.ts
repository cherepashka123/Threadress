// Types for the Threadress application

export interface User {
  id?: string;
  name?: string;
  email?: string;
  preferences: {
    style: string[];
    priceRange: { min: number; max: number };
    sizes: {
      top?: string;
      bottom?: string;
      dress?: string;
      shoe?: string;
    };
    measurements?: {
      height?: string;
      weight?: string;
    };
    favoriteColors?: string[];
    avoidColors?: string[];
  };
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  boutique: string;
  boutiqueLocation: string;
  boutiqueStyle: string;
  boutiqueRating: number;
  imageUrl: string;
  matchScore: number;
  inStock: boolean;
  sizes: string[];
  colors: string[];
  tags: string[];
  category?: string;
  style?: string;
  material?: string;
  care?: string[];
}

export interface Boutique {
  id: string;
  name: string;
  location: string;
  neighborhood: string;
  style: string;
  rating: number;
  address: string;
  phone?: string;
  website?: string;
  instagram?: string;
  hours: {
    [key: string]: string; // day: hours
  };
  specialties: string[];
  priceRange: 'budget' | 'mid' | 'luxury';
}

export interface Filters {
  location: string;
  budget: { min: number; max: number };
  style: string[];
  size: string;
  category?: string[];
  color?: string[];
  boutique?: string[];
  priceRange?: 'budget' | 'mid' | 'luxury';
}

export interface Reservation {
  id: string;
  product: Product;
  user: User;
  boutique: Boutique;
  pickupTime: Date;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  qrCode: string;
  confirmationNumber: string;
  createdAt: Date;
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  searchTime: number;
  query: string;
  appliedFilters: Filters;
}

export interface StyleProfile {
  primary: string;
  secondary?: string;
  keywords: string[];
  inspiration: string[];
}

export interface OnboardingData {
  step: number;
  completed: boolean;
  preferences: Partial<User['preferences']>;
}
