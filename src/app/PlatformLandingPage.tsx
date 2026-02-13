import { useState, useEffect } from 'react';
import { PlatformHero } from '@/app/components/platform/PlatformHero';
import { DepartmentBar } from '@/app/components/platform/DepartmentBar';
import { JTBDWorkspaceSection } from '@/app/components/platform/DepartmentJTBDSection';
import { PlatformArchitectureLayer } from '@/app/components/platform/PlatformArchitectureLayer';
import { useDepartments } from '@/hooks/useSupabase';

export default function PlatformLandingPage() {
  const { departments, loading } = useDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Auto-select marketing (or first) department
  useEffect(() => {
    if (departments.length > 0 && !selectedDeptId) {
      const marketing = departments.find((d) => d.name === 'marketing');
      setSelectedDeptId(marketing?.id || departments[0].id);
    }
  }, [departments, selectedDeptId]);

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || null;

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      <PlatformHero />

      <DepartmentBar
        departments={departments}
        loading={loading}
        selectedDeptId={selectedDeptId}
        onSelectDepartment={setSelectedDeptId}
      />

      <JTBDWorkspaceSection department={selectedDept} allDepartments={departments} />

      <PlatformArchitectureLayer />

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-gray-100">
        <p className="text-center text-sm text-gray-400">
          monday.com &middot; AI Work Platform
        </p>
      </footer>
    </div>
  );
}
