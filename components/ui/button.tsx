import { cn } from '@/lib/utils';
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-900 shadow-soft',
    secondary: 'bg-white text-ink-900 border border-ink-200 hover:bg-ink-50 hover:border-ink-300',
    ghost: 'text-ink-700 hover:text-ink-900 hover:bg-ink-100',
    outline: 'border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white',
  };

  const sizes = {
    sm: 'h-9 px-4 text-[13px] rounded-[10px]',
    md: 'h-11 px-5 text-[14px] rounded-[12px]',
    lg: 'h-[48px] px-7 text-[15px] rounded-[12px]',
  };

  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
