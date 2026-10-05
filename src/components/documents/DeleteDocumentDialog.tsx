import { useEffect, useState } from 'react'

import { InlineAlert } from '@/components/InlineAlert'
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
import { deleteDocument, type Document } from '@/lib/documents'
import { notifyDocumentsChanged } from '@/lib/documents-events'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'

type DeleteDocumentDialogProps = {
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Confirmation for a destructive, irreversible action.
 *
 * The delete button is deliberately styled as destructive, and the title names
 * the document so nobody deletes the wrong file.
 */
export function DeleteDocumentDialog({ document, open, onOpenChange }: DeleteDocumentDialogProps) {
  const { notify } = useToast()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) return
    setError(null)
    setDeleting(false)
  }, [open])

  async function handleDelete() {
    if (!document || !supabase) return

    setDeleting(true)
    setError(null)

    const title = document.title

    try {
      await deleteDocument(supabase, document)
      notifyDocumentsChanged()
      notify({
        tone: 'success',
        title: 'Document deleted',
        description: `${title} was removed from your vault.`,
      })
      onOpenChange(false)
    } catch {
      setError('We could not delete this document. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this document?</DialogTitle>
          <DialogDescription>
            {document
              ? `“${document.title}” and its file will be permanently removed from your vault. This cannot be undone.`
              : 'This document will be permanently removed from your vault. This cannot be undone.'}
          </DialogDescription>
        </DialogHeader>

        {error ? <InlineAlert>{error}</InlineAlert> : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={deleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="danger" onClick={handleDelete} disabled={deleting} aria-busy={deleting}>
            {deleting ? 'Deleting…' : 'Delete document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
