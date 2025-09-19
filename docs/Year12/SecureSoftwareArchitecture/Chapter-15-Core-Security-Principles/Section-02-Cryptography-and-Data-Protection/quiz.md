# Section 15.02 Quiz: Cryptography And Data Protection

!!! quiz "Check your understanding"

    1. What is the fundamental difference between hashing and encryption?

        - Hashing is faster than encryption
        - Hashing is reversible, encryption is not { data-correct }
        - Hashing is one-way, encryption is reversible
        - Hashing uses keys, encryption doesn't

    2. When should you use hashing instead of encryption for password storage?

        - When you need to recover the original password
        - When you only need to verify if a password is correct { data-correct }
        - When the password is less than 8 characters
        - When using symmetric encryption

    3. What is the purpose of adding salt to password hashes?

        - To make passwords taste better
        - To increase password length
        - To prevent rainbow table attacks { data-correct }
        - To encrypt the hash value

    4. Which of these demonstrates the avalanche effect in hashing?

        - Large inputs create large hashes
        - Small input changes create completely different hashes { data-correct }
        - Hash functions are irreversible
        - Hashes have fixed output lengths

    5. What type of encryption should you use for large files?

        - Asymmetric encryption (RSA)
        - Symmetric encryption (AES) { data-correct }
        - Hash-based encryption
        - Password-based encryption only

    6. Why can't RSA encryption handle large amounts of data directly?

        - RSA is too slow for large data
        - RSA has mathematical limitations on input size { data-correct }
        - RSA keys are too small
        - RSA doesn't support binary data

    7. What is the primary purpose of key rotation in cryptographic systems?

        - To improve performance
        - To reduce storage requirements
        - To limit exposure if keys are compromised { data-correct }
        - To make systems more complex

    8. Which approach is recommended for deriving encryption keys from passwords?

        - Simple hash function (SHA-256)
        - Password-Based Key Derivation Function (PBKDF2) { data-correct }
        - Base64 encoding
        - XOR operation

    9. What should you do with deprecated encryption keys?

        - Delete them immediately
        - Keep them temporarily for data recovery needs { data-correct }
        - Convert them to hash functions
        - Use them for less sensitive data

    10. In the password manager example, why is the master password not stored?

        - To save storage space
        - To prevent unauthorized access if the vault is compromised { data-correct }
        - Passwords are automatically generated
        - The system uses biometric authentication

    11. What is the correct order for secure password storage?

        - Password → Hash → Salt
        - Password → Salt → Hash { data-correct }
        - Salt → Password → Hash
        - Hash → Password → Salt

    12. Why should cryptographic keys have expiration dates?

        - To force users to change passwords
        - To comply with regulations only
        - To limit the time window for potential key compromise { data-correct }
        - To reduce computational overhead

    13. What is the advantage of using PBKDF2 over simple hashing for passwords?

        - PBKDF2 produces shorter hashes
        - PBKDF2 is faster to compute
        - PBKDF2 deliberately slows down brute force attacks { data-correct }
        - PBKDF2 doesn't require salts

    14. When building a secure system, which principle should guide key management?

        - Use the same key for all operations
        - Generate keys manually for better control
        - Use separate keys for different purposes { data-correct }
        - Store all keys in the application code

    15. What does the `secrets.compare_digest()` function prevent in password verification?

        - Hash collisions
        - Timing attacks { data-correct }
        - Salt reuse
        - Key derivation errors
