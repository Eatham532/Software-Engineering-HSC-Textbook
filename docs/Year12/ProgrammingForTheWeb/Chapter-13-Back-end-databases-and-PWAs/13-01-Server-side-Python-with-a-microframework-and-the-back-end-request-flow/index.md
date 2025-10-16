---
title: "13.1 Server-side Python with a microframework and the back-end request flow"
---

# 13.1 Server-side Python with a microframework and the back-end request flow

## Why it matters

Understanding how web servers and frameworks process requests is fundamental to backend development. The request-response cycle forms the backbone of web applications, involving multiple layers from web server software to application frameworks, databases, and external services. Mastering this flow enables developers to build efficient, secure, and scalable web applications while understanding where potential bottlenecks and security vulnerabilities may occur.

## Concepts

### Minimal routes and templates with Flask

Flask is a lightweight Python microframework that demonstrates core web development concepts without excessive complexity:

```python
# Basic Flask application demonstrating routing and templates
from flask import Flask, render_template, request, redirect, url_for, session, flash
import os
from datetime import datetime
import sqlite3

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # In production, use environment variable

# Configure database
DATABASE = 'simple_app.db'

def init_db():
    """Initialize the database with a simple users table"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

@app.route('/')
def index():
    """Home page - minimal route with template"""
    return render_template('index.html', 
                         current_time=datetime.now(),
                         user=session.get('username'))

@app.route('/about')
def about():
    """Static page demonstrating simple routing"""
    return render_template('about.html')

@app.route('/users')
def list_users():
    """Demonstrate database interaction in a route"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users ORDER BY created_at DESC')
    users = cursor.fetchall()
    conn.close()
    
    return render_template('users.html', users=users)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Demonstrate form handling and safe input processing"""
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        
        # Basic input validation
        if not username or not email:
            flash('Username and email are required', 'error')
            return render_template('register.html')
        
        if len(username) < 3:
            flash('Username must be at least 3 characters', 'error')
            return render_template('register.html')
        
        if '@' not in email:
            flash('Please enter a valid email address', 'error')
            return render_template('register.html')
        
        # Safe database insertion with parameterized queries
        try:
            conn = sqlite3.connect(DATABASE)
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO users (username, email) VALUES (?, ?)',
                (username, email)
            )
            conn.commit()
            conn.close()
            
            session['username'] = username
            flash('Registration successful!', 'success')
            return redirect(url_for('index'))
            
        except sqlite3.IntegrityError:
            flash('Username already exists', 'error')
            return render_template('register.html')
    
    return render_template('register.html')

@app.route('/api/users')
def api_users():
    """API endpoint demonstrating JSON response"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, email, created_at FROM users')
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    from flask import jsonify
    return jsonify({
        'users': users,
        'count': len(users),
        'timestamp': datetime.now().isoformat()
    })

@app.errorhandler(404)
def page_not_found(error):
    """Custom error handling"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle server errors gracefully"""
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)

```

### Safe input handling patterns

Proper input validation and sanitization prevents security vulnerabilities:

```python-template
# Advanced input handling and validation
from flask import Flask, request, escape
import re
import html
from werkzeug.security import generate_password_hash, check_password_hash

class InputValidator:
    """Centralized input validation and sanitization"""
    
    @staticmethod
    def validate_username(username):
        """Validate username format and length"""
        if not username or not isinstance(username, str):
            return False, "Username is required"
        
        username = username.strip()
        if len(username) < 3 or len(username) > 20:
            return False, "Username must be between 3 and 20 characters"
        
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return False, "Username can only contain letters, numbers, and underscores"
        
        return True, username
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        if not email or not isinstance(email, str):
            return False, "Email is required"
        
        email = email.strip().lower()
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(email_pattern, email):
            return False, "Please enter a valid email address"
        
        if len(email) > 254:  # RFC 5321 limit
            return False, "Email address is too long"
        
        return True, email
    
    @staticmethod
    def sanitize_html_content(content):
        """Sanitize HTML content to prevent XSS"""
        if not content:
            return ""
        
        # Escape HTML characters
        sanitized = html.escape(content)
        
        # Allow only specific tags (basic implementation)
        allowed_tags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li']
        # In production, use a library like bleach for proper HTML sanitization
        
        return sanitized
    
    @staticmethod
    def validate_post_content(title, content):
        """Validate blog post content"""
        errors = []
        
        if not title or len(title.strip()) < 3:
            errors.append("Title must be at least 3 characters")
        
        if len(title.strip()) > 200:
            errors.append("Title cannot exceed 200 characters")
        
        if not content or len(content.strip()) < 10:
            errors.append("Content must be at least 10 characters")
        
        if len(content.strip()) > 10000:
            errors.append("Content cannot exceed 10,000 characters")
        
        return len(errors) == 0, errors

# Enhanced Flask app with proper input handling
app = Flask(__name__)
validator = InputValidator()

@app.route('/secure-register', methods=['GET', 'POST'])
def secure_register():
    """Demonstration of secure user registration"""
    if request.method == 'POST':
        # Get and validate input
        username_valid, username_result = validator.validate_username(
            request.form.get('username')
        )
        email_valid, email_result = validator.validate_email(
            request.form.get('email')
        )
        password = request.form.get('password', '')
        
        errors = []
        
        if not username_valid:
            errors.append(username_result)
        
        if not email_valid:
            errors.append(email_result)
        
        # Password validation
        if len(password) < 8:
            errors.append("Password must be at least 8 characters")
        
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one number")
        
        if errors:
            flash('Registration failed: ' + '; '.join(errors), 'error')
            return render_template('secure_register.html')
        
        # Hash password securely
        password_hash = generate_password_hash(password)
        
        # Database insertion with proper error handling
        try:
            conn = sqlite3.connect(DATABASE)
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                (username_result, email_result, password_hash)
            )
            conn.commit()
            conn.close()
            
            flash('Registration successful!', 'success')
            return redirect(url_for('index'))
            
        except sqlite3.IntegrityError as e:
            flash('Username or email already exists', 'error')
            return render_template('secure_register.html')
        except Exception as e:
            app.logger.error(f'Registration error: {e}')
            flash('Registration failed. Please try again.', 'error')
            return render_template('secure_register.html')
    
    return render_template('secure_register.html')

@app.route('/create-post', methods=['GET', 'POST'])
def create_post():
    """Secure blog post creation with content sanitization"""
    if 'username' not in session:
        flash('Please log in to create posts', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()
        
        # Validate content
        valid, errors = validator.validate_post_content(title, content)
        
        if not valid:
            for error in errors:
                flash(error, 'error')
            return render_template('create_post.html')
        
        # Sanitize content
        safe_title = validator.sanitize_html_content(title)
        safe_content = validator.sanitize_html_content(content)
        
        # Get user ID
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE username = ?', (session['username'],))
        user = cursor.fetchone()
        
        if user:
            cursor.execute(
                'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)',
                (safe_title, safe_content, user[0])
            )
            conn.commit()
            flash('Post created successfully!', 'success')
        
        conn.close()
        return redirect(url_for('index'))
    
    return render_template('create_post.html')

```

### The complete back-end request flow

Understanding how a web request flows through the entire backend stack:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

participant "Client Browser" as client
participant "Web Server\n(nginx/Apache)" as webserver
participant "WSGI Server\n(Gunicorn/uWSGI)" as wsgi
participant "Flask Application" as flask
participant "Database\n(SQLite/PostgreSQL)" as db
participant "External API" as api

client -> webserver : HTTP Request\n(GET /users/123)
note right : Socket connection\nestablished

webserver -> webserver : Check static files\n(CSS, JS, images)
note right : Serve directly if static

webserver -> wsgi : Forward dynamic request
note right : Reverse proxy to\napplication server

wsgi -> flask : WSGI call with\nenviron dict
note right : Python callable\ninterface

flask -> flask : Route matching\n(@app.route('/users/<id>'))
note right : URL dispatcher\nfinds handler

flask -> flask : Middleware processing\n(auth, CORS, logging)
note right : Request preprocessing

flask -> flask : Handler function\nexecution
note right : Business logic\nprocessing

flask -> db : SQL Query\n(SELECT * FROM users WHERE id=?)
note right : Parameterized query\nfor safety

db -> flask : Result set
note right : Raw data or\nORM objects

flask -> api : External service call\n(if needed)
note right : REST API request\nor service integration

api -> flask : API Response
note right : JSON data or\nerror response

flask -> flask : Template rendering\n(Jinja2 processing)
note right : Generate HTML\nfrom template + data

flask -> wsgi : WSGI response\n(status, headers, body)
note right : Standard WSGI\nresponse format

wsgi -> webserver : HTTP response
note right : Application server\nto web server

webserver -> client : HTTP Response\n(200 OK + HTML)
note right : Complete response\nwith headers

@enduml

```

#### Role of web server software

Web servers handle different aspects of request processing:

```python-template
# Demonstration of web server concepts in Flask context
import time
import os
from flask import Flask, send_from_directory, request, jsonify, make_response

app = Flask(__name__)

# Simulate web server static file handling
@app.route('/static/<path:filename>')
def serve_static(filename):
    """
    Demonstrate static file serving
    In production, web server (nginx/Apache) handles this directly
    """
    static_dir = os.path.join(app.root_path, 'static')
    
    # Simulate web server behavior
    file_path = os.path.join(static_dir, filename)
    
    if os.path.exists(file_path):
        # Get file info for headers
        stat = os.stat(file_path)
        last_modified = time.strftime('%a, %d %b %Y %H:%M:%S GMT', 
                                    time.gmtime(stat.st_mtime))
        
        # Create response with appropriate headers
        response = make_response(send_from_directory(static_dir, filename))
        response.headers['Last-Modified'] = last_modified
        response.headers['Cache-Control'] = 'public, max-age=31536000'  # 1 year
        
        # Check for conditional requests (like browsers do)
        if request.headers.get('If-Modified-Since') == last_modified:
            return '', 304  # Not Modified
        
        return response
    else:
        return 'File not found', 404

# Simulate different types of content handling
@app.route('/api/server-info')
def server_info():
    """Demonstrate dynamic content generation"""
    return jsonify({
        'server_type': 'Flask Development Server',
        'static_handling': 'Application handles static files in development',
        'production_note': 'In production, web server handles static files directly',
        'request_info': {
            'method': request.method,
            'path': request.path,
            'user_agent': request.headers.get('User-Agent'),
            'remote_addr': request.remote_addr
        },
        'server_capabilities': {
            'static_files': 'Served by web server (nginx/Apache)',
            'dynamic_content': 'Forwarded to application server',
            'ssl_termination': 'Handled by web server',
            'compression': 'Gzip/Brotli by web server',
            'caching': 'Headers set by application, caching by web server'
        }
    })

# Demonstrate middleware concept
class RequestLoggingMiddleware:
    """Simple middleware to log requests"""
    
    def __init__(self, app):
        self.app = app
    
    def __call__(self, environ, start_response):
        # Pre-processing
        start_time = time.time()
        method = environ.get('REQUEST_METHOD')
        path = environ.get('PATH_INFO')
        
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {method} {path} - Processing...")
        
        # Call the actual application
        def new_start_response(status, headers):
            # Post-processing
            duration = time.time() - start_time
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {method} {path} - {status} - {duration:.3f}s")
            return start_response(status, headers)
        
        return self.app(environ, new_start_response)

# Apply middleware
app.wsgi_app = RequestLoggingMiddleware(app.wsgi_app)

# Demonstrate connection handling concepts
@app.route('/connection-info')
def connection_info():
    """Show information about the connection and request"""
    return jsonify({
        'connection_handling': {
            'socket_creation': 'Web server accepts TCP connections',
            'http_parsing': 'Web server parses HTTP request',
            'keep_alive': 'Web server manages connection reuse',
            'timeout_handling': 'Web server enforces request timeouts'
        },
        'request_processing': {
            'static_check': 'Web server checks if request is for static file',
            'proxy_decision': 'If dynamic, proxy to application server',
            'wsgi_interface': 'Application server uses WSGI to call Python app',
            'response_building': 'Application builds response, sent back through chain'
        },
        'current_request': {
            'headers': dict(request.headers),
            'method': request.method,
            'url': request.url,
            'remote_addr': request.remote_addr
        }
    })

```

#### Web framework request handling

Frameworks provide structure for handling the request-response cycle:

```python
# Advanced Flask patterns demonstrating framework concepts
from flask import Flask, g, request, session, abort
from functools import wraps
import sqlite3
import logging

app = Flask(__name__)
app.secret_key = 'demo-secret-key'

# Database connection per request pattern
def get_db():
    """Get database connection, stored in application context"""
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(error):
    """Close database connection at end of request"""
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.teardown_appcontext
def close_db(error):
    """Ensure database connection is closed after each request"""
    close_db(error)

# Authentication decorator (middleware pattern)
def login_required(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            abort(401)  # Unauthorized
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            abort(401)  # Unauthorized
        
        # Check admin status
        db = get_db()
        user = db.execute(
            'SELECT is_admin FROM users WHERE id = ?', 
            (session['user_id'],)
        ).fetchone()
        
        if not user or not user['is_admin']:
            abort(403)  # Forbidden
        
        return f(*args, **kwargs)
    return decorated_function

# Route with parameter handling and validation
@app.route('/users/<int:user_id>')
def get_user(user_id):
    """Demonstrate route parameters and validation"""
    # Framework automatically converts user_id to int
    # Returns 404 if conversion fails
    
    db = get_db()
    user = db.execute(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        (user_id,)
    ).fetchone()
    
    if user is None:
        abort(404)
    
    return jsonify(dict(user))

# Complex route with multiple HTTP methods
@app.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def handle_post(post_id):
    """Demonstrate RESTful route handling"""
    db = get_db()
    
    if request.method == 'GET':
        post = db.execute('''
            SELECT p.*, u.username 
            FROM posts p 
            JOIN users u ON p.author_id = u.id 
            WHERE p.id = ?
        ''', (post_id,)).fetchone()
        
        if post is None:
            abort(404)
        
        return jsonify(dict(post))
    
    elif request.method == 'PUT':
        # Check ownership
        post = db.execute(
            'SELECT author_id FROM posts WHERE id = ?', 
            (post_id,)
        ).fetchone()
        
        if post is None:
            abort(404)
        
        if post['author_id'] != session['user_id']:
            abort(403)  # Forbidden
        
        # Update post
        data = request.get_json()
        title = data.get('title', '').strip()
        content = data.get('content', '').strip()
        
        if not title or not content:
            abort(400)  # Bad Request
        
        db.execute(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            (title, content, post_id)
        )
        db.commit()
        
        return jsonify({'message': 'Post updated successfully'})
    
    elif request.method == 'DELETE':
        # Check ownership or admin
        post = db.execute(
            'SELECT author_id FROM posts WHERE id = ?', 
            (post_id,)
        ).fetchone()
        
        if post is None:
            abort(404)
        
        user = db.execute(
            'SELECT is_admin FROM users WHERE id = ?', 
            (session['user_id'],)
        ).fetchone()
        
        if post['author_id'] != session['user_id'] and not user['is_admin']:
            abort(403)
        
        db.execute('DELETE FROM posts WHERE id = ?', (post_id,))
        db.commit()
        
        return jsonify({'message': 'Post deleted successfully'})

# Error handlers (framework-level middleware)
@app.errorhandler(400)
def bad_request(error):
    """Handle bad request errors"""
    return jsonify({'error': 'Bad request', 'message': str(error)}), 400

@app.errorhandler(401)
def unauthorized(error):
    """Handle authentication errors"""
    return jsonify({'error': 'Unauthorized', 'message': 'Authentication required'}), 401

@app.errorhandler(403)
def forbidden(error):
    """Handle authorization errors"""
    return jsonify({'error': 'Forbidden', 'message': 'Insufficient privileges'}), 403

@app.errorhandler(404)
def not_found(error):
    """Handle not found errors"""
    return jsonify({'error': 'Not found', 'message': 'Resource not found'}), 404

# Request hooks for logging and monitoring
@app.before_request
def before_request():
    """Execute before each request"""
    g.start_time = time.time()
    
    # Log request info
    app.logger.info(f'Request: {request.method} {request.path}')
    
    # Rate limiting could go here
    # Authentication checks could go here

@app.after_request
def after_request(response):
    """Execute after each request"""
    duration = time.time() - g.start_time
    app.logger.info(f'Response: {response.status_code} - {duration:.3f}s')
    
    # Add security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    return response

```

### Objects and libraries used in request processing

Modern web applications rely on various objects and libraries for request handling:

```python-template
# Comprehensive example of request processing objects and libraries
from flask import Flask, request, session, g, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import redis
import logging
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key')

# Configure for production behind proxy
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Session configuration for production
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(hours=24)
)

# Redis for session storage and caching
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_available = True
except:
    redis_available = False
    app.logger.warning('Redis not available, using in-memory storage')

class SessionManager:
    """Enhanced session management with Redis backend"""
    
    @staticmethod
    def create_session(user_id, username):
        """Create a new user session"""
        session_data = {
            'user_id': user_id,
            'username': username,
            'created_at': datetime.utcnow().isoformat(),
            'last_activity': datetime.utcnow().isoformat()
        }
        
        if redis_available:
            # Store in Redis with expiration
            session_key = f'session:{user_id}'
            redis_client.hmset(session_key, session_data)
            redis_client.expire(session_key, 86400)  # 24 hours
        
        # Also store in Flask session
        session.update(session_data)
        session.permanent = True
    
    @staticmethod
    def get_session(user_id):
        """Retrieve session data"""
        if redis_available:
            session_key = f'session:{user_id}'
            return redis_client.hgetall(session_key)
        return session
    
    @staticmethod
    def update_activity(user_id):
        """Update last activity timestamp"""
        if redis_available:
            session_key = f'session:{user_id}'
            redis_client.hset(session_key, 'last_activity', 
                            datetime.utcnow().isoformat())
        session['last_activity'] = datetime.utcnow().isoformat()

class AuthenticationHelper:
    """Authentication and authorization helper"""
    
    @staticmethod
    def create_jwt_token(user_id, username):
        """Create JWT token for API authentication"""
        payload = {
            'user_id': user_id,
            'username': username,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        
        return jwt.encode(payload, app.secret_key, algorithm='HS256')
    
    @staticmethod
    def verify_jwt_token(token):
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def hash_password(password):
        """Securely hash a password"""
        return generate_password_hash(password, method='pbkdf2:sha256')
    
    @staticmethod
    def verify_password(password_hash, password):
        """Verify a password against its hash"""
        return check_password_hash(password_hash, password)

class RequestLogger:
    """Request logging and monitoring"""
    
    def __init__(self):
        self.logger = logging.getLogger('request_logger')
        self.logger.setLevel(logging.INFO)
        
        # Create handler if not exists
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
    
    def log_request(self, request):
        """Log incoming request details"""
        request_info = {
            'method': request.method,
            'path': request.path,
            'remote_addr': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', ''),
            'content_type': request.content_type,
            'content_length': request.content_length
        }
        
        self.logger.info(f"Request: {request_info}")
        
        # Store in Redis for analytics if available
        if redis_available:
            timestamp = datetime.utcnow().isoformat()
            redis_client.lpush('request_log', f"{timestamp}:{request_info}")
            redis_client.ltrim('request_log', 0, 999)  # Keep last 1000 requests

# Initialize helpers
session_manager = SessionManager()
auth_helper = AuthenticationHelper()
request_logger = RequestLogger()

# Request processing with all objects
@app.before_request
def process_request():
    """Comprehensive request processing"""
    # Log the request
    request_logger.log_request(request)
    
    # Store request start time
    g.start_time = datetime.utcnow()
    
    # Initialize database connection
    g.db = get_db()
    
    # Process authentication
    g.current_user = None
    
    # Check for JWT token in headers
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        payload = auth_helper.verify_jwt_token(token)
        if payload:
            g.current_user = payload
    
    # Check for session-based auth
    elif 'user_id' in session:
        session_manager.update_activity(session['user_id'])
        g.current_user = session
    
    # Rate limiting (basic implementation)
    if redis_available:
        client_ip = request.remote_addr
        rate_key = f'rate_limit:{client_ip}'
        current_requests = redis_client.incr(rate_key)
        
        if current_requests == 1:
            redis_client.expire(rate_key, 60)  # 1 minute window
        
        if current_requests > 100:  # 100 requests per minute
            abort(429)  # Too Many Requests

@app.route('/login', methods=['POST'])
def login():
    """Enhanced login with proper session management"""
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    # Check user credentials
    db = get_db()
    user = db.execute(
        'SELECT id, username, password_hash FROM users WHERE username = ?',
        (username,)
    ).fetchone()
    
    if user and auth_helper.verify_password(user['password_hash'], password):
        # Create session
        session_manager.create_session(user['id'], user['username'])
        
        # Create JWT for API access
        jwt_token = auth_helper.create_jwt_token(user['id'], user['username'])
        
        return jsonify({
            'message': 'Login successful',
            'jwt_token': jwt_token,
            'user': {
                'id': user['id'],
                'username': user['username']
            }
        })
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/profile')
def get_profile():
    """Protected route demonstrating session usage"""
    if not g.current_user:
        return jsonify({'error': 'Authentication required'}), 401
    
    user_id = g.current_user['user_id']
    
    # Get detailed user info
    db = get_db()
    user = db.execute(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        (user_id,)
    ).fetchone()
    
    if user:
        # Get session info
        session_data = session_manager.get_session(user_id)
        
        return jsonify({
            'user': dict(user),
            'session_info': {
                'created_at': session_data.get('created_at'),
                'last_activity': session_data.get('last_activity')
            }
        })
    else:
        return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)

```

### Interfacing with databases and external services

Modern web applications integrate with multiple data sources and services:

```python-template
# Database and external service integration patterns
import asyncio
import aiohttp
import asyncpg
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from flask import Flask, jsonify, request
import json
from datetime import datetime
import os

app = Flask(__name__)

class DatabaseManager:
    """Database connection and query management"""
    
    def __init__(self):
        self.db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'database': os.getenv('DB_NAME', 'webapp'),
            'user': os.getenv('DB_USER', 'webapp_user'),
            'password': os.getenv('DB_PASSWORD', 'webapp_password'),
            'port': os.getenv('DB_PORT', 5432)
        }
    
    def get_connection(self):
        """Get database connection with error handling"""
        try:
            conn = psycopg2.connect(**self.db_config)
            conn.cursor_factory = RealDictCursor
            return conn
        except psycopg2.Error as e:
            app.logger.error(f'Database connection failed: {e}')
            raise
    
    def execute_query(self, query, params=None):
        """Execute query with proper error handling and connection management"""
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute(query, params)
            
            if query.strip().upper().startswith('SELECT'):
                result = cursor.fetchall()
                return [dict(row) for row in result]
            else:
                conn.commit()
                return cursor.rowcount
                
        except psycopg2.Error as e:
            if conn:
                conn.rollback()
            app.logger.error(f'Query execution failed: {e}')
            raise
        finally:
            if conn:
                conn.close()
    
    def execute_transaction(self, queries):
        """Execute multiple queries in a transaction"""
        conn = None
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            
            for query, params in queries:
                cursor.execute(query, params)
            
            conn.commit()
            return True
            
        except psycopg2.Error as e:
            if conn:
                conn.rollback()
            app.logger.error(f'Transaction failed: {e}')
            raise
        finally:
            if conn:
                conn.close()

class ExternalServiceManager:
    """Manage external service integrations"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.timeout = 10  # Default timeout
        
        # API configuration
        self.apis = {
            'weather': {
                'base_url': 'https://api.openweathermap.org/data/2.5',
                'api_key': os.getenv('WEATHER_API_KEY'),
                'timeout': 5
            },
            'payment': {
                'base_url': 'https://api.stripe.com/v1',
                'api_key': os.getenv('STRIPE_API_KEY'),
                'timeout': 15
            },
            'email': {
                'base_url': 'https://api.sendgrid.com/v3',
                'api_key': os.getenv('SENDGRID_API_KEY'),
                'timeout': 10
            }
        }
    
    def call_external_api(self, service, endpoint, method='GET', data=None, headers=None):
        """Generic external API call with error handling"""
        if service not in self.apis:
            raise ValueError(f'Unknown service: {service}')
        
        config = self.apis[service]
        url = f"{config['base_url']}/{endpoint.lstrip('/')}"
        
        # Prepare headers
        request_headers = headers or {}
        if config.get('api_key'):
            request_headers['Authorization'] = f"Bearer {config['api_key']}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                headers=request_headers,
                timeout=config['timeout']
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.Timeout:
            app.logger.error(f'Timeout calling {service} API')
            raise
        except requests.exceptions.RequestException as e:
            app.logger.error(f'Error calling {service} API: {e}')
            raise
    
    def get_weather_data(self, city):
        """Get weather data for a city"""
        try:
            data = self.call_external_api(
                'weather',
                f'weather?q={city}&appid={self.apis["weather"]["api_key"]}&units=metric'
            )
            return {
                'city': data['name'],
                'temperature': data['main']['temp'],
                'description': data['weather'][0]['description'],
                'humidity': data['main']['humidity']
            }
        except Exception as e:
            app.logger.error(f'Weather API error: {e}')
            return None
    
    def send_notification_email(self, to_email, subject, content):
        """Send notification email via SendGrid"""
        try:
            email_data = {
                'personalizations': [{
                    'to': [{'email': to_email}]
                }],
                'from': {'email': 'noreply@example.com'},
                'subject': subject,
                'content': [{
                    'type': 'text/html',
                    'value': content
                }]
            }
            
            response = self.call_external_api(
                'email',
                'mail/send',
                method='POST',
                data=email_data
            )
            return True
            
        except Exception as e:
            app.logger.error(f'Email API error: {e}')
            return False

# Initialize managers
db_manager = DatabaseManager()
service_manager = ExternalServiceManager()

@app.route('/users/<int:user_id>/dashboard')
def user_dashboard(user_id):
    """Complex route demonstrating database and external service integration"""
    try:
        # Get user data from database
        user_query = '''
            SELECT u.id, u.username, u.email, u.city,
                   COUNT(p.id) as post_count,
                   MAX(p.created_at) as last_post
            FROM users u
            LEFT JOIN posts p ON u.id = p.author_id
            WHERE u.id = %s
            GROUP BY u.id, u.username, u.email, u.city
        '''
        
        user_data = db_manager.execute_query(user_query, (user_id,))
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        user = user_data[0]
        
        # Get recent posts
        posts_query = '''
            SELECT id, title, content, created_at
            FROM posts
            WHERE author_id = %s
            ORDER BY created_at DESC
            LIMIT 5
        '''
        
        recent_posts = db_manager.execute_query(posts_query, (user_id,))
        
        # Get weather data if user has city set
        weather_data = None
        if user['city']:
            weather_data = service_manager.get_weather_data(user['city'])
        
        # Get user statistics from multiple queries
        stats_queries = [
            ('SELECT COUNT(*) as friend_count FROM friendships WHERE user_id = %s', (user_id,)),
            ('SELECT COUNT(*) as notification_count FROM notifications WHERE user_id = %s AND read = false', (user_id,))
        ]
        
        stats = {}
        for query, params in stats_queries:
            result = db_manager.execute_query(query, params)
            stats.update(result[0] if result else {})
        
        dashboard_data = {
            'user': user,
            'recent_posts': recent_posts,
            'weather': weather_data,
            'statistics': stats,
            'generated_at': datetime.utcnow().isoformat()
        }
        
        return jsonify(dashboard_data)
        
    except Exception as e:
        app.logger.error(f'Dashboard error for user {user_id}: {e}')
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/orders', methods=['POST'])
def create_order():
    """Demonstrate transaction handling across multiple services"""
    try:
        order_data = request.get_json()
        user_id = order_data.get('user_id')
        items = order_data.get('items', [])
        total_amount = order_data.get('total_amount')
        
        # Start database transaction
        transaction_queries = []
        
        # Create order record
        order_query = '''
            INSERT INTO orders (user_id, total_amount, status, created_at)
            VALUES (%s, %s, 'pending', %s)
            RETURNING id
        '''
        
        order_id = db_manager.execute_query(
            order_query, 
            (user_id, total_amount, datetime.utcnow())
        )
        
        if not order_id:
            raise Exception('Failed to create order')
        
        order_id = order_id[0]['id']
        
        # Add order items
        for item in items:
            item_query = '''
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            '''
            transaction_queries.append((
                item_query,
                (order_id, item['product_id'], item['quantity'], item['price'])
            ))
        
        # Execute all order-related queries in transaction
        db_manager.execute_transaction(transaction_queries)
        
        # Process payment via external service
        payment_data = {
            'amount': int(total_amount * 100),  # Stripe expects cents
            'currency': 'usd',
            'description': f'Order {order_id}',
            'source': order_data.get('payment_token')
        }
        
        payment_result = service_manager.call_external_api(
            'payment',
            'charges',
            method='POST',
            data=payment_data
        )
        
        if payment_result.get('status') == 'succeeded':
            # Update order status
            db_manager.execute_query(
                'UPDATE orders SET status = %s WHERE id = %s',
                ('paid', order_id)
            )
            
            # Send confirmation email
            user_email_query = 'SELECT email FROM users WHERE id = %s'
            user_email = db_manager.execute_query(user_email_query, (user_id,))
            
            if user_email:
                service_manager.send_notification_email(
                    user_email[0]['email'],
                    f'Order #{order_id} Confirmation',
                    f'Your order has been confirmed and payment processed.'
                )
            
            return jsonify({
                'order_id': order_id,
                'status': 'success',
                'payment_id': payment_result['id']
            })
        else:
            # Payment failed, update order status
            db_manager.execute_query(
                'UPDATE orders SET status = %s WHERE id = %s',
                ('failed', order_id)
            )
            
            return jsonify({
                'order_id': order_id,
                'status': 'payment_failed',
                'error': 'Payment processing failed'
            }), 400
            
    except Exception as e:
        app.logger.error(f'Order creation error: {e}')
        return jsonify({'error': 'Order processing failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)

```

## Try it

/// details | Exercise 1: Request Flow Analysis
    type: question
    open: false

**Scenario**: A user submits a form to create a new blog post on your Flask application. Trace the complete request flow from the browser to the database and back.

**Tasks**:

1. List each component involved in processing this request

2. Identify where input validation should occur

3. Explain what happens if the database is temporarily unavailable

/// details | Sample Solution
    type: success
    open: false

**Components involved**:

1. **Client Browser**: Submits POST request with form data

2. **Web Server (nginx/Apache)**: Receives TCP connection, parses HTTP request

3. **WSGI Server (Gunicorn)**: Receives proxied request from web server

4. **Flask Application**: Route matching, middleware processing

5. **Input Validation**: Form data validation and sanitization

6. **Database**: SQL execution for data persistence

7. **Template Engine**: HTML generation for response

8. **Response Chain**: Back through WSGI → Web Server → Browser

**Input validation locations**:

- **Client-side**: Basic validation for user experience (not security)

- **Server-side**: Primary validation in Flask route handler

- **Database level**: Constraints and foreign key validation

- **Middleware**: Cross-cutting validation (authentication, rate limiting)

**Database unavailability handling**:

- **Connection pooling**: Retry with exponential backoff

- **Circuit breaker**: Fail fast after repeated failures

- **Graceful degradation**: Return error message, log incident

- **User feedback**: Inform user to try again later

- **Monitoring**: Alert administrators of database issues
///
///

/// details | Exercise 2: Secure Input Handling
    type: question
    open: false

**Scenario**: You need to implement a user registration endpoint that handles username, email, and password securely.

**Tasks**:

1. Design the input validation strategy

2. Implement password security measures

3. Handle potential attack vectors (SQL injection, XSS)

/// details | Sample Solution
    type: success
    open: false

**Input validation strategy**:

```python-exec
def validate_registration_input(data):
    errors = []
    
    # Username validation
    username = data.get('username', '').strip()
    if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
        errors.append('Username must be 3-20 characters, letters/numbers/underscores only')
    
    # Email validation
    email = data.get('email', '').strip().lower()
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        errors.append('Invalid email format')
    
    # Password validation
    password = data.get('password', '')
    if len(password) < 8:
        errors.append('Password must be at least 8 characters')
    if not re.search(r'[A-Z]', password):
        errors.append('Password must contain uppercase letter')
    if not re.search(r'[a-z]', password):
        errors.append('Password must contain lowercase letter')
    if not re.search(r'\d', password):
        errors.append('Password must contain a number')
    
    return errors

```

**Password security measures**:

- **Hashing**: Use strong algorithms (bcrypt, scrypt, Argon2)

- **Salt**: Automatically handled by modern hashing libraries

- **Work factor**: Adjust for computational cost

- **Never store**: Plain text passwords never stored or logged

**Attack vector protection**:

- **SQL Injection**: Parameterized queries only

- **XSS**: HTML escape all user input

- **CSRF**: Use CSRF tokens for state-changing operations

- **Rate limiting**: Prevent brute force attacks

- **Input sanitization**: Remove or escape dangerous characters
///
///

## Recap

Server-side Python with microframeworks provides a foundation for understanding web request processing:

- **Minimal routes and templates** demonstrate the core request-response cycle with clean separation of concerns

- **Safe input handling** prevents security vulnerabilities through validation, sanitization, and parameterized queries

- **Web server software** handles connection management, static files, and proxying to application servers

- **Framework request handling** provides routing, middleware, error handling, and request lifecycle management

- **Request processing objects** include sessions, authentication helpers, database connections, and external service integrations

- **Database and external service interfacing** requires proper connection management, error handling, and transaction coordination

Understanding this complete request flow enables developers to build secure, efficient web applications while recognizing where performance bottlenecks and security vulnerabilities may occur in the backend processing pipeline.
