import { useState, useRef } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { SiteSettingsEditor } from './components/SiteSettingsEditor';
import { SidekickSettingsEditor } from './components/SidekickSettingsEditor';
import { NavigationItemsEditor } from './components/NavigationItemsEditor';
import { KnowledgeBaseEditor } from './components/KnowledgeBaseEditor';
import { AIProductsEditor } from './components/AIProductsEditor';
// BusinessValuesEditor is now embedded inside the Departments editor as a tab
import { PagesEditor } from './components/PagesEditor';
import { CaseStudiesEditor } from './components/CaseStudiesEditor';
import { DesignAssetsEditor } from './components/DesignAssetsEditor';
import { CompetitorsEditor } from './components/CompetitorsEditor';
import { BattleCardsEditor } from './components/BattleCardsEditor';
import { BattleKnowledgeEditor } from './components/BattleKnowledgeEditor';
import { SiteBuilderView } from './components/SiteBuilderView';
import { PageBuilderEditor } from './components/PageBuilderEditor';
import { AgentsPageSettings } from './components/AgentsPageSettings';
import { WorkManagementPageSettings } from './components/WorkManagementPageSettings';
import { WorkDraftPageSettings } from './components/WorkDraftPageSettings';
import { SidekickThemeProvider } from '@/contexts/SidekickThemeContext';
import { Globe, Target, AlertCircle, Sparkles, Building2, Package, Rocket, ExternalLink, CheckCircle, X, Wand2, FileText, BookOpen, Palette, Cpu, Swords, Users, FolderOpen, LayoutDashboard, Bot, Save } from 'lucide-react';

type NavigationSection = 'site_builder' | 'site_settings' | 'knowledge_base' | 'ai_products' | 'sidekick_settings' | 'outcomes' | 'pain_points' | 'ai_transformations' | 'departments' | 'business_values' | 'pages' | 'case_studies' | 'design_assets' | 'competitors' | 'battle_cards' | 'battle_knowledge' | 'agents_page' | 'wm_page' | 'workdraft_page' | null;

type KnowledgeTab = 'products' | 'agents' | 'vibeapps' | 'sidekick';

export default function AdminApp() {
  const [activeNavSection, setActiveNavSection] = useState<NavigationSection>(null);
  const [knowledgeDefaultTab, setKnowledgeDefaultTab] = useState<KnowledgeTab | null>(null);
  const [loading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  // Page builder sub-navigation
  const [editingPageId, setEditingPageId] = useState<'homepage' | 'platform' | null>(null);
  // Header save button
  const activeSaveRef = useRef<(() => Promise<void>) | null>(null);
  const [headerSaving, setHeaderSaving] = useState(false);
  const [headerSaved, setHeaderSaved] = useState(false);

  const handleRegisterSave = (fn: (() => Promise<void>) | null) => {
    activeSaveRef.current = fn;
  };

  const handleHeaderSave = async () => {
    if (!activeSaveRef.current) return;
    setHeaderSaving(true);
    try {
      await activeSaveRef.current();
      setHeaderSaved(true);
      setTimeout(() => setHeaderSaved(false), 2000);
    } finally {
      setHeaderSaving(false);
    }
  };

  // Get the base URL for the main site (same origin, just root path)
  const getSiteUrl = () => {
    const baseUrl = window.location.origin;
    // If we're in admin, return the main site URL
    return baseUrl;
  };

  const handleOpenPreview = () => {
    window.open(getSiteUrl(), '_blank');
    setShowPublishModal(false);
  };

  // Navigate to Products & Offerings with a specific tab open
  const navigateToKnowledge = (tab?: KnowledgeTab) => {
    setKnowledgeDefaultTab(tab || null);
    setActiveNavSection('knowledge_base');
  };

  const handleSelectNavSection = (section: NavigationSection) => {
    setActiveNavSection(section);
    // Reset page builder when navigating away
    if (section !== 'site_builder') {
      setEditingPageId(null);
    }
  };

  const getNavSectionTitle = () => {
    if (activeNavSection === 'site_builder' && editingPageId) {
      return editingPageId === 'homepage' ? 'Homepage Builder' : 'Platform Page Builder';
    }
    switch (activeNavSection) {
      case 'site_builder': return 'Site Builder';
      case 'ai_products': return 'AI Core Products';
      case 'knowledge_base': return 'AI Capabilities';
      case 'departments': return 'Departments';
      case 'outcomes': return 'Business Outcomes';
      case 'pain_points': return 'Pain Points';
      case 'ai_transformations': return 'AI Transformations';
      case 'case_studies': return 'Customer Case Studies';
      case 'design_assets': return 'Design Assets';
      case 'competitors': return 'Competitors';
      case 'battle_cards': return 'Battle Cards';
      case 'battle_knowledge': return 'Knowledge Sources';
      case 'site_settings': return 'Site Settings (Legacy)';
      case 'sidekick_settings': return 'Sidekick Theme (Legacy)';
      case 'pages': return 'Landing Pages';
      case 'agents_page': return 'Agents Page';
      case 'wm_page': return 'monday.com';
      case 'workdraft_page': return 'WorkDraft';
      default: return 'Admin Dashboard';
    }
  };

  const getNavSectionSubtitle = () => {
    if (activeNavSection === 'site_builder' && editingPageId) {
      return editingPageId === 'homepage'
        ? 'Manage components, layout, and settings for the homepage'
        : 'Manage components, layout, and settings for the platform page';
    }
    switch (activeNavSection) {
      case 'site_builder': return 'Build and manage your site pages with a visual component system';
      case 'ai_products': return 'Manage core products (CRM, Work Management, etc.) with linked capabilities, use cases, and value propositions';
      case 'knowledge_base': return 'Manage AI agents, Vibe apps, and Sidekick actions — the building blocks of the platform';
      case 'departments': return 'Organize capabilities by department and manage department-specific content';
      case 'outcomes': return 'Define business outcomes that map to platform capabilities';
      case 'pain_points': return 'Define customer pain points and their solutions';
      case 'ai_transformations': return 'Define AI transformation journeys for each department';
      case 'case_studies': return 'Customer success stories and proof points for use across the platform';
      case 'design_assets': return 'Organize product logos, agent images, avatars, and visual assets';
      case 'competitors': return 'Manage competitors and map them to monday.com products';
      case 'battle_cards': return 'Configure comparison parameters, scores, and talking points';
      case 'battle_knowledge': return 'Upload battle cards, pitch decks, and scan competitor websites';
      case 'site_settings': return 'Configure hero section, navigation tabs, sections visibility, and layout';
      case 'sidekick_settings': return 'Customize Sidekick appearance, colors, and themes';
      case 'pages': return 'Create and manage landing pages with custom section configurations';
      case 'agents_page': return 'Configure the agent-facing landing page at /agents — hero variants and settings';
      case 'wm_page': return 'Configure the monday.com landing page — hero style, board layout, departments, and use cases';
      case 'workdraft_page': return 'Configure the WorkDraft AI agent hiring marketplace at /workdraft';
      default: return 'Select a section from the sidebar to start editing';
    }
  };

  const getNavSectionIcon = () => {
    if (activeNavSection === 'site_builder' && editingPageId) {
      return editingPageId === 'homepage'
        ? <Globe className="w-6 h-6 text-blue-500" />
        : <LayoutDashboard className="w-6 h-6 text-teal-500" />;
    }
    switch (activeNavSection) {
      case 'site_builder': return <LayoutDashboard className="w-6 h-6 text-indigo-500" />;
      case 'ai_products': return <Package className="w-6 h-6 text-indigo-500" />;
      case 'knowledge_base': return <Cpu className="w-6 h-6 text-purple-500" />;
      case 'departments': return <Building2 className="w-6 h-6 text-blue-500" />;
      case 'outcomes': return <Target className="w-6 h-6 text-green-500" />;
      case 'pain_points': return <AlertCircle className="w-6 h-6 text-amber-500" />;
      case 'ai_transformations': return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'case_studies': return <BookOpen className="w-6 h-6 text-amber-500" />;
      case 'design_assets': return <Palette className="w-6 h-6 text-teal-500" />;
      case 'competitors': return <Users className="w-6 h-6 text-red-500" />;
      case 'battle_cards': return <Swords className="w-6 h-6 text-orange-500" />;
      case 'battle_knowledge': return <FolderOpen className="w-6 h-6 text-yellow-500" />;
      case 'site_settings': return <Globe className="w-6 h-6 text-blue-500" />;
      case 'sidekick_settings': return <Wand2 className="w-6 h-6 text-pink-500" />;
      case 'pages': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'agents_page': return <Bot className="w-6 h-6 text-green-400" />;
      case 'wm_page': return <LayoutDashboard className="w-6 h-6 text-violet-400" />;
      case 'workdraft_page': return <Bot className="w-6 h-6 text-violet-400" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <SidekickThemeProvider>
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeNavSection={activeNavSection}
        onSelectNavSection={handleSelectNavSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#0a0b10]">
        {/* Header */}
        <header className="bg-[#0c0d14]/80 backdrop-blur-md border-b border-gray-800/50 px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activeNavSection && (
                <div className="w-10 h-10 rounded-xl bg-gray-800/80 flex items-center justify-center">
                  {getNavSectionIcon()}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{getNavSectionTitle()}</h1>
                <p className="text-gray-500 text-sm mt-0.5">{getNavSectionSubtitle()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(activeNavSection === 'agents_page' || activeNavSection === 'wm_page' || activeNavSection === 'workdraft_page') && (
                <button
                  onClick={handleHeaderSave}
                  disabled={headerSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                    headerSaved
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                  }`}
                >
                  {headerSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {headerSaving ? 'Saving...' : 'Save Changes'}
                    </>
                  )}
                </button>
              )}
              <button 
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl text-white font-medium text-sm transition-all shadow-lg shadow-emerald-900/20"
              >
                <Rocket className="w-4 h-4" />
                Publish
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Site Builder */}
          {activeNavSection === 'site_builder' && !editingPageId && (
            <SiteBuilderView
              onEditPage={(pageId) => setEditingPageId(pageId)}
              onOpenDynamicPages={() => setActiveNavSection('pages')}
              onOpenAgentsPage={() => setActiveNavSection('agents_page')}
              onOpenWmPage={() => setActiveNavSection('wm_page')}
              onOpenWorkDraftPage={() => setActiveNavSection('workdraft_page')}
            />
          )}

          {/* Page Builder Editor (inside Site Builder) */}
          {activeNavSection === 'site_builder' && editingPageId && (
            <PageBuilderEditor
              pageId={editingPageId}
              onBack={() => setEditingPageId(null)}
            />
          )}

          {/* Site Settings (Legacy - kept for backward compatibility) */}
          {activeNavSection === 'site_settings' && (
            <SiteSettingsEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* Sidekick Settings (Legacy - now part of Sidekick component in Site Builder) */}
          {activeNavSection === 'sidekick_settings' && (
            <SidekickSettingsEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* AI Core Products */}
          {activeNavSection === 'ai_products' && (
            <AIProductsEditor
              onBack={() => setActiveNavSection(null)}
              onNavigateToCapabilities={() => setActiveNavSection('knowledge_base')}
            />
          )}

          {/* AI Capabilities */}
          {activeNavSection === 'knowledge_base' && (
            <KnowledgeBaseEditor 
              defaultTab={knowledgeDefaultTab} 
              onTabChange={() => setKnowledgeDefaultTab(null)}
              onBack={() => setActiveNavSection(null)}
            />
          )}

          {/* Navigation Items Editors */}
          {activeNavSection === 'outcomes' && (
            <NavigationItemsEditor
              type="outcomes"
              title="Business Outcomes"
              icon={<Target className="w-6 h-6 text-green-500" />}
              onNavigateToKnowledge={navigateToKnowledge}
              onBack={() => setActiveNavSection(null)}
            />
          )}
          {activeNavSection === 'pain_points' && (
            <NavigationItemsEditor
              type="pain_points"
              title="Pain Points"
              icon={<AlertCircle className="w-6 h-6 text-amber-500" />}
              onNavigateToKnowledge={navigateToKnowledge}
              onBack={() => setActiveNavSection(null)}
            />
          )}
          {activeNavSection === 'ai_transformations' && (
            <NavigationItemsEditor
              type="ai_transformations"
              title="AI Transformations"
              icon={<Sparkles className="w-6 h-6 text-purple-500" />}
              onNavigateToKnowledge={navigateToKnowledge}
              onBack={() => setActiveNavSection(null)}
            />
          )}

          {/* Departments Editor - Now using same pattern as other intent types */}
          {activeNavSection === 'departments' && (
            <NavigationItemsEditor
              type="departments"
              title="Departments"
              icon={<Building2 className="w-6 h-6 text-indigo-500" />}
              onNavigateToKnowledge={navigateToKnowledge}
              onBack={() => setActiveNavSection(null)}
            />
          )}

          {/* Pages Editor */}
          {activeNavSection === 'pages' && (
            <PagesEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* Case Studies Editor */}
          {activeNavSection === 'case_studies' && (
            <CaseStudiesEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* Design Assets Editor */}
          {activeNavSection === 'design_assets' && (
            <DesignAssetsEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* Competitors Editor */}
          {activeNavSection === 'competitors' && (
            <CompetitorsEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* Battle Cards Editor */}
          {activeNavSection === 'battle_cards' && (
            <BattleCardsEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* Battle Knowledge Editor */}
          {activeNavSection === 'battle_knowledge' && (
            <BattleKnowledgeEditor onBack={() => setActiveNavSection(null)} />
          )}

          {/* Agents Page Settings */}
          {activeNavSection === 'agents_page' && (
            <AgentsPageSettings onBack={() => setActiveNavSection(null)} onRegisterSave={handleRegisterSave} />
          )}

          {/* Work Management Page Settings */}
          {activeNavSection === 'wm_page' && (
            <WorkManagementPageSettings onBack={() => setActiveNavSection(null)} onRegisterSave={handleRegisterSave} />
          )}

          {/* WorkDraft Page Settings */}
          {activeNavSection === 'workdraft_page' && (
            <WorkDraftPageSettings onBack={() => setActiveNavSection(null)} onRegisterSave={handleRegisterSave} />
          )}

          {/* Welcome Screen */}
          {!activeNavSection && (
            <div className="max-w-4xl mx-auto pt-6">
              {/* Hero greeting */}
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold text-white mb-1">Admin Panel</h2>
                <p className="text-gray-600 text-sm">Select a section to manage your platform</p>
              </div>

              {/* Quick-access groups */}
              <div className="space-y-6">
                {/* Platform */}
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2 px-1">Platform</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'ai_products' as NavigationSection, icon: Package, color: '#6366f1', label: 'AI Core Products' },
                      { id: 'knowledge_base' as NavigationSection, icon: Cpu, color: '#8b5cf6', label: 'AI Capabilities' },
                      { id: 'departments' as NavigationSection, icon: Building2, color: '#3b82f6', label: 'Departments' },
                    ].map(item => (
                      <button key={item.label} onClick={() => setActiveNavSection(item.id)}
                        className="flex items-center gap-3 p-3.5 bg-gray-900/40 rounded-xl border border-gray-800/30 hover:border-gray-700 hover:bg-gray-900/70 transition-all text-left group">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                          <item.icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" style={{ color: item.color }} />
                        </div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Journeys */}
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2 px-1">Customer Journeys</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'outcomes' as NavigationSection, icon: Target, color: '#10b981', label: 'Outcomes' },
                      { id: 'pain_points' as NavigationSection, icon: AlertCircle, color: '#f59e0b', label: 'Pain Points' },
                      { id: 'ai_transformations' as NavigationSection, icon: Sparkles, color: '#a855f7', label: 'AI Transformations' },
                    ].map(item => (
                      <button key={item.label} onClick={() => setActiveNavSection(item.id)}
                        className="flex items-center gap-3 p-3.5 bg-gray-900/40 rounded-xl border border-gray-800/30 hover:border-gray-700 hover:bg-gray-900/70 transition-all text-left group">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                          <item.icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" style={{ color: item.color }} />
                        </div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sales Enablement */}
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2 px-1">Sales Enablement</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'competitors' as NavigationSection, icon: Users, color: '#ef4444', label: 'Competitors' },
                      { id: 'battle_cards' as NavigationSection, icon: Swords, color: '#f97316', label: 'Battle Cards' },
                      { id: 'case_studies' as NavigationSection, icon: BookOpen, color: '#f59e0b', label: 'Case Studies' },
                    ].map(item => (
                      <button key={item.label} onClick={() => setActiveNavSection(item.id)}
                        className="flex items-center gap-3 p-3.5 bg-gray-900/40 rounded-xl border border-gray-800/30 hover:border-gray-700 hover:bg-gray-900/70 transition-all text-left group">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                          <item.icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" style={{ color: item.color }} />
                        </div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
                      </button>
                    ))}
                  </div>
                  {/* Battle Cards App Link */}
                  <a href="/battle-cards" target="_blank" rel="noopener noreferrer"
                    className="mt-2.5 flex items-center gap-3 p-3 bg-gradient-to-r from-orange-950/20 to-red-950/20 rounded-xl border border-orange-500/15 hover:border-orange-500/30 transition-all text-left group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Swords className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <span className="text-orange-400/90 text-sm font-medium">Open Battle Cards App</span>
                      <span className="text-gray-600 text-xs ml-2">/battle-cards</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-700 group-hover:text-orange-400 transition-colors" />
                  </a>
                </div>

                {/* Site Builder */}
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2 px-1">Site Builder</p>
                  <button onClick={() => setActiveNavSection('site_builder')}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-950/40 to-purple-950/30 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-left group mb-2.5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                      <LayoutDashboard className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <span className="text-white text-sm font-semibold">Site Builder</span>
                      <p className="text-gray-500 text-xs mt-0.5">Pages, components, and visual layout editor</p>
                    </div>
                  </button>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'design_assets' as NavigationSection, icon: Palette, color: '#14b8a6', label: 'Design Assets' },
                      { id: 'pages' as NavigationSection, icon: FileText, color: '#6366f1', label: 'Dynamic Pages' },
                    ].map(item => (
                      <button key={item.label} onClick={() => setActiveNavSection(item.id)}
                        className="flex items-center gap-3 p-3.5 bg-gray-900/40 rounded-xl border border-gray-800/30 hover:border-gray-700 hover:bg-gray-900/70 transition-all text-left group">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                          <item.icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" style={{ color: item.color }} />
                        </div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPublishModal(false)}
        >
          <div 
            className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Rocket className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Publish Site</h2>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Status Message */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-medium">השינויים שלך כבר שמורים!</p>
                    <p className="text-green-400/70 text-sm mt-1">
                      כל השינויים שביצעת בדשבורד נשמרים אוטומטית ל-Supabase ומוצגים באתר בזמן אמת.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleOpenPreview}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all shadow-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  פתח את האתר בחלון חדש
                </button>

                <button
                  onClick={() => setShowPublishModal(false)}
                  className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
                >
                  סגור
                </button>
              </div>

              {/* Info */}
              <p className="text-gray-500 text-xs text-center mt-4">
                💡 טיפ: השתמש ב-Toggle כדי להסתיר/להציג פריטים באתר
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    </SidekickThemeProvider>
  );
}
