# Section 3.3 Quiz: Data Dictionaries

!!! quiz "Question 1"
    What is the primary purpose of a data dictionary?

    - Document API endpoints for web services
    - Define the structure, format, and constraints of data used in a software system { data-correct }
    - Store actual data values for the application
    - Generate user interface layouts

!!! quiz "Question 2"
    Which of the following is NOT typically included in a data dictionary entry?

    - Field names and data types
    - Constraints and validation rules
    - Sample data values
    - Source code implementation details { data-correct }

!!! quiz "Question 3"
    For a student record with a name field that must be between 2 and 50 characters, what type of constraint is this?

    - Range constraint
    - Length constraint { data-correct }
    - Format constraint
    - Relationship constraint

!!! quiz "Question 4"
    What does a "one-to-many" relationship mean in a data dictionary?

    - One field can contain many different data types
    - One record can be linked to multiple records in another table { data-correct }
    - One table can have many fields
    - One constraint can apply to many fields

!!! quiz "Question 5"
    Given the constraint "Range: 0.0-100.0" for a grade_average field, which value would be INVALID?

    - 85.5
    - 0.0
    - 100.0
    - 105.2 { data-correct }

!!! quiz "Question 6"
    What Python function could you use to check if a product_id follows the format "PRD" + 5 digits?

    - `isinstance()`
    - `len()`
    - `re.match()` { data-correct }
    - `str.format()`

!!! quiz "Question 7"
    In the student data dictionary example, what happens if you try to store an age of 30?

    - It gets automatically converted to 25
    - It should be rejected because it violates the range constraint (16-25) { data-correct }
    - It gets stored as a string instead of an integer
    - It triggers a format error

!!! quiz "Question 8"
    Which field constraint would ensure a product_id field is always exactly 8 characters long?

    - Range: 8-8
    - Length: exactly 8 characters { data-correct }
    - Format: must contain 8 digits
    - Type: string with 8 bytes

!!! quiz "Question 9"
    What is a "conditional constraint" in a data dictionary?

    - A constraint that only applies during certain times
    - A constraint that depends on the values of other fields { data-correct }
    - A constraint that can be optionally enforced
    - A constraint that applies to multiple data types

!!! quiz "Question 10"
    For an e-commerce system, if a product has `in_stock = True`, what constraint should apply to `stock_quantity`?

    - It must be exactly 1
    - It must be greater than 0 { data-correct }
    - It must be a string value
    - It can be any integer

!!! quiz "Question 11"
    When creating a data dictionary for a library book system, which constraint would be most appropriate for an ISBN field?

    - Must be exactly 13 digits { data-correct }
    - Must be between 1-100 characters
    - Must be a floating-point number
    - Must contain only letters

!!! quiz "Question 12"
    What is the main difference between a data dictionary and a database schema?

    - Data dictionaries are for web applications, schemas are for desktop applications
    - Data dictionaries are human-readable documentation, schemas are machine-readable database structure { data-correct }
    - Data dictionaries store actual data, schemas store metadata
    - Data dictionaries are optional, schemas are required
