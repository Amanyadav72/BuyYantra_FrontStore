import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { productsApi } from '../../api/endpoints/products';
import { queryKeys } from '../../hooks/queryKeys';
import { formatCurrency } from '../../lib/formatCurrency';
import { useCart } from '../cart/useCart';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem, isAdding } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.products.detail(id || ''),
    queryFn: () => productsApi.getProduct(id!),
    enabled: Boolean(id),
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your cart');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!product) return;

    if (product.stock <= 0) {
      toast.error('This product is currently out of stock.');
      return;
    }

    addItem(
      { product_id: product.id, quantity },
      {
        onSuccess: () => {
          setQuantity(1);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-9 w-4/5" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Product Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The requested technical equipment may be unpublished, archived, or no longer available in the ShopHub catalog.
        </p>
        <div className="pt-2">
          <Link to="/products">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <nav>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO ELECTRONICS CATALOG
        </Link>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Image */}
        <div className="lg:col-span-6">
          <div className="sticky top-24 aspect-square rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0c121c] overflow-hidden shadow-sm dark:shadow-2xl flex items-center justify-center relative group">
            <div className="absolute inset-0 tech-grid-cyan opacity-10 pointer-events-none" />
            {product.image && !imageError ? (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain p-6 relative z-10 transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center relative z-10">
                <Cpu className="w-16 h-16 mb-2 text-cyan-500/50" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{product.name}</span>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400/70 mt-1">BuyYantra Verified Electronics</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <Link key={cat.id} to={`/products?categories=${cat.id}`}>
                  <Badge variant="primary" size="sm">
                    {cat.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 dark:text-white leading-tight">
            {product.name}
          </h1>

          {/* Price & Stock */}
          <div className="flex items-center gap-4 py-4 border-y border-slate-200 dark:border-white/[0.08]">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {formatCurrency(product.price)}
            </span>

            <div>
              {isOutOfStock ? (
                <Badge variant="danger">Sold Out</Badge>
              ) : isLowStock ? (
                <Badge variant="warning">Only {product.stock} units remaining</Badge>
              ) : (
                <Badge variant="success">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  In Stock ({product.stock} available)
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Technical Specifications &amp; Overview
            </h3>
            <div className="prose prose-sm text-slate-700 dark:text-slate-300 max-w-none whitespace-pre-line leading-relaxed text-sm">
              {product.description || 'No detailed specifications filed in the system registry.'}
            </div>
          </div>

          {/* Quantity and Add to Cart Form */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08] space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 block">QUANTITY</span>
                <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900/80 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm font-bold font-mono text-slate-900 dark:text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 pt-5">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  isLoading={isAdding}
                  size="lg"
                  variant="primary"
                  fullWidth
                  leftIcon={<ShoppingBag className="w-5 h-5" />}
                  className="h-11"
                >
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>

          {/* Meta Details Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400 shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/[0.06]">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                SKU / Item ID:
              </span>
              <span className="font-mono font-medium text-cyan-700 dark:text-cyan-300">YNT-#{product.id}</span>
            </div>

            {product.created_at && (
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  Catalog Entry:
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">
                  {format(new Date(product.created_at), 'yyyy-MM-dd HH:mm')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
