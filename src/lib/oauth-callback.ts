/**
 * OAuth callback helpers.
 *
 * Imported by `@/lib/supabase` *before* the client is constructed so that an
 * OAuth error left in the URL by the provider is captured while it is still
 * there. The Supabase client consumes and strips those parameters during its
 * own initialisation and does not surface the failure to application code.
 *
 * This module must stay free of side effects beyond reading the current URL.
 */

export type OAuthCallbackError = {
  /** Machine-readable code, e.g. `access_denied`. Used for logging only. */
  code: string | null
  /** Raw provider description. Never shown to users. */
  description: string | null
}

/**
 * Reads OAuth parameters from both the fragment (implicit flow) and the query
 * string (PKCE and provider errors).
 */
export function parseCallbackParams(search: string, hash: string): URLSearchParams {
  const fragment = (hash ?? '').replace(/^#/, '')

  return new URLSearchParams(`${fragment}&${(search ?? '').replace(/^\?/, '')}`)
}

function readCallbackParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams()

  const { search, hash } = window.location
  return parseCallbackParams(search, hash)
}

/**
 * OAuth error captured from the current URL, or `null` when the URL is not an
 * error callback. Evaluated once, at module load.
 */
export const oauthCallbackError: OAuthCallbackError | null = (() => {
  const params = readCallbackParams()
  const code = params.get('error')
  const description = params.get('error_description')

  if (!code && !description) return null

  return { code, description }
})()

/** Human-readable message for a captured OAuth callback error. */
export function describeOAuthCallbackError(error: OAuthCallbackError | null): string | null {
  if (!error) return null

  switch (error.code) {
    case 'access_denied':
      return 'Sign-in was cancelled before it finished. Please try again when you are ready.'
    case 'server_error':
    case 'temporarily_unavailable':
      return 'Google could not complete the sign-in right now. Please try again in a moment.'
    default:
      return "We couldn't complete sign-in with Google. Please try again."
  }
}

/**
 * URL Supabase returns to after a successful OAuth exchange.
 *
 * Must be allow-listed in the Supabase dashboard under
 * Authentication → URL Configuration → Redirect URLs.
 */
export function getAuthRedirectUrl(): string {
  if (typeof window === 'undefined') return '/'

  // Back to the app root, which DocNest resolves to the dashboard.
  return `${window.location.origin}/`
}