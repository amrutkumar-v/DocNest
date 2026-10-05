import { AddDocumentButton } from '@/components/AddDocumentButton'
import { DocumentVault } from '@/components/DocumentVault'
import { PageHeader } from '@/components/layout/PageHeader'
import { usePageTitle } from '@/hooks/usePageTitle'

/** The vault: everything the user has stored, with search and filters. */
export default function Documents() {
  usePageTitle('Documents')

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Documents"
        description="Search, filter and manage everything in your vault."
        actions={<AddDocumentButton className="w-full sm:w-auto" />}
      />

      <DocumentVault />
    </div>
  )
}
