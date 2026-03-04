import { motion } from 'motion/react';
import { AGENT_FEEDBACK_URL } from '@/lib/agentUrls';

const LINKS = [
  {
    label: 'This page',
    href: 'https://monday.com/agents',
    value: 'monday.com/agents',
  },
  {
    label: 'API docs',
    href: 'https://developer.monday.com/api-reference/reference/about-the-api-reference',
    value: 'developer.monday.com',
  },
  {
    label: 'MCP docs',
    href: 'https://developer.monday.com/apps/docs/monday-apps-mcp',
    value: 'developer.monday.com/mcp',
  },
  {
    label: 'HATCHA',
    href: 'https://github.com/mondaycom/hatcha',
    value: 'github.com/mondaycom/hatcha',
    broken: true,
  },
  {
    label: 'Agent Feedback',
    href: AGENT_FEEDBACK_URL,
    value: 'forms.monday.com/agent-feedback',
  },
];

export function HumanDeveloperSection() {
  return (
    <section
      id="api"
      className="relative py-10 sm:py-20 px-4 sm:px-6 overflow-hidden bg-[#0a0a0a]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="hatcha"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-4"
        >
          For developers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#a0a0a0] mb-8 sm:mb-10 text-base sm:text-lg"
        >
          Building an agent? Point it to this page. It will find signup endpoints, API documentation, and HATCHA verification.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-xl border border-[#1e1e1e] bg-[#141414] p-5 sm:p-6 mb-8"
        >
          <h3 className="text-base font-semibold text-white mb-3">What is HATCHA?</h3>
          <p className="text-[#a0a0a0] text-sm sm:text-base leading-relaxed mb-4">
            HATCHA stands for <span className="text-[#e0e0e0]">Hyperfast Agent Task Challenge for Access</span>.
            It&apos;s a playful inversion of CAPTCHA — instead of proving you&apos;re human, an agent proves it&apos;s a machine.
            Challenges include Base64 decoding and hex-to-ASCII conversion — trivial for an AI (milliseconds) but tedious for humans.
          </p>
          <div className="rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] p-4 text-sm">
            <p className="text-[#808080] mb-2">Example:</p>
            <p className="text-[#a0a0a0] mb-1">
              Decode <span className="text-[#00D2D2]">bW9uZGF5LmNvbSB3ZWxjb21lcyBhZ2VudHM=</span>
            </p>
            <p className="text-[#00D2D2] text-xs">
              &quot;monday.com welcomes agents&quot; (solved in ~2ms by an agent)
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-base font-semibold text-white mb-3">Useful links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg border border-[#1e1e1e] bg-[#141414] p-4 hover:border-[#00D2D2]/40 transition-colors group"
              >
                <span className="text-[#808080] text-sm shrink-0">{link.label}</span>
                <span className="flex-1 min-w-0 text-right">
                  <span className="text-[#00D2D2] text-sm group-hover:underline truncate block">
                    {link.value}
                  </span>
                </span>
                {link.broken && (
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse"
                    title="Link not yet live (404)"
                  />
                )}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-6 text-[#808080] text-sm"
        >
          Using monday.com as a human?{' '}
          <a
            href="https://monday.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00D2D2] hover:underline"
          >
            monday.com/signup
          </a>
        </motion.p>
      </div>
    </section>
  );
}
