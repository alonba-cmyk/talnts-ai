import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { heroStats, PRODUCT_COLORS } from './gtmData';

function AnimatedCounter({ value, suffix, prefix = '', duration = 1.6 }: { value: number; suffix: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const end = value;
    const startTime = performance.now();
    function update(now: number) {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;
      setDisplay(Number.isInteger(end) ? Math.round(current).toString() : current.toFixed(2));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [inView, value, duration]);

  return <span ref={ref} className="tabular-nums">{prefix}{display}{suffix}</span>;
}

const products = [
  { name: 'Work Management', color: PRODUCT_COLORS.workManagement },
  { name: 'CRM', color: PRODUCT_COLORS.crm },
  { name: 'Dev', color: PRODUCT_COLORS.dev },
  { name: 'Service', color: PRODUCT_COLORS.service },
];

export default function WhereWeAreSlide() {
  return (
    <SlideShell>
      <SlideTitle>Where monday.com Is Today</SlideTitle>
      <SlideSubtitle>
        The platform teams already rely on — spanning 4 products across every department.
      </SlideSubtitle>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {heroStats.map((stat, i) => (
          <StaggerChild key={stat.label} index={i}>
            <div className="text-center p-6 rounded-2xl bg-white border border-[#e8e8e8] shadow-sm hover:shadow-md transition-shadow relative">
              {stat.sourceUrl && (
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 p-1 rounded text-[#8a8a8a] hover:text-[#00D2D2] transition-colors"
                  title="View source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <div className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2">
                <AnimatedCounter value={stat.numericValue} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-sm text-[#6b6b6b] font-medium">{stat.label}</div>
            </div>
          </StaggerChild>
        ))}
      </div>

      <StaggerChild index={4}>
        <div className="mb-3 text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider">4 Products</div>
      </StaggerChild>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {products.map((p, i) => (
          <StaggerChild key={p.name} index={5 + i}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              className="p-5 rounded-2xl border-2 text-center transition-all bg-white"
              style={{ borderColor: p.color + '33', background: p.color + '06' }}
            >
              <div className="w-3 h-3 rounded-sm mx-auto mb-2" style={{ background: p.color }} />
              <div className="font-semibold text-[#1a1a1a] text-sm">monday</div>
              <div className="font-bold text-base" style={{ color: p.color }}>
                {p.name}
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </div>

      <StaggerChild index={9}>
        <div className="flex flex-wrap items-center justify-center gap-8 p-6 rounded-2xl bg-white border border-[#e8e8e8] shadow-sm">
          <div>
            <span className="text-2xl font-bold text-[#6161FF]">+34%</span>
            <div className="text-xs text-[#6b6b6b]">Enterprise $50K+ growth</div>
          </div>
          <div className="w-px h-10 bg-[#e8e8e8]" />
          <div>
            <span className="text-2xl font-bold text-[#00D2D2]">+74%</span>
            <div className="text-xs text-[#6b6b6b]">Enterprise $500K+ growth</div>
          </div>
          <div className="w-px h-10 bg-[#e8e8e8]" />
          <div>
            <span className="text-2xl font-bold text-[#FB275D]">225K+</span>
            <div className="text-xs text-[#6b6b6b]">Customers worldwide</div>
          </div>
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
