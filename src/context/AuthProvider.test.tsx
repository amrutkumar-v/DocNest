import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthProvider } from '@/context/AuthProvider'
import { useAuth } from '@/hooks/useAuth'
import { createMockSession, type SupabaseMockHandle } from '@/test/supabase-mock'

vi.mock('@/lib/supabase', async () => {
  const { createSupabaseModuleMock } = await import('@/test/supabase-mock')
  return createSupabaseModuleMock()
})

async function getMock(): Promise<SupabaseMockHandle> {
  const mod = (await import('@/lib/supabase')) as unknown as { __mock?: SupabaseMockHandle }
  if (!mod.__mock) throw new Error('supabase mock not initialized')
  return mod.__mock
}

/** Surfaces the whole auth context so every field can be asserted. */
function AuthProbe() {
  const auth = useAuth()

  return (
    <div>
      <p data-testid="user">{auth.user?.email ?? 'signed-out'}</p>
      <p data-testid="loading">{String(auth.isLoading)}</p>
      <p data-testid="signing-in">{String(auth.isSigningIn)}</p>
      <p data-testid="signing-out">{String(auth.isSigningOut)}</p>
      <p data-testid="error">{auth.error ?? 'no-error'}</p>
      <button type="button" onClick={() => void auth.signInWithGoogle()}>
        sign in
      </button>
      <button type="button" onClick={() => void auth.signOut()}>
        sign out
      </button>
      <button type="button" onClick={auth.clearError}>
        clear
      </button>
    </div>
  )
}

function renderProbe() {
  return render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
  )
}

describe('AuthProvider', () => {
  let mock: SupabaseMockHandle
  let assign: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    mock = await getMock()
    mock.reset()

    assign = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { origin: window.location.origin, assign },
    })

    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.mocked(console.warn).mockRestore()
  })

  it('shows the loading state until the session has been resolved', async () => {
    let resolveSession: (value: { data: { session: null }; error: null }) => void = () => {}
    mock.auth.getSession.mockImplementation(
      () => new Promise((resolve) => (resolveSession = resolve)),
    )

    renderProbe()

    expect(screen.getByTestId('loading')).toHaveTextContent('true')

    await act(async () => {
      resolveSession({ data: { session: null }, error: null })
    })

    expect(screen.getByTestId('loading')).toHaveTextContent('false')
  })

  it('restores a persisted session on startup', async () => {
    mock.setSession(createMockSession())

    renderProbe()

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))
    expect(screen.getByTestId('user')).toHaveTextContent('ada@example.com')
  })

  it('surfaces a session restore failure without leaking internals', async () => {
    mock.setSession(null, { message: 'refresh token is malformed' })

    renderProbe()

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))
    expect(screen.getByTestId('error')).toHaveTextContent("We couldn't verify your session")
    expect(screen.getByTestId('error')).not.toHaveTextContent('refresh token')
    expect(screen.getByTestId('user')).toHaveTextContent('signed-out')
  })

  it('keeps the session in sync from the single auth listener', async () => {
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))

    expect(mock.listenerCount()).toBe(1)

    await act(async () => {
      mock.emit('SIGNED_IN', createMockSession('grace@example.com'))
    })

    expect(screen.getByTestId('user')).toHaveTextContent('grace@example.com')

    await act(async () => {
      mock.emit('SIGNED_OUT', null)
    })

    expect(screen.getByTestId('user')).toHaveTextContent('signed-out')
  })

  it('unsubscribes on unmount', async () => {
    const { unmount } = renderProbe()
    await waitFor(() => expect(mock.listenerCount()).toBe(1))

    unmount()

    expect(mock.unsubscribeCalls()).toBe(1)
    expect(mock.listenerCount()).toBe(0)
  })

  it('sends the user to Google with an allow-listed redirect', async () => {
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))

    await userEvent.click(screen.getByRole('button', { name: 'sign in' }))

    await waitFor(() => expect(mock.auth.signInWithOAuth).toHaveBeenCalledTimes(1))

    const options = mock.auth.signInWithOAuth.mock.calls[0][0]
    expect(options.provider).toBe('google')
    expect(options.options.redirectTo).toBe(`${window.location.origin}/`)
    expect(options.options.skipBrowserRedirect).toBe(true)
    expect(assign).toHaveBeenCalledWith('https://accounts.google.com/o/oauth2/v2/auth?client_id=test')
  })

  it('reports an OAuth failure and stays usable for a retry', async () => {
    mock.setOAuthResult({ error: { message: 'Provider is not enabled' } })
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))

    await userEvent.click(screen.getByRole('button', { name: 'sign in' }))

    await waitFor(() =>
      expect(screen.getByTestId('error')).toHaveTextContent("couldn't sign you in with Google"),
    )
    expect(screen.getByTestId('signing-in')).toHaveTextContent('false')
    expect(assign).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'sign in' })).toBeEnabled()
  })

  it('reports a missing provider URL instead of hanging', async () => {
    mock.setOAuthResult({ url: null })
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))

    await userEvent.click(screen.getByRole('button', { name: 'sign in' }))

    await waitFor(() => expect(screen.getByTestId('signing-in')).toHaveTextContent('false'))
    expect(screen.getByTestId('error')).toHaveTextContent("couldn't sign you in with Google")
    expect(assign).not.toHaveBeenCalled()
  })

  it('completes sign-out and resets state on the SIGNED_OUT event', async () => {
    mock.setSession(createMockSession())
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('ada@example.com'))

    await userEvent.click(screen.getByRole('button', { name: 'sign out' }))

    expect(mock.auth.signOut).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('signed-out'))
    expect(screen.getByTestId('signing-out')).toHaveTextContent('false')
    expect(screen.getByTestId('error')).toHaveTextContent('no-error')
  })

  it('keeps the user signed in and shows an error when sign-out fails', async () => {
    mock.setSession(createMockSession())
    mock.setSignOutResult({ message: 'network request failed' })
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('ada@example.com'))

    await userEvent.click(screen.getByRole('button', { name: 'sign out' }))

    await waitFor(() =>
      expect(screen.getByTestId('error')).toHaveTextContent("couldn't sign you out"),
    )
    expect(screen.getByTestId('user')).toHaveTextContent('ada@example.com')
    expect(screen.getByTestId('signing-out')).toHaveTextContent('false')
  })

  it('ignores a second sign-out click while one is already in flight', async () => {
    mock.setSession(createMockSession())
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('ada@example.com'))

    const signOutButton = screen.getByRole('button', { name: 'sign out' })
    mock.holdSignOut()
    await userEvent.click(signOutButton)
    await waitFor(() => expect(screen.getByTestId('signing-out')).toHaveTextContent('true'))

    await userEvent.click(signOutButton)

    expect(mock.auth.signOut).toHaveBeenCalledTimes(1)
    mock.releaseSignOut()
    await waitFor(() => expect(screen.getByTestId('signing-out')).toHaveTextContent('false'))
  })

  it('clears a previous error on demand', async () => {
    mock.setOAuthResult({ error: { message: 'Provider is not enabled' } })
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))

    await userEvent.click(screen.getByRole('button', { name: 'sign in' }))
    await waitFor(() => expect(screen.getByTestId('error')).not.toHaveTextContent('no-error'))

    await userEvent.click(screen.getByRole('button', { name: 'clear' }))

    expect(screen.getByTestId('error')).toHaveTextContent('no-error')
  })
})

describe('AuthProvider without Supabase configuration', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('@/lib/supabase', async () => {
      const { createSupabaseModuleMock } = await import('@/test/supabase-mock')
      return createSupabaseModuleMock({ configured: false })
    })
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase')
    vi.resetModules()
  })

  it('stays out of a loading loop and reports the missing variables', async () => {
    const { AuthProvider: Provider } = await import('@/context/AuthProvider')
    const { useAuth: useAuthHook } = await import('@/hooks/useAuth')

    function Probe() {
      const auth = useAuthHook()
      return (
        <div>
          <p data-testid="loading">{String(auth.isLoading)}</p>
          <p data-testid="configured">{String(auth.isConfigured)}</p>
          <p data-testid="missing">{auth.missingEnvVars.join(', ')}</p>
        </div>
      )
    }

    render(
      <Provider>
        <Probe />
      </Provider>,
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('configured')).toHaveTextContent('false')
    expect(screen.getByTestId('missing')).toHaveTextContent('VITE_SUPABASE_URL')
  })
})