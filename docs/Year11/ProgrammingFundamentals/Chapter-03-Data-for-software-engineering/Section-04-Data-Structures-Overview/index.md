# 3.4 Data Structures Overview

## What Are Data Structures?

A **data structure** is a way of organizing and storing data so that it can be accessed and modified efficiently. Just like different containers in your kitchen (bowls, drawers, spice racks) are designed for different types of items, different data structures are designed for different types of data and operations.

Think of data structures as the "containers" that hold your program's information, each with its own strengths and best use cases.

## Why Do We Need Different Data Structures?

Different problems require different solutions:

- **Shopping list**: A simple list works perfectly

- **Phone book**: A hash table allows instant lookup by name

- **Family tree**: A tree structure shows relationships clearly

- **Undo function**: A stack remembers the last action first

Choosing the right data structure can make your program faster, use less memory, and be easier to understand.

## Single-Dimensional Arrays (Python Lists)

### What They Are

In Python, we use **lists** to represent single-dimensional arrays. A list is an ordered collection of items that can be accessed by their position (index).

```python
# Creating a simple list
grades = [85, 92, 78, 96, 88]
names = ["Alice", "Bob", "Charlie", "Diana"]
mixed_data = [1, "hello", 3.14, True]

# Accessing elements by index (starts at 0)
print(grades[0])    # Output: 85 (first element)
print(names[1])     # Output: "Bob" (second element)
print(grades[-1])   # Output: 88 (last element)
```

### Common Operations

```python
student_scores = [75, 82, 91]

# Adding elements
student_scores.append(88)           # Add to end: [75, 82, 91, 88]
student_scores.insert(1, 79)        # Insert at position 1: [75, 79, 82, 91, 88]

# Removing elements
student_scores.remove(82)           # Remove first occurrence: [75, 79, 91, 88]
last_score = student_scores.pop()   # Remove and return last: 88

# Finding elements
position = student_scores.index(91) # Find position of 91
length = len(student_scores)        # Get number of elements

print(f"Score 91 is at position {position}")
print(f"We have {length} scores")
```

### When to Use Lists

- Storing sequences of similar items

- When you need to maintain order

- When you need to access items by position

- For collections that grow and shrink

## Multidimensional Arrays (Lists of Lists)

### 2D Arrays - Tables and Grids

A **2D array** is like a table with rows and columns. In Python, we create them using lists of lists.

```python
# Grade book: 3 students, 4 subjects
# Each row is a student, each column is a subject
grade_book = [
    [85, 92, 78, 88],  # Alice's grades
    [91, 87, 94, 89],  # Bob's grades
    [76, 83, 81, 85]   # Charlie's grades
]

# Accessing specific grades
alice_math = grade_book[0][1]     # Alice's math grade (row 0, column 1)
bob_science = grade_book[1][2]    # Bob's science grade (row 1, column 2)

print(f"Alice's math grade: {alice_math}")
print(f"Bob's science grade: {bob_science}")
```

### Practical Example: Seating Chart

```python
# Movie theater seating (3 rows, 5 seats each)
# True = occupied, False = available
seating_chart = [
    [True, False, True, False, False],   # Row 1
    [False, False, False, True, True],   # Row 2
    [True, True, False, False, True]     # Row 3
]

def find_available_seats():
    """Find all available seats in the theater."""
    available = []
    
    for row in range(len(seating_chart)):
        for seat in range(len(seating_chart[row])):
            if not seating_chart[row][seat]:  # If seat is False (available)
                available.append(f"Row {row + 1}, Seat {seat + 1}")
    
    return available

print("Available seats:", find_available_seats())
```

## Records (Dictionaries)

### What They Are

A **record** groups related information together. In Python, we use dictionaries to create records.

```python
# Student record - grouping related information
student = {
    "name": "Sarah Johnson",
    "age": 17,
    "grade_average": 87.5,
    "subjects": ["Math", "Science", "English", "History"],
    "enrollment_status": True
}

# Accessing record fields
print(f"Student: {student['name']}")
print(f"Age: {student['age']}")
print(f"Average: {student['grade_average']}%")
```

### Multiple Records

```python
# Class roster - list of student records
class_roster = [
    {"name": "Alice", "age": 16, "grade": 85},
    {"name": "Bob", "age": 17, "grade": 92},
    {"name": "Charlie", "age": 16, "grade": 78}
]

# Finding students with grades above 80
high_achievers = []
for student in class_roster:
    if student["grade"] > 80:
        high_achievers.append(student["name"])

print("High achievers:", high_achievers)
```

## Trees (Conceptual Introduction)

### What They Are

A **tree** is a hierarchical data structure that starts with a root and branches out like a family tree or organization chart.

```python
# Simple family tree using nested dictionaries
family_tree = {
    "name": "Grandpa John",
    "children": [
        {
            "name": "Dad Mike",
            "children": [
                {"name": "Sarah", "children": []},
                {"name": "Tom", "children": []}
            ]
        },
        {
            "name": "Aunt Lisa",
            "children": [
                {"name": "Emma", "children": []}
            ]
        }
    ]
}

def print_family(person, level=0):
    """Print family tree with indentation to show levels."""
    indent = "  " * level
    print(f"{indent}{person['name']}")
    
    for child in person['children']:
        print_family(child, level + 1)

print("Family Tree:")
print_family(family_tree)
```

### When to Use Trees

- Representing hierarchical relationships (family trees, organization charts)

- File system structures (folders and subfolders)

- Decision-making processes

- Parsing and organizing structured data

## Stacks (Last In, First Out)

### What They Are

A **stack** works like a stack of plates - you can only add or remove from the top. This is called "Last In, First Out" (LIFO).

```python
# Using a Python list as a stack
browser_history = []

# "Push" - add to top of stack
browser_history.append("google.com")
browser_history.append("youtube.com")
browser_history.append("github.com")

print("Current history:", browser_history)

# "Pop" - remove from top of stack
last_page = browser_history.pop()
print(f"Going back from: {last_page}")
print("History after going back:", browser_history)

# Check what's on top without removing
if browser_history:
    current_page = browser_history[-1]
    print(f"Current page: {current_page}")
```

### Practical Example: Undo Function

```python
class TextEditor:
    def __init__(self):
        self.text = ""
        self.undo_stack = []
    
    def type_text(self, new_text):
        """Add text and save current state for undo."""
        self.undo_stack.append(self.text)  # Save current state
        self.text += new_text
    
    def undo(self):
        """Restore previous state."""
        if self.undo_stack:
            self.text = self.undo_stack.pop()
            return True
        return False

# Using the text editor
editor = TextEditor()
editor.type_text("Hello ")
editor.type_text("World!")
print(f"Current text: '{editor.text}'")

editor.undo()
print(f"After undo: '{editor.text}'")
```

## Hash Tables (Python Dictionaries)

### What They Are

A **hash table** allows instant lookup of values using keys. Python dictionaries are hash tables!

```python
# Phone book - instant lookup by name
phone_book = {
    "Alice": "555-0101",
    "Bob": "555-0102",
    "Charlie": "555-0103",
    "Diana": "555-0104"
}

# Instant lookup - no need to search through the whole list
alice_number = phone_book["Alice"]
print(f"Alice's number: {alice_number}")

# Adding new entries
phone_book["Emma"] = "555-0105"

# Checking if someone is in the phone book
if "Bob" in phone_book:
    print(f"Bob's number is {phone_book['Bob']}")
```

### When to Use Hash Tables

- When you need fast lookup by a unique identifier

- Counting occurrences of items

- Caching/memoization

- Database-like operations

```python
# Counting letter frequencies
def count_letters(text):
    """Count how many times each letter appears."""
    letter_counts = {}
    
    for letter in text.lower():
        if letter.isalpha():  # Only count letters
            if letter in letter_counts:
                letter_counts[letter] += 1
            else:
                letter_counts[letter] = 1
    
    return letter_counts

message = "Hello World"
frequencies = count_letters(message)
print("Letter frequencies:", frequencies)
```

## Sequential Files (CSV)

### What They Are

**Sequential files** store data in a sequence, like lines in a text file. **CSV** (Comma-Separated Values) files are a common format for storing tabular data.

```python
import csv

# Writing student data to CSV
students_data = [
    ["Name", "Age", "Grade"],           # Header row
    ["Alice", 16, 85],
    ["Bob", 17, 92],
    ["Charlie", 16, 78]
]

# Write to CSV file
with open("students.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(students_data)

print("Data written to students.csv")

# Reading from CSV file
with open("students.csv", "r") as file:
    reader = csv.reader(file)
    
    for row_number, row in enumerate(reader):
        if row_number == 0:
            print("Headers:", row)
        else:
            name, age, grade = row
            print(f"Student: {name}, Age: {age}, Grade: {grade}")
```

### Working with CSV Dictionaries

```python
import csv

# Writing with headers
fieldnames = ["name", "age", "grade"]
students = [
    {"name": "Alice", "age": 16, "grade": 85},
    {"name": "Bob", "age": 17, "grade": 92}
]

with open("students_dict.csv", "w", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(students)

# Reading with headers
with open("students_dict.csv", "r") as file:
    reader = csv.DictReader(file)
    
    for student in reader:
        print(f"{student['name']} is {student['age']} with grade {student['grade']}")
```

## Choosing the Right Data Structure

### Quick Reference Guide

| Need | Use | Example |
|------|-----|---------|
| Ordered collection, access by position | List | Shopping list, grades |
| Table/grid of data | 2D List | Spreadsheet, game board |
| Group related information | Dictionary (Record) | Student profile, product info |
| Hierarchical relationships | Tree | Family tree, file system |
| Undo/redo, reverse order | Stack | Browser history, text editor |
| Fast lookup by key | Hash Table (Dict) | Phone book, cache |
| Store/load data files | CSV | Export data, data exchange |

### Performance Considerations (For Reference)

```python
# Lists are good for:
# - Accessing by index: very fast
# - Adding to end: very fast
# - Searching for value: slow for large lists

# Dictionaries are good for:
# - Looking up by key: very fast
# - Adding new key-value pairs: very fast
# - No ordering (before Python 3.7)
```

## Practice Exercises

### Exercise 1: Grade Book System

Create a 2D list representing a grade book for 4 students and 3 subjects. Calculate the average grade for each student and each subject.

### Exercise 2: Inventory Management

Use a dictionary to track inventory items with their quantities. Implement functions to add items, remove items, and check if an item is in stock.

### Exercise 3: Browser History

Implement a simple browser history using a stack. Add functions to visit a new page, go back, and display current history.

### Exercise 4: Student Database

Create a CSV file with student records and write functions to:

- Read all students

- Find students by grade range

- Add new students

- Calculate class average

## Common Mistakes to Avoid

1. **Index errors**: Remember Python lists start at index 0

2. **Modifying lists while iterating**: Create a copy if you need to change the list

3. **Forgetting CSV file modes**: Use "w" for writing, "r" for reading

4. **Not handling empty data structures**: Check if lists/dictionaries are empty before accessing

## Summary

Data structures are the foundation of efficient programming:

- **Lists**: Perfect for ordered collections and sequences

- **2D Lists**: Ideal for tables, grids, and matrices

- **Records (Dictionaries)**: Group related information together

- **Trees**: Represent hierarchical relationships

- **Stacks**: Handle last-in-first-out scenarios

- **Hash Tables**: Enable fast lookups and mappings

- **CSV Files**: Store and exchange tabular data

Understanding when and how to use each data structure will make your programs more efficient and easier to understand.

---

**Cross-reference**: This section builds on the data types from [Section 3.2](../Section-02-Standard-Data-Types/index.md) and data dictionaries from [Section 3.3](../Section-03-Data-Dictionaries/index.md). These concepts prepare you for implementing these structures in Python in [Chapter 4](../../Chapter-04-Developing-solutions-with-code/index.md).
