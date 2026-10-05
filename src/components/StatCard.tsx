import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: number | string
  icon: LucideIcon
  /** Short explanation of what this number means. */
  hint?: string
  /** Tints the icon tile, used to distinguish the few meaningful states. */
  tone?: 'brand' | 'warning' | 'neutral'
  className?: string
}

const TONE: Record<NonNullable<StatCardProps['tone']>, string> = {
  brand: 'bg-brand-subtle text-brand-subtle-foreground',
  warning: 'bg-warning-subtle text-warning-foreground',
  neutral: 'bg-surface-muted text-muted-foreground',
}

/**
 * Dashboard metric.
 *
 * The label leads, the number is the loudest element, and the hint explains the
 * number rather than repeating the label.
 */
export function StatCard({ label, value, icon: Icon, hint, tone = 'neutral', className }: StatCardProps) {
  return (
    <Card
      className={cn(
        'group p-4 transition-[border-color,box-shadow] duration-[140ms] sm:p-5',
        'hover:border-border-strong hover:shadow-raised',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.8125rem] leading-snug font-medium text-pretty text-muted-foreground">
          {label}
        </p>
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-9 shrink-0 items-center justify-center rounded-control transition-colors duration-[140ms]',
            TONE[tone],
          )}
        >
          <Icon className="size-[1.125rem]" />
        </span>
      </div>

      <p className="mt-2 text-3xl leading-none font-semibold tracking-tight tabular-nums">{value}</p>

      {hint ? (
        <p className="mt-2.5 text-xs leading-relaxed text-pretty text-subtle-foreground">{hint}</p>
      ) : null}
    </Card>
  )
}
