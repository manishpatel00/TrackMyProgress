import React from 'react';
import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: number;
};

export default function ColorfulDiv({ className, variant, ...props }: Props) {
  const variants = [
    'card-variant-1',
    'card-variant-2',
    'card-variant-3',
    'card-variant-4',
  ];

  const chosen = variant && variant > 0 && variant <= variants.length ? variants[variant - 1] : variants[Math.floor(Math.random() * variants.length)];

  return <div className={cn('transition-all duration-300 transform-gpu hover:shadow-2xl hover:scale-105', chosen, className)} {...props} />;
}
