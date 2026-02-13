import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import type { DepartmentRow } from '@/types/database';

// Map department name to short product label
const productLabel: Record<string, string> = {
  marketing: 'Marketing',
  sales: 'Sales',
  operations: 'Operations',
  support: 'Support',
  product: 'Product',
  legal: 'Legal',
  finance: 'Finance',
  hr: 'HR',
};

interface DepartmentBarProps {
  departments: DepartmentRow[];
  loading: boolean;
  selectedDeptId: string | null;
  onSelectDepartment: (id: string) => void;
}

export function DepartmentBar({
  departments,
  loading,
  selectedDeptId,
  onSelectDepartment,
}: DepartmentBarProps) {
  if (loading) {
    return (
      <section className="py-8 bg-white flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-[#6161ff] animate-spin" />
      </section>
    );
  }

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Framed container */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-full"
        >
          <div className="flex items-center gap-4 md:gap-5 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/40 overflow-x-auto scrollbar-hide">
            {departments.map((dept, index) => {
              const isSelected = selectedDeptId === dept.id;
              const label = productLabel[dept.name] || dept.name;

              return (
                <motion.button
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.04 * index, duration: 0.3 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => onSelectDepartment(dept.id)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={`
                        rounded-full overflow-hidden transition-all duration-300
                        ${isSelected
                          ? 'w-12 h-12 md:w-14 md:h-14 ring-[2.5px] ring-[#6161ff] ring-offset-[2px] ring-offset-white'
                          : 'w-10 h-10 md:w-12 md:h-12 group-hover:ring-[1.5px] group-hover:ring-gray-300 group-hover:ring-offset-1 group-hover:ring-offset-white'
                        }
                      `}
                      style={{ backgroundColor: dept.avatar_color || '#e5e7eb' }}
                    >
                      {dept.avatar_image && (
                        <img
                          src={dept.avatar_image}
                          alt={label}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Glow on selected */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0.2, 0.45, 0.2],
                          scale: [1, 1.12, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          boxShadow: `0 0 18px ${dept.avatar_color || '#6161ff'}`,
                        }}
                      />
                    )}
                  </div>

                  {/* Label -- product name only */}
                  <span
                    className={`
                      transition-all duration-200 text-center whitespace-nowrap
                      ${isSelected
                        ? 'text-[11px] font-semibold text-gray-900'
                        : 'text-[10px] font-medium text-gray-400 group-hover:text-gray-500'
                      }
                    `}
                  >
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
