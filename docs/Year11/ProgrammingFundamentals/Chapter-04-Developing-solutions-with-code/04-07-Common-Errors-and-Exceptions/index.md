---
title: "4.7 Common Errors and Exceptions"
---

# 4.7 Common Errors and Exceptions

## Understanding Programming Errors

Programming errors are inevitable - even experienced programmers make them! The key is learning to recognize common error patterns, understand their causes, and know how to fix them quickly. This knowledge will make you a more efficient programmer and help you write better code from the start.

## Types of Programming Errors

### Syntax Errors

**Syntax errors** occur when your code doesn't follow Python's grammar rules. Python can't even try to run code with syntax errors.

/// details | Common Syntax Errors and Fixes
    type: note
    open: false

```python
# Error 1: Missing parentheses
print "Hello World"  # SyntaxError
# Fix:
print("Hello World")

# Error 2: Mismatched parentheses
print("Hello World"  # SyntaxError: missing closing parenthesis
# Fix:
print("Hello World")

# Error 3: Missing colon after if statement
if x > 5  # SyntaxError
    print("Big number")
# Fix:
if x > 5:
    print("Big number")

# Error 4: Incorrect indentation
def calculate_average(numbers):
total = sum(numbers)  # IndentationError: expected an indented block
return total / len(numbers)
# Fix:
def calculate_average(numbers):
    total = sum(numbers)
    return total / len(numbers)

# Error 5: Missing quotes
message = Hello World  # SyntaxError: invalid syntax
# Fix:
message = "Hello World"

# Error 6: Mismatched quotes
message = "Hello World'  # SyntaxError: unterminated string literal
# Fix:
message = "Hello World"
# or:
message = 'Hello World'

```

///

/// details | Reading Syntax Error Messages
    type: note
    open: false

```python

## Example of syntax error message interpretation

def broken_function():
    if x > 5
        print("Greater than 5")

## Error message:

## File "example.py", line 2

##     if x > 5

##            ^

## SyntaxError: invalid syntax

## How to read this:

## 1. File name and line number (line 2)

## 2. The problematic line is shown

## 3. ^ points to where Python got confused

## 4. Error type: SyntaxError

## 5. Description: invalid syntax

## The fix: add missing colon

def fixed_function():
    if x > 5:
        print("Greater than 5")

```

///

### Runtime Errors (Exceptions)

**Runtime errors** occur when Python tries to execute code that looks correct but can't be completed for some reason.

/// details | Division by Zero
    type: note
    open: false

```python
def safe_division_example():
    """Examples of division by zero errors and fixes."""
    
    ## Problem: Division by zero

    def calculate_average_broken(numbers):
        total = sum(numbers)
        count = len(numbers)
        return total / count  # ZeroDivisionError if numbers is empty
    
    ## Demonstration of the error

    print("=== Division by Zero Examples ===")
    
    try:
        result = calculate_average_broken([])  # This will crash
    except ZeroDivisionError as e:
        print(f"Error caught: {e}")
        print("Problem: Empty list causes division by zero")
    
    ## Fix 1: Check before dividing

    def calculate_average_fixed_v1(numbers):
        if len(numbers) == 0:
            return None  # or 0, or raise a meaningful error
        total = sum(numbers)
        count = len(numbers)
        return total / count
    
    ## Fix 2: Use try-except

    def calculate_average_fixed_v2(numbers):
        try:
            total = sum(numbers)
            count = len(numbers)
            return total / count
        except ZeroDivisionError:
            return None  # Handle the error gracefully
    
    ## Test the fixes

    test_cases = [[], [5], [1, 2, 3, 4, 5]]
    
    for numbers in test_cases:
        print(f"\nTesting with {numbers}:")
        print(f"  Fixed v1: {calculate_average_fixed_v1(numbers)}")
        print(f"  Fixed v2: {calculate_average_fixed_v2(numbers)}")

safe_division_example()

```

///

/// details | Index Out of Range
    type: note
    open: false

```python
def index_error_examples():
    """Common index errors and how to avoid them."""
    
    print("=== Index Error Examples ===")
    
    # Problem: Accessing index that doesn't exist
    my_list = [1, 2, 3, 4, 5]
    print(f"List: {my_list}")
    print(f"List length: {len(my_list)}")
    print(f"Valid indices: 0 to {len(my_list) - 1}")
    
    # Common index errors:
    try:
        print(f"my_list[5]: {my_list[5]}")  # IndexError
    except IndexError as e:
        print(f"Error: {e}")
        print("Problem: Index 5 doesn't exist (valid indices: 0-4)")
    
    try:
        print(f"my_list[-6]: {my_list[-6]}")  # IndexError
    except IndexError as e:
        print(f"Error: {e}")
        print("Problem: Negative index -6 is too far back")
    
    # Fix 1: Check bounds before accessing
    def safe_get_element(lst, index):
        if 0 <= index < len(lst):
            return lst[index]
        else:
            return None  # or some default value
    
    # Fix 2: Use try-except
    def safe_get_element_v2(lst, index):
        try:
            return lst[index]
        except IndexError:
            return None
    
    # Test the fixes
    test_indices = [-1, 0, 2, 5, 10]
    print(f"\nTesting safe access methods:")
    
    for index in test_indices:
        safe_result = safe_get_element(my_list, index)
        safe_result_v2 = safe_get_element_v2(my_list, index)
        print(f"  Index {index}: {safe_result} | {safe_result_v2}")

index_error_examples()

```

///

/// details | Key Errors with Dictionaries
    type: note
    open: false

```python
def key_error_examples():
    """Common dictionary key errors and solutions."""
    
    print("=== Key Error Examples ===")
    
    student_grades = {
        "Alice": 92,
        "Bob": 87,
        "Charlie": 94
    }
    
    print(f"Student grades: {student_grades}")
    
    ## Problem: Accessing key that doesn't exist

    try:
        grade = student_grades["David"]  # KeyError
        print(f"David's grade: {grade}")
    except KeyError as e:
        print(f"Error: {e}")
        print("Problem: 'David' is not in the dictionary")
    
    ## Fix 1: Check if key exists first

    def get_grade_safe_v1(grades_dict, student_name):
        if student_name in grades_dict:
            return grades_dict[student_name]
        else:
            return None  # or "Not found", or 0
    
    ## Fix 2: Use .get() method with default

    def get_grade_safe_v2(grades_dict, student_name, default=None):
        return grades_dict.get(student_name, default)
    
    ## Fix 3: Use try-except

    def get_grade_safe_v3(grades_dict, student_name):
        try:
            return grades_dict[student_name]
        except KeyError:
            return None
    
    ## Test the fixes

    test_students = ["Alice", "Bob", "David", "Eve"]
    print(f"\nTesting safe dictionary access:")
    
    for student in test_students:
        v1_result = get_grade_safe_v1(student_grades, student)
        v2_result = get_grade_safe_v2(student_grades, student, "Not found")
        v3_result = get_grade_safe_v3(student_grades, student)
        print(f"  {student}: {v1_result} | {v2_result} | {v3_result}")

key_error_examples()

```

///

/// details | Type Errors
    type: note
    open: false

```python
def type_error_examples():
    """Common type errors and how to prevent them."""
    
    print("=== Type Error Examples ===")
    
    # Problem 1: Wrong operation for type
    try:
        result = "5" + 3  # TypeError: can't concatenate str and int
    except TypeError as e:
        print(f"Error: {e}")
        print("Problem: Trying to add string and number")
        
        # Fixes:
        fix1 = int("5") + 3      # Convert string to int
        fix2 = "5" + str(3)      # Convert int to string
        print(f"Fix 1 (convert to int): {fix1}")
        print(f"Fix 2 (convert to string): {fix2}")
    
    # Problem 2: Calling method on wrong type
    try:
        number = 42
        result = number.append(5)  # TypeError: int has no method append
    except AttributeError as e:
        print(f"\nError: {e}")
        print("Problem: Trying to use list method on integer")
        
        # Fix: Use correct type
        my_list = [42]
        my_list.append(5)
        print(f"Fix: Use list instead: {my_list}")
    
    # Problem 3: Function expects different type
    def calculate_area(length, width):
        return length * width
    
    try:
        area = calculate_area("5", 3)  # This works but might not be intended
        print(f"\nCalculating area with string: {area}")
        print("Result: '555' (string multiplication, probably not intended)")
    except TypeError as e:
        print(f"Error: {e}")
    
    # Better version with type checking
    def calculate_area_safe(length, width):
        # Check types
        if not isinstance(length, (int, float)):
            raise TypeError(f"Length must be a number, got {type(length)}")
        if not isinstance(width, (int, float)):
            raise TypeError(f"Width must be a number, got {type(width)}")
        
        return length * width
    
    # Test the safe version
    try:
        area = calculate_area_safe("5", 3)
    except TypeError as e:
        print(f"Safe version error: {e}")
        
        # Fix: convert or use correct types
        area = calculate_area_safe(float("5"), 3)
        print(f"Fixed: {area}")

type_error_examples()

```

///

### Logic Errors

**Logic errors** are the trickiest - your code runs without crashing but produces wrong results.

/// details | Off-by-One Errors
    type: note
    open: false

```python
def off_by_one_examples():
    """Common off-by-one errors and corrections."""
    
    print("=== Off-by-One Error Examples ===")
    
    # Problem 1: Wrong range in loop
    def print_numbers_buggy(n):
        """Print numbers 1 to n - but has off-by-one error."""
        print("Buggy version (should print 1 to n):")
        for i in range(n):  # Bug: this goes 0 to n-1
            print(i, end=" ")
        print()
    
    def print_numbers_fixed(n):
        """Print numbers 1 to n - corrected version."""
        print("Fixed version:")
        for i in range(1, n + 1):  # Correct: 1 to n inclusive
            print(i, end=" ")
        print()
    
    # Test both versions
    n = 5
    print(f"Printing numbers 1 to {n}:")
    print_numbers_buggy(n)
    print_numbers_fixed(n)
    
    # Problem 2: Array indexing errors
    def get_last_element_buggy(lst):
        """Get last element - with off-by-one error."""
        if len(lst) > 0:
            return lst[len(lst)]  # Bug: this is one index too far
        return None
    
    def get_last_element_fixed(lst):
        """Get last element - corrected version."""
        if len(lst) > 0:
            return lst[len(lst) - 1]  # Correct: last valid index
        return None
    
    # Even better: use negative indexing
    def get_last_element_pythonic(lst):
        """Get last element - Python way."""
        if len(lst) > 0:
            return lst[-1]  # Pythonic: -1 means last element
        return None
    
    # Test all versions
    test_list = [10, 20, 30, 40, 50]
    print(f"\nGetting last element from {test_list}:")
    
    try:
        buggy_result = get_last_element_buggy(test_list)
        print(f"Buggy version: {buggy_result}")
    except IndexError:
        print("Buggy version: IndexError (as expected)")
    
    fixed_result = get_last_element_fixed(test_list)
    pythonic_result = get_last_element_pythonic(test_list)
    print(f"Fixed version: {fixed_result}")
    print(f"Pythonic version: {pythonic_result}")

off_by_one_examples()

```

///

/// details | Logic Errors in Conditions
    type: note
    open: false

```python-exec
def logic_condition_examples():
    """Common logic errors in conditional statements."""
    
    print("=== Logic Condition Examples ===")
    
    ## Problem 1: Wrong boolean logic

    def check_valid_age_buggy(age):
        """Check if age is valid (13-65) - with logic error."""

        ## Bug: using OR instead of AND

        if age >= 13 or age <= 65:  # This is always True!
            return True
        return False
    
    def check_valid_age_fixed(age):
        """Check if age is valid (13-65) - corrected."""

        ## Fix: use AND

        if age >= 13 and age <= 65:
            return True
        return False
    
    ## Even better: more Pythonic

    def check_valid_age_pythonic(age):
        """Check if age is valid (13-65) - Pythonic way."""
        return 13 <= age <= 65
    
    ## Test all versions

    test_ages = [5, 13, 25, 65, 70]
    print("Testing age validation (should be valid for 13-65):")
    
    for age in test_ages:
        buggy = check_valid_age_buggy(age)
        fixed = check_valid_age_fixed(age)
        pythonic = check_valid_age_pythonic(age)
        print(f"  Age {age}: Buggy={buggy}, Fixed={fixed}, Pythonic={pythonic}")
    
    ## Problem 2: Incorrect comparison

    def grade_letter_buggy(score):
        """Convert score to letter grade - with logic errors."""

        ## Bug: wrong comparison operators and order

        if score > 90:
            return "A"
        elif score > 80:
            return "B"
        elif score > 70:
            return "C"
        elif score > 60:
            return "D"
        else:
            return "F"

        ## Problem: score of exactly 90 gets "B" instead of "A"
    
    def grade_letter_fixed(score):
        """Convert score to letter grade - corrected."""

        ## Fix: use >= for inclusive boundaries

        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    ## Test both versions

    test_scores = [85, 90, 95, 79, 80]
    print(f"\nTesting grade conversion:")
    
    for score in test_scores:
        buggy = grade_letter_buggy(score)
        fixed = grade_letter_fixed(score)
        print(f"  Score {score}: Buggy='{buggy}', Fixed='{fixed}'")

logic_condition_examples()

```

///

/// details | Infinite Loops
    type: note
    open: false

```python-exec
def infinite_loop_examples():
    """Examples of infinite loops and how to fix them."""
    
    print("=== Infinite Loop Examples ===")
    
    # Problem 1: Counter never reaches end condition
    def count_down_buggy():
        """Count down from 5 - but creates infinite loop."""
        count = 5
        print("Buggy countdown (would run forever):")
        # Bug: incrementing instead of decrementing
        # while count > 0:
        #     print(count)
        #     count += 1  # Bug: should be count -= 1
        print("(Code commented out to prevent infinite loop)")
    
    def count_down_fixed():
        """Count down from 5 - corrected version."""
        count = 5
        print("Fixed countdown:")
        while count > 0:
            print(count, end=" ")
            count -= 1  # Fix: decrement the counter
        print("Done!")
    
    count_down_buggy()
    count_down_fixed()
    
    # Problem 2: Condition never becomes false
    def find_number_buggy():
        """Find a number in list - potential infinite loop."""
        numbers = [1, 3, 5, 7, 9]
        target = 6  # This number is NOT in the list
        i = 0
        
        print(f"\nSearching for {target} in {numbers}")
        print("Buggy version (would run forever if target not found):")
        
        # Bug: no check for end of list
        # while numbers[i] != target:
        #     i += 1
        # This would crash with IndexError when i >= len(numbers)
        print("(Code commented out to prevent error)")
    
    def find_number_fixed():
        """Find a number in list - corrected version."""
        numbers = [1, 3, 5, 7, 9]
        target = 6
        i = 0
        
        print("Fixed version:")
        # Fix: check bounds AND condition
        while i < len(numbers) and numbers[i] != target:
            i += 1
        
        if i < len(numbers):
            print(f"Found {target} at index {i}")
        else:
            print(f"{target} not found in list")
    
    find_number_buggy()
    find_number_fixed()
    
    # Problem 3: Wrong update in loop
    def print_even_numbers_buggy():
        """Print even numbers 0-10 - with infinite loop bug."""
        print("\nBuggy even numbers (would run forever):")
        # Bug: condition and increment don't match
        # i = 0
        # while i <= 10:
        #     if i % 2 == 0:
        #         print(i)
        #     i += 3  # Bug: incrementing by 3, so condition never fails correctly
        print("(Code commented out to prevent infinite loop)")
    
    def print_even_numbers_fixed():
        """Print even numbers 0-10 - corrected version."""
        print("Fixed even numbers:")
        i = 0
        while i <= 10:
            if i % 2 == 0:
                print(i, end=" ")
            i += 1  # Fix: increment by 1, or use i += 2 and remove the if
        print()
        
        # Alternative fix: increment by 2 and start with even number
        print("Alternative fix:")
        i = 0
        while i <= 10:
            print(i, end=" ")
            i += 2  # Skip odd numbers entirely
        print()
    
    print_even_numbers_buggy()
    print_even_numbers_fixed()

# Note: We don't actually run the infinite loop examples to avoid hanging
print("Infinite loop examples defined (safe to demonstrate concepts)")

```

///

## Common Error Patterns and Prevention

### Variable Name Errors

```python
def variable_name_errors():
    """Common variable naming mistakes."""
    
    print("=== Variable Name Error Examples ===")
    
    # Problem 1: Typos in variable names
    def calculate_total_buggy():
        # Bug: typo in variable name
        num1 = 10
        num2 = 20
        total = num1 + num2
        return totall  # NameError: name 'totall' is not defined
    
    def calculate_total_fixed():
        # Fix: spell variable names correctly
        num1 = 10
        num2 = 20
        total = num1 + num2
        return total
    
    try:
        result = calculate_total_buggy()
    except NameError as e:
        print(f"Error: {e}")
        print("Problem: Typo in variable name 'totall' instead of 'total'")
    
    result = calculate_total_fixed()
    print(f"Fixed version result: {result}")
    
    # Problem 2: Using variable before defining it
    def use_before_define_buggy():
        # Bug: using variable before it's defined
        try:
            print(f"The answer is: {answer}")  # NameError
            answer = 42
        except NameError as e:
            print(f"\nError: {e}")
            print("Problem: Used 'answer' before defining it")
    
    def use_before_define_fixed():
        # Fix: define variable before using it
        answer = 42
        print(f"The answer is: {answer}")
    
    use_before_define_buggy()
    use_before_define_fixed()

variable_name_errors()

```

### Function Definition and Call Errors

```python
def function_errors():
    """Common function-related errors."""
    
    print("=== Function Error Examples ===")
    
    # Problem 1: Calling function with wrong number of arguments
    def greet_person(first_name, last_name):
        return f"Hello, {first_name} {last_name}!"
    
    try:
        # Bug: missing required argument
        message = greet_person("John")  # TypeError
    except TypeError as e:
        print(f"Error: {e}")
        print("Problem: Function expects 2 arguments, got 1")
        
        # Fix: provide all required arguments
        message = greet_person("John", "Smith")
        print(f"Fixed: {message}")
    
    # Problem 2: Function doesn't return value when expected
    def calculate_area_buggy(length, width):
        """Calculate area but forget to return result."""
        area = length * width
        # Bug: forgot to return the result
        print(f"Area calculated: {area}")
    
    def calculate_area_fixed(length, width):
        """Calculate area and return result."""
        area = length * width
        print(f"Area calculated: {area}")
        return area  # Fix: return the result
    
    print(f"\nBuggy function result: {calculate_area_buggy(5, 3)}")  # Returns None
    print(f"Fixed function result: {calculate_area_fixed(5, 3)}")
    
    # Problem 3: Indentation errors in function definition
    def indentation_demo():
        """Show common indentation mistakes."""
        print("Common indentation mistakes:")
        print("1. Mixing tabs and spaces")
        print("2. Inconsistent indentation levels")
        print("3. Missing indentation after colon")
        
        # This would cause IndentationError:
        # def broken_function():
        # print("This line should be indented")
        
        # Correct version:
        def working_function():
            print("This line is properly indented")
        
        working_function()
    
    indentation_demo()

function_errors()

```

## Debugging Strategies for Common Errors

### Systematic Error Detection

```python-exec
def debugging_strategies():
    """Demonstrate systematic approaches to finding errors."""
    
    print("=== Debugging Strategies ===")
    
    # Example: Debugging a complex function
    def process_grades_with_bugs(student_scores):
        """Process student grades - contains multiple types of errors."""
        
        # Add debug prints to trace execution
        print(f"DEBUG: Input scores: {student_scores}")
        
        # Bug 1: Not handling empty input (will cause errors later)
        total_score = 0
        student_count = 0
        grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
        
        for student_score in student_scores:
            print(f"DEBUG: Processing score: {student_score}")
            
            # Bug 2: Not validating score type/range
            total_score += student_score
            student_count += 1
            
            # Bug 3: Logic error in grade assignment
            if student_score > 90:  # Should be >= 90
                grade_counts["A"] += 1
            elif student_score > 80:  # Should be >= 80
                grade_counts["B"] += 1
            elif student_score > 70:  # Should be >= 70
                grade_counts["C"] += 1
            elif student_score > 60:  # Should be >= 60
                grade_counts["D"] += 1
            else:
                grade_counts["F"] += 1
        
        # Bug 4: Division by zero if no students
        average_score = total_score / student_count
        print(f"DEBUG: Average calculated: {average_score}")
        
        # Bug 5: Not returning the result
        result = {
            "average": average_score,
            "total_students": student_count,
            "grade_distribution": grade_counts
        }
        print(f"DEBUG: Final result: {result}")
        # Missing return statement!
    
    def process_grades_debugged(student_scores):
        """Process student grades - debugged version."""
        
        print(f"DEBUG: Input scores: {student_scores}")
        
        # Fix 1: Handle empty input
        if not student_scores:
            print("DEBUG: No scores provided")
            return {"error": "No student scores provided"}
        
        total_score = 0
        student_count = 0
        grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
        
        for student_score in student_scores:
            print(f"DEBUG: Processing score: {student_score}")
            
            # Fix 2: Validate score
            if not isinstance(student_score, (int, float)) or student_score < 0 or student_score > 100:
                print(f"DEBUG: Invalid score {student_score}, skipping")
                continue
            
            total_score += student_score
            student_count += 1
            
            # Fix 3: Correct grade boundaries
            if student_score >= 90:
                grade_counts["A"] += 1
            elif student_score >= 80:
                grade_counts["B"] += 1
            elif student_score >= 70:
                grade_counts["C"] += 1
            elif student_score >= 60:
                grade_counts["D"] += 1
            else:
                grade_counts["F"] += 1
        
        # Fix 4: Handle case where all scores were invalid
        if student_count == 0:
            print("DEBUG: No valid scores found")
            return {"error": "No valid scores found"}
        
        average_score = total_score / student_count
        print(f"DEBUG: Average calculated: {average_score}")
        
        # Fix 5: Return the result
        result = {
            "average": round(average_score, 2),
            "total_students": student_count,
            "grade_distribution": grade_counts
        }
        print(f"DEBUG: Final result: {result}")
        return result
    
    # Test both versions
    test_scores = [85, 90, 78, 92, 88]
    
    print("Testing buggy version:")
    buggy_result = process_grades_with_bugs(test_scores)
    print(f"Buggy result: {buggy_result}")  # Will be None due to missing return
    
    print("\nTesting debugged version:")
    fixed_result = process_grades_debugged(test_scores)
    print(f"Fixed result: {fixed_result}")
    
    # Test edge cases
    print("\nTesting edge cases:")
    edge_cases = [
        [],  # Empty list
        [90, 80, 70, 60],  # Boundary scores
        [105, -5, "invalid", 85],  # Invalid data mixed with valid
    ]
    
    for case in edge_cases:
        print(f"\nTesting {case}:")
        result = process_grades_debugged(case)
        print(f"Result: {result}")

debugging_strategies()

```

## Error Prevention Best Practices

### Writing Defensive Code

```python
def defensive_programming():
    """Examples of defensive programming techniques."""
    
    print("=== Defensive Programming Examples ===")
    
    # Technique 1: Input validation
    def divide_safely(a, b):
        """Divide two numbers with comprehensive input validation."""
        
        # Validate input types
        if not isinstance(a, (int, float)):
            raise TypeError(f"First argument must be a number, got {type(a)}")
        if not isinstance(b, (int, float)):
            raise TypeError(f"Second argument must be a number, got {type(b)}")
        
        # Validate business logic
        if b == 0:
            raise ValueError("Cannot divide by zero")
        
        return a / b
    
    # Technique 2: Assertions for debugging
    def calculate_discount(price, discount_percent):
        """Calculate discount with assertions."""
        
        # Use assertions to check assumptions during development
        assert isinstance(price, (int, float)), f"Price must be a number, got {type(price)}"
        assert price >= 0, f"Price must be non-negative, got {price}"
        assert isinstance(discount_percent, (int, float)), f"Discount must be a number"
        assert 0 <= discount_percent <= 100, f"Discount must be 0-100%, got {discount_percent}"
        
        discount_amount = price * (discount_percent / 100)
        final_price = price - discount_amount
        
        # Assert postconditions
        assert final_price >= 0, f"Final price should not be negative: {final_price}"
        
        return final_price
    
    # Technique 3: Early returns to reduce nesting
    def process_student_data(student):
        """Process student data with early returns."""
        
        # Early validation with early returns
        if not isinstance(student, dict):
            return {"error": "Student must be a dictionary"}
        
        if "name" not in student:
            return {"error": "Student must have a name"}
        
        if "scores" not in student:
            return {"error": "Student must have scores"}
        
        if not isinstance(student["scores"], list):
            return {"error": "Scores must be a list"}
        
        if len(student["scores"]) == 0:
            return {"error": "Student must have at least one score"}
        
        # Now we can safely process the data
        scores = student["scores"]
        average = sum(scores) / len(scores)
        
        return {
            "name": student["name"],
            "average": round(average, 2),
            "total_scores": len(scores)
        }
    
    # Test defensive programming
    print("Testing divide_safely:")
    test_cases = [(10, 2), (10, 0), (10, "invalid")]
    
    for a, b in test_cases:
        try:
            result = divide_safely(a, b)
            print(f"  {a} / {b} = {result}")
        except (TypeError, ValueError) as e:
            print(f"  {a} / {b} -> Error: {e}")
    
    print("\nTesting calculate_discount:")
    discount_cases = [(100, 10), (100, -5), (100, 150)]
    
    for price, discount in discount_cases:
        try:
            result = calculate_discount(price, discount)
            print(f"  ${price} with {discount}% discount = ${result}")
        except AssertionError as e:
            print(f"  ${price} with {discount}% -> Assertion Error: {e}")
    
    print("\nTesting process_student_data:")
    student_cases = [
        {"name": "Alice", "scores": [85, 90, 88]},
        {"name": "Bob"},  # Missing scores
        {"scores": [85, 90]},  # Missing name
        "not a dict",  # Wrong type
    ]
    
    for student in student_cases:
        result = process_student_data(student)
        print(f"  {student} -> {result}")

defensive_programming()

```

## Summary

Understanding and preventing common errors is essential for effective programming:

### Error Categories

1. **Syntax Errors**: Code doesn't follow Python grammar

   - Missing colons, parentheses, quotes

   - Incorrect indentation

   - Quick fix: Read error messages carefully

2. **Runtime Errors**: Code crashes during execution

   - Division by zero, index out of range, key errors

   - Type errors from wrong operations

   - Fix: Add validation and error handling

3. **Logic Errors**: Code runs but produces wrong results

   - Off-by-one errors, wrong conditions

   - Infinite loops, incorrect algorithms

   - Fix: Trace through code, test thoroughly

### Prevention Strategies

- **Write defensive code**: Validate inputs and assumptions

- **Use meaningful variable names**: Avoid typos and confusion

- **Test early and often**: Catch errors before they spread

- **Read error messages carefully**: They tell you exactly what's wrong

- **Use debugging tools**: Print statements, breakpoints, step through code

### Key Takeaways

- Errors are normal - even experts make them

- Each error type has common patterns and fixes

- Good error handling makes your programs more reliable

- Prevention is better than fixing bugs later

Remember: Learning to recognize and fix common errors quickly is a superpower that will make you a much more effective programmer!
