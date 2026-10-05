import { CategoryCard } from '@/components/CategoryCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { useDocuments } from '@/hooks/useDocuments'
import { usePageTitle } from '@/hooks/usePageTitle'
import { DOCUMENT_CATEGORIES } from '@/lib/constants'
import { CATEGORY_ICONS } from '@/lib/icons'

/**
 * Category overview.
 *
 * The category list is a fixed product default; the counts come from the
 * documents the user has actually filed.
 */
export default function Categories() {
  usePageTitle('Categories')

  const { items } = useDocuments()

  const counts = new Map<string, number>()
  for (const document of items) {
    counts.set(document.category, (counts.get(document.category) ?? 0) + 1)
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Categories"
        description="Every document is filed under one of these categories, so you always know where to look."
      />

      <section aria-label="Document categories" className="grid gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
        {DOCUMENT_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            icon={CATEGORY_ICONS[category.icon]}
            label={category.label}
            blurb={category.blurb}
            count={counts.get(category.label) ?? 0}
          />
        ))}
      </section>

      <p className="text-xs leading-relaxed text-pretty text-subtle-foreground">
        Categories are built into DocNest, so your filing stays consistent on every device. Custom
        categories are not available yet.
      </p>
    </div>
  )
}
