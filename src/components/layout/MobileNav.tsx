import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../../features/cart/useCart';
import { useAuthStore } from '../../stores/authStore';

export const MobileNav: React.FC = () => {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuthStore();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Shop', icon: Grid },
    { to: '/cart', label: 'Cart', icon: ShoppingBag, badge: itemCount },
    { to: isAuthenticated ? '/orders' : '/login', label: 'Orders', icon: Package },
    { to: isAuthenticated ? '/account' : '/login', label: 'Account', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#080b11]/90 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-14 py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[9px] font-bold text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
