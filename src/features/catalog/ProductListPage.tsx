import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { productsApi } from '../../api/endpoints/products';
import { queryKeys } from '../../hooks/queryKeys';
import { useDebounce } from '../../hooks/useDebounce';
import { useCategories } from './useCategories';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import type { ProductQueryParams } from '../../types';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Filters from URL
  const selectedCategories = searchParams.getAll('categories').map(Number).filter(Boolean);
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const inStockOnly = searchParams.get('min_stock') === '1';
  const ordering = searchParams.get('ordering') || '-created_at';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  // Local draft price inputs
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync debounced search to URL
  useEffect(() => {
    const currentParam = searchParams.get('search') || '';
    if (debouncedSearch !== currentParam) {
      const nextParams = new URLSearchParams(searchParams);
      if (debouncedSearch) {
        nextParams.set('search', debouncedSearch);
      } else {
        nextParams.delete('search');
      }
      nextParams.set('page', '1');
      setSearchParams(nextParams);
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Categories list derived client-side
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Build query params
  const queryParams: ProductQueryParams = {
    search: debouncedSearch || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    min_price: minPrice ? parseFloat(minPrice) : undefined,
    max_price: maxPrice ? parseFloat(maxPrice) : undefined,
    min_stock: inStockOnly ? 1 : undefined,
    ordering: ordering || undefined,
    page,
    page_size: pageSize,
  };

  // Main Products Query with placeholderData to avoid flashing
  const { data: productData, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.products.list(queryParams),
    queryFn: () => productsApi.getProducts(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30 seconds
  });

  const totalCount = productData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // URL State Mutators
  const handleCategoryToggle = (categoryId: number) => {
    const nextParams = new URLSearchParams(searchParams);
    const existing = nextParams.getAll('categories').map(Number);
    nextParams.delete('categories');

    if (existing.includes(categoryId)) {
      existing.filter((id) => id !== categoryId).forEach((id) => nextParams.append('categories', String(id)));
    } else {
      [...existing, categoryId].forEach((id) => nextParams.append('categories', String(id)));
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (localMinPrice) nextParams.set('min_price', localMinPrice);
    else nextParams.delete('min_price');

    if (localMaxPrice) nextParams.set('max_price', localMaxPrice);
    else nextParams.delete('max_price');

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleStockToggle = (checked: boolean) => {
    const nextParams = new URLSearchParams(searchParams);
    if (checked) nextParams.set('min_stock', '1');
    else nextParams.delete('min_stock');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleOrderingChange = (newOrdering: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('ordering', newOrdering);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    selectedCategories.length > 0 ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    inStockOnly;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">BUY YANTRA ELECTRONICS CATALOG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white">
            System Apparatus &amp; Electronics Catalog
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono">
            {isFetching ? 'Synchronizing products...' : `INDEX: ${productData?.results.length ?? 0} ACTIVE / ${totalCount} UNITS IN SYSTEM`}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search smartphones, laptops, electronics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 px-3.5 py-2 pl-9 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-xs transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-cyan-400/80" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-48">
            <Select
              value={ordering}
              onChange={(e) => handleOrderingChange(e.target.value)}
              options={[
                { value: '-created_at', label: 'Newest Arrivals' },
                { value: 'created_at', label: 'Oldest' },
                { value: 'price', label: 'Price: Low to High' },
                { value: '-price', label: 'Price: High to Low' },
                { value: '-updated_at', label: 'Recently Updated' },
              ]}
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-xs hover:border-cyan-500/50"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 py-4">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
            Active Parameters:
          </span>
          {debouncedSearch && (
            <Badge variant="outline" className="gap-1.5 py-1 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/40">
              Query: "{debouncedSearch}"
              <X className="w-3 h-3 cursor-pointer hover:text-cyan-500" onClick={() => setSearchTerm('')} />
            </Badge>
          )}
          {selectedCategories.map((catId) => {
            const cat = categories?.find((c) => c.id === catId);
            return (
              <Badge key={catId} variant="primary" className="gap-1.5 py-1">
                {cat ? cat.name : `Category ${catId}`}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategoryToggle(catId)} />
              </Badge>
            );
          })}
          {(minPrice || maxPrice) && (
            <Badge variant="outline" className="gap-1.5 py-1 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/40">
              Price: ₹{minPrice || 0} - {maxPrice ? `₹${maxPrice}` : '∞'}
              <X
                className="w-3 h-3 cursor-pointer hover:text-cyan-500"
                onClick={() => {
                  setLocalMinPrice('');
                  setLocalMaxPrice('');
                  const next = new URLSearchParams(searchParams);
                  next.delete('min_price');
                  next.delete('max_price');
                  setSearchParams(next);
                }}
              />
            </Badge>
          )}
          {inStockOnly && (
            <Badge variant="success" className="gap-1.5 py-1">
              In Stock Only
              <X className="w-3 h-3 cursor-pointer" onClick={() => handleStockToggle(false)} />
            </Badge>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 ml-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Parameters
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
        {/* Sidebar Filters Desktop (Bento styled filter card) */}
        <aside
          className={`md:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-5 space-y-6 shadow-sm dark:shadow-none backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.08]">
              <h3 className="font-mono text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Filter Parameters
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Categories
              </h4>
              {categoriesLoading ? (
                <p className="text-xs text-slate-500">Querying registry...</p>
              ) : !categories || categories.length === 0 ? (
                <p className="text-xs text-slate-500">No categories recorded</p>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    return (
                      <label
                        key={category.id}
                        className={`flex items-center gap-2.5 text-xs rounded-lg px-2 py-1.5 cursor-pointer select-none transition-colors ${
                          isSelected
                            ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-medium'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="rounded border-slate-300 dark:border-white/20 bg-white dark:bg-slate-950 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                        />
                        <span className={isSelected ? 'font-semibold' : ''}>
                          {category.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/[0.08]">
              <h4 className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Price Range (₹)
              </h4>
              <form onSubmit={handleApplyPriceFilter} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-xs"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" fullWidth>
                  Filter Range
                </Button>
              </form>
            </div>

            {/* Stock Filter */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08]">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => handleStockToggle(e.target.checked)}
                  className="rounded border-slate-300 dark:border-white/20 bg-white dark:bg-slate-950 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                />
                <span className="font-medium">Active Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid Area */}
        <section className="md:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : !productData || productData.results.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-8 sm:p-12 text-center space-y-3 shadow-sm dark:shadow-none">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">No electronics match your search criteria</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Adjust filter specifications, remove active category selections, or broaden your price thresholds.
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {productData.results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/[0.08] pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>

                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    PAGE <span className="text-cyan-600 dark:text-cyan-400 font-bold">{page}</span> OF {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
