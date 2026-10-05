import { Link } from 'react-router-dom'

import { BrandMark } from '@/components/layout/BrandMark'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'
import { cn } from '@/lib/utils'

type BrandProps = {
  /** Show the "Your documents, organized." positioning line. */
  tagline?: boolean
  className?: string
}

/** Wordmark. Links home so the app is always one click from the dashboard. */
export function Brand({ tagline = false, className }: BrandProps) {
  return (
    <Link
      to="/dashboard"
      className={cn(
        'group inline-flex min-w-0 items-center gap-2.5 rounded-control text-left',
        className,
      )}
    >
      <BrandMark className="transition-transform duration-[140ms] group-hover:scale-[1.03]" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
          {APP_NAME}
        </span>
        {tagline ? (
          <span className="mt-1 truncate text-xs text-muted-foreground">{APP_TAGLINE}</span>
        ) : null}
      </span>
    </Link>
  )
}
