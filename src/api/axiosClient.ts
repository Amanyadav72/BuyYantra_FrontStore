import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { TokenRefreshResponse } from '../types';

/**
 * CORS Note:
 * The ShopHub Django REST Framework backend might not have `django-cors-headers` enabled by default.
 * If requests fail with CORS errors during local development, ensure `corsheaders` is installed and
 * configured in Django's settings.py, or route requests through the Vite dev server proxy configured
 * in vite.config.ts.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Refresh token concurrency queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Refresh on 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If no response or not a 401 error, reject immediately
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';
    // Prevent infinite loop on auth endpoints
    if (
      url.includes('/token/refresh/') ||
      url.includes('/auth/login/') ||
      url.includes('/auth/register/')
    ) {
      return Promise.reject(error);
    }

    // Don't retry a request that has already been retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = useAuthStore.getState().getRefreshToken();
    if (!refreshToken) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the ongoing refresh completes
      return new Promise<unknown>((resolve, reject) => {
        failedQueue.push({
          resolve: (newAccessToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            resolve(axiosClient(originalRequest));
          },
          reject: (err: unknown) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call token refresh using clean axios instance to avoid circular interceptor triggers
      const response = await axios.post<TokenRefreshResponse>(
        `${API_BASE_URL}/token/refresh/`,
        { refresh: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { access, refresh: newRefreshToken } = response.data;

      // Token rotation: update stored refresh token AND memory access token
      useAuthStore.getState().setAccessToken(access);
      if (newRefreshToken) {
        useAuthStore.getState().setRefreshToken(newRefreshToken);
      }

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access}`;
      }

      processQueue(null, access);
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();

      // Only redirect to login if not already on an auth page
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register') &&
        !window.location.pathname.startsWith('/forgot-password') &&
        !window.location.pathname.startsWith('/reset-password')
      ) {
        window.location.href = '/login?session_expired=1';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
