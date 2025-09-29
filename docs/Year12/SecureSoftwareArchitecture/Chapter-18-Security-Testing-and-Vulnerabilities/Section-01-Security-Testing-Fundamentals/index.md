# 18.1 Security Testing Fundamentals

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Understand and implement Static Application Security Testing (SAST)
    - Apply Dynamic Application Security Testing (DAST) techniques
    - Conduct effective manual code review for security vulnerabilities
    - Use common vulnerability scanning tools and interpret results
    - Design and implement security regression testing strategies

## Introduction

**Security testing** is the systematic process of finding and fixing security vulnerabilities in applications before they reach production. Unlike functional testing that verifies what an application does, security testing examines what an application *shouldn't* do and how it behaves under attack.

Think of security testing like testing a fortress:

- **Static testing (SAST)**: Examining the blueprint for weak walls

- **Dynamic testing (DAST)**: Attacking the fortress while it's running

- **Manual review**: Expert inspection of critical areas

- **Vulnerability scanning**: Using tools to find known weaknesses

- **Regression testing**: Ensuring repairs don't create new holes

Security testing should be integrated throughout the development lifecycle, not just performed at the end.

## Static Application Security Testing (SAST)

### Understanding SAST

**Static Application Security Testing (SAST)** analyzes source code, bytecode, or binary code without executing the application. It's like reviewing architectural plans before building a house.

### Benefits and Limitations

**Benefits:**

- Finds vulnerabilities early in development

- Analyzes 100% of code paths

- No need for running application

- Can identify root causes in code

**Limitations:**

- Can produce false positives

- May miss runtime vulnerabilities

- Requires access to source code

- Context-dependent issues may be missed

### Python SAST Implementation

```python
import ast
import re
from pathlib import Path
from typing import List, Dict, Any

class SecurityCodeAnalyzer:
    def __init__(self):
        # Define security anti-patterns
        self.security_patterns = {
            'sql_injection': [
                r'cursor\.execute\s*\(\s*["\'].*%.*["\']',
                r'cursor\.execute\s*\(\s*.*\+.*\)',
                r'\.format\s*\(.*\).*execute',
            ],
            'hardcoded_secrets': [
                r'password\s*=\s*["\'][^"\']+["\']',
                r'api_key\s*=\s*["\'][^"\']+["\']',
                r'secret\s*=\s*["\'][^"\']+["\']',
            ],
            'unsafe_eval': [
                r'eval\s*\(',
                r'exec\s*\(',
                r'compile\s*\(',
            ],
            'weak_crypto': [
                r'md5\s*\(',
                r'sha1\s*\(',
                r'DES\s*\(',
            ],
            'unsafe_file_ops': [
                r'open\s*\(\s*.*input.*\)',
                r'file\s*=.*input.*',
            ]
        }
    
    def analyze_file(self, file_path: str) -> List[Dict[str, Any]]:
        """Analyze a Python file for security vulnerabilities"""
        vulnerabilities = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
            
            # Pattern-based analysis
            for vuln_type, patterns in self.security_patterns.items():
                for pattern in patterns:
                    matches = re.finditer(pattern, content, re.IGNORECASE)
                    for match in matches:
                        line_num = content[:match.start()].count('\n') + 1
                        vulnerabilities.append({
                            'type': vuln_type,
                            'line': line_num,
                            'code': lines[line_num - 1].strip(),
                            'severity': self.get_severity(vuln_type),
                            'description': self.get_description(vuln_type)
                        })
            
            # AST-based analysis
            try:
                tree = ast.parse(content)
                ast_vulnerabilities = self.analyze_ast(tree, lines)
                vulnerabilities.extend(ast_vulnerabilities)
            except SyntaxError as e:
                vulnerabilities.append({
                    'type': 'syntax_error',
                    'line': e.lineno or 0,
                    'code': '',
                    'severity': 'low',
                    'description': f'Syntax error: {e.msg}'
                })
        
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
        
        return vulnerabilities
    
    def analyze_ast(self, tree: ast.AST, lines: List[str]) -> List[Dict[str, Any]]:
        """Analyze AST for security vulnerabilities"""
        vulnerabilities = []
        
        for node in ast.walk(tree):
            # Check for dangerous function calls
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    func_name = node.func.id
                    if func_name in ['eval', 'exec', 'compile']:
                        vulnerabilities.append({
                            'type': 'dangerous_function',
                            'line': node.lineno,
                            'code': lines[node.lineno - 1].strip() if node.lineno <= len(lines) else '',
                            'severity': 'high',
                            'description': f'Dangerous function call: {func_name}'
                        })
            
            # Check for assert statements (should not be used for security)
            if isinstance(node, ast.Assert):
                vulnerabilities.append({
                    'type': 'security_assert',
                    'line': node.lineno,
                    'code': lines[node.lineno - 1].strip() if node.lineno <= len(lines) else '',
                    'severity': 'medium',
                    'description': 'Assert statements are removed in optimized Python'
                })
        
        return vulnerabilities
    
    def get_severity(self, vuln_type: str) -> str:
        """Get severity level for vulnerability type"""
        severity_map = {
            'sql_injection': 'critical',
            'hardcoded_secrets': 'high',
            'unsafe_eval': 'high',
            'weak_crypto': 'medium',
            'unsafe_file_ops': 'medium'
        }
        return severity_map.get(vuln_type, 'low')
    
    def get_description(self, vuln_type: str) -> str:
        """Get description for vulnerability type"""
        descriptions = {
            'sql_injection': 'Potential SQL injection vulnerability',
            'hardcoded_secrets': 'Hardcoded credentials detected',
            'unsafe_eval': 'Use of dangerous eval/exec functions',
            'weak_crypto': 'Weak cryptographic algorithm',
            'unsafe_file_ops': 'Unsafe file operations with user input'
        }
        return descriptions.get(vuln_type, 'Unknown vulnerability')
    
    def generate_report(self, vulnerabilities: List[Dict[str, Any]], file_path: str) -> str:
        """Generate security analysis report"""
        if not vulnerabilities:
            return f"✅ No security issues found in {file_path}"
        
        report = [f"\n🔍 Security Analysis Report for {file_path}"]
        report.append("=" * 60)
        
        # Group by severity
        by_severity = {}
        for vuln in vulnerabilities:
            severity = vuln['severity']
            if severity not in by_severity:
                by_severity[severity] = []
            by_severity[severity].append(vuln)
        
        severity_order = ['critical', 'high', 'medium', 'low']
        for severity in severity_order:
            if severity in by_severity:
                report.append(f"\n{severity.upper()} SEVERITY:")
                for vuln in by_severity[severity]:
                    report.append(f"  Line {vuln['line']}: {vuln['description']}")
                    report.append(f"    Code: {vuln['code']}")
                    report.append("")
        
        return "\n".join(report)

# Example usage
def demo_sast_analysis():
    """Demonstrate SAST analysis"""
    analyzer = SecurityCodeAnalyzer()
    
    # Create a vulnerable code sample
    vulnerable_code = '''
import sqlite3
import hashlib

# Vulnerable SQL query
def get_user(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # SQL Injection vulnerability
    query = "SELECT * FROM users WHERE username = '%s'" % username
    cursor.execute(query)
    return cursor.fetchone()

# Hardcoded credentials
API_KEY = "sk-1234567890abcdef"
password = "admin123"

# Weak cryptography
def hash_password(pwd):
    return hashlib.md5(pwd.encode()).hexdigest()

# Dangerous eval usage
def calculate(expression):
    return eval(expression)

# Security assert (bad practice)
def check_admin(user):
    assert user.is_admin, "Not admin"
    return True
'''
    
    # Write to temporary file
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(vulnerable_code)
        temp_file = f.name
    
    # Analyze the code
    vulnerabilities = analyzer.analyze_file(temp_file)
    report = analyzer.generate_report(vulnerabilities, temp_file)
    print(report)
    
    # Clean up
    import os
    os.unlink(temp_file)

if __name__ == "__main__":
    demo_sast_analysis()

```

### Secure Code Example

Here's how to fix the vulnerabilities found:

```python
import sqlite3
import hashlib
import secrets
import os
from cryptography.fernet import Fernet

# Secure SQL query with parameterized statements
def get_user_secure(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # Parameterized query prevents SQL injection
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    return cursor.fetchone()

# Secure credential management
API_KEY = os.environ.get('API_KEY')  # Get from environment
if not API_KEY:
    raise ValueError("API_KEY environment variable not set")

# Strong cryptography
def hash_password_secure(password):
    # Use a strong hashing algorithm with salt
    salt = secrets.token_bytes(32)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt + pwd_hash

# Safe expression evaluation (if needed)
def calculate_safe(expression):
    # Use ast.literal_eval for safe evaluation
    import ast
    try:
        # Only allow literals (numbers, strings, etc.)
        return ast.literal_eval(expression)
    except (ValueError, SyntaxError):
        raise ValueError("Invalid expression")

# Proper error handling instead of asserts
def check_admin_secure(user):
    if not hasattr(user, 'is_admin') or not user.is_admin:
        raise PermissionError("Admin access required")
    return True

```

## Dynamic Application Security Testing (DAST)

### Understanding DAST

**Dynamic Application Security Testing (DAST)** tests running applications by simulating attacks from the outside. It's like trying to break into a building while security is active.

### DAST Implementation

```python
import requests
import time
import json
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Any

class WebApplicationScanner:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.vulnerabilities = []
        
        # Common attack payloads
        self.sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT 1,2,3 --",
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
        
        self.command_injection_payloads = [
            "; ls -la",
            "| whoami",
            "& dir",
            "`id`",
            "$(whoami)"
        ]
    
    def test_sql_injection(self, url: str, params: Dict[str, str]) -> List[Dict[str, Any]]:
        """Test for SQL injection vulnerabilities"""
        vulnerabilities = []
        
        for param_name, param_value in params.items():
            for payload in self.sql_payloads:
                test_params = params.copy()
                test_params[param_name] = payload
                
                try:
                    response = self.session.get(url, params=test_params, timeout=10)
                    
                    # Check for SQL error indicators
                    sql_errors = [
                        'sql syntax',
                        'mysql_fetch',
                        'postgresql',
                        'sqlite_master',
                        'ora-00900',
                        'microsoft jet database'
                    ]
                    
                    response_text = response.text.lower()
                    for error in sql_errors:
                        if error in response_text:
                            vulnerabilities.append({
                                'type': 'sql_injection',
                                'url': url,
                                'parameter': param_name,
                                'payload': payload,
                                'severity': 'critical',
                                'evidence': f'SQL error detected: {error}'
                            })
                            break
                
                except requests.RequestException as e:
                    print(f"Request failed: {e}")
        
        return vulnerabilities
    
    def test_xss(self, url: str, params: Dict[str, str]) -> List[Dict[str, Any]]:
        """Test for Cross-Site Scripting vulnerabilities"""
        vulnerabilities = []
        
        for param_name, param_value in params.items():
            for payload in self.xss_payloads:
                test_params = params.copy()
                test_params[param_name] = payload
                
                try:
                    response = self.session.get(url, params=test_params, timeout=10)
                    
                    # Check if payload is reflected in response
                    if payload in response.text:
                        vulnerabilities.append({
                            'type': 'xss_reflected',
                            'url': url,
                            'parameter': param_name,
                            'payload': payload,
                            'severity': 'high',
                            'evidence': 'Payload reflected in response'
                        })
                
                except requests.RequestException as e:
                    print(f"Request failed: {e}")
        
        return vulnerabilities
    
    def test_security_headers(self, url: str) -> List[Dict[str, Any]]:
        """Test for missing security headers"""
        vulnerabilities = []
        
        try:
            response = self.session.get(url, timeout=10)
            headers = response.headers
            
            # Important security headers
            security_headers = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': ['DENY', 'SAMEORIGIN'],
                'X-XSS-Protection': '1; mode=block',
                'Strict-Transport-Security': 'max-age=',
                'Content-Security-Policy': 'default-src'
            }
            
            for header, expected in security_headers.items():
                if header not in headers:
                    vulnerabilities.append({
                        'type': 'missing_security_header',
                        'url': url,
                        'header': header,
                        'severity': 'medium',
                        'evidence': f'Missing {header} header'
                    })
                elif isinstance(expected, list):
                    if not any(exp in headers[header] for exp in expected):
                        vulnerabilities.append({
                            'type': 'weak_security_header',
                            'url': url,
                            'header': header,
                            'severity': 'medium',
                            'evidence': f'Weak {header}: {headers[header]}'
                        })
                elif expected not in headers.get(header, ''):
                    vulnerabilities.append({
                        'type': 'weak_security_header',
                        'url': url,
                        'header': header,
                        'severity': 'medium',
                        'evidence': f'Weak {header}: {headers.get(header, "None")}'
                    })
        
        except requests.RequestException as e:
            print(f"Request failed: {e}")
        
        return vulnerabilities
    
    def test_information_disclosure(self, url: str) -> List[Dict[str, Any]]:
        """Test for information disclosure vulnerabilities"""
        vulnerabilities = []
        
        # Test for common sensitive files
        sensitive_paths = [
            '/robots.txt',
            '/.git/config',
            '/config.php',
            '/backup.sql',
            '/.env',
            '/admin',
            '/phpmyadmin',
            '/wp-admin'
        ]
        
        for path in sensitive_paths:
            test_url = urljoin(url, path)
            try:
                response = self.session.get(test_url, timeout=10)
                if response.status_code == 200:
                    vulnerabilities.append({
                        'type': 'information_disclosure',
                        'url': test_url,
                        'severity': 'medium',
                        'evidence': f'Accessible file: {path}'
                    })
            except requests.RequestException:
                pass
        
        return vulnerabilities
    
    def scan_endpoint(self, url: str, params: Dict[str, str] = None) -> List[Dict[str, Any]]:
        """Comprehensive scan of a single endpoint"""
        if params is None:
            params = {'id': '1', 'search': 'test'}
        
        vulnerabilities = []
        
        print(f"Scanning {url}...")
        
        # Test various vulnerability types
        vulnerabilities.extend(self.test_sql_injection(url, params))
        vulnerabilities.extend(self.test_xss(url, params))
        vulnerabilities.extend(self.test_security_headers(url))
        vulnerabilities.extend(self.test_information_disclosure(url))
        
        return vulnerabilities
    
    def generate_report(self, vulnerabilities: List[Dict[str, Any]]) -> str:
        """Generate DAST scan report"""
        if not vulnerabilities:
            return "✅ No vulnerabilities found in DAST scan"
        
        report = ["\n🔍 Dynamic Security Scan Report"]
        report.append("=" * 50)
        
        # Group by severity
        by_severity = {}
        for vuln in vulnerabilities:
            severity = vuln['severity']
            if severity not in by_severity:
                by_severity[severity] = []
            by_severity[severity].append(vuln)
        
        severity_order = ['critical', 'high', 'medium', 'low']
        for severity in severity_order:
            if severity in by_severity:
                report.append(f"\n{severity.upper()} SEVERITY ({len(by_severity[severity])} issues):")
                for vuln in by_severity[severity]:
                    report.append(f"  {vuln['type'].replace('_', ' ').title()}")
                    report.append(f"    URL: {vuln.get('url', 'N/A')}")
                    if 'parameter' in vuln:
                        report.append(f"    Parameter: {vuln['parameter']}")
                    report.append(f"    Evidence: {vuln['evidence']}")
                    report.append("")
        
        return "\n".join(report)

# Example usage
def demo_dast_scan():
    """Demonstrate DAST scanning"""
    # Note: This is for demonstration only
    # In practice, only scan applications you own or have permission to test
    
    scanner = WebApplicationScanner("http://localhost:8000")
    
    # Scan multiple endpoints
    test_endpoints = [
        ("http://localhost:8000/search", {"q": "test"}),
        ("http://localhost:8000/user", {"id": "1"}),
        ("http://localhost:8000/login", {"username": "admin", "password": "test"}),
    ]
    
    all_vulnerabilities = []
    for url, params in test_endpoints:
        vulnerabilities = scanner.scan_endpoint(url, params)
        all_vulnerabilities.extend(vulnerabilities)
    
    report = scanner.generate_report(all_vulnerabilities)
    print(report)

if __name__ == "__main__":
    demo_dast_scan()

```

## Manual Code Review Techniques

### Security-Focused Code Review

Manual code review remains one of the most effective ways to find complex security vulnerabilities that automated tools miss.

```python
class SecurityCodeReviewGuide:
    def __init__(self):
        self.review_checklist = {
            'authentication': [
                'Are passwords hashed with strong algorithms?',
                'Is session management secure?',
                'Are there proper login attempt limits?',
                'Is multi-factor authentication considered?'
            ],
            'authorization': [
                'Are access controls properly implemented?',
                'Is privilege escalation prevented?',
                'Are default permissions restrictive?',
                'Is authorization checked on every request?'
            ],
            'input_validation': [
                'Is all user input validated?',
                'Are whitelists used instead of blacklists?',
                'Is input sanitized for output context?',
                'Are file uploads properly restricted?'
            ],
            'data_protection': [
                'Is sensitive data encrypted at rest?',
                'Is data encrypted in transit?',
                'Are database queries parameterized?',
                'Is PII properly handled?'
            ],
            'error_handling': [
                'Do error messages avoid information leakage?',
                'Are errors logged for security monitoring?',
                'Is graceful degradation implemented?',
                'Are sensitive operations properly audited?'
            ],
            'configuration': [
                'Are default credentials changed?',
                'Are unnecessary services disabled?',
                'Is debug mode disabled in production?',
                'Are security headers configured?'
            ]
        }
    
    def review_function(self, func_code: str, func_name: str) -> List[str]:
        """Review a function for security issues"""
        issues = []
        
        # Check for common security anti-patterns
        if 'eval(' in func_code or 'exec(' in func_code:
            issues.append(f"{func_name}: Uses dangerous eval/exec functions")
        
        if re.search(r'password.*=.*["\'][^"\']+["\']', func_code):
            issues.append(f"{func_name}: Contains hardcoded passwords")
        
        if re.search(r'cursor\.execute.*%.*', func_code):
            issues.append(f"{func_name}: Potential SQL injection vulnerability")
        
        if 'pickle.loads(' in func_code:
            issues.append(f"{func_name}: Unsafe deserialization with pickle")
        
        if re.search(r'open\s*\(.*input.*\)', func_code):
            issues.append(f"{func_name}: Unsafe file operations with user input")
        
        return issues
    
    def generate_review_report(self, code_file: str) -> str:
        """Generate comprehensive security review report"""
        try:
            with open(code_file, 'r') as f:
                content = f.read()
            
            # Parse functions
            tree = ast.parse(content)
            functions = [node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
            
            report = [f"\n🔍 Security Code Review: {code_file}"]
            report.append("=" * 60)
            
            all_issues = []
            for func in functions:
                func_code = ast.get_source_segment(content, func)
                if func_code:
                    issues = self.review_function(func_code, func.name)
                    all_issues.extend(issues)
            
            if all_issues:
                report.append("\n❌ SECURITY ISSUES FOUND:")
                for issue in all_issues:
                    report.append(f"  • {issue}")
            else:
                report.append("\n✅ No obvious security issues found")
            
            # Add checklist
            report.append("\n📋 MANUAL REVIEW CHECKLIST:")
            for category, items in self.review_checklist.items():
                report.append(f"\n{category.upper().replace('_', ' ')}:")
                for item in items:
                    report.append(f"  □ {item}")
            
            return "\n".join(report)
        
        except Exception as e:
            return f"Error reviewing {code_file}: {e}"

# Example usage
reviewer = SecurityCodeReviewGuide()

# Example function to review
example_code = '''
def login(username, password):
    # Bad: SQL injection vulnerability
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)
    
    # Bad: Hardcoded credentials
    admin_password = "admin123"
    
    # Bad: Unsafe eval
    if username == "admin":
        eval(f"print('Welcome {username}')")
    
    return True
'''

print(reviewer.review_function(example_code, "login"))

```

## Common Vulnerability Scanning

### Vulnerability Scanner Implementation

```python
import re
import hashlib
from pathlib import Path
from typing import Dict, List, Tuple

class VulnerabilityScanner:
    def __init__(self):
        # OWASP Top 10 vulnerability patterns
        self.vulnerability_patterns = {
            'A01_broken_access_control': {
                'patterns': [
                    r'if.*user\.is_admin.*:.*return.*',
                    r'@login_required.*\n.*def.*admin.*',
                    r'session\[.*admin.*\]',
                ],
                'severity': 'high',
                'description': 'Potential broken access control'
            },
            'A02_cryptographic_failures': {
                'patterns': [
                    r'hashlib\.md5\(',
                    r'hashlib\.sha1\(',
                    r'DES\.',
                    r'password.*=.*["\'][^"\']+["\']',
                ],
                'severity': 'high',
                'description': 'Cryptographic failures detected'
            },
            'A03_injection': {
                'patterns': [
                    r'cursor\.execute.*%.*',
                    r'cursor\.execute.*\+.*',
                    r'eval\s*\(',
                    r'exec\s*\(',
                    r'os\.system\(',
                ],
                'severity': 'critical',
                'description': 'Injection vulnerability detected'
            },
            'A04_insecure_design': {
                'patterns': [
                    r'password.*==.*["\'][^"\']+["\']',
                    r'if.*password.*==.*admin',
                    r'SECRET_KEY.*=.*["\'][^"\']+["\']',
                ],
                'severity': 'medium',
                'description': 'Insecure design patterns'
            },
            'A05_security_misconfiguration': {
                'patterns': [
                    r'DEBUG.*=.*True',
                    r'ALLOWED_HOSTS.*=.*\[\]',
                    r'app\.run\(.*debug=True.*\)',
                ],
                'severity': 'medium',
                'description': 'Security misconfiguration'
            },
            'A06_vulnerable_components': {
                'patterns': [
                    r'import.*pickle',
                    r'pickle\.loads\(',
                    r'yaml\.load\(',
                ],
                'severity': 'high',
                'description': 'Vulnerable components usage'
            },
            'A07_identification_auth_failures': {
                'patterns': [
                    r'session\[.*\].*=.*request\.',
                    r'login.*without.*validation',
                    r'password.*in.*url',
                ],
                'severity': 'high',
                'description': 'Authentication failures'
            },
            'A08_software_data_integrity': {
                'patterns': [
                    r'wget.*http://',
                    r'requests\.get.*verify=False',
                    r'ssl\._create_unverified_context',
                ],
                'severity': 'medium',
                'description': 'Software and data integrity issues'
            },
            'A09_logging_monitoring': {
                'patterns': [
                    r'except.*:.*pass',
                    r'try:.*except.*continue',
                ],
                'severity': 'low',
                'description': 'Insufficient logging and monitoring'
            },
            'A10_ssrf': {
                'patterns': [
                    r'requests\.get\(.*input.*\)',
                    r'urllib\.request\.urlopen\(.*user.*\)',
                    r'fetch\(.*request\.',
                ],
                'severity': 'high',
                'description': 'Server-side request forgery risk'
            }
        }
    
    def scan_file(self, file_path: str) -> List[Dict]:
        """Scan a file for OWASP Top 10 vulnerabilities"""
        vulnerabilities = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
            
            for vuln_id, vuln_data in self.vulnerability_patterns.items():
                for pattern in vuln_data['patterns']:
                    matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                    for match in matches:
                        line_num = content[:match.start()].count('\n') + 1
                        vulnerabilities.append({
                            'vulnerability_id': vuln_id,
                            'file': file_path,
                            'line': line_num,
                            'code': lines[line_num - 1].strip() if line_num <= len(lines) else '',
                            'severity': vuln_data['severity'],
                            'description': vuln_data['description'],
                            'owasp_category': vuln_id.replace('_', ' ').title()
                        })
        
        except Exception as e:
            print(f"Error scanning {file_path}: {e}")
        
        return vulnerabilities
    
    def scan_directory(self, directory: str) -> List[Dict]:
        """Scan all Python files in a directory"""
        all_vulnerabilities = []
        
        for file_path in Path(directory).rglob("*.py"):
            vulnerabilities = self.scan_file(str(file_path))
            all_vulnerabilities.extend(vulnerabilities)
        
        return all_vulnerabilities
    
    def generate_owasp_report(self, vulnerabilities: List[Dict]) -> str:
        """Generate OWASP Top 10 focused report"""
        if not vulnerabilities:
            return "✅ No OWASP Top 10 vulnerabilities detected"
        
        report = ["\n🔍 OWASP Top 10 Vulnerability Scan Report"]
        report.append("=" * 60)
        
        # Group by OWASP category
        by_owasp = {}
        for vuln in vulnerabilities:
            category = vuln['vulnerability_id']
            if category not in by_owasp:
                by_owasp[category] = []
            by_owasp[category].append(vuln)
        
        # Sort by OWASP order
        owasp_order = [f'A{i:02d}' for i in range(1, 11)]
        
        for category in sorted(by_owasp.keys(), key=lambda x: owasp_order.index(x[:3]) if x[:3] in owasp_order else 999):
            vulns = by_owasp[category]
            report.append(f"\n{category.upper().replace('_', ' ')} ({len(vulns)} issues):")
            
            for vuln in vulns:
                report.append(f"  📍 {vuln['file']}:{vuln['line']}")
                report.append(f"     {vuln['description']} [{vuln['severity'].upper()}]")
                report.append(f"     Code: {vuln['code']}")
                report.append("")
        
        return "\n".join(report)

# Example usage
def demo_vulnerability_scan():
    """Demonstrate vulnerability scanning"""
    scanner = VulnerabilityScanner()
    
    # Create vulnerable code sample
    vulnerable_code = '''
import os
import hashlib
import pickle

# A01: Broken Access Control
def admin_panel(user):
    if user.is_admin:  # Vulnerable: client-side check
        return render_admin_panel()

# A02: Cryptographic Failures
def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()  # Vulnerable: weak hash

# A03: Injection
def get_user(username):
    query = f"SELECT * FROM users WHERE name='{username}'"  # Vulnerable: SQL injection
    return execute_query(query)

# A05: Security Misconfiguration
DEBUG = True  # Vulnerable: debug in production
ALLOWED_HOSTS = []  # Vulnerable: allows any host

# A06: Vulnerable Components
def load_data(data):
    return pickle.loads(data)  # Vulnerable: unsafe deserialization
'''
    
    # Write to temporary file
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(vulnerable_code)
        temp_file = f.name
    
    # Scan the code
    vulnerabilities = scanner.scan_file(temp_file)
    report = scanner.generate_owasp_report(vulnerabilities)
    print(report)
    
    # Clean up
    import os
    os.unlink(temp_file)

if __name__ == "__main__":
    demo_vulnerability_scan()

```

## Security Regression Testing

### Automated Security Test Suite

```python
import unittest
import requests
import time
from typing import Dict, Any

class SecurityRegressionTests(unittest.TestCase):
    """Security regression test suite"""
    
    def setUp(self):
        """Set up test environment"""
        self.base_url = "http://localhost:8000"  # Test application URL
        self.session = requests.Session()
        
        # Test user credentials
        self.test_user = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        
        self.admin_user = {
            'username': 'admin',
            'password': 'AdminPass123!'
        }
    
    def test_sql_injection_prevention(self):
        """Test that SQL injection attempts are blocked"""
        malicious_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT 1,2,3 --"
        ]
        
        for payload in malicious_payloads:
            with self.subTest(payload=payload):
                response = self.session.get(
                    f"{self.base_url}/search",
                    params={'q': payload}
                )
                
                # Should not return SQL errors
                self.assertNotIn('sql', response.text.lower())
                self.assertNotIn('mysql', response.text.lower())
                self.assertNotIn('postgresql', response.text.lower())
                
                # Should return safe error or empty results
                self.assertIn([200, 400, 404], response.status_code)
    
    def test_xss_prevention(self):
        """Test that XSS attempts are properly escaped"""
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')"
        ]
        
        for payload in xss_payloads:
            with self.subTest(payload=payload):
                response = self.session.get(
                    f"{self.base_url}/search",
                    params={'q': payload}
                )
                
                # Payload should be escaped or removed
                self.assertNotIn('<script>', response.text)
                self.assertNotIn('javascript:', response.text)
                self.assertNotIn('onerror=', response.text)
    
    def test_authentication_security(self):
        """Test authentication security measures"""
        # Test rate limiting on login attempts
        login_url = f"{self.base_url}/login"
        
        # Attempt multiple failed logins
        for i in range(6):  # Try 6 times (should be blocked)
            response = self.session.post(login_url, data={
                'username': 'admin',
                'password': 'wrongpassword'
            })
        
        # Should be rate limited
        self.assertIn(response.status_code, [429, 403])
    
    def test_authorization_controls(self):
        """Test that authorization controls are enforced"""
        # Login as regular user
        login_response = self.session.post(
            f"{self.base_url}/login",
            data=self.test_user
        )
        self.assertEqual(login_response.status_code, 200)
        
        # Try to access admin endpoint
        admin_response = self.session.get(f"{self.base_url}/admin")
        
        # Should be denied
        self.assertIn(admin_response.status_code, [401, 403])
    
    def test_session_security(self):
        """Test session security measures"""
        # Login to get session
        login_response = self.session.post(
            f"{self.base_url}/login",
            data=self.test_user
        )
        
        # Check session cookie security
        session_cookie = None
        for cookie in self.session.cookies:
            if 'session' in cookie.name.lower():
                session_cookie = cookie
                break
        
        if session_cookie:
            # Should be HttpOnly and Secure
            self.assertTrue(session_cookie.has_nonstandard_attr('HttpOnly'))
            # Note: Secure flag depends on HTTPS
    
    def test_file_upload_security(self):
        """Test file upload security controls"""
        # Test malicious file types
        malicious_files = [
            ('test.php', b'<?php system($_GET["cmd"]); ?>'),
            ('test.jsp', b'<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>'),
            ('test.exe', b'MZ\x90\x00')  # Executable header
        ]
        
        for filename, content in malicious_files:
            with self.subTest(filename=filename):
                files = {'file': (filename, content)}
                response = self.session.post(
                    f"{self.base_url}/upload",
                    files=files
                )
                
                # Should reject dangerous file types
                self.assertNotEqual(response.status_code, 200)
    
    def test_security_headers(self):
        """Test that security headers are present"""
        response = self.session.get(self.base_url)
        headers = response.headers
        
        # Required security headers
        required_headers = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection'
        ]
        
        for header in required_headers:
            with self.subTest(header=header):
                self.assertIn(header, headers)
    
    def test_error_handling_security(self):
        """Test that errors don't leak sensitive information"""
        # Trigger various error conditions
        error_endpoints = [
            f"{self.base_url}/nonexistent",
            f"{self.base_url}/user/99999",
            f"{self.base_url}/api/invalid"
        ]
        
        for endpoint in error_endpoints:
            with self.subTest(endpoint=endpoint):
                response = self.session.get(endpoint)
                
                # Should not expose sensitive information
                sensitive_terms = [
                    'traceback',
                    'exception',
                    'database',
                    'password',
                    'secret',
                    'api_key'
                ]
                
                response_text = response.text.lower()
                for term in sensitive_terms:
                    self.assertNotIn(term, response_text)

class SecurityTestRunner:
    """Security test runner with reporting"""
    
    def __init__(self):
        self.test_results = []
    
    def run_security_tests(self) -> Dict[str, Any]:
        """Run all security regression tests"""
        # Create test suite
        suite = unittest.TestLoader().loadTestsFromTestCase(SecurityRegressionTests)
        
        # Custom test result class to capture details
        class SecurityTestResult(unittest.TestResult):
            def __init__(self):
                super().__init__()
                self.test_details = []
            
            def addSuccess(self, test):
                super().addSuccess(test)
                self.test_details.append({
                    'test': str(test),
                    'status': 'PASS',
                    'message': 'Security test passed'
                })
            
            def addFailure(self, test, err):
                super().addFailure(test, err)
                self.test_details.append({
                    'test': str(test),
                    'status': 'FAIL',
                    'message': str(err[1])
                })
            
            def addError(self, test, err):
                super().addError(test, err)
                self.test_details.append({
                    'test': str(test),
                    'status': 'ERROR',
                    'message': str(err[1])
                })
        
        # Run tests
        result = SecurityTestResult()
        suite.run(result)
        
        return {
            'total_tests': result.testsRun,
            'failures': len(result.failures),
            'errors': len(result.errors),
            'success_rate': ((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100) if result.testsRun > 0 else 0,
            'details': result.test_details
        }
    
    def generate_report(self, results: Dict[str, Any]) -> str:
        """Generate security test report"""
        report = ["\n🔍 Security Regression Test Report"]
        report.append("=" * 50)
        
        report.append(f"\nTest Summary:")
        report.append(f"  Total Tests: {results['total_tests']}")
        report.append(f"  Passed: {results['total_tests'] - results['failures'] - results['errors']}")
        report.append(f"  Failed: {results['failures']}")
        report.append(f"  Errors: {results['errors']}")
        report.append(f"  Success Rate: {results['success_rate']:.1f}%")
        
        if results['failures'] > 0 or results['errors'] > 0:
            report.append(f"\n❌ SECURITY ISSUES DETECTED:")
            for detail in results['details']:
                if detail['status'] in ['FAIL', 'ERROR']:
                    report.append(f"  • {detail['test']}: {detail['status']}")
                    report.append(f"    {detail['message']}")
        else:
            report.append(f"\n✅ All security tests passed!")
        
        return "\n".join(report)

# Example usage
if __name__ == "__main__":
    runner = SecurityTestRunner()
    results = runner.run_security_tests()
    report = runner.generate_report(results)
    print(report)

```

## Integrating Security Testing into CI/CD

### Security Pipeline Example

```python
#!/usr/bin/env python3
"""
Security testing pipeline script
Integrates SAST, DAST, and dependency checking
"""

import subprocess
import json
import sys
from pathlib import Path

class SecurityPipeline:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.results = {
            'sast': [],
            'dast': [],
            'dependencies': [],
            'regression_tests': []
        }
    
    def run_sast_scan(self):
        """Run static analysis security testing"""
        print("🔍 Running SAST scan...")
        
        analyzer = SecurityCodeAnalyzer()
        
        # Scan all Python files
        for py_file in self.project_path.rglob("*.py"):
            vulnerabilities = analyzer.analyze_file(str(py_file))
            self.results['sast'].extend(vulnerabilities)
        
        print(f"SAST: Found {len(self.results['sast'])} potential issues")
    
    def run_dependency_check(self):
        """Check for vulnerable dependencies"""
        print("🔍 Checking dependencies for known vulnerabilities...")
        
        try:
            # Use safety to check for known vulnerabilities
            result = subprocess.run(
                ['safety', 'check', '--json'],
                capture_output=True,
                text=True,
                cwd=self.project_path
            )
            
            if result.returncode == 0 and result.stdout:
                vulnerabilities = json.loads(result.stdout)
                self.results['dependencies'] = vulnerabilities
            
        except FileNotFoundError:
            print("Safety not installed. Install with: pip install safety")
        except Exception as e:
            print(f"Dependency check failed: {e}")
        
        print(f"Dependencies: Found {len(self.results['dependencies'])} vulnerable packages")
    
    def run_regression_tests(self):
        """Run security regression tests"""
        print("🔍 Running security regression tests...")
        
        runner = SecurityTestRunner()
        test_results = runner.run_security_tests()
        
        self.results['regression_tests'] = test_results
        print(f"Regression Tests: {test_results['success_rate']:.1f}% pass rate")
    
    def generate_pipeline_report(self) -> str:
        """Generate comprehensive security pipeline report"""
        report = ["\n🔒 Security Pipeline Report"]
        report.append("=" * 60)
        
        # SAST Results
        critical_sast = [v for v in self.results['sast'] if v.get('severity') == 'critical']
        high_sast = [v for v in self.results['sast'] if v.get('severity') == 'high']
        
        report.append(f"\n📊 STATIC ANALYSIS (SAST):")
        report.append(f"  Critical: {len(critical_sast)}")
        report.append(f"  High: {len(high_sast)}")
        report.append(f"  Total: {len(self.results['sast'])}")
        
        # Dependency Results
        report.append(f"\n📦 DEPENDENCY SCAN:")
        report.append(f"  Vulnerable packages: {len(self.results['dependencies'])}")
        
        # Regression Test Results
        if self.results['regression_tests']:
            rt = self.results['regression_tests']
            report.append(f"\n🧪 REGRESSION TESTS:")
            report.append(f"  Success rate: {rt['success_rate']:.1f}%")
            report.append(f"  Failed tests: {rt['failures'] + rt['errors']}")
        
        # Overall status
        total_issues = len(critical_sast) + len(high_sast) + len(self.results['dependencies'])
        
        if total_issues > 0:
            report.append(f"\n❌ PIPELINE STATUS: FAILED")
            report.append(f"   {total_issues} critical/high security issues found")
        else:
            report.append(f"\n✅ PIPELINE STATUS: PASSED")
            report.append(f"   No critical security issues found")
        
        return "\n".join(report)
    
    def run_full_pipeline(self) -> bool:
        """Run complete security pipeline"""
        print("🚀 Starting security pipeline...")
        
        self.run_sast_scan()
        self.run_dependency_check()
        self.run_regression_tests()
        
        report = self.generate_pipeline_report()
        print(report)
        
        # Determine if pipeline should fail build
        critical_issues = [v for v in self.results['sast'] if v.get('severity') in ['critical', 'high']]
        vulnerable_deps = len(self.results['dependencies'])
        
        if critical_issues or vulnerable_deps > 0:
            print("\n💥 Security pipeline failed - critical issues found!")
            return False
        
        print("\n✅ Security pipeline passed!")
        return True

# CI/CD Integration example
def main():
    """Main function for CI/CD integration"""
    if len(sys.argv) < 2:
        print("Usage: python security_pipeline.py <project_path>")
        sys.exit(1)
    
    project_path = sys.argv[1]
    pipeline = SecurityPipeline(project_path)
    
    success = pipeline.run_full_pipeline()
    
    # Exit with appropriate code for CI/CD
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()

```

## Key Takeaways

### Security Testing Best Practices

1. **Test Early and Often**: Integrate security testing throughout the development lifecycle

2. **Use Multiple Approaches**: Combine SAST, DAST, manual review, and automated scanning

3. **Focus on High-Risk Areas**: Prioritize authentication, input handling, and data protection

4. **Automate Where Possible**: Use CI/CD integration for consistent testing

5. **Manual Review is Essential**: Automated tools can't catch everything

### Building a Security Testing Strategy

1. **Start with SAST**: Catch issues early in development

2. **Add DAST**: Test running applications for runtime vulnerabilities

3. **Implement Regression Testing**: Ensure fixes don't break security

4. **Regular Vulnerability Scanning**: Keep up with new threats

5. **Train Your Team**: Manual review skills are crucial
