# Subprograms: Procedures and Functions

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Identify when to use procedures versus functions in algorithms
    - Understand parameters and how data is passed to subprograms
    - Recognize return values and their purpose in functions
    - Apply the principle of cohesion to create focused subprograms
    - Design algorithms using appropriate subprogram structures

## Introduction

**Subprograms** are named blocks of code that perform specific tasks. They are the building blocks that implement the modules identified in structure charts from Section 2.4.

There are two main types of subprograms:

- **Procedures**: Perform actions but don't return values

- **Functions**: Calculate and return values

Subprograms make algorithms more organized, reusable, and easier to understand by breaking complex problems into manageable pieces.

## Procedures vs Functions

### Procedures

**Procedures** are subprograms that perform actions or tasks. They execute a sequence of steps but don't return a value to the calling code.

**Characteristics:**

- Perform actions (display, save, modify data)

- Don't return values

- Focus on "doing" something

- May change the state of the program or external systems

**Common procedure purposes:**

- Display information to users

- Save data to files

- Update database records

- Print reports

- Initialize system settings

### Functions

**Functions** are subprograms that calculate and return a single value. They take input parameters, process them, and provide a result.

**Characteristics:**

- Calculate and return a value

- Should not change external state (pure functions)

- Focus on "computing" something

- Can be used in expressions and assignments

**Common function purposes:**

- Calculate mathematical results

- Convert between data formats

- Validate input data

- Determine true/false conditions

- Transform data from one form to another

### Comparison Example: Student Grade System

```kroki-plantuml
@startuml
package "Grade Processing System" {
  
  rectangle "Functions (Return Values)" {
    [CalculateAverage(scores)]
    [DetermineLetterGrade(average)]
    [CalculateGPA(letterGrade)]
    [ValidateScore(score)]
  }
  
  rectangle "Procedures (Perform Actions)" {
    [DisplayStudentReport(student, grades)]
    [SaveGradesToFile(filename, data)]
    [PrintTranscript(student)]
    [UpdateDatabase(student, grades)]
  }
  
  [Main Program] --> [CalculateAverage(scores)]
  [Main Program] --> [DetermineLetterGrade(average)]
  [Main Program] --> [DisplayStudentReport(student, grades)]
  [Main Program] --> [SaveGradesToFile(filename, data)]
  
  [CalculateAverage(scores)] --> [ValidateScore(score)]
  [DetermineLetterGrade(average)] --> [CalculateGPA(letterGrade)]
}
@enduml

```

## Parameters

**Parameters** are the input values that subprograms need to do their work. They allow subprograms to be flexible and work with different data.

### Parameter Types

/// details | Input Parameters
    type: note
    open: false

Data passed into the subprogram that it reads but doesn't change.

```
FUNCTION CalculateCircleArea(radius)
BEGIN
    SET area = 3.14159 * radius * radius
    RETURN area
END

```

///

/// details | Output Parameters
    type: note
    open: false

Variables that the subprogram modifies to send results back.

```
PROCEDURE GetStudentInfo(OUT studentName, OUT studentID, OUT age)
BEGIN
    OUTPUT "Enter student name:"
    INPUT studentName
    OUTPUT "Enter student ID:"
    INPUT studentID
    OUTPUT "Enter age:"
    INPUT age
END

```

///

/// details | Input/Output Parameters
    type: note
    open: false

Data that comes in, gets modified, and goes back out.

```
PROCEDURE UpdateGrade(IN_OUT student, newGrade)
BEGIN
    SET student.totalPoints = student.totalPoints + newGrade
    SET student.numAssignments = student.numAssignments + 1
    SET student.average = student.totalPoints / student.numAssignments
END

```

///

### Parameter Examples

**Function with Multiple Parameters:**

```
FUNCTION CalculateCompoundInterest(principal, rate, time, compoundFrequency)
BEGIN
    SET amount = principal * (1 + rate/compoundFrequency)^(compoundFrequency * time)
    RETURN amount
END

```

**Procedure with Mixed Parameters:**

```
PROCEDURE ProcessStudentGrades(IN studentList, IN assignmentScores, OUT finalGrades, OUT classAverage)
BEGIN
    SET totalGrades = 0
    SET studentCount = 0
    
    FOR EACH student IN studentList DO
        SET studentAverage = CalculateAverage(assignmentScores[student])
        SET letterGrade = DetermineLetterGrade(studentAverage)
        SET finalGrades[student] = letterGrade
        SET totalGrades = totalGrades + studentAverage
        SET studentCount = studentCount + 1
    END FOR
    
    SET classAverage = totalGrades / studentCount
END

```

## Return Values

**Return values** are the results that functions send back to the code that called them. Only functions have return values; procedures do not.

### Single Return Value

Most functions return one value:

```
FUNCTION IsEven(number)
BEGIN
    IF number MOD 2 = 0 THEN
        RETURN true
    ELSE
        RETURN false
    END IF
END

FUNCTION GetFileSize(filename)
BEGIN
    OPEN file filename
    SET size = count bytes in file
    CLOSE file
    RETURN size
END

```

### Using Return Values

Return values can be used in several ways:

**Assignment:**

```
SET average = CalculateAverage(scores)
SET isValid = ValidateEmail(emailAddress)

```

**Expressions:**

```
SET finalGrade = CalculateAverage(scores) * 0.8 + examScore * 0.2
IF ValidateInput(userInput) AND userInput > 0 THEN

```

**Nested Function Calls:**

```
SET letterGrade = DetermineLetterGrade(CalculateAverage(scores))
SET formatted = FormatCurrency(CalculateTotal(prices))

```

**Direct Output:**

```
OUTPUT "Your GPA is: " + CalculateGPA(grades)
OUTPUT "File size: " + GetFileSize("data.txt") + " bytes"

```

## Cohesion in Subprograms

**Cohesion** measures how closely related everything within a subprogram is. High cohesion means the subprogram does one thing well.

### Types of Cohesion (from best to worst)

/// details | Functional Cohesion (Best)
    type: note
    open: false

Everything contributes to a single, well-defined task.

```
✓ FUNCTION CalculateCircleArea(radius)
✓ PROCEDURE SaveStudentRecord(student)
✓ FUNCTION ValidateEmailAddress(email)

```

///

/// details | Sequential Cohesion
    type: note
    open: false

Elements are related because the output of one becomes the input of the next.

```
PROCEDURE ProcessOrderAndShip(order)
BEGIN
    ValidateOrder(order)          // Step 1
    CalculateTotal(order)         // Step 2 (uses validated order)
    ChargePayment(order.total)    // Step 3 (uses calculated total)
    ArrangeShipping(order)        // Step 4 (uses charged order)
END

```

///

/// details | Communicational Cohesion
    type: note
    open: false

Elements work on the same data.

```
PROCEDURE UpdateStudentRecord(student)
BEGIN
    ValidateStudentData(student)
    CalculateStudentGPA(student)
    FormatStudentReport(student)
END

```

///

/// details | Poor Cohesion Examples
    type: note
    open: false

**Temporal Cohesion (Poor)** - grouped only because they happen at the same time:

```
✗ PROCEDURE SystemStartup()
BEGIN
    InitializeDatabase()
    DisplayWelcomeMessage()
    CheckDiskSpace()
    LoadUserPreferences()
    StartBackgroundMusic()
END

```

**Logical Cohesion (Poor)** - grouped because they're similar but do different things:

```
✗ PROCEDURE HandleAllInputs(inputType, data)
BEGIN
    IF inputType = "keyboard" THEN
        ProcessKeyboardInput(data)
    ELSE IF inputType = "mouse" THEN
        ProcessMouseInput(data)
    ELSE IF inputType = "file" THEN
        ProcessFileInput(data)
    END IF
END

```

///

### Improving Cohesion

**Instead of one large subprogram:**

```
✗ PROCEDURE ProcessCompleteOrder(customer, items, paymentInfo)
BEGIN
    // Validate customer (20 lines)
    // Calculate item totals (15 lines)
    // Apply discounts (25 lines)
    // Process payment (30 lines)
    // Update inventory (20 lines)
    // Generate receipt (15 lines)
    // Send confirmation email (10 lines)
END

```

**Create focused subprograms:**

```
✓ FUNCTION ValidateCustomer(customer) → boolean
✓ FUNCTION CalculateOrderTotal(items) → amount
✓ FUNCTION ApplyDiscounts(customer, total) → discountedTotal
✓ FUNCTION ProcessPayment(paymentInfo, amount) → success
✓ PROCEDURE UpdateInventory(items)
✓ PROCEDURE GenerateReceipt(order)
✓ PROCEDURE SendConfirmationEmail(customer, order)

```

## Identifying Subprograms in Algorithms

### When to Create a Subprogram

**Create a function when you need to:**

- Calculate a value that might be used multiple times

- Perform a calculation that takes several steps

- Convert data from one format to another

- Check if a condition is true or false

**Create a procedure when you need to:**

- Display information to the user

- Save or retrieve data from files/databases

- Modify the state of the system

- Perform a sequence of related actions

### Example: Library Management System

Let's identify subprograms in a library system algorithm:

```
ALGORITHM LibraryManagement
BEGIN
    WHILE system is running DO
        DisplayMainMenu()                    // PROCEDURE
        SET choice = GetUserChoice()         // FUNCTION
        
        IF choice = "borrow" THEN
            SET cardNumber = GetCardNumber()          // FUNCTION
            SET isValid = ValidateLibraryCard(cardNumber)  // FUNCTION
            
            IF isValid THEN
                SET bookID = GetBookID()              // FUNCTION
                SET isAvailable = CheckBookAvailability(bookID)  // FUNCTION
                
                IF isAvailable THEN
                    ProcessBookBorrowing(cardNumber, bookID)  // PROCEDURE
                    DisplaySuccessMessage("Book borrowed successfully")  // PROCEDURE
                ELSE
                    DisplayErrorMessage("Book not available")  // PROCEDURE
                END IF
            ELSE
                DisplayErrorMessage("Invalid library card")  // PROCEDURE
            END IF
            
        ELSE IF choice = "return" THEN
            SET bookID = GetBookID()          // FUNCTION
            SET borrowRecord = FindBorrowRecord(bookID)  // FUNCTION
            
            IF borrowRecord exists THEN
                SET fine = CalculateLateFine(borrowRecord)  // FUNCTION
                ProcessBookReturn(borrowRecord, fine)       // PROCEDURE
                IF fine > 0 THEN
                    DisplayFineNotice(fine)                 // PROCEDURE
                END IF
            ELSE
                DisplayErrorMessage("No borrow record found")  // PROCEDURE
            END IF
            
        ELSE IF choice = "search" THEN
            SET searchTerm = GetSearchTerm()       // FUNCTION
            SET results = SearchBooks(searchTerm)  // FUNCTION
            DisplaySearchResults(results)         // PROCEDURE
            
        END IF
    END WHILE
END

```

### Structure Chart with Subprograms

```kroki-plantuml
@startuml
package "Library Management System" {
  [Main Controller] as main
  
  package "User Interface" {
    [DisplayMainMenu()]
    [GetUserChoice()]
    [GetCardNumber()]
    [GetBookID()]
    [GetSearchTerm()]
    [DisplaySuccessMessage()]
    [DisplayErrorMessage()]
    [DisplayFineNotice()]
    [DisplaySearchResults()]
  }
  
  package "Validation Functions" {
    [ValidateLibraryCard()]
    [CheckBookAvailability()]
    [FindBorrowRecord()]
  }
  
  package "Business Logic" {
    [ProcessBookBorrowing()]
    [ProcessBookReturn()]
    [CalculateLateFine()]
    [SearchBooks()]
  }
  
  package "Data Access" {
    [ReadCardData()]
    [ReadBookData()]
    [UpdateBorrowRecord()]
    [UpdateBookStatus()]
  }
}

main --> [DisplayMainMenu()]
main --> [GetUserChoice()]
main --> [ValidateLibraryCard()]
main --> [ProcessBookBorrowing()]

[ValidateLibraryCard()] --> [ReadCardData()]
[CheckBookAvailability()] --> [ReadBookData()]
[ProcessBookBorrowing()] --> [UpdateBorrowRecord()]
[ProcessBookBorrowing()] --> [UpdateBookStatus()]
[ProcessBookReturn()] --> [UpdateBorrowRecord()]
[ProcessBookReturn()] --> [UpdateBookStatus()]
@enduml

```

## Design Guidelines for Subprograms

### Function Design Guidelines

1. **Single Purpose**: Each function should calculate one specific thing

2. **Pure Functions**: Avoid side effects when possible

3. **Meaningful Names**: Name should clearly indicate what it calculates

4. **Reasonable Size**: Generally 10-20 lines of pseudocode

5. **Clear Return Type**: Always return the same type of data

**Good Function Examples:**

```
✓ FUNCTION CalculateAge(birthDate, currentDate) → integer
✓ FUNCTION IsValidEmail(emailString) → boolean
✓ FUNCTION ConvertCelsiusToFahrenheit(celsius) → real
✓ FUNCTION CountWordsInText(text) → integer

```

### Procedure Design Guidelines

1. **Clear Action**: Name should be a verb describing what it does

2. **Focused Task**: Should perform one logical sequence of actions

3. **Appropriate Parameters**: Only pass what's needed for the task

4. **Error Handling**: Check for and handle error conditions

5. **User Feedback**: Provide appropriate messages when necessary

**Good Procedure Examples:**

```
✓ PROCEDURE SaveStudentRecord(student, filename)
✓ PROCEDURE DisplayWelcomeMessage(userName)
✓ PROCEDURE BackupDatabase(sourceDB, backupLocation)
✓ PROCEDURE SendEmailNotification(recipient, subject, message)

```

## Practice Activity: Student Grade Calculator

Let's design a complete student grade calculator using appropriate subprograms:

### Requirements

1. Read student information and assignment scores

2. Calculate various grade statistics

3. Determine letter grades and GPA

4. Display individual and class reports

5. Save results to a file

### Your Task: Complete the Subprogram Design

**Main Algorithm:**

```
ALGORITHM StudentGradeCalculator
BEGIN
    SET students = LoadStudentData()
    SET assignments = LoadAssignmentData()
    
    FOR EACH student IN students DO
        SET average = _______________  // Function call
        SET letterGrade = _______________  // Function call
        SET gpa = _______________  // Function call
        _______________  // Procedure call to display individual report
    END FOR
    
    SET classAverage = _______________  // Function call
    _______________  // Procedure call to display class summary
    _______________  // Procedure call to save results
END

```

**Identify the missing subprograms:**

1. What function calculates a student's average score?

2. What function determines the letter grade from an average?

3. What function converts a letter grade to GPA points?

4. What procedure displays an individual student report?

5. What function calculates the class average?

6. What procedure displays the class summary?

7. What procedure saves results to a file?

### Solution

**Complete Algorithm with Subprograms:**

```
ALGORITHM StudentGradeCalculator
BEGIN
    SET students = LoadStudentData()
    SET assignments = LoadAssignmentData()
    
    FOR EACH student IN students DO
        SET average = CalculateStudentAverage(student.scores)
        SET letterGrade = DetermineLetterGrade(average)
        SET gpa = ConvertGradeToGPA(letterGrade)
        DisplayStudentReport(student.name, average, letterGrade, gpa)
    END FOR
    
    SET classAverage = CalculateClassAverage(students)
    DisplayClassSummary(students, classAverage)
    SaveResultsToFile(students, "grade_report.txt")
END

FUNCTION CalculateStudentAverage(scores)
BEGIN
    SET total = 0
    FOR EACH score IN scores DO
        SET total = total + score
    END FOR
    RETURN total / length of scores
END

FUNCTION DetermineLetterGrade(average)
BEGIN
    IF average >= 90 THEN
        RETURN "A"
    ELSE IF average >= 80 THEN
        RETURN "B"
    ELSE IF average >= 70 THEN
        RETURN "C"
    ELSE IF average >= 60 THEN
        RETURN "D"
    ELSE
        RETURN "F"
    END IF
END

FUNCTION ConvertGradeToGPA(letterGrade)
BEGIN
    IF letterGrade = "A" THEN
        RETURN 4.0
    ELSE IF letterGrade = "B" THEN
        RETURN 3.0
    ELSE IF letterGrade = "C" THEN
        RETURN 2.0
    ELSE IF letterGrade = "D" THEN
        RETURN 1.0
    ELSE
        RETURN 0.0
    END IF
END

PROCEDURE DisplayStudentReport(name, average, letterGrade, gpa)
BEGIN
    OUTPUT "Student: " + name
    OUTPUT "Average: " + average
    OUTPUT "Letter Grade: " + letterGrade
    OUTPUT "GPA: " + gpa
    OUTPUT "------------------------"
END

FUNCTION CalculateClassAverage(students)
BEGIN
    SET total = 0
    FOR EACH student IN students DO
        SET studentAvg = CalculateStudentAverage(student.scores)
        SET total = total + studentAvg
    END FOR
    RETURN total / length of students
END

PROCEDURE DisplayClassSummary(students, classAverage)
BEGIN
    OUTPUT "Class Summary"
    OUTPUT "Number of students: " + length of students
    OUTPUT "Class average: " + classAverage
    // Additional statistics could be added here
END

PROCEDURE SaveResultsToFile(students, filename)
BEGIN
    OPEN file filename for writing
    FOR EACH student IN students DO
        SET average = CalculateStudentAverage(student.scores)
        SET letterGrade = DetermineLetterGrade(average)
        WRITE student.name + "," + average + "," + letterGrade to file
    END FOR
    CLOSE file
END

```

## Common Subprogram Patterns

### Input Validation Functions

```
FUNCTION IsValidAge(age)
BEGIN
    RETURN (age >= 0) AND (age <= 150)
END

FUNCTION IsValidEmail(email)
BEGIN
    RETURN email contains "@" AND email contains "."
END

FUNCTION IsInRange(value, minimum, maximum)
BEGIN
    RETURN (value >= minimum) AND (value <= maximum)
END

```

### Data Transformation Functions

```
FUNCTION FormatPhoneNumber(phoneNumber)
BEGIN
    // Remove non-digits
    SET digits = ExtractDigits(phoneNumber)
    // Format as (xxx) xxx-xxxx
    RETURN "(" + digits[0:3] + ") " + digits[3:6] + "-" + digits[6:10]
END

FUNCTION CapitalizeWords(text)
BEGIN
    SET words = SplitIntoWords(text)
    FOR EACH word IN words DO
        SET word = CapitalizeFirstLetter(word)
    END FOR
    RETURN JoinWords(words)
END

```

### Calculation Functions

```
FUNCTION CalculateDistance(x1, y1, x2, y2)
BEGIN
    SET deltaX = x2 - x1
    SET deltaY = y2 - y1
    RETURN SquareRoot(deltaX * deltaX + deltaY * deltaY)
END

FUNCTION CalculateCompoundInterest(principal, rate, compoundTimes, years)
BEGIN
    SET amount = principal * (1 + rate/compoundTimes) ^ (compoundTimes * years)
    RETURN amount - principal
END

```


## Summary

**Subprograms organize algorithms into manageable, reusable components:**

**Procedures vs Functions:**

- **Procedures** perform actions and don't return values

- **Functions** calculate and return single values

- Choose based on whether you need a result or an action

**Parameters and Return Values:**

- **Parameters** provide input data to subprograms

- **Return values** send calculated results back from functions

- Use appropriate parameter types (IN, OUT, IN_OUT) for data flow

**Cohesion:**

- **High cohesion** means everything in a subprogram works toward one goal

- **Functional cohesion** is ideal - one clear, focused purpose

- Avoid grouping unrelated tasks in the same subprogram

**Design Guidelines:**

- **Single responsibility** - each subprogram does one thing well

- **Meaningful names** that clearly indicate purpose

- **Appropriate size** - not too complex or too trivial

- **Clear interfaces** with well-defined parameters and returns

**Benefits:**

- **Modularity** enables independent development and testing

- **Reusability** reduces code duplication

- **Maintainability** localizes changes and updates

- **Readability** makes algorithms easier to understand
