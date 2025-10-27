---
title: "17.2 Secure Execution & Resource Management"
---

# 17.2 Secure Execution & Resource Management

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Implement memory management and buffer overflow prevention techniques
    - Recognize and prevent resource exhaustion attacks (DoS)
    - Design secure file operations with proper validation and limits
    - Apply timeout and retry strategies for robust system behavior
    - Handle exceptions securely without leaking sensitive information

## Introduction

**Secure execution** means protecting your application's runtime environment from attacks that could compromise system resources, crash your application, or expose sensitive information. This involves managing memory safely, preventing resource exhaustion, securing file operations, and handling errors gracefully.

Think of it like running a restaurant kitchen:

- **Memory management**: Not leaving knives lying around (buffer overflows)

- **Resource limits**: Not letting one customer order everything on the menu (DoS prevention)

- **File security**: Checking ingredients before cooking (input validation)

- **Error handling**: Not shouting private information when something goes wrong

## Memory Management & Buffer Overflow Prevention

### Understanding Buffer Overflows

A **buffer overflow** occurs when a program writes more data to a buffer than it can hold, potentially overwriting adjacent memory. While Python manages memory automatically, understanding these concepts helps you write more secure code.

```python-template
# Dangerous pattern that could cause issues
def unsafe_string_handling():
    # This could be problematic with very large inputs
    user_input = input("Enter data: ")
    # Processing without length checks
    result = user_input * 1000000  # Could consume massive memory
    return result

# Secure approach with limits
def safe_string_handling():
    user_input = input("Enter data: ")
    
    # Validate input length
    if len(user_input) > 1000:
        raise ValueError("Input too long (max 1000 characters)")
    
    # Safe processing with reasonable limits
    if len(user_input) * 1000 > 10000:  # Reasonable output limit
        raise ValueError("Processing would exceed memory limits")
    
    result = user_input * min(1000, 10000 // len(user_input))
    return result

```

### Memory-Safe Coding Practices

```python
import sys
import tracemalloc

class SecureMemoryManager:
    def __init__(self, max_memory_mb=100):
        self.max_memory_bytes = max_memory_mb * 1024 * 1024
        
    def check_memory_usage(self):
        """Monitor current memory usage"""
        tracemalloc.start()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        
        if current > self.max_memory_bytes:
            raise MemoryError(f"Memory usage {current} exceeds limit {self.max_memory_bytes}")
        
        return current
    
    def safe_list_creation(self, size, max_size=10000):
        """Create lists with size limits"""
        if size > max_size:
            raise ValueError(f"List size {size} exceeds maximum {max_size}")
        
        # Check memory before creating large structures
        self.check_memory_usage()
        
        return [0] * size

# Example usage
memory_manager = SecureMemoryManager()

def create_safe_data_structure(user_requested_size):
    try:
        # Validate size is reasonable
        if not isinstance(user_requested_size, int) or user_requested_size < 0:
            raise ValueError("Size must be a positive integer")
        
        # Create with memory monitoring
        data = memory_manager.safe_list_creation(user_requested_size)
        print(f"Created list of size {len(data)}")
        return data
        
    except (ValueError, MemoryError) as e:
        print(f"Error creating data structure: {e}")
        return None

```

## Resource Exhaustion Attacks (DoS Prevention)

### Understanding DoS Attacks

**Denial of Service (DoS)** attacks attempt to make your application unavailable by exhausting system resources like CPU, memory, disk space, or network bandwidth.

```python
import time
import threading
from collections import defaultdict
from datetime import datetime, timedelta

class ResourceLimiter:
    def __init__(self):
        self.request_counts = defaultdict(list)
        self.max_requests_per_minute = 60
        self.max_concurrent_operations = 10
        self.active_operations = 0
        self.operation_lock = threading.Lock()
    
    def rate_limit_check(self, client_id):
        """Prevent too many requests from same client"""
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        
        # Clean old requests
        self.request_counts[client_id] = [
            req_time for req_time in self.request_counts[client_id] 
            if req_time > minute_ago
        ]
        
        # Check if over limit
        if len(self.request_counts[client_id]) >= self.max_requests_per_minute:
            raise Exception(f"Rate limit exceeded for client {client_id}")
        
        # Record this request
        self.request_counts[client_id].append(now)
    
    def acquire_operation_slot(self):
        """Limit concurrent operations"""
        with self.operation_lock:
            if self.active_operations >= self.max_concurrent_operations:
                raise Exception("Too many concurrent operations")
            self.active_operations += 1
    
    def release_operation_slot(self):
        """Release operation slot"""
        with self.operation_lock:
            self.active_operations = max(0, self.active_operations - 1)

# Example: Secure file processing endpoint
limiter = ResourceLimiter()

def secure_file_processor(client_id, file_data):
    try:
        # Check rate limits
        limiter.rate_limit_check(client_id)
        
        # Acquire processing slot
        limiter.acquire_operation_slot()
        
        # Validate file size
        if len(file_data) > 10 * 1024 * 1024:  # 10MB limit
            raise ValueError("File too large")
        
        # Process with timeout
        return process_file_with_timeout(file_data, timeout_seconds=30)
        
    except Exception as e:
        print(f"Processing failed for client {client_id}: {e}")
        return None
    finally:
        # Always release the slot
        limiter.release_operation_slot()

def process_file_with_timeout(file_data, timeout_seconds):
    """Process file with timeout to prevent hanging"""
    import signal
    
    def timeout_handler(signum, frame):
        raise TimeoutError("File processing timed out")
    
    # Set timeout (Unix/Linux only - for Windows, use threading.Timer)
    old_handler = signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeout_seconds)
    
    try:
        # Simulate file processing
        lines = file_data.decode('utf-8').split('\n')
        processed_lines = []
        
        for line in lines:
            # Simulate processing time
            time.sleep(0.001)  # Small delay
            processed_lines.append(line.upper())
        
        return '\n'.join(processed_lines)
    
    finally:
        # Clear timeout
        signal.alarm(0)
        signal.signal(signal.SIGALRM, old_handler)

```

### CPU and Memory Protection

```python
import resource
import psutil
import os

class SystemResourceMonitor:
    def __init__(self, max_cpu_percent=80, max_memory_percent=80):
        self.max_cpu_percent = max_cpu_percent
        self.max_memory_percent = max_memory_percent
    
    def check_system_resources(self):
        """Monitor system resource usage"""
        # Check CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        if cpu_percent > self.max_cpu_percent:
            raise SystemError(f"CPU usage {cpu_percent}% exceeds limit {self.max_cpu_percent}%")
        
        # Check memory usage
        memory = psutil.virtual_memory()
        if memory.percent > self.max_memory_percent:
            raise SystemError(f"Memory usage {memory.percent}% exceeds limit {self.max_memory_percent}%")
    
    def set_process_limits(self):
        """Set resource limits for current process"""
        try:
            # Limit memory usage to 500MB
            resource.setrlimit(resource.RLIMIT_AS, (500 * 1024 * 1024, 500 * 1024 * 1024))
            
            # Limit CPU time to 60 seconds
            resource.setrlimit(resource.RLIMIT_CPU, (60, 60))
            
            print("Process resource limits set")
        except (OSError, AttributeError) as e:
            print(f"Could not set resource limits: {e}")

# Example: Protected computation
monitor = SystemResourceMonitor()

def secure_computation(data):
    """Perform computation with resource monitoring"""
    try:
        # Set process limits
        monitor.set_process_limits()
        
        # Check system resources before starting
        monitor.check_system_resources()
        
        # Perform computation with periodic checks
        result = []
        for i, item in enumerate(data):
            # Check resources periodically
            if i % 1000 == 0:
                monitor.check_system_resources()
            
            # Simulate computation
            result.append(item ** 2)
        
        return result
    
    except (SystemError, MemoryError) as e:
        print(f"Computation aborted due to resource limits: {e}")
        return None

```

## Secure File Operations

### Safe File Handling

File operations are common attack vectors. Always validate paths, check file sizes, and limit file types.

```python
import os
import tempfile
import mimetypes
from pathlib import Path

class SecureFileHandler:
    def __init__(self, upload_dir="/tmp/uploads", max_file_size=10*1024*1024):
        self.upload_dir = Path(upload_dir)
        self.max_file_size = max_file_size
        self.allowed_extensions = {'.txt', '.pdf', '.jpg', '.png', '.doc', '.docx'}
        self.upload_dir.mkdir(exist_ok=True)
    
    def validate_filename(self, filename):
        """Validate filename for security"""
        # Check for directory traversal attempts
        if '..' in filename or '/' in filename or '\\' in filename:
            raise ValueError("Invalid filename: contains directory traversal")
        
        # Check for null bytes
        if '\x00' in filename:
            raise ValueError("Invalid filename: contains null bytes")
        
        # Check extension
        file_path = Path(filename)
        if file_path.suffix.lower() not in self.allowed_extensions:
            raise ValueError(f"File type not allowed: {file_path.suffix}")
        
        # Check length
        if len(filename) > 255:
            raise ValueError("Filename too long")
        
        return True
    
    def validate_file_content(self, file_path):
        """Validate file content matches extension"""
        mime_type, _ = mimetypes.guess_type(file_path)
        
        # Read file header to verify type
        with open(file_path, 'rb') as f:
            header = f.read(512)
        
        # Check for script content in text files
        if mime_type and mime_type.startswith('text/'):
            text_content = header.decode('utf-8', errors='ignore')
            dangerous_patterns = ['<script', '<?php', '<%', 'javascript:']
            for pattern in dangerous_patterns:
                if pattern.lower() in text_content.lower():
                    raise ValueError(f"Dangerous content detected: {pattern}")
        
        return True
    
    def secure_file_upload(self, filename, file_content):
        """Securely handle file upload"""
        try:
            # Validate filename
            self.validate_filename(filename)
            
            # Check file size
            if len(file_content) > self.max_file_size:
                raise ValueError(f"File too large: {len(file_content)} bytes")
            
            # Generate safe filename
            safe_filename = self.generate_safe_filename(filename)
            file_path = self.upload_dir / safe_filename
            
            # Write file securely
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file_content)
                temp_path = temp_file.name
            
            # Validate content
            self.validate_file_content(temp_path)
            
            # Move to final location
            os.rename(temp_path, file_path)
            
            # Set secure permissions (readable only by owner)
            os.chmod(file_path, 0o600)
            
            return str(file_path)
        
        except Exception as e:
            # Clean up temp file if it exists
            if 'temp_path' in locals() and os.path.exists(temp_path):
                os.unlink(temp_path)
            raise e
    
    def generate_safe_filename(self, original_filename):
        """Generate a safe filename"""
        import uuid
        import time
        
        # Keep extension but generate new name
        file_path = Path(original_filename)
        timestamp = int(time.time())
        unique_id = str(uuid.uuid4())[:8]
        
        return f"{timestamp}_{unique_id}{file_path.suffix}"
    
    def secure_file_read(self, filename, max_read_size=1024*1024):
        """Securely read file with size limits"""
        file_path = self.upload_dir / filename
        
        # Validate path is within upload directory
        if not str(file_path.resolve()).startswith(str(self.upload_dir.resolve())):
            raise ValueError("Invalid file path: outside upload directory")
        
        # Check file exists
        if not file_path.exists():
            raise FileNotFoundError("File not found")
        
        # Check file size
        file_size = file_path.stat().st_size
        if file_size > max_read_size:
            raise ValueError(f"File too large to read: {file_size} bytes")
        
        # Read file safely
        with open(file_path, 'rb') as f:
            return f.read(max_read_size)

# Example usage
file_handler = SecureFileHandler()

def handle_user_upload(filename, file_data):
    """Handle file upload from user"""
    try:
        saved_path = file_handler.secure_file_upload(filename, file_data)
        print(f"File uploaded successfully: {saved_path}")
        return saved_path
    except Exception as e:
        print(f"Upload failed: {e}")
        return None

```

## Timeout and Retry Strategies

### Implementing Robust Timeouts

```python
import time
import random
from functools import wraps
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

class TimeoutManager:
    @staticmethod
    def timeout_decorator(timeout_seconds):
        """Decorator to add timeout to functions"""
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                with ThreadPoolExecutor(max_workers=1) as executor:
                    future = executor.submit(func, *args, **kwargs)
                    try:
                        return future.result(timeout=timeout_seconds)
                    except FuturesTimeoutError:
                        raise TimeoutError(f"Function {func.__name__} timed out after {timeout_seconds}s")
            return wrapper
        return decorator
    
    @staticmethod
    def retry_with_backoff(max_retries=3, base_delay=1, max_delay=60):
        """Decorator for retry logic with exponential backoff"""
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                for attempt in range(max_retries + 1):
                    try:
                        return func(*args, **kwargs)
                    except Exception as e:
                        if attempt == max_retries:
                            raise e
                        
                        # Calculate delay with exponential backoff and jitter
                        delay = min(base_delay * (2 ** attempt), max_delay)
                        jitter = random.uniform(0, delay * 0.1)
                        total_delay = delay + jitter
                        
                        print(f"Attempt {attempt + 1} failed: {e}. Retrying in {total_delay:.2f}s")
                        time.sleep(total_delay)
                
                raise Exception(f"All {max_retries + 1} attempts failed")
            return wrapper
        return decorator

# Example: Network operation with timeout and retry
@TimeoutManager.timeout_decorator(10)  # 10 second timeout
@TimeoutManager.retry_with_backoff(max_retries=3, base_delay=2)
def fetch_data_from_api(url):
    """Simulate API call with potential failures"""
    import requests
    
    # Simulate random failures for demonstration
    if random.random() < 0.3:  # 30% chance of failure
        raise requests.RequestException("Simulated network error")
    
    # Simulate slow response
    time.sleep(random.uniform(1, 5))
    
    return {"data": "API response", "url": url}

# Example: Database operation with circuit breaker pattern
class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
    
    def call(self, func, *args, **kwargs):
        """Execute function with circuit breaker protection"""
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.reset_timeout:
                self.state = 'HALF_OPEN'
                self.failure_count = 0
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self.failure_count = 0
            self.state = 'CLOSED'
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = 'OPEN'
            
            raise e

# Usage example
circuit_breaker = CircuitBreaker()

def database_query(query):
    """Simulate database query"""
    if random.random() < 0.4:  # 40% failure rate
        raise Exception("Database connection failed")
    return f"Result for: {query}"

def safe_database_call(query):
    """Database call protected by circuit breaker"""
    try:
        return circuit_breaker.call(database_query, query)
    except Exception as e:
        print(f"Database call failed: {e}")
        return None

```

## Exception Handling Security

### Secure Error Handling

```python
import logging
import traceback
import sys

class SecureErrorHandler:
    def __init__(self, debug_mode=False):
        self.debug_mode = debug_mode
        self.logger = self.setup_logging()
    
    def setup_logging(self):
        """Configure secure logging"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('app_errors.log'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        return logging.getLogger(__name__)
    
    def handle_error(self, e, context="Unknown"):
        """Handle errors securely without information leakage"""
        # Log full error details securely
        error_id = self.generate_error_id()
        self.logger.error(f"Error ID {error_id} in {context}: {str(e)}")
        
        if self.debug_mode:
            self.logger.error(f"Full traceback for {error_id}: {traceback.format_exc()}")
        
        # Return sanitized error message
        return self.sanitize_error_message(e, error_id)
    
    def generate_error_id(self):
        """Generate unique error ID for tracking"""
        import uuid
        return str(uuid.uuid4())[:8]
    
    def sanitize_error_message(self, error, error_id):
        """Return safe error message for users"""
        # Define safe error messages
        safe_messages = {
            ValueError: "Invalid input provided",
            FileNotFoundError: "Requested resource not found",
            PermissionError: "Access denied",
            TimeoutError: "Operation timed out",
            MemoryError: "Insufficient resources",
            ConnectionError: "Service temporarily unavailable"
        }
        
        error_type = type(error)
        safe_message = safe_messages.get(error_type, "An unexpected error occurred")
        
        return {
            "error": safe_message,
            "error_id": error_id,
            "timestamp": time.time()
        }

# Example: Secure API endpoint
error_handler = SecureErrorHandler(debug_mode=False)

def secure_api_endpoint(user_id, operation):
    """Example API endpoint with secure error handling"""
    try:
        # Validate input
        if not isinstance(user_id, int) or user_id <= 0:
            raise ValueError("Invalid user ID")
        
        # Simulate various potential errors
        if operation == "timeout":
            time.sleep(10)  # This would trigger timeout
        elif operation == "file_error":
            open("nonexistent_file.txt", 'r')
        elif operation == "permission_error":
            open("/root/secret.txt", 'r')
        elif operation == "memory_error":
            huge_list = [0] * (10**9)  # Trigger memory error
        
        return {"success": True, "data": f"Operation {operation} completed"}
    
    except Exception as e:
        error_response = error_handler.handle_error(e, f"API endpoint for user {user_id}")
        return {"success": False, **error_response}

# Example: Input validation with secure errors
def validate_user_input(data):
    """Validate user input with secure error messages"""
    try:
        if not isinstance(data, dict):
            raise ValueError("Input must be a dictionary")
        
        required_fields = ['username', 'email', 'age']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate email format
        email = data['email']
        if '@' not in email or '.' not in email:
            raise ValueError("Invalid email format")
        
        # Validate age
        age = data['age']
        if not isinstance(age, int) or age < 0 or age > 150:
            raise ValueError("Invalid age")
        
        return True
    
    except Exception as e:
        error_response = error_handler.handle_error(e, "Input validation")
        # Don't reveal which specific validation failed
        return {"valid": False, "message": "Invalid input provided"}

```

## Practical Example: Secure File Upload System

Let's build a complete secure file upload system that demonstrates all these concepts:

```python
import os
import hashlib
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import threading

class SecureFileUploadSystem:
    def __init__(self, upload_dir="./secure_uploads", max_file_size=5*1024*1024):
        self.upload_dir = Path(upload_dir)
        self.max_file_size = max_file_size
        self.upload_dir.mkdir(exist_ok=True)
        
        # Resource management
        self.limiter = ResourceLimiter()
        self.error_handler = SecureErrorHandler()
        self.file_handler = SecureFileHandler(str(self.upload_dir), max_file_size)
        
        # Track active uploads
        self.active_uploads = {}
        self.upload_lock = threading.Lock()
    
    def upload_file(self, client_id, filename, file_content):
        """Main upload endpoint with all security measures"""
        upload_id = self.generate_upload_id()
        
        try:
            # Rate limiting
            self.limiter.rate_limit_check(client_id)
            
            # Resource slot management
            self.limiter.acquire_operation_slot()
            
            # Track upload
            with self.upload_lock:
                self.active_uploads[upload_id] = {
                    'client_id': client_id,
                    'filename': filename,
                    'start_time': time.time(),
                    'status': 'processing'
                }
            
            # Process with timeout
            result = self.process_upload_with_timeout(filename, file_content, timeout=30)
            
            # Update status
            with self.upload_lock:
                self.active_uploads[upload_id]['status'] = 'completed'
            
            return {
                "success": True,
                "upload_id": upload_id,
                "file_path": result
            }
        
        except Exception as e:
            # Secure error handling
            error_response = self.error_handler.handle_error(e, f"File upload for client {client_id}")
            
            # Update status
            with self.upload_lock:
                if upload_id in self.active_uploads:
                    self.active_uploads[upload_id]['status'] = 'failed'
            
            return {"success": False, **error_response}
        
        finally:
            # Always release resources
            self.limiter.release_operation_slot()
    
    @TimeoutManager.timeout_decorator(30)
    def process_upload_with_timeout(self, filename, file_content):
        """Process upload with timeout protection"""
        # Secure file handling
        saved_path = self.file_handler.secure_file_upload(filename, file_content)
        
        # Generate file hash for integrity
        file_hash = self.generate_file_hash(saved_path)
        
        # Store metadata
        self.store_file_metadata(saved_path, file_hash)
        
        return saved_path
    
    def generate_upload_id(self):
        """Generate unique upload ID"""
        import uuid
        return str(uuid.uuid4())
    
    def generate_file_hash(self, file_path):
        """Generate SHA-256 hash of file"""
        hasher = hashlib.sha256()
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    
    def store_file_metadata(self, file_path, file_hash):
        """Store file metadata securely"""
        metadata = {
            'path': str(file_path),
            'hash': file_hash,
            'upload_time': time.time(),
            'size': os.path.getsize(file_path)
        }
        
        # Store in secure metadata file
        metadata_path = Path(file_path).with_suffix('.metadata')
        with open(metadata_path, 'w') as f:
            import json
            json.dump(metadata, f)
        
        # Set secure permissions
        os.chmod(metadata_path, 0o600)
    
    def get_upload_status(self, upload_id):
        """Check upload status"""
        with self.upload_lock:
            return self.active_uploads.get(upload_id, {"status": "not_found"})

# Example usage
upload_system = SecureFileUploadSystem()

def demo_secure_upload():
    """Demonstrate secure file upload"""
    # Simulate file upload
    test_content = b"This is a test file content for secure upload demo."
    
    result = upload_system.upload_file(
        client_id="user123",
        filename="test_document.txt",
        file_content=test_content
    )
    
    print("Upload result:", result)
    
    if result["success"]:
        status = upload_system.get_upload_status(result["upload_id"])
        print("Upload status:", status)

if __name__ == "__main__":
    demo_secure_upload()

```

## Security Best Practices Summary

### Memory Management

- Always validate input sizes before processing

- Set reasonable limits on data structures

- Monitor memory usage during operations

- Use appropriate data types for the task

### Resource Protection

- Implement rate limiting for user requests

- Set timeouts on all operations

- Use circuit breakers for external dependencies

- Monitor system resource usage

### File Security

- Validate all file inputs (name, size, type, content)

- Use temporary files during processing

- Set appropriate file permissions

- Store files outside web-accessible directories

### Error Handling

- Never expose sensitive information in error messages

- Log detailed errors securely for debugging

- Provide generic error messages to users

- Use unique error IDs for tracking

### Timeout Strategies

- Set reasonable timeouts for all operations

- Implement retry logic with exponential backoff

- Use circuit breakers for failing services

- Monitor and alert on timeout patterns

## Key Takeaways

1. **Defense in Depth**: Layer multiple security measures rather than relying on a single control

2. **Fail Securely**: When something goes wrong, fail in a way that maintains security

3. **Resource Limits**: Always set reasonable limits on resource consumption

4. **Monitoring**: Log security events and monitor for unusual patterns

5. **User Experience**: Balance security with usability - security that's too restrictive will be bypassed
