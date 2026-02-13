import { useState, useRef } from 'react';
import {
  ArrowLeft, Upload, Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronUp,
  FileText, Search, Filter, Check, AlertTriangle, Loader2, ExternalLink,
  RefreshCw, Eye, EyeOff, Quote, Building2, MapPin, Package, Zap, ScanSearch,
  Globe, Link,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  useCaseStudySources, useCaseStudies,
  type CaseStudy, type CaseStudySource, type CaseStudyImpactMetric,
} from '@/hooks/useSupabase';

// ─── Constants ──────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Retail & CPG', 'Technology', 'Professional Services', 'Financial Services',
  'Healthcare', 'Education', 'Government', 'Real Estate', 'Construction',
  'Media & Advertising', 'Travel & Tourism', 'Non-profit', 'Other',
];

const REGIONS = ['Global', 'NAM', 'EMEA', 'APJ', 'LATAM'];

const PRODUCTS = [
  'Work management', 'CRM', 'Service', 'Dev', 'Campaigns',
];

// ─── Seed Data (extracted from Global Case Study Slides) ────────────────────

const PRESENTATION_CASE_STUDIES: Partial<CaseStudy>[] = [
  // ── Global ──
  { company_name: 'WHSmith', industry: 'Retail & CPG', location: 'UK + Worldwide', region: 'Global', products_used: ['Work management'], challenge: "WHSmith's Construction & Program Management Office oversees hundreds of store builds, remodels, and refreshes annually. But siloed tools made it difficult to manage cross-functional milestones, track risks, and provide real-time reporting.", solution: 'By centralizing projects in monday.com, WHSmith gained agility, accountability, and live reporting across three portfolios (International, Strategic, Travel UK). Real-time dashboards give instant portfolio views and accurate reports.', quote_text: "With monday.com, we can identify projects where we know they're in the bag and going to happen. But we can also flag the ones at risk — giving us the visibility to have the right conversations and get them back on track.", quote_author: 'Matthew Smith', quote_title: 'Group Construction PMO Manager, WHSmith', impact_metrics: [{ value: '20%', label: 'more snags completed on time or early' }, { value: '132%', label: 'increase in projects delivered' }, { value: 'Faster', label: 'more confident reporting' }], partner: '', is_public_approved: true },
  { company_name: 'TIG Freight', industry: 'Professional Services', location: 'Worldwide', region: 'Global', products_used: ['Work management', 'CRM'], challenge: 'Despite a six-figure investment in a leading CRM, TIG Freight struggled with poor adoption, high support costs and a rigid system that pushed sales back to spreadsheets.', solution: 'TIG Freight adopted monday CRM for an intuitive, cost-effective and adaptable platform. Implementation took just four weeks, staged across sales, service, finance and admin.', quote_text: "The way you can integrate monday CRM with monday work management is the smartest thing that we've done.", quote_author: 'Craig Parkinson', quote_title: 'National Sales Manager, TIG Freight', impact_metrics: [{ value: '40%', label: 'reduction in onboarding time' }, { value: '20%', label: 'increase in outbound sales calls' }, { value: '27%', label: 'increase in speed to market' }], partner: '', is_public_approved: true },
  { company_name: 'Canva', industry: 'Technology', location: 'Worldwide', region: 'Global', products_used: ['Work management'], challenge: "Canva's Growth Marketing Creative team was scaling rapidly but relied on ad hoc processes and scattered tools. Without visibility or stable systems, project managers juggled 20+ markets.", solution: 'Canva adopted monday.com as a Work Operating System to streamline creative operations and scale output. Production steps were nearly halved, manual updates replaced by automations.', quote_text: "monday.com wasn't just another tool in the mix, but a Work Operating System that could support our need for efficiency at scale.", quote_author: 'Vic Diesta', quote_title: 'Creative Operations Lead, Canva', impact_metrics: [{ value: '60K', label: 'ads produced (3x creative output)' }, { value: '522%', label: 'growth in scope from 9 to 56' }, { value: '40%', label: 'faster production time' }], partner: '', is_public_approved: true },
  { company_name: 'Black Mountain', industry: 'Professional Services', location: 'Worldwide', region: 'Global', products_used: ['Work management', 'CRM'], challenge: 'Black Mountain expanded to 700+ clients across 165 countries, each with unique HR and payroll requirements. Spreadsheets and a rigid CRM created inefficiencies.', solution: 'Black Mountain adopted monday CRM to replace spreadsheets and a rigid CRM with one connected platform. Automations route opportunities to the right country managers.', quote_text: 'Everyone loves monday CRM. Almost immediately, we heard how easy it is to use and how much value it brings.', quote_author: 'Luca Pope', quote_title: 'Global Client Solutions Manager, Black Mountain', impact_metrics: [{ value: '15%', label: 'increase in conversion rate' }, { value: '100+', label: 'manual actions saved' }, { value: '10+', label: 'hours saved per month in sales admin' }], partner: '', is_public_approved: true },
  { company_name: 'BioPak', industry: 'Retail & CPG', location: 'Worldwide', region: 'Global', products_used: ['Work management', 'CRM'], challenge: 'As BioPak expanded into new markets, managing 900+ projects via email and spreadsheets became unsustainable. Teams lacked visibility, ownership and accountability.', solution: 'BioPak adopted monday.com to unify project management and sales execution in one platform. 20,000+ monthly automations streamlined work at scale.', quote_text: "If it's not in monday.com, it didn't happen. We couldn't do what we do today without monday.com — it's the operating system that powers BioPak's growth.", quote_author: 'Trevor Rumble', quote_title: 'Product & Innovation Director, BioPak', impact_metrics: [{ value: '20,000', label: 'automations created per month' }, { value: '12x', label: 'ROI' }, { value: '900+', label: 'active projects tracked simultaneously' }], partner: '', is_public_approved: true },
  { company_name: 'Atomic212', industry: 'Financial Services', location: 'Worldwide', region: 'Global', products_used: ['Work management'], challenge: "Atomic212's recruitment workflows were manual, fragmented and time-consuming. Media Booking Authorisations took 30 minutes per job.", solution: 'Atomic212 adopted monday.com to automate recruitment workflows, integrate systems and improve visibility. MBA generation time was cut by 83%.', quote_text: 'monday.com gave us the structure and visibility we needed to scale our operations effectively. The impact on team performance was immediate.', quote_author: "Damien O'Brien", quote_title: 'General Manager — Brisbane & Darwin, Atomic212', impact_metrics: [{ value: '83%', label: 'reduction in MBA generation time' }, { value: '100%', label: 'elimination of manual data re-entry' }, { value: '340+', label: 'recruitment jobs managed monthly' }], partner: '', is_public_approved: true },
  { company_name: 'Esker', industry: 'Financial Services', location: 'Worldwide', region: 'Global', products_used: ['Work management'], challenge: "Esker's 14 global subsidiaries delivered projects with fragmented tools and inconsistent processes. Leadership lacked real-time visibility into capacity and backlogs.", solution: 'Esker adopted monday.com as a secure global platform to standardise project delivery while allowing local flexibility. Dashboards gave leaders real-time insights.', quote_text: "Customers don't want to wait. With monday.com, we can start projects faster and recognise revenue sooner — while giving each subsidiary the flexibility they need.", quote_author: 'Ben Braun', quote_title: 'Professional Services Director, Esker', impact_metrics: [{ value: 'Standardised', label: 'global project delivery with local flexibility' }, { value: 'Real-time', label: 'visibility into global capacity' }, { value: 'Faster', label: 'project starts, accelerating revenue' }], partner: '', is_public_approved: true },
  { company_name: 'Vistra', industry: 'Professional Services', location: 'Worldwide', region: 'Global', products_used: ['Work management', 'Dev'], challenge: 'Vistra relied on 50+ legacy customer-facing applications, siloed emails and ad hoc meetings to manage projects. This fragmented approach slowed delivery.', solution: 'Vistra adopted monday.com and monday dev to accelerate digital transformation and unify project management. The platform bridged technical and non-technical teams.', quote_text: "We're operating in an open, deep trusting, transparent environment with no silos of information. It's about completely opening access to everyone who needs it.", quote_author: 'Alan Schmoll', quote_title: 'Executive Vice President, Vistra', impact_metrics: [{ value: '28%', label: 'increase in speed to market' }, { value: '40%', label: 'reduction in onboarding time' }, { value: '20%', label: 'increase in outbound sales calls' }], partner: '', is_public_approved: true },
  { company_name: "McDonald's Australia", industry: 'Retail & CPG', location: 'Worldwide', region: 'Global', products_used: ['Work management'], challenge: "McDonald's Australia managed projects through spreadsheets, documents and endless email chains. Approvals were manual and slow.", solution: "McDonald's adopted monday.com as its central project management platform. This proved invaluable during the FIFA Women's World Cup.", quote_text: "To generate a game-changing strategy, we needed a game-changing technology. And that's where monday.com scored the winner.", quote_author: 'Matt Carey', quote_title: "Business Process Lead, McDonald's Australia", impact_metrics: [{ value: '25%', label: 'reduction in project management timelines' }, { value: '1,200+', label: 'hours saved per month' }, { value: '20,000', label: 'fewer emails sent per month' }], partner: '', is_public_approved: true },
  { company_name: 'Giant Group', industry: 'Retail & CPG', location: 'Worldwide', region: 'Global', products_used: ['Work management'], challenge: "Giant's six-person Digital Experience Team supported 15+ regional offices, managing dozens of requests daily across brands, functions and time zones.", solution: 'Giant adopted monday.com to centralise marketing operations. 6,000+ hours saved annually and 45 teams fully onboarded.', quote_text: "We've rolled out a lot of tools at Giant, but none have taken off like monday.com. It's the first platform people actually want to be on.", quote_author: 'Chris Degenaars', quote_title: 'Global Digital Experience & Growth Associate Manager, Giant Group', impact_metrics: [{ value: '45', label: 'teams fully onboarded' }, { value: '6,000+', label: 'hours saved per year' }], partner: '', is_public_approved: true },
  { company_name: 'Essence Corp', industry: 'Retail & CPG', location: 'Worldwide', region: 'Global', products_used: ['Work management'], challenge: 'Essence Corp manages distribution for over 40 luxury brands across 80+ countries, but with just 60 employees, their internal tools couldn\'t keep up.', solution: 'Essence Corp adopted monday as their centralized platform for managing operations, brand activations, and campaign workflows. With support from partner Empyra.', quote_text: 'We operate like a small business with big-business complexity — monday.com helps us manage both.', quote_author: 'Marie-Claire Lochet', quote_title: 'Digital and Retail Experience Director, Essence Corp', impact_metrics: [{ value: '41,000+', label: 'hours saved per year' }, { value: '24x', label: 'ROI' }, { value: '<5 min', label: 'to share live updates' }], partner: 'Empyra', is_public_approved: true },
  // ── NAM ──
  { company_name: 'Chinburg Properties', industry: 'Real Estate', location: 'USA', region: 'NAM', products_used: ['Work management', 'CRM', 'Campaigns'], challenge: 'As Chinburg Properties scaled its commercial and residential portfolio, critical workflows were spread across spreadsheets, emails, and disconnected systems.', solution: 'Chinburg Properties adopted monday.com as a single operating system, combining monday work management and monday CRM to connect every stage of the real estate lifecycle.', quote_text: 'monday.com brought every part of our business into one connected space. The harmony between work management and CRM has become our operating system.', quote_author: 'Jennifer Chinburg', quote_title: 'EVP, Corporate Development & Brand, Chinburg Properties', impact_metrics: [{ value: '6x', label: 'ROI' }, { value: '$200,000+', label: 'in annual operational cost savings' }, { value: '5,850+', label: 'hours saved annually' }], partner: '', is_public_approved: true },
  { company_name: 'athenahealth', industry: 'Healthcare', location: 'USA', region: 'NAM', products_used: ['Work management'], challenge: "athenahealth's marketing organization scaled with fragmented campaign workflows across legacy tools, spreadsheets, and inboxes.", solution: 'athenahealth adopted monday.com as a centralized work management platform to unify campaign planning, creative production, and execution.', quote_text: 'monday.com gave us more than a platform. It gave us a better way of working, one that\'s visible, accountable, and scalable across the entire organization.', quote_author: 'Karin Traina', quote_title: 'VP, Director, Process Improvement & Change Management, athenahealth', impact_metrics: [{ value: '$60k+', label: 'saved by retiring legacy plug-ins' }, { value: '1,000+', label: 'creative requests tracked in first 6 months' }, { value: '100%', label: 'adoption across campaign workflows' }], partner: '', is_public_approved: true },
  { company_name: 'SDCOE', industry: 'Education', location: 'USA', region: 'NAM', products_used: ['Work management'], challenge: 'The Assistant Superintendent and senior leadership team lacked visibility into division-wide projects, and each department used separate tools.', solution: "SDCOE's Enterprise PMO rolled out monday.com across all departments using a white-glove approach with standardized templates and a champions program.", quote_text: "We took a 'white glove' approach and set up an internal champions program, offering onboarding and training services tailored to each department.", quote_author: 'Peyri Herrera', quote_title: 'Sr. Director, Enterprise Management, SDCOE', impact_metrics: [{ value: '89%', label: 'reported better project tracking' }, { value: '87%', label: 'experienced improved collaboration' }, { value: '90%', label: 'say communication improved' }], partner: '', is_public_approved: true },
  { company_name: 'EAG', industry: 'Professional Services', location: 'USA', region: 'NAM', products_used: ['Work management', 'CRM'], challenge: 'Client data was scattered across spreadsheets, inboxes, and legacy systems. CRM information was inconsistent, manual work was heavy, and forecasting was unreliable.', solution: 'EAG rebuilt its CRM inside monday.com, importing only verified data. 700+ hours saved annually on prospecting emails.', quote_text: "Now we have a lot less data, but it's quality data. That change allows us to use AI confidently, without second-guessing the outputs.", quote_author: 'Elizabeth Gerbel', quote_title: 'CEO, EAG', impact_metrics: [{ value: '80%', label: 'increase in opportunity capture' }, { value: '95%', label: 'improvement in data quality' }, { value: '700+', label: 'hours saved yearly' }], partner: '', is_public_approved: true },
  { company_name: 'Valmont Industries', industry: 'Construction', location: 'USA', region: 'NAM', products_used: ['Work management', 'Dev'], challenge: 'Valmont Industries relied on a mix of Microsoft tools, outdated trackers, and inconsistent workflows across teams. Collaboration was siloed.', solution: 'Valmont adopted monday.com to centralize projects, improve accountability, and support agile planning. Two separate accounts migrated into a single global platform.', quote_text: "monday.com has been a life-changer. It gives us transparency, accountability, and a centralized place to manage projects across the globe.", quote_author: 'Kendra Seier', quote_title: 'Project Manager, Valmont Industries', impact_metrics: [{ value: '20+', label: 'countries working on a single system' }, { value: '9,000+', label: 'hours saved per month' }, { value: 'Two', label: 'instances unified into monday.com' }], partner: 'thespelas.com', is_public_approved: true },
  { company_name: 'City of Baltimore', industry: 'Government', location: 'USA', region: 'NAM', products_used: ['Work management'], challenge: "Baltimore's Bureau of Procurement managed hundreds of processes across emails, spreadsheets, and meetings with limited visibility and no unified structure.", solution: "monday.com gave the Bureau the structure to scale, flexibility to adapt, and ability to act on real-time information.", quote_text: "Adopting monday.com gave us the structure to scale, the flexibility to adapt, and the ability to act on real-time information.", quote_author: 'Kimberly Moeller', quote_title: 'Director of Contracts & Procurement Operations, City of Baltimore', impact_metrics: [{ value: '2,500+', label: 'hours saved annually' }, { value: '2x', label: 'ROI' }, { value: '100%', label: 'adoption across Procurement Team' }], partner: 'XTIVIA', is_public_approved: true },
  // ── EMEA ──
  { company_name: 'Zopa Bank', industry: 'Financial Services', location: 'United Kingdom', region: 'EMEA', products_used: ['Work management', 'Service'], challenge: "Zopa Bank's HR team managed hundreds of employee requests weekly through a shared Outlook inbox. Tracking ownership and priorities was a constant challenge.", solution: 'Zopa adopted monday service to streamline 550+ internal HR requests per month. AI-powered triage automatically categorizes tickets with 98% accuracy.', quote_text: "The biggest value for us is speed and flexibility. You can get up and running in days, change anything instantly, and see everything in real time without needing a dedicated admin.", quote_author: 'Clive Camilleri', quote_title: 'Head of People Tech & Operations, Zopa Bank', impact_metrics: [{ value: '98%', label: 'of tickets auto-triaged with AI' }, { value: '50+', label: 'hours saved each month' }, { value: '5-min', label: 'reduction in resolution time' }], partner: '', is_public_approved: true },
  { company_name: 'Cape Union Mart', industry: 'Retail & CPG', location: 'South Africa', region: 'EMEA', products_used: ['Service', 'Dev'], challenge: "Cape Union Mart's IT team was operating without a centralized system to manage support requests across 270+ stores and 600 internal users.", solution: 'Cape Union Mart implemented monday service and monday dev to create one unified, scalable platform for managing IT operations. Partnering with Incentro.', quote_text: 'When IT runs well, the business runs well. monday service helps us do both.', quote_author: 'Grant De Waal-Dubla', quote_title: 'Group CIO, Cape Union Mart', impact_metrics: [{ value: '50%', label: 'reduction in open tickets' }, { value: '30%', label: 'cost savings with tool consolidation' }, { value: 'Faster', label: 'resolutions by first line reps' }], partner: 'Incentro', is_public_approved: true },
  { company_name: 'Knight Frank', industry: 'Real Estate', location: 'United Kingdom', region: 'EMEA', products_used: ['Work management'], challenge: "Knight Frank's marketing team supported four divisions operating in silos with no consistent way to plan or track work.", solution: "Knight Frank adopted monday.com as a single platform to unite all four divisions under one source of truth with standardized campaign templates.", quote_text: "With monday.com, it's become a more collaborative culture, because we can see what other people are doing. We're a more connected team as a result.", quote_author: 'Sophie Steer', quote_title: 'Head of Marketing Channels, Knight Frank', impact_metrics: [{ value: 'Collaboration', label: 'unlocked across divisions and agencies' }, { value: 'Data-driven', label: 'monthly reports now insights-led' }, { value: 'Full visibility', label: 'all campaigns tracked in one place' }], partner: '', is_public_approved: true },
  // ── APJ ──
  { company_name: 'Nutrition Warehouse', industry: 'Retail & CPG', location: 'Australia & New Zealand', region: 'APJ', products_used: ['Work management'], challenge: 'As Nutrition Warehouse grew, campaign consistency across 120+ stores became difficult. Emails, spreadsheets, and manual handoffs caused missed signage.', solution: 'Nutrition Warehouse adopted monday.com to unify operations across its retail network. monday AI helps teams structure data and automate reports.', quote_text: "monday.com is the link that holds our business together — connecting our support office and stores with the visibility to move fast, stay consistent, and understand the impact on revenue.", quote_author: 'Duncan McHugh', quote_title: 'Chief Operations Officer, Nutrition Warehouse', impact_metrics: [{ value: '11x', label: 'ROI' }, { value: '43,000+', label: 'hours saved annually' }, { value: '$200,000+', label: 'saved from expiry-related write-offs' }], partner: '', is_public_approved: true },
  { company_name: "Grill'd", industry: 'Retail & CPG', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: "As Grill'd grew, campaign delivery became harder to manage. Product launches relied on manual tracking and scattered updates.", solution: "Grill'd adopted monday.com to unify marketing, PMO, and cross-functional delivery. Campaigns delivered 2x faster, 5,680 hours saved annually.", quote_text: "It's changed how we deliver. We've kept our creative energy, but now it's powered by structure and clarity — monday.com has turned teamwork into a competitive advantage.", quote_author: 'Emily Clifton-Bligh', quote_title: "Head of Marketing Campaigns, Grill'd", impact_metrics: [{ value: '3x', label: 'ROI' }, { value: '2x', label: 'faster campaign turnaround' }, { value: '5,680', label: 'hours saved annually' }], partner: '', is_public_approved: true },
  { company_name: 'Chobani Australia', industry: 'Retail & CPG', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: "Chobani's innovation pipeline was outpacing the systems managing it. Projects lived in spreadsheets and emails, slowing approvals.", solution: 'Chobani turned monday.com into its engine for structured, accountable delivery. Stage gates were rebuilt in-platform. Weeks — not months — from idea to approval.', quote_text: "monday.com has redefined how we measure success — every step is visible, every owner is accountable, and every project moves forward with discipline and confidence.", quote_author: 'Jess Read', quote_title: 'Senior Project Manager, Chobani Australia', impact_metrics: [{ value: 'Weeks', label: 'instead of months from idea to approval' }, { value: '2x', label: 'ROI' }, { value: '2,000+', label: 'hours saved annually' }], partner: '', is_public_approved: true },
  { company_name: 'The Back Room', industry: 'Professional Services', location: 'Philippines', region: 'APJ', products_used: ['Work management'], challenge: "The Back Room's growth outpaced its systems. HR, IT, and Talent teams were buried in manual requests. IT issues took days to resolve.", solution: 'The Back Room adopted monday.com to connect teams with 15,000+ monthly automations. IT response times cut from three days to one minute.', quote_text: "monday.com gave us the structure and visibility to grow with confidence — it's how we scale smarter as we continue to expand globally.", quote_author: 'Gretchen Buenavista', quote_title: 'Head of Systems & Process Automation, The Back Room', impact_metrics: [{ value: '10x', label: 'ROI' }, { value: '33,000+', label: 'hours saved annually' }, { value: '1-minute', label: 'IT response times (previously 3 days)' }], partner: '', is_public_approved: true },
  { company_name: 'Unilever International', industry: 'Retail & CPG', location: 'Singapore', region: 'APJ', products_used: ['Work management'], challenge: 'Unilever International managed 250+ projects across spreadsheets, slide decks and emails — with no clear visibility or shared structure.', solution: 'Unilever International adopted monday.com with real-time visibility across 250+ projects, powered by dashboards, automations and AI. 95%+ adoption.', quote_text: "monday.com isn't just about managing work — it's how we protect team health, move at speed, and scale purpose across 120+ countries.", quote_author: 'Dany Krivoshey', quote_title: 'Chief Digital & Technology Officer, Unilever International', impact_metrics: [{ value: '4x', label: 'ROI' }, { value: '1,830', label: 'hours saved annually' }, { value: '95%+', label: 'adoption across the core team' }], partner: '', is_public_approved: true },
  { company_name: 'Freedom Furniture', industry: 'Retail & CPG', location: 'Australia', region: 'APJ', products_used: ['CRM'], challenge: 'Freedom Furniture dropship program scaled rapidly, but disconnected workflows, manual follow-ups, and siloed communication led to duplication and delays.', solution: 'Freedom adopted monday CRM to unify vendor operations and scale its dropship program with clarity and control.', quote_text: "Without monday CRM, we'd be chasing updates and fixing errors. Now we're focused on growing the program — not just keeping up with it.", quote_author: 'Quentin Williams', quote_title: 'Head of Dropship, Freedom Furniture', impact_metrics: [{ value: '8,100+', label: 'hours saved annually' }, { value: '$272K+', label: 'in recovered productivity' }, { value: '26x', label: 'ROI' }], partner: '', is_public_approved: true },
  { company_name: 'Tennis Australia', industry: 'Non-profit', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: 'Delivering the Australian Open required coordinating 400+ contributors and hundreds of partners. Planning through spreadsheets left teams siloed.', solution: 'Tennis Australia adopted monday.com to orchestrate every stage of the Australian Open — from planning and logistics to live event delivery.', quote_text: "We simply couldn't deliver an event of this scale without monday.com. It's how we stay on track — every project, every partner, every day.", quote_author: 'Emma Hopkins', quote_title: 'Director of Precinct Operations & Logistics, Tennis Australia', impact_metrics: [{ value: '21,000+', label: 'hours saved annually' }, { value: '80%', label: 'reduction in partner-related emails' }, { value: '4x', label: 'ROI' }], partner: '', is_public_approved: true },
  { company_name: 'Coles 360', industry: 'Retail & CPG', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: 'Coles 360 launched as a startup within a large enterprise. Legacy systems created inefficiencies and silos in a fast-moving retail media market.', solution: 'Coles 360 adopted monday.com to centralise campaign management and scale its retail media network across 3,000+ campaigns.', quote_text: "monday.com powers the Coles 360 business. Without it, we wouldn't be where we are today.", quote_author: 'Jon Harding', quote_title: 'Head of Delivery, Coles 360', impact_metrics: [{ value: '10x', label: 'ROI' }, { value: '8.2K', label: 'hours saved per month' }, { value: '3K', label: 'campaigns run more efficiently' }], partner: '', is_public_approved: true },
  { company_name: 'Britax', industry: 'Retail & CPG', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: "Britax's marketing team was inundated with campaign requests from multiple departments. Managed via emails and Excel.", solution: 'Britax adopted monday.com to centralise and automate its marketing operations with standardised forms and automated request routing.', quote_text: "Now everything is fully automated. A briefer fills in a form, it goes into our key monday.com board, and everything flows from there. It's seamless.", quote_author: 'Michelle Wee', quote_title: 'Marketing Director, Britax', impact_metrics: [{ value: 'Standardised', label: 'campaign briefs automated' }, { value: 'Faster', label: 'response times to retailers' }, { value: 'Improved', label: 'brand consistency and advocacy' }], partner: '', is_public_approved: true },
  { company_name: 'ReadyTech', industry: 'Education', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: 'ReadyTech needed a more efficient way to deliver SME client projects. Fragmented communication and inconsistent processes slowed onboarding.', solution: 'ReadyTech adopted monday.com as a single source of truth for project delivery with standardised templates and real-time visibility.', quote_text: "The work that we do is really enabled via the monday.com platform. It's been hugely successful.", quote_author: 'James Diamond', quote_title: 'Group Chief Operating Officer, ReadyTech', impact_metrics: [{ value: 'Faster', label: 'customer onboarding and delivery' }, { value: 'Improved', label: 'client satisfaction' }, { value: 'Accelerated', label: 'time to revenue recognition' }], partner: '', is_public_approved: true },
  { company_name: 'HBF', industry: 'Healthcare', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: "HBF's Marketing team managed 17 disconnected processes across multiple tools. An external audit exposed gaps in campaign approvals.", solution: 'HBF adopted monday.com to simplify and automate marketing operations, reclaiming over 1,000 hours per month.', quote_text: 'Once people started getting into the platform, the feedback was overwhelmingly positive.', quote_author: 'Kristina Green', quote_title: 'Head of Marketing Operations, HBF', impact_metrics: [{ value: '1,039', label: 'hours saved a month' }, { value: '5x', label: 'ROI' }, { value: '95%', label: 'of users agree monday.com saves them time' }], partner: '', is_public_approved: true },
  { company_name: 'Officeworks', industry: 'Retail & CPG', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: 'Officeworks managed thousands of products and 2,800+ planograms using spreadsheets, emails and disconnected systems.', solution: 'Officeworks adopted monday.com to unify product and space planning, replacing 635+ spreadsheets with one connected platform.', quote_text: 'No matter how big or small, easy or complex, any process can be streamlined and managed using monday.com.', quote_author: 'Komi Singh', quote_title: 'Merchandise Process Analyst, Officeworks', impact_metrics: [{ value: '10K+', label: 'fewer emails' }, { value: '635+', label: 'working spreadsheets replaced' }], partner: '', is_public_approved: true },
  { company_name: 'luxie tech', industry: 'Technology', location: 'Australia', region: 'APJ', products_used: ['Work management', 'Dev'], challenge: 'Managing projects through email and Slack became unsustainable. Details were lost, requests unprioritised and delivery timelines stretched.', solution: 'luxie tech adopted monday dev to streamline development and speed up delivery. 30% more project capacity and shorter delivery cycles.', quote_text: 'monday dev empowers us to manage the entire development process on one platform so we can speed up product delivery and improve customer satisfaction.', quote_author: 'Mitchell Hudson', quote_title: 'Head of Technology, luxie tech', impact_metrics: [{ value: '30%', label: 'increase in project capacity' }, { value: '7%', label: 'revenue boost' }, { value: 'Reduced', label: 'month-long delay in delivery' }], partner: '', is_public_approved: true },
  { company_name: 'Flight Centre', industry: 'Travel & Tourism', location: 'Australia', region: 'APJ', products_used: ['Work management'], challenge: "Flight Centre's Corporate Technology team managed 200+ initiatives across multiple systems without a shared platform.", solution: 'Flight Centre adopted monday.com to unify tech workflows. OKRs standardised, Kanban views for developers, Gantt charts for PMO. 517 hours saved monthly.', quote_text: "monday.com allowed us to re-think, re-design and re-establish our process, and it's given back in spades.", quote_author: 'Grant Currey', quote_title: 'CTO Corporate ANZ, Flight Centre', impact_metrics: [{ value: '8x', label: 'ROI' }, { value: '$17.4K', label: 'saved per month' }, { value: '517', label: 'hours saved per month' }], partner: '', is_public_approved: true },
  { company_name: 'Datacom', industry: 'Technology', location: 'Australia & New Zealand', region: 'APJ', products_used: ['Work management'], challenge: "Datacom's CMD marketing team spanned multiple countries but relied on inefficient tools. Campaigns overlapped and resources were wasted.", solution: 'Datacom adopted monday.com Work OS to unify campaign planning and improve efficiency by 25% with Microsoft Teams integration.', quote_text: "If it weren't for monday.com, these go-to-market launches would have required twice as much work and taken twice the amount of time.", quote_author: 'Xanthe Smit', quote_title: 'Marketing Manager, Datacom', impact_metrics: [{ value: '90%', label: 'adoption rate in CMD team' }, { value: '15+', label: 'hours per week saved' }, { value: '25%', label: 'increase in efficiency' }], partner: '', is_public_approved: true },
  { company_name: 'Randstad', industry: 'Retail & CPG', location: 'Australia & New Zealand', region: 'APJ', products_used: ['Work management'], challenge: "Randstad's marketing team struggled with fragmented tools, time-consuming workflows and poor visibility into value-driving work.", solution: 'Randstad adopted monday.com to streamline marketing operations and align all work to business goals. Now being scaled across APAC.', quote_text: 'Everything we do and the value it drives for our business can be reported on.', quote_author: 'Ben Rakach', quote_title: 'Head of Marketing Data, Technology & Operations, Randstad', impact_metrics: [{ value: 'Real-time', label: 'visibility improved decision-making' }, { value: 'Simplified', label: 'workflows boosting efficiency' }, { value: 'Scalable', label: 'solution replicable across APAC' }], partner: '', is_public_approved: true },
  { company_name: 'Strategix', industry: 'Education', location: 'Australia & New Zealand', region: 'APJ', products_used: ['CRM', 'Campaigns'], challenge: 'Strategix initially adopted HubSpot but the CRM proved rigid, costly and complex. Limited integration created silos and duplicate records.', solution: 'Strategix switched to monday CRM with monday campaigns for integrated email outreach. 15% YoY enrolment growth, 26x ROI.', quote_text: "With monday CRM, we're finally able to adapt the platform to our needs — not the other way around.", quote_author: 'Samuel Lobao', quote_title: 'Contract Administrator & Special Projects, Strategix', impact_metrics: [{ value: '15%', label: 'increase in student enrolments YoY' }, { value: '26x', label: 'ROI' }, { value: '25,000+', label: 'hours saved annually' }], partner: '', is_public_approved: true },
  { company_name: 'Ray White Group', industry: 'Real Estate', location: 'Australia & New Zealand', region: 'APJ', products_used: ['Work management'], challenge: 'Ray White Group supported over 1,000 franchise offices with processes fragmented across spreadsheets, Trello, Asana and manual checklists.', solution: 'monday.com adoption began organically and expanded to onboarding, marketing, compliance, events and OKR tracking. 90%+ adoption across Corporate.', quote_text: "monday.com has evolved into a trusted partner. The product is world-class and it's changed how we work across the business.", quote_author: 'Jason Alford', quote_title: 'Chief Systems Officer, Ray White Group', impact_metrics: [{ value: '22x', label: 'ROI' }, { value: '44,000+', label: 'hours saved annually' }, { value: '90%+', label: 'adoption across Ray White Corporate' }], partner: '', is_public_approved: true },
  { company_name: 'Cenversa', industry: 'Retail & CPG', location: 'Australia & New Zealand', region: 'APJ', products_used: ['CRM'], challenge: "Cenversa's sales team relied on spreadsheets when Salesforce proved too rigid, inaccurate and underused.", solution: 'Cenversa adopted monday CRM to replace Salesforce with a flexible, territory-driven platform. 3,500+ hours saved annually.', quote_text: "We just weren't getting value from our old CRM. With monday.com, it's a thousand times better.", quote_author: 'James Arnold', quote_title: 'Chief Operating Officer, Cenversa', impact_metrics: [{ value: '3,000+', label: 'accounts supported with stronger visibility' }, { value: '3,500+', label: 'hours saved annually' }], partner: '', is_public_approved: true },
  { company_name: 'Country Road Group', industry: 'Retail & CPG', location: 'Australia & New Zealand', region: 'APJ', products_used: ['Work management'], challenge: "Country Road Group's real estate team relied on spreadsheets to manage 15+ store planning work types across multiple brands.", solution: 'Country Road Group adopted monday work management to consolidate store planning with a 25% efficiency gain across 150+ projects.', quote_text: "Using monday.com has really helped our execution strategy. It means we don't have to use spreadsheets anymore, which is fabulous!", quote_author: 'Melanie Green', quote_title: 'Head of Real Estate, Country Road Group', impact_metrics: [{ value: '150+', label: 'projects managed at once' }, { value: '25%', label: 'increase in efficiency' }], partner: '', is_public_approved: true },
  { company_name: 'Brother International', industry: 'Technology', location: 'Singapore', region: 'APJ', products_used: ['Work management'], challenge: 'Brother International relied on spreadsheets, inboxes and shared drives to manage recruitment, KPIs and Balanced Scorecards.', solution: 'Brother adopted monday.com work management to unify HR, IT and Corporate Services. 1,500+ hours reclaimed annually.', quote_text: "monday.com is a game changer — it's reshaped how we work, helped us make faster decisions, and built a more connected, resilient organisation.", quote_author: 'Allan Cheng', quote_title: 'Deputy General Manager, Human Capital, Brother International', impact_metrics: [{ value: '50%', label: 'fewer emails and manual follow-ups' }, { value: '40%', label: 'reduction in recruitment and onboarding' }, { value: '1,500+', label: 'hours saved per year' }], partner: '', is_public_approved: true },
  { company_name: 'SPH Media', industry: 'Media & Advertising', location: 'Singapore', region: 'APJ', products_used: ['Work management'], challenge: "SPH Media's Content Lab managed complex, multi-channel campaigns through manual processes across 40 brands.", solution: 'SPH Media adopted monday.com to centralise campaign management with colour-coded dashboards, templates and automations for 130+ people.', quote_text: 'Ready-made functionality means a flexible platform that can grow and adapt with us over time.', quote_author: 'Tommy Lim', quote_title: 'Creative Director, SPH Media Content Lab', impact_metrics: [{ value: '130+', label: 'people managing work in one platform' }, { value: '40', label: 'brands reaching audiences across Asia' }, { value: 'Hundreds', label: 'of campaigns tracked in one platform' }], partner: '', is_public_approved: true },
];

// ─── AI Sync Utility ────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `You are an expert at extracting customer case studies from presentation content.

Extract ALL individual customer case studies from the following text content. Each case study typically has:
- Company name
- Challenge description
- Solution description  
- A quote with the author's name and title
- Impact metrics (numerical results like "20% increase in X", "1000+ hours saved", etc.)
- Location (country/region)
- Industry
- Products used (from: Work management, CRM, Service, Dev, Campaigns)
- Partner name (if mentioned)

Return a JSON array where each element has this exact structure:
{
  "company_name": "string",
  "industry": "string",
  "location": "string", 
  "region": "Global|NAM|EMEA|APJ|LATAM",
  "products_used": ["string"],
  "challenge": "string",
  "solution": "string",
  "quote_text": "string",
  "quote_author": "string",
  "quote_title": "string",
  "impact_metrics": [{"value": "string", "label": "string"}],
  "partner": "string or empty"
}

IMPORTANT: Return ONLY the JSON array, no markdown formatting, no explanation.

Content to extract from:
`;

async function extractCaseStudiesWithAI(
  textContent: string,
  apiKey: string
): Promise<Partial<CaseStudy>[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You extract structured data from presentation text. Always return valid JSON arrays.' },
        { role: 'user', content: EXTRACTION_PROMPT + textContent },
      ],
      temperature: 0.1,
      max_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '[]';

  // Parse JSON - handle potential markdown wrapping
  const jsonStr = content.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim();
  return JSON.parse(jsonStr);
}

// ─── Company Logo Helper ────────────────────────────────────────────────────

const COMPANY_DOMAINS: Record<string, string> = {
  'whsmith': 'whsmith.co.uk',
  'tig freight': 'tigfreight.com',
  'canva': 'canva.com',
  'black mountain': 'blackmountainhr.com',
  'biopak': 'biopak.com',
  'atomic212': 'atomic212.com',
  'esker': 'esker.com',
  'vistra': 'vistra.com',
  "mcdonald's australia": 'mcdonalds.com.au',
  'giant group': 'giantgroup.com',
  'essence corp': 'essencecorp.com',
  'chinburg properties': 'chinburg.com',
  'athenahealth': 'athenahealth.com',
  'sdcoe': 'sdcoe.net',
  'eag': 'eaginc.com',
  'valmont industries': 'valmont.com',
  'city of baltimore': 'baltimorecity.gov',
  'zopa bank': 'zopa.com',
  'cape union mart': 'capeunionmart.co.za',
  'knight frank': 'knightfrank.com',
  'nutrition warehouse': 'nutritionwarehouse.com.au',
  "grill'd": 'grilld.com.au',
  'chobani australia': 'chobani.com.au',
  'chobani': 'chobani.com',
  'the back room': 'thebackroom.ph',
  'unilever international': 'unilever.com',
  'freedom furniture': 'freedom.com.au',
  'tennis australia': 'tennis.com.au',
  'coles 360': 'coles.com.au',
  'britax': 'britax.com.au',
  'readytech': 'readytech.com.au',
  'hbf': 'hbf.com.au',
  'officeworks': 'officeworks.com.au',
  'luxie tech': 'luxietech.com.au',
  'flight centre': 'flightcentre.com.au',
  'datacom': 'datacom.com',
  'randstad': 'randstad.com',
  'strategix': 'strategix.com.au',
  'ray white group': 'raywhite.com',
  'cenversa': 'cenversa.com.au',
  'country road group': 'countryroad.com.au',
  'brother international': 'brother.com',
  'sph media': 'sph.com.sg',
};

function getCompanyLogoUrl(companyName: string, companyLogo?: string): string {
  if (companyLogo && companyLogo.trim()) return companyLogo;
  const domain = COMPANY_DOMAINS[companyName.toLowerCase()];
  if (domain) return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  // Fallback: try guessing domain from company name
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
  return `https://www.google.com/s2/favicons?domain=${slug}.com&sz=128`;
}

const REGION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Global': { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/25' },
  'NAM': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25' },
  'EMEA': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/25' },
  'APJ': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/25' },
  'LATAM': { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/25' },
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

function ImpactMetricEditor({
  metrics,
  onChange,
}: {
  metrics: CaseStudyImpactMetric[];
  onChange: (m: CaseStudyImpactMetric[]) => void;
}) {
  return (
    <div className="space-y-2">
      {metrics.map((m, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={m.value}
            onChange={e => {
              const updated = [...metrics];
              updated[i] = { ...m, value: e.target.value };
              onChange(updated);
            }}
            placeholder="20%"
            className="w-24 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-indigo-500 outline-none"
          />
          <input
            type="text"
            value={m.label}
            onChange={e => {
              const updated = [...metrics];
              updated[i] = { ...m, label: e.target.value };
              onChange(updated);
            }}
            placeholder="increase in sales"
            className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-indigo-500 outline-none"
          />
          <button
            onClick={() => onChange(metrics.filter((_, j) => j !== i))}
            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...metrics, { value: '', label: '' }])}
        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> Add metric
      </button>
    </div>
  );
}

function CompanyLogo({ name, logo, size = 40 }: { name: string; logo?: string; size?: number }) {
  const [error, setError] = useState(false);
  const url = getCompanyLogoUrl(name, logo);

  if (error) {
    return (
      <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}>
        <span className="font-bold text-indigo-400" style={{ fontSize: size * 0.4 }}>
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      className="rounded-xl bg-white object-contain flex-shrink-0"
      style={{ width: size, height: size, padding: size * 0.1 }}
      onError={() => setError(true)}
    />
  );
}

function CaseStudyCard({
  cs,
  onEdit,
  onDelete,
  onToggleApproval,
}: {
  cs: CaseStudy;
  onEdit: () => void;
  onDelete: () => void;
  onToggleApproval: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const regionStyle = REGION_COLORS[cs.region] || REGION_COLORS['Global'];

  return (
    <div className="bg-gray-900/80 rounded-2xl border border-gray-800/60 overflow-hidden hover:border-gray-700/80 transition-all group">
      {/* Main row */}
      <div className="p-5 flex gap-4">
        {/* Logo */}
        <CompanyLogo name={cs.company_name} logo={cs.company_logo} size={48} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top line: name + badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-white font-semibold text-base">{cs.company_name}</h3>
            {cs.region && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${regionStyle.bg} ${regionStyle.text} ${regionStyle.border}`}>
                {cs.region}
              </span>
            )}
            {cs.is_public_approved ? (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <Check className="w-3 h-3" /> Approved
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-500 border border-gray-700/50">
                Draft
              </span>
            )}
          </div>

          {/* Meta: industry + location */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            {cs.industry && (
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />{cs.industry}
              </span>
            )}
            {cs.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />{cs.location}
              </span>
            )}
            {cs.partner && (
              <span className="flex items-center gap-1.5 text-gray-500">
                Partner: <span className="text-gray-400">{cs.partner}</span>
              </span>
            )}
          </div>

          {/* Products used */}
          {cs.products_used.length > 0 && (
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {cs.products_used.map(p => (
                <span key={p} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 font-medium">
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* Impact metrics - horizontal pills */}
          {cs.impact_metrics.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {cs.impact_metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
                  <span className="text-sm font-bold text-emerald-400">{m.value}</span>
                  <span className="text-xs text-gray-400">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onToggleApproval} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors" title={cs.is_public_approved ? 'Revoke' : 'Approve'}>
            {cs.is_public_approved ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-emerald-400" />}
          </button>
          <button onClick={onEdit} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-500 hover:text-white">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-900/30 rounded-lg transition-colors text-gray-500 hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quote - always visible if exists (collapsible area below) */}
      {cs.quote_text && (
        <div className="px-5 pb-4 -mt-1">
          <div className="relative bg-gray-800/40 rounded-xl p-3.5 border-l-2 border-purple-500/40">
            <Quote className="absolute top-2 right-3 w-5 h-5 text-purple-500/15" />
            <p className="text-sm text-gray-300 italic leading-relaxed line-clamp-2 pr-6">
              &ldquo;{cs.quote_text}&rdquo;
            </p>
            {cs.quote_author && (
              <p className="text-xs text-gray-500 mt-1.5">
                — <span className="text-gray-400">{cs.quote_author}</span>
                {cs.quote_title ? <span className="text-gray-600">, {cs.quote_title}</span> : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/40 transition-colors border-t border-gray-800/40"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? 'Show less' : 'Show details'}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 space-y-3">
          {cs.challenge && (
            <div>
              <h4 className="text-xs text-amber-400/80 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Challenge
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">{cs.challenge}</p>
            </div>
          )}
          {cs.solution && (
            <div>
              <h4 className="text-xs text-emerald-400/80 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Check className="w-3 h-3" /> Solution
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">{cs.solution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Case Study Form ────────────────────────────────────────────────────────

const emptyCaseStudy: Partial<CaseStudy> = {
  company_name: '', company_logo: '', industry: '', location: '', region: '',
  products_used: [], challenge: '', solution: '',
  quote_text: '', quote_author: '', quote_title: '',
  impact_metrics: [], partner: '', is_public_approved: false,
};

function CaseStudyForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<CaseStudy>;
  onSave: (cs: Partial<CaseStudy>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<CaseStudy>>({ ...emptyCaseStudy, ...initial });

  const toggleProduct = (p: string) => {
    const current = form.products_used || [];
    setForm({
      ...form,
      products_used: current.includes(p) ? current.filter(x => x !== p) : [...current, p],
    });
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Company Name *</label>
          <input type="text" value={form.company_name || ''} onChange={e => setForm({ ...form, company_name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Industry</label>
          <select value={form.industry || ''} onChange={e => setForm({ ...form, industry: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none">
            <option value="">Select...</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Location</label>
          <input type="text" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Worldwide, USA, Australia"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Region</label>
          <select value={form.region || ''} onChange={e => setForm({ ...form, region: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none">
            <option value="">Select...</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Partner</label>
          <input type="text" value={form.partner || ''} onChange={e => setForm({ ...form, partner: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Company Logo URL</label>
          <input type="text" value={form.company_logo || ''} onChange={e => setForm({ ...form, company_logo: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
        </div>
      </div>

      {/* Products Used */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">Products Used</label>
        <div className="flex gap-2 flex-wrap">
          {PRODUCTS.map(p => (
            <button key={p} onClick={() => toggleProduct(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                (form.products_used || []).includes(p)
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge & Solution */}
      <div>
        <label className="block text-gray-400 text-sm mb-1">Challenge</label>
        <textarea value={form.challenge || ''} onChange={e => setForm({ ...form, challenge: e.target.value })} rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none resize-none" />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-1">Solution</label>
        <textarea value={form.solution || ''} onChange={e => setForm({ ...form, solution: e.target.value })} rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none resize-none" />
      </div>

      {/* Quote */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Quote</label>
          <textarea value={form.quote_text || ''} onChange={e => setForm({ ...form, quote_text: e.target.value })} rows={2}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Quote Author</label>
            <input type="text" value={form.quote_author || ''} onChange={e => setForm({ ...form, quote_author: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Author Title</label>
            <input type="text" value={form.quote_title || ''} onChange={e => setForm({ ...form, quote_title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">Impact Metrics</label>
        <ImpactMetricEditor metrics={(form.impact_metrics || []) as CaseStudyImpactMetric[]} onChange={m => setForm({ ...form, impact_metrics: m })} />
      </div>

      {/* Public Approval */}
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        <div>
          <span className="text-white font-medium text-sm">Approved for public use</span>
          <p className="text-gray-500 text-xs mt-0.5">Allow this case study to appear in public-facing sections</p>
        </div>
        <button onClick={() => setForm({ ...form, is_public_approved: !form.is_public_approved })}
          className={`relative w-12 h-6 rounded-full transition-colors ${form.is_public_approved ? 'bg-green-600' : 'bg-gray-600'}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.is_public_approved ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
        <button onClick={() => onSave(form)} disabled={saving || !form.company_name?.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-white font-medium transition-colors">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Editor ────────────────────────────────────────────────────────────

interface CaseStudiesEditorProps {
  onBack: () => void;
}

export function CaseStudiesEditor({ onBack }: CaseStudiesEditorProps) {
  const [activeTab, setActiveTab] = useState<'studies' | 'sources'>('studies');
  const [editingStudy, setEditingStudy] = useState<Partial<CaseStudy> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterApproval, setFilterApproval] = useState<'' | 'approved' | 'not_approved'>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sources, loading: sourcesLoading, addSource, updateSource, deleteSource, refetch: refetchSources } = useCaseStudySources();
  const { caseStudies, loading: studiesLoading, addCaseStudy, updateCaseStudy, deleteCaseStudy, bulkAddCaseStudies, refetch: refetchStudies } = useCaseStudies();

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // ── Seed from presentation data ──
  const [seeding, setSeeding] = useState(false);
  const handleSeedFromPresentation = async () => {
    setSeeding(true);
    try {
      const existingNames = new Set(caseStudies.map(cs => cs.company_name.toLowerCase()));
      const toImport = PRESENTATION_CASE_STUDIES.filter(
        cs => !existingNames.has((cs.company_name || '').toLowerCase())
      );

      if (toImport.length === 0) {
        showMessage('success', `All ${PRESENTATION_CASE_STUDIES.length} case studies are already imported`);
        setSeeding(false);
        return;
      }

      await bulkAddCaseStudies(toImport);
      showMessage('success', `Imported ${toImport.length} case studies from the presentation (${PRESENTATION_CASE_STUDIES.length - toImport.length} already existed)`);
    } catch (err: any) {
      showMessage('error', `Import failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  // ── Scan website URL ──
  const [urlInput, setUrlInput] = useState('');
  const [scanningUrl, setScanningUrl] = useState(false);

  const handleScanUrl = async () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!apiKey.trim()) {
      setShowApiKeyInput(true);
      showMessage('error', 'Please enter your OpenAI API key first');
      return;
    }

    setScanningUrl(true);
    try {
      // Add source entry for the URL
      await addSource({
        filename: url,
        file_url: url,
        file_type: 'other' as any,
      });

      // Fetch page content via a CORS proxy or direct fetch
      let pageText = '';
      try {
        const res = await fetch(url);
        const html = await res.text();
        // Strip HTML tags to get plain text
        const doc = new DOMParser().parseFromString(html, 'text/html');
        // Remove scripts and styles
        doc.querySelectorAll('script, style, nav, footer, header').forEach(el => el.remove());
        pageText = doc.body?.textContent || '';
        // Clean up whitespace
        pageText = pageText.replace(/\s+/g, ' ').trim();
      } catch {
        // If direct fetch fails (CORS), try via allorigins proxy
        try {
          const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
          const html = await proxyRes.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          doc.querySelectorAll('script, style, nav, footer, header').forEach(el => el.remove());
          pageText = doc.body?.textContent || '';
          pageText = pageText.replace(/\s+/g, ' ').trim();
        } catch (proxyErr: any) {
          throw new Error(`Could not fetch URL content: ${proxyErr.message}. The website may block external access.`);
        }
      }

      if (!pageText || pageText.length < 50) {
        throw new Error('Could not extract meaningful text from the URL');
      }

      // Limit text to avoid token limits
      const truncatedText = pageText.slice(0, 30000);

      // Extract case studies via AI
      const extracted = await extractCaseStudiesWithAI(truncatedText, apiKey);

      if (extracted.length === 0) {
        throw new Error('No case studies found on this page');
      }

      // Find the source we just added (latest one)
      await refetchSources();
      const latestSources = (await supabase.from('case_study_sources').select('id').eq('file_url', url).limit(1)).data;
      const sourceId = latestSources?.[0]?.id || null;

      const withSource = extracted.map(cs => ({ ...cs, source_id: sourceId }));
      await bulkAddCaseStudies(withSource);

      if (sourceId) {
        await updateSource(sourceId, { status: 'synced', extracted_count: extracted.length });
      }

      showMessage('success', `Extracted ${extracted.length} case studies from URL`);
      setUrlInput('');
      refetchStudies();
    } catch (err: any) {
      showMessage('error', `URL scan failed: ${err.message}`);
    } finally {
      setScanningUrl(false);
    }
  };

  // ── Upload source file ──
  const handleUploadSource = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = ['pdf', 'pptx', 'docx'].includes(ext) ? ext : 'other';

    try {
      const fileName = `case-studies/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('Vibe').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('Vibe').getPublicUrl(fileName);
      await addSource({
        filename: file.name,
        file_url: data.publicUrl,
        file_type: fileType as any,
      });
      showMessage('success', `Uploaded "${file.name}" successfully`);
    } catch (err: any) {
      showMessage('error', `Upload failed: ${err.message}`);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Sync source with AI ──
  const handleSync = async (source: CaseStudySource) => {
    if (!apiKey.trim()) {
      setShowApiKeyInput(true);
      showMessage('error', 'Please enter your OpenAI API key first');
      return;
    }

    setSyncing(source.id);
    try {
      await updateSource(source.id, { status: 'syncing' });

      // Fetch the file content (for PDFs we need to get text)
      const response = await fetch(source.file_url);
      const text = await response.text();

      if (!text || text.length < 100) {
        throw new Error('Could not extract text from file. Please ensure the file is accessible.');
      }

      // Extract case studies via AI
      const extracted = await extractCaseStudiesWithAI(text, apiKey);

      if (extracted.length === 0) {
        throw new Error('No case studies found in the document');
      }

      // Add source_id to each extracted study
      const withSource = extracted.map(cs => ({ ...cs, source_id: source.id }));
      await bulkAddCaseStudies(withSource);

      await updateSource(source.id, {
        status: 'synced',
        extracted_count: extracted.length,
      });

      showMessage('success', `Extracted ${extracted.length} case studies from "${source.filename}"`);
      refetchStudies();
    } catch (err: any) {
      await updateSource(source.id, { status: 'error', error_message: err.message });
      showMessage('error', `Sync failed: ${err.message}`);
    } finally {
      setSyncing(null);
    }
  };

  // ── Save case study ──
  const handleSaveCaseStudy = async (cs: Partial<CaseStudy>) => {
    setSaving(true);
    try {
      if (isNew) {
        await addCaseStudy(cs);
        showMessage('success', `Added "${cs.company_name}"`);
      } else if (editingStudy?.id) {
        await updateCaseStudy(editingStudy.id, cs);
        showMessage('success', `Updated "${cs.company_name}"`);
      }
      setEditingStudy(null);
      setIsNew(false);
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Filter case studies ──
  const filteredStudies = caseStudies.filter(cs => {
    if (filterIndustry && cs.industry !== filterIndustry) return false;
    if (filterRegion && cs.region !== filterRegion) return false;
    if (filterApproval === 'approved' && !cs.is_public_approved) return false;
    if (filterApproval === 'not_approved' && cs.is_public_approved) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return cs.company_name.toLowerCase().includes(q)
        || cs.industry.toLowerCase().includes(q)
        || cs.quote_text.toLowerCase().includes(q);
    }
    return true;
  });

  // ── Edit mode ──
  if (editingStudy) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setEditingStudy(null); setIsNew(false); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h2 className="text-xl font-bold text-white">{isNew ? 'Add Case Study' : `Edit: ${editingStudy.company_name}`}</h2>
        </div>
        <CaseStudyForm initial={editingStudy} onSave={handleSaveCaseStudy} onCancel={() => { setEditingStudy(null); setIsNew(false); }} saving={saving} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Customer Case Studies</h2>
            <p className="text-gray-400 text-sm">{caseStudies.length} case studies · {sources.length} sources</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {message && (
            <span className={`text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</span>
          )}
          {caseStudies.length === 0 && (
            <button onClick={handleSeedFromPresentation} disabled={seeding}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm transition-colors disabled:opacity-50">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
              {seeding ? 'Importing...' : 'Import from Presentation'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab('studies')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'studies' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
          Case Studies ({caseStudies.length})
        </button>
        <button onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sources' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
          Sources ({sources.length})
        </button>
      </div>

      {/* ── Sources Tab ── */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          {/* API Key Input */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-white font-medium text-sm">OpenAI API Key</h3>
                <p className="text-gray-500 text-xs">Required for AI-powered case study extraction</p>
              </div>
              <button onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-xs text-indigo-400 hover:text-indigo-300">
                {showApiKeyInput ? 'Hide' : apiKey ? 'Change' : 'Set key'}
              </button>
            </div>
            {showApiKeyInput && (
              <div className="flex gap-2 mt-2">
                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 outline-none" />
                <button onClick={() => { setShowApiKeyInput(false); if (apiKey) showMessage('success', 'API key set'); }}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm">Save</button>
              </div>
            )}
            {!showApiKeyInput && apiKey && (
              <span className="text-xs text-green-400">Key configured (sk-...{apiKey.slice(-4)})</span>
            )}
          </div>

          {/* Add Sources */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <h3 className="text-white font-medium text-sm mb-3">Add Case Studies Source</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload file */}
              <div className="flex flex-col gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                  <Upload className="w-4 h-4 text-indigo-400" /> Upload File
                </div>
                <p className="text-gray-500 text-xs">Upload PDF, PPTX, or DOCX presentations</p>
                <input ref={fileInputRef} type="file" accept=".pdf,.pptx,.docx" onChange={handleUploadSource} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm font-medium transition-colors mt-auto">
                  <FileText className="w-4 h-4" /> Choose File
                </button>
              </div>

              {/* Scan URL */}
              <div className="flex flex-col gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                  <Globe className="w-4 h-4 text-purple-400" /> Scan Website
                </div>
                <p className="text-gray-500 text-xs">Extract case studies from a webpage URL</p>
                <div className="flex gap-2 mt-auto">
                  <div className="relative flex-1">
                    <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleScanUrl(); }}
                      placeholder="https://monday.com/customers/..."
                      className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 outline-none" />
                  </div>
                  <button onClick={handleScanUrl} disabled={scanningUrl || !urlInput.trim()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap">
                    {scanningUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
                    {scanningUrl ? 'Scanning...' : 'Scan'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sources list */}
          {sourcesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
              <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No sources yet</p>
              <p className="text-gray-500 text-sm">Upload a file or scan a website URL above to extract case studies with AI</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map(src => {
                const isSyncing = syncing === src.id;
                const sourceStudies = caseStudies.filter(cs => cs.source_id === src.id);
                return (
                  <div key={src.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {src.file_url.startsWith('http') && src.file_type === 'other'
                          ? <Globe className="w-8 h-8 text-purple-400 flex-shrink-0" />
                          : <FileText className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                        }
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{src.filename}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{src.file_type === 'other' && src.file_url.startsWith('http') ? 'URL' : src.file_type.toUpperCase()}</span>
                            <span className={`px-1.5 py-0.5 rounded ${
                              src.status === 'synced' ? 'bg-green-500/20 text-green-400' :
                              src.status === 'syncing' ? 'bg-blue-500/20 text-blue-400' :
                              src.status === 'error' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-700 text-gray-400'
                            }`}>{src.status}</span>
                            {src.extracted_count > 0 && <span>{src.extracted_count} case studies extracted</span>}
                          </div>
                          {src.status === 'error' && src.error_message && (
                            <p className="text-xs text-red-400 mt-1">{src.error_message}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <a href={src.file_url} target="_blank" rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors" title="View file">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleSync(src)} disabled={isSyncing}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm disabled:opacity-50 transition-colors"
                          title="Extract case studies with AI">
                          {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          {isSyncing ? 'Syncing...' : 'Sync'}
                        </button>
                        <button onClick={() => deleteSource(src.id)}
                          className="p-2 hover:bg-red-900/30 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Show extracted studies from this source */}
                    {sourceStudies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <p className="text-xs text-gray-500 mb-2">Extracted case studies:</p>
                        <div className="flex flex-wrap gap-2">
                          {sourceStudies.map(cs => (
                            <button key={cs.id} onClick={() => { setEditingStudy(cs); setIsNew(false); setActiveTab('studies'); }}
                              className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 rounded-lg text-xs text-gray-300 hover:bg-gray-700 transition-colors">
                              <Building2 className="w-3 h-3" /> {cs.company_name}
                              {cs.is_public_approved && <Check className="w-3 h-3 text-green-400" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Case Studies Tab ── */}
      {activeTab === 'studies' && (
        <div className="space-y-5">
          {/* Stats Overview */}
          {caseStudies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total', value: caseStudies.length, color: 'text-white' },
                ...REGIONS.map(r => ({
                  label: r,
                  value: caseStudies.filter(cs => cs.region === r).length,
                  color: REGION_COLORS[r]?.text || 'text-gray-400',
                })).filter(s => s.value > 0),
                { label: 'Approved', value: caseStudies.filter(cs => cs.is_public_approved).length, color: 'text-emerald-400' },
              ].map(stat => (
                <button key={stat.label}
                  onClick={() => {
                    if (stat.label === 'Approved') { setFilterApproval('approved'); setFilterRegion(''); }
                    else if (stat.label === 'Total') { setFilterRegion(''); setFilterApproval(''); }
                    else { setFilterRegion(stat.label); setFilterApproval(''); }
                  }}
                  className="bg-gray-900/60 rounded-xl border border-gray-800/50 p-3 text-center hover:border-gray-700 transition-colors"
                >
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </button>
              ))}
            </div>
          )}

          {/* Search & Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-9 pr-3 py-2.5 bg-gray-900/60 border border-gray-800/50 rounded-xl text-white text-sm focus:border-indigo-500 outline-none placeholder-gray-600" />
            </div>
            <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
              className="px-3 py-2.5 bg-gray-900/60 border border-gray-800/50 rounded-xl text-gray-300 text-sm focus:border-indigo-500 outline-none cursor-pointer">
              <option value="">All Regions</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
              className="px-3 py-2.5 bg-gray-900/60 border border-gray-800/50 rounded-xl text-gray-300 text-sm focus:border-indigo-500 outline-none cursor-pointer">
              <option value="">All Industries</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={filterApproval} onChange={e => setFilterApproval(e.target.value as any)}
              className="px-3 py-2.5 bg-gray-900/60 border border-gray-800/50 rounded-xl text-gray-300 text-sm focus:border-indigo-500 outline-none cursor-pointer">
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="not_approved">Draft</option>
            </select>
            <div className="flex-1" />
            <button onClick={() => { setEditingStudy(emptyCaseStudy); setIsNew(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium text-sm transition-colors flex-shrink-0 shadow-lg shadow-indigo-900/20">
              <Plus className="w-4 h-4" /> Add Manually
            </button>
          </div>

          {/* Studies list */}
          {studiesLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm text-gray-500">Loading case studies...</p>
              </div>
            </div>
          ) : filteredStudies.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-b from-gray-900/60 to-gray-950/60 rounded-2xl border border-gray-800/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-indigo-400/60" />
              </div>
              <p className="text-white font-medium text-lg mb-1">
                {caseStudies.length === 0 ? 'No case studies yet' : 'No matching results'}
              </p>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {caseStudies.length === 0
                  ? 'Get started by importing case studies from a presentation or adding them manually'
                  : 'Try adjusting your search or filters to find what you\'re looking for'}
              </p>
              {caseStudies.length === 0 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button onClick={handleSeedFromPresentation} disabled={seeding}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all disabled:opacity-50 shadow-lg shadow-purple-900/30">
                    {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
                    {seeding ? 'Importing...' : 'Import 42 Case Studies'}
                  </button>
                  <button onClick={() => { setEditingStudy(emptyCaseStudy); setIsNew(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/60 rounded-xl text-gray-300 font-medium transition-all">
                    <Plus className="w-4 h-4" /> Add Manually
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudies.map(cs => (
                <CaseStudyCard
                  key={cs.id}
                  cs={cs}
                  onEdit={() => { setEditingStudy(cs); setIsNew(false); }}
                  onDelete={async () => {
                    if (deleteConfirm === cs.id) {
                      await deleteCaseStudy(cs.id);
                      setDeleteConfirm(null);
                      showMessage('success', `Deleted "${cs.company_name}"`);
                    } else {
                      setDeleteConfirm(cs.id);
                      setTimeout(() => setDeleteConfirm(null), 3000);
                    }
                  }}
                  onToggleApproval={async () => {
                    await updateCaseStudy(cs.id, { is_public_approved: !cs.is_public_approved });
                    showMessage('success', cs.is_public_approved ? 'Approval revoked' : 'Approved for public use');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
