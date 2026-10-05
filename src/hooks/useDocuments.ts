import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { getDocuments, type Document } from '@/lib/documents'
import { DOCUMENTS_CHANGED_EVENT } from '@/lib/documents-events'
import { supabase } from '@/lib/supabase'

type DocumentsState = {
  items: Document[]
  loading: boolean
  error: string | null
}

const INITIAL: DocumentsState = { items: [], loading: true, error: null }

/**
 * Loads the signed-in user's documents and keeps them fresh.
 *
 * Refetches on mount, whenever the user changes, and whenever another surface
 * announces a write through `DOCUMENTS_CHANGED_EVENT` — so an upload started
 * from the sidebar shows up here without prop-drilling a refresh callback
 * through the app shell.
 */
export function useDocuments() {
  const { user } = useAuth()
  const userId = user?.id

  const [state, setState] = useState<DocumentsState>(INITIAL)

  // Guards against a slow response writing into a tree that has been torn down
  // or switched to a different user.
  const activeRequest = useRef<number>(0)

  const load = useCallback(async () => {
    if (!userId || !supabase) {
      setState({ items: [], loading: false, error: null })
      return
    }

    const request = ++activeRequest.current
    setState((current) => ({ ...current, loading: true, error: null }))

    try {
      const items = await getDocuments(supabase, userId)
      if (request !== activeRequest.current) return
      setState({ items, loading: false, error: null })
    } catch {
      if (request !== activeRequest.current) return
      setState((current) => ({
        items: current.items,
        loading: false,
        error: 'Your documents could not be loaded. Check your connection and try again.',
      }))
    }
  }, [userId])

  useEffect(() => {
    void load()

    const handleChange = () => void load()
    window.addEventListener(DOCUMENTS_CHANGED_EVENT, handleChange)

    return () => {
      // Invalidate anything still in flight for this user.
      activeRequest.current += 1
      window.removeEventListener(DOCUMENTS_CHANGED_EVENT, handleChange)
    }
  }, [load])

  return { ...state, refresh: load }
}
