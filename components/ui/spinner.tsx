import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner"; 