import { type ReactNode, useCallback, useMemo, useState } from 'react'

import { AddDocumentDialogContext } from '@/components/add-document-context'
import { AddDocumentDialog } from '@/components/documents/AddDocumentDialog'

type AddDocumentDialogProviderProps = {
  children: ReactNode
}

/**
 * Owns the single upload dialog instance for the whole app, so the sidebar, the
 * mobile header and every page-level call to action open the same dialog.
 */
export function AddDocumentDialogProvider({ children }: AddDocumentDialogProviderProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = useCallback((next: boolean) => setOpen(next), [])
  const openAddDocumentDialog = useCallback(() => setOpen(true), [])

  const value = useMemo(() => ({ openAddDocumentDialog }), [openAddDocumentDialog])

  return (
    <AddDocumentDialogContext value={value}>
      {children}
      <AddDocumentDialog open={open} onOpenChange={handleOpenChange} />
    </AddDocumentDialogContext>
  )
}
