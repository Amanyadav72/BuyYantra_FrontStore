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
    <Card hoverEffect className="group flex flex-col h-full overflow-hidden border-slate-200">
      <Link to={`/products/${product.id}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <ShoppingBag className="w-10 h-10 mb-1 opacity-50" />
            <span className="text-[11px] font-medium text-slate-500">BuyYantra Catalog</span>
          </div>
        )}

        {/* Stock Badge Overlay */}
        <div className="absolute top-2.5 right-2.5">
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
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4">
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link
          to={`/products/${product.id}`}
          className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 line-clamp-2 transition-colors flex-1"
        >
          {product.name}
        </Link>

        {/* Price and Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding || product.stock <= 0}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            aria-label={justAdded ? 'Added to cart' : 'Add to cart'}
            title="Quick add to cart"
          >
            {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Card>
  );
};
