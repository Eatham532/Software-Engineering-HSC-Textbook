# 11.03 Web Protocols Ports And Secure Transport Concepts - Quiz

!!! quiz "Check your understanding"

    1. What is the main purpose of an SSL certificate?

        - To speed up website loading
        - To prove a website's identity and enable encryption { data-correct }
        - To store user passwords securely
        - To compress data during transmission

    2. What information does an SSL certificate typically contain?

        - Only the website's domain name
        - Domain name, public key, CA signature, and expiration date { data-correct }
        - User login credentials and personal data
        - Website content and database information

    3. What is the key difference between symmetric and asymmetric encryption?

        - Symmetric is faster, asymmetric is more secure
        - Symmetric uses one key for both encryption and decryption, asymmetric uses a key pair { data-correct }
        - Symmetric is for data, asymmetric is for passwords
        - There is no significant difference

    4. Why do we encrypt plain text into cipher text?

        - To make data smaller for storage
        - To protect sensitive data from unauthorized access during transmission and storage { data-correct }
        - To make data processing faster
        - To comply with programming language requirements

    5. What is the difference between authentication and authorisation?

        - Authentication verifies identity, authorisation determines permissions { data-correct }
        - Authentication is for passwords, authorisation is for certificates
        - They are the same thing with different names
        - Authentication is automatic, authorisation requires user input

    6. What is the primary purpose of hash functions in web security?

        - To encrypt passwords for transmission
        - To create fixed-size fingerprints for data integrity and password storage { data-correct }
        - To compress large files for faster upload
        - To generate random numbers for encryption keys

    7. What makes hash functions suitable for password storage?

        - They can be easily reversed to recover the original password
        - They are one-way functions that cannot be reversed { data-correct }
        - They always produce the same length output regardless of input
        - They are faster than other encryption methods

    8. What do digital signatures provide in web security?

        - Data compression and faster transmission
        - Non-repudiation and verification of document authenticity { data-correct }
        - Automatic password generation for users
        - Real-time monitoring of website traffic

    9. In the HTTPS connection process, what happens after the server sends its SSL certificate?

        - The browser immediately starts sending encrypted data
        - The browser verifies the certificate with a Certificate Authority { data-correct }
        - The server begins downloading website content
        - The connection is automatically terminated for security

    10. Why is a "salt" used when hashing passwords?

        - To make passwords easier to remember
        - To prevent rainbow table attacks and make each hash unique { data-correct }
        - To speed up the hashing process
        - To reduce the storage space needed for hashes
