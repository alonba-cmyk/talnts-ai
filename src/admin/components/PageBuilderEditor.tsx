import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Save,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  Trash2,
  Check,
} from 'lucide-react';
import {
  usePageComponents,
  type PageComponentRow,
  syncHomepageToSiteSettings,
  syncPlatformToSiteSettings,
  migrateHomepageToPageComponents,
  migratePlatformToPageComponents,
  ensurePlatformComponents,
} from '@/hooks/useSupabase';
import { useSiteSettings } from '@/hooks/useSupabase';
import {
  getComponentMeta,
  getComponentsForPage,
  componentCategories,
  getComponentsGroupedByCategory,
  type ComponentTypeMeta,
} from '@/admin/componentRegistry';
import { ComponentWireframe } from './ComponentWireframes';
import { ComponentSettingsPanel } from './ComponentSettingsPanel';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/lib/supabase';

export interface PageBuilderEditorProps {
  pageId: 'homepage' | 'platform';
  onBack: () => void;
}

// ─── Sortable Component Card ──────────────────────────────────────────────────

interface SortableComponentCardProps {
  component: PageComponentRow;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleVisible: () => void;
  onDelete: () => void;
  onSettingsChange: (settings: Record<string, any>) => void;
  onNameChange: (name: string) => void;
}

function SortableComponentCard({
  component,
  index,
  isExpanded,
  onToggleExpand,
  onToggleVisible,
  onDelete,
  onSettingsChange,
  onNameChange,
}: SortableComponentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const meta = getComponentMeta(component.component_type);
  const cat = meta ? componentCategories[meta.category] : null;
  const catColor = cat?.color ?? '#6366f1';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all ${
        isDragging
          ? 'shadow-2xl ring-2 ring-indigo-500 bg-gray-800'
          : component.is_visible
            ? 'bg-gray-800/80 border-gray-700/60 hover:border-gray-600'
            : 'bg-gray-900/60 border-gray-800/40 opacity-55 hover:opacity-75'
      }`}
    >
      <div className="flex items-center gap-3 p-3.5">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-700 rounded-lg flex-shrink-0"
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>

        {/* Order Number */}
        <div className="w-6 h-6 rounded-md bg-gray-700/50 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-gray-400">{index + 1}</span>
        </div>

        {/* Wireframe Thumbnail */}
        <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-700/60 flex-shrink-0">
          <ComponentWireframe componentType={component.component_type} />
        </div>

        {/* Name + Category */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-medium text-sm">
              {component.display_name || meta?.name || component.component_type}
            </span>
            {meta && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${catColor}20`, color: catColor }}
              >
                {cat?.label ?? meta.category}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs truncate">
            {meta?.description ?? component.component_type}
          </p>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {component.is_visible ? (
            <Eye className="w-4 h-4 text-emerald-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-600" />
          )}
          <button
            onClick={onToggleVisible}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              component.is_visible ? 'bg-emerald-500' : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                component.is_visible ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={onToggleExpand}
          className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
            isExpanded
              ? 'bg-indigo-600/20 text-indigo-400'
              : 'text-gray-600 hover:bg-gray-700 hover:text-gray-400'
          }`}
          title={isExpanded ? 'Collapse settings' : 'Expand settings'}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
          title="Delete component"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Settings Panel */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-700/40 mt-0">
          <div className="pt-3">
            <ComponentSettingsPanel
              component={component}
              onSettingsChange={onSettingsChange}
              onNameChange={onNameChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Component Modal ────────────────────────────────────────────────────

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: 'homepage' | 'platform';
  onAdd: (meta: ComponentTypeMeta) => void;
}

function AddComponentModal({ isOpen, onClose, pageId, onAdd }: AddComponentModalProps) {
  const grouped = getComponentsGroupedByCategory().filter(
    (g) => g.components.some((c) => c.availableFor.includes(pageId))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Add Component</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {grouped.map(({ category, meta: catMeta, components }) => {
            const filtered = components.filter((c) => c.availableFor.includes(pageId));
            if (filtered.length === 0) return null;

            return (
              <div key={category}>
                <h4
                  className="text-sm font-medium mb-2"
                  style={{ color: catMeta.color }}
                >
                  {catMeta.label}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filtered.map((comp) => (
                    <button
                      key={comp.type}
                      onClick={() => {
                        onAdd(comp);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 bg-gray-800/60 hover:border-indigo-500/50 hover:bg-gray-800 text-left transition-colors"
                    >
                      <div className="w-14 h-10 rounded overflow-hidden border border-gray-600 flex-shrink-0">
                        <ComponentWireframe componentType={comp.type} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-white text-sm font-medium block truncate">
                          {comp.name}
                        </span>
                        <span className="text-gray-500 text-xs line-clamp-2">
                          {comp.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export function PageBuilderEditor({ pageId, onBack }: PageBuilderEditorProps) {
  const {
    components,
    loading,
    refetch,
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
  } = usePageComponents(pageId);

  const { settings: siteSettings, refetch: refetchSiteSettings } = useSiteSettings();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [platformVersion, setPlatformVersion] = useState<'v1' | 'v2' | 'v3' | 'v4'>('v1');

  useEffect(() => {
    if (pageId === 'platform' && siteSettings) {
      setPlatformVersion(siteSettings.platform_page_version || 'v1');
    }
  }, [pageId, siteSettings?.platform_page_version]);

  // Auto-migrate: when the page has no components yet, import from site_settings
  const [migrating, setMigrating] = useState(false);
  useEffect(() => {
    if (loading || migrating || components.length > 0) return;
    const doMigrate = async () => {
      setMigrating(true);
      try {
        const count =
          pageId === 'homepage'
            ? await migrateHomepageToPageComponents()
            : await migratePlatformToPageComponents();
        if (count > 0) {
          // Refresh the component list after migration
          refetch();
        }
      } catch (err) {
        console.error('Auto-migration failed:', err);
      } finally {
        setMigrating(false);
      }
    };
    doMigrate();
  }, [loading, components.length, pageId]);

  // Ensure newly-registered platform components are added
  const [ensured, setEnsured] = useState(false);
  useEffect(() => {
    if (loading || migrating || ensured || pageId !== 'platform' || components.length === 0) return;
    setEnsured(true);
    ensurePlatformComponents().then((count) => {
      if (count > 0) refetch();
    });
  }, [loading, migrating, ensured, pageId, components.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = components.findIndex((c) => c.id === active.id);
    const newIndex = components.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(components, oldIndex, newIndex);
    reorderComponents(reordered.map((c) => c.id));
    showSaved();
  };

  const handleToggleVisible = (id: string) => {
    const comp = components.find((c) => c.id === id);
    if (!comp) return;
    updateComponent(id, { is_visible: !comp.is_visible });
    showSaved();
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      deleteComponent(id);
      setDeleteConfirmId(null);
      showSaved();
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handleAddComponent = (meta: ComponentTypeMeta) => {
    addComponent({
      page_id: pageId,
      component_type: meta.type,
      display_name: meta.name,
      settings: { ...meta.defaultSettings },
      order_index: components.length,
      is_visible: true,
    });
    showSaved();
  };

  const handleSettingsChange = (id: string, newSettings: Record<string, any>) => {
    updateComponent(id, { settings: newSettings });
    showSaved();
  };

  const handleNameChange = (id: string, newName: string) => {
    updateComponent(id, { display_name: newName });
    showSaved();
  };

  const handlePlatformVersionChange = async (v: 'v1' | 'v2' | 'v3' | 'v4') => {
    setPlatformVersion(v);
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('sections_visibility')
        .eq('id', 'main')
        .single();
      const current = (data?.sections_visibility as Record<string, any>) || {};
      const { error } = await supabase
        .from('site_settings')
        .update({
          sections_visibility: { ...current, _platform_page_version: v },
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'main');
      if (error) throw error;
      await refetchSiteSettings();
      showSaved();
    } catch (err) {
      console.error('Failed to update platform version:', err);
    }
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    // Backward compatibility: sync to site_settings
    if (pageId === 'homepage') {
      syncHomepageToSiteSettings();
    } else if (pageId === 'platform') {
      syncPlatformToSiteSettings();
    }
  };

  const pageTitle = pageId === 'homepage' ? 'Homepage Builder' : 'Platform Page Builder';
  const pageDesc =
    pageId === 'homepage'
      ? 'Manage sections and components for the main landing page.'
      : 'Manage sections and components for the platform page.';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{pageDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {pageId === 'platform' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700">
              <span className="text-gray-400 text-sm">Version:</span>
              {(['v1', 'v2', 'v3', 'v4'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => handlePlatformVersionChange(v)}
                  className={`px-2 py-0.5 rounded text-sm font-medium transition-colors ${
                    platformVersion === v
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Component
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700">
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Auto-saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Component List */}
      <div className="space-y-3">
        {migrating ? (
          <div className="rounded-xl border border-dashed border-indigo-700/50 bg-indigo-950/20 p-12 text-center">
            <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-indigo-400 font-medium">Importing components from existing settings...</p>
            <p className="text-gray-500 text-sm mt-1">This only happens once</p>
          </div>
        ) : components.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-12 text-center">
            <p className="text-gray-500 mb-4">No components yet.</p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add your first component
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={components.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {components.map((comp, idx) => (
                  <SortableComponentCard
                    key={comp.id}
                    component={comp}
                    index={idx}
                    isExpanded={expandedId === comp.id}
                    onToggleExpand={() =>
                      setExpandedId(expandedId === comp.id ? null : comp.id)
                    }
                    onToggleVisible={() => handleToggleVisible(comp.id)}
                    onDelete={() => handleDelete(comp.id)}
                    onSettingsChange={(s) => handleSettingsChange(comp.id, s)}
                    onNameChange={(name) => handleNameChange(comp.id, name)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Delete confirmation toast */}
      {deleteConfirmId && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 shadow-lg flex items-center gap-3">
          <span className="text-sm text-white">Confirm delete?</span>
          <button
            onClick={() => handleDelete(deleteConfirmId)}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteConfirmId(null)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Add Component Modal */}
      <AddComponentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        pageId={pageId}
        onAdd={handleAddComponent}
      />
    </div>
  );
}
