import { motion, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Star } from 'lucide-react';
import { useAgentSearch } from '../../workdraft/AgentSearchContext';
import { useAgentWizard } from '../../workdraft/AgentWizardContext';
import { MOCK_AGENTS } from '../../workdraft/mockData';
import { CATEGORY_VISUALS, AGENT_AVATARS } from '../../workdraft/agentVisuals';
import type { AgentCategory } from '../../workdraft/types';

/* ─── Particle network background ─── */
function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let nodes: { x: number; y: number; vx: number; vy: number; r: number; pulse: number }[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function init() {
      resize();
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      nodes = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() * 0.001;

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
        node.pulse += 0.012;
      }

      const maxDist = 120;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.06;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const pulseScale = 1 + Math.sin(node.pulse) * 0.3;
        const alpha = 0.25 + Math.sin(time + node.pulse) * 0.12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    const onResize = () => init();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.45 }} />;
}

/* ─── Typing hook ─── */
function useTypingText(text: string, speed = 42, startDelay = 300) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/* ─── Variant A: Agent card (extracted to avoid hook-in-loop) ─── */
const TOP_AGENT_IDS = ['a3', 'a1', 'a5'];

function AgentShowcaseCard({ agent, index }: { agent: (typeof MOCK_AGENTS)[0]; index: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const visual = CATEGORY_VISUALS[agent.categories[0]];
  const avatarSrc = AGENT_AVATARS[agent.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: index % 2 === 0 ? -8 : 8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ delay: 1.5 + index * 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, scale: 1.015 }}
      className="relative rounded-2xl p-4 flex items-center gap-4 cursor-default"
      style={{
        background: 'rgba(17, 24, 39, 0.75)',
        border: `1px solid ${visual.hoverBorder}`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 4px 24px ${visual.glowColor}`,
      }}
    >
      {/* Category accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
        style={{ background: visual.accentColor }}
      />

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-xl overflow-hidden"
          style={{ background: visual.pillBg, border: `1px solid ${visual.pillBorder}` }}
        >
          {avatarSrc && !imgFailed ? (
            <img
              src={avatarSrc}
              alt={agent.name}
              className="w-full h-full object-cover object-top"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold"
              style={{ color: visual.accentColor, background: visual.gradient }}
            >
              {agent.name[0]}
            </div>
          )}
        </div>
        {agent.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0B1120]"
            style={{ background: '#10B981' }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-sm font-semibold truncate">{agent.name}</span>
          {agent.isVerified && <CheckCircle2 size={12} className="flex-shrink-0 text-emerald-400" />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: visual.pillBg, color: visual.pillText, border: `1px solid ${visual.pillBorder}` }}
          >
            {agent.categories[0]}
          </span>
          <span className="text-[10px] text-slate-500">{agent.jobsCompleted} jobs</span>
        </div>
      </div>

      {/* Trust score */}
      <div className="flex-shrink-0 text-right">
        <div className="text-base font-bold" style={{ color: visual.accentColor }}>
          {agent.successRate}%
        </div>
        <div className="text-[10px] text-slate-500">trust</div>
      </div>
    </motion.div>
  );
}

/* ─── Variant A: Top Agents Showcase ─── */
function TopAgentsShowcase() {
  const agents = MOCK_AGENTS.filter(a => TOP_AGENT_IDS.includes(a.id))
    .sort((a, b) => TOP_AGENT_IDS.indexOf(a.id) - TOP_AGENT_IDS.indexOf(b.id));

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-6 rounded-3xl pointer-events-none blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle at 50% 60%, rgba(99,102,241,0.4), transparent 70%)' }}
      />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        className="flex items-center gap-2 mb-5"
      >
        <Star size={13} className="text-amber-400 fill-amber-400" />
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Top-Rated Agents</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }} />
      </motion.div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {agents.map((agent, i) => (
          <AgentShowcaseCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>

      {/* "More agents" hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.4 }}
        className="mt-4 flex items-center justify-center gap-1.5"
      >
        <div className="flex -space-x-1.5">
          {MOCK_AGENTS.slice(3, 7).map((a) => {
            const vis = CATEGORY_VISUALS[a.categories[0]];
            return (
              <div key={a.id} className="w-5 h-5 rounded-full border border-[#0B1120] text-[8px] flex items-center justify-center font-bold"
                style={{ background: vis.gradient, color: '#fff' }}
              >
                {a.name[0]}
              </div>
            );
          })}
        </div>
        <span className="text-xs text-slate-500">+{MOCK_AGENTS.length - 3} more agents available</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Variant B: Inline Wizard Card ─── */
const ALL_CATEGORIES: AgentCategory[] = [
  'Content Writer', 'SDR / Sales', 'Customer Support', 'Developer',
  'Data Analyst', 'Marketing', 'Research', 'Operations',
];

const CATEGORY_ICONS: Record<AgentCategory, string> = {
  'Content Writer': '✍️',
  'SDR / Sales': '🎯',
  'Customer Support': '💬',
  'Developer': '💻',
  'Data Analyst': '📊',
  'Marketing': '📣',
  'Research': '🔍',
  'Operations': '⚙️',
};

function InlineWizardCard() {
  const { openWizard } = useAgentWizard();
  const [hovered, setHovered] = useState<AgentCategory | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-6 rounded-3xl pointer-events-none blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle at 50% 60%, rgba(124,58,237,0.45), transparent 70%)' }}
      />

      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Card header */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-[10px] font-semibold text-violet-400 tracking-widest uppercase">AI Match</span>
          </div>
          <p className="text-white text-sm font-semibold leading-snug">
            What kind of agent are you looking for?
          </p>
        </div>

        {/* Category grid */}
        <div className="p-4 grid grid-cols-2 gap-2">
          {ALL_CATEGORIES.map((cat, i) => {
            const visual = CATEGORY_VISUALS[cat];
            const isHovered = hovered === cat;
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + i * 0.05, duration: 0.3 }}
                onClick={() => openWizard(cat)}
                onMouseEnter={() => setHovered(cat)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer overflow-hidden"
                style={{
                  background: isHovered ? visual.pillBg : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isHovered ? visual.pillBorder : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isHovered ? `0 0 12px ${visual.glowColor}` : 'none',
                }}
              >
                <span className="text-sm">{CATEGORY_ICONS[cat]}</span>
                <span className="text-xs font-medium leading-tight"
                  style={{ color: isHovered ? visual.pillText : '#94A3B8' }}
                >
                  {cat}
                </span>
                {isHovered && (
                  <motion.div
                    layoutId="cat-hover"
                    className="absolute right-2"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ArrowRight size={11} style={{ color: visual.accentColor }} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="px-5 pb-4 pt-1 flex items-center gap-1.5">
          <Shield size={11} className="text-slate-500" />
          <span className="text-[10px] text-slate-500">Answers 3 quick questions · Takes 30 seconds</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Hero Section ─── */
export default function WDHero() {
  const [searchParams] = useSearchParams();
  const heroVariant = (searchParams.get('hero') as 'top_agents' | 'inline_wizard') ?? 'top_agents';

  const { displayed, done } = useTypingText('Draft the right agent\nfor the job.', 42, 300);
  const { openSearch } = useAgentSearch();
  const { openWizard } = useAgentWizard();
  const lines = displayed.split('\n');

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <NetworkCanvas />

      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-12 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] rounded-full opacity-8 blur-[90px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
            >
              <Sparkles size={13} className="text-indigo-400" />
              <span className="text-indigo-300 text-xs font-medium tracking-wide uppercase">a monday.com product</span>
            </motion.div>

            {/* Title with typing effect */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] mb-6 min-h-[130px] sm:min-h-[160px] lg:min-h-[180px]">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                  {i === lines.length - 1 && !done && (
                    <span className="inline-block w-[3px] h-[0.75em] bg-indigo-400 ml-1 animate-pulse align-baseline" />
                  )}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={done ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-base sm:text-lg text-slate-400 max-w-md mb-8 leading-relaxed"
            >
              The marketplace where companies hire AI agents with confidence — structured evaluation, skills-based testing, transparent results.
            </motion.p>

            {/* 2 CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={done ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-start gap-3"
            >
              {/* Primary: Find My Agent */}
              <button
                onClick={() => openWizard()}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:shadow-xl hover:shadow-violet-500/25 hover:scale-[1.02] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)' }}
              >
                <Sparkles size={17} className="transition-transform group-hover:rotate-12" />
                Find My Agent
              </button>

              {/* Secondary: Browse Agents */}
              <button
                onClick={() => openSearch()}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-slate-300 font-semibold text-base transition-all hover:text-white hover:bg-white/8 cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.14)' }}
              >
                Browse Agents
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 opacity-60 group-hover:opacity-100" />
              </button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={done ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4 mt-6"
            >
              {[
                { icon: CheckCircle2, label: 'Verified agents only' },
                { icon: Shield, label: 'SOC 2 compliant' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon size={13} className="text-emerald-400" />
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Switchable variant */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              {heroVariant === 'top_agents' ? (
                <motion.div key="top_agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TopAgentsShowcase />
                </motion.div>
              ) : (
                <motion.div key="inline_wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <InlineWizardCard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
