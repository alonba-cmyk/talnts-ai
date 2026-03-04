import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SlideShell, { SlideTitle } from './SlideShell';

const messageToday = 'Outpace everyone with the best AI work platform';

const messageFuture = 'An AI work platform, where people and agents work together, to achieve business outcomes';

export default function LeadingValuePropositionSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Our leading value proposition</SlideTitle>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6 mt-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 w-full p-8 rounded-2xl border border-white/[0.1] bg-white/[0.03] flex flex-col justify-center"
        >
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Today</div>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">{messageToday}</p>
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
          className="flex-1 w-full p-8 rounded-2xl border-2 border-[#00D2D2]/40 bg-[#00D2D2]/5 flex flex-col justify-center"
        >
          <div className="text-xs font-semibold text-[#00D2D2] uppercase tracking-wider mb-4">Future (possible direction)</div>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">{messageFuture}</p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center text-base md:text-lg text-white/70 italic max-w-2xl mx-auto"
      >
        What is our leading message?
      </motion.p>
    </SlideShell>
  );
}
