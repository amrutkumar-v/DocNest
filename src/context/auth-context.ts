import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

/**
 * The single source of truth for authentication state.
 *
 * Created here (rather than in the provider file) so the context object and the
 * `useAuth` hook can be imported without pulling in a component module.
 */
export type AuthContextValue = {
  /** The signed-in Supabase user, or `null` when signed out. */
  user: User | null
  /** The current Supabase session, or `null` when signed out. */
  session: Session | null
  /** `true` until the initial session has been resolved. */
  isLoading: boolean
  /** `true` while a Google sign-in is being started. */
  isSigningIn: boolean
  /** `true` while a sign-out request is in flight. */
  isSigningOut: boolean
  /** `false` when the Supabase environment variables are missing. */
  isConfigured: boolean
  /** Names of the missing environment variables, when unconfigured. */
  missingEnvVars: readonly string[]
  /** A user-facing authentication error, or `null`. */
  error: string | null
  clearError: () => void
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

/** Message used whenever Supabase is unavailable at runtime. */
export const SUPABASE_UNAVAILABLE_MESSAGE =
  'Sign-in is unavailable right now. Please try again in a moment.'