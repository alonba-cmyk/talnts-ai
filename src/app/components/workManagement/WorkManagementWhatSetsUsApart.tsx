import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Users, Shield, Brain } from 'lucide-react';
import { WORK_MANAGEMENT_TRIAL_URL } from '@/lib/workManagementUrls';

const CARDS = [
  {
    icon: Sparkles,
    iconColor: 'text-purple-500',
    title: 'Ease of use that drives proven adoption',
    desc: 'Hyper-personalization and ease of use drive adoption and a more complete picture of work across the org.',
  },
  {
    icon: Users,
    iconColor: 'text-blue-500',
    title: 'Expertise built on real-world work',
    desc: "Trusted by 250K+ customers across industries and informed by the world's most productive teams.",
  },
  {
    icon: Shield,
    iconColor: 'text-pink-500',
    title: 'Enterprise control without compromise',
    desc: 'Gated, governed enterprise platform to keep you in control of all human and AI actions',
  },
  {
    icon: Brain,
    iconColor: 'text-orange-500',
    title: 'Deep understanding of your business',
    desc: 'Unifies your data, context, and institutional knowledge — empowering people and giving AI the agency to act.',
  },
];

export function WorkManagementWhatSetsUsApart() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold text-black dark:text-white tracking-[-0.03em] text-center mb-16"
        >
          What sets us apart
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16"
        >
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="border border-[#cacbcd] dark:border-white/10 rounded-2xl p-8 flex flex-col gap-10 dark:bg-[#141414]"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.iconColor} bg-current/10`}
              >
                <card.icon className={`w-7 h-7 ${card.iconColor}`} />
              </div>
              <div className="flex flex-col gap-8">
                <h3 className="text-2xl font-bold text-black dark:text-white leading-tight">
                  {card.title}
                </h3>
                <p className="text-base text-black/80 dark:text-gray-300 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
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
