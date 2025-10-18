---
title: "4.3 From pseudocode to Python functions"
---

# 4.3 From pseudocode to Python functions

## Why it matters

You've learned to design algorithms with pseudocode and implement control structures in Python. Now it's time to organize your code into reusable pieces called **functions**. Functions are like mini-programs that do one specific job—they make your code easier to read, test, and reuse.

Without functions, you'd have to copy-paste the same code everywhere you need it. Imagine writing the same grade calculation logic 20 times in a student management system! Functions let you write it once and use it everywhere.

Functions also help you think like a software engineer:

- **Decomposition**: Break complex problems into smaller, manageable pieces

- **Abstraction**: Hide implementation details behind a simple interface

- **Reusability**: Write once, use many times

- **Testability**: Test each piece independently

- **Maintainability**: Fix bugs in one place instead of many

## Understanding functions

### What is a function?

A **function** is a named block of code that performs a specific task. Think of it as a recipe: you give it ingredients (inputs), it follows steps (code), and produces a result (output).

In Python, you've already used built-in functions like `print()`, `len()`, and `input()`. Now you'll create your own.

### Function anatomy

```python-template
def function_name(parameter1, parameter2):
    """Documentation string explaining what the function does."""
    # Function body - the code that does the work
    result = parameter1 + parameter2
    return result  # Send the result back to the caller

```

**Key parts**:

- `def`: Keyword that starts a function definition

- `function_name`: Descriptive name following snake_case convention

- `(parameters)`: Inputs the function needs (can be zero or more)

- `"""docstring"""`: Documentation explaining what the function does

- Function body: Indented code that does the work

- `return`: Sends a value back to whoever called the function

### Functions vs procedures

In some programming languages, there's a distinction:

- **Function**: Returns a value (like a calculation)

- **Procedure**: Performs an action without returning a value

In Python, everything is technically a function, but we use the same terminology:

- Functions that `return` a value are typically called **functions**

- Functions that don't return a value (or return `None`) act like **procedures**

```python-template
# Function - returns a value
def calculate_average(score1, score2, score3):
    """Calculate the average of three scores."""
    total = score1 + score2 + score3
    return total / 3

# Procedure - performs an action
def print_grade_report(student_name, average):
    """Display a formatted grade report."""
    print(f"Student: {student_name}")
    print(f"Average: {average:.1f}")
    # No return statement - returns None implicitly

```

## From pseudocode to Python

### Basic function translation

Let's convert pseudocode to Python functions step by step.

**Pseudocode**:

```
FUNCTION calculate_area(length, width)
    area ← length × width
    RETURN area
END FUNCTION

```

**Python**:

```python-template
def calculate_area(length, width):
    """Calculate the area of a rectangle."""
    area = length * width
    return area

```

Even simpler, you can return directly:

```python-template
def calculate_area(length, width):
    """Calculate the area of a rectangle."""
    return length * width

```

### Functions with multiple parameters

**Pseudocode**:

```
FUNCTION find_maximum(num1, num2, num3)
    max_value ← num1
    
    IF num2 > max_value THEN
        max_value ← num2
    END IF
    
    IF num3 > max_value THEN
        max_value ← num3
    END IF
    
    RETURN max_value
END FUNCTION

```

**Python**:

```python-exec
def find_maximum(num1, num2, num3):
    """Find the largest of three numbers."""
    max_value = num1
    
    if num2 > max_value:
        max_value = num2
    
    if num3 > max_value:
        max_value = num3
    
    return max_value

# Using the function
result = find_maximum(45, 89, 67)
print(result)  # Output: 89

```

**Python shortcut** (using built-in `max` function):

```python-template
def find_maximum(num1, num2, num3):
    """Find the largest of three numbers."""
    return max(num1, num2, num3)

```

### Functions without return values

**Pseudocode**:

```
PROCEDURE display_welcome_message(user_name)
    OUTPUT "Welcome, " + user_name + "!"
    OUTPUT "Today is a great day to learn Python."
END PROCEDURE

```

**Python**:

```python-exec
def display_welcome_message(user_name):
    """Display a personalized welcome message."""
    print(f"Welcome, {user_name}!")
    print("Today is a great day to learn Python.")

# Using the function
display_welcome_message("Alice")
# Output:
# Welcome, Alice!
# Today is a great day to learn Python.

```

## Parameter passing

Parameters are how functions receive information. Understanding how they work is crucial for writing effective functions.

### Positional parameters

The most common way to pass parameters—order matters!

```python-exec
def format_name(first_name, last_name):
    """Format a full name."""
    return f"{first_name} {last_name}"

# Order matters
print(format_name("Alice", "Smith"))    # Alice Smith
print(format_name("Smith", "Alice"))    # Smith Alice (wrong!)

```

### Default parameters

You can provide default values for parameters:

```python-exec
def greet(name, greeting="Hello"):
    """Greet someone with a customizable greeting."""
    return f"{greeting}, {name}!"

print(greet("Alice"))                   # Hello, Alice!
print(greet("Bob", "Good morning"))     # Good morning, Bob!

```

**Rule**: Default parameters must come after non-default parameters.

```python
# ❌ Wrong - SyntaxError
def example(a=1, b):
    pass

# ✅ Correct
def example(b, a=1):
    pass

```

### Keyword arguments

You can specify parameters by name when calling functions:

```python
def create_student_record(name, age, grade):
    """Create a student record dictionary."""
    return {
        'name': name,
        'age': age,
        'grade': grade
    }

# Using positional arguments
student1 = create_student_record("Alice", 16, 95)

# Using keyword arguments (order doesn't matter!)
student2 = create_student_record(grade=87, name="Bob", age=17)

# Mix positional and keyword (positional must come first)
student3 = create_student_record("Charlie", age=16, grade=92)

```

## One logical task per function

Good functions do **one thing well**. This is called the **Single Responsibility Principle**.

### ❌ Bad: Function does too much

```python-template
def process_student_data(name, test1, test2, test3):
    """Process student data and display report."""
    # Calculating average
    average = (test1 + test2 + test3) / 3
    
    # Determining grade
    if average >= 90:
        letter_grade = 'A'
    elif average >= 80:
        letter_grade = 'B'
    elif average >= 70:
        letter_grade = 'C'
    else:
        letter_grade = 'F'
    
    # Displaying report
    print(f"Student: {name}")
    print(f"Average: {average:.1f}")
    print(f"Grade: {letter_grade}")
    
    # Saving to file
    with open('grades.txt', 'a') as f:
        f.write(f"{name},{average},{letter_grade}\n")

```

This function calculates, grades, displays, AND saves data—too many responsibilities!

### ✅ Good: Each function has one job

```python
def calculate_average(score1, score2, score3):
    """Calculate the average of three test scores."""
    return (score1 + score2 + score3) / 3

def determine_letter_grade(average):
    """Convert numeric average to letter grade."""
    if average >= 90:
        return 'A'
    elif average >= 80:
        return 'B'
    elif average >= 70:
        return 'C'
    else:
        return 'F'

def format_report(name, average, letter_grade):
    """Format a student grade report as a string."""
    return f"Student: {name}\nAverage: {average:.1f}\nGrade: {letter_grade}"

def save_grade_record(name, average, letter_grade, filename='grades.txt'):
    """Save a grade record to a file."""
    with open(filename, 'a') as f:
        f.write(f"{name},{average},{letter_grade}\n")

# Using the functions together
def process_student_grades(name, test1, test2, test3):
    """Process and report student grades using helper functions."""
    avg = calculate_average(test1, test2, test3)
    grade = determine_letter_grade(avg)
    report = format_report(name, avg, grade)
    print(report)
    save_grade_record(name, avg, grade)

# Main execution
process_student_grades("Alice", 85, 92, 88)

```

**Benefits of this approach**:

- Each function can be tested independently

- Functions can be reused in different contexts

- Easy to modify one aspect without affecting others

- Code is self-documenting through function names

## Worked examples

### Example 1: Temperature converter

/// tab | Pseudocode

```
FUNCTION celsius_to_fahrenheit(celsius)
    fahrenheit ← celsius × 9 / 5 + 32
    RETURN fahrenheit
END FUNCTION

FUNCTION fahrenheit_to_celsius(fahrenheit)
    celsius ← (fahrenheit − 32) × 5 / 9
    RETURN celsius
END FUNCTION

MAIN
    temp_c ← 25
    temp_f ← celsius_to_fahrenheit(temp_c)
    OUTPUT temp_c + "°C = " + temp_f + "°F"
    
    temp_f ← 77
    temp_c ← fahrenheit_to_celsius(temp_f)
    OUTPUT temp_f + "°F = " + temp_c + "°C"
END MAIN

```

///

/// tab | Python

```python-exec
def celsius_to_fahrenheit(celsius):
    """Convert temperature from Celsius to Fahrenheit."""
    fahrenheit = celsius * 9 / 5 + 32
    return fahrenheit

def fahrenheit_to_celsius(fahrenheit):
    """Convert temperature from Fahrenheit to Celsius."""
    celsius = (fahrenheit - 32) * 5 / 9
    return celsius

# Main execution
if __name__ == '__main__':
    temp_c = 25
    temp_f = celsius_to_fahrenheit(temp_c)
    print(f"{temp_c}°C = {temp_f}°F")
    
    temp_f = 77
    temp_c = fahrenheit_to_celsius(temp_f)
    print(f"{temp_f}°F = {temp_c:.1f}°C")

# Output:
# 25°C = 77.0°F
# 77°F = 25.0°C

```

///

**What's happening**:

1. Define two conversion functions, each with one clear purpose

2. Each function takes one parameter and returns one result

3. The `if __name__ == '__main__':` block runs only when the script is executed directly

4. We call the functions and use their return values in print statements

### Example 2: Validating user input

/// tab | Pseudocode

```
FUNCTION is_valid_age(age)
    IF age < 0 OR age > 120 THEN
        RETURN FALSE
    ELSE
        RETURN TRUE
    END IF
END FUNCTION

FUNCTION get_valid_age()
    REPEAT
        OUTPUT "Enter your age: "
        age ← INPUT as integer
        
        IF is_valid_age(age) THEN
            RETURN age
        ELSE
            OUTPUT "Invalid age. Please enter age between 0 and 120."
        END IF
    UNTIL is_valid_age(age)
END FUNCTION

MAIN
    user_age ← get_valid_age()
    OUTPUT "Your age is: " + user_age
END MAIN

```

///

/// tab | Python

```python
def is_valid_age(age):
    """Check if age is within valid range (0-120)."""
    return 0 <= age <= 120

def get_valid_age():
    """Prompt user for age until valid input is provided."""
    while True:
        try:
            age = int(input("Enter your age: "))
            
            if is_valid_age(age):
                return age
            else:
                print("Invalid age. Please enter age between 0 and 120.")
        
        except ValueError:
            print("Please enter a valid number.")

# Main execution
if __name__ == '__main__':
    user_age = get_valid_age()
    print(f"Your age is: {user_age}")

# Example interaction:
# Enter your age: -5
# Invalid age. Please enter age between 0 and 120.
# Enter your age: abc
# Please enter a valid number.
# Enter your age: 25
# Your age is: 25

```

///

**Function breakdown**:

- `is_valid_age()`: Single responsibility—validate age range

- `get_valid_age()`: Single responsibility—get validated input from user

- Separation of concerns: validation logic separate from input logic

- Reusable: `is_valid_age()` can be used anywhere age validation is needed

### Example 3: Shopping cart calculator

/// tab | Pseudocode

```
FUNCTION calculate_subtotal(price, quantity)
    RETURN price × quantity
END FUNCTION

FUNCTION calculate_tax(subtotal, tax_rate)
    RETURN subtotal × tax_rate
END FUNCTION

FUNCTION calculate_total(subtotal, tax)
    RETURN subtotal + tax
END FUNCTION

FUNCTION format_currency(amount)
    RETURN "$" + amount rounded to 2 decimal places
END FUNCTION

MAIN
    item_price ← 19.99
    item_quantity ← 3
    tax_rate ← 0.10
    
    subtotal ← calculate_subtotal(item_price, item_quantity)
    tax ← calculate_tax(subtotal, tax_rate)
    total ← calculate_total(subtotal, tax)
    
    OUTPUT "Subtotal: " + format_currency(subtotal)
    OUTPUT "Tax (10%): " + format_currency(tax)
    OUTPUT "Total: " + format_currency(total)
END MAIN

```

///

/// tab | Python

```python-exec
def calculate_subtotal(price, quantity):
    """Calculate subtotal for an item."""
    return price * quantity

def calculate_tax(subtotal, tax_rate):
    """Calculate tax amount based on subtotal and rate."""
    return subtotal * tax_rate

def calculate_total(subtotal, tax):
    """Calculate final total including tax."""
    return subtotal + tax

def format_currency(amount):
    """Format amount as currency string."""
    return f"${amount:.2f}"

# Main execution
if __name__ == '__main__':
    item_price = 19.99
    item_quantity = 3
    tax_rate = 0.10
    
    subtotal = calculate_subtotal(item_price, item_quantity)
    tax = calculate_tax(subtotal, tax_rate)
    total = calculate_total(subtotal, tax)
    
    print(f"Subtotal: {format_currency(subtotal)}")
    print(f"Tax (10%): {format_currency(tax)}")
    print(f"Total: {format_currency(total)}")

# Output:
# Subtotal: $59.97
# Tax (10%): $6.00
# Total: $65.97

```

///

**Design principles demonstrated**:

- **Small, focused functions**: Each does one calculation

- **Pure functions**: No side effects, same inputs always produce same outputs

- **Composability**: Functions work together to solve larger problem

- **Clear names**: Function names describe exactly what they do

- **Easy testing**: Each function can be tested with known inputs/outputs

## Practice exercises

### Foundation practice

/// details | Exercise 1: Basic function creation
    type: question
    open: false

Convert this pseudocode to a Python function:

```
FUNCTION calculate_circle_area(radius)
    area ← 3.14159 × radius × radius
    RETURN area
END FUNCTION

```

Test your function with radiuses: 5, 10, and 2.5

/// details | Sample Solution
    type: success
    open: false

```python
def calculate_circle_area(radius):
    """Calculate the area of a circle given its radius."""
    area = 3.14159 * radius * radius
    return area

# Test cases
print(calculate_circle_area(5))     # 78.53975
print(calculate_circle_area(10))    # 314.159
print(calculate_circle_area(2.5))   # 19.6349375

# Improved version using math.pi
import math

def calculate_circle_area(radius):
    """Calculate the area of a circle given its radius."""
    return math.pi * radius ** 2

print(calculate_circle_area(5))     # 78.53981633974483

```

///
///

/// details | Exercise 2: Function with multiple parameters
    type: question
    open: false

Create a function `calculate_bmi(weight_kg, height_m)` that:

1. Calculates BMI using formula: weight / (height × height)

2. Returns the BMI rounded to 1 decimal place

Test with: weight=70kg, height=1.75m (expected BMI: 22.9)

/// details | Sample Solution
    type: success
    open: false

```python-exec
def calculate_bmi(weight_kg, height_m):
    """Calculate Body Mass Index from weight and height.
    
    Args:
        weight_kg: Weight in kilograms
        height_m: Height in meters
    
    Returns:
        BMI rounded to 1 decimal place
    """
    bmi = weight_kg / (height_m * height_m)
    return round(bmi, 1)

# Test
result = calculate_bmi(70, 1.75)
print(f"BMI: {result}")  # BMI: 22.9

# Additional tests
print(calculate_bmi(80, 1.80))  # 24.7
print(calculate_bmi(60, 1.65))  # 22.0

```

///
///

### Intermediate practice

/// details | Exercise 3: Function composition
    type: question
    open: false

Create three functions that work together:

1. `is_passing_grade(score)` - returns True if score >= 50, False otherwise

2. `count_passing_students(scores)` - returns count of passing scores in a list

3. `calculate_pass_rate(scores)` - returns percentage of students passing

Test with: `[45, 67, 89, 34, 56, 78, 90, 23, 67, 81]`

/// details | Sample Solution
    type: success
    open: false

```python-exec
def is_passing_grade(score):
    """Check if a score is a passing grade (>= 50)."""
    return score >= 50

def count_passing_students(scores):
    """Count how many scores are passing grades."""
    count = 0
    for score in scores:
        if is_passing_grade(score):
            count += 1
    return count

def calculate_pass_rate(scores):
    """Calculate the percentage of students with passing grades."""
    if len(scores) == 0:
        return 0.0
    
    passing_count = count_passing_students(scores)
    pass_rate = (passing_count / len(scores)) * 100
    return round(pass_rate, 1)

# Test
test_scores = [45, 67, 89, 34, 56, 78, 90, 23, 67, 81]

print(f"Passing students: {count_passing_students(test_scores)}")  # 7
print(f"Pass rate: {calculate_pass_rate(test_scores)}%")           # 70.0%

# Alternative using list comprehension (more Pythonic)
def count_passing_students(scores):
    """Count how many scores are passing grades."""
    return sum(1 for score in scores if is_passing_grade(score))

```

///
///

/// details | Exercise 4: Input validation function
    type: question
    open: false

Create a function `get_valid_score()` that:

1. Prompts the user for a test score

2. Validates the score is between 0 and 100

3. Keeps asking until valid input is received

4. Returns the valid score

Include a helper function `is_valid_score(score)` for validation.

/// details | Sample Solution
    type: success
    open: false

```python
def is_valid_score(score):
    """Check if score is within valid range (0-100)."""
    return 0 <= score <= 100

def get_valid_score():
    """Prompt user for a valid test score (0-100)."""
    while True:
        try:
            score = float(input("Enter test score (0-100): "))
            
            if is_valid_score(score):
                return score
            else:
                print("Score must be between 0 and 100.")
        
        except ValueError:
            print("Please enter a valid number.")

# Main execution
if __name__ == '__main__':
    student_score = get_valid_score()
    print(f"Valid score entered: {student_score}")

# Example interaction:
# Enter test score (0-100): 150
# Score must be between 0 and 100.
# Enter test score (0-100): abc
# Please enter a valid number.
# Enter test score (0-100): 85.5
# Valid score entered: 85.5

```

///
///

### Advanced practice

/// details | Exercise 5: Complete grade system
    type: question
    open: false

Build a complete grade calculation system with these functions:

1. `calculate_weighted_average(assignments, tests, exam)` - weights: 30%, 40%, 30%

2. `get_letter_grade(average)` - A: 90+, B: 80+, C: 70+, D: 60+, F: below 60

3. `format_grade_report(name, assignments, tests, exam)` - creates formatted report

4. `is_honor_roll(average)` - True if average >= 85

Create a complete program that uses all functions together.

/// details | Sample Solution
    type: success
    open: false

```python
def calculate_weighted_average(assignments, tests, exam):
    """Calculate weighted average from three components.
    
    Args:
        assignments: Assignments average (weighted 30%)
        tests: Tests average (weighted 40%)
        exam: Final exam score (weighted 30%)
    
    Returns:
        Weighted average rounded to 1 decimal place
    """
    weighted = assignments * 0.30 + tests * 0.40 + exam * 0.30
    return round(weighted, 1)

def get_letter_grade(average):
    """Convert numeric average to letter grade."""
    if average >= 90:
        return 'A'
    elif average >= 80:
        return 'B'
    elif average >= 70:
        return 'C'
    elif average >= 60:
        return 'D'
    else:
        return 'F'

def is_honor_roll(average):
    """Check if student qualifies for honor roll (average >= 85)."""
    return average >= 85

def format_grade_report(name, assignments, tests, exam):
    """Create a formatted grade report for a student."""
    average = calculate_weighted_average(assignments, tests, exam)
    letter = get_letter_grade(average)
    honor = is_honor_roll(average)
    
    report = f"""
{'='*40}
STUDENT GRADE REPORT
{'='*40}
Name: {name}
{'='*40}
Assignments (30%): {assignments}
Tests (40%):       {tests}
Final Exam (30%):  {exam}
{'='*40}
Weighted Average:  {average}
Letter Grade:      {letter}
Honor Roll:        {'Yes' if honor else 'No'}
{'='*40}
"""
    return report

# Main program
def process_student_grade():
    """Process and display a student's final grade."""
    print("Student Grade Calculator")
    print("=" * 40)
    
    name = input("Student name: ")
    assignments = float(input("Assignments average: "))
    tests = float(input("Tests average: "))
    exam = float(input("Final exam score: "))
    
    report = format_grade_report(name, assignments, tests, exam)
    print(report)

# Test with sample data
if __name__ == '__main__':
    # Automated test
    sample_report = format_grade_report("Alice Smith", 92, 88, 95)
    print(sample_report)
    
    # Interactive mode (uncomment to use)
    # process_student_grade()

# Output:
# ========================================
# STUDENT GRADE REPORT
# ========================================
# Name: Alice Smith
# ========================================
# Assignments (30%): 92
# Tests (40%):       88
# Final Exam (30%):  95
# ========================================
# Weighted Average:  90.9
# Letter Grade:      A
# Honor Roll:        Yes
# ========================================

```

///
///

## Common pitfalls

### 1. Forgetting to return a value

```python-exec
# ❌ Wrong - function doesn't return anything
def calculate_total(price, tax):
    """Calculate total price including tax."""
    total = price + tax
    # Missing return statement!

result = calculate_total(100, 10)
print(result)  # None (not what we wanted!)

# ✅ Correct
def calculate_total(price, tax):
    """Calculate total price including tax."""
    total = price + tax
    return total  # or: return price + tax

```

### 2. Using print instead of return

```python-exec
# ❌ Wrong - prints but doesn't return
def double(number):
    """Double a number."""
    print(number * 2)  # This just displays, doesn't return!

result = double(5)
print(result)  # None
# Can't use the value in calculations!

# ✅ Correct
def double(number):
    """Double a number."""
    return number * 2

result = double(5)
print(result)  # 10
# Can use in calculations: result * 3, etc.

```

### 3. Modifying parameters (mutation)

```python
# ⚠️ Be careful with mutable parameters
def add_item(shopping_list, item):
    """Add item to shopping list."""
    shopping_list.append(item)  # Modifies the original list!
    return shopping_list

my_list = ['bread', 'milk']
new_list = add_item(my_list, 'eggs')
# Both my_list and new_list now contain 'eggs'

# Better approach - create new list
def add_item(shopping_list, item):
    """Add item to shopping list (returns new list)."""
    return shopping_list + [item]  # Creates new list

my_list = ['bread', 'milk']
new_list = add_item(my_list, 'eggs')
# my_list unchanged, new_list has 'eggs'

```

### 4. Too many responsibilities

```python-template
# ❌ Function does too much
def process_everything(data):
    """Process, validate, calculate, format, and save data."""
    # validation
    # calculation
    # formatting
    # file I/O
    # error handling
    # This is too complex!

# ✅ Break into smaller functions
def validate_data(data):
    """Validate data is in correct format."""
    pass

def calculate_result(data):
    """Perform calculations on validated data."""
    pass

def format_output(result):
    """Format result for display."""
    pass

def save_to_file(output, filename):
    """Save output to file."""
    pass

```

## Recap

Functions are the building blocks of well-organized programs. Here's what you've learned:

**Function basics**:

- Use `def` to define functions with parameters

- Use `return` to send values back to the caller

- Functions without `return` act like procedures

- Always include docstrings to explain what functions do

**Parameter passing**:

- Positional parameters: order matters

- Default parameters: provide fallback values

- Keyword arguments: specify by name for clarity

**Design principles**:

- One logical task per function (Single Responsibility Principle)

- Small, focused functions are easier to test and reuse

- Pure functions (no side effects) are easier to reason about

- Compose small functions to solve complex problems

**Common patterns**:

- Validation functions: check if data is valid

- Calculation functions: perform computations

- Formatting functions: prepare data for display

- Helper functions: support main program logic

**Next steps**: Now that you can organize code into functions, you'll learn to use standard Python modules (Section 4.4) to access pre-built functions for common tasks like math operations and random number generation.

Remember: Good functions are like good tools—each does one job well, and they work great together!
