import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { CartDrawer } from '../../features/cart/CartDrawer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};
