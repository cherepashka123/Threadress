export interface Boutique {
  id: string;
  name: string;
  logo: string;
  location: {
    address: string;
    zip: string;
    neighborhood: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  description: string;
  specialties: string[];
  openingHours: {
    [key: string]: string;
  };
}

export const mockBoutiques: Boutique[] = [
  {
    id: 'sm1',
    name: 'Spring & Mercer',
    logo: 'https://source.unsplash.com/random/100x100/?boutique,logo',
    location: {
      address: '123 Spring Street',
      zip: '10012',
      neighborhood: 'SoHo',
      coordinates: {
        lat: 40.7225,
        lng: -74.003,
      },
    },
    description:
      'Contemporary womenswear with a focus on sustainable materials and timeless design.',
    specialties: ['Sustainable Fashion', 'Workwear', 'Evening Wear'],
    openingHours: {
      'Mon-Fri': '11:00 AM - 7:00 PM',
      Sat: '10:00 AM - 8:00 PM',
      Sun: '12:00 PM - 6:00 PM',
    },
  },
  {
    id: 'va1',
    name: 'Village Atelier',
    logo: 'https://source.unsplash.com/random/100x100/?fashion,logo',
    location: {
      address: '456 Bleecker Street',
      zip: '10014',
      neighborhood: 'West Village',
      coordinates: {
        lat: 40.7352,
        lng: -74.004,
      },
    },
    description:
      'Curated selection of emerging designers and avant-garde pieces.',
    specialties: ['Designer Collections', 'Accessories', 'Jewelry'],
    openingHours: {
      'Mon-Fri': '10:00 AM - 7:00 PM',
      Sat: '10:00 AM - 8:00 PM',
      Sun: '11:00 AM - 6:00 PM',
    },
  },
  {
    id: 'bg1',
    name: 'Bedford & Grove',
    logo: 'https://source.unsplash.com/random/100x100/?store,logo',
    location: {
      address: '789 Bedford Avenue',
      zip: '11249',
      neighborhood: 'Williamsburg',
      coordinates: {
        lat: 40.7193,
        lng: -73.956,
      },
    },
    description:
      "Brooklyn's destination for contemporary streetwear and local designers.",
    specialties: ['Streetwear', 'Denim', 'Local Designers'],
    openingHours: {
      'Mon-Fri': '12:00 PM - 8:00 PM',
      Sat: '11:00 AM - 9:00 PM',
      Sun: '11:00 AM - 7:00 PM',
    },
  },
];
