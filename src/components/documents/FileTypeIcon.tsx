import { FileImage, FileText } from 'lucide-react'

import type { Document } from '@/lib/documents'
import { cn } from '@/lib/utils'

/** Icon tile standing in for a file thumbnail, tinted by file type. */
export function FileTypeIcon({ document, className }: { document: Document; className?: string }) {
  const isImage = document.mime_type.startsWith('image/')
  const Icon = isImage ? FileImage : FileText

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-control transition-colors duration-[140ms]',
        isImage
          ? 'bg-brand-subtle text-brand-subtle-foreground'
          : 'bg-surface-muted text-muted-foreground',
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  )
}
