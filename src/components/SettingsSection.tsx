import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SettingsSectionProps = {
  icon: LucideIcon
  title: string
  description: string
  /** Short badge such as "Phase 2" to mark future functionality. */
  badge?: string
  children: ReactNode
  className?: string
}

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
      <div className="flex items-start gap-3 border-b border-border p-5">
        <span
          aria-hidden="true"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground"
        >
          <Icon className="size-[1.125rem]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            {badge ? (
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-subtle-foreground">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="divide-y divide-border">{children}</div>
    </Card>
  )
}