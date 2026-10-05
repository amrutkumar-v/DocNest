import { CalendarDays, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

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
import { FieldHint, Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/useToast'
import { updateDocument, validateExpiryDate, type Document } from '@/lib/documents'
import { notifyDocumentsChanged } from '@/lib/documents-events'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

type EditExpiryDialogProps = {
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Date input wants `YYYY-MM-DD`; the column stores a full timestamp. */
function toDateInputValue(iso: string | null) {
  return iso ? iso.slice(0, 10) : ''
}

/** Sets the expiry to the last instant of the chosen day, in local time. */
function toExpiryTimestamp(dateValue: string) {
  return new Date(`${dateValue}T23:59:59`).toISOString()
}

/** Set or clear a document's expiry date. */
export function EditExpiryDialog({ document, open, onOpenChange }: EditExpiryDialogProps) {
  const { user } = useAuth()
  const { notify } = useToast()
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Re-seed from the document each time the dialog opens.
  useEffect(() => {
    if (!open) {
      setError(null)
      setSaving(false)
      return
    }
    setValue(toDateInputValue(document?.expires_at ?? null))
  }, [open, document])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!document || !user || !supabase) return

    const expiryIso = value ? toExpiryTimestamp(value) : null
    const validation = validateExpiryDate(expiryIso)
    if (validation) {
      setError(validation)
      return
    }

    setSaving(true)
    setError(null)

    const title = document.title
    const cleared = !value

    try {
      await updateDocument(supabase, user.id, document.id, { expires_at: expiryIso })
      notifyDocumentsChanged()
      notify({
        tone: 'success',
        title: cleared ? 'Expiry removed' : 'Expiry updated',
        description: cleared ? `${title} no longer has an expiry date.` : `Expiry updated for ${title}.`,
      })
      onOpenChange(false)
    } catch {
      setError('We could not update the expiry date. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <span
            aria-hidden="true"
            className="mb-1 inline-flex size-10 items-center justify-center rounded-control bg-surface-muted text-muted-foreground"
          >
            <CalendarDays className="size-5" />
          </span>
          <DialogTitle>Edit expiry date</DialogTitle>
          <DialogDescription>
            {document
              ? `Set or remove the expiry date for “${document.title}”.`
              : 'Set or remove the expiry date for this document.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="edit-expiry">Expiry date</Label>
            <Input
              id="edit-expiry"
              type="date"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={saving}
            />
            <FieldHint>
              A document is flagged as expiring soon within 30 days of this date.
            </FieldHint>
          </div>

          {error ? <InlineAlert>{error}</InlineAlert> : null}

          <DialogFooter>
            {value ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setValue('')}
                disabled={saving}
                className="sm:mr-auto"
              >
                <X aria-hidden="true" />
                Clear date
              </Button>
            ) : null}

            <DialogClose asChild>
              <Button variant="secondary" disabled={saving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary" disabled={saving} aria-busy={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
