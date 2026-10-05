import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ToastContext, type Toast, type ToastContextValue, type ToastTone } from '@/context/toast-context'
import { cn } from '@/lib/utils'

/** How long a toast stays up before dismissing itself. */
const DISMISS_AFTER = 5000

const TONE_ICON: Record<ToastTone, typeof CircleCheck> = {
  success: CircleCheck,
  error: TriangleAlert,
  info: Info,
}

const TONE_CLASS: Record<ToastTone, string> = {
  success: 'text-success',
  error: 'text-destructive',
  info: 'text-brand',
}

/**
 * Lightweight toast stack.
 *
 * Toasts are announced through a polite live region, dismiss on a timer, and
 * pause that timer while the pointer is over the stack so a message cannot
 * vanish before it has been read.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly Toast[]>([])
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current.slice(-2), { ...toast, id }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), DISMISS_AFTER),
      )
    },
    [dismiss],
  )

  // Clear any pending timers if the provider itself unmounts.
  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss])

  return (
    <ToastContext value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-60 flex flex-col items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] lg:items-end lg:px-6 lg:pb-6"
        role="region"
        aria-label="Notifications"
      >
        <div aria-live="polite" aria-atomic="false" className="contents">
          {toasts.map((toast) => {
            const Icon = TONE_ICON[toast.tone]

            return (
              <div
                key={toast.id}
                role={toast.tone === 'error' ? 'alert' : 'status'}
                className={cn(
                  'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-panel',
                  'border border-border bg-surface px-4 py-3 shadow-popover',
                  'animate-toast-in',
                )}
              >
                <Icon aria-hidden="true" className={cn('mt-px size-4 shrink-0', TONE_CLASS[toast.tone])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-0.5 text-xs leading-relaxed text-pretty text-muted-foreground">
                      {toast.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="-mt-0.5 -mr-1 inline-flex size-6 shrink-0 items-center justify-center rounded text-subtle-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  <X aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">Dismiss notification</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </ToastContext>
  )
}
