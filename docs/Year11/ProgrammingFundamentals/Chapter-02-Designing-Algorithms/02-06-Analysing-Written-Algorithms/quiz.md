---
title: "02.06 Analysing Written Algorithms - Quiz"
---

# 02.06 Analysing Written Algorithms - Quiz

!!! quiz "Check your understanding"

    1. What should you do FIRST when analyzing a written algorithm?

        - Start desk checking with sample data
        - Identify all the functions and procedures
        - Read through the complete algorithm to get the big picture { data-correct }
        - Look for syntax errors

    2. Analyze the ProcessOrder function. What are the inputs to this algorithm?

        - customerID only
        - items only
        - customerID and items { data-correct }
        - total, discount, and finalAmount

    3. In the ProcessOrder function, what is the output?

        - The confirmation email
        - The finalAmount value { data-correct }
        - The updated inventory
        - All of the above

    4. Which of these is a procedure (not a function) in the ProcessOrder algorithm?

        - CalculateTotal(items)
        - GetCustomerDiscount(customerID)
        - UpdateInventory(items) { data-correct }
        - ProcessOrder(customerID, items)

    5. What is the purpose of the PasswordStrengthChecker algorithm?

        - Generate a secure password
        - Evaluate and score password strength based on multiple criteria { data-correct }
        - Encrypt a password for storage
        - Check if a password matches stored credentials

    6. In the PasswordStrengthChecker algorithm, desk check with password = "Hello123!". What will be the final score?

        - 3/5
        - 4/5
        - 5/5 { data-correct }
        - 2/5

    7. What type of relationship exists between subprograms in CheckEnrollmentEligibility?

        - Sequential dependency
        - Parallel processing
        - Hierarchical dependency { data-correct }
        - No relationship

    8. Analyze the GetValidAge function. What design pattern is being used?

        - Error handling pattern
        - Input validation pattern { data-correct }
        - Data transformation pattern
        - Calculation pattern

    9. In StudentGradeProcessor, what connects the subprograms together?

        - Shared variables only
        - Function return values and procedure parameters { data-correct }
        - Database connections
        - Global constants

    10. What is the main weakness in the DoStudentProcessing procedure?

        - Too many parameters
        - Poor cohesion - does too many unrelated things { data-correct }
        - Should be a function instead of procedure
        - Missing error checking

    11. When desk checking CalculateDiscount with customerType = "premium" and orderAmount = 150, what would be the final discount?

        - 0.15
        - 0.20 { data-correct }
        - 0.10
        - 0.05

    12. Which analysis technique would be most helpful for understanding the ComplexInventorySystem algorithm?

        - Create a simplified flow diagram first { data-correct }
        - Start with detailed desk checking
        - Count the number of functions
        - Look for syntax errors

    13. What would be the most systematic way to analyze data flow in a large algorithm?

        - Trace one piece of data through the entire system { data-correct }
        - List all variables in alphabetical order
        - Count how many times each function is called
        - Check for spelling mistakes in variable names

    14. What is the benefit of grouping subprograms by purpose during analysis?

        - It makes the code run faster
        - It helps understand the system architecture and relationships { data-correct }
        - It reduces the number of functions needed
        - It eliminates the need for documentation
