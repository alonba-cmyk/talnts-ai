import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, RotateCcw, TrendingUp, Target, Sparkles, Users, Clock, Zap, Link2, Shield, Check } from 'lucide-react';
import { useBusinessValues, BusinessValue, Department, SupportedFeature, iconMap, getIconComponent } from '@/contexts/BusinessValuesContext';

interface BusinessValuesEditorProps {
  onBack?: () => void;
}

// ─── Embeddable Panel (for use inside Departments editor) ────────────────────

interface BusinessValuesPanelProps {
  departmentName: string; // e.g. 'marketing', 'sales'
}

export function BusinessValuesPanel({ departmentName }: BusinessValuesPanelProps) {
  const dept = departmentName.toLowerCase() as Department;
  const { getValuesForDepartment, updateValue, addValue, deleteValue, resetToDefault } = useBusinessValues();

  const [editingValue, setEditingValue] = useState<BusinessValue | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const departmentValues = getValuesForDepartment(dept);

  const handleSave = (value: BusinessValue) => {
    if (isCreating) {
      addValue(dept, value);
    } else {
      updateValue(dept, value);
    }
    setEditingValue(null);
    setIsCreating(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDelete = (valueId: string) => {
    if (confirm('Are you sure you want to delete this value?')) {
      deleteValue(dept, valueId);
    }
  };

  const handleCreate = () => {
    setEditingValue({
      id: '',
      iconName: 'TrendingUp',
      title: '',
      description: '',
      supportedBy: [],
      replacesTools: [],
    });
    setIsCreating(true);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">
          Value propositions for this department. These are used in landing pages and marketing materials.
        </p>
        <div className="flex items-center gap-2">
          {showSaved && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          <button
            onClick={() => { if (confirm(`Reset all values for ${dept} to defaults?`)) resetToDefault(dept); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 text-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {departmentValues.map((value, idx) => {
          const Icon = getIconComponent(value.iconName);
          return (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm mb-0.5">{value.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-2">{value.description}</p>
                  {value.supportedBy.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {value.supportedBy.map(feature => (
                        <span key={feature} className="px-1.5 py-0.5 text-[10px] bg-gray-800 text-gray-400 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-0.5">
                  <button
                    onClick={() => { setEditingValue(value); setIsCreating(false); }}
                    className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-500 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(value.id)}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add New */}
        <button
          onClick={handleCreate}
          className="bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-gray-900 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-emerald-400"
        >
          <Plus className="w-6 h-6" />
          <span className="text-sm font-medium">Add New Value</span>
        </button>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingValue && (
          <EditValueModal
            value={editingValue}
            isNew={isCreating}
            onSave={handleSave}
            onClose={() => { setEditingValue(null); setIsCreating(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const departments: { id: Department; label: string }[] = [
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
  { id: 'operations', label: 'Operations' },
  { id: 'support', label: 'Support' },
  { id: 'product', label: 'Product' },
  { id: 'legal', label: 'Legal' },
  { id: 'finance', label: 'Finance' },
  { id: 'hr', label: 'HR' },
];

const availableIcons = [
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Target', icon: Target },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Users', icon: Users },
  { name: 'Clock', icon: Clock },
  { name: 'Zap', icon: Zap },
  { name: 'Link2', icon: Link2 },
  { name: 'Shield', icon: Shield },
];

const supportedByOptions: { id: SupportedFeature; label: string }[] = [
  { id: 'WM', label: 'Work Management' },
  { id: 'CRM', label: 'CRM' },
  { id: 'Campaigns', label: 'Campaigns' },
  { id: 'Service', label: 'Service' },
  { id: 'Dev', label: 'Dev' },
  { id: 'Sidekick', label: 'Sidekick' },
  { id: 'Agents', label: 'Agents' },
];

export function BusinessValuesEditor({ onBack }: BusinessValuesEditorProps) {
  const { values, getValuesForDepartment, updateValue, addValue, deleteValue, resetToDefault } = useBusinessValues();
  
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('marketing');
  const [editingValue, setEditingValue] = useState<BusinessValue | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const departmentValues = getValuesForDepartment(selectedDepartment);

  const handleSave = (value: BusinessValue) => {
    if (isCreating) {
      addValue(selectedDepartment, value);
    } else {
      updateValue(selectedDepartment, value);
    }
    setEditingValue(null);
    setIsCreating(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDelete = (valueId: string) => {
    if (confirm('Are you sure you want to delete this value?')) {
      deleteValue(selectedDepartment, valueId);
    }
  };

  const handleCreate = () => {
    setEditingValue({
      id: '',
      iconName: 'TrendingUp',
      title: '',
      description: '',
      supportedBy: [],
      replacesTools: [],
    });
    setIsCreating(true);
  };

  const handleReset = () => {
    if (confirm(`Reset all values for ${selectedDepartment} to defaults?`)) {
      resetToDefault(selectedDepartment);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Business Values</h2>
              <p className="text-gray-400 text-sm">Edit value propositions for each department</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showSaved && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400">
              <Check className="w-4 h-4" />
              Saved!
            </div>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex gap-2 bg-gray-900 p-1 rounded-xl overflow-x-auto">
        {departments.map(dept => (
          <button
            key={dept.id}
            onClick={() => setSelectedDepartment(dept.id)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              selectedDepartment === dept.id
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {departmentValues.map((value, idx) => {
          const Icon = getIconComponent(value.iconName);
          return (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold mb-1">{value.title}</h4>
                  <p className="text-gray-400 text-sm line-clamp-2">{value.description}</p>
                  
                  {/* Supported By */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {value.supportedBy.map(feature => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingValue(value);
                      setIsCreating(false);
                    }}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(value.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add New Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleCreate}
          className="bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl p-8 hover:border-emerald-500/50 hover:bg-gray-900 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-emerald-400"
        >
          <Plus className="w-8 h-8" />
          <span className="font-medium">Add New Value</span>
        </motion.button>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingValue && (
          <EditValueModal
            value={editingValue}
            isNew={isCreating}
            onSave={handleSave}
            onClose={() => {
              setEditingValue(null);
              setIsCreating(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Edit Modal Component
function EditValueModal({ 
  value, 
  isNew, 
  onSave, 
  onClose 
}: { 
  value: BusinessValue; 
  isNew: boolean; 
  onSave: (value: BusinessValue) => void; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<BusinessValue>({ ...value });
  const [replacesToolsInput, setReplacesToolsInput] = useState(value.replacesTools?.join(', ') || '');

  const handleSubmit = () => {
    const tools = replacesToolsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    onSave({
      ...formData,
      replacesTools: tools,
    });
  };

  const toggleSupportedBy = (feature: SupportedFeature) => {
    setFormData(prev => ({
      ...prev,
      supportedBy: prev.supportedBy.includes(feature)
        ? prev.supportedBy.filter(f => f !== feature)
        : [...prev.supportedBy, feature],
    }));
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">
            {isNew ? 'Add New Value' : 'Edit Value'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {availableIcons.map(({ name, icon: IconComp }) => (
                <button
                  key={name}
                  onClick={() => setFormData(prev => ({ ...prev, iconName: name }))}
                  className={`p-3 rounded-xl transition-all ${
                    formData.iconName === name
                      ? 'bg-emerald-500/30 border-2 border-emerald-500 text-emerald-400'
                      : 'bg-gray-800 border-2 border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g., Drive Demand Generation"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Brief description of the business value..."
            />
          </div>

          {/* Supported By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Supported By</label>
            <div className="flex flex-wrap gap-2">
              {supportedByOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleSupportedBy(option.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.supportedBy.includes(option.id)
                      ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Replaces Tools */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Replaces Tools <span className="text-gray-500 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={replacesToolsInput}
              onChange={(e) => setReplacesToolsInput(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g., HubSpot, Marketo, Pardot"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.description}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isNew ? 'Add Value' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
