import { axiosClient } from '../axiosClient';
import type { PaginatedProductList, Product, ProductQueryParams } from '../../types';

export const productsApi = {
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedProductList> => {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.search) searchParams.append('search', params.search);
      if (params.ordering) searchParams.append('ordering', params.ordering);
      if (params.page !== undefined) searchParams.append('page', String(params.page));
      if (params.page_size !== undefined) searchParams.append('page_size', String(params.page_size));
      if (params.min_price !== undefined) searchParams.append('min_price', String(params.min_price));
      if (params.max_price !== undefined) searchParams.append('max_price', String(params.max_price));
      if (params.min_stock !== undefined) searchParams.append('min_stock', String(params.min_stock));
      if (params.max_stock !== undefined) searchParams.append('max_stock', String(params.max_stock));

      if (params.categories && params.categories.length > 0) {
        params.categories.forEach((catId) => {
          searchParams.append('categories', String(catId));
        });
      }
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/products/?${queryString}` : '/products/';
    const response = await axiosClient.get<PaginatedProductList>(url);
    return response.data;
  },

  getProduct: async (id: number | string): Promise<Product> => {
    const response = await axiosClient.get<Product>(`/products/${id}/`);
    return response.data;
  },
};
