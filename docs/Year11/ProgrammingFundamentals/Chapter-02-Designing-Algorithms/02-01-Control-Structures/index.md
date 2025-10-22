---
title: "2.1 Control structures (sequence, selection, iteration)"
---

# 2.1 Control structures (sequence, selection, iteration)

## Why it matters

Think of algorithms like recipes. A recipe has steps you follow in order (sequence), decisions you make based on conditions (selection), and actions you repeat multiple times (iteration). These three patterns - sequence, selection, and iteration - are the building blocks of every algorithm you'll ever write.

Understanding control structures is like learning the grammar of programming. Once you master these patterns, you can express any logical process as a clear, step-by-step algorithm.

## What you'll learn

- How to use sequence, selection, and iteration in algorithms

- When to choose each control structure

- How to trace through algorithms step-by-step

- How to combine control structures to solve complex problems

!!! tip "Python Preview"
    Throughout this section, you'll see brief Python examples to help you understand how these algorithmic concepts translate to code. These are just previews - the full Python implementation is covered in Section 4.1.

## Sequence (linear steps)

Sequence is the simplest control structure - it's just doing things in order, one step after another. Like following a recipe, you complete step 1, then step 2, then step 3, and so on.

### How sequence works

```kroki-mermaid
flowchart TD
    A[Step 1: Get ingredients] --> B[Step 2: Mix ingredients]
    B --> C[Step 3: Bake for 30 minutes]
    C --> D[Step 4: Cool and serve]

```

**Key characteristics:**

- **Linear execution** - Each step happens exactly once

- **Predictable order** - Steps always happen in the same sequence

- **No decisions** - Every step always executes

- **No repetition** - Each step is done once and then you move on

/// details | Example: Making a sandwich
    type: example
    open: false

```
ALGORITHM MakeSandwich
BEGIN
    Get two slices of bread
    Spread butter on one slice
    Add filling to buttered slice
    Place second slice on top
    Cut sandwich in half
END

```

**Tracing through the sequence:**

1. **Start:** Get two slices of bread ✓

2. **Next:** Spread butter on one slice ✓

3. **Next:** Add filling to buttered slice ✓

4. **Next:** Place second slice on top ✓

5. **Next:** Cut sandwich in half ✓

6. **Done:** Sandwich is complete

Every time you follow this algorithm, you'll get the same result because the steps always happen in the same order.

///

## Selection (decision making)

Selection lets your algorithm make decisions based on conditions. It's like coming to a fork in the road - you check a condition and then choose which path to take.

### Types of selection

/// tab | Simple Selection (IF-THEN)
Do something only if a condition is true, otherwise skip it.

```kroki-mermaid
flowchart TD
    A[Start] --> B{Is it raining?}
    B -->|Yes| C[Take umbrella]
    B -->|No| D[Continue without umbrella]
    C --> E[Go outside]
    D --> E

```

```
ALGORITHM CheckWeather
BEGIN
    INPUT weather
    
    IF weather = "raining" THEN
        OUTPUT "Take umbrella"
    END IF
    
    OUTPUT "Go outside"
END

```

**Key characteristics:**

- **Optional execution** - The action only happens if the condition is true

- **Single path** - Only one thing can happen

- **Continues after** - The algorithm continues regardless of the condition result

/// details | Tracing CheckWeather
    type: example
    open: false

**With weather = "raining":**

1. **INPUT weather:** weather = "raining"

2. **Check:** weather = "raining"? → "raining" = "raining"? → True

3. **Execute:** OUTPUT "Take umbrella"

4. **Continue:** OUTPUT "Go outside"

**With weather = "sunny":**

1. **INPUT weather:** weather = "sunny"

2. **Check:** weather = "raining"? → "sunny" = "raining"? → False

3. **Skip:** Skip the umbrella action

4. **Continue:** OUTPUT "Go outside"

///

///

/// tab | Binary Selection (IF-THEN-ELSE)
Choose between two different actions based on a condition.

```kroki-mermaid
flowchart TD
    A[Start] --> B{Temperature > 20?}
    B -->|Yes| C[Wear t-shirt]
    B -->|No| D[Wear jacket]
    C --> E[Go outside]
    D --> E

```

```
ALGORITHM ChooseClothing
BEGIN
    INPUT temperature
    
    IF temperature > 20 THEN
        OUTPUT "Wear t-shirt"
    ELSE
        OUTPUT "Wear jacket"
    END IF
    
    OUTPUT "Ready to go outside"
END

```

**Key characteristics:**

- **Guaranteed execution** - One action always happens

- **Mutually exclusive** - Only one path is taken

- **Complete coverage** - All possible conditions are handled

/// details | Tracing ChooseClothing
    type: example
    open: false

**With temperature = 25:**

1. **INPUT temperature:** temperature = 25

2. **Check:** temperature > 20? → 25 > 20? → True

3. **Execute:** OUTPUT "Wear t-shirt"

4. **Skip:** ELSE branch is skipped

5. **Continue:** OUTPUT "Ready to go outside"

**With temperature = 15:**

1. **INPUT temperature:** temperature = 15

2. **Check:** temperature > 20? → 15 > 20? → False

3. **Skip:** IF branch is skipped

4. **Execute:** OUTPUT "Wear jacket"

5. **Continue:** OUTPUT "Ready to go outside"

///

///

/// tab | Multiple Selection (IF-THEN-ELSE IF)
Choose from several options based on different conditions.

```kroki-mermaid
flowchart TD
    A[Start] --> B{Score >= 90?}
    B -->|Yes| C[Grade: A]
    B -->|No| D{Score >= 80?}
    D -->|Yes| E[Grade: B]
    D -->|No| F{Score >= 70?}
    F -->|Yes| G[Grade: C]
    F -->|No| H{Score >= 50?}
    H -->|Yes| I[Grade: D]
    H -->|No| J[Grade: F]
    C --> K[End]
    E --> K
    G --> K
    I --> K
    J --> K

```

```
ALGORITHM AssignGrade
BEGIN
    INPUT score
    
    IF score >= 90 THEN
        OUTPUT "Grade: A"
    ELSE IF score >= 80 THEN
        OUTPUT "Grade: B"
    ELSE IF score >= 70 THEN
        OUTPUT "Grade: C"
    ELSE IF score >= 50 THEN
        OUTPUT "Grade: D"
    ELSE
        OUTPUT "Grade: F"
    END IF
END

```

**Key characteristics:**

- **Multiple conditions** - Several different conditions are checked

- **First match wins** - Once a condition is true, no other conditions are checked

- **Default case** - The final ELSE handles any remaining possibilities

///

/// tab | Nested Selection
Put selection structures inside other selection structures for complex decision-making.

```kroki-mermaid
flowchart TD
    A[Start] --> B{Age >= 18?}
    B -->|No| C[Cannot vote]
    B -->|Yes| D{Citizen?}
    D -->|No| E[Cannot vote - not citizen]
    D -->|Yes| F{Registered?}
    F -->|No| G[Cannot vote - not registered]
    F -->|Yes| H[Can vote!]
    C --> I[End]
    E --> I
    G --> I
    H --> I

```

```
ALGORITHM CheckVotingEligibility
BEGIN
    INPUT age, is_citizen, is_registered
    
    IF age >= 18 THEN
        IF is_citizen = "yes" THEN
            IF is_registered = "yes" THEN
                OUTPUT "You can vote!"
            ELSE
                OUTPUT "Cannot vote - not registered"
            END IF
        ELSE
            OUTPUT "Cannot vote - not a citizen"
        END IF
    ELSE
        OUTPUT "Cannot vote - under 18"
    END IF
END

```

**Key characteristics:**

- **Multiple levels** - Conditions are checked in a hierarchy

- **Dependent decisions** - Inner conditions only checked if outer conditions are met

- **Complex logic** - Can handle sophisticated decision trees

/// details | Tracing nested selection
    type: example
    open: false

**With age=20, is_citizen="yes", is_registered="no":**

1. **INPUT values:** age=20, is_citizen="yes", is_registered="no"

2. **Check:** age >= 18? → 20 >= 18? → True

3. **Enter first IF:** Check inner condition

4. **Check:** is_citizen = "yes"? → "yes" = "yes"? → True

5. **Enter second IF:** Check innermost condition

6. **Check:** is_registered = "yes"? → "no" = "yes"? → False

7. **Execute ELSE:** OUTPUT "Cannot vote - not registered"

**With age=16:**

1. **INPUT values:** age=16, is_citizen="yes", is_registered="yes"

2. **Check:** age >= 18? → 16 >= 18? → False

3. **Execute ELSE:** OUTPUT "Cannot vote - under 18"

4. **Skip:** All nested conditions are ignored

///

///

/// tab | CASE/SWITCH Selection
Choose from many options based on the value of a single variable (some languages support this).

```kroki-mermaid
flowchart TD
    A[Start] --> B[INPUT day_number]
    B --> C{day_number}
    C -->|1| D[Monday]
    C -->|2| E[Tuesday] 
    C -->|3| F[Wednesday]
    C -->|4| G[Thursday]
    C -->|5| H[Friday]
    C -->|6| I[Saturday]
    C -->|7| J[Sunday]
    C -->|other| K[Invalid day]
    D --> L[End]
    E --> L
    F --> L
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L

```

```
ALGORITHM GetDayName
BEGIN
    INPUT day_number
    
    CASE day_number OF
        1: OUTPUT "Monday"
        2: OUTPUT "Tuesday"
        3: OUTPUT "Wednesday"
        4: OUTPUT "Thursday"
        5: OUTPUT "Friday"
        6: OUTPUT "Saturday"
        7: OUTPUT "Sunday"
        OTHERWISE: OUTPUT "Invalid day number"
    END CASE
END

```

**Note:** This can also be written using multiple IF-THEN-ELSE IF statements:

```
ALGORITHM GetDayNameWithIF
BEGIN
    INPUT day_number
    
    IF day_number = 1 THEN
        OUTPUT "Monday"
    ELSE IF day_number = 2 THEN
        OUTPUT "Tuesday"
    ELSE IF day_number = 3 THEN
        OUTPUT "Wednesday"
    ELSE IF day_number = 4 THEN
        OUTPUT "Thursday"
    ELSE IF day_number = 5 THEN
        OUTPUT "Friday"
    ELSE IF day_number = 6 THEN
        OUTPUT "Saturday"
    ELSE IF day_number = 7 THEN
        OUTPUT "Sunday"
    ELSE
        OUTPUT "Invalid day number"
    END IF
END

```

**Key characteristics:**

- **Single variable** - Decision based on one variable's value

- **Exact matches** - Each case checks for exact equality

- **Clean structure** - More readable than long IF-THEN-ELSE chains for many options

- **Default case** - OTHERWISE/ELSE handles unexpected values

///

### Tracing selection examples

**Tracing AssignGrade with score = 85:**

1. **INPUT score:** score = 85

2. **Check:** score >= 90? → 85 >= 90? → False

3. **Check:** score >= 80? → 85 >= 80? → True

4. **Execute:** OUTPUT "Grade: B"

5. **Skip:** All remaining conditions (already found a match)

/// details | Practice: Trace with different inputs
    type: example
    open: false

Try tracing the same algorithm with these inputs:

- score = 95 → Should output "Grade: A"

- score = 45 → Should output "Grade: F" 

- score = 70 → Should output "Grade: C"

**Solution for score = 45:**

1. **INPUT score:** score = 45

2. **Check:** score >= 90? → 45 >= 90? → False

3. **Check:** score >= 80? → 45 >= 80? → False

4. **Check:** score >= 70? → 45 >= 70? → False

5. **Check:** score >= 50? → 45 >= 50? → False

6. **Execute:** OUTPUT "Grade: F" (ELSE clause)

///

## Iteration (repetition)

Iteration lets your algorithm repeat actions multiple times. It's like doing jumping jacks - you repeat the same motion until you've done enough.

### Types of iteration

/// tab | Counted Loops (FOR loops)
Repeat a specific number of times when you know exactly how many iterations you need.

```kroki-mermaid
flowchart TD
    A[Start] --> B[Set counter = 1]
    B --> C{Counter <= 10?}
    C -->|Yes| D[Do jumping jack]
    D --> E[Increment counter]
    E --> C
    C -->|No| F[End]

```

```
ALGORITHM CountToTen
BEGIN
    FOR counter = 1 TO 10 DO
        OUTPUT "Jumping jack " + counter
    END FOR
    OUTPUT "Exercise complete!"
END

```

**Key characteristics:**

- **Known repetitions** - You know exactly how many times to repeat

- **Automatic counting** - The loop variable is managed for you

- **Guaranteed termination** - Will always stop after the specified number of iterations

/// details | Tracing the FOR loop
    type: example
    open: false

**Full trace of CountToTen:**

1. **Initialize:** counter = 1

2. **Check:** counter <= 10? → 1 <= 10? → True

3. **Execute:** OUTPUT "Jumping jack 1"

4. **Increment:** counter = 2

5. **Check:** counter <= 10? → 2 <= 10? → True

6. **Execute:** OUTPUT "Jumping jack 2"

7. **Increment:** counter = 3

8. **Check:** counter <= 10? → 3 <= 10? → True

9. **Execute:** OUTPUT "Jumping jack 3"
...continues until...

28. **Increment:** counter = 11

29. **Check:** counter <= 10? → 11 <= 10? → False

30. **Exit loop**

31. **Execute:** OUTPUT "Exercise complete!"

**Final output:**

```
Jumping jack 1
Jumping jack 2
Jumping jack 3
...
Jumping jack 10
Exercise complete!

```

///

/// details | More FOR loop examples
    type: example
    open: false

**Counting backwards:**

```
ALGORITHM CountDown
BEGIN
    FOR i = 10 TO 1 STEP -1 DO
        OUTPUT i
    END FOR
    OUTPUT "Blast off!"
END

```

**Processing array elements:**

```
ALGORITHM SumArray
BEGIN
    SET total = 0
    FOR i = 0 TO array_size - 1 DO
        SET total = total + array[i]
    END FOR
    OUTPUT "Sum: " + total
END

```

///

///

/// tab | Pre-test Loops (WHILE loops)
Repeat as long as a condition remains true. Use when you don't know how many iterations you'll need.

```kroki-mermaid
flowchart TD
    A[Start] --> B[Check condition]
    B --> C{Condition true?}
    C -->|Yes| D[Execute loop body]
    D --> E[Update variables]
    E --> B
    C -->|No| F[End]

```

```
ALGORITHM ProcessUserInput
BEGIN
    INPUT command
    
    WHILE command ≠ "quit" DO
        OUTPUT "Processing: " + command
        INPUT command
    END WHILE
    
    OUTPUT "Goodbye!"
END

```

**Key characteristics:**

- **Condition-based** - Continues while a condition is true

- **Pre-test** - Checks condition before each iteration

- **Unknown repetitions** - May run 0 times, 1 time, or many times

- **Requires manual update** - You must change variables to eventually make the condition false

/// details | Tracing WHILE loop
    type: example
    open: false

**With inputs: "hello", "world", "quit"**

1. **INPUT command:** command = "hello"

2. **Check:** command ≠ "quit"? → "hello" ≠ "quit"? → True

3. **Execute:** OUTPUT "Processing: hello"

4. **INPUT command:** command = "world"

5. **Check:** command ≠ "quit"? → "world" ≠ "quit"? → True

6. **Execute:** OUTPUT "Processing: world"

7. **INPUT command:** command = "quit"

8. **Check:** command ≠ "quit"? → "quit" ≠ "quit"? → False

9. **Exit loop**

10. **Execute:** OUTPUT "Goodbye!"

**Output:**

```
Processing: hello
Processing: world
Goodbye!

```

///

/// details | Common WHILE patterns
    type: example
    open: false

**Searching through data:**

```
ALGORITHM FindValue
BEGIN
    SET found = false
    SET index = 0
    
    WHILE index < array_size AND NOT found DO
        IF array[index] = target_value THEN
            SET found = true
        ELSE
            SET index = index + 1
        END IF
    END WHILE
    
    IF found THEN
        OUTPUT "Found at position " + index
    ELSE
        OUTPUT "Not found"
    END IF
END

```

**Reading until end of file:**

```
ALGORITHM ProcessFile
BEGIN
    READ first_line
    
    WHILE NOT end_of_file DO
        PROCESS line
        READ next_line
    END WHILE
END

```

///

///

/// tab | Post-test Loops (REPEAT-UNTIL)
Always execute at least once, then check the condition. Use when you need to guarantee the loop body runs at least once.

```kroki-mermaid
flowchart TD
    A[Start] --> B[Execute loop body]
    B --> C[Update variables]
    C --> D{Condition met?}
    D -->|No| B
    D -->|Yes| E[End]

```

```
ALGORITHM GetValidInput
BEGIN
    REPEAT
        INPUT number
        IF number < 1 OR number > 100 THEN
            OUTPUT "Invalid! Please enter 1-100"
        END IF
    UNTIL number >= 1 AND number <= 100
    
    OUTPUT "Thank you! You entered: " + number
END

```

**Key characteristics:**

- **Guaranteed execution** - Always runs at least once

- **Post-test** - Checks condition after executing the body

- **Validation loops** - Perfect for ensuring valid input

- **Exit condition** - Continues until condition becomes true

/// details | Tracing REPEAT-UNTIL loop
    type: example
    open: false

**With inputs: -5, 150, 75**

1. **Execute body:** INPUT number → number = -5

2. **Check validation:** -5 < 1? → True → OUTPUT "Invalid! Please enter 1-100"

3. **Check exit condition:** -5 >= 1 AND -5 <= 100? → False → Continue

4. **Execute body:** INPUT number → number = 150

5. **Check validation:** 150 > 100? → True → OUTPUT "Invalid! Please enter 1-100"

6. **Check exit condition:** 150 >= 1 AND 150 <= 100? → False → Continue

7. **Execute body:** INPUT number → number = 75

8. **Check validation:** 75 >= 1 AND 75 <= 100? → True → No error message

9. **Check exit condition:** 75 >= 1 AND 75 <= 100? → True → Exit

10. **Execute:** OUTPUT "Thank you! You entered: 75"

**Output:**

```
Invalid! Please enter 1-100
Invalid! Please enter 1-100
Thank you! You entered: 75

```

///

/// details | REPEAT-UNTIL vs WHILE comparison
    type: example
    open: false

**Same task with different loop types:**

**REPEAT-UNTIL (post-test):**

```
ALGORITHM GetPasswordRepeat
BEGIN
    REPEAT
        INPUT password
        IF length(password) < 8 THEN
            OUTPUT "Password too short"
        END IF
    UNTIL length(password) >= 8
END

```

**WHILE (pre-test):**

```
ALGORITHM GetPasswordWhile
BEGIN
    INPUT password
    WHILE length(password) < 8 DO
        OUTPUT "Password too short"
        INPUT password
    END WHILE
END

```

**Key difference:** REPEAT-UNTIL always asks for input at least once, while WHILE requires initialization before the loop.

///

///

/// tab | Nested Loops
Put loops inside other loops to handle multi-dimensional data or complex repetition patterns.

```kroki-mermaid
flowchart TD
    A[Start] --> B[Outer loop: row = 1]
    B --> C{row <= 3?}
    C -->|Yes| D[Inner loop: col = 1]
    D --> E{col <= 4?}
    E -->|Yes| F[Print star]
    F --> G[col = col + 1]
    G --> E
    E -->|No| H[Print newline]
    H --> I[row = row + 1]
    I --> C
    C -->|No| J[End]

```

```
ALGORITHM PrintRectangle
BEGIN
    FOR row = 1 TO 3 DO
        FOR col = 1 TO 4 DO
            OUTPUT "*" (no newline)
        END FOR
        OUTPUT newline
    END FOR
END

```

**Key characteristics:**

- **Multi-level repetition** - Inner loop completes fully for each outer loop iteration

- **Complex patterns** - Can create tables, grids, or process multi-dimensional data

- **Performance consideration** - Total iterations = outer × inner (3 × 4 = 12 iterations)

/// details | Tracing nested loops
    type: example
    open: false

**Full trace of PrintRectangle:**

**Outer iteration 1 (row = 1):**

- Inner: col = 1 → OUTPUT "*"

- Inner: col = 2 → OUTPUT "*"

- Inner: col = 3 → OUTPUT "*"

- Inner: col = 4 → OUTPUT "*"

- Inner loop complete → OUTPUT newline

**Outer iteration 2 (row = 2):**

- Inner: col = 1 → OUTPUT "*"

- Inner: col = 2 → OUTPUT "*"

- Inner: col = 3 → OUTPUT "*"

- Inner: col = 4 → OUTPUT "*"

- Inner loop complete → OUTPUT newline

**Outer iteration 3 (row = 3):**

- Inner: col = 1 → OUTPUT "*"

- Inner: col = 2 → OUTPUT "*"

- Inner: col = 3 → OUTPUT "*"

- Inner: col = 4 → OUTPUT "*"

- Inner loop complete → OUTPUT newline

**Final output:**

```
****
****
****

```

///

/// details | Nested loop patterns
    type: example
    open: false

**Multiplication table:**

```
ALGORITHM MultiplicationTable
BEGIN
    FOR i = 1 TO 10 DO
        FOR j = 1 TO 10 DO
            SET product = i * j
            OUTPUT product + " "
        END FOR
        OUTPUT newline
    END FOR
END

```

**Processing 2D array:**

```
ALGORITHM Sum2DArray
BEGIN
    SET total = 0
    FOR row = 0 TO rows - 1 DO
        FOR col = 0 TO cols - 1 DO
            SET total = total + array[row][col]
        END FOR
    END FOR
    OUTPUT "Sum: " + total
END

```

**Triangle pattern:**

```
ALGORITHM PrintTriangle
BEGIN
    FOR row = 1 TO 5 DO
        FOR col = 1 TO row DO
            OUTPUT "*"
        END FOR
        OUTPUT newline
    END FOR
END

```

**Output:**

```
*
**
***
****
*****

```

///

///

/// tab | Infinite Loops (Controlled)
Sometimes you need a loop that runs "forever" but has internal exit conditions.

```kroki-mermaid
flowchart TD
    A[Start] --> B[LOOP]
    B --> C[Get user choice]
    C --> D{Choice = 1?}
    D -->|Yes| E[Do task 1]
    D -->|No| F{Choice = 2?}
    F -->|Yes| G[Do task 2]
    F -->|No| H{Choice = 0?}
    H -->|Yes| I[EXIT loop]
    H -->|No| J[Invalid choice]
    E --> B
    G --> B
    J --> B
    I --> K[End program]

```

```
ALGORITHM MenuSystem
BEGIN
    LOOP
        OUTPUT "1. Add student"
        OUTPUT "2. View students" 
        OUTPUT "0. Exit"
        INPUT choice
        
        IF choice = 1 THEN
            OUTPUT "Adding student..."
        ELSE IF choice = 2 THEN
            OUTPUT "Viewing students..."
        ELSE IF choice = 0 THEN
            OUTPUT "Goodbye!"
            EXIT LOOP
        ELSE
            OUTPUT "Invalid choice"
        END IF
    END LOOP
END

```

**Key characteristics:**

- **Controlled infinite** - Loops forever unless explicitly broken

- **Internal exits** - Uses EXIT, BREAK, or return statements

- **Menu systems** - Perfect for user interfaces and game loops

- **Event-driven** - Responds to user actions or external events

/// details | Equivalent structures
    type: example
    open: false

**Using WHILE TRUE:**

```
ALGORITHM MenuWithWhile
BEGIN
    WHILE true DO
        OUTPUT "Menu options..."
        INPUT choice
        
        IF choice = 0 THEN
            EXIT LOOP
        END IF
        
        // Process other choices
    END WHILE
END

```

**Using REPEAT with flag:**

```
ALGORITHM MenuWithRepeat
BEGIN
    SET keep_running = true
    
    REPEAT
        OUTPUT "Menu options..."
        INPUT choice
        
        IF choice = 0 THEN
            SET keep_running = false
        END IF
        
        // Process other choices
    UNTIL NOT keep_running
END

```

All three approaches achieve the same result - choose based on readability and language support.

///

///

### Comparing loop types

| Loop Type | When to Use | Termination | Minimum Executions |
|-----------|-------------|-------------|-------------------|
| FOR | Know exact count | Automatic | 0 (if count ≤ 0) |
| WHILE | Condition-based | Manual | 0 |
| REPEAT-UNTIL | Need at least once | Manual | 1 |

/// details | Example: Different loops for the same task
    type: example
    open: false

**Task:** Sum numbers from 1 to 5

**FOR loop approach:**

```
ALGORITHM SumWithFor
BEGIN
    SET sum = 0
    FOR i = 1 TO 5 DO
        SET sum = sum + i
    END FOR
    OUTPUT sum
END

```

**WHILE loop approach:**

```
ALGORITHM SumWithWhile
BEGIN
    SET sum = 0
    SET i = 1
    WHILE i <= 5 DO
        SET sum = sum + i
        SET i = i + 1
    END WHILE
    OUTPUT sum
END

```

**REPEAT-UNTIL approach:**

```
ALGORITHM SumWithRepeat
BEGIN
    SET sum = 0
    SET i = 1
    REPEAT
        SET sum = sum + i
        SET i = i + 1
    UNTIL i > 5
    OUTPUT sum
END

```

All three produce the same result: sum = 15
///

## Combining control structures

Real algorithms combine sequence, selection, and iteration to solve complex problems. Think of them as LEGO blocks - you can stack and connect them in many ways.

/// tab | Pseudocode

```
ALGORITHM ProcessStudentGrades
BEGIN
    SET total = 0
    SET count = 0

    REPEAT
        INPUT grade

        IF grade >= 0 AND grade <= 100 THEN
            SET total = total + grade
            SET count = count + 1

            IF grade >= 90 THEN
                OUTPUT "Excellent work!"
            ELSE IF grade >= 70 THEN
                OUTPUT "Good job!"
            ELSE
                OUTPUT "Keep trying!"
            END IF
        ELSE
            OUTPUT "Invalid grade. Please try again."
        END IF

        INPUT continue_choice
    UNTIL continue_choice = "no"

    IF count > 0 THEN
        SET average = total / count
        OUTPUT "Class average: " + average
    ELSE
        OUTPUT "No valid grades were entered"
    END IF
END

```

///

/// tab | Python Implementation

```python
def process_student_grades():
    total = 0
    count = 0

    while True:
        try:
            grade = float(input("Enter a grade (0-100): "))

            if 0 <= grade <= 100:
                total += grade
                count += 1

                if grade >= 90:
                    print("Excellent work!")
                elif grade >= 70:
                    print("Good job!")
                else:
                    print("Keep trying!")
            else:
                print("Invalid grade. Please enter a number between 0 and 100.")

        except ValueError:
            print("Invalid input. Please enter a number.")

        continue_choice = input("Continue? (yes/no): ").lower()
        if continue_choice == "no":
            break

    if count > 0:
        average = total / count
        print(f"Class average: {average:.2f}")
    else:
        print("No valid grades were entered.")

```

///
This algorithm combines:

- **Sequence:** Initialize variables, calculate average

- **Selection:** Validate grades, assign feedback, check if grades were entered

- **Iteration:** Repeat until user chooses to stop

### Nested structures

You can put control structures inside other control structures:

```kroki-mermaid
flowchart TD
    A[Start] --> B[FOR each student]
    B --> C[Get student grade]
    C --> D{Grade valid?}
    D -->|Yes| E[Add to total]
    D -->|No| F[Show error message]
    E --> G{More students?}
    F --> G
    G -->|Yes| B
    G -->|No| H[Calculate average]
    H --> I[End]

```

## Tracing algorithms

Tracing means following through an algorithm step-by-step to see what happens with specific inputs. It's like being a detective - you track every change to variables and every decision made.

### Tracing table method

Create a table to track variable values as they change:

**Algorithm:**

```
ALGORITHM FindMaximum
BEGIN
    INPUT num1, num2, num3
    SET maximum = num1
    
    IF num2 > maximum THEN
        SET maximum = num2
    END IF
    
    IF num3 > maximum THEN
        SET maximum = num3
    END IF
    
    OUTPUT maximum
END

```

**Tracing with inputs: num1=15, num2=8, num3=22**

| Step | Action | num1 | num2 | num3 | maximum | Condition | Output |
|------|--------|------|------|------|---------|-----------|---------|
| 1 | INPUT values | 15 | 8 | 22 | - | - | - |
| 2 | SET maximum = num1 | 15 | 8 | 22 | 15 | - | - |
| 3 | CHECK num2 > maximum | 15 | 8 | 22 | 15 | 8 > 15 = False | - |
| 4 | SKIP assignment | 15 | 8 | 22 | 15 | - | - |
| 5 | CHECK num3 > maximum | 15 | 8 | 22 | 15 | 22 > 15 = True | - |
| 6 | SET maximum = num3 | 15 | 8 | 22 | 22 | - | - |
| 7 | OUTPUT maximum | 15 | 8 | 22 | 22 | - | 22 |

The maximum value found is 22.

## Practice exercises

/// tab | Foundation

/// details | Exercise 1: Identify control structures
    type: question
    open: false

Look at this everyday process and identify the control structures:

**Making toast:**

1. Get bread from bag

2. If bread is moldy, throw it away and get new slice

3. Put bread in toaster

4. Set timer for 2 minutes

5. While timer is running, get butter from fridge

6. When timer goes off, remove toast

7. If toast is too light, toast for 1 more minute

8. Spread butter on toast

Identify each control structure type (sequence, selection, iteration).

/// details | Sample solution
    type: success
    open: false

**Sequence steps:**

- Get bread from bag

- Put bread in toaster

- Set timer for 2 minutes

- Remove toast

- Spread butter on toast

**Selection structures:**

- If bread is moldy, throw it away and get new slice (simple IF-THEN)

- If toast is too light, toast for 1 more minute (simple IF-THEN)

**Iteration structures:**

- While timer is running, get butter from fridge (WHILE loop)

Most of the process is sequential with a couple of decision points and one repetitive action.
///
///

/// details | Exercise 2: Trace through an algorithm
    type: question
    open: false

Trace through this algorithm with the given inputs and show what gets printed:

```
ALGORITHM Mystery
BEGIN
    INPUT x, y
    SET result = 0

    WHILE x > 0 DO
        IF x is odd THEN
            SET result = result + y
        END IF
        SET x = x / 2 (integer division)
        SET y = y * 2
    END WHILE

    OUTPUT result
END

```

**Trace with inputs: x = 5, y = 3**

/// details | Sample solution
    type: success
    open: false

**Tracing table:**

| Step | x | y | result | x > 0? | x is odd? | Action |
|------|---|---|--------|--------|-----------|---------|
| Start | 5 | 3 | 0 | - | - | Initialize |
| 1 | 5 | 3 | 0 | True | True | result = 0 + 3 = 3 |
| 2 | 2 | 6 | 3 | True | False | Skip addition |
| 3 | 1 | 12 | 3 | True | True | result = 3 + 12 = 15 |
| 4 | 0 | 24 | 15 | False | - | Exit loop |

**Output: 15**

*Note: This algorithm performs binary multiplication - it multiplies x and y using binary representation of x.*
///
///

/// tab | Intermediate

/// details | Exercise 3: Design a control structure
    type: question
    open: false

Design an algorithm that:

1. Asks users to enter positive numbers

2. Keeps track of the sum and count of numbers entered

3. Stops when the user enters -1

4. Shows an error message for invalid inputs (negative numbers except -1)

5. At the end, displays the average of valid numbers entered

Use appropriate control structures and show your algorithm in pseudocode.

/// details | Sample solution
    type: success
    open: false

```
ALGORITHM CalculateAverage
BEGIN
    SET sum = 0
    SET count = 0
    SET number = 0

    OUTPUT "Enter positive numbers (-1 to stop):"

    REPEAT
        INPUT number

        IF number = -1 THEN
            // Do nothing, will exit loop
        ELSE IF number > 0 THEN
            SET sum = sum + number
            SET count = count + 1
        ELSE
            OUTPUT "Error: Please enter a positive number or -1 to stop"
        END IF
    UNTIL number = -1

    IF count > 0 THEN
        SET average = sum / count
        OUTPUT "Average of " + count + " numbers: " + average
    ELSE
        OUTPUT "No valid numbers were entered"
    END IF
END

```

**Control structures used:**

- **Sequence:** Initialize variables, calculate average

- **Selection:** Check for sentinel value (-1), validate positive numbers, check if any valid numbers entered

- **Iteration:** REPEAT-UNTIL loop to continue getting input until -1 is entered
///
///

/// tab | Advanced

/// details | Exercise 4: Complex algorithm analysis
    type: question
    open: false

Analyze this algorithm and determine what it does. Then trace it with the input array [64, 34, 25, 12, 22, 11, 90]:

```
ALGORITHM MysterySort
BEGIN
    INPUT array
    SET n = length of array

    FOR i = 0 TO n-2 DO
        SET min_index = i

        FOR j = i+1 TO n-1 DO
            IF array[j] < array[min_index] THEN
                SET min_index = j
            END IF
        END FOR

        IF min_index ≠ i THEN
            SWAP array[i] and array[min_index]
        END IF
    END FOR

    OUTPUT array
END

```

1. What does this algorithm accomplish?

2. Trace through the first two iterations with the given input.

/// details | Comprehensive solution
    type: success
    open: false

**1. What the algorithm does:**
This is a **Selection Sort** algorithm. It sorts an array in ascending order by:

- Finding the minimum element in the unsorted portion

- Swapping it with the first element of the unsorted portion

- Moving the boundary between sorted and unsorted portions

**2. Tracing first two iterations:**

**Initial array:** [64, 34, 25, 12, 22, 11, 90]

**Iteration 1 (i = 0):**

- min_index starts at 0 (value 64)

- Check j=1: 34 < 64? Yes → min_index = 1

- Check j=2: 25 < 34? Yes → min_index = 2  

- Check j=3: 12 < 25? Yes → min_index = 3

- Check j=4: 22 < 12? No → min_index stays 3

- Check j=5: 11 < 12? Yes → min_index = 5

- Check j=6: 90 < 11? No → min_index stays 5

- Swap array[0] and array[5]: [11, 34, 25, 12, 22, 64, 90]

**Iteration 2 (i = 1):**

- min_index starts at 1 (value 34)

- Check j=2: 25 < 34? Yes → min_index = 2

- Check j=3: 12 < 25? Yes → min_index = 3

- Check j=4: 22 < 12? No → min_index stays 3

- Check j=5: 64 < 12? No → min_index stays 3

- Check j=6: 90 < 12? No → min_index stays 3

- Swap array[1] and array[3]: [11, 12, 25, 34, 22, 64, 90]

The algorithm continues until the entire array is sorted: [11, 12, 22, 25, 34, 64, 90]
///
///






## Recap**Control structures are the building blocks of all algorithms:**

**Sequence** - Do things in order:

- Each step happens exactly once

- Steps always happen in the same order

- Use for straightforward, linear processes

**Selection** - Make decisions:

- IF-THEN for optional actions

- IF-THEN-ELSE for choosing between two paths

- Multiple selection for choosing from many options

- Use when the algorithm needs to respond to different conditions

**Iteration** - Repeat actions:

- FOR loops when you know how many times to repeat

- WHILE loops when you repeat based on a condition

- Use when you need to process multiple items or continue until a goal is reached

**Combining structures** creates powerful algorithms that can solve complex problems. Master these three patterns, and you can express any logical process as a clear, step-by-step algorithm.

**Remember:** Always trace through your algorithms with sample data to verify they work correctly!
