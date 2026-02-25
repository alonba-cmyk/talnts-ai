import React, { useState, useMemo } from 'react';
import { ChevronDown, ExternalLink, Settings, Home, Monitor, Eye } from 'lucide-react';
import { getComponentsGroupedByCategory } from '@/admin/componentRegistry';
import { ComponentWireframe } from './ComponentWireframes';
import { usePageComponents } from '@/hooks/useSupabase';

export interface ComponentBankViewProps {
  onSelectComponent?: (componentType: string) => void;
}

export function ComponentBankView({ onSelectComponent }: ComponentBankViewProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const homepageComponents = usePageComponents('homepage');
  const platformComponents = usePageComponents('platform');

  const homepageTypes = useMemo(
    () => new Set((homepageComponents.components || []).map((c) => c.component_type)),
    [homepageComponents.components]
  );
  const platformTypes = useMemo(
    () => new Set((platformComponents.components || []).map((c) => c.component_type)),
    [platformComponents.components]
  );

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const grouped = getComponentsGroupedByCategory();

  return (
    <div className="space-y-4">
      {grouped.map(({ category, meta, components }) => {
        const isCollapsed = collapsedCategories.has(category);
        const color = meta.color;

        return (
          <div
            key={category}
            className="rounded-lg overflow-hidden border border-gray-700/50 bg-gray-900/50"
          >
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-800/60"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <span
                className="flex-shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-semibold text-white flex-1">{meta.label}</span>
              <span className="text-sm text-gray-400">
                {components.length} {components.length === 1 ? 'component' : 'components'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
              />
            </button>

            {!isCollapsed && (
              <div className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  {components.map((comp) => {
                    const usedOnHomepage = homepageTypes.has(comp.type);
                    const usedOnPlatform = platformTypes.has(comp.type);
                    const hasPreview = !!comp.previewRoute;

                    return (
                      <div
                        key={comp.type}
                        role={onSelectComponent ? 'button' : undefined}
                        tabIndex={onSelectComponent ? 0 : undefined}
                        onClick={() => onSelectComponent?.(comp.type)}
                        onKeyDown={(e) => {
                          if (onSelectComponent && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            onSelectComponent(comp.type);
                          }
                        }}
                        className={`
                          flex gap-3 p-3 rounded-lg border border-gray-700/50
                          bg-gray-800/40 hover:bg-gray-800/70 hover:border-gray-600/50
                          ${onSelectComponent ? 'cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500' : ''}
                        `}
                      >
                        <div className="flex-shrink-0 w-[120px] h-[80px] rounded overflow-hidden bg-gray-900">
                          <ComponentWireframe componentType={comp.type} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">{comp.name}</div>
                          <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
                            {comp.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span
                              className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${color}20`,
                                color: color,
                              }}
                            >
                              {meta.label}
                            </span>

                            <div className="flex items-center gap-1.5 text-gray-500" title="Page usage">
                              {usedOnHomepage && (
                                <Home
                                  className="w-3.5 h-3.5 text-amber-500/80"
                                  title="Used on homepage"
                                />
                              )}
                              {usedOnPlatform && (
                                <Monitor
                                  className="w-3.5 h-3.5 text-teal-500/80"
                                  title="Used on platform page"
                                />
                              )}
                              {comp.hasSettings && (
                                <Settings
                                  className="w-3.5 h-3.5 text-gray-500"
                                  title="Has settings"
                                />
                              )}
                            </div>
                          </div>

                          {hasPreview && (
                            <a
                              href={comp.previewRoute}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-xs bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Live Preview
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
