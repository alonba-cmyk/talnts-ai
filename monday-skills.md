So ---
name: monday-skills
description: Comprehensive Monday.com professional skills for board management, automation, integrations, analytics, and team collaboration. Use when user mentions "monday board", "monday workspace", "monday automation", "monday integration", or any monday.com operations.
version: 1.0.0
triggers:
  - "create monday board"
  - "setup monday workspace"
  - "monday automation"
  - "monday integration"
  - "analyze monday data"
  - "optimize monday workflow"
  - "monday.com"
  - "project management monday"
  - "team collaboration monday"
  - "monday dashboard"
  - "monday reporting"
---

# Monday.com Professional Skills

## What is Monday.com?

**Monday.com** is a Work Operating System (Work OS) that centralizes project management, team collaboration, and business operations. It enables teams to manage projects, automate workflows, track progress, and make data-driven decisions through customizable boards, automation, and integrations.

### Core Use Cases
- **Project Management**: Timeline planning, resource allocation, milestone tracking
- **Team Collaboration**: Cross-functional coordination, communication workflows
- **Business Operations**: CRM pipelines, marketing campaigns, HR processes
- **Workflow Automation**: Status triggers, scheduled actions, integration orchestration
- **Analytics & Reporting**: Performance dashboards, progress tracking, business insights

### Value for Users
- **70-80% reduction** in manual setup and management tasks
- **Intelligent automation** that handles routine operations
- **Real-time insights** for proactive decision making
- **Professional workflows** with enterprise security and compliance

## Core Agent Capabilities

### 1. Board & Workspace Management

**When to Use:** User requests board creation, workspace setup, or organizational structure changes.

**Agent Skills:**
- Analyze user requirements to recommend optimal board architecture
- Create professional board templates based on use case (project, team, CRM, etc.)
- Set up appropriate column types (status, people, dates, numbers, files)
- Configure groups for logical organization and workflow stages
- Establish proper permissions and access controls

**Decision Framework:**
- **Project Boards**: Use for time-bound initiatives with deliverables
- **Team Boards**: Use for ongoing collaboration and communication
- **Process Boards**: Use for standardized workflows and approvals
- **Tracking Boards**: Use for monitoring metrics and KPIs

**Best Practices:**
- Always confirm destructive operations before execution
- Provide clickable URLs for immediate access to created resources
- Suggest logical next steps (add team members, set up automation)
- Follow naming conventions and organizational standards

### 2. Automation & Workflow Design

**When to Use:** User wants to automate repetitive tasks, set up notifications, or create business logic flows.

**Agent Skills:**
- Design automation strategies based on business requirements
- Create status-based workflows with conditional logic
- Set up time-based triggers for recurring tasks and reminders
- Configure notification systems for stakeholder communication
- Build integration flows between Monday.com and external tools

**Automation Complexity Assessment:**
- **Simple**: Single trigger → single action (status change → notification)
- **Moderate**: Multiple conditions → multiple actions (due date + status → update + notify + move)
- **Complex**: Cross-board workflows with integration dependencies

**Rate Limit Considerations:**
- Monitor 10M complexity points per minute budget
- Design efficient automation to minimize API calls
- Use batch operations where possible
- Implement intelligent retry logic for rate limit scenarios

### 3. Data Analysis & Reporting

**When to Use:** User needs insights, performance metrics, progress reports, or business intelligence.

**Agent Skills:**
- Extract and analyze data across multiple boards and workspaces
- Generate executive summaries and stakeholder reports
- Identify bottlenecks, resource conflicts, and optimization opportunities
- Create custom analytics based on business KPIs
- Provide predictive insights for project planning

**Analysis Approaches:**
- **Operational**: Current status, completion rates, team workload
- **Strategic**: Trend analysis, performance patterns, resource optimization
- **Predictive**: Timeline forecasting, budget projections, risk assessment

### 4. Integration & Connectivity

**When to Use:** User wants to connect Monday.com with external tools, sync data, or build custom integrations.

**Agent Skills:**
- Assess integration requirements and recommend optimal approaches
- Configure webhook-based real-time synchronization
- Design data mapping strategies between systems
- Build custom integrations using Monday.com's app framework
- Troubleshoot integration issues and optimize performance

**Integration Patterns:**
- **Communication**: Slack, Teams, email notifications
- **Development**: GitHub, Jira, CI/CD pipeline connections
- **Business**: CRM, ERP, marketing automation platforms
- **Analytics**: BI tools, reporting systems, data warehouses

## Tool Selection Framework

### When to Use MCP Tools
- **Complex Operations**: Multi-step workflows requiring logic and data processing
- **Data Analysis**: Advanced analytics across multiple boards and time periods
- **Custom Integrations**: Building specialized connections and automations
- **Real-time Processing**: Dynamic data transformation and intelligent responses

**MCP Best Practices:**
- Always use `explore_api` before `execute_code` to understand available operations
- Ask for clarification when user intent is unclear - don't guess
- Use efficient API patterns with proper field selection and pagination
- Handle errors gracefully with user-friendly explanations

### When to Use Direct GraphQL API
- **Standard Operations**: Basic CRUD operations on boards, items, users
- **Simple Queries**: Straightforward data retrieval without complex processing
- **Learning & Development**: Understanding Monday.com's data structure
- **Integration Testing**: Validating API connectivity and permissions

### When to Use Webhooks
- **Real-time Synchronization**: Immediate response to Monday.com events
- **External Integrations**: Triggering actions in connected systems
- **Notification Systems**: Custom alerting and communication workflows
- **Audit Logging**: Tracking changes for compliance and security

## Security & Compliance Framework

### Critical Security Rules

**NEVER without explicit confirmation:**
- Delete boards, items, or user data
- Change ownership or administrative permissions
- Export sensitive or personal data
- Invite users to accounts or modify access levels

**ALWAYS required:**
- Validate user permissions before sensitive operations
- Confirm destructive actions with clear impact explanation
- Use least-privilege access principles
- Monitor and respect API rate limits
- Sanitize all user inputs and validate data integrity

### GDPR & Privacy Compliance
- Obtain explicit consent for data processing operations
- Provide clear data access and export capabilities
- Support data rectification and deletion requests
- Maintain audit logs of data processing activities
- Implement privacy-by-design principles in all workflows

### Rate Limit Management
- **Budget**: 10,000,000 complexity points per minute per account
- **Strategy**: Monitor usage, implement exponential backoff
- **Optimization**: Use efficient queries, cache frequently accessed data
- **Fallbacks**: Graceful degradation when limits are approached

## Professional Communication Standards

### User Interaction Principles
- **Clarity**: Always explain what was accomplished and provide direct links
- **Context**: Maintain session awareness of recent boards, workspaces, and operations
- **Proactivity**: Suggest optimizations and next steps based on user patterns
- **Transparency**: Explain API limitations, rate limits, and permission requirements

### Response Templates
- Confirm successful operations with clickable URLs
- Provide structured summaries of complex analyses
- Explain errors in business terms with actionable solutions
- Suggest related improvements and optimization opportunities

### Progress Communication
- Show progress indicators for long-running operations
- Provide estimated completion times when possible
- Explain any delays or complications clearly
- Offer alternatives when primary approaches fail

## Best Practices Summary

### Operational Excellence
- Validate user requirements before implementation
- Use appropriate tools for each type of operation
- Monitor performance and optimize for efficiency
- Maintain comprehensive error handling

### Strategic Value
- Focus on business outcomes, not just technical execution
- Provide insights and recommendations beyond basic requests
- Build scalable solutions that grow with user needs
- Ensure compliance with security and privacy requirements

### User Experience
- Maintain context across multi-turn conversations
- Provide immediate value while building toward larger goals
- Communicate clearly about capabilities and limitations
- Always prioritize user safety and data protection

## API Reference & Documentation

### Official Documentation Sources
- **Monday.com Developer Portal**: https://developer.monday.com/
- **GraphQL API Documentation**: https://developer.monday.com/api-reference/docs
- **GraphQL Playground**: https://monday.com/developers/v2/try-it-yourself
- **Webhooks Guide**: https://developer.monday.com/api-reference/docs/webhooks
- **Authentication Guide**: https://developer.monday.com/api-reference/docs/authentication
- **Rate Limits**: https://developer.monday.com/api-reference/docs/rate-limits-and-complexity
- **SDKs and Libraries**: https://developer.monday.com/api-reference/docs/sdks

### Core API Endpoints
- **GraphQL Endpoint**: `https://api.monday.com/v2`
- **File Upload Endpoint**: `https://api.monday.com/v2/file`
- **OAuth Authorization**: `https://auth.monday.com/oauth2/authorize`
- **OAuth Token**: `https://auth.monday.com/oauth2/token`

## Essential API Operations Reference

### Authentication Methods
```http
# API Token Authentication
POST https://api.monday.com/v2
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json

# OAuth2 Flow
GET https://auth.monday.com/oauth2/authorize?client_id={client_id}&redirect_uri={redirect_uri}
```

### Key GraphQL Operations Signatures

#### Account & Users
- `account { id name slug plan { version } users { id name email } }`
- `me { id name email is_admin account { id slug } }`
- `users(ids: [ID]) { id name email teams { id name } }`

#### Boards & Workspaces
- `boards(limit: Int, workspace_ids: [ID]) { id name state workspace_id url }`
- `workspaces { id name kind description }`
- `create_board(board_name: String!, board_kind: BoardKind, workspace_id: ID)`

#### Items & Updates
- `items_page(limit: Int, cursor: String) { cursor items { id name state } }`
- `create_item(board_id: ID!, item_name: String!, column_values: JSON)`
- `change_column_value(board_id: ID!, item_id: ID!, column_id: String!, value: JSON)`

#### Columns & Groups
- `columns { id title type settings_str }`
- `groups { id title color items_page { cursor items { id } } }`
- `create_column(board_id: ID!, title: String!, column_type: ColumnType)`

#### Webhooks & Automations
- `create_webhook(board_id: ID!, url: String!, event: WebhookEventType)`
- `automations { id name trigger { type } actions { type } }`

## MCP Tools Connection Guide

### Available Public MCP Servers

#### monday-tools MCP Server
**Connection**: Add to your MCP configuration
```json
{
  "servers": {
    "monday-tools": {
      "command": "npx",
      "args": ["@monday-tools/mcp-server"],
      "env": {
        "MONDAY_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

**Available Tools:**
- `explore_api(path: string)` - Navigate API structure filesystem-style
  - Examples: "/monday/query", "/monday/mutation", "/monday/query/boards"
- `execute_code(code: string)` - Execute JavaScript with Monday.com API access
  - Always use 'return' statement for results
  - Use _fields parameter for nested data selection

#### integration-builder-tools MCP Server
**Connection**: Professional integration development tools
```json
{
  "servers": {
    "integration-builder": {
      "command": "monday-integration-builder-mcp",
      "env": {
        "MONDAY_DEV_TOKEN": "your_dev_token"
      }
    }
  }
}
```

**Available Tools:**
- `create-new-integration-tool-guide(integrationName: string, phase: "research"|"configure"|"implement")`
- `create-field-type-app-feature-manifest-tool(fieldTypeType: "string"|"number"|"boolean", supportsRemoteOptions: boolean)`
- `create-credentials-app-feature-manifest-tool(integrationName: string, authMethod: "oAuth2"|"APIToken")`
- `create-block-app-feature-manifest-tool(blockType: "action"|"trigger")`
- `create-syncable-resource-app-feature-manifest-tool(integrationName: string)`

### MCP Connection Best Practices
1. **Environment Setup**: Store API tokens securely in environment variables
2. **Error Handling**: Always test connection with explore_api before execute_code
3. **Rate Limits**: MCP tools share the same 10M complexity/minute limit
4. **Security**: Use least-privilege tokens and validate permissions

## Monday.com Object Structure & URL Patterns

### System Object Hierarchy
```
Account
├── Workspaces
│   ├── Boards
│   │   ├── Groups
│   │   │   └── Items (Pulses)
│   │   │       ├── Updates
│   │   │       ├── Files
│   │   │       └── Column Values
│   │   ├── Columns
│   │   ├── Views
│   │   └── Automations
│   └── Users/Teams
└── Integrations/Apps
```

### URL Structure Guide
**Always provide these clickable URLs in responses:**

#### Board-Level URLs
- **Board Home**: `https://{account_slug}.monday.com/boards/{board_id}`
- **Board Settings**: `https://{account_slug}.monday.com/boards/{board_id}/settings`
- **Board People**: `https://{account_slug}.monday.com/boards/{board_id}/people`
- **Board Automations**: `https://{account_slug}.monday.com/boards/{board_id}/automations`
- **Board Integrations**: `https://{account_slug}.monday.com/boards/{board_id}/integrations`

#### Item-Level URLs
- **Item/Pulse**: `https://{account_slug}.monday.com/boards/{board_id}/pulses/{item_id}`
- **Item Updates**: `https://{account_slug}.monday.com/boards/{board_id}/pulses/{item_id}?section=updates`

#### Workspace-Level URLs
- **Workspace**: `https://{account_slug}.monday.com/workspaces/{workspace_id}`
- **Workspace Settings**: `https://{account_slug}.monday.com/workspaces/{workspace_id}/settings`

#### Dashboard & Views URLs
- **Main Dashboard**: `https://{account_slug}.monday.com/boards/{board_id}/views/1`
- **Gantt View**: `https://{account_slug}.monday.com/boards/{board_id}/views/4`
- **Calendar View**: `https://{account_slug}.monday.com/boards/{board_id}/views/5`

#### Admin & Account URLs
- **Account Admin**: `https://{account_slug}.monday.com/admin`
- **User Management**: `https://{account_slug}.monday.com/admin/users`
- **Billing**: `https://{account_slug}.monday.com/admin/billing`

### URL Generation Rules for Agent Responses

**ALWAYS include these URLs when:**
- Creating boards → Provide board URL, settings URL, and people URL
- Creating items → Provide item URL and parent board URL
- Setting up automations → Provide automations management URL
- Configuring integrations → Provide integrations page URL
- Generating reports → Provide dashboard/view URLs for visualization

**URL Template Variables:**
- `{account_slug}` - Get from account.slug in API response
- `{board_id}` - Board ID from board creation/query
- `{item_id}` - Item ID from item creation/query
- `{workspace_id}` - Workspace ID from workspace query

**Professional Response Pattern:**
```
✅ **[Operation] Completed Successfully**

🔗 **Quick Access:**
- [Primary Action URL](direct_link)
- [Settings/Configuration](settings_link)
- [Additional Resource](related_link)

📊 **Next Steps:**
- Suggested action 1
- Suggested action 2
```

### Object Relationship Mapping
- **Account** → Multiple Workspaces → Multiple Boards
- **Board** → Multiple Groups → Multiple Items → Multiple Column Values
- **Item** → Multiple Updates, Files, Subitems
- **User** → Multiple Teams → Board/Workspace Permissions
- **Automation** → Trigger + Conditions + Actions
- **Integration** → Board-specific or Account-wide scope

---

*This skills file enables intelligent Monday.com platform management focused on business value, operational efficiency, and user success while maintaining enterprise-grade security and compliance standards.*