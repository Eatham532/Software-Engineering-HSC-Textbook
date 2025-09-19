# Section 13.2 Quiz: Databases: SQL, common queries and ORM comparison

!!! quiz "Check your understanding"

    1. Which SQL operation is used to retrieve data from a database?

        - INSERT
        - SELECT { data-correct }
        - UPDATE
        - DELETE

    2. What is the primary security benefit of using parameterized queries?

        - Faster query execution
        - Better error handling
        - Prevention of SQL injection attacks { data-correct }
        - Automatic data validation

    3. Which type of JOIN returns all records from the left table, even if there are no matches in the right table?

        - INNER JOIN
        - LEFT JOIN { data-correct }
        - RIGHT JOIN
        - FULL OUTER JOIN

    4. What is the difference between COUNT(*) and COUNT(column_name) in SQL aggregation functions?

        - They are exactly the same operation
        - COUNT(*) is faster but COUNT(column_name) is more accurate
        - COUNT(*) counts all rows including NULLs, COUNT(column_name) only counts non-NULL values { data-correct }
        - COUNT(column_name) counts all rows while COUNT(*) only counts unique values

    5. Which SQL clause is used to filter groups created by GROUP BY?

        - WHERE
        - HAVING { data-correct }
        - ORDER BY
        - LIMIT

    6. What does CRUD stand for in database operations?

        - Create, Read, Update, Delete { data-correct }
        - Connect, Retrieve, Upload, Download
        - Copy, Remove, Undo, Deploy
        - Configure, Run, Use, Debug

    7. Which SQL query pattern is safest for finding all users whose email addresses end with a specific domain?

        - `SELECT * FROM users WHERE email = 'domain'`
        - `SELECT * FROM users WHERE email LIKE '%@example.com'`
        - `SELECT * FROM users WHERE email LIKE ?` with parameter '%@example.com' { data-correct }
        - `SELECT * FROM users WHERE email CONTAINS 'example.com'`

    8. Which SQL keyword is used to sort query results?

        - GROUP BY
        - ORDER BY { data-correct }
        - SORT BY
        - ARRANGE BY

    9. What is the main advantage of using INNER JOIN over multiple separate SELECT queries?

        - Simpler syntax
        - Better performance by reducing database round trips { data-correct }
        - Automatic error handling
        - Built-in data validation

    10. When would you use LEFT JOIN instead of INNER JOIN?

        - When you want faster query performance
        - When you want to include all records from the left table even if there are no matches in the right table { data-correct }
        - When you only want matching records from both tables
        - When you want to exclude NULL values

    11. What does ORM stand for in database programming?

        - Object Relational Mapping { data-correct }
        - Online Resource Management
        - Optimized Record Matching
        - Organized Row Manipulation

    12. Which of the following is a primary benefit of using an ORM over raw SQL?

        - Always better performance
        - Smaller file sizes
        - Object-oriented approach with automatic relationship handling { data-correct }
        - Eliminates the need for a database

    13. What is a key difference between raw SQL and SQLAlchemy ORM for creating database records?

        - Raw SQL is always more secure than ORM
        - ORM provides object-oriented interface while raw SQL uses direct database commands { data-correct }
        - Raw SQL cannot handle relationships between tables
        - ORM is faster for all types of operations

    14. When would you choose raw SQL over an ORM?

        - When building simple CRUD applications
        - When performance is critical and you need complex optimized queries { data-correct }
        - When working with junior developers
        - When database portability is important

    15. How does an ORM map Python classes to database tables?

        - Classes become databases and methods become tables
        - Class attributes become columns and instances become rows { data-correct }
        - Classes become queries and attributes become results
        - There is no direct mapping between classes and tables
