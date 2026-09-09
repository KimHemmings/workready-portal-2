"""Idempotent seed data for WorkReady Portal. Run: cd /app/backend && python seed.py"""

import asyncio
import random
from datetime import datetime, timedelta, timezone

from lib.db import db, ensure_indexes
from models.schemas import (
    CaseNote,
    Cohort,
    JobSearchLog,
    Organization,
    ParticipantProgress,
    Quiz,
    TrainingModule,
    User,
)

ORG_ID = "org-hunter-workforce"
COACH_ID = "user-coach-marcus"
ADMIN_ID = "user-admin-eleanor"
PARTICIPANT_ID = "user-participant-sarah"

MODULES = [
    {
        "id": "mod-core-skills",
        "title": "Core Skills for Work: Getting Job Ready",
        "category": "Core Skills",
        "description": "Understand the Australian Core Skills for Work framework and how employers assess you.",
        "estimated_minutes": 20,
        "order": 1,
        "video_url": "https://www.youtube.com/embed/2ZbCTd_pnLc",
        "content_markdown": """## Why core skills matter

Australian employers hire for **attitude and core skills** as much as technical ability. The Core Skills for Work Developmental Framework groups these into three clusters:

1. **Navigate the world of work** — understanding your rights, responsibilities and Mutual Obligation requirements.
2. **Interact with others** — communication, teamwork and workplace etiquette.
3. **Get the work done** — planning, problem solving and using digital tools.

### What good looks like

- Turning up on time, every time, and calling ahead if you can't.
- Asking clarifying questions rather than guessing.
- Taking feedback without getting defensive.

### Your Mutual Obligation

If you are with Workforce Australia, Transition to Work (TtW) or Disability Employment Services (DES), your Points-Based Activation System (PBAS) target is usually **100 points per month**. Logging every job search activity in this portal keeps you compliant.
""",
    },
    {
        "id": "mod-digital-literacy",
        "title": "Digital Literacy in the Workplace",
        "category": "Digital Literacy",
        "description": "Email, online forms, digital rosters and staying safe online at work.",
        "estimated_minutes": 25,
        "order": 2,
        "video_url": "https://www.youtube.com/embed/rk_HGWq3xtY",
        "content_markdown": """## Everyday workplace tech

Most Australian entry-level roles now expect you to use:

- **Email** for rosters, payslips and manager updates.
- **Online rostering apps** such as Deputy or Tanda.
- **Digital forms** for incident reports and timesheets.

### Writing a professional email

> Subject: Availability for weekend shifts — Sarah Chen
>
> Hi Jess,
>
> Thanks for the roster. I'm available all day Saturday and after 2pm Sunday.
>
> Kind regards,
> Sarah

### Staying safe

Never share your MyGov or payroll password. If an email asks you to "verify your bank details urgently", check with your manager first.
""",
    },
    {
        "id": "mod-workplace-etiquette",
        "title": "Australian Workplace Rights, Safety & Etiquette",
        "category": "Workplace Etiquette",
        "description": "Fair Work basics, WHS responsibilities and getting along with your workmates.",
        "estimated_minutes": 20,
        "order": 3,
        "video_url": "https://www.youtube.com/embed/Fm-4Xn8Ux6E",
        "content_markdown": """## Your rights at work

The **Fair Work Ombudsman** sets minimum pay, breaks and conditions. Key facts:

- You must receive a payslip within one working day of being paid.
- Casual employees receive a casual loading (usually 25%) instead of paid leave.
- Unpaid "trials" beyond a short demonstration are generally not lawful.

## Work Health & Safety (WHS)

Everyone shares responsibility. You must:

- Follow reasonable safety instructions.
- Report hazards and near misses straight away.
- Never operate equipment you haven't been trained on.

## Etiquette that gets you kept on

Say good morning, clean up after yourself, put the phone away on the floor, and let your supervisor know before you leave.
""",
    },
    {
        "id": "mod-interview-prep",
        "title": "First Impressions & Behavioural Interviews",
        "category": "Interview Prep",
        "description": "Master the STAR approach and prepare for common Australian interview questions.",
        "estimated_minutes": 30,
        "order": 4,
        "video_url": "https://www.youtube.com/embed/HG68Ymazo18",
        "content_markdown": """## The STAR approach

Behavioural questions start with "Tell me about a time…". Answer with:

- **S**ituation — where and when.
- **T**ask — what needed to happen.
- **A**ction — what *you* did.
- **R**esult — the outcome, ideally measurable.

### Worked example

*"Tell me about a time you dealt with a difficult customer."*

> At my Woolworths work placement (S), a customer was upset a special had ended (T). I apologised, checked the catalogue, and asked my supervisor whether we could honour it (A). We did, and the customer thanked me on the way out (R).

## Before the interview

- Research the employer for 10 minutes.
- Plan your travel and arrive 10 minutes early.
- Bring your resume and two referees.

Use the **AI Interview Simulator** in this portal to practise until it feels natural.
""",
    },
    {
        "id": "mod-written-comms",
        "title": "Written Communication for Job Search",
        "category": "Core Skills",
        "description": "Resumes, cover letters and following up with employers professionally.",
        "estimated_minutes": 20,
        "order": 5,
        "video_url": "https://www.youtube.com/embed/y8YH0Qbu5h4",
        "content_markdown": """## An ATS-friendly resume

Applicant Tracking Systems scan your resume before a human sees it. Keep it simple:

- One clear heading per section: **Summary, Key Skills, Work History, Education, Referees**.
- No tables, columns, images or text boxes.
- Mirror the words used in the job ad.

## Cover letters

Three short paragraphs: why this role, what you bring, and a polite close asking for an interview.

## Following up

A week after applying, a short polite call or email shows initiative — and it earns you PBAS points when you log it.
""",
    },
]

QUIZZES = {
    "mod-core-skills": [
        {
            "question": "How many PBAS points is a typical monthly Mutual Obligation target?",
            "options": ["20 points", "50 points", "100 points", "500 points"],
            "correct_answer": 2,
            "explanation": "Most jobseekers on Workforce Australia have a 100 point monthly target.",
        },
        {
            "question": "Which of these is part of 'Interact with others' in the Core Skills for Work framework?",
            "options": ["Operating a forklift", "Teamwork and communication", "Filing a tax return", "Buying uniforms"],
            "correct_answer": 1,
            "explanation": "Interacting with others covers communication, teamwork and workplace etiquette.",
        },
        {
            "question": "You will be late to your shift. What is the best action?",
            "options": [
                "Say nothing and hope nobody notices",
                "Text a mate to cover it",
                "Call your supervisor as early as possible",
                "Arrive late and explain at the end of the shift",
            ],
            "correct_answer": 2,
            "explanation": "Ringing ahead shows responsibility and lets the team plan.",
        },
        {
            "question": "Why should you log job search activity in the portal?",
            "options": [
                "It is optional trivia",
                "It evidences your Mutual Obligation compliance",
                "It replaces your resume",
                "It pays you extra",
            ],
            "correct_answer": 1,
            "explanation": "Logged activity is the evidence your provider reports for compliance.",
        },
        {
            "question": "Which behaviour best demonstrates 'Get the work done'?",
            "options": [
                "Waiting to be told every step",
                "Planning your tasks and asking clarifying questions",
                "Working through breaks silently",
                "Avoiding digital tools",
            ],
            "correct_answer": 1,
            "explanation": "Planning and clarifying shows initiative and problem solving.",
        },
    ],
    "mod-digital-literacy": [
        {
            "question": "What belongs in an email subject line to a manager?",
            "options": ["Nothing", "A clear topic and your name", "Emojis only", "The whole message"],
            "correct_answer": 1,
            "explanation": "A clear subject helps a busy manager find and action your email.",
        },
        {
            "question": "An email asks you to urgently confirm your bank details. What do you do?",
            "options": [
                "Reply with the details straight away",
                "Forward it to workmates",
                "Check with your manager or payroll first",
                "Click every link to investigate",
            ],
            "correct_answer": 2,
            "explanation": "Urgency plus a request for details is a classic phishing pattern.",
        },
        {
            "question": "Which tool is commonly used for Australian workplace rostering?",
            "options": ["Deputy", "Photoshop", "Notepad", "Steam"],
            "correct_answer": 0,
            "explanation": "Deputy and Tanda are widely used rostering apps.",
        },
        {
            "question": "Best practice for workplace passwords is to:",
            "options": [
                "Share them with your team",
                "Write them on the noticeboard",
                "Keep them private and unique",
                "Use your birthday",
            ],
            "correct_answer": 2,
            "explanation": "Private, unique passwords protect you and your employer.",
        },
        {
            "question": "You are asked to submit a timesheet online but can't find the link. You should:",
            "options": [
                "Skip it this week",
                "Ask your supervisor where to find it",
                "Guess a website",
                "Wait until someone chases you",
            ],
            "correct_answer": 1,
            "explanation": "Asking early is a strength, not a weakness.",
        },
    ],
    "mod-workplace-etiquette": [
        {
            "question": "Who sets minimum pay and conditions in Australia?",
            "options": ["The Fair Work Ombudsman", "Your workmates", "The ATO", "Centrelink"],
            "correct_answer": 0,
            "explanation": "The Fair Work Ombudsman oversees minimum pay and conditions.",
        },
        {
            "question": "Casual employees usually receive:",
            "options": ["Paid annual leave", "A casual loading", "A company car", "Guaranteed hours"],
            "correct_answer": 1,
            "explanation": "Casual loading (commonly 25%) compensates for no paid leave.",
        },
        {
            "question": "You spot a spill in a walkway. What is the correct WHS response?",
            "options": [
                "Step around it",
                "Report it and make the area safe",
                "Take a photo for social media",
                "Wait for the next shift",
            ],
            "correct_answer": 1,
            "explanation": "Everyone is responsible for reporting hazards immediately.",
        },
        {
            "question": "Within how long must you receive a payslip after being paid?",
            "options": ["One working day", "One month", "One year", "Never required"],
            "correct_answer": 0,
            "explanation": "Payslips must be issued within one working day of payment.",
        },
        {
            "question": "Good workplace etiquette on your first day includes:",
            "options": [
                "Keeping your phone out on the floor",
                "Leaving without telling anyone",
                "Greeting your team and asking questions",
                "Only speaking when spoken to",
            ],
            "correct_answer": 2,
            "explanation": "Being friendly and curious builds trust quickly.",
        },
    ],
    "mod-interview-prep": [
        {
            "question": "What does the 'A' in STAR stand for?",
            "options": ["Attitude", "Action", "Answer", "Agreement"],
            "correct_answer": 1,
            "explanation": "Action is what you personally did in the situation.",
        },
        {
            "question": "How early should you aim to arrive for an interview?",
            "options": ["Exactly on time", "10 minutes early", "30 minutes late", "An hour early"],
            "correct_answer": 1,
            "explanation": "About 10 minutes early is professional without crowding the employer.",
        },
        {
            "question": "A behavioural question usually begins with:",
            "options": ["Tell me about a time…", "Do you like…", "What is your star sign…", "Where do you shop…"],
            "correct_answer": 0,
            "explanation": "Behavioural questions ask for a past example.",
        },
        {
            "question": "What should you bring to an interview?",
            "options": [
                "Nothing",
                "Your resume and referee details",
                "A friend",
                "Your entire school portfolio",
            ],
            "correct_answer": 1,
            "explanation": "A printed resume and referees show you are prepared.",
        },
        {
            "question": "The best way to improve interview confidence is to:",
            "options": [
                "Avoid interviews",
                "Practise answers out loud, including with the simulator",
                "Memorise a script word for word",
                "Wing it entirely",
            ],
            "correct_answer": 1,
            "explanation": "Repeated practice makes your examples feel natural.",
        },
    ],
    "mod-written-comms": [
        {
            "question": "Why should an ATS-friendly resume avoid tables and text boxes?",
            "options": [
                "They look old-fashioned",
                "Scanning software may not read them",
                "They use too much ink",
                "They are illegal",
            ],
            "correct_answer": 1,
            "explanation": "Applicant Tracking Systems often can't parse tables or graphics.",
        },
        {
            "question": "A strong cover letter is about:",
            "options": ["Five pages", "Three short paragraphs", "One sentence", "A list of hobbies"],
            "correct_answer": 1,
            "explanation": "Keep it to three focused paragraphs on one page.",
        },
        {
            "question": "Mirroring words from the job ad helps because:",
            "options": [
                "It flatters the employer",
                "It matches the keywords recruiters search for",
                "It fills space",
                "It is required by law",
            ],
            "correct_answer": 1,
            "explanation": "Keyword matching lifts you through automated screening.",
        },
        {
            "question": "Following up a week after applying:",
            "options": [
                "Annoys every employer",
                "Shows initiative and earns PBAS points when logged",
                "Cancels your application",
                "Is only for managers",
            ],
            "correct_answer": 1,
            "explanation": "A polite follow-up demonstrates genuine interest.",
        },
        {
            "question": "Which section should appear on nearly every resume?",
            "options": ["Key Skills", "Favourite Films", "Star Sign", "Pet Names"],
            "correct_answer": 0,
            "explanation": "Key Skills gives recruiters an instant match to the role.",
        },
    ],
}

EXTRA_PARTICIPANTS = [
    ("Jayden Nguyen", "jayden@demo.au", 3, 8),
    ("Amira Haddad", "amira@demo.au", 2, 5),
    ("Tyrone Walker", "tyrone@demo.au", 0, 1),
    ("Chloe Marsden", "chloe@demo.au", 5, 14),
    ("Rangi Patel", "rangi@demo.au", 1, 3),
]

APPLICATION_TYPES = ["Online application", "In person", "Email application", "Phone enquiry", "Interview attended"]
POINTS = {"Online application": 5, "In person": 10, "Email application": 5, "Phone enquiry": 5, "Interview attended": 20}
EMPLOYERS = [
    ("Bunnings Warehouse", "Retail Team Member"),
    ("Coles", "Customer Service Assistant"),
    ("Woolworths", "Nightfill Team Member"),
    ("Australia Post", "Warehouse Assistant"),
    ("Grill'd", "Front of House"),
    ("Officeworks", "Administration Trainee"),
]


async def main() -> None:
    for name in (
        "organizations",
        "users",
        "cohorts",
        "training_modules",
        "quizzes",
        "participant_progress",
        "job_search_logs",
        "resumes",
        "interview_sessions",
        "case_notes",
    ):
        await db[name].delete_many({})

    now = datetime.now(timezone.utc)

    await db.organizations.insert_one(
        Organization(
            id=ORG_ID,
            name="Hunter Valley Employment Services",
            type="Workforce Australia",
            branding_logo="HV",
            primary_color="#1E3A8A",
            created_at=now,
        ).model_dump()
    )

    cohorts = [
        Cohort(id="cohort-morning", name="Morning Job Club", organization_id=ORG_ID, coach_id=COACH_ID),
        Cohort(id="cohort-ttw", name="TtW Youth Cohort", organization_id=ORG_ID, coach_id=COACH_ID),
    ]
    await db.cohorts.insert_many([c.model_dump() for c in cohorts])

    users = [
        User(
            id=ADMIN_ID,
            name="Eleanor Brooks",
            email="eleanor@demo.au",
            role="admin",
            organization_id=ORG_ID,
            phone="02 4900 1000",
        ),
        User(
            id=COACH_ID,
            name="Marcus Vance",
            email="marcus@demo.au",
            role="coach",
            organization_id=ORG_ID,
            phone="02 4900 1001",
        ),
        User(
            id=PARTICIPANT_ID,
            name="Sarah Chen",
            email="sarah@demo.au",
            role="participant",
            organization_id=ORG_ID,
            phone="0400 111 222",
            coach_id=COACH_ID,
            cohort_id="cohort-morning",
            last_login=now - timedelta(days=1),
        ),
    ]
    for u in users:
        doc = u.model_dump()
        doc["is_demo"] = True
        await db.users.insert_one(doc)

    for i, (name, email, done, apps) in enumerate(EXTRA_PARTICIPANTS):
        pid = f"user-participant-{email.split('@')[0]}"
        await db.users.insert_one(
            User(
                id=pid,
                name=name,
                email=email,
                role="participant",
                organization_id=ORG_ID,
                phone=f"04{i}0 333 4{i}4",
                coach_id=COACH_ID,
                cohort_id="cohort-ttw" if i % 2 else "cohort-morning",
                last_login=now - timedelta(days=i + 2),
            ).model_dump()
        )
        for m in MODULES[:done]:
            await db.participant_progress.insert_one(
                ParticipantProgress(
                    participant_id=pid,
                    module_id=m["id"],
                    status="completed",
                    quiz_score=random.choice([80, 80, 100, 90]),
                    completed_at=now - timedelta(days=i + 1),
                ).model_dump()
            )
        for j in range(apps):
            employer, position = EMPLOYERS[j % len(EMPLOYERS)]
            app_type = APPLICATION_TYPES[j % len(APPLICATION_TYPES)]
            await db.job_search_logs.insert_one(
                JobSearchLog(
                    participant_id=pid,
                    employer_name=employer,
                    position_title=position,
                    application_date=(now - timedelta(days=j + 1)).date().isoformat(),
                    application_type=app_type,
                    evidence_filename=f"{employer.lower().replace(' ', '-')}-confirmation.pdf",
                    notes="Applied via employer careers page.",
                    status="verified" if j % 3 else "submitted",
                    points=POINTS[app_type],
                    created_at=now - timedelta(days=j + 1),
                ).model_dump()
            )

    await db.training_modules.insert_many([TrainingModule(**m).model_dump() for m in MODULES])
    for module_id, questions in QUIZZES.items():
        await db.quizzes.insert_one(Quiz(module_id=module_id, questions=questions).model_dump())

    # Sarah: two completed, one in progress, some job logs
    await db.participant_progress.insert_many(
        [
            ParticipantProgress(
                participant_id=PARTICIPANT_ID,
                module_id="mod-core-skills",
                status="completed",
                quiz_score=100,
                completed_at=now - timedelta(days=6),
            ).model_dump(),
            ParticipantProgress(
                participant_id=PARTICIPANT_ID,
                module_id="mod-digital-literacy",
                status="completed",
                quiz_score=80,
                completed_at=now - timedelta(days=3),
            ).model_dump(),
            ParticipantProgress(
                participant_id=PARTICIPANT_ID,
                module_id="mod-workplace-etiquette",
                status="in_progress",
            ).model_dump(),
        ]
    )
    for j, (employer, position) in enumerate(EMPLOYERS[:4]):
        app_type = APPLICATION_TYPES[j % len(APPLICATION_TYPES)]
        await db.job_search_logs.insert_one(
            JobSearchLog(
                participant_id=PARTICIPANT_ID,
                employer_name=employer,
                position_title=position,
                application_date=(now - timedelta(days=j + 1)).date().isoformat(),
                application_type=app_type,
                evidence_filename=f"{employer.lower().replace(' ', '-')}-receipt.pdf",
                notes="Submitted resume and cover letter.",
                status="verified" if j % 2 else "submitted",
                points=POINTS[app_type],
                created_at=now - timedelta(days=j + 1),
            ).model_dump()
        )

    await db.case_notes.insert_one(
        CaseNote(
            participant_id=PARTICIPANT_ID,
            coach_id=COACH_ID,
            coach_name="Marcus Vance",
            body="Sarah is tracking well on Core Skills. Booked for a mock interview next Tuesday.",
            created_at=now - timedelta(days=2),
        ).model_dump()
    )

    await ensure_indexes()
    print("Seeded WorkReady Portal.")
    print("  Participant : sarah@demo.au")
    print("  Case Manager: marcus@demo.au")
    print("  Provider Admin: eleanor@demo.au")


if __name__ == "__main__":
    asyncio.run(main())
