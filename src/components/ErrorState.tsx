import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorStateProps = {
  title: string
  description: string
  /** Retry callback; the retry button is omitted when absent. */
  onRetry?: () => void
  retryLabel?: string
  children?: ReactNode
  className?: string
}

/**
 * Full-region failure state.
 *
 * Never surfaces a raw exception: it states what broke in the user's terms and
 * offers the one action that can help.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  children,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center rounded-panel border border-border bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-full bg-destructive-subtle text-destructive"
      >
        <TriangleAlert className="size-6" />
      </span>

      <h3 className="mt-4 text-[0.9375rem] font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-pretty text-muted-foreground">
        {description}
      </p>

      {children ? <div className="mt-5">{children}</div> : null}

      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
