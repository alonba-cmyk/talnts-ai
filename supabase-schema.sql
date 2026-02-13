-- Supabase Schema for Work AI Platform CMS
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  avatar_image TEXT,
  avatar_color TEXT DEFAULT '#6161ff',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add is_active column if not exists (for existing databases)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'departments' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE departments ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  value TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  replaces_tools JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add images column if not exists (for existing databases)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'images'
  ) THEN
    ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  value TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vibe Apps table
CREATE TABLE IF NOT EXISTS vibe_apps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT,
  icon TEXT DEFAULT 'Sparkles',
  replaces_tools TEXT[] DEFAULT '{}',
  image TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sidekick Actions table
CREATE TABLE IF NOT EXISTS sidekick_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  value TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Values table
CREATE TABLE IF NOT EXISTS platform_values (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  icon TEXT DEFAULT 'TrendingUp',
  title TEXT NOT NULL,
  description TEXT,
  supported_by TEXT[] DEFAULT '{}',
  replaces_tools TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outcomes table (for navigation tabs)
CREATE TABLE IF NOT EXISTS outcomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  avatar_image TEXT,
  avatar_color TEXT DEFAULT '#97aeff',
  maps_to_department TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pain Points table (for navigation tabs)
CREATE TABLE IF NOT EXISTS pain_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  avatar_image TEXT,
  avatar_color TEXT DEFAULT '#97aeff',
  maps_to_department TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_title TEXT DEFAULT 'What would you like to achieve?',
  hero_subtitle TEXT DEFAULT 'Choose your department to see your tailored AI solution',
  tabs JSONB DEFAULT '[]',
  sections_visibility JSONB DEFAULT '{"hero": true, "sidekick": true, "departments": true, "ai_platform": true}',
  sections_order JSONB DEFAULT '["hero", "hero_alternative", "hero_outcome_cards", "work_comparison", "sidekick_capabilities", "sidekick", "project_management", "departments", "ai_platform"]',
  hero_settings JSONB DEFAULT NULL,
  solution_tabs_visibility JSONB DEFAULT '{"overview": true, "inAction": true, "businessValue": true, "test": true}',
  sidekick_hero_theme JSONB DEFAULT NULL,
  sidekick_inaction_theme JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sidekick theme columns if not exists (for existing databases)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'sidekick_hero_theme'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN sidekick_hero_theme JSONB DEFAULT NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'sidekick_inaction_theme'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN sidekick_inaction_theme JSONB DEFAULT NULL;
  END IF;
END $$;

-- Add sections_order column if not exists (for existing databases)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'sections_order'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN sections_order JSONB DEFAULT '["hero", "hero_alternative", "hero_outcome_cards", "work_comparison", "sidekick_capabilities", "sidekick", "project_management", "departments", "ai_platform"]';
  END IF;
END $$;

-- Add battle_card_content column if not exists (for battle card editor)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'battle_card_content'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN battle_card_content JSONB DEFAULT NULL;
  END IF;
END $$;

-- AI Transformations table (for navigation tabs)
CREATE TABLE IF NOT EXISTS ai_transformations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  avatar_image TEXT,
  avatar_color TEXT DEFAULT '#97aeff',
  maps_to_department TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
DO $$
BEGIN
  -- Drop existing triggers if they exist
  DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
  DROP TRIGGER IF EXISTS update_products_updated_at ON products;
  DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
  DROP TRIGGER IF EXISTS update_vibe_apps_updated_at ON vibe_apps;
  DROP TRIGGER IF EXISTS update_sidekick_actions_updated_at ON sidekick_actions;
  DROP TRIGGER IF EXISTS update_platform_values_updated_at ON platform_values;
  DROP TRIGGER IF EXISTS update_outcomes_updated_at ON outcomes;
  DROP TRIGGER IF EXISTS update_pain_points_updated_at ON pain_points;
  DROP TRIGGER IF EXISTS update_ai_transformations_updated_at ON ai_transformations;
  
  -- Create triggers
  CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_vibe_apps_updated_at BEFORE UPDATE ON vibe_apps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_sidekick_actions_updated_at BEFORE UPDATE ON sidekick_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_platform_values_updated_at BEFORE UPDATE ON platform_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_outcomes_updated_at BEFORE UPDATE ON outcomes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_pain_points_updated_at BEFORE UPDATE ON pain_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_ai_transformations_updated_at BEFORE UPDATE ON ai_transformations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sidekick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformations ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (no auth required)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all on departments" ON departments;
  DROP POLICY IF EXISTS "Allow all on products" ON products;
  DROP POLICY IF EXISTS "Allow all on agents" ON agents;
  DROP POLICY IF EXISTS "Allow all on vibe_apps" ON vibe_apps;
  DROP POLICY IF EXISTS "Allow all on sidekick_actions" ON sidekick_actions;
  DROP POLICY IF EXISTS "Allow all on platform_values" ON platform_values;
  DROP POLICY IF EXISTS "Allow all on outcomes" ON outcomes;
  DROP POLICY IF EXISTS "Allow all on pain_points" ON pain_points;
  DROP POLICY IF EXISTS "Allow all on ai_transformations" ON ai_transformations;
  
  CREATE POLICY "Allow all on departments" ON departments FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on agents" ON agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on vibe_apps" ON vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on sidekick_actions" ON sidekick_actions FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on platform_values" ON platform_values FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on outcomes" ON outcomes FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on pain_points" ON pain_points FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on ai_transformations" ON ai_transformations FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_department ON products(department_id);
CREATE INDEX IF NOT EXISTS idx_agents_department ON agents(department_id);
CREATE INDEX IF NOT EXISTS idx_vibe_apps_department ON vibe_apps(department_id);
CREATE INDEX IF NOT EXISTS idx_sidekick_actions_department ON sidekick_actions(department_id);
CREATE INDEX IF NOT EXISTS idx_platform_values_department ON platform_values(department_id);

-- Insert initial departments
INSERT INTO departments (name, title, description, avatar_color, order_index) VALUES
  ('marketing', 'Marketing', 'Drive demand generation and accelerate campaign execution', '#97aeff', 1),
  ('sales', 'Sales', 'Close deals faster and increase win rates with AI-powered CRM', '#ffc875', 2),
  ('operations', 'Operations', 'Streamline operations and improve efficiency across teams', '#ff5ac4', 3),
  ('support', 'Customer Support', 'Deliver exceptional service with AI-powered ticket management', '#ff7575', 4),
  ('product', 'Product & Engineering', 'Ship features faster with AI-powered development workflows', '#a358d1', 5),
  ('legal', 'Legal', 'Ensure compliance and review contracts 5x faster with AI', '#5ac4a3', 6),
  ('finance', 'Finance', 'Close books faster with automated reconciliation and reporting', '#ff9a6c', 7),
  ('hr', 'Human Resources', 'Reduce time-to-hire and improve employee experience with AI', '#6fcfed', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert sample outcomes
INSERT INTO outcomes (title, description, avatar_color, maps_to_department, order_index) VALUES
  ('Drive Demand Generation', 'Accelerate pipeline creation with AI-powered campaigns', '#97aeff', 'marketing', 0),
  ('Increase Win Rates', 'Close more deals with intelligent sales automation', '#ffc875', 'sales', 1),
  ('Improve Operational Efficiency', 'Streamline workflows and reduce manual tasks', '#ff5ac4', 'operations', 2),
  ('Enhance Customer Satisfaction', 'Deliver faster, more personalized support', '#ff7575', 'support', 3)
ON CONFLICT DO NOTHING;

-- Insert sample pain points
INSERT INTO pain_points (title, description, avatar_color, maps_to_department, order_index) VALUES
  ('Too Many Manual Tasks', 'Teams spend hours on repetitive work instead of strategic initiatives', '#97aeff', 'operations', 0),
  ('Slow Campaign Execution', 'Marketing campaigns take weeks instead of days to launch', '#ffc875', 'marketing', 1),
  ('Low Sales Productivity', 'Reps spend more time on admin than actual selling', '#ff5ac4', 'sales', 2),
  ('Slow Support Response', 'Customers wait too long for ticket resolution', '#ff7575', 'support', 3)
ON CONFLICT DO NOTHING;

-- Insert sample AI transformations
INSERT INTO ai_transformations (title, description, avatar_color, maps_to_department, order_index) VALUES
  ('AI-Powered Marketing', 'Generate content and campaigns 10x faster with AI agents', '#97aeff', 'marketing', 0),
  ('Intelligent Sales Automation', 'Let AI handle prospecting and follow-ups automatically', '#ffc875', 'sales', 1),
  ('Smart Operations', 'Automate workflows with AI-driven process optimization', '#ff5ac4', 'operations', 2),
  ('AI Customer Service', 'Resolve tickets instantly with AI-powered support', '#ff7575', 'support', 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- JUNCTION TABLES for Outcomes, Pain Points, AI Transformations
-- =====================================================

-- Junction tables for Outcomes
CREATE TABLE IF NOT EXISTS outcome_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(outcome_id, product_id)
);

CREATE TABLE IF NOT EXISTS outcome_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(outcome_id, agent_id)
);

CREATE TABLE IF NOT EXISTS outcome_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(outcome_id, vibe_app_id)
);

CREATE TABLE IF NOT EXISTS outcome_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(outcome_id, sidekick_action_id)
);

-- Junction tables for Pain Points
CREATE TABLE IF NOT EXISTS pain_point_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pain_point_id, product_id)
);

CREATE TABLE IF NOT EXISTS pain_point_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pain_point_id, agent_id)
);

CREATE TABLE IF NOT EXISTS pain_point_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pain_point_id, vibe_app_id)
);

CREATE TABLE IF NOT EXISTS pain_point_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pain_point_id, sidekick_action_id)
);

-- Junction tables for AI Transformations
CREATE TABLE IF NOT EXISTS ai_transformation_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_transformation_id UUID REFERENCES ai_transformations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(ai_transformation_id, product_id)
);

CREATE TABLE IF NOT EXISTS ai_transformation_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_transformation_id UUID REFERENCES ai_transformations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(ai_transformation_id, agent_id)
);

CREATE TABLE IF NOT EXISTS ai_transformation_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_transformation_id UUID REFERENCES ai_transformations(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(ai_transformation_id, vibe_app_id)
);

CREATE TABLE IF NOT EXISTS ai_transformation_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_transformation_id UUID REFERENCES ai_transformations(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(ai_transformation_id, sidekick_action_id)
);

-- Enable RLS on junction tables
ALTER TABLE outcome_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_sidekick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_point_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_point_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_point_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_point_sidekick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformation_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformation_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformation_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_transformation_sidekick_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for junction tables
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all" ON outcome_products;
  DROP POLICY IF EXISTS "Allow all" ON outcome_agents;
  DROP POLICY IF EXISTS "Allow all" ON outcome_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON outcome_sidekick_actions;
  DROP POLICY IF EXISTS "Allow all" ON pain_point_products;
  DROP POLICY IF EXISTS "Allow all" ON pain_point_agents;
  DROP POLICY IF EXISTS "Allow all" ON pain_point_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON pain_point_sidekick_actions;
  DROP POLICY IF EXISTS "Allow all" ON ai_transformation_products;
  DROP POLICY IF EXISTS "Allow all" ON ai_transformation_agents;
  DROP POLICY IF EXISTS "Allow all" ON ai_transformation_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON ai_transformation_sidekick_actions;
  
  CREATE POLICY "Allow all" ON outcome_products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON outcome_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON outcome_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON outcome_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON pain_point_products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON pain_point_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON pain_point_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON pain_point_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON ai_transformation_products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON ai_transformation_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON ai_transformation_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON ai_transformation_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
END $$;

-- =====================================================
-- JUNCTION TABLES for Departments (Many-to-Many)
-- Allows capabilities to be assigned to multiple departments
-- =====================================================

-- Department-Products junction table
CREATE TABLE IF NOT EXISTS department_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, product_id)
);

-- Department-Agents junction table
CREATE TABLE IF NOT EXISTS department_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, agent_id)
);

-- Department-Vibe Apps junction table
CREATE TABLE IF NOT EXISTS department_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, vibe_app_id)
);

-- Department-Sidekick Actions junction table
CREATE TABLE IF NOT EXISTS department_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, sidekick_action_id)
);

-- Enable RLS on department junction tables
ALTER TABLE department_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_sidekick_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for department junction tables
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all" ON department_products;
  DROP POLICY IF EXISTS "Allow all" ON department_agents;
  DROP POLICY IF EXISTS "Allow all" ON department_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON department_sidekick_actions;
  
  CREATE POLICY "Allow all" ON department_products FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON department_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON department_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON department_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Create indexes for better performance on department junction tables
CREATE INDEX IF NOT EXISTS idx_department_products_dept ON department_products(department_id);
CREATE INDEX IF NOT EXISTS idx_department_products_product ON department_products(product_id);
CREATE INDEX IF NOT EXISTS idx_department_agents_dept ON department_agents(department_id);
CREATE INDEX IF NOT EXISTS idx_department_agents_agent ON department_agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_department_vibe_apps_dept ON department_vibe_apps(department_id);
CREATE INDEX IF NOT EXISTS idx_department_vibe_apps_vibe ON department_vibe_apps(vibe_app_id);
CREATE INDEX IF NOT EXISTS idx_department_sidekick_dept ON department_sidekick_actions(department_id);
CREATE INDEX IF NOT EXISTS idx_department_sidekick_action ON department_sidekick_actions(sidekick_action_id);

-- =====================================================
-- MIGRATION: Copy existing department_id assignments to junction tables
-- Run this ONCE to migrate existing data
-- =====================================================

-- Migrate existing product assignments
INSERT INTO department_products (department_id, product_id)
SELECT department_id, id FROM products WHERE department_id IS NOT NULL
ON CONFLICT (department_id, product_id) DO NOTHING;

-- Migrate existing agent assignments
INSERT INTO department_agents (department_id, agent_id)
SELECT department_id, id FROM agents WHERE department_id IS NOT NULL
ON CONFLICT (department_id, agent_id) DO NOTHING;

-- Migrate existing vibe_apps assignments
INSERT INTO department_vibe_apps (department_id, vibe_app_id)
SELECT department_id, id FROM vibe_apps WHERE department_id IS NOT NULL
ON CONFLICT (department_id, vibe_app_id) DO NOTHING;

-- Migrate existing sidekick_actions assignments
INSERT INTO department_sidekick_actions (department_id, sidekick_action_id)
SELECT department_id, id FROM sidekick_actions WHERE department_id IS NOT NULL
ON CONFLICT (department_id, sidekick_action_id) DO NOTHING;

-- =====================================================
-- PAGES TABLE for dynamic landing pages
-- =====================================================

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Page',
  meta_description TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  department_id TEXT DEFAULT NULL,
  outcome_id TEXT DEFAULT NULL,
  sections_visibility JSONB DEFAULT '{"hero": true}',
  sections_order JSONB DEFAULT '["hero"]',
  hero_settings JSONB DEFAULT NULL,
  is_homepage BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for pages
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all on pages" ON pages;
  CREATE POLICY "Allow all on pages" ON pages FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);

-- Create updated_at trigger for pages
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CASE STUDY SOURCES TABLE (uploaded presentations/docs)
-- =====================================================

CREATE TABLE IF NOT EXISTS case_study_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf' CHECK (file_type IN ('pdf', 'pptx', 'docx', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'syncing', 'synced', 'error')),
  region TEXT DEFAULT '',
  extracted_count INT DEFAULT 0,
  error_message TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE case_study_sources ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all on case_study_sources" ON case_study_sources;
  CREATE POLICY "Allow all on case_study_sources" ON case_study_sources FOR ALL USING (true) WITH CHECK (true);
END $$;

DROP TRIGGER IF EXISTS update_case_study_sources_updated_at ON case_study_sources;
CREATE TRIGGER update_case_study_sources_updated_at BEFORE UPDATE ON case_study_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CASE STUDIES TABLE (individual customer stories)
-- =====================================================

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID DEFAULT NULL REFERENCES case_study_sources(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  location TEXT DEFAULT '',
  region TEXT DEFAULT '',
  products_used TEXT[] DEFAULT '{}',
  challenge TEXT DEFAULT '',
  solution TEXT DEFAULT '',
  quote_text TEXT DEFAULT '',
  quote_author TEXT DEFAULT '',
  quote_title TEXT DEFAULT '',
  impact_metrics JSONB DEFAULT '[]',
  partner TEXT DEFAULT '',
  is_public_approved BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all on case_studies" ON case_studies;
  CREATE POLICY "Allow all on case_studies" ON case_studies FOR ALL USING (true) WITH CHECK (true);
END $$;

CREATE INDEX IF NOT EXISTS idx_case_studies_source ON case_studies(source_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON case_studies(industry);
CREATE INDEX IF NOT EXISTS idx_case_studies_region ON case_studies(region);

DROP TRIGGER IF EXISTS update_case_studies_updated_at ON case_studies;
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DESIGN ASSETS TABLE (organized visual assets)
-- =====================================================

CREATE TABLE IF NOT EXISTS design_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'other' CHECK (category IN ('product_logo', 'agent_image', 'department_avatar', 'vibe', 'sidekick', 'icon', 'background', 'other')),
  subcategory TEXT DEFAULT '',
  file_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  file_type TEXT DEFAULT 'png' CHECK (file_type IN ('png', 'svg', 'jpg', 'jpeg', 'webp', 'gif', 'other')),
  tags TEXT[] DEFAULT '{}',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE design_assets ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all on design_assets" ON design_assets;
  CREATE POLICY "Allow all on design_assets" ON design_assets FOR ALL USING (true) WITH CHECK (true);
END $$;

CREATE INDEX IF NOT EXISTS idx_design_assets_category ON design_assets(category);

DROP TRIGGER IF EXISTS update_design_assets_updated_at ON design_assets;
CREATE TRIGGER update_design_assets_updated_at BEFORE UPDATE ON design_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- JUNCTION TABLES for Products (Many-to-Many)
-- Allows capabilities (agents, vibe apps, sidekick) to be linked to products
-- =====================================================

CREATE TABLE IF NOT EXISTS product_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, agent_id)
);

CREATE TABLE IF NOT EXISTS product_vibe_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  vibe_app_id UUID REFERENCES vibe_apps(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, vibe_app_id)
);

CREATE TABLE IF NOT EXISTS product_sidekick_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sidekick_action_id UUID REFERENCES sidekick_actions(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, sidekick_action_id)
);

-- Enable RLS on product junction tables
ALTER TABLE product_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_vibe_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sidekick_actions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all" ON product_agents;
  DROP POLICY IF EXISTS "Allow all" ON product_vibe_apps;
  DROP POLICY IF EXISTS "Allow all" ON product_sidekick_actions;
  
  CREATE POLICY "Allow all" ON product_agents FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON product_vibe_apps FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all" ON product_sidekick_actions FOR ALL USING (true) WITH CHECK (true);
END $$;

CREATE INDEX IF NOT EXISTS idx_product_agents_product ON product_agents(product_id);
CREATE INDEX IF NOT EXISTS idx_product_agents_agent ON product_agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_product_vibe_apps_product ON product_vibe_apps(product_id);
CREATE INDEX IF NOT EXISTS idx_product_vibe_apps_vibe ON product_vibe_apps(vibe_app_id);
CREATE INDEX IF NOT EXISTS idx_product_sidekick_product ON product_sidekick_actions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_sidekick_action ON product_sidekick_actions(sidekick_action_id);

-- =====================================================
-- CAPABILITY MESSAGING
-- Stores value proposition headlines and bullet points
-- for each capability type (Agents, Vibe, Sidekick)
-- =====================================================

CREATE TABLE IF NOT EXISTS capability_messaging (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  capability_type TEXT NOT NULL UNIQUE CHECK (capability_type IN ('agents', 'vibe', 'sidekick')),
  headline TEXT DEFAULT '',
  value_points JSONB DEFAULT '[]'::jsonb,
  hero_image TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE capability_messaging ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all on capability_messaging" ON capability_messaging;
  CREATE POLICY "Allow all on capability_messaging" ON capability_messaging FOR ALL USING (true) WITH CHECK (true);
END $$;

DROP TRIGGER IF EXISTS update_capability_messaging_updated_at ON capability_messaging;
CREATE TRIGGER update_capability_messaging_updated_at BEFORE UPDATE ON capability_messaging FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- BATTLE CARDS SYSTEM
-- Competitive intelligence for sales enablement
-- =====================================================

-- Competitors table
CREATE TABLE IF NOT EXISTS competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  website TEXT DEFAULT '',
  description TEXT DEFAULT '',
  pricing_info TEXT DEFAULT '',
  founded TEXT DEFAULT '',
  hq_location TEXT DEFAULT '',
  tier INTEGER DEFAULT 1 CHECK (tier IN (1, 2)),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tier column if not exists (for existing DBs)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'competitors' AND column_name = 'tier'
  ) THEN
    ALTER TABLE competitors ADD COLUMN tier INTEGER DEFAULT 1 CHECK (tier IN (1, 2));
  END IF;
END $$;

-- Product-Competitor mapping (which competitors compete with which monday products)
CREATE TABLE IF NOT EXISTS product_competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  UNIQUE(product_id, competitor_id)
);

-- Comparison parameters (categories and criteria for comparison)
CREATE TABLE IF NOT EXISTS comparison_parameters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'features' CHECK (category IN ('features', 'ai_capabilities', 'pricing', 'integrations', 'security', 'ux', 'support', 'scalability')),
  description TEXT DEFAULT '',
  weight INTEGER DEFAULT 5 CHECK (weight >= 1 AND weight <= 10),
  is_ai_feature BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battle scores (the actual comparison data)
CREATE TABLE IF NOT EXISTS battle_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  parameter_id UUID REFERENCES comparison_parameters(id) ON DELETE CASCADE,
  monday_score INTEGER DEFAULT 3 CHECK (monday_score >= 1 AND monday_score <= 5),
  competitor_score INTEGER DEFAULT 3 CHECK (competitor_score >= 1 AND competitor_score <= 5),
  monday_notes TEXT DEFAULT '',
  competitor_notes TEXT DEFAULT '',
  talking_points TEXT DEFAULT '',
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, competitor_id, parameter_id)
);

-- Knowledge sources for battle cards (uploaded docs, scanned sites)
CREATE TABLE IF NOT EXISTS battle_knowledge_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  file_url TEXT DEFAULT '',
  source_url TEXT DEFAULT '',
  file_type TEXT DEFAULT 'pdf' CHECK (file_type IN ('pdf', 'pptx', 'docx', 'url', 'other')),
  competitor_id UUID REFERENCES competitors(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  extracted_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'error')),
  error_message TEXT DEFAULT '',
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Objection handlers (responses to common competitor objections)
CREATE TABLE IF NOT EXISTS objection_handlers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  objection_text TEXT NOT NULL DEFAULT '',
  response_text TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'pricing', 'features', 'security', 'migration', 'support', 'ai')),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on battle card tables
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE objection_handlers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for battle card tables
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all on competitors" ON competitors;
  DROP POLICY IF EXISTS "Allow all on product_competitors" ON product_competitors;
  DROP POLICY IF EXISTS "Allow all on comparison_parameters" ON comparison_parameters;
  DROP POLICY IF EXISTS "Allow all on battle_scores" ON battle_scores;
  DROP POLICY IF EXISTS "Allow all on battle_knowledge_sources" ON battle_knowledge_sources;
  DROP POLICY IF EXISTS "Allow all on objection_handlers" ON objection_handlers;

  CREATE POLICY "Allow all on competitors" ON competitors FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on product_competitors" ON product_competitors FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on comparison_parameters" ON comparison_parameters FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on battle_scores" ON battle_scores FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on battle_knowledge_sources" ON battle_knowledge_sources FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow all on objection_handlers" ON objection_handlers FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Triggers for battle card tables
DROP TRIGGER IF EXISTS update_competitors_updated_at ON competitors;
CREATE TRIGGER update_competitors_updated_at BEFORE UPDATE ON competitors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comparison_parameters_updated_at ON comparison_parameters;
CREATE TRIGGER update_comparison_parameters_updated_at BEFORE UPDATE ON comparison_parameters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_battle_scores_updated_at ON battle_scores;
CREATE TRIGGER update_battle_scores_updated_at BEFORE UPDATE ON battle_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_battle_knowledge_sources_updated_at ON battle_knowledge_sources;
CREATE TRIGGER update_battle_knowledge_sources_updated_at BEFORE UPDATE ON battle_knowledge_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_objection_handlers_updated_at ON objection_handlers;
CREATE TRIGGER update_objection_handlers_updated_at BEFORE UPDATE ON objection_handlers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for battle card tables
CREATE INDEX IF NOT EXISTS idx_product_competitors_product ON product_competitors(product_id);
CREATE INDEX IF NOT EXISTS idx_product_competitors_competitor ON product_competitors(competitor_id);
CREATE INDEX IF NOT EXISTS idx_battle_scores_product ON battle_scores(product_id);
CREATE INDEX IF NOT EXISTS idx_battle_scores_competitor ON battle_scores(competitor_id);
CREATE INDEX IF NOT EXISTS idx_battle_scores_parameter ON battle_scores(parameter_id);
CREATE INDEX IF NOT EXISTS idx_battle_knowledge_competitor ON battle_knowledge_sources(competitor_id);
CREATE INDEX IF NOT EXISTS idx_battle_knowledge_product ON battle_knowledge_sources(product_id);
CREATE INDEX IF NOT EXISTS idx_objection_handlers_product ON objection_handlers(product_id);
CREATE INDEX IF NOT EXISTS idx_objection_handlers_competitor ON objection_handlers(competitor_id);

-- Seed initial competitors (full list with tier and product-specific entries)
-- CRM competitors
INSERT INTO competitors (name, website, description, logo_url, tier, order_index) VALUES
  ('Salesforce CRM', 'https://salesforce.com', 'Enterprise CRM and cloud platform', 'https://www.google.com/s2/favicons?domain=salesforce.com&sz=128', 1, 1),
  ('HubSpot CRM', 'https://hubspot.com', 'Inbound marketing, sales, and CRM platform', 'https://www.google.com/s2/favicons?domain=hubspot.com&sz=128', 1, 2),
  ('Zoho CRM', 'https://zoho.com/crm', 'Flexible CRM for growing businesses', 'https://www.google.com/s2/favicons?domain=zoho.com&sz=128', 2, 3),
  ('Attio', 'https://attio.com', 'Next-gen CRM built on your data', 'https://www.google.com/s2/favicons?domain=attio.com&sz=128', 1, 4),
  -- Work Management competitors
  ('Asana', 'https://asana.com', 'Work management and project tracking', 'https://www.google.com/s2/favicons?domain=asana.com&sz=128', 1, 5),
  ('Smartsheet', 'https://smartsheet.com', 'Enterprise work management platform', 'https://www.google.com/s2/favicons?domain=smartsheet.com&sz=128', 1, 6),
  ('ClickUp', 'https://clickup.com', 'All-in-one productivity and project management', 'https://www.google.com/s2/favicons?domain=clickup.com&sz=128', 1, 7),
  ('Airtable', 'https://airtable.com', 'Low-code platform for building collaborative apps', 'https://www.google.com/s2/favicons?domain=airtable.com&sz=128', 1, 8),
  ('Wrike', 'https://wrike.com', 'Versatile work management and collaboration', 'https://www.google.com/s2/favicons?domain=wrike.com&sz=128', 1, 9),
  ('Notion', 'https://notion.so', 'All-in-one workspace for notes, tasks, and wikis', 'https://www.google.com/s2/favicons?domain=notion.so&sz=128', 1, 10),
  ('Adobe Workfront', 'https://business.adobe.com/products/workfront/main.html', 'Enterprise work management by Adobe', 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128', 1, 11),
  ('Microsoft Planner', 'https://www.microsoft.com/en-us/microsoft-365/business/task-management-software', 'Task management within Microsoft 365', 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128', 2, 12),
  ('Planview', 'https://planview.com', 'Enterprise portfolio and work management', 'https://www.google.com/s2/favicons?domain=planview.com&sz=128', 1, 13),
  ('Zoho Projects', 'https://zoho.com/projects', 'Project management for growing teams', 'https://www.google.com/s2/favicons?domain=zoho.com&sz=128', 2, 14),
  ('Jira Work Management', 'https://atlassian.com/software/jira/work-management', 'Team project tracking by Atlassian', 'https://www.google.com/s2/favicons?domain=atlassian.com&sz=128', 2, 15),
  -- Service competitors
  ('Jira Service Management', 'https://atlassian.com/software/jira/service-management', 'IT service management by Atlassian', 'https://www.google.com/s2/favicons?domain=atlassian.com&sz=128', 1, 16),
  ('Freshservice', 'https://freshworks.com/freshservice', 'IT service management by Freshworks', 'https://www.google.com/s2/favicons?domain=freshworks.com&sz=128', 1, 17),
  ('Zendesk', 'https://zendesk.com', 'Customer service and engagement platform', 'https://www.google.com/s2/favicons?domain=zendesk.com&sz=128', 1, 18),
  ('ServiceNow', 'https://servicenow.com', 'Enterprise IT service management', 'https://www.google.com/s2/favicons?domain=servicenow.com&sz=128', 1, 19),
  -- Dev competitors
  ('Jira Software', 'https://atlassian.com/software/jira', 'Issue tracking and agile development by Atlassian', 'https://www.google.com/s2/favicons?domain=atlassian.com&sz=128', 1, 20)
ON CONFLICT DO NOTHING;

-- Clean up old generic entries that have been replaced by product-specific ones
DELETE FROM competitors WHERE name = 'Jira' AND NOT EXISTS (SELECT 1 FROM battle_knowledge_sources WHERE competitor_id = competitors.id);
DELETE FROM competitors WHERE name = 'Freshworks' AND NOT EXISTS (SELECT 1 FROM battle_knowledge_sources WHERE competitor_id = competitors.id);

-- Update existing competitors that have no logo_url to use Google Favicons
UPDATE competitors SET logo_url = 'https://www.google.com/s2/favicons?domain=' || regexp_replace(regexp_replace(website, '^https?://(www\.)?', ''), '/.*$', '') || '&sz=128'
WHERE (logo_url IS NULL OR logo_url = '' OR logo_url LIKE '%clearbit%') AND website IS NOT NULL AND website != '';

-- Seed product-competitor links (maps each competitor to their relevant monday product)
-- This uses a helper function to safely insert links by name matching
DO $$
DECLARE
  v_product_id UUID;
  v_competitor_id UUID;
BEGIN
  -- CRM competitors
  SELECT id INTO v_product_id FROM products WHERE lower(name) LIKE '%crm%' LIMIT 1;
  IF v_product_id IS NOT NULL THEN
    FOR v_competitor_id IN SELECT id FROM competitors WHERE name IN ('Salesforce CRM', 'HubSpot CRM', 'Zoho CRM', 'Attio') LOOP
      INSERT INTO product_competitors (product_id, competitor_id) VALUES (v_product_id, v_competitor_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Work Management competitors
  SELECT id INTO v_product_id FROM products WHERE lower(name) LIKE '%work%management%' OR lower(name) LIKE '%wm%' LIMIT 1;
  IF v_product_id IS NOT NULL THEN
    FOR v_competitor_id IN SELECT id FROM competitors WHERE name IN ('Asana', 'Smartsheet', 'ClickUp', 'Airtable', 'Wrike', 'Notion', 'Adobe Workfront', 'Microsoft Planner', 'Planview', 'Zoho Projects', 'Jira Work Management') LOOP
      INSERT INTO product_competitors (product_id, competitor_id) VALUES (v_product_id, v_competitor_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Service competitors
  SELECT id INTO v_product_id FROM products WHERE lower(name) LIKE '%service%' LIMIT 1;
  IF v_product_id IS NOT NULL THEN
    FOR v_competitor_id IN SELECT id FROM competitors WHERE name IN ('Jira Service Management', 'Freshservice', 'Zendesk', 'ServiceNow') LOOP
      INSERT INTO product_competitors (product_id, competitor_id) VALUES (v_product_id, v_competitor_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Dev competitors
  SELECT id INTO v_product_id FROM products WHERE lower(name) LIKE '%dev%' LIMIT 1;
  IF v_product_id IS NOT NULL THEN
    FOR v_competitor_id IN SELECT id FROM competitors WHERE name IN ('Jira Software') LOOP
      INSERT INTO product_competitors (product_id, competitor_id) VALUES (v_product_id, v_competitor_id) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
END $$;

-- Seed initial comparison parameters
INSERT INTO comparison_parameters (name, category, description, weight, is_ai_feature, order_index) VALUES
  ('Workflow Automation', 'features', 'Ability to create and manage automated workflows', 8, false, 1),
  ('Custom Fields & Views', 'features', 'Flexibility in data modeling and visualization', 7, false, 2),
  ('Reporting & Dashboards', 'features', 'Built-in analytics and reporting capabilities', 7, false, 3),
  ('Integration Ecosystem', 'integrations', 'Number and quality of third-party integrations', 8, false, 4),
  ('API & Developer Tools', 'integrations', 'API quality, documentation, and developer experience', 6, false, 5),
  ('AI Agents', 'ai_capabilities', 'Autonomous AI agents that execute work end-to-end', 10, true, 6),
  ('AI App Builder (Vibe)', 'ai_capabilities', 'Ability to build custom apps with AI/natural language', 10, true, 7),
  ('AI Assistant (Sidekick)', 'ai_capabilities', 'Intelligent AI assistant integrated into workflows', 9, true, 8),
  ('AI Automation', 'ai_capabilities', 'AI-powered automation and smart suggestions', 8, true, 9),
  ('Pricing Value', 'pricing', 'Cost-effectiveness relative to features provided', 7, false, 10),
  ('Free Tier', 'pricing', 'Availability and quality of free plan', 5, false, 11),
  ('Enterprise Security', 'security', 'SOC2, HIPAA, GDPR compliance and security features', 8, false, 12),
  ('SSO & Auth', 'security', 'Single sign-on and authentication options', 6, false, 13),
  ('User Experience', 'ux', 'Ease of use, onboarding, and interface quality', 8, false, 14),
  ('Mobile Experience', 'ux', 'Quality of mobile apps and responsive design', 6, false, 15),
  ('Customer Support', 'support', 'Quality and availability of customer support', 7, false, 16),
  ('Scalability', 'scalability', 'Ability to scale with enterprise-level needs', 8, false, 17)
ON CONFLICT DO NOTHING;

-- Seed initial messaging from product slides
INSERT INTO capability_messaging (capability_type, headline, value_points) VALUES
  ('agents', 'Unlimited resources of expert agents doing the work for you', '[
    {"title": "Start with expert agents", "description": "or build your own with the Agent Builder for any end-to-end workflow"},
    {"title": "Scale execution", "description": "with autonomous, always-on action across all your workflows"},
    {"title": "Plan, assign, and route", "description": "requests automatically while identifying and flagging potential bottlenecks"},
    {"title": "Customize skills", "description": "and terminology to match your specific workflows, native to your boards and context"},
    {"title": "Acts where you work", "description": "stepping in only when and where you decide"},
    {"title": "Stay in full control", "description": "with guardrails and enterprise-ready security and permissions"}
  ]'::jsonb),
  ('vibe', 'Turn any business need into a complete solution — consolidate your stack with just a prompt', '[
    {"title": "Build any work app", "description": "you can imagine tailored to your team needs"},
    {"title": "Consolidate your stack", "description": "by replacing tools with tailored apps"},
    {"title": "Natively connect", "description": "to your data, workflows and integrations ecosystem"},
    {"title": "Customize to perfection", "description": ""},
    {"title": "Secure and enterprise-ready", "description": ""},
    {"title": "Every app runs on monday.com''s trusted infrastructure", "description": ""}
  ]'::jsonb),
  ('sidekick', 'Your intelligent AI assistant that understands your work, thinks and executes with you', '[
    {"title": "Knows you and your business", "description": "understands your role, goals, and active work across monday.com and connected apps for precise responses"},
    {"title": "Accelerates work at every level", "description": "from planning and research to execution — handling your tasks from start to finish"},
    {"title": "Works the way you do", "description": "Sidekick learns your workflows, preferences, and style with every interaction to help you perform at your best"},
    {"title": "Keeps you in total control", "description": "every action is transparent and adjustable. You orchestrate and Sidekick executes"},
    {"title": "Delivers answers you can trust", "description": "Securely connected to the web and powered by advanced LLMs for accurate, real-world moves"}
  ]'::jsonb)
ON CONFLICT (capability_type) DO NOTHING;
