/**
 * Time-of-day greeting for the dashboard header.
 *
 * Since Phase 2 the greeting may be personalised with the signed-in user's
 * first name. The name is optional: it is omitted whenever the identity
 * provider did not supply one, so the greeting never shows a placeholder.
 */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** Builds the dashboard heading, personalising it when a first name is known. */
export function getDashboardGreeting(firstName: string | null, date: Date = new Date()): string {
  const greeting = getGreeting(date)
  return firstName ? `${greeting}, ${firstName}` : greeting
}