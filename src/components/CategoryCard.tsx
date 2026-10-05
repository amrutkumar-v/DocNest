import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn, pluralize } from '@/lib/utils'

type CategoryCardProps = {
  icon: LucideIcon
  label: string
  blurb: string
  /** Documents currently filed under this category. */
  count: number
  className?: string
}

/**
 * One category, with the number of documents filed under it.
 *
 * The icon tile takes the brand tint only once the category is in use, so the
 * grid still reads as "nothing filed yet" when the vault is empty.
 */
export function CategoryCard({ icon: Icon, label, blurb, count, className }: CategoryCardProps) {
  const inUse = count > 0

  return (
    <Card
      className={cn(
        'group flex items-start gap-3.5 p-4',
        'transition-[border-color,background-color,box-shadow] duration-[140ms]',
        'hover:border-border-strong hover:bg-surface-hover hover:shadow-raised',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex size-10 shrink-0 items-center justify-center rounded-control',
          'transition-colors duration-[140ms]',
          inUse
            ? 'bg-brand-subtle text-brand-subtle-foreground'
            : 'bg-surface-muted text-subtle-foreground group-hover:text-muted-foreground',
        )}
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">{label}</h3>
          <span
            className={cn(
              'shrink-0 text-xs font-medium tabular-nums',
              inUse ? 'text-brand-subtle-foreground' : 'text-subtle-foreground',
            )}
          >
            {pluralize(count, 'document')}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-pretty text-muted-foreground">{blurb}</p>
      </div>
    </Card>
  )
}
