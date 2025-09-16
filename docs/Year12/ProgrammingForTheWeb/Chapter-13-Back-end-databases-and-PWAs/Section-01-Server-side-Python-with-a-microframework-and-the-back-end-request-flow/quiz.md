# 13.1 Quiz: Server-side Python with a microframework and the back-end request flow

1. In a typical web request flow, what is the primary role of the web server (like nginx or Apache)?

   - a) Execute Python application code

   - b) Handle socket connections and serve static files

   - c) Process database queries

   - d) Render HTML templates

   - **Correct answer: b** <!--data-correct-->

2. Which Flask decorator is used to define a route that handles both GET and POST requests?

   - a) `@app.route('/path')`

   - b) `@app.route('/path', methods=['GET', 'POST'])`

   - c) `@app.get_post('/path')`

   - d) `@app.method('/path', 'GET,POST')`

   - **Correct answer: b** <!--data-correct-->

3. What is the most important security practice when inserting user input into database queries?

   - a) Validating input length

   - b) Using parameterized queries

   - c) Checking input type

   - d) Escaping special characters

   - **Correct answer: b** <!--data-correct-->

4. **Short Answer**: Explain the difference between client-side and server-side input validation, and why both are important.

   **Sample Answer**: Client-side validation provides immediate user feedback and improves user experience, but can be bypassed by malicious users. Server-side validation is the security layer that cannot be bypassed and ensures data integrity. Client-side is for usability, server-side is for security - both serve different but complementary purposes.

5. In Flask, what is the purpose of the `g` object?

   - a) Global configuration settings

   - b) Application context storage for the current request

   - c) User session data

   - d) Database connection pool

   - **Correct answer: b** <!--data-correct-->

6. Which component in the web stack is responsible for converting between HTTP and Python application interfaces?

   - a) Web server

   - b) WSGI server

   - c) Database connector

   - d) Template engine

   - **Correct answer: b** <!--data-correct-->

7. **Short Answer**: List three potential problems that can occur when a web application's database becomes temporarily unavailable, and suggest one solution for each.

   **Sample Answer**:

   1. **Request failures** - Solution: Implement circuit breaker pattern to fail fast

   2. **User confusion** - Solution: Display meaningful error messages

   3. **System overload** - Solution: Use connection pooling with retry logic and exponential backoff

8. What is the primary purpose of middleware in web frameworks?

   - a) Handle database connections

   - b) Process requests before they reach route handlers

   - c) Render HTML templates

   - d) Manage static file serving

   - **Correct answer: b** <!--data-correct-->

9. Which Flask function should be used to securely hash passwords?

   - a) `hash()`

   - b) `hashlib.md5()`

   - c) `generate_password_hash()`

   - d) `base64.encode()`

   - **Correct answer: c** <!--data-correct-->

10. **Short Answer**: Describe the complete path of a web request from browser to database and back. Include at least 5 major components.

    **Sample Answer**:

    1. **Browser** sends HTTP request

    2. **Web server** (nginx/Apache) receives connection and parses HTTP

    3. **WSGI server** (Gunicorn) receives proxied request

    4. **Flask application** matches route and processes request

    5. **Database** executes SQL query and returns data

    6. **Template engine** renders HTML response

    7. **Response travels back** through WSGI → Web server → Browser
