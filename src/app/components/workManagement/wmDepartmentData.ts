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
  ShoppingCart,
  Monitor,
  type LucideIcon,
} from 'lucide-react';
import agentPink from '@/assets/agent-pink.png';
import agentCyan from '@/assets/agent-cyan.png';
import agentOrange from '@/assets/agent-orange.png';
import agentAssetsGenerator from '@/assets/agent-assets-generator.png';
import agentRiskAnalyzer from '@/assets/agent-risk-analyzer.png';
import agentVendorResearcher from '@/assets/agent-vendor-researcher.png';

export const FIGMA_AGENT_ASSETS = {
  assetsGenerator: agentAssetsGenerator,
  riskAnalyzer: agentRiskAnalyzer,
  vendorResearcher: agentVendorResearcher,
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
    id: 'marketing',
    name: 'Marketing',
    color: '#97aeff',
    icon: Megaphone,
    supabaseKey: 'marketing',
    description: 'Plan campaigns, create assets, measure impact',
    agents: [
      {
        label: 'Assets Generator',
        bgColor: '#FFE066',
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
        label: 'Campaign Optimizer',
        bgColor: '#ff8fd8',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Optimizing performance',
        description: 'Analyzes campaign KPIs and optimizes spend across channels',
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
      { id: 'mk1', label: 'Campaign brief', columnIndex: 0, priority: 'high', tag: 'Q4 Launch', tagColor: '#97aeff' },
      { id: 'mk2', label: 'Creative production', columnIndex: 1, priority: 'high', hasAvatar: true, avatarColor: '#97aeff', agentWorking: true },
      { id: 'mk3', label: 'Ad copy review', columnIndex: 1, hasAvatar: true, avatarColor: '#a358d1' },
      { id: 'mk4', label: 'Landing page QA', columnIndex: 2, priority: 'medium', tag: 'Testing', tagColor: '#ff9a6c' },
      { id: 'mk5', label: 'Launch go/no-go', columnIndex: 2, priority: 'high', hasAvatar: true, avatarColor: '#ffc875' },
      { id: 'mk6', label: 'Performance report', columnIndex: 3, priority: 'low', agentWorking: true },
      { id: 'mk7', label: 'Social media calendar', columnIndex: 0, priority: 'medium', hasAvatar: true, avatarColor: '#5ac4a3' },
      { id: 'mk8', label: 'Brand guidelines update', columnIndex: 3, tag: 'Design', tagColor: '#a358d1' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    color: '#ffc875',
    icon: ShoppingCart,
    supabaseKey: 'sales',
    description: 'Close deals faster and grow pipeline',
    agents: [
      {
        label: 'Risk analyzer',
        bgColor: '#ff8fd8',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Scoring leads',
        description: 'Scores and prioritizes leads based on engagement signals',
      },
      {
        label: 'Assets Generator',
        bgColor: '#93beff',
        img: FIGMA_AGENT_ASSETS.assetsGenerator,
        fallback: agentCyan,
        status: 'Building proposals',
        description: 'Generates tailored proposals and pricing decks',
      },
      {
        label: 'Vendor researcher',
        bgColor: '#d7bdff',
        img: FIGMA_AGENT_ASSETS.vendorResearcher,
        fallback: agentPink,
        status: 'Researching prospects',
        description: 'Gathers competitive intel and prospect context',
      },
    ],
    jtbd: [
      'Qualify inbound leads',
      'Track deal pipeline',
      'Forecast quarterly revenue',
      'Automate follow-ups',
      'Prepare sales proposals',
    ],
    boardItems: [
      { id: 'sl1', label: 'Lead qualification', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#ffc875', agentWorking: true },
      { id: 'sl2', label: 'Proposal creation', columnIndex: 1, priority: 'high', hasAvatar: true, avatarColor: '#93beff', agentWorking: true },
      { id: 'sl3', label: 'Discovery call prep', columnIndex: 0, priority: 'medium', tag: 'Outbound', tagColor: '#a358d1' },
      { id: 'sl4', label: 'Contract negotiation', columnIndex: 2, priority: 'high', hasAvatar: true, avatarColor: '#5ac4a3' },
      { id: 'sl5', label: 'Pipeline review', columnIndex: 1, tag: 'Weekly', tagColor: '#ff9a6c' },
      { id: 'sl6', label: 'CRM data cleanup', columnIndex: 3, priority: 'low', agentWorking: true },
      { id: 'sl7', label: 'Competitive analysis', columnIndex: 2, priority: 'medium', hasAvatar: true, avatarColor: '#ff8fd8' },
      { id: 'sl8', label: 'Quarterly forecast', columnIndex: 3, priority: 'medium', hasAvatar: true, avatarColor: '#97aeff' },
    ],
  },
  {
    id: 'pmo',
    name: 'PMO',
    color: '#ff5ac4',
    icon: Briefcase,
    supabaseKey: 'operations',
    description: 'Align teams, mitigate risks, and deliver on time',
    agents: [
      {
        label: 'Risk analyzer',
        bgColor: '#ff8fd8',
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
      { id: 'pmo1', label: 'Q4 Portfolio review', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#ff5ac4' },
      { id: 'pmo2', label: 'Resource allocation', columnIndex: 0, priority: 'medium', tag: 'Planning', tagColor: '#a358d1' },
      { id: 'pmo3', label: 'Budget reforecast', columnIndex: 1, priority: 'high', hasAvatar: true, avatarColor: '#5ac4a3', agentWorking: true },
      { id: 'pmo4', label: 'Stakeholder update', columnIndex: 1, tag: 'Communication', tagColor: '#97aeff' },
      { id: 'pmo5', label: 'Risk assessment', columnIndex: 2, priority: 'medium', hasAvatar: true, avatarColor: '#ff8fd8', agentWorking: true },
      { id: 'pmo6', label: 'Sprint retrospective', columnIndex: 3, priority: 'low', hasAvatar: true, avatarColor: '#ff9a6c' },
      { id: 'pmo7', label: 'Dependency mapping', columnIndex: 0, priority: 'low' },
      { id: 'pmo8', label: 'Velocity report', columnIndex: 3, tag: 'Report', tagColor: '#5ac4a3' },
    ],
  },
  {
    id: 'it',
    name: 'IT',
    color: '#5AC4A3',
    icon: Monitor,
    supabaseKey: 'it',
    description: 'Keep systems running and teams productive',
    agents: [
      {
        label: 'Risk analyzer',
        bgColor: '#ff8fd8',
        img: FIGMA_AGENT_ASSETS.riskAnalyzer,
        fallback: agentOrange,
        status: 'Monitoring systems',
        description: 'Monitors infrastructure health and flags anomalies',
      },
      {
        label: 'Assets Generator',
        bgColor: '#93beff',
        img: FIGMA_AGENT_ASSETS.assetsGenerator,
        fallback: agentCyan,
        status: 'Generating configs',
        description: 'Creates configuration templates and deployment scripts',
      },
      {
        label: 'Vendor researcher',
        bgColor: '#d7bdff',
        img: FIGMA_AGENT_ASSETS.vendorResearcher,
        fallback: agentPink,
        status: 'Evaluating tools',
        description: 'Compares SaaS tools by security, cost, and integration fit',
      },
    ],
    jtbd: [
      'Manage access requests',
      'Monitor system uptime',
      'Automate ticket routing',
      'Onboard new tools',
      'Audit security compliance',
    ],
    boardItems: [
      { id: 'it1', label: 'Access provisioning', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#5AC4A3', agentWorking: true },
      { id: 'it2', label: 'Security audit', columnIndex: 1, priority: 'high', tag: 'Compliance', tagColor: '#ff84e4' },
      { id: 'it3', label: 'Infra monitoring', columnIndex: 1, hasAvatar: true, avatarColor: '#ff8fd8', agentWorking: true },
      { id: 'it4', label: 'License renewal', columnIndex: 2, priority: 'medium', hasAvatar: true, avatarColor: '#5ac4a3' },
      { id: 'it5', label: 'Ticket triage', columnIndex: 0, priority: 'medium', agentWorking: true },
      { id: 'it6', label: 'VPN setup', columnIndex: 3, priority: 'low', hasAvatar: true, avatarColor: '#a358d1' },
      { id: 'it7', label: 'SaaS evaluation', columnIndex: 2, priority: 'medium', tag: 'Research', tagColor: '#d7bdff' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    color: '#a358d1',
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
        bgColor: '#ff8fd8',
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
      { id: 'pr1', label: 'Feature discovery', columnIndex: 0, priority: 'high', tag: 'Research', tagColor: '#a358d1' },
      { id: 'pr2', label: 'User research', columnIndex: 0, hasAvatar: true, avatarColor: '#a358d1', agentWorking: true },
      { id: 'pr3', label: 'Design review', columnIndex: 1, priority: 'medium', hasAvatar: true, avatarColor: '#ff5ac4' },
      { id: 'pr4', label: 'API integration', columnIndex: 2, priority: 'high', hasAvatar: true, avatarColor: '#5ac4a3' },
      { id: 'pr5', label: 'QA testing', columnIndex: 2, tag: 'Testing', tagColor: '#ff9a6c', agentWorking: true },
      { id: 'pr6', label: 'Release notes', columnIndex: 3, priority: 'low', hasAvatar: true, avatarColor: '#ff8fd8' },
      { id: 'pr7', label: 'Spec documentation', columnIndex: 1, priority: 'medium' },
      { id: 'pr8', label: 'Backlog grooming', columnIndex: 0, priority: 'low', tag: 'Sprint', tagColor: '#ffc875' },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    color: '#5ac4a3',
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
        bgColor: '#ff8fd8',
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
      { id: 'op1', label: 'Vendor evaluation', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#5ac4a3', agentWorking: true },
      { id: 'op2', label: 'Contract renewal', columnIndex: 0, priority: 'medium', tag: 'Legal', tagColor: '#a358d1' },
      { id: 'op3', label: 'SLA monitoring', columnIndex: 1, hasAvatar: true, avatarColor: '#ff8fd8', agentWorking: true },
      { id: 'op4', label: 'Cost optimization', columnIndex: 2, priority: 'high', tag: 'Finance', tagColor: '#ff9a6c' },
      { id: 'op5', label: 'Process automation', columnIndex: 3, priority: 'low', hasAvatar: true, avatarColor: '#97aeff' },
      { id: 'op6', label: 'Inventory audit', columnIndex: 1, priority: 'medium' },
      { id: 'op7', label: 'Supplier onboarding', columnIndex: 0, priority: 'low', hasAvatar: true, avatarColor: '#ffc875' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#ff9a6c',
    icon: DollarSign,
    supabaseKey: 'finance',
    description: 'Close books faster and stay compliant',
    agents: [
      {
        label: 'Risk analyzer',
        bgColor: '#ff8fd8',
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
      { id: 'fn1', label: 'Monthly close', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#ff9a6c', tag: 'Deadline', tagColor: '#ff5ac4' },
      { id: 'fn2', label: 'Expense review', columnIndex: 1, priority: 'medium', agentWorking: true },
      { id: 'fn3', label: 'Budget reforecast', columnIndex: 2, priority: 'high', hasAvatar: true, avatarColor: '#ff8fd8', agentWorking: true },
      { id: 'fn4', label: 'Audit preparation', columnIndex: 3, priority: 'low', tag: 'Compliance', tagColor: '#a358d1' },
      { id: 'fn5', label: 'Invoice processing', columnIndex: 1, hasAvatar: true, avatarColor: '#5ac4a3' },
      { id: 'fn6', label: 'Tax filing review', columnIndex: 0, priority: 'medium' },
      { id: 'fn7', label: 'Revenue reconciliation', columnIndex: 2, priority: 'medium', hasAvatar: true, avatarColor: '#97aeff' },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    color: '#6fcfed',
    icon: Heart,
    supabaseKey: 'hr',
    description: 'Hire faster and keep your team engaged',
    agents: [
      {
        label: 'Risk analyzer',
        bgColor: '#ff8fd8',
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
      { id: 'hr1', label: 'Job posting review', columnIndex: 0, priority: 'high', hasAvatar: true, avatarColor: '#6fcfed' },
      { id: 'hr2', label: 'Candidate screening', columnIndex: 1, priority: 'high', agentWorking: true, tag: 'Urgent', tagColor: '#5AC4A3' },
      { id: 'hr3', label: 'Interview scheduling', columnIndex: 1, hasAvatar: true, avatarColor: '#a358d1' },
      { id: 'hr4', label: 'Offer approval', columnIndex: 2, priority: 'medium', hasAvatar: true, avatarColor: '#5ac4a3' },
      { id: 'hr5', label: 'Onboarding checklist', columnIndex: 3, priority: 'low', tag: 'Template', tagColor: '#ff9a6c' },
      { id: 'hr6', label: 'Benefits enrollment', columnIndex: 0, priority: 'medium', agentWorking: true },
      { id: 'hr7', label: 'Exit interview prep', columnIndex: 2, priority: 'low', hasAvatar: true, avatarColor: '#97aeff' },
    ],
  },
];
