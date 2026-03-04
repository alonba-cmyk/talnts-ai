import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SlideShell, { SlideTitle } from './SlideShell';

const today = [
  'Easy to use and adopt',
  'Product people love to use',
  'Flexible to extreme',
];

const future = [
  'Work Context',
  'Enterprise-grade secure',
  'Control & governance',
  'Agent hub',
];

export default function WhatSetsUsApartSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>What sets us apart</SlideTitle>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6 mt-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 w-full p-8 rounded-2xl border border-white/[0.1] bg-white/[0.03] flex flex-col"
        >
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-6">Today</div>
          <ul className="space-y-4">
            {today.map((item) => (
              <li key={item} className="text-lg text-white/90 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white/50" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="shrink-0 flex items-center justify-center text-[#00D2D2] self-center"
        >
          <ArrowRight className="w-10 h-10 md:w-12 md:h-12" strokeWidth={2.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex-1 w-full p-8 rounded-2xl border-2 border-[#00D2D2]/40 bg-[#00D2D2]/5 flex flex-col"
        >
          <div className="text-xs font-semibold text-[#00D2D2] uppercase tracking-wider mb-6">Future (possible direction)</div>
          <ul className="space-y-4">
            {future.map((item) => (
              <li key={item} className="text-lg text-white/90 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#00D2D2]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center text-base md:text-lg text-white/70 italic max-w-2xl mx-auto"
      >
        How do we emphasize both?
      </motion.p>
    </SlideShell>
  );
}
