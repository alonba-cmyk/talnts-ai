import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Mail, 
  Award, 
  MessageSquare, 
  Sparkles, 
  Share2, 
  Calendar,
  FolderKanban,
  Workflow,
  BarChart,
  Ticket,
  HeadphonesIcon,
  Shield,
  Code,
  Zap,
  FileCheck,
  Search,
  Receipt,
  DollarSign,
  PieChart,
  UserPlus,
  Briefcase,
  UserCheck,
  Target,
  Clock,
  Star,
  Link2,
  ChevronDown,
  CalendarCheck,
  UsersRound,
  Send,
  FileText,
  TrendingUpDown,
  Phone,
  AlertCircle,
  GitBranch,
  ListChecks,
  Wrench,
  FileBarChart,
  Scale,
  Gavel,
  FolderSearch,
  Calculator,
  Wallet,
  LineChart,
  UserSearch,
  ClipboardCheck,
  IdCard,
  Loader2
} from 'lucide-react';

// Import Supabase hooks for live data
import { useDepartments, useDepartmentData, useSiteSettings } from '@/hooks/useSupabase';

// Import Business Values context
import { useBusinessValues, getIconComponent as getBusinessValueIcon, Department as BusinessDepartment } from '@/contexts/BusinessValuesContext';

// Import avatar images from Figma
import imgAvatar1 from '@/assets/a8016eb62d3e284810c5691fa950de5343f7d776.png';
import imgAvatar2 from '@/assets/4f1259d102c1081ca7d88367c1ec9d3487166104.png';
import imgAvatar3 from '@/assets/31fef8e27a4c799459c58ae163c55324da0a21d4.png';
import imgAvatar4 from '@/assets/c7005ced01914c6b1f5e7c0f86f6d5e4e22d3e9f.png';
import imgAvatar5 from '@/assets/840c44286a6c4e57e9df25a1565fdbb673fa3a6c.png';
import imgAvatar6 from '@/assets/012f240f3a87d4b9507b3306396ea0954ebb82f2.png';
import imgAvatar7 from '@/assets/44c98f36561338e389a6bf8368546aa8aba3c0a7.png';
import imgAvatar8 from '@/assets/084fc1b320f94aa65233683f6d07e27bc528df49.png';

// Import agent images
import agentImage1 from '@/assets/053936dfeea2ccad575c77f11dabe02cb2e01b92.png';
import agentImage2 from '@/assets/f158e4bd7406bb7f1accf54fb06c7de8cfd09e48.png';
import agentImage3 from '@/assets/552ed6ec83999a43766184b9ddf41b03d687acdf.png';
import agentImageSales from '@/assets/c7005ced01914c6b1f5e7c0f86f6d5e4e22d3e9f.png';
import translatorAgentImage from '@/assets/aece03b1670d8ad77897b40393abfd865bf22236.png';

// Import Sales agent images
import salesAgent1 from '@/assets/1a6545c2a20393d4de191bc3df98cac4c2b88431.png';
import salesAgent2 from '@/assets/0fafb66c9d5e1f1c3aa2960e503241167702ac82.png';
import salesAgent3 from '@/assets/b2c9dfcefde52ea28ed14159ca39ccf040cdfd52.png';

// Import Vibe app images
import socialMediaCalendarImage from '@/assets/5c1e9558f0852bdc2f86cf1e2165d47ef6a97194.png';
import customerSegmentationImage from '@/assets/bc17ecea9b6a3dea74c123dfa6a80072df0aa8f0.png';

// Import Work Management product image
import workManagementImage from '@/assets/d2ea19ded5803c4d8a582f673f09fc5cd9f2b474.png';

// Import CRM product image
import crmImage from '@/assets/66a85a213022574734ff989cb9e853fb2964d9ac.png';

// Import Campaigns product image
import campaignsImage from '@/assets/81da50cc2986a7749ea063a4709cf33a1969edc1.png';

// Import Sidekick action image
import generateCampaignBriefsImage from '@/assets/62829d5af3833ae6c80aed45f9b07fbc9d652a5f.png';
import marketIntelligenceImage from '@/assets/35ef66e9bc144f2e71317c3d0dc5174c394e599c.png';
import visualCreationImage from '@/assets/67127cee3efc2e2d1244b02d7c14ce90ab332540.png';

// Import custom components
import { DepartmentCard } from '@/app/components/DepartmentCard';
import { DepartmentCardWithAvatar } from '@/app/components/DepartmentCardWithAvatar';
import { SolutionDisplay } from '@/app/components/SolutionDisplaySimple';
import { ValueCard } from '@/app/components/ValueCard';
import { SelectionTabs, SelectionMode } from '@/app/components/SelectionTabs';
import { HeroLogo } from '@/app/components/HeroLogo';
import { ConnectionFlow } from '@/app/components/ConnectionFlow';
import { TopNavigationSelector } from '@/app/components/TopNavigationSelector';
import { DepartmentSidebar } from '@/app/components/DepartmentSidebar';
import { CustomPromptInput } from '@/app/components/CustomPromptInput';
import { BeforeAfterBoardSection } from '@/app/components/BeforeAfterBoardSection';
import { HeroAlternative } from '@/app/components/HeroAlternative';
import { HeroOutcomeCards } from '@/app/components/HeroOutcomeCards';
import { WorkComparisonSection } from '@/app/components/WorkComparisonSection';
import { SidekickCapabilitiesSection } from '@/app/components/SidekickCapabilitiesSection';
import { ProjectManagementSection } from '@/app/components/ProjectManagementSection';
import { AgentsShowcaseSection } from '@/app/components/AgentsShowcaseSection';
import { TeamsAndAgentsSection } from '@/app/components/TeamsAndAgentsSection';
import { TeamsAndAgentsV2 } from '@/app/components/TeamsAndAgentsV2';
import { AIPlatformArchitectureSection } from '@/app/components/AIPlatformArchitectureSection';
import { TeamCommandsSection } from '@/app/components/TeamCommandsSection';

// Import SidekickThemeProvider for sidekick theming
import { SidekickThemeProvider, SidekickPanelTheme } from '@/contexts/SidekickThemeContext';

// Import shared section builder
import { buildStandaloneSections } from '@/app/useSectionComponents';

// Additional items data is now loaded from Supabase

type Department = 'operations' | 'marketing' | 'sales' | 'support' | 'product' | 'legal' | 'finance' | 'hr';

interface AgentInfo {
  name: string;
  description: string;
  value: string;
  image?: string;
}

interface ProductInfo {
  name: string;
  description: string;
  value: string;
  image?: string;
  useCases?: string[]; // Add use cases
  replacesTools?: Array<{ name: string; color: string }>; // Update to include color
}

interface SidekickAction {
  name: string;
  description: string;
  value: string;
  image?: string;
}

interface Solution {
  products: ProductInfo[];
  agents: AgentInfo[];
  sidekickCapabilities: SidekickAction[];
  vibeApps: Array<{
    name: string;
    icon: any;
    value: string;
    replacesTools: string[];
    image?: string;
    url?: string;  // Link to Vibe product page
  }>;
  values: Array<{
    icon: any;
    title: string;
    description: string;
    supportedBy: Array<'WM' | 'CRM' | 'Service' | 'Dev' | 'Sidekick' | 'Agents'>;
    replacesTools?: string[]; // Tools this can replace
  }>;
}

// Mapping between departments and their solutions
const departmentSolutions: Record<Department, Solution> = {
  marketing: {
    products: [
      { 
        name: 'Work Management', 
        description: 'Manage all your marketing campaigns, content calendar, and team collaboration in one place',
        value: 'Align your team on priorities, track campaign progress in real-time, and never miss a deadline',
        image: workManagementImage,
        useCases: [
          'Campaign planning & execution',
          'Content calendar management',
          'Marketing team collaboration',
          'Budget tracking & allocation',
          'Creative asset management'
        ],
        replacesTools: [
          { name: 'Asana', color: '#f06a6a' },
          { name: 'CoSchedule', color: '#e07c5f' }
        ]
      },
      { 
        name: 'CRM', 
        description: 'Connect marketing efforts directly to revenue with full visibility into the customer journey',
        value: 'Track lead quality, measure campaign ROI, and seamlessly hand off qualified leads to sales',
        image: crmImage,
        useCases: [
          'Lead scoring & qualification',
          'Marketing attribution tracking',
          'Customer journey mapping',
          'Campaign ROI analysis',
          'Marketing-to-sales handoff'
        ],
        replacesTools: [
          { name: 'HubSpot Marketing Hub', color: '#FF7A59' },
          { name: 'Marketo', color: '#5C4C9F' },
          { name: 'Pardot', color: '#009EDB' }
        ]
      },
      {
        name: 'Campaigns',
        description: 'Create, launch, and optimize multi-channel marketing campaigns with AI-powered automation',
        value: 'Drive 40% more engagement with personalized campaigns that adapt in real-time to audience behavior',
        image: campaignsImage,
        useCases: [
          'Multi-channel campaign orchestration',
          'Email & social media automation',
          'A/B testing & optimization',
          'Personalized content delivery',
          'Real-time performance analytics'
        ],
        replacesTools: [
          { name: 'HubSpot Marketing Hub', color: '#FF7A59' },
          { name: 'Marketo', color: '#5C4C9F' },
          { name: 'Pardot', color: '#009EDB' }
        ]
      }
    ],
    agents: [
      { 
        name: 'Content Creator', 
        description: 'Automatically generates campaign briefs, ad copy, email content, and social posts tailored to your brand voice',
        value: 'Create months of content in minutes - save 10+ hours per week on content creation',
        image: agentImage3
      },
      { 
        name: 'Campaign Manager', 
        description: 'Monitors campaign performance, auto-optimizes budgets, and provides actionable recommendations',
        value: 'Increase campaign ROI by 30% with AI that never sleeps and continuously optimizes your spend',
        image: agentImage2
      }
    ],
    sidekickCapabilities: [
      { 
        name: 'Generate campaign briefs', 
        description: 'AI assistant that creates comprehensive campaign briefs with target audience insights, key messaging, and channel recommendations', 
        value: 'Launch campaigns 3x faster with AI-generated briefs that include audience research, competitive analysis, and creative direction',
        image: generateCampaignBriefsImage
      },
      { 
        name: 'Market Intelligence', 
        description: 'AI-powered competitive intelligence that tracks market trends, analyzes competitor campaigns, and identifies opportunities', 
        value: 'Stay ahead of the competition with real-time market insights and data-driven recommendations for your next move',
        image: marketIntelligenceImage
      },
      { 
        name: 'Visual creation', 
        description: 'AI-powered image and graphic generator that creates on-brand visuals for social media, ads, and marketing materials', 
        value: 'Create stunning visuals in seconds - generate on-brand images, social posts, and ad creatives without a designer',
        image: visualCreationImage
      }
    ],
    vibeApps: [
      { 
        name: 'Campaign health tracker', 
        icon: BarChart, 
        value: 'Analyze real-time marketing campaign performance and ROI',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Campaign_health_tracker.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Google Analytics', 'HubSpot'] 
      },
      { 
        name: 'Social media content calendar', 
        icon: CalendarCheck, 
        value: 'Plan, create, and schedule social media content effortlessly',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Social_media_content_calendar.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Hootsuite', 'Buffer', 'Sprout Social'] 
      },
      { 
        name: 'Customer segmentation app', 
        icon: UsersRound, 
        value: 'Automatically segment customers based on behavior and demographics',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Customer_segmentation_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['HubSpot', 'Marketo', 'Segment'] 
      },
      { 
        name: 'Build your own', 
        icon: Sparkles, 
        value: 'Create custom marketing apps with just a prompt',
        url: 'https://monday.com/vibe',
        replacesTools: [] 
      }
    ],
    values: [
      { 
        icon: TrendingUp, 
        title: 'Drive Demand Generation', 
        description: 'AI-powered campaigns that generate qualified leads and accelerate pipeline growth', 
        supportedBy: ['WM', 'CRM', 'Campaigns', 'Agents'],
        replacesTools: ['HubSpot Marketing Hub', 'Marketo', 'Pardot']
      },
      { 
        icon: Target, 
        title: 'Faster Campaign Execution', 
        description: 'Launch campaigns 3x faster with AI agents handling routine tasks and optimization', 
        supportedBy: ['WM', 'CRM', 'Campaigns', 'Agents', 'Sidekick'],
        replacesTools: ['Asana', 'Monday.com Marketing', 'CoSchedule']
      },
      { 
        icon: Sparkles, 
        title: 'Personalized Content at Scale', 
        description: 'Create tailored content for every audience segment with AI-powered generation', 
        supportedBy: ['WM', 'Campaigns', 'Agents', 'Sidekick'],
        replacesTools: ['Copy.ai', 'Jasper', 'ContentBot']
      },
      { 
        icon: Users, 
        title: 'Unified Customer Journey', 
        description: 'Connect marketing to sales with seamless handoffs and shared context', 
        supportedBy: ['WM', 'CRM'],
        replacesTools: ['Salesforce', 'HubSpot CRM']
      },
      { 
        icon: Clock, 
        title: 'Real-time Performance Insights', 
        description: 'Make data-driven decisions with AI analyzing campaign metrics instantly', 
        supportedBy: ['WM', 'CRM', 'Campaigns', 'Sidekick'],
        replacesTools: ['Google Analytics', 'Tableau', 'Looker']
      }
    ]
  },
  sales: {
    products: [
      { 
        name: 'CRM', 
        description: 'Manage your sales pipeline, track customer interactions, and automate follow-ups',
        value: 'Close deals faster, improve win rates, and ensure every customer interaction is captured',
        image: crmImage,
        useCases: [
          'Pipeline & deal management',
          'Lead tracking & qualification',
          'Sales forecasting & analytics',
          'Account & contact management',
          'Sales activity tracking'
        ],
        replacesTools: [
          { name: 'Salesforce', color: 'from-blue-500/20 to-blue-500/5' },
          { name: 'Pipedrive', color: 'from-green-500/20 to-green-500/5' },
          { name: 'Close', color: 'from-red-500/20 to-red-500/5' }
        ]
      }
    ],
    agents: [
      { 
        name: 'SDR Agent', 
        description: 'Handles initial outreach, qualification, and scheduling for sales development representatives',
        value: 'Scale your SDR efforts with AI that handles the heavy lifting, freeing up your team to focus on closing deals',
        image: salesAgent1
      },
      { 
        name: 'Deal Closer', 
        description: 'Manages follow-ups, pipeline updates, and provides insights to close deals more efficiently',
        value: 'Close deals 20% faster with AI that handles routine tasks and provides data-driven recommendations',
        image: salesAgent2
      }
    ],
    sidekickCapabilities: [
      { 
        name: 'Auto-update CRM fields', 
        description: 'Extracts key information from calls and emails to automatically populate CRM fields with deal details, next steps, and contact data', 
        value: 'Save 5+ hours per week - AI eliminates manual CRM data entry by capturing every deal detail automatically'
      },
      { 
        name: 'Generate follow-up emails', 
        description: 'Creates personalized follow-up emails based on previous conversations, prospect behavior, and deal stage', 
        value: 'Respond to prospects 10x faster with AI-generated emails tailored to each conversation and perfectly timed'
      },
      { 
        name: 'Summarize sales calls', 
        description: 'Transcribes and summarizes sales calls with action items, key objections, and buying signals highlighted', 
        value: 'Never miss a detail - AI provides instant call summaries with actionable insights to move deals forward'
      }
    ],
    vibeApps: [
      { 
        name: 'Deal flow analyzer', 
        icon: TrendingUpDown, 
        value: 'Visualize and optimize your deal pipeline in real-time',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Deal_flow_analyzer.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Salesforce', 'Pipedrive', 'Close'] 
      },
      { 
        name: 'Sales forecasting app', 
        icon: BarChart3, 
        value: 'Predict revenue and track quota attainment with AI',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_forecasting_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Clari', 'Gong Forecast', 'InsightSquared'] 
      },
      { 
        name: 'Account portfolio tracker', 
        icon: Briefcase, 
        value: 'Manage and nurture your key accounts effectively',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Account_portfolio_tracker.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Gainsight', 'ChurnZero', 'Salesforce'] 
      },
      { 
        name: 'Sales commission calculator', 
        icon: Calculator, 
        value: 'Automate commission calculations and payouts',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_commission_calculator.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Spiff', 'CaptivateIQ', 'Xactly'] 
      },
      { 
        name: 'Build your own', 
        icon: Sparkles, 
        value: 'Create custom sales apps with just a prompt',
        url: 'https://monday.com/vibe',
        replacesTools: [] 
      }
    ],
    values: [
      { icon: TrendingUp, title: 'Accelerate Deal Velocity', description: 'Close deals faster with AI agents managing follow-ups and pipeline updates', supportedBy: ['CRM', 'Agents', 'Sidekick'] },
      { icon: Target, title: 'Increase Win Rates', description: 'AI-powered insights help you focus on the highest-value opportunities', supportedBy: ['CRM', 'Sidekick'] },
      { icon: Users, title: 'Connected Customer Journey', description: 'Seamless handoffs from marketing to sales to support with unified context', supportedBy: ['CRM'] },
      { icon: Sparkles, title: 'Intelligent Lead Scoring', description: 'AI automatically prioritizes leads based on conversion likelihood', supportedBy: ['CRM', 'Agents'] },
      { icon: Clock, title: 'Automated Outreach', description: 'SDR agents handle initial outreach and qualification at scale', supportedBy: ['CRM', 'Agents', 'Sidekick'] }
    ]
  },
  operations: {
    products: [
      { 
        name: 'Work Management', 
        description: 'Manage all your operations, projects, and team collaboration in one place',
        value: 'Align your team on priorities, track project progress in real-time, and never miss a deadline',
        image: workManagementImage,
        useCases: [
          'Project & portfolio management',
          'Resource planning & allocation',
          'Process automation & optimization',
          'Cross-functional team collaboration',
          'Operational KPI tracking'
        ],
        replacesTools: [
          { name: 'Asana', color: 'from-blue-500/20 to-blue-500/5' },
          { name: 'Trello', color: 'from-green-500/20 to-green-500/5' },
          { name: 'Basecamp', color: 'from-red-500/20 to-red-500/5' }
        ]
      }
    ],
    agents: [
      { 
        name: 'Process Optimizer', 
        description: 'Automates routine tasks, optimizes workflows, and identifies bottlenecks',
        value: 'Reduce operational overhead by 40% with intelligent process automation'
      },
      { 
        name: 'Data Analyst', 
        description: 'Surfaces insights from operational data in real-time, helping you make data-driven decisions',
        value: 'AI analysts provide real-time insights, helping you identify trends and opportunities'
      }
    ],
    sidekickCapabilities: [
      { name: 'Auto-assign tasks by capacity', description: 'Automatically assign tasks based on team capacity', value: 'Optimize task distribution' },
      { name: 'Generate status reports', description: 'Automatically generate status reports', value: 'Improve visibility' },
      { name: 'Identify bottlenecks', description: 'Automatically identify bottlenecks in workflows', value: 'Enhance efficiency' }
    ],
    vibeApps: [
      { 
        name: 'Supply chain tracker', 
        icon: ListChecks, 
        value: 'Monitor and optimize your supply chain in real-time',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Supply_chain_tracker.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['SAP', 'Oracle SCM', 'Kinaxis'] 
      },
      { 
        name: 'OKR monitoring app', 
        icon: Target, 
        value: 'Track objectives and key results across the organization',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/OKR_monitoring_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Lattice', 'Workboard', '15Five'] 
      },
      { 
        name: 'Executive overview app', 
        icon: LineChart, 
        value: 'Executive dashboard with KPIs and performance metrics',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Tableau', 'Power BI', 'Looker'] 
      },
      { 
        name: 'Build your own', 
        icon: Sparkles, 
        value: 'Create custom operations apps with just a prompt',
        url: 'https://monday.com/vibe',
        replacesTools: [] 
      }
    ],
    values: [
      { icon: Zap, title: 'Streamlined Operations', description: 'AI agents automate routine tasks and optimize workflows across teams', supportedBy: ['WM', 'Agents', 'Sidekick'] },
      { icon: Target, title: 'Improved Efficiency', description: 'Reduce operational overhead by 40% with intelligent process automation', supportedBy: ['WM', 'Agents'] },
      { icon: Link2, title: 'Cross-functional Alignment', description: 'Keep all teams in sync with unified workflows and shared context', supportedBy: ['WM'] },
      { icon: TrendingUp, title: 'Data-driven Decisions', description: 'AI analysts surface insights from operational data in real-time', supportedBy: ['WM', 'Agents', 'Sidekick'] },
      { icon: Shield, title: 'Risk Mitigation', description: 'Proactively identify and resolve bottlenecks before they impact delivery', supportedBy: ['WM', 'Agents'] }
    ]
  },
  support: {
    products: [
      { 
        name: 'Service', 
        description: 'Deliver exceptional customer service with AI-powered ticket management and automation',
        value: 'Resolve tickets 50% faster, improve CSAT scores, and reduce support costs',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxjdXN0b21lciUyMHN1cHBvcnQlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzY5MjkwNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        useCases: [
          'Ticket management & routing',
          'Customer support automation',
          'SLA tracking & compliance',
          'Knowledge base integration',
          'Multi-channel support (email, chat, phone)'
        ],
        replacesTools: [
          { name: 'Zendesk', color: 'from-blue-500/20 to-blue-500/5' },
          { name: 'Freshdesk', color: 'from-green-500/20 to-green-500/5' },
          { name: 'Salesforce Service Cloud', color: 'from-red-500/20 to-red-500/5' }
        ]
      }
    ],
    agents: [
      { 
        name: 'Support Agent', 
        description: 'Handles tier-1 support, providing quick and accurate responses to customer inquiries',
        value: 'AI agents handle tier-1 support, letting your team focus on complex issues'
      },
      { 
        name: 'Ticket Router', 
        description: 'Automatically categorizes tickets, routes them to the right agent, and provides response templates',
        value: 'Reduce ticket resolution time by 60% with intelligent routing and automation'
      }
    ],
    sidekickCapabilities: [
      { name: 'Auto-categorize tickets', description: 'Automatically categorize customer support tickets', value: 'Improve ticket management' },
      { name: 'Generate response templates', description: 'Automatically generate response templates', value: 'Enhance communication' },
      { name: 'Summarize customer history', description: 'Automatically summarize customer history', value: 'Improve insights' }
    ],
    vibeApps: [
      { 
        name: 'Ticket Management', 
        icon: Ticket, 
        value: 'Track and manage customer support tickets efficiently',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Event_portal.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Zendesk', 'Freshdesk', 'Salesforce Service Cloud'] 
      },
      { 
        name: 'Customer Support Automation', 
        icon: MessageSquare, 
        value: 'Automate routine support tasks and responses',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Customer_segmentation_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Intercom', 'Drift', 'Zendesk'] 
      },
      { 
        name: 'Build your own', 
        icon: Sparkles, 
        value: 'Create custom support apps with just a prompt',
        url: 'https://monday.com/vibe',
        replacesTools: [] 
      }
    ],
    values: [
      { icon: Users, title: 'Exceptional Service at Scale', description: 'AI agents handle tier-1 support, letting your team focus on complex issues', supportedBy: ['Service', 'Agents'] },
      { icon: Clock, title: 'Faster Resolution Times', description: 'Reduce ticket resolution time by 60% with intelligent routing and automation', supportedBy: ['Service', 'Agents', 'Sidekick'] },
      { icon: Sparkles, title: 'Proactive Support', description: 'AI predicts and prevents issues before customers even report them', supportedBy: ['Service', 'Agents'] },
      { icon: Target, title: 'Higher CSAT Scores', description: 'Deliver personalized support experiences that delight customers', supportedBy: ['Service', 'Sidekick'] },
      { icon: Link2, title: 'Unified Customer Context', description: 'Every agent has complete customer history and context instantly', supportedBy: ['Service'] }
    ]
  },
  product: {
    products: [
      { 
        name: 'Dev', 
        description: 'Manage development workflows, automate code reviews, and generate PR descriptions',
        value: 'Ship features 2x faster with AI-powered development workflows',
        useCases: [
          'Code review automation',
          'Pull request management',
          'Sprint planning & tracking',
          'CI/CD pipeline optimization',
          'Technical debt tracking'
        ],
        replacesTools: [
          { name: 'GitHub Actions', color: 'from-blue-500/20 to-blue-500/5' },
          { name: 'Jenkins', color: 'from-green-500/20 to-green-500/5' },
          { name: 'GitLab CI/CD', color: 'from-red-500/20 to-red-500/5' }
        ]
      },
      { 
        name: 'Work Management', 
        description: 'Manage all your product development, projects, and team collaboration in one place',
        value: 'Align your team on priorities, track project progress in real-time, and never miss a deadline',
        image: workManagementImage,
        useCases: [
          'Product roadmap planning',
          'Feature prioritization',
          'Cross-team coordination',
          'Release management',
          'Product analytics tracking'
        ],
        replacesTools: [
          { name: 'Jira', color: 'from-blue-500/20 to-blue-500/5' },
          { name: 'Trello', color: 'from-green-500/20 to-green-500/5' },
          { name: 'Monday.com', color: 'from-red-500/20 to-red-500/5' }
        ]
      }
    ],
    agents: [
      { 
        name: 'Code Reviewer', 
        description: 'Automatically catches bugs and suggests improvements in code reviews',
        value: 'Better code quality with AI that catches bugs and suggests improvements automatically'
      },
      { 
        name: 'Sprint Planner', 
        description: 'Automatically creates sprint tasks and generates PR descriptions',
        value: 'Build anything with AI agents that help you create custom tools and integrations without limits'
      }
    ],
    sidekickCapabilities: [
      { name: 'Auto-create sprint tasks', description: 'Automatically create sprint tasks', value: 'Streamline sprint planning' },
      { name: 'Generate PR descriptions', description: 'Automatically generate PR descriptions', value: 'Enhance communication' },
      { name: 'Summarize code reviews', description: 'Automatically summarize code reviews', value: 'Improve insights' }
    ],
    vibeApps: [
      { 
        name: 'Time tracking app', 
        icon: Clock, 
        value: 'Track time spent on projects and features',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Time_tracking_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Toggl', 'Harvest', 'Clockify'] 
      },
      { 
        name: 'Sprint Management', 
        icon: ListChecks, 
        value: 'Plan and track sprints efficiently',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/OKR_monitoring_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Jira', 'Linear', 'Shortcut'] 
      },
      { 
        name: 'Build your own', 
        icon: Sparkles, 
        value: 'Create custom product development apps with just a prompt',
        url: 'https://monday.com/vibe',
        replacesTools: [] 
      }
    ],
    values: [
      { icon: Zap, title: 'Faster Time to Market', description: 'Ship features 2x faster with AI-powered development workflows', supportedBy: ['Dev', 'WM', 'Agents', 'Sidekick'] },
      { icon: Sparkles, title: 'Build Anything', description: 'AI agents help you create custom tools and integrations without limits', supportedBy: ['Dev', 'WM', 'Agents'] },
      { icon: Target, title: 'Better Code Quality', description: 'AI code reviewers catch bugs and suggest improvements automatically', supportedBy: ['Dev', 'Agents'] },
      { icon: Link2, title: 'Seamless Collaboration', description: 'Align product, design, and engineering with unified workflows', supportedBy: ['Dev', 'WM', 'Sidekick'] },
      { icon: TrendingUp, title: 'Data-driven Roadmaps', description: 'AI analyzes user feedback and metrics to prioritize features', supportedBy: ['Dev', 'WM', 'Sidekick'] }
    ]
  },
  legal: {
    products: [
      { 
        name: 'Work Management', 
        description: 'Manage all your legal workflows, projects, and team collaboration in one place',
        value: 'Align your team on priorities, track project progress in real-time, and never miss a deadline',
        image: workManagementImage,
        useCases: [
          'Contract lifecycle management',
          'Legal request tracking',
          'Compliance project management',
          'Matter management',
          'Legal team collaboration'
        ],
        replacesTools: [
          { name: 'DocuSign', color: 'from-blue-500/20 to-blue-500/5' },
          { name: 'Adobe Sign', color: 'from-green-500/20 to-green-500/5' },
          { name: 'Salesforce Contract Management', color: 'from-red-500/20 to-red-500/5' }
        ]
      }
    ],
    agents: [
      { 
        name: 'Contract Reviewer', 
        description: 'Automatically reviews contracts for compliance issues and flags risky clauses',
        value: 'Review and approve contracts 5x faster with AI-powered analysis'
      },
      { 
        name: 'Compliance Monitor', 
        description: 'Monitors contracts and documents for compliance issues automatically',
        value: 'Ensure compliance with AI that monitors contracts and documents for compliance issues automatically'
      }
    ],
    sidekickCapabilities: [
      { name: 'Auto-route contracts for approval', description: 'Automatically route contracts for approval', value: 'Streamline contract management' },
      { name: 'Flag risky clauses', description: 'Automatically flag risky clauses in contracts', value: 'Enhance compliance' },
      { name: 'Generate compliance checklists', description: 'Automatically generate compliance checklists', value: 'Improve visibility' }
    ],
    vibeApps: [
      { 
        name: 'Contract Management', 
        icon: Gavel, 
        value: 'Manage and track legal contracts efficiently',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['DocuSign', 'Ironclad', 'ContractPodAi'] 
      },
      { 
        name: 'Compliance Monitoring', 
        icon: Scale, 
        value: 'Monitor compliance status and requirements',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/OKR_monitoring_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Drata', 'Vanta', 'OneTrust'] 
      },
      { 
        name: 'Build your own', 
        icon: Sparkles, 
        value: 'Create custom legal apps with just a prompt',
        url: 'https://monday.com/vibe',
        replacesTools: [] 
      }
    ],
    values: [
      { icon: Shield, title: 'Ensure Compliance', description: 'AI monitors contracts and documents for compliance issues automatically', supportedBy: ['WM', 'Agents'] },
      { icon: Clock, title: 'Faster Contract Review', description: 'Review and approve contracts 5x faster with AI-powered analysis', supportedBy: ['WM', 'Agents', 'Sidekick'] },
      { icon: Target, title: 'Risk Management', description: 'Identify potential legal risks before they become problems', supportedBy: ['WM', 'Agents'] },
      { icon: Link2, title: 'Cross-team Visibility', description: 'Keep legal connected to all business units with unified workflows', supportedBy: ['WM'] },
      { icon: Sparkles, title: 'Intelligent Document Search', description: 'Find any clause or precedent instantly with AI-powered search', supportedBy: ['WM', 'Sidekick'] }
    ]
  },
  finance: {
    products: [
      { 
        name: 'Work Management', 
        description: 'Manage all your financial workflows, projects, and team collaboration in one place',
        value: 'Align your team on priorities, track project progress in real-time, and never miss a deadline',
        image: workManagementImage,
        useCases: [
          'Financial planning & budgeting',
          'Invoice processing & reconciliation',
          'Month-end & year-end close',
          'Expense tracking & approval',
          'Financial reporting & analytics'
        ],
        replacesTools: [
          { name: 'QuickBooks', color: 'from-blue-500/20 to-blue-500/5' },
          { name: 'Xero', color: 'from-green-500/20 to-green-500/5' },
          { name: 'Sage', color: 'from-red-500/20 to-red-500/5' }
        ]
      }
    ],
    agents: [
      { 
        name: 'Budget Tracker', 
        description: 'Automatically reconciles invoices and generates budget reports',
        value: 'Close books 50% faster with automated reconciliation and reporting'
      },
      { 
        name: 'Invoice Processor', 
        description: 'Automatically reconciles invoices and flags spending anomalies',
        value: 'AI monitors transactions and flags anomalies for review'
      }
    ],
    sidekickCapabilities: [
      { name: 'Auto-reconcile invoices', description: 'Automatically reconcile invoices', value: 'Streamline financial management' },
      { name: 'Generate budget reports', description: 'Automatically generate budget reports', value: 'Improve visibility' },
      { name: 'Flag spending anomalies', description: 'Automatically flag spending anomalies', value: 'Enhance compliance' }
    ],
    vibeApps: [
      { 
        name: 'Invoice Management', 
        icon: Receipt, 
        value: 'Automate invoice processing and reconciliation',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Sales_commission_calculator.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['QuickBooks', 'Bill.com', 'Tipalti'] 
      },
      { 
        name: 'Budget Tracking', 
        icon: Wallet, 
        value: 'Track and manage budgets in real-time',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Executive_overview_app.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Adaptive Planning', 'Anaplan', 'Planful'] 
      },
      { 
        name: 'Build your own', 
        icon: Sparkles, 
        value: 'Create custom finance apps with just a prompt',
        url: 'https://monday.com/vibe',
        replacesTools: [] 
      }
    ],
    values: [
      { icon: TrendingUp, title: 'Financial Accuracy', description: 'AI eliminates manual errors in budgeting and financial reporting', supportedBy: ['WM', 'Agents'] },
      { icon: Clock, title: 'Faster Close Cycles', description: 'Close books 50% faster with automated reconciliation and reporting', supportedBy: ['WM', 'Agents', 'Sidekick'] },
      { icon: Target, title: 'Budget Optimization', description: 'AI analyzes spending patterns and suggests optimization opportunities', supportedBy: ['WM', 'Sidekick'] },
      { icon: Link2, title: 'Real-time Visibility', description: 'Give stakeholders instant access to financial metrics and forecasts', supportedBy: ['WM', 'Sidekick'] },
      { icon: Shield, title: 'Fraud Detection', description: 'AI monitors transactions and flags anomalies for review', supportedBy: ['WM', 'Agents'] }
    ]
  },
  hr: {
    products: [
      { 
        name: 'Work Management', 
        description: 'Manage all your HR workflows, projects, and team collaboration in one place',
        value: 'Align your team on priorities, track project progress in real-time, and never miss a deadline',
        image: workManagementImage,
        useCases: [
          'Recruitment & candidate tracking',
          'Onboarding workflow management',
          'Employee lifecycle management',
          'Performance review coordination',
          'HR team collaboration'
        ],
        replacesTools: [
          { name: 'Greenhouse', color: 'from-blue-500/20 to-blue-500/5' },
          { name: 'Workday', color: 'from-green-500/20 to-green-500/5' },
          { name: 'LinkedIn Recruiter', color: 'from-red-500/20 to-red-500/5' }
        ]
      }
    ],
    agents: [
      { 
        name: 'Recruiter', 
        description: 'Automatically screens candidates and schedules interviews',
        value: 'Reduce time-to-hire by 40% with AI-powered screening and scheduling'
      },
      { 
        name: 'Onboarding Specialist', 
        description: 'Guides new hires through onboarding, answering questions 24/7',
        value: 'Seamless onboarding with AI agents that guide new hires through onboarding, answering questions 24/7'
      }
    ],
    sidekickCapabilities: [
      { name: 'Auto-schedule interviews', description: 'Automatically schedule interviews', value: 'Streamline recruitment' },
      { name: 'Generate job descriptions', description: 'Automatically generate job descriptions', value: 'Enhance communication' },
      { name: 'Create onboarding checklists', description: 'Automatically create onboarding checklists', value: 'Improve visibility' }
    ],
    vibeApps: [
      { 
        name: 'Organizational chart', 
        icon: UsersRound, 
        value: 'Visualize your company structure and reporting lines',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Organizational_chart.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Lucidchart', 'Pingboard', 'ChartHop'] 
      },
      { 
        name: 'Employee resource portal', 
        icon: IdCard, 
        value: 'Centralized hub for employee information and resources',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Employee_resource_portal.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['Confluence', 'Notion', 'SharePoint'] 
      },
      { 
        name: 'Onboarding Management', 
        icon: ClipboardCheck, 
        value: 'Streamline new hire onboarding experience',
        image: 'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/Generator_featured%20images/Monday%20Vibe/Event_portal.svg',
        url: 'https://monday.com/vibe',
        replacesTools: ['BambooHR', 'Rippling', 'Gusto'] 
      },
      { 
        name: 'Build your own', 
        icon: Sparkles, 
        value: 'Create custom HR apps with just a prompt',
        url: 'https://monday.com/vibe',
        replacesTools: [] 
      }
    ],
    values: [
      { icon: Users, title: 'Better Candidate Experience', description: 'AI agents provide personalized communication throughout the hiring process', supportedBy: ['WM', 'Agents', 'Sidekick'] },
      { icon: Clock, title: 'Faster Hiring', description: 'Reduce time-to-hire by 40% with AI-powered screening and scheduling', supportedBy: ['WM', 'Agents'] },
      { icon: Sparkles, title: 'Seamless Onboarding', description: 'AI agents guide new hires through onboarding, answering questions 24/7', supportedBy: ['WM', 'Agents', 'Sidekick'] },
      { icon: Target, title: 'Employee Engagement', description: 'Proactively identify and address employee satisfaction issues', supportedBy: ['WM', 'Sidekick'] },
      { icon: Link2, title: 'Lifecycle Management', description: 'Manage the entire employee journey from hire to retire in one platform', supportedBy: ['WM'] }
    ]
  }
};

// Departments list
const departmentsList = [
  {
    id: 'marketing' as Department,
    title: 'Marketing',
    desc: 'Drive demand generation and accelerate campaign execution',
    avatarImage: imgAvatar2,
    avatarBgColor: '#97aeff'
  },
  {
    id: 'sales' as Department,
    title: 'Sales',
    desc: 'Close deals faster and increase win rates with AI-powered CRM',
    avatarImage: imgAvatar3,
    avatarBgColor: '#ffc875'
  },
  {
    id: 'operations' as Department,
    title: 'Operations',
    desc: 'Streamline operations and improve efficiency across teams',
    avatarImage: imgAvatar1,
    avatarBgColor: '#ff5ac4'
  },
  {
    id: 'support' as Department,
    title: 'Customer Support',
    desc: 'Deliver exceptional service with AI-powered ticket management',
    avatarImage: imgAvatar4,
    avatarBgColor: '#ff7575'
  },
  {
    id: 'product' as Department,
    title: 'Product & Engineering',
    desc: 'Ship features faster with AI-powered development workflows',
    avatarImage: imgAvatar5,
    avatarBgColor: '#a358d1'
  },
  {
    id: 'legal' as Department,
    title: 'Legal',
    desc: 'Ensure compliance and review contracts 5x faster with AI',
    avatarImage: imgAvatar6,
    avatarBgColor: '#5ac4a3'
  },
  {
    id: 'finance' as Department,
    title: 'Finance',
    desc: 'Close books faster with automated reconciliation and reporting',
    avatarImage: imgAvatar7,
    avatarBgColor: '#ff9a6c'
  },
  {
    id: 'hr' as Department,
    title: 'Human Resources',
    desc: 'Reduce time-to-hire and improve employee experience with AI',
    avatarImage: imgAvatar8,
    avatarBgColor: '#6fcfed'
  }
];

// Pain Points list
const painPointsList = [
  {
    id: 'slow-campaigns' as Department,
    title: 'Slow Campaign Execution',
    desc: 'Speed up campaign launches from weeks to days with AI automation',
    avatarImage: imgAvatar2,
    avatarBgColor: '#97aeff'
  },
  {
    id: 'low-conversion' as Department,
    title: 'Low Deal Conversion Rates',
    desc: 'Increase win rates with AI-powered sales intelligence and automation',
    avatarImage: imgAvatar3,
    avatarBgColor: '#ffc875'
  },
  {
    id: 'manual-processes' as Department,
    title: 'Too Many Manual Processes',
    desc: 'Eliminate repetitive tasks with intelligent workflow automation',
    avatarImage: imgAvatar1,
    avatarBgColor: '#ff5ac4'
  },
  {
    id: 'slow-response' as Department,
    title: 'Slow Customer Response Times',
    desc: 'Resolve tickets 60% faster with AI agents handling tier-1 support',
    avatarImage: imgAvatar4,
    avatarBgColor: '#ff7575'
  },
  {
    id: 'delayed-releases' as Department,
    title: 'Delayed Product Releases',
    desc: 'Ship features 2x faster with AI-powered development workflows',
    avatarImage: imgAvatar5,
    avatarBgColor: '#a358d1'
  },
  {
    id: 'compliance-risk' as Department,
    title: 'Compliance & Risk Management',
    desc: 'Ensure compliance with AI monitoring contracts automatically',
    avatarImage: imgAvatar6,
    avatarBgColor: '#5ac4a3'
  },
  {
    id: 'financial-errors' as Department,
    title: 'Financial Errors & Delays',
    desc: 'Close books 50% faster with automated reconciliation',
    avatarImage: imgAvatar7,
    avatarBgColor: '#ff9a6c'
  },
  {
    id: 'slow-hiring' as Department,
    title: 'Slow Hiring Process',
    desc: 'Reduce time-to-hire by 40% with AI-powered screening',
    avatarImage: imgAvatar8,
    avatarBgColor: '#6fcfed'
  }
];

// Business Outcomes list
const businessOutcomesList = [
  {
    id: 'drive-demand' as Department,
    title: 'Drive Demand Generation',
    desc: 'AI-powered campaigns that generate qualified leads faster',
    avatarImage: imgAvatar2,
    avatarBgColor: '#97aeff'
  },
  {
    id: 'increase-revenue' as Department,
    title: 'Increase Revenue & Win Rates',
    desc: 'Close more deals with AI that accelerates sales cycles',
    avatarImage: imgAvatar3,
    avatarBgColor: '#ffc875'
  },
  {
    id: 'improve-efficiency' as Department,
    title: 'Improve Operational Efficiency',
    desc: 'Reduce operational overhead by 40% with AI automation',
    avatarImage: imgAvatar1,
    avatarBgColor: '#ff5ac4'
  },
  {
    id: 'boost-satisfaction' as Department,
    title: 'Boost Customer Satisfaction',
    desc: 'Deliver exceptional service that delights customers',
    avatarImage: imgAvatar4,
    avatarBgColor: '#ff7575'
  },
  {
    id: 'accelerate-innovation' as Department,
    title: 'Accelerate Innovation',
    desc: 'Ship products faster and stay ahead of competition',
    avatarImage: imgAvatar5,
    avatarBgColor: '#a358d1'
  },
  {
    id: 'ensure-compliance' as Department,
    title: 'Ensure Compliance & Reduce Risk',
    desc: 'AI-powered compliance monitoring and risk management',
    avatarImage: imgAvatar6,
    avatarBgColor: '#5ac4a3'
  },
  {
    id: 'optimize-finances' as Department,
    title: 'Optimize Financial Performance',
    desc: 'Real-time insights and automated workflows for finance',
    avatarImage: imgAvatar7,
    avatarBgColor: '#ff9a6c'
  },
  {
    id: 'attract-talent' as Department,
    title: 'Attract & Retain Top Talent',
    desc: 'AI-powered HR that empowers your people',
    avatarImage: imgAvatar8,
    avatarBgColor: '#6fcfed'
  }
];

// AI Transformation list
const aiTransformationList = [
  {
    id: 'scale-operations' as Department,
    title: 'Scale Operations Without Headcount',
    desc: 'Handle 3x the workload with AI agents automating repetitive tasks',
    avatarImage: imgAvatar1,
    avatarBgColor: '#ff5ac4'
  },
  {
    id: 'reduce-costs' as Department,
    title: 'Reduce Operational Costs',
    desc: 'Cut costs by 40% by replacing legacy tools with AI-powered platform',
    avatarImage: imgAvatar7,
    avatarBgColor: '#ff9a6c'
  },
  {
    id: 'improve-decision' as Department,
    title: 'Data-Driven Decision Making',
    desc: 'Make faster, smarter decisions with real-time AI insights',
    avatarImage: imgAvatar1,
    avatarBgColor: '#ff5ac4'
  },
  {
    id: 'enhance-cx' as Department,
    title: 'Transform Customer Experience',
    desc: 'Deliver personalized experiences at scale with AI automation',
    avatarImage: imgAvatar4,
    avatarBgColor: '#ff7575'
  },
  {
    id: 'accelerate-growth' as Department,
    title: 'Accelerate Revenue Growth',
    desc: 'Drive 30% more revenue with AI-optimized sales and marketing',
    avatarImage: imgAvatar3,
    avatarBgColor: '#ffc875'
  },
  {
    id: 'future-proof' as Department,
    title: 'Future-Proof Your Business',
    desc: 'Stay competitive with a platform that evolves with AI advances',
    avatarImage: imgAvatar5,
    avatarBgColor: '#a358d1'
  },
  {
    id: 'unify-tools' as Department,
    title: 'Consolidate Tool Stack',
    desc: 'Replace 10+ tools with one AI-powered platform',
    avatarImage: imgAvatar2,
    avatarBgColor: '#97aeff'
  },
  {
    id: 'empower-teams' as Department,
    title: 'Empower Every Team with AI',
    desc: 'Give every employee AI superpowers to work smarter',
    avatarImage: imgAvatar8,
    avatarBgColor: '#6fcfed'
  }
];

// Icon name to component mapping
const iconMap: Record<string, any> = {
  'TrendingUp': TrendingUp,
  'BarChart3': BarChart3,
  'Users': Users,
  'Mail': Mail,
  'Award': Award,
  'MessageSquare': MessageSquare,
  'Sparkles': Sparkles,
  'Share2': Share2,
  'Calendar': Calendar,
  'FolderKanban': FolderKanban,
  'Workflow': Workflow,
  'BarChart': BarChart,
  'Ticket': Ticket,
  'HeadphonesIcon': HeadphonesIcon,
  'Shield': Shield,
  'Code': Code,
  'Zap': Zap,
  'FileCheck': FileCheck,
  'Search': Search,
  'Receipt': Receipt,
  'DollarSign': DollarSign,
  'PieChart': PieChart,
  'UserPlus': UserPlus,
  'Briefcase': Briefcase,
  'UserCheck': UserCheck,
  'Target': Target,
  'Clock': Clock,
  'Star': Star,
  'Link2': Link2,
  'CalendarCheck': CalendarCheck,
  'UsersRound': UsersRound,
  'Send': Send,
  'FileText': FileText,
  'TrendingUpDown': TrendingUpDown,
  'Phone': Phone,
  'AlertCircle': AlertCircle,
  'GitBranch': GitBranch,
  'ListChecks': ListChecks,
  'Wrench': Wrench,
  'FileBarChart': FileBarChart,
  'Scale': Scale,
  'Gavel': Gavel,
  'FolderSearch': FolderSearch,
  'Calculator': Calculator,
  'Wallet': Wallet,
  'LineChart': LineChart,
  'UserSearch': UserSearch,
  'ClipboardCheck': ClipboardCheck,
  'IdCard': IdCard
};

// Helper function to get icon component from string name
const getIconComponent = (iconName: string | null | undefined): any => {
  if (!iconName) return Sparkles; // Default icon
  return iconMap[iconName] || Sparkles;
};

// Mapping from pain points and outcomes to departments
const selectionToDepartment: Record<string, Department> = {
  // Pain points
  'slow-campaigns': 'marketing',
  'low-conversion': 'sales',
  'manual-processes': 'operations',
  'slow-response': 'support',
  'delayed-releases': 'product',
  'compliance-risk': 'legal',
  'financial-errors': 'finance',
  'slow-hiring': 'hr',
  // Business outcomes
  'drive-demand': 'marketing',
  'increase-revenue': 'sales',
  'improve-efficiency': 'operations',
  'boost-satisfaction': 'support',
  'accelerate-innovation': 'product',
  'ensure-compliance': 'legal',
  'optimize-finances': 'finance',
  'attract-talent': 'hr',
  // AI Transformation
  'scale-operations': 'operations',
  'reduce-costs': 'finance',
  'improve-decision': 'operations',
  'enhance-cx': 'support',
  'accelerate-growth': 'sales',
  'future-proof': 'product',
  'unify-tools': 'operations',
  'empower-teams': 'hr',
};

// Props for page-level overrides (used when rendering as a homepage from Pages system)
interface AppProps {
  pageOverride?: {
    sections_visibility: Record<string, boolean>;
    sections_order: string[];
    hero_settings?: Record<string, any> | null;
  } | null;
  /** When set, renders only this single section (used for admin preview) */
  previewSection?: string | null;
}

export default function App({ pageOverride, previewSection }: AppProps = {}) {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('department');
  
  // Fetch departments from Supabase
  const { departments: supabaseDepartments, loading: departmentsLoading } = useDepartments();
  
  // Fetch site settings from Supabase
  const { settings: siteSettings, loading: siteSettingsLoading } = useSiteSettings();
  
  // Get business values from context
  const { getValuesForDepartment } = useBusinessValues();
  
  // Fetch department content when a department is selected
  const { 
    products: supabaseProducts, 
    agents: supabaseAgents, 
    vibeApps: supabaseVibeApps, 
    sidekickActions: supabaseSidekickActions,
    loading: contentLoading 
  } = useDepartmentData(selectedDepartmentId);
  
  // Map Supabase departments to the format expected by UI components
  const dynamicDepartmentsList = useMemo(() => {
    if (!supabaseDepartments || supabaseDepartments.length === 0) {
      return departmentsList; // Fallback to hardcoded if Supabase is empty
    }
    return supabaseDepartments.map(dept => ({
      id: dept.name as Department,
      title: dept.title,
      desc: dept.description,
      avatarImage: dept.avatar_image,
      avatarBgColor: dept.avatar_color,
      supabaseId: dept.id // Keep the Supabase ID for data fetching
    }));
  }, [supabaseDepartments]);
  
  // Map Supabase content to UI format
  const mappedProducts = useMemo(() => {
    if (!supabaseProducts || supabaseProducts.length === 0) {
      return selectedDepartment ? departmentSolutions[selectedDepartment]?.products || [] : [];
    }
    return supabaseProducts.map(p => ({
      name: p.name,
      description: p.description,
      value: p.value,
      image: p.image || undefined,
      useCases: p.use_cases || [],
      replacesTools: p.replaces_tools || []
    }));
  }, [supabaseProducts, selectedDepartment]);
  
  const mappedAgents = useMemo(() => {
    if (!supabaseAgents || supabaseAgents.length === 0) {
      return selectedDepartment ? departmentSolutions[selectedDepartment]?.agents || [] : [];
    }
    return supabaseAgents.map(a => ({
      name: a.name,
      description: a.description,
      value: a.value,
      image: a.image || undefined
    }));
  }, [supabaseAgents, selectedDepartment]);
  
  const mappedVibeApps = useMemo(() => {
    if (!supabaseVibeApps || supabaseVibeApps.length === 0) {
      return selectedDepartment ? departmentSolutions[selectedDepartment]?.vibeApps || [] : [];
    }
    return supabaseVibeApps.map(v => ({
      name: v.name,
      icon: getIconComponent(v.icon),
      value: v.value,
      replacesTools: v.replaces_tools || [],
      image: v.image || undefined
    }));
  }, [supabaseVibeApps, selectedDepartment]);
  
  const mappedSidekickActions = useMemo(() => {
    if (!supabaseSidekickActions || supabaseSidekickActions.length === 0) {
      return selectedDepartment ? departmentSolutions[selectedDepartment]?.sidekickCapabilities || [] : [];
    }
    return supabaseSidekickActions.map(s => ({
      name: s.name,
      description: s.description,
      value: s.value,
      image: s.image || undefined
    }));
  }, [supabaseSidekickActions, selectedDepartment]);

  const handleDepartmentSelect = (selectionId: string) => {
    // Check if it's a pain point or business outcome, map to department
    const mappedDepartment = selectionToDepartment[selectionId] || selectionId as Department;
    setSelectedDepartment(mappedDepartment);
    
    // Find the Supabase ID for this department
    const deptInfo = dynamicDepartmentsList.find(d => d.id === mappedDepartment);
    if (deptInfo && 'supabaseId' in deptInfo) {
      setSelectedDepartmentId((deptInfo as any).supabaseId);
    }
    
    setShowSolution(true);
    
    // Scroll to solution section
    setTimeout(() => {
      document.getElementById('solution-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };
  

  // Get the appropriate list based on selection mode
  const getDisplayList = () => {
    switch (selectionMode) {
      case 'pain':
        return painPointsList;
      case 'outcome':
        return businessOutcomesList;
      case 'transformation':
        return aiTransformationList;
      default:
        // Use dynamic departments from Supabase
        return dynamicDepartmentsList;
    }
  };

  // Show loading screen while site settings are being fetched
  // This prevents the "flash" of default values before Supabase data loads
  if (siteSettingsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  // Apply page overrides if provided (homepage from Pages system)
  // In preview mode, force all sections visible so the preview can render any section
  const effectiveVisibility = previewSection
    ? Object.fromEntries(Object.keys(siteSettings.sections_visibility).map(k => [k, true])) as typeof siteSettings.sections_visibility
    : pageOverride
      ? pageOverride.sections_visibility as typeof siteSettings.sections_visibility
      : siteSettings.sections_visibility;
  const effectiveOrder = pageOverride
    ? pageOverride.sections_order
    : siteSettings.sections_order;
  const effectiveHeroSettings = pageOverride?.hero_settings
    ? { ...siteSettings.hero_settings, ...pageOverride.hero_settings }
    : siteSettings.hero_settings;

  // Get hero font size based on effective settings
  const getHeroFontSize = () => {
    const sizes: Record<string, string> = {
      small: 'clamp(1.25rem, 3vw, 2rem)',
      medium: 'clamp(1.5rem, 4vw, 2.75rem)',
      large: 'clamp(1.875rem, 5vw, 3.75rem)',
      xlarge: 'clamp(2.25rem, 6vw, 4.5rem)',
    };
    return sizes[effectiveHeroSettings.font_size] || sizes.large;
  };

  // Get hero background style based on effective settings
  const getHeroBackground = () => {
    const hs = effectiveHeroSettings;
    if (hs.background_type === 'solid') {
      return { background: hs.background_color };
    }
    if (hs.background_type === 'gradient') {
      return {
        background: `linear-gradient(to bottom, ${hs.background_gradient_from}, ${hs.background_gradient_to})`,
      };
    }
    if (hs.background_type === 'image' && hs.background_image_url) {
      return {
        backgroundImage: `url(${hs.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { background: '#000000' };
  };

  // Define section components for dynamic rendering
  const sectionComponents: Record<string, React.ReactNode> = {
    hero: effectiveVisibility.hero ? (
      <section 
        key="hero"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
        style={getHeroBackground()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Monday.com Logo */}
          <HeroLogo customLogoUrl={effectiveHeroSettings.logo_url} />
          
          {/* AI Work Platform Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm md:text-base tracking-[0.2em] uppercase text-muted-foreground/80 mb-8"
          >
            {effectiveHeroSettings.platform_label || 'AI Work Platform'}
          </motion.p>
          
          {/* Main Headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-6 leading-tight"
            style={{ fontSize: getHeroFontSize() }}
          >
            <span className="text-foreground/80">{effectiveHeroSettings.headline_text || 'Empowering every team '}</span>
            <span className="bg-gradient-to-r from-[#eaecd8] via-[#c7ede0] to-[#6161ff] bg-clip-text text-transparent">
              {effectiveHeroSettings.headline_gradient_text || 'to accelerate business impact'}
            </span>
          </motion.p>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base md:text-lg mb-12 text-muted-foreground/70 max-w-3xl mx-auto"
          >
            {siteSettings.hero_subtitle || 'with AI-powered products, AI work capabilities, and a unified context-aware layer'}
          </motion.p>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col items-center gap-3 mt-12"
          >
            <motion.p 
              className="text-sm text-white/60"
              style={{ fontWeight: 'var(--font-weight-medium)' }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Scroll to explore your solution
            </motion.p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-5 h-5 text-white/60" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Background gradient blur */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        </div>
      </section>
    ) : null,

    // Standalone sections (shared with DynamicPage)
    ...buildStandaloneSections(
      effectiveVisibility as unknown as Record<string, boolean>,
      {
        teamsAgentsV2Layout: siteSettings.teams_agents_v2_layout,
        aiPlatformArchLayout: siteSettings.ai_platform_arch_layout,
      }
    ),

    // Override sidekick with onExplore callback for main page
    sidekick: effectiveVisibility.sidekick ? (
      <BeforeAfterBoardSection
        key="sidekick"
        onExplore={() => {
          const selectorSection = document.getElementById('selector-section');
          selectorSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    ) : null,

    // Override work_comparison with actual agents data
    work_comparison: effectiveVisibility.work_comparison ? (
      <WorkComparisonSection key="work_comparison" agents={mappedAgents} />
    ) : null,

    departments: effectiveVisibility.departments ? (
      <section
        key="departments"
        id="selector-section"
        className="py-20"
        style={{ background: '#000000' }}
      >
        <TopNavigationSelector
          departments={getDisplayList()}
          selectedDepartment={selectedDepartment}
          onDepartmentSelect={handleDepartmentSelect}
          selectionMode={selectionMode}
          onSelectionModeChange={setSelectionMode}
        />
      </section>
    ) : null,

    ai_platform: effectiveVisibility.ai_platform ? (
      <AnimatePresence key="ai_platform">
        {showSolution && selectedDepartment && (
          <motion.section
            id="solution-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
            className="py-24 px-4 lg:px-6"
            style={{ background: '#000000' }}
          >
            <div className="max-w-[1800px] mx-auto relative">
              {/* Department Sidebar - positioned relative to container */}
              <DepartmentSidebar
                departments={getDisplayList()}
                selectedDepartment={selectedDepartment}
                onSelectDepartment={handleDepartmentSelect}
                selectionMode={selectionMode}
              />
              
              {/* AI Work Platform Visualization - Full Width with Header Inside */}
              {contentLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="ml-3 text-muted-foreground">Loading content...</span>
                </div>
              ) : (
                <SolutionDisplay
                  department={selectedDepartment}
                  products={mappedProducts}
                  capabilities={mappedSidekickActions}
                  agents={mappedAgents}
                  vibeApps={mappedVibeApps}
                  values={getValuesForDepartment(selectedDepartment as BusinessDepartment).map(v => ({
                    icon: getBusinessValueIcon(v.iconName),
                    title: v.title,
                    description: v.description,
                    supportedBy: v.supportedBy,
                    replacesTools: v.replacesTools,
                  }))}
                  availableAgents={mappedAgents}
                  availableVibeApps={mappedVibeApps}
                  availableSidekickActions={mappedSidekickActions}
                  availableProducts={mappedProducts}
                  selectedDepartmentInfo={getDisplayList().find(d => d.id === selectedDepartment)}
                  solutionTabsVisibility={siteSettings.solution_tabs_visibility}
                  onChangeSelection={() => {
                    document.getElementById('selector-section')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }}
                />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    ) : null,
  };

  // Preview mode: render only the requested section
  if (previewSection) {
    const previewComponent = sectionComponents[previewSection];
    return (
      <SidekickThemeProvider
        initialHeroTheme={siteSettings.sidekick_hero_theme as SidekickPanelTheme | null}
        initialInActionTheme={siteSettings.sidekick_inaction_theme as SidekickPanelTheme | null}
      >
        <div className="bg-background text-foreground overflow-hidden">
          {previewComponent || (
            <div className="flex items-center justify-center h-screen text-gray-500">
              Section "{previewSection}" not found
            </div>
          )}
        </div>
      </SidekickThemeProvider>
    );
  }

  return (
    <SidekickThemeProvider
      initialHeroTheme={siteSettings.sidekick_hero_theme as SidekickPanelTheme | null}
      initialInActionTheme={siteSettings.sidekick_inaction_theme as SidekickPanelTheme | null}
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Render sections in order based on sections_order */}
        {effectiveOrder.map((sectionId) => sectionComponents[sectionId])}
      </div>
    </SidekickThemeProvider>
  );
}