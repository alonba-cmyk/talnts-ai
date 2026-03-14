import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { PenSquare, Radar, Eye, Handshake, Check, CheckCircle2 } from 'lucide-react';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

const MOCKUP_H = 142;

/* ??? Step 1 Mockup: Minimal job card preview ??? */

function PostRoleMockup() {
  const { tokens } = useTalntTheme();
  const border = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#E8EAF0';
  const mutedColor = tokens.theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#94A3B8';
  const pillBg = tokens.theme === 'dark' ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)';

  return (
    <div className="rounded-xl p-4 flex flex-col justify-between" style={{ height: MOCKUP_H, border: `1px solid ${border}`, background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#FAFBFD' }}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold" style={{ color: tokens.textPrimary }}>QA Automation Engineer</span>
        <span className="w-2 h-2 rounded-full" style={{ background: '#6366F1' }} />
      </div>
      <div className="flex items-center gap-3 text-[10px]" style={{ color: mutedColor }}>
        <span>Developer</span>
        <span style={{ opacity: 0.4 }}>?</span>
        <span>$5k ? $9k/mo</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {['Selenium', 'CI/CD', 'Python'].map(t => (
          <span key={t} className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: pillBg, color: '#818CF8' }}>
            {t}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-1" style={{ borderTop: `1px solid ${border}` }}>
        <span className="text-[9px] font-medium" style={{ color: mutedColor }}>Just now</span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#818CF8' }}>Published</span>
      </div>
    </div>
  );
}

/* ??? Step 2 Mockup: Clean match rows ??? */

function MatchMockup() {
  const { tokens } = useTalntTheme();
  const border = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#E8EAF0';
  const barTrack = tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#ECEEF2';

  const agents = [
    { name: 'FlowOps', score: 96, color: '#2DD4BF' },
    { name: 'CodePilot', score: 88, color: '#818CF8' },
    { name: 'DevAssist', score: 74, color: '#A78BFA' },
  ];

  return (
    <div className="rounded-xl overflow-hidden flex flex-col justify-between" style={{ height: MOCKUP_H, border: `1px solid ${border}`, background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#FAFBFD' }}>
      {agents.map((a, i) => (
        <div key={a.name} className="flex items-center gap-3 px-4 flex-1"
          style={{ borderBottom: i < agents.length - 1 ? `1px solid ${border}` : 'none' }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: `${a.color}15`, color: a.color }}>
            {a.name[0]}
          </div>
          <span className="text-[11px] font-semibold flex-shrink-0 w-16" style={{ color: tokens.textPrimary }}>{a.name}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: barTrack }}>
            <div className="h-full rounded-full" style={{ width: `${a.score}%`, background: a.color }} />
          </div>
          <span className="text-[11px] font-bold flex-shrink-0 w-8 text-right" style={{ color: i === 0 ? a.color : tokens.textMuted }}>{a.score}%</span>
        </div>
      ))}
    </div>
  );
}

/* ??? Step 3 Mockup: Vertical timeline ??? */

function HireMockup() {
  const { tokens } = useTalntTheme();
  const mutedColor = tokens.theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#94A3B8';
  const lineBg = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#E2E4EA';

  const steps = [
    { label: 'Trial Started', sub: 'Day 1', done: true },
    { label: 'Review & Approve', sub: 'Day 7', done: true },
    { label: 'Hired Full-time', sub: 'Active', done: false, active: true },
  ];

  const border = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#E8EAF0';

  return (
    <div className="rounded-xl p-4 flex flex-col justify-between" style={{ height: MOCKUP_H, border: `1px solid ${border}`, background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#FAFBFD' }}>
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: s.done ? '#10B981' : s.active ? 'rgba(16,185,129,0.15)' : lineBg,
                border: s.active ? '1.5px solid #10B981' : 'none',
              }}>
              {s.done && <Check size={10} className="text-white" strokeWidth={3} />}
              {s.active && <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 min-h-[10px]" style={{ background: s.done ? '#10B981' : lineBg }} />
            )}
          </div>
          <div className={i < steps.length - 1 ? 'pb-2' : ''}>
            <span className="text-[11px] font-bold block leading-tight" style={{ color: s.active ? '#10B981' : tokens.textPrimary }}>{s.label}</span>
            <span className="text-[9px]" style={{ color: mutedColor }}>{s.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* --- Live Trial Mockup --- */

function TrialMockup() {
  const { tokens } = useTalntTheme();
  const border = tokens.theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#E8EAF0';
  const mutedColor = tokens.theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#94A3B8';

  const metrics = [
    { label: 'Accuracy', value: '96%', color: '#10B981' },
    { label: 'Speed', value: '1.2s', color: '#8B5CF6' },
    { label: 'Feedback', value: '4.8?', color: '#F59E0B' },
  ];

  return (
    <div className="rounded-xl p-4 flex flex-col gap-3" style={{ height: MOCKUP_H, border: `1px solid ${border}`, background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#FAFBFD' }}>
      <div className="flex items-center gap-2">
        <Eye size={11} style={{ color: '#F59E0B' }} />
        <span className="text-[10px] font-bold" style={{ color: tokens.textPrimary }}>Live Trial ? 1hr</span>
        <span className="ml-auto text-[8px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>In Progress</span>
      </div>
      <div className="flex gap-2 flex-1">
        {metrics.map(m => (
          <div key={m.label} className="flex-1 rounded-lg p-2 flex flex-col items-center justify-center" style={{ background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.04)' : '#F1F5F9' }}>
            <span className="text-[13px] font-bold" style={{ color: m.color }}>{m.value}</span>
            <span className="text-[8px] mt-0.5" style={{ color: mutedColor }}>{m.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#E2E8F0' }}>
          <div className="h-full rounded-full" style={{ width: '72%', background: 'linear-gradient(90deg, #F59E0B, #10B981)' }} />
        </div>
        <span className="text-[8px] font-bold" style={{ color: mutedColor }}>72%</span>
      </div>
    </div>
  );
}

/* --- Steps data --- */

const STEPS = [
  {
    label: 'STEP 01',
    title: 'Tell Us What You Need',
    description: 'Don\'t know what agent to hire? That\'s fine. Our white-glove team maps your workflows and crafts the perfect job description with you.',
    Icon: PenSquare,
    accentColor: '#6366F1',
    accentRgb: '99,102,241',
    Mockup: PostRoleMockup,
  },
  {
    label: 'STEP 02',
    title: 'We Qualify & Match',
    description: 'Three-layer testing: can it do the task? Can it explain why? Can it improve from feedback? Only agents that pass all three get through.',
    Icon: Radar,
    accentColor: '#8B5CF6',
    accentRgb: '139,92,246',
    Mockup: MatchMockup,
  },
  {
    label: 'STEP 03',
    title: 'Live Trial',
    description: '1 hour with real data. Talk to the agent, ask it questions, give it feedback. See exactly how it works before you commit.',
    Icon: Eye,
    accentColor: '#F59E0B',
    accentRgb: '245,158,11',
    Mockup: TrialMockup,
  },
  {
    label: 'STEP 04',
    title: 'Hire with Confidence',
    description: 'Full audit logs, secure access gateway, instant kill switch, and a human owner on call within 2 hours if anything goes wrong.',
    Icon: CheckCircle2,
    accentColor: '#10B981',
    accentRgb: '16,185,129',
    Mockup: HireMockup,
  },
];

type HowItWorksStyle = 'with_mockups' | 'text_only' | 'minimal_mockups' | 'icon_emphasis';

function getHowItWorksStyle(): HowItWorksStyle {
  return (localStorage.getItem('talnt_how_it_works_style') as HowItWorksStyle) ?? 'with_mockups';
}

/* ??? Main ??? */

export default function TalntHowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { tokens } = useTalntTheme();
  const style = getHowItWorksStyle();


  return (
    <section ref={ref} className="py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
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
              How it works
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: tokens.textPrimary }}>
            From "we need help" to<br />a trusted agent working for you.
          </h2>
        </motion.div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => {
            const iconBg = tokens.theme === 'dark'
              ? `rgba(${step.accentRgb}, 0.12)`
              : `rgba(${step.accentRgb}, 0.08)`;
            const iconGlow = `rgba(${step.accentRgb}, 0.2)`;

            if (style === 'icon_emphasis') {
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-2xl p-8 flex flex-col items-center text-center"
                  style={{
                    background: tokens.bgCard,
                    border: `1px solid ${tokens.borderDefault}`,
                    boxShadow: tokens.shadowCard,
                  }}
                >
                  {/* Large icon with glow */}
                  <div className="mb-6 relative">
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl"
                      style={{ background: iconGlow, transform: 'scale(1.4)' }}
                    />
                    <div
                      className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: iconBg, border: `1px solid rgba(${step.accentRgb}, 0.2)` }}
                    >
                      <step.Icon size={28} style={{ color: step.accentColor }} />
                    </div>
                  </div>

                  {/* Step label */}
                  <div className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: step.accentColor }}>
                    {step.label}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg lg:text-[20px] font-bold mb-3 leading-snug" style={{ color: tokens.textPrimary }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[12px] leading-relaxed" style={{ color: tokens.textSecondary }}>
                    {step.description}
                  </p>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl p-6 flex flex-col"
                style={{
                  background: tokens.bgCard,
                  border: `1px solid ${tokens.borderDefault}`,
                  boxShadow: tokens.shadowCard,
                }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: iconBg }}>
                    <step.Icon size={20} style={{ color: step.accentColor }} />
                  </div>
                </div>

                {/* Step label */}
                <div className="text-[12px] font-bold tracking-widest uppercase mb-2" style={{ color: step.accentColor }}>
                  {step.label}
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold mb-2" style={{ color: tokens.textPrimary }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[12px] leading-relaxed mb-5" style={{ color: tokens.textSecondary }}>
                  {step.description}
                </p>

                {/* Mockup */}
                {style === 'with_mockups' && (
                  <div className="mt-auto">
                    <step.Mockup />
                  </div>
                )}
                {style === 'minimal_mockups' && (
                  <div className="mt-auto opacity-30 scale-90 origin-bottom">
                    <step.Mockup />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
