import { GoogleMark } from '@/components/auth/GoogleMark'
import { SupabaseConfigNotice } from '@/components/auth/SupabaseConfigNotice'
import { BrandMark } from '@/components/layout/BrandMark'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'

/**
 * Sign-in screen.
 *
 * Google OAuth is handled entirely by Supabase — there is no password form and
 * DocNest never sees Google credentials.
 */
export default function Login() {
  usePageTitle('Sign in')

  const { isConfigured, missingEnvVars, isSigningIn, error, clearError, signInWithGoogle } = useAuth()

  if (!isConfigured) return <SupabaseConfigNotice missingEnvVars={missingEnvVars} />

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-5 py-10 sm:px-6">
      <main className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <BrandMark className="size-12" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{APP_NAME}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{APP_TAGLINE}</p>
        </div>

        <div className="mt-8 rounded-app border border-border bg-surface p-6 shadow-card">
          <h2 className="text-base font-semibold tracking-tight">Sign in to your vault</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Your documents stay private to your account. Use your Google account to continue.
          </p>

          {error ? (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-sm leading-relaxed text-foreground"
            >
              {error}
            </div>
          ) : null}

          <Button
            variant="secondary"
            size="lg"
            block
            className="mt-5"
            disabled={isSigningIn}
            aria-busy={isSigningIn}
            onClick={() => {
              clearError()
              void signInWithGoogle()
            }}
          >
            <GoogleMark className="size-[1.125rem]" />
            {isSigningIn ? 'Opening Google…' : 'Continue with Google'}
          </Button>

          <p className="mt-4 text-xs leading-relaxed text-subtle-foreground">
            You will be taken to Google to confirm your identity. DocNest never sees or stores your
            Google password.
          </p>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-subtle-foreground">
          By continuing you agree that DocNest may store the documents you add to your personal
          vault.
        </p>
      </main>
    </div>
  )
}