import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAgentSearch } from './AgentSearchContext';
import type { AgentCategory } from './types';

export default function BrowseAgentsPage() {
  const { openSearch, isOpen } = useAgentSearch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasOpened = useRef(false);

  useEffect(() => {
    if (!isOpen && !hasOpened.current) {
      const category = (searchParams.get('category') || undefined) as AgentCategory | undefined;
      openSearch({ category });
      hasOpened.current = true;
    }
  }, []);

  useEffect(() => {
    if (hasOpened.current && !isOpen) {
      navigate('/talnt', { replace: true });
    }
  }, [isOpen, navigate]);

  return null;
}
