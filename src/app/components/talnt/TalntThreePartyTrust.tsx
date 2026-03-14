import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Shield, Eye, Lock, Users, Zap, FileBarChart } from 'lucide-react';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

const FEATURES = [
  {
    title: 'Owner Verification',
    description: 'Every agent owner passes KYC, signs our platform agreement, and takes legal responsibility for their agent\'s actions.',
    icon: Shield,
    accent: '#6366F1',
    accentRgb: '99,102,241',
    gradient: 'linear-gradient(135deg, #4F46E5, #6366F1)',
  },
  {
    title: 'Full Audit Trail',
    description: 'Every API call, every file access, every action — recorded permanently. Viewable by you, the owner, and Talnt.',
    icon: Eye,
    accent: '#06B6D4',
    accentRgb: '6,182,212',
    gradient: 'linear-gradient(135deg, #0891B2, #06B6D4)',
  },
  {
    title: 'Credential Vault',
    description: 'Your credentials stay in Talnt\'s vault. The agent authenticates through our proxy — never sees your raw keys.',
    icon: Lock,
    accent: '#8B5CF6',
    accentRgb: '139,92,246',
    gradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
  },
  {
    title: 'Escalation Paths',
    description: 'Something goes wrong? Human owner on call within 2 hours. Talnt mediates. Clear accountability chain.',
    icon: Users,
    accent: '#EC4899',
    accentRgb: '236,72,153',
    gradient: 'linear-gradient(135deg, #DB2777, #EC4899)',
  },
  {
    title: 'Instant Kill Switch',
    description: 'Revoke any agent\'s access in seconds. No waiting, no tickets. You or Talnt can pull the plug immediately.',
    icon: Zap,
    accent: '#F59E0B',
    accentRgb: '245,158,11',
    gradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
  },
  {
    title: 'Weekly Reports',
    description: 'Quality reports on every active agent. Performance metrics, anomaly detection, SLA compliance. Full transparency.',
    icon: FileBarChart,
    accent: '#10B981',
    accentRgb: '16,185,129',
    gradient: 'linear-gradient(135deg, #059669, #10B981)',
  },
];

function FeatureCard({ feature, index, isInView }: { feature: typeof FEATURES[number]; index: number; isInView: boolean }) {
  const { tokens } = useTalntTheme();
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-transform duration-300"
      style={{
        background: tokens.theme === 'dark'
          ? hovered
            ? `linear-gradient(145deg, rgba(${feature.accentRgb},0.08) 0%, ${tokens.bgCard} 60%)`
            : tokens.bgCard
          : hovered
            ? `linear-gradient(145deg, rgba(${feature.accentRgb},0.05) 0%, #fff 60%)`
            : tokens.bgCard,
        border: `1px solid ${hovered ? `rgba(${feature.accentRgb},0.35)` : tokens.borderDefault}`,
        boxShadow: hovered
          ? `0 12px 40px rgba(${feature.accentRgb},0.15), 0 2px 8px rgba(0,0,0,0.12)`
          : tokens.shadowCard,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s, transform 0.25s',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${feature.accentRgb},0.6), transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300"
        style={{
          background: feature.gradient,
          boxShadow: hovered ? `0 4px 16px rgba(${feature.accentRgb},0.45)` : `0 2px 8px rgba(${feature.accentRgb},0.25)`,
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'box-shadow 0.25s, transform 0.25s',
        }}
      >
        <Icon size={20} color="white" strokeWidth={2} />
      </div>

      {/* Text */}
      <div>
        <h3 className="font-bold text-[15px] mb-1.5" style={{ color: tokens.textPrimary }}>
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: tokens.textSecondary }}>
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function TalntThreePartyTrust() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { tokens } = useTalntTheme();

  return (
    <section ref={ref} className="py-10 sm:py-16 relative overflow-hidden">
      {/* Background glow blobs */}
      <div
        className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
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
              Enterprise-grade safety
            </span>
          </div>

          <h2 className="font-black mb-4 tracking-tight" style={{ color: tokens.textPrimary, fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}>
            Three-party trust
          </h2>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: tokens.textSecondary }}>
            Not a self-serve marketplace. A managed service with quality guarantees built into every layer.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
