# 24.1 Waterfall approach

**Outcomes**: SE-12-06

## Learning objectives

By the end of this section, you will be able to:

- Identify the distinct phases of the Waterfall software development methodology

- Describe the key artefacts produced in each Waterfall phase

- Analyse the risks and benefits of using Waterfall for different project types

- Evaluate when Waterfall is most appropriate versus other development approaches

- Create phase-gate documentation and review processes for Waterfall projects

---

## Understanding the Waterfall methodology

The Waterfall model is a sequential software development approach where progress flows steadily downward through distinct phases, like a waterfall. Each phase must be completed before the next begins, with formal reviews and approvals at each stage gate.

**Core principles of Waterfall:**

- **Sequential progression**: Phases follow a linear order with minimal overlap

- **Phase completion**: Each phase must be fully completed before proceeding

- **Documentation emphasis**: Comprehensive documentation at each phase

- **Change control**: Formal processes for managing changes once phases are complete

- **Predictable timeline**: Clear milestones and deliverables for project planning

### The Waterfall phases

The traditional Waterfall model consists of six distinct phases, each with specific objectives, activities, and deliverables.

```kroki-plantuml
@startuml
!theme plain
skinparam monochrome true
skinparam shadowing false

rectangle "Requirements Analysis" as req
note right of req : Gather and document\nall system requirements

rectangle "System Design" as design
note right of design : Create system architecture\nand detailed design

rectangle "Implementation" as impl
note right of impl : Write code based on\ndesign specifications

rectangle "Testing" as test
note right of test : Verify system meets\nall requirements

rectangle "Deployment" as deploy
note right of deploy : Install system in\nproduction environment

rectangle "Maintenance" as maint
note right of maint : Ongoing support\nand enhancements

req --> design
design --> impl
impl --> test
test --> deploy
deploy --> maint

note bottom : Each phase has formal review\nand approval before progression
@enduml

```

#### Phase 1: Requirements Analysis

**Objective**: Gather, document, and validate all functional and non-functional requirements for the system.

**Key activities:**

- Stakeholder interviews and workshops

- Business process analysis

- Requirements documentation

- Requirements validation and sign-off

**Artefacts produced:**

- Requirements Specification Document (RSD)

- User acceptance criteria

- System constraints and assumptions

- Requirements traceability matrix

```python-template
class WaterfallRequirementsPhase:
    """
    Framework for managing the Requirements Analysis phase in Waterfall methodology.
    Focuses on comprehensive documentation and stakeholder approval.
    """
    
    def __init__(self, project_name):
        self.project_name = project_name
        self.requirements = []
        self.stakeholders = []
        self.acceptance_criteria = {}
        self.phase_status = "Not Started"
        self.approval_signatures = {}
    
    def add_requirement(self, req_id, description, type_category, priority, source):
        """
        Document a system requirement with full traceability.
        
        Args:
            req_id: Unique requirement identifier (e.g., REQ-001)
            description: Clear, unambiguous requirement description
            type_category: Functional, Non-functional, or Constraint
            priority: Critical, High, Medium, or Low
            source: Stakeholder or document source of requirement
        """
        requirement = {
            'id': req_id,
            'description': description,
            'type': type_category,
            'priority': priority,
            'source': source,
            'status': 'Draft',
            'approval_date': None,
            'test_cases': []
        }
        self.requirements.append(requirement)
    
    def add_acceptance_criterion(self, req_id, criterion_description):
        """
        Add acceptance criteria for a specific requirement.
        
        Args:
            req_id: Requirement this criterion applies to
            criterion_description: Specific, testable criterion
        """
        if req_id not in self.acceptance_criteria:
            self.acceptance_criteria[req_id] = []
        self.acceptance_criteria[req_id].append(criterion_description)
    
    def conduct_requirements_review(self, reviewer, requirements_approved):
        """
        Formal review process for requirements approval.
        
        Args:
            reviewer: Name/role of person conducting review
            requirements_approved: List of requirement IDs approved
        """
        for req_id in requirements_approved:
            # Find and approve the requirement
            for req in self.requirements:
                if req['id'] == req_id:
                    req['status'] = 'Approved'
                    req['approval_date'] = '2025-09-20'  # In practice, use current date
        
        self.approval_signatures[reviewer] = {
            'date': '2025-09-20',
            'approved_requirements': requirements_approved
        }
    
    def generate_requirements_specification(self):
        """
        Generate formal Requirements Specification Document.
        Critical Waterfall artefact for next phase.
        """
        rsd = f"""
REQUIREMENTS SPECIFICATION DOCUMENT
Project: {self.project_name}
Version: 1.0
Date: 2025-09-20

1. INTRODUCTION
This document specifies the functional and non-functional requirements 
for {self.project_name}.

2. FUNCTIONAL REQUIREMENTS
"""
        
        functional_reqs = [r for r in self.requirements if r['type'] == 'Functional']
        for req in functional_reqs:
            rsd += f"\n{req['id']}: {req['description']}\n"
            rsd += f"Priority: {req['priority']}\n"
            rsd += f"Source: {req['source']}\n"
            
            if req['id'] in self.acceptance_criteria:
                rsd += "Acceptance Criteria:\n"
                for criterion in self.acceptance_criteria[req['id']]:
                    rsd += f"  - {criterion}\n"
            rsd += "\n"
        
        rsd += "\n3. NON-FUNCTIONAL REQUIREMENTS\n"
        non_functional_reqs = [r for r in self.requirements if r['type'] == 'Non-functional']
        for req in non_functional_reqs:
            rsd += f"\n{req['id']}: {req['description']}\n"
            rsd += f"Priority: {req['priority']}\n"
        
        rsd += "\n4. APPROVAL SIGNATURES\n"
        for reviewer, details in self.approval_signatures.items():
            rsd += f"{reviewer}: Approved on {details['date']}\n"
        
        return rsd
    
    def check_phase_completion(self):
        """
        Verify all requirements are approved before proceeding to design phase.
        Critical Waterfall gate-keeping function.
        """
        total_requirements = len(self.requirements)
        approved_requirements = len([r for r in self.requirements if r['status'] == 'Approved'])
        
        completion_status = {
            'total_requirements': total_requirements,
            'approved_requirements': approved_requirements,
            'completion_percentage': (approved_requirements / total_requirements) * 100 if total_requirements > 0 else 0,
            'ready_for_next_phase': approved_requirements == total_requirements and len(self.approval_signatures) >= 2
        }
        
        return completion_status

def demonstrate_requirements_phase():
    """
    Practical example of Waterfall Requirements Analysis phase.
    Shows comprehensive documentation and approval process.
    """
    print("WATERFALL REQUIREMENTS PHASE EXAMPLE")
    print("=" * 38)
    
    # Initialize requirements phase for school management system
    req_phase = WaterfallRequirementsPhase("School Management System")
    
    # Document functional requirements
    req_phase.add_requirement(
        "REQ-001",
        "System shall authenticate users via username and password",
        "Functional",
        "Critical",
        "School Administration"
    )
    
    req_phase.add_requirement(
        "REQ-002", 
        "Teachers shall be able to enter grades for students in their classes",
        "Functional",
        "High",
        "Teacher Stakeholder Group"
    )
    
    req_phase.add_requirement(
        "REQ-003",
        "Students shall be able to view their current grades and attendance",
        "Functional", 
        "High",
        "Student Representative"
    )
    
    # Document non-functional requirements
    req_phase.add_requirement(
        "REQ-004",
        "System shall respond to user requests within 2 seconds under normal load",
        "Non-functional",
        "Medium",
        "IT Department"
    )
    
    req_phase.add_requirement(
        "REQ-005",
        "System shall be available 99.5% of time during school hours",
        "Non-functional",
        "High", 
        "School Administration"
    )
    
    # Add acceptance criteria
    req_phase.add_acceptance_criterion(
        "REQ-001",
        "Failed login attempts are logged and limited to 3 per account per 15 minutes"
    )
    
    req_phase.add_acceptance_criterion(
        "REQ-002",
        "Grade changes are logged with timestamp and teacher identification"
    )
    
    req_phase.add_acceptance_criterion(
        "REQ-003", 
        "Students can only access their own academic records"
    )
    
    # Conduct formal review and approval
    req_phase.conduct_requirements_review(
        "Project Manager", 
        ["REQ-001", "REQ-002", "REQ-003", "REQ-004", "REQ-005"]
    )
    
    req_phase.conduct_requirements_review(
        "Business Analyst",
        ["REQ-001", "REQ-002", "REQ-003", "REQ-004", "REQ-005"]
    )
    
    # Check phase completion
    completion = req_phase.check_phase_completion()
    
    print(f"Requirements Analysis Phase Status:")
    print(f"Total Requirements: {completion['total_requirements']}")
    print(f"Approved Requirements: {completion['approved_requirements']}")
    print(f"Completion: {completion['completion_percentage']:.1f}%")
    print(f"Ready for Design Phase: {completion['ready_for_next_phase']}")
    
    if completion['ready_for_next_phase']:
        print("\n✅ Requirements phase complete - proceed to System Design")
    else:
        print("\n❌ Requirements phase incomplete - address approvals before proceeding")
    
    return req_phase

# Run demonstration
if __name__ == "__main__":
    requirements_demo = demonstrate_requirements_phase()

```

#### Phase 2: System Design

**Objective**: Transform requirements into detailed technical specifications and system architecture.

**Key activities:**

- System architecture design

- Database design and data modeling

- User interface design and wireframes

- Technical specification documentation

**Artefacts produced:**

- System Architecture Document (SAD)

- Database design specifications

- User interface mockups and wireframes

- Technical design specifications

- Design review reports

#### Phase 3: Implementation (Development)

**Objective**: Code the system according to design specifications with minimal deviation from approved plans.

**Key activities:**

- Code development following design specifications

- Unit testing during development

- Code reviews and quality assurance

- Documentation of code and modules

**Artefacts produced:**

- Source code with comprehensive comments

- Unit test results and coverage reports

- Code review documentation

- Technical documentation for modules

- Build and deployment scripts

---

## Key Waterfall artefacts

Waterfall methodology emphasizes comprehensive documentation at each phase. These artefacts serve as formal contracts between phases and provide traceability throughout the project lifecycle.

### Requirements phase artefacts

**Requirements Specification Document (RSD)**

- Comprehensive listing of all functional and non-functional requirements

- Acceptance criteria for each requirement

- Requirements priority and traceability matrix

- Stakeholder approval signatures

**Business Analysis Document**

- Current state analysis and gap identification

- Business process maps and workflows

- Cost-benefit analysis and ROI projections

- Risk assessment and mitigation strategies

### Design phase artefacts

**System Architecture Document (SAD)**

- High-level system architecture and component relationships

- Technology stack and platform decisions

- Integration points and external dependencies

- Performance and scalability considerations

**Database Design Specification**

- Entity-relationship diagrams (ERDs)

- Table structures with field definitions

- Index strategy and performance optimization

- Data migration and backup procedures

### Implementation phase artefacts

**Source Code Documentation**

- Well-commented code following coding standards

- API documentation and interface specifications

- Module and component documentation

- Build configuration and deployment guides

**Testing Documentation**

- Unit test cases and test results

- Integration test plans and results

- Test coverage reports and analysis

- Defect tracking and resolution logs

---

## Risks and benefits of Waterfall

Understanding when Waterfall is appropriate requires careful analysis of project characteristics, stakeholder needs, and organizational context.

### Benefits of Waterfall methodology

**Clear structure and predictability**

- Well-defined phases with specific deliverables and milestones

- Predictable timelines and resource requirements for project planning

- Clear roles and responsibilities at each phase

- Comprehensive documentation provides project transparency

**Comprehensive documentation**

- Detailed requirements capture reduces ambiguity and misunderstandings

- Design specifications provide clear implementation guidance

- Documentation serves as knowledge base for maintenance and future enhancements

- Audit trail for compliance and regulatory requirements

**Quality through formal reviews**

- Phase-gate reviews ensure quality before progression

- Formal approval processes reduce risk of scope creep

- Systematic testing approach verifies all requirements are met

- Early defect detection through structured review processes

```python-template
class WaterfallBenefitsAnalysis:
    """
    Framework for evaluating the benefits of Waterfall methodology
    for specific project contexts and organizational needs.
    """
    
    def __init__(self, project_name):
        self.project_name = project_name
        self.project_characteristics = {}
        self.organizational_factors = {}
        self.benefit_ratings = {}
    
    def assess_project_characteristics(self, requirements_stability, timeline_pressure, 
                                     complexity_level, regulatory_requirements):
        """
        Evaluate project characteristics that influence Waterfall suitability.
        
        Args:
            requirements_stability: High/Medium/Low - how stable are requirements
            timeline_pressure: High/Medium/Low - pressure for quick delivery
            complexity_level: High/Medium/Low - technical and business complexity
            regulatory_requirements: High/Medium/Low - compliance and audit needs
        """
        self.project_characteristics = {
            'requirements_stability': requirements_stability,
            'timeline_pressure': timeline_pressure,
            'complexity_level': complexity_level,
            'regulatory_requirements': regulatory_requirements
        }
    
    def assess_organizational_factors(self, team_experience, client_involvement, 
                                    documentation_culture, change_tolerance):
        """
        Evaluate organizational factors that affect Waterfall success.
        
        Args:
            team_experience: High/Medium/Low - team's Waterfall experience
            client_involvement: High/Medium/Low - client availability for reviews
            documentation_culture: High/Medium/Low - organization values documentation
            change_tolerance: High/Medium/Low - tolerance for late-stage changes
        """
        self.organizational_factors = {
            'team_experience': team_experience,
            'client_involvement': client_involvement,
            'documentation_culture': documentation_culture,
            'change_tolerance': change_tolerance
        }
    
    def calculate_waterfall_suitability(self):
        """
        Calculate overall suitability score for Waterfall methodology.
        Returns score from 0-100 and recommendation.
        """
        # Scoring weights for different factors
        characteristic_weights = {
            'requirements_stability': 25,
            'regulatory_requirements': 20,
            'complexity_level': 15,
            'timeline_pressure': 10
        }
        
        organizational_weights = {
            'documentation_culture': 15,
            'team_experience': 10,
            'client_involvement': 5
        }
        
        # Convert ratings to scores (High=3, Medium=2, Low=1)
        rating_values = {'High': 3, 'Medium': 2, 'Low': 1}
        
        total_score = 0
        max_possible = 0
        
        # Calculate project characteristics score
        for factor, weight in characteristic_weights.items():
            if factor in self.project_characteristics:
                # For timeline_pressure, lower is better for Waterfall
                if factor == 'timeline_pressure':
                    score = 4 - rating_values[self.project_characteristics[factor]]
                else:
                    score = rating_values[self.project_characteristics[factor]]
                total_score += score * weight
            max_possible += 3 * weight
        
        # Calculate organizational factors score
        for factor, weight in organizational_weights.items():
            if factor in self.organizational_factors:
                # For change_tolerance, lower is better for Waterfall
                if factor == 'change_tolerance':
                    score = 4 - rating_values[self.organizational_factors[factor]]
                else:
                    score = rating_values[self.organizational_factors[factor]]
                total_score += score * weight
            max_possible += 3 * weight
        
        # Convert to percentage
        suitability_percentage = (total_score / max_possible) * 100 if max_possible > 0 else 0
        
        # Generate recommendation
        if suitability_percentage >= 80:
            recommendation = "Highly Suitable - Waterfall strongly recommended"
        elif suitability_percentage >= 65:
            recommendation = "Suitable - Waterfall appropriate with careful planning"
        elif suitability_percentage >= 50:
            recommendation = "Moderately Suitable - Consider hybrid approach"
        else:
            recommendation = "Not Suitable - Consider Agile or other methodologies"
        
        return {
            'suitability_score': suitability_percentage,
            'recommendation': recommendation,
            'key_benefits': self._identify_key_benefits(),
            'potential_risks': self._identify_potential_risks()
        }
    
    def _identify_key_benefits(self):
        """Identify the primary benefits for this specific project context."""
        benefits = []
        
        if self.project_characteristics.get('requirements_stability') == 'High':
            benefits.append("Stable requirements allow comprehensive upfront planning")
        
        if self.project_characteristics.get('regulatory_requirements') == 'High':
            benefits.append("Comprehensive documentation supports compliance needs")
        
        if self.organizational_factors.get('documentation_culture') == 'High':
            benefits.append("Organization values and can maintain comprehensive documentation")
        
        if self.project_characteristics.get('complexity_level') == 'High':
            benefits.append("Structured approach helps manage complexity systematically")
        
        return benefits
    
    def _identify_potential_risks(self):
        """Identify the primary risks for this specific project context."""
        risks = []
        
        if self.project_characteristics.get('timeline_pressure') == 'High':
            risks.append("Sequential phases may delay delivery under time pressure")
        
        if self.project_characteristics.get('requirements_stability') == 'Low':
            risks.append("Requirements changes will be expensive and disruptive")
        
        if self.organizational_factors.get('client_involvement') == 'Low':
            risks.append("Limited client feedback may lead to misaligned solution")
        
        if self.organizational_factors.get('team_experience') == 'Low':
            risks.append("Team inexperience with Waterfall may impact execution quality")
        
        return risks

def demonstrate_waterfall_suitability():
    """
    Practical example of evaluating Waterfall suitability for different project types.
    """
    print("WATERFALL SUITABILITY ANALYSIS")
    print("=" * 32)
    
    # Example 1: Government compliance system
    gov_project = WaterfallBenefitsAnalysis("Government Compliance System")
    gov_project.assess_project_characteristics(
        requirements_stability="High",
        timeline_pressure="Low", 
        complexity_level="High",
        regulatory_requirements="High"
    )
    gov_project.assess_organizational_factors(
        team_experience="High",
        client_involvement="Medium",
        documentation_culture="High",
        change_tolerance="Low"
    )
    
    gov_analysis = gov_project.calculate_waterfall_suitability()
    
    print("PROJECT: Government Compliance System")
    print(f"Suitability Score: {gov_analysis['suitability_score']:.1f}%")
    print(f"Recommendation: {gov_analysis['recommendation']}")
    print("Key Benefits:")
    for benefit in gov_analysis['key_benefits']:
        print(f"  • {benefit}")
    print()
    
    # Example 2: Startup mobile app
    startup_project = WaterfallBenefitsAnalysis("Startup Mobile App")
    startup_project.assess_project_characteristics(
        requirements_stability="Low",
        timeline_pressure="High",
        complexity_level="Medium", 
        regulatory_requirements="Low"
    )
    startup_project.assess_organizational_factors(
        team_experience="Low",
        client_involvement="High",
        documentation_culture="Low",
        change_tolerance="High"
    )
    
    startup_analysis = startup_project.calculate_waterfall_suitability()
    
    print("PROJECT: Startup Mobile App")
    print(f"Suitability Score: {startup_analysis['suitability_score']:.1f}%")
    print(f"Recommendation: {startup_analysis['recommendation']}")
    print("Potential Risks:")
    for risk in startup_analysis['potential_risks']:
        print(f"  • {risk}")
    
    return [gov_project, startup_project]

# Run demonstration
if __name__ == "__main__":
    suitability_examples = demonstrate_waterfall_suitability()

```

### Risks and challenges of Waterfall

**Limited flexibility for changes**

- Requirements changes late in the process are expensive and disruptive

- Sequential nature makes it difficult to incorporate new insights

- Client feedback is limited until late in the development cycle

- Market conditions may change during long development cycles

**Late integration and testing**

- Problems are often discovered late in the process when they're expensive to fix

- Integration issues may not surface until system testing phase

- User acceptance testing happens at the end, risking major rework

- Limited opportunity for early validation of assumptions

**Resource and timeline risks**

- Phase delays have cascading effects on the entire project timeline

- Resource planning becomes difficult if earlier phases overrun

- All-or-nothing delivery approach increases project failure risk

- Long feedback cycles can lead to solutions that don't meet current needs

### When to use Waterfall

Waterfall methodology is most appropriate for projects with specific characteristics:

**Ideal Waterfall project characteristics:**

1. **Stable, well-understood requirements**: Requirements are unlikely to change significantly during development

2. **Regulatory or compliance requirements**: Need for comprehensive documentation and audit trails

3. **Experienced team**: Team has strong experience with the technology and domain

4. **Clear project scope**: Project boundaries and deliverables are well-defined

5. **Predictable technology**: Using mature, stable technologies with known capabilities

6. **Risk-averse environment**: Organization values predictability over speed

**Projects where Waterfall may not be suitable:**

1. **Innovative or experimental projects**: High uncertainty about requirements or technical approach

2. **Rapidly changing market conditions**: Requirements likely to evolve based on market feedback

3. **User-facing applications**: Need for early and frequent user feedback

4. **Tight deadlines**: Need for quick delivery or early value realization

5. **Small teams or projects**: Overhead of documentation may outweigh benefits

---

## Practice tasks

### Task 1: Waterfall phase planning

Choose a software project idea (different from Section 23.1 if possible) and create a detailed Waterfall project plan:

1. **Phase breakdown**: Define the six Waterfall phases for your project with specific durations and milestones

2. **Artefact identification**: List the key artefacts that will be produced in each phase

3. **Review and approval process**: Design the review checkpoints and approval criteria for each phase gate

4. **Risk assessment**: Identify potential risks in each phase and mitigation strategies

**Expected outcome**: A comprehensive Waterfall project plan with clear phase gates and deliverables.

### Task 2: Requirements phase execution

Using the `WaterfallRequirementsPhase` class, complete a full requirements analysis:

1. **Requirements gathering**: Document at least 8 requirements (functional and non-functional) for your chosen project

2. **Acceptance criteria**: Define specific, testable acceptance criteria for each requirement

3. **Stakeholder approval**: Simulate the review and approval process with multiple stakeholder roles

4. **Phase completion verification**: Use the completion check to ensure readiness for the design phase

**Expected outcome**: A completed Requirements Specification Document with stakeholder approvals.

### Task 3: Waterfall suitability analysis

Evaluate Waterfall methodology for three different project scenarios:

1. **Traditional enterprise system**: Large-scale system with well-defined requirements

2. **Innovative startup product**: New product with uncertain market requirements

3. **Government infrastructure project**: High-security system with strict compliance requirements

For each project, use the `WaterfallBenefitsAnalysis` class to:

- Assess project characteristics and organizational factors

- Calculate suitability scores and recommendations

- Identify key benefits and risks for each scenario

- Justify your methodology recommendation

**Expected outcome**: Three detailed suitability analyses with clear recommendations and justifications.

/// details | Sample solution framework
    type: info

Here's a framework for completing the practice tasks:

```python-exec
# Task completion template
def complete_waterfall_analysis(project_name, project_type):
    """Template for comprehensive Waterfall methodology analysis."""
    
    # Task 1: Phase Planning
    phases = {
        'Requirements': {'duration': '4 weeks', 'key_artefacts': ['RSD', 'Acceptance Criteria']},
        'Design': {'duration': '6 weeks', 'key_artefacts': ['SAD', 'Database Design']},
        'Implementation': {'duration': '12 weeks', 'key_artefacts': ['Source Code', 'Unit Tests']},
        'Testing': {'duration': '4 weeks', 'key_artefacts': ['Test Plans', 'Test Results']},
        'Deployment': {'duration': '2 weeks', 'key_artefacts': ['Deployment Guide', 'User Manual']},
        'Maintenance': {'duration': 'Ongoing', 'key_artefacts': ['Support Procedures', 'Change Log']}
    }
    
    # Task 2: Requirements Phase
    req_phase = WaterfallRequirementsPhase(project_name)
    # Add your requirements, criteria, and approvals here...
    
    # Task 3: Suitability Analysis
    suitability = WaterfallBenefitsAnalysis(project_name)
    # Assess characteristics and factors here...
    
    return {
        'phase_plan': phases,
        'requirements': req_phase,
        'suitability': suitability
    }

```

Use this template to structure your analysis and ensure comprehensive coverage of all Waterfall aspects.
///

---

## Key takeaways

This section explored the Waterfall methodology as a sequential software development approach:

**Waterfall Structure:**

- **Sequential phases**: Requirements → Design → Implementation → Testing → Deployment → Maintenance

- **Phase gates**: Formal reviews and approvals required before progression to next phase

- **Comprehensive documentation**: Detailed artefacts produced at each phase for traceability

- **Change control**: Formal processes for managing changes once phases are approved

**Key Artefacts:**

- **Requirements Specification Document (RSD)**: Comprehensive requirements with acceptance criteria

- **System Architecture Document (SAD)**: Technical design and system specifications

- **Source code documentation**: Well-commented code with comprehensive technical documentation

- **Test documentation**: Complete test plans, results, and defect tracking

**Suitability Assessment:**

- **Ideal for**: Stable requirements, regulatory compliance, experienced teams, predictable technology

- **Challenges with**: Changing requirements, tight deadlines, innovative projects, user-facing applications

- **Risk management**: Early planning reduces later risks but limits flexibility for changes

**Next Steps**: In Section 24.2, we'll explore the Agile methodology and how it addresses some of Waterfall's limitations through iterative development and continuous feedback.
