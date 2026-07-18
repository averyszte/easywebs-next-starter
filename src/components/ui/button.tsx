import * as React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-brand text-brand-fg hover:bg-brand-hover',
  outline: 'border border-border text-heading hover:bg-surface-muted',
  ghost: 'text-muted hover:bg-surface-muted hover:text-heading',
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'focus-visible:ring-brand inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
