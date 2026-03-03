import { motion } from 'motion/react';

const CUSTOMER_LOGOS = [
  { name: 'Siemens', logo: '/logos/siemens.svg' },
  { name: 'Coca-Cola', logo: '/logos/coca-cola.svg' },
  { name: 'HP', logo: '/logos/hp.svg' },
  { name: 'Canva', logo: '/logos/canva.svg' },
  { name: 'Costco', logo: '/logos/costco.svg' },
];

export function WorkManagementLogosSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-t border-gray-100">
      <div className="max-w-[1220px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-gray-600 mb-8"
        >
          Already trusted by 250K+ customers worldwide
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16"
        >
          {CUSTOMER_LOGOS.map((company) => (
            <div
              key={company.name}
              className="flex items-center justify-center h-12 w-24 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            >
              <span className="text-lg font-semibold text-gray-400">
                {company.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
