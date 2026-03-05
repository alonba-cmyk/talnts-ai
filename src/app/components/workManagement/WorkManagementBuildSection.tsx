import { motion } from 'motion/react';

export function WorkManagementBuildSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
      <div className="max-w-[758px] mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl lg:text-[53px] font-bold text-black tracking-[-0.03em] leading-[1.1] mb-6"
        >
          Build any app in minutes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg sm:text-xl text-gray-600 leading-relaxed"
        >
          Customize your workflow with low-code and no-code building blocks to
          build software that fits your needs perfectly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden"
        >
          <div className="aspect-video flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-gray-400 text-sm mb-4">Search for your app</p>
              <div className="flex flex-wrap gap-2">
                {['All', 'CRM', 'Project Management', 'Marketing', 'HR', 'IT'].map(
                  (cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm"
                    >
                      {cat}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
