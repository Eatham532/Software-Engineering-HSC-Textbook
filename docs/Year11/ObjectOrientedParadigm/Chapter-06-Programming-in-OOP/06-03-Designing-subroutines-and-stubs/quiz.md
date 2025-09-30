# 06.03 Designing Subroutines And Stubs - Quiz

!!! quiz "Check your understanding"

    1. What is the main purpose of a method signature?

        - To implement the method's internal logic
        - To define how other code can interact with the method { data-correct }
        - To store the method's variables
        - To optimize the method's performance

    2. Which of the following makes a good method name?

        - `process_data()`
        - `calculate_student_grade_average()` { data-correct }
        - `do_stuff()`
        - `method1()`

    3. What is a stub in programming?

        - A complete method implementation
        - A temporary method implementation focusing on interface rather than full logic { data-correct }
        - A method that has been deleted
        - A method that throws errors

    4. When should you use stubs during development?

        - Only when you can't implement the real method
        - To test class design before implementing everything { data-correct }
        - Only for methods that will never be implemented
        - When you want to make your code run slower

    5. What should a good method signature include?

        - Only the method name
        - Method name, parameters, and clear documentation { data-correct }
        - Just the return type
        - Only complex parameter types

    6. Which stub implementation is most helpful for testing?

        ```python
        def calculate_total(self):
            pass
        ```

        ```python
        def calculate_total(self):
            print("Calculating total...")
            return 0.0
        ``` { data-correct }

        ```python
        def calculate_total(self):
            raise Exception("Not implemented")
        ```

        ```python
        def calculate_total(self):
            return
        ```

    7. What is the benefit of designing method signatures before implementing the full logic?

        - It makes the code run faster
        - It helps identify interface problems early { data-correct }
        - It reduces the amount of code needed
        - It eliminates the need for testing

    8. In incremental development with stubs, what should you do first?

        - Implement all methods completely
        - Write comprehensive tests for every method
        - Design clear method signatures and basic stub implementations { data-correct }
        - Optimize the code for performance

    9. Which principle should guide method design?

        - Each method should do multiple different tasks
        - Each method should focus on one specific task { data-correct }
        - Methods should be as long as possible
        - Method names should be abbreviated to save typing

    10. What makes stub implementations valuable during development?

        - They provide the final solution to all problems
        - They allow testing of class design and integration before full implementation { data-correct }
        - They eliminate the need for real implementations
        - They automatically generate the final code
