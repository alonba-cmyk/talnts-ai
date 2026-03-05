import { User, Zap, Target } from 'lucide-react';
import { motion } from 'motion/react';

const CARDS = [
  {
    icon: User,
    iconColor: '#A25DDC',
    title: 'AI agents can now sign up to monday.com',
    body: 'Agents get their own account and work alongside your team in the same workspace. They show up just like any other team member.',
  },
  {
    icon: Zap,
    iconColor: '#FF9500',
    title: 'They manage work for you',
    body: 'Create project boards, track tasks, build dashboards, automate reports — all the things that used to take your time, agents handle automatically.',
  },
  {
    icon: Target,
    iconColor: '#FF3D57',
    title: 'You stay in control',
    body: 'Everything an agent does is visible in your workspace. You see the dashboards, approve the decisions, and focus on what matters most.',
  },
];

export function WhatDoesThisMeanSection() {
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
          What does this mean?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#a0a0a0] mb-8 sm:mb-10 text-base sm:text-lg"
        >
          monday.com is the first major work platform to welcome AI agents as real members. Here&apos;s what that looks like in practice.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-[#1e1e1e] bg-[#141414] p-6 sm:p-8"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
                  style={{ backgroundColor: `${card.iconColor}20` }}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: card.iconColor }} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-[#a0a0a0] text-sm sm:text-base leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
