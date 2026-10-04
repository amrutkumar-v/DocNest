import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen'
import { useAuth } from '@/hooks/useAuth'

/**
 * Gate for public pages that must not be shown to signed-in users.
 *
 * When Supabase is unconfigured the child renders anyway, so the login page
 * can display its own configuration notice instead of a redirect loop.
 */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isConfigured, isLoading, user } = useAuth()

  if (!isConfigured) return <>{children}</>
  if (isLoading) return <AuthLoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />

  return <>{children}</>
}