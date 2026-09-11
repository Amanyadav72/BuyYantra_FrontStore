import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ordersApi } from '../../api/endpoints/orders';
import { queryKeys } from '../../hooks/queryKeys';
import { formatCurrency } from '../../lib/formatCurrency';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getOrderStatusBadge, getPaymentStatusBadge } from './orderBadges';

export const OrdersListPage: React.FC = () => {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: ordersApi.getOrders,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">
          Order History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track and inspect past technical purchases and equipment allocations
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
          Failed to load order history. Please try again.
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">No Orders Placed Yet</h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Once you place an order for industrial tools or parts, it will appear here.
          </p>
          <div className="pt-2">
            <Link to="/products">
              <Button size="lg" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} hoverEffect className="overflow-hidden">
              <Link to={`/orders/${order.number}`} className="block">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          {order.number}
                        </span>
                        {getOrderStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy · hh:mm a')}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-500 block">Total Amount</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Line items preview */}
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}:
                      </span>{' '}
                      <span className="text-slate-500">
                        {order.items.map((it) => it.product_name).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 shrink-0">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
