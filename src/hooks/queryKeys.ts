import type { ProductQueryParams } from '../types';

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (params?: ProductQueryParams) => ['products', 'list', params ?? {}] as const,
    detail: (id: number | string) => ['products', 'detail', String(id)] as const,
    categories: ['products', 'categories'] as const,
  },
  cart: {
    root: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (number: string) => ['orders', 'detail', number] as const,
  },
  addresses: {
    all: ['addresses'] as const,
    detail: (id: number) => ['addresses', 'detail', id] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
  profile: {
    root: ['profile'] as const,
  },
};
