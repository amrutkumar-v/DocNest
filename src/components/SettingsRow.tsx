import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SettingsRowProps = {
  label: string
  description: string
  /** Interactive control, or a read-only value for future-only settings. */
  control: ReactNode
  className?: string
}

export function SettingsRow({ label, description, control, className }: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="shrink-0 sm:w-56 sm:text-right">{control}</div>
    </div>
  )
}