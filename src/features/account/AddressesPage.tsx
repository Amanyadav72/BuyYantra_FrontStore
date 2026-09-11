import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { addressesApi } from '../../api/endpoints/addresses';
import { queryKeys } from '../../hooks/queryKeys';
import { extractErrorMessage, applyServerErrors } from '../../lib/extractErrorMessage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import type { Address, AddressPayload } from '../../types';

const addressSchema = z.object({
  label: z.string().max(50).optional(),
  address_type: z.enum(['HOME', 'WORK', 'OTHER']),
  recipient_name: z.string().min(1, 'Recipient name is required').max(150),
  phone: z.string().min(1, 'Phone number is required').max(20),
  line1: z.string().min(1, 'Street address is required').max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postal_code: z.string().min(1, 'Postal / PIN code is required').max(20),
  country: z.string().min(1).max(100),
  is_default: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export const AddressesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  // Fetch addresses
  const { data: addresses, isLoading } = useQuery({
    queryKey: queryKeys.addresses.all,
    queryFn: addressesApi.getAddresses,
  });

  // React Hook Form for Add/Edit
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_type: 'HOME',
      country: 'India',
      is_default: false,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (payload: AddressPayload) => addressesApi.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      setIsAddModalOpen(false);
      reset();
      toast.success('Shipping address added');
    },
    onError: (error) => {
      const applied = applyServerErrors(error, setError);
      if (!applied) {
        const msg = extractErrorMessage(error, 'Failed to add address.');
        toast.error(msg);
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AddressPayload> }) =>
      addressesApi.updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      setEditingAddress(null);
      reset();
      toast.success('Address updated successfully');
    },
    onError: (error) => {
      const applied = applyServerErrors(error, setError);
      if (!applied) {
        const msg = extractErrorMessage(error, 'Failed to update address.');
        toast.error(msg);
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => addressesApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      setDeletingAddressId(null);
      toast.success('Address deleted');
    },
    onError: (error) => {
      const msg = extractErrorMessage(error, 'Failed to delete address.');
      toast.error(msg);
    },
  });

  // Set default mutation
  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => addressesApi.updateAddress(id, { is_default: true }),
    onSuccess: () => {
      // Invalidate full address list because setting is_default clears it from others server-side
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
      toast.success('Default address updated');
    },
    onError: (error) => {
      const msg = extractErrorMessage(error, 'Failed to set default address.');
      toast.error(msg);
    },
  });

  const handleOpenAddModal = () => {
    reset({
      address_type: 'HOME',
      country: 'India',
      is_default: addresses ? addresses.length === 0 : false,
      recipient_name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      label: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (addr: Address) => {
    setEditingAddress(addr);
    reset({
      address_type: addr.address_type,
      recipient_name: addr.recipient_name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      label: addr.label || '',
      is_default: addr.is_default,
    });
  };

  const onFormSubmit = (data: AddressFormData) => {
    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">
            Saved Addresses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain your shipping and delivery destinations for fast checkout
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shrink-0"
        >
          Add New Address
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <MapPin className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">No Addresses Saved</h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Save shipping addresses to speed up your equipment order dispatch.
          </p>
          <div className="pt-2">
            <Button onClick={handleOpenAddModal} leftIcon={<Plus className="w-4 h-4" />}>
              Add Your First Address
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <Card key={addr.id} className="relative flex flex-col justify-between overflow-hidden">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900">
                      {addr.recipient_name}
                    </span>
                    <Badge variant="outline" size="sm">
                      {addr.address_type}
                    </Badge>
                    {addr.label && (
                      <span className="text-xs text-slate-500 font-medium">({addr.label})</span>
                    )}
                  </div>

                  {addr.is_default && (
                    <Badge variant="success" size="sm" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Default
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </p>
                  <p className="text-slate-500">{addr.country}</p>
                  <p className="pt-1 font-mono font-medium text-slate-700">Phone: {addr.phone}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    {!addr.is_default && (
                      <button
                        type="button"
                        onClick={() => setDefaultMutation.mutate(addr.id)}
                        disabled={setDefaultMutation.isPending}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Set as Default
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(addr)}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingAddressId(addr.id)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      <Modal
        isOpen={isAddModalOpen || editingAddress !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? 'Edit Shipping Address' : 'Add New Shipping Address'}
        description="Delivery destination details for order fulfillment"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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
            label="Street Address"
            placeholder="Plot, building, street, locality"
            error={errors.line1?.message}
            required
            {...register('line1')}
          />

          <Input
            label="Address Line 2 (Optional)"
            placeholder="Floor, unit, landmark"
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
              label="Postal (PIN) Code"
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
              placeholder="e.g. Factory Office"
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
              <span>Set as primary default address</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingAddress ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingAddressId !== null}
        onClose={() => setDeletingAddressId(null)}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
      >
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setDeletingAddressId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={deleteMutation.isPending}
            onClick={() => {
              if (deletingAddressId) {
                deleteMutation.mutate(deletingAddressId);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
