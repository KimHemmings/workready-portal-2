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
  initialWhy = 'Creating a stable routine and financial security for my family',
  initialGoal = 'Apply for 6–8 warehouse or logistics roles and complete 1 skill module'
}) => {
  const { activeContract } = usePortal();
  const isRto = activeContract === 'RTO';

  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);

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
    <section className="bg-[#24083b] rounded-3xl p-2 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden">
      
      {/* Decorative ambient glow on the purple background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {!reviewSubmitted ? (
        <div className="space-y-6 relative z-10">
          
          {/* HEADER ON PURPLE BACKGROUND */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 sm:px-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-400 text-[#24083b] rounded-2xl shadow-sm shrink-0">
                <Target className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {isRto ? "Career & Employability Studio" : "Personal Goal & Motivation Studio"}
                </h2>
                <p className="text-sm text-purple-200 font-medium mt-1">
                  {isRto 
                    ? "Target your qualification and unlock personalized industry career tracks."
                    : "Reflect on what motivates you and let us know if you need assistance."}
                </p>
              </div>
            </div>
          </div>

          {/* TABS ON PURPLE BACKGROUND */}
          <div className="flex flex-wrap items-center gap-2 px-2 sm:px-0">
            {[
              { num: 1, label: isRto ? '1. Career Ambition' : '1. What Motivates Me' },
              { num: 2, label: '2. Action Focus' },
              { num: 3, label: isRto ? '3. Career Boosters' : '3. Support Request' }
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setWizardStep(s.num)}
                className={`px-5 py-2.5 rounded-full text-sm transition-all cursor-pointer ${
                  wizardStep === s.num
                    ? 'bg-white text-[#24083b] font-black shadow-lg scale-[1.02]'
                    : 'bg-white/10 border border-white/10 text-purple-100 font-semibold hover:bg-white/20'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* INNER WHITE CARD (The Workspace) */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-2xl border-4 border-[#320b52] text-slate-800">
            
            {/* STEP 1 */}
            {wizardStep === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="text-base font-black text-[#24083b] flex items-center gap-2">
                  <Heart className="w-5 h-5 text-amber-500 fill-amber-500" /> 
                  {isRto ? "What is your primary goal after training?" : "What is your main personal reason for finding the right job?"}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Creating a stable routine and financial security for my family',
                    'Building independence and getting my driver license or vehicle',
                    'Learning practical, hands-on skills in a supportive team',
                    'Re-entering the workforce and rebuilding my self-confidence'
                  ].map((option) => {
                    const active = myWhyMotivation === option && !customWhyInput;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setMyWhyMotivation(option);
                          setCustomWhyInput('');
                        }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-purple-50 border-purple-600 text-purple-950 font-bold shadow-sm ring-4 ring-purple-600/10'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:shadow-md font-medium'
                        }`}
                      >
                        <span className="text-sm leading-relaxed block">{option}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Or write your own motivation:</label>
                  <input
                    type="text"
                    value={customWhyInput}
                    onChange={(e) => setCustomWhyInput(e.target.value)}
                    placeholder="e.g. Saving for a house deposit..."
                    className="w-full p-4 bg-slate-50 hover:bg-white border-2 border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl text-sm outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-[#24083b] font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Next: Action Focus</span>
                    <ArrowRight className="w-4 h-4 stroke-3" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {wizardStep === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="text-base font-black text-[#24083b] flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" /> 
                  How would you prefer to structure your efforts this month?
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'balanced', title: 'Balanced Pathway', desc: 'Apply for 6–8 roles + 1 skill module + 1 interview practice' },
                    { id: 'jobsearch', title: 'Active Job Seeker', desc: 'Focus heavily on tailoring resumes & submitting applications' },
                    { id: 'skillfirst', title: 'Skill & Confidence', desc: 'Focus first on short safety modules & interview prep' }
                  ].map((path) => {
                    const active = actionPathway === path.id;
                    return (
                      <button
                        key={path.id}
                        type="button"
                        onClick={() => {
                          setActionPathway(path.id);
                          setPrimaryGoal(path.desc);
                        }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-purple-50 border-purple-600 text-purple-950 shadow-sm ring-4 ring-purple-600/10'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:shadow-md'
                        }`}
                      >
                        <span className={`block font-black text-sm mb-1.5 ${active ? 'text-purple-900' : 'text-slate-800'}`}>{path.title}</span>
                        <span className={`text-xs leading-relaxed block ${active ? 'font-semibold' : 'font-medium'}`}>
                          {path.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-[#24083b] font-black rounded-xl cursor-pointer flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>Next: Confidence & Support</span>
                    <ArrowRight className="w-4 h-4 stroke-3" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {wizardStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Barriers */}
                <div className="space-y-4">
                  <label className="text-sm font-black text-[#24083b] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> 
                    {isRto ? "1. Select target Career Boosters:" : "1. Where would you like an extra boost? (Unlocks modules):"}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {BARRIER_OPTIONS.map((barrier) => {
                      const active = selectedBarriers.includes(barrier.id);
                      return (
                        <button
                          key={barrier.id}
                          type="button"
                          onClick={() => toggleBarrier(barrier.id)}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                            active
                              ? 'bg-purple-50 border-purple-600 shadow-sm ring-2 ring-purple-600/10'
                              : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all ${
                            active ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-slate-50'
                          }`}>
                            {active && <Check className="w-3.5 h-3.5 stroke-3" />}
                          </div>
                          <span className={`text-sm ${active ? 'font-bold text-purple-950' : 'font-medium text-slate-600'}`}>
                            {barrier.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pillars */}
                <div className="space-y-4">
                  <label className="text-sm font-black text-[#24083b] flex items-center gap-2">
                    <Smile className="w-5 h-5 text-emerald-500" /> 
                    2. Rate your current confidence (1 = Need Support, 5 = Confident):
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.keys(pillarScores).map((pillar) => (
                      <div key={pillar} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
                        <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                          {pillar}
                        </span>
                        <div className="flex items-center gap-1 justify-center">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setPillarScores((prev) => ({ ...prev, [pillar]: score }))}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-all cursor-pointer ${
                                pillarScores[pillar] === score
                                  ? 'bg-emerald-500 text-white font-black shadow-sm ring-2 ring-emerald-500/30'
                                  : 'bg-white border border-slate-200 text-slate-500 font-semibold hover:border-emerald-300'
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

                {/* Direct Support Note */}
                <div className="space-y-4">
                  <label className="text-sm font-black text-[#24083b] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" /> 
                    3. Do you need direct assistance or funding support?
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {[
                      '👔 Interview Clothes',
                      '🚗 License / Fuel',
                      '🛠️ Work Boots & PPE',
                      '🚌 Transport Card',
                      '📄 Course Fee'
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSupportTag(supportTag === tag ? '' : tag)}
                        className={`px-4 py-2 rounded-full font-bold text-xs border-2 transition-all cursor-pointer ${
                          supportTag === tag
                            ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={supportNote}
                    onChange={(e) => setSupportNote(e.target.value)}
                    placeholder="Optional note to your coach..."
                    className="w-full p-4 bg-slate-50 hover:bg-white border-2 border-slate-200 text-slate-800 placeholder-slate-400 rounded-2xl text-sm outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Check className="w-5 h-5 stroke-3" /> Save Plan & Unlock Tracks
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* COLLAPSED VIEW ON PURPLE BACKGROUND */
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 px-2 sm:px-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-400 text-[#24083b] font-black text-xs rounded-full flex items-center gap-1.5 shadow-sm">
                <Heart className="w-3.5 h-3.5 fill-[#24083b]" /> {isRto ? "Career Anchor" : "My 'Why' Anchor"}
              </span>
              <span className="px-3 py-1 bg-white/10 text-amber-300 font-bold text-xs rounded-full flex items-center gap-1.5 border border-white/10">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 3-Day Streak
              </span>
            </div>
            <p className="text-lg font-black text-white italic">"{myWhyMotivation}"</p>
            <p className="text-sm text-purple-200 font-medium pt-1">
              Monthly Focus: <strong className="text-amber-300">{primaryGoal}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setReviewSubmitted(false);
              setWizardStep(1);
            }}
            className="px-5 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Update Goal Plan
          </button>
        </div>
      )}
    </section>
  );
};

export default PersonalGoalStudio;