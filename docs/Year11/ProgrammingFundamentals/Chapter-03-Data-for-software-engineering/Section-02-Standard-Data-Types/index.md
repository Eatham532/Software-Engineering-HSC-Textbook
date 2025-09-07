# 3.2 Standard data types

## Why it matters

Every piece of information in a program must be stored as a specific **data type**. Think of data types like containers - you wouldn't store milk in a cardboard box or books in a bucket. Similarly, computers need the right "container" (data type) to store different kinds of information correctly and efficiently.

Understanding data types helps you:

- Choose the right type for each piece of information

- Avoid errors caused by mixing incompatible data

- Write more efficient and reliable programs

- Debug problems related to data handling

## Core data types

Programming languages provide several fundamental data types to represent different kinds of information. Python implements these core types in intuitive ways.

### Strings (text data)

**Strings** store text - sequences of characters like words, sentences, or any textual information.

=== "Python"
    ```python
    # Creating strings
    student_name = "Alice Johnson"
    course_code = "SE-11-02"
    message = 'Welcome to Software Engineering!'
    
    # String operations
    full_message = "Hello, " + student_name  # Concatenation
    name_length = len(student_name)          # Length: 13
    uppercase_name = student_name.upper()    # "ALICE JOHNSON"
    
    print(f"Student: {student_name}")
    print(f"Course: {course_code}")
    print(f"Name has {name_length} characters")
    ```

=== "Key Characteristics"
    ```text
    Purpose: Store text and characters
    Examples: Names, addresses, messages, identifiers
    Python type: str
    Common operations:
    - Concatenation (+)
    - Length (len())
    - Case conversion (.upper(), .lower())
    - Substring extraction ([start:end])
    ```

**When to use strings:**

- Names, addresses, descriptions

- User input and messages

- File names and paths

- Any textual information

### Integers (whole numbers)

**Integers** store whole numbers - positive, negative, or zero, without decimal points.

=== "Python"
    ```python
    # Creating integers
    student_age = 17
    num_students = 25
    temperature = -5
    score_difference = 0
    
    # Integer operations
    total_points = 85 + 92 + 78        # Addition: 255
    average_estimate = total_points // 3  # Integer division: 85
    remainder = total_points % 3       # Modulus: 0
    
    print(f"Student age: {student_age}")
    print(f"Class size: {num_students}")
    print(f"Average (rounded down): {average_estimate}")
    ```

=== "Key Characteristics"
    ```text
    Purpose: Store whole numbers
    Examples: Ages, counts, IDs, years
    Python type: int
    Range: Unlimited (Python handles big integers automatically)
    Common operations:
    - Arithmetic (+, -, *, //, %)
    - Comparison (==, !=, <, >, <=, >=)
    - Conversion (int(), str())
    ```

**When to use integers:**

- Counting items (students, products, etc.)

- Ages, years, quantities

- IDs and reference numbers

- Loop counters and array indices

### Floating-point numbers (decimal numbers)

**Floats** store numbers with decimal points - for precise measurements and calculations.

=== "Python"
    ```python
    # Creating floats
    grade_average = 87.5
    price = 19.99
    pi_approximation = 3.14159
    temperature = 36.7
    
    # Float operations
    total_cost = price * 1.1             # Apply 10% tax: 21.989
    rounded_cost = round(total_cost, 2)  # Round to 2 decimals: 21.99
    percentage = (grade_average / 100)   # Convert to decimal: 0.875
    
    print(f"Grade average: {grade_average}%")
    print(f"Price with tax: ${rounded_cost}")
    print(f"Temperature: {temperature}°C")
    ```

=== "Key Characteristics"
    ```text
    Purpose: Store decimal numbers
    Examples: Prices, measurements, percentages, scientific data
    Python type: float
    Precision: ~15-17 decimal digits
    Common operations:
    - Arithmetic (+, -, *, /)
    - Rounding (round())
    - Math functions (abs(), pow())
    ```

**When to use floats:**

- Prices and financial calculations

- Measurements (height, weight, distance)

- Percentages and ratios

- Scientific calculations

### Booleans (true/false values)

**Booleans** store logical values - either `True` or `False`. They're essential for decision-making in programs.

=== "Python"
    ```python
    # Creating booleans
    is_student = True
    has_permission = False
    is_passing = grade_average >= 50  # Evaluates to True if grade_average >= 50
    
    # Boolean operations
    can_enroll = is_student and has_permission    # Logical AND
    needs_help = not is_passing                   # Logical NOT
    eligible = is_student or has_permission       # Logical OR
    
    print(f"Is student: {is_student}")
    print(f"Can enroll: {can_enroll}")
    print(f"Needs help: {needs_help}")
    ```

=== "Key Characteristics"
    ```text
    Purpose: Store true/false values
    Examples: Status flags, conditions, yes/no answers
    Python type: bool
    Values: True, False (case-sensitive)
    Common operations:
    - Logical AND (and)
    - Logical OR (or)
    - Logical NOT (not)
    - Comparison operations return booleans
    ```

**When to use booleans:**

- Status indicators (logged in, active, valid)

- Flags for program control

- Results of comparisons and tests

- Configuration settings (on/off)

### Date and time data

**Date and time** types store temporal information - specific moments, dates, or time periods.

=== "Python"
    ```python
    from datetime import datetime, date, time
    
    # Creating date/time objects
    today = date.today()                    # Current date
    now = datetime.now()                    # Current date and time
    birth_date = date(2006, 3, 15)         # Specific date: March 15, 2006
    class_time = time(9, 30, 0)            # 9:30:00 AM
    
    # Date/time operations
    age_days = (today - birth_date).days   # Days since birth
    age_years = age_days // 365            # Approximate age in years
    
    print(f"Today: {today}")
    print(f"Born: {birth_date}")
    print(f"Age: approximately {age_years} years")
    print(f"Class time: {class_time}")
    ```

=== "Key Characteristics"
    ```text
    Purpose: Store dates, times, and timestamps
    Examples: Birthdays, deadlines, log timestamps
    Python types: date, time, datetime
    Common operations:
    - Date arithmetic (adding/subtracting days)
    - Formatting (strftime())
    - Parsing (strptime())
    - Comparisons (before/after)
    ```

**When to use date/time:**

- Birthdays and anniversaries

- Deadlines and schedules

- Log entries and timestamps

- Duration calculations

## Type conversion and validation

Sometimes you need to convert between data types or check what type a piece of data is.

### Converting between types

=== "Python"
    ```python
    # Converting to different types
    score_text = "85"
    score_number = int(score_text)      # String to integer: 85
    score_float = float(score_text)     # String to float: 85.0
    score_back = str(score_number)      # Integer to string: "85"
    
    # Converting floats and integers
    price = 19.99
    price_rounded = int(price)          # Float to integer: 19 (truncated)
    count = 5
    count_decimal = float(count)        # Integer to float: 5.0
    
    # Converting to boolean
    bool_from_number = bool(42)         # Non-zero number: True
    bool_from_zero = bool(0)            # Zero: False
    bool_from_text = bool("hello")      # Non-empty string: True
    bool_from_empty = bool("")          # Empty string: False
    
    print(f"Score as number: {score_number}")
    print(f"Price rounded: {price_rounded}")
    print(f"Boolean from 42: {bool_from_number}")
    ```

=== "Conversion Rules"
    ```text
    String to number:
    - Must contain valid number format
    - int("3.14") causes error - use float() first
    
    Number to string:
    - Always works: str(42) → "42"
    
    To boolean:
    - False: 0, 0.0, "", False, None
    - True: Everything else
    
    Float to integer:
    - Decimal part is truncated (not rounded)
    - int(3.9) → 3, not 4
    ```

### Checking data types

=== "Python"
    ```python
    # Checking types
    student_name = "Alice"
    student_age = 17
    grade_average = 85.5
    is_enrolled = True
    
    print(f"Name type: {type(student_name)}")      # <class 'str'>
    print(f"Age type: {type(student_age)}")        # <class 'int'>
    print(f"Average type: {type(grade_average)}")  # <class 'float'>
    print(f"Enrolled type: {type(is_enrolled)}")   # <class 'bool'>
    
    # Using isinstance() for type checking
    if isinstance(student_age, int):
        print("Age is an integer")
    
    if isinstance(grade_average, (int, float)):
        print("Grade average is a number")
    ```

=== "Type Checking Methods"
    ```text
    type(variable):
    - Returns exact type
    - type(True) returns <class 'bool'>
    
    isinstance(variable, type):
    - Checks if variable is of specified type
    - isinstance(5, int) returns True
    - Can check multiple types: isinstance(x, (int, float))
    
    When to use each:
    - type(): When you need exact type
    - isinstance(): When you want to accept related types
    ```

## Choosing the right data type

Selecting appropriate data types is crucial for program correctness and efficiency.

### Decision guidelines

```kroki-mermaid
flowchart TD
    A[What kind of data?] --> B{Text/Characters?}
    A --> C{Numbers?}
    A --> D{True/False?}
    A --> E{Dates/Times?}
    
    B -->|Yes| F[Use String<br/>str]
    
    C -->|Yes| G{Whole numbers only?}
    G -->|Yes| H[Use Integer<br/>int]
    G -->|No| I[Use Float<br/>float]
    
    D -->|Yes| J[Use Boolean<br/>bool]
    
    E -->|Yes| K[Use datetime<br/>date, time, datetime]
    
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

=== "Student Record System"
    ```python
    from datetime import date
    
    # Good data type choices for a student record
    student_id = 12345              # int - for unique identification
    first_name = "Emma"             # str - textual data
    last_name = "Wilson"            # str - textual data
    birth_date = date(2006, 8, 22)  # date - for age calculations
    grade_average = 87.3            # float - precise grade calculation
    is_enrolled = True              # bool - enrollment status
    subjects = ["Math", "English"]  # list of str - multiple text items
    
    # Calculate age from birth date
    today = date.today()
    age = (today - birth_date).days // 365
    
    print(f"Student: {first_name} {last_name}")
    print(f"ID: {student_id}")
    print(f"Age: {age} years")
    print(f"Average: {grade_average}%")
    print(f"Enrolled: {is_enrolled}")
    print(f"Subjects: {', '.join(subjects)}")
    ```

=== "E-commerce Product"
    ```python
    # Product information with appropriate types
    product_id = "LAPTOP-001"       # str - alphanumeric identifier
    product_name = "Student Laptop" # str - descriptive text
    price = 899.99                  # float - monetary value with decimals
    quantity_in_stock = 15          # int - countable items
    is_available = quantity_in_stock > 0  # bool - derived from stock
    weight_kg = 2.1                 # float - physical measurement
    is_on_sale = False              # bool - status flag
    
    # Calculate total value of inventory
    total_inventory_value = price * quantity_in_stock
    
    print(f"Product: {product_name} ({product_id})")
    print(f"Price: ${price}")
    print(f"Stock: {quantity_in_stock} units")
    print(f"Available: {is_available}")
    print(f"Total inventory value: ${total_inventory_value}")
    ```

## Practice exercises

/// details | Exercise 1: Data Type Selection
    type: question
    open: false

For each piece of information below, choose the most appropriate Python data type and explain why:

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

1. **Email address**: `str` - Text data, needs to store characters and symbols

2. **Number of students**: `int` - Counting whole people, no decimals needed

3. **Product price**: `float` - Monetary values often have cents (decimals)

4. **User logged in**: `bool` - Simple true/false status

5. **Person's birthday**: `date` - Temporal data, enables age calculations

6. **Test score (0-100%)**: `float` - May have decimal places (87.5%)

7. **Postal code**: `str` - May contain letters and leading zeros ("2000", "SW1A 1AA")
///
///

/// details | Exercise 2: Type Conversion Practice
    type: question
    open: false

Write Python code to solve these conversion challenges:

1. Convert the string "42" to an integer and add 8

2. Convert the float 3.14159 to a string

3. Convert the integer 0 to a boolean - what do you get?

4. Convert the string "95.5" to a float, then to an integer

5. Check if the variable `age = 17` is an integer type

/// details | Sample Solution
    type: success
    open: false

```python
# 1. Convert string to integer and add 8
number_str = "42"
number_int = int(number_str)
result = number_int + 8
print(f"42 + 8 = {result}")  # Output: 42 + 8 = 50

# 2. Convert float to string
pi = 3.14159
pi_str = str(pi)
print(f"Pi as string: '{pi_str}'")  # Output: Pi as string: '3.14159'

# 3. Convert integer 0 to boolean
zero = 0
zero_bool = bool(zero)
print(f"bool(0) = {zero_bool}")  # Output: bool(0) = False

# 4. Convert string to float, then to integer
score_str = "95.5"
score_float = float(score_str)
score_int = int(score_float)
print(f"'95.5' → {score_float} → {score_int}")  # Output: '95.5' → 95.5 → 95

# 5. Check if age is integer
age = 17
is_integer = isinstance(age, int)
print(f"Is age an integer? {is_integer}")  # Output: Is age an integer? True
```
///
///

/// details | Exercise 3: Student Data Management
    type: question
    open: false

Create a Python program that manages student information:

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

```python
from datetime import date

# 1. Store student information with appropriate data types
student_id = 10234                    # int - unique identifier
full_name = "Sarah Chen"              # str - person's name
email = "sarah.chen@school.edu"       # str - email address
birth_date = date(2006, 11, 15)       # date - for age calculations
grade_average = 78.5                  # float - precise grade
is_enrolled = True                    # bool - enrollment status

# 2. Calculate age in years
today = date.today()
age_days = (today - birth_date).days
age_years = age_days // 365

# 3. Determine if passing
is_passing = grade_average >= 50

# 4. Display formatted information
print("=== STUDENT INFORMATION ===")
print(f"ID: {student_id}")
print(f"Name: {full_name}")
print(f"Email: {email}")
print(f"Age: {age_years} years")
print(f"Grade Average: {grade_average}%")
print(f"Enrolled: {is_enrolled}")
print(f"Passing: {is_passing}")

# Verify data types
print("\n=== DATA TYPES ===")
print(f"ID type: {type(student_id)}")
print(f"Name type: {type(full_name)}")
print(f"Birth date type: {type(birth_date)}")
print(f"Average type: {type(grade_average)}")
print(f"Enrolled type: {type(is_enrolled)}")
```

**Output:**
```
=== STUDENT INFORMATION ===
ID: 10234
Name: Sarah Chen
Email: sarah.chen@school.edu
Age: 18 years
Grade Average: 78.5%
Enrolled: True
Passing: True

=== DATA TYPES ===
ID type: <class 'int'>
Name type: <class 'str'>
Birth date type: <class 'datetime.date'>
Average type: <class 'float'>
Enrolled type: <class 'bool'>
```
///
///

## Recap

**Standard data types are the building blocks of all programs:**

**String (`str`)** - for text data:

- Names, addresses, messages, identifiers

- Use quotes: `"Hello"` or `'Hello'`

- Operations: concatenation, length, case conversion

**Integer (`int`)** - for whole numbers:

- Ages, counts, years, IDs

- No decimal point: `42`, `-5`, `0`

- Unlimited size in Python

**Float (`float`)** - for decimal numbers:

- Prices, measurements, percentages

- Has decimal point: `3.14`, `99.99`, `0.0`

- ~15-17 digits precision

**Boolean (`bool`)** - for true/false values:

- Status flags, conditions, yes/no answers

- Only two values: `True`, `False`

- Used in decision-making

**Date/Time** - for temporal data:

- Birthdays, deadlines, timestamps

- Import from `datetime` module

- Enables date arithmetic and formatting

**Key principles:**

- Choose the right type for your data

- Convert between types when needed

- Validate data types to avoid errors

- Use meaningful variable names that indicate the data type's purpose

Understanding data types is essential for writing reliable programs that handle information correctly and efficiently.
