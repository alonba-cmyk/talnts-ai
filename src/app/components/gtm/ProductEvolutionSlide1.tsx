import SlideShell, { SlideTitle, SlideSubtitle, StaggerChild } from './SlideShell';
import { PRODUCT_COLORS } from './gtmData';

const products = [
  { name: 'Work Management', color: PRODUCT_COLORS.workManagement },
  { name: 'CRM', color: PRODUCT_COLORS.crm },
  { name: 'Dev', color: PRODUCT_COLORS.dev },
  { name: 'Service', color: PRODUCT_COLORS.service },
];

export default function ProductEvolutionSlide1() {
  return (
    <SlideShell dark>
      <SlideTitle dark>The monday.com evolution</SlideTitle>
      <SlideSubtitle dark>4 core products</SlideSubtitle>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <StaggerChild key={p.name} index={i}>
            <div
              className="p-5 rounded-xl border text-center transition-all bg-white/[0.03] border-white/[0.08] hover:border-white/[0.12]"
              style={{ borderColor: p.color + '44' }}
            >
              <div className="w-3 h-3 rounded-sm mx-auto mb-3" style={{ background: p.color }} />
              <div className="font-medium text-white/60 text-xs mb-1">monday</div>
              <div className="font-bold text-base" style={{ color: p.color }}>
                {p.name}
              </div>
            </div>
          </StaggerChild>
        ))}
      </div>
    </SlideShell>
  );
}
