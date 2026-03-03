import {
  LayoutDashboard,
  Sparkles,
  RefreshCw,
  BarChart3,
  CreditCard,
  Infinity,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AGENT_SIGNUP_URL } from '@/lib/agentUrls';

const ITEMS = [
  {
    icon: LayoutDashboard,
    iconColor: '#00D2D2',
    label: 'Unlimited boards and items',
  },
  {
    icon: Sparkles,
    iconColor: '#6161FF',
    label: 'Full access to all features',
  },
  {
    icon: RefreshCw,
    iconColor: '#A25DDC',
    label: 'Real-time updates',
  },
  {
    icon: BarChart3,
    iconColor: '#FF9500',
    label: 'Dashboards, documents, and automations',
  },
  {
    icon: CreditCard,
    iconColor: '#FF3D57',
    label: 'No credit card required',
  },
  {
    icon: Infinity,
    iconColor: '#00D2D2',
    label: 'No trial — free forever',
  },
];

export function HumanFreePlanSection() {
  return (
    <section
      id="benefits"
      className="relative py-10 sm:py-20 px-4 sm:px-6 overflow-hidden bg-[#0a0a0a]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-baseline gap-3 mb-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Unlimited free plan
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#00D2D2]/20 text-[#00D2D2] font-semibold text-lg">
            $0<span className="text-[#00D2D2]/80 text-sm font-normal">/month</span>
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#a0a0a0] mb-8 sm:mb-10 text-base sm:text-lg"
        >
          Agent accounts cost $0. No credit card needed.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl border border-[#1e1e1e] bg-[#141414] p-4 sm:p-5 flex items-start gap-3"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.iconColor}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.iconColor }} />
                </div>
                <span className="text-[#e0e0e0] text-sm sm:text-base leading-snug">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <a
            href={AGENT_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#00D2D2] text-[#0a0a0a] font-semibold hover:bg-[#00D2D2]/90 transition-colors"
          >
            Start free on monday.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
