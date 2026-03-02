-- =============================================
-- Assign Agents to Departments
-- Run this in Supabase SQL Editor
-- =============================================

-- First, clear existing agent-department links (optional - remove if you want to keep existing)
-- DELETE FROM department_agents;

-- =============================================
-- PROJECT AGENTS → Operations + Product & Engineering
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Operations' 
AND a.name IN ('Project Agent', 'Risk Analyzer', 'Meeting Scheduler', 'Follow-up Agent', 'Action Item Agent')
ON CONFLICT DO NOTHING;

INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Product & Engineering' 
AND a.name IN ('Project Agent', 'Risk Analyzer', 'Meeting Scheduler', 'Follow-up Agent', 'Action Item Agent')
ON CONFLICT DO NOTHING;

-- =============================================
-- MARKETING AGENTS → Marketing
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Marketing' 
AND a.name IN (
  'Marketing Agent', 
  'RSVP Agent', 
  'Competitor Agent', 
  'Market Landscape Analyzer', 
  'Marketing Image Generator', 
  'Translator Agent', 
  'Translator Agent 2'
)
ON CONFLICT DO NOTHING;

-- =============================================
-- SALES AGENTS → Sales
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Sales' 
AND a.name IN (
  'Sales Agent', 
  'Lead Agent', 
  'Contact Duplicates Finder', 
  'Sales Agent 2', 
  'SDR Agent', 
  'Meeting Summarizer'
)
ON CONFLICT DO NOTHING;

-- =============================================
-- PRODUCT & ENGINEERING AGENTS → Product & Engineering
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Product & Engineering' 
AND a.name IN (
  'Product & Engineering Agent', 
  'Sentiment Detector', 
  'Bug Prioritization Agent', 
  'Release Notes Agent', 
  'Competitor Research Agent (Product)', 
  'Daily Meeting Briefing Agent'
)
ON CONFLICT DO NOTHING;

-- =============================================
-- OPERATIONS AGENTS → Operations
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Operations' 
AND a.name IN (
  'Operations Agent', 
  'Process Automator', 
  'Vendor Researcher'
)
ON CONFLICT DO NOTHING;

-- =============================================
-- SUPPORT AGENTS → Customer Support
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Customer Support' 
AND a.name IN (
  'Support Agent', 
  'Customer Support Agent', 
  'SLA Monitor Agent'
)
ON CONFLICT DO NOTHING;

-- =============================================
-- HR AGENT → Human Resources
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Human Resources' 
AND a.name = 'HR Agent'
ON CONFLICT DO NOTHING;

-- =============================================
-- IT AGENT → Product & Engineering + Operations
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Product & Engineering' 
AND a.name = 'IT Agent'
ON CONFLICT DO NOTHING;

INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Operations' 
AND a.name = 'IT Agent'
ON CONFLICT DO NOTHING;

-- =============================================
-- FINANCIAL AGENT → Finance
-- =============================================
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Finance' 
AND a.name = 'Financial Agent'
ON CONFLICT DO NOTHING;

-- =============================================
-- CROSS-DEPARTMENT AGENTS
-- Some agents are useful across multiple departments
-- =============================================

-- Meeting Scheduler is useful for all departments
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE a.name = 'Meeting Scheduler'
ON CONFLICT DO NOTHING;

-- Translator is useful for Marketing and Sales
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Sales' 
AND a.name IN ('Translator Agent', 'Translator Agent 2')
ON CONFLICT DO NOTHING;

-- Risk Analyzer for Legal
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Legal' 
AND a.name = 'Risk Analyzer'
ON CONFLICT DO NOTHING;

-- Vendor Researcher for Finance
INSERT INTO department_agents (department_id, agent_id)
SELECT d.id, a.id 
FROM departments d, agents a 
WHERE d.title = 'Finance' 
AND a.name = 'Vendor Researcher'
ON CONFLICT DO NOTHING;

-- =============================================
-- Verify the assignments
-- =============================================
SELECT 
  d.title as department,
  COUNT(da.agent_id) as agent_count,
  STRING_AGG(a.name, ', ' ORDER BY a.name) as agents
FROM departments d
LEFT JOIN department_agents da ON d.id = da.department_id
LEFT JOIN agents a ON da.agent_id = a.id
GROUP BY d.id, d.title
ORDER BY d.title;
