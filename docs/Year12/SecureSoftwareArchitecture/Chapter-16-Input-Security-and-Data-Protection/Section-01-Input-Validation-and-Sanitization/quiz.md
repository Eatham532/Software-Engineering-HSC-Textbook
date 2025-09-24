# Section 16.01 Quiz: Input Validation And Sanitization

!!! quiz "Check your understanding"

    1. What is the primary reason SQL injection attacks are successful?

        - Weak passwords used by database administrators
        - User input is directly concatenated into SQL queries { data-correct }
        - Databases don't support encryption
        - Firewalls are not properly configured

    2. Which approach is the most effective way to prevent SQL injection?

        - Input length validation only
        - Blacklist filtering of dangerous keywords
        - Parameterized queries with prepared statements { data-correct }
        - Base64 encoding of user input

    3. What is the main difference between stored XSS and reflected XSS attacks?

        - Stored XSS affects databases, reflected XSS affects files
        - Stored XSS is saved in the database, reflected XSS is returned immediately { data-correct }
        - Stored XSS uses JavaScript, reflected XSS uses HTML
        - Stored XSS targets admins, reflected XSS targets users

    4. When should you use whitelist validation instead of blacklist validation?

        - Only for password fields
        - When you want to block specific dangerous content
        - For most input validation scenarios { data-correct }
        - Only for file uploads

    5. What is the correct way to handle authentication errors in error messages?

        - Display "Invalid username" or "Invalid password" specifically
        - Show the exact SQL error to help users debug
        - Return a generic "Invalid username or password" message { data-correct }
        - Display no error message at all

    6. Which HTML encoding should be applied when displaying user input in an HTML page?

        - URL encoding only
        - Base64 encoding
        - HTML entity encoding { data-correct }
        - No encoding needed if input is validated

    7. What is the safest approach for validating file uploads?

        - Check file extension only
        - Validate both file extension and MIME type from content { data-correct }
        - Only check file size
        - Trust the user-provided MIME type

    8. Why should error messages not reveal detailed system information?

        - To save bandwidth
        - To prevent information disclosure to attackers { data-correct }
        - To reduce server load
        - To comply with accessibility standards

    9. What is the purpose of using `secrets.compare_digest()` for password verification?

        - To hash passwords more securely
        - To prevent timing attacks { data-correct }
        - To compress password data
        - To validate password complexity

    10. Which characters should typically be allowed in a whitelist validation for usernames?

        - All ASCII characters
        - Alphanumeric characters, underscores, and hyphens { data-correct }
        - Only lowercase letters
        - Any Unicode characters

    11. What is the main vulnerability in this code: `query = f"SELECT * FROM users WHERE id = {user_id}"`?

        - Missing error handling
        - SQL injection through string concatenation { data-correct }
        - Improper connection management
        - Missing input validation only

    12. When implementing file upload security, what should be the maximum recommended file size?

        - No limit needed
        - Depends on available server resources { data-correct }
        - Always 1MB regardless of use case
        - 100GB to accommodate all files

    13. Which of these is NOT a recommended practice for XSS prevention?

        - HTML entity encoding of output
        - Content Security Policy headers
        - Input validation with whitelists
        - Trusting client-side validation only { data-correct }

    14. What should you do when a file upload contains suspicious content?

        - Allow the upload but warn the user
        - Automatically clean the suspicious content
        - Reject the upload and log the attempt { data-correct }
        - Upload to a separate quarantine folder

    15. Why is blacklist validation generally less secure than whitelist validation?

        - Blacklists are slower to process
        - It's impossible to anticipate all possible attack vectors { data-correct }
        - Blacklists require more server resources
        - Blacklists only work with numeric input

    16. What is the correct approach for handling database errors in user-facing applications?

        - Display the full database error message
        - Show a generic error message and log details separately { data-correct }
        - Ignore the error completely
        - Only show errors to administrator accounts

    17. Which validation should be performed FIRST when processing user input?

        - Business logic validation
        - Database constraint checking
        - Basic format and type validation { data-correct }
        - Cross-field relationship validation

    18. What makes parameterized queries effective against SQL injection?

        - They encrypt the SQL statements
        - They separate SQL code from user data { data-correct }
        - They automatically validate input types
        - They compress query data

    19. When should you log security-related validation failures?

        - Never, to avoid filling up logs
        - Only for successful attacks
        - For all validation failures to detect attack patterns { data-correct }
        - Only during development phase

    20. What is the most secure approach for handling user-uploaded file names?

        - Use the original filename exactly as provided
        - Generate new secure filenames and store original names separately { data-correct }
        - Only allow alphanumeric filenames
        - Hash the filename before storage
