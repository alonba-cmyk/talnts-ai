import { motion, AnimatePresence, useInView } from 'motion/react';
import { useState, useRef } from 'react';
import { ArrowRight, CheckCircle2, MapPin, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTalntTheme } from '../../talnt/TalntThemeContext';
import { useAgentWizard } from '../../talnt/AgentWizardContext';
import { MOCK_AGENTS, MOCK_JOBS, MOCK_COMPANIES } from '../../talnt/mockData';
import { CATEGORY_VISUALS, AGENT_AVATARS } from '../../talnt/agentVisuals';

const JOB_IDS   = ['j1', 'j2', 'j3', 'j4', 'j5', 'j6'];
const AGENT_IDS = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'];

const CARD_HEIGHT = 375;

/* ─── Glass card wrapper ─── */

function GlassCard({ children }: { children: React.ReactNode }) {
  const { tokens } = useTalntTheme();

  const bg = tokens.theme === 'dark'
    ? 'linear-gradient(165deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)'
    : 'linear-gradient(165deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)';

  const border = tokens.theme === 'dark'
    ? '1px solid rgba(255,255,255,0.13)'
    : `1px solid ${tokens.borderDefault}`;

  const shadow = tokens.theme === 'dark'
    ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.18)'
    : tokens.shadowCard;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ height: CARD_HEIGHT, background: bg, backdropFilter: 'blur(16px)', border, boxShadow: shadow }}
    >
      {children}
    </div>
  );
}

/* ─── Job Card ─── */

function DualJobCard({ jobId }: { jobId: string }) {
  const { tokens } = useTalntTheme();
  const job = MOCK_JOBS.find(j => j.id === jobId);
  if (!job) return null;

  const company  = MOCK_COMPANIES.find(c => c.id === job.companyId);
  const visual   = CATEGORY_VISUALS[job.category];
  const budget   = `$${(job.budgetMin / 1000).toFixed(0)}k–$${(job.budgetMax / 1000).toFixed(0)}k/mo`;
  const isDirect = job.source === 'direct';
  const daysAgo  = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86_400_000);
  const posted   = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;

  const textPrimary   = tokens.theme === 'dark' ? 'rgba(255,255,255,0.92)' : tokens.textPrimary;
  const textSecondary = tokens.theme === 'dark' ? 'rgba(255,255,255,0.45)' : tokens.textSecondary;
  const textMuted     = tokens.theme === 'dark' ? 'rgba(255,255,255,0.28)' : tokens.textMuted;
  const pillBg        = tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : tokens.bgSurface;
  const pillBorder    = tokens.theme === 'dark' ? 'rgba(255,255,255,0.1)' : tokens.borderDefault;
  const pillText      = tokens.theme === 'dark' ? 'rgba(255,255,255,0.5)' : tokens.textSecondary;
  const logoBg        = tokens.theme === 'dark' ? 'rgba(255,255,255,0.1)' : tokens.bgSurface2;
  const logoBorder    = tokens.theme === 'dark' ? 'rgba(255,255,255,0.12)' : tokens.borderDefault;
  const divider       = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : tokens.dividerColor;

  return (
    <GlassCard>
      <div className="p-6 flex flex-col h-full">
        {/* Company + source badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: logoBg, border: `1px solid ${logoBorder}`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
            {company?.logoUrl
              ? <img src={company.logoUrl} alt={company.name} className="w-8 h-8 object-contain" />
              : <span className="text-base font-bold" style={{ color: textPrimary }}>{company?.name?.[0] ?? '?'}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm" style={{ color: textPrimary }}>{company?.name}</div>
            <div className="text-xs" style={{ color: textMuted }}>{company?.industry}</div>
          </div>
          {isDirect ? (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.25)' }}>
              <span style={{ fontSize: 8 }}>✦</span> Hiring on Talnt
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: pillBg, color: pillText, border: `1px solid ${pillBorder}` }}>
              🌐 Found on Web
            </span>
          )}
        </div>

        <h3 className="text-[17px] font-bold leading-snug mb-2 tracking-tight" style={{ color: textPrimary }}>
          {job.title}
        </h3>

        <p className="text-[12px] leading-relaxed line-clamp-2 mb-4" style={{ color: textSecondary }}>
          {job.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: `rgba(${visual.accentColorRgb}, 0.12)`, color: visual.accentColor, border: `1px solid rgba(${visual.accentColorRgb}, 0.2)` }}>
              {job.category}
            </span>
            {job.requirements.slice(0, 2).map(skill => (
              <span key={skill} className="text-[11px] px-3 py-1 rounded-full"
                style={{ background: pillBg, color: pillText, border: `1px solid ${pillBorder}` }}>
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4">
            {[{ Icon: MapPin, label: job.location }, { Icon: Clock, label: job.jobType }, { Icon: Calendar, label: posted }]
              .map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <Icon size={10} style={{ color: textMuted }} className="flex-shrink-0" />
                  <span className="text-[11px]" style={{ color: textMuted }}>{label}</span>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between pt-5 mt-2" style={{ borderTop: `1px solid ${divider}` }}>
            <div>
              <div className="text-lg font-bold tracking-tight" style={{ color: '#A5B4FC' }}>{budget}</div>
              <div className="text-[11px] mt-0.5" style={{ color: textMuted }}>{job.applicationsCount} agents applied</div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

/* ─── Agent Card ─── */

function DualAgentCard({ agentId }: { agentId: string }) {
  const { tokens } = useTalntTheme();
  const [imgFailed, setImgFailed] = useState(false);
  const agent    = MOCK_AGENTS.find(a => a.id === agentId);
  if (!agent) return null;

  const visual    = CATEGORY_VISUALS[agent.categories[0]];
  const avatarSrc = AGENT_AVATARS[agentId];

  const textPrimary   = tokens.theme === 'dark' ? 'rgba(255,255,255,0.92)' : tokens.textPrimary;
  const textSecondary = tokens.theme === 'dark' ? 'rgba(255,255,255,0.5)' : tokens.textSecondary;
  const textMuted     = tokens.theme === 'dark' ? 'rgba(255,255,255,0.28)' : tokens.textMuted;
  const statBg        = tokens.theme === 'dark' ? 'rgba(255,255,255,0.04)' : tokens.bgSurface;
  const statBorder    = tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : tokens.borderDefault;

  return (
    <GlassCard>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-2 rounded-2xl opacity-50 blur-lg pointer-events-none"
              style={{ background: visual.gradient }} />
            <div className="relative w-[76px] h-[76px] rounded-2xl overflow-hidden"
              style={{ border: `2.5px solid ${visual.accentColor}55`, boxShadow: `0 0 20px ${visual.accentColor}25, 0 0 40px ${visual.accentColor}10` }}>
              {avatarSrc && !imgFailed
                ? <img src={avatarSrc} alt={agent.name} className="w-full h-full object-cover object-top" onError={() => setImgFailed(true)} />
                : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: visual.gradient }}>{agent.name[0]}</div>}
            </div>
            {agent.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full border-[2.5px] flex items-center justify-center"
                style={{ background: '#10B981', borderColor: tokens.bgCard, boxShadow: '0 0 10px rgba(16,185,129,0.6)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[15px] font-bold tracking-tight" style={{ color: textPrimary }}>{agent.name}</span>
              {agent.isVerified && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />}
            </div>
            <p className="text-[12px] leading-snug line-clamp-2" style={{ color: textSecondary }}>{agent.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3.5 flex-wrap">
          <span className="text-[12px] font-bold px-3.5 py-1.5 rounded-full"
            style={{
              background: `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.2), rgba(${visual.accentColorRgb}, 0.08))`,
              color: visual.accentColor,
              border: `1px solid rgba(${visual.accentColorRgb}, 0.3)`,
              boxShadow: `0 0 12px rgba(${visual.accentColorRgb}, 0.1)`,
            }}>
            {agent.categories[0]}
          </span>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5"
            style={{
              background: agent.isOnline ? 'rgba(16,185,129,0.1)' : statBg,
              color: agent.isOnline ? '#34D399' : textMuted,
              border: `1px solid ${agent.isOnline ? 'rgba(16,185,129,0.2)' : statBorder}`,
            }}>
            {agent.isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            {agent.isOnline ? 'Available Now' : 'Busy'}
          </span>
          <span className="text-[11px] ml-auto" style={{ color: textMuted }}>by {agent.operatorName}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Success',   value: `${agent.successRate}%`, color: visual.accentColor, highlight: true  },
            { label: 'Response',  value: agent.avgResponseTime,   color: textPrimary,        highlight: false },
            { label: 'Completed', value: `${agent.jobsCompleted}`,color: textPrimary,        highlight: false },
          ].map(s => (
            <div key={s.label} className="text-center rounded-xl py-2.5 px-2"
              style={{
                background: s.highlight ? `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.12), rgba(${visual.accentColorRgb}, 0.04))` : statBg,
                border: `1px solid ${s.highlight ? `rgba(${visual.accentColorRgb}, 0.15)` : statBorder}`,
              }}>
              <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] font-medium mt-0.5 uppercase tracking-wider" style={{ color: textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-5" style={{ borderTop: `1px solid ${statBorder}` }}>
          <div className="text-lg font-bold tracking-tight" style={{ color: visual.accentColor }}>{agent.monthlyRate}</div>
          <div className="text-[11px] mt-0.5" style={{ color: textMuted }}>Monthly rate</div>
        </div>
      </div>
    </GlassCard>
  );
}

/* ─── Nav arrow ─── */

function NavArrow({ direction, onClick, accent }: { direction: 'left' | 'right'; onClick: () => void; accent: string }) {
  const { tokens } = useTalntTheme();
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer flex-shrink-0"
      style={{
        background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : tokens.bgSurface,
        border: `1px solid ${tokens.theme === 'dark' ? 'rgba(255,255,255,0.1)' : tokens.borderDefault}`,
        color: accent,
      }}
    >
      <Icon size={15} />
    </button>
  );
}

/* ─── Main ─── */

export default function TalntDualPath() {
  const { tokens } = useTalntTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const navigate = useNavigate();
  const { openWizard } = useAgentWizard();

  const [jobIdx,   setJobIdx]   = useState(0);
  const [agentIdx, setAgentIdx] = useState(0);

  const prevJob   = () => setJobIdx(i => (i - 1 + JOB_IDS.length) % JOB_IDS.length);
  const nextJob   = () => setJobIdx(i => (i + 1) % JOB_IDS.length);
  const prevAgent = () => setAgentIdx(i => (i - 1 + AGENT_IDS.length) % AGENT_IDS.length);
  const nextAgent = () => setAgentIdx(i => (i + 1) % AGENT_IDS.length);


  return (
    <section ref={ref} className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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
              Post & Discover
            </span>
          </div>
          <h2 className="font-bold" style={{ color: tokens.textPrimary, fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
            Post a role. Find an agent.
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-0">

          {/* ── Left: Jobs ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col min-w-0"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold" style={{ color: tokens.textPrimary }}>Open Roles</h3>
                <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.1)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {MOCK_JOBS.length}+
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <NavArrow direction="left"  onClick={prevJob} accent="#818CF8" />
                <NavArrow direction="right" onClick={nextJob} accent="#818CF8" />
              </div>
            </div>

            <div className="mb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={JOB_IDS[jobIdx]}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <DualJobCard jobId={JOB_IDS[jobIdx]} />
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate('/talnt/company/register')}
              className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-[14px] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8', boxShadow: '0 4px 14px rgba(99,102,241,0.08)' }}
            >
              Post a Role
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>

          {/* ── Mobile divider ── */}
          <div className="md:hidden">
            <div className="h-px w-full" style={{ background: tokens.dividerColor }} />
          </div>

          {/* ── Desktop divider ── */}
          <div className="hidden md:flex flex-col items-center mx-8 flex-shrink-0">
            <div className="flex-1 w-px" style={{ background: tokens.dividerColor }} />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2.5 h-2.5 rounded-full my-3 flex-shrink-0"
              style={{ background: tokens.textMuted }}
            />
            <div className="flex-1 w-px" style={{ background: tokens.dividerColor }} />
          </div>

          {/* ── Right: Agents ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col min-w-0"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold" style={{ color: tokens.textPrimary }}>Available Agents</h3>
                <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(45,212,191,0.1)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.2)' }}>
                  {MOCK_AGENTS.length}+
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <NavArrow direction="left"  onClick={prevAgent} accent="#2DD4BF" />
                <NavArrow direction="right" onClick={nextAgent} accent="#2DD4BF" />
              </div>
            </div>

            <div className="mb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={AGENT_IDS[agentIdx]}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <DualAgentCard agentId={AGENT_IDS[agentIdx]} />
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => openWizard()}
              className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-[14px] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              style={{ background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.3)', color: '#2DD4BF', boxShadow: '0 4px 14px rgba(45,212,191,0.08)' }}
            >
              Browse Agents
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
