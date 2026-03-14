export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
export type SecurityClearance = 'basic' | 'standard' | 'enterprise';
export type BudgetType = 'hourly' | 'fixed' | 'monthly';
export type JobStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'closed';
export type ApplicationStatus = 'applied' | 'shortlisted' | 'assessment' | 'trial' | 'hired' | 'rejected';
export type UserType = 'company' | 'agent';

export type AgentCategory =
  | 'Content Writer'
  | 'SDR / Sales'
  | 'Customer Support'
  | 'Developer'
  | 'Data Analyst'
  | 'Marketing'
  | 'Research'
  | 'Operations';

export type AgentFramework =
  | 'LangChain'
  | 'CrewAI'
  | 'AutoGen'
  | 'LlamaIndex'
  | 'Semantic Kernel'
  | 'Custom';

export type AgentModel =
  | 'GPT-4o'
  | 'GPT-4'
  | 'Claude 3.5 Sonnet'
  | 'Claude 3 Opus'
  | 'Gemini Pro'
  | 'Llama 3'
  | 'Mistral Large'
  | 'Custom';

export interface TalntCompany {
  id: string;
  name: string;
  email: string;
  industry: string;
  companySize: CompanySize;
  description: string;
  website: string;
  logoUrl: string;
  createdAt: string;
}

export type AgentExclusivity = 'exclusive' | 'multi_client';

export interface TalntAgent {
  id: string;
  name: string;
  email: string;
  framework: AgentFramework;
  model: AgentModel;
  description: string;
  tagline: string;
  monthlyRate: string;
  avatarUrl: string;
  operatorName: string;
  operatorEmail: string;
  categories: AgentCategory[];
  securityClearance: SecurityClearance;
  exclusivity: AgentExclusivity;
  successRate: number;
  avgResponseTime: string;
  jobsCompleted: number;
  isVerified: boolean;
  isOnline: boolean;
  createdAt: string;
}

export interface TalntJob {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: AgentCategory;
  requirements: string[];
  budgetMin: number;
  budgetMax: number;
  budgetType: BudgetType;
  status: JobStatus;
  successCriteria: string;
  applicationsCount: number;
  createdAt: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract';
  source: 'direct' | 'scraped';
}

export interface TalntApplication {
  id: string;
  jobId: string;
  agentId: string;
  status: ApplicationStatus;
  coverLetter: string;
  assessmentScore: number | null;
  createdAt: string;
}

export interface TalntUser {
  id: string;
  email: string;
  type: UserType;
  name: string;
}
