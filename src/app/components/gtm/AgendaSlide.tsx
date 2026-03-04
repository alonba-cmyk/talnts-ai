import { motion } from 'motion/react';
import SlideShell from './SlideShell';

const agendaItems = [
  { num: 1, title: 'Why we here', subItems: [] as string[] },
  { num: 2, title: 'Context', subItems: ['Market', 'Product', 'Customers'] },
  {
    num: 3,
    title: 'Marketing implications',
    subItems: [
      'Assumptions',
      'Our category & positioning',
      'Our leading value proposition',
      'How we tell the story',
      'What sets us apart',
    ],
  },
  { num: 4, title: 'Summary & Discussion', subItems: ['Our packaging', 'Time to talk'] },
];

export default function AgendaSlide() {
  return (
    <SlideShell dark className="[&>div]:!py-8 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start max-w-3xl mx-auto mt-4">
        {/* Left: Agenda title */}
        <div className="shrink-0">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Agenda</h2>
        </div>

        {/* Right: Simple list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex-1 w-full space-y-4"
        >
          {agendaItems.map((item) => (
            <div key={item.num} className="border-l-2 border-white/20 pl-4 py-1">
              <h3 className="text-base md:text-lg font-medium text-white">{item.title}</h3>
              {item.subItems.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {item.subItems.map((sub) => (
                    <li key={sub} className="text-sm text-white/70">
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </SlideShell>
  );
}
