import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';
import { bets } from './gtmData';

export default function HowWeTellStorySlide() {
  const [openDept, setOpenDept] = useState<number | null>(null);
  const [openCap, setOpenCap] = useState<number | null>(null);

  const deptBet = bets[0]; // Agentic Departments
  const capBet = bets[1];  // Agentic Capabilities

  return (
    <SlideShell dark>
      <SlideTitle dark>How to tell our story</SlideTitle>
      <SlideSubtitle dark>
        Two approaches we can take to market — click to explore
      </SlideSubtitle>

      {/* Two columns: Departments | Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
        {/* Left: Lead with departments */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-lg font-semibold text-white">Lead with departments</h3>
            <p className="text-xs text-white/50 mt-0.5">{deptBet.subtitle}</p>
          </div>
          <div className="p-3 space-y-2">
            {deptBet.agents.map((agent, idx) => {
              const isOpen = openDept === idx;
              return (
                <div
                  key={agent.name}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenDept(isOpen ? null : idx)}
                    className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: agent.color + '22', color: agent.color }}
                      >
                        {agent.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white text-sm truncate">{agent.name}</span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/40 shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-0 text-xs text-white/70 border-t border-white/[0.04]">
                          {agent.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Lead with capabilities */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-lg font-semibold text-white">Lead with capabilities</h3>
            <p className="text-xs text-white/50 mt-0.5">{capBet.subtitle}</p>
          </div>
          <div className="p-3 space-y-2">
            {capBet.agents.map((agent, idx) => {
              const isOpen = openCap === idx;
              return (
                <div
                  key={agent.name}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenCap(isOpen ? null : idx)}
                    className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: agent.color + '22', color: agent.color }}
                      >
                        {agent.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white text-sm truncate">{agent.name}</span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/40 shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-0 text-xs text-white/70 border-t border-white/[0.04]">
                          {agent.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question below */}
      <div className="mt-8 max-w-2xl mx-auto text-center">
        <p className="text-lg md:text-xl font-medium text-white/90">
          Which direction should we take to market?
        </p>
        <p className="text-sm text-white/50 mt-1">
          Or do we need a hybrid approach that combines both?
        </p>
      </div>
    </SlideShell>
  );
}
