import { Download, ExternalLink, FileWarning, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { getDocumentSignedUrl, type Document } from '@/lib/documents'
import { supabase } from '@/lib/supabase'
import { formatBytes, formatDateTime } from '@/lib/utils'

type ViewDocumentDialogProps = {
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Preview and download for a single document.
 *
 * The signed URL is requested per open and discarded on close, so a link
 * cannot outlive the session it was minted for. While it resolves, a skeleton
 * holds the preview's dimensions so opening the dialog causes no layout shift.
 */
export function ViewDocumentDialog({ document, open, onOpenChange }: ViewDocumentDialogProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !document || !supabase) return

    let cancelled = false
    setLoading(true)
    setError(null)
    setUrl(null)

    getDocumentSignedUrl(supabase, document.storage_path, 60 * 60)
      .then((signedUrl) => {
        if (!cancelled) setUrl(signedUrl)
      })
      .catch(() => {
        if (!cancelled) setError('We could not load a preview for this document.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, document])

  const isImage = document?.mime_type.startsWith('image/')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{document?.title ?? 'View document'}</DialogTitle>
          <DialogDescription>
            {document
              ? `${document.file_name} · ${formatBytes(document.file_size)} · added ${formatDateTime(document.created_at)}`
              : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-panel border border-border bg-surface-sunken">
          {loading ? (
            <div className="flex h-[min(60vh,26rem)] flex-col items-center justify-center gap-3">
              <Skeleton className="h-[min(52vh,22rem)] w-full rounded-none" />
              <span role="status" className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                Preparing preview…
              </span>
            </div>
          ) : error ? (
            <div className="flex h-[min(60vh,26rem)] flex-col items-center justify-center gap-3 px-6 text-center">
              <FileWarning aria-hidden="true" className="size-8 text-subtle-foreground" />
              <p className="text-sm text-pretty text-muted-foreground">{error}</p>
              {url ? (
                <Button asChild variant="secondary" size="sm">
                  <a href={url} target="_blank" rel="noreferrer">
                    <ExternalLink aria-hidden="true" />
                    Open in a new tab
                  </a>
                </Button>
              ) : null}
            </div>
          ) : url && document ? (
            isImage ? (
              <img
                src={url}
                alt={document.title}
                className="mx-auto max-h-[min(60vh,26rem)] w-auto object-contain"
              />
            ) : (
              <iframe
                src={url}
                title={`Preview of ${document.title}`}
                className="h-[min(60vh,26rem)] w-full border-0"
              />
            )
          ) : (
            <div className="flex h-[min(60vh,26rem)] items-center justify-center text-sm text-muted-foreground">
              No preview is available for this file type.
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          {url && document ? (
            <Button asChild variant="primary">
              <a href={url} download={document.file_name}>
                <Download aria-hidden="true" />
                Download
              </a>
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
