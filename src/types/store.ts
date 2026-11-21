export type ArtworkPreset =
  | 'phone'
  | 'headphones'
  | 'smartwatch'
  | 'laptop'
  | 'earbuds'
  | 'powerbank'
  | 'generic';

export interface Product {
  id: string;
  title: string;
  category: string;
  retailer: string;
  price: string;
  description: string;
  url: string;
  imageUrl: string;
  artworkPreset?: ArtworkPreset;
  featuredTag?: string;
}

export interface StoreSettings {
  ownerName: string;
  storeName: string;
  whatsappNumber: string;
  adminPassword: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export type AdminTab = 'products' | 'categories' | 'settings';
