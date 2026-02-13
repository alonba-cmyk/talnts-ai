import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import {
  Sparkles,
  Search,
  Mail,
  FileText,
  BarChart3,
  Target,
  Send,
  Users,
  PenLine,
  Eye,
  Settings,
  CheckCircle2,
  MessageSquare,
  Bot,
  ArrowRight,
  Loader2,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { useDepartments, useDepartmentData } from '@/hooks/useSupabase';
import sidekickIcon from '@/assets/sidekick-icon.png';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface MappedDepartment {
  id: string;
  title: string;
  avatarImage: string;
  avatarBgColor: string;
}

interface MappedAgent {
  name: string;
  image: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  color: string;
  image: string;
}

interface BoardItem {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  owner: string;
  metric: string;
  agentName: string;
}

type OverlayVisualMode = 'conversation' | 'email' | 'document';

interface PreviewLine {
  from?: string;
  text: string;
  isAgent?: boolean;
  appearAtStep: number;
}

interface OverlayContact {
  name: string;
  image: string;
}

interface OverlayEmail {
  from: string;
  to: string;
  subject: string;
}

interface Command {
  id: string;
  label: string;
  icon: LucideIcon;
  teamMember: string;
  chatMessage: string;
  agentName: string;
  agentSteps: string[];
  boardEffect: {
    rowId: string;
    column: string;
    newValue: string;
    newStatus?: string;
    newStatusColor?: string;
  };
  overlayMode: OverlayVisualMode;
  overlayContact?: OverlayContact;
  overlayEmail?: OverlayEmail;
  overlayPreview: PreviewLine[];
}

interface ChatMessage {
  id: string;
  sender: 'human' | 'agent' | 'sidekick';
  senderName: string;
  text: string;
  isStep?: boolean;
  stepIndex?: number;
  isComplete?: boolean;
}

// ─── Hardcoded Data ────────────────────────────────────────────────────────────

const TEAM_MEMBERS: Record<string, TeamMember[]> = {
  sales: [
    { name: 'Sarah K.', role: 'Team Lead', color: '#6366f1', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'David M.', role: 'Account Executive', color: '#f59e0b', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Lisa R.', role: 'SDR Manager', color: '#10b981', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ],
  marketing: [
    { name: 'Emma W.', role: 'Marketing Lead', color: '#ec4899', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { name: 'Jason T.', role: 'Content Strategist', color: '#8b5cf6', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { name: 'Maria S.', role: 'Growth Manager', color: '#06b6d4', image: 'https://randomuser.me/api/portraits/women/90.jpg' },
  ],
  operations: [
    { name: 'Mike B.', role: 'Ops Director', color: '#f97316', image: 'https://randomuser.me/api/portraits/men/46.jpg' },
    { name: 'Rachel K.', role: 'Process Manager', color: '#14b8a6', image: 'https://randomuser.me/api/portraits/women/47.jpg' },
    { name: 'Tom H.', role: 'Systems Analyst', color: '#6366f1', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
  ],
  support: [
    { name: 'Anna C.', role: 'Support Lead', color: '#ef4444', image: 'https://randomuser.me/api/portraits/women/33.jpg' },
    { name: 'Chris D.', role: 'Escalation Manager', color: '#8b5cf6', image: 'https://randomuser.me/api/portraits/men/86.jpg' },
    { name: 'Nina P.', role: 'CX Specialist', color: '#10b981', image: 'https://randomuser.me/api/portraits/women/56.jpg' },
  ],
  product: [
    { name: 'Dan F.', role: 'Product Lead', color: '#6366f1', image: 'https://randomuser.me/api/portraits/men/52.jpg' },
    { name: 'Sophie L.', role: 'UX Researcher', color: '#ec4899', image: 'https://randomuser.me/api/portraits/women/17.jpg' },
    { name: 'Alex N.', role: 'Tech PM', color: '#f59e0b', image: 'https://randomuser.me/api/portraits/men/64.jpg' },
  ],
  legal: [
    { name: 'James W.', role: 'Legal Counsel', color: '#10b981', image: 'https://randomuser.me/api/portraits/men/41.jpg' },
    { name: 'Emily R.', role: 'Compliance Officer', color: '#6366f1', image: 'https://randomuser.me/api/portraits/women/76.jpg' },
    { name: 'Kate M.', role: 'Contract Manager', color: '#f59e0b', image: 'https://randomuser.me/api/portraits/women/89.jpg' },
  ],
  finance: [
    { name: 'Robert S.', role: 'Finance Director', color: '#f97316', image: 'https://randomuser.me/api/portraits/men/67.jpg' },
    { name: 'Helen T.', role: 'Controller', color: '#6366f1', image: 'https://randomuser.me/api/portraits/women/54.jpg' },
    { name: 'Paul K.', role: 'FP&A Manager', color: '#10b981', image: 'https://randomuser.me/api/portraits/men/29.jpg' },
  ],
  hr: [
    { name: 'Linda G.', role: 'HR Director', color: '#06b6d4', image: 'https://randomuser.me/api/portraits/women/42.jpg' },
    { name: 'Steve J.', role: 'Talent Manager', color: '#ec4899', image: 'https://randomuser.me/api/portraits/men/36.jpg' },
    { name: 'Karen H.', role: 'People Ops', color: '#8b5cf6', image: 'https://randomuser.me/api/portraits/women/63.jpg' },
  ],
};

const DEPARTMENT_BOARDS: Record<string, { boardName: string; columns: string[]; items: BoardItem[] }> = {
  sales: {
    boardName: 'CRM Board',
    columns: ['Lead', 'Status', 'Owner', 'Deal Value', 'Agent'],
    items: [
      { id: 's1', name: 'Acme Corp - Enterprise', status: 'Negotiation', statusColor: '#f59e0b', owner: 'Sarah K.', metric: '$120K', agentName: 'SDR Agent' },
      { id: 's2', name: 'TechFlow - Mid-Market', status: 'Discovery', statusColor: '#6366f1', owner: 'David M.', metric: '$45K', agentName: 'Lead Agent' },
      { id: 's3', name: 'Globex - Startup', status: 'Proposal Sent', statusColor: '#8b5cf6', owner: 'Lisa R.', metric: '$28K', agentName: 'SDR Agent' },
      { id: 's4', name: 'Initech - Enterprise', status: 'Demo Scheduled', statusColor: '#06b6d4', owner: 'Sarah K.', metric: '$95K', agentName: 'Follow-up Agent' },
      { id: 's5', name: 'CloudNet - SMB', status: 'Qualification', statusColor: '#f97316', owner: 'David M.', metric: '$32K', agentName: 'Lead Agent' },
    ],
  },
  marketing: {
    boardName: 'Campaign Board',
    columns: ['Campaign', 'Status', 'Owner', 'Budget', 'Agent'],
    items: [
      { id: 'm1', name: 'Q1 Product Launch', status: 'Active', statusColor: '#10b981', owner: 'Emma W.', metric: '$50K', agentName: 'Content Agent' },
      { id: 'm2', name: 'SEO Optimization', status: 'Planning', statusColor: '#6366f1', owner: 'Jason T.', metric: '$15K', agentName: 'Research Agent' },
      { id: 'm3', name: 'Email Nurture Series', status: 'Draft', statusColor: '#f59e0b', owner: 'Maria S.', metric: '$8K', agentName: 'Content Agent' },
      { id: 'm4', name: 'Webinar Campaign', status: 'Scheduled', statusColor: '#8b5cf6', owner: 'Emma W.', metric: '$12K', agentName: 'Event Agent' },
      { id: 'm5', name: 'Social Media Push', status: 'Active', statusColor: '#10b981', owner: 'Jason T.', metric: '$20K', agentName: 'Social Agent' },
    ],
  },
  operations: {
    boardName: 'Operations Board',
    columns: ['Process', 'Status', 'Owner', 'Impact', 'Agent'],
    items: [
      { id: 'o1', name: 'Vendor Onboarding', status: 'In Progress', statusColor: '#f59e0b', owner: 'Mike B.', metric: 'High', agentName: 'Process Agent' },
      { id: 'o2', name: 'Inventory Audit', status: 'Scheduled', statusColor: '#6366f1', owner: 'Rachel K.', metric: 'Medium', agentName: 'Audit Agent' },
      { id: 'o3', name: 'SLA Review', status: 'Pending', statusColor: '#f97316', owner: 'Tom H.', metric: 'High', agentName: 'Compliance Agent' },
      { id: 'o4', name: 'Cost Optimization', status: 'Analysis', statusColor: '#8b5cf6', owner: 'Mike B.', metric: 'Critical', agentName: 'Analytics Agent' },
      { id: 'o5', name: 'Workflow Automation', status: 'Active', statusColor: '#10b981', owner: 'Rachel K.', metric: 'High', agentName: 'Automation Agent' },
    ],
  },
  support: {
    boardName: 'Tickets Board',
    columns: ['Ticket', 'Status', 'Owner', 'Priority', 'Agent'],
    items: [
      { id: 'su1', name: 'Login issues - Acme', status: 'Open', statusColor: '#ef4444', owner: 'Anna C.', metric: 'P1', agentName: 'Triage Agent' },
      { id: 'su2', name: 'API integration help', status: 'In Progress', statusColor: '#f59e0b', owner: 'Chris D.', metric: 'P2', agentName: 'Tech Agent' },
      { id: 'su3', name: 'Billing discrepancy', status: 'Waiting', statusColor: '#6366f1', owner: 'Nina P.', metric: 'P2', agentName: 'Billing Agent' },
      { id: 'su4', name: 'Feature request - Dashboard', status: 'Triaged', statusColor: '#8b5cf6', owner: 'Anna C.', metric: 'P3', agentName: 'Triage Agent' },
      { id: 'su5', name: 'Onboarding assistance', status: 'Open', statusColor: '#f97316', owner: 'Chris D.', metric: 'P2', agentName: 'Onboarding Agent' },
    ],
  },
  product: {
    boardName: 'Product Board',
    columns: ['Feature', 'Status', 'Owner', 'Priority', 'Agent'],
    items: [
      { id: 'p1', name: 'AI Dashboard V2', status: 'In Dev', statusColor: '#6366f1', owner: 'Dan F.', metric: 'High', agentName: 'Spec Agent' },
      { id: 'p2', name: 'User Onboarding Flow', status: 'Design', statusColor: '#ec4899', owner: 'Sophie L.', metric: 'Critical', agentName: 'UX Agent' },
      { id: 'p3', name: 'API V3 Migration', status: 'Planning', statusColor: '#f59e0b', owner: 'Alex N.', metric: 'High', agentName: 'Tech Agent' },
      { id: 'p4', name: 'Mobile App Push', status: 'QA', statusColor: '#10b981', owner: 'Dan F.', metric: 'Medium', agentName: 'QA Agent' },
      { id: 'p5', name: 'Analytics Module', status: 'Spec', statusColor: '#8b5cf6', owner: 'Sophie L.', metric: 'Medium', agentName: 'Spec Agent' },
    ],
  },
  legal: {
    boardName: 'Contracts Board',
    columns: ['Contract', 'Status', 'Owner', 'Value', 'Agent'],
    items: [
      { id: 'l1', name: 'Acme Corp NDA', status: 'Review', statusColor: '#f59e0b', owner: 'James W.', metric: '$2M', agentName: 'Contract Agent' },
      { id: 'l2', name: 'Vendor Agreement - TechCo', status: 'Draft', statusColor: '#6366f1', owner: 'Emily R.', metric: '$500K', agentName: 'Compliance Agent' },
      { id: 'l3', name: 'Employment Terms Update', status: 'Approved', statusColor: '#10b981', owner: 'Kate M.', metric: 'N/A', agentName: 'Policy Agent' },
      { id: 'l4', name: 'IP License - DataFlow', status: 'Negotiation', statusColor: '#8b5cf6', owner: 'James W.', metric: '$1.2M', agentName: 'Contract Agent' },
      { id: 'l5', name: 'GDPR Compliance Audit', status: 'In Progress', statusColor: '#f97316', owner: 'Emily R.', metric: 'Critical', agentName: 'Compliance Agent' },
    ],
  },
  finance: {
    boardName: 'Finance Board',
    columns: ['Item', 'Status', 'Owner', 'Amount', 'Agent'],
    items: [
      { id: 'f1', name: 'Q1 Budget Review', status: 'In Progress', statusColor: '#f59e0b', owner: 'Robert S.', metric: '$2.5M', agentName: 'Budget Agent' },
      { id: 'f2', name: 'Expense Reconciliation', status: 'Pending', statusColor: '#6366f1', owner: 'Helen T.', metric: '$180K', agentName: 'Reconciliation Agent' },
      { id: 'f3', name: 'Revenue Forecast', status: 'Draft', statusColor: '#8b5cf6', owner: 'Paul K.', metric: '$4.2M', agentName: 'Forecast Agent' },
      { id: 'f4', name: 'Vendor Payments', status: 'Approved', statusColor: '#10b981', owner: 'Helen T.', metric: '$350K', agentName: 'AP Agent' },
      { id: 'f5', name: 'Tax Filing Prep', status: 'Scheduled', statusColor: '#f97316', owner: 'Robert S.', metric: 'N/A', agentName: 'Tax Agent' },
    ],
  },
  hr: {
    boardName: 'People Board',
    columns: ['Task', 'Status', 'Owner', 'Impact', 'Agent'],
    items: [
      { id: 'h1', name: 'Engineering Hiring', status: 'Active', statusColor: '#10b981', owner: 'Linda G.', metric: '5 roles', agentName: 'Recruiting Agent' },
      { id: 'h2', name: 'Performance Reviews', status: 'Scheduled', statusColor: '#6366f1', owner: 'Steve J.', metric: '120 people', agentName: 'Review Agent' },
      { id: 'h3', name: 'Benefits Enrollment', status: 'Open', statusColor: '#f59e0b', owner: 'Karen H.', metric: 'Company-wide', agentName: 'Benefits Agent' },
      { id: 'h4', name: 'Onboarding - New Hires', status: 'In Progress', statusColor: '#8b5cf6', owner: 'Linda G.', metric: '8 people', agentName: 'Onboarding Agent' },
      { id: 'h5', name: 'Culture Survey', status: 'Planning', statusColor: '#f97316', owner: 'Steve J.', metric: 'All teams', agentName: 'Survey Agent' },
    ],
  },
};

const DEPARTMENT_COMMANDS: Record<string, Command[]> = {
  sales: [
    {
      id: 'qualify-lead', label: 'Qualify new lead', icon: Search,
      teamMember: 'Sarah K.', chatMessage: 'Hey SDR Agent, we got a new inbound lead from Nexus Corp. Can you qualify them and check if they match our ICP?',
      agentName: 'SDR Agent',
      agentSteps: ['Analyzing Nexus Corp firmographics...', 'Checking ICP match: 500+ employees, SaaS, Series C ✓', 'Lead score: 87/100 — High priority. Adding to pipeline.'],
      boardEffect: { rowId: 's5', column: 'status', newValue: 'Qualified', newStatus: 'Qualified', newStatusColor: '#10b981' },
      overlayMode: 'conversation',
      overlayContact: { name: 'Tom (Nexus Corp)', image: 'https://randomuser.me/api/portraits/men/55.jpg' },
      overlayPreview: [
        { from: 'SDR Agent', text: 'Hi Tom, reaching out regarding your demo request for monday.com...', isAgent: true, appearAtStep: 0 },
        { from: 'Tom', text: 'Yes, we need a solution for our 500-person engineering team.', isAgent: false, appearAtStep: 1 },
        { from: 'SDR Agent', text: 'Perfect match! ICP score 87/100. Scheduling a demo now.', isAgent: true, appearAtStep: 2 },
      ],
    },
    {
      id: 'follow-up', label: 'Follow up with Acme Corp', icon: Mail,
      teamMember: 'David M.', chatMessage: 'Follow-up Agent, Acme Corp hasn\'t responded in 3 days. Draft a personalized follow-up email based on their last meeting notes.',
      agentName: 'Follow-up Agent',
      agentSteps: ['Reviewing meeting notes from Jan 15...', 'Drafting personalized email referencing ROI discussion...', 'Email sent to john@acmecorp.com. Follow-up scheduled for 48h.'],
      boardEffect: { rowId: 's1', column: 'status', newValue: 'Follow-up Sent', newStatus: 'Follow-up Sent', newStatusColor: '#06b6d4' },
      overlayMode: 'email',
      overlayEmail: { from: 'Follow-up Agent via David M.', to: 'john@acmecorp.com', subject: 'Re: ROI Discussion — Next Steps for Acme Corp' },
      overlayPreview: [
        { text: 'Hi John,', appearAtStep: 0 },
        { text: 'Following up on our conversation about the 3x productivity gains your team could achieve with monday.com. I\'d love to schedule a quick call to walk through the ROI model we prepared specifically for Acme Corp.', appearAtStep: 1 },
        { text: 'Best regards,\nDavid M. · Account Executive', appearAtStep: 2 },
      ],
    },
    {
      id: 'update-pipeline', label: 'Update pipeline forecast', icon: BarChart3,
      teamMember: 'Lisa R.', chatMessage: 'Lead Agent, run a pipeline analysis for Q1. I need deal velocity and conversion rates by stage.',
      agentName: 'Lead Agent',
      agentSteps: ['Aggregating pipeline data across 23 active deals...', 'Avg deal velocity: 34 days. Conversion: Discovery→Proposal 68%', 'Q1 forecast updated: $385K weighted pipeline. Report ready.'],
      boardEffect: { rowId: 's2', column: 'status', newValue: 'Analysis Complete', newStatus: 'Analysis Complete', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Pipeline', text: 'Active Deals: 23 · Total Pipeline: $520K', appearAtStep: 0 },
        { from: 'Velocity', text: 'Avg Velocity: 34 days · Discovery→Proposal: 68%', appearAtStep: 1 },
        { from: 'Forecast', text: 'Q1 Weighted Forecast: $385K (+12% vs last month)', appearAtStep: 2 },
      ],
    },
  ],
  marketing: [
    {
      id: 'launch-campaign', label: 'Launch email campaign', icon: Send,
      teamMember: 'Emma W.', chatMessage: 'Content Agent, we need to launch the Q1 product announcement email. Use the approved copy and segment for enterprise accounts.',
      agentName: 'Content Agent',
      agentSteps: ['Loading approved copy and enterprise segment (2,340 contacts)...', 'Personalizing subject lines with A/B variants...', 'Campaign launched. Estimated delivery: 98.5%. Tracking enabled.'],
      boardEffect: { rowId: 'm1', column: 'status', newValue: 'Launched', newStatus: 'Launched', newStatusColor: '#10b981' },
      overlayMode: 'email',
      overlayEmail: { from: 'Content Agent via Emma W.', to: '2,340 enterprise contacts', subject: 'Introducing monday AI — Your Team\'s New Superpower' },
      overlayPreview: [
        { text: 'Hi there,', appearAtStep: 0 },
        { text: 'We\'re thrilled to announce monday AI — a suite of intelligent agents that automate your workflows, write content, and manage projects while you focus on what matters most.', appearAtStep: 1 },
        { text: 'See it in action →\n\nA/B variant B: "See How AI Can 3x Your Team\'s Output"', appearAtStep: 2 },
      ],
    },
    {
      id: 'analyze-performance', label: 'Analyze campaign performance', icon: Eye,
      teamMember: 'Jason T.', chatMessage: 'Research Agent, pull the performance report for our SEO campaign. I need organic traffic trends and top converting pages.',
      agentName: 'Research Agent',
      agentSteps: ['Pulling analytics data from last 30 days...', 'Organic traffic up 23%. Top page: /pricing (4.2% conversion)', 'Full report generated with 12 optimization recommendations.'],
      boardEffect: { rowId: 'm2', column: 'status', newValue: 'Analyzed', newStatus: 'Analyzed', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Traffic', text: 'Organic Traffic: 12,450 visits (+23% MoM)', appearAtStep: 0 },
        { from: 'Top Page', text: '/pricing — 4.2% conversion rate · 523 signups', appearAtStep: 1 },
        { from: 'Actions', text: '12 optimization recommendations generated', appearAtStep: 2 },
      ],
    },
    {
      id: 'create-content', label: 'Generate social content', icon: PenLine,
      teamMember: 'Maria S.', chatMessage: 'Social Agent, create a week\'s worth of LinkedIn posts promoting our new AI features. Match our brand voice.',
      agentName: 'Social Agent',
      agentSteps: ['Analyzing brand voice guidelines and recent posts...', 'Generating 5 LinkedIn posts with visuals and hashtags...', '5 posts scheduled: Mon-Fri, 10am EST. Preview ready for review.'],
      boardEffect: { rowId: 'm5', column: 'status', newValue: 'Content Ready', newStatus: 'Content Ready', newStatusColor: '#8b5cf6' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Monday', text: 'Exciting news! Our new AI agents can now handle your entire workflow...', appearAtStep: 0 },
        { from: 'Tuesday', text: '3 ways AI is transforming project management in 2026...', appearAtStep: 1 },
        { from: 'Wed-Fri', text: '+3 more posts ready · #AIProductivity #FutureOfWork', appearAtStep: 2 },
      ],
    },
  ],
  operations: [
    {
      id: 'audit-process', label: 'Run process audit', icon: Search,
      teamMember: 'Mike B.', chatMessage: 'Audit Agent, run a full audit on our vendor onboarding process. Flag any SLA violations or bottlenecks.',
      agentName: 'Audit Agent',
      agentSteps: ['Scanning 47 vendor onboarding records...', 'Found 3 SLA violations: avg onboarding time 12 days (target: 7)', 'Bottleneck identified: Legal review stage. Report with recommendations ready.'],
      boardEffect: { rowId: 'o2', column: 'status', newValue: 'Audit Complete', newStatus: 'Audit Complete', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Scope', text: 'Records scanned: 47 vendors · Period: Last 90 days', appearAtStep: 0 },
        { from: 'Findings', text: '3 SLA violations · Avg onboarding: 12 days (target: 7)', appearAtStep: 1 },
        { from: 'Bottleneck', text: 'Legal review (avg 5.2 days) · 4 recommendations', appearAtStep: 2 },
      ],
    },
    {
      id: 'optimize-costs', label: 'Analyze cost savings', icon: BarChart3,
      teamMember: 'Rachel K.', chatMessage: 'Analytics Agent, identify top 5 cost optimization opportunities across our operations budget.',
      agentName: 'Analytics Agent',
      agentSteps: ['Analyzing $2.4M operations budget across 8 categories...', 'Top opportunity: consolidate 3 overlapping SaaS tools (-$45K/yr)', 'Full report: 5 opportunities totaling $128K annual savings.'],
      boardEffect: { rowId: 'o4', column: 'status', newValue: 'Savings Identified', newStatus: 'Savings Identified', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Budget', text: 'Analyzed: $2.4M across 8 categories', appearAtStep: 0 },
        { from: '#1 Saving', text: 'Consolidate SaaS tools → save $45K/yr', appearAtStep: 1 },
        { from: 'Total', text: '5 opportunities · $128K annual savings identified', appearAtStep: 2 },
      ],
    },
    {
      id: 'automate-workflow', label: 'Automate approval workflow', icon: Settings,
      teamMember: 'Tom H.', chatMessage: 'Automation Agent, set up an automated approval workflow for purchase orders under $5K. Route to department leads.',
      agentName: 'Automation Agent',
      agentSteps: ['Mapping current PO approval flow (avg 3.2 days)...', 'Building automated routing rules for 6 department leads...', 'Workflow live. Expected approval time: <4 hours. Monitoring enabled.'],
      boardEffect: { rowId: 'o5', column: 'status', newValue: 'Automated', newStatus: 'Automated', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Current', text: 'Manual routing → 3.2 day avg approval time', appearAtStep: 0 },
        { from: 'New Flow', text: 'Auto-route to 6 dept leads · Rules configured', appearAtStep: 1 },
        { from: 'Result', text: 'Expected: <4 hours approval · 95% auto-routed', appearAtStep: 2 },
      ],
    },
  ],
  support: [
    {
      id: 'triage-tickets', label: 'Triage incoming tickets', icon: Target,
      teamMember: 'Anna C.', chatMessage: 'Triage Agent, we have 15 new tickets from overnight. Categorize by priority and assign to the right agents.',
      agentName: 'Triage Agent',
      agentSteps: ['Analyzing 15 tickets using NLP classification...', 'P1: 2 tickets, P2: 8 tickets, P3: 5 tickets. Auto-assigned.', 'All tickets triaged and assigned. 2 P1s escalated to Chris D.'],
      boardEffect: { rowId: 'su1', column: 'status', newValue: 'Assigned', newStatus: 'Assigned', newStatusColor: '#f59e0b' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Incoming', text: '15 tickets · NLP classification running...', appearAtStep: 0 },
        { from: 'Priority', text: 'P1: 2 · P2: 8 · P3: 5', appearAtStep: 1 },
        { from: 'Actions', text: '2 P1s escalated to Chris D. · All assigned', appearAtStep: 2 },
      ],
    },
    {
      id: 'draft-response', label: 'Draft customer response', icon: MessageSquare,
      teamMember: 'Chris D.', chatMessage: 'Tech Agent, draft a response for the API integration issue. Include code samples for the OAuth2 flow.',
      agentName: 'Tech Agent',
      agentSteps: ['Reviewing ticket details and customer\'s tech stack...', 'Generating OAuth2 integration guide with Node.js samples...', 'Draft response ready with 3 code examples. Awaiting your review.'],
      boardEffect: { rowId: 'su2', column: 'status', newValue: 'Response Draft', newStatus: 'Response Draft', newStatusColor: '#8b5cf6' },
      overlayMode: 'conversation',
      overlayContact: { name: 'Mike (Customer)', image: 'https://randomuser.me/api/portraits/men/71.jpg' },
      overlayPreview: [
        { from: 'Mike', text: 'We\'re getting 401 errors when calling the API with our OAuth2 token...', isAgent: false, appearAtStep: 0 },
        { from: 'Tech Agent', text: 'I see the issue. Here\'s the correct OAuth2 flow: use client_credentials grant type...', isAgent: true, appearAtStep: 1 },
        { from: 'Tech Agent', text: 'I\'ve attached 3 code samples: Token request, API call, Refresh flow.', isAgent: true, appearAtStep: 2 },
      ],
    },
    {
      id: 'analyze-trends', label: 'Analyze support trends', icon: BarChart3,
      teamMember: 'Nina P.', chatMessage: 'Triage Agent, generate a trends report for this month. I need top issue categories and resolution times.',
      agentName: 'Triage Agent',
      agentSteps: ['Analyzing 342 tickets from the past 30 days...', 'Top category: "Integration" (28%). Avg resolution: 4.2 hours', 'Trend report ready. Key insight: login issues down 40% after last fix.'],
      boardEffect: { rowId: 'su4', column: 'status', newValue: 'Report Ready', newStatus: 'Report Ready', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Volume', text: 'Tickets analyzed: 342 · Period: Last 30 days', appearAtStep: 0 },
        { from: 'Top Issues', text: '#1 Integration (28%) · #2 Auth (19%) · #3 Billing (14%)', appearAtStep: 1 },
        { from: 'Insight', text: 'Login issues down 40% after v2.3 patch · Avg resolution: 4.2h', appearAtStep: 2 },
      ],
    },
  ],
  product: [
    {
      id: 'write-spec', label: 'Generate feature spec', icon: FileText,
      teamMember: 'Dan F.', chatMessage: 'Spec Agent, write a PRD for the Analytics Module. Include user stories, acceptance criteria, and technical requirements.',
      agentName: 'Spec Agent',
      agentSteps: ['Researching similar features and user feedback (23 requests)...', 'Drafting PRD with 8 user stories and acceptance criteria...', 'PRD complete: 8 stories, 15 acceptance criteria, tech stack recommendations.'],
      boardEffect: { rowId: 'p5', column: 'status', newValue: 'Spec Ready', newStatus: 'Spec Ready', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Research', text: '23 user requests analyzed · Top need: custom dashboards', appearAtStep: 0 },
        { from: 'US-001', text: 'As a manager, I want to create custom analytics dashboards...', appearAtStep: 1 },
        { from: 'PRD', text: '8 user stories · 15 acceptance criteria · Tech: React + D3.js', appearAtStep: 2 },
      ],
    },
    {
      id: 'user-research', label: 'Run user research analysis', icon: Users,
      teamMember: 'Sophie L.', chatMessage: 'UX Agent, analyze the latest 50 user interviews for the onboarding flow. Extract pain points and opportunity areas.',
      agentName: 'UX Agent',
      agentSteps: ['Processing 50 interview transcripts with NLP...', 'Top 3 pain points: setup complexity, missing templates, unclear next steps', 'Research synthesis complete with 7 design recommendations.'],
      boardEffect: { rowId: 'p2', column: 'status', newValue: 'Research Done', newStatus: 'Research Done', newStatusColor: '#10b981' },
      overlayMode: 'conversation',
      overlayContact: { name: 'User #12', image: 'https://randomuser.me/api/portraits/women/28.jpg' },
      overlayPreview: [
        { from: 'User #12', text: '"The setup process was confusing — I didn\'t know what to do next."', isAgent: false, appearAtStep: 0 },
        { from: 'UX Agent', text: 'I see this pattern in 64% of interviews. Setup complexity is the #1 pain point.', isAgent: true, appearAtStep: 1 },
        { from: 'UX Agent', text: 'Synthesis complete: 3 pain points, 7 design recommendations ready.', isAgent: true, appearAtStep: 2 },
      ],
    },
    {
      id: 'competitive-analysis', label: 'Competitive analysis', icon: Eye,
      teamMember: 'Alex N.', chatMessage: 'Tech Agent, run a competitive analysis for our API V3 migration. Compare our approach to top 5 competitors.',
      agentName: 'Tech Agent',
      agentSteps: ['Analyzing API docs from 5 competitors...', 'Key differentiator: our GraphQL-first approach. Gap: webhook support', 'Full comparison matrix ready with strategic recommendations.'],
      boardEffect: { rowId: 'p3', column: 'status', newValue: 'Analysis Done', newStatus: 'Analysis Done', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Competitors', text: 'Asana, Jira, Notion, ClickUp, Linear', appearAtStep: 0 },
        { from: 'Analysis', text: 'Advantage: GraphQL-first · Gap: Webhook support', appearAtStep: 1 },
        { from: 'Matrix', text: '5x5 comparison: API design, auth, rate limits, SDKs, docs', appearAtStep: 2 },
      ],
    },
  ],
  legal: [
    {
      id: 'review-contract', label: 'Review contract', icon: FileText,
      teamMember: 'James W.', chatMessage: 'Contract Agent, review the Acme Corp NDA. Flag any non-standard clauses and compare to our template.',
      agentName: 'Contract Agent',
      agentSteps: ['Parsing 12-page NDA against standard template...', 'Found 3 non-standard clauses: indemnification, IP rights, term length', 'Redline document ready with suggested amendments.'],
      boardEffect: { rowId: 'l1', column: 'status', newValue: 'Reviewed', newStatus: 'Reviewed', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Page 4', text: 'Clause 7.2: Indemnification scope broader than standard', appearAtStep: 0 },
        { from: 'Page 8', text: 'Clause 12.1: IP assignment — not in our template', appearAtStep: 1 },
        { from: 'Redline', text: '3 clauses flagged · Suggested amendments attached', appearAtStep: 2 },
      ],
    },
    {
      id: 'compliance-check', label: 'Run compliance check', icon: Search,
      teamMember: 'Emily R.', chatMessage: 'Compliance Agent, run a GDPR compliance check on our data processing agreements. Flag any gaps.',
      agentName: 'Compliance Agent',
      agentSteps: ['Scanning 14 DPAs against GDPR Article 28 requirements...', '2 gaps found: missing data breach notification clause in 2 agreements', 'Compliance report ready. 12/14 agreements fully compliant.'],
      boardEffect: { rowId: 'l5', column: 'status', newValue: 'Gaps Found', newStatus: 'Gaps Found', newStatusColor: '#f59e0b' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Scope', text: 'Scanning 14 DPAs against GDPR Art. 28...', appearAtStep: 0 },
        { from: 'Gaps', text: '2 gaps: Missing breach notification clause', appearAtStep: 1 },
        { from: 'Result', text: '12/14 compliant · 2 require amendments', appearAtStep: 2 },
      ],
    },
    {
      id: 'draft-agreement', label: 'Draft vendor agreement', icon: PenLine,
      teamMember: 'Kate M.', chatMessage: 'Contract Agent, draft a standard vendor agreement for DataFlow. Include our updated IP licensing terms.',
      agentName: 'Contract Agent',
      agentSteps: ['Loading standard vendor template with latest IP terms...', 'Customizing for DataFlow: SaaS vendor, data processor role...', 'Draft agreement ready (18 pages). Key terms highlighted for review.'],
      boardEffect: { rowId: 'l2', column: 'status', newValue: 'Draft Ready', newStatus: 'Draft Ready', newStatusColor: '#8b5cf6' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Template', text: 'Standard Vendor Agreement v3.2 · IP License terms loaded', appearAtStep: 0 },
        { from: 'Section 5', text: 'DataFlow Inc. — SaaS vendor, data processor role defined', appearAtStep: 1 },
        { from: 'Final', text: '18-page draft ready · 4 key terms highlighted for review', appearAtStep: 2 },
      ],
    },
  ],
  finance: [
    {
      id: 'reconcile', label: 'Reconcile expenses', icon: Search,
      teamMember: 'Helen T.', chatMessage: 'Reconciliation Agent, reconcile last month\'s expenses against our GL. Flag any discrepancies over $500.',
      agentName: 'Reconciliation Agent',
      agentSteps: ['Processing 847 transactions against GL entries...', '4 discrepancies found totaling $3,200. Largest: $1,800 duplicate vendor payment', 'Reconciliation complete. 99.6% match rate. Exception report ready.'],
      boardEffect: { rowId: 'f2', column: 'status', newValue: 'Reconciled', newStatus: 'Reconciled', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Matched', text: 'Transactions: 847 · GL entries matched: 843', appearAtStep: 0 },
        { from: 'Exceptions', text: '4 discrepancies: $3,200 total · Largest: $1,800 duplicate', appearAtStep: 1 },
        { from: 'Result', text: 'Match rate: 99.6% · Exception report generated', appearAtStep: 2 },
      ],
    },
    {
      id: 'forecast', label: 'Update revenue forecast', icon: BarChart3,
      teamMember: 'Paul K.', chatMessage: 'Forecast Agent, update Q1 revenue forecast based on latest pipeline data and closed deals from this month.',
      agentName: 'Forecast Agent',
      agentSteps: ['Pulling pipeline data: 23 active deals, 8 closed this month...', 'Applying weighted probability model by stage...', 'Q1 forecast updated: $4.5M (+7% from last estimate). Board deck ready.'],
      boardEffect: { rowId: 'f3', column: 'status', newValue: 'Updated', newStatus: 'Updated', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Pipeline', text: '23 active deals · 8 closed this month ($1.2M)', appearAtStep: 0 },
        { from: 'Model', text: 'Weighted: Discovery 20% → Negotiation 70% → Closed 95%', appearAtStep: 1 },
        { from: 'Forecast', text: 'Q1 Forecast: $4.5M (+7%) · Board deck updated', appearAtStep: 2 },
      ],
    },
    {
      id: 'budget-review', label: 'Analyze budget variance', icon: Target,
      teamMember: 'Robert S.', chatMessage: 'Budget Agent, compare actual vs budgeted spending for Q1. Highlight departments that are over/under by more than 10%.',
      agentName: 'Budget Agent',
      agentSteps: ['Comparing actuals across 12 cost centers...', '3 departments over budget: Engineering (+14%), Marketing (+11%), Facilities (+18%)', 'Variance report ready. Total: $125K over budget. Action items included.'],
      boardEffect: { rowId: 'f1', column: 'status', newValue: 'Reviewed', newStatus: 'Reviewed', newStatusColor: '#f59e0b' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Scope', text: 'Cost centers analyzed: 12 · Budget: $2.5M', appearAtStep: 0 },
        { from: 'Over Budget', text: 'Engineering +14%, Marketing +11%, Facilities +18%', appearAtStep: 1 },
        { from: 'Variance', text: 'Total: $125K over · 5 action items defined', appearAtStep: 2 },
      ],
    },
  ],
  hr: [
    {
      id: 'screen-candidates', label: 'Screen candidates', icon: Users,
      teamMember: 'Linda G.', chatMessage: 'Recruiting Agent, screen the 45 new applications for the Senior Engineer role. Rank top 10 by skill match.',
      agentName: 'Recruiting Agent',
      agentSteps: ['Analyzing 45 resumes against job requirements...', 'Top match: Alex Chen (92%), strong React + Node.js + AI experience', 'Top 10 ranked. 3 recommended for immediate interviews. Report ready.'],
      boardEffect: { rowId: 'h1', column: 'status', newValue: 'Screened', newStatus: 'Screened', newStatusColor: '#10b981' },
      overlayMode: 'conversation',
      overlayContact: { name: 'Alex Chen', image: 'https://randomuser.me/api/portraits/men/78.jpg' },
      overlayPreview: [
        { from: 'Recruiting Agent', text: 'Hi Alex, reviewing your application for the Senior Engineer role...', isAgent: true, appearAtStep: 0 },
        { from: 'Alex Chen', text: 'Thanks! I have 8 years of experience with React, Node.js, and AI/ML systems.', isAgent: false, appearAtStep: 1 },
        { from: 'Recruiting Agent', text: 'Excellent — 92% match! Recommending you for an immediate interview.', isAgent: true, appearAtStep: 2 },
      ],
    },
    {
      id: 'prepare-reviews', label: 'Prepare performance reviews', icon: FileText,
      teamMember: 'Steve J.', chatMessage: 'Review Agent, prepare performance review summaries for the 15 engineering team members. Pull data from project boards and peer feedback.',
      agentName: 'Review Agent',
      agentSteps: ['Aggregating data from 3 project boards and 47 peer reviews...', 'Generating individual summaries with strengths and growth areas...', '15 review summaries ready. Avg completion rate: 94%. 3 flagged for discussion.'],
      boardEffect: { rowId: 'h2', column: 'status', newValue: 'Prepared', newStatus: 'Prepared', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Sources', text: '3 project boards · 47 peer reviews', appearAtStep: 0 },
        { from: 'Summary', text: 'Strengths: collaboration, code quality · Growth: documentation', appearAtStep: 1 },
        { from: 'Result', text: '15 reviews ready · Avg completion: 94% · 3 flagged', appearAtStep: 2 },
      ],
    },
    {
      id: 'onboarding-plan', label: 'Create onboarding plan', icon: Target,
      teamMember: 'Karen H.', chatMessage: 'Onboarding Agent, create personalized onboarding plans for the 3 new hires starting Monday. Include team intros and training schedules.',
      agentName: 'Onboarding Agent',
      agentSteps: ['Loading role requirements and team info for 3 new hires...', 'Building 30-day plans with team intros, tool setup, and milestones...', '3 onboarding plans created. Calendar invites sent. Buddy assignments included.'],
      boardEffect: { rowId: 'h4', column: 'status', newValue: 'Plans Ready', newStatus: 'Plans Ready', newStatusColor: '#10b981' },
      overlayMode: 'document',
      overlayPreview: [
        { from: 'Week 1', text: 'Team intros, tool setup, security training, buddy meeting', appearAtStep: 0 },
        { from: 'Week 2-3', text: 'Project onboarding, shadowing sessions, first tasks', appearAtStep: 1 },
        { from: 'Done', text: '3 plans created · 12 calendar invites · Buddies assigned', appearAtStep: 2 },
      ],
    },
  ],
};

const AGENT_COLORS = [
  { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.5)', text: '#818cf8' },
  { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.5)', text: '#f472b6' },
  { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)', text: '#34d399' },
  { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.5)', text: '#fbbf24' },
  { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.5)', text: '#a78bfa' },
  { bg: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.5)', text: '#22d3ee' },
];

// ─── Sub-Components ────────────────────────────────────────────────────────────

function StarsBackground({ count = 50 }: { count?: number }) {
  const stars = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      id: i, size: Math.random() * 2 + 1, left: Math.random() * 100,
      top: Math.random() * 100, duration: 2 + Math.random() * 2, delay: Math.random() * 2,
    })), [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <motion.div key={s.id} className="absolute rounded-full bg-white"
          style={{ width: s.size, height: s.size, left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }} />
      ))}
    </div>
  );
}

function DepartmentSelector({ departments, selectedId, onSelect }: {
  departments: MappedDepartment[]; selectedId: string | null; onSelect: (id: string) => void;
}) {
  return (
    <div className="flex justify-center gap-6 p-4 rounded-2xl mx-auto"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
      {departments.map((dept, i) => {
        const sel = selectedId === dept.id;
        return (
          <motion.button key={dept.id} initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: sel ? 1.1 : 1 }}
            transition={{ delay: 0.1 + i * 0.05, scale: { type: 'spring', stiffness: 300, damping: 20 } }}
            whileHover={{ scale: sel ? 1.12 : 1.05 }}
            onClick={() => onSelect(dept.id)}
            className="flex flex-col items-center gap-2 transition-all duration-300"
            style={{ opacity: sel ? 1 : 0.55 }}>
            <div className="relative rounded-full flex items-center justify-center overflow-hidden"
              style={{ width: sel ? 60 : 56, height: sel ? 60 : 56, backgroundColor: dept.avatarBgColor,
                border: sel ? '3px solid rgba(97,97,255,0.9)' : '2px solid rgba(255,255,255,0.15)',
                boxShadow: sel ? `0 0 25px ${dept.avatarBgColor}, 0 0 50px rgba(97,97,255,0.4)` : 'none',
                transition: 'width 0.3s, height 0.3s' }}>
              {dept.avatarImage ? <img src={dept.avatarImage} alt={dept.title} className="w-full h-full rounded-full object-cover" /> :
                <span className="text-white text-base font-bold">{dept.title.charAt(0).toUpperCase()}</span>}
            </div>
            <span className="font-semibold whitespace-nowrap"
              style={{ color: sel ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: sel ? 14 : 13, transition: 'font-size 0.3s, color 0.3s' }}>
              {dept.title.toLowerCase()}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Phase 1: Team Assembly Row ────────────────────────────────────────────────

function TeamAssemblyRow({ teamMembers, agents, departmentName, onStartWorking }: {
  teamMembers: TeamMember[];
  agents: MappedAgent[];
  departmentName: string;
  onStartWorking: () => void;
}) {
  const displayAgents = agents.slice(0, 4);

  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center mb-2"
      >
        <span className="text-xs font-medium tracking-[0.3em] uppercase text-indigo-400/70 mb-3 block">
          AI WORK PLATFORM
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Meet your new{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            {departmentName} squad
          </span>
        </h3>
        <p className="text-sm text-white/35">Your team and AI agents, working as one</p>
      </motion.div>

      <div className="flex items-end justify-center gap-2">
        {teamMembers.map((member, i) => (
          <motion.div
            key={`human-${member.name}`}
            layoutId={`avatar-human-${member.name}`}
            className="flex flex-col items-center mx-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: member.color, border: '3px solid rgba(255,255,255,0.3)',
                  boxShadow: `0 0 30px ${member.color}50` }}>
                {member.image ?
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" /> :
                  <span className="text-white text-2xl font-bold">{member.name.charAt(0)}</span>}
              </div>
            </motion.div>
            <span className="text-sm text-white/80 mt-3 whitespace-nowrap font-medium">{member.name}</span>
            <span className="text-xs text-white/40 whitespace-nowrap">{member.role}</span>
          </motion.div>
        ))}

        {/* Divider */}
        <div className="flex items-center mx-6 mb-10">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-purple-400/50 to-transparent" />
          <div className="mx-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.15)', border: '2px solid rgba(139,92,246,0.4)' }}>
            <span className="text-lg text-purple-300 font-bold">+</span>
          </div>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-purple-400/50 to-transparent" />
        </div>

        {displayAgents.map((agent, i) => {
          const color = AGENT_COLORS[i % AGENT_COLORS.length];
          return (
            <motion.div
              key={`agent-${agent.name}`}
              layoutId={`avatar-agent-${agent.name}`}
              className="flex flex-col items-center mx-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.3 + i * 0.5 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                  style={{ background: agent.image ? 'transparent' : color.bg,
                    border: `3px solid ${color.border}`,
                    boxShadow: `0 0 30px ${color.border}50` }}>
                  {agent.image ?
                    <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" style={{ mixBlendMode: 'lighten' }} /> :
                    <span className="text-white font-bold text-lg">{agent.name.charAt(0)}</span>}
                </div>
                {/* AI badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', border: '2px solid rgba(15,15,35,0.9)' }}>
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </motion.div>
              <span className="text-sm text-white/80 mt-3 whitespace-nowrap font-medium">{agent.name}</span>
              <span className="text-xs text-purple-400/50 whitespace-nowrap">AI Agent</span>
            </motion.div>
          );
        })}
      </div>

      {/* Start Working button */}
      <motion.button
        onClick={onStartWorking}
        className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))',
          border: '1px solid rgba(99,102,241,0.4)',
          color: '#c7d2fe',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}
        whileTap={{ scale: 0.97 }}
      >
        <Sparkles className="w-4 h-4" />
        Start working together
        <motion.span
          className="inline-block"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

// ─── Phase 2: Workspace ────────────────────────────────────────────────────────

function Workspace({ teamMembers, agents, commands, boardData, departmentName, showBoard, onFirstCommand }: {
  teamMembers: TeamMember[];
  agents: MappedAgent[];
  commands: Command[];
  boardData: { boardName: string; columns: string[]; items: BoardItem[] };
  departmentName: string;
  showBoard: boolean;
  onFirstCommand?: () => void;
}) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [freeTextInput, setFreeTextInput] = useState('');
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [processingRowId, setProcessingRowId] = useState<string | null>(null);
  const [boardItems, setBoardItems] = useState(boardData.items);
  const [activeOverlay, setActiveOverlay] = useState<{
    agentName: string;
    agentImage: string;
    agentColor: { bg: string; border: string; text: string };
    commandLabel: string;
    currentStep: number;
    totalSteps: number;
    stepText: string;
    targetRowName: string;
    newStatus: string;
    newStatusColor: string;
    isComplete: boolean;
    collapseTarget?: { y: number; height: number; width: number } | null;
    overlayMode: OverlayVisualMode;
    contactName?: string;
    contactImage?: string;
    emailMeta?: OverlayEmail;
    previewLines: PreviewLine[];
    visiblePreviewLines: number;
  } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const boardPanelRef = useRef<HTMLDivElement>(null);
  const displayAgents = agents.slice(0, 4);

  // Reset state when department changes
  useEffect(() => {
    setChatMessages([]);
    setActiveCommand(null);
    setIsProcessing(false);
    setHighlightedRow(null);
    setProcessingRowId(null);
    setBoardItems(boardData.items);
    setActiveOverlay(null);
    setFreeTextInput('');
  }, [boardData.items]);

  // Auto-scroll chat (only within the chat container, not the page)
  useEffect(() => {
    const el = chatEndRef.current;
    if (el?.parentElement) {
      el.parentElement.scrollTo({ top: el.parentElement.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleCommand = useCallback(async (cmd: Command) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActiveCommand(cmd.id);

    // Resolve agent info for overlay
    const agentMatch = agents.find(a => a.name === cmd.agentName);
    const agentIdx = agentMatch ? agents.indexOf(agentMatch) : 0;
    const agentColor = AGENT_COLORS[agentIdx % AGENT_COLORS.length];
    const targetRow = boardData.items.find(item => item.id === cmd.boardEffect.rowId);

    // 1. Human message (single chat message from the user)
    const humanMsg: ChatMessage = {
      id: `h-${Date.now()}`, sender: 'human', senderName: cmd.teamMember, text: cmd.chatMessage,
    };
    setChatMessages(prev => [...prev, humanMsg]);

    // 2. Brief delay, then a single agent reply in chat (1 user + 1 agent)
    await new Promise(r => setTimeout(r, 1000));
    const agentReply: ChatMessage = {
      id: `a-${Date.now()}`, sender: 'agent', senderName: cmd.agentName,
      text: `On it! I'll take care of "${cmd.label}" right away.`,
      isStep: true, stepIndex: 0, isComplete: true,
    };
    setChatMessages(prev => [...prev, agentReply]);

    // 3. Transition to full workspace (show board) so user can see it
    if (!showBoard && onFirstCommand) {
      await new Promise(r => setTimeout(r, 600));
      onFirstCommand();
      // Let the board fully mount and the user see it
      await new Promise(r => setTimeout(r, 3000));
    } else {
      // Board is already visible — still pause briefly before overlay
      await new Promise(r => setTimeout(r, 2500));
    }

    // 4. Now show overlay on the board and run agent steps
    setProcessingRowId(cmd.boardEffect.rowId);
    setActiveOverlay({
      agentName: cmd.agentName,
      agentImage: agentMatch?.image || '',
      agentColor,
      commandLabel: cmd.label,
      currentStep: 0,
      totalSteps: cmd.agentSteps.length,
      stepText: cmd.agentSteps[0],
      targetRowName: targetRow?.name || '',
      newStatus: cmd.boardEffect.newStatus || '',
      newStatusColor: cmd.boardEffect.newStatusColor || '#10b981',
      isComplete: false,
      overlayMode: cmd.overlayMode,
      contactName: cmd.overlayContact?.name,
      contactImage: cmd.overlayContact?.image,
      emailMeta: cmd.overlayEmail,
      previewLines: cmd.overlayPreview,
      visiblePreviewLines: 0,
    });

    // 5. Agent steps with delays — update overlay only (chat already done)
    for (let i = 0; i < cmd.agentSteps.length; i++) {
      await new Promise(r => setTimeout(r, 1200 + i * 400));
      // Sync overlay step + preview lines
      setActiveOverlay(prev => prev ? {
        ...prev,
        currentStep: i + 1,
        stepText: cmd.agentSteps[i],
        visiblePreviewLines: i + 1,
        isComplete: i === cmd.agentSteps.length - 1,
      } : null);
    }

    // 6. Board effect
    await new Promise(r => setTimeout(r, 600));
    setProcessingRowId(null);
    setHighlightedRow(cmd.boardEffect.rowId);
    setBoardItems(prev => prev.map(item =>
      item.id === cmd.boardEffect.rowId
        ? { ...item, status: cmd.boardEffect.newStatus || item.status, statusColor: cmd.boardEffect.newStatusColor || item.statusColor }
        : item
    ));

    // 7. Collapse overlay into target row after showing "Complete" briefly
    setTimeout(() => {
      const rowEl = rowRefs.current[cmd.boardEffect.rowId];
      const panelEl = boardPanelRef.current;
      if (rowEl && panelEl) {
        const rowRect = rowEl.getBoundingClientRect();
        const panelRect = panelEl.getBoundingClientRect();
        setActiveOverlay(prev => prev ? {
          ...prev,
          collapseTarget: {
            y: rowRect.top - panelRect.top,
            height: rowRect.height,
            width: rowRect.width,
          },
        } : null);
      }
      // Dismiss after collapse animation completes
      setTimeout(() => setActiveOverlay(null), 700);
    }, 1200);

    // 8. Clear highlight after a while
    setTimeout(() => setHighlightedRow(null), 3500);
    setIsProcessing(false);
    setActiveCommand(null);
  }, [isProcessing, agents, boardData.items, showBoard, onFirstCommand]);

  const handleFreeText = useCallback(async () => {
    const text = freeTextInput.trim();
    if (!text || isProcessing) return;
    setFreeTextInput('');
    setIsProcessing(true);

    // Pick the first team member as the "sender"
    const member = teamMembers[0];
    const humanMsg: ChatMessage = {
      id: `ft-h-${Date.now()}`, sender: 'human', senderName: member.name,
      text,
    };
    setChatMessages(prev => [...prev, humanMsg]);

    // Simulate agent "thinking" then responding
    await new Promise(r => setTimeout(r, 1200));
    const firstAgent = agents[0];
    const agentMsg: ChatMessage = {
      id: `ft-a-${Date.now()}`, sender: 'agent', senderName: firstAgent?.name || 'Agent',
      text: `Got it! I'll take care of that right away. Working on: "${text.length > 60 ? text.slice(0, 60) + '...' : text}"`,
      isStep: true, isComplete: true, stepIndex: 0,
    };
    setChatMessages(prev => [...prev, agentMsg]);
    setIsProcessing(false);
  }, [freeTextInput, isProcessing, teamMembers, agents]);

  return (
    <motion.div
      className={`w-full flex gap-4 ${!showBoard ? 'justify-center' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%' }}
    >
      {/* ── Left Panel: Team + Commands + Chat ── */}
      <motion.div
        layout
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          width: showBoard ? '38%' : '100%',
          minWidth: 340,
          maxWidth: showBoard ? undefined : 600,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
        }}
        initial={{ x: showBoard ? -40 : 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, layout: { duration: 0.5, ease: 'easeInOut' } }}
      >
        <div className="flex flex-1 min-h-0">
          {/* ── People sidebar ── */}
          <div className="flex flex-col items-center gap-4 py-4 px-3 flex-shrink-0 transition-opacity duration-300 hover:opacity-100" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', width: 80, opacity: 0.5 }}>
            <span className="text-[9px] text-white/30 font-medium uppercase tracking-wider">Team</span>
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                layoutId={`avatar-human-${member.name}`}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: member.color, border: '2.5px solid rgba(255,255,255,0.25)' }}>
                  {member.image ?
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" /> :
                    <span className="text-white text-sm font-bold">{member.name.charAt(0)}</span>}
                </div>
                <span className="text-[10px] text-white/45 font-medium text-center leading-tight">{member.name.split(' ')[0]}</span>
              </motion.div>
            ))}
          </div>

          {/* ── Main content column ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Agents strip */}
            <div className="px-3 py-3 flex items-center gap-2.5 border-b border-white/5 overflow-x-auto transition-opacity duration-300 hover:opacity-100" style={{ scrollbarWidth: 'none', opacity: 0.5 }}>
              <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider mr-0.5 flex-shrink-0">Agents</span>
              {displayAgents.map((agent, i) => {
                const color = AGENT_COLORS[i % AGENT_COLORS.length];
                return (
                  <motion.div
                    key={agent.name}
                    layoutId={`avatar-agent-${agent.name}`}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl flex-shrink-0"
                    style={{ background: `${color.text}10`, border: `1px solid ${color.border}50` }}
                  >
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{
                        background: color.bg,
                        border: `2.5px solid ${color.border}`,
                      }}
                    >
                      {agent.image ? (
                        <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <Bot className="w-5 h-5" style={{ color: color.text }} />
                      )}
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap" style={{ color: color.text }}>{agent.name}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Command buttons */}
            <div className="px-3 py-3 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <img src={sidekickIcon} alt="" className="w-5 h-5" />
                <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">What would you like to do next?</span>
              </div>
              <div className="flex flex-col gap-2">
                {commands.map(cmd => {
                  const Icon = cmd.icon;
                  const isActive = activeCommand === cmd.id;
                  return (
                    <motion.button
                      key={cmd.id}
                      onClick={() => handleCommand(cmd)}
                      disabled={isProcessing}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all group"
                      style={{
                        background: isActive ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                        border: isActive ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                        opacity: isProcessing && !isActive ? 0.4 : 1,
                      }}
                      whileHover={!isProcessing ? { scale: 1.01, backgroundColor: 'rgba(99,102,241,0.1)' } : undefined}
                      whileTap={!isProcessing ? { scale: 0.99 } : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#818cf8' : 'rgba(255,255,255,0.35)' }} />
                      <span className="text-sm font-medium" style={{ color: isActive ? '#c7d2fe' : 'rgba(255,255,255,0.65)' }}>{cmd.label}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-30">
                  <MessageSquare className="w-6 h-6 text-white/30 mb-2" />
                  <span className="text-xs text-white/30">Select a command to start</span>
                </div>
              )}
              <AnimatePresence mode="popLayout">
                {chatMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${msg.sender === 'human' ? '' : 'pl-4'}`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-0.5">
                      {msg.sender === 'human' ? (() => {
                        const member = teamMembers.find(m => m.name === msg.senderName);
                        return (
                          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: member?.color || '#6366f1' }}>
                            {member?.image ?
                              <img src={member.image} alt={msg.senderName} className="w-full h-full object-cover" /> :
                              <span className="text-white text-[9px] font-bold">{msg.senderName.charAt(0)}</span>}
                          </div>
                        );
                      })() : (() => {
                        const agentMatch = agents.find(a => a.name === msg.senderName);
                        const agentIdx = agentMatch ? agents.indexOf(agentMatch) : 0;
                        const agentColor = AGENT_COLORS[agentIdx % AGENT_COLORS.length];
                        return (
                          <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                            style={{ background: agentColor.bg,
                              border: `1.5px solid ${agentColor.border}` }}>
                            {agentMatch?.image ?
                              <img src={agentMatch.image} alt={msg.senderName} className="w-full h-full object-cover" /> :
                              <Bot className="w-3.5 h-3.5" style={{ color: agentColor.text }} />}
                          </div>
                        );
                      })()}
                    </div>
                    {/* Bubble */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-medium mb-0.5 block"
                        style={{ color: msg.sender === 'human' ? 'rgba(255,255,255,0.5)' : 'rgba(168,85,247,0.7)' }}>
                        {msg.senderName}
                      </span>
                      <div className="rounded-lg px-3 py-2"
                        style={{
                          background: msg.sender === 'human' ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.08)',
                          border: msg.sender === 'human' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(99,102,241,0.15)',
                        }}>
                        <span className="text-xs leading-relaxed" style={{ color: msg.sender === 'human' ? 'rgba(255,255,255,0.75)' : 'rgba(199,210,254,0.85)' }}>
                          {msg.isStep && (
                            <span className="inline-flex items-center mr-1.5">
                              {msg.isComplete ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 inline mr-1" />
                              ) : (
                                <motion.span
                                  className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              )}
                            </span>
                          )}
                          {msg.text}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <input
                type="text"
                value={freeTextInput}
                onChange={e => setFreeTextInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleFreeText(); }}
                placeholder="Type a message..."
                disabled={isProcessing}
                className="flex-1 bg-transparent text-xs text-white/80 placeholder-white/25 outline-none px-3 py-2 rounded-lg"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
              />
              <motion.button
                onClick={handleFreeText}
                disabled={isProcessing || !freeTextInput.trim()}
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{
                  background: freeTextInput.trim() ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: freeTextInput.trim() ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  cursor: isProcessing || !freeTextInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: isProcessing || !freeTextInput.trim() ? 0.4 : 1,
                }}
                whileHover={freeTextInput.trim() && !isProcessing ? { scale: 1.05 } : undefined}
                whileTap={freeTextInput.trim() && !isProcessing ? { scale: 0.95 } : undefined}
              >
                <Send className="w-3.5 h-3.5" style={{ color: freeTextInput.trim() ? '#818cf8' : 'rgba(255,255,255,0.25)' }} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right Panel: Command Center Board ── */}
      {showBoard && (
      <motion.div
        ref={boardPanelRef}
        className="flex-1 rounded-2xl overflow-hidden flex flex-col relative"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
        }}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Board header */}
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(99,102,241,0.3)' }}>
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">{boardData.boardName}</h3>
              <span className="text-[10px] text-white/30">{boardData.items.length} items · AI Powered</span>
            </div>
          </div>
        </div>

        {/* Agent Action Overlay */}
        <AnimatePresence>
          {activeOverlay && (
            <motion.div
              key="agent-overlay"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={activeOverlay.collapseTarget ? {
                top: activeOverlay.collapseTarget.y,
                height: activeOverlay.collapseTarget.height,
                opacity: 0,
                scale: 1,
                y: 0,
              } : {
                opacity: 1,
                y: 0,
                scale: 1,
                top: 68,
              }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={activeOverlay.collapseTarget
                ? { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.35, ease: 'easeOut' }
              }
              className="absolute inset-x-0 z-30 flex justify-center pointer-events-none overflow-hidden"
              style={{ top: 68 }}
            >
              <motion.div
                className="rounded-xl overflow-hidden pointer-events-auto"
                animate={activeOverlay.collapseTarget ? {
                  maxWidth: activeOverlay.collapseTarget.width,
                  borderRadius: 4,
                  background: 'rgba(99,102,241,0.08)',
                } : {
                  maxWidth: 520,
                  borderRadius: 12,
                }}
                transition={activeOverlay.collapseTarget
                  ? { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                  : { duration: 0.35 }
                }
                style={{
                  width: '100%',
                  maxWidth: 520,
                  background: 'rgba(15,15,25,0.92)',
                  border: `1px solid ${activeOverlay.collapseTarget ? 'rgba(99,102,241,0.6)' : activeOverlay.agentColor.border}`,
                  boxShadow: activeOverlay.collapseTarget
                    ? '0 0 15px rgba(99,102,241,0.15)'
                    : `0 0 30px ${activeOverlay.agentColor.bg}, 0 8px 32px rgba(0,0,0,0.5)`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Content that fades out during collapse */}
                <motion.div
                  animate={{ opacity: activeOverlay.collapseTarget ? 0 : 1 }}
                  transition={{ duration: activeOverlay.collapseTarget ? 0.25 : 0.35 }}
                >
                  {/* Overlay header: agent avatar + name + command label */}
                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <div
                      className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{
                        background: activeOverlay.agentImage ? 'transparent' : activeOverlay.agentColor.bg,
                        border: `2px solid ${activeOverlay.agentColor.border}`,
                      }}
                    >
                      {activeOverlay.agentImage ? (
                        <img src={activeOverlay.agentImage} alt={activeOverlay.agentName} className="w-full h-full object-cover" style={{ mixBlendMode: 'lighten' }} />
                      ) : (
                        <Bot className="w-5 h-5" style={{ color: activeOverlay.agentColor.text }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: activeOverlay.agentColor.text }}>{activeOverlay.agentName}</span>
                        {!activeOverlay.isComplete && !activeOverlay.collapseTarget && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader2 className="w-3.5 h-3.5" style={{ color: activeOverlay.agentColor.text }} />
                          </motion.div>
                        )}
                        {activeOverlay.isComplete && !activeOverlay.collapseTarget && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </motion.div>
                        )}
                      </div>
                      <span className="text-xs text-white/40 truncate block">{activeOverlay.commandLabel}</span>
                    </div>
                  </div>

                  {/* Step progress */}
                  <div className="px-4 pb-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-white/30 font-medium">
                        {activeOverlay.isComplete ? 'Complete' : `Step ${activeOverlay.currentStep} of ${activeOverlay.totalSteps}`}
                      </span>
                      <span className="text-[10px] font-medium" style={{ color: activeOverlay.isComplete ? '#34d399' : activeOverlay.agentColor.text }}>
                        {activeOverlay.isComplete ? 'Done' : 'Working...'}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: activeOverlay.isComplete
                          ? '#34d399'
                          : `linear-gradient(90deg, ${activeOverlay.agentColor.text}, ${activeOverlay.agentColor.border})` }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${(activeOverlay.currentStep / activeOverlay.totalSteps) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Current step text */}
                  <div className="px-4 pb-2">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeOverlay.stepText}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.25 }}
                        className="text-xs text-white/60 leading-relaxed"
                      >
                        {activeOverlay.stepText}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* Contextual Preview area */}
                  {activeOverlay.previewLines.length > 0 && (
                    <div className="px-4 pb-3 pt-1">
                      <div
                        className="rounded-lg overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                      >

                        {/* === CONVERSATION MODE === */}
                        {activeOverlay.overlayMode === 'conversation' && (
                          <>
                            {/* Avatars row with connecting line */}
                            <div className="px-4 pt-3 pb-2 flex items-center justify-center gap-0">
                              {/* Agent avatar */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={activeOverlay.agentImage}
                                  alt={activeOverlay.agentName}
                                  className="w-9 h-9 rounded-full object-cover"
                                  style={{ border: `2px solid ${activeOverlay.agentColor.text}`, boxShadow: `0 0 12px ${activeOverlay.agentColor.text}40` }}
                                />
                              </div>
                              {/* Connecting line */}
                              <div className="relative h-[2px] flex-1 mx-1" style={{ maxWidth: 100 }}>
                                <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(90deg, ${activeOverlay.agentColor.text}60, rgba(255,255,255,0.15), ${activeOverlay.agentColor.text}60)` }} />
                                {!activeOverlay.isComplete && (
                                  <motion.div
                                    className="absolute inset-y-0 w-6 rounded-full"
                                    style={{ background: `linear-gradient(90deg, transparent, ${activeOverlay.agentColor.text}, transparent)` }}
                                    animate={{ left: ['-10%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                  />
                                )}
                              </div>
                              {/* Contact avatar */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={activeOverlay.contactImage || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                  alt={activeOverlay.contactName || 'Contact'}
                                  className="w-9 h-9 rounded-full object-cover"
                                  style={{ border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 0 8px rgba(255,255,255,0.08)' }}
                                />
                              </div>
                            </div>
                            <div className="text-center pb-2">
                              <span className="text-[9px] text-white/30 font-medium">{activeOverlay.agentName}</span>
                              <span className="text-[9px] text-white/15 mx-2">↔</span>
                              <span className="text-[9px] text-white/30 font-medium">{activeOverlay.contactName || 'Contact'}</span>
                            </div>
                            {/* Chat bubbles */}
                            <div className="px-3 pb-3 space-y-2 max-h-[180px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                              <AnimatePresence>
                                {activeOverlay.previewLines
                                  .filter(line => line.appearAtStep < activeOverlay.visiblePreviewLines)
                                  .map((line, idx) => (
                                    <motion.div
                                      key={`conv-${idx}`}
                                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{ duration: 0.3, delay: 0.05 }}
                                      className={`flex items-end gap-1.5 ${line.isAgent ? '' : 'flex-row-reverse'}`}
                                    >
                                      <img
                                        src={line.isAgent ? activeOverlay.agentImage : (activeOverlay.contactImage || 'https://randomuser.me/api/portraits/lego/1.jpg')}
                                        alt=""
                                        className="w-5 h-5 rounded-full object-cover flex-shrink-0 mb-0.5"
                                        style={{ border: line.isAgent ? `1.5px solid ${activeOverlay.agentColor.text}80` : '1.5px solid rgba(255,255,255,0.15)' }}
                                      />
                                      <div
                                        className="px-2.5 py-1.5 rounded-lg max-w-[82%]"
                                        style={{
                                          background: line.isAgent
                                            ? `${activeOverlay.agentColor.text}12`
                                            : 'rgba(255,255,255,0.04)',
                                          border: `1px solid ${line.isAgent
                                            ? `${activeOverlay.agentColor.text}25`
                                            : 'rgba(255,255,255,0.06)'}`,
                                          borderRadius: line.isAgent ? '10px 10px 10px 2px' : '10px 10px 2px 10px',
                                        }}
                                      >
                                        <span className="text-[11px] text-white/60 leading-relaxed">{line.text}</span>
                                      </div>
                                    </motion.div>
                                  ))}
                              </AnimatePresence>
                            </div>
                          </>
                        )}

                        {/* === EMAIL MODE === */}
                        {activeOverlay.overlayMode === 'email' && (
                          <div className="px-3 py-3 space-y-0">
                            {/* Email header */}
                            <div className="space-y-1.5 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              {activeOverlay.emailMeta && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-white/25 font-medium w-10">From</span>
                                    <span className="text-[11px] text-white/60">{activeOverlay.emailMeta.from}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-white/25 font-medium w-10">To</span>
                                    <span className="text-[11px] text-white/60">{activeOverlay.emailMeta.to}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-white/25 font-medium w-10">Subject</span>
                                    <span className="text-[11px] text-white/70 font-medium">{activeOverlay.emailMeta.subject}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            {/* Email body */}
                            <div className="pt-2.5 space-y-2 max-h-[180px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                              <AnimatePresence>
                                {activeOverlay.previewLines
                                  .filter(line => line.appearAtStep < activeOverlay.visiblePreviewLines)
                                  .map((line, idx) => (
                                    <motion.div
                                      key={`email-${idx}`}
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3, delay: 0.05 }}
                                    >
                                      <p className="text-[11px] text-white/50 leading-relaxed whitespace-pre-line">{line.text}</p>
                                    </motion.div>
                                  ))}
                              </AnimatePresence>
                              {activeOverlay.isComplete && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center gap-1.5 pt-1"
                                >
                                  <CheckCircle2 className="w-3 h-3" style={{ color: '#10b981' }} />
                                  <span className="text-[10px] font-medium" style={{ color: '#10b981' }}>Sent successfully</span>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* === DOCUMENT MODE === */}
                        {activeOverlay.overlayMode === 'document' && (
                          <div className="px-3 py-2.5 space-y-2 max-h-[180px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                            <AnimatePresence>
                              {activeOverlay.previewLines
                                .filter(line => line.appearAtStep < activeOverlay.visiblePreviewLines)
                                .map((line, idx) => (
                                  <motion.div
                                    key={`doc-${idx}`}
                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.05 }}
                                    className="rounded-lg px-2.5 py-1.5"
                                    style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `2px solid ${activeOverlay.agentColor.text}50` }}
                                  >
                                    {line.from && (
                                      <span className="text-[9px] font-semibold block mb-0.5 uppercase tracking-wider" style={{ color: activeOverlay.agentColor.text }}>
                                        {line.from}
                                      </span>
                                    )}
                                    <span className="text-[11px] text-white/50 leading-relaxed">{line.text}</span>
                                  </motion.div>
                                ))}
                            </AnimatePresence>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* Target row preview */}
                  <div
                    className="px-4 py-2.5 flex items-center gap-2 mt-1"
                    style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <span className="text-[10px] text-white/25 uppercase tracking-wider font-medium">Updating</span>
                    <span className="text-[11px] text-white/50 font-medium truncate">{activeOverlay.targetRowName}</span>
                    <ArrowRight className="w-3 h-3 text-white/20 flex-shrink-0" />
                    <motion.span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `${activeOverlay.newStatusColor}20`, color: activeOverlay.newStatusColor }}
                      animate={activeOverlay.isComplete && !activeOverlay.collapseTarget ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {activeOverlay.newStatus}
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Board content */}
        <div className="flex-1 overflow-y-auto">
          {/* Column headers */}
          <div className="grid px-5 py-2 border-b border-white/5"
            style={{ gridTemplateColumns: '2fr 1fr 1.3fr 0.8fr 1.3fr' }}>
            {boardData.columns.map(col => (
              <span key={col} className="text-[10px] text-white/25 font-medium uppercase tracking-wider">{col}</span>
            ))}
          </div>

          {/* Board rows */}
          {boardItems.map((item, i) => {
            const isHighlighted = highlightedRow === item.id;
            const isBeingProcessed = processingRowId === item.id;
            const agentForRow = displayAgents.find(a => a.name === item.agentName);
            const agentColor = AGENT_COLORS[displayAgents.indexOf(agentForRow!) % AGENT_COLORS.length] || AGENT_COLORS[0];

            return (
              <motion.div
                key={item.id}
                ref={el => { rowRefs.current[item.id] = el; }}
                className="relative grid px-5 py-3 border-b border-white/[0.03] items-center"
                style={{ gridTemplateColumns: '2fr 1fr 1.3fr 0.8fr 1.3fr' }}
                animate={{
                  backgroundColor: isHighlighted
                    ? 'rgba(99,102,241,0.08)'
                    : isBeingProcessed
                      ? 'rgba(99,102,241,0.04)'
                      : 'transparent',
                  borderLeftColor: isHighlighted
                    ? 'rgba(99,102,241,0.6)'
                    : isBeingProcessed
                      ? 'rgba(99,102,241,0.4)'
                      : 'transparent',
                  borderLeftWidth: isHighlighted ? 3 : isBeingProcessed ? 2 : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Processing shimmer bar at bottom of row */}
                {isBeingProcessed && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${agentColor.text}, transparent)` }}
                    initial={{ width: '0%', left: '0%' }}
                    animate={{ left: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                {/* Name */}
                <div className="flex items-center gap-2 pr-2 min-w-0">
                  <span className="text-xs text-white/70 font-medium truncate">{item.name}</span>
                  {isBeingProcessed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 flex-shrink-0"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="w-3 h-3" style={{ color: agentColor.text }} />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
                {/* Status */}
                <div className="flex items-center">
                  {isBeingProcessed ? (
                    <motion.span
                      className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${agentColor.text}15`, color: agentColor.text, border: `1px solid ${agentColor.text}30` }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Processing...
                    </motion.span>
                  ) : (
                    <>
                      <motion.span
                        className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${item.statusColor}20`, color: item.statusColor }}
                        animate={isHighlighted ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {item.status}
                      </motion.span>
                      {isHighlighted && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="ml-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
                {/* Owner */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const ownerMember = teamMembers.find(m => m.name === item.owner);
                    return ownerMember ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: ownerMember.color, border: '2px solid rgba(255,255,255,0.2)' }}>
                        {ownerMember.image ?
                          <img src={ownerMember.image} alt="" className="w-full h-full object-cover" /> :
                          <span className="text-white text-xs font-bold">{ownerMember.name.charAt(0)}</span>}
                      </div>
                    ) : null;
                  })()}
                  <span className="text-[11px] text-white/50 truncate">{item.owner}</span>
                </div>
                {/* Metric */}
                <span className="text-[11px] text-white/60 font-medium">{item.metric}</span>
                {/* Agent */}
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{ background: agentForRow?.image ? 'transparent' : agentColor.bg,
                      border: `2px solid ${agentColor.border}` }}
                    animate={isBeingProcessed ? { boxShadow: [`0 0 0px ${agentColor.text}00`, `0 0 10px ${agentColor.text}60`, `0 0 0px ${agentColor.text}00`] } : { boxShadow: '0 0 0px transparent' }}
                    transition={isBeingProcessed ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
                  >
                    {agentForRow?.image ?
                      <img src={agentForRow.image} alt="" className="w-full h-full object-cover" style={{ mixBlendMode: 'lighten' }} /> :
                      <Bot className="w-4 h-4" style={{ color: agentColor.text }} />}
                  </motion.div>
                  <span className="text-[10px] truncate" style={{ color: agentColor.text }}>{item.agentName}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      )}
    </motion.div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export function TeamCommandsSection() {
  const { departments: rawDepartments } = useDepartments();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const { agents: rawAgents } = useDepartmentData(selectedDepartmentId);
  const [phase, setPhase] = useState<'assembly' | 'chat-only' | 'workspace'>('assembly');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Map departments
  const departments: MappedDepartment[] = useMemo(() =>
    rawDepartments
      .filter(d => d.is_active)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map(dept => ({
        id: dept.id,
        title: dept.name || dept.title || '',
        avatarImage: dept.avatar_image || '',
        avatarBgColor: dept.avatar_color || '#6366f1',
      })),
    [rawDepartments]
  );

  // Auto-select first department
  useEffect(() => {
    if (departments.length > 0 && !selectedDepartmentId) {
      // Try to find 'sales' first
      const sales = departments.find(d => d.title.toLowerCase() === 'sales');
      setSelectedDepartmentId(sales?.id || departments[0].id);
    }
  }, [departments, selectedDepartmentId]);

  // Map agents
  const agents: MappedAgent[] = useMemo(() =>
    rawAgents
      .filter((a: any) => a.is_active)
      .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
      .map((agent: any) => ({
        name: agent.name,
        image: agent.image || '',
        description: agent.description || '',
      })),
    [rawAgents]
  );

  // Current department name
  const selectedDepartment = departments.find(d => d.id === selectedDepartmentId);
  const deptName = selectedDepartment?.title?.toLowerCase() || 'sales';

  // Get hardcoded data for current department
  const teamMembers = TEAM_MEMBERS[deptName] || TEAM_MEMBERS.sales;
  const commands = DEPARTMENT_COMMANDS[deptName] || DEPARTMENT_COMMANDS.sales;
  const boardData = DEPARTMENT_BOARDS[deptName] || DEPARTMENT_BOARDS.sales;

  // Reset phase when department changes
  useEffect(() => {
    setPhase('assembly');
  }, [selectedDepartmentId]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col items-center justify-center py-20 px-6"
      style={{ background: 'linear-gradient(145deg, #0f0f23 0%, #1a1a3e 50%, #0a0a1a 100%)', minHeight: '100vh' }}
    >
      <StarsBackground count={80} />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
        {/* Title */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-indigo-400/70 mb-3 block">
            AI WORK PLATFORM
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 max-w-2xl mx-auto">
            Humans and agents, together
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              driving exponential results
            </span>
          </h2>
        </motion.div>

        {/* Department Selector */}
        <DepartmentSelector
          departments={departments}
          selectedId={selectedDepartmentId}
          onSelect={(id) => setSelectedDepartmentId(id)}
        />

        {/* Phase content */}
        <LayoutGroup>
          <div className="w-full relative" style={{ height: 560 }}>
            <AnimatePresence mode="popLayout">
              {phase === 'assembly' && (
                <motion.div
                  key="assembly"
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TeamAssemblyRow
                    teamMembers={teamMembers}
                    agents={agents}
                    departmentName={deptName}
                    onStartWorking={() => setPhase('chat-only')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {phase !== 'assembly' && (
              <motion.div
                key="workspace"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Workspace
                  teamMembers={teamMembers}
                  agents={agents}
                  commands={commands}
                  boardData={boardData}
                  departmentName={deptName}
                  showBoard={phase === 'workspace'}
                  onFirstCommand={() => setPhase('workspace')}
                />
              </motion.div>
            )}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
