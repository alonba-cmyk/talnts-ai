import {
  Brain,
  CalendarCheck,
  Search,
  Hammer,
  BarChart3,
  Zap,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

import agentPink from '@/assets/agent-pink.png';
import agentCyan from '@/assets/agent-cyan.png';
import agentOrange from '@/assets/agent-orange.png';
import agentAssetsGenerator from '@/assets/agent-assets-generator.png';
import agentRiskAnalyzer from '@/assets/agent-risk-analyzer.png';
import agentVendorResearcher from '@/assets/agent-vendor-researcher.png';

export type AgentCategory = 'think' | 'plan' | 'research' | 'build' | 'analyze' | 'automate' | 'custom';

export type HorizontalAgent = {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  detailedDescription: string;
  status: 'production' | 'coming_soon';
  examplePrompt: string;
  exampleSteps: string[];
  exampleResult: string;
  image: string;
};

export type CategoryMeta = {
  label: string;
  color: string;
  icon: LucideIcon;
};

export const CATEGORY_META: Record<AgentCategory, CategoryMeta> = {
  think: { label: 'Think', color: '#a78bfa', icon: Brain },
  plan: { label: 'Plan', color: '#60a5fa', icon: CalendarCheck },
  research: { label: 'Research', color: '#34d399', icon: Search },
  build: { label: 'Build', color: '#fbbf24', icon: Hammer },
  analyze: { label: 'Analyze', color: '#f87171', icon: BarChart3 },
  automate: { label: 'Automate', color: '#22d3ee', icon: Zap },
  custom: { label: 'Build your own', color: '#00D2D2', icon: Wand2 },
};

export const ALL_CATEGORIES: AgentCategory[] = ['think', 'plan', 'research', 'build', 'analyze', 'automate', 'custom'];

export const HORIZONTAL_AGENTS: HorizontalAgent[] = [
  // ── Think ──
  {
    id: 'sentiment-detector',
    name: 'Sentiment Detector',
    category: 'think',
    description: 'Analyzes user feedback and categorizes it into themes like complaints, praise, or suggestions.',
    detailedDescription: 'The agent analyzes user feedback received by monday form, detects sentiment, and categorizes it into themes such as complaints, praise, or suggestions. The sentiment and categorization are automatically added to your board.',
    status: 'production',
    examplePrompt: 'Analyze all new feedback submissions and tag them by sentiment and topic.',
    exampleSteps: [
      'Scanned 142 new feedback entries',
      'Classified sentiment (positive, negative, neutral)',
      'Categorized into 8 recurring themes',
      'Flagged 12 critical complaints for immediate review',
    ],
    exampleResult: 'Feedback board enriched with sentiment tags and priority flags — 12 critical items surfaced.',
    image: agentCyan,
  },
  {
    id: 'sla-definition',
    name: 'SLA Definition Agent',
    category: 'think',
    description: 'Analyzes reported bugs to determine severity, urgency, and the right SLA policy.',
    detailedDescription: 'The agent analyzes newly reported bugs to understand their severity and urgency based on impact and user disruption. It then applies the company\'s SLA policy to dynamically determine and set the appropriate deadline for resolving the issue.',
    status: 'production',
    examplePrompt: 'Set SLA deadlines for all new bugs reported this week.',
    exampleSteps: [
      'Reviewed 28 new bug reports',
      'Assessed severity based on user impact',
      'Applied SLA policy rules per tier',
      'Set resolution deadlines on each item',
    ],
    exampleResult: 'All 28 bugs classified and assigned SLA deadlines — 4 marked as P0 with 4-hour response.',
    image: agentPink,
  },

  // ── Plan ──
  {
    id: 'meeting-scheduler',
    name: 'Meeting Scheduler',
    category: 'plan',
    description: 'Finds optimal time slots and coordinates calendars to confirm meetings automatically.',
    detailedDescription: 'The agent coordinates meetings end to end by finding suitable time slots based on participants\' availability, sending calendar invitations, and confirming the meeting once all parties are aligned.',
    status: 'production',
    examplePrompt: 'Schedule a 30-min sync with the design team this week.',
    exampleSteps: [
      'Checked availability for 5 team members',
      'Found 3 overlapping slots',
      'Selected highest-fit window (Tue 2pm)',
      'Sent calendar invites with agenda',
    ],
    exampleResult: 'Meeting confirmed for Tuesday 2pm — all 5 attendees accepted.',
    image: agentOrange,
  },
  {
    id: 'rsvp-manager',
    name: 'RSVP Manager',
    category: 'plan',
    description: 'Manages event attendance by sending invitations, tracking responses, and following up.',
    detailedDescription: 'The agent manages event attendance end to end by sending invitations, tracking responses, and updating participant statuses. It provides real-time summaries for headcount, special requests, and reminders.',
    status: 'production',
    examplePrompt: 'Send invites for the Q2 kickoff and track who\'s coming.',
    exampleSteps: [
      'Sent invitations to 85 team members',
      'Tracked 62 responses in real-time',
      'Followed up with 23 non-responders',
      'Generated headcount summary with dietary notes',
    ],
    exampleResult: '78 confirmed, 7 declined — venue and catering updated automatically.',
    image: agentCyan,
  },
  {
    id: 'daily-briefing',
    name: 'Daily Briefing Agent',
    category: 'plan',
    description: 'Sends a daily Slack DM each morning with a concise overview of the day\'s meetings and priorities.',
    detailedDescription: 'Daily meeting brief agent: the agent sends a single Slack DM each morning with a concise overview of the day\'s meetings. For each meeting, it explains how to prepare and why it matters.',
    status: 'production',
    examplePrompt: 'Brief me every morning at 8am on today\'s meetings and prep notes.',
    exampleSteps: [
      'Scanned today\'s 6 calendar events',
      'Pulled context from linked boards and docs',
      'Generated prep notes per meeting',
      'Sent formatted Slack DM at 8:00am',
    ],
    exampleResult: 'Morning briefing delivered — 3 meetings flagged as needing pre-read materials.',
    image: agentPink,
  },

  // ── Research ──
  {
    id: 'competitor-research',
    name: 'Competitor Research Agent',
    category: 'research',
    description: 'Tracks competitor moves — pricing, features, hiring, and public communications.',
    detailedDescription: 'The agent continuously tracks key competitors across product launches, pricing changes, strategic moves, hiring trends, and public communications. It consolidates signals from multiple sources into a concise, structured snapshot.',
    status: 'production',
    examplePrompt: 'Give me a weekly competitive snapshot on our top 3 competitors.',
    exampleSteps: [
      'Monitored 3 competitor websites and press releases',
      'Tracked pricing page changes',
      'Analyzed 14 new job postings for strategic signals',
      'Compiled structured report with key takeaways',
    ],
    exampleResult: 'Weekly competitive brief delivered — competitor B launched a new enterprise tier.',
    image: agentCyan,
  },
  {
    id: 'vendor-research',
    name: 'Vendor Research Agent',
    category: 'research',
    description: 'Evaluates vendors against requirements and produces a prioritized shortlist.',
    detailedDescription: 'The agent analyzes the requirements of each procurement request, researches relevant vendors, and produces a prioritized list of suppliers based on fit, capabilities, and business needs.',
    status: 'production',
    examplePrompt: 'Find top 5 vendors for employee engagement survey tools under $10k/year.',
    exampleSteps: [
      'Parsed procurement requirements',
      'Researched 18 potential vendors',
      'Scored on price, features, and integration fit',
      'Produced ranked shortlist with comparison matrix',
    ],
    exampleResult: 'Top 5 vendors ranked — recommendation report with pricing comparison attached.',
    image: agentVendorResearcher,
  },
  {
    id: 'market-landscape',
    name: 'Market Landscape Analyzer',
    category: 'research',
    description: 'Scans market domains for emerging competitors, trends, and shifting behaviors.',
    detailedDescription: 'The agent conducts a comprehensive market scan for a defined category or domain. It identifies new competitors, emerging technologies, shifting customer behaviors, and macro trends by reviewing industry reports and competitor websites.',
    status: 'production',
    examplePrompt: 'Map the AI-powered project management market landscape.',
    exampleSteps: [
      'Scanned 30+ companies in the category',
      'Identified 6 emerging competitors',
      'Mapped feature overlap and white spaces',
      'Summarized macro trends and predictions',
    ],
    exampleResult: 'Market landscape report with competitor map and 3 key opportunity areas.',
    image: agentPink,
  },
  {
    id: 'hr-candidate-sourcing',
    name: 'HR Candidate Sourcing',
    category: 'research',
    description: 'Sources and evaluates candidates based on job descriptions and role requirements.',
    detailedDescription: 'The agent receives a job description from the recruiter and a request to source a defined number of suitable candidates. It identifies and evaluates potential candidates based on their fit to the role, creates them as subitems under the requisition.',
    status: 'production',
    examplePrompt: 'Source 10 senior frontend engineers with React and TypeScript experience.',
    exampleSteps: [
      'Parsed job requirements and must-haves',
      'Sourced 34 potential candidates',
      'Scored each on skills, experience, and fit',
      'Created top 10 as subitems with profiles',
    ],
    exampleResult: '10 qualified candidates sourced — 3 flagged as strong matches with relevant portfolio.',
    image: agentOrange,
  },

  // ── Build ──
  {
    id: 'field-filler',
    name: 'Field Filler Agent',
    category: 'build',
    description: 'Extracts information from files and descriptions to auto-populate board fields.',
    detailedDescription: 'The agent analyzes descriptions or attached files, extracts relevant information, and automatically populates custom fields and priorities to ensure structured and complete data.',
    status: 'production',
    examplePrompt: 'Fill in all missing fields on the product roadmap board from attached specs.',
    exampleSteps: [
      'Scanned 15 items with incomplete fields',
      'Extracted data from attached spec documents',
      'Populated priority, timeline, and owner fields',
      'Flagged 3 items with conflicting information',
    ],
    exampleResult: '12 items fully populated, 3 flagged for manual review.',
    image: agentPink,
  },
  {
    id: 'release-notes',
    name: 'Release Notes Agent',
    category: 'build',
    description: 'Collects feature info and drafts user-facing release notes automatically.',
    detailedDescription: 'The agent collects relevant information about the release and the features, and drafts a clear, user-facing release note that communicates the value and impact in an appropriate brand voice.',
    status: 'production',
    examplePrompt: 'Draft release notes for all features shipping in v3.2.',
    exampleSteps: [
      'Gathered info from 8 completed feature items',
      'Extracted key changes and user impact',
      'Drafted release notes in brand voice',
      'Organized by category (New, Improved, Fixed)',
    ],
    exampleResult: 'Release notes draft ready for review — 8 features documented with screenshots.',
    image: agentCyan,
  },
  {
    id: 'transcript-summarizer',
    name: 'Transcript Summarizer',
    category: 'build',
    description: 'Summarizes meeting transcripts into key points, decisions, and action items.',
    detailedDescription: 'The agent receives a meeting or conversation transcript, analyzes the content, and generates a clear, concise summary highlighting the key points, decisions, and outcomes.',
    status: 'production',
    examplePrompt: 'Summarize today\'s product review meeting and extract action items.',
    exampleSteps: [
      'Processed 45-minute meeting transcript',
      'Identified 5 key decisions',
      'Extracted 8 action items with owners',
      'Generated executive summary (3 paragraphs)',
    ],
    exampleResult: 'Summary posted to board — 8 action items created and assigned to owners.',
    image: agentOrange,
  },
  {
    id: 'creative-assets',
    name: 'Creative Assets Generator',
    category: 'build',
    description: 'Creates images from text prompts based on brand guidelines.',
    detailedDescription: 'The agent generates visual assets from text descriptions, following your brand guidelines for colors, fonts, and style. It creates multiple variants for review and attaches them directly to your board items.',
    status: 'production',
    examplePrompt: 'Create 3 social media banner variants for our Black Friday campaign.',
    exampleSteps: [
      'Loaded brand guidelines (colors, fonts, logos)',
      'Generated 3 banner variants per spec',
      'Applied campaign messaging and CTAs',
      'Attached all assets to the campaign item',
    ],
    exampleResult: '3 banner variants attached — ready for design review and A/B testing.',
    image: agentAssetsGenerator,
  },

  // ── Analyze ──
  {
    id: 'risk-analyzer',
    name: 'Risk Analyzer',
    category: 'analyze',
    description: 'Scans tasks daily and flags items at risk of missing their deadline.',
    detailedDescription: 'The agent scans all tasks on the board on a daily basis, evaluating due dates against their current status. When a task is approaching its deadline (e.g., within three days) and is not marked as done, the agent flags it as at risk and proactively notifies the relevant stakeholders.',
    status: 'production',
    examplePrompt: 'Flag all tasks at risk of missing their deadline this sprint.',
    exampleSteps: [
      'Scanned 124 active tasks across 3 boards',
      'Evaluated timeline vs. current progress',
      'Identified 9 at-risk items',
      'Notified owners and managers via Slack',
    ],
    exampleResult: '9 items flagged as at-risk — 3 escalated to project manager for re-prioritization.',
    image: agentRiskAnalyzer,
  },
  {
    id: 'duplicates-finder',
    name: 'Duplicates Finder',
    category: 'analyze',
    description: 'Identifies duplicate items on your board and suggests merging or removing them.',
    detailedDescription: 'The agent scans the board to identify potential duplicate items based on content and context, and proactively suggests merging or removing them to keep the board clean and consistent.',
    status: 'production',
    examplePrompt: 'Find and flag duplicate items across our bug tracking boards.',
    exampleSteps: [
      'Scanned 230 items across 2 boards',
      'Compared titles, descriptions, and metadata',
      'Found 14 potential duplicate pairs',
      'Suggested merge actions for each pair',
    ],
    exampleResult: '14 duplicate pairs identified — 8 auto-merged, 6 flagged for manual review.',
    image: agentCyan,
  },
  {
    id: 'sla-monitor',
    name: 'SLA Monitor Agent',
    category: 'analyze',
    description: 'Continuously tracks SLA compliance and notifies managers when targets are at risk.',
    detailedDescription: 'The agent continuously tracks response and resolution SLAs across active tickets, identifies cases where the SLA is at risk, and proactively notifies managers to ensure timely intervention and compliance.',
    status: 'production',
    examplePrompt: 'Monitor SLA compliance for all open support tickets and alert on breaches.',
    exampleSteps: [
      'Tracked 89 active tickets against SLA targets',
      'Identified 5 tickets approaching SLA breach',
      'Calculated remaining time for each',
      'Sent priority alerts to on-call team',
    ],
    exampleResult: 'SLA dashboard updated — 5 tickets escalated before breach, 98.2% compliance rate.',
    image: agentOrange,
  },
  {
    id: 'thread-followup',
    name: 'Thread Follow-up Agent',
    category: 'analyze',
    description: 'Reviews update threads and flags unresolved items that need attention.',
    detailedDescription: 'The agent reviews update threads, analyzes the content to identify open questions or unresolved items, and proactively tags the relevant stakeholders to request clarification or response.',
    status: 'production',
    examplePrompt: 'Review all open update threads and flag items waiting for response.',
    exampleSteps: [
      'Scanned 45 update threads from the past week',
      'Identified 11 unanswered questions',
      'Tagged relevant stakeholders',
      'Created follow-up reminders for 3-day-old threads',
    ],
    exampleResult: '11 stale threads surfaced — owners notified, follow-up reminders scheduled.',
    image: agentPink,
  },

  // ── Automate ──
  {
    id: 'process-automator',
    name: 'Process Automator',
    category: 'automate',
    description: 'Identifies repetitive patterns across workflows and suggests automations.',
    detailedDescription: 'The agent identifies repetitive tasks and patterns across workflows and proactively suggests or creates automations to streamline processes and reduce manual effort.',
    status: 'production',
    examplePrompt: 'Analyze our onboarding workflow and suggest automations for repetitive steps.',
    exampleSteps: [
      'Mapped 12-step onboarding workflow',
      'Identified 5 repetitive manual steps',
      'Created automation recipes for each',
      'Estimated 6 hours/week time savings',
    ],
    exampleResult: '5 automations created — estimated 6 hours/week saved on onboarding tasks.',
    image: agentOrange,
  },
  {
    id: 'action-extractor',
    name: 'Action Extractor',
    category: 'automate',
    description: 'Extracts actionable tasks from meeting transcripts and creates board items.',
    detailedDescription: 'The agent receives a meeting transcript, identifies actionable tasks and decisions, and automatically creates them as subitems, each clearly defined and ready for follow-up.',
    status: 'production',
    examplePrompt: 'Extract all action items from this week\'s leadership sync transcript.',
    exampleSteps: [
      'Processed 60-minute transcript',
      'Identified 12 actionable items',
      'Assigned owners based on discussion context',
      'Created subitems with deadlines on the board',
    ],
    exampleResult: '12 action items created with owners and deadlines — linked to the meeting record.',
    image: agentCyan,
  },
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    category: 'automate',
    description: 'Reviews support tickets, consults the knowledge base, and drafts accurate responses.',
    detailedDescription: 'The agent reviews the customer\'s support ticket to understand the question or issue, consults the organization\'s knowledge base, and drafts a relevant, accurate response for the customer.',
    status: 'production',
    examplePrompt: 'Draft responses for all new support tickets from the past 24 hours.',
    exampleSteps: [
      'Reviewed 18 new support tickets',
      'Matched each to knowledge base articles',
      'Drafted personalized responses',
      'Flagged 3 tickets requiring human escalation',
    ],
    exampleResult: '15 responses drafted and queued for review — 3 escalated to Tier 2 support.',
    image: agentPink,
  },
  {
    id: 'translator',
    name: 'Translator Agent',
    category: 'automate',
    description: 'Translates tasks and documents into required languages while keeping content consistent.',
    detailedDescription: 'The agent automatically translates tasks or documents into the required language, ensuring the content remains accurate, clear, and consistent across teams.',
    status: 'production',
    examplePrompt: 'Translate all customer-facing items on the release board to Spanish and French.',
    exampleSteps: [
      'Identified 22 customer-facing items',
      'Translated to Spanish and French',
      'Preserved formatting and technical terms',
      'Attached translations as subitems',
    ],
    exampleResult: '44 translations completed — all attached and ready for regional team review.',
    image: agentAssetsGenerator,
  },
];
