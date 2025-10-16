---
title: "05.03 Abstraction Generalisation Inheritance Polymorphism - Quiz"
---

# 05.03 Abstraction Generalisation Inheritance Polymorphism - Quiz

!!! quiz "Check your understanding"

    1. What is the primary purpose of abstraction in object-oriented programming?

        - To make code run faster
        - To hide complexity and expose only essential features { data-correct }
        - To create more classes
        - To use more memory

    2. Which concept involves identifying common characteristics across different objects?

        - Abstraction
        - Generalisation { data-correct }
        - Inheritance
        - Polymorphism

    3. Look at this code. What concept does it demonstrate?

        ```python
        class Animal:
            def make_sound(self):
                pass

        class Dog(Animal):
            def make_sound(self):
                return "Woof!"
        ```

        - Abstraction
        - Generalisation
        - Inheritance { data-correct }
        - Polymorphism

    4. What is polymorphism in object-oriented programming?

        - Creating multiple classes
        - Same interface, different behavior { data-correct }
        - Using multiple inheritance
        - Having many attributes

    5. Which Python concept allows objects to be used polymorphically without formal inheritance?

        - Type checking
        - Duck typing { data-correct }
        - Method overriding
        - Class inheritance

    6. In this code, what concept allows the `play_instruments` function to work with different instrument types?

        ```python
        def play_instruments(instruments):
            for instrument in instruments:
                print(instrument.play())
        ```

        - Abstraction
        - Generalisation
        - Inheritance
        - Polymorphism { data-correct }

    7. What does the `super()` function do in inheritance?

        - Creates a new class
        - Calls methods from the parent class { data-correct }
        - Deletes the parent class
        - Makes the class abstract

    8. Which statement about inheritance is correct?

        - Child classes cannot override parent methods
        - Child classes inherit all attributes and methods from parents { data-correct }
        - Parent classes inherit from child classes
        - Inheritance makes code slower

    9. What makes this an example of good abstraction?

        ```python
        file_manager.save_file("data.txt", content)
        ```

        - It uses a short method name
        - It hides the complex file operations behind a simple interface { data-correct }
        - It only works with text files
        - It's written in Python

    10. Which scenario best demonstrates the need for generalisation?

        - Creating a single class for one specific object
        - Finding common features among cars, trucks, and motorcycles to create a Vehicle class { data-correct }
        - Writing separate code for each different situation
        - Using only concrete classes
