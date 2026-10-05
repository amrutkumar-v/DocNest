import { BrandMark } from '@/components/layout/BrandMark'
import { APP_NAME } from '@/lib/constants'

/**
 * Minimal branded screen shown while the initial session is being resolved.
 *
 * Rendered instead of protected content so nothing flashes before
 * authentication is known, and instead of a redirect so no redirect loop can
 * occur. `role="status"` announces the wait to screen readers.
 */
export function AuthLoadingScreen({ message = 'Checking your session…' }: { message?: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <BrandMark className="size-12" />

      <div className="space-y-2">
        <p className="text-base font-semibold tracking-tight text-foreground">{APP_NAME}</p>
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>

      {/* Staggered dots: three short pulses read as "working", not as motion
          for its own sake. */}
      <span aria-hidden="true" className="flex gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-pulse rounded-full bg-brand"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    </div>
  )
}
