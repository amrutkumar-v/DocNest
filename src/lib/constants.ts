/**
 * Static, phase-scoped constants.
 *
 * Everything in this file is presentation data only. Category descriptions and
 * navigation labels live here; anything that reads or writes documents lives
 * in `lib/documents.ts`.
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

/** The built-in category set, with the copy shown on the Categories page. */
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
