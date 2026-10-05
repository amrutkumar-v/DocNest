import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SettingsSectionProps = {
  icon: LucideIcon
  title: string
  description: string
  /** Short badge marking functionality that has not shipped yet. */
  badge?: string
  children: ReactNode
  className?: string
}

/** One group of related settings: header, then a divided list of rows. */
export function SettingsSection({
  icon: Icon,
  title,
  description,
  badge,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-start gap-3 border-b border-border px-5 py-4">
        <span
          aria-hidden="true"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-surface-muted text-muted-foreground"
        >
          <Icon className="size-[1.125rem]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[0.9375rem] leading-tight font-semibold tracking-tight">{title}</h2>
            {badge ? <Badge tone="neutral">{badge}</Badge> : null}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="divide-y divide-border">{children}</div>
    </Card>
  )
}
