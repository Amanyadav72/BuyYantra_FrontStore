import { create } from 'zustand';

interface UIState {
  isCartDrawerOpen: boolean;
  theme: 'light' | 'dark';
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartDrawerOpen: false,
  theme: 'light',
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  setTheme: (theme) => set({ theme }),
}));
