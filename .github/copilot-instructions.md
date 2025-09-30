# Copilot Instructions for NSW HSC Software Engineering Textbook

## Project Architecture Overview

This is an **educational MkDocs site** for NSW HSC Software Engineering, structured as a hierarchical textbook with interactive elements. The project is **90% AI-generated content** with human editing for accuracy.

### Core Structure Pattern

```text

docs/Year{11|12}/{ModuleName}/Chapter-{XX}-{Name}/Section-{YY}-{Name}/
├── index.md    # Main content with PlantUML diagrams, code examples
└── quiz.md     # Interactive assessments (6-10 questions each)

```text

**Critical**: All navigation is controlled by `docs/.nav.yml` via mkdocs-awesome-nav. **Never** add manual `nav:` sections to `mkdocs.yml`.

### CRITICAL: Length Management for AI Contributors

Before writing substantial content, AI contributors MUST:

1. **Estimate content length** based on learning objectives and code examples required

2. **Check if content will exceed reasonable response limits** (typically ~1000-2000 lines)

3. **If content will be large, inform the user BEFORE starting** and propose breaking into manageable chunks

4. **Plan chunk boundaries** logically (by major topics, not arbitrary cuts)

5. **Update todo lists** to reflect multi-part approach

### Content Creation Standards

**ModulePlan.md Pattern**: Each module has a plan defining learning outcomes and section structure:

- Outcomes map to NSW syllabus codes (e.g., `SE-12-06`)

- Author deliverables: `index.md` + `quiz.md` per section

- Folder naming: `Chapter-{Zero-padded}-{Kebab-case}` / `Section-{Zero-padded}-{Kebab-case}`

**Section Content Requirements**:

- Educational explanations with practical Python examples (beginner-first, one idea at a time)

- PlantUML diagrams for system modeling (wrapped by custom `kroki_wrapper.py`)

- Interactive quizzes using `!!! quiz` admonition blocks

- Syllabus-aligned terminology and learning outcomes

- **Python only** - avoid external packages unless essential

## Development Workflows

### Local Development

```powershell
# Primary development command (use this, not raw mkdocs serve)
.\scripts\serve.ps1

```text

This script sets `PYTHONPATH` to repo root for custom Python extensions and activates the venv.

**Before running Python code**: Always activate the project virtual environment with `.venv\Scripts\activate`

### Build & Validation

```bash
python scripts/smoke_test.py  # Validates build + diagram integration
python scripts/fix_quiz_format.py  # Standardizes quiz formatting across Year12
python scripts/simple_md_lint.py  # Basic Markdown linting and formatting

```text

### Python Environment

- **uv** for dependency management (`uv sync` to install)

- Python 3.13+ target (but 3.x compatible)

- Custom markdown extensions in project root (`kroki_wrapper.py`)

- Typical development sequence:

  1. Activate virtual environment: `.venv\Scripts\activate`

  2. Install dependencies: `uv pip install -e .` (or `pip install -e .`)

  3. Serve locally: `mkdocs serve`

## Custom Integrations

### Diagram System

- **kroki_wrapper.py**: Post-processes Kroki SVGs to add modal expand buttons

- PlantUML blocks become clickable diagrams with `🔍 View Larger` functionality

- Diagrams use `diagram-container` CSS class with modal JavaScript

### Interactive Quiz System

- **Custom admonition**: `!!! quiz "Quiz Title"`

- **Format**: Ordered list questions with unordered list options

- **Markers**: `{data-correct}` in option text (auto-converted to attributes)

- **Multi-select**: Detected when multiple options marked correct

- **JavaScript**: `quiz.js` handles interaction, grading, visual feedback

- **IMPORTANT**: Use Markdown-only format, NO HTML divs, scripts, or complex structures

### Quiz Formatting Standards

```markdown
!!! quiz "Section X.Y Quiz: Topic"
    
    1. Question text here?
        - Option A
        - Option B {data-correct}
        - Option C
        - Option D

```text

**Quiz Debugging**: If answers show "Try again" when correct:

1. Hard-refresh (Ctrl+F5) to ensure latest `quiz.js` loads

2. Set `window.__quiz_debug = true` in browser console for debug logs

3. Use browser console snippet from AI_README.md to inspect quiz state

## Content Structure & Authoring Standards

### Section Template (index.md)

Required structure:

- **H1**: Section title (short and numbered, e.g., "1.1 Software development steps")

- **H2**: Why it matters

- **H2**: Concepts

  - **H3**: Concept name (short)

  - **H3**: Guided example

- **H2**: Try it (or "Practice" for non-coding sections)

- **H2**: Recap

### Authoring Style Rules

- **Syllabus outcomes**: NEVER add "Outcomes: SE-XX-XX" lines to section files (belongs in ModulePlan.md only)

- **Cross-references**: Include "See also [section]" to connect concepts across modules

- **Paragraphs**: Keep short (1-3 sentences)

- **Lists**: Use spaces not tabs for proper indentation

- **Voice**: Third-person neutral, Australian spelling, plain language

- **Examples**: Progressive - start with REPL snippets, grow to small scripts

### PlantUML Diagrams

- **IMPORTANT**: Escape double underscores in method names (`\_\_init\_\_` not `__init__`)

- Use `kroki-plantuml` fenced blocks

- Keep diagrams simple and educational-focused

- Include source fence above any generated SVG

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
@enduml

```text

### PyMdownX Extensions Usage

- **Tabs**: Use for alternate views (Python vs Pseudocode)

- **Details**: Use `///` syntax instead of H4 headings for collapsible content

- **H4 headings (####) are NOT ALLOWED** - use details blocks instead

**Exercise/Solution Pattern**:

```markdown
/// details | Exercise 1: Problem Analysis
    type: question
    open: false

**Task**: Complete the problem identification phase.

/// details | Sample Solution
    type: success
    open: false

**Solution**: The coffee shop lacks...
///
///

```text

## Key Technical Patterns

### MkDocs Configuration

- **Theme**: Material with indigo palette, dual dark/light mode

- **Critical plugins**: awesome-nav, include-markdown, macros, kroki (commented), git-revision-date

- **Assets**: Custom CSS/JS in `docs/assets/` for quizzes, diagrams, theme adaptations

### Content Dependencies

- **NSW Syllabus alignment**: Use exact outcome codes and terminology from ModulePlan.md

- **Educational progression**: Year 11 → Year 12 complexity scaling

- **Cross-references**: Modules reference each other (OOP → Web Programming → Security)

- **SDLC vocabulary**: requirements, specifications, design, development/implementation, testing/debugging, integration, installation, maintenance

### File Naming Conventions

- Chapters: `Chapter-{01-26}-{Descriptive-Name}` (zero-padded)

- Sections: `Section-{01-99}-{Descriptive-Name}` (zero-padded)

- Display titles: Numbered (e.g., "24.3 WAgile hybrid approach")

- Files: Always `index.md` + `quiz.md` pairs

- Navigation: Use `.nav.yml` - avoid bracketed labels like "(Overview)"

### Authoring Principles

- **Beginner-first**: Introduce one idea at a time, tiny runnable examples

- **Python only**: Avoid external packages unless essential

- **Accessibility**: Alt text for images, high contrast, keyboard navigation

- **Mechatronics**: Defer device-specific coding until platform chosen

## Automation & Maintenance

### Content Scripts

- `fix_quiz_format.py`: Migrates old a/b/c/d format to dash format, adds titles

- `simple_md_lint.py`: Markdown standardization and formatting

- `smoke_test.py`: Post-build validation that diagram buttons exist

### Development Environment

- PowerShell scripts for Windows compatibility

- uv-based virtual environment (`.venv/Scripts/Activate.ps1`)

- PYTHONPATH injection for local module imports

### Linting & Quality

- **CURRENT POLICY**: Ignore markdown linting errors until the end of the module development

- Markdown headings should be sequential

- Lines should be ~100 characters max

- Run `scripts/simple_md_lint.py` before commits (but don't fix linting issues during active development)

- Build artifacts should not be committed (`site/`, `__pycache__/`)

- Focus on content creation and educational quality over strict markdown formatting during development phase

## Common Tasks

**Adding new content sections**:

1. Create folder structure following naming convention

2. Add both `index.md` and `quiz.md`

3. Update `docs/.nav.yml` navigation

4. Include NSW syllabus outcome codes

5. Add relevant PlantUML diagrams where appropriate

**Quiz creation**:

- Use `!!! quiz` admonition format

- 6-10 questions mixing multiple choice and short answer

- Mark correct answers with `{data-correct}`

- Test with dev server to verify interactivity

**Diagram integration**:

- Use PlantUML for system/architectural diagrams

- kroki_wrapper automatically adds expand functionality

- Diagrams become modal-viewable for better readability

**Syllabus alignment example (Section 1.1)**:

- Outcomes: SE-11-01

- Learn: requirements, specifications, design, development/implementation, testing/debugging, integration, installation, maintenance

- Practice: map a simple "Grade Calculator" through each step

- Diagram: PlantUML activity diagram of SDLC

This codebase prioritizes educational effectiveness, NSW syllabus compliance, and interactive learning features over generic documentation patterns.
