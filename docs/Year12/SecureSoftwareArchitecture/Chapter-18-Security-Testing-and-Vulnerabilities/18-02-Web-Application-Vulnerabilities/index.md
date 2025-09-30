# 18.2 Web Application Vulnerabilities

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Understand and prevent Cross-Site Request Forgery (CSRF) attacks
    - Identify and fix broken authentication patterns
    - Recognize and remediate security misconfigurations
    - Detect and prevent race conditions and concurrency issues
    - Understand and mitigate side-channel attacks

## Introduction

**Web application vulnerabilities** are security weaknesses that can be exploited by attackers to compromise web applications and their users. These vulnerabilities often arise from common coding mistakes, misconfigurations, or design flaws that create opportunities for unauthorized access, data theft, or system compromise.

Understanding these vulnerabilities is crucial because:

- Web applications are increasingly the primary attack vector

- Many vulnerabilities are preventable with proper coding practices

- The impact of successful attacks can be devastating for businesses and users

- Security must be considered throughout the development lifecycle

This section focuses on advanced web vulnerabilities that go beyond basic injection attacks, covering sophisticated attack vectors and their prevention.

## Cross-Site Request Forgery (CSRF) Prevention

### Understanding CSRF Attacks

**Cross-Site Request Forgery (CSRF)** tricks users into performing unintended actions on web applications where they're authenticated. The attacker crafts a malicious request that appears to come from a trusted user.

Think of CSRF like someone forging your signature on a check while you're not looking, using your identity to perform actions you never intended.

### How CSRF Works

```python
# Example vulnerable web application (using Flask)
from flask import Flask, request, session, redirect, render_template_string

app = Flask(__name__)
app.secret_key = 'vulnerable_secret'

# Vulnerable endpoint - no CSRF protection
@app.route('/transfer', methods=['POST'])
def transfer_money():
    if 'user_id' not in session:
        return redirect('/login')
    
    # Vulnerable: directly processes POST data without CSRF token
    to_account = request.form['to_account']
    amount = request.form['amount']
    
    # Process transfer (simplified)
    print(f"Transferring ${amount} to account {to_account}")
    return f"Transferred ${amount} to {to_account}"

# Malicious page that exploits CSRF vulnerability
malicious_html = '''
<html>
<body>
    <h1>You've won a prize! Click here to claim:</h1>
    <!-- Hidden form that submits automatically -->
    <form id="malicious" action="http://vulnerable-bank.com/transfer" method="POST">
        <input type="hidden" name="to_account" value="attacker_account">
        <input type="hidden" name="amount" value="1000">
    </form>
    
    <script>
        // Automatically submit the form when page loads
        document.getElementById('malicious').submit();
    </script>
</body>
</html>
'''

```

### CSRF Prevention Implementation

```python
import secrets
import hmac
import hashlib
from flask import Flask, request, session, abort
from functools import wraps

class CSRFProtection:
    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        app.config.setdefault('CSRF_SECRET_KEY', secrets.token_hex(32))
        app.before_request(self.check_csrf)
    
    def generate_csrf_token(self, session_data):
        """Generate a CSRF token for the current session"""
        secret_key = self.app.config['CSRF_SECRET_KEY']
        user_id = session_data.get('user_id', 'anonymous')
        timestamp = str(int(time.time()))
        
        # Create token with user_id and timestamp
        token_data = f"{user_id}:{timestamp}"
        signature = hmac.new(
            secret_key.encode(),
            token_data.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return f"{token_data}:{signature}"
    
    def validate_csrf_token(self, token, session_data):
        """Validate a CSRF token"""
        try:
            parts = token.split(':')
            if len(parts) != 3:
                return False
            
            user_id, timestamp, signature = parts
            expected_token_data = f"{user_id}:{timestamp}"
            
            # Verify signature
            secret_key = self.app.config['CSRF_SECRET_KEY']
            expected_signature = hmac.new(
                secret_key.encode(),
                expected_token_data.encode(),
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(signature, expected_signature):
                return False
            
            # Check if token is for current user
            if user_id != session_data.get('user_id', 'anonymous'):
                return False
            
            # Check token age (24 hour expiry)
            import time
            token_time = int(timestamp)
            if time.time() - token_time > 86400:  # 24 hours
                return False
            
            return True
        
        except (ValueError, TypeError):
            return False
    
    def check_csrf(self):
        """Check CSRF token on state-changing requests"""
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            # Skip CSRF check for API endpoints with proper authentication
            if request.path.startswith('/api/') and self.is_api_authenticated():
                return
            
            token = request.form.get('csrf_token') or request.headers.get('X-CSRF-Token')
            
            if not token or not self.validate_csrf_token(token, session):
                abort(403, "CSRF token validation failed")
    
    def is_api_authenticated(self):
        """Check if request has proper API authentication"""
        # Implement API key or JWT validation
        api_key = request.headers.get('X-API-Key')
        return api_key and self.validate_api_key(api_key)
    
    def validate_api_key(self, api_key):
        """Validate API key (simplified)"""
        # In real implementation, check against database
        valid_keys = ['api_key_1', 'api_key_2']
        return api_key in valid_keys

# Secure web application with CSRF protection
app = Flask(__name__)
app.secret_key = 'secure_secret_key'
csrf = CSRFProtection(app)

@app.route('/transfer', methods=['POST'])
def secure_transfer():
    if 'user_id' not in session:
        return redirect('/login')
    
    # CSRF protection is automatically applied by middleware
    to_account = request.form['to_account']
    amount = request.form['amount']
    
    # Additional validation
    if not validate_account_number(to_account):
        abort(400, "Invalid account number")
    
    if not validate_amount(amount):
        abort(400, "Invalid amount")
    
    # Process transfer
    print(f"Secure transfer: ${amount} to account {to_account}")
    return f"Transferred ${amount} to {to_account}"

def validate_account_number(account):
    """Validate account number format"""
    return account.isdigit() and len(account) >= 8

def validate_amount(amount):
    """Validate transfer amount"""
    try:
        amt = float(amount)
        return 0 < amt <= 10000  # Reasonable limits
    except ValueError:
        return False

# Template helper for CSRF tokens
@app.context_processor
def inject_csrf_token():
    if 'user_id' in session:
        token = csrf.generate_csrf_token(session)
        return {'csrf_token': token}
    return {}

# Secure form template
secure_form_template = '''
<form method="POST" action="/transfer">
    <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
    <label>To Account: <input type="text" name="to_account" required></label>
    <label>Amount: <input type="number" name="amount" step="0.01" required></label>
    <button type="submit">Transfer</button>
</form>
'''

```

### SameSite Cookie Protection

```python
# Enhanced session configuration for CSRF protection
@app.after_request
def set_secure_headers(response):
    # Set secure session cookie attributes
    if 'Set-Cookie' in response.headers:
        cookies = response.headers.getlist('Set-Cookie')
        response.headers.pop('Set-Cookie')
        
        for cookie in cookies:
            if 'session=' in cookie:
                # Add SameSite protection
                if 'SameSite=' not in cookie:
                    cookie += '; SameSite=Strict'
                
                # Ensure Secure flag for HTTPS
                if request.is_secure and 'Secure' not in cookie:
                    cookie += '; Secure'
                
                # Add HttpOnly flag
                if 'HttpOnly' not in cookie:
                    cookie += '; HttpOnly'
            
            response.headers.add('Set-Cookie', cookie)
    
    return response

```

## Broken Authentication Patterns

### Common Authentication Vulnerabilities

Broken authentication encompasses various vulnerabilities that compromise user identity verification and session management.

```python
import bcrypt
import jwt
import time
import secrets
from datetime import datetime, timedelta
from collections import defaultdict, deque

class VulnerableAuthenticator:
    """Example of common authentication vulnerabilities"""
    
    def __init__(self):
        self.users = {
            'admin': 'admin123',  # Vulnerable: weak password
            'user1': 'password'   # Vulnerable: common password
        }
        self.sessions = {}
    
    def login_vulnerable(self, username, password):
        """Vulnerable login implementation"""
        # Vulnerable: no rate limiting
        # Vulnerable: timing attack possible
        if username in self.users and self.users[username] == password:
            # Vulnerable: predictable session ID
            session_id = f"{username}_{int(time.time())}"
            self.sessions[session_id] = username
            return session_id
        return None
    
    def check_session_vulnerable(self, session_id):
        """Vulnerable session validation"""
        # Vulnerable: no session timeout
        # Vulnerable: no session invalidation
        return self.sessions.get(session_id)

class SecureAuthenticator:
    """Secure authentication implementation"""
    
    def __init__(self):
        self.users = {}
        self.sessions = {}
        self.failed_attempts = defaultdict(deque)
        self.locked_accounts = {}
        self.session_timeout = 3600  # 1 hour
        self.max_failed_attempts = 5
        self.lockout_duration = 900  # 15 minutes
    
    def register_user(self, username, password):
        """Secure user registration"""
        # Validate password strength
        if not self.is_strong_password(password):
            raise ValueError("Password does not meet security requirements")
        
        # Hash password with salt
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        self.users[username] = {
            'password_hash': password_hash,
            'created_at': datetime.now(),
            'last_login': None,
            'failed_login_count': 0
        }
    
    def is_strong_password(self, password):
        """Validate password strength"""
        if len(password) < 12:
            return False
        
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password)
        
        # Common password check (simplified)
        common_passwords = ['password', '123456', 'admin123', 'qwerty']
        if password.lower() in common_passwords:
            return False
        
        return has_upper and has_lower and has_digit and has_special
    
    def login(self, username, password, client_ip):
        """Secure login with rate limiting and proper validation"""
        current_time = time.time()
        
        # Check if account is locked
        if self.is_account_locked(username):
            raise Exception("Account temporarily locked due to failed login attempts")
        
        # Check rate limiting per IP
        if self.is_ip_rate_limited(client_ip):
            raise Exception("Too many login attempts from this IP")
        
        # Validate user exists
        if username not in self.users:
            self.record_failed_attempt(username, client_ip)
            # Use constant time to prevent username enumeration
            bcrypt.hashpw(b'dummy', bcrypt.gensalt())
            raise Exception("Invalid credentials")
        
        user_data = self.users[username]
        
        # Verify password (constant time comparison)
        if not bcrypt.checkpw(password.encode('utf-8'), user_data['password_hash']):
            self.record_failed_attempt(username, client_ip)
            raise Exception("Invalid credentials")
        
        # Reset failed attempts on successful login
        self.reset_failed_attempts(username, client_ip)
        
        # Create secure session
        session_id = self.create_session(username)
        
        # Update last login
        user_data['last_login'] = datetime.now()
        
        return session_id
    
    def create_session(self, username):
        """Create cryptographically secure session"""
        session_id = secrets.token_urlsafe(32)
        
        self.sessions[session_id] = {
            'username': username,
            'created_at': time.time(),
            'last_activity': time.time(),
            'ip_address': None,  # Set by calling code
            'user_agent': None   # Set by calling code
        }
        
        return session_id
    
    def validate_session(self, session_id, client_ip=None, user_agent=None):
        """Validate session with security checks"""
        if session_id not in self.sessions:
            return None
        
        session = self.sessions[session_id]
        current_time = time.time()
        
        # Check session timeout
        if current_time - session['last_activity'] > self.session_timeout:
            self.invalidate_session(session_id)
            return None
        
        # Check for session hijacking (simplified)
        if client_ip and session.get('ip_address') and session['ip_address'] != client_ip:
            self.invalidate_session(session_id)
            raise Exception("Session security violation detected")
        
        # Update last activity
        session['last_activity'] = current_time
        
        return session['username']
    
    def invalidate_session(self, session_id):
        """Securely invalidate session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
    
    def is_account_locked(self, username):
        """Check if account is temporarily locked"""
        if username in self.locked_accounts:
            lock_time = self.locked_accounts[username]
            if time.time() - lock_time < self.lockout_duration:
                return True
            else:
                del self.locked_accounts[username]
        return False
    
    def is_ip_rate_limited(self, client_ip):
        """Check if IP is rate limited"""
        current_time = time.time()
        
        # Clean old attempts (older than 15 minutes)
        while (self.failed_attempts[client_ip] and 
               current_time - self.failed_attempts[client_ip][0] > 900):
            self.failed_attempts[client_ip].popleft()
        
        # Check if too many attempts
        return len(self.failed_attempts[client_ip]) >= self.max_failed_attempts
    
    def record_failed_attempt(self, username, client_ip):
        """Record failed login attempt"""
        current_time = time.time()
        
        # Record IP-based attempt
        self.failed_attempts[client_ip].append(current_time)
        
        # Update user failed count
        if username in self.users:
            self.users[username]['failed_login_count'] += 1
            
            # Lock account if too many failures
            if self.users[username]['failed_login_count'] >= self.max_failed_attempts:
                self.locked_accounts[username] = current_time
    
    def reset_failed_attempts(self, username, client_ip):
        """Reset failed attempts on successful login"""
        if username in self.users:
            self.users[username]['failed_login_count'] = 0
        
        if client_ip in self.failed_attempts:
            self.failed_attempts[client_ip].clear()

# Example usage with Flask
from flask import Flask, request, session, jsonify

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)
auth = SecureAuthenticator()

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        auth.register_user(data['username'], data['password'])
        return jsonify({'status': 'success', 'message': 'User registered'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        session_id = auth.login(
            data['username'], 
            data['password'], 
            request.remote_addr
        )
        
        session['session_id'] = session_id
        return jsonify({'status': 'success', 'session_id': session_id})
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 401

@app.route('/protected')
def protected_resource():
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        username = auth.validate_session(
            session_id, 
            request.remote_addr, 
            request.user_agent.string
        )
        return jsonify({'message': f'Hello {username}', 'data': 'protected content'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 401

```

## Security Misconfigurations

### Common Configuration Vulnerabilities

Security misconfigurations are among the most common vulnerabilities, often resulting from default settings, incomplete configurations, or overly permissive setups.

```python
import os
from flask import Flask
from flask_talisman import Talisman

class SecurityConfigurationManager:
    """Manages secure application configuration"""
    
    def __init__(self):
        self.security_headers = {
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
    
    def configure_secure_flask_app(self, app):
        """Configure Flask app with security best practices"""
        
        # Secure configuration
        app.config.update({
            # Session security
            'SESSION_COOKIE_SECURE': True,  # HTTPS only
            'SESSION_COOKIE_HTTPONLY': True,  # No JavaScript access
            'SESSION_COOKIE_SAMESITE': 'Strict',  # CSRF protection
            'PERMANENT_SESSION_LIFETIME': 3600,  # 1 hour timeout
            
            # General security
            'SECRET_KEY': os.environ.get('SECRET_KEY', os.urandom(32)),
            'WTF_CSRF_ENABLED': True,
            'DEBUG': False,  # Never enable in production
            'TESTING': False,
            
            # File upload security
            'MAX_CONTENT_LENGTH': 16 * 1024 * 1024,  # 16MB max file size
            'UPLOAD_FOLDER': '/secure/uploads',
            
            # Database security
            'SQLALCHEMY_DATABASE_URI': os.environ.get('DATABASE_URL', 'sqlite:///secure_app.db'),
            'SQLALCHEMY_TRACK_MODIFICATIONS': False,
            'SQLALCHEMY_ENGINE_OPTIONS': {
                'pool_pre_ping': True,
                'pool_recycle': 300,
            }
        })
        
        # Apply security headers
        Talisman(app, 
                force_https=True,
                strict_transport_security=True,
                content_security_policy=self.security_headers['Content-Security-Policy'])
        
        return app
    
    def check_configuration_security(self, app):
        """Audit application configuration for security issues"""
        issues = []
        
        # Check debug mode
        if app.config.get('DEBUG', False):
            issues.append({
                'severity': 'critical',
                'issue': 'Debug mode enabled in production',
                'recommendation': 'Set DEBUG=False'
            })
        
        # Check secret key
        secret_key = app.config.get('SECRET_KEY')
        if not secret_key or len(str(secret_key)) < 32:
            issues.append({
                'severity': 'critical',
                'issue': 'Weak or missing secret key',
                'recommendation': 'Use a strong, randomly generated secret key'
            })
        
        # Check session security
        if not app.config.get('SESSION_COOKIE_SECURE', False):
            issues.append({
                'severity': 'high',
                'issue': 'Session cookies not marked as secure',
                'recommendation': 'Set SESSION_COOKIE_SECURE=True'
            })
        
        if not app.config.get('SESSION_COOKIE_HTTPONLY', False):
            issues.append({
                'severity': 'high',
                'issue': 'Session cookies accessible to JavaScript',
                'recommendation': 'Set SESSION_COOKIE_HTTPONLY=True'
            })
        
        # Check HTTPS enforcement
        if not app.config.get('PREFERRED_URL_SCHEME') == 'https':
            issues.append({
                'severity': 'medium',
                'issue': 'HTTPS not enforced',
                'recommendation': 'Set PREFERRED_URL_SCHEME=https'
            })
        
        return issues

# Example of secure vs insecure configuration
def create_vulnerable_app():
    """Example of insecure Flask configuration"""
    app = Flask(__name__)
    
    # Vulnerable configurations
    app.config.update({
        'DEBUG': True,  # Exposes sensitive information
        'SECRET_KEY': 'easy_to_guess',  # Weak secret
        'SESSION_COOKIE_SECURE': False,  # Allows HTTP transmission
        'SESSION_COOKIE_HTTPONLY': False,  # XSS vulnerable
        'WTF_CSRF_ENABLED': False,  # CSRF vulnerable
    })
    
    return app

def create_secure_app():
    """Example of secure Flask configuration"""
    app = Flask(__name__)
    config_manager = SecurityConfigurationManager()
    
    # Apply secure configuration
    secure_app = config_manager.configure_secure_flask_app(app)
    
    # Additional security middleware
    @secure_app.before_request
    def security_headers():
        # Custom security headers if needed
        pass
    
    @secure_app.after_request
    def apply_caching(response):
        # Prevent caching of sensitive pages
        if request.endpoint in ['login', 'admin', 'profile']:
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
        
        return response
    
    return secure_app

```

### Environment-Specific Security

```python
import os
import json
from pathlib import Path

class EnvironmentSecurityValidator:
    """Validates security configurations across environments"""
    
    def __init__(self):
        self.required_env_vars = [
            'SECRET_KEY',
            'DATABASE_URL',
            'API_KEY_ENCRYPTION_KEY'
        ]
        
        self.sensitive_patterns = [
            'password',
            'secret',
            'key',
            'token',
            'credential'
        ]
    
    def validate_environment(self):
        """Validate current environment security"""
        issues = []
        
        # Check required environment variables
        for var in self.required_env_vars:
            if not os.environ.get(var):
                issues.append({
                    'type': 'missing_env_var',
                    'severity': 'critical',
                    'details': f'Required environment variable {var} not set'
                })
        
        # Check for hardcoded secrets in environment
        for key, value in os.environ.items():
            if any(pattern in key.lower() for pattern in self.sensitive_patterns):
                if len(value) < 16:  # Suspiciously short for a secret
                    issues.append({
                        'type': 'weak_secret',
                        'severity': 'high',
                        'details': f'Environment variable {key} appears to contain a weak secret'
                    })
        
        # Check file permissions on sensitive files
        sensitive_files = ['.env', 'config.py', 'secrets.json']
        for filename in sensitive_files:
            filepath = Path(filename)
            if filepath.exists():
                stat = filepath.stat()
                # Check if file is readable by others (Unix-like systems)
                if hasattr(stat, 'st_mode') and (stat.st_mode & 0o044):
                    issues.append({
                        'type': 'file_permissions',
                        'severity': 'medium',
                        'details': f'Sensitive file {filename} is readable by others'
                    })
        
        return issues
    
    def secure_config_loader(self, config_file):
        """Securely load configuration from file"""
        try:
            config_path = Path(config_file)
            
            # Verify file permissions
            if config_path.exists():
                stat = config_path.stat()
                if hasattr(stat, 'st_mode') and (stat.st_mode & 0o044):
                    raise PermissionError(f"Config file {config_file} has insecure permissions")
            
            # Load and validate configuration
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            # Validate configuration structure
            self.validate_config_structure(config)
            
            return config
        
        except Exception as e:
            raise Exception(f"Failed to load secure configuration: {e}")
    
    def validate_config_structure(self, config):
        """Validate configuration structure and values"""
        # Check for required security settings
        security_settings = config.get('security', {})
        
        required_security_keys = [
            'session_timeout',
            'max_login_attempts',
            'password_policy'
        ]
        
        for key in required_security_keys:
            if key not in security_settings:
                raise ValueError(f"Missing required security setting: {key}")
        
        # Validate password policy
        password_policy = security_settings.get('password_policy', {})
        if password_policy.get('min_length', 0) < 12:
            raise ValueError("Password minimum length should be at least 12 characters")

```

## Race Conditions and Concurrency Issues

### Understanding Race Conditions

**Race conditions** occur when the behavior of software depends on the relative timing of events, such as the order in which threads execute. In web applications, this can lead to data corruption, privilege escalation, or business logic bypasses.

```python
import threading
import time
import uuid
from collections import defaultdict

class VulnerableWallet:
    """Example of race condition vulnerability"""
    
    def __init__(self):
        self.balances = defaultdict(float)
        self.transactions = []
    
    def deposit(self, user_id, amount):
        """Vulnerable deposit method"""
        # Race condition: non-atomic read-modify-write
        current_balance = self.balances[user_id]
        time.sleep(0.001)  # Simulate processing delay
        self.balances[user_id] = current_balance + amount
        
        self.transactions.append({
            'type': 'deposit',
            'user_id': user_id,
            'amount': amount,
            'timestamp': time.time()
        })
    
    def withdraw(self, user_id, amount):
        """Vulnerable withdrawal method"""
        # Race condition: check-then-use vulnerability
        if self.balances[user_id] >= amount:
            time.sleep(0.001)  # Simulate processing delay
            current_balance = self.balances[user_id]
            self.balances[user_id] = current_balance - amount
            
            self.transactions.append({
                'type': 'withdraw',
                'user_id': user_id,
                'amount': amount,
                'timestamp': time.time()
            })
            return True
        return False

class SecureWallet:
    """Secure implementation with proper concurrency control"""
    
    def __init__(self):
        self.balances = defaultdict(float)
        self.transactions = []
        self.locks = defaultdict(threading.RLock)  # Per-user locks
        self.global_lock = threading.RLock()
    
    def deposit(self, user_id, amount):
        """Thread-safe deposit method"""
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        
        with self.locks[user_id]:
            # Atomic operation within lock
            self.balances[user_id] += amount
            
            with self.global_lock:
                self.transactions.append({
                    'id': str(uuid.uuid4()),
                    'type': 'deposit',
                    'user_id': user_id,
                    'amount': amount,
                    'timestamp': time.time(),
                    'status': 'completed'
                })
    
    def withdraw(self, user_id, amount):
        """Thread-safe withdrawal method"""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        
        with self.locks[user_id]:
            # Atomic check and update
            if self.balances[user_id] >= amount:
                self.balances[user_id] -= amount
                
                with self.global_lock:
                    self.transactions.append({
                        'id': str(uuid.uuid4()),
                        'type': 'withdraw',
                        'user_id': user_id,
                        'amount': amount,
                        'timestamp': time.time(),
                        'status': 'completed'
                    })
                return True
            else:
                with self.global_lock:
                    self.transactions.append({
                        'id': str(uuid.uuid4()),
                        'type': 'withdraw_failed',
                        'user_id': user_id,
                        'amount': amount,
                        'timestamp': time.time(),
                        'status': 'insufficient_funds'
                    })
                return False
    
    def transfer(self, from_user_id, to_user_id, amount):
        """Thread-safe transfer between users"""
        if amount <= 0:
            raise ValueError("Transfer amount must be positive")
        
        if from_user_id == to_user_id:
            raise ValueError("Cannot transfer to same user")
        
        # Always acquire locks in consistent order to prevent deadlock
        user_ids = sorted([from_user_id, to_user_id])
        
        with self.locks[user_ids[0]], self.locks[user_ids[1]]:
            if self.balances[from_user_id] >= amount:
                self.balances[from_user_id] -= amount
                self.balances[to_user_id] += amount
                
                with self.global_lock:
                    transaction_id = str(uuid.uuid4())
                    
                    # Record as single atomic transaction
                    self.transactions.append({
                        'id': transaction_id,
                        'type': 'transfer',
                        'from_user_id': from_user_id,
                        'to_user_id': to_user_id,
                        'amount': amount,
                        'timestamp': time.time(),
                        'status': 'completed'
                    })
                
                return transaction_id
            else:
                raise ValueError("Insufficient funds for transfer")

# Demonstration of race condition
def demonstrate_race_condition():
    """Demonstrate race condition vulnerability"""
    vulnerable_wallet = VulnerableWallet()
    secure_wallet = SecureWallet()
    
    # Add initial balance
    vulnerable_wallet.balances['user1'] = 100
    secure_wallet.balances['user1'] = 100
    
    def attempt_concurrent_withdrawals(wallet, user_id, amount, attempts):
        """Attempt multiple concurrent withdrawals"""
        threads = []
        results = []
        
        def withdraw_worker():
            result = wallet.withdraw(user_id, amount)
            results.append(result)
        
        # Start multiple threads simultaneously
        for _ in range(attempts):
            thread = threading.Thread(target=withdraw_worker)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        return results
    
    print("Testing vulnerable wallet...")
    vulnerable_results = attempt_concurrent_withdrawals(vulnerable_wallet, 'user1', 50, 5)
    print(f"Vulnerable wallet successful withdrawals: {sum(vulnerable_results)}")
    print(f"Vulnerable wallet final balance: {vulnerable_wallet.balances['user1']}")
    
    print("\nTesting secure wallet...")
    secure_results = attempt_concurrent_withdrawals(secure_wallet, 'user1', 50, 5)
    print(f"Secure wallet successful withdrawals: {sum(secure_results)}")
    print(f"Secure wallet final balance: {secure_wallet.balances['user1']}")

if __name__ == "__main__":
    demonstrate_race_condition()

```

### Database-Level Race Condition Prevention

```python
import sqlite3
import threading
from contextlib import contextmanager

class DatabaseTransactionManager:
    """Manages database transactions to prevent race conditions"""
    
    def __init__(self, db_path):
        self.db_path = db_path
        self.local = threading.local()
    
    @contextmanager
    def get_connection(self):
        """Get database connection with proper isolation"""
        if not hasattr(self.local, 'connection'):
            self.local.connection = sqlite3.connect(
                self.db_path,
                isolation_level=None,  # Manual transaction control
                check_same_thread=False
            )
            self.local.connection.execute('PRAGMA foreign_keys = ON')
        
        try:
            yield self.local.connection
        finally:
            # Connection cleanup handled by thread-local storage
            pass
    
    @contextmanager
    def transaction(self):
        """Database transaction context manager"""
        with self.get_connection() as conn:
            try:
                conn.execute('BEGIN IMMEDIATE')  # Exclusive lock
                yield conn
                conn.execute('COMMIT')
            except Exception as e:
                conn.execute('ROLLBACK')
                raise e
    
    def secure_balance_update(self, user_id, amount_change):
        """Update balance with proper locking"""
        with self.transaction() as conn:
            # Use SELECT FOR UPDATE equivalent (IMMEDIATE transaction)
            cursor = conn.execute(
                'SELECT balance FROM users WHERE id = ?',
                (user_id,)
            )
            row = cursor.fetchone()
            
            if not row:
                raise ValueError("User not found")
            
            current_balance = row[0]
            new_balance = current_balance + amount_change
            
            if new_balance < 0:
                raise ValueError("Insufficient funds")
            
            # Update with WHERE clause to ensure row hasn't changed
            cursor = conn.execute(
                'UPDATE users SET balance = ? WHERE id = ? AND balance = ?',
                (new_balance, user_id, current_balance)
            )
            
            if cursor.rowcount == 0:
                raise Exception("Balance update failed - concurrent modification detected")
            
            return new_balance

```

## Side-Channel Attacks

### Understanding Side-Channel Attacks

**Side-channel attacks** exploit information leaked through implementation details rather than vulnerabilities in the algorithm itself. Common side-channels include timing, power consumption, and electromagnetic radiation.

```python
import time
import hmac
import hashlib
import secrets
from typing import Dict, Any

class VulnerableComparison:
    """Example of timing attack vulnerability"""
    
    def __init__(self):
        self.valid_tokens = {
            'user1': 'secret_token_123',
            'user2': 'another_secret_456'
        }
    
    def vulnerable_token_check(self, username, provided_token):
        """Vulnerable to timing attacks"""
        if username not in self.valid_tokens:
            return False
        
        valid_token = self.valid_tokens[username]
        
        # Vulnerable: early return on first character mismatch
        # Attacker can measure response time to guess characters
        if len(provided_token) != len(valid_token):
            return False
        
        for i in range(len(valid_token)):
            if provided_token[i] != valid_token[i]:
                return False  # Early return leaks timing information
        
        return True
    
    def vulnerable_login(self, username, password):
        """Vulnerable login with timing side-channel"""
        # User enumeration via timing
        if username not in self.valid_tokens:
            # Fast path: no password hashing for invalid users
            return False
        
        # Slow path: password hashing for valid users
        # This timing difference allows username enumeration
        time.sleep(0.1)  # Simulate password hashing
        return password == "correct_password"

class SecureComparison:
    """Secure implementation resistant to timing attacks"""
    
    def __init__(self):
        # Store hashed tokens instead of plaintext
        self.user_token_hashes = {
            'user1': hashlib.sha256(b'secret_token_123').hexdigest(),
            'user2': hashlib.sha256(b'another_secret_456').hexdigest()
        }
        
        self.dummy_user_data = {
            'password_hash': hashlib.sha256(b'dummy_password').hexdigest()
        }
    
    def secure_token_check(self, username, provided_token):
        """Timing-safe token verification"""
        if username not in self.user_token_hashes:
            # Use dummy comparison to maintain constant time
            dummy_hash = hashlib.sha256(b'dummy_token').hexdigest()
            hmac.compare_digest(dummy_hash, hashlib.sha256(provided_token.encode()).hexdigest())
            return False
        
        # Always perform hash comparison in constant time
        provided_hash = hashlib.sha256(provided_token.encode()).hexdigest()
        valid_hash = self.user_token_hashes[username]
        
        return hmac.compare_digest(valid_hash, provided_hash)
    
    def secure_login(self, username, password):
        """Constant-time login to prevent user enumeration"""
        # Always perform the same operations regardless of user existence
        if username in self.user_token_hashes:
            user_data = {'password_hash': 'actual_hash'}  # From database
        else:
            user_data = self.dummy_user_data  # Dummy data for timing consistency
        
        # Always perform password hashing (constant time)
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Constant-time comparison
        is_valid = hmac.compare_digest(user_data['password_hash'], password_hash)
        
        # Only return True if user exists AND password matches
        return username in self.user_token_hashes and is_valid

class TimingAttackDetector:
    """Detect potential timing attack attempts"""
    
    def __init__(self):
        self.request_times = {}
        self.suspicious_patterns = []
    
    def record_request(self, client_ip, endpoint, duration):
        """Record request timing information"""
        if client_ip not in self.request_times:
            self.request_times[client_ip] = []
        
        self.request_times[client_ip].append({
            'endpoint': endpoint,
            'duration': duration,
            'timestamp': time.time()
        })
        
        # Analyze for suspicious patterns
        self.analyze_timing_patterns(client_ip)
    
    def analyze_timing_patterns(self, client_ip):
        """Analyze request patterns for timing attacks"""
        requests = self.request_times[client_ip]
        
        if len(requests) < 10:  # Need sufficient data
            return
        
        # Check for rapid sequential requests to same endpoint
        recent_requests = [r for r in requests if time.time() - r['timestamp'] < 60]
        
        if len(recent_requests) > 50:  # Many requests in short time
            endpoint_counts = {}
            for req in recent_requests:
                endpoint = req['endpoint']
                endpoint_counts[endpoint] = endpoint_counts.get(endpoint, 0) + 1
            
            # Check if focusing on authentication endpoints
            auth_endpoints = ['/login', '/verify_token', '/reset_password']
            auth_requests = sum(endpoint_counts.get(ep, 0) for ep in auth_endpoints)
            
            if auth_requests > 30:  # Suspicious authentication activity
                self.suspicious_patterns.append({
                    'client_ip': client_ip,
                    'pattern': 'potential_timing_attack',
                    'auth_requests': auth_requests,
                    'timestamp': time.time()
                })

# Secure implementation with monitoring
class SecureAuthenticationService:
    """Complete secure authentication service"""
    
    def __init__(self):
        self.secure_comparison = SecureComparison()
        self.timing_detector = TimingAttackDetector()
        self.rate_limiter = {}  # Simple rate limiting
    
    def authenticate(self, username, token, client_ip):
        """Secure authentication with monitoring"""
        start_time = time.time()
        
        try:
            # Rate limiting
            if self.is_rate_limited(client_ip):
                time.sleep(0.1)  # Constant delay
                return False
            
            # Perform authentication
            result = self.secure_comparison.secure_token_check(username, token)
            
            return result
        
        finally:
            # Record timing information
            duration = time.time() - start_time
            self.timing_detector.record_request(client_ip, '/authenticate', duration)
    
    def is_rate_limited(self, client_ip):
        """Simple rate limiting implementation"""
        current_time = time.time()
        
        if client_ip not in self.rate_limiter:
            self.rate_limiter[client_ip] = []
        
        # Clean old requests
        self.rate_limiter[client_ip] = [
            req_time for req_time in self.rate_limiter[client_ip]
            if current_time - req_time < 60  # Last minute
        ]
        
        # Check limit
        if len(self.rate_limiter[client_ip]) >= 10:  # 10 requests per minute
            return True
        
        self.rate_limiter[client_ip].append(current_time)
        return False

# Example usage and demonstration
def demonstrate_timing_attack():
    """Demonstrate timing attack vulnerability and mitigation"""
    vulnerable = VulnerableComparison()
    secure = SecureComparison()
    
    print("Demonstrating timing attack vulnerability...")
    
    # Measure timing for correct vs incorrect tokens
    def measure_timing(func, *args):
        start = time.time()
        result = func(*args)
        end = time.time()
        return result, end - start
    
    # Test with vulnerable implementation
    print("\nVulnerable implementation:")
    _, time1 = measure_timing(vulnerable.vulnerable_token_check, 'user1', 'a')
    _, time2 = measure_timing(vulnerable.vulnerable_token_check, 'user1', 'secret_token_123')
    
    print(f"Wrong token timing: {time1:.6f}s")
    print(f"Correct token timing: {time2:.6f}s")
    print(f"Timing difference: {abs(time2 - time1):.6f}s")
    
    # Test with secure implementation
    print("\nSecure implementation:")
    _, time3 = measure_timing(secure.secure_token_check, 'user1', 'a')
    _, time4 = measure_timing(secure.secure_token_check, 'user1', 'secret_token_123')
    
    print(f"Wrong token timing: {time3:.6f}s")
    print(f"Correct token timing: {time4:.6f}s")
    print(f"Timing difference: {abs(time4 - time3):.6f}s")

if __name__ == "__main__":
    demonstrate_timing_attack()

```

## Comprehensive Web Security Implementation

Let's create a complete secure web application that addresses all the vulnerabilities discussed:

```python
from flask import Flask, request, session, jsonify, render_template_string
from flask_talisman import Talisman
import secrets
import time
import threading
from functools import wraps

class SecureWebApplication:
    """Complete secure web application implementation"""
    
    def __init__(self):
        self.app = Flask(__name__)
        self.setup_security()
        self.setup_routes()
        
        # Security components
        self.csrf_protection = CSRFProtection(self.app)
        self.authenticator = SecureAuthenticator()
        self.config_manager = SecurityConfigurationManager()
        self.wallet = SecureWallet()
        self.timing_detector = TimingAttackDetector()
        
        # Apply security configuration
        self.config_manager.configure_secure_flask_app(self.app)
    
    def setup_security(self):
        """Configure application security"""
        self.app.config.update({
            'SECRET_KEY': secrets.token_hex(32),
            'SESSION_TIMEOUT': 1800,  # 30 minutes
            'MAX_CONTENT_LENGTH': 16 * 1024 * 1024,  # 16MB
        })
        
        # Security headers
        Talisman(self.app, force_https=False)  # Set to True in production
    
    def require_auth(self, f):
        """Authentication decorator"""
        @wraps(f)
        def decorated(*args, **kwargs):
            session_id = session.get('session_id')
            if not session_id:
                return jsonify({'error': 'Authentication required'}), 401
            
            try:
                username = self.authenticator.validate_session(
                    session_id, 
                    request.remote_addr,
                    request.user_agent.string
                )
                request.current_user = username
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': 'Invalid session'}), 401
        return decorated
    
    def setup_routes(self):
        """Setup secure application routes"""
        
        @self.app.route('/register', methods=['POST'])
        def register():
            start_time = time.time()
            try:
                data = request.get_json()
                if not data or 'username' not in data or 'password' not in data:
                    return jsonify({'error': 'Username and password required'}), 400
                
                self.authenticator.register_user(data['username'], data['password'])
                return jsonify({'status': 'success', 'message': 'User registered'})
            
            except Exception as e:
                return jsonify({'error': str(e)}), 400
            
            finally:
                duration = time.time() - start_time
                self.timing_detector.record_request(request.remote_addr, '/register', duration)
        
        @self.app.route('/login', methods=['POST'])
        def login():
            start_time = time.time()
            try:
                data = request.get_json()
                if not data or 'username' not in data or 'password' not in data:
                    return jsonify({'error': 'Username and password required'}), 400
                
                session_id = self.authenticator.login(
                    data['username'],
                    data['password'],
                    request.remote_addr
                )
                
                session['session_id'] = session_id
                return jsonify({'status': 'success', 'message': 'Login successful'})
            
            except Exception as e:
                return jsonify({'error': str(e)}), 401
            
            finally:
                duration = time.time() - start_time
                self.timing_detector.record_request(request.remote_addr, '/login', duration)
        
        @self.app.route('/logout', methods=['POST'])
        @self.require_auth
        def logout():
            session_id = session.get('session_id')
            if session_id:
                self.authenticator.invalidate_session(session_id)
            session.clear()
            return jsonify({'status': 'success', 'message': 'Logged out'})
        
        @self.app.route('/profile')
        @self.require_auth
        def profile():
            return jsonify({
                'username': request.current_user,
                'balance': self.wallet.balances[request.current_user]
            })
        
        @self.app.route('/transfer', methods=['POST'])
        @self.require_auth
        def transfer():
            # CSRF protection automatically applied
            try:
                data = request.get_json()
                transaction_id = self.wallet.transfer(
                    request.current_user,
                    data['to_user'],
                    float(data['amount'])
                )
                return jsonify({
                    'status': 'success',
                    'transaction_id': transaction_id
                })
            except Exception as e:
                return jsonify({'error': str(e)}), 400
        
        @self.app.route('/security_audit')
        @self.require_auth  
        def security_audit():
            # Only allow admin users
            if request.current_user != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            
            issues = self.config_manager.check_configuration_security(self.app)
            suspicious_patterns = self.timing_detector.suspicious_patterns
            
            return jsonify({
                'configuration_issues': issues,
                'suspicious_patterns': suspicious_patterns
            })

# Example usage
def create_app():
    """Create and configure secure web application"""
    secure_app = SecureWebApplication()
    return secure_app.app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=False, host='127.0.0.1', port=5000)

```

## Key Takeaways

### Web Application Security Principles

1. **CSRF Protection**: Always validate state-changing requests with tokens

2. **Authentication Security**: Use strong passwords, rate limiting, and secure sessions

3. **Configuration Management**: Secure defaults, environment separation, regular audits

4. **Concurrency Safety**: Proper locking, atomic operations, transaction management

5. **Side-Channel Resistance**: Constant-time operations, timing attack detection

### Best Practices Summary

- **Defense in Depth**: Layer multiple security controls

- **Secure by Default**: Start with secure configurations

- **Constant-Time Operations**: Prevent timing-based information leakage

- **Proper Error Handling**: Don't leak sensitive information

- **Regular Security Audits**: Continuously assess and improve security posture







