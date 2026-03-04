import { motion } from 'motion/react';
import SlideShell, { SlideTitle } from './SlideShell';
import AgentLedDiagram from './AgentLedDiagram';

export default function LeadingValuePropositionSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>A new core message emerging from the narrative.</SlideTitle>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 text-center"
      >
        <p className="text-2xl md:text-4xl font-semibold text-white leading-relaxed max-w-3xl mx-auto">
          Humans and agents working together on one work platform
          <br />
          <span className="bg-gradient-to-r from-[#00D2D2] to-[#A25DDC] bg-clip-text text-transparent">
            to achieve real business outcomes
          </span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 max-w-2xl mx-auto"
      >
        <AgentLedDiagram />
      </motion.div>
    </SlideShell>
  );
}
