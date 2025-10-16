---
title: "17.01 Secure Api Design - Quiz"
---

# 17.01 Secure Api Design - Quiz

!!! quiz "Check your understanding"

    1. Which component of a JWT token contains the actual claims and user data?

        - Header
        - Payload { data-correct }
        - Signature
        - Encryption key

    2. In the token bucket rate limiting algorithm, what happens when a bucket is empty?

        - The request is immediately rejected { data-correct }
        - The request waits until the next token is available
        - The bucket size is automatically increased
        - A new bucket is created for the client

    3. Which CORS header is required for a server to accept credentials from cross-origin requests?

        - `Access-Control-Allow-Origin: *`
        - `Access-Control-Allow-Credentials: true` { data-correct }
        - `Access-Control-Allow-Methods: POST`
        - `Access-Control-Allow-Headers: *`

    4. What is the primary security advantage of using OAuth 2.0 over basic API key authentication?

        - OAuth tokens are longer and more complex
        - OAuth provides delegated authorization without sharing credentials { data-correct }
        - OAuth tokens never expire
        - OAuth eliminates the need for HTTPS

    5. Which of the following is NOT a recommended practice for secure session management?

        - Using cryptographically random session IDs
        - Implementing session rotation
        - Storing session data in client-side cookies { data-correct }
        - Setting appropriate session timeouts

    6. In a SQL injection attack against an API, what is the most effective prevention method?

        - Input length limitations
        - Parameterized queries/prepared statements { data-correct }
        - Output encoding
        - Rate limiting

    7. What is the purpose of the `state` parameter in OAuth 2.0 authorization flows?

        - To store user preferences
        - To prevent CSRF attacks { data-correct }
        - To encrypt the access token
        - To indicate the application state

    8. Which rate limiting strategy is most effective against distributed denial-of-service (DDoS) attacks?

        - Fixed window rate limiting
        - Token bucket algorithm
        - Progressive penalty system with IP blocking { data-correct }
        - User-based rate limiting only

    9. What is the main security risk of using wildcard (*) in CORS `Access-Control-Allow-Origin` header?

        - It slows down the server response
        - It allows any website to make requests to your API { data-correct }
        - It breaks mobile applications
        - It requires HTTPS

    10. Which HTTP status code should be returned when a client exceeds their rate limit?

        - 400 Bad Request
        - 401 Unauthorized
        - 403 Forbidden
        - 429 Too Many Requests { data-correct }

    11. What is the primary purpose of CSRF tokens in API security?

        - To encrypt API requests
        - To prevent unauthorized cross-site requests { data-correct }
        - To rate limit API calls
        - To authenticate users

    12. In JWT token validation, what should happen if a token is found in the blacklist?

        - The token should be refreshed automatically
        - The request should be rejected immediately { data-correct }
        - The user should be prompted to re-authenticate
        - The token expiration should be extended

    13. Which of the following is the most secure way to store API keys in a database?

        - Plain text for easy retrieval
        - Base64 encoded
        - Hashed using a cryptographic hash function { data-correct }
        - Encrypted with a reversible algorithm

    14. What is the recommended approach for handling sensitive data in API error messages?

        - Include all available details to help debugging
        - Return generic error messages without sensitive information { data-correct }
        - Log errors to console for developer access
        - Send detailed errors only to authenticated users

    15. In secure API design, what is the principle of "fail securely"?

        - APIs should never fail under any circumstances
        - When errors occur, the system should default to the most restrictive security state { data-correct }
        - Failed requests should be retried automatically
        - Error messages should include detailed debugging information
