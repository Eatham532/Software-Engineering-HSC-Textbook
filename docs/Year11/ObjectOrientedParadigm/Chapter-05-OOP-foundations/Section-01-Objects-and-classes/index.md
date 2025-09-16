# 5.1 Objects and classes

## Learning objectives

By the end of this section, you will be able to:

- Explain what objects and classes are and how they relate to each other

- Identify attributes (data) and methods (behaviour) in objects

- Distinguish between instances and classes

- Understand how objects communicate through message passing

- Describe how Python handles method calls and parameter passing

## What are objects?

In the real world, we interact with objects every day. Your phone, your car, your pet, even you yourself - these are all objects. Each object has:

- **Attributes** (characteristics or properties): Your phone has a colour, a screen size, a battery level

- **Behaviours** (things it can do): Your phone can make calls, send messages, run apps

Object-oriented programming takes this natural way of thinking about the world and applies it to software. In programming, an **object** is a software entity that combines data (attributes) and code (methods) together.

```python
# Think of a simple bank account object
# Attributes: account_number, balance, owner_name
# Behaviours: deposit, withdraw, check_balance
```

## What are classes?

A **class** is like a blueprint or template for creating objects. Just as an architect's blueprint can be used to build many houses, a class can be used to create many objects of the same type.

```python
class BankAccount:
    """A simple bank account class - this is the blueprint"""
    
    def __init__(self, account_number, owner_name, initial_balance=0):
        # These are attributes (data)
        self.account_number = account_number
        self.owner_name = owner_name
        self.balance = initial_balance
    
    def deposit(self, amount):
        """This is a method (behaviour)"""
        if amount > 0:
            self.balance += amount
            return f"Deposited ${amount}. New balance: ${self.balance}"
        return "Invalid deposit amount"
    
    def withdraw(self, amount):
        """Another method"""
        if 0 < amount <= self.balance:
            self.balance -= amount
            return f"Withdrew ${amount}. New balance: ${self.balance}"
        return "Insufficient funds or invalid amount"
    
    def check_balance(self):
        """A simple getter method"""
        return f"Current balance: ${self.balance}"
```

## Instances vs Classes

The **class** is the blueprint, but an **instance** (or object) is what you create from that blueprint:

```python
# BankAccount is the class (blueprint)
# These are instances (actual objects created from the blueprint)
alice_account = BankAccount("ACC001", "Alice Smith", 1000)
bob_account = BankAccount("ACC002", "Bob Jones", 500)

print(alice_account.check_balance())  # Current balance: $1000
print(bob_account.check_balance())    # Current balance: $500
```

Key differences:

| Class | Instance |
|-------|----------|
| Blueprint/template | Actual object |
| Defines structure | Has actual data |
| Written once | Can create many |
| `class BankAccount:` | `alice_account = BankAccount(...)` |

## Message passing

Objects don't work in isolation - they need to communicate with each other. This communication happens through **message passing**, which in Python means calling methods on objects.

```python
# Create two account objects
alice_account = BankAccount("ACC001", "Alice Smith", 1000)
bob_account = BankAccount("ACC002", "Bob Jones", 500)

# Message passing: sending messages (calling methods) on objects
result = alice_account.deposit(200)  # Alice receives a "deposit" message
print(result)  # Deposited $200. New balance: $1200

result = bob_account.withdraw(100)   # Bob receives a "withdraw" message
print(result)  # Withdrew $100. New balance: $400
```

When you write `alice_account.deposit(200)`, you're:

1. Sending a message called "deposit" to the alice_account object

2. Passing the parameter 200 along with the message

3. The object processes the message and returns a response

## How Python handles message passing

When you call a method on an object, several things happen behind the scenes:

```python
alice_account.deposit(200)
```

1. **Method lookup**: Python finds the `deposit` method in the `BankAccount` class

2. **Self binding**: Python automatically passes the object (`alice_account`) as the first parameter (`self`)

3. **Parameter passing**: The argument `200` is passed as the `amount` parameter

4. **Method execution**: The method runs with access to the object's data

5. **Return value**: The method returns a result back to the caller

```python
# This is what Python does internally:
# BankAccount.deposit(alice_account, 200)
# But we write it as:
alice_account.deposit(200)
```

## Practice

/// details | Exercise 1: Identify objects and classes
    type: question
    open: false

Look around your classroom. Identify:

- 3 real-world objects

- What class (type) each object belongs to

- 3 attributes each object has

- 2 behaviours each object could have

**Task**: Write down your observations and explain how these relate to object-oriented programming concepts.

/// details | Sample Solution
    type: success
    open: false

**Example observations:**

1. **Object**: Desk

   - **Class**: Furniture

   - **Attributes**: height, width, material, number_of_drawers

   - **Behaviours**: store_items(), adjust_height()

2. **Object**: Computer

   - **Class**: ElectronicDevice

   - **Attributes**: brand, screen_size, processing_speed, memory

   - **Behaviours**: turn_on(), run_program(), connect_to_network()

3. **Object**: Textbook

   - **Class**: EducationalMaterial

   - **Attributes**: title, author, page_count, subject

   - **Behaviours**: open_to_page(), bookmark_page()

**Relation to OOP**: Each object belongs to a class (type), has attributes (data), and behaviours (methods). This mirrors how we create classes and instances in programming.
///
///

/// details | Exercise 2: Create a simple class
    type: question
    open: false

Create a `Student` class with:

- Attributes: name, student_id, grade

- Methods: introduce() and study(subject)

**Task**: Implement the Student class and demonstrate its usage.

/// details | Sample Solution
    type: success
    open: false

```python
class Student:
    def __init__(self, name, student_id, grade):
        self.name = name
        self.student_id = student_id
        self.grade = grade
    
    def introduce(self):
        return f"Hello, I'm {self.name} (ID: {self.student_id}) in grade {self.grade}"
    
    def study(self, subject):
        return f"{self.name} is studying {subject}"

# Usage example
student1 = Student("Alice", "STU001", 11)
print(student1.introduce())  # Hello, I'm Alice (ID: STU001) in grade 11
print(student1.study("Mathematics"))  # Alice is studying Mathematics
```

///
///

/// details | Exercise 3: Message passing
    type: question
    open: false

Using your `Student` class:

1. Create two student instances

2. Have them introduce themselves (call the introduce method)

3. Have them study different subjects

**Task**: Write code that demonstrates message passing between objects.

/// details | Sample Solution
    type: success
    open: false

```python
# Create two student instances
alice = Student("Alice Johnson", "STU001", 11)
bob = Student("Bob Smith", "STU002", 11)

# Message passing: calling methods on objects
print("=== Student Introductions ===")
print(alice.introduce())
print(bob.introduce())

print("\n=== Students Studying ===")
print(alice.study("Computer Science"))
print(bob.study("Mathematics"))
print(alice.study("Physics"))
```

**Explanation**: This demonstrates message passing where:

- `alice.introduce()` sends an "introduce" message to the alice object

- `bob.study("Mathematics")` sends a "study" message with a parameter

- Each object processes the message and returns a response
///
///

## Recap

- **Objects** combine data (attributes) and behaviour (methods) together

- **Classes** are blueprints for creating objects

- **Instances** are actual objects created from a class

- **Message passing** is how objects communicate by calling methods

- Python handles method calls by automatically binding `self` and passing parameters

- The object-oriented approach mirrors how we naturally think about the world

Understanding these fundamentals sets the foundation for all object-oriented programming concepts we'll explore in the following sections.
