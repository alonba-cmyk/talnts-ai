import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import sidekickLogo from '@/assets/1babfe88a809998ec3c5c5d597d8051ef7639a6f.png';
import { WORK_MANAGEMENT_TRIAL_URL } from '@/lib/workManagementUrls';

export function WorkManagementCTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#6161FF]/5 dark:bg-[#6161FF]/10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(ellipse, rgba(97,97,255,0.15) 0%, transparent 70%)',
          }}
        />
      </div>
      <div className="relative max-w-[1120px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8"
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-[#6161FF]/20 dark:border-white/10">
            <img
              src={sidekickLogo}
              alt="Sidekick"
              className="w-8 h-8 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              Powered by AI
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-[-0.02em] leading-tight max-w-[810px]">
            Ready to transform how your team works?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-[540px]">
            Join 250,000+ teams who use monday.com Work Management to achieve
            more.
          </p>
          <a
            href={WORK_MANAGEMENT_TRIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-black hover:bg-gray-800 text-white font-medium text-base rounded-[40px] transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Get started
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
