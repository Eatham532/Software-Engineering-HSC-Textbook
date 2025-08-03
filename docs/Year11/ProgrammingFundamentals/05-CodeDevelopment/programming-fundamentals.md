# Programming Fundamentals

## Introduction

Programming is the art of giving precise instructions to computers. Every app, website, and digital tool starts with these fundamental building blocks. Let's explore the core concepts that power all software development.

/// details | Why These Fundamentals Matter 🏗️
    type: important

**Every programming language uses these concepts:**
- **Variables** store data (your name, game score, bank balance)
- **Functions** organize code into reusable blocks
- **Control structures** make decisions and repeat actions
- **Data structures** organize information efficiently
- **Objects** model real-world entities in code

Master these, and you can learn any programming language!

///

## Variables and Data Types

Variables are containers that store data values. Think of them as labeled boxes where you keep information.

### StudyBuddy Example: Student Information

```python
# Basic variable assignments
student_name = "Alex Chen"
current_grade = 85
is_enrolled = True
study_hours_this_week = 12.5

# Python automatically determines the data type
print(f"Student: {student_name}")
print(f"Grade: {current_grade}%")
print(f"Enrolled: {is_enrolled}")
print(f"Study hours: {study_hours_this_week}")
```

### Variable Naming Best Practices

#### ✅ Good Variable Names
```python
# Clear and descriptive
assignment_title = "Math Quiz Chapter 5"
due_date = "2024-03-15"
total_points_possible = 100
student_submission_count = 23

# Use meaningful abbreviations when appropriate
max_attempts = 3
min_grade_to_pass = 70
```

#### ❌ Poor Variable Names
```python
# Vague and confusing
x = "Math Quiz Chapter 5"  # What is x?
d = "2024-03-15"          # Date? Duration? Distance?
num = 100                 # Number of what?
count = 23                # Count of what?
```

### Data Type Categories

#### Primitive Types
```python
# Numbers
age = 17                    # Integer
gpa = 3.85                 # Float (decimal)
pi = 3.14159               # Float

# Text
first_name = "Sarah"       # String
last_initial = "M"         # String (even single characters)

# Boolean (True/False)
has_completed_homework = True
is_absent = False

# Special value
assignment_grade = None    # No grade assigned yet
```

#### Composite Types
```python
# Lists - ordered collections
student_grades = [85, 92, 78, 96, 88]
subjects = ["Math", "Science", "English", "History"]
mixed_data = ["Alex", 17, True, 3.85]  # Can mix types

# Dictionaries - key-value pairs
student_info = {
    "name": "Alex Chen",
    "age": 17,
    "grade": 85,
    "subjects": ["Math", "Science", "English"]
}

# Tuples - immutable ordered collections
coordinates = (40.7128, -74.0060)  # NYC latitude, longitude
rgb_color = (255, 128, 0)          # Orange color values
```

## Functions

Functions are reusable blocks of code that perform specific tasks. They're like recipes - you define them once, then use them whenever needed.

### Basic Function Structure

```python
def function_name(parameters):
    """
    Function documentation (docstring)
    Explains what the function does
    """
    # Function body
    return result  # Optional
```

### StudyBuddy Example: Grade Calculator

```python
def calculate_letter_grade(percentage):
    """
    Convert numerical grade to letter grade
    
    Args:
        percentage (float): Grade as percentage (0-100)
    
    Returns:
        str: Letter grade (A, B, C, D, F)
    """
    if percentage >= 90:
        return "A"
    elif percentage >= 80:
        return "B"
    elif percentage >= 70:
        return "C"
    elif percentage >= 60:
        return "D"
    else:
        return "F"

# Using the function
student_score = 87
letter_grade = calculate_letter_grade(student_score)
print(f"Score: {student_score}% = Grade: {letter_grade}")
```

### Functions with Multiple Parameters

```python
def calculate_weighted_grade(homework_grade, test_grade, project_grade):
    """
    Calculate final grade using weighted averages
    Homework: 30%, Tests: 50%, Projects: 20%
    """
    homework_weight = 0.30
    test_weight = 0.50
    project_weight = 0.20
    
    final_grade = (homework_grade * homework_weight + 
                   test_grade * test_weight + 
                   project_grade * project_weight)
    
    return round(final_grade, 1)

# Example usage
final_score = calculate_weighted_grade(85, 92, 78)
print(f"Final grade: {final_score}%")
```

### Functions Returning Multiple Values

```python
def analyze_grades(grades):
    """
    Analyze a list of grades and return statistics
    
    Returns:
        tuple: (average, highest, lowest, count)
    """
    if not grades:
        return 0, 0, 0, 0
    
    average = sum(grades) / len(grades)
    highest = max(grades)
    lowest = min(grades)
    count = len(grades)
    
    return average, highest, lowest, count

# Unpack multiple return values
student_grades = [85, 92, 78, 96, 88, 79, 84]
avg, high, low, total = analyze_grades(student_grades)

print(f"Average: {avg:.1f}")
print(f"Highest: {high}")
print(f"Lowest: {low}")
print(f"Total assignments: {total}")
```

## Control Structures

Control structures determine the flow of program execution - making decisions and repeating actions.

### Conditional Statements (if/elif/else)

```python
def get_study_recommendation(current_grade, target_grade):
    """
    Recommend study intensity based on grade gap
    """
    grade_gap = target_grade - current_grade
    
    if grade_gap <= 0:
        return "Great job! You've reached your target."
    elif grade_gap <= 5:
        return "You're close! 30 minutes daily should do it."
    elif grade_gap <= 10:
        return "Moderate effort needed. Study 1 hour daily."
    elif grade_gap <= 20:
        return "Significant improvement needed. 2 hours daily."
    else:
        return "Major effort required. Consider getting a tutor."

# Example usage
recommendation = get_study_recommendation(75, 85)
print(recommendation)
```

### StudyBuddy Example: Assignment Status Checker

```python
from datetime import datetime, timedelta

def check_assignment_status(due_date, is_submitted):
    """
    Check if assignment is overdue, due soon, or okay
    """
    today = datetime.now()
    days_until_due = (due_date - today).days
    
    if is_submitted:
        return "✅ Submitted - Great job!"
    elif days_until_due < 0:
        return f"❌ Overdue by {abs(days_until_due)} days"
    elif days_until_due == 0:
        return "⚠️ Due today - Submit now!"
    elif days_until_due == 1:
        return "⏰ Due tomorrow - Don't wait!"
    elif days_until_due <= 3:
        return f"📅 Due in {days_until_due} days - Start working!"
    else:
        return f"✨ Due in {days_until_due} days - Plan ahead!"

# Example usage
assignment_due = datetime.now() + timedelta(days=2)
status = check_assignment_status(assignment_due, False)
print(status)
```

### Loops

Loops repeat code multiple times, essential for processing collections of data.

#### For Loops - When You Know How Many Times

```python
def calculate_semester_gpa(courses):
    """
    Calculate GPA for multiple courses
    """
    total_points = 0
    total_credits = 0
    
    for course in courses:
        course_name = course["name"]
        grade = course["grade"]
        credits = course["credits"]
        
        # Convert letter grade to points
        grade_points = {
            "A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0.0
        }
        
        points = grade_points.get(grade, 0.0)
        total_points += points * credits
        total_credits += credits
        
        print(f"{course_name}: {grade} ({points} points)")
    
    if total_credits == 0:
        return 0.0
    
    gpa = total_points / total_credits
    return round(gpa, 2)

# Example usage
semester_courses = [
    {"name": "Mathematics", "grade": "A", "credits": 4},
    {"name": "Science", "grade": "B", "credits": 3},
    {"name": "English", "grade": "A", "credits": 3},
    {"name": "History", "grade": "C", "credits": 2}
]

semester_gpa = calculate_semester_gpa(semester_courses)
print(f"\nSemester GPA: {semester_gpa}")
```

#### While Loops - When You Don't Know How Many Times

```python
def study_session_timer(target_minutes):
    """
    Simple study timer that counts down
    """
    minutes_left = target_minutes
    
    print(f"Starting {target_minutes}-minute study session!")
    
    while minutes_left > 0:
        if minutes_left % 5 == 0:  # Progress update every 5 minutes
            print(f"📚 {minutes_left} minutes remaining...")
        
        # Simulate 1 minute passing (in real app, use time.sleep(60))
        minutes_left -= 1
        
        # Break reminder every 25 minutes (Pomodoro technique)
        if minutes_left > 0 and (target_minutes - minutes_left) % 25 == 0:
            print("☕ Time for a 5-minute break!")
    
    print("🎉 Study session complete! Great work!")

# Example usage
study_session_timer(30)
```

#### Break and Continue

```python
def find_first_failing_grade(grades, passing_grade=70):
    """
    Find the first grade below passing threshold
    """
    for i, grade in enumerate(grades):
        if grade < 0 or grade > 100:
            print(f"⚠️ Invalid grade at position {i}: {grade}")
            continue  # Skip this grade, check the next one
        
        if grade < passing_grade:
            print(f"❌ First failing grade: {grade} at position {i}")
            break  # Stop searching once we find the first failure
        
        print(f"✅ Grade {i+1}: {grade}")
    else:
        print("🎉 All grades are passing!")

# Example usage
student_grades = [85, 92, 78, 65, 88, 79]
find_first_failing_grade(student_grades)
```

## Data Structures

Data structures organize and store data efficiently. Choose the right structure for your specific needs.

### Lists - Ordered, Changeable Collections

```python
# StudyBuddy: Managing assignment list
assignments = []

def add_assignment(title, due_date, points):
    """Add new assignment to the list"""
    assignment = {
        "title": title,
        "due_date": due_date,
        "points": points,
        "completed": False
    }
    assignments.append(assignment)
    print(f"➕ Added: {title}")

def complete_assignment(title):
    """Mark assignment as completed"""
    for assignment in assignments:
        if assignment["title"] == title:
            assignment["completed"] = True
            print(f"✅ Completed: {title}")
            return
    print(f"❌ Assignment not found: {title}")

def get_incomplete_assignments():
    """Get list of incomplete assignments"""
    incomplete = []
    for assignment in assignments:
        if not assignment["completed"]:
            incomplete.append(assignment)
    return incomplete

# Example usage
add_assignment("Math Quiz", "2024-03-15", 100)
add_assignment("Science Lab", "2024-03-18", 75)
complete_assignment("Math Quiz")

print("\nIncomplete assignments:")
for assignment in get_incomplete_assignments():
    print(f"- {assignment['title']} (Due: {assignment['due_date']})")
```

### Dictionaries - Key-Value Pairs

```python
# StudyBuddy: Student profiles
students = {}

def create_student_profile(student_id, name, grade_level):
    """Create new student profile"""
    students[student_id] = {
        "name": name,
        "grade_level": grade_level,
        "assignments": [],
        "total_points": 0,
        "completed_assignments": 0
    }
    print(f"👤 Created profile for {name}")

def add_grade_to_student(student_id, assignment_title, points_earned, points_possible):
    """Add grade to student's record"""
    if student_id not in students:
        print(f"❌ Student {student_id} not found")
        return
    
    student = students[student_id]
    grade_record = {
        "assignment": assignment_title,
        "earned": points_earned,
        "possible": points_possible,
        "percentage": (points_earned / points_possible) * 100
    }
    
    student["assignments"].append(grade_record)
    student["total_points"] += points_earned
    student["completed_assignments"] += 1
    
    print(f"📝 Added grade for {student['name']}: {points_earned}/{points_possible}")

def get_student_average(student_id):
    """Calculate student's current average"""
    if student_id not in students:
        return None
    
    student = students[student_id]
    if not student["assignments"]:
        return 0
    
    total_earned = sum(grade["earned"] for grade in student["assignments"])
    total_possible = sum(grade["possible"] for grade in student["assignments"])
    
    return (total_earned / total_possible) * 100 if total_possible > 0 else 0

# Example usage
create_student_profile("S001", "Alex Chen", 11)
create_student_profile("S002", "Sarah Johnson", 11)

add_grade_to_student("S001", "Math Quiz", 85, 100)
add_grade_to_student("S001", "Science Lab", 92, 100)

average = get_student_average("S001")
print(f"Alex's current average: {average:.1f}%")
```

### Sets - Unique Collections

```python
# StudyBuddy: Managing student subjects
def find_common_subjects(student1_subjects, student2_subjects):
    """Find subjects both students are taking"""
    set1 = set(student1_subjects)
    set2 = set(student2_subjects)
    
    common = set1 & set2  # Intersection
    unique_to_1 = set1 - set2  # Difference
    unique_to_2 = set2 - set1  # Difference
    all_subjects = set1 | set2  # Union
    
    return {
        "common": list(common),
        "unique_to_student1": list(unique_to_1),
        "unique_to_student2": list(unique_to_2),
        "all_subjects": list(all_subjects)
    }

# Example usage
alex_subjects = ["Math", "Science", "English", "History", "Art"]
sarah_subjects = ["Math", "Science", "Music", "PE", "Spanish"]

comparison = find_common_subjects(alex_subjects, sarah_subjects)

print("Subject comparison:")
print(f"Common subjects: {comparison['common']}")
print(f"Alex only: {comparison['unique_to_student1']}")
print(f"Sarah only: {comparison['unique_to_student2']}")
```

## Object-Oriented Programming

Objects combine data (attributes) and functionality (methods) into logical units. Think of objects as real-world entities with properties and behaviors.

### StudyBuddy Example: Student Class

```python
class Student:
    """Represents a student in the StudyBuddy system"""
    
    def __init__(self, student_id, name, grade_level):
        """Initialize a new student"""
        self.student_id = student_id
        self.name = name
        self.grade_level = grade_level
        self.assignments = []
        self.study_sessions = []
    
    def add_assignment(self, title, due_date, points_possible):
        """Add a new assignment"""
        assignment = {
            "title": title,
            "due_date": due_date,
            "points_possible": points_possible,
            "points_earned": None,
            "completed": False
        }
        self.assignments.append(assignment)
        print(f"📚 Added assignment '{title}' for {self.name}")
    
    def submit_assignment(self, title, points_earned):
        """Submit and grade an assignment"""
        for assignment in self.assignments:
            if assignment["title"] == title:
                assignment["points_earned"] = points_earned
                assignment["completed"] = True
                percentage = (points_earned / assignment["points_possible"]) * 100
                print(f"✅ {self.name} submitted '{title}': {percentage:.1f}%")
                return
        print(f"❌ Assignment '{title}' not found for {self.name}")
    
    def get_current_average(self):
        """Calculate current grade average"""
        completed = [a for a in self.assignments if a["completed"]]
        if not completed:
            return 0
        
        total_earned = sum(a["points_earned"] for a in completed)
        total_possible = sum(a["points_possible"] for a in completed)
        
        return (total_earned / total_possible) * 100 if total_possible > 0 else 0
    
    def get_incomplete_assignments(self):
        """Get list of incomplete assignments"""
        return [a for a in self.assignments if not a["completed"]]
    
    def start_study_session(self, subject, duration_minutes):
        """Record a study session"""
        from datetime import datetime
        session = {
            "subject": subject,
            "duration": duration_minutes,
            "date": datetime.now(),
            "completed": False
        }
        self.study_sessions.append(session)
        print(f"📖 {self.name} started studying {subject} for {duration_minutes} minutes")
    
    def __str__(self):
        """String representation of student"""
        avg = self.get_current_average()
        incomplete = len(self.get_incomplete_assignments())
        return f"Student: {self.name} (Grade {self.grade_level}) - Average: {avg:.1f}%, {incomplete} pending assignments"

# Example usage
alex = Student("S001", "Alex Chen", 11)
alex.add_assignment("Math Quiz", "2024-03-15", 100)
alex.add_assignment("Science Lab", "2024-03-18", 75)

alex.submit_assignment("Math Quiz", 87)
alex.start_study_session("Science", 45)

print(alex)
print(f"Incomplete assignments: {len(alex.get_incomplete_assignments())}")
```

### Inheritance - Extending Classes

```python
class AdvancedStudent(Student):
    """Student with additional advanced features"""
    
    def __init__(self, student_id, name, grade_level, target_gpa=3.5):
        super().__init__(student_id, name, grade_level)  # Call parent constructor
        self.target_gpa = target_gpa
        self.study_goals = []
    
    def set_study_goal(self, subject, hours_per_week):
        """Set a weekly study goal for a subject"""
        goal = {
            "subject": subject,
            "hours_per_week": hours_per_week,
            "current_week_hours": 0
        }
        self.study_goals.append(goal)
        print(f"🎯 {self.name} set goal: {hours_per_week} hours/week for {subject}")
    
    def is_on_track_for_target(self):
        """Check if current performance meets target GPA"""
        current_avg = self.get_current_average()
        # Rough conversion: 90+ = 4.0, 80-89 = 3.0, etc.
        current_gpa = current_avg / 25 if current_avg > 0 else 0
        return current_gpa >= self.target_gpa
    
    def get_study_recommendation(self):
        """Get personalized study recommendation"""
        if self.is_on_track_for_target():
            return f"Great job {self.name}! You're on track for your {self.target_gpa} GPA goal."
        else:
            incomplete = len(self.get_incomplete_assignments())
            return f"Focus up {self.name}! You have {incomplete} pending assignments. Need more study time to reach {self.target_gpa} GPA."

# Example usage
sarah = AdvancedStudent("S002", "Sarah Johnson", 11, target_gpa=3.8)
sarah.add_assignment("Chemistry Test", "2024-03-20", 100)
sarah.set_study_goal("Chemistry", 5)
sarah.submit_assignment("Chemistry Test", 94)

print(sarah.get_study_recommendation())
```

## Error Handling

Robust programs handle unexpected situations gracefully instead of crashing.

### Try-Except Blocks

```python
def safe_calculate_average(grades):
    """Calculate average with error handling"""
    try:
        # Attempt the calculation
        if not grades:
            raise ValueError("No grades provided")
        
        # Check for valid grades
        for grade in grades:
            if not isinstance(grade, (int, float)):
                raise TypeError(f"Invalid grade type: {type(grade)}")
            if grade < 0 or grade > 100:
                raise ValueError(f"Grade out of range: {grade}")
        
        average = sum(grades) / len(grades)
        return round(average, 2)
    
    except ValueError as e:
        print(f"❌ Value Error: {e}")
        return None
    except TypeError as e:
        print(f"❌ Type Error: {e}")
        return None
    except ZeroDivisionError:
        print("❌ Cannot divide by zero")
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None

# Test error handling
print(safe_calculate_average([85, 92, 78]))      # Valid input
print(safe_calculate_average([]))                # Empty list
print(safe_calculate_average([85, "92", 78]))    # Invalid type
print(safe_calculate_average([85, 150, 78]))     # Out of range
```

### Input Validation

```python
def get_valid_grade():
    """Get valid grade input from user with error handling"""
    while True:
        try:
            grade_input = input("Enter grade (0-100): ")
            grade = float(grade_input)
            
            if grade < 0 or grade > 100:
                print("❌ Grade must be between 0 and 100")
                continue
            
            return grade
        
        except ValueError:
            print("❌ Please enter a valid number")
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            return None

# Example usage (in interactive environment)
# student_grade = get_valid_grade()
# print(f"Valid grade entered: {student_grade}")
```

## File Handling

Programs often need to read from and write to files for data persistence.

### StudyBuddy Example: Saving Student Data

```python
import json
from datetime import datetime

def save_student_data(student, filename):
    """Save student data to JSON file"""
    try:
        # Convert student object to dictionary
        student_data = {
            "student_id": student.student_id,
            "name": student.name,
            "grade_level": student.grade_level,
            "assignments": student.assignments,
            "study_sessions": student.study_sessions,
            "last_updated": datetime.now().isoformat()
        }
        
        with open(filename, 'w') as file:
            json.dump(student_data, file, indent=2)
        
        print(f"💾 Saved {student.name}'s data to {filename}")
        return True
    
    except Exception as e:
        print(f"❌ Error saving data: {e}")
        return False

def load_student_data(filename):
    """Load student data from JSON file"""
    try:
        with open(filename, 'r') as file:
            student_data = json.load(file)
        
        # Recreate student object
        student = Student(
            student_data["student_id"],
            student_data["name"],
            student_data["grade_level"]
        )
        student.assignments = student_data["assignments"]
        student.study_sessions = student_data["study_sessions"]
        
        print(f"📂 Loaded {student.name}'s data from {filename}")
        return student
    
    except FileNotFoundError:
        print(f"❌ File not found: {filename}")
        return None
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in file: {filename}")
        return None
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return None

# Example usage
alex = Student("S001", "Alex Chen", 11)
alex.add_assignment("Math Quiz", "2024-03-15", 100)
alex.submit_assignment("Math Quiz", 87)

# Save and load
save_student_data(alex, "alex_data.json")
loaded_alex = load_student_data("alex_data.json")
if loaded_alex:
    print(loaded_alex)
```

## Best Practices Summary

### 1. Write Clear, Self-Documenting Code
```python
# Good: Clear intent
def calculate_final_grade(homework_avg, test_avg, project_avg):
    return homework_avg * 0.3 + test_avg * 0.5 + project_avg * 0.2

# Better: With documentation
def calculate_final_grade(homework_avg, test_avg, project_avg):
    """
    Calculate weighted final grade.
    Weights: Homework 30%, Tests 50%, Projects 20%
    """
    HOMEWORK_WEIGHT = 0.3
    TEST_WEIGHT = 0.5
    PROJECT_WEIGHT = 0.2
    
    return (homework_avg * HOMEWORK_WEIGHT + 
            test_avg * TEST_WEIGHT + 
            project_avg * PROJECT_WEIGHT)
```

### 2. Handle Edge Cases
```python
def get_top_students(students, count=5):
    """Get top performing students"""
    if not students:
        return []
    
    if count <= 0:
        return []
    
    if count > len(students):
        count = len(students)
    
    sorted_students = sorted(students, key=lambda s: s.get_current_average(), reverse=True)
    return sorted_students[:count]
```

### 3. Use Meaningful Constants
```python
# Good: Named constants
PASSING_GRADE = 70
MAX_ATTEMPTS = 3
ASSIGNMENT_TYPES = ["homework", "test", "project", "quiz"]

def is_passing_grade(grade):
    return grade >= PASSING_GRADE
```

### 4. Keep Functions Focused
```python
# Good: Single responsibility
def calculate_average(grades):
    """Calculate average of grades"""
    return sum(grades) / len(grades) if grades else 0

def format_grade_display(average):
    """Format grade for display"""
    return f"{average:.1f}%"

def get_letter_grade(average):
    """Convert percentage to letter grade"""
    if average >= 90: return "A"
    elif average >= 80: return "B"
    elif average >= 70: return "C"
    elif average >= 60: return "D"
    else: return "F"
```

## Practice Exercises

### Exercise 1: Grade Book System
Create a complete grade book system with:
- Student class with name, ID, and grades
- Methods to add grades, calculate average, determine letter grade
- File save/load functionality
- Error handling for invalid inputs

### Exercise 2: Study Session Tracker
Build a study session tracking system:
- Track session duration, subject, and date
- Calculate total study time per subject
- Generate weekly/monthly reports
- Set and track study goals

### Exercise 3: Assignment Priority Manager
Create a system that:
- Stores assignments with due dates and importance
- Calculates priority scores based on urgency and importance
- Suggests daily work schedules
- Tracks completion progress

## Key Takeaways

✅ **Master the fundamentals** - Variables, functions, control structures are universal
✅ **Choose appropriate data structures** - Lists, dictionaries, sets serve different purposes
✅ **Handle errors gracefully** - Robust programs don't crash on unexpected input
✅ **Write readable code** - Code is read more often than written
✅ **Test edge cases** - Empty inputs, boundary values, invalid data
✅ **Keep learning** - Programming languages evolve, but fundamentals remain constant

## Next Steps

Now that you understand programming fundamentals, learn how to make your code bulletproof with [Testing & Debugging](testing-debugging.md) techniques.

---

*Remember: Programming is problem-solving with code. Focus on understanding the problem first, then choose the right tools to solve it elegantly.*
