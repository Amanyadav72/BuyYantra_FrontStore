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
      <Card className="w-full max-w-md border-white/[0.08] bg-slate-900/70 backdrop-blur-md glow-hover-cyan shadow-[0_0_30px_-8px_rgba(6,182,212,0.15)]">
        <CardHeader className="text-center space-y-2 pb-6 border-b border-white/[0.08]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-2">
            <Mail className="h-6 w-6" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">KEY RECOVERY</span>
          </div>
          <CardTitle className="text-2xl font-bold font-heading text-white">Recover Passphrase</CardTitle>
          <CardDescription className="text-xs font-mono text-slate-400">
            Transmit reset token to registered operator communication email
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {isSubmitted ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-semibold font-mono text-white">RECOVERY TOKEN DISPATCHED</h4>
                <p className="text-xs font-mono text-slate-400 leading-relaxed max-w-xs mx-auto">
                  If an operator record exists for <span className="font-semibold text-cyan-300">{submittedEmail}</span>,
                  security instructions have been transmitted.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                <Link to="/login">
                  <Button variant="outline" fullWidth leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Return to Login Terminal
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Registered Communication Email"
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading}>
                Dispatch Recovery Token
              </Button>

              <div className="pt-4 text-center text-xs font-mono text-slate-400 border-t border-white/[0.08]">
                Remember passphrase?{' '}
                <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline ml-1">
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
