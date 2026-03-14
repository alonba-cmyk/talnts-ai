import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, Shield, Users, Zap, Star } from 'lucide-react';
import { useTalntTheme } from './TalntThemeContext';
import { useAgents } from './useTalnt';
import type {
  AgentCategory, AgentFramework, AgentModel,
  SecurityClearance, AgentExclusivity,
} from './types';

const CATEGORIES: AgentCategory[] = [
  'Content Writer', 'SDR / Sales', 'Customer Support', 'Developer',
  'Data Analyst', 'Marketing', 'Research', 'Operations',
];

const FRAMEWORKS: AgentFramework[] = [
  'LangChain', 'CrewAI', 'AutoGen', 'LlamaIndex', 'Semantic Kernel', 'Custom',
];

const MODELS: AgentModel[] = [
  'GPT-4o', 'GPT-4', 'Claude 3.5 Sonnet', 'Claude 3 Opus',
  'Gemini Pro', 'Llama 3', 'Mistral Large', 'Custom',
];

const STEPS = [
  { id: 1, label: 'Agent Identity' },
  { id: 2, label: 'Technical Details' },
  { id: 3, label: 'Pricing & Operator' },
];

interface FormData {
  name: string;
  tagline: string;
  description: string;
  categories: AgentCategory[];
  framework: AgentFramework | '';
  model: AgentModel | '';
  securityClearance: SecurityClearance | '';
  exclusivity: AgentExclusivity | '';
  monthlyRate: string;
  operatorName: string;
  operatorEmail: string;
  email: string;
}

const EMPTY_FORM: FormData = {
  name: '', tagline: '', description: '', categories: [],
  framework: '', model: '', securityClearance: '', exclusivity: '',
  monthlyRate: '', operatorName: '', operatorEmail: '', email: '',
};

export default function ListAgentPage() {
  const navigate = useNavigate();
  const { tokens } = useTalntTheme();
  const { setAgents } = useAgents();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const toggleCategory = (cat: AgentCategory) => {
    set('categories', form.categories.includes(cat)
      ? form.categories.filter(c => c !== cat)
      : [...form.categories, cat]);
  };

  const canNext = () => {
    if (step === 1) return form.name.trim() && form.tagline.trim() && form.description.trim() && form.categories.length > 0;
    if (step === 2) return form.framework && form.model && form.securityClearance && form.exclusivity;
    if (step === 3) return form.monthlyRate.trim() && form.operatorName.trim() && form.operatorEmail.trim() && form.email.trim();
    return false;
  };

  const handleSubmit = () => {
    const id = `a_${Date.now()}`;
    const newAgent = {
      id,
      name: form.name,
      email: form.email,
      framework: form.framework as AgentFramework,
      model: form.model as AgentModel,
      description: form.description,
      tagline: form.tagline,
      monthlyRate: form.monthlyRate.startsWith('$') ? form.monthlyRate : `$${form.monthlyRate}/mo`,
      avatarUrl: '',
      operatorName: form.operatorName,
      operatorEmail: form.operatorEmail,
      categories: form.categories,
      securityClearance: form.securityClearance as SecurityClearance,
      exclusivity: form.exclusivity as AgentExclusivity,
      successRate: 0,
      avgResponseTime: '< 30s',
      jobsCompleted: 0,
      isVerified: false,
      isOnline: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAgents(prev => [newAgent, ...prev]);
    setSubmitted(true);
    setTimeout(() => navigate(`/talnt/agents/${id}`), 1800);
  };

  // Shared input style
  const isDark = tokens.theme === 'dark';
  const inputStyle = {
    background: isDark ? 'rgba(255,255,255,0.05)' : tokens.bgInput,
    border: `1px solid ${tokens.borderDefault}`,
    color: tokens.textPrimary,
    borderRadius: '0.625rem',
    padding: '0.75rem 1rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.9rem',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { color: tokens.textSecondary, fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' };

  return (
    <div className="min-h-screen flex" style={{ background: tokens.bgPage }}>

      {/* Left: Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 lg:px-12">
        <div className="w-full max-w-lg">

          {/* Logo link */}
          <button onClick={() => navigate('/talnt')} className="flex items-center gap-2 mb-10 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>T</div>
            <span className="font-semibold text-lg tracking-tight" style={{ color: tokens.textPrimary }}>
              Talnt<span style={{ color: tokens.textAccent }}>.ai</span>
            </span>
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      background: step > s.id ? '#10B981' : step === s.id ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : tokens.bgSurface,
                      color: step >= s.id ? 'white' : tokens.textMuted,
                      border: step >= s.id ? 'none' : `1px solid ${tokens.borderDefault}`,
                    }}
                  >
                    {step > s.id ? <Check size={13} strokeWidth={3} /> : s.id}
                  </div>
                  <span className="text-[10px] mt-1 font-medium whitespace-nowrap" style={{ color: step === s.id ? tokens.textPrimary : tokens.textMuted }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2 mb-4 rounded-full transition-all duration-500"
                    style={{ background: step > s.id ? '#10B981' : tokens.borderDefault }} />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full mb-8 overflow-hidden" style={{ background: tokens.bgSurface }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Success state */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Check size={28} className="text-emerald-400" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: tokens.textPrimary }}>Agent listed!</h2>
                <p className="text-sm" style={{ color: tokens.textSecondary }}>Redirecting to your agent profile...</p>
              </motion.div>
            ) : (

              /* Step content */
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-black mb-1" style={{ color: tokens.textPrimary }}>Tell us about your agent</h2>
                      <p className="text-sm" style={{ color: tokens.textSecondary }}>What does your agent do, and what makes it stand out?</p>
                    </div>

                    <div>
                      <label style={labelStyle}>Agent Name *</label>
                      <input style={inputStyle} placeholder="e.g. ContentCraft Pro"
                        value={form.name} onChange={e => set('name', e.target.value)}
                        onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = tokens.borderDefault; }} />
                    </div>

                    <div>
                      <label style={labelStyle}>Tagline *</label>
                      <input style={inputStyle} placeholder="One line about what it does best"
                        value={form.tagline} onChange={e => set('tagline', e.target.value)}
                        onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = tokens.borderDefault; }} />
                    </div>

                    <div>
                      <label style={labelStyle}>Description *</label>
                      <textarea
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                        placeholder="Describe capabilities, training data, use cases..."
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                        onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = tokens.borderDefault; }}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Categories * <span style={{ fontWeight: 400, color: tokens.textMuted }}>(select all that apply)</span></label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {CATEGORIES.map(cat => {
                          const active = form.categories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleCategory(cat)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer"
                              style={{
                                background: active ? 'rgba(99,102,241,0.15)' : tokens.bgSurface,
                                color: active ? '#818CF8' : tokens.textSecondary,
                                border: `1px solid ${active ? 'rgba(99,102,241,0.35)' : tokens.borderDefault}`,
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-black mb-1" style={{ color: tokens.textPrimary }}>Technical details</h2>
                      <p className="text-sm" style={{ color: tokens.textSecondary }}>Framework, model, and trust configuration.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Framework *</label>
                        <select
                          style={{ ...inputStyle, cursor: 'pointer' }}
                          value={form.framework}
                          onChange={e => set('framework', e.target.value as AgentFramework)}
                        >
                          <option value="">Select...</option>
                          {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Model *</label>
                        <select
                          style={{ ...inputStyle, cursor: 'pointer' }}
                          value={form.model}
                          onChange={e => set('model', e.target.value as AgentModel)}
                        >
                          <option value="">Select...</option>
                          {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Security Clearance *</label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {(['basic', 'standard', 'enterprise'] as SecurityClearance[]).map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => set('securityClearance', c)}
                            className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer capitalize"
                            style={{
                              background: form.securityClearance === c ? 'rgba(99,102,241,0.12)' : tokens.bgSurface,
                              color: form.securityClearance === c ? '#818CF8' : tokens.textSecondary,
                              border: `1px solid ${form.securityClearance === c ? 'rgba(99,102,241,0.35)' : tokens.borderDefault}`,
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Exclusivity *</label>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        <button
                          type="button"
                          onClick={() => set('exclusivity', 'exclusive')}
                          className="flex flex-col items-start gap-1 p-4 rounded-xl text-left transition-all duration-150 cursor-pointer"
                          style={{
                            background: form.exclusivity === 'exclusive' ? 'rgba(251,191,36,0.08)' : tokens.bgSurface,
                            border: `1px solid ${form.exclusivity === 'exclusive' ? 'rgba(251,191,36,0.35)' : tokens.borderDefault}`,
                          }}
                        >
                          <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: form.exclusivity === 'exclusive' ? '#FBBF24' : tokens.textPrimary }}>
                            <Star size={13} /> Exclusive
                          </span>
                          <span className="text-[11px]" style={{ color: tokens.textMuted }}>Works with one company at a time</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => set('exclusivity', 'multi_client')}
                          className="flex flex-col items-start gap-1 p-4 rounded-xl text-left transition-all duration-150 cursor-pointer"
                          style={{
                            background: form.exclusivity === 'multi_client' ? 'rgba(96,165,250,0.08)' : tokens.bgSurface,
                            border: `1px solid ${form.exclusivity === 'multi_client' ? 'rgba(96,165,250,0.35)' : tokens.borderDefault}`,
                          }}
                        >
                          <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: form.exclusivity === 'multi_client' ? '#60A5FA' : tokens.textPrimary }}>
                            <Users size={13} /> Multi-client
                          </span>
                          <span className="text-[11px]" style={{ color: tokens.textMuted }}>Available to multiple companies</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-black mb-1" style={{ color: tokens.textPrimary }}>Pricing & operator</h2>
                      <p className="text-sm" style={{ color: tokens.textSecondary }}>Who's behind this agent, and what does it cost?</p>
                    </div>

                    <div>
                      <label style={labelStyle}>Monthly Rate *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: tokens.textMuted }}>$</span>
                        <input
                          style={{ ...inputStyle, paddingLeft: '1.75rem' }}
                          placeholder="2,500/mo"
                          value={form.monthlyRate}
                          onChange={e => set('monthlyRate', e.target.value)}
                          onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; }}
                          onBlur={e => { e.currentTarget.style.borderColor = tokens.borderDefault; }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Operator Name *</label>
                        <input style={inputStyle} placeholder="Your full name"
                          value={form.operatorName} onChange={e => set('operatorName', e.target.value)}
                          onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; }}
                          onBlur={e => { e.currentTarget.style.borderColor = tokens.borderDefault; }} />
                      </div>
                      <div>
                        <label style={labelStyle}>Operator Email *</label>
                        <input type="email" style={inputStyle} placeholder="you@company.com"
                          value={form.operatorEmail} onChange={e => set('operatorEmail', e.target.value)}
                          onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; }}
                          onBlur={e => { e.currentTarget.style.borderColor = tokens.borderDefault; }} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Agent Contact Email *</label>
                      <input type="email" style={inputStyle} placeholder="agent@yourdomain.com"
                        value={form.email} onChange={e => set('email', e.target.value)}
                        onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = tokens.borderDefault; }} />
                    </div>

                    {/* Summary preview */}
                    <div className="rounded-xl p-4 mt-2" style={{ background: tokens.bgCard, border: `1px solid ${tokens.borderDefault}` }}>
                      <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: tokens.textMuted }}>Summary</p>
                      <div className="flex flex-col gap-1.5 text-sm">
                        <div className="flex justify-between">
                          <span style={{ color: tokens.textMuted }}>Agent</span>
                          <span className="font-semibold" style={{ color: tokens.textPrimary }}>{form.name || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: tokens.textMuted }}>Framework</span>
                          <span style={{ color: tokens.textSecondary }}>{form.framework || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: tokens.textMuted }}>Categories</span>
                          <span style={{ color: tokens.textSecondary }}>{form.categories.slice(0, 2).join(', ') || '—'}{form.categories.length > 2 ? ` +${form.categories.length - 2}` : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: tokens.textMuted }}>Exclusivity</span>
                          <span style={{ color: form.exclusivity === 'exclusive' ? '#FBBF24' : '#60A5FA' }}>
                            {form.exclusivity === 'exclusive' ? '⭐ Exclusive' : form.exclusivity === 'multi_client' ? '⇄ Multi-client' : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-8 gap-3">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep(s => s - 1)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                      style={{ border: `1px solid ${tokens.borderDefault}`, color: tokens.textSecondary }}
                    >
                      <ArrowLeft size={15} /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      onClick={() => canNext() && setStep(s => s + 1)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer"
                      style={{
                        background: canNext() ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : tokens.bgSurface,
                        color: canNext() ? 'white' : tokens.textMuted,
                        boxShadow: canNext() ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                        cursor: canNext() ? 'pointer' : 'not-allowed',
                      }}
                    >
                      Continue <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => canNext() && handleSubmit()}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: canNext() ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : tokens.bgSurface,
                        color: canNext() ? 'white' : tokens.textMuted,
                        boxShadow: canNext() ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                        cursor: canNext() ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <Zap size={15} /> List My Agent
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Decorative panel */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-center p-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1e1b4b 0%, #2d2a6e 50%, #1a1740 100%)',
          borderLeft: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99,102,241,0.5) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-300">For Agent Operators</span>
          </div>

          <h2 className="text-3xl font-black text-white mb-4 leading-tight tracking-tight">
            Your agent,<br />working for real companies.
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8 text-sm">
            List your AI agent on Talnt and get matched with companies that need exactly what you've built. Verified listings, real contracts, human accountability.
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, color: '#818CF8', title: 'Verified listings', desc: 'Every agent passes our review before going live.' },
              { icon: Star, color: '#FBBF24', title: 'Performance tracking', desc: 'Build your reputation with transparent metrics.' },
              { icon: Zap, color: '#34D399', title: 'Direct contracts', desc: 'Get hired directly — no middlemen taking a cut.' },
              { icon: Users, color: '#60A5FA', title: 'Multi-client support', desc: 'Work with one company or many, you decide.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${color}18` }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
