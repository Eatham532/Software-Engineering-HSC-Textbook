---
title: "Section 14.2: Integrating Security into the SDLC"
---

# Section 14.2: Integrating Security into the SDLC

## Learning Objectives

By the end of this section, you will be able to:

- **Map security activities** to each phase of the software development lifecycle

- **Apply threat modeling** techniques during requirements gathering

- **Design security controls** during the architecture phase

- **Implement secure coding practices** throughout development

- **Conduct security testing** at multiple stages of development

## Why Security Must Be Built-In

Traditional approaches treat security as an afterthought—something to add after the application is built. This "bolt-on" security approach is expensive, ineffective, and often breaks existing functionality.

**Security-by-design** integrates security considerations into every phase of development, making systems inherently more secure and reducing long-term costs.

### The Cost of Late Security Integration

Consider these scenarios:

**Fixing a security flaw in production**: $7,600 average cost

- Emergency patches and hotfixes

- Potential service disruptions

- Customer trust damage

- Possible data breach response

**Preventing the same flaw during design**: $120 average cost  

- Security requirements analysis

- Secure architecture decisions

- Peer review during planning

**Cost multiplier**: 63x more expensive to fix security issues in production versus design phase.

## Security Activities by SDLC Phase

### Phase 1: Requirements & Planning

**Security Activities:**

- **Security requirements gathering**: Identify confidentiality, integrity, and availability needs

- **Threat modeling initiation**: Understand what you're protecting and who might attack it

- **Compliance analysis**: Determine regulatory requirements (GDPR, CCPA, industry standards)

- **Risk tolerance definition**: Establish acceptable risk levels for different system components

**Deliverables:**

- Security requirements document

- Initial threat model

- Risk tolerance matrix

- Compliance checklist

### Phase 2: Design & Architecture

**Security Activities:**

- **Secure architecture design**: Apply defense-in-depth principles

- **Trust boundary identification**: Map where data crosses security zones

- **Security control selection**: Choose appropriate protections for each component

- **Attack surface analysis**: Minimize exposed interfaces and entry points

**Deliverables:**

- Security architecture diagrams

- Trust boundary maps

- Security control specifications

- Attack surface documentation

### Phase 3: Implementation & Development

**Security Activities:**

- **Secure coding practices**: Follow established security guidelines

- **Code security reviews**: Peer review with security focus

- **Static analysis**: Automated scanning for common vulnerabilities

- **Security unit testing**: Test security controls as code is written

**Deliverables:**

- Secure code following established guidelines

- Security-focused code review reports

- Static analysis results and remediation

- Security unit test suite

### Phase 4: Testing & Validation

**Security Activities:**

- **Penetration testing**: Simulate real-world attacks

- **Dynamic security testing**: Test running applications for vulnerabilities

- **Security integration testing**: Verify security controls work together

- **User acceptance testing**: Ensure security doesn't break usability

**Deliverables:**

- Penetration test results

- Dynamic analysis reports

- Security test suite results

- User acceptance test outcomes

### Phase 5: Deployment & Maintenance

**Security Activities:**

- **Secure deployment configuration**: Harden production environments

- **Security monitoring setup**: Implement logging and alerting

- **Incident response preparation**: Plan for security events

- **Regular security updates**: Patch management and vulnerability monitoring

**Deliverables:**

- Hardened deployment configurations

- Security monitoring dashboards

- Incident response procedures

- Patch management schedule

## Threat Modeling Fundamentals

Threat modeling helps identify potential attacks early in development when fixes are cheapest and most effective.

### The STRIDE Framework

**S**poofing identity - Attacker pretends to be someone else
**T**ampering with data - Unauthorized modification of information  
**R**epudiation - Denying actions that were actually performed
**I**nformation disclosure - Revealing data to unauthorized parties
**D**enial of service - Making systems unavailable to legitimate users
**E**levation of privilege - Gaining higher access than intended

### Basic Threat Modeling Process

1. **Create a model** of your system architecture

2. **Identify threats** using frameworks like STRIDE

3. **Assess risk** based on likelihood and impact

4. **Define countermeasures** to mitigate identified threats

5. **Validate** that countermeasures are effective

## Guided Example: E-Learning Platform Security Integration

Let's trace security integration through the SDLC for a student portal system.

### Requirements Phase: Security Needs Analysis

**System Overview**: Online learning platform handling student grades, course materials, and personal information.

**Security Requirements Identified:**

- **Confidentiality**: Student grades and personal information must be protected

- **Integrity**: Grade data cannot be tampered with

- **Availability**: System must be accessible during business hours

- **Authentication**: Only authorized users can access their data

- **Authorization**: Students see only their own information

- **Audit**: All grade changes must be logged

### Design Phase: Security Architecture

**Trust Boundaries Identified:**

- **External users** ↔ **Web application** (authentication required)

- **Web application** ↔ **Database** (authorization controls)

- **Application** ↔ **External services** (encrypted connections)

**Security Controls Selected:**

- Multi-factor authentication for login

- Role-based access control (student, teacher, admin)

- Database encryption for sensitive data

- API rate limiting to prevent abuse

- Comprehensive audit logging

### Implementation Phase: Secure Development

**Secure Coding Practices Applied:**

```python
# Secure password handling
import bcrypt
from flask_limiter import Limiter
import logging

def hash_password(password):
    """Securely hash passwords with salt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(password, hashed):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# Input validation for grade entries
def validate_grade(grade_input):
    """Validate grade input to prevent injection"""
    try:
        grade = float(grade_input)
        if 0 <= grade <= 100:
            return grade
        else:
            raise ValueError("Grade must be between 0 and 100")
    except (ValueError, TypeError):
        logging.warning(f"Invalid grade input attempted: {grade_input}")
        raise ValueError("Invalid grade format")

# Secure database query using parameterized statements
def get_student_grades(student_id, user_id):
    """Get grades for a student with authorization check"""
    # Authorization: ensure user can only see their own grades
    if student_id != user_id and not is_teacher(user_id):
        logging.warning(f"Unauthorized grade access attempt by {user_id}")
        raise PermissionError("Access denied")
    
    query = "SELECT course, grade, date FROM grades WHERE student_id = ?"
    return database.execute(query, (student_id,))

```

### Testing Phase: Security Validation

**Security Tests Implemented:**

- **Authentication bypass testing**: Verify login protections work

- **Authorization testing**: Confirm users can't access others' data

- **Input validation testing**: Test SQL injection and XSS prevention

- **Session management testing**: Check session timeout and security

**Sample Security Test:**

```python-exec
def test_grade_access_authorization():
    """Test that students can't access other students' grades"""
    # Setup: Create two student accounts
    student1 = create_test_user("student1")
    student2 = create_test_user("student2")
    
    # Test: Student1 tries to access Student2's grades
    login_as(student1)
    response = client.get(f"/grades/{student2.id}")
    
    # Verify: Access should be denied
    assert response.status_code == 403
    assert "Access denied" in response.text
    
    # Verify: Security event should be logged
    logs = get_security_logs()
    assert f"Unauthorized grade access attempt by {student1.id}" in logs

```

### Deployment Phase: Production Security

**Security Hardening Applied:**

- HTTPS enforced for all connections

- Database access restricted to application servers only

- Security headers configured (HSTS, CSP, X-Frame-Options)

- Automated vulnerability scanning scheduled

- Security monitoring and alerting enabled

## Practice Exercises

/// details | Exercise 1: SDLC Security Mapping
    type: question
    open: false

You're developing a mobile banking application. For each SDLC phase, identify 3 specific security activities that should be performed and explain why each is important at that particular phase.

**Phases to address:**

1. Requirements & Planning

2. Design & Architecture  

3. Implementation & Development

4. Testing & Validation

5. Deployment & Maintenance

Consider the unique security challenges of mobile banking (financial data, mobile device risks, regulatory compliance).

/// details | Sample Solution
    type: success
    open: false

### Requirements & Planning

1. **Financial regulatory compliance analysis** - Banking apps must meet PCI DSS, SOX, and banking regulations from the start

2. **Mobile-specific threat modeling** - Identify risks like device theft, app tampering, and insecure storage early

3. **User authentication requirements** - Define multi-factor authentication needs based on transaction types and amounts

### Design & Architecture

1. **Secure API design** - Design banking APIs with proper authentication, encryption, and rate limiting

2. **Data classification and protection** - Architect different protection levels for account numbers vs. transaction history

3. **Offline security design** - Plan how the app secures cached data when network is unavailable

### Implementation & Development

1. **Certificate pinning implementation** - Prevent man-in-the-middle attacks on financial transactions

2. **Secure local storage** - Encrypt any data stored on the device using platform-specific secure storage

3. **Anti-tampering measures** - Implement app integrity checks to detect rooting/jailbreaking

### Testing & Validation

1. **Transaction flow security testing** - Test all financial transaction paths for vulnerabilities

2. **Device security testing** - Test app behavior on compromised devices (rooted/jailbroken)

3. **Regulatory compliance testing** - Verify all regulatory requirements are met before deployment

### Deployment & Maintenance

1. **Secure update mechanism** - Ensure app updates are signed and verified to prevent malicious updates

2. **Fraud monitoring integration** - Deploy real-time fraud detection and alerting systems

3. **Incident response procedures** - Establish procedures for handling security breaches affecting customer accounts
///
///

/// details | Exercise 2: Threat Modeling Workshop
    type: question
    open: false

Apply the STRIDE framework to threat model a simple online quiz system with the following components:

**System Components:**

- Student web interface for taking quizzes

- Teacher interface for creating and grading quizzes

- Database storing quiz questions and student answers

- Authentication system for login

**Your Task:**

1. Draw a simple system diagram showing data flows between components

2. For each component, identify at least one threat from each STRIDE category

3. Prioritize the top 5 threats based on likelihood and impact

4. Propose specific countermeasures for your top 3 threats

/// details | Sample Solution
    type: success
    open: false

### System Architecture

```
[Students] ---> [Web App] ---> [Database]
[Teachers] ---> [Web App] ---> [Quiz Engine]
               [Auth System]

```

### STRIDE Analysis

**Student Interface:**

- **S**poofing: Student impersonates another student to take their quiz

- **T**ampering: Student modifies quiz answers after submission

- **R**epudiation: Student denies taking a quiz they actually completed

- **I**nformation disclosure: Student accesses other students' quiz attempts

- **D**enial of service: Malicious requests crash the quiz interface

- **E**levation of privilege: Student gains teacher access to view answer keys

**Database:**

- **S**poofing: Attacker impersonates database connection from web app

- **T**ampering: Unauthorized modification of quiz questions or grades

- **R**epudiation: Database changes without proper audit trail

- **I**nformation disclosure: Unauthorized access to student records

- **D**enial of service: Database overwhelmed by malicious queries

- **E**levation of privilege: SQL injection gains admin database access

### Top 5 Priority Threats

1. **SQL injection in quiz submission** (High likelihood, High impact)

2. **Student accessing other students' quizzes** (Medium likelihood, High impact)

3. **Weak authentication allowing account takeover** (Medium likelihood, High impact)

4. **Quiz answer tampering after submission** (Low likelihood, High impact)

5. **DoS attacks during exam periods** (Low likelihood, Medium impact)

### Countermeasures for Top 3 Threats

1. **SQL Injection Prevention**:

   - Use parameterized queries for all database interactions

   - Implement input validation and sanitization

   - Apply least-privilege database access controls

2. **Authorization Controls**:

   - Implement strict user session management

   - Add authorization checks before displaying any quiz data

   - Use unique, non-sequential quiz IDs to prevent enumeration

3. **Strong Authentication**:

   - Enforce strong password requirements

   - Implement account lockout after failed attempts

   - Consider multi-factor authentication for high-stakes exams
///
///


## Summary

**Integrating security into the SDLC transforms security from a cost center into a competitive advantage:**

**Phase-based security integration:**

- **Requirements**: Identify security needs early when changes are cheap

- **Design**: Architect security controls into system foundations

- **Development**: Apply secure coding practices as features are built

- **Testing**: Validate security controls before deployment

- **Deployment**: Maintain security through monitoring and updates

**Threat modeling benefits:**

- **Early identification**: Find potential attacks during design phase

- **Systematic approach**: Use frameworks like STRIDE for comprehensive coverage

- **Risk prioritization**: Focus limited resources on highest-impact threats

- **Stakeholder communication**: Provide clear rationale for security investments

**Cost-effective security:**

- **Prevention over cure**: Security integration costs 60x less than post-deployment fixes

- **Reduced complexity**: Built-in security is simpler than retrofitted protection

- **Better user experience**: Security designed with usability in mind

- **Compliance advantages**: Meet regulatory requirements from day one

**Development team benefits:**

- **Clear responsibilities**: Everyone understands their security role

- **Reduced rework**: Fewer security issues discovered late in development

- **Quality improvement**: Security practices improve overall code quality

- **Risk reduction**: Lower probability of production security incidents

Security integration isn't just about preventing attacks—it's about building systems that stakeholders can trust, that meet regulatory requirements, and that provide sustainable competitive advantages in an increasingly security-conscious market.
