import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';

interface UIState {
  isCartDrawerOpen: boolean;
  theme: ThemeMode;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('buyyantra_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }
  return 'dark';
};

const applyThemeToDOM = (theme: ThemeMode) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('buyyantra_theme', theme);
    } catch {
      // Ignore localStorage errors
    }
  }
};

const initialTheme = getInitialTheme();
if (typeof document !== 'undefined') {
  applyThemeToDOM(initialTheme);
}

export const useUIStore = create<UIState>((set) => ({
  isCartDrawerOpen: false,
  theme: initialTheme,
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  setTheme: (theme) => {
    applyThemeToDOM(theme);
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyThemeToDOM(nextTheme);
      return { theme: nextTheme };
    });
  },
}));

