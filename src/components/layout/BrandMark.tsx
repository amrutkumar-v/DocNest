import { cn } from '@/lib/utils'

/**
 * The DocNest mark: a document sheet inside a rounded tile.
 *
 * Kept as one small, self-contained SVG so the mark can be swapped later
 * without touching any layout code.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-[0.625rem] bg-brand text-brand-foreground',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-5" fill="none">
        <path
          d="M11 8.5h6.6L22 12.9V22a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 10 22V10a1.5 1.5 0 0 1 1-1.5Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        <path
          d="M17.4 8.6V13H22"
          stroke="var(--brand)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M12.8 16.4h6.4M12.8 19.2h4.2"
          stroke="var(--brand)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}