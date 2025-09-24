# 6.2 Control structures within methods - Quiz

!!! quiz "Check your understanding"

    1. What is the primary purpose of selection structures (if/elif/else) in methods?

        - To repeat operations multiple times
        - To make decisions based on conditions and object state { data-correct }
        - To define class attributes
        - To create loops

    2. Which control structure would be most appropriate for processing all items in a list?

        - if statement
        - while loop
        - for loop { data-correct }
        - elif statement

    3. What does method cohesion mean?

        - Methods should be as long as possible
        - Each method should have a single, well-defined purpose { data-correct }
        - Methods should use many control structures
        - Methods should access global variables

    4. Look at this method. What's the main problem with it?

        ```python
        def process_order(self, order):
            # 50 lines of code doing:
            # - validate customer
            # - check inventory  
            # - calculate pricing
            # - update database
            # - send notifications
        ```

        - It uses too many variables
        - It does too many different things (lacks cohesion) { data-correct }
        - It doesn't use enough control structures
        - It's written in Python

    5. What is the recommended maximum length for most methods?

        - 5 lines
        - Around 20 lines { data-correct }
        - 100 lines
        - No limit

    6. Which approach is better for complex decision-making in methods?

        - One large if statement with many conditions
        - Breaking logic into smaller, focused methods { data-correct }
        - Using only while loops
        - Avoiding all control structures

    7. When should you use a while loop instead of a for loop?

        - When you need to iterate over a list
        - When you don't know how many iterations you need in advance { data-correct }
        - When processing dictionary items
        - Never - for loops are always better

    8. What is method extraction?

        - Deleting methods from classes
        - Calling methods from other classes
        - Breaking large methods into smaller, focused methods { data-correct }
        - Combining multiple methods into one

    9. Look at this code structure. What principle does it demonstrate?

        ```python
        def process_student(self, data):
            if not self._validate_data(data):
                return False
            gpa = self._calculate_gpa(data)
            status = self._determine_status(gpa)
            return self._generate_report(data, gpa, status)
        ```

        - Poor method design
        - Good method cohesion and single responsibility { data-correct }
        - Excessive use of control structures
        - Improper use of private methods

    10. What should you do when a method becomes too complex?

        - Add more comments to explain it
        - Make the variable names longer
        - Break it down into smaller, focused methods { data-correct }
        - Use more control structures
