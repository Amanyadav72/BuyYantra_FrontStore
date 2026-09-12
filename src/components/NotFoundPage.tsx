import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu } from 'lucide-react';
import { Button } from './ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-5">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <Cpu className="h-10 w-10 animate-pulse" />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">ERROR CODE // 0x404</span>
        <h1 className="text-5xl font-extrabold font-heading text-white">404</h1>
      </div>
      <h2 className="text-xl font-bold font-mono text-slate-200">COORDINATE NOT FOUND</h2>
      <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
        The requested routing node does not exist in the ShopHub telemetry registry.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            RETURN TO COMMAND CENTER
          </Button>
        </Link>
      </div>
    </div>
  );
};
