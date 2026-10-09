import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../lib/api';
import { 
  Send, 
  Briefcase, 
  Mic, 
  Pause, 
  Trophy, 
  RefreshCw, 
  Clock, 
  Volume2, 
  CheckCircle2, 
  Lock, 
  FileText,
  VolumeX,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export interface InterviewQuestion {
  id: string;
  roleCategory: 'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades';
  question: string;
  coachingTip: string;
}

const QUESTION_BANK: InterviewQuestion[] = [
  // Warehouse & Logistics (8 Scenarios)
  { id: 'w1', roleCategory: 'Warehouse & Logistics', question: 'Describe a time you noticed a safety hazard on the warehouse floor. What action did you take?', coachingTip: 'Mention immediate hazard isolation, PPE usage, and notifying your WHS supervisor.' },
  { id: 'w2', roleCategory: 'Warehouse & Logistics', question: 'How do you ensure 100% order picking accuracy under tight dispatch deadlines?', coachingTip: 'Highlight double-checking SKU barcodes and staying calm under pressure.' },
  { id: 'w3', roleCategory: 'Warehouse & Logistics', question: 'Describe a situation where a piece of warehouse equipment broke down during your shift.', coachingTip: 'Focus on tagging out faulty machinery immediately and taking on alternative tasks.' },
  { id: 'w4', roleCategory: 'Warehouse & Logistics', question: 'How do you handle working safely in high-traffic forklift aisles?', coachingTip: 'Mention staying inside yellow pedestrian walkways and eye contact with operators.' },
  { id: 'w5', roleCategory: 'Warehouse & Logistics', question: 'Tell me about a time you had to resolve a discrepancy in physical inventory stock counts.', coachingTip: 'Highlight systematic re-checks, logging discrepancies, and notifying warehouse managers.' },
  { id: 'w6', roleCategory: 'Warehouse & Logistics', question: 'How do you maintain high energy and focus during physical shift work?', coachingTip: 'Discuss hydration, safe manual handling posture, and planned rest breaks.' },
  { id: 'w7', roleCategory: 'Warehouse & Logistics', question: 'Describe a time you assisted a new team member with warehouse safety orientation.', coachingTip: 'Emphasize patience, demonstrating proper lifting, and peer support.' },
  { id: 'w8', roleCategory: 'Warehouse & Logistics', question: 'Why are you interested in joining our logistics team as a Storeperson?', coachingTip: 'Align your reliability, WHS focus, and career growth goals with the company.' },

  // Retail & Hospitality (8 Scenarios)
  { id: 'r1', roleCategory: 'Retail & Hospitality', question: 'How would you handle an angry customer seeking a refund without a receipt?', coachingTip: 'Focus on polite de-escalation, active listening, and adhering to store policy.' },
  { id: 'r2', roleCategory: 'Retail & Hospitality', question: 'Describe a shift where your store was understaffed during peak trading hours.', coachingTip: 'Highlight teamwork, rapid customer queue clearing, and staying composed.' },
  { id: 'r3', roleCategory: 'Retail & Hospitality', question: 'How do you ensure cash drawer accuracy and POS balance at the end of a shift?', coachingTip: 'Mention systematic counting, double-checking receipts, and security protocols.' },
  { id: 'r4', roleCategory: 'Retail & Hospitality', question: 'Tell me about a time you went above and beyond to make a customer experience memorable.', coachingTip: 'Share a concrete example of personal initiative and positive customer feedback.' },
  { id: 'r5', roleCategory: 'Retail & Hospitality', question: 'How do you handle dietary requirements or food safety standards in hospitality?', coachingTip: 'Mention strict allergen awareness, cross-contamination checks, and hygiene.' },
  { id: 'r6', roleCategory: 'Retail & Hospitality', question: 'Describe a situation where you had a disagreement with a co-worker on shift.', coachingTip: 'Emphasize constructive communication, keeping focus on customer service, and resolving it.' },
  { id: 'r7', roleCategory: 'Retail & Hospitality', question: 'How do you keep up product knowledge when new merchandise arrives?', coachingTip: 'Mention reviewing product tags, asking team leads, and testing product features.' },
  { id: 'r8', roleCategory: 'Retail & Hospitality', question: 'What makes you a great candidate for our customer support team?', coachingTip: 'Highlight your punctuality, positive communication style, and customer focus.' },

  // Administration & Support (8 Scenarios)
  { id: 'a1', roleCategory: 'Administration & Support', question: 'How do you prioritize urgent incoming phone calls while completing detailed data entry?', coachingTip: 'Explain your task prioritization and maintaining accurate records.' },
  { id: 'a2', roleCategory: 'Administration & Support', question: 'Describe a time you had to learn a new CRM software system quickly.', coachingTip: 'Highlight taking notes during training, practicing, and asking clarifying questions.' },
  { id: 'a3', roleCategory: 'Administration & Support', question: 'How do you ensure confidential client data stays secure in an open office setting?', coachingTip: 'Mention locking computer screens, filing sensitive paper files, and privacy laws.' },
  { id: 'a4', roleCategory: 'Administration & Support', question: 'Tell me about a time you caught a formatting or data error before sending a report.', coachingTip: 'Highlight proofreading attention to detail and taking pride in quality work.' },
  { id: 'a5', roleCategory: 'Administration & Support', question: 'How do you handle difficult or demanding clients over the phone?', coachingTip: 'Focus on professional tone, active listening, and finding swift solutions.' },
  { id: 'a6', roleCategory: 'Administration & Support', question: 'Describe a project where you organized digital documents or filing systems for your team.', coachingTip: 'Discuss clear naming conventions, folder structures, and saving team time.' },
  { id: 'a7', roleCategory: 'Administration & Support', question: 'How do you handle tight afternoon deadlines when unexpected tasks arise?', coachingTip: 'Mention communicating transparently with supervisors and triaging tasks.' },
  { id: 'a8', roleCategory: 'Administration & Support', question: 'Why do you want to build a career in administration with our company?', coachingTip: 'Align your organizational strengths, communication skills, and reliability.' },

  // Construction & Trades (8 Scenarios)
  { id: 't1', roleCategory: 'Construction & Trades', question: 'What steps do you take if you notice a teammate operating power tools unsafely on site?', coachingTip: 'Emphasize site safety rules, respectful peer reminders, and stop-work authority.' },
  { id: 't2', roleCategory: 'Construction & Trades', question: 'How do you handle tool or machinery breakdowns in the middle of a site job?', coachingTip: 'Mention tagging out faulty equipment immediately and switching to alternative site tasks.' },
  { id: 't3', roleCategory: 'Construction & Trades', question: 'Describe a time you worked outdoors in extreme heat or difficult weather conditions.', coachingTip: 'Focus on hydration, regular shade breaks, and monitoring team health.' },
  { id: 't4', roleCategory: 'Construction & Trades', question: 'How do you ensure you arrive fit for work and fully prepared for early site starts?', coachingTip: 'Highlight discipline, routine preparation of PPE gear, and punctuality.' },
  { id: 't5', roleCategory: 'Construction & Trades', question: 'Tell me about a situation where site plans or specifications changed mid-job.', coachingTip: 'Discuss active listening during pre-start toolbox talks and following revised drawings.' },
  { id: 't6', roleCategory: 'Construction & Trades', question: 'How do you maintain clear communication with sub-contractors on active build sites?', coachingTip: 'Mention high-vis presence, clear hand/radio signals, and mutual respect.' },
  { id: 't7', roleCategory: 'Construction & Trades', question: 'Describe a time you assisted with site cleanup and hazardous material disposal.', coachingTip: 'Highlight environmental compliance, chemical safety, and keeping site access clear.' },
  { id: 't8', roleCategory: 'Construction & Trades', question: 'Why are you pursuing a career in construction and site trades?', coachingTip: 'Connect your hands-on work ethic, trade ambitions, and dedication to safety.' }
];

const MONTHLY_SESSION_LIMIT = 3;

const analyzeAnswerSTAR = (question: string, answer: string, defaultTip: string) => {
  const text = answer.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);

  const hasPersonalAction = /\b(i|my|me|myself)\b/i.test(lower);
  const hasTeamContext = /\b(we|our|team|supervisor|manager|colleague|co-worker)\b/i.test(lower);
  const hasOutcome = /\b(result|outcome|led to|resolved|fixed|learned|improved|approved|saved|completed|ensured|so that)\b/i.test(lower);
  const hasSafety = /\b(safety|whs|ppe|hazard|risk|policy|procedure|protocol)\b/i.test(lower);

  const missedElements: string[] = [];
  const strengths: string[] = [];

  if (words.length < 15) {
    missedElements.push('Detail Depth: Try adding 1-2 sentences explaining what you did.');
  }
  if (!hasPersonalAction) {
    missedElements.push('Personal Action: Use "I" to describe what you personally did in this situation.');
  }
  if (!hasOutcome) {
    missedElements.push('Clear Result: Mention how it ended or what positive outcome occurred.');
  }

  if (hasPersonalAction && words.length >= 18) strengths.push('Clear personal contribution explained.');
  if (hasTeamContext) strengths.push('Good workplace context and team focus.');
  if (hasSafety) strengths.push('Strong alignment with workplace safety guidelines.');

  let personalizedHint = '';
  if (missedElements.length > 0) {
    personalizedHint = `💡 Tips to Strengthen Your Answer:\n• ${missedElements.join('\n• ')}\n\n📌 Pro Coaching Hint: ${defaultTip}`;
  } else {
    personalizedHint = `🌟 Excellent Answer Structure!\n• Great job taking personal ownership and sharing the outcome.\n\n📌 Pro Coaching Hint: ${defaultTip}`;
  }

  return {
    wordCount: words.length,
    hasPersonalAction,
    hasOutcome,
    strengths,
    missedElements,
    personalizedHint
  };
};

export const StarInterviewSimulator: React.FC = () => {
  const { candidates } = usePortal();
  const activeCandidate = candidates[0];

  const programType = activeCandidate?.programType || 'workforce_australia';
  const isRtoGraduate = programType === 'rto_graduate';

  // Check if candidate has completed an ATS resume draft
  const checkResumeExists = (): boolean => {
    try {
      const raw = localStorage.getItem('workready_resume_draft');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Boolean(parsed && (parsed.fullName || parsed.summary || parsed.experience));
    } catch (e) {
      return false;
    }
  };

  const hasResumeDraft = checkResumeExists();

  const [selectedRole, setSelectedRole] = useState<'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades'>('Warehouse & Logistics');
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [showStarGuide, setShowStarGuide] = useState<boolean>(true);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [chatTranscript, setChatTranscript] = useState<Array<{ role: 'system' | 'user' | 'assistant'; content: string }>>([]);
  const [perAnswerAnalysis, setPerAnswerAnalysis] = useState<any[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [evalReport, setEvalReport] = useState<any>(null);

  const [monthlySessionsUsed, setMonthlySessionsUsed] = useState<number>(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('workready_star_monthly_attempts');
      if (stored) {
        const attempts: number[] = JSON.parse(stored);
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const validRecentAttempts = attempts.filter((ts) => ts > thirtyDaysAgo);
        setMonthlySessionsUsed(validRecentAttempts.length);
      }
    } catch (err) {
      console.error("Error reading monthly attempt count:", err);
    }
  }, [isSessionFinished]);

  useEffect(() => {
    initSession(selectedRole);
  }, [selectedRole]);

  // Load initial interviewer message into chat stream for the current scenario
  useEffect(() => {
    if (sessionQuestions.length > 0 && sessionQuestions[currentIndex]) {
      const q = sessionQuestions[currentIndex];
      setChatTranscript([
        {
          role: 'assistant',
          content: `G'day! I'm Sarah, your interviewer today. Here is Scenario #${currentIndex + 1}:\n\n"${q.question}"`
        }
      ]);
    }
  }, [currentIndex, sessionQuestions]);

  useEffect(() => {
    return () => {
      stopAndResetMic();
      stopSpeech();
    };
  }, []);

  const shuffleAndPick8 = (array: InterviewQuestion[]) => {
    let seenIds: string[] = [];
    try {
      seenIds = JSON.parse(localStorage.getItem('workready_seen_questions') || '[]');
    } catch (e) {}

    const unseen = array.filter(q => !seenIds.includes(q.id));
    const pool = unseen.length >= 8 ? unseen : [...unseen, ...array.filter(q => seenIds.includes(q.id))];

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selected = shuffled.slice(0, 8);
    try {
      const newSeen = Array.from(new Set([...seenIds, ...selected.map(s => s.id)]));
      localStorage.setItem('workready_seen_questions', JSON.stringify(newSeen));
    } catch (e) {}

    return selected;
  };

  const initSession = (role: typeof selectedRole) => {
    const questions = QUESTION_BANK.filter((q) => q.roleCategory === role);
    const randomized = shuffleAndPick8(questions);
    setSessionQuestions(randomized);
    setCurrentIndex(0);
    setUserAnswers([]);
    setPerAnswerAnalysis([]);
    setIsSessionFinished(false);
    setEvalReport(null);
    resetResponse();
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeakingQuestion(false);
  };

  const speakQuestion = (text: string) => {
  if (!('speechSynthesis' in window)) return alert("Text-to-speech audio is not supported in this browser.");
  
  stopAndResetMic();
  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-AU';
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  
  // 1. Strictly look for an Australian Female Voice first (e.g. Karen, Catherine, Natasha)
  // 2. Fallback to any English Female Voice (Zira, Samantha, Hazel, Susan, Victoria)
  // 3. Explicitly exclude known male voice identifiers (David, Mark, George, James, Male)
  const femaleVoice = 
    voices.find((v) => v.lang.includes('en-AU') && /karen|catherine|natasha|samantha|female|zira/i.test(v.name)) ||
    voices.find((v) => v.lang.includes('en-AU') && !/male|david|mark|george|james/i.test(v.name)) ||
    voices.find((v) => /female|karen|catherine|natasha|zira|samantha|hazel|susan|victoria/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en') && !/male|david|mark|george|james/i.test(v.name)) ||
    voices[0];

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  utterance.onend = () => setIsSpeakingQuestion(false);
  utterance.onerror = () => setIsSpeakingQuestion(false);
  setIsSpeakingQuestion(true);
  window.speechSynthesis.speak(utterance);
};

  const stopAndResetMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (err) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const resetResponse = () => {
    stopAndResetMic();
    stopSpeech();
    setCandidateAnswer('');
    setCurrentFeedback(null);
    setChatTranscript([]);
  };

  const toggleMic = () => {
    if (isListening) return stopAndResetMic();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice dictation is not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-AU';

    let baseText = candidateAnswer;

    recognition.onresult = (e: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        baseText = baseText ? `${baseText} ${finalTranscript}`.trim() : finalTranscript.trim();
      }

      const combined = baseText ? `${baseText} ${interimTranscript}`.trim() : interimTranscript.trim();
      setCandidateAnswer(combined);
    };

    recognition.onerror = () => stopAndResetMic();
    recognition.onend = () => {
      if (isListening) {
        try { recognition.start(); } catch (e) {}
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

 const downloadEvidencePDF = () => {
    if (!evalReport) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to download your PDF Evidence Report.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>STAR Interview Practice Evidence - ${selectedRole}</title>
        <style>
          @body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
          .header { display: flex; justify-[#24083b]; align-items: center; justify-content: space-between; border-b: 3px solid #24083b; padding-bottom: 20px; margin-bottom: 25px; }
          .brand { font-size: 24px; font-weight: 900; color: #24083b; }
          .sub-brand { font-size: 12px; font-weight: 700; color: #16a34a; text-transform: uppercase; tracking-spacing: 1px; }
          .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 25px; font-size: 12px; }
          .meta-item { line-height: 1.5; }
          .meta-label { font-weight: 800; color: #475569; text-transform: uppercase; font-size: 10px; }
          .meta-value { font-weight: 700; color: #0f172a; }
          .section-title { font-size: 14px; font-weight: 900; color: #24083b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 25px; margin-bottom: 12px; }
          .card { background: #ffffff; border: 1px solid #cbd5e1; padding: 15px; border-radius: 10px; margin-bottom: 12px; }
          .badge-green { background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 11px; }
          .badge-purple { background: #f3e8ff; color: #6b21a8; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 11px; }
          .strength-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; margin-bottom: 10px; font-size: 12px; }
          .support-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; margin-bottom: 10px; font-size: 12px; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 15px; font-size: 10px; text-align: center; color: #64748b; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">STRAIGHT UP TRAINING</div>
            <div class="sub-brand">WorkReady Career & Employability Hub</div>
          </div>
          <div style="text-align: right;">
            <span class="${evalReport.pointsAwarded > 0 ? 'badge-green' : 'badge-purple'}">
              ${evalReport.pointsAwarded > 0 ? '+25 PBAS Points Submitted' : `Session ${evalReport.sessionNumber}/3 Completed`}
            </span>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <div class="meta-label">Candidate Name</div>
            <div class="meta-value">${activeCandidate?.name || 'Alex Johnson'}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Date & Time Stamp</div>
            <div class="meta-value">${evalReport.timestamp || new Date().toLocaleString('en-AU')}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Target Industry</div>
            <div class="meta-value">${selectedRole}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Overall STAR Rating</div>
            <div class="meta-value">${evalReport.scoreText}</div>
          </div>
        </div>

        <div class="section-title">1. Performance Summary & DEWR Audit Log</div>
        <div style="font-size: 12px; line-height: 1.6; margin-bottom: 20px;">
          ${evalReport.keyTakeaways.map((t: string) => `<div style="margin-bottom: 6px;">✔ ${t}</div>`).join('')}
        </div>

        <div class="section-title">2. Identified Strengths (What You Did Well)</div>
        <div class="strength-box">
          <strong>Key Strengths Demonstrated:</strong>
          <ul style="margin: 5px 0 0 0; padding-left: 20px;">
            <li>High active participation across all 8 behavioral scenarios.</li>
            <li>Direct personal accountability established using clear first-person ("I") actions.</li>
            <li>Strong alignment with Australian workplace WHS safety and operational compliance protocols.</li>
          </ul>
        </div>

        <div class="section-title">3. Support & Growth Areas Identified (With Reasoning)</div>
        <div class="support-box">
          <strong>Actionable Support Guidance:</strong>
          <ul style="margin: 5px 0 0 0; padding-left: 20px;">
            <li><strong>Quantifiable Results:</strong> Expand on the "Result" stage of STAR by giving explicit outcomes (e.g. shift time saved, zero safety incidents, or supervisor praise).</li>
            <li><strong>Concise Delivery:</strong> Aim for 45–60 second responses during live panel interviews to maintain high engagement.</li>
          </ul>
        </div>

        <div class="section-title">4. Question-by-Question Response Audit</div>
        ${evalReport.detailedBreakdown.map((item: any, idx: number) => `
          <div class="card">
            <div style="font-weight: 800; font-size: 12px; color: #24083b; margin-bottom: 5px;">Scenario #${idx + 1}: "${item.question}"</div>
            <div style="font-style: italic; font-size: 11px; color: #334155; background: #f8fafc; padding: 8px; border-radius: 6px; margin-bottom: 8px;">"${item.answer}"</div>
            <div style="font-size: 11px; color: #475569;">
              <strong>Word Count:</strong> ${item.analysis?.wordCount || 0} words | 
              <strong>Strengths:</strong> ${item.analysis?.strengths?.join(', ') || 'Standard STAR delivery'} | 
              <strong>Growth Focus:</strong> ${item.analysis?.missedElements?.join(' | ') || 'None (Complete)'}
            </div>
          </div>
        `).join('')}

        <div class="footer">
          Official Straight Up Training WorkReady Evidence Document • Generated on ${evalReport.timestamp} • Verification ID: STAR-${Date.now()}
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const evaluateAndSaveSession = (answers: string[], analyses: any[]) => {
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-AU')} at ${now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;

    const totalWords = analyses.reduce((sum, a) => sum + (a?.wordCount || 0), 0);
    const totalOutcomes = analyses.filter((a) => a?.hasOutcome).length;
    const totalPersonalActions = analyses.filter((a) => a?.hasPersonalAction).length;

    let rubricScore = 'Empowered Executer • Solid STAR Structure';
    if (totalWords > 100 && totalOutcomes >= 3) {
      rubricScore = 'Confident Communicator • High Professional Alignment';
    } else if (totalWords < 40) {
      rubricScore = 'Developing Practitioner • Building Response Length';
    }

    const newSessionCount = monthlySessionsUsed + 1;
    const isCompletedTrio = !isRtoGraduate && newSessionCount >= MONTHLY_SESSION_LIMIT;

    const detailedBreakdown = sessionQuestions.map((q, idx) => ({
      question: q.question,
      answer: answers[idx] || "Question skipped.",
      analysis: analyses[idx]
    }));

    const summaryReport = {
      scoreText: rubricScore,
      timestamp: formattedTimestamp,
      sessionNumber: newSessionCount,
      totalWords,
      totalOutcomes,
      totalPersonalActions,
      detailedBreakdown,
      keyTakeaways: [
        `Completed 8 interview scenarios for ${selectedRole}.`,
        `Personal Ownership: Used "I" to describe action in ${totalPersonalActions} of 8 answers.`,
        `Outcome Focus: Stated a clear positive result in ${totalOutcomes} answers.`,
        isCompletedTrio 
          ? `3/3 Practice Sessions Completed. Full evidence package submitted to your Case Manager for verification.`
          : `Session ${newSessionCount} of 3 Saved. Complete ${MONTHLY_SESSION_LIMIT - newSessionCount} more session(s) to finish your practice block.`
      ]
    };

    setEvalReport(summaryReport);

    try {
      const stored = localStorage.getItem('workready_star_monthly_attempts');
      const attempts = stored ? JSON.parse(stored) : [];
      attempts.push(Date.now());
      localStorage.setItem('workready_star_monthly_attempts', JSON.stringify(attempts));
      setMonthlySessionsUsed(attempts.length);
    } catch (err) {}

    const newRecord = {
      id: `star-${Date.now()}`,
      question: `STAR Practice: ${selectedRole} (${rubricScore})`,
      jobRole: selectedRole,
      rubricScore,
      sessionNumber: newSessionCount,
      summaryReport,
      timestamp: formattedTimestamp,
      date: now.toLocaleDateString('en-AU'),
      points: 0, // Assigned solely at CM discretion upon evidence review
      status: isCompletedTrio ? 'Pending CM Verification' : `Session ${newSessionCount}/3 Completed (In Progress)`
    };

    try {
      const existingRaw = localStorage.getItem('workready_star_history');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('workready_star_history', JSON.stringify([newRecord, ...existing]));
      window.dispatchEvent(new CustomEvent('starHistoryUpdated', { detail: newRecord }));
    } catch (err) {}
  };
  
const getResumeContext = () => {
    try {
      const rawDraft = localStorage.getItem('workready_resume_draft');
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        return `Candidate Name: ${draft.fullName || activeCandidate?.name || 'Alex Mercer'}
Target Role: ${draft.targetRole || selectedRole}
Summary/Objective: ${draft.summary || 'Not provided'}
Work Experience: ${draft.experience || 'Not provided'}
Key Skills: ${draft.skills || 'Not provided'}`;
      }
    } catch (e) {
      console.error("Could not parse resume draft context", e);
    }

    return `Candidate Name: ${activeCandidate?.name || 'Alex Mercer'}
Target Industry: ${selectedRole}`;
  };
const handleAskInterviewer = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();
  const questionText = candidateAnswer.trim();
  if (!questionText) return;

  // Stop active dictation and text-to-speech audio
  stopAndResetMic();
  stopSpeech();
  setCandidateAnswer('');

  const currentQ = sessionQuestions[currentIndex] || QUESTION_BANK[0];

  // Append user's question to the transcript log without affecting main currentFeedback or advancing scenario count
  const updatedHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    ...chatTranscript,
    { role: 'user', content: questionText }
  ];

  setChatTranscript(updatedHistory);

  try {
    const resumeContext = getResumeContext();

    const reply = await sendChatMessage([
      {
        role: "system",
        content: `You are Sarah, a warm, encouraging Australian female hiring manager conducting an interview for a ${selectedRole} position.

Candidate Resume Context:
${resumeContext}

Current Scenario Question: "${currentQ.question}"

INSTRUCTIONS:
- The candidate is asking you a direct question for clarification or job context before giving their final answer.
- Answer their question DIRECTLY, WARMLY, and HELPFULLY in 1 to 2 short sentences.
- Provide realistic workplace context about ${selectedRole} if asked.
- DO NOT evaluate them on STAR criteria.
- DO NOT advance the scenario count.
- DO NOT tell them to proceed or submit. Simply answer their question in character as Sarah.`
      },
      ...updatedHistory
    ]);

    // Append Sarah's response cleanly to conversation history WITHOUT touching currentFeedback or answer counts
    setChatTranscript((prev) => [...prev, { role: 'assistant', content: reply }]);
    speakQuestion(reply);
  } catch (err) {
    console.error("Failed to ask interviewer:", err);
  }
};

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    stopAndResetMic();
    stopSpeech();

    const currentQ = sessionQuestions[currentIndex] || QUESTION_BANK[0];
    
    // 1. Local STAR fallback structure for report generation
    const analysis = analyzeAnswerSTAR(currentQ.question, candidateAnswer, currentQ.coachingTip);

    const updatedAnswers = [...userAnswers, candidateAnswer];
    const updatedAnalyses = [...perAnswerAnalysis, analysis];

    setUserAnswers(updatedAnswers);
    setPerAnswerAnalysis(updatedAnalyses);

    // 2. Display temporary loading state in feedback box
    setCurrentFeedback("Analyzing your response with Azure OpenAI...");

    try {
      // 3. Extract candidate resume & profile context
      const resumeContext = getResumeContext();

      // 4. Call Azure OpenAI via sendChatMessage with full resume background
      const aiResponse = await sendChatMessage([
        {
          role: "system",
          content: `You are Sarah, a warm, encouraging Australian female hiring manager conducting a STAR interview for a ${selectedRole} role.
Candidate Resume Context:
${resumeContext}

Current Scenario Question: "${currentQ.question}"

INSTRUCTIONS:
- The candidate is asking YOU (Sarah) a question or asking for clarification regarding the scenario.
- Answer the candidate's question DIRECTLY and HELPFULLY in 1-2 friendly, conversational sentences.
- DO NOT press the candidate for more information or push them to expand yet. Simply answer their question clearly, give them a helpful hint if requested, and warmly invite them to share their response when ready.`
        },
        {
          role: "user",
          content: `Interview Question: "${currentQ.question}"\nCandidate's Answer: "${candidateAnswer}"`
        }
      ]);

      // 5. Overwrite feedback box with dynamic AI response
      setCurrentFeedback(aiResponse);
    } catch (err) {
      console.error("Failed to fetch Azure OpenAI feedback:", err);
      setCurrentFeedback(analysis.personalizedHint);
    }

    // 6. Complete session if all questions answered
    if (updatedAnswers.length >= 8 || currentIndex >= sessionQuestions.length - 1) {
      setIsSessionFinished(true);
      evaluateAndSaveSession(updatedAnswers, updatedAnalyses);
    }
  };

  const handleNextQuestion = () => {
  stopSpeech();
  stopAndResetMic();
  if (currentIndex < sessionQuestions.length - 1) {
    const nextIdx = userAnswers.length;
    setCurrentIndex(nextIdx);
    resetResponse();
  }
};

  const currentQ = sessionQuestions[currentIndex] || QUESTION_BANK[0];
  const isCapReached = !isRtoGraduate && monthlySessionsUsed >= MONTHLY_SESSION_LIMIT;

  return (
    <div className="space-y-6 font-sans my-6">
      
      {/* HIGH-IMPACT BRAND BANNER */}
      <div className="bg-linear-to-r from-[#24083b] via-[#320b52] to-[#1c0630] text-white rounded-2xl p-6 shadow-xl border border-purple-900/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black shadow-md">
                <Trophy className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-white font-heading">
                STAR Interview Practice Studio
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-400/20 text-emerald-300 text-[10px] font-black rounded-full border border-emerald-400/30">
                Confidence Builder
              </span>
              <span className="bg-slate-900/90 text-amber-300 border border-purple-700/60 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                🛡️ Azure OpenAI Protected
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1.5 max-w-xl leading-relaxed font-medium">
              Listen to questions, practice your answers aloud or by typing, and build verified evidence for your Case Manager upon completing all 3 monthly practice sessions!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl border border-white/15 backdrop-blur-md">
            {!isRtoGraduate && (
              <div className="text-center px-3 border-r border-white/20">
                <span className="block text-xl font-black text-amber-300">{monthlySessionsUsed} / {MONTHLY_SESSION_LIMIT}</span>
                <span className="text-[10px] font-bold uppercase text-purple-200 tracking-wider">Sessions Done</span>
              </div>
            )}

            <div className="flex items-center gap-2 pl-1">
              <label className="text-xs font-extrabold text-purple-200 shrink-0">Industry:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="p-2 bg-white text-[#24083b] font-black rounded-xl text-xs outline-none shadow-md"
              >
                <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                <option value="Retail & Hospitality">Retail & Hospitality</option>
                <option value="Administration & Support">Administration & Support</option>
                <option value="Construction & Trades">Construction & Trades</option>
              </select>
            </div>
          </div>
        </div>
      </div>

{/* ATS RESUME PREREQUISITE GATE BANNER */}
      {!hasResumeDraft && (
        <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-200 text-amber-950 rounded-lg font-black text-xs">
                ⚠️ Prerequisite Step
              </span>
              <h4 className="text-sm font-black text-amber-950">Active Resume Context Recommended</h4>
            </div>
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              For Sarah (your AI interviewer) to ask candidate-specific questions and reference your target industry accurately, complete your ATS Resume in Step 1.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const resumeElem = document.getElementById('resume-builder-section');
              if (resumeElem) resumeElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs shrink-0 transition-colors cursor-pointer"
          >
            Go to ATS Resume Studio →
          </button>
        </div>
      )}

      {isCapReached && !isSessionFinished ? (
        <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center space-y-3">
          <div className="inline-flex p-3 bg-amber-200 text-amber-900 rounded-full">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-amber-950">Monthly Practice Cap Reached (3/3 Sessions)</h3>
          <p className="text-xs text-amber-900 max-w-md mx-auto font-medium leading-relaxed">
            You have completed all 3 practice sessions for this reporting cycle! Your 25 PBAS Points submission is saved in your <strong>Activity Verification Log</strong> for Casey to review.
          </p>
        </div>
      ) : !isSessionFinished ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-7 space-y-6 shadow-sm">
          {/* UNIFIED INTERVIEW CHAT CONTAINER */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Header Bar */}
            <div className="bg-linear-to-r from-[#24083b] to-[#320b52] text-white p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-lg">
                    Scenario #{currentIndex + 1} of 8
                  </span>
                  <span className="text-xs font-bold text-purple-200">{selectedRole}</span>
                </div>

                <button
                  type="button"
                  onClick={() => isSpeakingQuestion ? stopSpeech() : speakQuestion(currentQ.question)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isSpeakingQuestion 
                      ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                  }`}
                >
                  {isSpeakingQuestion ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeakingQuestion ? 'Stop Audio' : 'Listen 🔊'}</span>
                </button>
              </div>

              {/* Synchronized 8-Step Progress Bar */}
              <div className="flex items-center gap-1.5 pt-1">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const isCompleted = idx < userAnswers.length;
                  const isCurrent = idx === currentIndex && !isCompleted;

                  return (
                    <div
                      key={idx}
                      title={`Scenario ${idx + 1}`}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-400 shadow-xs'
                          : isCurrent
                          ? 'bg-amber-400 ring-2 ring-amber-300/60 animate-pulse'
                          : 'bg-purple-900/80 border border-purple-800'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* 1. CONTINUOUS SCROLLABLE CHAT STREAM */}
            <div className="p-4 bg-slate-50 space-y-3 min-h-80 max-h-120 overflow-y-auto">
              {chatTranscript.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1 px-1">
                    {msg.role === 'user' ? 'Candidate (You)' : 'Sarah (Interviewer)'}
                  </span>
                  
                  <div
                    className={`p-4 rounded-2xl text-xs max-w-[85%] font-medium leading-relaxed shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-[#24083b] text-white rounded-br-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>
                  </div>
                </div>
              ))}

              {/* AI Feedback Displayed directly inside stream */}
              {currentFeedback && (
                <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl text-xs text-purple-950 font-semibold space-y-2 animate-fadeIn">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
                    🌟 Azure OpenAI STAR Feedback
                  </span>
                  <div className="whitespace-pre-line">{currentFeedback}</div>
                </div>
              )}
            </div>

            {/* 2. DYNAMIC STAR KEYWORD LIGHTING */}
            {(() => {
              const lower = candidateAnswer.toLowerCase();
              const hasS = /\b(when|while|at|during|role|working at|worked at|job at|coles|woolworths|bunnings|hasting|colles|mine|warehouse|store|office|site|shift|company|business|team|client)\b/i.test(lower);
              const hasT = /\b(job was|role was|duty was|task|tasked|needed to|had to|responsible for|assigned|required|objective|goal|pick|pack|picking|packing|orders|dispatch|filters|safety|hazard|stock|count|data|customer|phone)\b/i.test(lower);
              const hasA = /\b(i |my |did this|decided|took|action|changed|implemented|called|talked|handled|resolved|made sure|cleaned|put out|isolated|notified|reported|checked|organized|stepped in)\b/i.test(lower);
              const hasR = /\b(result|outcome|so that|led to|improved|saved|completed|ensured|fixed|always|on time|slipping|hurt|safe|prevented|achieved|satisfied|praise|zero incidents|passed)\b/i.test(lower);

              return (
                <div className="bg-slate-100 p-3 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    STAR Answer Structure Guide (Live Detection):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border transition-all ${hasS ? 'bg-purple-900 text-white border-purple-800 shadow-sm' : 'bg-white text-slate-600 border-slate-200'}`}>
                      <div className="font-black flex justify-between items-center">
                        <span>S — Situation</span>
                        {hasS && <span className="text-amber-300 font-bold">✓ Detected</span>}
                      </div>
                      <p className="text-[11px] opacity-90 mt-0.5">Prompt: "When I was working at..."</p>
                    </div>

                    <div className={`p-2.5 rounded-xl border transition-all ${hasT ? 'bg-indigo-900 text-white border-indigo-800 shadow-sm' : 'bg-white text-slate-600 border-slate-200'}`}>
                      <div className="font-black flex justify-between items-center">
                        <span>T — Task</span>
                        {hasT && <span className="text-amber-300 font-bold">✓ Detected</span>}
                      </div>
                      <p className="text-[11px] opacity-90 mt-0.5">Prompt: "My responsibility was to..."</p>
                    </div>

                    <div className={`p-2.5 rounded-xl border transition-all ${hasA ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-sm' : 'bg-white text-slate-600 border-slate-200'}`}>
                      <div className="font-black flex justify-between items-center">
                        <span>A — Action</span>
                        {hasA && <span className="text-slate-950 font-black">✓ Detected</span>}
                      </div>
                      <p className="text-[11px] opacity-90 mt-0.5">Prompt: "I took action by..."</p>
                    </div>

                    <div className={`p-2.5 rounded-xl border transition-all ${hasR ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' : 'bg-white text-slate-600 border-slate-200'}`}>
                      <div className="font-black flex justify-between items-center">
                        <span>R — Result</span>
                        {hasR && <span className="text-amber-300 font-bold">✓ Detected</span>}
                      </div>
                      <p className="text-[11px] opacity-90 mt-0.5">Prompt: "The positive outcome was..."</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3. INPUT & CONTROLS FOOTER */}
            <form onSubmit={handleAnswerSubmit} className="p-4 bg-white border-t border-slate-200 space-y-3">
              <div className="relative">
                <textarea
                  required
                  rows={3}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Type your response here, or ask Sarah a clarification question before answering..."
                  className="w-full p-3.5 pr-32 border-2 border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-purple-600 outline-none text-xs text-slate-900 font-medium"
                />

                <button
                  type="button"
                  onClick={stopAndResetMic}
                  className={`absolute right-2.5 top-2.5 px-3 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer flex items-center gap-1 ${
                    isListening
                      ? 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300'
                  }`}
                >
                  {isListening ? <Pause className="w-3.5 h-3.5 text-red-600" /> : <Mic className="w-3.5 h-3.5 text-purple-700" />}
                  <span>{isListening ? 'Stop' : 'Dictate 🎙️'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAskInterviewer(e);
                    }}
                    disabled={!candidateAnswer.trim()}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-xs border border-amber-300 transition-all cursor-pointer"
                  >
                    💬 Ask Sarah a Question
                  </button>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-3 py-2 text-slate-500 font-bold text-xs hover:text-slate-800 cursor-pointer"
                  >
                    Skip →
                  </button>
                </div>

                {currentFeedback ? (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Scenario #{currentIndex + 2}</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!candidateAnswer.trim()}
                    className="px-6 py-2.5 bg-[#24083b] hover:bg-[#320b52] disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Submit Final Answer</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Detailed Response Report with Download Button */
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm text-xs">
          <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-emerald-700" />
                <div>
                  <h3 className="text-lg font-black text-[#24083b]">Practice Session Complete!</h3>
                  <p className="text-xs text-slate-600 font-medium">{evalReport?.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadEvidencePDF}
                  className="px-4 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-black rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Download Evidence Report
                </button>

                {evalReport?.pointsAwarded > 0 ? (
                  <span className="px-3.5 py-2 bg-emerald-100 text-emerald-900 font-black rounded-xl text-xs border border-emerald-300">
                    +25 PBAS Points Submitted
                  </span>
                ) : (
                  <span className="px-3.5 py-2 bg-purple-100 text-purple-900 font-black rounded-xl text-xs border border-purple-200">
                    Session {evalReport?.sessionNumber}/3 Saved (0 Pts)
                  </span>
                )}
              </div>
            </div>

            {evalReport && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
                  <span className="block font-black text-slate-900 text-sm">Overall Feedback: <strong className="text-emerald-700">{evalReport.scoreText}</strong></span>
                  <div className="space-y-1.5 pt-1 text-slate-700">
                    {evalReport.keyTakeaways.map((note: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-700" /> Question-by-Question Response Review:
                  </h4>

                  {evalReport.detailedBreakdown.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <p className="font-black text-purple-950">Scenario #{idx + 1}: "{item.question}"</p>
                      <p className="p-3 bg-slate-50 rounded-lg text-slate-800 italic font-medium">"{item.answer}"</p>
                      
                      {item.analysis && (
                        <div className="text-[11px] space-y-1 pt-1 text-slate-600 font-medium">
                          <p><strong>Word Count:</strong> {item.analysis.wordCount} words</p>
                          {item.analysis.strengths.length > 0 && (
                            <p className="text-emerald-700"><strong>Strengths:</strong> {item.analysis.strengths.join(', ')}</p>
                          )}
                          {item.analysis.missedElements.length > 0 && (
                            <p className="text-amber-800"><strong>Coaching Focus:</strong> {item.analysis.missedElements.join(' | ')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => initSession(selectedRole)}
              disabled={isCapReached}
              className="px-6 py-3 bg-[#24083b] hover:bg-[#320b52] text-white font-black text-xs rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Start New Practice Session
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StarInterviewSimulator;