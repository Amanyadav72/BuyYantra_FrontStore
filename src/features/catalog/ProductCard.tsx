import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../../types';
import { formatCurrency } from '../../lib/formatCurrency';
import { useCart } from '../cart/useCart';
import { useAuthStore } from '../../stores/authStore';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem, isAdding } = useCart();
  const { isAuthenticated } = useAuthStore();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }

    if (product.stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    addItem(
      { product_id: product.id, quantity: 1 },
      {
        onSuccess: () => {
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 1500);
        },
      }
    );
  };

  return (
    <Card hoverEffect className="group flex flex-col h-full overflow-hidden border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/70 shadow-sm hover:shadow-md dark:shadow-none hover:border-cyan-500/60 transition-all duration-300">
      <Link to={`/products/${product.id}`} className="block relative aspect-square bg-slate-50 dark:bg-[#0c121c] overflow-hidden border-b border-slate-100 dark:border-white/[0.06]">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0c121c] text-slate-400 dark:text-slate-500 p-3 text-center">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 mb-1 text-cyan-500/40" />
            <span className="text-[10px] sm:text-[11px] font-mono text-cyan-600 dark:text-cyan-400/80">GENUINE ELECTRONICS</span>
          </div>
        )}

        {/* Stock Badge Overlay */}
        <div className="absolute top-2 right-2 scale-90 sm:scale-100 origin-top-right">
          {product.stock > 0 ? (
            product.stock <= 5 ? (
              <Badge variant="warning" size="sm">
                Only {product.stock} left
              </Badge>
            ) : (
              <Badge variant="success" size="sm">
                In Stock
              </Badge>
            )
          ) : (
            <Badge variant="danger" size="sm">
              Sold Out
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5 sm:mb-2">
            {product.categories.slice(0, 1).map((cat) => (
              <span
                key={cat.id}
                className="text-[9px] sm:text-[10px] font-mono font-medium text-cyan-700 dark:text-cyan-300 uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/25 px-1.5 sm:px-2 py-0.5 rounded"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link
          to={`/products/${product.id}`}
          className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 line-clamp-2 leading-snug transition-colors flex-1"
        >
          {product.name}
        </Link>

        {/* Price and Action */}
        <div className="mt-2.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between gap-1.5 sm:gap-2">
          <div>
            <span className="text-xs sm:text-base font-bold text-slate-900 dark:text-white font-mono tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding || product.stock <= 0}
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-500 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_14px_rgba(6,182,212,0.6)] disabled:opacity-30 disabled:cursor-not-allowed'
            }`}
            aria-label={justAdded ? 'Added to cart' : 'Add to cart'}
            title="Quick add to cart"
          >
            {justAdded ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>
    </Card>
  );
};
