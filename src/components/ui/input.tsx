import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type ?? 'text'}
      data-slot="input"
      className={cn(
        'h-10 w-full min-w-0 rounded-control border border-border bg-surface px-3',
        'text-sm text-foreground placeholder:text-subtle-foreground',
        'shadow-xs transition-[border-color,box-shadow] duration-[140ms]',
        'hover:border-border-strong',
        'focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/15 focus-visible:outline-none',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/15',
        'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-subtle-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'w-full min-w-0 rounded-control border border-border bg-surface px-3 py-2',
        'text-sm leading-relaxed text-foreground placeholder:text-subtle-foreground',
        'shadow-xs transition-[border-color,box-shadow] duration-[140ms]',
        'hover:border-border-strong',
        'focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/15 focus-visible:outline-none',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/15',
        'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-subtle-foreground',
        className,
      )}
      {...props}
    />
  )
}
