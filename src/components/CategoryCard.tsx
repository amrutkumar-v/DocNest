import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn, pluralize } from '@/lib/utils'

type CategoryCardProps = {
  icon: LucideIcon
  label: string
  blurb: string
  /** Always `0` in Phase 1 — no document records exist yet. */
  count: number
  className?: string
}

export function CategoryCard({ icon: Icon, label, blurb, count, className }: CategoryCardProps) {
  return (
    <Card
      className={cn(
        'group flex items-start gap-3.5 p-4 transition-colors hover:border-border-strong hover:bg-surface-hover',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground transition-colors group-hover:bg-brand-subtle group-hover:text-brand-subtle-foreground"
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">{label}</h3>
          <span className="shrink-0 text-xs font-medium text-subtle-foreground tabular-nums">
            {pluralize(count, 'document')}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{blurb}</p>
      </div>
    </Card>
  )
}