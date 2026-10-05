import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  /** Optional primary call-to-action. */
  action?: ReactNode
  /** Renders tighter when nested inside a card body. */
  compact?: boolean
  className?: string
}

/**
 * Empty state.
 *
 * Always answers three things: what this area is, why it is empty, and what
 * the user can do next.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center px-6 text-center',
        compact ? 'py-10 sm:py-12' : 'py-14 sm:py-20',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-full bg-surface-muted text-muted-foreground"
      >
        <Icon className="size-6" />
      </span>

      <h3 className="mt-4 text-[0.9375rem] font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-pretty text-muted-foreground">
        {description}
      </p>

      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  )
}
