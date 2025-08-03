# GitHub Workflow

## Introduction

**GitHub** is like the social media platform for programmers - but instead of sharing photos and posts, developers share code, collaborate on projects, and build amazing software together. GitHub takes Git's powerful version control and adds a beautiful web interface, collaboration tools, and a thriving community of millions of developers worldwide.

/// details | Why GitHub Rules the World 🌍
    type: important

**GitHub's massive impact:**
- **100+ million developers** use GitHub worldwide
- **330+ million repositories** host everything from personal projects to enterprise applications
- **90% of Fortune 100 companies** use GitHub for development
- **Open source revolution** - Linux, React, TensorFlow all live on GitHub

**What GitHub adds to Git:**
- **Beautiful web interface** - See your code, history, and branches visually
- **Pull requests** - Propose changes and discuss them before merging
- **Issue tracking** - Manage bugs, features, and project tasks
- **Actions** - Automated testing, deployment, and workflows
- **Community features** - Discover projects, contribute to open source
- **Professional credibility** - Your GitHub profile is your developer portfolio

///

## Setting Up Your GitHub Workflow

### Creating Your StudyBuddy Repository

```python
class GitHubRepository:
    """
    Model of a GitHub repository with all its features
    """
    
    def __init__(self, name, owner, visibility="public"):
        self.name = name
        self.owner = owner
        self.visibility = visibility
        self.description = ""
        self.topics = []
        self.collaborators = []
        self.branches = ["main"]
        self.pull_requests = []
        self.issues = []
        self.releases = []
        self.stars = 0
        self.forks = 0
        self.watchers = 0
    
    def create_repository(self, description, topics=None):
        """Create a new GitHub repository for StudyBuddy"""
        self.description = description
        self.topics = topics or []
        
        print(f"🚀 CREATING GITHUB REPOSITORY")
        print("=" * 35)
        print(f"Name: {self.name}")
        print(f"Owner: {self.owner}")
        print(f"Description: {self.description}")
        print(f"Visibility: {self.visibility}")
        print(f"Topics: {', '.join(self.topics)}")
        
        # Repository setup checklist
        setup_steps = [
            "✅ Initialize with README.md",
            "✅ Add .gitignore for Python",
            "✅ Choose MIT License (open source friendly)",
            "✅ Create main branch protection rules",
            "✅ Set up issue templates",
            "✅ Configure branch naming conventions"
        ]
        
        print("\n📋 REPOSITORY SETUP:")
        for step in setup_steps:
            print(f"  {step}")
        
        return f"https://github.com/{self.owner}/{self.name}"
    
    def add_collaborator(self, username, permission_level="write"):
        """Add team member to StudyBuddy project"""
        collaborator = {
            "username": username,
            "permission": permission_level,  # read, write, admin
            "added_date": "2024-03-15",
            "status": "pending"
        }
        
        self.collaborators.append(collaborator)
        
        print(f"👥 COLLABORATOR ADDED")
        print(f"Username: {username}")
        print(f"Permission: {permission_level}")
        print(f"Invitation sent! They'll get an email to accept.")
        
        return collaborator
    
    def create_issue(self, title, body, labels=None, assignee=None):
        """Create issue for bug reports or feature requests"""
        issue_number = len(self.issues) + 1
        
        issue = {
            "number": issue_number,
            "title": title,
            "body": body,
            "labels": labels or [],
            "assignee": assignee,
            "state": "open",
            "created_by": self.owner,
            "created_at": "2024-03-15T10:30:00Z",
            "comments": []
        }
        
        self.issues.append(issue)
        
        print(f"🐛 ISSUE CREATED")
        print(f"#{issue_number}: {title}")
        print(f"Labels: {', '.join(labels) if labels else 'None'}")
        print(f"Assignee: {assignee or 'Unassigned'}")
        
        return issue_number
    
    def create_pull_request(self, title, description, source_branch, target_branch="main"):
        """Create pull request for code review"""
        pr_number = len(self.pull_requests) + 1
        
        pull_request = {
            "number": pr_number,
            "title": title,
            "description": description,
            "source_branch": source_branch,
            "target_branch": target_branch,
            "state": "open",
            "author": self.owner,
            "created_at": "2024-03-15T10:30:00Z",
            "reviewers": [],
            "checks_status": "pending",
            "mergeable": True,
            "draft": False
        }
        
        self.pull_requests.append(pull_request)
        
        print(f"🔍 PULL REQUEST CREATED")
        print(f"#{pr_number}: {title}")
        print(f"From: {source_branch} → To: {target_branch}")
        print(f"Status: Open and ready for review")
        
        return pr_number

# Create StudyBuddy repository
studybuddy_repo = GitHubRepository("studybuddy", "sarah-johnson")

# Set up the repository
repo_url = studybuddy_repo.create_repository(
    description="📚 Smart study management app for students - track assignments, time study sessions, and boost productivity!",
    topics=["education", "productivity", "student-tools", "python", "study-app"]
)

# Add team members
studybuddy_repo.add_collaborator("mike-chen", "write")
studybuddy_repo.add_collaborator("emma-wilson", "write")

# Create first issue
studybuddy_repo.create_issue(
    title="Add user authentication system",
    body="""
## Description
Implement secure user authentication to allow students to create accounts and protect their data.

## Requirements
- [ ] User registration with email validation
- [ ] Secure password hashing (bcrypt)
- [ ] Login/logout functionality
- [ ] Password reset via email
- [ ] Session management

## Acceptance Criteria
- Users can register with email and password
- Passwords must meet security requirements (8+ chars, mixed case, number)
- Email confirmation required before account activation
- Users can reset forgotten passwords
- Sessions expire after 30 days of inactivity

## Priority
High - Required for MVP release
    """,
    labels=["enhancement", "high-priority", "authentication"],
    assignee="sarah-johnson"
)
```

### Repository Organization and Settings

```python
class GitHubRepoSettings:
    """
    Best practices for configuring your GitHub repository
    """
    
    def __init__(self):
        self.branch_protection_rules = {}
        self.issue_templates = {}
        self.pr_template = ""
        self.code_owners = {}
    
    def setup_branch_protection(self):
        """Configure branch protection for main branch"""
        protection_rules = {
            "require_pull_request_reviews": True,
            "required_approving_reviews": 1,
            "dismiss_stale_reviews": True,
            "require_code_owner_reviews": False,
            "require_status_checks": True,
            "required_status_checks": ["ci/tests", "ci/linting"],
            "enforce_admins": False,
            "allow_force_pushes": False,
            "allow_deletions": False
        }
        
        self.branch_protection_rules["main"] = protection_rules
        
        print("🛡️ BRANCH PROTECTION CONFIGURED")
        print("=" * 35)
        print("Main branch protection rules:")
        for rule, value in protection_rules.items():
            status = "✅" if value else "❌"
            rule_name = rule.replace("_", " ").title()
            print(f"  {status} {rule_name}: {value}")
        
        print("\n💡 What this means:")
        print("• All changes must go through pull requests")
        print("• At least 1 approval required before merging")
        print("• Tests must pass before merging")
        print("• No force pushes or branch deletion allowed")
    
    def create_issue_templates(self):
        """Create templates for different types of issues"""
        
        # Bug report template
        bug_template = """
---
name: Bug Report
about: Report a bug to help us improve StudyBuddy
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots to help explain the problem.

## Environment
- OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- Browser: [e.g. Chrome 96, Firefox 95, Safari 15]
- StudyBuddy Version: [e.g. v1.2.0]

## Additional Context
Any other context about the problem here.
        """
        
        # Feature request template
        feature_template = """
---
name: Feature Request
about: Suggest a new feature for StudyBuddy
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description
A clear description of what you want to happen.

## Problem Statement
What problem does this feature solve? Why is it needed?

## Proposed Solution
Describe your ideal solution in detail.

## Alternative Solutions
Describe any alternative solutions you've considered.

## User Stories
- As a student, I want to... so that I can...
- As a teacher, I want to... so that I can...

## Acceptance Criteria
- [ ] Specific condition 1
- [ ] Specific condition 2
- [ ] Specific condition 3

## Priority
- [ ] Low (nice to have)
- [ ] Medium (would be useful)
- [ ] High (important for user experience)
- [ ] Critical (required for core functionality)

## Additional Context
Screenshots, mockups, or examples that help explain the feature.
        """
        
        self.issue_templates = {
            "bug_report.md": bug_template,
            "feature_request.md": feature_template
        }
        
        print("📝 ISSUE TEMPLATES CREATED")
        print("=" * 30)
        print("Templates available:")
        print("• Bug Report - Standardized bug reporting")
        print("• Feature Request - Structured feature proposals")
        print("\nBenefits:")
        print("• Consistent information collection")
        print("• Faster issue triage and resolution")
        print("• Better communication with users")
    
    def create_pr_template(self):
        """Create pull request template"""
        pr_template = """
## Summary
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Changes Made
- List specific changes made in this PR
- Use bullet points for clarity
- Include any new files created or deleted

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed
- [ ] Browser testing (if UI changes)

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of the code completed
- [ ] Code is properly commented
- [ ] Corresponding changes to documentation made
- [ ] No new warnings introduced
- [ ] Any dependent changes have been merged and published

## Related Issues
Closes #(issue number)
        """
        
        self.pr_template = pr_template
        
        print("🔍 PULL REQUEST TEMPLATE CREATED")
        print("=" * 40)
        print("Template ensures PRs include:")
        print("• Clear summary of changes")
        print("• Type of change categorization")
        print("• Testing verification")
        print("• Quality checklist")
        print("• Links to related issues")

# Configure StudyBuddy repository settings
repo_settings = GitHubRepoSettings()
repo_settings.setup_branch_protection()
repo_settings.create_issue_templates()
repo_settings.create_pr_template()
```

## Pull Request Workflow

### Creating and Managing Pull Requests

```python
class PullRequestWorkflow:
    """
    Master the art of professional pull requests
    """
    
    def __init__(self):
        self.pr_stages = [
            "Draft", "Ready for Review", "In Review", 
            "Changes Requested", "Approved", "Merged"
        ]
    
    def create_feature_pr(self):
        """Step-by-step feature development and PR creation"""
        print("🚀 FEATURE DEVELOPMENT WORKFLOW")
        print("=" * 40)
        
        workflow_steps = [
            {
                "step": 1,
                "title": "Create Feature Branch",
                "commands": [
                    "git checkout main",
                    "git pull origin main",
                    "git checkout -b feature/study-timer"
                ],
                "description": "Start from latest main branch"
            },
            {
                "step": 2,
                "title": "Implement Feature",
                "commands": [
                    "# Write code incrementally",
                    "git add timer.py",
                    "git commit -m 'feat(timer): add basic timer functionality'",
                    "git add timer_ui.py", 
                    "git commit -m 'feat(timer): add timer user interface'",
                    "git add tests/test_timer.py",
                    "git commit -m 'test(timer): add comprehensive timer tests'"
                ],
                "description": "Make small, focused commits"
            },
            {
                "step": 3,
                "title": "Push Branch",
                "commands": [
                    "git push origin feature/study-timer"
                ],
                "description": "Upload branch to GitHub"
            },
            {
                "step": 4,
                "title": "Create Pull Request",
                "commands": [
                    "# Go to GitHub repository",
                    "# Click 'Compare & pull request'",
                    "# Fill out PR template",
                    "# Add reviewers and labels"
                ],
                "description": "Open PR for team review"
            }
        ]
        
        for step in workflow_steps:
            print(f"\n📋 Step {step['step']}: {step['title']}")
            print(f"   {step['description']}")
            print("   Commands:")
            for cmd in step['commands']:
                print(f"     {cmd}")
    
    def pr_review_process(self):
        """Demonstrate professional code review process"""
        print("\n🔍 PULL REQUEST REVIEW PROCESS")
        print("=" * 40)
        
        review_stages = [
            {
                "stage": "Initial Review",
                "reviewer": "Mike Chen (UI/UX Focus)",
                "feedback": [
                    "✅ Timer interface looks great!",
                    "📝 Consider adding accessibility labels",
                    "💡 Maybe add a progress ring animation?",
                    "❓ How does this work on mobile screens?"
                ]
            },
            {
                "stage": "Code Review",
                "reviewer": "Emma Wilson (QA Focus)",
                "feedback": [
                    "✅ Test coverage looks comprehensive",
                    "🐛 Found edge case: what if timer reaches 24 hours?",
                    "⚡ Performance concern: timer updates every second",
                    "🔒 Security: ensure timer can't be negative"
                ]
            },
            {
                "stage": "Final Review",
                "reviewer": "Sarah Johnson (Tech Lead)",
                "feedback": [
                    "✅ Addresses all previous concerns",
                    "✅ Code quality meets our standards", 
                    "✅ Documentation is clear and complete",
                    "🚀 Ready to merge!"
                ]
            }
        ]
        
        for review in review_stages:
            print(f"\n👤 {review['stage']} - {review['reviewer']}")
            for feedback in review['feedback']:
                print(f"     {feedback}")
        
        print(f"\n🎉 PR APPROVED AND MERGED!")
        print(f"   Feature branch deleted automatically")
        print(f"   Main branch updated with new timer feature")
    
    def pr_best_practices(self):
        """Share best practices for pull requests"""
        print("\n💡 PULL REQUEST BEST PRACTICES")
        print("=" * 40)
        
        practices = {
            "Size": [
                "Keep PRs small and focused (< 400 lines changed)",
                "One feature per PR for easier review",
                "Break large features into multiple PRs"
            ],
            "Description": [
                "Clear title that explains what changed",
                "Detailed description of why changes were made",
                "Screenshots for UI changes",
                "Link to related issues"
            ],
            "Code Quality": [
                "All tests pass before requesting review",
                "Code follows project style guidelines",
                "No merge conflicts with main branch",
                "Documentation updated if needed"
            ],
            "Review Process": [
                "Request specific reviewers based on expertise",
                "Respond to feedback promptly and professionally",
                "Make requested changes in new commits",
                "Don't take feedback personally - it's about the code"
            ]
        }
        
        for category, tips in practices.items():
            print(f"\n📋 {category}:")
            for tip in tips:
                print(f"   • {tip}")

# Demonstrate PR workflow
pr_workflow = PullRequestWorkflow()
pr_workflow.create_feature_pr()
pr_workflow.pr_review_process()
pr_workflow.pr_best_practices()
```

### Code Review Best Practices

```python
class CodeReviewGuide:
    """
    Learn to give and receive effective code reviews
    """
    
    def __init__(self):
        self.review_types = ["approval", "changes_requested", "comment"]
    
    def effective_feedback_examples(self):
        """Examples of constructive code review feedback"""
        print("💬 EFFECTIVE CODE REVIEW FEEDBACK")
        print("=" * 40)
        
        feedback_examples = {
            "positive_reinforcement": [
                "Great job implementing the timer logic! The state management is very clean.",
                "Love the comprehensive test coverage - this gives me confidence in the feature.",
                "Nice use of type hints throughout. Makes the code much more readable.",
                "The error handling here is exactly right. Good defensive programming!"
            ],
            
            "constructive_suggestions": [
                "Consider extracting this validation logic into a separate function for reusability:",
                "This nested loop might have performance issues with large datasets. Could we use a dictionary lookup instead?",
                "The variable name 'data' is quite generic. Maybe 'timer_settings' would be more descriptive?",
                "This function is getting quite long. Could we break it into smaller, focused functions?"
            ],
            
            "questions_for_clarity": [
                "I'm not sure I understand the business logic here. Could you add a comment explaining why we multiply by 0.85?",
                "What happens if the user's timezone changes while the timer is running?",
                "Should we handle the case where the database connection fails during timer save?",
                "Is there a specific reason we're using setTimeout instead of setInterval here?"
            ],
            
            "security_and_safety": [
                "This user input should be sanitized before storing in the database.",
                "Consider adding rate limiting to prevent timer spam attacks.",
                "The error message reveals too much internal information. Could we make it more generic?",
                "We should validate that the timer duration is within reasonable bounds."
            ]
        }
        
        for category, examples in feedback_examples.items():
            category_name = category.replace("_", " ").title()
            print(f"\n📝 {category_name}:")
            for example in examples:
                print(f"   • {example}")
    
    def review_checklist(self):
        """Comprehensive checklist for code reviews"""
        print("\n✅ CODE REVIEW CHECKLIST")
        print("=" * 30)
        
        checklist = {
            "Functionality": [
                "Does the code do what it's supposed to do?",
                "Are edge cases handled appropriately?",
                "Is error handling comprehensive and user-friendly?",
                "Are there adequate tests for the new functionality?"
            ],
            
            "Code Quality": [
                "Is the code easy to read and understand?",
                "Are variable and function names descriptive?",
                "Is the code properly organized and structured?",
                "Are there any obvious performance issues?"
            ],
            
            "Security": [
                "Is user input properly validated and sanitized?",
                "Are there any potential security vulnerabilities?",
                "Is sensitive data handled appropriately?",
                "Are authentication and authorization correct?"
            ],
            
            "Maintainability": [
                "Is the code consistent with project conventions?",
                "Is there adequate documentation and comments?",
                "Are dependencies reasonable and well-managed?",
                "Will this code be easy to modify in the future?"
            ]
        }
        
        for category, items in checklist.items():
            print(f"\n🔍 {category}:")
            for item in items:
                print(f"   □ {item}")
    
    def handling_feedback(self):
        """How to respond to code review feedback professionally"""
        print("\n🤝 RESPONDING TO FEEDBACK")
        print("=" * 30)
        
        response_strategies = {
            "When you agree with feedback": [
                "✅ 'Great catch! I'll fix that validation bug.'",
                "✅ 'You're absolutely right about the performance issue. I'll optimize that loop.'",
                "✅ 'Good point about the naming. I'll make those variables more descriptive.'"
            ],
            
            "When you need clarification": [
                "❓ 'Could you explain more about the security concern you mentioned?'",
                "❓ 'I'm not sure I understand the suggestion. Could you provide an example?'",
                "❓ 'What would you recommend as the best approach for handling this edge case?'"
            ],
            
            "When you disagree (respectfully)": [
                "🤔 'I see your point about performance, but I think the readability benefit outweighs the minimal performance cost in this case. What do you think?'",
                "🤔 'I considered that approach, but chose this one because of X, Y, Z. Are there other factors I should consider?'",
                "🤔 'That's an interesting perspective. Let me think about it and maybe we can discuss it in our next standup?'"
            ],
            
            "After making changes": [
                "🔄 'Fixed the validation issue in commit abc123. Please take another look!'",
                "🔄 'I've addressed all the feedback except the naming question - still thinking about the best approach for that.'",
                "🔄 'Updated the code based on your suggestions. The performance improvement is significant!'"
            ]
        }
        
        for situation, examples in response_strategies.items():
            print(f"\n{situation}:")
            for example in examples:
                print(f"   {example}")

# Show code review best practices
review_guide = CodeReviewGuide()
review_guide.effective_feedback_examples()
review_guide.review_checklist()
review_guide.handling_feedback()
```

## GitHub Actions and Automation

### Setting Up Continuous Integration

```python
class GitHubActions:
    """
    Automate testing, linting, and deployment with GitHub Actions
    """
    
    def __init__(self):
        self.workflows = {}
    
    def create_ci_workflow(self):
        """Create a comprehensive CI workflow for StudyBuddy"""
        ci_workflow = """
name: StudyBuddy CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v3
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest pytest-cov flake8 black isort
    
    - name: Lint with flake8
      run: |
        # Stop build if there are Python syntax errors or undefined names
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        # Exit-zero treats all errors as warnings
        flake8 . --count --exit-zero --max-complexity=10 --max-line-length=88 --statistics
    
    - name: Check code formatting with black
      run: black --check .
    
    - name: Check import sorting with isort
      run: isort --check-only .
    
    - name: Run tests with coverage
      run: |
        pytest --cov=src --cov-report=xml --cov-report=html
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        flags: unittests
        name: codecov-umbrella
        fail_ci_if_error: true

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security checks with bandit
      run: |
        pip install bandit
        bandit -r src/ -f json -o bandit-report.json
    
    - name: Run dependency vulnerability check
      run: |
        pip install safety
        safety check --json --output safety-report.json

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build application
      run: |
        python setup.py build
    
    - name: Create release artifact
      run: |
        tar -czf studybuddy-${{ github.sha }}.tar.gz src/
    
    - name: Upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: studybuddy-build
        path: studybuddy-${{ github.sha }}.tar.gz
        """
        
        self.workflows["ci.yml"] = ci_workflow
        
        print("🤖 GITHUB ACTIONS CI/CD WORKFLOW")
        print("=" * 40)
        print("Workflow includes:")
        print("✅ Multi-version Python testing (3.9, 3.10, 3.11)")
        print("✅ Code linting with flake8")
        print("✅ Code formatting with black")
        print("✅ Import sorting with isort")
        print("✅ Test coverage reporting")
        print("✅ Security scanning with bandit")
        print("✅ Dependency vulnerability checks")
        print("✅ Automated builds on main branch")
        print("✅ Artifact generation for releases")
        
        print(f"\n📁 Save as: .github/workflows/ci.yml")
    
    def create_deployment_workflow(self):
        """Create deployment workflow for StudyBuddy"""
        deploy_workflow = """
name: Deploy StudyBuddy

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v3
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run final tests
      run: pytest
    
    - name: Build for production
      run: |
        python setup.py build
        python setup.py sdist bdist_wheel
    
    - name: Deploy to staging
      run: |
        # Deploy to staging environment first
        echo "Deploying to staging..."
        # Your deployment commands here
    
    - name: Run smoke tests
      run: |
        # Basic functionality tests on staging
        echo "Running smoke tests..."
    
    - name: Deploy to production
      if: success()
      run: |
        # Deploy to production after staging success
        echo "Deploying to production..."
        # Your production deployment commands here
    
    - name: Notify team
      if: always()
      run: |
        # Send notification to team about deployment status
        echo "Deployment completed!"
        """
        
        self.workflows["deploy.yml"] = deploy_workflow
        
        print("\n🚀 DEPLOYMENT WORKFLOW")
        print("=" * 25)
        print("Deployment features:")
        print("✅ Triggered by GitHub releases")
        print("✅ Final test verification")
        print("✅ Staging deployment first")
        print("✅ Smoke testing on staging")
        print("✅ Production deployment")
        print("✅ Team notifications")
        
        print(f"\n📁 Save as: .github/workflows/deploy.yml")
    
    def create_issue_automation(self):
        """Automate issue management"""
        issue_automation = """
name: Issue Management

on:
  issues:
    types: [opened, labeled]
  issue_comment:
    types: [created]

jobs:
  triage:
    runs-on: ubuntu-latest
    if: github.event.action == 'opened'
    
    steps:
    - name: Add labels to new issues
      uses: actions/github-script@v6
      with:
        script: |
          const issue = context.payload.issue;
          const body = issue.body.toLowerCase();
          
          // Auto-label based on issue content
          let labels = ['triage'];
          
          if (body.includes('bug') || body.includes('error') || body.includes('broken')) {
            labels.push('bug');
          }
          
          if (body.includes('feature') || body.includes('enhancement')) {
            labels.push('enhancement');
          }
          
          if (body.includes('documentation') || body.includes('docs')) {
            labels.push('documentation');
          }
          
          if (body.includes('security') || body.includes('vulnerability')) {
            labels.push('security', 'high-priority');
          }
          
          // Add labels to issue
          await github.rest.issues.addLabels({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issue.number,
            labels: labels
          });
    
    - name: Welcome new contributors
      uses: actions/github-script@v6
      if: github.event.issue.author_association == 'FIRST_TIME_CONTRIBUTOR'
      with:
        script: |
          await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.payload.issue.number,
            body: `👋 Thanks for your first contribution to StudyBuddy! 
            
            We appreciate you taking the time to report this issue. A team member will review it soon and add appropriate labels.
            
            If you're interested in contributing code, check out our [Contributing Guide](CONTRIBUTING.md) and look for issues labeled 'good-first-issue'.`
          });

  assign-reviewer:
    runs-on: ubuntu-latest
    if: contains(github.event.label.name, 'high-priority')
    
    steps:
    - name: Assign high-priority issues
      uses: actions/github-script@v6
      with:
        script: |
          // Auto-assign high-priority issues to tech lead
          await github.rest.issues.addAssignees({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.payload.issue.number,
            assignees: ['sarah-johnson']
          });
        """
        
        self.workflows["issues.yml"] = issue_automation
        
        print("\n🎫 ISSUE AUTOMATION")
        print("=" * 20)
        print("Automation features:")
        print("✅ Auto-label issues based on content")
        print("✅ Welcome first-time contributors")
        print("✅ Auto-assign high-priority issues")
        print("✅ Triage new issues automatically")
        
        print(f"\n📁 Save as: .github/workflows/issues.yml")

# Set up GitHub Actions for StudyBuddy
github_actions = GitHubActions()
github_actions.create_ci_workflow()
github_actions.create_deployment_workflow()
github_actions.create_issue_automation()
```

## Community and Open Source

### Making Your Project Community-Friendly

```python
class OpenSourceBestPractices:
    """
    Make StudyBuddy welcoming and contribution-friendly
    """
    
    def __init__(self):
        self.community_files = {}
    
    def create_contributing_guide(self):
        """Create comprehensive contributing guide"""
        contributing_guide = """
# Contributing to StudyBuddy 🎓

Thank you for your interest in contributing to StudyBuddy! We welcome contributions from developers of all skill levels.

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## How to Contribute

### 🐛 Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue using the Bug Report template
3. Provide detailed information including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details

### ✨ Suggesting Features

1. Check [Issues](../../issues) for similar feature requests
2. Create a new issue using the Feature Request template
3. Describe the problem you're trying to solve
4. Explain your proposed solution
5. Consider implementation complexity and user impact

### 💻 Contributing Code

#### First Time Contributors

Look for issues labeled `good-first-issue` or `help-wanted`. These are great starting points!

#### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/studybuddy.git`
3. Create virtual environment: `python -m venv venv`
4. Activate environment: `source venv/bin/activate` (Linux/Mac) or `venv\\Scripts\\activate` (Windows)
5. Install dependencies: `pip install -r requirements.txt`
6. Install development dependencies: `pip install -r requirements-dev.txt`
7. Run tests to ensure setup: `pytest`

#### Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes following our coding standards
3. Add tests for new functionality
4. Run the test suite: `pytest`
5. Run linting: `flake8 .`
6. Format code: `black .`
7. Commit changes with descriptive messages
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a Pull Request

#### Pull Request Guidelines

- Keep PRs focused and small (< 400 lines when possible)
- Include tests for new functionality
- Update documentation if needed
- Follow the PR template
- Be responsive to feedback during review

## Coding Standards

### Python Style

- Follow PEP 8 style guide
- Use `black` for code formatting
- Use `isort` for import sorting
- Maximum line length: 88 characters
- Use type hints where appropriate

### Testing

- Write tests for all new functionality
- Maintain test coverage above 90%
- Use descriptive test names
- Include edge cases and error conditions

### Documentation

- Update docstrings for new/changed functions
- Update README if user-facing changes
- Add inline comments for complex logic
- Keep documentation up to date with code

## Recognition

Contributors are recognized in several ways:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Featured in project README (for significant contributions)
- GitHub contributor statistics

## Questions?

Feel free to reach out by:

- Creating an issue with the `question` label
- Joining our [Discord community](https://discord.gg/studybuddy)
- Emailing the maintainers: studybuddy@example.com

Thanks for contributing! 🚀
        """
        
        self.community_files["CONTRIBUTING.md"] = contributing_guide
        
        print("📖 CONTRIBUTING GUIDE CREATED")
        print("=" * 35)
        print("Guide includes:")
        print("✅ Clear contribution process")
        print("✅ Development setup instructions")
        print("✅ Coding standards and guidelines")
        print("✅ Testing requirements")
        print("✅ Recognition for contributors")
    
    def create_code_of_conduct(self):
        """Create code of conduct for community"""
        code_of_conduct = """
# Code of Conduct

## Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in StudyBuddy a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## Scope

This Code of Conduct applies both within project spaces and in public spaces when an individual is representing the project or its community.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at studybuddy@example.com. All complaints will be reviewed and investigated promptly and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 1.4.
        """
        
        self.community_files["CODE_OF_CONDUCT.md"] = code_of_conduct
        
        print("\n🤝 CODE OF CONDUCT CREATED")
        print("=" * 30)
        print("Establishes:")
        print("✅ Community standards")
        print("✅ Expected behavior")
        print("✅ Enforcement guidelines")
        print("✅ Reporting procedures")
    
    def create_issue_labels(self):
        """Define standardized issue labels"""
        labels = {
            "Type": {
                "bug": {"color": "d73a4a", "description": "Something isn't working"},
                "enhancement": {"color": "a2eeef", "description": "New feature or request"},
                "documentation": {"color": "0075ca", "description": "Improvements or additions to documentation"},
                "question": {"color": "d876e3", "description": "Further information is requested"}
            },
            
            "Priority": {
                "low-priority": {"color": "7057ff", "description": "Low priority issue"},
                "medium-priority": {"color": "008672", "description": "Medium priority issue"},
                "high-priority": {"color": "d93f0b", "description": "High priority issue"},
                "critical": {"color": "b60205", "description": "Critical issue requiring immediate attention"}
            },
            
            "Status": {
                "triage": {"color": "ededed", "description": "Needs initial review and labeling"},
                "in-progress": {"color": "fbca04", "description": "Currently being worked on"},
                "blocked": {"color": "e99695", "description": "Waiting for external dependency"},
                "needs-review": {"color": "0e8a16", "description": "Ready for review"}
            },
            
            "Category": {
                "frontend": {"color": "1d76db", "description": "Related to user interface"},
                "backend": {"color": "0052cc", "description": "Related to server-side logic"},
                "database": {"color": "5319e7", "description": "Related to data storage"},
                "testing": {"color": "0e8a16", "description": "Related to testing"},
                "security": {"color": "b60205", "description": "Related to security"}
            },
            
            "Experience": {
                "good-first-issue": {"color": "7057ff", "description": "Good for newcomers"},
                "help-wanted": {"color": "008672", "description": "Extra attention is needed"},
                "advanced": {"color": "5319e7", "description": "Requires advanced knowledge"}
            }
        }
        
        print("\n🏷️ ISSUE LABELS SYSTEM")
        print("=" * 25)
        
        for category, category_labels in labels.items():
            print(f"\n📋 {category}:")
            for label, info in category_labels.items():
                print(f"   🏷️ {label} - {info['description']}")
        
        return labels

# Set up open source community
open_source = OpenSourceBestPractices()
open_source.create_contributing_guide()
open_source.create_code_of_conduct()
labels = open_source.create_issue_labels()
```

## Key Takeaways

✅ **GitHub is essential** - It's where the software world collaborates
✅ **Pull requests are powerful** - They enable safe, reviewed code integration
✅ **Issues track everything** - Bugs, features, questions, and project management
✅ **Actions automate workflows** - Testing, deployment, and project management
✅ **Community matters** - Good documentation and guidelines attract contributors
✅ **Professional profiles** - Your GitHub is your developer portfolio
✅ **Open source opportunities** - Contributing to projects builds skills and network
✅ **Continuous learning** - GitHub features evolve constantly - stay updated

/// details | Professional GitHub Impact 💼
    type: tip

**GitHub in your career:**
- **Recruiters check GitHub** profiles for 78% of developer positions
- **Open source contributions** demonstrate skills better than résumés
- **GitHub Actions experience** is required for DevOps roles
- **Collaboration skills** shown through PR reviews are highly valued
- **Community involvement** opens networking and job opportunities

Your GitHub profile is your professional presence - make it count!

///

## Practice Exercises

### Exercise 1: Repository Setup
Create a professional StudyBuddy repository:
1. Initialize with proper README, .gitignore, and license
2. Set up branch protection rules
3. Create issue and PR templates
4. Add appropriate labels and topics

### Exercise 2: Collaboration Workflow
Work with classmates to practice:
1. Fork each other's repositories
2. Create feature branches and pull requests
3. Conduct thorough code reviews
4. Merge changes using different strategies

### Exercise 3: GitHub Actions
Set up automation for your project:
1. Create CI workflow for testing and linting
2. Add automated security scanning
3. Set up deployment pipeline
4. Configure issue automation

### Exercise 4: Open Source Contribution
Find an open source project and:
1. Read their contributing guidelines
2. Find a good first issue
3. Create a quality pull request
4. Respond professionally to feedback

## Next Steps

Fantastic! You now understand how to leverage GitHub's powerful collaboration features for professional software development.

Continue to [Code Reviews](code-reviews.md) to master the art of giving and receiving constructive feedback on code.

---

*Remember: GitHub isn't just a tool - it's a community. Engage authentically, help others, and contribute to projects you care about. Your reputation in the developer community starts here!*
