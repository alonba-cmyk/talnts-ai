import { motion } from 'motion/react';
import { Store, LayoutGrid, Workflow, Check, AlertTriangle } from 'lucide-react';
import SlideShell, { SlideTitle, SlideBadge, StaggerChild } from './SlideShell';
import { bets } from './gtmData';

const PILLAR_ICONS = { Store, LayoutGrid, Workflow } as const;

export default function Bet3Slide() {
  const bet = bets[2];

  return (
    <SlideShell dark>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#6161FF] to-[#00D2D2] text-white px-4 py-1.5 rounded-full">
          Recommended
        </span>
        <SlideBadge dark>Bet 3 of 3</SlideBadge>
      </div>

      <SlideTitle dark>{bet.title}</SlideTitle>

      <StaggerChild index={0}>
        <div className="my-6 relative pl-6 border-l-4 border-[#6161FF]">
          <p className="text-base text-white/80 leading-relaxed italic">
            &ldquo;{bet.narrative}&rdquo;
          </p>
        </div>
      </StaggerChild>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        {bet.pillars?.map((pillar, i) => {
          const Icon = PILLAR_ICONS[pillar.lucideIcon as keyof typeof PILLAR_ICONS] ?? Store;
          return (
            <StaggerChild key={pillar.title} index={i + 1}>
              <motion.div
                whileHover={{ y: -4, borderColor: '#6161FF44' }}
                className="p-6 rounded-xl bg-white/[0.04] border border-white/[0.08] transition-all"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#6161FF]/15 text-[#6161FF]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{pillar.description}</p>
              </motion.div>
            </StaggerChild>
          );
        })}
      </div>

      <StaggerChild index={4}>
        <div className="p-6 rounded-xl bg-gradient-to-r from-[#6161FF]/10 to-[#00D2D2]/10 border border-[#6161FF]/20 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6161FF] mb-4">
            Why This Wins
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {bet.whyItWins?.map((reason, i) => (
              <motion.div key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#00D2D2] mt-0.5 shrink-0" />
                <span className="text-sm text-white/90">{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </StaggerChild>

      <StaggerChild index={5}>
        <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FFCB00] mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">Key risk</div>
              <div className="text-sm text-white/90">{bet.keyRisk}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#00D2D2] mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">Trade-off</div>
              <div className="text-sm text-white/90">{bet.tradeOff}</div>
            </div>
          </div>
          {bet.phase && (
            <div className="text-xs text-white/50 pt-2 border-t border-white/[0.06]">
              {bet.phase}
            </div>
          )}
        </div>
      </StaggerChild>
    </SlideShell>
  );
}
