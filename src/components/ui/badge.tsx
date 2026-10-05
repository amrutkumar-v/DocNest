import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-muted text-muted-foreground',
        brand: 'bg-brand-subtle text-brand-subtle-foreground',
        success: 'bg-success-subtle text-success-foreground',
        warning: 'bg-warning-subtle text-warning-foreground',
        danger: 'bg-destructive-subtle text-destructive-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-2xs',
        md: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'sm' },
  },
)

export type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone, size }), className)} {...props} />
}
