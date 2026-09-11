import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useCart } from './useCart';
import { formatCurrency } from '../../lib/formatCurrency';
import { Button } from '../../components/ui/Button';

export const CartDrawer: React.FC = () => {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { cart, itemCount, subtotal, updateQuantity, removeItem, isUpdating, isRemoving } = useCart();
  const navigate = useNavigate();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDrawer();
    };
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-semibold text-slate-900">Your Cart</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {itemCount}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Sign in to view your cart</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">
              Your cart is synced with your ShopHub customer account.
            </p>
            <Button
              onClick={() => {
                closeCartDrawer();
                navigate('/login');
              }}
              fullWidth
            >
              Sign In to Continue
            </Button>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Your cart is empty</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">
              Browse our catalog of genuine machinery, tools, and technical equipment.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                closeCartDrawer();
                navigate('/products');
              }}
            >
              Explore Products
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {cart.items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/products/${item.product_id}`}
                      onClick={closeCartDrawer}
                      className="text-sm font-medium text-slate-900 hover:text-slate-700 line-clamp-2"
                    >
                      {item.product_name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={isRemoving}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 -mr-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatCurrency(item.unit_price)} each
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeItem(item.id);
                          } else {
                            updateQuantity({
                              id: item.id,
                              payload: { quantity: item.quantity - 1 },
                            });
                          }
                        }}
                        disabled={isUpdating}
                        className="p-1 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-slate-800 min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateQuantity({
                            id: item.id,
                            payload: { quantity: item.quantity + 1 },
                          });
                        }}
                        disabled={isUpdating}
                        className="p-1 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer */}
        {isAuthenticated && cart && cart.items.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Shipping & taxes calculated at checkout.
            </p>

            <div className="space-y-2">
              <Button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/checkout');
                }}
                fullWidth
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  closeCartDrawer();
                  navigate('/cart');
                }}
                fullWidth
                size="sm"
              >
                View Full Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
