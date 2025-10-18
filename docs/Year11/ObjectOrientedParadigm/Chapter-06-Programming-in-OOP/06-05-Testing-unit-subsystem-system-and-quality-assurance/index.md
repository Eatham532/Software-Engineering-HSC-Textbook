---
title: "Section 6.5: Testing - Unit, Subsystem, System and Quality Assurance"
---

# Section 6.5: Testing - Unit, Subsystem, System and Quality Assurance

## Learning Objectives

By the end of this section, you will be able to:

- Understand the different levels of testing and their purposes in software development

- Write basic unit tests for class methods using Python's unittest framework

- Perform subsystem integration checks to verify component interactions

- Apply quality assurance practices including review checklists and acceptance criteria

- Develop a continuous testing mindset for maintaining code quality

- Design appropriate test cases for object-oriented programs

## Introduction

Testing is a fundamental part of software engineering that ensures your code works correctly, reliably, and meets requirements. In object-oriented programming, testing becomes particularly important because objects interact with each other in complex ways, and changes to one class can affect many others.

Quality Assurance (QA) goes beyond just running tests—it encompasses all activities that ensure software quality throughout the development process. This includes code reviews, testing strategies, documentation standards, and continuous monitoring of code quality.

## Understanding Test Levels

Software testing occurs at multiple levels, each serving a different purpose in ensuring overall system quality.

### Unit Testing

**Purpose**: Test individual methods and classes in isolation

Unit tests focus on the smallest testable parts of an application—typically individual methods or small groups of related methods within a class. They verify that each unit of code performs as designed.

**Characteristics of good unit tests:**

- **Fast**: Run quickly (milliseconds)

- **Independent**: Don't depend on other tests or external systems

- **Repeatable**: Produce same results every time

- **Self-validating**: Clear pass/fail result

- **Timely**: Written close to when the code is written

**Example: Testing a BankAccount class**

```python
import unittest

class BankAccount:
    """Simple bank account class for demonstration."""
    
    def __init__(self, account_holder, initial_balance=0):
        """
        Initialize a new bank account.
        
        Args:
            account_holder (str): Name of the account holder
            initial_balance (float): Starting balance (default 0)
        
        Raises:
            ValueError: If initial_balance is negative
        """
        if initial_balance < 0:
            raise ValueError("Initial balance cannot be negative")
        
        self.account_holder = account_holder
        self.balance = initial_balance
        self.transaction_history = []
    
    def deposit(self, amount):
        """
        Deposit money into the account.
        
        Args:
            amount (float): Amount to deposit
        
        Returns:
            float: New balance
        
        Raises:
            ValueError: If amount is not positive
        """
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        
        self.balance += amount
        self.transaction_history.append(f"Deposit: +${amount:.2f}")
        return self.balance
    
    def withdraw(self, amount):
        """
        Withdraw money from the account.
        
        Args:
            amount (float): Amount to withdraw
        
        Returns:
            float: New balance
        
        Raises:
            ValueError: If amount is invalid or insufficient funds
        """
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        
        self.balance -= amount
        self.transaction_history.append(f"Withdrawal: -${amount:.2f}")
        return self.balance
    
    def get_balance(self):
        """Get current account balance."""
        return self.balance


class TestBankAccount(unittest.TestCase):
    """Unit tests for BankAccount class."""
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.account = BankAccount("Alice Johnson", 100.0)
    
    def test_initialization_with_valid_balance(self):
        """Test account creation with valid initial balance."""
        account = BankAccount("Bob Smith", 50.0)
        self.assertEqual(account.account_holder, "Bob Smith")
        self.assertEqual(account.balance, 50.0)
        self.assertEqual(len(account.transaction_history), 0)
    
    def test_initialization_with_zero_balance(self):
        """Test account creation with zero initial balance."""
        account = BankAccount("Charlie Brown")
        self.assertEqual(account.balance, 0.0)
    
    def test_initialization_with_negative_balance_raises_error(self):
        """Test that negative initial balance raises ValueError."""
        with self.assertRaises(ValueError) as context:
            BankAccount("Dave Wilson", -10.0)
        
        self.assertIn("negative", str(context.exception).lower())
    
    def test_deposit_positive_amount(self):
        """Test depositing a positive amount."""
        new_balance = self.account.deposit(25.0)
        self.assertEqual(new_balance, 125.0)
        self.assertEqual(self.account.get_balance(), 125.0)
        self.assertIn("Deposit: +$25.00", self.account.transaction_history)
    
    def test_deposit_zero_amount_raises_error(self):
        """Test that depositing zero raises ValueError."""
        with self.assertRaises(ValueError) as context:
            self.account.deposit(0)
        
        self.assertIn("positive", str(context.exception).lower())
    
    def test_deposit_negative_amount_raises_error(self):
        """Test that depositing negative amount raises ValueError."""
        with self.assertRaises(ValueError):
            self.account.deposit(-10.0)
    
    def test_withdraw_valid_amount(self):
        """Test withdrawing a valid amount."""
        new_balance = self.account.withdraw(30.0)
        self.assertEqual(new_balance, 70.0)
        self.assertEqual(self.account.get_balance(), 70.0)
        self.assertIn("Withdrawal: -$30.00", self.account.transaction_history)
    
    def test_withdraw_entire_balance(self):
        """Test withdrawing the entire balance."""
        new_balance = self.account.withdraw(100.0)
        self.assertEqual(new_balance, 0.0)
    
    def test_withdraw_more_than_balance_raises_error(self):
        """Test that withdrawing more than balance raises ValueError."""
        with self.assertRaises(ValueError) as context:
            self.account.withdraw(150.0)
        
        self.assertIn("insufficient", str(context.exception).lower())
    
    def test_withdraw_zero_amount_raises_error(self):
        """Test that withdrawing zero raises ValueError."""
        with self.assertRaises(ValueError):
            self.account.withdraw(0)
    
    def test_multiple_transactions(self):
        """Test multiple deposits and withdrawals."""
        self.account.deposit(50.0)  # Balance: 150
        self.account.withdraw(25.0)  # Balance: 125
        self.account.deposit(10.0)   # Balance: 135
        
        self.assertEqual(self.account.get_balance(), 135.0)
        self.assertEqual(len(self.account.transaction_history), 3)


# Running the tests
if __name__ == '__main__':
    unittest.main()

```

### Subsystem Testing

**Purpose**: Test how groups of related classes work together

Subsystem testing (also called integration testing) verifies that different components of your system work correctly when combined. It focuses on the interfaces and interactions between classes.

**Example: Testing a Library Management System**

```python-template
class Book:
    """Represents a book in the library."""
    
    def __init__(self, isbn, title, author):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.is_available = True
        self.borrower = None
    
    def check_out(self, borrower_name):
        """Check out the book to a borrower."""
        if not self.is_available:
            raise ValueError(f"Book '{self.title}' is already checked out")
        
        self.is_available = False
        self.borrower = borrower_name
    
    def return_book(self):
        """Return the book to the library."""
        if self.is_available:
            raise ValueError(f"Book '{self.title}' is not currently checked out")
        
        self.is_available = True
        self.borrower = None


class Library:
    """Manages a collection of books and borrowing operations."""
    
    def __init__(self, name):
        self.name = name
        self.books = {}  # isbn -> Book
        self.borrower_records = {}  # borrower_name -> [isbn_list]
    
    def add_book(self, book):
        """Add a book to the library collection."""
        if book.isbn in self.books:
            raise ValueError(f"Book with ISBN {book.isbn} already exists")
        
        self.books[book.isbn] = book
    
    def find_book(self, isbn):
        """Find a book by ISBN."""
        return self.books.get(isbn)
    
    def check_out_book(self, isbn, borrower_name):
        """Check out a book to a borrower."""
        book = self.find_book(isbn)
        if not book:
            raise ValueError(f"Book with ISBN {isbn} not found")
        
        book.check_out(borrower_name)
        
        # Update borrower records
        if borrower_name not in self.borrower_records:
            self.borrower_records[borrower_name] = []
        self.borrower_records[borrower_name].append(isbn)
    
    def return_book(self, isbn, borrower_name):
        """Return a book from a borrower."""
        book = self.find_book(isbn)
        if not book:
            raise ValueError(f"Book with ISBN {isbn} not found")
        
        if book.borrower != borrower_name:
            raise ValueError(f"Book is not checked out to {borrower_name}")
        
        book.return_book()
        
        # Update borrower records
        if borrower_name in self.borrower_records:
            self.borrower_records[borrower_name].remove(isbn)
    
    def get_books_by_borrower(self, borrower_name):
        """Get list of books currently borrowed by a person."""
        return self.borrower_records.get(borrower_name, [])


class TestLibrarySubsystem(unittest.TestCase):
    """Integration tests for Library and Book classes working together."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.library = Library("Central Library")
        self.book1 = Book("978-0-13-110362-7", "Clean Code", "Robert Martin")
        self.book2 = Book("978-0-13-235088-4", "Clean Architecture", "Robert Martin")
        
        self.library.add_book(self.book1)
        self.library.add_book(self.book2)
    
    def test_complete_borrowing_workflow(self):
        """Test the complete process of borrowing and returning a book."""
        borrower = "Alice Johnson"
        isbn = "978-0-13-110362-7"
        
        # Initially, book should be available
        book = self.library.find_book(isbn)
        self.assertTrue(book.is_available)
        self.assertIsNone(book.borrower)
        
        # Check out the book
        self.library.check_out_book(isbn, borrower)
        
        # Verify book is checked out
        self.assertFalse(book.is_available)
        self.assertEqual(book.borrower, borrower)
        
        # Verify borrower records are updated
        borrowed_books = self.library.get_books_by_borrower(borrower)
        self.assertIn(isbn, borrowed_books)
        
        # Return the book
        self.library.return_book(isbn, borrower)
        
        # Verify book is available again
        self.assertTrue(book.is_available)
        self.assertIsNone(book.borrower)
        
        # Verify borrower records are updated
        borrowed_books = self.library.get_books_by_borrower(borrower)
        self.assertNotIn(isbn, borrowed_books)
    
    def test_multiple_borrowers_different_books(self):
        """Test multiple people borrowing different books."""
        alice_isbn = "978-0-13-110362-7"
        bob_isbn = "978-0-13-235088-4"
        
        # Both borrowers check out different books
        self.library.check_out_book(alice_isbn, "Alice")
        self.library.check_out_book(bob_isbn, "Bob")
        
        # Verify both books are checked out to correct people
        alice_book = self.library.find_book(alice_isbn)
        bob_book = self.library.find_book(bob_isbn)
        
        self.assertEqual(alice_book.borrower, "Alice")
        self.assertEqual(bob_book.borrower, "Bob")
        
        # Verify borrower records
        self.assertIn(alice_isbn, self.library.get_books_by_borrower("Alice"))
        self.assertIn(bob_isbn, self.library.get_books_by_borrower("Bob"))
    
    def test_error_handling_integration(self):
        """Test error handling across subsystem boundaries."""
        isbn = "978-0-13-110362-7"
        
        # Check out book to Alice
        self.library.check_out_book(isbn, "Alice")
        
        # Try to check out same book to Bob - should fail
        with self.assertRaises(ValueError) as context:
            self.library.check_out_book(isbn, "Bob")
        
        self.assertIn("already checked out", str(context.exception))
        
        # Try to return book as wrong person - should fail
        with self.assertRaises(ValueError) as context:
            self.library.return_book(isbn, "Bob")
        
        self.assertIn("not checked out to Bob", str(context.exception))

```

### System Testing

**Purpose**: Test the complete integrated system

System testing evaluates the system as a whole, testing complete user workflows and scenarios. It verifies that all components work together to meet business requirements.

**Example: End-to-end Library System Test**

```python-template
class TestLibrarySystem(unittest.TestCase):
    """System-level tests for complete library workflows."""
    
    def setUp(self):
        """Set up a complete library system."""
        self.library = Library("University Library")
        
        # Add multiple books
        books_data = [
            ("978-0-13-110362-7", "Clean Code", "Robert Martin"),
            ("978-0-13-235088-4", "Clean Architecture", "Robert Martin"),
            ("978-0-134-494162", "Design Patterns", "Gang of Four"),
        ]
        
        for isbn, title, author in books_data:
            book = Book(isbn, title, author)
            self.library.add_book(book)
    
    def test_library_daily_operations(self):
        """Test a typical day's operations in the library."""
        # Morning: Students arrive and borrow books
        self.library.check_out_book("978-0-13-110362-7", "Alice")
        self.library.check_out_book("978-0-13-235088-4", "Bob")
        self.library.check_out_book("978-0-134-494162", "Charlie")
        
        # Check that all books are now unavailable
        for isbn in ["978-0-13-110362-7", "978-0-13-235088-4", "978-0-134-494162"]:
            book = self.library.find_book(isbn)
            self.assertFalse(book.is_available)
        
        # Afternoon: Some students return books
        self.library.return_book("978-0-13-110362-7", "Alice")
        self.library.return_book("978-0-13-235088-4", "Bob")
        
        # New student borrows a returned book
        self.library.check_out_book("978-0-13-110362-7", "Diana")
        
        # End of day verification
        alice_books = self.library.get_books_by_borrower("Alice")
        bob_books = self.library.get_books_by_borrower("Bob")
        charlie_books = self.library.get_books_by_borrower("Charlie")
        diana_books = self.library.get_books_by_borrower("Diana")
        
        self.assertEqual(len(alice_books), 0)  # Returned her book
        self.assertEqual(len(bob_books), 0)    # Returned his book
        self.assertEqual(len(charlie_books), 1)  # Still has one book
        self.assertEqual(len(diana_books), 1)    # Borrowed Alice's returned book
        
        # Verify specific book locations
        self.assertEqual(charlie_books[0], "978-0-134-494162")
        self.assertEqual(diana_books[0], "978-0-13-110362-7")

```

## Quality Assurance Practices

Quality Assurance encompasses all activities that ensure software meets quality standards throughout development.

### Code Review Checklists

Use systematic checklists to maintain consistent code quality:

**Object-Oriented Design Review Checklist:**

- [ ] **Single Responsibility**: Each class has one clear purpose

- [ ] **Proper Encapsulation**: Private data with public interfaces

- [ ] **Clear Method Names**: Names describe what methods do

- [ ] **Appropriate Method Size**: Methods focus on single tasks

- [ ] **Error Handling**: Appropriate exceptions with clear messages

- [ ] **Documentation**: Classes and public methods have docstrings

- [ ] **Test Coverage**: Critical methods have unit tests

**Testing Quality Checklist:**

- [ ] **Test Independence**: Tests don't depend on each other

- [ ] **Clear Test Names**: Test names describe what's being tested

- [ ] **Appropriate Assertions**: Tests verify the right things

- [ ] **Edge Cases**: Tests cover boundary conditions

- [ ] **Error Cases**: Tests verify error handling

- [ ] **Test Data**: Uses realistic but controlled test data

### Continuous Testing Mindset

Adopt practices that make testing a natural part of development:

**1. Test-Driven Development (TDD) Basics**

Write tests before implementing functionality:

```python-template
class TestCalculator(unittest.TestCase):
    """Tests for Calculator class - written before implementation."""
    
    def test_add_positive_numbers(self):
        """Test adding two positive numbers."""
        calc = Calculator()
        result = calc.add(2, 3)
        self.assertEqual(result, 5)
    
    def test_add_negative_numbers(self):
        """Test adding negative numbers."""
        calc = Calculator()
        result = calc.add(-2, -3)
        self.assertEqual(result, -5)
    
    def test_divide_by_zero_raises_error(self):
        """Test that division by zero raises appropriate error."""
        calc = Calculator()
        with self.assertRaises(ZeroDivisionError):
            calc.divide(10, 0)


# Now implement the Calculator class to make tests pass
class Calculator:
    """Simple calculator for basic arithmetic operations."""
    
    def add(self, a, b):
        """Add two numbers."""
        return a + b
    
    def subtract(self, a, b):
        """Subtract second number from first."""
        return a - b
    
    def multiply(self, a, b):
        """Multiply two numbers."""
        return a * b
    
    def divide(self, a, b):
        """Divide first number by second."""
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        return a / b

```

**2. Regular Test Execution**

Make running tests easy and habitual:

```python-template
# Simple test runner script
if __name__ == '__main__':
    # Discover and run all tests
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover('.', pattern='test_*.py')
    
    test_runner = unittest.TextTestRunner(verbosity=2)
    result = test_runner.run(test_suite)
    
    # Report results
    if result.wasSuccessful():
        print("\n✅ All tests passed!")
    else:
        print(f"\n❌ {len(result.failures)} test(s) failed")
        print(f"❌ {len(result.errors)} test(s) had errors")

```

### Acceptance Criteria

Define clear criteria for when features are considered complete and working:

**Example: Student Management System Acceptance Criteria**

```python-template
class TestStudentManagementAcceptance(unittest.TestCase):
    """Acceptance tests based on user requirements."""
    
    def setUp(self):
        """Set up test system."""
        self.student_mgr = StudentManager()
    
    def test_user_story_add_new_student(self):
        """
        User Story: As a registrar, I want to add a new student
        so that they can enroll in courses.
        
        Acceptance Criteria:
        - Student must have unique ID
        - Student must have name and email
        - System generates confirmation
        """
        # Given: A new student's information
        student_id = "S001"
        name = "Alice Johnson"
        email = "alice@university.edu"
        
        # When: I add the student to the system
        result = self.student_mgr.add_student(student_id, name, email)
        
        # Then: The student is successfully added
        self.assertTrue(result.success)
        self.assertEqual(result.student_id, student_id)
        
        # And: I can retrieve the student information
        student = self.student_mgr.find_student(student_id)
        self.assertIsNotNone(student)
        self.assertEqual(student.name, name)
        self.assertEqual(student.email, email)
    
    def test_user_story_prevent_duplicate_students(self):
        """
        User Story: As a registrar, I want to prevent duplicate student IDs
        so that each student has a unique identity.
        
        Acceptance Criteria:
        - Adding student with existing ID fails
        - Error message is clear and helpful
        - Original student data is unchanged
        """
        # Given: A student already exists in the system
        original_id = "S001"
        self.student_mgr.add_student(original_id, "Alice", "alice@uni.edu")
        
        # When: I try to add another student with the same ID
        with self.assertRaises(ValueError) as context:
            self.student_mgr.add_student(original_id, "Bob", "bob@uni.edu")
        
        # Then: The operation fails with clear error
        self.assertIn("already exists", str(context.exception))
        self.assertIn(original_id, str(context.exception))
        
        # And: Original student data is unchanged
        original_student = self.student_mgr.find_student(original_id)
        self.assertEqual(original_student.name, "Alice")

```

## Practice Exercises

/// details | Exercise 1: Write Unit Tests for a Shopping Cart
    type: question
    open: false

Create unit tests for this shopping cart class:

```python-template
class ShoppingCart:
    """Shopping cart for e-commerce application."""
    
    def __init__(self):
        self.items = {}  # product_id -> {'name': str, 'price': float, 'quantity': int}
        self.discount_rate = 0.0
    
    def add_item(self, product_id, name, price, quantity=1):
        """Add item to cart or increase quantity if already present."""
        if price <= 0:
            raise ValueError("Price must be positive")
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        
        if product_id in self.items:
            self.items[product_id]['quantity'] += quantity
        else:
            self.items[product_id] = {
                'name': name,
                'price': price,
                'quantity': quantity
            }
    
    def remove_item(self, product_id):
        """Remove item completely from cart."""
        if product_id not in self.items:
            raise ValueError(f"Product {product_id} not in cart")
        del self.items[product_id]
    
    def update_quantity(self, product_id, new_quantity):
        """Update quantity of existing item."""
        if product_id not in self.items:
            raise ValueError(f"Product {product_id} not in cart")
        if new_quantity <= 0:
            raise ValueError("Quantity must be positive")
        
        self.items[product_id]['quantity'] = new_quantity
    
    def apply_discount(self, discount_rate):
        """Apply percentage discount to cart."""
        if not 0 <= discount_rate <= 1:
            raise ValueError("Discount rate must be between 0 and 1")
        self.discount_rate = discount_rate
    
    def calculate_total(self):
        """Calculate total cost including discount."""
        subtotal = sum(item['price'] * item['quantity'] 
                      for item in self.items.values())
        return subtotal * (1 - self.discount_rate)

```

///

/// details | Exercise 2: Create Integration Tests
    type: question
    open: false

Write integration tests for a simple order processing system with these classes:

```python-template
class Product:
    def __init__(self, product_id, name, price, stock_quantity):
        self.product_id = product_id
        self.name = name
        self.price = price
        self.stock_quantity = stock_quantity

class Inventory:
    def __init__(self):
        self.products = {}
    
    def add_product(self, product):
        self.products[product.product_id] = product
    
    def check_availability(self, product_id, quantity):
        # Returns True if enough stock available
        pass
    
    def reserve_items(self, product_id, quantity):
        # Reduces stock when order is placed
        pass

class Order:
    def __init__(self, order_id):
        self.order_id = order_id
        self.items = []
        self.status = "pending"
    
    def add_item(self, product_id, quantity, price):
        self.items.append({
            'product_id': product_id,
            'quantity': quantity,
            'price': price
        })
    
    def calculate_total(self):
        # Calculate order total
        pass

class OrderProcessor:
    def __init__(self, inventory):
        self.inventory = inventory
        self.orders = {}
    
    def process_order(self, order):
        # Check availability, reserve items, update order status
        pass

```

///

/// details | Exercise 3: Design Acceptance Criteria
    type: question
    open: false

For a simple gradebook application, write acceptance criteria and corresponding tests for these user stories:

1. **User Story**: "As a teacher, I want to add grades for students so that I can track their progress."

2. **User Story**: "As a teacher, I want to calculate class averages so that I can assess overall performance."

3. **User Story**: "As a student, I want to view my current grades so that I can monitor my academic performance."
///

## Section Recap

In this section, you learned about comprehensive testing strategies for object-oriented programs:

1. **Test Levels**: Unit tests for individual methods, subsystem tests for component integration, and system tests for complete workflows

2. **Unit Testing with unittest**: Writing focused, independent tests with clear assertions and appropriate test data

3. **Integration Testing**: Verifying that classes work correctly together and handle cross-component interactions

4. **Quality Assurance Practices**: Using checklists, adopting continuous testing mindset, and defining clear acceptance criteria

5. **Testing Object-Oriented Code**: Special considerations for testing classes, methods, and object interactions

Testing is not just about finding bugs—it's about building confidence in your code, documenting expected behavior, and enabling safe refactoring. Well-tested object-oriented code is more maintainable, reliable, and easier to extend.

Remember: the goal is not just to write tests, but to write **good** tests that provide value. Focus on testing behavior, not implementation details, and always consider what could go wrong with your object interactions.
