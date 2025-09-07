# 2.4 Structure charts; abstraction and refinement — Quiz

!!! quiz "Check your understanding"

    1. What is abstraction in software design?

        - Making code as complex as possible
        - Focusing on what something does rather than how it does it { data-correct }
        - Writing very detailed documentation
        - Using abstract data types only

    1. Which design approach starts with the big picture and breaks it into smaller pieces?

        - Bottom-up design
        - Top-down design { data-correct }
        - Inside-out design
        - Random design

    1. What is a major advantage of bottom-up design?

        - Always provides complete system overview
        - Guarantees all requirements are met
        - Builds on proven, working components { data-correct }
        - Eliminates the need for testing

    1. What do structure charts primarily show?

        - The sequence of algorithm steps
        - The hierarchy and data flow between modules { data-correct }
        - The user interface design
        - The database schema

    1. In stepwise refinement, what happens at each step?

        - The entire solution is rewritten
        - More detail is gradually added to the solution { data-correct }
        - Previous steps are discarded
        - Only the user interface is refined

    1. Which principle states that each module should do one thing well?

        - High coupling
        - Low cohesion
        - Single responsibility { data-correct }
        - Multiple inheritance

    1. What does "high cohesion" mean in module design?

        - Modules are tightly connected to each other
        - Everything within a module is closely related { data-correct }
        - Modules share many variables
        - Modules call each other frequently

    1. Consider this high-level algorithm:

        ```text
        ALGORITHM GradeProcessor
        BEGIN
            Read student data
            Calculate grades
            Generate reports
        END
        ```

        What would be the next step in stepwise refinement?

        - Write the complete Python code
        - Break each major step into more detailed sub-steps { data-correct }
        - Create a user interface
        - Test the algorithm

    1. Which of these is an example of poor module design?

        - ValidateEmailAddress(email) → boolean
        - CalculateGPA(grades) → gpa_value
        - DoEverything() → various_results { data-correct }
        - FormatCurrency(amount) → formatted_string

    1. What is the main benefit of modular design?

        - It makes programs run faster
        - It eliminates the need for documentation
        - It enables independent development and testing of components { data-correct }
        - It reduces the amount of code needed

    1. In a library management system, which modules would likely be at the same level in a structure chart?

        - "Main Program" and "Display Menu"
        - "Book Borrowing", "Book Returns", and "Generate Reports" { data-correct }
        - "Validate User" and "Main Program"
        - "Database Connection" and "User Interface"

    1. What does "low coupling" mean in module design?

        - Modules should share as many variables as possible
        - Modules should be as independent as possible { data-correct }
        - Modules should call each other frequently
        - Modules should have similar functionality

    1. Which approach would be best for creating a text editor using existing libraries for file operations, text formatting, and user interface?

        - Top-down design only
        - Bottom-up design only
        - Hybrid approach starting bottom-up { data-correct }
        - Random component assembly

    1. Complete this refinement step:

        ```text
        Step 1: Process student enrollment
        Step 2: ________________________________
        Step 3: - Validate student information
                - Check course availability  
                - Verify prerequisites
                - Update enrollment records
        ```

        - Write the complete code
        - Get student details; Check course requirements; Confirm enrollment { data-correct }
        - Create user interface; Design database; Test system
        - Deploy system; Train users; Monitor performance
