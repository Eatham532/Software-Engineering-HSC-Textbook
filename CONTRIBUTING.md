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

## 📝 Types of Contributions

### 1. Content Contributions

**Educational Content**:
- Review and improve existing explanations for clarity and accuracy
- Add practical examples and case studies from real-world scenarios
- Create additional practice exercises and coding challenges
- Develop interactive demonstrations and visual aids
- Suggest improvements to learning progression and scaffolding

**Syllabus Alignment**:
- Ensure content matches NSW HSC Software Engineering outcomes
- Verify terminology consistency with official syllabus documents
- Add cross-references between related concepts across modules
- Validate assessment activities align with HSC expectations

### 2. Technical Contributions

**Interactive Features**:
- Enhance the quiz system with new question types
- Improve diagram rendering and modal interactions
- Add new educational tools and calculators
- Develop progressive disclosure features for complex topics

**Performance & Accessibility**:
- Optimize site performance and loading times
- Improve mobile responsiveness and touch interactions
- Enhance WCAG compliance and screen reader support
- Add keyboard navigation improvements

### 3. Community Contributions

**Documentation & Guides**:
- Improve setup instructions and troubleshooting guides
- Create educator resources and teaching guides
- Develop student self-assessment tools
- Write case studies of successful classroom implementations

**Quality Assurance**:
- Test content across different devices and browsers
- Report bugs and usability issues
- Validate links and ensure content accuracy
- Review code examples for best practices

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

### Content Standards

**Writing Style**:
- Use clear, concise language appropriate for Year 11-12 students
- Write in third person neutral voice
- Use Australian English spelling and terminology
- Keep paragraphs short (1-3 sentences) for readability
- Include practical examples that students can relate to

**Educational Structure**:
Each section should follow this template:
- **H1**: Section title (numbered, e.g., "1.1 Software development steps")
- **H2**: Why it matters (relevance and context)
- **H2**: Concepts (core learning content)
  - **H3**: Individual concept explanations
  - **H3**: Guided examples and demonstrations
- **H2**: Try it / Practice (hands-on activities)
- **H2**: Recap (summary and key takeaways)

**Code Examples**:
- Use Python as the primary programming language
- Provide working, tested code that students can run
- Include comments explaining key concepts
- Progress from simple REPL examples to complete scripts
- Avoid external dependencies unless essential to the learning objective

### Assessment Guidelines

**Quiz Format**:
Use the custom quiz admonition format:
```markdown
!!! quiz "Section X.Y Quiz: Topic Name"

    1. Question text here?
        - Option A
        - Option B {data-correct}
        - Option C
        - Option D
```

**Quiz Standards**:
- Include 6-10 questions per section
- Mix multiple choice and multiple select questions
- Mark correct answers with `{data-correct}` in option text
- Focus on understanding and application, not memorization
- Include questions that connect to other parts of the curriculum

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
- **Never** add manual `nav:` sections to `mkdocs.yml`
- Use clear, descriptive navigation labels
- Maintain logical hierarchy and progression

**Plugin Usage**:
- Kroki plugin handles PlantUML and Mermaid diagrams
- Include-markdown plugin enables content reuse
- Macros plugin provides template variables
- Awesome-nav generates navigation from `.nav.yml`

### Custom Features

**Quiz System**:
- JavaScript handles interaction and grading
- CSS provides visual feedback and styling
- Use `window.__quiz_debug = true` for debugging
- Test across multiple browsers and devices

**Diagram Integration**:
- Kroki wrapper post-processes SVGs for modal functionality
- Diagrams become clickable with expand buttons
- Modal JavaScript provides larger viewing options
- Responsive design adapts to different screen sizes

## 📊 Quality Standards

### Code Quality

**Python Code Examples**:
- Follow PEP 8 style guidelines
- Include comprehensive docstrings
- Use meaningful variable and function names
- Provide error handling examples where appropriate
- Test all code examples to ensure they work

**Markdown Quality**:
- Use consistent heading hierarchy
- Maintain proper indentation for lists and code blocks
- Include blank lines for readability
- Avoid overly long lines (aim for ~100 characters)

### Educational Quality

**Learning Progression**:
- Introduce concepts in logical order
- Build complexity gradually
- Provide sufficient practice opportunities
- Connect new concepts to previously learned material
- Include real-world applications and context

**Assessment Alignment**:
- Ensure quizzes test stated learning objectives
- Include questions at different cognitive levels
- Provide immediate feedback for incorrect answers
- Link assessment to practical applications

## 🐛 Bug Reports and Issues

### Reporting Bugs

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce the issue
- Expected vs. actual behavior
- Browser/device information if relevant
- Screenshots or error messages if applicable

### Content Issues

For educational content problems:
- Identify specific section and content area
- Suggest improvements or corrections
- Provide evidence or references for factual corrections
- Consider impact on learning progression

## 🎓 Educator Resources

### Classroom Implementation

**Teaching Guides**:
- Suggested pacing and sequencing
- Prerequisites and preparation requirements
- Extension activities for advanced students
- Differentiation strategies for diverse learners

**Assessment Integration**:
- Alignment with HSC assessment requirements
- Suggested formative assessment strategies
- Portfolio and project ideas
- Peer assessment activities

### Professional Development

**Training Materials**:
- Introduction to digital textbook features
- Best practices for interactive content delivery
- Technology integration strategies
- Student engagement techniques

## 📞 Getting Help

### Community Support

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Pull Requests**: Contribute code and content improvements
- **Documentation**: Refer to this guide and inline comments

### Technical Support

For technical issues:
1. Check existing GitHub issues for similar problems
2. Review the development setup instructions
3. Test with a fresh virtual environment
4. Provide detailed error messages and logs

### Educational Support

For curriculum and pedagogical questions:
1. Review NSW HSC Software Engineering syllabus documents
2. Consult module learning outcomes and objectives
3. Consider progression from Year 11 to Year 12 expectations
4. Align with assessment and reporting requirements

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

## 🎉 Recognition

### Contributor Acknowledgment

We value all contributions and recognize contributors through:

- Attribution in release notes and documentation
- Recognition in project README and about pages
- Invitation to join the project maintenance team
- Opportunities to present at educational conferences
- Professional development and networking opportunities

### Impact Measurement

Your contributions help:

- Thousands of students access quality educational resources
- Educators deliver engaging, effective instruction
- The broader community benefit from open educational materials
- Advance the state of computer science education in Australia

## 📄 License and Legal

### Content Licensing

- All educational content is released under MIT License
- Contributions become part of the open source project
- Ensure you have rights to contribute any external content
- Provide proper attribution for referenced materials

### Privacy and Safety

- Protect student privacy in any examples or case studies
- Use anonymized or fictional data in demonstrations
- Follow educational sector privacy and safety guidelines
- Report any security or safety concerns immediately

---

Thank you for contributing to this important educational resource! Together, we can create the best possible learning experience for NSW HSC Software Engineering students.

For questions about contributing, please open a GitHub issue or start a discussion. We're here to help and excited to work with you!