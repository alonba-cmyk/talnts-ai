import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { heroStats, audienceSegments, PRODUCT_COLORS } from './gtmData';

const products = [
  { name: 'Work Management', color: PRODUCT_COLORS.workManagement },
  { name: 'CRM', color: PRODUCT_COLORS.crm },
  { name: 'Dev', color: PRODUCT_COLORS.dev },
  { name: 'Service', color: PRODUCT_COLORS.service },
];

export default function ContextSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Where monday.com Is Today</SlideTitle>
      <SlideSubtitle dark>
        The platform teams already rely on — spanning 4 products across every department.
      </SlideSubtitle>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {heroStats.map((stat, i) => (
          <StaggerChild key={stat.label} index={i}>
            <div className="text-center p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] relative">
              {stat.sourceUrl && (
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 p-1 rounded text-white/40 hover:text-[#00D2D2] transition-colors"
                  title="View source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.prefix}{stat.value}{stat.suffix}
              </div>
              <div className="text-xs text-white/60 font-medium">{stat.label}</div>
            </div>
          </StaggerChild>
        ))}
      </div>

      <StaggerChild index={4}>
        <div className="mb-3 text-xs font-semibold text-white/40 uppercase tracking-wider">4 Products</div>
      </StaggerChild>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {products.map((p, i) => (
          <StaggerChild key={p.name} index={5 + i}>
            <div
              className="p-4 rounded-xl border text-center transition-all bg-white/[0.03] border-white/[0.08] hover:border-white/[0.12]"
              style={{ borderColor: p.color + '44' }}
            >
              <div className="w-2.5 h-2.5 rounded-sm mx-auto mb-2" style={{ background: p.color }} />
              <div className="font-medium text-white/80 text-sm">monday</div>
              <div className="font-bold text-sm" style={{ color: p.color }}>
                {p.name}
              </div>
            </div>
          </StaggerChild>
        ))}
      </div>

      <StaggerChild index={9}>
        <div className="mb-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Who we serve</div>
        <div className="flex flex-wrap gap-4">
          {audienceSegments.map((s) => (
            <div
              key={s.name}
              className="px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm"
            >
              <span className="font-semibold text-white">{s.name}</span>
              <span className="text-white/60 ml-2">— {s.line}</span>
            </div>
          ))}
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
