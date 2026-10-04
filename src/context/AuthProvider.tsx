import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import {
  AuthContext,
  type AuthContextValue,
  SUPABASE_UNAVAILABLE_MESSAGE,
} from '@/context/auth-context'
import { describeOAuthCallbackError, getAuthRedirectUrl, oauthCallbackError } from '@/lib/oauth-callback'
import { isSupabaseConfigured, missingSupabaseEnvVars, supabase } from '@/lib/supabase'

const SIGN_IN_ERROR_MESSAGE = "We couldn't sign you in with Google. Please try again."
const SIGN_OUT_ERROR_MESSAGE = "We couldn't sign you out. Please try again."
const SESSION_ERROR_MESSAGE =
  "We couldn't verify your session. Please refresh the page and try again."

/**
 * Logs a Supabase failure without ever touching tokens, session objects or
 * credential material — only the library's own error message.
 */
function logAuthFailure(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.warn(`[auth] ${scope} failed: ${message}`)
}

type AuthProviderProps = {
  children: ReactNode
}

/**
 * Owns the only Supabase auth subscription in the app.
 *
 * Responsibilities:
 *  - resolve the persisted session on startup (survives refreshes)
 *  - keep state in sync via a single `onAuthStateChange` listener
 *  - start and finish Google OAuth and sign-out
 *
 * Session and user are never duplicated into local state: the user is derived
 * from the session so the two can never drift apart.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthContextValue['session']>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(() =>
    describeOAuthCallbackError(oauthCallbackError),
  )

  useEffect(() => {
    if (!supabase) {
      // Nothing to resolve without a client; `isLoading` starts as false so the
      // app shows the configuration notice instead of an endless spinner.
      return
    }

    let active = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return

      // Intentionally synchronous: awaiting other Supabase calls inside this
      // callback can deadlock the auth client.
      setSession(nextSession)
      setIsLoading(false)

      if (event === 'SIGNED_OUT') {
        setError(null)
        setIsSigningOut(false)
      }
    })

    // `onAuthStateChange` emits INITIAL_SESSION once the persisted session has
    // been read, but resolve explicitly as well so a silent listener failure
    // can never leave the app stuck on the loading screen.
    void supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return

        if (sessionError) {
          logAuthFailure('session restore', sessionError)
          setError(SESSION_ERROR_MESSAGE)
        }

        setSession(data.session)
        setIsLoading(false)
      })
      .catch((sessionError: unknown) => {
        if (!active) return
        logAuthFailure('session restore', sessionError)
        setIsLoading(false)
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      setError(SUPABASE_UNAVAILABLE_MESSAGE)
      return
    }

    setIsSigningIn(true)
    setError(null)

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl(),
          // Navigate explicitly so a missing provider URL is handled as a normal
          // error instead of a silent no-op.
          skipBrowserRedirect: true,
        },
      })

      if (oauthError || !data?.url) {
        logAuthFailure('google sign-in', oauthError ?? new Error('No provider URL returned'))
        setError(describeOAuthCallbackError(oauthCallbackError) ?? SIGN_IN_ERROR_MESSAGE)
        setIsSigningIn(false)
        return
      }

      // Full-page navigation to Google. Supabase completes the flow and returns
      // to `redirectTo`, where `detectSessionInUrl` exchanges the response for
      // a session and the listener above picks it up.
      window.location.assign(data.url)
    } catch (signInError) {
      logAuthFailure('google sign-in', signInError)
      setError(SIGN_IN_ERROR_MESSAGE)
      setIsSigningIn(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) {
      setError(SUPABASE_UNAVAILABLE_MESSAGE)
      return
    }

    if (isSigningOut) return

    setIsSigningOut(true)
    setError(null)

    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        logAuthFailure('sign-out', signOutError)
        setError(SIGN_OUT_ERROR_MESSAGE)
        setIsSigningOut(false)
      }
      // On success the SIGNED_OUT event clears the session and resets the flag.
    } catch (signOutError) {
      logAuthFailure('sign-out', signOutError)
      setError(SIGN_OUT_ERROR_MESSAGE)
      setIsSigningOut(false)
    }
  }, [isSigningOut])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      isSigningIn,
      isSigningOut,
      isConfigured: isSupabaseConfigured,
      missingEnvVars: missingSupabaseEnvVars,
      error,
      clearError,
      signInWithGoogle,
      signOut,
    }),
    [session, isLoading, isSigningIn, isSigningOut, error, clearError, signInWithGoogle, signOut],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}