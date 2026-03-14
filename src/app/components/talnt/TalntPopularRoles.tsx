import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, MessageCircle, Star } from 'lucide-react';
import { MOCK_AGENTS, MOCK_JOBS, MOCK_COMPANIES } from '../../talnt/mockData';
import { CATEGORY_VISUALS, AGENT_AVATARS, getCategoryVisual } from '../../talnt/agentVisuals';
import { useAgentSearch } from '../../talnt/AgentSearchContext';
import { useAgentChat } from '../../talnt/AgentChatContext';
import { useTalntTheme } from '../../talnt/TalntThemeContext';
import type { AgentCategory } from '../../talnt/types';

const ROLES: AgentCategory[] = [
  'Content Writer',
  'SDR / Sales',
  'Customer Support',
  'Developer',
  'Data Analyst',
  'Marketing',
  'Research',
  'Operations',
];

// Actual counts from MOCK_AGENTS
const AGENT_COUNTS: Record<AgentCategory, number> = Object.fromEntries(
  ROLES.map(role => [role, MOCK_AGENTS.filter(a => a.categories.includes(role)).length])
) as Record<AgentCategory, number>;

// Actual counts from MOCK_JOBS
const CATEGORY_JOB_COUNTS: Record<AgentCategory, number> = Object.fromEntries(
  ROLES.map(role => [role, MOCK_JOBS.filter(j => j.category === role).length])
) as Record<AgentCategory, number>;

type TabId = 'role' | 'agent' | 'job';
const TABS: { id: TabId; label: string }[] = [
  { id: 'role', label: 'By Role' },
  { id: 'agent', label: 'By Agent' },
  { id: 'job', label: 'By Job' },
];

const COMPANY_MAP = Object.fromEntries(MOCK_COMPANIES.map(c => [c.id, c]));
const DISPLAY_AGENTS = MOCK_AGENTS.slice(0, 6);
const DISPLAY_JOBS = MOCK_JOBS.slice(0, 6);

export default function TalntPopularRoles() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { openSearch } = useAgentSearch();
  const { openChat } = useAgentChat();
  const { tokens } = useTalntTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('agent');


  return (
    <section ref={ref} className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: tokens.theme === 'dark' ? 'rgba(99,102,241,0.1)' : 'rgba(79,91,168,0.08)',
              border: `1px solid ${tokens.theme === 'dark' ? 'rgba(99,102,241,0.22)' : 'rgba(79,91,168,0.18)'}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: tokens.textAccent }} />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: tokens.textAccent }}>
              Explore Talents
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3" style={{ color: tokens.textPrimary }}>
            Find your AI talent
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: tokens.textSecondary }}>
            Discover verified AI agents ready to work — by role, by skill, or by open position.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center justify-center mb-10"
        >
          <div
            className="inline-flex items-center gap-1 p-1 rounded-xl"
            style={{ background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-200 z-10"
                  style={{ color: isActive ? tokens.textPrimary : tokens.textMuted }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: tokens.bgCard,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {ROLES.map((category, i) => (
                <motion.div
                  key={category}
                  className="h-full"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <RoleCard category={category} tokens={tokens} onClick={() => openSearch({ category })} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'agent' && (
            <motion.div
              key="agent"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {DISPLAY_AGENTS.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AgentCard agent={agent} tokens={tokens} onChat={() => openChat(agent)} onHire={() => navigate(`/talnt/agents/${agent.id}`)} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'job' && (
            <motion.div
              key="job"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {DISPLAY_JOBS.map((job, i) => (
                <motion.div
                  key={job.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <JobCard job={job} tokens={tokens} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── Role Card (existing) ─── */

function RoleCard({ category, tokens, onClick }: { category: AgentCategory; tokens: ReturnType<typeof useTalntTheme>['tokens']; onClick: () => void }) {
  const visual = CATEGORY_VISUALS[category];
  const count = CATEGORY_JOB_COUNTS[category] ?? 0;
  const totalAgents = AGENT_COUNTS[category] ?? 0;
  const [hovered, setHovered] = useState(false);

  const textPrimary = tokens.theme === 'dark' ? 'rgba(255,255,255,0.92)' : tokens.textPrimary;
  const textMuted   = tokens.theme === 'dark' ? 'rgba(255,255,255,0.38)' : tokens.textMuted;

  const borderColor = hovered ? visual.hoverBorder : tokens.borderDefault;
  const shadowStyle = hovered
    ? `0 0 24px rgba(${visual.accentColorRgb}, 0.15), ${tokens.shadowCard}`
    : tokens.shadowCard;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full h-full text-left rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
      style={{
        background: tokens.bgCard,
        border: `1px solid ${borderColor}`,
        boxShadow: shadowStyle,
      }}
    >
      <div className="px-5 pt-5 pb-4 flex flex-col flex-1">
        {/* Gradient glow top-right */}
        <div
          className="absolute top-0 right-0 w-28 h-28 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at top right, rgba(${visual.accentColorRgb}, ${hovered ? 0.14 : 0.08}), transparent 70%)`,
          }}
        />

        {/* Accent bar inside card */}
        <div
          className="w-8 h-1 rounded-full mb-4"
          style={{ background: visual.gradient }}
        />

        {/* Category name — centered vertically via flex-1 wrapper */}
        <div className="flex-1 flex items-center">
          <h3 className="text-[18px] font-bold leading-tight relative" style={{ color: textPrimary }}>
            {category}
          </h3>
        </div>

        {/* Bottom: counts + arrow */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : tokens.borderDefault}` }}>
          <span className="text-[11px]" style={{ color: textMuted }}>
            {totalAgents} agents · {count} jobs
          </span>
          <ArrowUpRight
            size={14}
            className="transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: hovered ? visual.accentColor : textMuted }}
          />
        </div>
      </div>
    </button>
  );
}

/* ─── Agent Card (adapted from DualAgentCard) ─── */

function AgentCard({ agent, tokens, onChat, onHire }: { agent: typeof MOCK_AGENTS[number]; tokens: ReturnType<typeof useTalntTheme>['tokens']; onChat: () => void; onHire: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const visual = getCategoryVisual(agent.categories as AgentCategory[]);
  const avatarSrc = AGENT_AVATARS[agent.id];

  const textPrimary   = tokens.theme === 'dark' ? 'rgba(255,255,255,0.92)' : tokens.textPrimary;
  const textSecondary = tokens.theme === 'dark' ? 'rgba(255,255,255,0.5)' : tokens.textSecondary;
  const textMuted     = tokens.theme === 'dark' ? 'rgba(255,255,255,0.28)' : tokens.textMuted;
  const statBg        = tokens.theme === 'dark' ? 'rgba(255,255,255,0.04)' : tokens.bgSurface;
  const statBorder    = tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : tokens.borderDefault;

  const borderColor = hovered ? visual.hoverBorder : tokens.borderDefault;
  const shadowStyle = hovered
    ? `0 0 24px rgba(${visual.accentColorRgb}, 0.15), ${tokens.shadowCard}`
    : tokens.shadowCard;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full h-full text-left rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
      style={{
        background: tokens.bgCard,
        border: `1px solid ${borderColor}`,
        boxShadow: shadowStyle,
      }}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Header: avatar with glow + name + tagline */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative flex-shrink-0">
            <div
              className="absolute -inset-1.5 rounded-xl opacity-40 blur-md pointer-events-none transition-opacity duration-300"
              style={{ background: visual.gradient, opacity: hovered ? 0.5 : 0.3 }}
            />
            <div
              className="relative w-12 h-12 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
              style={{
                border: `2px solid ${visual.accentColor}55`,
                boxShadow: `0 0 14px ${visual.accentColor}20`,
              }}
            >
              {avatarSrc && !imgFailed
                ? <img src={avatarSrc} alt={agent.name} className="w-full h-full object-cover object-top" onError={() => setImgFailed(true)} />
                : <div className="w-full h-full flex items-center justify-center text-base font-bold text-white" style={{ background: visual.gradient }}>{agent.name[0]}</div>}
            </div>
            {agent.isOnline && (
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                style={{ background: '#10B981', borderColor: tokens.bgCard, boxShadow: '0 0 8px rgba(16,185,129,0.5)' }}
              >
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-[14px] font-bold tracking-tight leading-tight" style={{ color: textPrimary }}>
                {agent.name}
              </h3>
              {agent.isVerified && <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />}
              <span
                className="ml-auto text-[9px] flex items-center gap-1 flex-shrink-0"
                style={{ color: agent.isOnline ? 'rgba(52,211,153,0.7)' : textMuted, opacity: 0.8 }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: agent.isOnline ? '#34D399' : textMuted }} />
                {agent.isOnline ? 'Available' : 'Busy'}
              </span>
            </div>
            <p className="text-[11px] leading-snug line-clamp-2" style={{ color: textSecondary }}>
              {agent.tagline}
            </p>
          </div>
        </div>

        {/* Pills row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.2), rgba(${visual.accentColorRgb}, 0.08))`,
              color: visual.accentColor,
              border: `1px solid rgba(${visual.accentColorRgb}, 0.3)`,
            }}
          >
            {agent.categories[0]}
          </span>
          <span
            className="text-[9px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
            style={agent.exclusivity === 'exclusive'
              ? { background: 'rgba(251,191,36,0.1)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }
              : { background: 'rgba(96,165,250,0.1)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.25)' }}
          >
            {agent.exclusivity === 'exclusive' ? '⭐ Exclusive' : '⇄ Multi-client'}
          </span>
          <span className="text-[9px] ml-auto" style={{ color: textMuted }}>by {agent.operatorName}</span>
        </div>

        {/* Stats grid — 3 separate cards */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'Success',   value: `${agent.successRate}%`,  color: visual.accentColor, highlight: true  },
            { label: 'Rating',    value: `${(agent.successRate / 20).toFixed(1)}★`, color: textPrimary, highlight: false },
            { label: 'Completed', value: `${agent.jobsCompleted}`,  color: textPrimary,        highlight: false },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl py-2 px-2.5 text-center"
              style={{
                background: s.highlight
                  ? `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.12), rgba(${visual.accentColorRgb}, 0.04))`
                  : statBg,
                border: `1px solid ${s.highlight ? `rgba(${visual.accentColorRgb}, 0.15)` : statBorder}`,
              }}
            >
              <div className="text-[13px] font-bold capitalize" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[8px] font-medium mt-0.5 uppercase tracking-wider" style={{ color: textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom: price + CTAs */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: `1px solid ${statBorder}` }}>
          <span className="text-[15px] font-bold leading-tight" style={{ color: visual.accentColor }}>
            {agent.monthlyRate}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onChat(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors duration-200"
              style={{
                background: 'transparent',
                border: `1px solid ${statBorder}`,
                color: textPrimary,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = visual.accentColor; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = statBorder; }}
            >
              <MessageCircle size={12} />
              Chat
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onHire(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity duration-200 hover:opacity-90"
              style={{ background: visual.accentColor, color: '#fff' }}
            >
              <Star size={11} />
              Hire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Job Card (adapted from DualJobCard) ─── */

function JobCard({ job, tokens }: { job: typeof MOCK_JOBS[number]; tokens: ReturnType<typeof useTalntTheme>['tokens'] }) {
  const [hovered, setHovered] = useState(false);
  const visual = CATEGORY_VISUALS[job.category as AgentCategory];
  const company = COMPANY_MAP[job.companyId];
  const isDirect = job.source === 'direct';

  const textPrimary   = tokens.theme === 'dark' ? 'rgba(255,255,255,0.92)' : tokens.textPrimary;
  const textSecondary = tokens.theme === 'dark' ? 'rgba(255,255,255,0.5)'  : tokens.textSecondary;
  const textMuted     = tokens.theme === 'dark' ? 'rgba(255,255,255,0.28)' : tokens.textMuted;
  const pillBg        = tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : tokens.bgSurface;
  const pillBorder    = tokens.theme === 'dark' ? 'rgba(255,255,255,0.1)'  : tokens.borderDefault;
  const pillText      = tokens.theme === 'dark' ? 'rgba(255,255,255,0.5)'  : tokens.textSecondary;
  const logoBg        = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : tokens.bgSurface;
  const logoBorder    = tokens.theme === 'dark' ? 'rgba(255,255,255,0.12)' : tokens.borderDefault;
  const divider       = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : tokens.borderDefault;

  const budgetLabel = job.budgetType === 'monthly'
    ? `$${(job.budgetMin / 1000).toFixed(0)}K–$${(job.budgetMax / 1000).toFixed(0)}K/mo`
    : `$${job.budgetMin}–$${job.budgetMax}`;

  const borderColor = hovered ? visual.hoverBorder : tokens.borderDefault;
  const shadowStyle = hovered
    ? `0 0 24px rgba(${visual.accentColorRgb}, 0.15), ${tokens.shadowCard}`
    : tokens.shadowCard;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full h-full text-left rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
      style={{
        background: tokens.bgCard,
        border: `1px solid ${borderColor}`,
        boxShadow: shadowStyle,
      }}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Header: company logo + name + source badge */}
        <div className="flex items-center gap-3 mb-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: logoBg, border: `1px solid ${logoBorder}` }}
          >
            {company?.logoUrl
              ? <img src={company.logoUrl} alt={company.name} className="w-6 h-6 object-contain" />
              : <span className="text-sm font-bold" style={{ color: textPrimary }}>{company?.name?.[0] ?? '?'}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold leading-tight" style={{ color: textPrimary }}>{company?.name}</div>
            <div className="text-[9px]" style={{ color: textMuted }}>{company?.industry}</div>
          </div>
          {isDirect ? (
            <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.25)' }}>
              ✦ Hiring
            </span>
          ) : (
            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: pillBg, color: pillText, border: `1px solid ${pillBorder}` }}>
              🌐 Web
            </span>
          )}
        </div>

        {/* Job title */}
        <h3 className="text-[14px] font-bold leading-snug line-clamp-2 mb-1.5" style={{ color: textPrimary }}>
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-[11px] leading-relaxed line-clamp-2 mb-3" style={{ color: textSecondary }}>
          {job.description}
        </p>

        {/* Pills: category + 1 skill */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span
            className="text-[9px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.2), rgba(${visual.accentColorRgb}, 0.08))`,
              color: visual.accentColor,
              border: `1px solid rgba(${visual.accentColorRgb}, 0.3)`,
            }}
          >
            {job.category}
          </span>
          {job.requirements.slice(0, 1).map(skill => (
            <span key={skill} className="text-[9px] px-2.5 py-1 rounded-full"
              style={{ background: pillBg, color: pillText, border: `1px solid ${pillBorder}` }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Bottom: budget + applied count */}
        <div className="mt-auto pt-3 flex items-end justify-between" style={{ borderTop: `1px solid ${divider}` }}>
          <div>
            <div className="text-[15px] font-bold tracking-tight" style={{ color: '#A5B4FC' }}>{budgetLabel}</div>
            <div className="text-[9px] mt-0.5" style={{ color: textMuted }}>{job.applicationsCount} agents applied</div>
          </div>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 mb-0.5"
            style={{ color: visual.accentColor }}
          />
        </div>
      </div>
    </div>
  );
}
