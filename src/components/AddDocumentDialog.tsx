import { FileUp, ShieldCheck } from 'lucide-react'

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

type AddDocumentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Phase 1 placeholder for document upload.
 *
 * Deliberately performs no upload, no progress simulation and no storage
 * writes. Real upload arrives in Phase 3.
 */
export function AddDocumentDialog({ open, onOpenChange }: AddDocumentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <span
            aria-hidden="true"
            className="mb-1 inline-flex size-10 items-center justify-center rounded-app bg-brand-subtle text-brand-subtle-foreground"
          >
            <FileUp className="size-5" />
          </span>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>
            Document uploading will be available in the next phase.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-app border border-border bg-surface-muted p-4">
          <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>
              Your documents will eventually be stored securely in your personal vault, and only
              visible to you.
            </span>
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}