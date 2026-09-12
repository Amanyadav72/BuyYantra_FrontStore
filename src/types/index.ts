export type AddressType = 'HOME' | 'WORK' | 'OTHER';

export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
}

export interface RegisterPayload {
  username: string;
  email?: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface TokenRefreshResponse {
  access: string;
  refresh: string;
}

export interface PasswordChangePayload {
  old_password: string;
  new_password: string;
}

export interface PasswordResetPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
}

export interface CustomerProfile {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
  date_joined?: string;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
}

export type ChangePasswordPayload = PasswordChangePayload;
export interface ChangePasswordResponse {
  detail: string;
}

export interface Category {
  id: number;
  name: string;
}

export type ProductStatus = 'DR' | 'PB';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string | null;
  status: ProductStatus;
  categories: Category[];
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProductList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductQueryParams {
  search?: string;
  categories?: number[];
  min_price?: number;
  max_price?: number;
  min_stock?: number;
  max_stock?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  image: string | null;
  unit_price: string;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  updated_at: string;
}

export interface AddCartItemPayload {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface Address {
  id: number;
  label?: string;
  address_type?: AddressType;
  recipient_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressPayload {
  label?: string;
  address_type?: AddressType;
  recipient_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface ShippingAddressSnapshot {
  recipient_name?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  label?: string;
  address_type?: string;
  [key: string]: unknown;
}

export interface OrderItem {
  id: number;
  product: number;
  product_id?: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: string;
  shipping_cost?: string;
  tax?: string;
  total: string;
  shipping_address: ShippingAddressSnapshot;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CheckoutPayload {
  address_id: number;
}

export interface DRFValidationError {
  status?: string;
  status_code?: number;
  error_type?: string;
  errors?: Record<string, string[]>;
  detail?: string;
}
