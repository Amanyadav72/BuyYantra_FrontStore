import { create } from 'zustand';
import type { User } from '../types';

const REFRESH_TOKEN_KEY = 'buyyantra_refresh_token';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuth: (accessToken: string, refreshToken: string, user?: User | null) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
  setInitialized: (initialized: boolean) => void;
  getRefreshToken: () => string | null;
  setRefreshToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (accessToken: string, refreshToken: string, user?: User | null) => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch {
      // Ignore localStorage security errors
    }

    set((state) => ({
      accessToken,
      user: user !== undefined ? user : state.user,
      isAuthenticated: true,
      isInitialized: true,
    }));
  },

  setAccessToken: (accessToken: string) => {
    set({
      accessToken,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  updateUser: (user: User) => {
    set({ user });
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // Ignore
    }

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  setInitialized: (initialized: boolean) => {
    set({ isInitialized: initialized });
  },

  getRefreshToken: () => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken: (token: string) => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch {
      // Ignore
    }
  },
}));
