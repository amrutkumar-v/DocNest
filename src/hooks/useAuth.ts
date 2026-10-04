import { useContext } from 'react'

import { AuthContext, type AuthContextValue } from '@/context/auth-context'

/**
 * Read the shared authentication state.
 *
 * Must be used inside `<AuthProvider>`, which is mounted once in `App`.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}