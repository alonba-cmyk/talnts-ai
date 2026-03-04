import { motion } from 'motion/react';
import { Tag, Sparkles, MessageSquare, Star } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';

const tiles = [
  { id: 'category', title: 'Our category & positioning', icon: Tag, color: '#00D2D2', slideIndex: 0 },
  { id: 'value-prop', title: 'Our leading value proposition', icon: Sparkles, color: '#6161FF', slideIndex: 1 },
  { id: 'story', title: 'How we tell the story', icon: MessageSquare, color: '#A25DDC', slideIndex: 2 },
  { id: 'differentiation', title: 'What sets us apart', icon: Star, color: '#FFCB00', slideIndex: 3 },
];

interface MarketingImplicationsAgendaSlideProps {
  onTileClick?: (index: number) => void;
}

export default function MarketingImplicationsAgendaSlide({ onTileClick }: MarketingImplicationsAgendaSlideProps) {
  return (
    <SlideShell dark>
      <div className="text-center mb-2">
        <SlideTitle dark className="!mb-2">4 main implications on marketing</SlideTitle>
        <SlideSubtitle dark className="!mb-0 mx-auto max-w-xl">
          Agenda for the discussion — click a tile to explore
        </SlideSubtitle>
      </div>

      <div className="grid grid-cols-2 gap-5 md:gap-8 mt-12 max-w-3xl mx-auto">
        {tiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <motion.button
              key={tile.id}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTileClick?.(tile.slideIndex)}
              className="group p-8 md:p-10 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer"
              style={{
                borderColor: `${tile.color}55`,
                backgroundColor: `${tile.color}08`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${tile.color}30, ${tile.color}15)`,
                  boxShadow: `0 0 32px ${tile.color}25`,
                }}
              >
                <Icon className="w-8 h-8" style={{ color: tile.color }} strokeWidth={2} />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white text-center leading-snug">
                {tile.title}
              </h3>
            </motion.button>
          );
        })}
      </div>
    </SlideShell>
  );
}
