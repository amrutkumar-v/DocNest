import { createContext, useContext } from 'react'

type AddDocumentDialogContextValue = {
  /** Opens the Phase 1 "upload coming soon" placeholder dialog. */
  openAddDocumentDialog: () => void
}

export const AddDocumentDialogContext = createContext<AddDocumentDialogContextValue | null>(null)

/**
 * Any component inside `AddDocumentDialogProvider` can trigger the
 * placeholder Add Document dialog without prop drilling.
 */
export function useAddDocumentDialog() {
  const context = useContext(AddDocumentDialogContext)

  if (!context) {
    throw new Error('useAddDocumentDialog must be used inside an AddDocumentDialogProvider')
  }

  return context
}