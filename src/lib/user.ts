import type { User } from '@supabase/supabase-js'

/**
 * Helpers for reading display information straight from the authenticated
 * Supabase user.
 *
 * Phase 2 has no `profiles` table, so these values come only from the session's
 * own user object (Google-provided claims) — nothing extra is stored.
 */

type Metadata = User['user_metadata']

/** Reads the first non-empty string from a list of metadata keys. */
function readMetadataString(metadata: Metadata, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value: unknown = metadata[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  return null
}

/** Full display name, with sensible fallbacks. */
export function getUserDisplayName(user: User | null): string | null {
  if (!user) return null

  return (
    readMetadataString(user.user_metadata, ['full_name', 'name']) ??
    getUserEmail(user) ??
    null
  )
}

/** First name only, used to personalise the dashboard greeting. */
export function getUserFirstName(user: User | null): string | null {
  const displayName = getUserDisplayName(user)
  if (!displayName) return null

  // Google sometimes returns a single given name; `split` is a no-op then.
  const [firstName] = displayName.split(/\s+/).filter(Boolean)
  return firstName ?? null
}

export function getUserEmail(user: User | null): string | null {
  return user?.email?.trim() || null
}

export function getUserAvatarUrl(user: User | null): string | null {
  if (!user) return null

  return readMetadataString(user.user_metadata, ['avatar_url', 'picture'])
}

/** Initials for the avatar fallback, e.g. "Ana Silva" → "AS". */
export function getUserInitials(user: User | null): string | null {
  const displayName = getUserDisplayName(user)
  if (!displayName) return null

  const parts = displayName.split(/\s+/).filter(Boolean).slice(0, 2)
  if (parts.length === 0) return null

  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join('')
  return /[A-Z0-9]/.test(initials) ? initials : null
}

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
}

/** Human-readable name of the identity provider that authenticated the user. */
export function getUserProviderLabel(user: User | null): string | null {
  const provider = user?.app_metadata?.provider
  if (typeof provider !== 'string' || !provider) return 'Unknown provider'

  return PROVIDER_LABELS[provider] ?? 'Unknown provider'
}