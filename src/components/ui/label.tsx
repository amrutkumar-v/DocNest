import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn('block text-sm font-medium text-foreground select-none', className)}
      {...props}
    />
  )
}

/** Small explanatory or validation line rendered under a field. */
export function FieldHint({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-hint"
      className={cn('text-xs leading-relaxed text-muted-foreground text-pretty', className)}
      {...props}
    />
  )
}
