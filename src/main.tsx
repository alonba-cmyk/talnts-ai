import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomePage from "./app/HomePage.tsx";
import AdminApp from "./admin/AdminApp.tsx";
import DynamicPage from "./app/DynamicPage.tsx";
import App from "./app/App.tsx";
import BattleCardsApp from "./app/BattleCardsApp.tsx";
import PlatformLandingPage from "./app/PlatformLandingPage.tsx";
import AgentsLandingPage from "./app/AgentsLandingPage.tsx";
import WorkManagementLandingPage from "./app/WorkManagementLandingPage.tsx";
import GTMStrategyPresentation from "./app/GTMStrategyPresentation.tsx";
import { BusinessValuesProvider } from "./contexts/BusinessValuesContext.tsx";
import { VibeThemeProvider } from "./contexts/VibeThemeContext.tsx";
import "./styles/index.css";

const TalntLayout = lazy(() => import("./app/talnt/TalntLayout.tsx"));
const TalntLanding = lazy(() => import("./app/talnt/TalntLanding.tsx"));
const BrowseAgentsPage = lazy(() => import("./app/talnt/BrowseAgentsPage.tsx"));
const BrowseJobsPage = lazy(() => import("./app/talnt/BrowseJobsPage.tsx"));
const AgentProfilePage = lazy(() => import("./app/talnt/AgentProfilePage.tsx"));
const JobDetailPage = lazy(() => import("./app/talnt/JobDetailPage.tsx"));
const CompanyRegisterPage = lazy(() => import("./app/talnt/company/CompanyRegisterPage.tsx"));
const CompanyLoginPage = lazy(() => import("./app/talnt/company/CompanyLoginPage.tsx"));
const CompanyDashboardPage = lazy(() => import("./app/talnt/company/CompanyDashboardPage.tsx"));
const PostJobPage = lazy(() => import("./app/talnt/company/PostJobPage.tsx"));
const AgentRegisterPage = lazy(() => import("./app/talnt/agent/AgentRegisterPage.tsx"));
const ListAgentPage = lazy(() => import("./app/talnt/ListAgentPage.tsx"));
const AgentLoginPage = lazy(() => import("./app/talnt/agent/AgentLoginPage.tsx"));
const AgentDashboardPage = lazy(() => import("./app/talnt/agent/AgentDashboardPage.tsx"));

// Preview route wrapper - renders a single section for admin preview
function SectionPreviewPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  return <App previewSection={sectionId || null} />;
}

// Note: SidekickThemeProvider is now inside App.tsx and AdminApp.tsx
// so it can receive themes from Supabase site settings
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <BusinessValuesProvider>
      <VibeThemeProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminApp />} />
          <Route path="/battle-cards" element={<BattleCardsApp />} />
          <Route path="/platform" element={<PlatformLandingPage />} />
          <Route path="/agents" element={<AgentsLandingPage />} />
          <Route path="/monday-homepage" element={<WorkManagementLandingPage />} />
          <Route path="/gtm" element={<GTMStrategyPresentation />} />
          <Route path="/preview/:sectionId" element={<SectionPreviewPage />} />
          <Route path="/p/:slug" element={<DynamicPage />} />
          <Route path="/talnt" element={<Suspense fallback={<div className="min-h-screen" style={{ background: '#FAFBFC' }} />}><TalntLayout /></Suspense>}>
            <Route index element={<Suspense fallback={null}><TalntLanding /></Suspense>} />
            <Route path="agents" element={<Suspense fallback={null}><BrowseAgentsPage /></Suspense>} />
            <Route path="agents/:id" element={<Suspense fallback={null}><AgentProfilePage /></Suspense>} />
            <Route path="jobs" element={<Suspense fallback={null}><BrowseJobsPage /></Suspense>} />
            <Route path="jobs/:id" element={<Suspense fallback={null}><JobDetailPage /></Suspense>} />
            <Route path="company/register" element={<Suspense fallback={null}><CompanyRegisterPage /></Suspense>} />
            <Route path="company/login" element={<Suspense fallback={null}><CompanyLoginPage /></Suspense>} />
            <Route path="company/dashboard" element={<Suspense fallback={null}><CompanyDashboardPage /></Suspense>} />
            <Route path="company/post-job" element={<Suspense fallback={null}><PostJobPage /></Suspense>} />
            <Route path="agent/register" element={<Suspense fallback={null}><AgentRegisterPage /></Suspense>} />
            <Route path="list-agent" element={<Suspense fallback={null}><ListAgentPage /></Suspense>} />
            <Route path="agent/login" element={<Suspense fallback={null}><AgentLoginPage /></Suspense>} />
            <Route path="agent/dashboard" element={<Suspense fallback={null}><AgentDashboardPage /></Suspense>} />
          </Route>
        </Routes>
      </VibeThemeProvider>
    </BusinessValuesProvider>
  </BrowserRouter>
);
