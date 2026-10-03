import { SlidersHorizontal } from 'lucide-react'

import { AddDocumentButton } from '@/components/AddDocumentButton'
import { EmptyState } from '@/components/EmptyState'
import { SearchBar } from '@/components/SearchBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { usePageTitle } from '@/hooks/usePageTitle'
import { DOCUMENT_CATEGORIES, DOCUMENT_SORT_OPTIONS } from '@/lib/constants'
import { VaultEmptyIcon } from '@/lib/icons'

export default function Documents() {
  usePageTitle('Documents')

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Your Documents"
        description="Keep your important documents organized and easy to find."
        actions={<AddDocumentButton />}
      />

      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
            <SearchBar className="lg:max-w-sm" />

            <div className="lg:w-52">
              <Label htmlFor="category-filter" className="mb-1.5 block text-xs text-muted-foreground">
                Category
              </Label>
              <Select id="category-filter" disabled defaultValue="all">
                <option value="all">All categories</option>
                {DOCUMENT_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="lg:w-52">
              <Label htmlFor="sort-order" className="mb-1.5 block text-xs text-muted-foreground">
                Sort by
              </Label>
              <Select id="sort-order" disabled defaultValue={DOCUMENT_SORT_OPTIONS[0]}>
                {DOCUMENT_SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-subtle-foreground">
            <SlidersHorizontal aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            <span>
              Search, filtering and sorting are staged for a later phase and stay inactive until
              your vault contains documents.
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <EmptyState
            icon={VaultEmptyIcon}
            title="Your document vault is empty"
            description="Add your important documents and keep everything organized in one place."
            action={<AddDocumentButton />}
          />
        </CardContent>
      </Card>
    </div>
  )
}