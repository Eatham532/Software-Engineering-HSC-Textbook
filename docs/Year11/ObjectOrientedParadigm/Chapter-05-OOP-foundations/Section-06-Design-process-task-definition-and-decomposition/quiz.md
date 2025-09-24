# 5.6 Design process: task definition and decomposition - Quiz

!!! quiz "Check your understanding"

    1. What is the correct order of the object-oriented design process?

        - Implementation → Requirements → Responsibilities → Collaborations
        - Requirements → Responsibilities → Collaborations → Implementation { data-correct }
        - Collaborations → Requirements → Implementation → Responsibilities
        - Requirements → Implementation → Collaborations → Responsibilities

    2. What are responsibilities in object-oriented design?

        - The people who will use the system
        - The specific tasks that need to be performed to fulfill requirements { data-correct }
        - The hardware requirements for the system
        - The programming languages to be used

    3. Which technique helps identify potential classes and methods from requirements?

        - Looking for nouns (objects) and verbs (methods) { data-correct }
        - Counting the number of users
        - Measuring system performance
        - Drawing flowcharts

    4. What is the main characteristic of top-down design?

        - Starts with basic components and builds upward
        - Starts with the big picture and breaks it down into smaller parts { data-correct }
        - Focuses only on user interface design
        - Emphasizes testing over design

    5. When would bottom-up design be most appropriate?

        - When building reusable components and working with well-understood domains { data-correct }
        - When requirements are completely fixed and won't change
        - When working alone on a small project
        - When the system has a clear hierarchical structure

    6. What do collaborations define in object-oriented design?

        - How programmers work together
        - How objects work together to accomplish system goals { data-correct }
        - How users interact with the system
        - How data is stored in the database

    7. Look at this responsibility assignment. Which class should handle calculating fines for overdue books?

        ```python
        class Member: # manages member data
        class Book: # manages book availability  
        class Library: # coordinates operations
        ```

        - Member class
        - Book class
        - Library class { data-correct }
        - A separate Fine class

    8. What is a key advantage of top-down design?

        - Easier to reuse components
        - More flexible and adaptable
        - Clear overall structure from the start { data-correct }
        - Builds on tested foundations

    9. In the design process, what comes after identifying responsibilities?

        - Writing code immediately
        - Designing collaborations between objects { data-correct }
        - Creating user interfaces
        - Testing the system

    10. What approach do most real-world projects use?

        - Only top-down design
        - Only bottom-up design
        - A hybrid approach combining both top-down and bottom-up { data-correct }
        - No systematic design approach
