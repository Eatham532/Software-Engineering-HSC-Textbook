# Algorithm Analysis

## Introduction

Not all algorithms are created equal. Two algorithms might solve the same problem, but one could be dramatically faster or use significantly less memory. **Algorithm analysis** helps us understand and compare the efficiency of different approaches.

/// details | Why Algorithm Efficiency Matters 🚀
    type: important

**Real-world impact:**
- **Google Search**: Processes billions of queries in milliseconds
- **Netflix**: Recommends movies from 15,000+ titles instantly  
- **Instagram**: Loads your feed from millions of posts in seconds
- **StudyBuddy**: Must handle thousands of students without lag

Poor algorithms = frustrated users = failed products

///

## What We Measure

### Time Complexity
How execution time grows as input size increases.

### Space Complexity  
How memory usage grows as input size increases.

### Best, Average, and Worst Case
Different scenarios can produce different performance characteristics.

## Big O Notation

Big O describes the **upper bound** of algorithm performance - the worst-case scenario as input grows to infinity.

### Common Time Complexities

#### O(1) - Constant Time
Performance doesn't change regardless of input size.

**StudyBuddy Example:** Looking up a student's grade
```python
def get_student_grade(student_id):
    # Dictionary lookup is O(1)
    return grades[student_id]
```

**Why O(1)?** Hash table lookup takes the same time whether we have 10 students or 10,000.

#### O(log n) - Logarithmic Time
Performance grows slowly as input increases.

**StudyBuddy Example:** Finding a student in sorted list using binary search
```python
def find_student_binary_search(sorted_students, target_name):
    left, right = 0, len(sorted_students) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if sorted_students[mid].name == target_name:
            return sorted_students[mid]
        elif sorted_students[mid].name < target_name:
            left = mid + 1
        else:
            right = mid - 1
    
    return None
```

**Why O(log n)?** Each comparison eliminates half the remaining possibilities.

#### O(n) - Linear Time
Performance grows proportionally with input size.

**StudyBuddy Example:** Calculating class average
```python
def calculate_class_average(student_grades):
    total = 0
    for grade in student_grades:  # Must check every grade
        total += grade
    return total / len(student_grades)
```

**Why O(n)?** Must examine every student's grade exactly once.

#### O(n log n) - Linearithmic Time
Common in efficient sorting algorithms.

**StudyBuddy Example:** Sorting students by grade
```python
def sort_students_by_grade(students):
    # Python's built-in sort uses Timsort (O(n log n))
    return sorted(students, key=lambda s: s.grade)
```

**Why O(n log n)?** Must compare elements (n) and organize them efficiently (log n).

#### O(n²) - Quadratic Time
Performance degrades quickly with larger inputs.

**StudyBuddy Example:** Finding all student pairs for group projects
```python
def find_all_student_pairs(students):
    pairs = []
    for i in range(len(students)):
        for j in range(i + 1, len(students)):  # Nested loops = O(n²)
            pairs.append((students[i], students[j]))
    return pairs
```

**Why O(n²)?** For each student, we compare with every other student.

#### O(2ⁿ) - Exponential Time
Performance doubles with each additional input.

**StudyBuddy Example:** Generating all possible study schedules
```python
def generate_all_schedules(available_times):
    if not available_times:
        return [[]]
    
    schedules = []
    first_time = available_times[0]
    remaining_times = available_times[1:]
    
    # Include first time
    for schedule in generate_all_schedules(remaining_times):
        schedules.append([first_time] + schedule)
    
    # Exclude first time  
    for schedule in generate_all_schedules(remaining_times):
        schedules.append(schedule)
    
    return schedules
```

**Why O(2ⁿ)?** For each time slot, we have 2 choices: include it or not.

### Visual Comparison

```mermaid
graph LR
    A[Input Size] --> B[O(1)]
    A --> C[O(log n)]  
    A --> D[O(n)]
    A --> E[O(n log n)]
    A --> F[O(n²)]
    A --> G[O(2ⁿ)]
    
    B --> B1[Always fast]
    C --> C1[Scales well]
    D --> D1[Manageable growth]
    E --> E1[Good for sorting]
    F --> F1[Slow for large data]
    G --> G1[Avoid if possible]
    
    style B1 fill:#90EE90
    style C1 fill:#90EE90
    style D1 fill:#FFE135
    style E1 fill:#FFE135
    style F1 fill:#FF6B6B
    style G1 fill:#FF6B6B
```

## Analyzing StudyBuddy Features

### Feature 1: Assignment Search

#### Approach 1: Linear Search
```python
def find_assignment_linear(assignments, assignment_id):
    for assignment in assignments:
        if assignment.id == assignment_id:
            return assignment
    return None
```
**Time Complexity:** O(n)
**Space Complexity:** O(1)
**Best Case:** Assignment is first in list
**Worst Case:** Assignment is last in list or doesn't exist

#### Approach 2: Hash Table Lookup  
```python
def find_assignment_hash(assignment_dict, assignment_id):
    return assignment_dict.get(assignment_id)
```
**Time Complexity:** O(1) average case
**Space Complexity:** O(n) for the hash table
**Trade-off:** Uses more memory but much faster lookups

### Feature 2: Study Time Rankings

#### Approach 1: Sort Then Display
```python
def get_top_students(students):
    # Sort all students by study time
    sorted_students = sorted(students, key=lambda s: s.study_time, reverse=True)
    return sorted_students[:10]
```
**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

#### Approach 2: Min-Heap for Top K
```python
import heapq

def get_top_students_heap(students, k=10):
    # Only track top k students
    top_k = []
    for student in students:
        if len(top_k) < k:
            heapq.heappush(top_k, (student.study_time, student))
        elif student.study_time > top_k[0][0]:
            heapq.heapreplace(top_k, (student.study_time, student))
    
    return [student for _, student in sorted(top_k, reverse=True)]
```
**Time Complexity:** O(n log k)
**Space Complexity:** O(k)
**Advantage:** More efficient when k << n

### Feature 3: Friend Recommendations

#### Naive Approach: Compare Everyone
```python
def recommend_friends_naive(user, all_users):
    recommendations = []
    for other_user in all_users:
        if other_user != user:
            similarity = calculate_similarity(user, other_user)
            recommendations.append((similarity, other_user))
    
    return sorted(recommendations, reverse=True)[:5]
```
**Time Complexity:** O(n²) for similarity calculations + O(n log n) for sorting = O(n²)
**Problems:** Doesn't scale beyond a few thousand users

#### Optimized Approach: Interest-Based Filtering
```python
def recommend_friends_optimized(user, all_users):
    # Pre-filter by shared interests
    candidates = []
    for other_user in all_users:
        shared_interests = set(user.interests) & set(other_user.interests)
        if len(shared_interests) >= 2:  # Must share at least 2 interests
            candidates.append(other_user)
    
    # Only calculate similarity for promising candidates
    recommendations = []
    for candidate in candidates:
        similarity = calculate_similarity(user, candidate)
        recommendations.append((similarity, candidate))
    
    return sorted(recommendations, reverse=True)[:5]
```
**Time Complexity:** O(n) filtering + O(k log k) sorting where k << n
**Significant improvement** for real-world datasets

## Space Complexity Analysis

### Memory vs. Speed Trade-offs

#### StudyBuddy: Assignment Due Date Notifications

**Memory-Efficient Approach:**
```python
def check_due_dates_memory_efficient():
    # Check database each time
    for user in get_all_users():
        assignments = database.get_assignments(user.id)
        for assignment in assignments:
            if assignment.due_date == tomorrow:
                send_notification(user, assignment)
```
**Time:** O(n × m) where n = users, m = assignments per user
**Space:** O(1) - no storage
**Trade-off:** Slower but uses minimal memory

**Speed-Optimized Approach:**
```python
def check_due_dates_speed_optimized():
    # Cache all due dates in memory
    due_tomorrow = {}
    for user in get_all_users():
        due_tomorrow[user.id] = [
            a for a in user.assignments 
            if a.due_date == tomorrow
        ]
    
    # Fast notification sending
    for user_id, assignments in due_tomorrow.items():
        for assignment in assignments:
            send_notification(get_user(user_id), assignment)
```
**Time:** O(n × m) for caching + O(k) for notifications
**Space:** O(k) where k = assignments due tomorrow  
**Trade-off:** Faster notifications but uses more memory

## Practical Analysis Examples

### Example 1: Course Recommendation System

StudyBuddy needs to recommend courses based on student performance and interests.

#### Algorithm Options:

**Option A: Collaborative Filtering**
```
For each student:
    Find students with similar grades
    Recommend courses those students took
```
**Time:** O(n²) for similarity calculation
**Space:** O(n²) for similarity matrix
**Pros:** Very accurate recommendations
**Cons:** Slow with large user base

**Option B: Content-Based Filtering**
```
For each student:
    Analyze their high-performing subjects
    Find courses in similar categories
    Rank by relevance score
```
**Time:** O(n × c) where c = number of courses
**Space:** O(n × c) for user-course matrix
**Pros:** Scales better, explains recommendations
**Cons:** May miss surprising good matches

**Option C: Hybrid Approach**
```
Use content-based for new students (cold start)
Switch to collaborative filtering once enough data exists
Cache popular recommendations
```
**Time:** Depends on user history
**Space:** O(n × c) plus caching
**Pros:** Best of both worlds
**Cons:** More complex implementation

### Example 2: Real-time Study Session Matching

Students want to find study partners currently online.

#### Naive Approach:
```python
def find_study_partners(user):
    partners = []
    for other_user in get_online_users():
        if shares_subjects(user, other_user) and user != other_user:
            partners.append(other_user)
    return partners
```
**Problems:**
- O(n) for every request
- Database hit for each user
- No caching

#### Optimized Approach:
```python
class StudyPartnerMatcher:
    def __init__(self):
        self.online_by_subject = {}  # subject -> [users]
        self.user_subjects = {}      # user -> [subjects]
    
    def user_goes_online(self, user):
        for subject in user.subjects:
            if subject not in self.online_by_subject:
                self.online_by_subject[subject] = []
            self.online_by_subject[subject].append(user)
        self.user_subjects[user.id] = user.subjects
    
    def find_partners(self, user):
        candidates = set()
        for subject in user.subjects:
            candidates.update(self.online_by_subject.get(subject, []))
        candidates.discard(user)  # Remove self
        return list(candidates)
```

**Improvements:**
- Partner finding: O(s) where s = user's subjects
- Memory usage: O(u × s) where u = users, s = average subjects
- Real-time updates with minimal computation

## Optimization Strategies

### 1. Choose the Right Data Structure

| Operation | Array | Hash Table | Binary Tree |
|-----------|--------|------------|-------------|
| Search | O(n) | O(1) avg | O(log n) |
| Insert | O(1) end | O(1) avg | O(log n) |
| Delete | O(n) | O(1) avg | O(log n) |
| Sorted iteration | O(n log n) | N/A | O(n) |

### 2. Caching Strategies

**StudyBuddy Dashboard Loading:**
```python
class DashboardCache:
    def __init__(self):
        self.cache = {}
        self.cache_timeout = 300  # 5 minutes
    
    def get_dashboard_data(self, user_id):
        cache_key = f"dashboard_{user_id}"
        cached_data, timestamp = self.cache.get(cache_key, (None, 0))
        
        if cached_data and (time.time() - timestamp) < self.cache_timeout:
            return cached_data  # O(1) cache hit
        
        # O(n) database queries for cache miss
        dashboard_data = self.build_dashboard(user_id)
        self.cache[cache_key] = (dashboard_data, time.time())
        return dashboard_data
```

### 3. Lazy Loading

**Load assignment details only when needed:**
```python
class Assignment:
    def __init__(self, id, title, due_date):
        self.id = id
        self.title = title
        self.due_date = due_date
        self._detailed_content = None
    
    @property
    def detailed_content(self):
        if self._detailed_content is None:
            # Only load when accessed
            self._detailed_content = database.get_assignment_content(self.id)
        return self._detailed_content
```

### 4. Pagination

**Handle large result sets:**
```python
def get_assignments(user_id, page=1, per_page=20):
    offset = (page - 1) * per_page
    # Only load requested page
    assignments = database.query(
        "SELECT * FROM assignments WHERE user_id = ? LIMIT ? OFFSET ?",
        user_id, per_page, offset
    )
    return assignments
```

## Performance Testing

### Measuring Algorithm Performance

```python
import time
import random

def time_algorithm(algorithm, data, runs=100):
    """Measure average execution time"""
    times = []
    for _ in range(runs):
        start = time.perf_counter()
        algorithm(data)
        end = time.perf_counter()
        times.append(end - start)
    
    return {
        'average': sum(times) / len(times),
        'min': min(times),
        'max': max(times)
    }

# Test different search algorithms
linear_data = list(range(10000))
binary_data = sorted(linear_data)
target = 7500

print("Linear Search:", time_algorithm(
    lambda data: linear_search(data, target), 
    linear_data
))

print("Binary Search:", time_algorithm(
    lambda data: binary_search(data, target), 
    binary_data
))
```

### StudyBuddy Performance Benchmarks

| Feature | Current Algorithm | Time Complexity | Target Response Time |
|---------|------------------|-----------------|---------------------|
| User login | Hash table lookup | O(1) | < 100ms |
| Assignment search | Binary search | O(log n) | < 50ms |  
| Course recommendations | Hybrid filtering | O(n log n) | < 500ms |
| Study partner matching | Subject indexing | O(s) | < 200ms |
| Dashboard loading | Cached queries | O(1) cached, O(n) miss | < 300ms |

## Common Performance Pitfalls

### 1. N+1 Query Problem
```python
# BAD: One query per student
def get_students_with_assignments():
    students = database.get_all_students()  # 1 query
    for student in students:
        student.assignments = database.get_assignments(student.id)  # N queries
    return students

# GOOD: Single query with joins
def get_students_with_assignments_optimized():
    return database.query("""
        SELECT s.*, a.* 
        FROM students s 
        LEFT JOIN assignments a ON s.id = a.student_id
    """)
```

### 2. Unnecessary Sorting
```python
# BAD: Sort for every operation
def add_grade(student, grade):
    student.grades.append(grade)
    student.grades.sort()  # O(n log n) every time

# GOOD: Sort only when needed
def add_grade(student, grade):
    student.grades.append(grade)
    student.grades_sorted = False

def get_sorted_grades(student):
    if not student.grades_sorted:
        student.grades.sort()
        student.grades_sorted = True
    return student.grades
```

### 3. Memory Leaks in Caches
```python
# BAD: Cache grows forever
class BadCache:
    def __init__(self):
        self.cache = {}
    
    def get(self, key):
        if key not in self.cache:
            self.cache[key] = expensive_operation(key)
        return self.cache[key]

# GOOD: LRU cache with size limit
from functools import lru_cache

class GoodCache:
    @lru_cache(maxsize=1000)
    def get(self, key):
        return expensive_operation(key)
```

## Key Takeaways

✅ **Measure, don't guess** - Profile your code to find real bottlenecks
✅ **Choose appropriate complexity** - O(n²) might be fine for small datasets
✅ **Consider space-time trade-offs** - Sometimes using more memory saves time
✅ **Optimize hot paths first** - Focus on code that runs frequently
✅ **Cache wisely** - Balance memory usage with performance gains
✅ **Use the right data structures** - Arrays vs. hash tables vs. trees

/// details | Industry Reality Check 💼
    type: tip

**In professional development:**
- **Premature optimization is evil** - Make it work first, then make it fast
- **User experience trumps theoretical efficiency** - 300ms feels instant to users
- **Scalability planning matters** - Design for 10x your current user base
- **Monitor in production** - Algorithm performance changes with real data
- **Team readability vs. micro-optimizations** - Clear code is often more valuable

///

## Practice Problems

### Problem 1: Efficient Grade Book
Design algorithms for a grade book system that needs to:
- Add/remove students (how often?)
- Record grades (how often?)  
- Calculate class averages (how often?)
- Find top 10 students (how often?)
- Generate progress reports (how often?)

**Consider:** What operations happen most frequently? How should you optimize?

### Problem 2: Study Group Scheduler
Create an algorithm to find optimal study group meeting times:
- Input: Available times for each student
- Output: Best meeting times for maximum attendance
- Constraints: Groups of 3-6 students, 2-hour sessions

**Analyze:** What's the time complexity? Can you improve it?

## Next Steps

Now that you understand how to analyze and optimize algorithms, learn about [Structured Algorithms](structured-algorithms.md) to explore advanced programming techniques like recursion and dynamic programming.

---

*Remember: Fast algorithms enable great user experiences. Analyze early, optimize wisely, and always measure real-world performance.*
