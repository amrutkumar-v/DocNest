import { NavLink } from 'react-router-dom'

import { AddDocumentButton } from '@/components/AddDocumentButton'
import { Brand } from '@/components/layout/Brand'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME, APP_VERSION, NAV_ITEMS } from '@/lib/constants'
import { NAV_ICONS } from '@/lib/icons'
import { getUserEmail } from '@/lib/user'
import { cn } from '@/lib/utils'

function navItemClassName({ isActive }: { isActive: boolean }) {
  return cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-subtle text-brand-subtle-foreground'
      : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
  )
}

/** Desktop navigation rail. Hidden below the `lg` breakpoint. */
export function Sidebar() {
  const { user } = useAuth()
  const accountLabel = getUserEmail(user) ?? 'Signed in'

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Brand />
      </div>

      <div className="px-4 pt-5">
        <AddDocumentButton block />
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-5">
        <p className="px-3 pb-2 text-xs font-semibold tracking-wider text-subtle-foreground uppercase">
          Menu
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon]

            return (
              <li key={item.to}>
                <NavLink to={item.to} className={navItemClassName}>
                  {({ isActive }) => (
                    <>
                      <Icon
                        aria-hidden="true"
                        className={cn('size-[1.125rem]', isActive && 'text-brand')}
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

      <div className="shrink-0 border-t border-border px-5 py-4">
        <p className="truncate text-xs font-medium text-muted-foreground">
          {APP_NAME} v{APP_VERSION}
        </p>
        <p className="mt-1.5 truncate text-xs text-subtle-foreground" title={accountLabel}>
          {accountLabel}
        </p>
      </div>
    </aside>
  )
}