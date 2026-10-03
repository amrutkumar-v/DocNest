import { type ReactNode, useCallback, useMemo, useState } from 'react'

import { AddDocumentDialog } from '@/components/AddDocumentDialog'
import { AddDocumentDialogContext } from '@/components/add-document-context'

type AddDocumentDialogProviderProps = {
  children: ReactNode
}

/**
 * Owns the single Add Document dialog instance for the whole app so the
 * sidebar, mobile header and page-level CTAs can all open the same dialog.
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