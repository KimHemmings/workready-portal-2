import React, { useState } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Award,
  Download
} from "lucide-react";
import CertificateModal, { type CertificateData } from "@/components/CertificateModal";
import { QUIZ_DATA, type QuizQuestion } from "@/data/quizQuestions";

export interface LMSModule {
  id: string;
  title: string;
  category: string;
  estimatedMinutes: number;
  description: string;
  studyGuide: string[];
}

export const MODULES_LIST: LMSModule[] = [
  {
    id: "mod-1",
    title: "WHS & Workplace Rights in Australia",
    category: "Non-Vocational Compliance",
    estimatedMinutes: 30,
    description: "Understand Work Health & Safety fundamentals, hazard reporting, and NES worker entitlements.",
    studyGuide: [
      "1. Duty of Care: Employers must provide a safe environment; employees must follow safety procedures.",
      "2. Hazard Reporting: Identify and report slip/trip/fall hazards immediately to safety officers.",
      "3. National Employment Standards (NES): 11 statutory entitlements protecting all Australian employees.",
      "4. Emergency Evacuation: Memorize emergency assembly points and exit routes in your workplace.",
      "5. PPE Compliance: Correctly wear required Personal Protective Equipment (PPE) at all times on site.",
      "6. Incident Logging: Report all injuries or near-misses immediately, no matter how minor.",
      "7. Ergonomics: Set up workstations correctly to prevent repetitive strain injuries.",
      "8. Manual Handling: Use proper lifting techniques (bend knees, keep loads close to body).",
      "9. Anti-Bullying Laws: Understand Fair Work Ombudsman protections against workplace harassment.",
      "10. Right to Refuse Unsafe Work: Employees can refuse tasks that pose imminent danger to health.",
      "11. Workplace Fatigue: Manage rest breaks and report excessive fatigue affecting safety.",
      "12. Chemical Safety (SDS): Consult Safety Data Sheets before handling hazardous workplace materials.",
      "13. First Aid Access: Know the location of first aid kits and designated first aid officers.",
      "14. Whistleblower Protections: Understand safety escalation rights without fear of reprisal.",
      "15. Consultation Rights: Participate in workplace safety committees and toolbox talks."
    ]
  },
  {
    id: "mod-2",
    title: "STAR Method Interview Technique",
    category: "Non-Vocational Job Prep",
    estimatedMinutes: 30,
    description: "Structuring compelling behavioral interview answers using Situation, Task, Action, and Result.",
    studyGuide: [
      "1. Situation & Task: Briefly set the context (20% of your total response time).",
      "2. Action Focus: Detail the specific steps YOU personally took to resolve the challenge (60% of response).",
      "3. Measurable Results: End with quantifiable outcomes, metrics, or lessons learned (20% of response).",
      "4. Arrival Etiquette: Arrive 10-15 minutes prior to your scheduled interview start time.",
      "5. Technical Gaps: Be honest about technical unknowns while demonstrating enthusiasm to learn.",
      "6. Body Language: Maintain positive eye contact, open posture, and professional greetings.",
      "7. Materials: Bring hard copies of your tailored resume, reference contact lists, and notes.",
      "8. Employer Research: Study the organization's core mission and values prior to your interview.",
      "9. Closing Questions: Ask insightful questions about team culture and daily role expectations.",
      "10. Professional Dressing: Align your attire with or slightly above the employer's workplace standard.",
      "11. Positive Framing: Frame past employment transitions or challenges constructively.",
      "12. Follow-Up Courtesy: Send a brief thank-you email to the interviewer within 24 hours.",
      "13. Remote Interview Prep: Test webcams, audio, lighting, and quiet room setups beforehand.",
      "14. Clarification Requests: Politely ask interviewers to clarify or repeat ambiguous questions.",
      "15. Confidence Mindset: Reframe interview nerves into positive enthusiasm for the position."
    ]
  },
  {
    id: "mod-3",
    title: "Effective Workplace Communication",
    category: "Non-Vocational Core Skills",
    estimatedMinutes: 25,
    description: "Master professional verbal, non-verbal, and written communication in modern Australian workplaces.",
    studyGuide: [
      "1. Active Listening: Pay full attention, summarize key points back, and clarify instructions before acting.",
      "2. Professional Email Etiquette: Keep subject lines concise, maintain respectful tone, and proofread.",
      "3. Constructive Feedback: Accept constructive notes as growth opportunities without becoming defensive.",
      "4. De-escalation: Respond calmly to customer complaints using neutral, empathetic language.",
      "5. Teamwork Dynamics: Collaborate actively to ensure shift tasks are completed safely and efficiently.",
      "6. Initiative: Identify quiet shift periods and ask team leaders how you can assist.",
      "7. Punctuality Impact: Arrive on time to avoid placing unfair pressure on shift co-workers.",
      "8. Customer Service Excellence: Strive to create positive, helpful experiences for every client.",
      "9. Digital Messaging: Keep Slack or Microsoft Teams chats concise, clear, and work-appropriate.",
      "10. Phone Courtesy: Speak clearly, state your name, and capture accurate messages.",
      "11. Handover Reports: Provide structured end-of-shift updates to oncoming team members.",
      "12. Cultural Competency: Demonstrate inclusive behavior in multicultural work environments.",
      "13. Incident Logging: Record workplace incidents objectively without emotional bias.",
      "14. Conflict Resolution: Address minor peer friction directly and respectfully before escalating.",
      "15. Manager Check-ins: Provide regular task status updates to supervisors."
    ]
  },
  {
    id: "mod-4",
    title: "Resume Tailoring & Employment Gaps",
    category: "Non-Vocational Employment",
    estimatedMinutes: 25,
    description: "Aligning your skills with Job Description Keywords and framing career gaps with confidence.",
    studyGuide: [
      "1. Honest Gap Framing: Frame employment gaps constructively by highlighting upskilling and personal growth.",
      "2. Functional Layouts: Utilize skill-based resume structures when returning from extended career breaks.",
      "3. Community & Training: List volunteer work and short courses under Professional Development.",
      "4. Spoken Explanations: Keep spoken interview responses regarding work gaps brief (2-3 sentences).",
      "5. Initiative & Growth: Demonstrate self-directed learning during periods between formal jobs.",
      "6. Targeted Cover Letters: Introduce your value and connect your background to the employer's needs.",
      "7. Privacy Safeguards: Exclude sensitive details like full street address, age, or marital status.",
      "8. Transferable Skills: Emphasize core capabilities that transition across different industry sectors.",
      "9. ATS Formatting: Use clean typography and bullet points for Applicant Tracking System readability.",
      "10. Keyword Matching: Mirror key verb terms directly from job vacancy advertisements.",
      "11. Resume Length: Maintain a 1 to 2 page resume length for standard Australian job applications.",
      "12. Action Verbs: Begin bullet points with strong action verbs (e.g., Coordinated, Managed, Built).",
      "13. Proofreading: Check for grammatical errors and typo-free formatting.",
      "14. Reference Prep: Contact references prior to submitting their contact details to hiring teams.",
      "15. Digital Storage: Keep updated PDF and Word versions accessible in your digital locker."
    ]
  },
  {
    id: "mod-5",
    title: "SMART Goal Setting & Action Planning",
    category: "Non-Vocational Life Skills",
    estimatedMinutes: 20,
    description: "Setting actionable career goals, overcoming barriers, and tracking mutual obligation progress.",
    studyGuide: [
      "1. Specific Goals: Define precise target outcomes (e.g., Obtain White Card certificate).",
      "2. Measurable Targets: Establish concrete metrics to track your weekly progress.",
      "3. Achievable Milestones: Set realistic goals aligned with your current skills and support resources.",
      "4. Relevant Objectives: Ensure short-term tasks directly advance your long-term career path.",
      "5. Time-Bound Deadlines: Set target dates to build momentum and avoid procrastination.",
      "6. Barrier Identification: Address practical challenges (e.g., transport, tickets) early with your Provider.",
      "7. Application Logging: Maintain systematic records of job applications for compliance proof.",
      "8. Micro-Habits: Break large career objectives into manageable daily action steps.",
      "9. Strategy Adjustments: Review application feedback with your Case Manager every 3-4 weeks.",
      "10. Skill Refreshes: Take short modules during job search periods to maintain continuous learning.",
      "11. Provider Resources: Access available funding support for uniforms, tools, and licenses.",
      "12. Task Prioritization: Focus energy on high-impact job search activities first each day.",
      "13. Persistence: Maintain consistent effort even when application callbacks are delayed.",
      "14. Logbook Discipline: Record employer contacts and reference numbers promptly.",
      "15. Milestone Rewards: Recognize personal achievements upon hitting monthly targets."
    ]
  },
  {
    id: "mod-6",
    title: "Workplace Reliability & Professional Etiquette",
    category: "Non-Vocational Life Skills",
    estimatedMinutes: 20,
    description: "Punctuality, shift attendance protocols, mobile phone policies, and workplace conduct.",
    studyGuide: [
      "1. Absence Protocol: Notify your supervisor via phone call prior to shift start if sick or delayed.",
      "2. Phone Etiquette: Limit personal mobile phone use strictly to scheduled rest and meal breaks.",
      "3. Quiet Period Initiative: Restock supplies or ask supervisors for tasks during downtime.",
      "4. Feedback Receptivity: Listen attentively to manager guidance during probation periods.",
      "5. Shared Spaces: Keep break rooms and communal areas clean and hygienic.",
      "6. Shift Preparation: Arrive 5-10 minutes prior to shift start, ready in uniform.",
      "7. Confidentiality: Protect customer and proprietary business information at all times.",
      "8. Positive Workplace Culture: Avoid workplace gossip to maintain a supportive team environment.",
      "9. Dress Code Adherence: Ensure work attire meets safety and employer presentation standards.",
      "10. Break Timings: Adhere strictly to allocated break start and finish times.",
      "11. Equipment Care: Treat workplace tools and machinery with respect and proper maintenance.",
      "12. Team Communication: Inform co-workers when stepping away from active work areas.",
      "13. Problem Escalation: Raise operational concerns with team leaders before problems grow.",
      "14. Professional Boundaries: Maintain appropriate interactions with colleagues and clients.",
      "15. Consistent Performance: Deliver steady, reliable work quality across every shift."
    ]
  },
  {
    id: "mod-7",
    title: "Financial Literacy, Pay Slips & Tax",
    category: "Non-Vocational Life Skills",
    estimatedMinutes: 20,
    description: "Understanding Tax File Numbers, superannuation, gross vs net pay, and Centrelink reporting.",
    studyGuide: [
      "1. Gross vs Net Pay: Gross is total earnings before deductions; Net is take-home pay.",
      "2. Payment Arrears: Plan for initial 2-4 week pay cycles when starting a new position.",
      "3. Centrelink Reporting: Report gross income earned during the specific reporting fortnight.",
      "4. Tax-Free Threshold: Claim the $18,200 threshold on your TFN declaration for your primary job.",
      "5. Budgeting Strategy: Base personal budget calculations on guaranteed base hours, not overtime.",
      "6. Provider Assistance: Access clothing, boot, and ticket support through your Employment Provider.",
      "7. Receipt Tracking: Keep digital copies of work-related expenses for tax deduction time.",
      "8. Pay Slip Checks: Verify hourly rates, gross pay, tax withheld, and super contributions weekly.",
      "9. Superannuation Guarantee: Ensure compulsory employer super payments enter your chosen fund.",
      "10. TFN Declaration: Submit your Tax File Number declaration promptly to avoid top-rate withholding.",
      "11. Award Conditions: Understand minimum pay rates set by Fair Work Modern Awards.",
      "12. Allowance Tracking: Check that meal, travel, or uniform allowances appear on pay slips.",
      "13. Emergency Savings: Build a modest financial buffer for unexpected living expenses.",
      "14. Super Fund Choice: Select a high-performing super fund to protect long-term retirement savings.",
      "15. Payroll Inquiries: Address pay slip discrepancies politely with payroll managers."
    ]
  },
  {
    id: "mod-8",
    title: "Mental Health, Resilience & Shift Wellness",
    category: "Non-Vocational Well-Being",
    estimatedMinutes: 20,
    description: "Managing job search fatigue, de-escalating shift stress, and prioritizing mental health support.",
    studyGuide: [
      "1. Reframe Rejection: View application knockbacks as routine steps, not personal failure.",
      "2. Employee Support (EAP): Access free, confidential employer counseling programs when available.",
      "3. Sleep Hygiene: Prioritize 7-9 hours of restful sleep in dark, screen-free environments.",
      "4. Anxiety De-escalation: Use box breathing (in 4s, hold 4s, out 4s) to calm acute stress.",
      "5. Bulk-Billed Care: Access Medicare bulk-billed mental health plans via your local GP.",
      "6. Imposter Syndrome: Recognize early job self-doubt as temporary and normal.",
      "7. Shift Decompression: Take dedicated time to unwind after demanding shifts to prevent burnout.",
      "8. Hydration & Nutrition: Maintain proper hydration and balanced meals on physical shifts.",
      "9. Routine & Structure: Keep a consistent daily schedule during job search periods.",
      "10. Social Connection: Stay connected with supportive friends, family, and community groups.",
      "11. Physical Activity: Incorporate daily outdoor movement or exercise to boost mood.",
      "12. Boundary Setting: Separate job search effort hours from personal rest and relaxation time.",
      "13. Early Warning Signs: Identify early signs of fatigue or low mood and seek prompt advice.",
      "14. Mindfulness Practice: Spend 5 minutes daily on grounding exercises or mental pauses.",
      "15. Provider Support: Discuss wellness or scheduling adjustments openly with your Case Manager."
    ]
  }
];

interface Props {
  onModuleCompleted?: (moduleId: string, pbasPoints: number) => void;
}

export default function LmsModuleHub({ onModuleCompleted }: Props) {
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(["mod-1"]);
  const [activeModule, setActiveModule] = useState<LMSModule | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScorePercent, setQuizScorePercent] = useState<number | null>(null);
  
  // Unified Landscape Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null);

  const handleOpenModule = (module: LMSModule) => {
    setActiveModule(module);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizScorePercent(null);
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextStep = () => {
    if (!activeModule) return;
    const questions = QUIZ_DATA[activeModule.id] || [];

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
          correctCount++;
        }
      });

      const calculatedScore = Math.round((correctCount / questions.length) * 100);
      setQuizScorePercent(calculatedScore);

      // Pass threshold: >= 75% (6 out of 8 correct)
      if (calculatedScore >= 75) {
        if (!completedModuleIds.includes(activeModule.id)) {
          setCompletedModuleIds((prev) => [...prev, activeModule.id]);
          if (onModuleCompleted) {
            onModuleCompleted(activeModule.id, 15);
          }
        }
      }
    }
  };

  const handleOpenLandscapeCertificate = (moduleTitle: string) => {
    setActiveCertificate({
      id: `CERT-${Date.now()}`,
      candidateName: "Alex Mercer",
      courseTitle: moduleTitle,
      completionDate: new Date().toLocaleDateString("en-AU"),
      score: quizScorePercent ?? 88,
      verificationCode: `WR-MOD-${Math.floor(100000 + Math.random() * 900000)}`,
      issuerName: "Casey (Case Manager)"
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">LMS Non-Vocational Modules</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Pre-Employment Units
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete 15-point modules, pass 8-question quizzes, earn +15 PBAS points per unit, and view landscape certificates.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 w-fit">
          {completedModuleIds.length} of {MODULES_LIST.length} Units Complete
        </div>
      </div>

      {/* MODULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODULES_LIST.map((mod) => {
          const isCompleted = completedModuleIds.includes(mod.id);
          return (
            <div
              key={mod.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {mod.category}
                  </span>
                  {isCompleted ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {mod.estimatedMinutes}m
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{mod.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mod.description}</p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleOpenModule(mod)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    isCompleted
                      ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  }`}
                >
                  {isCompleted ? "Revise Module" : "Start Unit (+15 Pts)"}
                </button>

                {isCompleted && (
                  <button
                    onClick={() => handleOpenLandscapeCertificate(mod.title)}
                    className="w-full py-1.5 px-2 rounded text-[11px] font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-1 transition-all"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> View Landscape Certificate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODULE & QUIZ MODAL */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{activeModule.category}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{activeModule.title}</h3>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            {quizScorePercent === null ? (
              <div className="space-y-6">
                {/* 15 CURRICULUM POINTS */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> 15-Point Curriculum Study Guide
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2">
                    {activeModule.studyGuide.map((point, idx) => (
                      <div key={idx} className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100 flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold shrink-0">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8-QUESTION QUIZ SECTION */}
                {(() => {
                  const questions = QUIZ_DATA[activeModule.id] || [];
                  const currentQ = questions[currentQuestionIndex];
                  if (!currentQ) return null;

                  return (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          Assessment Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Pass Requirement: 75% (6/8 Correct)
                        </span>
                      </div>

                      <p className="font-bold text-slate-900 text-sm sm:text-base mb-4">
                        {currentQ.q}
                      </p>

                      <div className="space-y-2">
                        {currentQ.options.map((optionText, optIdx) => {
                          const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                              className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                                isSelected
                                  ? "border-emerald-600 bg-emerald-50 text-slate-900 ring-1 ring-emerald-600 font-bold"
                                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              {optionText}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          onClick={handleNextStep}
                          disabled={selectedAnswers[currentQuestionIndex] == null}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                        >
                          {currentQuestionIndex < questions.length - 1 ? "Next Question →" : "Submit Assessment"}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* RESULTS DISPLAY */
              <div className="text-center py-6 space-y-4">
                {quizScorePercent >= 75 ? (
                  <div className="space-y-3">
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                    <h4 className="text-2xl font-bold text-slate-900">Module Passed! 🎉</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      You scored <span className="font-bold text-emerald-600 text-base">{quizScorePercent}%</span>. You have earned <span className="font-bold text-slate-900">+15 PBAS points</span> and unlocked your printable landscape certificate.
                    </p>
                    <button
                      onClick={() => {
                        const title = activeModule.title;
                        setActiveModule(null);
                        handleOpenLandscapeCertificate(title);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 mx-auto shadow-sm transition-all"
                    >
                      <Award className="w-4 h-4" /> View Landscape Certificate
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <RotateCcw className="w-16 h-16 text-amber-500 mx-auto" />
                    <h4 className="text-2xl font-bold text-slate-900">Review Required</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      You scored <span className="font-bold text-amber-600 text-base">{quizScorePercent}%</span> (Required: 75%). Please review the 15 study guide points and retake the assessment.
                    </p>
                    <button
                      onClick={() => {
                        setQuizScorePercent(null);
                        setCurrentQuestionIndex(0);
                        setSelectedAnswers({});
                      }}
                      className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                    >
                      Retake Assessment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* UNIFIED LANDSCAPE CERTIFICATE MODAL */}
      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          open={Boolean(activeCertificate)}
          onClose={() => setActiveCertificate(null)}
        />
      )}
    </div>
  );
}