import React from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

    const variants = {
      primary:
        'bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 focus:ring-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.3)] hover:shadow-[0_0_24px_rgba(6,182,212,0.45)]',
      secondary:
        'bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:opacity-90 border border-[var(--border-subtle)] focus:ring-slate-400',
      outline:
        'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-cyan-500/60 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30 focus:ring-cyan-500',
      ghost:
        'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus:ring-cyan-500',
      danger:
        'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500 border border-rose-500/30 shadow-xs',
      accent:
        'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold hover:brightness-105 focus:ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-base px-6 py-2.5 gap-2.5 h-12',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size === 'lg' ? 'md' : 'sm'} />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
