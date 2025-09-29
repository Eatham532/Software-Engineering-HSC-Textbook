# 11.3 Web protocols, ports and secure transport concepts

## Why it matters


When you build web applications, understanding security protocols helps you protect user data and build trustworthy systems. SSL/TLS encryption, certificates, and authentication form the foundation of web security that users rely on every day.

## Concepts

### SSL certificates and Certificate Authorities

SSL certificates prove that a website is who it claims to be. When you visit `https://github.com`, your browser checks GitHub's certificate to verify it's really GitHub, not an imposter.

A certificate contains:

- **Domain name** it's valid for (e.g., `github.com`)

- **Public key** for encryption

- **Certificate Authority (CA)** signature

- **Expiration date** and validity period

- **Organization details** (for extended validation)

Certificate Authorities are trusted organizations that verify website identities before issuing certificates. Your browser trusts CAs like Let's Encrypt, DigiCert, and others.

```python
# Example: Checking certificate info with Python
import ssl
import socket

def check_certificate(hostname, port=443):
    """Check SSL certificate information for a website."""
    context = ssl.create_default_context()
    
    with socket.create_connection((hostname, port)) as sock:
        with context.wrap_socket(sock, server_hostname=hostname) as ssock:
            cert = ssock.getpeercert()
            
            print(f"Certificate for {hostname}:")
            print(f"  Subject: {cert['subject']}")
            print(f"  Issuer: {cert['issuer']}")
            print(f"  Valid until: {cert['notAfter']}")
            print(f"  Serial number: {cert['serialNumber']}")

# Check a real certificate
check_certificate('github.com')

```

### Encryption algorithms: symmetric vs asymmetric

**Symmetric encryption** uses the same key for encryption and decryption. It's fast but requires secure key sharing.

**Asymmetric encryption** uses a pair of keys: public (shareable) and private (secret). It's slower but solves the key-sharing problem.

```python
# Conceptual example of encryption approaches
class SymmetricEncryption:
    """Simplified symmetric encryption concept."""
    
    def __init__(self, shared_key):
        self.key = shared_key
    
    def encrypt(self, message):
        """Encrypt message with shared key."""
        # Simplified: XOR each character with key
        encrypted = ""
        for i, char in enumerate(message):
            key_char = self.key[i % len(self.key)]
            encrypted += chr(ord(char) ^ ord(key_char))
        return encrypted
    
    def decrypt(self, encrypted_message):
        """Decrypt with same key (XOR is reversible)."""
        return self.encrypt(encrypted_message)  # XOR reverses itself

class AsymmetricEncryption:
    """Simplified asymmetric encryption concept."""
    
    def __init__(self):
        # In reality, these would be large mathematical key pairs
        self.public_key = "public_123"
        self.private_key = "private_456"
    
    def encrypt_with_public(self, message):
        """Anyone can encrypt with public key."""
        print(f"Encrypting '{message}' with public key: {self.public_key}")
        return f"encrypted_{message}_with_public"
    
    def decrypt_with_private(self, encrypted_message):
        """Only private key holder can decrypt."""
        print(f"Decrypting with private key: {self.private_key}")
        return encrypted_message.replace("encrypted_", "").replace("_with_public", "")

# Demonstration
sym = SymmetricEncryption("secretkey")
message = "Hello"
encrypted = sym.encrypt(message)
decrypted = sym.decrypt(encrypted)
print(f"Symmetric: {message} → {encrypted} → {decrypted}")

asym = AsymmetricEncryption()
encrypted_asym = asym.encrypt_with_public("Hello")
decrypted_asym = asym.decrypt_with_private(encrypted_asym)
print(f"Asymmetric: Hello → {encrypted_asym} → {decrypted_asym}")

```

### Plain text vs cipher text

**Plain text** is readable data. **Cipher text** is encrypted data that looks random. Encryption transforms plain text into cipher text to protect it during transmission.

```python
def demonstrate_encryption_need():
    """Show why we encrypt sensitive data."""
    
    # Sensitive data in plain text (dangerous!)
    plain_text_data = {
        "credit_card": "4532-1234-5678-9012",
        "password": "myPassword123",
        "personal_id": "123-45-6789"
    }
    
    print("Plain text (readable by anyone):")
    for key, value in plain_text_data.items():
        print(f"  {key}: {value}")
    
    print("\nCipher text (protected):")
    # Simulated encrypted versions
    encrypted_data = {
        "credit_card": "8a4f2c9d1e5b7a3f...",
        "password": "7f3e8d2a9c4b1f6e...",
        "personal_id": "2b9f4e7a1c8d5f3a..."
    }
    
    for key, value in encrypted_data.items():
        print(f"  {key}: {value}")
    
    print("\nWhy encryption matters:")
    print("- Protects data if intercepted during transmission")
    print("- Prevents unauthorized access to stored data")
    print("- Maintains user privacy and trust")

demonstrate_encryption_need()

```

### Authentication and authorisation

**Authentication** answers "Who are you?" **Authorisation** answers "What can you do?"

```python
class WebSecuritySystem:
    """Simplified web authentication and authorisation."""
    
    def __init__(self):
        self.users = {
            "alice": {"password": "hashed_pw_123", "role": "admin"},
            "bob": {"password": "hashed_pw_456", "role": "user"},
            "charlie": {"password": "hashed_pw_789", "role": "user"}
        }
        self.permissions = {
            "admin": ["read", "write", "delete", "manage_users"],
            "user": ["read", "write"]
        }
    
    def authenticate(self, username, password):
        """Verify user identity (authentication)."""
        if username in self.users:
            # In reality, compare hashed passwords
            stored_hash = self.users[username]["password"]
            password_hash = f"hashed_pw_{hash(password) % 1000}"
            
            if stored_hash == password_hash:
                print(f"✓ Authentication successful for {username}")
                return True
        
        print(f"✗ Authentication failed for {username}")
        return False
    
    def authorize(self, username, action):
        """Check if user can perform action (authorisation)."""
        if username not in self.users:
            return False
        
        user_role = self.users[username]["role"]
        user_permissions = self.permissions.get(user_role, [])
        
        if action in user_permissions:
            print(f"✓ {username} authorized for {action}")
            return True
        else:
            print(f"✗ {username} not authorized for {action}")
            return False

# Example usage
security = WebSecuritySystem()

# Authentication examples
security.authenticate("alice", "secret123")  # Would need correct password
security.authenticate("eve", "anypassword")   # Unknown user

# Authorisation examples  
security.authorize("alice", "delete")      # Admin can delete
security.authorize("bob", "delete")        # User cannot delete
security.authorize("bob", "read")          # User can read

```

### Hash values for integrity and passwords

Hash functions create fixed-size "fingerprints" of data. They're one-way (can't reverse) and deterministic (same input = same output).

```python
import hashlib

def demonstrate_hashing():
    """Show hash functions for integrity and password storage."""
    
    # Password hashing (never store plain passwords!)
    password = "userPassword123"
    salt = "random_salt_456"  # Prevents rainbow table attacks
    
    # Hash password with salt
    password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    print(f"Password: {password}")
    print(f"Hash: {password_hash}")
    print(f"Salt: {salt}")
    
    # Data integrity checking
    data = "Important document content"
    data_hash = hashlib.sha256(data.encode()).hexdigest()
    
    print(f"\nData: {data}")
    print(f"Hash: {data_hash}")
    
    # Verify integrity
    received_data = "Important document content"
    received_hash = hashlib.sha256(received_data.encode()).hexdigest()
    
    if data_hash == received_hash:
        print("✓ Data integrity verified - no tampering detected")
    else:
        print("✗ Data may have been tampered with!")
    
    # Show hash sensitivity
    modified_data = "Important document content."  # Added period
    modified_hash = hashlib.sha256(modified_data.encode()).hexdigest()
    print(f"\nModified data: {modified_data}")
    print(f"Modified hash: {modified_hash}")
    print("Notice: tiny change = completely different hash")

demonstrate_hashing()

```

### Digital signatures

Digital signatures provide **non-repudiation** (can't deny you signed it) and **verification** (proves who signed it).

```python
class DigitalSignatureDemo:
    """Simplified digital signature concept."""
    
    def __init__(self, signer_name):
        self.signer_name = signer_name
        # In reality, these would be cryptographic key pairs
        self.private_key = f"private_key_{signer_name}"
        self.public_key = f"public_key_{signer_name}"
    
    def sign_document(self, document):
        """Create digital signature for document."""
        # Simplified: combine document hash with private key
        doc_hash = hash(document) % 10000
        signature = f"sig_{doc_hash}_{self.signer_name}"
        
        signed_document = {
            "content": document,
            "signature": signature,
            "signer": self.signer_name,
            "public_key": self.public_key
        }
        
        print(f"{self.signer_name} signed document")
        return signed_document
    
    def verify_signature(self, signed_document):
        """Verify document signature."""
        content = signed_document["content"]
        signature = signed_document["signature"]
        signer = signed_document["signer"]
        
        # Recalculate expected signature
        doc_hash = hash(content) % 10000
        expected_sig = f"sig_{doc_hash}_{signer}"
        
        if signature == expected_sig:
            print(f"✓ Signature valid - document signed by {signer}")
            print("✓ Document has not been tampered with")
            return True
        else:
            print("✗ Invalid signature - document may be forged or tampered")
            return False

# Example usage
alice = DigitalSignatureDemo("Alice")
bob = DigitalSignatureDemo("Bob")

# Alice signs a contract
contract = "Agreement to develop web application for $10,000"
signed_contract = alice.sign_document(contract)

# Bob verifies Alice's signature
print(f"\nBob verifying contract:")
alice.verify_signature(signed_contract)

# Tampering detection
signed_contract["content"] = "Agreement to develop web application for $1,000"
print(f"\nAfter tampering:")
alice.verify_signature(signed_contract)

```

### Guided example: HTTPS connection flow

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

participant "Browser" as B
participant "Server" as S
participant "Certificate Authority" as CA

B -> S: 1. Request HTTPS connection
S -> B: 2. Send SSL certificate
B -> CA: 3. Verify certificate with CA
CA -> B: 4. Certificate validation response
B -> S: 5. Send public key encrypted session key
S -> B: 6. Acknowledge - encrypted connection established
B <-> S: 7. Encrypted data exchange using session keys

note right of B
  Browser verifies:
  - Certificate is valid
  - Certificate matches domain
  - Certificate is not expired
  - CA signature is trusted
end note

note left of S
  Server proves identity with:
  - Valid certificate
  - Private key ownership
  - CA endorsement
end note
@enduml

```

## Try it

/// details | Exercise 1: Certificate Investigation
    type: question
    open: false

Use Python or browser tools to investigate SSL certificates:

1. Check the certificate for your school's website

2. Look at the certificate for a major site like Google or GitHub

3. Compare their certificate details (issuer, expiration, encryption)

Write a simple Python script to extract and display certificate information.

/// details | Sample Solution
    type: success
    open: false

```python
import ssl
import socket
from datetime import datetime

def analyze_certificate(hostname):
    """Analyze SSL certificate for a website."""
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                
                print(f"\n=== Certificate Analysis for {hostname} ===")
                
                # Basic info
                subject = dict(x[0] for x in cert['subject'])
                issuer = dict(x[0] for x in cert['issuer'])
                
                print(f"Subject: {subject.get('commonName', 'N/A')}")
                print(f"Issuer: {issuer.get('commonName', 'N/A')}")
                print(f"Serial: {cert.get('serialNumber', 'N/A')}")
                
                # Validity
                not_before = cert['notBefore']
                not_after = cert['notAfter']
                print(f"Valid from: {not_before}")
                print(f"Valid until: {not_after}")
                
                # Check if expired
                expiry_date = datetime.strptime(not_after, '%b %d %H:%M:%S %Y %Z')
                days_until_expiry = (expiry_date - datetime.now()).days
                print(f"Days until expiry: {days_until_expiry}")
                
                # Alternative names
                if 'subjectAltName' in cert:
                    alt_names = [name[1] for name in cert['subjectAltName']]
                    print(f"Alternative names: {', '.join(alt_names[:3])}...")

    except Exception as e:
        print(f"Error checking {hostname}: {e}")

# Test with different sites
sites = ['github.com', 'google.com', 'stackoverflow.com']
for site in sites:
    analyze_certificate(site)

```

///
///

/// details | Exercise 2: Password Security
    type: question
    open: false

Create a password security system that demonstrates:

1. Password hashing with salt

2. Password strength checking

3. Secure password comparison

Include functions to hash passwords, verify them, and check strength.

/// details | Sample Solution
    type: success
    open: false

```python
import hashlib
import secrets
import re

class PasswordSecurity:
    """Secure password handling system."""
    
    def __init__(self):
        self.users = {}
    
    def generate_salt(self):
        """Generate random salt for password hashing."""
        return secrets.token_hex(16)
    
    def hash_password(self, password, salt=None):
        """Hash password with salt."""
        if salt is None:
            salt = self.generate_salt()
        
        # Combine password and salt, then hash
        combined = password + salt
        hashed = hashlib.sha256(combined.encode()).hexdigest()
        
        return hashed, salt
    
    def check_password_strength(self, password):
        """Check password strength and return recommendations."""
        issues = []
        
        if len(password) < 8:
            issues.append("Password should be at least 8 characters long")
        
        if not re.search(r'[a-z]', password):
            issues.append("Password should contain lowercase letters")
        
        if not re.search(r'[A-Z]', password):
            issues.append("Password should contain uppercase letters")
        
        if not re.search(r'\d', password):
            issues.append("Password should contain numbers")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            issues.append("Password should contain special characters")
        
        strength = "Strong" if not issues else "Weak"
        return strength, issues
    
    def register_user(self, username, password):
        """Register new user with secure password storage."""
        strength, issues = self.check_password_strength(password)
        
        if issues:
            print(f"Password too weak for {username}:")
            for issue in issues:
                print(f"  - {issue}")
            return False
        
        hashed_password, salt = self.hash_password(password)
        self.users[username] = {
            'password_hash': hashed_password,
            'salt': salt
        }
        
        print(f"✓ User {username} registered successfully")
        return True
    
    def verify_login(self, username, password):
        """Verify user login credentials."""
        if username not in self.users:
            print(f"✗ User {username} not found")
            return False
        
        user_data = self.users[username]
        stored_hash = user_data['password_hash']
        salt = user_data['salt']
        
        # Hash provided password with stored salt
        provided_hash, _ = self.hash_password(password, salt)
        
        if provided_hash == stored_hash:
            print(f"✓ Login successful for {username}")
            return True
        else:
            print(f"✗ Invalid password for {username}")
            return False

# Example usage
auth_system = PasswordSecurity()

# Test password registration
print("=== Testing Password Registration ===")
auth_system.register_user("alice", "weak")  # Should fail
auth_system.register_user("alice", "StrongPass123!")  # Should succeed

# Test login
print("\n=== Testing Login ===")
auth_system.verify_login("alice", "wrongpassword")  # Should fail
auth_system.verify_login("alice", "StrongPass123!")  # Should succeed

```

///
///


## Recap

Web security relies on multiple layers:

- **SSL/TLS certificates** verify website identity and enable encryption

- **Symmetric encryption** (fast) and **asymmetric encryption** (secure key exchange) work together

- **Authentication** identifies users, **authorisation** controls their permissions  

- **Hash functions** protect passwords and verify data integrity

- **Digital signatures** provide non-repudiation and authenticity

Understanding these concepts helps you build secure web applications and make informed decisions about protecting user data. Each piece works together to create the secure web experience users expect.







