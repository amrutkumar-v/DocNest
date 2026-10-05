import { Calendar, Eye, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { ExpiryBadge } from '@/components/documents/ExpiryBadge'
import { FileTypeIcon } from '@/components/documents/FileTypeIcon'
import { Button } from '@/components/ui/button'
import type { Document } from '@/lib/documents'
import { formatBytes, formatDate } from '@/lib/utils'

type DocumentCardProps = {
  document: Document
  onView: (document: Document) => void
  onEditExpiry: (document: Document) => void
  onDelete: (document: Document) => void
  /** Any action in flight for this document, so its buttons can be disabled. */
  busy?: boolean
}

/**
 * One document in the vault grid.
 *
 * Title and file name lead, then a single metadata line, then expiry, then a
 * fixed action row — so every card in the grid has the same shape and the
 * controls always land in the same place.
 */
export function DocumentCard({
  document,
  onView,
  onEditExpiry,
  onDelete,
  busy = false,
}: DocumentCardProps) {
  return (
    <article className="group flex flex-col rounded-panel border border-border bg-surface p-4 shadow-card transition-[border-color,box-shadow] duration-[140ms] hover:border-border-strong hover:shadow-raised sm:p-5">
      <div className="flex items-start gap-3">
        <FileTypeIcon document={document} />

        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-sm leading-snug font-semibold tracking-tight text-foreground"
            title={document.title}
          >
            {document.title}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground" title={document.file_name}>
            {document.file_name}
          </p>
        </div>
      </div>

      <dl className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-subtle-foreground">
        <Chip>{document.category}</Chip>
        <dt className="sr-only">File size</dt>
        <dd>{formatBytes(document.file_size)}</dd>
        <dt className="sr-only">Date added</dt>
        <dd>Added {formatDate(document.created_at)}</dd>
      </dl>

      <div className="mt-3">
        <ExpiryBadge expiresAt={document.expires_at} />
      </div>

      <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onView(document)}
          disabled={busy}
        >
          <Eye aria-hidden="true" />
          View
          <span className="sr-only">{document.title}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEditExpiry(document)}
          disabled={busy}
        >
          <Calendar aria-hidden="true" />
          <span className="sr-only">Edit expiry date for {document.title}</span>
        </Button>

        <Button
          variant="danger-ghost"
          size="icon-sm"
          onClick={() => onDelete(document)}
          disabled={busy}
        >
          <Trash2 aria-hidden="true" />
          <span className="sr-only">Delete {document.title}</span>
        </Button>
      </div>
    </article>
  )
}

/** Inline metadata chip, kept local so the card stays dependency-light. */
function Chip({ children }: { children: ReactNode }) {
  return (
    <dt>
      <dd className="inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-2xs font-medium text-muted-foreground">
        {children}
      </dd>
    </dt>
  )
}
