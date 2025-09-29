# Section 6.7: Code Optimisation and Assessing Effectiveness

## Learning Objectives

By the end of this section, you will be able to:

- Assess code effectiveness across four key dimensions: correctness, clarity, performance, and maintainability

- Apply basic optimization techniques including algorithm improvements and appropriate data structure selection

- Use simple profiling techniques to identify performance bottlenecks

- Understand the principle of avoiding premature optimization

- Make informed trade-offs between code readability and performance optimizations

- Evaluate when optimization is necessary and when it should be avoided

- Apply optimization techniques specifically to object-oriented Python code

## Introduction

Writing code that works is just the beginning. Professional software development requires assessing and improving code effectiveness across multiple dimensions. **Code effectiveness** encompasses not just whether the code produces correct results, but also how clearly it communicates intent, how efficiently it performs, and how easily it can be maintained and modified.

This section focuses on practical techniques for evaluating and improving code quality in object-oriented systems, with emphasis on making intelligent optimization decisions that enhance rather than compromise overall code quality.

## The Four Dimensions of Code Effectiveness

### 1. Correctness

**Definition**: The code produces the expected results for all valid inputs and handles invalid inputs appropriately.

**Assessment criteria:**

- Produces correct output for all test cases

- Handles edge cases and boundary conditions properly

- Manages errors and exceptions appropriately

- Maintains data integrity and object invariants

**Example: Assessing Correctness**

```python
class BankAccount:
    """Bank account with correctness issues to identify."""
    
    def __init__(self, account_holder, initial_balance=0):
        self.account_holder = account_holder
        self.balance = initial_balance  # Issue: doesn't validate negative balance
        self.transaction_history = []
    
    def withdraw(self, amount):
        """Withdraw money from account."""
        if amount > 0:  # Issue: doesn't check if amount > balance
            self.balance -= amount
            self.transaction_history.append(f"Withdrawal: ${amount}")
            return self.balance
        return False

```


## Improved version with better correctness

class ImprovedBankAccount:
    """Bank account with improved correctness."""
    
    def __init__(self, account_holder, initial_balance=0):
        if initial_balance < 0:
            raise ValueError("Initial balance cannot be negative")
        
        self.account_holder = account_holder
        self.balance = initial_balance
        self.transaction_history = []
    
    def withdraw(self, amount):
        """
        Withdraw money from account.
        
        Args:
            amount (float): Amount to withdraw (must be positive)
            
        Returns:
            float: New balance after withdrawal
            
        Raises:
            ValueError: If amount is invalid or insufficient funds
        """
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        
        self.balance -= amount
        self.transaction_history.append(f"Withdrawal: ${amount:.2f}")
        return self.balance

```

### 2. Clarity

**Definition**: The code clearly expresses its intent and is easy to understand by other developers.

**Assessment criteria:**

- Descriptive variable and method names

- Clear code structure and organization

- Appropriate comments and documentation

- Consistent formatting and style

**Example: Improving Code Clarity**

```python

## Poor clarity

class C:
    def __init__(self, d):
        self.d = d
        self.r = []
    
    def p(self, x, y):

        ## Calculate something

        z = 0
        for i in self.d:
            if i['t'] == x:
                z += i['a'] * y
        self.r.append(z)
        return z


## Improved clarity

class OrderCalculator:
    """Calculates order totals based on product catalog and quantities."""
    
    def __init__(self, product_catalog):
        """
        Initialize calculator with product catalog.
        
        Args:
            product_catalog (list): List of product dictionaries with 'type' and 'amount'
        """
        self.product_catalog = product_catalog
        self.calculation_history = []
    
    def calculate_total_for_product_type(self, product_type, quantity):
        """
        Calculate total cost for a specific product type and quantity.
        
        Args:
            product_type (str): Type of product to calculate for
            quantity (int): Number of items to calculate
            
        Returns:
            float: Total cost for the product type and quantity
        """
        total_cost = 0
        
        ## Find all products matching the specified type

        for product in self.product_catalog:
            if product['type'] == product_type:
                total_cost += product['amount'] * quantity
        
        ## Store calculation for audit trail

        self.calculation_history.append({
            'product_type': product_type,
            'quantity': quantity,
            'total_cost': total_cost
        })
        
        return total_cost

```

### 3. Performance

**Definition**: The code executes efficiently in terms of time and space complexity.

**Assessment criteria:**

- Appropriate algorithm complexity (Big O notation)

- Efficient use of data structures

- Minimal unnecessary computations

- Reasonable memory usage

**Example: Performance Assessment and Improvement**

```python

import time
from typing import List

class StudentManager:
    """Manages student records with performance considerations."""
    
    def __init__(self):
        self.students = []  # List for simple implementation
    
    def add_student(self, student_id: str, name: str, email: str):
        """Add a new student."""
        student = {
            'id': student_id,
            'name': name,
            'email': email,
            'grades': []
        }
        self.students.append(student)
    
    def find_student_slow(self, student_id: str):
        """Find student by ID - O(n) linear search."""
        for student in self.students:
            if student['id'] == student_id:
                return student
        return None
    
    def get_all_students_with_high_gpa_slow(self, min_gpa: float):
        """Get students with high GPA - inefficient implementation."""
        high_gpa_students = []
        
        for student in self.students:
            if student['grades']:

                ## Recalculate GPA every time (inefficient)

                total = sum(student['grades'])
                avg = total / len(student['grades'])
                if avg >= min_gpa:
                    high_gpa_students.append(student)
        
        return high_gpa_students


class OptimizedStudentManager:
    """Student manager with performance optimizations."""
    
    def __init__(self):
        self.students = {}  # Dictionary for O(1) lookup
        self.students_by_gpa = []  # Could be maintained sorted
        self._gpa_cache = {}  # Cache calculated GPAs
    
    def add_student(self, student_id: str, name: str, email: str):
        """Add a new student with optimized storage."""
        student = {
            'id': student_id,
            'name': name,
            'email': email,
            'grades': []
        }
        self.students[student_id] = student  # O(1) insertion
    
    def find_student(self, student_id: str):
        """Find student by ID - O(1) hash table lookup."""
        return self.students.get(student_id)
    
    def _calculate_gpa(self, student_id: str):
        """Calculate and cache GPA for a student."""
        if student_id in self._gpa_cache:
            return self._gpa_cache[student_id]
        
        student = self.students[student_id]
        if not student['grades']:
            gpa = 0.0
        else:
            gpa = sum(student['grades']) / len(student['grades'])
        
        self._gpa_cache[student_id] = gpa
        return gpa
    
    def add_grade(self, student_id: str, grade: float):
        """Add grade and invalidate GPA cache."""
        if student_id in self.students:
            self.students[student_id]['grades'].append(grade)

            ## Invalidate cached GPA since grades changed

            self._gpa_cache.pop(student_id, None)
    
    def get_students_with_high_gpa(self, min_gpa: float):
        """Get students with high GPA - optimized with caching."""
        high_gpa_students = []
        
        for student_id, student in self.students.items():
            if student['grades']:  # Only check students with grades
                gpa = self._calculate_gpa(student_id)
                if gpa >= min_gpa:
                    high_gpa_students.append(student)
        
        return high_gpa_students


def performance_comparison():
    """Demonstrate performance difference between implementations."""
    import random
    
    ## Create test data

    slow_manager = StudentManager()
    fast_manager = OptimizedStudentManager()
    
    ## Add 10,000 students

    for i in range(10000):
        student_id = f"S{i:05d}"
        slow_manager.add_student(student_id, f"Student {i}", f"student{i}@uni.edu")
        fast_manager.add_student(student_id, f"Student {i}", f"student{i}@uni.edu")
        
        ## Add random grades

        for _ in range(5):
            grade = random.uniform(60, 100)
            fast_manager.add_grade(student_id, grade)
    
    ## Test lookup performance

    search_id = "S05000"
    
    ## Time the slow version

    start_time = time.time()
    for _ in range(1000):
        slow_manager.find_student_slow(search_id)
    slow_time = time.time() - start_time
    
    ## Time the fast version

    start_time = time.time()
    for _ in range(1000):
        fast_manager.find_student(search_id)
    fast_time = time.time() - start_time
    
    print(f"Slow lookup (linear search): {slow_time:.4f} seconds")
    print(f"Fast lookup (hash table): {fast_time:.4f} seconds")
    print(f"Speed improvement: {slow_time/fast_time:.1f}x faster")

```

### 4. Maintainability

**Definition**: The code can be easily modified, extended, and debugged by developers.

**Assessment criteria:**

- Modular design with clear separation of concerns

- Consistent coding patterns and conventions

- Comprehensive test coverage

- Clear documentation and comments

- Minimal coupling between components

**Example: Maintainability Assessment**

```python

## Poor maintainability - tightly coupled, hard to modify

class OrderProcessor:
    """Order processor with maintainability issues."""
    
    def process_order(self, order_data):

        ## Validation logic mixed with business logic

        if not order_data.get('customer_id'):
            print("Error: Missing customer ID")
            return False
        
        ## Database access mixed with calculation

        total = 0
        for item in order_data['items']:

            ## Hard-coded tax rate makes changes difficult

            item_total = item['price'] * item['quantity'] * 1.1  # 10% tax
            total += item_total
        
        ## Payment processing mixed with order logic

        if total > 1000:

            ## Hard-coded discount logic

            total *= 0.9  # 10% discount
        
        ## Email logic mixed with order processing

        print(f"Sending email to customer {order_data['customer_id']}")
        print(f"Order total: ${total:.2f}")
        
        return True


## Improved maintainability - modular, configurable, testable

class TaxCalculator:
    """Handles tax calculations with configurable rates."""
    
    def __init__(self, tax_rate=0.1):
        self.tax_rate = tax_rate
    
    def calculate_tax(self, amount):
        """Calculate tax for a given amount."""
        return amount * self.tax_rate


class DiscountCalculator:
    """Handles discount calculations with configurable rules."""
    
    def __init__(self):
        self.discount_rules = [
            {'min_amount': 1000, 'discount_rate': 0.1},
            {'min_amount': 500, 'discount_rate': 0.05}
        ]
    
    def calculate_discount(self, amount):
        """Calculate discount based on amount and rules."""
        for rule in self.discount_rules:
            if amount >= rule['min_amount']:
                return amount * rule['discount_rate']
        return 0


class OrderValidator:
    """Validates order data."""
    
    def validate_order(self, order_data):
        """
        Validate order data.
        
        Returns:
            tuple: (is_valid, error_messages)
        """
        errors = []
        
        if not order_data.get('customer_id'):
            errors.append("Missing customer ID")
        
        if not order_data.get('items'):
            errors.append("Order must contain items")
        
        for item in order_data.get('items', []):
            if item.get('price', 0) <= 0:
                errors.append(f"Invalid price for item {item.get('name', 'unknown')}")
        
        return len(errors) == 0, errors


class NotificationService:
    """Handles order notifications."""
    
    def send_order_confirmation(self, customer_id, order_total):
        """Send order confirmation to customer."""

        ## This could be extended to support different notification types

        print(f"Sending email to customer {customer_id}")
        print(f"Order total: ${order_total:.2f}")


class ImprovedOrderProcessor:
    """Order processor with improved maintainability."""
    
    def __init__(self, tax_calculator=None, discount_calculator=None, 
                 validator=None, notification_service=None):
        """Initialize with dependency injection for testability."""
        self.tax_calculator = tax_calculator or TaxCalculator()
        self.discount_calculator = discount_calculator or DiscountCalculator()
        self.validator = validator or OrderValidator()
        self.notification_service = notification_service or NotificationService()
    
    def process_order(self, order_data):
        """
        Process an order through validation, calculation, and notification.
        
        Args:
            order_data (dict): Order information
            
        Returns:
            tuple: (success, total_amount, error_messages)
        """

        ## Step 1: Validate order

        is_valid, errors = self.validator.validate_order(order_data)
        if not is_valid:
            return False, 0, errors
        
        ## Step 2: Calculate totals

        subtotal = self._calculate_subtotal(order_data['items'])
        tax_amount = self.tax_calculator.calculate_tax(subtotal)
        discount_amount = self.discount_calculator.calculate_discount(subtotal)
        total = subtotal + tax_amount - discount_amount
        
        ## Step 3: Send notification

        self.notification_service.send_order_confirmation(
            order_data['customer_id'], total
        )
        
        return True, total, []
    
    def _calculate_subtotal(self, items):
        """Calculate subtotal for order items."""
        return sum(item['price'] * item['quantity'] for item in items)

```

## Basic Optimization Techniques

### 1. Algorithm Optimization

Choose algorithms with better time complexity for your specific use case.

**Example: Search Algorithm Optimization**

```python

class ProductCatalog:
    """Product catalog with different search implementations."""
    
    def __init__(self):
        self.products = []
        self._products_by_id = {}  # For fast lookup
        self._products_by_category = {}  # For category searches
    
    def add_product(self, product_id, name, category, price):
        """Add product with multiple indexing for different search patterns."""
        product = {
            'id': product_id,
            'name': name,
            'category': category,
            'price': price
        }
        
        ## Store in list (for iteration)

        self.products.append(product)
        
        ## Store in hash table (for fast ID lookup)

        self._products_by_id[product_id] = product
        
        ## Store in category index (for fast category searches)

        if category not in self._products_by_category:
            self._products_by_category[category] = []
        self._products_by_category[category].append(product)
    
    def find_product_linear(self, product_id):
        """Linear search - O(n) time complexity."""
        for product in self.products:
            if product['id'] == product_id:
                return product
        return None
    
    def find_product_optimized(self, product_id):
        """Hash table lookup - O(1) time complexity."""
        return self._products_by_id.get(product_id)
    
    def find_products_by_category_linear(self, category):
        """Linear search for category - O(n) time complexity."""
        return [p for p in self.products if p['category'] == category]
    
    def find_products_by_category_optimized(self, category):
        """Index-based category search - O(1) to find category, O(k) to return results."""
        return self._products_by_category.get(category, [])

```

### 2. Data Structure Selection

Choose the right data structure for your access patterns.

**Example: Data Structure Optimization**

```python

class TaskManager:
    """Task manager demonstrating data structure choices."""
    
    def __init__(self):

        ## Different data structures for different use cases

        self.tasks_list = []  # For ordered iteration
        self.tasks_dict = {}  # For fast lookup by ID
        self.tasks_by_priority = {  # For priority-based access
            'high': [],
            'medium': [],
            'low': []
        }
        self.completed_tasks = set()  # For fast membership testing
    
    def add_task(self, task_id, description, priority='medium'):
        """Add task with appropriate data structure updates."""
        task = {
            'id': task_id,
            'description': description,
            'priority': priority,
            'created_at': time.time()
        }
        
        ## Add to different structures for different access patterns

        self.tasks_list.append(task)  # Ordered access
        self.tasks_dict[task_id] = task  # Fast lookup
        self.tasks_by_priority[priority].append(task)  # Priority access
    
    def complete_task(self, task_id):
        """Mark task as completed using set for fast lookup."""
        if task_id in self.tasks_dict:
            self.completed_tasks.add(task_id)  # O(1) set insertion
            return True
        return False
    
    def is_task_completed(self, task_id):
        """Check if task is completed - O(1) set membership test."""
        return task_id in self.completed_tasks
    
    def get_high_priority_tasks(self):
        """Get high priority tasks - O(1) to access, O(k) to filter completed."""
        high_priority = self.tasks_by_priority['high']
        return [task for task in high_priority 
                if task['id'] not in self.completed_tasks]


## Demonstration of why data structure choice matters

def demonstrate_data_structure_performance():
    """Show performance difference between list and set for membership testing."""
    import random
    import time
    
    ## Create large datasets

    large_list = list(range(100000))
    large_set = set(range(100000))
    
    ## Test values to search for

    search_values = [random.randint(0, 99999) for _ in range(1000)]
    
    ## Time list searches (O(n) for each search)

    start_time = time.time()
    for value in search_values:
        result = value in large_list
    list_time = time.time() - start_time
    
    ## Time set searches (O(1) for each search)

    start_time = time.time()
    for value in search_values:
        result = value in large_set
    set_time = time.time() - start_time
    
    print(f"List membership testing: {list_time:.4f} seconds")
    print(f"Set membership testing: {set_time:.4f} seconds")
    print(f"Set is {list_time/set_time:.1f}x faster")

```

### 3. Avoiding Premature Optimization

**The principle**: Don't optimize until you know where the bottlenecks are.

**Example: Premature vs. Appropriate Optimization**

```python

## Example of premature optimization (don't do this initially)

class PrematurelyOptimizedTextProcessor:
    """Text processor with premature micro-optimizations."""
    
    def __init__(self):

        ## Pre-allocating lists "for performance" - premature!

        self._word_cache = [None] * 10000
        self._cache_index = 0
    
    def process_text(self, text):
        """Process text with unnecessary optimizations."""

        ## Using list comprehension instead of loops "for speed"

        ## But this sacrifices readability for minimal gain

        words = [w.strip().lower() for w in text.split() 
                if len(w.strip()) > 0 and w.strip().isalpha()]
        
        ## Complex caching logic that probably isn't needed

        for word in words:
            if self._cache_index < len(self._word_cache):
                self._word_cache[self._cache_index] = word
                self._cache_index += 1
        
        return words


## Better approach: Write clear code first, optimize if needed

class ClearTextProcessor:
    """Text processor focused on clarity and correctness first."""
    
    def __init__(self):
        self.processed_words = []
    
    def process_text(self, text):
        """
        Process text into clean word list.
        
        Args:
            text (str): Input text to process
            
        Returns:
            list: Clean list of alphabetic words in lowercase
        """
        words = []
        
        ## Clear, readable logic

        for word in text.split():
            cleaned_word = word.strip().lower()
            
            ## Only keep alphabetic words

            if cleaned_word and cleaned_word.isalpha():
                words.append(cleaned_word)
        
        ## Store for potential analysis

        self.processed_words.extend(words)
        
        return words


## If profiling shows this is a bottleneck, then optimize:

class OptimizedTextProcessor:
    """Text processor optimized after profiling identified bottlenecks."""
    
    def __init__(self):
        self.processed_words = []

        ## Only add caching if profiling shows it helps
    
    def process_text(self, text):
        """Optimized version based on actual performance data."""

        ## Use list comprehension only if it's actually faster for your use case

        words = [word.strip().lower() for word in text.split()
                if word.strip() and word.strip().isalpha()]
        
        self.processed_words.extend(words)
        return words

```

## Simple Profiling Techniques

Understanding where your code spends time is essential for effective optimization.

### Time-Based Profiling

```python

import time
import functools

def time_function(func):
    """Decorator to time function execution."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper


class ProfiledDataProcessor:
    """Data processor with timing for performance analysis."""
    
    @time_function
    def load_data(self, filename):
        """Load data from file - timed for profiling."""

        ## Simulate file loading

        time.sleep(0.1)
        return ["data"] * 1000
    
    @time_function
    def process_data(self, data):
        """Process data - timed for profiling."""

        ## Simulate data processing

        processed = []
        for item in data:

            ## Some processing work

            processed.append(item.upper())
        return processed
    
    @time_function
    def save_results(self, processed_data):
        """Save results - timed for profiling."""

        ## Simulate saving

        time.sleep(0.05)
        return True


def profile_data_processing():
    """Demonstrate profiling to identify bottlenecks."""
    processor = ProfiledDataProcessor()
    
    data = processor.load_data("sample.txt")
    processed = processor.process_data(data)
    processor.save_results(processed)
    
    ## Output will show which methods take the most time


class DetailedProfiler:
    """More detailed profiling for complex analysis."""
    
    def __init__(self):
        self.timing_data = {}
    
    def time_operation(self, operation_name):
        """Context manager for timing operations."""
        return TimingContext(operation_name, self.timing_data)
    
    def print_profile_summary(self):
        """Print summary of all timed operations."""
        print("\nProfile Summary:")
        print("-" * 40)
        
        total_time = sum(self.timing_data.values())
        
        for operation, duration in sorted(self.timing_data.items(), 
                                        key=lambda x: x[1], reverse=True):
            percentage = (duration / total_time) * 100
            print(f"{operation:20s}: {duration:.4f}s ({percentage:.1f}%)")


class TimingContext:
    """Context manager for timing code blocks."""
    
    def __init__(self, operation_name, timing_data):
        self.operation_name = operation_name
        self.timing_data = timing_data
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = time.time() - self.start_time
        self.timing_data[self.operation_name] = duration


def demonstrate_detailed_profiling():
    """Show detailed profiling of a complex operation."""
    profiler = DetailedProfiler()
    
    ## Profile different parts of an operation

    with profiler.time_operation("Data Loading"):

        ## Simulate loading

        data = list(range(10000))
    
    with profiler.time_operation("Data Transformation"):

        ## Simulate transformation

        transformed = [x * 2 for x in data]
    
    with profiler.time_operation("Data Filtering"):

        ## Simulate filtering

        filtered = [x for x in transformed if x % 3 == 0]
    
    with profiler.time_operation("Data Aggregation"):

        ## Simulate aggregation

        total = sum(filtered)
        average = total / len(filtered) if filtered else 0
    
    profiler.print_profile_summary()

```

### Memory Profiling

```python

import sys

class MemoryProfiler:
    """Simple memory usage tracking."""
    
    def __init__(self):
        self.memory_snapshots = {}
    
    def take_snapshot(self, label):
        """Take a memory usage snapshot."""

        ## Note: This is a simplified example

        ## In practice, you'd use tools like memory_profiler or tracemalloc

        import gc
        gc.collect()  # Force garbage collection for more accurate reading
        
        ## This gives a rough estimate (not precise)

        memory_usage = sys.getsizeof(gc.get_objects())
        self.memory_snapshots[label] = memory_usage
        print(f"Memory snapshot '{label}': ~{memory_usage:,} bytes")
    
    def compare_snapshots(self, label1, label2):
        """Compare memory usage between snapshots."""
        if label1 in self.memory_snapshots and label2 in self.memory_snapshots:
            diff = self.memory_snapshots[label2] - self.memory_snapshots[label1]
            print(f"Memory change from {label1} to {label2}: {diff:,} bytes")


def demonstrate_memory_profiling():
    """Demonstrate memory usage tracking."""
    profiler = MemoryProfiler()
    
    profiler.take_snapshot("Start")
    
    ## Create some data structures

    large_list = list(range(100000))
    profiler.take_snapshot("After creating large list")
    
    large_dict = {i: f"value_{i}" for i in range(50000)}
    profiler.take_snapshot("After creating large dict")
    
    ## Clean up

    del large_list
    del large_dict
    profiler.take_snapshot("After cleanup")
    
    profiler.compare_snapshots("Start", "After creating large list")
    profiler.compare_snapshots("After creating large dict", "After cleanup")

```

## Trade-offs Between Readability and Performance

Understanding when to prioritize readability versus performance is crucial for maintainable code.

### Readability-First Approach

```python

class ReadableGradeCalculator:
    """Grade calculator prioritizing clarity and maintainability."""
    
    def __init__(self):
        self.grade_boundaries = {
            'A': 90,
            'B': 80,
            'C': 70,
            'D': 60,
            'F': 0
        }
    
    def calculate_letter_grade(self, numerical_score):
        """
        Convert numerical score to letter grade.
        
        This method prioritizes clarity over performance.
        For most applications, the performance difference is negligible
        but the readability benefit is significant.
        """
        if numerical_score >= self.grade_boundaries['A']:
            return 'A'
        elif numerical_score >= self.grade_boundaries['B']:
            return 'B'
        elif numerical_score >= self.grade_boundaries['C']:
            return 'C'
        elif numerical_score >= self.grade_boundaries['D']:
            return 'D'
        else:
            return 'F'
    
    def calculate_class_average(self, student_grades):
        """
        Calculate average grade for a class.
        
        Uses clear, step-by-step logic that's easy to verify and modify.
        """
        if not student_grades:
            return 0.0
        
        total_points = 0
        student_count = 0
        
        for student_grade_list in student_grades.values():
            if student_grade_list:  # Skip students with no grades
                student_average = sum(student_grade_list) / len(student_grade_list)
                total_points += student_average
                student_count += 1
        
        if student_count == 0:
            return 0.0
        
        class_average = total_points / student_count
        return class_average


class PerformanceOptimizedGradeCalculator:
    """Grade calculator optimized for performance-critical scenarios."""
    
    def __init__(self):

        ## Pre-calculate grade boundaries for faster lookup

        self.grade_thresholds = [
            (90, 'A'),
            (80, 'B'),
            (70, 'C'),
            (60, 'D'),
            (0, 'F')
        ]
    
    def calculate_letter_grade(self, numerical_score):
        """
        Optimized letter grade calculation.
        
        Uses tuple lookup which is slightly faster than multiple if-elif statements
        for very high-frequency calls. Only worth it if profiling shows this
        is a bottleneck.
        """
        for threshold, grade in self.grade_thresholds:
            if numerical_score >= threshold:
                return grade
        return 'F'  # Fallback (shouldn't reach here)
    
    def calculate_class_average_optimized(self, student_grades):
        """
        Optimized class average calculation.
        
        Uses list comprehension and built-in functions for better performance
        when processing large datasets.
        """

        ## Filter out students with no grades and calculate averages in one pass

        student_averages = [
            sum(grades) / len(grades)
            for grades in student_grades.values()
            if grades  # Only students with grades
        ]
        
        return sum(student_averages) / len(student_averages) if student_averages else 0.0


def compare_readability_vs_performance():
    """Demonstrate the trade-off between readability and performance."""
    import random
    import time
    
    ## Create test data

    test_scores = [random.uniform(0, 100) for _ in range(10000)]
    
    readable_calc = ReadableGradeCalculator()
    optimized_calc = PerformanceOptimizedGradeCalculator()
    
    ## Time the readable version

    start_time = time.time()
    readable_results = [readable_calc.calculate_letter_grade(score) for score in test_scores]
    readable_time = time.time() - start_time
    
    ## Time the optimized version

    start_time = time.time()
    optimized_results = [optimized_calc.calculate_letter_grade(score) for score in test_scores]
    optimized_time = time.time() - start_time
    
    ## Verify results are the same

    assert readable_results == optimized_results
    
    print(f"Readable version: {readable_time:.4f} seconds")
    print(f"Optimized version: {optimized_time:.4f} seconds")
    
    if optimized_time > 0:
        speedup = readable_time / optimized_time
        print(f"Performance improvement: {speedup:.2f}x")
        
        ## Show the trade-off

        if speedup < 2.0:
            print("Recommendation: Stick with readable version - minimal performance gain")
        else:
            print("Recommendation: Consider optimized version if this is a bottleneck")

```

## Guidelines for Effective Optimization

### 1. Measure First, Optimize Second

```python

def optimization_workflow_example():
    """Demonstrate proper optimization workflow."""
    
    ## Step 1: Write clear, correct code

    def initial_implementation(data):
        """Initial clear implementation."""
        results = []
        for item in data:
            if item > 0:
                processed = item * 2 + 1
                results.append(processed)
        return results
    
    ## Step 2: Profile to identify bottlenecks

    import time
    test_data = list(range(-5000, 5000))
    
    start_time = time.time()
    result1 = initial_implementation(test_data)
    initial_time = time.time() - start_time
    
    print(f"Initial implementation: {initial_time:.4f} seconds")
    
    ## Step 3: Optimize only if necessary and beneficial

    def optimized_implementation(data):
        """Optimized version using list comprehension."""
        return [item * 2 + 1 for item in data if item > 0]
    
    start_time = time.time()
    result2 = optimized_implementation(test_data)
    optimized_time = time.time() - start_time
    
    print(f"Optimized implementation: {optimized_time:.4f} seconds")
    
    ## Verify correctness

    assert result1 == result2
    
    ## Evaluate trade-offs

    if optimized_time > 0:
        speedup = initial_time / optimized_time
        print(f"Speedup: {speedup:.2f}x")
        
        if speedup > 1.5 and optimized_time < initial_time:
            print("Optimization worthwhile: significant speed improvement")
        else:
            print("Optimization marginal: consider keeping readable version")

```

### 2. Focus on Algorithmic Improvements

```python

def algorithmic_optimization_example():
    """Show how algorithm choice has bigger impact than micro-optimizations."""
    
    ## Poor algorithm: O(n²) for finding duplicates

    def find_duplicates_slow(items):
        """Find duplicates using nested loops - O(n²)."""
        duplicates = []
        for i, item in enumerate(items):
            for j, other_item in enumerate(items):
                if i != j and item == other_item and item not in duplicates:
                    duplicates.append(item)
        return duplicates
    
    ## Better algorithm: O(n) using hash table

    def find_duplicates_fast(items):
        """Find duplicates using hash table - O(n)."""
        seen = set()
        duplicates = set()
        
        for item in items:
            if item in seen:
                duplicates.add(item)
            else:
                seen.add(item)
        
        return list(duplicates)
    
    ## Test with large dataset

    import random
    test_data = [random.randint(1, 1000) for _ in range(5000)]
    
    import time
    
    ## Time slow version

    start_time = time.time()
    slow_result = find_duplicates_slow(test_data)
    slow_time = time.time() - start_time
    
    ## Time fast version

    start_time = time.time()
    fast_result = find_duplicates_fast(test_data)
    fast_time = time.time() - start_time
    
    print(f"Slow algorithm (O(n²)): {slow_time:.4f} seconds")
    print(f"Fast algorithm (O(n)): {fast_time:.4f} seconds")
    
    if fast_time > 0:
        print(f"Algorithmic improvement: {slow_time/fast_time:.1f}x faster")

```

## Practice Exercises

/// details | Exercise 1: Code Effectiveness Assessment
    type: question
    open: false

Evaluate this code across all four dimensions (correctness, clarity, performance, maintainability) and identify improvements:

```python

class ShoppingCart:
    def __init__(self):
        self.i = []
        self.t = 0
    
    def a(self, id, n, p, q=1):
        for x in self.i:
            if x[0] == id:
                x[3] += q
                return
        self.i.append([id, n, p, q])
    
    def c(self):
        self.t = 0
        for x in self.i:
            self.t += x[2] * x[3]
        return self.t
    
    def r(self, id):
        for j, x in enumerate(self.i):
            if x[0] == id:
                del self.i[j]
                return True
        return False

```
///


/// details | Exercise 2: Performance Optimization
    type: question
    open: false

Profile and optimize this data processing function:

```python

def process_sales_data(sales_records):
    """Process sales data to find top products by revenue."""
    product_revenues = {}
    
    for record in sales_records:
        product_id = record['product_id']
        revenue = record['quantity'] * record['price']
        
        if product_id in product_revenues:
            product_revenues[product_id] += revenue
        else:
            product_revenues[product_id] = revenue
    
    ## Sort products by revenue

    sorted_products = []
    for product_id, revenue in product_revenues.items():
        sorted_products.append((product_id, revenue))
    
    ## Bubble sort (intentionally inefficient)

    for i in range(len(sorted_products)):
        for j in range(0, len(sorted_products) - i - 1):
            if sorted_products[j][1] < sorted_products[j + 1][1]:
                sorted_products[j], sorted_products[j + 1] = sorted_products[j + 1], sorted_products[j]
    
    return sorted_products[:10]  # Top 10 products

```

///


/// details | Exercise 3: Readability vs Performance Trade-offs
    type: question
    open: false

Design two versions of a text analysis function:

1. A highly readable version that counts word frequencies

2. An optimized version for processing large documents

Consider when each version would be appropriate.
///


## Section Recap

In this section, you learned to assess and improve code effectiveness:

1. **Four Dimensions of Effectiveness**: Correctness, clarity, performance, and maintainability are all important aspects of code quality

2. **Optimization Techniques**: Algorithm improvements, appropriate data structures, and avoiding premature optimization are key strategies

3. **Profiling Skills**: Simple timing and memory profiling help identify real bottlenecks rather than assumed problems

4. **Trade-off Management**: Balancing readability and performance requires understanding your specific context and requirements

5. **Systematic Approach**: Measure first, optimize second, and always verify correctness after changes

Remember: the most important optimization is often choosing the right algorithm and data structures from the start. Micro-optimizations should only be applied after profiling identifies genuine bottlenecks. Clear, correct code is more valuable than clever code that's hard to understand and maintain.

Effective optimization in object-oriented programming often involves designing classes and methods that naturally support efficient operations while maintaining clean interfaces and clear responsibilities.
