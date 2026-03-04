import { motion } from 'motion/react';
import { Bot, User, Zap } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import agentsLogo from '@/assets/99be461a455ae49743d963276e2023ed6cd1445d.png';
import vibeLogo from '@/assets/069a22575b2de9057cfc00d9b4538d072f7fe115.png';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';

const points = [
  'AI Work Platform — full suite, not point solutions',
  'Shift to agents — humans orchestrate, agents execute',
  'Human in the center — you direct; Vibe, Sidekick, Agents around you',
];

export default function ProductEvolutionSlide3() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Why we&apos;re ahead</SlideTitle>
      <SlideSubtitle dark>
        An AI work platform with the human at the center — agents around, not instead of you.
      </SlideSubtitle>

      <div className="space-y-6 max-w-2xl">
        {points.map((p, i) => (
          <StaggerChild key={p} index={i}>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03]">
              <div className="w-10 h-10 rounded-lg bg-[#6161FF]/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#00D2D2]" />
              </div>
              <span className="text-white/90 text-sm md:text-base">{p}</span>
            </div>
          </StaggerChild>
        ))}
      </div>

      <StaggerChild index={3}>
        <div className="mt-10 flex flex-col items-center">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
            Human in center, agents around
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-[#00D2D2]/40 bg-[#00D2D2]/5">
              <User className="w-12 h-12 text-[#00D2D2]" />
              <span className="text-sm font-bold text-white">You</span>
            </div>
            <Bot className="w-6 h-6 text-white/30" />
            <div className="flex flex-wrap justify-center gap-3 max-w-md">
              {[
                { logo: sidekickLogo, label: 'Sidekick', alt: 'Sidekick' },
                { logo: vibeLogo, label: 'Vibe', alt: 'Vibe' },
                { logo: agentsLogo, label: 'Agents', alt: 'Agents' },
              ].map(({ logo, label, alt }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03]"
                >
                  <img src={logo} alt={alt} className="w-10 h-10 object-contain" />
                  <span className="text-xs text-white/70">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
