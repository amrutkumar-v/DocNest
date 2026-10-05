import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-panel border border-border bg-surface shadow-card',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'flex items-center justify-between gap-4 px-5 py-4',
        className,
      )}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="card-title"
      className={cn('text-[0.9375rem] leading-tight font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm text-pretty text-muted-foreground', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-5 pb-5', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center gap-2 border-t border-border px-5 py-4', className)}
      {...props}
    />
  )
}
