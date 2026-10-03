import { CategoryCard } from '@/components/CategoryCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { usePageTitle } from '@/hooks/usePageTitle'
import { DOCUMENT_CATEGORIES } from '@/lib/constants'
import { CATEGORY_ICONS } from '@/lib/icons'

/**
 * Phase 1 category overview.
 *
 * The category list is a fixed product default — there are no database
 * records, and every count is a hard `0` until documents can be filed.
 */
export default function Categories() {
  usePageTitle('Categories')

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Categories"
        description="Every document in DocNest is filed under one of these categories, so you always know where to look."
      />

      <section aria-label="Document categories" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DOCUMENT_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            icon={CATEGORY_ICONS[category.icon]}
            label={category.label}
            blurb={category.blurb}
            count={0}
          />
        ))}
      </section>

      <p className="text-xs leading-relaxed text-subtle-foreground">
        These categories are built into DocNest. Assigning documents to them — and adding your own
        — arrives once the vault is connected to storage.
      </p>
    </div>
  )
}