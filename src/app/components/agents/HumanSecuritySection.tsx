import { Lock, Shield, Eye, Key } from 'lucide-react';
import { motion } from 'motion/react';

const FEATURES = [
  { icon: Lock, label: 'Data encrypted at rest and in transit' },
  { icon: Shield, label: 'Fine-grained access control per workspace' },
  { icon: Eye, label: 'Complete audit trail for every action' },
  { icon: Key, label: 'Single sign-on (SSO) support' },
];

const BADGES = [
  { label: 'SOC 2 Type II', sub: 'Audited annually' },
  { label: 'GDPR', sub: 'Full compliance' },
  { label: 'ISO 27001', sub: 'Certified' },
  { label: 'HIPAA', sub: 'Supported' },
];

export function HumanSecuritySection() {
  return (
    <section
      id="security"
      className="relative py-10 sm:py-20 px-4 sm:px-6 overflow-hidden bg-[#0a0a0a]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-4"
        >
          Enterprise-grade security
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#a0a0a0] mb-8 sm:mb-10 text-base sm:text-lg"
        >
          Your data is protected by the same standards trusted by Fortune 500 companies.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {FEATURES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl border border-[#1e1e1e] bg-[#141414] p-4 sm:p-5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#00D2D2]/20">
                  <Icon className="w-5 h-5 text-[#00D2D2]" />
                </div>
                <span className="text-[#e0e0e0] text-sm sm:text-base">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-lg border border-[#1e1e1e] bg-[#141414] px-4 py-3"
            >
              <span className="text-white font-semibold text-sm sm:text-base">
                {badge.label}
              </span>
              <span className="text-[#808080] text-xs ml-2">{badge.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
