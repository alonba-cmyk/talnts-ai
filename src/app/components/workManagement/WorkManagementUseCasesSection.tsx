'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, CheckCircle2, MessageCircle, ArrowRight, Zap, Clock, X } from 'lucide-react';
import { DEPARTMENTS, JTBD_ICONS, type Department } from './wmDepartmentData';
import { SQUAD_DEPARTMENTS } from './squadData';
import { JTBD_BG_MAP } from './jtbdBgMap';
import { useDesignAssets } from '@/hooks/useSupabase';
import { WorkManagementAgenticUseCases } from './WorkManagementAgenticUseCases';

const JTBD_BG_PEEK: Set<string> = new Set([
  'Generate creative assets',
  'Plan campaign launches',
  'Analyze campaign ROI',
  'Manage content calendar',
  'Track brand consistency',
]);

// Overrides objectPosition for specific JTBD background images
const JTBD_BG_POSITION: Record<string, string> = {
  'Generate creative assets': 'right center',
};

/* ─── Dual-mode image transforms (poster card vs expanded panel) ─── */

type ImageTransform = { position: string; zoom: number };

const DEFAULT_POSTER_TRANSFORM: ImageTransform = {
  position: '50% 3%',
  zoom: 130,
};

const DEFAULT_EXPANDED_TRANSFORM: ImageTransform = {
  position: '25,0',   // panX=25 → board appears at 75% from left (right side)
  zoom: 120,           // scale = 1.2x
};

// Maps specific JTBDs to the index of the most fitting agent within their department
const JTBD_AGENT_IDX_MAP: Record<string, number> = {
  // Marketing
  'Plan campaign launches': 0,       // Assets Generator — builds the plan
  'Generate creative assets': 0,     // Assets Generator — obvious fit
  'Analyze campaign ROI': 2,         // Campaign Optimizer — analyses performance
  'Manage content calendar': 0,      // Assets Generator — plans content
  'Track brand consistency': 2,      // Campaign Optimizer — monitors brand
  // Sales
  'Qualify inbound leads': 0,        // Risk analyzer — scoring leads
  'Track deal pipeline': 0,
  'Forecast quarterly revenue': 0,
  'Automate follow-ups': 1,          // Assets Generator — building sequences
  'Prepare sales proposals': 1,
};

export type WmUseCasesVariant = 'tabbed_cards' | 'tabbed_cards_c' | 'tabbed_cards_d' | 'tabbed_cards_e' | 'tabbed_cards_f' | 'accordion' | 'marquee' | 'matrix' | 'agentic_flow';

interface WorkManagementUseCasesSectionProps {
  variant?: WmUseCasesVariant;
  isDark?: boolean;
  jtbdBgOverrides?: Record<string, string>;
  jtbdPositionOverrides?: Record<string, string>;
  jtbdZoomOverrides?: Record<string, number>;
  jtbdGlobalPosterPos?: string;
  jtbdGlobalPosterZoom?: number;
  jtbdGlobalExpandedPos?: string;
  jtbdGlobalExpandedZoom?: number;
  jtbdExpandedOverlayOpacity?: number;
}

/* ─── Scenario data types ─── */
type DeliverableType = 'campaign_plan' | 'creative_assets' | 'roi_chart' | 'content_calendar' | 'brand_audit';

type JtbdScenario = {
  humanRequest: string;
  agentSteps: string[];
  result: string;
  valueBadge: string;
  timeSaved: string;
  deliverableType?: DeliverableType;
  agentIntroMessage?: string;
  humanRole?: string;
  beforeLine?: string;
};

/* ─── All 40 JTBD scenarios ─── */
const JTBD_SCENARIOS: Record<string, JtbdScenario> = {
  /* ── Marketing ── */
  'Campaign plans that build themselves': {
    beforeLine: 'Manually build campaign plans for weeks',
    humanRequest: "We're launching Q4 — can you build the full campaign plan?",
    agentSteps: ['Created campaign brief from brand guidelines', 'Mapped timeline across 6 channels', 'Assigned tasks to team members', 'Set up tracking board with milestones'],
    result: 'Complete campaign plan with tasks, owners, and deadlines',
    valueBadge: '5x faster',
    timeSaved: '2 hrs vs. full day',
    deliverableType: 'campaign_plan',
  },
  'Creative assets, no designer needed': {
    beforeLine: 'Brief designers, wait days for assets',
    humanRequest: "I need 8 ad variations for our summer sale — different formats.",
    agentSteps: ['Pulled brand colors and fonts from asset library', 'Generated copy variants for each format', 'Produced images in 4 sizes (story, feed, banner, display)', 'Organized in shared folder by channel'],
    result: 'Ready-to-publish creative assets across all formats',
    valueBadge: '8x faster',
    timeSaved: '45 min vs. 6 hours',
    deliverableType: 'creative_assets',
    agentIntroMessage: "I'll create format-specific assets for each channel using your brand kit. Starting with Instagram Story, Feed, Banner, and Display formats...",
    humanRole: 'Content Strategist',
  },
  'Know which campaigns actually worked': {
    beforeLine: 'Pull reports from 5 dashboards to find ROI',
    humanRequest: "Which of our Q3 campaigns actually drove revenue?",
    agentSteps: ['Pulled data from 14 active campaigns', 'Matched spend to conversion events', 'Calculated ROAS per channel and creative', 'Flagged 3 underperformers and 2 winners'],
    result: 'ROI dashboard with channel breakdown and budget recommendations',
    valueBadge: '4x faster',
    timeSaved: '15 min vs. 4 hours',
    deliverableType: 'roi_chart',
  },
  'Content calendars that fill themselves': {
    beforeLine: 'Manually slot posts across channels each quarter',
    humanRequest: "We need a content calendar for next quarter across all channels.",
    agentSteps: ['Mapped key dates and product launches', 'Generated content slots across channels', 'Drafted topic ideas per slot based on goals', 'Balanced workload across writers'],
    result: 'Full 90-day content calendar with topics, formats, and owners',
    valueBadge: '6x faster',
    timeSaved: '30 min vs. 3 hours',
    deliverableType: 'content_calendar',
  },
  'Off-brand assets caught instantly': {
    beforeLine: 'Manually review every asset against brand guidelines',
    humanRequest: "Are our recent assets actually on-brand? Flag anything off.",
    agentSteps: ['Scanned recently published assets', 'Compared against brand guidelines (fonts, colors, tone)', 'Identified assets with inconsistencies', 'Generated correction notes per asset'],
    result: 'Brand audit report with specific fixes for each flagged asset',
    valueBadge: '10x faster',
    timeSaved: '5 min vs. 2 hours',
    deliverableType: 'brand_audit',
  },

  /* ── Sales ── */
  'Qualify inbound leads': {
    humanRequest: "We got 80 leads from the webinar — which ones should we call first?",
    agentSteps: ['Scored 80 leads against ICP criteria', 'Enriched records with company size, tech stack, intent signals', 'Ranked by likelihood to convert', 'Flagged 12 hot leads for immediate outreach'],
    result: 'Prioritized lead list with score, reason, and suggested opener',
    valueBadge: '3x faster',
    timeSaved: '20 min vs. 1 hour',
  },
  'Track deal pipeline': {
    humanRequest: "What's our pipeline health — any deals at risk?",
    agentSteps: ['Pulled all open opportunities from CRM', 'Calculated days since last activity per deal', 'Flagged 5 stale deals over 14 days inactive', 'Summarized expected close dates vs. targets'],
    result: 'Pipeline health report with at-risk deals and next actions',
    valueBadge: 'Real-time',
    timeSaved: '10 min vs. 45 min',
  },
  'Forecast quarterly revenue': {
    humanRequest: "What's our realistic Q4 forecast given current pipeline?",
    agentSteps: ['Analyzed historical win rates by deal stage', 'Applied probability weights to open pipeline', 'Factored in seasonal trends from last 3 years', 'Built best-case, base, and worst-case scenarios'],
    result: 'Q4 revenue forecast with confidence ranges and key assumptions',
    valueBadge: '5x faster',
    timeSaved: '1 hr vs. half day',
  },
  'Automate follow-ups': {
    humanRequest: "I have 30 prospects who went cold — help me re-engage them.",
    agentSteps: ['Segmented prospects by industry and last touch', 'Drafted personalized re-engagement emails', 'Scheduled sends for optimal open times', 'Set follow-up reminders at 3 and 7 days'],
    result: '30 personalized sequences ready to send with tracking',
    valueBadge: '15x faster',
    timeSaved: '10 min vs. 2.5 hours',
  },
  'Prepare sales proposals': {
    humanRequest: "I need a proposal for Acme Corp — they want enterprise pricing.",
    agentSteps: ['Pulled Acme\'s firmographic data and pain points from CRM', 'Selected relevant case studies by industry', 'Generated pricing tiers with ROI projections', 'Built proposal deck with executive summary'],
    result: 'Polished proposal deck ready for review in 15 minutes',
    valueBadge: '8x faster',
    timeSaved: '15 min vs. 2 hours',
  },

  /* ── PMO ── */
  'Track portfolio progress': {
    humanRequest: "Give me a status snapshot across all 12 active projects.",
    agentSteps: ['Aggregated status from all project boards', 'Calculated completion percentages per project', 'Identified 3 projects behind schedule', 'Highlighted blockers and escalation needs'],
    result: 'Portfolio dashboard with RAG status and top blockers',
    valueBadge: 'Instant',
    timeSaved: '2 min vs. 1 hour',
  },
  'Manage resource capacity': {
    humanRequest: "Are we over-allocating anyone going into next sprint?",
    agentSteps: ['Mapped workload across 18 team members', 'Compared scheduled work to available capacity', 'Flagged 4 people over 100% allocation', 'Suggested rebalancing options'],
    result: 'Capacity report with rebalancing recommendations',
    valueBadge: '4x faster',
    timeSaved: '15 min vs. 1 hour',
  },
  'Automate status reports': {
    humanRequest: "Our Monday standup deck takes me 45 minutes every week.",
    agentSteps: ['Pulled updates from all project boards', 'Summarized milestones, risks, and blockers', 'Generated slides with progress visualizations', 'Sent draft to team for review'],
    result: 'Weekly status deck auto-generated every Friday at 4pm',
    valueBadge: '45 min saved',
    timeSaved: 'Every week, automatically',
  },
  'Align teams on goals': {
    humanRequest: "We need all teams to tie their Q4 work back to company OKRs.",
    agentSteps: ['Mapped all active projects to company OKRs', 'Flagged work with no OKR alignment', 'Generated team-level OKR summaries', 'Created shared alignment board for all leads'],
    result: 'OKR alignment view with coverage gaps and suggestions',
    valueBadge: '3x faster',
    timeSaved: '1 hr vs. half day',
  },
  'Flag project risks': {
    humanRequest: "Which projects could blow up before end of quarter?",
    agentSteps: ['Analyzed velocity, blockers, and timeline for each project', 'Scored projects by risk level (High/Med/Low)', 'Generated risk narratives with root cause analysis', 'Suggested mitigation actions per risk'],
    result: 'Risk register with 5 high-priority items and mitigation plans',
    valueBadge: '6x faster',
    timeSaved: '20 min vs. 2 hours',
  },

  /* ── IT ── */
  'Manage access requests': {
    humanRequest: "New hire Sarah starts Monday — she needs access to 12 systems.",
    agentSteps: ['Matched role to standard access profile', 'Submitted provisioning requests to 12 systems', 'Notified each system admin with due date', 'Created onboarding checklist for Sarah'],
    result: 'All access provisioned and ready before day one',
    valueBadge: '20x faster',
    timeSaved: '5 min vs. 1.5 hours',
  },
  'Monitor system uptime': {
    humanRequest: "Alert me if anything in our stack drops below 99.5% uptime.",
    agentSteps: ['Set up monitoring across 23 services', 'Defined alert thresholds per SLA tier', 'Configured escalation paths by severity', 'Built live uptime dashboard for the team'],
    result: 'Uptime monitoring live — 2 alerts triggered and resolved in hour 1',
    valueBadge: 'Always-on',
    timeSaved: 'Continuous coverage',
  },
  'Automate ticket routing': {
    humanRequest: "Our Tier-1 team spends 30% of time just routing tickets to the right person.",
    agentSteps: ['Analyzed 3 months of ticket history for patterns', 'Trained routing rules on category, urgency, and keywords', 'Assigned incoming tickets automatically', 'Flagged ambiguous tickets for human review'],
    result: '92% of tickets auto-routed — Tier-1 routing time cut by 85%',
    valueBadge: '85% faster',
    timeSaved: '3 hrs/day saved',
  },
  'Onboard new tools': {
    humanRequest: "Evaluate the top 5 project management tools for our engineering team.",
    agentSteps: ['Researched each tool against our security and integration requirements', 'Scored on 12 criteria including SSO, API, and pricing', 'Created comparison matrix with pros/cons', 'Recommended top 2 for pilot based on requirements'],
    result: 'Tool evaluation report with vendor scorecard and next steps',
    valueBadge: '5x faster',
    timeSaved: '2 hrs vs. 2 days',
  },
  'Audit security compliance': {
    humanRequest: "We have a SOC 2 audit in 6 weeks — what are our gaps?",
    agentSteps: ['Mapped current controls to SOC 2 trust criteria', 'Identified 8 control gaps across 4 categories', 'Prioritized gaps by audit risk level', 'Generated remediation plan with owners and deadlines'],
    result: 'Gap analysis report with 30-day remediation roadmap',
    valueBadge: '4x faster',
    timeSaved: '2 hrs vs. full day',
  },

  /* ── Product ── */
  'Prioritize feature backlog': {
    humanRequest: "We have 60+ features in the backlog — help us decide what goes in next sprint.",
    agentSteps: ['Scored each feature by impact, effort, and user demand', 'Weighted scores by strategic priority', 'Identified quick wins and high-value items', 'Generated prioritized shortlist with rationale'],
    result: 'Ranked backlog with top 10 items ready for sprint planning',
    valueBadge: '3x faster',
    timeSaved: '30 min vs. 1.5 hours',
  },
  'Analyze user feedback': {
    humanRequest: "We have 400 support tickets and survey responses — what are users actually asking for?",
    agentSteps: ['Ingested 400 feedback items from tickets, surveys, and reviews', 'Clustered into 12 theme groups', 'Ranked themes by frequency and sentiment', 'Mapped top themes to existing roadmap items'],
    result: 'Feedback analysis report with top 5 unmet needs and roadmap gaps',
    valueBadge: '10x faster',
    timeSaved: '30 min vs. 5 hours',
  },
  'Plan sprint capacity': {
    humanRequest: "Next sprint we have 3 people OOO — can you rebalance the plan?",
    agentSteps: ['Calculated available story points for next sprint', 'Identified items that must ship vs. can defer', 'Rebalanced workload across available team members', 'Updated sprint board and notified owners'],
    result: 'Rebalanced sprint plan with updated assignments and scope',
    valueBadge: '5x faster',
    timeSaved: '10 min vs. 1 hour',
  },
  'Track release progress': {
    humanRequest: "We ship in 2 weeks — what's the actual status?",
    agentSteps: ['Pulled completion status from all feature branches', 'Identified 4 items with unresolved blockers', 'Calculated risk to release date', 'Generated go/no-go recommendation with evidence'],
    result: 'Release readiness report — go/no-go decision in 5 minutes',
    valueBadge: 'Instant',
    timeSaved: '5 min vs. 2 hours',
  },
  'Generate product specs': {
    humanRequest: "Write the spec for the new notification center feature.",
    agentSteps: ['Gathered requirements from Figma, Slack, and Jira', 'Drafted user stories and acceptance criteria', 'Defined edge cases and error states', 'Generated full PRD with technical notes'],
    result: 'Complete PRD ready for engineering review',
    valueBadge: '4x faster',
    timeSaved: '2 hrs vs. full day',
  },

  /* ── Operations ── */
  'Optimize vendor pipeline': {
    humanRequest: "We're renewing 8 vendor contracts this quarter — help me prioritize.",
    agentSteps: ['Pulled contract values, end dates, and usage data', 'Scored vendors by business criticality and renewal risk', 'Flagged 2 contracts expiring in 30 days', 'Drafted renewal strategy per tier'],
    result: 'Vendor renewal dashboard with prioritized action list',
    valueBadge: '4x faster',
    timeSaved: '1 hr vs. half day',
  },
  'Manage procurement flow': {
    humanRequest: "Every software purchase over $5K needs approval — can we automate this?",
    agentSteps: ['Mapped current approval workflow across stakeholders', 'Built automated routing rules by spend threshold', 'Set up notification sequences for each approver', 'Created audit trail and approval history'],
    result: 'Procurement workflow live — avg approval time cut from 5 days to 1',
    valueBadge: '5x faster',
    timeSaved: '4 days → 1 day',
  },
  'Track SLA compliance': {
    humanRequest: "Are we actually meeting our SLAs with the 3 enterprise clients?",
    agentSteps: ['Pulled ticket resolution times for last 90 days', 'Calculated SLA compliance rate per client and tier', 'Identified 2 recurring breach patterns', 'Generated client-facing SLA report'],
    result: 'SLA compliance dashboard — 2 chronic issues identified and flagged',
    valueBadge: 'Real-time',
    timeSaved: 'Continuous monitoring',
  },
  'Automate onboarding': {
    humanRequest: "We onboard 3 new vendors a month — it takes 2 weeks each time.",
    agentSteps: ['Mapped onboarding steps for each vendor type', 'Created task templates for legal, IT, and finance', 'Set up automated task triggers on contract sign', 'Built vendor portal with status tracking'],
    result: 'Vendor onboarding time cut from 2 weeks to 4 days',
    valueBadge: '3x faster',
    timeSaved: '2 weeks → 4 days',
  },
  'Audit operational costs': {
    humanRequest: "Where are we leaking money in operations this quarter?",
    agentSteps: ['Pulled all operational spend from finance and procurement', 'Compared actual vs. budgeted by category', 'Identified 6 cost anomalies worth investigating', 'Ranked by savings potential'],
    result: 'Cost audit with $140K in potential savings identified',
    valueBadge: '6x faster',
    timeSaved: '30 min vs. 3 hours',
  },

  /* ── Finance ── */
  'Automate expense approval': {
    humanRequest: "Our expense approvals take a week and managers hate it.",
    agentSteps: ['Mapped approval rules by amount and category', 'Auto-approved 78% of compliant expenses', 'Routed flagged items to correct approver', 'Built audit log for finance review'],
    result: 'Avg expense approval time: 4 days → same day',
    valueBadge: '8x faster',
    timeSaved: '4 days → same day',
  },
  'Track budget vs. actuals': {
    humanRequest: "How are we tracking against budget across all 8 departments?",
    agentSteps: ['Pulled actual spend from ERP and credit cards', 'Compared to approved budget by department and category', 'Flagged 2 departments trending over budget', 'Projected year-end variance per department'],
    result: 'Budget vs. actuals dashboard with early warning alerts',
    valueBadge: 'Real-time',
    timeSaved: 'Replaces weekly manual pull',
  },
  'Forecast revenue trends': {
    humanRequest: "What's our revenue trajectory for the next 2 quarters?",
    agentSteps: ['Analyzed 24 months of revenue by segment and product', 'Identified seasonal patterns and growth drivers', 'Built 3 scenarios (base, bear, bull)', 'Validated against pipeline and market signals'],
    result: 'Revenue forecast model with scenario analysis and confidence ranges',
    valueBadge: '5x faster',
    timeSaved: '1 hr vs. half day',
  },
  'Manage invoice workflows': {
    humanRequest: "We have 200 invoices a month and 3 people processing them manually.",
    agentSteps: ['Extracted line items from incoming invoices via OCR', 'Matched against POs and contracts', 'Flagged discrepancies for human review', 'Routed approved invoices to payment queue'],
    result: 'Invoice processing time cut by 70% — only edge cases need humans',
    valueBadge: '70% faster',
    timeSaved: '3 FTE-hours → 1 FTE-hour/day',
  },
  'Ensure compliance': {
    humanRequest: "Are our financial controls actually working ahead of the Q3 audit?",
    agentSteps: ['Reviewed control documentation against regulatory framework', 'Tested 12 key controls via transaction sampling', 'Identified 3 control weaknesses', 'Generated pre-audit remediation checklist'],
    result: 'Pre-audit report — 3 weeks to fix issues before auditors arrive',
    valueBadge: '4x faster',
    timeSaved: '2 hrs vs. full day',
  },

  /* ── HR ── */
  'Streamline hiring pipeline': {
    humanRequest: "We have 40 applicants for the senior PM role — help me shortlist.",
    agentSteps: ['Screened 40 resumes against job requirements', 'Ranked by skills match, experience, and culture fit signals', 'Generated shortlist of top 8 with justification', 'Drafted personalized outreach for each'],
    result: 'Shortlist of 8 candidates with screening notes ready for interviews',
    valueBadge: '5x faster',
    timeSaved: '30 min vs. 2.5 hours',
  },
  'Onboard new employees': {
    humanRequest: "3 new hires join next Monday — set up everything they need.",
    agentSteps: ['Created personalized onboarding plans based on role', 'Provisioned system access requests for IT', 'Scheduled intro meetings with key stakeholders', 'Sent welcome kit and first-week schedule'],
    result: 'Day-one ready: access, schedule, and plan for all 3 hires',
    valueBadge: '10x faster',
    timeSaved: '15 min vs. 2.5 hours',
  },
  'Track employee engagement': {
    humanRequest: "Our last engagement survey is 6 months old — what does it actually tell us?",
    agentSteps: ['Re-analyzed survey data by team, tenure, and role', 'Identified 4 key engagement drivers and 3 risk areas', 'Compared scores to industry benchmarks', 'Generated action recommendations per manager'],
    result: 'Engagement insights report with team-level recommendations',
    valueBadge: '6x faster',
    timeSaved: '30 min vs. 3 hours',
  },
  'Manage performance reviews': {
    humanRequest: "Mid-year reviews are due in 2 weeks — how do I get the team ready?",
    agentSteps: ['Sent prep reminders to all managers and direct reports', 'Pulled goal progress data for each employee', 'Generated draft review templates with performance data', 'Tracked completion status and sent nudges'],
    result: '92% of reviews completed on time — highest rate in 3 years',
    valueBadge: '3x faster',
    timeSaved: '2 hrs vs. 6 hours of coordination',
  },
  'Automate leave requests': {
    humanRequest: "Leave approvals sit in inboxes for days — employees are frustrated.",
    agentSteps: ['Mapped approval rules by team size and coverage thresholds', 'Auto-approved 85% of requests based on rules', 'Routed edge cases to managers with context', 'Sent confirmations and calendar updates automatically'],
    result: 'Avg leave approval time: 3 days → same day',
    valueBadge: '6x faster',
    timeSaved: '3 days → same day',
  },
};

/* ─── Helper: Agent mini avatar ─── */
function AgentAvatar({
  img, fallback, bgColor, size = 'sm',
}: {
  img: string; fallback: string; bgColor: string; size?: 'sm' | 'md' | 'lg';
}) {
  const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-14 h-14' : 'w-8 h-8';
  return (
    <div
      className={`${dim} rounded-lg flex-shrink-0 overflow-hidden`}
      style={{ background: `linear-gradient(135deg, ${bgColor}cc, ${bgColor})` }}
    >
      <img
        src={img}
        alt=""
        loading="lazy"
        className="w-full h-full object-contain object-bottom"
        onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VISUAL DEMOS — Right-panel rich previews for Marketing JTBDs
   ═══════════════════════════════════════════════════════════════ */

function CampaignBoardDemo({ deptColor, isDark }: { deptColor: string; isDark: boolean }) {
  const columns = ['To Do', 'Working', 'Review', 'Done'];
  const colColors = ['#94a3b8', '#6161FF', '#f59e0b', '#10b981'];
  const allTasks = [
    { label: 'Campaign brief', target: 3 },
    { label: 'Channel timeline', target: 3 },
    { label: 'Audience research', target: 2 },
    { label: 'Creative assets', target: 1 },
    { label: 'Ad copy drafts', target: 1 },
    { label: 'Launch emails', target: 0 },
    { label: 'Budget allocation', target: 2 },
    { label: 'Performance setup', target: 0 },
  ];
  const [taskCols, setTaskCols] = useState<number[]>(allTasks.map(() => 0));
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      setTaskCols(prev => {
        const next = [...prev];
        let moved = false;
        for (let i = 0; i < next.length; i++) {
          if (next[i] < allTasks[i].target) {
            next[i]++;
            moved = true;
            break;
          }
        }
        if (!moved) clearInterval(interval);
        return next;
      });
      setCompleted(prev => Math.min(prev + 1, 24));
      step++;
      if (step >= 20) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Q4 Campaign Board</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${deptColor}18`, color: deptColor }}>
          {completed}/24 tasks
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {columns.map((col, ci) => (
          <div key={col} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colColors[ci] }} />
              <span className={`text-[9px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{col}</span>
            </div>
            <AnimatePresence>
              {allTasks.map((task, ti) =>
                taskCols[ti] === ci ? (
                  <motion.div
                    key={task.label}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-lg p-2 border"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                      borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
                    }}
                  >
                    <span className={`text-[9px] leading-tight block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {task.label}
                    </span>
                    {ci > 0 && ci < 3 && (
                      <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0' }}>
                        <div className="h-full rounded-full" style={{ width: `${ci * 33}%`, backgroundColor: colColors[ci] }} />
                      </div>
                    )}
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryAdCard({ deptColor }: { deptColor: string }) {
  return (
    <div className="w-[65px] h-[115px] rounded-lg overflow-hidden flex flex-col relative flex-shrink-0"
      style={{ background: 'linear-gradient(160deg, #ff6a00 0%, #ee0979 60%, #c0015a 100%)' }}>
      {/* Format badge */}
      <div className="absolute top-1.5 right-1.5 text-[6px] font-bold bg-black/30 text-white px-1 py-0.5 rounded-full">9:16</div>
      {/* Image area */}
      <div className="flex-1 flex items-center justify-center px-2 pt-4">
        <div className="w-full h-10 rounded bg-white/15 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white/70" />
        </div>
      </div>
      {/* Copy block */}
      <div className="px-2 pb-2 flex flex-col gap-0.5">
        <div className="text-white text-[7px] font-black tracking-wide leading-none">SUMMER SALE</div>
        <div className="text-white/80 text-[6px] font-medium">Up to 50% off</div>
        <div className="mt-0.5 bg-white rounded py-0.5 text-center">
          <span className="text-[6px] font-black" style={{ color: '#ee0979' }}>Shop Now →</span>
        </div>
      </div>
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
      />
    </div>
  );
}

function FeedAdCard({ deptColor }: { deptColor: string }) {
  return (
    <div className="w-[80px] h-[80px] rounded-lg overflow-hidden flex flex-col relative flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' }}>
      <div className="absolute top-1.5 right-1.5 text-[6px] font-bold bg-black/20 text-white/90 px-1 py-0.5 rounded-full">1:1</div>
      {/* Product image area */}
      <div className="flex-1 flex items-center justify-center px-2 pt-2">
        <div className="w-9 h-9 rounded bg-white/20 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white/70" />
        </div>
      </div>
      {/* Copy */}
      <div className="px-2 pb-2 flex flex-col gap-0.5">
        <div className="text-white text-[7px] font-black leading-none">New Arrivals</div>
        <div className="text-white/75 text-[5.5px]">Shop the season</div>
        <div className="mt-0.5 bg-white/25 rounded py-0.5 text-center border border-white/30">
          <span className="text-[5px] font-bold text-white">Shop Now →</span>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 1.4, delay: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
}

function BannerAdCard({ deptColor }: { deptColor: string }) {
  return (
    <div className="w-full h-[50px] rounded-lg overflow-hidden flex items-center relative flex-shrink-0"
      style={{ background: 'linear-gradient(90deg, #c0392b 0%, #8e44ad 100%)' }}>
      <div className="absolute top-1 right-1.5 text-[6px] font-bold bg-black/25 text-white/90 px-1 py-0.5 rounded-full">16:9</div>
      {/* Logo placeholder */}
      <div className="w-7 h-7 rounded bg-white/20 ml-2.5 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-3 h-3 text-white/70" />
      </div>
      {/* Text */}
      <div className="flex-1 px-2 flex flex-col gap-0.5">
        <div className="text-white text-[7px] font-black leading-none">Summer Sale</div>
        <div className="text-white/70 text-[5.5px]">Exclusive deals · Limited time</div>
      </div>
      {/* CTA */}
      <div className="mr-2 bg-white rounded px-2 py-1 flex-shrink-0">
        <span className="text-[6px] font-black" style={{ color: '#c0392b' }}>Shop Now</span>
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 1.4, delay: 0.8, ease: 'easeInOut' }}
      />
    </div>
  );
}

function DisplayAdCard({ deptColor }: { deptColor: string }) {
  return (
    <div className="w-[88px] h-[65px] rounded-lg overflow-hidden flex flex-col relative flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)' }}>
      <div className="absolute top-1 right-1 text-[5.5px] font-bold bg-black/25 text-white/90 px-1 py-0.5 rounded-full">Display</div>
      {/* Image row */}
      <div className="flex gap-1 px-1.5 pt-2">
        <div className="w-6 h-6 rounded bg-white/15 flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white/60" />
        </div>
        <div className="flex flex-col gap-0.5 justify-center">
          <div className="h-1 w-9 bg-white/30 rounded-full" />
          <div className="h-1 w-6 bg-white/20 rounded-full" />
        </div>
      </div>
      {/* Copy */}
      <div className="px-1.5 pt-1">
        <div className="text-white text-[6px] font-black leading-tight">Limited Time Offer</div>
        <div className="text-white/65 text-[5px] mt-0.5">Ends this weekend</div>
      </div>
      <div className="px-1.5 mt-1">
        <div className="bg-white/90 rounded py-0.5 text-center">
          <span className="text-[5px] font-black" style={{ color: '#4776e6' }}>Claim Deal →</span>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 1.4, delay: 1.1, ease: 'easeInOut' }}
      />
    </div>
  );
}

function CreativeAssetsDemo({ deptColor, isDark }: { deptColor: string; isDark: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    [400, 750, 1100, 1450].forEach((delay, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const allVisible = visibleCount >= 4;

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header label */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" style={{ color: deptColor }} />
        <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Generated assets · Summer Sale campaign
        </span>
      </div>

      {/* Story + Feed row */}
      <div className="flex gap-3 items-end">
        <AnimatePresence>
          {visibleCount >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <StoryAdCard deptColor={deptColor} />
              <p className={`text-[8px] text-center mt-1 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Story 9:16</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {visibleCount >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <FeedAdCard deptColor={deptColor} />
              <p className={`text-[8px] text-center mt-1 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Feed 1:1</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Banner */}
      <AnimatePresence>
        {visibleCount >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <BannerAdCard deptColor={deptColor} />
            <p className={`text-[8px] text-center mt-1 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Banner 16:9</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display */}
      <AnimatePresence>
        {visibleCount >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col"
          >
            <DisplayAdCard deptColor={deptColor} />
            <p className={`text-[8px] text-center mt-1 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Display</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done status */}
      <AnimatePresence>
        {allVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="mt-auto pt-1 flex items-center gap-1.5"
          >
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
              style={{ backgroundColor: `${deptColor}18`, color: deptColor }}
            >
              <CheckCircle2 className="w-3 h-3" />
              32 assets ready · Organized by channel
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoiDashboardDemo({ deptColor, isDark }: { deptColor: string; isDark: boolean }) {
  const channels = [
    { label: 'Email', roas: 4.2, pct: 84, spend: '$12K', revenue: '$50.4K', winner: true },
    { label: 'Social', roas: 2.8, pct: 56, spend: '$8K', revenue: '$22.4K', winner: false },
    { label: 'Paid Search', roas: 1.4, pct: 28, spend: '$15K', revenue: '$21K', winner: false },
    { label: 'SEO / Content', roas: 3.6, pct: 72, spend: '$5K', revenue: '$18K', winner: true },
  ];
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Q3 Campaign ROI</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${deptColor}18`, color: deptColor }}>
          14 campaigns analyzed
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex flex-col gap-3 mb-4">
        {channels.map((ch, i) => (
          <motion.div
            key={ch.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.3 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{ch.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{ch.spend} → {ch.revenue}</span>
                <span className="text-[10px] font-bold" style={{ color: ch.winner ? deptColor : isDark ? '#6b7280' : '#9ca3af' }}>
                  {ch.roas}x
                </span>
              </div>
            </div>
            <div className="h-5 rounded-lg overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0' }}>
              <motion.div
                className="h-full rounded-lg flex items-center justify-end pr-1.5"
                initial={{ width: 0 }}
                animate={{ width: `${ch.pct}%` }}
                transition={{ delay: 0.2 + 0.15 * i, duration: 0.6, ease: 'easeOut' }}
                style={{ backgroundColor: ch.winner ? deptColor : `${deptColor}50` }}
              >
                {ch.winner && <span className="text-[8px] text-white font-bold">★ Top</span>}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insight callouts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: animating ? 0 : 1, y: animating ? 8 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex gap-2"
      >
        <div className="flex-1 rounded-lg p-2.5 border" style={{ backgroundColor: `${deptColor}08`, borderColor: `${deptColor}25` }}>
          <span className="text-[9px] font-bold block" style={{ color: deptColor }}>Best performer</span>
          <span className={`text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email at 4.2x ROAS</span>
        </div>
        <div className="flex-1 rounded-lg p-2.5 border" style={{ backgroundColor: 'rgba(255,61,87,0.06)', borderColor: 'rgba(255,61,87,0.2)' }}>
          <span className="text-[9px] font-bold block text-[#FF3D57]">Needs attention</span>
          <span className={`text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Paid Search 1.4x — cut budget?</span>
        </div>
      </motion.div>
    </div>
  );
}

function ContentCalendarDemo({ deptColor, isDark }: { deptColor: string; isDark: boolean }) {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const channels = ['Blog', 'Social', 'Email', 'Video'];
  const channelColors = [deptColor, '#FF3D57', '#FFCB00', '#6161FF'];
  const grid = [
    [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  ];
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealed(prev => {
        if (prev >= 80) { clearInterval(interval); return 80; }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Q1 Content Calendar</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${deptColor}18`, color: deptColor }}>
          {Math.min(revealed, 90)} / 90 slots
        </span>
      </div>

      {/* Week headers */}
      <div className="grid grid-cols-5 gap-1 mb-1 pl-12">
        {weeks.map(w => (
          <div key={w} className={`text-[8px] font-semibold text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{w}</div>
        ))}
        <div />
      </div>

      {/* Channel rows */}
      {channels.map((ch, ri) => (
        <div key={ch} className="flex items-center gap-1 mb-1">
          <div className="w-11 flex items-center gap-1 flex-shrink-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: channelColors[ri] }} />
            <span className={`text-[8px] truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{ch}</span>
          </div>
          <div className="flex-1 grid grid-cols-5 gap-0.5">
            {[0, 1, 2, 3, 4].map(wi => {
              const cellIdx = ri * 20 + wi * 4;
              const hasDots = grid[ri]?.slice(wi * 4, wi * 4 + 5) || [];
              return (
                <div
                  key={wi}
                  className="h-6 rounded flex items-center justify-center gap-0.5"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb' }}
                >
                  {hasDots.map((d, di) =>
                    d && cellIdx + di < revealed ? (
                      <motion.div
                        key={di}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.15 }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: channelColors[ri] }}
                      />
                    ) : null
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Summary */}
      {revealed >= 60 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto pt-3 flex gap-2"
        >
          {['90 slots', '12 weeks', '4 channels'].map(label => (
            <div key={label} className="flex-1 text-center rounded-lg py-1.5" style={{ backgroundColor: `${deptColor}12` }}>
              <span className="text-[9px] font-bold" style={{ color: deptColor }}>{label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function BrandAuditDemo({ deptColor, isDark }: { deptColor: string; isDark: boolean }) {
  const assets = [
    { name: 'Q4 Hero Banner', type: 'Banner', pass: true },
    { name: 'Summer Sale Email', type: 'Email', pass: false, issue: 'Wrong font — should be Inter, found Roboto' },
    { name: 'Product Shot v2', type: 'Image', pass: true },
    { name: 'Social Story Ad', type: 'Social', pass: false, issue: 'Primary color #FF6B6B not in brand palette' },
    { name: 'Blog Header', type: 'Blog', pass: true },
    { name: 'LinkedIn Banner', type: 'Social', pass: false, issue: 'Logo placement violates spacing guidelines' },
    { name: 'App Store Screenshot', type: 'Image', pass: true },
  ];
  const [scannedCount, setScannedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScannedCount(prev => {
        if (prev >= assets.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const passed = assets.slice(0, scannedCount).filter(a => a.pass).length;
  const failed = assets.slice(0, scannedCount).filter(a => !a.pass).length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Brand Compliance Scan</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${deptColor}18`, color: deptColor }}>
          {scannedCount}/{assets.length} scanned
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {assets.map((asset, i) => (
          <AnimatePresence key={asset.name}>
            {i < scannedCount && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-lg border p-2.5 flex items-start gap-2.5"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                  borderColor: asset.pass
                    ? isDark ? 'rgba(0,210,210,0.2)' : 'rgba(0,210,210,0.3)'
                    : isDark ? 'rgba(255,61,87,0.2)' : 'rgba(255,61,87,0.3)',
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
                  style={{ backgroundColor: `${deptColor}15`, color: deptColor }}
                >
                  {asset.type[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{asset.name}</span>
                    {asset.pass ? (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00D2D2' }} />
                    ) : (
                      <X className="w-3.5 h-3.5 flex-shrink-0 text-[#FF3D57]" />
                    )}
                  </div>
                  {!asset.pass && asset.issue && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="text-[9px] mt-0.5 text-[#FF3D57]"
                    >
                      {asset.issue}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Summary badge */}
      {scannedCount >= assets.length && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex gap-2"
        >
          <div className="flex-1 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(0,210,210,0.1)' }}>
            <span className="text-[10px] font-bold text-[#00D2D2]">{passed} on-brand</span>
          </div>
          <div className="flex-1 rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(255,61,87,0.1)' }}>
            <span className="text-[10px] font-bold text-[#FF3D57]">{failed} need fixes</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

const DEMO_COMPONENTS: Record<DeliverableType, React.FC<{ deptColor: string; isDark: boolean }>> = {
  campaign_plan: CampaignBoardDemo,
  creative_assets: CreativeAssetsDemo,
  roi_chart: RoiDashboardDemo,
  content_calendar: ContentCalendarDemo,
  brand_audit: BrandAuditDemo,
};

/* ═══════════════════════════════════════════════════════════════
   EXPANDED PANEL — Full-width split view for an open JTBD
   ═══════════════════════════════════════════════════════════════ */

function getHumanMemberInfo(deptName: string, humanRole?: string) {
  const squadDept = SQUAD_DEPARTMENTS.find(
    d => d.name.toLowerCase() === deptName.toLowerCase()
  );
  if (!squadDept) return null;
  if (humanRole) {
    const member = squadDept.members.find(
      m => !m.isAgent && m.label === humanRole
    );
    if (member) return { initials: member.fallback, bgColor: member.bgColor };
  }
  const firstHuman = squadDept.members.find(m => !m.isAgent && m.role !== 'Team Lead');
  if (firstHuman) return { initials: firstHuman.fallback, bgColor: firstHuman.bgColor };
  return null;
}

function AgentIntroPhase({
  agent,
  message,
  isDark,
  deptColor,
  onFinished,
}: {
  agent: { img: string; fallback: string; bgColor: string; label: string };
  message: string;
  isDark: boolean;
  deptColor: string;
  onFinished: () => void;
}) {
  const [charIdx, setCharIdx] = useState(0);
  const finished = charIdx >= message.length;

  useEffect(() => {
    if (charIdx < message.length) {
      const timer = setTimeout(() => setCharIdx(i => i + 1), 18);
      return () => clearTimeout(timer);
    }
  }, [charIdx, message.length]);

  useEffect(() => {
    if (finished) {
      const timer = setTimeout(onFinished, 600);
      return () => clearTimeout(timer);
    }
  }, [finished, onFinished]);

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-center gap-6 px-6 py-4"
    >
      {/* Agent avatar with glow ring */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ boxShadow: [`0 0 0 0px ${deptColor}40`, `0 0 0 10px ${deptColor}15`, `0 0 0 0px ${deptColor}40`] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-2xl"
        />
        <div
          className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative z-10"
          style={{
            background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})`,
            boxShadow: `0 8px 32px ${agent.bgColor}50`,
          }}
        >
          <img
            src={agent.img}
            alt={agent.label}
            loading="lazy"
            className="w-full h-full object-contain object-bottom"
            onError={(e) => { (e.target as HTMLImageElement).src = agent.fallback; }}
          />
        </div>
      </div>

      {/* Agent name + status */}
      <div className="text-center">
        <p className={`text-[13px] font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {agent.label}
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: deptColor }}
          />
          <span className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Working on it…</span>
        </div>
      </div>

      {/* Typing bubble */}
      <div className="w-full max-w-xs">
        <div
          className="rounded-2xl px-5 py-4 text-[13px] leading-relaxed text-left"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
            color: isDark ? '#d1d5db' : '#374151',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb'}`,
          }}
        >
          {message.slice(0, charIdx)}
          {!finished && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.55 }}
              className="inline-block w-[2px] h-[14px] ml-0.5 align-middle rounded-full"
              style={{ backgroundColor: deptColor }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ExpandedJtbdPanel({
  job, scenario, agent, dept, isDark, onClose, deptAvatarUrl,
}: {
  job: string;
  scenario: JtbdScenario;
  agent: { img: string; fallback: string; bgColor: string; label: string; status: string };
  dept: Department;
  isDark: boolean;
  onClose: () => void;
  deptAvatarUrl?: string;
}) {
  const DemoComponent = scenario.deliverableType ? DEMO_COMPONENTS[scenario.deliverableType] : null;
  const jobIdx = dept.jtbd.indexOf(job);
  const Icon = JTBD_ICONS[jobIdx >= 0 ? jobIdx % JTBD_ICONS.length : 0];

  const hasIntro = !!scenario.agentIntroMessage;
  const [phase, setPhase] = useState<'intro' | 'demo'>(hasIntro ? 'intro' : 'demo');
  const handleIntroFinished = useCallback(() => setPhase('demo'), []);

  const humanInfo = getHumanMemberInfo(dept.name, scenario.humanRole);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: isDark ? '#141414' : '#fff',
        borderColor: `${dept.color}40`,
        boxShadow: `0 8px 40px ${dept.color}15`,
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${dept.color}20` }}
          >
            <Icon className="w-4 h-4" style={{ color: dept.color }} />
          </div>
          <span className={`text-lg lg:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{job}</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ backgroundColor: `${dept.color}15`, color: dept.color }}
          >
            <Zap className="w-2.5 h-2.5" />
            {scenario.valueBadge}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}
        >
          <X className="w-4 h-4" style={{ color: isDark ? '#9ca3af' : '#6b7280' }} />
        </button>
      </div>

      {/* Split content */}
      <div className="flex flex-col lg:flex-row min-h-[340px]">
        {/* Left: Use case info */}
        <div className="lg:w-[45%] p-5 flex flex-col gap-3 lg:border-r" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0' }}>
          {/* Human request */}
          <div className="flex items-start gap-2.5">
            {/* Department photo avatar */}
            <div className="flex-shrink-0 mt-0.5">
              {deptAvatarUrl ? (
                <div
                  className="w-9 h-9 rounded-full overflow-hidden"
                  style={{
                    outline: `2px solid ${dept.color}60`,
                    outlineOffset: '1px',
                  }}
                >
                  <img
                    src={deptAvatarUrl}
                    alt={scenario.humanRole ?? dept.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : humanInfo ? (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ backgroundColor: humanInfo.bgColor }}
                >
                  {humanInfo.initials}
                </div>
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6' }}
                >
                  <MessageCircle className="w-4 h-4" style={{ color: isDark ? '#9ca3af' : '#6b7280' }} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {scenario.humanRole && (
                <span className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {scenario.humanRole}
                </span>
              )}
              <div
                className="rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] leading-relaxed"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                  color: isDark ? '#d1d5db' : '#374151',
                }}
              >
                "{scenario.humanRequest}"
              </div>
            </div>
          </div>

          {/* Agent steps */}
          <div className="ml-2 flex flex-col gap-2">
            {scenario.agentSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.25 }}
                className="flex items-start gap-2"
              >
                <CheckCircle2
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: dept.color }}
                />
                <span className={`text-[12px] leading-snug ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + scenario.agentSteps.length * 0.12 + 0.1, duration: 0.25 }}
            className="rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{
              backgroundColor: `${dept.color}12`,
              border: `1px solid ${dept.color}30`,
            }}
          >
            <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: dept.color }} />
            <span className={`text-[13px] font-semibold leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {scenario.result}
            </span>
          </motion.div>

          {/* Value footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + scenario.agentSteps.length * 0.12 + 0.25, duration: 0.2 }}
            className="flex items-center justify-between pt-2 mt-auto"
          >
            <div className="flex items-center gap-2">
              <AgentAvatar img={agent.img} fallback={agent.fallback} bgColor={agent.bgColor} size="md" />
              <span className={`text-[12px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {agent.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} />
              <span className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {scenario.timeSaved}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right: Visual demo with optional intro phase */}
        <div className="lg:w-[55%] p-5">
          <AnimatePresence mode="wait">
            {phase === 'intro' && scenario.agentIntroMessage ? (
              <AgentIntroPhase
                key="intro"
                agent={agent}
                message={scenario.agentIntroMessage}
                isDark={isDark}
                deptColor={dept.color}
                onFinished={handleIntroFinished}
              />
            ) : DemoComponent ? (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="h-full"
              >
                <DemoComponent deptColor={dept.color} isDark={isDark} />
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className={`text-[12px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Visual demo coming soon
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-[2px]" style={{ backgroundColor: dept.color }} />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT 1 — Tabbed Cards with Showcase Split Panel
   Premium design: spotlight, glassmorphism, 3D tilt, bg images
   ════════════════════════════════════════════════════════════════ */

function UseCaseCard({
  job, dept, agent, scenario, index, isDark, gridMousePos, gridRef,
  onClick,
}: {
  job: string;
  dept: Department;
  agent: { img: string; fallback: string; bgColor: string; label: string; status: string };
  scenario: JtbdScenario | undefined;
  index: number;
  isDark: boolean;
  gridMousePos: { x: number; y: number };
  gridRef: React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cardMouse, setCardMouse] = useState({ x: 0, y: 0 });
  const bgImage = JTBD_BG_MAP[job];
  const isPeek = JTBD_BG_PEEK.has(job);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCardMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const tiltX = isHovered && cardRef.current
    ? ((cardMouse.y - cardRef.current.offsetHeight / 2) / (cardRef.current.offsetHeight / 2)) * -3
    : 0;
  const tiltY = isHovered && cardRef.current
    ? ((cardMouse.x - cardRef.current.offsetWidth / 2) / (cardRef.current.offsetWidth / 2)) * 3
    : 0;

  const spotlightRelX = cardRef.current
    ? gridMousePos.x - cardRef.current.offsetLeft
    : 0;
  const spotlightRelY = cardRef.current
    ? gridMousePos.y - cardRef.current.offsetTop
    : 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24, scale: 0.95, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl cursor-pointer group flex flex-col"
      style={{
        backgroundColor: isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isHovered ? `${dept.color}40` : isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb'}`,
        boxShadow: isHovered
          ? `0 8px 32px ${dept.color}18, 0 0 20px ${dept.color}10, inset 0 1px 0 rgba(255,255,255,0.06)`
          : '0 0 0 0 transparent',
        transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: 'border-color 0.3s, box-shadow 0.4s, transform 0.2s ease-out',
        willChange: 'transform',
        minHeight: '160px',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCardMouse({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
    >
      {/* Top gradient accent */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${dept.color}${isHovered ? '90' : '50'}, transparent)`,
          transition: 'background 0.3s',
        }}
      />

      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(500px circle at ${spotlightRelX}px ${spotlightRelY}px, ${dept.color}${isDark ? '0a' : '08'}, transparent 40%)`,
          opacity: gridMousePos.x !== 0 ? 1 : 0,
        }}
      />

      {isPeek ? (
        /* ── PEEK layout: square image on top, rectangle text below ── */
        <>
          {/* Square image section — overflow: visible so agent can float on the border */}
          <div className="relative w-full rounded-t-2xl" style={{ aspectRatio: '1 / 1', overflow: 'visible' }}>
            {/* Clipping wrapper for the image itself */}
            <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
              <motion.img
                src={bgImage!}
                alt=""
                className="w-full h-full object-cover object-left"
                animate={{ scale: isHovered ? 1.03 : 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ opacity: isHovered ? 0.9 : 0.75 }}
              />
            </div>

          </div>

          {/* Rectangle text section — extra top padding to make room for the floating agent */}
          <div
            className="relative z-10 flex flex-col gap-2 px-4 pb-4 rounded-b-2xl overflow-hidden"
            style={{
              paddingTop: 36,
              backgroundColor: isDark ? 'rgba(14,14,14,0.97)' : 'rgba(255,255,255,0.97)',
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}`,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className={`text-[14px] font-bold leading-tight flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {job}
              </p>
              {scenario && (
                <motion.span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                  style={{ backgroundColor: `${dept.color}18`, color: dept.color }}
                >
                  <Zap className="w-2.5 h-2.5" />
                  {scenario.valueBadge}
                </motion.span>
              )}
            </div>
            {scenario && (
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {scenario.result}
              </p>
            )}
            <span className={`text-[10px] flex items-center gap-0.5 font-medium transition-colors mt-1 ${isDark ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`}>
              See how <ChevronDown className="w-3 h-3" />
            </span>
          </div>
        </>
      ) : (
        /* ── DEFAULT layout: bg image + single content area ── */
        <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col">
          {/* Background image layer */}
          {bgImage && (
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0 transition-opacity duration-500"
              style={{ opacity: isHovered ? 0.22 : 0.11 }}
            >
              <img
                src={bgImage}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover object-top"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)',
                }}
              />
            </div>
          )}

          {!bgImage && (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none z-0 transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse at 70% 50%, ${dept.color}${isHovered ? '12' : '07'}, transparent 70%)`,
              }}
            />
          )}

          {/* Card content */}
          <div className="relative z-10 p-4 flex flex-col h-full gap-3">
            <div className="flex items-start justify-between gap-2">
              <p className={`text-[14px] font-bold leading-tight flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {job}
              </p>
              {scenario && (
                <motion.span
                  animate={isHovered ? {
                    boxShadow: [`0 0 0 0 ${dept.color}00`, `0 0 8px 2px ${dept.color}35`, `0 0 0 0 ${dept.color}00`],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                  style={{
                    backgroundColor: `${dept.color}18`,
                    color: dept.color,
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <Zap className="w-2.5 h-2.5" />
                  {scenario.valueBadge}
                </motion.span>
              )}
            </div>

            {scenario && (
              <p className={`text-[11px] leading-relaxed flex-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {scenario.result}
              </p>
            )}

            <div className="h-px" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0' }} />

            <div className="flex items-center gap-2">
              <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                <AgentAvatar img={agent.img} fallback={agent.fallback} bgColor={agent.bgColor} size="sm" />
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {agent.label}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dept.color }}
                  />
                  <p className="text-[10px] font-medium" style={{ color: dept.color }}>
                    {agent.status}
                  </p>
                </div>
              </div>
              {scenario && (
                <span className={`text-[10px] flex-shrink-0 flex items-center gap-0.5 font-medium transition-colors ${isDark ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  See how <ChevronDown className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom accent */}
      <div
        className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-2xl transition-opacity duration-300"
        style={{ backgroundColor: dept.color, opacity: isHovered ? 1 : 0 }}
      />
    </motion.div>
  );
}

function TabbedCardsVariant({ isDark }: { isDark: boolean }) {
  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const dept = DEPARTMENTS[activeDeptIdx];
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridMousePos, setGridMousePos] = useState({ x: 0, y: 0 });

  const { assets: avatarAssets } = useDesignAssets('department_avatar');
  const avatarPool = useMemo(() => avatarAssets.map(a => a.file_url), [avatarAssets]);
  const deptAvatarUrl = useMemo(() => {
    if (avatarPool.length === 0) return undefined;
    const offset = Math.floor(avatarPool.length / 2) + 2;
    return avatarPool[(activeDeptIdx + offset) % avatarPool.length];
  }, [avatarPool, activeDeptIdx]);

  const handleDeptChange = useCallback((i: number) => {
    setActiveDeptIdx(i);
    setExpandedJob(null);
  }, []);

  const handleCardClick = useCallback((job: string) => {
    setExpandedJob(prev => (prev === job ? null : job));
  }, []);

  const handleGridMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setGridMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleGridMouseLeave = useCallback(() => {
    setGridMousePos({ x: 0, y: 0 });
  }, []);

  const expandedJobIdx = expandedJob ? dept.jtbd.indexOf(expandedJob) : -1;

  return (
    <div className="relative">
      {/* Ambient background glow */}
      <motion.div
        className="absolute -inset-20 pointer-events-none z-0"
        animate={{ background: `radial-gradient(ellipse at 50% 40%, ${dept.color}08, transparent 70%)` }}
        transition={{ duration: 0.8 }}
      />

      {/* Department tab bar with sliding indicator */}
      <div className="relative z-10 flex justify-center mb-10">
        <div
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-2xl border"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(249,250,251,0.8)',
          }}
        >
          {DEPARTMENTS.map((d, i) => {
            const TabIcon = d.icon;
            const isActive = activeDeptIdx === i;
            return (
              <button
                key={d.id}
                onClick={() => handleDeptChange(i)}
                className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors duration-200 z-10"
                style={{
                  color: isActive ? (isDark ? '#fff' : '#111') : isDark ? '#6b7280' : '#9ca3af',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="dept-tab-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      backgroundColor: `${d.color}20`,
                      border: `1px solid ${d.color}50`,
                      boxShadow: `0 4px 16px ${d.color}25`,
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <TabIcon className="w-3.5 h-3.5 relative z-10" style={{ color: isActive ? d.color : undefined }} />
                <span className="relative z-10">{d.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content area */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {expandedJob && expandedJobIdx >= 0 ? (
            <motion.div
              key={`expanded-${dept.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-4"
            >
              {/* Left pill strip */}
              <div className="hidden lg:flex flex-col gap-2 w-[52px] flex-shrink-0 pt-1">
                {dept.jtbd.map((job, i) => {
                  const PillIcon = JTBD_ICONS[i % JTBD_ICONS.length];
                  const isActive = expandedJob === job;
                  return (
                    <motion.button
                      key={job}
                      layout
                      onClick={(e) => { e.stopPropagation(); handleCardClick(job); }}
                      className="w-[48px] h-[48px] rounded-xl flex items-center justify-center transition-all duration-200 border"
                      style={{
                        backgroundColor: isActive ? `${dept.color}25` : isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
                        borderColor: isActive ? `${dept.color}50` : isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
                      }}
                      title={job}
                    >
                      <PillIcon className="w-4.5 h-4.5" style={{ color: isActive ? dept.color : isDark ? '#6b7280' : '#9ca3af' }} />
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <ExpandedJtbdPanel
                    key={expandedJob}
                    job={expandedJob}
                    scenario={JTBD_SCENARIOS[expandedJob]}
                    agent={dept.agents[expandedJobIdx % dept.agents.length]}
                    dept={dept}
                    isDark={isDark}
                    onClose={() => setExpandedJob(null)}
                    deptAvatarUrl={deptAvatarUrl}
                  />
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${dept.id}`}
              ref={gridRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start relative"
              onMouseMove={handleGridMouseMove}
              onMouseLeave={handleGridMouseLeave}
            >
              {dept.jtbd.map((job, i) => {
                const agentIdx = JTBD_AGENT_IDX_MAP[job] ?? (i % dept.agents.length);
                return (
                  <UseCaseCard
                    key={job}
                    job={job}
                    dept={dept}
                    agent={dept.agents[agentIdx % dept.agents.length]}
                    scenario={JTBD_SCENARIOS[job]}
                    index={i}
                    isDark={isDark}
                    gridMousePos={gridMousePos}
                    gridRef={gridRef}
                    onClick={() => handleCardClick(job)}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT 2 — Accordion Explorer
   Expandable department rows revealing JTBD mini-cards
   ════════════════════════════════════════════════════════════════ */
function AccordionVariant({ isDark }: { isDark: boolean }) {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <div className="flex flex-col gap-2">
      {DEPARTMENTS.map((dept, i) => {
        const Icon = dept.icon;
        const isOpen = openIdx === i;
        return (
          <div
            key={dept.id}
            className="rounded-2xl border overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: isDark ? '#141414' : '#fff',
              borderColor: isOpen
                ? `${dept.color}50`
                : isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb',
            }}
          >
            {/* Row header */}
            <button
              className="w-full flex items-center gap-4 px-5 py-4 text-left group"
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  backgroundColor: isOpen ? `${dept.color}20` : isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                }}
              >
                <Icon className="w-4 h-4 transition-colors" style={{ color: isOpen ? dept.color : isDark ? '#9ca3af' : '#6b7280' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{dept.name}</p>
                <p className={`text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{dept.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1">
                  {dept.agents.slice(0, 3).map((agent, ai) => (
                    <AgentAvatar key={ai} img={agent.img} fallback={agent.fallback} bgColor={agent.bgColor} size="sm" />
                  ))}
                </div>
                <span className={`text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {dept.jtbd.length} use cases
                </span>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-300"
                  style={{ color: isDark ? '#6b7280' : '#9ca3af', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </div>
            </button>

            {/* Expandable JTBD strip */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {dept.jtbd.map((job, ji) => {
                      const JIcon = JTBD_ICONS[ji % JTBD_ICONS.length];
                      const agent = dept.agents[ji % dept.agents.length];
                      return (
                        <motion.div
                          key={job}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ji * 0.06 }}
                          className="rounded-xl border p-3.5 flex flex-col gap-2.5"
                          style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : `${dept.color}08`,
                            borderColor: `${dept.color}25`,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${dept.color}20` }}
                            >
                              <JIcon className="w-3.5 h-3.5" style={{ color: dept.color }} />
                            </div>
                            <p className={`text-[12px] font-semibold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {job}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <AgentAvatar img={agent.img} fallback={agent.fallback} bgColor={agent.bgColor} size="sm" />
                            <p className={`text-[10px] truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {agent.label}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT 3 — Rolling Marquee
   Two infinite-scroll rows of JTBD pills, opposite directions
   ════════════════════════════════════════════════════════════════ */
type MarqueePill = { job: string; dept: Department };

function MarqueeRow({
  pills, direction, isDark, speed = 40,
}: {
  pills: MarqueePill[];
  direction: 'left' | 'right';
  isDark: boolean;
  speed?: number;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const duration = pills.length * speed;
  const doubled = [...pills, ...pills];

  return (
    <div
      className="overflow-hidden py-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setHoveredIdx(null); }}
    >
      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {doubled.map((pill, i) => {
          const isHovered = hoveredIdx === i;
          const agent = pill.dept.agents[i % pill.dept.agents.length];
          return (
            <motion.div
              key={`${pill.job}-${i}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border cursor-default flex-shrink-0 transition-all duration-200"
              style={{
                backgroundColor: isHovered ? `${pill.dept.color}18` : isDark ? '#141414' : '#fff',
                borderColor: isHovered ? `${pill.dept.color}60` : isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
              }}
              animate={{ scale: isHovered ? 1.04 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pill.dept.color }} />
              <span className={`text-[13px] font-medium whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {pill.job}
              </span>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="flex items-center gap-1.5 overflow-hidden"
                >
                  <div className={`w-px h-4 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  <AgentAvatar img={agent.img} fallback={agent.fallback} bgColor={agent.bgColor} size="sm" />
                  <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: pill.dept.color }}>
                    {agent.label}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function MarqueeVariant({ isDark }: { isDark: boolean }) {
  const allPills: MarqueePill[] = DEPARTMENTS.flatMap(dept =>
    dept.jtbd.map(job => ({ job, dept }))
  );

  const mid = Math.ceil(allPills.length / 2);
  const row1 = allPills.slice(0, mid);
  const row2 = allPills.slice(mid);

  return (
    <div className="flex flex-col gap-3">
      <MarqueeRow pills={row1} direction="left" isDark={isDark} speed={32} />
      <MarqueeRow pills={row2} direction="right" isDark={isDark} speed={28} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT 4 — Matrix Grid
   Departments as columns, JTBDs as rows. Hover reveals agent.
   ════════════════════════════════════════════════════════════════ */
function MatrixVariant({ isDark }: { isDark: boolean }) {
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null);
  const maxJtbd = Math.max(...DEPARTMENTS.map(d => d.jtbd.length));

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[720px]">
        {/* Column headers */}
        <div
          className="grid mb-3"
          style={{ gridTemplateColumns: `repeat(${DEPARTMENTS.length}, minmax(0, 1fr))` }}
        >
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            return (
              <div key={dept.id} className="flex flex-col items-center gap-1.5 px-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${dept.color}18` }}>
                  <Icon className="w-4 h-4" style={{ color: dept.color }} />
                </div>
                <span className={`text-[10px] font-semibold text-center leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {dept.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Matrix rows */}
        {Array.from({ length: maxJtbd }, (_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid gap-1.5 mb-1.5"
            style={{ gridTemplateColumns: `repeat(${DEPARTMENTS.length}, minmax(0, 1fr))` }}
          >
            {DEPARTMENTS.map((dept, colIdx) => {
              const job = dept.jtbd[rowIdx];
              const isHovered = hoveredCell?.col === colIdx && hoveredCell?.row === rowIdx;
              const agent = dept.agents[rowIdx % dept.agents.length];

              if (!job) return <div key={colIdx} className="h-12 rounded-xl" />;

              return (
                <motion.div
                  key={colIdx}
                  onMouseEnter={() => setHoveredCell({ col: colIdx, row: rowIdx })}
                  onMouseLeave={() => setHoveredCell(null)}
                  animate={{ scale: isHovered ? 1.03 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="relative rounded-xl border p-2.5 cursor-default flex flex-col gap-1.5 transition-all duration-200 overflow-hidden"
                  style={{
                    backgroundColor: isHovered ? `${dept.color}15` : isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                    borderColor: isHovered ? `${dept.color}50` : isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb',
                    minHeight: 48,
                  }}
                >
                  <p className={`text-[11px] font-medium leading-snug line-clamp-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {job}
                  </p>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1"
                      >
                        <AgentAvatar img={agent.img} fallback={agent.fallback} bgColor={agent.bgColor} size="sm" />
                        <span className="text-[9px] font-medium truncate" style={{ color: dept.color }}>
                          {agent.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div
                    className="absolute inset-x-0 bottom-0 h-[2px] transition-opacity duration-200"
                    style={{ backgroundColor: dept.color, opacity: isHovered ? 1 : 0.15 }}
                  />
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SHARED TAB BAR — reused by Variants C & D
   ════════════════════════════════════════════════════════════════ */
function DeptTabBar({
  activeDeptIdx,
  onChange,
  isDark,
}: {
  activeDeptIdx: number;
  onChange: (i: number) => void;
  isDark: boolean;
}) {
  return (
    <div className="relative z-10 flex justify-center mb-10">
      <div
        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-2xl border"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(249,250,251,0.8)',
        }}
      >
        {DEPARTMENTS.map((d, i) => {
          const TabIcon = d.icon;
          const isActive = activeDeptIdx === i;
          return (
            <button
              key={d.id}
              onClick={() => onChange(i)}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors duration-200 z-10"
              style={{ color: isActive ? (isDark ? '#fff' : '#111') : isDark ? '#6b7280' : '#9ca3af' }}
            >
              {isActive && (
                <motion.div
                  layoutId="dept-tab-indicator-shared"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    backgroundColor: `${d.color}20`,
                    border: `1px solid ${d.color}50`,
                    boxShadow: `0 4px 16px ${d.color}25`,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <TabIcon className="w-3.5 h-3.5 relative z-10" style={{ color: isActive ? d.color : undefined }} />
              <span className="relative z-10">{d.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT C — Media Cards
   Full-bleed image cards with text overlay gradient at bottom
   ════════════════════════════════════════════════════════════════ */
function TabbedCardsCVariant({ isDark }: { isDark: boolean }) {
  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const dept = DEPARTMENTS[activeDeptIdx];

  const { assets: avatarAssets } = useDesignAssets('department_avatar');
  const avatarPool = useMemo(() => avatarAssets.map(a => a.file_url), [avatarAssets]);
  const deptAvatarUrl = useMemo(() => {
    if (avatarPool.length === 0) return undefined;
    const offset = Math.floor(avatarPool.length / 2) + 2;
    return avatarPool[(activeDeptIdx + offset) % avatarPool.length];
  }, [avatarPool, activeDeptIdx]);

  const handleDeptChange = useCallback((i: number) => {
    setActiveDeptIdx(i);
    setExpandedJob(null);
  }, []);

  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-20 pointer-events-none z-0"
        animate={{ background: `radial-gradient(ellipse at 50% 40%, ${dept.color}08, transparent 70%)` }}
        transition={{ duration: 0.8 }}
      />
      <DeptTabBar activeDeptIdx={activeDeptIdx} onChange={handleDeptChange} isDark={isDark} />

      <AnimatePresence mode="wait">
        {expandedJob ? (
          <motion.div
            key={`c-expanded-${dept.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ExpandedJtbdPanel
              key={expandedJob}
              job={expandedJob}
              scenario={JTBD_SCENARIOS[expandedJob]}
              agent={dept.agents[(dept.jtbd.indexOf(expandedJob)) % dept.agents.length]}
              dept={dept}
              isDark={isDark}
              onClose={() => setExpandedJob(null)}
              deptAvatarUrl={deptAvatarUrl}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`c-grid-${dept.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {dept.jtbd.map((job, i) => {
              const bgImage = JTBD_BG_MAP[job];
              const agentIdx = JTBD_AGENT_IDX_MAP[job] ?? (i % dept.agents.length);
              const agent = dept.agents[agentIdx % dept.agents.length];
              const scenario = JTBD_SCENARIOS[job];
              return (
                <MediaCard
                  key={job}
                  job={job}
                  dept={dept}
                  agent={agent}
                  scenario={scenario}
                  bgImage={bgImage}
                  index={i}
                  isDark={isDark}
                  onClick={() => setExpandedJob(job)}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MediaCard({
  job,
  dept,
  agent,
  scenario,
  bgImage,
  index,
  isDark,
  onClick,
}: {
  job: string;
  dept: Department;
  agent: Department['agents'][0];
  scenario: JtbdScenario | undefined;
  bgImage: string | undefined;
  index: number;
  isDark: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isPeek = JTBD_BG_PEEK.has(job);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ height: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -3 }}
    >
      {/* Full-bleed background image */}
      {bgImage && isPeek ? (
        <motion.img
          src={bgImage}
          alt=""
          className="absolute pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: JTBD_BG_POSITION[job] ?? 'left center',
          }}
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ) : bgImage ? (
        <motion.img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${dept.color}18 0%, #0d0d0d 100%)` }}
        />
      )}

      {/* Scrim gradient — always dark at bottom for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.12) 70%, transparent 100%)',
        }}
      />

      {/* Top accent + value badge */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4">
        <div
          className="h-1 w-12 rounded-full opacity-70"
          style={{ backgroundColor: dept.color }}
        />
        {scenario && (
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${dept.color}25`, color: dept.color, backdropFilter: 'blur(8px)' }}
          >
            {scenario.valueBadge}
          </span>
        )}
      </div>

      {/* Bottom text overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-2">
        <p className="text-white text-[15px] font-bold leading-tight">{job}</p>
        {scenario && (
          <p className="text-white/70 text-[11px] leading-relaxed line-clamp-2">{scenario.result}</p>
        )}

        {/* Agent row */}
        <div className="flex items-center gap-2 mt-1">
          <div
            className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})` }}
          >
            <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom" />
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: dept.color }}
            />
            <span className="text-[10px] font-medium truncate" style={{ color: dept.color }}>{agent.label}</span>
          </div>
          <span className="text-white/40 text-[10px] flex-shrink-0 flex items-center gap-0.5 group-hover:text-white/70 transition-colors">
            Open <ChevronDown className="w-3 h-3 -rotate-90" />
          </span>
        </div>
      </div>

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ boxShadow: isHovered ? `inset 0 0 0 1px ${dept.color}50, 0 0 30px ${dept.color}15` : 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT D — Bento Grid
   Mixed col-span layout: featured image card + compact cards
   ════════════════════════════════════════════════════════════════ */
function TabbedCardsDVariant({ isDark }: { isDark: boolean }) {
  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const dept = DEPARTMENTS[activeDeptIdx];

  const { assets: avatarAssets } = useDesignAssets('department_avatar');
  const avatarPool = useMemo(() => avatarAssets.map(a => a.file_url), [avatarAssets]);
  const deptAvatarUrl = useMemo(() => {
    if (avatarPool.length === 0) return undefined;
    const offset = Math.floor(avatarPool.length / 2) + 2;
    return avatarPool[(activeDeptIdx + offset) % avatarPool.length];
  }, [avatarPool, activeDeptIdx]);

  const handleDeptChange = useCallback((i: number) => {
    setActiveDeptIdx(i);
    setExpandedJob(null);
  }, []);

  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-20 pointer-events-none z-0"
        animate={{ background: `radial-gradient(ellipse at 50% 40%, ${dept.color}08, transparent 70%)` }}
        transition={{ duration: 0.8 }}
      />
      <DeptTabBar activeDeptIdx={activeDeptIdx} onChange={handleDeptChange} isDark={isDark} />

      <AnimatePresence mode="wait">
        {expandedJob ? (
          <motion.div
            key={`d-expanded-${dept.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ExpandedJtbdPanel
              key={expandedJob}
              job={expandedJob}
              scenario={JTBD_SCENARIOS[expandedJob]}
              agent={dept.agents[(dept.jtbd.indexOf(expandedJob)) % dept.agents.length]}
              dept={dept}
              isDark={isDark}
              onClose={() => setExpandedJob(null)}
              deptAvatarUrl={deptAvatarUrl}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`d-grid-${dept.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <BentoGrid dept={dept} isDark={isDark} onExpand={setExpandedJob} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BentoGrid({
  dept,
  isDark,
  onExpand,
}: {
  dept: Department;
  isDark: boolean;
  onExpand: (job: string) => void;
}) {
  const jobs = dept.jtbd;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Featured card — col-span-2, full-bleed image */}
      <BentoFeaturedCard
        job={jobs[0]}
        dept={dept}
        agent={dept.agents[JTBD_AGENT_IDX_MAP[jobs[0]] ?? 0]}
        scenario={JTBD_SCENARIOS[jobs[0]]}
        bgImage={JTBD_BG_MAP[jobs[0]]}
        index={0}
        isDark={isDark}
        onClick={() => onExpand(jobs[0])}
      />

      {/* Stack of 2 compact cards on the right */}
      <div className="flex flex-col gap-4">
        {[jobs[1], jobs[2]].map((job, i) => {
          const agentIdx = JTBD_AGENT_IDX_MAP[job] ?? ((i + 1) % dept.agents.length);
          return (
            <BentoCompactCard
              key={job}
              job={job}
              dept={dept}
              agent={dept.agents[agentIdx % dept.agents.length]}
              scenario={JTBD_SCENARIOS[job]}
              bgImage={JTBD_BG_MAP[job]}
              index={i + 1}
              isDark={isDark}
              onClick={() => onExpand(job)}
            />
          );
        })}
      </div>

      {/* Bottom row: 3 equal cards */}
      {jobs.slice(3).map((job, i) => {
        const agentIdx = JTBD_AGENT_IDX_MAP[job] ?? ((i + 3) % dept.agents.length);
        return (
          <BentoCompactCard
            key={job}
            job={job}
            dept={dept}
            agent={dept.agents[agentIdx % dept.agents.length]}
            scenario={JTBD_SCENARIOS[job]}
            bgImage={JTBD_BG_MAP[job]}
            index={i + 3}
            isDark={isDark}
            onClick={() => onExpand(job)}
          />
        );
      })}
    </div>
  );
}

function BentoFeaturedCard({
  job, dept, agent, scenario, bgImage, index, isDark, onClick,
}: {
  job: string; dept: Department; agent: Department['agents'][0]; scenario: JtbdScenario | undefined;
  bgImage: string | undefined; index: number; isDark: boolean; onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isPeek = JTBD_BG_PEEK.has(job);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer lg:col-span-2"
      style={{ minHeight: 360 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -3 }}
    >
      {bgImage && isPeek ? (
        <motion.img
          src={bgImage}
          alt=""
          className="absolute pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: JTBD_BG_POSITION[job] ?? 'left center',
          }}
          animate={{ scale: isHovered ? 1.03 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ) : bgImage ? (
        <motion.img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          animate={{ scale: isHovered ? 1.03 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${dept.color}20 0%, #0d0d0d 100%)` }} />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.08) 75%, transparent 100%)' }}
      />
      <div className="absolute top-4 right-4 flex gap-2 items-center">
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${dept.color}25`, color: dept.color, backdropFilter: 'blur(8px)' }}
        >
          {scenario?.valueBadge}
        </span>
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}
        >
          Featured
        </span>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-3">
        <p className="text-white text-[20px] font-bold leading-tight">{job}</p>
        {scenario && <p className="text-white/70 text-[13px] leading-relaxed max-w-md">{scenario.result}</p>}
        <div className="flex items-center gap-2.5 mt-1">
          <div
            className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})` }}
          >
            <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom" />
          </div>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: dept.color }}
          />
          <span className="text-[12px] font-semibold" style={{ color: dept.color }}>{agent.label}</span>
          <span className="text-white/40 text-[11px] ml-auto flex items-center gap-1 group-hover:text-white/70 transition-colors">
            Open case <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </span>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ boxShadow: isHovered ? `inset 0 0 0 1.5px ${dept.color}60, 0 0 40px ${dept.color}18` : 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  );
}

function BentoCompactCard({
  job, dept, agent, scenario, bgImage, index, isDark, onClick,
}: {
  job: string; dept: Department; agent: Department['agents'][0]; scenario: JtbdScenario | undefined;
  bgImage: string | undefined; index: number; isDark: boolean; onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isPeek = JTBD_BG_PEEK.has(job);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group flex-1"
      style={{ minHeight: 168 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -2 }}
    >
      {/* Background image */}
      {bgImage && isPeek ? (
        <motion.img
          src={bgImage}
          alt=""
          className="absolute pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: JTBD_BG_POSITION[job] ?? 'left center',
            opacity: isHovered ? 0.7 : 0.5,
            transition: 'opacity 0.3s',
          }}
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.5 }}
        />
      ) : bgImage ? (
        <motion.img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          style={{ opacity: 0.35 }}
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.5 }}
        />
      ) : null}

      {/* Card background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.9)',
          borderRadius: 16,
        }}
      />

      {/* Subtle dept color tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${dept.color}15, transparent 60%)` }}
      />

      {/* Content */}
      <div className="relative z-10 p-4 h-full flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-[13px] font-bold leading-tight flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{job}</p>
          {scenario && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: `${dept.color}18`, color: dept.color }}
            >
              {scenario.valueBadge}
            </span>
          )}
        </div>

        {scenario && (
          <p className={`text-[11px] leading-relaxed flex-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {scenario.result}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-auto">
          <div
            className="w-4 h-4 rounded flex-shrink-0 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})` }}
          >
            <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom" />
          </div>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-1 h-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: dept.color }}
          />
          <span className="text-[10px] font-medium truncate" style={{ color: dept.color }}>{agent.label}</span>
        </div>
      </div>

      {/* Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? `inset 0 0 0 1px ${dept.color}50`
            : isDark ? 'inset 0 0 0 1px rgba(255,255,255,0.08)' : 'inset 0 0 0 1px rgba(0,0,0,0.08)',
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT E — Netflix Catalog
   Horizontal scroll row with pop-out hover cards
   ════════════════════════════════════════════════════════════════ */
function NetflixCard({
  job,
  dept,
  agent,
  scenario,
  bgImage,
  positionOverride,
  zoomOverride,
  posterPositionOverride,
  posterZoomOverride,
  index,
  onClick,
}: {
  job: string;
  dept: Department;
  agent: Department['agents'][0];
  scenario: JtbdScenario | undefined;
  bgImage: string | undefined;
  positionOverride?: string;
  zoomOverride?: number;
  posterPositionOverride?: string;
  posterZoomOverride?: number;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isPeek = JTBD_BG_PEEK.has(job);
  const resolvedPosition = posterPositionOverride ?? positionOverride ?? DEFAULT_POSTER_TRANSFORM.position;
  const resolvedZoom = posterZoomOverride ?? zoomOverride ?? DEFAULT_POSTER_TRANSFORM.zoom;
  const backgroundSize = resolvedZoom === 100 ? 'cover' : `${resolvedZoom}%`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative cursor-pointer flex-shrink-0"
      style={{
        width: 'calc(33.333% - 6px)',
        minWidth: 300,
        scrollSnapAlign: 'start',
        zIndex: isHovered ? 30 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className="relative rounded-md overflow-hidden"
        animate={{
          scale: isHovered ? 1.08 : 1,
          y: isHovered ? -8 : 0,
          boxShadow: isHovered
            ? '0 20px 50px rgba(0,0,0,0.85)'
            : '0 1px 4px rgba(0,0,0,0.4)',
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Full-card background image */}
        {bgImage ? (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: backgroundSize,
              backgroundPosition: resolvedPosition,
              backgroundRepeat: 'no-repeat',
              opacity: isHovered ? 1 : 0.65,
              transition: 'opacity 0.3s ease',
            }}
          />
        ) : (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `linear-gradient(160deg, ${dept.color}25 0%, #111 50%, #0a0a0a 100%)`,
            }}
          />
        )}

        {/* Poster — portrait ratio */}
        <div className="relative z-10 w-full" style={{ paddingBottom: '110%' }}>


          {/* Agent avatar — bottom-right corner of poster */}
          <div
            className="absolute z-20 flex flex-col items-center gap-1"
            style={{ right: 12, bottom: '30%' }}
          >
            <div
              className="w-16 h-16 rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})`,
                boxShadow: `0 0 16px ${dept.color}35, 0 4px 12px rgba(0,0,0,0.5)`,
                border: `1.5px solid ${dept.color}40`,
              }}
            >
              <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom" />
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: dept.color }} />
              <span className="text-[8px] font-medium text-white/70">{agent.label}</span>
            </div>
          </div>

          {/* Bottom solid dark panel — Netflix poster style */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '45%',
              background: 'linear-gradient(to top, #0a0a0a 0%, #0a0a0a 40%, rgba(10,10,10,0.85) 65%, rgba(10,10,10,0.4) 85%, transparent 100%)',
            }}
          />

          {/* Poster title — large, bold, Netflix-style */}
          <div className="absolute bottom-0 inset-x-0 px-5 pb-5 flex flex-col gap-2">
            <p className="text-white font-black text-[36px] leading-[1.05] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {job}
            </p>
            {scenario && (
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded"
                  style={{ backgroundColor: `${dept.color}30`, color: dept.color }}
                >
                  {scenario.valueBadge}
                </span>
                <span className="text-gray-400 text-[11px]">{scenario.timeSaved}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pop-out info panel on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative z-10 overflow-hidden"
              style={{ backgroundColor: 'rgba(18,18,18,0.88)', backdropFilter: 'blur(6px)' }}
            >
              <div className="px-4 pt-3 pb-3.5 flex flex-col gap-2.5">
                {/* Action buttons row — Netflix style */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'white' }}
                  >
                    <div
                      className="w-0 h-0 ml-0.5"
                      style={{
                        borderTop: '5px solid transparent',
                        borderBottom: '5px solid transparent',
                        borderLeft: '9px solid #111',
                      }}
                    />
                  </div>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                    style={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})`,
                    }}
                  >
                    <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom rounded-full" />
                  </div>
                  <div className="flex-1" />
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                    style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Metadata line — badge + time */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${dept.color}25`, color: dept.color }}
                  >
                    {scenario?.valueBadge}
                  </span>
                  {scenario && (
                    <span className="text-gray-500 text-[10px]">{scenario.timeSaved}</span>
                  )}
                </div>

                {/* Description */}
                {scenario && (
                  <p className="text-gray-300 text-[11px] leading-relaxed line-clamp-2">
                    {scenario.result}
                  </p>
                )}

                {/* Agent label */}
                <div className="flex items-center gap-1.5">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-[10px] font-medium" style={{ color: dept.color }}>
                    {agent.label}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function GenericStepDemo({ steps, deptColor, result }: { steps: string[]; deptColor: string; result: string }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const allDone = visibleCount >= steps.length;

  useEffect(() => {
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 500 + i * 700));
    });
    return () => timers.forEach(clearTimeout);
  }, [steps]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 mb-1">
        <motion.span
          animate={{ opacity: allDone ? 1 : [0.4, 1, 0.4] }}
          transition={{ repeat: allDone ? 0 : Infinity, duration: 1.2 }}
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: deptColor }}
        />
        <span className="text-[10px] font-semibold" style={{ color: deptColor }}>
          {allDone ? 'Done' : 'Working…'}
        </span>
      </div>

      {steps.map((step, i) => (
        <AnimatePresence key={i}>
          {visibleCount > i && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2"
            >
              <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: deptColor }} />
              <span className="text-[10px] text-gray-300 leading-relaxed">{step}</span>
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-1 rounded-lg px-2.5 py-1.5"
            style={{ backgroundColor: `${deptColor}15` }}
          >
            <span className="text-[10px] font-semibold" style={{ color: deptColor }}>{result}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NetflixExpandedPanel({
  job,
  scenario,
  agent,
  dept,
  bgImage,
  bg3dImage,
  onClose,
  deptAvatarUrl,
  isDark,
  expandedPosition,
  expandedZoom,
  overlayOpacity,
}: {
  job: string;
  scenario: JtbdScenario;
  agent: Department['agents'][0];
  dept: Department;
  bgImage: string | undefined;
  bg3dImage: string | undefined;
  onClose: () => void;
  deptAvatarUrl?: string;
  isDark: boolean;
  expandedPosition?: string;
  expandedZoom?: number;
  overlayOpacity?: number;
}) {
  const resolvedExpandedPos = expandedPosition ?? DEFAULT_EXPANDED_TRANSFORM.position;
  const resolvedExpandedZoom = expandedZoom ?? DEFAULT_EXPANDED_TRANSFORM.zoom;
  const resolvedOverlayOpacity = (overlayOpacity ?? 45) / 100;


  // Parse position as "panX,panY" in pixels.
  // background-position: calc(50% + Xpx) keeps pan and zoom fully independent,
  // and avoids the dark gap that appears with CSS transform translate.
  const parseExpandedXY = (pos: string): { panX: number; panY: number } => {
    if (pos && pos.includes(',')) {
      const [x, y] = pos.split(',').map(Number);
      return { panX: isNaN(x) ? 0 : x, panY: isNaN(y) ? 0 : y };
    }
    return { panX: 0, panY: 0 };
  };
  const { panX: expandedPanX, panY: expandedPanY } = parseExpandedXY(resolvedExpandedPos);
  const expandedBgSize = resolvedExpandedZoom === 100 ? 'cover' : `${resolvedExpandedZoom}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        backgroundColor: '#0a0a0a',
        border: `1px solid ${dept.color}30`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${dept.color}10`,
        minHeight: 480,
      }}
    >
      {/* Full-bleed background image */}
      {bgImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: expandedBgSize,
            backgroundPosition: `calc(50% + ${expandedPanX}px) calc(50% + ${expandedPanY}px)`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Uniform dark overlay — no left/right separation */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(10,10,10,${resolvedOverlayOpacity})` }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-20"
        style={{ backgroundColor: 'rgba(10,10,10,0.7)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Floating agent + generated outputs — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute bottom-6 right-6 z-20 flex items-end gap-3"
      >
        {/* Demo widget — specific component or generic step fallback */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
          className="mb-2 rounded-2xl overflow-hidden"
          style={{
            width: 260,
            maxHeight: 320,
            backgroundColor: 'rgba(10,10,10,0.82)',
            border: `1px solid ${dept.color}30`,
            backdropFilter: 'blur(16px)',
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
            padding: '12px',
          }}
        >
          {scenario.deliverableType ? (
            (() => {
              const DemoComp = DEMO_COMPONENTS[scenario.deliverableType];
              return <DemoComp deptColor={dept.color} isDark={true} />;
            })()
          ) : (
            /* Generic step-completion fallback */
            <GenericStepDemo steps={scenario.agentSteps} deptColor={dept.color} result={scenario.result} />
          )}
        </motion.div>

        {/* Agent avatar column */}
        <div className="flex flex-col items-center gap-2">
          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative px-3 py-1.5 rounded-xl"
            style={{
              backgroundColor: 'rgba(10,10,10,0.85)',
              border: `1px solid ${dept.color}40`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: dept.color }}
              />
              <span className="text-[11px] font-medium" style={{ color: dept.color }}>{agent.status}</span>
            </div>
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
              style={{ backgroundColor: 'rgba(10,10,10,0.85)', borderRight: `1px solid ${dept.color}40`, borderBottom: `1px solid ${dept.color}40` }}
            />
          </motion.div>

          {/* Avatar with glow rings */}
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
              className="absolute inset-0 rounded-2xl"
              style={{ border: `2px solid ${dept.color}`, margin: -8 }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-2xl"
              style={{ border: `2px solid ${dept.color}60`, margin: -4 }}
            />
            <div
              className="w-16 h-16 rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})`,
                boxShadow: `0 0 24px ${dept.color}40, 0 8px 20px rgba(0,0,0,0.5)`,
                border: `2px solid ${dept.color}50`,
              }}
            >
              <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom" />
            </div>
          </div>

          <span className="text-[10px] font-semibold text-white/70">{agent.label}</span>
        </div>
      </motion.div>

      {/* Content overlaid on image */}
      <div className="relative z-10 px-8 py-8 flex flex-col gap-4 max-w-[520px]" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.5) 70%, transparent 100%)' }}>
        {/* Title */}
        <h3 className="text-white text-2xl font-bold leading-tight">{job}</h3>

        {/* Speed + time badges */}
        <div className="flex items-center gap-3">
          <span
            className="text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
            style={{ backgroundColor: `${dept.color}25`, color: dept.color, backdropFilter: 'blur(8px)' }}
          >
            <Zap className="w-3 h-3" />
            {scenario.valueBadge}
          </span>
          <span className="text-[12px] text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {scenario.timeSaved}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-[13px] leading-relaxed">{scenario.result}</p>

        {/* Agent steps */}
        <div className="flex flex-col gap-2.5">
          {scenario.agentSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="flex items-start gap-2.5"
            >
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: dept.color }}
              />
              <span className="text-[13px] text-gray-300 leading-relaxed">{step}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="#"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold w-fit"
          style={{
            backgroundColor: dept.color,
            color: '#0a0a0a',
            boxShadow: `0 0 20px ${dept.color}50`,
          }}
          whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${dept.color}70` }}
          whileTap={{ scale: 0.97 }}
        >
          Try it with monday AI
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.a>
      </div>
    </motion.div>
  );
}

function TabbedCardsEVariant({ isDark, jtbdBgOverrides = {}, jtbdPositionOverrides = {}, jtbdZoomOverrides = {}, jtbdGlobalPosterPos, jtbdGlobalPosterZoom, jtbdGlobalExpandedPos, jtbdGlobalExpandedZoom, jtbdExpandedOverlayOpacity = 45 }: { isDark: boolean; jtbdBgOverrides?: Record<string, string>; jtbdPositionOverrides?: Record<string, string>; jtbdZoomOverrides?: Record<string, number>; jtbdGlobalPosterPos?: string; jtbdGlobalPosterZoom?: number; jtbdGlobalExpandedPos?: string; jtbdGlobalExpandedZoom?: number; jtbdExpandedOverlayOpacity?: number }) {
  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const dept = DEPARTMENTS[activeDeptIdx];
  const scrollRef = useRef<HTMLDivElement>(null);

  const { assets: avatarAssets } = useDesignAssets('department_avatar');
  const avatarPool = useMemo(() => avatarAssets.map(a => a.file_url), [avatarAssets]);
  const deptAvatarUrl = useMemo(() => {
    if (avatarPool.length === 0) return undefined;
    const offset = Math.floor(avatarPool.length / 2) + 2;
    return avatarPool[(activeDeptIdx + offset) % avatarPool.length];
  }, [avatarPool, activeDeptIdx]);

  const handleDeptChange = useCallback((i: number) => {
    setActiveDeptIdx(i);
    setExpandedJob(null);
  }, []);

  const scroll = useCallback((dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -500 : 500;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-20 pointer-events-none z-0"
        animate={{ background: `radial-gradient(ellipse at 50% 40%, ${dept.color}08, transparent 70%)` }}
        transition={{ duration: 0.8 }}
      />

      <DeptTabBar activeDeptIdx={activeDeptIdx} onChange={handleDeptChange} isDark={isDark} />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {expandedJob && JTBD_SCENARIOS[expandedJob] ? (
            <motion.div
              key={`e-expanded-${dept.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <NetflixExpandedPanel
                job={expandedJob}
                scenario={JTBD_SCENARIOS[expandedJob]}
                agent={dept.agents[(JTBD_AGENT_IDX_MAP[expandedJob] ?? dept.jtbd.indexOf(expandedJob)) % dept.agents.length]}
                dept={dept}
                bgImage={jtbdBgOverrides[expandedJob] || JTBD_BG_MAP[expandedJob]}
                bg3dImage={jtbdBgOverrides[expandedJob] || JTBD_BG_MAP[expandedJob]}
                onClose={() => setExpandedJob(null)}
                deptAvatarUrl={deptAvatarUrl}
                isDark={isDark}
                expandedPosition={jtbdGlobalExpandedPos}
                expandedZoom={jtbdGlobalExpandedZoom}
                overlayOpacity={jtbdExpandedOverlayOpacity}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`e-row-${dept.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative group/row overflow-visible"
            >
              {/* Scroll arrows — vertically centered over the card image portion only */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 z-20 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r-lg"
                style={{ top: 24, bottom: 48, width: 36, background: 'linear-gradient(to right, rgba(10,10,10,0.85), transparent)' }}
              >
                <ChevronDown className="w-5 h-5 text-white rotate-90" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 z-20 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l-lg"
                style={{ top: 24, bottom: 48, width: 36, background: 'linear-gradient(to left, rgba(10,10,10,0.85), transparent)' }}
              >
                <ChevronDown className="w-5 h-5 text-white -rotate-90" />
              </button>

              {/* Scrollable row */}
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-12 pt-4 scrollbar-hide"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {dept.jtbd.map((job, i) => {
                  const bgImage = jtbdBgOverrides[job] || JTBD_BG_MAP[job];
                  const agentIdx = JTBD_AGENT_IDX_MAP[job] ?? (i % dept.agents.length);
                  const agent = dept.agents[agentIdx % dept.agents.length];
                  const scenario = JTBD_SCENARIOS[job];
                  return (
                    <NetflixCard
                      key={job}
                      job={job}
                      dept={dept}
                      agent={agent}
                      scenario={scenario}
                      bgImage={bgImage}
                      positionOverride={jtbdPositionOverrides[job]}
                      zoomOverride={jtbdZoomOverrides[job]}
                      posterPositionOverride={jtbdGlobalPosterPos}
                      posterZoomOverride={jtbdGlobalPosterZoom}
                      index={i}
                      onClick={() => setExpandedJob(job)}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT F — Netflix Agentic (always-expanded card + gallery)
   ════════════════════════════════════════════════════════════════ */

function AgenticStepsCascade({ steps, deptColor, isActive }: { steps: string[]; deptColor: string; isActive: boolean }) {
  const [visible, setVisible] = useState(0);
  const prevActiveRef = useRef(isActive);

  useEffect(() => {
    if (!isActive) { setVisible(0); return; }
    if (prevActiveRef.current && isActive) {
      prevActiveRef.current = isActive;
      return;
    }
    prevActiveRef.current = isActive;
    setVisible(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(i + 1), 600 + i * 500));
    });
    return () => timers.forEach(clearTimeout);
  }, [isActive, steps]);

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ opacity: visible > i ? 1 : 0, x: visible > i ? 0 : -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
          <span className="text-[13px] text-gray-300 leading-snug">{step}</span>
        </motion.div>
      ))}
    </div>
  );
}

function TabbedCardsFVariant({ isDark, jtbdBgOverrides = {}, jtbdPositionOverrides = {}, jtbdZoomOverrides = {}, jtbdGlobalPosterPos, jtbdGlobalPosterZoom, jtbdGlobalExpandedPos, jtbdGlobalExpandedZoom, jtbdExpandedOverlayOpacity = 45 }: { isDark: boolean; jtbdBgOverrides?: Record<string, string>; jtbdPositionOverrides?: Record<string, string>; jtbdZoomOverrides?: Record<string, number>; jtbdGlobalPosterPos?: string; jtbdGlobalPosterZoom?: number; jtbdGlobalExpandedPos?: string; jtbdGlobalExpandedZoom?: number; jtbdExpandedOverlayOpacity?: number }) {
  const [activeDeptIdx, setActiveDeptIdx] = useState(0);
  const [activeJtbdIdx, setActiveJtbdIdx] = useState(0);
  const autoRef = useRef<ReturnType<typeof setTimeout>>();
  const dept = DEPARTMENTS[activeDeptIdx];
  const activeJob = dept.jtbd[activeJtbdIdx];
  const scenario = JTBD_SCENARIOS[activeJob];
  const bgImage = jtbdBgOverrides[activeJob] || JTBD_BG_MAP[activeJob];
  const agentIdx = JTBD_AGENT_IDX_MAP[activeJob] ?? (activeJtbdIdx % dept.agents.length);
  const agent = dept.agents[agentIdx % dept.agents.length];

  const { assets: avatarAssets } = useDesignAssets('department_avatar');
  const avatarPool = useMemo(() => avatarAssets.map(a => a.file_url), [avatarAssets]);
  const deptAvatarUrl = useMemo(() => {
    if (avatarPool.length === 0) return undefined;
    const offset = Math.floor(avatarPool.length / 2) + 2;
    return avatarPool[(activeDeptIdx + offset) % avatarPool.length];
  }, [avatarPool, activeDeptIdx]);

  const handleDeptChange = useCallback((i: number) => {
    setActiveDeptIdx(i);
    setActiveJtbdIdx(0);
  }, []);

  const handleJtbdChange = useCallback((idx: number) => {
    if (autoRef.current) clearTimeout(autoRef.current);
    setActiveJtbdIdx(idx);
  }, []);

  // Auto-rotate
  useEffect(() => {
    autoRef.current = setTimeout(() => {
      setActiveJtbdIdx((prev) => (prev + 1) % dept.jtbd.length);
    }, 7000);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [activeJtbdIdx, dept.jtbd.length]);


  if (!scenario) return null;

  const galleryJobs = dept.jtbd.filter((_, i) => i !== activeJtbdIdx);

  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-20 pointer-events-none z-0"
        animate={{ background: `radial-gradient(ellipse at 50% 40%, ${dept.color}08, transparent 70%)` }}
        transition={{ duration: 0.8 }}
      />

      <DeptTabBar activeDeptIdx={activeDeptIdx} onChange={handleDeptChange} isDark={isDark} />

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4 items-start">

        {/* Left column: featured card */}
        <div className="min-w-0">
        {/* Expanded card — Netflix style 50/50 with agentic intro */}
        <AnimatePresence mode="wait">
          {(() => {
            const resolvedOverlay = (jtbdExpandedOverlayOpacity ?? 45) / 100;
            const parseXY = (pos: string) => {
              if (pos && pos.includes(',')) {
                const [x, y] = pos.split(',').map(Number);
                return { panX: isNaN(x) ? 0 : x, panY: isNaN(y) ? 0 : y };
              }
              return { panX: 0, panY: 0 };
            };
            const resolvedPos = jtbdGlobalExpandedPos ?? DEFAULT_EXPANDED_TRANSFORM.position;
            const resolvedZoom = jtbdGlobalExpandedZoom ?? DEFAULT_EXPANDED_TRANSFORM.zoom;
            const { panX, panY } = parseXY(resolvedPos);
            const bgSize = resolvedZoom === 100 ? 'cover' : `${resolvedZoom}%`;

            return (
              <motion.div
                key={`${dept.id}-${activeJob}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#0a0a0a',
              border: `1px solid rgba(255,255,255,0.12)`,
              boxShadow: `0 24px 80px rgba(0,0,0,0.8), 0 0 60px ${dept.color}15, 0 0 120px ${dept.color}08`,
              minHeight: 540,
            }}
              >
                {/* Full-bleed background image — admin controlled */}
                {bgImage && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: bgSize,
                      backgroundPosition: `calc(50% + ${panX}px) calc(50% + ${panY}px)`,
                      backgroundRepeat: 'no-repeat',
                      maskImage: 'linear-gradient(to left, black 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.3) 80%, transparent 95%)',
                      WebkitMaskImage: 'linear-gradient(to left, black 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.3) 80%, transparent 95%)',
                    }}
                  />
                )}

                {/* Dark overlay — admin controlled, lighter default */}
                <div className="absolute inset-0" style={{ background: `rgba(10,10,10,${resolvedOverlay * 0.35})` }} />


                {/* 50/50 grid — invisible split */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[540px]">
                  {/* LEFT 50% — Content overlaid on image */}
                  <div className="relative px-10 py-10 flex flex-col gap-5 justify-center" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.82) 50%, rgba(10,10,10,0.45) 75%, transparent 100%)' }}>
                    <h3 className="text-white text-[36px] font-extrabold leading-[1.15] max-w-[440px] tracking-tight">
                      {activeJob.includes(', ') ? (
                        <>
                          {activeJob.split(', ')[0]},<br />
                          {activeJob.split(', ').slice(1).join(', ')}
                        </>
                      ) : activeJob}
                    </h3>

                    <div className="flex items-center gap-3">
                      <span
                        className="text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                        style={{ backgroundColor: `${dept.color}25`, color: dept.color, backdropFilter: 'blur(8px)' }}
                      >
                        <Zap className="w-3 h-3" />
                        {scenario.valueBadge}
                      </span>
                      <span className="text-[12px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scenario.timeSaved}
                      </span>
                    </div>

                    <p className="text-gray-300 text-[14px] leading-relaxed">{scenario.result}</p>

                    {/* Agent header + steps */}
                    <div className="flex gap-3">
                      {/* Agent avatar column */}
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex flex-col items-center flex-shrink-0 pt-0.5"
                      >
                        <div
                          className="w-8 h-8 rounded-xl overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})`,
                            boxShadow: `0 0 12px ${dept.color}30`,
                            border: `1.5px solid ${dept.color}40`,
                          }}
                        >
                          <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom" onError={(e) => { (e.target as HTMLImageElement).src = agent.fallback; }} />
                        </div>
                        <div className="w-px flex-1 mt-2 opacity-20" style={{ backgroundColor: dept.color }} />
                      </motion.div>

                      {/* Label + steps */}
                      <div className="flex flex-col gap-3 min-w-0">
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex items-center gap-2 h-8"
                        >
                          <span className="text-[12px] font-semibold text-gray-400">{agent.label}</span>
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: dept.color }}
                          />
                        </motion.div>

                        <div className="flex flex-col gap-2">
                          {scenario.agentSteps.map((step, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: dept.color }} />
                              <span className="text-[13px] text-gray-300 leading-snug">{step}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.a
                      href="#"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                      className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold w-fit"
                      style={{ backgroundColor: dept.color, color: '#0a0a0a', boxShadow: `0 0 20px ${dept.color}50` }}
                      whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${dept.color}70` }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Try it with monday AI
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.a>
                  </div>

                  {/* RIGHT 50% — Agentic intro + centered demo + corner agent */}
                  <div className="relative overflow-hidden">
                    {/* Darkening overlay — appears after intro fades, lets demo breathe */}
                    {/* Intro overlay — Human + Agent dialog, centered, fades out */}
                    <motion.div
                      key={`intro-${dept.id}-${activeJob}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                    >
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ delay: 3.2, duration: 0.6 }}
                        className="flex flex-col gap-3 max-w-xs px-4"
                      >
                        {/* Human bubble */}
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="rounded-xl px-4 py-3 self-start"
                          style={{ backgroundColor: 'rgba(10,10,10,0.88)', border: `1px solid ${dept.color}30`, backdropFilter: 'blur(16px)' }}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ backgroundColor: dept.color + '30' }}>
                              {deptAvatarUrl ? (
                                <img src={deptAvatarUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[10px] font-bold" style={{ color: dept.color }}>{dept.name.charAt(0)}</span>
                              )}
                            </div>
                            <p className="text-[12px] text-gray-200 leading-relaxed">"{scenario.humanRequest}"</p>
                          </div>
                        </motion.div>

                        {/* Agent reply */}
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 1.4, duration: 0.5 }}
                          className="rounded-xl px-4 py-3 self-end"
                          style={{ backgroundColor: 'rgba(10,10,10,0.88)', border: `1px solid ${dept.color}30`, backdropFilter: 'blur(16px)' }}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0" style={{ background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})` }}>
                              <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom" onError={(e) => { (e.target as HTMLImageElement).src = agent.fallback; }} />
                            </div>
                            <p className="text-[12px] text-gray-300 leading-relaxed">
                              {scenario.agentIntroMessage || `On it — let me ${activeJob.toLowerCase()} for you.`}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Demo widget — centered, appears after intro */}
                    <motion.div
                      key={`demo-${dept.id}-${activeJob}`}
                      initial={{ opacity: 0, scale: 0.94, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 3.8, duration: 0.7, ease: 'easeOut' }}
                      className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                    >
                      {/* Radial spotlight — softly darkens just behind the demo card */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'radial-gradient(ellipse 65% 75% at center, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.38) 55%, transparent 80%)',
                        }}
                      />
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                          width: 340,
                          maxHeight: 380,
                          backgroundColor: 'rgba(10,10,10,0.88)',
                          border: `1px solid ${dept.color}35`,
                          backdropFilter: 'blur(20px)',
                          boxShadow: `0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 40px ${dept.color}15`,
                          padding: '18px',
                          pointerEvents: 'auto',
                        }}
                      >
                        {scenario.deliverableType ? (
                          (() => {
                            const DemoComp = DEMO_COMPONENTS[scenario.deliverableType];
                            return <DemoComp deptColor={dept.color} isDark={true} />;
                          })()
                        ) : (
                          <GenericStepDemo steps={scenario.agentSteps} deptColor={dept.color} result={scenario.result} />
                        )}
                      </div>
                    </motion.div>

                    {/* Agent avatar — bottom-right corner, small and unobtrusive */}
                    <motion.div
                      key={`agent-${dept.id}-${activeJob}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 3.4, duration: 0.6, type: 'spring', stiffness: 200, damping: 22 }}
                      className="absolute bottom-4 right-4 z-30 flex flex-col items-center gap-2"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 3.6 }}
                        className="relative px-3 py-1.5 rounded-xl"
                        style={{ backgroundColor: 'rgba(10,10,10,0.88)', border: `1px solid ${dept.color}40`, backdropFilter: 'blur(12px)' }}
                      >
                        <div className="flex items-center gap-1.5">
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dept.color }} />
                          <span className="text-[11px] font-medium" style={{ color: dept.color }}>{agent.status || 'Generating…'}</span>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: 'rgba(10,10,10,0.88)', borderRight: `1px solid ${dept.color}40`, borderBottom: `1px solid ${dept.color}40` }} />
                      </motion.div>

                      <div className="relative">
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }} className="absolute inset-0 rounded-2xl" style={{ border: `2px solid ${dept.color}`, margin: -8 }} />
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="absolute inset-0 rounded-2xl" style={{ border: `2px solid ${dept.color}60`, margin: -4 }} />
                        <div className="w-14 h-14 rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})`, boxShadow: `0 0 20px ${dept.color}40, 0 6px 16px rgba(0,0,0,0.5)`, border: `2px solid ${dept.color}50` }}>
                          <img src={agent.img} alt="" loading="lazy" className="w-full h-full object-contain object-bottom" onError={(e) => { (e.target as HTMLImageElement).src = agent.fallback; }} />
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-white/60">{agent.label}</span>
                    </motion.div>
                  </div>
                </div>

                {/* Progress bar — auto-rotate indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    key={`progress-${dept.id}-${activeJtbdIdx}`}
                    className="h-full origin-left"
                    style={{ backgroundColor: dept.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 7, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
        </div>{/* end left column */}

        {/* Right column: vertical mini-poster gallery */}
        <div className="hidden lg:flex flex-col gap-2 self-stretch">
          {dept.jtbd.map((job, i) => {
            const isActive = i === activeJtbdIdx;
            const jobBg = jtbdBgOverrides[job] || JTBD_BG_MAP[job];
            const jobScenario = JTBD_SCENARIOS[job];
            const resolvedPos = jtbdGlobalPosterPos ?? jtbdPositionOverrides[job] ?? DEFAULT_POSTER_TRANSFORM.position;
            const resolvedZoom = jtbdGlobalPosterZoom ?? jtbdZoomOverrides[job] ?? DEFAULT_POSTER_TRANSFORM.zoom;

            return (
              <motion.div
                key={job}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                onClick={() => !isActive && handleJtbdChange(i)}
                className={`relative rounded-xl overflow-hidden flex-1 min-h-0 ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
                style={{
                  border: isActive ? `1.5px solid ${dept.color}70` : '1.5px solid rgba(255,255,255,0.07)',
                  boxShadow: isActive
                    ? `0 0 0 1px ${dept.color}30, 0 4px 20px rgba(0,0,0,0.5), 0 0 16px ${dept.color}18`
                    : '0 2px 8px rgba(0,0,0,0.35)',
                  transition: 'border-color 0.4s, box-shadow 0.4s',
                  minHeight: 80,
                }}
              >
                {/* Background image */}
                {jobBg ? (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${jobBg})`,
                      backgroundSize: resolvedZoom === 100 ? 'cover' : `${resolvedZoom}%`,
                      backgroundPosition: resolvedPos,
                      backgroundRepeat: 'no-repeat',
                      opacity: isActive ? 0.55 : 0.38,
                      transition: 'opacity 0.4s',
                    }}
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${dept.color}22, #111 60%)` }} />
                )}

                {/* Dark tint */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: isActive ? 'rgba(10,10,10,0.25)' : 'rgba(10,10,10,0.52)', transition: 'background 0.4s' }}
                />

                {/* Active left accent bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                    style={{ backgroundColor: dept.color }}
                  />
                )}

                {/* Hover overlay for non-active */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 opacity-0 pointer-events-none"
                    whileHover={{ opacity: 1 }}
                    style={{ background: `${dept.color}08` }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-end h-full px-3.5 py-3 min-h-[80px]">
                  {isActive && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: dept.color }}>Now playing</span>
                    </div>
                  )}
                  <p className={`font-semibold leading-snug line-clamp-2 ${isActive ? 'text-white text-[12px]' : 'text-gray-300 text-[11px]'}`}>
                    {job}
                  </p>
                  {jobScenario && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: isActive ? `${dept.color}20` : 'rgba(255,255,255,0.07)',
                          color: isActive ? dept.color : 'rgba(255,255,255,0.38)',
                        }}
                      >
                        {jobScenario.valueBadge}
                      </span>
                      <span className="text-[9px] text-gray-600">{jobScenario.timeSaved}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>{/* end right column */}

        </div>{/* end grid */}

        {/* Mobile-only: horizontal scroll gallery below the featured card */}
        <div className="lg:hidden mt-4 flex gap-3 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
          {galleryJobs.map((job, i) => {
            const jobBg = jtbdBgOverrides[job] || JTBD_BG_MAP[job];
            const jobScenario = JTBD_SCENARIOS[job];
            const resolvedPos = jtbdGlobalPosterPos ?? jtbdPositionOverrides[job] ?? DEFAULT_POSTER_TRANSFORM.position;
            const resolvedZoom = jtbdGlobalPosterZoom ?? jtbdZoomOverrides[job] ?? DEFAULT_POSTER_TRANSFORM.zoom;

            return (
              <motion.div
                key={job}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                onClick={() => handleJtbdChange(dept.jtbd.indexOf(job))}
                className="relative cursor-pointer flex-shrink-0 rounded-xl overflow-hidden"
                style={{ width: 200, scrollSnapAlign: 'start', border: '1.5px solid rgba(255,255,255,0.08)' }}
              >
                {jobBg ? (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${jobBg})`,
                      backgroundSize: resolvedZoom === 100 ? 'cover' : `${resolvedZoom}%`,
                      backgroundPosition: resolvedPos,
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.4,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${dept.color}20, #111 60%)` }} />
                )}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(10,10,10,0.45)' }} />
                <div className="relative w-full" style={{ paddingBottom: '60%' }}>
                  <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: '70%', background: 'linear-gradient(to top, #0a0a0a, rgba(10,10,10,0.6) 60%, transparent)' }} />
                  <div className="absolute bottom-0 inset-x-0 px-3 pb-3">
                    <p className="text-white font-semibold text-[12px] leading-tight line-clamp-2">{job}</p>
                    {jobScenario && (
                      <span className="text-[9px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                        {jobScenario.valueBadge}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════════════════════════ */
export function WorkManagementUseCasesSection({
  variant = 'tabbed_cards',
  isDark = false,
  jtbdBgOverrides = {},
  jtbdPositionOverrides = {},
  jtbdZoomOverrides = {},
  jtbdGlobalPosterPos,
  jtbdGlobalPosterZoom,
  jtbdGlobalExpandedPos,
  jtbdGlobalExpandedZoom,
  jtbdExpandedOverlayOpacity = 45,
}: WorkManagementUseCasesSectionProps) {
  return (
    <section className={`py-12 sm:py-16 px-4 sm:px-6 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50/60'}`}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
            style={{
              borderColor: isDark ? 'rgba(97,97,255,0.3)' : 'rgba(97,97,255,0.2)',
              backgroundColor: isDark ? 'rgba(97,97,255,0.08)' : 'rgba(97,97,255,0.05)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6161FF]" />
            <span className="text-[12px] font-semibold text-[#6161FF] tracking-wide">Use cases</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1] mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
            AI built for every
            <br />
            job to be done
          </h2>
          <p className={`text-base max-w-[520px] mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            From campaign plans to security audits — tell an agent what you need and watch it deliver.
          </p>
        </motion.div>

        {/* Variant content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {variant === 'tabbed_cards' && <TabbedCardsVariant isDark={isDark} />}
          {variant === 'tabbed_cards_c' && <TabbedCardsCVariant isDark={isDark} />}
          {variant === 'tabbed_cards_d' && <TabbedCardsDVariant isDark={isDark} />}
          {variant === 'tabbed_cards_e' && <TabbedCardsEVariant isDark={isDark} jtbdBgOverrides={jtbdBgOverrides} jtbdPositionOverrides={jtbdPositionOverrides} jtbdZoomOverrides={jtbdZoomOverrides} jtbdGlobalPosterPos={jtbdGlobalPosterPos} jtbdGlobalPosterZoom={jtbdGlobalPosterZoom} jtbdGlobalExpandedPos={jtbdGlobalExpandedPos} jtbdGlobalExpandedZoom={jtbdGlobalExpandedZoom} jtbdExpandedOverlayOpacity={jtbdExpandedOverlayOpacity} />}
          {variant === 'accordion' && <AccordionVariant isDark={isDark} />}
          {variant === 'marquee' && <MarqueeVariant isDark={isDark} />}
          {variant === 'matrix' && <MatrixVariant isDark={isDark} />}
          {variant === 'tabbed_cards_f' && <TabbedCardsFVariant isDark={isDark} jtbdBgOverrides={jtbdBgOverrides} jtbdPositionOverrides={jtbdPositionOverrides} jtbdZoomOverrides={jtbdZoomOverrides} jtbdGlobalPosterPos={jtbdGlobalPosterPos} jtbdGlobalPosterZoom={jtbdGlobalPosterZoom} jtbdGlobalExpandedPos={jtbdGlobalExpandedPos} jtbdGlobalExpandedZoom={jtbdGlobalExpandedZoom} jtbdExpandedOverlayOpacity={jtbdExpandedOverlayOpacity} />}
          {variant === 'agentic_flow' && <WorkManagementAgenticUseCases isDark={isDark} />}
        </motion.div>
      </div>
    </section>
  );
}
