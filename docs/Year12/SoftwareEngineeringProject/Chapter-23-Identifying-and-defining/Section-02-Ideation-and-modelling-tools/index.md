# 23.2 Ideation and modelling tools

## Why it matters

!!! builds-on "Builds on"
    This section builds on [23.1 Requirements and feasibility](../Section-01-Requirements-and-feasibility/index.md).


Before writing a single line of code, software engineers need to explore ideas, understand data requirements, and model solutions. Ideation and modelling tools help transform abstract problems into concrete, implementable designs. These tools bridge the gap between initial requirements and technical implementation, ensuring that development efforts are focused and well-planned.

## Concepts

### Brainstorming and idea generation

Brainstorming is a creative process where teams generate multiple potential solutions without immediate judgement. The goal is quantity over quality initially, encouraging wild ideas that can later be refined.

Key principles for effective brainstorming:

- **Defer judgement**: Accept all ideas without criticism during the generation phase

- **Strive for quantity**: Generate as many ideas as possible

- **Build on ideas**: Use others' suggestions as springboards for new concepts

- **Stay focused**: Keep the session directed toward the specific problem

/// tab | Example Session
**Problem**: Students struggle to track assignment deadlines

**Brainstormed solutions**:

- Calendar integration app

- Email reminder system

- Physical notice board with QR codes

- Peer reminder network

- AI chatbot that nags students

- Gamified deadline tracker with rewards
///

/// tab | Python Tool

```py

## Simple brainstorming session tracker

ideas = []

def add_idea(idea, contributor="Anonymous"):
    ideas.append({"idea": idea, "contributor": contributor})
    print(f"Added: {idea}")

def show_all_ideas():
    for i, item in enumerate(ideas, 1):
        print(f"{i}. {item['idea']} (by {item['contributor']})")

## Example usage

add_idea("Mobile app with push notifications", "Sarah")
add_idea("Integration with existing school systems", "Mike")
show_all_ideas()
```
///

### Mind-mapping for visual thinking

Mind-maps create visual representations of related concepts, branching out from a central topic. They help explore connections between ideas and identify relationships that might not be obvious in linear thinking.

Benefits of mind-mapping:

- **Visual structure**: Shows relationships between concepts clearly

- **Non-linear exploration**: Allows ideas to develop in any direction

- **Memory aid**: Visual format helps with recall and understanding

- **Collaborative tool**: Multiple people can contribute to the same map

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

!define RECTANGLE class

RECTANGLE "Student Assignment Tracker" {
}

RECTANGLE "User Interface" {
  - Mobile app
  - Web dashboard
  - Email notifications
}

RECTANGLE "Data Storage" {
  - Assignment details
  - Due dates
  - Progress tracking
}

RECTANGLE "Integration" {
  - School LMS
  - Calendar apps
  - Email systems
}

RECTANGLE "Features" {
  - Deadline alerts
  - Progress visualisation
  - Collaboration tools
}

"Student Assignment Tracker" --> "User Interface"
"Student Assignment Tracker" --> "Data Storage"
"Student Assignment Tracker" --> "Integration"
"Student Assignment Tracker" --> "Features"
@enduml
```

### Storyboards for user experience

Storyboards visualise how users will interact with a system over time. They show the sequence of actions and help identify potential usability issues before development begins.

A typical storyboard includes:

- **User context**: Who is using the system and why

- **Sequence of actions**: Step-by-step user journey

- **Emotional responses**: How users feel at each stage

- **Pain points**: Where problems might occur

/// tab | Storyboard Example
**User**: High school student with multiple assignments

**Scenario**: Using assignment tracker app

1. **Morning**: Student wakes up, checks phone

   - App shows: "History essay due in 2 days!"

   - Feeling: Slight anxiety but prepared

2. **During lunch**: Student updates progress

   - App input: "Completed research phase"

   - Feeling: Accomplished, on track

3. **Evening**: Student plans tomorrow

   - App shows: "2 hours needed to finish essay"

   - Feeling: Confident, organised
///

/// tab | Python Simulation

```py
class StoryboardStep:
    def \_\_init\_\_(self, time, action, user_feeling):
        self.time = time
        self.action = action
        self.user_feeling = user_feeling
    
    def display(self):
        print(f"{self.time}: {self.action}")
        print(f"  User feels: {self.user_feeling}")

## Create storyboard sequence

steps = [
    StoryboardStep("7:00 AM", "Check assignment status", "Informed"),
    StoryboardStep("12:30 PM", "Update progress", "Accomplished"),
    StoryboardStep("8:00 PM", "Plan tomorrow's work", "Organised")
]

for step in steps:
    step.display()
    print()
```
///

### Data dictionaries and type selection

Data dictionaries document the structure and meaning of data in a system. They specify what information needs to be stored, what format it should take, and how different data elements relate to each other.

Essential elements of a data dictionary:

- **Field names**: Clear, descriptive identifiers

- **Data types**: String, integer, boolean, date, etc.

- **Constraints**: Required fields, length limits, valid ranges

- **Relationships**: How data connects between different parts of the system

/// tab | Assignment Tracker Data
| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| assignment_id | Integer | Yes | Unique identifier |
| title | String(200) | Yes | Assignment name |
| subject | String(50) | Yes | Course/subject code |
| due_date | Date | Yes | Submission deadline |
| priority | Integer(1-5) | No | Importance level |
| completed | Boolean | Yes | Completion status |
| progress_notes | Text | No | Student comments |
///

/// tab | Python Implementation

```py
from datetime import date
from dataclasses import dataclass
from typing import Optional

@dataclass
class Assignment:
    assignment_id: int
    title: str
    subject: str
    due_date: date
    completed: bool = False
    priority: Optional[int] = None
    progress_notes: Optional[str] = None
    
    def days_until_due(self):
        return (self.due_date - date.today()).days
    
    def is_overdue(self):
        return date.today() > self.due_date and not self.completed

## Example usage

math_assignment = Assignment(
    assignment_id=1,
    title="Calculus Problem Set 5",
    subject="MATH",
    due_date=date(2025, 9, 25),
    priority=4
)

print(f"Days until due: {math_assignment.days_until_due()}")
```
///

## Practice

### Exercise 1: Brainstorming session

/// details | Exercise 1: Creative Problem Solving
    type: question
    open: false

**Scenario**: A local library wants to encourage more young people to visit and use their services.

**Task**: Conduct a 10-minute brainstorming session to generate potential solutions.

1. Set a timer for 10 minutes

2. Write down every idea that comes to mind, no matter how unusual

3. Don't evaluate ideas during generation

4. Aim for at least 15 different suggestions

**Categories to consider**:

- Technology solutions

- Event and programming ideas

- Physical space improvements

- Partnership opportunities

/// details | Sample Solution
    type: success
    open: false

**Technology Solutions**:

- VR gaming stations

- Coding workshops

- 3D printing services

- Digital art creation tools

**Events and Programming**:

- Teen book clubs

- Study groups with snacks

- Author meet-and-greets

- Quiz nights with prizes

**Physical Space**:

- Comfortable lounge areas

- Group study rooms

- Café-style workspace

- Quiet pods with charging stations

**Partnerships**:

- Local schools for homework help

- Gaming communities

- Art and music groups

- Mental health organisations
///
///

### Exercise 2: Mind-mapping practice

/// details | Exercise 2: Visual Concept Mapping
    type: question
    open: false

**Scenario**: You're designing a mobile app for tracking personal fitness goals.

**Task**: Create a mind-map exploring all aspects of the fitness app concept.

1. Start with "Fitness Tracker App" in the centre

2. Create main branches for: Features, Users, Data, Technology, Challenges

3. Add sub-branches under each main category

4. Look for connections between different branches

**Questions to explore**:

- What types of fitness activities should be tracked?

- Who are the different user types?

- What data needs to be collected and stored?

- How will users interact with the app?

/// details | Sample Solution
    type: success
    open: false

**Main branches and sub-concepts**:

**Features Branch**:

- Activity logging (running, cycling, weights)

- Goal setting and progress tracking

- Social sharing and challenges

- Coaching and guidance

**Users Branch**:

- Beginners needing motivation

- Serious athletes tracking performance

- Older adults focused on health

- People recovering from injuries

**Data Branch**:

- Exercise types and duration

- Heart rate and calories

- Progress photos and measurements

- Sleep and nutrition information

**Technology Branch**:

- Mobile app (iOS/Android)

- Wearable device integration

- Cloud data synchronisation

- AI-powered insights

**Challenges Branch**:

- User motivation and retention

- Data privacy and security

- Battery life on devices

- Accuracy of measurements
///
///

### Exercise 3: Data dictionary design

/// details | Exercise 3: Structured Data Planning
    type: question
    open: false

**Scenario**: A school canteen wants to digitise their ordering system to reduce queues and improve service.

**Task**: Create a data dictionary for the core entities in this system.

**Consider these entities**:

- Students (who place orders)

- Menu items (what can be ordered)

- Orders (student purchases)

- Payments (transaction records)

**For each entity, define**:

- At least 5 relevant fields

- Appropriate data types

- Required vs optional fields

- Any constraints or validation rules

/// details | Sample Solution
    type: success
    open: false

**Student Entity**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| student_id | Integer | Yes | Unique identifier |
| first_name | String(50) | Yes | Student's first name |
| last_name | String(50) | Yes | Student's surname |
| year_level | Integer | Yes | 7-12 only |
| dietary_restrictions | String(200) | No | Allergies, preferences |

**Menu Item Entity**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| item_id | Integer | Yes | Unique identifier |
| name | String(100) | Yes | Item name |
| category | String(50) | Yes | Main, snack, drink |
| price | Decimal(5,2) | Yes | Cost in dollars |
| available | Boolean | Yes | Currently in stock |
| ingredients | Text | No | For allergy checking |

**Order Entity**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| order_id | Integer | Yes | Unique identifier |
| student_id | Integer | Yes | Links to student |
| order_time | DateTime | Yes | When order placed |
| total_amount | Decimal(6,2) | Yes | Total cost |
| status | String(20) | Yes | Pending/ready/collected |
| special_requests | String(500) | No | Custom instructions |
///
///

## Recap

Ideation and modelling tools are essential for translating problems into implementable solutions. **Brainstorming** generates creative options without premature filtering. **Mind-mapping** visualises relationships between concepts and helps explore connections. **Storyboards** capture user experiences and identify potential issues before development. **Data dictionaries** define the structure and constraints of information that systems need to handle.

These tools work best when used together: brainstorming generates possibilities, mind-mapping organises them, storyboards show how they work in practice, and data dictionaries specify the technical requirements. The investment in planning with these tools reduces development time and improves the quality of the final solution.
