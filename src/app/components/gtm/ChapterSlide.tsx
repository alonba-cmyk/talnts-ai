import { motion } from 'motion/react';

interface ChapterSlideProps {
  title: string;
  subtitle?: string;
  sectionNumber?: number;
}

export default function ChapterSlide({ title, subtitle, sectionNumber }: ChapterSlideProps) {
  return (
    <section className="relative min-h-screen w-full snap-start flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        {sectionNumber != null && (
          <div className="text-sm font-medium text-white/30 tracking-[0.2em] mb-4">
            -{sectionNumber}-
          </div>
        )}
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-base md:text-lg text-white/50 tracking-wide">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}
