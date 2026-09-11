import { axiosClient } from '../axiosClient';
import type { Address, AddressPayload } from '../../types';

export const addressesApi = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await axiosClient.get<Address[]>('/addresses/');
    return response.data;
  },

  getAddress: async (id: number): Promise<Address> => {
    const response = await axiosClient.get<Address>(`/addresses/${id}/`);
    return response.data;
  },

  createAddress: async (payload: AddressPayload): Promise<Address> => {
    const response = await axiosClient.post<Address>('/addresses/', payload);
    return response.data;
  },

  updateAddress: async (id: number, payload: Partial<AddressPayload>): Promise<Address> => {
    const response = await axiosClient.patch<Address>(`/addresses/${id}/`, payload);
    return response.data;
  },

  patchAddress: async (id: number, payload: Partial<AddressPayload>): Promise<Address> => {
    const response = await axiosClient.patch<Address>(`/addresses/${id}/`, payload);
    return response.data;
  },

  deleteAddress: async (id: number): Promise<void> => {
    await axiosClient.delete(`/addresses/${id}/`);
  },
};
