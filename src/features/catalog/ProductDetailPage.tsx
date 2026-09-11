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
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Equipment Catalog
        </Link>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Product Image */}
        <div className="lg:col-span-6">
          <div className="sticky top-24 aspect-square rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs flex items-center justify-center">
            {product.image && !imageError ? (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain p-4"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Cpu className="w-16 h-16 mb-2 opacity-40 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">{product.name}</span>
                <span className="text-xs text-slate-400 mt-1">ShopHub Verified Apparatus</span>
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
                  <Badge variant="accent" size="sm">
                    {cat.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900 leading-tight">
            {product.name}
          </h1>

          {/* Price & Stock */}
          <div className="flex items-center gap-4 py-3 border-y border-slate-100">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatCurrency(product.price)}
            </span>

            <div>
              {isOutOfStock ? (
                <Badge variant="danger">Out of Stock</Badge>
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Description & Specifications
            </h3>
            <div className="prose prose-sm text-slate-700 max-w-none whitespace-pre-line leading-relaxed text-sm">
              {product.description || 'No detailed description provided by the distributor.'}
            </div>
          </div>

          {/* Quantity and Add to Cart Form */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-700 block">Quantity</span>
                <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm font-bold text-slate-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40"
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
                  fullWidth
                  leftIcon={<ShoppingBag className="w-5 h-5" />}
                  className="h-11"
                >
                  {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>

          {/* Meta Details Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Layers className="w-3.5 h-3.5" />
                Product Reference ID:
              </span>
              <span className="font-mono font-medium text-slate-800">#{product.id}</span>
            </div>

            {product.created_at && (
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Cataloged On:
                </span>
                <span className="text-slate-700">
                  {format(new Date(product.created_at), 'MMMM dd, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
