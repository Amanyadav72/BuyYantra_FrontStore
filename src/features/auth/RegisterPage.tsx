import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../../api/endpoints/auth';
import { applyServerErrors, extractErrorMessage } from '../../lib/extractErrorMessage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(150, 'Username cannot exceed 150 characters')
    .regex(/^[\w.@+-]+$/, 'Letters, digits and @/./+/-/_ only'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  first_name: z.string().max(150).optional(),
  last_name: z.string().max(150).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        username: data.username.trim(),
        email: data.email?.trim() || undefined,
        first_name: data.first_name?.trim() || undefined,
        last_name: data.last_name?.trim() || undefined,
        password: data.password,
      };

      await authApi.register(payload);
      toast.success('Account created successfully! Please sign in.');
      navigate(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login');
    } catch (error) {
      const applied = applyServerErrors(error, setError);
      if (!applied) {
        const msg = extractErrorMessage(error, 'Could not create account. Please check your information.');
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-white/[0.08] bg-slate-900/70 backdrop-blur-md glow-hover-cyan shadow-[0_0_30px_-8px_rgba(6,182,212,0.15)]">
        <CardHeader className="text-center space-y-2 pb-6 border-b border-white/[0.08]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-2">
            <UserPlus className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">INITIALIZE CREDENTIALS</span>
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-white">Create Operator ID</CardTitle>
          <CardDescription className="text-xs font-mono text-slate-400">
            Register your operator credentials to allocate equipment &amp; enterprise hardware
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                placeholder="Aman"
                error={errors.first_name?.message}
                {...register('first_name')}
              />
              <Input
                label="Last Name"
                placeholder="Yadav"
                error={errors.last_name?.message}
                {...register('last_name')}
              />
            </div>

            <Input
              label="Operator Username"
              placeholder="e.g. amanyadav"
              autoComplete="username"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.username?.message}
              required
              {...register('username')}
            />

            <Input
              label="Communication Email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Security Passphrase"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              autoComplete="new-password"
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
              required
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-2"
            >
              Provision Account
            </Button>

            <div className="pt-4 text-center text-xs font-mono text-slate-400 border-t border-white/[0.08]">
              Existing operator?{' '}
              <Link
                to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
                className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline ml-1"
              >
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
