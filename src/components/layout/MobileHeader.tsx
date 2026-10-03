import { AddDocumentButton } from '@/components/AddDocumentButton'
import { Brand } from '@/components/layout/Brand'

/** Compact top bar shown on small screens in place of the desktop sidebar. */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-4">
        <Brand />
        <AddDocumentButton size="sm" />
      </div>
    </header>
  )
}