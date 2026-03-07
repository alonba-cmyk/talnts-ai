# Development Plan — monday.com AI Platform Landing Pages

> **Last updated:** 2025-03-07
> **Purpose:** Full handoff document so a fresh AI model (or developer) can pick up exactly where we left off.

### Recent Updates (commit 08cf21e)

- **WorkManagementLandingPage** — Passes full `settings` object to `WorkManagementFirstFold` for admin-driven customization
- **WorkManagementFirstFold** — Refinements and improvements (~300 lines changed)
- **wmDepartmentData** — New agent asset images: `agent-assets-generator.png`, `agent-risk-analyzer.png`, `agent-vendor-researcher.png` (in `src/assets/`)
- **AgentsLandingPage / AgentHero** — Layout and hero updates

---

## 1. Project Overview

A suite of marketing landing pages for monday.com's AI Platform — covering the Agents product, Work Management, Platform showcase, a GTM strategy presentation, and a Supabase-powered admin panel that controls every visual setting live.

**Live URL:** Deployed on Vercel
**Repo root:** `c:\Users\AlonBarDavid\Downloads\Work AI Platform Page (Copy)`

---

## 2. Exact Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | React | 18.3.1 | Peer dependency |
| Build | Vite | 6.3.5 | With `@vitejs/plugin-react` 4.7.0 |
| Language | TypeScript | strict mode | Path alias `@/*` → `./src/*` |
| CSS | Tailwind CSS 4 | 4.1.12 | Via `@tailwindcss/vite` plugin — **no tailwind.config file** |
| Routing | react-router-dom | ^7.13.0 | `BrowserRouter` in `main.tsx` |
| Animation | motion (Framer Motion) | 12.23.24 | Import as `motion/react` |
| Backend/DB | Supabase | ^2.93.3 | URL: `fymyrxqjmnekcmrpvtju.supabase.co` |
| UI primitives | Radix UI | Various 1.x–2.x | Full set (dialog, tabs, accordion, etc.) |
| UI components | MUI | 7.3.5 | `@mui/material` + `@mui/icons-material` |
| Icons | lucide-react | 0.487.0 | Primary icon library |
| Drag & drop | @dnd-kit | core 6.3, sortable 10.0 | For admin reordering |
| Toasts | sonner | 2.0.3 | |
| Charts | recharts | 2.15.2 | |
| Package manager | pnpm | — | `pnpm run dev` / `pnpm run build` |
| Deployment | Vercel | — | `pnpm run build && vercel --prod` |
| Shell | Windows PowerShell | — | **No `&&` chaining, no heredocs** |

---

## 3. Routes

| Path | Component | Status |
|------|-----------|--------|
| `/` | `HomePage` | Built |
| `/admin` | `AdminApp` | Built |
| `/agents` | `AgentsLandingPage` | Built (mature) |
| `/platform` | `PlatformLandingPage` | Built |
| `/work-management` | `WorkManagementLandingPage` | Built (active development) |
| `/gtm` | `GTMStrategyPresentation` | Built |
| `/battle-cards` | `BattleCardsApp` | Built |
| `/preview/:sectionId` | `SectionPreviewPage` | Built |
| `/p/:slug` | `DynamicPage` | Built (Supabase-driven) |

---

## 4. Directory Structure

```
src/
├── main.tsx                          # Route definitions + providers
├── lib/supabase.ts                   # Supabase client + getImageUrl()
├── assets/                           # Agent/product images (imported in code)
│   ├── agent-assets-generator.png
│   ├── agent-risk-analyzer.png
│   └── agent-vendor-researcher.png
├── hooks/useSupabase.ts              # ALL data hooks + SiteSettings interface
├── types/database.ts                 # Supabase Database type
├── styles/
│   ├── index.css                     # Imports fonts, tailwind, theme
│   ├── fonts.css                     # Google Fonts: Poppins, Figtree, Inter, Outfit
│   ├── tailwind.css                  # @import 'tailwindcss', utilities
│   └── theme.css                     # CSS vars, @theme inline, base typography
├── app/
│   ├── WorkManagementLandingPage.tsx  # /work-management page assembly
│   ├── AgentsLandingPage.tsx          # /agents page assembly
│   ├── HomePage.tsx                   # / page
│   ├── PlatformLandingPage.tsx        # /platform page
│   ├── DynamicPage.tsx                # /p/:slug
│   ├── GTMStrategyPresentation.tsx    # /gtm
│   ├── BattleCardsApp.tsx             # /battle-cards
│   └── components/
│       ├── workManagement/            # ← ACTIVE development area
│       │   ├── WorkManagementNav.tsx
│       │   ├── WorkManagementFirstFold.tsx
│       │   ├── WorkManagementHeroVariants.tsx
│       │   ├── WorkManagementPlatformLayers.tsx
│       │   ├── WorkManagementSolutionsSection.tsx
│       │   ├── WorkManagementEnterpriseSection.tsx
│       │   ├── WorkManagementWhatSetsUsApart.tsx
│       │   ├── WorkManagementCTASection.tsx
│       │   ├── WorkManagementFooter.tsx
│       │   ├── WorkManagementSquadSection.tsx   (not in page; exports SQUAD_DEPARTMENTS)
│       │   ├── ExecutionSystemSection.tsx        (not in page; legacy/future)
│       │   ├── WorkManagementBuildSection.tsx    (not in page; partial)
│       │   ├── WorkManagementLogosSection.tsx    (not in page; partial)
│       │   └── wmDepartmentData.ts               (static data + types)
│       ├── agents/                    # Agents page components (mature)
│       └── platform/                  # Platform page components
└── admin/
    ├── AdminApp.tsx                   # Admin shell + navigation
    └── components/
        ├── AdminSidebar.tsx           # Sidebar nav groups
        ├── SiteBuilderView.tsx        # Page cards (Homepage, Platform, Agents, WM, Dynamic)
        ├── WorkManagementPageSettings.tsx  # WM admin panel
        ├── AgentsPageSettings.tsx      # Agents admin panel
        └── ...                        # Other editors
public/
├── logos/                             # Company SVG/PNG logos
├── avatars/                           # Avatar images
├── department-avatars/                # Department lead avatar images
├── flare.png, small-flare.png         # Glow assets
└── monday-mark.png                    # monday.com logo mark
```

---

## 5. Supabase Architecture

### Client

- File: `src/lib/supabase.ts`
- URL: `https://fymyrxqjmnekcmrpvtju.supabase.co`
- Storage bucket: `Vibe`

### Key Tables

| Table | Purpose |
|-------|---------|
| `site_settings` | Single row (id=`'main'`), `sections_visibility` JSON stores all settings |
| `departments` | Department data for admin |
| `department_products/agents/vibe_apps/sidekick_actions` | Junction tables |
| `pages` | Dynamic pages (slug, title, sections, status) |
| `page_components` | Per-page component config with ordering |
| `design_assets` | Uploadable assets by category |
| `case_study_sources` / `case_studies` | Case study content |

### Settings Storage Pattern

All feature flags and layout settings live in `site_settings.sections_visibility` as a flat JSON object. Keys use underscore prefixes (`_wm_dark_mode`, `_agents_hero_variant`). The `useSiteSettings()` hook strips the prefixes and merges with defaults.

### Work Management Settings (in `sections_visibility`)

| Key | Type | Default |
|-----|------|---------|
| `_wm_dark_mode` | boolean | false |
| `_wm_first_fold_variant` | `'default' \| 'live_delegation' \| 'cinematic_assembly' \| 'split_reveal' \| 'roster_board'` | `'default'` |
| `_wm_squad_split_chat` | boolean | false |
| `_wm_roster_layout` | `'mirrored' \| 'vertical'` | `'mirrored'` |
| `_wm_board_style` | `'default' \| 'kanban' \| 'workflow' \| 'focused' \| 'minimal'` | `'default'` |
| `_wm_card_layout` | `'default' \| 'board_only' \| 'compact_squad' \| 'squad_header'` | `'default'` |
| `_wm_platform_layers_variant` | `'grid' \| 'masonry_expand'` | `'grid'` |
| `_wm_bento_style` | `'dark_gradient' \| 'glass_blur'` | `'dark_gradient'` |
| `_wm_dept_avatar_overrides` | `Record<string, string>` | `{}` |
| `_wm_dept_color_overrides` | `Record<string, string>` | `{}` |
| `_wm_dept_order` | `string[]` | `[]` |
| `_wm_member_avatar_overrides` | `Record<string, string>` | `{}` |

### Agents Settings (in `sections_visibility`)

| Key | Type | Default |
|-----|------|---------|
| `_agents_hero_variant` | `'matrix' \| 'matrix_v2' \| 'radar' \| 'mcp_connect' \| 'branded'` | `'matrix'` |
| `_agents_messaging_tone` | tone enum | `'belong_here'` |
| `_agents_page_layout` | `'visual' \| 'plain_text'` | `'visual'` |
| `_agents_content_style` | `'v1' \| 'v2'` | `'v1'` |
| `_agents_show_frameworks` | boolean | false |
| `_agents_branded_title_style` | `'svg' \| 'ascii'` | `'ascii'` |
| `_agents_branded_glow_style` | `'wide' \| 'logo'` | `'wide'` |
| `_agents_hero_demo` | demo enum | `'none'` |

### Data Flow

```
Supabase site_settings (row 'main')
  → useSiteSettings() hook (strips _ prefixes, merges defaults)
    → Page component reads specific fields
      → Passes as props to child sections/variants
        → Sections render conditionally
```

---

## 6. Current Progress

### Fully Built & Polished

- **Agents Page** (`/agents`) — Hero with 5 variants, messaging tones, demo styles, frameworks showcase, human/agent toggle, mobile-optimized
- **Admin Panel** (`/admin`) — Full CRUD for settings, pages, case studies, design assets, battle cards, competitors
- **Work Management Page** (`/work-management`) — 8 sections assembled, 5 hero variants, interactive board with department switching, platform layers, solutions, enterprise, differentiators, CTA, footer. `WorkManagementLandingPage` passes full `settings` to `WorkManagementFirstFold` for variant/avatar overrides.
- **WM Admin Settings** — Complete control panel for all WM layout/variant/style options with department avatar/color/order customization
- **GTM Presentation** (`/gtm`) — Slides, assumptions, market trends, competitors
- **Homepage, Platform, Dynamic Pages** — All functional

### Work Management Page — Section Status

| Section | Component | Status |
|---------|-----------|--------|
| Nav | `WorkManagementNav` | Complete |
| First Fold (Hero) | `WorkManagementFirstFold` | Complete — 5 variants, board, cursors, department selector |
| Platform Layers | `WorkManagementPlatformLayers` | Complete — 2 variants (grid, masonry_expand) |
| Solutions | `WorkManagementSolutionsSection` | Complete — horizontal scroll cards |
| Enterprise | `WorkManagementEnterpriseSection` | Complete — security, Gartner, Forrester |
| What Sets Us Apart | `WorkManagementWhatSetsUsApart` | Complete — 4 differentiator cards |
| CTA | `WorkManagementCTASection` | Complete — purple gradient |
| Footer | `WorkManagementFooter` | Complete |

### Agent Assets (src/assets/)

| Asset | Purpose |
|-------|---------|
| `agent-assets-generator.png` | Agent icon used in `wmDepartmentData` / board |
| `agent-risk-analyzer.png` | Agent icon used in `wmDepartmentData` / board |
| `agent-vendor-researcher.png` | Agent icon used in `wmDepartmentData` / board |

### Built But Not in Page Layout

| Component | Status | Notes |
|-----------|--------|-------|
| `WorkManagementSquadSection` | Complete | Only `SQUAD_DEPARTMENTS` export is used by FirstFold |
| `ExecutionSystemSection` | Complete | Standalone execution demo; not imported anywhere |
| `WorkManagementBuildSection` | Partial | Placeholder "Build any app" UI |
| `WorkManagementLogosSection` | Partial | Text-only logos, no images |

### Architectural Decisions Made

1. **Tailwind CSS 4 with `@tailwindcss/vite`** — No `tailwind.config.js`; theme defined in `theme.css` using `@theme inline`
2. **Single Supabase settings row** — All settings in one `sections_visibility` JSON column, not separate tables
3. **Underscore-prefixed keys** — Settings keys use `_` prefix in DB, stripped by `useSiteSettings()`
4. **Variant pattern** — All configurable sections use variant enums controlled by admin; components switch rendering based on variant value
5. **Static department data** — `wmDepartmentData.ts` contains department definitions, board items, agent info as static TypeScript arrays (not from Supabase)
6. **Avatar overrides from Supabase** — While department data is static, avatar images can be overridden via `design_assets` table and `_wm_dept_avatar_overrides`
7. **motion/react for animation** — All animations use Framer Motion's `motion` package, prefer `AnimatePresence` for enter/exit
8. **Component-per-section pattern** — Each page section is its own file, page assembly files just compose them in order
9. **Admin gates features** — No feature renders without checking `useSiteSettings()` first
10. **Windows PowerShell** — No `&&` command chaining, no heredocs, use `;` or separate commands

---

## 7. Design System & Visual Conventions

| Token | Value |
|-------|-------|
| Brand teal | `#00D2D2` |
| Dark background | `#0a0a0a` |
| Card background | `#141414` |
| Card border | `#1e1e1e` |
| Red dot | `#FF3D57` |
| Yellow dot | `#FFCB00` |
| Green dot | `#00D2D2` |
| Blue dot | `#6161FF` |
| Purple dot | `#A25DDC` |
| Primary font | Poppins |
| Secondary fonts | Figtree, Inter, Outfit |

- Glow assets use `mixBlendMode: 'screen'` with CSS `maskImage` for fade-out
- Canvas API used for `DotGridBackground` rendering
- Company logos stored in `/public/logos/` as colorful SVGs/PNGs

---

## 8. Admin Panel Structure

The admin at `/admin` has a sidebar with grouped navigation:

| Group | Sections |
|-------|----------|
| Platform | AI Core Products, AI Capabilities, Departments |
| Customer Journeys | Outcomes, Pain Points, AI Transformations |
| Messaging & Proof | Case Studies |
| Sales Enablement | Competitors, Battle Cards, Knowledge Sources |
| Site Builder | Site Builder, Agents Page, Design Assets |

Work Management settings are accessed via **Site Builder → Work Management Page** card (not a sidebar item).

Settings are read on mount and upserted to `site_settings.sections_visibility` on save.

---

## 9. Build Phase — Next 10 Tasks

1. **Polish Work Management responsive/mobile layout** — The WM page sections (FirstFold, PlatformLayers, Solutions) need mobile breakpoint testing and fixes. The Agents page already has mobile polish; apply similar patterns to WM.

2. **Add logo images to WorkManagementLogosSection** — Currently renders text-only company names. Source actual SVG/PNG logos (Siemens, Coca-Cola, HP, Canva, Costco) and integrate them. Optionally add this section to the page layout between EnterpriseSection and WhatSetsUsApart.

3. **Integrate WorkManagementSquadSection into the page** — The squad section is fully built but not rendered. Decide on placement (after FirstFold or after PlatformLayers) and add it to `WorkManagementLandingPage.tsx`. Add an admin toggle (`_wm_show_squad_section`) to control visibility.

4. **Add scroll-triggered animations to WM sections** — Currently sections appear statically. Add `motion/react` viewport-triggered fade-in/slide-up animations similar to the Agents page sections. Use `whileInView` with `IntersectionObserver` threshold.

5. **Build a "How It Works" or product walkthrough section** — A step-by-step visual walkthrough showing the WM platform in action: (1) Set up workspace, (2) Assign agents, (3) Track execution. Could reuse the interactive board demo from FirstFold in a simplified form.

6. **Add testimonial/social proof section** — Pull from `case_studies` Supabase table or create a new WM-specific testimonial component with customer quotes, logos, and impact metrics (e.g., "346% ROI" from Motorola already referenced in Enterprise section).

7. **Complete WorkManagementBuildSection** — Currently a placeholder. Build out a real "Build any app in minutes" interactive demo with template cards, category filtering, and a search UI. Add to page layout with admin toggle.

8. **Add page-level SEO and meta tags** — Implement `<title>`, `<meta description>`, Open Graph tags, and Twitter cards for `/work-management`. Consider using `react-helmet-async` or Vite's `index.html` with dynamic injection.

9. **Implement A/B variant analytics** — Track which hero variant (`wm_first_fold_variant`) and layout combinations perform best. Add lightweight event tracking (could use Supabase or a simple analytics endpoint) for variant impressions and CTA clicks.

10. **Create WM-specific admin preview** — Add a live preview panel in `WorkManagementPageSettings.tsx` (similar to how `AgentsPageSettings` works) so admins can see variant changes in real-time before saving. Could use an iframe pointing to `/work-management` with query param overrides.

---

## 10. Key Files to Read First

If you're picking this up fresh, read these files in this order:

1. `src/main.tsx` — Routes and providers
2. `src/hooks/useSupabase.ts` — All hooks and the `SiteSettings` interface
3. `src/app/WorkManagementLandingPage.tsx` — WM page assembly
4. `src/app/components/workManagement/WorkManagementFirstFold.tsx` — Most complex WM component
5. `src/app/components/workManagement/wmDepartmentData.ts` — Static department data
6. `src/admin/components/WorkManagementPageSettings.tsx` — WM admin controls
7. `src/admin/AdminApp.tsx` — Admin shell and navigation
8. `src/styles/theme.css` — Design tokens and Tailwind theme

---

## 11. Development Commands

```powershell
# Start dev server
pnpm run dev

# Build for production
pnpm run build

# Deploy to Vercel
pnpm run deploy

# Backup Supabase data
pnpm run backup:save

# List backups
pnpm run backup:list
```

> **Remember:** This is Windows PowerShell. Do not use `&&` to chain commands. Use `;` or run commands separately.
