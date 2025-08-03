# Structured Algorithms

## Introduction

Beyond basic loops and conditions, programmers use powerful algorithmic techniques to solve complex problems elegantly. **Structured algorithms** include recursion, divide-and-conquer, dynamic programming, and backtracking - the tools that separate novice programmers from experts.

/// details | Why Learn Advanced Techniques? 🎯
    type: motivation

**These patterns solve real problems:**
- **Recursion**: File system navigation, tree structures
- **Divide & Conquer**: Efficient sorting, searching massive datasets  
- **Dynamic Programming**: Optimization problems, route planning
- **Backtracking**: Puzzle solving, constraint satisfaction
- **Greedy Algorithms**: Resource allocation, scheduling

Master these patterns to tackle any programming challenge!

///

## Recursion

Recursion occurs when a function calls itself to solve smaller versions of the same problem.

### Recursion Components

#### 1. Base Case
The condition that stops the recursion.

#### 2. Recursive Case  
The function calling itself with modified parameters.

#### 3. Progress Toward Base Case
Each recursive call must get closer to the base case.

### StudyBuddy Example: Course Prerequisites

```python
def can_take_course(student, course, completed_courses):
    """
    Check if student can take a course based on prerequisites
    """
    # Base case: no prerequisites
    if not course.prerequisites:
        return True
    
    # Check each prerequisite
    for prereq in course.prerequisites:
        # Base case: already completed
        if prereq in completed_courses:
            continue
        
        # Recursive case: check if we can complete the prerequisite
        if not can_take_course(student, prereq, completed_courses):
            return False
    
    return True

# Example usage
math_101 = Course("Math 101", [])
math_201 = Course("Math 201", [math_101])
physics_301 = Course("Physics 301", [math_201])

student_courses = [math_101]
print(can_take_course(student, physics_301, student_courses))  # False
```

### StudyBuddy Example: Assignment Folder Structure

```python
class Folder:
    def __init__(self, name):
        self.name = name
        self.folders = []
        self.assignments = []

def calculate_total_assignments(folder):
    """
    Recursively count all assignments in folder and subfolders
    """
    # Base case: count assignments in current folder
    total = len(folder.assignments)
    
    # Recursive case: add assignments from subfolders
    for subfolder in folder.folders:
        total += calculate_total_assignments(subfolder)
    
    return total

def find_assignment(folder, assignment_name):
    """
    Search for assignment recursively through folder structure
    """
    # Base case: check current folder
    for assignment in folder.assignments:
        if assignment.name == assignment_name:
            return assignment
    
    # Recursive case: search subfolders
    for subfolder in folder.folders:
        result = find_assignment(subfolder, assignment_name)
        if result:
            return result
    
    return None

# Example structure
root = Folder("My Assignments")
math_folder = Folder("Mathematics")
science_folder = Folder("Science")

root.folders = [math_folder, science_folder]
math_folder.assignments = [Assignment("Algebra Quiz"), Assignment("Calculus Project")]
science_folder.assignments = [Assignment("Chemistry Lab")]

print(calculate_total_assignments(root))  # 3
print(find_assignment(root, "Chemistry Lab"))  # Found!
```

### Recursion Best Practices

#### ✅ Good Recursion
```python
def factorial(n):
    # Clear base case
    if n <= 1:
        return 1
    
    # Progress toward base case
    return n * factorial(n - 1)
```

#### ❌ Problematic Recursion
```python
def bad_factorial(n):
    # Missing base case - infinite recursion!
    return n * bad_factorial(n - 1)

def inefficient_fibonacci(n):
    if n <= 1:
        return n
    # Recalculates same values repeatedly
    return inefficient_fibonacci(n-1) + inefficient_fibonacci(n-2)
```

## Divide and Conquer

Break a problem into smaller subproblems, solve them independently, then combine results.

### StudyBuddy Example: Efficient Grade Sorting

```python
def merge_sort_grades(student_grades):
    """
    Sort student grades using divide-and-conquer
    Time Complexity: O(n log n)
    """
    # Base case: single grade or empty list
    if len(student_grades) <= 1:
        return student_grades
    
    # Divide: split into two halves
    mid = len(student_grades) // 2
    left_half = student_grades[:mid]
    right_half = student_grades[mid:]
    
    # Conquer: recursively sort both halves
    left_sorted = merge_sort_grades(left_half)
    right_sorted = merge_sort_grades(right_half)
    
    # Combine: merge sorted halves
    return merge_grades(left_sorted, right_sorted)

def merge_grades(left, right):
    """
    Merge two sorted grade lists
    """
    result = []
    i = j = 0
    
    # Merge in sorted order
    while i < len(left) and j < len(right):
        if left[i].score <= right[j].score:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining grades
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result
```

### StudyBuddy Example: Finding Study Partners

```python
def find_best_study_partner(students, target_student):
    """
    Find most compatible study partner using divide-and-conquer
    """
    if len(students) <= 1:
        return students[0] if students else None
    
    # Divide students into two groups
    mid = len(students) // 2
    left_group = students[:mid]
    right_group = students[mid:]
    
    # Conquer: find best partner in each group
    best_left = find_best_study_partner(left_group, target_student)
    best_right = find_best_study_partner(right_group, target_student)
    
    # Combine: choose the better partner
    if not best_left:
        return best_right
    if not best_right:
        return best_left
    
    left_compatibility = calculate_compatibility(target_student, best_left)
    right_compatibility = calculate_compatibility(target_student, best_right)
    
    return best_left if left_compatibility > right_compatibility else best_right

def calculate_compatibility(student1, student2):
    """Calculate compatibility score between two students"""
    shared_subjects = len(set(student1.subjects) & set(student2.subjects))
    grade_difference = abs(student1.average_grade - student2.average_grade)
    schedule_overlap = len(set(student1.free_times) & set(student2.free_times))
    
    return shared_subjects * 3 + schedule_overlap * 2 - grade_difference * 0.1
```

## Dynamic Programming

Solve complex problems by breaking them down and storing solutions to avoid redundant calculations.

### StudyBuddy Example: Optimal Study Schedule

```python
def optimal_study_schedule(assignments, available_hours):
    """
    Find the best assignment combination to maximize points within time limit
    Classic 0/1 Knapsack problem solved with dynamic programming
    """
    n = len(assignments)
    
    # Create DP table: dp[i][h] = max points using first i assignments with h hours
    dp = [[0 for _ in range(available_hours + 1)] for _ in range(n + 1)]
    
    # Fill the DP table
    for i in range(1, n + 1):
        assignment = assignments[i - 1]
        for h in range(available_hours + 1):
            # Option 1: Don't include this assignment
            dp[i][h] = dp[i - 1][h]
            
            # Option 2: Include this assignment (if time permits)
            if assignment.estimated_hours <= h:
                include_points = assignment.points + dp[i - 1][h - assignment.estimated_hours]
                dp[i][h] = max(dp[i][h], include_points)
    
    # Reconstruct the solution
    selected_assignments = []
    h = available_hours
    for i in range(n, 0, -1):
        if dp[i][h] != dp[i - 1][h]:
            selected_assignments.append(assignments[i - 1])
            h -= assignments[i - 1].estimated_hours
    
    return selected_assignments, dp[n][available_hours]

class Assignment:
    def __init__(self, name, points, estimated_hours):
        self.name = name
        self.points = points
        self.estimated_hours = estimated_hours

# Example usage
assignments = [
    Assignment("Math Quiz", 20, 2),
    Assignment("Science Project", 50, 6),
    Assignment("History Essay", 30, 4),
    Assignment("Art Portfolio", 40, 5)
]

optimal_assignments, max_points = optimal_study_schedule(assignments, 10)
print(f"Maximum points: {max_points}")
for assignment in optimal_assignments:
    print(f"- {assignment.name}: {assignment.points} points, {assignment.estimated_hours} hours")
```

### StudyBuddy Example: Learning Path Optimization

```python
def find_shortest_learning_path(skills, dependencies, start_skill, target_skill):
    """
    Find shortest path to learn a skill considering prerequisites
    Uses dynamic programming with memoization
    """
    memo = {}
    
    def min_time_to_learn(current_skill, learned_skills):
        # Create a key for memoization
        key = (current_skill, tuple(sorted(learned_skills)))
        if key in memo:
            return memo[key]
        
        # Base case: already learned the target skill
        if current_skill == target_skill:
            return 0
        
        # Base case: skill already learned
        if current_skill in learned_skills:
            return 0
        
        # Check if prerequisites are met
        prereqs = dependencies.get(current_skill, [])
        for prereq in prereqs:
            if prereq not in learned_skills:
                # Must learn prerequisite first
                prereq_time = min_time_to_learn(prereq, learned_skills)
                if prereq_time == float('inf'):
                    memo[key] = float('inf')
                    return float('inf')
                
                # Learn the prerequisite
                new_learned = learned_skills | {prereq}
                return prereq_time + skills[prereq] + min_time_to_learn(current_skill, new_learned)
        
        # Can learn this skill now
        if current_skill == target_skill:
            result = skills[current_skill]
        else:
            # Continue to target skill
            new_learned = learned_skills | {current_skill}
            result = skills[current_skill] + min_time_to_learn(target_skill, new_learned)
        
        memo[key] = result
        return result
    
    return min_time_to_learn(start_skill, set())

# Example: Learning web development
skills = {
    "HTML": 10,
    "CSS": 15,
    "JavaScript": 25,
    "React": 30,
    "Node.js": 20,
    "Database": 15
}

dependencies = {
    "CSS": ["HTML"],
    "JavaScript": ["HTML", "CSS"],
    "React": ["JavaScript"],
    "Node.js": ["JavaScript"],
    "Database": []
}

time_needed = find_shortest_learning_path(skills, dependencies, "HTML", "React")
print(f"Minimum time to learn React: {time_needed} hours")
```

## Backtracking

Systematically explore all possible solutions, backtracking when a path leads to failure.

### StudyBuddy Example: Course Scheduling

```python
def create_course_schedule(courses, time_slots, room_constraints):
    """
    Create a valid course schedule using backtracking
    """
    schedule = {}
    
    def is_valid_assignment(course, time_slot, room):
        # Check room capacity
        if course.enrollment > room.capacity:
            return False
        
        # Check time conflicts for instructor
        for scheduled_course, (scheduled_time, scheduled_room) in schedule.items():
            if (scheduled_time == time_slot and 
                scheduled_course.instructor == course.instructor):
                return False
        
        # Check room availability
        for scheduled_course, (scheduled_time, scheduled_room) in schedule.items():
            if scheduled_time == time_slot and scheduled_room == room:
                return False
        
        return True
    
    def backtrack(course_index):
        # Base case: all courses scheduled
        if course_index == len(courses):
            return True
        
        current_course = courses[course_index]
        
        # Try each time slot and room combination
        for time_slot in time_slots:
            for room in room_constraints.get(current_course.subject, []):
                if is_valid_assignment(current_course, time_slot, room):
                    # Make assignment
                    schedule[current_course] = (time_slot, room)
                    
                    # Recursively schedule remaining courses
                    if backtrack(course_index + 1):
                        return True
                    
                    # Backtrack: remove assignment
                    del schedule[current_course]
        
        return False
    
    if backtrack(0):
        return schedule
    else:
        return None

class Course:
    def __init__(self, name, subject, instructor, enrollment):
        self.name = name
        self.subject = subject
        self.instructor = instructor
        self.enrollment = enrollment

class Room:
    def __init__(self, name, capacity):
        self.name = name
        self.capacity = capacity
```

### StudyBuddy Example: Study Group Formation

```python
def form_study_groups(students, group_size, subject_requirements):
    """
    Form optimal study groups using backtracking
    """
    groups = []
    used_students = set()
    
    def is_valid_group(group):
        # Check group size
        if len(group) != group_size:
            return False
        
        # Check subject compatibility
        common_subjects = set(group[0].subjects)
        for student in group[1:]:
            common_subjects &= set(student.subjects)
        
        return len(common_subjects) >= subject_requirements
    
    def backtrack(current_group, remaining_students):
        # Base case: found a valid group
        if len(current_group) == group_size:
            if is_valid_group(current_group):
                groups.append(current_group[:])
                for student in current_group:
                    used_students.add(student.id)
                return True
            return False
        
        # Try adding each remaining student
        for i, student in enumerate(remaining_students):
            if student.id not in used_students:
                # Add student to current group
                current_group.append(student)
                
                # Continue with remaining students
                if backtrack(current_group, remaining_students[i+1:]):
                    current_group.pop()  # Backtrack
                    
                    # Try to form another group with remaining students
                    available_students = [s for s in students if s.id not in used_students]
                    if len(available_students) >= group_size:
                        backtrack([], available_students)
                    
                    return True
                
                # Backtrack: remove student
                current_group.pop()
        
        return False
    
    backtrack([], students)
    return groups
```

## Greedy Algorithms

Make locally optimal choices at each step, hoping to find a global optimum.

### StudyBuddy Example: Study Session Scheduling

```python
def schedule_study_sessions(sessions, total_time):
    """
    Schedule maximum number of study sessions using greedy approach
    Sort by end time and pick non-overlapping sessions
    """
    # Sort sessions by end time (greedy choice)
    sorted_sessions = sorted(sessions, key=lambda s: s.end_time)
    
    scheduled = []
    last_end_time = 0
    
    for session in sorted_sessions:
        # If session doesn't overlap with previous
        if session.start_time >= last_end_time:
            scheduled.append(session)
            last_end_time = session.end_time
    
    return scheduled

class StudySession:
    def __init__(self, subject, start_time, end_time, priority):
        self.subject = subject
        self.start_time = start_time
        self.end_time = end_time
        self.priority = priority

# Example usage
sessions = [
    StudySession("Math", 1, 3, 5),
    StudySession("Science", 2, 5, 3),
    StudySession("History", 4, 6, 4),
    StudySession("English", 5, 7, 2)
]

optimal_schedule = schedule_study_sessions(sessions, 8)
print("Scheduled sessions:")
for session in optimal_schedule:
    print(f"- {session.subject}: {session.start_time}-{session.end_time}")
```

### StudyBuddy Example: Resource Allocation

```python
def allocate_study_resources(students, resources):
    """
    Allocate limited study resources (tutors, rooms, etc.) using greedy approach
    Prioritize by need and potential impact
    """
    # Calculate priority score for each student
    student_scores = []
    for student in students:
        # Greedy criteria: need (low grades) + potential (improvement history)
        need_score = (100 - student.current_grade) / 100
        potential_score = student.improvement_rate / 10
        priority = need_score * 0.7 + potential_score * 0.3
        student_scores.append((priority, student))
    
    # Sort by priority (greedy choice)
    student_scores.sort(reverse=True, key=lambda x: x[0])
    
    allocations = []
    available_resources = resources[:]
    
    for priority, student in student_scores:
        # Find best available resource for this student
        best_resource = None
        best_match = 0
        
        for resource in available_resources:
            # Calculate match score
            subject_match = len(set(student.struggling_subjects) & set(resource.specialties))
            match_score = subject_match / len(resource.specialties)
            
            if match_score > best_match:
                best_match = match_score
                best_resource = resource
        
        if best_resource and best_match > 0.3:  # Minimum match threshold
            allocations.append((student, best_resource))
            available_resources.remove(best_resource)
    
    return allocations
```

## Algorithm Pattern Recognition

### When to Use Each Technique

#### Recursion
- **Use when:** Problem can be broken into similar subproblems
- **Examples:** Tree traversal, factorial calculation, file system navigation
- **Watch out for:** Stack overflow, repeated calculations

#### Divide and Conquer
- **Use when:** Problem can be split into independent subproblems
- **Examples:** Sorting, searching, finding maximum/minimum
- **Advantage:** Often achieves O(n log n) complexity

#### Dynamic Programming
- **Use when:** Problem has optimal substructure and overlapping subproblems
- **Examples:** Optimization problems, sequence alignment, shortest paths
- **Key insight:** Trade memory for time by storing intermediate results

#### Backtracking
- **Use when:** Need to explore all possible solutions
- **Examples:** Puzzle solving, constraint satisfaction, pathfinding
- **Characteristic:** Systematically try possibilities and undo when stuck

#### Greedy Algorithms
- **Use when:** Locally optimal choices lead to global optimum
- **Examples:** Scheduling, minimum spanning tree, Huffman coding
- **Warning:** Not always correct - verify the greedy choice property

## Common Patterns in StudyBuddy

### Pattern 1: Tree Operations (Recursion)
```python
# Course prerequisite trees
# File/folder structures  
# Organization hierarchies
```

### Pattern 2: Optimal Selection (Dynamic Programming)
```python
# Best assignment schedule
# Resource allocation
# Learning path optimization
```

### Pattern 3: Constraint Satisfaction (Backtracking)
```python  
# Course scheduling
# Group formation
# Room assignments
```

### Pattern 4: Efficient Processing (Divide and Conquer)
```python
# Sorting large datasets
# Finding study partners
# Analyzing performance data
```

### Pattern 5: Resource Management (Greedy)
```python
# Session scheduling
# Priority queues
# Bandwidth allocation
```

## Performance Comparison

| Algorithm Type | Time Complexity | Space Complexity | Best Use Case |
|----------------|-----------------|------------------|---------------|
| Simple Recursion | O(2ⁿ) worst | O(n) | Small problems |
| Memoized Recursion | O(n) | O(n) | Overlapping subproblems |
| Divide & Conquer | O(n log n) | O(log n) | Large datasets |
| Dynamic Programming | O(n²) typical | O(n²) | Optimization |
| Backtracking | O(2ⁿ) worst | O(n) | Constraint problems |
| Greedy | O(n log n) | O(1) | Selection problems |

## Practice Problems

### Problem 1: Recursive File Size Calculator
Create a function that calculates the total size of all files in a directory structure (including subdirectories).

### Problem 2: Assignment Dependency Resolver  
Given assignments with prerequisites, determine a valid order to complete them all.

### Problem 3: Study Group Optimizer
Form study groups that maximize overall grade improvement potential while satisfying constraints.

### Problem 4: Optimal Exam Schedule
Schedule exams to minimize conflicts and maximize study time between related subjects.

## Debugging Structured Algorithms

### Common Issues

#### Infinite Recursion
```python
# Add proper base cases
# Ensure progress toward base case
# Consider iterative alternatives for deep recursion
```

#### Memory Issues with Dynamic Programming
```python
# Use space optimization techniques
# Consider bottom-up vs. top-down approaches
# Clear memoization caches when appropriate
```

#### Backtracking Performance
```python
# Add pruning conditions
# Order choices by likelihood of success
# Use constraint propagation
```

## Key Takeaways

✅ **Match patterns to problems** - Recognize which algorithmic approach fits best
✅ **Start simple** - Implement basic version first, then optimize
✅ **Handle edge cases** - Empty inputs, single elements, maximum sizes
✅ **Optimize for real data** - Consider typical input characteristics
✅ **Document complexity** - Make time/space trade-offs explicit
✅ **Test thoroughly** - Structured algorithms often have subtle bugs

/// details | Professional Algorithm Design 🏗️
    type: tip

**In industry practice:**
- **Design patterns first** - Choose the right algorithmic approach
- **Prototype quickly** - Test core logic before optimizing
- **Profile real usage** - Theoretical complexity vs. practical performance
- **Consider maintenance** - Complex algorithms need good documentation
- **Plan for scale** - Will your algorithm handle future growth?

///

## Next Steps

You've now mastered the fundamental concepts of algorithm design! Move on to [Module 5: Code Development](../05-CodeDevelopment/index.md) to learn how to implement these algorithms effectively in real programming languages.

---

*Remember: The best programmers are pattern recognizers. Master these algorithmic techniques and you'll see elegant solutions everywhere.*
