# Coding Exercises

## Introduction

**Coding exercises** are focused, bite-sized programming challenges designed to help you practice specific concepts and build confidence in your programming skills. Unlike large projects, these exercises target particular techniques, algorithms, or problem-solving approaches.

/// details | Why Coding Exercises Matter 💪
    type: important

**Skill Building:**

- **Focused practice** - Each exercise targets specific programming concepts
- **Immediate feedback** - Quick validation of your understanding
- **Progressive difficulty** - Build skills gradually from basic to advanced
- **Pattern recognition** - Learn to identify common problem types and solutions
- **Coding fluency** - Develop speed and accuracy in writing code

**Confidence Development:**

- **Small wins** - Successfully completing exercises builds programming confidence
- **Error handling** - Practice debugging and fixing common mistakes
- **Problem decomposition** - Learn to break complex problems into manageable parts
- **Solution validation** - Verify your approach works correctly

**Preparation for Assessment:**

- **Exam readiness** - Practice similar to assessment format
- **Time management** - Learn to work efficiently under constraints
- **Code quality** - Practice writing clean, readable solutions
- **Documentation skills** - Learn to explain your thinking clearly

///

## Exercise Categories

### 1. Basic Programming Concepts

/// details | Fundamentals Exercises 🏗️
    type: example

**Exercise F1: StudyBuddy Grade Calculator**

Write a function that calculates a student's final grade based on different assessment components.

```python
def calculate_final_grade(assignments, tests, participation_score):
    """
    Calculate final grade for StudyBuddy student.
    
    Requirements:
    - Assignments worth 40% (average of all assignment scores)
    - Tests worth 50% (average of all test scores)  
    - Participation worth 10% (single score)
    - Return grade rounded to 1 decimal place
    - Handle empty lists appropriately
    
    Args:
        assignments (list): List of assignment scores (0-100)
        tests (list): List of test scores (0-100)
        participation_score (float): Participation score (0-100)
    
    Returns:
        float: Final grade (0-100)
    
    Example:
        >>> calculate_final_grade([85, 90, 78], [88, 92], 95)
        87.9
    """
    # Your solution here
    pass

# Test cases to verify your solution:
def test_grade_calculator():
    # Test 1: Normal case
    result = calculate_final_grade([85, 90, 78], [88, 92], 95)
    expected = (84.3 * 0.4) + (90.0 * 0.5) + (95 * 0.1)
    assert abs(result - expected) < 0.1, f"Expected {expected:.1f}, got {result}"
    
    # Test 2: Empty assignments
    result = calculate_final_grade([], [85, 90], 80)
    expected = (0 * 0.4) + (87.5 * 0.5) + (80 * 0.1)
    assert abs(result - expected) < 0.1, f"Expected {expected:.1f}, got {result}"
    
    # Test 3: Single scores
    result = calculate_final_grade([100], [95], 90)
    expected = (100 * 0.4) + (95 * 0.5) + (90 * 0.1)
    assert abs(result - expected) < 0.1, f"Expected {expected:.1f}, got {result}"
    
    print("All tests passed! ✅")

# Run tests
test_grade_calculator()
```

**Exercise F2: Student Data Validation**

Create a function that validates student information before adding to StudyBuddy.

```python
def validate_student_data(student_id, name, email, grade_level):
    """
    Validate student data for StudyBuddy registration.
    
    Requirements:
    - student_id: exactly 6 characters, starts with 'S', followed by 5 digits
    - name: 2-50 characters, only letters and spaces, not empty
    - email: valid email format with @ and domain
    - grade_level: integer between 7 and 12 inclusive
    
    Args:
        student_id (str): Student ID to validate
        name (str): Student name to validate
        email (str): Email address to validate
        grade_level (int): Grade level to validate
    
    Returns:
        dict: Validation result with 'valid' (bool) and 'errors' (list)
    
    Example:
        >>> validate_student_data('S12345', 'Alice Johnson', 'alice@school.edu', 11)
        {'valid': True, 'errors': []}
        
        >>> validate_student_data('12345', 'A', 'invalid-email', 15)
        {'valid': False, 'errors': ['Invalid student ID format', 'Name too short', 'Invalid email format', 'Grade level out of range']}
    """
    # Your solution here
    pass

# Test cases
def test_student_validation():
    # Test 1: Valid data
    result = validate_student_data('S12345', 'Alice Johnson', 'alice@school.edu', 11)
    assert result['valid'] == True
    assert len(result['errors']) == 0
    
    # Test 2: Multiple errors
    result = validate_student_data('12345', 'A', 'invalid-email', 15)
    assert result['valid'] == False
    assert len(result['errors']) == 4
    
    # Test 3: Edge cases
    result = validate_student_data('S00000', 'Ab', 'test@example.com', 7)
    assert result['valid'] == False  # Name too short
    
    print("All validation tests passed! ✅")

test_student_validation()
```

**Exercise F3: Study Schedule Generator**

Build a function that creates a study schedule for StudyBuddy users.

```python
def generate_study_schedule(subjects, available_hours, priority_subjects=None):
    """
    Generate a study schedule based on subjects and available time.
    
    Requirements:
    - Distribute available hours across subjects
    - Priority subjects get 50% more time
    - Each subject gets at least 30 minutes (0.5 hours)
    - Return schedule as dictionary with subject: hours
    - Round hours to nearest 0.5
    
    Args:
        subjects (list): List of subject names
        available_hours (float): Total hours available for study
        priority_subjects (list): Subjects that need extra time
    
    Returns:
        dict: Schedule with subject names as keys, hours as values
    
    Example:
        >>> generate_study_schedule(['Math', 'English', 'Science'], 6)
        {'Math': 2.0, 'English': 2.0, 'Science': 2.0}
        
        >>> generate_study_schedule(['Math', 'English'], 3, ['Math'])
        {'Math': 1.5, 'English': 1.0}
    """
    # Your solution here
    pass

# Test your solution
def test_schedule_generator():
    # Test 1: Equal distribution
    result = generate_study_schedule(['Math', 'English', 'Science'], 6)
    assert sum(result.values()) == 6
    assert len(result) == 3
    
    # Test 2: Priority subjects
    result = generate_study_schedule(['Math', 'English'], 4, ['Math'])
    assert result['Math'] > result['English']
    assert sum(result.values()) == 4
    
    print("Schedule generator tests passed! ✅")

test_schedule_generator()
```

///

### 2. Data Structure Manipulation

/// details | Data Exercises 📊
    type: example

**Exercise D1: StudyBuddy Grade Analyzer**

Process and analyze grade data for insights.

```python
def analyze_class_performance(student_grades):
    """
    Analyze class performance data for StudyBuddy analytics.
    
    Args:
        student_grades (dict): Format {student_id: {'name': str, 'grades': [float]}}
    
    Returns:
        dict: Analysis with statistics and insights
    
    Example:
        >>> data = {
        ...     'S001': {'name': 'Alice', 'grades': [85, 90, 78, 92]},
        ...     'S002': {'name': 'Bob', 'grades': [75, 82, 88, 85]}
        ... }
        >>> analyze_class_performance(data)
        {
            'class_average': 83.1,
            'highest_performer': 'Alice',
            'lowest_performer': 'Bob',
            'grade_distribution': {'A': 1, 'B': 1, 'C': 0, 'D': 0, 'F': 0},
            'students_needing_help': ['Bob']
        }
    """
    
    if not student_grades:
        return {
            'class_average': 0,
            'highest_performer': None,
            'lowest_performer': None,
            'grade_distribution': {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0},
            'students_needing_help': []
        }
    
    # Calculate individual averages
    student_averages = {}
    all_grades = []
    
    for student_id, data in student_grades.items():
        if data['grades']:
            avg = sum(data['grades']) / len(data['grades'])
            student_averages[student_id] = avg
            all_grades.extend(data['grades'])
    
    if not student_averages:
        return {
            'class_average': 0,
            'highest_performer': None,
            'lowest_performer': None,
            'grade_distribution': {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0},
            'students_needing_help': []
        }
    
    # Calculate class average
    class_average = sum(student_averages.values()) / len(student_averages)
    
    # Find highest and lowest performers
    highest_id = max(student_averages, key=student_averages.get)
    lowest_id = min(student_averages, key=student_averages.get)
    
    highest_performer = student_grades[highest_id]['name']
    lowest_performer = student_grades[lowest_id]['name']
    
    # Grade distribution
    grade_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0}
    students_needing_help = []
    
    for student_id, avg in student_averages.items():
        if avg >= 90:
            grade_counts['A'] += 1
        elif avg >= 80:
            grade_counts['B'] += 1
        elif avg >= 70:
            grade_counts['C'] += 1
        elif avg >= 60:
            grade_counts['D'] += 1
        else:
            grade_counts['F'] += 1
            students_needing_help.append(student_grades[student_id]['name'])
    
    # Add students with average below class average to help list
    for student_id, avg in student_averages.items():
        if avg < class_average * 0.8:  # 20% below class average
            name = student_grades[student_id]['name']
            if name not in students_needing_help:
                students_needing_help.append(name)
    
    return {
        'class_average': round(class_average, 1),
        'highest_performer': highest_performer,
        'lowest_performer': lowest_performer,
        'grade_distribution': grade_counts,
        'students_needing_help': students_needing_help
    }

# Test the analyzer
test_data = {
    'S001': {'name': 'Alice', 'grades': [85, 90, 78, 92]},
    'S002': {'name': 'Bob', 'grades': [75, 82, 88, 85]},
    'S003': {'name': 'Charlie', 'grades': [95, 93, 97, 91]},
    'S004': {'name': 'Diana', 'grades': [65, 70, 68, 72]}
}

result = analyze_class_performance(test_data)
print("Class Analysis Results:")
for key, value in result.items():
    print(f"  {key}: {value}")
```

**Exercise D2: Assignment Tracker**

Manage assignment data and deadlines.

```python
from datetime import datetime, timedelta

def process_assignments(assignments, current_date):
    """
    Process assignment data for StudyBuddy dashboard.
    
    Args:
        assignments (list): List of assignment dictionaries
        current_date (str): Current date in 'YYYY-MM-DD' format
    
    Returns:
        dict: Processed assignment data with categories
    
    Assignment format:
    {
        'id': 'A001',
        'title': 'Math Quiz 1',
        'subject': 'Mathematics',
        'due_date': '2024-03-20',
        'status': 'pending',  # 'pending', 'completed', 'overdue'
        'priority': 'high'    # 'low', 'medium', 'high'
    }
    """
    # Your implementation here
    pass

# Test data
assignments = [
    {'id': 'A001', 'title': 'Math Quiz 1', 'subject': 'Mathematics', 'due_date': '2024-03-20', 'status': 'pending', 'priority': 'high'},
    {'id': 'A002', 'title': 'English Essay', 'subject': 'English', 'due_date': '2024-03-15', 'status': 'completed', 'priority': 'medium'},
    {'id': 'A003', 'title': 'Science Lab Report', 'subject': 'Science', 'due_date': '2024-03-10', 'status': 'overdue', 'priority': 'high'}
]

result = process_assignments(assignments, '2024-03-18')
# Expected structure:
# {
#     'overdue': [...],
#     'due_soon': [...],  # Due within 3 days
#     'upcoming': [...],
#     'completed': [...],
#     'by_subject': {...},
#     'by_priority': {...}
# }
```

///

### 3. Algorithm Implementation

/// details | Algorithm Exercises ⚙️
    type: example

**Exercise A1: Search and Sort StudyBuddy Data**

Implement search and sorting algorithms for student data.

```python
def search_student_by_name(students, search_name):
    """
    Search for students by name (case-insensitive, partial match).
    
    Args:
        students (list): List of student dictionaries
        search_name (str): Name to search for
    
    Returns:
        list: Matching student records
    """
    # Your implementation here
    pass

def sort_students_by_grade(students, subject=None):
    """
    Sort students by their average grade or subject grade.
    
    Args:
        students (list): List of student dictionaries
        subject (str): Specific subject to sort by (optional)
    
    Returns:
        list: Students sorted by grade (highest first)
    """
    # Your implementation here
    pass

# Test data
students = [
    {
        'id': 'S001',
        'name': 'Alice Johnson',
        'email': 'alice@school.edu',
        'grades': {
            'Math': [85, 90, 88],
            'English': [78, 82, 85],
            'Science': [92, 89, 91]
        }
    },
    {
        'id': 'S002', 
        'name': 'Bob Smith',
        'email': 'bob@school.edu',
        'grades': {
            'Math': [75, 80, 78],
            'English': [88, 85, 90],
            'Science': [70, 75, 73]
        }
    }
]

# Test search
search_results = search_student_by_name(students, 'alice')
print(f"Search results: {len(search_results)} students found")

# Test sorting
sorted_students = sort_students_by_grade(students, 'Math')
print("Students sorted by Math grade:")
for student in sorted_students:
    math_avg = sum(student['grades']['Math']) / len(student['grades']['Math'])
    print(f"  {student['name']}: {math_avg:.1f}")
```

**Exercise A2: StudyBuddy Recommendation Engine**

Build a simple recommendation system.

```python
def recommend_study_materials(student_performance, all_materials):
    """
    Recommend study materials based on student performance.
    
    Args:
        student_performance (dict): Student's performance by subject
        all_materials (list): Available study materials
    
    Returns:
        list: Recommended materials (top 5)
    
    Material format:
    {
        'id': 'M001',
        'title': 'Algebra Fundamentals',
        'subject': 'Math',
        'difficulty': 'beginner',  # beginner, intermediate, advanced
        'rating': 4.5,
        'topics': ['equations', 'variables', 'graphing']
    }
    
    Performance format:
    {
        'Math': {'average': 75, 'weak_topics': ['algebra', 'geometry']},
        'English': {'average': 85, 'weak_topics': ['grammar']},
        'Science': {'average': 90, 'weak_topics': []}
    }
    """
    
    recommendations = []
    
    # Algorithm:
    # 1. Identify subjects where student is struggling (average < 80)
    # 2. Find materials for those subjects
    # 3. Match difficulty level to student performance
    # 4. Prioritize materials that cover weak topics
    # 5. Sort by relevance score
    
    for subject, performance in student_performance.items():
        if performance['average'] < 80:  # Student needs help
            # Determine appropriate difficulty
            if performance['average'] < 60:
                target_difficulty = 'beginner'
            elif performance['average'] < 75:
                target_difficulty = 'intermediate' 
            else:
                target_difficulty = 'intermediate'
            
            # Find matching materials
            for material in all_materials:
                if material['subject'] == subject:
                    relevance_score = 0
                    
                    # Difficulty match
                    if material['difficulty'] == target_difficulty:
                        relevance_score += 3
                    elif abs(['beginner', 'intermediate', 'advanced'].index(material['difficulty']) - 
                            ['beginner', 'intermediate', 'advanced'].index(target_difficulty)) == 1:
                        relevance_score += 1
                    
                    # Topic relevance
                    for weak_topic in performance['weak_topics']:
                        if weak_topic in material['topics']:
                            relevance_score += 2
                    
                    # Rating bonus
                    relevance_score += material['rating'] / 2
                    
                    recommendations.append({
                        'material': material,
                        'relevance_score': relevance_score,
                        'reason': f"Helps with {subject} (avg: {performance['average']})"
                    })
    
    # Sort by relevance and return top 5
    recommendations.sort(key=lambda x: x['relevance_score'], reverse=True)
    return recommendations[:5]

# Test the recommendation engine
student_perf = {
    'Math': {'average': 65, 'weak_topics': ['algebra', 'geometry']},
    'English': {'average': 85, 'weak_topics': ['grammar']},
    'Science': {'average': 78, 'weak_topics': ['chemistry']}
}

materials = [
    {'id': 'M001', 'title': 'Algebra Basics', 'subject': 'Math', 'difficulty': 'beginner', 'rating': 4.5, 'topics': ['algebra', 'equations']},
    {'id': 'M002', 'title': 'Advanced Calculus', 'subject': 'Math', 'difficulty': 'advanced', 'rating': 4.8, 'topics': ['calculus', 'derivatives']},
    {'id': 'M003', 'title': 'Geometry Fundamentals', 'subject': 'Math', 'difficulty': 'beginner', 'rating': 4.3, 'topics': ['geometry', 'shapes']},
    {'id': 'M004', 'title': 'Chemistry Basics', 'subject': 'Science', 'difficulty': 'intermediate', 'rating': 4.2, 'topics': ['chemistry', 'elements']}
]

recommendations = recommend_study_materials(student_perf, materials)
print("Study Material Recommendations:")
for i, rec in enumerate(recommendations, 1):
    print(f"{i}. {rec['material']['title']} (Score: {rec['relevance_score']:.1f})")
    print(f"   {rec['reason']}")
```

///

### 4. Problem-Solving Challenges

/// details | Challenge Exercises 🧩
    type: example

**Exercise C1: StudyBuddy Analytics Dashboard**

Build a comprehensive analytics system.

```python
def generate_student_insights(student_data, time_period_days=30):
    """
    Generate insights for StudyBuddy analytics dashboard.
    
    Args:
        student_data (dict): Comprehensive student data
        time_period_days (int): Analysis period in days
    
    Returns:
        dict: Insights and recommendations
    
    Student data format:
    {
        'profile': {
            'id': 'S001',
            'name': 'Alice Johnson',
            'grade_level': 11,
            'subjects': ['Math', 'English', 'Science']
        },
        'grades': [
            {'subject': 'Math', 'score': 85, 'date': '2024-03-01', 'type': 'test'},
            {'subject': 'Math', 'score': 90, 'date': '2024-03-15', 'type': 'assignment'}
        ],
        'study_sessions': [
            {'subject': 'Math', 'duration': 60, 'date': '2024-03-01'},
            {'subject': 'English', 'duration': 45, 'date': '2024-03-02'}
        ],
        'goals': [
            {'subject': 'Math', 'target_grade': 90, 'current_progress': 87.5}
        ]
    }
    """
    
    insights = {
        'performance_trends': {},
        'study_efficiency': {},
        'goal_progress': {},
        'recommendations': [],
        'achievements': [],
        'areas_for_improvement': []
    }
    
    # Analyze performance trends
    subject_grades = {}
    for grade in student_data['grades']:
        subject = grade['subject']
        if subject not in subject_grades:
            subject_grades[subject] = []
        subject_grades[subject].append({
            'score': grade['score'],
            'date': grade['date']
        })
    
    for subject, grades in subject_grades.items():
        # Sort by date
        grades.sort(key=lambda x: x['date'])
        
        if len(grades) >= 2:
            # Calculate trend
            recent_avg = sum(g['score'] for g in grades[-3:]) / min(3, len(grades))
            early_avg = sum(g['score'] for g in grades[:3]) / min(3, len(grades))
            
            trend = 'improving' if recent_avg > early_avg + 2 else \
                   'declining' if recent_avg < early_avg - 2 else 'stable'
            
            insights['performance_trends'][subject] = {
                'trend': trend,
                'recent_average': round(recent_avg, 1),
                'change': round(recent_avg - early_avg, 1)
            }
    
    # Analyze study efficiency
    study_time_by_subject = {}
    for session in student_data['study_sessions']:
        subject = session['subject']
        if subject not in study_time_by_subject:
            study_time_by_subject[subject] = 0
        study_time_by_subject[subject] += session['duration']
    
    for subject in study_time_by_subject:
        if subject in subject_grades:
            avg_grade = sum(g['score'] for g in subject_grades[subject]) / len(subject_grades[subject])
            study_hours = study_time_by_subject[subject] / 60
            
            if study_hours > 0:
                efficiency = avg_grade / study_hours
                insights['study_efficiency'][subject] = {
                    'efficiency_score': round(efficiency, 1),
                    'total_hours': round(study_hours, 1),
                    'average_grade': round(avg_grade, 1)
                }
    
    # Analyze goal progress
    for goal in student_data['goals']:
        subject = goal['subject']
        progress_percentage = (goal['current_progress'] / goal['target_grade']) * 100
        
        insights['goal_progress'][subject] = {
            'target': goal['target_grade'],
            'current': goal['current_progress'],
            'progress_percentage': round(progress_percentage, 1),
            'on_track': progress_percentage >= 90
        }
    
    # Generate recommendations
    for subject, trend_data in insights['performance_trends'].items():
        if trend_data['trend'] == 'declining':
            insights['recommendations'].append(
                f"Consider increasing study time for {subject} - grades have declined by {abs(trend_data['change'])} points"
            )
        elif trend_data['trend'] == 'improving':
            insights['achievements'].append(
                f"Great progress in {subject}! Grades improved by {trend_data['change']} points"
            )
    
    # Identify areas for improvement
    for subject, efficiency_data in insights['study_efficiency'].items():
        if efficiency_data['efficiency_score'] < 10:  # Low efficiency threshold
            insights['areas_for_improvement'].append(
                f"{subject}: Low study efficiency ({efficiency_data['efficiency_score']:.1f} points per hour)"
            )
    
    return insights

# Test the analytics system
test_student = {
    'profile': {
        'id': 'S001',
        'name': 'Alice Johnson',
        'grade_level': 11,
        'subjects': ['Math', 'English', 'Science']
    },
    'grades': [
        {'subject': 'Math', 'score': 75, 'date': '2024-02-01', 'type': 'test'},
        {'subject': 'Math', 'score': 80, 'date': '2024-02-15', 'type': 'assignment'},
        {'subject': 'Math', 'score': 85, 'date': '2024-03-01', 'type': 'test'},
        {'subject': 'English', 'score': 90, 'date': '2024-02-01', 'type': 'essay'},
        {'subject': 'English', 'score': 88, 'date': '2024-02-15', 'type': 'quiz'},
        {'subject': 'English', 'score': 85, 'date': '2024-03-01', 'type': 'assignment'}
    ],
    'study_sessions': [
        {'subject': 'Math', 'duration': 120, 'date': '2024-02-01'},
        {'subject': 'Math', 'duration': 90, 'date': '2024-02-15'},
        {'subject': 'English', 'duration': 60, 'date': '2024-02-01'},
        {'subject': 'English', 'duration': 45, 'date': '2024-02-15'}
    ],
    'goals': [
        {'subject': 'Math', 'target_grade': 90, 'current_progress': 82.5},
        {'subject': 'English', 'target_grade': 85, 'current_progress': 87.7}
    ]
}

insights = generate_student_insights(test_student)
print("StudyBuddy Analytics Insights:")
print("\nPerformance Trends:")
for subject, data in insights['performance_trends'].items():
    print(f"  {subject}: {data['trend']} (Recent avg: {data['recent_average']})")

print("\nRecommendations:")
for rec in insights['recommendations']:
    print(f"  • {rec}")

print("\nAchievements:")
for achievement in insights['achievements']:
    print(f"  🎉 {achievement}")
```

///

## Exercise Progression System

### Difficulty Levels

/// details | Progressive Learning Path 📈
    type: info

**Level 1: Foundation (Beginner)**

- **Focus:** Basic syntax, simple logic, input/output
- **Skills:** Variables, conditionals, loops, basic functions
- **Time:** 15-30 minutes per exercise
- **Success Criteria:** Code works correctly for given test cases

**Example Level 1 Exercise:**
```python
def greet_student(name, grade_level):
    """Create a personalized greeting for StudyBuddy users."""
    # Create greeting message based on grade level
    if grade_level <= 8:
        title = "young scholar"
    elif grade_level <= 10:
        title = "dedicated student"
    else:
        title = "academic achiever"
    
    return f"Welcome to StudyBuddy, {name}! Ready to excel as a {title}?"

# Test your function
print(greet_student("Alice", 11))  # Should return personalized message
```

**Level 2: Building (Intermediate)**

- **Focus:** Data structures, algorithms, error handling
- **Skills:** Lists, dictionaries, file I/O, exception handling
- **Time:** 30-60 minutes per exercise
- **Success Criteria:** Handles edge cases, well-structured code

**Example Level 2 Exercise:**
```python
def analyze_study_patterns(study_log):
    """
    Analyze study session data to identify patterns.
    
    Args:
        study_log (list): List of study session dictionaries
    
    Returns:
        dict: Analysis results with patterns and insights
    """
    # Implement comprehensive analysis
    # - Find most/least studied subjects
    # - Calculate average session length
    # - Identify optimal study times
    # - Detect improvement trends
    pass
```

**Level 3: Mastery (Advanced)**

- **Focus:** Complex algorithms, optimization, system design
- **Skills:** Object-oriented programming, performance optimization
- **Time:** 1-2 hours per exercise
- **Success Criteria:** Efficient, maintainable, professional-quality code

**Example Level 3 Exercise:**
```python
class StudyBuddyRecommendationSystem:
    """
    Advanced recommendation system using collaborative filtering
    and content-based approaches.
    """
    
    def __init__(self):
        self.user_profiles = {}
        self.content_features = {}
        self.interaction_matrix = {}
    
    def train_model(self, training_data):
        """Train recommendation model on historical data."""
        pass
    
    def recommend_resources(self, user_id, num_recommendations=10):
        """Generate personalized recommendations."""
        pass
    
    def update_preferences(self, user_id, feedback):
        """Update model based on user feedback."""
        pass
```

///

### Self-Assessment Tools

/// details | Track Your Progress 📊
    type: tip

**Exercise Completion Tracker**

```python
class ExerciseTracker:
    """Track your coding exercise progress."""
    
    def __init__(self):
        self.completed_exercises = {}
        self.skill_levels = {
            'variables_conditionals': 0,
            'loops_functions': 0,
            'data_structures': 0,
            'algorithms': 0,
            'file_handling': 0,
            'error_handling': 0,
            'object_oriented': 0,
            'optimization': 0
        }
    
    def complete_exercise(self, exercise_id, category, difficulty, time_taken, score):
        """Record completion of an exercise."""
        self.completed_exercises[exercise_id] = {
            'category': category,
            'difficulty': difficulty,
            'time_taken': time_taken,
            'score': score,
            'date_completed': datetime.now()
        }
        
        # Update skill level
        if category in self.skill_levels:
            self.skill_levels[category] += difficulty
    
    def get_progress_report(self):
        """Generate progress report."""
        total_exercises = len(self.completed_exercises)
        
        if total_exercises == 0:
            return "No exercises completed yet. Start with Level 1 exercises!"
        
        avg_score = sum(ex['score'] for ex in self.completed_exercises.values()) / total_exercises
        avg_time = sum(ex['time_taken'] for ex in self.completed_exercises.values()) / total_exercises
        
        # Skill analysis
        strongest_skill = max(self.skill_levels, key=self.skill_levels.get)
        weakest_skill = min(self.skill_levels, key=self.skill_levels.get)
        
        report = f"""
📊 Progress Report
==================
Total Exercises: {total_exercises}
Average Score: {avg_score:.1f}%
Average Time: {avg_time:.1f} minutes

🎯 Skill Levels:
"""
        
        for skill, level in self.skill_levels.items():
            bars = "█" * min(level // 5, 10)  # Visual progress bar
            report += f"{skill.replace('_', ' ').title()}: {bars} ({level})\n"
        
        report += f"""
💪 Strongest Skill: {strongest_skill.replace('_', ' ').title()}
🎯 Focus Area: {weakest_skill.replace('_', ' ').title()}

Next Steps:
- Complete more {weakest_skill.replace('_', ' ')} exercises
- Try harder difficulty levels in strong areas
- Review and refactor previous solutions
"""
        
        return report
    
    def suggest_next_exercises(self):
        """Suggest exercises based on current progress."""
        suggestions = []
        
        # Find areas that need work
        weak_areas = [skill for skill, level in self.skill_levels.items() if level < 10]
        
        for area in weak_areas[:3]:  # Top 3 areas to focus on
            suggestions.append(f"Practice more {area.replace('_', ' ')} exercises")
        
        return suggestions

# Example usage
tracker = ExerciseTracker()
tracker.complete_exercise('F1', 'variables_conditionals', 2, 25, 85)
tracker.complete_exercise('D1', 'data_structures', 3, 45, 92)

print(tracker.get_progress_report())
```

**Code Quality Self-Check**

```python
def self_evaluate_code(your_code_function):
    """
    Self-evaluation checklist for your exercise solutions.
    
    Rate each aspect from 1-5 (5 being excellent):
    """
    
    evaluation_areas = {
        'correctness': {
            'question': 'Does your code produce correct results for all test cases?',
            'weight': 0.3
        },
        'readability': {
            'question': 'Is your code easy to read and understand?',
            'weight': 0.2
        },
        'efficiency': {
            'question': 'Is your solution reasonably efficient?',
            'weight': 0.2
        },
        'error_handling': {
            'question': 'Does your code handle edge cases and errors gracefully?',
            'weight': 0.15
        },
        'documentation': {
            'question': 'Are your functions and complex logic well-documented?',
            'weight': 0.15
        }
    }
    
    print("Code Quality Self-Evaluation")
    print("=" * 30)
    
    scores = {}
    total_weighted_score = 0
    
    for area, details in evaluation_areas.items():
        print(f"\n{area.title()}:")
        print(f"  {details['question']}")
        
        while True:
            try:
                score = int(input("  Rate 1-5: "))
                if 1 <= score <= 5:
                    scores[area] = score
                    total_weighted_score += score * details['weight']
                    break
                else:
                    print("  Please enter a number between 1 and 5")
            except ValueError:
                print("  Please enter a valid number")
    
    overall_score = total_weighted_score / sum(details['weight'] for details in evaluation_areas.values())
    
    print(f"\n📊 Overall Score: {overall_score:.1f}/5")
    
    # Provide feedback
    if overall_score >= 4.5:
        feedback = "🌟 Excellent work! Your code is professional quality."
    elif overall_score >= 3.5:
        feedback = "✅ Good job! Minor improvements could make this even better."
    elif overall_score >= 2.5:
        feedback = "📈 Making progress! Focus on the lower-rated areas."
    else:
        feedback = "💪 Keep practicing! Every expert was once a beginner."
    
    print(f"Feedback: {feedback}")
    
    # Specific improvement suggestions
    weak_areas = [area for area, score in scores.items() if score <= 2]
    if weak_areas:
        print(f"\n🎯 Areas to improve: {', '.join(weak_areas)}")
    
    return overall_score

# Run self-evaluation after completing an exercise
# self_evaluate_code(your_function_name)
```

///

## Exercise Resources

### Quick Reference

/// details | Programming Quick Reference 📚
    type: note

**Common Patterns for StudyBuddy Exercises**

```python
# Pattern 1: Data Validation
def validate_input(data, rules):
    """Standard validation pattern."""
    errors = []
    
    for field, value in data.items():
        if field in rules:
            rule = rules[field]
            
            # Check required
            if rule.get('required', False) and not value:
                errors.append(f"{field} is required")
            
            # Check type
            if 'type' in rule and not isinstance(value, rule['type']):
                errors.append(f"{field} must be {rule['type'].__name__}")
            
            # Check length/range
            if 'min_length' in rule and len(str(value)) < rule['min_length']:
                errors.append(f"{field} too short")
            
            if 'max_length' in rule and len(str(value)) > rule['max_length']:
                errors.append(f"{field} too long")
    
    return {'valid': len(errors) == 0, 'errors': errors}

# Pattern 2: Data Analysis
def analyze_data(dataset, metric_functions):
    """Standard analysis pattern."""
    results = {}
    
    for metric_name, metric_func in metric_functions.items():
        try:
            results[metric_name] = metric_func(dataset)
        except Exception as e:
            results[metric_name] = f"Error: {str(e)}"
    
    return results

# Pattern 3: Search and Filter
def search_and_filter(items, search_term=None, filters=None):
    """Standard search pattern."""
    results = items[:]  # Copy list
    
    # Apply search
    if search_term:
        results = [item for item in results 
                  if search_term.lower() in str(item).lower()]
    
    # Apply filters
    if filters:
        for key, value in filters.items():
            results = [item for item in results 
                      if item.get(key) == value]
    
    return results

# Pattern 4: Calculation with Error Handling
def safe_calculate(values, operation):
    """Standard calculation pattern."""
    try:
        if not values:
            return 0
        
        if operation == 'average':
            return sum(values) / len(values)
        elif operation == 'median':
            sorted_values = sorted(values)
            n = len(sorted_values)
            if n % 2 == 0:
                return (sorted_values[n//2-1] + sorted_values[n//2]) / 2
            else:
                return sorted_values[n//2]
        elif operation == 'mode':
            from collections import Counter
            counts = Counter(values)
            return counts.most_common(1)[0][0]
        else:
            raise ValueError(f"Unknown operation: {operation}")
    
    except Exception as e:
        return {'error': str(e)}

# Pattern 5: Object-Oriented Structure
class StudyBuddyComponent:
    """Base pattern for StudyBuddy components."""
    
    def __init__(self, **kwargs):
        self.data = kwargs
        self.validate_data()
    
    def validate_data(self):
        """Override in subclasses."""
        pass
    
    def to_dict(self):
        """Convert to dictionary representation."""
        return self.data.copy()
    
    def update(self, **kwargs):
        """Update component data."""
        self.data.update(kwargs)
        self.validate_data()
```

**Debugging Checklist**

```python
def debug_checklist():
    """
    Use this checklist when your exercise code isn't working:
    
    ✅ Syntax Issues:
    - Are all parentheses, brackets, and braces matched?
    - Are strings properly quoted?
    - Is indentation consistent?
    
    ✅ Logic Issues:
    - Are you handling empty inputs?
    - Are you checking for None values?
    - Are comparison operators correct (== vs =)?
    - Are you returning the right data type?
    
    ✅ Data Issues:
    - Are you accessing dictionary keys that might not exist?
    - Are you dividing by zero anywhere?
    - Are you assuming list indices exist?
    
    ✅ Test Issues:
    - Are you testing with the exact same input format as specified?
    - Are you testing edge cases (empty lists, None values, etc.)?
    - Are you comparing the right data types?
    
    ✅ Understanding Issues:
    - Did you read the problem statement carefully?
    - Do you understand what the function should return?
    - Are you implementing the right algorithm?
    """
    pass

# Quick debugging function
def debug_function(func, test_inputs):
    """Quick way to test your function with debug output."""
    print(f"Testing function: {func.__name__}")
    print("=" * 40)
    
    for i, test_input in enumerate(test_inputs, 1):
        print(f"\nTest {i}:")
        print(f"Input: {test_input}")
        
        try:
            if isinstance(test_input, tuple):
                result = func(*test_input)
            else:
                result = func(test_input)
            print(f"Output: {result}")
            print(f"Type: {type(result)}")
        except Exception as e:
            print(f"Error: {e}")
            print(f"Error type: {type(e).__name__}")

# Example usage:
# debug_function(your_function, [
#     ([1, 2, 3], 'average'),
#     ([], 'average'),
#     ([5, 5, 5], 'mode')
# ])
```

///

## Getting Started

Ready to start coding? Here's your action plan:

1. **Choose your starting level** - Begin with Foundation exercises if you're new to programming
2. **Set up your environment** - Make sure you have Python installed and a good text editor
3. **Start with StudyBuddy exercises** - These connect to real-world applications
4. **Use the self-assessment tools** - Track your progress and identify areas to improve
5. **Practice regularly** - Consistency beats intensity - do a little every day
6. **Review and refactor** - Come back to old exercises and improve your solutions

/// details | Exercise Completion Strategy 💡
    type: success

**Daily Practice Routine:**

1. **Warm-up (5 minutes):** Review concepts from previous exercises
2. **Main Exercise (20-45 minutes):** Work on one new exercise
3. **Test and Debug (10-15 minutes):** Thoroughly test your solution
4. **Reflect and Document (5 minutes):** Note what you learned

**Weekly Goals:**

- **Week 1-2:** Master Foundation level exercises (F1-F3)
- **Week 3-4:** Progress to Building level exercises (D1-D2)
- **Week 5-6:** Tackle intermediate Algorithm exercises (A1-A2)
- **Week 7-8:** Challenge yourself with Mastery level exercises (C1)

**Study Tips:**

- **Start simple:** Get basic functionality working before adding complexity
- **Test frequently:** Don't write everything before testing anything
- **Read error messages:** They're trying to help you!
- **Use print statements:** Debug by printing intermediate values
- **Ask for help:** When stuck, explain your problem to someone else (or a rubber duck!)

///

---

*Remember: Every expert programmer started with simple exercises like these. Focus on understanding the concepts, not just getting the right answer. The goal is to build problem-solving skills that will serve you throughout your programming journey!*
