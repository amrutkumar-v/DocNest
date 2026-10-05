import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/usePageTitle'

/** Fallback for any address that does not match a route. */
export default function NotFound() {
  usePageTitle('Page not found')

  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="That page does not exist in DocNest. It may have been moved, or the address may be mistyped."
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="primary">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/documents">Open my documents</Link>
          </Button>
        </div>
      }
      className="rounded-panel border border-border bg-surface shadow-card"
    />
  )
}
