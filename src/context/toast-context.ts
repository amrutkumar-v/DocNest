import { createContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  title: string
  description?: string
  tone: ToastTone
}

export type ToastContextValue = {
  toasts: readonly Toast[]
  /** Shows a toast and auto-dismisses it. */
  notify: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
