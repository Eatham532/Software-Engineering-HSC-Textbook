---
title: "4.3 From pseudocode to Python functions - Quiz"
---

# 4.3 From pseudocode to Python functions - Quiz

!!! quiz "Section 4.3 Quiz: From pseudocode to Python functions"

    1. What keyword is used to define a function in Python?

        - function
        - def { data-correct }
        - define
        - func

    2. What does the `return` statement do in a function?

        - Prints a value to the screen
        - Sends a value back to the code that called the function { data-correct }
        - Ends the program
        - Starts a new function

    3. What will this function return when called as `mystery(5)`?

        ```python
        def mystery(x):
            result = x * 2
            print(result)
        ```

        - 10
        - 5
        - None { data-correct }
        - An error occurs

    4. Which of the following is the correct way to call a function named `calculate_area` with parameters `length=10` and `width=5`?

        - calculate_area(10, 5) { data-correct }
        - calculate_area[10, 5]
        - def calculate_area(10, 5)
        - return calculate_area(10, 5)

    5. What is the Single Responsibility Principle for functions?

        - Functions should only use single-character variable names
        - Functions should only be called once in a program
        - Functions should do one specific task well { data-correct }
        - Functions should only have one parameter

    6. What is a parameter in a function?

        - The value the function returns
        - Information passed to the function when it's called { data-correct }
        - The function's name
        - The first line of the function body

    7. What is wrong with this function definition?

        ```python
        def greet(greeting="Hello", name):
            return f"{greeting}, {name}!"
        ```

        - The function name should be capitalized
        - Default parameters must come after non-default parameters { data-correct }
        - The return statement should use + instead of f-strings
        - Nothing is wrong with it

    8. What will be the output of this code?

        ```python
        def double(x):
            return x * 2

        def triple(x):
            return x * 3

        result = double(triple(4))
        print(result)
        ```

        - 12
        - 14
        - 24 { data-correct }
        - 10

    9. Which of the following best describes a "pure function"?

        - A function that only uses built-in Python functions
        - A function with no syntax errors
        - A function that always produces the same output for the same inputs and has no side effects { data-correct }
        - A function that doesn't use any parameters

    10. What should you include in every function to explain what it does?

        - A comment at the end of the function
        - A docstring immediately after the function definition { data-correct }
        - A print statement showing the function name
        - A global variable with the function description
