
export type Role = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  isVerified: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  calories?: string; 
  options?: ProductOption[];
}

export interface ProductOption {
  name: string;
  choices: { label: string; priceMod: number }[];
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
  note: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending_payment' | 'verifying' | 'paid' | 'preparing' | 'delivered' | 'completed' | 'cancelled';
  paymentMethod: 'bank' | 'promptpay';
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  pickupTime?: string;
  date: string;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    code?: string;
    active: boolean;
}

export const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'chicken', label: 'ไก่ทอด' },
  { id: 'burger', label: 'เบอร์เกอร์/ข้าว' },
  { id: 'snack', label: 'ของทานเล่น' },
  { id: 'dessert', label: 'ของหวาน' },
  { id: 'drink', label: 'เครื่องดื่ม' },
];
