/**
 * Time-of-day greeting for the dashboard header.
 *
 * Intentionally anonymous: there is no authenticated user in Phase 1, so no
 * name is ever displayed.
 */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}