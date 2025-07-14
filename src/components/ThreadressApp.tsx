'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import OnboardingFlow from './threadress/OnboardingFlow';
import SmartSearch from './threadress/SmartSearch';
import FilterPanel from './threadress/FilterPanel';
import ResultsDisplay from './threadress/ResultsDisplay';
import ReservationFlow from './threadress/ReservationFlow';
import ExplorePage from './threadress/ExplorePage';
import { User, Product, Filters, Reservation } from './threadress/types';
import { FaChevronDown } from 'react-icons/fa';
import MinimalButton from './MinimalButton';

const BOUTIQUE_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'Atelier Nouveau': { lat: 40.724, lng: -74.001 }, // SoHo
  'Brooklyn Vintage Co.': { lat: 40.714, lng: -73.961 }, // Williamsburg
  'Madison Couture': { lat: 40.773, lng: -73.963 }, // Upper East Side
  'Village Thread': { lat: 40.735, lng: -74.003 }, // West Village
  'Tribeca Moderne': { lat: 40.719, lng: -74.008 }, // Tribeca
};

function getDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  // Haversine formula
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const ThreadressApp: React.FC = () => {
  const searchParams = useSearchParams();

  // App State Management
  const [currentStep, setCurrentStep] = useState<
    'onboarding' | 'search' | 'results' | 'reservation' | 'explore' | 'square'
  >('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    location: '',
    budget: { min: 0, max: 1000 },
    style: [],
    size: '',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recommended');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortOptions = [
    'Recommended',
    'Price: Low to High',
    'Price: High to Low',
    'Newest',
  ];
  const categories = [
    'Accessories',
    'Bags',
    'Dresses',
    'Tops',
    'Bottoms',
    'Outerwear',
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const [landingStep, setLandingStep] = useState<'landing' | 'quiz' | 'main'>(
    'landing'
  );

  // Sizing quiz state
  const [sizing, setSizing] = useState({
    top: '',
    bottom: '',
    shoe: '',
    fit: '',
  });

  // Product detail modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [reservationStep, setReservationStep] = useState<
    'options' | 'confirmed' | 'prepay' | null
  >(null);
  const [reservationType, setReservationType] = useState<
    'hold' | 'prepay' | null
  >(null);
  const [reservationCountdown, setReservationCountdown] = useState<number>(
    4 * 60 * 60
  ); // 4 hours in seconds

  // Move allProducts state and useEffect here, after prototypeProducts and mockBoutiques are defined
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [squareItems, setSquareItems] = useState<any[]>([]);
  const [squareLocations, setSquareLocations] = useState<any[]>([]);
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

  const [modalReservationStep, setModalReservationStep] = useState<
    null | 'hold' | 'prepay'
  >(null);
  const [syncStatus, setSyncStatus] = useState<
    'idle' | 'syncing' | 'success' | 'error'
  >('idle');

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (
      !userLocation &&
      typeof window !== 'undefined' &&
      'geolocation' in navigator
    ) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [userLocation]);

  useEffect(() => {
    setAllProducts(
      prototypeProducts.map((product: any, index: number) => ({
        id: `product-${index}`,
        name: product.name,
        price: product.price,
        boutique: mockBoutiques[index % mockBoutiques.length].name,
        boutiqueLocation: mockBoutiques[index % mockBoutiques.length].location,
        boutiqueStyle: mockBoutiques[index % mockBoutiques.length].style,
        boutiqueRating: mockBoutiques[index % mockBoutiques.length].rating,
        imageUrl: product.imageUrl,
        matchScore: Math.floor(Math.random() * 20) + 80,
        inStock: true,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Navy'],
        tags: [product.style.toLowerCase(), product.category.toLowerCase()],
        category: product.category,
        style: product.style,
      }))
    );
  }, []);

  // In useEffect, trigger geolocation request when landingStep === 'main' and currentStep === 'search'
  useEffect(() => {
    if (
      landingStep === 'main' &&
      currentStep === 'search' &&
      !userLocation &&
      typeof window !== 'undefined' &&
      'geolocation' in navigator
    ) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => {
          // Optionally, show a notification or fallback here
          console.warn('Location access denied or unavailable', err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [landingStep, currentStep, userLocation]);

  // Handle URL parameters on component mount
  useEffect(() => {
    const search = searchParams.get('search');
    const route = searchParams.get('route');

    if (search) {
      setSearchQuery(search);
      setLandingStep('main');
      setCurrentStep('search');
      // Trigger search after a short delay to ensure component is ready
      setTimeout(() => {
        handleSearch(search, filters);
      }, 100);
    }

    if (route) {
      const routeIds = route
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

      if (routeIds.length > 0) {
        // Find products from the route
        const routeProducts = allProducts.filter((product) =>
          routeIds.includes(product.id)
        );
        if (routeProducts.length > 0) {
          setProducts(routeProducts);
          setLandingStep('main');
          setCurrentStep('results');
          setSearchQuery('Shopping Route');
        }
      }
    }
  }, [searchParams]);

  // Skip onboarding and go straight to search
  const handleSkipOnboarding = () => {
    setCurrentStep('search');
  };

  // Complete onboarding with user preferences
  const handleCompleteOnboarding = (userData: User) => {
    setUser(userData);
    setCurrentStep('search');
  };

  // Helper: category and mood keywords
  const CATEGORY_KEYWORDS = [
    'dress',
    'dresses',
    'top',
    'tops',
    'skirt',
    'skirts',
    'pants',
    'jeans',
    'jacket',
    'jackets',
    'coat',
    'coats',
    'shorts',
    'outerwear',
    'bikini',
    'swimsuit',
    'shoes',
    'heels',
    'sandals',
    'bag',
    'bags',
    'accessory',
    'accessories',
    'blouse',
    'shirt',
    'shirts',
    'clutch',
    'sneakers',
    'boots',
    'scarf',
    'earrings',
    'belt',
    'wallet',
    'hat',
    'sunglasses',
  ];
  const MOOD_KEYWORDS = [
    'outfit',
    'outfits',
    'look',
    'looks',
    'going out',
    'date',
    'party',
    'work',
    'casual',
    'vacation',
    'beach',
    'brunch',
    'wedding',
    'event',
    'night',
    'day',
    'summer',
    'winter',
    'spring',
    'fall',
    'holiday',
    'travel',
    'weekend',
    'evening',
    'formal',
    'cocktail',
    'festival',
    'street',
    'chic',
    'minimal',
    'classic',
    'romantic',
    'edgy',
    'bohemian',
    'luxury',
    'sporty',
    'vintage',
    'contemporary',
    'preppy',
    'grunge',
    'streetwear',
  ];

  function getCategoryFromQuery(query: string): string | null {
    const q = query.toLowerCase();
    for (const cat of CATEGORY_KEYWORDS) {
      if (q.includes(cat)) {
        // Normalize plural
        if (cat.endsWith('s'))
          return cat.slice(0, -1).charAt(0).toUpperCase() + cat.slice(1, -1);
        return cat.charAt(0).toUpperCase() + cat.slice(1);
      }
    }
    return null;
  }
  function isMoodQuery(query: string): boolean {
    const q = query.toLowerCase();
    return MOOD_KEYWORDS.some((mood) => q.includes(mood));
  }

  // Perform smart search with AI-style matching simulation
  const handleSearch = async (query: string, appliedFilters: Filters) => {
    setIsLoading(true);
    setSearchQuery(query);
    setFilters(appliedFilters);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock results based on query and filters
    const results = generateMockResults(query, appliedFilters);

    // If we have Square data, enhance results with real inventory
    if (squareItems.length > 0) {
      const squareEnhancedResults = results.map((product, index) => {
        const squareItem = squareItems[index % squareItems.length];
        if (squareItem) {
          const variation = squareItem.item_data.variations[0];
          return {
            ...product,
            id: squareItem.id,
            price: variation.item_variation_data.price_money.amount / 100,
            description:
              squareItem.item_data.description || product.description,
            // Add Square-specific data
            squareItemId: squareItem.id,
            squareVariationId: variation.id,
          };
        }
        return product;
      });
      setProducts(squareEnhancedResults);
    } else {
      setProducts(results);
    }

    setCurrentStep('results');
    setIsLoading(false);
  };

  // Handle product selection for reservation
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    setModalReservationStep(null);
    setCurrentStep('reservation');
  };

  // Complete reservation
  const handleCompleteReservation = async (reservationData: Reservation) => {
    setReservation(reservationData);

    // Sync inventory change to Square when reservation is made
    if (selectedProduct && selectedProduct.squareItemId) {
      setSyncStatus('syncing');
      try {
        // Adjust inventory in Square (reduce by 1 for the reservation)
        const inventoryAdjustment = {
          idempotencyKey: `reservation-${Date.now()}`,
          changes: [
            {
              type: 'ADJUSTMENT',
              adjustment: {
                locationId: squareLocations[0]?.id,
                catalogObjectId:
                  selectedProduct.squareVariationId ||
                  selectedProduct.squareItemId,
                quantity: '1',
                occurredAt: new Date().toISOString(),
                fromState: 'IN_STOCK',
                toState: 'RESERVED',
                note: `Reserved by ${reservationData.customerName || 'Threadress user'}`,
              },
            },
          ],
        };

        const inventoryResponse = await fetch('/api/square/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inventoryAdjustment),
        });

        const inventoryResult = await inventoryResponse.json();

        if (inventoryResult.success) {
          console.log('✅ Inventory synced to Square for reservation');
          setSyncStatus('success');
          // Reset sync status after 3 seconds
          setTimeout(() => setSyncStatus('idle'), 3000);
        } else {
          console.warn(
            '⚠️ Failed to sync inventory to Square:',
            inventoryResult
          );
          setSyncStatus('error');
          setTimeout(() => setSyncStatus('idle'), 3000);
        }
      } catch (error) {
        console.error('❌ Error syncing inventory to Square:', error);
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    }

    // If we have Square data, create a real order
    if (
      selectedProduct &&
      selectedProduct.squareItemId &&
      squareLocations.length > 0
    ) {
      try {
        // Create customer first
        const customerData = {
          idempotency_key: `customer-${Date.now()}`,
          given_name: reservationData.customerName?.split(' ')[0] || 'Test',
          family_name:
            reservationData.customerName?.split(' ').slice(1).join(' ') ||
            'Customer',
          email_address: reservationData.email,
          phone_number: reservationData.phone,
          address: {
            address_line_1: '123 Test St',
            locality: 'New York',
            administrative_district_level_1: 'NY',
            postal_code: '10001',
            country: 'US',
          },
        };

        const customerResponse = await fetch('/api/square/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData),
        });

        const customerResult = await customerResponse.json();

        if (customerResult.success) {
          // Create order for pickup
          const orderData = {
            order: {
              location_id: squareLocations[0].id,
              line_items: [
                {
                  quantity: '1',
                  catalog_object_id:
                    selectedProduct.squareVariationId ||
                    selectedProduct.squareItemId,
                  base_price_money: {
                    amount: selectedProduct.price * 100,
                    currency: 'USD',
                  },
                },
              ],
            },
            idempotency_key: `order-${Date.now()}`,
          };

          const orderResponse = await fetch('/api/square/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
          });

          const orderResult = await orderResponse.json();

          if (orderResult.success) {
            console.log('Square order created successfully:', orderResult.data);
            // You could also create a payment here if it's a prepay reservation
          } else {
            console.error('Failed to create Square order:', orderResult);
          }
        } else {
          console.error('Failed to create Square customer:', customerResult);
        }
      } catch (error) {
        console.error('Error creating Square order:', error);
      }
    }

    setCurrentStep('reservation');
  };

  // Navigate to explore page
  const handleExplore = () => {
    setCurrentStep('explore');
  };

  // Back navigation
  const handleBack = () => {
    if (currentStep === 'results') setCurrentStep('search');
    if (currentStep === 'reservation') setCurrentStep('results');
    if (currentStep === 'explore') setCurrentStep('search');
  };

  // Generate mock search results
  const generateMockResults = (query: string, filters: Filters): Product[] => {
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    const categoryFromQuery = getCategoryFromQuery(query);
    const moodQuery = isMoodQuery(query);

    let filteredProducts = prototypeProducts.filter((product) => {
      const productName = product.name.toLowerCase();
      const productCategory = product.category.toLowerCase();
      const productStyle = product.style.toLowerCase();
      // Mood query: show all items that match any word
      if (moodQuery) {
        return searchTerms.some(
          (term) =>
            productName.includes(term) ||
            productCategory.includes(term) ||
            productStyle.includes(term)
        );
      }
      // Category query: only show items in that category
      if (categoryFromQuery) {
        return (
          productCategory.includes(categoryFromQuery.toLowerCase()) ||
          productName.includes(categoryFromQuery.toLowerCase())
        );
      }
      // Fuzzy match as fallback
      return searchTerms.some(
        (term) =>
          productName.includes(term) ||
          productCategory.includes(term) ||
          productStyle.includes(term)
      );
    });

    // Filter by category if set
    const categoryFilter = filters.category ?? [];
    if (
      (Array.isArray(categoryFilter) && categoryFilter.length > 0) ||
      typeof categoryFilter === 'string'
    ) {
      if (Array.isArray(categoryFilter)) {
        filteredProducts = filteredProducts.filter((product) =>
          categoryFilter.includes(product.category)
        );
      } else if (typeof categoryFilter === 'string') {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === categoryFilter
        );
      }
    }

    // If no products match the search query, return all products (as Product[])
    if (filteredProducts.length === 0) {
      return prototypeProducts
        .map((product, index) => {
          const boutique = mockBoutiques[index % mockBoutiques.length];
          return {
            id: `product-${index}`,
            name: product.name,
            price: product.price,
            boutique: boutique.name,
            boutiqueLocation: boutique.location,
            boutiqueStyle: boutique.style,
            boutiqueRating: boutique.rating,
            imageUrl: product.imageUrl,
            matchScore: Math.floor(Math.random() * 20) + 80, // 80-100% match
            inStock: true,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Black', 'White', 'Navy'],
            tags: [product.style.toLowerCase(), product.category.toLowerCase()],
            category: product.category,
          };
        })
        .filter(
          (product) =>
            product.price >= filters.budget.min &&
            product.price <= filters.budget.max
        );
    }

    // Map products to the required format and assign to boutiques
    return filteredProducts
      .map((product, index) => {
        const boutique = mockBoutiques[index % mockBoutiques.length];
        return {
          id: `product-${index}`,
          name: product.name,
          price: product.price,
          boutique: boutique.name,
          boutiqueLocation: boutique.location,
          boutiqueStyle: boutique.style,
          boutiqueRating: boutique.rating,
          imageUrl: product.imageUrl,
          matchScore: Math.floor(Math.random() * 20) + 80, // 80-100% match
          inStock: true,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Black', 'White', 'Navy'],
          tags: [product.style.toLowerCase(), product.category.toLowerCase()],
          category: product.category,
        };
      })
      .filter(
        (product) =>
          product.price >= filters.budget.min &&
          product.price <= filters.budget.max
      );
  };

  // Close sort dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    if (sortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen]);

  // Sizing quiz handler
  const handleSizingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sizing', JSON.stringify(sizing));
    setLandingStep('main');
    setCurrentStep('search');
  };

  // Countdown timer for reservation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (reservationStep === 'confirmed' && reservationCountdown > 0) {
      timer = setInterval(() => {
        setReservationCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [reservationStep, reservationCountdown]);

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // When using the filter panel (multi-select), ensure filters.category is always an array
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters({
      ...newFilters,
      category: Array.isArray(newFilters.category)
        ? newFilters.category
        : newFilters.category
          ? [newFilters.category]
          : [],
    });
    // Immediately update results when filters change
    handleSearch(searchQuery, {
      ...newFilters,
      category: Array.isArray(newFilters.category)
        ? newFilters.category
        : newFilters.category
          ? [newFilters.category]
          : [],
    });
  };

  // Helper to get complementary products for a given product
  function getComplementaryProducts(
    product: Product,
    allProducts: Product[]
  ): Product[] {
    // Curated pairs for unique, aesthetic matches
    const curatedPairs: Record<string, string[]> = {
      'Green Maxi Dress': [
        'Green Clutch Bag',
        'White Gold Heels',
        'White Sunglasses',
      ],
      'Red Maxi Embellished Dress': ['Brown Clutch', 'Flower Earrings'],
      'Grey Maxi Dress': ['Sandals', 'Flower Bag'],
      'Maxi Strapless Dress': ['Flower Bag', 'Sandals'],
      'Denim Dress': ['Brown Clutch', 'White Sunglasses'],
      'Maxi Dress': ['Ballet Flats', 'Printed Scarf'],
      'White Ballerina Dress': ['Ballet Flats', 'Flower Earrings'],
      'Embellished Mini Dress': ['White Gold Heels', 'Oval Black Sunglasses'],
      'Zigzag Pattern Dress': ['Leather Sandals', 'Bird Belt'],
      'Black & Gold Bikini Set': ['Beach Bag', 'Colorful Bucket Hat'],
      'White Swimsuit': ['Beach Bag', 'White Sunglasses'],
      'One Piece Swimsuit': ['Beach Bag', 'Colorful Bucket Hat'],
      'Jean Leather Jacket': ['Black Top', 'Cutout Jeans'],
      'Yellow Set Jacket': ['Yellow Set Belted Shorts', 'Ballet Flats'],
      'Lace Blouse': ['Brown Leather Skirt', 'Ballet Flats'],
      'Mesh Top': ['Cutout Jeans', 'Oval Black Sunglasses'],
      'White Strapless Top': ['Beige Pants', 'White Gold Heels'],
      'Black Top': ['Brown Leather Skirt', 'Bracelet Black White'],
      'Knitted Top': ['Wide Boyfriend Jeans', 'Leather Sandals'],
      'Polo Beige Shirt': ['Beige Pants', 'Ballet Flats'],
      'Brown Set Top': ['Brown Set Shorts', 'Jelly Sandals'],
      'Gold Mini Skirt': ['Black Top', 'White Gold Heels'],
      'Brown Leather Skirt': ['Black Top', 'Leather Sandals'],
      'Cutout Jeans': ['Mesh Top', 'Oval Black Sunglasses'],
      'Heart Jeans': ['Lace Blouse', 'Ballet Flats'],
      'Wide Boyfriend Jeans': ['Knitted Top', 'Leather Sandals'],
      'Wideleg Jeans': ['Black Top', 'Open Toe Sandals'],
      'Rose Pants': ['Black Top', 'Ballet Flats'],
      'Beige Pants': ['White Strapless Top', 'Ballet Flats'],
      'Yellow Set Belted Shorts': ['Yellow Set Jacket', 'Jelly Sandals'],
      'Print Sarong Skirt': ['Fruit Shoulder Bag', 'Colorful Bucket Hat'],
      'Jean Flowy Shorts': ['Brown Set Top', 'Jelly Sandals'],
      'Rose Beach Bag': ['White Swimsuit', 'Colorful Bucket Hat'],
      'Fruit Shoulder Bag': ['Print Sarong Skirt', 'Colorful Bucket Hat'],
      'Beach Bag': ['One Piece Swimsuit', 'Colorful Bucket Hat'],
      'Flower Bag': ['Maxi Strapless Dress', 'Flower Earrings'],
      'Green Clutch Bag': ['Green Maxi Dress', 'White Gold Heels'],
      'Brown Clutch': ['Red Maxi Embellished Dress', 'Flower Earrings'],
      'Leather Card Holder': ['Black Top', 'Bracelet Black White'],
      'Beige Leather Wallet': ['Beige Pants', 'Bracelet Black White'],
      'Flower Earrings': ['White Ballerina Dress', 'Flower Bag'],
      'White Sunglasses': ['Green Maxi Dress', 'Denim Dress'],
      'Oval Black Sunglasses': ['Mesh Top', 'Cutout Jeans'],
      'Colorful Bucket Hat': ['Beach Bag', 'Fruit Shoulder Bag'],
      'Bird Belt': ['Zigzag Pattern Dress', 'Bohemian items'],
      'Printed Scarf': ['Maxi Dress', 'Romantic items'],
      'Bracelet Black White': ['Black Top', 'Minimalist items'],
      'White Gold Heels': ['Green Maxi Dress', 'Luxury items'],
      'Ballet Flats': ['Maxi Dress', 'Classic items'],
      'Leather Sandals': ['Jean Leather Jacket', 'Classic items'],
      'Open Toe Sandals': ['Wideleg Jeans', 'Classic items'],
      'Jelly Sandals': ['Beach items', 'Casual items'],
      Sandals: ['Grey Maxi Dress', 'Classic items'],
      'Silver Leather Mules Heels': ['Luxury items', 'Evening items'],
    };

    const matches = curatedPairs[product.name] || [];
    let complementary: Product[] = [];

    if (matches.length > 0) {
      complementary = allProducts.filter((p) => matches.includes(p.name));
    } else {
      // Fallback: find items from complementary categories
      const complementaryCategories: Record<string, string[]> = {
        Dresses: ['Shoes', 'Bags', 'Accessories'],
        Tops: ['Bottoms', 'Accessories'],
        Bottoms: ['Tops', 'Shoes', 'Accessories'],
        Outerwear: ['Tops', 'Bottoms', 'Accessories'],
        Shoes: ['Dresses', 'Bottoms', 'Accessories'],
        Bags: ['Dresses', 'Outerwear', 'Accessories'],
        Accessories: ['Dresses', 'Tops', 'Bottoms'],
        Swimwear: ['Bags', 'Accessories', 'Shoes'],
      };

      const targetCategories = complementaryCategories[
        product.category || ''
      ] || ['Accessories', 'Bags', 'Shoes'];

      complementary = allProducts
        .filter(
          (p) =>
            p.name !== product.name &&
            targetCategories.includes(p.category || '') &&
            (p.style === product.style ||
              ['Accessories', 'Bags', 'Shoes'].includes(p.category || ''))
        )
        .slice(0, 3);
    }

    // Ensure uniqueness and limit to 3 items
    return complementary
      .filter(
        (item, idx, arr) => arr.findIndex((i) => i.name === item.name) === idx
      )
      .slice(0, 3);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Landing Step */}
      {landingStep === 'landing' && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
          <div className="max-w-md w-full mx-auto flex flex-col items-center">
            <h1
              className="text-5xl md:text-6xl font-light text-neutral-900 mb-6 text-center font-serif"
              style={{
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '-0.02em',
              }}
            >
              Welcome to Threadress
            </h1>
            <p
              className="text-xl text-neutral-600 mb-10 text-center font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Discover and reserve unique fashion pieces at local boutiques.
            </p>
            <div className="flex flex-col gap-4 w-full">
              <MinimalButton
                className="w-full py-4 text-lg font-semibold"
                onClick={() => {
                  setLandingStep('main');
                  setCurrentStep('search');
                }}
              >
                Start Search
              </MinimalButton>
              <MinimalButton
                className="w-full py-4 text-lg font-semibold"
                onClick={() => setLandingStep('quiz')}
              >
                Take Optional Sizing Quiz
              </MinimalButton>
              <MinimalButton
                className="w-full py-2 text-base text-neutral-500 underline hover:text-neutral-700 bg-transparent border-none mt-2"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  border: 'none',
                  background: 'transparent',
                }}
                onClick={() => {
                  setLandingStep('main');
                  setCurrentStep('search');
                }}
              >
                Skip
              </MinimalButton>
            </div>
          </div>
        </div>
      )}

      {/* Sizing Quiz Step */}
      {landingStep === 'quiz' && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
          <div className="max-w-md w-full mx-auto flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Sizing Quiz (Optional)
            </h2>
            <form
              onSubmit={handleSizingSubmit}
              className="bg-white p-8 rounded-xl shadow-md w-full flex flex-col gap-4"
            >
              <label className="flex flex-col gap-1">
                <span className="font-medium">Top Size</span>
                <select
                  value={sizing.top}
                  onChange={(e) =>
                    setSizing({ ...sizing, top: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-4 py-2"
                  required
                >
                  <option value="">Select</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-medium">
                  Bottom Size (numeric or XS–XL)
                </span>
                <input
                  type="text"
                  value={sizing.bottom}
                  onChange={(e) =>
                    setSizing({ ...sizing, bottom: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-medium">Shoe Size (optional)</span>
                <input
                  type="text"
                  value={sizing.shoe || ''}
                  onChange={(e) =>
                    setSizing({ ...sizing, shoe: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-4 py-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-medium">Preferred Fit</span>
                <select
                  value={sizing.fit || ''}
                  onChange={(e) =>
                    setSizing({ ...sizing, fit: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-4 py-2"
                  required
                >
                  <option value="">Select</option>
                  <option value="fitted">Fitted</option>
                  <option value="loose">Loose</option>
                </select>
              </label>
              <MinimalButton
                type="submit"
                className="w-full py-3 mt-4 text-lg font-semibold"
              >
                Save & Continue
              </MinimalButton>
              <MinimalButton
                type="button"
                className="w-full py-2 text-base text-gray-500 underline hover:text-gray-700 bg-transparent border-none"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  border: 'none',
                  background: 'transparent',
                }}
                onClick={() => {
                  setLandingStep('main');
                  setCurrentStep('search');
                }}
              >
                Skip
              </MinimalButton>
            </form>
          </div>
        </div>
      )}

      {/* Main UI */}
      {landingStep === 'main' && (
        <div className="min-h-screen bg-white">
          {/* Clean Header */}
          <div className="bg-white border-b border-gray-200 sticky top-[64px] sm:top-[72px] md:top-[88px] z-40">
            <div className="max-w-screen-2xl mx-auto px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Threadress
                    </h1>
                    <p className="text-sm text-gray-500">Fashion Discovery</p>
                  </div>
                  {/* Square Sync Status */}
                  {/* {syncStatus !== 'idle' && (
                    <div className="flex items-center space-x-2">
                      {syncStatus === 'syncing' && (
                        <>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-600">
                            Syncing to Square...
                          </span>
                        </>
                      )}
                      {syncStatus === 'success' && (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600">
                            Synced to Square
                          </span>
                        </>
                      )}
                      {syncStatus === 'error' && (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-xs text-red-600">
                            Sync Failed
                          </span>
                        </>
                      )}
                    </div>
                  )} */}
                </div>
                {currentStep !== 'onboarding' && (
                  <div className="flex items-center space-x-3">
                    {currentStep !== 'search' && (
                      <button
                        onClick={handleBack}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-normal"
                      >
                        ← Back
                      </button>
                    )}
                    <button
                      onClick={handleExplore}
                      className="px-4 py-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-normal"
                    >
                      Explore
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 1. Add geolocation notification/banner */}
          {landingStep === 'main' &&
            currentStep === 'search' &&
            !userLocation && (
              <div className="w-full bg-neutral-100 text-black text-center py-2 px-4 font-serif text-sm">
                Location access is required to show distances to boutiques.
                Please enable location in your browser for the best experience.
              </div>
            )}

          <main className="max-w-screen-2xl mx-auto px-8 py-10">
            {currentStep === 'search' && (
              <SmartSearch
                user={user}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            )}

            {currentStep === 'results' && (
              <div className="space-y-10 relative">
                {/* Top Bar with Filters, Categories, Sort */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="flex gap-3 flex-wrap items-center">
                    <button
                      className="border border-gray-300 rounded-md px-5 py-2 bg-white text-gray-900 font-normal flex items-center gap-2 text-base"
                      onClick={() => setIsFilterOpen(true)}
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="inline-block"
                      >
                        <path d="M3 6h14M3 12h14M3 18h14" />
                      </svg>
                      All Filters
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`border border-gray-300 rounded-md px-5 py-2 bg-white text-gray-900 font-normal text-base ${selectedCategory === cat ? 'bg-gray-900 text-white border-gray-900' : ''}`}
                        onClick={() => {
                          setSelectedCategory(
                            cat === selectedCategory ? null : cat
                          );
                          // Trigger a new search with the selected category as a filter (single-select)
                          handleSearch(searchQuery, {
                            ...filters,
                            category: cat === selectedCategory ? [] : [cat],
                          });
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {/* Modern Sort By Dropdown */}
                  <div className="relative" ref={sortRef}>
                    <button
                      className="flex items-center gap-2 text-gray-900 font-medium text-base focus:outline-none px-2 py-1"
                      onClick={() => setSortDropdownOpen((open) => !open)}
                    >
                      Sort by
                      <FaChevronDown
                        className={`ml-1 text-gray-500 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {sortDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {sortOptions.map((option) => (
                          <button
                            key={option}
                            className={`block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100 ${sortBy === option ? 'font-semibold' : ''}`}
                            onClick={() => {
                              setSortBy(option);
                              setSortDropdownOpen(false);
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Results Grid */}
                <ResultsDisplay
                  products={products.filter(
                    (p) =>
                      (!selectedCategory || p.category === selectedCategory) &&
                      (!filters.category ||
                        filters.category.length === 0 ||
                        filters.category.includes(p.category || ''))
                  )}
                  allProducts={allProducts}
                  searchQuery={searchQuery}
                  onSelectProduct={(product) => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                    setReservationStep(null);
                    setReservationType(null);
                    setReservationCountdown(4 * 60 * 60);
                  }}
                  userLocation={userLocation}
                  boutiqueLocations={BOUTIQUE_LOCATIONS}
                  getDistanceMiles={getDistanceMiles}
                />

                {/* Slide-over Filter Panel and Overlay (always render grid, overlay just dims) */}
                {isFilterOpen && (
                  <>
                    {/* Overlay */}
                    <div
                      className="fixed inset-0 bg-white/70 backdrop-blur-sm transition-opacity z-40"
                      onClick={() => setIsFilterOpen(false)}
                      style={{ pointerEvents: 'auto' }}
                    />
                    {/* Drawer */}
                    <div
                      className="fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-2xl z-50 transition-transform animate-slideInLeft"
                      style={{ minHeight: '100vh' }}
                    >
                      <FilterPanel
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onSearch={() => {
                          setIsFilterOpen(false);
                          handleSearch(searchQuery, filters);
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Product Detail Modal */}
                {showProductModal && selectedProduct && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-0 relative flex flex-col md:flex-row overflow-y-auto max-h-[90vh]">
                      {/* Close button */}
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-2xl z-10"
                        onClick={() => {
                          setShowProductModal(false);
                          setReservationStep(null);
                          setReservationType(null);
                          setReservationCountdown(4 * 60 * 60);
                          setModalReservationStep(null);
                        }}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      {/* Product Image Left */}
                      <div className="w-full md:w-2/5 flex items-center justify-center bg-white p-8 md:p-10 min-w-[280px] max-w-[480px]">
                        <img
                          src={selectedProduct.imageUrl}
                          alt={selectedProduct.name}
                          className="object-contain max-h-[60vh] w-full rounded-lg"
                        />
                      </div>
                      {/* Info & Reservation Right */}
                      <div className="w-full md:w-3/5 flex flex-col justify-start p-6 md:p-10 min-w-[320px] max-w-full overflow-y-auto">
                        {/* Show only options and Complete Your Look until an option is picked */}
                        {!modalReservationStep && (
                          <>
                            <div className="space-y-4 mb-8">
                              <button
                                className="w-full py-3 bg-gray-900 text-white rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setModalReservationStep('hold')}
                              >
                                Reserve without prepayment (hold for 4 hours,
                                pay in store)
                              </button>
                              <button
                                className="w-full py-3 bg-white border border-gray-900 text-gray-900 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
                                onClick={() =>
                                  setModalReservationStep('prepay')
                                }
                              >
                                Prepay to guarantee hold for longer (with perks)
                              </button>
                            </div>
                            {/* Complete Your Look section (only with options) */}
                            {getComplementaryProducts(
                              selectedProduct,
                              allProducts
                            ).length > 0 && (
                              <div className="mb-10">
                                <h3
                                  className="text-xs font-semibold tracking-widest text-gray-700 mb-4 text-center"
                                  style={{ letterSpacing: '0.1em' }}
                                >
                                  COMPLETE YOUR LOOK
                                </h3>
                                <div className="flex flex-row gap-8 overflow-x-auto pb-2 justify-center">
                                  {getComplementaryProducts(
                                    selectedProduct,
                                    allProducts
                                  ).map((item) => (
                                    <div
                                      key={item.id}
                                      className="min-w-[140px] max-w-[180px] flex-shrink-0 flex flex-col items-center cursor-pointer"
                                    >
                                      <div className="w-full flex justify-center items-center aspect-[3/4] bg-white mb-2">
                                        <img
                                          src={item.imageUrl}
                                          alt={item.name}
                                          className="object-contain max-h-32 max-w-full rounded-lg"
                                        />
                                      </div>
                                      <div className="w-full text-center">
                                        <div className="text-xs text-gray-400 mb-1">
                                          {item.boutique}
                                        </div>
                                        <div className="text-gray-900 text-xs mb-1 line-clamp-2">
                                          {item.name}
                                        </div>
                                        <div className="text-gray-900 text-sm font-medium">
                                          ${item.price}
                                        </div>
                                        <div className="text-xs text-green-700 mt-1">
                                          Available in your size in store.
                                        </div>
                                        {userLocation &&
                                          BOUTIQUE_LOCATIONS &&
                                          getDistanceMiles &&
                                          BOUTIQUE_LOCATIONS[item.boutique] && (
                                            <div className="text-xs text-gray-500 mt-1">
                                              {getDistanceMiles(
                                                userLocation.lat,
                                                userLocation.lng,
                                                BOUTIQUE_LOCATIONS[
                                                  item.boutique
                                                ].lat,
                                                BOUTIQUE_LOCATIONS[
                                                  item.boutique
                                                ].lng
                                              ).toFixed(1)}{' '}
                                              miles away
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {/* After option is picked, show only the reservation flow (form, then QR) */}
                        {modalReservationStep && (
                          <ReservationFlow
                            product={selectedProduct}
                            user={user}
                            allProducts={allProducts}
                            onComplete={handleCompleteReservation}
                            onBack={() => {
                              setShowProductModal(false);
                              setModalReservationStep(null);
                              setCurrentStep('results');
                            }}
                            reservationType={modalReservationStep}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'reservation' && selectedProduct && (
              <ReservationFlow
                product={selectedProduct}
                user={user}
                allProducts={allProducts}
                onComplete={handleCompleteReservation}
                onBack={handleBack}
              />
            )}

            {currentStep === 'explore' && (
              <ExplorePage
                user={user}
                allProducts={allProducts}
                onSelectProduct={handleSelectProduct}
                onNavigateToSearch={() => setCurrentStep('search')}
              />
            )}

            {/* Remove Square API Demo button from landing page */}
            {/* {currentStep === 'square' && <SquareDemo />} */}
          </main>

          {/* Minimal Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
                <div className="w-8 h-8 mx-auto mb-4">
                  <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full"></div>
                </div>
                <p className="text-gray-900 font-medium">
                  Searching boutiques...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Finding your matches
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreadressApp;
