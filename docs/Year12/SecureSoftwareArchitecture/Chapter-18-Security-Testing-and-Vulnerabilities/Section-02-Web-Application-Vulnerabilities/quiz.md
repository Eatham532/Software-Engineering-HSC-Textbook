# 18.2 Web Application Vulnerabilities - Quiz

**Instructions**: Choose the best answer for each question. Each question is worth 2 points.

---

## Question 1

Which of the following BEST describes how CSRF attacks work?

A) Attackers inject malicious scripts into web pages to steal user data
B) Attackers trick users into performing unintended actions on websites where they're authenticated
C) Attackers intercept network traffic to steal login credentials
D) Attackers exploit buffer overflows to gain system access

**Answer**: B) Attackers trick users into performing unintended actions on websites where they're authenticated

**Explanation**: CSRF (Cross-Site Request Forgery) attacks exploit the trust that a website has in a user's browser by tricking the user into submitting malicious requests to a site where they're already authenticated.

---

## Question 2

What is the PRIMARY purpose of CSRF tokens in web applications?

A) To encrypt sensitive data during transmission
B) To validate that requests come from legitimate users on the intended website
C) To store user session information securely
D) To prevent SQL injection attacks

**Answer**: B) To validate that requests come from legitimate users on the intended website

**Explanation**: CSRF tokens are unique, unpredictable values that ensure state-changing requests originate from the legitimate user on the intended website, preventing forged cross-site requests.

---

## Question 3

Which of the following is NOT a recommended practice for secure password policies?

A) Requiring minimum password length of 12 characters
B) Requiring a mix of uppercase, lowercase, digits, and special characters
C) Storing passwords in plaintext for easy recovery
D) Implementing account lockout after multiple failed attempts

**Answer**: C) Storing passwords in plaintext for easy recovery

**Explanation**: Passwords should never be stored in plaintext. They should be hashed using strong, salted hashing algorithms like bcrypt, making password recovery impossible and requiring password reset instead.

---

## Question 4

What security vulnerability does the following code exhibit?

```python
def login(username, password):
    if username in users and users[username] == password:
        return create_session(username)
    return None
```

A) SQL injection vulnerability
B) Timing attack vulnerability for username enumeration
C) CSRF vulnerability
D) Buffer overflow vulnerability

**Answer**: B) Timing attack vulnerability for username enumeration

**Explanation**: The code has different execution paths for valid vs invalid usernames, potentially allowing attackers to enumerate valid usernames by measuring response times.

---

## Question 5

Which HTTP header setting provides the BEST protection against CSRF attacks when using cookies?

A) `HttpOnly`
B) `Secure`
C) `SameSite=Strict`
D) `Max-Age`

**Answer**: C) `SameSite=Strict`

**Explanation**: The `SameSite=Strict` attribute prevents browsers from sending cookies with cross-site requests, effectively preventing CSRF attacks that rely on automatic cookie transmission.

---

## Question 6

What is a race condition in the context of web application security?

A) When multiple users access the same resource simultaneously
B) When the behavior of software depends on the relative timing of events
C) When network latency affects application performance
D) When database queries execute too slowly

**Answer**: B) When the behavior of software depends on the relative timing of events

**Explanation**: Race conditions occur when the software's behavior depends on the unpredictable timing of concurrent operations, potentially leading to security vulnerabilities like data corruption or privilege escalation.

---

## Question 7

Which of the following is the MOST secure way to handle concurrent account balance updates?

A) Use multiple threads to process updates faster
B) Implement database transactions with proper locking
C) Cache balance information in memory for faster access
D) Process all updates sequentially without any concurrency

**Answer**: B) Implement database transactions with proper locking

**Explanation**: Database transactions with proper locking ensure atomic operations and prevent race conditions while still allowing for reasonable concurrency and performance.

---

## Question 8

What type of security vulnerability is demonstrated by this configuration?

```python
app.config.update({
    'DEBUG': True,
    'SECRET_KEY': 'easy_to_guess',
    'SESSION_COOKIE_SECURE': False
})
```

A) Injection vulnerability
B) Security misconfiguration
C) Broken access control
D) Cryptographic failure

**Answer**: B) Security misconfiguration

**Explanation**: This shows multiple security misconfigurations: debug mode enabled in production, weak secret key, and insecure session cookies that can be transmitted over HTTP.

---

## Question 9

How do timing attacks against authentication systems typically work?

A) By measuring response times to infer information about valid credentials
B) By overwhelming the server with too many requests
C) By intercepting network packets during authentication
D) By exploiting buffer overflows in authentication code

**Answer**: A) By measuring response times to infer information about valid credentials

**Explanation**: Timing attacks exploit differences in processing time to gain information. For example, different response times for valid vs invalid usernames can allow username enumeration.

---

## Question 10

Which of the following is the BEST defense against timing attacks in authentication?

A) Implementing rate limiting to slow down attackers
B) Using constant-time comparison functions for all credential checks
C) Encrypting all authentication traffic with HTTPS
D) Adding random delays to all authentication responses

**Answer**: B) Using constant-time comparison functions for all credential checks

**Explanation**: Constant-time operations ensure that the execution time doesn't vary based on the input data, eliminating the timing side-channel that attackers could exploit.

---

## Question 11

What is the primary security risk of the following code pattern?

```python
if user_balance >= withdrawal_amount:
    # Processing delay here
    time.sleep(0.1)
    user_balance -= withdrawal_amount
```

A) Integer overflow
B) Race condition vulnerability
C) Memory leak
D) SQL injection

**Answer**: B) Race condition vulnerability

**Explanation**: The check-then-use pattern with a delay creates a race condition where the balance could be modified by another thread between the check and the actual withdrawal, potentially allowing overdrafts.

---

## Question 12

Which security header helps prevent clickjacking attacks?

A) `Content-Security-Policy`
B) `X-Frame-Options`
C) `Strict-Transport-Security`
D) `X-Content-Type-Options`

**Answer**: B) `X-Frame-Options`

**Explanation**: The `X-Frame-Options` header prevents pages from being displayed in frames or iframes, protecting against clickjacking attacks where malicious sites embed your page to trick users into clicking unintended elements.

---

## Question 13

What is the main advantage of using `hmac.compare_digest()` over regular string comparison?

A) It's faster for comparing long strings
B) It provides constant-time comparison to prevent timing attacks
C) It automatically handles unicode encoding issues
D) It uses less memory during comparison

**Answer**: B) It provides constant-time comparison to prevent timing attacks

**Explanation**: `hmac.compare_digest()` performs constant-time comparison regardless of where strings differ, preventing timing-based side-channel attacks that could leak information about the expected value.

---

## Question 14

Which of the following is NOT a common security misconfiguration?

A) Using default passwords on administrative accounts
B) Enabling debug mode in production
C) Implementing proper error handling
D) Having overly permissive file permissions

**Answer**: C) Implementing proper error handling

**Explanation**: Implementing proper error handling is actually a security best practice, not a misconfiguration. The other options are all common security misconfigurations that should be avoided.

---

## Question 15

What is the BEST approach for preventing broken authentication vulnerabilities?

A) Use only biometric authentication methods
B) Implement strong password policies, secure session management, and multi-factor authentication
C) Require users to change passwords daily
D) Store all authentication data in encrypted files

**Answer**: B) Implement strong password policies, secure session management, and multi-factor authentication

**Explanation**: A comprehensive approach including strong password policies, secure session management, and MFA provides the best protection against broken authentication vulnerabilities.

---

## Question 16

In the context of side-channel attacks, what information can be leaked through timing analysis?

A) The exact password being used
B) Information about valid usernames, password lengths, or authentication success
C) Complete database contents
D) Source code of the application

**Answer**: B) Information about valid usernames, password lengths, or authentication success

**Explanation**: Timing side-channels can leak information about the authentication process, such as whether a username exists, how many characters of a password are correct, or other implementation details.

---

## Question 17

Which code pattern is MOST vulnerable to race conditions?

A) Single-threaded sequential processing
B) Read-only database queries
C) Check-then-use operations on shared resources
D) Stateless function calls

**Answer**: C) Check-then-use operations on shared resources

**Explanation**: Check-then-use patterns are inherently vulnerable to race conditions because the state can change between the check and the use, especially in multi-threaded or concurrent environments.

---

## Question 18

What is the purpose of the `SameSite` cookie attribute?

A) To encrypt cookie data
B) To set cookie expiration time
C) To control when cookies are sent with cross-site requests
D) To compress cookie data for faster transmission

**Answer**: C) To control when cookies are sent with cross-site requests

**Explanation**: The `SameSite` attribute controls whether cookies are sent with cross-site requests, helping prevent CSRF attacks and providing privacy benefits.

---

## Question 19

Which of the following is a sign of potential timing attack attempts?

A) Large file uploads to the server
B) Rapid sequential requests to authentication endpoints from the same IP
C) Users accessing multiple pages quickly
D) High memory usage on the server

**Answer**: B) Rapid sequential requests to authentication endpoints from the same IP

**Explanation**: Timing attacks typically involve many rapid requests to the same endpoint (often authentication-related) to gather timing information, making this pattern highly suspicious.

---

## Question 20

What is the MOST important principle for preventing web application vulnerabilities?

A) Using the latest programming framework
B) Implementing security throughout the development lifecycle
C) Focusing only on input validation
D) Relying solely on network security measures

**Answer**: B) Implementing security throughout the development lifecycle

**Explanation**: Security must be considered at every stage of development - from design through deployment and maintenance. This comprehensive approach is more effective than any single security measure.

---

**Quiz Summary**: This quiz tests understanding of web application vulnerabilities including CSRF, broken authentication, security misconfigurations, race conditions, and side-channel attacks. The concepts covered are essential for developing secure web applications and understanding how to prevent common attack vectors.
