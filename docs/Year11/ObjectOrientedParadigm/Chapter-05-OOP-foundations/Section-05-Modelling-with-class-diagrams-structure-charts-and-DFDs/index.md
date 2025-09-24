# 5.5 Modelling with class diagrams, structure charts and DFDs

## Learning objectives

!!! builds-on "Builds on"
    This section builds on [5.4 Comparing procedural and OOP](../Section-04-Comparing-procedural-and-OOP/index.md).


By the end of this section, you will be able to:

- Create class diagrams using PlantUML to represent object-oriented systems

- Design structure charts to show hierarchical decomposition of functions

- Draw data flow diagrams (DFDs) to map data paths through a system

- Understand how these three modeling techniques complement each other

- Choose the appropriate diagram type for different aspects of system design

- Map responsibilities and data flows in a system design

## Why we need different modeling techniques

When designing software systems, we need different perspectives to understand the complete picture:

- **Class diagrams** show the static structure: what objects exist and how they relate

- **Structure charts** show functional decomposition: how complex tasks break down into simpler ones  

- **Data flow diagrams** show data movement: how information flows through the system

Think of it like designing a house - you need floor plans (structure), electrical diagrams (connections), and plumbing diagrams (flow). Each shows a different but essential view.

## Class diagrams with PlantUML

**Class diagrams** visualize the classes in your system, their attributes, methods, and relationships.

### Basic class representation

```kroki-plantuml
@startuml
class Student {
    - name: string
    - student_id: string
    - grades: list
    
    + \_\_init\_\_(name, student_id)
    + add_grade(grade: float)
    + get_average(): float
    + get_info(): string
}
@enduml

```

### Showing relationships between classes

```kroki-plantuml
@startuml
class School {
    - name: string
    - address: string
    + \_\_init\_\_(name, address)
    + enroll_student(student: Student)
    + add_course(course: Course)
}

class Student {
    - name: string
    - student_id: string
    - grades: list
    + \_\_init\_\_(name, student_id)
    + add_grade(grade: float)
    + get_average(): float
}

class Course {
    - course_name: string
    - course_code: string
    - teacher: Teacher
    + \_\_init\_\_(name, code, teacher)
    + enroll_student(student: Student)
    + get_enrolled_count(): int
}

class Teacher {
    - name: string
    - employee_id: string
    - subject: string
    + \_\_init\_\_(name, id, subject)
    + teach_course(course: Course)
}

School ||--o{ Student : "enrolls"
School ||--o{ Course : "offers"
Course }o--|| Teacher : "taught by"
Course }o--o{ Student : "enrolled in"
@enduml

```

This diagram shows:

- **Composition** (filled diamond): School contains Students and Courses

- **Association** (line): Courses are taught by Teachers

- **Many-to-many** (o{ to }o): Students can enroll in multiple Courses

### Inheritance in class diagrams

```kroki-plantuml
@startuml
abstract class Vehicle {
    - make: string
    - model: string
    - speed: float
    + \_\_init\_\_(make, model)
    + start(): boolean
    + stop(): boolean
    {abstract} + accelerate(): void
}

class Car extends Vehicle {
    - doors: int
    - fuel_level: float
    + \_\_init\_\_(make, model, doors)
    + accelerate(): void
    + refuel(amount: float): void
}

class Motorcycle extends Vehicle {
    - engine_size: int
    - has_sidecar: boolean
    + \_\_init\_\_(make, model, engine_size)
    + accelerate(): void
    + wheelie(): boolean
}

class ElectricCar extends Car {
    - battery_level: float
    - charging_port: string
    + \_\_init\_\_(make, model, doors, battery_capacity)
    + charge(duration: int): void
    + get_range(): float
}
@enduml

```

## Structure charts

**Structure charts** show how a complex system breaks down into simpler components in a hierarchical way. They're especially useful for understanding the functional decomposition of a problem.

### Basic structure chart example

For a simple library management system:

```text
Library Management System
├── User Management
│   ├── Add Member
│   ├── Remove Member
│   └── Update Member Info
├── Book Management
│   ├── Add Book
│   ├── Remove Book
│   └── Search Books
└── Lending Operations
    ├── Borrow Book
    ├── Return Book
    └── Calculate Fines

```

### Structure chart with data flow

```kroki-plantuml
@startuml
!define STRUCT_CHART

rectangle "Process Student Enrollment" as main {
    rectangle "Validate Student Data" as validate
    rectangle "Check Prerequisites" as prereq
    rectangle "Update Database" as update
    rectangle "Send Confirmation" as confirm
}

validate --> main : "validation result"
prereq --> main : "eligibility status"
main --> update : "student record"
main --> confirm : "enrollment details"
@enduml

```

### When to use structure charts

- Planning the breakdown of complex functions

- Understanding legacy procedural systems

- Showing the hierarchy of method calls

- Documenting system architecture at a high level

## Data Flow Diagrams (DFDs)

**Data Flow Diagrams** show how data moves through a system, focusing on the transformation of information rather than the control flow.

### DFD symbols and conventions

- **Circles/Processes**: Transform data (numbered 1, 2, 3...)

- **Rectangles/External entities**: Sources or destinations of data

- **Open rectangles/Data stores**: Where data is stored

- **Arrows**: Data flow with descriptive labels

### Simple DFD example

```kroki-plantuml
@startuml
!define EXTERNAL_ENTITY rectangle
!define PROCESS circle
!define DATA_STORE folder

EXTERNAL_ENTITY "Student" as student
EXTERNAL_ENTITY "Teacher" as teacher

PROCESS "1\nProcess\nEnrollment" as process1
PROCESS "2\nValidate\nPrerequisites" as process2
PROCESS "3\nUpdate\nRecords" as process3

DATA_STORE "Student Database" as db1
DATA_STORE "Course Database" as db2

student --> process1 : "enrollment request"
process1 --> process2 : "student details"
process2 --> db2 : "prerequisite check"
db2 --> process2 : "course requirements"
process2 --> process3 : "validation result"
process3 --> db1 : "updated enrollment"
process3 --> student : "confirmation"
teacher --> process3 : "approval"
@enduml

```

### DFD levels

**Level 0 (Context Diagram)**: Shows the system as a single process with external entities

```kroki-plantuml
@startuml
rectangle "Student" as student
rectangle "Teacher" as teacher
rectangle "Administrator" as admin

circle "Library\nManagement\nSystem" as system

student --> system : "borrow request"
system --> student : "book + due date"
teacher --> system : "book recommendation"
system --> teacher : "availability status"
admin --> system : "new book details"
system --> admin : "inventory report"
@enduml

```

**Level 1**: Breaks down the main system into major processes

```kroki-plantuml
@startuml
rectangle "Student" as student
rectangle "Teacher" as teacher

circle "1\nManage\nBorrowing" as p1
circle "2\nManage\nInventory" as p2
circle "3\nGenerate\nReports" as p3

folder "Book Database" as db1
folder "User Database" as db2

student --> p1 : "borrow request"
p1 --> db1 : "book query"
db1 --> p1 : "book details"
p1 --> student : "borrowed book"
teacher --> p2 : "book recommendation"
p2 --> db1 : "new book"
p3 --> db1 : "book data"
p3 --> db2 : "user data"
@enduml

```

## How the three techniques complement each other

### Example: Online Shopping System

Let's see how each diagram type provides a different but complementary view:

**1. Class Diagram** - Shows the static structure:

```kroki-plantuml
@startuml
class Customer {
    - customer_id: string
    - name: string
    - email: string
    + place_order(cart: ShoppingCart)
    + view_order_history()
}

class ShoppingCart {
    - items: list
    - total: float
    + add_item(product: Product)
    + remove_item(product: Product)
    + calculate_total(): float
}

class Product {
    - product_id: string
    - name: string
    - price: float
    - stock_quantity: int
    + update_stock(quantity: int)
}

class Order {
    - order_id: string
    - date: datetime
    - status: string
    - total_amount: float
    + process_payment()
    + ship_order()
}

Customer ||--o{ Order : "places"
Customer ||--|| ShoppingCart : "has"
ShoppingCart }o--o{ Product : "contains"
Order }o--o{ Product : "includes"
@enduml

```

**2. Structure Chart** - Shows functional decomposition:

```text
Online Shopping System
├── Customer Management
│   ├── Register Customer
│   ├── Authenticate User
│   └── Update Profile
├── Product Catalog
│   ├── Browse Products
│   ├── Search Products
│   └── View Product Details
├── Shopping Cart
│   ├── Add to Cart
│   ├── Remove from Cart
│   └── Calculate Total
└── Order Processing
    ├── Process Payment
    ├── Update Inventory
    └── Generate Invoice

```

**3. Data Flow Diagram** - Shows data movement:

```kroki-plantuml
@startuml
rectangle "Customer" as customer
rectangle "Payment Gateway" as payment

circle "1\nProcess\nOrder" as p1
circle "2\nUpdate\nInventory" as p2
circle "3\nGenerate\nInvoice" as p3

folder "Product Database" as db1
folder "Order Database" as db2

customer --> p1 : "order details"
p1 --> db1 : "product request"
db1 --> p1 : "product info"
p1 --> p2 : "ordered items"
p2 --> db1 : "stock update"
p1 --> db2 : "order record"
p1 --> p3 : "order summary"
p3 --> customer : "invoice"
p1 --> payment : "payment request"
payment --> p1 : "payment confirmation"
@enduml

```

### When to use each diagram

| Diagram Type | Best Used For | Answers Questions |
|--------------|---------------|-------------------|
| **Class Diagram** | Static structure, relationships | "What objects exist? How do they relate?" |
| **Structure Chart** | Functional breakdown, hierarchy | "How does this complex task break down?" |
| **Data Flow Diagram** | Data movement, transformation | "Where does data come from and go to?" |

## Practice

/// details | Exercise 1: Create a class diagram
    type: question
    open: false

Design a class diagram for a simple blog system with:

- Users who can create posts and comments

- Posts that belong to users and can have multiple comments

- Comments that belong to both users and posts

- Categories that posts can be assigned to

**Task**: Create a PlantUML class diagram showing classes, attributes, methods, and relationships.

/// details | Sample Solution
    type: success
    open: false

```kroki-plantuml
@startuml
class User {
    - user_id: string
    - username: string
    - email: string
    - password: string
    + \_\_init\_\_(username, email, password)
    + create_post(title, content): Post
    + add_comment(post: Post, content): Comment
    + login(email, password): boolean
}

class Post {
    - post_id: string
    - title: string
    - content: string
    - date_created: datetime
    - author: User
    + \_\_init\_\_(title, content, author)
    + add_comment(comment: Comment)
    + edit_content(new_content)
    + assign_category(category: Category)
}

class Comment {
    - comment_id: string
    - content: string
    - date_created: datetime
    - author: User
    + \_\_init\_\_(content, author, post)
    + edit_content(new_content)
}

class Category {
    - category_id: string
    - name: string
    - description: string
    + \_\_init\_\_(name, description)
    + add_post(post: Post)
}

User ||--o{ Post : "creates"
User ||--o{ Comment : "writes"
Post ||--o{ Comment : "has"
Category ||--o{ Post : "contains"
@enduml

```

///
///

/// details | Exercise 2: Design a structure chart
    type: question
    open: false

Create a structure chart for a student grade management system that:

- Allows teachers to input grades

- Calculates student averages

- Generates progress reports

- Sends notifications to parents

**Task**: Design a hierarchical breakdown showing the main system and its sub-functions.

/// details | Sample Solution
    type: success
    open: false

```text
Student Grade Management System
├── Grade Input Management
│   ├── Validate Teacher Login
│   ├── Select Student
│   ├── Enter Grade Data
│   └── Save Grade Record
├── Grade Calculation
│   ├── Retrieve Student Grades
│   ├── Calculate Subject Average
│   ├── Calculate Overall GPA
│   └── Determine Letter Grade
├── Report Generation
│   ├── Gather Student Data
│   ├── Format Progress Report
│   ├── Generate PDF Report
│   └── Store Report Record
└── Notification System
    ├── Check Notification Rules
    ├── Compose Message
    ├── Send Email to Parents
    └── Log Notification Sent

```

///
///

/// details | Exercise 3: Create a data flow diagram
    type: question
    open: false

Design a Level 1 DFD for a simple ATM system that:

- Allows customers to check balance, withdraw money, and deposit money

- Validates PIN numbers

- Updates account balances

- Logs all transactions

**Task**: Create a DFD showing processes, data stores, external entities, and data flows.

/// details | Sample Solution
    type: success
    open: false

```kroki-plantuml
@startuml
rectangle "Customer" as customer
rectangle "Bank System" as bank

circle "1\nValidate\nPIN" as p1
circle "2\nProcess\nWithdrawal" as p2
circle "3\nProcess\nDeposit" as p3
circle "4\nCheck\nBalance" as p4
circle "5\nLog\nTransaction" as p5

folder "Account Database" as db1
folder "Transaction Log" as db2

customer --> p1 : "card + PIN"
p1 --> db1 : "account lookup"
db1 --> p1 : "account details"
p1 --> customer : "validation result"

customer --> p2 : "withdrawal request"
p2 --> db1 : "balance check"
db1 --> p2 : "current balance"
p2 --> db1 : "balance update"
p2 --> customer : "cash + receipt"
p2 --> p5 : "transaction details"

customer --> p3 : "deposit amount"
p3 --> db1 : "balance update"
p3 --> customer : "deposit receipt"
p3 --> p5 : "transaction details"

customer --> p4 : "balance inquiry"
p4 --> db1 : "balance request"
db1 --> p4 : "account balance"
p4 --> customer : "balance display"

p5 --> db2 : "transaction record"
db2 --> bank : "audit trail"
@enduml

```

///
///

## Recap

- **Class diagrams** visualize static structure using classes, attributes, methods, and relationships

- **PlantUML** provides a text-based way to create professional class diagrams

- **Structure charts** show hierarchical functional decomposition from complex to simple tasks

- **Data Flow Diagrams** map how data moves and transforms through a system

- **Different perspectives** are needed: structure (class diagrams), function (structure charts), and data flow (DFDs)

- **Complementary views** together provide a complete understanding of system design

- **Choose the right diagram** based on what aspect of the system you need to communicate

These modeling techniques are essential tools for system design, helping you visualize different aspects of your software before you start coding. They improve communication with stakeholders and provide a roadmap for implementation.
