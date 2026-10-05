import { Search, X } from 'lucide-react'
import { useId } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type SearchBarProps = {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  /** Renders the control as unavailable, for filters that are not active yet. */
  disabled?: boolean
  /** Hint shown under the field while the control is disabled. */
  disabledHint?: string
  className?: string
}

/**
 * Labelled search field with an inline clear button.
 *
 * Controlled when `onChange` is supplied, uncontrolled otherwise, so it can
 * back both a live filter and a not-yet-wired placeholder.
 */
export function SearchBar({
  label = 'Search documents',
  placeholder = 'Search your documents',
  value,
  onChange,
  disabled = false,
  disabledHint,
  className,
}: SearchBarProps) {
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const isControlled = onChange !== undefined
  const currentValue = isControlled ? (value ?? '') : undefined

  return (
    <div className={cn('w-full min-w-0', className)}>
      <Label htmlFor={inputId} className="sr-only">
        {label}
      </Label>

      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle-foreground"
        />
        <Input
          id={inputId}
          type="search"
          name="document-search"
          placeholder={placeholder}
          disabled={disabled}
          value={currentValue}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          aria-describedby={disabled && disabledHint ? hintId : undefined}
          className={cn(
            'pr-9 pl-9',
            // The native clear affordance duplicates our own button.
            '[&::-webkit-search-cancel-button]:appearance-none',
            disabled && 'cursor-not-allowed bg-surface-muted text-subtle-foreground',
          )}
        />

        {isControlled && !disabled && currentValue ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange('')}
            className="absolute top-1/2 right-1 -translate-y-1/2 text-subtle-foreground hover:text-foreground"
          >
            <X aria-hidden="true" />
            <span className="sr-only">Clear search</span>
          </Button>
        ) : null}
      </div>

      {disabled && disabledHint ? (
        <p id={hintId} className="mt-2 text-xs leading-relaxed text-subtle-foreground">
          {disabledHint}
        </p>
      ) : null}
    </div>
  )
}
