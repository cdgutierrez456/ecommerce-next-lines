export interface CartItem {
  id: string;
  quantity: number;
  product: Product
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
}