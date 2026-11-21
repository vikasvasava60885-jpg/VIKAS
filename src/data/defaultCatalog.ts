import { Product, StoreSettings } from '../types/store';

export const DEFAULT_CATEGORIES: string[] = [
  'Mobile',
  'Headphones',
  'Smartwatches',
  'Laptops',
  'Accessories',
];

export const DEFAULT_SETTINGS: StoreSettings = {
  ownerName: 'Vikas Vasava',
  storeName: 'VV STORE',
  whatsappNumber: '919999999999',
  adminPassword: 'vikas123',
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'vv-phone-01',
    title: 'Obsidian Pro 5G Flagship',
    category: 'Mobile',
    retailer: 'Amazon',
    price: '₹54,999',
    description:
      '120Hz AMOLED LTPO display, Snapdragon flagship chipset, and 50MP OIS triple camera array in a matte glass chassis.',
    url: 'https://www.amazon.in/s?k=5g+flagship+smartphone+black',
    imageUrl: '',
    artworkPreset: 'phone',
    featuredTag: 'Top Pick',
  },
  {
    id: 'vv-audio-02',
    title: 'Studio Reference ANC Headphones',
    category: 'Headphones',
    retailer: 'Flipkart',
    price: '₹14,990',
    description:
      'Hybrid 45dB active noise cancellation, 40mm custom acoustic drivers, and 60-hour USB-C fast-charge battery life.',
    url: 'https://www.flipkart.com/search?q=wireless+anc+headphones+black',
    imageUrl: '',
    artworkPreset: 'headphones',
  },
  {
    id: 'vv-watch-03',
    title: 'Titanium Chrono Smartwatch',
    category: 'Smartwatches',
    retailer: 'Amazon',
    price: '₹8,499',
    description:
      'Always-on monochrome AMOLED dial, dual-band GPS tracking, 5ATM water resistance, and 14-day endurance.',
    url: 'https://www.amazon.in/s?k=amoled+smartwatch+black',
    imageUrl: '',
    artworkPreset: 'smartwatch',
    featuredTag: 'Best Seller',
  },
  {
    id: 'vv-laptop-04',
    title: 'AirBook M-Series Ultrabook 14"',
    category: 'Laptops',
    retailer: 'Amazon',
    price: '₹89,990',
    description:
      'Anodized space-black unibody aluminum, 16GB unified memory, 512GB NVMe SSD, and silent fanless performance.',
    url: 'https://www.amazon.in/s?k=ultrabook+laptop+space+black',
    imageUrl: '',
    artworkPreset: 'laptop',
  },
  {
    id: 'vv-earbuds-05',
    title: 'Stealth Buds Pro TWS',
    category: 'Headphones',
    retailer: 'Flipkart',
    price: '₹3,299',
    description:
      'Low-latency gaming mode, quad-mic environmental noise reduction, IPX5 sweat shield, and wireless charging case.',
    url: 'https://www.flipkart.com/search?q=tws+earbuds+black',
    imageUrl: '',
    artworkPreset: 'earbuds',
  },
  {
    id: 'vv-acc-06',
    title: 'MagCore 10000mAh PD Power Bank',
    category: 'Accessories',
    retailer: 'Amazon',
    price: '₹2,199',
    description:
      'Snap-on magnetic wireless charging with 22.5W USB-C Power Delivery and braided 100W Type-C cable included.',
    url: 'https://www.amazon.in/s?k=magnetic+power+bank+black',
    imageUrl: '',
    artworkPreset: 'powerbank',
  },
];
