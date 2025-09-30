# Year 11 — Programming Fundamentals: Module Plan

Audience: absolute beginners. Language: Python only. Diagrams: PlantUML (fallback to static SVG if plugin not enabled). Mechatronics code is deferred to its module.

Structure: Module → Chapters → Sections → Subsections. Sections are numbered (e.g., 2.3) with short, clear titles. Folder slugs remain hyphenated; display titles avoid dashes and “Part” prefixes.

## Sequencing overview (why this order)

1) Software development gives project context and collaboration habits.
2) Designing algorithms builds thinking skills before coding.
3) Data for software engineering equips students with types and representation.
4) Developing solutions with code turns designs into Python, then adds testing/debugging and project models.

---

## Chapter 1 — Software development

Covers: SDLC steps, collaboration tools, documentation. Outcomes: SE-11-01, SE-11-06; touches SE-11-04.

### 1.1 Software development steps

- Outcomes: SE-11-01

- Learn: requirements, specifications, design, development, integration, testing/debugging, installation, maintenance.

- Activity: map a simple “Grade Calculator” through each step.

- Diagram: PlantUML activity diagram of SDLC.

### 1.2 Tools and collaboration (IDE + Git)

- Outcomes: SE-11-06

- Learn: IDE basics (files, run, terminal), Git init/add/commit, safe commit messages.

- Activity: Set up a new Git repository for the Grade Calculator project, create a README.md file, make an initial commit with the message "Initial project setup", then add the basic calculator code and commit with "Add basic grade calculation function".

- Diagram: PlantUML component diagram (Student ↔ Repo ↔ IDE).

- Cross-reference: Uses the Grade Calculator from 1.1 as the project example.

### 1.3 Documentation and code style

- Outcomes: SE-11-06

- Learn: README essentials, docstrings, inline comments, simple naming/PEP 8.

- Activity: Write a complete README.md for the Grade Calculator from 1.1, then add docstrings to the `calculate_average()` function.

- Cross-reference: Builds on the Grade Calculator example from 1.1.

### 1.4 Project management models (Waterfall vs Agile)

- Outcomes: SE-11-01

- Learn: execution differences, pros/cons, and when each model fits small classroom projects.

Exit: students can explain SDLC and set up a tiny repo in an IDE.

---

## Chapter 2 — Designing algorithms

Covers: control structures, I/O, analysis, pseudocode and flow/structure charts, subprograms, design strategies, brief paradigms overview. Outcomes: SE-11-02 (primary), SE-11-01.

### 2.1 Control structures (sequence, selection, iteration)

- Outcomes: SE-11-02

- Learn: linear steps, if/else, while/for loops; tracing small examples.

- Diagram: simple decision/activity diagram (PlantUML).

### 2.2 I/O and purpose; desk and peer checking

- Outcomes: SE-11-02

- Learn: determining inputs and outputs; determining the purpose of the algorithm; desk checking and peer checking.

- Activity: desk-check two branches and record expected outputs.

- Cross-reference: Builds on control structures from 2.1.

### 2.3 Pseudocode and flowcharts

- Outcomes: SE-11-02

- Learn: readable pseudocode patterns; represent flows with PlantUML activity diagrams.

### 2.4 Structure charts; abstraction and refinement

- Outcomes: SE-11-01, SE-11-02

- Learn: top-down vs bottom-up; structure charts; stepwise refinement.

- Diagram: PlantUML package/component sketch of module breakdown.

### 2.5 Subprograms: procedures and functions

- Outcomes: SE-11-02

- Learn: identifying procedures/functions in an algorithm; parameters and returns; cohesion.

### 2.6 Analysing written algorithms (logic and structure)

- Outcomes: SE-11-02

- Learn: analyse the logic and structure of provided algorithms, including:

  - determining inputs and outputs

  - determining the purpose of the algorithm

  - desk checking and peer checking

  - determining connections to other subroutines or functions

  - identifying procedures and functions present

### 2.7 Brief paradigms overview

- Outcomes: SE-11-02 (context only)

- Learn: very brief contrast of imperative, object-oriented, logic, functional paradigms (no coding yet).

Exit: students can design and analyse small algorithms, document I/O, and produce flow/structure charts.

---

## Chapter 3 — Data for software engineering

Covers: number systems, two’s complement, standard data types, data dictionaries, and an overview of common data structures. Outcomes: SE-11-03, SE-11-02, SE-11-06.

### 3.1 Number systems and two’s complement

- Outcomes: SE-11-03

- Learn: decimal/binary/hex conversions; negative integers with two’s complement.

- Activity: convert by hand; verify with Python `bin()`/`int()`.

### 3.2 Standard data types

- Outcomes: SE-11-02

- Learn: char/string, Boolean, real/float, integer, date/time (Python: `str`, `bool`, `int`, `float`, `datetime` basics).

### 3.3 Data dictionaries

- Outcomes: SE-11-01, SE-11-06

- Learn: fields, types, constraints, relationships; units and ranges.

- Activity: Create a data dictionary for a Student record with fields for name (string, max 50 chars), age (integer, 16-25), grade_average (float, 0.0-100.0), and enrollment_status (boolean).

- Cross-reference: Uses data types from 3.2.

### 3.4 Data structures overview

- Outcomes: SE-11-02

- Learn: single and multidimensional arrays (represented via 1-D and 2-D Python lists), lists, records, trees, stacks, hash tables, sequential files (CSV).

Exit: students can choose types, build a small data dictionary, and explain basic structures.

---

## Chapter 4 — Developing solutions with code

Covers: implementing algorithms in Python; explicit control structures and required data structures; subprograms and parameters; standard modules; debugging and test data; common errors; project models. Outcomes: SE-11-02, SE-11-06, SE-11-07, SE-11-08, SE-11-01.

### 4.1 Control structures in Python

- Outcomes: SE-11-02

- Learn: implementing sequence, selection (`if/elif/else`), and iteration (`for`, `while`) in Python; mapping from pseudocode.

### 4.2 Data structures in Python (required set)

- Outcomes: SE-11-02

- Learn (explicit):

  - Single and multidimensional arrays → Python lists and lists-of-lists (2-D)

  - Lists (Python list operations)

  - Trees (conceptual use; simple nested dict/list representation)

  - Stacks (implemented via Python list `append`/`pop`)

  - Hash tables → Python `dict`

  - Sequential files (CSV read/write with `csv`)

### 4.3 From pseudocode to Python functions

- Outcomes: SE-11-02

- Learn: define functions; parameter passing; returns; one logical task per function.

### 4.4 Using standard modules

- Outcomes: SE-11-06, SE-11-02

- Learn: import and use `math`, `random`; prefer pure functions where possible.

### 4.5 Debugging tools and techniques

- Outcomes: SE-11-06, SE-11-07

- Learn (explicit): breakpoints; single line stepping; watches; interfaces between functions; debugging output statements; IDE debugger tooling.

- Activity: Use print statements to debug a simple function that calculates factorial but returns wrong results for input 0.

- Cross-reference: Uses functions from 4.3 and control structures from 4.1.

### 4.6 Designing suitable test data

- Outcomes: SE-11-06, SE-11-08

- Learn (explicit): boundary values; path coverage; faulty and abnormal data; compare expected vs actual outputs.

### 4.7 Common errors and causes

- Outcomes: SE-11-08

- Learn: typical syntax, logic, and runtime errors; likely causes and fixes.

### 4.8 Evaluating solutions

- Outcomes: SE-11-06

- Learn: evaluate functionality, clarity/readability, basic performance (timing only if appropriate), documentation quality, and user feedback.

Exit: students ship a small Python solution with clear control/data structures, basic tests, and debugging evidence.

---

## Author deliverables per section

- index.md: beginner-friendly explanation, small Python example(s), PlantUML diagram(s), practice tasks, recap.

- quiz.md: 3–8 questions using the Markdown-only quiz pattern.

- Assets: any images/SVGs stored alongside the section’s topic.

## Folder naming (mapping to numbered sections)

- Display: numbered titles (e.g., “2.3 Pseudocode and flowcharts”).

- Folders: `docs/Year11/ProgrammingFundamentals/Chapter-0X-Name/Section-0Y-Name/`

  - `index.md` (topic content)

  - `quiz.md` (topic quiz)

## Notes for authors

- Use only Python features already introduced earlier; keep examples tiny.

- Keep related “chart” topics adjacent (flowcharts next to structure charts).

- If PlantUML isn’t rendering yet, add a static `diagram.svg` and include the fenced source for later.
