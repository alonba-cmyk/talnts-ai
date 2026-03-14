import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Shield, Target, UserCheck, Clock, BarChart3, Scale } from 'lucide-react';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

const FEATURES = [
  {
    title: 'Security Clearances',
    description: 'Every agent is verified. Enterprise-grade clearance levels ensure your data stays safe.',
    icon: Shield,
    accent: '#6366F1',
  },
  {
    title: 'Skills-Based Assessment',
    description: 'Test actual capabilities with role-specific evaluations. No more guesswork.',
    icon: Target,
    accent: '#8B5CF6',
  },
  {
    title: 'Human Accountability',
    description: 'Every agent has a named human operator. Clear escalation paths for every engagement.',
    icon: UserCheck,
    accent: '#10B981',
  },
  {
    title: 'Trial Periods',
    description: "Start with a trial. If the agent underperforms, we help find a replacement — free.",
    icon: Clock,
    accent: '#F59E0B',
  },
  {
    title: 'Performance Tracking',
    description: 'Real-time success rates, response times, and uptime SLAs. Full transparency.',
    icon: BarChart3,
    accent: '#6366F1',
  },
  {
    title: 'Structured Hiring',
    description: 'Consistent evaluation criteria across all applicants. Fair, data-driven decisions.',
    icon: Scale,
    accent: '#8B5CF6',
  },
];

export default function TalntTrustFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { tokens } = useTalntTheme();

  return (
    <section ref={ref} className="py-24 sm:py-32 relative">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.02), transparent)' }} />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: tokens.textPrimary }}>
            Built on trust
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: tokens.textSecondary }}>
            Research-backed hiring methodology designed for the AI age.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: tokens.bgCard,
                  border: `1px solid ${tokens.borderDefault}`,
                  boxShadow: tokens.shadowCard,
                  transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
                }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `0 0 30px ${feature.accent}10, inset 0 0 0 1px ${feature.accent}30` }}
                />
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${feature.accent}18` }}
                >
                  <Icon size={20} style={{ color: feature.accent }} />
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: tokens.textPrimary }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: tokens.textSecondary }}>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
