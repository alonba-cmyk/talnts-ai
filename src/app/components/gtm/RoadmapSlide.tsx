import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { roadmap } from './gtmData';

export default function RoadmapSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <SlideShell>
      <SlideTitle>Roadmap</SlideTitle>
      <SlideSubtitle>A phased approach — start with what we have, build toward the full vision.</SlideSubtitle>

      <div ref={ref} className="relative">
        <div className="grid md:grid-cols-3 gap-8">
          {roadmap.map((phase, i) => (
            <StaggerChild key={phase.phase} index={i}>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.2 + i * 0.2, type: 'spring' }}
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ background: phase.color }}
                  />
                  <div>
                    <span className="text-sm font-bold text-[#1a1a1a]">{phase.phase}</span>
                    <span className="text-xs text-[#8a8a8a] ml-2">{phase.timeframe}</span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                  className="p-6 rounded-2xl bg-white border border-[#e8e8e8] shadow-sm transition-all"
                >
                  <ul className="space-y-3">
                    {phase.items.map((item, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + i * 0.2 + j * 0.06 }}
                        className="flex items-start gap-2.5 text-sm text-[#4a4a4a]"
                      >
                        <span
                          className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                          style={{ background: phase.color }}
                        />
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </StaggerChild>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
