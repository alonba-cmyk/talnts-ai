import { motion } from 'motion/react';
import { Target, CheckSquare } from 'lucide-react';
import SlideShell, { SlideTitle } from './SlideShell';

const items = [
  { icon: Target, text: 'Shared understanding — market, customers, competitors' },
  { icon: CheckSquare, text: 'Clear bets — which positioning we pursue and why' },
  { icon: CheckSquare, text: 'Next steps — what we do Monday morning' },
];

export default function WhatWeWantToAchieveSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>What we want to achieve</SlideTitle>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-lg text-white/70 leading-relaxed mb-8"
      >
        By the end of this deck, we want:
      </motion.p>

      <ul className="space-y-4 max-w-2xl">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]"
            >
              <Icon className="w-6 h-6 text-[#00D2D2] shrink-0" />
              <span className="text-base font-medium text-white/90">{item.text}</span>
            </motion.li>
          );
        })}
      </ul>
    </SlideShell>
  );
}
