export type CategoryId =
  | 'gadget'
  | 'audio'
  | 'homeware'
  | 'otomotif'
  | 'outdoor'
  | 'tools'
  | 'hobby'
  | 'toys';

export type Badge = 'sale' | 'new' | 'hot';

export interface Product {
  id: number;
  name: string;
  category: CategoryId;
  emoji: string;
  price: number;
  original?: number;
  rating: number;
  sold: number;
  badge?: Badge;
  stock: number;
  desc: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
}

export interface CartItem {
  id: number;
  qty: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  eta: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export interface OrderData {
  id: string;
  total: number;
  shipping: ShippingMethod;
  payment: PaymentMethod;
  itemCount: number;
  date: string;
}
