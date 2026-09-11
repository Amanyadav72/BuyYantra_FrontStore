import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../../api/endpoints/auth';
import { useAuthStore } from '../../stores/authStore';
import { extractErrorMessage } from '../../lib/extractErrorMessage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const isSessionExpired = searchParams.get('session_expired') === '1';

  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      setAuth(response.access, response.refresh, response.user);
      toast.success(`Welcome back, ${response.user.first_name || response.user.username}!`);
      navigate(redirectPath);
    } catch (error) {
      const msg = extractErrorMessage(error, 'Invalid username or password.');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">Sign In to BuyYantra</CardTitle>
          <CardDescription>
            Access your order tracking, addresses, and customer profile
          </CardDescription>
          {isSessionExpired && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800 text-left">
              Your session has expired. Please log in again to continue.
            </div>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              placeholder="Enter your username"
              autoComplete="username"
              leftIcon={<UserIcon className="w-4 h-4" />}
              error={errors.username?.message}
              {...register('username')}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
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
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-2"
            >
              Sign In
            </Button>

            <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-100">
              Don't have an account?{' '}
              <Link
                to={redirectPath !== '/' ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register'}
                className="font-semibold text-slate-900 hover:underline"
              >
                Create one now
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
