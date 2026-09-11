import { axiosClient } from '../axiosClient';
import type {
  LoginPayload,
  LoginResponse,
  PasswordChangePayload,
  PasswordResetConfirmPayload,
  PasswordResetPayload,
  RegisterPayload,
  TokenRefreshResponse,
  User,
} from '../../types';

export const authApi = {
  register: async (payload: RegisterPayload): Promise<User> => {
    const response = await axiosClient.post<User>('/auth/register/', payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/auth/login/', payload);
    return response.data;
  },

  logout: async (refresh: string): Promise<void> => {
    await axiosClient.post('/auth/logout/', { refresh });
  },

  getMe: async (): Promise<User> => {
    const response = await axiosClient.get<User>('/auth/me/');
    return response.data;
  },

  updateMe: async (payload: Partial<Pick<User, 'email' | 'first_name' | 'last_name'>>): Promise<User> => {
    const response = await axiosClient.patch<User>('/auth/me/', payload);
    return response.data;
  },

  changePassword: async (payload: PasswordChangePayload): Promise<void> => {
    await axiosClient.post('/auth/password/change/', payload);
  },

  requestPasswordReset: async (payload: PasswordResetPayload): Promise<void> => {
    await axiosClient.post('/auth/password/reset/', payload);
  },

  confirmPasswordReset: async (payload: PasswordResetConfirmPayload): Promise<void> => {
    await axiosClient.post('/auth/password/reset/confirm/', payload);
  },

  refreshToken: async (refresh: string): Promise<TokenRefreshResponse> => {
    const response = await axiosClient.post<TokenRefreshResponse>('/token/refresh/', { refresh });
    return response.data;
  },
};
