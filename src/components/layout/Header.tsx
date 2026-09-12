import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  LogOut,
  MapPin,
  Package,
  Menu,
  X,
  Smartphone,
  Sun,
  Moon,
  Laptop,
  Tv,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useCart } from '../../features/cart/useCart';
import { authApi } from '../../api/endpoints/auth';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth, getRefreshToken } = useAuthStore();
  const { openCartDrawer, theme, toggleTheme } = useUIStore();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const refresh = getRefreshToken();
      if (refresh) {
        await authApi.logout(refresh);
      }
    } catch {
      // Ignore logout errors
    } finally {
      clearAuth();
      setIsUserMenuOpen(false);
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--header-bg)] backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all group-hover:scale-105 group-hover:border-cyan-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] font-heading">
                  Buy<span className="text-cyan-500">Yantra</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              </div>
              <span className="hidden sm:block text-[9px] uppercase font-mono tracking-widest text-cyan-600 dark:text-cyan-400/80">
                Electronics Superstore
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[var(--text-secondary)]">
            <Link
              to="/products"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              All Electronics
            </Link>
            <Link
              to="/products"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors hidden lg:flex items-center gap-1"
            >
              <Laptop className="w-3.5 h-3.5 opacity-70" />
              <span>Phones & Laptops</span>
            </Link>
            <Link
              to="/products"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors hidden xl:flex items-center gap-1"
            >
              <Tv className="w-3.5 h-3.5 opacity-70" />
              <span>Appliances & PC Parts</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  My Orders
                </Link>
                <Link to="/account" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Account
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden lg:block flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search smartphones, laptops, RTX GPUs, appliances, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 px-4 py-2 pl-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-xs"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          </form>
        </div>

        {/* Right: Actions (Theme, Cart & User) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-[var(--text-secondary)] hover:text-cyan-500 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to Light theme (Paper Grain)' : 'Switch to Dark theme (Cyberpunk Cyan)'}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>

          {/* Search Trigger for mobile */}
          <Link
            to="/products"
            className="p-2 text-[var(--text-secondary)] hover:text-cyan-500 lg:hidden rounded-lg hover:bg-[var(--bg-subtle)]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative p-2 text-[var(--text-secondary)] hover:text-cyan-500 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            aria-label="Open cart drawer"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1 text-[11px] font-bold text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1 pl-1.5 pr-3 text-xs font-semibold text-[var(--text-primary)] hover:border-cyan-500/50 transition-all cursor-pointer shadow-xs"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.first_name || user.username}
                    className="h-6 w-6 rounded-full object-cover border border-cyan-500/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-slate-950 text-[11px] font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                    {user?.first_name ? user.first_name[0].toUpperCase() : user?.username?.[0].toUpperCase() || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline-block max-w-24 truncate">
                  {user?.first_name || user?.username}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-solid)] py-1.5 shadow-2xl z-30 animate-in fade-in-50 backdrop-blur-xl">
                    <div className="px-3.5 py-2 border-b border-[var(--border-subtle)]">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">
                        {user?.first_name ? `${user.first_name} ${user?.last_name || ''}`.trim() : user?.username}
                      </p>
                      {user?.email && (
                        <p className="text-[11px] text-[var(--text-secondary)] truncate">{user.email}</p>
                      )}
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-cyan-500 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-cyan-500" />
                      Account & Profile
                    </Link>

                    <Link
                      to="/account/addresses"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-cyan-500 transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-cyan-500" />
                      Saved Delivery Addresses
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-cyan-500 transition-colors"
                    >
                      <Package className="h-4 w-4 text-cyan-500" />
                      Order History
                    </Link>

                    <div className="border-t border-[var(--border-subtle)] my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_12px_rgba(6,182,212,0.35)] hover:shadow-[0_0_18px_rgba(6,182,212,0.5)]"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-subtle)]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-card-solid)] px-4 py-4 md:hidden animate-in slide-in-from-top-2 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search phones, laptops, parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 px-4 py-2 pl-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-xs"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          </form>

          <nav className="flex flex-col gap-1.5 font-medium text-sm text-[var(--text-primary)]">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[var(--bg-subtle)] hover:text-cyan-500"
            >
              All Electronics
            </Link>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-subtle)] my-1">
              <span className="text-xs text-[var(--text-secondary)]">Theme Mode</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'Dark (Cyan)' : 'Light (Paper)'}</span>
              </button>
            </div>
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[var(--bg-subtle)] hover:text-cyan-500"
                >
                  My Orders
                </Link>
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[var(--bg-subtle)] hover:text-cyan-500"
                >
                  Account Profile
                </Link>
                <Link
                  to="/account/addresses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[var(--bg-subtle)] hover:text-cyan-500"
                >
                  Saved Delivery Addresses
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[var(--bg-subtle)] hover:text-cyan-500"
              >
                Sign In / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
