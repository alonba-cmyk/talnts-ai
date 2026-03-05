export const BRAND_COLORS = {
  teal: '#00D2D2',
  purple: '#6161FF',
  pink: '#FB275D',
  green: '#00CA72',
  yellow: '#FFCB00',
  blue: '#0073EA',
  darkBg: '#0a0a0a',
  cardBg: '#141414',
  cardBorder: '#1e1e1e',
} as const;

export const PRODUCT_COLORS = {
  crm: BRAND_COLORS.teal,
  workManagement: BRAND_COLORS.purple,
  service: BRAND_COLORS.pink,
  dev: BRAND_COLORS.green,
} as const;

export interface Stat {
  value: string;
  numericValue: number;
  suffix: string;
  prefix?: string;
  label: string;
  sourceUrl?: string;
}

export interface Department {
  name: string;
  color: string;
  lucideIcon: string;
  product: string;
  jtbd: string[];
}

export interface Competitor {
  name: string;
  tagline: string;
  approach: string;
  keyMetric: string;
  /** Source URL for keyMetric when it's a verifiable claim */
  keyMetricSourceUrl?: string;
  aiFeatures: string[];
  color: string;
  heroHeadline: string;
  heroSubline: string;
  productUrl: string;
  /** Local screenshot: public/competitors/{slug}-ai.png */
  screenshotUrl?: string;
  /** Promo video/GIF from Twitter etc. - direct URL to .mp4 or .gif */
  promoMediaUrl?: string;
  /** Twitter tweet ID to embed (video plays inline, no download needed) */
  tweetEmbedId?: string;
  /** Extra images for slideshow, e.g. /competitors/notion-qa-agent.png */
  galleryUrls?: string[];
  /** Fallback: Clearbit logo when no screenshot */
  logoUrl: string;
  keyVisuals?: string[];
  /** One-line strategic direction: "Horizontal use cases", "AI for departments", etc. */
  bottomLine?: string;
}

/** Google Favicon - works without API key; Clearbit is deprecated */
const LOGO_URL = (domain: string, size = 64) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;

export interface AIEcosystemCategory {
  id: string;
  name: string;
  lucideIcon: string;
  color: string;
  tools: { name: string; isMonday?: boolean; logoUrl: string }[];
}

export interface MarketTrend {
  id: string;
  title: string;
  lucideIcon: string;
  summary: string;
  /** Short stat for card face only. Falls back to stats[0] if omitted. */
  cardStat?: { value: string; label: string };
  stats: { value: string; label: string; sourceUrl?: string }[];
  points: string[];
  implication: string;
  /** Twitter tweet ID for embedded evidence */
  evidenceTweetId?: string;
  /** Full quote text for custom display (no iframe truncation) */
  evidenceQuote?: {
    text: string;
    author: string;
    handle: string;
    url: string;
    /** Profile/avatar image URL */
    avatarUrl?: string;
    /** Tweet embedded image (e.g. screenshot from the tweet) */
    imageUrl?: string;
  };
}

export interface Assumption {
  number: number;
  headline: string;
  detail: string;
  lucideIcon: string;
  highlight?: boolean;
  sourceUrl?: string;
}

export interface BetAgent {
  name: string;
  description: string;
  color: string;
}

export interface Bet {
  number: number;
  title: string;
  subtitle: string;
  narrative?: string;
  agents: BetAgent[];
  pros: string[];
  cons: string[];
  keyRisk: string;
  tradeOff: string;
  phase?: string;
  recommended?: boolean;
  pillars?: { title: string; description: string; lucideIcon: string }[];
  whyItWins?: string[];
}

export interface RoadmapPhase {
  phase: string;
  timeframe: string;
  items: string[];
  color: string;
}

export const heroStats: Stat[] = [
  { value: '1.23', numericValue: 1.23, suffix: 'B', prefix: '$', label: 'Revenue (2025)', sourceUrl: 'https://investors.monday.com/' },
  { value: '225', numericValue: 225, suffix: 'K+', label: 'Customers', sourceUrl: 'https://investors.monday.com/' },
  { value: '27', numericValue: 27, suffix: '%', label: 'YoY Growth', sourceUrl: 'https://investors.monday.com/' },
  { value: '4', numericValue: 4, suffix: '', label: 'Products', sourceUrl: 'https://monday.com' },
];

export const audienceSegments = [
  { name: 'SMB', line: 'Fast adoption, need quick wins' },
  { name: 'Mid-Market', line: 'Balance efficiency with governance' },
  { name: 'Enterprise', line: 'Security, compliance, scale' },
];

export const aiEcosystemCategories: AIEcosystemCategory[] = [
  {
    id: 'productivity',
    name: 'Productivity',
    lucideIcon: 'Briefcase',
    color: BRAND_COLORS.teal,
    tools: [
      { name: 'monday.com', isMonday: true, logoUrl: LOGO_URL('monday.com') },
      { name: 'Notion', logoUrl: LOGO_URL('notion.so') },
      { name: 'ClickUp', logoUrl: LOGO_URL('clickup.com') },
      { name: 'Asana', logoUrl: LOGO_URL('asana.com') },
      { name: 'Airtable', logoUrl: LOGO_URL('airtable.com') },
      { name: 'Otter AI', logoUrl: LOGO_URL('otter.ai') },
      { name: 'NotebookLM', logoUrl: LOGO_URL('google.com') },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    lucideIcon: 'Megaphone',
    color: BRAND_COLORS.pink,
    tools: [
      { name: 'Jasper', logoUrl: LOGO_URL('jasper.ai') },
      { name: 'Copy.ai', logoUrl: LOGO_URL('copy.ai') },
      { name: 'Writesonic', logoUrl: LOGO_URL('writesonic.com') },
      { name: 'Beehiiv', logoUrl: LOGO_URL('beehiiv.com') },
      { name: 'Taplio', logoUrl: LOGO_URL('taplio.com') },
    ],
  },
  {
    id: 'programming',
    name: 'Programming',
    lucideIcon: 'Code2',
    color: BRAND_COLORS.green,
    tools: [
      { name: 'Cursor', logoUrl: LOGO_URL('cursor.com') },
      { name: 'Claude', logoUrl: LOGO_URL('anthropic.com') },
      { name: 'ChatGPT', logoUrl: LOGO_URL('openai.com') },
      { name: 'GitHub Copilot', logoUrl: LOGO_URL('github.com') },
      { name: 'Windsurf', logoUrl: LOGO_URL('codeium.com') },
      { name: 'OpenClaw', logoUrl: LOGO_URL('openclaw.ai') },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    lucideIcon: 'Palette',
    color: BRAND_COLORS.purple,
    tools: [
      { name: 'Midjourney', logoUrl: LOGO_URL('midjourney.com') },
      { name: 'Canva', logoUrl: LOGO_URL('canva.com') },
      { name: 'Adobe Firefly', logoUrl: LOGO_URL('adobe.com') },
      { name: 'Ideogram', logoUrl: LOGO_URL('ideogram.ai') },
      { name: 'Figma', logoUrl: LOGO_URL('figma.com') },
    ],
  },
  {
    id: 'video',
    name: 'Video',
    lucideIcon: 'Video',
    color: BRAND_COLORS.blue,
    tools: [
      { name: 'Runway', logoUrl: LOGO_URL('runwayml.com') },
      { name: 'Descript', logoUrl: LOGO_URL('descript.com') },
      { name: 'HeyGen', logoUrl: LOGO_URL('heygen.com') },
      { name: 'Veed', logoUrl: LOGO_URL('veed.io') },
      { name: 'Kling', logoUrl: LOGO_URL('klingai.com') },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    lucideIcon: 'TrendingUp',
    color: BRAND_COLORS.yellow,
    tools: [
      { name: 'Gong', logoUrl: LOGO_URL('gong.io') },
      { name: 'HubSpot', logoUrl: LOGO_URL('hubspot.com') },
      { name: 'Clay', logoUrl: LOGO_URL('clay.com') },
      { name: 'Superhuman', logoUrl: LOGO_URL('superhuman.com') },
      { name: 'Relevance AI', logoUrl: LOGO_URL('relevanceai.com') },
    ],
  },
  {
    id: 'orchestration',
    name: 'Orchestration',
    lucideIcon: 'Workflow',
    color: BRAND_COLORS.blue,
    tools: [
      { name: 'Make.com', logoUrl: LOGO_URL('make.com') },
      { name: 'n8n', logoUrl: LOGO_URL('n8n.io') },
      { name: 'LangGraph', logoUrl: LOGO_URL('langchain.com') },
      { name: 'CrewAI', logoUrl: LOGO_URL('crewai.com') },
    ],
  },
  {
    id: 'voice',
    name: 'Voice',
    lucideIcon: 'Mic',
    color: BRAND_COLORS.pink,
    tools: [
      { name: 'Vapi', logoUrl: LOGO_URL('vapi.ai') },
      { name: 'Bland AI', logoUrl: LOGO_URL('bland.ai') },
    ],
  },
];

export interface AgenticPlatformStackLayer {
  id: string;
  title: string;
  description: string;
  tagline: string;
  color: string;
  companies: { name: string; logoUrl: string; isMonday?: boolean }[];
}

export const agenticPlatformStackLayers: AgenticPlatformStackLayer[] = [
  {
    id: 'intelligence',
    title: 'Intelligence Layer',
    description: 'Reasoning & model capability',
    tagline: 'Provides intelligence — not workflow ownership.',
    color: BRAND_COLORS.blue,
    companies: [
      { name: 'OpenAI', logoUrl: LOGO_URL('openai.com') },
      { name: 'Anthropic', logoUrl: LOGO_URL('anthropic.com') },
      { name: 'Google', logoUrl: LOGO_URL('google.com') },
      { name: 'Azure AI', logoUrl: LOGO_URL('azure.microsoft.com') },
    ],
  },
  {
    id: 'agent-builders',
    title: 'Agent Builder Platforms',
    description: 'Build, deploy & govern agents',
    tagline: 'Strong inside their ecosystems.',
    color: BRAND_COLORS.purple,
    companies: [
      { name: 'Microsoft Copilot Studio', logoUrl: LOGO_URL('microsoft.com') },
      { name: 'Salesforce', logoUrl: LOGO_URL('salesforce.com') },
      { name: 'Agentforce', logoUrl: LOGO_URL('salesforce.com') },
      { name: 'Google Gemini', logoUrl: LOGO_URL('google.com') },
    ],
  },
  {
    id: 'automation',
    title: 'Automation & Orchestration Engines',
    description: 'Connect systems & automate processes',
    tagline: 'Automate tasks — don\'t own cross-team work.',
    color: '#FF9F43',
    companies: [
      { name: 'UiPath', logoUrl: LOGO_URL('uipath.com') },
      { name: 'Automation Anywhere', logoUrl: LOGO_URL('automationanywhere.com') },
      { name: 'Workato', logoUrl: LOGO_URL('workato.com') },
      { name: 'Zapier', logoUrl: LOGO_URL('zapier.com') },
    ],
  },
  {
    id: 'work-operating',
    title: 'Work Operating Layer',
    description: 'Where work is assigned, approved, tracked, and measured',
    tagline: 'This is where human + agent collaboration becomes accountable execution.',
    color: BRAND_COLORS.teal,
    companies: [
      { name: 'monday.com', logoUrl: LOGO_URL('monday.com'), isMonday: true },
      { name: 'Asana', logoUrl: LOGO_URL('asana.com') },
      { name: 'Atlassian', logoUrl: LOGO_URL('atlassian.com') },
      { name: 'Linear', logoUrl: LOGO_URL('linear.app') },
    ],
  },
];

export const agenticPlatformStackConclusion = 'Agents need intelligence and automation. But value accrues where execution is orchestrated and measured.';

export const departments: Department[] = [
  {
    name: 'Marketing',
    color: BRAND_COLORS.teal,
    lucideIcon: 'Megaphone',
    product: 'monday Work Management',
    jtbd: [
      'Campaign operations & tracking',
      'Asset creation & management',
      'Content calendars & editorial planning',
      'Creative requests & approvals',
      'Marketing analytics & reporting',
    ],
  },
  {
    name: 'PMO',
    color: BRAND_COLORS.purple,
    lucideIcon: 'BarChart3',
    product: 'monday Work Management',
    jtbd: [
      'Cross-functional project coordination',
      'Timeline & resource allocation',
      'Portfolio management & reporting',
      'Capacity planning',
      'Stakeholder communication',
    ],
  },
  {
    name: 'Sales',
    color: BRAND_COLORS.teal,
    lucideIcon: 'Handshake',
    product: 'monday CRM',
    jtbd: [
      'Pipeline management & forecasting',
      'Lead tracking & enrichment',
      'Customer data centralization',
      'Deal flow automation',
      'Sales analytics & reporting',
    ],
  },
  {
    name: 'R&D / Dev',
    color: BRAND_COLORS.green,
    lucideIcon: 'Settings',
    product: 'monday Dev',
    jtbd: [
      'Sprint planning & management',
      'Product roadmaps',
      'Bug tracking & resolution',
      'Release management',
      'Customer feedback loops',
    ],
  },
  {
    name: 'IT / Service',
    color: BRAND_COLORS.pink,
    lucideIcon: 'Shield',
    product: 'monday Service',
    jtbd: [
      'Ticketing & incident management',
      'Support workflows & SLAs',
      'Cross-department service ops',
      'Knowledge base management',
      'IT asset tracking',
    ],
  },
  {
    name: 'Operations',
    color: BRAND_COLORS.yellow,
    lucideIcon: 'RefreshCw',
    product: 'monday Work Management',
    jtbd: [
      'Process standardization',
      'Workflow automation & approvals',
      'Vendor management',
      'Compliance tracking',
      'Operational reporting',
    ],
  },
];

/** Core vs Operational intent blend per department. operationalPercent 0=Core, 100=Operational */
export interface DepartmentIntentBlend {
  name: string;
  color: string;
  lucideIcon: string;
  operationalPercent: number;
  label?: string;
}

export const departmentIntentBlend: DepartmentIntentBlend[] = [
  { name: 'Marketing', color: BRAND_COLORS.teal, lucideIcon: 'Megaphone', operationalPercent: 70, label: 'Campaigns, assets, boards' },
  { name: 'PMO', color: BRAND_COLORS.purple, lucideIcon: 'BarChart3', operationalPercent: 40, label: 'Portfolio & coordination' },
  { name: 'Sales', color: BRAND_COLORS.teal, lucideIcon: 'Handshake', operationalPercent: 50, label: 'Pipeline + tracking' },
  { name: 'R&D / Dev', color: BRAND_COLORS.green, lucideIcon: 'Settings', operationalPercent: 35, label: 'Sprint, roadmap, release' },
  { name: 'IT / Service', color: BRAND_COLORS.pink, lucideIcon: 'Shield', operationalPercent: 25, label: 'Internal tickets & ops' },
  { name: 'Operations', color: BRAND_COLORS.yellow, lucideIcon: 'RefreshCw', operationalPercent: 65, label: 'Process & approvals' },
];

/** Top enterprise use cases (ranked by popularity) — from monday.com enterprise adoption */
export interface EnterpriseUseCase {
  rank: number;
  name: string;
  departments: string;
  stat?: { value: string; label: string };
}

export const topEnterpriseUseCases: EnterpriseUseCase[] = [
  { rank: 1, name: 'Project & Portfolio Management', departments: 'PMO, Operations, R&D' },
  { rank: 2, name: 'Sales Pipeline & CRM', departments: 'Sales, Revenue Ops' },
  { rank: 3, name: 'Marketing Campaign & Content', departments: 'Marketing' },
  { rank: 4, name: 'Product Roadmap & Release Planning', departments: 'Product, R&D' },
  { rank: 5, name: 'Agile Development & Bug Tracking', departments: 'R&D, QA' },
  { rank: 6, name: 'HR Recruitment Pipeline (ATS)', departments: 'HR, Talent' },
  { rank: 7, name: 'Employee Onboarding', departments: 'HR, IT, Facilities' },
  {
    rank: 8,
    name: 'Customer Onboarding & Implementation',
    departments: 'Customer Success, Account Mgmt',
    stat: { value: '74%', label: 'boost in retention when onboarding is managed in one place' },
  },
  { rank: 9, name: 'OKR Tracking', departments: 'Leadership, All departments', stat: { value: '95%', label: 'OKR adoption, 80% goals achieved' } },
  { rank: 10, name: 'IT Support & Helpdesk', departments: 'IT Service Desk' },
];

export const marketTrends: MarketTrend[] = [
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    lucideIcon: 'Hammer',
    summary: 'Non-developers building full apps with AI in hours.',
    cardStat: { value: '340%', label: 'Micro-SaaS growth' },
    stats: [
      { value: '340%', label: 'Vertical micro-SaaS growth vs horizontal', sourceUrl: 'https://www.fool.com/investing/2026/02/12/the-vibe-coding-tool-thats-growing-faster-than-any/' },
      { value: '2-3hrs', label: 'Time to build a full-stack app', sourceUrl: 'https://lovable.dev' },
      { value: '17K+', label: 'Apps built with monday vibe', sourceUrl: 'https://monday.com/w/vibe' },
    ],
    points: [
      'Non-developers building full apps with AI in hours, not months',
      'CNBC\'s Deirdre Bosa recreated monday.com with Claude Cowork in 1 hour — calendar & Gmail integrated',
      'Companies replacing SaaS tools with custom internal tools (Lovable, Replit, Bolt)',
      'monday vibe already addresses this — 17,000+ apps built by customers',
    ],
    implication:
      'If building custom tools becomes trivial, horizontal platforms must offer what code can\'t replicate: data fabric, cross-team visibility, and governance.',
    evidenceTweetId: '2019088517071335880',
    evidenceQuote: {
      author: 'Deirdre Bosa',
      handle: '@dee_bosa',
      text: "ok WOW. Woke up this morning and said, for fun, lets try to recreate monday.com w Claude cowork. it wont work or anything, but we can just show our audience that its plausible. 1 hour later... I literally have my own monday.com that's plugged into my calendar & gmail and surfaced a kids bday that was not anywhere on my radar and I need to get a gift for. Can imagine next step being: order gift and have it delivered by Sunday. 2026 is WILD.",
      url: 'https://x.com/dee_bosa/status/2019088517071335880',
      avatarUrl: 'https://unavatar.io/twitter/dee_bosa',
      imageUrl: '/competitors/deirdre-bosa-monday-clone.png',
    },
  },
  {
    id: 'personal-agents',
    title: 'Personal AI Agents',
    lucideIcon: 'Bot',
    summary: 'Cursor, Claude, Copilot — $1B+ ARR each. 85% of devs use AI tools.',
    cardStat: { value: '$4B', label: 'AI coding market 2025' },
    stats: [
      { value: '$4B', label: 'AI coding market size (2025)', sourceUrl: 'https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-market' },
      { value: '85%', label: 'Developers using AI tools regularly', sourceUrl: 'https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/' },
      { value: '$1B+', label: 'ARR each: Cursor, Claude Code, Copilot', sourceUrl: 'https://github.blog/ai-and-ml/github-copilot/copilot-faster-smarter-and-built-for-how-you-work-now/' },
    ],
    points: [
      'Cursor, Claude Code, GitHub Copilot each surpassed $1B ARR',
      'OpenAI Operator, Manus — autonomous browser-based task agents',
      'AI agents crossed reliability threshold in Dec 2025',
      'Workers increasingly expect agent-level intelligence in their work tools',
    ],
    implication:
      'Every worker will have personal AI agents. Work platforms must support agent-to-platform integration, not just human-to-platform.',
    evidenceQuote: {
      author: 'Grand View Research',
      handle: 'AI Code Tools Market Report',
      text: 'The global AI code tools market was valued at USD 4.86 billion in 2023 and is projected to reach USD 26.03 billion by 2030, growing at a CAGR of 27.1%.',
      url: 'https://www.grandviewresearch.com/industry-analysis/ai-code-tools-market-report',
      avatarUrl: 'https://unavatar.io/domain/grandviewresearch.com',
      imageUrl: '/competitors/atlassian-team26.png',
    },
  },
  {
    id: 'competitors',
    title: 'Agentic Competitors',
    lucideIcon: 'Swords',
    summary: 'Every work platform has an agentic narrative. Market hitting $9B+ in 2026.',
    cardStat: { value: '$9B+', label: '2026 → $150B by 2030' },
    stats: [
      { value: '$9B+', label: 'Agentic segment 2026, trajectory to $150B+ by 2030', sourceUrl: 'https://www.gartner.com/en/newsroom/press-releases' },
      { value: '40%', label: 'Enterprise apps with agentic capabilities by mid-2026', sourceUrl: 'https://www.gartner.com/en/newsroom/press-releases' },
      { value: '7', label: 'Major competitors with AI agents', sourceUrl: 'https://www.notion.so/product/ai' },
      { value: '$800M+', label: 'Salesforce Agentforce ARR', sourceUrl: 'https://investor.salesforce.com/financials/default.aspx' },
    ],
    points: [
      'Notion: "Meet your 24/7 AI team" — Custom Agents, Enterprise Search',
      'ClickUp: "One AI to replace them all" — Super Agents, autonomous projects',
      'Asana: AI Teammates + AI Studio with prebuilt workflow gallery',
      'Salesforce & ServiceNow waging the "Great Agent War" for enterprise dominance',
    ],
    implication:
      'Every competitor has an agentic narrative. The question isn\'t whether to go agentic — it\'s how to differentiate.',
    evidenceQuote: {
      author: 'Notion',
      handle: 'Meet your 24/7 AI team',
      text: 'Notion Custom Agents: infinite minds built for teamwork. Answer questions, prioritize tasks, write reports — all while you sleep. Custom Agents automate recurring work across any team.',
      url: 'https://www.notion.so/product/ai',
      avatarUrl: 'https://unavatar.io/domain/notion.so',
      imageUrl: '/competitors/notion-custom-agents.png',
    },
  },
  {
    id: 'enterprise-spending',
    title: 'Enterprise AI Spending',
    lucideIcon: 'TrendingUp',
    summary: 'GenAI spending surpassing non-AI software for the first time.',
    cardStat: { value: '$6.15T', label: 'Global IT spend 2026' },
    stats: [
      { value: '$6.15T', label: 'Global IT spending 2026', sourceUrl: 'https://www.gartner.com/en/newsroom/press-releases' },
      { value: '+15.2%', label: 'Enterprise software growth', sourceUrl: 'https://www.gartner.com/en/newsroom/press-releases' },
      { value: '3x', label: 'AI-powered CRM/ERP spend growth', sourceUrl: 'https://www.gartner.com/en/newsroom/press-releases' },
    ],
    points: [
      'GenAI spending surpassing non-AI software for the first time in history',
      'VCs: enterprises will spend more on AI in 2026 — through fewer vendors (TechCrunch, Dec 2025)',
      'AI-powered CRM, ERP, and productivity platforms tripling to ~$270B',
      'Enterprises pivoted from "build" to "buy" after POC failures in 2024',
      'Of 15.2% software growth, ~9% goes to price increases — remaining 6% almost entirely to AI',
    ],
    implication:
      'The budget is there. Enterprises want AI embedded in their existing platforms, not new standalone tools.',
    evidenceQuote: {
      author: 'Rob Biederman',
      handle: 'TechCrunch, Asymmetric Capital Partners',
      text: '"Budgets will increase for a narrow set of AI products that clearly deliver results and will decline sharply for everything else. We expect a bifurcation where a small number of vendors capture a disproportionate share of enterprise AI budgets."',
      url: 'https://techcrunch.com/2025/12/30/vcs-predict-enterprises-will-spend-more-on-ai-in-2026-through-fewer-vendors/',
      avatarUrl: 'https://unavatar.io/domain/techcrunch.com',
      imageUrl: '/competitors/techcrunch-enterprise-ai-2026.jpg',
    },
  },
  {
    id: 'multi-agent-swarms',
    title: 'Multi-Agent Swarms',
    lucideIcon: 'Users',
    summary: 'Shift from one smart bot to teams of specialized agents working in a loop.',
    cardStat: { value: '3+', label: 'Agent teams in loop' },
    stats: [
      { value: '3+', label: 'Specialized agents in a typical swarm (Researcher, Writer, Fact-Checker)', sourceUrl: 'https://github.com/openai/swarm' },
    ],
    points: [
      'Teams of agents: Researcher → Writer → Fact-Checker working in sequence',
      'OpenAI Swarm: lightweight, highly coordinated multi-agent systems',
      'LangGraph / CrewAI: frameworks for persistent agentic state machines',
      'Digital Assembly Lines replacing conversational chatbots',
    ],
    implication:
      'Work platforms must support agent-to-agent collaboration, not just human-to-agent. Orchestration becomes the differentiator.',
    evidenceQuote: {
      author: 'OpenAI',
      handle: 'Swarm framework',
      text: 'Educational framework exploring ergonomic, lightweight multi-agent orchestration. Teams of agents working in sequence — Researcher, Writer, Fact-Checker — with handoffs between specialized agents.',
      url: 'https://github.com/openai/swarm',
      avatarUrl: 'https://unavatar.io/domain/github.com',
      imageUrl: '/competitors/servicenow-ai-agent-studio.png',
    },
  },
  {
    id: 'mcp-standard',
    title: 'MCP as Universal Plug',
    lucideIcon: 'Plug',
    summary: 'Model Context Protocol lets agents pull data from any source without custom code.',
    cardStat: { value: 'MCP', label: 'Universal data plug' },
    stats: [
      { value: 'MCP', label: 'Universal protocol: BigQuery, Slack, files, GitHub — no custom code', sourceUrl: 'https://modelcontextprotocol.io' },
    ],
    points: [
      'MCP has become the standard "plug" for agent data access',
      'No custom integrations: connect to BigQuery, Slack, local files, GitHub',
      'Atlassian Rovo, monday.com, and others adopt MCP for multi-vendor agents',
      'Interoperability enables best-of-breed agent ecosystems',
    ],
    implication:
      'monday.com\'s MCP support positions us as the hub where external agents and internal work meet.',
    evidenceQuote: {
      author: 'Anthropic',
      handle: 'Model Context Protocol',
      text: 'MCP is an open standard for connecting AI assistants to external data sources. Replace fragmented custom integrations with a universal protocol — connect to BigQuery, Slack, GitHub, Postgres without custom code.',
      url: 'https://modelcontextprotocol.io',
      avatarUrl: 'https://unavatar.io/domain/anthropic.com',
      imageUrl: '/competitors/atlassian-jira-rovo.png',
    },
  },
  {
    id: 'agentic-gap',
    title: 'Implementation Risks',
    lucideIcon: 'AlertTriangle',
    summary: '40% of agentic projects fail due to Legacy Debt — systems without APIs for agents.',
    cardStat: { value: '40%', label: 'Projects failing (Legacy Debt)' },
    stats: [
      { value: '40%', label: 'Agentic projects failing due to Legacy Debt', sourceUrl: 'https://www.gartner.com/en/newsroom/press-releases' },
    ],
    points: [
      'Legacy systems without APIs block agent integration',
      'Shadow AI: unmanaged local agents (e.g. OpenClaw) create data exfiltration risks',
      'AgentOps essential: prevent looping, hallucinations in production',
      'Human-in-the-loop approval gates (n8n) address governance',
    ],
    implication:
      'monday.com\'s API-first platform and enterprise governance are a competitive moat for customers worried about agentic failures.',
    evidenceQuote: {
      author: 'Gartner',
      handle: 'Agentic AI Predictions',
      text: 'Over 40% of agentic AI projects will be canceled by end of 2027 — driven by escalating costs, unclear business value, inadequate risk controls, and legacy system integration challenges.',
      url: 'https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027',
      avatarUrl: 'https://unavatar.io/domain/gartner.com',
      imageUrl: '/competitors/atlassian-confluence-ai.png',
    },
  },
];

export const competitors: Competitor[] = [
  {
    name: 'Notion',
    tagline: 'Meet your 24/7 AI team',
    approach:
      'Horizontal agents for any team. Custom Agents automate recurring work. Enterprise Search across apps. Credit-based pricing.',
    keyMetric: 'Custom Agents free until May 2026',
    keyMetricSourceUrl: 'https://www.notion.so/product/ai',
    aiFeatures: ['Custom Agents', 'Enterprise Search', 'AI Meeting Notes', 'Research Mode'],
    color: '#000000',
    heroHeadline: 'Meet your 24/7 AI team',
    heroSubline: 'Infinite minds, built for teamwork. Answer questions, prioritize tasks, and write reports — all while you sleep.',
    productUrl: 'https://www.notion.so/product/ai',
    screenshotUrl: '/competitors/notion-ai.png',
    tweetEmbedId: '2028533326966088188',
    galleryUrls: ['/competitors/notion-custom-agents.png', '/competitors/notion-qa-agent.png', '/competitors/notion-bug-tracker.png'],
    logoUrl: LOGO_URL('notion.so'),
    keyVisuals: ['Custom Agents automate recurring work', 'Enterprise Search across Slack, GitHub & more', 'AI Meeting Notes — no bot needed'],
    bottomLine: 'Horizontal use cases — Custom Agents (Q&A, routing, reporting) for any team',
  },
  {
    name: 'ClickUp',
    tagline: 'One AI to replace them all',
    approach:
      'Aggressive all-in-one positioning. Super Agents, autonomous projects, AI Creator. Claims to save 1 day per week.',
    keyMetric: '88% cost savings vs. separate AI tools',
    keyMetricSourceUrl: 'https://clickup.com/ai',
    aiFeatures: ['Super Agents', 'Autonomous Projects', 'AI Meetings', 'Enterprise Search', 'AI Creator'],
    color: '#7B68EE',
    heroHeadline: 'The only AI that works with your work',
    heroSubline: 'Super Agents, autonomous projects, AI Creator. Save 1 day per week, guaranteed.',
    productUrl: 'https://clickup.com/ai',
    screenshotUrl: '/competitors/clickup-ai.png',
    galleryUrls: ['/competitors/clickup-ai-departments.png'],
    logoUrl: LOGO_URL('clickup.com'),
    bottomLine: 'AI for departments — Solutions for Projects, Marketing, IT, HR, Leadership',
    keyVisuals: ['Super Agents: Project Manager, Campaign Manager, Content Reviewer', 'Autonomous projects — work moves forward on its own', 'AI in every feature, right where you work'],
  },
  {
    name: 'Asana',
    tagline: 'Human + AI collaboration',
    approach:
      'Enterprise-focused with AI Teammates and AI Studio. Prebuilt workflow gallery. Strong governance positioning.',
    keyMetric: 'AI Teammates for complex work delegation',
    keyMetricSourceUrl: 'https://asana.com/product/ai',
    aiFeatures: ['AI Teammates', 'AI Studio', 'Smart Workflow Gallery', 'AI Connectors'],
    color: '#F06A6A',
    heroHeadline: 'Human + AI collaboration that moves work forward',
    heroSubline: 'AI Teammates take on complex work. AI Studio handles busywork. Prebuilt Smart Workflow Gallery.',
    productUrl: 'https://asana.com/product/ai',
    screenshotUrl: '/competitors/asana-ai.png',
    logoUrl: LOGO_URL('asana.com'),
    bottomLine: 'Human–AI collaboration — AI Teammates + prebuilt workflows, enterprise governance',
    keyVisuals: ['AI Teammates for complex work delegation', 'AI Studio for routine tasks — no code required', 'Smart Workflow Gallery with best practices'],
  },
  {
    name: 'Airtable',
    tagline: 'Hyperagent — AGI is here. Now harness it.',
    approach:
      'Agents platform by Airtable: isolated full computing environments in the cloud, skill learning for domain expertise, one-click Slack deployment, command center for agent fleet management.',
    keyMetric: 'Complete system for AGI-level agents',
    keyMetricSourceUrl: 'https://www.hyperagent.com/',
    aiFeatures: ['Isolated Computing', 'Skill Learning', 'Slack Deployment', 'Agent Fleet Command Center'],
    color: '#FCBB00',
    heroHeadline: 'AGI is here. Now harness it.',
    heroSubline: 'Isolated computing, real browser & code execution, teach any skill, one-click Slack bots, fleet oversight.',
    productUrl: 'https://www.hyperagent.com/',
    screenshotUrl: '/competitors/airtable-hyperagent.png',
    galleryUrls: ['/competitors/airtable-hyperagent-fleet.png'],
    logoUrl: LOGO_URL('airtable.com'),
    bottomLine: 'AGI infrastructure — Isolated computing, skill learning, agent fleet',
    keyVisuals: ['Isolated full computing environment per session — no Mac Mini', 'Teach agents skills (due diligence, startup eval, your voice)', 'One-click deploy to Slack as intelligent coworkers', 'Command center to manage agent fleet at scale'],
  },
  {
    name: 'Atlassian',
    tagline: 'Projects that manage themselves',
    approach:
      'Rovo agents in Jira — assign work to agents like teammates. MCP protocol for multi-vendor. Rovo Studio for custom workflows.',
    keyMetric: 'MCP-compatible multi-vendor agents',
    keyMetricSourceUrl: 'https://atlassian.com/software/jira/ai',
    aiFeatures: ['Rovo Agents', 'Agent Assignment', 'Rovo Studio', 'Work Readiness Checker'],
    color: '#0052CC',
    heroHeadline: 'Projects that practically manage themselves',
    heroSubline: 'Assign work to Rovo agents like teammates. MCP protocol for multi-vendor. Rovo Studio for custom workflows.',
    productUrl: 'https://atlassian.com/software/jira/ai',
    screenshotUrl: '/competitors/atlassian-ai-entourage.png',
    galleryUrls: [
      '/competitors/atlassian-ai-entourage.png',
      '/competitors/atlassian-team26.png',
      '/competitors/atlassian-jira-rovo.png',
      '/competitors/atlassian-confluence-ai.png',
    ],
    logoUrl: LOGO_URL('atlassian.com'),
    bottomLine: 'Departments in work management context — orchestrate, plan, track; not task execution',
    keyVisuals: [
      'AI Entourage — departments (Dev, Marketing, PM, IT) for orchestration & planning, not execution',
      'Agents in Jira — @mention, assign, run in workflows',
      'Workflow Builder, Code Planner, Work Readiness Checker',
      'MCP-compatible: Amplitude, Figma, GitHub, HubSpot',
    ],
  },
  {
    name: 'Salesforce',
    tagline: 'Agentforce',
    approach:
      'Enterprise agentic AI platform with Atlas Reasoning Engine. Action-based pricing. Agentforce Command Center.',
    aiFeatures: ['Agentforce', 'Atlas Reasoning Engine', 'Command Center', 'Action-based Pricing'],
    color: '#00A1E0',
    heroHeadline: 'Agentforce — Enterprise agentic AI',
    keyMetric: '$800M+ Agentforce ARR',
    keyMetricSourceUrl: 'https://investor.salesforce.com/financials/default.aspx',
    heroSubline: 'Atlas Reasoning Engine, Agentforce Command Center. $800M+ AI revenue. Action-based pricing.',
    productUrl: 'https://www.salesforce.com/ai',
    screenshotUrl: '/competitors/salesforce-ai.png',
    logoUrl: LOGO_URL('salesforce.com'),
    bottomLine: 'Enterprise agentic platform — Agentforce, Atlas, action-based pricing',
    keyVisuals: ['Atlas Reasoning Engine for autonomous planning', 'Agentforce Command Center for oversight', 'Action-based pricing at $0.10 per action'],
  },
  {
    name: 'ServiceNow',
    tagline: 'AI Agent Orchestrator',
    approach:
      'AI Agent Fabric for enterprise orchestration. AI Control Tower for governance. Vibe Coding for non-technical users.',
    keyMetric: '#1 Gartner AI Agents ranking',
    keyMetricSourceUrl: 'https://www.gartner.com/reviews/market/ai-agents-platforms',
    aiFeatures: ['AI Agent Fabric', 'AI Control Tower', 'Agentic Playbooks', 'Vibe Coding'],
    color: '#81B5A1',
    heroHeadline: 'AI Agent Orchestrator',
    heroSubline: 'AI Agent Fabric, AI Control Tower, Agentic Playbooks. #1 Gartner AI Agents. Vibe Coding for non-technical users.',
    productUrl: 'https://www.servicenow.com/products/ai-agents.html',
    screenshotUrl: '/competitors/servicenow-ai.png',
    galleryUrls: [
      '/competitors/servicenow-ai-agent-studio.png',
      '/competitors/servicenow-control-tower.png',
      '/competitors/servicenow-one-platform.png',
    ],
    logoUrl: LOGO_URL('servicenow.com'),
    bottomLine: 'Enterprise orchestration — AI Agent Fabric, Control Tower, Gartner #1',
    keyVisuals: ['AI Agent Fabric for sub-second enterprise context', 'AI Control Tower for multi-agent governance', 'Agentic Playbooks for flexible business logic'],
  },
  {
    name: 'Relevance AI',
    tagline: 'Self-Driving SDRs & Research agents',
    approach:
      'Leading the GTM space with autonomous SDR agents, research agents, and workflow automation. Vertical focus on sales and marketing operations.',
    keyMetric: 'Leading GTM agentic platform',
    keyMetricSourceUrl: 'https://relevanceai.com',
    aiFeatures: ['Self-Driving SDRs', 'Research Agents', 'Workflow Automation', 'Multi-Agent Workflows'],
    color: '#6366F1',
    heroHeadline: 'Self-Driving SDRs & Research agents',
    heroSubline: 'Autonomous SDR outreach, deep research agents, multi-agent workflows for GTM teams.',
    productUrl: 'https://relevanceai.com',
    logoUrl: LOGO_URL('relevanceai.com'),
    bottomLine: 'GTM vertical — Self-Driving SDRs, research agents for sales & marketing',
    keyVisuals: ['Self-Driving SDRs for outbound', 'Research agents for lead enrichment', 'Multi-agent workflows for GTM'],
  },
];

export const competitorMatrix = {
  xAxis: { label: 'Vertical', labelEnd: 'Horizontal' },
  yAxis: { label: 'Assistive (Copilot)', labelEnd: 'Autonomous (Agents)' },
  positions: [
    { name: 'Notion', x: 85, y: 70 },
    { name: 'ClickUp', x: 75, y: 75 },
    { name: 'Asana', x: 55, y: 60 },
    { name: 'Wrike', x: 40, y: 65 },
    { name: 'Atlassian', x: 30, y: 55 },
    { name: 'Salesforce', x: 20, y: 85 },
    { name: 'ServiceNow', x: 25, y: 90 },
    { name: 'monday.com\n(today)', x: 50, y: 35 },
    { name: 'monday.com\n(target)', x: 60, y: 80, isTarget: true },
  ],
};

export const assumptions: Assumption[] = [
  {
    number: 1,
    headline: 'Most customers haven\'t adopted AI yet',
    detail:
      'They don\'t understand what it does, where it fits, or how it connects to their daily work. Early adopter noise masks mainstream reality.',
    lucideIcon: 'Sprout',
    sourceUrl: 'https://www.deloitte.com/gr/en/issues/generative-ai/TheStateofAIintheEnterprise.html',
  },
  {
    number: 2,
    headline: 'Customers buy outcomes, not AI',
    detail:
      'They come to launch campaigns, close deals, ship products. AI is a lever, not the destination.',
    lucideIcon: 'Target',
    sourceUrl: 'https://www.christenseninstitute.org/jobs-to-be-done/',
  },
  {
    number: 3,
    headline: '"Do more with less" is accelerating',
    detail:
      'Always true, but AI makes this a board-level expectation. Companies that can\'t demonstrate efficiency gains with AI will lose budget.',
    lucideIcon: 'Zap',
    sourceUrl: 'https://www.gartner.com/en/newsroom/press-releases',
  },
  {
    number: 4,
    headline: 'Augmentation, not replacement',
    detail:
      'Humans are the orchestrators of the new workforce. Agents need humans to direct, validate, and make judgment calls.',
    lucideIcon: 'Users',
    sourceUrl: 'https://ide.mit.edu/insights/should-ai-automate-jobs-or-augment-them/',
  },
  {
    number: 5,
    headline: 'Work needs a surface',
    detail:
      'Regardless of who does the work — human or agent — you need visibility: where it happens, who\'s doing it, what\'s the status. This is monday.com\'s superpower.',
    lucideIcon: 'Eye',
    highlight: true,
    sourceUrl: 'https://monday.com',
  },
  {
    number: 6,
    headline: 'Trust is the adoption bottleneck',
    detail:
      'Enterprises adopt AI agents only when they trust the output, data security, and governance. monday.com\'s enterprise relationships are a competitive moat.',
    lucideIcon: 'Lock',
    sourceUrl: 'https://www.gartner.com/en/articles/ai-trust-and-ai-risk',
  },
  {
    number: 7,
    headline: 'Human role shift: Implementers → Directors',
    detail:
      'Employees are moving from doing the work to reviewing agent output and setting strategic goals. Work platforms must support this director role.',
    lucideIcon: 'Compass',
    sourceUrl: 'https://www.mckinsey.com/mgi/media-center/a-new-years-resolution-for-leaders-redesign-work-for-people-and-ai',
  },
];

export interface StoryLayer {
  number: number;
  title: string;
  subtitle: string;
  color: string;
  lucideIcon: string;
  points: string[];
}

export const storyLayers: StoryLayer[] = [
  {
    number: 1,
    title: 'Agentic execution layer',
    subtitle: 'Where agents and people work',
    color: BRAND_COLORS.teal,
    lucideIcon: 'Users',
    points: [
      'Sidekick AI assistant — natural language to actions',
      'Department agents (Marketing, Sales, PMO, Dev, Service)',
      'Capability agents (Research, Planning, Content, QA, Reporting)',
      'Agent Hub — third-party and monday.com-built agents',
      'Humans and agents collaborate on the same surface',
    ],
  },
  {
    number: 2,
    title: 'Work surface & context layer',
    subtitle: 'Where work is visible — boards, items, dashboards',
    color: BRAND_COLORS.purple,
    lucideIcon: 'LayoutGrid',
    points: [
      'Boards — visual work management for any use case',
      'Items — tasks, projects, deals, tickets in one place',
      'Dashboards — real-time visibility and reporting',
      'Automations — workflows that connect humans and agents',
      'Single source of truth for what\'s happening',
    ],
  },
  {
    number: 3,
    title: 'Data layer',
    subtitle: 'System of Records — Enterprise Grade Secure / Governance and Permissions',
    color: BRAND_COLORS.blue,
    lucideIcon: 'Shield',
    points: [
      'Enterprise-grade security and compliance',
      'Governance and permissions at scale',
      'Audit trails for human and agent actions',
      'Data residency and regulatory requirements',
      'Trust foundation for agent adoption',
    ],
  },
];

export const bets: Bet[] = [
  {
    number: 1,
    title: 'Agentic Departments',
    subtitle: 'Vertical-by-department agents solving specific JTBD',
    agents: [
      { name: 'Marketing Agent', description: 'Campaign ops, briefs, creative assets, performance tracking', color: BRAND_COLORS.teal },
      { name: 'Sales Agent', description: 'Lead enrichment, SDR outreach, pipeline prioritization', color: BRAND_COLORS.teal },
      { name: 'PMO Agent', description: 'Status reports, risk identification, resource reallocation', color: BRAND_COLORS.purple },
      { name: 'Dev Agent', description: 'Bug triage, ticket-to-code, release readiness', color: BRAND_COLORS.green },
      { name: 'Service Agent', description: 'Ticket routing, resolution suggestions, smart escalation', color: BRAND_COLORS.pink },
    ],
    pros: [
      'Aligns with existing product structure (WM, CRM, Dev, Service)',
      'Speaks the language customers already know',
      'Clear use cases for sales teams to demo',
    ],
    cons: [
      'Risk of being too narrow — customers may compare to point solutions',
      'Harder to create a unified "platform" narrative',
    ],
    keyRisk: 'Customers may treat agents as point solutions and compare to standalone AI tools.',
    tradeOff: 'We chose department-specific agents over horizontal capabilities to match how customers buy.',
    phase: 'Phase 1: CRM/Sales agents (beta). Phase 2: Marketing + PMO agents (H2 2026).',
  },
  {
    number: 2,
    title: 'Agentic Capabilities',
    subtitle: 'Horizontal cross-department agents for universal work patterns',
    agents: [
      { name: 'Research Agent', description: 'Deep research on any topic with web + internal data', color: BRAND_COLORS.blue },
      { name: 'Planning Agent', description: 'Break goals into plans, milestones, and tasks', color: BRAND_COLORS.purple },
      { name: 'Content Agent', description: 'Create documents, presentations, creative assets', color: BRAND_COLORS.teal },
      { name: 'QA Agent', description: 'Validate quality, check compliance, catch errors', color: BRAND_COLORS.green },
      { name: 'Reporting Agent', description: 'Generate dashboards, summaries, insights from any data', color: BRAND_COLORS.yellow },
    ],
    pros: [
      'Bigger TAM per capability',
      'More "platform" feeling',
      'Matches how Notion is positioning',
    ],
    cons: [
      'Less differentiated — any AI platform could offer these',
      'Harder to demo specific business value',
    ],
    keyRisk: 'Generic capabilities are harder to differentiate — any AI platform could offer these.',
    tradeOff: 'We chose department-specific over horizontal to avoid commoditization.',
    phase: 'Phase 2: Research, Reporting agents (H2 2026). Agent Hub beta.',
  },
  {
    number: 3,
    title: 'The Work OS for Humans + Agents',
    subtitle: 'monday.com as the orchestration layer where human work and agent work converge',
    recommended: true,
    narrative:
      'AI agents are everywhere — in your browser, your IDE, your inbox. But who manages the agents? Who gives them context? Who ensures they work together? monday.com is the operating system for the new workforce — humans AND agents, visible on one surface.',
    agents: [],
    pillars: [
      {
        title: 'Agent Hub',
        description: 'Department-specific AND horizontal agents — monday.com-built and third-party (MCP-compatible)',
        lucideIcon: 'Store',
      },
      {
        title: 'Work Surface',
        description: 'The visual layer where ALL work is tracked — human or agent. Boards, dashboards, and automations become the "control tower"',
        lucideIcon: 'LayoutGrid',
      },
      {
        title: 'Orchestration',
        description: 'Humans set goals, agents execute. Assignment, monitoring, approval, and governance in one place.',
        lucideIcon: 'Workflow',
      },
    ],
    whyItWins: [
      'Leverages monday.com\'s DNA (visual, flexible, cross-department)',
      'Creates a new category — "Work OS for the Agent Age"',
      'Addresses the "work surface" need as a core differentiator',
      'Makes the trust problem easier — agents work within governed environment',
      'Platform lock-in: even external agents are managed through monday.com',
    ],
    pros: [],
    cons: [],
    keyRisk: 'Requires significant product investment in orchestration and hub — timing could slip.',
    tradeOff: 'We chose orchestration layer over single-agent focus to own the category long-term.',
    phase: 'Phase 2: Work Surface messaging, Agent Hub beta. Phase 3: Control Tower, governance (2027).',
  },
];

export const roadmap: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    timeframe: 'Now — H1 2026',
    items: [
      'CRM/Sales agents (already in beta)',
      '"Work Surface" messaging — position platform as where agent work is tracked',
      'monday vibe expansion — 17K+ apps, growing',
      'Sidekick AI assistant adoption push',
    ],
    color: BRAND_COLORS.teal,
  },
  {
    phase: 'Phase 2',
    timeframe: 'H2 2026',
    items: [
      'Marketing + PMO agents launch',
      'Horizontal capabilities: Research, Reporting agents',
      'Agent Hub beta — third-party agent integration',
      'MCP protocol support for external agents',
    ],
    color: BRAND_COLORS.purple,
  },
  {
    phase: 'Phase 3',
    timeframe: '2027',
    items: [
      'Full orchestration platform — Agent Control Tower',
      'Third-party agent ecosystem at scale',
      'Enterprise governance & compliance layer',
      'Agent-to-agent collaboration workflows',
    ],
    color: BRAND_COLORS.green,
  },
];

export const successMetrics = [
  { icon: '📊', title: 'Agent Adoption Rate', description: '% of customers with at least one active agent', target: 'Target: 30% of enterprise accounts by EOY' },
  { icon: '⚡', title: 'Agent Tasks / Week', description: 'Number of tasks completed by agents weekly', target: 'Target: 10M agent-completed tasks/month' },
  { icon: '💰', title: 'AI/Agent Revenue', description: 'Revenue from AI add-ons (credits or actions)', target: 'Target: 10% of total ARR from AI' },
  { icon: '📈', title: 'Deal Size Lift', description: 'Enterprise deal size increase with agent capabilities', target: 'Target: 25% higher ACV on agent-enabled deals' },
  { icon: '🏆', title: 'Competitive Win Rate', description: 'Win rate change when AI/agents are in evaluation criteria', target: 'Target: +15pp win rate improvement' },
];
