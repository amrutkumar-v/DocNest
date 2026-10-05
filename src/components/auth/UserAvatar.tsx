import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

import { getUserAvatarUrl, getUserInitials } from '@/lib/user'
import { cn } from '@/lib/utils'

type UserAvatarProps = {
  user: User | null
  className?: string
}

/**
 * Google profile picture with an initials fallback.
 *
 * The remote image is treated as untrusted presentation: if it is missing or
 * fails to load, the avatar degrades to initials instead of a broken icon.
 */
export function UserAvatar({ user, className }: UserAvatarProps) {
  const avatarUrl = getUserAvatarUrl(user)
  const [failed, setFailed] = useState(false)

  // A new user means a new image to try, so clear the previous failure.
  useEffect(() => setFailed(false), [avatarUrl])

  const initials = getUserInitials(user)
  const showImage = Boolean(avatarUrl) && !failed

  const base = cn(
    'inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full',
    'bg-brand-subtle text-xs font-semibold text-brand-subtle-foreground',
    className,
  )

  if (!showImage) {
    return (
      <span aria-hidden="true" className={base}>
        {initials ?? '—'}
      </span>
    )
  }

  return (
    <span className={base}>
      <img
        src={avatarUrl ?? undefined}
        alt=""
        width={36}
        height={36}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
    </span>
  )
}
