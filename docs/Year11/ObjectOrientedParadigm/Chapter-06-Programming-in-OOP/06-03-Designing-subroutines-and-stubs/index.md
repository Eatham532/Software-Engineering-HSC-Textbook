# 6.3 Designing subroutines and stubs

## Why it matters

Well-designed method signatures create clear contracts between different parts of your code. Stubs allow you to build and test your program incrementally, helping you catch design problems early and make progress even when some parts aren't fully implemented yet.

## Concepts

### Method signatures

A method signature defines how other code can interact with your method. It includes the method name, parameters, parameter types, and return type. Good signatures are:

- **Clear**: the purpose is obvious from the name and parameters

- **Focused**: each method does one specific task

- **Consistent**: similar operations follow similar patterns

```python
class BankAccount:
    def __init__(self, account_number, initial_balance):
        """Create a new bank account with the given number and balance."""
        self.account_number = account_number
        self.balance = initial_balance
    
    def deposit(self, amount):
        """Add money to the account. Returns new balance."""
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount
        return self.balance
    
    def withdraw(self, amount):
        """Remove money from account. Returns new balance."""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance
    
    def get_balance(self):
        """Return current account balance."""
        return self.balance

```

### Designing with stubs

A stub is a temporary method implementation that focuses on the interface rather than the full logic. Stubs help you:

- Test your class design before implementing everything

- Build incrementally without waiting for all parts to be complete

- Identify interface problems early

```python
class ShoppingCart:
    def __init__(self):
        """Create an empty shopping cart."""
        self.items = []
    
    def add_item(self, product_id, quantity):
        """Add an item to the cart."""
        # Stub: basic implementation for testing
        self.items.append({"id": product_id, "qty": quantity})
        print(f"Added {quantity} of product {product_id}")
    
    def remove_item(self, product_id):
        """Remove an item from the cart."""
        # Stub: placeholder for now
        print(f"TODO: Remove product {product_id}")
        return False
    
    def calculate_total(self):
        """Calculate total price of items in cart."""
        # Stub: return dummy value for testing
        print("TODO: Calculate real total")
        return 0.00
    
    def checkout(self):
        """Process the purchase."""
        # Stub: simplified version
        total = self.calculate_total()
        print(f"Processing checkout for ${total}")
        return True

```

/// details | Guided example: Student gradebook
    type: example
    open: false

Let's design a gradebook system using stubs to plan our implementation:

```python
class Student:
    def __init__(self, student_id, name):
        """Create a student with ID and name."""
        self.student_id = student_id
        self.name = name
        self.grades = []
    
    def add_grade(self, subject, score):
        """Add a grade for a subject."""
        # Stub: basic implementation
        self.grades.append({"subject": subject, "score": score})
    
    def get_average(self):
        """Calculate average grade across all subjects."""
        # Stub: simplified calculation
        if not self.grades:
            return 0.0
        total = sum(grade["score"] for grade in self.grades)
        return total / len(self.grades)
    
    def get_grades_for_subject(self, subject):
        """Get all grades for a specific subject."""
        # Stub: placeholder
        print(f"TODO: Get grades for {subject}")
        return []

class Gradebook:
    def __init__(self):
        """Create an empty gradebook."""
        self.students = {}
    
    def add_student(self, student):
        """Add a student to the gradebook."""
        # Stub: basic implementation
        self.students[student.student_id] = student
    
    def record_grade(self, student_id, subject, score):
        """Record a grade for a student."""
        # Stub: basic implementation with validation
        if student_id not in self.students:
            print(f"Student {student_id} not found")
            return False
        
        student = self.students[student_id]
        student.add_grade(subject, score)
        return True
    
    def get_class_average(self, subject):
        """Calculate class average for a subject."""
        # Stub: placeholder for complex calculation
        print(f"TODO: Calculate class average for {subject}")
        return 0.0
    
    def generate_report(self, student_id):
        """Generate a grade report for a student."""
        # Stub: basic report
        if student_id not in self.students:
            return "Student not found"
        
        student = self.students[student_id]
        avg = student.get_average()
        return f"{student.name}: Average = {avg:.1f}"

# Test our stub implementation
gradebook = Gradebook()
student1 = Student("12345", "Alice")
gradebook.add_student(student1)

gradebook.record_grade("12345", "Math", 85)
gradebook.record_grade("12345", "Science", 92)

print(gradebook.generate_report("12345"))

```

///

### Planning with PlantUML

Before implementing, sketch your class structure:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

class Student {
    - student_id: string
    - name: string
    - grades: list
    + \_\_init\_\_(student_id, name)
    + add_grade(subject, score)
    + get_average(): float
    + get_grades_for_subject(subject): list
}

class Gradebook {
    - students: dict
    + \_\_init\_\_()
    + add_student(student)
    + record_grade(student_id, subject, score): bool
    + get_class_average(subject): float
    + generate_report(student_id): string
}

Gradebook --> "*" Student : manages
@enduml

```

## Try it

/// details | Exercise 1: Design a Library System
    type: question
    open: false

Design method signatures for a simple library system with these requirements:

1. **Book class**: track title, author, ISBN, and availability

2. **Library class**: manage books, handle checkouts and returns

3. **Member class**: store member info and borrowed books

For each class, write:

- Constructor signature with docstring

- 3-4 key method signatures with docstrings

- Stub implementations that print what they would do

/// details | Sample Solution
    type: success
    open: false

```python
class Book:
    def __init__(self, isbn, title, author):
        """Create a book with ISBN, title, and author."""
        self.isbn = isbn
        self.title = title
        self.author = author
        self.is_available = True
    
    def checkout(self):
        """Mark book as checked out. Returns success status."""
        # Stub implementation
        if self.is_available:
            self.is_available = False
            print(f"Checked out: {self.title}")
            return True
        return False
    
    def return_book(self):
        """Mark book as returned."""
        # Stub implementation
        self.is_available = True
        print(f"Returned: {self.title}")

class Member:
    def __init__(self, member_id, name):
        """Create a library member."""
        self.member_id = member_id
        self.name = name
        self.borrowed_books = []
    
    def borrow_book(self, book):
        """Add book to member's borrowed list."""
        # Stub implementation
        self.borrowed_books.append(book)
        print(f"{self.name} borrowed {book.title}")
    
    def return_book(self, book):
        """Remove book from borrowed list."""
        # Stub implementation
        if book in self.borrowed_books:
            self.borrowed_books.remove(book)
            print(f"{self.name} returned {book.title}")

class Library:
    def __init__(self):
        """Create an empty library."""
        self.books = {}
        self.members = {}
    
    def add_book(self, book):
        """Add a book to the library catalog."""
        # Stub implementation
        self.books[book.isbn] = book
        print(f"Added book: {book.title}")
    
    def register_member(self, member):
        """Register a new library member."""
        # Stub implementation
        self.members[member.member_id] = member
        print(f"Registered member: {member.name}")
    
    def checkout_book(self, member_id, isbn):
        """Handle book checkout process."""
        # Stub implementation
        print(f"TODO: Process checkout for member {member_id}, book {isbn}")
        return False

```

///
///

/// details | Exercise 2: Planning with Stubs
    type: question
    open: false

You're building a simple task manager. Create stub implementations for:

1. **Task class**: title, description, due date, completion status

2. **TaskList class**: manage multiple tasks, filter by status

3. Key methods: add task, mark complete, get overdue tasks

Focus on clear method signatures and basic stub logic.

/// details | Sample Solution
    type: success
    open: false

```python
from datetime import datetime

class Task:
    def __init__(self, title, description, due_date):
        """Create a task with title, description, and due date."""
        self.title = title
        self.description = description
        self.due_date = due_date
        self.is_complete = False
        self.created_at = datetime.now()
    
    def mark_complete(self):
        """Mark this task as completed."""
        # Stub implementation
        self.is_complete = True
        print(f"Completed: {self.title}")
    
    def is_overdue(self):
        """Check if task is past due date."""
        # Stub implementation
        print(f"TODO: Check if {self.title} is overdue")
        return False
    
    def get_summary(self):
        """Return a summary string for this task."""
        # Stub implementation
        status = "✓" if self.is_complete else "○"
        return f"{status} {self.title} (due: {self.due_date})"

class TaskList:
    def __init__(self, name):
        """Create a named task list."""
        self.name = name
        self.tasks = []
    
    def add_task(self, task):
        """Add a task to this list."""
        # Stub implementation
        self.tasks.append(task)
        print(f"Added task: {task.title}")
    
    def get_incomplete_tasks(self):
        """Return list of incomplete tasks."""
        # Stub implementation
        print("TODO: Filter incomplete tasks")
        return []
    
    def get_overdue_tasks(self):
        """Return list of overdue tasks."""
        # Stub implementation
        print("TODO: Find overdue tasks")
        return []
    
    def mark_task_complete(self, task_title):
        """Mark a task complete by title."""
        # Stub implementation
        print(f"TODO: Mark '{task_title}' as complete")
        return False

```

///
///

## Recap

Good method design starts with clear signatures that act as contracts. Stubs let you build incrementally—you can test your class design and interfaces before implementing complex logic. This approach helps you:

- Catch design problems early

- Build confidence in your architecture

- Make steady progress on complex projects

- Test integration between classes before everything is complete

Focus on making your method names and parameters self-explanatory, and use stubs to validate your design choices.
