import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, ExternalLink, GripVertical, Save, Copy, Eye, EyeOff } from 'lucide-react';
import { usePages, type PageRow } from '@/hooks/useSupabase';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Section Labels (same as SiteSettingsEditor) ──────────────────────────────

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  hero_alternative: 'Hero Alternative (White)',
  hero_outcome_cards: 'Hero Outcome Cards (Two-column)',
  work_comparison: 'Work Comparison (Black/White)',
  sidekick_capabilities: 'Sidekick (Half story)',
  sidekick: 'Sidekick (Full story)',
  departments: 'Departments Selector',
  ai_platform: 'AI Work Platform',
  project_management: 'Project Management (New World)',
  agents_showcase: 'Agents Showcase (monday agents)',
  teams_and_agents: 'Teams and Agents',
  teams_and_agents_v2: 'Teams and Agents V2 (Multi-Layout)',
  ai_platform_architecture: 'AI Platform Architecture (Vision)',
  team_commands: 'Team Commands (Interactive)',
};

const allSectionKeys = Object.keys(sectionLabels);

// ─── Sortable Section Card ────────────────────────────────────────────────────

interface SortableSectionCardProps {
  id: string;
  label: string;
  isVisible: boolean;
  onToggle: () => void;
}

function SortableSectionCard({ id, label, isVisible, onToggle }: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-gray-800 rounded-lg transition-opacity ${
        isVisible ? '' : 'opacity-60'
      } ${isDragging ? 'shadow-xl ring-2 ring-indigo-500' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-700 rounded"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        <div>
          <span className="text-white text-sm font-medium">{label}</span>
          <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
            isVisible
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-600/20 text-gray-500'
          }`}>
            {isVisible ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          isVisible ? 'bg-indigo-600' : 'bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            isVisible ? 'left-6' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

// ─── Slug Helper ──────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60);
}

// ─── Pages Editor Component ───────────────────────────────────────────────────

interface PagesEditorProps {
  onBack: () => void;
}

export function PagesEditor({ onBack }: PagesEditorProps) {
  const { pages, loading, addPage, updatePage, deletePage, refetch } = usePages();
  const [editingPage, setEditingPage] = useState<PageRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ─── List Mode ─────────────────────────────────────────────────────────────

  const handleCreatePage = async () => {
    try {
      await addPage({
        title: 'New Landing Page',
        slug: `page-${Date.now()}`,
        status: 'draft',
        sections_visibility: { hero: true },
        sections_order: ['hero'],
      });
    } catch (err: any) {
      console.error('Failed to create page:', err.message);
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deletePage(id);
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Failed to delete page:', err.message);
    }
  };

  const handleDuplicatePage = async (page: PageRow) => {
    try {
      await addPage({
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy-${Date.now()}`,
        status: 'draft',
        sections_visibility: page.sections_visibility,
        sections_order: page.sections_order,
        department_id: page.department_id,
        outcome_id: page.outcome_id,
        meta_description: page.meta_description,
      });
    } catch (err: any) {
      console.error('Failed to duplicate page:', err.message);
    }
  };

  // ─── Edit Mode ─────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!editingPage) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await updatePage(editingPage.id, {
        title: editingPage.title,
        slug: editingPage.slug,
        meta_description: editingPage.meta_description,
        department_id: editingPage.department_id,
        outcome_id: editingPage.outcome_id,
        sections_visibility: editingPage.sections_visibility,
        sections_order: editingPage.sections_order,
        hero_settings: editingPage.hero_settings,
        is_homepage: editingPage.is_homepage,
        status: editingPage.status,
      });
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err: any) {
      setSaveMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!editingPage) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = editingPage.sections_order.indexOf(active.id as string);
      const newIndex = editingPage.sections_order.indexOf(over.id as string);
      setEditingPage({
        ...editingPage,
        sections_order: arrayMove(editingPage.sections_order, oldIndex, newIndex),
      });
    }
  };

  const toggleSection = (sectionKey: string) => {
    if (!editingPage) return;
    const newVisibility = {
      ...editingPage.sections_visibility,
      [sectionKey]: !editingPage.sections_visibility[sectionKey],
    };
    setEditingPage({ ...editingPage, sections_visibility: newVisibility });
  };

  const handleAddSection = (sectionKey: string) => {
    if (!editingPage) return;
    if (editingPage.sections_order.includes(sectionKey)) return;
    setEditingPage({
      ...editingPage,
      sections_order: [...editingPage.sections_order, sectionKey],
      sections_visibility: { ...editingPage.sections_visibility, [sectionKey]: true },
    });
  };

  const availableSections = allSectionKeys.filter(
    k => !editingPage?.sections_order.includes(k)
  );

  // ─── Edit View ─────────────────────────────────────────────────────────────

  if (editingPage) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setEditingPage(null); refetch(); }}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Page</h2>
              <p className="text-gray-400 text-sm">
                {editingPage.status === 'published' ? (
                  <a
                    href={`/p/${editingPage.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    /p/{editingPage.slug} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-gray-500">/p/{editingPage.slug} (draft)</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className={`text-sm ${saveMessage.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {saveMessage}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Page Details */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-white font-semibold mb-4">Page Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={e => {
                    const title = e.target.value;
                    setEditingPage({ ...editingPage, title, slug: slugify(title) });
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">/p/</span>
                  <input
                    type="text"
                    value={editingPage.slug}
                    onChange={e => setEditingPage({ ...editingPage, slug: slugify(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-400 text-sm mb-1">Meta Description</label>
                <textarea
                  value={editingPage.meta_description}
                  onChange={e => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="mt-4 flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <span className="text-white font-medium">Status</span>
                <span className={`ml-3 text-xs px-2 py-1 rounded ${
                  editingPage.status === 'published'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {editingPage.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <button
                onClick={() => setEditingPage({
                  ...editingPage,
                  status: editingPage.status === 'published' ? 'draft' : 'published',
                })}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  editingPage.status === 'published' ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    editingPage.status === 'published' ? 'left-8' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Homepage Toggle */}
            <div className="mt-3 flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div>
                <span className="text-white font-medium">Set as Homepage</span>
                <span className={`ml-3 text-xs px-2 py-1 rounded ${
                  editingPage.is_homepage
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-600/20 text-gray-500'
                }`}>
                  {editingPage.is_homepage ? 'Homepage' : 'Regular Page'}
                </span>
                {editingPage.is_homepage && (
                  <p className="text-gray-500 text-xs mt-1">This page controls what visitors see at /</p>
                )}
              </div>
              <button
                onClick={() => setEditingPage({
                  ...editingPage,
                  is_homepage: !editingPage.is_homepage,
                })}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  editingPage.is_homepage ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    editingPage.is_homepage ? 'left-8' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Hero Settings (shown when hero section is visible) */}
          {editingPage.sections_visibility.hero && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4">Hero Settings</h3>
              <p className="text-gray-400 text-sm mb-4">
                Customize the hero section appearance. Leave empty to use defaults from Site Settings.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Headline Text</label>
                  <input
                    type="text"
                    value={editingPage.hero_settings?.headline_text || ''}
                    onChange={e => setEditingPage({
                      ...editingPage,
                      hero_settings: { ...editingPage.hero_settings, headline_text: e.target.value },
                    })}
                    placeholder="Empowering every team"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Headline Gradient Text</label>
                  <input
                    type="text"
                    value={editingPage.hero_settings?.headline_gradient_text || ''}
                    onChange={e => setEditingPage({
                      ...editingPage,
                      hero_settings: { ...editingPage.hero_settings, headline_gradient_text: e.target.value },
                    })}
                    placeholder="to accelerate business impact"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Platform Label</label>
                  <input
                    type="text"
                    value={editingPage.hero_settings?.platform_label || ''}
                    onChange={e => setEditingPage({
                      ...editingPage,
                      hero_settings: { ...editingPage.hero_settings, platform_label: e.target.value },
                    })}
                    placeholder="AI Work Platform"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Font Size</label>
                  <select
                    value={editingPage.hero_settings?.font_size || 'large'}
                    onChange={e => setEditingPage({
                      ...editingPage,
                      hero_settings: { ...editingPage.hero_settings, font_size: e.target.value },
                    })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Sections Configuration */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-white font-semibold mb-4">Sections</h3>
            <p className="text-gray-400 text-sm mb-4">
              Drag to reorder. Toggle visibility for each section.
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={editingPage.sections_order}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {editingPage.sections_order.map(sectionKey => (
                    <SortableSectionCard
                      key={sectionKey}
                      id={sectionKey}
                      label={sectionLabels[sectionKey] || sectionKey}
                      isVisible={!!editingPage.sections_visibility[sectionKey]}
                      onToggle={() => toggleSection(sectionKey)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add section */}
            {availableSections.length > 0 && (
              <div className="mt-4">
                <label className="block text-gray-400 text-sm mb-2">Add a section</label>
                <div className="flex flex-wrap gap-2">
                  {availableSections.map(key => (
                    <button
                      key={key}
                      onClick={() => handleAddSection(key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-xs hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {sectionLabels[key] || key}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── List View ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Landing Pages</h2>
            <p className="text-gray-400 text-sm">
              {pages.length} page{pages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleCreatePage}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading pages...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && pages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900 rounded-xl border border-gray-800">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-white font-semibold mb-2">No pages yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first landing page to get started</p>
          <button
            onClick={handleCreatePage}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Page
          </button>
        </div>
      )}

      {/* Pages List */}
      {!loading && pages.length > 0 && (
        <div className="space-y-3">
          {pages.map(page => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-medium truncate">{page.title}</h3>
                  {page.is_homepage && (
                    <span className="text-xs px-2 py-0.5 rounded flex-shrink-0 bg-blue-500/20 text-blue-400">
                      Homepage
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                    page.status === 'published'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {page.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-gray-500 text-sm">{page.is_homepage ? '/ (homepage)' : `/p/${page.slug}`}</span>
                  <span className="text-gray-600 text-xs">
                    {Object.values(page.sections_visibility).filter(Boolean).length} sections visible
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {page.status === 'published' && (
                  <a
                    href={`/p/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    title="Open page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleDuplicatePage(page)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingPage(page)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {deleteConfirm === page.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-xs"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(page.id)}
                    className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
