# 01.03 Documentation And Code Style - Quiz

!!! quiz

    1. What are the four essential questions a README.md file should answer?

        - What programming language? How many files? Who wrote it? When was it created?
        - What does this do? How do I run it? What do I need? How do I use it? {data-correct}
        - Why was this built? Where is the source code? What license? What's the version?
        - How fast does it run? How much memory? What OS? What dependencies?

    2. When should you write inline comments in your code?

        - For every single line to explain what it does
        - To explain why something is done, not what is being done {data-correct}
        - Only when the code is too complex to understand
        - At the beginning and end of every function

    3. Which function name follows Python naming conventions (PEP 8)?

        - CalculateAverage()
        - calculateAverage()
        - calculate_average() {data-correct}
        - CALCULATE_AVERAGE()

    4. What should a good docstring include for a function?

        - Only the function name
        - Just the parameters it takes
        - Brief description, parameters (if any), and return value (if any) {data-correct}
        - The complete implementation details

    5. Look at this code snippet:
        ```python
        total = grade1 + grade2 + grade3
        ```text
        What's wrong with this comment?

        - It's too short
        - It should be a docstring instead
        - It explains what the code does (obvious) instead of why {data-correct}
        - Nothing is wrong with its

    6. Which constant name follows Python conventions?

        - maxGrade = 100
        - MAX_GRADE = 100 {data-correct}
        - max_grade = 100
        - MaxGrade = 100

    7. Complete this docstring for the function:
        ```python
        def convert_celsius_to_fahrenheit(celsius):
            """_________"""
            return (celsius * 9/5) + 32
        ```text

        - "This function converts temperature"
        - "Convert temperature from Celsius to Fahrenheit." {data-correct}
        - "Takes celsius parameter and returns fahrenheit using the conversion formula"
        - "celsius * 9/5 + 32"

    8. What's the main benefit of following consistent code style in a team project?

        - It makes the code run faster
        - It reduces file size
        - It makes code easier to read and maintain for everyone {data-correct}
        - It prevents all bugs from occurring
