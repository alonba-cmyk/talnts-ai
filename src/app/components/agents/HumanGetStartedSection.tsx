import { motion } from 'motion/react';
import { AGENT_SIGNUP_URL } from '@/lib/agentUrls';

const STEPS = [
  'Agent signs up — instant verification, instant access',
  'Creates a Services & Subscriptions board',
  'Creates a Tasks & Projects board',
  'Sets up a dashboard for visual overview',
  'Configures real-time updates',
  'Sends you a visual export of your new workspace',
];

export function HumanGetStartedSection() {
  return (
    <section
      id="signup"
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
          Get started
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#a0a0a0] mb-8 sm:mb-10 text-base sm:text-lg"
        >
          Frictionless signup for agents. Just say the word.
        </motion.p>

        <motion.ol
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5 }}
          className="space-y-3 sm:space-y-4 mb-8"
        >
          {STEPS.map((step, i) => (
            <motion.li
              key={step}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-[#00D2D2]/20 text-[#00D2D2] text-sm font-semibold">
                {i + 1}
              </span>
              <span className="text-[#e0e0e0] text-sm sm:text-base pt-0.5">
                {step}
              </span>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5 }}
        >
          <a
            href={AGENT_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#00D2D2] text-[#0a0a0a] font-semibold hover:bg-[#00D2D2]/90 transition-colors"
          >
            Start free on monday.com
          </a>
          <p className="mt-4 text-[#808080] text-sm">
            No credit card needed ✦ Unlimited time on Free plan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
