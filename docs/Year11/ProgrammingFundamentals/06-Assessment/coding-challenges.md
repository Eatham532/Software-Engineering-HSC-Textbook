# Coding Challenges

## Introduction

**Coding challenges** are the gym workouts of programming - short, focused exercises that build your problem-solving muscles. They help you practice specific techniques, recognize patterns, and develop the mental agility needed for larger projects.

/// details | Why Coding Challenges Matter 💪
    type: important

**For Learning:**

- **Immediate feedback** - You know right away if your solution works
- **Pattern recognition** - Common problems appear in many contexts
- **Algorithmic thinking** - Learn to break problems into steps
- **Edge case awareness** - Discover scenarios you hadn't considered

**For Career Preparation:**

- **Technical interviews** - Most companies use coding challenges in hiring
- **Confidence building** - Regular practice makes you comfortable with problem-solving
- **Time management** - Learn to work efficiently under pressure
- **Communication skills** - Practice explaining your thought process

**For Professional Development:**

- **Problem decomposition** - Break complex problems into manageable pieces
- **Solution evaluation** - Compare different approaches and trade-offs
- **Code optimization** - Improve efficiency and readability
- **Testing mindset** - Think about edge cases and validation

///

## Challenge Categories

### 1. String Manipulation

/// details | String Challenge Examples 📝
    type: example

**Common Pattern: Text Processing**

```python
def is_palindrome(text):
    """
    Check if a string reads the same forwards and backwards.
    
    Examples:
    - "racecar" → True
    - "hello" → False
    - "A man a plan a canal Panama" → True (ignoring spaces/case)
    """
    # Remove spaces and convert to lowercase
    cleaned = ''.join(text.split()).lower()
    
    # Compare with reverse
    return cleaned == cleaned[::-1]

def count_word_frequency(text):
    """
    Count how many times each word appears in a text.
    
    Example:
    "the quick brown fox jumps over the lazy dog"
    → {"the": 2, "quick": 1, "brown": 1, ...}
    """
    words = text.lower().split()
    frequency = {}
    
    for word in words:
        # Remove punctuation
        word = word.strip('.,!?;:"')
        frequency[word] = frequency.get(word, 0) + 1
    
    return frequency

def find_anagrams(word_list):
    """
    Group words that are anagrams of each other.
    
    Example:
    ["eat", "tea", "tan", "ate", "nat", "bat"]
    → [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
    """
    anagram_groups = {}
    
    for word in word_list:
        # Sort letters to create a key
        key = ''.join(sorted(word.lower()))
        
        if key not in anagram_groups:
            anagram_groups[key] = []
        anagram_groups[key].append(word)
    
    # Return groups with more than one word
    return [group for group in anagram_groups.values() if len(group) > 1]
```

///

### 2. Array and List Operations

/// details | Array Challenge Examples 📊
    type: example

**Common Pattern: Data Analysis**

```python
def find_two_sum(numbers, target):
    """
    Find two numbers in array that add up to target.
    
    Example:
    numbers = [2, 7, 11, 15], target = 9
    → [0, 1] (because numbers[0] + numbers[1] = 2 + 7 = 9)
    """
    seen = {}  # value -> index
    
    for i, num in enumerate(numbers):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []  # No solution found

def rotate_array(arr, k):
    """
    Rotate array to the right by k steps.
    
    Example:
    [1,2,3,4,5,6,7], k=3 → [5,6,7,1,2,3,4]
    """
    if not arr or k == 0:
        return arr
    
    n = len(arr)
    k = k % n  # Handle k > n
    
    # Reverse entire array
    arr.reverse()
    # Reverse first k elements
    arr[:k] = reversed(arr[:k])
    # Reverse remaining elements
    arr[k:] = reversed(arr[k:])
    
    return arr

def find_missing_number(nums):
    """
    Find the missing number in array of 0 to n.
    
    Example:
    [3,0,1] → 2 (missing number in range 0-3)
    """
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    
    return expected_sum - actual_sum
```

///

### 3. Mathematical Problems

/// details | Math Challenge Examples 🔢
    type: example

**Common Pattern: Number Theory**

```python
def fibonacci_sequence(n):
    """
    Generate first n numbers in Fibonacci sequence.
    
    Example:
    fibonacci_sequence(8) → [0, 1, 1, 2, 3, 5, 8, 13]
    """
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

def is_prime(n):
    """
    Check if a number is prime.
    
    Example:
    is_prime(17) → True
    is_prime(15) → False
    """
    if n < 2:
        return False
    
    # Check divisibility up to sqrt(n)
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    
    return True

def greatest_common_divisor(a, b):
    """
    Find GCD of two numbers using Euclidean algorithm.
    
    Example:
    greatest_common_divisor(48, 18) → 6
    """
    while b:
        a, b = b, a % b
    return a

def binary_to_decimal(binary_string):
    """
    Convert binary string to decimal number.
    
    Example:
    binary_to_decimal("1010") → 10
    """
    decimal = 0
    power = 0
    
    # Process from right to left
    for digit in reversed(binary_string):
        if digit == '1':
            decimal += 2 ** power
        power += 1
    
    return decimal
```

///

### 4. Data Structure Implementation

/// details | Data Structure Challenge Examples 🏗️
    type: example

**Common Pattern: Custom Collections**

```python
class Stack:
    """
    Implement a stack (LIFO) using a list.
    
    Operations: push, pop, peek, is_empty, size
    """
    
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """Add item to top of stack"""
        self.items.append(item)
    
    def pop(self):
        """Remove and return top item"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items.pop()
    
    def peek(self):
        """Return top item without removing"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items[-1]
    
    def is_empty(self):
        """Check if stack is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return number of items in stack"""
        return len(self.items)

class Queue:
    """
    Implement a queue (FIFO) using a list.
    
    Operations: enqueue, dequeue, front, is_empty, size
    """
    
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        """Add item to rear of queue"""
        self.items.append(item)
    
    def dequeue(self):
        """Remove and return front item"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items.pop(0)
    
    def front(self):
        """Return front item without removing"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[0]
    
    def is_empty(self):
        """Check if queue is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return number of items in queue"""
        return len(self.items)

class LinkedListNode:
    """
    Node for a singly linked list.
    """
    
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    """
    Implement a singly linked list.
    
    Operations: append, prepend, delete, find, size
    """
    
    def __init__(self):
        self.head = None
    
    def append(self, data):
        """Add item to end of list"""
        new_node = LinkedListNode(data)
        
        if not self.head:
            self.head = new_node
            return
        
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def prepend(self, data):
        """Add item to beginning of list"""
        new_node = LinkedListNode(data)
        new_node.next = self.head
        self.head = new_node
    
    def delete(self, data):
        """Remove first occurrence of data"""
        if not self.head:
            return False
        
        if self.head.data == data:
            self.head = self.head.next
            return True
        
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return True
            current = current.next
        
        return False
    
    def find(self, data):
        """Check if data exists in list"""
        current = self.head
        while current:
            if current.data == data:
                return True
            current = current.next
        return False
    
    def to_list(self):
        """Convert to Python list for easy testing"""
        result = []
        current = self.head
        while current:
            result.append(current.data)
            current = current.next
        return result
```

///

## StudyBuddy Challenge Series

### Challenge 1: Grade Analysis System

/// details | Grade Analysis Challenge 📊
    type: example

**Problem Statement:**

Create a comprehensive grade analysis system for StudyBuddy that can:

1. Calculate various statistical measures for student grades
2. Identify trends and patterns in academic performance
3. Generate insights for teachers and students

**Requirements:**

```python
class GradeAnalyzer:
    """
    Analyze student grades and provide insights.
    """
    
    def __init__(self):
        self.students = {}  # student_id -> list of grades
    
    def add_student_grade(self, student_id, assignment, grade, max_points):
        """Add a grade for a student"""
        pass  # Your implementation here
    
    def calculate_student_average(self, student_id):
        """Calculate weighted average for a student"""
        pass  # Your implementation here
    
    def find_class_statistics(self):
        """Return dict with class mean, median, mode, std_dev"""
        pass  # Your implementation here
    
    def identify_struggling_students(self, threshold=70):
        """Return list of students below threshold"""
        pass  # Your implementation here
    
    def get_grade_distribution(self):
        """Return count of A, B, C, D, F grades"""
        pass  # Your implementation here
    
    def predict_final_grade(self, student_id):
        """Predict final grade based on current trend"""
        pass  # Your implementation here

# Example usage and expected output:
analyzer = GradeAnalyzer()

# Add some test data
analyzer.add_student_grade("S001", "Quiz 1", 85, 100)
analyzer.add_student_grade("S001", "Assignment 1", 42, 50)
analyzer.add_student_grade("S002", "Quiz 1", 92, 100)
analyzer.add_student_grade("S002", "Assignment 1", 38, 50)

# Test your implementation
print(analyzer.calculate_student_average("S001"))  # Should consider weighting
print(analyzer.find_class_statistics())  # Mean, median, etc.
print(analyzer.get_grade_distribution())  # Grade counts
```

**Bonus Challenges:**

- Handle missing assignments (count as 0 or exclude?)
- Implement grade curve adjustment
- Add trend analysis (improving vs declining)
- Create visualization data for charts

///

### Challenge 2: Study Schedule Optimizer

/// details | Schedule Optimizer Challenge 📅
    type: example

**Problem Statement:**

Build a smart study scheduler that helps students optimize their study time based on:

- Assignment due dates and priorities
- Estimated time requirements
- Student's available time slots
- Learning efficiency patterns

**Requirements:**

```python
from datetime import datetime, timedelta

class Assignment:
    def __init__(self, name, due_date, estimated_hours, priority, subject):
        self.name = name
        self.due_date = due_date  # datetime object
        self.estimated_hours = estimated_hours
        self.priority = priority  # 1-5, 5 being highest
        self.subject = subject
        self.completed_hours = 0

class StudyScheduleOptimizer:
    """
    Create optimal study schedules for students.
    """
    
    def __init__(self):
        self.assignments = []
        self.available_slots = []  # list of (start_time, end_time) tuples
    
    def add_assignment(self, assignment):
        """Add assignment to schedule"""
        pass  # Your implementation here
    
    def add_available_time(self, start_time, end_time):
        """Add available study time slot"""
        pass  # Your implementation here
    
    def calculate_urgency_score(self, assignment):
        """Calculate urgency based on due date and priority"""
        pass  # Your implementation here
    
    def generate_optimal_schedule(self):
        """Return optimized study schedule"""
        # Should return list of (assignment, start_time, duration) tuples
        pass  # Your implementation here
    
    def detect_schedule_conflicts(self):
        """Identify impossible schedules (not enough time)"""
        pass  # Your implementation here
    
    def suggest_time_extensions(self):
        """Suggest additional study time needed"""
        pass  # Your implementation here

# Example usage:
scheduler = StudyScheduleOptimizer()

# Add assignments
math_hw = Assignment("Math Homework", datetime(2024, 3, 20), 2, 4, "Mathematics")
essay = Assignment("English Essay", datetime(2024, 3, 18), 4, 5, "English")
scheduler.add_assignment(math_hw)
scheduler.add_assignment(essay)

# Add available time (e.g., 2-hour study blocks)
scheduler.add_available_time(datetime(2024, 3, 15, 19, 0), datetime(2024, 3, 15, 21, 0))
scheduler.add_available_time(datetime(2024, 3, 16, 15, 0), datetime(2024, 3, 16, 18, 0))

# Generate schedule
schedule = scheduler.generate_optimal_schedule()
print("Optimal Schedule:")
for assignment, start_time, duration in schedule:
    print(f"{assignment.name}: {start_time} for {duration} hours")
```

**Bonus Challenges:**

- Account for different subjects needing breaks between them
- Implement "cramming penalty" for last-minute studying
- Add support for recurring assignments
- Consider student's chronotype (morning person vs night owl)

///

### Challenge 3: Student Performance Predictor

/// details | Performance Predictor Challenge 🔮
    type: example

**Problem Statement:**

Create a system that predicts student performance based on historical data and current patterns. This involves pattern recognition, trend analysis, and simple machine learning concepts.

**Requirements:**

```python
class StudentPerformancePredictor:
    """
    Predict student academic performance based on patterns.
    """
    
    def __init__(self):
        self.student_data = {}  # student_id -> performance history
        self.patterns = {}  # discovered patterns
    
    def add_performance_data(self, student_id, week, study_hours, assignment_scores, quiz_scores, attendance):
        """Add weekly performance data for a student"""
        pass  # Your implementation here
    
    def calculate_trend(self, student_id, metric):
        """Calculate trend (improving, declining, stable) for specific metric"""
        pass  # Your implementation here
    
    def find_correlation(self, metric1, metric2):
        """Find correlation between two metrics (study_hours vs grades, etc.)"""
        pass  # Your implementation here
    
    def predict_next_grade(self, student_id):
        """Predict student's next assignment grade"""
        pass  # Your implementation here
    
    def identify_risk_factors(self, student_id):
        """Identify factors that might lead to poor performance"""
        pass  # Your implementation here
    
    def suggest_interventions(self, student_id):
        """Suggest specific actions to improve performance"""
        pass  # Your implementation here
    
    def compare_students(self, student_id1, student_id2):
        """Compare performance patterns between students"""
        pass  # Your implementation here

# Example usage:
predictor = StudentPerformancePredictor()

# Add historical data
predictor.add_performance_data("S001", 1, study_hours=10, assignment_scores=[85, 78], quiz_scores=[82], attendance=100)
predictor.add_performance_data("S001", 2, study_hours=8, assignment_scores=[80, 75], quiz_scores=[79], attendance=95)
predictor.add_performance_data("S001", 3, study_hours=6, assignment_scores=[72, 70], quiz_scores=[74], attendance=90)

# Analyze patterns
trend = predictor.calculate_trend("S001", "assignment_scores")
print(f"Grade trend: {trend}")  # Should show "declining"

correlation = predictor.find_correlation("study_hours", "assignment_scores")
print(f"Study hours vs grades correlation: {correlation}")

prediction = predictor.predict_next_grade("S001")
print(f"Predicted next grade: {prediction}")

risks = predictor.identify_risk_factors("S001")
print(f"Risk factors: {risks}")  # e.g., ["decreasing study time", "declining attendance"]
```

**Bonus Challenges:**

- Implement different prediction algorithms (linear regression, weighted average, etc.)
- Add confidence intervals to predictions
- Account for external factors (exam periods, holidays, etc.)
- Create early warning system for academic difficulty

///

## Progressive Difficulty Challenges

### Beginner Level (Week 1-2)

/// details | Beginner Challenges 🌱
    type: note

**Challenge B1: Basic Calculator**

```python
def calculate(expression):
    """
    Evaluate simple math expressions.
    
    Examples:
    "2 + 3" → 5
    "10 - 4" → 6
    "5 * 6" → 30
    "15 / 3" → 5
    """
    pass  # Your implementation

def test_calculator():
    assert calculate("2 + 3") == 5
    assert calculate("10 - 4") == 6
    assert calculate("5 * 6") == 30
    assert calculate("15 / 3") == 5
    print("All tests passed!")
```

**Challenge B2: Text Processor**

```python
def clean_text(text):
    """
    Clean and normalize text for processing.
    
    - Remove extra whitespace
    - Convert to lowercase
    - Remove punctuation
    - Return list of words
    """
    pass  # Your implementation

def count_unique_words(text):
    """Count unique words in text."""
    pass  # Your implementation

def find_longest_word(text):
    """Find the longest word in text."""
    pass  # Your implementation
```

**Challenge B3: List Operations**

```python
def merge_sorted_lists(list1, list2):
    """Merge two sorted lists into one sorted list."""
    pass  # Your implementation

def remove_duplicates(numbers):
    """Remove duplicates from list while preserving order."""
    pass  # Your implementation

def find_second_largest(numbers):
    """Find second largest number in list."""
    pass  # Your implementation
```

///

### Intermediate Level (Week 3-4)

/// details | Intermediate Challenges 🚀
    type: note

**Challenge I1: Data Analysis**

```python
def analyze_sales_data(sales_records):
    """
    Analyze sales data and return insights.
    
    sales_records = [
        {"date": "2024-01-01", "product": "Widget A", "amount": 150, "quantity": 3},
        {"date": "2024-01-02", "product": "Widget B", "amount": 200, "quantity": 2},
        # ... more records
    ]
    
    Return dict with:
    - total_revenue
    - best_selling_product
    - average_sale_amount
    - sales_by_month
    """
    pass  # Your implementation
```

**Challenge I2: File System Simulator**

```python
class FileSystemSimulator:
    """
    Simulate basic file system operations.
    """
    
    def __init__(self):
        self.current_dir = "/"
        self.file_system = {"/": {"type": "directory", "contents": {}}}
    
    def create_directory(self, path):
        """Create a new directory."""
        pass
    
    def create_file(self, path, content=""):
        """Create a new file."""
        pass
    
    def list_contents(self, path=None):
        """List contents of directory."""
        pass
    
    def change_directory(self, path):
        """Change current directory."""
        pass
    
    def delete(self, path):
        """Delete file or directory."""
        pass
```

**Challenge I3: Algorithm Implementation**

```python
def quicksort(arr):
    """Implement quicksort algorithm."""
    pass  # Your implementation

def binary_search(sorted_arr, target):
    """Implement binary search algorithm."""
    pass  # Your implementation

def dijkstra_shortest_path(graph, start, end):
    """Find shortest path in weighted graph."""
    pass  # Your implementation
```

///

### Advanced Level (Week 5-6)

/// details | Advanced Challenges 🎯
    type: note

**Challenge A1: Mini Database**

```python
class MiniDatabase:
    """
    Implement a simple in-memory database with SQL-like operations.
    """
    
    def __init__(self):
        self.tables = {}
    
    def create_table(self, table_name, columns):
        """Create table with specified columns."""
        pass
    
    def insert(self, table_name, data):
        """Insert row into table."""
        pass
    
    def select(self, table_name, conditions=None, columns=None):
        """Select rows from table with optional conditions."""
        pass
    
    def update(self, table_name, conditions, updates):
        """Update rows in table."""
        pass
    
    def delete(self, table_name, conditions):
        """Delete rows from table."""
        pass
    
    def join(self, table1, table2, join_column):
        """Join two tables on specified column."""
        pass
```

**Challenge A2: Expression Evaluator**

```python
def evaluate_expression(expression):
    """
    Evaluate complex mathematical expressions with parentheses.
    
    Examples:
    "2 + 3 * 4" → 14
    "(2 + 3) * 4" → 20
    "2 ** 3 + 1" → 9
    "sin(30) + cos(60)" → 1.0
    """
    pass  # Your implementation

def parse_expression_to_tree(expression):
    """Parse expression into binary tree structure."""
    pass  # Your implementation
```

**Challenge A3: Web Scraper Framework**

```python
class WebScraperFramework:
    """
    Framework for building web scrapers with rate limiting and caching.
    """
    
    def __init__(self, rate_limit=1.0):
        self.rate_limit = rate_limit  # seconds between requests
        self.cache = {}
        self.last_request_time = 0
    
    def fetch_url(self, url):
        """Fetch URL content with rate limiting."""
        pass
    
    def parse_html(self, html_content, selectors):
        """Parse HTML and extract data using CSS selectors."""
        pass
    
    def save_data(self, data, filename, format="json"):
        """Save scraped data to file."""
        pass
    
    def build_scraping_pipeline(self, urls, selectors, output_file):
        """Build complete scraping pipeline."""
        pass
```

///

## Challenge Testing Framework

### Creating Test Cases

/// details | Test-Driven Challenge Approach 🧪
    type: info

**Example: Testing Your Solutions**

```python
import unittest
from datetime import datetime, timedelta

class TestCodingChallenges(unittest.TestCase):
    """
    Comprehensive test suite for coding challenges.
    """
    
    def setUp(self):
        """Set up test fixtures before each test."""
        self.sample_grades = [85, 92, 78, 88, 95, 73, 89]
        self.sample_text = "The quick brown fox jumps over the lazy dog"
        self.sample_array = [3, 1, 4, 1, 5, 9, 2, 6, 5]
    
    def test_palindrome_checker(self):
        """Test palindrome detection function."""
        self.assertTrue(is_palindrome("racecar"))
        self.assertTrue(is_palindrome("A man a plan a canal Panama"))
        self.assertFalse(is_palindrome("hello"))
        self.assertTrue(is_palindrome(""))  # Edge case: empty string
        self.assertTrue(is_palindrome("a"))  # Edge case: single character
    
    def test_two_sum_solution(self):
        """Test two sum algorithm."""
        result = find_two_sum([2, 7, 11, 15], 9)
        self.assertEqual(result, [0, 1])
        
        result = find_two_sum([3, 2, 4], 6)
        self.assertEqual(result, [1, 2])
        
        result = find_two_sum([1, 2, 3], 7)
        self.assertEqual(result, [])  # No solution
    
    def test_grade_analyzer(self):
        """Test grade analysis system."""
        analyzer = GradeAnalyzer()
        analyzer.add_student_grade("S001", "Quiz 1", 85, 100)
        analyzer.add_student_grade("S001", "Assignment 1", 42, 50)
        
        avg = analyzer.calculate_student_average("S001")
        self.assertAlmostEqual(avg, 84.67, places=2)  # Weighted average
        
        stats = analyzer.find_class_statistics()
        self.assertIn('mean', stats)
        self.assertIn('median', stats)
        self.assertIn('std_dev', stats)
    
    def test_data_structures(self):
        """Test custom data structure implementations."""
        # Test Stack
        stack = Stack()
        self.assertTrue(stack.is_empty())
        
        stack.push(1)
        stack.push(2)
        stack.push(3)
        
        self.assertEqual(stack.size(), 3)
        self.assertEqual(stack.peek(), 3)
        self.assertEqual(stack.pop(), 3)
        self.assertEqual(stack.size(), 2)
        
        # Test Queue
        queue = Queue()
        queue.enqueue(1)
        queue.enqueue(2)
        queue.enqueue(3)
        
        self.assertEqual(queue.front(), 1)
        self.assertEqual(queue.dequeue(), 1)
        self.assertEqual(queue.size(), 2)
    
    def test_performance_requirements(self):
        """Test that solutions meet performance requirements."""
        import time
        
        # Test with large dataset
        large_array = list(range(10000))
        
        start_time = time.time()
        result = binary_search(large_array, 5000)
        end_time = time.time()
        
        # Should complete in under 1ms for binary search
        self.assertLess(end_time - start_time, 0.001)
        self.assertEqual(result, 5000)

# Run tests
if __name__ == '__main__':
    unittest.main()
```

**Custom Test Runner:**

```python
def run_challenge_tests(solution_function, test_cases):
    """
    Generic test runner for coding challenges.
    
    Args:
        solution_function: The function to test
        test_cases: List of (input, expected_output) tuples
    """
    passed = 0
    failed = 0
    
    print(f"Testing {solution_function.__name__}...")
    print("-" * 40)
    
    for i, (input_data, expected) in enumerate(test_cases):
        try:
            if isinstance(input_data, tuple):
                result = solution_function(*input_data)
            else:
                result = solution_function(input_data)
            
            if result == expected:
                print(f"✅ Test {i+1}: PASSED")
                passed += 1
            else:
                print(f"❌ Test {i+1}: FAILED")
                print(f"   Input: {input_data}")
                print(f"   Expected: {expected}")
                print(f"   Got: {result}")
                failed += 1
                
        except Exception as e:
            print(f"💥 Test {i+1}: ERROR - {str(e)}")
            failed += 1
    
    print("-" * 40)
    print(f"Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed!")
    else:
        print(f"📚 {failed} tests need attention")
    
    return failed == 0

# Example usage:
test_cases = [
    ("racecar", True),
    ("hello", False),
    ("A man a plan a canal Panama", True),
    ("", True),
]

run_challenge_tests(is_palindrome, test_cases)
```

///

## Challenge Completion Tracking

### Progress Monitoring

/// details | Track Your Progress 📈
    type: tip

**Create a Challenge Log:**

```python
class ChallengeTracker:
    """
    Track your coding challenge progress.
    """
    
    def __init__(self):
        self.challenges = {}
        self.daily_stats = {}
    
    def start_challenge(self, challenge_name, difficulty, estimated_time):
        """Record when you start a challenge."""
        self.challenges[challenge_name] = {
            'difficulty': difficulty,
            'estimated_time': estimated_time,
            'start_time': datetime.now(),
            'status': 'in_progress',
            'attempts': 0,
            'solutions': []
        }
    
    def submit_solution(self, challenge_name, solution_code, test_results):
        """Record a solution attempt."""
        if challenge_name in self.challenges:
            self.challenges[challenge_name]['attempts'] += 1
            self.challenges[challenge_name]['solutions'].append({
                'code': solution_code,
                'test_results': test_results,
                'timestamp': datetime.now()
            })
    
    def complete_challenge(self, challenge_name, final_solution):
        """Mark challenge as completed."""
        if challenge_name in self.challenges:
            challenge = self.challenges[challenge_name]
            challenge['status'] = 'completed'
            challenge['completion_time'] = datetime.now()
            challenge['final_solution'] = final_solution
            
            # Calculate actual time taken
            time_taken = challenge['completion_time'] - challenge['start_time']
            challenge['actual_time'] = time_taken
    
    def get_progress_report(self):
        """Generate progress summary."""
        total = len(self.challenges)
        completed = sum(1 for c in self.challenges.values() if c['status'] == 'completed')
        in_progress = sum(1 for c in self.challenges.values() if c['status'] == 'in_progress')
        
        return {
            'total_challenges': total,
            'completed': completed,
            'in_progress': in_progress,
            'completion_rate': completed / total if total > 0 else 0,
            'average_attempts': sum(c['attempts'] for c in self.challenges.values()) / total if total > 0 else 0
        }
    
    def identify_weak_areas(self):
        """Identify challenge types that need more practice."""
        difficulty_stats = {}
        
        for challenge in self.challenges.values():
            difficulty = challenge['difficulty']
            if difficulty not in difficulty_stats:
                difficulty_stats[difficulty] = {'attempted': 0, 'completed': 0}
            
            difficulty_stats[difficulty]['attempted'] += 1
            if challenge['status'] == 'completed':
                difficulty_stats[difficulty]['completed'] += 1
        
        # Calculate success rates
        weak_areas = []
        for difficulty, stats in difficulty_stats.items():
            success_rate = stats['completed'] / stats['attempted'] if stats['attempted'] > 0 else 0
            if success_rate < 0.7:  # Less than 70% success rate
                weak_areas.append((difficulty, success_rate))
        
        return weak_areas

# Example usage:
tracker = ChallengeTracker()

tracker.start_challenge("Two Sum", "Easy", timedelta(minutes=30))
tracker.submit_solution("Two Sum", "# My first attempt...", {'passed': 5, 'failed': 2})
tracker.submit_solution("Two Sum", "# My improved solution...", {'passed': 7, 'failed': 0})
tracker.complete_challenge("Two Sum", "# Final optimized solution...")

report = tracker.get_progress_report()
print(f"Completion rate: {report['completion_rate']:.2%}")

weak_areas = tracker.identify_weak_areas()
if weak_areas:
    print("Areas needing more practice:")
    for area, rate in weak_areas:
        print(f"  {area}: {rate:.2%} success rate")
```

///

## Next Steps

Ready to start coding? Here's your challenge roadmap:

1. **Start with Beginner challenges** - Build confidence with basic problems
2. **Practice daily** - Spend 15-30 minutes on challenges each day
3. **Track your progress** - Use the challenge tracker or a simple log
4. **Join online platforms** - Try LeetCode, HackerRank, or Codewars
5. **Share your solutions** - Get feedback from peers and instructors
6. **Reflect on patterns** - Notice which types of problems you find easiest/hardest

/// details | Challenge Success Tips 🏆
    type: tip

**Before You Start:**

- **Read the problem carefully** - Understand exactly what's being asked
- **Work through examples** - Trace through the expected inputs and outputs
- **Plan your approach** - Sketch out your algorithm before coding
- **Consider edge cases** - What unusual inputs might break your solution?

**While Coding:**

- **Start simple** - Get a basic solution working first, optimize later
- **Test frequently** - Run your code on simple inputs as you develop
- **Use descriptive names** - Your future self will thank you
- **Add comments** - Explain your reasoning, especially for complex parts

**After Completion:**

- **Review other solutions** - Learn different approaches from the community
- **Optimize if needed** - Can you make it faster or use less memory?
- **Document your learning** - Write about new patterns or techniques you discovered
- **Plan your next challenge** - Keep building on what you've learned

**When You're Stuck:**

- **Take a break** - Sometimes stepping away helps you see the solution
- **Break down the problem** - Solve smaller parts first
- **Draw it out** - Visual representations often clarify logic
- **Ask for hints** - Don't suffer alone - seek help from peers or instructors

///

---

*Remember: Coding challenges are not about being perfect on the first try - they're about building problem-solving skills, recognizing patterns, and developing the confidence to tackle any programming problem that comes your way!*
