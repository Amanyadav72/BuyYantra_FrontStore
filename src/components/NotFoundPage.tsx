import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu } from 'lucide-react';
import { Button } from './ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-amber-400">
        <Cpu className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold font-heading text-slate-900">404</h1>
      <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        The requested URL was not found on the BuyYantra storefront.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
