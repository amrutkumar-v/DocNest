/**
 * Static, phase-scoped constants.
 *
 * Everything in this file is presentation data only. There is no backend,
 * no database and no seeded documents in Phase 1 — every count below is
 * intentionally `0` until the corresponding phase ships real data.
 */

export const APP_NAME = 'DocNest'
export const APP_TAGLINE = 'Your documents, organized.'
export const APP_VERSION = '0.1.0'
export const APP_DESCRIPTION =
  'A personal document vault to store, organize, search and track your important documents.'

export type NavItem = {
  label: string
  to: string
  icon: 'dashboard' | 'documents' | 'categories' | 'settings'
  description: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: 'dashboard',
    description: 'Overview of your vault',
  },
  {
    label: 'Documents',
    to: '/documents',
    icon: 'documents',
    description: 'Everything you have stored',
  },
  {
    label: 'Categories',
    to: '/categories',
    icon: 'categories',
    description: 'Organise documents by type',
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: 'settings',
    description: 'Account, security and preferences',
  },
] as const

/** Phase 1 shows the planned default set only. Persistence arrives in Phase 4. */
export const DOCUMENT_CATEGORIES = [
  { id: 'identity', label: 'Identity', icon: 'identity', blurb: 'Passports, IDs and licences' },
  { id: 'vehicle', label: 'Vehicle', icon: 'vehicle', blurb: 'Registration, insurance, service papers' },
  { id: 'education', label: 'Education', icon: 'education', blurb: 'Degrees, transcripts and certifications' },
  { id: 'finance', label: 'Finance', icon: 'finance', blurb: 'Tax filings, bank letters and statements' },
  { id: 'medical', label: 'Medical', icon: 'medical', blurb: 'Reports, prescriptions and records' },
  { id: 'insurance', label: 'Insurance', icon: 'insurance', blurb: 'Policies, renewals and claims' },
  { id: 'personal', label: 'Personal', icon: 'personal', blurb: 'Wills, letters and other paperwork' },
  { id: 'other', label: 'Other', icon: 'other', blurb: 'Anything that does not fit elsewhere' },
] as const

export type DocumentCategoryId = (typeof DOCUMENT_CATEGORIES)[number]['id']

/** Sort options rendered on the Documents page. Filtering itself is Phase 4. */
export const DOCUMENT_SORT_OPTIONS = [
  'Recently added',
  'Oldest added',
  'Name (A–Z)',
  'Expiry date',
] as const

export type DocumentSortOption = (typeof DOCUMENT_SORT_OPTIONS)[number]