---
title: "Structure Charts; Abstraction and Refinement"
---

# Structure Charts; Abstraction and Refinement

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Understand the difference between top-down and bottom-up design approaches
    - Create structure charts to break complex problems into manageable parts
    - Apply stepwise refinement to develop solutions systematically
    - Use abstraction to hide complexity and focus on essential details
    - Create component diagrams for module breakdown

## Introduction

Large software problems can seem overwhelming when viewed as a whole. **Structure charts** and **stepwise refinement** help break complex problems into smaller, manageable pieces that can be solved individually and then combined.

This approach makes problems easier to:

- **Understand** - focus on one piece at a time

- **Design** - create solutions step by step

- **Test** - verify each part works correctly

- **Maintain** - modify individual components without affecting others

## Abstraction

**Abstraction** means focusing on what something does rather than how it does it. It hides unnecessary details to make complex systems understandable.

### Levels of Abstraction

Think about driving a car:

| Level | What You See | Hidden Details |
|-------|--------------|----------------|
| **User Level** | Steering wheel, pedals, gear shift | Engine mechanics, fuel injection, transmission |
| **Control Level** | Start engine, accelerate, brake, steer | Spark plugs, pistons, hydraulic systems |
| **System Level** | Engine, transmission, brakes, steering | Metal alloys, electronic circuits, fluid dynamics |

### Abstraction in Software

```kroki-plantuml
@startuml
package "Student Management System" {
  [User Interface] 
  [Student Records]
  [Grade Calculator]
  [Report Generator]
}

[User Interface] --> [Student Records]
[User Interface] --> [Grade Calculator]
[User Interface] --> [Report Generator]
[Grade Calculator] --> [Student Records]
[Report Generator] --> [Student Records]
[Report Generator] --> [Grade Calculator]
@enduml

```

At the highest level, we see major components. Each component hides its internal complexity from the others.

## Top-Down vs Bottom-Up Design

### Top-Down Design

**Top-down design** starts with the big picture and breaks it into smaller pieces.

**Process:**

1. Define the main problem

2. Break it into major sub-problems

3. Break each sub-problem into smaller parts

4. Continue until each part is simple enough to solve directly

**Example: Online Shopping System**

```kroki-plantuml
@startuml
package "Online Shopping System" {
  package "User Management" {
    [Login/Registration]
    [User Profiles]
    [Authentication]
  }
  
  package "Product Catalog" {
    [Product Search]
    [Product Details]
    [Inventory Management]
  }
  
  package "Shopping Cart" {
    [Add/Remove Items]
    [Calculate Totals]
    [Apply Discounts]
  }
  
  package "Order Processing" {
    [Payment Processing]
    [Order Confirmation]
    [Shipping Management]
  }
}

[User Management] --> [Shopping Cart]
[Product Catalog] --> [Shopping Cart]
[Shopping Cart] --> [Order Processing]
@enduml

```

**Advantages:**

- Clear overview of the whole system

- Ensures all requirements are covered

- Good for planning and project management

- Natural way humans think about problems

**Disadvantages:**

- May miss important low-level details early

- Can lead to unrealistic designs

- Harder to reuse existing components

### Bottom-Up Design

**Bottom-up design** starts with available pieces and combines them into larger solutions.

**Process:**

1. Identify existing tools and components

2. Build small, useful modules

3. Combine modules into larger systems

4. Continue building up to the complete solution

**Example: Building a Calculator**

```kroki-plantuml
@startuml
package "Basic Operations" {
  [Add Function]
  [Subtract Function]
  [Multiply Function]
  [Divide Function]
}

package "Advanced Operations" {
  [Square Root]
  [Power Function]
  [Percentage]
}

package "Input/Output" {
  [Number Parser]
  [Display Formatter]
  [Error Handler]
}

package "Calculator Engine" {
  [Expression Evaluator]
  [Operation Dispatcher]
}

package "Calculator Application" {
  [User Interface]
  [Main Controller]
}

[Basic Operations] --> [Calculator Engine]
[Advanced Operations] --> [Calculator Engine]
[Input/Output] --> [Calculator Engine]
[Calculator Engine] --> [Calculator Application]
@enduml

```

**Advantages:**

- Builds on proven, working components

- Encourages code reuse

- More realistic about implementation constraints

- Can test components as you build

**Disadvantages:**

- May not meet all high-level requirements

- Can lose sight of the big picture

- Might create unnecessary complexity

### Hybrid Approach

Most real projects use **both approaches**:

1. **Start top-down** to understand requirements and overall structure

2. **Switch to bottom-up** when you have existing tools or proven solutions

3. **Iterate** between levels as you learn more about the problem

## Structure Charts

**Structure charts** show how a program is organized into modules and how those modules relate to each other. They focus on the **hierarchy** and **data flow** between components.

### Basic Structure Chart Elements

**Structure charts** use a simple text-based syntax to represent program modules and their relationships:

**Syntax Format:**
```
module id "Module Name"
  module child_id "Child Module Name"

parent_id -> child_id [type] [label]
```

| Element | Example | Meaning |
|---------|---------|---------|
| Module | `module calc "Calculator"` | Define a function or component |
| Calls | `main -> calc` | Parent calls/uses Child |
| Data flow | `main -> calc data "numbers"` | Data passed between modules |
| Control flow | `main -> calc control` | Control information passed |
| Loop | `loop over child1 child2` | Repeat for multiple items |
| Library | `library util "Utilities"` | Reusable library module |
| Storage | `storage db "Database"` | Data storage element |

/// details | Structure Chart Example: Grade Management System
    type: info
    open: false

```structure-chart
module main "Main Program"
  module getStudent "Get Student Info"
  module getScores "Get Assignment Scores"
  module calcAvg "Calculate Average"
  module calcGrade "Determine Letter Grade"
  module display "Display Results"
  module validate "Validate Input"
  module report "Generate Report"
  module save "Save to File"

main -> getStudent
main -> getScores
main -> calcAvg
main -> calcGrade
main -> display

getStudent -> validate
getScores -> validate

calcAvg -> calcGrade
display -> report
report -> save
```

///

### Data Flow in Structure Charts

```structure-chart
module main "Main Program"
  module getStudent "Get Student Info"
  module getScores "Get Assignment Scores"
  module calcAvg "Calculate Average"
  module calcGrade "Determine Letter Grade"
  module display "Display Results"

main -> getStudent data "student_name, student_id"
main -> getScores data "scores_list"
main -> calcAvg data "scores_list"
calcAvg -> calcGrade data "average_score"
main -> display data "student_name, average_score, letter_grade"
```

Data flows from one module to another, transforming along the way.

## Stepwise Refinement

**Stepwise refinement** is the process of gradually adding detail to a solution, starting with a high-level description and refining it step by step.

/// details | Example: Library Book Management System
    type: example
    open: false

**Step 1: High-Level Solution**

```
ALGORITHM LibrarySystem
BEGIN
    Handle book borrowing
    Handle book returns
    Generate reports
END

```

**Step 2: First Refinement**

```
ALGORITHM LibrarySystem
BEGIN
    WHILE system is running DO
        Display main menu
        Get user choice
        IF choice = "borrow" THEN
            Process book borrowing
        ELSE IF choice = "return" THEN
            Process book return
        ELSE IF choice = "report" THEN
            Generate system reports
        ELSE IF choice = "exit" THEN
            Exit system
        END IF
    END WHILE
END

```

**Step 3: Refine "Process book borrowing"**

```
ALGORITHM ProcessBookBorrowing
BEGIN
    Get library card number
    Validate card is active
    Get book ID
    Check if book is available
    Check user borrowing limits
    IF all checks pass THEN
        Create borrowing record
        Update book status
        Set due date
        Print receipt
    ELSE
        Display error message
    END IF
END

```

**Step 4: Refine "Validate card is active"**

```
ALGORITHM ValidateCard
BEGIN
    Look up card in database
    IF card not found THEN
        RETURN false
    ELSE IF card is expired THEN
        RETURN false
    ELSE IF card is suspended THEN
        RETURN false
    ELSE
        RETURN true
    END IF
END

```

///

### Structure Chart for Refined Solution

```structure-chart
module main "Main Controller"
  module menu "Display Menu"
  module input "Get User Input"
  module borrow "Process Borrowing"
    module validateCard "Validate Card"
      module readCard "Read Card Data"
    module checkBook "Check Book Availability"
      module readBook "Read Book Data"
    module checkLimits "Check Borrowing Limits"
    module createRecord "Create Borrowing Record"
      module writeBorrow "Write Borrowing Data"
    module display "Display Messages"
  module return "Process Return"
    module calcFines "Calculate Fines"
    module updateRec "Update Records"
      module writeReturn "Write Return Data"
  module reports "Generate Reports"
    module overdue "Overdue Books Report"
    module popular "Popular Books Report"

main -> menu
main -> input
main -> borrow
main -> return
main -> reports

borrow -> validateCard
borrow -> checkBook
borrow -> checkLimits
borrow -> createRecord
borrow -> display

validateCard -> readCard
checkBook -> readBook
createRecord -> writeBorrow

return -> calcFines
return -> updateRec
return -> display

updateRec -> writeReturn

reports -> overdue
reports -> popular
overdue -> readBook
overdue -> readCard
popular -> readBook
```

## Benefits of Structured Design

### Modularity

- **Independent modules** can be developed separately

- **Team collaboration** - different people work on different modules

- **Testing** - each module can be tested individually

- **Debugging** - problems are isolated to specific modules

### Reusability

- **Generic modules** can be used in multiple projects

- **Library functions** provide common functionality

- **Less code duplication** saves development time

- **Proven solutions** reduce errors

### Maintainability

- **Localized changes** - modifications affect only specific modules

- **Clear interfaces** make it easy to understand module interactions

- **Documentation** - structure charts serve as system documentation

- **Upgrades** - individual modules can be improved without affecting others

## Practice Activity: Student Report System

Let's apply structured design to create a student report system that builds on concepts from previous sections.

### Requirements

Create a system that:

1. Reads student data from multiple sources

2. Calculates various grade statistics

3. Generates different types of reports

4. Handles errors gracefully

### Your Task: Create the Structure Chart

Using the stepwise refinement process:

**Step 1: High-level modules (complete this)**

```structure-chart
module main "Main Program"
  module dataMgmt "Data Management"
  module gradeCalc "Grade Calculations"
  module reportGen "Report Generation"

main -> dataMgmt
main -> gradeCalc
main -> reportGen
```

**Step 2: Refine each major module**

```structure-chart
module main "Main Program"
  module read "Read Student Files"
    module validate "Validate Data"
      module store "Store in Memory"
  module calcAvg "Calculate Averages"
    module assignGrade "Assign Letter Grades"
      module calcGPA "Calculate GPA"
  module individualRpt "Individual Reports"
    module export "Export to File"
  module classReport "Class Summary Report"
    module classStats "Class Statistics"
  module gradeDist "Grade Distribution"

main -> read
main -> calcAvg
main -> individualRpt

read -> validate
validate -> store

calcAvg -> assignGrade
assignGrade -> calcGPA

individualRpt -> export
classReport -> classStats
gradeDist -> classStats
```

### Solution

**Step 2: Refined modules**

```structure-chart
module main "Main Program"
  module read "Read Student Files"
    module validate "Validate Data"
      module store "Store in Memory"
  module calcAvg "Calculate Averages"
    module assignGrade "Assign Letter Grades"
      module calcGPA "Calculate GPA"
  module individualRpt "Individual Reports"
    module export "Export to File"
  module classReport "Class Summary Report"
    module classStats "Class Statistics"
  module gradeDist "Grade Distribution"

main -> read
main -> calcAvg
main -> individualRpt

read -> validate
validate -> store

calcAvg -> assignGrade
assignGrade -> calcGPA

individualRpt -> export
classReport -> classStats
gradeDist -> classStats
```

**Step 3: Add data flow**

```structure-chart
module main "Main Program"
  module read "Read Student Files"
  module calcAvg "Calculate Averages"
    module assignGrade "Assign Letter Grades"
      module calcGPA "Calculate GPA"
  module individualRpt "Individual Reports"
    module export "Export to File"

main -> read data "student_records_list"
main -> calcAvg data "student_records_list"
calcAvg -> assignGrade data "averages_list"
assignGrade -> calcGPA data "grades_list"
main -> individualRpt data "student_records, grades, gpa"
individualRpt -> export data "report_files"
```

## Common Structure Chart Patterns

### Sequential Processing

```structure-chart
module step1 "Step 1"
  module step2 "Step 2"
    module step3 "Step 3"
      module step4 "Step 4"

step1 -> step2
step2 -> step3
step3 -> step4
```

### Data Transformation Pipeline

```structure-chart
module input "Input Data"
  module validate "Validate"
    module transform "Transform"
      module calculate "Calculate"
        module output "Output"

input -> validate
validate -> transform
transform -> calculate
calculate -> output
```

### Service-Oriented Architecture

```structure-chart
module app "Main Application"
  module auth "Authentication Service"
  module data "Data Service"
  module calc "Calculation Service"
  module report "Reporting Service"

app -> auth
app -> data
app -> calc
app -> report
```

### Layered Architecture

```structure-chart
module ui "User Interface"
  module coreAlg "Core Algorithms"
    module dbOps "Database Operations"

module inputVal "Input Validation"
  module bizRules "Business Rules"
    module fileOps "File Operations"

ui -> coreAlg
coreAlg -> dbOps

inputVal -> bizRules
bizRules -> fileOps
```

## Design Guidelines

### Module Design Principles

1. **Single Responsibility** - Each module should do one thing well

2. **High Cohesion** - Everything in a module should be related

3. **Low Coupling** - Modules should be as independent as possible

4. **Clear Interfaces** - Make it obvious how modules interact

5. **Appropriate Size** - Not too big (complex) or too small (trivial)

### Good Module Examples

```
✓ CalculateGPA(grades_list) → gpa_value
✓ ValidateEmailAddress(email_string) → boolean
✓ FormatCurrency(amount, currency_code) → formatted_string
✓ ReadConfigFile(filename) → config_dictionary

```

### Poor Module Examples

```
✗ DoEverything() - too broad, violates single responsibility
✗ GetAndValidateAndStoreData() - does too many things
✗ X() - unclear purpose, poor naming
✗ ProcessUserInputAndCalculateResultsAndDisplayOutput() - too long, too coupled

```


## Summary

**Structure charts and refinement help manage complexity through systematic decomposition:**

**Abstraction:**

- Focus on what components do, not how they work

- Hide implementation details behind clear interfaces

- Enable thinking at appropriate levels of detail

**Design Approaches:**

- **Top-down**: Start with big picture, break into parts

- **Bottom-up**: Start with available pieces, build up

- **Hybrid**: Combine both approaches as needed

**Structure Charts:**

- Show module hierarchy and relationships

- Document data flow between components

- Provide blueprint for implementation and testing

**Stepwise Refinement:**

- Gradually add detail to high-level solutions

- Break complex problems into manageable pieces

- Ensure all requirements are addressed systematically

**Benefits:**

- **Modularity** enables parallel development and testing

- **Reusability** reduces duplication and development time

- **Maintainability** localizes changes and simplifies updates
