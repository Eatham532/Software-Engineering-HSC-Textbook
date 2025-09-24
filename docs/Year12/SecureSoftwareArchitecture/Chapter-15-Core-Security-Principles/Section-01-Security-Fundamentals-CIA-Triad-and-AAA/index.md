# Section 15.1: Security Fundamentals (CIA Triad & AAA)

## Learning Objectives

By the end of this section, you will be able to:

- **Understand confidentiality** and implement data access controls to prevent unauthorized disclosure

- **Ensure data integrity** and protect against unauthorized modification or corruption

- **Maintain system availability** and protect against service disruption attacks

- **Implement authentication** to verify user identities securely

- **Design authorization** systems to control access to resources

- **Establish accountability** through comprehensive logging and audit trails

## Why Security Fundamentals Matter

Every security decision in software development traces back to six fundamental principles. Understanding these principles helps developers make consistent security choices and communicate security needs to stakeholders.

The **CIA Triad** (Confidentiality, Integrity, Availability) defines what we're protecting, while **AAA** (Authentication, Authorization, Accountability) defines how we protect it.

## The CIA Triad: What We Protect

### Confidentiality: Protecting Information from Unauthorized Access

**Confidentiality** ensures that sensitive information is accessible only to those authorized to view it.

**Real-world example**: Medical records should only be viewable by patients, their doctors, and authorized medical staff.

**Common confidentiality threats:**

- **Data breaches**: Unauthorized access to databases or files

- **Eavesdropping**: Intercepting network communications

- **Social engineering**: Tricking people into revealing information

- **Insider threats**: Authorized users accessing data beyond their role

**Confidentiality implementation strategies:**

```python
import os
from cryptography.fernet import Fernet
import getpass

class ConfidentialDataHandler:
    def __init__(self):
        # Generate or load encryption key
        self.key = self._get_or_create_key()
        self.cipher = Fernet(self.key)
    
    def _get_or_create_key(self):
        """Securely manage encryption keys"""
        key_file = "secret.key"
        if os.path.exists(key_file):
            with open(key_file, "rb") as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            # In production, store this securely (not in plain file)
            with open(key_file, "wb") as f:
                f.write(key)
            return key
    
    def encrypt_sensitive_data(self, data):
        """Encrypt data before storage"""
        if isinstance(data, str):
            data = data.encode()
        return self.cipher.encrypt(data)
    
    def decrypt_sensitive_data(self, encrypted_data):
        """Decrypt data for authorized access"""
        decrypted = self.cipher.decrypt(encrypted_data)
        return decrypted.decode()
    
    def secure_input(self, prompt):
        """Get sensitive input without echoing to screen"""
        return getpass.getpass(prompt)

# Example usage for protecting student grades
def store_student_grade(student_id, grade, subject):
    """Store encrypted student grade"""
    handler = ConfidentialDataHandler()
    
    # Create sensitive data record
    grade_data = f"Student: {student_id}, Subject: {subject}, Grade: {grade}"
    
    # Encrypt before storage
    encrypted_grade = handler.encrypt_sensitive_data(grade_data)
    
    # Store encrypted data (database/file)
    with open(f"grades_{student_id}.enc", "wb") as f:
        f.write(encrypted_grade)
    
    print("Grade stored securely")

def retrieve_student_grade(student_id, authorized_user):
    """Retrieve and decrypt grade for authorized users only"""
    # Authorization check (simplified)
    if not is_authorized(authorized_user, student_id):
        raise PermissionError("Unauthorized access to student grades")
    
    handler = ConfidentialDataHandler()
    
    try:
        with open(f"grades_{student_id}.enc", "rb") as f:
            encrypted_grade = f.read()
        
        # Decrypt for authorized access
        grade_data = handler.decrypt_sensitive_data(encrypted_grade)
        return grade_data
    
    except FileNotFoundError:
        return "No grades found for student"

def is_authorized(user, student_id):
    """Check if user is authorized to access student data"""
    # Simplified authorization logic
    authorized_roles = ['teacher', 'admin', 'student_self']
    return user.role in authorized_roles and (
        user.role != 'student_self' or user.student_id == student_id
    )

```

### Integrity: Ensuring Data Accuracy and Trustworthiness

**Integrity** ensures that data remains accurate, complete, and unmodified by unauthorized parties.

**Real-world example**: Bank account balances must remain accurate - unauthorized modifications could result in financial fraud.

**Common integrity threats:**

- **Data tampering**: Unauthorized modification of records

- **Malicious code injection**: SQL injection, script injection

- **Man-in-the-middle attacks**: Altering data in transit

- **System compromises**: Malware modifying files or databases

**Integrity implementation strategies:**

```python
import hashlib
import hmac
import json
from datetime import datetime

class DataIntegrityManager:
    def __init__(self, secret_key):
        self.secret_key = secret_key.encode() if isinstance(secret_key, str) else secret_key
    
    def calculate_hash(self, data):
        """Calculate SHA-256 hash of data"""
        if isinstance(data, str):
            data = data.encode()
        return hashlib.sha256(data).hexdigest()
    
    def calculate_hmac(self, data):
        """Calculate HMAC for data authentication"""
        if isinstance(data, str):
            data = data.encode()
        return hmac.new(self.secret_key, data, hashlib.sha256).hexdigest()
    
    def create_signed_record(self, data):
        """Create a record with integrity protection"""
        # Add timestamp for freshness
        record = {
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'version': 1
        }
        
        # Convert to JSON for consistent serialization
        record_json = json.dumps(record, sort_keys=True)
        
        # Add integrity signature
        record['signature'] = self.calculate_hmac(record_json)
        
        return record
    
    def verify_record_integrity(self, record):
        """Verify that record hasn't been tampered with"""
        if 'signature' not in record:
            return False, "No signature found"
        
        # Remove signature for verification
        original_signature = record.pop('signature')
        
        # Recalculate signature
        record_json = json.dumps(record, sort_keys=True)
        calculated_signature = self.calculate_hmac(record_json)
        
        # Restore signature
        record['signature'] = original_signature
        
        # Compare signatures
        if hmac.compare_digest(original_signature, calculated_signature):
            return True, "Record integrity verified"
        else:
            return False, "Record has been tampered with"

# Example usage for protecting grade integrity
def store_protected_grade(student_id, grade, subject):
    """Store grade with integrity protection"""
    integrity_manager = DataIntegrityManager("school_secret_key_2024")
    
    grade_data = {
        'student_id': student_id,
        'subject': subject,
        'grade': grade,
        'teacher_id': 'T001',
        'semester': '2024-1'
    }
    
    # Create signed record
    protected_record = integrity_manager.create_signed_record(grade_data)
    
    # Store with integrity protection
    with open(f"protected_grade_{student_id}_{subject}.json", "w") as f:
        json.dump(protected_record, f, indent=2)
    
    print(f"Grade stored with integrity protection")

def retrieve_verified_grade(student_id, subject):
    """Retrieve and verify grade integrity"""
    integrity_manager = DataIntegrityManager("school_secret_key_2024")
    
    try:
        with open(f"protected_grade_{student_id}_{subject}.json", "r") as f:
            record = json.load(f)
        
        # Verify integrity
        is_valid, message = integrity_manager.verify_record_integrity(record)
        
        if is_valid:
            return record['data'], "Grade verified as authentic"
        else:
            raise ValueError(f"Grade integrity violation: {message}")
    
    except FileNotFoundError:
        return None, "Grade record not found"

# Demonstrate integrity checking
def demonstrate_tampering_detection():
    """Show how tampering is detected"""
    # Store original grade
    store_protected_grade("S001", 95, "Mathematics")
    
    # Retrieve and verify (should work)
    grade_data, message = retrieve_verified_grade("S001", "Mathematics")
    print(f"Original: {grade_data['grade']} - {message}")
    
    # Simulate tampering
    with open("protected_grade_S001_Mathematics.json", "r") as f:
        tampered_record = json.load(f)
    
    # Change grade without updating signature
    tampered_record['data']['grade'] = 100
    
    with open("protected_grade_S001_Mathematics.json", "w") as f:
        json.dump(tampered_record, f, indent=2)
    
    # Try to retrieve tampered grade (should fail)
    try:
        grade_data, message = retrieve_verified_grade("S001", "Mathematics")
    except ValueError as e:
        print(f"Tampering detected: {e}")

```

### Availability: Maintaining System Accessibility

**Availability** ensures that systems and data remain accessible to authorized users when needed.

**Real-world example**: Online banking systems must be available 24/7 for customers to access their accounts and make transactions.

**Common availability threats:**

- **Denial of Service (DoS) attacks**: Overwhelming systems with requests

- **Resource exhaustion**: Memory leaks, storage space depletion

- **Hardware failures**: Server crashes, network outages

- **Software bugs**: Infinite loops, deadlocks, crashes

**Availability implementation strategies:**

```python
import time
import threading
from datetime import datetime, timedelta
from collections import defaultdict, deque
import functools

class AvailabilityProtector:
    def __init__(self):
        self.request_counts = defaultdict(deque)
        self.blocked_ips = {}
        self.health_status = True
        self.start_time = datetime.now()
    
    def rate_limiter(self, max_requests=10, time_window=60):
        """Decorator to implement rate limiting"""
        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                client_ip = kwargs.get('client_ip', 'unknown')
                current_time = time.time()
                
                # Clean old requests outside time window
                request_queue = self.request_counts[client_ip]
                while request_queue and current_time - request_queue[0] > time_window:
                    request_queue.popleft()
                
                # Check if client exceeds rate limit
                if len(request_queue) >= max_requests:
                    self.blocked_ips[client_ip] = current_time + time_window
                    raise Exception(f"Rate limit exceeded for {client_ip}")
                
                # Add current request
                request_queue.append(current_time)
                
                return func(*args, **kwargs)
            return wrapper
        return decorator
    
    def circuit_breaker(self, failure_threshold=5, timeout=30):
        """Implement circuit breaker pattern"""
        def decorator(func):
            failures = {'count': 0, 'last_failure': None}
            
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                current_time = time.time()
                
                # Check if circuit is open
                if failures['count'] >= failure_threshold:
                    if failures['last_failure'] and \
                       current_time - failures['last_failure'] < timeout:
                        raise Exception("Circuit breaker open - service temporarily unavailable")
                    else:
                        # Reset circuit breaker
                        failures['count'] = 0
                
                try:
                    result = func(*args, **kwargs)
                    failures['count'] = 0  # Reset on success
                    return result
                
                except Exception as e:
                    failures['count'] += 1
                    failures['last_failure'] = current_time
                    raise e
            
            return wrapper
        return decorator
    
    def health_check(self):
        """Check system health status"""
        try:
            # Simulate health checks
            uptime = datetime.now() - self.start_time
            
            health_status = {
                'status': 'healthy' if self.health_status else 'unhealthy',
                'uptime_seconds': uptime.total_seconds(),
                'active_connections': len(self.request_counts),
                'blocked_ips': len(self.blocked_ips),
                'timestamp': datetime.now().isoformat()
            }
            
            return health_status
        
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

# Example usage for protecting a student portal
protector = AvailabilityProtector()

@protector.rate_limiter(max_requests=5, time_window=60)
def login_student(username, password, client_ip=None):
    """Student login with rate limiting"""
    # Simulate login process
    if username == "student123" and password == "secure_password":
        return {"success": True, "message": "Login successful"}
    else:
        time.sleep(1)  # Prevent timing attacks
        return {"success": False, "message": "Invalid credentials"}

@protector.circuit_breaker(failure_threshold=3, timeout=60)
def get_student_grades(student_id):
    """Get grades with circuit breaker protection"""
    # Simulate potential database issues
    import random
    if random.random() < 0.3:  # 30% failure rate for demonstration
        raise Exception("Database connection failed")
    
    return {
        "student_id": student_id,
        "grades": [
            {"subject": "Mathematics", "grade": 95},
            {"subject": "Science", "grade": 88},
            {"subject": "English", "grade": 92}
        ]
    }

def demonstrate_availability_protection():
    """Demonstrate availability protection mechanisms"""
    
    print("=== Rate Limiting Demo ===")
    # Normal usage - should work
    for i in range(3):
        try:
            result = login_student("student123", "secure_password", client_ip="192.168.1.100")
            print(f"Login attempt {i+1}: {result['message']}")
        except Exception as e:
            print(f"Login attempt {i+1}: {e}")
    
    # Excessive usage - should be blocked
    for i in range(5):
        try:
            result = login_student("student123", "secure_password", client_ip="192.168.1.100")
            print(f"Rapid login attempt {i+1}: {result['message']}")
        except Exception as e:
            print(f"Rapid login attempt {i+1}: BLOCKED - {e}")
    
    print("\n=== Circuit Breaker Demo ===")
    # Demonstrate circuit breaker
    for i in range(8):
        try:
            grades = get_student_grades("S001")
            print(f"Grade request {i+1}: Success - {len(grades['grades'])} subjects")
        except Exception as e:
            print(f"Grade request {i+1}: Failed - {e}")
    
    print("\n=== Health Check ===")
    health = protector.health_check()
    print(f"System health: {health}")

```

## Guided Example: Implementing CIA Triad for Student Records

Let's build a comprehensive example that demonstrates all three CIA principles working together.

```python
import sqlite3
import hashlib
import hmac
import time
from datetime import datetime
from contextlib import contextmanager

class SecureStudentRecordSystem:
    def __init__(self, db_path="secure_records.db", secret_key="school_master_key"):
        self.db_path = db_path
        self.secret_key = secret_key.encode()
        self.init_database()
        self.access_attempts = {}
        
    def init_database(self):
        """Initialize secure database with proper schema"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY,
                    encrypted_name BLOB,
                    encrypted_email BLOB,
                    grade_hash TEXT,
                    created_at TIMESTAMP,
                    last_accessed TIMESTAMP
                )
            """)
            
            conn.execute("""
                CREATE TABLE IF NOT EXISTS access_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT,
                    student_id INTEGER,
                    action TEXT,
                    timestamp TIMESTAMP,
                    success BOOLEAN,
                    ip_address TEXT
                )
            """)
    
    # [Content continues but truncated for length...]

```

## Summary

The **CIA Triad** forms the foundation of information security:

**Confidentiality protection:**

- **Encryption**: Protect data at rest and in transit

- **Access controls**: Limit who can view information

- **Secure communication**: Prevent eavesdropping

- **Data classification**: Identify what needs protection

**Integrity assurance:**

- **Cryptographic hashing**: Detect unauthorized changes

- **Digital signatures**: Verify data authenticity

- **Input validation**: Prevent malicious data injection

- **Version control**: Track legitimate changes

**Availability maintenance:**

- **Rate limiting**: Prevent resource exhaustion

- **Circuit breakers**: Graceful failure handling

- **Health monitoring**: Early problem detection

- **Redundancy**: Backup systems and failover

These principles work together to create comprehensive security. Now let's explore the AAA principles that implement these protections.

## The AAA Framework: How We Protect

### Authentication: Verifying User Identities

**Authentication** ensures that users are who they claim to be before granting any access to the system.

**Real-world example**: A student logging into the school portal must prove their identity with username/password, biometric scan, or student ID card.

**Common authentication factors:**

- **Something you know**: Passwords, PINs, security questions

- **Something you have**: Smart cards, mobile phones, hardware tokens

- **Something you are**: Fingerprints, facial recognition, voice patterns

- **Somewhere you are**: GPS location, IP address restrictions

**Authentication implementation strategies:**

```python
import hashlib
import secrets
import time
from datetime import datetime, timedelta
import re

class SecureAuthenticator:
    def __init__(self):
        self.users = {}  # In production, use a secure database
        self.sessions = {}
        self.failed_attempts = {}
        self.lockout_duration = 300  # 5 minutes
        self.max_attempts = 5
    
    def hash_password(self, password, salt=None):
        """Securely hash passwords with salt"""
        if salt is None:
            salt = secrets.token_hex(32)
        
        # Use PBKDF2 for password hashing (production would use bcrypt/scrypt)
        password_hash = hashlib.pbkdf2_hmac(
            'sha256', 
            password.encode('utf-8'), 
            salt.encode('utf-8'), 
            100000  # iterations
        )
        
        return salt, password_hash.hex()
    
    def validate_password_strength(self, password):
        """Enforce strong password requirements"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters"
        
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain uppercase letter"
        
        if not re.search(r'[a-z]', password):
            return False, "Password must contain lowercase letter"
        
        if not re.search(r'\d', password):
            return False, "Password must contain number"
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain special character"
        
        return True, "Password meets requirements"
    
    def register_user(self, username, password, email, role='student'):
        """Register new user with secure password storage"""
        if username in self.users:
            return False, "Username already exists"
        
        # Validate password strength
        is_valid, message = self.validate_password_strength(password)
        if not is_valid:
            return False, message
        
        # Hash password with salt
        salt, password_hash = self.hash_password(password)
        
        # Store user information
        self.users[username] = {
            'password_hash': password_hash,
            'salt': salt,
            'email': email,
            'role': role,
            'created_at': datetime.now(),
            'last_login': None,
            'login_count': 0
        }
        
        return True, "User registered successfully"
    
    def authenticate_user(self, username, password, client_ip='unknown'):
        """Authenticate user with brute force protection"""
        current_time = time.time()
        
        # Check if account is locked
        if username in self.failed_attempts:
            attempts_data = self.failed_attempts[username]
            if (attempts_data['count'] >= self.max_attempts and 
                current_time - attempts_data['last_attempt'] < self.lockout_duration):
                return False, "Account temporarily locked due to failed attempts"
        
        # Check if user exists
        if username not in self.users:
            self._record_failed_attempt(username, current_time)
            time.sleep(1)  # Prevent timing attacks
            return False, "Invalid credentials"
        
        user = self.users[username]
        
        # Verify password
        salt = user['salt']
        _, expected_hash = self.hash_password(password, salt)
        
        if expected_hash == user['password_hash']:
            # Successful authentication
            self._clear_failed_attempts(username)
            self._update_login_info(username, client_ip)
            session_token = self._create_session(username)
            return True, {
                'message': 'Authentication successful',
                'session_token': session_token,
                'user_role': user['role']
            }
        else:
            # Failed authentication
            self._record_failed_attempt(username, current_time)
            time.sleep(1)  # Prevent timing attacks
            return False, "Invalid credentials"
    
    def _record_failed_attempt(self, username, timestamp):
        """Record failed login attempt for brute force protection"""
        if username not in self.failed_attempts:
            self.failed_attempts[username] = {'count': 0, 'last_attempt': 0}
        
        self.failed_attempts[username]['count'] += 1
        self.failed_attempts[username]['last_attempt'] = timestamp
    
    def _clear_failed_attempts(self, username):
        """Clear failed attempts after successful login"""
        if username in self.failed_attempts:
            del self.failed_attempts[username]
    
    def _update_login_info(self, username, client_ip):
        """Update user login information"""
        self.users[username]['last_login'] = datetime.now()
        self.users[username]['login_count'] += 1
        self.users[username]['last_ip'] = client_ip
    
    def _create_session(self, username):
        """Create secure session token"""
        session_token = secrets.token_urlsafe(32)
        self.sessions[session_token] = {
            'username': username,
            'created_at': datetime.now(),
            'expires_at': datetime.now() + timedelta(hours=24),
            'active': True
        }
        return session_token
    
    def validate_session(self, session_token):
        """Validate session token and return user info"""
        if session_token not in self.sessions:
            return False, "Invalid session"
        
        session = self.sessions[session_token]
        
        if not session['active']:
            return False, "Session deactivated"
        
        if datetime.now() > session['expires_at']:
            session['active'] = False
            return False, "Session expired"
        
        username = session['username']
        return True, {
            'username': username,
            'role': self.users[username]['role']
        }

# Example usage for student authentication
auth_system = SecureAuthenticator()

# Register students
auth_system.register_user("student123", "SecurePass123!", "student@school.edu", "student")
auth_system.register_user("teacher_jones", "TeachPass456#", "jones@school.edu", "teacher")

def demonstrate_authentication():
    """Demonstrate authentication features"""
    print("=== Registration Demo ===")
    
    # Try weak password
    success, message = auth_system.register_user("weak_user", "123", "weak@school.edu")
    print(f"Weak password registration: {message}")
    
    # Try strong password
    success, message = auth_system.register_user("strong_user", "StrongP@ss123", "strong@school.edu")
    print(f"Strong password registration: {message}")
    
    print("\n=== Authentication Demo ===")
    
    # Valid login
    success, result = auth_system.authenticate_user("student123", "SecurePass123!")
    if success:
        print(f"Login successful: {result['message']}")
        session_token = result['session_token']
        
        # Validate session
        valid, session_info = auth_system.validate_session(session_token)
        print(f"Session validation: {session_info}")
    
    # Invalid login attempts (brute force demo)
    print("\n=== Brute Force Protection Demo ===")
    for i in range(6):
        success, message = auth_system.authenticate_user("student123", "wrong_password")
        print(f"Failed attempt {i+1}: {message}")

```

### Authorization: Controlling Access to Resources

**Authorization** determines what authenticated users are allowed to do within the system.

**Real-world example**: A student can view their own grades but cannot modify them or view other students' grades.

**Authorization models:**

- **Role-Based Access Control (RBAC)**: Permissions assigned to roles, users assigned to roles

- **Attribute-Based Access Control (ABAC)**: Decisions based on user attributes, resource attributes, and environmental factors

- **Discretionary Access Control (DAC)**: Resource owners control access permissions

- **Mandatory Access Control (MAC)**: System-enforced access based on security clearances

```python
from enum import Enum
from typing import List, Dict, Any
import json

class Permission(Enum):
    READ_OWN_GRADES = "read_own_grades"
    READ_ALL_GRADES = "read_all_grades"
    WRITE_GRADES = "write_grades"
    MANAGE_USERS = "manage_users"
    SYSTEM_ADMIN = "system_admin"
    READ_COURSE_MATERIALS = "read_course_materials"
    WRITE_COURSE_MATERIALS = "write_course_materials"

class Role(Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"
    PRINCIPAL = "principal"

class AuthorizationManager:
    def __init__(self):
        # Define role-permission mappings
        self.role_permissions = {
            Role.STUDENT: [
                Permission.READ_OWN_GRADES,
                Permission.READ_COURSE_MATERIALS
            ],
            Role.TEACHER: [
                Permission.READ_OWN_GRADES,
                Permission.READ_ALL_GRADES,
                Permission.WRITE_GRADES,
                Permission.READ_COURSE_MATERIALS,
                Permission.WRITE_COURSE_MATERIALS
            ],
            Role.ADMIN: [
                Permission.READ_ALL_GRADES,
                Permission.WRITE_GRADES,
                Permission.MANAGE_USERS,
                Permission.READ_COURSE_MATERIALS,
                Permission.WRITE_COURSE_MATERIALS
            ],
            Role.PRINCIPAL: [
                Permission.READ_ALL_GRADES,
                Permission.MANAGE_USERS,
                Permission.SYSTEM_ADMIN,
                Permission.READ_COURSE_MATERIALS
            ]
        }
        
        # Track resource ownership
        self.resource_owners = {}
        
        # Access control lists for fine-grained permissions
        self.access_control_lists = {}
    
    def has_permission(self, user_role: Role, permission: Permission) -> bool:
        """Check if role has specific permission"""
        return permission in self.role_permissions.get(user_role, [])
    
    def can_access_resource(self, user_id: str, user_role: Role, 
                          resource_type: str, resource_id: str, 
                          action: str) -> tuple[bool, str]:
        """Check if user can perform action on specific resource"""
        
        # Check basic role permissions
        required_permission = self._get_required_permission(resource_type, action)
        if not self.has_permission(user_role, required_permission):
            return False, f"Insufficient permissions for {action} on {resource_type}"
        
        # Check resource-specific rules
        if resource_type == "grades":
            return self._check_grade_access(user_id, user_role, resource_id, action)
        elif resource_type == "course_materials":
            return self._check_course_access(user_id, user_role, resource_id, action)
        elif resource_type == "user_account":
            return self._check_user_account_access(user_id, user_role, resource_id, action)
        
        return True, "Access granted"
    
    def _get_required_permission(self, resource_type: str, action: str) -> Permission:
        """Map resource type and action to required permission"""
        permission_map = {
            ("grades", "read"): Permission.READ_OWN_GRADES,
            ("grades", "write"): Permission.WRITE_GRADES,
            ("course_materials", "read"): Permission.READ_COURSE_MATERIALS,
            ("course_materials", "write"): Permission.WRITE_COURSE_MATERIALS,
            ("user_account", "manage"): Permission.MANAGE_USERS
        }
        
        return permission_map.get((resource_type, action), Permission.READ_OWN_GRADES)
    
    def _check_grade_access(self, user_id: str, user_role: Role, 
                           grade_id: str, action: str) -> tuple[bool, str]:
        """Check grade-specific access rules"""
        
        # Students can only access their own grades
        if user_role == Role.STUDENT:
            grade_owner = self.resource_owners.get(f"grade_{grade_id}")
            if grade_owner != user_id:
                return False, "Students can only access their own grades"
        
        # Teachers can access grades for their courses
        if user_role == Role.TEACHER and action == "write":
            # Check if teacher is assigned to this course
            if not self._is_teacher_for_course(user_id, grade_id):
                return False, "Teachers can only modify grades for their courses"
        
        return True, "Grade access granted"
    
    def _check_course_access(self, user_id: str, user_role: Role, 
                           course_id: str, action: str) -> tuple[bool, str]:
        """Check course material access rules"""
        
        # Students can only access enrolled courses
        if user_role == Role.STUDENT:
            if not self._is_student_enrolled(user_id, course_id):
                return False, "Students can only access enrolled courses"
        
        return True, "Course access granted"
    
    def _check_user_account_access(self, user_id: str, user_role: Role, 
                                 target_user_id: str, action: str) -> tuple[bool, str]:
        """Check user account management access"""
        
        # Users can manage their own accounts
        if user_id == target_user_id:
            return True, "Self-management allowed"
        
        # Only admins and principals can manage other accounts
        if user_role not in [Role.ADMIN, Role.PRINCIPAL]:
            return False, "Insufficient privileges to manage other accounts"
        
        return True, "Account management access granted"
    
    def _is_teacher_for_course(self, teacher_id: str, grade_id: str) -> bool:
        """Check if teacher is assigned to course (simplified)"""
        # In real implementation, check database
        return True  # Simplified for demo
    
    def _is_student_enrolled(self, student_id: str, course_id: str) -> bool:
        """Check if student is enrolled in course (simplified)"""
        # In real implementation, check database
        return True  # Simplified for demo

# Example usage for authorization
def demonstrate_authorization():
    """Demonstrate authorization system"""
    auth_manager = AuthorizationManager()
    
    # Set up some test data
    auth_manager.resource_owners["grade_123"] = "student001"
    auth_manager.resource_owners["grade_124"] = "student002"
    
    print("=== Role-Based Permission Demo ===")
    
    # Test different role permissions
    roles_to_test = [Role.STUDENT, Role.TEACHER, Role.ADMIN]
    
    for role in roles_to_test:
        can_read_grades = auth_manager.has_permission(role, Permission.READ_ALL_GRADES)
        can_write_grades = auth_manager.has_permission(role, Permission.WRITE_GRADES)
        can_manage_users = auth_manager.has_permission(role, Permission.MANAGE_USERS)
        
        print(f"{role.value}: Read grades={can_read_grades}, "
              f"Write grades={can_write_grades}, Manage users={can_manage_users}")
    
    print("\n=== Resource Access Demo ===")
    
    # Test resource-specific access
    test_cases = [
        ("student001", Role.STUDENT, "grades", "123", "read"),
        ("student001", Role.STUDENT, "grades", "124", "read"),  # Should fail
        ("teacher001", Role.TEACHER, "grades", "123", "write"),
        ("admin001", Role.ADMIN, "user_account", "student001", "manage")
    ]
    
    for user_id, role, resource_type, resource_id, action in test_cases:
        can_access, message = auth_manager.can_access_resource(
            user_id, role, resource_type, resource_id, action
        )
        print(f"{user_id} ({role.value}) {action} {resource_type} {resource_id}: "
              f"{'ALLOWED' if can_access else 'DENIED'} - {message}")

```

### Accountability: Tracking and Auditing System Activities

**Accountability** ensures that all security-relevant actions are logged and traceable to specific users.

**Real-world example**: When a student's grade is changed, the system logs who made the change, when it happened, what the old and new values were, and from which IP address.

**Accountability components:**

- **Audit logging**: Recording all security-relevant events

- **Non-repudiation**: Ensuring users cannot deny their actions

- **Forensic analysis**: Investigating security incidents

- **Compliance reporting**: Meeting regulatory requirements

```python
import logging
import json
from datetime import datetime
from typing import Optional, Dict, Any
import hashlib

class AuditLogger:
    def __init__(self, log_file="security_audit.log"):
        self.log_file = log_file
        
        # Configure secure logging
        self.logger = logging.getLogger('security_audit')
        self.logger.setLevel(logging.INFO)
        
        # Create file handler with rotation
        handler = logging.FileHandler(log_file)
        formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        
        # Track log integrity
        self.log_integrity = {}
    
    def log_authentication_event(self, username: str, success: bool, 
                                client_ip: str, user_agent: str = ""):
        """Log authentication attempts"""
        event_data = {
            'event_type': 'authentication',
            'username': username,
            'success': success,
            'client_ip': client_ip,
            'user_agent': user_agent,
            'timestamp': datetime.now().isoformat()
        }
        
        self._write_secure_log(event_data)
    
    def log_authorization_event(self, user_id: str, resource_type: str, 
                              resource_id: str, action: str, 
                              granted: bool, reason: str = ""):
        """Log authorization decisions"""
        event_data = {
            'event_type': 'authorization',
            'user_id': user_id,
            'resource_type': resource_type,
            'resource_id': resource_id,
            'action': action,
            'granted': granted,
            'reason': reason,
            'timestamp': datetime.now().isoformat()
        }
        
        self._write_secure_log(event_data)
    
    def log_data_access(self, user_id: str, data_type: str, 
                       data_id: str, operation: str, 
                       old_value: str = "", new_value: str = ""):
        """Log data access and modifications"""
        event_data = {
            'event_type': 'data_access',
            'user_id': user_id,
            'data_type': data_type,
            'data_id': data_id,
            'operation': operation,
            'old_value': old_value[:100] if old_value else "",  # Truncate for privacy
            'new_value': new_value[:100] if new_value else "",
            'timestamp': datetime.now().isoformat()
        }
        
        self._write_secure_log(event_data)
    
    def log_security_event(self, event_type: str, user_id: str, 
                          details: Dict[str, Any], severity: str = "INFO"):
        """Log general security events"""
        event_data = {
            'event_type': f'security_{event_type}',
            'user_id': user_id,
            'severity': severity,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        
        self._write_secure_log(event_data)
    
    def _write_secure_log(self, event_data: Dict[str, Any]):
        """Write log entry with integrity protection"""
        
        # Add sequence number for ordering
        event_data['sequence'] = self._get_next_sequence()
        
        # Convert to JSON
        log_entry = json.dumps(event_data, sort_keys=True)
        
        # Calculate integrity hash
        integrity_hash = hashlib.sha256(log_entry.encode()).hexdigest()
        event_data['integrity_hash'] = integrity_hash
        
        # Write to log
        final_entry = json.dumps(event_data, sort_keys=True)
        self.logger.info(final_entry)
        
        # Store integrity hash for verification
        self.log_integrity[event_data['sequence']] = integrity_hash
    
    def _get_next_sequence(self) -> int:
        """Get next sequence number for log ordering"""
        if not hasattr(self, '_current_sequence'):
            self._current_sequence = 0
        self._current_sequence += 1
        return self._current_sequence
    
    def verify_log_integrity(self) -> Dict[str, Any]:
        """Verify that log entries haven't been tampered with"""
        try:
            with open(self.log_file, 'r') as f:
                lines = f.readlines()
            
            verified_entries = 0
            tampered_entries = 0
            
            for line in lines:
                try:
                    # Extract log entry
                    parts = line.split(' - INFO - ', 1)
                    if len(parts) < 2:
                        continue
                    
                    log_data = json.loads(parts[1].strip())
                    
                    if 'integrity_hash' not in log_data:
                        continue
                    
                    # Verify integrity
                    stored_hash = log_data.pop('integrity_hash')
                    recalculated_entry = json.dumps(log_data, sort_keys=True)
                    calculated_hash = hashlib.sha256(recalculated_entry.encode()).hexdigest()
                    
                    if stored_hash == calculated_hash:
                        verified_entries += 1
                    else:
                        tampered_entries += 1
                
                except (json.JSONDecodeError, KeyError):
                    continue
            
            return {
                'total_verified': verified_entries,
                'tampered_entries': tampered_entries,
                'integrity_status': 'CLEAN' if tampered_entries == 0 else 'COMPROMISED'
            }
        
        except FileNotFoundError:
            return {'error': 'Log file not found'}

# Example integrated system using all AAA principles
class SecureStudentSystem:
    def __init__(self):
        self.authenticator = SecureAuthenticator()
        self.authorizer = AuthorizationManager()
        self.auditor = AuditLogger()
    
    def secure_grade_update(self, session_token: str, student_id: str, 
                          subject: str, new_grade: float, client_ip: str):
        """Securely update student grade with full AAA implementation"""
        
        # Step 1: Authentication - Verify user identity
        auth_valid, session_info = self.authenticator.validate_session(session_token)
        if not auth_valid:
            self.auditor.log_security_event(
                'unauthorized_access_attempt', 
                'unknown', 
                {'resource': f'grade_{student_id}_{subject}', 'reason': session_info},
                'WARNING'
            )
            return False, "Authentication failed"
        
        user_id = session_info['username']
        user_role = Role(session_info['role'])
        
        # Step 2: Authorization - Check permissions
        can_access, auth_message = self.authorizer.can_access_resource(
            user_id, user_role, "grades", f"{student_id}_{subject}", "write"
        )
        
        # Log authorization decision
        self.auditor.log_authorization_event(
            user_id, "grades", f"{student_id}_{subject}", "write", 
            can_access, auth_message
        )
        
        if not can_access:
            return False, auth_message
        
        # Step 3: Perform the operation with accountability
        try:
            # Get current grade for audit trail
            old_grade = self._get_current_grade(student_id, subject)
            
            # Update grade
            success = self._update_grade_in_database(student_id, subject, new_grade)
            
            if success:
                # Log successful data modification
                self.auditor.log_data_access(
                    user_id, "grade", f"{student_id}_{subject}", "update",
                    str(old_grade), str(new_grade)
                )
                
                return True, "Grade updated successfully"
            else:
                # Log failed operation
                self.auditor.log_security_event(
                    'data_operation_failed',
                    user_id,
                    {'operation': 'grade_update', 'target': f"{student_id}_{subject}"},
                    'ERROR'
                )
                return False, "Database update failed"
        
        except Exception as e:
            # Log exception
            self.auditor.log_security_event(
                'system_error',
                user_id,
                {'operation': 'grade_update', 'error': str(e)},
                'ERROR'
            )
            return False, "System error occurred"
    
    def _get_current_grade(self, student_id: str, subject: str) -> float:
        """Get current grade (simplified)"""
        # In real implementation, query database
        return 85.0
    
    def _update_grade_in_database(self, student_id: str, subject: str, grade: float) -> bool:
        """Update grade in database (simplified)"""
        # In real implementation, update database
        return True

# Demonstration of complete AAA system
def demonstrate_complete_aaa_system():
    """Demonstrate integrated Authentication, Authorization, and Accountability"""
    
    system = SecureStudentSystem()
    
    # Register and authenticate a teacher
    system.authenticator.register_user("teacher_smith", "TeachPass123!", "smith@school.edu", "teacher")
    auth_success, auth_result = system.authenticator.authenticate_user(
        "teacher_smith", "TeachPass123!", "192.168.1.100"
    )
    
    if auth_success:
        session_token = auth_result['session_token']
        
        # Attempt to update a grade
        update_success, update_message = system.secure_grade_update(
            session_token, "student001", "Mathematics", 92.5, "192.168.1.100"
        )
        
        print(f"Grade update: {'SUCCESS' if update_success else 'FAILED'} - {update_message}")
        
        # Check audit log integrity
        integrity_report = system.auditor.verify_log_integrity()
        print(f"Audit log integrity: {integrity_report}")

```

## Practice Exercises

/// details | Exercise 1: CIA Triad Implementation
    type: question
    open: false

Design and implement a secure document management system that demonstrates all three CIA Triad principles. Your system should handle sensitive school documents (student records, financial reports, etc.).

**Requirements:**

1. **Confidentiality**: Encrypt documents at rest, secure transmission

2. **Integrity**: Detect unauthorized modifications, maintain version history

3. **Availability**: Handle system failures gracefully, implement rate limiting

**Your Task:**

- Create a `SecureDocumentManager` class

- Implement document encryption/decryption methods

- Add integrity checking with digital signatures

- Include availability protection with error handling and resource limits

- Demonstrate the system with sample documents

/// details | Sample Solution
    type: success
    open: false

```python
import os
import hashlib
import json
from datetime import datetime
from cryptography.fernet import Fernet
import time

class SecureDocumentManager:
    def __init__(self, storage_path="secure_docs"):
        self.storage_path = storage_path
        self.key = self._get_or_create_key()
        self.cipher = Fernet(self.key)
        self.access_log = {}
        self.rate_limits = {}
        
        # Create storage directory
        os.makedirs(storage_path, exist_ok=True)
    
    def _get_or_create_key(self):
        """Manage encryption key securely"""
        key_file = "doc_encryption.key"
        if os.path.exists(key_file):
            with open(key_file, "rb") as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            with open(key_file, "wb") as f:
                f.write(key)
            return key
    
    def store_document(self, doc_id, content, user_id, classification="confidential"):
        """Store document with confidentiality and integrity protection"""
        
        # Rate limiting for availability
        if not self._check_rate_limit(user_id):
            raise Exception("Rate limit exceeded")
        
        # Create document metadata
        metadata = {
            'doc_id': doc_id,
            'classification': classification,
            'created_by': user_id,
            'created_at': datetime.now().isoformat(),
            'version': 1
        }
        
        # Calculate integrity hash
        content_hash = hashlib.sha256(content.encode()).hexdigest()
        metadata['content_hash'] = content_hash
        
        # Encrypt content (Confidentiality)
        encrypted_content = self.cipher.encrypt(content.encode())
        
        # Store encrypted document
        doc_path = os.path.join(self.storage_path, f"{doc_id}.enc")
        meta_path = os.path.join(self.storage_path, f"{doc_id}.meta")
        
        with open(doc_path, "wb") as f:
            f.write(encrypted_content)
        
        with open(meta_path, "w") as f:
            json.dump(metadata, f, indent=2)
        
        # Log access for accountability
        self._log_access(user_id, doc_id, "create")
        
        return True
    
    def retrieve_document(self, doc_id, user_id):
        """Retrieve document with integrity verification"""
        
        # Rate limiting
        if not self._check_rate_limit(user_id):
            raise Exception("Rate limit exceeded")
        
        doc_path = os.path.join(self.storage_path, f"{doc_id}.enc")
        meta_path = os.path.join(self.storage_path, f"{doc_id}.meta")
        
        # Check if document exists (Availability)
        if not os.path.exists(doc_path) or not os.path.exists(meta_path):
            raise FileNotFoundError("Document not found")
        
        # Load metadata
        with open(meta_path, "r") as f:
            metadata = json.load(f)
        
        # Decrypt content (Confidentiality)
        with open(doc_path, "rb") as f:
            encrypted_content = f.read()
        
        try:
            decrypted_content = self.cipher.decrypt(encrypted_content).decode()
        except Exception:
            raise Exception("Decryption failed - document may be corrupted")
        
        # Verify integrity
        current_hash = hashlib.sha256(decrypted_content.encode()).hexdigest()
        if current_hash != metadata['content_hash']:
            raise Exception("Document integrity violation detected")
        
        # Log access
        self._log_access(user_id, doc_id, "read")
        
        return {
            'content': decrypted_content,
            'metadata': metadata
        }
    
    def _check_rate_limit(self, user_id, max_requests=10, time_window=60):
        """Implement rate limiting for availability protection"""
        current_time = time.time()
        
        if user_id not in self.rate_limits:
            self.rate_limits[user_id] = []
        
        # Clean old requests
        self.rate_limits[user_id] = [
            req_time for req_time in self.rate_limits[user_id]
            if current_time - req_time < time_window
        ]
        
        # Check limit
        if len(self.rate_limits[user_id]) >= max_requests:
            return False
        
        # Add current request
        self.rate_limits[user_id].append(current_time)
        return True
    
    def _log_access(self, user_id, doc_id, action):
        """Log document access for accountability"""
        if user_id not in self.access_log:
            self.access_log[user_id] = []
        
        self.access_log[user_id].append({
            'doc_id': doc_id,
            'action': action,
            'timestamp': datetime.now().isoformat()
        })

# Demonstration
doc_manager = SecureDocumentManager()

# Store sensitive document
doc_manager.store_document(
    "STUDENT_RECORD_001", 
    "Student: John Doe, Grade: 95, SSN: 123-45-6789",
    "teacher_admin",
    "highly_confidential"
)

# Retrieve and verify
document = doc_manager.retrieve_document("STUDENT_RECORD_001", "authorized_user")
print(f"Retrieved: {document['content'][:50]}...")
print(f"Classification: {document['metadata']['classification']}")

```

///
///

/// details | Exercise 2: AAA System Integration
    type: question
    open: false

Build a complete Authentication, Authorization, and Accountability system for a school library management system.

**System Requirements:**

- **Users**: Students, Librarians, Administrators

- **Resources**: Books, Digital resources, User accounts

- **Actions**: Borrow, Return, Reserve, Manage inventory

**Your Task:**

1. Design role-based permissions for each user type

2. Implement multi-factor authentication for administrators

3. Create detailed audit logging for all book transactions

4. Add session management with automatic timeout

5. Include brute force protection and account lockout

**Test Scenarios:**

- Student borrowing a book

- Librarian adding new inventory

- Administrator accessing user records

- Attempt to access resources without proper authorization

/// details | Sample Solution
    type: success
    open: false

```python
import secrets
import time
from datetime import datetime, timedelta
from enum import Enum
import json

class LibraryRole(Enum):
    STUDENT = "student"
    LIBRARIAN = "librarian"
    ADMINISTRATOR = "administrator"

class LibraryPermission(Enum):
    BORROW_BOOK = "borrow_book"
    RETURN_BOOK = "return_book"
    RESERVE_BOOK = "reserve_book"
    MANAGE_INVENTORY = "manage_inventory"
    VIEW_USER_RECORDS = "view_user_records"
    SYSTEM_ADMIN = "system_admin"

class LibraryAAA:
    def __init__(self):
        self.users = {}
        self.sessions = {}
        self.audit_log = []
        self.failed_attempts = {}
        self.books = self._initialize_books()
        
        # Role permissions
        self.role_permissions = {
            LibraryRole.STUDENT: [
                LibraryPermission.BORROW_BOOK,
                LibraryPermission.RETURN_BOOK,
                LibraryPermission.RESERVE_BOOK
            ],
            LibraryRole.LIBRARIAN: [
                LibraryPermission.BORROW_BOOK,
                LibraryPermission.RETURN_BOOK,
                LibraryPermission.RESERVE_BOOK,
                LibraryPermission.MANAGE_INVENTORY,
                LibraryPermission.VIEW_USER_RECORDS
            ],
            LibraryRole.ADMINISTRATOR: [
                LibraryPermission.MANAGE_INVENTORY,
                LibraryPermission.VIEW_USER_RECORDS,
                LibraryPermission.SYSTEM_ADMIN
            ]
        }
    
    def register_user(self, username, password, email, role):
        """Register new user with role assignment"""
        if username in self.users:
            return False, "Username already exists"
        
        # Hash password (simplified)
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        self.users[username] = {
            'password_hash': password_hash,
            'email': email,
            'role': LibraryRole(role),
            'created_at': datetime.now(),
            'mfa_enabled': role == 'administrator'  # MFA required for admins
        }
        
        self._audit_log("user_registration", username, {"role": role})
        return True, "User registered successfully"
    
    def authenticate(self, username, password, mfa_code=None):
        """Authenticate user with MFA support"""
        
        # Check lockout
        if self._is_locked_out(username):
            self._audit_log("login_attempt", username, {"result": "locked_out"})
            return False, "Account locked due to failed attempts"
        
        # Verify credentials
        if username not in self.users:
            self._record_failed_attempt(username)
            self._audit_log("login_attempt", username, {"result": "invalid_user"})
            return False, "Invalid credentials"
        
        user = self.users[username]
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        if password_hash != user['password_hash']:
            self._record_failed_attempt(username)
            self._audit_log("login_attempt", username, {"result": "invalid_password"})
            return False, "Invalid credentials"
        
        # Check MFA for administrators
        if user['mfa_enabled'] and not self._verify_mfa(username, mfa_code):
            self._audit_log("login_attempt", username, {"result": "mfa_failed"})
            return False, "MFA verification failed"
        
        # Create session
        session_token = self._create_session(username)
        self._clear_failed_attempts(username)
        self._audit_log("login_success", username, {"session_token": session_token[:8] + "..."})
        
        return True, {"session_token": session_token, "role": user['role'].value}
    
    def authorize_action(self, session_token, action, resource_id=None):
        """Authorize user action"""
        
        # Validate session
        session = self._validate_session(session_token)
        if not session:
            self._audit_log("authorization_failed", "unknown", 
                          {"reason": "invalid_session", "action": action})
            return False, "Invalid session"
        
        username = session['username']
        user_role = self.users[username]['role']
        
        # Check permissions
        required_permission = self._get_required_permission(action)
        if required_permission not in self.role_permissions[user_role]:
            self._audit_log("authorization_failed", username, 
                          {"action": action, "reason": "insufficient_permissions"})
            return False, "Insufficient permissions"
        
        # Resource-specific checks
        if not self._check_resource_access(username, user_role, action, resource_id):
            self._audit_log("authorization_failed", username, 
                          {"action": action, "resource": resource_id, "reason": "resource_denied"})
            return False, "Resource access denied"
        
        self._audit_log("authorization_success", username, 
                      {"action": action, "resource": resource_id})
        return True, "Action authorized"
    
    def borrow_book(self, session_token, book_id):
        """Borrow book with full AAA"""
        
        # Authorize action
        authorized, message = self.authorize_action(session_token, "borrow_book", book_id)
        if not authorized:
            return False, message
        
        # Get session info
        session = self._validate_session(session_token)
        username = session['username']
        
        # Check book availability
        if book_id not in self.books:
            self._audit_log("book_borrow_failed", username, 
                          {"book_id": book_id, "reason": "book_not_found"})
            return False, "Book not found"
        
        if self.books[book_id]['borrowed_by']:
            self._audit_log("book_borrow_failed", username, 
                          {"book_id": book_id, "reason": "already_borrowed"})
            return False, "Book already borrowed"
        
        # Perform borrow operation
        self.books[book_id]['borrowed_by'] = username
        self.books[book_id]['borrowed_at'] = datetime.now()
        
        self._audit_log("book_borrowed", username, 
                      {"book_id": book_id, "title": self.books[book_id]['title']})
        
        return True, f"Successfully borrowed: {self.books[book_id]['title']}"
    
    def _initialize_books(self):
        """Initialize sample book inventory"""
        return {
            "BOOK001": {"title": "Python Programming", "author": "Author A", "borrowed_by": None},
            "BOOK002": {"title": "Data Structures", "author": "Author B", "borrowed_by": None},
            "BOOK003": {"title": "Web Security", "author": "Author C", "borrowed_by": None}
        }
    
    def _verify_mfa(self, username, mfa_code):
        """Verify MFA code (simplified)"""
        # In real implementation, verify TOTP or SMS code
        return mfa_code == "123456"  # Simplified for demo
    
    def _create_session(self, username):
        """Create user session"""
        session_token = secrets.token_urlsafe(32)
        self.sessions[session_token] = {
            'username': username,
            'created_at': datetime.now(),
            'expires_at': datetime.now() + timedelta(hours=8)
        }
        return session_token
    
    def _validate_session(self, session_token):
        """Validate session token"""
        if session_token not in self.sessions:
            return None
        
        session = self.sessions[session_token]
        if datetime.now() > session['expires_at']:
            del self.sessions[session_token]
            return None
        
        return session
    
    def _audit_log(self, event_type, username, details):
        """Add entry to audit log"""
        self.audit_log.append({
            'timestamp': datetime.now().isoformat(),
            'event_type': event_type,
            'username': username,
            'details': details
        })
    
    def _is_locked_out(self, username):
        """Check if account is locked out"""
        if username not in self.failed_attempts:
            return False
        
        attempts = self.failed_attempts[username]
        if attempts['count'] >= 5:
            # Check if lockout period has expired
            if time.time() - attempts['last_attempt'] < 300:  # 5 minutes
                return True
        
        return False
    
    def _record_failed_attempt(self, username):
        """Record failed login attempt"""
        if username not in self.failed_attempts:
            self.failed_attempts[username] = {'count': 0, 'last_attempt': 0}
        
        self.failed_attempts[username]['count'] += 1
        self.failed_attempts[username]['last_attempt'] = time.time()
    
    def _clear_failed_attempts(self, username):
        """Clear failed attempts after successful login"""
        if username in self.failed_attempts:
            del self.failed_attempts[username]
    
    def _get_required_permission(self, action):
        """Map action to required permission"""
        action_map = {
            "borrow_book": LibraryPermission.BORROW_BOOK,
            "return_book": LibraryPermission.RETURN_BOOK,
            "manage_inventory": LibraryPermission.MANAGE_INVENTORY,
            "view_records": LibraryPermission.VIEW_USER_RECORDS
        }
        return action_map.get(action)
    
    def _check_resource_access(self, username, role, action, resource_id):
        """Check resource-specific access rules"""
        # Students can only borrow 3 books at a time
        if role == LibraryRole.STUDENT and action == "borrow_book":
            borrowed_count = sum(1 for book in self.books.values() 
                                if book['borrowed_by'] == username)
            if borrowed_count >= 3:
                return False
        
        return True
    
    def get_audit_report(self, session_token):
        """Generate audit report for authorized users"""
        
        authorized, message = self.authorize_action(session_token, "view_records")
        if not authorized:
            return None, message
        
        return self.audit_log, "Audit report generated"

# Demonstration
library_system = LibraryAAA()

# Register users
library_system.register_user("student1", "password123", "student1@school.edu", "student")
library_system.register_user("librarian1", "libpass456", "lib1@school.edu", "librarian")
library_system.register_user("admin1", "adminpass789", "admin1@school.edu", "administrator")

print("=== Library AAA System Demo ===")

# Student login and book borrowing
auth_result = library_system.authenticate("student1", "password123")
if auth_result[0]:
    student_token = auth_result[1]['session_token']
    borrow_result = library_system.borrow_book(student_token, "BOOK001")
    print(f"Student borrow: {borrow_result[1]}")

# Admin login with MFA
admin_auth = library_system.authenticate("admin1", "adminpass789", "123456")
if admin_auth[0]:
    admin_token = admin_auth[1]['session_token']
    audit_report, message = library_system.get_audit_report(admin_token)
    print(f"Audit report entries: {len(audit_report)}")

```

///
///

## Summary

**The six fundamental security principles work together to create comprehensive protection:**

**CIA Triad - What we protect:**

- **Confidentiality**: Encryption, access controls, secure communication prevent unauthorized data access

- **Integrity**: Hashing, digital signatures, input validation ensure data accuracy and authenticity

- **Availability**: Rate limiting, circuit breakers, redundancy maintain system accessibility

**AAA Framework - How we protect:**

- **Authentication**: Multi-factor authentication, secure password storage, session management verify user identities

- **Authorization**: Role-based access control, resource-specific permissions control what users can do

- **Accountability**: Comprehensive audit logging, integrity protection, forensic capabilities track all actions

**Implementation best practices:**

- **Layered security**: Combine multiple principles for defense-in-depth

- **User-centered design**: Balance security with usability to ensure compliance

- **Continuous monitoring**: Real-time logging and alerting for security events

- **Regular auditing**: Periodic review of logs and access patterns

**Real-world application:**

- **Student information systems**: Protect sensitive academic and personal data

- **Financial systems**: Ensure transaction integrity and regulatory compliance

- **Healthcare systems**: Maintain patient privacy while ensuring care provider access

- **Enterprise systems**: Balance security requirements with business productivity

Understanding these foundational principles enables developers to make informed security decisions and build systems that protect both technical assets and business value while maintaining user trust and regulatory compliance.

!!! tip "Cross-reference"
    These fundamental principles prepare you for implementing cryptographic protections in Section 15.2.

!!! tip "Next Section"
    In Section 15.2, we'll explore cryptography and data protection, building on these fundamentals to implement secure encryption, hashing, and key management.
