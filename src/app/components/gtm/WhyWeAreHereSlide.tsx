import { motion } from 'motion/react';
import { Target, CheckSquare } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';

export default function WhyWeAreHereSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Why are we here?</SlideTitle>
      <SlideSubtitle dark>
        Every work platform is going agentic. We need to choose our path — and align as a team.
      </SlideSubtitle>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl"
      >
        <div className="text-lg text-white/70 leading-relaxed mb-8">
          By the end of this deck, we want:
        </div>
        <ul className="space-y-4">
          {[
            { icon: Target, text: 'Shared understanding — market, customers, competitors' },
            { icon: CheckSquare, text: 'Clear bets — which positioning we pursue and why' },
            { icon: CheckSquare, text: 'Next steps — what we do Monday morning' },
          ].map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]"
            >
              <item.icon className="w-6 h-6 text-[#00D2D2] shrink-0" />
              <span className="text-base font-medium text-white/90">{item.text}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </SlideShell>
  );
}
