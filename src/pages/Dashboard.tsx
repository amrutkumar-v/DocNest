import { CalendarClock, FileText, FolderOpen, Layers } from 'lucide-react'

import { AddDocumentButton } from '@/components/AddDocumentButton'
import { EmptyState } from '@/components/EmptyState'
import { StatCard } from '@/components/StatCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getGreeting } from '@/lib/greeting'
import { ExpiryEmptyIcon } from '@/lib/icons'

/**
 * Phase 1 dashboard.
 *
 * Every value is a static `0` — there is no backend, so no document records
 * or expiry dates exist to summarise yet.
 */
export default function Dashboard() {
  usePageTitle()

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title={getGreeting()}
        description="Your important documents, all in one place."
        actions={<AddDocumentButton />}
      />

      <section
        aria-label="Vault overview"
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        <StatCard
          label="Total Documents"
          value={0}
          icon={FolderOpen}
          hint="Documents you have added to your vault."
        />
        <StatCard
          label="Expiring Soon"
          value={0}
          icon={CalendarClock}
          hint="Documents with an expiry date coming up. Arrives in a later phase."
        />
        <StatCard
          label="Categories"
          value={0}
          icon={Layers}
          hint="Categories in use once you start filing documents."
        />
        <StatCard
          label="Recently Added"
          value={0}
          icon={FileText}
          hint="Documents added during the last 30 days."
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-5 lg:gap-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EmptyState
              icon={FolderOpen}
              title="No documents yet"
              description="Your recently added documents will appear here."
              action={<AddDocumentButton label="Add your first document" />}
              className="border-t border-border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EmptyState
              icon={ExpiryEmptyIcon}
              title="Nothing expiring soon"
              description="Documents that need your attention will appear here."
              className="border-t border-border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}