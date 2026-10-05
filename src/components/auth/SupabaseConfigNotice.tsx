import { TriangleAlert } from 'lucide-react'

import { APP_NAME } from '@/lib/constants'

/**
 * Shown when the Supabase environment variables are missing.
 *
 * A misconfigured deployment must fail legibly rather than present a sign-in
 * button that cannot work, so this names the exact variables to provide.
 */
export function SupabaseConfigNotice({ missingEnvVars }: { missingEnvVars: readonly string[] }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5 py-12 sm:px-6">
      <div
        role="alert"
        className="w-full max-w-md rounded-panel border border-border bg-surface p-6 shadow-card"
      >
        <span
          aria-hidden="true"
          className="inline-flex size-10 items-center justify-center rounded-control bg-warning-subtle text-warning-foreground"
        >
          <TriangleAlert className="size-5" />
        </span>

        <h1 className="mt-4 text-lg font-semibold tracking-tight">{APP_NAME} needs configuration</h1>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
          Sign-in is not available because this deployment is missing its Supabase settings. Add the
          following variables to your environment and redeploy.
        </p>

        <ul className="mt-4 space-y-1.5">
          {missingEnvVars.map((name) => (
            <li
              key={name}
              className="rounded-control border border-border bg-surface-muted px-3 py-2 font-mono text-xs text-foreground"
            >
              {name}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-pretty text-subtle-foreground">
          Start from <code className="font-mono">.env.example</code>. Only browser-safe Supabase
          credentials belong there — never a service-role key.
        </p>
      </div>
    </div>
  )
}
