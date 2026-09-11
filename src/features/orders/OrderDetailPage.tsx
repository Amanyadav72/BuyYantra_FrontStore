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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Orders
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Receipt
        </button>
      </div>

      {/* Main Order Header Card */}
      <Card className="bg-slate-900 text-white border-slate-800">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Order Reference
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                {order.number}
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {format(new Date(order.created_at), 'MMMM dd, yyyy · hh:mm a')}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Internal ID: #{order.id}</span>
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
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-700" />
                Purchased Equipment ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.product}`}
                        className="text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors line-clamp-1"
                      >
                        {item.product_name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900 block">
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
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-700" />
                Shipping Destination
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2 text-xs text-slate-700">
              {addr ? (
                <>
                  <p className="font-bold text-sm text-slate-900">{addr.recipient_name}</p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </p>
                  <p className="font-medium text-slate-500">{addr.country}</p>
                  <p className="pt-2 font-mono text-slate-600">Contact: {addr.phone}</p>
                </>
              ) : (
                <p className="text-slate-400 italic">No address snapshot recorded.</p>
              )}
            </CardContent>
          </Card>

          {/* Pricing Calculation Summary */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base">Order Charges</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Transit Fee</span>
                <span className="font-semibold text-slate-800">{formatCurrency(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (GST)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(order.tax)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Charged</span>
                <span className="text-xl font-extrabold text-slate-900">
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
