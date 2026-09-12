import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Save,
  Shield,
  Edit3,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  MapPin,
  Package,
  Camera,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { profileApi } from '../../api/endpoints/profile';
import { queryKeys } from '../../hooks/queryKeys';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { extractErrorMessage, applyServerErrors } from '../../lib/extractErrorMessage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import type { ProfileUpdatePayload, ChangePasswordPayload } from '../../types';

// Preset avatars for quick selection
const PRESET_AVATARS = [
  {
    name: 'Cyberpunk Neon',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    name: 'Tech Specialist',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    name: 'Developer Pro',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    name: 'Electronics Lead',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    name: 'Gadget Enthusiast',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    name: 'Hardware Architect',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
  },
];

// Profile info schema
const profileSchema = z.object({
  first_name: z.string().max(150).optional(),
  last_name: z.string().max(150).optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  avatar: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Password change schema
const passwordChangeSchema = z
  .object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
    confirm_password: z.string().min(8, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: authUser, setUser } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarImgError, setAvatarImgError] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: queryKeys.profile.root,
    queryFn: profileApi.getProfile,
  });

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    setValue: setProfileValue,
    setError: setProfileError,
    control: profileControl,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const watchedAvatar = useWatch({
    control: profileControl,
    name: 'avatar',
  });

  const avatarPreview = watchedAvatar ?? profile?.avatar ?? '';

  // Sync initial form values
  useEffect(() => {
    if (profile) {
      resetProfile({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        avatar: profile.avatar || '',
      });
    }
  }, [profile, resetProfile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => profileApi.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.root });
      if (authUser) {
        setUser({
          ...authUser,
          first_name: updated.first_name,
          last_name: updated.last_name,
          email: updated.email,
          avatar: updated.avatar,
        });
      }
      toast.success('Profile details saved successfully');
      setIsEditMode(false);
    },
    onError: (error) => {
      const applied = applyServerErrors(error, setProfileError);
      if (!applied) {
        const msg = extractErrorMessage(error, 'Failed to update profile.');
        toast.error(msg);
      }
    },
  });

  const onProfileSave = (data: ProfileFormData) => {
    updateProfileMutation.mutate({
      first_name: data.first_name?.trim() || undefined,
      last_name: data.last_name?.trim() || undefined,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      avatar: data.avatar?.trim() || null,
    });
  };

  const handleCancelEdit = () => {
    if (profile) {
      resetProfile({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        avatar: profile.avatar || '',
      });
    }
    setIsEditMode(false);
  };

  // Password Change Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    setError: setPasswordError,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileApi.changePassword(payload),
    onSuccess: (data) => {
      resetPassword();
      toast.success(data.detail || 'Password changed successfully');
      setShowPasswordSection(false);
    },
    onError: (error) => {
      const applied = applyServerErrors(error, setPasswordError);
      if (!applied) {
        const msg = extractErrorMessage(error, 'Failed to change password. Please check your current password.');
        toast.error(msg);
      }
    },
  });

  const onPasswordChange = (data: PasswordChangeFormData) => {
    changePasswordMutation.mutate({
      old_password: data.old_password,
      new_password: data.new_password,
    });
  };

  const userDisplayName =
    profile?.first_name || profile?.last_name
      ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
      : authUser?.username || 'BuyYantra Member';

  const userInitials = profile?.first_name
    ? profile.first_name[0].toUpperCase()
    : authUser?.username?.[0].toUpperCase() || 'U';

  const currentAvatarUrl = isEditMode
    ? avatarPreview || profile?.avatar
    : profile?.avatar || authUser?.avatar;

  const formattedDateJoined = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : profile?.created_at
      ? new Date(profile.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'Active Member';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
              BUY YANTRA MEMBER ACCOUNT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-[var(--text-primary)]">
            {isEditMode ? 'Edit Profile Details' : 'Account & Profile'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isEditMode
              ? 'Update your personal details, contact info, and avatar image link'
              : 'Manage your verified personal details, delivery addresses, orders, and appearance theme'}
          </p>
        </div>

        <div>
          {!isEditMode ? (
            <Button
              variant="primary"
              onClick={() => setIsEditMode(true)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Profile
            </Button>
          )}
        </div>
      </div>

      {isProfileLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-72 w-full rounded-2xl lg:col-span-2" />
          </div>
        </div>
      ) : isEditMode ? (
        /* ================= EDIT MODE ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Avatar Picker & Live Preview */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-500" />
                  Avatar Photo Preview
                </CardTitle>
                <CardDescription>
                  Preview how your avatar looks across the storefront
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center pt-2">
                <div className="relative mb-4">
                  <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg bg-[var(--bg-subtle)] flex items-center justify-center">
                    {avatarPreview && !avatarImgError ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="h-full w-full object-cover"
                        onError={() => setAvatarImgError(true)}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-3xl font-bold font-mono">
                        {userInitials}
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[var(--bg-card)] shadow-xs" />
                </div>

                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Provide an image URL below, or select one of the verified tech presets.
                </p>

                {/* Preset Avatars Selection */}
                <div className="w-full text-left">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                    Quick Preset Avatars
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AVATARS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setProfileValue('avatar', preset.url, { shouldDirty: true, shouldValidate: true });
                          setAvatarImgError(false);
                        }}
                        className={`group relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          avatarPreview === preset.url
                            ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-md'
                            : 'border-[var(--border-subtle)] hover:border-cyan-500/50'
                        }`}
                        title={preset.name}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        {avatarPreview === preset.url && (
                          <div className="absolute inset-0 bg-cyan-950/40 flex items-center justify-center">
                            <Check className="w-4 h-4 text-cyan-400 font-bold" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Profile Edit Form */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="border-b border-[var(--border-subtle)] pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-500" />
                  Personal &amp; Contact Information
                </CardTitle>
                <CardDescription>
                  Modify your name, communication email, phone number, and avatar image link
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-5">
                  {/* Read-only username info */}
                  <div className="rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] p-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                        BUY YANTRA USERNAME (IMMUTABLE)
                      </span>
                      <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
                        @{profile?.username || authUser?.username}
                      </span>
                    </div>
                    <Badge variant="primary" size="sm">
                      Verified Account
                    </Badge>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      placeholder="e.g. Aman"
                      error={profileErrors.first_name?.message}
                      {...registerProfile('first_name')}
                    />
                    <Input
                      label="Last Name"
                      placeholder="e.g. Sharma"
                      error={profileErrors.last_name?.message}
                      {...registerProfile('last_name')}
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@example.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      error={profileErrors.email?.message}
                      {...registerProfile('email')}
                    />
                    <Input
                      label="Contact Phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      leftIcon={<Phone className="w-4 h-4" />}
                      error={profileErrors.phone?.message}
                      {...registerProfile('phone')}
                    />
                  </div>

                  {/* Avatar URL input */}
                  <Input
                    label="Avatar Image Link (URL)"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    leftIcon={<Camera className="w-4 h-4" />}
                    error={profileErrors.avatar?.message}
                    {...registerProfile('avatar')}
                  />

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={updateProfileMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={updateProfileMutation.isPending}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* ================= VIEW MODE (DEFAULT) ================= */
        <div className="space-y-8">
          {/* Member Banner Card */}
          <div className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 backdrop-blur-md overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                {/* Avatar Display */}
                <div className="relative shrink-0">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-md bg-[var(--bg-subtle)] flex items-center justify-center">
                    {currentAvatarUrl ? (
                      <img
                        src={currentAvatarUrl}
                        alt={userDisplayName}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-3xl font-bold font-mono">
                        {userInitials}
                      </div>
                    )}
                  </div>
                  <span
                    className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-card)] shadow-xs"
                    title="Account Active"
                  />
                </div>

                {/* User Identity Details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-heading">
                      {userDisplayName}
                    </h2>
                    <Badge variant="primary" size="sm">
                      Verified Buyer
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-[var(--text-secondary)]">
                    @{profile?.username || authUser?.username}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Member since {formattedDateJoined}</span>
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                >
                  Edit Details
                </Button>
              </div>
            </div>
          </div>

          {/* 3-Column Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Personal Credentials (Span 6) */}
            <div className="lg:col-span-6 space-y-6">
              <Card>
                <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-500" />
                      Personal Information
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-normal cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 divide-y divide-[var(--border-subtle)]">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Full Name</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {profile?.first_name || profile?.last_name
                        ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
                        : 'Not provided'}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Username</span>
                    <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
                      @{profile?.username || authUser?.username}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Communication Email</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {profile?.email || 'Not provided'}
                      </span>
                      {profile?.email && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Contact Phone</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {profile?.phone || 'Not provided'}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Account Status</span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                      Active &amp; In Good Standing
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/account/addresses"
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 hover:border-cyan-500/50 hover:shadow-sm transition-all group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] group-hover:text-cyan-500 transition-colors">
                      VIEW &rarr;
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">Delivery Addresses</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Manage shipping relays</p>
                </Link>

                <Link
                  to="/orders"
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 hover:border-cyan-500/50 hover:shadow-sm transition-all group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] group-hover:text-cyan-500 transition-colors">
                      VIEW &rarr;
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">Order History</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Track packages &amp; invoices</p>
                </Link>
              </div>
            </div>

            {/* Column 2: Theme Selector & Security (Span 6) */}
            <div className="lg:col-span-6 space-y-6">
              {/* THEME TOGGLE SECTION (User explicit request) */}
              <Card className="border-[var(--border-subtle)]">
                <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                      Appearance &amp; Storefront Theme
                    </CardTitle>
                    <Badge variant="outline" size="sm">
                      {theme === 'dark' ? 'Cyberpunk Cyan' : 'Paper Grain'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Choose between obsidian electric cyan or subtle paper-grain tactile light theme
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Dark Theme Card */}
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                        theme === 'dark'
                          ? 'border-cyan-500 bg-cyan-950/40 ring-2 ring-cyan-500/20 shadow-md'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/30">
                          <Moon className="w-4 h-4" />
                        </div>
                        {theme === 'dark' && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-slate-950 text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Dark Theme</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        Obsidian canvas with electric cyan glow
                      </p>
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="h-2 w-5 rounded-full bg-slate-950 border border-white/10" />
                        <span className="h-2 w-5 rounded-full bg-slate-900" />
                        <span className="h-2 w-5 rounded-full bg-cyan-400" />
                      </div>
                    </button>

                    {/* Light Theme Card */}
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                        theme === 'light'
                          ? 'border-cyan-600 bg-cyan-500/10 ring-2 ring-cyan-500/20 shadow-md'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                          <Sun className="w-4 h-4" />
                        </div>
                        {theme === 'light' && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-600 text-white text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Light Theme</p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        Warm paper-grain micro-texture &amp; crisp text
                      </p>
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="h-2 w-5 rounded-full bg-[#f7f6f1] border border-stone-300" />
                        <span className="h-2 w-5 rounded-full bg-white border border-stone-200" />
                        <span className="h-2 w-5 rounded-full bg-cyan-600" />
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Password Card */}
              <Card>
                <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-500" />
                      Security &amp; Password
                    </CardTitle>
                    <button
                      type="button"
                      onClick={() => setShowPasswordSection(!showPasswordSection)}
                      className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium cursor-pointer"
                    >
                      {showPasswordSection ? 'Hide Form' : 'Change Password'}
                    </button>
                  </div>
                  <CardDescription>
                    Manage your secret password and authorization credentials
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  {showPasswordSection ? (
                    <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="space-y-4">
                      <Input
                        label="Current Password"
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        leftIcon={<Lock className="w-4 h-4" />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="cursor-pointer text-[var(--text-muted)] hover:text-cyan-500 focus:outline-none"
                          >
                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                        error={passwordErrors.old_password?.message}
                        required
                        {...registerPassword('old_password')}
                      />

                      <Input
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        leftIcon={<Lock className="w-4 h-4" />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="cursor-pointer text-[var(--text-muted)] hover:text-cyan-500 focus:outline-none"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                        error={passwordErrors.new_password?.message}
                        required
                        {...registerPassword('new_password')}
                      />

                      <Input
                        label="Confirm New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Repeat new password"
                        autoComplete="new-password"
                        leftIcon={<Lock className="w-4 h-4" />}
                        error={passwordErrors.confirm_password?.message}
                        required
                        {...registerPassword('confirm_password')}
                      />

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPasswordSection(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          isLoading={changePasswordMutation.isPending}
                        >
                          Update Password
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">Account Password</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          Last rotated securely • Encrypted with PBKDF2 / Argon2
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPasswordSection(true)}
                      >
                        Change Password
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
