import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { competitors } from './gtmData';

function useCompetitorImages(comp: (typeof competitors)[0] | null) {
  return useMemo(() => {
    if (!comp) return [];
    const items: { url: string; isVideo: boolean; tweetId?: string }[] = [];
    if (comp.galleryUrls?.length) {
      comp.galleryUrls.forEach((u) => items.push({ url: u, isVideo: false }));
    }
    if (comp.tweetEmbedId) {
      items.push({ url: `tweet-${comp.tweetEmbedId}`, isVideo: false, tweetId: comp.tweetEmbedId });
    }
    if (comp.promoMediaUrl) {
      const isVideo = /\.(mp4|webm|mov)$|video\.twimg\.com|amplify_video|tweet_video/i.test(comp.promoMediaUrl);
      items.push({ url: comp.promoMediaUrl, isVideo });
    }
    if (comp.screenshotUrl) items.push({ url: comp.screenshotUrl, isVideo: false });
    const seen = new Set<string>();
    return items.filter(({ url }) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [comp?.name, comp?.screenshotUrl, comp?.promoMediaUrl, comp?.tweetEmbedId, comp?.galleryUrls]);
}

const SLIDESHOW_INTERVAL = 4500;

function CompetitorVisual({ comp }: { comp: (typeof competitors)[0] }) {
  const mediaItems = useCompetitorImages(comp);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  const validItems = mediaItems.filter((_, i) => !errors.has(i));
  const showSlideshow = validItems.length > 1;
  const safeLen = Math.max(1, validItems.length);
  const current = validItems[currentIdx % safeLen];

  useEffect(() => {
    if (!showSlideshow) return;
    const t = setInterval(() => {
      setCurrentIdx((i) => i + 1);
    }, SLIDESHOW_INTERVAL);
    return () => clearInterval(t);
  }, [showSlideshow]);

  useEffect(() => {
    setCurrentIdx(0);
    setErrors(new Set());
    setLoaded(false);
  }, [comp.name]);

  const handleError = () => {
    const idx = mediaItems.findIndex((m) => m.url === current?.url);
    if (idx >= 0) setErrors((s) => new Set([...s, idx]));
  };

  if (mediaItems.length === 0) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/[0.08] flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${comp.color}15, ${comp.color}05)` }}>
        <img src={comp.logoUrl} alt={comp.name} className="max-w-[200px] max-h-[80px] object-contain" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[280px] rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: `linear-gradient(135deg, ${comp.color}08, transparent)` }}>
          <div className="animate-pulse text-white/30 text-sm">Loading…</div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {current && (
          'tweetId' in current && current.tweetId ? (
            <motion.iframe
              key={current.url}
              src={`https://platform.twitter.com/embed/Tweet.html?dnt=true&embedId=twitter-widget-0&id=${current.tweetId}&theme=dark`}
              className="absolute inset-0 w-full h-full border-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              title={`${comp.name} tweet`}
            />
          ) : current.isVideo ? (
            <motion.video
              key={current.url}
              src={current.url}
              className="absolute inset-0 w-full h-full object-cover object-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              autoPlay
              loop
              muted
              playsInline
              onError={handleError}
              onLoadedData={() => setLoaded(true)}
            />
          ) : (
            <motion.img
              key={current.url}
              src={current.url}
              alt={`${comp.name} AI product`}
              className="absolute inset-0 w-full h-full object-contain object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onError={handleError}
              onLoad={() => setLoaded(true)}
            />
          )
        )}
      </AnimatePresence>
      {showSlideshow && (
        <>
          <button
            onClick={() => setCurrentIdx((i) => (i - 1 + validItems.length) % validItems.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIdx((i) => (i + 1) % validItems.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {validItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${currentIdx % validItems.length === i ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
      {validItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${comp.color}15, ${comp.color}05)` }}>
          <img src={comp.logoUrl} alt={comp.name} className="max-w-[200px] max-h-[80px] object-contain" />
        </div>
      )}
    </div>
  );
}

export default function CompetitorLandscapeSlide() {
  const [selected, setSelected] = useState<number | null>(0);
  const comp = selected !== null ? competitors[selected] : null;

  return (
    <SlideShell dark>
      <SlideTitle dark>Competitive Landscape</SlideTitle>
      <SlideSubtitle dark>
        How competitors position themselves. Select one to see their AI page and positioning.
      </SlideSubtitle>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[calc(100vh-12rem)] min-h-[400px]">
        {/* Left: competitor list */}
        <div className="flex flex-row md:flex-col flex-wrap gap-2 md:w-36 shrink-0">
          {competitors.map((c, i) => (
            <StaggerChild key={c.name} index={i}>
              <button
                onClick={() => setSelected(selected === i ? null : i)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                  selected === i
                    ? 'border-[#00D2D2] bg-[#00D2D2]/15 text-white'
                    : 'border-white/20 bg-white/[0.04] text-white/80 hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <img
                    src={c.logoUrl}
                    alt=""
                    className="w-5 h-5 rounded object-contain shrink-0 bg-white/5"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      const dot = el.nextElementSibling;
                      if (dot) (dot as HTMLElement).style.display = 'inline-block';
                    }}
                  />
                  <span
                    className="w-2 h-2 rounded-full shrink-0 hidden"
                    style={{ background: c.color }}
                    aria-hidden
                  />
                  {c.name}
                </span>
              </button>
            </StaggerChild>
          ))}
        </div>

        {/* Right: large media + compact info */}
        <AnimatePresence mode="wait">
          {comp ? (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col min-w-0"
            >
              <div className="mb-3 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={comp.logoUrl}
                      alt=""
                      className="w-10 h-10 rounded-lg object-contain shrink-0 bg-white/5 p-1"
                      referrerPolicy="no-referrer"
                      onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}}
                    />
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{comp.heroHeadline}</h3>
                      <p className="text-xs sm:text-sm text-white/50 mt-1 leading-snug">{comp.heroSubline}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm font-bold" style={{ color: comp.color }}>{comp.keyMetric}</span>
                      {comp.keyMetricSourceUrl && (
                        <a
                          href={comp.keyMetricSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-0.5 rounded text-white/40 hover:text-[#00D2D2] transition-colors"
                          title="View source"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </span>
                    <a
                      href={comp.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00D2D2]/15 text-[#00D2D2] text-sm font-semibold hover:bg-[#00D2D2]/25 transition-colors border border-[#00D2D2]/30"
                    >
                      View page <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                {comp.bottomLine && (
                  <div className="pt-3 mt-3 border-t border-white/[0.06] pl-14 sm:pl-14">
                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Bottom line</span>
                    <p className="text-sm text-white/90 mt-1.5 leading-relaxed">{comp.bottomLine}</p>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
                <CompetitorVisual key={comp.name} comp={comp} />
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
              Select a competitor
            </div>
          )}
        </AnimatePresence>
      </div>
    </SlideShell>
  );
}
