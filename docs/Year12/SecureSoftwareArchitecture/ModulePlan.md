# Year 12 — Secure Software Architecture: Module Plan

Keep code examples small and Python-only; demonstrate vulnerabilities and fixes. Use PlantUML for threat models and sequence diagrams.

---

## Chapter 1 — Designing secure software

Covers: value of security, secure SDLC, and user/context design. Outcomes: SE-12-01, SE-12-03.

### 1.1 Why secure software matters

- Outcomes: SE-12-01

- Learn: business/user value; common failure modes; risk and impact.

### 1.2 Secure development steps in the SDLC

- Outcomes: SE-12-01

- Learn: integrate security into requirements, design, implementation, testing, deployment, maintenance.

### 1.3 Designing for users and contexts

## Author deliverables per section

- Outcomes: SE-12-03

- Learn: usability–security trade-offs; personas; abuse/misuse cases.

Exit: students can articulate why security matters and where it fits in the SDLC.

---

Covers: core principles, privacy, secure inputs/APIs, safe execution, and security testing. Outcomes: SE-12-07, SE-12-04, SE-12-06.

- Outcomes: SE-12-07

- Learn: confidentiality, integrity, availability; authentication, authorisation, accountability.

- Outcomes: SE-12-07

- Learn: hashing and encryption basics; key management at a high level; isolation/sandboxing.

- Outcomes: SE-12-04

- Learn: data minimisation, consent, purpose limitation; handling personal data safely.

- Outcomes: SE-12-07

- Learn: prevent injection; whitelist vs blacklist; safe exception messages.

- Outcomes: SE-12-07

- Learn: keys/tokens, least privilege, rate limiting, simple Python examples.

- Outcomes: SE-12-07

- Learn: resource management, timeouts, retries; session handling basics.

## Chapter 2 additions: explicit secure-development topics

## Year 12 — Secure Software Architecture: Module Plan

Keep code examples small and Python-only; demonstrate vulnerabilities and fixes. Use PlantUML for threat models and sequence diagrams.

---

## Chapter 1 — Designing secure software

Covers: value of security, secure SDLC, and user/context design. Outcomes: SE-12-01, SE-12-03.

### 1.1 Why secure software matters

- Outcomes: SE-12-01

- Learn: business/user value; common failure modes; risk and impact.

### 1.2 Secure development steps in the SDLC

- Outcomes: SE-12-01

- Learn: integrate security into requirements, design, implementation, testing, deployment, maintenance.

### 1.3 Designing for users and contexts

- Outcomes: SE-12-03

- Learn: usability–security trade-offs; personas; abuse/misuse cases.

Exit: students can articulate why security matters and where it fits in the SDLC.

---

## Chapter 2 — Developing secure code

Covers: core principles, privacy, secure inputs/APIs, safe execution, and security testing. Outcomes: SE-12-07, SE-12-04, SE-12-06.

### 2.1 Security principles: CIA and AAA

- Outcomes: SE-12-07

- Learn: confidentiality, integrity, availability; authentication, authorisation, accountability.

### 2.2 Security by design: cryptography and sandboxing

- Outcomes: SE-12-07

- Learn: hashing and encryption basics; key management at a high level; isolation/sandboxing.

### 2.3 Privacy by design principles

- Outcomes: SE-12-04

- Learn: data minimisation, consent, purpose limitation; handling personal data safely.

### 2.4 Securing inputs: validation, sanitisation, errors

- Outcomes: SE-12-07

- Learn: prevent injection; whitelist vs blacklist; safe exception messages.

### 2.5 Secure APIs: design and implementation

- Outcomes: SE-12-07

- Learn: keys/tokens, least privilege, rate limiting, simple Python examples.

### 2.6 Efficient and safe execution

- Outcomes: SE-12-07

- Learn: resource management, timeouts, retries; session handling basics.

### 2.7 Security testing: SAST, DAST, vulnerability assessment, pentest

- Outcomes: SE-12-06

- Learn: when and how to apply each; lightweight tooling; interpreting results.

Exit: students can implement and review small secure Python snippets and explain trade-offs.

---

## Chapter 3 — Impact of secure development

Covers: collaboration, enterprise benefits, and social/ethical/legal aspects. Outcomes: SE-12-06, SE-12-05.

### 3.1 Collaboration for security

- Outcomes: SE-12-06

- Learn: team practices, security reviews, documentation of risks/mitigations.

### 3.2 Enterprise benefits of secure practices

- Outcomes: SE-12-06

- Learn: cost of defects, compliance, reliability and trust.

### 3.3 Social, ethical, and legal issues

- Outcomes: SE-12-05

- Learn: privacy rights, responsible disclosure, accessibility, equity.

Exit: students can discuss impacts and advocate for secure practices.

### 3.4 Enterprise benefits and evaluation

- Outcomes: SE-12-06

- Learn: investigate and explain the benefits to an enterprise of implementing safe and secure development practices, including:

  - improved products or services

  - influence on future software development

  - improved work practices

  - productivity gains

  - enhanced business interactivity with customers and partners

### 3.5 Social, ethical and legal ramifications (detailed)

- Outcomes: SE-12-05

- Learn: evaluate the social, ethical and legal issues and ramifications affecting people and enterprises resulting from safe and secure software, including:

  - employment and workforce impacts

  - data security and privacy concerns

  - copyright and intellectual property

  - digital disruption and its economic/social consequences

Exit: students can critically evaluate trade-offs and advocate policy/practice improvements.

---

## Author deliverables per section

- index.md: explanation, small Python example(s), PlantUML diagram(s), practice tasks, recap.

- quiz.md: 6–10 questions (mix of multiple-choice and short-answer) with an answer key.

## Chapter 2 additions: explicit secure-development topics

The following topics should be included under Chapter 2 (Developing secure code) as specific learning outcomes and subsections.

### 2.8 Data protection and privacy-by-design

- Outcomes: SE-12-04, SE-12-07

- Learn: principles of data protection and privacy-by-design with explicit practices:

  - proactive (not reactive) approach to privacy

  - embed privacy into design and architecture

  - respect for user privacy and minimisation of collected data

### 2.9 Security testing, hardening and resilience

- Outcomes: SE-12-06

- Learn: test and evaluate security and resilience by determining vulnerabilities, hardening systems, handling breaches, maintaining business continuity, and conducting disaster recovery.

- Methods to cover explicitly:

  - code review

  - static application security testing (SAST)

  - dynamic application security testing (DAST)

  - vulnerability assessment

  - penetration testing

### 2.10 Defensive coding and efficient execution

- Outcomes: SE-12-07

- Learn: design, develop and implement code using defensive data input handling practices and efficient execution considerations, including:

  - input validation, sanitisation and safe error handling

  - memory management strategies

  - session management (secure creation, storage, expiry)

  - exception management and logging policies

### 2.11 Specific vulnerability classes and mitigations

- Outcomes: SE-12-07

- Learn: design, develop and implement secure code to minimise vulnerabilities in user action controls and file/hardware exposures, including discussion and mitigation of:

  - broken authentication and insecure session management

  - cross-site scripting (XSS) and cross-site request forgery (CSRF)

  - invalid forwarding and redirecting

  - race conditions and concurrency issues

  - file-related attacks and side-channel attacks; protecting user file and hardware interfaces

### 2.12 Collaboration and secure development

- Outcomes: SE-12-06

- Learn: apply and describe the benefits of collaboration to develop safe and secure software, including:

  - considering various points of view during design and review

  - delegating tasks based on expertise

  - improving the quality of the solution through shared ownership and reviews

## Folder naming (mapping to numbered sections)

- Display: numbered titles (e.g., "2.4 Securing inputs: validation, sanitisation, errors").

- Folders: `docs/Year12/SecureSoftwareArchitecture/Chapter-0X-Name/Section-0Y-Name/`

  - `index.md`

  - `quiz.md`
