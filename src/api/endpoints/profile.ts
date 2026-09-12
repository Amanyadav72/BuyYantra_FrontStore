import { axiosClient } from '../axiosClient';
import type {
  CustomerProfile,
  ProfileUpdatePayload,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from '../../types';

export const profileApi = {
  getProfile: async (): Promise<CustomerProfile> => {
    try {
      const response = await axiosClient.get<CustomerProfile>('/profile/');
      return response.data;
    } catch {
      try {
        const fallback = await axiosClient.get<CustomerProfile>('/auth/profile/');
        return fallback.data;
      } catch {
        const me = await axiosClient.get<CustomerProfile>('/auth/me/');
        return me.data;
      }
    }
  },

  updateProfile: async (payload: ProfileUpdatePayload): Promise<CustomerProfile> => {
    try {
      const response = await axiosClient.patch<CustomerProfile>('/profile/', payload);
      return response.data;
    } catch (err) {
      try {
        const fallback = await axiosClient.patch<CustomerProfile>('/auth/profile/', payload);
        return fallback.data;
      } catch {
        throw err;
      }
    }
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    try {
      const response = await axiosClient.post<ChangePasswordResponse>(
        '/profile/change-password/',
        payload
      );
      return response.data;
    } catch (err) {
      try {
        const fallback = await axiosClient.post<ChangePasswordResponse>(
          '/auth/password/change/',
          payload
        );
        return fallback.data || { detail: 'Password updated successfully' };
      } catch {
        throw err;
      }
    }
  },
};
