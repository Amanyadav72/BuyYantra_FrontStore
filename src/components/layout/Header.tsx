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
  Cpu,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useCart } from '../../features/cart/useCart';
import { authApi } from '../../api/endpoints/auth';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth, getRefreshToken } = useAuthStore();
  const { openCartDrawer } = useUIStore();
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-400 shadow-sm transition-transform group-hover:scale-105">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                Buy<span className="text-amber-600">Yantra</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Precision Equipment
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/products" className="hover:text-slate-900 transition-colors">
              All Products
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="hover:text-slate-900 transition-colors">
                  My Orders
                </Link>
                <Link to="/account" className="hover:text-slate-900 transition-colors">
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
              placeholder="Search machinery, tools, components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-slate-50/80 px-4 py-2 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </form>
        </div>

        {/* Right: Actions (Cart & User) */}
        <div className="flex items-center gap-3">
          {/* Search Trigger for tablet/mobile */}
          <Link
            to="/products"
            className="p-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open cart drawer"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[11px] font-bold text-amber-400">
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
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-2 pr-3 text-xs font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold">
                  {user?.first_name ? user.first_name[0].toUpperCase() : user?.username?.[0].toUpperCase() || 'U'}
                </div>
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
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-30 animate-in fade-in-50">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">
                        {user?.first_name ? `${user.first_name} ${user?.last_name || ''}`.trim() : user?.username}
                      </p>
                      {user?.email && (
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      )}
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      Account Profile
                    </Link>

                    <Link
                      to="/account/addresses"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Saved Addresses
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Package className="h-4 w-4 text-slate-400" />
                      Order History
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
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
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 pl-10 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </form>

          <nav className="flex flex-col gap-2 font-medium text-sm text-slate-700">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Browse Catalog
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  My Orders
                </Link>
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  Account Profile
                </Link>
                <Link
                  to="/account/addresses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  Saved Addresses
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50"
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
