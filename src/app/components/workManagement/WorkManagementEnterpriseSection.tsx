import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { WORK_MANAGEMENT_CONTACT_SALES_URL } from '@/lib/workManagementUrls';

export function WorkManagementEnterpriseSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16"
        >
          <div>
            <p className="text-base font-normal text-black dark:text-white mb-3">
              Enterprise-ready AI work platform
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-black dark:text-white tracking-[-0.03em] leading-[1.1]">
              Trusted by enterprises.
              <br />
              Recognized by industry leaders.
            </h2>
          </div>
          <a
            href={WORK_MANAGEMENT_CONTACT_SALES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-4 h-[49px] px-8 bg-white dark:bg-[#141414] border-2 border-black dark:border-white/10 text-black dark:text-white font-normal text-base rounded-[1000px] hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors shrink-0"
          >
            Contact sales
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Card 1: Enterprise-grade security */}
          <div className="bg-white dark:bg-[#141414] border border-[#cacbcd] dark:border-white/10 rounded-2xl p-10 flex flex-col gap-14">
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-black dark:text-white leading-tight">
                Enterprise-grade security
              </h3>
              <p className="text-lg text-black/80 dark:text-gray-300 leading-relaxed">
                Enterprise-grade AI infrastructure with built-in protection and
                security, data privacy, governance, permissions, and compliance.
              </p>
              <a
                href="https://monday.com/trust"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-normal text-black dark:text-white border-b border-black/50 dark:border-white/50 pb-0.5 hover:border-black dark:hover:border-white transition-colors w-fit"
              >
                Explore our Trust Center
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'GDPR', src: '/logos/gdpr.svg' },
                { name: 'SOC 2', src: '/logos/soc2.svg' },
                { name: 'ISO 27001', src: '/logos/iso27001.svg' },
                { name: 'HIPAA', src: '/logos/hipaa.svg' },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className="h-[88px] rounded-lg bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] flex items-center justify-center p-4 opacity-70 hover:opacity-100 transition-opacity duration-200"
                >
                  <img
                    src={badge.src}
                    alt={badge.name}
                    className="w-full h-full object-contain dark:invert-0 invert"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Gartner */}
          <div className="bg-white dark:bg-[#141414] border border-[#cacbcd] dark:border-white/10 rounded-2xl p-10 flex flex-col justify-between">
            <div className="flex flex-col gap-4 items-center text-center">
              <p className="text-base text-black dark:text-white">
                The <span className="font-semibold">only</span> Leader in
              </p>
              <p className="text-5xl font-bold text-black dark:text-white tracking-tight">3</p>
              <p className="text-base text-black dark:text-white leading-relaxed">
                Work Management{' '}
                <span className="font-semibold">
                  Gartner® Magic Quadrant™
                </span>{' '}
                reports.
              </p>
              <a
                href="https://monday.com/gartner"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-normal text-black dark:text-white border-b border-black/50 dark:border-white/50 pb-0.5 hover:border-black dark:hover:border-white transition-colors"
              >
                Learn more
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>
            </div>
            <div className="h-[60px] flex items-center justify-center">
              <span className="text-xl font-bold text-black dark:text-white">Gartner.</span>
            </div>
          </div>

          {/* Card 3: Forrester ROI */}
          <div className="bg-white dark:bg-[#141414] border border-[#cacbcd] dark:border-white/10 rounded-2xl p-10 flex flex-col justify-between">
            <div className="flex flex-col gap-4 items-center text-center">
              <p className="text-base text-black dark:text-white">Motorola achieved</p>
              <p className="text-5xl font-bold text-black dark:text-white tracking-tight">
                346%
              </p>
              <p className="text-base text-black dark:text-white leading-relaxed">
                <span className="font-semibold">ROI</span> according to{' '}
                <span className="font-bold">
                  Forrester&apos;s
                  <br />
                  Total Economic Impact™
                </span>{' '}
                research.
              </p>
              <a
                href="https://monday.com/forrester"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-normal text-black dark:text-white border-b border-black/50 dark:border-white/50 pb-0.5 hover:border-black dark:hover:border-white transition-colors"
              >
                Learn more
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>
            </div>
            <div className="h-[60px] flex items-center justify-center">
              <span className="text-lg font-bold text-black dark:text-white tracking-wide">
                FORRESTER®
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
