# 1.3 Documentation and code style

## Why it matters

Well-documented code is like a clear map for your future self and your teammates. Good documentation explains *why* the code exists, while clean code style makes it easy to read the *how*. Professional developers spend more time reading code than writing it, so readable code directly impacts productivity and reduces bugs.

Without proper documentation and style:

- **Code becomes unmaintainable** when you return to it weeks later

- **Team collaboration suffers** because others can't understand your logic

- **Debugging takes longer** without clear variable names and comments

- **Project handoffs fail** when new developers join

Good documentation and style habits save significant time and reduce frustration throughout a project's lifecycle.

## What you'll learn

- Essential README.md components for any project

- When and how to write effective docstrings

- Strategic use of inline comments

- Python naming conventions and PEP 8 basics

- How clean code reduces the need for excessive commenting

## Documentation essentials

### README.md fundamentals

Every project needs a README.md file that answers these key questions:

**What does this do?** - One sentence describing the project's purpose

**How do I run it?** - Clear steps to execute the code

**What do I need?** - Dependencies, Python version, or special setup

**How do I use it?** - Basic usage examples with expected inputs/outputs

/// details | Example README structure
    type: example
    open: false

```markdown
# Grade Calculator

A simple program that calculates the average of three test scores and assigns a letter grade.

## Requirements
- Python 3.8 or higher
- No external dependencies

## How to run
python main.py

## Usage
Enter three grades when prompted. The program calculates your average.

Example:
Enter grade 1: 85
Enter grade 2: 92  
Enter grade 3: 78
Your average: 85.0 (Grade: B)

## Files
- main.py - Main program
- grade_calculator.py - Grade calculation functions

```

///

### Docstrings for functions

Docstrings explain what a function does, its parameters, and return value. They appear immediately after the function definition in triple quotes.

**Format**: Brief description, then parameters and returns if not obvious.

```python
def calculate_average(grades):
    """Calculate the arithmetic mean of a list of grades.
    
    Args:
        grades: List of numeric grade values (0-100)
        
    Returns:
        float: The average grade rounded to one decimal place
    """
    total = sum(grades)
    return round(total / len(grades), 1)

def get_letter_grade(average):
    """Convert numeric average to letter grade using standard scale."""
    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"

```

### Strategic inline comments

Comments should explain *why*, not *what*. Good code is self-documenting for the "what".

**Good comments** - explain reasoning, edge cases, or business logic:

```python
# Using ceiling division to ensure we never under-allocate memory
buffer_size = -(-data_length // chunk_size)

# Handle the edge case where user enters no grades
if not grades:
    return 0.0  # Return 0 rather than error for empty input

# Grade boundaries follow university standard (90+ = A)
if average >= 90:
    return "A"

```

**Avoid obvious comments**:

```python
# Bad: comment just repeats the code
total = 0  # Initialize total to zero
for grade in grades:  # Loop through each grade
    total += grade  # Add grade to total

# Good: let the code speak for itself
total = 0
for grade in grades:
    total += grade

```

## Python naming conventions (PEP 8 basics)

### Variable and function names

- Use `snake_case` for variables and functions

- Choose descriptive names that explain purpose

- Avoid abbreviations unless universally understood

```python
# Good naming
student_count = 25
final_grade = calculate_weighted_average(midterm, final_exam, homework)
max_attempts = 3

# Poor naming  
sc = 25  # What does 'sc' mean?
fg = calc_avg(m, f, h)  # Cryptic abbreviations
ma = 3

```

### Constants and imports

- Use `UPPER_CASE` for constants

- Import standard library modules first, then third-party, then local modules

```python
import math
import random

# Constants at module level
MAX_GRADE = 100
MIN_GRADE = 0
PASSING_THRESHOLD = 70

def validate_grade(grade):
    """Ensure grade falls within acceptable range."""
    return MIN_GRADE <= grade <= MAX_GRADE

```

### Whitespace and formatting

- Use 4 spaces for indentation (not tabs)

- Limit lines to 79 characters when practical

- Use blank lines to separate logical sections

```python
def process_student_grades():
    """Process all student grades and generate report."""
    
    # Input validation section
    grades = get_user_input()
    if not grades:
        print("No grades entered")
        return
    
    # Calculation section  
    average = calculate_average(grades)
    letter_grade = get_letter_grade(average)
    
    # Output section
    print(f"Average: {average}")
    print(f"Letter grade: {letter_grade}")

```

## Worked example

Here's a small grade calculator demonstrating good documentation and style practices:

```python
"""
Grade Calculator - Calculate average and letter grade from three test scores.

This module demonstrates proper documentation and Python style conventions.
"""

# Constants
MAX_GRADE = 100
MIN_GRADE = 0

def get_valid_grade(prompt):
    """Get a valid grade from user input with error handling.
    
    Args:
        prompt: String to display when asking for input
        
    Returns:
        int: Valid grade between 0-100
    """
    while True:
        try:
            grade = int(input(prompt))
            
            # Validate grade range
            if MIN_GRADE <= grade <= MAX_GRADE:
                return grade
            else:
                print(f"Grade must be between {MIN_GRADE} and {MAX_GRADE}")
                
        except ValueError:
            print("Please enter a valid number")

def calculate_average(grade1, grade2, grade3):
    """Calculate arithmetic mean of three grades."""
    return round((grade1 + grade2 + grade3) / 3, 1)

def get_letter_grade(average):
    """Convert numeric average to letter grade.
    
    Uses standard 10-point scale:
    90-100: A, 80-89: B, 70-79: C, 60-69: D, Below 60: F
    """
    if average >= 90:
        return "A"
    elif average >= 80:
        return "B" 
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"

def main():
    """Main program logic."""
    print("Grade Calculator")
    print("Enter three test scores to calculate your average and letter grade.")
    
    # Get three grades from user
    grade1 = get_valid_grade("Enter grade 1 (0-100): ")
    grade2 = get_valid_grade("Enter grade 2 (0-100): ")
    grade3 = get_valid_grade("Enter grade 3 (0-100): ")
    
    # Calculate results
    average = calculate_average(grade1, grade2, grade3)
    letter = get_letter_grade(average)
    
    # Display results
    print(f"\nResults:")
    print(f"Average: {average}")
    print(f"Letter grade: {letter}")

if __name__ == "__main__":
    main()

```

### What this example demonstrates

**Good documentation practices:**

- Module docstring explains the file's purpose

- Function docstrings describe parameters and returns

- Comments explain business logic (grade scale)

- Clear variable names reduce need for comments

**Good style practices:**

- Consistent `snake_case` naming

- Constants defined at module level

- Logical grouping with blank lines

- Meaningful function and variable names

- Input validation with helpful error messages

## Practice exercises

/// details | Exercise 1: README Creation
    type: question
    open: false

Create a README.md for a "Temperature Converter" program that converts between Celsius and Fahrenheit.

**Include:**

1. Project description

2. How to run the program  

3. Usage examples with sample input/output

4. File descriptions

/// details | Sample Solution
    type: success
    open: false

```markdown
# Temperature Converter

Converts temperatures between Celsius and Fahrenheit with input validation.

## Requirements
- Python 3.7 or higher
- No external dependencies

## How to run
python temp_converter.py

## Usage
Choose conversion direction (1 for C→F, 2 for F→C) and enter temperature.

Example:
Choose conversion:
1. Celsius to Fahrenheit
2. Fahrenheit to Celsius
Enter choice (1 or 2): 1
Enter temperature in Celsius: 25
25.0°C = 77.0°F

## Files
- temp_converter.py - Main program with conversion functions

```

///
///

/// details | Exercise 2: Adding Docstrings
    type: question
    open: false

Add appropriate docstrings to this function:

```python
def calculate_compound_interest(principal, rate, time, compounds_per_year):
    amount = principal * (1 + rate/compounds_per_year) ** (compounds_per_year * time)
    return round(amount - principal, 2)

```

/// details | Sample Solution
    type: success
    open: false

```python
def calculate_compound_interest(principal, rate, time, compounds_per_year):
    """Calculate compound interest earned on an investment.
    
    Uses the compound interest formula: A = P(1 + r/n)^(nt)
    Returns the interest earned (final amount minus principal).
    
    Args:
        principal: Initial investment amount in dollars
        rate: Annual interest rate as decimal (e.g., 0.05 for 5%)
        time: Investment period in years
        compounds_per_year: Number of times interest compounds annually
        
    Returns:
        float: Interest earned, rounded to 2 decimal places
    """
    amount = principal * (1 + rate/compounds_per_year) ** (compounds_per_year * time)
    return round(amount - principal, 2)

```

///
///

/// details | Exercise 3: Style Improvements
    type: question
    open: false

Improve the naming and style of this code:

```python
def calc(x,y,z):
    a=x+y+z
    r=a/3
    if r>=90:
        g="A"
    elif r>=80:
        g="B"  
    else:
        g="F"
    return r,g

```

/// details | Sample Solution
    type: success
    open: false

```python
def calculate_grade_average(test1_score, test2_score, test3_score):
    """Calculate average of three test scores and assign letter grade."""
    total_points = test1_score + test2_score + test3_score
    average = total_points / 3
    
    # Assign letter grade based on standard scale
    if average >= 90:
        letter_grade = "A"
    elif average >= 80:
        letter_grade = "B"
    else:
        letter_grade = "F"
        
    return average, letter_grade

```

///
///

## Key principles

1. **Write for humans**: Code is read far more than it's written

2. **Be consistent**: Follow the same naming and formatting patterns throughout

3. **Explain the why**: Comments should clarify reasoning, not repeat obvious code

4. **Start with README**: Every project needs clear setup and usage instructions

5. **Document interfaces**: Function docstrings help other developers (including your future self)

Good documentation and style become automatic with practice. Start with these basics and gradually develop your own preferences within Python conventions.


## Recap

- **README.md** answers: What? How to run? Requirements? Usage examples?

- **Docstrings** explain function purpose, parameters, and returns

- **Comments** explain why, not what; good code is self-documenting

- **PEP 8 naming**: `snake_case` for variables/functions, `UPPER_CASE` for constants

- **Consistency** matters more than perfection; pick conventions and stick to them
