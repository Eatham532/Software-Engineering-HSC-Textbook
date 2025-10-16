---
title: "02.05 Subprograms Procedures And Functions - Quiz"
---

# 02.05 Subprograms Procedures And Functions - Quiz

!!! quiz "Check your understanding"

    1. What is the main difference between procedures and functions?

        - Procedures are faster than functions
        - Functions return values, procedures do not { data-correct }
        - Procedures can have parameters, functions cannot
        - Functions are always more complex than procedures

    2. Which of these would be better implemented as a function rather than a procedure?

        - Display a welcome message to the user
        - Save student data to a file
        - Calculate the average of a list of numbers { data-correct }
        - Print a report to the printer

    3. What does "high cohesion" mean in subprogram design?

        - The subprogram calls many other subprograms
        - Everything within the subprogram is closely related to one purpose { data-correct }
        - The subprogram has many parameters
        - The subprogram is very long and complex

    4. Complete this function signature: `FUNCTION CalculateCircleArea(radius) → ?` What should the return type be?

        - boolean
        - string
        - real/float { data-correct }
        - integer

    5. Which parameter type allows a subprogram to modify a value and send it back?

        - IN parameter
        - OUT parameter
        - IN_OUT parameter { data-correct }
        - RETURN parameter

    6. What's wrong with this subprogram design? (It violates the single responsibility principle)

        - It has too many parameters
        - It violates the single responsibility principle { data-correct }
        - It should be a function instead
        - It needs more error checking

    7. Which of these function calls demonstrates nested function usage?

        - SET grade = CalculateGrade(scores); SET gpa = ConvertToGPA(grade)
        - SET gpa = ConvertToGPA(CalculateGrade(scores)) { data-correct }
        - CalculateGrade(scores) + ConvertToGPA(grade)
        - CALL CalculateGrade THEN CALL ConvertToGPA

    8. What type of cohesion is demonstrated in the ValidateEmailAddress function?

        - Temporal cohesion
        - Logical cohesion
        - Functional cohesion { data-correct }
        - Sequential cohesion

    9. Complete the algorithm: What should go in the blank after calculating average and letter grade?

        - RETURN letterGrade
        - SET result = letterGrade
        - DisplayStudentReport(student.name, average, letterGrade) { data-correct }
        - INPUT nextStudent

    10. Which is the best function design for calculating compound interest?

        - FUNCTION Calculate() → real
        - FUNCTION CompoundInterest(p, r, t) → real
        - FUNCTION CalculateCompoundInterest(principal, rate, time, compoundFrequency) → real { data-correct }
        - FUNCTION CI(a, b, c, d) → real

    11. When should you create a function instead of doing the calculation inline?

        - Only when the calculation is very simple
        - When the calculation might be used multiple times or is complex { data-correct }
        - Never - inline calculations are always better
        - Only when working with numbers

    12. What's the best way to handle: "Get user input, validate it, and display an error message if invalid"?

        - One large procedure that does everything
        - FUNCTION GetUserInput() + FUNCTION ValidateInput() + PROCEDURE DisplayError() { data-correct }
        - FUNCTION DoInputValidation() only
        - Three separate programs

    13. Which parameter usage is correct for the UpdateStudentRecord procedure?

        - IN studentID, IN studentData, IN status
        - OUT studentID, IN studentData, OUT status
        - IN studentID, IN studentData, OUT status { data-correct }
        - IN_OUT studentID, IN_OUT studentData, IN_OUT status

    14. What makes the IsValidAge function well-designed?

        - It's very short
        - It has a single, clear purpose and meaningful name { data-correct }
        - It uses complex logic
        - It doesn't need parameters
