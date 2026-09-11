import { axiosClient } from '../axiosClient';
import type { CheckoutPayload, Order } from '../../types';

export const ordersApi = {
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get<Order[]>('/orders/');
    return response.data;
  },

  getOrder: async (number: string): Promise<Order> => {
    const response = await axiosClient.get<Order>(`/orders/${number}/`);
    return response.data;
  },

  getOrderByNumber: async (number: string): Promise<Order> => {
    const response = await axiosClient.get<Order>(`/orders/${number}/`);
    return response.data;
  },

  checkout: async (payload: CheckoutPayload): Promise<Order> => {
    const response = await axiosClient.post<Order>('/orders/checkout/', payload);
    return response.data;
  },
};
