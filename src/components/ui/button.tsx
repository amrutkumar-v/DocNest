import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
    'rounded-control font-medium select-none',
    'transition-[background-color,border-color,color,box-shadow,transform,opacity]',
    'duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
    'active:not-disabled:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-55',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-brand-foreground shadow-xs hover:bg-brand-hover active:bg-brand-active',
        secondary:
          'border border-border bg-surface text-foreground shadow-xs hover:border-border-strong hover:bg-surface-hover active:bg-surface-muted',
        ghost:
          'text-muted-foreground hover:bg-surface-muted hover:text-foreground active:bg-surface-sunken',
        subtle:
          'bg-brand-subtle text-brand-subtle-foreground hover:bg-brand-subtle/70 active:bg-brand-subtle',
        danger:
          'bg-destructive text-white shadow-xs hover:bg-destructive-hover active:bg-destructive-hover dark:text-destructive-foreground',
        'danger-ghost':
          'text-destructive hover:bg-destructive-subtle dark:hover:bg-destructive-subtle/70',
        link: 'text-brand underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 gap-1.5 px-3 text-[0.8125rem] [&_svg]:size-4',
        md: 'h-10 px-4 text-sm [&_svg]:size-4',
        lg: 'h-11 px-5 text-[0.9375rem] [&_svg]:size-[1.125rem]',
        icon: 'size-10 [&_svg]:size-[1.125rem]',
        'icon-sm': 'size-9 [&_svg]:size-4',
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

export { buttonVariants }
