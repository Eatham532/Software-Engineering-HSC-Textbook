---
title: "I/O and Purpose; Desk and Peer Checking"
---

# I/O and Purpose; Desk and Peer Checking

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Determine the inputs and outputs of an algorithm
    - Identify the purpose of a given algorithm
    - Perform desk checking to trace through algorithms step by step
    - Conduct peer checking to verify algorithm logic
    - Record expected outputs for different execution paths

## Introduction

Before writing code, good programmers carefully analyze algorithms to understand:

- **What goes in** (inputs)

- **What comes out** (outputs)

- **What the algorithm does** (purpose)

- **How it works** (logic verification through checking)

This analysis helps catch errors early and ensures the algorithm solves the intended problem correctly.

## Determining Inputs and Outputs

### What are inputs?

**Inputs** are the data that an algorithm receives to work with. They can come from:

- User typing at the keyboard

- Files on the computer

- Sensors or other devices

- Other parts of the program

- Fixed values in the code

### What are outputs?

**Outputs** are the results that an algorithm produces. They can be:

- Text displayed on screen

- Data saved to files

- Values returned to other parts of the program

- Signals sent to devices

- Changes made to stored data

/// details | Example: Grade Calculator Algorithm
    type: example
    open: false

```kroki-plantuml
@startuml
start
:INPUT studentName;
:INPUT assignment1;
:INPUT assignment2;
:INPUT finalExam;
:average = (assignment1 + assignment2 + finalExam) / 3;
if (average >= 90?) then (yes)
  :grade = "A";
elseif (average >= 80?) then (yes)
  :grade = "B";
elseif (average >= 70?) then (yes)
  :grade = "C";
elseif (average >= 60?) then (yes)
  :grade = "D";
else (no)
  :grade = "F";
endif
:OUTPUT studentName + " earned grade: " + grade;
:OUTPUT "Average score: " + average;
stop
@enduml

```

**Algorithm:**

```
ALGORITHM CalculateGrade
BEGIN
    INPUT studentName     // Input: student's name (string)
    INPUT assignment1     // Input: first assignment score (number)
    INPUT assignment2     // Input: second assignment score (number)
    INPUT finalExam       // Input: final exam score (number)
    
    SET average = (assignment1 + assignment2 + finalExam) / 3
    
    IF average >= 90 THEN
        SET grade = "A"
    ELSE IF average >= 80 THEN
        SET grade = "B"
    ELSE IF average >= 70 THEN
        SET grade = "C"
    ELSE IF average >= 60 THEN
        SET grade = "D"
    ELSE
        SET grade = "F"
    END IF
    
    OUTPUT studentName + " earned grade: " + grade    // Output: formatted result (string)
    OUTPUT "Average score: " + average               // Output: numerical average
END

```

**Analysis:**

| Inputs | Type | Source |
|--------|------|--------|
| studentName | String | User input |
| assignment1 | Number (0-100) | User input |
| assignment2 | Number (0-100) | User input |
| finalExam | Number (0-100) | User input |

| Outputs | Type | Destination |
|---------|------|-------------|
| Student name and grade | String | Screen display |
| Average score | Number | Screen display |

///

## Determining Algorithm Purpose

The **purpose** is the problem the algorithm is designed to solve. To identify it:

1. **Read the algorithm carefully**

2. **Look at the inputs and outputs**

3. **Follow the main logic**

4. **Summarize in one clear sentence**

### Example Purposes:

| Algorithm | Purpose |
|-----------|---------|
| Grade Calculator (above) | Calculate and display a student's letter grade based on assignment and exam scores |
| Password Checker | Verify if an entered password meets security requirements |
| Shopping Cart Total | Add up item prices and calculate total cost including tax |
| Temperature Converter | Convert temperature values between Celsius and Fahrenheit |

## Desk Checking

**Desk checking** means manually tracing through an algorithm step-by-step using specific input values to verify it works correctly.

### How to Desk Check:

1. **Choose test inputs** (including edge cases)

2. **Create a trace table** with columns for variables

3. **Work through each step** of the algorithm

4. **Record how variables change**

5. **Note the final outputs**

6. **Verify outputs match expectations**

/// details | Desk Check Example: Grade Calculator
    type: example
    open: false

Let's trace through with inputs: studentName="Alice", assignment1=85, assignment2=92, finalExam=78

| Step | Action | studentName | assignment1 | assignment2 | finalExam | average | grade | Output |
|------|--------|-------------|-------------|-------------|-----------|---------|-------|---------|
| 1 | INPUT studentName | "Alice" | - | - | - | - | - | - |
| 2 | INPUT assignment1 | "Alice" | 85 | - | - | - | - | - |
| 3 | INPUT assignment2 | "Alice" | 85 | 92 | - | - | - | - |
| 4 | INPUT finalExam | "Alice" | 85 | 92 | 78 | - | - | - |
| 5 | Calculate average | "Alice" | 85 | 92 | 78 | 85.0 | - | - |
| 6 | Check: 85 >= 90? | "Alice" | 85 | 92 | 78 | 85.0 | - | - |
| 7 | False, check: 85 >= 80? | "Alice" | 85 | 92 | 78 | 85.0 | - | - |
| 8 | True, set grade = "B" | "Alice" | 85 | 92 | 78 | 85.0 | "B" | - |
| 9 | OUTPUT grade message | "Alice" | 85 | 92 | 78 | 85.0 | "B" | "Alice earned grade: B" |
| 10 | OUTPUT average | "Alice" | 85 | 92 | 78 | 85.0 | "B" | "Average score: 85.0" |

**Expected Outputs:**

- "Alice earned grade: B"

- "Average score: 85.0"

///

### Testing Different Branches

It's important to test different paths through selection structures:

**Test Case 1: A Grade**

- Inputs: assignment1=95, assignment2=93, finalExam=97

- Average: 95.0

- Expected grade: "A"

**Test Case 2: F Grade**

- Inputs: assignment1=45, assignment2=52, finalExam=48

- Average: 48.3

- Expected grade: "F"

**Test Case 3: Boundary Value**

- Inputs: assignment1=80, assignment2=80, finalExam=80

- Average: 80.0

- Expected grade: "B" (exactly on the boundary)

## Peer Checking

**Peer checking** involves having another person review your algorithm to catch errors you might miss.

### Benefits of Peer Checking:

- **Fresh eyes** spot problems you've become blind to

- **Different perspectives** reveal edge cases

- **Improved clarity** from explaining your logic

- **Better algorithms** through collaborative improvement

### How to Conduct Peer Checking:

/// details | As the Author:
    type: note
    open: false

1. **Explain the purpose** of your algorithm

2. **Walk through the logic** step by step

3. **Show your desk check results**

4. **Ask specific questions** about unclear parts

5. **Listen to feedback** without being defensive

///
///

/// details | As the Reviewer:
    type: note
    open: false

1. **Ask about the purpose** - is it clear?

2. **Check the logic flow** - does it make sense?

3. **Look for edge cases** - what could go wrong?

4. **Verify the desk check** - do you get the same results?

5. **Suggest improvements** constructively

///

### Peer Checking Checklist:

| Check | Question | ✓ |
|-------|----------|---|
| **Purpose** | Is the algorithm's goal clear? | |
| **Inputs** | Are all necessary inputs identified? | |
| **Outputs** | Do outputs solve the intended problem? | |
| **Logic** | Does the flow make logical sense? | |
| **Completeness** | Are all cases handled? | |
| **Edge Cases** | What happens with unusual inputs? | |
| **Efficiency** | Could this be done more simply? | |

## Practice Activity: Desk Checking Two Branches

Let's practice with this password strength checker that builds on the selection structures from Section 2.1:

```kroki-plantuml
@startuml
start
:INPUT password;
:length = length of password;
:hasUpper = false;
:hasDigit = false;
:i = 0;
while (i < length of password?) is (yes)
  if (character at position i is uppercase?) then (yes)
    :hasUpper = true;
  endif
  if (character at position i is digit?) then (yes)
    :hasDigit = true;
  endif
  :i = i + 1;
endwhile (no)
if (length >= 8 AND hasUpper = true AND hasDigit = true?) then (yes)
  :OUTPUT "Strong password";
else (no)
  :OUTPUT "Weak password";
endif
stop
@enduml

```

**Algorithm:**

```
ALGORITHM CheckPasswordStrength
BEGIN
    INPUT password
    SET length = length of password
    SET hasUpper = false
    SET hasDigit = false
    
    FOR each character in password DO
        IF character is uppercase letter THEN
            SET hasUpper = true
        END IF
        IF character is digit THEN
            SET hasDigit = true
        END IF
    END FOR
    
    IF length >= 8 AND hasUpper = true AND hasDigit = true THEN
        OUTPUT "Strong password"
    ELSE
        OUTPUT "Weak password"
    END IF
END

```

### Your Task: Desk Check Two Branches

Complete trace tables for both test cases and record the expected outputs:

**Test 1 (Strong Branch):** password = "MyPass123"

| Step | Action | password | length | hasUpper | hasDigit | character | Expected Output |
|------|--------|----------|--------|----------|----------|-----------|-----------------|
| 1 | INPUT password | "MyPass123" | | | | | |
| 2 | Calculate length | "MyPass123" | 9 | | | | |
| 3 | Initialize flags | "MyPass123" | 9 | false | false | | |
| 4 | Check 'M' | "MyPass123" | 9 | true | false | 'M' | |
| 5 | Check 'y' | "MyPass123" | 9 | true | false | 'y' | |
| 6 | Check 'P' | "MyPass123" | 9 | true | false | 'P' | |
| 7 | Check 'a' | "MyPass123" | 9 | true | false | 'a' | |
| 8 | Check 's' | "MyPass123" | 9 | true | false | 's' | |
| 9 | Check 's' | "MyPass123" | 9 | true | false | 's' | |
| 10 | Check '1' | "MyPass123" | 9 | true | true | '1' | |
| 11 | Check '2' | "MyPass123" | 9 | true | true | '2' | |
| 12 | Check '3' | "MyPass123" | 9 | true | true | '3' | |
| 13 | Final check | "MyPass123" | 9 | true | true | | "Strong password" |

**Test 2 (Weak Branch):** password = "hello"

| Step | Action | password | length | hasUpper | hasDigit | character | Expected Output |
|------|--------|----------|--------|----------|----------|-----------|-----------------|
| 1 | INPUT password | "hello" | | | | | |
| 2 | Calculate length | "hello" | 5 | | | | |
| 3 | Initialize flags | "hello" | 5 | false | false | | |
| 4 | Check 'h' | "hello" | 5 | false | false | 'h' | |
| 5 | Check 'e' | "hello" | 5 | false | false | 'e' | |
| 6 | Check 'l' | "hello" | 5 | false | false | 'l' | |
| 7 | Check 'l' | "hello" | 5 | false | false | 'l' | |
| 8 | Check 'o' | "hello" | 5 | false | false | 'o' | |
| 9 | Final check | "hello" | 5 | false | false | | "Weak password" |

## Common Issues Found Through Checking

### Logic Errors:

- **Wrong conditions** in IF statements

- **Missing cases** in selection structures

- **Incorrect calculations** or formulas

- **Wrong order** of operations

### Input/Output Errors:

- **Missing inputs** needed for calculations

- **Unclear outputs** that don't answer the question

- **Wrong data types** for inputs or outputs

- **No validation** of input ranges

### Edge Case Problems:

- **Division by zero** not handled

- **Empty inputs** cause crashes

- **Boundary values** give unexpected results

- **Very large or small numbers** cause overflow


## Summary

**Analyzing algorithms before coding prevents errors and ensures correct solutions:**

**Input/Output Analysis:**

- Identify what data the algorithm needs

- Determine what results it should produce

- Verify inputs are sufficient for the intended outputs

**Purpose Identification:**

- Understand the problem being solved

- Express the goal in clear, simple language

- Ensure the algorithm actually addresses this goal

**Desk Checking:**

- Manually trace through algorithms step-by-step

- Test different execution paths

- Verify outputs match expectations

- Catch logic errors early

**Peer Checking:**

- Get fresh perspective on your work

- Identify issues you might miss

- Improve algorithm clarity and correctness

- Learn from others' approaches
