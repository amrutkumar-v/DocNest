import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Minimal English pluralisation for count labels such as "1 document". */
export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/** Human-readable file size, e.g. `1.4 MB`. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'

  if (bytes < 1024) return `${bytes} ${UNITS[0]}`

  let value = bytes
  let unit = 0

  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024
    unit += 1
  }

  // One decimal below 10 keeps sizes scannable without false precision.
  const rounded = value < 10 ? Math.round(value * 10) / 10 : Math.round(value)
  return `${rounded} ${UNITS[unit]}`
}

const DAY = 24 * 60 * 60 * 1000

/**
 * Absolute date for older items, "Today"/"Yesterday" for recent ones.
 *
 * Both forms are unambiguous for a document vault, where recency is the point.
 */
export function formatDate(value: string | number | Date, now: Date = new Date()): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / DAY)

  if (dayDiff === 0) return 'Today'
  if (dayDiff === 1) return 'Yesterday'
  if (dayDiff > 1 && dayDiff < 7) return `${dayDiff} days ago`

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

/** Full date and time, used where the exact moment matters. */
export function formatDateTime(value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'

  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
