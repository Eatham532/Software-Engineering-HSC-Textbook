# Testing & Debugging

## Introduction

Even the best programmers write bugs. The difference between novice and expert developers isn't the absence of bugs - it's the ability to find and fix them quickly and prevent them from happening again. **Testing** and **debugging** are essential skills that turn good programmers into great ones.

/// details | Why Testing & Debugging Matter 🐛→✨
    type: important

**The cost of bugs grows exponentially:**
- **During development**: Fix in minutes with good debugging skills
- **During testing**: Hours to identify and resolve
- **In production**: Days of downtime, angry users, lost revenue
- **Boeing 737 MAX**: Poor software testing led to tragic crashes
- **Knight Capital**: A deployment bug lost $440 million in 45 minutes

Testing and debugging skills literally save lives and money!

///

## The Bug Lifecycle

### 1. Prevention (Best Defense)
Write code that's less likely to have bugs in the first place.

### 2. Detection (Find Early)
Discover bugs through testing before users encounter them.

### 3. Isolation (Narrow Down)
Identify exactly where and why the bug occurs.

### 4. Resolution (Fix It)
Correct the underlying problem, not just the symptoms.

### 5. Verification (Confirm Fix)
Ensure the fix works and doesn't introduce new bugs.

### 6. Prevention (Learn)
Update practices to prevent similar bugs in the future.

## Types of Bugs

### StudyBuddy Examples

#### 1. Syntax Errors - Code Won't Run
```python
# Syntax error: missing closing parenthesis
def calculate_grade(score, total:
    return (score / total) * 100

# Fixed version
def calculate_grade(score, total):
    return (score / total) * 100
```

#### 2. Runtime Errors - Code Crashes During Execution
```python
def get_student_average(student_grades):
    # Runtime error: division by zero if list is empty
    return sum(student_grades) / len(student_grades)

# Fixed version with error handling
def get_student_average(student_grades):
    if not student_grades:
        return 0
    return sum(student_grades) / len(student_grades)
```

#### 3. Logic Errors - Code Runs But Produces Wrong Results
```python
def calculate_letter_grade(percentage):
    # Logic error: boundaries are wrong
    if percentage >= 90:
        return "A"
    elif percentage >= 85:  # Should be 80!
        return "B"
    elif percentage >= 75:  # Should be 70!
        return "C"
    # ... more incorrect boundaries

# Test reveals the problem
print(calculate_letter_grade(82))  # Returns "C" instead of "B"
```

#### 4. Integration Errors - Components Don't Work Together
```python
class Assignment:
    def __init__(self, title, due_date):
        self.title = title
        self.due_date = due_date  # String format

class StudyPlanner:
    def days_until_due(self, assignment):
        from datetime import datetime
        # Integration error: expecting datetime object, got string
        return (assignment.due_date - datetime.now()).days

# This will crash because you can't subtract datetime from string
```

#### 5. Performance Bugs - Code is Slow
```python
def find_student_assignments(student_name, all_assignments):
    # Performance bug: O(n) search repeated many times
    student_assignments = []
    for assignment in all_assignments:
        if assignment.student_name == student_name:
            student_assignments.append(assignment)
    return student_assignments

# Better: Use dictionary lookup O(1)
assignments_by_student = {}
for assignment in all_assignments:
    if assignment.student_name not in assignments_by_student:
        assignments_by_student[assignment.student_name] = []
    assignments_by_student[assignment.student_name].append(assignment)
```

## Testing Strategies

### 1. Unit Testing - Test Individual Functions

```python
import pytest
from datetime import datetime, timedelta

def test_calculate_letter_grade():
    """Test letter grade calculation with various inputs"""
    
    # Test A grade boundary
    assert calculate_letter_grade(95) == "A"
    assert calculate_letter_grade(90) == "A"
    assert calculate_letter_grade(89.9) == "B"
    
    # Test B grade boundary
    assert calculate_letter_grade(85) == "B"
    assert calculate_letter_grade(80) == "B"
    assert calculate_letter_grade(79.9) == "C"
    
    # Test edge cases
    assert calculate_letter_grade(100) == "A"
    assert calculate_letter_grade(0) == "F"
    
    # Test invalid inputs
    with pytest.raises(ValueError):
        calculate_letter_grade(-10)
    with pytest.raises(ValueError):
        calculate_letter_grade(110)

def test_student_average_calculation():
    """Test average calculation edge cases"""
    
    # Normal case
    assert get_student_average([85, 90, 78]) == 84.33333333333333
    
    # Edge cases
    assert get_student_average([]) == 0
    assert get_student_average([100]) == 100
    assert get_student_average([0, 0, 0]) == 0
    
    # Test with floats
    assert get_student_average([85.5, 90.2, 78.8]) == pytest.approx(84.83, rel=1e-2)
```

### 2. Integration Testing - Test Component Interactions

```python
def test_assignment_submission_workflow():
    """Test complete assignment submission process"""
    
    # Setup
    student = Student("S001", "Alex Chen", 11)
    assignment_title = "Math Quiz"
    
    # Test adding assignment
    student.add_assignment(assignment_title, "2024-03-15", 100)
    assert len(student.assignments) == 1
    assert not student.assignments[0]["completed"]
    
    # Test submitting assignment
    student.submit_assignment(assignment_title, 85)
    assert student.assignments[0]["completed"]
    assert student.assignments[0]["points_earned"] == 85
    
    # Test grade calculation
    average = student.get_current_average()
    assert average == 85.0
    
    # Test with multiple assignments
    student.add_assignment("Science Lab", "2024-03-18", 75)
    student.submit_assignment("Science Lab", 70)
    
    new_average = student.get_current_average()
    expected_average = (85 + 70) / (100 + 75) * 100
    assert abs(new_average - expected_average) < 0.01
```

### 3. End-to-End Testing - Test Complete User Workflows

```python
def test_complete_student_semester():
    """Test entire semester workflow"""
    
    # Create student
    student = Student("S001", "Alex Chen", 11)
    
    # Add multiple assignments
    assignments = [
        ("Math Quiz 1", 100, 85),
        ("Science Lab 1", 75, 70),
        ("English Essay", 50, 45),
        ("History Project", 80, 72)
    ]
    
    for title, points_possible, points_earned in assignments:
        student.add_assignment(title, "2024-03-15", points_possible)
        student.submit_assignment(title, points_earned)
    
    # Verify final state
    assert len(student.assignments) == 4
    assert all(a["completed"] for a in student.assignments)
    
    # Check calculations
    total_earned = sum(a[2] for a in assignments)
    total_possible = sum(a[1] for a in assignments)
    expected_average = (total_earned / total_possible) * 100
    
    actual_average = student.get_current_average()
    assert abs(actual_average - expected_average) < 0.01
    
    # Test letter grade
    letter_grade = calculate_letter_grade(actual_average)
    assert letter_grade in ["A", "B", "C", "D", "F"]
```

### 4. Property-Based Testing - Test with Random Inputs

```python
import hypothesis
from hypothesis import given, strategies as st

@given(st.lists(st.floats(min_value=0, max_value=100), min_size=1))
def test_average_always_within_bounds(grades):
    """Test that average is always between min and max grade"""
    average = get_student_average(grades)
    
    if grades:  # Skip empty lists
        assert min(grades) <= average <= max(grades)

@given(st.floats(min_value=0, max_value=100))
def test_letter_grade_consistency(percentage):
    """Test that letter grades are consistently assigned"""
    grade = calculate_letter_grade(percentage)
    
    # Verify grade is valid
    assert grade in ["A", "B", "C", "D", "F"]
    
    # Verify consistency (same input = same output)
    assert calculate_letter_grade(percentage) == grade
    
    # Verify monotonicity (higher percentage ≥ same or better grade)
    if percentage < 100:
        higher_grade = calculate_letter_grade(percentage + 0.1)
        grade_values = {"F": 0, "D": 1, "C": 2, "B": 3, "A": 4}
        assert grade_values[higher_grade] >= grade_values[grade]
```

## Debugging Techniques

### 1. Print Debugging - Simple and Effective

```python
def calculate_weighted_grade(homework, tests, projects):
    """Calculate weighted grade with debug prints"""
    print(f"🔍 DEBUG: Input values - homework: {homework}, tests: {tests}, projects: {projects}")
    
    # Weights
    hw_weight = 0.30
    test_weight = 0.50
    proj_weight = 0.20
    
    print(f"🔍 DEBUG: Weights - hw: {hw_weight}, test: {test_weight}, proj: {proj_weight}")
    
    # Calculations
    weighted_hw = homework * hw_weight
    weighted_test = tests * test_weight
    weighted_proj = projects * proj_weight
    
    print(f"🔍 DEBUG: Weighted values - hw: {weighted_hw}, test: {weighted_test}, proj: {weighted_proj}")
    
    final_grade = weighted_hw + weighted_test + weighted_proj
    print(f"🔍 DEBUG: Final grade: {final_grade}")
    
    return final_grade

# Usage reveals the bug
result = calculate_weighted_grade(85, 90, 78)
print(f"Final result: {result}")
```

### 2. Logging - Professional Debugging

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('studybuddy_debug.log'),
        logging.StreamHandler()
    ]
)

class Student:
    def __init__(self, student_id, name, grade_level):
        self.student_id = student_id
        self.name = name
        self.grade_level = grade_level
        self.assignments = []
        
        logging.info(f"Created student: {name} (ID: {student_id})")
    
    def add_assignment(self, title, due_date, points):
        logging.debug(f"Adding assignment '{title}' for {self.name}")
        
        assignment = {
            "title": title,
            "due_date": due_date,
            "points_possible": points,
            "completed": False
        }
        
        self.assignments.append(assignment)
        logging.info(f"Assignment added: {title} ({points} points)")
    
    def submit_assignment(self, title, points_earned):
        logging.debug(f"Submitting assignment '{title}' for {self.name}")
        
        for assignment in self.assignments:
            if assignment["title"] == title:
                assignment["points_earned"] = points_earned
                assignment["completed"] = True
                
                percentage = (points_earned / assignment["points_possible"]) * 100
                logging.info(f"Assignment submitted: {title} - {percentage:.1f}%")
                return
        
        logging.warning(f"Assignment not found: '{title}' for student {self.name}")
```

### 3. Debugger Usage - Step Through Code

```python
import pdb  # Python debugger

def problematic_function(student_data):
    """Function with a bug we need to debug"""
    total_points = 0
    completed_assignments = 0
    
    for student in student_data:
        pdb.set_trace()  # Debugger breakpoint
        
        for assignment in student["assignments"]:
            if assignment["completed"]:
                total_points += assignment["points_earned"]
                completed_assignments += 1
    
    # Bug: should return average per student, not total
    if completed_assignments == 0:
        return 0
    
    return total_points / completed_assignments

# Debugger commands:
# n - next line
# s - step into function
# c - continue execution
# p variable_name - print variable value
# l - list current code
# q - quit debugger
```

### 4. Assertion-Based Debugging

```python
def calculate_gpa(grades, credits):
    """Calculate GPA with assertions to catch bugs early"""
    
    # Precondition assertions
    assert len(grades) == len(credits), f"Mismatched lengths: {len(grades)} grades, {len(credits)} credits"
    assert all(0 <= grade <= 4.0 for grade in grades), f"Invalid grades found: {grades}"
    assert all(credit > 0 for credit in credits), f"Invalid credits found: {credits}"
    
    total_grade_points = 0
    total_credits = 0
    
    for grade, credit in zip(grades, credits):
        grade_points = grade * credit
        total_grade_points += grade_points
        total_credits += credit
        
        # Intermediate assertion
        assert grade_points >= 0, f"Negative grade points: {grade_points}"
    
    if total_credits == 0:
        return 0.0
    
    gpa = total_grade_points / total_credits
    
    # Postcondition assertion
    assert 0 <= gpa <= 4.0, f"Invalid GPA calculated: {gpa}"
    
    return gpa

# Assertions will trigger if bugs exist:
try:
    # This will trigger assertion error
    bad_gpa = calculate_gpa([3.5, 4.0, -1.0], [3, 4, 3])
except AssertionError as e:
    print(f"Bug caught: {e}")
```

## StudyBuddy Debugging Scenarios

### Scenario 1: Grade Calculation Bug

```python
def debug_grade_calculation():
    """Debug a mysterious grade calculation issue"""
    
    # Student reports: "My average should be 85%, but it shows 20%"
    student = Student("S001", "Confused Student", 11)
    
    # Add assignments as reported
    student.add_assignment("Math Quiz", "2024-03-01", 100)
    student.add_assignment("Science Test", "2024-03-05", 50)
    student.add_assignment("English Essay", "2024-03-10", 75)
    
    # Submit grades as reported
    student.submit_assignment("Math Quiz", 85)
    student.submit_assignment("Science Test", 40)
    student.submit_assignment("English Essay", 65)
    
    # Debug the calculation
    print("🔍 Debugging grade calculation:")
    print(f"Assignments: {len(student.assignments)}")
    
    total_earned = 0
    total_possible = 0
    
    for i, assignment in enumerate(student.assignments):
        if assignment["completed"]:
            earned = assignment["points_earned"]
            possible = assignment["points_possible"]
            percentage = (earned / possible) * 100
            
            print(f"Assignment {i+1}: {earned}/{possible} = {percentage:.1f}%")
            
            total_earned += earned
            total_possible += possible
    
    calculated_average = (total_earned / total_possible) * 100
    student_average = student.get_current_average()
    
    print(f"Manual calculation: {total_earned}/{total_possible} = {calculated_average:.1f}%")
    print(f"Student method result: {student_average:.1f}%")
    
    # Found the bug! The student method might be using wrong formula
    
debug_grade_calculation()
```

### Scenario 2: Assignment Due Date Bug

```python
from datetime import datetime, timedelta

def debug_due_date_notifications():
    """Debug why due date notifications aren't working"""
    
    # Setup test data
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    yesterday = today - timedelta(days=1)
    
    assignments = [
        {"title": "Math Quiz", "due_date": tomorrow, "completed": False},
        {"title": "Old Assignment", "due_date": yesterday, "completed": False},
        {"title": "Future Assignment", "due_date": today + timedelta(days=5), "completed": False},
        {"title": "Completed Assignment", "due_date": tomorrow, "completed": True}
    ]
    
    print("🔍 Debugging due date notifications:")
    print(f"Today: {today.strftime('%Y-%m-%d %H:%M')}")
    
    def get_due_soon_assignments(assignments, hours_ahead=24):
        """Get assignments due within specified hours"""
        cutoff_time = datetime.now() + timedelta(hours=hours_ahead)
        due_soon = []
        
        for assignment in assignments:
            print(f"  Checking: {assignment['title']}")
            print(f"    Due: {assignment['due_date'].strftime('%Y-%m-%d %H:%M')}")
            print(f"    Completed: {assignment['completed']}")
            print(f"    Due before cutoff ({cutoff_time.strftime('%Y-%m-%d %H:%M')}): {assignment['due_date'] <= cutoff_time}")
            
            if (not assignment["completed"] and 
                assignment["due_date"] <= cutoff_time and 
                assignment["due_date"] >= datetime.now()):  # Bug was here - missing this condition!
                due_soon.append(assignment)
                print("    ✅ Added to due soon list")
            else:
                print("    ❌ Not added to due soon list")
            print()
        
        return due_soon
    
    due_soon = get_due_soon_assignments(assignments)
    print(f"Assignments due soon: {[a['title'] for a in due_soon]}")

debug_due_date_notifications()
```

## Testing Best Practices

### 1. Test-Driven Development (TDD)

```python
# Step 1: Write failing test first
def test_assignment_priority_calculation():
    """Test assignment priority calculation (not implemented yet)"""
    
    # High priority: due tomorrow, high points
    high_priority = Assignment("Important Test", datetime.now() + timedelta(days=1), 100)
    
    # Low priority: due next week, low points
    low_priority = Assignment("Minor Quiz", datetime.now() + timedelta(days=7), 25)
    
    # Calculate priorities (function doesn't exist yet)
    high_score = calculate_assignment_priority(high_priority)
    low_score = calculate_assignment_priority(low_priority)
    
    # High priority assignment should have higher score
    assert high_score > low_score
    assert high_score >= 0.8  # Should be high priority
    assert low_score <= 0.4   # Should be low priority

# Step 2: Implement minimum code to make test pass
def calculate_assignment_priority(assignment):
    """Calculate assignment priority score (0-1)"""
    
    # Simple implementation to make test pass
    days_until_due = (assignment.due_date - datetime.now()).days
    
    # Urgency factor (higher when due sooner)
    if days_until_due <= 1:
        urgency = 1.0
    elif days_until_due <= 3:
        urgency = 0.7
    elif days_until_due <= 7:
        urgency = 0.4
    else:
        urgency = 0.1
    
    # Importance factor (higher for more points)
    importance = min(assignment.points / 100, 1.0)
    
    # Combined priority
    priority = (urgency * 0.6) + (importance * 0.4)
    return priority

# Step 3: Refactor and improve while keeping tests passing
```

### 2. Comprehensive Test Coverage

```python
def test_student_class_comprehensive():
    """Comprehensive test coverage for Student class"""
    
    # Test initialization
    student = Student("S001", "Test Student", 11)
    assert student.student_id == "S001"
    assert student.name == "Test Student"
    assert student.grade_level == 11
    assert student.assignments == []
    
    # Test adding assignments
    student.add_assignment("Test 1", "2024-03-15", 100)
    assert len(student.assignments) == 1
    assert student.assignments[0]["title"] == "Test 1"
    assert not student.assignments[0]["completed"]
    
    # Test submitting assignments
    student.submit_assignment("Test 1", 85)
    assert student.assignments[0]["completed"]
    assert student.assignments[0]["points_earned"] == 85
    
    # Test submitting non-existent assignment
    result = student.submit_assignment("Non-existent", 90)
    assert result is None  # Should handle gracefully
    
    # Test average calculation
    assert student.get_current_average() == 85.0
    
    # Test with multiple assignments
    student.add_assignment("Test 2", "2024-03-18", 50)
    student.submit_assignment("Test 2", 40)
    
    expected_avg = (85 + 40) / (100 + 50) * 100
    assert abs(student.get_current_average() - expected_avg) < 0.01
    
    # Test incomplete assignments
    student.add_assignment("Test 3", "2024-03-20", 75)
    incomplete = student.get_incomplete_assignments()
    assert len(incomplete) == 1
    assert incomplete[0]["title"] == "Test 3"
    
    # Test edge cases
    empty_student = Student("S002", "Empty Student", 12)
    assert empty_student.get_current_average() == 0
    assert empty_student.get_incomplete_assignments() == []
```

### 3. Mock Testing for External Dependencies

```python
from unittest.mock import Mock, patch
import requests

def send_grade_notification(student_email, grade_info):
    """Send grade notification via email API"""
    try:
        response = requests.post(
            "https://api.emailservice.com/send",
            json={
                "to": student_email,
                "subject": f"Grade Update: {grade_info['assignment']}",
                "body": f"You received {grade_info['grade']}% on {grade_info['assignment']}"
            }
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Error sending notification: {e}")
        return False

@patch('requests.post')  # Mock the external API call
def test_grade_notification_success(mock_post):
    """Test successful grade notification"""
    
    # Setup mock response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_post.return_value = mock_response
    
    # Test the function
    result = send_grade_notification(
        "student@example.com",
        {"assignment": "Math Quiz", "grade": 85}
    )
    
    # Verify behavior
    assert result is True
    assert mock_post.called
    
    # Verify correct API call was made
    call_args = mock_post.call_args
    assert call_args[1]['json']['to'] == "student@example.com"
    assert "Math Quiz" in call_args[1]['json']['subject']

@patch('requests.post')
def test_grade_notification_failure(mock_post):
    """Test failed grade notification"""
    
    # Setup mock to simulate API failure
    mock_post.side_effect = requests.ConnectionError("API unavailable")
    
    # Test the function
    result = send_grade_notification(
        "student@example.com",
        {"assignment": "Math Quiz", "grade": 85}
    )
    
    # Should handle failure gracefully
    assert result is False
```

## Common Debugging Scenarios

### Bug 1: Off-by-One Errors

```python
def get_top_students(students, count):
    """Get top N students - with potential off-by-one bug"""
    
    sorted_students = sorted(students, key=lambda s: s.get_current_average(), reverse=True)
    
    # Bug: what if count > len(students)?
    return sorted_students[:count]  # Could cause issues

def test_top_students_edge_cases():
    """Test edge cases that reveal off-by-one bugs"""
    
    students = [
        Student("S001", "Student 1", 11),
        Student("S002", "Student 2", 11),
        Student("S003", "Student 3", 11)
    ]
    
    # Set up grades
    for i, student in enumerate(students):
        student.add_assignment("Test", "2024-03-15", 100)
        student.submit_assignment("Test", 80 + i * 5)  # 80, 85, 90
    
    # Test normal case
    top_2 = get_top_students(students, 2)
    assert len(top_2) == 2
    
    # Test edge cases
    top_0 = get_top_students(students, 0)
    assert len(top_0) == 0
    
    top_all = get_top_students(students, 3)
    assert len(top_all) == 3
    
    # Test potential bug: requesting more than available
    top_10 = get_top_students(students, 10)
    assert len(top_10) == 3  # Should not crash, return all available
```

### Bug 2: Floating Point Precision Issues

```python
def test_floating_point_precision():
    """Test floating point arithmetic precision issues"""
    
    # This might fail due to floating point precision
    grades = [85.1, 90.2, 78.7]
    average = sum(grades) / len(grades)
    
    # Wrong way to test
    # assert average == 84.66666666666667  # This might fail!
    
    # Right way to test floating point values
    import pytest
    assert average == pytest.approx(84.67, rel=1e-2)  # Within 1% tolerance
    
    # Or use manual tolerance
    expected = 84.67
    assert abs(average - expected) < 0.01

def safe_grade_comparison(grade1, grade2, tolerance=0.01):
    """Safely compare floating point grades"""
    return abs(grade1 - grade2) < tolerance
```

### Bug 3: Mutable Default Arguments

```python
# Dangerous: mutable default argument
def add_assignment_to_student(student, assignment, subjects=[]):  # BUG!
    """Add assignment and track subjects - BUGGY VERSION"""
    subjects.append(assignment.subject)  # This modifies the default list!
    student.assignments.append(assignment)
    return subjects

# Safe version
def add_assignment_to_student_safe(student, assignment, subjects=None):
    """Add assignment and track subjects - SAFE VERSION"""
    if subjects is None:
        subjects = []
    
    subjects.append(assignment.subject)
    student.assignments.append(assignment)
    return subjects

def test_mutable_default_argument_bug():
    """Test that demonstrates the mutable default argument bug"""
    
    student1 = Student("S001", "Student 1", 11)
    student2 = Student("S002", "Student 2", 11)
    
    assignment1 = type('Assignment', (), {'subject': 'Math'})()
    assignment2 = type('Assignment', (), {'subject': 'Science'})()
    
    # Using buggy version
    subjects1 = add_assignment_to_student(student1, assignment1)
    subjects2 = add_assignment_to_student(student2, assignment2)
    
    # BUG: subjects2 contains both 'Math' and 'Science'!
    print(f"Subjects1: {subjects1}")  # ['Math']
    print(f"Subjects2: {subjects2}")  # ['Math', 'Science'] - WRONG!
    
    # Using safe version
    safe_subjects1 = add_assignment_to_student_safe(student1, assignment1)
    safe_subjects2 = add_assignment_to_student_safe(student2, assignment2)
    
    print(f"Safe Subjects1: {safe_subjects1}")  # ['Math']
    print(f"Safe Subjects2: {safe_subjects2}")  # ['Science'] - CORRECT!
```

## Performance Testing

### 1. Timing Code Execution

```python
import time
import timeit

def performance_test_grade_calculation():
    """Test performance of different grade calculation approaches"""
    
    # Generate test data
    large_student_list = []
    for i in range(1000):
        student = Student(f"S{i:04d}", f"Student {i}", 11)
        for j in range(50):  # 50 assignments each
            student.add_assignment(f"Assignment {j}", "2024-03-15", 100)
            student.submit_assignment(f"Assignment {j}", 70 + (i + j) % 30)
        large_student_list.append(student)
    
    # Method 1: Simple loop
    def calculate_class_average_simple():
        total = 0
        count = 0
        for student in large_student_list:
            total += student.get_current_average()
            count += 1
        return total / count if count > 0 else 0
    
    # Method 2: Using list comprehension
    def calculate_class_average_comprehension():
        averages = [student.get_current_average() for student in large_student_list]
        return sum(averages) / len(averages) if averages else 0
    
    # Time both methods
    time1 = timeit.timeit(calculate_class_average_simple, number=100)
    time2 = timeit.timeit(calculate_class_average_comprehension, number=100)
    
    print(f"Simple loop: {time1:.4f} seconds")
    print(f"List comprehension: {time2:.4f} seconds")
    print(f"Speedup: {time1/time2:.2f}x")

performance_test_grade_calculation()
```

### 2. Memory Usage Testing

```python
import tracemalloc

def memory_test_data_structures():
    """Test memory usage of different data structures"""
    
    # Start memory monitoring
    tracemalloc.start()
    
    # Test 1: List of dictionaries (current approach)
    snapshot1 = tracemalloc.take_snapshot()
    
    assignments_list = []
    for i in range(10000):
        assignments_list.append({
            "id": i,
            "title": f"Assignment {i}",
            "points": 100,
            "completed": False
        })
    
    snapshot2 = tracemalloc.take_snapshot()
    
    # Test 2: Custom class
    class Assignment:
        def __init__(self, id, title, points):
            self.id = id
            self.title = title
            self.points = points
            self.completed = False
    
    assignments_objects = []
    for i in range(10000):
        assignments_objects.append(Assignment(i, f"Assignment {i}", 100))
    
    snapshot3 = tracemalloc.take_snapshot()
    
    # Compare memory usage
    dict_memory = snapshot2.compare_to(snapshot1, 'lineno')[0].size_diff
    object_memory = snapshot3.compare_to(snapshot2, 'lineno')[0].size_diff
    
    print(f"Dictionary approach: {dict_memory / 1024:.1f} KB")
    print(f"Object approach: {object_memory / 1024:.1f} KB")
    print(f"Memory difference: {(object_memory - dict_memory) / 1024:.1f} KB")
    
    tracemalloc.stop()

memory_test_data_structures()
```

## Key Debugging Tools

### 1. IDE Debuggers
- **VS Code**: Built-in Python debugger with breakpoints, variable inspection
- **PyCharm**: Advanced debugging features, conditional breakpoints
- **Thonny**: Simple debugger perfect for beginners

### 2. Command Line Tools
```bash
# Python debugger
python -m pdb script.py

# Profile code performance
python -m cProfile script.py

# Check code style
python -m flake8 script.py

# Run tests
python -m pytest tests/
```

### 3. Online Tools
- **Python Tutor**: Visualize code execution step by step
- **Replit**: Built-in debugger and collaboration features
- **CodePen**: Debug web-based code interactively

## Best Practices Summary

### Testing Best Practices
✅ **Write tests first** (Test-Driven Development)
✅ **Test edge cases** - empty inputs, boundary values, invalid data
✅ **Use descriptive test names** - `test_grade_calculation_with_empty_list()`
✅ **Test one thing at a time** - focused, specific tests
✅ **Mock external dependencies** - don't test third-party APIs
✅ **Maintain test data** - use setup/teardown methods

### Debugging Best Practices
✅ **Reproduce the bug consistently** - understand when/how it happens
✅ **Start with simple debugging** - print statements before complex tools
✅ **Use version control** - commit working code before debugging
✅ **Document bugs and fixes** - help future developers
✅ **Learn from mistakes** - update practices to prevent similar bugs
✅ **Don't debug tired** - fresh eyes catch more bugs

## Practice Exercises

### Exercise 1: Bug Hunt
Given buggy StudyBuddy code, find and fix:
- Grade calculation errors
- Assignment due date logic bugs
- Student data persistence issues
- Performance bottlenecks

### Exercise 2: Test Suite Development
Create comprehensive test suite for:
- Student management system
- Grade calculation functions
- Assignment tracking features
- Data import/export functionality

### Exercise 3: Debugging Challenge
Debug a complex StudyBuddy feature with multiple interacting bugs:
- Integration between components
- Race conditions in concurrent code
- Memory leaks in long-running processes
- Edge cases in data processing

## Key Takeaways

✅ **Testing saves time** - Find bugs early when they're cheap to fix
✅ **Debug systematically** - Reproduce, isolate, fix, verify
✅ **Use appropriate tools** - Right tool for the right job
✅ **Learn from bugs** - Each bug teaches you something valuable
✅ **Test edge cases** - Most bugs live at the boundaries
✅ **Document your process** - Help your future self and teammates

/// details | Professional Testing Reality 💼
    type: tip

**In the software industry:**
- **Testing is not optional** - Companies spend 25-40% of development time on testing
- **Bugs in production are expensive** - 10-100x more costly than bugs caught during development
- **Automated testing is standard** - Manual testing doesn't scale
- **Code reviews prevent bugs** - Two pairs of eyes are better than one
- **Monitoring catches runtime issues** - Production bugs still happen

Master testing and debugging now for career success!

///

## Next Steps

Now that you can test and debug code effectively, learn how to write maintainable, professional-quality code with [Code Quality](code-quality.md) practices.

---

*Remember: Bugs are not failures - they're learning opportunities. The best developers are not those who never write bugs, but those who can find and fix them quickly.*
