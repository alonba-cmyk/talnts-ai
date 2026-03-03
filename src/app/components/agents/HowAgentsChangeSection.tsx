import { BarChart3, FileText, Link2, RefreshCw, Target, Bell } from 'lucide-react';
import { motion } from 'motion/react';

const CARDS = [
  {
    before: 'Update spreadsheets manually',
    after: 'Agent keeps everything current in real-time',
    icon: RefreshCw,
    color: '#00D2D2',
  },
  {
    before: 'Chase teammates for status updates',
    after: 'Live dashboards, always up to date',
    icon: BarChart3,
    color: '#6161FF',
  },
  {
    before: 'Switch between Slack, email, Jira, Sheets',
    after: 'One platform with 200+ integrations',
    icon: Link2,
    color: '#A25DDC',
  },
  {
    before: 'Write weekly status reports',
    after: 'Agent generates reports automatically',
    icon: FileText,
    color: '#FFCB00',
  },
  {
    before: 'Manually assign and track tasks',
    after: 'Automations handle it, rules you define',
    icon: Target,
    color: '#FF3D57',
  },
  {
    before: 'React to issues only when someone tells you',
    after: 'Proactive alerts when things need attention',
    icon: Bell,
    color: '#00D2D2',
  },
];

export function HowAgentsChangeSection() {
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
          How agents change the way you work
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#a0a0a0] mb-8 sm:mb-10 text-base sm:text-lg"
        >
          Less manual work, more time for the things that actually need you.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.before}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-xl border border-[#1e1e1e] bg-[#141414] p-6 sm:p-8 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20 hover:border-l-[3px] hover:border-l-[#00D2D2]"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[#a0a0a0] text-sm sm:text-base">
                      {card.before}
                    </span>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-right">
                    <span className="text-[#00D2D2] font-medium text-sm sm:text-base">
                      {card.after}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
