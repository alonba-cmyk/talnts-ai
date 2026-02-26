export interface AICompany {
  id: string;
  name: string;
  logo: string;
  category: 'llm' | 'framework' | 'platform' | 'enterprise';
  color: string;
}

export const AI_COMPANIES: AICompany[] = [
  // LLM Providers
  { id: 'openai',      name: 'OpenAI',         logo: '/logos/openai.svg',      category: 'llm',        color: '#10A37F' },
  { id: 'anthropic',   name: 'Anthropic',      logo: '/logos/anthropic.svg',   category: 'llm',        color: '#D4A574' },
  { id: 'google',      name: 'Google AI',      logo: '/logos/google.svg',      category: 'llm',        color: '#4285F4' },
  { id: 'meta',        name: 'Meta AI',        logo: '/logos/meta.svg',        category: 'llm',        color: '#0668E1' },
  { id: 'mistral',     name: 'Mistral AI',     logo: '/logos/mistral.svg',     category: 'llm',        color: '#FF7000' },
  { id: 'cohere',      name: 'Cohere',         logo: '/logos/cohere.svg',      category: 'llm',        color: '#39594D' },
  { id: 'xai',         name: 'xAI',            logo: '/logos/xai.svg',         category: 'llm',        color: '#FFFFFF' },
  { id: 'deepseek',    name: 'DeepSeek',       logo: '/logos/deepseek.svg',    category: 'llm',        color: '#4D6BFE' },

  // Agent Frameworks
  { id: 'langchain',   name: 'LangChain',      logo: '/logos/langchain.svg',   category: 'framework',  color: '#1C3C3C' },
  { id: 'crewai',      name: 'CrewAI',         logo: '/logos/crewai.svg',      category: 'framework',  color: '#FF5A1F' },
  { id: 'autogpt',     name: 'AutoGPT',        logo: '/logos/autogpt.svg',     category: 'framework',  color: '#5B21B6' },
  { id: 'autogen',     name: 'AutoGen',        logo: '/logos/autogen.svg',     category: 'framework',  color: '#0078D4' },
  { id: 'llamaindex',  name: 'LlamaIndex',     logo: '/logos/llamaindex.svg',  category: 'framework',  color: '#A855F7' },
  { id: 'semantic',    name: 'Semantic Kernel', logo: '/logos/semantic.svg',    category: 'framework',  color: '#5C2D91' },
  { id: 'superagi',    name: 'SuperAGI',       logo: '/logos/superagi.svg',    category: 'framework',  color: '#3B82F6' },
  { id: 'haystack',    name: 'Haystack',       logo: '/logos/haystack.svg',    category: 'framework',  color: '#00C98D' },

  // Platforms
  { id: 'huggingface', name: 'Hugging Face',   logo: '/logos/huggingface.svg', category: 'platform',   color: '#FFD21E' },
  { id: 'replicate',   name: 'Replicate',      logo: '/logos/replicate.svg',   category: 'platform',   color: '#FFFFFF' },
  { id: 'together',    name: 'Together AI',    logo: '/logos/together.svg',    category: 'platform',   color: '#0EA5E9' },
  { id: 'perplexity',  name: 'Perplexity',     logo: '/logos/perplexity.svg',  category: 'platform',   color: '#20808D' },
  { id: 'vercelai',    name: 'Vercel AI',      logo: '/logos/vercelai.svg',    category: 'platform',   color: '#FFFFFF' },
  { id: 'relevance',   name: 'Relevance AI',   logo: '/logos/relevance.svg',   category: 'platform',   color: '#6366F1' },
  { id: 'fixie',       name: 'Fixie.ai',       logo: '/logos/fixie.svg',       category: 'platform',   color: '#7C3AED' },
  { id: 'modal',       name: 'Modal',          logo: '/logos/modal.svg',       category: 'platform',   color: '#00D26A' },
  { id: 'anyscale',    name: 'Anyscale',       logo: '/logos/anyscale.svg',    category: 'platform',   color: '#00A1E0' },

  // Enterprise
  { id: 'microsoft',   name: 'Microsoft',      logo: '/logos/microsoft.svg',   category: 'enterprise', color: '#00A4EF' },
  { id: 'salesforce',  name: 'Salesforce',     logo: '/logos/salesforce.svg',  category: 'enterprise', color: '#00A1E0' },
  { id: 'ibm',         name: 'IBM watsonx',    logo: '/logos/ibm.svg',         category: 'enterprise', color: '#0F62FE' },
  { id: 'amazon',      name: 'AWS Bedrock',    logo: '/logos/amazon.svg',      category: 'enterprise', color: '#FF9900' },
  { id: 'nvidia',      name: 'NVIDIA',         logo: '/logos/nvidia.svg',      category: 'enterprise', color: '#76B900' },
  { id: 'oracle',      name: 'Oracle AI',      logo: '/logos/oracle.svg',      category: 'enterprise', color: '#F80000' },
  { id: 'snowflake',   name: 'Snowflake',      logo: '/logos/snowflake.svg',   category: 'enterprise', color: '#29B5E8' },
  { id: 'databricks',  name: 'Databricks',     logo: '/logos/databricks.svg',  category: 'enterprise', color: '#FF3621' },
];

export const CATEGORY_LABELS: Record<AICompany['category'], string> = {
  llm: 'LLM Provider',
  framework: 'Agent Framework',
  platform: 'AI Platform',
  enterprise: 'Enterprise AI',
};
