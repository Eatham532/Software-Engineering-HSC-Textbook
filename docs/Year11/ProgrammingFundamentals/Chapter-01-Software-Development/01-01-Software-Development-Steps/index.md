# 1.1 Software development steps

## Why it matters

Think of software development like building a house. Without a plan, you might end up with a crooked foundation, leaky roof, or rooms that don't connect properly. The Software Development Lifecycle (SDLC) is your blueprint and checklist to ensure your software project succeeds.

Without systematic processes, software projects frequently fail due to:

- **Unclear requirements** - building the wrong thing because you didn't understand what was needed

- **Poor planning** - creating code that's hard to change or maintain

- **Missing testing** - discovering bugs too late when they're expensive to fix

- **Integration problems** - when different parts don't work together

- **Deployment failures** - when the software won't run in the real world

The SDLC gives you a proven framework to avoid these problems and build software that actually works for its users.

## Software development lifecycle (SDLC)

The Software Development Lifecycle is like a recipe for building software. Just as a recipe has steps (gather ingredients, mix, bake, cool), the SDLC has systematic steps to ensure your software works well and meets user needs.

### SDLC phases overview

Think of the SDLC as a journey with these main stops:

1. **Planning & Analysis** - Understand the problem and what users need

2. **Design** - Plan how the solution will work and look

3. **Implementation** - Write the actual code

4. **Testing** - Check that everything works correctly

5. **Deployment** - Put the software where users can access it

6. **Maintenance** - Fix bugs and add improvements over time

### Phase relationships and iteration

Modern software development isn't always a straight line. Think of it more like a spiral where you might revisit earlier steps:

- **Iterative development**: Build a small version, get feedback, then improve it

- **Continuous feedback**: Show your work to users early and often

- **Risk management**: Identify and fix problems before they become disasters

- **Documentation**: Keep clear records so others can understand your decisions

### Problem identification (comprehensive analysis)

Before you start coding, you need to clearly understand the problem you're solving. This is like a detective investigating a case - you need to gather all the facts and understand everyone's perspective.

/// details | Stakeholder analysis
    type: note
    open: false

**Stakeholders** are all the people who care about or are affected by your software. Think of them like characters in a story:

**Primary stakeholders** - The main characters who directly use your software:

- End users who interact with it daily

- System administrators who keep it running

- Support staff who help users with problems

**Secondary stakeholders** - Supporting characters who benefit indirectly:

- Managers who get reports from the system

- Customers whose experience improves

- Organizations that need to comply with regulations

**Negative stakeholders** - Characters who might be affected negatively:

- Employees whose jobs might change

- Competitors who might lose business

- Groups concerned about privacy or security
///

/// details | Problem definition techniques
    type: note
    open: false

**Problem statement structure** - A clear way to describe the problem:

```text
For [who has the problem]
Who [their situation and challenges]
The [your solution name] is a [type of solution]
That [main benefit it provides]
Unlike [current alternatives]
Our solution [unique advantage]

```text

**Root cause analysis** - Ask "why" five times to find the real problem:

1. Why do users struggle with the current process?

2. Why is the current system inadequate?

3. Why haven't previous solutions worked?

4. Why is this problem important now?

5. Why will solving this create value?

**Problem validation** - Make sure the problem is real and worth solving:

- Talk to potential users about their pain points

- Watch how they currently work

- Measure the cost of the current problem

- Check if solving it aligns with goals
///

/// details | Example: Grade Calculator Problem Analysis
    type: example
    open: false

**Context**: High school teachers spend excessive time calculating student averages manually

**Stakeholder analysis**:

- Primary: Teachers who enter grades and calculate averages

- Secondary: Students who want to know their current standing, parents who monitor progress

- Negative: None significant for this simple tool

**Problem statement**:  
"For high school teachers who teach multiple classes with 20-30 students each, manual grade calculation is time-consuming and error-prone. The Grade Calculator is a simple utility that automatically computes weighted averages for different assignment types. Unlike generic spreadsheet solutions, our calculator provides education-specific features like grade scales and missing assignment handling."
///

### Requirements specification (detailed process)

Once you understand the problem, you need to write down exactly what your solution should do. Think of this as writing a shopping list before going to the store - you need to know exactly what to buy.

Good requirements are SMART: **Specific**, **Measurable**, **Achievable**, **Relevant**, and **Time-bound**.

/// details | Types of requirements
    type: note
    open: false

**Functional requirements** - What the system must DO:

- How users input data and what happens to it

- What calculations or processing occurs

- What outputs or results are produced

- How the user interface behaves

- What data needs to be stored and retrieved

**Non-functional requirements** - How the system must PERFORM:

- How fast it should work (performance)

- How secure it needs to be

- How easy it should be to use

- How reliable it must be

- How many users it should support

- What devices or browsers it must work on

**Constraint requirements** - External LIMITATIONS:

- What technology you must use

- Budget and time restrictions

- Legal or regulatory requirements

- Existing systems you must work with

- Available resources (people, servers, etc.)
///

/// details | Requirements gathering techniques
    type: note
    open: false

**Interviews and surveys**: Direct stakeholder input

```text
Sample interview questions:

- What tasks do you perform most frequently?
- Where do current processes break down?
- What would success look like?
- What are your biggest frustrations?
- How do you measure productivity?

```text

**Observation and job shadowing**: Understanding actual workflows

- Watch users perform current processes

- Identify inefficiencies and workarounds

- Note differences between official procedures and reality

- Document time spent on different activities

**Prototyping and mockups**: Visual requirements exploration

- Create low-fidelity wireframes for user interface

- Build interactive prototypes for complex workflows

- Use mockups to validate understanding with stakeholders

- Iterate based on feedback before development begins
///

/// details | Requirements documentation standards
    type: note
    open: false

**User stories format**: Requirements from user perspective

```text
As a [user type]
I want [functionality]
So that [business value]

Acceptance criteria:
- Given [context]
- When [action]
- Then [expected result]

```text

**Traditional specification format**:

```text
REQ-001: Grade Input Validation
Description: The system shall validate grade inputs to ensure data quality
Priority: High
Type: Functional
Details:
- Grades must be numeric values between 0 and 100
- Invalid inputs shall display error message "Grade must be between 0-100"
- Empty inputs are permitted for missing assignments
- The system shall highlight invalid fields in red
Test criteria: Enter grade of -5, verify error message appears

```text

///

/// details | Example: Grade Calculator Requirements
    type: example
    open: false

**Functional requirements**:

- REQ-F001: Accept three numeric grade inputs (0-100 range)

- REQ-F002: Calculate arithmetic average rounded to one decimal place

- REQ-F003: Display result in format "Average: XX.X"

- REQ-F004: Validate inputs and show error for invalid values

- REQ-F005: Allow clearing inputs to start new calculation

**Non-functional requirements**:

- REQ-NF001: Calculation must complete within 100ms

- REQ-NF002: Interface must be usable without mouse (keyboard navigation)

- REQ-NF003: Must work in all major web browsers

- REQ-NF004: Code must include unit tests with 90% coverage

**Constraints**:

- REQ-C001: Must use only Python standard library (no external dependencies)

- REQ-C002: Code must follow PEP 8 style guidelines

- REQ-C003: Must complete development within 2 weeks
///

### Solution design (architectural thinking)

Solution design bridges the gap between requirements and implementation by creating a blueprint for the system architecture, data structures, and component interactions.

/// details | Design levels and artifacts
    type: note
    open: false

**System architecture**: High-level structure and component relationships

- Identify major system components and their responsibilities

- Define interfaces and communication protocols between components

- Specify data flow and control flow through the system

- Plan integration points with external systems

**Data design**: Information structure and storage strategy

- Entity-relationship diagrams for database design

- Data dictionaries defining fields, types, and constraints

- Input/output data formats and validation rules

- Data lifecycle management (creation, updates, archival)

**Interface design**: User and system interaction patterns

- User interface mockups and navigation flows

- API specifications for system-to-system communication

- Error handling and user feedback mechanisms

- Accessibility and usability considerations

**Detailed design**: Component-level implementation planning

- Class diagrams and object relationships

- Function signatures and parameter specifications

- Algorithm selection and pseudocode development

- Performance optimization strategies
///

/// details | Design principles and patterns
    type: note
    open: false

Good software design is like organizing a kitchen - everything should have its place and be easy to find and use.

**Separation of concerns** - Like a restaurant kitchen where different chefs handle different tasks:

```text
Example: Grade Calculator separation
- Input chef: Handles user input and checks if it's valid
- Math chef: Performs the calculations
- Presentation chef: Formats the results for display
- Head chef: Coordinates between all the specialists

```text

**Single responsibility principle** - Each part should have just one job:

- Functions should do one specific thing

- Classes should represent one concept

- Modules should handle one aspect of the problem

**Interface-based design** - Define clear contracts before building:

- Specify exactly what inputs and outputs each part needs

- Document what can go wrong and how to handle it

- Plan for edge cases and error conditions

- Make it possible for different people to work on different parts
///

/// details | Design documentation and communication
    type: note
    open: false

**Architecture diagrams**: Visual representation of system structure

- Component diagrams showing major parts and connections

- Sequence diagrams illustrating interaction flows

- Deployment diagrams showing runtime environment

- Network diagrams for distributed systems

**Design rationale**: Explanation of design decisions

- Alternative approaches considered and rejected

- Trade-offs made and their justifications

- Assumptions and constraints that influenced design

- Future extensibility and maintenance considerations
///

/// details | Example: Grade Calculator Design
    type: example
    open: false

**System architecture overview**:

```kroki-blockdiag
blockdiag {
    orientation = portrait;
    Input -> Business -> Output;

    Input [label = "Input Layer"];
    Business [label = "Business Logic"];
    Output [label = "Output Layer"];
}

```text

**Component design specification**:

- Input: Three floating-point numbers (grades)

- Validation: 0 ≤ grade ≤ 100, handle empty/null values

- Processing: Arithmetic mean calculation

- Output: Formatted string with one decimal precision

**Interface design specification**:

- Function signature: `def average(grade1, grade2, grade3) -> float`

- Error handling: Raise ValueError for invalid inputs

- Return format: Float rounded to one decimal place

**Design considerations and rationale**:

- Use built-in `round()` function for precision control

- Implement input validation before calculation

- Separate calculation logic from input/output handling

- Include comprehensive error messages for debugging
///

### Development and implementation

- Implement functionality incrementally in small units, test each unit, and commit frequently.

- Keep code readable and use descriptive names.

### Testing and debugging

- Test with typical, boundary, and faulty inputs.

- Use print statements, small test harnesses, or a debugger to trace and fix problems.

### Integration, installation and maintenance

- Combine components and verify interfaces between modules.

- Prepare the package for distribution and document how to run the code and any required setup steps (installation).

- Plan basic maintenance activities such as updating dependencies, fixing defects, and documenting changes.

## Worked example

/// tab | Python

```py
# Grade Calculator: Complete implementation with validation
def validate_grade(grade):
    """Validate a single grade input."""
    if not isinstance(grade, (int, float)):
        raise TypeError(f"Grade must be numeric, got {type(grade).__name__}")
    if grade < 0 or grade > 100:
        raise ValueError(f"Grade must be between 0-100, got {grade}")
    return float(grade)

def calculate_average(grade1, grade2, grade3):
    """Calculate average of three grades with validation."""
    # Validate all inputs before processing
    validated_grades = [
        validate_grade(grade1),
        validate_grade(grade2), 
        validate_grade(grade3)
    ]

    # Calculate arithmetic mean
    total = sum(validated_grades)
    average = total / len(validated_grades)

    # Round to one decimal place
    return round(average, 1)

def format_result(average_value):
    """Format the average for display."""
    return f"Average: {average_value}"

# Main execution with error handling
if __name__ == '__main__':
    try:
        # Test with valid inputs
        result = calculate_average(80, 72, 90)
        print(format_result(result))  # Average: 80.7

        # Test edge cases
        print(format_result(calculate_average(100, 0, 50)))  # Average: 50.0

    except (TypeError, ValueError) as e:
        print(f"Error: {e}")

```text

///

/// tab | Pseudocode

```text
ALGORITHM GradeCalculator

FUNCTION validate_grade(grade)
    IF grade is not numeric THEN
        RAISE TypeError("Grade must be numeric")
    END IF

    IF grade < 0 OR grade > 100 THEN
        RAISE ValueError("Grade must be between 0-100")
    END IF

    RETURN grade as float
END FUNCTION

FUNCTION calculate_average(grade1, grade2, grade3)
    validated_grade1 ← validate_grade(grade1)
    validated_grade2 ← validate_grade(grade2)
    validated_grade3 ← validate_grade(grade3)

    total ← validated_grade1 + validated_grade2 + validated_grade3
    average ← total / 3

    RETURN ROUND(average, 1)
END FUNCTION

FUNCTION format_result(average_value)
    RETURN "Average: " + average_value
END FUNCTION

MAIN
    TRY
        result ← calculate_average(80, 72, 90)
        OUTPUT format_result(result)
    CATCH error
        OUTPUT "Error: " + error.message
    END TRY
END MAIN

```text

///

### What the example demonstrates

The Grade Calculator shows how to apply each SDLC phase to a real project:

**Problem identification applied**:

- Target users: High school teachers who need to calculate averages

- Core need: Fast, accurate grade calculations

- Success criteria: Correct math with helpful error messages

**Requirements specification applied**:

- Functional: Accept 3 grades, validate inputs, calculate average, show results

- Non-functional: Clear error messages, robust validation

- Constraints: Use only Python standard library, follow good practices

**Solution design applied**:

- Separation of concerns: Different functions for validation, calculation, and display

- Input validation: Check data types and ranges before processing

- Error handling: Graceful failure with informative messages

- Modularity: Each function has one clear responsibility

**Implementation quality indicators**:

- **Readable code**: Clear function names and helpful comments

- **Robust validation**: Check both data types and value ranges

- **Proper error handling**: Specific exceptions with useful messages

- **Testable design**: Pure functions that can be easily tested

- **Documentation**: Docstrings explain what each function does

## Practice exercises

These exercises apply the complete software development lifecycle to build understanding progressively.

### Foundation Practice

/// details | Exercise 1: Problem Analysis
    type: question
    open: false

**Scenario**: A local coffee shop wants to calculate daily revenue from three different product categories: coffee drinks, pastries, and merchandise.

**Task**: Complete the problem identification phase.

1. Identify the primary stakeholders and their needs

2. Define the core problem statement

3. List what success looks like for this solution

4. Identify any constraints or limitations

/// details | Sample Solution
    type: success
    open: false

**Primary stakeholders**: Coffee shop owner (needs accurate daily revenue tracking), employees (need simple data entry), accountant (needs reliable financial data)

**Problem statement**: The coffee shop lacks an automated system to calculate and track daily revenue across multiple product categories, leading to manual calculation errors and inefficient business analysis.

**Success criteria**: Automated calculation of daily revenue totals, categorized breakdown of sales, error-free calculations, easy data entry interface.

**Constraints**: Must work on existing hardware, employees need minimal training, calculations must be audit-ready.
///
///

/// details | Exercise 2: Requirements Gathering
    type: question
    open: false

Using the coffee shop scenario from Exercise 1, develop comprehensive requirements.

**Tasks**:

1. Write 3 functional requirements

2. Write 3 non-functional requirements  

3. Identify 2 technical constraints

4. Create a simple user story for the main functionality

/// details | Sample Solution
    type: success
    open: false

**Functional requirements**:

- FR1: System must accept daily sales amounts for three categories (coffee, pastries, merchandise)

- FR2: System must calculate total daily revenue automatically

- FR3: System must display categorized revenue breakdown with percentages

**Non-functional requirements**:

- NFR1: Calculations must be accurate to 2 decimal places

- NFR2: System must respond within 2 seconds of data entry

- NFR3: Interface must be usable by staff with basic computer skills

**Technical constraints**:

- TC1: Must run on Windows 10 point-of-sale terminals

- TC2: Must not require internet connectivity during operation

**User story**: "As a coffee shop employee, I want to enter daily sales figures for each product category so that I can quickly see total revenue and category breakdowns without manual calculations."
///
///

### Intermediate Practice

/// details | Exercise 3: Solution Design
    type: question
    open: false

Design a solution for the coffee shop revenue calculator.

**Tasks**:

1. Create a system architecture diagram (describe in text)

2. Design the main function structure with inputs and outputs

3. Plan error handling for invalid inputs

4. Identify reusable components

/// details | Sample Solution
    type: success
    open: false

**Architectural Components**:

- Input Layer: Data validation functions for each category

- Processing Layer: Revenue calculation engine

- Output Layer: Formatted display and report generation

- Error Handler: Centralized validation and error messaging

**Function Interface Design**:

```text
validate_amount(amount, category) → validated_float
calculate_total_revenue(coffee, pastries, merchandise) → total
calculate_percentages(coffee, pastries, merchandise, total) → dict
format_report(totals, percentages) → formatted_string

```text

**Error handling plan**:

- Validate numeric inputs (reject negative numbers, non-numeric values)

- Handle division by zero when calculating percentages

- Provide clear error messages for each validation failure

**Reusable components**:

- Amount validation function (works for any currency input)

- Percentage calculation function (works for any category breakdown)

- Report formatting function (adaptable to different output formats)
///
///

/// details | Exercise 4: Implementation Planning
    type: question
    open: false

Plan the implementation approach for the coffee shop calculator.

**Tasks**:

1. Break down the solution into development phases

2. Identify testing strategies for each component

3. Plan integration between components

4. Consider maintenance requirements

/// details | Sample Solution
    type: success
    open: false

**Development phases**:

1. Core calculation functions (validate, calculate totals)

2. Error handling and input validation

3. Report formatting and display

4. Integration testing and user interface refinement

**Testing strategies**:

- Unit tests: Test each calculation function with known inputs/outputs

- Boundary testing: Test with zero values, maximum realistic amounts

- Error path testing: Verify proper handling of invalid inputs

- Integration testing: Test complete workflow from input to output

**Integration plan**:

- Build calculation core first (most critical functionality)

- Add validation layer (ensures data quality)

- Integrate formatting (completes user experience)

- Test end-to-end workflows with realistic data

**Maintenance considerations**:

- Document calculation formulas for future reference

- Design for easy addition of new product categories

- Plan for tax calculation additions

- Ensure audit trail capabilities for accounting purposes
///
///

### Advanced Practice

/// details | Exercise 5: Complete Development Cycle
    type: question
    open: false

Apply the entire software development lifecycle to create a grade boundary calculator for exam results.

**Scenario**: A school needs to convert numerical exam scores (0-100) into letter grades using configurable grade boundaries.

**Your mission**: Complete all SDLC phases for this project.

/// details | Comprehensive Solution Guide
    type: success
    open: false

**Phase 1: Problem Identification**

*Stakeholders*: Teachers (need quick grade conversion), students (want consistent grading), administrators (need audit capability)

*Problem statement*: Manual grade conversion is time-consuming and error-prone, with inconsistent application of grade boundaries across different subjects and teachers.

*Success criteria*: Automated grade conversion, configurable boundaries, consistent results, audit trail for grade decisions.

**Phase 2: Requirements Specification**

*Functional requirements*:

- Accept numerical scores and grade boundary configuration

- Convert scores to letter grades based on boundaries

- Handle edge cases (scores exactly on boundaries)

- Support multiple grading schemes (A-F, 1-7, etc.)

*Non-functional requirements*:

- Process 100+ scores within 5 seconds

- Maintain accuracy to avoid grading disputes

- Interface suitable for non-technical teachers

**Phase 3: Solution Design**

*System Architecture*:

```kroki-blockdiag
blockdiag {
  orientation = portrait;
  
  Main [label = "Grade Boundary System"];
  
  Validator [label = "Input Validator"];
  Calculator [label = "Grade Calculator"];
  Config [label = "Configuration Manager"];
  Output [label = "Output Formatter"];
  
  Main -> Validator;
  Main -> Calculator;
  Main -> Config;
  Main -> Output;
  
  Validator -> Calculator;
  Calculator -> Output;
  Config -> Calculator;
}

```text

*Key algorithms*:

- Boundary lookup: Binary search for efficient grade determination

- Batch processing: Handle multiple scores simultaneously

- Configuration validation: Ensure grade boundaries are logical

**Phase 4: Implementation Strategy**

*Development approach*:

1. Create grade boundary data structures

2. Implement single score conversion

3. Add batch processing capabilities

4. Develop configuration management

5. Build reporting and output formatting

*Quality assurance*:

- Unit tests for boundary edge cases

- Integration tests with real grade data

- User acceptance testing with teachers

- Performance testing with large score sets
///
///

This comprehensive practice progression builds from basic problem analysis through complete system development, preparing students for real-world software engineering challenges.


## Recap

The Software Development Lifecycle is your roadmap for building successful software:

**Start with understanding** - Talk to users and clearly define the problem before writing any code

**Plan what you'll build** - Write specific requirements for what the software must do and how it must perform

**Design the solution** - Plan the architecture and how different parts will work together

**Build incrementally** - Write code in small pieces, test each piece, and commit changes frequently

**Test thoroughly** - Check with normal inputs, edge cases, and invalid inputs

**Deploy and maintain** - Get the software to users and keep improving it over time

Remember: Start small, get feedback early, and iterate. The SDLC isn't a straight line - it's a cycle of continuous improvement.
