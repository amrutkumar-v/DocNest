import { cn } from '@/lib/utils'

type SwitchProps = {
  /** Fixed visual state. Phase 1 has no settings to persist yet. */
  checked?: boolean
  disabled?: boolean
  label: string
  className?: string
}

/**
 * Read-only switch used by future settings.
 *
 * Rendered as a real `role="switch"` button so screen readers announce the
 * state, but permanently disabled until the owning feature is built.
 */
export function Switch({ checked = false, disabled = true, label, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-brand' : 'bg-border-strong',
        disabled && 'cursor-not-allowed opacity-55',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-block size-5 rounded-full bg-white shadow-xs transition-transform',
          checked ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}