# Section 16.1: Input Validation & Sanitization

## Learning Objectives

By the end of this section, you will be able to:

- **Prevent SQL injection attacks** through proper input validation and parameterized queries

- **Mitigate XSS (Cross-Site Scripting)** vulnerabilities with input sanitization and output encoding

- **Apply input validation strategies** using whitelist and blacklist approaches effectively

- **Design safe error messages** that don't leak sensitive system information

- **Implement secure file upload** functionality with proper validation and restrictions

## Why Input Validation Matters

Input validation is the first line of defense against many of the most dangerous web application vulnerabilities. According to the OWASP Top 10, injection attacks consistently rank as the #1 security risk.

**Without proper input validation:**

- Attackers can inject malicious SQL commands to access or modify database data

- Cross-site scripting attacks can steal user sessions and execute malicious scripts

- File uploads can introduce malware or allow system compromise

- Data corruption can occur from malformed input

- System resources can be exhausted through malicious input

## SQL Injection Prevention

SQL injection occurs when user input is directly concatenated into SQL queries, allowing attackers to inject malicious SQL commands.

### Vulnerable Code Example

```python
import sqlite3
from flask import Flask, request

# VULNERABLE: Never do this!
def get_user_vulnerable(username, password):
    """Example of vulnerable SQL injection code - DO NOT USE"""
    
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Dangerous: Direct string concatenation
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    
    print(f"Executing query: {query}")  # This would reveal the vulnerability
    
    cursor.execute(query)
    result = cursor.fetchone()
    
    conn.close()
    return result

# How an attacker could exploit this:
# username: admin' OR '1'='1' --
# This creates the query: SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = '...'
# The -- comments out the password check, bypassing authentication

```

### Secure Implementation with Parameterized Queries

```python-template
import sqlite3
import hashlib
import secrets
from typing import Optional, Dict, Any

class SecureDatabaseManager:
    def __init__(self, db_path: str = "secure_users.db"):
        self.db_path = db_path
        self.setup_database()
    
    def setup_database(self):
        """Initialize database with secure schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create users table with proper constraints
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                failed_login_attempts INTEGER DEFAULT 0,
                account_locked BOOLEAN DEFAULT FALSE
            )
        ''')
        
        # Create audit log table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                ip_address TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                success BOOLEAN,
                details TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def authenticate_user(self, username: str, password: str, ip_address: str = "unknown") -> Optional[Dict[str, Any]]:
        """Securely authenticate user with parameterized queries"""
        
        if not self._validate_username(username) or not self._validate_password(password):
            self._log_authentication_attempt(None, "authentication", ip_address, False, "Invalid input format")
            return None
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Use parameterized query to prevent SQL injection
            cursor.execute('''
                SELECT id, username, email, password_hash, salt, account_locked, failed_login_attempts
                FROM users 
                WHERE username = ? AND account_locked = FALSE
            ''', (username,))
            
            user_data = cursor.fetchone()
            
            if not user_data:
                self._log_authentication_attempt(None, "authentication", ip_address, False, "User not found or locked")
                return None
            
            user_id, username, email, password_hash, salt, account_locked, failed_attempts = user_data
            
            # Verify password
            provided_hash = self._hash_password(password, salt)
            
            if secrets.compare_digest(provided_hash, password_hash):
                # Successful authentication
                cursor.execute('''
                    UPDATE users 
                    SET last_login = CURRENT_TIMESTAMP, failed_login_attempts = 0
                    WHERE id = ?
                ''', (user_id,))
                
                self._log_authentication_attempt(user_id, "authentication", ip_address, True, "Successful login")
                
                conn.commit()
                
                return {
                    'id': user_id,
                    'username': username,
                    'email': email,
                    'authenticated': True
                }
            else:
                # Failed authentication - increment failed attempts
                new_failed_attempts = failed_attempts + 1
                account_locked = new_failed_attempts >= 5
                
                cursor.execute('''
                    UPDATE users 
                    SET failed_login_attempts = ?, account_locked = ?
                    WHERE id = ?
                ''', (new_failed_attempts, account_locked, user_id))
                
                self._log_authentication_attempt(user_id, "authentication", ip_address, False, 
                                               f"Failed password attempt {new_failed_attempts}")
                
                conn.commit()
                return None
                
        except sqlite3.Error as e:
            self._log_authentication_attempt(None, "authentication", ip_address, False, f"Database error: {str(e)}")
            return None
        finally:
            conn.close()
    
    def create_user(self, username: str, email: str, password: str) -> bool:
        """Securely create new user with input validation"""
        
        # Validate all inputs
        validation_errors = []
        
        if not self._validate_username(username):
            validation_errors.append("Invalid username format")
        
        if not self._validate_email(email):
            validation_errors.append("Invalid email format")
        
        if not self._validate_password_strength(password):
            validation_errors.append("Password does not meet security requirements")
        
        if validation_errors:
            return False, validation_errors
        
        # Generate salt and hash password
        salt = secrets.token_hex(32)
        password_hash = self._hash_password(password, salt)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Use parameterized query to safely insert user
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, salt)
                VALUES (?, ?, ?, ?)
            ''', (username, email, password_hash, salt))
            
            user_id = cursor.lastrowid
            
            self._log_authentication_attempt(user_id, "user_creation", "system", True, "User created successfully")
            
            conn.commit()
            return True, "User created successfully"
            
        except sqlite3.IntegrityError as e:
            if "username" in str(e):
                return False, ["Username already exists"]
            elif "email" in str(e):
                return False, ["Email already registered"]
            else:
                return False, ["User creation failed"]
        except sqlite3.Error:
            return False, ["Database error occurred"]
        finally:
            conn.close()
    
    def search_users(self, search_term: str, search_type: str = "username") -> list:
        """Securely search users with parameterized queries"""
        
        if not self._validate_search_input(search_term, search_type):
            return []
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            if search_type == "username":
                # Use LIKE with parameterized query for safe search
                cursor.execute('''
                    SELECT id, username, email, created_at
                    FROM users
                    WHERE username LIKE ? AND account_locked = FALSE
                    LIMIT 50
                ''', (f"%{search_term}%",))
            
            elif search_type == "email":
                cursor.execute('''
                    SELECT id, username, email, created_at
                    FROM users
                    WHERE email LIKE ? AND account_locked = FALSE
                    LIMIT 50
                ''', (f"%{search_term}%",))
            
            results = cursor.fetchall()
            
            return [
                {
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'created_at': row[3]
                }
                for row in results
            ]
            
        except sqlite3.Error:
            return []
        finally:
            conn.close()
    
    def _validate_username(self, username: str) -> bool:
        """Validate username format"""
        if not username or len(username) < 3 or len(username) > 50:
            return False
        
        # Only allow alphanumeric characters and underscores
        import re
        return bool(re.match(r'^[a-zA-Z0-9_]+$', username))
    
    def _validate_email(self, email: str) -> bool:
        """Validate email format"""
        if not email or len(email) > 254:
            return False
        
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(email_pattern, email))
    
    def _validate_password(self, password: str) -> bool:
        """Basic password validation"""
        return password and len(password) <= 128  # Prevent DoS through large passwords
    
    def _validate_password_strength(self, password: str) -> bool:
        """Validate password meets security requirements"""
        if not password or len(password) < 8 or len(password) > 128:
            return False
        
        # Check for required character types
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
        
        return has_upper and has_lower and has_digit and has_special
    
    def _validate_search_input(self, search_term: str, search_type: str) -> bool:
        """Validate search parameters"""
        if not search_term or len(search_term) > 100:
            return False
        
        if search_type not in ["username", "email"]:
            return False
        
        # Prevent injection through search terms
        dangerous_chars = ["'", '"', ";", "--", "/*", "*/", "xp_", "sp_"]
        search_lower = search_term.lower()
        
        return not any(dangerous in search_lower for dangerous in dangerous_chars)
    
    def _hash_password(self, password: str, salt: str) -> str:
        """Hash password with salt"""
        return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex()
    
    def _log_authentication_attempt(self, user_id: Optional[int], action: str, 
                                  ip_address: str, success: bool, details: str):
        """Log authentication attempts for security monitoring"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO audit_log (user_id, action, ip_address, success, details)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, action, ip_address, success, details))
            
            conn.commit()
        except sqlite3.Error:
            pass  # Don't let logging errors affect main functionality
        finally:
            conn.close()

# Demonstration of SQL injection protection
def demonstrate_sql_injection_protection():
    """Demonstrate secure database operations"""
    
    print("=== SQL Injection Protection Demo ===")
    
    db_manager = SecureDatabaseManager()
    
    # Create test users
    test_users = [
        ("admin", "admin@school.edu", "SecurePassword123!"),
        ("student1", "student1@school.edu", "MyPassword456@"),
        ("teacher", "teacher@school.edu", "TeachPass789#")
    ]
    
    print("Creating test users...")
    for username, email, password in test_users:
        success, message = db_manager.create_user(username, email, password)
        print(f"  {username}: {message}")
    
    print("\n=== Testing Legitimate Authentication ===")
    
    # Test legitimate login
    user = db_manager.authenticate_user("admin", "SecurePassword123!", "192.168.1.100")
    if user:
        print(f"✅ Successful login: {user['username']}")
    else:
        print("❌ Authentication failed")
    
    print("\n=== Testing SQL Injection Attempts ===")
    
    # Common SQL injection attempts that would fail
    injection_attempts = [
        ("admin' OR '1'='1' --", "anything"),
        ("admin'; DROP TABLE users; --", "password"),
        ("' UNION SELECT * FROM users --", "test"),
        ("admin' OR 1=1 #", "password")
    ]
    
    for malicious_username, password in injection_attempts:
        print(f"Attempting injection: {malicious_username}")
        user = db_manager.authenticate_user(malicious_username, password, "192.168.1.200")
        
        if user:
            print("  ❌ SECURITY BREACH: Injection successful!")
        else:
            print("  ✅ Injection blocked by parameterized queries")
    
    print("\n=== Testing Secure Search ===")
    
    # Test search functionality
    search_results = db_manager.search_users("admin", "username")
    print(f"Search results for 'admin': {len(search_results)} users found")
    
    # Test search with potential injection
    malicious_search = "'; DROP TABLE users; --"
    search_results = db_manager.search_users(malicious_search, "username")
    print(f"Malicious search results: {len(search_results)} users found (should be 0)")

```

## Cross-Site Scripting (XSS) Prevention

XSS attacks inject malicious scripts into web applications that execute in other users' browsers, potentially stealing sessions, credentials, or personal data.

### Types of XSS Attacks

**Stored XSS**: Malicious script stored in database and executed when data is displayed
**Reflected XSS**: Malicious script reflected back from server in response
**DOM-based XSS**: Client-side script modifies page DOM in unsafe way

### Secure Input Sanitization and Output Encoding

```python-template
import html
import re
import bleach
from urllib.parse import quote, unquote
from typing import Dict, List, Any, Optional

class XSSProtectionManager:
    def __init__(self):
        # Define allowed HTML tags and attributes for rich content
        self.allowed_tags = [
            'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'
        ]
        
        self.allowed_attributes = {
            '*': ['class'],  # Allow class attribute on all tags
            'a': ['href', 'title'],  # Allow href and title on links
            'img': ['src', 'alt', 'width', 'height']  # Allow specific attributes on images
        }
        
        # Protocols allowed in links
        self.allowed_protocols = ['http', 'https', 'mailto']
    
    def sanitize_html_input(self, user_input: str, allow_html: bool = False) -> str:
        """Sanitize HTML input to prevent XSS attacks"""
        
        if not user_input:
            return ""
        
        if not allow_html:
            # For plain text input, escape all HTML
            return html.escape(user_input)
        
        # For rich text input, use bleach to allow safe HTML only
        cleaned = bleach.clean(
            user_input,
            tags=self.allowed_tags,
            attributes=self.allowed_attributes,
            protocols=self.allowed_protocols,
            strip=True  # Remove disallowed tags entirely
        )
        
        return cleaned
    
    def sanitize_url_parameter(self, param_value: str) -> str:
        """Sanitize URL parameters to prevent XSS through URL manipulation"""
        
        if not param_value:
            return ""
        
        # URL decode first to catch double-encoded attacks
        try:
            decoded = unquote(param_value)
        except:
            decoded = param_value
        
        # Check for common XSS patterns
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'vbscript:',
            r'onload\s*=',
            r'onerror\s*=',
            r'onclick\s*=',
            r'onmouseover\s*=',
            r'<iframe[^>]*>',
            r'<object[^>]*>',
            r'<embed[^>]*>'
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, decoded, re.IGNORECASE):
                return ""  # Reject the entire parameter if dangerous content found
        
        # Escape HTML entities
        sanitized = html.escape(decoded)
        
        # Limit length to prevent DoS
        return sanitized[:1000]
    
    def create_safe_html_output(self, content: Dict[str, Any], context: str = "general") -> str:
        """Create safe HTML output with proper encoding based on context"""
        
        if context == "html_content":
            # For HTML content context
            return self.sanitize_html_input(str(content.get('html', '')), allow_html=True)
        
        elif context == "html_attribute":
            # For HTML attribute context (like title, alt text)
            value = str(content.get('text', ''))
            # Escape quotes and HTML entities
            return html.escape(value, quote=True)
        
        elif context == "javascript_string":
            # For JavaScript string context
            value = str(content.get('text', ''))
            # Escape for JavaScript context
            escaped = value.replace('\\', '\\\\').replace("'", "\\'").replace('"', '\\"')
            escaped = escaped.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')
            return escaped
        
        elif context == "css_value":
            # For CSS value context
            value = str(content.get('text', ''))
            # Only allow alphanumeric and safe CSS characters
            safe_css = re.sub(r'[^a-zA-Z0-9\-_\s#.]', '', value)
            return safe_css[:100]  # Limit length
        
        else:
            # Default: plain text context
            return html.escape(str(content.get('text', '')))
    
    def validate_and_sanitize_form_data(self, form_data: Dict[str, str]) -> Dict[str, Any]:
        """Validate and sanitize form data comprehensively"""
        
        sanitized_data = {}
        validation_errors = []
        
        for field_name, field_value in form_data.items():
            
            if field_name == "username":
                sanitized_value = self._sanitize_username(field_value)
                if not sanitized_value:
                    validation_errors.append(f"Invalid username: {field_name}")
                else:
                    sanitized_data[field_name] = sanitized_value
            
            elif field_name == "email":
                sanitized_value = self._sanitize_email(field_value)
                if not sanitized_value:
                    validation_errors.append(f"Invalid email: {field_name}")
                else:
                    sanitized_data[field_name] = sanitized_value
            
            elif field_name == "password":
                # Don't log or store raw passwords
                if self._validate_password_format(field_value):
                    sanitized_data[field_name] = field_value  # Keep original for hashing
                else:
                    validation_errors.append("Password does not meet requirements")
            
            elif field_name in ["comment", "description", "bio"]:
                # Rich text fields - allow some HTML
                sanitized_value = self.sanitize_html_input(field_value, allow_html=True)
                sanitized_data[field_name] = sanitized_value
            
            elif field_name == "website_url":
                sanitized_value = self._sanitize_url(field_value)
                if field_value and not sanitized_value:
                    validation_errors.append("Invalid website URL")
                else:
                    sanitized_data[field_name] = sanitized_value
            
            else:
                # Default: treat as plain text
                sanitized_data[field_name] = self.sanitize_html_input(field_value, allow_html=False)
        
        return {
            'data': sanitized_data,
            'errors': validation_errors,
            'is_valid': len(validation_errors) == 0
        }
    
    def _sanitize_username(self, username: str) -> str:
        """Sanitize username input"""
        if not username:
            return ""
        
        # Remove HTML and limit to alphanumeric plus underscores
        cleaned = html.escape(username.strip())
        
        # Only allow safe characters
        safe_username = re.sub(r'[^a-zA-Z0-9_]', '', cleaned)
        
        # Length limits
        if len(safe_username) < 3 or len(safe_username) > 50:
            return ""
        
        return safe_username
    
    def _sanitize_email(self, email: str) -> str:
        """Sanitize email input"""
        if not email:
            return ""
        
        # Basic email validation and sanitization
        cleaned = html.escape(email.strip().lower())
        
        # Simple email regex validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if re.match(email_pattern, cleaned) and len(cleaned) <= 254:
            return cleaned
        
        return ""
    
    def _sanitize_url(self, url: str) -> str:
        """Sanitize URL input"""
        if not url:
            return ""
        
        cleaned = url.strip()
        
        # Ensure URL starts with safe protocol
        if not cleaned.startswith(('http://', 'https://')):
            cleaned = 'https://' + cleaned
        
        # Basic URL validation
        url_pattern = r'^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}([/\w.-]*)*/?$'
        
        if re.match(url_pattern, cleaned) and len(cleaned) <= 2000:
            return cleaned
        
        return ""
    
    def _validate_password_format(self, password: str) -> bool:
        """Validate password format without logging content"""
        if not password:
            return False
        
        # Length check
        if len(password) < 8 or len(password) > 128:
            return False
        
        # Check for required character types
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
        
        return has_upper and has_lower and has_digit and has_special

# Demonstration of XSS protection
def demonstrate_xss_protection():
    """Demonstrate XSS protection techniques"""
    
    print("=== XSS Protection Demo ===")
    
    xss_manager = XSSProtectionManager()
    
    # Test various XSS attack vectors
    malicious_inputs = [
        "<script>alert('XSS Attack!');</script>",
        "<img src='x' onerror='alert(\"XSS\")'>",
        "javascript:alert('XSS')",
        "<iframe src='javascript:alert(\"XSS\")'></iframe>",
        "<svg onload='alert(\"XSS\")'>",
        "Hello <script>document.cookie</script> World",
        "<a href='javascript:alert(\"XSS\")'>Click me</a>",
        "<div onclick='alert(\"XSS\")'>Clickable content</div>"
    ]
    
    print("Testing malicious inputs (plain text context):")
    for malicious_input in malicious_inputs:
        sanitized = xss_manager.sanitize_html_input(malicious_input, allow_html=False)
        print(f"Input:  {malicious_input}")
        print(f"Output: {sanitized}")
        print(f"Safe:   {'✅' if '<script' not in sanitized and 'javascript:' not in sanitized else '❌'}")
        print()
    
    print("=== Testing Rich Text Sanitization ===")
    
    rich_text_inputs = [
        "<p>This is <strong>safe</strong> HTML content.</p>",
        "<p>This has a <script>alert('bad')</script> script tag.</p>",
        "<h1>Title</h1><p>Paragraph with <em>emphasis</em></p>",
        "<a href='https://safe.com'>Safe link</a>",
        "<a href='javascript:alert(\"bad\")'>Dangerous link</a>",
        "<img src='image.jpg' alt='Safe image'>",
        "<img src='x' onerror='alert(\"bad\")' alt='Dangerous image'>"
    ]
    
    for rich_input in rich_text_inputs:
        sanitized = xss_manager.sanitize_html_input(rich_input, allow_html=True)
        print(f"Input:  {rich_input}")
        print(f"Output: {sanitized}")
        print()
    
    print("=== Testing Form Data Validation ===")
    
    # Test form data with mixed content
    test_form_data = {
        "username": "student<script>alert('xss')</script>123",
        "email": "test@example.com<script>alert('xss')</script>",
        "password": "SecurePass123!",
        "bio": "<p>I'm a student at <strong>Example School</strong>.</p><script>alert('xss')</script>",
        "website_url": "https://mystudentblog.com",
        "comment": "This is my comment with <em>emphasis</em> and <script>bad content</script>"
    }
    
    validation_result = xss_manager.validate_and_sanitize_form_data(test_form_data)
    
    print("Form validation results:")
    print(f"Valid: {validation_result['is_valid']}")
    print(f"Errors: {validation_result['errors']}")
    
    print("\nSanitized data:")
    for field, value in validation_result['data'].items():
        if field != 'password':  # Don't display password
            print(f"  {field}: {value}")

```

## Input Validation Strategies: Whitelist vs Blacklist

Understanding when and how to use whitelist (allow-list) and blacklist (deny-list) approaches is crucial for effective input validation.

### Whitelist Approach (Recommended)

**Whitelist validation** explicitly defines what input is allowed, rejecting everything else.

**Advantages:**

- More secure by default

- Easier to maintain comprehensive security

- Prevents unknown attack vectors

- Clear specification of expected input

**Use whitelist for:**

- User registration forms

- Configuration settings

- File type uploads

- API parameters with known formats

```python-template
import re
from typing import List, Dict, Any, Optional
from enum import Enum

class ValidationResult(Enum):
    VALID = "valid"
    INVALID_FORMAT = "invalid_format"
    INVALID_LENGTH = "invalid_length"
    INVALID_CHARACTERS = "invalid_characters"
    MISSING_REQUIRED = "missing_required"

class WhitelistValidator:
    def __init__(self):
        # Define allowed patterns for different input types
        self.validation_patterns = {
            'username': r'^[a-zA-Z0-9_]{3,50}$',
            'email': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
            'phone': r'^\+?[1-9]\d{1,14}$',  # International format
            'postal_code': r'^[A-Z0-9]{3,10}$',
            'student_id': r'^S[0-9]{6}$',  # School-specific format
            'course_code': r'^[A-Z]{2,4}[0-9]{3,4}$'
        }
        
        # Define allowed values for specific fields
        self.allowed_values = {
            'grade_level': ['7', '8', '9', '10', '11', '12'],
            'subject': ['Mathematics', 'English', 'Science', 'History', 'Art', 'PE'],
            'user_role': ['student', 'teacher', 'admin', 'parent'],
            'file_extension': ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png'],
            'country_code': ['AU', 'US', 'UK', 'CA', 'NZ', 'SG']
        }
        
        # Define length limits
        self.length_limits = {
            'username': (3, 50),
            'password': (8, 128),
            'email': (5, 254),
            'first_name': (1, 50),
            'last_name': (1, 50),
            'comment': (1, 1000),
            'description': (1, 2000)
        }
    
    def validate_field(self, field_name: str, value: str, required: bool = True) -> Dict[str, Any]:
        """Validate a field using whitelist approach"""
        
        result = {
            'field': field_name,
            'value': value,
            'is_valid': False,
            'error': None,
            'sanitized_value': None
        }
        
        # Check if field is required
        if required and (not value or value.strip() == ""):
            result['error'] = ValidationResult.MISSING_REQUIRED
            return result
        
        # If not required and empty, consider valid
        if not required and (not value or value.strip() == ""):
            result['is_valid'] = True
            result['sanitized_value'] = ""
            return result
        
        # Trim whitespace
        sanitized = value.strip()
        
        # Check length limits
        if field_name in self.length_limits:
            min_len, max_len = self.length_limits[field_name]
            if len(sanitized) < min_len or len(sanitized) > max_len:
                result['error'] = ValidationResult.INVALID_LENGTH
                return result
        
        # Check against allowed values (exact match)
        if field_name in self.allowed_values:
            if sanitized not in self.allowed_values[field_name]:
                result['error'] = ValidationResult.INVALID_FORMAT
                return result
        
        # Check against regex patterns
        elif field_name in self.validation_patterns:
            pattern = self.validation_patterns[field_name]
            if not re.match(pattern, sanitized):
                result['error'] = ValidationResult.INVALID_FORMAT
                return result
        
        # Special validation for complex fields
        elif field_name == 'password':
            if not self._validate_password_complexity(sanitized):
                result['error'] = ValidationResult.INVALID_FORMAT
                return result
        
        elif field_name == 'date_of_birth':
            if not self._validate_date_format(sanitized):
                result['error'] = ValidationResult.INVALID_FORMAT
                return result
        
        else:
            # Default: allow alphanumeric and basic punctuation only
            if not re.match(r'^[a-zA-Z0-9\s\-_.@!?]+$', sanitized):
                result['error'] = ValidationResult.INVALID_CHARACTERS
                return result
        
        # If we reach here, validation passed
        result['is_valid'] = True
        result['sanitized_value'] = sanitized
        
        return result
    
    def validate_form(self, form_data: Dict[str, str], 
                     required_fields: List[str] = None) -> Dict[str, Any]:
        """Validate entire form using whitelist approach"""
        
        if required_fields is None:
            required_fields = []
        
        validation_results = {}
        sanitized_data = {}
        errors = []
        
        # Validate each field
        for field_name, field_value in form_data.items():
            is_required = field_name in required_fields
            
            validation_result = self.validate_field(field_name, field_value, is_required)
            validation_results[field_name] = validation_result
            
            if validation_result['is_valid']:
                sanitized_data[field_name] = validation_result['sanitized_value']
            else:
                errors.append({
                    'field': field_name,
                    'error': validation_result['error'].value,
                    'message': self._get_error_message(field_name, validation_result['error'])
                })
        
        # Check for required fields that weren't provided
        for required_field in required_fields:
            if required_field not in form_data:
                errors.append({
                    'field': required_field,
                    'error': ValidationResult.MISSING_REQUIRED.value,
                    'message': f"{required_field} is required"
                })
        
        return {
            'is_valid': len(errors) == 0,
            'sanitized_data': sanitized_data,
            'errors': errors,
            'field_results': validation_results
        }
    
    def _validate_password_complexity(self, password: str) -> bool:
        """Validate password meets complexity requirements"""
        if len(password) < 8 or len(password) > 128:
            return False
        
        # Check for required character types
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
        
        return has_upper and has_lower and has_digit and has_special
    
    def _validate_date_format(self, date_string: str) -> bool:
        """Validate date is in YYYY-MM-DD format and valid"""
        try:
            from datetime import datetime
            datetime.strptime(date_string, '%Y-%m-%d')
            return True
        except ValueError:
            return False
    
    def _get_error_message(self, field_name: str, error_type: ValidationResult) -> str:
        """Get user-friendly error message"""
        
        messages = {
            ValidationResult.MISSING_REQUIRED: f"{field_name} is required",
            ValidationResult.INVALID_FORMAT: f"{field_name} format is invalid",
            ValidationResult.INVALID_LENGTH: f"{field_name} length is invalid",
            ValidationResult.INVALID_CHARACTERS: f"{field_name} contains invalid characters"
        }
        
        return messages.get(error_type, f"{field_name} is invalid")

# Example usage of whitelist validation
def demonstrate_whitelist_validation():
    """Demonstrate whitelist validation approach"""
    
    print("=== Whitelist Validation Demo ===")
    
    validator = WhitelistValidator()
    
    # Test form data with various inputs
    test_form_data = {
        'username': 'student123',
        'email': 'student@school.edu',
        'grade_level': '11',
        'password': 'SecurePass123!',
        'first_name': 'Alice',
        'last_name': 'Johnson',
        'student_id': 'S123456',
        'course_code': 'MATH1001'
    }
    
    required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    # Validate form
    validation_result = validator.validate_form(test_form_data, required_fields)
    
    print(f"Form is valid: {validation_result['is_valid']}")
    
    if validation_result['errors']:
        print("Validation errors:")
        for error in validation_result['errors']:
            print(f"  {error['field']}: {error['message']}")
    
    print("\nSanitized data:")
    for field, value in validation_result['sanitized_data'].items():
        if field != 'password':  # Don't display password
            print(f"  {field}: {value}")
    
    print("\n=== Testing Invalid Inputs ===")
    
    # Test invalid inputs
    invalid_inputs = {
        'username': 'user@#$%',  # Invalid characters
        'email': 'invalid-email',  # Invalid format
        'grade_level': '13',  # Not in allowed values
        'student_id': '123456',  # Wrong format
        'password': 'weak'  # Too simple
    }
    
    for field, invalid_value in invalid_inputs.items():
        result = validator.validate_field(field, invalid_value)
        print(f"{field}: '{invalid_value}' -> {result['error'].value if result['error'] else 'VALID'}")

```

### Blacklist Approach (Use with Caution)

**Blacklist validation** defines what input is forbidden, allowing everything else.

**Disadvantages:**

- Difficult to anticipate all attack vectors

- New threats bypass existing blacklists

- Often leads to incomplete protection

- Harder to maintain comprehensive security

**Use blacklist only for:**

- Content filtering (profanity, spam)

- Basic malware detection

- Supplementary protection alongside whitelists

```python-template
class BlacklistValidator:
    def __init__(self):
        # Define dangerous patterns to block
        self.dangerous_patterns = [
            # SQL injection patterns
            r'union\s+select',
            r'drop\s+table',
            r'delete\s+from',
            r'insert\s+into',
            r'update\s+.*set',
            r'exec\s*\(',
            r'script\s*>',
            
            # XSS patterns
            r'<script[^>]*>',
            r'javascript:',
            r'vbscript:',
            r'onload\s*=',
            r'onerror\s*=',
            r'onclick\s*=',
            
            # File system attacks
            r'\.\./',
            r'\.\.\/',
            r'/etc/passwd',
            r'/windows/system32',
            
            # Command injection
            r';\s*rm\s+',
            r';\s*del\s+',
            r'&&\s*rm\s+',
            r'\|\s*nc\s+'
        ]
        
        # Blocked words for content filtering
        self.blocked_words = [
            'password', 'admin', 'root', 'system',
            'confidential', 'secret', 'private'
        ]
    
    def check_dangerous_patterns(self, input_text: str) -> Dict[str, Any]:
        """Check input against blacklist patterns"""
        
        if not input_text:
            return {'is_safe': True, 'threats_found': []}
        
        input_lower = input_text.lower()
        threats_found = []
        
        # Check against dangerous patterns
        for pattern in self.dangerous_patterns:
            if re.search(pattern, input_lower, re.IGNORECASE):
                threats_found.append({
                    'type': 'dangerous_pattern',
                    'pattern': pattern,
                    'location': 'input_text'
                })
        
        # Check for blocked words in non-password fields
        for word in self.blocked_words:
            if word in input_lower:
                threats_found.append({
                    'type': 'blocked_word',
                    'word': word,
                    'location': 'input_text'
                })
        
        return {
            'is_safe': len(threats_found) == 0,
            'threats_found': threats_found,
            'threat_count': len(threats_found)
        }

# Demonstrate why blacklist alone is insufficient
def demonstrate_blacklist_limitations():
    """Show limitations of blacklist-only validation"""
    
    print("=== Blacklist Validation Limitations ===")
    
    blacklist_validator = BlacklistValidator()
    
    # These attacks might bypass a simple blacklist
    evasion_attempts = [
        "uni/**/on sel/**/ect",  # SQL injection with comments
        "ScRiPt>",  # Case variation
        "java&#115;cript:",  # HTML entity encoding
        "j%61vascript:",  # URL encoding
        "%3Cscript%3E",  # URL encoded script tag
        "' OR '1'='1' --",  # Basic SQL injection
        "<img src=x onerror=alert(1)>",  # XSS without 'script'
        "eval(String.fromCharCode(97,108,101,114,116,40,49,41))"  # Obfuscated JavaScript
    ]
    
    print("Testing evasion attempts against blacklist:")
    for attempt in evasion_attempts:
        result = blacklist_validator.check_dangerous_patterns(attempt)
        status = "🛡️ BLOCKED" if not result['is_safe'] else "⚠️ BYPASSED"
        print(f"{status}: {attempt}")
        if result['threats_found']:
            for threat in result['threats_found']:
                print(f"  Detected: {threat['type']} - {threat.get('pattern', threat.get('word'))}")
        print()

```

## Safe Error Message Design

Error messages must be informative for legitimate users while avoiding information disclosure to attackers.

```python-template
from datetime import datetime
import logging
from typing import Dict, Any

class SafeErrorHandler:
    def __init__(self):
        # Setup logging for security events
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('security.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('SecurityHandler')
    
    def handle_authentication_error(self, username: str, ip_address: str, 
                                  error_details: str) -> str:
        """Handle authentication errors safely"""
        
        # Log detailed information for security monitoring
        self.logger.warning(
            f"Authentication failed - IP: {ip_address}, "
            f"Username: {username}, Details: {error_details}"
        )
        
        # Return generic message to user (don't reveal specific failure reason)
        return "Invalid username or password. Please try again."
    
    def handle_validation_error(self, field_name: str, error_type: str, 
                              user_input: str, ip_address: str) -> str:
        """Handle validation errors safely"""
        
        # Log for monitoring (be careful with sensitive data)
        safe_input = user_input[:50] + "..." if len(user_input) > 50 else user_input
        
        self.logger.info(
            f"Validation error - Field: {field_name}, Type: {error_type}, "
            f"IP: {ip_address}, Input: {safe_input}"
        )
        
        # Return safe, helpful message to user
        safe_messages = {
            'invalid_format': f"{field_name} format is incorrect. Please check and try again.",
            'invalid_length': f"{field_name} must be the correct length.",
            'missing_required': f"{field_name} is required.",
            'invalid_characters': f"{field_name} contains invalid characters."
        }
        
        return safe_messages.get(error_type, f"{field_name} is invalid.")
    
    def handle_database_error(self, operation: str, ip_address: str, 
                            error_details: str) -> str:
        """Handle database errors safely"""
        
        # Log detailed error for administrators
        self.logger.error(
            f"Database error - Operation: {operation}, IP: {ip_address}, "
            f"Error: {error_details}"
        )
        
        # Return generic message to user (don't reveal database structure)
        return "A temporary error occurred. Please try again later."
    
    def handle_file_upload_error(self, filename: str, error_type: str, 
                               ip_address: str) -> str:
        """Handle file upload errors safely"""
        
        self.logger.warning(
            f"File upload error - File: {filename}, Type: {error_type}, "
            f"IP: {ip_address}"
        )
        
        safe_messages = {
            'invalid_type': "File type not allowed. Please upload a valid file.",
            'too_large': "File is too large. Maximum size is 10MB.",
            'virus_detected': "File upload blocked for security reasons.",
            'invalid_name': "Invalid file name. Please rename and try again."
        }
        
        return safe_messages.get(error_type, "File upload failed.")
    
    def handle_rate_limit_error(self, ip_address: str, endpoint: str) -> str:
        """Handle rate limiting errors"""
        
        self.logger.warning(
            f"Rate limit exceeded - IP: {ip_address}, Endpoint: {endpoint}"
        )
        
        return "Too many requests. Please wait before trying again."

```

## File Upload Security

File uploads are a common attack vector that require comprehensive security measures.

```python-template
import os
import magic
import hashlib
from pathlib import Path
from typing import List, Dict, Any, Optional

class SecureFileUploadManager:
    def __init__(self, upload_directory: str = "uploads"):
        self.upload_directory = Path(upload_directory)
        self.upload_directory.mkdir(exist_ok=True, mode=0o755)
        
        # Configure allowed file types
        self.allowed_extensions = {
            '.pdf', '.doc', '.docx', '.txt', '.rtf',  # Documents
            '.jpg', '.jpeg', '.png', '.gif', '.bmp',  # Images
            '.zip', '.rar', '.7z'  # Archives (with caution)
        }
        
        # MIME type validation
        self.allowed_mime_types = {
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/rtf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/bmp',
            'application/zip',
            'application/x-rar-compressed',
            'application/x-7z-compressed'
        }
        
        # Size limits (in bytes)
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.max_total_size = 100 * 1024 * 1024  # 100MB per session
        
        # File name restrictions
        self.forbidden_names = {
            'con', 'prn', 'aux', 'nul',  # Windows reserved names
            'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
            'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'
        }
    
    def validate_file_upload(self, file_data: bytes, filename: str, 
                           user_id: str) -> Dict[str, Any]:
        """Comprehensively validate file upload"""
        
        result = {
            'is_valid': False,
            'errors': [],
            'safe_filename': None,
            'file_hash': None,
            'detected_type': None
        }
        
        # 1. Validate filename
        filename_validation = self._validate_filename(filename)
        if not filename_validation['is_valid']:
            result['errors'].extend(filename_validation['errors'])
            return result
        
        result['safe_filename'] = filename_validation['safe_filename']
        
        # 2. Validate file size
        if len(file_data) == 0:
            result['errors'].append("File is empty")
            return result
        
        if len(file_data) > self.max_file_size:
            result['errors'].append(f"File too large. Maximum size: {self.max_file_size // 1024 // 1024}MB")
            return result
        
        # 3. Validate file content and type
        content_validation = self._validate_file_content(file_data, filename)
        if not content_validation['is_valid']:
            result['errors'].extend(content_validation['errors'])
            return result
        
        result['detected_type'] = content_validation['detected_type']
        
        # 4. Generate file hash for deduplication and integrity
        file_hash = hashlib.sha256(file_data).hexdigest()
        result['file_hash'] = file_hash
        
        # 5. Check for existing file
        if self._file_exists(file_hash):
            result['errors'].append("File already exists")
            return result
        
        # 6. Virus scan (placeholder - integrate with actual antivirus)
        virus_scan_result = self._scan_for_viruses(file_data)
        if not virus_scan_result['is_clean']:
            result['errors'].append("File failed security scan")
            return result
        
        # If we reach here, file is valid
        result['is_valid'] = True
        return result
    
    def save_file_securely(self, file_data: bytes, validation_result: Dict[str, Any], 
                          user_id: str) -> Dict[str, Any]:
        """Save validated file securely"""
        
        if not validation_result['is_valid']:
            return {'success': False, 'error': 'File validation failed'}
        
        safe_filename = validation_result['safe_filename']
        file_hash = validation_result['file_hash']
        
        # Create user-specific directory
        user_dir = self.upload_directory / user_id
        user_dir.mkdir(exist_ok=True, mode=0o755)
        
        # Generate unique filename to prevent conflicts
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{file_hash[:8]}_{safe_filename}"
        
        file_path = user_dir / unique_filename
        
        try:
            # Write file with restricted permissions
            with open(file_path, 'wb') as f:
                f.write(file_data)
            
            # Set restrictive permissions
            os.chmod(file_path, 0o644)  # Read/write for owner, read for group
            
            # Store file metadata
            metadata = {
                'original_filename': safe_filename,
                'stored_filename': unique_filename,
                'file_hash': file_hash,
                'file_size': len(file_data),
                'mime_type': validation_result['detected_type'],
                'upload_time': datetime.now().isoformat(),
                'user_id': user_id,
                'file_path': str(file_path)
            }
            
            return {
                'success': True,
                'file_id': file_hash,
                'metadata': metadata
            }
            
        except Exception as e:
            return {'success': False, 'error': f'Failed to save file: {str(e)}'}
    
    def _validate_filename(self, filename: str) -> Dict[str, Any]:
        """Validate and sanitize filename"""
        
        result = {'is_valid': False, 'errors': [], 'safe_filename': None}
        
        if not filename:
            result['errors'].append("Filename is required")
            return result
        
        # Check length
        if len(filename) > 255:
            result['errors'].append("Filename too long")
            return result
        
        # Extract extension
        file_path = Path(filename)
        extension = file_path.suffix.lower()
        
        # Check extension
        if extension not in self.allowed_extensions:
            result['errors'].append(f"File type '{extension}' not allowed")
            return result
        
        # Check forbidden names
        name_without_ext = file_path.stem.lower()
        if name_without_ext in self.forbidden_names:
            result['errors'].append("Reserved filename not allowed")
            return result
        
        # Sanitize filename
        import re
        # Remove dangerous characters
        safe_name = re.sub(r'[<>:"/\\|?*]', '', file_path.stem)
        safe_name = re.sub(r'[\x00-\x1f]', '', safe_name)  # Remove control characters
        safe_name = safe_name.strip('. ')  # Remove leading/trailing dots and spaces
        
        if not safe_name:
            result['errors'].append("Invalid filename")
            return result
        
        # Reconstruct safe filename
        safe_filename = safe_name + extension
        
        result['is_valid'] = True
        result['safe_filename'] = safe_filename
        return result
    
    def _validate_file_content(self, file_data: bytes, filename: str) -> Dict[str, Any]:
        """Validate file content matches declared type"""
        
        result = {'is_valid': False, 'errors': [], 'detected_type': None}
        
        try:
            # Detect actual MIME type from content
            detected_mime = magic.from_buffer(file_data, mime=True)
            result['detected_type'] = detected_mime
            
            # Check if detected type is allowed
            if detected_mime not in self.allowed_mime_types:
                result['errors'].append(f"File content type '{detected_mime}' not allowed")
                return result
            
            # Verify extension matches content
            file_path = Path(filename)
            extension = file_path.suffix.lower()
            
            # Basic extension-to-MIME validation
            extension_mime_map = {
                '.pdf': 'application/pdf',
                '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                '.txt': 'text/plain',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif'
            }
            
            expected_mime = extension_mime_map.get(extension)
            if expected_mime and expected_mime != detected_mime:
                result['errors'].append("File extension doesn't match content type")
                return result
            
            result['is_valid'] = True
            return result
            
        except Exception as e:
            result['errors'].append(f"Could not analyze file content: {str(e)}")
            return result
    
    def _file_exists(self, file_hash: str) -> bool:
        """Check if file with same hash already exists"""
        # In production, check database or file index
        # For demo, just return False
        return False
    
    def _scan_for_viruses(self, file_data: bytes) -> Dict[str, Any]:
        """Basic virus scanning (integrate with real antivirus)"""
        
        # Simple heuristic checks
        suspicious_patterns = [
            b'<script',
            b'javascript:',
            b'vbscript:',
            b'eval(',
            b'document.cookie',
            b'window.location'
        ]
        
        file_lower = file_data.lower()
        
        for pattern in suspicious_patterns:
            if pattern in file_lower:
                return {'is_clean': False, 'threat': 'Suspicious content detected'}
        
        # In production, integrate with ClamAV or similar
        return {'is_clean': True}

# Demonstration of secure file upload
def demonstrate_secure_file_upload():
    """Demonstrate secure file upload handling"""
    
    print("=== Secure File Upload Demo ===")
    
    upload_manager = SecureFileUploadManager()
    
    # Simulate file upload tests
    test_files = [
        {
            'filename': 'document.pdf',
            'content': b'%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog',  # PDF header
            'description': 'Valid PDF file'
        },
        {
            'filename': 'malicious.exe',
            'content': b'MZ\x90\x00',  # PE executable header
            'description': 'Executable file (should be blocked)'
        },
        {
            'filename': 'script.txt',
            'content': b'<script>alert("xss")</script>',
            'description': 'Text file with suspicious content'
        },
        {
            'filename': '../../../etc/passwd',
            'content': b'root:x:0:0:root:/root:/bin/bash',
            'description': 'Path traversal attempt'
        }
    ]
    
    for test_file in test_files:
        print(f"\nTesting: {test_file['description']}")
        print(f"Filename: {test_file['filename']}")
        
        validation_result = upload_manager.validate_file_upload(
            test_file['content'],
            test_file['filename'],
            'test_user'
        )
        
        if validation_result['is_valid']:
            print("✅ File validation passed")
            
            save_result = upload_manager.save_file_securely(
                test_file['content'],
                validation_result,
                'test_user'
            )
            
            if save_result['success']:
                print(f"✅ File saved as: {save_result['metadata']['stored_filename']}")
            else:
                print(f"❌ Save failed: {save_result['error']}")
        else:
            print("❌ File validation failed:")
            for error in validation_result['errors']:
                print(f"  - {error}")

# Example: Complete secure user registration system
def demonstrate_complete_secure_registration():
    """Demonstrate complete secure user registration with all protections"""
    
    print("=== Complete Secure Registration System Demo ===")
    
    # Initialize all security components
    db_manager = SecureDatabaseManager()
    xss_manager = XSSProtectionManager()
    validator = WhitelistValidator()
    error_handler = SafeErrorHandler()
    
    # Simulate user registration form submission
    registration_data = {
        'username': 'newstudent123',
        'email': 'newstudent@school.edu',
        'password': 'SecureStudentPass123!',
        'first_name': 'John',
        'last_name': 'Smith',
        'grade_level': '11',
        'bio': '<p>I enjoy <strong>mathematics</strong> and science.</p>'
    }
    
    required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    print("1. Input Validation...")
    
    # Step 1: Whitelist validation
    validation_result = validator.validate_form(registration_data, required_fields)
    
    if not validation_result['is_valid']:
        print("❌ Validation failed:")
        for error in validation_result['errors']:
            safe_error = error_handler.handle_validation_error(
                error['field'], error['error'], 
                registration_data.get(error['field'], ''), 
                '192.168.1.100'
            )
            print(f"  {safe_error}")
        return
    
    print("✅ Input validation passed")
    
    # Step 2: XSS protection
    print("2. XSS Protection...")
    xss_result = xss_manager.validate_and_sanitize_form_data(registration_data)
    
    if not xss_result['is_valid']:
        print("❌ XSS protection failed:")
        for error in xss_result['errors']:
            print(f"  {error}")
        return
    
    print("✅ XSS protection passed")
    
    # Step 3: Database insertion with SQL injection protection
    print("3. Secure Database Operation...")
    
    sanitized_data = validation_result['sanitized_data']
    
    success, message = db_manager.create_user(
        sanitized_data['username'],
        sanitized_data['email'],
        sanitized_data['password']
    )
    
    if success:
        print(f"✅ User registration successful: {message}")
    else:
        safe_error = error_handler.handle_database_error(
            'user_creation', '192.168.1.100', str(message)
        )
        print(f"❌ Registration failed: {safe_error}")

```

## Summary

**Input validation and sanitization form the foundation of secure web applications:**

**SQL Injection Prevention:**

- **Always use parameterized queries** - never concatenate user input directly into SQL

- **Validate all input** before database operations

- **Apply principle of least privilege** to database accounts

- **Monitor and log** authentication attempts and database errors

**XSS Protection:**

- **Escape output by default** - encode data when displaying to users

- **Use whitelist validation** for rich content

- **Apply context-aware encoding** (HTML, JavaScript, CSS contexts require different approaches)

- **Implement Content Security Policy** to restrict script execution

**Input Validation Strategy:**

- **Prefer whitelist over blacklist** approaches

- **Validate both format and content** of uploaded files

- **Implement multiple layers** of validation

- **Fail securely** when validation errors occur

**Safe Error Handling:**

- **Log detailed errors** for administrators

- **Return generic messages** to users

- **Avoid information disclosure** in error responses

- **Monitor error patterns** for attack detection

**File Upload Security:**

- **Validate file types** by content, not just extension

- **Scan for malware** before storage

- **Use secure file naming** to prevent conflicts and attacks

- **Apply size limits** to prevent resource exhaustion

**Implementation best practices:**

- **Defense in depth**: Multiple validation layers

- **Fail securely**: Default to rejecting suspicious input

- **Log security events**: Monitor for attack patterns

- **Regular updates**: Keep security libraries current

Understanding and implementing comprehensive input validation protects applications from the majority of common web vulnerabilities and provides a solid foundation for secure system design.
