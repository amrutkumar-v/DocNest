-- Phase 5: Document Expiry & Reminders
-- Adds optional expiry tracking to documents

-- Add expires_at column to documents table
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NULL;

-- Index for expiry queries
CREATE INDEX IF NOT EXISTS documents_expires_at_idx ON public.documents(expires_at) WHERE expires_at IS NOT NULL;

-- Index for user + expiry queries (for dashboard queries)
CREATE INDEX IF NOT EXISTS documents_user_id_expires_at_idx ON public.documents(user_id, expires_at) WHERE expires_at IS NOT NULL;

-- No RLS policy changes needed - existing policies already enforce user ownership
-- The expires_at column inherits the same RLS policies as other columns