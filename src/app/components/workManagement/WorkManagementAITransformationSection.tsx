import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Sparkles, ArrowDown, ChevronDown } from 'lucide-react';

export type AITransformationVariant = 'proof_cards' | 'hero_journey';

// ─── Animated counter ────────────────────────────────────────────────────────

interface CounterProps {
  from: number;
  to: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ from, to, suffix = '', duration = 1.6 }: CounterProps) {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const range = to - from;
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(Math.round(from + range * eased));
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, from, to, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

// ─── Proof Cards Data ─────────────────────────────────────────────────────────

const PROOF_CARDS = [
  {
    accent: '#00D2D2',
    before: '3+ tools',
    afterLabel: 'One platform',
    afterDisplay: { type: 'counter' as const, from: 3, to: 1, suffix: '' },
    caption: 'Consolidate your AI stack',
    quote: "We used to copy data into ChatGPT and paste answers back into monday. Now the AI just knows what we're working on. It's a completely different experience.",
    author: 'Sarah K.',
    role: 'Head of Operations · Fintech scale-up',
    initials: 'SK',
  },
  {
    accent: '#a78bfa',
    before: 'Weeks to first value',
    afterLabel: 'Time to first value',
    afterDisplay: { type: 'text' as const, label: 'Minutes' },
    caption: 'Zero onboarding. Instant context.',
    quote: "monday's AI gave me a full risk report on our product launch in under a minute — with context it pulled from our actual boards. No prompts, no setup.",
    author: 'Daniel R.',
    role: 'VP Product · SaaS company',
    initials: 'DR',
  },
  {
    accent: '#34d399',
    before: '15% AI adoption rate',
    afterLabel: 'Team AI adoption',
    afterDisplay: { type: 'counter' as const, from: 15, to: 85, suffix: '%' },
    caption: 'When AI fits the work, teams use it',
    quote: "It doesn't feel like AI — it feels like the smartest person on your team finally got access to all your data.",
    author: 'Michal T.',
    role: 'COO · Marketing agency',
    initials: 'MT',
  },
];

// ─── Hero Journey Data ────────────────────────────────────────────────────────

const PILLARS = [
  {
    accent: '#6161FF',
    title: 'Confidence',
    oneliner: 'Your team chose a defensible, future-proof platform.',
    questions: [
      'Does monday clearly solve the problem we are buying it for?',
      'Do I trust and am I genuinely excited to work with the people at monday?',
    ],
    answer: 'We build winning relationships, communications, and experiences that reduce decision risk and energize customers.',
  },
  {
    accent: '#00D2D2',
    title: 'Support',
    oneliner: 'Leadership and stakeholders back your decision.',
    questions: [
      'Will my management and stakeholders back this decision?',
      'Will I be able to justify the choice in a future review or post-mortem?',
    ],
    answer: 'We create tools, narratives, and assets that win over the "hidden buyers" (buying committee).',
  },
  {
    accent: '#FFCB00',
    title: 'Recognition',
    oneliner: 'Your results are visible, valued, and celebrated.',
    questions: [
      'Can I clearly point to monday as a driver of business outcomes?',
      'Are our results visible and valuable to leadership?',
    ],
    answer: 'We make our customers heroes through storytelling and tangible demonstrations of their successes.',
  },
];

const RULES = [
  {
    number: '1',
    title: 'Pain',
    oneliner: 'No pain, no gain.',
    bold: 'Find the blockers.',
    accent: '#00CA72',
  },
  {
    number: '2',
    title: 'Visibility',
    oneliner: 'Build your',
    bold: 'single source of truth.',
    accent: '#00D2D2',
  },
  {
    number: '3',
    title: 'Role',
    oneliner: 'Hire AI like a human.',
    bold: 'Give it a role.',
    accent: '#6161FF',
  },
  {
    number: '4',
    title: 'Celebrate',
    oneliner: 'Normalise AI. Celebrate it.',
    bold: 'Make it part of your culture.',
    accent: '#a3e635',
  },
];

const CUSTOMER_PROOF = [
  {
    name: 'Ravinia',
    result: 'Recognized over 90% of risks in their IT portfolio on time with AI',
    accent: '#6161FF',
  },
  {
    name: 'Five9',
    result: 'Built AI-powered intake flows to calculate ROI of new initiatives',
    accent: '#00D2D2',
  },
  {
    name: 'Dorman',
    result: 'Classified tasks with AI for better reporting across hundreds of projects',
    accent: '#00CA72',
  },
];

// ─── Proof Cards Variant ──────────────────────────────────────────────────────

function ProofCardsVariant() {
  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#00D2D2]" />
          <span className="text-[12px] font-semibold text-[#00D2D2] tracking-wide">AI Transformation</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4">
          The easiest way to unlock
          <br />
          the value of AI
        </h2>
        <p className="text-base text-white/50 max-w-[600px] mx-auto leading-relaxed">
          monday.com has always been the tool known for being easy to use.
          <br />
          Now, AI is built into every layer of your work — not bolted on.
        </p>
      </motion.div>

      {/* 3 proof cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PROOF_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% -10%, ${card.accent}22, transparent 65%)` }}
            />
            <div className="relative px-7 pt-7 pb-6">
              <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-1">Before</p>
              <p className="text-[15px] font-medium text-white/30 line-through decoration-white/20 mb-4">{card.before}</p>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${card.accent}14`, border: `1px solid ${card.accent}28` }}
              >
                <ArrowDown className="w-3.5 h-3.5" style={{ color: card.accent }} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: `${card.accent}99` }}>
                With monday.com
              </p>
              <p className="text-6xl font-black tracking-tight leading-none mb-2" style={{ color: card.accent }}>
                {card.afterDisplay.type === 'counter' ? (
                  <AnimatedCounter from={card.afterDisplay.from} to={card.afterDisplay.to} suffix={card.afterDisplay.suffix} />
                ) : (
                  <span>{card.afterDisplay.label}</span>
                )}
              </p>
              <p className="text-[13px] text-white/50 leading-snug">{card.caption}</p>
            </div>
            <div className="mx-7" style={{ height: 1, backgroundColor: `${card.accent}18` }} />
            <div className="relative px-7 py-6 flex flex-col flex-1">
              <span className="text-4xl leading-none font-serif mb-3 select-none block" style={{ color: `${card.accent}40` }}>"</span>
              <p className="text-[13px] italic text-white/55 leading-relaxed flex-1 mb-5">{card.quote}</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                  style={{ backgroundColor: `${card.accent}18`, color: card.accent, border: `1px solid ${card.accent}30` }}
                >
                  {card.initials}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white/80">{card.author}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">{card.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center text-[13px] text-white/25 mt-10 max-w-[480px] mx-auto leading-relaxed"
      >
        No extra tools. No complex prompts. AI that understands your work because it lives inside it.
      </motion.p>
    </>
  );
}

// ─── Hero Journey Variant ─────────────────────────────────────────────────────

function PillarCard({ pillar, index }: { pillar: typeof PILLARS[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col overflow-hidden cursor-pointer group"
      onClick={() => setExpanded(e => !e)}
    >
      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 50% -10%, ${pillar.accent}28, transparent 65%)`,
          opacity: expanded ? 1 : 0.6,
        }}
      />

      <div className="relative px-7 pt-7 pb-6">
        {/* Pillar name */}
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: `${pillar.accent}99` }}
        >
          {pillar.title}
        </p>

        {/* One-liner */}
        <p className="text-[17px] font-semibold text-white leading-snug mb-4">
          {pillar.oneliner}
        </p>

        {/* Expand toggle */}
        <button
          className="flex items-center gap-1.5 text-[11px] font-medium text-white/35 group-hover:text-white/55 transition-colors"
          style={{ color: expanded ? `${pillar.accent}99` : undefined }}
        >
          <span>{expanded ? 'Less' : 'How we do it'}</span>
          <ChevronDown
            className="w-3.5 h-3.5 transition-transform duration-300"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>

      {/* Expanded content */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-7 pb-7">
          <div className="h-px mb-5" style={{ backgroundColor: `${pillar.accent}18` }} />

          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: `${pillar.accent}80` }}>
            Questions we answer
          </p>
          <ul className="space-y-2 mb-5">
            {pillar.questions.map((q, qi) => (
              <li key={qi} className="flex gap-2 text-[13px] text-white/50 leading-relaxed">
                <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ backgroundColor: pillar.accent }} />
                {q}
              </li>
            ))}
          </ul>

          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: `${pillar.accent}80` }}>
            How we answer them
          </p>
          <p className="text-[13px] text-white/55 leading-relaxed">{pillar.answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroJourneyVariant() {
  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#00D2D2]" />
          <span className="text-[12px] font-semibold text-[#00D2D2] tracking-wide">AI Transformation</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4">
          You lead the transformation.
          <br />
          <span className="text-white/50">We make it possible.</span>
        </h2>
        <p className="text-base text-white/45 max-w-[560px] mx-auto leading-relaxed">
          AI amplifies what only humans bring — judgement, trust, and real connection.
          <br />
          monday puts you in the driver's seat.
        </p>
      </motion.div>

      {/* 3 Pillars */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-4"
      >
        <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest text-center mb-6">
          We make monday the safest and smartest decision
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-16">
        {PILLARS.map((pillar, i) => (
          <PillarCard key={pillar.title} pillar={pillar} index={i} />
        ))}
      </div>

      {/* 4 Fantastic Rules */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest text-center mb-2">
          Your playbook
        </p>
        <p className="text-xl sm:text-2xl font-semibold text-white text-center tracking-[-0.02em]">
          4 rules for leading AI change
        </p>
      </motion.div>

      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {/* Connecting line (desktop) */}
        <div className="absolute hidden lg:block top-8 left-[12.5%] right-[12.5%] h-px bg-white/[0.06] pointer-events-none" />

        {RULES.map((rule, i) => (
          <motion.div
            key={rule.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% -20%, ${rule.accent}18, transparent 60%)` }}
            />

            {/* Number bubble */}
            <div
              className="relative w-9 h-9 rounded-full flex items-center justify-center mb-5 text-sm font-black"
              style={{
                backgroundColor: `${rule.accent}15`,
                border: `1.5px solid ${rule.accent}40`,
                color: rule.accent,
              }}
            >
              {rule.number}
            </div>

            {/* Eyebrow */}
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: `${rule.accent}70` }}>
              Rule #{rule.number}
            </p>

            {/* Title */}
            <p className="text-[18px] font-bold italic text-white mb-2 leading-tight">{rule.title}</p>

            {/* One-liner */}
            <p className="text-[12px] text-white/40 leading-relaxed">
              {rule.oneliner} <span className="font-semibold text-white/70">{rule.bold}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Customer Proof Strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-[11px] font-semibold text-white/20 uppercase tracking-widest text-center mb-5">
          AI working inside real workflows
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CUSTOMER_PROOF.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative rounded-xl border border-white/[0.07] bg-white/[0.015] px-5 py-5 overflow-hidden"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${c.accent}12, transparent 55%)` }}
              />
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold mb-3"
                style={{ backgroundColor: `${c.accent}15`, color: c.accent, border: `1px solid ${c.accent}30` }}
              >
                {c.name}
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed">{c.result}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

interface WorkManagementAITransformationSectionProps {
  variant?: AITransformationVariant;
}

export function WorkManagementAITransformationSection({ variant = 'proof_cards' }: WorkManagementAITransformationSectionProps) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        {variant === 'hero_journey' ? <HeroJourneyVariant /> : <ProofCardsVariant />}
      </div>
    </section>
  );
}
