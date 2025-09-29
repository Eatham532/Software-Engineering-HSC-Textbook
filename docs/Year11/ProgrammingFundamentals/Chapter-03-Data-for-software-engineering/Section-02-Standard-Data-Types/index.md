# 3.2 Standard data types

## Why it matters


Every piece of information in a program must be stored as a specific **data type**. Think of data types like containers - you wouldn't store milk in a cardboard box or books in a bucket. Similarly, computers need the right "container" (data type) to store different kinds of information correctly and efficiently.

Understanding data types helps you:

- Choose the right type for each piece of information

- Avoid errors caused by mixing incompatible data

- Write more efficient and reliable programs

- Debug problems related to data handling

## Core data types

Programming languages provide several fundamental data types to represent different kinds of information. These concepts are universal across programming languages, though the exact syntax varies.

### Strings (text data)

**Strings** store text - sequences of characters like words, sentences, or any textual information.

/// tab | Conceptual Example

```text
// Creating strings
student_name = "Alice Johnson"
course_code = "SE-11-02"
message = "Welcome to Software Engineering!"

// String operations
full_message = "Hello, " + student_name  // Concatenation
name_length = LENGTH(student_name)       // Length: 13
uppercase_name = TO_UPPER(student_name)  // "ALICE JOHNSON"

DISPLAY "Student: " + student_name
DISPLAY "Course: " + course_code
DISPLAY "Name has " + name_length + " characters"

```

///

/// tab | Key Characteristics

```text
Purpose: Store text and characters
Examples: Names, addresses, messages, identifiers
Common operations:
- Concatenation (joining strings together)
- Length calculation
- Case conversion (upper/lower)
- Substring extraction

```

///
**When to use strings:**

- Names, addresses, descriptions

- User input and messages

- File names and paths

- Any textual information

### Integers (whole numbers)

**Integers** store whole numbers - positive, negative, or zero, without decimal points.

/// tab | Conceptual Example

```text
// Creating integers
student_age = 17
num_students = 25
temperature = -5
score_difference = 0

// Integer operations
total_points = 85 + 92 + 78        // Addition: 255
average_estimate = total_points / 3  // Division: 85 (may be float in some languages)
remainder = total_points MOD 3      // Modulus: 0

DISPLAY "Student age: " + student_age
DISPLAY "Class size: " + num_students
DISPLAY "Average (estimated): " + average_estimate

```

///

/// tab | Key Characteristics

```text
Purpose: Store whole numbers
Examples: Ages, counts, IDs, years
Range: Varies by programming language
Common operations:
- Arithmetic (+, -, *, /, MOD)
- Comparison (==, !=, <, >, <=, >=)
- Type conversion

```

///
**When to use integers:**

- Counting items (students, products, etc.)

- Ages, years, quantities

- IDs and reference numbers

- Loop counters and array indices

### Floating-point numbers (decimal numbers)

**Floats** store numbers with decimal points - for precise measurements and calculations.

/// tab | Conceptual Example

```text
// Creating floats
grade_average = 87.5
price = 19.99
pi_approximation = 3.14159
temperature = 36.7

// Float operations
total_cost = price * 1.1             // Apply 10% tax: 21.989
rounded_cost = ROUND(total_cost, 2)  // Round to 2 decimals: 21.99
percentage = grade_average / 100     // Convert to decimal: 0.875

DISPLAY "Grade average: " + grade_average + "%"
DISPLAY "Price with tax: $" + rounded_cost
DISPLAY "Temperature: " + temperature + "°C"

```

///

/// tab | Key Characteristics

```text
Purpose: Store decimal numbers
Examples: Prices, measurements, percentages, scientific data
Precision: Limited (typically 6-15 decimal digits)
Common operations:
- Arithmetic (+, -, *, /)
- Rounding functions
- Mathematical functions (absolute value, power)

```

///
**When to use floats:**

- Prices and financial calculations

- Measurements (height, weight, distance)

- Percentages and ratios

- Scientific calculations

### Booleans (true/false values)

**Booleans** store logical values - either `True` or `False`. They're essential for decision-making in programs.

/// tab | Conceptual Example

```text
// Creating booleans
is_student = TRUE
has_permission = FALSE
is_passing = grade_average >= 50  // Evaluates to TRUE if grade_average >= 50

// Boolean operations
can_enroll = is_student AND has_permission    // Logical AND
needs_help = NOT is_passing                   // Logical NOT
eligible = is_student OR has_permission       // Logical OR

DISPLAY "Is student: " + is_student
DISPLAY "Can enroll: " + can_enroll
DISPLAY "Needs help: " + needs_help

```

///

/// tab | Key Characteristics

```text
Purpose: Store true/false values
Examples: Status flags, conditions, yes/no answers
Values: True, False (or YES/NO in some languages)
Common operations:
- Logical AND
- Logical OR
- Logical NOT
- Comparison operations return booleans

```

///
**When to use booleans:**

- Status indicators (logged in, active, valid)

- Flags for program control

- Results of comparisons and tests

- Configuration settings (on/off)

### Date and time data

**Date and time** types store temporal information - specific moments, dates, or time periods.

/// tab | Conceptual Example

```text
// Creating date/time values
today = CURRENT_DATE()                    // Current date
now = CURRENT_DATETIME()                  // Current date and time
birth_date = DATE(2006, 3, 15)           // Specific date: March 15, 2006
class_time = TIME(9, 30, 0)              // 9:30:00 AM

// Date/time operations
age_days = DAYS_BETWEEN(today, birth_date)   // Days since birth
age_years = age_days / 365                   // Approximate age in years

DISPLAY "Today: " + FORMAT_DATE(today)
DISPLAY "Born: " + FORMAT_DATE(birth_date)
DISPLAY "Age: approximately " + age_years + " years"
DISPLAY "Class time: " + FORMAT_TIME(class_time)

```

///

/// tab | Key Characteristics

```text
Purpose: Store dates, times, and timestamps
Examples: Birthdays, deadlines, log timestamps
Common operations:
- Date arithmetic (adding/subtracting time periods)
- Formatting dates and times for display
- Parsing dates from text input
- Comparisons (before/after)

```

///
**When to use date/time:**

- Birthdays and anniversaries

- Deadlines and schedules

- Log entries and timestamps

- Duration calculations

## Type conversion and validation

Sometimes you need to convert between data types or check what type a piece of data is.

### Converting between types

/// tab | Conceptual Examples

```text
// Converting to different types
score_text = "85"
score_number = TO_INTEGER(score_text)      // String to integer: 85
score_float = TO_FLOAT(score_text)         // String to float: 85.0
score_back = TO_STRING(score_number)       // Integer to string: "85"

// Converting floats and integers
price = 19.99
price_rounded = TO_INTEGER(price)          // Float to integer: 19 (truncated)
count = 5
count_decimal = TO_FLOAT(count)            // Integer to float: 5.0

// Converting to boolean
bool_from_number = TO_BOOLEAN(42)          // Non-zero number: TRUE
bool_from_zero = TO_BOOLEAN(0)             // Zero: FALSE
bool_from_text = TO_BOOLEAN("hello")       // Non-empty string: TRUE
bool_from_empty = TO_BOOLEAN("")           // Empty string: FALSE

DISPLAY "Score as number: " + score_number
DISPLAY "Price rounded: " + price_rounded
DISPLAY "Boolean from 42: " + bool_from_number

```

///

/// tab | Conversion Rules

```text
String to number:
- Must contain valid number format
- Converting "3.14" to integer usually causes error

Number to string:
- Always works: 42 becomes "42"

To boolean:
- FALSE: 0, 0.0, empty string, null/empty values
- TRUE: Everything else

Float to integer:
- Decimal part is usually truncated (not rounded)
- 3.9 becomes 3, not 4

```

///

### Checking data types

/// tab | Conceptual Examples

```text
// Checking types (varies by programming language)
student_name = "Alice"
student_age = 17
grade_average = 85.5
is_enrolled = TRUE

DISPLAY "Name type: " + TYPE_OF(student_name)      // "STRING"
DISPLAY "Age type: " + TYPE_OF(student_age)        // "INTEGER"
DISPLAY "Average type: " + TYPE_OF(grade_average)  // "FLOAT"
DISPLAY "Enrolled type: " + TYPE_OF(is_enrolled)   // "BOOLEAN"

// Type checking functions (varies by language)
IF IS_INTEGER(student_age) THEN
    DISPLAY "Age is an integer"
END IF

IF IS_NUMBER(grade_average) THEN
    DISPLAY "Grade average is a number"
END IF

```

///

/// tab | Type Checking Methods

```text
TYPE_OF(variable):
- Returns the exact data type
- Useful when you need to know the precise type

IS_TYPE(variable, type):
- Checks if variable is of specified type
- Often accepts related types (e.g., IS_NUMBER accepts both integers and floats)

When to use each:
- TYPE_OF: When you need exact type information
- IS_TYPE: When you want to accept compatible types

```

///

## Choosing the right data type

Selecting appropriate data types is crucial for program correctness and efficiency.

### Decision guidelines

```kroki-mermaid
flowchart TD
    A[What kind of data?] --> B{Text/Characters?}
    A --> C{Numbers?}
    A --> D{True/False?}
    A --> E{Dates/Times?}
    
    B -->|Yes| F[Use String<br/>STRING]
    
    C -->|Yes| G{Whole numbers only?}
    G -->|Yes| H[Use Integer<br/>INTEGER]
    G -->|No| I[Use Float<br/>FLOAT]
    
    D -->|Yes| J[Use Boolean<br/>BOOLEAN]
    
    E -->|Yes| K[Use Date/Time<br/>DATE, TIME, DATETIME]
    
    F --> L[Examples:<br/>Names, addresses,<br/>messages, IDs]
    H --> M[Examples:<br/>Ages, counts,<br/>years, quantities]
    I --> N[Examples:<br/>Prices, measurements,<br/>percentages, averages]
    J --> O[Examples:<br/>Status flags,<br/>yes/no answers,<br/>conditions]
    K --> P[Examples:<br/>Birthdays, deadlines,<br/>timestamps, schedules]

```

### Common mistakes and solutions

| **Mistake** | **Problem** | **Solution** |
|-------------|-------------|--------------|
| Storing age as string | Can't do math: `"17" + 1` → "171" | Use integer: `age = 17` |
| Using float for money | Precision errors: `0.1 + 0.2 ≠ 0.3` | Use integers (cents) or decimal module |
| Storing yes/no as string | Hard to test: `if answer == "yes"` | Use boolean: `is_approved = True` |
| Using string for dates | Can't calculate differences easily | Use date objects for date arithmetic |

### Practical examples

/// tab | Student Record System

```text
// Good data type choices for a student record
student_id = 12345              // INTEGER - for unique identification
first_name = "Emma"             // STRING - textual data
last_name = "Wilson"            // STRING - textual data
birth_date = DATE(2006, 8, 22)  // DATE - for age calculations
grade_average = 87.3            // FLOAT - precise grade calculation
is_enrolled = TRUE              // BOOLEAN - enrollment status
subjects = ["Math", "English"]  // ARRAY of STRING - multiple text items

// Calculate age from birth date
today = CURRENT_DATE()
age = DAYS_BETWEEN(today, birth_date) / 365

DISPLAY "Student: " + first_name + " " + last_name
DISPLAY "ID: " + student_id
DISPLAY "Age: " + age + " years"
DISPLAY "Average: " + grade_average + "%"
DISPLAY "Enrolled: " + is_enrolled
DISPLAY "Subjects: " + JOIN(subjects, ", ")

```

///

/// tab | E-commerce Product

```text
// Product information with appropriate types
product_id = "LAPTOP-001"       // STRING - alphanumeric identifier
product_name = "Student Laptop" // STRING - descriptive text
price = 899.99                  // FLOAT - monetary value with decimals
quantity_in_stock = 15          // INTEGER - countable items
is_available = quantity_in_stock > 0  // BOOLEAN - derived from stock
weight_kg = 2.1                 // FLOAT - physical measurement
is_on_sale = FALSE              // BOOLEAN - status flag

// Calculate total value of inventory
total_inventory_value = price * quantity_in_stock

DISPLAY "Product: " + product_name + " (" + product_id + ")"
DISPLAY "Price: $" + price
DISPLAY "Stock: " + quantity_in_stock + " units"
DISPLAY "Available: " + is_available
DISPLAY "Total inventory value: $" + total_inventory_value

```

///

## Practice exercises

/// details | Exercise 1: Data Type Selection
    type: question
    open: false

For each piece of information below, choose the most appropriate data type and explain why:

1. A student's email address

2. The number of students in a class

3. A product's price

4. Whether a user is logged in

5. A person's birthday

6. A test score (0-100%)

7. A postal code (e.g., "2000" or "SW1A 1AA")

/// details | Sample Solution
    type: success
    open: false

1. **Email address**: STRING - Text data, needs to store characters and symbols

2. **Number of students**: INTEGER - Counting whole people, no decimals needed

3. **Product price**: FLOAT - Monetary values often have cents (decimals)

4. **User logged in**: BOOLEAN - Simple true/false status

5. **Person's birthday**: DATE - Temporal data, enables age calculations

6. **Test score (0-100%)**: FLOAT - May have decimal places (87.5%)

7. **Postal code**: STRING - May contain letters and leading zeros ("2000", "SW1A 1AA")
///
///

/// details | Exercise 2: Type Conversion Practice
    type: question
    open: false

Write pseudocode to solve these conversion challenges:

1. Convert the string "42" to an integer and add 8

2. Convert the float 3.14159 to a string

3. Convert the integer 0 to a boolean - what do you get?

4. Convert the string "95.5" to a float, then to an integer

5. Check if the variable `age = 17` is an integer type

/// details | Sample Solution
    type: success
    open: false

```text
// 1. Convert string to integer and add 8
number_str = "42"
number_int = TO_INTEGER(number_str)
result = number_int + 8
DISPLAY "42 + 8 = " + result  // Output: 42 + 8 = 50

// 2. Convert float to string
pi = 3.14159
pi_str = TO_STRING(pi)
DISPLAY "Pi as string: '" + pi_str + "'"  // Output: Pi as string: '3.14159'

// 3. Convert integer 0 to boolean
zero = 0
zero_bool = TO_BOOLEAN(zero)
DISPLAY "TO_BOOLEAN(0) = " + zero_bool  // Output: TO_BOOLEAN(0) = FALSE

// 4. Convert string to float, then to integer
score_str = "95.5"
score_float = TO_FLOAT(score_str)
score_int = TO_INTEGER(score_float)
DISPLAY "'95.5' → " + score_float + " → " + score_int  // Output: '95.5' → 95.5 → 95

// 5. Check if age is integer
age = 17
is_integer = IS_INTEGER(age)
DISPLAY "Is age an integer? " + is_integer  // Output: Is age an integer? TRUE

```

///
///

/// details | Exercise 3: Student Data Management
    type: question
    open: false

Create a pseudocode program that manages student information:

1. Store information for one student using appropriate data types:

   - Student ID (number)

   - Full name

   - Email address

   - Date of birth

   - Current grade average

   - Is currently enrolled
   
2. Calculate and display the student's age in years

3. Determine if the student is passing (average ≥ 50)

4. Display all information in a formatted way

/// details | Sample Solution
    type: success
    open: false

```text
// 1. Store student information with appropriate data types
student_id = 10234                    // INTEGER - unique identifier
full_name = "Sarah Chen"              // STRING - person's name
email = "sarah.chen@school.edu"       // STRING - email address
birth_date = DATE(2006, 11, 15)       // DATE - for age calculations
grade_average = 78.5                  // FLOAT - precise grade
is_enrolled = TRUE                    // BOOLEAN - enrollment status

// 2. Calculate age in years
today = CURRENT_DATE()
age_days = DAYS_BETWEEN(birth_date, today)
age_years = age_days / 365

// 3. Determine if passing
is_passing = grade_average >= 50

// 4. Display formatted information
DISPLAY "=== STUDENT INFORMATION ==="
DISPLAY "ID: " + student_id
DISPLAY "Name: " + full_name
DISPLAY "Email: " + email
DISPLAY "Age: " + age_years + " years"
DISPLAY "Grade Average: " + grade_average + "%"
DISPLAY "Enrolled: " + is_enrolled
DISPLAY "Passing: " + is_passing

// Verify data types
DISPLAY ""
DISPLAY "=== DATA TYPES ==="
DISPLAY "ID type: " + TYPE_OF(student_id)
DISPLAY "Name type: " + TYPE_OF(full_name)
DISPLAY "Birth date type: " + TYPE_OF(birth_date)
DISPLAY "Average type: " + TYPE_OF(grade_average)
DISPLAY "Enrolled type: " + TYPE_OF(is_enrolled)

```

**Output:**

```
=== STUDENT INFORMATION ===
ID: 10234
Name: Sarah Chen
Email: sarah.chen@school.edu
Age: 18 years
Grade Average: 78.5%
Enrolled: TRUE
Passing: TRUE

=== DATA TYPES ===
ID type: INTEGER
Name type: STRING
Birth date type: DATE
Average type: FLOAT
Enrolled type: BOOLEAN

```

///
///


## Recap

**Standard data types are the building blocks of all programs:**

**String** - for text data:

- Names, addresses, messages, identifiers

- Use quotes: `"Hello"` or `'Hello'`

- Operations: concatenation, length, case conversion

**Integer** - for whole numbers:

- Ages, counts, years, IDs

- No decimal point: `42`, `-5`, `0`

- Unlimited size in most programming languages

**Float** - for decimal numbers:

- Prices, measurements, percentages

- Has decimal point: `3.14`, `99.99`, `0.0`

- ~15-17 digits precision

**Boolean** - for true/false values:

- Status flags, conditions, yes/no answers

- Only two values: `TRUE`, `FALSE`

- Used in decision-making

**Date/Time** - for temporal data:

- Birthdays, deadlines, timestamps

- Enables date arithmetic and formatting

**Key principles:**

- Choose the right type for your data

- Convert between types when needed

- Validate data types to avoid errors

- Use meaningful variable names that indicate the data type's purpose

Understanding data types is essential for writing reliable programs that handle information correctly and efficiently.







