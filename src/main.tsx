import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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
          <Route path="/work-management" element={<WorkManagementLandingPage />} />
          <Route path="/gtm" element={<GTMStrategyPresentation />} />
          <Route path="/preview/:sectionId" element={<SectionPreviewPage />} />
          <Route path="/p/:slug" element={<DynamicPage />} />
        </Routes>
      </VibeThemeProvider>
    </BusinessValuesProvider>
  </BrowserRouter>
);
