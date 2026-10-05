import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CalendarDays, Clock } from 'lucide-react'

import { getExpiryLabel, getExpiryStatus, type ExpiryStatus } from '@/lib/documents'

const PRESENTATION: Record<ExpiryStatus, { icon: typeof CalendarDays; label: string; className: string }> = {
  expired: {
    icon: AlertTriangle,
    label: 'Expired',
    className: 'bg-destructive-subtle text-destructive-foreground',
  },
  'expiring-soon': {
    icon: Clock,
    label: 'Expiring soon',
    className: 'bg-warning-subtle text-warning-foreground',
  },
  active: {
    icon: CalendarDays,
    label: 'Active',
    className: 'bg-surface-muted text-muted-foreground',
  },
  'no-expiry': {
    icon: CalendarDays,
    label: 'No expiry',
    className: 'bg-surface-muted text-muted-foreground',
  },
}

/** Compact, colour-coded expiry indicator. The full date lives in the title. */
export function ExpiryBadge({ expiresAt }: { expiresAt: string | null }) {
  const status = getExpiryStatus(expiresAt)
  const { icon: Icon, label, className } = PRESENTATION[status]
  const detail = getExpiryLabel(expiresAt)

  return (
    <Badge tone="neutral" className={className} title={detail}>
      <Icon aria-hidden="true" className="size-3" />
      {detail}
      <span className="sr-only">{label}</span>
    </Badge>
  )
}
