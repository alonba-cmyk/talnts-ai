import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAgentSearch } from './AgentSearchContext';
import type { AgentCategory } from './types';

export default function BrowseAgentsPage() {
  const { openSearch, isOpen } = useAgentSearch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!isOpen) {
      const category = (searchParams.get('category') || undefined) as AgentCategory | undefined;
      openSearch({ category });
    }
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
      <button
        onClick={() => openSearch()}
        className="flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02] cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)' }}
      >
        Open Agent Search
      </button>
    </div>
  );
}
