# 19.1 Security in Development Teams - Quiz

**Instructions**: Choose the best answer for each question. Each question is worth 2 points.

---

## Question 1

Which of the following BEST describes the primary goal of security-focused code reviews?

A) To find all bugs in the code before deployment
B) To identify security vulnerabilities, design flaws, and strengthen security posture
C) To ensure code follows company coding standards
D) To improve code performance and efficiency

**Answer**: B) To identify security vulnerabilities, design flaws, and strengthen security posture

**Explanation**: Security-focused code reviews specifically target security concerns, going beyond general bug finding to identify vulnerabilities and opportunities to improve the system's security.

---

## Question 2

In security-focused pair programming, what is the primary responsibility of the "security navigator"?

A) Write the main functional code
B) Test the code for performance issues
C) Watch for security anti-patterns and suggest secure alternatives
D) Document the code changes

**Answer**: C) Watch for security anti-patterns and suggest secure alternatives

**Explanation**: The security navigator specifically focuses on security considerations while the functional driver implements the primary functionality, creating a collaborative approach to secure coding.

---

## Question 3

Which of the following is NOT typically included in security user stories for agile development?

A) "As a user, I want my password to be securely stored"
B) "As a system, I want to detect brute force attacks"
C) "As a developer, I want the fastest possible development time"
D) "As an admin, I want to see failed login attempts"

**Answer**: C) "As a developer, I want the fastest possible development time"

**Explanation**: Security user stories focus on security requirements from the perspective of users, systems, and security stakeholders, not on development efficiency goals.

---

## Question 4

What is the main benefit of involving the entire development team in threat modeling sessions?

A) It reduces the workload for security specialists
B) It brings diverse perspectives to identify threats and builds shared security understanding
C) It eliminates the need for security testing
D) It speeds up the development process

**Answer**: B) It brings diverse perspectives to identify threats and builds shared security understanding

**Explanation**: Collaborative threat modeling leverages different team members' expertise and builds security awareness across the entire team.

---

## Question 5

Which STRIDE category would "Database records modified without authorization" fall under?

A) Spoofing
B) Tampering
C) Information Disclosure
D) Denial of Service

**Answer**: B) Tampering

**Explanation**: Tampering refers to modifying data or code without authorization, which includes unauthorized database modifications.

---

## Question 6

What is the primary purpose of security runbooks in team documentation?

A) To record all security incidents that have occurred
B) To provide step-by-step procedures for responding to security incidents
C) To list all security tools used by the team
D) To document the team's security training history

**Answer**: B) To provide step-by-step procedures for responding to security incidents

**Explanation**: Security runbooks are procedural documents that guide teams through specific responses to security incidents, ensuring consistent and effective incident handling.

---

## Question 7

In the context of security Definition of Done, which statement is most accurate?

A) Security criteria should be added only for security-critical features
B) Security criteria should be included in the Definition of Done for all user stories
C) Security criteria slow down development and should be minimized
D) Security criteria are only needed for production deployments

**Answer**: B) Security criteria should be included in the Definition of Done for all user stories

**Explanation**: Security should be a standard part of the Definition of Done for all stories to ensure consistent security practices across all development work.

---

## Question 8

Which of the following is the BEST approach for balancing security with development velocity?

A) Implement all security measures manually to ensure thoroughness
B) Skip security reviews for minor features to save time
C) Automate security processes and integrate them into existing workflows
D) Only focus on security during major releases

**Answer**: C) Automate security processes and integrate them into existing workflows

**Explanation**: Automation allows security to be integrated without slowing down development, and proper integration makes security part of the natural workflow rather than an additional burden.

---

## Question 9

What role do security champions typically play in development teams?

A) They replace the need for a dedicated security team
B) They serve as security advocates and knowledge sharers within their teams
C) They are responsible for all security testing
D) They only get involved during security incidents

**Answer**: B) They serve as security advocates and knowledge sharers within their teams

**Explanation**: Security champions act as liaisons between security teams and development teams, sharing knowledge and advocating for security practices within their development teams.

---

## Question 10

Which of the following is NOT a typical automation opportunity for improving security-velocity balance?

A) Automated static application security testing (SAST) in CI/CD
B) Automated dependency vulnerability scanning
C) Automated manual code reviews by humans
D) Automated infrastructure security validation

**Answer**: C) Automated manual code reviews by humans

**Explanation**: Manual code reviews by definition cannot be automated. While code review processes can be supported by tools, human expertise and judgment are essential components.

---

## Question 11

In collaborative threat modeling, what is the recommended approach for prioritizing identified threats?

A) Address all threats equally regardless of risk level
B) Only focus on the most technically complex threats
C) Prioritize based on likelihood and impact assessment
D) Let the security team decide all priorities

**Answer**: C) Prioritize based on likelihood and impact assessment

**Explanation**: Effective threat prioritization considers both the likelihood of the threat occurring and the potential impact if it does occur, allowing teams to focus on the most significant risks first.

---

## Question 12

What is the main advantage of implementing "security as code" practices?

A) It eliminates the need for security expertise
B) It allows security policies to be version-controlled, tested, and automated
C) It makes security the sole responsibility of developers
D) It reduces the need for security documentation

**Answer**: B) It allows security policies to be version-controlled, tested, and automated

**Explanation**: Security as code treats security policies like any other code, enabling version control, testing, and automation while maintaining consistency and enabling rapid deployment.

---

## Question 13

Which of the following BEST describes an effective security training approach for development teams?

A) Annual comprehensive security training sessions
B) Regular, topic-focused sessions with hands-on activities and ongoing knowledge sharing
C) One-time onboarding security presentation
D) Self-study security materials without group interaction

**Answer**: B) Regular, topic-focused sessions with hands-on activities and ongoing knowledge sharing

**Explanation**: Effective security training is ongoing, interactive, and practical, with regular reinforcement and opportunities for team members to share knowledge with each other.

---

## Question 14

What is the primary benefit of recording security architectural decision records (ADRs)?

A) To satisfy compliance requirements
B) To document the context, decisions, and consequences of security choices for future reference
C) To assign blame when security issues occur
D) To track project timelines and budgets

**Answer**: B) To document the context, decisions, and consequences of security choices for future reference

**Explanation**: Security ADRs preserve the reasoning behind security decisions, helping future team members understand why specific security approaches were chosen and their implications.

---

## Question 15

In agile development, when should security requirements be considered?

A) Only during the security testing phase
B) At the end of each sprint during retrospectives
C) Throughout all phases of development, from planning to deployment
D) Only when security issues are discovered

**Answer**: C) Throughout all phases of development, from planning to deployment

**Explanation**: Security should be integrated throughout the entire development lifecycle in agile environments, not treated as a separate phase or afterthought.

---

## Question 16

Which factor is MOST important for building a security-conscious team culture?

A) Having the most advanced security tools
B) Hiring only developers with security backgrounds
C) Creating an environment where security discussions and improvements are encouraged and celebrated
D) Implementing strict security policies and penalties

**Answer**: C) Creating an environment where security discussions and improvements are encouraged and celebrated

**Explanation**: A positive security culture is built through encouragement, shared learning, and celebration of security improvements, not through tools, specialized hiring, or punitive measures.

---

## Question 17

What is the most effective way to handle security requirements in sprint planning?

A) Add security stories only when specifically requested by security team
B) Include security acceptance criteria in all relevant user stories and estimate security work
C) Plan separate security-only sprints
D) Let the security team handle all security requirements separately

**Answer**: B) Include security acceptance criteria in all relevant user stories and estimate security work

**Explanation**: Integrating security requirements into regular user stories ensures security is considered as part of normal development work rather than as separate, disconnected activities.

---

## Question 18

Which of the following is the BEST indicator of mature security culture in a development team?

A) The team never reports security issues
B) Team members proactively identify and discuss security improvements
C) All security decisions are made by external security experts
D) The team avoids discussing security to focus on features

**Answer**: B) Team members proactively identify and discuss security improvements

**Explanation**: A mature security culture is characterized by team members who actively think about security and voluntarily contribute to security improvements as part of their regular work.

---

## Question 19

What is the recommended approach for conducting security code reviews in a team setting?

A) Only senior developers should review code for security
B) Use structured checklists and involve multiple perspectives, including security-focused reviewers
C) Rely entirely on automated tools without human review
D) Review code for security only after functional testing is complete

**Answer**: B) Use structured checklists and involve multiple perspectives, including security-focused reviewers

**Explanation**: Effective security code reviews combine structured approaches (checklists) with diverse perspectives to catch different types of security issues and share knowledge across the team.

---

## Question 20

Which statement BEST describes the relationship between security and development velocity?

A) Security always slows down development and must be minimized
B) Security and velocity are fundamentally incompatible
C) Well-implemented security practices can actually enable faster, more confident development
D) Security should only be considered after achieving development speed goals

**Answer**: C) Well-implemented security practices can actually enable faster, more confident development

**Explanation**: When security is properly integrated through automation, good processes, and team culture, it reduces rework, prevents costly security issues, and allows teams to develop and deploy with greater confidence.

---

**Quiz Summary**: This quiz tests understanding of security integration in development teams, covering code reviews, agile practices, threat modeling, documentation, culture building, and velocity optimization. These concepts are essential for creating development teams that build security into their daily practices rather than treating it as an external constraint.
