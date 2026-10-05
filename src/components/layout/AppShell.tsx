import { Outlet, useLocation } from 'react-router-dom'

import { MobileHeader } from '@/components/layout/MobileHeader'
import { MobileNav } from '@/components/layout/MobileNav'
import { Sidebar } from '@/components/layout/Sidebar'

/**
 * Application shell: fixed desktop rail, compact mobile header, bottom tab bar
 * and a single scrollable content column.
 */
export function AppShell() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-popover focus:ring-2 focus:ring-brand"
      >
        Skip to content
      </a>

      <Sidebar />

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <MobileHeader />

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pt-10 lg:pb-16"
        >
          {/* Remounting on pathname change gives each page a soft entrance. */}
          <div key={pathname} className="animate-enter">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
