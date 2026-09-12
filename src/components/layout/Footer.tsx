import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--footer-bg)] text-[var(--text-secondary)] mt-20 pb-16 md:pb-0 relative transition-colors">
      {/* Value props banner */}
      <div className="border-b border-[var(--border-subtle)] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-xs">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">Fast Tech Dispatch</h4>
                <p className="text-xs text-[var(--text-muted)]">Tamper-safe priority delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">100% Authentic</h4>
                <p className="text-xs text-[var(--text-muted)]">Brand warranty on all electronics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-xs">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">7-Day Replacement</h4>
                <p className="text-xs text-[var(--text-muted)]">Hassle-free return guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-xs">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">Expert Support</h4>
                <p className="text-xs text-[var(--text-muted)]">Dedicated tech assistance</p>
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
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-xs">
                <Smartphone className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-[var(--text-primary)] tracking-tight font-heading">
                Buy<span className="text-cyan-500">Yantra</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your premier electronics store for smartphones, laptops, PC parts, smart home appliances, and accessories with verified stock and genuine brand warranty.
            </p>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">Electronics</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  All Electronics
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Smartphones & Tablets
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Laptops & Computer Parts
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Appliances & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">Account & Orders</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/orders" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/account/addresses" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Delivery Addresses
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Profile & Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantee / Live Store Note */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">Live Store Telemetry</h4>
            <div className="rounded-xl bg-[var(--bg-card)] p-3.5 border border-[var(--border-subtle)] text-[11px] space-y-1.5 backdrop-blur-sm shadow-xs">
              <div className="flex items-center justify-between">
                <p className="text-[var(--text-primary)] font-medium">BuyYantra Verified Store</p>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[var(--text-muted)]">
                Secure DRF API Service Active
              </p>
              <p className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px]">100% Authentic Electronics • SSL 256-Bit</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} BuyYantra Electronics. All rights reserved.</p>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">AUTHENTIC ELECTRONICS ASSURED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
