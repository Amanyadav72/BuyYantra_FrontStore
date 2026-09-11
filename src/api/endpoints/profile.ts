import { axiosClient } from '../axiosClient';
import type {
  CustomerProfile,
  ProfileUpdatePayload,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from '../../types';

export const profileApi = {
  getProfile: async (): Promise<CustomerProfile> => {
    const response = await axiosClient.get<CustomerProfile>('/profile/');
    return response.data;
  },

  updateProfile: async (payload: ProfileUpdatePayload): Promise<CustomerProfile> => {
    const response = await axiosClient.patch<CustomerProfile>('/profile/', payload);
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    const response = await axiosClient.post<ChangePasswordResponse>(
      '/profile/change-password/',
      payload
    );
    return response.data;
  },
};
