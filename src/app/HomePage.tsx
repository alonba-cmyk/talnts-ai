import { useHomePage } from '@/hooks/useSupabase';
import App from './App';

/**
 * HomePage wrapper — checks if a homepage page exists in the Pages system.
 * If found (published + is_homepage=true), passes its config as overrides to App.
 * If not found, renders App with default site_settings behavior.
 */
export default function HomePage() {
  const { page: homePage, loading } = useHomePage();

  // While checking for homepage, don't block — App has its own loading state
  // We pass the override once we know it exists
  if (loading) {
    // Render App without overrides while homepage check is in progress
    // App will show its own loading state for site_settings
    return <App />;
  }

  if (homePage) {
    return (
      <App
        pageOverride={{
          sections_visibility: homePage.sections_visibility,
          sections_order: homePage.sections_order,
          hero_settings: homePage.hero_settings,
        }}
      />
    );
  }

  // No homepage page configured — use default site_settings
  return <App />;
}
