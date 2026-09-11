import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MapPin,
  Plus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { addressesApi } from '../../api/endpoints/addresses';
import { ordersApi } from '../../api/endpoints/orders';
import { queryKeys } from '../../hooks/queryKeys';
import { useCart } from '../cart/useCart';
import { formatCurrency } from '../../lib/formatCurrency';
import { extractErrorMessage } from '../../lib/extractErrorMessage';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import type { AddressPayload } from '../../types';

const addressSchema = z.object({
  label: z.string().max(50).optional(),
  address_type: z.enum(['HOME', 'WORK', 'OTHER']),
  recipient_name: z.string().min(1, 'Recipient name is required').max(150),
  phone: z.string().min(1, 'Phone number is required').max(20),
  line1: z.string().min(1, 'Street address is required').max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postal_code: z.string().min(1, 'Postal/PIN code is required').max(20),
  country: z.string().min(1).max(100),
  is_default: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cart, itemCount, subtotal } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // Fetch saved addresses
  const { data: addresses, isLoading: isAddressesLoading } = useQuery({
    queryKey: queryKeys.addresses.all,
    queryFn: addressesApi.getAddresses,
  });

  // Derive active selected address without cascading effects
  const defaultAddressId = addresses?.find((a) => a.is_default)?.id ?? addresses?.[0]?.id ?? null;
  const effectiveAddressId = selectedAddressId ?? defaultAddressId;

  // Add Address Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isSubmittingAddress },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_type: 'HOME',
      country: 'India',
      is_default: addresses ? addresses.length === 0 : false,
    },
  });

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: (payload: AddressPayload) => addressesApi.createAddress(payload),
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      setSelectedAddressId(newAddress.id);
      setIsAddAddressModalOpen(false);
      reset();
      toast.success('Address saved successfully');
    },
    onError: (error) => {
      const msg = extractErrorMessage(error, 'Failed to save address.');
      toast.error(msg);
    },
  });

  const onAddAddressSubmit = (data: AddressFormData) => {
    createAddressMutation.mutate(data);
  };

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: (addressId: number) => ordersApi.checkout({ address_id: addressId }),
    onSuccess: (order) => {
      // Invalidate both orders and cart as specified
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root });
      toast.success('Your order has been placed successfully!');
      navigate(`/orders/${order.number}`);
    },
    onError: (error) => {
      const msg = extractErrorMessage(error, 'Checkout failed. Please try again.');
      toast.error(msg);
    },
  });

  const handlePlaceOrder = () => {
    if (!effectiveAddressId) {
      toast.error('Please select or add a shipping address.');
      return;
    }
    checkoutMutation.mutate(effectiveAddressId);
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Add some equipment to your cart before proceeding to checkout.
        </p>
        <div className="pt-2">
          <Link to="/products">
            <Button size="lg">Explore Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <nav className="mb-2">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Cart
          </Link>
        </nav>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">
          Checkout & Dispatch
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your shipping destination and confirm your order placement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Shipping Address Selection */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-700" />
                  Select Shipping Destination
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Choose where you want your equipment delivered
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsAddAddressModalOpen(true)}
              >
                Add Address
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {isAddressesLoading ? (
                <p className="text-xs text-slate-400 py-4 text-center">Loading addresses...</p>
              ) : !addresses || addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">No saved shipping addresses</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Please provide your delivery destination address to place your order.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setIsAddAddressModalOpen(true)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Shipping Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((address) => {
                    const isSelected = effectiveAddressId === address.id;
                    return (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`rounded-xl border p-4 cursor-pointer transition-all relative ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50/80 ring-2 ring-slate-900 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {address.recipient_name}
                            </span>
                            {address.label && (
                              <Badge variant="outline" size="sm">
                                {address.label}
                              </Badge>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-slate-900 fill-slate-900 text-white shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-1">{address.line1}</p>
                        {address.line2 && (
                          <p className="text-xs text-slate-600 line-clamp-1">{address.line2}</p>
                        )}
                        <p className="text-xs text-slate-600 mt-0.5">
                          {address.city}, {address.state} - {address.postal_code}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 font-mono">
                          Ph: {address.phone}
                        </p>

                        {address.is_default && (
                          <div className="mt-2">
                            <Badge variant="success" size="sm">
                              Default Address
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cart Items Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-slate-700" />
                Items In This Shipment ({itemCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Place Order Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-900 font-heading pb-3 border-b border-slate-100">
                Payment & Order Placement
              </h3>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Direct Order Protocol
                </div>
                <p className="text-[11px] leading-relaxed">
                  Per the ShopHub API specification, orders are registered directly with status{' '}
                  <span className="font-semibold text-slate-800">PENDING</span>. Payment gateway integration will be handled upon subsequent invoice delivery.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Ground Shipping</span>
                  <span className="font-semibold text-emerald-600">Calculated Post-Booking</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes</span>
                  <span className="font-semibold text-slate-600">Itemized on Invoice</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Due</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                size="lg"
                fullWidth
                isLoading={checkoutMutation.isPending}
                disabled={!effectiveAddressId}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="h-12"
              >
                Place Order Now
              </Button>

              <p className="text-[11px] text-center text-slate-400 leading-tight">
                By confirming your order, stock allocation is reserved immediately in ShopHub.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        title="Add New Shipping Address"
        description="Provide your delivery coordinates for order dispatch"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onAddAddressSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Recipient Full Name"
              placeholder="e.g. Aman Yadav"
              error={errors.recipient_name?.message}
              required
              {...register('recipient_name')}
            />
            <Input
              label="Phone Number"
              placeholder="+91 9876543210"
              error={errors.phone?.message}
              required
              {...register('phone')}
            />
          </div>

          <Input
            label="Address Line 1"
            placeholder="House / Flat / Building / Street"
            error={errors.line1?.message}
            required
            {...register('line1')}
          />

          <Input
            label="Address Line 2 (Optional)"
            placeholder="Apartment, suite, landmark, floor"
            error={errors.line2?.message}
            {...register('line2')}
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="City"
              placeholder="Mumbai"
              error={errors.city?.message}
              required
              {...register('city')}
            />
            <Input
              label="State"
              placeholder="Maharashtra"
              error={errors.state?.message}
              required
              {...register('state')}
            />
            <Input
              label="Postal Code (PIN)"
              placeholder="400001"
              error={errors.postal_code?.message}
              required
              {...register('postal_code')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Address Type"
              options={[
                { value: 'HOME', label: 'Home' },
                { value: 'WORK', label: 'Work' },
                { value: 'OTHER', label: 'Other' },
              ]}
              {...register('address_type')}
            />
            <Input
              label="Label (Optional)"
              placeholder="e.g. Headquarters, Warehouse"
              error={errors.label?.message}
              {...register('label')}
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                {...register('is_default')}
              />
              <span>Set as my default shipping address</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsAddAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmittingAddress || createAddressMutation.isPending}>
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
