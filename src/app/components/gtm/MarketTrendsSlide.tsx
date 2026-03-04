import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer, Bot, Swords, TrendingUp, Users, Plug, AlertTriangle, X, ExternalLink } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle } from './SlideShell';
import { marketTrends } from './gtmData';
import type { MarketTrend } from './gtmData';

const TREND_ICONS = { Hammer, Bot, Swords, TrendingUp, Users, Plug, AlertTriangle } as const;

function TrendDetailModal({
  trend,
  onClose,
}: {
  trend: MarketTrend;
  onClose: () => void;
}) {
  const Icon = TREND_ICONS[trend.lucideIcon as keyof typeof TREND_ICONS] ?? Hammer;

  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#00D2D2' + '22', color: '#00D2D2' }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{trend.title}</h3>
              <p className="text-sm text-white/50 mt-0.5">{trend.summary}</p>
            </div>
          </div>

          <div
            className={`gap-6 grid ${trend.evidenceQuote || trend.evidenceTweetId ? 'grid-cols-1 md:grid-cols-[1fr_1.3fr]' : 'grid-cols-1'}`}
          >
            <div className="min-w-0 flex flex-col gap-6">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                {trend.stats.map((stat, j) => (
                  <div
                    key={j}
                    className="p-4 rounded-lg bg-white/[0.04] border border-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xl font-bold text-[#00D2D2]">{stat.value}</div>
                      {stat.sourceUrl && (
                        <a
                          href={stat.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-1 rounded text-white/40 hover:text-[#00D2D2] transition-colors"
                          title="View source"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="text-xs text-white/50 mt-1 leading-snug">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <ul className="space-y-2.5">
                {trend.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-white/80">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6161FF] shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 rounded-lg bg-[#00D2D2]/10 border border-[#00D2D2]/20">
                <div className="text-xs font-semibold text-[#00D2D2] uppercase tracking-wider mb-1.5">
                  Implication for monday.com
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {trend.implication}
                </p>
              </div>
            </div>
            {(trend.evidenceQuote || trend.evidenceTweetId) && (
              <div className="min-w-0 flex flex-col">
                <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Evidence
                </div>
                {trend.evidenceQuote ? (
                  <a
                    href={trend.evidenceQuote.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {trend.evidenceQuote.avatarUrl && (
                        <img
                          src={trend.evidenceQuote.avatarUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                          onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}}
                        />
                      )}
                      <div>
                        <span className="font-semibold text-white block">
                          {trend.evidenceQuote.author}
                        </span>
                        <span className="text-white/50 text-sm">
                          {trend.evidenceQuote.handle}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                      {trend.evidenceQuote.text}
                    </p>
                    {trend.evidenceQuote.imageUrl && (
                      <img
                        src={trend.evidenceQuote.imageUrl}
                        alt="Tweet"
                        className="mt-4 w-full rounded-lg border border-white/[0.08] object-cover object-top"
                        onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}}
                      />
                    )}
                    <span className="inline-block mt-3 text-xs text-[#00D2D2] font-medium">
                      View on X →
                    </span>
                  </a>
                ) : (
                  <iframe
                    src={`https://platform.twitter.com/embed/Tweet.html?dnt=true&id=${trend.evidenceTweetId}&theme=dark`}
                    className="w-full min-w-0 min-h-[320px] rounded-lg border-0"
                    title="Evidence tweet"
                    loading="lazy"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MarketTrendsSlide() {
  const [selected, setSelected] = useState<number | null>(null);
  const trend = selected !== null ? marketTrends[selected] : null;

  return (
    <SlideShell dark>
      <SlideTitle dark>Where the Market Is Going</SlideTitle>
      <SlideSubtitle dark>
        Seven forces reshaping how work gets done. Click a card to dive deeper.
      </SlideSubtitle>

      <div className="grid grid-cols-2 gap-6 md:gap-8">
        {marketTrends.map((t, i) => {
          const Icon = TREND_ICONS[t.lucideIcon as keyof typeof TREND_ICONS] ?? Hammer;
          const cardStat = t.cardStat ?? t.stats[0];
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setSelected(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="text-left p-5 md:p-6 rounded-2xl border border-white/[0.08] bg-[#141414] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all group flex items-center gap-4"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#00D2D2' + '18', color: '#00D2D2' }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#00D2D2] transition-colors leading-tight">
                  {t.title}
                </h3>
                {cardStat && (
                  <p className="text-sm text-[#00D2D2] font-semibold tabular-nums mt-0.5">
                    {cardStat.value}
                    <span className="text-white/50 font-normal ml-1">· {cardStat.label}</span>
                  </p>
                )}
              </div>
              <span className="text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all shrink-0">→</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {trend && (
          <TrendDetailModal
            key={selected}
            trend={trend}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </SlideShell>
  );
}
