import { createContext } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

export type ThemeContextValue = {
  /** What the user chose. */
  preference: ThemePreference
  /** What is actually rendered, with `system` resolved against the OS. */
  resolved: 'light' | 'dark'
  setPreference: (preference: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const THEME_STORAGE_KEY = 'docnest-theme'
