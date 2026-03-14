import { motion } from 'motion/react';
import type { ThemeTokens } from '../../talnt/TalntThemeContext';
import { useSiteSettings } from '@/hooks/useSupabase';

type SocialProofVariant = 'stats' | 'logos';

const STATS = [
  { value: '500+',   label: 'AI Agents' },
  { value: '1,200+', label: 'Jobs Posted' },
  { value: '98.2%',  label: 'Match Success' },
  { value: '<2hrs',  label: 'Avg. Match Time' },
];

const LOGOS = [
  { name: 'Google',     logo: '/logos/google.svg' },
  { name: 'Microsoft',  logo: '/logos/microsoft.svg' },
  { name: 'Salesforce', logo: '/logos/salesforce.svg' },
  { name: 'NVIDIA',     logo: '/logos/nvidia.svg' },
  { name: 'Oracle',     logo: '/logos/oracle.svg' },
  { name: 'Databricks', logo: '/logos/databricks.svg' },
  { name: 'Anthropic',  logo: '/logos/anthropic.svg' },
  { name: 'OpenAI',     logo: '/logos/openai.svg' },
];

interface Props {
  tokens: ThemeTokens;
  delay?: number;
  useInView?: boolean;
  isInView?: boolean;
}

export default function HeroSocialProof({ tokens, delay = 0.7, useInView: _useInView, isInView = true }: Props) {
  const { settings } = useSiteSettings();
  const variant: SocialProofVariant = settings.talnt_social_proof;
  const animateProps = isInView ? { opacity: 1 } : {};

  if (variant === 'logos') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={animateProps}
        transition={{ duration: 0.6, delay }}
        className="mt-6 flex flex-col items-center"
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-7" style={{ color: tokens.textMuted }}>
          Companies already hiring AI agents
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {LOGOS.map((company, i) => (
            <motion.img
              key={company.name}
              src={company.logo}
              alt={company.name}
              initial={{ opacity: 0 }}
              animate={animateProps}
              transition={{ duration: 0.4, delay: delay + 0.05 + 0.05 * i }}
              className="h-6 sm:h-7 w-auto object-contain transition-all duration-300 cursor-default"
              style={{ filter: tokens.logoFilter }}
              onMouseEnter={e => { e.currentTarget.style.filter = tokens.logoFilterHover; }}
              onMouseLeave={e => { e.currentTarget.style.filter = tokens.logoFilter; }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="mt-16 w-full mx-auto grid grid-cols-4"
    >
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: delay + 0.08 * i }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-lg sm:text-xl font-semibold tracking-tight" style={{ color: tokens.textSecondary }}>
            {stat.value}
          </span>
          <span className="text-[11px] font-medium mt-0.5" style={{ color: tokens.textMuted }}>
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
