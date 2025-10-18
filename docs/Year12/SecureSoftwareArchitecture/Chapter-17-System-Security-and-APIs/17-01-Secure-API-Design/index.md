---
title: "17.1 Secure API Design"
---

# 17.1 Secure API Design

## Why It Matters

APIs (Application Programming Interfaces) are the backbone of modern applications, enabling communication between different systems, services, and client applications. However, APIs also represent significant attack surfaces that can expose sensitive data, business logic, and system resources to malicious actors.

**Real-world Impact:**

- **2019 Facebook API breach**: Exposed 50 million user accounts through improper access token validation

- **2021 Peloton API vulnerability**: Allowed unauthorized access to private user data through missing authentication

- **2020 Venmo API issue**: Public transaction data accessible without proper authorization controls

Secure API design is critical because APIs often:

- Handle sensitive user data and business information

- Provide direct access to backend systems and databases

- Are exposed to public networks and untrusted clients

- Serve as integration points between multiple applications

## Core Security Principles for APIs

### 1. Defense in Depth

Implement multiple layers of security controls rather than relying on a single protection mechanism.

### 2. Principle of Least Privilege

Grant the minimum access necessary for each API consumer to perform their intended function.

### 3. Fail Securely

When errors occur, ensure the system fails to a secure state rather than exposing sensitive information.

### 4. Security by Design

Build security controls into the API from the initial design phase, not as an afterthought.

## API Authentication Methods

### Understanding Authentication vs Authorization

**Authentication** answers "Who are you?" - verifying the identity of the API consumer.
**Authorization** answers "What can you do?" - determining what resources and actions are permitted.

```kroki-plantuml
@startuml API_Auth_Flow
!theme plain
skinparam backgroundColor white
skinparam defaultFontName "Arial"

actor Client
participant "API Gateway" as Gateway
participant "Auth Service" as Auth
participant "API Service" as API
database "User DB" as DB

Client -> Gateway: API Request + Credentials
Gateway -> Auth: Authenticate
Auth -> DB: Validate Credentials
DB -> Auth: User Info
Auth -> Gateway: Authentication Token
Gateway -> API: Authorized Request
API -> Gateway: Response
Gateway -> Client: API Response

@enduml

```

### 1. API Keys

API keys are simple tokens that identify and authenticate API consumers. While easy to implement, they have significant limitations.

#### Basic API Key Implementation

```python
import secrets
import hashlib
import time
from typing import Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class APIKey:
    """Represents an API key with metadata"""
    key_id: str
    key_hash: str  # Hashed version of the actual key
    name: str
    created_at: datetime
    expires_at: Optional[datetime] = None
    is_active: bool = True
    rate_limit: int = 1000  # requests per hour
    allowed_endpoints: list = None  # None means all endpoints

class APIKeyManager:
    """Secure API key management system"""
    
    def __init__(self):
        self.keys: Dict[str, APIKey] = {}
        self.usage_tracking: Dict[str, list] = {}
    
    def generate_api_key(self, name: str, expires_days: Optional[int] = None,
                        rate_limit: int = 1000, allowed_endpoints: list = None) -> tuple[str, str]:
        """
        Generate a new API key
        Returns: (key_id, actual_key) - store key_id, give actual_key to user
        """
        # Generate cryptographically secure key
        actual_key = secrets.token_urlsafe(32)
        key_id = secrets.token_urlsafe(16)
        
        # Hash the key for storage (never store plain text keys)
        key_hash = hashlib.sha256(actual_key.encode()).hexdigest()
        
        # Set expiration
        expires_at = None
        if expires_days:
            expires_at = datetime.now() + timedelta(days=expires_days)
        
        # Create API key record
        api_key = APIKey(
            key_id=key_id,
            key_hash=key_hash,
            name=name,
            created_at=datetime.now(),
            expires_at=expires_at,
            rate_limit=rate_limit,
            allowed_endpoints=allowed_endpoints or []
        )
        
        self.keys[key_id] = api_key
        self.usage_tracking[key_id] = []
        
        return key_id, actual_key
    
    def validate_api_key(self, provided_key: str) -> Optional[APIKey]:
        """
        Validate an API key and return associated metadata
        """
        if not provided_key:
            return None
        
        # Hash the provided key
        provided_hash = hashlib.sha256(provided_key.encode()).hexdigest()
        
        # Find matching key
        for key_id, api_key in self.keys.items():
            if api_key.key_hash == provided_hash:
                # Check if key is active
                if not api_key.is_active:
                    return None
                
                # Check if key has expired
                if api_key.expires_at and datetime.now() > api_key.expires_at:
                    return None
                
                return api_key
        
        return None
    
    def revoke_api_key(self, key_id: str) -> bool:
        """Revoke an API key"""
        if key_id in self.keys:
            self.keys[key_id].is_active = False
            return True
        return False
    
    def track_usage(self, key_id: str, endpoint: str):
        """Track API key usage for rate limiting"""
        if key_id not in self.usage_tracking:
            self.usage_tracking[key_id] = []
        
        self.usage_tracking[key_id].append({
            'timestamp': datetime.now(),
            'endpoint': endpoint
        })
    
    def check_rate_limit(self, key_id: str) -> bool:
        """Check if API key is within rate limit (last hour)"""
        if key_id not in self.usage_tracking:
            return True
        
        api_key = self.keys.get(key_id)
        if not api_key:
            return False
        
        # Count requests in the last hour
        one_hour_ago = datetime.now() - timedelta(hours=1)
        recent_requests = [
            req for req in self.usage_tracking[key_id]
            if req['timestamp'] > one_hour_ago
        ]
        
        return len(recent_requests) < api_key.rate_limit

# Example usage
def api_key_authentication_example():
    """Demonstrate API key authentication"""
    key_manager = APIKeyManager()
    
    # Generate API key for a client
    key_id, actual_key = key_manager.generate_api_key(
        name="Mobile App Client",
        expires_days=365,
        rate_limit=5000
    )
    
    print(f"Generated API Key ID: {key_id}")
    print(f"API Key (give to client): {actual_key}")
    
    # Simulate API request validation
    def authenticate_request(api_key: str) -> Dict[str, Any]:
        """Simulate API request authentication"""
        validated_key = key_manager.validate_api_key(api_key)
        
        if not validated_key:
            return {"error": "Invalid or expired API key", "status": 401}
        
        if not key_manager.check_rate_limit(validated_key.key_id):
            return {"error": "Rate limit exceeded", "status": 429}
        
        # Track the usage
        key_manager.track_usage(validated_key.key_id, "/api/endpoint")
        
        return {
            "authenticated": True,
            "key_name": validated_key.name,
            "remaining_requests": validated_key.rate_limit - len(
                key_manager.usage_tracking.get(validated_key.key_id, [])
            )
        }
    
    # Test authentication
    result = authenticate_request(actual_key)
    print(f"Authentication result: {result}")

if __name__ == "__main__":
    api_key_authentication_example()

```

#### API Key Security Best Practices

```python-template
class SecureAPIKeyValidator:
    """Enhanced API key validation with security features"""
    
    def __init__(self):
        self.failed_attempts: Dict[str, list] = {}
        self.blocked_ips: set = set()
    
    def validate_with_security_checks(self, api_key: str, client_ip: str, 
                                    endpoint: str) -> Dict[str, Any]:
        """Validate API key with additional security checks"""
        
        # Check if IP is blocked
        if client_ip in self.blocked_ips:
            return {"error": "IP address blocked", "status": 403}
        
        # Rate limiting on failed attempts
        if self._check_brute_force_attempts(client_ip):
            self._block_ip(client_ip)
            return {"error": "Too many failed attempts", "status": 429}
        
        # Validate API key
        if not self._is_valid_api_key_format(api_key):
            self._track_failed_attempt(client_ip)
            return {"error": "Invalid API key format", "status": 400}
        
        # Additional timing attack protection
        time.sleep(0.1)  # Constant time delay
        
        return {"status": "validated"}
    
    def _is_valid_api_key_format(self, api_key: str) -> bool:
        """Validate API key format to prevent injection"""
        if not api_key or len(api_key) < 20:
            return False
        
        # Check for only alphanumeric and safe characters
        import re
        if not re.match(r'^[A-Za-z0-9_-]+$', api_key):
            return False
        
        return True
    
    def _track_failed_attempt(self, client_ip: str):
        """Track failed authentication attempts"""
        if client_ip not in self.failed_attempts:
            self.failed_attempts[client_ip] = []
        
        self.failed_attempts[client_ip].append(datetime.now())
    
    def _check_brute_force_attempts(self, client_ip: str) -> bool:
        """Check if IP has too many failed attempts"""
        if client_ip not in self.failed_attempts:
            return False
        
        # Check last 15 minutes
        fifteen_min_ago = datetime.now() - timedelta(minutes=15)
        recent_failures = [
            attempt for attempt in self.failed_attempts[client_ip]
            if attempt > fifteen_min_ago
        ]
        
        return len(recent_failures) > 10  # More than 10 failures in 15 minutes
    
    def _block_ip(self, client_ip: str):
        """Block an IP address"""
        self.blocked_ips.add(client_ip)
        print(f"Blocked IP {client_ip} due to suspicious activity")

```

### 2. JSON Web Tokens (JWT)

JWTs provide a stateless authentication mechanism that can carry user information and permissions within the token itself.

#### JWT Implementation

```python
import jwt
import json
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class JWTManager:
    """Secure JWT token management"""
    
    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.blacklisted_tokens: set = set()
    
    def generate_token(self, user_id: str, permissions: list, 
                      expires_hours: int = 24) -> str:
        """Generate a JWT token with user information and permissions"""
        
        # Current time
        now = datetime.utcnow()
        
        # Create payload
        payload = {
            'user_id': user_id,
            'permissions': permissions,
            'iat': now,  # issued at
            'exp': now + timedelta(hours=expires_hours),  # expires
            'jti': secrets.token_urlsafe(16)  # unique token ID for blacklisting
        }
        
        # Generate token
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token
    
    def validate_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Validate JWT token and return payload if valid"""
        try:
            # Check if token is blacklisted
            if token in self.blacklisted_tokens:
                return None
            
            # Decode and validate token
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=[self.algorithm]
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            return None  # Token has expired
        except jwt.InvalidTokenError:
            return None  # Token is invalid
    
    def revoke_token(self, token: str):
        """Add token to blacklist (logout functionality)"""
        self.blacklisted_tokens.add(token)
    
    def refresh_token(self, old_token: str) -> Optional[str]:
        """Generate a new token from a valid existing token"""
        payload = self.validate_token(old_token)
        
        if not payload:
            return None
        
        # Revoke old token
        self.revoke_token(old_token)
        
        # Generate new token with same permissions
        return self.generate_token(
            user_id=payload['user_id'],
            permissions=payload['permissions']
        )

# JWT-based API authentication decorator
def jwt_required(permissions_required: list = None):
    """Decorator for protecting API endpoints with JWT"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # In a real Flask/FastAPI app, you'd get this from request headers
            # For demo purposes, we'll simulate it
            token = kwargs.get('jwt_token', '')
            
            jwt_manager = kwargs.get('jwt_manager')
            if not jwt_manager:
                return {"error": "JWT manager not configured", "status": 500}
            
            # Validate token
            payload = jwt_manager.validate_token(token)
            if not payload:
                return {"error": "Invalid or expired token", "status": 401}
            
            # Check permissions
            if permissions_required:
                user_permissions = payload.get('permissions', [])
                if not any(perm in user_permissions for perm in permissions_required):
                    return {"error": "Insufficient permissions", "status": 403}
            
            # Add user info to function call
            kwargs['current_user'] = payload
            return func(*args, **kwargs)
        
        return wrapper
    return decorator

# Example protected API endpoints
class SecureAPI:
    """Example API with JWT protection"""
    
    def __init__(self, jwt_manager: JWTManager):
        self.jwt_manager = jwt_manager
    
    @jwt_required(['read_users'])
    def get_users(self, jwt_token: str, jwt_manager: JWTManager, current_user: dict):
        """Protected endpoint requiring 'read_users' permission"""
        return {
            "users": ["user1", "user2", "user3"],
            "accessed_by": current_user['user_id']
        }
    
    @jwt_required(['admin'])
    def delete_user(self, user_id: str, jwt_token: str, 
                   jwt_manager: JWTManager, current_user: dict):
        """Protected endpoint requiring 'admin' permission"""
        return {
            "message": f"User {user_id} deleted",
            "deleted_by": current_user['user_id']
        }

def jwt_authentication_example():
    """Demonstrate JWT authentication"""
    
    # Initialize JWT manager
    jwt_manager = JWTManager(secret_key="your-secret-key-keep-this-secure")
    
    # Generate token for a user
    token = jwt_manager.generate_token(
        user_id="user123",
        permissions=["read_users", "write_posts"]
    )
    
    print(f"Generated JWT: {token[:50]}...")
    
    # Validate token
    payload = jwt_manager.validate_token(token)
    print(f"Token payload: {payload}")
    
    # Test API access
    api = SecureAPI(jwt_manager)
    
    # This should work (user has 'read_users' permission)
    result = api.get_users(jwt_token=token, jwt_manager=jwt_manager)
    print(f"API result: {result}")
    
    # This should fail (user doesn't have 'admin' permission)
    result = api.delete_user("user456", jwt_token=token, jwt_manager=jwt_manager)
    print(f"Admin action result: {result}")

if __name__ == "__main__":
    jwt_authentication_example()

```

### 3. OAuth 2.0 Flow Implementation

OAuth 2.0 is an authorization framework that enables applications to obtain limited access to user accounts.

```python
import urllib.parse
import requests
from typing import Dict, Optional

class OAuth2Manager:
    """OAuth 2.0 authorization server implementation"""
    
    def __init__(self, client_id: str, client_secret: str, 
                 authorization_base_url: str, token_url: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.authorization_base_url = authorization_base_url
        self.token_url = token_url
        self.authorization_codes: Dict[str, dict] = {}
        self.access_tokens: Dict[str, dict] = {}
    
    def generate_authorization_url(self, redirect_uri: str, 
                                 scope: str, state: str = None) -> str:
        """Generate OAuth authorization URL"""
        
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': redirect_uri,
            'scope': scope,
            'state': state or secrets.token_urlsafe(16)
        }
        
        # Build authorization URL
        authorization_url = f"{self.authorization_base_url}?{urllib.parse.urlencode(params)}"
        return authorization_url
    
    def exchange_code_for_token(self, authorization_code: str, 
                              redirect_uri: str) -> Optional[Dict[str, Any]]:
        """Exchange authorization code for access token"""
        
        # Validate authorization code
        if authorization_code not in self.authorization_codes:
            return None
        
        code_data = self.authorization_codes[authorization_code]
        
        # Check if code has expired (typically 10 minutes)
        if datetime.now() > code_data['expires_at']:
            del self.authorization_codes[authorization_code]
            return None
        
        # Generate access token
        access_token = secrets.token_urlsafe(32)
        refresh_token = secrets.token_urlsafe(32)
        
        token_data = {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'expires_in': 3600,  # 1 hour
            'scope': code_data['scope'],
            'user_id': code_data['user_id'],
            'created_at': datetime.now()
        }
        
        self.access_tokens[access_token] = token_data
        
        # Remove used authorization code
        del self.authorization_codes[authorization_code]
        
        return token_data
    
    def validate_access_token(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Validate OAuth access token"""
        
        if access_token not in self.access_tokens:
            return None
        
        token_data = self.access_tokens[access_token]
        
        # Check if token has expired
        expires_at = token_data['created_at'] + timedelta(seconds=token_data['expires_in'])
        if datetime.now() > expires_at:
            del self.access_tokens[access_token]
            return None
        
        return token_data

# OAuth-protected API endpoint
def oauth_required(scopes_required: list = None):
    """Decorator for OAuth-protected endpoints"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Get access token from Authorization header
            # In real implementation: token = request.headers.get('Authorization', '').replace('Bearer ', '')
            token = kwargs.get('access_token', '')
            
            oauth_manager = kwargs.get('oauth_manager')
            if not oauth_manager:
                return {"error": "OAuth not configured", "status": 500}
            
            # Validate token
            token_data = oauth_manager.validate_access_token(token)
            if not token_data:
                return {"error": "Invalid or expired access token", "status": 401}
            
            # Check scopes
            if scopes_required:
                token_scopes = token_data.get('scope', '').split()
                if not any(scope in token_scopes for scope in scopes_required):
                    return {"error": "Insufficient scope", "status": 403}
            
            kwargs['token_info'] = token_data
            return func(*args, **kwargs)
        
        return wrapper
    return decorator

def oauth_authentication_example():
    """Demonstrate OAuth 2.0 authentication flow"""
    
    oauth_manager = OAuth2Manager(
        client_id="your-client-id",
        client_secret="your-client-secret",
        authorization_base_url="https://auth.example.com/oauth/authorize",
        token_url="https://auth.example.com/oauth/token"
    )
    
    # Step 1: Generate authorization URL
    auth_url = oauth_manager.generate_authorization_url(
        redirect_uri="https://yourapp.com/callback",
        scope="read write",
        state="random-state-value"
    )
    print(f"Authorization URL: {auth_url}")
    
    # Step 2: Simulate user authorization (in real flow, user clicks auth_url)
    # This would be handled by the authorization server
    authorization_code = secrets.token_urlsafe(32)
    oauth_manager.authorization_codes[authorization_code] = {
        'user_id': 'user123',
        'scope': 'read write',
        'expires_at': datetime.now() + timedelta(minutes=10)
    }
    
    # Step 3: Exchange code for token
    token_data = oauth_manager.exchange_code_for_token(
        authorization_code=authorization_code,
        redirect_uri="https://yourapp.com/callback"
    )
    print(f"Access token data: {token_data}")
    
    # Step 4: Use token to access protected resource
    @oauth_required(['read'])
    def get_protected_data(access_token: str, oauth_manager: OAuth2Manager, token_info: dict):
        return {
            "data": "This is protected data",
            "user_id": token_info['user_id'],
            "scopes": token_info['scope']
        }
    
    result = get_protected_data(
        access_token=token_data['access_token'],
        oauth_manager=oauth_manager
    )
    print(f"Protected resource access: {result}")

if __name__ == "__main__":
    oauth_authentication_example()

```

## Rate Limiting and DoS Protection

Rate limiting is crucial for preventing abuse and ensuring fair resource allocation among API consumers.

### Token Bucket Algorithm Implementation

```python
import time
from threading import Lock
from typing import Dict, Optional
from dataclasses import dataclass

@dataclass
class TokenBucket:
    """Token bucket for rate limiting"""
    capacity: int  # Maximum number of tokens
    tokens: float  # Current number of tokens
    refill_rate: float  # Tokens added per second
    last_refill: float  # Last refill timestamp

class RateLimiter:
    """Advanced rate limiting with multiple algorithms"""
    
    def __init__(self):
        self.buckets: Dict[str, TokenBucket] = {}
        self.lock = Lock()
        self.request_history: Dict[str, list] = {}
    
    def create_rate_limit(self, identifier: str, requests_per_second: float, 
                         burst_capacity: int = None) -> TokenBucket:
        """Create a rate limit for an identifier (IP, user, API key)"""
        
        if burst_capacity is None:
            burst_capacity = int(requests_per_second * 10)  # Allow 10 seconds of burst
        
        bucket = TokenBucket(
            capacity=burst_capacity,
            tokens=burst_capacity,  # Start with full bucket
            refill_rate=requests_per_second,
            last_refill=time.time()
        )
        
        with self.lock:
            self.buckets[identifier] = bucket
        
        return bucket
    
    def is_allowed(self, identifier: str, tokens_requested: int = 1) -> tuple[bool, Dict[str, Any]]:
        """Check if request is allowed under rate limit"""
        
        with self.lock:
            # Get or create bucket
            if identifier not in self.buckets:
                # Default rate limit: 100 requests per second with burst of 1000
                self.create_rate_limit(identifier, 100, 1000)
            
            bucket = self.buckets[identifier]
            current_time = time.time()
            
            # Refill tokens based on elapsed time
            elapsed = current_time - bucket.last_refill
            tokens_to_add = elapsed * bucket.refill_rate
            bucket.tokens = min(bucket.capacity, bucket.tokens + tokens_to_add)
            bucket.last_refill = current_time
            
            # Check if enough tokens available
            if bucket.tokens >= tokens_requested:
                bucket.tokens -= tokens_requested
                
                return True, {
                    "allowed": True,
                    "remaining_tokens": int(bucket.tokens),
                    "reset_time": current_time + (bucket.capacity - bucket.tokens) / bucket.refill_rate
                }
            else:
                # Calculate when enough tokens will be available
                tokens_needed = tokens_requested - bucket.tokens
                wait_time = tokens_needed / bucket.refill_rate
                
                return False, {
                    "allowed": False,
                    "retry_after": wait_time,
                    "remaining_tokens": int(bucket.tokens)
                }
    
    def sliding_window_check(self, identifier: str, window_seconds: int = 3600, 
                           max_requests: int = 1000) -> tuple[bool, Dict[str, Any]]:
        """Sliding window rate limiting (alternative algorithm)"""
        
        current_time = time.time()
        window_start = current_time - window_seconds
        
        # Initialize request history if needed
        if identifier not in self.request_history:
            self.request_history[identifier] = []
        
        # Remove old requests outside the window
        self.request_history[identifier] = [
            req_time for req_time in self.request_history[identifier]
            if req_time > window_start
        ]
        
        # Check if within limit
        current_requests = len(self.request_history[identifier])
        
        if current_requests < max_requests:
            # Add current request
            self.request_history[identifier].append(current_time)
            
            return True, {
                "allowed": True,
                "requests_remaining": max_requests - current_requests - 1,
                "window_reset": window_start + window_seconds
            }
        else:
            # Calculate when window will reset
            oldest_request = min(self.request_history[identifier])
            reset_time = oldest_request + window_seconds
            
            return False, {
                "allowed": False,
                "retry_after": reset_time - current_time,
                "requests_remaining": 0
            }

class DDoSProtection:
    """DDoS protection with progressive penalties"""
    
    def __init__(self):
        self.rate_limiter = RateLimiter()
        self.suspicious_ips: Dict[str, dict] = {}
        self.blocked_ips: set = set()
    
    def analyze_request_pattern(self, ip_address: str, endpoint: str, 
                              user_agent: str) -> Dict[str, Any]:
        """Analyze request patterns for DDoS indicators"""
        
        # Check if IP is already blocked
        if ip_address in self.blocked_ips:
            return {
                "action": "block",
                "reason": "IP previously blocked for suspicious activity"
            }
        
        # Progressive rate limiting based on suspicion level
        suspicion_level = self._calculate_suspicion_level(ip_address, endpoint, user_agent)
        
        if suspicion_level == "low":
            allowed, info = self.rate_limiter.is_allowed(ip_address, 1)
            requests_per_second = 100
        elif suspicion_level == "medium":
            allowed, info = self.rate_limiter.sliding_window_check(ip_address, 60, 50)
            requests_per_second = 10
        else:  # high suspicion
            allowed, info = self.rate_limiter.sliding_window_check(ip_address, 60, 10)
            requests_per_second = 1
        
        if not allowed:
            # Track consecutive violations
            self._track_violation(ip_address)
            
            # Check if IP should be blocked
            if self._should_block_ip(ip_address):
                self.blocked_ips.add(ip_address)
                return {
                    "action": "block",
                    "reason": "Too many rate limit violations"
                }
        
        return {
            "action": "allow" if allowed else "rate_limit",
            "suspicion_level": suspicion_level,
            "rate_info": info
        }
    
    def _calculate_suspicion_level(self, ip_address: str, endpoint: str, 
                                 user_agent: str) -> str:
        """Calculate suspicion level based on various factors"""
        
        suspicion_score = 0
        
        # Check user agent
        if not user_agent or user_agent in ["", "curl", "wget", "python-requests"]:
            suspicion_score += 2
        
        # Check for suspicious endpoints
        suspicious_endpoints = ["/admin", "/login", "/api/auth", "/.env", "/config"]
        if any(suspicious in endpoint for suspicious in suspicious_endpoints):
            suspicion_score += 1
        
        # Check request frequency from this IP
        if ip_address in self.rate_limiter.request_history:
            recent_requests = len(self.rate_limiter.request_history[ip_address])
            if recent_requests > 1000:  # Very high frequency
                suspicion_score += 3
            elif recent_requests > 100:
                suspicion_score += 1
        
        # Determine level
        if suspicion_score >= 4:
            return "high"
        elif suspicion_score >= 2:
            return "medium"
        else:
            return "low"
    
    def _track_violation(self, ip_address: str):
        """Track rate limit violations"""
        if ip_address not in self.suspicious_ips:
            self.suspicious_ips[ip_address] = {
                "violations": 0,
                "first_violation": time.time()
            }
        
        self.suspicious_ips[ip_address]["violations"] += 1
    
    def _should_block_ip(self, ip_address: str) -> bool:
        """Determine if IP should be blocked"""
        if ip_address not in self.suspicious_ips:
            return False
        
        violations = self.suspicious_ips[ip_address]["violations"]
        first_violation = self.suspicious_ips[ip_address]["first_violation"]
        
        # Block if more than 10 violations in the last hour
        if violations > 10 and (time.time() - first_violation) < 3600:
            return True
        
        return False

def rate_limiting_example():
    """Demonstrate rate limiting and DDoS protection"""
    
    # Initialize protection systems
    rate_limiter = RateLimiter()
    ddos_protection = DDoSProtection()
    
    # Create rate limits for different users
    rate_limiter.create_rate_limit("api_key_123", 10, 50)  # 10 req/sec, burst 50
    rate_limiter.create_rate_limit("premium_user", 100, 1000)  # Higher limits
    
    # Simulate API requests
    def simulate_api_request(identifier: str, ip_address: str):
        """Simulate an API request with rate limiting"""
        
        # Check DDoS protection
        ddos_result = ddos_protection.analyze_request_pattern(
            ip_address=ip_address,
            endpoint="/api/data",
            user_agent="Mozilla/5.0 (legitimate browser)"
        )
        
        if ddos_result["action"] == "block":
            return {"status": 403, "error": ddos_result["reason"]}
        
        # Check rate limiting
        allowed, rate_info = rate_limiter.is_allowed(identifier)
        
        if not allowed:
            return {
                "status": 429,
                "error": "Rate limit exceeded",
                "retry_after": rate_info["retry_after"]
            }
        
        return {
            "status": 200,
            "data": "API response data",
            "rate_limit_remaining": rate_info["remaining_tokens"]
        }
    
    # Test normal usage
    for i in range(5):
        result = simulate_api_request("api_key_123", "192.168.1.100")
        print(f"Request {i+1}: {result}")
        time.sleep(0.1)  # Small delay between requests
    
    # Test rate limit exceeded
    for i in range(60):  # Try to exceed rate limit
        result = simulate_api_request("api_key_123", "192.168.1.100")
        if result["status"] == 429:
            print(f"Rate limited after {i+1} rapid requests")
            break

if __name__ == "__main__":
    rate_limiting_example()

```

## Secure Session Management

Session management is critical for maintaining authenticated state between API requests while preventing session-related attacks.

### Session Security Principles

```kroki-plantuml
@startuml Session_Security_Model
!theme plain
skinparam backgroundColor white
skinparam defaultFontName "Arial"

participant Client
participant "API Gateway" as Gateway
participant "Session Store" as Session
participant "API Service" as API

Client -> Gateway: Login Request
Gateway -> Session: Create Session
Session -> Gateway: Session ID
Gateway -> Client: Session Token (HTTP-Only Cookie)

note over Client, Gateway: Subsequent API Requests

Client -> Gateway: API Request + Session Cookie
Gateway -> Session: Validate Session
Session -> Gateway: Session Data
Gateway -> API: Authorized Request
API -> Gateway: Response
Gateway -> Client: API Response

note over Gateway, Session: Session Security Features
note over Gateway: - CSRF Protection\n- Secure Cookies\n- Session Rotation\n- Timeout Management

@enduml

```

### Comprehensive Session Manager Implementation

```python
import hashlib
import secrets
import json
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
from dataclasses import dataclass, asdict
from threading import Lock
import logging

@dataclass
class SessionData:
    """Secure session data structure"""
    session_id: str
    user_id: str
    created_at: datetime
    last_accessed: datetime
    expires_at: datetime
    ip_address: str
    user_agent: str
    permissions: list
    is_active: bool = True
    csrf_token: str = ""
    login_count: int = 1

class SecureSessionManager:
    """Production-ready session management with security features"""
    
    def __init__(self, session_timeout_minutes: int = 30, 
                 max_sessions_per_user: int = 5):
        self.sessions: Dict[str, SessionData] = {}
        self.user_sessions: Dict[str, list] = {}  # user_id -> session_ids
        self.session_timeout = timedelta(minutes=session_timeout_minutes)
        self.max_sessions = max_sessions_per_user
        self.lock = Lock()
        self.logger = logging.getLogger(__name__)
        
        # Security tracking
        self.failed_logins: Dict[str, list] = {}
        self.suspicious_activity: Dict[str, dict] = {}
    
    def create_session(self, user_id: str, ip_address: str, 
                      user_agent: str, permissions: list) -> tuple[str, str]:
        """
        Create a new secure session
        Returns: (session_id, csrf_token)
        """
        with self.lock:
            # Check for too many sessions per user
            if user_id in self.user_sessions:
                if len(self.user_sessions[user_id]) >= self.max_sessions:
                    # Remove oldest session
                    oldest_session = self.user_sessions[user_id][0]
                    self._revoke_session_internal(oldest_session)
            
            # Generate cryptographically secure session ID
            session_id = secrets.token_urlsafe(32)
            csrf_token = secrets.token_urlsafe(24)
            
            current_time = datetime.now()
            
            # Create session data
            session_data = SessionData(
                session_id=session_id,
                user_id=user_id,
                created_at=current_time,
                last_accessed=current_time,
                expires_at=current_time + self.session_timeout,
                ip_address=ip_address,
                user_agent=user_agent,
                permissions=permissions,
                csrf_token=csrf_token
            )
            
            # Store session
            self.sessions[session_id] = session_data
            
            # Track user sessions
            if user_id not in self.user_sessions:
                self.user_sessions[user_id] = []
            self.user_sessions[user_id].append(session_id)
            
            self.logger.info(f"Session created for user {user_id} from {ip_address}")
            
            return session_id, csrf_token
    
    def validate_session(self, session_id: str, ip_address: str, 
                        user_agent: str, csrf_token: str = None) -> Optional[SessionData]:
        """
        Validate session with security checks
        """
        with self.lock:
            if session_id not in self.sessions:
                return None
            
            session = self.sessions[session_id]
            current_time = datetime.now()
            
            # Check if session is active
            if not session.is_active:
                return None
            
            # Check expiration
            if current_time > session.expires_at:
                self._revoke_session_internal(session_id)
                return None
            
            # Security checks
            security_result = self._perform_security_checks(
                session, ip_address, user_agent, csrf_token
            )
            
            if not security_result["valid"]:
                self.logger.warning(
                    f"Security check failed for session {session_id}: {security_result['reason']}"
                )
                if security_result["revoke"]:
                    self._revoke_session_internal(session_id)
                return None
            
            # Update session activity
            session.last_accessed = current_time
            session.expires_at = current_time + self.session_timeout
            
            return session
    
    def _perform_security_checks(self, session: SessionData, ip_address: str, 
                                user_agent: str, csrf_token: str) -> Dict[str, Any]:
        """Perform comprehensive security validation"""
        
        # IP address validation (detect session hijacking)
        if session.ip_address != ip_address:
            # Log potential session hijacking
            self.logger.warning(
                f"IP address mismatch for session {session.session_id}: "
                f"expected {session.ip_address}, got {ip_address}"
            )
            return {"valid": False, "revoke": True, "reason": "IP address mismatch"}
        
        # User agent validation (basic fingerprinting)
        if session.user_agent != user_agent:
            self.logger.warning(
                f"User agent mismatch for session {session.session_id}"
            )
            # Don't revoke for user agent changes, but log suspicious activity
            self._track_suspicious_activity(session.user_id, "user_agent_change")
        
        # CSRF token validation (for state-changing operations)
        if csrf_token and csrf_token != session.csrf_token:
            return {"valid": False, "revoke": False, "reason": "Invalid CSRF token"}
        
        # Check for session fixation attacks
        session_age = datetime.now() - session.created_at
        if session_age > timedelta(hours=24):  # Force re-authentication after 24 hours
            return {"valid": False, "revoke": True, "reason": "Session too old"}
        
        return {"valid": True, "revoke": False, "reason": "Valid"}
    
    def refresh_session(self, session_id: str) -> Optional[str]:
        """
        Refresh session with new ID (prevent session fixation)
        Returns new session ID if successful
        """
        with self.lock:
            if session_id not in self.sessions:
                return None
            
            old_session = self.sessions[session_id]
            
            # Generate new session ID
            new_session_id = secrets.token_urlsafe(32)
            new_csrf_token = secrets.token_urlsafe(24)
            
            # Create new session with same data
            new_session = SessionData(
                session_id=new_session_id,
                user_id=old_session.user_id,
                created_at=datetime.now(),  # Reset creation time
                last_accessed=datetime.now(),
                expires_at=datetime.now() + self.session_timeout,
                ip_address=old_session.ip_address,
                user_agent=old_session.user_agent,
                permissions=old_session.permissions,
                csrf_token=new_csrf_token,
                login_count=old_session.login_count + 1
            )
            
            # Replace old session
            self.sessions[new_session_id] = new_session
            del self.sessions[session_id]
            
            # Update user session tracking
            user_sessions = self.user_sessions[old_session.user_id]
            user_sessions.remove(session_id)
            user_sessions.append(new_session_id)
            
            self.logger.info(f"Session refreshed for user {old_session.user_id}")
            
            return new_session_id
    
    def revoke_session(self, session_id: str) -> bool:
        """Revoke a specific session"""
        with self.lock:
            return self._revoke_session_internal(session_id)
    
    def _revoke_session_internal(self, session_id: str) -> bool:
        """Internal session revocation (assumes lock is held)"""
        if session_id not in self.sessions:
            return False
        
        session = self.sessions[session_id]
        user_id = session.user_id
        
        # Remove from main storage
        del self.sessions[session_id]
        
        # Remove from user session tracking
        if user_id in self.user_sessions:
            if session_id in self.user_sessions[user_id]:
                self.user_sessions[user_id].remove(session_id)
            
            # Clean up empty user session list
            if not self.user_sessions[user_id]:
                del self.user_sessions[user_id]
        
        self.logger.info(f"Session {session_id} revoked for user {user_id}")
        return True
    
    def revoke_all_user_sessions(self, user_id: str) -> int:
        """Revoke all sessions for a specific user"""
        with self.lock:
            if user_id not in self.user_sessions:
                return 0
            
            session_ids = self.user_sessions[user_id].copy()
            revoked_count = 0
            
            for session_id in session_ids:
                if self._revoke_session_internal(session_id):
                    revoked_count += 1
            
            self.logger.info(f"Revoked {revoked_count} sessions for user {user_id}")
            return revoked_count
    
    def cleanup_expired_sessions(self) -> int:
        """Remove expired sessions (should be run periodically)"""
        with self.lock:
            current_time = datetime.now()
            expired_sessions = []
            
            for session_id, session in self.sessions.items():
                if current_time > session.expires_at:
                    expired_sessions.append(session_id)
            
            for session_id in expired_sessions:
                self._revoke_session_internal(session_id)
            
            if expired_sessions:
                self.logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
            
            return len(expired_sessions)
    
    def get_user_sessions(self, user_id: str) -> list:
        """Get all active sessions for a user"""
        with self.lock:
            if user_id not in self.user_sessions:
                return []
            
            active_sessions = []
            for session_id in self.user_sessions[user_id]:
                if session_id in self.sessions:
                    session = self.sessions[session_id]
                    active_sessions.append({
                        'session_id': session_id,
                        'created_at': session.created_at.isoformat(),
                        'last_accessed': session.last_accessed.isoformat(),
                        'ip_address': session.ip_address,
                        'user_agent': session.user_agent[:50] + '...' if len(session.user_agent) > 50 else session.user_agent
                    })
            
            return active_sessions
    
    def _track_suspicious_activity(self, user_id: str, activity_type: str):
        """Track suspicious activity for security monitoring"""
        if user_id not in self.suspicious_activity:
            self.suspicious_activity[user_id] = {}
        
        if activity_type not in self.suspicious_activity[user_id]:
            self.suspicious_activity[user_id][activity_type] = []
        
        self.suspicious_activity[user_id][activity_type].append(datetime.now())
        
        # Keep only recent activity (last 24 hours)
        cutoff = datetime.now() - timedelta(hours=24)
        self.suspicious_activity[user_id][activity_type] = [
            timestamp for timestamp in self.suspicious_activity[user_id][activity_type]
            if timestamp > cutoff
        ]

class SessionSecurityMiddleware:
    """Middleware for secure session handling in web applications"""
    
    def __init__(self, session_manager: SecureSessionManager):
        self.session_manager = session_manager
    
    def generate_secure_cookie_attributes(self, session_id: str, 
                                        is_https: bool = True) -> Dict[str, Any]:
        """Generate secure cookie attributes for session"""
        
        cookie_attributes = {
            'httponly': True,  # Prevent XSS access to cookies
            'secure': is_https,  # Only send over HTTPS
            'samesite': 'Strict',  # CSRF protection
            'max_age': 1800,  # 30 minutes
            'path': '/'  # Cookie available for entire domain
        }
        
        return cookie_attributes
    
    def validate_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate request with session security checks"""
        
        session_id = request_data.get('session_id', '')
        ip_address = request_data.get('ip_address', '')
        user_agent = request_data.get('user_agent', '')
        csrf_token = request_data.get('csrf_token', '')
        
        # Validate session
        session = self.session_manager.validate_session(
            session_id, ip_address, user_agent, csrf_token
        )
        
        if not session:
            return {
                'valid': False,
                'error': 'Invalid or expired session',
                'status_code': 401
            }
        
        return {
            'valid': True,
            'session': session,
            'user_id': session.user_id,
            'permissions': session.permissions
        }

def session_management_example():
    """Demonstrate secure session management"""
    
    # Initialize session manager
    session_manager = SecureSessionManager(
        session_timeout_minutes=30,
        max_sessions_per_user=3
    )
    
    # Create session for user login
    session_id, csrf_token = session_manager.create_session(
        user_id="user123",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        permissions=["read", "write"]
    )
    
    print(f"Session created: {session_id[:16]}...")
    print(f"CSRF token: {csrf_token[:16]}...")
    
    # Validate session
    session = session_manager.validate_session(
        session_id=session_id,
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        csrf_token=csrf_token
    )
    
    if session:
        print(f"Session valid for user: {session.user_id}")
        print(f"Permissions: {session.permissions}")
    
    # Demonstrate session refresh (prevent fixation)
    new_session_id = session_manager.refresh_session(session_id)
    print(f"Session refreshed: {new_session_id[:16]}...")
    
    # Show user's active sessions
    active_sessions = session_manager.get_user_sessions("user123")
    print(f"Active sessions for user: {len(active_sessions)}")
    
    # Clean up
    session_manager.revoke_all_user_sessions("user123")
    print("All user sessions revoked")

if __name__ == "__main__":
    session_management_example()

```

## CORS and Cross-Origin Security

Cross-Origin Resource Sharing (CORS) is a critical security mechanism that controls how web applications can access resources from different domains.

### Understanding CORS Security Model

```kroki-plantuml
@startuml CORS_Security_Flow
!theme plain
skinparam backgroundColor white
skinparam defaultFontName "Arial"

participant "Web Browser" as Browser
participant "Client App\n(example.com)" as Client
participant "API Server\n(api.service.com)" as API

Browser -> Client: Load application
Client -> Browser: Make API request to\ndifferent origin

note over Browser: Same-Origin Policy Check
Browser -> Browser: Origin: example.com\nTarget: api.service.com\n(Different origins!)

Browser -> API: Preflight REQUEST\nOPTIONS /api/data\nOrigin: example.com

API -> API: Check CORS policy\nfor example.com

alt CORS Allowed
    API -> Browser: 200 OK\nAccess-Control-Allow-Origin: example.com\nAccess-Control-Allow-Methods: GET, POST
    Browser -> API: Actual REQUEST\nGET /api/data
    API -> Browser: 200 OK + Data
    Browser -> Client: Success response
else CORS Denied
    API -> Browser: 403 Forbidden\n(No CORS headers)
    Browser -> Browser: Block response
    Browser -> Client: CORS Error
end

@enduml

```

### Comprehensive CORS Implementation

```python
from typing import Dict, List, Optional, Union
import re
from urllib.parse import urlparse
from dataclasses import dataclass

@dataclass
class CORSPolicy:
    """CORS policy configuration"""
    allowed_origins: List[str]
    allowed_methods: List[str]
    allowed_headers: List[str]
    exposed_headers: List[str]
    allow_credentials: bool
    max_age: int  # Preflight cache duration in seconds

class CORSManager:
    """Production-ready CORS management with security features"""
    
    def __init__(self):
        self.policies: Dict[str, CORSPolicy] = {}
        self.default_policy: Optional[CORSPolicy] = None
        
        # Security patterns
        self.dangerous_origins = [
            r'.*\.evil\.com$',
            r'.*malicious.*',
            r'file://',  # Block file:// origins
            r'data:',    # Block data: origins
        ]
    
    def add_policy(self, policy_name: str, policy: CORSPolicy):
        """Add a named CORS policy"""
        self.policies[policy_name] = policy
    
    def set_default_policy(self, policy: CORSPolicy):
        """Set default CORS policy"""
        self.default_policy = policy
    
    def create_secure_policy(self, allowed_origins: List[str], 
                           allow_credentials: bool = False) -> CORSPolicy:
        """Create a secure CORS policy with safe defaults"""
        
        # Validate origins for security
        validated_origins = []
        for origin in allowed_origins:
            if self._is_safe_origin(origin):
                validated_origins.append(origin)
            else:
                print(f"Warning: Potentially unsafe origin blocked: {origin}")
        
        return CORSPolicy(
            allowed_origins=validated_origins,
            allowed_methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowed_headers=[
                'Content-Type',
                'Authorization', 
                'X-Requested-With',
                'X-CSRF-Token'
            ],
            exposed_headers=['X-Total-Count', 'X-Page-Count'],
            allow_credentials=allow_credentials,
            max_age=86400  # 24 hours
        )
    
    def _is_safe_origin(self, origin: str) -> bool:
        """Validate origin against security patterns"""
        
        # Check against dangerous patterns
        for pattern in self.dangerous_origins:
            if re.match(pattern, origin, re.IGNORECASE):
                return False
        
        # Validate URL format
        try:
            parsed = urlparse(origin)
            if not parsed.scheme or not parsed.netloc:
                return False
            
            # Only allow HTTP/HTTPS
            if parsed.scheme not in ['http', 'https']:
                return False
            
        except Exception:
            return False
        
        return True
    
    def handle_preflight_request(self, origin: str, method: str, 
                                headers: List[str], policy_name: str = None) -> Dict[str, str]:
        """Handle CORS preflight request"""
        
        # Get applicable policy
        policy = self._get_policy(policy_name)
        if not policy:
            return self._create_cors_denial()
        
        # Validate origin
        if not self._is_origin_allowed(origin, policy):
            return self._create_cors_denial()
        
        # Validate method
        if method.upper() not in policy.allowed_methods:
            return self._create_cors_denial()
        
        # Validate headers
        for header in headers:
            if not self._is_header_allowed(header, policy):
                return self._create_cors_denial()
        
        # Create successful preflight response
        response_headers = {
            'Access-Control-Allow-Origin': self._get_origin_response(origin, policy),
            'Access-Control-Allow-Methods': ', '.join(policy.allowed_methods),
            'Access-Control-Allow-Headers': ', '.join(policy.allowed_headers),
            'Access-Control-Max-Age': str(policy.max_age),
            'Vary': 'Origin'  # Important for caching
        }
        
        if policy.allow_credentials:
            response_headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response_headers
    
    def handle_actual_request(self, origin: str, policy_name: str = None) -> Dict[str, str]:
        """Handle actual CORS request"""
        
        # Get applicable policy
        policy = self._get_policy(policy_name)
        if not policy:
            return self._create_cors_denial()
        
        # Validate origin
        if not self._is_origin_allowed(origin, policy):
            return self._create_cors_denial()
        
        # Create response headers
        response_headers = {
            'Access-Control-Allow-Origin': self._get_origin_response(origin, policy),
            'Vary': 'Origin'
        }
        
        if policy.exposed_headers:
            response_headers['Access-Control-Expose-Headers'] = ', '.join(policy.exposed_headers)
        
        if policy.allow_credentials:
            response_headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response_headers
    
    def _get_policy(self, policy_name: str = None) -> Optional[CORSPolicy]:
        """Get policy by name or default"""
        if policy_name and policy_name in self.policies:
            return self.policies[policy_name]
        return self.default_policy
    
    def _is_origin_allowed(self, origin: str, policy: CORSPolicy) -> bool:
        """Check if origin is allowed by policy"""
        
        if not origin:
            return False
        
        # Check exact matches and wildcards
        for allowed_origin in policy.allowed_origins:
            if allowed_origin == '*':
                # Wildcard only allowed if credentials are disabled
                return not policy.allow_credentials
            elif allowed_origin == origin:
                return True
            elif self._match_origin_pattern(origin, allowed_origin):
                return True
        
        return False
    
    def _match_origin_pattern(self, origin: str, pattern: str) -> bool:
        """Match origin against pattern (supports simple wildcards)"""
        
        # Convert simple wildcard pattern to regex
        if '*' in pattern:
            regex_pattern = pattern.replace('*', r'[^.]*')
            regex_pattern = regex_pattern.replace('.', r'\.')
            return bool(re.match(f'^{regex_pattern}$', origin))
        
        return origin == pattern
    
    def _is_header_allowed(self, header: str, policy: CORSPolicy) -> bool:
        """Check if header is allowed"""
        
        # Case-insensitive header comparison
        header_lower = header.lower()
        allowed_headers_lower = [h.lower() for h in policy.allowed_headers]
        
        return header_lower in allowed_headers_lower
    
    def _get_origin_response(self, origin: str, policy: CORSPolicy) -> str:
        """Get appropriate origin response value"""
        
        # If credentials are allowed, must echo exact origin (not wildcard)
        if policy.allow_credentials:
            return origin
        
        # Check if wildcard is in allowed origins
        if '*' in policy.allowed_origins:
            return '*'
        
        return origin
    
    def _create_cors_denial(self) -> Dict[str, str]:
        """Create CORS denial response (empty headers)"""
        return {}

class CORSSecurityMiddleware:
    """CORS security middleware for web applications"""
    
    def __init__(self, cors_manager: CORSManager):
        self.cors_manager = cors_manager
    
    def process_request(self, request_data: Dict[str, str], 
                       policy_name: str = None) -> Dict[str, Union[str, int, Dict]]:
        """Process request with CORS handling"""
        
        origin = request_data.get('origin', '')
        method = request_data.get('method', 'GET')
        
        # Handle preflight requests
        if method.upper() == 'OPTIONS':
            requested_method = request_data.get('access_control_request_method', '')
            requested_headers = request_data.get('access_control_request_headers', '').split(',')
            requested_headers = [h.strip() for h in requested_headers if h.strip()]
            
            cors_headers = self.cors_manager.handle_preflight_request(
                origin=origin,
                method=requested_method,
                headers=requested_headers,
                policy_name=policy_name
            )
            
            if not cors_headers:
                return {
                    'status_code': 403,
                    'error': 'CORS policy violation',
                    'headers': {}
                }
            
            return {
                'status_code': 200,
                'headers': cors_headers
            }
        
        # Handle actual requests
        cors_headers = self.cors_manager.handle_actual_request(
            origin=origin,
            policy_name=policy_name
        )
        
        if not cors_headers:
            return {
                'status_code': 403,
                'error': 'CORS policy violation',
                'headers': {}
            }
        
        return {
            'status_code': 200,
            'headers': cors_headers
        }

def cors_security_example():
    """Demonstrate CORS security implementation"""
    
    # Initialize CORS manager
    cors_manager = CORSManager()
    
    # Create secure policies for different environments
    
    # Development policy (more permissive)
    dev_policy = cors_manager.create_secure_policy(
        allowed_origins=[
            'http://localhost:3000',
            'http://localhost:8080',
            'http://127.0.0.1:3000'
        ],
        allow_credentials=True
    )
    
    # Production policy (restrictive)
    prod_policy = cors_manager.create_secure_policy(
        allowed_origins=[
            'https://myapp.com',
            'https://www.myapp.com',
            'https://admin.myapp.com'
        ],
        allow_credentials=True
    )
    
    # Public API policy (no credentials)
    public_policy = CORSPolicy(
        allowed_origins=['*'],
        allowed_methods=['GET', 'OPTIONS'],
        allowed_headers=['Content-Type'],
        exposed_headers=['X-Rate-Limit-Remaining'],
        allow_credentials=False,
        max_age=3600
    )
    
    # Register policies
    cors_manager.add_policy('development', dev_policy)
    cors_manager.add_policy('production', prod_policy)
    cors_manager.add_policy('public', public_policy)
    cors_manager.set_default_policy(prod_policy)
    
    # Create middleware
    cors_middleware = CORSSecurityMiddleware(cors_manager)
    
    # Simulate preflight request
    preflight_request = {
        'origin': 'https://myapp.com',
        'method': 'OPTIONS',
        'access_control_request_method': 'POST',
        'access_control_request_headers': 'Content-Type, Authorization'
    }
    
    result = cors_middleware.process_request(preflight_request, 'production')
    print(f"Preflight result: {result}")
    
    # Simulate actual request
    actual_request = {
        'origin': 'https://myapp.com',
        'method': 'POST'
    }
    
    result = cors_middleware.process_request(actual_request, 'production')
    print(f"Actual request result: {result}")
    
    # Test blocked origin
    blocked_request = {
        'origin': 'https://malicious-site.com',
        'method': 'GET'
    }
    
    result = cors_middleware.process_request(blocked_request, 'production')
    print(f"Blocked request result: {result}")

if __name__ == "__main__":
    cors_security_example()

```

## API Security Testing

Security testing is essential for identifying vulnerabilities in API implementations before they can be exploited by attackers.

### Security Testing Methodology

```kroki-plantuml
@startuml API_Security_Testing_Process
!theme plain
skinparam backgroundColor white
skinparam defaultFontName "Arial"

start
:Threat Modeling;
note right: Identify attack vectors\nand security requirements

:Static Analysis;
note right: Code review\nVulnerability scanning

:Dynamic Testing;
split
  :Authentication Testing;
  note right: Token validation\nSession management
split again
  :Authorization Testing;
  note right: Access controls\nPrivilege escalation
split again
  :Input Validation Testing;
  note right: Injection attacks\nData validation
split again
  :Rate Limiting Testing;
  note right: DoS protection\nResource exhaustion
end split

:Penetration Testing;
note right: Manual exploitation\nReal-world scenarios

:Security Regression Testing;
note right: Automated security\ntest suite

stop

@enduml

```

### Automated Security Testing Framework

```python
import requests
import json
import time
import random
import string
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
from urllib.parse import urljoin, urlparse

@dataclass
class SecurityTestResult:
    """Result of a security test"""
    test_name: str
    endpoint: str
    method: str
    passed: bool
    severity: str  # 'low', 'medium', 'high', 'critical'
    description: str
    details: Dict[str, Any]
    remediation: str

@dataclass
class APIEndpoint:
    """API endpoint configuration for testing"""
    path: str
    method: str
    auth_required: bool
    parameters: Dict[str, str]
    expected_status: int

class APISecurityTester:
    """Comprehensive API security testing framework"""
    
    def __init__(self, base_url: str, timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.session = requests.Session()
        self.results: List[SecurityTestResult] = []
        self.logger = logging.getLogger(__name__)
        
        # Common payloads for injection testing
        self.sql_injection_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users;--",
            "1' UNION SELECT NULL,username,password FROM users--",
            "admin'--",
            "' OR 1=1#"
        ]
        
        self.xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "';alert('XSS');//",
            "<svg onload=alert('XSS')>"
        ]
        
        self.path_traversal_payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
            "....//....//....//etc/passwd",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"
        ]
    
    def authenticate(self, username: str, password: str, auth_endpoint: str = "/auth/login") -> bool:
        """Authenticate with the API and store session"""
        try:
            auth_data = {"username": username, "password": password}
            response = self.session.post(
                urljoin(self.base_url, auth_endpoint),
                json=auth_data,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                # Store authentication token if provided
                auth_data = response.json()
                if 'token' in auth_data:
                    self.session.headers.update({
                        'Authorization': f"Bearer {auth_data['token']}"
                    })
                return True
                
        except Exception as e:
            self.logger.error(f"Authentication failed: {e}")
        
        return False
    
    def test_authentication_vulnerabilities(self, endpoints: List[APIEndpoint]) -> List[SecurityTestResult]:
        """Test for authentication vulnerabilities"""
        results = []
        
        for endpoint in endpoints:
            if not endpoint.auth_required:
                continue
            
            # Test 1: Access without authentication
            results.append(self._test_unauthenticated_access(endpoint))
            
            # Test 2: Invalid token handling
            results.append(self._test_invalid_token(endpoint))
            
            # Test 3: Expired token handling
            results.append(self._test_token_manipulation(endpoint))
        
        return results
    
    def _test_unauthenticated_access(self, endpoint: APIEndpoint) -> SecurityTestResult:
        """Test access to authenticated endpoint without credentials"""
        
        # Remove authentication headers temporarily
        original_headers = self.session.headers.copy()
        if 'Authorization' in self.session.headers:
            del self.session.headers['Authorization']
        
        try:
            response = self.session.request(
                method=endpoint.method,
                url=urljoin(self.base_url, endpoint.path),
                params=endpoint.parameters if endpoint.method == 'GET' else None,
                json=endpoint.parameters if endpoint.method in ['POST', 'PUT'] else None,
                timeout=self.timeout
            )
            
            # Restore headers
            self.session.headers = original_headers
            
            # Should return 401 Unauthorized
            if response.status_code == 401:
                return SecurityTestResult(
                    test_name="Unauthenticated Access",
                    endpoint=endpoint.path,
                    method=endpoint.method,
                    passed=True,
                    severity="medium",
                    description="Endpoint properly requires authentication",
                    details={"status_code": response.status_code},
                    remediation="Continue current authentication enforcement"
                )
            else:
                return SecurityTestResult(
                    test_name="Unauthenticated Access",
                    endpoint=endpoint.path,
                    method=endpoint.method,
                    passed=False,
                    severity="high",
                    description="Endpoint accessible without authentication",
                    details={
                        "status_code": response.status_code,
                        "response_size": len(response.content)
                    },
                    remediation="Implement proper authentication checks"
                )
        
        except Exception as e:
            return SecurityTestResult(
                test_name="Unauthenticated Access",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=False,
                severity="medium",
                description="Error testing unauthenticated access",
                details={"error": str(e)},
                remediation="Review endpoint implementation"
            )
    
    def _test_invalid_token(self, endpoint: APIEndpoint) -> SecurityTestResult:
        """Test handling of invalid authentication tokens"""
        
        # Store original authorization
        original_auth = self.session.headers.get('Authorization', '')
        
        # Test with invalid token
        self.session.headers['Authorization'] = 'Bearer invalid_token_12345'
        
        try:
            response = self.session.request(
                method=endpoint.method,
                url=urljoin(self.base_url, endpoint.path),
                params=endpoint.parameters if endpoint.method == 'GET' else None,
                json=endpoint.parameters if endpoint.method in ['POST', 'PUT'] else None,
                timeout=self.timeout
            )
            
            # Restore original authorization
            if original_auth:
                self.session.headers['Authorization'] = original_auth
            else:
                del self.session.headers['Authorization']
            
            # Should return 401 Unauthorized
            if response.status_code == 401:
                return SecurityTestResult(
                    test_name="Invalid Token Handling",
                    endpoint=endpoint.path,
                    method=endpoint.method,
                    passed=True,
                    severity="medium",
                    description="Invalid tokens properly rejected",
                    details={"status_code": response.status_code},
                    remediation="Continue current token validation"
                )
            else:
                return SecurityTestResult(
                    test_name="Invalid Token Handling",
                    endpoint=endpoint.path,
                    method=endpoint.method,
                    passed=False,
                    severity="high",
                    description="Invalid token accepted or poor error handling",
                    details={"status_code": response.status_code},
                    remediation="Implement proper token validation and error handling"
                )
        
        except Exception as e:
            return SecurityTestResult(
                test_name="Invalid Token Handling",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=False,
                severity="medium",
                description="Error testing invalid token",
                details={"error": str(e)},
                remediation="Review token validation implementation"
            )
    
    def _test_token_manipulation(self, endpoint: APIEndpoint) -> SecurityTestResult:
        """Test for token manipulation vulnerabilities"""
        
        original_auth = self.session.headers.get('Authorization', '')
        
        # Test various token manipulations
        manipulated_tokens = [
            'Bearer ',  # Empty token
            'Bearer null',  # Null token
            'Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiJhZG1pbiJ9.',  # None algorithm JWT
            'Basic YWRtaW46YWRtaW4=',  # Different auth scheme
        ]
        
        vulnerabilities_found = []
        
        for token in manipulated_tokens:
            self.session.headers['Authorization'] = token
            
            try:
                response = self.session.request(
                    method=endpoint.method,
                    url=urljoin(self.base_url, endpoint.path),
                    timeout=self.timeout
                )
                
                if response.status_code != 401:
                    vulnerabilities_found.append({
                        'token': token,
                        'status': response.status_code
                    })
            
            except Exception:
                pass
        
        # Restore original authorization
        if original_auth:
            self.session.headers['Authorization'] = original_auth
        
        if not vulnerabilities_found:
            return SecurityTestResult(
                test_name="Token Manipulation",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=True,
                severity="medium",
                description="Token manipulation attempts properly blocked",
                details={"manipulations_tested": len(manipulated_tokens)},
                remediation="Continue current token validation"
            )
        else:
            return SecurityTestResult(
                test_name="Token Manipulation",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=False,
                severity="high",
                description="Vulnerable to token manipulation",
                details={"vulnerabilities": vulnerabilities_found},
                remediation="Implement stronger token validation and proper error handling"
            )
    
    def test_injection_vulnerabilities(self, endpoints: List[APIEndpoint]) -> List[SecurityTestResult]:
        """Test for injection vulnerabilities"""
        results = []
        
        for endpoint in endpoints:
            # Test SQL injection
            results.append(self._test_sql_injection(endpoint))
            
            # Test XSS
            results.append(self._test_xss_injection(endpoint))
            
            # Test path traversal
            results.append(self._test_path_traversal(endpoint))
        
        return results
    
    def _test_sql_injection(self, endpoint: APIEndpoint) -> SecurityTestResult:
        """Test for SQL injection vulnerabilities"""
        
        vulnerabilities_found = []
        
        for payload in self.sql_injection_payloads:
            # Test in different parameter positions
            for param_name in endpoint.parameters.keys():
                test_params = endpoint.parameters.copy()
                test_params[param_name] = payload
                
                try:
                    response = self.session.request(
                        method=endpoint.method,
                        url=urljoin(self.base_url, endpoint.path),
                        params=test_params if endpoint.method == 'GET' else None,
                        json=test_params if endpoint.method in ['POST', 'PUT'] else None,
                        timeout=self.timeout
                    )
                    
                    # Look for SQL error indicators
                    response_text = response.text.lower()
                    sql_errors = [
                        'sql syntax', 'mysql_fetch', 'ora-', 'postgresql',
                        'sqlite_', 'database error', 'sql statement',
                        'syntax error', 'table does not exist'
                    ]
                    
                    if any(error in response_text for error in sql_errors):
                        vulnerabilities_found.append({
                            'parameter': param_name,
                            'payload': payload,
                            'status_code': response.status_code,
                            'error_indicators': [err for err in sql_errors if err in response_text]
                        })
                    
                    # Also check for unusual response times (blind SQL injection)
                    if response.elapsed.total_seconds() > 5:
                        vulnerabilities_found.append({
                            'parameter': param_name,
                            'payload': payload,
                            'type': 'time_based_blind',
                            'response_time': response.elapsed.total_seconds()
                        })
                
                except Exception as e:
                    # Connection errors might indicate successful injection
                    if 'timeout' in str(e).lower():
                        vulnerabilities_found.append({
                            'parameter': param_name,
                            'payload': payload,
                            'type': 'timeout',
                            'error': str(e)
                        })
        
        if not vulnerabilities_found:
            return SecurityTestResult(
                test_name="SQL Injection",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=True,
                severity="critical",
                description="No SQL injection vulnerabilities detected",
                details={"payloads_tested": len(self.sql_injection_payloads)},
                remediation="Continue using parameterized queries"
            )
        else:
            return SecurityTestResult(
                test_name="SQL Injection",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=False,
                severity="critical",
                description="SQL injection vulnerability detected",
                details={"vulnerabilities": vulnerabilities_found},
                remediation="Use parameterized queries and input validation"
            )
    
    def _test_xss_injection(self, endpoint: APIEndpoint) -> SecurityTestResult:
        """Test for XSS vulnerabilities"""
        
        vulnerabilities_found = []
        
        for payload in self.xss_payloads:
            for param_name in endpoint.parameters.keys():
                test_params = endpoint.parameters.copy()
                test_params[param_name] = payload
                
                try:
                    response = self.session.request(
                        method=endpoint.method,
                        url=urljoin(self.base_url, endpoint.path),
                        params=test_params if endpoint.method == 'GET' else None,
                        json=test_params if endpoint.method in ['POST', 'PUT'] else None,
                        timeout=self.timeout
                    )
                    
                    # Check if payload is reflected in response
                    if payload in response.text:
                        vulnerabilities_found.append({
                            'parameter': param_name,
                            'payload': payload,
                            'type': 'reflected_xss'
                        })
                
                except Exception:
                    pass
        
        if not vulnerabilities_found:
            return SecurityTestResult(
                test_name="Cross-Site Scripting (XSS)",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=True,
                severity="high",
                description="No XSS vulnerabilities detected",
                details={"payloads_tested": len(self.xss_payloads)},
                remediation="Continue proper output encoding"
            )
        else:
            return SecurityTestResult(
                test_name="Cross-Site Scripting (XSS)",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=False,
                severity="high",
                description="XSS vulnerability detected",
                details={"vulnerabilities": vulnerabilities_found},
                remediation="Implement proper input validation and output encoding"
            )
    
    def _test_path_traversal(self, endpoint: APIEndpoint) -> SecurityTestResult:
        """Test for path traversal vulnerabilities"""
        
        vulnerabilities_found = []
        
        for payload in self.path_traversal_payloads:
            for param_name in endpoint.parameters.keys():
                test_params = endpoint.parameters.copy()
                test_params[param_name] = payload
                
                try:
                    response = self.session.request(
                        method=endpoint.method,
                        url=urljoin(self.base_url, endpoint.path),
                        params=test_params if endpoint.method == 'GET' else None,
                        json=test_params if endpoint.method in ['POST', 'PUT'] else None,
                        timeout=self.timeout
                    )
                    
                    # Look for system file indicators
                    response_text = response.text.lower()
                    system_indicators = [
                        'root:', 'bin/bash', 'windows\\system32',
                        '/etc/passwd', 'localhost', '127.0.0.1'
                    ]
                    
                    if any(indicator in response_text for indicator in system_indicators):
                        vulnerabilities_found.append({
                            'parameter': param_name,
                            'payload': payload,
                            'indicators': [ind for ind in system_indicators if ind in response_text]
                        })
                
                except Exception:
                    pass
        
        if not vulnerabilities_found:
            return SecurityTestResult(
                test_name="Path Traversal",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=True,
                severity="high",
                description="No path traversal vulnerabilities detected",
                details={"payloads_tested": len(self.path_traversal_payloads)},
                remediation="Continue proper file path validation"
            )
        else:
            return SecurityTestResult(
                test_name="Path Traversal",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=False,
                severity="high",
                description="Path traversal vulnerability detected",
                details={"vulnerabilities": vulnerabilities_found},
                remediation="Implement proper file path validation and sandboxing"
            )
    
    def test_rate_limiting(self, endpoint: APIEndpoint, 
                          requests_count: int = 100, 
                          time_window: int = 60) -> SecurityTestResult:
        """Test rate limiting implementation"""
        
        start_time = time.time()
        status_codes = []
        response_times = []
        
        # Send rapid requests
        for i in range(requests_count):
            try:
                request_start = time.time()
                response = self.session.request(
                    method=endpoint.method,
                    url=urljoin(self.base_url, endpoint.path),
                    params=endpoint.parameters if endpoint.method == 'GET' else None,
                    json=endpoint.parameters if endpoint.method in ['POST', 'PUT'] else None,
                    timeout=self.timeout
                )
                request_time = time.time() - request_start
                
                status_codes.append(response.status_code)
                response_times.append(request_time)
                
                # Short delay to avoid overwhelming the server
                time.sleep(0.1)
                
            except Exception as e:
                status_codes.append(0)  # Connection error
                response_times.append(self.timeout)
        
        total_time = time.time() - start_time
        
        # Analyze results
        rate_limited_responses = sum(1 for code in status_codes if code == 429)
        successful_responses = sum(1 for code in status_codes if 200 <= code < 300)
        
        if rate_limited_responses > 0:
            return SecurityTestResult(
                test_name="Rate Limiting",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=True,
                severity="medium",
                description="Rate limiting is implemented",
                details={
                    "total_requests": requests_count,
                    "rate_limited": rate_limited_responses,
                    "successful": successful_responses,
                    "total_time": total_time,
                    "avg_response_time": sum(response_times) / len(response_times)
                },
                remediation="Continue current rate limiting implementation"
            )
        else:
            return SecurityTestResult(
                test_name="Rate Limiting",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=False,
                severity="medium",
                description="No rate limiting detected",
                details={
                    "total_requests": requests_count,
                    "successful": successful_responses,
                    "total_time": total_time
                },
                remediation="Implement rate limiting to prevent abuse"
            )
    
    def test_cors_configuration(self, endpoint: APIEndpoint) -> SecurityTestResult:
        """Test CORS configuration security"""
        
        cors_issues = []
        
        # Test with malicious origin
        headers = {'Origin': 'https://evil.com'}
        
        try:
            response = self.session.request(
                method=endpoint.method,
                url=urljoin(self.base_url, endpoint.path),
                headers=headers,
                timeout=self.timeout
            )
            
            cors_origin = response.headers.get('Access-Control-Allow-Origin', '')
            cors_credentials = response.headers.get('Access-Control-Allow-Credentials', '')
            
            # Check for overly permissive CORS
            if cors_origin == '*' and cors_credentials.lower() == 'true':
                cors_issues.append({
                    'issue': 'Wildcard origin with credentials',
                    'severity': 'high'
                })
            
            if cors_origin == 'https://evil.com':
                cors_issues.append({
                    'issue': 'Malicious origin accepted',
                    'severity': 'high'
                })
            
            # Test preflight request
            preflight_response = self.session.options(
                url=urljoin(self.base_url, endpoint.path),
                headers={
                    'Origin': 'https://evil.com',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                },
                timeout=self.timeout
            )
            
            if preflight_response.status_code == 200:
                allowed_methods = preflight_response.headers.get('Access-Control-Allow-Methods', '')
                if 'DELETE' in allowed_methods or 'PUT' in allowed_methods:
                    cors_issues.append({
                        'issue': 'Dangerous methods allowed in CORS',
                        'methods': allowed_methods,
                        'severity': 'medium'
                    })
        
        except Exception as e:
            cors_issues.append({
                'issue': 'Error testing CORS',
                'error': str(e),
                'severity': 'low'
            })
        
        if not cors_issues:
            return SecurityTestResult(
                test_name="CORS Configuration",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=True,
                severity="medium",
                description="CORS configuration appears secure",
                details={"cors_headers": dict(response.headers)},
                remediation="Continue current CORS policy"
            )
        else:
            return SecurityTestResult(
                test_name="CORS Configuration",
                endpoint=endpoint.path,
                method=endpoint.method,
                passed=False,
                severity="medium",
                description="CORS configuration issues detected",
                details={"issues": cors_issues},
                remediation="Review and tighten CORS policy"
            )
    
    def generate_security_report(self) -> Dict[str, Any]:
        """Generate comprehensive security test report"""
        
        if not self.results:
            return {"error": "No test results available"}
        
        # Categorize results
        passed_tests = [r for r in self.results if r.passed]
        failed_tests = [r for r in self.results if not r.passed]
        
        # Count by severity
        severity_counts = {
            'critical': len([r for r in failed_tests if r.severity == 'critical']),
            'high': len([r for r in failed_tests if r.severity == 'high']),
            'medium': len([r for r in failed_tests if r.severity == 'medium']),
            'low': len([r for r in failed_tests if r.severity == 'low'])
        }
        
        # Calculate security score
        total_tests = len(self.results)
        security_score = (len(passed_tests) / total_tests) * 100 if total_tests > 0 else 0
        
        return {
            'summary': {
                'total_tests': total_tests,
                'passed': len(passed_tests),
                'failed': len(failed_tests),
                'security_score': round(security_score, 2)
            },
            'severity_breakdown': severity_counts,
            'failed_tests': [
                {
                    'test': test.test_name,
                    'endpoint': test.endpoint,
                    'severity': test.severity,
                    'description': test.description,
                    'remediation': test.remediation
                }
                for test in failed_tests
            ],
            'recommendations': self._generate_recommendations(failed_tests)
        }
    
    def _generate_recommendations(self, failed_tests: List[SecurityTestResult]) -> List[str]:
        """Generate security recommendations based on test results"""
        
        recommendations = []
        
        # Check for critical issues
        critical_tests = [t for t in failed_tests if t.severity == 'critical']
        if critical_tests:
            recommendations.append(
                "CRITICAL: Address SQL injection vulnerabilities immediately using parameterized queries"
            )
        
        # Check for authentication issues
        auth_tests = [t for t in failed_tests if 'authentication' in t.test_name.lower()]
        if auth_tests:
            recommendations.append(
                "Strengthen authentication mechanisms and token validation"
            )
        
        # Check for injection issues
        injection_tests = [t for t in failed_tests if any(
            word in t.test_name.lower() for word in ['injection', 'xss', 'traversal']
        )]
        if injection_tests:
            recommendations.append(
                "Implement comprehensive input validation and output encoding"
            )
        
        # Check for CORS issues
        cors_tests = [t for t in failed_tests if 'cors' in t.test_name.lower()]
        if cors_tests:
            recommendations.append(
                "Review and tighten CORS policies to prevent cross-origin attacks"
            )
        
        return recommendations

def security_testing_example():
    """Demonstrate API security testing"""
    
    # Initialize security tester
    tester = APISecurityTester("https://api.example.com")
    
    # Define test endpoints
    test_endpoints = [
        APIEndpoint(
            path="/api/users",
            method="GET",
            auth_required=True,
            parameters={"page": "1", "limit": "10"},
            expected_status=200
        ),
        APIEndpoint(
            path="/api/users",
            method="POST",
            auth_required=True,
            parameters={"username": "test", "email": "test@example.com"},
            expected_status=201
        ),
        APIEndpoint(
            path="/api/files",
            method="GET",
            auth_required=True,
            parameters={"filename": "document.pdf"},
            expected_status=200
        )
    ]
    
    # Authenticate (if needed)
    if tester.authenticate("testuser", "testpass"):
        print("Authentication successful")
    
    # Run security tests
    print("Running authentication tests...")
    auth_results = tester.test_authentication_vulnerabilities(test_endpoints)
    tester.results.extend(auth_results)
    
    print("Running injection tests...")
    injection_results = tester.test_injection_vulnerabilities(test_endpoints)
    tester.results.extend(injection_results)
    
    print("Running rate limiting tests...")
    for endpoint in test_endpoints:
        rate_result = tester.test_rate_limiting(endpoint)
        tester.results.append(rate_result)
    
    print("Running CORS tests...")
    for endpoint in test_endpoints:
        cors_result = tester.test_cors_configuration(endpoint)
        tester.results.append(cors_result)
    
    # Generate report
    report = tester.generate_security_report()
    print(f"\nSecurity Test Report:")
    print(f"Security Score: {report['summary']['security_score']}%")
    print(f"Tests Passed: {report['summary']['passed']}/{report['summary']['total_tests']}")
    
    if report['failed_tests']:
        print("\nFailed Tests:")
        for test in report['failed_tests']:
            print(f"- {test['test']} ({test['severity']}): {test['description']}")
    
    if report['recommendations']:
        print("\nRecommendations:")
        for rec in report['recommendations']:
            print(f"- {rec}")

if __name__ == "__main__":
    security_testing_example()

```

## Building a Complete Secure REST API

Now we'll integrate all the security concepts covered into a complete, production-ready REST API with comprehensive security features.

### Secure API Architecture

```kroki-plantuml
@startuml Secure_API_Architecture
!theme plain
skinparam backgroundColor white
skinparam defaultFontName "Arial"

package "Client Layer" {
  [Web App]
  [Mobile App]
  [Third-party App]
}

package "Security Layer" {
  [Rate Limiter] as RL
  [CORS Handler] as CORS
  [Authentication] as Auth
  [Input Validator] as Validator
}

package "API Layer" {
  [User Controller]
  [Post Controller]
  [File Controller]
}

package "Data Layer" {
  [Session Store]
  [User Database]
  [Content Database]
}

[Web App] --> RL
[Mobile App] --> RL
[Third-party App] --> RL

RL --> CORS
CORS --> Auth
Auth --> Validator
Validator --> [User Controller]
Validator --> [Post Controller]
Validator --> [File Controller]

[User Controller] --> [Session Store]
[User Controller] --> [User Database]
[Post Controller] --> [Content Database]
[File Controller] --> [Content Database]

@enduml

```

### Complete Secure API Implementation

```python
from flask import Flask, request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import sqlite3
import secrets
import time
import json
import re
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List

# Import our security components
# (In a real application, these would be in separate modules)

class SecureTaskAPI:
    """Complete secure REST API for task management"""
    
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config['SECRET_KEY'] = secrets.token_urlsafe(32)
        
        # Initialize security components
        self.jwt_manager = JWTManager(self.app.config['SECRET_KEY'])
        self.rate_limiter = RateLimiter()
        self.cors_manager = CORSManager()
        self.session_manager = SecureSessionManager()
        self.security_tester = APISecurityTester("http://localhost:5000")
        
        # Setup database
        self.init_database()
        
        # Configure CORS policies
        self.setup_cors_policies()
        
        # Setup rate limiting
        self.setup_rate_limiting()
        
        # Register routes
        self.register_routes()
    
    def init_database(self):
        """Initialize SQLite database with secure schema"""
        conn = sqlite3.connect('secure_tasks.db')
        cursor = conn.cursor()
        
        # Users table with security features
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                failed_login_attempts INTEGER DEFAULT 0,
                last_failed_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tasks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                priority INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # API keys table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS api_keys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key_id TEXT UNIQUE NOT NULL,
                key_hash TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                permissions TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def setup_cors_policies(self):
        """Configure CORS policies for different environments"""
        
        # Development policy
        dev_policy = self.cors_manager.create_secure_policy(
            allowed_origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
            allow_credentials=True
        )
        
        # Production policy
        prod_policy = self.cors_manager.create_secure_policy(
            allowed_origins=['https://taskapp.com', 'https://api.taskapp.com'],
            allow_credentials=True
        )
        
        self.cors_manager.add_policy('development', dev_policy)
        self.cors_manager.add_policy('production', prod_policy)
        self.cors_manager.set_default_policy(dev_policy)  # Use dev for demo
    
    def setup_rate_limiting(self):
        """Configure rate limiting for different endpoints"""
        
        # Different limits for different endpoint types
        self.rate_limiter.create_rate_limit('auth_endpoint', 5, 50)      # 5 req/sec, burst 50
        self.rate_limiter.create_rate_limit('api_endpoint', 50, 500)     # 50 req/sec, burst 500
        self.rate_limiter.create_rate_limit('public_endpoint', 10, 100)  # 10 req/sec, burst 100
    
    def get_db_connection(self):
        """Get database connection with security considerations"""
        conn = sqlite3.connect('secure_tasks.db')
        conn.row_factory = sqlite3.Row  # Enable column access by name
        
        # Enable foreign key constraints
        conn.execute('PRAGMA foreign_keys = ON')
        
        return conn
    
    def validate_input(self, data: Dict[str, Any], rules: Dict[str, Dict]) -> tuple[bool, Dict[str, str]]:
        """Comprehensive input validation"""
        errors = {}
        
        for field, rule in rules.items():
            value = data.get(field, '')
            
            # Required field check
            if rule.get('required', False) and not value:
                errors[field] = f"{field} is required"
                continue
            
            # Type validation
            expected_type = rule.get('type', str)
            if value and not isinstance(value, expected_type):
                errors[field] = f"{field} must be of type {expected_type.__name__}"
                continue
            
            # Length validation
            if isinstance(value, str):
                min_length = rule.get('min_length', 0)
                max_length = rule.get('max_length', float('inf'))
                
                if len(value) < min_length:
                    errors[field] = f"{field} must be at least {min_length} characters"
                    continue
                
                if len(value) > max_length:
                    errors[field] = f"{field} must be at most {max_length} characters"
                    continue
            
            # Pattern validation (regex)
            pattern = rule.get('pattern')
            if pattern and isinstance(value, str):
                if not re.match(pattern, value):
                    errors[field] = f"{field} format is invalid"
                    continue
            
            # Custom validation function
            validator = rule.get('validator')
            if validator and callable(validator):
                if not validator(value):
                    errors[field] = f"{field} validation failed"
        
        return len(errors) == 0, errors
    
    def sanitize_input(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize input data to prevent injection attacks"""
        sanitized = {}
        
        for key, value in data.items():
            if isinstance(value, str):
                # Remove potential SQL injection characters
                value = value.replace("'", "''")  # Escape single quotes
                value = re.sub(r'[<>"\']', '', value)  # Remove XSS characters
                
                # Limit length to prevent buffer overflow
                value = value[:1000]
                
                sanitized[key] = value.strip()
            else:
                sanitized[key] = value
        
        return sanitized
    
    # Security decorators
    def require_auth(self, permissions: List[str] = None):
        """Decorator for endpoints requiring authentication"""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                # Check rate limiting first
                client_ip = request.remote_addr
                allowed, rate_info = self.rate_limiter.is_allowed(f"auth_{client_ip}")
                
                if not allowed:
                    return jsonify({
                        'error': 'Rate limit exceeded',
                        'retry_after': rate_info['retry_after']
                    }), 429
                
                # Get token from header
                auth_header = request.headers.get('Authorization', '')
                if not auth_header.startswith('Bearer '):
                    return jsonify({'error': 'Missing or invalid authorization header'}), 401
                
                token = auth_header.replace('Bearer ', '')
                
                # Validate JWT token
                payload = self.jwt_manager.validate_token(token)
                if not payload:
                    return jsonify({'error': 'Invalid or expired token'}), 401
                
                # Check permissions
                if permissions:
                    user_permissions = payload.get('permissions', [])
                    if not any(perm in user_permissions for perm in permissions):
                        return jsonify({'error': 'Insufficient permissions'}), 403
                
                # Store user info for use in endpoint
                g.current_user = payload
                
                return f(*args, **kwargs)
            return decorated_function
        return decorator
    
    def require_cors(self, policy_name: str = None):
        """Decorator for CORS handling"""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                origin = request.headers.get('Origin', '')
                
                # Handle preflight requests
                if request.method == 'OPTIONS':
                    cors_headers = self.cors_manager.handle_preflight_request(
                        origin=origin,
                        method=request.headers.get('Access-Control-Request-Method', ''),
                        headers=request.headers.get('Access-Control-Request-Headers', '').split(','),
                        policy_name=policy_name
                    )
                    
                    if not cors_headers:
                        return jsonify({'error': 'CORS policy violation'}), 403
                    
                    response = jsonify({'status': 'preflight ok'})
                    for key, value in cors_headers.items():
                        response.headers[key] = value
                    
                    return response
                
                # Handle actual request
                cors_headers = self.cors_manager.handle_actual_request(origin, policy_name)
                
                if not cors_headers:
                    return jsonify({'error': 'CORS policy violation'}), 403
                
                # Execute the actual function
                response = f(*args, **kwargs)
                
                # Add CORS headers to response
                if hasattr(response, 'headers'):
                    for key, value in cors_headers.items():
                        response.headers[key] = value
                
                return response
            return decorated_function
        return decorator
    
    def register_routes(self):
        """Register all API routes with security"""
        
        # Authentication endpoints
        @self.app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
        @self.require_cors()
        def register():
            """User registration with security validation"""
            if request.method == 'OPTIONS':
                return '', 200  # Handled by decorator
            
            # Rate limiting for registration
            client_ip = request.remote_addr
            allowed, rate_info = self.rate_limiter.sliding_window_check(
                f"register_{client_ip}", 3600, 5  # 5 registrations per hour
            )
            
            if not allowed:
                return jsonify({
                    'error': 'Registration rate limit exceeded',
                    'retry_after': rate_info['retry_after']
                }), 429
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Invalid JSON data'}), 400
            
            # Input validation
            validation_rules = {
                'username': {
                    'required': True,
                    'type': str,
                    'min_length': 3,
                    'max_length': 50,
                    'pattern': r'^[a-zA-Z0-9_]+$'
                },
                'email': {
                    'required': True,
                    'type': str,
                    'pattern': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
                },
                'password': {
                    'required': True,
                    'type': str,
                    'min_length': 8,
                    'validator': lambda p: any(c.isupper() for c in p) and 
                                         any(c.islower() for c in p) and 
                                         any(c.isdigit() for c in p)
                }
            }
            
            is_valid, errors = self.validate_input(data, validation_rules)
            if not is_valid:
                return jsonify({'error': 'Validation failed', 'details': errors}), 400
            
            # Sanitize input
            data = self.sanitize_input(data)
            
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            try:
                # Check if user already exists
                cursor.execute('SELECT id FROM users WHERE username = ? OR email = ?', 
                             (data['username'], data['email']))
                if cursor.fetchone():
                    return jsonify({'error': 'User already exists'}), 409
                
                # Generate salt and hash password
                salt = secrets.token_hex(16)
                password_hash = generate_password_hash(data['password'] + salt)
                
                # Insert user
                cursor.execute('''
                    INSERT INTO users (username, email, password_hash, salt)
                    VALUES (?, ?, ?, ?)
                ''', (data['username'], data['email'], password_hash, salt))
                
                user_id = cursor.lastrowid
                conn.commit()
                
                # Generate JWT token
                token = self.jwt_manager.generate_token(
                    user_id=str(user_id),
                    permissions=['read', 'write']
                )
                
                return jsonify({
                    'message': 'User registered successfully',
                    'token': token,
                    'user': {
                        'id': user_id,
                        'username': data['username'],
                        'email': data['email']
                    }
                }), 201
                
            except Exception as e:
                conn.rollback()
                return jsonify({'error': 'Registration failed'}), 500
            
            finally:
                conn.close()
        
        @self.app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
        @self.require_cors()
        def login():
            """User login with brute force protection"""
            if request.method == 'OPTIONS':
                return '', 200
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Invalid JSON data'}), 400
            
            # Input validation
            validation_rules = {
                'username': {'required': True, 'type': str},
                'password': {'required': True, 'type': str}
            }
            
            is_valid, errors = self.validate_input(data, validation_rules)
            if not is_valid:
                return jsonify({'error': 'Validation failed', 'details': errors}), 400
            
            data = self.sanitize_input(data)
            
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            try:
                # Get user with security info
                cursor.execute('''
                    SELECT id, username, email, password_hash, salt, 
                           failed_login_attempts, last_failed_login, is_active
                    FROM users WHERE username = ?
                ''', (data['username'],))
                
                user = cursor.fetchone()
                
                if not user or not user['is_active']:
                    return jsonify({'error': 'Invalid credentials'}), 401
                
                # Check for account lockout (brute force protection)
                if user['failed_login_attempts'] >= 5:
                    last_failed = datetime.fromisoformat(user['last_failed_login']) if user['last_failed_login'] else None
                    if last_failed and datetime.now() - last_failed < timedelta(minutes=15):
                        return jsonify({
                            'error': 'Account temporarily locked due to failed login attempts'
                        }), 423
                
                # Verify password
                if check_password_hash(user['password_hash'], data['password'] + user['salt']):
                    # Reset failed attempts on successful login
                    cursor.execute('''
                        UPDATE users SET failed_login_attempts = 0, last_failed_login = NULL 
                        WHERE id = ?
                    ''', (user['id'],))
                    conn.commit()
                    
                    # Generate JWT token
                    token = self.jwt_manager.generate_token(
                        user_id=str(user['id']),
                        permissions=['read', 'write']
                    )
                    
                    return jsonify({
                        'message': 'Login successful',
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'username': user['username'],
                            'email': user['email']
                        }
                    }), 200
                else:
                    # Increment failed login attempts
                    cursor.execute('''
                        UPDATE users SET 
                            failed_login_attempts = failed_login_attempts + 1,
                            last_failed_login = CURRENT_TIMESTAMP
                        WHERE id = ?
                    ''', (user['id'],))
                    conn.commit()
                    
                    return jsonify({'error': 'Invalid credentials'}), 401
            
            except Exception as e:
                return jsonify({'error': 'Login failed'}), 500
            
            finally:
                conn.close()
        
        # Task management endpoints
        @self.app.route('/api/tasks', methods=['GET', 'OPTIONS'])
        @self.require_cors()
        @self.require_auth(['read'])
        def get_tasks():
            """Get user's tasks with pagination"""
            if request.method == 'OPTIONS':
                return '', 200
            
            # Get pagination parameters
            page = request.args.get('page', 1, type=int)
            limit = min(request.args.get('limit', 10, type=int), 100)  # Cap at 100
            offset = (page - 1) * limit
            
            # Get filter parameters
            status_filter = request.args.get('status', '')
            priority_filter = request.args.get('priority', type=int)
            
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            try:
                # Build query with filters
                query = '''
                    SELECT id, title, description, status, priority, created_at, updated_at
                    FROM tasks WHERE user_id = ?
                '''
                params = [g.current_user['user_id']]
                
                if status_filter:
                    query += ' AND status = ?'
                    params.append(status_filter)
                
                if priority_filter is not None:
                    query += ' AND priority = ?'
                    params.append(priority_filter)
                
                query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
                params.extend([limit, offset])
                
                cursor.execute(query, params)
                tasks = [dict(row) for row in cursor.fetchall()]
                
                # Get total count for pagination
                count_query = 'SELECT COUNT(*) FROM tasks WHERE user_id = ?'
                count_params = [g.current_user['user_id']]
                
                if status_filter:
                    count_query += ' AND status = ?'
                    count_params.append(status_filter)
                
                if priority_filter is not None:
                    count_query += ' AND priority = ?'
                    count_params.append(priority_filter)
                
                cursor.execute(count_query, count_params)
                total_count = cursor.fetchone()[0]
                
                return jsonify({
                    'tasks': tasks,
                    'pagination': {
                        'page': page,
                        'limit': limit,
                        'total': total_count,
                        'pages': (total_count + limit - 1) // limit
                    }
                }), 200
            
            except Exception as e:
                return jsonify({'error': 'Failed to fetch tasks'}), 500
            
            finally:
                conn.close()
        
        @self.app.route('/api/tasks', methods=['POST', 'OPTIONS'])
        @self.require_cors()
        @self.require_auth(['write'])
        def create_task():
            """Create a new task"""
            if request.method == 'OPTIONS':
                return '', 200
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Invalid JSON data'}), 400
            
            # Input validation
            validation_rules = {
                'title': {
                    'required': True,
                    'type': str,
                    'min_length': 1,
                    'max_length': 200
                },
                'description': {
                    'required': False,
                    'type': str,
                    'max_length': 1000
                },
                'status': {
                    'required': False,
                    'type': str,
                    'validator': lambda s: s in ['pending', 'in_progress', 'completed']
                },
                'priority': {
                    'required': False,
                    'type': int,
                    'validator': lambda p: 1 <= p <= 5
                }
            }
            
            is_valid, errors = self.validate_input(data, validation_rules)
            if not is_valid:
                return jsonify({'error': 'Validation failed', 'details': errors}), 400
            
            data = self.sanitize_input(data)
            
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            try:
                cursor.execute('''
                    INSERT INTO tasks (user_id, title, description, status, priority)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    g.current_user['user_id'],
                    data['title'],
                    data.get('description', ''),
                    data.get('status', 'pending'),
                    data.get('priority', 1)
                ))
                
                task_id = cursor.lastrowid
                conn.commit()
                
                # Fetch the created task
                cursor.execute('''
                    SELECT id, title, description, status, priority, created_at, updated_at
                    FROM tasks WHERE id = ?
                ''', (task_id,))
                
                task = dict(cursor.fetchone())
                
                return jsonify({
                    'message': 'Task created successfully',
                    'task': task
                }), 201
            
            except Exception as e:
                conn.rollback()
                return jsonify({'error': 'Failed to create task'}), 500
            
            finally:
                conn.close()
        
        @self.app.route('/api/tasks/<int:task_id>', methods=['PUT', 'OPTIONS'])
        @self.require_cors()
        @self.require_auth(['write'])
        def update_task(task_id):
            """Update an existing task"""
            if request.method == 'OPTIONS':
                return '', 200
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Invalid JSON data'}), 400
            
            # Input validation (same as create)
            validation_rules = {
                'title': {
                    'required': False,
                    'type': str,
                    'min_length': 1,
                    'max_length': 200
                },
                'description': {
                    'required': False,
                    'type': str,
                    'max_length': 1000
                },
                'status': {
                    'required': False,
                    'type': str,
                    'validator': lambda s: s in ['pending', 'in_progress', 'completed']
                },
                'priority': {
                    'required': False,
                    'type': int,
                    'validator': lambda p: 1 <= p <= 5
                }
            }
            
            is_valid, errors = self.validate_input(data, validation_rules)
            if not is_valid:
                return jsonify({'error': 'Validation failed', 'details': errors}), 400
            
            data = self.sanitize_input(data)
            
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            try:
                # Check if task exists and belongs to user
                cursor.execute('''
                    SELECT id FROM tasks WHERE id = ? AND user_id = ?
                ''', (task_id, g.current_user['user_id']))
                
                if not cursor.fetchone():
                    return jsonify({'error': 'Task not found'}), 404
                
                # Build update query dynamically
                update_fields = []
                update_values = []
                
                for field in ['title', 'description', 'status', 'priority']:
                    if field in data:
                        update_fields.append(f"{field} = ?")
                        update_values.append(data[field])
                
                if update_fields:
                    update_fields.append("updated_at = CURRENT_TIMESTAMP")
                    update_values.append(task_id)
                    
                    query = f"UPDATE tasks SET {', '.join(update_fields)} WHERE id = ?"
                    cursor.execute(query, update_values)
                    conn.commit()
                
                # Fetch updated task
                cursor.execute('''
                    SELECT id, title, description, status, priority, created_at, updated_at
                    FROM tasks WHERE id = ?
                ''', (task_id,))
                
                task = dict(cursor.fetchone())
                
                return jsonify({
                    'message': 'Task updated successfully',
                    'task': task
                }), 200
            
            except Exception as e:
                conn.rollback()
                return jsonify({'error': 'Failed to update task'}), 500
            
            finally:
                conn.close()
        
        @self.app.route('/api/tasks/<int:task_id>', methods=['DELETE', 'OPTIONS'])
        @self.require_cors()
        @self.require_auth(['write'])
        def delete_task(task_id):
            """Delete a task"""
            if request.method == 'OPTIONS':
                return '', 200
            
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            try:
                # Check if task exists and belongs to user
                cursor.execute('''
                    SELECT id FROM tasks WHERE id = ? AND user_id = ?
                ''', (task_id, g.current_user['user_id']))
                
                if not cursor.fetchone():
                    return jsonify({'error': 'Task not found'}), 404
                
                # Delete the task
                cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
                conn.commit()
                
                return jsonify({'message': 'Task deleted successfully'}), 200
            
            except Exception as e:
                conn.rollback()
                return jsonify({'error': 'Failed to delete task'}), 500
            
            finally:
                conn.close()
        
        # Health check endpoint
        @self.app.route('/api/health', methods=['GET'])
        def health_check():
            """API health check"""
            return jsonify({
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'version': '1.0.0'
            }), 200
    
    def run(self, debug=False):
        """Run the secure API server"""
        print("Starting Secure Task API...")
        print("Available endpoints:")
        print("POST   /api/auth/register")
        print("POST   /api/auth/login")
        print("GET    /api/tasks")
        print("POST   /api/tasks")
        print("PUT    /api/tasks/<id>")
        print("DELETE /api/tasks/<id>")
        print("GET    /api/health")
        
        self.app.run(debug=debug, host='0.0.0.0', port=5000)

def api_demonstration():
    """Demonstrate the complete secure API"""
    
    # Create and configure the API
    api = SecureTaskAPI()
    
    print("Secure Task API initialized with:")
    print("✓ JWT Authentication")
    print("✓ Rate Limiting")
    print("✓ CORS Protection")
    print("✓ Input Validation")
    print("✓ SQL Injection Prevention")
    print("✓ Session Management")
    print("✓ Brute Force Protection")
    print("✓ Comprehensive Logging")
    
    # In a real application, you would call api.run()
    # For demonstration, we'll show the security features
    
    print("\nAPI Security Features:")
    print("1. Authentication: JWT tokens with expiration")
    print("2. Authorization: Permission-based access control")
    print("3. Rate Limiting: Prevents abuse and DoS attacks")
    print("4. Input Validation: Comprehensive data validation")
    print("5. CORS: Configurable cross-origin policies")
    print("6. SQL Injection: Parameterized queries")
    print("7. XSS Prevention: Input sanitization")
    print("8. Brute Force: Account lockout mechanisms")
    print("9. Session Security: Secure session management")
    print("10. Error Handling: Safe error messages")

if __name__ == "__main__":
    api_demonstration()

```

## Summary and Best Practices

This section has covered comprehensive API security through practical implementation. Here are the key takeaways:

### Essential Security Principles

1. **Defense in Depth**: Multiple layers of security controls

2. **Fail Securely**: Default to secure states when errors occur

3. **Least Privilege**: Grant minimum necessary permissions

4. **Security by Design**: Build security from the ground up

### Implementation Checklist

/// details | Authentication Security
    type: example
    open: false

#### API Keys

- Cryptographically secure generation

- Secure storage (hash, never plain text)

- Expiration and revocation mechanisms

- Rate limiting integration

#### JWT Tokens

- Strong secret keys

- Token expiration policies

- Blacklist capabilities

- Permission-based access control

#### OAuth 2.0

- Proper flow implementation

- Scope validation

- State parameter for CSRF protection

- Secure token storage
///

/// details | Rate Limiting & DoS Protection
    type: example
    open: false

#### Token Bucket Algorithm

- Configurable rates per identifier

- Burst capacity management

- Thread-safe implementation

#### Progressive Penalties

- Suspicion level calculation

- IP-based blocking

- Pattern recognition

- Automated responses
///

/// details | Session Management
    type: example
    open: false

#### Secure Session IDs

- Cryptographically random generation

- Session rotation to prevent fixation

- Timeout management

- IP and user agent validation

#### Security Features

- CSRF token protection

- Concurrent session limits

- Suspicious activity tracking

- Secure cookie attributes
///

/// details | CORS Security
    type: example
    open: false

#### Origin Validation

- Whitelist-based origin control

- Pattern matching with security checks

- Credential-aware policies

- Preflight request handling

#### Security Patterns

- Dangerous origin blocking

- Method restriction

- Header validation

- Environment-specific policies
///

/// details | Security Testing
    type: example
    open: false

#### Automated Testing

- Authentication vulnerability tests

- Injection attack simulation

- Rate limiting verification

- CORS policy validation

#### Comprehensive Coverage

- SQL injection with real payloads

- XSS detection mechanisms

- Path traversal testing

- Security score calculation
///

### Production Deployment Considerations

1. **HTTPS Only**: Never deploy APIs without TLS encryption

2. **Environment Separation**: Different security policies for dev/staging/production

3. **Monitoring**: Comprehensive logging and alerting

4. **Updates**: Regular security patches and dependency updates

5. **Backup**: Secure data backup and recovery procedures

### Common Pitfalls to Avoid

- **Overly Permissive CORS**: Never use `*` with credentials enabled

- **Weak Rate Limiting**: Implement multiple rate limiting strategies

- **Poor Error Messages**: Don't leak sensitive information in errors

- **Insufficient Logging**: Log security events for monitoring

- **Hardcoded Secrets**: Use environment variables for sensitive data

This comprehensive implementation provides a solid foundation for building secure APIs that protect against real-world threats while maintaining usability and performance.

## Practice Questions and Exercises

/// details | Quick Review Questions
    type: tip
    open: false

1. What are the three main components of a JWT token and what information does each contain?

2. Explain the difference between symmetric and asymmetric encryption in the context of API security.

3. How does the token bucket algorithm prevent DoS attacks while allowing legitimate burst traffic?

4. What is the purpose of the `OPTIONS` method in CORS preflight requests?

5. Why should API keys be stored as hashes rather than plain text?

6. What security vulnerabilities does session rotation help prevent?

7. Explain how rate limiting can be implemented at different layers of an API architecture.

8. What is the significance of the `nonce` parameter in OAuth 2.0 flows?

9. How do CSRF tokens protect against cross-site request forgery attacks?

10. What are the key indicators that an API security testing framework should monitor?
///

/// details | Practical Programming Exercises
    type: example
    open: false

### Exercise 1: Secure Registration System

Implement a user registration system that includes:

- Password strength validation (minimum 8 characters, mixed case, numbers, symbols)

- Email verification with time-limited tokens

- Rate limiting for registration attempts

- SQL injection prevention

- Input sanitization for all fields

**Requirements:**

```python
class SecureRegistration:
    def validate_password(self, password: str) -> tuple[bool, List[str]]
    def generate_verification_token(self, email: str) -> str
    def verify_email_token(self, token: str) -> bool
    def register_user(self, user_data: dict) -> dict

```

### Exercise 2: API Rate Limiter

Create a configurable rate limiting system with:

- Multiple rate limiting strategies (fixed window, sliding window, token bucket)

- Per-user and per-IP tracking

- Redis backend for distributed applications

- Automatic rate limit adjustment based on server load

**Requirements:**

```python
class AdvancedRateLimiter:
    def set_rate_limit(self, identifier: str, limit: int, window: int)
    def check_rate_limit(self, identifier: str) -> tuple[bool, dict]
    def reset_rate_limit(self, identifier: str)
    def get_rate_limit_status(self, identifier: str) -> dict

```

### Exercise 3: CORS Security Manager

Build a comprehensive CORS management system with:

- Environment-specific policies

- Origin pattern matching with wildcards

- Security validation for dangerous combinations

- Real-time policy updates without service restart

**Requirements:**

```python
class EnhancedCORSManager:
    def create_policy(self, name: str, config: dict) -> bool
    def validate_origin(self, origin: str, policy: str) -> bool
    def handle_preflight(self, request_data: dict) -> dict
    def update_policy(self, name: str, updates: dict) -> bool

```

### Exercise 4: Security Testing Suite

Develop an automated security testing framework for:

- Authentication bypass testing

- Authorization escalation detection

- Input validation verification

- Rate limiting effectiveness

- Session security validation

**Requirements:**

```python
class SecurityTestSuite:
    def test_authentication(self, api_endpoint: str) -> dict
    def test_authorization(self, user_roles: List[str]) -> dict
    def test_input_validation(self, endpoints: List[str]) -> dict
    def generate_security_report(self) -> dict

```

///

/// details | Case Study Analysis
    type: warning
    open: false

### Case Study: E-commerce API Security Breach

**Scenario:** An e-commerce platform suffered a security breach where attackers:

1. Exploited weak API authentication to access user accounts

2. Used SQL injection to extract customer payment data

3. Performed credential stuffing attacks due to lack of rate limiting

4. Bypassed CORS protections through domain spoofing

**Analysis Questions:**

1. **Authentication Vulnerabilities:**

   - What specific authentication weaknesses likely enabled the account access?

   - How could JWT implementation flaws contribute to this breach?

   - What multi-factor authentication strategies could have prevented this?

2. **Injection Prevention:**

   - Which input validation techniques would have stopped the SQL injection?

   - How should parameterized queries be implemented in the API layer?

   - What role does output encoding play in preventing data extraction?

3. **Rate Limiting Failures:**

   - Why might traditional rate limiting have failed against credential stuffing?

   - How could progressive penalties have detected the attack pattern?

   - What rate limiting strategies work best for authentication endpoints?

4. **CORS Bypass Analysis:**

   - How do attackers typically bypass CORS protections?

   - What origin validation techniques prevent domain spoofing?

   - How should CORS policies be configured for financial applications?

**Remediation Plan:**

Design a comprehensive security improvement plan that addresses each vulnerability type with specific technical controls and monitoring mechanisms.
///

## Summary Checklist

Use this checklist to ensure comprehensive API security implementation:

### Authentication & Authorization

- [ ] Strong password policies enforced

- [ ] Multi-factor authentication implemented

- [ ] JWT tokens with proper expiration

- [ ] API key rotation mechanisms

- [ ] OAuth 2.0 secure flows

- [ ] Permission-based access control

### Rate Limiting & DoS Protection

- [ ] Multiple rate limiting strategies

- [ ] Progressive penalty systems

- [ ] IP-based blocking capabilities

- [ ] Burst traffic handling

- [ ] Distributed rate limiting support

### Input Validation & Sanitization

- [ ] Comprehensive validation rules

- [ ] SQL injection prevention

- [ ] XSS protection mechanisms

- [ ] File upload security

- [ ] Parameter tampering protection

### Session Management

- [ ] Secure session ID generation

- [ ] Session rotation implementation

- [ ] Timeout management

- [ ] Concurrent session limits

- [ ] CSRF protection

### CORS & Cross-Origin Security

- [ ] Whitelist-based origin control

- [ ] Preflight request handling

- [ ] Credential policy management

- [ ] Environment-specific policies

- [ ] Security header implementation

### Monitoring & Testing

- [ ] Automated security testing

- [ ] Vulnerability scanning

- [ ] Security event logging

- [ ] Incident response procedures

- [ ] Regular security audits

### Deployment Security

- [ ] HTTPS enforcement

- [ ] Secure configuration management

- [ ] Environment separation

- [ ] Secret management

- [ ] Regular updates and patches
