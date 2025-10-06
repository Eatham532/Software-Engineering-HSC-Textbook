# 5.6 Design process: task definition and decomposition

## Learning objectives

By the end of this section, you will be able to:

- Follow a systematic design process from requirements to implementation

- Transform requirements into clear responsibilities and collaborations

- Apply top-down design to break complex problems into manageable parts

- Use bottom-up design to build systems from fundamental components

- Choose the appropriate design approach for different types of problems

- Create well-structured object-oriented designs that are maintainable and extensible

## The design process overview

Good software design follows a systematic process that transforms user needs into working code. The object-oriented design process typically follows this flow:

Requirements → Responsibilities → Collaborations → Implementation


```
@startuml
[1. Requirements] as req
[2. Responsibilities] as resp
[3. Collaborations] as collab
[4. Implementation] as impl

note right of req : What does the system need to do?
note right of resp : What tasks need to be performed?
note right of collab : How do objects work together?
note right of impl : Write the actual code

req --> resp : Analyze and break down
resp --> collab : Assign to objects
collab --> impl : Design interactions
impl --> req : Validate against requirements
@enduml
```

Let's work through this process with a practical example.

## Step 1: Requirements gathering and analysis

**Requirements** define what the system must do. They can be functional (what the system does) or non-functional (how well it does it).

### Example: Library Management System

**Functional Requirements:**

- Members can borrow and return books

- Librarians can add/remove books from inventory

- System tracks due dates and calculates fines

- Members can search for books by title, author, or category

- System generates overdue notices

**Non-functional Requirements:**

- Response time under 2 seconds for searches

- Support up to 1000 concurrent users

- 99.9% uptime availability

- Easy to use interface

### Analyzing requirements

Break down requirements into specific, testable statements:

```python
# From "Members can borrow books" we derive:
# - A member must be registered to borrow
# - Books must be available (not already borrowed)
# - System records who borrowed what and when
# - Members have borrowing limits
# - Books have due dates

# This analysis reveals what our system needs to track and validate

```

## Step 2: Identifying responsibilities

**Responsibilities** are the specific tasks that need to be performed to fulfill the requirements. In OOP, responsibilities become methods in classes.

### Responsibility identification techniques

**1. Look for nouns (potential objects) and verbs (potential methods):**

From "Members can borrow books and librarians can add books":

- **Nouns**: Members, Books, Librarians → potential classes

- **Verbs**: borrow, add, search, calculate → potential methods

**2. Ask "who should be responsible for...?"**

- Who tracks book availability? → Book class

- Who manages member information? → Member class  

- Who enforces borrowing rules? → Library class

- Who calculates fines? → Could be Member, Book, or Library

/// details | Responsibility assignment
    type: info
    open: false

```python
class Member:
    """Responsible for member-related data and operations"""
    def __init__(self, member_id, name, email):
        self.member_id = member_id
        self.name = name
        self.email = email
        self.borrowed_books = []
        self.fines_owed = 0.0
    
    def can_borrow(self):
        """Responsibility: determine if member can borrow more books"""
        return len(self.borrowed_books) < 5 and self.fines_owed < 10.0
    
    def add_borrowed_book(self, book):
        """Responsibility: track borrowed books"""
        self.borrowed_books.append(book)

class Book:
    """Responsible for book-related data and availability"""
    def __init__(self, isbn, title, author, category):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.category = category
        self.is_available = True
        self.borrowed_by = None
        self.due_date = None
    
    def is_overdue(self):
        """Responsibility: determine if book is overdue"""
        if self.due_date:
            return datetime.now() > self.due_date
        return False

class Library:
    """Responsible for coordinating system operations"""
    def __init__(self):
        self.books = {}
        self.members = {}
    
    def borrow_book(self, member_id, isbn):
        """Responsibility: coordinate the borrowing process"""
        member = self.members.get(member_id)
        book = self.books.get(isbn)
        
        if not member or not book:
            return False, "Member or book not found"
        
        if not member.can_borrow():
            return False, "Member cannot borrow more books"
        
        if not book.is_available:
            return False, "Book is not available"
        
        # Execute the borrowing
        book.is_available = False
        book.borrowed_by = member_id
        book.due_date = datetime.now() + timedelta(days=14)
        member.add_borrowed_book(book)
        
        return True, "Book borrowed successfully"

```

///

## Step 3: Designing collaborations

**Collaborations** define how objects work together to accomplish system goals. Objects rarely work in isolation - they need to communicate and coordinate.

### Collaboration patterns

**1. Request/Response:** One object asks another to perform a task

```python
# Member requests library to borrow a book
success, message = library.borrow_book(member.member_id, book.isbn)

```

**2. Chain of responsibility:** Objects pass requests along until one handles it

```python
class NotificationService:
    def send_overdue_notice(self, member):
        # Try email first, then SMS, then postal mail
        if not self._send_email(member):
            if not self._send_sms(member):
                self._send_postal_mail(member)

```

**3. Observer pattern:** Objects notify others when their state changes

```python
class Book:
    def __init__(self):
        self.observers = []  # List of objects interested in book status
    
    def set_available(self, available):
        self.is_available = available
        self._notify_observers()
    
    def _notify_observers(self):
        for observer in self.observers:
            observer.book_status_changed(self)

class WaitingList:
    def book_status_changed(self, book):
        if book.is_available and self.has_waiting_members(book):
            self.notify_next_member(book)

```

### Collaboration diagram

```kroki-plantuml
@startuml
participant Member
participant Library
participant Book
participant NotificationService

Member -> Library : borrow_book(member_id, isbn)
Library -> Member : can_borrow()
Member --> Library : True
Library -> Book : is_available()
Book --> Library : True
Library -> Book : set_borrowed(member_id, due_date)
Library -> Member : add_borrowed_book(book)
Library -> NotificationService : schedule_due_reminder(member, book)
Library --> Member : success message
@enduml

```

## Top-down design approach

**Top-down design** starts with the big picture and breaks it down into smaller, more manageable pieces.

### Process

1. Start with the overall system goal

2. Break it into major subsystems

3. Break subsystems into components

4. Break components into individual classes and methods

### Example: Online Shopping System

```
Level 1: Online Shopping System
├── User Management Subsystem
├── Product Catalog Subsystem  
├── Shopping Cart Subsystem
└── Order Processing Subsystem

Level 2: Order Processing Subsystem
├── Payment Processing
├── Inventory Management
├── Shipping Coordination
└── Order Tracking

Level 3: Payment Processing
├── Payment Validation
├── Credit Card Processing
├── Invoice Generation
└── Payment Confirmation

```

### Top-down implementation

```python
# Level 1: Main system coordinator
class OnlineShoppingSystem:
    def __init__(self):
        self.user_manager = UserManager()
        self.catalog = ProductCatalog()
        self.cart_manager = CartManager()
        self.order_processor = OrderProcessor()
    
    def process_purchase(self, user_id, cart_items):
        # Coordinate all subsystems
        user = self.user_manager.get_user(user_id)
        cart = self.cart_manager.get_cart(user_id)
        return self.order_processor.process_order(user, cart)

# Level 2: Subsystem implementation
class OrderProcessor:
    def __init__(self):
        self.payment_processor = PaymentProcessor()
        self.inventory_manager = InventoryManager()
        self.shipping_coordinator = ShippingCoordinator()
    
    def process_order(self, user, cart):
        # Break down into smaller tasks
        if not self.inventory_manager.check_availability(cart.items):
            return False, "Items not available"
        
        payment_success = self.payment_processor.process_payment(user, cart.total)
        if payment_success:
            self.inventory_manager.reserve_items(cart.items)
            self.shipping_coordinator.schedule_shipment(user, cart.items)
            return True, "Order processed successfully"
        
        return False, "Payment failed"

# Level 3: Individual components
class PaymentProcessor:
    def process_payment(self, user, amount):
        # Implement specific payment logic
        return self._validate_payment(user, amount)

```

### Advantages of top-down design

- Clear overall structure from the start

- Easy to understand system architecture

- Good for complex systems with clear hierarchy

- Helps identify major components early

### Disadvantages of top-down design

- May miss important details until late in process

- Can lead to over-engineered solutions

- Difficult to change structure once established

## Bottom-up design approach

**Bottom-up design** starts with fundamental components and builds upward to create the complete system.

### Process

1. Identify basic entities and operations

2. Build fundamental classes

3. Combine classes into larger components

4. Assemble components into subsystems

5. Integrate subsystems into the complete system

### Example: Game Development

```python
# Level 1: Basic building blocks
class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def add(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

class Color:
    def __init__(self, r, g, b):
        self.r, self.g, self.b = r, g, b

# Level 2: Game entities using building blocks  
class GameObject:
    def __init__(self, position, color):
        self.position = position  # Vector2D
        self.color = color        # Color
        self.velocity = Vector2D(0, 0)
    
    def update(self, delta_time):
        self.position = self.position.add(
            Vector2D(self.velocity.x * delta_time, 
                    self.velocity.y * delta_time)
        )

class Player(GameObject):
    def __init__(self, position):
        super().__init__(position, Color(0, 255, 0))  # Green player
        self.health = 100
        self.score = 0

class Enemy(GameObject):
    def __init__(self, position):
        super().__init__(position, Color(255, 0, 0))  # Red enemy
        self.damage = 10

# Level 3: Game systems using entities
class CollisionSystem:
    def check_collision(self, obj1, obj2):
        # Use the position data from GameObjects
        distance = ((obj1.position.x - obj2.position.x) ** 2 + 
                   (obj1.position.y - obj2.position.y) ** 2) ** 0.5
        return distance < 32  # Collision threshold

class GameWorld:
    def __init__(self):
        self.player = Player(Vector2D(100, 100))
        self.enemies = []
        self.collision_system = CollisionSystem()
    
    def update(self, delta_time):
        self.player.update(delta_time)
        for enemy in self.enemies:
            enemy.update(delta_time)
            if self.collision_system.check_collision(self.player, enemy):
                self.handle_collision(self.player, enemy)

# Level 4: Complete game using all systems
class Game:
    def __init__(self):
        self.world = GameWorld()
        self.running = True
    
    def run(self):
        while self.running:
            delta_time = self.calculate_delta_time()
            self.world.update(delta_time)
            self.render()

```

### Advantages of bottom-up design

- Builds on solid, tested foundations

- Easier to reuse components

- More flexible and adaptable

- Good for systems where basic operations are well-understood

### Disadvantages of bottom-up design

- May lose sight of overall system goals

- Can lead to over-engineered basic components

- Integration challenges may emerge late

## Choosing the right approach

### Use top-down when

- Requirements are well-defined and stable

- System has clear hierarchical structure

- Working with large, complex systems

- Need to coordinate multiple teams

### Use bottom-up when

- Building reusable components

- Requirements are likely to change

- Working with well-understood domains

- Building on existing systems

### Hybrid approach (most common)

Most real projects use both approaches:

1. **Start top-down** to understand overall structure

2. **Switch to bottom-up** for implementing core components

3. **Return to top-down** for system integration

4. **Iterate** between approaches as understanding improves

## Practice

/// details | Exercise 1: Requirements to responsibilities
    type: question
    open: false

Given these requirements for a simple task management system:

- Users can create, edit, and delete tasks

- Tasks have titles, descriptions, due dates, and priority levels

- Users can mark tasks as completed

- System shows overdue tasks in red

- Users can filter tasks by priority or completion status

**Task**: Identify the main responsibilities and assign them to appropriate classes.

/// details | Sample Solution
    type: success
    open: false

**Identified Classes and Responsibilities:**

```python
class Task:
    """Responsible for individual task data and status"""
    def __init__(self, title, description, due_date, priority):
        self.title = title
        self.description = description
        self.due_date = due_date
        self.priority = priority
        self.is_completed = False
    
    def mark_completed(self):
        """Responsibility: change task status"""
        self.is_completed = True
    
    def is_overdue(self):
        """Responsibility: determine if task is overdue"""
        return not self.is_completed and datetime.now() > self.due_date

class User:
    """Responsible for user data and task ownership"""
    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name
        self.tasks = []
    
    def create_task(self, title, description, due_date, priority):
        """Responsibility: create and own tasks"""
        task = Task(title, description, due_date, priority)
        self.tasks.append(task)
        return task

class TaskManager:
    """Responsible for task operations and filtering"""
    def __init__(self):
        self.users = {}
    
    def filter_by_priority(self, user_id, priority):
        """Responsibility: filter tasks by criteria"""
        user = self.users.get(user_id)
        return [task for task in user.tasks if task.priority == priority]
    
    def get_overdue_tasks(self, user_id):
        """Responsibility: identify overdue tasks"""
        user = self.users.get(user_id)
        return [task for task in user.tasks if task.is_overdue()]

```

///
///

/// details | Exercise 2: Design approach selection
    type: question
    open: false

For each scenario, determine whether top-down or bottom-up design would be more appropriate and explain why:

1. Building a calculator app with basic arithmetic operations

2. Designing an enterprise resource planning (ERP) system

3. Creating a graphics library for game development

4. Developing a school scheduling system

**Task**: Choose the best approach for each and justify your reasoning.

/// details | Sample Solution
    type: success
    open: false

1. **Calculator app**: **Bottom-up** - Start with basic operations (add, subtract, multiply, divide) as fundamental building blocks, then build up to more complex functions and user interface.

2. **ERP system**: **Top-down** - Large, complex system with clear business processes. Need to understand overall workflow and break down into modules (accounting, inventory, HR, etc.).

3. **Graphics library**: **Bottom-up** - Start with fundamental concepts (points, vectors, colors, transformations) and build up to higher-level graphics operations. Reusability is key.

4. **School scheduling**: **Hybrid (start top-down)** - Begin with overall scheduling requirements and constraints, then break down into components like room management, teacher availability, student enrollment.

///
///

/// details | Exercise 3: Collaboration design
    type: question
    open: false

Design the collaborations for a simple chat application where:

- Users can join chat rooms

- Users can send messages to rooms

- Messages are broadcast to all room members

- System maintains message history

**Task**: Define the classes and show how they collaborate to send a message.

/// details | Sample Solution
    type: success
    open: false

```python
class User:
    def __init__(self, user_id, username):
        self.user_id = user_id
        self.username = username
        self.current_rooms = []

class Message:
    def __init__(self, content, sender, timestamp):
        self.content = content
        self.sender = sender
        self.timestamp = timestamp

class ChatRoom:
    def __init__(self, room_id, name):
        self.room_id = room_id
        self.name = name
        self.members = []
        self.message_history = []
    
    def add_member(self, user):
        self.members.append(user)
    
    def broadcast_message(self, message):
        self.message_history.append(message)
        for member in self.members:
            # Notify each member of new message
            self.notify_member(member, message)

class ChatSystem:
    def __init__(self):
        self.rooms = {}
        self.users = {}
    
    def send_message(self, user_id, room_id, content):
        """Collaboration: coordinate message sending"""
        user = self.users[user_id]
        room = self.rooms[room_id]
        
        # Create message
        message = Message(content, user, datetime.now())
        
        # Room broadcasts to all members
        room.broadcast_message(message)
        
        return message

# Collaboration flow:
# 1. User requests to send message via ChatSystem
# 2. ChatSystem creates Message object
# 3. ChatSystem asks ChatRoom to broadcast
# 4. ChatRoom adds to history and notifies all members

```

///
///

## Recap

- **Design process flows** from requirements → responsibilities → collaborations → implementation

- **Requirements analysis** identifies what the system must do and how well it must do it

- **Responsibility assignment** determines which objects should handle which tasks

- **Collaborations** define how objects work together to achieve system goals

- **Top-down design** breaks complex systems into manageable hierarchical components

- **Bottom-up design** builds systems from fundamental, reusable building blocks

- **Hybrid approaches** combine both strategies for maximum effectiveness

- **Good design** results in systems that are maintainable, extensible, and meet user needs

The design process is iterative - you'll often cycle back to earlier stages as you learn more about the problem domain. The key is to be systematic while remaining flexible enough to adapt as your understanding evolves.
