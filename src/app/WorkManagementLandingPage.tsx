import { useSiteSettings, type SiteSettings } from '@/hooks/useSupabase';
import { WorkManagementNav } from '@/app/components/workManagement/WorkManagementNav';
import { WorkManagementFirstFold } from '@/app/components/workManagement/WorkManagementFirstFold';
import { WorkManagementPlatformLayers } from '@/app/components/workManagement/WorkManagementPlatformLayers';
import { WorkManagementSolutionsSection } from '@/app/components/workManagement/WorkManagementSolutionsSection';
import { WorkManagementEnterpriseSection } from '@/app/components/workManagement/WorkManagementEnterpriseSection';
import { WorkManagementWhatSetsUsApart } from '@/app/components/workManagement/WorkManagementWhatSetsUsApart';
import { WorkManagementCTASection } from '@/app/components/workManagement/WorkManagementCTASection';
import { WorkManagementFooter } from '@/app/components/workManagement/WorkManagementFooter';

export default function WorkManagementLandingPage() {
  const { settings, loading } = useSiteSettings();
  const isDark = settings?.wm_dark_mode ?? false;

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  return (
    <div className={`min-h-screen scroll-smooth ${isDark ? 'dark bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}`}>
      <WorkManagementNav isDark={isDark} />
      <WorkManagementFirstFold settings={settings as SiteSettings} />
      <WorkManagementPlatformLayers />
      <WorkManagementSolutionsSection />
      <WorkManagementEnterpriseSection />
      <WorkManagementWhatSetsUsApart />
      <WorkManagementCTASection />
      <WorkManagementFooter />
    </div>
  );
}
