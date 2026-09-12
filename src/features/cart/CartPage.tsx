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
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-heading">Authentication Required</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Your allocation order buffer is encrypted and linked to your secure ShopHub customer profile.
        </p>
        <div className="pt-2">
          <Button onClick={() => navigate('/login?redirect=/cart')} size="lg" variant="primary">
            Sign In with Credentials
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <h1 className="text-3xl font-bold text-white font-heading">Order Buffer</h1>
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-8 text-center text-xs font-mono text-cyan-400">
          SYNCHRONIZING ORDER BUFFER WITH REPOSITORY TELEMETRY...
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-heading">Allocation Buffer Empty</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Explore our certified range of apparatus, robotic subsystems, and precision components.
        </p>
        <div className="pt-2">
          <Link to="/products">
            <Button size="lg" variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Explore Hardware Grid
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">ORDER TELEMETRY</span>
        </div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-white">
          Hardware Order Buffer
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1">
          {itemCount} {itemCount === 1 ? 'UNIT' : 'UNITS'} READY FOR ALLOCATION CHECKOUT
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table/List */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="overflow-hidden border-white/[0.08] bg-slate-900/60 backdrop-blur-md">
            <CardContent className="p-0 divide-y divide-white/[0.06]">
              {cart.items.map((item) => (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-[#0c121c] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-cyan-500/40" />
                    )}
                  </div>

                  {/* Title & Unit Price */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product_id}`}
                      className="text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors line-clamp-2"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Unit: {formatCurrency(item.unit_price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/10 rounded-xl bg-slate-950/60">
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
                        className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-white min-w-8 text-center">
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
                        className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-24">
                      <span className="text-sm font-mono font-bold text-white block">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={isRemoving}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
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
            <Link to="/products" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              RETURN TO HARDWARE REPOSITORY
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24 border-white/[0.08] bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider pb-3 border-b border-white/[0.08]">
                Settlement Estimation
              </h3>

              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Hardware Subtotal ({itemCount})</span>
                  <span className="font-mono font-semibold text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch Calculation</span>
                  <span className="text-slate-500 font-mono">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Regulatory GST</span>
                  <span className="text-slate-500 font-mono">Standard DRF rate</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-between items-baseline">
                <span className="text-xs font-mono text-slate-300">Estimated Settlement</span>
                <span className="text-xl font-mono font-extrabold text-cyan-300">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                size="lg"
                variant="primary"
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
