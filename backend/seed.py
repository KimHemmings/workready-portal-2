"""Idempotent seed data for Straight Up Training. Run: cd /app/backend && python seed.py"""

import asyncio
import random
from datetime import datetime, timedelta, timezone

from lib import certificates
from lib.db import db, ensure_indexes
from lib.security import hash_password
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
DEMO_PASSWORD = "Training2026!"
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
            "scenario": "It is your second week at a warehouse. Your supervisor gives you a task you have not been trained on, and everyone else is busy on the floor.",
            "question": "What is the best thing to do in this situation?",
            "options": [
                "Guess how it works and start anyway",
                "Politely tell your supervisor you have not been trained and ask to be shown",
                "Skip the task and hope nobody notices",
                "Ask another new starter to guess with you",
            ],
            "correct_answer": 1,
            "explanation": "Speaking up shows initiative and keeps you safe — never operate equipment you have not been trained on.",
        },
        {
            "scenario": "You are on Workforce Australia with a 100 point monthly Mutual Obligation target. It is the 28th of the month and you have logged 60 points.",
            "question": "What should you do next?",
            "options": [
                "Nothing — 60 points is close enough",
                "Log activities you did not actually do",
                "Complete and log more genuine job search activities before month end",
                "Wait for your case manager to fix it",
            ],
            "correct_answer": 2,
            "explanation": "You need genuine activity to reach 100 points. Attending an interview is worth 20 points, so a few real activities can close the gap.",
        },
        {
            "scenario": "Your shift starts at 6am. At 5:30am your car will not start and you will be about 40 minutes late.",
            "question": "What is the most professional response?",
            "options": [
                "Say nothing and explain when you arrive",
                "Ring your supervisor straight away to explain and give your new arrival time",
                "Text a workmate to cover for you",
                "Take the day off without contact",
            ],
            "correct_answer": 1,
            "explanation": "Ringing ahead early lets the team re-plan the shift and shows you are reliable.",
        },
        {
            "scenario": "A team leader gives you feedback that your shelf stacking is too slow and shows you a faster method.",
            "question": "Which response best demonstrates the 'Interact with others' core skill?",
            "options": [
                "Argue that your way works fine",
                "Thank them, try the new method and ask for a check later",
                "Stay silent and keep doing it your way",
                "Complain to other staff about the feedback",
            ],
            "correct_answer": 1,
            "explanation": "Accepting feedback without getting defensive is one of the strongest employability behaviours.",
        },
        {
            "scenario": "You are given a list of five jobs to finish before your break, but you cannot see how to fit them all in.",
            "question": "Which action best shows 'Get the work done'?",
            "options": [
                "Do them in a random order and rush",
                "Plan the order, start on the most urgent, and tell your supervisor if time will run short",
                "Wait to be told exactly what to do first",
                "Only do the easiest one",
            ],
            "correct_answer": 1,
            "explanation": "Planning, prioritising and flagging problems early is exactly what employers mean by working independently.",
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
            "scenario": "An interviewer says: 'Tell me about a time you dealt with a difficult customer.' You once calmed an upset customer at a work placement.",
            "question": "Which answer follows the STAR approach best?",
            "options": [
                "I'm good with people and never get flustered",
                "At my IGA placement a customer was upset a special had ended. I apologised, checked the catalogue and asked my supervisor to honour the price. The customer left happy.",
                "Customers can be rude sometimes but you cope",
                "I would ask my manager to deal with it",
            ],
            "correct_answer": 1,
            "explanation": "That answer gives the Situation, Task, Action and Result — a specific example always beats a general claim.",
        },
        {
            "scenario": "Your interview is at 10am in a suburb you have not visited before, and the bus trip takes about 45 minutes.",
            "question": "What is the best plan?",
            "options": [
                "Leave at 9:50am and hope for the best",
                "Plan the trip in advance and aim to arrive about 10 minutes early",
                "Arrive 45 minutes early and wait inside",
                "Ring to move the interview later",
            ],
            "correct_answer": 1,
            "explanation": "About 10 minutes early is professional — arriving very early can crowd the employer.",
        },
        {
            "scenario": "The interviewer asks a question and you genuinely do not understand what they mean.",
            "question": "What should you do?",
            "options": [
                "Guess and talk for as long as possible",
                "Politely ask them to explain the question a different way",
                "Say nothing and wait",
                "Say you would rather not answer",
            ],
            "correct_answer": 1,
            "explanation": "Asking for clarification shows good communication — it is never a weakness in an interview.",
        },
        {
            "scenario": "At the end of the interview the employer asks: 'Do you have any questions for us?'",
            "question": "Which is the strongest response?",
            "options": [
                "No, I think that's everything",
                "Ask what a typical shift looks like and what training is provided",
                "Ask only about pay and days off",
                "Ask if you got the job",
            ],
            "correct_answer": 1,
            "explanation": "Thoughtful questions about the work and training show genuine interest in the role.",
        },
        {
            "scenario": "You are getting ready for an entry-level retail interview tomorrow morning.",
            "question": "What should you take with you?",
            "options": [
                "Nothing, they have your application",
                "A printed resume and your referee details",
                "Your whole school portfolio",
                "A friend to wait with you inside",
            ],
            "correct_answer": 1,
            "explanation": "A printed resume and two referees show you are organised and prepared.",
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
    ("Jayden Nguyen", "jayden@hves.com.au", 3, 8),
    ("Amira Haddad", "amira@hves.com.au", 2, 5),
    ("Tyrone Walker", "tyrone@hves.com.au", 0, 1),
    ("Chloe Marsden", "chloe@hves.com.au", 5, 14),
    ("Rangi Patel", "rangi@hves.com.au", 1, 3),
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
        "certificates",
    ):
        await db[name].delete_many({})

    now = datetime.now(timezone.utc)

    await db.organizations.insert_one(
        Organization(
            id=ORG_ID,
            name="Hunter Valley Employment Services",
            type="Workforce Australia",
            branding_logo="https://customer-assets-39nsmqrw.emergentagent.net/job_workready-portal-2/artifacts/kym1ejab_White_Background_PNG.png",
            primary_color="#1E3A8A",
            site_code="SITE-2026",
            coach_seat_limit=5,
            participant_seat_limit=100,
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
            name="Straight Up Admin",
            email="kimh@straightuptraining.com",
            role="admin",
            organization_id=ORG_ID,
            phone="02 4900 1000",
        ),
        User(
            id=COACH_ID,
            name="Marcus Vance",
            email="marcus@hves.com.au",
            role="coach",
            organization_id=ORG_ID,
            phone="02 4900 1001",
        ),
        User(
            id=PARTICIPANT_ID,
            name="Sarah Chen",
            email="sarah@hves.com.au",
            role="participant",
            organization_id=ORG_ID,
            phone="0400 111 222",
            coach_id=COACH_ID,
            cohort_id="cohort-morning",
            last_login=now - timedelta(days=1),
        ),
    ]
    owner = User(
        id="user-owner-system",
        name="Straight Up Training Owner",
        email="admin@straightuptraining.com",
        role="owner",
        organization_id=ORG_ID,
        last_login=now,
    )
    users = [owner] + users

    # Seeded accounts are fully set up: real password hash, no forced change, no pending invite.
    await db.users.insert_many(
        [{**u.model_dump(), "password_hash": hash_password(DEMO_PASSWORD)} for u in users]
    )

    for i, (name, email, done, apps) in enumerate(EXTRA_PARTICIPANTS):
        pid = f"user-participant-{email.split('@')[0]}"
        await db.users.insert_one(
            {
                **User(
                    id=pid,
                    name=name,
                    email=email,
                    role="participant",
                    organization_id=ORG_ID,
                    phone=f"04{i}0 333 4{i}4",
                    coach_id=COACH_ID,
                    cohort_id="cohort-ttw" if i % 2 else "cohort-morning",
                    last_login=now - timedelta(days=i + 2),
                ).model_dump(),
                "password_hash": hash_password(DEMO_PASSWORD),
            }
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

    # Certificates are awarded by the same rules the app uses at runtime.
    for participant in await db.users.find({"role": "participant"}).to_list(100):
        completed = await db.participant_progress.find(
            {"participant_id": participant["id"], "status": "completed"}
        ).to_list(500)
        for prog in completed:
            await certificates.issue_for_category(participant, prog["module_id"])

    sarah = await db.users.find_one({"id": PARTICIPANT_ID})
    if sarah:
        await certificates.issue_for_interview(sarah, "Retail Team Member", 82)

    print("Seeded Straight Up Training.")
    print("  System Admin: admin@straightuptraining.com")
    print("  Participant : sarah@hves.com.au")
    print("  Case Manager: marcus@hves.com.au")
    print("  Provider: kimh@straightuptraining.com")


if __name__ == "__main__":
    asyncio.run(main())
