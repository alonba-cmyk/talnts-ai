import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, Sparkles, Zap, Brain, Target, Cpu, BarChart3, Users, Workflow, Database, Globe, Bot } from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';

type HeroVariant = 'typewriter' | 'gradient_wave' | 'bold_statement' | 'glassmorphism' | 'spotlight' | 'orbit' | 'split' | 'reveal' | 'spotlight_v2' | 'spotlight_v3' | 'spotlight_v4';

interface PlatformHeroProps {
  variant?: HeroVariant;
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 1 — Typewriter  (original, enhanced)
   ───────────────────────────────────────────────────────────── */
function TypewriterHero() {
  const fullTitle = 'AI Work Platform';
  const fullSubtitle = 'for any business result';
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [phase, setPhase] = useState<'title' | 'subtitle' | 'done'>('title');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'title') {
      if (displayedTitle.length < fullTitle.length) {
        timeout = setTimeout(() => {
          setDisplayedTitle(fullTitle.slice(0, displayedTitle.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => setPhase('subtitle'), 300);
      }
    } else if (phase === 'subtitle') {
      if (displayedSubtitle.length < fullSubtitle.length) {
        timeout = setTimeout(() => {
          setDisplayedSubtitle(fullSubtitle.slice(0, displayedSubtitle.length + 1));
        }, 50);
      } else {
        setPhase('done');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedTitle, displayedSubtitle, phase]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      {/* Subtle animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-[#6161ff]/5 to-[#00d2d2]/5"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 right-[15%] w-96 h-96 rounded-full bg-gradient-to-tl from-[#ff6b6b]/5 to-[#6161ff]/5"
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-[30%] w-48 h-48 rounded-full bg-gradient-to-r from-[#00d2d2]/4 to-[#6161ff]/4"
          animate={{ y: [0, 25, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        {/* Sidekick Star Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            <img
              src={sidekickLogo}
              alt="Sidekick"
              className="w-16 h-16 object-contain"
            />
            {/* Writing sparkle effect */}
            <motion.div
              className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-[#6161ff]"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Main Title with Typewriter */}
        <div className="mb-4 min-h-[3.5rem] md:min-h-[4.5rem]">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            {displayedTitle}
            {phase === 'title' && (
              <motion.span
                className="inline-block w-[3px] h-[1em] bg-[#6161ff] ml-1 align-baseline"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
          </h1>
        </div>

        {/* Subtitle with Typewriter */}
        <div className="min-h-[2.5rem] md:min-h-[3rem] mb-6">
          <p className="text-2xl md:text-4xl font-light text-gray-500">
            {displayedSubtitle}
            {phase === 'subtitle' && (
              <motion.span
                className="inline-block w-[3px] h-[0.9em] bg-[#6161ff] ml-1 align-baseline"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
          </p>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: phase === 'done' ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-24 h-[2px] bg-gradient-to-r from-[#6161ff] to-[#00d2d2] mx-auto mt-8"
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'done' ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          Explore the platform
        </p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 2 — Gradient Wave  (dark, animated wave)
   ───────────────────────────────────────────────────────────── */
function GradientWaveHero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#0a0a1a]">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(97,97,255,0.3) 0%, transparent 70%)' }}
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,210,210,0.25) 0%, transparent 70%)' }}
          animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50%] h-[50%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }}
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Animated wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden opacity-20">
        <motion.svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full"
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            fill="url(#wave-gradient)"
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,149.3C960,117,1056,75,1152,74.7C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6161ff" />
              <stop offset="50%" stopColor="#00d2d2" />
              <stop offset="100%" stopColor="#6161ff" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center max-w-5xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <img src={sidekickLogo} alt="Sidekick" className="w-14 h-14 object-contain" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00d2d2]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00d2d2]" />
          <span className="text-xs font-medium text-white/60 tracking-wider uppercase">Next Generation Platform</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">AI Work</span>
          <br />
          <span className="bg-gradient-to-r from-[#6161ff] via-[#00d2d2] to-[#6161ff] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
            Platform
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 15 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-xl md:text-2xl text-white/50 font-light max-w-2xl mx-auto mb-10"
        >
          Where teams and AI agents work together
          <br />
          <span className="text-white/70">to achieve any business result</span>
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: Brain, label: 'AI Agents' },
            { icon: Users, label: 'Team Collaboration' },
            { icon: Workflow, label: 'Smart Workflows' },
          ].map((pill, i) => (
            <motion.div
              key={pill.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <pill.icon className="w-4 h-4 text-[#6161ff]" />
              <span className="text-sm text-white/70">{pill.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-white/30 font-medium tracking-wide">Explore the platform</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 3 — Bold Statement  (particles, gradient text)
   ───────────────────────────────────────────────────────────── */
function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20"
      style={{ left: x, top: y, width: size, height: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        y: [0, -100],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}

function BoldStatementHero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t); }, []);

  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      x: `${Math.random() * 100}%`,
      y: `${60 + Math.random() * 40}%`,
      size: 2 + Math.random() * 4,
    })), []
  );

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#030014]">
      {/* Gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0020] via-[#030014] to-[#0a0a1a]" />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(97,97,255,0.15) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((p) => (
        <FloatingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
      ))}

      {/* Horizontal glow line */}
      <motion.div
        className="absolute top-[45%] left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(97,97,255,0.3), rgba(0,210,210,0.3), transparent)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: ready ? 1 : 0, opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-6xl mx-auto"
      >
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
            <img src={sidekickLogo} alt="Sidekick" className="w-8 h-8 object-contain" />
            <div className="w-px h-5 bg-white/10" />
            <span className="text-sm text-white/50 font-medium">monday.com</span>
          </div>
        </motion.div>

        {/* Main statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9]">
            <span className="block bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
              AI Work
            </span>
            <span className="block bg-gradient-to-r from-[#6161ff] via-[#a855f7] to-[#00d2d2] bg-clip-text text-transparent mt-2">
              Platform
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-white/40 font-light mt-8 max-w-xl mx-auto"
        >
          Where human creativity meets AI capability.
          <br />
          Achieve any business result — together.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex justify-center gap-12 mt-12"
        >
          {[
            { icon: Zap, value: '10x', label: 'Faster' },
            { icon: Target, value: '100%', label: 'Aligned' },
            { icon: Cpu, value: '24/7', label: 'AI Agents' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.15 }}
              className="text-center"
            >
              <stat.icon className="w-5 h-5 text-[#6161ff] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white/90">{stat.value}</p>
              <p className="text-xs text-white/30 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-white/25 font-medium tracking-wide">Explore the platform</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 4 — Glassmorphism  (frosted glass, mesh gradient)
   ───────────────────────────────────────────────────────────── */
function GlassmorphismHero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  const features = [
    { icon: Brain, title: 'AI Agents', desc: 'Autonomous agents that learn and act' },
    { icon: Users, title: 'Team Sync', desc: 'Real-time collaboration at scale' },
    { icon: BarChart3, title: 'Insights', desc: 'Data-driven decisions, instantly' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[100px]"
          style={{ background: 'rgba(97,97,255,0.15)' }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[55%] rounded-full blur-[100px]"
          style={{ background: 'rgba(0,210,210,0.12)' }}
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[30%] left-[40%] w-[35%] h-[35%] rounded-full blur-[80px]"
          style={{ background: 'rgba(168,85,247,0.1)' }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, #6161ff 0.5px, transparent 0.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-5xl mx-auto"
      >
        {/* Logo + label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg shadow-black/[0.03]">
            <img src={sidekickLogo} alt="Sidekick" className="w-10 h-10 object-contain" />
            <div className="w-px h-6 bg-gray-200" />
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">monday.com</p>
              <p className="text-[10px] text-gray-500 leading-tight">Work OS</p>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 mb-4"
        >
          AI Work{' '}
          <span className="bg-gradient-to-r from-[#6161ff] to-[#00d2d2] bg-clip-text text-transparent">
            Platform
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 15 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-xl md:text-2xl text-gray-500 font-light max-w-2xl mx-auto mb-12"
        >
          Teams and AI agents, working as one — for any business result
        </motion.p>

        {/* Glass feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + i * 0.15 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-5 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 shadow-lg shadow-black/[0.04] hover:shadow-xl hover:shadow-black/[0.06] transition-shadow cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6161ff]/10 to-[#00d2d2]/10 flex items-center justify-center mb-3 group-hover:from-[#6161ff]/20 group-hover:to-[#00d2d2]/20 transition-all">
                <feat.icon className="w-5 h-5 text-[#6161ff]" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{feat.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-gray-400 font-medium tracking-wide">Explore the platform</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 5 — Spotlight  (minimal typography, radial light)
   ───────────────────────────────────────────────────────────── */
function SpotlightHero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      {/* Radial spotlight behind title */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(97,97,255,0.08) 0%, rgba(0,210,210,0.04) 40%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle top-right accent */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(97,97,255,0.04) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 text-center max-w-5xl mx-auto"
      >
        {/* Sidekick logo - small, elegant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <img src={sidekickLogo} alt="Sidekick" className="w-12 h-12 object-contain opacity-80" />
        </motion.div>

        {/* Title — thin + bold weight contrast */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-2"
        >
          <span className="block text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-gray-400">
            AI Work
          </span>
          <span className="block text-6xl md:text-8xl lg:text-[8.5rem] font-black tracking-tighter bg-gradient-to-r from-[#6161ff] via-[#7c5cff] to-[#00d2d2] bg-clip-text text-transparent leading-[1.05]">
            Platform
          </span>
        </motion.h1>

        {/* Animated horizontal line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ready ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.0, ease: 'easeInOut' }}
          className="w-32 h-[1.5px] bg-gradient-to-r from-transparent via-[#6161ff]/60 to-transparent mx-auto my-8 origin-center"
        />

        {/* Single-line tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="text-lg md:text-xl text-gray-400 font-light tracking-wide"
        >
          Where teams and AI agents achieve any business result — together.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-gray-300 font-medium tracking-wide">Explore the platform</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 6 — Orbit  (concentric rings, orbiting icons)
   ───────────────────────────────────────────────────────────── */
function OrbitIcon({ icon: Icon, radius, duration, startAngle, color }: {
  icon: React.ComponentType<{ className?: string }>;
  radius: number;
  duration: number;
  startAngle: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
      }}
      animate={{
        rotate: [startAngle, startAngle + 360],
      }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <div
        className="absolute flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-md"
        style={{
          top: -radius,
          left: -20, // half of w-10 (40px/2)
        }}
      >
        {/* Counter-rotate to keep icon upright */}
        <motion.div
          animate={{ rotate: [-(startAngle), -(startAngle + 360)] }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function OrbitHero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  const orbitIcons = [
    { icon: Brain, radius: 100, duration: 20, startAngle: 0, color: '#6161ff' },
    { icon: Sparkles, radius: 100, duration: 20, startAngle: 120, color: '#00d2d2' },
    { icon: Zap, radius: 100, duration: 20, startAngle: 240, color: '#a855f7' },
    { icon: Database, radius: 155, duration: 28, startAngle: 60, color: '#6161ff' },
    { icon: Users, radius: 155, duration: 28, startAngle: 180, color: '#00d2d2' },
    { icon: Globe, radius: 155, duration: 28, startAngle: 300, color: '#10b981' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #6161ff 0.6px, transparent 0.6px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Orbit system — centered */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.8 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative w-80 h-80 md:w-[360px] md:h-[360px] mb-10"
      >
        {/* Ring 1 (inner) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-100"
          style={{ width: 200, height: 200 }}
        />
        {/* Ring 2 (outer) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gray-100"
          style={{ width: 310, height: 310 }}
        />
        {/* Ring 3 (faint) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6161ff]/5"
          style={{ width: 360, height: 360 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center"
          >
            <img src={sidekickLogo} alt="Sidekick" className="w-12 h-12 object-contain" />
          </motion.div>
        </div>

        {/* Orbiting icons */}
        <div className="absolute top-1/2 left-1/2" style={{ width: 0, height: 0 }}>
          {orbitIcons.map((item, i) => (
            <OrbitIcon key={i} {...item} />
          ))}
        </div>
      </motion.div>

      {/* Title + subtitle below orbit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-4">
          AI Work{' '}
          <span className="bg-gradient-to-r from-[#6161ff] to-[#00d2d2] bg-clip-text text-transparent">
            Platform
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-light">
          Everything your business needs, orbiting around one intelligent platform.
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-gray-300 font-medium tracking-wide">Explore the platform</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 7 — Split  (two-column, animated layer cards)
   ───────────────────────────────────────────────────────────── */
function SplitHero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  const layers = [
    { icon: Bot, label: 'AI Agents', desc: 'Autonomous agents for every workflow', color: '#6161ff', offset: 0 },
    { icon: Brain, label: 'Work Context', desc: 'Deep understanding of your business', color: '#a855f7', offset: 20 },
    { icon: Database, label: 'mondayDB', desc: 'Enterprise-grade data foundation', color: '#00d2d2', offset: 40 },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 bg-white overflow-hidden">
      {/* Subtle background accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(97,97,255,0.02) 100%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : -30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Logo badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2.5 mb-8"
          >
            <img src={sidekickLogo} alt="Sidekick" className="w-9 h-9 object-contain" />
            <div className="w-px h-5 bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">monday.com</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-5 leading-[1.1]">
            AI Work
            <br />
            <span className="bg-gradient-to-r from-[#6161ff] to-[#00d2d2] bg-clip-text text-transparent">
              Platform
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 font-light mb-8 max-w-md leading-relaxed">
            Where teams and AI agents work together to achieve any business result.
          </p>

          {/* CTA pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6161ff]/5 border border-[#6161ff]/15 text-[#6161ff]"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Explore the platform below</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Right — animated layer cards */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative flex flex-col items-center"
        >
          {/* Connecting lines between cards */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
            {[0, 1].map((i) => (
              <motion.line
                key={i}
                x1="50%"
                y1={`${28 + i * 35}%`}
                x2="50%"
                y2={`${38 + i * 35}%`}
                stroke="#6161ff"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 1.2 + i * 0.2 }}
              />
            ))}
          </svg>

          {layers.map((layer, i) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, y: 20, x: layer.offset }}
              animate={{
                opacity: 1,
                y: [0, -6, 0],
                x: layer.offset,
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.7 + i * 0.2 },
                y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 },
              }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="relative z-10 w-full max-w-xs p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg shadow-black/[0.04] mb-5 cursor-default"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${layer.color}10`, border: `1px solid ${layer.color}20` }}
                >
                  <layer.icon className="w-5.5 h-5.5" style={{ color: layer.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{layer.label}</p>
                  <p className="text-xs text-gray-400">{layer.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 8 — Reveal  (staggered letter reveal, animated counters)
   ───────────────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '', duration = 2, delay = 0 }: {
  target: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, (duration * 1000) / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function RevealHero() {
  const [ready, setReady] = useState(false);
  const [lineReady, setLineReady] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 200);
    const t2 = setTimeout(() => setLineReady(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const titleLine1 = 'AI Work';
  const titleLine2 = 'Platform';

  const stats = [
    { value: 225, suffix: 'K+', label: 'Teams worldwide', icon: Users },
    { value: 200, suffix: '+', label: 'Countries', icon: Globe },
    { value: 10, suffix: 'x', label: 'Faster with AI', icon: Zap },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      {/* Faint top gradient wash */}
      <div
        className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(97,97,255,0.02) 0%, transparent 100%)' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-5xl mx-auto"
      >
        {/* Sidekick logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <img src={sidekickLogo} alt="Sidekick" className="w-11 h-11 object-contain" />
        </motion.div>

        {/* Horizontal gradient line — draws outward from center */}
        <div className="flex justify-center mb-10">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: ready ? 1 : 0, opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="w-48 h-[1.5px] origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #6161ff, #00d2d2, transparent)' }}
          />
        </div>

        {/* Title — staggered letter reveal */}
        <h1 className="mb-2">
          {/* Line 1: AI Work */}
          <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 overflow-hidden">
            {titleLine1.split('').map((char, i) => (
              <motion.span
                key={`l1-${i}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: lineReady ? 1 : 0, y: lineReady ? 0 : 40 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.05, ease: 'easeOut' }}
                className="inline-block"
                style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
          {/* Line 2: Platform */}
          <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight overflow-hidden">
            {titleLine2.split('').map((char, i) => (
              <motion.span
                key={`l2-${i}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: lineReady ? 1 : 0, y: lineReady ? 0 : 40 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.05, ease: 'easeOut' }}
                className="inline-block bg-gradient-to-r from-[#6161ff] to-[#00d2d2] bg-clip-text text-transparent"
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: lineReady ? 1 : 0, y: lineReady ? 0 : 15 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-lg md:text-xl text-gray-400 font-light mt-6 mb-14"
        >
          Where human creativity meets AI capability.
        </motion.p>

        {/* Stats counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: lineReady ? 1 : 0, y: lineReady ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 1.8 }}
          className="flex justify-center gap-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.0 + i * 0.15 }}
              className="text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[#6161ff]/5 border border-[#6161ff]/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-[#6161ff]" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1.5} delay={2.0 + i * 0.15} />
              </p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: lineReady ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 2.8 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-gray-300 font-medium tracking-wide">Explore the platform</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 9 — Spotlight V2  (centered, breathing glow, stacked lines)
   ───────────────────────────────────────────────────────────── */
function SpotlightV2Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      {/* Large breathing glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(97,97,255,0.06) 0%, rgba(97,97,255,0.02) 40%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Small logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-14"
        >
          <img src={sidekickLogo} alt="Sidekick" className="w-10 h-10 object-contain opacity-70" />
        </motion.div>

        {/* Title — all centered, each word on its own line */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 25 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="leading-[1.05] mb-8"
        >
          <span className="block text-4xl md:text-6xl font-light tracking-tight text-gray-300">
            The
          </span>
          <span className="block text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-gray-900 mt-1">
            AI Work
          </span>
          <span className="block text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter bg-gradient-to-r from-[#6161ff] to-[#8b7bff] bg-clip-text text-transparent mt-1">
            Platform
          </span>
        </motion.h1>

        {/* Thin separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ready ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="w-16 h-px bg-gray-200 mx-auto mb-8 origin-center"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="text-base md:text-lg text-gray-400 font-light tracking-wide max-w-lg mx-auto"
        >
          Where teams and AI agents work side by side
          <br />
          <span className="text-gray-500 font-normal">to achieve any business result.</span>
        </motion.p>

        {/* Subtle floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 1.7 }}
          className="flex justify-center mt-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
            <Sparkles className="w-3.5 h-3.5 text-[#6161ff]/60" />
            <span className="text-xs text-gray-400 font-medium">Powered by monday.com</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 2.2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 10 — Spotlight V3  (horizontal rule reveal, monospaced accent)
   ───────────────────────────────────────────────────────────── */
function SpotlightV3Hero() {
  const [ready, setReady] = useState(false);
  const [linesDone, setLinesDone] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 200);
    const t2 = setTimeout(() => setLinesDone(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      {/* Two subtle gradient washes — left and right */}
      <div
        className="absolute top-0 left-0 w-1/3 h-full pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(97,97,255,0.03) 0%, transparent 60%)' }}
      />
      <div
        className="absolute top-0 right-0 w-1/3 h-full pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,210,210,0.02) 0%, transparent 50%)' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-5xl mx-auto w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <img src={sidekickLogo} alt="Sidekick" className="w-11 h-11 object-contain opacity-75" />
        </motion.div>

        {/* Top decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ready ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-auto mb-12 origin-center max-w-xl"
        />

        {/* Mono-spaced label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 8 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-[11px] md:text-xs font-mono uppercase tracking-[0.3em] text-gray-300 mb-6"
        >
          monday.com presents
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-6"
        >
          <span className="block text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-gray-800">
            AI Work
          </span>
          <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-br from-[#6161ff] via-[#7c6bff] to-[#00d2d2] bg-clip-text text-transparent leading-[1.1] mt-1">
            Platform
          </span>
        </motion.h1>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ready ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: 'easeOut' }}
          className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-auto mt-8 mb-8 origin-center max-w-xl"
        />

        {/* Tagline — appears after lines complete */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: linesDone ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg md:text-xl text-gray-400 font-light"
        >
          Achieve any business result with AI — built on the platform teams already love.
        </motion.p>

        {/* Three small stat indicators */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: linesDone ? 1 : 0, y: linesDone ? 0 : 15 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-8 mt-10"
        >
          {[
            { label: 'Agents', value: 'AI' },
            { label: 'Context', value: 'Work' },
            { label: 'Scale', value: 'Enterprise' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 + i * 0.15 }}
              className="text-center"
            >
              <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wider mt-0.5">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: linesDone ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-gray-300 font-medium tracking-wide">Explore the platform</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT 11 — Spotlight V4  (gradient underline, floating dots, refined)
   ───────────────────────────────────────────────────────────── */
function SpotlightV4Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 250); return () => clearTimeout(t); }, []);

  // Floating dots
  const dots = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: `${10 + Math.random() * 80}%`,
      y: `${10 + Math.random() * 80}%`,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
    })), []
  );

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      {/* Floating decorative dots */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: `rgba(97,97,255,${0.08 + Math.random() * 0.08})`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Very subtle radial glow */}
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(97,97,255,0.04) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Logo + brand name inline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-2.5 mb-14"
        >
          <img src={sidekickLogo} alt="Sidekick" className="w-8 h-8 object-contain" />
          <span className="text-sm font-medium text-gray-300 tracking-wide">monday.com</span>
        </motion.div>

        {/* Title with gradient underline on "Platform" */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-3"
        >
          <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900">
            AI Work
          </span>
          <span className="relative inline-block mt-2">
            <span className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-r from-[#6161ff] to-[#9b8bff] bg-clip-text text-transparent">
              Platform
            </span>
            {/* Animated gradient underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: ready ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
              className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full origin-left"
              style={{ background: 'linear-gradient(90deg, #6161ff, #00d2d2)' }}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-lg md:text-xl text-gray-400 font-light mt-8 max-w-md mx-auto leading-relaxed"
        >
          One intelligent platform where teams and AI agents deliver every business result.
        </motion.p>

        {/* Three small capability badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="flex justify-center gap-3 mt-10"
        >
          {[
            { icon: Bot, label: 'AI Agents' },
            { icon: Brain, label: 'Work Context' },
            { icon: Database, label: 'mondayDB' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7 + i * 0.1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100"
            >
              <item.icon className="w-3.5 h-3.5 text-[#6161ff]/50" />
              <span className="text-[11px] text-gray-400 font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 2.2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-gray-300 font-medium tracking-wide">Explore the platform</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
   ───────────────────────────────────────────────────────────── */
export function PlatformHero({ variant = 'typewriter' }: PlatformHeroProps) {
  switch (variant) {
    case 'gradient_wave':
      return <GradientWaveHero />;
    case 'bold_statement':
      return <BoldStatementHero />;
    case 'glassmorphism':
      return <GlassmorphismHero />;
    case 'spotlight':
      return <SpotlightHero />;
    case 'orbit':
      return <OrbitHero />;
    case 'split':
      return <SplitHero />;
    case 'reveal':
      return <RevealHero />;
    case 'spotlight_v2':
      return <SpotlightV2Hero />;
    case 'spotlight_v3':
      return <SpotlightV3Hero />;
    case 'spotlight_v4':
      return <SpotlightV4Hero />;
    case 'typewriter':
    default:
      return <TypewriterHero />;
  }
}
