# 05.01 Objects And Classes - Quiz

!!! quiz "Check your understanding"

    1. What is the main difference between a class and an object?

        - A class is written in Python, an object is written in Java
        - A class is a blueprint or template, an object is an instance created from that blueprint { data-correct }
        - A class contains methods, an object contains attributes
        - A class is larger than an object

    2. When you write `student.study("Math")` in Python, what is happening?

        - You are defining a new method called study
        - You are creating a new class called student
        - You are sending a message to the student object to execute its study method { data-correct }
        - You are importing the Math module

    3. In the following code, how many instances of the BankAccount class are created?

        ```python
        class BankAccount:
            def __init__(self, balance):
                self.balance = balance

        acc1 = BankAccount(100)
        acc2 = BankAccount(200)
        acc3 = acc1
        ```

        - 1
        - 2 { data-correct }
        - 3
        - 4

    4. What is an attribute in object-oriented programming?

        - A special type of method that returns a value
        - Data or properties that describe the state of an object { data-correct }
        - A way to create new objects
        - A type of loop used in classes

    5. What does the `self` parameter represent in a Python method?

        - The class itself
        - The method being called
        - The specific instance (object) the method is being called on { data-correct }
        - All instances of the class

    6. Which of the following best describes message passing in OOP?

        - Objects can only communicate through global variables
        - Objects communicate by calling each other's methods { data-correct }
        - Objects can only communicate with objects of the same class
        - Objects communicate through direct memory access

    7. What will be the output of this code?

        ```python
        class Counter:
            def __init__(self):
                self.count = 0

            def increment(self):
                self.count += 1
                return self.count

        c1 = Counter()
        c2 = Counter()
        print(c1.increment())
        print(c2.increment())
        ```

        - 1, 1 { data-correct }
        - 1, 2
        - 2, 2
        - 0, 0

    8. Which statement about classes and instances is correct?

        - A class can only have one instance
        - An instance can belong to multiple classes
        - A class is a blueprint, an instance is created from that blueprint { data-correct }
        - Classes and instances are the same thing

    9. What is encapsulation in object-oriented programming?

        - Combining data and methods into a single unit { data-correct }
        - Making all data public
        - Separating data from methods
        - Converting objects to strings

    10. Why is message passing important in OOP? (Select all that apply)

        - It allows objects to work together without knowing internal details { data-correct }
        - It makes code run faster
        - It provides better memory management
        - It enables encapsulation and modularity { data-correct }
