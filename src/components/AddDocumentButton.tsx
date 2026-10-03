import { Plus } from 'lucide-react'

import { useAddDocumentDialog } from '@/components/add-document-context'
import { Button, type ButtonProps } from '@/components/ui/button'

type AddDocumentButtonProps = Omit<ButtonProps, 'onClick' | 'children'> & {
  label?: string
}

/**
 * The single call-to-action for adding a document.
 *
 * In Phase 1 it only opens the placeholder dialog — there is no upload flow yet.
 */
export function AddDocumentButton({ label = 'Add Document', ...props }: AddDocumentButtonProps) {
  const { openAddDocumentDialog } = useAddDocumentDialog()

  return (
    <Button variant="primary" onClick={openAddDocumentDialog} {...props}>
      <Plus aria-hidden="true" />
      {label}
    </Button>
  )
}