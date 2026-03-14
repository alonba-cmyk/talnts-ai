import { useState, lazy, Suspense, Component, type ReactNode } from 'react';
import { Globe, Monitor, FileText, Pencil, AlertTriangle, Bot, Layers } from 'lucide-react';
import { usePageComponents, usePages } from '@/hooks/useSupabase';

// Lazy-load ComponentBankView so its import chain doesn't block the Pages tab
const ComponentBankView = lazy(() =>
  import('./ComponentBankView').then(m => ({ default: m.ComponentBankView }))
);

// Error Boundary to catch React render errors and display them visually
class SiteBuilderErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message || String(error) };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('SiteBuilder error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Site Builder Error</span>
          </div>
          <pre className="text-red-300 text-sm whitespace-pre-wrap bg-red-950/30 rounded p-3">{this.state.error}</pre>
          <button
            onClick={() => this.setState({ hasError: false, error: '' })}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export interface SiteBuilderViewProps {
  onEditPage: (pageId: 'homepage' | 'platform') => void;
  onOpenDynamicPages: () => void;
  onOpenAgentsPage?: () => void;
  onOpenWmPage?: () => void;
  onOpenWorkDraftPage?: () => void;
}

type TabId = 'pages' | 'component_bank';

export function SiteBuilderView(props: SiteBuilderViewProps) {
  return (
    <SiteBuilderErrorBoundary>
      <SiteBuilderInner {...props} />
    </SiteBuilderErrorBoundary>
  );
}

function SiteBuilderInner({ onEditPage, onOpenDynamicPages, onOpenAgentsPage, onOpenWmPage, onOpenWorkDraftPage }: SiteBuilderViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('pages');

  const { components: homepageComponents, error: hpError } = usePageComponents('homepage');
  const { components: platformComponents, error: ptError } = usePageComponents('platform');
  const { pages, error: pagesError } = usePages();

  const dynamicPagesCount = (pages || []).filter((p) => !p.is_homepage).length;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'pages', label: 'Pages' },
    { id: 'component_bank', label: 'Component Bank' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Pills */}
      <div className="flex gap-1 p-1 bg-gray-900/60 rounded-xl border border-gray-800/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gray-800 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Homepage Card */}
          <div
            className="group relative flex flex-col p-5 rounded-xl border border-gray-800/60 bg-gray-900/40 hover:border-blue-500/40 hover:bg-gray-900/60 transition-all cursor-pointer"
            onClick={() => onEditPage('homepage')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onEditPage('homepage')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium">
                {homepageComponents.length} components
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Homepage</h3>
            <p className="text-gray-500 text-sm mb-4 flex-1">
              Main landing page at /
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPage('homepage');
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors w-fit"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Platform Page Card */}
          <div
            className="group relative flex flex-col p-5 rounded-xl border border-gray-800/60 bg-gray-900/40 hover:border-teal-500/40 hover:bg-gray-900/60 transition-all cursor-pointer"
            onClick={() => onEditPage('platform')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onEditPage('platform')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <Monitor className="w-5 h-5 text-teal-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-400 text-xs font-medium">
                {platformComponents.length} components
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Platform Page</h3>
            <p className="text-gray-500 text-sm mb-4 flex-1">
              Platform view at /platform
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPage('platform');
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors w-fit"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Agents Page Card */}
          <div
            className="group relative flex flex-col p-5 rounded-xl border border-gray-800/60 bg-gray-900/40 hover:border-green-500/40 hover:bg-gray-900/60 transition-all cursor-pointer"
            onClick={() => onOpenAgentsPage?.()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpenAgentsPage?.()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-green-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-xs font-medium">
                6 variants
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Agents Page</h3>
            <p className="text-gray-500 text-sm mb-4 flex-1">
              Agent-facing page at /agents
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAgentsPage?.();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors w-fit"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* monday.com Page Card */}
          <div
            className="group relative flex flex-col p-5 rounded-xl border border-gray-800/60 bg-gray-900/40 hover:border-emerald-500/40 hover:bg-gray-900/60 transition-all cursor-pointer"
            onClick={() => onOpenWmPage?.()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpenWmPage?.()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                2 variants
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">monday.com</h3>
            <p className="text-gray-500 text-sm mb-4 flex-1">
              AI Work Platform page at /work-management
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenWmPage?.();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors w-fit"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* WorkDraft Page Card */}
          <div
            className="group relative flex flex-col p-5 rounded-xl border border-gray-800/60 bg-gray-900/40 hover:border-violet-500/40 hover:bg-gray-900/60 transition-all cursor-pointer"
            onClick={() => onOpenWorkDraftPage?.()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpenWorkDraftPage?.()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-violet-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-400 text-xs font-medium">
                2 variants
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">WorkDraft</h3>
            <p className="text-gray-500 text-sm mb-4 flex-1">
              AI agent hiring marketplace at /workdraft
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenWorkDraftPage?.();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors w-fit"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Dynamic Pages Card */}
          <div
            className="group relative flex flex-col p-5 rounded-xl border border-gray-800/60 bg-gray-900/40 hover:border-indigo-500/40 hover:bg-gray-900/60 transition-all cursor-pointer"
            onClick={onOpenDynamicPages}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpenDynamicPages()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                {dynamicPagesCount} pages
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Dynamic Landing Pages</h3>
            <p className="text-gray-500 text-sm mb-4 flex-1">
              Custom pages at /p/:slug
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDynamicPages();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors w-fit"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        </div>
      )}

      {activeTab === 'component_bank' && (
        <Suspense fallback={<div className="text-gray-400 p-4">Loading Component Bank...</div>}>
          <ComponentBankView />
        </Suspense>
      )}

      {/* Debug: show any hook errors */}
      {(hpError || ptError || pagesError) && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-950/20 p-4 text-sm text-yellow-400">
          <strong>Data warnings:</strong>
          {hpError && <div>Homepage components: {hpError}</div>}
          {ptError && <div>Platform components: {ptError}</div>}
          {pagesError && <div>Pages: {String(pagesError)}</div>}
        </div>
      )}
    </div>
  );
}
