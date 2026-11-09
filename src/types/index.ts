export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  salePrice: number | null;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  stock: number;
  sku: string;
  brand: string;
  rating: number;
  reviews: number;
  badge: 'Sale' | 'New Arrival' | 'Best Seller' | null;
}

export interface CartItem extends Product {
  quantity: number;
}