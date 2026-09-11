import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../../api/endpoints/auth';
import { extractErrorMessage } from '../../lib/extractErrorMessage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      await authApi.requestPasswordReset({ email: data.email });
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('Password reset instructions sent');
    } catch (error) {
      const msg = extractErrorMessage(error, 'Unable to process reset request.');
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
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">Reset Password</CardTitle>
          <CardDescription>
            Enter the email associated with your account to receive reset instructions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-semibold text-slate-900">Check your inbox</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  If an account exists for <span className="font-semibold text-slate-800">{submittedEmail}</span>,
                  you will receive an email containing a link with your reset token.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link to="/login">
                  <Button variant="outline" fullWidth leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                Send Reset Link
              </Button>

              <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-100">
                Remember your password?{' '}
                <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
