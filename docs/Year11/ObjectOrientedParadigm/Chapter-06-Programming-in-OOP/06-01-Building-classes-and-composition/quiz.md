---
title: "06.01 Building Classes And Composition - Quiz"
---

# 06.01 Building Classes And Composition - Quiz

!!! quiz "Check your understanding"

    1. What is the primary purpose of the `__init__` method in a Python class?

        - To delete objects when they're no longer needed
        - To initialize a new object's attributes and set up its initial state { data-correct }
        - To define what methods the class can use
        - To create multiple copies of the class

    2. Which parameter must always be the first parameter in instance methods?

        - `cls`
        - `self` { data-correct }
        - `this`
        - `instance`

    3. What does this code create?

        ```python
        student = Student("Alice", "S12345")
        ```

        - A class definition
        - An instance (object) of the Student class { data-correct }
        - A method call
        - A constructor definition

    4. What is composition in object-oriented programming?

        - Inheriting from multiple parent classes
        - Building complex objects by combining simpler component objects { data-correct }
        - Writing longer methods with more functionality
        - Using global variables in classes

    5. Why is "composition over inheritance" often preferred?

        - Composition is always faster than inheritance
        - Composition provides more flexibility and looser coupling { data-correct }
        - Inheritance is deprecated in modern programming
        - Composition uses less memory

    6. Look at this class structure. What principle does it demonstrate?

        ```python
        class Car:
            def __init__(self, engine, wheels):
                self.engine = engine
                self.wheels = wheels
        ```

        - Inheritance
        - Composition { data-correct }
        - Encapsulation
        - Polymorphism

    7. What makes a class "cohesive"?

        - It has many different responsibilities
        - It has a single, well-defined purpose with related methods { data-correct }
        - It inherits from multiple parent classes
        - It has more than 10 methods

    8. Which constructor design is better?

        ```python
        def __init__(self, name, age):
            self.name = name
            self.age = age

        def __init__(self, name, age):
            if not name or age < 0:
                raise ValueError("Invalid input")
            self.name = name
            self.age = age
        ```

        - Option A - simpler code
        - Option B - includes validation { data-correct }
        - Both are equally good
        - Neither is correct

    9. What relationship does composition represent?

        - "is-a" relationship
        - "has-a" relationship { data-correct }
        - "uses-a" relationship
        - "extends-a" relationship

    10. In this example, what type of method is `_calculate_total`?

        ```python
        class ShoppingCart:
            def add_item(self, item): pass
            def _calculate_total(self): pass
            def get_total(self): return self._calculate_total()
        ```

        - Public method intended for external use
        - Private helper method for internal use { data-correct }
        - Static method that doesn't use instance data
        - Abstract method that must be overridden
