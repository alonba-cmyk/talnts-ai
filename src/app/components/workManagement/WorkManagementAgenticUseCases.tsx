'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap, Clock, Bot, ChevronRight } from 'lucide-react';
import { DEPARTMENTS, type Department } from './wmDepartmentData';
import { JTBD_BG_MAP } from './jtbdBgMap';

type JtbdScenario = {
  humanRequest: string;
  agentSteps: string[];
  result: string;
  valueBadge: string;
  timeSaved: string;
};

const JTBD_SCENARIOS: Record<string, JtbdScenario> = {
  'Plan campaign launches': {
    humanRequest: "We're launching Q4 — can you build the full campaign plan?",
    agentSteps: ['Created campaign brief from brand guidelines', 'Mapped timeline across 6 channels', 'Assigned tasks to team members', 'Set up tracking board with milestones'],
    result: 'Complete campaign plan with 24 tasks, owners, and deadlines',
    valueBadge: '5x faster',
    timeSaved: '2 hrs vs. full day',
  },
  'Generate creative assets': {
    humanRequest: "I need 8 ad variations for our summer sale — different formats.",
    agentSteps: ['Pulled brand colors and fonts from asset library', 'Generated copy variants for each format', 'Produced images in 4 sizes (story, feed, banner, display)', 'Organized in shared folder by channel'],
    result: '32 ready-to-publish creative assets across all formats',
    valueBadge: '8x faster',
    timeSaved: '45 min vs. 6 hours',
  },
  'Analyze campaign ROI': {
    humanRequest: "Which of our Q3 campaigns actually drove revenue?",
    agentSteps: ['Pulled data from 14 active campaigns', 'Matched spend to conversion events', 'Calculated ROAS per channel and creative', 'Flagged 3 underperformers and 2 winners'],
    result: 'ROI dashboard with channel breakdown and budget recommendations',
    valueBadge: '4x faster',
    timeSaved: '15 min vs. 4 hours',
  },
  'Manage content calendar': {
    humanRequest: "We need a content calendar for next quarter across all channels.",
    agentSteps: ['Mapped key dates and product launches', 'Generated 90 content slots across channels', 'Drafted topic ideas per slot based on goals', 'Balanced workload across writers'],
    result: 'Full 90-day content calendar with topics, formats, and owners',
    valueBadge: '6x faster',
    timeSaved: '30 min vs. 3 hours',
  },
  'Track brand consistency': {
    humanRequest: "Are our recent assets actually on-brand? Flag anything off.",
    agentSteps: ['Scanned 47 recently published assets', 'Compared against brand guidelines (fonts, colors, tone)', 'Identified 6 assets with inconsistencies', 'Generated correction notes per asset'],
    result: 'Brand audit report with specific fixes for each flagged asset',
    valueBadge: '10x faster',
    timeSaved: '5 min vs. 2 hours',
  },
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
    agentSteps: ["Pulled Acme's firmographic data and pain points from CRM", 'Selected relevant case studies by industry', 'Generated pricing tiers with ROI projections', 'Built proposal deck with executive summary'],
    result: 'Polished proposal deck ready for review in 15 minutes',
    valueBadge: '8x faster',
    timeSaved: '15 min vs. 2 hours',
  },
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

const AUTO_ROTATE_MS = 7000;
const STEP_DELAY_MS = 500;

function AgentStepItem({ step, index, isVisible }: { step: string; index: number; isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="flex items-start gap-2.5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isVisible ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.25, delay: index * 0.08 + 0.15, type: 'spring', stiffness: 400 }}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
      </motion.div>
      <span className="text-[13px] leading-snug text-gray-300">{step}</span>
    </motion.div>
  );
}

function TypingIndicator({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-[3px] ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          className="w-[5px] h-[5px] rounded-full inline-block"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

interface AgenticUseCasesProps {
  isDark?: boolean;
}

export function WorkManagementAgenticUseCases({ isDark = true }: AgenticUseCasesProps) {
  const [selectedDeptIdx, setSelectedDeptIdx] = useState(0);
  const [selectedJtbdIdx, setSelectedJtbdIdx] = useState(0);
  const [animPhase, setAnimPhase] = useState<'request' | 'thinking' | 'steps' | 'result'>('request');
  const [visibleSteps, setVisibleSteps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const autoRotateRef = useRef<ReturnType<typeof setTimeout>>();

  const dept = DEPARTMENTS[selectedDeptIdx];
  const jtbdName = dept.jtbd[selectedJtbdIdx];
  const scenario = JTBD_SCENARIOS[jtbdName];
  const bgImage = JTBD_BG_MAP[jtbdName];
  const agent = dept.agents[0];

  const resetAndAnimate = useCallback(() => {
    setAnimPhase('request');
    setVisibleSteps(0);

    timerRef.current = setTimeout(() => setAnimPhase('thinking'), 800);
    setTimeout(() => {
      setAnimPhase('steps');
      let step = 0;
      const stepInterval = setInterval(() => {
        step++;
        setVisibleSteps(step);
        if (step >= 4) {
          clearInterval(stepInterval);
          setTimeout(() => setAnimPhase('result'), 600);
        }
      }, STEP_DELAY_MS);
    }, 1600);
  }, []);

  useEffect(() => {
    resetAndAnimate();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [selectedDeptIdx, selectedJtbdIdx, resetAndAnimate]);

  useEffect(() => {
    if (animPhase !== 'result') return;
    autoRotateRef.current = setTimeout(() => {
      setSelectedJtbdIdx((prev) => (prev + 1) % dept.jtbd.length);
    }, AUTO_ROTATE_MS - 3000);
    return () => { if (autoRotateRef.current) clearTimeout(autoRotateRef.current); };
  }, [animPhase, dept.jtbd.length]);

  const handleDeptChange = useCallback((idx: number) => {
    setSelectedDeptIdx(idx);
    setSelectedJtbdIdx(0);
  }, []);

  const handleJtbdChange = useCallback((idx: number) => {
    if (autoRotateRef.current) clearTimeout(autoRotateRef.current);
    setSelectedJtbdIdx(idx);
  }, []);

  if (!scenario) return null;

  return (
    <div className="w-full">
      {/* Department tabs */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center gap-1 px-2 py-1.5 rounded-full border ${
          isDark ? 'border-white/[0.08] bg-white/[0.03]' : 'border-gray-200 bg-gray-50/60'
        }`}>
          {DEPARTMENTS.map((d, i) => {
            const isSelected = selectedDeptIdx === i;
            const DepIcon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => handleDeptChange(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
                  isSelected
                    ? isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm'
                    : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <DepIcon className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="hidden sm:inline">{d.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${dept.id}-${jtbdName}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className={`relative rounded-2xl overflow-hidden border ${
            isDark
              ? 'border-white/[0.08] bg-[#111111]'
              : 'border-gray-200 bg-white'
          }`}
          style={{
            boxShadow: isDark
              ? `0 24px 80px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px -20px ${dept.color}15`
              : '0 20px 60px -12px rgba(0,0,0,0.1), 0 4px 20px -4px rgba(0,0,0,0.05)',
          }}
        >
          {/* Top glow accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${dept.color}, transparent)`, opacity: 0.6 }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] min-h-[480px]">
            {/* Left: Agentic flow */}
            <div className={`p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r ${
              isDark ? 'border-white/[0.06] bg-white/[0.015]' : 'border-gray-100 bg-gray-50/40'
            }`}>
              {/* JTBD title */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${dept.color}20` }}
                  >
                    <Bot className="w-4 h-4" style={{ color: dept.color }} />
                  </div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {jtbdName}
                  </h3>
                </div>

                {/* Human request */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: animPhase !== 'request' || true ? 1 : 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl p-3.5 mb-5 border ${
                    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">U</span>
                    </div>
                    <p className={`text-[13px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      "{scenario.humanRequest}"
                    </p>
                  </div>
                </motion.div>

                {/* Agent response */}
                <div className={`rounded-xl p-3.5 border ${
                  isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-gray-50 border-gray-200'
                }`}>
                  {/* Agent header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${agent.bgColor}cc, ${agent.bgColor})` }}
                    >
                      <img
                        src={agent.img}
                        alt=""
                        className="w-full h-full object-contain object-bottom"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = agent.fallback; }}
                      />
                    </div>
                    <span className={`text-[12px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {agent.label}
                    </span>
                    {(animPhase === 'thinking') && (
                      <TypingIndicator color={dept.color} />
                    )}
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    {scenario.agentSteps.map((step, i) => (
                      <AgentStepItem
                        key={step}
                        step={step}
                        index={i}
                        isVisible={animPhase === 'steps' || animPhase === 'result' ? i < visibleSteps : false}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Value badges */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: animPhase === 'result' ? 1 : 0, y: animPhase === 'result' ? 0 : 8 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 mt-5"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${dept.color}15` }}>
                  <Zap className="w-3.5 h-3.5" style={{ color: dept.color }} />
                  <span className="text-[12px] font-bold" style={{ color: dept.color }}>{scenario.valueBadge}</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[12px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Clock className="w-3 h-3" />
                  {scenario.timeSaved}
                </div>
              </motion.div>
            </div>

            {/* Right: Deliverable hero */}
            <div className="relative overflow-hidden">
              {/* Ambient glow behind deliverable */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isDark
                    ? `radial-gradient(ellipse 70% 60% at 50% 40%, ${dept.color}08 0%, transparent 70%)`
                    : 'none',
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={jtbdName}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: animPhase === 'steps' || animPhase === 'result' ? 1 : 0.3, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-full min-h-[320px] lg:min-h-0"
                >
                  {bgImage && (
                    <img
                      src={bgImage}
                      alt={jtbdName}
                      className="absolute inset-0 w-full h-full object-cover object-left-top"
                      loading="lazy"
                      style={{
                        maskImage: isDark ? 'linear-gradient(to bottom, white 60%, transparent 95%)' : undefined,
                        WebkitMaskImage: isDark ? 'linear-gradient(to bottom, white 60%, transparent 95%)' : undefined,
                      }}
                    />
                  )}

                  {/* Result overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: animPhase === 'result' ? 1 : 0, y: animPhase === 'result' ? 0 : 16 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`absolute bottom-0 left-0 right-0 p-5 ${
                      isDark
                        ? 'bg-gradient-to-t from-[#111111] via-[#111111]/90 to-transparent'
                        : 'bg-gradient-to-t from-white via-white/90 to-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: dept.color }} />
                      <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {scenario.result}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* JTBD navigation dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {dept.jtbd.map((job, i) => (
          <button
            key={job}
            onClick={() => handleJtbdChange(i)}
            className="group flex items-center gap-1.5 transition-all duration-200"
          >
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedJtbdIdx === i ? 'w-8' : 'w-1.5'
              }`}
              style={{
                backgroundColor: selectedJtbdIdx === i ? dept.color : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
              }}
            />
          </button>
        ))}
      </div>

      {/* JTBD labels row */}
      <div className="flex items-center justify-center gap-1 mt-3 flex-wrap">
        {dept.jtbd.map((job, i) => (
          <button
            key={job}
            onClick={() => handleJtbdChange(i)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
              selectedJtbdIdx === i
                ? isDark ? 'text-white' : 'text-gray-900'
                : isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
            }`}
            style={selectedJtbdIdx === i ? { backgroundColor: `${dept.color}15`, color: dept.color } : {}}
          >
            {job}
          </button>
        ))}
      </div>
    </div>
  );
}
