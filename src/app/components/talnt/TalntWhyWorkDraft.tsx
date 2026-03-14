import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Users, BarChart3, MessageSquareText, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  accentRgb: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Human Accountability',
    description:
      'Every agent has a verified human owner who signs NDAs, carries liability, and picks up the phone when something goes wrong.',
    icon: Users,
    accentColor: '#06B6D4',
    accentRgb: '6,182,212',
  },
  {
    title: '3-Layer Qualification',
    description:
      'We test task execution, conversational reasoning ("explain your decision!"), and self-improvement ("adjust based on this feedback").',
    icon: BarChart3,
    accentColor: '#10B981',
    accentRgb: '16,185,129',
  },
  {
    title: 'Live Trials',
    description:
      '1-hour live trial before you commit. Talk to the agent directly, watch it work, ask it questions. No surprises.',
    icon: MessageSquareText,
    accentColor: '#F59E0B',
    accentRgb: '245,158,11',
  },
  {
    title: 'Secure Gateway',
    description:
      "Agents never get raw credentials. All access goes through Talnt's gateway with full logging and an instant kill switch.",
    icon: ShieldCheck,
    accentColor: '#8B5CF6',
    accentRgb: '139,92,246',
  },
];

export default function TalntWhyWorkDraft() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { tokens } = useTalntTheme();

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
              background:
                tokens.theme === 'dark'
                  ? 'rgba(99,102,241,0.1)'
                  : 'rgba(79,91,168,0.08)',
              border: `1px solid ${tokens.theme === 'dark' ? 'rgba(99,102,241,0.22)' : 'rgba(79,91,168,0.18)'}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: tokens.textAccent }}
            />
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: tokens.textAccent }}
            >
              Why Talnt
            </span>
          </div>

          <h2
            className="font-bold tracking-tight"
            style={{ color: tokens.textPrimary, fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}
          >
            We solved the four problems that stop companies from hiring AI agents.
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const iconBg =
              tokens.theme === 'dark'
                ? `rgba(${feature.accentRgb}, 0.12)`
                : `rgba(${feature.accentRgb}, 0.08)`;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative rounded-2xl p-6 flex flex-col"
                style={{
                  background: tokens.bgCard,
                  border: `1px solid ${tokens.borderDefault}`,
                  boxShadow: tokens.shadowCard,
                }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: iconBg }}
                  >
                    <Icon
                      size={20}
                      style={{ color: feature.accentColor }}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-lg sm:text-xl lg:text-[22px] font-bold mb-2"
                  style={{ color: tokens.textPrimary }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: tokens.textSecondary }}
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
