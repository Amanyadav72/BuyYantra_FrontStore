import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../../api/endpoints/auth';
import { applyServerErrors, extractErrorMessage } from '../../lib/extractErrorMessage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const resetSchema = z
  .object({
    uid: z.string().min(1, 'Reset UID is required'),
    token: z.string().min(1, 'Reset Token is required'),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlUid = searchParams.get('uid') || '';
  const urlToken = searchParams.get('token') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      uid: urlUid,
      token: urlToken,
    },
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    try {
      await authApi.confirmPasswordReset({
        uid: data.uid,
        token: data.token,
        new_password: data.new_password,
      });
      setIsSuccess(true);
      toast.success('Password has been reset successfully!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      const applied = applyServerErrors(error, setError);
      if (!applied) {
        const msg = extractErrorMessage(
          error,
          'Failed to reset password. The link or token may be invalid or expired.'
        );
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 mb-2">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">Set New Password</CardTitle>
          <CardDescription>
            Enter your new secure password below to regain account access
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-slate-900">Password Changed!</h4>
                <p className="text-xs text-slate-600">
                  Redirecting you to the sign in page...
                </p>
              </div>
              <Button onClick={() => navigate('/login')} fullWidth>
                Sign In Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Show UID and Token fields if not pre-populated in query string */}
              {(!urlUid || !urlToken) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-3">
                  <p className="font-semibold">Reset token missing from URL</p>
                  <Input
                    label="User ID (UID)"
                    placeholder="Enter uid from email"
                    error={errors.uid?.message}
                    {...register('uid')}
                  />
                  <Input
                    label="Reset Token"
                    placeholder="Enter token from email"
                    error={errors.token?.message}
                    {...register('token')}
                  />
                </div>
              )}

              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.new_password?.message}
                required
                {...register('new_password')}
              />

              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat new password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirm_password?.message}
                required
                {...register('confirm_password')}
              />

              <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="mt-2">
                Update Password
              </Button>

              <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-100">
                <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
