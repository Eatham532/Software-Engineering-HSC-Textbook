# 5.4 Comparing procedural and OOP

## Learning objectives

By the end of this section, you will be able to:

- Compare and contrast procedural and object-oriented programming approaches

- Identify when to choose OOP over procedural programming and vice versa

- Understand the trade-offs between different programming paradigms

- Transform procedural code into object-oriented code by mapping functions to methods

- Make informed decisions about which paradigm to use for different problems

## Understanding the paradigms

### Procedural programming

**Procedural programming** organizes code as a sequence of functions that operate on data. It follows a top-down approach where you break down a problem into smaller functions.

```python
# Procedural approach: functions and data are separate
def calculate_area(length, width):
    return length * width

def calculate_perimeter(length, width):
    return 2 * (length + width)

def display_info(length, width):
    area = calculate_area(length, width)
    perimeter = calculate_perimeter(length, width)
    print(f"Rectangle: {length}x{width}")
    print(f"Area: {area}")
    print(f"Perimeter: {perimeter}")

# Data and functions are separate
rect_length = 5
rect_width = 3
display_info(rect_length, rect_width)
```

### Object-oriented programming

**Object-oriented programming** organizes code around objects that combine data and the functions that work with that data.

```python
# OOP approach: data and methods are bundled together
class Rectangle:
    def __init__(self, length, width):
        self.length = length
        self.width = width
    
    def calculate_area(self):
        return self.length * self.width
    
    def calculate_perimeter(self):
        return 2 * (self.length + self.width)
    
    def display_info(self):
        print(f"Rectangle: {self.length}x{self.width}")
        print(f"Area: {self.calculate_area()}")
        print(f"Perimeter: {self.calculate_perimeter()}")

# Data and methods are bundled in objects
rect = Rectangle(5, 3)
rect.display_info()
```

## Key differences

| Aspect | Procedural | Object-Oriented |
|--------|------------|-----------------|
| **Organization** | Functions operate on data | Objects bundle data and methods |
| **Data handling** | Global or passed as parameters | Encapsulated within objects |
| **Problem approach** | Top-down decomposition | Bottom-up with objects and interactions |
| **Code reuse** | Function libraries | Inheritance and composition |
| **Modularity** | Separate functions | Classes with clear interfaces |
| **State management** | External or global variables | Object state managed internally |

## When to choose procedural programming

Procedural programming works well when:

### 1. Simple, straightforward problems

```python
# Simple calculation - procedural is fine
def calculate_tax(income, tax_rate):
    return income * tax_rate

def calculate_net_income(gross_income, tax_rate):
    tax = calculate_tax(gross_income, tax_rate)
    return gross_income - tax

# Direct and simple
net = calculate_net_income(50000, 0.25)
```

### 2. Linear data processing

```python
# Processing a list of data - procedural approach
def clean_data(raw_data):
    return [item.strip().lower() for item in raw_data if item]

def validate_emails(email_list):
    return [email for email in email_list if '@' in email]

def process_user_data(raw_emails):
    cleaned = clean_data(raw_emails)
    valid_emails = validate_emails(cleaned)
    return valid_emails
```

### 3. Mathematical or algorithmic problems

```python
# Mathematical calculations work well procedurally
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)
```

## When to choose object-oriented programming

OOP works well when:

### 1. Modeling real-world entities

```python
# Real-world entities fit naturally into classes
class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.grades = []
    
    def add_grade(self, grade):
        if 0 <= grade <= 100:
            self.grades.append(grade)
    
    def get_average(self):
        return sum(self.grades) / len(self.grades) if self.grades else 0

class Course:
    def __init__(self, course_name):
        self.course_name = course_name
        self.students = []
    
    def enroll_student(self, student):
        self.students.append(student)
    
    def get_class_average(self):
        if not self.students:
            return 0
        total = sum(student.get_average() for student in self.students)
        return total / len(self.students)
```

### 2. Complex state management

```python
# Managing complex state is easier with OOP
class GameCharacter:
    def __init__(self, name, health=100):
        self.name = name
        self.health = health
        self.level = 1
        self.experience = 0
        self.inventory = []
    
    def take_damage(self, damage):
        self.health = max(0, self.health - damage)
        if self.health == 0:
            print(f"{self.name} has been defeated!")
    
    def gain_experience(self, exp):
        self.experience += exp
        if self.experience >= self.level * 100:
            self.level_up()
    
    def level_up(self):
        self.level += 1
        self.health = 100  # Full health on level up
        self.experience = 0
        print(f"{self.name} leveled up to {self.level}!")
```

### 3. Systems with multiple interacting components

```python
# Multiple components working together
class BankAccount:
    def __init__(self, account_number, initial_balance=0):
        self.account_number = account_number
        self.balance = initial_balance
        self.transaction_history = []
    
    def deposit(self, amount):
        self.balance += amount
        self.transaction_history.append(f"Deposit: +${amount}")
    
    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            self.transaction_history.append(f"Withdrawal: -${amount}")
            return True
        return False

class Bank:
    def __init__(self):
        self.accounts = {}
    
    def create_account(self, account_number, initial_deposit=0):
        account = BankAccount(account_number, initial_deposit)
        self.accounts[account_number] = account
        return account
    
    def transfer_money(self, from_account, to_account, amount):
        if from_account.withdraw(amount):
            to_account.deposit(amount)
            return True
        return False
```

## Mapping functions to methods

Here's how to transform procedural code into object-oriented code:

### Step 1: Identify data that belongs together

```python
# Procedural: scattered data and functions
customer_name = "John Doe"
customer_email = "john@email.com"
customer_orders = []

def add_order(orders_list, order):
    orders_list.append(order)

def get_total_spent(orders_list):
    return sum(order['amount'] for order in orders_list)

def send_email(email, message):
    print(f"Sending to {email}: {message}")
```

### Step 2: Group related data and functions into classes

```python
# OOP: related data and functions grouped together
class Customer:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.orders = []  # Data belongs with the object
    
    def add_order(self, order):  # Function becomes a method
        self.orders.append(order)
    
    def get_total_spent(self):  # Function becomes a method
        return sum(order['amount'] for order in self.orders)
    
    def send_email(self, message):  # Function becomes a method
        print(f"Sending to {self.email}: {message}")

# Usage is more intuitive
customer = Customer("John Doe", "john@email.com")
customer.add_order({'item': 'Book', 'amount': 25})
total = customer.get_total_spent()
customer.send_email(f"Your total spending: ${total}")
```

### Step 3: Look for opportunities to create hierarchies

```python
# Before: separate functions for different account types
def calculate_savings_interest(balance, rate):
    return balance * rate

def calculate_checking_fees(balance, transactions):
    return 5 if transactions > 10 else 0

# After: inheritance hierarchy
class Account:
    def __init__(self, account_number, balance):
        self.account_number = account_number
        self.balance = balance
    
    def calculate_fees(self):
        return 0  # Base implementation

class SavingsAccount(Account):
    def __init__(self, account_number, balance, interest_rate):
        super().__init__(account_number, balance)
        self.interest_rate = interest_rate
    
    def calculate_interest(self):
        return self.balance * self.interest_rate

class CheckingAccount(Account):
    def __init__(self, account_number, balance):
        super().__init__(account_number, balance)
        self.transactions = 0
    
    def calculate_fees(self):
        return 5 if self.transactions > 10 else 0
```

## Trade-offs to consider

### Procedural advantages

- **Simplicity**: Easier to understand for beginners

- **Direct**: Straightforward problem-solving approach

- **Performance**: Can be more efficient for simple operations

- **Debugging**: Easier to trace execution flow

### OOP advantages

- **Modularity**: Code is organized in logical units

- **Reusability**: Classes can be reused and extended

- **Maintainability**: Changes are localized to specific classes

- **Scalability**: Better for large, complex systems

### When each approach struggles

**Procedural struggles with:**

```python
# Hard to maintain: scattered related data
player_name = "Alice"
player_health = 100
player_level = 5
enemy_name = "Dragon"
enemy_health = 200
enemy_level = 8

# Functions need many parameters
def battle(p_name, p_health, p_level, e_name, e_health, e_level):
    # Complex parameter passing becomes unwieldy
    pass
```

**OOP can be overkill for:**

```python
# Overly complex for simple calculations
class Calculator:
    def add(self, a, b):
        return a + b
    
    def subtract(self, a, b):
        return a - b

# When a simple function would suffice:
def add(a, b):
    return a + b
```

## Practice

/// details | Exercise 1: Identify the better approach
    type: question
    open: false

For each scenario, decide whether procedural or OOP would be better and explain why:

1. A program that converts temperatures between Celsius and Fahrenheit

2. A school management system with students, teachers, and courses

3. A function that finds the largest number in a list

4. A video game with players, enemies, and items

**Task**: Choose the better approach for each and justify your choice.

/// details | Sample Solution
    type: success
    open: false

1. **Temperature conversion**: **Procedural** - Simple mathematical operations don't need objects. Functions like `celsius_to_fahrenheit(temp)` are clear and direct.

2. **School management system**: **OOP** - Real-world entities (students, teachers) with complex relationships and state. Each entity has attributes and behaviors that belong together.

3. **Find largest number**: **Procedural** - Simple algorithm with clear input/output. A function `find_max(numbers)` is perfect.

4. **Video game**: **OOP** - Complex entities with state, behavior, and interactions. Players have health, levels, inventory; enemies have different abilities. OOP handles this complexity well.

///
///

/// details | Exercise 2: Convert procedural to OOP
    type: question
    open: false

Convert this procedural code to object-oriented:

```python
# Procedural library system
books = []
members = []

def add_book(title, author, isbn):
    book = {'title': title, 'author': author, 'isbn': isbn, 'available': True}
    books.append(book)

def add_member(name, member_id):
    member = {'name': name, 'id': member_id, 'borrowed_books': []}
    members.append(member)

def borrow_book(member_id, isbn):
    # Find member and book, update their status
    pass
```

**Task**: Create classes for Book, Member, and Library that encapsulate the data and methods.

/// details | Sample Solution
    type: success
    open: false

```python
class Book:
    def __init__(self, title, author, isbn):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.available = True
    
    def __str__(self):
        return f"{self.title} by {self.author}"

class Member:
    def __init__(self, name, member_id):
        self.name = name
        self.member_id = member_id
        self.borrowed_books = []
    
    def borrow_book(self, book):
        if book.available:
            book.available = False
            self.borrowed_books.append(book)
            return True
        return False
    
    def return_book(self, book):
        if book in self.borrowed_books:
            book.available = True
            self.borrowed_books.remove(book)
            return True
        return False

class Library:
    def __init__(self):
        self.books = []
        self.members = []
    
    def add_book(self, title, author, isbn):
        book = Book(title, author, isbn)
        self.books.append(book)
        return book
    
    def add_member(self, name, member_id):
        member = Member(name, member_id)
        self.members.append(member)
        return member
    
    def find_book(self, isbn):
        return next((book for book in self.books if book.isbn == isbn), None)
    
    def find_member(self, member_id):
        return next((member for member in self.members if member.member_id == member_id), None)
```

///
///

/// details | Exercise 3: Design decision analysis
    type: question
    open: false

Analyze this code and suggest improvements using OOP principles:

```python
# Current procedural approach
def process_payment(amount, payment_type, card_number=None, bank_account=None):
    if payment_type == "credit":
        # Process credit card payment
        return process_credit_card(amount, card_number)
    elif payment_type == "debit":
        # Process debit card payment
        return process_debit_card(amount, card_number)
    elif payment_type == "bank_transfer":
        # Process bank transfer
        return process_bank_transfer(amount, bank_account)
    else:
        return "Invalid payment type"
```

**Task**: Redesign using OOP principles and explain the benefits.

/// details | Sample Solution
    type: success
    open: false

```python
class Payment:
    def __init__(self, amount):
        self.amount = amount
    
    def process(self):
        raise NotImplementedError("Subclasses must implement process()")

class CreditCardPayment(Payment):
    def __init__(self, amount, card_number):
        super().__init__(amount)
        self.card_number = card_number
    
    def process(self):
        # Credit card specific processing
        return f"Processing ${self.amount} credit card payment"

class DebitCardPayment(Payment):
    def __init__(self, amount, card_number):
        super().__init__(amount)
        self.card_number = card_number
    
    def process(self):
        # Debit card specific processing
        return f"Processing ${self.amount} debit card payment"

class BankTransferPayment(Payment):
    def __init__(self, amount, bank_account):
        super().__init__(amount)
        self.bank_account = bank_account
    
    def process(self):
        # Bank transfer specific processing
        return f"Processing ${self.amount} bank transfer"

# Usage with polymorphism
def process_payment(payment):
    return payment.process()

# Benefits:
# 1. Each payment type is self-contained
# 2. Easy to add new payment types without modifying existing code
# 3. Polymorphism allows uniform interface
# 4. Better encapsulation of payment-specific data
```

///
///

## Recap

- **Procedural programming** organizes code as functions operating on data

- **Object-oriented programming** bundles data and methods together in objects

- **Choose procedural** for simple calculations, linear processing, and mathematical problems

- **Choose OOP** for modeling real-world entities, complex state management, and large systems

- **Trade-offs exist**: procedural is simpler but OOP is more maintainable for complex systems

- **Converting procedural to OOP** involves identifying related data and functions to group into classes

- **Neither approach is always better** - the choice depends on the problem and context

Understanding when to use each paradigm is crucial for making good design decisions. Start with the approach that feels natural for your problem, and be prepared to refactor if the complexity grows beyond what your chosen paradigm handles well.
