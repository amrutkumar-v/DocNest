import { useEffect } from 'react'

import { APP_NAME, APP_TAGLINE } from '@/lib/constants'

/** Keeps the document title in sync with the active route. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : `${APP_NAME} — ${APP_TAGLINE}`
  }, [title])
}