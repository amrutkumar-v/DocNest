import { Link } from 'react-router-dom'

import { BrandMark } from '@/components/layout/BrandMark'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'
import { cn } from '@/lib/utils'

type BrandProps = {
  /** Show the "Your documents, organized." positioning line. */
  tagline?: boolean
  className?: string
}

export function Brand({ tagline = false, className }: BrandProps) {
  return (
    <Link
      to="/dashboard"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-lg text-left transition-opacity hover:opacity-90',
        className,
      )}
    >
      <BrandMark />
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