import { cn } from '@/lib/utils'

/**
 * A single shimmering placeholder block.
 *
 * Opacity-only animation, so it never triggers layout or paint work on the
 * main thread while data is loading.
 */
export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="skeleton" aria-hidden="true" className={cn('skeleton', className)} {...props} />
}

/** Screen-reader-only status text announced while a region is loading. */
export function LoadingLabel({ children = 'Loading' }: { children?: React.ReactNode }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {children}
    </span>
  )
}

/** Placeholder matching the dashboard's four-up stat grid. */
export function StatCardSkeleton() {
  return (
    <div className="rounded-panel border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="size-9 rounded-control" />
      </div>
      <Skeleton className="mt-3 h-8 w-14" />
      <Skeleton className="mt-3 h-3 w-full max-w-[10rem]" />
    </div>
  )
}

/** Placeholder matching one document card in the vault grid. */
export function DocumentCardSkeleton() {
  return (
    <div className="rounded-panel border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-control" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-1/3" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-20 rounded-control" />
        <Skeleton className="h-9 w-20 rounded-control" />
      </div>
    </div>
  )
}

/** Placeholder matching one row of the dashboard's recent-documents list. */
export function DocumentRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <Skeleton className="size-9 shrink-0 rounded-control" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-3 w-16 shrink-0" />
    </div>
  )
}
