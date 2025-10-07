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

/// details | Exercise 1: Grade Book System
    type: question
    open: false

Create a 2D list representing a grade book for 4 students and 3 subjects. Calculate the average grade for each student and each subject.

/// details | Sample Solution
    type: success
    open: false

```python
# Create a 2D list for 4 students and 3 subjects
# Format: [[student1_grades], [student2_grades], ...]
grade_book = [
    [85, 92, 78],  # Student 1: Math, Science, English
    [91, 88, 95],  # Student 2
    [76, 84, 89],  # Student 3
    [93, 79, 87]   # Student 4
]

# Calculate average for each student
print("Student Averages:")
for i, grades in enumerate(grade_book):
    student_avg = sum(grades) / len(grades)
    print(f"Student {i+1}: {student_avg:.1f}")

# Calculate average for each subject
print("\nSubject Averages:")
num_subjects = len(grade_book[0])
for subject in range(num_subjects):
    subject_grades = [student[subject] for student in grade_book]
    subject_avg = sum(subject_grades) / len(subject_grades)
    subject_names = ["Math", "Science", "English"]
    print(f"{subject_names[subject]}: {subject_avg:.1f}")

# Find highest and lowest grades
all_grades = [grade for student in grade_book for grade in student]
print(f"\nOverall Statistics:")
print(f"Highest grade: {max(all_grades)}")
print(f"Lowest grade: {min(all_grades)}")
print(f"Class average: {sum(all_grades)/len(all_grades):.1f}")

```

This demonstrates:

- **2D list creation** and access

- **List comprehensions** for extracting columns

- **Nested loops** for processing 2D data

- **Mathematical operations** on collections

- **Formatted output** for readability
///
///
///

/// details | Exercise 2: Inventory Management
    type: question
    open: false

Use a dictionary to track inventory items with their quantities. Implement functions to add items, remove items, and check if an item is in stock.

/// details | Sample Solution
    type: success
    open: false

```python
def add_item(inventory, item_name, quantity):
    """Add quantity to existing item or create new item."""
    if item_name in inventory:
        inventory[item_name] += quantity
    else:
        inventory[item_name] = quantity
    print(f"Added {quantity} {item_name}(s). New total: {inventory[item_name]}")

def remove_item(inventory, item_name, quantity):
    """Remove quantity from item if available."""
    if item_name not in inventory:
        print(f"Error: {item_name} not found in inventory")
        return False
    
    if inventory[item_name] < quantity:
        print(f"Error: Only {inventory[item_name]} {item_name}(s) available")
        return False
    
    inventory[item_name] -= quantity
    print(f"Removed {quantity} {item_name}(s). Remaining: {inventory[item_name]}")
    return True

def is_in_stock(inventory, item_name, required_quantity=1):
    """Check if item is available in sufficient quantity."""
    return item_name in inventory and inventory[item_name] >= required_quantity

def display_inventory(inventory):
    """Display all items and their quantities."""
    if not inventory:
        print("Inventory is empty")
        return
    
    print("Current Inventory:")
    for item, quantity in inventory.items():
        status = "IN STOCK" if quantity > 0 else "OUT OF STOCK"
        print(f"  {item}: {quantity} ({status})")

# Example usage
inventory = {}

# Add some items
add_item(inventory, "laptop", 5)
add_item(inventory, "mouse", 10)
add_item(inventory, "keyboard", 3)

# Check stock
print(f"\nMouse in stock (5 needed): {is_in_stock(inventory, 'mouse', 5)}")
print(f"Monitor in stock: {is_in_stock(inventory, 'monitor')}")

# Remove items
remove_item(inventory, "mouse", 3)
remove_item(inventory, "monitor", 1)  # Should fail

# Display final inventory
print("\nFinal inventory:")
display_inventory(inventory)

```

This demonstrates:

- **Dictionary operations** (add, access, modify)

- **Function definitions** with parameters and return values

- **Conditional logic** for validation

- **Error handling** for invalid operations

- **Iteration** over dictionary items

- **Modular design** with separate functions
///
///
///

/// details | Exercise 3: Browser History
    type: question
    open: false

Implement a simple browser history using a stack. Add functions to visit a new page, go back, and display current history.

/// details | Sample Solution
    type: success
    open: false

```python
class BrowserHistory:
    def __init__(self):
        self.history = []  # Stack to store visited pages
        self.current_page = None
    
    def visit_page(self, url):
        """Visit a new page, adding it to history."""
        if self.current_page is not None:
            self.history.append(self.current_page)
        self.current_page = url
        print(f"Visited: {url}")
    
    def go_back(self):
        """Go back to the previous page."""
        if not self.history:
            print("Error: No previous page to go back to")
            return False
        
        previous_page = self.history.pop()
        print(f"Went back to: {previous_page}")
        self.current_page = previous_page
        return True
    
    def get_current_page(self):
        """Get the current page URL."""
        return self.current_page
    
    def display_history(self):
        """Display the browsing history."""
        if not self.history and self.current_page is None:
            print("No browsing history")
            return
        
        print("Browsing History (most recent first):")
        if self.current_page:
            print(f"  CURRENT: {self.current_page}")
        
        # Show history in reverse order (most recent first)
        for i, page in enumerate(reversed(self.history), 1):
            print(f"  {i}: {page}")
    
    def clear_history(self):
        """Clear all browsing history."""
        self.history = []
        self.current_page = None
        print("History cleared")

# Example usage
browser = BrowserHistory()

# Visit some pages
browser.visit_page("https://www.google.com")
browser.visit_page("https://www.github.com")
browser.visit_page("https://www.python.org")

# Display history
browser.display_history()

# Go back
print("\nGoing back...")
browser.go_back()
browser.display_history()

# Go back again
print("\nGoing back again...")
browser.go_back()
browser.display_history()

# Try to go back too far
print("\nTrying to go back when at beginning...")
browser.go_back()
browser.go_back()  # Should fail

```

This demonstrates:

- **Stack implementation** using a list

- **Class design** with methods and attributes

- **Error handling** for invalid operations

- **List operations** (append, pop)

- **Iteration** and display formatting

- **State management** for current position
///
///
///

/// details | Exercise 4: Student Database
    type: question
    open: false

Create a CSV file with student records and write functions to:

- Read all students

- Find students by grade range

- Add new students

- Calculate class average

/// details | Sample Solution
    type: success
    open: false

```python
import csv
import os

def create_sample_data(filename):
    """Create a sample CSV file with student data."""
    students = [
        ["ID", "Name", "Grade"],
        ["1", "Alice Johnson", "85.5"],
        ["2", "Bob Smith", "92.0"],
        ["3", "Carol Davis", "78.3"],
        ["4", "David Wilson", "88.7"],
        ["5", "Eva Brown", "91.2"]
    ]
    
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(students)
    print(f"Created sample data file: {filename}")

def read_all_students(filename):
    """Read and return all students from CSV file."""
    students = []
    try:
        with open(filename, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Convert grade to float
                row['Grade'] = float(row['Grade'])
                students.append(row)
    except FileNotFoundError:
        print(f"Error: File {filename} not found")
    return students

def find_students_by_grade_range(filename, min_grade, max_grade):
    """Find students within a grade range."""
    students = read_all_students(filename)
    matching_students = []
    
    for student in students:
        if min_grade <= student['Grade'] <= max_grade:
            matching_students.append(student)
    
    return matching_students

def add_student(filename, student_id, name, grade):
    """Add a new student to the CSV file."""
    # Check if student ID already exists
    students = read_all_students(filename)
    existing_ids = [s['ID'] for s in students]
    
    if student_id in existing_ids:
        print(f"Error: Student ID {student_id} already exists")
        return False
    
    # Add new student
    with open(filename, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([student_id, name, str(grade)])
    
    print(f"Added student: {name} (ID: {student_id}, Grade: {grade})")
    return True

def calculate_class_average(filename):
    """Calculate and return the class average grade."""
    students = read_all_students(filename)
    if not students:
        return 0.0
    
    total_grades = sum(student['Grade'] for student in students)
    return total_grades / len(students)

# Example usage
filename = "students.csv"

# Create sample data
create_sample_data(filename)

# Read all students
print("\nAll students:")
students = read_all_students(filename)
for student in students:
    print(f"  {student['ID']}: {student['Name']} - {student['Grade']}")

# Find students in grade range
print("\nStudents with grades 80-90:")
high_performers = find_students_by_grade_range(filename, 80, 90)
for student in high_performers:
    print(f"  {student['Name']}: {student['Grade']}")

# Add new student
add_student(filename, "6", "Frank Miller", 87.5)

# Calculate class average
average = calculate_class_average(filename)
print(f"\nClass average: {average:.2f}")

# Clean up
if os.path.exists(filename):
    os.remove(filename)

```

This demonstrates:

- **CSV file operations** (read, write, append)

- **Dictionary usage** for structured data

- **File error handling** and validation

- **List comprehensions** and filtering

- **Mathematical operations** on data collections

- **Modular function design** for data operations
///
///
///

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
