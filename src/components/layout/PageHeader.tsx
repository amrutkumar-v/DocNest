import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  /** Right-aligned actions; stacks below the title on small screens. */
  actions?: ReactNode
  /** Small label above the title, e.g. the active section. */
  eyebrow?: string
  className?: string
}

/**
 * Standard page heading: eyebrow, title, description and actions.
 *
 * Every page uses this, so the distance between the header and the first piece
 * of content is identical throughout the app.
 */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-2xs font-semibold tracking-wider text-subtle-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-xl font-semibold tracking-tight text-pretty text-foreground sm:text-2xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
