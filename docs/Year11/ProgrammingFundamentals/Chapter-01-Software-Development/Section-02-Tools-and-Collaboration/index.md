# 1.2 Tools and collaboration (IDE + Git)

## Why it matters

A minimal toolchain enables consistent workflows and collaboration from day one. An editor with an integrated terminal makes it easy to run code and manage files, while Git records incremental changes with meaningful messages.

!!! info "Cross-reference"
    This section uses the Grade Calculator code developed in Section 1.1.

## Development environment

### Choosing and configuring an IDE

An Integrated Development Environment (IDE) combines a text editor, file browser, terminal, and debugging tools in a single interface. Popular choices for Python development include:

- **Visual Studio Code**: Lightweight, extensive extension ecosystem, excellent Git integration

- **PyCharm**: Full-featured Python IDE with advanced debugging and refactoring tools

- **Sublime Text**: Fast text editor with Python plugins

- **Vim/Neovim**: Terminal-based editors for experienced users

### File and project management

The IDE file explorer shows the project structure as a tree hierarchy. Understanding this structure is critical:

```text
project-folder/
├── .git/                 # Hidden Git repository data
├── .gitignore           # Files to exclude from version control
├── README.md            # Project documentation
├── src/                 # Source code folder
│   ├── main.py         # Primary application file
│   └── utils.py        # Utility functions
├── tests/              # Test files
│   └── test_main.py    # Tests for main.py
└── requirements.txt    # Python dependencies
```

Key file operations in the IDE:

- **Creating files**: Right-click in explorer → New File, or use keyboard shortcuts

- **Opening folders**: File → Open Folder selects the entire project directory

- **Workspace vs single files**: A workspace includes project settings, while single files lack context

- **File encoding**: Always use UTF-8 for Python files to handle international characters

- **Line endings**: Use LF (Unix-style) rather than CRLF (Windows-style) for cross-platform compatibility

### Running Python code

Multiple execution methods exist, each with specific use cases:

/// details | IDE run button method
    type: note
    open: false

- Advantages: Built-in debugging, variable inspection, integrated output

- Process: Click the run button or press F5 (VS Code) / Shift+F10 (PyCharm)

- Output appears in the IDE's integrated console

- Automatically activates the correct Python interpreter

///

/// details | Integrated terminal method
    type: note
    open: false

```bash
# Navigate to project directory first
cd /path/to/project

# Run with explicit Python interpreter
python main.py

# Alternative: use python3 on systems with multiple Python versions
python3 main.py

# Run with module syntax (useful for packages)
python -m src.main
```
///

#### External terminal method

- Open system terminal (Command Prompt, PowerShell, bash)

- Navigate to project directory using `cd`

- Execute Python files directly

- Useful for testing deployment scenarios

### Terminal integration and navigation

The integrated terminal shares the same environment as the IDE:

- **Working directory**: Automatically set to the project root

- **Environment variables**: Inherits from the IDE session

- **Virtual environment**: Activates automatically if configured

- **Path resolution**: Relative paths work consistently with the project structure

Essential terminal commands for file navigation:
```bash
# List files and directories
ls -la          # Unix/macOS
dir /a          # Windows

# Navigate directories
cd folder-name  # Enter subdirectory
cd ..          # Go up one level
cd /           # Go to root (Unix/macOS)
cd \           # Go to root (Windows)
pwd            # Show current directory

# File operations
mkdir new-folder     # Create directory
touch new-file.py   # Create empty file (Unix/macOS)
echo. > new-file.py # Create empty file (Windows)
cp source dest      # Copy file (Unix/macOS)
copy source dest    # Copy file (Windows)
```

## Version control with Git

Git is a distributed version control system that tracks changes to files over time. It enables collaboration, maintains complete project history, and provides mechanisms to recover from mistakes.

### Why version control matters

Version control solves fundamental problems in software development:

- **Backup and recovery**: Every commit creates a complete snapshot; nothing is ever truly lost

- **Change tracking**: See exactly what changed, when, and why through detailed commit history

- **Collaboration**: Multiple developers can work simultaneously without conflicts

- **Branching**: Experiment with features in isolation before merging into main codebase

- **Blame/annotation**: Identify who made specific changes for debugging and code review

- **Release management**: Tag and track specific versions for deployment

### Repository structure and Git internals

Understanding Git's internal structure clarifies how commands work:

```text
project/.git/
├── HEAD                 # Points to current branch
├── config              # Repository configuration
├── description         # Repository description
├── hooks/              # Custom scripts for Git events
├── info/               # Global exclude patterns
├── objects/            # Compressed file content and metadata
│   ├── xx/            # First two characters of SHA-1 hash
│   └── pack/          # Packed objects for efficiency
├── refs/              # Branch and tag pointers
│   ├── heads/         # Local branch references
│   ├── remotes/       # Remote branch references
│   └── tags/          # Tag references
└── logs/              # Reference change history
```

Key concepts:

- **Object database**: Git stores everything as objects (blobs, trees, commits, tags)

- **SHA-1 hashing**: Every object has a unique 40-character identifier

- **Content addressing**: Objects are retrieved by their hash, ensuring integrity

- **Compression**: Git uses zlib compression and delta compression for efficiency

### Git concepts (detailed explanation)

**Repository**: The complete project history stored in the `.git/` directory. Contains all commits, branches, tags, and configuration. Can exist locally (on your machine) or remotely (on GitHub, GitLab, etc.).

**Working tree**: The current state of files in your project directory. These are the actual files you edit, which may differ from the last committed version.

**Staging area (index)**: A intermediate area where changes are prepared before committing. Allows selective inclusion of changes - you can stage some edits while leaving others for a future commit.

**Commit**: A immutable snapshot of the project at a specific point in time. Contains:

- Tree object representing the complete file structure

- Parent commit reference(s) creating the history chain

- Author and committer information with timestamps

- Commit message explaining the changes

**HEAD**: A special pointer indicating the current commit and branch. Usually points to the tip of the current branch, but can point directly to a commit (detached HEAD state).

**Branch**: A lightweight, movable pointer to a specific commit. The default branch is typically `main` or `master`. Branches enable parallel development streams.

**Tag**: A fixed reference to a specific commit, typically used for marking release versions (v1.0, v2.1, etc.).

### Core workflow (comprehensive)

#### Repository initialization

```bash
# Create a new repository in the current directory
git init

# Alternative: create repository in a new directory
git init project-name
cd project-name

# Clone an existing repository
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git  # SSH variant
```

The `git init` command creates the `.git/` directory structure and initializes an empty repository. The working tree starts untracked - no files are under version control until explicitly added.

#### Staging changes

```bash
# Stage a specific file
git add filename.py

# Stage all changes in current directory and subdirectories
git add .

# Stage all tracked files (excludes new files)
git add -u

# Stage with interactive mode for selective hunks
git add -p filename.py

# Stage only part of a file's changes
git add --patch filename.py
```

Staging serves multiple purposes:

- **Selective commits**: Include only related changes in each commit

- **Review changes**: Examine what will be committed before finalizing

- **Atomic commits**: Group logical changes together while excluding unrelated modifications

#### Creating commits

```bash
# Commit with inline message
git commit -m "Add user authentication system"

# Commit with detailed message using editor
git commit

# Commit all tracked changes (skip explicit staging)
git commit -am "Fix validation bugs in form processing"

# Amend the previous commit (before pushing)
git commit --amend -m "Corrected commit message"
```

**Commit message best practices**:

- **Subject line**: 50 characters or less, imperative mood ("Add feature" not "Added feature")

- **Body**: Wrap at 72 characters, explain what and why (not how)

- **Footer**: Reference issue numbers, breaking changes, co-authors

Example of a well-structured commit message:
```text
Add password reset functionality

Implement secure token-based password reset system:
- Generate cryptographically secure reset tokens
- Send reset emails with time-limited links
- Validate tokens and update passwords safely

Resolves: #123
Breaking change: Updates user model schema
```

### Inspect changes and history (comprehensive)

#### Checking repository status

```bash
# Show working tree and staging area status
git status

# Concise status output
git status -s
git status --short

# Show status with branch and tracking information
git status -b
```

Status output interpretation:

- **Untracked files**: New files not yet added to version control

- **Changes to be committed**: Staged modifications ready for the next commit

- **Changes not staged**: Modified tracked files that haven't been staged

- **Deleted files**: Files removed from working tree

- **Renamed files**: Git detects file moves and renames automatically

#### Examining differences

```bash
# Show unstaged changes (working tree vs staging area)
git diff

# Show staged changes (staging area vs last commit)
git diff --staged
git diff --cached  # Alternative syntax

# Compare specific commits
git diff HEAD~1 HEAD           # Current vs previous commit
git diff abc123 def456         # Between specific commit hashes
git diff main feature-branch   # Between branches

# Show differences for specific files
git diff filename.py
git diff --staged filename.py

# Word-level differences (useful for text)
git diff --word-diff

# Statistical summary of changes
git diff --stat
```

#### Viewing commit history

```bash
# Standard log output
git log

# Compact one-line format
git log --oneline

# Show branch structure graphically
git log --oneline --graph --decorate --all

# Limit number of commits shown
git log -n 5
git log --oneline -10

# Show commits affecting specific files
git log filename.py
git log --follow filename.py  # Track renames

# Show commit details with diffs
git log -p
git log --patch

# Filter by author, date, or message
git log --author="John Doe"
git log --since="2023-01-01"
git log --until="last week"
git log --grep="fix bug"

# Show commits in date order across branches
git log --all --date-order --graph

# Beautiful colored output with custom format
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'
```

#### Detailed commit inspection

```bash
# Show complete commit details
git show HEAD
git show abc123f

# Show only files changed in a commit
git show --name-only HEAD

# Show commit statistics
git show --stat HEAD

# Show specific file from a commit
git show HEAD:filename.py
git show abc123:src/main.py
```

### Undo and recovery operations (comprehensive)

Git provides multiple mechanisms for undoing changes, each appropriate for different scenarios:

#### Unstaging changes (keep modifications)

```bash
# Unstage specific file (keep working tree changes)
git restore --staged filename.py

# Unstage all staged changes
git restore --staged .

# Legacy command (still works)
git reset HEAD filename.py
```

#### Discarding working tree changes

```bash
# Discard changes to specific file (DESTRUCTIVE)
git restore filename.py

# Discard all working tree changes (DESTRUCTIVE)
git restore .

# Alternative legacy syntax
git checkout -- filename.py
git checkout .
```

/// admonition | Watch out when discarding changes!
    type: warning

These commands permanently delete uncommitted changes. Use with extreme caution.
///


#### Modifying commits

```bash
# Change the last commit message (before pushing)
git commit --amend -m "Corrected commit message"

# Add files to the last commit without changing message
git add forgotten-file.py
git commit --amend --no-edit

# Combine staging and amending
git commit --amend -am "Updated message with additional changes"
```

**Important**: Only amend commits that haven't been pushed to shared repositories.

#### Reverting commits safely

```bash
# Create new commit that undoes a previous commit
git revert HEAD            # Revert last commit
git revert abc123f         # Revert specific commit
git revert HEAD~3          # Revert commit 3 steps back

# Revert multiple commits
git revert HEAD~3..HEAD    # Revert last 3 commits

# Revert without creating commit (stage changes only)
git revert --no-commit HEAD
```

Revert is safe for shared repositories because it creates new commits rather than modifying history.

#### Reset operations (dangerous)

```bash
# Move HEAD to different commit (various modes)
git reset --soft HEAD~1    # Keep staging area and working tree
git reset --mixed HEAD~1   # Keep working tree, clear staging (default)
git reset --hard HEAD~1    # DESTRUCTIVE: discard everything

# Reset to specific commit
git reset --hard abc123f
```

/// admonition | Warning
    type: warning

These commands permanently delete uncommitted changes. Use with extreme caution.
///

#### Recovery techniques

```bash
# Show reference change history
git reflog

# Recover "lost" commits using reflog
git reset --hard HEAD@{2}

# Create branch from reflog entry
git branch recovery-branch HEAD@{5}

# Find lost commits in unreachable objects
git fsck --lost-found
```

### `.gitignore` configuration (comprehensive)

The `.gitignore` file specifies files and directories that Git should not track. This prevents committing temporary files, build artifacts, and sensitive information.

#### Essential patterns for Python projects

```gitignore
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# PyInstaller
*.manifest
*.spec

# Virtual environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDEs and editors
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
Thumbs.db

# Testing and coverage
.coverage
.pytest_cache/
.tox/
htmlcov/
.nox/

# Documentation builds
docs/_build/
site/

# Database files
*.db
*.sqlite3

# Log files
*.log

# Environment variables
.env.local
.env.development
.env.production

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

#### Gitignore syntax rules

- **Comments**: Lines starting with `#` are comments

- **Negation**: Prefix with `!` to force include files that would otherwise be ignored

- **Directories**: End with `/` to match only directories

- **Wildcards**: Use `*` for any characters, `?` for single character, `**` for recursive directories

- **Character classes**: Use `[abc]` to match any of a, b, or c

/// details | Advanced gitignore examples
    type: info
    open: false

```gitignore
# Ignore all .txt files except important.txt
*.txt
!important.txt

# Ignore all files in temp/ but track the directory structure
temp/**
!temp/.gitkeep

# Ignore files only in root directory (not subdirectories)
/root-only-file.txt

# Ignore files with specific patterns
**/logs/*.log
docs/**/*.pdf

# Platform-specific files
[Tt]humbs.db
[Dd]esktop.ini
```

///

#### Managing gitignore effectively

```bash
# Check if file would be ignored
git check-ignore filename.txt
git check-ignore -v filename.txt  # Show which rule matches

# Remove already-tracked files from Git (but keep in working tree)
git rm --cached filename.txt
git rm -r --cached directory/

# Apply gitignore to already-tracked files
git rm -r --cached .
git add .
git commit -m "Apply gitignore to existing files"

# Global gitignore for user-specific preferences
git config --global core.excludesfile ~/.gitignore_global
```

#### Common gitignore mistakes

- **Missing trailing slashes**: `logs` matches files and directories, `logs/` matches only directories

- **Overly broad patterns**: `*.log` might ignore important log files you want to track

- **Ignoring gitignore**: Always commit `.gitignore` itself to share ignore rules with team

- **Late addition**: Adding files to gitignore after they're already tracked has no effect

### Branching and merging (comprehensive)

Branches enable parallel development by creating independent lines of work. They're essential for feature development, experimentation, and collaboration.

#### Branch fundamentals

A branch is simply a movable pointer to a commit. The default branch (`main` or `master`) contains the primary development line. Feature branches isolate experimental work.

```bash
# List all branches
git branch                    # Local branches only
git branch -a                 # Include remote branches
git branch -r                 # Remote branches only

# Create new branch (doesn't switch to it)
git branch feature-login

# Create and switch to new branch
git switch -c feature-login
git checkout -b feature-login  # Legacy syntax

# Switch between existing branches
git switch main
git switch feature-login
git checkout main             # Legacy syntax

# Delete branch (safe - prevents deletion of unmerged branches)
git branch -d feature-login

# Force delete branch (dangerous - can lose work)
git branch -D feature-login

# Rename current branch
git branch -m new-branch-name

# Rename any branch
git branch -m old-name new-name
```

#### Branch workflow strategies

**Feature branch workflow**:

1. Create feature branch from `main`

2. Develop feature in isolation

3. Test thoroughly

4. Merge back to `main`

5. Delete feature branch

```bash
# Start new feature
git switch main
git pull origin main           # Get latest changes
git switch -c feature-user-auth

# Work on feature...
git add .
git commit -m "Add login form"
git commit -m "Add password validation"

# Merge back to main
git switch main
git merge feature-user-auth

# Clean up
git branch -d feature-user-auth
```

#### Merging strategies

**Fast-forward merge**: When target branch hasn't diverged, Git simply moves the pointer forward.

```bash
git merge feature-branch       # Fast-forward if possible
git merge --no-ff feature-branch  # Force merge commit
```

**Three-way merge**: When branches have diverged, Git creates a merge commit with two parents.

**Merge vs Rebase**:

- **Merge**: Preserves branch history, creates merge commits

- **Rebase**: Creates linear history, rewrites commit history

```bash
# Merge (preserves history)
git switch main
git merge feature-branch

# Rebase (linear history)
git switch feature-branch
git rebase main
git switch main
git merge feature-branch  # Fast-forward merge
```

#### Handling merge conflicts

Conflicts occur when Git cannot automatically merge changes to the same lines.

```bash
# Start merge that results in conflict
git merge feature-branch

# Git status shows conflicted files
git status

# Edit conflicted files to resolve conflicts
# Conflict markers look like:
# <<<<<<< HEAD
# Current branch content
# =======
# Feature branch content
# >>>>>>> feature-branch

# After resolving conflicts
git add resolved-file.py
git commit  # Complete the merge
```

#### Advanced branching

```bash
# Show branch relationships
git log --oneline --graph --decorate --all

# Cherry-pick specific commits to current branch
git cherry-pick abc123f

# Create branch from specific commit
git branch bugfix-branch abc123f

# Track remote branch
git branch --set-upstream-to=origin/main main

# Show branches that contain specific commit
git branch --contains abc123f

# Show unmerged branches
git branch --no-merged main
```

## Worked example

/// tab | Python
```py
# hello.py — run this from the terminal or IDE run button
print("Hello, repo!")
```
///

/// tab | Terminal
```text
# initialising a repository and making two commits (illustrative)
git init
git add hello.py
git commit -m "Add hello.py"
echo "# Project" > README.md
git add README.md
git commit -m "Add README"
```
///

### What the example does

- Initialises version control for the folder (`git init`).

- Stages a new file and records a focused snapshot with a clear subject (`Add hello.py`).

- Adds a minimal README and records a second, separate change (`Add README`).

- Two small commits are easier to understand and revert than a single broad commit.

## Practice

Complete the tasks below to reinforce Git and IDE concepts.

### IDE setup and navigation

- Open a new project folder in your chosen IDE

- Create the following directory structure using the IDE file explorer:
  ```text
  my-project/
  ├── src/
  │   └── main.py
  ├── tests/
  │   └── test_main.py
  └── README.md
  ```

- Configure your IDE's integrated terminal to open in the project root

- Run a simple Python script using both the IDE run button and integrated terminal

- Practice file operations: create, rename, delete files using IDE shortcuts

### Git repository fundamentals

- Initialize a Git repository in your project folder

- Create a comprehensive `.gitignore` file appropriate for Python development

- Stage and commit the initial project structure with a clear commit message

- Make several small commits as you add content to files

- Practice viewing repository status and history using various Git commands

### Staging and commit workflow

- Edit multiple files simultaneously

- Use `git status` to examine which files are modified

- Practice selective staging: stage only some of your changes

- Use `git diff` and `git diff --staged` to review changes before committing

- Create commits with both inline messages and detailed editor-based messages

- Practice unstaging files without losing working tree changes

### History and inspection

- Use `git log` with different formatting options to view commit history

- Practice using `git show` to examine specific commits in detail

- Use `git diff` to compare different commits and branches

- Experiment with filtering log output by author, date, and message content

### Branch operations

- Create a feature branch for developing a new functionality

- Switch between branches and observe how working tree changes

- Make commits on the feature branch

- Practice merging the feature branch back to main

- Create and resolve a simple merge conflict intentionally

- Use `git log --graph` to visualize branch structure

### Advanced Git operations

- Practice using `git commit --amend` to modify recent commits

- Experiment with `git revert` to safely undo commits

- Use `git cherry-pick` to apply specific commits from other branches

- Practice using `git reflog` to recover from mistakes

- Create tags for specific commits to mark versions

### Repository maintenance

- Use `git clean` to remove untracked files (dry-run first with `-n`)

- Practice optimizing repository with `git gc` (garbage collection)

- Experiment with Git aliases to create shortcuts for common commands

- Configure global Git settings for your user name, email, and editor preferences

## Practice: Grade Calculator repository

!!! tip "Hands-on activity"
    Apply what you've learned by setting up version control for the Grade Calculator project from Section 1.1.

**Activity**: Set up a new Git repository for the Grade Calculator project, create a README.md file, make an initial commit with the message "Initial project setup", then add the basic calculator code and commit with "Add basic grade calculation function".

### Step-by-step workflow

1. **Create project directory**: 
   ```bash
   mkdir grade-calculator
   cd grade-calculator
   ```

2. **Initialize Git repository**:
   ```bash
   git init
   ```

3. **Create README.md**:
   ```markdown
   # Grade Calculator
   
   A simple program that calculates the average of three test scores.
   
   ## Requirements
   - Python 3.8 or higher
   
   ## How to run
   python main.py
   ```

4. **Initial commit**:
   ```bash
   git add README.md
   git commit -m "Initial project setup"
   ```

5. **Add calculator code**: Create `main.py` with the Grade Calculator function from Section 1.1

6. **Second commit**:
   ```bash
   git add main.py
   git commit -m "Add basic grade calculation function"
   ```

7. **Check repository status**:
   ```bash
   git log --oneline
   ```

This activity demonstrates the complete Git workflow: initialization, staging, committing, and history tracking for a real project.


!!! next-up "Coming Up"
    Coming up: In [1.3 Documentation and code style]../Section-03-Documentation-and-Code-Style/index.md), We'll learn about code documentation practices.

## Recap

Modern software development relies on integrated development environments and version control systems to manage complexity and enable collaboration.

**IDE mastery** provides the foundation for productive development:

- File and project structure understanding enables efficient navigation

- Integrated terminals streamline command execution within project context  

- Multiple execution methods (IDE buttons, terminals) offer flexibility for different scenarios

- Proper workspace configuration reduces friction and eliminates common beginner mistakes

**Git version control** transforms how developers manage change:

- Repository initialization creates the foundation for tracking all project history

- The staging area provides fine-grained control over what changes are included in each commit

- Comprehensive commit messages create searchable documentation of project evolution

- Branch-based workflows enable parallel development and safe experimentation

- Merge and conflict resolution skills enable seamless collaboration with other developers

**Professional workflows** combine these tools effectively:

- Small, focused commits create readable history and simplify debugging

- Strategic use of `.gitignore` prevents pollution with temporary and generated files  

- Branch strategies isolate features and reduce integration problems

- Recovery operations provide safety nets for inevitable mistakes

These foundational tools scale from individual learning projects to large collaborative systems, making early mastery essential for software engineering success.
