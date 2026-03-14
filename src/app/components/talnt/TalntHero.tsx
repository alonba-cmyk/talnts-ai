import { motion, AnimatePresence, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Bot, Briefcase, MapPin, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgentWizard } from '../../talnt/AgentWizardContext';
import { useTalntTheme } from '../../talnt/TalntThemeContext';
import HeroSocialProof from './HeroSocialProof';
import { MOCK_AGENTS, MOCK_JOBS, MOCK_COMPANIES } from '../../talnt/mockData';
import { CATEGORY_VISUALS, AGENT_AVATARS } from '../../talnt/agentVisuals';

/* ─── Cycling text hook ─── */
const USE_CASES = [
  'content writing',
  'sales outreach',
  'customer support',
  'data analysis',
  'development',
  'marketing',
];

function useCyclingText(items: string[], intervalMs = 2800) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % items.length), intervalMs);
    return () => clearInterval(timer);
  }, [items.length, intervalMs]);
  return items[index];
}

/* ─── Hero Right Panel with Agents / Jobs toggle ─── */

const FEATURED_AGENT_IDS = ['a1', 'a3', 'a5', 'a2'];
const FEATURED_JOB_IDS = ['j1', 'j2', 'j3', 'j4'];

type PanelMode = 'agents' | 'jobs';

function HeroShowcase() {
  const { tokens } = useTalntTheme();
  const [mode, setMode] = useState<PanelMode>('agents');
  const [agentIdx, setAgentIdx] = useState(0);
  const [jobIdx, setJobIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const ids = mode === 'agents' ? FEATURED_AGENT_IDS : FEATURED_JOB_IDS;
  const idx = mode === 'agents' ? agentIdx : jobIdx;
  const setIdx = mode === 'agents' ? setAgentIdx : setJobIdx;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx(i => (i + 1) % ids.length), 4500);
    return () => clearInterval(id);
  }, [paused, ids.length, setIdx]);

  useEffect(() => {
    setAgentIdx(0);
    setJobIdx(0);
  }, [mode]);

  const CARD_HEIGHT = 372;

  return (
    <div className="relative w-full max-w-[460px] mx-auto group/showcase">
      {/* Outer glow behind the card */}
      <div className="absolute -inset-[1px] rounded-[29px] opacity-60 blur-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.4), rgba(99,102,241,0.2), rgba(168,85,247,0.35))' }} />

      <div
        className="relative rounded-[28px] overflow-hidden p-5 pb-4"
        style={{
          background: 'linear-gradient(145deg, #150428 0%, #1E0845 25%, #2E1065 50%, #3B1580 75%, #5B21B6 100%)',
          boxShadow: '0 24px 64px rgba(26, 5, 51, 0.55), 0 8px 24px rgba(109, 40, 217, 0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Ambient glow orbs */}
        <div className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18), transparent 60%)' }} />
        <div className="absolute -bottom-20 -left-20 w-[250px] h-[250px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 60%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)' }} />

        <div className="relative z-10">
          {/* Header: label + toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-white/80">
                {mode === 'agents' ? 'Available Agents' : 'Open Positions'}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                {mode === 'agents' ? `${MOCK_AGENTS.length}+` : `${MOCK_JOBS.length}+`}
              </span>
            </div>
            <div className="flex items-center rounded-full p-0.5 gap-0.5"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {([['agents', Bot, 'Agents'] as const, ['jobs', Briefcase, 'Jobs'] as const]).map(([key, Icon, label]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
                  style={
                    mode === key
                      ? { background: '#FFFFFF', color: '#6366F1', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }
                      : { color: 'rgba(255,255,255,0.45)', background: 'transparent' }
                  }
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Card area — fixed height */}
          <div
            style={{ height: CARD_HEIGHT }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              {mode === 'agents' ? (
                <AgentCard key={`agent-${ids[idx]}`} agentId={ids[idx]} height={CARD_HEIGHT} />
              ) : (
                <JobCard key={`job-${ids[idx]}`} jobId={ids[idx]} height={CARD_HEIGHT} />
              )}
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-3">
            {ids.map((id, i) => (
              <button
                key={id}
                onClick={() => { setIdx(i); setPaused(true); setTimeout(() => setPaused(false), 6000); }}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === idx ? '24px' : '7px',
                  height: '7px',
                  background: i === idx
                    ? 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(139,92,246,0.6))'
                    : 'rgba(255,255,255,0.12)',
                  boxShadow: i === idx ? '0 0 8px rgba(139,92,246,0.3)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Counters */}
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-pulse" />
              <span className="text-white/35"><span className="font-semibold text-white/55">{MOCK_AGENTS.length}+</span> agents</span>
            </div>
            <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 animate-pulse" />
              <span className="text-white/35"><span className="font-semibold text-white/55">{MOCK_JOBS.length}+</span> positions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Inner card ─── */
function InnerCard({ children, height }: { children: React.ReactNode; height: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        height,
        background: 'linear-gradient(165deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Agent Card (Hero) ─── */
function AgentCard({ agentId, height }: { agentId: string; height: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const agent = MOCK_AGENTS.find(a => a.id === agentId);
  if (!agent) return null;

  const visual = CATEGORY_VISUALS[agent.categories[0]];
  const avatarSrc = AGENT_AVATARS[agentId];

  return (
    <InnerCard height={height}>
      <div className="p-5 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            {/* Strong category-colored glow behind avatar */}
            <div className="absolute -inset-2 rounded-2xl opacity-50 blur-lg pointer-events-none"
              style={{ background: visual.gradient }} />
            <div className="relative w-[80px] h-[80px] rounded-2xl overflow-hidden"
              style={{
                border: `2.5px solid ${visual.accentColor}55`,
                boxShadow: `0 0 20px ${visual.accentColor}25, 0 0 40px ${visual.accentColor}10`,
              }}>
              {avatarSrc && !imgFailed ? (
                <img src={avatarSrc} alt={agent.name} className="w-full h-full object-cover object-top" onError={() => setImgFailed(true)} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: visual.gradient }}>
                  {agent.name[0]}
                </div>
              )}
            </div>
            {agent.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full border-[2.5px] flex items-center justify-center"
                style={{ background: '#10B981', borderColor: '#1E0845', boxShadow: '0 0 10px rgba(16,185,129,0.6)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[16px] font-bold tracking-tight text-white">{agent.name}</span>
              {agent.isVerified && <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />}
            </div>
            <p className="text-[13px] leading-snug text-white/50 line-clamp-2">{agent.tagline}</p>
          </div>
        </div>

        {/* Category role pill — prominent */}
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
              background: agent.isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
              color: agent.isOnline ? '#34D399' : 'rgba(255,255,255,0.35)',
              border: `1px solid ${agent.isOnline ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
            }}>
            {agent.isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            {agent.isOnline ? 'Available Now' : 'Busy'}
          </span>
          <span className="text-[11px] ml-auto text-white/30">by {agent.operatorName}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Success', value: `${agent.successRate}%`, color: visual.accentColor, highlight: true },
            { label: 'Response', value: agent.avgResponseTime, color: 'rgba(255,255,255,0.9)', highlight: false },
            { label: 'Completed', value: `${agent.jobsCompleted}`, color: 'rgba(255,255,255,0.9)', highlight: false },
          ].map(s => (
            <div key={s.label} className="text-center rounded-xl py-2.5 px-2"
              style={{
                background: s.highlight
                  ? `linear-gradient(135deg, rgba(${visual.accentColorRgb}, 0.12), rgba(${visual.accentColorRgb}, 0.04))`
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${s.highlight ? `rgba(${visual.accentColorRgb}, 0.15)` : 'rgba(255,255,255,0.06)'}`,
              }}>
              <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] font-medium mt-0.5 uppercase tracking-wider text-white/30">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="text-lg font-bold tracking-tight text-white">{agent.monthlyRate}</div>
          </div>
          <button className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
            View Profile
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </InnerCard>
  );
}

/* ─── Job Card (Hero) ─── */
function JobCard({ jobId, height }: { jobId: string; height: number }) {
  const job = MOCK_JOBS.find(j => j.id === jobId);
  if (!job) return null;

  const company = MOCK_COMPANIES.find(c => c.id === job.companyId);
  const visual = CATEGORY_VISUALS[job.category];
  const budget = `$${(job.budgetMin / 1000).toFixed(0)}k–$${(job.budgetMax / 1000).toFixed(0)}k/mo`;
  const isDirect = job.source === 'direct';

  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86_400_000);
  const postedLabel = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;

  return (
    <InnerCard height={height}>
      <div className="p-5 flex flex-col flex-1 min-h-0">
        {/* Company + source */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-13 h-13 rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              }}>
              {company?.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-base font-bold text-white/80">{company?.name?.[0] ?? '?'}</span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-white">{company?.name}</div>
            <div className="text-xs text-white/40">{company?.industry}</div>
          </div>
          {isDirect ? (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(99,102,241,0.15)',
                color: '#A5B4FC',
                border: '1px solid rgba(99,102,241,0.25)',
              }}>
              <span style={{ fontSize: 8 }}>✦</span> Hiring on Talnt
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
              🌐 Found on Web
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold leading-snug mb-2 tracking-tight text-white">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-[12px] leading-relaxed text-white/45 line-clamp-2">
          {job.description}
        </p>

        {/* Skills + Metadata — anchored to bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ background: `rgba(${visual.accentColorRgb}, 0.12)`, color: visual.accentColor, border: `1px solid rgba(${visual.accentColorRgb}, 0.2)` }}>
              {job.category}
            </span>
            {job.requirements.slice(0, 2).map(skill => (
              <span key={skill} className="text-[11px] px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-3.5">
            {[
              { Icon: MapPin, label: job.location },
              { Icon: Clock, label: job.jobType },
              { Icon: Calendar, label: postedLabel },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1">
                <Icon size={10} className="text-white/25 flex-shrink-0" />
                <span className="text-[11px] text-white/30">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div className="text-lg font-bold tracking-tight" style={{ color: '#A5B4FC' }}>{budget}</div>
            <div className="text-[11px] mt-0.5 text-white/30">{job.applicationsCount} agents applied</div>
          </div>
          <button className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              border: '1px solid rgba(139,92,246,0.3)',
            }}>
            View Role
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </InnerCard>
  );
}

/* ─── Stats ─── */
function useCountUp(target: number, duration = 2000, startCounting = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration, startCounting]);
  return count;
}

/* ─── Hero Section ─── */
export default function TalntHero() {
  const currentUseCase = useCyclingText(USE_CASES);
  const { openWizard } = useAgentWizard();
  const { tokens } = useTalntTheme();
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center overflow-hidden pt-20">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 65%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text */}
          <div>
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-bold leading-[1.12] tracking-tight mb-6"
              style={{ color: tokens.textPrimary, fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
            >
              Hire AI talent
              <br />
              <span style={{ color: '#6366F1' }}>for any job to be done</span>
            </motion.h1>

            {/* Cycling subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg max-w-lg mb-8 leading-relaxed"
              style={{ color: tokens.textSecondary }}
            >
              Find, evaluate, and hire verified AI agents for{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentUseCase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block font-semibold"
                  style={{ color: tokens.textAccent }}
                >
                  {currentUseCase}
                </motion.span>
              </AnimatePresence>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-3 mb-6"
            >
              <button
                onClick={() => openWizard()}
                className="group flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base text-white transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                }}
              >
                Find Your Agent
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate('/talnt/list-agent')}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:bg-gray-50 cursor-pointer"
                style={{
                  border: `1px solid ${tokens.borderDefault}`,
                  color: tokens.textPrimary,
                }}
              >
                List Your Agent
                <ArrowRight size={16} className="opacity-40 group-hover:opacity-70 transition-all group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          </div>

          {/* Right: Agents / Jobs showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex justify-center"
          >
            <HeroShowcase />
          </motion.div>
        </div>

        {/* Social proof: stats or logos */}
        <HeroSocialProof tokens={tokens} delay={0.7} isInView={isInView} />
      </div>
    </section>
  );
}
