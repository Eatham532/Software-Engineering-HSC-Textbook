# 4.1 Control Structures in Python

## From Algorithms to Code

In Chapter 2, we learned about control structures in algorithms: sequence, selection, and iteration. Now it's time to implement these concepts in Python! This section shows you how to translate your algorithmic thinking into working Python code.

Remember the three fundamental control structures:

- **Sequence**: Instructions executed one after another

- **Selection**: Making decisions with if/else statements  

- **Iteration**: Repeating instructions with loops

## Sequence (Sequential Execution)

### What It Is

**Sequence** is the simplest control structure - instructions are executed one line after another, from top to bottom.

```python
# Simple sequence - each line executes in order
print("Starting the program...")
name = input("What's your name? ")
age = int(input("What's your age? "))
print(f"Hello {name}, you are {age} years old!")
print("Program finished.")

```text

### Grade Calculator Example

/// details | Grade Calculator Example
    type: example
    open: false

```python
# Grade calculator using sequence
print("=== Grade Calculator ===")

# Get student information
student_name = input("Enter student name: ")
subject = input("Enter subject: ")

# Get assessment scores
assignment1 = float(input("Enter Assignment 1 score (out of 100): "))
assignment2 = float(input("Enter Assignment 2 score (out of 100): "))
test_score = float(input("Enter test score (out of 100): "))

# Calculate average
total_points = assignment1 + assignment2 + test_score
average = total_points / 3

# Display results
print(f"\n--- Results for {student_name} ---")
print(f"Subject: {subject}")
print(f"Assignment 1: {assignment1}")
print(f"Assignment 2: {assignment2}")
print(f"Test Score: {test_score}")
print(f"Average: {average:.1f}")

```text

///

## Selection (Conditional Statements)

### Simple If Statements

**Selection** allows your program to make decisions and execute different code based on conditions.

```python
# Basic if statement
age = int(input("Enter your age: "))

if age >= 18:
    print("You are eligible to vote!")
    print("Don't forget to register!")

```text

### If-Else Statements

```python
# If-else provides an alternative path
score = float(input("Enter your test score: "))

if score >= 50:
    print("Congratulations! You passed!")
else:
    print("You need to retake the test.")
    print("Study hard and try again!")

```text

### If-Elif-Else (Multiple Conditions)

```python
# Multiple conditions with elif
def get_letter_grade(score):
    """Convert a numerical score to a letter grade."""
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

# Test the function
student_score = 85
letter = get_letter_grade(student_score)
print(f"Score: {student_score} = Grade: {letter}")

```text

### Nested If Statements

```python
# Nested conditions for more complex logic
age = int(input("Enter your age: "))
has_license = input("Do you have a driver's license? (yes/no): ").lower()

if age >= 16:
    if has_license == "yes":
        print("You can drive!")
    else:
        print("You're old enough, but you need a license first.")
else:
    print("You're too young to drive.")
    years_to_wait = 16 - age
    print(f"Wait {years_to_wait} more years.")

```text

### Logical Operators

```python
# Combining conditions with and, or, not
username = input("Username: ")
password = input("Password: ")
age = int(input("Age: "))

# Using 'and' - both conditions must be true
if username == "admin" and password == "secret123":
    print("Admin access granted!")

# Using 'or' - either condition can be true
if age < 13 or age > 65:
    print("You qualify for a discount!")

# Using 'not' - reverse the condition
if not (age >= 18):
    print("You are under 18")

```text

## Iteration (Loops)

### For Loops (Definite Iteration)

**For loops** are used when you know how many times you want to repeat something.

```python
# Simple for loop with range
print("Counting to 5:")
for i in range(1, 6):
    print(f"Count: {i}")

# For loop with a list
students = ["Alice", "Bob", "Charlie", "Diana"]
print("\nClass roster:")
for student in students:
    print(f"- {student}")

# For loop with string
word = "Python"
print(f"\nLetters in '{word}':")
for letter in word:
    print(letter)

```text

### Range Function Variations

```python
# Different ways to use range()

# range(stop) - starts at 0
print("0 to 4:")
for i in range(5):
    print(i, end=" ")

# range(start, stop) - custom starting point
print("\n3 to 7:")
for i in range(3, 8):
    print(i, end=" ")

# range(start, stop, step) - custom increment
print("\nEven numbers 0 to 10:")
for i in range(0, 11, 2):
    print(i, end=" ")

# Counting backwards
print("\nCountdown:")
for i in range(5, 0, -1):
    print(i, end=" ")
print("Blast off!")

```text

### While Loops (Indefinite Iteration)

**While loops** continue until a condition becomes false.

```python
# Simple while loop
count = 1
print("Counting while count <= 5:")
while count <= 5:
    print(f"Count: {count}")
    count += 1  # Same as count = count + 1

print("Done!")

```text

### Input Validation with While

```python
# Keep asking until valid input
age = -1  # Initialize with invalid value
while age < 0 or age > 120:
    age = int(input("Enter a valid age (0-120): "))
    if age < 0 or age > 120:
        print("Invalid age! Please try again.")

print(f"Thank you! You entered age: {age}")

```text

### Menu System Example

```python
# Interactive menu using while loop
def show_menu():
    print("\n=== Student Grade System ===")
    print("1. Add a grade")
    print("2. View all grades")
    print("3. Calculate average")
    print("4. Exit")

grades = []
choice = ""

while choice != "4":
    show_menu()
    choice = input("Choose an option (1-4): ")
    
    if choice == "1":
        grade = float(input("Enter grade: "))
        grades.append(grade)
        print(f"Added grade: {grade}")
    
    elif choice == "2":
        if grades:
            print("All grades:", grades)
        else:
            print("No grades entered yet.")
    
    elif choice == "3":
        if grades:
            average = sum(grades) / len(grades)
            print(f"Average grade: {average:.1f}")
        else:
            print("No grades to calculate.")
    
    elif choice == "4":
        print("Goodbye!")
    
    else:
        print("Invalid choice. Please try again.")

```text

## Mapping from Pseudocode to Python

### Example 1: Number Guessing Game

/// details | Number Guessing Game
    type: example
    open: false

/// tab | Pseudocode

```text
BEGIN NumberGuessingGame
    SET secret_number = 7
    SET guess = 0
    SET attempts = 0
    
    WHILE guess != secret_number DO
        PROMPT "Enter your guess: "
        READ guess
        SET attempts = attempts + 1
        
        IF guess < secret_number THEN
            PRINT "Too low!"
        ELIF guess > secret_number THEN
            PRINT "Too high!"
        ELSE
            PRINT "Correct!"
        END IF
    END WHILE
    
    PRINT "You won in " + attempts + " attempts!"
END

```text

///

/// tab | Python Implementation

```python
# Number guessing game
secret_number = 7
guess = 0
attempts = 0

while guess != secret_number:
    guess = int(input("Enter your guess: "))
    attempts += 1
    
    if guess < secret_number:
        print("Too low!")
    elif guess > secret_number:
        print("Too high!")
    else:
        print("Correct!")

print(f"You won in {attempts} attempts!")

```text

///
///

### Example 2: Grade Classifier

/// details | Grade Classifier
    type: example
    open: false

/// tab | Pseudocode

```text
BEGIN GradeClassifier
    FOR each student in class DO
        READ student_name
        READ student_score
        
        IF student_score >= 90 THEN
            SET grade = "A"
        ELIF student_score >= 80 THEN
            SET grade = "B"
        ELIF student_score >= 70 THEN
            SET grade = "C"
        ELIF student_score >= 60 THEN
            SET grade = "D"
        ELSE
            SET grade = "F"
        END IF
        
        PRINT student_name + ": " + grade
    END FOR
END

```text

///

/// tab | Python Implementation

```python
# Grade classifier for multiple students
students = ["Alice", "Bob", "Charlie"]
scores = [92, 78, 85]

for i in range(len(students)):
    student_name = students[i]
    student_score = scores[i]
    
    if student_score >= 90:
        grade = "A"
    elif student_score >= 80:
        grade = "B"
    elif student_score >= 70:
        grade = "C"
    elif student_score >= 60:
        grade = "D"
    else:
        grade = "F"
    
    print(f"{student_name}: {grade}")

```text

///
///

## Combining Control Structures

### Password Strength Checker

```python
def check_password_strength(password):
    """Check if password meets security requirements."""
    
    # Initialize checks
    has_upper = False
    has_lower = False
    has_digit = False
    has_special = False
    
    # Check each character in password
    for char in password:
        if char.isupper():
            has_upper = True
        elif char.islower():
            has_lower = True
        elif char.isdigit():
            has_digit = True
        elif char in "!@#$%^&*":
            has_special = True
    
    # Determine strength
    if len(password) >= 8 and has_upper and has_lower and has_digit and has_special:
        return "Strong"
    elif len(password) >= 6 and (has_upper or has_lower) and has_digit:
        return "Medium"
    else:
        return "Weak"

# Test password strength
test_passwords = ["abc", "Password1", "P@ssw0rd123"]

for password in test_passwords:
    strength = check_password_strength(password)
    print(f"'{password}' is {strength}")

```text

### Shopping Cart Calculator

```python
def shopping_cart():
    """Simple shopping cart with discount logic."""
    
    cart = []
    total = 0
    
    while True:
        print(f"\nCurrent total: ${total:.2f}")
        print("1. Add item")
        print("2. View cart")
        print("3. Checkout")
        
        choice = input("Choose option: ")
        
        if choice == "1":
            item_name = input("Item name: ")
            item_price = float(input("Item price: $"))
            cart.append({"name": item_name, "price": item_price})
            total += item_price
            print(f"Added {item_name} for ${item_price:.2f}")
        
        elif choice == "2":
            if cart:
                print("\n--- Your Cart ---")
                for item in cart:
                    print(f"- {item['name']}: ${item['price']:.2f}")
            else:
                print("Cart is empty")
        
        elif choice == "3":
            break
        
        else:
            print("Invalid choice")
    
    # Apply discount logic
    if total > 100:
        discount = total * 0.1  # 10% discount
        total -= discount
        print(f"10% discount applied: -${discount:.2f}")
    
    print(f"Final total: ${total:.2f}")
    print("Thank you for shopping!")

# Run the shopping cart
shopping_cart()

```text

## Common Patterns and Best Practices

### Input Validation Pattern

```python
def get_valid_integer(prompt, min_value=None, max_value=None):
    """Get a valid integer from user with optional range checking."""
    
    while True:
        try:
            value = int(input(prompt))
            
            # Check range if specified
            if min_value is not None and value < min_value:
                print(f"Value must be at least {min_value}")
                continue
            
            if max_value is not None and value > max_value:
                print(f"Value must be at most {max_value}")
                continue
            
            return value
        
        except ValueError:
            print("Please enter a valid integer")

# Use the validation function
age = get_valid_integer("Enter your age (0-120): ", 0, 120)
score = get_valid_integer("Enter test score (0-100): ", 0, 100)

```text

### Flag-Controlled Loop Pattern

```python
def find_target_in_list(target_list, target_value):
    """Search for a value in a list using a flag pattern."""
    
    found = False
    position = -1
    
    for i in range(len(target_list)):
        if target_list[i] == target_value:
            found = True
            position = i
            break  # Exit loop early when found
    
    if found:
        print(f"Found {target_value} at position {position}")
    else:
        print(f"{target_value} not found in list")
    
    return found, position

# Test the search function
numbers = [10, 25, 30, 45, 50]
find_target_in_list(numbers, 30)  # Found at position 2
find_target_in_list(numbers, 99)  # Not found

```text

## Practice Exercises

/// details | Exercise 1: Temperature Converter
    type: question
    open: false

Write a program that:

1. Uses a while loop for a menu

2. Converts between Celsius and Fahrenheit

3. Uses if/elif for menu choices

4. Validates input temperature ranges

/// details | Sample Solution
    type: success
    open: false

```python
def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit."""
    return (celsius * 9/5) + 32

def fahrenheit_to_celsius(fahrenheit):
    """Convert Fahrenheit to Celsius."""
    return (fahrenheit - 32) * 5/9

def main():
    while True:
        print("\nTemperature Converter Menu:")
        print("1. Celsius to Fahrenheit")
        print("2. Fahrenheit to Celsius")
        print("3. Exit")
        
        choice = input("Enter your choice (1-3): ").strip()
        
        if choice == "1":
            try:
                celsius = float(input("Enter temperature in Celsius (-273.15 to 1000): "))
                if celsius < -273.15:
                    print("Error: Temperature cannot be below absolute zero!")
                else:
                    fahrenheit = celsius_to_fahrenheit(celsius)
                    print(f"{celsius}°C = {fahrenheit:.2f}°F")
            except ValueError:
                print("Error: Please enter a valid number!")
                
        elif choice == "2":
            try:
                fahrenheit = float(input("Enter temperature in Fahrenheit (-459.67 to 1832): "))
                if fahrenheit < -459.67:
                    print("Error: Temperature cannot be below absolute zero!")
                else:
                    celsius = fahrenheit_to_celsius(fahrenheit)
                    print(f"{fahrenheit}°F = {celsius:.2f}°C")
            except ValueError:
                print("Error: Please enter a valid number!")
                
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("Error: Invalid choice. Please select 1, 2, or 3.")

if __name__ == "__main__":
    main()

```text

This program demonstrates:

- **While loop** for the main menu

- **If/elif/else** for menu choices and input validation

- **Try/except** for error handling

- **Function definitions** for the conversion logic

- **Input validation** for temperature ranges
///
///

/// details | Exercise 2: Simple ATM
    type: question
    open: false

Create an ATM simulation with:

1. PIN validation (3 attempts max)

2. Menu options: check balance, withdraw, deposit

3. Balance updates with validation

4. Loop until user chooses to exit

/// details | Sample Solution
    type: success
    open: false

```python
def main():
    # Initialize account
    correct_pin = "1234"
    balance = 1000.00
    max_attempts = 3
    
    # PIN validation
    for attempt in range(max_attempts):
        pin = input("Enter your PIN: ").strip()
        if pin == correct_pin:
            print("PIN accepted. Welcome!")
            break
        else:
            remaining = max_attempts - attempt - 1
            if remaining > 0:
                print(f"Incorrect PIN. {remaining} attempts remaining.")
            else:
                print("Too many incorrect attempts. Card blocked.")
                return
    else:
        return  # Exit if PIN validation failed
    
    # Main ATM menu
    while True:
        print(f"\nCurrent Balance: ${balance:.2f}")
        print("\nATM Menu:")
        print("1. Check Balance")
        print("2. Withdraw")
        print("3. Deposit")
        print("4. Exit")
        
        choice = input("Enter your choice (1-4): ").strip()
        
        if choice == "1":
            print(f"Your current balance is: ${balance:.2f}")
            
        elif choice == "2":
            try:
                amount = float(input("Enter withdrawal amount: $"))
                if amount <= 0:
                    print("Error: Withdrawal amount must be positive!")
                elif amount > balance:
                    print("Error: Insufficient funds!")
                else:
                    balance -= amount
                    print(f"Withdrawal successful. New balance: ${balance:.2f}")
            except ValueError:
                print("Error: Please enter a valid amount!")
                
        elif choice == "3":
            try:
                amount = float(input("Enter deposit amount: $"))
                if amount <= 0:
                    print("Error: Deposit amount must be positive!")
                else:
                    balance += amount
                    print(f"Deposit successful. New balance: ${balance:.2f}")
            except ValueError:
                print("Error: Please enter a valid amount!")
                
        elif choice == "4":
            print("Thank you for using our ATM. Goodbye!")
            break
            
        else:
            print("Error: Invalid choice. Please select 1, 2, 3, or 4.")

if __name__ == "__main__":
    main()

```text

This program demonstrates:

- **For loop** with range for PIN attempts

- **While loop** for the main menu

- **If/elif/else** for menu choices and validation

- **Try/except** for input validation

- **Break** and **return** for flow control

- **String formatting** for currency display
///
///


/// details | Exercise 3: Grade Book Manager
    type: question
    open: false

Build a grade management system:

1. Add students and their grades

2. Calculate individual and class averages

3. Find highest and lowest scores

4. Display grade distribution (A, B, C, D, F counts)

/// details | Sample Solution
    type: success
    open: false

```python
def get_letter_grade(score):
    """Convert numeric score to letter grade."""
    if score >= 90:
        return 'A'
    elif score >= 80:
        return 'B'
    elif score >= 70:
        return 'C'
    elif score >= 60:
        return 'D'
    else:
        return 'F'

def main():
    students = {}  # Dictionary to store student grades
    
    while True:
        print("\nGrade Book Manager")
        print("1. Add student and grade")
        print("2. View all students")
        print("3. Calculate class statistics")
        print("4. Exit")
        
        choice = input("Enter your choice (1-4): ").strip()
        
        if choice == "1":
            name = input("Enter student name: ").strip()
            if not name:
                print("Error: Name cannot be empty!")
                continue
                
            try:
                score = float(input("Enter grade (0-100): "))
                if score < 0 or score > 100:
                    print("Error: Grade must be between 0 and 100!")
                else:
                    students[name] = score
                    print(f"Added {name} with grade {score}")
            except ValueError:
                print("Error: Please enter a valid numeric grade!")
                
        elif choice == "2":
            if not students:
                print("No students in the grade book yet.")
            else:
                print("\nStudent Grades:")
                for name, score in students.items():
                    letter = get_letter_grade(score)
                    print(f"{name}: {score} ({letter})")
                    
        elif choice == "3":
            if not students:
                print("No students in the grade book yet.")
            else:
                # Calculate statistics
                scores = list(students.values())
                class_average = sum(scores) / len(scores)
                highest = max(scores)
                lowest = min(scores)
                
                # Grade distribution
                distribution = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0}
                for score in scores:
                    letter = get_letter_grade(score)
                    distribution[letter] += 1
                
                print("
Class Statistics:")
                print(f"Number of students: {len(students)}")
                print(f"Class average: {class_average:.2f}")
                print(f"Highest score: {highest}")
                print(f"Lowest score: {lowest}")
                print("\nGrade Distribution:")
                for grade, count in distribution.items():
                    print(f"{grade}: {count} students")
                    
        elif choice == "4":
            print("Goodbye!")
            break
            
        else:
            print("Error: Invalid choice. Please select 1, 2, 3, or 4.")

if __name__ == "__main__":
    main()

```text

This program demonstrates:

- **Dictionary** for storing student data

- **While loop** for the main menu

- **If/elif/else** for menu choices and grade validation

- **For loops** for iterating through students and calculating statistics

- **List comprehensions** and built-in functions (sum, max, min)

- **String formatting** for output display

- **Input validation** for names and scores
///
///

## Common Mistakes to Avoid

1. **Infinite loops**: Always ensure loop conditions can become false

   ```python
   # BAD - infinite loop
   count = 1
   while count <= 5:
       print(count)
       # Forgot to increment count!

   # GOOD - proper increment
   count = 1
   while count <= 5:
       print(count)
       count += 1

   ```text

2. **Off-by-one errors**: Be careful with range boundaries

   ```python
   # BAD - misses last element
   for i in range(len(my_list) - 1):
       print(my_list[i])

   # GOOD - includes all elements
   for i in range(len(my_list)):
       print(my_list[i])

   ```text

3. **Indentation errors**: Python relies on proper indentation

   ```python
   # BAD - incorrect indentation
   if score >= 90:
   print("Excellent!")  # Should be indented

   # GOOD - proper indentation
   if score >= 90:
       print("Excellent!")

   ```text

## Summary

Control structures are the building blocks of program logic:

- **Sequence**: Execute instructions in order

- **Selection**: Make decisions with if/elif/else

- **Iteration**: Repeat with for and while loops

Key points to remember:

- Translate pseudocode step-by-step to Python

- Use proper indentation for code blocks

- Validate user input to prevent errors

- Combine structures to solve complex problems

- Test edge cases and boundary conditions

---







