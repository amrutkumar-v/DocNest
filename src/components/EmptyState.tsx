import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  /** Optional primary call-to-action. */
  action?: ReactNode
  className?: string
}

/**
 * Intentional empty state: every phase-1 page explains what it is for,
 * why it is empty, and what will be possible later.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center sm:py-16', className)}>
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-full bg-brand-subtle text-brand-subtle-foreground"
      >
        <Icon className="size-6" />
      </span>

      <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>

      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  )
}