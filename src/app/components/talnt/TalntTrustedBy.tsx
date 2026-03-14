import { motion } from 'motion/react';
import { useTalntTheme } from '../../talnt/TalntThemeContext';

const COMPANIES = [
  { name: 'Google', logo: '/logos/google.svg' },
  { name: 'Microsoft', logo: '/logos/microsoft.svg' },
  { name: 'Salesforce', logo: '/logos/salesforce.svg' },
  { name: 'NVIDIA', logo: '/logos/nvidia.svg' },
  { name: 'Oracle', logo: '/logos/oracle.svg' },
  { name: 'Databricks', logo: '/logos/databricks.svg' },
  { name: 'Anthropic', logo: '/logos/anthropic.svg' },
  { name: 'OpenAI', logo: '/logos/openai.svg' },
];

export default function TalntTrustedBy() {
  const { tokens } = useTalntTheme();

  return (
    <section className="py-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-8"
            style={{ color: tokens.textMuted }}
          >
            Companies already hiring AI agents
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {COMPANIES.map((company, i) => (
              <motion.img
                key={company.name}
                src={company.logo}
                alt={company.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="h-6 sm:h-7 w-auto object-contain transition-all duration-300 cursor-default"
                style={{ filter: tokens.logoFilter }}
                onMouseEnter={e => { e.currentTarget.style.filter = tokens.logoFilterHover; }}
                onMouseLeave={e => { e.currentTarget.style.filter = tokens.logoFilter; }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
