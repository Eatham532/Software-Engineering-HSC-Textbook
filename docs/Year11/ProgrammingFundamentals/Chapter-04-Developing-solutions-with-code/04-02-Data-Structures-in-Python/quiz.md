# 04.02 Data Structures In Python - Quiz

!!! quiz "Check your understanding"

    1. How do you access the element in the second row, third column of a 2D list called `matrix`?

        - `matrix[1][2]` { data-correct }
        - `matrix[2][3]`
        - `matrix[2][1]`
        - `matrix[3][2]`

    2. Which Python operation is used to add an element to the end of a list?

        - `insert()`
        - `add()`
        - `append()` { data-correct }
        - `push()`

    3. In a stack implemented using a Python list, which operation removes the top element?

        - `remove()`
        - `pop()` { data-correct }
        - `delete()`
        - `pull()`

    4. How do you safely access a dictionary value that might not exist?

        - Use try/except with KeyError
        - Use the `get()` method { data-correct }
        - Check with `if key in dict` first
        - All of the above

    5. Which data structure would be most efficient for implementing a simple undo feature?

        - Dictionary
        - 2D List
        - Stack { data-correct }
        - Tree

    6. What does this code do?

        ```python
        tree = {"name": "root", "children": [{"name": "child1", "children": []}]}
        ```

        - Creates a 2D array
        - Creates a simple tree structure using nested dictionaries { data-correct }
        - Creates a stack
        - Creates a hash table

    7. When reading CSV files in Python, which module should you import?

        - `file`
        - `csv` { data-correct }
        - `io`
        - `data`

    8. What is the result of `my_list.pop(1)` on the list `[10, 20, 30, 40]`?

        - Returns 10, list becomes `[20, 30, 40]`
        - Returns 20, list becomes `[10, 30, 40]` { data-correct }
        - Returns 30, list becomes `[10, 20, 40]`
        - Causes an error

    9. Which Python data type is used to implement hash tables?

        - List
        - Tuple
        - Dictionary { data-correct }
        - Set

    10. In a 2D list representing a grade book, how would you calculate the average grade for the first student?

        - `sum(grades[0]) / len(grades[0])` { data-correct }
        - `sum(grades) / len(grades)`
        - `average(grades[0])`
        - `grades[0].average()`

    11. What does `csv.DictReader()` do compared to `csv.reader()`?

        - Reads files faster
        - Returns each row as a dictionary with column headers as keys { data-correct }
        - Reads only the headers
        - Automatically sorts the data

    12. Which operation is used to add an element at a specific position in a Python list?

        - `append()`
        - `add()`
        - `insert()` { data-correct }
        - `place()`
