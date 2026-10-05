import { ChevronDown } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Native `<select>` styled to match the app.
 *
 * The native control is intentional: it gives keyboard and mobile platform
 * behaviour for free, which matters more here than a custom listbox.
 */
export function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className={cn('relative', className)}>
      <select
        data-slot="select"
        className={cn(
          'h-10 w-full appearance-none rounded-control border border-border bg-surface',
          'pr-9 pl-3 text-sm text-foreground shadow-xs',
          'transition-[border-color,box-shadow] duration-[140ms]',
          'hover:border-border-strong',
          'focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/15 focus-visible:outline-none',
          'aria-invalid:border-destructive',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-subtle-foreground',
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-subtle-foreground"
      />
    </div>
  )
}
