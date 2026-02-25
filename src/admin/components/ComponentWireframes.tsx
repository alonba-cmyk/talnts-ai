import React from 'react';

export function ComponentWireframe({ componentType }: { componentType: string }) {
  const base = "w-full h-full rounded overflow-hidden relative";

  switch (componentType) {
    case 'hero':
      return (
        <div className={`${base} bg-gradient-to-b from-gray-900 to-indigo-950`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
            <div className="w-6 h-1.5 bg-indigo-500/40 rounded mb-1.5" />
            <div className="w-16 h-1 bg-white/30 rounded mb-0.5" />
            <div className="w-12 h-1 bg-indigo-400/50 rounded mb-2" />
            <div className="w-8 h-2 bg-indigo-600/60 rounded-sm" />
          </div>
        </div>
      );
    case 'hero_alternative':
      return (
        <div className={`${base} bg-white`}>
          <div className="absolute inset-0 flex items-center p-3 gap-2">
            <div className="flex-1 space-y-1">
              <div className="w-12 h-1 bg-gray-300 rounded" />
              <div className="w-10 h-1 bg-purple-300 rounded" />
              <div className="w-6 h-1.5 bg-purple-400 rounded-sm mt-1.5" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-4 h-5 bg-gray-200 rounded-sm" />
              <div className="w-4 h-5 bg-purple-100 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'hero_outcome_cards':
      return (
        <div className={`${base} bg-white`}>
          <div className="absolute inset-0 p-2">
            <div className="w-12 h-1 bg-purple-300 rounded mx-auto mb-1.5" />
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-purple-100 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      );
    case 'work_comparison':
      return (
        <div className={`${base} flex`}>
          <div className="flex-1 bg-gray-100 p-1.5">
            <div className="w-8 h-0.5 bg-gray-300 rounded mb-1" />
            <div className="space-y-0.5">
              <div className="h-1.5 bg-gray-200 rounded-sm" />
              <div className="h-1.5 bg-gray-200 rounded-sm" />
            </div>
          </div>
          <div className="flex-1 bg-gray-900 p-1.5">
            <div className="w-8 h-0.5 bg-gray-600 rounded mb-1" />
            <div className="space-y-0.5">
              <div className="h-1.5 bg-indigo-800 rounded-sm" />
              <div className="h-1.5 bg-indigo-800 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'sidekick_capabilities':
      return (
        <div className={`${base} bg-gradient-to-br from-gray-900 to-gray-800`}>
          <div className="absolute inset-0 flex items-center p-2 gap-2">
            <div className="flex-1 space-y-1">
              <div className="w-10 h-0.5 bg-amber-400/50 rounded" />
              <div className="flex gap-0.5">
                <div className="w-5 h-2 bg-gray-700 rounded-sm" />
                <div className="w-5 h-2 bg-gray-700 rounded-sm" />
              </div>
            </div>
            <div className="w-10 h-8 bg-gray-700 rounded border border-gray-600" />
          </div>
        </div>
      );
    case 'sidekick':
      return (
        <div className={`${base} bg-gradient-to-br from-gray-900 to-orange-950`}>
          <div className="absolute inset-0 flex items-center p-2 gap-2">
            <div className="flex-1 space-y-1">
              <div className="w-10 h-0.5 bg-orange-400/50 rounded" />
              <div className="h-3 bg-gray-800 rounded border border-gray-700 p-0.5">
                <div className="w-6 h-0.5 bg-orange-500/30 rounded" />
              </div>
            </div>
            <div className="w-12 h-9 bg-gray-800 rounded border border-gray-700 p-1 space-y-0.5">
              <div className="h-1 bg-gray-700 rounded-sm" />
              <div className="h-1 bg-gray-700 rounded-sm" />
              <div className="h-1 bg-orange-800/50 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'departments':
      return (
        <div className={`${base} bg-gray-950`}>
          <div className="absolute inset-0 p-2">
            <div className="flex gap-1 mb-1.5">
              <div className="w-5 h-1.5 bg-blue-600 rounded-sm" />
              <div className="w-5 h-1.5 bg-gray-700 rounded-sm" />
              <div className="w-5 h-1.5 bg-gray-700 rounded-sm" />
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 h-5 bg-gray-800 rounded-sm p-0.5">
                  <div className="w-2 h-2 bg-blue-500/30 rounded-full mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'ai_platform':
      return (
        <div className={`${base} bg-gray-950 flex`}>
          <div className="w-5 bg-gray-900 border-r border-gray-800 p-0.5 space-y-0.5">
            <div className="w-full h-1.5 bg-indigo-800 rounded-sm" />
            <div className="w-full h-1.5 bg-gray-800 rounded-sm" />
            <div className="w-full h-1.5 bg-gray-800 rounded-sm" />
          </div>
          <div className="flex-1 p-1.5 space-y-1">
            <div className="flex gap-0.5">
              <div className="w-4 h-1 bg-indigo-700 rounded-sm" />
              <div className="w-4 h-1 bg-gray-700 rounded-sm" />
            </div>
            <div className="h-5 bg-gray-800 rounded border border-gray-700" />
          </div>
        </div>
      );
    case 'project_management':
      return (
        <div className={`${base} bg-gray-950`}>
          <div className="absolute inset-0 p-2 space-y-0.5">
            <div className="h-2 bg-emerald-900/40 rounded-sm border border-emerald-800/30 flex items-center px-0.5">
              <div className="w-3 h-0.5 bg-emerald-500/40 rounded" />
            </div>
            <div className="h-2 bg-blue-900/30 rounded-sm border border-blue-800/30" />
            <div className="h-2 bg-purple-900/30 rounded-sm border border-purple-800/30" />
            <div className="h-2 bg-pink-900/30 rounded-sm border border-pink-800/30" />
          </div>
        </div>
      );
    case 'agents_showcase':
      return (
        <div className={`${base} bg-gradient-to-br from-cyan-950 to-gray-900`}>
          <div className="absolute inset-0 p-2">
            <div className="w-10 h-0.5 bg-cyan-400/50 rounded mb-1.5 mx-auto" />
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-cyan-900/40 rounded-sm border border-cyan-800/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-cyan-500/30 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'teams_and_agents':
      return (
        <div className={`${base} bg-gradient-to-b from-gray-900 to-purple-950`}>
          <div className="absolute inset-0 p-2 flex flex-col items-center">
            <div className="w-10 h-0.5 bg-purple-400/50 rounded mb-2" />
            <div className="flex gap-1 items-end">
              <div className="w-3 h-4 bg-purple-800/50 rounded-sm" />
              <div className="w-4 h-5 bg-purple-700/50 rounded-sm" />
              <div className="w-3 h-4 bg-purple-800/50 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'teams_and_agents_v2':
      return (
        <div className={`${base} bg-gradient-to-b from-gray-900 to-violet-950`}>
          <div className="absolute inset-0 p-2">
            <div className="flex gap-1 mb-1.5">
              <div className="w-5 h-1 bg-violet-600 rounded-sm" />
              <div className="w-5 h-1 bg-gray-700 rounded-sm" />
            </div>
            <div className="flex gap-1">
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-4 h-4 bg-violet-800/50 rounded-full" />
                <div className="w-3 h-0.5 bg-violet-500/30 rounded" />
              </div>
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-4 h-4 bg-violet-800/50 rounded-full" />
                <div className="w-3 h-0.5 bg-violet-500/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'ai_platform_architecture':
      return (
        <div className={`${base} bg-gray-950`}>
          <div className="absolute inset-0 p-1.5">
            <div className="h-full bg-gray-900 rounded border border-gray-700 p-1 flex flex-col">
              <div className="flex gap-0.5 mb-1">
                <div className="w-1 h-1 bg-red-500/60 rounded-full" />
                <div className="w-1 h-1 bg-yellow-500/60 rounded-full" />
                <div className="w-1 h-1 bg-green-500/60 rounded-full" />
              </div>
              <div className="flex-1 flex gap-1">
                <div className="w-4 bg-gray-800 rounded-sm" />
                <div className="flex-1 bg-gray-800 rounded-sm p-0.5">
                  <div className="w-full h-0.5 bg-teal-500/30 rounded mb-0.5" />
                  <div className="w-3/4 h-0.5 bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 'team_commands':
      return (
        <div className={`${base} bg-gradient-to-br from-gray-900 to-red-950`}>
          <div className="absolute inset-0 flex items-center p-2 gap-2">
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-0.5">
                <div className="w-2 h-2 bg-red-500/30 rounded-full" />
                <div className="w-8 h-1.5 bg-gray-800 rounded border border-gray-700" />
              </div>
              <div className="flex items-center gap-0.5 justify-end">
                <div className="w-6 h-1.5 bg-red-900/40 rounded border border-red-800/30" />
                <div className="w-2 h-2 bg-blue-500/30 rounded-full" />
              </div>
            </div>
            <div className="w-10 h-8 bg-gray-800 rounded border border-gray-700 p-0.5 space-y-0.5">
              <div className="h-1 bg-gray-700 rounded-sm" />
              <div className="h-1 bg-gray-700 rounded-sm" />
              <div className="h-1 bg-red-800/40 rounded-sm" />
            </div>
          </div>
        </div>
      );
    case 'platform_hero':
      return (
        <div className={`${base} bg-white`}>
          <div className="absolute inset-0 flex flex-col items-center p-2">
            <div className="w-full h-1 bg-gradient-to-r from-gray-100 via-indigo-100 to-gray-100 rounded mb-2" />
            <div className="w-14 h-1.5 bg-gray-300 rounded mb-1.5" />
            <div className="w-10 h-1 bg-gray-200 rounded mb-2" />
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-indigo-200 rounded" />
              <div className="w-3 h-3 bg-purple-200 rounded" />
              <div className="w-3 h-3 bg-cyan-200 rounded" />
              <div className="w-3 h-3 bg-amber-200 rounded" />
            </div>
          </div>
        </div>
      );
    case 'department_bar':
      return (
        <div className={`${base} bg-white`}>
          <div className="absolute inset-0 flex items-center justify-center p-2 gap-1">
            <div className="w-6 h-1.5 bg-indigo-600 rounded-full" />
            <div className="w-6 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-5 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-5 h-1.5 bg-gray-200 rounded-full" />
          </div>
        </div>
      );
    case 'jtbd_workspace':
      return (
        <div className={`${base} bg-white flex`}>
          <div className="w-4 bg-gray-50 border-r border-gray-200 p-0.5 space-y-0.5">
            <div className="w-full h-1 bg-indigo-200 rounded-sm" />
            <div className="w-full h-1 bg-gray-200 rounded-sm" />
            <div className="w-full h-1 bg-gray-200 rounded-sm" />
            <div className="w-full h-1 bg-gray-200 rounded-sm" />
          </div>
          <div className="flex-1 p-1.5 space-y-0.5">
            <div className="h-1.5 bg-gray-200 rounded-sm" />
            <div className="h-1.5 bg-gray-200 rounded-sm" />
            <div className="h-1.5 bg-indigo-100 rounded-sm" />
            <div className="h-1.5 bg-gray-200 rounded-sm" />
          </div>
        </div>
      );
    case 'platform_showcase':
      return (
        <div className={`${base} bg-white`}>
          <div className="absolute inset-0 p-2">
            <div className="flex gap-1 mb-1.5">
              <div className="w-5 h-1.5 bg-indigo-500 rounded-sm" />
              <div className="w-5 h-1.5 bg-gray-200 rounded-sm" />
              <div className="w-5 h-1.5 bg-gray-200 rounded-sm" />
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-100 rounded-sm border border-gray-200" />
              ))}
            </div>
          </div>
        </div>
      );
    case 'platform_architecture_layer':
      return (
        <div className={`${base} bg-white`}>
          <div className="absolute inset-0 p-2 space-y-0.5">
            <div className="h-1.5 bg-slate-200 rounded-sm flex items-center px-1">
              <div className="w-2 h-0.5 bg-slate-500/50 rounded" />
            </div>
            <div className="h-1.5 bg-blue-100 rounded-sm flex items-center px-1">
              <div className="w-2 h-0.5 bg-blue-500/50 rounded" />
            </div>
            <div className="h-1.5 bg-purple-100 rounded-sm flex items-center px-1">
              <div className="w-2 h-0.5 bg-purple-500/50 rounded" />
            </div>
            <div className="h-1.5 bg-amber-100 rounded-sm flex items-center px-1">
              <div className="w-2 h-0.5 bg-amber-500/50 rounded" />
            </div>
          </div>
        </div>
      );
    case 'use_cases_showcase':
      return (
        <div className={`${base} bg-gray-50`}>
          <div className="absolute inset-0 p-1.5">
            <div className="w-12 h-0.5 bg-purple-300 rounded mx-auto mb-0.5" />
            <div className="w-8 h-0.5 bg-gray-200 rounded mx-auto mb-1" />
            <div className="grid grid-cols-4 gap-0.5 h-[calc(100%-12px)]">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded border border-gray-200 p-0.5 flex flex-col">
                  <div className="w-3 h-0.5 bg-purple-200 rounded-full mb-0.5" />
                  <div className="w-full h-0.5 bg-gray-100 rounded mb-0.5" />
                  <div className="mt-auto w-4 h-0.5 bg-purple-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'department_agents_showcase':
      return (
        <div className={`${base} bg-gray-50`}>
          <div className="absolute inset-0 p-1.5">
            <div className="w-10 h-0.5 bg-gray-300 rounded mx-auto mb-1" />
            <div className="grid grid-cols-3 gap-1 h-[calc(100%-8px)]">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-white rounded border border-gray-200 p-1 flex flex-col">
                  <div className="w-5 h-1 bg-cyan-200 rounded-full mb-1" />
                  <div className="flex gap-0.5 justify-center mb-0.5">
                    <div className="w-2.5 h-2.5 bg-cyan-100 rounded-sm" />
                    <div className="w-2.5 h-2.5 bg-cyan-100 rounded-sm" />
                  </div>
                  <div className="mt-auto w-4 h-0.5 bg-cyan-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    default:
      return <div className={`${base} bg-gray-800`} />;
  }
}
