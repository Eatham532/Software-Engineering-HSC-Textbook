# 4.2 Data Structures in Python (Required Set)

## From Theory to Implementation

In [Section 3.4](../../Chapter-03-Data-for-software-engineering/Section-04-Data-Structures-Overview/index.md), we learned about different data structures conceptually. Now it's time to implement them in Python! This section focuses on the specific data structures required for the NSW HSC syllabus, showing you how to use them effectively in your programs.

The required data structures are:

- Single and multidimensional arrays (Python lists)

- Lists with operations

- Trees (simple nested representations)

- Stacks (using list operations)

- Hash tables (Python dictionaries)

- Sequential files (CSV)

## Single and Multidimensional Arrays → Python Lists

### Single-Dimensional Arrays (1D Lists)

Python lists are our implementation of single-dimensional arrays. They store multiple values in a single variable, accessible by index.

```python
# Creating and using 1D arrays (lists)
student_grades = [85, 92, 78, 96, 88]
student_names = ["Alice", "Bob", "Charlie", "Diana", "Eve"]

# Accessing elements by index
first_grade = student_grades[0]    # 85
last_name = student_names[-1]      # "Eve"

print(f"First student: {student_names[0]} with grade {student_grades[0]}")

# Common operations
print(f"Total students: {len(student_names)}")
print(f"Highest grade: {max(student_grades)}")
print(f"Average grade: {sum(student_grades) / len(student_grades):.1f}")
```

### Array Processing Patterns

```python
def process_exam_scores(scores):
    """Demonstrate common array processing patterns."""
    
    # Pattern 1: Find maximum value and its position
    max_score = scores[0]
    max_position = 0
    
    for i in range(len(scores)):
        if scores[i] > max_score:
            max_score = scores[i]
            max_position = i
    
    print(f"Highest score: {max_score} at position {max_position}")
    
    # Pattern 2: Count elements meeting a condition
    passing_count = 0
    for score in scores:
        if score >= 60:
            passing_count += 1
    
    print(f"Students passing: {passing_count} out of {len(scores)}")
    
    # Pattern 3: Create a new array based on conditions
    letter_grades = []
    for score in scores:
        if score >= 90:
            letter_grades.append("A")
        elif score >= 80:
            letter_grades.append("B")
        elif score >= 70:
            letter_grades.append("C")
        elif score >= 60:
            letter_grades.append("D")
        else:
            letter_grades.append("F")
    
    return letter_grades

# Test the processing function
exam_scores = [95, 87, 76, 92, 58, 83]
grades = process_exam_scores(exam_scores)
print("Letter grades:", grades)
```

### Multidimensional Arrays (2D Lists)

Two-dimensional arrays represent tables, grids, or matrices using lists of lists.

```python
# Creating a 2D array - grade book for 4 students, 3 subjects
# Each row represents a student, each column represents a subject
grade_book = [
    [85, 92, 78],  # Alice: Math, Science, English
    [91, 87, 94],  # Bob: Math, Science, English
    [76, 83, 81],  # Charlie: Math, Science, English
    [88, 95, 89]   # Diana: Math, Science, English
]

student_names = ["Alice", "Bob", "Charlie", "Diana"]
subject_names = ["Math", "Science", "English"]

# Accessing specific elements
alice_math = grade_book[0][0]        # Row 0, Column 0
bob_english = grade_book[1][2]       # Row 1, Column 2

print(f"Alice's Math grade: {alice_math}")
print(f"Bob's English grade: {bob_english}")
```

### 2D Array Operations

```python
def analyze_grade_book(grades, students, subjects):
    """Analyze a 2D grade book array."""
    
    print("=== Grade Book Analysis ===")
    
    # Display the complete grade book
    print("\nComplete Grade Book:")
    print("Student".ljust(12), end="")
    for subject in subjects:
        print(subject.ljust(10), end="")
    print()
    
    for i in range(len(students)):
        print(students[i].ljust(12), end="")
        for j in range(len(subjects)):
            print(str(grades[i][j]).ljust(10), end="")
        print()
    
    # Calculate student averages (process rows)
    print("\nStudent Averages:")
    for i in range(len(students)):
        total = sum(grades[i])
        average = total / len(grades[i])
        print(f"{students[i]}: {average:.1f}")
    
    # Calculate subject averages (process columns)
    print("\nSubject Averages:")
    for j in range(len(subjects)):
        total = 0
        for i in range(len(students)):
            total += grades[i][j]
        average = total / len(students)
        print(f"{subjects[j]}: {average:.1f}")

# Analyze our grade book
analyze_grade_book(grade_book, student_names, subject_names)
```

### Dynamic 2D Array Creation

```python
def create_seating_chart(rows, seats_per_row):
    """Create a dynamic seating chart for a theater."""
    
    # Create 2D array with all seats initially available (False)
    seating_chart = []
    for row in range(rows):
        seat_row = []
        for seat in range(seats_per_row):
            seat_row.append(False)  # False = available, True = occupied
        seating_chart.append(seat_row)
    
    return seating_chart

def display_seating_chart(chart):
    """Display the seating chart visually."""
    
    print("Seating Chart (O = occupied, . = available):")
    print("   ", end="")
    
    # Print seat numbers header
    for seat in range(len(chart[0])):
        print(f"{seat+1:2}", end="")
    print()
    
    # Print each row
    for row in range(len(chart)):
        print(f"{row+1:2} ", end="")
        for seat in range(len(chart[row])):
            symbol = "O" if chart[row][seat] else "."
            print(f"{symbol:2}", end="")
        print()

def book_seat(chart, row, seat):
    """Book a seat if available."""
    
    if 0 <= row < len(chart) and 0 <= seat < len(chart[0]):
        if not chart[row][seat]:
            chart[row][seat] = True
            print(f"Seat {row+1}-{seat+1} booked successfully!")
            return True
        else:
            print(f"Seat {row+1}-{seat+1} is already occupied!")
            return False
    else:
        print("Invalid seat location!")
        return False

# Create and use the seating system
theater = create_seating_chart(4, 6)
display_seating_chart(theater)

# Book some seats
book_seat(theater, 0, 2)  # Row 1, Seat 3
book_seat(theater, 1, 1)  # Row 2, Seat 2
book_seat(theater, 0, 2)  # Try to book same seat again

print("\nUpdated seating chart:")
display_seating_chart(theater)
```

## Lists (Python List Operations)

### Essential List Operations

```python
# Creating lists
numbers = [10, 20, 30, 40, 50]
fruits = ["apple", "banana", "cherry"]
mixed = [1, "hello", 3.14, True]

# Adding elements
fruits.append("date")              # Add to end: ["apple", "banana", "cherry", "date"]
fruits.insert(1, "blueberry")      # Insert at position 1
numbers.extend([60, 70])           # Add multiple elements

print("After additions:", fruits)
print("Extended numbers:", numbers)

# Removing elements
fruits.remove("banana")            # Remove first occurrence
last_fruit = fruits.pop()          # Remove and return last element
second_fruit = fruits.pop(1)       # Remove and return element at index 1

print("After removals:", fruits)
print(f"Removed: {last_fruit} and {second_fruit}")

# Finding and checking
if "apple" in fruits:
    position = fruits.index("apple")
    print(f"Apple found at position {position}")

count_a = fruits.count("apple")
print(f"Number of apples: {count_a}")
```

### List Manipulation Techniques

```python
def manage_shopping_list():
    """Interactive shopping list manager."""
    
    shopping_list = []
    
    while True:
        print(f"\nShopping List ({len(shopping_list)} items):")
        for i, item in enumerate(shopping_list):
            print(f"{i+1}. {item}")
        
        print("\nOptions:")
        print("1. Add item")
        print("2. Remove item")
        print("3. Move item")
        print("4. Clear list")
        print("5. Exit")
        
        choice = input("Choose option: ")
        
        if choice == "1":
            item = input("Enter item to add: ")
            shopping_list.append(item)
            print(f"Added '{item}' to the list")
        
        elif choice == "2":
            if shopping_list:
                item = input("Enter item to remove: ")
                if item in shopping_list:
                    shopping_list.remove(item)
                    print(f"Removed '{item}' from the list")
                else:
                    print(f"'{item}' not found in list")
            else:
                print("List is empty!")
        
        elif choice == "3":
            if len(shopping_list) >= 2:
                try:
                    old_pos = int(input("Current position (1-based): ")) - 1
                    new_pos = int(input("New position (1-based): ")) - 1
                    
                    if 0 <= old_pos < len(shopping_list) and 0 <= new_pos < len(shopping_list):
                        item = shopping_list.pop(old_pos)
                        shopping_list.insert(new_pos, item)
                        print(f"Moved '{item}' to position {new_pos + 1}")
                    else:
                        print("Invalid positions!")
                except ValueError:
                    print("Please enter valid numbers!")
            else:
                print("Need at least 2 items to move!")
        
        elif choice == "4":
            shopping_list.clear()
            print("List cleared!")
        
        elif choice == "5":
            break
        
        else:
            print("Invalid choice!")

# Run the shopping list manager (uncomment to test)
# manage_shopping_list()
```

### List Sorting and Searching

```python
def demonstrate_list_algorithms():
    """Show sorting and searching algorithms with lists."""
    
    # Sample data
    student_scores = [78, 92, 85, 67, 91, 73, 88, 95]
    student_names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"]
    
    print("Original scores:", student_scores)
    
    # Bubble sort implementation
    def bubble_sort(arr):
        """Sort array using bubble sort algorithm."""
        n = len(arr)
        sorted_arr = arr.copy()  # Don't modify original
        
        for i in range(n):
            for j in range(0, n - i - 1):
                if sorted_arr[j] > sorted_arr[j + 1]:
                    # Swap elements
                    sorted_arr[j], sorted_arr[j + 1] = sorted_arr[j + 1], sorted_arr[j]
        
        return sorted_arr
    
    # Linear search implementation
    def linear_search(arr, target):
        """Find target in array using linear search."""
        for i in range(len(arr)):
            if arr[i] == target:
                return i
        return -1
    
    # Sort the scores
    sorted_scores = bubble_sort(student_scores)
    print("Sorted scores:", sorted_scores)
    
    # Search for a score
    target = 85
    position = linear_search(student_scores, target)
    if position != -1:
        print(f"Score {target} found at position {position} (student: {student_names[position]})")
    else:
        print(f"Score {target} not found")

demonstrate_list_algorithms()
```

## Trees (Simple Nested Dict/List Representation)

### Tree Structures Using Nested Dictionaries

```python
# Simple family tree using nested dictionaries
family_tree = {
    "name": "John (Grandfather)",
    "children": [
        {
            "name": "Michael (Father)",
            "children": [
                {"name": "Sarah (Daughter)", "children": []},
                {"name": "David (Son)", "children": []}
            ]
        },
        {
            "name": "Lisa (Aunt)",
            "children": [
                {"name": "Emma (Cousin)", "children": []}
            ]
        }
    ]
}

def print_family_tree(person, level=0):
    """Print family tree with proper indentation."""
    
    indent = "  " * level
    print(f"{indent}{person['name']}")
    
    for child in person['children']:
        print_family_tree(child, level + 1)

def count_family_members(person):
    """Count total number of family members."""
    
    count = 1  # Count current person
    
    for child in person['children']:
        count += count_family_members(child)
    
    return count

def find_person(tree, target_name):
    """Search for a person in the family tree."""
    
    if target_name.lower() in tree['name'].lower():
        return tree
    
    for child in tree['children']:
        result = find_person(child, target_name)
        if result:
            return result
    
    return None

print("Family Tree:")
print_family_tree(family_tree)

print(f"\nTotal family members: {count_family_members(family_tree)}")

# Search for a person
search_name = "Sarah"
person = find_person(family_tree, search_name)
if person:
    print(f"Found: {person['name']}")
else:
    print(f"{search_name} not found in family tree")
```

### File System Tree Structure

```python
# File system representation using nested structure
file_system = {
    "name": "root",
    "type": "folder",
    "contents": [
        {
            "name": "Documents",
            "type": "folder",
            "contents": [
                {"name": "essay.txt", "type": "file", "size": 1024},
                {"name": "report.pdf", "type": "file", "size": 2048},
                {
                    "name": "Projects",
                    "type": "folder",
                    "contents": [
                        {"name": "project1.py", "type": "file", "size": 512}
                    ]
                }
            ]
        },
        {
            "name": "Pictures",
            "type": "folder",
            "contents": [
                {"name": "vacation.jpg", "type": "file", "size": 3072}
            ]
        }
    ]
}

def display_file_system(item, level=0):
    """Display file system structure."""
    
    indent = "  " * level
    if item["type"] == "folder":
        print(f"{indent}📁 {item['name']}/")
        if "contents" in item:
            for content in item["contents"]:
                display_file_system(content, level + 1)
    else:
        print(f"{indent}📄 {item['name']} ({item['size']} bytes)")

def calculate_folder_size(folder):
    """Calculate total size of a folder and its contents."""
    
    if folder["type"] == "file":
        return folder["size"]
    
    total_size = 0
    if "contents" in folder:
        for item in folder["contents"]:
            total_size += calculate_folder_size(item)
    
    return total_size

print("File System Structure:")
display_file_system(file_system)

print(f"\nTotal size: {calculate_folder_size(file_system)} bytes")
```

## Stacks (Implemented via Python List append/pop)

### Stack Implementation Using Lists

```python
class SimpleStack:
    """Stack implementation using Python list."""
    
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """Add item to top of stack."""
        self.items.append(item)
        print(f"Pushed: {item}")
    
    def pop(self):
        """Remove and return top item from stack."""
        if self.is_empty():
            print("Stack is empty!")
            return None
        
        item = self.items.pop()
        print(f"Popped: {item}")
        return item
    
    def peek(self):
        """Look at top item without removing it."""
        if self.is_empty():
            print("Stack is empty!")
            return None
        
        return self.items[-1]
    
    def is_empty(self):
        """Check if stack is empty."""
        return len(self.items) == 0
    
    def size(self):
        """Get number of items in stack."""
        return len(self.items)
    
    def display(self):
        """Display stack contents."""
        if self.is_empty():
            print("Stack: empty")
        else:
            print(f"Stack (top -> bottom): {self.items[::-1]}")

# Demonstrate stack operations
print("=== Stack Demo ===")
stack = SimpleStack()

# Push items
stack.push("First")
stack.push("Second")
stack.push("Third")
stack.display()

# Peek at top
top_item = stack.peek()
print(f"Top item: {top_item}")
stack.display()

# Pop items
stack.pop()
stack.pop()
stack.display()

print(f"Stack size: {stack.size()}")
```

### Practical Stack Applications

```python
def bracket_checker(expression):
    """Check if brackets are properly matched using a stack."""
    
    stack = []
    opening = "([{"
    closing = ")]}"
    pairs = {"(": ")", "[": "]", "{": "}"}
    
    for char in expression:
        if char in opening:
            stack.append(char)
        elif char in closing:
            if not stack:
                return False, f"Closing '{char}' without opening bracket"
            
            last_opening = stack.pop()
            if pairs[last_opening] != char:
                return False, f"Mismatched brackets: '{last_opening}' and '{char}'"
    
    if stack:
        return False, f"Unclosed bracket: '{stack[-1]}'"
    
    return True, "All brackets properly matched"

def undo_redo_system():
    """Simple undo/redo system using two stacks."""
    
    undo_stack = []
    redo_stack = []
    current_text = ""
    
    def type_text(text):
        nonlocal current_text
        undo_stack.append(current_text)  # Save current state
        redo_stack.clear()               # Clear redo history
        current_text += text
        print(f"Typed: '{text}' | Text: '{current_text}'")
    
    def undo():
        nonlocal current_text
        if undo_stack:
            redo_stack.append(current_text)  # Save current for redo
            current_text = undo_stack.pop()
            print(f"Undo | Text: '{current_text}'")
        else:
            print("Nothing to undo")
    
    def redo():
        nonlocal current_text
        if redo_stack:
            undo_stack.append(current_text)  # Save current for undo
            current_text = redo_stack.pop()
            print(f"Redo | Text: '{current_text}'")
        else:
            print("Nothing to redo")
    
    # Demonstrate the system
    print("\n=== Undo/Redo Demo ===")
    type_text("Hello")
    type_text(" World")
    type_text("!")
    
    undo()
    undo()
    
    type_text(" Python")
    
    undo()
    redo()

# Test bracket checker
test_expressions = [
    "(a + b) * c",
    "[(a + b) * c]",
    "((a + b)",
    "(a + b] * c",
    "{[()]}"
]

print("=== Bracket Checker ===")
for expr in test_expressions:
    valid, message = bracket_checker(expr)
    print(f"'{expr}': {message}")

# Run undo/redo demo
undo_redo_system()
```

## Hash Tables (Python Dict)

### Dictionary Fundamentals

```python
# Creating and using dictionaries
student_grades = {
    "Alice": 92,
    "Bob": 87,
    "Charlie": 78,
    "Diana": 95
}

# Accessing and modifying
print(f"Alice's grade: {student_grades['Alice']}")
student_grades["Eve"] = 89  # Add new student
student_grades["Bob"] = 90  # Update existing student

print("Updated grades:", student_grades)

# Safe access methods
alice_grade = student_grades.get("Alice", 0)  # Returns 0 if not found
frank_grade = student_grades.get("Frank", 0)

print(f"Alice: {alice_grade}, Frank: {frank_grade}")

# Dictionary operations
print("All students:", list(student_grades.keys()))
print("All grades:", list(student_grades.values()))
print("Student-grade pairs:", list(student_grades.items()))
```

### Advanced Dictionary Applications

```python
def create_word_frequency_counter():
    """Count word frequencies in text using a dictionary."""
    
    def count_words(text):
        """Count frequency of each word in text."""
        
        # Convert to lowercase and split into words
        words = text.lower().replace(",", "").replace(".", "").split()
        
        word_count = {}
        
        for word in words:
            if word in word_count:
                word_count[word] += 1
            else:
                word_count[word] = 1
        
        return word_count
    
    def display_word_frequencies(word_dict):
        """Display word frequencies sorted by count."""
        
        # Convert to list of tuples and sort by frequency
        word_list = list(word_dict.items())
        
        # Simple sort by frequency (descending)
        for i in range(len(word_list)):
            for j in range(i + 1, len(word_list)):
                if word_list[i][1] < word_list[j][1]:
                    word_list[i], word_list[j] = word_list[j], word_list[i]
        
        print("Word Frequencies:")
        for word, count in word_list[:10]:  # Show top 10
            print(f"'{word}': {count}")
    
    # Test with sample text
    sample_text = """
    Python is a great programming language. Python is easy to learn.
    Programming with Python is fun. Python has many useful libraries.
    """
    
    word_frequencies = count_words(sample_text)
    display_word_frequencies(word_frequencies)

def create_simple_database():
    """Simple student database using dictionaries."""
    
    students_db = {}
    
    def add_student(student_id, name, age, grade):
        """Add a student to the database."""
        students_db[student_id] = {
            "name": name,
            "age": age,
            "grade": grade
        }
        print(f"Added student: {name}")
    
    def get_student(student_id):
        """Retrieve student information."""
        return students_db.get(student_id, None)
    
    def update_grade(student_id, new_grade):
        """Update a student's grade."""
        if student_id in students_db:
            students_db[student_id]["grade"] = new_grade
            print(f"Updated grade for {students_db[student_id]['name']}")
        else:
            print("Student not found")
    
    def list_all_students():
        """List all students in the database."""
        print("\n=== Student Database ===")
        for student_id, info in students_db.items():
            print(f"ID: {student_id} | Name: {info['name']} | Age: {info['age']} | Grade: {info['grade']}")
    
    def find_students_by_grade(min_grade):
        """Find students with grades above threshold."""
        high_achievers = []
        for student_id, info in students_db.items():
            if info["grade"] >= min_grade:
                high_achievers.append((student_id, info))
        return high_achievers
    
    # Populate database
    add_student("S001", "Alice Johnson", 16, 92)
    add_student("S002", "Bob Smith", 17, 87)
    add_student("S003", "Charlie Brown", 16, 78)
    add_student("S004", "Diana Prince", 17, 95)
    
    list_all_students()
    
    # Update a grade
    update_grade("S002", 90)
    
    # Find high achievers
    top_students = find_students_by_grade(90)
    print(f"\nStudents with grades >= 90:")
    for student_id, info in top_students:
        print(f"- {info['name']}: {info['grade']}")

# Run demonstrations
print("=== Word Frequency Counter ===")
create_word_frequency_counter()

print("\n=== Student Database ===")
create_simple_database()
```

## Sequential Files (CSV Read/Write)

### Basic CSV Operations

```python
import csv

def create_student_csv():
    """Create a CSV file with student data."""
    
    students = [
        ["Student_ID", "Name", "Age", "Grade", "Subject"],
        ["S001", "Alice Johnson", 16, 92, "Math"],
        ["S002", "Bob Smith", 17, 87, "Science"],
        ["S003", "Charlie Brown", 16, 78, "English"],
        ["S004", "Diana Prince", 17, 95, "Math"],
        ["S005", "Eve Wilson", 16, 89, "Science"]
    ]
    
    # Write to CSV file
    with open("students.csv", "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerows(students)
    
    print("Created students.csv with sample data")

def read_student_csv():
    """Read and display data from CSV file."""
    
    try:
        with open("students.csv", "r") as file:
            reader = csv.reader(file)
            
            print("Student Data from CSV:")
            for row_num, row in enumerate(reader):
                if row_num == 0:
                    print("Headers:", " | ".join(row))
                    print("-" * 50)
                else:
                    print(f"Row {row_num}: {' | '.join(row)}")
    
    except FileNotFoundError:
        print("students.csv not found. Please create it first.")

def advanced_csv_operations():
    """Demonstrate advanced CSV operations with DictReader/DictWriter."""
    
    # Sample data as list of dictionaries
    students = [
        {"student_id": "S001", "name": "Alice Johnson", "math": 92, "science": 88, "english": 85},
        {"student_id": "S002", "name": "Bob Smith", "math": 87, "science": 91, "english": 83},
        {"student_id": "S003", "name": "Charlie Brown", "math": 78, "science": 82, "english": 86},
        {"student_id": "S004", "name": "Diana Prince", "math": 95, "science": 93, "english": 91}
    ]
    
    # Write using DictWriter
    fieldnames = ["student_id", "name", "math", "science", "english", "average"]
    
    with open("student_grades.csv", "w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        
        for student in students:
            # Calculate average
            avg = (student["math"] + student["science"] + student["english"]) / 3
            student["average"] = round(avg, 1)
            writer.writerow(student)
    
    print("Created student_grades.csv with calculated averages")
    
    # Read using DictReader
    with open("student_grades.csv", "r") as file:
        reader = csv.DictReader(file)
        
        print("\nStudent Grades with Averages:")
        print("Name".ljust(15), "Math".ljust(6), "Science".ljust(8), "English".ljust(8), "Average")
        print("-" * 50)
        
        for row in reader:
            print(f"{row['name']:<15} {row['math']:<6} {row['science']:<8} {row['english']:<8} {row['average']}")

def csv_analysis_tools():
    """Tools for analyzing CSV data."""
    
    def analyze_grades_csv(filename):
        """Analyze student grades from CSV file."""
        
        try:
            with open(filename, "r") as file:
                reader = csv.DictReader(file)
                
                students = list(reader)
                
                if not students:
                    print("No data found in file")
                    return
                
                # Calculate statistics
                math_scores = [float(student["math"]) for student in students]
                science_scores = [float(student["science"]) for student in students]
                english_scores = [float(student["english"]) for student in students]
                
                print(f"\n=== Analysis of {filename} ===")
                print(f"Total students: {len(students)}")
                
                # Subject averages
                print(f"Math average: {sum(math_scores) / len(math_scores):.1f}")
                print(f"Science average: {sum(science_scores) / len(science_scores):.1f}")
                print(f"English average: {sum(english_scores) / len(english_scores):.1f}")
                
                # Find top performer
                for student in students:
                    if float(student["average"]) == max(float(s["average"]) for s in students):
                        print(f"Top performer: {student['name']} with {student['average']} average")
                        break
        
        except FileNotFoundError:
            print(f"File {filename} not found")
        except Exception as e:
            print(f"Error analyzing file: {e}")
    
    def export_filtered_data(input_file, output_file, min_average):
        """Export students with average above threshold."""
        
        try:
            with open(input_file, "r") as infile, open(output_file, "w", newline="") as outfile:
                reader = csv.DictReader(infile)
                writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
                
                writer.writeheader()
                
                count = 0
                for row in reader:
                    if float(row["average"]) >= min_average:
                        writer.writerow(row)
                        count += 1
                
                print(f"Exported {count} students with average >= {min_average} to {output_file}")
        
        except FileNotFoundError:
            print(f"Input file {input_file} not found")
        except Exception as e:
            print(f"Error filtering data: {e}")
    
    # Run analysis tools
    analyze_grades_csv("student_grades.csv")
    export_filtered_data("student_grades.csv", "high_achievers.csv", 90.0)

# Demonstrate CSV operations
print("=== CSV Operations Demo ===")
create_student_csv()
read_student_csv()

print("\n=== Advanced CSV Operations ===")
advanced_csv_operations()

print("\n=== CSV Analysis Tools ===")
csv_analysis_tools()
```

## Integrating Multiple Data Structures

### Complete Student Management System

```python
import csv

class StudentManagementSystem:
    """Complete system using multiple data structures."""
    
    def __init__(self):
        # Hash table for quick student lookup
        self.students = {}
        
        # 2D array for grade storage
        self.subjects = ["Math", "Science", "English", "History"]
        
        # Stack for undo operations
        self.undo_stack = []
        
        # Tree structure for class hierarchy
        self.class_structure = {
            "school": "Trinity Grammar",
            "years": [
                {
                    "year": 11,
                    "classes": ["11A", "11B", "11C"]
                },
                {
                    "year": 12,
                    "classes": ["12A", "12B", "12C"]
                }
            ]
        }
    
    def add_student(self, student_id, name, year, class_name):
        """Add a new student to the system."""
        
        # Save current state for undo
        self.undo_stack.append(("add", student_id, self.students.copy()))
        
        # Initialize grade array with zeros
        grades = [0] * len(self.subjects)
        
        self.students[student_id] = {
            "name": name,
            "year": year,
            "class": class_name,
            "grades": grades
        }
        
        print(f"Added student: {name} (ID: {student_id})")
    
    def update_grade(self, student_id, subject_index, grade):
        """Update a student's grade for a specific subject."""
        
        if student_id in self.students:
            # Save current state for undo
            self.undo_stack.append(("update", student_id, self.students[student_id]["grades"].copy()))
            
            self.students[student_id]["grades"][subject_index] = grade
            subject_name = self.subjects[subject_index]
            student_name = self.students[student_id]["name"]
            
            print(f"Updated {student_name}'s {subject_name} grade to {grade}")
        else:
            print("Student not found")
    
    def calculate_average(self, student_id):
        """Calculate a student's average grade."""
        
        if student_id in self.students:
            grades = self.students[student_id]["grades"]
            # Only include non-zero grades in average
            valid_grades = [g for g in grades if g > 0]
            
            if valid_grades:
                return sum(valid_grades) / len(valid_grades)
            else:
                return 0
        
        return None
    
    def generate_report_card(self, student_id):
        """Generate a detailed report card for a student."""
        
        if student_id not in self.students:
            print("Student not found")
            return
        
        student = self.students[student_id]
        
        print(f"\n=== Report Card ===")
        print(f"Student: {student['name']}")
        print(f"ID: {student_id}")
        print(f"Year: {student['year']}")
        print(f"Class: {student['class']}")
        print("-" * 30)
        
        for i, subject in enumerate(self.subjects):
            grade = student["grades"][i]
            if grade > 0:
                print(f"{subject:<10}: {grade}")
            else:
                print(f"{subject:<10}: Not graded")
        
        print("-" * 30)
        average = self.calculate_average(student_id)
        print(f"Average: {average:.1f}")
    
    def save_to_csv(self, filename):
        """Save all student data to CSV file."""
        
        fieldnames = ["student_id", "name", "year", "class"] + self.subjects + ["average"]
        
        with open(filename, "w", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            
            for student_id, student in self.students.items():
                row = {
                    "student_id": student_id,
                    "name": student["name"],
                    "year": student["year"],
                    "class": student["class"],
                    "average": round(self.calculate_average(student_id), 1)
                }
                
                # Add subject grades
                for i, subject in enumerate(self.subjects):
                    row[subject] = student["grades"][i]
                
                writer.writerow(row)
        
        print(f"Data saved to {filename}")
    
    def undo_last_operation(self):
        """Undo the last operation using the stack."""
        
        if not self.undo_stack:
            print("Nothing to undo")
            return
        
        operation, student_id, saved_state = self.undo_stack.pop()
        
        if operation == "add":
            # Remove the student that was added
            if student_id in self.students:
                del self.students[student_id]
                print(f"Undid: Added student {student_id}")
        
        elif operation == "update":
            # Restore previous grades
            if student_id in self.students:
                self.students[student_id]["grades"] = saved_state
                print(f"Undid: Grade update for student {student_id}")
    
    def display_class_structure(self):
        """Display the school's class structure (tree)."""
        
        print(f"\n=== {self.class_structure['school']} Structure ===")
        
        for year_info in self.class_structure["years"]:
            print(f"Year {year_info['year']}:")
            for class_name in year_info["classes"]:
                student_count = sum(1 for s in self.students.values() 
                                  if s["year"] == year_info["year"] and s["class"] == class_name)
                print(f"  {class_name}: {student_count} students")

# Demonstrate the complete system
print("=== Student Management System Demo ===")

# Create the system
sms = StudentManagementSystem()

# Add students
sms.add_student("S001", "Alice Johnson", 11, "11A")
sms.add_student("S002", "Bob Smith", 11, "11A")
sms.add_student("S003", "Charlie Brown", 12, "12B")

# Update grades (Math=0, Science=1, English=2, History=3)
sms.update_grade("S001", 0, 92)  # Alice's Math
sms.update_grade("S001", 1, 88)  # Alice's Science
sms.update_grade("S002", 0, 87)  # Bob's Math
sms.update_grade("S002", 2, 91)  # Bob's English

# Generate report cards
sms.generate_report_card("S001")
sms.generate_report_card("S002")

# Display class structure
sms.display_class_structure()

# Save to CSV
sms.save_to_csv("school_data.csv")

# Demonstrate undo
print("\n=== Undo Demo ===")
sms.undo_last_operation()
sms.generate_report_card("S002")
```

## Summary

This section has shown you how to implement all the required data structures in Python:

- **Single/Multidimensional Arrays**: Python lists for storing and processing collections

- **Lists**: Full range of list operations for dynamic data management

- **Trees**: Nested dictionaries and lists for hierarchical data

- **Stacks**: List-based LIFO operations for undo systems and parsing

- **Hash Tables**: Python dictionaries for fast lookup and data relationships

- **Sequential Files**: CSV operations for data persistence and exchange

Key takeaways:

- Choose the right data structure for your problem

- Combine multiple structures for complex applications

- Use proper algorithms for searching and sorting

- Handle edge cases and error conditions

- Test your implementations thoroughly

---

**Cross-reference**: This section implements the data structures from [Section 3.4](../../Chapter-03-Data-for-software-engineering/Section-04-Data-Structures-Overview/index.md) using the control structures from [Section 4.1](../Section-01-Control-Structures-in-Python/index.md). Next, we'll learn how to organize code into functions in [Section 4.3](../Section-03-From-Pseudocode-to-Python-Functions/index.md).
