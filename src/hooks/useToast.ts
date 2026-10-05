import { useContext } from 'react'

import { ToastContext, type ToastContextValue } from '@/context/toast-context'

/** Show a transient message. Must be used inside `<ToastProvider>`. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider')
  }

  return context
}
