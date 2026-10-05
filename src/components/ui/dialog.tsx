import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogPortal = DialogPrimitive.Portal

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-[#0b0f19]/45 backdrop-blur-[2px]',
        'data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in',
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // Centred via `left/top` + translate so the open/close keyframes can
          // scale the panel without fighting a separate positioning transform.
          'fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md',
          '-translate-x-1/2 -translate-y-1/2',
          // Never taller than the viewport: long forms scroll inside the panel.
          'max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain',
          'gap-5 rounded-panel border border-border bg-surface p-5 shadow-popover sm:p-6',
          'data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            'absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-control',
            'text-subtle-foreground transition-colors duration-[140ms]',
            'hover:bg-surface-muted hover:text-foreground',
          )}
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-1.5 pr-8 text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        // Stacked full-width actions on phones; a right-aligned row from `sm`.
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [&>*]:w-full sm:[&>*]:w-auto',
        className,
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-base leading-tight font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm leading-relaxed text-pretty text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
