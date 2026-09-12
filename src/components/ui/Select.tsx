import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: Array<{ value: string | number; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            {label}
            {props.required && <span className="text-cyan-400 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none rounded-lg border bg-white dark:bg-slate-900/80 px-3.5 py-2 pr-10 text-sm text-slate-900 dark:text-slate-100 transition-all shadow-xs',
              'focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]',
              'disabled:bg-slate-100 dark:disabled:bg-slate-950/50 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed',
              error
                ? 'border-rose-500/80 focus:ring-rose-500 focus:border-rose-500'
                : 'border-slate-200 dark:border-white/10 hover:border-cyan-500/40',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error ? (
          <p className="text-xs font-medium text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
