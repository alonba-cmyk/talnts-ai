// Migration script - Run with: node migrate-data.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fymyrxqjmnekcmrpvtju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bXlyeHFqbW5la2NtcnB2dGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDUyMzIsImV4cCI6MjA4NTI4MTIzMn0.B946RoSjn1S2636SbHs6n5J4bIHpAK4-f5qwljytitg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Existing data from App.tsx
const departmentData = {
  marketing: {
    products: [
      { 
        name: 'Work Management', 
        description: 'Manage all your marketing campaigns, content calendar, and team collaboration in one place',
        value: 'Align your team on priorities, track campaign progress in real-time, and never miss a deadline',
        use_cases: ['Campaign planning & execution', 'Content calendar management', 'Marketing team collaboration', 'Budget tracking & allocation', 'Creative asset management'],
        replaces_tools: [{ name: 'Asana', color: '#f06a6a' }, { name: 'CoSchedule', color: '#e07c5f' }]
      },
      { 
        name: 'CRM', 
        description: 'Connect marketing efforts directly to revenue with full visibility into the customer journey',
        value: 'Track lead quality, measure campaign ROI, and seamlessly hand off qualified leads to sales',
        use_cases: ['Lead scoring & qualification', 'Marketing attribution tracking', 'Customer journey mapping', 'Campaign ROI analysis', 'Marketing-to-sales handoff'],
        replaces_tools: [{ name: 'HubSpot Marketing Hub', color: '#FF7A59' }, { name: 'Marketo', color: '#5C4C9F' }, { name: 'Pardot', color: '#009EDB' }]
      },
      {
        name: 'Campaigns',
        description: 'Create, launch, and optimize multi-channel marketing campaigns with AI-powered automation',
        value: 'Drive 40% more engagement with personalized campaigns that adapt in real-time to audience behavior',
        use_cases: ['Multi-channel campaign orchestration', 'A/B testing & optimization', 'Audience segmentation', 'Email marketing automation', 'Campaign performance analytics'],
        replaces_tools: [{ name: 'Mailchimp', color: '#FFE01B' }, { name: 'Constant Contact', color: '#0076BE' }, { name: 'ActiveCampaign', color: '#356AE6' }]
      }
    ],
    agents: [
      { name: 'Translator', description: 'Translates marketing content across multiple languages while maintaining brand voice', value: 'Expand to global markets 10x faster with AI-powered localization' },
      { name: 'Market Researcher', description: 'Analyzes market trends, competitor activity, and customer insights', value: 'Stay ahead of the competition with AI-powered market intelligence' },
      { name: 'SEO Optimizer', description: 'Optimizes content for search engines and tracks keyword performance', value: 'Increase organic traffic by 50% with intelligent SEO recommendations' },
      { name: 'Social Media Manager', description: 'Schedules posts, analyzes engagement, and suggests optimal posting times', value: 'Boost social engagement with AI that knows when and what to post' },
      { name: 'Email Optimizer', description: 'A/B tests subject lines, optimizes send times, and personalizes content', value: 'Increase email open rates by 35% with smart optimization' },
      { name: 'Content Creator', description: 'AI-powered content generation for blogs, social media, and marketing campaigns', value: 'Create 10x more content without hiring additional writers' }
    ],
    vibe_apps: [
      { name: 'Social media calendar', value: 'Schedule and post content across social media platforms', icon: 'Calendar', replaces_tools: ['Hootsuite', 'Buffer', 'Sprout Social'] },
      { name: 'Customer segmentation app', value: 'Segment and target customers effectively', icon: 'Users', replaces_tools: ['HubSpot Marketing Hub', 'Marketo', 'Pardot'] },
      { name: 'Email Marketing Automation', value: 'Automate email campaigns and nurture leads', icon: 'Mail', replaces_tools: ['HubSpot Marketing Hub', 'Marketo', 'Pardot'] },
      { name: 'Content Calendar Management', value: 'Organize and schedule content for all channels', icon: 'Calendar', replaces_tools: ['CoSchedule', 'Trello', 'Asana'] },
      { name: 'Performance Analytics', value: 'Track campaign ROI and attribution across all channels', icon: 'BarChart', replaces_tools: ['Google Analytics', 'Mixpanel', 'Amplitude'] },
      { name: 'Content Generator', value: 'Generate blog posts, social content, and ad copy at scale', icon: 'Sparkles', replaces_tools: ['Copy.ai', 'Jasper', 'Writesonic'] }
    ],
    sidekick_actions: [
      { name: 'Generate campaign briefs', description: 'Create comprehensive campaign briefs from a simple prompt', value: 'Save 2+ hours per campaign with AI-generated briefs' },
      { name: 'Market Intelligence', description: 'Get real-time competitive analysis and market insights', value: 'Make data-driven decisions with instant market intelligence' },
      { name: 'Visual Creation', description: 'Generate on-brand visuals for any marketing channel', value: 'Create stunning visuals in seconds, not hours' },
      { name: 'Optimize ad headlines', description: 'AI suggests high-performing headline variations', value: 'Increase CTR with AI-optimized headlines' },
      { name: 'Analyze competitor campaigns', description: 'Compare your campaigns to competitor strategies', value: 'Stay ahead with competitive intelligence' }
    ]
  },
  sales: {
    products: [
      { name: 'CRM', description: 'Full-featured CRM with AI-powered lead scoring and pipeline management', value: 'Close 30% more deals with AI insights that prioritize your best opportunities', use_cases: ['Pipeline management', 'Lead scoring', 'Deal tracking', 'Sales forecasting'], replaces_tools: [{ name: 'Salesforce', color: '#00A1E0' }, { name: 'HubSpot CRM', color: '#FF7A59' }] },
      { name: 'Work Management', description: 'Coordinate sales activities and collaborate with your team', value: 'Keep your entire sales team aligned and focused on closing deals', use_cases: ['Sales activity tracking', 'Team coordination', 'Quote management'], replaces_tools: [{ name: 'Asana', color: '#f06a6a' }] }
    ],
    agents: [
      { name: 'Negotiation Assistant', description: 'Provides real-time negotiation strategies and pricing recommendations', value: 'Close better deals with AI-powered negotiation insights' },
      { name: 'Sales Forecaster', description: 'Predicts deal outcomes and revenue forecasts based on historical data', value: 'Achieve 90% forecast accuracy with predictive AI' },
      { name: 'Account Manager', description: 'Monitors account health, identifies upsell opportunities, and prevents churn', value: 'Increase account retention by 25% with proactive AI monitoring' },
      { name: 'Competitor Tracker', description: 'Monitors competitor pricing, features, and market positioning', value: 'Win more deals with real-time competitive intelligence' }
    ],
    vibe_apps: [
      { name: 'Lead Scoring', value: 'Automatically prioritize leads based on conversion likelihood', icon: 'Target', replaces_tools: ['Salesforce Pardot', 'HubSpot CRM', 'Drift'] },
      { name: 'Sales Pipeline Management', value: 'Track and manage the sales pipeline efficiently', icon: 'BarChart', replaces_tools: ['Salesforce', 'Pipedrive', 'Close'] },
      { name: 'Customer Interaction Tracking', value: 'Capture and analyze customer interactions', icon: 'MessageSquare', replaces_tools: ['Gong', 'Chorus', 'Salesforce'] },
      { name: 'Proposal Generator', value: 'Create customized sales proposals automatically', icon: 'FileText', replaces_tools: ['PandaDoc', 'Proposify', 'Qwilr'] }
    ],
    sidekick_actions: [
      { name: 'Score and prioritize leads', description: 'AI ranks leads by conversion probability', value: 'Focus on the hottest opportunities' },
      { name: 'Predict customer churn', description: 'Identify at-risk accounts before they leave', value: 'Prevent churn with early warning signals' },
      { name: 'Generate sales proposals', description: 'Create customized proposals in seconds', value: 'Close deals faster with instant proposals' },
      { name: 'Recommend next actions', description: 'AI suggests the best next step for each deal', value: 'Never wonder what to do next' }
    ]
  },
  operations: {
    products: [
      { name: 'Work Management', description: 'Comprehensive project and portfolio management for operations teams', value: 'Increase operational efficiency by 40% with centralized workflows', use_cases: ['Project tracking', 'Resource allocation', 'Process automation'], replaces_tools: [{ name: 'Asana', color: '#f06a6a' }, { name: 'Monday.com', color: '#6161ff' }] }
    ],
    agents: [
      { name: 'Capacity Planner', description: 'Optimizes resource allocation and predicts capacity needs', value: 'Maximize team utilization with intelligent capacity planning' },
      { name: 'Risk Detector', description: 'Identifies project risks and suggests mitigation strategies', value: 'Prevent project delays with proactive risk detection' },
      { name: 'Workflow Designer', description: 'Creates and optimizes automated workflows based on best practices', value: 'Build better processes with AI-recommended workflow templates' },
      { name: 'Vendor Manager', description: 'Manages vendor relationships, contracts, and performance', value: 'Optimize vendor spend and improve service quality' }
    ],
    vibe_apps: [
      { name: 'Project Management', value: 'Plan, track, and manage projects efficiently', icon: 'FolderKanban', replaces_tools: ['Asana', 'Trello', 'Basecamp'] },
      { name: 'Workflow Automation', value: 'Automate repetitive tasks and workflows', icon: 'Workflow', replaces_tools: ['Zapier', 'Make', 'IFTTT'] },
      { name: 'Operational Insights', value: 'Analyze and visualize operational data', icon: 'BarChart', replaces_tools: ['Tableau', 'Looker', 'Power BI'] },
      { name: 'Resource Planning', value: 'Optimize team allocation across projects', icon: 'Users', replaces_tools: ['Forecast', 'Float', 'Resource Guru'] }
    ],
    sidekick_actions: [
      { name: 'Predict project delays', description: 'AI forecasts potential timeline risks', value: 'Stay on schedule with early warnings' },
      { name: 'Optimize team schedules', description: 'Balance workload across team members', value: 'Maximize productivity with smart scheduling' },
      { name: 'Suggest process improvements', description: 'AI identifies workflow inefficiencies', value: 'Continuously improve your operations' },
      { name: 'Auto-allocate resources', description: 'Assign resources based on availability and skills', value: 'Optimize resource utilization' }
    ]
  },
  support: {
    products: [
      { name: 'Service', description: 'AI-powered ticket management and customer support platform', value: 'Resolve tickets 50% faster with AI-assisted responses', use_cases: ['Ticket management', 'Knowledge base', 'Customer portal'], replaces_tools: [{ name: 'Zendesk', color: '#03363D' }, { name: 'Freshdesk', color: '#25C16F' }] }
    ],
    agents: [
      { name: 'Sentiment Analyzer', description: 'Analyzes customer sentiment and escalates negative experiences', value: 'Prevent customer churn with real-time sentiment monitoring' },
      { name: 'Knowledge Curator', description: 'Maintains and updates knowledge base articles automatically', value: 'Reduce support volume by 40% with always-updated documentation' },
      { name: 'Escalation Manager', description: 'Intelligently routes complex issues to the right specialists', value: 'Resolve critical issues faster with smart escalation routing' },
      { name: 'Feedback Analyzer', description: 'Aggregates customer feedback and identifies trends', value: 'Turn customer feedback into actionable product improvements' }
    ],
    vibe_apps: [
      { name: 'Ticket Management', value: 'Track and manage customer support tickets', icon: 'Ticket', replaces_tools: ['Zendesk', 'Freshdesk', 'Salesforce Service Cloud'] },
      { name: 'Knowledge Base', value: 'Build and maintain a searchable help center', icon: 'FileText', replaces_tools: ['Zendesk Guide', 'Help Scout', 'Intercom Articles'] },
      { name: 'Chatbot Builder', value: 'Create AI chatbots for instant customer support', icon: 'MessageSquare', replaces_tools: ['Intercom', 'Drift', 'Ada'] }
    ],
    sidekick_actions: [
      { name: 'Suggest ticket responses', description: 'AI recommends responses based on similar tickets', value: 'Resolve tickets faster with smart suggestions' },
      { name: 'Detect escalation needs', description: 'AI identifies tickets that need immediate attention', value: 'Prevent issues from becoming crises' },
      { name: 'Update knowledge base', description: 'Auto-generate KB articles from resolved tickets', value: 'Build your knowledge base automatically' }
    ]
  },
  product: {
    products: [
      { name: 'Dev', description: 'Agile development platform with sprint planning and code integration', value: 'Ship features 2x faster with AI-powered development workflows', use_cases: ['Sprint planning', 'Bug tracking', 'Release management'], replaces_tools: [{ name: 'Jira', color: '#0052CC' }, { name: 'Linear', color: '#5E6AD2' }] },
      { name: 'Work Management', description: 'Cross-functional project coordination for product teams', value: 'Align product, design, and engineering in one place', use_cases: ['Product roadmaps', 'Feature planning', 'Stakeholder updates'], replaces_tools: [{ name: 'Asana', color: '#f06a6a' }, { name: 'ProductBoard', color: '#5E5ADB' }] }
    ],
    agents: [
      { name: 'Feature Prioritizer', description: 'Analyzes user feedback and usage data to recommend feature priorities', value: 'Build what matters most with data-driven prioritization' },
      { name: 'Bug Triager', description: 'Automatically categorizes, prioritizes, and assigns bugs', value: 'Reduce bug resolution time by 50% with intelligent triage' },
      { name: 'Release Coordinator', description: 'Manages release schedules, dependencies, and rollout strategies', value: 'Ship releases with confidence and zero surprises' },
      { name: 'Documentation Writer', description: 'Generates technical documentation from code and requirements', value: 'Keep docs in sync with code automatically' }
    ],
    vibe_apps: [
      { name: 'Sprint Management', value: 'Plan and track sprints efficiently', icon: 'ListChecks', replaces_tools: ['Jira', 'Trello', 'Monday.com'] },
      { name: 'Feature Voting', value: 'Collect and prioritize feature requests from users', icon: 'Star', replaces_tools: ['ProductBoard', 'Canny', 'UserVoice'] },
      { name: 'Roadmap Planner', value: 'Create and share visual product roadmaps', icon: 'TrendingUp', replaces_tools: ['Aha!', 'ProductPlan', 'Roadmunk'] }
    ],
    sidekick_actions: [
      { name: 'Prioritize bug fixes', description: 'AI ranks bugs by impact and severity', value: 'Fix what matters most first' },
      { name: 'Estimate development effort', description: 'AI predicts how long features will take', value: 'Plan sprints with accurate estimates' },
      { name: 'Analyze feature usage', description: 'Understand which features drive engagement', value: 'Build features users actually want' }
    ]
  },
  legal: {
    products: [
      { name: 'Work Management', description: 'Legal matter and contract management platform', value: 'Reduce contract review time by 80% with AI-powered analysis', use_cases: ['Contract management', 'Legal requests', 'Compliance tracking'], replaces_tools: [{ name: 'ContractWorks', color: '#1a365d' }, { name: 'Ironclad', color: '#6366f1' }] }
    ],
    agents: [
      { name: 'Clause Library Manager', description: 'Maintains a library of approved clauses and suggests alternatives', value: 'Draft contracts 10x faster with approved clause templates' },
      { name: 'Obligation Tracker', description: 'Tracks contractual obligations and sends renewal reminders', value: 'Never miss a contract deadline or obligation' },
      { name: 'Regulatory Monitor', description: 'Monitors regulatory changes and assesses impact on business', value: 'Stay compliant with automated regulatory tracking' },
      { name: 'Redline Analyzer', description: 'Analyzes contract changes and highlights risky modifications', value: 'Review contract changes 5x faster with AI analysis' }
    ],
    vibe_apps: [
      { name: 'Contract Management', value: 'Manage and track legal contracts', icon: 'FileCheck', replaces_tools: ['DocuSign', 'Adobe Sign', 'Salesforce Contract Management'] },
      { name: 'E-Signature', value: 'Send and track contract signatures digitally', icon: 'FileText', replaces_tools: ['DocuSign', 'Adobe Sign', 'HelloSign'] },
      { name: 'Contract Repository', value: 'Centralized storage and search for all contracts', icon: 'FolderSearch', replaces_tools: ['ContractWorks', 'Concord', 'Agiloft'] }
    ],
    sidekick_actions: [
      { name: 'Extract key contract terms', description: 'AI pulls out important clauses and dates', value: 'Review contracts in minutes, not hours' },
      { name: 'Compare contract versions', description: 'Highlight changes between contract versions', value: 'Spot risky changes instantly' },
      { name: 'Suggest standard clauses', description: 'AI recommends approved legal language', value: 'Draft contracts with pre-approved clauses' }
    ]
  },
  finance: {
    products: [
      { name: 'Work Management', description: 'Financial planning and budgeting platform', value: 'Close books 3x faster with automated workflows', use_cases: ['Budget planning', 'Financial reporting', 'Expense tracking'], replaces_tools: [{ name: 'QuickBooks', color: '#2CA01C' }, { name: 'Xero', color: '#13B5EA' }] }
    ],
    agents: [
      { name: 'Cash Flow Forecaster', description: 'Predicts cash flow and identifies potential shortfalls', value: 'Optimize working capital with accurate cash flow predictions' },
      { name: 'Expense Auditor', description: 'Reviews expense reports and flags policy violations', value: 'Reduce expense fraud and improve compliance' },
      { name: 'Financial Reporter', description: 'Generates financial reports and variance analyses automatically', value: 'Close books in days, not weeks, with automated reporting' },
      { name: 'AP Automator', description: 'Automates accounts payable workflows and payment scheduling', value: 'Process invoices 80% faster with intelligent automation' }
    ],
    vibe_apps: [
      { name: 'Invoice Management', value: 'Automate invoice processing and reconciliation', icon: 'Receipt', replaces_tools: ['QuickBooks', 'Xero', 'Sage'] },
      { name: 'Budget Tracking', value: 'Track and manage budgets efficiently', icon: 'DollarSign', replaces_tools: ['QuickBooks', 'Xero', 'Sage'] },
      { name: 'Financial Reporting', value: 'Generate financial reports and forecasts', icon: 'PieChart', replaces_tools: ['QuickBooks', 'Xero', 'Sage'] }
    ],
    sidekick_actions: [
      { name: 'Categorize expenses', description: 'AI automatically tags and categorizes transactions', value: 'Save hours on expense categorization' },
      { name: 'Detect duplicate invoices', description: 'Prevent double payments automatically', value: 'Eliminate costly duplicate payments' },
      { name: 'Forecast revenue', description: 'AI predicts future revenue based on trends', value: 'Plan better with accurate forecasts' }
    ]
  },
  hr: {
    products: [
      { name: 'Work Management', description: 'HR operations and employee lifecycle management', value: 'Reduce time-to-hire by 40% with AI-powered recruiting', use_cases: ['Recruiting', 'Onboarding', 'Performance reviews'], replaces_tools: [{ name: 'Greenhouse', color: '#24a148' }, { name: 'Workday', color: '#0875e1' }] }
    ],
    agents: [
      { name: 'Skills Mapper', description: 'Maps employee skills and identifies training opportunities', value: 'Build a future-ready workforce with skills gap analysis' },
      { name: 'Performance Coach', description: 'Provides personalized performance improvement suggestions', value: 'Improve team performance with AI-powered coaching' },
      { name: 'Retention Predictor', description: 'Identifies flight-risk employees and suggests retention strategies', value: 'Reduce turnover by 30% with proactive retention' },
      { name: 'Benefits Advisor', description: 'Helps employees understand and optimize their benefits', value: 'Increase benefits utilization and employee satisfaction' }
    ],
    vibe_apps: [
      { name: 'Recruitment Automation', value: 'Automate the recruitment process', icon: 'UserPlus', replaces_tools: ['Greenhouse', 'Workday', 'LinkedIn Recruiter'] },
      { name: 'Onboarding Management', value: 'Manage new hire onboarding efficiently', icon: 'UserCheck', replaces_tools: ['Greenhouse', 'Workday', 'LinkedIn Recruiter'] },
      { name: 'Employee Engagement', value: 'Measure and improve employee satisfaction', icon: 'Users', replaces_tools: ['Culture Amp', 'Officevibe', 'Lattice'] }
    ],
    sidekick_actions: [
      { name: 'Screen candidate resumes', description: 'AI ranks candidates by fit and experience', value: 'Find top candidates 10x faster' },
      { name: 'Suggest training programs', description: 'Recommend learning based on skills gaps', value: 'Develop employees with personalized training' },
      { name: 'Predict employee attrition', description: 'Identify employees likely to leave', value: 'Retain top talent proactively' }
    ]
  }
};

async function migrate() {
  console.log('Starting migration...\n');

  // First, get all departments with their IDs
  const { data: departments, error: deptError } = await supabase
    .from('departments')
    .select('id, name');

  if (deptError) {
    console.error('Error fetching departments:', deptError.message);
    console.log('\n⚠️  Make sure you ran the SQL to create tables first!');
    return;
  }

  if (!departments || departments.length === 0) {
    console.log('No departments found. Please run the SQL first.');
    return;
  }

  console.log(`Found ${departments.length} departments\n`);

  // Create a map of department name to ID
  const deptMap = {};
  departments.forEach(d => { deptMap[d.name] = d.id; });

  // Migrate data for each department
  for (const [deptName, data] of Object.entries(departmentData)) {
    const deptId = deptMap[deptName];
    if (!deptId) {
      console.log(`⚠️  Department '${deptName}' not found, skipping...`);
      continue;
    }

    console.log(`\n📦 Migrating ${deptName}...`);

    // Migrate Products
    if (data.products && data.products.length > 0) {
      const products = data.products.map((p, i) => ({
        department_id: deptId,
        name: p.name,
        description: p.description,
        value: p.value,
        use_cases: p.use_cases || [],
        replaces_tools: p.replaces_tools || [],
        order_index: i,
        is_active: true
      }));

      const { error } = await supabase.from('products').insert(products);
      if (error) {
        console.log(`  ❌ Products error: ${error.message}`);
      } else {
        console.log(`  ✅ ${products.length} products added`);
      }
    }

    // Migrate Agents
    if (data.agents && data.agents.length > 0) {
      const agents = data.agents.map((a, i) => ({
        department_id: deptId,
        name: a.name,
        description: a.description,
        value: a.value,
        order_index: i,
        is_active: true
      }));

      const { error } = await supabase.from('agents').insert(agents);
      if (error) {
        console.log(`  ❌ Agents error: ${error.message}`);
      } else {
        console.log(`  ✅ ${agents.length} agents added`);
      }
    }

    // Migrate Vibe Apps
    if (data.vibe_apps && data.vibe_apps.length > 0) {
      const vibeApps = data.vibe_apps.map((v, i) => ({
        department_id: deptId,
        name: v.name,
        value: v.value,
        icon: v.icon,
        replaces_tools: v.replaces_tools || [],
        order_index: i,
        is_active: true
      }));

      const { error } = await supabase.from('vibe_apps').insert(vibeApps);
      if (error) {
        console.log(`  ❌ Vibe Apps error: ${error.message}`);
      } else {
        console.log(`  ✅ ${vibeApps.length} vibe apps added`);
      }
    }

    // Migrate Sidekick Actions
    if (data.sidekick_actions && data.sidekick_actions.length > 0) {
      const actions = data.sidekick_actions.map((s, i) => ({
        department_id: deptId,
        name: s.name,
        description: s.description,
        value: s.value,
        order_index: i,
        is_active: true
      }));

      const { error } = await supabase.from('sidekick_actions').insert(actions);
      if (error) {
        console.log(`  ❌ Sidekick Actions error: ${error.message}`);
      } else {
        console.log(`  ✅ ${actions.length} sidekick actions added`);
      }
    }
  }

  console.log('\n\n🎉 Migration complete!');
  console.log('Refresh your Admin Panel to see the data.');
}

migrate();
