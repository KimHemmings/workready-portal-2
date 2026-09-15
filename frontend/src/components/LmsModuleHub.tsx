import React, { useState } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Download
} from "lucide-react";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LMSModule {
  id: string;
  title: string;
  category: string;
  estimatedMinutes: number;
  description: string;
  studyGuide: string[];
  quiz: QuizQuestion[];
}

export const MODULES_LIST: LMSModule[] = [
  {
    id: "mod-101",
    title: "Effective Workplace Communication",
    category: "Non-Vocational Core Skills",
    estimatedMinutes: 25,
    description: "Master professional verbal, non-verbal, and written communication in modern Australian workplaces.",
    studyGuide: [
      "Active Listening: Pay full attention, summarize key points back, and clarify instructions before acting.",
      "Professional Email Etiquette: Keep subject lines concise, maintain respectful tone, and proofread.",
      "Constructive Feedback: Accept constructive notes as growth opportunities without becoming defensive."
    ],
    quiz: [
      {
        id: 1,
        question: "What is the primary objective of active listening in a workplace?",
        options: ["To plan your reply while the other person speaks", "To ensure full understanding before responding", "To finish the conversation quickly"],
        correctIndex: 1
      },
      {
        id: 2,
        question: "Which email subject line is most appropriate for requesting shift leave?",
        options: ["hey need off", "URGENT PLEASE READ", "Leave Request - Alex Johnson - 24th March"],
        correctIndex: 2
      },
      {
        id: 3,
        question: "How should you respond to constructive feedback from your supervisor?",
        options: ["Listen, ask clarifying questions, and apply suggestions", "Argue your point immediately", "Ignore it if you disagree"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "mod-102",
    title: "WHS & Workplace Rights in Australia",
    category: "Non-Vocational Compliance",
    estimatedMinutes: 30,
    description: "Understand Work Health & Safety fundamentals, hazard reporting, and NES worker entitlements.",
    studyGuide: [
      "Duty of Care: Employers must provide a safe environment; employees must follow safety procedures.",
      "Hazard Reporting: Identify and report slip/trip/fall hazards immediately to safety officers.",
      "National Employment Standards (NES): 11 statutory entitlements protecting all Australian employees."
    ],
    quiz: [
      {
        id: 1,
        question: "Who holds responsibility for safety in the workplace under WHS laws?",
        options: ["Only the business owner", "Both employers and employees", "The local council"],
        correctIndex: 1
      },
      {
        id: 2,
        question: "What should you do first if you notice a liquid spill in a corridor?",
        options: ["Walk past if it's not yours", "Report or secure the area immediately to prevent injury", "Wait for cleaning staff tomorrow"],
        correctIndex: 1
      },
      {
        id: 3,
        question: "How many National Employment Standards (NES) minimum entitlements exist in Australia?",
        options: ["5", "8", "11"],
        correctIndex: 2
      }
    ]
  },
  {
    id: "mod-103",
    title: "Digital Literacy & Cyber Safety",
    category: "Non-Vocational Technical",
    estimatedMinutes: 20,
    description: "Safe web browsing, password hygiene, phishing recognition, and cloud document management.",
    studyGuide: [
      "Password Hygiene: Use strong passphrases and enable Multi-Factor Authentication (MFA).",
      "Phishing Red Flags: Be suspicious of unexpected email attachments, urgent threats, and fake URLs.",
      "Data Confidentiality: Never share workplace customer or business records on personal devices."
    ],
    quiz: [
      {
        id: 1,
        question: "What is a major red flag of a phishing email?",
        options: ["Correct spelling and official logo", "Urgent demands to click a link and verify passwords", "An email from your confirmed team manager"],
        correctIndex: 1
      },
      {
        id: 2,
        question: "Which password structure is the most secure?",
        options: ["Password123", "Coffee#Sunrise$Table2026", "Your birthdate"],
        correctIndex: 1
      },
      {
        id: 3,
        question: "What does MFA stand for in digital security?",
        options: ["Multi-Factor Authentication", "Main File Archiving", "Mobile Account Format"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "mod-104",
    title: "Customer Service Excellence",
    category: "Non-Vocational Service",
    estimatedMinutes: 25,
    description: "De-escalation tactics, customer satisfaction principles, and clear problem resolution.",
    studyGuide: [
      "The HEAT Model: Hear, Empathize, Apologize, Take Action when resolving customer complaints.",
      "Positive Language: Focus on what you can do rather than starting responses with 'No'.",
      "First Impression: Maintain a welcoming posture, clear eye contact, and prompt greeting."
    ],
    quiz: [
      {
        id: 1,
        question: "What does the 'E' stand for in the HEAT customer service model?",
        options: ["Evaluate", "Empathize", "Escalate"],
        correctIndex: 1
      },
      {
        id: 2,
        question: "Instead of saying 'We can't do that', what is the better customer service approach?",
        options: ["'That is against our company policy'", "'Here is what I can do for you right now'", "Ignore the request"],
        correctIndex: 1
      },
      {
        id: 3,
        question: "What is the best way to open an interaction with a waiting customer?",
        options: ["Wait for them to speak first", "Acknowledge them promptly with a polite greeting and smile", "Finish checking your phone"],
        correctIndex: 1
      }
    ]
  },
  {
    id: "mod-105",
    title: "Time Management & Workplace Reliability",
    category: "Non-Vocational Life Skills",
    estimatedMinutes: 20,
    description: "Prioritization frameworks, punctuality etiquette, and managing workplace stress effectively.",
    studyGuide: [
      "Punctuality Rule: Arrive 10 minutes prior to your shift start to prepare.",
      "Eisenhower Matrix: Group tasks by Urgent vs. Important to focus on high-impact work.",
      "Notification Etiquette: Call your supervisor as early as possible if delayed or sick."
    ],
    quiz: [
      {
        id: 1,
        question: "If running late for a shift, when should you inform your manager?",
        options: ["As soon as you realize you will be late", "At the end of your shift", "Only if they ask"],
        correctIndex: 0
      },
      {
        id: 2,
        question: "What is a recommended habit for managing daily workplace tasks?",
        options: ["Do easy non-essential tasks first", "Prioritize tasks based on urgency and importance", "Rely entirely on memory"],
        correctIndex: 1
      },
      {
        id: 3,
        question: "What is the standard expectation for shift arrival times?",
        options: ["Exactly on the minute or slightly late", "5 to 10 minutes early ready to start", "15 minutes late"],
        correctIndex: 1
      }
    ]
  },
  {
    id: "mod-106",
    title: "STAR Method Interview Technique",
    category: "Non-Vocational Job Prep",
    estimatedMinutes: 30,
    description: "Structuring compelling behavioral interview answers using Situation, Task, Action, and Result.",
    studyGuide: [
      "Situation & Task: Briefly set the context (20% of your response time).",
      "Action: Detail the specific steps you personally took to resolve the challenge (60% of response).",
      "Result: End with quantifiable outcomes, lessons learned, or positive metrics (20% of response)."
    ],
    quiz: [
      {
        id: 1,
        question: "What does the 'A' in the STAR interview technique stand for?",
        options: ["Answer", "Action", "Ability"],
        correctIndex: 1
      },
      {
        id: 2,
        question: "Which section of your STAR response should take up the largest portion of your answer?",
        options: ["Situation", "Action", "Result"],
        correctIndex: 1
      },
      {
        id: 3,
        question: "Why is it important to include a clear 'Result' in your interview answer?",
        options: ["To show the practical outcome and impact of your efforts", "To make the story longer", "It is optional"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "mod-107",
    title: "Resume Tailoring & Cover Letter Drafting",
    category: "Non-Vocational Employment",
    estimatedMinutes: 25,
    description: "Aligning your skills with Job Description Keywords and avoiding applicant screening rejections.",
    studyGuide: [
      "Keyword Alignment: Mirror verbs and skill terms found directly in the job advertisement.",
      "Formatting: Use clear headings, bullet points, and clean typography for ATS readability.",
      "Cover Letter Rule: Address why you want to work for this specific business."
    ],
    quiz: [
      {
        id: 1,
        question: "What is the main goal of customizing your resume for each job application?",
        options: ["To make your resume 5 pages long", "To match your experience with the employer's specific requirements", "To use decorative fonts"],
        correctIndex: 1
      },
      {
        id: 2,
        question: "What should you include in the opening paragraph of a targeted cover letter?",
        options: ["Your complete work history", "The specific role you are applying for and why you want to work there", "Salary demands"],
        correctIndex: 1
      },
      {
        id: 3,
        question: "How long should a standard entry-to-mid-level Australian resume typically be?",
        options: ["1 to 2 pages", "4 to 5 pages", "Half a page"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "mod-108",
    title: "Financial Literacy & Pay Slips",
    category: "Non-Vocational Life Skills",
    estimatedMinutes: 20,
    description: "Understanding Tax File Numbers, superannuation contributions, gross vs. net pay, and pay slips.",
    studyGuide: [
      "Pay Slip Essentials: Must detail gross pay, tax withheld (PAYG), net pay, and superannuation.",
      "Superannuation Guarantee: Employer contributions paid into your nominated super fund.",
      "Tax File Number (TFN) Declaration: Ensures you are taxed at standard resident rates."
    ],
    quiz: [
      {
        id: 1,
        question: "What is the difference between Gross Pay and Net Pay?",
        options: ["Gross pay is after tax; Net pay is before tax", "Gross pay is total earnings before deductions; Net pay is take-home pay", "They are identical"],
        correctIndex: 1
      },
      {
        id: 2,
        question: "What legal document must Australian employers provide within 1 working day of pay day?",
        options: ["A tax return form", "A detailed pay slip", "A bank statement"],
        correctIndex: 1
      },
      {
        id: 3,
        question: "What happens if you fail to provide your Tax File Number (TFN) to a new employer?",
        options: ["You will be taxed at the highest marginal rate", "You cannot be paid at all", "Nothing changes"],
        correctIndex: 0
      }
    ]
  }
];

interface Props {
  onModuleCompleted?: (moduleId: string, pbasPoints: number) => void;
}

export default function LmsModuleHub({ onModuleCompleted }: Props) {
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(["mod-101"]);
  const [activeModule, setActiveModule] = useState<LMSModule | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScorePercent, setQuizScorePercent] = useState<number | null>(null);

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

    if (currentQuestionIndex < activeModule.quiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      let correctAnswersCount = 0;
      activeModule.quiz.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          correctAnswersCount++;
        }
      });

      const calculatedScore = Math.round((correctAnswersCount / activeModule.quiz.length) * 100);
      setQuizScorePercent(calculatedScore);

      if (calculatedScore >= 67) {
        if (!completedModuleIds.includes(activeModule.id)) {
          setCompletedModuleIds((prev) => [...prev, activeModule.id]);
          if (onModuleCompleted) {
            onModuleCompleted(activeModule.id, 15);
          }
        }
      }
    }
  };

  const handleGeneratePDFCertificate = (moduleTitle: string) => {
    const certDoc = window.open("", "_blank");
    if (!certDoc) return;

    const certHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Completion - ${moduleTitle}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; text-align: center; background: #f8fafc; color: #0f172a; }
            .container { border: 8px solid #16a34a; background: #ffffff; padding: 50px; border-radius: 16px; max-width: 700px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .badge { font-size: 12px; font-weight: bold; color: #16a34a; text-transform: uppercase; letter-spacing: 2px; }
            h1 { font-size: 32px; margin: 16px 0 8px 0; color: #0f172a; }
            .subtitle { font-size: 15px; color: #64748b; margin-bottom: 30px; }
            .module-title { font-size: 22px; font-weight: bold; color: #24083b; background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0; }
            .meta { font-size: 13px; color: #475569; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">Non-Vocational Pre-Employment Framework</div>
            <h1>Certificate of Completion</h1>
            <div class="subtitle">This verifies that the learner has successfully completed the module & assessment:</div>
            <div class="module-title">${moduleTitle}</div>
            <p>Verifiable Mutual Obligation Activity (+15 PBAS Points)</p>
            <div class="meta">
              <div>Date Completed: ${new Date().toLocaleDateString('en-AU')}</div>
              <div>Status: Verified Pass</div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;
    certDoc.document.write(certHtml);
    certDoc.document.close();
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
            Complete non-vocational modules, download PDF certificates, and earn +15 PBAS points per unit.
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
                    <span className="text-xs font-bold text-[#16a34a] flex items-center gap-1">
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
                      : "bg-[#16a34a] text-white hover:bg-emerald-700 shadow-sm"
                  }`}
                >
                  {isCompleted ? "Revise Module" : "Start Unit (+15 Pts)"}
                </button>

                {isCompleted && (
                  <button
                    onClick={() => handleGeneratePDFCertificate(mod.title)}
                    className="w-full py-1.5 px-2 rounded text-[11px] font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-1 transition-all"
                  >
                    <Download className="w-3 h-3 text-[#16a34a]" /> Download PDF Certificate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODULE MODAL */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl space-y-6">
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
                {/* STUDY GUIDE */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[#16a34a]" /> Unit Study Guide (Revisable Anytime)
                  </h4>
                  <ul className="space-y-2">
                    {activeModule.studyGuide.map((point, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-[#16a34a] font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* QUIZ SECTION */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Assessment Question {currentQuestionIndex + 1} of {activeModule.quiz.length}
                    </span>
                    <span className="text-xs font-semibold text-[#16a34a]">Pass Requirement: 67%</span>
                  </div>

                  <p className="font-bold text-slate-900 text-sm sm:text-base mb-4">
                    {activeModule.quiz[currentQuestionIndex].question}
                  </p>

                  <div className="space-y-2">
                    {activeModule.quiz[currentQuestionIndex].options.map((optionText, optIdx) => {
                      const currentQId = activeModule.quiz[currentQuestionIndex].id;
                      const isSelected = selectedAnswers[currentQId] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQId, optIdx)}
                          className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                            isSelected
                              ? "border-[#16a34a] bg-emerald-50 text-slate-900 ring-1 ring-[#16a34a]"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {optionText}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextStep}
                    disabled={selectedAnswers[activeModule.quiz[currentQuestionIndex].id] == null}
                    className="bg-[#16a34a] hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                  >
                    {currentQuestionIndex < activeModule.quiz.length - 1 ? "Next Question →" : "Submit Assessment"}
                  </button>
                </div>
              </div>
            ) : (
              /* RESULTS DISPLAY */
              <div className="text-center py-6 space-y-4">
                {quizScorePercent >= 67 ? (
                  <div className="space-y-3">
                    <CheckCircle2 className="w-16 h-16 text-[#16a34a] mx-auto" />
                    <h4 className="text-2xl font-bold text-slate-900">Module Passed! 🎉</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      You scored <span className="font-bold text-[#16a34a] text-base">{quizScorePercent}%</span>. You have earned <span className="font-bold text-slate-900">+15 PBAS points</span> and unlocked your PDF certificate.
                    </p>
                    <button
                      onClick={() => handleGeneratePDFCertificate(activeModule.title)}
                      className="bg-[#16a34a] hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 mx-auto shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" /> Download PDF Certificate
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <RotateCcw className="w-16 h-16 text-amber-500 mx-auto" />
                    <h4 className="text-2xl font-bold text-slate-900">Review Required</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      You scored <span className="font-bold text-amber-600 text-base">{quizScorePercent}%</span> (Required: 67%). You can revise the study guide and retake the assessment.
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

                <div className="pt-4 border-t flex justify-end">
                  <button
                    onClick={() => setActiveModule(null)}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
