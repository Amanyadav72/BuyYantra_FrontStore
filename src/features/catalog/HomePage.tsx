import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Wrench, Shield, Zap, Sparkles } from 'lucide-react';
import { productsApi } from '../../api/endpoints/products';
import { queryKeys } from '../../hooks/queryKeys';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import { useCategories } from './useCategories';
import { Button } from '../../components/ui/Button';

export const HomePage: React.FC = () => {
  const { data: latestProducts, isLoading } = useQuery({
    queryKey: queryKeys.products.list({ ordering: '-created_at', page_size: 8 }),
    queryFn: () => productsApi.getProducts({ ordering: '-created_at', page_size: 8 }),
  });

  const { data: categories } = useCategories();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>ShopHub DRF Storefront</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
                Engineered for <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Maximum Performance
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Explore BuyYantra’s curated catalog of industrial tools, precision apparatus, and verified technical equipment. Direct catalog sync with real-time stock allocation.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/products">
                  <Button
                    size="lg"
                    variant="accent"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Browse Entire Catalog
                  </Button>
                </Link>
                <Link to="/products?ordering=-created_at">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700 hover:border-slate-600"
                  >
                    New Additions
                  </Button>
                </Link>
              </div>

              {/* Quick Category Chips */}
              {categories && categories.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Popular Categories:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 5).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?categories=${cat.id}`}
                        className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-amber-400/20 hover:text-amber-300 hover:border-amber-400/30 border border-slate-700 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hero Graphic Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl bg-gradient-to-b from-slate-800 to-slate-800/60 p-6 border border-slate-700 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Live Inventory Feed</h3>
                      <p className="text-xs text-slate-400">Verified DRF Catalogue</p>
                    </div>
                  </div>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="py-5 space-y-3 text-left">
                  <div className="flex items-center justify-between text-xs text-slate-300 py-1.5 border-b border-slate-700/50">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-400" />
                      Instant Stock Check
                    </span>
                    <span className="font-mono font-semibold text-emerald-400">Real-Time</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 py-1.5 border-b border-slate-700/50">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-400" />
                      Quality Verified
                    </span>
                    <span className="font-mono font-semibold text-slate-200">ISO Standard</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 py-1.5">
                    <span className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-amber-400" />
                      Fast Order Processing
                    </span>
                    <span className="font-mono font-semibold text-slate-200">Automated</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/products" className="block text-center text-xs font-semibold text-amber-400 hover:text-amber-300">
                    View Verified Equipment →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Latest Products Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
              Featured & Latest Products
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Freshly published tools and mechanical components
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : !latestProducts || latestProducts.results.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <h3 className="text-base font-semibold text-slate-900 mb-1">No products found</h3>
            <p className="text-sm text-slate-500 mb-4">
              Products added via the Django admin will appear here automatically.
            </p>
            <Link to="/products">
              <Button variant="outline">Browse Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
