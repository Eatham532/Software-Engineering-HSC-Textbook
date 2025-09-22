# AI Contributor Guide

This guide documents conventions and the active plan so contributors can add content safely and consistently to this MkDocs textbook.

**CRITICAL: Length Management for AI Contributors**

Before writing any substantial content, AI contributors MUST:

1. **Estimate content length** based on learning objectives and code examples required

2. **Check if content will exceed reasonable response limits** (typically ~8000-10000 lines for comprehensive sections)

3. **If content will be large, inform the user BEFORE starting** and propose breaking into multiple manageable chunks

4. **Plan chunk boundaries** logically (e.g., by major topics, not arbitrary cuts)

5. **Update todo lists** to reflect multi-part approach

Example planning approach:

- Section covering 5 major topics with extensive code examples = likely needs 3-4 parts

- Simple section with 2-3 concepts = can likely be done in one response

- Always err on the side of caution and ask user to confirm multi-part approach

This prevents hitting length limits mid-creation and ensures consistent, complete content delivery.

Before running Python code, contributors should activate the project virtual environment with `.venv\Scripts\activate`.

The repository uses `uv` for environment and dependency management where applicable.

Links are used across the textbook to reduce duplic## Diagrams (PlantUML)

- Each Section includes `index.md` and `quiz.md`. Place images/code alongside or in `assets/`.

## Section template (index.md)

- **Important**: In class diagrams, escape double underscores in method names (e.g., `\_\_init\_\_` instead of `__init__`) as underscores interfere with Markdown formatting.

Example:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

class Student {
    - name: string
    - student_id: string
    + \_\_init\_\_(name, student_id)
    + get_average(): float
}

actor Student
participant "Textbook Site" as Site
Student -> Site: Open Section
Site --> Student: Rendered page
@enduml
```

Links are used across the textbook to reduce duplication and maintain a single source of truth for terms and concepts.

## Additional contributor suggestions

Pages should be clear and concise and focus on a single learning goal. It should be specific on topics and go in depth into areas for students.

Examples should be progressive: begin with REPL-sized snippets, grow to small scripts, and avoid heavy frameworks for introductory material.

The project maintains a consistent writing style: third-person neutral voice, plain language, and Australian spelling are preferred.

Accessibility considerations: provide alt text for images and diagrams, avoid conveying meaning using colour alone, and maintain high contrast.

Cross-linking is recommended so that each new term points to its first introduction or the glossary.

Quizzes belong in a separate `quiz.md` adjacent to each section’s `index.md`. The Markdown-only quiz pattern from `docs/demo/quiz-demo.md` is preferred.

### Admonitions and details usage

**Traditional admonitions** (using `!!!`) should be used for:

- Quiz containers: `!!! quiz "Title"`

- Important warnings or notes that should always be visible

- Key concepts that require immediate attention

**Details blocks** (using `///`) should be used for:

- Exercise solutions that can be expanded/collapsed

- Optional deep-dive content

- Extended examples or explanations

- Any content that benefits from being collapsible

**H4 headings (####) are not allowed** - use details blocks with `///` syntax instead for collapsible content sections.

**Exercise and solution pattern**:

```markdown
/// details | Exercise 1: Problem Analysis
    type: question
    open: false

**Scenario**: A local coffee shop wants to calculate daily revenue.

**Task**: Complete the problem identification phase.

1. Identify the primary stakeholders
2. Define the core problem statement

/// details | Sample Solution
    type: success
    open: false

**Primary stakeholders**: Coffee shop owner, employees, accountant

**Problem statement**: The coffee shop lacks an automated system...
///
///
```

## Using pymdownx extensions

A curated set of `pymdownx` extensions is enabled in `mkdocs.yml` to improve readability and interactivity. Usage should remain conservative and accessible.

Guidelines and common patterns:

- Tabs: Use the `/// tab | Title` syntax for alternate views (for example, pseudocode, Python, or a worked example). Each tab is a separate collapsible block that can be expanded independently.

  Example (correct syntax):

  ```markdown
  /// tab | Python

  ```py
  print('hello')
  ```

  ///

  /// tab | Pseudocode

  ```text
  OUTPUT "hello"
  ```

  ///
  ```
  ```

  Notes:

  - Tab labels should be brief and descriptive (for example, "Python", "Pseudocode", "Explanation").

  - Limit tab sets to 3–4 items to preserve discoverability.

  - The first tab should present the most common or simplest representation for accessibility.

  - `details` blocks are suitable for extended answers or worked solutions that readers may expand.

- Collapsible/Details: `pymdownx.blocks.details` is appropriate for optional deeper reading or extended worked solutions. Use the new details syntax instead of traditional admonitions for collapsible content:

  ```markdown
  /// details | Summary title
      type: note
      open: false
      attrs: {class: class-name, id: id-name}

  Content goes here
  ///
  ```

  Available types: `note`, `warning`, `info`, `success`, `question`, `failure`, `danger`, `bug`, `example`, `quote`, `tip`

  Use `open: true` to show content by default, `open: false` to keep collapsed.

  For exercise solutions, prefer `type: success` with descriptive summaries.

- Superfences: `pymdownx.superfences` handles fenced blocks such as PlantUML, shell, and multi-language examples. Explicit language labels (for example, `plantuml`, `sh`, `py`) improve rendering and tooling.

- Task lists: `pymdownx.tasklist` can be used for interactive checklists in exercise instructions. Quizzes should remain in the dedicated quiz pattern rather than using tasklists for grading.

- Inline highlights, keys and marks:

  - `pymdownx.inlinehilite` enables inline emphasis without colour reliance; use sparingly.

  - `pymdownx.keys` is useful for keyboard shortcuts (for example, `Ctrl+S`).

  - `pymdownx.mark` highlights brief important terms; prefer this over bolding long passages.

- Snippets: `pymdownx.snippets` can include shared examples or notes from `docs/_snippets/` to avoid duplication.

- Emoji: `pymdownx.emoji` is available for small visual cues; however, emoji should not be the sole carrier of meaning.

Accessibility rules:

- Do not rely on colour alone for meaning when using tab, mark, or inlinehilite.

- Ensure collapsible content is discoverable from headings and summaries.

- Keep tab labels explicit and keyboard-friendly.

When a new `pymdownx`-powered pattern is added, a one-line example and rationale should be recorded here to explain why it benefits the learning flow.


## Authoring style rules (Chapter and Section files)

- Syllabus outcomes should not appear inside Chapter or Section headings. Outcomes belong in Module or Chapter overview documents.

- **IMPORTANT**: Do not add "Outcomes: SE-XX-XX" lines to individual section files. This information belongs in module plans and chapter overviews only.

- **Cross-references**: Include pointers to related sections using phrases like "See also [section reference]" or "This builds on [concept] from [section]". Help students connect concepts across the module.

- Header structure in `index.md` files follows this preferred pattern:

  - H1: Section title (short and numbered, for example "1.1 Software development steps")

  - H2: Why it matters

  - H2: Concepts

    - H3: Concept name (short)

    - H3: Guided example

  - H2: Try it (or an alternative activity label appropriate to the audience)

    - Note: For introductory sections where coding is deferred, prefer the activity heading `Practice` instead of `Try it`.

  - H2: Recap

- Content organisation should leverage `pymdownx` patterns where appropriate:

  - `/// tab | Title` for alternate views such as code vs pseudocode

  - `details` for optional deep dives and worked solutions

  - `tasklist` for guided tasks

  - `superfences` for PlantUML, shell, and multi-language fences

- Paragraphs should be short (1–3 sentences). Lists must be indented using spaces rather than tabs.


Formatting example (in `index.md`):

````markdown

## 1.1 Software development steps

## Why it matters

Short 2–3 sentence justification.

## Concepts

### The steps (brief)

Content here.

### Guided example

/// tab | Python

```py
print('tiny example')
```

///

/// tab | Pseudocode

```text
OUTPUT "tiny example"
```

///

## Try it

- [ ] Small task 1

- [ ] Small task 2

## Recap

Short summary.
````

### Quiz authoring — Markdown-only interactive quizzes

- Quizzes are placed in a co-located `quiz.md` file next to `index.md`. Raw HTML is not required.

- Questions are authored with plain lists and the attr_list marker `{ data-correct }` on the correct option. Example:

  !!! quiz "Check your understanding"

    1. A good specification describes…

        - implementation details

        - clear, testable requirements { data-correct }

        - UI styling

        - deployment scripts

- **IMPORTANT**: Do NOT use HTML divs, scripts, or complex structures. Stick to the Markdown-only format above.

- **Format rules**:

  - Use `!!! quiz "Title"` for the quiz container

  - Use numbered lists (1., 2., etc.) for questions

  - Use bulleted lists (- option text) for answer choices

  - Mark correct answers with `{ data-correct }` at the end of the option text

  - No HTML tags, no `<div>`, no `<script>`, no complex structures

Rules and tips:

- Options must be direct child `li` elements under the question's nested `ul` or `ol` (no extra wrappers).

- Use one `quiz.md` per section. Keep quizzes to 3–8 questions.

- Avoid blockquote authoring for quizzes — use the admonition-style `!!! quiz` or the attr_list class `{ .quiz }` as in `docs/demo/quiz-demo.md`.

- Prefer spaces over tabs in Markdown lists so the renderer produces the correct `ul > li` structure.

- The site includes `assets/quiz.js` which:

  - converts `{ data-correct }` markers into attributes,

  - injects Check/Reset/Score controls when missing,

  - supports keyboard (Space/Enter) and mouse selection,

  - grades by matching selected options to the marked correct options.

Behaviour notes:

- Score is initialised to `0/N` (N = question count) before grading.

- A question is marked correct only when all and only the correct options are selected.

Debugging and troubleshooting

If answers appear as "Try again" even when highlighted:

1. Hard-refresh the page (Ctrl+F5) to ensure latest `quiz.js` loads.

2. Open the browser Console and set `window.__quiz_debug = true` to see debug logs (or `false` to silence).

3. After selecting answers, paste the following snippet into the Console and send the output when asking for help (it shows which `li` has the `data-correct` attribute and whether it is selected):

```javascript
const container = document.querySelector('.admonition.quiz');
const qs = container.querySelectorAll('[data-question]');
qs.forEach((q, qi) => {
  console.log('Q', qi, q.querySelector('p')?.textContent.trim());
  const opts = Array.from(q.querySelectorAll('ul > li'));
  opts.forEach((li, i) => console.log(i, {
    text: li.textContent.trim().replace(/\s+/g,' '),
    hasDataCorrectAttr: li.hasAttribute('data-correct'),
    datasetCorrect: li.dataset && Object.prototype.hasOwnProperty.call(li.dataset,'correct') ? li.dataset.correct : undefined,
    innerHTML: li.innerHTML.trim(),
    classList: Array.from(li.classList)
  }));
});
```

To temporarily enable verbose logs in the page Console:

```javascript
window.__quiz_debug = true; // or false to silence
location.reload();
```

If you need me to debug, paste the Console output showing `quiz:marker`, `quiz:toggle`, `quiz:question state` and `quiz:grade result` lines.


Diagrams: include the PlantUML source fence above any generated SVG. Prefer one concept per diagram.

File hygiene: build artefacts should not be committed (for example, `site/`, `__pycache__/`, `.obsidian/`, `.vscode/`).

Navigation: `docs/.nav.yml` is the single source of truth for navigation; avoid adding `nav:` to `mkdocs.yml`.

Navigation conventions: module overviews should live at `docs/YearYY/ModuleName/index.md`. Do not use bracketed labels such as "(Overview)" in titles or nav labels.

Local development: `uv` or editable installs are the recommended flow. A typical sequence is:

1) Activate the virtual environment: `.venv\\Scripts\\activate`
2) Install dependencies in editable mode: `uv pip install -e .` (or `pip install -e .`)
3) Serve locally: `mkdocs serve`

Linting: Markdown headings should be sequential. Lines should be reasonably short (~100 characters). Run `scripts/simple_md_lint.py` before commits.

Names: chapter and section numbers are zero‑padded (for example, `Chapter-03`, `Section-07-...`). H1 titles should use numbered labels such as “1.2 …”.

Content updates: when a new concept is added, include at least one small runnable Python snippet and a 2–3 line "Why it matters" explanation.

## Project purpose

Create a NSW HSC Software Engineering textbook for Years 11–12. Audience is beginners; code is Python only. Content hierarchy: Year → Module → Chapter → Section. Each Section has a co-located quiz.

## Authoring principles

- Beginner-first. Introduce one idea at a time; use tiny runnable examples.

- Python only. Avoid external packages unless essential and introduced gently.

- Mechatronics: defer device-specific coding until a platform is chosen; prefer simulations and diagrams first.

- Diagrams: use PlantUML for all new diagrams. Keep Mermaid only for legacy content until migrated. Keep diagrams simple and not crazy complicated to ensure that the concepts are easily understood.

- Titles: short and numbered (e.g., 2.3). Display names avoid dashes and never use “Part” prefixes.

## Syllabus alignment

Content must align with the module plan terminology and the syllabus outcome labels. Use the exact terms from `docs/Year11/ProgrammingFundamentals/ModulePlan.md` when naming headings and listing learning points so readers and teachers can map content back to outcomes easily.

Rules:

- Use the SDLC vocabulary where applicable: requirements, specifications, design, development/implementation, testing/debugging, integration, installation, maintenance.

- Use `Practice` as the activity heading for learner tasks unless a coding task is explicitly required, in which case label the activity `Try it` and indicate the required language (e.g., "Try it — Python").

- Where the ModulePlan specifies an Outcome (e.g., `Outcomes: SE-11-01`) include that line near the top of the section's `index.md`.

- Prefer concise lists of bullet learning points that mirror the ModulePlan phrasing.

Example (map for Section 1.1):

### 1.1 Software development steps

- Outcomes: SE-11-01

- Learn: requirements, specifications, design, development/implementation, testing/debugging, integration, installation, maintenance.

- Practice: map a simple "Grade Calculator" through each step.

- Diagram: PlantUML activity diagram of SDLC.

Following this pattern keeps content consistent with teaching goals and assessment mapping.

## Repository structure (example)

```text
docs/
  Year11/
    ProgrammingFundamentals/
      ModulePlan.md
      Chapter-01-Software-Development/
        Section-01-Software-Development-Steps/
          index.md
          quiz.md
        Section-02-Tools-and-Collaboration/
          index.md
          quiz.md
        Section-03-Documentation-and-Code-Style/
          index.md
          quiz.md
        Section-04-Project-Management-Models/
          index.md
          quiz.md
      Chapter-02-Designing-Algorithms/
      Chapter-03-Data-for-Software-Engineering/
      Chapter-04-Developing-Solutions-with-Code/
```

Conventions:

- Chapters: `Chapter-XX-Name` (zero-padded).

- Sections: `Section-YY-Short-Slug` (zero-padded) under a Chapter.

- Each Section includes `index.md` and `quiz.md`. Place images/code alongside or in `assets/`.

## Diagrams (PlantUML)

- Prefer fenced PlantUML blocks. If rendering isn’t enabled yet, include a static SVG and keep the source fence for later.

Example:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false
actor Student
participant "Textbook Site" as Site
Student -> Site: Open Section
Site --> Student: Rendered page
@enduml
```

## Section template (index.md)

- Title (H1): succinct, action-oriented.

- Outcomes covered: e.g., SE-11-02.

- Why it matters (2–3 sentences).

- Concepts (progressive mini-sections).

- Guided example (short Python).

- Try it (1–3 tiny tasks).

- Diagram(s) (PlantUML or SVG fallback).

- Recap and glossary (if needed).

Quiz (`quiz.md`): 3–8 questions (mix of multiple-choice and short-answer). Mark correct choices with `{ data-correct }` and use grade/reset buttons with `data-quiz-action`.

### Quiz Format Structure

Use a single admonition block for the entire quiz:

```markdown

## Section Title - Quiz

!!! quiz "Check your understanding"

    1. Question text here?

        - Option A
        - Option B { data-correct }
        - Option C

    2. Another question?

        - First choice
        - Second choice { data-correct }
        - Third choice
```

**Indentation Rules:**

- Question numbers (1., 2., etc.) start at the beginning of the line

- Options are indented with 4 spaces (each starts with `-`)

- Code blocks within questions must be indented to align with the question content

- Correct answers are marked with `{ data-correct }` at the end of the option line

## Navigation

- Use `.nav.yml` to add pages once they exist. Keep labels human‑readable; no bracketed suffixes like "(Overview)".

## Notes on syllabus coverage

- Programming Fundamentals Chapter 2 must explicitly include: I/O and purpose; desk and peer checking; connections to subroutines/functions; identifying procedures/functions; and a brief paradigms overview.

- Programming Fundamentals Chapter 4 must explicitly include: arrays (1-D/2-D), lists, trees, stacks, hash tables; debugging tools (breakpoints, stepping, watches, function interfaces, debug prints, IDE tools); test data (boundary, path coverage, faulty/abnormal); and typical errors (syntax, logic, runtime).
