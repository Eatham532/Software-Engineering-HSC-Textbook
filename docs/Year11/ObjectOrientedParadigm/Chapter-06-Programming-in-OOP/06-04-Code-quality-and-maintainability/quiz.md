# 06.04 Code Quality And Maintainability - Quiz

!!! quiz "Check your understanding"

    1. Which of the following demonstrates the best naming convention for a Python class that manages student enrollment data?

        - `student_manager`
        - `StudentManager` { data-correct }
        - `studentmanager`
        - `STUDENT_MANAGER`

    2. What is the primary purpose of docstrings in Python code?

        - To add comments that explain how the code works
        - To document what the code does, its parameters, and return values { data-correct }
        - To make the code run faster
        - To hide implementation details from other developers

    3. Which of the following is a clear indicator that a method might be too long and need refactoring?

        - The method has more than 2 parameters
        - The method contains loops or conditional statements
        - The method performs multiple distinct tasks and is difficult to understand { data-correct }
        - The method calls other methods

    4. What is the main benefit of using named constants instead of "magic numbers" in code?

        - It makes the code run faster
        - It reduces memory usage
        - It makes the code more readable and easier to maintain { data-correct }
        - It prevents syntax errors

    5. Which comment style provides the most value for code maintainability?

        - `# Add 1 to counter`
        - `# Business rule: Students must maintain minimum GPA of 2.0 for enrollment` { data-correct }
        - `# Loop through all items`
        - `# Set variable to true`

    6. When applying the "Extract Method" refactoring pattern, what should each extracted method ideally do?

        - Contain as much code as possible to reduce the number of methods
        - Focus on a single, well-defined task { data-correct }
        - Include error handling for all possible scenarios
        - Be exactly 10 lines long

    7. Which of the following best demonstrates proper docstring format for a method?

        - `"""This method calculates something"""`
        - `"""Calculate student GPA. Args: grades (list). Returns: float."""`
        - ```
        """
        Calculate the Grade Point Average for a student.

        Args:
            grades (list): List of numerical grades between 0-100

        Returns:
            float: GPA value between 0.0 and 4.0
        """ { data-correct }
        ```
        - `# This calculates GPA`

    8. What is the most important factor when deciding whether to break a long method into smaller methods?

        - The total number of lines of code
        - Whether the method contains loops
        - Whether distinct logical tasks can be identified within the method { data-correct }
        - The number of parameters the method has

    9. Which approach best improves code maintainability when dealing with complex business rules?

        - Adding detailed comments explaining each line of code
        - Using shorter variable names to save space
        - Extracting the business logic into well-named methods with clear docstrings { data-correct }
        - Combining all related logic into a single large method

    10. From a code quality perspective, which version of this validation logic is most maintainable?

        **Version A:**
        ```python
        if score >= 90:
            grade = "A"
        elif score >= 80:
            grade = "B"
        ```

        **Version B:**
        ```python
        A_THRESHOLD = 90
        B_THRESHOLD = 80

        if score >= A_THRESHOLD:
            grade = "A"
        elif score >= B_THRESHOLD:
            grade = "B"
        ```

        - Version A, because it's shorter
        - Version B, because it uses named constants { data-correct }
        - Both are equally maintainable
        - Neither is good practice
