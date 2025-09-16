# Year 11 — The Object-Oriented Paradigm: Module Plan

Audience: beginners. Language: Python only. Diagrams: PlantUML.## Folder naming (mapping to numbered sections)

- Display: numbered titles (e.g., "5.5 Modelling with class diagrams").

- Folders: `docs/Year11/ObjectOrientedParadigm/Chapter-0X-Name/Section-0Y-Name/`

  - `index.md`

  - `quiz.md`mples tiny; focus on reasoning with objects.

Structure: Module → Chapters → Sections → Subsections. Sections are numbered (e.g., 1.3) with short titles. Folder slugs remain hyphenated; display titles avoid dashes and “Part” prefixes.

---

## Chapter 5 — OOP foundations

Covers: core OOP ideas, modelling, and design process. Outcomes: SE-11-01, SE-11-02, SE-11-06.

### 5.1 Objects and classes

- Outcomes: SE-11-02

- Learn: objects, attributes, methods; instances vs classes; message passing.

- Investigate: how OOP languages handle message-passing between objects (calls, references, parameter passing, and method dispatch).

### 5.2 Encapsulation and state

- Outcomes: SE-11-02

- Learn: public interface vs internal state; invariants; simple getters/setters where appropriate.

### 5.3 Abstraction, generalisation, inheritance, polymorphism

- Outcomes: SE-11-02

- Learn: purpose of abstraction; generalisation as a modelling tool; inheritance for reuse; polymorphism by interface/duck typing (conceptual).

### 5.4 Comparing procedural and OOP

- Outcomes: SE-11-02

- Learn: when and why to choose OOP; trade-offs; mapping from functions to methods.

### 5.5 Modelling with class diagrams, structure charts and DFDs

- Outcomes: SE-11-01

- Learn: represent a system with class diagrams, structure charts and data-flow diagrams (DFDs); map responsibilities and data paths. Use PlantUML for class diagrams and show how structure charts and simple DFDs complement class models.

### 5.6 Design process: task definition and decomposition

- Outcomes: SE-11-01

- Learn: requirements → responsibilities → collaborations; top-down and bottom-up design.

### 5.7 Collaboration practices and version control

- Outcomes: SE-11-06

- Learn: simple branching, commits, pull requests; documenting design with READMEs and diagrams.

- Focus: how OOP supports collaboration — clear module boundaries, well-defined interfaces, small cohesive classes, and API-style contracts that allow parallel work and easier code reviews.

Exit: students can explain OOP concepts and sketch a small class model from requirements.

---

## Chapter 6 — Programming in OOP

Covers: implementing small class designs in Python, code quality, and testing. Outcomes: SE-11-02, SE-11-06, SE-11-08.

### 6.1 Building classes and composition

- Outcomes: SE-11-02

- Learn: defining classes, constructors, methods; composition over inheritance for simple reuse.

### 6.2 Control structures within methods

- Outcomes: SE-11-02

- Learn: using selection and iteration inside methods; keeping methods short and cohesive.

### 6.3 Designing subroutines and stubs

- Outcomes: SE-11-02, SE-11-08

- Learn: designing method signatures; stubs for incremental development and testing.

### 6.4 Code quality and maintainability

- Outcomes: SE-11-08

- Learn: readability, naming, docstrings, avoiding long methods; simple refactoring patterns.

- Practical checklist: aim for a clear and uncluttered mainline; one logical task per subroutine; use stubs for incremental development; use appropriate control structures and data structures; design for ease of maintenance; use version control and regular backups.

### 6.5 Testing: unit, subsystem, system and quality assurance

- Outcomes: SE-11-06, SE-11-08

- Learn: test levels and purposes; basic unit tests for class methods; subsystem integration checks; QA practices (review checklists, continuous testing mindset, acceptance criteria).

### 6.6 Test strategies: black/white/grey box

- Outcomes: SE-11-06, SE-11-08

- Learn: designing tests by specification vs by code; choosing inputs and expected outcomes.

### 6.7 Code optimisation and assessing effectiveness

- Outcomes: SE-11-08

- Learn: assess the effectiveness of code developed to implement an algorithm (correctness, clarity, performance, and maintainability). Introduce basic optimisation techniques: simpler algorithms, appropriate data structures, avoiding premature optimisation, and using simple profiling (time/sample runs). Discuss trade-offs between readability and micro-optimisations.

Exit: students implement a small, well-tested set of classes with clear responsibilities.

---

## Author deliverables per section

- index.md: explanation, tiny Python examples, PlantUML diagram(s), practice tasks, recap.

- quiz.md: 6–10 questions (mix of multiple-choice and short-answer) with an answer key.

## Folder naming (mapping to numbered sections)

- Display: numbered titles (e.g., “1.5 Modelling with class diagrams”).

- Folders: `docs/Year11/ObjectOrientedParadigm/Chapter-0X-Name/Section-0Y-Name/`

  - `index.md`

  - `quiz.md`
