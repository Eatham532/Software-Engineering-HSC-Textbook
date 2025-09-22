# 2.1 Control structures (sequence, selection, iteration)

## Why it matters

!!! builds-on "Builds on"
    This section builds on [1.1 Software development steps]../../Chapter-01-Software-Development/Section-01-Software-development-steps/index.md). Make sure you understand the design phase of the SDLC.


Think of algorithms like recipes. A recipe has steps you follow in order (sequence), decisions you make based on conditions (selection), and actions you repeat multiple times (iteration). These three patterns - sequence, selection, and iteration - are the building blocks of every algorithm you'll ever write.

Understanding control structures is like learning the grammar of programming. Once you master these patterns, you can express any logical process as a clear, step-by-step algorithm.

!!! note "Cross-reference"
    This section introduces the foundational concepts that will be implemented in Python in Section 4.1.

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

```text
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
///
```kroki-mermaid
flowchart TD
    A[Start] --> B{Is it raining?}
    B -->|Yes| C[Take umbrella]
    B -->|No| D[Continue without umbrella]
    C --> E[Go outside]
    D --> E
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

///

**Tracing with score = 85:**

1. **INPUT score:** score = 85

2. **Check:** score >= 90? → 85 >= 90? → False

3. **Check:** score >= 80? → 85 >= 80? → True

4. **Execute:** OUTPUT "Grade: B"

5. **Skip:** All remaining conditions (already found a match)

## Iteration (repetition)

Iteration lets your algorithm repeat actions multiple times. It's like doing jumping jacks - you repeat the same motion until you've done enough.

### Types of iteration

/// tab | Counted Loops (FOR loops)
Repeat a specific number of times when you know exactly how many iterations you need.
///
```kroki-mermaid
flowchart TD
    A[Start] --> B[Set counter = 1]
    B --> C{Counter <= 10?}
    C -->|Yes| D[Do jumping jack]
    D --> E[Increment counter]
    E --> C
    C -->|No| F[End]
```

/// details | Counting algorithm
    type: example
    open: false

```text
ALGORITHM CountToTen
BEGIN
    FOR counter = 1 TO 10 DO
        OUTPUT "Jumping jack " + counter
    END FOR
    OUTPUT "Exercise complete!"
END
```

**Tracing the FOR loop:**

1. **Initialize:** counter = 1

2. **Check:** counter <= 10? → 1 <= 10? → True

3. **Execute:** Do jumping jack, OUTPUT "Jumping jack 1"

4. **Increment:** counter = 2

5. **Check:** counter <= 10? → 2 <= 10? → True

6. **Execute:** Do jumping jack, OUTPUT "Jumping jack 2"

...continues until...

<!-- TODO: Fix this section -->

## Combining control structures

Real algorithms combine sequence, selection, and iteration to solve complex problems. Think of them as LEGO blocks - you can stack and connect them in many ways.

/// tab | Pseudocode
```text
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
```text
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

```text
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

```text
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
///

/// tab | Advanced

/// details | Exercise 4: Complex algorithm analysis
    type: question
    open: false

Analyze this algorithm and determine what it does. Then trace it with the input array [64, 34, 25, 12, 22, 11, 90]:

```text
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
///


!!! next-up "Coming Up"
    Coming up: In [4.1 Control Structures in Python](../../Chapter-04-Developing-solutions-with-code/Section-01-Control-Structures-in-Python/index.md), We'll implement these concepts in Python.

## Recap

**Control structures are the building blocks of all algorithms:**

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

!!! tip "Cross-reference"
    These control structure concepts will be implemented in Python code in Section 4.1.
