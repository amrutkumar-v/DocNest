import { NavLink } from 'react-router-dom'

import { NAV_ITEMS } from '@/lib/constants'
import { NAV_ICONS } from '@/lib/icons'
import { cn } from '@/lib/utils'

/**
 * Bottom tab bar for small screens.
 *
 * Replaces the desktop sidebar entirely rather than shrinking it, and keeps
 * every primary destination one tap away without a hamburger menu. Touch
 * targets are the full tab height, well past the 44px minimum.
 */
export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/85 backdrop-blur-lg lg:hidden',
      )}
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
                    'flex h-16 flex-col items-center justify-center gap-1 px-1 text-[0.6875rem] font-medium',
                    'transition-colors duration-[140ms]',
                    isActive ? 'text-brand' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'inline-flex size-8 items-center justify-center rounded-full transition-colors duration-[140ms]',
                        isActive && 'bg-brand-subtle text-brand-subtle-foreground',
                      )}
                    >
                      <Icon className="size-[1.125rem]" />
                    </span>
                    <span className="truncate">{item.label}</span>
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
