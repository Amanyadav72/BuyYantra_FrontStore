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
      <Card className="w-full max-w-md border-white/[0.08] bg-slate-900/70 backdrop-blur-md glow-hover-cyan shadow-[0_0_30px_-8px_rgba(6,182,212,0.15)]">
        <CardHeader className="text-center space-y-2 pb-6 border-b border-white/[0.08]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">OPERATOR AUTHENTICATION</span>
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-white">Access Terminal</CardTitle>
          <CardDescription className="text-xs font-mono text-slate-400">
            Sign in to track hardware shipments and maintain dispatch telemetry
          </CardDescription>
          {isSessionExpired && (
            <div className="rounded-xl bg-cyan-950/40 border border-cyan-500/40 p-2.5 text-xs text-cyan-300 font-mono text-left">
              Session token expired. Re-authenticate to resume dispatch telemetry.
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6">
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
                label="Passphrase"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-slate-400 hover:text-cyan-400 focus:outline-none"
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
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot passphrase?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-2"
            >
              Authorize &amp; Sign In
            </Button>

            <div className="pt-4 text-center text-xs font-mono text-slate-400 border-t border-white/[0.08]">
              New operator?{' '}
              <Link
                to={redirectPath !== '/' ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register'}
                className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline ml-1"
              >
                Register Credentials
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
