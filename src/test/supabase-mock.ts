import { vi } from 'vitest'

/**
 * Test double for `@/lib/supabase`.
 *
 * The real module constructs a live client from environment variables and opens
 * no sockets until it is called, but tests must still control session restore,
 * OAuth start and sign-out deterministically — so every test that touches the
 * auth layer mocks this module with `createSupabaseModuleMock()`.
 */

export type MockAuthEvent =
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'

export type MockSession = Record<string, unknown> | null

type AuthCallback = (event: MockAuthEvent, session: MockSession) => void

export type SupabaseMockHandle = {
  /** Stubs the result of `auth.getSession()`. */
  setSession(session: MockSession, error?: { message: string } | null): void
  /** Stubs the provider URL returned by `auth.signInWithOAuth()`. */
  setOAuthResult(result: { url?: string | null; error?: { message: string } | null }): void
  /** Stubs the result of `auth.signOut()`. */
  setSignOutResult(error: { message: string } | null): void
  /**
   * Makes `auth.signOut()` hang, so in-flight behaviour can be observed.
   * Call `releaseSignOut()` to let it finish.
   */
  holdSignOut(): void
  releaseSignOut(): void
  /** Pushes an auth state change to the provider's listener. */
  emit(event: MockAuthEvent, session: MockSession): void
  /** How many listeners the provider currently has open. */
  listenerCount(): number
  /** Whether the provider unsubscribed when it unmounted. */
  unsubscribeCalls(): number
  auth: {
    getSession: ReturnType<typeof vi.fn>
    signInWithOAuth: ReturnType<typeof vi.fn>
    signOut: ReturnType<typeof vi.fn>
    onAuthStateChange: ReturnType<typeof vi.fn>
  }
  /** Restores default happy-path behaviour. */
  reset(): void
}

export type SupabaseMockModule = {
  supabase: unknown
  isSupabaseConfigured: boolean
  missingSupabaseEnvVars: readonly string[]
  /** Test-only handle, not part of the real module's surface. */
  __mock: SupabaseMockHandle
}

/** Builds the object returned by `vi.mock('@/lib/supabase', …)`. */
export function createSupabaseModuleMock(options?: { configured?: boolean }): SupabaseMockModule {
  const configured = options?.configured ?? true

  const listeners = new Set<AuthCallback>()
  let unsubscribeCallCount = 0

  let sessionResult: { session: MockSession; error: { message: string } | null } = {
    session: null,
    error: null,
  }
  let oauthResult: { url: string | null; error: { message: string } | null } = {
    url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=test',
    error: null,
  }
  let signOutResult: { error: { message: string } | null } = { error: null }
  let signOutGate: { promise: Promise<void>; release: () => void } | null = null

  const auth = {
    getSession: vi.fn(async () => ({ data: { session: sessionResult.session }, error: sessionResult.error })),
    signInWithOAuth: vi.fn(async () => ({
      data: { url: oauthResult.url, provider: 'google' },
      error: oauthResult.error,
    })),
    signOut: vi.fn(async () => {
      if (signOutGate) await signOutGate.promise

      // The real client emits SIGNED_OUT once the session is cleared, which is
      // what resets the provider's signing-out flag.
      if (!signOutResult.error) emit('SIGNED_OUT', null)

      return signOutResult
    }),
    onAuthStateChange: vi.fn((callback: AuthCallback) => {
      listeners.add(callback)
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              unsubscribeCallCount += 1
              listeners.delete(callback)
            },
          },
        },
      }
    }),
  }

  function emit(event: MockAuthEvent, session: MockSession) {
    for (const callback of [...listeners]) callback(event, session)
  }

  function createSignOutGate() {
    let release = () => {}
    const promise = new Promise<void>((resolve) => {
      release = resolve
    })
    return { promise, release }
  }

  const handle: SupabaseMockHandle = {
    auth,
    setSession(session, error = null) {
      sessionResult = { session, error }
    },
    setOAuthResult(result) {
      oauthResult = { url: result.url ?? null, error: result.error ?? null }
    },
    setSignOutResult(error) {
      signOutResult = { error }
    },
    holdSignOut() {
      signOutGate = createSignOutGate()
    },
    releaseSignOut() {
      signOutGate?.release()
      signOutGate = null
    },
    emit,
    listenerCount: () => listeners.size,
    unsubscribeCalls: () => unsubscribeCallCount,
    reset() {
      listeners.clear()
      // `mockReset` (not `mockClear`) so the default happy-path implementations
      // replace anything a previous test stubbed via `mockImplementation`.
      unsubscribeCallCount = 0
      signOutGate = null
      auth.getSession.mockReset()
      auth.signInWithOAuth.mockReset()
      auth.signOut.mockReset()
      auth.onAuthStateChange.mockReset()
      sessionResult = { session: null, error: null }
      oauthResult = {
        url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=test',
        error: null,
      }
      signOutResult = { error: null }
    },
  }

  return {
    supabase: configured ? { auth } : null,
    isSupabaseConfigured: configured,
    missingSupabaseEnvVars: configured ? [] : ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'],
    __mock: handle,
  }
}

/** Builds a minimal Supabase session object for assertions. */
export function createMockSession(
  email = 'ada@example.com',
  fullName = 'Ada Lovelace',
): Record<string, unknown> {
  return {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: {
      id: 'user-123',
      email,
      user_metadata: {
        full_name: fullName,
        name: fullName,
        avatar_url: 'https://lh3.googleusercontent.com/a/avatar',
        picture: 'https://lh3.googleusercontent.com/a/avatar',
        sub: 'user-123',
      },
      app_metadata: { provider: 'google', providers: ['google'] },
    },
  }
}