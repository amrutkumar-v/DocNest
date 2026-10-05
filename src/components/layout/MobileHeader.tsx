import { Link } from 'react-router-dom'

import { AddDocumentButton } from '@/components/AddDocumentButton'
import { UserAvatar } from '@/components/auth/UserAvatar'
import { Brand } from '@/components/layout/Brand'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

/**
 * Compact top bar shown on small screens in place of the desktop sidebar.
 *
 * Keeps the account reachable on mobile without adding a hamburger menu: the
 * avatar links straight to Settings, where sign-out lives.
 */
export function MobileHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-4">
        <Brand />

        <div className="flex shrink-0 items-center gap-1">
          <Button asChild variant="ghost" size="icon">
            <Link to="/settings" aria-label="Account and settings">
              <UserAvatar user={user} className="size-6 text-2xs" />
            </Link>
          </Button>
          <AddDocumentButton size="icon" aria-label="Add document" />
        </div>
      </div>
    </header>
  )
}
