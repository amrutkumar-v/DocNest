import { createContext, useContext } from 'react'

type AddDocumentDialogContextValue = {
  /** Opens the shared upload dialog. */
  openAddDocumentDialog: () => void
}

export const AddDocumentDialogContext = createContext<AddDocumentDialogContextValue | null>(null)

/**
 * Any component inside `AddDocumentDialogProvider` can open the upload dialog
 * without prop drilling.
 */
export function useAddDocumentDialog() {
  const context = useContext(AddDocumentDialogContext)

  if (!context) {
    throw new Error('useAddDocumentDialog must be used inside an AddDocumentDialogProvider')
  }

  return context
}
