import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type InlineAlertProps = {
  children: ReactNode
  tone?: 'error' | 'warning' | 'info' | 'success'
  className?: string
}

const TONE: Record<NonNullable<InlineAlertProps['tone']>, string> = {
  error: 'border-destructive/30 bg-destructive-subtle text-destructive-foreground',
  warning: 'border-warning/30 bg-warning-subtle text-warning-foreground',
  info: 'border-brand-border bg-brand-subtle text-brand-subtle-foreground',
  success: 'border-success/30 bg-success-subtle text-success-foreground',
}

/** Compact inline message used for form validation and other local failures. */
export function InlineAlert({ children, tone = 'error', className }: InlineAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-control border px-3 py-2.5',
        'text-sm leading-relaxed text-pretty',
        TONE[tone],
        className,
      )}
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0">{children}</span>
    </div>
  )
}
