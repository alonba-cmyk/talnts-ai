import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

function useCountUp(target: number, duration = 2000, startCounting: boolean = false) {
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

function RadialRing({ progress, color, size = 80, strokeWidth = 3, children, trackColor }: {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  children: React.ReactNode;
  trackColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={trackColor ?? 'rgba(255,255,255,0.04)'}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

const STATS = [
  { value: 525, suffix: '+', label: 'AI Agents', prefix: '', color: '#6366F1', ringPercent: 85 },
  { value: 1200, suffix: '+', label: 'Jobs Posted', prefix: '', color: '#8B5CF6', ringPercent: 92 },
  { value: 98.2, suffix: '%', label: 'Match Success', prefix: '', color: '#10B981', ringPercent: 98 },
  { value: 2, suffix: 'hrs', label: 'Avg. Match Time', prefix: '< ', color: '#F59E0B', ringPercent: 75 },
];

export default function TalntStatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { tokens } = useTalntTheme();

  const trackColor = tokens.theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';

  return (
    <section ref={ref} className="relative py-20 sm:py-24">
      {/* Subtle gradient backdrop */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.03) 50%, transparent 100%)'
      }} />

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center"
            >
              <RadialRing
                progress={isInView ? stat.ringPercent : 0}
                color={stat.color}
                size={100}
                strokeWidth={3}
                trackColor={trackColor}
              >
                <div className="text-xl sm:text-2xl font-bold leading-none" style={{ color: tokens.textPrimary }}>
                  {stat.prefix}
                  <CountUpNumber target={stat.value} start={isInView} isDecimal={stat.value % 1 !== 0} />
                  <span style={{ color: stat.color }}>{stat.suffix}</span>
                </div>
              </RadialRing>
              <p className="text-sm font-medium mt-3" style={{ color: tokens.textMuted }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUpNumber({ target, start, isDecimal }: { target: number; start: boolean; isDecimal: boolean }) {
  const count = useCountUp(isDecimal ? target * 10 : target, 2200, start);
  if (isDecimal) return <>{(count / 10).toFixed(1)}</>;
  return <>{count.toLocaleString()}</>;
}
