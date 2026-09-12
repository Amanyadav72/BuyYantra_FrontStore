import React from 'react';
import { cn } from '../../lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/90 dark:bg-slate-800/80', className)}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-2.5 sm:p-4 space-y-2.5 sm:space-y-3 shadow-xs dark:shadow-none">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-2 pt-1">
        <div className="flex gap-1.5">
          <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 rounded-full" />
          <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 sm:h-5 w-4/5" />
        <Skeleton className="h-3 sm:h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 sm:h-6 w-14 sm:w-20" />
          <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
