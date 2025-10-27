---
title: "25.2 Presenting the solution"
---

# 25.2 Presenting the solution

## Why it matters

You've built something that works. Now you need to convince others it's worth using.

A brilliant solution that nobody understands is worthless. Effective presentations turn technical work into compelling stories that stakeholders can understand, evaluate, and act on. Whether you're pitching to teachers, parents, clients, or decision-makers, your ability to present determines whether your project succeeds or sits unused.

This isn't about PowerPoint animations or public speaking tricks. It's about translating technical achievement into value that different audiences care about.

---

## Concepts

### Know your audience

The same presentation won't work for everyone. Your school principal cares about different things than the IT technician, who cares about different things than the students who'll actually use your solution.

**Four key audience types:**

**Technical stakeholders** (developers, IT staff, system administrators)

- What they care about: Implementation details, architecture decisions, security, maintenance requirements, integration points
- What they'll ask: "How does it handle authentication?" "What database did you use?" "How will we maintain this?"

**Business stakeholders** (principals, managers, department heads)

- What they care about: Cost, efficiency gains, ROI, strategic alignment, implementation timeline
- What they'll ask: "How much will this cost?" "What's the payback period?" "Will this disrupt current operations?"

**End users** (students, teachers, staff who'll use the system daily)

- What they care about: Ease of use, time savings, solving their specific problems, learning curve
- What they'll ask: "Is this easier than what we have now?" "How long does it take to learn?" "Will this make my job harder?"

**Decision makers** (school board, executives, funding bodies)

- What they care about: Strategic fit, risk, compliance, long-term value, competitive advantage
- What they'll ask: "Why this solution over alternatives?" "What are the risks?" "How does this align with our goals?"

### Tailoring your message

For a school attendance tracking system, here's how your message changes:

**To the principal:** "This system reduces attendance processing time by 70%, freeing up two hours daily for student engagement. It also ensures compliance with Department of Education reporting requirements."

**To IT staff:** "Built with Python and SQLite, it integrates with the existing student information system via CSV export. Runs on the school network with no external dependencies. Maintenance involves quarterly database backups."

**To teachers:** "Instead of filling out paper rolls and delivering them to the office, you tap three buttons on your phone. Absent students? Two more taps. Takes 30 seconds instead of 5 minutes."

**To the school board:** "Reduces administrative overhead by $15,000 annually, improves attendance data accuracy from 87% to 99.5%, and eliminates manual data entry errors that previously caused compliance issues."

Same solution. Four different angles. Each audience hears what matters to them.

### The presentation narrative arc

Effective presentations follow a story structure that audiences naturally understand:

```kroki-plantuml
@startuml
!theme plain
skinparam monochrome true
skinparam shadowing false

rectangle "1. The Problem" as prob #lightgray
note right
  Current pain points
  Quantified impacts
  Why it matters now
end note

rectangle "2. The Solution" as solution #lightgray
note right
  What you built
  How it works
  Key features
end note

rectangle "3. The Demo" as demo #lightgray
note right
  Live walkthrough
  Real scenarios
  Prove it works
end note

rectangle "4. The Benefits" as benefits #lightgray
note right
  Time saved
  Costs reduced
  Problems solved
end note

rectangle "5. Next Steps" as next #lightgray
note right
  Implementation plan
  Timeline
  Decision points
end note

prob -down-> solution
solution -down-> demo
demo -down-> benefits
benefits -down-> next
@enduml
```

**1. The Problem (2-3 minutes)**

Don't start with your solution. Start with the problem. Make your audience feel the pain.

Bad opening: "Today I'll present my student attendance tracking system built with Python."

Good opening: "Every morning, teachers spend 5 minutes taking attendance on paper. That's 25 minutes per week, per teacher. Across 50 teachers, that's 1,250 minutes—over 20 hours—of wasted time every single week. And that's before we count the office staff manually entering this data into spreadsheets."

Quantify the problem. Use real numbers. Make it concrete.

**2. The Solution (3-5 minutes)**

Now introduce what you built. Keep it high-level for mixed audiences.

- What is it? (One sentence description)
- How does it work? (High-level architecture)
- What makes it different? (Key innovation or advantage)

Use visuals. A simple diagram beats paragraphs of explanation:

```kroki-plantuml
@startuml
!theme plain
skinparam monochrome true
skinparam shadowing false

actor Teacher
actor "Office Staff" as office
database "Attendance\nDatabase" as db
cloud "Mobile App" as app

Teacher -> app: Mark attendance\n(30 seconds)
app -> db: Store records
office -> db: Generate reports\n(1 click)

note right of db
  Automatic compliance
  Real-time updates
  No manual entry
end note
@enduml
```

**3. The Demo (8-12 minutes)**

This is the most important part. Show, don't tell.

Plan your demo around user scenarios, not features:

/// tab | Bad Demo Structure
**What NOT to do:**

- "First I'll show you the database schema..."
- "Let me explain how the authentication works..."
- "Here's the code that handles validation..."

This loses your audience immediately.
///

/// tab | Good Demo Structure
**What TO do:**

- "Let's follow Sarah, a Year 10 teacher, on Monday morning..."
- "She opens the app, sees her class list, taps three names—done."
- "Meanwhile, the office staff can already see the data..."

Show real workflows. Use realistic data. Make it relatable.
///

**Demo preparation checklist:**

- [ ] Test your demo at least twice beforehand
- [ ] Use realistic sample data (real names, real classes)
- [ ] Have a backup plan if technology fails
- [ ] Keep each scenario under 2 minutes
- [ ] Highlight benefits as you go, not just features

**4. The Benefits (3-5 minutes)**

Connect your solution back to the original problem. Use the same metrics.

"Remember those 20 hours per week we were losing? This system reduces it to 2 hours. That's 18 hours—more than two full days—back for student engagement every single week."

Break benefits into categories your audience cares about:

- **Time savings**: Specific hours recovered
- **Cost reduction**: Dollar amounts, not percentages
- **Quality improvements**: Error rates, accuracy gains
- **Risk mitigation**: Compliance, security, reliability

**5. Next Steps (2-3 minutes)**

End with a clear path forward. No decision-making audience wants to be left wondering "so what happens now?"

Be specific:

- Implementation timeline with milestones
- Resource requirements (people, equipment, budget)
- Training needs and support plan
- Success metrics to track

"If we proceed, we can pilot this with Year 7 next term, expand to Year 8 the following term, and have full school rollout by Term 3. Training takes 15 minutes per teacher. Total setup cost is $500 for hosting, with ongoing costs of $50 per month."

### Handling questions and objections

Questions aren't attacks—they're engagement. Good questions mean your audience is thinking about implementation.

**Common question types and how to handle them:**

**Technical questions** ("What database are you using?")

- Answer directly and briefly
- Offer to provide technical documentation afterward
- Don't derail the presentation into technical details

**Feasibility questions** ("How long will this take to implement?")

- Give realistic timelines with contingency
- Reference your project plan or Gantt chart
- Acknowledge risks and mitigation strategies

**Cost questions** ("How much will this cost?")

- Provide total cost of ownership, not just initial cost
- Compare to current costs or alternatives
- Frame as investment with ROI timeline

**Risk questions** ("What if the server goes down?")

- Acknowledge the risk
- Explain your mitigation strategy
- Provide data if available (uptime statistics, backup procedures)

**Skeptical questions** ("Will teachers actually use this?")

- Share user testing feedback if available
- Demonstrate ease of use
- Propose pilot program to prove adoption

**If you don't know the answer:**

"That's a great question. I don't have that data right now, but I can research it and get back to you by Friday."

Never make up answers. Your credibility matters more than appearing knowledgeable.

### Visual aids and structure

**Slide design principles:**

Keep slides simple. Each slide should support one idea.

Bad slide:

```
ATTENDANCE TRACKING SYSTEM FEATURES
• Real-time data synchronization across devices
• Role-based access control with admin/teacher/office permissions
• Automated report generation with customizable templates
• Integration with existing SIS via CSV/API
• Mobile-responsive design supporting iOS/Android
• Offline mode with sync-when-connected capability
• Multi-language support (English, Mandarin, Arabic)
• Backup and disaster recovery systems
• [... continues for 15 more bullet points]
```

Good slide:

```
Teachers mark attendance in 30 seconds

[Large, clear screenshot of the 3-tap process]
```

**One idea per slide.** Use visuals, not walls of text.

**Presentation time allocation:**

For a 20-minute presentation with 5 minutes Q&A:

| Section | Time | Purpose |
|---------|------|---------|
| Problem | 3 min | Establish need |
| Solution Overview | 4 min | Explain approach |
| **Live Demo** | 10 min | Prove it works |
| Benefits & Next Steps | 3 min | Drive decision |
| Q&A | 5 min | Address concerns |

Notice the demo gets half your time. That's where decisions are made.

### Demonstration best practices

**Prepare multiple scenarios:**

Don't show every feature. Show the workflows that matter most to your audience.

For a library book checkout system:

/// details | Scenario 1: Student perspective (2 minutes)
    type: example
    open: true

"Alex needs to borrow three books for a history assignment."

1. Scan student ID
2. Scan three books
3. Receipt prints with due dates
4. Total time: 45 seconds

**Highlight:** Speed, simplicity, no training needed
///

/// details | Scenario 2: Librarian perspective (3 minutes)
    type: example
    open: false

"End of day: need to see which books are overdue."

1. Open dashboard
2. Click "Overdue Items" report
3. Shows list with student contacts
4. Send reminder emails with one click

**Highlight:** Time saved, automated communication
///

/// details | Scenario 3: Administrator perspective (2 minutes)
    type: example
    open: false

"Monthly report for library committee."

1. Navigate to Reports
2. Select date range
3. Generate PDF with checkout stats, popular books, trends
4. Download takes 3 seconds

**Highlight:** Data-driven decisions, compliance
///

**Recovery strategies when demos fail:**

Technology fails. Plan for it.

- **Backup laptop/device:** Always
- **Screenshots/video:** Prepare a walkthrough video as fallback
- **Offline mode:** If your app has it, use it
- **Acknowledge and move on:** "The server's not responding—let me show you the video walkthrough instead"

Don't spend 5 minutes trying to fix connectivity during a presentation. Move to your backup immediately.

### Building credibility

**Show your process, not just your product:**

"I interviewed 12 teachers and 3 office staff to understand their workflow. Here's what they told me..."

"I tested with Year 7 for two weeks. Here's the feedback..."

Evidence builds trust:

- User testing results
- Pilot program data
- Expert validation (teacher supervisor, IT department)
- Before/after comparisons with real metrics

**Addressing limitations honestly:**

Don't hide weaknesses. Address them proactively.

"This system doesn't currently support biometric login—that's a planned future enhancement. For now, we're using student ID cards which all students already carry."

Showing you understand limitations demonstrates maturity and realistic thinking.

---

## Practice

### Exercise 1: Audience analysis

/// details | Exercise 1: Tailor your message
    type: question
    open: false

You've built a homework submission and grading system for your school. Write a 2-3 sentence pitch for each of these audiences:

1. Year 9 students who will submit homework through it
2. Teachers who will grade submissions
3. The school principal making the approval decision
4. The IT manager who will maintain it

Consider what each audience cares about most.

/// details | Sample Solution
    type: success
    open: false

**To Year 9 students:**
"Submit your homework from your phone in under a minute. Get instant confirmation it was received, and see feedback from teachers the same day it's marked. No more 'I forgot to bring it' or worrying whether your work got lost."

**To teachers:**
"All submissions in one place, organised by class and due date. Grade with your phone or laptop, add comments, and students get instant feedback. No more chasing paper submissions or managing email attachments. Cuts grading admin time by 60%."

**To the principal:**
"Increases homework completion rates by 25% based on our Year 10 pilot. Provides clear audit trail for parent meetings. Ensures consistent feedback for all students. Zero cost—built using existing school infrastructure."

**To the IT manager:**
"Runs on the school's existing web server, uses SQLite so no new database server needed. All student data stays on-premises. Maintenance is minimal—automated backups and basic monitoring. I'll provide full documentation and transition support."
///
///

### Exercise 2: Problem framing

/// details | Exercise 2: Quantify the problem
    type: question
    open: false

You're presenting a canteen ordering system that lets students pre-order lunch online.

Write an opening paragraph (3-4 sentences) that makes the current problem concrete and compelling using specific numbers and real impacts.

/// details | Sample Solution
    type: success
    open: false

"Every lunchtime, 400 students queue at the canteen for an average of 12 minutes each. That's 80 student-hours lost daily—400 hours per week that could be spent learning, socialising, or relaxing. The canteen serves 200 students in the first 15 minutes, then faces a 30-minute rush where staff are overwhelmed and students are frustrated. By the time some Year 7s reach the counter, their lunch break is over and they've missed their opportunity to eat."

**Why this works:**

- Specific numbers (400 students, 12 minutes, 80 hours)
- Multiple stakeholder impacts (students, canteen staff)
- Emotional element (Year 7s missing lunch entirely)
- Clear inefficiency that a solution could address
///
///

### Exercise 3: Demo scenario planning

/// details | Exercise 3: Structure a demo
    type: question
    open: false

You're demonstrating a sports fixtures management system to coaches and the sports coordinator. You have 8 minutes for the demo.

Plan three scenarios (with timing) that show the most important workflows. For each scenario:

- State the user role
- List the steps (keep it under 5 steps)
- Identify what benefit you'll highlight
- Allocate time (must total 8 minutes)

/// details | Sample Solution
    type: success
    open: false

**Scenario 1: Coach schedules practice (2.5 minutes)**

User: Basketball coach

Steps:

1. Open calendar view
2. Click "Add Practice"
3. Select team, date, venue, time
4. Send notification to all players
5. Practice appears on team calendar

Benefit highlighted: "Takes 30 seconds instead of 15 minutes of emails"

---

**Scenario 2: Student checks their fixtures (1.5 minutes)**

User: Student playing netball and swimming

Steps:

1. Login shows personalised calendar
2. See all upcoming games/practices for both sports
3. Click fixture to see location, time, opponent
4. Add to phone calendar with one tap

Benefit highlighted: "Never miss a game—everything in one place"

---

**Scenario 3: Sports coordinator generates reports (4 minutes)**

User: Director of Sport

Steps:

1. Navigate to Reports dashboard
2. View participation stats by sport and year level
3. Generate "Upcoming Week" fixture list
4. Export to PDF and email to all parents

Benefit highlighted: "Complete oversight in seconds, not hours of spreadsheet work"

---

**Total: 8 minutes**

**Rationale:** Started with quick, simple scenario to build confidence. Middle scenario shows student benefit. Ended with powerful admin scenario that shows strategic value.
///
///

### Exercise 4: Handling objections

/// details | Exercise 4: Respond to tough questions
    type: question
    open: false

During your presentation of a student mentoring matching system, stakeholders ask these questions. Write a response to each (2-3 sentences):

1. **Teacher:** "What if students game the system to get matched with their friends instead of mentors who'll actually help them?"

2. **IT Manager:** "How do you handle student data privacy? This involves sharing personal information between students."

3. **Principal:** "We tried a mentoring system three years ago and it failed after one term. Why will this be different?"

/// details | Sample Solution
    type: success
    open: false

**1. Gaming the system:**

"Great question—that was a concern during design. The system uses a matching algorithm based on students' stated goals and mentors' areas of strength, not personal preference. A teacher coordinator reviews and approves all matches before they're finalised, so they can spot and prevent inappropriate pairings."

**2. Data privacy:**

"All personal data stays within the school's existing student database—the system doesn't create a new database. Students only see their matched mentor's name, year level, and areas of expertise. Contact happens through supervised channels approved by the school. I can provide a full privacy impact assessment document that details the safeguards."

**3. Previous failure:**

"I researched that program and identified three reasons it failed: mentors weren't trained, meetings weren't structured, and there was no follow-up. This system addresses all three: it includes a mentor training module, provides conversation starters and meeting templates, and sends automated check-in prompts. The Year 11 pilot showed 85% of mentoring pairs met at least three times—compared to 40% in the previous program."

**Why these work:**

- Acknowledge the concern legitimately
- Provide specific mechanism/solution
- Offer evidence or offer to provide detail
- Show you've thought deeply about the issue
///
///

---

## Recap

Presenting your solution effectively means understanding your audience, structuring a compelling narrative, and demonstrating real value through clear examples.

**Key principles:**

- **Tailor to your audience:** Technical stakeholders need implementation details, business stakeholders need ROI, end users need simplicity, decision makers need strategic fit
- **Follow the narrative arc:** Problem → Solution → Demo → Benefits → Next Steps
- **Show, don't tell:** Live demonstrations proving real workflows beat feature lists
- **Quantify everything:** Use specific numbers for problems, savings, and impacts
- **Prepare for failure:** Always have backup plans for technical difficulties
- **Handle objections honestly:** Acknowledge concerns and provide evidence-based responses
- **End with clarity:** Give clear next steps and decision points

Your presentation isn't about showing how clever you are. It's about making your audience confident that your solution solves their problem and is worth implementing. Keep them at the centre of every slide, every demo scenario, and every response to questions.
