import { useState } from 'react';
import { Home, Globe, Target, AlertCircle, Sparkles, Building2, Package, Wand2, FileText, BookOpen, Palette, Cpu, ChevronDown, ExternalLink, Swords, Users, SlidersHorizontal, FolderOpen, LayoutDashboard, Bot } from 'lucide-react';

type NavigationSection = 'site_builder' | 'site_settings' | 'knowledge_base' | 'ai_products' | 'sidekick_settings' | 'outcomes' | 'pain_points' | 'ai_transformations' | 'departments' | 'business_values' | 'pages' | 'case_studies' | 'design_assets' | 'competitors' | 'battle_cards' | 'battle_knowledge' | 'agents_page' | 'wm_page' | null;

interface AdminSidebarProps {
  activeNavSection: NavigationSection;
  onSelectNavSection: (section: NavigationSection) => void;
}

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

interface NavGroup {
  title: string;
  emoji: string;
  items: NavItem[];
}

export function AdminSidebar({ 
  activeNavSection,
  onSelectNavSection 
}: AdminSidebarProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Platform',
      emoji: '🧠',
      items: [
        { id: 'ai_products', label: 'AI Core Products', icon: Package, color: '#6366f1' },
        { id: 'knowledge_base', label: 'AI Capabilities', icon: Cpu, color: '#8b5cf6' },
        { id: 'departments', label: 'Departments', icon: Building2, color: '#3b82f6' },
      ],
    },
    {
      title: 'Customer Journeys',
      emoji: '🎯',
      items: [
        { id: 'outcomes', label: 'Outcomes', icon: Target, color: '#10b981' },
        { id: 'pain_points', label: 'Pain Points', icon: AlertCircle, color: '#f59e0b' },
        { id: 'ai_transformations', label: 'AI Transformations', icon: Sparkles, color: '#a855f7' },
      ],
    },
    {
      title: 'Messaging & Proof',
      emoji: '📊',
      items: [
        { id: 'case_studies', label: 'Case Studies', icon: BookOpen, color: '#f59e0b' },
      ],
    },
    {
      title: 'Sales Enablement',
      emoji: '⚔️',
      items: [
        { id: 'competitors', label: 'Competitors', icon: Users, color: '#ef4444' },
        { id: 'battle_cards', label: 'Battle Cards', icon: Swords, color: '#f97316' },
        { id: 'battle_knowledge', label: 'Knowledge Sources', icon: FolderOpen, color: '#eab308' },
      ],
    },
    {
      title: 'Site Builder',
      emoji: '🏗️',
      items: [
        { id: 'site_builder', label: 'Site Builder', icon: LayoutDashboard, color: '#6366f1' },
        { id: 'agents_page', label: 'Agents Page', icon: Bot, color: '#00ff41' },
        { id: 'design_assets', label: 'Design Assets', icon: Palette, color: '#14b8a6' },
      ],
    },
  ];

  // Check if any item in a group is active
  const isGroupActive = (group: NavGroup) => group.items.some(item => item.id === activeNavSection);

  return (
    <div className="w-64 bg-[#0c0d14] border-r border-gray-800/60 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800/60">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-xl">m</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-base">Admin Panel</h1>
            <p className="text-gray-500 text-xs">AI Work Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-auto scrollbar-thin">
        {/* Dashboard link */}
        <button
          onClick={() => onSelectNavSection(null)}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl mb-3 transition-all ${
            activeNavSection === null
              ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white shadow-sm shadow-indigo-500/10 border border-indigo-500/20'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold text-[15px]">Dashboard</span>
        </button>

        {/* Nav Groups */}
        {navGroups.map(group => {
          const isCollapsed = collapsedGroups.has(group.title);
          const groupActive = isGroupActive(group);
          
          return (
            <div key={group.title} className="mb-1">
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3.5 py-2 mt-4 mb-1.5 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{group.emoji}</span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    groupActive ? 'text-gray-300' : 'text-gray-600'
                  } group-hover:text-gray-400 transition-colors`}>
                    {group.title}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-700 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const isActive = activeNavSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectNavSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? 'bg-white/8 text-white'
                            : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            isActive ? 'scale-105' : ''
                          }`}
                          style={{ backgroundColor: isActive ? `${item.color}25` : `${item.color}10` }}
                        >
                          <item.icon 
                            className="w-[18px] h-[18px]" 
                            style={{ color: isActive ? item.color : undefined }} 
                          />
                        </div>
                        <span className="flex-1 text-left text-sm truncate">{item.label}</span>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800/60">
        <button
          onClick={() => window.open(window.location.origin, '_blank')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-gray-300 text-xs transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Live Site
        </button>
      </div>
    </div>
  );
}
