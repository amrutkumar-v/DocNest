import { Plus } from 'lucide-react'

import { useAddDocumentDialog } from '@/components/add-document-context'
import { Button, type ButtonProps } from '@/components/ui/button'

type AddDocumentButtonProps = Omit<ButtonProps, 'onClick' | 'children'> & {
  label?: string
}

/**
 * The single call-to-action for adding a document.
 *
 * Opens the one shared upload dialog, so the sidebar, mobile header and every
 * page-level button behave identically.
 */
export function AddDocumentButton({ label = 'Add document', ...props }: AddDocumentButtonProps) {
  const { openAddDocumentDialog } = useAddDocumentDialog()

  return (
    <Button variant="primary" onClick={openAddDocumentDialog} {...props}>
      <Plus aria-hidden="true" />
      {label}
    </Button>
  )
}
