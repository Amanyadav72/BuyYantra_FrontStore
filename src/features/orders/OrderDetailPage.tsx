import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Printer,
  ShoppingBag,
} from 'lucide-react';
import { format } from 'date-fns';
import { ordersApi } from '../../api/endpoints/orders';
import { queryKeys } from '../../hooks/queryKeys';
import { formatCurrency } from '../../lib/formatCurrency';
import { getOrderStatusBadge, getPaymentStatusBadge } from './orderBadges';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { OrderItem } from '../../types';

export const OrderDetailPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.orders.detail(number || ''),
    queryFn: () => ordersApi.getOrderByNumber(number!),
    enabled: Boolean(number),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-md py-16 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">Order Not Found</h2>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          The order number "{number}" does not match any order records for your account.
        </p>
        <div className="pt-2">
          <Link to="/orders">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { shipping_address: addr } = order;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          RETURN TO DISPATCH LOGS
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-cyan-400" />
          PRINT SPECIFICATION RECEIPT
        </button>
      </div>

      {/* Main Order Header Card */}
      <Card className="bg-[#0c121c] border-white/[0.08] relative overflow-hidden">
        <div className="absolute inset-0 tech-grid-cyan opacity-15 pointer-events-none" />
        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest font-semibold text-cyan-400">
                DISPATCH ALLOCATION IDENTIFIER
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                {order.number}
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {format(new Date(order.created_at), 'yyyy-MM-dd · hh:mm a')}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-cyan-400/80">SYS-LOG: #{order.id}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {getOrderStatusBadge(order.status)}
              {getPaymentStatusBadge(order.payment_status)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout: Order Items + Shipping/Cost Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Line Items */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/[0.08]">
              <CardTitle className="text-sm font-mono flex items-center gap-2 text-white">
                <Package className="w-4 h-4 text-cyan-400" />
                Allocated Equipment Apparatus ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-white/[0.06]">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-[#0c121c] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-cyan-400/60" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.product}`}
                        className="text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors line-clamp-1"
                      >
                        {item.product_name}
                      </Link>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        Units: {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-mono font-bold text-white block">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Shipping Destination & Cost Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shipping Address Snapshot */}
          <Card className="border-white/[0.08] bg-slate-900/60 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-white/[0.08]">
              <CardTitle className="text-sm font-mono flex items-center gap-2 text-white">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Transit Destination
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs text-slate-300">
              {addr ? (
                <>
                  <p className="font-bold text-sm text-white font-mono">{addr.recipient_name}</p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </p>
                  <p className="font-medium text-cyan-400/80">{addr.country}</p>
                  <p className="pt-2 font-mono text-slate-400">Telemetry Contact: {addr.phone}</p>
                </>
              ) : (
                <p className="text-slate-500 italic">No destination snapshot recorded.</p>
              )}
            </CardContent>
          </Card>

          {/* Pricing Calculation Summary */}
          <Card className="border-white/[0.08] bg-slate-900/70 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-white/[0.08]">
              <CardTitle className="text-sm font-mono text-white">Settlement Telemetry</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Apparatus Subtotal</span>
                <span className="font-mono font-semibold text-white">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Transit Allocation</span>
                <span className="font-mono font-semibold text-white">{formatCurrency(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (GST)</span>
                <span className="font-mono font-semibold text-white">{formatCurrency(order.tax)}</span>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-between items-baseline">
                <span className="text-xs font-mono text-slate-300">Total Settled</span>
                <span className="text-xl font-mono font-extrabold text-cyan-300">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
