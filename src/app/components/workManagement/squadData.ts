import {
  Sparkles,
  Briefcase,
  Lightbulb,
  Settings,
  Heart,
  Megaphone,
  DollarSign,
  ShoppingCart,
  Monitor,
  type LucideIcon,
} from 'lucide-react';
import agentPink from '@/assets/agent-pink.png';
import agentCyan from '@/assets/agent-cyan.png';
import agentOrange from '@/assets/agent-orange.png';

const FIGMA_AGENT_ASSETS = {
  assetsGenerator:
    'https://www.figma.com/api/mcp/asset/a4778f09-d617-48b6-beca-66dfaea6d37d',
  riskAnalyzer:
    'https://www.figma.com/api/mcp/asset/9fac6eaf-0070-4330-a0e8-9b709bc7992f',
  vendorResearcher:
    'https://www.figma.com/api/mcp/asset/0d268e64-b934-4159-b4b4-3714996b634e',
};

export type SquadMember = {
  id: string;
  label: string;
  role: string;
  isAgent: boolean;
  bgColor: string;
  img: string;
  fallback: string;
  status?: string;
};

export type SquadDepartment = {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
  supabaseKey: string;
  description: string;
  jtbd: string[];
  members: SquadMember[];
};

export const SQUAD_DEPARTMENTS: SquadDepartment[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    color: '#97aeff',
    icon: Megaphone,
    supabaseKey: 'marketing',
    description: 'Plan campaigns, create assets, measure impact',
    jtbd: ['Campaign plans that build themselves', 'Creative assets, no designer needed', 'Know which campaigns actually worked', 'Off-brand assets caught instantly'],
    members: [
      { id: 'mk-h1', label: 'Content Strategist', role: 'Team', isAgent: false, bgColor: '#97aeff', img: '', fallback: 'CS' },
      { id: 'mk-h2', label: 'Campaign Manager', role: 'Team', isAgent: false, bgColor: '#b3c2ff', img: '', fallback: 'CM' },
      { id: 'mk-lead', label: 'Marketing Lead', role: 'Team Lead', isAgent: false, bgColor: '#97aeff', img: '', fallback: '' },
      { id: 'mk-a1', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#FFE066', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan, status: 'Generating assets' },
      { id: 'mk-a2', label: 'Vendor Researcher', role: 'Agent', isAgent: true, bgColor: '#d7bdff', img: FIGMA_AGENT_ASSETS.vendorResearcher, fallback: agentPink, status: 'Analyzing channels' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    color: '#ffc875',
    icon: ShoppingCart,
    supabaseKey: 'sales',
    description: 'Close deals faster and grow pipeline',
    jtbd: ['Qualify inbound leads', 'Track deal pipeline', 'Forecast quarterly revenue', 'Prepare sales proposals'],
    members: [
      { id: 'sl-h1', label: 'Account Executive', role: 'Team', isAgent: false, bgColor: '#ffc875', img: '', fallback: 'AE' },
      { id: 'sl-h2', label: 'SDR', role: 'Team', isAgent: false, bgColor: '#ffd99e', img: '', fallback: 'SD' },
      { id: 'sl-lead', label: 'Sales Lead', role: 'Team Lead', isAgent: false, bgColor: '#ffc875', img: '', fallback: '' },
      { id: 'sl-a1', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#ff8fd8', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange, status: 'Scoring leads' },
      { id: 'sl-a2', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan, status: 'Building proposals' },
    ],
  },
  {
    id: 'pmo',
    name: 'PMO',
    color: '#ff5ac4',
    icon: Briefcase,
    supabaseKey: 'operations',
    description: 'Align teams, mitigate risks, deliver on time',
    jtbd: ['Track portfolio progress', 'Manage resource capacity', 'Automate status reports', 'Flag project risks'],
    members: [
      { id: 'pmo-h1', label: 'Program Manager', role: 'Team', isAgent: false, bgColor: '#ff5ac4', img: '', fallback: 'PM' },
      { id: 'pmo-h2', label: 'Project Lead', role: 'Team', isAgent: false, bgColor: '#ff8cd6', img: '', fallback: 'PL' },
      { id: 'pmo-lead', label: 'PMO Lead', role: 'Team Lead', isAgent: false, bgColor: '#ff5ac4', img: '', fallback: '' },
      { id: 'pmo-a1', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#ff8fd8', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange, status: 'Prioritizing risks' },
      { id: 'pmo-a2', label: 'Vendor Researcher', role: 'Agent', isAgent: true, bgColor: '#d7bdff', img: FIGMA_AGENT_ASSETS.vendorResearcher, fallback: agentPink, status: 'Evaluating vendors' },
    ],
  },
  {
    id: 'it',
    name: 'IT',
    color: '#5AC4A3',
    icon: Monitor,
    supabaseKey: 'it',
    description: 'Keep systems running and teams productive',
    jtbd: ['Manage access requests', 'Monitor system uptime', 'Automate ticket routing', 'Audit security compliance'],
    members: [
      { id: 'it-h1', label: 'SysAdmin', role: 'Team', isAgent: false, bgColor: '#5AC4A3', img: '', fallback: 'SA' },
      { id: 'it-h2', label: 'DevOps Engineer', role: 'Team', isAgent: false, bgColor: '#85d4bc', img: '', fallback: 'DE' },
      { id: 'it-lead', label: 'IT Lead', role: 'Team Lead', isAgent: false, bgColor: '#5AC4A3', img: '', fallback: '' },
      { id: 'it-a1', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#ff8fd8', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange, status: 'Monitoring systems' },
      { id: 'it-a2', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan, status: 'Generating configs' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    color: '#a358d1',
    icon: Lightbulb,
    supabaseKey: 'product',
    description: 'Ship better features, faster',
    jtbd: ['Prioritize feature backlog', 'Analyze user feedback', 'Plan sprint capacity', 'Generate product specs'],
    members: [
      { id: 'pr-h1', label: 'Product Manager', role: 'Team', isAgent: false, bgColor: '#a358d1', img: '', fallback: 'PM' },
      { id: 'pr-h2', label: 'UX Designer', role: 'Team', isAgent: false, bgColor: '#bb80e0', img: '', fallback: 'UX' },
      { id: 'pr-lead', label: 'Product Lead', role: 'Team Lead', isAgent: false, bgColor: '#a358d1', img: '/department-avatars/4f426f4f722bf9fd17cf67273a55600282fe421d.png', fallback: '' },
      { id: 'pr-a1', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan, status: 'Generating mockups' },
      { id: 'pr-a2', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#ff8fd8', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange, status: 'Scoring features' },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    color: '#5ac4a3',
    icon: Settings,
    supabaseKey: 'operations',
    description: 'Streamline processes and scale efficiently',
    jtbd: ['Optimize vendor pipeline', 'Manage procurement flow', 'Track SLA compliance', 'Automate onboarding'],
    members: [
      { id: 'op-h1', label: 'Ops Manager', role: 'Team', isAgent: false, bgColor: '#5ac4a3', img: '', fallback: 'OM' },
      { id: 'op-h2', label: 'Process Analyst', role: 'Team', isAgent: false, bgColor: '#7dd4b9', img: '', fallback: 'PA' },
      { id: 'op-lead', label: 'Ops Lead', role: 'Team Lead', isAgent: false, bgColor: '#5ac4a3', img: '', fallback: '' },
      { id: 'op-a1', label: 'Vendor Researcher', role: 'Agent', isAgent: true, bgColor: '#d7bdff', img: FIGMA_AGENT_ASSETS.vendorResearcher, fallback: agentPink, status: 'Researching vendors' },
      { id: 'op-a2', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan, status: 'Mapping processes' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#ff9a6c',
    icon: DollarSign,
    supabaseKey: 'finance',
    description: 'Close books faster and stay compliant',
    jtbd: ['Automate expense approval', 'Track budget vs. actuals', 'Forecast revenue trends', 'Manage invoice workflows'],
    members: [
      { id: 'fn-h1', label: 'Financial Analyst', role: 'Team', isAgent: false, bgColor: '#ff9a6c', img: '', fallback: 'FA' },
      { id: 'fn-h2', label: 'Controller', role: 'Team', isAgent: false, bgColor: '#ffb795', img: '', fallback: 'CT' },
      { id: 'fn-lead', label: 'Finance Lead', role: 'Team Lead', isAgent: false, bgColor: '#ff9a6c', img: '', fallback: '' },
      { id: 'fn-a1', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#ff8fd8', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange, status: 'Analyzing budgets' },
      { id: 'fn-a2', label: 'Vendor Researcher', role: 'Agent', isAgent: true, bgColor: '#d7bdff', img: FIGMA_AGENT_ASSETS.vendorResearcher, fallback: agentPink, status: 'Auditing invoices' },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    color: '#6fcfed',
    icon: Heart,
    supabaseKey: 'hr',
    description: 'Hire faster and keep your team engaged',
    jtbd: ['Streamline hiring pipeline', 'Onboard new employees', 'Track employee engagement', 'Manage performance reviews'],
    members: [
      { id: 'hr-h1', label: 'Recruiter', role: 'Team', isAgent: false, bgColor: '#6fcfed', img: '', fallback: 'RC' },
      { id: 'hr-h2', label: 'People Partner', role: 'Team', isAgent: false, bgColor: '#96dcf2', img: '', fallback: 'PP' },
      { id: 'hr-lead', label: 'HR Lead', role: 'Team Lead', isAgent: false, bgColor: '#6fcfed', img: '', fallback: '' },
      { id: 'hr-a1', label: 'Risk Analyzer', role: 'Agent', isAgent: true, bgColor: '#ff8fd8', img: FIGMA_AGENT_ASSETS.riskAnalyzer, fallback: agentOrange, status: 'Screening candidates' },
      { id: 'hr-a2', label: 'Assets Generator', role: 'Agent', isAgent: true, bgColor: '#93beff', img: FIGMA_AGENT_ASSETS.assetsGenerator, fallback: agentCyan, status: 'Creating onboarding' },
    ],
  },
];
