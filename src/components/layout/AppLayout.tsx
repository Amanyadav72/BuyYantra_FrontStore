import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { CartDrawer } from '../../features/cart/CartDrawer';
import { useUIStore } from '../../stores/uiStore';

export const AppLayout: React.FC = () => {
  const { theme } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 relative overflow-x-hidden transition-colors duration-200">
      {/* Subtle top ambient glow */}
      <div
        className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)] blur-2xl z-0 opacity-70"
        aria-hidden="true"
      />
      <Header />
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <Toaster position="top-right" richColors theme={theme} closeButton />
    </div>
  );
};

