-- ============================================================
-- page_components table
-- Stores each component instance assigned to a page with its own settings.
-- Run this in your Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS page_components (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id text NOT NULL,                      -- 'homepage', 'platform', or uuid referencing pages.id
  component_type text NOT NULL,               -- e.g. 'hero', 'sidekick', 'departments'
  display_name text NOT NULL,                 -- human-friendly label
  settings jsonb DEFAULT '{}'::jsonb,         -- component-specific config
  order_index integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_page_components_page_id ON page_components(page_id);
CREATE INDEX IF NOT EXISTS idx_page_components_order ON page_components(page_id, order_index);

-- Row-level security (match existing open access pattern)
ALTER TABLE page_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON page_components FOR ALL USING (true) WITH CHECK (true);
