---
title: "24.6 Quality assurance"
---

# 24.6 Quality assurance

## Why it matters

Quality assurance (QA) is the systematic process of ensuring software engineering solutions meet defined standards and requirements. It prevents defects, reduces costs, and builds stakeholder confidence. Without proper QA processes, projects face increased risks of failure, security vulnerabilities, and user dissatisfaction.

## Concepts

### Quality criteria and standards

Quality assurance begins with clearly defined criteria for judging software quality:

**Correctness**: The software performs its intended functions accurately and produces expected outputs. This includes functional correctness (features work as specified) and logical correctness (algorithms and business rules are implemented correctly).

**Usability**: The software is intuitive, accessible, and provides a positive user experience. This encompasses user interface design, navigation flow, accessibility for users with disabilities, and overall user satisfaction.

**Performance**: The software operates efficiently within acceptable response times, memory usage, and throughput requirements. Performance criteria often include load handling, scalability, and resource consumption.

**Security**: The software protects data and systems from unauthorized access, manipulation, or destruction. Security criteria cover authentication, authorization, data encryption, input validation, and vulnerability management.

```python
# Example: Quality criteria checklist for a student management system
quality_criteria = {
    "correctness": [
        "Grade calculations are mathematically accurate",
        "Student records are stored and retrieved correctly",
        "Attendance tracking functions as specified"
    ],
    "usability": [
        "Teachers can navigate between functions in under 3 clicks",
        "Screen readers can access all interface elements",
        "Error messages are clear and actionable"
    ],
    "performance": [
        "System responds to queries within 2 seconds",
        "Can handle 500 concurrent users",
        "Database queries complete within acceptable timeframes"
    ],
    "security": [
        "User passwords are encrypted and stored securely",
        "Only authorized staff can access student records",
        "Data transmission is encrypted"
    ]
}

def assess_quality(system, criteria):
    """Evaluate system against defined quality criteria"""
    results = {}
    for category, requirements in criteria.items():
        results[category] = []
        for requirement in requirements:
            # Test each requirement and record pass/fail
            test_result = run_quality_test(system, requirement)
            results[category].append({
                "requirement": requirement,
                "status": test_result
            })
    return results

```

### Continual checking processes

Quality assurance requires ongoing verification that requirements are being met throughout the development lifecycle:

**Reviews and inspections**: Regular examination of code, documentation, and design artifacts by peers and stakeholders. Code reviews identify bugs, improve maintainability, and ensure coding standards compliance.

**Testing alignment**: Quality assurance coordinates with testing activities to ensure comprehensive coverage. This includes unit tests, integration tests, system tests, and user acceptance tests.

**Acceptance criteria**: Clear, measurable conditions that define when a feature or system component is considered complete and acceptable. These criteria are established during requirements gathering and validated throughout development.

```python-template
# Example: QA process tracking system
class QAProcess:
    def __init__(self):
        self.review_checklist = []
        self.test_results = {}
        self.acceptance_criteria = {}
    
    def schedule_code_review(self, component, reviewers):
        """Schedule peer review for code component"""
        review = {
            "component": component,
            "reviewers": reviewers,
            "status": "scheduled",
            "findings": [],
            "date_scheduled": "2024-03-15"
        }
        self.review_checklist.append(review)
        return review
    
    def track_acceptance_criteria(self, feature_id, criteria_list):
        """Define and track acceptance criteria for a feature"""
        self.acceptance_criteria[feature_id] = {
            "criteria": criteria_list,
            "completed": [],
            "pending": criteria_list.copy()
        }
    
    def update_criteria_status(self, feature_id, criterion, status):
        """Update the completion status of an acceptance criterion"""
        if criterion in self.acceptance_criteria[feature_id]["pending"]:
            self.acceptance_criteria[feature_id]["pending"].remove(criterion)
            self.acceptance_criteria[feature_id]["completed"].append({
                "criterion": criterion,
                "status": status,
                "verified_date": "2024-03-16"
            })

# Example usage
qa_system = QAProcess()
qa_system.schedule_code_review("user_authentication", ["senior_dev", "security_expert"])
qa_system.track_acceptance_criteria("login_feature", [
    "User can log in with valid credentials",
    "Invalid credentials show appropriate error message",
    "Account lockout after 3 failed attempts"
])

```

### Compliance and legislative requirements

Modern software development must address various compliance and legal obligations:

**Privacy legislation**: Laws like the Privacy Act 1988 in Australia require protection of personal information. Software must implement privacy by design, obtain appropriate consent, and provide data access/deletion capabilities.

**Accessibility standards**: The Disability Discrimination Act 1992 and Web Content Accessibility Guidelines (WCAG) require software to be accessible to users with disabilities. This includes keyboard navigation, screen reader compatibility, and appropriate color contrast.

**Industry-specific regulations**: Different industries have specific compliance requirements. Healthcare software must comply with health information privacy laws, financial software must meet banking regulations, and educational software must protect student privacy.

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

!define RECTANGLE class

RECTANGLE "QA Framework" {
    +define_quality_criteria()
    +establish_review_process()
    +track_compliance()
    +generate_reports()
}

RECTANGLE "Quality Criteria" {
    -correctness_standards
    -usability_requirements
    -performance_targets
    -security_policies
}

RECTANGLE "Review Process" {
    -code_reviews
    -design_reviews
    -documentation_reviews
    -stakeholder_reviews
}

RECTANGLE "Compliance Tracking" {
    -privacy_requirements
    -accessibility_standards
    -industry_regulations
    -audit_trails
}

RECTANGLE "Testing Integration" {
    -unit_test_alignment
    -integration_test_coordination
    -acceptance_test_validation
    -performance_test_monitoring
}

"QA Framework" --> "Quality Criteria"
"QA Framework" --> "Review Process"
"QA Framework" --> "Compliance Tracking"
"QA Framework" --> "Testing Integration"

@enduml

```

### Guided example: Implementing QA for a school library system

Let's walk through implementing quality assurance for a digital library management system:

**Step 1: Define quality criteria**

```python
library_qa_criteria = {
    "correctness": {
        "Book checkout/return calculations are accurate",
        "Search results match query parameters",
        "Due date notifications are sent on schedule"
    },
    "usability": {
        "Students can find and reserve books in under 30 seconds",
        "Librarians can process returns efficiently",
        "Interface works on mobile devices"
    },
    "performance": {
        "Search queries complete within 1 second",
        "System supports 200 concurrent users",
        "Backup processes don't impact user experience"
    },
    "security": {
        "Student records are protected and private",
        "Only authorized staff can modify book records",
        "System logs all access attempts"
    }
}

```

**Step 2: Establish review checkpoints**

```python
review_schedule = [
    {"phase": "Requirements", "reviewers": ["librarian", "IT_admin", "student_rep"]},
    {"phase": "Design", "reviewers": ["senior_developer", "UX_designer"]},
    {"phase": "Implementation", "reviewers": ["peer_developer", "security_specialist"]},
    {"phase": "Testing", "reviewers": ["QA_tester", "end_users"]}
]

```

**Step 3: Compliance checklist**

```python
compliance_requirements = {
    "privacy": [
        "Student borrowing history is confidential",
        "Data retention policies are documented and followed",
        "Users can request deletion of their data"
    ],
    "accessibility": [
        "All functions available via keyboard navigation",
        "Text has sufficient color contrast (4.5:1 minimum)",
        "Images have appropriate alt text"
    ],
    "educational_standards": [
        "Student data protected according to education privacy laws",
        "Age-appropriate content filtering is implemented",
        "Audit logs maintained for administrative access"
    ]
}

```

## Practice

/// details | Exercise 1: Quality Criteria Development
    type: question
    open: false

**Scenario**: You're developing a student grade tracking application for a high school.

**Task**: Define quality criteria for the four main categories (correctness, usability, performance, security). List at least 2 specific, measurable criteria for each category.

/// details | Sample Solution
    type: success
    open: false

**Correctness**:

- Grade calculations follow school's weighted average formula accurately

- Attendance records update automatically and reflect actual student presence

**Usability**:

- Teachers can enter grades for a class of 30 students in under 5 minutes

- Parents can view their child's progress in 3 clicks or fewer

**Performance**:

- Grade reports generate within 10 seconds

- System handles 100 concurrent users during peak times (report card period)

**Security**:

- Only assigned teachers can modify grades for their classes

- All grade changes are logged with timestamp and user identification
///
///

/// details | Exercise 2: Compliance Analysis
    type: question
    open: false

**Scenario**: A medical clinic wants to develop a patient appointment booking system.

**Task**: Identify three types of compliance requirements this system would need to address and provide specific examples for each.

/// details | Sample Solution
    type: success
    open: false

**Privacy Compliance**:

- Patient health information must be encrypted and access-controlled according to health privacy laws

- Patients must consent to data collection and processing

**Accessibility Compliance**:

- System must support screen readers for visually impaired users

- Booking interface must be navigable using only keyboard controls

**Healthcare Industry Compliance**:

- Audit trails must track all access to patient records

- Data backup and recovery procedures must meet healthcare standards for continuity of care
///
///

/// details | Exercise 3: Review Process Design
    type: question
    open: false

**Scenario**: You're planning the development of an online learning platform for university students.

**Task**: Design a review process that includes at least 4 different types of reviews and specify who should be involved in each review.

/// details | Sample Solution
    type: success
    open: false

**Requirements Review**:

- Participants: Academic staff, IT support, student representatives, accessibility coordinator

- Focus: Validate learning objectives, technical feasibility, user needs

**Design Review**:

- Participants: UX designer, senior developer, accessibility specialist

- Focus: User interface design, system architecture, accessibility compliance

**Code Review**:

- Participants: Peer developers, security specialist, QA tester

- Focus: Code quality, security vulnerabilities, testing coverage

**User Acceptance Review**:

- Participants: End users (students and instructors), QA team, product manager

- Focus: Functionality validation, usability testing, acceptance criteria verification
///
///

## Recap

Quality assurance is a comprehensive approach to ensuring software engineering solutions meet defined standards and requirements. Key components include:

- **Quality criteria**: Establishing clear, measurable standards for correctness, usability, performance, and security

- **Continual checking**: Implementing ongoing review processes, testing alignment, and acceptance criteria validation

- **Compliance management**: Addressing privacy, accessibility, and industry-specific regulatory requirements

Effective QA processes reduce project risks, improve user satisfaction, and ensure legal compliance. They require coordination between development teams, stakeholders, and end users throughout the software development lifecycle.

Quality assurance is not just about finding defects—it's about preventing them through systematic processes, clear standards, and continuous validation that the software meets both technical requirements and user needs.
