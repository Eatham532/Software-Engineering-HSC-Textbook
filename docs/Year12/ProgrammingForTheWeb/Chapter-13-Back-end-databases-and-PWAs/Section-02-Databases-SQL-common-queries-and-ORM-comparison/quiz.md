# 13.2 Quiz: Databases: SQL, common queries and ORM comparison

1. Which SQL operation is used to retrieve data from a database?

   - a) INSERT

   - b) SELECT

   - c) UPDATE

   - d) DELETE

   - **Correct answer: b** <!--data-correct-->

2. What is the primary security benefit of using parameterized queries?

   - a) Faster query execution

   - b) Better error handling

   - c) Prevention of SQL injection attacks

   - d) Automatic data validation

   - **Correct answer: c** <!--data-correct-->

3. Which type of JOIN returns all records from the left table, even if there are no matches in the right table?

   - a) INNER JOIN

   - b) LEFT JOIN

   - c) RIGHT JOIN

   - d) FULL OUTER JOIN

   - **Correct answer: b** <!--data-correct-->

4. **Short Answer**: Explain the difference between COUNT(*) and COUNT(column_name) in SQL aggregation functions.

   **Sample Answer**: COUNT(*) counts all rows in a group, including those with NULL values, while COUNT(column_name) only counts rows where that specific column is not NULL. This distinction is important when working with optional fields or when you need to count actual data values versus total records.

5. Which SQL clause is used to filter groups created by GROUP BY?

   - a) WHERE

   - b) HAVING

   - c) ORDER BY

   - d) LIMIT

   - **Correct answer: b** <!--data-correct-->

6. What does CRUD stand for in database operations?

   - a) Create, Read, Update, Delete

   - b) Connect, Retrieve, Upload, Download

   - c) Copy, Remove, Undo, Deploy

   - d) Configure, Run, Use, Debug

   - **Correct answer: a** <!--data-correct-->

7. **Short Answer**: Write a safe parameterized query to find all users whose email addresses end with a specific domain (e.g., "@example.com").

   **Sample Answer**:

   ```sql
   SELECT id, username, email FROM users WHERE email LIKE ?
   ```

   With parameter value: '%@example.com'
   This prevents SQL injection while allowing pattern matching.

8. Which SQL keyword is used to sort query results?

   - a) GROUP BY

   - b) ORDER BY

   - c) SORT BY

   - d) ARRANGE BY

   - **Correct answer: b** <!--data-correct-->

9. What is the main advantage of using INNER JOIN over multiple separate SELECT queries?

   - a) Simpler syntax

   - b) Better performance by reducing database round trips

   - c) Automatic error handling

   - d) Built-in data validation

   - **Correct answer: b** <!--data-correct-->

10. **Short Answer**: Describe a scenario where you would use LEFT JOIN instead of INNER JOIN, and explain why.

    **Sample Answer**: Use LEFT JOIN when you want to display all records from the main table even if related data doesn't exist. For example, showing all users with their post counts - you want to include users who haven't written any posts (showing 0 posts) rather than excluding them entirely, which is what INNER JOIN would do.

11. What does ORM stand for in database programming?

    - a) Object Relational Mapping

    - b) Online Resource Management

    - c) Optimized Record Matching

    - d) Organized Row Manipulation

    - **Correct answer: a** <!--data-correct-->

12. Which of the following is a primary benefit of using an ORM over raw SQL?

    - a) Always better performance

    - b) Smaller file sizes

    - c) Object-oriented approach with automatic relationship handling

    - d) Eliminates the need for a database

    - **Correct answer: c** <!--data-correct-->

13. **Short Answer**: Compare writing a simple user creation operation using raw SQL versus SQLAlchemy ORM. What are the key differences?

    **Sample Answer**:
    **Raw SQL**: `cursor.execute("INSERT INTO users (username, email) VALUES (?, ?)", (username, email))`
    **ORM**: `user = User(username=username, email=email); db.session.add(user); db.session.commit()`
    
    Key differences: ORM provides object-oriented interface, automatic transaction management, relationship handling, and type safety, while raw SQL offers direct control and potentially better performance.

14. When would you choose raw SQL over an ORM?

    - a) When building simple CRUD applications

    - b) When performance is critical and you need complex optimized queries

    - c) When working with junior developers

    - d) When database portability is important

    - **Correct answer: b** <!--data-correct-->

15. **Short Answer**: Explain how an ORM maps Python classes to database tables. Give a specific example.

    **Sample Answer**: ORMs map classes to tables by treating class attributes as columns and class instances as rows. For example:

    ```python
    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(80), unique=True)
    ```

    This creates a 'User' table with 'id' and 'username' columns. Creating `user = User(username='john')` represents a row in that table.
