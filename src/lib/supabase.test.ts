import { beforeEach, describe, expect, it, vi } from 'vitest'

const { loadSupabaseModule } = vi.hoisted(() => ({
  loadSupabaseModule: () => import('@/lib/supabase'),
}))

describe('@/lib/supabase', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('reports every missing variable instead of failing silently', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

    const module = await loadSupabaseModule()

    expect(module.supabase).toBeNull()
    expect(module.isSupabaseConfigured).toBe(false)
    expect(module.missingSupabaseEnvVars).toEqual([
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
    ])
  })

  it('treats whitespace-only values as missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '   ')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')

    const module = await loadSupabaseModule()

    expect(module.supabase).toBeNull()
    expect(module.missingSupabaseEnvVars).toEqual(['VITE_SUPABASE_URL'])
  })

  it('creates a client when both variables are present', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')

    const module = await loadSupabaseModule()

    expect(module.isSupabaseConfigured).toBe(true)
    expect(module.missingSupabaseEnvVars).toEqual([])
    expect(module.supabase).not.toBeNull()
    expect(typeof module.supabase?.auth.signInWithOAuth).toBe('function')
  })
})