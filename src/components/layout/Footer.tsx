import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 mt-20 pb-16 md:pb-0">
      {/* Value props */}
      <div className="border-b border-slate-800 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-amber-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Fast Shipping</h4>
                <p className="text-xs text-slate-400">Safe dispatched industrial transit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">100% Genuine</h4>
                <p className="text-xs text-slate-400">Directly cataloged machinery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-amber-400">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Verified Stock</h4>
                <p className="text-xs text-slate-400">Live inventory synchronized</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-amber-400">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Dedicated Support</h4>
                <p className="text-xs text-slate-400">Customer assistance helpline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-amber-400">
                <Cpu className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight font-heading">
                Buy<span className="text-amber-500">Yantra</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer-facing e-commerce storefront for ShopHub API. Browse precision tools, industrial equipment, and mechanical instruments.
            </p>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Shop</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?ordering=-created_at" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products?ordering=price" className="hover:text-white transition-colors">
                  Budget Friendly
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/account/addresses" className="hover:text-white transition-colors">
                  Shipping Addresses
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture / Notes */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">System Contract</h4>
            <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/60 text-[11px] space-y-1.5">
              <p className="text-slate-300 font-medium">Django REST Framework</p>
              <p className="text-slate-400">
                API Base:{' '}
                <code className="text-amber-300 font-mono text-[10px]">
                  {import.meta.env.VITE_API_BASE_URL || '/api/v1'}
                </code>
              </p>
              <p className="text-slate-400">Token rotation & silent 401 refresh active.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BuyYantra Storefront. Powered by ShopHub API.</p>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <span className="text-[11px]">Staff product management enabled</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-emerald-400">System Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
