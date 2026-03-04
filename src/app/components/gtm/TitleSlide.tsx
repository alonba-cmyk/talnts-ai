import { motion } from 'motion/react';

export default function TitleSlide() {
  return (
    <section className="relative min-h-screen w-full snap-start flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Soft gradient accent */}
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.08] blur-[100px] bg-[#6161FF]" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full opacity-[0.06] blur-[80px] bg-[#00D2D2]" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.img
          src="/monday-mark.png"
          alt="monday.com"
          className="w-14 h-14 mb-6 opacity-70"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.2 }}
          className="text-xs tracking-[0.25em] uppercase text-[#8a8a8a] mb-6 font-medium"
        >
          GTM Strategy Proposal
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-5 leading-[1.1] tracking-tight"
        >
          The Agentic
          <br />
          <span className="bg-gradient-to-r from-[#00D2D2] via-[#6161FF] to-[#FB275D] bg-clip-text text-transparent">
            Work Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-[#6b6b6b] max-w-xl mb-8 leading-relaxed"
        >
          Humans and Agents, Working Together
          <br />
          to Achieve Exponential Business Outcomes
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 text-sm text-[#9a9a9a]"
        >
          <span>Marketing Leadership</span>
          <span className="w-1 h-1 rounded-full bg-[#9a9a9a]" />
          <span>March 2026</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[#9a9a9a] tracking-wider">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-[#d0d0d0] flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[#9a9a9a]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
