import React, { useState } from 'react';
import { 
  Target, 
  Heart, 
  Smile, 
  MessageSquare, 
  Sparkles, 
  Check, 
  Flame, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export interface GoalStudioSubmitData {
  myWhyMotivation: string;
  primaryGoal: string;
  actionPathway: string;
  supportTag: string;
  supportNote: string;
  pillarScores: Record<string, number>;
  selectedBarriers: string[];
}

interface PersonalGoalStudioProps {
  onSaveGoalPlan: (data: GoalStudioSubmitData) => void;
  candidateName?: string;
  initialWhy?: string;
  initialGoal?: string;
}

export const PersonalGoalStudio: React.FC<PersonalGoalStudioProps> = ({
  onSaveGoalPlan,
  candidateName = 'Alex',
  initialWhy = 'Creating a stable routine and financial security for my family',
  initialGoal = 'Apply for 6–8 warehouse or logistics roles and complete 1 skill module'
}) => {
  const { activeContract } = usePortal();
  const isRto = activeContract === 'RTO';
  const isTtW = activeContract === 'TtW';
  const isDes = (activeContract as string) === 'Inclusive Employment Australia (IEA)' || activeContract === 'DES';

  // Persistence & View Modes
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Form State
  const [myWhyMotivation, setMyWhyMotivation] = useState<string>(initialWhy);
  const [customWhyInput, setCustomWhyInput] = useState<string>('');
  const [actionPathway, setActionPathway] = useState<string>('balanced');
  const [primaryGoal, setPrimaryGoal] = useState<string>(initialGoal);
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>([]);
  const [supportTag, setSupportTag] = useState<string>('');
  const [supportNote, setSupportNote] = useState<string>('');

  const [pillarScores, setPillarScores] = useState<Record<string, number>>({
    'Job Applications': 3,
    'Interview Readiness': 3,
    'Technical & Core Skills': 3,
    'Transport & Location': 4,
    'Workplace Mindset': 4,
  });

  const toggleBarrier = (id: string) => {
    setSelectedBarriers((prev) => 
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    const finalWhy = customWhyInput.trim() || myWhyMotivation;
    onSaveGoalPlan({
      myWhyMotivation: finalWhy,
      primaryGoal,
      actionPathway,
      supportTag,
      supportNote,
      pillarScores,
      selectedBarriers
    });
    setMyWhyMotivation(finalWhy);
    setReviewSubmitted(true);
  };

  const BARRIER_OPTIONS = isRto ? [
    { id: 'WORKPLACE_CULTURE', label: 'Commercial Site Safety & Employer Expectations' },
    { id: 'COMMUNICATION', label: 'Professional Communication & Teamwork in Industry' },
    { id: 'RESUME_ATS', label: 'Translating My Qualification to Pass ATS Screeners' },
    { id: 'DIGITAL_LITERACY', label: 'Digital Application Systems & Portals' },
    { id: 'INTERVIEW_ANXIETY', label: 'Trade-Specific STAR Behavioral Interview Practice' },
    { id: 'FINANCIAL_LOGISTICS', label: 'Work Readiness, Tooling & Relocation Budgeting' }
  ] : [
    { id: 'WORKPLACE_CULTURE', label: 'Understanding what employers expect on day one' },
    { id: 'COMMUNICATION', label: 'Speaking up & workplace team communication' },
    { id: 'RESUME_ATS', label: 'Refreshing my resume to pass online screening' },
    { id: 'DIGITAL_LITERACY', label: 'Applying online & using computer systems' },
    { id: 'INTERVIEW_ANXIETY', label: 'Practicing interview answers with confidence' },
    { id: 'FINANCIAL_LOGISTICS', label: 'Budgeting before first pay or managing fares' }
  ];

  return (
    <section className="bg-linear-to-r from-purple-950 via-[#24083b] to-purple-900 text-white rounded-2xl p-6 shadow-xl border border-purple-800 relative overflow-hidden">
      {!reviewSubmitted ? (
        <div className="space-y-5 relative z-10 text-xs">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-black shadow-md shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  {isRto ? "Graduate Career & Employability Studio" : "My Personal Goal & Motivation Studio"}
                </h2>
                <p className="text-xs text-purple-200 font-medium mt-0.5">
                  {isRto 
                    ? "Target your qualification, set your transition pace, and unlock personalized industry career tracks."
                    : "There are no wrong answers here. Reflect on what motivates you, set your monthly pace, and let us know if you need assistance."}
                </p>
              </div>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: isRto ? '1. My Career Ambition' : '1. What Motivates Me' },
              { num: 2, label: '2. My Monthly Action Focus' },
              { num: 3, label: isRto ? '3. Career Boosters & Support' : '3. Confidence & Support Request' }
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setWizardStep(s.num)}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer ${
                  wizardStep === s.num
                    ? 'bg-amber-300 text-slate-950 shadow-md'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/80'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* STEP 1 */}
          {wizardStep === 1 && (
            <div className="space-y-3 bg-purple-900/40 p-4 rounded-xl border border-purple-700/50">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-amber-300" /> 
                {isRto ? "What is your primary goal after completing your training?" : "What is your main personal reason for wanting to find the right job?"}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Creating a stable routine and financial security for my family',
                  'Building independence and getting my driver license or vehicle',
                  'Learning practical, hands-on skills in a supportive team environment',
                  'Re-entering the workforce and rebuilding my self-confidence'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setMyWhyMotivation(option);
                      setCustomWhyInput('');
                    }}
                    className={`p-3 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                      myWhyMotivation === option && !customWhyInput
                        ? 'bg-white text-slate-950 border-amber-300 font-bold shadow-md'
                        : 'bg-purple-950/80 text-purple-100 border-purple-700/60 hover:bg-purple-900'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold text-purple-200 mb-1">Or write your own personal motivation:</label>
                <input
                  type="text"
                  value={customWhyInput}
                  onChange={(e) => setCustomWhyInput(e.target.value)}
                  placeholder="e.g. Saving for a house deposit and growing my career in logistics..."
                  className="w-full p-2.5 bg-purple-950/90 border border-purple-700 text-purple-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-5 py-2 bg-amber-300 text-slate-950 font-black rounded-xl hover:bg-amber-400 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Next: Choose Action Focus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {wizardStep === 2 && (
            <div className="space-y-3 bg-purple-900/40 p-4 rounded-xl border border-purple-700/50">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> How would you prefer to structure your efforts this month?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'balanced', title: 'Balanced Pathway', desc: 'Apply for 6–8 roles + 1 skill module + 1 interview practice' },
                  { id: 'jobsearch', title: 'Active Job Seeker', desc: 'Focus heavily on tailoring resumes & submitting job applications' },
                  { id: 'skillfirst', title: 'Skill & Confidence Builder', desc: 'Focus first on short LMS safety modules & interview prep' }
                ].map((path) => (
                  <button
                    key={path.id}
                    type="button"
                    onClick={() => {
                      setActionPathway(path.id);
                      setPrimaryGoal(path.desc);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      actionPathway === path.id
                        ? 'bg-white text-slate-950 border-amber-300 shadow-md font-bold'
                        : 'bg-purple-950/80 text-purple-100 border-purple-700/60 hover:bg-purple-900'
                    }`}
                  >
                    <span className="block font-black text-xs mb-1">{path.title}</span>
                    <span className="text-[11px] font-normal leading-relaxed opacity-90">{path.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 bg-purple-900 text-purple-200 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-5 py-2 bg-amber-300 text-slate-950 font-black rounded-xl hover:bg-amber-400 cursor-pointer flex items-center gap-1"
                >
                  <span>Next: Confidence & Support Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {wizardStep === 3 && (
            <div className="space-y-4 bg-purple-900/40 p-4 rounded-xl border border-purple-700/50">
              
              {/* Dynamic Barrier Selection */}
              <div>
                <label className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 
                  {isRto 
                    ? "1. Select your target Career Boosters (Recommends tailored modules):"
                    : "1. Where would you like an extra boost? (Unlocks targeted LMS modules):"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BARRIER_OPTIONS.map((barrier) => {
                    const active = selectedBarriers.includes(barrier.id);
                    return (
                      <button
                        key={barrier.id}
                        type="button"
                        onClick={() => toggleBarrier(barrier.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-300 text-slate-950 border-amber-400 font-bold shadow-lg scale-[1.01]'
                            : 'bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-white/40 shadow-sm'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
                          active ? 'bg-purple-950 border-purple-950 text-white' : 'border-white/50 bg-black/20'
                        }`}>
                          {active && <Check className="w-3 h-3 stroke-3" />}
                        </div>
                        <span className="text-[11.5px] font-semibold leading-tight">{barrier.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confidence Pillars */}
              <div className="pt-2 border-t border-purple-800/80">
                <label className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                  <Smile className="w-4 h-4" /> 2. Rate your current confidence across key pillars (1 = Support, 5 = Confident):
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.keys(pillarScores).map((pillar) => (
                    <div key={pillar} className="bg-white/10 p-2.5 rounded-xl border border-white/20 flex flex-col justify-between space-y-2 backdrop-blur-xs">
                      <span className="text-[11px] font-bold text-purple-100 leading-tight">
                        {pillar}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => setPillarScores((prev) => ({ ...prev, [pillar]: score }))}
                            className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              pillarScores[pillar] === score
                                ? 'bg-emerald-400 text-slate-950 border-emerald-300 ring-2 ring-emerald-300/50 font-black shadow-md'
                                : 'bg-black/25 text-purple-200 border-white/10 hover:bg-white/20 hover:text-white'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Support Request */}
              <div className="pt-2 border-t border-purple-800/80 space-y-3">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> 3. Do you need direct assistance or funding support from your coach?
                </label>

                <div className="flex flex-wrap gap-2">
                  {[
                    '👔 Interview Clothes / Work Attire',
                    '🚗 Driver License Lessons & Fuel',
                    '🛠️ Work Boots & PPE Safety Gear',
                    '🚌 Public Transport Card',
                    '📄 White Card / License Course Fee'
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSupportTag(supportTag === tag ? '' : tag)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                        supportTag === tag
                          ? 'bg-amber-300 text-slate-950 border-amber-400 font-black shadow-md scale-105'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-xs'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    value={supportNote}
                    onChange={(e) => setSupportNote(e.target.value)}
                    placeholder="Optional note to your coach (e.g. Have an upcoming interview next Tuesday and need steel-cap boots)..."
                    className="w-full p-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white placeholder-purple-200/60 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 bg-purple-900 text-purple-200 font-bold rounded-xl cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Plan & Unlock Tracks
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Collapsed View */
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 relative z-10 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-300 text-slate-950 font-black rounded-full flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-slate-950" /> {isRto ? "My Career Anchor" : "My Personal 'Why' Anchor"}
              </span>
              <span className="px-3 py-1 bg-purple-800 text-purple-100 font-bold rounded-full flex items-center gap-1 border border-purple-700">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 🔥 3-Day Momentum Streak
              </span>
              {selectedBarriers.length > 0 && (
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold rounded-full">
                  🎯 {selectedBarriers.length} Focus {selectedBarriers.length === 1 ? 'Track' : 'Tracks'} Unlocked
                </span>
              )}
            </div>
            <p className="text-sm font-black text-white italic">"{myWhyMotivation}"</p>
            <p className="text-xs text-purple-200 font-medium">Monthly Focus: <strong className="text-amber-300">{primaryGoal}</strong></p>
            {supportTag && (
              <p className="text-[11px] text-amber-200 font-bold flex items-center gap-1 pt-0.5">
                <MessageSquare className="w-3 h-3 text-amber-300" /> Support Requested: <u>{supportTag}</u>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setReviewSubmitted(false);
              setWizardStep(1);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all shrink-0 cursor-pointer"
          >
            Update Goal Plan
          </button>
        </div>
      )}
    </section>
  );
};

export default PersonalGoalStudio;