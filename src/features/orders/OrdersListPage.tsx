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
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">DISPATCH LOGS</span>
        </div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-white">
          Hardware Order Telemetry
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Track and inspect past technical purchases and equipment allocations
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-white/[0.08] animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-6 text-center text-xs font-mono text-rose-300">
          Telemetry stream interrupted. Failed to retrieve order history.
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white font-heading">No Allocation Logs Recorded</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Once you place an order for industrial tools or parts, verified telemetry will appear here.
          </p>
          <div className="pt-2">
            <Link to="/products">
              <Button size="lg" variant="primary" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                Explore Hardware Grid
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} hoverEffect className="overflow-hidden border-white/[0.08] bg-slate-900/60 backdrop-blur-md hover:border-cyan-500/40 hover:shadow-[0_0_24px_-4px_rgba(6,182,212,0.25)] transition-all">
              <Link to={`/orders/${order.number}`} className="block">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white font-mono">
                          {order.number}
                        </span>
                        {getOrderStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                      <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Allocated on {format(new Date(order.created_at), 'yyyy-MM-dd · hh:mm a')}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs font-mono text-slate-400 block">Total Settlement</span>
                      <span className="text-lg font-mono font-extrabold text-cyan-300">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Line items preview */}
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}:
                      </span>{' '}
                      <span className="text-slate-400">
                        {order.items.map((it) => it.product_name).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 shrink-0">
                      <span>Inspect Telemetry</span>
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
