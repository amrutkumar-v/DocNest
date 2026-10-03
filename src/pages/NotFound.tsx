import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { VaultEmptyIcon } from '@/lib/icons'

export default function NotFound() {
  usePageTitle('Page not found')

  return (
    <EmptyState
      icon={VaultEmptyIcon}
      title="Page not found"
      description="That page does not exist in DocNest. Check the address or head back to your dashboard."
      action={
        <Button asChild variant="primary">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      }
      className="rounded-app border border-border bg-surface"
    />
  )
}