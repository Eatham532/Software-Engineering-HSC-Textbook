# 13.01 Server Side Python With A Microframework And The Back End Request Flow - Quiz

!!! quiz "Check your understanding"

    1. In a typical web request flow, what is the primary role of the web server (like nginx or Apache)?

        - Execute Python application code
        - Handle socket connections and serve static files { data-correct }
        - Process database queries
        - Render HTML templates

    2. Which Flask decorator is used to define a route that handles both GET and POST requests?

        - `@app.route('/path')`
        - `@app.route('/path', methods=['GET', 'POST'])` { data-correct }
        - `@app.get_post('/path')`
        - `@app.method('/path', 'GET,POST')`

    3. What is the most important security practice when inserting user input into database queries?

        - Validating input length
        - Using parameterized queries { data-correct }
        - Checking input type
        - Escaping special characters

    4. What is the primary difference between client-side and server-side input validation?

        - Client-side validation is faster and more secure
        - Server-side validation can be bypassed while client-side cannot
        - Client-side validation improves user experience while server-side ensures security { data-correct }
        - There is no difference between the two approaches

    5. In Flask, what is the purpose of the `g` object?

        - Global configuration settings
        - Application context storage for the current request { data-correct }
        - User session data
        - Database connection pool

    6. Which component in the web stack is responsible for converting between HTTP and Python application interfaces?

        - Web server
        - WSGI server { data-correct }
        - Database connector
        - Template engine

    7. What is the most likely consequence when a web application's database becomes temporarily unavailable?

        - The web server will automatically restart
        - Users will receive HTTP 500 errors for database-dependent requests { data-correct }
        - Static files will stop being served
        - The application will switch to a backup database automatically

    8. What is the primary purpose of middleware in web frameworks?

        - Handle database connections
        - Process requests before they reach route handlers { data-correct }
        - Render HTML templates
        - Manage static file serving

    9. Which Flask function should be used to securely hash passwords?

        - `hash()`
        - `hashlib.md5()`
        - `generate_password_hash()` { data-correct }
        - `base64.encode()`

    10. In the complete path of a web request from browser to database, which component typically comes between the web server and the Flask application?

        - Template engine
        - Database connector
        - WSGI server { data-correct }
        - Load balancer
