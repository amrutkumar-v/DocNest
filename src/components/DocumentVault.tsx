import { Filter, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AddDocumentButton } from '@/components/AddDocumentButton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { SearchBar } from '@/components/SearchBar'
import { DeleteDocumentDialog } from '@/components/documents/DeleteDocumentDialog'
import { DocumentCard } from '@/components/documents/DocumentCard'
import { EditExpiryDialog } from '@/components/documents/EditExpiryDialog'
import { ViewDocumentDialog } from '@/components/documents/ViewDocumentDialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { DocumentCardSkeleton, LoadingLabel } from '@/components/ui/skeleton'
import { useDocuments } from '@/hooks/useDocuments'
import {
  DOCUMENT_CATEGORIES,
  getExpiryStatus,
  type Document,
} from '@/lib/documents'
import { VaultEmptyIcon } from '@/lib/icons'
import { pluralize } from '@/lib/utils'

type SortOrder = 'newest' | 'oldest' | 'name-asc' | 'name-desc'
type ExpiryFilter = 'all' | 'no-expiry' | 'expiring-soon' | 'expired'
type FileTypeFilter = 'all' | 'pdf' | 'image'

function fileTypeOf(document: Document): 'pdf' | 'image' | 'other' {
  if (document.mime_type === 'application/pdf') return 'pdf'
  if (document.mime_type.startsWith('image/')) return 'image'
  return 'other'
}

/**
 * The document vault: search, filter, sort and act on every stored file.
 *
 * Loading, error, empty and no-match results each get their own state, so the
 * page never shows a bare "Loading…" line or a raw failure.
 */
export function DocumentVault() {
  const { items, loading, error, refresh } = useDocuments()

  const [viewDoc, setViewDoc] = useState<Document | null>(null)
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null)
  const [editExpiryDoc, setEditExpiryDoc] = useState<Document | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>('all')
  const [expiryFilter, setExpiryFilter] = useState<ExpiryFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return items
      .filter((document) => {
        if (query) {
          const haystack = `${document.title} ${document.file_name} ${document.category}`
          if (!haystack.toLowerCase().includes(query)) return false
        }
        if (categoryFilter !== 'all' && document.category !== categoryFilter) return false
        if (fileTypeFilter !== 'all' && fileTypeOf(document) !== fileTypeFilter) return false
        if (expiryFilter !== 'all' && getExpiryStatus(document.expires_at) !== expiryFilter) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'oldest':
            return a.created_at.localeCompare(b.created_at)
          case 'name-asc':
            return a.title.localeCompare(b.title)
          case 'name-desc':
            return b.title.localeCompare(a.title)
          case 'newest':
          default:
            return b.created_at.localeCompare(a.created_at)
        }
      })
  }, [items, searchQuery, categoryFilter, fileTypeFilter, expiryFilter, sortOrder])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'all' ||
    fileTypeFilter !== 'all' ||
    expiryFilter !== 'all' ||
    sortOrder !== 'newest'

  function clearFilters() {
    setSearchQuery('')
    setCategoryFilter('all')
    setFileTypeFilter('all')
    setExpiryFilter('all')
    setSortOrder('newest')
  }

  const toolbar = (
    <Toolbar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      categoryFilter={categoryFilter}
      onCategoryChange={setCategoryFilter}
      fileTypeFilter={fileTypeFilter}
      onFileTypeChange={setFileTypeFilter}
      expiryFilter={expiryFilter}
      onExpiryChange={setExpiryFilter}
      sortOrder={sortOrder}
      onSortChange={setSortOrder}
      hasActiveFilters={hasActiveFilters}
      onClear={clearFilters}
    />
  )

  if (error) {
    return (
      <ErrorState
        title="Could not load your vault"
        description={error}
        onRetry={refresh}
        className="shadow-card"
      />
    )
  }

  // Nothing stored yet: explain the vault instead of showing empty controls.
  if (!loading && items.length === 0) {
    return (
      <>
        <EmptyState
          icon={VaultEmptyIcon}
          title="Your vault is empty"
          description="Add a passport, tax return or insurance policy and it will be filed here — searchable, sorted and tracked against its expiry date."
          action={<AddDocumentButton label="Add your first document" />}
          className="rounded-panel border border-border bg-surface shadow-card"
        />

        <DocumentDialogs
          viewDoc={viewDoc}
          deleteDoc={deleteDoc}
          editExpiryDoc={editExpiryDoc}
          setViewDoc={setViewDoc}
          setDeleteDoc={setDeleteDoc}
          setEditExpiryDoc={setEditExpiryDoc}
        />
      </>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {toolbar}

        <p className="text-xs text-subtle-foreground" role="status">
          {loading
            ? 'Loading your documents…'
            : filtered.length === items.length
              ? `${pluralize(items.length, 'document')} in your vault`
              : `Showing ${filtered.length} of ${items.length} documents`}
        </p>

        {loading ? (
          <>
            <LoadingLabel>Loading your documents</LoadingLabel>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <DocumentCardSkeleton key={index} />
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="No documents match those filters"
            description="Try a different search term, widen the filters, or clear them to see everything in your vault."
            action={
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                <X aria-hidden="true" />
                Clear filters
              </Button>
            }
            className="rounded-panel border border-border bg-surface shadow-card"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={setViewDoc}
                onEditExpiry={setEditExpiryDoc}
                onDelete={setDeleteDoc}
              />
            ))}
          </div>
        )}
      </div>

      <DocumentDialogs
        viewDoc={viewDoc}
        deleteDoc={deleteDoc}
        editExpiryDoc={editExpiryDoc}
        setViewDoc={setViewDoc}
        setDeleteDoc={setDeleteDoc}
        setEditExpiryDoc={setEditExpiryDoc}
      />
    </>
  )
}

type ToolbarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  fileTypeFilter: FileTypeFilter
  onFileTypeChange: (value: FileTypeFilter) => void
  expiryFilter: ExpiryFilter
  onExpiryChange: (value: ExpiryFilter) => void
  sortOrder: SortOrder
  onSortChange: (value: SortOrder) => void
  hasActiveFilters: boolean
  onClear: () => void
}

/**
 * Search and filter controls.
 *
 * On phones the selects sit in a horizontally scrollable row so they keep a
 * comfortable touch target instead of collapsing into unusable chips. The row
 * is scrollable rather than wrapping so the toolbar height stays predictable.
 */
function Toolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  fileTypeFilter,
  onFileTypeChange,
  expiryFilter,
  onExpiryChange,
  sortOrder,
  onSortChange,
  hasActiveFilters,
  onClear,
}: ToolbarProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search title, file name or category…"
        className="lg:w-full"
      />

      <div className="flex items-center gap-2">
        <div className="no-scrollbar -mx-4 flex flex-1 gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:mx-0">
          <Select
            value={categoryFilter}
            onChange={(event) => onCategoryChange(event.target.value)}
            aria-label="Filter by category"
            className="w-40 shrink-0"
          >
            <option value="all">All categories</option>
            {DOCUMENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Select
            value={fileTypeFilter}
            onChange={(event) => onFileTypeChange(event.target.value as FileTypeFilter)}
            aria-label="Filter by file type"
            className="w-36 shrink-0"
          >
            <option value="all">All file types</option>
            <option value="pdf">PDFs</option>
            <option value="image">Images</option>
          </Select>

          <Select
            value={expiryFilter}
            onChange={(event) => onExpiryChange(event.target.value as ExpiryFilter)}
            aria-label="Filter by expiry status"
            className="w-44 shrink-0"
          >
            <option value="all">Any expiry</option>
            <option value="no-expiry">No expiry date</option>
            <option value="expiring-soon">Expiring soon</option>
            <option value="expired">Expired</option>
          </Select>

          <Select
            value={sortOrder}
            onChange={(event) => onSortChange(event.target.value as SortOrder)}
            aria-label="Sort documents"
            className="w-40 shrink-0"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
          </Select>
        </div>

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={onClear} className="shrink-0">
            <X aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  )
}

type DocumentDialogsProps = {
  viewDoc: Document | null
  deleteDoc: Document | null
  editExpiryDoc: Document | null
  setViewDoc: (document: Document | null) => void
  setDeleteDoc: (document: Document | null) => void
  setEditExpiryDoc: (document: Document | null) => void
}

/** The three per-document dialogs, mounted once for the whole vault. */
function DocumentDialogs({
  viewDoc,
  deleteDoc,
  editExpiryDoc,
  setViewDoc,
  setDeleteDoc,
  setEditExpiryDoc,
}: DocumentDialogsProps) {
  return (
    <>
      <ViewDocumentDialog
        document={viewDoc}
        open={viewDoc !== null}
        onOpenChange={(open) => !open && setViewDoc(null)}
      />
      <DeleteDocumentDialog
        document={deleteDoc}
        open={deleteDoc !== null}
        onOpenChange={(open) => !open && setDeleteDoc(null)}
      />
      <EditExpiryDialog
        document={editExpiryDoc}
        open={editExpiryDoc !== null}
        onOpenChange={(open) => !open && setEditExpiryDoc(null)}
      />
    </>
  )
}
