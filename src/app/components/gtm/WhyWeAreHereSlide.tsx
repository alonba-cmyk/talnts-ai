import { motion } from 'motion/react';

export default function WhyWeAreHereSlide() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl text-center md:text-left"
      >
        <h2 className="text-sm md:text-base font-medium text-white/60 uppercase tracking-wider mb-8">
          Why we&apos;re here
        </h2>
        <p className="text-base md:text-lg text-white/90 leading-relaxed mb-5">
          monday has its own current positioning, story and direction. But it&apos;s not keeping up with the new market direction, and misses the platform&apos;s newest capabilities.
        </p>
        <p className="text-base md:text-lg text-white/90 leading-relaxed mb-5">
          We have a revolutionary new AI work platform.
        </p>
        <p className="text-base md:text-lg text-white/90 leading-relaxed">
          We need to package our brand & strategy to tell this story for our customers.
        </p>
      </motion.div>
    </section>
  );
}
