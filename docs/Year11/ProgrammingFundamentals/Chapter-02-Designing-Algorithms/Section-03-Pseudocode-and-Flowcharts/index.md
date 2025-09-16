# Pseudocode and Flowcharts

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Write clear, readable pseudocode using standard patterns
    - Create flowcharts using PlantUML activity diagrams
    - Convert between algorithms, pseudocode, and flowcharts
    - Use proper conventions for documenting algorithm logic
    - Represent complex control structures visually

## Introduction

Once you've analyzed an algorithm's inputs, outputs, and purpose, you need to express the logic clearly. Two main tools help communicate algorithms effectively:

- **Pseudocode**: Structured English that describes steps without language-specific syntax

- **Flowcharts**: Visual diagrams that show the flow of logic through shapes and arrows

Both methods bridge the gap between human thinking and computer code.

## Pseudocode Patterns

**Pseudocode** uses everyday language with programming structure to describe algorithms clearly. It follows consistent patterns that anyone can read, regardless of their programming language experience.

### Basic Structure

```text
ALGORITHM AlgorithmName
BEGIN
    // Algorithm steps go here
END
```

### Sequence Pattern

For steps that happen one after another:

```text
ALGORITHM MakeTea
BEGIN
    Boil water
    Add tea bag to cup
    Pour hot water into cup
    Wait 3 minutes
    Remove tea bag
    Add milk if desired
END
```

### Input/Output Patterns

```text
INPUT variableName
OUTPUT message
OUTPUT variableName
OUTPUT "literal text"
```

**Example:**

```text
ALGORITHM GreetUser
BEGIN
    OUTPUT "What is your name?"
    INPUT userName
    OUTPUT "Hello, " + userName + "!"
END
```

### Variable Assignment Pattern

```text
SET variableName = expression
```

**Examples:**

```text
SET total = price + tax
SET average = (num1 + num2 + num3) / 3
SET isValid = (age >= 18) AND (hasLicense = true)
```

### Selection Patterns

/// details | Simple IF
    type: note
    open: false

```text
IF condition THEN
    statements
END IF
```
///

/// details | IF-ELSE
    type: note
    open: false

```text
IF condition THEN
    statements for true
ELSE
    statements for false
END IF
```
///

/// details | IF-ELSE IF-ELSE
    type: note
    open: false

```text
IF condition1 THEN
    statements for condition1
ELSE IF condition2 THEN
    statements for condition2
ELSE
    statements for all other cases
END IF
```

**Example: Grade Calculator**

```text
ALGORITHM DetermineGrade
BEGIN
    INPUT score
    
    IF score >= 90 THEN
        SET grade = "A"
    ELSE IF score >= 80 THEN
        SET grade = "B"
    ELSE IF score >= 70 THEN
        SET grade = "C"
    ELSE IF score >= 60 THEN
        SET grade = "D"
    ELSE
        SET grade = "F"
    END IF
    
    OUTPUT "Your grade is: " + grade
END
```
///

### Iteration Patterns

/// details | WHILE Loop
    type: note
    open: false

```text
WHILE condition DO
    statements
END WHILE
```
///

/// details | FOR Loop
    type: note
    open: false

```text
FOR variable = start TO end DO
    statements
END FOR
```
///

/// details | FOR EACH Loop
    type: note
    open: false

```text
FOR EACH item IN collection DO
    statements
END FOR
```

**Example: Find Maximum**

```text
ALGORITHM FindMaximum
BEGIN
    INPUT numbers (list)
    SET maximum = first number in list
    
    FOR EACH number IN numbers DO
        IF number > maximum THEN
            SET maximum = number
        END IF
    END FOR
    
    OUTPUT "The maximum is: " + maximum
END
```
///

## Flowcharts with PlantUML Activity Diagrams

**Flowcharts** use standardized shapes connected by arrows to show algorithm flow visually. PlantUML activity diagrams provide a text-based way to create professional flowcharts.

### Basic PlantUML Activity Syntax

```kroki-plantuml
@startuml
start
:Step 1;
:Step 2;
:Step 3;
stop
@enduml
```

### Input/Output Shapes

```kroki-plantuml
@startuml
start
:INPUT username;
:Calculate result;
:OUTPUT result;
stop
@enduml
```

### Decision (Selection) Shapes

```kroki-plantuml
@startuml
start
:INPUT age;
if (age >= 18?) then (yes)
  :OUTPUT "You can vote";
else (no)
  :OUTPUT "Too young to vote";
endif
stop
@enduml
```

### Multiple Conditions

```kroki-plantuml
@startuml
start
:INPUT score;
if (score >= 90?) then (yes)
  :grade = "A";
elseif (score >= 80?) then (yes)
  :grade = "B";
elseif (score >= 70?) then (yes)
  :grade = "C";
elseif (score >= 60?) then (yes)
  :grade = "D";
else (no)
  :grade = "F";
endif
:OUTPUT grade;
stop
@enduml
```

### Loops in Flowcharts

/// details | WHILE Loop
    type: note
    open: false

```kroki-plantuml
@startuml
start
:SET count = 1;
while (count <= 5?) is (yes)
  :OUTPUT count;
  :SET count = count + 1;
endwhile (no)
stop
@enduml
```
///

/// details | FOR Loop
    type: note
    open: false

```kroki-plantuml
@startuml
start
:INPUT numbers (list);
:SET maximum = first number;
:SET i = 1;
while (i < length of numbers?) is (yes)
  if (numbers[i] > maximum?) then (yes)
    :SET maximum = numbers[i];
  endif
  :SET i = i + 1;
endwhile (no)
:OUTPUT maximum;
stop
@enduml
```
///

## Complete Example: Password Strength Checker

Let's see the same algorithm expressed in both pseudocode and flowchart form:

### Pseudocode Version

```text
ALGORITHM CheckPasswordStrength
BEGIN
    OUTPUT "Enter your password:"
    INPUT password
    
    SET length = length of password
    SET hasUpper = false
    SET hasLower = false
    SET hasDigit = false
    SET hasSpecial = false
    
    FOR EACH character IN password DO
        IF character is uppercase letter THEN
            SET hasUpper = true
        ELSE IF character is lowercase letter THEN
            SET hasLower = true
        ELSE IF character is digit THEN
            SET hasDigit = true
        ELSE IF character is special symbol THEN
            SET hasSpecial = true
        END IF
    END FOR
    
    SET strengthCount = 0
    
    IF length >= 8 THEN
        SET strengthCount = strengthCount + 1
    END IF
    
    IF hasUpper = true THEN
        SET strengthCount = strengthCount + 1
    END IF
    
    IF hasLower = true THEN
        SET strengthCount = strengthCount + 1
    END IF
    
    IF hasDigit = true THEN
        SET strengthCount = strengthCount + 1
    END IF
    
    IF hasSpecial = true THEN
        SET strengthCount = strengthCount + 1
    END IF
    
    IF strengthCount >= 4 THEN
        OUTPUT "Strong password"
    ELSE IF strengthCount >= 2 THEN
        OUTPUT "Medium password"
    ELSE
        OUTPUT "Weak password"
    END IF
END
```

### Flowchart Version

```kroki-plantuml
@startuml
start
:OUTPUT "Enter your password:";
:INPUT password;
:SET length = length of password;
:SET hasUpper = false;
:SET hasLower = false;
:SET hasDigit = false;
:SET hasSpecial = false;
:SET i = 0;

while (i < length of password?) is (yes)
  :character = password[i];
  if (character is uppercase?) then (yes)
    :SET hasUpper = true;
  elseif (character is lowercase?) then (yes)
    :SET hasLower = true;
  elseif (character is digit?) then (yes)
    :SET hasDigit = true;
  elseif (character is special?) then (yes)
    :SET hasSpecial = true;
  endif
  :SET i = i + 1;
endwhile (no)

:SET strengthCount = 0;

if (length >= 8?) then (yes)
  :SET strengthCount = strengthCount + 1;
endif

if (hasUpper = true?) then (yes)
  :SET strengthCount = strengthCount + 1;
endif

if (hasLower = true?) then (yes)
  :SET strengthCount = strengthCount + 1;
endif

if (hasDigit = true?) then (yes)
  :SET strengthCount = strengthCount + 1;
endif

if (hasSpecial = true?) then (yes)
  :SET strengthCount = strengthCount + 1;
endif

if (strengthCount >= 4?) then (yes)
  :OUTPUT "Strong password";
elseif (strengthCount >= 2?) then (yes)
  :OUTPUT "Medium password";
else (no)
  :OUTPUT "Weak password";
endif

stop
@enduml
```

## Pseudocode Style Guidelines

### 1. Use Clear, Descriptive Names

**Good:**
```text
SET totalPrice = itemPrice + tax + shipping
SET isEligibleForDiscount = (age >= 65) OR (isStudent = true)
```

**Avoid:**
```text
SET x = a + b + c
SET flag = (n >= 65) OR (s = true)
```

### 2. Indent Consistently

**Good:**
```text
IF weather = "sunny" THEN
    IF temperature > 20 THEN
        OUTPUT "Perfect day for a picnic!"
    ELSE
        OUTPUT "Sunny but too cold"
    END IF
ELSE
    OUTPUT "Not ideal weather"
END IF
```

**Avoid:**
```text
IF weather = "sunny" THEN
IF temperature > 20 THEN
OUTPUT "Perfect day for a picnic!"
ELSE
OUTPUT "Sunny but too cold"
END IF
ELSE
OUTPUT "Not ideal weather"
END IF
```

### 3. One Action Per Line

**Good:**
```text
INPUT firstName
INPUT lastName
SET fullName = firstName + " " + lastName
OUTPUT fullName
```

**Avoid:**
```text
INPUT firstName, INPUT lastName, SET fullName = firstName + " " + lastName, OUTPUT fullName
```

### 4. Use Comments for Complex Logic

```text
// Calculate compound interest: A = P(1 + r/n)^(nt)
SET amount = principal * (1 + rate/compoundFrequency)^(compoundFrequency * years)
```

## Converting Between Representations

### From Natural Language to Pseudocode

**Natural Language:**
"Ask the user for three numbers. Find the largest number and display it."

**Pseudocode:**
```text
ALGORITHM FindLargestOfThree
BEGIN
    OUTPUT "Enter three numbers:"
    INPUT num1
    INPUT num2
    INPUT num3
    
    SET largest = num1
    
    IF num2 > largest THEN
        SET largest = num2
    END IF
    
    IF num3 > largest THEN
        SET largest = num3
    END IF
    
    OUTPUT "The largest number is: " + largest
END
```

### From Pseudocode to Flowchart

Take the pseudocode above and convert it:

```kroki-plantuml
@startuml
start
:OUTPUT "Enter three numbers:";
:INPUT num1;
:INPUT num2;
:INPUT num3;
:SET largest = num1;
if (num2 > largest?) then (yes)
  :SET largest = num2;
endif
if (num3 > largest?) then (yes)
  :SET largest = num3;
endif
:OUTPUT "The largest number is: " + largest;
stop
@enduml
```

## Practice Activity: Library Book System

Let's create both pseudocode and flowchart for a library book borrowing system that builds on the control structures from Section 2.1:

### Requirements

1. Ask for the user's library card number

2. Ask for the book ID they want to borrow

3. Check if the user has any overdue books

4. Check if the book is available

5. If both checks pass, allow borrowing and set due date

6. If either check fails, explain why borrowing is denied

### Your Task: Complete the Pseudocode

```text
ALGORITHM LibraryBookBorrowing
BEGIN
    OUTPUT "Welcome to the Library System"
    
    // Get user information
    OUTPUT "Enter your library card number:"
    INPUT cardNumber
    
    OUTPUT "Enter the book ID you want to borrow:"
    INPUT bookID
    
    // Check user status
    // TODO: Add pseudocode to check for overdue books
    // (Hint: use a boolean variable hasOverdueBooks)
    
    // Check book availability
    // TODO: Add pseudocode to check if book is available
    // (Hint: use a boolean variable isBookAvailable)
    
    // Make borrowing decision
    // TODO: Add selection structure to handle four cases:
    // 1. Both checks pass - allow borrowing
    // 2. Has overdue books - deny with message
    // 3. Book not available - deny with message
    // 4. Both problems - deny with both messages
    
END
```

### Solution

```text
ALGORITHM LibraryBookBorrowing
BEGIN
    OUTPUT "Welcome to the Library System"
    
    OUTPUT "Enter your library card number:"
    INPUT cardNumber
    
    OUTPUT "Enter the book ID you want to borrow:"
    INPUT bookID
    
    // Check user status (simplified - in real system would query database)
    OUTPUT "Do you have any overdue books? (true/false):"
    INPUT hasOverdueBooks
    
    // Check book availability (simplified - in real system would query catalog)
    OUTPUT "Is the book available? (true/false):"
    INPUT isBookAvailable
    
    // Make borrowing decision
    IF hasOverdueBooks = false AND isBookAvailable = true THEN
        OUTPUT "Book borrowed successfully!"
        OUTPUT "Due date: 2 weeks from today"
    ELSE IF hasOverdueBooks = true AND isBookAvailable = false THEN
        OUTPUT "Cannot borrow: You have overdue books AND the book is not available"
    ELSE IF hasOverdueBooks = true THEN
        OUTPUT "Cannot borrow: Please return your overdue books first"
    ELSE IF isBookAvailable = false THEN
        OUTPUT "Cannot borrow: Book is currently checked out"
    END IF
END
```

### Flowchart Version

```kroki-plantuml
@startuml
start
:OUTPUT "Welcome to the Library System";
:OUTPUT "Enter your library card number:";
:INPUT cardNumber;
:OUTPUT "Enter the book ID you want to borrow:";
:INPUT bookID;
:OUTPUT "Do you have any overdue books? (true/false):";
:INPUT hasOverdueBooks;
:OUTPUT "Is the book available? (true/false):";
:INPUT isBookAvailable;

if (hasOverdueBooks = false AND isBookAvailable = true?) then (yes)
  :OUTPUT "Book borrowed successfully!";
  :OUTPUT "Due date: 2 weeks from today";
elseif (hasOverdueBooks = true AND isBookAvailable = false?) then (yes)
  :OUTPUT "Cannot borrow: You have overdue books AND the book is not available";
elseif (hasOverdueBooks = true?) then (yes)
  :OUTPUT "Cannot borrow: Please return your overdue books first";
else (no)
  :OUTPUT "Cannot borrow: Book is currently checked out";
endif

stop
@enduml
```

## Common Pseudocode Patterns Summary

| Pattern | Template | Example |
|---------|----------|---------|
| **Sequence** | Step1, Step2, Step3 | Boil water, Add tea, Pour water |
| **Input** | INPUT variableName | INPUT userName |
| **Output** | OUTPUT message | OUTPUT "Hello " + userName |
| **Assignment** | SET var = expression | SET total = price + tax |
| **Simple IF** | IF condition THEN ... END IF | IF age >= 18 THEN ... |
| **IF-ELSE** | IF condition THEN ... ELSE ... END IF | IF score >= 60 THEN pass ELSE fail |
| **WHILE** | WHILE condition DO ... END WHILE | WHILE count < 10 DO ... |
| **FOR** | FOR var = start TO end DO ... END FOR | FOR i = 1 TO 5 DO ... |

## When to Use Each Representation

### Use Pseudocode When:

- Planning algorithm logic before coding

- Communicating with non-programmers

- Documenting algorithm steps clearly

- Working through complex logic problems

- Teaching algorithmic thinking

### Use Flowcharts When:

- Visualizing decision paths

- Showing complex branching logic

- Training or presenting to visual learners

- Debugging logic flow problems

- Documenting system processes

### Use Both When:

- Complex algorithms need multiple perspectives

- Teaching algorithm design

- Formal documentation requirements

- Peer review and collaboration

## Summary

**Pseudocode provides structured English for describing algorithms:**

**Key Patterns:**

- Sequence: steps in order

- Selection: IF-THEN-ELSE structures

- Iteration: WHILE and FOR loops

- Clear variable names and consistent indentation

**Flowcharts visualize algorithm flow using standard shapes:**

**PlantUML Activity Diagrams:**

- start/stop for beginning and end

- :action; for process steps

- if/then/else for decisions

- while/endwhile for loops

**Both methods help bridge the gap between human thinking and computer code, making algorithms easier to understand, verify, and implement.**

!!! tip "Cross-reference"
    This section builds on the control structures from Section 2.1 and the analysis techniques from Section 2.2, providing clear ways to document the algorithms you design.

!!! tip "Next Section"
    In Section 2.4, we'll learn about structure charts and how to break complex problems into smaller, manageable parts.
