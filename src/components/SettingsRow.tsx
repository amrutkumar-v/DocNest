import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SettingsRowProps = {
  label: string
  description: string
  /** Interactive control, or a read-only value for not-yet-available settings. */
  control: ReactNode
  className?: string
}

/**
 * One labelled setting.
 *
 * Stacks on phones so the label is never squeezed beside a control, and keeps
 * the control in a fixed-width column from `sm` up so a column of rows stays
 * visually aligned.
 */
export function SettingsRow({ label, description, control, className }: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6',
        'transition-colors duration-[140ms]',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
      </div>

      <div className="flex shrink-0 items-center sm:w-56 sm:justify-end">{control}</div>
    </div>
  )
}
