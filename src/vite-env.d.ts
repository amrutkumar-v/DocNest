/// <reference types="vite/client" />

/**
 * Typed access to DocNest's build-time environment variables.
 *
 * Vite only exposes variables prefixed with `VITE_`, and only to the browser
 * bundle — so nothing here may ever hold a server-only secret.
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}