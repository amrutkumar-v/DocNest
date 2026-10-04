import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen'
import { SupabaseConfigNotice } from '@/components/auth/SupabaseConfigNotice'
import { useAuth } from '@/hooks/useAuth'

/**
 * Gate for every authenticated route.
 *
 * Order matters:
 *  1. unconfigured  -> explain, never redirect into a login that cannot work
 *  2. still loading -> hold back protected content so nothing flashes
 *  3. signed out    -> go to /login
 *
 * The attempted path is passed along in router state for future use; the
 * current Phase 2 flow always lands on the dashboard after sign-in.
 */
export function RequireAuth() {
  const { isConfigured, missingEnvVars, isLoading, user } = useAuth()
  const location = useLocation()

  if (!isConfigured) return <SupabaseConfigNotice missingEnvVars={missingEnvVars} />
  if (isLoading) return <AuthLoadingScreen />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <Outlet />
}