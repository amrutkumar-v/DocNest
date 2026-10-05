import { cn } from '@/lib/utils'

type SwitchProps = {
  /** Visual and announced state. */
  checked?: boolean
  /** Omit only for settings whose feature has not shipped yet. */
  disabled?: boolean
  /** Accessible name, since the switch itself has no visible text. */
  label: string
  /** Optional visible label rendered next to the control. */
  description?: string
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

/**
 * Accessible switch built on a real `role="switch"` button.
 *
 * `disabled` renders the control as unavailable — used for settings that are
 * visible but not yet functional, so nothing silently does nothing.
 */
export function Switch({
  checked = false,
  disabled = false,
  label,
  description,
  onCheckedChange,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={description ? `${label}. ${description}` : label}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full',
        'transition-colors duration-[140ms]',
        checked ? 'bg-brand' : 'bg-border-strong',
        'disabled:cursor-not-allowed disabled:opacity-55',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm',
          'transition-transform duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          checked ? 'translate-x-[1.375rem]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}
