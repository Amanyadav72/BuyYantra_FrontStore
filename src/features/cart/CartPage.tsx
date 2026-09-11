import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCart } from './useCart';
import { formatCurrency } from '../../lib/formatCurrency';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cart, itemCount, subtotal, isLoading, updateQuantity, removeItem, isUpdating, isRemoving } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Sign In to View Your Cart</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Your shopping cart is tied securely to your ShopHub customer account.
        </p>
        <div className="pt-2">
          <Button onClick={() => navigate('/login?redirect=/cart')} size="lg">
            Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 font-heading">Shopping Cart</h1>
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading your items...
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore our wide range of machinery, industrial apparatus, and components.
        </p>
        <div className="pt-2">
          <Link to="/products">
            <Button size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">
          Shopping Cart
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table/List */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  {/* Title & Unit Price */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product_id}`}
                      className="text-base font-semibold text-slate-900 hover:text-slate-700 transition-colors line-clamp-2"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1">
                      Unit Price: {formatCurrency(item.unit_price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
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
                        className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 min-w-8 text-center">
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
                        className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-24">
                      <span className="text-base font-bold text-slate-900 block">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={isRemoving}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Link to="/products" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-heading pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Cart Items ({itemCount})</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimation</span>
                  <span className="text-slate-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST)</span>
                  <span className="text-slate-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-slate-900">Estimated Subtotal</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
