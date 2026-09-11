import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../api/endpoints/products';
import { queryKeys } from '../../hooks/queryKeys';
import type { Category } from '../../types';

/**
 * Note on Categories:
 * The ShopHub API does not provide a dedicated `/categories/` endpoint.
 * As specified in the API contract, we fetch a wide page of products (page_size=50)
 * and de-duplicate the `categories[]` arrays client-side into a sorted filter list,
 * caching the result with React Query at an extended staleTime.
 */
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: queryKeys.products.categories,
    queryFn: async () => {
      const response = await productsApi.getProducts({ page_size: 50 });
      const categoryMap = new Map<number, Category>();

      response.results.forEach((product) => {
        if (Array.isArray(product.categories)) {
          product.categories.forEach((cat) => {
            if (cat && cat.id && !categoryMap.has(cat.id)) {
              categoryMap.set(cat.id, cat);
            }
          });
        }
      });

      return Array.from(categoryMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  });
}
