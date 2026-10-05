import { FileUp, Lock, Upload } from 'lucide-react'
import { useEffect, useId, useState, type FormEvent } from 'react'

import { InlineAlert } from '@/components/InlineAlert'
import { Badge } from '@/components/ui/badge'
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
import { Select } from '@/components/ui/select'
import { useToast } from '@/hooks/useToast'
import {
  createDocument,
  DOCUMENT_CATEGORIES,
  validateDocumentFile,
  validateExpiryDate,
  type DocumentCategory,
} from '@/lib/documents'
import { notifyDocumentsChanged } from '@/lib/documents-events'
import { supabase } from '@/lib/supabase'
import { formatBytes } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

type AddDocumentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ACCEPTED_EXTENSIONS = '.pdf,.png,.jpg,.jpeg,.webp'

const EMPTY_FORM = {
  title: '',
  category: DOCUMENT_CATEGORIES[0] as DocumentCategory,
  expiresAt: '',
}

/**
 * The app's single upload dialog.
 *
 * Mounted once by `AddDocumentDialogProvider` so the sidebar, mobile header and
 * every page-level call to action open the same instance. On success it
 * announces the change so open views of the vault refresh themselves.
 */
export function AddDocumentDialog({ open, onOpenChange }: AddDocumentDialogProps) {
  const { user } = useAuth()
  const { notify } = useToast()
  const fileInputId = useId()

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<DocumentCategory>(EMPTY_FORM.category)
  const [expiresAt, setExpiresAt] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset to a clean form each time the dialog is closed.
  useEffect(() => {
    if (open) return
    setFile(null)
    setTitle('')
    setCategory(EMPTY_FORM.category)
    setExpiresAt('')
    setUploading(false)
    setError(null)
  }, [open])

  // Seed the title from the file name until the user types their own.
  useEffect(() => {
    if (!file || title) return
    setTitle(file.name.replace(/\.[^.]+$/, ''))
  }, [file, title])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!user || !supabase) return

    const fileError = validateDocumentFile(file)
    if (fileError) {
      setError(fileError)
      return
    }

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Please enter a document title.')
      return
    }

    const expiryIso = expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : null
    const expiryError = validateExpiryDate(expiryIso)
    if (expiryError) {
      setError(expiryError)
      return
    }

    setUploading(true)
    setError(null)

    try {
      const created = await createDocument(supabase, user.id, file as File, {
        title: trimmedTitle,
        category,
        expires_at: expiryIso,
      })

      notifyDocumentsChanged()
      notify({
        tone: 'success',
        title: 'Document added',
        description: `${created.title} is now in your vault.`,
      })
      onOpenChange(false)
    } catch {
      setError('We could not upload that file. Check your connection and try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <span
            aria-hidden="true"
            className="mb-1 inline-flex size-10 items-center justify-center rounded-control bg-brand-subtle text-brand-subtle-foreground"
          >
            <FileUp className="size-5" />
          </span>
          <DialogTitle>Add document</DialogTitle>
          <DialogDescription>
            Upload a PDF or image. It is stored privately in your own vault.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor={fileInputId}>File</Label>

            {/* A dashed drop target reads as "file goes here" without hiding
                the native picker, which keeps keyboard and mobile behaviour. */}
            <label
              htmlFor={fileInputId}
              className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-control border border-dashed border-border-strong bg-surface-muted/60 px-4 py-5 text-center transition-colors duration-[140ms] hover:border-brand hover:bg-brand-subtle/40 focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/15 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-60"
            >
              <Upload aria-hidden="true" className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {file ? file.name : 'Choose a file'}
              </span>
              <span className="text-xs text-muted-foreground">
                {file ? formatBytes(file.size) : 'PDF, PNG, JPG or WEBP · up to 10 MB'}
              </span>
            </label>

            <Input
              id={fileInputId}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null
                setFile(selected)
                setError(null)
              }}
              disabled={uploading}
              className="sr-only"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-title">Title</Label>
            <Input
              id="document-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Passport"
              disabled={uploading}
              required
              aria-invalid={error && !title.trim() ? true : undefined}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="document-category">Category</Label>
              <Select
                id="document-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as DocumentCategory)}
                disabled={uploading}
              >
                {DOCUMENT_CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="document-expiry">Expiry date</Label>
                <Badge tone="neutral">Optional</Badge>
              </div>
              <Input
                id="document-expiry"
                type="date"
                value={expiresAt}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(event) => setExpiresAt(event.target.value)}
                disabled={uploading}
              />
            </div>
          </div>

          <FieldHint>
            Documents are flagged as expiring soon within 30 days of their expiry date.
          </FieldHint>

          {error ? <InlineAlert>{error}</InlineAlert> : null}

          <div className="flex items-center gap-2 text-xs text-subtle-foreground">
            <Lock aria-hidden="true" className="size-3.5 shrink-0" />
            <span>Only you can see the documents in your vault.</span>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" disabled={uploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary" disabled={uploading} aria-busy={uploading}>
              {uploading ? 'Uploading…' : 'Upload document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
