# Analysing Written Algorithms (Logic and Structure)

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Determine the inputs and outputs of given algorithms
    - Identify the purpose of written algorithms
    - Perform desk checking and peer checking on provided code
    - Identify connections between subroutines and functions
    - Recognize procedures and functions within algorithm structures
    - Analyze the overall logic and flow of complex algorithms

## Introduction

**Algorithm analysis** is the skill of examining existing code or pseudocode to understand how it works, what it does, and how its parts connect together. This is essential for:

- **Understanding** code written by others

- **Debugging** problems in existing systems

- **Maintaining** and updating software

- **Learning** from well-designed algorithms

- **Code reviews** and quality assurance

This section brings together all the analysis techniques from previous sections to systematically examine complete algorithms.

## Systematic Analysis Approach

When analyzing an algorithm, follow this systematic approach:

1. **Read through completely** - Get the big picture first

2. **Identify inputs and outputs** - What goes in, what comes out

3. **Determine the purpose** - What problem does it solve

4. **Map the structure** - Identify subprograms and their relationships

5. **Trace the logic** - Desk check key scenarios

6. **Verify correctness** - Check if it meets its purpose

## Example Algorithm: Student Course Management System

Let's analyze this complete algorithm step by step:

```text
ALGORITHM StudentCourseManagement
BEGIN
    WHILE systemRunning = true DO
        SET choice = DisplayMenuAndGetChoice()
        
        IF choice = "enroll" THEN
            SET studentID = GetStudentID()
            SET courseCode = GetCourseCode()
            SET canEnroll = CheckEnrollmentEligibility(studentID, courseCode)
            
            IF canEnroll = true THEN
                ProcessEnrollment(studentID, courseCode)
                DisplayConfirmation("Enrollment successful")
            ELSE
                SET reason = GetEnrollmentBlockReason(studentID, courseCode)
                DisplayError("Cannot enroll: " + reason)
            END IF
            
        ELSE IF choice = "withdraw" THEN
            SET studentID = GetStudentID()
            SET courseCode = GetCourseCode()
            SET isEnrolled = CheckCurrentEnrollment(studentID, courseCode)
            
            IF isEnrolled = true THEN
                SET withdrawalAllowed = CheckWithdrawalDeadline(courseCode)
                IF withdrawalAllowed = true THEN
                    ProcessWithdrawal(studentID, courseCode)
                    DisplayConfirmation("Withdrawal successful")
                ELSE
                    DisplayError("Withdrawal deadline has passed")
                END IF
            ELSE
                DisplayError("Student not enrolled in this course")
            END IF
            
        ELSE IF choice = "viewEnrollments" THEN
            SET studentID = GetStudentID()
            SET enrollments = GetStudentEnrollments(studentID)
            DisplayEnrollmentList(enrollments)
            
        ELSE IF choice = "exit" THEN
            SET systemRunning = false
            
        END IF
    END WHILE
END

FUNCTION DisplayMenuAndGetChoice()
BEGIN
    OUTPUT "1. Enroll in course"
    OUTPUT "2. Withdraw from course"
    OUTPUT "3. View enrollments"
    OUTPUT "4. Exit"
    OUTPUT "Enter choice: "
    INPUT userChoice
    RETURN ConvertChoiceToAction(userChoice)
END

FUNCTION GetStudentID()
BEGIN
    OUTPUT "Enter student ID: "
    INPUT id
    WHILE NOT IsValidStudentID(id) DO
        OUTPUT "Invalid ID. Enter student ID: "
        INPUT id
    END WHILE
    RETURN id
END

FUNCTION GetCourseCode()
BEGIN
    OUTPUT "Enter course code: "
    INPUT code
    WHILE NOT IsValidCourseCode(code) DO
        OUTPUT "Invalid code. Enter course code: "
        INPUT code
    END WHILE
    RETURN code
END

FUNCTION CheckEnrollmentEligibility(studentID, courseCode)
BEGIN
    SET hasPrerequisites = CheckPrerequisites(studentID, courseCode)
    SET hasCapacity = CheckCourseCapacity(courseCode)
    SET noConflicts = CheckScheduleConflicts(studentID, courseCode)
    SET notAlreadyEnrolled = NOT CheckCurrentEnrollment(studentID, courseCode)
    
    RETURN hasPrerequisites AND hasCapacity AND noConflicts AND notAlreadyEnrolled
END

PROCEDURE ProcessEnrollment(studentID, courseCode)
BEGIN
    AddToEnrollmentDatabase(studentID, courseCode)
    UpdateCourseCapacity(courseCode)
    SendEnrollmentNotification(studentID, courseCode)
END

FUNCTION GetEnrollmentBlockReason(studentID, courseCode)
BEGIN
    IF NOT CheckPrerequisites(studentID, courseCode) THEN
        RETURN "Missing prerequisites"
    ELSE IF NOT CheckCourseCapacity(courseCode) THEN
        RETURN "Course is full"
    ELSE IF NOT CheckScheduleConflicts(studentID, courseCode) THEN
        RETURN "Schedule conflict"
    ELSE IF CheckCurrentEnrollment(studentID, courseCode) THEN
        RETURN "Already enrolled"
    ELSE
        RETURN "Unknown reason"
    END IF
END
```

## Step 1: Identify Inputs and Outputs

### External Inputs (from users)

- **User menu choice** (1-4)

- **Student ID** (for all operations)

- **Course code** (for enrollment and withdrawal)

### External Outputs (to users)

- **Menu display** showing available options

- **Confirmation messages** for successful operations

- **Error messages** when operations fail

- **Enrollment lists** showing student's current courses

### Internal Data Flow

- **Function returns** passing data between subprograms

- **Database updates** storing enrollment changes

- **Validation results** controlling program flow

| Input Type | Source | Used By |
|------------|--------|---------|
| Menu choice | User keyboard | Main algorithm logic |
| Student ID | User keyboard | All enrollment operations |
| Course code | User keyboard | Enrollment/withdrawal operations |
| Database records | File/database system | Validation functions |

| Output Type | Destination | Purpose |
|-------------|-------------|---------|
| Menu options | User screen | Guide user choices |
| Success messages | User screen | Confirm completed actions |
| Error messages | User screen | Explain why actions failed |
| Enrollment data | Database system | Persist changes |

## Step 2: Determine the Purpose

**Primary Purpose:** Manage student course enrollments and withdrawals with validation and error handling.

**Specific Functions:**

- Allow students to enroll in courses (with eligibility checking)

- Allow students to withdraw from courses (with deadline checking)

- Display current enrollments for students

- Validate all inputs and provide clear feedback

- Maintain data integrity through proper database updates

## Step 3: Map the Structure

### Subprogram Identification

```kroki-plantuml
@startuml
package "Student Course Management System" {
  
  [Main Algorithm] as main
  
  package "User Interface Functions" {
    [DisplayMenuAndGetChoice()]
    [GetStudentID()]
    [GetCourseCode()]
    [DisplayConfirmation()]
    [DisplayError()]
    [DisplayEnrollmentList()]
  }
  
  package "Validation Functions" {
    [IsValidStudentID()]
    [IsValidCourseCode()]
    [CheckEnrollmentEligibility()]
    [CheckCurrentEnrollment()]
    [CheckWithdrawalDeadline()]
    [CheckPrerequisites()]
    [CheckCourseCapacity()]
    [CheckScheduleConflicts()]
  }
  
  package "Business Logic" {
    [ProcessEnrollment()]
    [ProcessWithdrawal()]
    [GetEnrollmentBlockReason()]
    [GetStudentEnrollments()]
  }
  
  package "Data Access" {
    [AddToEnrollmentDatabase()]
    [UpdateCourseCapacity()]
    [SendEnrollmentNotification()]
    [ConvertChoiceToAction()]
  }
}

main --> [DisplayMenuAndGetChoice()]
main --> [GetStudentID()]
main --> [CheckEnrollmentEligibility()]
main --> [ProcessEnrollment()]

[CheckEnrollmentEligibility()] --> [CheckPrerequisites()]
[CheckEnrollmentEligibility()] --> [CheckCourseCapacity()]
[CheckEnrollmentEligibility()] --> [CheckScheduleConflicts()]
[CheckEnrollmentEligibility()] --> [CheckCurrentEnrollment()]

[ProcessEnrollment()] --> [AddToEnrollmentDatabase()]
[ProcessEnrollment()] --> [UpdateCourseCapacity()]
[ProcessEnrollment()] --> [SendEnrollmentNotification()]
@enduml
```

### Functions vs Procedures Classification

**Functions (return values):**

- `DisplayMenuAndGetChoice()` → string (user's choice)

- `GetStudentID()` → string (validated student ID)

- `GetCourseCode()` → string (validated course code)

- `CheckEnrollmentEligibility()` → boolean (can enroll or not)

- `CheckCurrentEnrollment()` → boolean (is enrolled or not)

- `CheckWithdrawalDeadline()` → boolean (can withdraw or not)

- `GetEnrollmentBlockReason()` → string (reason for denial)

- `GetStudentEnrollments()` → list (current enrollments)

**Procedures (perform actions):**

- `ProcessEnrollment()` - updates database and sends notifications

- `ProcessWithdrawal()` - removes enrollment and updates records

- `DisplayConfirmation()` - shows success message

- `DisplayError()` - shows error message

- `DisplayEnrollmentList()` - shows enrollment data

## Step 4: Trace the Logic (Desk Checking)

### Scenario 1: Successful Enrollment

**Inputs:**

- Menu choice: "1" (enroll)

- Student ID: "S12345" 

- Course code: "CS101"

**Trace Table:**

| Step | Action | Variables | Function Calls | Result |
|------|--------|-----------|----------------|---------|
| 1 | Display menu, get choice | choice = "enroll" | DisplayMenuAndGetChoice() | "enroll" |
| 2 | Enter enrollment branch | - | - | - |
| 3 | Get student ID | studentID = "S12345" | GetStudentID() | "S12345" |
| 4 | Get course code | courseCode = "CS101" | GetCourseCode() | "CS101" |
| 5 | Check eligibility | canEnroll = ? | CheckEnrollmentEligibility("S12345", "CS101") | true |
| 6 | Eligibility = true, process | - | ProcessEnrollment("S12345", "CS101") | - |
| 7 | Show confirmation | - | DisplayConfirmation("Enrollment successful") | - |

**Expected Output:** "Enrollment successful"

### Scenario 2: Failed Enrollment (Course Full)

**Inputs:**

- Menu choice: "1" (enroll)

- Student ID: "S67890"

- Course code: "CS101" (assume course is full)

**Trace Table:**

| Step | Action | Variables | Function Calls | Result |
|------|--------|-----------|----------------|---------|
| 1 | Display menu, get choice | choice = "enroll" | DisplayMenuAndGetChoice() | "enroll" |
| 2 | Get student ID | studentID = "S67890" | GetStudentID() | "S67890" |
| 3 | Get course code | courseCode = "CS101" | GetCourseCode() | "CS101" |
| 4 | Check eligibility | canEnroll = false | CheckEnrollmentEligibility("S67890", "CS101") | false |
| 5 | Get block reason | reason = "Course is full" | GetEnrollmentBlockReason("S67890", "CS101") | "Course is full" |
| 6 | Show error | - | DisplayError("Cannot enroll: Course is full") | - |

**Expected Output:** "Cannot enroll: Course is full"

## Step 5: Analyze Subprogram Connections

### Data Dependencies

**CheckEnrollmentEligibility depends on:**

- `CheckPrerequisites()` - needs student and course data

- `CheckCourseCapacity()` - needs current enrollment count

- `CheckScheduleConflicts()` - needs student's current schedule

- `CheckCurrentEnrollment()` - needs enrollment records

**ProcessEnrollment depends on:**

- `AddToEnrollmentDatabase()` - stores enrollment record

- `UpdateCourseCapacity()` - adjusts available spots

- `SendEnrollmentNotification()` - informs student/faculty

### Control Flow Dependencies

```kroki-plantuml
@startuml
start
:Get user choice;
if (choice = "enroll"?) then (yes)
  :Get student and course info;
  if (CheckEnrollmentEligibility()?) then (yes)
    :ProcessEnrollment();
    :Display success;
  else (no)
    :GetEnrollmentBlockReason();
    :Display error;
  endif
elseif (choice = "withdraw"?) then (yes)
  :Get student and course info;
  if (CheckCurrentEnrollment()?) then (yes)
    if (CheckWithdrawalDeadline()?) then (yes)
      :ProcessWithdrawal();
      :Display success;
    else (no)
      :Display deadline error;
    endif
  else (no)
    :Display not enrolled error;
  endif
elseif (choice = "viewEnrollments"?) then (yes)
  :Get student info;
  :GetStudentEnrollments();
  :DisplayEnrollmentList();
else (choice = "exit")
  :Exit system;
endif
stop
@enduml
```

## Step 6: Identify Design Patterns

### Input Validation Pattern

```text
FUNCTION GetStudentID()
BEGIN
    OUTPUT "Enter student ID: "
    INPUT id
    WHILE NOT IsValidStudentID(id) DO
        OUTPUT "Invalid ID. Enter student ID: "
        INPUT id
    END WHILE
    RETURN id
END
```

**Pattern:** Keep asking until valid input is received
**Benefits:** Ensures data quality, prevents crashes from bad input

### Multi-Condition Validation Pattern

```text
FUNCTION CheckEnrollmentEligibility(studentID, courseCode)
BEGIN
    SET hasPrerequisites = CheckPrerequisites(studentID, courseCode)
    SET hasCapacity = CheckCourseCapacity(courseCode)
    SET noConflicts = CheckScheduleConflicts(studentID, courseCode)
    SET notAlreadyEnrolled = NOT CheckCurrentEnrollment(studentID, courseCode)
    
    RETURN hasPrerequisites AND hasCapacity AND noConflicts AND notAlreadyEnrolled
END
```

**Pattern:** Break complex conditions into readable boolean variables
**Benefits:** Easier to understand, debug, and modify

### Error Handling with Specific Messages Pattern

```text
FUNCTION GetEnrollmentBlockReason(studentID, courseCode)
BEGIN
    IF NOT CheckPrerequisites(studentID, courseCode) THEN
        RETURN "Missing prerequisites"
    ELSE IF NOT CheckCourseCapacity(courseCode) THEN
        RETURN "Course is full"
    // ... more specific checks
END
```

**Pattern:** Provide specific error messages for different failure conditions
**Benefits:** Users understand exactly what went wrong and how to fix it

## Practice Activity: Library Book Reservation System

Analyze this algorithm following the systematic approach:

```text
ALGORITHM LibraryBookReservation
BEGIN
    SET choice = GetUserChoice()
    
    IF choice = "reserve" THEN
        SET userID = GetLibraryCardNumber()
        SET bookISBN = GetBookISBN()
        SET canReserve = CheckReservationEligibility(userID, bookISBN)
        
        IF canReserve = true THEN
            SET reservationID = CreateReservation(userID, bookISBN)
            NotifyUser("Reservation created: " + reservationID)
        ELSE
            SET blockReason = GetReservationBlockReason(userID, bookISBN)
            NotifyUser("Cannot reserve: " + blockReason)
        END IF
        
    ELSE IF choice = "cancel" THEN
        SET reservationID = GetReservationID()
        SET exists = CheckReservationExists(reservationID)
        
        IF exists = true THEN
            CancelReservation(reservationID)
            NotifyUser("Reservation cancelled successfully")
        ELSE
            NotifyUser("Reservation not found")
        END IF
    END IF
END

FUNCTION CheckReservationEligibility(userID, bookISBN)
BEGIN
    SET validUser = IsValidLibraryCard(userID)
    SET bookExists = BookExistsInCatalog(bookISBN)
    SET notOverLimit = CheckReservationLimit(userID)
    SET bookAvailable = IsBookAvailableForReservation(bookISBN)
    
    RETURN validUser AND bookExists AND notOverLimit AND bookAvailable
END

FUNCTION CreateReservation(userID, bookISBN)
BEGIN
    SET reservationID = GenerateReservationID()
    AddToReservationDatabase(reservationID, userID, bookISBN)
    UpdateBookStatus(bookISBN, "reserved")
    SendReservationEmail(userID, reservationID)
    RETURN reservationID
END
```

### Your Analysis Tasks:

1. **Identify all inputs and outputs**

2. **Determine the algorithm's purpose**

3. **List all functions and procedures**

4. **Desk check a successful reservation scenario**

5. **Identify the subprogram connections**

### Solution:

**1. Inputs and Outputs:**

| Inputs | Source | Outputs | Destination |
|--------|--------|---------|-------------|
| User choice | Keyboard | Reservation ID | Screen |
| Library card number | Keyboard | Success/error messages | Screen |
| Book ISBN | Keyboard | Email notifications | Email system |
| Reservation ID | Keyboard | Database updates | Database |

**2. Purpose:** 
Allow library users to reserve available books and cancel existing reservations with proper validation and notification.

**3. Functions vs Procedures:**

**Functions:**

- `GetUserChoice()` → string

- `GetLibraryCardNumber()` → string  

- `GetBookISBN()` → string

- `GetReservationID()` → string

- `CheckReservationEligibility()` → boolean

- `CheckReservationExists()` → boolean

- `CreateReservation()` → string (reservation ID)

- `GetReservationBlockReason()` → string

**Procedures:**

- `NotifyUser()` - displays messages

- `CancelReservation()` - removes reservation

- `AddToReservationDatabase()` - stores data

- `UpdateBookStatus()` - changes book state

- `SendReservationEmail()` - sends notification

**4. Desk Check (Successful Reservation):**

| Step | Action | Result |
|------|--------|---------|
| 1 | GetUserChoice() | "reserve" |
| 2 | GetLibraryCardNumber() | "L12345" |
| 3 | GetBookISBN() | "978-1234567890" |
| 4 | CheckReservationEligibility() | true |
| 5 | CreateReservation() | "R2023001" |
| 6 | NotifyUser() | "Reservation created: R2023001" |

**5. Subprogram Connections:**

- Main algorithm calls UI functions for input

- CheckReservationEligibility calls multiple validation functions

- CreateReservation calls database and notification procedures

- Error path uses GetReservationBlockReason for specific messages

## Common Analysis Challenges

### Challenge 1: Complex Nested Logic

When algorithms have deep nesting, create a simplified flow diagram first:

```text
Main → Get Input → Validate → If Valid: Process → Success
                           → If Invalid: Get Reason → Error
```

### Challenge 2: Many Subprograms

Group related subprograms by purpose:

- **Input/Output**: User interface functions

- **Validation**: Checking functions  

- **Business Logic**: Core processing procedures

- **Data Access**: Database functions

### Challenge 3: Unclear Data Flow

Trace one piece of data through the entire system:

- Where does it come from?

- Which functions modify it?

- Where does it go?

## Summary

**Systematic algorithm analysis reveals structure and behavior:**

**Analysis Steps:**

1. **Read completely** to understand the big picture

2. **Identify inputs/outputs** to understand data flow

3. **Determine purpose** to understand the problem being solved

4. **Map structure** to see how parts connect

5. **Trace logic** to verify correctness

6. **Check design** for patterns and quality

**Key Analysis Skills:**

- **Pattern recognition** - identifying common design approaches

- **Data flow tracing** - following information through the system

- **Control flow mapping** - understanding decision logic

- **Subprogram classification** - distinguishing functions from procedures

**Analysis Benefits:**

- **Understanding** existing code for maintenance

- **Learning** from well-designed algorithms

- **Debugging** by identifying logic flaws

- **Quality assurance** through systematic review

**Integration of Previous Concepts:**

- Uses **I/O analysis** from Section 2.2

- Applies **desk checking** techniques

- Leverages **structure charts** understanding from Section 2.4

- Builds on **subprogram knowledge** from Section 2.5

!!! tip "Cross-reference"
    This section synthesizes analysis techniques from Sections 2.2 (I/O and checking), 2.4 (structure charts), and 2.5 (subprograms) to provide comprehensive algorithm analysis skills.

!!! tip "Next Section"
    In Section 2.7, we'll briefly explore different programming paradigms to understand various approaches to algorithm design.
