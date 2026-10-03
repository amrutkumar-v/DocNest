import { NavLink } from 'react-router-dom'

import { NAV_ITEMS } from '@/lib/constants'
import { NAV_ICONS } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * Bottom tab bar for small screens.
 *
 * Replaces the desktop sidebar entirely rather than shrinking it, and keeps
 * every primary destination one tap away without a hamburger menu.
 */
export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.icon]

          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors',
                    isActive ? 'text-brand' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'inline-flex size-8 items-center justify-center rounded-lg transition-colors',
                        isActive && 'bg-brand-subtle text-brand-subtle-foreground',
                      )}
                    >
                      <Icon aria-hidden="true" className="size-[1.125rem]" />
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}