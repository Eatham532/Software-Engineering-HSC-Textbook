---
title: "Section 15.2: Cryptography & Data Protection"
---

# Section 15.2: Cryptography & Data Protection

## Learning Objectives

By the end of this section, you will be able to:

- **Understand hashing vs encryption** and determine when to use each technique

- **Implement key management fundamentals** for secure cryptographic operations

- **Create secure password storage** using hashing with salting techniques

- **Perform basic encryption/decryption** operations using Python cryptography libraries

- **Apply certificate and TLS basics** for secure communication

## Why Cryptography Matters

Cryptography is the foundation of modern digital security, protecting data whether it's stored on disk, transmitted over networks, or processed in applications. Understanding when and how to use different cryptographic techniques is essential for building secure systems.

**Without proper cryptography:**

- Passwords stored in plain text are immediately compromised in data breaches

- Sensitive data transmitted over networks can be intercepted and read

- Stored files containing personal information are vulnerable to unauthorized access

- Digital communications lack authenticity and can be impersonated

## Hashing vs Encryption: When to Use Each

### Hashing: One-Way Data Fingerprinting

**Hashing** creates a fixed-size "fingerprint" of data that cannot be reversed to recover the original data.

**Use hashing for:**

- Password verification

- Data integrity checking

- Digital signatures

- Proof of data existence without revealing content

**Key characteristics:**

- **One-way function**: Cannot be reversed to get original data

- **Deterministic**: Same input always produces same hash

- **Fixed output size**: Hash is always the same length regardless of input size

- **Avalanche effect**: Small input changes produce completely different hashes

```python-template
import hashlib
import secrets
import time

class SecureHashingManager:
    def __init__(self):
        self.supported_algorithms = ['sha256', 'sha3_256', 'blake2b']
    
    def hash_password(self, password, salt=None, algorithm='sha256', iterations=100000):
        """Securely hash password with salt and key stretching"""
        
        if salt is None:
            salt = secrets.token_bytes(32)  # 256-bit salt
        elif isinstance(salt, str):
            salt = salt.encode('utf-8')
        
        # Use PBKDF2 for key stretching (makes brute force attacks slower)
        password_hash = hashlib.pbkdf2_hmac(
            algorithm,
            password.encode('utf-8'),
            salt,
            iterations
        )
        
        return {
            'hash': password_hash.hex(),
            'salt': salt.hex(),
            'algorithm': algorithm,
            'iterations': iterations
        }
    
    def verify_password(self, password, stored_hash_data):
        """Verify password against stored hash"""
        
        # Recreate hash with same parameters
        verification_hash = hashlib.pbkdf2_hmac(
            stored_hash_data['algorithm'],
            password.encode('utf-8'),
            bytes.fromhex(stored_hash_data['salt']),
            stored_hash_data['iterations']
        )
        
        # Constant-time comparison to prevent timing attacks
        return secrets.compare_digest(
            verification_hash.hex(),
            stored_hash_data['hash']
        )
    
    def hash_file_for_integrity(self, file_path, algorithm='sha256'):
        """Calculate file hash for integrity verification"""
        
        hash_obj = hashlib.new(algorithm)
        
        try:
            with open(file_path, 'rb') as f:
                # Read file in chunks to handle large files
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_obj.update(chunk)
            
            return {
                'file_path': file_path,
                'hash': hash_obj.hexdigest(),
                'algorithm': algorithm,
                'timestamp': time.time()
            }
        
        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {file_path}")
    
    def verify_file_integrity(self, file_path, expected_hash, algorithm='sha256'):
        """Verify file hasn't been modified"""
        
        current_hash_data = self.hash_file_for_integrity(file_path, algorithm)
        
        return secrets.compare_digest(
            current_hash_data['hash'],
            expected_hash
        )
    
    def demonstrate_avalanche_effect(self, base_text="Hello World"):
        """Show how small changes create completely different hashes"""
        
        texts = [
            base_text,
            base_text + "!",  # Add exclamation
            base_text.replace("l", "L"),  # Change case
            base_text + " "  # Add space
        ]
        
        results = []
        for text in texts:
            hash_value = hashlib.sha256(text.encode()).hexdigest()
            results.append({
                'input': repr(text),
                'hash': hash_value,
                'length': len(hash_value)
            })
        
        return results

# Example usage for password security
def demonstrate_secure_password_hashing():
    """Demonstrate secure password handling"""
    
    hash_manager = SecureHashingManager()
    
    print("=== Secure Password Hashing Demo ===")
    
    # Hash a password
    password = "SecureStudentPassword123!"
    hash_data = hash_manager.hash_password(password)
    
    print(f"Original password: {password}")
    print(f"Salt: {hash_data['salt'][:16]}... (truncated)")
    print(f"Hash: {hash_data['hash'][:16]}... (truncated)")
    print(f"Algorithm: {hash_data['algorithm']}")
    print(f"Iterations: {hash_data['iterations']}")
    
    # Verify correct password
    is_valid = hash_manager.verify_password(password, hash_data)
    print(f"Correct password verification: {is_valid}")
    
    # Verify incorrect password
    is_valid_wrong = hash_manager.verify_password("WrongPassword", hash_data)
    print(f"Wrong password verification: {is_valid_wrong}")
    
    print("\n=== Avalanche Effect Demo ===")
    avalanche_results = hash_manager.demonstrate_avalanche_effect()
    
    for result in avalanche_results:
        print(f"Input: {result['input']}")
        print(f"Hash:  {result['hash']}")
        print()

```

### Encryption: Reversible Data Protection

**Encryption** transforms data into an unreadable format that can be reversed with the correct key.

**Use encryption for:**

- Protecting sensitive data in storage

- Securing data transmission

- Confidential file storage

- Database field protection

**Key characteristics:**

- **Two-way function**: Can be reversed with the correct key

- **Key-dependent**: Different keys produce different encrypted output

- **Preserves data**: Original data can be fully recovered

- **Variable output size**: Encrypted data is usually larger than original

```python-template
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

class SecureEncryptionManager:
    def __init__(self):
        self.symmetric_keys = {}
        self.asymmetric_keys = {}
    
    def generate_symmetric_key(self, key_id="default"):
        """Generate symmetric encryption key"""
        key = Fernet.generate_key()
        self.symmetric_keys[key_id] = key
        return key
    
    def derive_key_from_password(self, password, salt=None):
        """Derive encryption key from password"""
        if salt is None:
            salt = os.urandom(16)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return key, salt
    
    def encrypt_data(self, data, key_id="default"):
        """Encrypt data using symmetric encryption"""
        
        if key_id not in self.symmetric_keys:
            self.generate_symmetric_key(key_id)
        
        key = self.symmetric_keys[key_id]
        fernet = Fernet(key)
        
        if isinstance(data, str):
            data = data.encode('utf-8')
        
        encrypted_data = fernet.encrypt(data)
        
        return {
            'encrypted_data': encrypted_data,
            'key_id': key_id,
            'algorithm': 'Fernet (AES-128)'
        }
    
    def decrypt_data(self, encrypted_data, key_id="default"):
        """Decrypt data using symmetric encryption"""
        
        if key_id not in self.symmetric_keys:
            raise ValueError(f"Key '{key_id}' not found")
        
        key = self.symmetric_keys[key_id]
        fernet = Fernet(key)
        
        if isinstance(encrypted_data, dict):
            encrypted_data = encrypted_data['encrypted_data']
        
        try:
            decrypted_data = fernet.decrypt(encrypted_data)
            return decrypted_data.decode('utf-8')
        except Exception as e:
            raise ValueError(f"Decryption failed: {e}")
    
    def generate_asymmetric_keypair(self, key_id="default"):
        """Generate RSA public/private key pair"""
        
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        public_key = private_key.public_key()
        
        self.asymmetric_keys[key_id] = {
            'private_key': private_key,
            'public_key': public_key
        }
        
        return {
            'public_key': public_key,
            'private_key': private_key,
            'key_id': key_id
        }
    
    def encrypt_with_public_key(self, data, key_id="default"):
        """Encrypt data using RSA public key"""
        
        if key_id not in self.asymmetric_keys:
            self.generate_asymmetric_keypair(key_id)
        
        public_key = self.asymmetric_keys[key_id]['public_key']
        
        if isinstance(data, str):
            data = data.encode('utf-8')
        
        # RSA can only encrypt small amounts of data
        if len(data) > 190:  # RSA-2048 limit minus padding
            raise ValueError("Data too large for RSA encryption")
        
        encrypted_data = public_key.encrypt(
            data,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        return encrypted_data
    
    def decrypt_with_private_key(self, encrypted_data, key_id="default"):
        """Decrypt data using RSA private key"""
        
        if key_id not in self.asymmetric_keys:
            raise ValueError(f"Key '{key_id}' not found")
        
        private_key = self.asymmetric_keys[key_id]['private_key']
        
        try:
            decrypted_data = private_key.decrypt(
                encrypted_data,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            return decrypted_data.decode('utf-8')
        except Exception as e:
            raise ValueError(f"Decryption failed: {e}")

# Example usage for student record encryption
def demonstrate_encryption_scenarios():
    """Demonstrate different encryption use cases"""
    
    encryption_manager = SecureEncryptionManager()
    
    print("=== Symmetric Encryption Demo ===")
    
    # Encrypt student personal information
    student_info = {
        'student_id': 'S12345',
        'name': 'Alice Johnson',
        'ssn': '123-45-6789',
        'address': '123 School St, Education City',
        'grade_level': 11
    }
    
    # Convert to string for encryption
    student_data = str(student_info)
    
    # Encrypt
    encrypted_result = encryption_manager.encrypt_data(student_data, "student_records")
    print(f"Original data length: {len(student_data)} characters")
    print(f"Encrypted data length: {len(encrypted_result['encrypted_data'])} bytes")
    print(f"Algorithm: {encrypted_result['algorithm']}")
    
    # Decrypt
    decrypted_data = encryption_manager.decrypt_data(encrypted_result, "student_records")
    print(f"Decryption successful: {decrypted_data == student_data}")
    
    print("\n=== Asymmetric Encryption Demo ===")
    
    # Generate keypair for secure communication
    keypair = encryption_manager.generate_asymmetric_keypair("communication")
    
    # Encrypt small sensitive message
    message = "Grade change: Student S12345 Math grade updated to 95"
    
    try:
        encrypted_message = encryption_manager.encrypt_with_public_key(message, "communication")
        print(f"Message encrypted successfully")
        print(f"Original message: {message}")
        
        # Decrypt message
        decrypted_message = encryption_manager.decrypt_with_private_key(encrypted_message, "communication")
        print(f"Decrypted message: {decrypted_message}")
        print(f"Decryption successful: {message == decrypted_message}")
        
    except ValueError as e:
        print(f"Encryption error: {e}")

```

## Key Management Fundamentals

Proper key management is crucial for cryptographic security. Keys must be generated securely, stored safely, and rotated regularly.

```python-template
import json
import os
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
import secrets

class CryptographicKeyManager:
    def __init__(self, key_store_path="keystore"):
        self.key_store_path = key_store_path
        self.keys = {}
        self.key_metadata = {}
        
        # Create secure key storage directory
        os.makedirs(key_store_path, exist_ok=True, mode=0o700)  # Owner only
        
        self.load_existing_keys()
    
    def generate_key(self, key_id, key_type="symmetric", purpose="general", 
                    expiry_days=365):
        """Generate new cryptographic key with metadata"""
        
        if key_type == "symmetric":
            key = Fernet.generate_key()
        else:
            raise ValueError(f"Unsupported key type: {key_type}")
        
        # Store key metadata
        metadata = {
            'key_id': key_id,
            'key_type': key_type,
            'purpose': purpose,
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(days=expiry_days)).isoformat(),
            'algorithm': 'Fernet (AES-128)',
            'status': 'active'
        }
        
        # Store key securely
        self.keys[key_id] = key
        self.key_metadata[key_id] = metadata
        
        # Persist to secure storage
        self._save_key_to_storage(key_id, key, metadata)
        
        return {
            'key_id': key_id,
            'metadata': metadata,
            'key_created': True
        }
    
    def get_key(self, key_id):
        """Retrieve key with validation"""
        
        if key_id not in self.keys:
            raise ValueError(f"Key '{key_id}' not found")
        
        metadata = self.key_metadata[key_id]
        
        # Check if key has expired
        expiry_date = datetime.fromisoformat(metadata['expires_at'])
        if datetime.now() > expiry_date:
            raise ValueError(f"Key '{key_id}' has expired")
        
        # Check if key is active
        if metadata['status'] != 'active':
            raise ValueError(f"Key '{key_id}' is not active")
        
        return self.keys[key_id]
    
    def rotate_key(self, old_key_id, new_key_id=None):
        """Rotate encryption key"""
        
        if new_key_id is None:
            new_key_id = f"{old_key_id}_rotated_{int(datetime.now().timestamp())}"
        
        # Get old key metadata for reference
        old_metadata = self.key_metadata.get(old_key_id, {})
        
        # Generate new key with same purpose
        new_key_result = self.generate_key(
            new_key_id,
            key_type=old_metadata.get('key_type', 'symmetric'),
            purpose=old_metadata.get('purpose', 'general')
        )
        
        # Mark old key as deprecated (don't delete immediately for data recovery)
        if old_key_id in self.key_metadata:
            self.key_metadata[old_key_id]['status'] = 'deprecated'
            self.key_metadata[old_key_id]['deprecated_at'] = datetime.now().isoformat()
            self.key_metadata[old_key_id]['replaced_by'] = new_key_id
        
        return {
            'old_key_id': old_key_id,
            'new_key_id': new_key_id,
            'rotation_completed': True
        }
    
    def list_keys(self, include_deprecated=False):
        """List all keys with their status"""
        
        key_list = []
        for key_id, metadata in self.key_metadata.items():
            if not include_deprecated and metadata['status'] == 'deprecated':
                continue
                
            key_info = {
                'key_id': key_id,
                'purpose': metadata['purpose'],
                'status': metadata['status'],
                'created_at': metadata['created_at'],
                'expires_at': metadata['expires_at']
            }
            
            # Check expiry status
            expiry_date = datetime.fromisoformat(metadata['expires_at'])
            if datetime.now() > expiry_date:
                key_info['expired'] = True
            
            key_list.append(key_info)
        
        return key_list
    
    def _save_key_to_storage(self, key_id, key, metadata):
        """Securely save key to filesystem"""
        
        # In production, use HSM or secure key management service
        key_file = os.path.join(self.key_store_path, f"{key_id}.key")
        metadata_file = os.path.join(self.key_store_path, f"{key_id}.metadata")
        
        # Save key (in production, encrypt this with master key)
        with open(key_file, 'wb') as f:
            f.write(key)
        os.chmod(key_file, 0o600)  # Owner read/write only
        
        # Save metadata
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        os.chmod(metadata_file, 0o600)
    
    def load_existing_keys(self):
        """Load keys from secure storage on startup"""
        
        if not os.path.exists(self.key_store_path):
            return
        
        for filename in os.listdir(self.key_store_path):
            if filename.endswith('.metadata'):
                key_id = filename[:-9]  # Remove .metadata extension
                
                try:
                    # Load metadata
                    metadata_file = os.path.join(self.key_store_path, filename)
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                    
                    # Load key
                    key_file = os.path.join(self.key_store_path, f"{key_id}.key")
                    with open(key_file, 'rb') as f:
                        key = f.read()
                    
                    self.keys[key_id] = key
                    self.key_metadata[key_id] = metadata
                    
                except (FileNotFoundError, json.JSONDecodeError) as e:
                    print(f"Warning: Could not load key {key_id}: {e}")

# Example usage for school system key management
def demonstrate_key_management():
    """Demonstrate key management for school system"""
    
    key_manager = CryptographicKeyManager()
    
    print("=== Key Management Demo ===")
    
    # Generate keys for different purposes
    purposes = [
        ("student_records", "student record encryption"),
        ("grade_data", "grade database encryption"),
        ("communication", "secure messaging")
    ]
    
    for key_id, purpose in purposes:
        result = key_manager.generate_key(key_id, purpose=purpose)
        print(f"Generated key: {result['key_id']} for {purpose}")
    
    # List current keys
    print("\n=== Current Keys ===")
    keys = key_manager.list_keys()
    for key_info in keys:
        print(f"Key: {key_info['key_id']}")
        print(f"  Purpose: {key_info['purpose']}")
        print(f"  Status: {key_info['status']}")
        print(f"  Expires: {key_info['expires_at'][:10]}")
        print()
    
    # Demonstrate key rotation
    print("=== Key Rotation Demo ===")
    rotation_result = key_manager.rotate_key("student_records")
    print(f"Rotated {rotation_result['old_key_id']} to {rotation_result['new_key_id']}")
    
    # Show updated key list
    print("\n=== Keys After Rotation ===")
    keys = key_manager.list_keys(include_deprecated=True)
    for key_info in keys:
        status_indicator = "🔑" if key_info['status'] == 'active' else "⚠️"
        print(f"{status_indicator} {key_info['key_id']} ({key_info['status']})")

```

## Guided Example: Secure Password Manager

Let's build a complete password manager that demonstrates all cryptographic concepts.

```python-template
import json
import getpass
from datetime import datetime
import secrets
import base64

class SecurePasswordManager:
    def __init__(self, master_password=None):
        self.encryption_manager = SecureEncryptionManager()
        self.hash_manager = SecureHashingManager()
        self.key_manager = CryptographicKeyManager()
        
        self.vault_file = "password_vault.enc"
        self.master_key_id = "master_vault_key"
        self.vault_data = {}
        
        if master_password:
            self._initialize_vault(master_password)
    
    def _initialize_vault(self, master_password):
        """Initialize password vault with master password"""
        
        # Create master encryption key from password
        master_key, salt = self.encryption_manager.derive_key_from_password(master_password)
        
        # Store the key securely
        self.encryption_manager.symmetric_keys[self.master_key_id] = master_key
        
        # Store salt for future key derivation
        self.vault_salt = salt
        
        # Try to load existing vault
        self._load_vault()
    
    def unlock_vault(self, master_password):
        """Unlock vault with master password"""
        
        try:
            # Derive key from password and stored salt
            master_key, _ = self.encryption_manager.derive_key_from_password(
                master_password, self.vault_salt
            )
            
            self.encryption_manager.symmetric_keys[self.master_key_id] = master_key
            
            # Try to decrypt vault to verify password
            self._load_vault()
            return True, "Vault unlocked successfully"
            
        except Exception as e:
            return False, "Invalid master password"
    
    def add_password(self, service, username, password, notes=""):
        """Add password entry to vault"""
        
        # Generate entry ID
        entry_id = secrets.token_hex(8)
        
        # Create password entry
        entry = {
            'service': service,
            'username': username,
            'password': password,
            'notes': notes,
            'created_at': datetime.now().isoformat(),
            'last_modified': datetime.now().isoformat()
        }
        
        # Add to vault
        self.vault_data[entry_id] = entry
        
        # Save vault
        self._save_vault()
        
        return entry_id
    
    def get_password(self, entry_id):
        """Retrieve password entry from vault"""
        
        if entry_id not in self.vault_data:
            raise ValueError("Entry not found")
        
        return self.vault_data[entry_id]
    
    def list_entries(self):
        """List all password entries (without passwords)"""
        
        entries = []
        for entry_id, entry in self.vault_data.items():
            entries.append({
                'entry_id': entry_id,
                'service': entry['service'],
                'username': entry['username'],
                'created_at': entry['created_at']
            })
        
        return entries
    
    def generate_secure_password(self, length=16, include_symbols=True):
        """Generate cryptographically secure password"""
        
        # Character sets
        lowercase = 'abcdefghijklmnopqrstuvwxyz'
        uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        digits = '0123456789'
        symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
        
        # Build character set
        charset = lowercase + uppercase + digits
        if include_symbols:
            charset += symbols
        
        # Generate password ensuring at least one character from each set
        password = []
        
        # Ensure minimum complexity
        password.append(secrets.choice(lowercase))
        password.append(secrets.choice(uppercase))
        password.append(secrets.choice(digits))
        
        if include_symbols:
            password.append(secrets.choice(symbols))
        
        # Fill remaining length
        for _ in range(length - len(password)):
            password.append(secrets.choice(charset))
        
        # Shuffle the password
        secrets.SystemRandom().shuffle(password)
        
        return ''.join(password)
    
    def _save_vault(self):
        """Save encrypted vault to disk"""
        
        # Convert vault to JSON
        vault_json = json.dumps(self.vault_data, indent=2)
        
        # Encrypt vault data
        encrypted_vault = self.encryption_manager.encrypt_data(
            vault_json, self.master_key_id
        )
        
        # Save to file
        vault_container = {
            'encrypted_data': base64.b64encode(encrypted_vault['encrypted_data']).decode(),
            'salt': base64.b64encode(self.vault_salt).decode(),
            'created_at': datetime.now().isoformat()
        }
        
        with open(self.vault_file, 'w') as f:
            json.dump(vault_container, f, indent=2)
    
    def _load_vault(self):
        """Load and decrypt vault from disk"""
        
        try:
            with open(self.vault_file, 'r') as f:
                vault_container = json.load(f)
            
            # Extract encrypted data and salt
            encrypted_data = base64.b64decode(vault_container['encrypted_data'])
            self.vault_salt = base64.b64decode(vault_container['salt'])
            
            # Decrypt vault
            decrypted_json = self.encryption_manager.decrypt_data(
                encrypted_data, self.master_key_id
            )
            
            # Load vault data
            self.vault_data = json.loads(decrypted_json)
            
        except FileNotFoundError:
            # New vault
            self.vault_data = {}
        except Exception as e:
            raise ValueError(f"Could not load vault: {e}")

# Demonstration of complete password manager
def demonstrate_password_manager():
    """Demonstrate secure password manager functionality"""
    
    print("=== Secure Password Manager Demo ===")
    
    # Create password manager
    master_password = "SuperSecureMasterPassword123!"
    pm = SecurePasswordManager(master_password)
    
    # Generate and store secure passwords
    print("\n=== Adding Password Entries ===")
    
    entries = [
        ("School Email", "student@school.edu", ""),
        ("Learning Management System", "student123", ""),
        ("Library System", "student123", "Main campus library")
    ]
    
    for service, username, notes in entries:
        # Generate secure password
        secure_password = pm.generate_secure_password(length=12)
        
        # Add to vault
        entry_id = pm.add_password(service, username, secure_password, notes)
        
        print(f"Added {service}: {username}")
        print(f"  Password: {secure_password}")
        print(f"  Entry ID: {entry_id}")
        print()
    
    print("=== Vault Contents ===")
    entries = pm.list_entries()
    for entry in entries:
        print(f"Service: {entry['service']}")
        print(f"Username: {entry['username']}")
        print(f"Entry ID: {entry['entry_id']}")
        print()
    
    # Demonstrate vault security
    print("=== Testing Vault Security ===")
    
    # Save current vault
    pm._save_vault()
    
    # Create new manager instance (simulating restart)
    pm2 = SecurePasswordManager()
    
    # Try with wrong password
    unlock_result = pm2.unlock_vault("WrongPassword")
    print(f"Wrong password unlock: {unlock_result}")
    
    # Try with correct password
    unlock_result = pm2.unlock_vault(master_password)
    print(f"Correct password unlock: {unlock_result}")
    
    if unlock_result[0]:
        retrieved_entries = pm2.list_entries()
        print(f"Retrieved {len(retrieved_entries)} entries after unlock")

```

## Summary

**Cryptography provides the tools to protect data confidentiality and integrity:**

**Hashing applications:**

- **Password verification**: Store password hashes, never plain text passwords

- **Data integrity**: Detect unauthorized file or data modifications

- **Digital signatures**: Verify authenticity and non-repudiation

- **Proof of existence**: Demonstrate data existed at a specific time

**Encryption applications:**

- **Data at rest**: Protect stored files, databases, and backups

- **Data in transit**: Secure network communications and API calls

- **Confidential storage**: Encrypt sensitive application data

- **Secure messaging**: Protect private communications

**Key management essentials:**

- **Secure generation**: Use cryptographically secure random number generators

- **Safe storage**: Protect keys with appropriate access controls

- **Regular rotation**: Change keys periodically to limit exposure

- **Proper destruction**: Securely delete old keys when no longer needed

**Implementation best practices:**

- **Use established libraries**: Never implement cryptography from scratch

- **Salt all hashes**: Prevent rainbow table attacks

- **Authenticate then encrypt**: Verify integrity before processing

- **Plan for key recovery**: Ensure data isn't lost if keys are compromised

Understanding cryptography enables developers to make informed decisions about data protection and implement security controls that effectively protect sensitive information throughout its lifecycle.
