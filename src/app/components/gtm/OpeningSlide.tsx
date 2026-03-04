import { motion } from 'motion/react';

export default function OpeningSlide() {
  return (
    <section className="relative min-h-screen w-full snap-start flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6">
      {/* Subtle gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(0,210,210,0.06) 0%, transparent 60%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
          monday story
          <br />
          <span className="bg-gradient-to-r from-[#00D2D2] to-[#A25DDC] bg-clip-text text-transparent">
            evolution
          </span>
        </h1>
        <div className="mt-6 h-px w-12 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <p className="mt-5 text-base md:text-lg text-white/60 tracking-wide">
          Context, alignment and discussion
        </p>
      </motion.div>
    </section>
  );
}
