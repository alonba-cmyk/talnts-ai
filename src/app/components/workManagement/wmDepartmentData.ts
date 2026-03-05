import {
  Briefcase,
  Lightbulb,
  Settings,
  Heart,
  Megaphone,
  DollarSign,
  Target,
  FileText,
  TrendingUp,
  Bot,
  type LucideIcon,
} from 'lucide-react';
import agentPink from '@/assets/agent-pink.png';
import agentCyan from '@/assets/agent-cyan.png';
import agentOrange from '@/assets/agent-orange.png';

export const FIGMA_AGENT_ASSETS = {
  assetsGenerator:
    'https://www.figma.com/api/mcp/asset/a4778f09-d617-48b6-beca-66dfaea6d37d',
  riskAnalyzer:
    'https://www.figma.com/api/mcp/asset/9fac6eaf-0070-4330-a0e8-9b709bc7992f',
  vendorResearcher:
    'https://www.figma.com/api/mcp/asset/0d268e64-b934-4159-b4b4-3714996b634e',
};

export type AgentInfo = {
  label: string;
  bgColor: string;
  img: string;
  fallback: string;
  status: string;
  description: string;
};

export type BoardItem = {
  id: string;
  label: string;
  columnIndex: number;
  priority?: 'high' | 'medium' | 'low';
  hasAvatar?: boolean;
  avatarColor?: string;
  agentWorking?: boolean;
  tag?: string;
  tagColor?: string;
};

export type Department = {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
  supabaseKey: string;
  description: string;
  agents: AgentInfo[];
  jtbd: string[];
  boardItems: BoardItem[];
};

export const STATUS_CONFIG = [
  { label: 'To Do', color: '#94a3b8', bg: '#f1f5f9' },
  { label: 'Working', color: '#6161FF', bg: '#eef2ff' },
  { label: 'Review', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Done', color: '#10b981', bg: '#ecfdf5' },
];

export const PROGRESS_BY_COL = [10, 45, 75, 100];

export const JTBD_ICONS = [Target, Briefcase, FileText, TrendingUp, Bot];

export const DEPARTMENTS: Department[] = [
  {
    id: 'pmo',
    name: 'PMO',
    color: '#ff6b10',
    icon: Briefcase,
    supabaseKey: 'operations',
    description: 'Align teams, mitigate risks, and deliver on time',
    agents: [
      {
        label: 'Risk analyzer',
        bgColor: '#FFD633',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Prioritizing risks',
        description: 'Detects ticket intent, urgency, and required expertise',
      },
      {
        label: 'Vendor researcher',
        bgColor: '#d7bdff',
        img: FIGMA_AGENT_ASSETS.vendorResearcher,
        fallback: agentPink,
        status: 'Evaluating vendors',
        description: 'Compares vendor proposals against budget and SLA targets',
      },
      {
        label: 'Assets Generator',
        bgColor: '#93beff',
        img: FIGMA_AGENT_ASSETS.assetsGenerator,
        fallback: agentCyan,
        status: 'Building reports',
        description: 'Generates status reports and dashboards from live data',
      },
    ],
    jtbd: [
      'Track portfolio progress',
      'Manage resource capacity',
      'Automate status reports',
      'Align teams on goals',
      'Flag project risks',
    ],
    boardItems: [
      { id: 'pmo1', label: 'Q4 Portfolio review', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#ff6b10' },
      { id: 'pmo2', label: 'Resource allocation', columnIndex: 0, priority: 'medium', tag: 'Planning', tagColor: '#6161FF' },
      { id: 'pmo3', label: 'Budget reforecast', columnIndex: 1, priority: 'high', hasAvatar: true, avatarColor: '#00baff', agentWorking: true },
      { id: 'pmo4', label: 'Stakeholder update', columnIndex: 1, tag: 'Communication', tagColor: '#ff84e4' },
      { id: 'pmo5', label: 'Risk assessment', columnIndex: 2, priority: 'medium', hasAvatar: true, avatarColor: '#FFD633', agentWorking: true },
      { id: 'pmo6', label: 'Sprint retrospective', columnIndex: 3, priority: 'low', hasAvatar: true, avatarColor: '#00D2D2' },
      { id: 'pmo7', label: 'Dependency mapping', columnIndex: 0, priority: 'low' },
      { id: 'pmo8', label: 'Velocity report', columnIndex: 3, tag: 'Report', tagColor: '#00baff' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    color: '#6161FF',
    icon: Lightbulb,
    supabaseKey: 'product',
    description: 'Ship better features, faster',
    agents: [
      {
        label: 'Assets Generator',
        bgColor: '#93beff',
        img: FIGMA_AGENT_ASSETS.assetsGenerator,
        fallback: agentCyan,
        status: 'Generating mockups',
        description: 'Creates images from text prompts based on your brand guidelines',
      },
      {
        label: 'Risk analyzer',
        bgColor: '#FFD633',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Scoring features',
        description: 'Prioritizes backlog items by impact, effort, and user demand',
      },
      {
        label: 'Vendor researcher',
        bgColor: '#d7bdff',
        img: FIGMA_AGENT_ASSETS.vendorResearcher,
        fallback: agentPink,
        status: 'Analyzing feedback',
        description: 'Clusters user feedback into themes and feature requests',
      },
    ],
    jtbd: [
      'Prioritize feature backlog',
      'Analyze user feedback',
      'Plan sprint capacity',
      'Track release progress',
      'Generate product specs',
    ],
    boardItems: [
      { id: 'pr1', label: 'Feature discovery', columnIndex: 0, priority: 'high', tag: 'Research', tagColor: '#6161FF' },
      { id: 'pr2', label: 'User research', columnIndex: 0, hasAvatar: true, avatarColor: '#6161FF', agentWorking: true },
      { id: 'pr3', label: 'Design review', columnIndex: 1, priority: 'medium', hasAvatar: true, avatarColor: '#ff84e4' },
      { id: 'pr4', label: 'API integration', columnIndex: 2, priority: 'high', hasAvatar: true, avatarColor: '#00baff' },
      { id: 'pr5', label: 'QA testing', columnIndex: 2, tag: 'Testing', tagColor: '#00D2D2', agentWorking: true },
      { id: 'pr6', label: 'Release notes', columnIndex: 3, priority: 'low', hasAvatar: true, avatarColor: '#FFD633' },
      { id: 'pr7', label: 'Spec documentation', columnIndex: 1, priority: 'medium' },
      { id: 'pr8', label: 'Backlog grooming', columnIndex: 0, priority: 'low', tag: 'Sprint', tagColor: '#ff6b10' },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    color: '#00baff',
    icon: Settings,
    supabaseKey: 'operations',
    description: 'Streamline processes and scale efficiently',
    agents: [
      {
        label: 'Vendor researcher',
        bgColor: '#d7bdff',
        img: FIGMA_AGENT_ASSETS.vendorResearcher,
        fallback: agentPink,
        status: 'Researching vendors',
        description: 'Researches vendors based on pre-defined criteria',
      },
      {
        label: 'Assets Generator',
        bgColor: '#93beff',
        img: FIGMA_AGENT_ASSETS.assetsGenerator,
        fallback: agentCyan,
        status: 'Mapping processes',
        description: 'Visualizes operational workflows and identifies bottlenecks',
      },
      {
        label: 'Risk analyzer',
        bgColor: '#FFD633',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Tracking SLAs',
        description: 'Monitors service-level compliance and flags deviations',
      },
    ],
    jtbd: [
      'Optimize vendor pipeline',
      'Manage procurement flow',
      'Track SLA compliance',
      'Automate onboarding',
      'Audit operational costs',
    ],
    boardItems: [
      { id: 'op1', label: 'Vendor evaluation', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#00baff', agentWorking: true },
      { id: 'op2', label: 'Contract renewal', columnIndex: 0, priority: 'medium', tag: 'Legal', tagColor: '#6161FF' },
      { id: 'op3', label: 'SLA monitoring', columnIndex: 1, hasAvatar: true, avatarColor: '#FFD633', agentWorking: true },
      { id: 'op4', label: 'Cost optimization', columnIndex: 2, priority: 'high', tag: 'Finance', tagColor: '#00D2D2' },
      { id: 'op5', label: 'Process automation', columnIndex: 3, priority: 'low', hasAvatar: true, avatarColor: '#ff84e4' },
      { id: 'op6', label: 'Inventory audit', columnIndex: 1, priority: 'medium' },
      { id: 'op7', label: 'Supplier onboarding', columnIndex: 0, priority: 'low', hasAvatar: true, avatarColor: '#ff6b10' },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    color: '#fc0',
    icon: Heart,
    supabaseKey: 'hr',
    description: 'Hire faster and keep your team engaged',
    agents: [
      {
        label: 'Risk analyzer',
        bgColor: '#FFD633',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Screening candidates',
        description: 'Screens resumes and matches candidates to open roles',
      },
      {
        label: 'Assets Generator',
        bgColor: '#93beff',
        img: FIGMA_AGENT_ASSETS.assetsGenerator,
        fallback: agentCyan,
        status: 'Creating onboarding',
        description: 'Generates personalized onboarding plans for new hires',
      },
      {
        label: 'Vendor researcher',
        bgColor: '#d7bdff',
        img: FIGMA_AGENT_ASSETS.vendorResearcher,
        fallback: agentPink,
        status: 'Benchmarking comp',
        description: 'Researches market compensation data for open positions',
      },
    ],
    jtbd: [
      'Streamline hiring pipeline',
      'Onboard new employees',
      'Track employee engagement',
      'Manage performance reviews',
      'Automate leave requests',
    ],
    boardItems: [
      { id: 'hr1', label: 'Job posting review', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#fc0' },
      { id: 'hr2', label: 'Candidate screening', columnIndex: 1, priority: 'high', agentWorking: true, tag: 'Urgent', tagColor: '#ff6b10' },
      { id: 'hr3', label: 'Interview scheduling', columnIndex: 1, hasAvatar: true, avatarColor: '#6161FF' },
      { id: 'hr4', label: 'Offer approval', columnIndex: 2, priority: 'medium', hasAvatar: true, avatarColor: '#00baff' },
      { id: 'hr5', label: 'Onboarding checklist', columnIndex: 3, priority: 'low', tag: 'Template', tagColor: '#00D2D2' },
      { id: 'hr6', label: 'Benefits enrollment', columnIndex: 0, priority: 'medium', agentWorking: true },
      { id: 'hr7', label: 'Exit interview prep', columnIndex: 2, priority: 'low', hasAvatar: true, avatarColor: '#ff84e4' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    color: '#ff84e4',
    icon: Megaphone,
    supabaseKey: 'marketing',
    description: 'Plan campaigns, create assets, measure impact',
    agents: [
      {
        label: 'Assets Generator',
        bgColor: '#93beff',
        img: FIGMA_AGENT_ASSETS.assetsGenerator,
        fallback: agentCyan,
        status: 'Generating assets',
        description: 'Creates images from text prompts based on your brand guidelines',
      },
      {
        label: 'Vendor researcher',
        bgColor: '#d7bdff',
        img: FIGMA_AGENT_ASSETS.vendorResearcher,
        fallback: agentPink,
        status: 'Analyzing channels',
        description: 'Evaluates ad channels by ROI, reach, and audience fit',
      },
      {
        label: 'Risk analyzer',
        bgColor: '#FFD633',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Tracking campaigns',
        description: 'Monitors campaign KPIs and flags underperformers',
      },
    ],
    jtbd: [
      'Plan campaign launches',
      'Generate creative assets',
      'Analyze campaign ROI',
      'Manage content calendar',
      'Track brand consistency',
    ],
    boardItems: [
      { id: 'mk1', label: 'Campaign brief', columnIndex: 0, priority: 'high', tag: 'Q4 Launch', tagColor: '#ff84e4' },
      { id: 'mk2', label: 'Creative production', columnIndex: 1, priority: 'high', hasAvatar: true, avatarColor: '#ff84e4', agentWorking: true },
      { id: 'mk3', label: 'Ad copy review', columnIndex: 1, hasAvatar: true, avatarColor: '#6161FF' },
      { id: 'mk4', label: 'Landing page QA', columnIndex: 2, priority: 'medium', tag: 'Testing', tagColor: '#00D2D2' },
      { id: 'mk5', label: 'Launch go/no-go', columnIndex: 2, priority: 'high', hasAvatar: true, avatarColor: '#ff6b10' },
      { id: 'mk6', label: 'Performance report', columnIndex: 3, priority: 'low', agentWorking: true },
      { id: 'mk7', label: 'Social media calendar', columnIndex: 0, priority: 'medium', hasAvatar: true, avatarColor: '#00baff' },
      { id: 'mk8', label: 'Brand guidelines update', columnIndex: 3, tag: 'Design', tagColor: '#6161FF' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#00D2D2',
    icon: DollarSign,
    supabaseKey: 'finance',
    description: 'Close books faster and stay compliant',
    agents: [
      {
        label: 'Risk analyzer',
        bgColor: '#FFD633',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Analyzing budgets',
        description: 'Detects anomalies in financial data and flags risks',
      },
      {
        label: 'Vendor researcher',
        bgColor: '#d7bdff',
        img: FIGMA_AGENT_ASSETS.vendorResearcher,
        fallback: agentPink,
        status: 'Auditing invoices',
        description: 'Cross-checks invoices against purchase orders and contracts',
      },
      {
        label: 'Assets Generator',
        bgColor: '#93beff',
        img: FIGMA_AGENT_ASSETS.assetsGenerator,
        fallback: agentCyan,
        status: 'Building forecasts',
        description: 'Generates revenue and expense forecasts from historical data',
      },
    ],
    jtbd: [
      'Automate expense approval',
      'Track budget vs. actuals',
      'Forecast revenue trends',
      'Manage invoice workflows',
      'Ensure compliance',
    ],
    boardItems: [
      { id: 'fn1', label: 'Monthly close', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#00D2D2', tag: 'Deadline', tagColor: '#ff6b10' },
      { id: 'fn2', label: 'Expense review', columnIndex: 1, priority: 'medium', agentWorking: true },
      { id: 'fn3', label: 'Budget reforecast', columnIndex: 2, priority: 'high', hasAvatar: true, avatarColor: '#FFD633', agentWorking: true },
      { id: 'fn4', label: 'Audit preparation', columnIndex: 3, priority: 'low', tag: 'Compliance', tagColor: '#6161FF' },
      { id: 'fn5', label: 'Invoice processing', columnIndex: 1, hasAvatar: true, avatarColor: '#00baff' },
      { id: 'fn6', label: 'Tax filing review', columnIndex: 0, priority: 'medium' },
      { id: 'fn7', label: 'Revenue reconciliation', columnIndex: 2, priority: 'medium', hasAvatar: true, avatarColor: '#ff84e4' },
    ],
  },
];
