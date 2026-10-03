import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: number | string
  icon: LucideIcon
  /** Short explanation of what this number will mean once data exists. */
  hint: string
  className?: string
}

export function StatCard({ label, value, icon: Icon, hint, className }: StatCardProps) {
  return (
    <Card className={cn('p-4 transition-shadow hover:shadow-popover sm:p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-balance text-muted-foreground">{label}</p>
        <span
          aria-hidden="true"
          className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground sm:inline-flex"
        >
          <Icon className="size-[1.125rem]" />
        </span>
      </div>
      <p className="mt-2 text-3xl leading-none font-semibold tracking-tight tabular-nums sm:mt-3">
        {value}
      </p>
      {/* The hint keeps its context on wider screens; mobile keeps the grid compact. */}
      <p className="mt-2.5 hidden text-xs leading-relaxed text-subtle-foreground sm:block">
        {hint}
      </p>
    </Card>
  )
}