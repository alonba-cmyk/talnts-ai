import { motion } from 'motion/react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { successMetrics } from './gtmData';

export default function MetricsSlide() {
  return (
    <SlideShell>
      <SlideTitle>How We'll Measure Success</SlideTitle>
      <SlideSubtitle>Five metrics to track progress toward the Agentic Work Platform vision.</SlideSubtitle>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
        {successMetrics.map((metric, i) => (
          <StaggerChild key={metric.title} index={i}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              className="p-5 rounded-2xl bg-white border border-[#e8e8e8] shadow-sm text-center flex flex-col h-full transition-all"
            >
              <div className="text-3xl mb-3">{metric.icon}</div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">{metric.title}</h3>
              <p className="text-xs text-[#6b6b6b] mb-3 flex-1">{metric.description}</p>
              <div className="text-[11px] font-semibold text-[#0073EA] bg-[#0073EA]/08 px-3 py-1.5 rounded-lg">
                {metric.target}
              </div>
            </motion.div>
          </StaggerChild>
        ))}
      </div>

      <StaggerChild index={5}>
        <div className="p-5 rounded-2xl bg-[#FDAB3D]/08 border border-[#FDAB3D]/20 text-center">
          <div className="text-sm font-semibold text-[#4a4a4a] mb-0.5">
            Targets are directional — to be refined with Product & Finance.
          </div>
          <div className="text-xs text-[#6b6b6b]">
            These metrics cascade into team-level OKRs once the GTM approach is approved.
          </div>
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
