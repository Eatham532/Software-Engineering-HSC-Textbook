# 6.1 Building classes and composition

## Learning objectives

By the end of this section, you will be able to:

- Define classes with proper constructors and methods in Python

- Understand the difference between class definition and object instantiation

- Use composition to build complex objects from simpler components

- Apply the principle of "composition over inheritance" for code reuse

- Design classes that are cohesive, focused, and easy to test

- Create well-structured class hierarchies using composition relationships

## Defining classes in Python

A **class** is a blueprint that defines the structure and behavior of objects. It specifies what attributes (data) and methods (functions) objects of that type will have.

### Basic class syntax

```python
class Student:
    """A class to represent a student"""
    
    def __init__(self, name, student_id):
        """Constructor - called when creating a new Student object"""
        self.name = name
        self.student_id = student_id
        self.grades = []  # Initialize empty list of grades
    
    def add_grade(self, grade):
        """Method to add a grade to the student's record"""
        if 0 <= grade <= 100:
            self.grades.append(grade)
            return True
        return False
    
    def get_average(self):
        """Method to calculate the student's average grade"""
        if not self.grades:
            return 0
        return sum(self.grades) / len(self.grades)
    
    def __str__(self):
        """String representation of the student"""
        return f"Student({self.name}, ID: {self.student_id})"

# Creating objects (instantiation)
alice = Student("Alice Johnson", "S12345")
bob = Student("Bob Smith", "S12346")

# Using the objects
alice.add_grade(85)
alice.add_grade(92)
print(f"{alice.name}'s average: {alice.get_average()}")  # Alice's average: 88.5

```

### Key components explained

**1. Class definition:** `class Student:` creates a new class named Student

**2. Constructor:** `__init__()` is a special method called when creating new objects

- Takes `self` as the first parameter (refers to the object being created)

- Initializes the object's attributes

- Sets up the initial state

**3. Instance attributes:** `self.name`, `self.student_id`, `self.grades`

- Data that belongs to each individual object

- Different objects can have different values

**4. Methods:** Functions that belong to the class

- Always take `self` as the first parameter

- Can access and modify the object's attributes

- Define what the object can do

**5. Special methods:** `__str__()` defines how objects are displayed as strings

## Understanding constructors

The **constructor** (`__init__`) is responsible for setting up a new object's initial state. It's one of the most important methods in a class.

### Constructor best practices

```python
class BankAccount:
    """A simple bank account class demonstrating good constructor practices"""
    
    def __init__(self, account_number, owner_name, initial_balance=0):
        """
        Initialize a new bank account
        
        Args:
            account_number (str): Unique account identifier
            owner_name (str): Name of the account owner
            initial_balance (float): Starting balance (default: 0)
        """
        # Validate inputs
        if not account_number or not account_number.strip():
            raise ValueError("Account number cannot be empty")
        if not owner_name or not owner_name.strip():
            raise ValueError("Owner name cannot be empty")
        if initial_balance < 0:
            raise ValueError("Initial balance cannot be negative")
        
        # Set up instance attributes
        self.account_number = account_number.strip()
        self.owner_name = owner_name.strip()
        self.balance = initial_balance
        self.transaction_history = []  # Start with empty history
        
        # Record the initial deposit if any
        if initial_balance > 0:
            self.transaction_history.append(f"Initial deposit: +${initial_balance}")

# Good usage
account = BankAccount("ACC001", "Alice Johnson", 1000)

# Constructor validation prevents bad data
try:
    bad_account = BankAccount("", "Bob", -100)  # Will raise ValueError
except ValueError as e:
    print(f"Error: {e}")

```

### Constructor parameters and defaults

```python
class Rectangle:
    """Rectangle class showing different parameter patterns"""
    
    def __init__(self, width, height=None):
        """
        Create a rectangle
        
        Args:
            width (float): Width of rectangle
            height (float, optional): Height of rectangle. If None, creates a square
        """
        if width <= 0:
            raise ValueError("Width must be positive")
        
        self.width = width
        
        # If height not provided, make it a square
        if height is None:
            self.height = width
        else:
            if height <= 0:
                raise ValueError("Height must be positive")
            self.height = height
    
    def area(self):
        return self.width * self.height
    
    def is_square(self):
        return self.width == self.height

# Different ways to create rectangles
rect1 = Rectangle(5, 3)    # Rectangle: 5x3
rect2 = Rectangle(4)       # Square: 4x4 (height defaults to width)

print(f"Rectangle area: {rect1.area()}")  # 15
print(f"Square area: {rect2.area()}")     # 16
print(f"Is rect2 a square? {rect2.is_square()}")  # True

```

## Methods: defining behavior

**Methods** are functions that belong to a class and define what objects of that class can do. They have access to the object's data and can modify it.

### Instance methods

```python
class Counter:
    """A simple counter class demonstrating various method patterns"""
    
    def __init__(self, start_value=0):
        """Initialize counter with starting value"""
        self.value = start_value
        self.history = [start_value]  # Track all values
    
    def increment(self, amount=1):
        """Increase counter by specified amount (default: 1)"""
        if amount <= 0:
            raise ValueError("Increment amount must be positive")
        self.value += amount
        self.history.append(self.value)
    
    def decrement(self, amount=1):
        """Decrease counter by specified amount (default: 1)"""
        if amount <= 0:
            raise ValueError("Decrement amount must be positive")
        self.value -= amount
        self.history.append(self.value)
    
    def reset(self, new_value=0):
        """Reset counter to specified value (default: 0)"""
        self.value = new_value
        self.history.append(self.value)
    
    def get_value(self):
        """Get current counter value"""
        return self.value
    
    def get_history(self):
        """Get list of all values the counter has had"""
        return self.history.copy()  # Return copy to protect internal data
    
    def __str__(self):
        return f"Counter(value={self.value})"

# Using the counter
counter = Counter(10)
counter.increment(5)      # value = 15
counter.decrement(3)      # value = 12
counter.increment()       # value = 13 (default increment of 1)

print(counter)            # Counter(value=13)
print(counter.get_history())  # [10, 15, 12, 13]

```

### Method design principles

**1. Single responsibility:** Each method should do one thing well

```python
class EmailValidator:
    """Class demonstrating single responsibility in methods"""
    
    def is_valid_email(self, email):
        """Check if email format is valid"""
        return self._has_at_symbol(email) and self._has_domain(email)
    
    def _has_at_symbol(self, email):
        """Private helper: check for @ symbol"""
        return '@' in email and email.count('@') == 1
    
    def _has_domain(self, email):
        """Private helper: check for domain part"""
        if '@' not in email:
            return False
        domain = email.split('@')[1]
        return '.' in domain and len(domain) > 3

```

**2. Meaningful names:** Method names should clearly describe what they do

```python
# Good method names
user.authenticate(password)
account.withdraw(amount)
list.append(item)
validator.is_valid_email(email)

# Poor method names
user.check(password)       # Check what?
account.do_money(amount)   # Do what with money?
list.add_thing(item)       # Vague
validator.test(email)      # Test what?

```

**3. Consistent parameter patterns:** Similar methods should have similar signatures

```python
class MathOperations:
    """Consistent parameter patterns"""
    
    def add(self, a, b):
        return a + b
    
    def subtract(self, a, b):
        return a - b
    
    def multiply(self, a, b):
        return a * b
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

```

## Composition: building with components

**Composition** is a design principle where complex objects are built by combining simpler objects, rather than inheriting from parent classes. It represents a "has-a" relationship.

### Why composition over inheritance?

**Inheritance problems:**

- Rigid hierarchy that's hard to change

- Child classes tightly coupled to parent classes

- Can lead to complex inheritance chains

- "Diamond problem" with multiple inheritance

**Composition benefits:**

- Flexible - can change components at runtime

- Loosely coupled - components can be developed independently

- Easier to test - can test components separately

- More maintainable - changes to one component don't affect others

/// details | Basic composition example
    type: info
    open: false

```python
class Engine:
    """Simple engine component"""
    
    def __init__(self, horsepower, fuel_type):
        self.horsepower = horsepower
        self.fuel_type = fuel_type
        self.is_running = False
    
    def start(self):
        if not self.is_running:
            self.is_running = True
            return f"{self.horsepower}hp {self.fuel_type} engine started"
        return "Engine already running"
    
    def stop(self):
        if self.is_running:
            self.is_running = False
            return "Engine stopped"
        return "Engine already stopped"

class Wheels:
    """Wheel system component"""
    
    def __init__(self, wheel_count, wheel_size):
        self.wheel_count = wheel_count
        self.wheel_size = wheel_size
    
    def get_info(self):
        return f"{self.wheel_count} wheels, {self.wheel_size} inch diameter"

class Car:
    """Car class using composition instead of inheritance"""
    
    def __init__(self, make, model, engine, wheels):
        self.make = make
        self.model = model
        self.engine = engine      # Composition: Car HAS-A Engine
        self.wheels = wheels      # Composition: Car HAS-A Wheels system
        self.speed = 0
    
    def start(self):
        """Start the car by starting its engine"""
        result = self.engine.start()
        return f"{self.make} {self.model}: {result}"
    
    def stop(self):
        """Stop the car"""
        self.speed = 0
        result = self.engine.stop()
        return f"{self.make} {self.model}: {result}"
    
    def accelerate(self, amount):
        """Accelerate if engine is running"""
        if self.engine.is_running:
            self.speed += amount
            return f"Accelerating to {self.speed} km/h"
        return "Cannot accelerate - engine not running"
    
    def get_specs(self):
        """Get car specifications"""
        return f"{self.make} {self.model} - {self.engine.horsepower}hp {self.engine.fuel_type}, {self.wheels.get_info()}"

# Creating a car using composition
v8_engine = Engine(400, "gasoline")
standard_wheels = Wheels(4, 18)
sports_car = Car("Ferrari", "F40", v8_engine, standard_wheels)

print(sports_car.start())        # Ferrari F40: 400hp gasoline engine started
print(sports_car.accelerate(50)) # Accelerating to 50 km/h
print(sports_car.get_specs())    # Ferrari F40 - 400hp gasoline, 4 wheels, 18 inch diameter

```

///

### Advanced composition patterns

**1. Composition with dependency injection:**

```python
class FileLogger:
    """Logs messages to a file"""
    
    def __init__(self, filename):
        self.filename = filename
    
    def log(self, message):
        with open(self.filename, 'a') as f:
            f.write(f"{message}\n")

class ConsoleLogger:
    """Logs messages to console"""
    
    def log(self, message):
        print(f"LOG: {message}")

class ShoppingCart:
    """Shopping cart that can use different logging strategies"""
    
    def __init__(self, logger):
        self.items = []
        self.logger = logger  # Composition: inject any logger
    
    def add_item(self, item, price):
        self.items.append({"item": item, "price": price})
        self.logger.log(f"Added {item} (${price}) to cart")
    
    def remove_item(self, item):
        self.items = [i for i in self.items if i["item"] != item]
        self.logger.log(f"Removed {item} from cart")
    
    def get_total(self):
        total = sum(item["price"] for item in self.items)
        self.logger.log(f"Calculated total: ${total}")
        return total

# Using different loggers with the same cart
console_logger = ConsoleLogger()
file_logger = FileLogger("cart.log")

cart1 = ShoppingCart(console_logger)  # Logs to console
cart2 = ShoppingCart(file_logger)     # Logs to file

cart1.add_item("Book", 25.99)    # Prints: LOG: Added Book ($25.99) to cart
cart2.add_item("Phone", 699.99)  # Writes to cart.log file

```

**2. Complex composition with multiple components:**

```python
class Display:
    """Display component for devices"""
    
    def __init__(self, width, height, resolution):
        self.width = width
        self.height = height
        self.resolution = resolution
        self.is_on = False
    
    def turn_on(self):
        self.is_on = True
        return f"Display on: {self.width}x{self.height} at {self.resolution}"
    
    def turn_off(self):
        self.is_on = False
        return "Display off"

class Battery:
    """Battery component for portable devices"""
    
    def __init__(self, capacity_mah):
        self.capacity_mah = capacity_mah
        self.current_charge = capacity_mah  # Start fully charged
    
    def get_charge_percentage(self):
        return (self.current_charge / self.capacity_mah) * 100
    
    def use_power(self, amount_mah):
        """Use some battery power"""
        self.current_charge = max(0, self.current_charge - amount_mah)
    
    def charge(self, amount_mah):
        """Charge the battery"""
        self.current_charge = min(self.capacity_mah, self.current_charge + amount_mah)

class CPU:
    """CPU component"""
    
    def __init__(self, speed_ghz, cores):
        self.speed_ghz = speed_ghz
        self.cores = cores
        self.is_active = False
    
    def start(self):
        self.is_active = True
        return f"CPU started: {self.cores} cores at {self.speed_ghz}GHz"
    
    def stop(self):
        self.is_active = False
        return "CPU stopped"

class Laptop:
    """Laptop composed of multiple components"""
    
    def __init__(self, brand, model, cpu, display, battery):
        self.brand = brand
        self.model = model
        self.cpu = cpu          # Composition
        self.display = display  # Composition
        self.battery = battery  # Composition
        self.is_running = False
    
    def power_on(self):
        """Power on the laptop"""
        if self.battery.get_charge_percentage() < 5:
            return "Cannot power on: battery too low"
        
        self.is_running = True
        cpu_msg = self.cpu.start()
        display_msg = self.display.turn_on()
        
        # Use some power to start up
        self.battery.use_power(50)
        
        return f"{self.brand} {self.model} powered on\n{cpu_msg}\n{display_msg}"
    
    def power_off(self):
        """Power off the laptop"""
        self.is_running = False
        cpu_msg = self.cpu.stop()
        display_msg = self.display.turn_off()
        return f"{self.brand} {self.model} powered off\n{cpu_msg}\n{display_msg}"
    
    def get_status(self):
        """Get current laptop status"""
        battery_pct = self.battery.get_charge_percentage()
        status = "ON" if self.is_running else "OFF"
        return f"{self.brand} {self.model}: {status}, Battery: {battery_pct:.1f}%"

# Creating a laptop with composed components
i7_cpu = CPU(2.8, 4)
hd_display = Display(1920, 1080, "1080p")
lithium_battery = Battery(5000)  # 5000 mAh

macbook = Laptop("Apple", "MacBook Pro", i7_cpu, hd_display, lithium_battery)

print(macbook.power_on())
print(macbook.get_status())
print(macbook.power_off())

```

## Building cohesive classes

**Cohesion** means that a class has a single, well-defined purpose and all its methods work together to support that purpose.

/// details | High cohesion example
    type: example
    open: false

```python
class PasswordValidator:
    """Highly cohesive class - everything relates to password validation"""
    
    def __init__(self, min_length=8, require_uppercase=True, require_numbers=True):
        self.min_length = min_length
        self.require_uppercase = require_uppercase
        self.require_numbers = require_numbers
    
    def is_valid(self, password):
        """Main validation method that uses all helper methods"""
        return (self._check_length(password) and
                self._check_uppercase(password) and
                self._check_numbers(password))
    
    def _check_length(self, password):
        """Check if password meets minimum length"""
        return len(password) >= self.min_length
    
    def _check_uppercase(self, password):
        """Check if password has uppercase letters (if required)"""
        if not self.require_uppercase:
            return True
        return any(c.isupper() for c in password)
    
    def _check_numbers(self, password):
        """Check if password has numbers (if required)"""
        if not self.require_numbers:
            return True
        return any(c.isdigit() for c in password)
    
    def get_requirements(self):
        """Return a description of password requirements"""
        requirements = [f"At least {self.min_length} characters"]
        if self.require_uppercase:
            requirements.append("At least one uppercase letter")
        if self.require_numbers:
            requirements.append("At least one number")
        return requirements

# Usage
validator = PasswordValidator(min_length=10, require_uppercase=True, require_numbers=True)
print(validator.is_valid("MyPassword123"))  # True
print(validator.get_requirements())         # List of requirements

```

///

/// details | Low cohesion example (what to avoid)
    type: example
    open: false

```python
class UserAccount:
    """Low cohesion - too many unrelated responsibilities"""
    
    def __init__(self, username, email):
        self.username = username
        self.email = email
        self.password_hash = None
    
    # User management (appropriate)
    def set_password(self, password):
        self.password_hash = hash(password)
    
    # Email functionality (should be separate class)
    def send_welcome_email(self):
        print(f"Sending welcome email to {self.email}")
    
    # File operations (should be separate class)
    def save_to_file(self, filename):
        with open(filename, 'w') as f:
            f.write(f"{self.username},{self.email}")
    
    # Database operations (should be separate class)
    def save_to_database(self, db_connection):
        # Database save logic here
        pass
    
    # Logging (should be separate class)
    def log_login_attempt(self, success):
        print(f"Login attempt for {self.username}: {'SUCCESS' if success else 'FAILED'}")

```

///

**Better approach with high cohesion:**

```python
class User:
    """High cohesion - focused on user data and basic operations"""
    
    def __init__(self, username, email):
        self.username = username
        self.email = email
        self.password_hash = None
    
    def set_password(self, password):
        self.password_hash = hash(password)
    
    def check_password(self, password):
        return self.password_hash == hash(password)

class EmailService:
    """Focused on email operations"""
    
    def send_welcome_email(self, user):
        print(f"Sending welcome email to {user.email}")

class UserRepository:
    """Focused on user data persistence"""
    
    def save_user(self, user, filename):
        with open(filename, 'w') as f:
            f.write(f"{user.username},{user.email}")

class LoginLogger:
    """Focused on login tracking"""
    
    def log_attempt(self, username, success):
        print(f"Login attempt for {username}: {'SUCCESS' if success else 'FAILED'}")

```

## Practice

/// details | Exercise 1: Create a basic class
    type: question
    open: false

Create a `Book` class with the following requirements:

- Constructor takes title, author, ISBN, and number of pages

- Method to check if the book is long (more than 300 pages)

- Method to get a summary string

- Method to check if it matches a search term (in title or author)

- Proper validation in the constructor

**Task**: Implement the Book class with all methods and test it.

/// details | Sample Solution
    type: success
    open: false

```python
class Book:
    """Represents a book with basic information and operations"""
    
    def __init__(self, title, author, isbn, pages):
        """
        Initialize a new book
        
        Args:
            title (str): Book title
            author (str): Author name
            isbn (str): ISBN number
            pages (int): Number of pages
        """
        # Validation
        if not title or not title.strip():
            raise ValueError("Title cannot be empty")
        if not author or not author.strip():
            raise ValueError("Author cannot be empty")
        if not isbn or not isbn.strip():
            raise ValueError("ISBN cannot be empty")
        if pages <= 0:
            raise ValueError("Pages must be positive")
        
        # Set attributes
        self.title = title.strip()
        self.author = author.strip()
        self.isbn = isbn.strip()
        self.pages = pages
    
    def is_long(self):
        """Check if book is long (more than 300 pages)"""
        return self.pages > 300
    
    def get_summary(self):
        """Get a summary string of the book"""
        length_desc = "long" if self.is_long() else "standard"
        return f"'{self.title}' by {self.author} ({self.pages} pages, {length_desc})"
    
    def matches_search(self, search_term):
        """Check if search term appears in title or author"""
        search_lower = search_term.lower()
        return (search_lower in self.title.lower() or 
                search_lower in self.author.lower())
    
    def __str__(self):
        return f"Book({self.title}, {self.author})"

# Test the class
book1 = Book("The Great Gatsby", "F. Scott Fitzgerald", "978-0-7432-7356-5", 180)
book2 = Book("War and Peace", "Leo Tolstoy", "978-0-14-044793-4", 1225)

print(book1.get_summary())  # 'The Great Gatsby' by F. Scott Fitzgerald (180 pages, standard)
print(book2.is_long())      # True
print(book1.matches_search("gatsby"))  # True
print(book2.matches_search("Tolstoy")) # True

```

///
///

/// details | Exercise 2: Composition design
    type: question
    open: false

Design a `Computer` class using composition with these components:

- `Processor` (brand, speed, cores)

- `Memory` (capacity in GB, type like "DDR4")

- `Storage` (capacity in GB, type like "SSD" or "HDD")

The `Computer` should be able to:

- Start up (requires all components)

- Get system specs

- Check if it can run a program (needs minimum processor speed and memory)

**Task**: Implement all classes using composition principles.

/// details | Sample Solution
    type: success
    open: false

```python
class Processor:
    """CPU component"""
    
    def __init__(self, brand, speed_ghz, cores):
        self.brand = brand
        self.speed_ghz = speed_ghz
        self.cores = cores
    
    def get_specs(self):
        return f"{self.brand} {self.speed_ghz}GHz {self.cores}-core"
    
    def can_handle_load(self, required_speed):
        return self.speed_ghz >= required_speed

class Memory:
    """RAM component"""
    
    def __init__(self, capacity_gb, memory_type):
        self.capacity_gb = capacity_gb
        self.memory_type = memory_type
    
    def get_specs(self):
        return f"{self.capacity_gb}GB {self.memory_type}"
    
    def can_handle_load(self, required_gb):
        return self.capacity_gb >= required_gb

class Storage:
    """Storage component"""
    
    def __init__(self, capacity_gb, storage_type):
        self.capacity_gb = capacity_gb
        self.storage_type = storage_type
    
    def get_specs(self):
        return f"{self.capacity_gb}GB {self.storage_type}"

class Computer:
    """Computer built using composition"""
    
    def __init__(self, brand, model, processor, memory, storage):
        self.brand = brand
        self.model = model
        self.processor = processor    # Composition
        self.memory = memory         # Composition
        self.storage = storage       # Composition
        self.is_running = False
    
    def start_up(self):
        """Start the computer"""
        if not self.is_running:
            self.is_running = True
            return f"{self.brand} {self.model} started successfully"
        return "Computer already running"
    
    def shutdown(self):
        """Shutdown the computer"""
        if self.is_running:
            self.is_running = False
            return f"{self.brand} {self.model} shut down"
        return "Computer already off"
    
    def get_system_specs(self):
        """Get complete system specifications"""
        specs = [
            f"Computer: {self.brand} {self.model}",
            f"Processor: {self.processor.get_specs()}",
            f"Memory: {self.memory.get_specs()}",
            f"Storage: {self.storage.get_specs()}"
        ]
        return "\n".join(specs)
    
    def can_run_program(self, program_name, min_speed_ghz, min_memory_gb):
        """Check if computer meets program requirements"""
        cpu_ok = self.processor.can_handle_load(min_speed_ghz)
        memory_ok = self.memory.can_handle_load(min_memory_gb)
        
        if cpu_ok and memory_ok:
            return f"✓ Can run {program_name}"
        else:
            issues = []
            if not cpu_ok:
                issues.append(f"CPU too slow (need {min_speed_ghz}GHz, have {self.processor.speed_ghz}GHz)")
            if not memory_ok:
                issues.append(f"Not enough RAM (need {min_memory_gb}GB, have {self.memory.capacity_gb}GB)")
            return f"✗ Cannot run {program_name}: {', '.join(issues)}"

# Create components
intel_cpu = Processor("Intel i7", 3.2, 8)
ddr4_ram = Memory(16, "DDR4")
ssd_storage = Storage(512, "SSD")

# Create computer using composition
gaming_pc = Computer("ASUS", "ROG Strix", intel_cpu, ddr4_ram, ssd_storage)

print(gaming_pc.start_up())
print(gaming_pc.get_system_specs())
print(gaming_pc.can_run_program("Photoshop", 2.5, 8))   # Should pass
print(gaming_pc.can_run_program("Video Editor", 4.0, 32))  # Should fail

```

///
///

/// details | Exercise 3: Refactor inheritance to composition
    type: question
    open: false

You have this inheritance-based design. Refactor it to use composition instead:

```python
class Vehicle:
    def __init__(self, make, model):
        self.make = make
        self.model = model
        self.speed = 0

class Car(Vehicle):
    def __init__(self, make, model, doors):
        super().__init__(make, model)
        self.doors = doors
    
    def accelerate(self):
        self.speed += 10

class Motorcycle(Vehicle):
    def __init__(self, make, model, engine_size):
        super().__init__(make, model)
        self.engine_size = engine_size
    
    def accelerate(self):
        self.speed += 20

```

**Task**: Redesign using composition with separate components for different aspects.

/// details | Sample Solution
    type: success
    open: false

```python
class VehicleInfo:
    """Component for basic vehicle information"""
    
    def __init__(self, make, model, vehicle_type):
        self.make = make
        self.model = model
        self.vehicle_type = vehicle_type
    
    def get_description(self):
        return f"{self.make} {self.model} ({self.vehicle_type})"

class MotionSystem:
    """Component for movement and acceleration"""
    
    def __init__(self, acceleration_rate):
        self.speed = 0
        self.acceleration_rate = acceleration_rate
    
    def accelerate(self):
        self.speed += self.acceleration_rate
        return f"Accelerating to {self.speed} km/h"
    
    def brake(self, amount):
        self.speed = max(0, self.speed - amount)
        return f"Slowing to {self.speed} km/h"
    
    def get_speed(self):
        return self.speed

class CarFeatures:
    """Component for car-specific features"""
    
    def __init__(self, doors):
        self.doors = doors
    
    def get_info(self):
        return f"{self.doors} doors"

class MotorcycleFeatures:
    """Component for motorcycle-specific features"""
    
    def __init__(self, engine_size):
        self.engine_size = engine_size
    
    def get_info(self):
        return f"{self.engine_size}cc engine"

class Vehicle:
    """Base vehicle using composition"""
    
    def __init__(self, vehicle_info, motion_system):
        self.info = vehicle_info          # Composition
        self.motion = motion_system       # Composition
    
    def accelerate(self):
        return self.motion.accelerate()
    
    def brake(self, amount=10):
        return self.motion.brake(amount)
    
    def get_description(self):
        return self.info.get_description()
    
    def get_speed(self):
        return self.motion.get_speed()

class Car(Vehicle):
    """Car using composition instead of inheritance"""
    
    def __init__(self, make, model, doors):
        vehicle_info = VehicleInfo(make, model, "Car")
        motion_system = MotionSystem(10)  # Cars accelerate by 10 km/h
        super().__init__(vehicle_info, motion_system)
        self.features = CarFeatures(doors)  # Car-specific composition
    
    def get_full_description(self):
        return f"{self.get_description()} - {self.features.get_info()}"

class Motorcycle(Vehicle):
    """Motorcycle using composition instead of inheritance"""
    
    def __init__(self, make, model, engine_size):
        vehicle_info = VehicleInfo(make, model, "Motorcycle")
        motion_system = MotionSystem(20)  # Motorcycles accelerate by 20 km/h
        super().__init__(vehicle_info, motion_system)
        self.features = MotorcycleFeatures(engine_size)  # Motorcycle-specific composition
    
    def get_full_description(self):
        return f"{self.get_description()} - {self.features.get_info()}"

# Usage
car = Car("Toyota", "Camry", 4)
motorcycle = Motorcycle("Honda", "CBR", 600)

print(car.accelerate())           # Accelerating to 10 km/h
print(motorcycle.accelerate())    # Accelerating to 20 km/h
print(car.get_full_description()) # Toyota Camry (Car) - 4 doors
print(motorcycle.get_full_description()) # Honda CBR (Motorcycle) - 600cc engine

# Benefits of composition:
# 1. Can change motion system at runtime
# 2. Can reuse MotionSystem in other contexts
# 3. Easier to test components separately
# 4. More flexible than inheritance hierarchy

```

///
///

## Recap

- **Classes** are blueprints that define object structure and behavior through attributes and methods

- **Constructors** (`__init__`) set up initial object state and should include proper validation

- **Methods** define what objects can do and should follow single responsibility principle

- **Composition** builds complex objects from simpler components, providing more flexibility than inheritance

- **"Composition over inheritance"** leads to more maintainable and testable code

- **Cohesive classes** have a single, well-defined purpose with all methods supporting that purpose

- **Good class design** emphasizes clear responsibilities, meaningful names, and proper encapsulation

Building classes with composition creates more flexible, maintainable systems where components can be developed, tested, and modified independently while still working together to create powerful functionality.
