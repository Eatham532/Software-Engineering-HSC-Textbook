# 25.4 Data backup and version control

## Why it matters

Data backup and version control are critical safeguards that protect software projects from data loss, enable collaboration, and maintain a complete history of changes. Without proper version control and backup strategies, teams risk losing work, struggle to coordinate changes, and cannot reliably reproduce previous versions of their software. These practices form the foundation of professional software development.

## Concepts

### Version control fundamentals

Version control systems track changes to files over time, allowing multiple developers to work on the same project while maintaining a complete history of modifications. Git is the most widely used version control system in modern software development.

**Core version control concepts**:
- **Repository**: A storage location containing the complete project history and all versions
- **Commit**: A saved snapshot of changes with a descriptive message
- **Branch**: A parallel version of the code for developing features or fixes independently
- **Merge**: Combining changes from different branches back together
- **Tag**: A marker for specific versions, typically used for releases

**Basic Git workflow**:
```python
# Example: Simulating version control operations in Python
class VersionControl:
    def __init__(self, project_name):
        self.project_name = project_name
        self.commits = []
        self.branches = {"main": []}
        self.current_branch = "main"
        self.tags = {}
        self.commit_counter = 0
    
    def commit(self, message, files_changed):
        """Create a new commit with changes"""
        self.commit_counter += 1
        commit_data = {
            "id": f"commit_{self.commit_counter}",
            "message": message,
            "files": files_changed,
            "timestamp": "2024-03-20 14:30:00",
            "author": "developer",
            "branch": self.current_branch
        }
        self.commits.append(commit_data)
        self.branches[self.current_branch].append(commit_data["id"])
        return commit_data["id"]
    
    def create_branch(self, branch_name, from_branch="main"):
        """Create a new branch from existing branch"""
        if branch_name not in self.branches:
            self.branches[branch_name] = self.branches[from_branch].copy()
            return f"Branch '{branch_name}' created from '{from_branch}'"
        return f"Branch '{branch_name}' already exists"
    
    def switch_branch(self, branch_name):
        """Switch to a different branch"""
        if branch_name in self.branches:
            self.current_branch = branch_name
            return f"Switched to branch '{branch_name}'"
        return f"Branch '{branch_name}' does not exist"
    
    def create_tag(self, tag_name, commit_id=None):
        """Create a tag for a specific commit"""
        if commit_id is None and self.commits:
            commit_id = self.commits[-1]["id"]
        
        if commit_id:
            self.tags[tag_name] = commit_id
            return f"Tag '{tag_name}' created for commit {commit_id}"
        return "No commits available for tagging"

# Example usage
project_vc = VersionControl("student_management_system")

# Initial development
project_vc.commit("Initial project setup", ["main.py", "requirements.txt"])
project_vc.commit("Add student class", ["models/student.py"])
project_vc.commit("Implement basic CRUD operations", ["controllers/student_controller.py"])

# Create feature branch
project_vc.create_branch("feature/grade-tracking")
project_vc.switch_branch("feature/grade-tracking")
project_vc.commit("Add grade tracking functionality", ["models/grade.py", "controllers/grade_controller.py"])

# Tag a release
project_vc.switch_branch("main")
project_vc.create_tag("v1.0.0")

print(f"Project: {project_vc.project_name}")
print(f"Total commits: {len(project_vc.commits)}")
print(f"Branches: {list(project_vc.branches.keys())}")
print(f"Tags: {list(project_vc.tags.keys())}")
```

### Branching strategies

Effective branching strategies help teams organize development work, isolate features, and maintain stable code:

**Git Flow model**:
- **Main branch**: Contains production-ready code
- **Develop branch**: Integration branch for features
- **Feature branches**: Individual feature development
- **Release branches**: Preparation for production releases
- **Hotfix branches**: Quick fixes for production issues

**Branch naming conventions**:
- `feature/user-authentication`
- `bugfix/login-validation`
- `hotfix/security-patch`
- `release/v2.1.0`

```python
# Example: Branch management system
class BranchManager:
    def __init__(self):
        self.branches = {
            "main": {"type": "main", "protected": True, "last_commit": "abc123"},
            "develop": {"type": "develop", "protected": True, "last_commit": "def456"}
        }
        self.branch_rules = {
            "feature/": {"base_branch": "develop", "merge_target": "develop"},
            "bugfix/": {"base_branch": "develop", "merge_target": "develop"},
            "hotfix/": {"base_branch": "main", "merge_target": "main"},
            "release/": {"base_branch": "develop", "merge_target": "main"}
        }
    
    def create_feature_branch(self, feature_name, developer):
        """Create a new feature branch following naming conventions"""
        branch_name = f"feature/{feature_name}"
        
        if self.is_valid_branch_name(feature_name):
            rule = self.branch_rules["feature/"]
            self.branches[branch_name] = {
                "type": "feature",
                "base": rule["base_branch"],
                "developer": developer,
                "created": "2024-03-20",
                "status": "active"
            }
            return {
                "success": True,
                "branch": branch_name,
                "message": f"Feature branch created for {developer}"
            }
        else:
            return {
                "success": False,
                "message": "Invalid branch name format"
            }
    
    def is_valid_branch_name(self, name):
        """Validate branch naming conventions"""
        # Branch names should be lowercase, hyphen-separated
        return name.islower() and "-" in name and name.replace("-", "").isalnum()
    
    def prepare_merge_request(self, source_branch, target_branch):
        """Prepare a merge request with validation"""
        if source_branch not in self.branches:
            return {"error": "Source branch does not exist"}
        
        if target_branch not in self.branches:
            return {"error": "Target branch does not exist"}
        
        source_info = self.branches[source_branch]
        target_info = self.branches[target_branch]
        
        merge_request = {
            "source": source_branch,
            "target": target_branch,
            "developer": source_info.get("developer", "unknown"),
            "type": source_info["type"],
            "checks_required": [
                "code_review",
                "automated_tests",
                "integration_tests"
            ],
            "status": "pending_review"
        }
        
        if target_info.get("protected", False):
            merge_request["checks_required"].append("admin_approval")
        
        return merge_request

# Example usage
branch_mgr = BranchManager()

# Create feature branches
feature_result = branch_mgr.create_feature_branch("user-dashboard", "alice")
print(f"Feature branch result: {feature_result}")

# Prepare merge request
merge_request = branch_mgr.prepare_merge_request("feature/user-dashboard", "develop")
print(f"Merge request: {merge_request}")
```

### Tagging and release management

Tags mark specific points in repository history, typically used to identify releases and stable versions:

**Semantic versioning (SemVer)**:
- **Major version** (X.0.0): Breaking changes
- **Minor version** (X.Y.0): New features, backward compatible
- **Patch version** (X.Y.Z): Bug fixes, backward compatible

**Release process**:
1. Create release branch from develop
2. Finalize features and fix bugs
3. Update version numbers and documentation
4. Tag the release
5. Merge to main and deploy
6. Merge back to develop

```python
# Example: Release management system
class ReleaseManager:
    def __init__(self):
        self.releases = []
        self.current_version = {"major": 1, "minor": 0, "patch": 0}
    
    def plan_release(self, release_type, features, bug_fixes):
        """Plan a new release based on changes"""
        new_version = self.calculate_next_version(release_type, features, bug_fixes)
        
        release_plan = {
            "version": f"{new_version['major']}.{new_version['minor']}.{new_version['patch']}",
            "type": release_type,
            "features": features,
            "bug_fixes": bug_fixes,
            "breaking_changes": release_type == "major",
            "release_date": "2024-04-01",
            "status": "planned"
        }
        
        return release_plan
    
    def calculate_next_version(self, release_type, features, bug_fixes):
        """Calculate next version number based on changes"""
        new_version = self.current_version.copy()
        
        if release_type == "major" or any("breaking" in str(f).lower() for f in features):
            new_version["major"] += 1
            new_version["minor"] = 0
            new_version["patch"] = 0
        elif release_type == "minor" or features:
            new_version["minor"] += 1
            new_version["patch"] = 0
        elif release_type == "patch" or bug_fixes:
            new_version["patch"] += 1
        
        return new_version
    
    def create_release_tag(self, version, commit_hash, release_notes):
        """Create a release tag with metadata"""
        tag_info = {
            "version": version,
            "commit": commit_hash,
            "date": "2024-04-01",
            "notes": release_notes,
            "artifacts": [
                f"student-system-{version}.zip",
                f"student-system-{version}-docs.pdf"
            ]
        }
        
        self.releases.append(tag_info)
        return tag_info
    
    def get_release_history(self):
        """Get formatted release history"""
        return {
            "current_version": f"{self.current_version['major']}.{self.current_version['minor']}.{self.current_version['patch']}",
            "total_releases": len(self.releases),
            "latest_releases": self.releases[-3:] if len(self.releases) >= 3 else self.releases
        }

# Example usage
release_mgr = ReleaseManager()

# Plan a minor release
features = ["User profile management", "Grade export functionality"]
bug_fixes = ["Fix login timeout issue", "Correct grade calculation error"]

release_plan = release_mgr.plan_release("minor", features, bug_fixes)
print(f"Release plan: {release_plan}")

# Create release tag
tag_info = release_mgr.create_release_tag("1.1.0", "xyz789", "Added user profiles and grade export")
print(f"Release tag created: {tag_info}")
```

### Data backup strategies

Comprehensive backup strategies protect against data loss and ensure business continuity:

**Backup types**:
- **Full backup**: Complete copy of all data
- **Incremental backup**: Only changes since last backup
- **Differential backup**: Changes since last full backup
- **Continuous backup**: Real-time data protection

**Backup locations**:
- **Local backups**: On-site storage for quick recovery
- **Remote backups**: Off-site storage for disaster recovery
- **Cloud backups**: Third-party managed backup services
- **Repository mirroring**: Multiple Git repository copies

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "Version Control System" {
    rectangle "Local Repository" as local
    rectangle "Remote Repository" as remote
    rectangle "Backup Repository" as backup
}

package "Backup Strategy" {
    rectangle "Daily Incremental" as daily
    rectangle "Weekly Full" as weekly
    rectangle "Monthly Archive" as monthly
}

package "Release Management" {
    rectangle "Feature Branches" as feature
    rectangle "Release Branches" as release
    rectangle "Tagged Versions" as tags
}

local --> remote : push/pull
remote --> backup : mirror
daily --> weekly
weekly --> monthly
feature --> release
release --> tags
tags --> backup

@enduml
```

### Release hygiene practices

Release hygiene ensures consistent, reliable software deployments:

**Pre-release checklist**:
- All tests passing
- Code review completed
- Documentation updated
- Version numbers incremented
- Changelog updated
- Security scan completed

**Release artifacts**:
- Source code archives
- Compiled binaries
- Installation packages
- Documentation
- Release notes

```python
# Example: Release hygiene checker
class ReleaseHygiene:
    def __init__(self):
        self.checklist = {
            "code_review": False,
            "tests_passing": False,
            "documentation_updated": False,
            "version_incremented": False,
            "changelog_updated": False,
            "security_scan": False,
            "backup_verified": False
        }
    
    def check_release_readiness(self, project_status):
        """Verify all release criteria are met"""
        for check, status in project_status.items():
            if check in self.checklist:
                self.checklist[check] = status
        
        passed_checks = sum(self.checklist.values())
        total_checks = len(self.checklist)
        
        result = {
            "ready_for_release": passed_checks == total_checks,
            "checks_passed": passed_checks,
            "total_checks": total_checks,
            "missing_requirements": [
                check for check, status in self.checklist.items() if not status
            ]
        }
        
        return result
    
    def generate_release_report(self, version, artifacts):
        """Generate comprehensive release report"""
        report = {
            "version": version,
            "release_date": "2024-04-01",
            "artifacts": artifacts,
            "quality_checks": self.checklist,
            "deployment_instructions": [
                "Download release artifacts",
                "Verify checksums",
                "Stop existing services",
                "Deploy new version",
                "Run post-deployment tests",
                "Monitor system health"
            ]
        }
        
        return report

# Example usage
hygiene_checker = ReleaseHygiene()

# Check project status
project_status = {
    "code_review": True,
    "tests_passing": True,
    "documentation_updated": True,
    "version_incremented": True,
    "changelog_updated": False,
    "security_scan": True,
    "backup_verified": True
}

readiness = hygiene_checker.check_release_readiness(project_status)
print(f"Release readiness: {readiness}")

if readiness["ready_for_release"]:
    artifacts = ["app-v1.1.0.zip", "docs-v1.1.0.pdf", "installer-v1.1.0.exe"]
    report = hygiene_checker.generate_release_report("1.1.0", artifacts)
    print(f"Release report generated for version {report['version']}")
```

### Guided example: Setting up version control for a school project

Let's walk through establishing version control and backup procedures for a school management system:

**Step 1: Repository setup**
```python
# Initialize project repository structure
project_structure = {
    "student_management/": {
        "src/": ["models/", "controllers/", "views/"],
        "tests/": ["unit/", "integration/"],
        "docs/": ["api/", "user_guide/"],
        "scripts/": ["deploy/", "backup/"],
        "config/": ["development.py", "production.py"]
    }
}

def setup_git_repository(project_name):
    """Set up Git repository with initial structure"""
    repo_config = {
        "project": project_name,
        "initial_branch": "main",
        "branches": ["main", "develop"],
        "gitignore": [
            "*.pyc",
            "__pycache__/",
            ".env",
            "config/secrets.py",
            "logs/*.log"
        ],
        "initial_commit": "Initial project structure"
    }
    return repo_config
```

**Step 2: Branching strategy implementation**
```python
# Define branching workflow
branching_workflow = {
    "main": {
        "purpose": "Production-ready code",
        "protection": "Requires pull request and approval",
        "auto_deploy": True
    },
    "develop": {
        "purpose": "Integration of new features",
        "protection": "Requires automated tests to pass",
        "auto_deploy": False
    },
    "feature/*": {
        "purpose": "Individual feature development",
        "base": "develop",
        "merge_target": "develop",
        "lifetime": "Until feature complete"
    },
    "hotfix/*": {
        "purpose": "Critical production fixes",
        "base": "main",
        "merge_target": "main",
        "lifetime": "Until fix deployed"
    }
}
```

**Step 3: Backup and release process**
```python
# Automated backup and release process
def create_backup_strategy():
    return {
        "frequency": {
            "code_backup": "On every commit",
            "database_backup": "Daily at 2 AM",
            "full_system_backup": "Weekly on Sunday"
        },
        "locations": {
            "primary": "GitHub repository",
            "secondary": "School network drive",
            "tertiary": "Cloud backup service"
        },
        "retention": {
            "daily_backups": "30 days",
            "weekly_backups": "6 months",
            "release_archives": "Indefinite"
        }
    }
```

## Practice

/// details | Exercise 1: Git Workflow Design
    type: question
    open: false

**Scenario**: You're working on a team project to develop a library catalog system. The team has 4 developers and needs to coordinate feature development.

**Task**: Design a Git branching strategy that includes main branches, feature branches, and a release process. Specify naming conventions and merge rules.

/// details | Sample Solution
    type: success
    open: false

**Main Branches**:
- `main`: Production code, protected, requires pull request + approval
- `develop`: Integration branch, requires passing tests

**Feature Branches**:
- Naming: `feature/catalog-search`, `feature/user-registration`
- Base: `develop`
- Merge target: `develop` via pull request

**Release Process**:
- Create `release/v1.2.0` from `develop`
- Final testing and bug fixes
- Merge to `main` and tag `v1.2.0`
- Merge back to `develop`

**Merge Rules**:
- No direct commits to `main` or `develop`
- All changes via pull requests
- Automated tests must pass
- Code review required for `main` merges
///
///

/// details | Exercise 2: Backup Strategy Planning
    type: question
    open: false

**Scenario**: Your school's student information system stores critical data including grades, attendance, and personal information.

**Task**: Design a comprehensive backup strategy that includes different backup types, schedules, and recovery procedures.

/// details | Sample Solution
    type: success
    open: false

**Backup Types and Schedule**:
- Real-time: Database transaction logs
- Hourly: Incremental backups of active data
- Daily: Full database backup
- Weekly: Complete system backup including code and configurations

**Storage Locations**:
- Primary: On-site secure server
- Secondary: Off-site school district data center
- Tertiary: Encrypted cloud storage

**Recovery Procedures**:
- Point-in-time recovery using transaction logs
- Database restore from daily backups
- Full system restore from weekly backups
- Disaster recovery plan with 4-hour RTO (Recovery Time Objective)

**Testing**:
- Monthly backup restoration tests
- Annual disaster recovery drill
///
///

/// details | Exercise 3: Release Management
    type: question
    open: false

**Scenario**: You're preparing to release version 2.0 of a student gradebook application that includes new features and some breaking changes.

**Task**: Create a release plan that includes version numbering, release notes, and a deployment checklist.

/// details | Sample Solution
    type: success
    open: false

**Version**: 2.0.0 (major version due to breaking changes)

**Release Notes**:
- New features: Advanced grade analytics, parent portal
- Breaking changes: API endpoint restructuring, database schema updates
- Bug fixes: Grade calculation accuracy, export format issues

**Pre-Release Checklist**:
- All automated tests passing (unit, integration, security)
- Code review completed by senior developer
- Documentation updated (API docs, user guide)
- Migration scripts tested for database changes
- Backward compatibility impact documented

**Deployment Process**:
- Create release branch `release/v2.0.0`
- Final testing in staging environment
- Tag release `v2.0.0` in main branch
- Generate deployment artifacts
- Schedule maintenance window for production deployment
- Post-deployment monitoring and rollback plan ready
///
///

## Recap

Data backup and version control form the foundation of reliable software development through:

- **Version control**: Using Git for tracking changes, coordinating collaboration, and maintaining complete project history
- **Branching strategies**: Implementing organized workflows with feature branches, protection rules, and merge processes
- **Tagging and releases**: Using semantic versioning and systematic release management for stable deployments
- **Backup strategies**: Implementing comprehensive data protection with multiple backup types, locations, and recovery procedures
- **Release hygiene**: Following systematic checklists and quality gates to ensure reliable software releases

These practices protect against data loss, enable effective team collaboration, and ensure that software releases are consistent, traceable, and reliable. Proper implementation of these systems is essential for professional software development and project success.