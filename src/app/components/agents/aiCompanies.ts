export interface AICompany {
  id: string;
  name: string;
  logo: string;
  category: 'llm' | 'framework' | 'platform' | 'enterprise';
  color: string;
}

export const AI_COMPANIES: AICompany[] = [
  // LLM Providers — the "brains" behind agents
  { id: 'openai',      name: 'OpenAI',         logo: '/logos/openai.png',      category: 'llm',        color: '#10A37F' },
  { id: 'anthropic',   name: 'Anthropic',      logo: '/logos/anthropic.png',   category: 'llm',        color: '#D4A574' },
  { id: 'google',      name: 'Google AI',      logo: '/logos/google.svg',      category: 'llm',        color: '#4285F4' },
  { id: 'meta',        name: 'Meta AI',        logo: '/logos/meta.svg',        category: 'llm',        color: '#0668E1' },
  { id: 'mistral',     name: 'Mistral AI',     logo: '/logos/mistral.png',     category: 'llm',        color: '#FF7000' },
  { id: 'cohere',      name: 'Cohere',         logo: '/logos/cohere.png',      category: 'llm',        color: '#39594D' },
  { id: 'xai',         name: 'xAI',            logo: '/logos/xai.svg',         category: 'llm',        color: '#FFFFFF' },
  { id: 'deepseek',    name: 'DeepSeek',       logo: '/logos/deepseek.png',    category: 'llm',        color: '#4D6BFE' },

  // Agent Frameworks — where agents are built
  { id: 'langchain',   name: 'LangChain',      logo: '/logos/langchain.png',   category: 'framework',  color: '#1C3C3C' },
  { id: 'crewai',      name: 'CrewAI',         logo: '/logos/crewai.png',      category: 'framework',  color: '#FF5A1F' },
  { id: 'autogpt',     name: 'AutoGPT',        logo: '/logos/autogpt.svg',     category: 'framework',  color: '#5B21B6' },
  { id: 'autogen',     name: 'AutoGen',        logo: '/logos/autogen.png',     category: 'framework',  color: '#0078D4' },
  { id: 'llamaindex',  name: 'LlamaIndex',     logo: '/logos/llamaindex.png',  category: 'framework',  color: '#A855F7' },
  { id: 'semantic',    name: 'Semantic Kernel', logo: '/logos/semantic.png',    category: 'framework',  color: '#5C2D91' },
  { id: 'superagi',    name: 'SuperAGI',       logo: '/logos/superagi.png',    category: 'framework',  color: '#3B82F6' },
  { id: 'haystack',    name: 'Haystack',       logo: '/logos/haystack.png',    category: 'framework',  color: '#00C98D' },
  { id: 'phidata',     name: 'Phidata',        logo: '/logos/phidata.svg',     category: 'framework',  color: '#6366F1' },

  // Protocols & Skills — how agents connect
  { id: 'mcp',         name: 'MCP',            logo: '/logos/mcp.svg',         category: 'platform',   color: '#00D2D2' },
  { id: 'openclaw',    name: 'OpenClaw',       logo: '/logos/openclaw.svg',    category: 'platform',   color: '#FF6B35' },

  // Developer Tools — IDE-native agents
  { id: 'cursor',      name: 'Cursor',         logo: '/logos/cursor.svg',      category: 'platform',   color: '#7C3AED' },

  // Agent Platforms & Tooling — where agents are orchestrated
  { id: 'huggingface', name: 'Hugging Face',   logo: '/logos/huggingface.svg', category: 'platform',   color: '#FFD21E' },
  { id: 'n8n',         name: 'n8n',            logo: '/logos/n8n.svg',         category: 'platform',   color: '#EA4B71' },
  { id: 'make',        name: 'Make',           logo: '/logos/make.svg',        category: 'platform',   color: '#6D00CC' },
  { id: 'dify',        name: 'Dify',           logo: '/logos/dify.svg',        category: 'platform',   color: '#1570EF' },
  { id: 'flowise',     name: 'Flowise',        logo: '/logos/flowise.svg',     category: 'platform',   color: '#5B5FC7' },
  { id: 'composio',    name: 'Composio',       logo: '/logos/composio.svg',    category: 'platform',   color: '#FF6B35' },
  { id: 'e2b',         name: 'E2B',            logo: '/logos/e2b.svg',         category: 'platform',   color: '#FF8800' },
  { id: 'browserbase', name: 'Browserbase',    logo: '/logos/browserbase.svg', category: 'platform',   color: '#7C3AED' },
  { id: 'toolhouse',   name: 'Toolhouse',      logo: '/logos/toolhouse.svg',   category: 'platform',   color: '#10B981' },
  { id: 'agentops',    name: 'AgentOps',       logo: '/logos/agentops.svg',    category: 'platform',   color: '#00D2D2' },
  { id: 'vercelai',    name: 'Vercel AI',      logo: '/logos/vercelai.svg',    category: 'platform',   color: '#FFFFFF' },

  // Enterprise AI — agents at scale
  { id: 'microsoft',   name: 'Microsoft',      logo: '/logos/microsoft.svg',   category: 'enterprise', color: '#00A4EF' },
  { id: 'amazon',      name: 'AWS Bedrock',    logo: '/logos/amazon.svg',      category: 'enterprise', color: '#FF9900' },
  { id: 'nvidia',      name: 'NVIDIA',         logo: '/logos/nvidia.svg',      category: 'enterprise', color: '#76B900' },
];

export const CATEGORY_LABELS: Record<AICompany['category'], string> = {
  llm: 'LLM Provider',
  framework: 'Agent Framework',
  platform: 'AI Platform',
  enterprise: 'Enterprise AI',
};
