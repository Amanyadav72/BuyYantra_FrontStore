import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Lock, Eye, EyeOff, Save, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { profileApi } from '../../api/endpoints/profile';
import { queryKeys } from '../../hooks/queryKeys';
import { useAuthStore } from '../../stores/authStore';
import { extractErrorMessage, applyServerErrors } from '../../lib/extractErrorMessage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import type { ProfileUpdatePayload, ChangePasswordPayload } from '../../types';

// Profile info schema
const profileSchema = z.object({
  first_name: z.string().max(150).optional(),
  last_name: z.string().max(150).optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
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

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch live profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: queryKeys.profile.root,
    queryFn: profileApi.getProfile,
  });

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    setError: setProfileError,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Populate form with profile data
  useEffect(() => {
    if (profile) {
      resetProfile({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
      });
    }
  }, [profile, resetProfile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => profileApi.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.root });
      // update auth store state with new fields
      if (authUser) {
        setUser({
          ...authUser,
          first_name: updated.first_name,
          last_name: updated.last_name,
          email: updated.email,
        });
      }
      toast.success('Profile details saved successfully');
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
    });
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

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileApi.changePassword(payload),
    onSuccess: (data) => {
      resetPassword();
      toast.success(data.detail || 'Password changed successfully');
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details, credentials, and password
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-slate-700" />
                Personal Profile
              </CardTitle>
              <CardDescription>
                Update your name and communication email address
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isProfileLoading ? (
                <div className="space-y-4 py-4">
                  <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
                  {/* Read-only username banner */}
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Account Username (Read-Only)
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      @{profile?.username || authUser?.username}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      placeholder="First name"
                      error={profileErrors.first_name?.message}
                      {...registerProfile('first_name')}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Last name"
                      error={profileErrors.last_name?.message}
                      {...registerProfile('last_name')}
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    error={profileErrors.email?.message}
                    {...registerProfile('email')}
                  />

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={updateProfileMutation.isPending}
                      disabled={!isProfileDirty && !updateProfileMutation.isPending}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Change Password Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-700" />
                Security & Password
              </CardTitle>
              <CardDescription>
                Change your account password securely
              </CardDescription>
            </CardHeader>

            <CardContent>
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
                      className="cursor-pointer hover:text-slate-600 focus:outline-none"
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
                      className="cursor-pointer hover:text-slate-600 focus:outline-none"
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

                <div className="pt-2">
                  <Button
                    type="submit"
                    fullWidth
                    variant="secondary"
                    isLoading={changePasswordMutation.isPending}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
