---
title: "5.3 Abstraction, generalisation, inheritance, polymorphism"
---

# 5.3 Abstraction, generalisation, inheritance, polymorphism

## Learning objectives

By the end of this section, you will be able to:

- Explain the purpose of abstraction in object-oriented programming

- Use generalisation as a modelling tool to identify common patterns

- Understand inheritance for code reuse and creating class hierarchies

- Describe polymorphism through interfaces and duck typing

- Apply these concepts to create flexible and maintainable code

## Abstraction: Hiding complexity

**Abstraction** is about hiding unnecessary details and exposing only what's essential. When you drive a car, you don't need to understand how the engine works internally - you just use the steering wheel, pedals, and gear stick. This is abstraction in action.

In programming, abstraction helps us:

- Manage complexity by hiding implementation details

- Focus on what an object does rather than how it does it

- Create simple interfaces for complex operations

```python
class FileManager:
    """Abstract file operations - users don't need to know about
    file handles, buffer sizes, or error codes"""
    
    def save_data(self, filename, data):
        """Simple interface hides complex file operations"""
        try:
            with open(filename, 'w') as file:
                # Complex operations hidden here:
                # - Opening file handles
                # - Buffer management
                # - Error handling
                # - Resource cleanup
                file.write(data)
            return "File saved successfully"
        except Exception as e:
            return f"Error saving file: {str(e)}"
    
    def load_data(self, filename):
        """Another simple interface for complex operations"""
        try:
            with open(filename, 'r') as file:
                return file.read()
        except FileNotFoundError:
            return None
        except Exception as e:
            return f"Error: {str(e)}"

# Usage: simple and clean, complexity is hidden
file_manager = FileManager()
file_manager.save_data("notes.txt", "My important notes")
content = file_manager.load_data("notes.txt")

```

## Generalisation: Finding common patterns

**Generalisation** is the process of identifying common characteristics and behaviors across different objects, then creating a general model that captures these similarities.

Think about vehicles: cars, motorcycles, trucks, and bicycles are all different, but they share common characteristics (wheels, steering, movement) and behaviors (start, stop, turn).

```python-template
# Before generalisation: separate, similar classes
class Car:
    def __init__(self, make, model):
        self.make = make
        self.model = model
        self.speed = 0
    
    def start_engine(self):
        return f"{self.make} {self.model} engine started"
    
    def accelerate(self):
        self.speed += 10
        return f"Car accelerating, speed: {self.speed}"

class Motorcycle:
    def __init__(self, make, model):
        self.make = make
        self.model = model
        self.speed = 0
    
    def start_engine(self):
        return f"{self.make} {self.model} engine started"
    
    def accelerate(self):
        self.speed += 15
        return f"Motorcycle accelerating, speed: {self.speed}"

# After generalisation: common base class
class Vehicle:
    """General vehicle class capturing common characteristics"""
    
    def __init__(self, make, model, vehicle_type):
        self.make = make
        self.model = model
        self.vehicle_type = vehicle_type
        self.speed = 0
    
    def start_engine(self):
        return f"{self.make} {self.model} engine started"
    
    def accelerate(self, increment=10):
        self.speed += increment
        return f"{self.vehicle_type} accelerating, speed: {self.speed}"
    
    def stop(self):
        self.speed = 0
        return f"{self.vehicle_type} stopped"

```

## Inheritance: Building on existing code

**Inheritance** allows us to create new classes based on existing ones, inheriting their attributes and methods while adding new features or modifying existing ones.

```python-exec
class Vehicle:
    """Base class for all vehicles"""
    
    def __init__(self, make, model):
        self.make = make
        self.model = model
        self.speed = 0
        self.is_running = False
    
    def start(self):
        if not self.is_running:
            self.is_running = True
            return f"{self.make} {self.model} started"
        return "Already running"
    
    def stop(self):
        self.speed = 0
        self.is_running = False
        return f"{self.make} {self.model} stopped"
    
    def get_info(self):
        return f"{self.make} {self.model}"

class Car(Vehicle):
    """Car inherits from Vehicle and adds car-specific features"""
    
    def __init__(self, make, model, doors):
        super().__init__(make, model)  # Call parent constructor
        self.doors = doors  # Car-specific attribute
    
    def accelerate(self):
        """Car-specific acceleration"""
        if self.is_running:
            self.speed += 10
            return f"Car accelerating, speed: {self.speed} km/h"
        return "Start the car first"
    
    def open_doors(self):
        """Car-specific method"""
        return f"Opening {self.doors} doors"

class Motorcycle(Vehicle):
    """Motorcycle inherits from Vehicle with different characteristics"""
    
    def __init__(self, make, model, engine_size):
        super().__init__(make, model)
        self.engine_size = engine_size
    
    def accelerate(self):
        """Motorcycle accelerates differently than cars"""
        if self.is_running:
            self.speed += 20  # Motorcycles accelerate faster
            return f"Motorcycle accelerating, speed: {self.speed} km/h"
        return "Start the motorcycle first"
    
    def wheelie(self):
        """Motorcycle-specific method"""
        if self.speed > 30:
            return "Performing a wheelie!"
        return "Need more speed for a wheelie"

# Usage demonstrates inheritance
car = Car("Toyota", "Camry", 4)
motorcycle = Motorcycle("Honda", "CBR", 600)

print(car.start())           # Inherited method
print(car.accelerate())      # Overridden method
print(car.open_doors())      # Car-specific method

print(motorcycle.start())    # Inherited method
print(motorcycle.accelerate())  # Overridden method
print(motorcycle.wheelie())  # Motorcycle-specific method

```

## Polymorphism: Same interface, different behavior

**Polymorphism** means "many forms." It allows different objects to respond to the same message (method call) in their own way. In Python, this often works through "duck typing" - if it walks like a duck and quacks like a duck, treat it like a duck.

```python-exec
class Dog:
    def __init__(self, name):
        self.name = name
    
    def make_sound(self):
        return f"{self.name} says Woof!"
    
    def move(self):
        return f"{self.name} runs on four legs"

class Cat:
    def __init__(self, name):
        self.name = name
    
    def make_sound(self):
        return f"{self.name} says Meow!"
    
    def move(self):
        return f"{self.name} stalks silently"

class Bird:
    def __init__(self, name):
        self.name = name
    
    def make_sound(self):
        return f"{self.name} says Tweet!"
    
    def move(self):
        return f"{self.name} flies through the air"

def animal_concert(animals):
    """Polymorphism in action: same method call, different behaviors"""
    print("🎵 Animal Concert Starting! 🎵")
    for animal in animals:
        print(animal.make_sound())  # Same method name, different sounds
        print(animal.move())        # Same method name, different movements
        print("---")

# Create different animals
pets = [
    Dog("Buddy"),
    Cat("Whiskers"),
    Bird("Tweety"),
    Dog("Max")
]

# Polymorphism: each animal responds differently to the same method calls
animal_concert(pets)

# Duck typing example
def pet_interaction(pet):
    """This function works with any object that has make_sound() and move()"""
    print(f"Interacting with pet:")
    print(pet.make_sound())
    print(pet.move())

# Works with any "pet-like" object
pet_interaction(Dog("Rover"))
pet_interaction(Cat("Fluffy"))

```

## Bringing it all together

These four concepts work together to create powerful, flexible code:

```python-exec
# Abstract base for all shapes
class Shape:
    """Abstract shape class demonstrating all four concepts"""
    
    def __init__(self, name):
        self.name = name
    
    def area(self):
        """Abstract method - must be implemented by subclasses"""
        raise NotImplementedError("Subclasses must implement area()")
    
    def perimeter(self):
        """Abstract method"""
        raise NotImplementedError("Subclasses must implement perimeter()")
    
    def describe(self):
        """Common behavior for all shapes"""
        return f"This is a {self.name}"

# Inheritance: specific shapes inherit from Shape
class Rectangle(Shape):
    def __init__(self, width, height):
        super().__init__("Rectangle")  # Generalisation
        self.width = width
        self.height = height
    
    def area(self):  # Polymorphism: different implementation
        return self.width * self.height
    
    def perimeter(self):  # Polymorphism: different implementation
        return 2 * (self.width + self.height)

class Circle(Shape):
    def __init__(self, radius):
        super().__init__("Circle")
        self.radius = radius
    
    def area(self):  # Polymorphism: different implementation
        return 3.14159 * self.radius ** 2
    
    def perimeter(self):  # Polymorphism: different implementation
        return 2 * 3.14159 * self.radius

# Abstraction: simple function hides complexity of different shapes
def calculate_total_area(shapes):
    """Works with any shape objects - abstraction and polymorphism"""
    total = 0
    for shape in shapes:
        total += shape.area()  # Polymorphic method call
    return total

# Usage demonstrates all concepts working together
shapes = [
    Rectangle(5, 3),
    Circle(4),
    Rectangle(2, 8)
]

print("Shape calculations:")
for shape in shapes:
    print(f"{shape.describe()}")  # Inherited method
    print(f"Area: {shape.area()}")  # Polymorphic method
    print(f"Perimeter: {shape.perimeter()}")  # Polymorphic method
    print("---")

print(f"Total area of all shapes: {calculate_total_area(shapes)}")

```

## Practice

/// details | Exercise 1: Identifying the concepts
    type: question
    open: false

Look at this code and identify examples of abstraction, generalisation, inheritance, and polymorphism:

```python-template
class MediaPlayer:
    def __init__(self, name):
        self.name = name
    
    def play(self):
        return f"{self.name} is playing"
    
    def stop(self):
        return f"{self.name} stopped"

class AudioPlayer(MediaPlayer):
    def play(self):
        return f"🎵 {self.name} playing audio"

class VideoPlayer(MediaPlayer):
    def play(self):
        return f"🎬 {self.name} playing video"

def start_playlist(players):
    for player in players:
        print(player.play())

```

**Task**: Identify and explain each concept in this code.

/// details | Sample Solution
    type: success
    open: false

**Abstraction**: The `MediaPlayer` class abstracts the concept of media playback, hiding the complex details of how different media types are actually played.

**Generalisation**: `MediaPlayer` represents the general concept that both audio and video players share - they can play and stop media.

**Inheritance**: `AudioPlayer` and `VideoPlayer` inherit from `MediaPlayer`, getting the basic functionality while specializing for their media type.

**Polymorphism**: The `start_playlist()` function calls `play()` on different player types, and each responds with their own specific behavior (audio vs video playback).
///
///

/// details | Exercise 2: Design a class hierarchy
    type: question
    open: false

Design a class hierarchy for different types of employees in a company:

- All employees have: name, employee_id, base_salary

- All employees can: work(), get_info()

- Managers can: assign_task(task, employee), hold_meeting()

- Developers can: write_code(language), debug()

- Designers can: create_design(type), review_design()

**Task**: Create the class hierarchy with proper inheritance and polymorphism.

/// details | Sample Solution
    type: success
    open: false

```python-template
class Employee:
    """Base class for all employees"""
    
    def __init__(self, name, employee_id, base_salary):
        self.name = name
        self.employee_id = employee_id
        self.base_salary = base_salary
    
    def work(self):
        return f"{self.name} is working"
    
    def get_info(self):
        return f"Employee: {self.name} (ID: {self.employee_id})"

class Manager(Employee):
    def __init__(self, name, employee_id, base_salary):
        super().__init__(name, employee_id, base_salary)
        self.team = []
    
    def work(self):
        return f"Manager {self.name} is managing the team"
    
    def assign_task(self, task, employee):
        return f"{self.name} assigned '{task}' to {employee.name}"
    
    def hold_meeting(self):
        return f"{self.name} is holding a team meeting"

class Developer(Employee):
    def work(self):
        return f"Developer {self.name} is coding"
    
    def write_code(self, language):
        return f"{self.name} is writing {language} code"
    
    def debug(self):
        return f"{self.name} is debugging code"

class Designer(Employee):
    def work(self):
        return f"Designer {self.name} is designing"
    
    def create_design(self, design_type):
        return f"{self.name} is creating a {design_type} design"
    
    def review_design(self):
        return f"{self.name} is reviewing design mockups"

```

///
///

/// details | Exercise 3: Duck typing demonstration
    type: question
    open: false

Create three different classes that don't inherit from each other but can all be used polymorphically because they implement the same interface (duck typing):

- Each class should have: `start()`, `process()`, and `finish()` methods

- Classes could be: `WashingMachine`, `Dishwasher`, `Printer`

**Task**: Demonstrate duck typing by creating a function that works with all three classes.

/// details | Sample Solution
    type: success
    open: false

```python-exec
class WashingMachine:
    def __init__(self, brand):
        self.brand = brand
    
    def start(self):
        return f"{self.brand} washing machine starting wash cycle"
    
    def process(self):
        return "Washing clothes with soap and water"
    
    def finish(self):
        return "Wash cycle complete, clothes are clean"

class Dishwasher:
    def __init__(self, brand):
        self.brand = brand
    
    def start(self):
        return f"{self.brand} dishwasher starting cleaning cycle"
    
    def process(self):
        return "Spraying dishes with hot soapy water"
    
    def finish(self):
        return "Dishes are clean and dry"

class Printer:
    def __init__(self, brand):
        self.brand = brand
    
    def start(self):
        return f"{self.brand} printer initializing"
    
    def process(self):
        return "Printing document pages"
    
    def finish(self):
        return "Document printed successfully"

def run_appliance(appliance):
    """Duck typing: works with any object that has start/process/finish"""
    print(appliance.start())
    print(appliance.process())
    print(appliance.finish())
    print("---")

# All three work with the same function despite no inheritance
appliances = [
    WashingMachine("Samsung"),
    Dishwasher("Bosch"),
    Printer("HP")
]

for appliance in appliances:
    run_appliance(appliance)

```

///
///

## Recap

- **Abstraction** hides complexity and exposes only essential features through simple interfaces

- **Generalisation** identifies common patterns and characteristics to create general models

- **Inheritance** enables code reuse by building new classes on existing ones

- **Polymorphism** allows different objects to respond to the same interface in their own way

- **Duck typing** in Python enables polymorphism without requiring formal inheritance

- These concepts work together to create flexible, maintainable, and reusable code

These four pillars of object-oriented programming provide powerful tools for managing complexity, promoting code reuse, and creating systems that are easy to extend and maintain. Understanding how they work together is essential for effective object-oriented design.
