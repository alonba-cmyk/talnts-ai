import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Zap,
  RefreshCw,
  MessageSquare,
  FileOutput,
  Plug,
} from 'lucide-react';
import { motion } from 'motion/react';

const ITEMS = [
  {
    icon: LayoutDashboard,
    iconColor: '#00D2D2',
    label: 'Create and manage project boards automatically',
  },
  {
    icon: CheckSquare,
    iconColor: '#6161FF',
    label: 'Track tasks, update statuses, and assign owners',
  },
  {
    icon: BarChart3,
    iconColor: '#A25DDC',
    label: 'Generate real-time dashboards and reports',
  },
  {
    icon: Zap,
    iconColor: '#FF9500',
    label: 'Automate workflows with 200+ built-in recipes',
  },
  {
    icon: RefreshCw,
    iconColor: '#00D2D2',
    label: 'React to changes instantly — no delays',
  },
  {
    icon: MessageSquare,
    iconColor: '#FF3D57',
    label: 'Collaborate with your team: updates, files, comments',
  },
  {
    icon: FileOutput,
    iconColor: '#FFCB00',
    label: 'Communicate work in multiple formats (HTML, embed, widgets)',
  },
  {
    icon: Plug,
    iconColor: '#6161FF',
    label: 'Works with popular AI agent frameworks out of the box',
  },
];

export function WhatYourAgentCanDoSection() {
  return (
    <section className="relative py-10 sm:py-20 px-4 sm:px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-4"
        >
          What your agent can do for you
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#a0a0a0] mb-8 sm:mb-10 text-base sm:text-lg"
        >
          Your AI agent becomes a full-time project operator. 24/7, zero overhead.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      </div>
    </section>
  );
}
