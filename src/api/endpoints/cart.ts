import { axiosClient } from '../axiosClient';
import type { AddCartItemPayload, Cart, UpdateCartItemPayload } from '../../types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await axiosClient.get<Cart>('/cart/');
    return response.data;
  },

  addCartItem: async (payload: AddCartItemPayload): Promise<Cart> => {
    const response = await axiosClient.post<Cart>('/cart/items/', payload);
    return response.data;
  },

  updateCartItem: async (id: number, payload: UpdateCartItemPayload): Promise<Cart> => {
    const response = await axiosClient.patch<Cart>(`/cart/items/${id}/`, payload);
    return response.data;
  },

  removeCartItem: async (id: number): Promise<void> => {
    await axiosClient.delete(`/cart/items/${id}/`);
  },
};
