import { useState, useCallback, useMemo, useEffect } from 'react';
import { MOCK_COMPANIES, MOCK_AGENTS, MOCK_JOBS, MOCK_APPLICATIONS } from './mockData';
import type {
  TalntCompany, TalntAgent, TalntJob, TalntApplication,
  AgentCategory, AgentFramework, SecurityClearance, JobStatus,
  AgentExclusivity,
} from './types';

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useCompanies() {
  const [companies, setCompanies] = useState<TalntCompany[]>(() =>
    loadFromStorage('talnt_companies', MOCK_COMPANIES)
  );

  useEffect(() => saveToStorage('talnt_companies', companies), [companies]);

  const getCompany = useCallback((id: string) =>
    companies.find(c => c.id === id) ?? null
  , [companies]);

  return { companies, getCompany, setCompanies };
}

export function useAgents() {
  const [agents, setAgents] = useState<TalntAgent[]>(() => {
    const stored = loadFromStorage<TalntAgent>('talnt_agents', MOCK_AGENTS);
    // Merge stored agents with fresh mock data so new fields are always present
    return stored.map(stored => {
      const fresh = MOCK_AGENTS.find(m => m.id === stored.id);
      return fresh ? { ...fresh, ...stored } : stored;
    });
  });

  useEffect(() => saveToStorage('talnt_agents', agents), [agents]);

  const getAgent = useCallback((id: string) =>
    agents.find(a => a.id === id) ?? null
  , [agents]);

  const filterAgents = useCallback((filters: {
    category?: AgentCategory;
    framework?: AgentFramework;
    clearance?: SecurityClearance;
    exclusivity?: AgentExclusivity;
    availableOnly?: boolean;
    verifiedOnly?: boolean;
    minRating?: number;
    priceRange?: string;
    search?: string;
  }) => {
    return agents.filter(a => {
      if (filters.category && !a.categories.includes(filters.category)) return false;
      if (filters.framework && a.framework !== filters.framework) return false;
      if (filters.clearance && a.securityClearance !== filters.clearance) return false;
      if (filters.exclusivity && a.exclusivity !== filters.exclusivity) return false;
      if (filters.availableOnly && !a.isOnline) return false;
      if (filters.verifiedOnly && !a.isVerified) return false;
      if (filters.minRating) {
        const rating = a.successRate / 20;
        if (rating < filters.minRating) return false;
      }
      if (filters.priceRange) {
        const num = parseInt(a.monthlyRate.replace(/[^0-9]/g, ''), 10) || 0;
        switch (filters.priceRange) {
          case '0-1000': if (num > 1000) return false; break;
          case '1000-3000': if (num < 1000 || num > 3000) return false; break;
          case '3000-5000': if (num < 3000 || num > 5000) return false; break;
          case '5000+': if (num < 5000) return false; break;
        }
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.categories.some(c => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [agents]);

  return { agents, getAgent, filterAgents, setAgents };
}

export function useJobs() {
  const [jobs, setJobs] = useState<TalntJob[]>(() =>
    loadFromStorage('talnt_jobs', MOCK_JOBS)
  );

  useEffect(() => saveToStorage('talnt_jobs', jobs), [jobs]);

  const getJob = useCallback((id: string) =>
    jobs.find(j => j.id === id) ?? null
  , [jobs]);

  const filterJobs = useCallback((filters: {
    category?: AgentCategory;
    status?: JobStatus;
    budgetMin?: number;
    budgetMax?: number;
    search?: string;
    companyId?: string;
  }) => {
    return jobs.filter(j => {
      if (filters.category && j.category !== filters.category) return false;
      if (filters.status && j.status !== filters.status) return false;
      if (filters.companyId && j.companyId !== filters.companyId) return false;
      if (filters.budgetMin && j.budgetMax < filters.budgetMin) return false;
      if (filters.budgetMax && j.budgetMin > filters.budgetMax) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [jobs]);

  const addJob = useCallback((job: Omit<TalntJob, 'id' | 'createdAt' | 'applicationsCount'>) => {
    const newJob: TalntJob = {
      ...job,
      id: `j_${Date.now()}`,
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  }, []);

  return { jobs, getJob, filterJobs, addJob, setJobs };
}

export function useApplications() {
  const [applications, setApplications] = useState<TalntApplication[]>(() =>
    loadFromStorage('talnt_applications', MOCK_APPLICATIONS)
  );

  useEffect(() => saveToStorage('talnt_applications', applications), [applications]);

  const getApplicationsForJob = useCallback((jobId: string) =>
    applications.filter(a => a.jobId === jobId)
  , [applications]);

  const getApplicationsForAgent = useCallback((agentId: string) =>
    applications.filter(a => a.agentId === agentId)
  , [applications]);

  const hasApplied = useCallback((jobId: string, agentId: string) =>
    applications.some(a => a.jobId === jobId && a.agentId === agentId)
  , [applications]);

  const apply = useCallback((jobId: string, agentId: string, coverLetter: string) => {
    const newApp: TalntApplication = {
      id: `app_${Date.now()}`,
      jobId,
      agentId,
      status: 'applied',
      coverLetter,
      assessmentScore: null,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setApplications(prev => [...prev, newApp]);
    return newApp;
  }, []);

  const updateStatus = useCallback((appId: string, status: TalntApplication['status']) => {
    setApplications(prev =>
      prev.map(a => a.id === appId ? { ...a, status } : a)
    );
  }, []);

  return {
    applications,
    getApplicationsForJob,
    getApplicationsForAgent,
    hasApplied,
    apply,
    updateStatus,
    setApplications,
  };
}

export function useTalntStats() {
  return useMemo(() => ({
    totalAgents: MOCK_AGENTS.length * 35,
    totalJobs: MOCK_JOBS.length * 60,
    matchSuccess: 98.2,
    avgMatchTime: '< 2hrs',
  }), []);
}
