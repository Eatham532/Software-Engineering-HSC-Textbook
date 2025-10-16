---
title: "24.2 Agile approach"
---

# 24.2 Agile approach

## Why it matters

Agile methodology revolutionised software development by emphasising collaboration, flexibility, and rapid delivery of working software. Unlike traditional approaches that rely on extensive upfront planning, Agile responds to change and delivers value incrementally. Understanding Agile principles, ceremonies, and practices is essential for modern software engineering projects that need to adapt quickly to user feedback and changing requirements.

## Concepts

### Agile iterations and sprints

Agile development is organised into short, time-boxed periods called iterations or sprints, typically lasting 1-4 weeks. Each iteration delivers a potentially shippable increment of working software.

Key characteristics of Agile iterations:

- **Time-boxed**: Fixed duration that cannot be extended

- **Goal-oriented**: Each sprint has specific objectives and deliverables

- **Incremental**: Builds upon previous work to add new functionality

- **Reviewable**: Produces demonstrable results for stakeholder feedback

/// tab | Sprint Structure
**Typical 2-week sprint timeline**:

- **Day 1**: Sprint planning (define goals and tasks)

- **Days 2-9**: Development work with daily standups

- **Day 10**: Sprint review (demonstrate completed work)

- **Day 10**: Sprint retrospective (process improvement)

**Sprint Planning Process**:

1. Review product backlog priorities

2. Estimate effort for proposed features

3. Commit to achievable sprint goals

4. Break down features into development tasks
///

/// tab | Python Sprint Tracker

```py
from datetime import date, timedelta
from enum import Enum

class SprintStatus(Enum):
    PLANNING = "planning"
    ACTIVE = "active"
    REVIEW = "review"
    COMPLETE = "complete"

class Sprint:
    def __init__(self, number, duration_weeks=2):
        self.number = number
        self.duration_weeks = duration_weeks
        self.start_date = None
        self.end_date = None
        self.status = SprintStatus.PLANNING
        self.goals = []
        self.user_stories = []
        self.completed_stories = []
    
    def start_sprint(self, start_date, goals):
        self.start_date = start_date
        self.end_date = start_date + timedelta(weeks=self.duration_weeks)
        self.goals = goals
        self.status = SprintStatus.ACTIVE
        print(f"Sprint {self.number} started: {start_date} to {self.end_date}")
    
    def add_user_story(self, story):
        self.user_stories.append(story)
    
    def complete_story(self, story):
        if story in self.user_stories:
            self.completed_stories.append(story)
            print(f"✓ Completed: {story}")
    
    def get_velocity(self):
        """Calculate story points completed this sprint"""
        total_points = sum(story.get('points', 0) for story in self.completed_stories)
        return total_points
    
    def sprint_summary(self):
        completed = len(self.completed_stories)
        total = len(self.user_stories)
        velocity = self.get_velocity()
        return f"Sprint {self.number}: {completed}/{total} stories, {velocity} points"

## Example usage

sprint = Sprint(1)
sprint.start_sprint(date(2025, 10, 1), ["Implement user login", "Create dashboard"])
sprint.add_user_story({"title": "User can log in", "points": 5})
sprint.add_user_story({"title": "User sees personal dashboard", "points": 8})
sprint.complete_story({"title": "User can log in", "points": 5})
print(sprint.sprint_summary())

```

///

### Agile ceremonies

Agile ceremonies are structured meetings that facilitate communication, planning, and continuous improvement within development teams.

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

!define CEREMONY rectangle

CEREMONY "Sprint Planning\n(Start of Sprint)" as PLAN
CEREMONY "Daily Standup\n(Every Day)" as DAILY
CEREMONY "Sprint Review\n(End of Sprint)" as REVIEW
CEREMONY "Sprint Retrospective\n(End of Sprint)" as RETRO

PLAN --> DAILY : Sprint begins
DAILY --> DAILY : Daily progress
DAILY --> REVIEW : Sprint ends
REVIEW --> RETRO : Demonstrate work
RETRO --> PLAN : Improve process

note right of PLAN : Plan work for\nupcoming sprint
note right of DAILY : Sync progress\nand remove blockers
note right of REVIEW : Demo completed\nfeatures to stakeholders
note right of RETRO : Reflect on process\nand identify improvements
@enduml

```

#### Sprint Planning

Sprint Planning is a collaborative meeting where the team selects work for the upcoming sprint and creates a plan for delivering it.

**Sprint Planning activities**:

- **Product Backlog review**: Understand priorities and requirements

- **Capacity planning**: Determine team availability and capacity

- **Story selection**: Choose user stories that fit within sprint capacity

- **Task breakdown**: Decompose stories into specific development tasks

/// tab | Planning Process
**Planning Meeting Agenda** (4 hours for 2-week sprint):

1. **Review sprint goal** (30 minutes)

   - Product Owner explains priorities

   - Team discusses overall objective

2. **Select user stories** (2 hours)

   - Estimate effort using story points

   - Choose stories that fit team capacity

   - Clarify acceptance criteria

3. **Create sprint backlog** (1.5 hours)

   - Break stories into technical tasks

   - Assign initial ownership

   - Identify dependencies and risks
///

/// tab | Python Planning Tool

```py
class UserStory:
    def __init__(self, title, description, points, acceptance_criteria):
        self.title = title
        self.description = description
        self.points = points
        self.acceptance_criteria = acceptance_criteria
        self.tasks = []
    
    def add_task(self, task_description, estimated_hours):
        task = {
            "description": task_description,
            "estimated_hours": estimated_hours,
            "status": "todo"
        }
        self.tasks.append(task)
    
    def get_total_hours(self):
        return sum(task["estimated_hours"] for task in self.tasks)

class SprintPlanning:
    def __init__(self, team_capacity_hours):
        self.team_capacity_hours = team_capacity_hours
        self.selected_stories = []
        self.total_committed_hours = 0
    
    def add_story_to_sprint(self, user_story):
        story_hours = user_story.get_total_hours()
        if self.total_committed_hours + story_hours <= self.team_capacity_hours:
            self.selected_stories.append(user_story)
            self.total_committed_hours += story_hours
            print(f"✓ Added: {user_story.title} ({story_hours}h)")
            return True
        else:
            print(f"✗ Cannot add: {user_story.title} - exceeds capacity")
            return False
    
    def planning_summary(self):
        story_count = len(self.selected_stories)
        utilisation = (self.total_committed_hours / self.team_capacity_hours) * 100
        return f"Sprint plan: {story_count} stories, {self.total_committed_hours}h ({utilisation:.1f}% capacity)"

## Example planning session

planning = SprintPlanning(80)  # 80 hours team capacity

login_story = UserStory(
    "User Authentication",
    "As a user, I want to log in securely",
    5,
    ["Username/password validation", "Session management", "Error handling"]
)
login_story.add_task("Create login form", 8)
login_story.add_task("Implement authentication logic", 12)
login_story.add_task("Add session management", 6)

planning.add_story_to_sprint(login_story)
print(planning.planning_summary())

```

///

#### Daily Standup

Daily Standup is a brief (15-minute) meeting where team members synchronise their work and identify any impediments.

**Standard Standup questions**:

1. **What did I complete yesterday?**

2. **What will I work on today?**

3. **Are there any blockers or impediments?**

/// tab | Standup Best Practices
**Effective Daily Standups**:

- **Time-boxed**: Strictly 15 minutes maximum

- **Standing up**: Physical standing keeps meeting brief

- **Focus on work**: Discuss tasks, not detailed solutions

- **Identify blockers**: Highlight issues that need resolution

- **Follow up separately**: Detailed discussions happen after standup

**Common Anti-patterns to avoid**:

- Turning into status reporting session

- Solving problems during the meeting

- Only talking to the Scrum Master

- Skipping team members or irregular attendance
///

/// tab | Python Standup Tracker

```py
from datetime import date

class StandupUpdate:
    def __init__(self, team_member, completed_yesterday, planned_today, blockers=None):
        self.team_member = team_member
        self.completed_yesterday = completed_yesterday
        self.planned_today = planned_today
        self.blockers = blockers or []
        self.date = date.today()
    
    def has_blockers(self):
        return len(self.blockers) > 0
    
    def format_update(self):
        update = f"**{self.team_member}** ({self.date})\\n"
        update += f"Yesterday: {self.completed_yesterday}\\n"
        update += f"Today: {self.planned_today}\\n"
        if self.has_blockers():
            update += f"Blockers: {', '.join(self.blockers)}\\n"
        return update

class DailyStandup:
    def __init__(self, sprint_day):
        self.sprint_day = sprint_day
        self.updates = []
        self.action_items = []
    
    def add_update(self, update):
        self.updates.append(update)
        if update.has_blockers():
            for blocker in update.blockers:
                self.action_items.append(f"Resolve: {blocker} (Owner: {update.team_member})")
    
    def generate_summary(self):
        blocker_count = sum(1 for update in self.updates if update.has_blockers())
        summary = f"Standup Day {self.sprint_day}: {len(self.updates)} team members\\n"
        summary += f"Active blockers: {blocker_count}\\n"
        if self.action_items:
            summary += "Action items:\\n"
            for item in self.action_items:
                summary += f"- {item}\\n"
        return summary

## Example standup

standup = DailyStandup(5)
standup.add_update(StandupUpdate(
    "Sarah", 
    "Completed user login form design",
    "Implement form validation logic",
    ["Need access to testing database"]
))
standup.add_update(StandupUpdate(
    "Mike",
    "Fixed bug in password encryption",
    "Start work on dashboard layout"
))
print(standup.generate_summary())

```

///

#### Sprint Review

Sprint Review is a meeting where the team demonstrates completed work to stakeholders and gathers feedback for future iterations.

**Sprint Review objectives**:

- **Demonstrate working software**: Show completed features in action

- **Gather stakeholder feedback**: Collect input on delivered functionality

- **Review sprint goals**: Assess whether objectives were met

- **Plan next iteration**: Discuss priorities for upcoming sprint

#### Sprint Retrospective

Sprint Retrospective is a team reflection meeting focused on process improvement and team dynamics.

**Common retrospective formats**:

- **Start, Stop, Continue**: What should we start doing, stop doing, continue doing?

- **What went well, What didn't, Actions**: Structured reflection and improvement planning

- **Mad, Sad, Glad**: Emotional reflection on sprint experiences

### User Stories

User Stories are short, simple descriptions of features written from the perspective of the person who will use the feature.

**User Story format**:

```
As a [user type],
I want [functionality],
So that [benefit/value].

```

Essential components of good User Stories:

- **Independent**: Can be developed and delivered separately

- **Negotiable**: Details can be discussed and refined

- **Valuable**: Provides clear benefit to users or business

- **Estimable**: Team can reasonably estimate effort required

- **Small**: Can be completed within a single sprint

- **Testable**: Clear criteria for determining completion

/// tab | Story Examples
**Well-written User Stories**:

**Student Portal Login**:
///
As a high school student,
I want to log into the school portal with my student ID,
So that I can access my grades and assignment information securely.

```

**Teacher Grade Entry**:

```

As a teacher,
I want to enter grades for multiple students simultaneously,
So that I can efficiently update student records after marking assignments.

```

**Parent Progress Tracking**:

```

As a parent,
I want to receive email notifications when my child's grades are updated,
So that I can stay informed about their academic progress.

```

/// tab | Python Story Management
///

```py

class AcceptanceCriteria:
    def __init__(self, description, test_method="manual"):
        self.description = description
        self.test_method = test_method
        self.status = "pending"
    
    def mark_complete(self):
        self.status = "complete"

class UserStory:
    def __init__(self, user_type, functionality, benefit):
        self.user_type = user_type
        self.functionality = functionality
        self.benefit = benefit
        self.story_points = None
        self.acceptance_criteria = []
        self.status = "draft"
    
    def add_acceptance_criteria(self, criteria):
        self.acceptance_criteria.append(criteria)
    
    def estimate_points(self, points):
        """Estimate story using Fibonacci sequence: 1, 2, 3, 5, 8, 13"""
        if points in [1, 2, 3, 5, 8, 13]:
            self.story_points = points
            self.status = "estimated"
        else:
            raise ValueError("Use Fibonacci sequence for story points")
    
    def format_story(self):
        story = f"As a {self.user_type},\\n"
        story += f"I want {self.functionality},\\n"
        story += f"So that {self.benefit}.\\n\\n"
        story += f"Story Points: {self.story_points}\\n\\n"
        story += "Acceptance Criteria:\\n"
        for i, criteria in enumerate(self.acceptance_criteria, 1):
            story += f"{i}. {criteria.description}\\n"
        return story
    
    def is_ready_for_development(self):
        return (self.story_points is not None and 
                len(self.acceptance_criteria) > 0 and
                self.status == "estimated")

## Example user story creation

login_story = UserStory(
    "student",
    "log into the school portal with my student ID",
    "I can access my grades and assignments securely"
)

login_story.add_acceptance_criteria(
    AcceptanceCriteria("Student can enter valid ID and password")
)
login_story.add_acceptance_criteria(
    AcceptanceCriteria("System displays appropriate error for invalid credentials")
)
login_story.add_acceptance_criteria(
    AcceptanceCriteria("Successful login redirects to student dashboard")
)

login_story.estimate_points(5)
print(login_story.format_story())
print(f"Ready for development: {login_story.is_ready_for_development()}")

```
///

## Practice

### Exercise 1: Sprint Planning simulation

/// details | Exercise 1: Plan Your First Sprint
    type: question
    open: false

**Scenario**: You're part of a 4-person development team building a library management system. Your team has 64 hours of capacity for a 2-week sprint.

**Available User Stories**:

1. **Book Search** (8 points): Students can search for books by title/author

2. **Book Checkout** (5 points): Students can borrow available books

3. **Due Date Reminders** (3 points): System sends email reminders before books are due

4. **Late Fee Calculation** (5 points): System calculates fees for overdue books

5. **Librarian Reports** (13 points): Librarians can generate usage and inventory reports

6. **Book Reservations** (8 points): Students can reserve books that are currently checked out

**Assumptions**:

- 1 story point = approximately 8 hours of work

- Team velocity from previous sprints: 10-12 story points

- Book Search and Book Checkout are highest priority

**Tasks**:

1. Select stories for the sprint based on team capacity and velocity

2. Justify your selection considering priorities and dependencies

3. Identify any risks or concerns with your plan

/// details | Sample Solution
    type: success
    open: false

**Sprint Selection Analysis**:

**Team Capacity**: 64 hours = approximately 8 story points at 8 hours per point

**Story Selection**:

1. **Book Search** (8 points) - SELECTED

   - Highest priority and foundation for other features

   - Users need to find books before they can check them out

2. **Book Checkout** (5 points) - SELECTED

   - High priority and depends on search functionality

   - Core library function

3. **Due Date Reminders** (3 points) - DEFERRED

   - Lower priority, can be added in future sprint

   - Would exceed reasonable capacity (16 points total)

**Total Selected**: 13 story points (slightly above historical velocity but within capacity)

**Justification**:

- Focuses on core user workflow: search → checkout

- Stays within team capacity guidelines

- Delivers immediate value to library users

- Creates foundation for future features

**Risks Identified**:

- Slightly above historical velocity - may need to reduce scope if blockers arise

- Book Checkout depends on Book Search completion

- Integration testing between search and checkout features may take longer than estimated

**Mitigation Strategies**:

- Break down stories into smaller tasks to track progress daily

- Complete Book Search in first week to unblock checkout work

- Plan integration testing time explicitly
///
///

### Exercise 2: Daily Standup facilitation

/// details | Exercise 2: Running Effective Standups
    type: question
    open: false

**Scenario**: You're the Scrum Master for a team developing a student grade tracking app. Today is day 6 of a 10-day sprint.

**Team Updates**:

**Alex (Frontend Developer)**:

- Yesterday: Completed student login page styling

- Today: Start implementing grade display components

- Blockers: Waiting for API documentation from backend team

**Jordan (Backend Developer)**:

- Yesterday: Worked on database schema for grades

- Today: Continue database work, create API endpoints

- Blockers: None currently

**Sam (QA Tester)**:

- Yesterday: Created test cases for login functionality

- Today: Test login page when Alex finishes

- Blockers: Cannot access staging environment - getting permission errors

**Riley (UI/UX Designer)**:

- Yesterday: Finished grade display mockups

- Today: Start designing parent notification interface

- Blockers: Need clarification on notification requirements from Product Owner

**Tasks**:

1. Identify the key issues that need immediate attention

2. Determine what actions should be taken after the standup

3. Suggest how to keep the standup focused and productive

4. Plan follow-up activities to resolve blockers

/// details | Sample Solution
    type: success
    open: false

**Standup Analysis & Actions**:

**Immediate Issues Identified**:

1. **API Documentation Blocker**: Alex needs backend API details to build frontend

2. **Staging Environment Access**: Sam cannot perform testing due to permission issues

3. **Requirements Clarification**: Riley needs Product Owner input on notifications

**Post-Standup Action Plan**:

1. **API Documentation** (High Priority):

   - Jordan and Alex to meet immediately after standup

   - Jordan to provide API specifications by end of day

   - Consider pair programming session to align frontend/backend

2. **Staging Environment** (High Priority):

   - Scrum Master to contact DevOps team immediately

   - Sam to document specific error messages for faster resolution

   - Temporary workaround: Sam to test on local development environment

3. **Requirements Clarification** (Medium Priority):

   - Schedule 30-minute meeting with Product Owner today

   - Riley to prepare specific questions about notification features

   - Document decisions for future reference

**Keeping Standup Focused**:

- Limit each person to 2 minutes maximum

- Use parking lot for detailed technical discussions

- Focus on blockers and commitments, not solutions

- Schedule follow-up meetings immediately after standup

**Sprint Risk Assessment**:

- **Risk**: Multiple blockers could delay sprint goals

- **Mitigation**: Prioritise blocker removal over new feature work

- **Communication**: Update stakeholders if sprint scope needs adjustment
///
///

### Exercise 3: User Story creation workshop

/// details | Exercise 3: Writing Effective User Stories
    type: question
    open: false

**Scenario**: A high school wants to improve their sports day event management. Currently, everything is managed with paper forms and manual coordination.

**Stakeholders**:

- **Students**: Participate in events, view schedules, check results

- **Teachers**: Organise events, track participation, record results

- **Parents**: View their child's events and results

- **Sports Coordinators**: Plan overall event, manage resources, generate reports

**Current Pain Points**:

- Paper forms get lost or damaged

- Difficult to track student participation across events

- Parents cannot easily find information about their child's events

- Results take days to compile and publish

- Resource conflicts (same equipment needed for multiple events)

**Tasks**:

1. Write 5 user stories covering different stakeholder needs

2. Add acceptance criteria for each story

3. Estimate story points using Fibonacci sequence (1, 2, 3, 5, 8, 13)

4. Prioritise stories for development order

/// details | Sample Solution
    type: success
    open: false

**User Stories for Sports Day Management System**:

**Story 1: Student Event Registration**

```

As a student,
I want to register for sports day events online,
So that I can easily sign up for activities I'm interested in and avoid lost paper forms.

```
**Acceptance Criteria**:

- Student can view available events with descriptions and time slots

- Student can register for multiple events if they don't conflict

- System prevents registration for conflicting time slots

- Student receives confirmation of registration

**Story Points**: 5

**Story 2: Real-time Results Display**

```

As a parent,
I want to view my child's sports day results on my phone,
So that I can celebrate their achievements and stay informed throughout the day.

```
**Acceptance Criteria**:

- Parent can search for their child by name or student ID

- Results are displayed immediately after teachers enter them

- Parent can see child's placement in each event

- System shows next scheduled events for the child

**Story Points**: 8

**Story 3: Teacher Result Entry**

```

As a teacher,
I want to enter event results directly on a tablet,
So that I can quickly record outcomes and make them available to parents immediately.

```
**Acceptance Criteria**:

- Teacher can select event and enter participant placements

- System validates that all registered participants are accounted for

- Results are immediately visible to parents and students

- Teacher can modify results within 30 minutes if errors found

**Story Points**: 5

**Story 4: Resource Conflict Management**

```

As a sports coordinator,
I want to see equipment scheduling conflicts when planning events,
So that I can ensure all events have necessary resources available.

```
**Acceptance Criteria**:

- System highlights when same equipment is needed for concurrent events

- Coordinator can view equipment allocation timeline

- System suggests alternative time slots to resolve conflicts

- Equipment checkout/return can be tracked

**Story Points**: 8

**Story 5: Participation Tracking**

```

As a teacher,
I want to see which students haven't registered for any events,
So that I can encourage participation and ensure all students are included.

```
**Acceptance Criteria**:

- Teacher can view class lists with registration status

- System shows students with zero registrations

- Teacher can register students directly if needed

- Reports show participation statistics by class

**Story Points**: 3

**Development Priority Order**:

1. **Student Event Registration** (Foundation feature)

2. **Teacher Result Entry** (Core functionality)

3. **Real-time Results Display** (High value for parents)

4. **Participation Tracking** (Helps ensure inclusion)

5. **Resource Conflict Management** (Optimization feature)

**Total Estimated Effort**: 29 story points
///
///

## Recap

The Agile approach emphasises iterative development through **sprints** that deliver working software incrementally. **Agile ceremonies** - Sprint Planning, Daily Standups, Sprint Reviews, and Sprint Retrospectives - provide structure for team collaboration and continuous improvement. **User Stories** capture requirements from the user's perspective, focusing on value and functionality rather than technical implementation details.

Successful Agile implementation requires commitment to the ceremonies, clear communication during standups, and well-written user stories with specific acceptance criteria. The approach works best when teams embrace change, focus on delivering value, and continuously reflect on their processes to improve effectiveness. Agile's flexibility makes it particularly suitable for projects where requirements may evolve based on user feedback and changing business needs.
