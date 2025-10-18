---
title: "3.3 Data Dictionaries"
---

# 3.3 Data Dictionaries

## What is a Data Dictionary?

A **data dictionary** is a formal document that describes the structure, format, and constraints of data used in a software system. Think of it as a blueprint that defines exactly what information your program will store and how it should be formatted.

Just like a building blueprint tells builders the exact specifications for walls, doors, and windows, a data dictionary tells programmers the exact specifications for data fields, their types, and their limitations.

## Why Are Data Dictionaries Important?

Data dictionaries serve several critical purposes:

1. **Consistency**: Ensures everyone on a team uses the same data formats

2. **Validation**: Helps prevent invalid data from entering the system

3. **Documentation**: Provides clear reference for current and future developers

4. **Quality Control**: Reduces bugs by defining exact requirements upfront

## Components of a Data Dictionary

Every data dictionary entry should include:

### Fields

The individual pieces of information being stored. For example, in a student record:

- Name

- Age

- Grade average

- Enrollment status

### Data Types

The kind of data each field will contain (from Section 3.2):

- **String** (`str`): Text data like names

- **Integer** (`int`): Whole numbers like age

- **Float** (`float`): Decimal numbers like averages

- **Boolean** (`bool`): True/False values like enrollment status

- **DateTime** (`datetime`): Date and time information

### Constraints

Rules that limit what values are acceptable:

- **Length constraints**: Maximum/minimum character counts

- **Range constraints**: Minimum/maximum numerical values

- **Format constraints**: Specific patterns (like phone numbers)

- **Required constraints**: Fields that cannot be empty

### Relationships

How different data elements connect to each other:

- **One-to-one**: Each student has exactly one student ID

- **One-to-many**: One teacher can have many students

- **Many-to-many**: Students can enroll in multiple subjects

## Creating a Data Dictionary

Let's create a data dictionary for a Student record.

### Student Record Data Dictionary

| Field Name | Data Type | Constraints | Description | Example |
|------------|-----------|-------------|-------------|---------|
| `name` | String (`str`) | Required, Max 50 characters, Min 2 characters | Student's full name | "Sarah Johnson" |
| `age` | Integer (`int`) | Required, Range: 16-25 | Student's age in years | 17 |
| `grade_average` | Float (`float`) | Required, Range: 0.0-100.0, 1 decimal place | Overall grade percentage | 87.5 |
| `enrollment_status` | Boolean (`bool`) | Required | Whether student is currently enrolled | `True` |

### Units and Ranges Explained

**Units** specify what measurement system is used:

- Age is measured in **years**

- Grade average is measured as a **percentage**

- Name length is measured in **characters**

**Ranges** specify acceptable values:

- Age: 16-25 (typical high school age range)

- Grade average: 0.0-100.0 (standard percentage scale)

- Name: 2-50 characters (reasonable name length limits)

## Python Implementation

Here's how we might implement validation based on our data dictionary:

```python-exec
def validate_student_data(name, age, grade_average, enrollment_status):
    """
    Validate student data against our data dictionary constraints.
    Returns True if valid, False with error message if invalid.
    """
    
    # Validate name
    if not isinstance(name, str):
        return False, "Name must be a string"
    if len(name) < 2 or len(name) > 50:
        return False, "Name must be between 2 and 50 characters"
    
    # Validate age
    if not isinstance(age, int):
        return False, "Age must be an integer"
    if age < 16 or age > 25:
        return False, "Age must be between 16 and 25"
    
    # Validate grade average
    if not isinstance(grade_average, (int, float)):
        return False, "Grade average must be a number"
    if grade_average < 0.0 or grade_average > 100.0:
        return False, "Grade average must be between 0.0 and 100.0"
    
    # Validate enrollment status
    if not isinstance(enrollment_status, bool):
        return False, "Enrollment status must be True or False"
    
    return True, "All data is valid"

# Test our validation function
print(validate_student_data("Sarah Johnson", 17, 87.5, True))
# Output: (True, 'All data is valid')

print(validate_student_data("", 17, 87.5, True))
# Output: (False, 'Name must be between 2 and 50 characters')

print(validate_student_data("Sarah Johnson", 30, 87.5, True))
# Output: (False, 'Age must be between 16 and 25')

```

## Real-World Example: E-commerce Product

Let's create a more complex data dictionary for an online store product:

### Product Data Dictionary

| Field Name | Data Type | Constraints | Relationships | Description |
|------------|-----------|-------------|---------------|-------------|
| `product_id` | String | Required, Exactly 8 characters, Format: "PRD" + 5 digits | Unique identifier | "PRD00123" |
| `name` | String | Required, Max 100 characters | None | "Wireless Bluetooth Headphones" |
| `price` | Float | Required, Min 0.01, Max 9999.99, 2 decimal places | None | 89.99 |
| `category_id` | String | Required, Must exist in categories table | Many-to-one with Category | "CAT001" |
| `in_stock` | Boolean | Required | None | `True` |
| `stock_quantity` | Integer | Required, Min 0 | None | 45 |
| `date_added` | DateTime | Required, Auto-generated | None | "2024-03-15 10:30:00" |

## Advanced Constraints

### Format Constraints

Sometimes we need specific patterns:

```python
import re

def validate_product_id(product_id):
    """Validate product ID follows PRD + 5 digits format."""
    pattern = r'^PRD\d{5}$'
    return bool(re.match(pattern, product_id))

# Test format validation
print(validate_product_id("PRD00123"))  # True
print(validate_product_id("ABC00123"))  # False
print(validate_product_id("PRD123"))    # False

```

### Conditional Constraints

Some constraints depend on other fields:

```python
def validate_stock_rules(in_stock, stock_quantity):
    """Stock quantity must be > 0 if in_stock is True."""
    if in_stock and stock_quantity <= 0:
        return False, "In-stock items must have quantity > 0"
    return True, "Stock rules valid"

```

## Data Dictionary vs Database Schema

While similar, these serve different purposes:

- **Data Dictionary**: Human-readable documentation for design and validation

- **Database Schema**: Machine-readable structure for database creation

Our data dictionary guides the creation of the database schema, but includes additional context like business rules and examples.

## Practice Exercises

### Exercise 1: Library Book Data Dictionary

Create a data dictionary for a library book with these requirements:

- ISBN (exactly 13 digits)

- Title (max 200 characters)

- Author (max 100 characters)

- Publication year (1800-current year)

- Available for loan (yes/no)

- Current borrower ID (optional, 6-digit number)

### Exercise 2: Validation Function

Write a Python function to validate library book data based on your dictionary.

### Exercise 3: Constraint Relationships

Define a constraint where a book can only have a borrower ID if it's not available for loan.

## Common Mistakes to Avoid

1. **Missing constraints**: Always define min/max values for numbers and strings

2. **Unclear relationships**: Specify how data connects to other records

3. **No examples**: Include sample valid data for each field

4. **Forgetting edge cases**: Consider what happens with empty or extreme values

5. **Inconsistent naming**: Use clear, consistent field names throughout


## Summary

Data dictionaries are essential tools for:

- **Planning** data structure before coding

- **Communicating** requirements with team members

- **Validating** data input in your programs

- **Maintaining** consistent data quality

They bridge the gap between conceptual design and actual implementation, ensuring your software handles data correctly and consistently.

Key takeaways:

- Always define data types, constraints, and relationships

- Include examples and units where relevant

- Use data dictionaries to guide validation code

- Keep documentation updated as requirements change
