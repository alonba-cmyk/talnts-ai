import { WorkManagementNav } from '@/app/components/workManagement/WorkManagementNav';
import { WorkManagementFirstFold } from '@/app/components/workManagement/WorkManagementFirstFold';
import { WorkManagementSquadSection } from '@/app/components/workManagement/WorkManagementSquadSection';
import { ExecutionSystemSection } from '@/app/components/workManagement/ExecutionSystemSection';
import { WorkManagementLogosSection } from '@/app/components/workManagement/WorkManagementLogosSection';
import { WorkManagementSolutionsSection } from '@/app/components/workManagement/WorkManagementSolutionsSection';
import { WorkManagementEnterpriseSection } from '@/app/components/workManagement/WorkManagementEnterpriseSection';
import { WorkManagementBuildSection } from '@/app/components/workManagement/WorkManagementBuildSection';
import { WorkManagementWhatSetsUsApart } from '@/app/components/workManagement/WorkManagementWhatSetsUsApart';
import { WorkManagementCTASection } from '@/app/components/workManagement/WorkManagementCTASection';
import { WorkManagementFooter } from '@/app/components/workManagement/WorkManagementFooter';

export default function WorkManagementLandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <WorkManagementNav />
      <WorkManagementFirstFold />
      <WorkManagementSquadSection />
      <ExecutionSystemSection />
      <WorkManagementLogosSection />
      <WorkManagementSolutionsSection />
      <WorkManagementEnterpriseSection />
      <WorkManagementBuildSection />
      <WorkManagementWhatSetsUsApart />
      <WorkManagementCTASection />
      <WorkManagementFooter />
    </div>
  );
}
