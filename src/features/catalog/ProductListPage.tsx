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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">
            Product Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isFetching ? 'Refreshing catalog...' : `Showing ${productData?.results.length ?? 0} of ${totalCount} available products`}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 pl-9 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-44">
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
            className="md:hidden inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 py-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Active Filters:
          </span>
          {debouncedSearch && (
            <Badge variant="outline" className="gap-1.5 py-1">
              Search: "{debouncedSearch}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
            </Badge>
          )}
          {selectedCategories.map((catId) => {
            const cat = categories?.find((c) => c.id === catId);
            return (
              <Badge key={catId} variant="accent" className="gap-1.5 py-1">
                {cat ? cat.name : `Category ${catId}`}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategoryToggle(catId)} />
              </Badge>
            );
          })}
          {(minPrice || maxPrice) && (
            <Badge variant="outline" className="gap-1.5 py-1">
              Price: ₹{minPrice || 0} - {maxPrice ? `₹${maxPrice}` : '∞'}
              <X
                className="w-3 h-3 cursor-pointer"
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
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 ml-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
        {/* Sidebar Filters Desktop */}
        <aside
          className={`md:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wider">
                Filter Equipment
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Categories
              </h4>
              {categoriesLoading ? (
                <p className="text-xs text-slate-400">Loading categories...</p>
              ) : !categories || categories.length === 0 ? (
                <p className="text-xs text-slate-400">No categories recorded</p>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    return (
                      <label
                        key={category.id}
                        className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none py-1"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                        />
                        <span className={isSelected ? 'font-semibold text-slate-900' : ''}>
                          {category.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Price Range (₹)
              </h4>
              <form onSubmit={handleApplyPriceFilter} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" fullWidth>
                  Apply Range
                </Button>
              </form>
            </div>

            {/* Stock Filter */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => handleStockToggle(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                />
                <span className="font-medium">In-Stock Items Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid Area */}
        <section className="md:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : !productData || productData.results.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search terms, removing category filters, or expanding the price range.
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productData.results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>

                  <div className="text-xs font-semibold text-slate-600">
                    Page <span className="text-slate-900">{page}</span> of {totalPages}
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
