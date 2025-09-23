# Contributing to NSW HSC Software Engineering Textbook

Thank you for your interest in contributing to this open source educational project! This textbook aims to provide comprehensive, accessible learning materials for NSW HSC Software Engineering students, and we welcome contributions from educators, students, developers, and anyone passionate about quality education.

## 🎯 Project Vision

This project creates a modern, interactive digital textbook that:

- Aligns perfectly with the NSW HSC Software Engineering 11–12 Syllabus (2022+)

- Provides practical, hands-on learning through code examples and interactive elements

- Maintains high educational standards while being freely accessible

- Incorporates real-world case studies and industry-relevant examples

- Supports diverse learning styles through multiple content formats

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Python 3.13+ (or any Python 3.x version)

- [uv](https://docs.astral.sh/uv/) for Python package management

- Git for version control

- A text editor or IDE (VS Code recommended)

- Basic understanding of Markdown syntax

### Development Environment Setup

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/your-username/NSW-HSC-Software-Engineering-Textbook.git
   cd NSW-HSC-Software-Engineering-Textbook

   ```

2. **Install dependencies**:

   ```powershell
   uv sync

   ```

3. **Activate the virtual environment**:

   ```powershell
   # Windows PowerShell
   .\.venv\Scripts\activate
   
   # macOS/Linux
   source .venv/bin/activate

   ```

4. **Start the development server**:

   ```powershell
   # Use our custom script (recommended)
   .\scripts\serve.ps1
   
   # Or use MkDocs directly
   mkdocs serve

   ```

5. **Open your browser** to `http://127.0.0.1:8000` to view the site

#### Kroki Server

The server used to generate diagrams at runtime is a local setup. Due to the amount of diagrams in this documentation the public server rate limits really quickly. Comment out the kroki plugin in `mkdocs.yml` if you cannot run the kroki server or if you want faster development speeds.

When using the kroki server I reccomend to run the docs with:

```powershell 
mkdocs serve --no-livereload

```

## 📋 Content Guidelines

### Structure and Organization

**File Organization**:

```
docs/Year{11|12}/{ModuleName}/Chapter-{XX}-{Name}/Section-{YY}-{Name}/
├── index.md    # Main educational content
└── quiz.md     # Interactive assessment questions

```

**Naming Conventions**:

- Chapters: `Chapter-{01-26}-{Descriptive-Name}` (zero-padded numbers)

- Sections: `Section-{01-99}-{Descriptive-Name}` (zero-padded numbers)

- Use kebab-case for descriptive names (e.g., `Chapter-05-OOP-foundations`)

- Always include both `index.md` and `quiz.md` for each section

### Visual Elements

**Diagrams**:

- Use PlantUML for system diagrams, class diagrams, and process flows

- Keep diagrams simple and focused on educational concepts

- Include source code in fenced blocks before generated diagrams

- Escape double underscores in method names (`\_\_init\_\_`)

**Images and Media**:

- Include descriptive alt text for accessibility

- Use high-contrast colors for readability

- Ensure images work well in both light and dark themes

- Keep file sizes reasonable for fast loading

## 🔧 Technical Guidelines

### Development Workflow

**Branch Management**:

1. Create a feature branch from `main` for your changes

2. Use descriptive branch names (e.g., `feature/section-12-security`, `fix/quiz-formatting`)

3. Keep changes focused and atomic

4. Test thoroughly before submitting pull requests

**Testing and Validation**:

```powershell
# Run smoke tests to validate build
python scripts/smoke_test.py

# Check Markdown formatting
python scripts/simple_md_lint.py

# Fix quiz formatting issues
python scripts/fix_quiz_format.py

```

### MkDocs Configuration

**Navigation Management**:

- Control site navigation via `docs/.nav.yml` using awesome-nav plugin

## 📜 Code of Conduct

### Community Standards

We are committed to providing a welcoming, inclusive environment for all contributors. Please:

- Be respectful and constructive in all interactions

- Focus on what is best for the educational community

- Show empathy and kindness to other contributors

- Accept constructive feedback gracefully

- Learn from mistakes and help others do the same

### Educational Focus

Remember that this project serves students and educators:

- Prioritize educational value in all contributions

- Consider diverse learning needs and styles

- Maintain high standards for accuracy and clarity

- Support inclusive and accessible education

- Respect intellectual property and attribution requirements

## 📄 License and Legal

### Content Licensing

- All educational content is released under MIT License

- Contributions become part of the open source project

- Ensure you have rights to contribute any external content

- Provide proper attribution for referenced materials

---

Thank you for contributing to this important educational resource! Together, we can create the best possible learning experience for NSW HSC Software Engineering students.

For questions about contributing, please open a GitHub issue or start a discussion. We're here to help and excited to work with you!
