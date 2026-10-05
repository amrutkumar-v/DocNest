import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import {
  ThemeContext,
  THEME_STORAGE_KEY,
  type ThemeContextValue,
  type ThemePreference,
} from '@/context/theme-context'

/**
 * Owns the active theme.
 *
 * The class-based token system in `index.css` already supports both themes, so
 * this only has to decide which one is on `<html>` and remember the choice.
 *
 * The initial class is applied by an inline script in `index.html` before
 * React mounts; this provider re-applies it on the client so a change made in
 * another tab, or a change to the OS setting, is picked up too.
 */

const QUERY = '(prefers-color-scheme: dark)'

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

function resolve(preference: ThemePreference): 'light' | 'dark' {
  if (preference !== 'system') return preference
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia(QUERY).matches ? 'dark' : 'light'
}

function apply(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference)
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolve(preference))

  useEffect(() => {
    const next = resolve(preference)
    setResolved(next)
    apply(next)

    if (preference !== 'system') return

    // Follow the OS while the preference is `system`.
    const media = window.matchMedia(QUERY)
    const handleChange = () => {
      const value = resolve('system')
      setResolved(value)
      apply(value)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [preference])

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next)
    window.localStorage.setItem(THEME_STORAGE_KEY, next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
