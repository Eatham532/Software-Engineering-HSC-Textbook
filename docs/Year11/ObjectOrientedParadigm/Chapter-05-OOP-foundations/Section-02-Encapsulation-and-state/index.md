# 5.2 Encapsulation and state

## Why it matters


Encapsulation is one of the core principles of object-oriented programming. It allows objects to protect their internal data and control how it's accessed or modified. This prevents errors, maintains data integrity, and makes code more reliable and easier to maintain.

## Concepts

### What is encapsulation?

**Encapsulation** is the practice of bundling data (attributes) and the methods that operate on that data into a single unit (the class), while controlling access to the internal details.

Think of it like a remote control for your TV:

- **Public interface**: The buttons you can press (volume, channel, power)

- **Internal state**: The complex electronics inside that you can't (and shouldn't) directly access

- **Controlled access**: You interact with the TV only through the buttons, not by rewiring the circuits

```python
class BankAccount:
    def __init__(self, account_number, initial_balance=0):
        self.account_number = account_number  # Public attribute
        self._balance = initial_balance       # Protected attribute (convention)
        self._transaction_count = 0           # Internal state
    
    # Public interface - what users can do
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            self._transaction_count += 1
            return f"Deposited ${amount}. Balance: ${self._balance}"
        return "Invalid deposit amount"
    
    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            self._transaction_count += 1
            return f"Withdrew ${amount}. Balance: ${self._balance}"
        return "Insufficient funds or invalid amount"
    
    def get_balance(self):
        return self._balance
    
    def get_transaction_count(self):
        return self._transaction_count

```

### Public interface vs internal state

The **public interface** is what other parts of your program can see and use. The **internal state** is the data and implementation details that should be kept private.

```python
# Using the BankAccount class
account = BankAccount("ACC001", 1000)

# Public interface - these are the "official" ways to interact
print(account.deposit(200))           # ✅ Good - using public method
print(account.get_balance())          # ✅ Good - using public method

# Direct access to internal state - avoid this!
print(account._balance)               # ❌ Bad - accessing internal state directly
account._balance = 999999             # ❌ Very bad - bypassing all controls!

```

**Why keep internal state private?**

1. **Data integrity**: Prevent invalid values

2. **Consistency**: Ensure related data stays synchronized

3. **Flexibility**: Change internal implementation without breaking other code

4. **Security**: Prevent unauthorized access or modification

### Python naming conventions

Python uses naming conventions to indicate access levels:

- **Public**: `attribute` or `method()` - intended for external use

- **Protected**: `_attribute` or `_method()` - internal use, but accessible if needed

- **Private (name-mangled)**: `__attribute` or `__method()` - triggers name-mangling to `_ClassName__attribute`; still accessible but signals strong non-public intent

```python
class Student:
    def __init__(self, name, student_id):
        self.name = name                    # Public
        self.student_id = student_id        # Public
        self._grades = []                   # Protected - internal list
        self._gpa = 0.0                     # Protected - calculated value
        self.__secret_notes = "Lazy student"  # Name-mangled (private-ish)
    
    def add_grade(self, grade):
        if 0 <= grade <= 100:
            self._grades.append(grade)
            self._calculate_gpa()           # Update internal state
            return True
        return False
    
    def _calculate_gpa(self):               # Protected method
        if self._grades:
            self._gpa = sum(self._grades) / len(self._grades) / 25
        else:
            self._gpa = 0.0
    
    def get_gpa(self):                      # Public method
        return round(self._gpa, 2)

"""
Note on double underscores:

- In Python, leading double underscores cause name-mangling: `__hidden` becomes `_ClassName__hidden`.
- This is not true privacy but helps avoid accidental access/overrides in subclasses.
- Most idiomatic Python code uses a single underscore for "internal" members and relies on conventions.
"""

```

### Invariants

An **invariant** is a condition that must always be true for an object to be in a valid state. Encapsulation helps maintain these invariants.

```python
class Rectangle:
    def __init__(self, width, height):
        self._width = 0
        self._height = 0
        # Use setters to enforce invariants from the start
        self.set_width(width)
        self.set_height(height)
    
    def set_width(self, width):
        if width > 0:  # Invariant: width must be positive
            self._width = width
        else:
            raise ValueError("Width must be positive")
    
    def set_height(self, height):
        if height > 0:  # Invariant: height must be positive
            self._height = height
        else:
            raise ValueError("Height must be positive")
    
    def get_width(self):
        return self._width
    
    def get_height(self):
        return self._height
    
    def get_area(self):
        return self._width * self._height  # Always valid due to invariants

# Using the Rectangle class
rect = Rectangle(5, 3)
print(f"Area: {rect.get_area()}")  # Area: 15

# Invariants are protected
try:
    rect.set_width(-2)  # This will raise an error
except ValueError as e:
    print(f"Error: {e}")  # Error: Width must be positive

```

### Simple getters and setters

**Getters** provide controlled access to internal data. **Setters** provide controlled modification of internal data.

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = 0
        self.set_celsius(celsius)  # Use setter for validation
    
    # Getter for celsius
    def get_celsius(self):
        return self._celsius
    
    # Setter for celsius with validation
    def set_celsius(self, celsius):
        if celsius < -273.15:  # Absolute zero limit
            raise ValueError("Temperature cannot be below absolute zero")
        self._celsius = celsius
    
    # Getter for fahrenheit (calculated property)
    def get_fahrenheit(self):
        return (self._celsius * 9/5) + 32
    
    # Setter for fahrenheit (converts and stores as celsius)
    def set_fahrenheit(self, fahrenheit):
        celsius = (fahrenheit - 32) * 5/9
        self.set_celsius(celsius)  # Reuse validation logic

# Using the Temperature class
temp = Temperature(25)
print(f"Temperature: {temp.get_celsius()}°C")        # 25°C
print(f"Temperature: {temp.get_fahrenheit()}°F")     # 77°F

temp.set_fahrenheit(86)
print(f"Temperature: {temp.get_celsius()}°C")        # 30°C

```

### When to use getters and setters

**Use getters when:**

- You need to calculate a value based on internal state

- You want to format or transform data before returning it

- You need to control access to sensitive data

**Use setters when:**

- You need to validate input data

- You need to update related internal state

- You want to maintain invariants

**Keep it simple:**
For basic data access, Python's property decorator can make getters and setters look like regular attribute access:

```python
class Circle:
    def __init__(self, radius):
        self._radius = 0
        self.radius = radius  # Use the property setter
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("Radius must be positive")
        self._radius = value
    
    @property
    def area(self):
        return 3.14159 * self._radius ** 2

# Usage looks like normal attribute access
circle = Circle(5)
print(circle.radius)  # 5
print(circle.area)    # 78.53975

circle.radius = 3     # Uses the setter with validation
print(circle.area)    # 28.27431

```

## Practice

/// details | Exercise 1: Encapsulation Violations
    type: question
    open: false

**Scenario**: Look at this code and identify what's wrong with the encapsulation:

```python
class Car:
    def __init__(self, fuel_capacity):
        self.fuel_level = fuel_capacity
        self.engine_running = False

# Usage
car = Car(50)
car.fuel_level = -10        # Problem 1: What's wrong here?
car.engine_running = True   # Problem 2: What could go wrong?

```

**Task**: Identify the encapsulation violations and explain why they're problematic.

/// details | Sample Solution
    type: success
    open: false

**Problem 1**: `car.fuel_level = -10` violates encapsulation because:

- Fuel level should never be negative (invariant violation)

- Direct access bypasses validation that should prevent invalid values

- Could lead to inconsistent object state

**Problem 2**: `car.engine_running = True` could be problematic because:

- Engine state might depend on other conditions (fuel level, ignition key, etc.)

- Setting engine to running without proper checks could cause errors

- Should use a method like `start_engine()` that validates prerequisites
///
///

/// details | Exercise 2: Digital Clock Design
    type: question
    open: false

**Scenario**: Create a `DigitalClock` class that:

- Stores hours (0-23) and minutes (0-59) internally

- Has methods to set the time with validation

- Has methods to get the time in 24-hour and 12-hour formats

- Maintains the invariant that hours and minutes are always valid

**Task**: Implement the `DigitalClock` class with proper encapsulation.

/// details | Sample Solution
    type: success
    open: false

```python
class DigitalClock:
    def __init__(self, hours=0, minutes=0):
        self._hours = 0
        self._minutes = 0
        self.set_time(hours, minutes)
    
    def set_time(self, hours, minutes):
        if 0 <= hours <= 23:
            self._hours = hours
        else:
            raise ValueError("Hours must be between 0 and 23")
        
        if 0 <= minutes <= 59:
            self._minutes = minutes
        else:
            raise ValueError("Minutes must be between 0 and 59")
    
    def get_time_24h(self):
        return f"{self._hours:02d}:{self._minutes:02d}"
    
    def get_time_12h(self):
        if self._hours == 0:
            return f"12:{self._minutes:02d} AM"
        elif self._hours < 12:
            return f"{self._hours}:{self._minutes:02d} AM"
        elif self._hours == 12:
            return f"12:{self._minutes:02d} PM"
        else:
            return f"{self._hours - 12}:{self._minutes:02d} PM"

```

///
///

/// details | Exercise 3: Game Score Encapsulation
    type: question
    open: false

**Scenario**: Improve this class by adding proper encapsulation:

```python
class GameScore:
    def __init__(self):
        self.score = 0
        self.lives = 3
        self.level = 1

```

**Task**: Add proper encapsulation with:

- Private attributes for internal state

- Public methods for controlled access

- Validation to maintain invariants

- Methods to add points, lose lives, and level up

/// details | Sample Solution
    type: success
    open: false

```python
class GameScore:
    def __init__(self):
        self._score = 0
        self._lives = 3
        self._level = 1
    
    def add_points(self, points):
        """Add points to score with validation"""
        if points > 0:
            self._score += points
            # Check for level up
            new_level = (self._score // 1000) + 1
            if new_level > self._level:
                self._level = new_level
                print(f"Level up! Now at level {self._level}")
    
    def lose_life(self):
        """Lose a life, game over if no lives left"""
        if self._lives > 0:
            self._lives -= 1
            if self._lives == 0:
                print("Game Over!")
                return False
        return True
    
    def get_score(self):
        """Get current score"""
        return self._score
    
    def get_lives(self):
        """Get remaining lives"""
        return self._lives
    
    def get_level(self):
        """Get current level"""
        return self._level
    
    def is_game_over(self):
        """Check if game is over"""
        return self._lives <= 0

```

///
///

## Recap

- **Encapsulation** bundles data and methods together while controlling access to internal details

- **Public interface** defines what other parts of the program can use

- **Internal state** should be protected from direct external access

- **Invariants** are conditions that must always be true for valid object state

- **Getters and setters** provide controlled access to object data with validation

- Python uses naming conventions (`_protected`, `__private`) to indicate intended access levels

- Proper encapsulation leads to more reliable, maintainable, and secure code

Encapsulation is the foundation that makes object-oriented programming powerful by ensuring objects maintain their integrity while providing clean interfaces for interaction.







