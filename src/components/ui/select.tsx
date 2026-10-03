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
          'h-10 w-full appearance-none rounded-lg border border-border bg-surface',
          'pr-9 pl-3 text-sm text-foreground',
          'transition-[border-color,box-shadow] focus-visible:border-brand',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-100',
          'disabled:text-subtle-foreground',
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