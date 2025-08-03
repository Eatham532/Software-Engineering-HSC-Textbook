# Data Types

## Understanding Computer Data Types

Every piece of information in a computer program has a **data type** that determines:
- How much memory is needed to store it
- What operations can be performed on it
- How it's interpreted by the computer

Think of data types as different "containers" for different kinds of information.

## Fundamental Data Types

### Integer
**Stores whole numbers without decimal points**

```python
age = 17
student_count = 450
temperature = -5
year = 2025
```

**Characteristics:**
- **Range**: Typically -2,147,483,648 to 2,147,483,647 (32-bit)
- **Memory**: Usually 4 bytes (32 bits)
- **Operations**: Addition, subtraction, multiplication, division, modulus

**StudyBuddy Examples:**
- Number of assignments: `12`
- Days until due date: `3`
- Study streak: `7 days`

### Character (char)
**Stores a single character**

```python
grade = 'A'
initial = 'J'
symbol = '@'
```

**Characteristics:**
- **Size**: 1 byte (can store any ASCII character)
- **Representation**: Stored as ASCII codes (A = 65, a = 97, etc.)
- **Usage**: Building blocks for text data

### String
**Stores sequences of characters (text)**

```python
student_name = "Alice Johnson"
assignment_title = "Math Quiz Chapter 5"
subject = "Biology"
feedback = "Great work! Keep it up! 🎉"
```

**Characteristics:**
- **Size**: Variable (depends on text length)
- **Operations**: Concatenation, searching, splitting, formatting
- **Unicode Support**: Can store emojis and international characters

**StudyBuddy Examples:**
- User names and emails
- Assignment titles and descriptions
- Subject names and course codes

### Boolean
**Stores true/false values**

```python
assignment_completed = True
notifications_enabled = False
is_overdue = True
has_submitted = False
```

**Characteristics:**
- **Size**: Usually 1 byte (though only needs 1 bit)
- **Values**: Only `True` or `False` (sometimes 1 or 0)
- **Usage**: Decision making, flags, status indicators

**StudyBuddy Examples:**
- Assignment completion status
- Notification preferences
- Account verification status

### Real/Float (Floating Point)
**Stores numbers with decimal points**

```python
gpa = 3.75
completion_percentage = 87.5
average_study_time = 2.3  # hours
pi = 3.14159
```

**Types:**
- **Single precision**: 32-bit (about 7 decimal digits)
- **Double precision**: 64-bit (about 15 decimal digits)

**StudyBuddy Examples:**
- GPA calculations
- Percentage completed
- Average time spent per assignment

### Date and Time
**Stores calendar dates and times**

```python
due_date = "2025-03-15"
created_at = "2025-01-20 09:30:00"
reminder_time = "14:30"  # 2:30 PM
```

**Common Formats:**
- **ISO 8601**: `2025-03-15T14:30:00Z`
- **Unix Timestamp**: `1742169600` (seconds since 1970)
- **Human Readable**: `March 15, 2025 at 2:30 PM`

**StudyBuddy Examples:**
- Assignment due dates
- Study session timestamps
- Reminder schedules

## Choosing the Right Data Type

### Size and Memory Considerations

```python
# Efficient for counting items (small numbers)
assignment_count = 25  # int

# Efficient for yes/no questions
is_submitted = True  # boolean

# Use appropriate precision for calculations
gpa = 3.867  # float (needs decimal precision)

# Variable length for user input
student_name = "Emma"  # string
```

### Type Compatibility and Conversion

```python
# Automatic conversion (implicit)
result = 5 + 2.5  # int + float = 6.5 (float)

# Manual conversion (explicit)
age_string = "17"
age_number = int(age_string)  # Convert string to int

grade_number = 85
grade_string = str(grade_number)  # Convert int to string
```

## Advanced Data Types

### Arrays/Lists
**Collections of the same data type**

```python
grades = [85, 92, 78, 94, 88]  # Array of integers
subjects = ["Math", "Science", "English"]  # Array of strings
completion_status = [True, False, True, True]  # Array of booleans
```

### Records/Objects
**Collections of different data types grouped together**

```python
assignment = {
    "title": "Chapter 5 Quiz",      # string
    "subject": "Biology",           # string
    "due_date": "2025-03-20",      # date
    "points": 50,                   # integer
    "completed": False              # boolean
}
```

## Common Data Type Errors

### Type Mismatch
```python
# Error: Can't add string and number
age = "17"
next_year = age + 1  # TypeError!

# Solution: Convert types
age = int("17")
next_year = age + 1  # Works: 18
```

### Overflow
```python
# Integer overflow (in some languages)
big_number = 2147483647  # Maximum 32-bit integer
bigger = big_number + 1  # May wrap to negative number!
```

### Precision Loss
```python
# Floating point precision issues
result = 0.1 + 0.2  # May not equal exactly 0.3
print(result)  # Might show 0.30000000000000004
```

## StudyBuddy Data Type Design

Let's design the data types for our StudyBuddy app:

```python
# User Profile
user = {
    "user_id": 12345,                    # integer
    "name": "Alice Johnson",             # string
    "email": "alice@school.edu",         # string
    "grade_level": 11,                   # integer
    "gpa": 3.75,                        # float
    "active": True,                      # boolean
    "created_date": "2025-01-15"         # date
}

# Assignment
assignment = {
    "assignment_id": 67890,              # integer
    "title": "Physics Lab Report",       # string
    "subject": "Physics",                # string
    "description": "Lab on momentum",    # string
    "due_date": "2025-03-22",           # date
    "points_possible": 100,              # integer
    "completed": False,                  # boolean
    "completion_percentage": 0.0,        # float
    "estimated_hours": 3.5               # float
}
```

## Best Practices

### 1. Choose Appropriate Types
- Use `boolean` for yes/no questions, not integers or strings
- Use `integer` for counting, `float` for measurements
- Use proper date types, not strings for dates

### 2. Consider Memory Usage
- Don't use 64-bit integers when 32-bit is sufficient
- Consider string length limits for database storage

### 3. Plan for Validation
```python
# Validate data types before processing
def validate_assignment(title, points):
    if not isinstance(title, str):
        raise TypeError("Title must be a string")
    if not isinstance(points, int) or points < 0:
        raise ValueError("Points must be a positive integer")
```

### 4. Document Your Choices
```python
class Assignment:
    """
    Represents a student assignment
    
    Attributes:
        title (str): Assignment name (max 100 characters)
        points (int): Points possible (0-1000)
        due_date (datetime): When assignment is due
        completed (bool): Whether student has finished
    """
```

## Key Takeaways

- **Data types define behavior**: Each type has specific operations and limitations
- **Choose types carefully**: Consider memory usage, operations needed, and data range
- **Validate input**: Always check that data matches expected types
- **Plan for conversion**: Data often needs to be converted between types
- **Document decisions**: Make your data type choices clear to other developers

---

**Next:** Learn about [Data Structures](data-structures.md) to understand how to organize and group related data effectively.
