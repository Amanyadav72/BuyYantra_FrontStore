import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartApi } from '../../api/endpoints/cart';
import { queryKeys } from '../../hooks/queryKeys';
import { extractErrorMessage } from '../../lib/extractErrorMessage';
import { useAuthStore } from '../../stores/authStore';
import type { AddCartItemPayload, Cart, UpdateCartItemPayload } from '../../types';

export function useCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const cartQuery = useQuery<Cart>({
    queryKey: queryKeys.cart.root,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds
    retry: false,
  });

  // Mutation: Add Item (returns full updated Cart)
  const addItemMutation = useMutation({
    mutationFn: (payload: AddCartItemPayload) => cartApi.addCartItem(payload),
    onSuccess: (updatedCart) => {
      // Directly setQueryData on cart key
      queryClient.setQueryData(queryKeys.cart.root, updatedCart);
      toast.success('Added to cart');
    },
    onError: (error) => {
      const msg = extractErrorMessage(error, 'Could not add item to cart.');
      toast.error(msg);
    },
  });

  // Mutation: Update Quantity (returns full updated Cart)
  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCartItemPayload }) =>
      cartApi.updateCartItem(id, payload),
    onSuccess: (updatedCart) => {
      // Directly setQueryData on cart key
      queryClient.setQueryData(queryKeys.cart.root, updatedCart);
    },
    onError: (error) => {
      const msg = extractErrorMessage(error, 'Could not update quantity.');
      toast.error(msg);
    },
  });

  // Mutation: Remove Item (204, no body -> invalidateQueries)
  const removeItemMutation = useMutation({
    mutationFn: (id: number) => cartApi.removeCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root });
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      const msg = extractErrorMessage(error, 'Could not remove item.');
      toast.error(msg);
    },
  });

  return {
    cart: cartQuery.data,
    itemCount: cartQuery.data?.item_count ?? 0,
    subtotal: cartQuery.data?.subtotal ?? 0,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    addItem: addItemMutation.mutate,
    isAdding: addItemMutation.isPending,
    updateQuantity: updateQuantityMutation.mutate,
    isUpdating: updateQuantityMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemoving: removeItemMutation.isPending,
    refetch: cartQuery.refetch,
  };
}
