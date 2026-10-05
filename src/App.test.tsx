import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AppRoutes } from '@/App'
import { AddDocumentDialogProvider } from '@/components/AddDocumentDialogProvider'
import { ToastProvider } from '@/context/ToastProvider'
import { AuthProvider } from '@/context/AuthProvider'
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

/** Mirrors the provider stack in `App`, minus `BrowserRouter`. */
function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <ToastProvider>
          <AddDocumentDialogProvider>
            <AppRoutes />
          </AddDocumentDialogProvider>
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('protected routing', () => {
  let mock: SupabaseMockHandle

  beforeEach(async () => {
    mock = await getMock()
    mock.reset()

    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { origin: window.location.origin, assign: vi.fn(), search: '', hash: '' },
    })

    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.mocked(console.warn).mockRestore()
  })

  it('redirects a signed-out visitor from the dashboard to the login page', async () => {
    renderApp('/dashboard')

    expect(await screen.findByRole('button', { name: /continue with google/i })).toBeInTheDocument()
  })

  it.each(['/documents', '/categories', '/settings'])(
    'guards the %s route',
    async (path) => {
      renderApp(path)

      expect(await screen.findByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    },
  )

  it('keeps protected content hidden while the session is being resolved', async () => {
    let resolveSession: (value: { data: { session: null }; error: null }) => void = () => {}
    mock.auth.getSession.mockImplementation(
      () => new Promise((resolve) => (resolveSession = resolve)),
    )

    renderApp('/settings')

    expect(await screen.findByText(/checking your session/i)).toBeInTheDocument()
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()

    resolveSession({ data: { session: null }, error: null })

    expect(await screen.findByRole('button', { name: /continue with google/i })).toBeInTheDocument()
  })

  it('sends a signed-in user away from the login page to the dashboard', async () => {
    mock.setSession(createMockSession('grace@example.com', 'Grace Hopper'))

    renderApp('/login')

    expect(
      await screen.findByRole('heading', { name: /good (morning|afternoon|evening), grace/i }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /continue with google/i })).not.toBeInTheDocument()
  })

  it('resolves the app root to the dashboard for signed-in users', async () => {
    mock.setSession(createMockSession())

    renderApp('/')

    expect(
      await screen.findByRole('heading', { name: /good (morning|afternoon|evening)/i }),
    ).toBeInTheDocument()
  })

  it('lets signed-in users reach Settings and shows the account', async () => {
    mock.setSession(createMockSession('ada@example.com', 'Ada Lovelace'))

    renderApp('/settings')

    expect(await screen.findByRole('button', { name: /sign out/i })).toBeInTheDocument()
    expect(screen.getAllByText('Ada Lovelace').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Google')).not.toHaveLength(0)
  })

  it('returns to the login page after signing out', async () => {
    mock.setSession(createMockSession())

    renderApp('/settings')

    await userEvent.click(await screen.findByRole('button', { name: /sign out/i }))

    await waitFor(() => expect(mock.auth.signOut).toHaveBeenCalledTimes(1))

    expect(await screen.findByRole('button', { name: /continue with google/i })).toBeInTheDocument()
  })

  it('keeps the user signed in when sign-out fails', async () => {
    mock.setSession(createMockSession())
    mock.setSignOutResult({ message: 'network request failed' })

    renderApp('/settings')

    await userEvent.click(await screen.findByRole('button', { name: /sign out/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't sign you out/i)
    expect(screen.queryByRole('button', { name: /continue with google/i })).not.toBeInTheDocument()
  })

  it('starts the Google OAuth flow from the login page', async () => {
    renderApp('/login')

    await userEvent.click(await screen.findByRole('button', { name: /continue with google/i }))

    await waitFor(() => expect(mock.auth.signInWithOAuth).toHaveBeenCalledTimes(1))
    expect(mock.auth.signInWithOAuth.mock.calls[0][0].provider).toBe('google')
  })

  it('shows a configuration notice instead of a login button that cannot work', async () => {
    mock.setSession(null)
    mock.reset()
    // Simulate unconfigured by temporarily overriding the module
    vi.resetModules()
    vi.doMock('@/lib/supabase', async () => {
      const { createSupabaseModuleMock } = await import('@/test/supabase-mock')
      return createSupabaseModuleMock({ configured: false })
    })

    const { AuthProvider: Provider } = await import('@/context/AuthProvider')
    const { AppRoutes: Routes } = await import('@/App')
    const { AddDocumentDialogProvider: DialogProvider } = await import(
      '@/components/AddDocumentDialogProvider'
    )

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Provider>
          <DialogProvider>
            <Routes />
          </DialogProvider>
        </Provider>
      </MemoryRouter>,
    )

    expect(await screen.findByText(/VITE_SUPABASE_URL/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /continue with google/i })).not.toBeInTheDocument()

    vi.doUnmock('@/lib/supabase')
    vi.resetModules()
    // Restore original mock behavior for subsequent tests
    vi.doMock('@/lib/supabase', async () => {
      const { createSupabaseModuleMock } = await import('@/test/supabase-mock')
      return createSupabaseModuleMock()
    })
  })

  it('shows a not-found page for unknown routes once signed in', async () => {
    vi.resetModules()
    vi.doMock('@/lib/supabase', async () => {
      const { createSupabaseModuleMock } = await import('@/test/supabase-mock')
      return createSupabaseModuleMock()
    })

    const { AuthProvider: Provider } = await import('@/context/AuthProvider')
    const { AppRoutes: Routes } = await import('@/App')
    const { AddDocumentDialogProvider: DialogProvider } = await import(
      '@/components/AddDocumentDialogProvider'
    )
    const supabaseModule = await import('@/lib/supabase')
    const testMock = (supabaseModule as unknown as { __mock?: SupabaseMockHandle }).__mock
    if (testMock) {
      testMock.reset()
      testMock.setSession(createMockSession())
    }

    render(
      <MemoryRouter initialEntries={['/nope']}>
        <Provider>
          <DialogProvider>
            <Routes />
          </DialogProvider>
        </Provider>
      </MemoryRouter>,
    )

    expect(await screen.findByText(/page not found/i)).toBeInTheDocument()
    expect(screen.getByText(/does not exist in DocNest/i)).toBeInTheDocument()

    vi.doUnmock('@/lib/supabase')
    vi.resetModules()
    vi.doMock('@/lib/supabase', async () => {
      const { createSupabaseModuleMock } = await import('@/test/supabase-mock')
      return createSupabaseModuleMock()
    })
  })
})