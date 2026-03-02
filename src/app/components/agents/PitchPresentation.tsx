import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
  Link,
  ArrowRight,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { PITCH_SLIDES, slidesToText, type PitchSlide } from './copy/pitchSlides';

const BRAND = {
  red: '#FF3D57',
  yellow: '#FFCB00',
  green: '#00D2D2',
  blue: '#579BFC',
  purple: '#A25DDC',
};

function SlideIntro({ slide }: { slide: PitchSlide }) {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg">{slide.subtitle}</p>
      <ul className="space-y-3">
        {slide.bullets?.map((b) => (
          <li key={b} className="flex items-start gap-3">
            <span className="mt-1.5 w-2 h-2 rounded-full bg-[#FF3D57] shrink-0" />
            <span className="text-gray-700">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SlideCapabilities({ slide }: { slide: PitchSlide }) {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg">{slide.subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slide.bullets?.map((b) => (
          <div key={b} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
            <span className="mt-0.5 text-[#00D2D2] font-bold shrink-0">+</span>
            <span className="text-gray-700 text-sm">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideBeforeAfter({ slide }: { slide: PitchSlide }) {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg">{slide.subtitle}</p>
      <div className="space-y-3">
        {slide.comparisons?.map((c) => (
          <div key={c.before} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 text-sm">
            <div className="flex-1 bg-red-50 border border-red-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-red-700">
              {c.before}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 self-center rotate-90 sm:rotate-0" />
            <div className="flex-1 bg-[#00D2D2]/10 border border-[#00D2D2]/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-[#00D2D2]">
              {c.after}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideSecurity({ slide }: { slide: PitchSlide }) {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg">{slide.subtitle}</p>
      <div className="flex flex-wrap gap-3">
        {slide.badges?.map((b) => (
          <div key={b.label} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2">
            <Shield className="w-4 h-4 text-[#579BFC]" />
            <span className="font-semibold text-sm text-gray-800">{b.label}</span>
            <span className="text-xs text-gray-500">{b.detail}</span>
          </div>
        ))}
      </div>
      <ul className="space-y-2">
        {slide.bullets?.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm">
            <Check className="w-4 h-4 text-[#00D2D2] mt-0.5 shrink-0" />
            <span className="text-gray-700">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SlidePricing({ slide }: { slide: PitchSlide }) {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg">{slide.subtitle}</p>
      {slide.highlight && (
        <div className="text-center py-6">
          <span className="text-4xl sm:text-6xl font-bold" style={{ color: BRAND.green }}>
            {slide.highlight}
          </span>
          <p className="text-gray-500 mt-2">forever</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slide.bullets?.map((b) => (
          <div key={b} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-[#00D2D2] mt-0.5 shrink-0" />
            <span className="text-gray-700">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideGetStarted({ slide }: { slide: PitchSlide }) {
  return (
    <div className="space-y-6 text-center">
      <p className="text-gray-600 text-lg">{slide.subtitle}</p>
      <ul className="space-y-3 text-left max-w-sm mx-auto">
        {slide.bullets?.map((b, i) => (
          <li key={b} className="flex items-start gap-3">
            <span className="mt-0.5 w-6 h-6 rounded-full bg-[#FF3D57] text-white text-xs flex items-center justify-center shrink-0 font-bold">
              {i + 1}
            </span>
            <span className="text-gray-700">{b}</span>
          </li>
        ))}
      </ul>
      {slide.cta && (
        <a
          href={slide.cta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-white font-semibold text-base sm:text-lg transition-transform hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${BRAND.red}, ${BRAND.purple})` }}
        >
          {slide.cta.label}
          <ExternalLink className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}

const SLIDE_RENDERERS: Record<string, React.FC<{ slide: PitchSlide }>> = {
  intro: SlideIntro,
  capabilities: SlideCapabilities,
  'before-after': SlideBeforeAfter,
  security: SlideSecurity,
  pricing: SlidePricing,
  'get-started': SlideGetStarted,
};

function ActionButton({
  icon: Icon,
  label,
  successLabel,
  onClick,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  successLabel: string;
  onClick: () => void;
}) {
  const [done, setDone] = useState(false);

  const handleClick = () => {
    onClick();
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300"
      style={{
        borderColor: done ? '#00D2D2' : '#e0e0e0',
        backgroundColor: done ? '#00D2D210' : '#fafafa',
        color: done ? '#00D2D2' : '#555',
      }}
    >
      {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
      {done ? successLabel : label}
    </button>
  );
}

export function PitchPresentation() {
  const [current, setCurrent] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);
  const total = PITCH_SLIDES.length;
  const slide = PITCH_SLIDES[current];

  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : total - 1)), [total]);
  const next = useCallback(() => setCurrent((c) => (c < total - 1 ? c + 1 : 0)), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(slidesToText(PITCH_SLIDES)).catch(() => {});
  };

  const handleShare = () => {
    const url = window.location.origin + '/agents#pitch';
    navigator.clipboard.writeText(url).catch(() => {});
  };

  const handleDownload = () => {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>monday.com - Agent Pitch</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
  .slide { page-break-after: always; padding: 60px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
  .slide:last-child { page-break-after: auto; }
  .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 40px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .brand-name { font-size: 14px; font-weight: 600; color: #888; }
  h2 { font-size: 36px; font-weight: 700; margin-bottom: 12px; color: #111; }
  .subtitle { font-size: 18px; color: #666; margin-bottom: 32px; line-height: 1.5; }
  .bullet { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 16px; color: #444; }
  .bullet-dot { width: 8px; height: 8px; border-radius: 50%; background: #FF3D57; margin-top: 7px; flex-shrink: 0; }
  .comparison { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; font-size: 14px; }
  .comp-before { flex: 1; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; color: #b91c1c; }
  .comp-after { flex: 1; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; color: #15803d; }
  .comp-arrow { color: #999; font-size: 18px; }
  .badge { display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 6px 16px; margin: 4px; font-size: 14px; font-weight: 600; color: #1e40af; }
  .check-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 15px; color: #444; }
  .check-mark { color: #00D2D2; font-weight: bold; flex-shrink: 0; }
  .highlight { text-align: center; font-size: 72px; font-weight: 700; color: #00D2D2; margin: 24px 0; }
  .highlight-sub { text-align: center; color: #888; font-size: 16px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cta { display: inline-block; margin-top: 24px; padding: 14px 32px; background: linear-gradient(135deg, #FF3D57, #A25DDC); color: white; border-radius: 30px; font-size: 18px; font-weight: 600; text-decoration: none; text-align: center; }
  .counter { position: fixed; bottom: 20px; right: 30px; font-size: 12px; color: #bbb; }
  @media print { .counter { position: absolute; } }
</style></head><body>`);

    PITCH_SLIDES.forEach((s, i) => {
      win.document.write('<div class="slide">');
      win.document.write('<div class="brand"><span class="dot" style="background:#FF3D57"></span><span class="dot" style="background:#FFCB00"></span><span class="dot" style="background:#00D2D2"></span><span class="brand-name">monday.com</span></div>');
      win.document.write('<h2>' + s.title + '</h2>');
      if (s.subtitle) win.document.write('<p class="subtitle">' + s.subtitle + '</p>');
      if (s.highlight) {
        win.document.write('<div class="highlight">' + s.highlight + '</div>');
        win.document.write('<div class="highlight-sub">forever</div>');
      }
      if (s.badges) {
        win.document.write('<div style="margin-bottom:24px">');
        s.badges.forEach((b) => win.document.write('<span class="badge">' + b.label + ' &mdash; ' + b.detail + '</span>'));
        win.document.write('</div>');
      }
      if (s.comparisons) {
        s.comparisons.forEach((c) => {
          win.document.write('<div class="comparison"><div class="comp-before">' + c.before + '</div><span class="comp-arrow">&rarr;</span><div class="comp-after">' + c.after + '</div></div>');
        });
      }
      if (s.bullets) {
        const useGrid = s.id === 'pricing' || s.id === 'capabilities';
        if (useGrid) win.document.write('<div class="grid-2">');
        s.bullets.forEach((b) => {
          if (s.id === 'security' || s.id === 'pricing') {
            win.document.write('<div class="check-item"><span class="check-mark">&#10003;</span>' + b + '</div>');
          } else {
            win.document.write('<div class="bullet"><span class="bullet-dot"></span>' + b + '</div>');
          }
        });
        if (useGrid) win.document.write('</div>');
      }
      if (s.cta) {
        win.document.write('<div style="text-align:center;margin-top:32px"><a class="cta" href="' + s.cta.url + '">' + s.cta.label + '</a></div>');
      }
      win.document.write('<div class="counter">' + (i + 1) + ' / ' + PITCH_SLIDES.length + '</div>');
      win.document.write('</div>');
    });

    win.document.write('</body></html>');
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  const Renderer = SLIDE_RENDERERS[slide.id] || SlideIntro;

  return (
    <div className="mb-12">
      <div ref={printRef} className="rounded-2xl overflow-hidden border border-[#e0e0e0] bg-white shadow-lg">
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.red }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.yellow }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND.green }} />
            </div>
            <span className="text-xs font-medium text-gray-400">monday.com &mdash; Agent Pitch</span>
          </div>
          <span className="text-xs text-gray-400 font-mono">{current + 1} / {total}</span>
        </div>

        <div className="relative">
          <div className="px-5 sm:px-12 py-8 sm:py-10 min-h-[300px] sm:min-h-[400px] flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{slide.title}</h2>
            <Renderer slide={slide} />
          </div>

          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-1.5">
            {PITCH_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === current ? BRAND.red : '#d0d0d0',
                  transform: i === current ? 'scale(1.3)' : 'scale(1)',
                }}
                aria-label={'Go to slide ' + (i + 1)}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <ActionButton icon={Download} label="Download PDF" successLabel="Printing..." onClick={handleDownload} />
            <ActionButton icon={Copy} label="Copy All" successLabel="Copied!" onClick={handleCopyAll} />
            <ActionButton icon={Link} label="Share Link" successLabel="Link copied!" onClick={handleShare} />
          </div>
        </div>
      </div>
    </div>
  );
}
