import { motion } from 'motion/react';
import { User, ArrowRight, Bot } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import workflowsLogo from '@/assets/workflows-logo.png';

export default function ProductEvolutionSlide4() {
  return (
    <SlideShell dark>
      <SlideTitle dark>monday.com: before → after</SlideTitle>
      <SlideSubtitle dark>
        From a work platform to an AI work platform — human in center, agents all around.
      </SlideSubtitle>

      <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        <StaggerChild index={0}>
          <div className="p-8 rounded-2xl border border-white/[0.1] bg-white/[0.02] h-full flex flex-col">
            <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Before</div>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <User className="w-16 h-16 text-white/60" />
              <span className="text-white/70 text-sm text-center">
                You + 4 products
                <br />
                <span className="text-white/50">(Work Management, CRM, Dev, Service)</span>
              </span>
            </div>
          </div>
        </StaggerChild>

        <StaggerChild index={1}>
          <div className="flex items-center justify-center text-white/20 md:order-first md:row-span-1">
            <ArrowRight className="w-12 h-12" />
          </div>
        </StaggerChild>

        <StaggerChild index={2} className="md:col-span-2 md:col-start-1">
          <div className="p-8 rounded-2xl border-2 border-[#00D2D2]/30 bg-[#00D2D2]/5 h-full flex flex-col">
            <div className="text-xs font-bold text-[#00D2D2] uppercase tracking-wider mb-4">After</div>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <User className="w-14 h-14 text-[#00D2D2]" />
                <span className="text-sm font-bold text-white">You in the center</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { logo: sidekickLogo, label: 'Sidekick' },
                  { logo: vibeLogo, label: 'Vibe' },
                  { logo: agentsLogo, label: 'Agents' },
                  { logo: workflowsLogo, label: 'Workflows' },
                ].map(({ logo, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/[0.08] bg-white/[0.03]"
                  >
                    <img src={logo} alt={label} className="w-8 h-8 object-contain" />
                    <span className="text-[10px] text-white/60">{label}</span>
                  </div>
                ))}
              </div>
              <span className="text-white/60 text-xs text-center">
                AI agents working with you — orchestrated on one surface
              </span>
            </div>
          </div>
        </StaggerChild>
      </div>
    </SlideShell>
  );
}
