# Data Structures

## Introduction

Data structures are specialized ways of organizing and storing data so that it can be accessed and modified efficiently. Think of them as different types of containers - each designed for specific purposes, just like how you might use a filing cabinet for documents, a toolbox for tools, or a spice rack for seasonings.

/// details | Why Data Structures Matter 🏗️
    type: important

**The right data structure makes all the difference:**
- **Instagram**: Uses hash tables for instant username lookups from 2+ billion users
- **Google Maps**: Uses graphs to find the shortest route between any two points
- **Netflix**: Uses arrays and trees to manage millions of movies and user preferences
- **StudyBuddy**: Uses various structures to organize assignments, students, and grades efficiently

Choose the wrong structure = slow, inefficient software. Choose the right one = lightning-fast performance!

///

## Understanding Data Structures

### What Makes a Good Data Structure?

1. **Access Speed**: How quickly can you find specific data?
2. **Modification Speed**: How fast can you add, update, or delete data?
3. **Memory Efficiency**: How much storage space does it use?
4. **Organization**: Does it keep data in a useful order?

### StudyBuddy's Data Structure Needs

Let's explore how StudyBuddy uses different data structures:

```python
# Different ways to store student information
# Each has different strengths and weaknesses

# Option 1: Simple list (linear search required)
students_list = [
    "Alex Chen",
    "Sarah Johnson", 
    "Mike Rodriguez",
    "Emma Thompson"
]

# Option 2: Dictionary (instant lookup by ID)
students_dict = {
    "S001": "Alex Chen",
    "S002": "Sarah Johnson",
    "S003": "Mike Rodriguez", 
    "S004": "Emma Thompson"
}

# Option 3: Custom objects in a list
class Student:
    def __init__(self, id, name, grade_level):
        self.id = id
        self.name = name
        self.grade_level = grade_level

students_objects = [
    Student("S001", "Alex Chen", 11),
    Student("S002", "Sarah Johnson", 11),
    Student("S003", "Mike Rodriguez", 12),
    Student("S004", "Emma Thompson", 12)
]
```

## Arrays and Lists

Arrays and lists store elements in a specific order, like books on a shelf.

### Python Lists - Dynamic Arrays

```python
# StudyBuddy: Managing assignment due dates
assignment_due_dates = []

def add_assignment_due_date(assignment_title, due_date):
    """Add assignment to due date list"""
    assignment_info = {
        "title": assignment_title,
        "due_date": due_date,
        "completed": False
    }
    assignment_due_dates.append(assignment_info)
    print(f"📅 Added: {assignment_title} due {due_date}")

def get_assignments_due_this_week():
    """Get assignments due in the next 7 days"""
    from datetime import datetime, timedelta
    
    today = datetime.now()
    next_week = today + timedelta(days=7)
    
    due_this_week = []
    for assignment in assignment_due_dates:
        if not assignment["completed"]:
            # Convert string date to datetime for comparison
            due_date = datetime.strptime(assignment["due_date"], "%Y-%m-%d")
            if today <= due_date <= next_week:
                due_this_week.append(assignment)
    
    return due_this_week

def mark_assignment_complete(assignment_title):
    """Mark an assignment as completed"""
    for assignment in assignment_due_dates:
        if assignment["title"] == assignment_title:
            assignment["completed"] = True
            print(f"✅ Completed: {assignment_title}")
            return True
    
    print(f"❌ Assignment not found: {assignment_title}")
    return False

# Example usage
add_assignment_due_date("Math Quiz Chapter 5", "2024-03-15")
add_assignment_due_date("Science Lab Report", "2024-03-18")
add_assignment_due_date("English Essay", "2024-03-22")

due_soon = get_assignments_due_this_week()
print(f"\nAssignments due this week: {len(due_soon)}")
for assignment in due_soon:
    print(f"- {assignment['title']} (Due: {assignment['due_date']})")
```

### Array Operations and Performance

```python
def demonstrate_list_operations():
    """Show different list operations and their use cases"""
    
    # StudyBuddy: Grade tracking
    student_grades = [85, 92, 78, 96, 88]
    
    # Access by index - O(1) time complexity
    first_grade = student_grades[0]  # 85
    last_grade = student_grades[-1]  # 88
    print(f"First grade: {first_grade}, Last grade: {last_grade}")
    
    # Append - O(1) amortized time complexity
    student_grades.append(91)
    print(f"After adding grade: {student_grades}")
    
    # Insert at specific position - O(n) time complexity
    student_grades.insert(2, 89)  # Insert 89 at index 2
    print(f"After inserting grade: {student_grades}")
    
    # Remove by value - O(n) time complexity
    student_grades.remove(78)  # Remove first occurrence of 78
    print(f"After removing 78: {student_grades}")
    
    # Pop (remove and return) - O(1) for last element, O(n) for others
    removed_grade = student_grades.pop()  # Remove last element
    print(f"Removed grade: {removed_grade}, Remaining: {student_grades}")
    
    # Search for value - O(n) time complexity
    if 92 in student_grades:
        index = student_grades.index(92)
        print(f"Grade 92 found at index: {index}")
    
    # Slice operations - O(k) where k is slice size
    top_three_grades = sorted(student_grades, reverse=True)[:3]
    print(f"Top 3 grades: {top_three_grades}")

demonstrate_list_operations()
```

### Multi-Dimensional Arrays

```python
# StudyBuddy: Grade book with multiple subjects
def create_grade_book():
    """Create a 2D grade book structure"""
    
    # Students (rows) × Subjects (columns)
    students = ["Alex", "Sarah", "Mike", "Emma"]
    subjects = ["Math", "Science", "English", "History"]
    
    # Initialize 2D list with zeros
    grade_book = []
    for student in range(len(students)):
        student_grades = []
        for subject in range(len(subjects)):
            student_grades.append(0)  # Start with 0 (no grade entered)
        grade_book.append(student_grades)
    
    return grade_book, students, subjects

def add_grade(grade_book, students, subjects, student_name, subject_name, grade):
    """Add a grade to the grade book"""
    try:
        student_index = students.index(student_name)
        subject_index = subjects.index(subject_name)
        grade_book[student_index][subject_index] = grade
        print(f"✅ Added grade {grade} for {student_name} in {subject_name}")
    except ValueError as e:
        print(f"❌ Error: Student or subject not found - {e}")

def get_student_average(grade_book, students, subject, student_name):
    """Calculate a student's average across all subjects"""
    try:
        student_index = students.index(student_name)
        student_grades = grade_book[student_index]
        
        # Only include non-zero grades (grades that have been entered)
        valid_grades = [grade for grade in student_grades if grade > 0]
        
        if not valid_grades:
            return 0
        
        return sum(valid_grades) / len(valid_grades)
    
    except ValueError:
        print(f"❌ Student {student_name} not found")
        return 0

def get_subject_average(grade_book, students, subjects, subject_name):
    """Calculate class average for a specific subject"""
    try:
        subject_index = subjects.index(subject_name)
        
        # Get all grades for this subject
        subject_grades = []
        for student_row in grade_book:
            grade = student_row[subject_index]
            if grade > 0:  # Only include entered grades
                subject_grades.append(grade)
        
        if not subject_grades:
            return 0
        
        return sum(subject_grades) / len(subject_grades)
    
    except ValueError:
        print(f"❌ Subject {subject_name} not found")
        return 0

def print_grade_book(grade_book, students, subjects):
    """Display the grade book in a readable format"""
    
    # Print header
    print("\n📊 GRADE BOOK")
    print("=" * 50)
    print(f"{'Student':<12}", end="")
    for subject in subjects:
        print(f"{subject:<10}", end="")
    print(f"{'Average':<10}")
    print("-" * 50)
    
    # Print each student's grades
    for i, student in enumerate(students):
        print(f"{student:<12}", end="")
        student_total = 0
        student_count = 0
        
        for j, subject in enumerate(subjects):
            grade = grade_book[i][j]
            if grade > 0:
                print(f"{grade:<10}", end="")
                student_total += grade
                student_count += 1
            else:
                print(f"{'--':<10}", end="")
        
        # Calculate and display average
        avg = student_total / student_count if student_count > 0 else 0
        print(f"{avg:<10.1f}")
    
    print("-" * 50)
    
    # Print subject averages
    print(f"{'Class Avg':<12}", end="")
    for subject in subjects:
        avg = get_subject_average(grade_book, students, subjects, subject)
        print(f"{avg:<10.1f}", end="")
    print()

# Example usage
grade_book, students, subjects = create_grade_book()

# Add some sample grades
grades_to_add = [
    ("Alex", "Math", 85),
    ("Alex", "Science", 92),
    ("Alex", "English", 78),
    ("Sarah", "Math", 90),
    ("Sarah", "Science", 88),
    ("Sarah", "History", 94),
    ("Mike", "Math", 76),
    ("Mike", "English", 82),
    ("Emma", "Science", 95),
    ("Emma", "History", 89)
]

for student, subject, grade in grades_to_add:
    add_grade(grade_book, students, subjects, student, subject, grade)

print_grade_book(grade_book, students, subjects)
```

## Dictionaries and Hash Tables

Dictionaries provide instant lookup by key, like using a student ID to find their information immediately.

### StudyBuddy User Management

```python
class StudentDatabase:
    """Efficient student data management using dictionaries"""
    
    def __init__(self):
        # Main student data: ID -> student info
        self.students = {}
        
        # Secondary indexes for fast lookups
        self.students_by_name = {}      # Name -> student ID
        self.students_by_grade = {}     # Grade level -> list of student IDs
        self.students_by_email = {}     # Email -> student ID
    
    def add_student(self, student_id, name, grade_level, email):
        """Add a new student with multiple indexes"""
        
        # Check if student already exists
        if student_id in self.students:
            print(f"❌ Student {student_id} already exists")
            return False
        
        # Create student record
        student_info = {
            "id": student_id,
            "name": name,
            "grade_level": grade_level,
            "email": email,
            "assignments": {},
            "total_points": 0,
            "total_possible": 0,
            "enrollment_date": "2024-01-15"  # Placeholder
        }
        
        # Add to main dictionary
        self.students[student_id] = student_info
        
        # Update secondary indexes
        self.students_by_name[name.lower()] = student_id
        self.students_by_email[email.lower()] = student_id
        
        # Add to grade level index
        if grade_level not in self.students_by_grade:
            self.students_by_grade[grade_level] = []
        self.students_by_grade[grade_level].append(student_id)
        
        print(f"✅ Added student: {name} ({student_id})")
        return True
    
    def find_student_by_id(self, student_id):
        """O(1) lookup by student ID"""
        return self.students.get(student_id)
    
    def find_student_by_name(self, name):
        """O(1) lookup by student name"""
        student_id = self.students_by_name.get(name.lower())
        if student_id:
            return self.students[student_id]
        return None
    
    def find_student_by_email(self, email):
        """O(1) lookup by email"""
        student_id = self.students_by_email.get(email.lower())
        if student_id:
            return self.students[student_id]
        return None
    
    def get_students_by_grade(self, grade_level):
        """Get all students in a specific grade level"""
        student_ids = self.students_by_grade.get(grade_level, [])
        return [self.students[student_id] for student_id in student_ids]
    
    def add_assignment_grade(self, student_id, assignment_name, points_earned, points_possible):
        """Add a grade for a student's assignment"""
        if student_id not in self.students:
            print(f"❌ Student {student_id} not found")
            return False
        
        student = self.students[student_id]
        
        # Add assignment grade
        student["assignments"][assignment_name] = {
            "points_earned": points_earned,
            "points_possible": points_possible,
            "percentage": (points_earned / points_possible) * 100
        }
        
        # Update totals
        student["total_points"] += points_earned
        student["total_possible"] += points_possible
        
        print(f"✅ Added grade for {student['name']}: {assignment_name} = {points_earned}/{points_possible}")
        return True
    
    def get_student_average(self, student_id):
        """Calculate student's current average"""
        student = self.students.get(student_id)
        if not student or student["total_possible"] == 0:
            return 0
        
        return (student["total_points"] / student["total_possible"]) * 100
    
    def get_class_statistics(self, grade_level):
        """Get statistics for a grade level"""
        students = self.get_students_by_grade(grade_level)
        
        if not students:
            return {"error": "No students found for grade level"}
        
        averages = []
        total_assignments = 0
        
        for student in students:
            avg = self.get_student_average(student["id"])
            if avg > 0:  # Only include students with grades
                averages.append(avg)
            total_assignments += len(student["assignments"])
        
        if not averages:
            return {"error": "No grades found for grade level"}
        
        return {
            "grade_level": grade_level,
            "student_count": len(students),
            "average_grade": sum(averages) / len(averages),
            "highest_grade": max(averages),
            "lowest_grade": min(averages),
            "total_assignments": total_assignments
        }

# Example usage
db = StudentDatabase()

# Add students
students_to_add = [
    ("S001", "Alex Chen", 11, "alex.chen@school.edu"),
    ("S002", "Sarah Johnson", 11, "sarah.johnson@school.edu"),
    ("S003", "Mike Rodriguez", 12, "mike.rodriguez@school.edu"),
    ("S004", "Emma Thompson", 12, "emma.thompson@school.edu"),
    ("S005", "David Kim", 11, "david.kim@school.edu")
]

for student_id, name, grade, email in students_to_add:
    db.add_student(student_id, name, grade, email)

# Add some grades
grades_to_add = [
    ("S001", "Math Quiz 1", 85, 100),
    ("S001", "Science Lab 1", 92, 100),
    ("S002", "Math Quiz 1", 78, 100),
    ("S002", "English Essay", 88, 100),
    ("S003", "History Project", 91, 100),
    ("S005", "Math Quiz 1", 94, 100)
]

for student_id, assignment, earned, possible in grades_to_add:
    db.add_assignment_grade(student_id, assignment, earned, possible)

# Demonstrate fast lookups
print("\n🔍 FAST LOOKUPS DEMONSTRATION")
print("=" * 40)

# Lookup by ID
student = db.find_student_by_id("S001")
if student:
    avg = db.get_student_average("S001")
    print(f"Student S001: {student['name']} - Average: {avg:.1f}%")

# Lookup by name
student = db.find_student_by_name("Sarah Johnson")
if student:
    print(f"Found by name: {student['name']} ({student['id']})")

# Lookup by email
student = db.find_student_by_email("mike.rodriguez@school.edu")
if student:
    print(f"Found by email: {student['name']} ({student['id']})")

# Get class statistics
print("\n📊 CLASS STATISTICS")
print("=" * 40)
stats_11 = db.get_class_statistics(11)
stats_12 = db.get_class_statistics(12)

for grade_level, stats in [(11, stats_11), (12, stats_12)]:
    if "error" not in stats:
        print(f"Grade {grade_level}:")
        print(f"  Students: {stats['student_count']}")
        print(f"  Class Average: {stats['average_grade']:.1f}%")
        print(f"  Highest: {stats['highest_grade']:.1f}%")
        print(f"  Lowest: {stats['lowest_grade']:.1f}%")
        print(f"  Total Assignments: {stats['total_assignments']}")
    else:
        print(f"Grade {grade_level}: {stats['error']}")
```

## Sets - Unique Collections

Sets automatically handle duplicates and provide fast membership testing.

### StudyBuddy Subject and Skill Tracking

```python
class SkillTracker:
    """Track student skills and subject expertise using sets"""
    
    def __init__(self):
        # Each student ID maps to a set of skills
        self.student_skills = {}
        
        # Each subject maps to a set of required skills
        self.subject_requirements = {
            "Mathematics": {"algebra", "geometry", "calculus", "statistics", "problem_solving"},
            "Science": {"laboratory_skills", "data_analysis", "scientific_method", "critical_thinking"},
            "English": {"writing", "reading_comprehension", "grammar", "literary_analysis", "communication"},
            "History": {"research", "critical_thinking", "writing", "analysis", "chronological_thinking"},
            "Programming": {"logic", "problem_solving", "debugging", "algorithms", "syntax"}
        }
        
        # Track which students are taking which subjects
        self.student_subjects = {}
    
    def add_student(self, student_id, initial_skills=None):
        """Add a student with optional initial skills"""
        if initial_skills is None:
            initial_skills = set()
        
        self.student_skills[student_id] = set(initial_skills)
        self.student_subjects[student_id] = set()
        print(f"✅ Added student {student_id} with skills: {initial_skills}")
    
    def add_skill_to_student(self, student_id, skill):
        """Add a skill to a student"""
        if student_id not in self.student_skills:
            print(f"❌ Student {student_id} not found")
            return False
        
        self.student_skills[student_id].add(skill)
        print(f"🎯 Added skill '{skill}' to student {student_id}")
        return True
    
    def enroll_student_in_subject(self, student_id, subject):
        """Enroll student in a subject"""
        if student_id not in self.student_subjects:
            print(f"❌ Student {student_id} not found")
            return False
        
        if subject not in self.subject_requirements:
            print(f"❌ Subject {subject} not found")
            return False
        
        self.student_subjects[student_id].add(subject)
        print(f"📚 Enrolled student {student_id} in {subject}")
        return True
    
    def get_missing_skills_for_subject(self, student_id, subject):
        """Find skills a student needs to develop for a subject"""
        if student_id not in self.student_skills:
            return set()
        
        if subject not in self.subject_requirements:
            return set()
        
        student_skills = self.student_skills[student_id]
        required_skills = self.subject_requirements[subject]
        
        # Set difference: required - current = missing
        missing_skills = required_skills - student_skills
        return missing_skills
    
    def get_student_readiness(self, student_id, subject):
        """Calculate how ready a student is for a subject (0-100%)"""
        if student_id not in self.student_skills or subject not in self.subject_requirements:
            return 0
        
        student_skills = self.student_skills[student_id]
        required_skills = self.subject_requirements[subject]
        
        # Set intersection: skills student has that are required
        mastered_skills = student_skills & required_skills
        
        if not required_skills:
            return 100
        
        readiness_percentage = (len(mastered_skills) / len(required_skills)) * 100
        return readiness_percentage
    
    def find_students_with_skill(self, skill):
        """Find all students who have a specific skill"""
        students_with_skill = []
        
        for student_id, skills in self.student_skills.items():
            if skill in skills:
                students_with_skill.append(student_id)
        
        return students_with_skill
    
    def recommend_study_partners(self, student_id):
        """Find potential study partners based on shared subjects and complementary skills"""
        if student_id not in self.student_subjects:
            return []
        
        student_subjects = self.student_subjects[student_id]
        student_skills = self.student_skills[student_id]
        
        potential_partners = []
        
        for other_id, other_subjects in self.student_subjects.items():
            if other_id == student_id:
                continue
            
            # Find shared subjects
            shared_subjects = student_subjects & other_subjects
            
            if shared_subjects:
                other_skills = self.student_skills[other_id]
                
                # Find complementary skills (skills they have that student doesn't)
                complementary_skills = other_skills - student_skills
                
                # Find skills student can help with
                student_can_help = student_skills - other_skills
                
                if complementary_skills or student_can_help:
                    potential_partners.append({
                        "student_id": other_id,
                        "shared_subjects": shared_subjects,
                        "they_can_help_with": complementary_skills,
                        "you_can_help_with": student_can_help,
                        "compatibility_score": len(shared_subjects) + len(complementary_skills)
                    })
        
        # Sort by compatibility score
        potential_partners.sort(key=lambda x: x["compatibility_score"], reverse=True)
        return potential_partners
    
    def get_class_skill_summary(self):
        """Get overview of all skills in the class"""
        all_skills = set()
        skill_counts = {}
        
        # Collect all skills and count occurrences
        for student_id, skills in self.student_skills.items():
            all_skills.update(skills)
            for skill in skills:
                skill_counts[skill] = skill_counts.get(skill, 0) + 1
        
        # Sort by popularity
        popular_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
        
        return {
            "total_unique_skills": len(all_skills),
            "most_common_skills": popular_skills[:10],
            "all_skills": sorted(all_skills)
        }

# Example usage
tracker = SkillTracker()

# Add students with different skill sets
students_data = [
    ("S001", {"problem_solving", "algebra", "writing", "critical_thinking"}),
    ("S002", {"laboratory_skills", "data_analysis", "research", "communication"}),
    ("S003", {"logic", "algorithms", "debugging", "problem_solving"}),
    ("S004", {"writing", "literary_analysis", "research", "communication"}),
    ("S005", {"geometry", "statistics", "data_analysis", "critical_thinking"})
]

for student_id, skills in students_data:
    tracker.add_student(student_id, skills)

# Enroll students in subjects
enrollments = [
    ("S001", "Mathematics"),
    ("S001", "Programming"),
    ("S002", "Science"),
    ("S002", "English"),
    ("S003", "Programming"),
    ("S003", "Mathematics"),
    ("S004", "English"),
    ("S004", "History"),
    ("S005", "Mathematics"),
    ("S005", "Science")
]

for student_id, subject in enrollments:
    tracker.enroll_student_in_subject(student_id, subject)

print("\n🎯 SKILL ANALYSIS")
print("=" * 50)

# Check readiness for subjects
print("Student Readiness for Subjects:")
for student_id in ["S001", "S002", "S003"]:
    print(f"\nStudent {student_id}:")
    for subject in ["Mathematics", "Science", "Programming"]:
        readiness = tracker.get_student_readiness(student_id, subject)
        missing = tracker.get_missing_skills_for_subject(student_id, subject)
        print(f"  {subject}: {readiness:.1f}% ready")
        if missing:
            print(f"    Missing skills: {', '.join(missing)}")

# Find study partners
print(f"\n🤝 STUDY PARTNER RECOMMENDATIONS FOR S001:")
partners = tracker.recommend_study_partners("S001")
for partner in partners[:3]:  # Show top 3
    print(f"  Partner {partner['student_id']}:")
    print(f"    Shared subjects: {', '.join(partner['shared_subjects'])}")
    if partner['they_can_help_with']:
        print(f"    They can help with: {', '.join(partner['they_can_help_with'])}")
    if partner['you_can_help_with']:
        print(f"    You can help with: {', '.join(partner['you_can_help_with'])}")

# Class skill summary
print(f"\n📊 CLASS SKILL SUMMARY")
summary = tracker.get_class_skill_summary()
print(f"Total unique skills: {summary['total_unique_skills']}")
print("Most common skills:")
for skill, count in summary['most_common_skills'][:5]:
    print(f"  {skill}: {count} students")
```

## Stacks and Queues

Stacks (Last In, First Out) and Queues (First In, First Out) are essential for managing ordered data.

### StudyBuddy Undo/Redo and Notification Systems

```python
class UndoRedoSystem:
    """Implement undo/redo functionality for StudyBuddy using stacks"""
    
    def __init__(self):
        self.undo_stack = []    # Stack of previous states
        self.redo_stack = []    # Stack of undone actions
        self.current_state = {
            "assignments": [],
            "grades": {},
            "students": {}
        }
    
    def save_state(self):
        """Save current state before making changes"""
        # Deep copy current state to undo stack
        import copy
        state_copy = copy.deepcopy(self.current_state)
        self.undo_stack.append(state_copy)
        
        # Clear redo stack when new action is performed
        self.redo_stack.clear()
        
        # Limit undo history to prevent memory issues
        if len(self.undo_stack) > 50:
            self.undo_stack.pop(0)  # Remove oldest state
    
    def add_assignment(self, title, due_date, points):
        """Add assignment with undo capability"""
        self.save_state()  # Save state before change
        
        assignment = {
            "title": title,
            "due_date": due_date,
            "points": points,
            "id": len(self.current_state["assignments"]) + 1
        }
        
        self.current_state["assignments"].append(assignment)
        print(f"✅ Added assignment: {title}")
        return assignment["id"]
    
    def delete_assignment(self, assignment_id):
        """Delete assignment with undo capability"""
        self.save_state()  # Save state before change
        
        assignments = self.current_state["assignments"]
        for i, assignment in enumerate(assignments):
            if assignment["id"] == assignment_id:
                deleted = assignments.pop(i)
                print(f"🗑️ Deleted assignment: {deleted['title']}")
                return True
        
        print(f"❌ Assignment {assignment_id} not found")
        return False
    
    def add_grade(self, student_id, assignment_id, grade):
        """Add grade with undo capability"""
        self.save_state()  # Save state before change
        
        if student_id not in self.current_state["grades"]:
            self.current_state["grades"][student_id] = {}
        
        self.current_state["grades"][student_id][assignment_id] = grade
        print(f"📝 Added grade: Student {student_id}, Assignment {assignment_id} = {grade}")
    
    def undo(self):
        """Undo the last action"""
        if not self.undo_stack:
            print("❌ Nothing to undo")
            return False
        
        # Move current state to redo stack
        import copy
        self.redo_stack.append(copy.deepcopy(self.current_state))
        
        # Restore previous state from undo stack
        self.current_state = self.undo_stack.pop()
        print("↶ Undid last action")
        return True
    
    def redo(self):
        """Redo the last undone action"""
        if not self.redo_stack:
            print("❌ Nothing to redo")
            return False
        
        # Move current state to undo stack
        import copy
        self.undo_stack.append(copy.deepcopy(self.current_state))
        
        # Restore state from redo stack
        self.current_state = self.redo_stack.pop()
        print("↷ Redid last action")
        return True
    
    def get_undo_history(self):
        """Get list of available undo actions"""
        return len(self.undo_stack)
    
    def get_redo_history(self):
        """Get list of available redo actions"""
        return len(self.redo_stack)
    
    def print_current_state(self):
        """Display current state"""
        print("\n📋 CURRENT STATE")
        print("=" * 30)
        print(f"Assignments: {len(self.current_state['assignments'])}")
        for assignment in self.current_state["assignments"]:
            print(f"  - {assignment['title']} (ID: {assignment['id']})")
        
        print(f"Grades: {len(self.current_state['grades'])}")
        for student_id, grades in self.current_state["grades"].items():
            print(f"  Student {student_id}: {len(grades)} grades")
        
        print(f"Undo available: {self.get_undo_history()}")
        print(f"Redo available: {self.get_redo_history()}")

class NotificationQueue:
    """Manage notifications using a queue (FIFO)"""
    
    def __init__(self):
        self.notifications = []  # Using list as queue
        self.max_notifications = 100
    
    def add_notification(self, message, priority="normal", student_id=None):
        """Add notification to queue"""
        from datetime import datetime
        
        notification = {
            "message": message,
            "priority": priority,
            "student_id": student_id,
            "timestamp": datetime.now(),
            "read": False
        }
        
        # High priority notifications go to front
        if priority == "urgent":
            self.notifications.insert(0, notification)
            print(f"🚨 URGENT: {message}")
        else:
            self.notifications.append(notification)
            print(f"📢 Added notification: {message}")
        
        # Prevent queue from growing too large
        if len(self.notifications) > self.max_notifications:
            # Remove oldest notification
            old_notification = self.notifications.pop(0)
            print(f"🗑️ Removed old notification: {old_notification['message'][:30]}...")
    
    def get_next_notification(self):
        """Get and remove next notification from queue"""
        if not self.notifications:
            return None
        
        notification = self.notifications.pop(0)  # FIFO - remove from front
        return notification
    
    def peek_next_notification(self):
        """Look at next notification without removing it"""
        if not self.notifications:
            return None
        return self.notifications[0]
    
    def get_unread_count(self, student_id=None):
        """Get count of unread notifications"""
        if student_id:
            return sum(1 for n in self.notifications 
                      if not n["read"] and (n["student_id"] == student_id or n["student_id"] is None))
        else:
            return sum(1 for n in self.notifications if not n["read"])
    
    def mark_as_read(self, notification):
        """Mark notification as read"""
        notification["read"] = True
    
    def get_notifications_for_student(self, student_id):
        """Get all notifications for a specific student"""
        student_notifications = []
        for notification in self.notifications:
            if notification["student_id"] == student_id or notification["student_id"] is None:
                student_notifications.append(notification)
        return student_notifications
    
    def clear_read_notifications(self):
        """Remove all read notifications"""
        initial_count = len(self.notifications)
        self.notifications = [n for n in self.notifications if not n["read"]]
        removed_count = initial_count - len(self.notifications)
        print(f"🧹 Cleared {removed_count} read notifications")

# Example usage
print("🔄 UNDO/REDO SYSTEM DEMO")
print("=" * 40)

undo_system = UndoRedoSystem()

# Perform several actions
assignment1_id = undo_system.add_assignment("Math Quiz", "2024-03-15", 100)
assignment2_id = undo_system.add_assignment("Science Lab", "2024-03-18", 75)
undo_system.add_grade("S001", assignment1_id, 85)
undo_system.add_grade("S001", assignment2_id, 92)

undo_system.print_current_state()

# Undo some actions
print("\n⏪ UNDOING ACTIONS")
undo_system.undo()  # Undo last grade
undo_system.undo()  # Undo previous grade
undo_system.print_current_state()

# Redo an action
print("\n⏩ REDOING ACTION")
undo_system.redo()  # Redo one action
undo_system.print_current_state()

print("\n📬 NOTIFICATION QUEUE DEMO")
print("=" * 40)

notification_queue = NotificationQueue()

# Add various notifications
notification_queue.add_notification("Assignment 'Math Quiz' is due tomorrow", "normal", "S001")
notification_queue.add_notification("New assignment posted: Science Lab", "normal")
notification_queue.add_notification("Server maintenance in 5 minutes", "urgent")
notification_queue.add_notification("Your grade for 'English Essay' is available", "normal", "S001")

print(f"\nUnread notifications: {notification_queue.get_unread_count()}")
print(f"Unread for S001: {notification_queue.get_unread_count('S001')}")

# Process notifications
print("\n📨 PROCESSING NOTIFICATIONS")
while True:
    notification = notification_queue.get_next_notification()
    if not notification:
        break
    
    print(f"Processing: {notification['message']}")
    notification_queue.mark_as_read(notification)

print(f"Remaining notifications: {len(notification_queue.notifications)}")
```

## Trees and Hierarchical Data

Trees represent hierarchical relationships, perfect for organizational structures and decision-making processes.

### StudyBuddy Course Prerequisites and Skill Trees

```python
class TreeNode:
    """Basic tree node for hierarchical data"""
    
    def __init__(self, data):
        self.data = data
        self.children = []
        self.parent = None
    
    def add_child(self, child_node):
        """Add a child node"""
        child_node.parent = self
        self.children.append(child_node)
    
    def remove_child(self, child_node):
        """Remove a child node"""
        if child_node in self.children:
            child_node.parent = None
            self.children.remove(child_node)
    
    def get_level(self):
        """Get the depth level of this node"""
        level = 0
        current = self.parent
        while current:
            level += 1
            current = current.parent
        return level
    
    def print_tree(self, prefix="", is_last=True):
        """Print tree structure visually"""
        print(prefix + ("└── " if is_last else "├── ") + str(self.data))
        
        # Print children
        for i, child in enumerate(self.children):
            is_last_child = (i == len(self.children) - 1)
            extension = "    " if is_last else "│   "
            child.print_tree(prefix + extension, is_last_child)

class CoursePrerequisiteTree:
    """Manage course prerequisites using a tree structure"""
    
    def __init__(self):
        self.courses = {}  # course_id -> TreeNode
        self.root_courses = []  # Courses with no prerequisites
    
    def add_course(self, course_id, course_name, description=""):
        """Add a new course"""
        course_data = {
            "id": course_id,
            "name": course_name,
            "description": description,
            "difficulty": 1,
            "credits": 3
        }
        
        node = TreeNode(course_data)
        self.courses[course_id] = node
        self.root_courses.append(node)  # Initially assume no prerequisites
        
        print(f"📚 Added course: {course_name} ({course_id})")
    
    def add_prerequisite(self, course_id, prerequisite_id):
        """Add a prerequisite relationship"""
        if course_id not in self.courses or prerequisite_id not in self.courses:
            print("❌ One or both courses not found")
            return False
        
        course_node = self.courses[course_id]
        prereq_node = self.courses[prerequisite_id]
        
        # Add course as child of prerequisite
        prereq_node.add_child(course_node)
        
        # Remove course from root courses if it now has a prerequisite
        if course_node in self.root_courses:
            self.root_courses.remove(course_node)
        
        print(f"🔗 Added prerequisite: {prerequisite_id} → {course_id}")
        return True
    
    def get_learning_path(self, target_course_id):
        """Get the complete learning path to a course"""
        if target_course_id not in self.courses:
            return []
        
        path = []
        current = self.courses[target_course_id]
        
        # Walk up the tree to root
        while current:
            path.insert(0, current.data)  # Insert at beginning
            current = current.parent
        
        return path
    
    def get_course_level(self, course_id):
        """Get the academic level of a course (based on prerequisite depth)"""
        if course_id not in self.courses:
            return 0
        
        return self.courses[course_id].get_level() + 1
    
    def can_take_course(self, student_completed_courses, target_course_id):
        """Check if student can take a course based on completed prerequisites"""
        learning_path = self.get_learning_path(target_course_id)
        
        # Check if all prerequisites are completed
        for course in learning_path[:-1]:  # Exclude target course itself
            if course["id"] not in student_completed_courses:
                return False, f"Missing prerequisite: {course['name']}"
        
        return True, "All prerequisites satisfied"
    
    def recommend_next_courses(self, student_completed_courses):
        """Recommend courses student can take next"""
        available_courses = []
        
        for course_id, course_node in self.courses.items():
            if course_id not in student_completed_courses:
                can_take, reason = self.can_take_course(student_completed_courses, course_id)
                if can_take:
                    available_courses.append({
                        "course": course_node.data,
                        "level": self.get_course_level(course_id)
                    })
        
        # Sort by level (easier courses first)
        available_courses.sort(key=lambda x: x["level"])
        return available_courses
    
    def print_course_tree(self):
        """Print the complete course prerequisite tree"""
        print("\n🌳 COURSE PREREQUISITE TREE")
        print("=" * 50)
        
        for root_course in self.root_courses:
            root_course.print_tree()
            print()  # Add spacing between trees
    
    def get_course_statistics(self):
        """Get statistics about the course structure"""
        total_courses = len(self.courses)
        root_courses = len(self.root_courses)
        
        # Calculate levels
        level_counts = {}
        for course_node in self.courses.values():
            level = course_node.get_level()
            level_counts[level] = level_counts.get(level, 0) + 1
        
        max_depth = max(level_counts.keys()) if level_counts else 0
        
        return {
            "total_courses": total_courses,
            "root_courses": root_courses,
            "max_depth": max_depth,
            "courses_by_level": level_counts
        }

# Example usage
print("🌳 COURSE PREREQUISITE SYSTEM")
print("=" * 50)

course_tree = CoursePrerequisiteTree()

# Add courses
courses_to_add = [
    ("MATH101", "Basic Mathematics", "Foundation math skills"),
    ("MATH201", "Algebra", "Linear and quadratic equations"),
    ("MATH301", "Calculus I", "Introduction to differential calculus"),
    ("MATH401", "Calculus II", "Integral calculus and applications"),
    ("PHYS101", "Physics I", "Mechanics and motion"),
    ("PHYS201", "Physics II", "Electricity and magnetism"),
    ("CS101", "Programming Fundamentals", "Basic programming concepts"),
    ("CS201", "Data Structures", "Arrays, lists, trees, graphs"),
    ("CS301", "Algorithms", "Algorithm design and analysis"),
    ("ENG101", "English Composition", "Writing and communication skills")
]

for course_id, name, description in courses_to_add:
    course_tree.add_course(course_id, name, description)

# Add prerequisite relationships
prerequisites = [
    ("MATH201", "MATH101"),    # Algebra requires Basic Math
    ("MATH301", "MATH201"),    # Calculus I requires Algebra
    ("MATH401", "MATH301"),    # Calculus II requires Calculus I
    ("PHYS101", "MATH201"),    # Physics I requires Algebra
    ("PHYS201", "PHYS101"),    # Physics II requires Physics I
    ("PHYS201", "MATH301"),    # Physics II also requires Calculus I
    ("CS201", "CS101"),        # Data Structures requires Programming Fundamentals
    ("CS301", "CS201"),        # Algorithms requires Data Structures
    ("CS301", "MATH201"),      # Algorithms also requires Algebra
]

for course, prereq in prerequisites:
    course_tree.add_prerequisite(course, prereq)

# Display the tree structure
course_tree.print_course_tree()

# Test student progress
student_completed = ["MATH101", "MATH201", "CS101", "ENG101"]

print(f"📊 STUDENT PROGRESS ANALYSIS")
print("=" * 50)
print(f"Completed courses: {', '.join(student_completed)}")

# Check what courses student can take next
next_courses = course_tree.recommend_next_courses(student_completed)
print(f"\nRecommended next courses:")
for course_info in next_courses[:5]:  # Show top 5
    course = course_info["course"]
    level = course_info["level"]
    print(f"  Level {level}: {course['name']} ({course['id']})")

# Check specific course eligibility
target_course = "CS301"
can_take, message = course_tree.can_take_course(student_completed, target_course)
print(f"\nCan take {target_course}? {can_take}")
if not can_take:
    print(f"Reason: {message}")
    
    # Show learning path
    path = course_tree.get_learning_path(target_course)
    print(f"Required learning path:")
    for i, course in enumerate(path):
        completed = "✅" if course["id"] in student_completed else "⏳"
        print(f"  {i+1}. {completed} {course['name']} ({course['id']})")

# Course statistics
stats = course_tree.get_course_statistics()
print(f"\n📈 COURSE STRUCTURE STATISTICS")
print("=" * 50)
print(f"Total courses: {stats['total_courses']}")
print(f"Root courses (no prerequisites): {stats['root_courses']}")
print(f"Maximum depth: {stats['max_depth']}")
print("Courses by level:")
for level, count in sorted(stats['courses_by_level'].items()):
    print(f"  Level {level}: {count} courses")
```

## Key Takeaways

✅ **Choose the right structure** - Arrays for ordered data, dictionaries for lookups, sets for uniqueness
✅ **Understand trade-offs** - Time vs. space complexity, simplicity vs. efficiency
✅ **Consider your use case** - How often will you read vs. write? Search vs. insert?
✅ **Plan for scale** - Will your data structure handle 10 users? 10,000? 10 million?
✅ **Test with real data** - Synthetic test data might not reveal performance issues
✅ **Document your choices** - Future developers need to understand why you chose each structure

/// details | Professional Data Structure Usage 💼
    type: tip

**In the software industry:**
- **Database design** heavily relies on understanding data structures
- **System architecture** decisions often come down to choosing the right data organization
- **Performance optimization** usually involves switching to more appropriate data structures
- **Interview questions** frequently test data structure knowledge and trade-off analysis
- **Code reviews** often focus on whether the chosen data structure is optimal

Master these concepts for career success!

///

## Practice Exercises

### Exercise 1: Student Management System
Build a complete student management system using multiple data structures:
- Dictionary for student lookup by ID
- Sets for tracking subjects and skills
- Lists for grade history
- Trees for course prerequisites

### Exercise 2: Assignment Scheduler
Create an assignment scheduling system:
- Priority queue for urgent assignments
- Calendar structure for due dates
- Hash table for quick assignment lookup
- Stack for undo functionality

### Exercise 3: Study Group Optimizer
Design a system to form optimal study groups:
- Graph structure for student connections
- Sets for matching common subjects
- Arrays for group size management
- Trees for hierarchical skill requirements

## Next Steps

Now that you understand how to organize data efficiently, learn how to document and maintain your data structures with [Data Dictionaries](data-dictionaries.md).

---

*Remember: The best data structure is the one that makes your specific problem easy to solve. When in doubt, start simple and optimize based on actual usage patterns.*
