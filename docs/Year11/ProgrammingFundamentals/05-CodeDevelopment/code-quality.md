# Code Quality

## Introduction

**Code quality** is like writing a well-structured essay - it's not enough for your code to work; it must be clear, maintainable, and professional. High-quality code is easy to read, understand, modify, and extend. Just as great authors follow writing conventions to communicate effectively, great programmers follow coding standards to create software that stands the test of time.

/// details | Why Code Quality Matters 🎯
    type: important

**Poor code quality costs companies billions:**
- **NASA Mars Climate Orbiter**: Lost due to unit conversion error - cost $327 million
- **Knight Capital**: Trading algorithm bug lost $440 million in 45 minutes
- **Healthcare.gov**: Poor code quality led to system failures affecting millions

**High code quality delivers:**
- **Faster development** - Easy to understand and modify
- **Fewer bugs** - Clear code has fewer hiding places for errors
- **Better collaboration** - Team members can work on any part of the codebase
- **Easier maintenance** - Changes and updates are straightforward
- **Professional credibility** - Quality code demonstrates expertise

///

## Code Quality Principles

### 1. Readability First

Code is read far more often than it's written. Write for humans, not just computers.

```python
# ❌ Poor readability
def calc(s,g,w):
    return s*0.4+g*0.6 if w>5 else s*0.6+g*0.4

# ✅ Good readability
def calculate_final_grade(assignments_score, grades_score, weeks_completed):
    """
    Calculate student's final grade based on assignments and test scores.
    
    Args:
        assignments_score: Average score from assignments (0-100)
        grades_score: Average score from tests/quizzes (0-100)
        weeks_completed: Number of weeks student has been active
    
    Returns:
        Final grade as percentage (0-100)
    """
    if weeks_completed > 5:  # More emphasis on tests for experienced students
        return assignments_score * 0.4 + grades_score * 0.6
    else:  # More emphasis on assignments for new students
        return assignments_score * 0.6 + grades_score * 0.4
```

### 2. Single Responsibility Principle

Each function should do one thing and do it well.

```python
# ❌ Function doing too much
def process_student_data(student_id):
    # Get student from database
    student = database.get_student(student_id)
    
    # Calculate GPA
    total_points = 0
    total_credits = 0
    for grade in student.grades:
        total_points += grade.points * grade.credits
        total_credits += grade.credits
    gpa = total_points / total_credits
    
    # Send notification email
    subject = f"GPA Update for {student.name}"
    body = f"Your current GPA is {gpa:.2f}"
    email_service.send_email(student.email, subject, body)
    
    # Update database
    student.gpa = gpa
    database.update_student(student)
    
    return gpa

# ✅ Separated responsibilities
def calculate_gpa(grades):
    """Calculate GPA from list of grades."""
    total_points = sum(grade.points * grade.credits for grade in grades)
    total_credits = sum(grade.credits for grade in grades)
    return total_points / total_credits if total_credits > 0 else 0

def send_gpa_notification(student, gpa):
    """Send GPA update notification to student."""
    subject = f"GPA Update for {student.name}"
    body = f"Your current GPA is {gpa:.2f}"
    email_service.send_email(student.email, subject, body)

def update_student_gpa(student_id):
    """Update student's GPA and send notification."""
    student = database.get_student(student_id)
    gpa = calculate_gpa(student.grades)
    
    student.gpa = gpa
    database.update_student(student)
    
    send_gpa_notification(student, gpa)
    return gpa
```

### 3. Meaningful Names

Choose names that clearly express intent and avoid abbreviations.

```python
# ❌ Unclear names
def proc_std_dt(std_lst, dt_rng):
    res = []
    for s in std_lst:
        if s.dt >= dt_rng[0] and s.dt <= dt_rng[1]:
            res.append(s)
    return res

# ✅ Clear, meaningful names
def filter_students_by_enrollment_date(students, date_range):
    """
    Filter students based on their enrollment date.
    
    Args:
        students: List of Student objects
        date_range: Tuple of (start_date, end_date)
    
    Returns:
        List of students enrolled within the date range
    """
    filtered_students = []
    start_date, end_date = date_range
    
    for student in students:
        if start_date <= student.enrollment_date <= end_date:
            filtered_students.append(student)
    
    return filtered_students
```

## StudyBuddy Code Quality Examples

### Clean Class Design

```python
class StudySession:
    """
    Represents a single study session with timing and productivity tracking.
    
    This class follows the single responsibility principle by focusing
    solely on managing study session data and behavior.
    """
    
    def __init__(self, student_id, subject, start_time=None):
        """
        Initialize a new study session.
        
        Args:
            student_id (str): Unique identifier for the student
            subject (str): Subject being studied
            start_time (datetime, optional): Session start time. Defaults to now.
        """
        self.student_id = self._validate_student_id(student_id)
        self.subject = subject
        self.start_time = start_time or datetime.now()
        self.end_time = None
        self.notes = ""
        self.productivity_rating = None
        self.break_count = 0
        self.is_active = True
    
    def _validate_student_id(self, student_id):
        """Validate student ID format (private method)."""
        if not isinstance(student_id, str) or not student_id.startswith('S'):
            raise ValueError("Student ID must be a string starting with 'S'")
        return student_id
    
    def end_session(self, productivity_rating=None, notes=""):
        """
        End the study session and record final details.
        
        Args:
            productivity_rating (int, optional): Rating from 1-5
            notes (str, optional): Session notes
        
        Returns:
            int: Session duration in minutes
        """
        if not self.is_active:
            raise ValueError("Session is already ended")
        
        self.end_time = datetime.now()
        self.is_active = False
        
        if productivity_rating is not None:
            self.set_productivity_rating(productivity_rating)
        
        if notes:
            self.notes = notes
        
        return self.get_duration_minutes()
    
    def set_productivity_rating(self, rating):
        """
        Set productivity rating with validation.
        
        Args:
            rating (int): Rating from 1 (poor) to 5 (excellent)
        
        Raises:
            ValueError: If rating is not between 1-5
        """
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            raise ValueError("Productivity rating must be an integer between 1 and 5")
        
        self.productivity_rating = rating
    
    def add_break(self):
        """Record that a break was taken during the session."""
        if self.is_active:
            self.break_count += 1
        else:
            raise ValueError("Cannot add break to ended session")
    
    def get_duration_minutes(self):
        """
        Get session duration in minutes.
        
        Returns:
            int: Duration in minutes, or None if session not ended
        """
        if self.end_time is None:
            return None
        
        duration = self.end_time - self.start_time
        return int(duration.total_seconds() / 60)
    
    def get_productivity_category(self):
        """
        Get productivity category based on rating.
        
        Returns:
            str: Productivity category description
        """
        if self.productivity_rating is None:
            return "Not Rated"
        
        categories = {
            1: "Needs Improvement",
            2: "Below Average", 
            3: "Average",
            4: "Good",
            5: "Excellent"
        }
        
        return categories[self.productivity_rating]
    
    def to_dict(self):
        """Convert session to dictionary for serialization."""
        return {
            'student_id': self.student_id,
            'subject': self.subject,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'duration_minutes': self.get_duration_minutes(),
            'notes': self.notes,
            'productivity_rating': self.productivity_rating,
            'productivity_category': self.get_productivity_category(),
            'break_count': self.break_count,
            'is_active': self.is_active
        }
    
    def __str__(self):
        """String representation for debugging and logging."""
        status = "Active" if self.is_active else "Completed"
        duration = f"{self.get_duration_minutes()}min" if self.get_duration_minutes() else "Ongoing"
        
        return f"StudySession({self.student_id}, {self.subject}, {status}, {duration})"
    
    def __repr__(self):
        """Developer-friendly representation."""
        return f"StudySession(student_id='{self.student_id}', subject='{self.subject}', start_time='{self.start_time}')"
```

### Error Handling Best Practices

```python
class AssignmentManager:
    """Manages assignment operations with proper error handling."""
    
    def __init__(self, database_connection):
        self.db = database_connection
    
    def create_assignment(self, assignment_data):
        """
        Create a new assignment with comprehensive error handling.
        
        Args:
            assignment_data (dict): Assignment details
        
        Returns:
            Assignment: Created assignment object
        
        Raises:
            ValidationError: If assignment data is invalid
            DatabaseError: If database operation fails
        """
        try:
            # Validate input data
            self._validate_assignment_data(assignment_data)
            
            # Create assignment object
            assignment = Assignment(**assignment_data)
            
            # Save to database
            assignment_id = self.db.save_assignment(assignment)
            assignment.id = assignment_id
            
            # Log successful creation
            self._log_assignment_created(assignment)
            
            return assignment
            
        except ValidationError as e:
            # Re-raise validation errors with context
            raise ValidationError(f"Invalid assignment data: {e}")
            
        except DatabaseError as e:
            # Log database errors and re-raise
            self._log_database_error("create_assignment", assignment_data, e)
            raise DatabaseError(f"Failed to create assignment: {e}")
            
        except Exception as e:
            # Catch unexpected errors
            self._log_unexpected_error("create_assignment", assignment_data, e)
            raise RuntimeError(f"Unexpected error creating assignment: {e}")
    
    def _validate_assignment_data(self, data):
        """Validate assignment data with specific error messages."""
        required_fields = ['title', 'subject', 'due_date', 'student_id']
        
        for field in required_fields:
            if field not in data or not data[field]:
                raise ValidationError(f"Required field '{field}' is missing or empty")
        
        # Validate due date
        try:
            due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')
            if due_date.date() < datetime.now().date():
                raise ValidationError("Due date cannot be in the past")
        except ValueError:
            raise ValidationError("Due date must be in format YYYY-MM-DD")
        
        # Validate points
        if 'points_possible' in data:
            points = data['points_possible']
            if not isinstance(points, int) or points <= 0:
                raise ValidationError("Points possible must be a positive integer")
    
    def _log_assignment_created(self, assignment):
        """Log successful assignment creation."""
        logger.info(f"Assignment created: {assignment.id} - {assignment.title}")
    
    def _log_database_error(self, operation, data, error):
        """Log database errors with context."""
        logger.error(f"Database error in {operation}: {error}", extra={
            'operation': operation,
            'data': data,
            'error_type': type(error).__name__
        })
    
    def _log_unexpected_error(self, operation, data, error):
        """Log unexpected errors with full context."""
        logger.critical(f"Unexpected error in {operation}: {error}", extra={
            'operation': operation,
            'data': data,
            'error_type': type(error).__name__,
            'traceback': traceback.format_exc()
        })

# Custom exception classes for better error handling
class ValidationError(Exception):
    """Raised when data validation fails."""
    pass

class DatabaseError(Exception):
    """Raised when database operations fail."""
    pass
```

## Code Documentation Standards

### Docstring Examples

```python
def calculate_study_streak(student_id, start_date=None):
    """
    Calculate the current study streak for a student.
    
    A study streak is the number of consecutive days a student has
    completed at least one study session. The streak ends when a day
    passes without any study activity.
    
    Args:
        student_id (str): Unique identifier for the student.
                         Must be in format 'S' followed by 9 digits.
        start_date (datetime.date, optional): Date to start counting from.
                                            Defaults to student's enrollment date.
    
    Returns:
        dict: Dictionary containing:
            - current_streak (int): Number of consecutive study days
            - streak_start_date (datetime.date): When current streak began
            - longest_streak (int): Longest streak ever achieved
            - last_study_date (datetime.date): Date of most recent study session
    
    Raises:
        ValueError: If student_id format is invalid
        StudentNotFoundError: If student doesn't exist in database
        DatabaseError: If database query fails
    
    Examples:
        >>> calculate_study_streak('S000123456')
        {
            'current_streak': 7,
            'streak_start_date': datetime.date(2024, 3, 1),
            'longest_streak': 14,
            'last_study_date': datetime.date(2024, 3, 7)
        }
        
        >>> calculate_study_streak('S000123456', datetime.date(2024, 2, 1))
        {
            'current_streak': 0,
            'streak_start_date': None,
            'longest_streak': 14,
            'last_study_date': datetime.date(2024, 2, 15)
        }
    
    Note:
        This function considers timezone differences. A study session
        at 11:59 PM counts for that day, even if it extends past midnight.
    
    See Also:
        get_study_sessions: For retrieving raw study session data
        calculate_study_statistics: For comprehensive study analytics
    """
    # Implementation would go here
    pass
```

### Comment Guidelines

```python
class GradeCalculator:
    """Handles grade calculations for StudyBuddy assignments."""
    
    def __init__(self, grading_scheme='standard'):
        # Initialize with default grading scheme
        # Standard scheme: A=90-100, B=80-89, C=70-79, D=60-69, F=0-59
        self.scheme = grading_scheme
        self.grade_boundaries = self._get_grade_boundaries(grading_scheme)
    
    def calculate_letter_grade(self, percentage):
        """Convert percentage to letter grade."""
        
        # Handle edge cases first
        if percentage < 0 or percentage > 100:
            raise ValueError("Percentage must be between 0 and 100")
        
        # Find appropriate letter grade
        # Iterate from highest to lowest grade boundaries
        for letter, min_score in sorted(self.grade_boundaries.items(), 
                                      key=lambda x: x[1], reverse=True):
            if percentage >= min_score:
                return letter
        
        # This should never be reached due to F grade having 0 minimum
        return 'F'  # Fallback
    
    def _get_grade_boundaries(self, scheme):
        """
        Get grade boundaries for specified scheme.
        
        TODO: In future versions, load this from configuration file
        to allow different schools to customize grading scales.
        """
        schemes = {
            'standard': {'A': 90, 'B': 80, 'C': 70, 'D': 60, 'F': 0},
            'strict': {'A': 93, 'B': 85, 'C': 75, 'D': 65, 'F': 0},
            'lenient': {'A': 87, 'B': 77, 'C': 67, 'D': 57, 'F': 0}
        }
        
        if scheme not in schemes:
            # Log warning and fall back to standard scheme
            logger.warning(f"Unknown grading scheme '{scheme}', using 'standard'")
            scheme = 'standard'
        
        return schemes[scheme]
```

## Code Review Practices

### Code Review Checklist

```python
class CodeReviewChecklist:
    """
    Comprehensive checklist for code reviews in StudyBuddy project.
    
    Use this during peer reviews to ensure consistent code quality.
    """
    
    FUNCTIONALITY_CHECKS = [
        "Does the code do what it's supposed to do?",
        "Are edge cases handled appropriately?",
        "Are error conditions handled gracefully?",
        "Are there adequate tests for the functionality?",
        "Does the code follow the single responsibility principle?"
    ]
    
    READABILITY_CHECKS = [
        "Are variable and function names descriptive?",
        "Is the code structure logical and easy to follow?",
        "Are complex operations broken down into smaller functions?",
        "Is there appropriate documentation and comments?",
        "Would a new team member understand this code?"
    ]
    
    PERFORMANCE_CHECKS = [
        "Are there any obvious performance bottlenecks?",
        "Is memory usage reasonable?",
        "Are database queries optimized?",
        "Are expensive operations cached when appropriate?",
        "Could any loops or algorithms be more efficient?"
    ]
    
    SECURITY_CHECKS = [
        "Is user input properly validated and sanitized?",
        "Are sensitive data (passwords, tokens) handled securely?",
        "Are SQL injection vulnerabilities prevented?",
        "Are proper authentication/authorization checks in place?",
        "Is error information exposure minimized?"
    ]
    
    MAINTAINABILITY_CHECKS = [
        "Is the code consistent with project conventions?",
        "Are dependencies reasonable and well-managed?",
        "Is the code modular and loosely coupled?",
        "Are configuration values externalized?",
        "Is the code extensible for future requirements?"
    ]
    
    @classmethod
    def generate_review_template(cls):
        """Generate a markdown template for code reviews."""
        template = """# Code Review Checklist

## Functionality ✅
"""
        for check in cls.FUNCTIONALITY_CHECKS:
            template += f"- [ ] {check}\n"
        
        template += "\n## Readability 📖\n"
        for check in cls.READABILITY_CHECKS:
            template += f"- [ ] {check}\n"
        
        template += "\n## Performance ⚡\n"
        for check in cls.PERFORMANCE_CHECKS:
            template += f"- [ ] {check}\n"
        
        template += "\n## Security 🔒\n"
        for check in cls.SECURITY_CHECKS:
            template += f"- [ ] {check}\n"
        
        template += "\n## Maintainability 🔧\n"
        for check in cls.MAINTAINABILITY_CHECKS:
            template += f"- [ ] {check}\n"
        
        template += """
## Additional Comments
[Provide specific feedback, suggestions, or praise]

## Approval Status
- [ ] Approved - ready to merge
- [ ] Approved with minor changes
- [ ] Needs revision before approval
"""
        
        return template
```

### Constructive Feedback Examples

```python
# Examples of good code review comments

GOOD_FEEDBACK_EXAMPLES = {
    "positive_reinforcement": [
        "Great job using descriptive variable names here! Makes the logic very clear.",
        "Nice error handling - this will make debugging much easier.",
        "Love how you broke this complex function into smaller, testable pieces.",
        "Excellent documentation! The examples really help understand the function."
    ],
    
    "constructive_suggestions": [
        "Consider extracting this magic number (86400) into a named constant like SECONDS_PER_DAY.",
        "This nested loop might have performance issues with large datasets. Could we use a dictionary lookup instead?",
        "The function name 'process_data' is quite generic. Maybe 'calculate_student_gpa' would be more descriptive?",
        "Would it be worth adding input validation here to catch invalid student IDs early?"
    ],
    
    "questions_for_clarification": [
        "I'm not sure I understand the business logic here. Could you add a comment explaining why we multiply by 0.85?",
        "Is there a reason we're using a list here instead of a set? Are duplicates expected?",
        "Should this function handle the case where the student has no assignments?",
        "What happens if the database connection fails in this function?"
    ],
    
    "learning_opportunities": [
        "Here's a Python idiom that might make this cleaner: [example code]",
        "Did you know Python has a built-in function for this? Check out collections.Counter",
        "This looks like a common pattern - we might want to create a utility function for it.",
        "Consider using a context manager here to ensure the file is always closed properly."
    ]
}

# Examples of feedback to avoid
BAD_FEEDBACK_EXAMPLES = {
    "unhelpful_criticism": [
        "This code is bad.",  # Not specific or constructive
        "Why did you do it this way?",  # Sounds accusatory
        "This is wrong.",  # Doesn't explain what's wrong or how to fix it
        "I would never write it like this."  # Personal preference without explanation
    ],
    
    "overwhelming_feedback": [
        "Here are 47 things that need to be changed...",  # Too many issues at once
        "Rewrite the entire function.",  # Too broad, not actionable
        "This doesn't follow any of our standards."  # Not specific about which standards
    ]
}
```

## Refactoring Strategies

### Before and After Examples

```python
# ❌ BEFORE: Poor code quality
def calc_stats(data):
    total = 0
    count = 0
    max_val = data[0]
    min_val = data[0]
    
    for i in range(len(data)):
        total += data[i]
        count += 1
        if data[i] > max_val:
            max_val = data[i]
        if data[i] < min_val:
            min_val = data[i]
    
    avg = total / count
    
    variance_sum = 0
    for i in range(len(data)):
        variance_sum += (data[i] - avg) ** 2
    
    variance = variance_sum / count
    std_dev = variance ** 0.5
    
    return total, count, avg, max_val, min_val, variance, std_dev

# ✅ AFTER: High code quality
from typing import List, NamedTuple
from statistics import mean, variance, stdev

class StatisticsSummary(NamedTuple):
    """Container for statistical summary data."""
    total: float
    count: int
    mean: float
    maximum: float
    minimum: float
    variance: float
    standard_deviation: float

def calculate_statistics(values: List[float]) -> StatisticsSummary:
    """
    Calculate comprehensive statistics for a list of numeric values.
    
    Args:
        values: List of numeric values to analyze
    
    Returns:
        StatisticsSummary object containing calculated statistics
    
    Raises:
        ValueError: If values list is empty
        TypeError: If values contains non-numeric data
    
    Examples:
        >>> stats = calculate_statistics([1, 2, 3, 4, 5])
        >>> stats.mean
        3.0
        >>> stats.standard_deviation
        1.5811388300841898
    """
    if not values:
        raise ValueError("Cannot calculate statistics for empty list")
    
    # Validate that all values are numeric
    if not all(isinstance(v, (int, float)) for v in values):
        raise TypeError("All values must be numeric")
    
    # Use built-in functions for robust calculations
    total = sum(values)
    count = len(values)
    mean_value = mean(values)
    maximum = max(values)
    minimum = min(values)
    variance_value = variance(values)
    std_dev = stdev(values)
    
    return StatisticsSummary(
        total=total,
        count=count,
        mean=mean_value,
        maximum=maximum,
        minimum=minimum,
        variance=variance_value,
        standard_deviation=std_dev
    )
```

### Refactoring Process

```python
class RefactoringStrategy:
    """Step-by-step approach to improving code quality."""
    
    REFACTORING_STEPS = [
        {
            "step": 1,
            "name": "Extract Methods",
            "description": "Break large functions into smaller, focused functions",
            "example": "Split 200-line function into 5 focused methods"
        },
        {
            "step": 2,
            "name": "Improve Names",
            "description": "Replace unclear names with descriptive ones",
            "example": "Change 'calc()' to 'calculate_student_gpa()'"
        },
        {
            "step": 3,
            "name": "Add Documentation",
            "description": "Add docstrings and comments for complex logic",
            "example": "Document algorithm complexity and business rules"
        },
        {
            "step": 4,
            "name": "Handle Errors",
            "description": "Add proper exception handling and validation",
            "example": "Validate inputs and handle database failures gracefully"
        },
        {
            "step": 5,
            "name": "Optimize Performance",
            "description": "Improve algorithms and reduce resource usage",
            "example": "Replace O(n²) loop with O(n) dictionary lookup"
        },
        {
            "step": 6,
            "name": "Add Tests",
            "description": "Create unit tests to verify behavior",
            "example": "Test edge cases, error conditions, and expected behavior"
        }
    ]
    
    @classmethod
    def get_refactoring_plan(cls, current_issues):
        """Generate a prioritized refactoring plan based on current issues."""
        plan = []
        
        issue_to_step = {
            "long_functions": 1,
            "unclear_names": 2,
            "no_documentation": 3,
            "poor_error_handling": 4,
            "performance_issues": 5,
            "no_tests": 6
        }
        
        for issue in current_issues:
            if issue in issue_to_step:
                step_num = issue_to_step[issue]
                step_info = cls.REFACTORING_STEPS[step_num - 1]
                plan.append(step_info)
        
        # Sort by step number for logical order
        plan.sort(key=lambda x: x["step"])
        
        return plan
```

## Code Quality Metrics

### Measuring Code Quality

```python
import ast
import os
from collections import defaultdict

class CodeQualityAnalyzer:
    """Analyze Python code for quality metrics."""
    
    def __init__(self):
        self.metrics = defaultdict(int)
        self.issues = []
    
    def analyze_file(self, file_path):
        """Analyze a Python file for quality metrics."""
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        try:
            tree = ast.parse(content)
            self._analyze_ast(tree, content)
        except SyntaxError as e:
            self.issues.append(f"Syntax error in {file_path}: {e}")
    
    def _analyze_ast(self, tree, content):
        """Analyze Abstract Syntax Tree for quality metrics."""
        lines = content.split('\n')
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                self._analyze_function(node, lines)
            elif isinstance(node, ast.ClassDef):
                self._analyze_class(node)
    
    def _analyze_function(self, node, lines):
        """Analyze function for quality issues."""
        # Count lines of code in function
        start_line = node.lineno - 1
        end_line = node.end_lineno - 1 if node.end_lineno else start_line
        function_lines = end_line - start_line + 1
        
        self.metrics['total_functions'] += 1
        self.metrics['total_function_lines'] += function_lines
        
        # Check for long functions (over 50 lines)
        if function_lines > 50:
            self.issues.append(f"Function '{node.name}' is {function_lines} lines long (consider breaking it up)")
            self.metrics['long_functions'] += 1
        
        # Check for missing docstrings
        if not ast.get_docstring(node):
            self.issues.append(f"Function '{node.name}' missing docstring")
            self.metrics['missing_docstrings'] += 1
        
        # Count parameters (complexity indicator)
        param_count = len(node.args.args)
        if param_count > 5:
            self.issues.append(f"Function '{node.name}' has {param_count} parameters (consider refactoring)")
            self.metrics['complex_functions'] += 1
        
        # Check for deeply nested code
        max_depth = self._calculate_nesting_depth(node)
        if max_depth > 4:
            self.issues.append(f"Function '{node.name}' has nesting depth of {max_depth} (consider flattening)")
            self.metrics['deeply_nested_functions'] += 1
    
    def _calculate_nesting_depth(self, node, current_depth=0):
        """Calculate maximum nesting depth in a function."""
        max_depth = current_depth
        
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.If, ast.For, ast.While, ast.With, ast.Try)):
                child_depth = self._calculate_nesting_depth(child, current_depth + 1)
                max_depth = max(max_depth, child_depth)
        
        return max_depth
    
    def _analyze_class(self, node):
        """Analyze class for quality issues."""
        self.metrics['total_classes'] += 1
        
        # Check for missing docstrings
        if not ast.get_docstring(node):
            self.issues.append(f"Class '{node.name}' missing docstring")
            self.metrics['missing_class_docstrings'] += 1
        
        # Count methods
        method_count = sum(1 for child in node.body if isinstance(child, ast.FunctionDef))
        self.metrics['total_methods'] += method_count
        
        # Check for classes with too many methods
        if method_count > 20:
            self.issues.append(f"Class '{node.name}' has {method_count} methods (consider splitting)")
            self.metrics['large_classes'] += 1
    
    def generate_report(self):
        """Generate a comprehensive quality report."""
        report = {
            'metrics': dict(self.metrics),
            'issues': self.issues,
            'quality_score': self._calculate_quality_score()
        }
        
        return report
    
    def _calculate_quality_score(self):
        """Calculate overall quality score (0-100)."""
        if self.metrics['total_functions'] == 0:
            return 100
        
        # Deduct points for various issues
        score = 100
        
        # Deduct for missing documentation
        doc_penalty = (self.metrics['missing_docstrings'] / self.metrics['total_functions']) * 20
        score -= doc_penalty
        
        # Deduct for complexity issues
        complexity_penalty = (self.metrics['complex_functions'] / self.metrics['total_functions']) * 15
        score -= complexity_penalty
        
        # Deduct for long functions
        length_penalty = (self.metrics['long_functions'] / self.metrics['total_functions']) * 25
        score -= length_penalty
        
        # Deduct for deep nesting
        nesting_penalty = (self.metrics['deeply_nested_functions'] / self.metrics['total_functions']) * 20
        score -= nesting_penalty
        
        return max(0, score)

# Example usage
def analyze_project_quality(project_path):
    """Analyze all Python files in a project for quality."""
    analyzer = CodeQualityAnalyzer()
    
    for root, dirs, files in os.walk(project_path):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                analyzer.analyze_file(file_path)
    
    report = analyzer.generate_report()
    
    print(f"📊 CODE QUALITY REPORT")
    print(f"=" * 40)
    print(f"Quality Score: {report['quality_score']:.1f}/100")
    print(f"Total Functions: {report['metrics']['total_functions']}")
    print(f"Total Classes: {report['metrics']['total_classes']}")
    
    if report['issues']:
        print(f"\n🚨 ISSUES FOUND ({len(report['issues'])})")
        for i, issue in enumerate(report['issues'][:10], 1):  # Show first 10 issues
            print(f"  {i}. {issue}")
        
        if len(report['issues']) > 10:
            print(f"  ... and {len(report['issues']) - 10} more issues")
    
    return report
```

## Automated Code Quality Tools

### Setting Up Quality Tools

```python
# requirements.txt for code quality tools
"""
# Code formatting
black==23.3.0
isort==5.12.0

# Linting and static analysis
flake8==6.0.0
pylint==2.17.4
mypy==1.3.0

# Security scanning
bandit==1.7.5

# Documentation
pydocstyle==6.3.0

# Testing
pytest==7.3.1
pytest-cov==4.1.0
"""

# .pre-commit-config.yaml
"""
repos:
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black
        language_version: python3.11
        
  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
        args: ["--profile", "black"]
        
  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
        args: [--max-line-length=88, --extend-ignore=E203,W503]
        
  - repo: https://github.com/pycqa/pylint
    rev: v2.17.4
    hooks:
      - id: pylint
        args: [--disable=C0114,C0116]
        
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.5
    hooks:
      - id: bandit
        args: ["-r", ".", "-f", "json", "-o", "bandit-report.json"]
"""

# Configuration files
TOOL_CONFIGS = {
    "setup.cfg": """
[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude = 
    .git,
    __pycache__,
    .venv,
    .pytest_cache

[mypy]
python_version = 3.11
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True

[pydocstyle]
inherit = false
ignore = D213,D203,D417
""",
    
    "pyproject.toml": """
[tool.black]
line-length = 88
target-version = ['py311']
include = '\\.pyi?$'
exclude = '''
/(
    \\.git
  | \\.venv
  | __pycache__
  | \\.pytest_cache
)/
'''

[tool.isort]
profile = "black"
multi_line_output = 3
line_length = 88
include_trailing_comma = true
force_grid_wrap = 0
use_parentheses = true
ensure_newline_before_comments = true

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
python_functions = "test_*"
addopts = "--cov=src --cov-report=html --cov-report=term-missing"
"""
}
```

## Key Takeaways

✅ **Readability is king** - Code is read far more than it's written
✅ **Single responsibility** - Each function should do one thing well
✅ **Meaningful names** - Choose names that clearly express intent
✅ **Proper error handling** - Anticipate and handle failures gracefully
✅ **Comprehensive documentation** - Explain the why, not just the what
✅ **Consistent code reviews** - Fresh eyes catch issues and share knowledge
✅ **Continuous refactoring** - Regularly improve code structure and clarity
✅ **Automated quality tools** - Use tools to catch issues early

/// details | Professional Code Quality Impact 💼
    type: tip

**Industry statistics show:**
- **Bug fixes cost 5x more** in production than during development
- **Code reviews reduce defects** by 80-90% when done properly
- **Well-documented code** reduces onboarding time by 75%
- **Automated quality tools** catch 60% of issues before human review
- **Refactoring investments** pay back 4:1 in reduced maintenance costs

Quality code isn't just about aesthetics - it directly impacts project success, team productivity, and your professional reputation!

///

## Practice Exercises

### Exercise 1: Code Quality Audit
Take a piece of code you've written recently and:
1. Run it through the quality analyzer
2. Identify 3 specific improvements
3. Refactor using the strategies learned
4. Document your changes and reasoning

### Exercise 2: Code Review Practice
Find a code snippet online and:
1. Apply the code review checklist
2. Write constructive feedback comments
3. Suggest specific improvements
4. Estimate the quality score

### Exercise 3: Documentation Challenge
Choose a function without documentation and:
1. Add comprehensive docstrings
2. Include examples and edge cases
3. Document error conditions
4. Write inline comments for complex logic

### Exercise 4: Refactoring Exercise
Take a long, complex function and:
1. Break it into smaller functions
2. Improve variable names
3. Add proper error handling
4. Create unit tests for each piece

## Next Steps

Excellent work! You're developing the skills to write professional-quality code that other developers will appreciate working with.

Continue to [Project Management](project-management.md) to learn how to organize and manage your coding projects effectively.

---

*Remember: Quality code is not an accident - it's the result of deliberate choices, consistent practices, and continuous improvement. Every line of code is an opportunity to demonstrate your professionalism!*
