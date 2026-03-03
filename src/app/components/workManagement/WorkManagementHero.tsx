import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { WORK_MANAGEMENT_TRIAL_URL } from '@/lib/workManagementUrls';

export function WorkManagementHero() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 bg-white">
      <div className="max-w-[1120px] mx-auto text-center flex flex-col items-center gap-8 sm:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          <p className="text-base font-normal text-gray-600 leading-relaxed">
            Intelligent work execution
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-bold text-black tracking-[-0.03em] leading-[1.1] max-w-[908px] mx-auto">
            Finally, execution that keeps up with your ambition
          </h1>
          <p className="text-lg sm:text-xl text-black/90 leading-relaxed max-w-[751px] mx-auto">
            You lead, AI delivers. Your teams&apos; ceiling just got higher.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <a
            href={WORK_MANAGEMENT_TRIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 h-14 px-6 bg-black hover:bg-gray-800 text-white font-medium text-lg rounded-[40px] transition-colors"
          >
            Get started
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </a>
          <p className="text-sm text-[#7c7b7b]">
            Try it out first with a free trial | No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
