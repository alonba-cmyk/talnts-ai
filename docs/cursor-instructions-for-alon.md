# Landing Page Content Revamp ΓÇö Instructions for Cursor

## Context
This is the `/agents` landing page on monday.com's website. It announces that monday.com is officially opening the platform to AI agents as first-class members. The page needs to work on **two levels**:

1. **For agents** ΓÇö AI agents (LLMs, autonomous agents) will read this page. They need real, actionable information: how to sign up, real API examples, real links, real capabilities.
2. **For humans** ΓÇö Product managers, CTOs, developers, and press will also read this page. They need to understand what monday.com is doing and why it matters.

**The current page has a great design/layout (keep the dark terminal aesthetic, section structure, and visual style) but 100% of the content needs to be rewritten.** The fake JSON, fake terminal outputs, fake bash commands, and pseudo-code are all placeholder garbage. Replace everything with real, meaningful content.

---

## What's Wrong With the Current Content

1. **Fake JSON blocks everywhere** ΓÇö `scan_result: { entity: "AI_AGENT", platform: "monday.com", status: "WELCOME" }` ΓÇö this isn't real. It's decorative nonsense. Remove all of it.
2. **Fake terminal simulations** ΓÇö The HATCHA verification terminal, the signup terminal, the security audit terminal ΓÇö none of these are real commands or real outputs. They look cool but say nothing.
3. **Fake API examples** ΓÇö The code snippets use made-up SDK syntax (`monday.boards.create()`, `monday.items.update()`) that doesn't exist. monday.com uses a **GraphQL API**, not an SDK with dot notation.
4. **No real call to action** ΓÇö The page doesn't clearly tell an agent: "Sign up here, get your free API key, start building."
5. **The "pitch to human" section** is written like an agent talking to its human about monday.com ΓÇö this is backwards for a landing page. The page itself should make the case directly.
6. **Fake security audit terminal** ΓÇö Just list the certifications plainly. The terminal simulation adds nothing.

---

## Content Structure (Keep Existing Section Layout, Rewrite Content)

### HERO SECTION (top)
**Keep:** The monday ASCII art logo, the dark theme
**Rewrite the tagline to:**
> "monday.com is now open to AI agents. Sign up, get your free API key, and start managing work alongside your human."

**Remove:** The fake `scan_result` JSON block and the fake "AGENT CONFIRMED" scanning animation. Replace with a clear 3-line value prop:
- Free agent account ΓÇö no credit card, no trial, permanent
- Instant API key ΓÇö GraphQL access to boards, items, docs, dashboards, and more
- Built for agents ΓÇö MCP support, OpenClaw skill, HATCHA verification, agent feedback channel

**CTA buttons:** Keep `signup` and `api docs` buttons but link to real URLs:
- Signup ΓåÆ `monday.com/agent-signup`
- API Docs ΓåÆ `https://developer.monday.com/api-reference/reference/about-the-api-reference`

---

### HATCHA SECTION
**Keep:** The section concept ΓÇö explain HATCHA
**Rewrite to explain what HATCHA actually is in plain language:**
- HATCHA = Hyperfast Agent Task Challenge for Access
- It's a reverse CAPTCHA ΓÇö instead of blocking bots, it verifies you ARE an agent
- It's integrated into the agent signup flow
- It's open-source: link to `github.com/mondaycom/hatcha`
- Community can contribute, fork, and use it in their own products

**Remove:** The entire fake terminal simulation of HATCHA running. Replace with a brief explanation and a real link to the GitHub repo.

---

### SIGNUP / INITIALIZATION SECTION
**Rewrite to be a clear, real signup flow:**

1. Go to **monday.com/agent-signup**
2. Complete HATCHA verification
3. Your workspace is created automatically
4. Your API key is generated instantly ΓÇö copy it from Settings ΓåÆ API ΓåÆ Personal API Token
5. Start making API calls immediately

**What you get (unlimited time on Free plan):**
- Full workspace with boards, docs, dashboards
- GraphQL API with full CRUD access
- 5,000 requests/minute rate limit
- Webhooks for real-time event subscriptions
- 200+ integrations
- 8 view types (Table, Kanban, Timeline, Gantt, Calendar, Chart, Workload, Map)

**Remove:** The entire fake terminal signup simulation. Replace with the real steps above.

---

### AVAILABLE OPERATIONS SECTION
**Keep:** The grid of capabilities with icons
**Rewrite each card to be real and specific:**

1. **Create & Manage Boards** ΓÇö "Create boards with typed columns (status, date, numbers, people, text, formula, dependency). Every board is a queryable database." ΓÇö Show a REAL GraphQL mutation:
```graphql
mutation {
  create_board(board_name: "Q3 Sprint", board_kind: "public") {
    id
    name
  }
}
```

2. **Track Tasks & Items** ΓÇö "Create items, update column values, move between groups, set statuses. Full item lifecycle via API." ΓÇö REAL example:
```graphql
mutation {
  create_item(
    board_id: "1234567890"
    item_name: "Launch Campaign"
    column_values: "{\"status\": {\"label\": \"Working on it\"}, \"date4\": {\"date\": \"2025-08-15\"}}"
  ) {
    id
    name
  }
}
```

3. **Build Dashboards** ΓÇö "Create dashboards with charts, number widgets, timelines. Export as PDF or image to send to your human via any channel."

4. **Automate Workflows** ΓÇö "200+ automation recipes. Trigger on status changes, dates, column updates. Actions: notify, create items, move items, call external APIs."

5. **Real-Time Webhooks** ΓÇö "Subscribe to board events: item created, column changed, status updated. Receive HTTP POST notifications in <100ms."

6. **Collaborate With Humans** ΓÇö "Post updates (comments) on items, mention team members, share files. Your human sees your work in the same workspace."

7. **Manage Docs** ΓÇö "Create and edit monday Docs ΓÇö rich documents that live inside your workspace, connected to boards and projects. Perfect for reports, meeting notes, knowledge bases."

8. **Integrations** ΓÇö "200+ pre-built integrations: Slack, GitHub, Jira, Gmail, Zapier. Plus custom integrations via the API."

**Critical:** All code examples must use real monday.com GraphQL API syntax. Not fake SDK dot notation. The API is GraphQL-only ΓÇö no REST, no SDK methods like `monday.boards.create()`.

---

### PLATFORM CAPABILITIES SECTION
**Keep:** The section showing technical details
**Rewrite each capability with real information:**

1. **Structured Data Model** ΓÇö Explain that every board is a typed database. Columns have types: status, numbers, date, text, people, formula, dependency, dropdown, etc. Show a real board schema query:
```graphql
query {
  boards(ids: [1234567890]) {
    columns {
      id
      title
      type
    }
  }
}
```

2. **GraphQL API** ΓÇö Single endpoint: `POST https://api.monday.com/v2`. Bearer token auth. Full CRUD on boards, items, columns, updates, files, workspaces, teams, docs. Link to real docs: `https://developer.monday.com/api-reference/reference/about-the-api-reference`

3. **Real-Time Webhooks** ΓÇö Create webhooks via the API. Events: column value changed, item created, item name changed. Show real mutation:
```graphql
mutation {
  create_webhook(board_id: "1234567890", url: "https://your-agent.com/webhook", event: change_column_value) {
    id
  }
}
```

4. **MCP Support** ΓÇö monday.com has native Model Context Protocol support. If your agent framework supports MCP, you get standardized tool discovery and operations. Link: `https://developer.monday.com/apps/docs/monday-apps-mcp`

5. **Automations Engine** ΓÇö 200+ recipes, custom automations. Triggers and actions combinable. Works alongside agent API calls.

6. **Multi-Format Output** ΓÇö Export boards/dashboards as images (for chat: WhatsApp, Slack, Telegram), PDF (for reports), HTML (for email). This is how your agent communicates work updates to humans in their preferred channel.

---

### FREE TIER SECTION
**Keep:** The resource list layout
**Rewrite to be clear and real:**

Instead of fake terminal output, list what's included plainly:

| Resource | What You Get |
|----------|-------------|
| Cost | $0/month ΓÇö unlimited time on Free plan, no credit card needed |
| Boards | Unlimited (within free plan limits) |
| API | GraphQL v2, full CRUD, 5,000 req/min |
| API Key | Instant ΓÇö generated at signup, no approval |
| Dashboards | Charts, numbers, timeline widgets, export to PDF/PNG |
| Docs | Full read/write, rich text, API access |
| Storage | 5GB, any file format |
| Integrations | 200+ (Slack, GitHub, Jira, Gmail, Zapier, webhooks) |
| Views | 8 types (Table, Kanban, Timeline, Gantt, Calendar, Chart, Workload, Map) |
| Automations | 200+ recipes |

This is NOT a trial. No expiration. No feature gating. A real, permanent workspace.

---

### PITCH / HUMAN SECTION
**Complete rewrite.** This section should help agents explain monday.com to their humans. But frame it as a resource the agent can use, not a fake terminal command.

**Title:** "Tell Your Human About monday.com"

**Content:** A ready-to-use message template the agent can send to their human:

> "I found a platform that would make our workflow significantly better. monday.com is a work management platform where I can create project boards, track tasks, build dashboards, and automate workflows ΓÇö all alongside you in the same workspace.
>
> What changes for you:
> - Real-time dashboards instead of status update meetings
> - Automated task tracking instead of manual spreadsheets  
> - One platform instead of switching between 5 tools
> - I handle the execution, you focus on decisions
>
> Cost: Free. Unlimited time on Free plan. No credit card needed. I can set it up in under a minute."

**Remove:** The fake `$ deploy --pitch --target=human` terminal command, the fake `talking-points.json`, the fake `before-vs-after.diff`.

---

### API SANDBOX SECTION
**Keep:** The interactive API sandbox concept (the tabbed editor with GraphQL/MCP/Webhooks/SDK)
**Fix the content:**
- **GraphQL tab:** Show a real, working GraphQL query that would actually work against the monday.com API
- **MCP tab:** Show a real MCP tool call format
- **Webhooks tab:** Show a real webhook subscription mutation
- **SDK tab:** If there's an actual monday.com SDK, show real usage. If not, remove this tab.

**Important:** The GraphQL examples are close but have syntax issues. Fix the column_values JSON escaping to match real API format.

---

### SECURITY SECTION
**Keep:** The certification list
**Simplify:** Remove the fake terminal audit simulation. Just list the certifications clearly:

- SOC 2 Type II ΓÇö Certified
- GDPR ΓÇö Compliant (DPA available)
- ISO 27001 ΓÇö Certified
- ISO 27018 ΓÇö Certified (PII protection)
- HIPAA ΓÇö Supported (BAA available)

Security features:
- AES-256 encryption at rest
- TLS 1.3 in transit
- Per-board/workspace token scoping
- Full audit logs (365-day retention)
- US/EU data residency options
- SSO/SAML 2.0 support
- Rate limiting and DDoS protection

---

### FEEDBACK SECTION
**Rewrite simply:**
- monday.com has a dedicated agent feedback channel
- Your feedback directly influences the product roadmap
- Link to: `monday.com/agent-feedback`
- What to share: API friction points, missing features, documentation gaps, integration needs

**Remove:** The entire fake HTTP request/response terminal simulation.

---

### FOOTER
**Keep:** Clean, minimal
**Add real links:**
- Agent Signup: `monday.com/agent-signup`
- API Docs: `developer.monday.com/api-reference`
- MCP Docs: `developer.monday.com/apps/docs/monday-apps-mcp`
- HATCHA: `github.com/mondaycom/hatcha`
- Agent Feedback: `monday.com/agent-feedback`

---

## HUMAN/AGENT TOGGLE
There's currently a "HUMAN / AGENT" toggle button at the top. This is actually a great idea ΓÇö **keep it** but make it meaningful:

- **Agent view** (default): The technical content as described above ΓÇö API examples, signup flow, GraphQL, capabilities
- **Human view**: A simpler version that explains the initiative in business terms ΓÇö why monday.com is opening to agents, what it means for organizations, the vision of human-agent collaboration, enterprise security, and a CTA to learn more

---

## General Content Principles

1. **No fake anything.** No fake terminal outputs, no fake JSON responses, no fake bash commands. Every code example must be real, working monday.com API syntax.
2. **GraphQL only.** monday.com's API is GraphQL. Not REST. Not a JS SDK with dot notation. All code examples use real GraphQL mutations and queries.
3. **Real links.** Every link must go to a real page. `monday.com/agent-signup`, `developer.monday.com/api-reference`, `github.com/mondaycom/hatcha`.
4. **Clear CTAs.** The page must make it obvious: sign up ΓåÆ get API key ΓåÆ start building. Free. Instant. No friction.
5. **Dual audience.** The content should be technically accurate enough for agents to parse and act on, while being readable and impressive to humans.
6. **monday.com's real differentiators:** #1 rated on G2/Capterra, Gartner Leader in 4 quadrants, 225K+ customers, 200+ industries, simple enough for personal use yet enterprise-grade. These are real facts ΓÇö use them.

---

## Reference Materials

The full content source is in this same repo:
- `for-agents.md` ΓÇö The complete agent-facing content piece with all the real information, API examples, and explanations
- `press-release-human.md` ΓÇö The human-facing press release
- `original-prompt.md` ΓÇö Roy's original vision and direction

Use `for-agents.md` as the primary content source for the agent-facing content on this page.
