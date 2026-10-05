import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { AddDocumentButton } from '@/components/AddDocumentButton'
import { UserAvatar } from '@/components/auth/UserAvatar'
import { Brand } from '@/components/layout/Brand'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME, NAV_ITEMS } from '@/lib/constants'
import { NAV_ICONS } from '@/lib/icons'
import { getUserDisplayName, getUserEmail } from '@/lib/user'
import { cn } from '@/lib/utils'

/**
 * Desktop navigation rail. Hidden below the `lg` breakpoint, where the bottom
 * tab bar takes over.
 *
 * The rail carries the primary call to action, the four destinations, and the
 * signed-in account with its own sign-out — so every global action is reachable
 * without visiting Settings.
 */
export function Sidebar() {
  const { user, signOut, isSigningOut } = useAuth()

  const displayName = getUserDisplayName(user)
  const email = getUserEmail(user)

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Brand />
      </div>

      <div className="px-4 pt-5">
        <AddDocumentButton block />
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-5">
        <p className="px-3 pb-2 text-2xs font-semibold tracking-wider text-subtle-foreground uppercase">
          Menu
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon]

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-control px-3 py-2',
                      'text-sm font-medium transition-colors duration-[140ms]',
                      isActive
                        ? 'bg-brand-subtle text-brand-subtle-foreground'
                        : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* A short accent bar marks the active item without
                          shifting anything, so the rail never reflows. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute top-1/2 -left-4 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand transition-opacity duration-[140ms]',
                          isActive ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <Icon
                        aria-hidden="true"
                        className={cn(
                          'size-[1.125rem] shrink-0 transition-colors duration-[140ms]',
                          isActive ? 'text-brand' : 'text-subtle-foreground group-hover:text-foreground',
                        )}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-control px-2 py-2">
          <UserAvatar user={user} className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.8125rem] font-medium text-foreground">
              {displayName ?? 'Signed in'}
            </p>
            <p className="truncate text-xs text-subtle-foreground" title={email ?? undefined}>
              {email ?? APP_NAME}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => void signOut()}
          disabled={isSigningOut}
          aria-busy={isSigningOut}
          className="mt-1 w-full justify-start text-muted-foreground"
        >
          <LogOut aria-hidden="true" />
          {isSigningOut ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>
    </aside>
  )
}
