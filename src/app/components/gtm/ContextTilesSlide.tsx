import { motion } from 'motion/react';
import { TrendingUp, Package, Users } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';

const tiles = [
  {
    id: 'market',
    title: 'Market',
    icon: TrendingUp,
    color: '#00D2D2',
    desc: 'Trends, ecosystem, competitors',
  },
  {
    id: 'product',
    title: 'Product',
    icon: Package,
    color: '#6161FF',
    desc: 'The monday.com evolution',
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: Users,
    color: '#A25DDC',
    desc: 'Intent, JTBD, sentiment',
  },
];

export default function ContextTilesSlide() {
  return (
    <SlideShell dark>
      <SlideTitle dark>Context</SlideTitle>
      <SlideSubtitle dark>
        Market, Product, Customers — shared understanding before we go into the marketing implications and next steps.
      </SlideSubtitle>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {tiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex flex-col items-center text-center transition-all hover:border-white/[0.15] cursor-default"
              style={{ borderColor: `${tile.color}44` }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${tile.color}20` }}
              >
                <Icon className="w-8 h-8" style={{ color: tile.color }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{tile.title}</h3>
              <p className="text-sm text-white/50">{tile.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </SlideShell>
  );
}
