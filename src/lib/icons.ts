import {
  Bell,
  Car,
  ContactRound,
  FileText,
  FolderOpen,
  GraduationCap,
  HeartPulse,
  Info,
  Layers,
  LayoutDashboard,
  Settings,
  Shapes,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

import type { NavItem } from '@/lib/constants'

export const NAV_ICONS: Record<NavItem['icon'], LucideIcon> = {
  dashboard: LayoutDashboard,
  documents: FolderOpen,
  categories: Layers,
  settings: Settings,
}

export type CategoryIconName =
  | 'identity'
  | 'vehicle'
  | 'education'
  | 'finance'
  | 'medical'
  | 'insurance'
  | 'personal'
  | 'other'

export const CATEGORY_ICONS: Record<CategoryIconName, LucideIcon> = {
  identity: ContactRound,
  vehicle: Car,
  education: GraduationCap,
  finance: Wallet,
  medical: HeartPulse,
  insurance: ShieldCheck,
  personal: FileText,
  other: Shapes,
}

/** Shared icon for the not-yet-built document vault. */
export const VaultEmptyIcon = FolderOpen

/** Shared icon for empty upcoming-expiry content. */
export const ExpiryEmptyIcon = Bell

/** Shared icon for settings categories. */
export const SettingsSectionIcons = {
  account: ContactRound,
  security: ShieldCheck,
  notifications: Bell,
  appearance: Shapes,
  about: Info,
} as const