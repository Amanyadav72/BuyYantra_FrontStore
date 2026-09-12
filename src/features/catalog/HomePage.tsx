import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  Laptop,
  Headphones,
  Cpu,
  Tv,
  PackageCheck,
  Flame,
} from 'lucide-react';
import { productsApi } from '../../api/endpoints/products';
import { queryKeys } from '../../hooks/queryKeys';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import { useCategories } from './useCategories';
import { Button } from '../../components/ui/Button';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: latestProducts, isLoading } = useQuery({
    queryKey: queryKeys.products.list({
      ordering: '-created_at',
      page_size: 8,
      categories: selectedCategory ? [selectedCategory] : undefined,
    }),
    queryFn: () =>
      productsApi.getProducts({
        ordering: '-created_at',
        page_size: 8,
        categories: selectedCategory ? [selectedCategory] : undefined,
      }),
  });

  const { data: categories } = useCategories();

  return (
    <div className="space-y-16 py-6">
      {/* Bento Grid Hero Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Bento Cell 1: Main Flagship Electronics Showcase (Span 8) */}
          <div className="lg:col-span-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-10 relative overflow-hidden backdrop-blur-xl group hover:border-cyan-500/40 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col justify-between">
            {/* Subtle background tech grid */}
            <div className="absolute inset-0 tech-grid-cyan opacity-15 pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-300 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                <span>PREMIER TECH E-COMMERCE // LIVE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight text-[var(--text-primary)]">
                Next-Gen Electronics &amp; <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-300">
                  Smart Tech Gadgets
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Discover flagship smartphones, high-performance laptops, custom PC parts, smart appliances, and audio gear with genuine brand warranties and rapid delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/products">
                  <Button
                    size="lg"
                    variant="primary"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Explore Electronics
                  </Button>
                </Link>
                <Link to="/products?ordering=-created_at">
                  <Button
                    size="lg"
                    variant="outline"
                  >
                    Latest Arrivals
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bottom highlights line */}
            <div className="relative z-10 mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-secondary)] font-mono">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-500" />
                <span>EXPRESS DISPATCH &lt;24H</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span>100% BRAND WARRANTY</span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span>7-DAY HASSLE-FREE REPLACEMENT</span>
              </div>
            </div>
          </div>

          {/* Bento Cell 2: Verified Electronics Guarantee (Span 4) */}
          <div className="lg:col-span-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 relative overflow-hidden backdrop-blur-xl group hover:border-cyan-500/40 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                    <Flame className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Store Guarantee</h3>
                    <p className="text-sm font-bold text-[var(--text-primary)] font-heading">BuyYantra Assured</p>
                  </div>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </div>

              <div className="py-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-secondary)]">Stock Accuracy</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">100% Real-Time</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-secondary)]">Authenticity</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">OEM Certified</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-secondary)]">Secure Checkout</span>
                  <span className="text-cyan-600 dark:text-cyan-300 font-bold">256-Bit SSL</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1.5">
                <span>Customer Satisfaction Index</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">99.4% POSITIVE</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full w-[98%]" />
              </div>
            </div>
          </div>

          {/* Bento Cell 3: Rapid Access Electronics Categories (Span 12) */}
          <div className="lg:col-span-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-500" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                  Shop By Category
                </h3>
              </div>
              <Link
                to="/products"
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 transition-colors"
              >
                <span>View Full Electronics Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedCategory === null
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-xs text-[var(--text-primary)] ring-1 ring-cyan-500/30'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Smartphone className="w-4 h-4 text-cyan-500" />
                  <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400/80 uppercase">All</span>
                </div>
                <p className="text-xs font-bold truncate">All Electronics</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Complete Store</p>
              </button>

              {categories && categories.length > 0 ? (
                categories.slice(0, 5).map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-xs text-[var(--text-primary)] ring-1 ring-cyan-500/30'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Cpu className="w-4 h-4 text-cyan-500" />
                        <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400/80 uppercase">HOT</span>
                      </div>
                      <p className="text-xs font-bold truncate">{cat.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Verified Stock</p>
                    </button>
                  );
                })
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)] text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Smartphone className="w-4 h-4 text-cyan-500" />
                      <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400/80 uppercase">PHONES</span>
                    </div>
                    <p className="text-xs font-bold truncate">Phones &amp; Tablets</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Latest 5G Tech</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)] text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Laptop className="w-4 h-4 text-cyan-500" />
                      <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400/80 uppercase">PCS</span>
                    </div>
                    <p className="text-xs font-bold truncate">Laptops &amp; PCs</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Gaming &amp; Work</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)] text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Cpu className="w-4 h-4 text-cyan-500" />
                      <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400/80 uppercase">PARTS</span>
                    </div>
                    <p className="text-xs font-bold truncate">PC Components</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">GPUs, CPUs, RAM</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)] text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Headphones className="w-4 h-4 text-cyan-500" />
                      <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400/80 uppercase">AUDIO</span>
                    </div>
                    <p className="text-xs font-bold truncate">Accessories</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Headphones, Cables</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-cyan-500/40 hover:text-[var(--text-primary)] text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Tv className="w-4 h-4 text-cyan-500" />
                      <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400/80 uppercase">HOME</span>
                    </div>
                    <p className="text-xs font-bold truncate">Smart Appliances</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Living &amp; Kitchen</p>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Electronics Showcase Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--border-subtle)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-heading">
                Trending Electronics &amp; Gadgets
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {selectedCategory
                ? 'Filtered by active electronic category selection'
                : 'Flagship phones, laptops, PC components, and audio accessories in stock'}
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline group"
          >
            <span>Open Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : !latestProducts || latestProducts.results.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 sm:p-12 text-center backdrop-blur-sm shadow-sm dark:shadow-none">
            <Smartphone className="w-12 h-12 mx-auto text-cyan-500/40 mb-3" />
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">No Electronics Found</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 max-w-sm mx-auto">
              No products found matching the current criteria. Reset filters or view all items in catalog.
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory(null)}
            >
              Reset Category Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {latestProducts.results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
