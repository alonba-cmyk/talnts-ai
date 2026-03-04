import { motion } from 'motion/react';
import SlideShell, { StaggerChild } from './SlideShell';

const betsOverview = [
  { num: 1, title: 'Agentic Departments', desc: 'Vertical agents per product line', recommended: false },
  { num: 2, title: 'Agentic Capabilities', desc: 'Horizontal agents across all teams', recommended: false },
  {
    num: 3,
    title: 'Work OS for Humans + Agents',
    desc: 'Orchestration platform combining both',
    recommended: true,
  },
];

const asks = [
  { icon: '💰', text: 'Budget allocation for AI/agent GTM campaigns' },
  { icon: '👥', text: 'Headcount for agent marketing & enablement' },
  { icon: '🔗', text: 'Product alignment on agent roadmap' },
  { icon: '🎯', text: 'Brand narrative: "The Agentic Work Platform"' },
];

export default function SummarySlide() {
  return (
    <SlideShell className="flex flex-col items-center justify-center text-center min-h-[540px] relative">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #6161FF, transparent)' }}
        />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-[#1a1a1a] mb-2 tracking-tight relative z-10"
      >
        Summary & Next Steps
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.1 }}
        className="text-base text-[#6b6b6b] mb-10 relative z-10"
      >
        Three bets. One recommendation. A clear path forward.
      </motion.p>

      <div className="grid grid-cols-3 gap-5 mb-10 w-full max-w-3xl relative z-10">
        {betsOverview.map((bet, i) => (
          <StaggerChild key={bet.num} index={i}>
            <motion.div
              whileHover={{ y: -4 }}
              className={`p-5 rounded-2xl border-2 text-center transition-all ${
                bet.recommended
                  ? 'bg-gradient-to-b from-[#6161FF]/08 to-[#00D2D2]/08 border-[#6161FF]/30'
                  : 'bg-white border-[#e8e8e8]'
              }`}
            >
              {bet.recommended && (
                <div className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#6161FF] to-[#00D2D2] text-white px-3 py-0.5 rounded-full inline-block mb-3">
                  Recommended
                </div>
              )}
              <div className="text-xs text-[#8a8a8a] font-semibold uppercase tracking-wider mb-1">
                Bet {bet.num}
              </div>
              <h3 className={`text-base font-bold mb-1 ${bet.recommended ? 'text-[#1a1a1a]' : 'text-[#4a4a4a]'}`}>
                {bet.title}
              </h3>
              <p className="text-xs text-[#6b6b6b]">{bet.desc}</p>
            </motion.div>
          </StaggerChild>
        ))}
      </div>

      <StaggerChild index={3} className="w-full max-w-2xl relative z-10 mb-10">
        <div className="p-6 rounded-2xl bg-white border border-[#e8e8e8] shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FDAB3D] mb-4">
            What We Need From Leadership
          </div>
          <div className="grid grid-cols-2 gap-3">
            {asks.map((ask, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#fafafa] text-left">
                <span className="text-xl">{ask.icon}</span>
                <span className="text-sm text-[#4a4a4a]">{ask.text}</span>
              </div>
            ))}
          </div>
        </div>
      </StaggerChild>

      <StaggerChild index={4} className="relative z-10">
        <h3 className="text-2xl font-bold text-[#1a1a1a] mb-3">
          Let's build the{' '}
          <span className="bg-gradient-to-r from-[#00D2D2] via-[#6161FF] to-[#FB275D] bg-clip-text text-transparent">
            Work OS for the Agent Age
          </span>
        </h3>
        <img src="/monday-mark.png" alt="monday.com" className="w-10 h-10 mx-auto mt-4 opacity-50" />
      </StaggerChild>
    </SlideShell>
  );
}
