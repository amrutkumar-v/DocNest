import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Imported first on purpose: see the note in `oauth-callback.ts`.
import { oauthCallbackError } from '@/lib/oauth-callback'

/**
 * Browser-safe Supabase client.
 *
 * Only the Supabase project URL and the anon / publishable key are used here —
 * both are designed to be public. Never add a service-role key, database
 * password or OAuth client secret to a `VITE_` variable: everything in this
 * bundle is readable by anyone who loads the app.
 */

function readEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

const supabaseUrl = readEnvValue(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = readEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY)

/**
 * Names of the environment variables that still need to be provided.
 * Surfaced in the UI so a misconfigured deployment fails loudly and legibly
 * instead of silently breaking sign-in.
 */
export const missingSupabaseEnvVars: readonly string[] = [
  ...(supabaseUrl ? [] : ['VITE_SUPABASE_URL']),
  ...(supabaseAnonKey ? [] : ['VITE_SUPABASE_ANON_KEY']),
]

export const isSupabaseConfigured = missingSupabaseEnvVars.length === 0

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          // Keeps the session across refreshes (Supabase default, stated
          // explicitly because Phase 2 depends on it).
          persistSession: true,
          autoRefreshToken: true,
          // Required for the OAuth redirect flow: Supabase reads the callback
          // fragment/query itself and turns it into a session.
          detectSessionInUrl: true,
        },
      })
    : null

if (!isSupabaseConfigured) {
  console.warn(
    `[auth] Supabase is not configured. Missing environment variables: ${missingSupabaseEnvVars.join(', ')}. ` +
      'Copy .env.example to .env.local and fill in your project credentials.',
  )
}

if (oauthCallbackError) {
  console.warn(
    `[auth] Google sign-in returned an error (code: ${oauthCallbackError.code ?? 'unknown'}).`,
  )
}