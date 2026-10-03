import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type ?? 'text'}
      data-slot="input"
      className={cn(
        'h-10 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-sm text-foreground',
        'placeholder:text-subtle-foreground',
        'transition-[border-color,box-shadow] focus-visible:border-brand',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}