import { motion } from 'motion/react';

export default function OpeningSlide() {
  return (
    <section className="relative min-h-screen w-full snap-start flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
          GTM Strategy
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/50 max-w-md mx-auto">
          Market overview
        </p>
      </motion.div>
    </section>
  );
}
