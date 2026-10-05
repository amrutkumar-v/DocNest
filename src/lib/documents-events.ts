/**
 * Cross-component signal that the document list has changed.
 *
 * The vault is read by more than one surface (the Documents page, the dashboard
 * summary and the shared upload dialog). A single window event lets any of them
 * announce a write so the others refresh, without introducing a store or
 * prop-drilling a refresh callback through the shell.
 */

export const DOCUMENTS_CHANGED_EVENT = 'docnest:documents-changed'

/** Announce that documents were created, updated or deleted. */
export function notifyDocumentsChanged() {
  window.dispatchEvent(new Event(DOCUMENTS_CHANGED_EVENT))
}
