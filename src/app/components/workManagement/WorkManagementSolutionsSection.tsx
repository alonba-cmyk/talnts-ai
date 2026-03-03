import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { WORK_MANAGEMENT_TRIAL_URL } from '@/lib/workManagementUrls';

const USE_CASES = [
  { label: 'PMO', color: 'bg-[#ff6b10]', width: 'w-[170px]' },
  { label: 'Product', color: 'bg-[#9eb4ce]', width: 'w-[170px]' },
  { label: 'Operations', color: 'bg-[#00baff]', width: 'w-[170px]' },
  { label: 'SMBs', color: 'bg-[#6161FF]', width: 'w-[270px]' },
  { label: 'HR', color: 'bg-[#fc0]', width: 'w-[170px]' },
  { label: 'Leadership', color: 'bg-[#d8e2ec]', width: 'w-[170px]' },
  { label: 'Enterprise', color: 'bg-[#d7bdff]', width: 'w-[270px]' },
  { label: 'Legal', color: 'bg-[#d8e2ec]', width: 'w-[170px]' },
  { label: 'Finance', color: 'bg-[#9eb4ce]', width: 'w-[170px]' },
  { label: 'Marketing', color: 'bg-[#ff84e4]', width: 'w-[170px]' },
];

export function WorkManagementSolutionsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = 182;
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }
    setActiveDot(index);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-[-0.03em] leading-[1.1] mb-6">
            Solutions for every team,
            <br />
            at any scale
          </h2>
          <p className="text-base text-gray-600 max-w-[560px] mx-auto leading-relaxed">
            Accelerate business outcomes with solutions, agents, and workflows
            built exactly for your needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {USE_CASES.map((uc) => (
              <div
                key={uc.label}
                className={`${uc.color} ${uc.width} h-[200px] shrink-0 rounded-xl flex items-end p-4 snap-center`}
              >
                <span className="backdrop-blur-[6px] bg-white/20 border border-white/30 rounded-full px-3 py-1 text-base font-medium text-white">
                  {uc.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  activeDot === i ? 'bg-black' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <a
            href={WORK_MANAGEMENT_TRIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-black hover:bg-gray-800 text-white font-medium text-base rounded-[40px] transition-colors"
          >
            Get started
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
