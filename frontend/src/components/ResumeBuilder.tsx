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
  Eye,
  CheckCircle2,
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

interface LocalReferee {
  id: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  relationship: string;
}

const MONTHLY_LIMIT = 1;

const ResumeBuilder: React.FC<{ maxAttempts?: number }> = () => {
  const { candidates } = usePortal();
  const activeCandidate = candidates[0];

  const programType = activeCandidate?.programType || 'workforce_australia';
  const isRtoGraduate = programType === 'rto_graduate';

  // Profanity Censorship Filter for Resume Builder
  const containsProfanity = (text: string): boolean => {
    const badWordsRegex = /\b(fuck|shit|cunt|bitch|asshole|bastard|dick|piss|bloody hell|slut|dickhead|cock)\b/i;
    return badWordsRegex.test(text);
  };

  // Step Navigation (1: Work History, 2: Gap Helper, 3: Referees, 4: Preview & Download)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Resume Template & Page Budget Selection
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('modern');
  const [pageBudget, setPageBudget] = useState<'1-page' | '2-page'>('1-page');

  // File Upload & Critique State
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [rawPastedText, setRawPastedText] = useState<string>('');
  const [aiCritiqueNotes, setAiCritiqueNotes] = useState<string[]>([]);
  const [isParsingDocument, setIsParsingDocument] = useState<boolean>(false);
  const [isEnhancingDuty, setIsEnhancingDuty] = useState<string | null>(null);

  // Job Ad Text for Cover Letter Targeting
  const [jobAdText, setJobAdText] = useState<string>('');

  // Candidate Core Details
  const [fullName, setFullName] = useState(activeCandidate?.name || 'Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@workready.org.au');
  const [phone, setPhone] = useState('0412 345 678');
  const [location, setLocation] = useState('Brisbane, QLD');
  const [targetRole, setTargetRole] = useState('Warehouse & Logistics Operations Assistant');

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
  // Gap Helper State
  const [gapDates, setGapDates] = useState('');
  const [gapReason, setGapReason] = useState('Parenting / Family Care');
  const [gapContextNote, setGapContextNote] = useState('');
  const [gapDescription, setGapDescription] = useState('');
  const [isGeneratingGap, setIsGeneratingGap] = useState(false);

  // Referees State
  const [refereesOnRequest, setRefereesOnRequest] = useState(false);
  const [referees, setReferees] = useState<LocalReferee[]>([
    {
      id: 'ref-1',
      name: 'Sarah Jenkins',
      title: 'Warehouse Supervisor',
      company: 'Apex Logistics',
      phone: '0499 111 222',
      relationship: 'Direct Supervisor'
    }
  ]);

  // Cover Letter Builder State
  const [targetEmployer, setTargetEmployer] = useState('Coles Logistics Center');
  const [coverMotivation, setCoverMotivation] = useState('I have 2 years of reliable warehouse experience, a strong safety mindset, and a proven track record of showing up on time every shift.');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  // Monthly Cap State
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

// Context Bridge: Auto-sync active candidate draft to localStorage for Sarah (AI Interviewer)
useEffect(() => {
  try {
    const draftPayload = {
      fullName,
      email,
      phone,
      targetRole,
      experience: positions.map((p) => `${p.jobTitle} at ${p.company} (${p.dates}): ${p.description}`).join(' | '),
      summary: `Targeting ${targetRole}. Located in ${location}.`,
      skills: positions.map((p) => p.jobTitle).filter(Boolean).join(', '),
      updatedAt: new Date().toISOString()
    };

    // Prevent saving bad words to local storage or sending to Sarah
    if (containsProfanity(JSON.stringify(draftPayload))) {
      return;
    }

    localStorage.setItem('workready_resume_draft', JSON.stringify(draftPayload));
  } catch (err) {
    console.error('Error syncing workready_resume_draft:', err);
  }
}, [fullName, email, phone, targetRole, location, positions]);

  // Work Position Handlers
  const addPosition = () => {
    if (positions.length >= 6) return alert('You can add up to 6 past work positions.');
    setPositions([
      ...positions,
      { id: `pos-${Date.now()}`, jobTitle: '', company: '', dates: '', description: '' }
    ]);
  };

  const removePosition = (id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  const updatePosition = (id: string, field: keyof LocalWorkPosition, val: string) => {
    setPositions(positions.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  // Real Azure OpenAI Duty Enhancer with Realistic Human Tone Guardrails
  const enhancePositionWithAI = async (id: string) => {
  const pos = positions.find((p) => p.id === id);
  if (!pos || !pos.jobTitle) return alert('Please enter a Position Title first.');

  // Check for profanity before calling Azure OpenAI API
  if (containsProfanity(pos.description || '') || containsProfanity(pos.jobTitle)) {
    return alert('Please maintain professional language in your position title and notes.');
  }

    setIsEnhancingDuty(id);

    try {
      const prompt = `You are a professional Australian resume writer creating clear, realistic, human-sounding resume bullet points for an entry/mid-level job candidate.
Target Role: ${targetRole}
Position Title: ${pos.jobTitle}
Company: ${pos.company || 'Workplace'}
User's Rough Notes: "${pos.description}"

CRITICAL INSTRUCTIONS:
- Write 3 to 4 concise, impact-driven bullet points describing daily responsibilities and achievements.
- DO NOT use over-the-top corporate jargon or exaggerated buzzwords (avoid "visionary leader", "spearheaded synergy", etc.).
- Keep the tone realistic, honest, and grounded in standard Australian workplace standards (e.g., WHS safety compliance, team reliability, customer service, accuracy).
- If the notes are vague (e.g. "cashier at Bunnings" or "storeperson"), intelligently infer and add standard realistic duties for that exact industry role.
- Output ONLY the bullet points, formatted with clear lines.`;

      const response = await sendChatMessage([{ role: 'system', content: prompt }]);
      updatePosition(id, 'description', response.trim());
    } catch (err) {
      console.error('Failed to enhance position description:', err);
      const fallback = `• Operated as a key ${pos.jobTitle} at ${pos.company || 'workplace'}, managing daily operational routines and customer needs.\n• Followed standard operating procedures and strictly adhered to WHS safety guidelines.\n• Collaborated closely with team members and supervisors to maintain high daily output and workplace standards.`;
      updatePosition(id, 'description', fallback);
    } finally {
      setIsEnhancingDuty(null);
    }
  };

  // Document Upload & AI Critique Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsParsingDocument(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const textContent = (event.target?.result as string) || '';
        setRawPastedText(textContent);

        if (textContent.trim()) {
          const prompt = `Analyze this raw candidate resume text and extract core details into JSON format:
{
  "fullName": "Name if found",
  "email": "Email if found",
  "phone": "Phone if found",
  "targetRole": "Suggested target role",
  "critiqueTips": ["Tip 1 regarding gaps or WHS tickets", "Tip 2 for formatting"],
  "extractedPositions": [
    {"jobTitle": "Role Title", "company": "Company", "dates": "Dates", "description": "Bullet points"}
  ]
}

Resume Text:
${textContent.slice(0, 3000)}`;

          try {
            const aiRes = await sendChatMessage([{ role: 'system', content: prompt }]);
            const parsed = JSON.parse(aiRes.substring(aiRes.indexOf('{'), aiRes.lastIndexOf('}') + 1));
            
            if (parsed.fullName) setFullName(parsed.fullName);
            if (parsed.email) setEmail(parsed.email);
            if (parsed.phone) setPhone(parsed.phone);
            if (parsed.targetRole) setTargetRole(parsed.targetRole);
            if (parsed.critiqueTips) setAiCritiqueNotes(parsed.critiqueTips);
            if (parsed.extractedPositions && parsed.extractedPositions.length > 0) {
              setPositions(parsed.extractedPositions.map((p: any, idx: number) => ({ ...p, id: `uploaded-${idx}` })));
            }
          } catch (jsonErr) {
            setAiCritiqueNotes([
              "Resume text imported! Please review extracted work history entries.",
              "Ensure all tickets/licenses (e.g. Forklift, White Card) are highlighted.",
              "Review work timeline dates for any unaddressed employment gaps."
            ]);
          }
        }
        setIsParsingDocument(false);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error("Upload error:", err);
      setIsParsingDocument(false);
    }
  };

  // Gap Statement Generator
  const handleGenerateGapEntry = () => {
    if (!gapDates.trim()) return alert('Please enter the dates for your employment gap (e.g. March 2023 – Jan 2025).');

    setIsGeneratingGap(true);
    setTimeout(() => {
      let statement = '';
      const userNote = gapContextNote.trim() ? ` Focus area: ${gapContextNote.trim()}.` : '';

      if (gapReason.includes('Parenting')) {
        statement = `Family Care & Personal Management (${gapDates}): Dedicated structured time to full-time family care and household coordination.${userNote} Developed strong scheduling efficiency, budget management, and multitasking skills under pressure.`;
      } else if (gapReason.includes('Study')) {
        statement = `Skill Development & Upskilling (${gapDates}): Focused on career growth and vocational training.${userNote} Completed coursework to expand practical knowledge and technical workplace readiness.`;
      } else {
        statement = `Career Transition & Community Support (${gapDates}): Managed personal transition activities and local community involvement.${userNote} Maintained strong personal routine, reliability, and readiness for full-time re-entry.`;
      }

      setGapDescription(statement);
      setIsGeneratingGap(false);
    }, 500);
  };

  const insertGapIntoPositions = () => {
    if (!gapDescription) return;
    if (positions.length >= 6) return alert('Maximum 6 entries allowed. Please remove a position first.');

    setPositions([
      ...positions,
      {
        id: `gap-${Date.now()}`,
        jobTitle: 'Career Transition & Care Management',
        company: 'Personal & Professional Growth',
        dates: gapDates || 'Recent Timeline',
        description: gapDescription
      }
    ]);
    alert('Statement added directly to your Work History timeline!');
  };

  // Cover Letter Generator
  const generateAICoverLetter = () => {
    setIsGeneratingCover(true);
    setTimeout(() => {
      const letter = `Dear Hiring Manager at ${targetEmployer},\n\nI am writing to apply for the ${targetRole} role. Having worked across operational roles, I understand the importance of being punctual, following WHS safety guidelines, and doing every job properly.\n\n${coverMotivation}\n\nWhat sets me apart is my straightforward work ethic and ability to fit straight into a team. I take pride in taking feedback on board, keeping my work area organized, and making sure tasks are completed efficiently without cutting corners.\n\nThank you for taking the time to review my application. I would welcome the chance to meet in person to discuss how I can assist your team at ${targetEmployer}.\n\nKind regards,\n${fullName}\nPhone: ${phone} | Email: ${email}`;
      setCoverLetterText(letter);
      setIsGeneratingCover(false);
    }, 600);
  };

  // Referee Handlers
  const addReferee = () => {
    if (referees.length >= 3) return alert('Maximum 3 referees allowed.');
    setReferees([...referees, { id: `ref-${Date.now()}`, name: '', title: '', company: '', phone: '', relationship: '' }]);
  };

  // INDEPENDENT EXPORTS WITH HIGH-IMPACT DESIGN ENGINE
  const exportDocument = (type: 'resume' | 'cover', format: 'pdf' | 'doc') => {
    const isDoc = format === 'doc';

    if (type === 'resume') {
      if (isDoc) {
        let docCss = 'body { font-family: Arial, sans-serif; line-height: 1.6; padding: 30px; color: #0f172a; } h1 { color: #0f766e; font-size: 22pt; margin-bottom: 2px; } .sub-head { color: #475569; font-size: 11pt; margin-bottom: 20px; } h2 { color: #0f766e; font-size: 13pt; border-bottom: 2px solid #0f766e; padding-bottom: 4px; margin-top: 20pt; } .job { margin-bottom: 14px; padding-left: 8px; border-left: 3px solid #0f766e; }';
        if (selectedTemplate === 'classic') {
          docCss = 'body { font-family: "Times New Roman", serif; line-height: 1.5; padding: 30px; color: #1e293b; } h1 { color: #1e3a8a; font-size: 24pt; text-align: center; margin-bottom: 2px; } .sub-head { font-style: italic; font-size: 11pt; text-align: center; margin-bottom: 20px; border-bottom: 1px solid #1e3a8a; padding-bottom: 8px; } h2 { color: #1e3a8a; font-size: 13pt; border-bottom: 1px solid #1e3a8a; text-align: center; margin-top: 20pt; padding-bottom: 3px; } .job { margin-bottom: 14px; }';
        } else if (selectedTemplate === 'trades') {
          docCss = 'body { font-family: "Segoe UI", sans-serif; line-height: 1.5; padding: 30px; color: #0f172a; } h1 { color: #24083b; font-size: 26pt; font-weight: bold; } .sub-head { background: #f1f5f9; padding: 8px; font-weight: bold; font-size: 11pt; margin-bottom: 20px; } h2 { color: #ffffff; background: #24083b; font-size: 12pt; padding: 6px 10px; margin-top: 20pt; text-transform: uppercase; } .job { margin-bottom: 14px; }';
        }

        const posHtml = positions.map(p => '<div class="job"><strong>' + (p.jobTitle || 'Position') + '</strong> — ' + (p.company || 'Company') + ' (' + (p.dates || 'Dates') + ')<br/>' + (p.description || '') + '</div>').join('');
        const refHtml = refereesOnRequest ? '<p>Professional references available upon request.</p>' : referees.map(r => '<p><strong>' + r.name + '</strong> — ' + r.title + ', ' + r.company + '<br/>Ph: ' + r.phone + ' (' + r.relationship + ')</p>').join('');

        const content = '<html><head><title>Resume - ' + fullName + '</title><style>' + docCss + '</style></head><body><h1>' + fullName + '</h1><div class="sub-head">' + phone + ' | ' + email + ' | ' + location + '</div><h2>TARGET POSITION</h2><p><strong>' + targetRole + '</strong></p><h2>WORK HISTORY & EXPERIENCE</h2>' + posHtml + '<h2>REFEREES</h2>' + refHtml + '</body></html>';

        const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resume_${fullName.replace(/\s+/g, '_')}.doc`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const win = window.open('', '_blank');
        if (!win) return alert('Please allow pop-ups.');

        let printCss = '';
        if (selectedTemplate === 'modern') {
          printCss = '@page{size:A4;margin:12mm 15mm;} body{font-family:"Segoe UI",Arial,sans-serif;color:#0f172a;padding:25px;font-size:10.5pt;line-height:1.5;} h1{font-size:22pt;margin:0;color:#0f766e;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;} .contact-banner{display:flex;gap:15px;font-size:9.5pt;color:#475569;margin-top:6px;margin-bottom:18px;border-bottom:2px solid #0f766e;padding-bottom:10px;font-weight:600;} .section-head{font-size:11pt;font-weight:900;text-transform:uppercase;color:#0f766e;border-bottom:1px solid #cbd5e1;margin-top:20px;margin-bottom:10px;padding-bottom:3px;letter-spacing:0.5px;} .job-box{border-left:3.5px solid #0f766e;padding-left:12px;margin-bottom:14px;} .job-title{font-weight:800;font-size:11pt;color:#0f172a;} .job-sub{color:#64748b;font-size:10pt;font-weight:600;}';
        } else if (selectedTemplate === 'classic') {
          printCss = '@page{size:A4;margin:12mm 15mm;} body{font-family:"Times New Roman",Georgia,serif;color:#1e293b;padding:25px;font-size:11pt;line-height:1.45;} h1{font-size:24pt;margin:0;color:#1e3a8a;text-align:center;} .contact-banner{font-size:10pt;color:#475569;margin-top:6px;margin-bottom:20px;text-align:center;border-bottom:1px solid #1e3a8a;padding-bottom:10px;font-style:italic;} .section-head{font-size:11pt;font-weight:bold;text-transform:uppercase;color:#1e3a8a;border-bottom:1px solid #1e3a8a;margin-top:20px;margin-bottom:10px;padding-bottom:3px;text-align:center;letter-spacing:1px;} .job-box{margin-bottom:14px;} .job-title{font-weight:bold;font-size:11pt;color:#1e3a8a;} .job-sub{font-style:italic;color:#475569;}';
        } else {
          // Trades & Operations
          printCss = '@page{size:A4;margin:12mm 15mm;} body{font-family:"Segoe UI",Helvetica,sans-serif;color:#0f172a;padding:25px;font-size:10.5pt;line-height:1.5;} .header-card{background:#24083b;color:#ffffff;padding:16px 20px;border-radius:8px;margin-bottom:18px;} h1{font-size:24pt;margin:0;color:#ffffff;font-weight:900;letter-spacing:-0.5px;} .contact-banner{font-size:10pt;color:#e9d5ff;margin-top:6px;font-weight:700;} .section-head{font-size:11pt;font-weight:900;text-transform:uppercase;color:#24083b;background:#f1f5f9;border-left:5px solid #24083b;padding:5px 10px;margin-top:20px;margin-bottom:10px;letter-spacing:0.5px;} .job-box{margin-bottom:14px;padding-left:6px;} .job-title{font-weight:900;font-size:11pt;color:#24083b;} .job-sub{color:#475569;font-weight:700;}';
        }

        const posPrint = positions.map(p => '<div class="job-box"><div className="job-title">' + (p.jobTitle || 'Position') + ' — <span class="job-sub">' + (p.company || 'Company') + ' (' + (p.dates || 'Dates') + ')</span></div><div style="margin-top:4px;font-size:10.5pt;">' + (p.description || '') + '</div></div>').join('');
        const refPrint = refereesOnRequest ? '<p>Available upon request.</p>' : referees.map(r => '<div style="margin-bottom:8px;"><strong>' + r.name + '</strong> — ' + r.title + ' (' + r.company + ')<br/>Ph: ' + r.phone + ' | Relationship: ' + r.relationship + '</div>').join('');

        const headerBlock = selectedTemplate === 'trades' 
          ? '<div class="header-card"><h1>' + fullName + '</h1><div class="contact-banner">' + phone + ' • ' + email + ' • ' + location + '</div></div>'
          : '<h1>' + fullName + '</h1><div class="contact-banner"><span>' + phone + '</span> • <span>' + email + '</span> • <span>' + location + '</span></div>';

        const html = '<!DOCTYPE html><html><head><title>Resume - ' + fullName + '</title><style>' + printCss + '</style></head><body>' + headerBlock + '<div class="section-head">Target Position & Career Summary</div><p style="margin-top:6px;font-weight:600;">Target Role: <strong style="color:#0f172a;">' + targetRole + '</strong></p><div class="section-head">Work History & Experience</div>' + posPrint + '<div class="section-head">Referees</div>' + refPrint + '<script>window.onload=function(){window.print();};</script></body></html>';

        win.document.write(html);
        win.document.close();
      }
    } else {
      // Cover Letter Export
      if (!coverLetterText.trim()) return alert('Please generate or write your cover letter first.');

      if (isDoc) {
        const content = '<html><head><title>Cover Letter - ' + fullName + '</title><style>body{font-family:Arial,sans-serif;padding:30px;line-height:1.6;color:#0f172a;} h1{color:#0f172a;font-size:20pt;text-transform:uppercase;}</style></head><body><h1>' + fullName + '</h1><p><strong>Phone:</strong> ' + phone + ' | <strong>Email:</strong> ' + email + '</p><hr/><div style="white-space:pre-wrap;font-size:11pt;margin-top:20px;">' + coverLetterText + '</div></body></html>';

        const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cover_Letter_${fullName.replace(/\s+/g, '_')}.doc`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const win = window.open('', '_blank');
        if (!win) return alert('Please allow pop-ups.');

        const html = '<!DOCTYPE html><html><head><title>Cover Letter - ' + fullName + '</title><style>@page{size:A4;margin:15mm;} body{font-family:Arial,sans-serif;color:#0f172a;padding:25px;font-size:11pt;line-height:1.6;} h1{font-size:22pt;margin:0;color:#0f172a;text-transform:uppercase;font-weight:900;} .contact{font-size:10pt;color:#475569;margin-top:5px;margin-bottom:20px;border-bottom:2px solid #0f172a;padding-bottom:8px;font-weight:600;}</style></head><body><h1>' + fullName + '</h1><div class="contact">' + phone + ' | ' + email + ' | ' + location + '</div><div style="white-space:pre-wrap;margin-top:20px;">' + coverLetterText + '</div><script>window.onload=function(){window.print();};</script></body></html>';

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
  status: 'Pending Verification'
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

    // Broadcast event to ParticipantHome Activity Log Listener
    window.dispatchEvent(new CustomEvent('starHistoryUpdated', { detail: record }));

    alert('?? Application package saved to Activity Verification Log and submitted for Case Manager Review!');
  };

  const isCapReached = !isRtoGraduate && monthlyUsed >= MONTHLY_LIMIT;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#24083b] via-[#320b52] to-[#1c0630] text-white rounded-2xl p-6 shadow-lg border border-purple-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">ATS Resume & Cover Letter Studio</h2>
          </div>
          <p className="text-xs text-purple-200 mt-1 font-medium">
            Step-by-step guidance to build clear, employer-ready resumes and personalized cover letters.
          </p>
        </div>

        {!isRtoGraduate && (
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-right shrink-0">
            <span className="block text-xs font-black text-amber-300">
              {monthlyUsed} / {MONTHLY_LIMIT} Monthly Application Claim Used
            </span>
            <span className="text-[10px] text-purple-200 font-bold">Submitted for CM Verification</span>
          </div>
        )}
      </div>

      {/* Template Style Switcher Cards */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-purple-700" /> Select Visual Document Template:
          </span>
          <span className="text-[11px] font-bold text-slate-500">Formats all exports instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: 'modern', name: 'Modern Executive', desc: 'Teal left-accent borders with clean sans-serif typography.' },
            { id: 'classic', name: 'Classic Professional', desc: 'Centered serif headers with double-rule corporate dividers.' },
            { id: 'trades', name: 'Trades & Operations', desc: 'High-contrast dark banner callouts for WHS & site roles.' }
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedTemplate(style.id as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedTemplate === style.id
                  ? 'bg-white border-[#24083b] ring-2 ring-[#24083b]/20 shadow-md'
                  : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-slate-900">{style.name}</span>
                {selectedTemplate === style.id && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-[10.5px] text-slate-500 leading-normal">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-200 pb-3">
        {[
          { num: 1, name: '1. Work History (Up to 6)' },
          { num: 2, name: '2. Employment Gap Helper' },
          { num: 3, name: '3. Referees' },
          { num: 4, name: '4. Cover Letter & Download' }
        ].map((tab) => (
          <button
            key={tab.num}
            type="button"
            onClick={() => setActiveStep(tab.num)}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center ${
              activeStep === tab.num
                ? 'bg-[#24083b] text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* STEP 1: CONTACT DETAILS & WORK HISTORY */}
      {activeStep === 1 && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-black text-slate-800 mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
            </div>
            <div>
              <label className="block font-black text-slate-800 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
            </div>
            <div>
              <label className="block font-black text-slate-800 mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
            </div>
            <div>
              <label className="block font-black text-slate-800 mb-1">Target Role Title</label>
              <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full p-2.5 border rounded-xl font-medium" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-purple-700" /> Work History ({positions.length}/6 Positions)
              </h3>
              <button type="button" onClick={addPosition} className="px-3 py-1.5 bg-[#24083b] text-white font-bold rounded-xl text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Position
              </button>
            </div>

            {positions.map((pos, index) => (
              <div key={pos.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-purple-900">Position #{index + 1}</span>
                  {positions.length > 1 && (
                    <button type="button" onClick={() => removePosition(pos.id)} className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 text-[11px]">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" placeholder="Job Title (e.g. Storeperson)" value={pos.jobTitle} onChange={(e) => updatePosition(pos.id, 'jobTitle', e.target.value)} className="p-2.5 border rounded-xl font-medium" />
                  <input type="text" placeholder="Company (e.g. Apex Logistics)" value={pos.company} onChange={(e) => updatePosition(pos.id, 'company', e.target.value)} className="p-2.5 border rounded-xl font-medium" />
                  <input type="text" placeholder="Dates (e.g. 2022 - 2024)" value={pos.dates} onChange={(e) => updatePosition(pos.id, 'dates', e.target.value)} className="p-2.5 border rounded-xl font-medium" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Key Responsibilities / Duties:</label>
                    <button type="button" onClick={() => enhancePositionWithAI(pos.id)} className="text-purple-800 font-black text-[11px] flex items-center gap-1 hover:underline">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Enhance Description
                    </button>
                  </div>
                  <textarea rows={2} value={pos.description} onChange={(e) => updatePosition(pos.id, 'description', e.target.value)} placeholder="Type a few words about what you did in this role..." className="w-full p-3 border rounded-xl font-medium text-xs" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button type="button" onClick={() => setActiveStep(2)} className="px-6 py-2.5 bg-[#24083b] text-white font-black rounded-xl text-xs flex items-center gap-1.5">
              Proceed to Step 2: Employment Gap Helper <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: GAP HELPER & TIMELINE */}
      {activeStep === 2 && (
        <div className="space-y-5 text-xs">
          <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-2xl space-y-3">
            <h3 className="font-black text-purple-950 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" /> Employment Gap Helper
            </h3>
            <p className="text-slate-700 font-medium leading-relaxed">
              If you have gaps in your formal work history, provide the approximate dates and context below to generate a clear, professional statement for your resume timeline.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-bold text-purple-900 mb-1">Gap Dates:</label>
                <input type="text" value={gapDates} onChange={(e) => setGapDates(e.target.value)} placeholder="e.g. March 2023 – January 2025" className="w-full p-2.5 border rounded-xl bg-white font-medium" />
              </div>

              <div>
                <label className="block font-bold text-purple-900 mb-1">Primary Situation:</label>
                <select value={gapReason} onChange={(e) => setGapReason(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white font-black text-purple-950">
                  <option value="Parenting / Family Care">Parenting / Full-time Family Care</option>
                  <option value="Upskilling / Study">Vocational Upskilling / Accredited Training</option>
                  <option value="Medical Recovery / Wellbeing">Medical Recovery & Rehabilitation</option>
                  <option value="Travel / Relocation">Relocation / Community Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-purple-900 mb-1">Specific Context (Optional):</label>
              <input type="text" value={gapContextNote} onChange={(e) => setGapContextNote(e.target.value)} placeholder="e.g. Cared for elderly relative while taking night classes for Forklift License..." className="w-full p-2.5 border rounded-xl bg-white font-medium text-slate-800" />
            </div>

            <button type="button" onClick={handleGenerateGapEntry} disabled={isGeneratingGap} className="px-5 py-2.5 bg-[#24083b] text-white font-black rounded-xl flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" /> {isGeneratingGap ? 'Generating Statement...' : 'Generate Statement'}
            </button>

            {gapDescription && (
              <div className="p-4 bg-white border border-purple-200 rounded-xl space-y-3 mt-3">
                <p className="font-semibold text-slate-800 italic">"{gapDescription}"</p>
                <button type="button" onClick={insertGapIntoPositions} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add to Work History Timeline
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <button type="button" onClick={() => setActiveStep(1)} className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button type="button" onClick={() => setActiveStep(3)} className="px-6 py-2.5 bg-[#24083b] text-white font-black rounded-xl text-xs flex items-center gap-1.5">
              Proceed to Step 3: Referees <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REFEREES */}
      {activeStep === 3 && (
        <div className="space-y-5 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <label className="flex items-center gap-2 font-black text-slate-800 cursor-pointer">
              <input type="checkbox" checked={refereesOnRequest} onChange={(e) => setRefereesOnRequest(e.target.checked)} className="w-4 h-4 rounded text-purple-700" />
              Display "Referees available upon request" on resume
            </label>
          </div>

          {!refereesOnRequest && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-sm">Professional & Character Referees ({referees.length}/3)</h3>
                <button type="button" onClick={addReferee} className="px-3 py-1.5 bg-[#24083b] text-white font-bold rounded-xl text-xs">
                  + Add Referee
                </button>
              </div>

              {referees.map((ref) => (
                <div key={ref.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <input type="text" placeholder="Referee Name" value={ref.name} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, name: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium" />
                  <input type="text" placeholder="Title / Role" value={ref.title} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, title: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium" />
                  <input type="text" placeholder="Company" value={ref.company} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, company: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium" />
                  <input type="text" placeholder="Phone Number" value={ref.phone} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, phone: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium" />
                  <input type="text" placeholder="Relationship" value={ref.relationship} onChange={(e) => setReferees(referees.map((r) => (r.id === ref.id ? { ...r, relationship: e.target.value } : r)))} className="p-2.5 border rounded-xl font-medium" />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <button type="button" onClick={() => setActiveStep(2)} className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button type="button" onClick={() => setActiveStep(4)} className="px-6 py-2.5 bg-[#24083b] text-white font-black rounded-xl text-xs flex items-center gap-1.5">
              Proceed to Cover Letter & Download <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: COVER LETTER & PREVIEW/EXPORTS */}
      {activeStep === 4 && (
        <div className="space-y-6 text-xs">
          
          {/* Cover Letter Generator Section */}
          <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-2xl space-y-3">
            <h3 className="font-black text-purple-950 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" /> Cover Letter Builder
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Employer Name:</label>
                <input type="text" value={targetEmployer} onChange={(e) => setTargetEmployer(e.target.value)} placeholder="e.g. Coles Logistics Center" className="w-full p-2.5 border rounded-xl bg-white font-medium" />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Key Strengths / Personal Pitch:</label>
                <input type="text" value={coverMotivation} onChange={(e) => setCoverMotivation(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white font-medium" />
              </div>
            </div>

            <button type="button" onClick={generateAICoverLetter} disabled={isGeneratingCover} className="px-5 py-2.5 bg-[#24083b] text-white font-black rounded-xl flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" /> {isGeneratingCover ? 'Writing Draft...' : 'Generate Letter'}
            </button>

            {coverLetterText && (
              <textarea rows={6} value={coverLetterText} onChange={(e) => setCoverLetterText(e.target.value)} className="w-full p-4 border rounded-xl bg-white text-xs font-medium text-slate-800 leading-relaxed" />
            )}
          </div>

          {/* LIVE DOCUMENT PREVIEW CARD */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-sm uppercase tracking-wider text-white">Live Resume Layout Preview</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full uppercase">
                Style: {selectedTemplate}
              </span>
            </div>

            <div className="bg-white text-slate-900 p-6 rounded-xl space-y-4 text-xs font-sans shadow-inner">
              <div className={selectedTemplate === 'trades' ? 'bg-[#24083b] text-white p-4 rounded-lg' : 'border-b pb-3'}>
                <h3 className={`text-xl font-black ${selectedTemplate === 'trades' ? 'text-white' : selectedTemplate === 'classic' ? 'text-[#1e3a8a] text-center' : 'text-[#0f766e]'}`}>
                  {fullName}
                </h3>
                <div className={`flex flex-wrap items-center gap-3 text-[11px] mt-1 ${selectedTemplate === 'trades' ? 'text-purple-200' : selectedTemplate === 'classic' ? 'justify-center text-slate-600' : 'text-slate-500 font-medium'}`}>
                  <span><Phone className="w-3 h-3 inline mr-1" />{phone}</span>
                  <span><Mail className="w-3 h-3 inline mr-1" />{email}</span>
                  <span><MapPin className="w-3 h-3 inline mr-1" />{location}</span>
                </div>
              </div>

              <div>
                <h4 className={`font-black text-[11px] uppercase mb-1.5 ${selectedTemplate === 'trades' ? 'bg-[#24083b] text-white p-1 px-2.5 rounded' : selectedTemplate === 'classic' ? 'text-[#1e3a8a] text-center border-b pb-1' : 'text-[#0f766e] border-b pb-1'}`}>
                  Target Position & Summary
                </h4>
                <p className="font-bold text-slate-800">{targetRole}</p>
              </div>

              <div>
                <h4 className={`font-black text-[11px] uppercase mb-2 ${selectedTemplate === 'trades' ? 'bg-[#24083b] text-white p-1 px-2.5 rounded' : selectedTemplate === 'classic' ? 'text-[#1e3a8a] text-center border-b pb-1' : 'text-[#0f766e] border-b pb-1'}`}>
                  Work History & Timeline ({positions.length} Entries)
                </h4>
                <div className="space-y-2.5">
                  {positions.map((p, idx) => (
                    <div key={p.id} className={selectedTemplate === 'modern' ? 'border-l-2 border-[#0f766e] pl-2.5' : 'bg-slate-50/80 p-2.5 rounded-lg border border-slate-100'}>
                      <div className="font-black text-slate-900">
                        {p.jobTitle || 'Position Title'} <span className="font-medium text-slate-500">— {p.company || 'Company'} ({p.dates || 'Dates'})</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">{p.description || 'Duties description...'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* INDEPENDENT DOWNLOAD ACTIONS */}
          <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-5">
            <div>
              <h3 className="text-base font-black text-[#24083b]">Download Application Documents</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Download your Resume and Cover Letter independently as clean PDF or Word files matching your selected visual theme.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resume Downloads */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                <span className="font-black text-slate-900 block text-xs border-b pb-2">1. Resume Document ({selectedTemplate.toUpperCase()} Style)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportDocument('resume', 'pdf')}
                    className="flex-1 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" /> Download Resume (PDF)
                  </button>
                  <button
                    type="button"
                    onClick={() => exportDocument('resume', 'doc')}
                    className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" /> Download Resume (Word)
                  </button>
                </div>
              </div>

              {/* Cover Letter Downloads */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                <span className="font-black text-slate-900 block text-xs border-b pb-2">2. Cover Letter Document (Matched Style)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportDocument('cover', 'pdf')}
                    className="flex-1 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" /> Download Letter (PDF)
                  </button>
                  <button
                    type="button"
                    onClick={() => exportDocument('cover', 'doc')}
                    className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" /> Download Letter (Word)
                  </button>
                </div>
              </div>
            </div>

            {/* DEWR Activity Log Verification Trigger */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <UserCheck className="w-4 h-4 text-purple-700" /> Saves a verification record into your Activity Log & updates Sarah's background memory.
              </div>

              <button
                type="button"
                onClick={submitToActivityLog}
                disabled={isCapReached}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-all"
              >
                <Award className="w-5 h-5 text-amber-300" /> Submit Application Package for CM Review
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ResumeBuilder;
