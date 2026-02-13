import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Zap, ChevronDown, Trophy, AlertTriangle, MessageSquare,
  TrendingUp, Shield, Puzzle, DollarSign, Headphones, Maximize2,
  Palette, Search, X, ChevronRight, ArrowLeft, Check,
  Heart, Rocket, Settings2, Quote, Star, Users, BarChart3,
  CheckCircle2, XCircle, AlertCircle, Bot, Layers
} from 'lucide-react';

// Product logos from assets
import crmFullLogo from '@/assets/monday-crm-logo-new.png';
import wmFullLogo from '@/assets/work-management-logo-new.png';
import crmIcon from '@/assets/6cf10de3ca3f528bc9d9457024ed87915acf1b6f.png';
import wmIcon from '@/assets/5d4f550f18adfa644c6653f867bc960bdc8a53dc.png';
import serviceIcon from '@/assets/9fae7b5cd33e1ccaf1f329bad81508b9daae5210.png';
import devIcon from '@/assets/f416d94ad48b77a56df38e1f5ca7412f0e86202f.png';

/* ═══════════════════ Types ═══════════════════ */

interface Product { id: string; name: string; image: string; icon: string; description: string; brandColor: string; }
interface Competitor { id: string; name: string; website: string; description: string; logo_url: string; pricing_info: string; tier: number; }
interface Objection { id: string; product_id: string; competitor_id: string; objection_text: string; response_text: string; category: string; }

export interface ComparisonRow {
  category: string;
  feature: string;
  mondayStatus: 'green' | 'orange' | 'red';
  mondayTitle: string;
  mondayDescription: string;
  competitorStatus: 'green' | 'orange' | 'red';
  competitorTitle: string;
  competitorDescription: string;
}

export interface Differentiator {
  title: string;
  description: string;
  proof: string;
}

export interface BattleCardContent {
  hero: { headline: string; tagline: string; quote?: string; quoteSource?: string };
  differentiators: Differentiator[];
  socialProof: { quote: string; author: string; role: string; company: string; analystStat: string; analystSource: string };
  comparisons: Record<string, ComparisonRow[]>; // keyed by competitor name (lowercase)
}

/* ═══════════════════ Constants ═══════════════════ */

const LOGO_API = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
function getDomain(url: string) { try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', ''); } catch { return ''; } }

const MONDAY_CORE_PRODUCTS: Product[] = [
  { id: '__crm', name: 'monday CRM', image: crmFullLogo, icon: crmIcon, description: 'Sales CRM for managing your entire sales cycle', brandColor: '#00D2D2' },
  { id: '__wm', name: 'monday Work Management', image: wmFullLogo, icon: wmIcon, description: 'Work OS for managing any workflow', brandColor: '#6161FF' },
  { id: '__service', name: 'monday Service', image: '', icon: serviceIcon, description: 'Customer service and support platform', brandColor: '#FB275D' },
  { id: '__dev', name: 'monday Dev', image: '', icon: devIcon, description: 'Product development and engineering workflows', brandColor: '#00CA72' },
];

const DIFF_ICONS = [Heart, BarChart3, Rocket, Settings2, Users, Layers, Zap, Bot, Star];

/* ═══════════════════ Default Seed Data (from real battle cards) ═══════════════════ */

export const DEFAULT_BATTLE_CARD_CONTENT: Record<string, BattleCardContent> = {
  crm: {
    hero: {
      headline: 'Grow relationships faster with AI-first CRM',
      tagline: 'Drive efficiency and revenue with a CRM that can be easily customized, teams love to use, and seamlessly transitions to post-sale projects.',
      quote: 'New customer acquisition is 5 to 25 times more expensive than retaining existing customers, while increasing customer retention rates by 5% increases profits by 25% to 95%.',
      quoteSource: 'Harvard Business Review',
    },
    differentiators: [
      { title: 'Easy to customize and modify over time', description: 'Fit the CRM to your exact needs, enable teams to optimize their processes independently and to easily modify changes when needed.', proof: 'What sets monday CRM apart' },
      { title: 'Low total cost of ownership', description: "Best-in-class with competitors, priced platform that doesn't rely on technical resources, is easy to implement and fast to onboard.", proof: 'Easy to implement and fast to onboard' },
      { title: 'Connecting sales and post-sales', description: 'Drive customer lifetime value through a seamless experience across customer information and business workflows to and from post-sale project management.', proof: 'Post-sale project management included' },
    ],
    socialProof: {
      quote: "We realized monday CRM could easily adapt to our very specific sales processes. With other platforms, you either wouldn't be able to do it exactly like you wanted or you'd need to pay a hefty customization fee.",
      author: 'Nuno Godinho',
      role: 'Chief Information Officer',
      company: 'Velv',
      analystStat: 'Trusted by 225,000+ customers worldwide',
      analystSource: 'monday.com',
    },
    comparisons: {
      'hubspot crm': [
        // Plan price
        { category: 'Plan price', feature: 'Enterprise', mondayStatus: 'green', mondayTitle: 'More expensive than HubSpot CRM', mondayDescription: 'Enterprise SRT seats = $300 onboarding fee. Predictable pricing.', competitorStatus: 'green', competitorTitle: 'Competitive pricing tiers', competitorDescription: 'HubSpot CRM pricing varies by hub and tier. Free tier available but premium scales quickly.' },
        { category: 'Plan price', feature: 'Email Marketing', mondayStatus: 'green', mondayTitle: 'Email marketing at $14/mo for 1,500 contacts', mondayDescription: 'Built-in email capabilities at affordable pricing.', competitorStatus: 'orange', competitorTitle: 'Complex add-on pricing', competitorDescription: 'Email marketing requires Marketing Hub. Pricing increases significantly with contact volume.' },
        // Setup
        { category: 'Setup', feature: 'Platform customization', mondayStatus: 'green', mondayTitle: 'Easy to customize without technical knowledge', mondayDescription: 'Additional customization is requires, it requires no additional costs.', competitorStatus: 'orange', competitorTitle: 'Certified solutions partners', competitorDescription: 'A certified solutions partner is the best place to get additional customization. It requires 3 mandatory tasks.' },
        { category: 'Setup', feature: 'Sandbox', mondayStatus: 'green', mondayTitle: 'A sandbox is for employees & templates availability', competitorDescription: 'Limited sandbox for Enterprise only.', mondayDescription: 'Full sandbox environment available for testing and onboarding.', competitorStatus: 'orange', competitorTitle: 'Limited sandbox availability', },
        // Pre-sale
        { category: 'Pre-sale', feature: 'Contact & lead enrichment', mondayStatus: 'green', mondayTitle: 'Leads input with automatic enrichment', mondayDescription: 'Automatic contact enrichment with social, company, and deal data. Build leads lists effectively.', competitorStatus: 'green', competitorTitle: 'Strong contact enrichment', competitorDescription: 'Good enrichment through HubSpot Intelligence and third-party integrations.' },
        { category: 'Pre-sale', feature: 'Marketing integrations', mondayStatus: 'green', mondayTitle: 'Inbound marketing integrations (Google/Meta, Zapier)', mondayDescription: 'Connect marketing channels directly to your CRM pipeline with native integrations.', competitorStatus: 'green', competitorTitle: 'Native marketing hub', competitorDescription: 'Comprehensive marketing tools natively built. Possibly the strongest marketing CRM integration.' },
        { category: 'Pre-sale', feature: 'Lead scoring', mondayStatus: 'green', mondayTitle: 'AI-powered lead scoring', mondayDescription: 'AI-based lead scoring with fully customizable, live scoring model.', competitorStatus: 'orange', competitorTitle: 'Lead scoring in paid tiers', competitorDescription: 'Predictive lead scoring available but only in Enterprise tier.' },
        // Sales automations
        { category: 'Sales automations', feature: 'Workflow automation', mondayStatus: 'green', mondayTitle: 'Automated workflow; pick 250,000 actions/mo/seat', mondayDescription: 'Utilize hundreds of diverse automations. Up to 250K automation actions per month per seat.', competitorStatus: 'orange', competitorTitle: 'Sequence-based automation', competitorDescription: 'Good for email sequences but limited in broader workflow automation. Complex automations require Operations Hub.' },
        { category: 'Sales automations', feature: 'Email & sequences', mondayStatus: 'green', mondayTitle: 'Email templates, mass emailing and tracking', mondayDescription: 'Built-in email capabilities with templates, mass emailing, open/click tracking, and sequencing.', competitorStatus: 'green', competitorTitle: 'Strong email automation', competitorDescription: 'Very strong email sequences and templates. Core strength of HubSpot Sales Hub.' },
        { category: 'Sales automations', feature: 'AI capabilities', mondayStatus: 'green', mondayTitle: 'AI Agents doing the work for you', mondayDescription: 'AI agents that automate prospecting, compose emails, score leads, and provide deal insights.', competitorStatus: 'orange', competitorTitle: 'AI via Breeze', competitorDescription: 'AI features being rolled out through Breeze, but still limited in scope compared to native AI-first approach.' },
        // Post-sale & Collaboration
        { category: 'Post-sale & Collaboration', feature: 'Post-sale management', mondayStatus: 'green', mondayTitle: 'Unique: CRM + PM on the same platform', mondayDescription: 'Seamlessly transition from sales to post-sale projects, onboarding, and customer success on the same platform.', competitorStatus: 'red', competitorTitle: 'Separate Service Hub needed', competitorDescription: 'Post-sale management requires purchasing and learning a separate Service Hub product.' },
        { category: 'Post-sale & Collaboration', feature: 'Cross-team collaboration', mondayStatus: 'green', mondayTitle: 'Open, advanced collaboration capabilities', mondayDescription: 'Shared boards, dashboards, and workflows across sales, CS, and project teams.', competitorStatus: 'orange', competitorTitle: 'Collaboration within HubSpot', competitorDescription: 'Good internal collaboration but limited cross-functional workflow capabilities.' },
        { category: 'Post-sale & Collaboration', feature: 'Customer lifecycle', mondayStatus: 'green', mondayTitle: 'Full customer lifecycle visibility', mondayDescription: 'Track the entire customer journey from first touch to renewal on one platform.', competitorStatus: 'orange', competitorTitle: 'Requires multi-hub setup', competitorDescription: 'Full lifecycle view requires Marketing + Sales + Service hubs working together.' },
      ],
      'salesforce crm': [
        { category: 'Total Cost of Ownership', feature: 'Pricing', mondayStatus: 'green', mondayTitle: 'Transparent, all-inclusive pricing', mondayDescription: 'Predictable pricing with automation and AI included. No per-feature add-ons.', competitorStatus: 'red', competitorTitle: 'High total cost', competitorDescription: 'Base licenses are just the start. Add-ons for AI (Einstein), automation, analytics, and CPQ significantly increase TCO.' },
        { category: 'Total Cost of Ownership', feature: 'Implementation', mondayStatus: 'green', mondayTitle: 'Quick self-serve setup', mondayDescription: 'Self-serve onboarding with intuitive interface. No need for expensive consultants.', competitorStatus: 'red', competitorTitle: 'Expensive implementation', competitorDescription: 'Typically requires SI partners. Implementation projects can run $50K-$500K+.' },
        { category: 'Ease of Use', feature: 'Daily usage', mondayStatus: 'green', mondayTitle: 'Business user friendly', mondayDescription: 'Anyone can build workflows, reports, and automations without coding or certification.', competitorStatus: 'red', competitorTitle: 'Steep learning curve', competitorDescription: 'Requires certified admins and developers. Salesforce admin certification exists for a reason.' },
        { category: 'Ease of Use', feature: 'Customization', mondayStatus: 'green', mondayTitle: 'No-code customization', mondayDescription: 'Business users can easily configure workflows, views, columns, and automations.', competitorStatus: 'orange', competitorTitle: 'Highly customizable but complex', competitorDescription: 'Extremely powerful customization through Apex, Lightning, and Flows - but requires developers.' },
        { category: 'AI Capabilities', feature: 'AI approach', mondayStatus: 'green', mondayTitle: 'Native AI-first approach', mondayDescription: 'AI agents, Vibe coding, and Sidekick built natively into the platform from the ground up.', competitorStatus: 'green', competitorTitle: 'Einstein AI', competitorDescription: 'Powerful AI with Einstein GPT and Copilot, but requires additional licensing.' },
        { category: 'Platform', feature: 'Unified experience', mondayStatus: 'green', mondayTitle: 'One platform for everything', mondayDescription: 'Sales, post-sale projects, and team collaboration on one platform with shared data.', competitorStatus: 'orange', competitorTitle: 'Multi-cloud approach', competitorDescription: 'Different clouds for sales, service, marketing. Data and UI consistency varies.' },
      ],
      attio: [
        { category: 'Platform Maturity', feature: 'Track record', mondayStatus: 'green', mondayTitle: 'Established enterprise platform', mondayDescription: 'Publicly traded company with 225,000+ customers. Enterprise-grade security and compliance.', competitorStatus: 'orange', competitorTitle: 'Emerging startup', competitorDescription: 'Newer platform with growing customer base. Still building enterprise-grade features.' },
        { category: 'Platform Maturity', feature: 'Ecosystem', mondayStatus: 'green', mondayTitle: 'Rich integration marketplace', mondayDescription: '200+ native integrations, open API, and marketplace of apps and templates.', competitorStatus: 'orange', competitorTitle: 'Growing integrations', competitorDescription: 'Good API-first approach but integration ecosystem is still maturing.' },
        { category: 'AI & Automation', feature: 'AI capabilities', mondayStatus: 'green', mondayTitle: 'Full AI suite', mondayDescription: 'AI Agents, Vibe, and Sidekick provide end-to-end AI capabilities across the platform.', competitorStatus: 'orange', competitorTitle: 'AI-native design', competitorDescription: 'Built with AI in mind. Good data model for AI, but fewer AI features currently shipping.' },
        { category: 'Beyond CRM', feature: 'Work Management', mondayStatus: 'green', mondayTitle: 'CRM + Work Management + Service', mondayDescription: 'Seamlessly extends beyond CRM to project management, service desk, and team collaboration.', competitorStatus: 'red', competitorTitle: 'CRM only', competitorDescription: 'Focused solely on CRM. No project management or service desk capabilities.' },
      ],
    },
  },
  'work management': {
    hero: {
      headline: 'Advanced features teams actually love to use',
      tagline: 'Quickly create and adapt powerful workflows on an intuitive platform, built to help you drive success.',
    },
    differentiators: [
      { title: 'High platform usage', description: "Align your teams on an intuitive platform they'll love to use, providing richer data and delivering sharper results.", proof: 'Awarded Highest User Adoption for Enterprises by G2' },
      { title: 'Business impact', description: "Proven ROI with a platform that's easy to implement and fast to learn.", proof: 'Forrester Total Economic Impact study reports less than 4 month payback period' },
      { title: 'Freedom to customize', description: 'Build and adapt flexible workflows with diverse columns and automations, ready to meet any current and future business need.', proof: 'monday.com supports hundreds of use cases in 200+ different industries' },
    ],
    socialProof: {
      quote: "Everything we've achieved so far with monday.com - whether it's quality of delivery, collaboration, responsiveness, transparency, visibility - is so remarkable because it helps us grow some truly ambitious brands.",
      author: 'Paul Wille',
      role: 'COO',
      company: 'VML',
      analystStat: 'Forrester Total Economic Impact research: Motorola sees 346% ROI with monday.com',
      analystSource: 'Forrester',
    },
    comparisons: {
      'microsoft planner': [
        // Robust Project & Task Management
        { category: 'Robust Project & Task Management', feature: 'Project management', mondayStatus: 'green', mondayTitle: 'Robust project and task management', mondayDescription: 'Advanced project management with task hierarchies and dependencies; numerous configurable views.', competitorStatus: 'red', competitorTitle: 'Basic task management for small organizations', competitorDescription: 'No task hierarchies or dependencies; single assignee per task; basic views.' },
        { category: 'Robust Project & Task Management', feature: 'Collaboration', mondayStatus: 'green', mondayTitle: 'Open, advanced collaboration capabilities', mondayDescription: 'Collaboration across numerous channels including in-app comments, tagging, file sharing, notifications via email and instant messaging platforms.', competitorStatus: 'red', competitorTitle: 'No collaboration capabilities', competitorDescription: 'Only task level comments are available.' },
        // Flexible yet standardized platform
        { category: 'Flexible yet standardized platform', feature: 'Configurability', mondayStatus: 'green', mondayTitle: 'Highly configurable / customizable', mondayDescription: 'Business users can easily configure entire workflows, views, columns, values, and forms.', competitorStatus: 'red', competitorTitle: 'Poor configurability', competitorDescription: "Can't add or reorder columns; can't configure column values." },
        { category: 'Flexible yet standardized platform', feature: 'Templates', mondayStatus: 'green', mondayTitle: 'Extensive template capabilities', mondayDescription: 'Standardize projects at ease with numerous templates for various use cases (marketing, project management, sales, operations, creative, product life cycle management) as well as custom, user-defined and managed (governed) templates.', competitorStatus: 'red', competitorTitle: 'Limited templates', competitorDescription: 'Small number of task management templates.' },
        // Easy to use automations and AI
        { category: 'Easy to use automations and AI', feature: 'Automations', mondayStatus: 'green', mondayTitle: 'Effortless diverse automations', mondayDescription: 'Utilize hundreds of diverse automations, easily transform data and automate tedious manual tasks in no time.', competitorStatus: 'red', competitorTitle: 'No Automation', competitorDescription: 'Only notifications are automated; no ability to build user-defined automation of manual tasks.' },
        { category: 'Easy to use automations and AI', feature: 'AI capabilities', mondayStatus: 'green', mondayTitle: 'Embedded AI use cases', mondayDescription: 'Easily deploy AI Blocks and automations without technical knowledge; advanced AI risk management capabilities to mitigate project issues and avoid delays.', competitorStatus: 'red', competitorTitle: 'No Artificial Intelligence Capabilities', competitorDescription: 'Copilot integration not included.' },
        // Enterprise-grade capabilities
        { category: 'Enterprise-grade capabilities', feature: 'Portfolio management', mondayStatus: 'green', mondayTitle: 'Advanced portfolio management', mondayDescription: 'Enterprise Work Management includes the ability to manage numerous projects holistically at scale and make faster decisions.', competitorStatus: 'red', competitorTitle: 'No portfolio management capabilities', competitorDescription: 'Cannot manage multiple projects.' },
        { category: 'Enterprise-grade capabilities', feature: 'Resource management', mondayStatus: 'green', mondayTitle: 'Included resource management', mondayDescription: 'Portfolio level resource planning, resource requests and allocation, and workload tracking.', competitorStatus: 'red', competitorTitle: 'No resource management capabilities', competitorDescription: 'Cannot manage resource planning and allocation; cannot view resource workload across projects.' },
        { category: 'Enterprise-grade capabilities', feature: 'Reporting', mondayStatus: 'green', mondayTitle: 'Included advanced reporting', mondayDescription: 'Dynamic, real time dashboards and reports; easy to configure.', competitorStatus: 'orange', competitorTitle: 'Limited Reporting', competitorDescription: 'Basic reporting tools like charts and progress tracking.' },
        { category: 'Enterprise-grade capabilities', feature: 'Scalability', mondayStatus: 'green', mondayTitle: 'Enterprise-grade scalability', mondayDescription: 'Supports projects with up to 100,000 tasks and dashboards with up to 500,000 items.', competitorStatus: 'red', competitorTitle: 'Limited Scalability', competitorDescription: 'Limited to thousands of tasks in a project plan.' },
        { category: 'Enterprise-grade capabilities', feature: 'Access control', mondayStatus: 'green', mondayTitle: 'Comprehensive granular data access control', mondayDescription: 'Control who can view, edit or comment on specific boards, columns, views and items; guest access available.', competitorStatus: 'red', competitorTitle: 'No granular data access control', competitorDescription: 'No ability to configure data access by user profile; no guest access.' },
      ],
      asana: [
        { category: 'Platform Flexibility', feature: 'Customization', mondayStatus: 'green', mondayTitle: 'Fully customizable platform', mondayDescription: 'Custom columns, views, automations, and workflows that any business user can configure without technical skills.', competitorStatus: 'orange', competitorTitle: 'Moderate customization', competitorDescription: 'Good project management but less flexible in data modeling. Custom fields available but limited.' },
        { category: 'Platform Flexibility', feature: 'Work OS approach', mondayStatus: 'green', mondayTitle: 'Work OS: beyond project management', mondayDescription: 'Not just PM - build custom workflows for any business process: CRM, HR, marketing, and more.', competitorStatus: 'orange', competitorTitle: 'Project management focused', competitorDescription: 'Primarily designed for project and task management. Extending to other use cases requires workarounds.' },
        { category: 'AI & Automation', feature: 'AI capabilities', mondayStatus: 'green', mondayTitle: 'AI-first work platform', mondayDescription: 'AI Agents that do the work for you, Vibe to build infinite software, and Sidekick as your AI work assistant.', competitorStatus: 'orange', competitorTitle: 'Asana Intelligence', competitorDescription: 'AI features for smart status, field generation, and writing. Still developing compared to monday AI suite.' },
        { category: 'AI & Automation', feature: 'Automations', mondayStatus: 'green', mondayTitle: '250K+ automation actions/month', mondayDescription: 'Hundreds of automation recipes. Build complex workflows with conditions, triggers, and multi-step automations.', competitorStatus: 'orange', competitorTitle: 'Rules-based automation', competitorDescription: 'Automation via Rules feature. Good basics but less flexible than monday automations.' },
        { category: 'Enterprise', feature: 'Scalability', mondayStatus: 'green', mondayTitle: 'Enterprise-grade at any scale', mondayDescription: 'Portfolio management, resource management, granular permissions, advanced reporting, and governance controls.', competitorStatus: 'green', competitorTitle: 'Good enterprise features', competitorDescription: 'Portfolios, workload, goals, and good governance. Strong enterprise tier.' },
      ],
    },
  },
  service: {
    hero: {
      headline: 'Resolve faster with an AI-powered service platform',
      tagline: 'Streamline support operations with intelligent ticket management, automated workflows, and seamless team collaboration.',
    },
    differentiators: [
      { title: 'AI-powered automation', description: 'Intelligent ticket routing, auto-responses, and sentiment analysis built right in.', proof: 'Reduce resolution time by up to 50%' },
      { title: 'Unified platform', description: 'Service, sales, and project management on one platform for seamless handoffs.', proof: 'No more context switching between tools' },
      { title: 'Real-time visibility', description: 'Live dashboards and SLA tracking give managers full visibility into team performance.', proof: 'Customizable reporting across all service metrics' },
    ],
    socialProof: {
      quote: "monday service transformed how we handle customer support. The ability to track, automate, and collaborate on tickets in one place has been game-changing for our team.",
      author: 'Support Lead',
      role: 'Director of CS',
      company: 'Enterprise Customer',
      analystStat: 'Companies using unified service platforms see 40% faster resolution times.',
      analystSource: 'Industry Report',
    },
    comparisons: {
      zendesk: [
        { category: 'Platform', feature: 'Unified experience', mondayStatus: 'green', mondayTitle: 'Service + CRM + PM on one platform', mondayDescription: 'Manage service tickets alongside sales and projects. No context switching.', competitorStatus: 'orange', competitorTitle: 'Service-focused platform', competitorDescription: 'Excellent service platform but requires integrations for CRM and project management.' },
        { category: 'Customization', feature: 'Flexibility', mondayStatus: 'green', mondayTitle: 'Fully customizable workflows', mondayDescription: 'Build any service workflow with custom fields, automations, and views.', competitorStatus: 'orange', competitorTitle: 'Template-based setup', competitorDescription: 'Good templates but customization can require admin expertise and Zendesk-specific knowledge.' },
        { category: 'AI', feature: 'AI capabilities', mondayStatus: 'green', mondayTitle: 'AI Agents for service', mondayDescription: 'AI agents auto-route tickets, suggest responses, and handle routine queries autonomously.', competitorStatus: 'green', competitorTitle: 'Strong AI with Answer Bot', competitorDescription: 'Mature AI capabilities with Answer Bot and AI-powered automation. Long track record in service AI.' },
        { category: 'Pricing', feature: 'Value', mondayStatus: 'green', mondayTitle: 'Competitive pricing with more included', mondayDescription: 'Service desk + work management + CRM capabilities included in pricing.', competitorStatus: 'orange', competitorTitle: 'Per-agent pricing adds up', competitorDescription: 'Cost per agent can be significant at scale. Many features require higher tier plans.' },
      ],
      servicenow: [
        { category: 'Implementation', feature: 'Time to value', mondayStatus: 'green', mondayTitle: 'Quick self-serve implementation', mondayDescription: 'Get started in days, not months. No specialized consultants needed.', competitorStatus: 'red', competitorTitle: 'Complex, lengthy implementation', competitorDescription: 'Enterprise implementations typically take 3-12 months and require certified consultants.' },
        { category: 'Ease of Use', feature: 'User experience', mondayStatus: 'green', mondayTitle: 'Intuitive interface anyone can use', mondayDescription: 'Modern, clean UI that support agents and managers love to use daily.', competitorStatus: 'orange', competitorTitle: 'Enterprise-grade but complex', competitorDescription: 'Very powerful but steep learning curve. Often requires dedicated admin team.' },
        { category: 'Pricing', feature: 'Cost', mondayStatus: 'green', mondayTitle: 'Fraction of the cost', mondayDescription: 'Significantly lower TCO with no implementation consulting fees.', competitorStatus: 'red', competitorTitle: 'Enterprise pricing', competitorDescription: 'One of the most expensive service platforms. Licensing + implementation costs are substantial.' },
      ],
    },
  },
  dev: {
    hero: {
      headline: 'Ship better software with streamlined dev workflows',
      tagline: 'Align product, dev, and QA teams on a single platform with sprint management, bug tracking, and release planning.',
    },
    differentiators: [
      { title: 'AI-assisted development', description: 'Sprint planning, bug prioritization, and release management powered by AI agents.', proof: 'Automate repetitive dev workflows' },
      { title: 'Cross-team alignment', description: 'Connect dev sprints with product roadmaps and business goals on one platform.', proof: 'Full visibility for stakeholders' },
      { title: 'Ship faster', description: 'Streamlined CI/CD integrations, automated testing workflows, and release tracking.', proof: 'Reduce time-to-market significantly' },
    ],
    socialProof: {
      quote: "Having dev sprints, bug tracking, and product roadmaps on the same platform as the rest of the company has eliminated so much friction in our release process.",
      author: 'Engineering Manager',
      role: 'VP Engineering',
      company: 'Tech Company',
      analystStat: 'Teams using integrated dev platforms ship 30% more features per quarter.',
      analystSource: 'DevOps Research',
    },
    comparisons: {
      'jira software': [
        { category: 'Ease of Use', feature: 'Learning curve', mondayStatus: 'green', mondayTitle: 'Intuitive from day one', mondayDescription: 'Clean, modern interface. Non-technical stakeholders can participate without training.', competitorStatus: 'red', competitorTitle: 'Steep learning curve', competitorDescription: 'Complex interface with many concepts to learn. JQL query language required for advanced searches.' },
        { category: 'Ease of Use', feature: 'Customization', mondayStatus: 'green', mondayTitle: 'No-code workflow building', mondayDescription: 'Anyone can create custom workflows, views, and automations without Jira admin skills.', competitorStatus: 'orange', competitorTitle: 'Admin-dependent customization', competitorDescription: 'Powerful customization via schemes and workflows, but typically requires Jira administrator.' },
        { category: 'Cross-team', feature: 'Beyond dev', mondayStatus: 'green', mondayTitle: 'Dev + PM + Business on one platform', mondayDescription: 'Sprint boards connected to product roadmaps, marketing plans, and executive dashboards.', competitorStatus: 'orange', competitorTitle: 'Dev-centric platform', competitorDescription: 'Excellent for dev teams but business stakeholders often need separate tools for their work.' },
        { category: 'AI', feature: 'AI capabilities', mondayStatus: 'green', mondayTitle: 'AI Agents for development', mondayDescription: 'AI-powered sprint planning, automatic bug categorization, and smart prioritization.', competitorStatus: 'orange', competitorTitle: 'Atlassian Intelligence', competitorDescription: 'AI features being rolled out across Atlassian suite. Good but still evolving.' },
        { category: 'Pricing', feature: 'Value', mondayStatus: 'green', mondayTitle: 'All-inclusive platform', mondayDescription: 'Dev workflows + roadmaps + collaboration in one price. No need for Confluence, Trello add-ons.', competitorStatus: 'orange', competitorTitle: 'Multi-product costs', competitorDescription: 'Jira + Confluence + other Atlassian products needed for full workflow. Costs add up.' },
      ],
    },
  },
};

/* ═══════════════════ Helpers ═══════════════════ */

function getProductKey(name: string): string {
  return name.toLowerCase().replace('monday ', '').trim();
}

/* ═══════════════════ UI Components ═══════════════════ */

function ProductIconSquare({ icon, brandColor, name, size = 36 }: { icon?: string; brandColor?: string; name: string; size?: number }) {
  if (icon) return <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: size, height: size }}><img src={icon} alt={name} className="w-full h-full object-cover" /></div>;
  return <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, backgroundColor: brandColor || '#6366f1' }}><span className="font-bold text-white" style={{ fontSize: size * 0.35 }}>{name.replace('monday ', '').charAt(0).toUpperCase()}</span></div>;
}

function ProductFullLogo({ image, icon, brandColor, name, height = 32 }: { image?: string; icon?: string; brandColor?: string; name: string; height?: number }) {
  if (image) return <img src={image} alt={name} className="object-contain" style={{ height }} />;
  return <div className="flex items-center gap-2"><ProductIconSquare icon={icon} brandColor={brandColor} name={name} size={height} /><span className="font-semibold text-white text-sm">{name}</span></div>;
}

function CompetitorLogo({ item, size = 20 }: { item: { name: string; website?: string; logo_url?: string }; size?: number }) {
  const [failed, setFailed] = useState(false);
  const domain = item.website ? getDomain(item.website) : '';
  const src = item.logo_url || (domain ? LOGO_API(domain) : '');
  if (src && !failed) return <img src={src} alt="" className="object-contain" style={{ width: size, height: size }} onError={() => setFailed(true)} />;
  return <span className="text-xs font-bold text-gray-500">{item.name.charAt(0)}</span>;
}

function Dropdown({ items, selectedId, onSelect, placeholder, side }: {
  items: { id: string; name: string; image?: string; icon?: string; website?: string; logo_url?: string; brandColor?: string; tier?: number }[];
  selectedId: string | null; onSelect: (id: string) => void; placeholder: string; side: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const selected = items.find(i => i.id === selectedId);
  const color = side === 'left' ? '#6366f1' : '#ef4444';
  const bgColor = side === 'left' ? 'from-indigo-600/15 to-indigo-600/5' : 'from-red-600/15 to-red-600/5';
  const borderColor = side === 'left' ? 'border-indigo-500/20' : 'border-red-500/20';
  const hoverBorder = side === 'left' ? 'hover:border-indigo-500/40' : 'hover:border-red-500/40';
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${borderColor} ${hoverBorder} bg-gradient-to-r ${bgColor} transition-all min-w-[240px]`}>
        {selected ? (<>{side === 'left' ? <ProductFullLogo image={selected.image} icon={selected.icon} brandColor={selected.brandColor} name={selected.name} height={28} /> : (<><div className="w-9 h-9 rounded-xl bg-gray-800/80 flex items-center justify-center overflow-hidden"><CompetitorLogo item={selected} size={24} /></div><span className="text-white font-semibold text-sm">{selected.name}</span></>)}</>) : <span className="text-gray-500 text-sm">{placeholder}</span>}
        <ChevronDown className={`w-4 h-4 ml-auto text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
            {items.map(item => (
              <button key={item.id} onClick={() => { onSelect(item.id); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${item.id === selectedId ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                {side === 'left' ? <ProductIconSquare icon={item.icon} brandColor={item.brandColor} name={item.name} size={32} /> : <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center overflow-hidden flex-shrink-0"><CompetitorLogo item={item} size={20} /></div>}
                <span className="text-sm flex-1">{item.name}</span>
                {side === 'right' && item.tier && <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${item.tier === 1 ? 'bg-pink-500/15 text-pink-400' : 'bg-gray-700/40 text-gray-600'}`}>T{item.tier}</span>}
                {item.id === selectedId && <Check className="w-4 h-4" style={{ color }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusDot({ status }: { status: 'green' | 'orange' | 'red' }) {
  const colors = { green: '#10b981', orange: '#f59e0b', red: '#ef4444' };
  const icons = { green: CheckCircle2, orange: AlertCircle, red: XCircle };
  const Icon = icons[status];
  return <Icon className="w-4 h-4 flex-shrink-0" style={{ color: colors[status] }} />;
}

/* ═══════════════════ Hook: Load editable content ═══════════════════ */

function useBattleCardContent(productKey: string): BattleCardContent | null {
  const [content, setContent] = useState<BattleCardContent | null>(null);

  useEffect(() => {
    if (!productKey) return;
    // Try to load from site_settings
    supabase.from('site_settings').select('*').eq('id', 'main').single().then(({ data }) => {
      const stored = (data as any)?.battle_card_content;
      if (stored && stored[productKey]) {
        setContent(stored[productKey]);
      } else {
        setContent(DEFAULT_BATTLE_CARD_CONTENT[productKey] || null);
      }
    }).catch(() => {
      setContent(DEFAULT_BATTLE_CARD_CONTENT[productKey] || null);
    });
  }, [productKey]);

  return content;
}

/* ═══════════════════ Main App ═══════════════════ */

export default function BattleCardsApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [objections, setObjections] = useState<Objection[]>([]);
  const [links, setLinks] = useState<{ product_id: string; competitor_id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [prodRes, compRes, objRes, linkRes] = await Promise.all([
      supabase.from('products').select('id, name, image, description').order('order_index'),
      supabase.from('competitors').select('*').eq('is_active', true).order('order_index'),
      supabase.from('objection_handlers').select('*').eq('is_active', true).order('order_index'),
      supabase.from('product_competitors').select('product_id, competitor_id'),
    ]);
    if (prodRes.data) {
      const coreProducts = MONDAY_CORE_PRODUCTS.map(core => {
        const coreKey = core.name.toLowerCase().replace('monday ', '').trim();
        const match = prodRes.data!.find(p => { const dbKey = p.name.toLowerCase().trim(); return dbKey === coreKey || dbKey.includes(coreKey) || coreKey.includes(dbKey); });
        return match ? { ...core, id: match.id, image: core.image || match.image, description: match.description || core.description } : core;
      });
      setProducts(coreProducts);
    } else setProducts(MONDAY_CORE_PRODUCTS);
    if (compRes.data) { const seen = new Map<string, Competitor>(); for (const c of compRes.data) { const k = c.name.toLowerCase().trim(); if (!seen.has(k)) seen.set(k, c); } setCompetitors(Array.from(seen.values())); }
    if (objRes.data) setObjections(objRes.data);
    if (linkRes.data) setLinks(linkRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const competitorsForProduct = useMemo(() => {
    let list = competitors;
    if (selectedProductId) {
      const linkedIds = links.filter(l => l.product_id === selectedProductId).map(l => l.competitor_id);
      if (linkedIds.length) list = competitors.filter(c => linkedIds.includes(c.id));
    }
    // Sort: Tier 1 first, then by name
    return [...list].sort((a, b) => (a.tier || 1) - (b.tier || 1) || a.name.localeCompare(b.name));
  }, [selectedProductId, links, competitors]);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedCompetitor = competitors.find(c => c.id === selectedCompetitorId);
  const hasBattle = !!(selectedProductId && selectedCompetitorId);

  const productKey = selectedProduct ? getProductKey(selectedProduct.name) : '';
  const competitorKey = selectedCompetitor ? selectedCompetitor.name.toLowerCase().trim() : '';

  // Load editable content
  const cardContent = useBattleCardContent(productKey);

  const currentObjections = useMemo(() => {
    if (!selectedProductId || !selectedCompetitorId) return [];
    return objections.filter(o => o.product_id === selectedProductId && o.competitor_id === selectedCompetitorId);
  }, [objections, selectedProductId, selectedCompetitorId]);

  // Get comparison rows for this competitor (with fuzzy key fallback for old/new name mismatches)
  const comparisonRows = useMemo((): ComparisonRow[] => {
    if (!cardContent || !competitorKey) return [];
    // Direct match
    if (cardContent.comparisons[competitorKey]) return cardContent.comparisons[competitorKey];
    // Fuzzy: find a key that starts with or is contained in the competitor key
    const match = Object.keys(cardContent.comparisons).find(k =>
      competitorKey.includes(k) || k.includes(competitorKey)
    );
    return match ? cardContent.comparisons[match] : [];
  }, [cardContent, competitorKey]);

  // Group by category
  const groupedRows = useMemo(() => {
    const groups: Record<string, ComparisonRow[]> = {};
    for (const row of comparisonRows) {
      if (!groups[row.category]) groups[row.category] = [];
      groups[row.category].push(row);
    }
    return groups;
  }, [comparisonRows]);

  const compDomain = selectedCompetitor ? getDomain(selectedCompetitor.website) : '';
  const compLogoSrc = selectedCompetitor ? (selectedCompetitor.logo_url || (compDomain ? LOGO_API(compDomain) : '')) : '';

  if (loading) return (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"><Swords className="w-8 h-8 text-orange-400 animate-pulse" /></div>
        <p className="text-gray-400">Loading competitive intelligence...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      {/* Top Bar */}
      <header className="border-b border-gray-800/40 bg-[#0a0b11]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center border border-orange-500/20"><Swords className="w-4.5 h-4.5 text-orange-400" /></div>
            <div><h1 className="text-white font-bold text-sm">Battle Cards</h1><p className="text-gray-600 text-[11px]">Competitive Intelligence</p></div>
          </div>
          <a href="/admin" className="text-gray-600 hover:text-gray-400 text-xs transition-colors flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Admin Panel</a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* VS Picker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-950/30 via-[#0c0d14] to-red-950/30 rounded-3xl border border-gray-800/30 p-8 mb-8 relative overflow-visible">
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative flex items-start gap-6">
            <div className="flex-1">
              <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> monday.com</p>
              <Dropdown items={products.map(p => ({ id: p.id, name: p.name, image: p.image, icon: p.icon, brandColor: p.brandColor }))}
                selectedId={selectedProductId} onSelect={id => { setSelectedProductId(id); setSelectedCompetitorId(null); setExpandedRow(null); }} placeholder="Select product..." side="left" />
            </div>
            <div className="flex flex-col items-center gap-2 pt-6">
              <motion.div animate={{ rotate: hasBattle ? 0 : [0, -5, 5, 0] }} transition={{ repeat: hasBattle ? 0 : Infinity, duration: 2, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/5"><Swords className="w-7 h-7 text-orange-400" /></motion.div>
              <span className="text-gray-600 text-xs font-bold tracking-widest">VS</span>
            </div>
            <div className="flex-1 flex flex-col items-end">
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center justify-end gap-1.5">Competitor <span className="w-1.5 h-1.5 rounded-full bg-red-400" /></p>
              {!selectedProductId ? <div className="text-right py-4"><p className="text-gray-600 text-sm">Select a monday product first</p></div> : (
                <Dropdown
                  items={competitorsForProduct.map(c => ({ id: c.id, name: c.name, website: c.website, logo_url: c.logo_url, tier: c.tier }))}
                  selectedId={selectedCompetitorId}
                  onSelect={id => { setSelectedCompetitorId(id); setExpandedRow(null); }}
                  placeholder="Select competitor..."
                  side="right"
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {!hasBattle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-800/30 flex items-center justify-center"><Swords className="w-9 h-9 text-gray-700" /></div>
            <h2 className="text-gray-400 text-xl font-semibold mb-2">Select both sides to compare</h2>
            <p className="text-gray-600 text-sm max-w-md mx-auto">Choose a monday.com product and a competitor to see the full battle card</p>
          </motion.div>
        )}

        {/* BATTLE CARD CONTENT */}
        {hasBattle && selectedProduct && selectedCompetitor && cardContent && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-8">

            {/* 1. HERO */}
            <div className="relative rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${selectedProduct.brandColor}15 0%, #0c0d14 50%, ${selectedProduct.brandColor}08 100%)` }}>
              <div className="absolute inset-0 pointer-events-none"><div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: `${selectedProduct.brandColor}08` }} /></div>
              <div className="relative p-10">
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <ProductIconSquare icon={selectedProduct.icon} brandColor={selectedProduct.brandColor} name={selectedProduct.name} size={40} />
                    <span className="font-bold text-lg" style={{ color: selectedProduct.brandColor }}>{selectedProduct.name}</span>
                  </div>
                  <span className="text-gray-600 text-sm font-bold">VS.</span>
                  <div className="flex items-center gap-3">
                    {compLogoSrc && <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden"><img src={compLogoSrc} alt="" className="w-7 h-7 object-contain" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
                    <span className="text-white font-semibold text-lg">{selectedCompetitor.name}</span>
                  </div>
                </div>
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{cardContent.hero.headline}</h2>
                  <p className="text-gray-400 text-base leading-relaxed">{cardContent.hero.tagline}</p>
                </div>
                {cardContent.hero.quote && (
                  <div className="mt-8 max-w-2xl mx-auto bg-white/[0.03] rounded-2xl p-6 border border-white/5">
                    <Quote className="w-5 h-5 text-gray-600 mb-2" />
                    <p className="text-sm text-gray-400 italic leading-relaxed">{cardContent.hero.quote}</p>
                    {cardContent.hero.quoteSource && <p className="text-xs text-gray-600 mt-2">- {cardContent.hero.quoteSource}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* 2. WHAT SETS US APART */}
            {cardContent.differentiators.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-5">What sets us apart</h3>
                <div className="grid grid-cols-3 gap-5">
                  {cardContent.differentiators.map((diff, i) => {
                    const DiffIcon = DIFF_ICONS[i % DIFF_ICONS.length];
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                        className="bg-gray-900/40 rounded-2xl border border-gray-800/30 p-6 hover:border-gray-700/40 transition-colors">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${selectedProduct.brandColor}15` }}>
                          <DiffIcon className="w-5 h-5" style={{ color: selectedProduct.brandColor }} />
                        </div>
                        <h4 className="text-white font-semibold text-base mb-2">{diff.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-3">{diff.description}</p>
                        <p className="text-xs text-gray-600 italic">{diff.proof}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. COMPARISON TABLE */}
            {comparisonRows.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-5">
                  {selectedProduct.name} vs. {selectedCompetitor.name}
                </h3>
                {/* Table header */}
                <div className="flex items-center gap-4 px-5 py-3 mb-2">
                  <div className="w-40 flex-shrink-0" />
                  <div className="flex-1 flex items-center gap-2">
                    <ProductIconSquare icon={selectedProduct.icon} brandColor={selectedProduct.brandColor} name={selectedProduct.name} size={22} />
                    <span className="text-sm font-semibold text-white">{selectedProduct.name}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    {compLogoSrc && <div className="w-[22px] h-[22px] rounded-md bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0"><img src={compLogoSrc} alt="" className="w-4 h-4 object-contain" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
                    <span className="text-sm font-semibold text-white">{selectedCompetitor.name}</span>
                  </div>
                </div>
                {/* Category groups */}
                <div className="space-y-6">
                  {Object.entries(groupedRows).map(([category, rows], catIdx) => (
                    <motion.div key={category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + catIdx * 0.08 }}>
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: selectedProduct.brandColor }} />
                        <span className="text-white font-semibold text-sm">{category}</span>
                      </div>
                      <div className="rounded-2xl border border-gray-800/30 overflow-hidden divide-y divide-gray-800/20">
                        {rows.map((row, rowIdx) => {
                          const globalIdx = comparisonRows.indexOf(row);
                          const isExpanded = expandedRow === globalIdx;
                          return (
                            <div key={rowIdx} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setExpandedRow(isExpanded ? null : globalIdx)}>
                              <div className="flex items-start gap-4 px-5 py-4">
                                <div className="w-40 flex-shrink-0 pt-0.5"><span className="text-xs text-gray-500 font-medium">{row.feature}</span></div>
                                <div className="flex-1">
                                  <div className="flex items-start gap-2">
                                    <StatusDot status={row.mondayStatus} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-white leading-snug">{row.mondayTitle}</p>
                                      <AnimatePresence>
                                        {isExpanded && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-gray-500 mt-1.5 leading-relaxed overflow-hidden">{row.mondayDescription}</motion.p>}
                                      </AnimatePresence>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start gap-2">
                                    <StatusDot status={row.competitorStatus} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-white leading-snug">{row.competitorTitle}</p>
                                      <AnimatePresence>
                                        {isExpanded && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-gray-500 mt-1.5 leading-relaxed overflow-hidden">{row.competitorDescription}</motion.p>}
                                      </AnimatePresence>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* No data for this competitor */}
            {comparisonRows.length === 0 && (
              <div className="text-center py-16 bg-gray-900/20 rounded-2xl border border-gray-800/20">
                <Swords className="w-10 h-10 mx-auto mb-4 text-gray-700" />
                <p className="text-gray-500 text-sm">No comparison data available for {selectedProduct.name} vs {selectedCompetitor.name} yet.</p>
                <p className="text-gray-600 text-xs mt-1">Add comparison rows in the Admin Panel.</p>
              </div>
            )}

            {/* Objection Handlers */}
            {currentObjections.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Handling Objections</h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentObjections.map(obj => (
                    <motion.div key={obj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/40 rounded-2xl border border-gray-800/30 p-5">
                      <div className="flex items-start gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /><p className="text-sm text-red-300 font-medium">"{obj.objection_text}"</p></div>
                      <div className="flex items-start gap-2 bg-green-500/5 rounded-xl p-3"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><p className="text-sm text-green-300/80">{obj.response_text}</p></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SOCIAL PROOF */}
            {cardContent.socialProof && (
              <div className="space-y-6">
                {cardContent.socialProof.analystStat && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-gray-900/50 rounded-2xl border border-gray-800/30 p-6 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0"><BarChart3 className="w-7 h-7 text-gray-400" /></div>
                    <div className="flex-1"><p className="text-white text-sm font-medium leading-relaxed">{cardContent.socialProof.analystStat}</p><p className="text-gray-600 text-xs mt-1">{cardContent.socialProof.analystSource}</p></div>
                  </motion.div>
                )}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gray-900/50 rounded-2xl border border-gray-800/30 p-8">
                  <Quote className="w-8 h-8 mb-4" style={{ color: selectedProduct.brandColor, opacity: 0.5 }} />
                  <p className="text-white text-lg leading-relaxed mb-6 max-w-4xl">{cardContent.socialProof.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"><span className="text-sm font-bold text-gray-400">{cardContent.socialProof.author.charAt(0)}</span></div>
                    <div><p className="text-white text-sm font-semibold">{cardContent.socialProof.author}</p><p className="text-gray-500 text-xs">{cardContent.socialProof.role}, {cardContent.socialProof.company}</p></div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
