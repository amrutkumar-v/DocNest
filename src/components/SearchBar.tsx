import { Search } from 'lucide-react'
import { useId } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type SearchBarProps = {
  label?: string
  placeholder?: string
  /**
   * Phase 1 ships the control without behaviour, so it renders disabled by
   * default rather than pretending to filter a vault that has no documents.
   */
  disabled?: boolean
  className?: string
}

export function SearchBar({
  label = 'Search documents',
  placeholder = 'Search your documents',
  disabled = true,
  className,
}: SearchBarProps) {
  const inputId = useId()

  return (
    <div className={cn('w-full', className)}>
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
          aria-describedby={disabled ? `${inputId}-hint` : undefined}
          className="pl-9 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-subtle-foreground"
        />
      </div>
      {disabled ? (
        <p id={`${inputId}-hint`} className="mt-2 text-xs text-subtle-foreground">
          Search arrives once your vault has documents.
        </p>
      ) : null}
    </div>
  )
}