# 05.02 Encapsulation And State - Quiz

!!! quiz "Check your understanding"

    1. What is encapsulation in object-oriented programming?

        - Hiding all methods from external access
        - Bundling data and methods together while controlling access to internal details { data-correct }
        - Making all attributes public
        - Converting objects to strings

    2. Which Python naming convention indicates a protected attribute?

        - `attribute`
        - `_attribute` { data-correct }
        - `__attribute`
        - `ATTRIBUTE`

    3. What is an invariant in object-oriented programming?

        - A method that never changes
        - A variable that cannot be modified
        - A condition that must always be true for an object to be in a valid state { data-correct }
        - A type of loop

    4. Look at this code. What's the problem with direct attribute access?

        ```python
        class BankAccount:
            def __init__(self, balance):
                self._balance = balance

        account = BankAccount(100)
        account._balance = -500  # Problem here
        ```

        - It's perfectly fine
        - It bypasses validation and can create invalid state { data-correct }
        - It's too slow
        - It uses too much memory

    5. What is the purpose of a getter method?

        - To delete an attribute
        - To provide controlled access to internal data { data-correct }
        - To create new objects
        - To sort data

    6. When should you use a setter method?

        - When you need to validate input before storing it { data-correct }
        - When you want to make data public
        - When you need to delete an object
        - When you want to slow down your program

    7. What does this Python property decorator do?

        ```python
        @property
        def temperature(self):
            return self._celsius
        ```

        - Makes the method private
        - Allows the method to be accessed like an attribute { data-correct }
        - Deletes the attribute
        - Makes the method static

    8. Which of these demonstrates good encapsulation?

        - `student.name = "John"`
        - `student._grades[0] = 100`
        - `student.add_grade(85)` { data-correct }
        - `student.__secret = "hidden"`

    9. What happens if you violate an object's invariants?

        - The program runs faster
        - The object may be in an invalid or inconsistent state { data-correct }
        - Nothing changes
        - The object becomes more secure

    10. Which statement about public vs private interfaces is correct?

        - All methods should be private
        - The public interface should be stable while internal implementation can change { data-correct }
        - Private methods are faster than public methods
        - Public methods are automatically validated
