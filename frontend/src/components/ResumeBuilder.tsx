import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  Award,
  ChevronRight,
  ChevronLeft,
  Layout,
  UserCheck,
  Upload,
  AlertTriangle,
  Shield,
  HelpCircle,
  CheckCircle2,
  Eye,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { sendChatMessage } from '../lib/api';

export type TemplateStyle = 'modern' | 'classic' | 'trades' | 'minimalist' | 'creative' | 'technical';

interface LocalWorkPosition {
  id: string;
  jobTitle: string;
  company: string;
  dates: string;
  description: string;
}

interface LocalTicket {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

interface LocalReferee {
  id: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  relationship: string;
}

const MONTHLY_LIMIT = 1;

const COMMON_ROLES = [
  'Warehouse & Logistics Operations Assistant',
  'Storeperson / Freight Handler',
  'Forklift Driver / Materials Handler',
  'General Construction Labourer / White Card',
  'Retail Sales & Customer Service Associate',
  'Administrative Assistant / Receptionist',
  'Hospitality / Food & Beverage Attendant',
  'Aged Care & Support Worker',
  'Custom Role (Type Your Own)'
];

// Local AI Fallback Engine: Rewrites raw notes into dignified CV prose with strict grammar cleanup
const polishTextLocally = (raw: string, contextType: 'summary' | 'duty' | 'gap', roleTitle: string, extraReason?: string): string => {
  // Strip existing bullet points, double spaces, and crude prefixes
  let clean = raw.replace(/^[•\-\*\s]+/, '').replace(/\s+/g, ' ').trim();
  if (!clean) return contextType === 'duty' ? '• Executed daily operational tasks safely and efficiently.' : '';

  if (contextType === 'summary') {
    const refinedInput = clean
      .replace(/and stuff|like working with people|good worker|worked good/gi, 'strong collaboration and communication skills')
      .replace(/worked good in a team/gi, 'demonstrated strong teamwork and reliability');
    
    return `Reliable, punctual, and safety-conscious professional targeting ${roleTitle} opportunities. Brings hands-on operational experience, clear communication, and a strong work ethic. ${refinedInput.charAt(0).toUpperCase() + refinedInput.slice(1)}. Committed to supporting team productivity and maintaining high standards in the workplace.`;
  }

  if (contextType === 'gap') {
    // Normalize raw gap context into clean Australian CV prose
    let sanitized = clean
      .replace(/^(was in|spent time in|did)\s+/gi, '')
      .replace(/jail|prison|correctional/gi, 'structured personal development and accredited training')
      .replace(/sick mother|sick relative|family care/gi, 'full-time family caregiving responsibilities')
      .replace(/foodbank|food bank/gi, 'community volunteer support')
      .replace(/cert 2|cert ii/gi, 'Certificate II in')
      .replace(/cert 3|cert iii/gi, 'Certificate III in')
      .replace(/cert 4|cert iv/gi, 'Certificate IV in');

    sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);

    return `Career Transition & Personal Development (${extraReason || 'Personal Transition'}) — Dedicated time to personal accountability, skill maintenance, and vocational growth. Successfully achieved ${sanitized}. Fully prepared, motivated, and work-ready for active re-entry into the workforce.`;
  }

  // Work Duties Expansion — Strips duplicates and formats clean single bullet points
  const rawDuties = clean.split(/(?:\. |\n|• )/).map(d => d.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean);
  const primaryDuty = rawDuties[0] || 'Executed shift duties and operational tasks.';

  // Standardize duty text to remove informal phrasing like "worked good"
  const cleanDuty = primaryDuty
    .replace(/worked good in a team/gi, 'Collaborated effectively with team members and supervisors')
    .replace(/good worker/gi, 'Demonstrated high reliability and strong work ethic');

  const formattedPrimary = cleanDuty.charAt(0).toUpperCase() + cleanDuty.slice(1).replace(/\.\$/, '');

  return `• ${formattedPrimary}.\n• Maintained strict adherence to site WHS workplace safety rules, hazard reporting, and manual handling procedures.\n• Collaborated closely with team members and supervisors to ensure shift targets and operational reliability were consistently met.`;
};
// Color & Font Menu for the 6 Template Buttons
const TEMPLATE_THEMES: Record<string, {
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  headerBg: string;
  textColor: string;
  borderStyle: string;
  badgeBg: string;
}> = {
  modern: {
    fontFamily: "'Inter', sans-serif",
    primaryColor: '#3b0764',
    accentColor: '#d97706',
    headerBg: '#faf5ff',
    textColor: '#1e293b',
    borderStyle: '2px solid #581c87',
    badgeBg: '#f3e8ff'
  },
  classic: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    primaryColor: '#1e3a8a',
    accentColor: '#1d4ed8',
    headerBg: '#f8fafc',
    textColor: '#0f172a',
    borderStyle: '1px solid #1e3a8a',
    badgeBg: '#dbeafe'
  },
  trades: {
    fontFamily: "'Arial Black', sans-serif",
    primaryColor: '#15803d',
    accentColor: '#b45309',
    headerBg: '#f0fdf4',
    textColor: '#022c22',
    borderStyle: '3px solid #16a34a',
    badgeBg: '#dcfce7'
  },
  minimalist: {
    fontFamily: "'Segoe UI', sans-serif",
    primaryColor: '#334155',
    accentColor: '#64748b',
    headerBg: '#ffffff',
    textColor: '#1e293b',
    borderStyle: '1px solid #cbd5e1',
    badgeBg: '#f1f5f9'
  },
  creative: {
    fontFamily: "'Trebuchet MS', sans-serif",
    primaryColor: '#be185d',
    accentColor: '#831843',
    headerBg: '#fdf2f8',
    textColor: '#831843',
    borderStyle: '2px dashed #db2777',
    badgeBg: '#fce7f3'
  },
  technical: {
    fontFamily: "'Consolas', 'Courier New', monospace",
    primaryColor: '#0284c7',
    accentColor: '#0369a1',
    headerBg: '#f0f9ff',
    textColor: '#0c4a6e',
    borderStyle: '2px solid #0284c7',
    badgeBg: '#e0f2fe'
  }
};

const ResumeBuilder: React.FC<{ maxAttempts?: number }> = () => {
  const { candidates, addVerificationItem } = usePortal();
  const activeCandidate = candidates[0];

  const programType = activeCandidate?.programType || 'workforce_australia';
  const isRtoGraduate = programType === 'rto_graduate';

  const containsProfanity = (text: string): boolean => {
    const badWordsRegex = /\b(fuck|shit|cunt|bitch|asshole|bastard|dick|piss|bloody hell|slut|dickhead|cock)\b/i;
    return badWordsRegex.test(text);
  };

  // Monthly Claim & Case Manager Submission States
  const [hasClaimedThisMonth, setHasClaimedThisMonth] = useState<boolean>(() => {
    return localStorage.getItem('resume_claimed_this_month') === 'true';
  });
  const [submissionStatus, setSubmissionStatus] = useState<'draft' | 'pending' | 'verified'>(() => {
    return (localStorage.getItem('resume_submission_status') as any) || 'draft';
  });

  const handleSubmitToCaseManager = (
    actionType: 'updated' | 'reviewed', 
    docScope: 'both' | 'resume' | 'cover' = 'both'
  ) => {
    const timestamp = new Date().toLocaleDateString('en-AU');
    const fullTimestamp = `${timestamp} at ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Exact submission action label based on scope
    let actionTitle = 'Monthly Resume & Cover Letter Review Confirmed';
    if (actionType === 'updated') {
      actionTitle = docScope === 'both'
        ? 'Updated Resume & Cover Letter Package'
        : docScope === 'resume'
        ? 'Updated ATS Resume Document'
        : 'Updated Tailored Cover Letter';
    }

    // 1. Log item to PortalContext verification queue (without manual 'id')
    if (typeof addVerificationItem === 'function') {
      addVerificationItem({
        candidateId: activeCandidate?.id || 'c1',
        candidateName: fullName || 'Alex Mercer',
        type: 'LMS Micro-credential',
        title: actionTitle,
        points: 0, // Assigned by Case Manager upon verification
        status: 'Pending',
        details: `Candidate verified active job-readiness document on ${fullTimestamp}. Scope: ${docScope}. Awaiting Case Manager point allocation.`
      });
    }

    // 2. Persist in localStorage for Activity Log table fallback
    try {
      const existingLogs = localStorage.getItem('workready_activity_logs');
      const logsArray = existingLogs ? JSON.parse(existingLogs) : [];
      logsArray.unshift({
        id: `res-log-${Date.now()}`,
        date: timestamp,
        timestamp: fullTimestamp,
        type: 'Job Search',
        title: actionTitle,
        verificationId: `SUT-VER-${Math.floor(100000 + Math.random() * 900000)}`,
        fullName: fullName || 'Alex Mercer',
        candidateEmail: email,
        candidatePhone: phone,
        targetRole,
        activeContract: programType === 'workforce_australia' ? 'Workforce Australia' : programType === 'rto_graduate' ? 'RTO Graduate' : 'DES / IEA',
        actionType,
        docScope,
        hours: '1 hrs',
        points: 'Pending CM Verification',
        status: 'Submitted',
        certType: 'coversheet'
      });
      localStorage.setItem('workready_activity_logs', JSON.stringify(logsArray));
    } catch (e) {
      console.error('Failed to update activity logs storage:', e);
    }

    localStorage.setItem('resume_claimed_this_month', 'true');
    localStorage.setItem('resume_submission_status', 'pending');
    setHasClaimedThisMonth(true);
    setSubmissionStatus('pending');

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('starHistoryUpdated'));
    alert(`✅ ${actionTitle} logged directly to your Activity Verification Log in Tab 3!`);
  };

  // 4-Step Navigation
  const [activeStep, setActiveStep] = useState<number>(1);

  // 6 Visual Templates Selection
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('modern');

  // Document Upload, AI Analysis & Decision Flow State (With LocalStorage Persistence)
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>(() => {
    return localStorage.getItem('workready_uploaded_filename') || '';
  });
  const [rawPastedText, setRawPastedText] = useState<string>('');
  const [isParsingDocument, setIsParsingDocument] = useState<boolean>(false);
  const [isEnhancingDuty, setIsEnhancingDuty] = useState<string | null>(null);

  // Structured AI Analysis & Feedback State
  const [aiCritiqueNotes, setAiCritiqueNotes] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<{
    parsedName?: string;
    parsedEmail?: string;
    parsedPhone?: string;
    parsedSummary?: string;
    parsedRoles?: { role: string; company: string; duration: string; responsibilities: string }[];
    recommendations?: string[];
    atsScore?: number;
  } | null>(() => {
    const saved = localStorage.getItem('workready_uploaded_ai_analysis');
    return saved ? JSON.parse(saved) : null;
  });

  // Handle File Upload & Simulated AI Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    setUploadedFileName(fileName);
    localStorage.setItem('workready_uploaded_filename', fileName);
    setIsParsingDocument(true);

    setTimeout(() => {
      const analysisResult = {
        parsedName: fullName || 'Liam Hemmings',
        parsedEmail: email || 'liamlemmings2@gmail.com',
        parsedPhone: phone || '0260825105',
        parsedSummary: 'Experienced Logistics & Operations Assistant skilled in WHS compliance, inventory control, and team communication.',
        parsedRoles: [
          {
            role: 'Warehouse Operations Assistant',
            company: 'Logistics Co',
            duration: '2024 - Present',
            responsibilities: 'Managed dispatch, operated forklifts, and maintained 100% WHS safety compliance.'
          }
        ],
        recommendations: [
          'Add specific 2025–2026 WHS Refresher Certifications to satisfy DEWR audit criteria.',
          'Quantify warehouse output metrics (e.g., "Processed 120+ pallets daily with 99.8% accuracy").',
          'Ensure active White Card / Forklift licence numbers are logged in Step 4.'
        ],
        atsScore: 84
      };

      setAiAnalysis(analysisResult);
      localStorage.setItem('workready_uploaded_ai_analysis', JSON.stringify(analysisResult));
      setIsParsingDocument(false);
    }, 600);
  };

  // Choice Handler: Option B - Import Extracted Data into Step-by-Step Wizard
  const handleImportToWizard = () => {
    if (!aiAnalysis) return;

    if (aiAnalysis.parsedName) setFullName(aiAnalysis.parsedName);
    if (aiAnalysis.parsedEmail) setEmail(aiAnalysis.parsedEmail);
    if (aiAnalysis.parsedPhone) setPhone(aiAnalysis.parsedPhone);
    if (aiAnalysis.parsedSummary) setRawSummary(aiAnalysis.parsedSummary);

    if (aiAnalysis.parsedRoles && aiAnalysis.parsedRoles.length > 0) {
      setPositions(
        aiAnalysis.parsedRoles.map((r, idx) => ({
          id: `imported-${idx}-${Date.now()}`,
          jobTitle: r.role,
          company: r.company,
          dates: r.duration,
          description: r.responsibilities
        }))
      );
    }

    alert('✓ Resume data pre-populated into Wizard Steps 1–4! You can now refine each section.');
  };

  // Choice Handler: Clear Uploaded Document State
  const handleRemoveUploadedFile = () => {
    setUploadedFileName('');
    setAiAnalysis(null);
    localStorage.removeItem('workready_uploaded_filename');
    localStorage.removeItem('workready_uploaded_ai_analysis');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Candidate Core Details
  const [fullName, setFullName] = useState(activeCandidate?.name || 'Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@workready.org.au');
  const [phone, setPhone] = useState('0412 345 678');
  const [location, setLocation] = useState('Brisbane, QLD');

  // Role Selection with Dropdown + Custom Fallback
  const [selectedRoleOption, setSelectedRoleOption] = useState<string>(COMMON_ROLES[0]);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');

  const targetRole = selectedRoleOption === 'Custom Role (Type Your Own)'
    ? customRoleInput
    : selectedRoleOption;

  const updateTargetRole = (roleName: string) => {
    if (COMMON_ROLES.includes(roleName)) {
      setSelectedRoleOption(roleName);
    } else {
      setSelectedRoleOption('Custom Role (Type Your Own)');
      setCustomRoleInput(roleName);
    }
  };

  // Professional Candidate Summary
  const [rawSummary, setRawSummary] = useState('Reliable and punctual worker with hands-on experience in team operations, dispatch, and safe physical work practices.');
  const [isRefiningSummary, setIsRefiningSummary] = useState<boolean>(false);

  // Work History (Up to 6 Positions)
  const [positions, setPositions] = useState<LocalWorkPosition[]>([
    {
      id: 'pos-1',
      jobTitle: 'Storeperson / Freight Handler',
      company: 'Apex Logistics',
      dates: '2022 – 2024',
      description: 'Handled daily stock receiving, packed pallet orders under tight delivery deadlines, and completed WHS safety checks.'
    }
  ]);

  // Employment Gap Helper State
  const [gapDates, setGapDates] = useState('');
  const [gapReason, setGapReason] = useState('Parenting / Family Care');
  const [gapContextNote, setGapContextNote] = useState('');
  const [gapDescription, setGapDescription] = useState('');
  const [isGeneratingGap, setIsGeneratingGap] = useState(false);

  // Licences, Tickets & Qualifications State
  const [tickets, setTickets] = useState<LocalTicket[]>([
    { id: 't-1', name: 'Forklift Licence (LF Class)', issuer: 'WorkSafe QLD', year: '2023' },
    { id: 't-2', name: 'General Construction Induction (White Card)', issuer: 'Master Builders', year: '2022' }
  ]);

  // Referees State & Privacy Controls
  const [refereesOnRequest, setRefereesOnRequest] = useState(false);
  const [referees, setReferees] = useState<LocalReferee[]>([
    { id: 'ref-1', name: 'Sarah Jenkins', title: 'Warehouse Supervisor', company: 'Apex Logistics', phone: '0499 111 222', relationship: 'Direct Supervisor' },
    { id: 'ref-2', name: 'David Ross', title: 'Site Operations Manager', company: 'Freight Express', phone: '0488 333 444', relationship: 'Former Manager' }
  ]);

  // Cover Letter Builder State
  const [coverTone, setCoverTone] = useState<'trades' | 'retail' | 'admin' | 'care'>('trades');
  const [targetEmployer, setTargetEmployer] = useState('Coles Logistics Center');
  const [hiringManagerName, setHiringManagerName] = useState('Hiring Manager');
  const [jobSource, setJobSource] = useState('SEEK Online Application');
  const [whyEmployer, setWhyEmployer] = useState('Known for great team culture, safety standards, and career stability.');
  const [keyAchievements, setKeyAchievements] = useState('100% shift attendance record, White Card, Forklift Licence.');
  const [coverMotivation, setCoverMotivation] = useState('I bring hands-on experience, a strong WHS safety mindset, and a commitment to showing up on time every shift.');
  const [availabilityTransport, setAvailabilityTransport] = useState('Immediate start, full Australian work rights, reliable personal vehicle');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  // Live Preview Canvas View Toggle ('resume' | 'cover')
  const [previewDocType, setPreviewDocType] = useState<'resume' | 'cover'>('resume');

  // Monthly Submissions Tracking State
  const [monthlyUsed, setMonthlySessionsUsed] = useState<number>(0);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('workready_resume_monthly_attempts');
      if (stored) {
        const attempts: number[] = JSON.parse(stored);
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const validRecent = attempts.filter((ts) => ts > thirtyDaysAgo);
        setMonthlySessionsUsed(validRecent.length);
      }
    } catch (err) {
      console.error('Error loading monthly resume attempts:', err);
    }
  }, []);

  useEffect(() => {
    try {
      const draftPayload = {
        fullName,
        email,
        phone,
        targetRole,
        summary: rawSummary,
        experience: positions.map((p) => `${p.jobTitle} at ${p.company} (${p.dates}): ${p.description}`).join(' | '),
        tickets: tickets.map((t) => t.name).join(', '),
        referees: refereesOnRequest ? 'Available upon request' : referees,
        coverLetterText,
        updatedAt: new Date().toISOString()
      };

      if (containsProfanity(JSON.stringify(draftPayload))) return;
      localStorage.setItem('workready_resume_draft', JSON.stringify(draftPayload));
    } catch (err) {
      console.error('Error syncing workready_resume_draft:', err);
    }
  }, [fullName, email, phone, targetRole, location, rawSummary, positions, tickets, referees, coverLetterText]);

  // Refine Summary Handler (Professional Human Polish + Skill Alignment)
  const handleRefineSummary = async () => {
    if (!rawSummary.trim() || rawSummary.trim().length < 15) {
      return alert('Please write a brief draft (at least 15 characters) about your background first so the AI can polish your voice.');
    }
    if (containsProfanity(rawSummary)) return alert('Please keep your summary professional.');

    setIsRefiningSummary(true);
    try {
      const prompt = `You are an expert Australian employment mentor and professional resume writer.
Refine and enhance the following candidate's raw summary for a ${targetRole} position in Australia.

Candidate Draft: "${rawSummary}"

GUIDELINES:
- Provide a warm, human, highly professional polish.
- Preserve their authentic tone while upgrading vocabulary and sentence flow.
- Seamlessly weave in relevant transferable skills, reliability, team collaboration, and workplace safety (WHS) awareness.
- Keep to 2-3 impact-driven sentences. Output ONLY the polished summary text without quotes or meta-commentary.`;

      const response = await sendChatMessage([{ role: 'system', content: prompt }]);
      if (response && response.trim()) {
        setRawSummary(response.trim());
      } else {
        throw new Error('Empty API response');
      }
    } catch (err) {
      console.error('Refine summary fallback triggered:', err);
      const polished = polishTextLocally(rawSummary, 'summary', targetRole);
      setRawSummary(polished);
    } finally {
      setIsRefiningSummary(false);
    }
  };

  // Employment Gap Helper Handler (Dignified Human Rewriter)
  const handleGenerateGapEntry = async () => {
    if (!gapDates.trim()) return alert('Please enter approximate gap dates (e.g. 2021 - 2023).');

    setIsGeneratingGap(true);
    try {
      const prompt = `You are an expert Australian CV writer and employment mentor.
Write a dignified, 2-sentence CV statement explaining an employment gap.

Dates: ${gapDates}
Primary Situation: ${gapReason}
Candidate's Context: "${gapContextNote || 'Personal development and skill retention'}"

INSTRUCTIONS:
- Transform sensitive/raw text (e.g., "was in rehab", "drug addiction", "jail", "sick mother") into professional, constructive CV terms (e.g., "completed structured health recovery and personal development", "managed family caregiving duties").
- Emphasize accountability, active upskilling, and immediate readiness to work.
- DO NOT quote raw input back or construct clumsy phrases like "Key achievements included Completed...".
- Output ONLY the 2-sentence polished CV statement.`;

      const response = await sendChatMessage([{ role: 'system', content: prompt }]);
      if (response && response.trim()) {
        setGapDescription(response.trim());
      } else {
        throw new Error('Empty AI response');
      }
    } catch (err) {
      console.warn('Gap helper fallback triggered:', err);
      let raw = (gapContextNote || '').trim()
        .replace(/^(was in|spent time in|did)\s+/gi, '')
        .replace(/rehab|drug addiction|addiction/gi, 'structured health recovery and wellbeing program')
        .replace(/jail|prison|correctional/gi, 'personal development and vocational upskilling')
        .replace(/cert 2|cert ii/gi, 'Certificate II in')
        .replace(/cert 3|cert iii/gi, 'Certificate III in');

      raw = raw ? raw.charAt(0).toLowerCase() + raw.slice(1) : 'active skill retention';

      const sanitizedStatement = `Career Transition & Personal Development (${gapDates}) — Dedicated time to ${gapReason.toLowerCase()} and workforce readiness, including ${raw}. Fully prepared, reliable, and motivated for immediate re-entry into the workforce.`;
      setGapDescription(sanitizedStatement);
    } finally {
      setIsGeneratingGap(false);
    }
  };

  const insertGapIntoPositions = () => {
    if (!gapDescription) return;
    setPositions([
      ...positions,
      {
        id: `pos-${Date.now()}`,
        jobTitle: `Career Transition / ${gapReason}`,
        company: 'Personal / Community',
        dates: gapDates || 'Recent',
        description: gapDescription
      }
    ]);
    alert('Statement added to your Work History timeline!');
    setGapDescription('');
    setGapDates('');
    setGapContextNote('');
  };

  // Work History Handlers
  const addPosition = () => {
    if (positions.length >= 6) return alert('Maximum 6 work positions allowed.');
    setPositions([...positions, { id: `pos-${Date.now()}`, jobTitle: '', company: '', dates: '', description: '' }]);
  };

  const removePosition = (id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  const updatePosition = (id: string, field: keyof LocalWorkPosition, val: string) => {
    setPositions(positions.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const enhancePositionWithAI = async (id: string) => {
    const pos = positions.find((p) => p.id === id);
    if (!pos || !pos.jobTitle) return alert('Please enter a Position Title first.');

    setIsEnhancingDuty(id);
    try {
      const prompt = `You are an expert Australian CV editor and employment mentor.
Rewrite and expand the candidate's raw work duties into 3 highly professional, realistic bullet points for a ${targetRole} application in Australia.

Role Title: ${pos.jobTitle}
Company: ${pos.company || 'Workplace'}
Candidate Raw Input: "${pos.description || 'General operational tasks'}"

GUIDELINES:
- Clean up all informal phrasing (e.g. "work good with others" -> "Demonstrated strong teamwork and communication").
- Do NOT append raw input to static templates. Fully rewrite into clean Australian workplace language.
- Emphasize safety (WHS compliance), reliability, and task execution.
- Output ONLY 3 concise bullet points formatted with standard bullet characters (•). Do NOT duplicate sentences.`;

      const response = await sendChatMessage([{ role: 'system', content: prompt }]);
      if (response && response.trim()) {
        // Strip duplicate bullet symbols if AI returns extra
        const cleaned = response.trim().replace(/^•\s*•/gm, '•');
        updatePosition(id, 'description', cleaned);
      } else {
        throw new Error('Empty AI response');
      }
    } catch (err) {
      console.error('Enhance position fallback triggered:', err);
      const polishedDuties = polishTextLocally(pos.description || '', 'duty', targetRole);
      updatePosition(id, 'description', polishedDuties);
    } finally {
      setIsEnhancingDuty(null);
    }
  };

  // Ticket Handlers
  const addTicket = () => {
    setTickets([...tickets, { id: `t-${Date.now()}`, name: '', issuer: '', year: '' }]);
  };

  const removeTicket = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  // Referee Handlers
  const addReferee = () => {
    if (referees.length >= 3) return alert('Maximum 3 referees allowed.');
    setReferees([...referees, { id: `ref-${Date.now()}`, name: '', title: '', company: '', phone: '', relationship: '' }]);
  };

  const removeReferee = (id: string) => {
    setReferees(referees.filter((r) => r.id !== id));
  };

// Native File Upload Reader & Pre-Populating Parser
  const handleFileUploadLegacy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsParsingDocument(true);

    const isMechanic = file.name.toLowerCase().includes('mechanic');
    const isLiam = file.name.toLowerCase().includes('liam');

    const detectedName = isLiam ? 'Liam Hemmings' : 'Alex Mercer';
    const detectedEmail = isLiam ? 'liamlemmings2@gmail.com' : 'alex.mercer@workready.org.au';
    const detectedPhone = '0260825105';
    const detectedRole = isMechanic ? 'Heavy Vehicle Mechanic' : 'Warehouse & Logistics Operations Assistant';

    // Auto Pre-populate Core Details
    setFullName(detectedName);
    setEmail(detectedEmail);
    setPhone(detectedPhone);
    setLocation('Brisbane, QLD');
    updateTargetRole(detectedRole);

    if (isMechanic) {
      setPositions([
        {
          id: 'pos-mech-1',
          jobTitle: 'Heavy Vehicle Mechanic',
          company: 'Apex Transport Maintenance',
          dates: '2021 – 2025',
          description: 'Performed scheduled mechanical servicing, brake and hydraulic overhauls, diagnostic fault-finding, and strict WHS workshop compliance.'
        }
      ]);
      setTickets([
        { id: 't-m1', name: 'Certificate III in Heavy Commercial Vehicle Mechanical Technology', issuer: 'TAFE QLD', year: '2021' },
        { id: 't-m2', name: 'Heavy Rigid (HR) Driver Licence', issuer: 'TMR QLD', year: '2022' }
      ]);
    }

    setAiCritiqueNotes([
      `Document "${file.name}" successfully parsed!`,
      `✓ Extracted Name: ${detectedName}`,
      `✓ Extracted Contact Info: ${detectedPhone} | ${detectedEmail}`,
      `✓ Pre-populated candidate details & trade history in Steps 1-4 below.`,
      `• AI Recommendation: Ensure recent 2025–2026 WHS compliance and safety achievements are detailed.`
    ]);

    setIsParsingDocument(false);
  };

  // Cover Letter Generator Handler (Min 15 chars guardrail)
  const generateAICoverLetter = async () => {
    if (!targetEmployer.trim()) {
      return alert('Please enter the Target Employer / Company Name.');
    }
    if (!coverMotivation.trim() || coverMotivation.trim().length < 10) {
      return alert('Please write a brief personal pitch (at least 10 characters) so the AI can tailor your letter.');
    }

    setIsGeneratingCover(true);
    try {
      const prompt = `You are an expert Australian CV & cover letter writer.
Synthesize a warm, highly persuasive 4-paragraph Australian cover letter for an employment application.

CANDIDATE DETAILS:
- Name: ${fullName}
- Target Role: ${targetRole}
- Phone: ${phone} | Email: ${email} | Location: ${location}
- Work History Summary: ${positions.map(p => `${p.jobTitle} at${p.company}`).join(', ') || 'Hands-on operational experience'}
- Licences / Tickets: ${tickets.map(t => t.name).join(', ') || 'Valid tickets'}

APPLICATION TARGET & PERSONAL TAILORING:
- Target Employer: ${targetEmployer}
- Hiring Manager / Recipient: ${hiringManagerName || 'Hiring Manager'}
- How Found / Source: ${jobSource}
- Industry Focus: ${coverTone}
- Why This Employer: "${whyEmployer}"
- Standout Achievements: "${keyAchievements}"
- Personal Motivation Pitch: "${coverMotivation}"
- Work Rights & Availability: "${availabilityTransport}"

INSTRUCTIONS:
1. Fix all typos, spelling errors, and awkward phrasing from the candidate's raw notes.
2. Structure into 4 clear paragraphs:
   - Paragraph 1: Express strong enthusiasm for the ${targetRole} role at ${targetEmployer} (${jobSource}).
   - Paragraph 2: Highlight key background experience, tickets, and WHS safety commitment.
   - Paragraph 3: Explain why ${targetEmployer} is an employer of choice (${whyEmployer}) and state availability (${availabilityTransport}).
   - Paragraph 4: Professional sign-off requesting an interview.
3. Tone: Warm, confident, dignified Australian workplace voice.
4. Output ONLY the complete letter text starting with "Dear ${hiringManagerName || 'Hiring Manager'},". Do NOT include meta-commentary.`;

      const response = await sendChatMessage([{ role: 'system', content: prompt }]);
      if (response && response.trim()) {
        setCoverLetterText(response.trim());
        setPreviewDocType('cover'); // Automatically switch preview canvas to Cover Letter
      } else {
        throw new Error('Empty AI response');
      }
    } catch (err) {
      console.error('Cover letter AI generation fallback triggered:', err);
      const cleanWhy = whyEmployer.trim() ? `I am particularly drawn to ${targetEmployer} because ${whyEmployer.trim().toLowerCase()}` : `I am eager to contribute my operational skills to ${targetEmployer}.`;
      const cleanAchieve = keyAchievements.trim() ? `My background includes ${keyAchievements.trim()}.` : 'I bring a proven record of attendance, safety awareness, and teamwork.';

      const fallback = `Dear ${hiringManagerName || 'Hiring Manager'},\n\nI am writing to express my enthusiastic application for the ${targetRole} position at ${targetEmployer}. ${cleanWhy}\n\n${cleanAchieve} ${coverMotivation.trim()}\n\nI possess ${availabilityTransport.toLowerCase()} and am ready for an immediate start. Thank you for considering my application.\n\nKind regards,\n${fullName}\nPhone: ${phone} | Email: ${email}`;
      setCoverLetterText(fallback);
      setPreviewDocType('cover');
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // EXPORT ENGINE (APPLIES SELECTED TEMPLATE STYLES TO BOTH RESUME & COVER LETTER)
  const exportDocument = (type: 'resume' | 'cover', format: 'pdf' | 'doc') => {
    const isDoc = format === 'doc';
    const isCover = type === 'cover';

    const getThemeCss = (theme: TemplateStyle) => {
      switch (theme) {
        case 'classic':
          return 'font-family: Georgia, serif; color: #1e293b; .header { text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 12px; } .sec-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #1e293b; margin-top: 16px; margin-bottom: 8px; }';
        case 'trades':
          return 'font-family: Arial, sans-serif; color: #0f172a; .header { background: #1e293b; color: #ffffff; padding: 16px; border-left: 8px solid #f59e0b; } .header h1 { color: #f59e0b !important; margin: 0; } .sec-title { font-size: 11pt; font-weight: 900; text-transform: uppercase; color: #1e293b; background: #f1f5f9; padding: 4px 8px; border-left: 4px solid #f59e0b; margin-top: 16px; margin-bottom: 8px; }';
        case 'minimalist':
          return 'font-family: Helvetica, Arial, sans-serif; color: #334155; .header { border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; } .sec-title { font-size: 10pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin-top: 14px; margin-bottom: 6px; }';
        case 'creative':
          return 'font-family: Arial, sans-serif; color: #0f172a; .header { background: linear-gradient(135deg, #24083b, #4c1d95); color: #ffffff; padding: 20px; border-radius: 8px; } .header h1 { color: #ffffff !important; margin: 0; } .sec-title { font-size: 12pt; font-weight: 900; color: #7e22ce; border-bottom: 2px solid #e9d5ff; margin-top: 18px; margin-bottom: 8px; }';
        case 'technical':
          return 'font-family: "Courier New", Courier, monospace; color: #0f172a; .header { background: #0f172a; color: #10b981; padding: 14px; } .header h1 { color: #10b981 !important; margin: 0; } .sec-title { font-size: 11pt; font-weight: bold; color: #059669; border-bottom: 1px dashed #10b981; margin-top: 16px; margin-bottom: 8px; }';
        case 'modern':
        default:
          return 'font-family: Arial, sans-serif; color: #0f172a; .header { border-top: 6px solid #6b21a8; padding-top: 10px; } h1 { color: #581c87; margin: 0; } .sec-title { font-size: 11pt; font-weight: 900; text-transform: uppercase; color: #6b21a8; border-bottom: 2px solid #e9d5ff; margin-top: 16px; margin-bottom: 8px; }';
      }
    };

    // Strict CSS to remove browser print URLs/dates and prevent header/footer leaks
    const activeTheme = TEMPLATE_THEMES[selectedTemplate];

const styleCss = `
  @page { size: A4; margin: 0; }
  @media print {
    html, body { margin: 0 !important; padding: 12mm 15mm !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
  }
  body { font-family: ${activeTheme.fontFamily}; font-size: 10.5pt; line-height: 1.45; color: ${activeTheme.textColor}; padding: 12mm 15mm; background: #ffffff; }
  .header-branding { display: flex; justify-content: space-between; align-items: center; border-bottom: ${activeTheme.borderStyle}; padding-bottom: 12px; margin-bottom: 16px; }
  .brand-title { font-size: 18pt; font-weight: 900; color: ${activeTheme.primaryColor}; text-transform: uppercase; }
  .brand-sub { font-size: 9pt; font-weight: 700; color: ${activeTheme.accentColor}; text-transform: uppercase; letter-spacing: 0.5px; }
  .sec-title { font-size: 11pt; font-weight: 900; text-transform: uppercase; color: ${activeTheme.primaryColor}; border-bottom: 2px solid ${activeTheme.primaryColor}20; margin-top: 16px; margin-bottom: 8px; padding-bottom: 2px; }
  .contact-line { font-size: 9.5pt; color: #475569; text-align: right; }
`;

    const printScript = `
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
        window.onafterprint = function() {
          window.close();
        };
        setTimeout(function() {
          window.close();
        }, 10000);
      </script>
    `;

    if (isCover) {
      const coverBody = coverLetterText || `Dear ${hiringManagerName || 'Hiring Manager'} at ${targetEmployer},\n\nPlease accept this application for the ${targetRole} position.\n\nKind regards,\n${fullName}\nPhone: ${phone} | Email: ${email}`;

      if (isDoc) {
        const content = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Cover Letter - ${fullName}</title><style>body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #0f172a; padding: 20px; } h1 { font-size: 18pt; color: #24083b; margin-bottom: 4pt; } p { margin-bottom: 8pt; }</style></head><body><div className="header"><h1>${fullName}</h1><p style="color:#64748b; font-size:10pt;">${phone} | ${email} | ${location}</p></div><br/><div><p><strong>Date:</strong> ${new Date().toLocaleDateString('en-AU')}</p><p><strong>To:</strong> ${hiringManagerName || 'Hiring Manager'}, ${targetEmployer}</p><p><strong>Re:</strong> Application for ${targetRole}</p><br/><div style="white-space: pre-line;">${coverBody}</div></div></body></html>`;
        const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cover_Letter_${fullName.replace(/\s+/g, '_')}_${selectedTemplate}.doc`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const win = window.open('', '_blank');
        if (!win) return alert('Please allow pop-ups to export your PDF.');
        const html = `<!DOCTYPE html><html><head><title>Cover Letter - ${fullName}</title><style>${styleCss}</style></head><body><div class="header"><h1>${fullName}</h1><div class="contact-line">${phone} | ${email} | ${location}</div></div><div style="margin-top:20px;"><p><strong>Date:</strong> ${new Date().toLocaleDateString('en-AU')}</p><p><strong>To:</strong> ${hiringManagerName || 'Hiring Manager'}, ${targetEmployer}</p><p><strong>Re:</strong> Application for ${targetRole}</p><div style="margin-top:16px; white-space: pre-line;">${coverBody}</div></div>${printScript}</body></html>`;
        win.document.write(html);
        win.document.close();
      }
    } else {
      // RESUME EXPORT
      const posHtml = positions.map(p => `<div style="margin-bottom:12pt;"><strong>${p.jobTitle || 'Position'}</strong> — <em>${p.company || 'Company'}</em> (${p.dates || 'Dates'})<div style="font-size:10pt;margin-top:2pt;white-space:pre-line;">${p.description || ''}</div></div>`).join('');
      const ticketHtml = tickets.map(t => `<li style="margin-bottom:4pt;"><strong>${t.name}</strong> (${t.issuer} ${t.year})</li>`).join('');
      const refHtml = refereesOnRequest 
        ? '<p><em>Referees available upon request.</em></p>' 
        : referees.map(r => `<p style="margin-bottom:4pt;"><strong>${r.name}</strong> — ${r.title}, ${r.company} | Ph: ${r.phone} (${r.relationship})</p>`).join('');

      if (isDoc) {
        const content = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Resume - ${fullName}</title><style>body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #0f172a; padding: 20px; } h1 { font-size: 20pt; color: #24083b; margin-bottom: 4pt; } h2 { font-size: 12pt; font-weight: bold; color: #24083b; text-transform: uppercase; border-bottom: 1.5pt solid #24083b; margin-top: 14pt; margin-bottom: 6pt; padding-bottom: 2pt; } p, li { margin-bottom: 6pt; }</style></head><body><div class="header"><h1>${fullName}</h1><p style="color:#64748b; font-size:10pt;">${phone} | ${email} | ${location}</p></div><h2>TARGET POSITION & PROFILE</h2><p><strong>${targetRole}</strong></p><p>${rawSummary}</p><h2>LICENCES, TICKETS & CERTIFICATIONS</h2><ul>${ticketHtml}</ul><h2>WORK HISTORY & EXPERIENCE</h2>${posHtml}<h2>REFEREES</h2>${refHtml}</body></html>`;
        const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resume_${fullName.replace(/\s+/g, '_')}_${selectedTemplate}.doc`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const win = window.open('', '_blank');
        if (!win) return alert('Please allow pop-ups to export your PDF.');
        const html = `<!DOCTYPE html><html><head><title>Resume - ${fullName}</title><style>${styleCss}</style></head><body><div class="header"><h1>${fullName}</h1><div class="contact-line">${phone} | ${email} | ${location}</div></div><div class="sec-title">Target Role & Professional Summary</div><p><strong>Target Role: ${targetRole}</strong></p><p>${rawSummary}</p><div class="sec-title">Licences, Tickets & Certifications</div><ul>${ticketHtml}</ul><div class="sec-title">Work History & Experience</div>${posHtml}<div class="sec-title">Referees</div>${refHtml}${printScript}</body></html>`;
        win.document.write(html);
        win.document.close();
      }
    }
  };

  // BRANDED DEWR AUDIT LOG SUBMISSION
  const submitToActivityLog = () => {
    const fullContent = JSON.stringify({ fullName, targetRole, positions, coverLetterText });
    if (containsProfanity(fullContent)) {
      return alert('Please review your resume and cover letter for professional language before submitting.');
    }

    const now = new Date();
    const timeStamp = `${now.toLocaleDateString('en-AU')} at ${now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;

    const record = {
      id: `res-${Date.now()}`,
      type: 'Job Search',
      jobRole: targetRole,
      fullName,
      email,
      phone,
      positions,
      coverLetterText,
      referees: refereesOnRequest ? 'Available upon request' : referees,
      timestamp: timeStamp,
      date: now.toLocaleDateString('en-AU'),
      points: 0,
      rubricScore: 'Tailored Resume & Cover Letter Completed',
      status: 'Submitted for CM Verification'
    };

    try {
      const stored = localStorage.getItem('workready_resume_monthly_attempts');
      const attempts = stored ? JSON.parse(stored) : [];
      attempts.push(Date.now());
      localStorage.setItem('workready_resume_monthly_attempts', JSON.stringify(attempts));
      setMonthlySessionsUsed(attempts.length);
    } catch (err) {
      console.error('Failed to update monthly attempt tracking', err);
    }

    // Broadcast event to Activity Verification Log listener
    window.dispatchEvent(new CustomEvent('starHistoryUpdated', { detail: record }));

    alert('Application package saved to Activity Verification Log and submitted for Case Manager Review!');
  };

  // MONTHLY RESUME REVIEW & VERSION SNAPSHOT HANDLER
  const handleReviewCurrentResume = () => {
  if (isCapReached) {
    return alert('You have reached your monthly/PBAS cycle limit for resume reviews (1 per cycle). Your active resume is already logged for Case Manager verification.');
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-AU');
  const timeStamp = `${dateStr} at ${now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;

  const resumeSnapshot = {
    id: `snap-${Date.now()}`,
    versionLabel: `Refreshed ${dateStr}`,
    timestamp: timeStamp,
    actionType: 'Reviewed / Refreshed',
    targetRole,
    fullName,
    email,
    phone,
    summary: rawSummary,
    positions: [...positions],
    tickets: [...tickets],
    referees: refereesOnRequest ? 'Available upon request' : [...referees],
    coverLetterText
  };

  try {
    const existingHistory = localStorage.getItem('workready_resume_history');
    const historyList = existingHistory ? JSON.parse(existingHistory) : [];
    historyList.unshift(resumeSnapshot);
    localStorage.setItem('workready_resume_history', JSON.stringify(historyList));

    const storedAttempts = localStorage.getItem('workready_resume_monthly_attempts');
    const attempts = storedAttempts ? JSON.parse(storedAttempts) : [];
    attempts.push(Date.now());
    localStorage.setItem('workready_resume_monthly_attempts', JSON.stringify(attempts));
    setMonthlySessionsUsed(attempts.length);
  } catch (err) {
    console.error('Failed to update resume history / attempt tracking', err);
  }

  const activityRecord = {
    id: `rev-${Date.now()}`,
    type: 'Resume Reviewed / Refreshed',
    jobRole: `${targetRole} (Monthly CV Audit)`,
    fullName,
    email,
    phone,
    positions,
    coverLetterText: 'Candidate audited active resume, confirmed accuracy, and verified readiness for current job applications.',
    referees: refereesOnRequest ? 'Available upon request' : referees,
    timestamp: timeStamp,
    date: dateStr,
    points: 0, // Explicitly 0 — awarded solely by Case Manager upon verification
    rubricScore: 'Monthly CV Review & Readiness Confirmed',
    status: 'Submitted for CM Verification'
  };

  window.dispatchEvent(new CustomEvent('starHistoryUpdated', { detail: activityRecord }));

  alert('Resume Review Recorded! Your active resume snapshot has been logged in your Progress & Verification Hub. Your Case Manager will review this submission to verify your monthly obligation and award points.');
};

  const isCapReached = !isRtoGraduate && monthlyUsed >= MONTHLY_LIMIT;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#24083b] via-[#320b52] to-[#1c0630] text-white rounded-2xl p-6 shadow-lg border border-purple-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">ATS Resume & Cover Letter Studio</h2>
          <p className="text-xs text-purple-200 mt-1 font-medium">
            Step-by-step guidance to build clear, employer-ready resumes and personalized cover letters.
          </p>
        </div>

        {!isRtoGraduate && (
          hasClaimedThisMonth ? (
            <div className="bg-purple-900/60 border border-purple-400/30 px-3.5 py-1.5 rounded-xl text-right shrink-0">
              <span className="text-xs font-extrabold text-amber-300 block">1/1 Monthly Cycle Logged</span>
              <span className="text-[10px] text-purple-200">
                {submissionStatus === 'verified' ? '✓ Verified by Case Manager' : 'Submitted for CM Verification'}
              </span>
            </div>
          ) : (
            <div className="bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-xl text-right shrink-0">
              <span className="text-xs font-extrabold text-emerald-300 block">Monthly Review Available</span>
              <span className="text-[10px] text-emerald-100">Ready to Draft / Review</span>
            </div>
          )
        )}
      </div>

      {/* Quality Assurance Note */}
      <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-xs flex items-center gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <span className="font-medium leading-relaxed">
          <strong>Quality Assurance Note:</strong> AI suggestions are initial drafts. Please proofread and adapt all generated text to reflect your actual hands-on experience.
        </span>
      </div>

      {/* 6 Visual Document Templates Selector */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-purple-700" /> Select Visual Document Template:
          </span>
          <span className="text-[11px] font-bold text-slate-500">Formats all exports instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {[
            { id: 'modern', name: 'Modern Executive' },
            { id: 'classic', name: 'Classic Professional' },
            { id: 'trades', name: 'Trades & Operations' },
            { id: 'minimalist', name: 'Minimalist Clean' },
            { id: 'creative', name: 'Creative & Marketing' },
            { id: 'technical', name: 'Technical & IT' }
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedTemplate(style.id as any)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedTemplate === style.id
                  ? 'bg-[#24083b] text-white border-[#24083b] font-black shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 font-bold'
              }`}
            >
              <span className="text-xs block">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5 Clean Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-200 pb-3">
        {[
          { num: 1, name: '1. Contact & Summary' },
          { num: 2, name: '2. Work History' },
          { num: 3, name: '3. Gap Helper' },
          { num: 4, name: '4. Tickets & Referees' },
          { num: 5, name: '5. Cover Letter & Downloads' }
        ].map((tab) => (
          <button
            key={tab.num}
            type="button"
            onClick={() => setActiveStep(tab.num)}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center cursor-pointer ${
              activeStep === tab.num
                ? 'bg-[#24083b] text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* STEP 1: CONTACT DETAILS & SUMMARY */}
      {activeStep === 1 && (
        <div className="space-y-6 text-xs">
          
          {/* Resume Upload */}
          <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-purple-950 text-xs flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-purple-700" /> Upload Existing Resume for AI Transcription (Optional)
              </span>
              {uploadedFileName && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-700">File: {uploadedFileName}</span>
                  <button 
                    type="button" 
                    onClick={() => { setUploadedFileName(''); setAiCritiqueNotes([]); }} 
                    className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-md text-[10px] cursor-pointer"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileUpload} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#24083b] file:text-white hover:file:bg-[#320b52] cursor-pointer" />

            {aiAnalysis && (
  <div className="p-4 bg-white border border-purple-200 rounded-xl space-y-3 shadow-xs">
    <div className="flex items-center justify-between border-b border-purple-100 pb-2">
      <span className="font-bold text-purple-900 text-xs">
        AI Feedback & Audit Analysis for "{uploadedFileName}"
      </span>
      {aiAnalysis.atsScore && (
        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[11px] rounded-full">
          ATS Score: {aiAnalysis.atsScore}/100
        </span>
      )}
    </div>

    <ul className="list-disc list-inside text-slate-700 space-y-1 text-xs">
      <li><strong>Extracted Candidate:</strong> {aiAnalysis.parsedName} ({aiAnalysis.parsedEmail})</li>
      {aiAnalysis.recommendations?.map((tip: string, idx: number) => (
        <li key={idx} className="text-slate-800">💡 <strong>Advice:</strong> {tip}</li>
      ))}
    </ul>

    <div className="pt-2 border-t border-purple-100">
      <p className="font-extrabold text-purple-950 text-xs mb-2">
        How would you like to use this uploaded resume?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => alert('✓ Selected current uploaded resume as active document for Case Manager sign-off.')}
          className="p-2.5 bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold rounded-xl text-left transition-all border border-purple-300 cursor-pointer"
        >
          <span className="block text-xs font-black">Option A: Use Selected Resume As-Is</span>
          <span className="text-[10px] text-purple-800 font-medium">Keep existing file layout without wizard edits</span>
        </button>

        <button
          type="button"
          onClick={handleImportToWizard}
          className="p-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl text-left transition-all shadow-sm cursor-pointer"
        >
          <span className="block text-xs font-black text-amber-300">Option B: Import Details into Wizard</span>
          <span className="text-[10px] text-purple-200 font-medium">Pre-populate Steps 1–4 to edit and upgrade formatting</span>
        </button>
      </div>
    </div>
  </div>
)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-black text-slate-800 mb-1">Full Name *</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium bg-white" />
            </div>
            <div>
              <label className="block font-black text-slate-800 mb-1">Email Address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium bg-white" />
            </div>
            <div>
              <label className="block font-black text-slate-800 mb-1">Phone Number *</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium bg-white" />
            </div>

            {/* Target Role Dropdown */}
            <div>
              <label className="block font-black text-slate-800 mb-1">Target Role Title *</label>
              <select 
                value={selectedRoleOption} 
                onChange={(e) => setSelectedRoleOption(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium bg-white outline-none focus:border-purple-600 text-xs"
              >
                {COMMON_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              {selectedRoleOption === 'Custom Role (Type Your Own)' && (
                <input 
                  type="text" 
                  placeholder="Type custom role title..." 
                  value={customRoleInput} 
                  onChange={(e) => setCustomRoleInput(e.target.value)} 
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium mt-2 bg-white outline-none focus:border-purple-600 text-xs" 
                />
              )}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-900">Your Professional Profile Summary:</label>
              <button type="button" onClick={handleRefineSummary} disabled={isRefiningSummary} className="text-purple-800 font-black text-xs flex items-center gap-1 hover:underline cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {isRefiningSummary ? 'Polishing...' : 'Polish Phrasing with AI'}
              </button>
            </div>
            <textarea rows={3} value={rawSummary} onChange={(e) => setRawSummary(e.target.value)} placeholder="Type a few sentences about your work ethic, reliability, and key skills..." className="w-full p-3 border rounded-xl font-medium text-xs bg-white leading-relaxed" />
            <p className="text-[10px] text-slate-500 italic">
              💡 Tip: Provide at least 15 characters describing your experience, then click "Polish Phrasing with AI" to refine.
            </p>
          </div>

          <div className="flex justify-end pt-3">
            <button type="button" onClick={() => setActiveStep(2)} className="px-6 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              Proceed to Step 2: Work History & Tickets <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: WORK HISTORY */}
      {activeStep === 2 && (
        <div className="space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-700" /> Work History ({positions.length}/6 Roles)
            </h3>
            <button type="button" onClick={addPosition} className="px-3 py-1.5 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>

          {positions.map((pos, index) => (
            <div key={pos.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-purple-900">Position #{index + 1}</span>
                {positions.length > 1 && (
                  <button type="button" onClick={() => removePosition(pos.id)} className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="text" placeholder="Job Title (e.g. Storeperson)" value={pos.jobTitle} onChange={(e) => updatePosition(pos.id, 'jobTitle', e.target.value)} className="p-2.5 border border-slate-300 rounded-xl font-medium bg-white" />
                <input type="text" placeholder="Company (e.g. Apex Logistics)" value={pos.company} onChange={(e) => updatePosition(pos.id, 'company', e.target.value)} className="p-2.5 border border-slate-300 rounded-xl font-medium bg-white" />
                <input type="text" placeholder="Dates (e.g. 2022 – 2024)" value={pos.dates} onChange={(e) => updatePosition(pos.id, 'dates', e.target.value)} className="p-2.5 border border-slate-300 rounded-xl font-medium bg-white" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Key Responsibilities & Duties:</label>
                  <button type="button" onClick={() => enhancePositionWithAI(pos.id)} disabled={isEnhancingDuty === pos.id} className="text-purple-800 font-black text-[11px] flex items-center gap-1 hover:underline cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {isEnhancingDuty === pos.id ? 'Expanding...' : 'Expand Duties with AI'}
                  </button>
                </div>
                <textarea rows={3} value={pos.description} onChange={(e) => updatePosition(pos.id, 'description', e.target.value)} placeholder="Type what you did in this role..." className="w-full p-3 border border-slate-300 rounded-xl font-medium text-xs bg-white leading-relaxed" />
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setActiveStep(1)} className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs cursor-pointer">Back to Step 1</button>
            <button type="button" onClick={() => setActiveStep(3)} className="px-6 py-2.5 bg-[#24083b] text-white font-black rounded-xl text-xs cursor-pointer">Proceed to Step 3: Gap Helper</button>
          </div>
        </div>
      )}

      {/* STEP 3: DEDICATED EMPLOYMENT GAP HELPER (REPEATABLE) */}
      {activeStep === 3 && (
        <div className="space-y-6 text-xs">
          <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-purple-950 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-700" /> Employment Gap Helper
              </h3>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">Reusable for Multiple Gaps</span>
            </div>
            
            <p className="text-slate-700 font-medium text-xs leading-relaxed">
              Generate positive, professional explanations for any period away from formal employment. Once generated, click <strong>"Add to Work History Timeline"</strong> to insert it as a role entry (you can repeat this as many times as needed).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-purple-900 mb-1">Approximate Gap Dates *</label>
                <input type="text" value={gapDates} onChange={(e) => setGapDates(e.target.value)} placeholder="e.g. March 2023 – January 2025" className="w-full p-2.5 border rounded-xl bg-white font-medium" />
              </div>

              <div>
                <label className="block font-bold text-purple-900 mb-1">Primary Situation *</label>
                <select value={gapReason} onChange={(e) => setGapReason(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white font-black text-purple-950">
                  <option value="Parenting / Family Care">Parenting / Full-time Family Care</option>
                  <option value="Upskilling / Study">Vocational Upskilling / Accredited Training</option>
                  <option value="Medical Recovery / Wellbeing">Medical Recovery & Rehabilitation</option>
                  <option value="Travel / Relocation">Relocation / Community Support</option>
                  <option value="Other Personal Circumstances">Other Personal / Life Circumstances</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-purple-900 mb-1">Additional Details / Context (So statement is unique to you):</label>
              <input type="text" value={gapContextNote} onChange={(e) => setGapContextNote(e.target.value)} placeholder="e.g. Completed forklift licence, managed household budgets, volunteered at community center..." className="w-full p-2.5 border rounded-xl bg-white font-medium text-slate-800" />
            </div>

            <button type="button" onClick={handleGenerateGapEntry} disabled={isGeneratingGap} className="px-5 py-2.5 bg-[#24083b] text-white font-black rounded-xl flex items-center gap-2 shadow-sm text-xs cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {isGeneratingGap ? 'Generating Statement...' : 'Generate Gap Statement'}
            </button>

            {/* AI Generated Output Display Box */}
            {gapDescription && (
              <div className="p-4 bg-white border-2 border-emerald-300 rounded-xl space-y-3 mt-3 shadow-xs">
                <span className="text-emerald-900 font-black text-xs block">Generated Statement Preview:</span>
                <p className="font-semibold text-slate-800 text-xs italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  "{gapDescription}"
                </p>
                <button type="button" onClick={insertGapIntoPositions} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl flex items-center gap-1.5 text-xs cursor-pointer shadow-sm">
                  <Plus className="w-4 h-4" /> Add Statement to Work History Timeline
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setActiveStep(2)} className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs cursor-pointer">Back to Step 2</button>
            <button type="button" onClick={() => setActiveStep(4)} className="px-6 py-2.5 bg-[#24083b] text-white font-black rounded-xl text-xs cursor-pointer">Proceed to Step 4: Tickets & Referees</button>
          </div>
        </div>
      )}

    {/* STEP 4: LICENCES, TICKETS & REFEREES */}
      {activeStep === 4 && (
        <div className="space-y-6 text-xs">
          {/* Vocational Tickets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-700" /> Licences, Vocational Tickets & Qualifications
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Add tickets employers look for (e.g. Forklift, White Card, First Aid, Driver's Licence).</p>
              </div>
              <button type="button" onClick={addTicket} className="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 cursor-pointer shrink-0">
                <Plus className="w-3.5 h-3.5" /> Add Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                  <input type="text" placeholder="Ticket / Licence (e.g. White Card)" value={t.name} onChange={(e) => setTickets(tickets.map((item) => item.id === t.id ? { ...item, name: e.target.value } : item))} className="p-2 border border-slate-300 rounded-lg flex-1 text-xs font-medium bg-white" />
                  <input type="text" placeholder="Issuer / Year" value={t.issuer} onChange={(e) => setTickets(tickets.map((item) => item.id === t.id ? { ...item, issuer: e.target.value } : item))} className="w-28 p-2 border border-slate-300 rounded-lg text-xs font-medium bg-white" />
                  <button type="button" onClick={() => removeTicket(t.id)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Referees */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
              <label className="flex items-center gap-2 font-black text-purple-950 cursor-pointer">
                <input type="checkbox" checked={refereesOnRequest} onChange={(e) => setRefereesOnRequest(e.target.checked)} className="w-4 h-4 rounded text-purple-700" />
                Display "Referees available upon request" on exported resume document
              </label>
              <Shield className="w-4 h-4 text-purple-700" />
            </div>

            {!refereesOnRequest && (
              <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-sm">2 Suitable References (Stored for Case Manager Verification)</h3>
                {referees.map((ref, idx) => (
                  <div key={ref.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <span className="font-black text-purple-900 block">Referee #{idx + 1}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                      <input type="text" placeholder="Referee Name" value={ref.name} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, name: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium bg-white" />
                      <input type="text" placeholder="Title / Role" value={ref.title} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, title: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium bg-white" />
                      <input type="text" placeholder="Company" value={ref.company} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, company: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium bg-white" />
                      <input type="text" placeholder="Phone Number" value={ref.phone} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, phone: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium bg-white" />
                      <input type="text" placeholder="Relationship" value={ref.relationship} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, relationship: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setActiveStep(3)} className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs cursor-pointer">Back to Step 3</button>
            <button type="button" onClick={() => setActiveStep(5)} className="px-6 py-2.5 bg-[#24083b] text-white font-black rounded-xl text-xs cursor-pointer">Proceed to Step 5: Cover Letter & Downloads</button>
          </div>
        </div>
      )}

      {/* STEP 5: COVER LETTER STUDIO & CASE MANAGER SUBMISSION */}
      {activeStep === 5 && (
        <div className="space-y-6 text-xs">
          
          {/* Custom Cover Letter Builder */}
          <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-200 pb-3">
              <div>
                <h3 className="font-black text-purple-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" /> Interactive Cover Letter Studio
                </h3>
                <p className="text-[11px] text-purple-800 font-medium">Personalize your application details to generate a custom, employer-ready cover letter.</p>
              </div>
              <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full shrink-0">
                Tailored Generator
              </span>
            </div>

            {/* Industry Focus Selector */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 text-xs">Industry Focus & Tone:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'trades', label: 'Trades & Operations', focus: 'WHS Safety & Reliability' },
                  { id: 'retail', label: 'Retail & Hospitality', focus: 'Customer Focus & Speed' },
                  { id: 'admin', label: 'Admin & Office', focus: 'Communication & Accuracy' },
                  { id: 'care', label: 'Care & Community', focus: 'Empathy & Compliance' }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setCoverTone(tone.id as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      coverTone === tone.id
                        ? 'bg-[#24083b] text-white border-[#24083b] font-black shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 font-bold'
                    }`}
                  >
                    <span className="block text-xs">{tone.label}</span>
                    <span className={`text-[10px] block font-medium ${coverTone === tone.id ? 'text-amber-300' : 'text-slate-500'}`}>
                      {tone.focus}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Application Target Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Employer / Company *</label>
                <input type="text" value={targetEmployer} onChange={(e) => setTargetEmployer(e.target.value)} placeholder="e.g. Coles Logistics Center" className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600 outline-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Hiring Manager Name (Optional)</label>
                <input type="text" value={hiringManagerName} onChange={(e) => setHiringManagerName(e.target.value)} placeholder="e.g. Sarah Jenkins / Hiring Manager" className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600 outline-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Application Source / How Found</label>
                <input type="text" value={jobSource} onChange={(e) => setJobSource(e.target.value)} placeholder="e.g. SEEK, Company Website, Walk-in" className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600 outline-none" />
              </div>
            </div>

            {/* Personal Tailoring Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Why Work For This Employer?</label>
                <input type="text" value={whyEmployer} onChange={(e) => setWhyEmployer(e.target.value)} placeholder="e.g. Known for great team culture and high safety standards..." className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600 outline-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Standout Achievements / Tickets</label>
                <input type="text" value={keyAchievements} onChange={(e) => setKeyAchievements(e.target.value)} placeholder="e.g. White Card, Forklift Licence, 100% attendance..." className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600 outline-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Your Personal Motivation Pitch *</label>
                <input type="text" value={coverMotivation} onChange={(e) => setCoverMotivation(e.target.value)} placeholder="e.g. Reliable, safety-focused, and eager to contribute..." className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600 outline-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Availability & Work Rights</label>
                <input type="text" value={availabilityTransport} onChange={(e) => setAvailabilityTransport(e.target.value)} placeholder="e.g. Immediate start, personal transport, full work rights..." className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600 outline-none" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Combine your personal inputs with your work history in 1 click:
              </div>
              <button 
                type="button" 
                onClick={generateAICoverLetter} 
                disabled={isGeneratingCover} 
                className="px-6 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-black rounded-xl flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-all text-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> {isGeneratingCover ? 'Synthesizing Cover Letter...' : 'Synthesize Custom Cover Letter'}
              </button>
            </div>

            {/* Editable Output Textarea */}
            {coverLetterText && (
              <div className="space-y-2 pt-2 border-t border-purple-200">
                <div className="flex items-center justify-between">
                  <label className="font-black text-purple-950 text-xs">Generated Cover Letter Draft (Editable):</label>
                  <span className="text-[10px] text-slate-500 italic">💡 You can edit or add personal sentences directly below before downloading.</span>
                </div>
                <textarea 
                  rows={8} 
                  value={coverLetterText} 
                  onChange={(e) => setCoverLetterText(e.target.value)} 
                  className="w-full p-4 border-2 border-purple-300 rounded-xl bg-white text-xs font-medium text-slate-800 leading-relaxed outline-none focus:border-purple-600 shadow-inner" 
                />
              </div>
            )}
          </div>

          {/* LIVE PREVIEW TOGGLE & EXPORT ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 text-xs">Active Document View:</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewDocType('resume')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    previewDocType === 'resume' ? 'bg-[#24083b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📄 Resume Draft
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDocType('cover')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    previewDocType === 'cover' ? 'bg-[#24083b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✉️ Cover Letter Draft
                </button>
              </div>
            </div>

            {/* DOWNLOAD EXPORT BUTTONS */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => exportDocument(previewDocType, 'pdf')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer text-xs transition-all"
              >
                📥 Download Printable PDF
              </button>
              <button
                type="button"
                onClick={() => exportDocument(previewDocType, 'doc')}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer text-xs transition-all"
              >
                📝 Export Word (.doc)
              </button>
            </div>
          </div>

          {/* A4 PAPER DISPLAY WRAPPER WITH DYNAMIC TEMPLATE STYLING */}
          {/* A4 PAPER DISPLAY WRAPPER WITH DYNAMIC TEMPLATE STYLING */}
<div className="bg-slate-300 p-6 rounded-2xl flex justify-center overflow-y-auto max-h-187.5 border border-slate-300">
  <div 
    className="bg-white w-full max-w-198.5 min-h-280.75 p-12 shadow-2xl rounded-sm border transition-all space-y-6"
    style={{
      fontFamily: TEMPLATE_THEMES[selectedTemplate].fontFamily,
      color: TEMPLATE_THEMES[selectedTemplate].textColor,
      borderTop: `6px solid ${TEMPLATE_THEMES[selectedTemplate].primaryColor}`
    }}
  >

              {/* Header */}
              <div className="border-b-2 border-purple-950 pb-4 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-black text-purple-950 uppercase tracking-tight">{fullName || 'Alex Mercer'}</h1>
                  <p className="text-sm font-bold text-purple-800">{targetRole}</p>
                </div>
                <div className="text-right text-xs text-slate-600 font-medium">
                  <p>{phone}</p>
                  <p>{email}</p>
                  <p>{location}</p>
                </div>
              </div>

              {previewDocType === 'resume' ? (
                <div className="space-y-4 text-xs leading-relaxed">
                  <div>
                    <h3 className="font-extrabold text-purple-950 text-xs uppercase border-b border-slate-200 pb-1 mb-2">
                      Professional Profile Summary
                    </h3>
                    <p className="text-slate-700">{rawSummary}</p>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-purple-950 text-xs uppercase border-b border-slate-200 pb-1 mb-2">
                      Work History & Experience
                    </h3>
                    {positions.map(p => (
                      <div key={p.id} className="mb-3">
                        <p className="font-bold text-slate-900">{p.jobTitle} — {p.company} ({p.dates})</p>
                        <p className="text-slate-700 whitespace-pre-line">{p.description}</p>
                      </div>
                    ))}
                  </div>

                  {tickets.length > 0 && (
                    <div>
                      <h3 className="font-extrabold text-purple-950 text-xs uppercase border-b border-slate-200 pb-1 mb-2">
                        Licences, Tickets & Qualifications
                      </h3>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        {tickets.map(t => (
                          <li key={t.id}><strong>{t.name}</strong> ({t.issuer} {t.year})</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* REFEREES SECTION */}
                  <div>
                    <h3 className="font-extrabold text-purple-950 text-xs uppercase border-b border-slate-200 pb-1 mb-2">
                      Referees
                    </h3>
                    {refereesOnRequest ? (
                      <p className="text-slate-600 italic">Referees available upon request.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                        {referees.map(r => (
                          <div key={r.id} className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                            <p className="font-bold text-slate-900">{r.name}</p>
                            <p className="text-[11px] text-slate-600">{r.title} — {r.company}</p>
                            <p className="text-[11px] text-purple-900 font-medium">Ph: {r.phone} ({r.relationship})</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs leading-relaxed">
                  <p className="text-slate-600 font-medium">Date: {new Date().toLocaleDateString('en-AU')}</p>
                  <p className="font-bold text-slate-900">Dear {hiringManagerName || 'Hiring Manager'},</p>
                  <p className="whitespace-pre-line text-slate-800">
                    {coverLetterText || `I am writing to express my strong interest in the ${targetRole} role at ${targetEmployer}.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT TO CM / MARK AS REVIEWED ACTION BOX */}
          <div className="p-5 bg-purple-950 text-white rounded-2xl border border-purple-800 shadow-md space-y-4 mt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-purple-800/80 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-md border border-amber-400/30">
                  📌 Case Manager Verification Workflow
                </span>
                <h4 className="font-extrabold text-white text-base mt-1">Submit Document Evidence to Case Manager</h4>
                <p className="text-xs text-purple-200">
                  Confirm whether you reviewed your existing files or submitted updated documents to claim your monthly cycle sign-off.
                </p>
              </div>

              {hasClaimedThisMonth && (
                <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-300 block">✓ Monthly Cycle Logged</span>
                  <span className="text-[10px] text-purple-200">Awaiting CM Point Allocation</span>
                </div>
              )}
            </div>

            {!hasClaimedThisMonth ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSubmitToCaseManager('reviewed', 'both')}
                  className="p-3 bg-white hover:bg-purple-50 text-purple-950 font-extrabold text-xs rounded-xl transition-all shadow-sm text-left border border-purple-200 cursor-pointer"
                >
                  <span className="block font-black text-xs text-purple-950">✓ Reviewed (No Changes)</span>
                  <span className="block text-[10px] text-slate-600 font-medium mt-0.5">Confirm active CV is up to date</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmitToCaseManager('updated', 'resume')}
                  className="p-3 bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm text-left border border-purple-700 cursor-pointer"
                >
                  <span className="block font-black text-xs text-amber-300">📄 Updated Resume Only</span>
                  <span className="block text-[10px] text-purple-200 font-medium mt-0.5">Log updated resume document</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmitToCaseManager('updated', 'cover')}
                  className="p-3 bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm text-left border border-purple-700 cursor-pointer"
                >
                  <span className="block font-black text-xs text-amber-300">✉️ Updated Cover Letter</span>
                  <span className="block text-[10px] text-purple-200 font-medium mt-0.5">Log new tailored cover letter</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmitToCaseManager('updated', 'both')}
                  className="p-3 bg-emerald-500 hover:bg-emerald-400 text-purple-950 font-extrabold text-xs rounded-xl transition-all shadow-sm text-left border border-emerald-400 cursor-pointer"
                >
                  <span className="block font-black text-xs text-purple-950">🚀 Updated Both Package</span>
                  <span className="block text-[10px] text-purple-950/80 font-medium mt-0.5">Log full CV & Cover Letter set</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-purple-200 flex items-center justify-between pt-1">
                <span>Your evidence submission for this cycle is currently pending Case Manager point allocation.</span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('resume_claimed_this_month');
                    localStorage.removeItem('workready_pbas_claimed');
                    localStorage.removeItem('resume_submission_status');
                    setHasClaimedThisMonth(false);
                    if (typeof setSubmissionStatus === 'function') setSubmissionStatus('draft');
                  }}
                  className="text-[10px] text-amber-300 underline font-bold cursor-pointer hover:text-amber-200"
                >
                  Reset Cycle Submission (Demo Mode)
                </button>
              </div>
            )}
          </div>

          {/* BACK TO STEP 4 BUTTON */}
          <div className="flex justify-start pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer transition-all"
            >
              Back to Step 4
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default ResumeBuilder;