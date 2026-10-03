import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg',
    'text-sm font-medium transition-[background-color,color,box-shadow,transform]',
    'disabled:pointer-events-none disabled:opacity-55',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-brand-foreground shadow-xs hover:bg-brand-hover active:translate-y-px',
        secondary:
          'border border-border bg-surface text-foreground shadow-xs hover:bg-surface-hover active:translate-y-px',
        ghost: 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
        subtle: 'bg-brand-subtle text-brand-subtle-foreground hover:bg-brand-subtle/70',
        danger: 'border border-border bg-surface text-foreground shadow-xs hover:bg-surface-hover',
      },
      size: {
        sm: 'h-9 px-3 [&_svg]:size-4',
        md: 'h-10 px-4 [&_svg]:size-4',
        lg: 'h-11 px-5 text-[0.9375rem] [&_svg]:size-[1.125rem]',
        icon: 'size-10 [&_svg]:size-[1.125rem]',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element instead of a `<button>` (e.g. a router link). */
    asChild?: boolean
  }

export function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...props}
    />
  )
}