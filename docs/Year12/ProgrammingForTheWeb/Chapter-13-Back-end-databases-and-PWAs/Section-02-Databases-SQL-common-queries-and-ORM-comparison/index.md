# 13.2 Databases: SQL, common queries and ORM comparison

## Why it matters

!!! builds-on "Builds on"
    This section builds on [13.1 Server-side Python with a microframework and the back-end request flow](../Section-01-Server-side-Python-with-a-microframework-and-the-back-end-request-flow/index.md).


Databases are the persistent storage layer of web applications, and SQL (Structured Query Language) is the standard way to interact with relational databases. Understanding how to construct safe, efficient SQL queries and when to use Object-Relational Mapping (ORM) tools is essential for building robust web applications. These skills enable developers to store, retrieve, and manipulate data while maintaining data integrity and security.

## Concepts

### CRUD patterns and basic SQL operations

CRUD (Create, Read, Update, Delete) operations form the foundation of database interactions:

```python
# Database setup and CRUD operations with Python
import sqlite3
from flask import Flask, request, jsonify
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
DATABASE = 'webapp.db'

def init_database():
    """Initialize database with sample schema"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author_id INTEGER,
            category_id INTEGER,
            published BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users (id),
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER,
            author_id INTEGER,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts (id),
            FOREIGN KEY (author_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection with row factory"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

class DatabaseManager:
    """Database operations with proper error handling"""
    
    def create_user(self, username, email):
        """CREATE: Insert new user (safe parameterized query)"""
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO users (username, email) VALUES (?, ?)',
                (username, email)
            )
            conn.commit()
            user_id = cursor.lastrowid
            return user_id
        except sqlite3.IntegrityError:
            return None  # Username or email already exists
        finally:
            conn.close()
    
    def get_user(self, user_id):
        """READ: Select specific user"""
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT id, username, email, created_at, is_active FROM users WHERE id = ?',
                (user_id,)
            )
            user = cursor.fetchone()
            return dict(user) if user else None
        finally:
            conn.close()
    
    def update_user(self, user_id, username=None, email=None):
        """UPDATE: Modify existing user"""
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            
            # Build dynamic update query
            updates = []
            params = []
            
            if username is not None:
                updates.append('username = ?')
                params.append(username)
            
            if email is not None:
                updates.append('email = ?')
                params.append(email)
            
            if not updates:
                return False
            
            params.append(user_id)  # Add WHERE parameter
            
            query = f'UPDATE users SET {", ".join(updates)} WHERE id = ?'
            cursor.execute(query, params)
            conn.commit()
            
            return cursor.rowcount > 0
        except sqlite3.IntegrityError:
            return False
        finally:
            conn.close()
    
    def delete_user(self, user_id):
        """DELETE: Remove user (with cascade consideration)"""
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            
            # Check if user has posts or comments
            cursor.execute('SELECT COUNT(*) FROM posts WHERE author_id = ?', (user_id,))
            post_count = cursor.fetchone()[0]
            
            cursor.execute('SELECT COUNT(*) FROM comments WHERE author_id = ?', (user_id,))
            comment_count = cursor.fetchone()[0]
            
            if post_count > 0 or comment_count > 0:
                # Soft delete - deactivate instead of removing
                cursor.execute('UPDATE users SET is_active = 0 WHERE id = ?', (user_id,))
            else:
                # Hard delete - safe to remove
                cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
            
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

# Initialize database
init_database()
db_manager = DatabaseManager()

@app.route('/api/users', methods=['POST'])
def create_user():
    """API endpoint for user creation"""
    data = request.get_json()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    
    if not username or not email:
        return jsonify({'error': 'Username and email required'}), 400
    
    user_id = db_manager.create_user(username, email)
    if user_id:
        return jsonify({'id': user_id, 'username': username, 'email': email}), 201
    else:
        return jsonify({'error': 'Username or email already exists'}), 409

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    """API endpoint for user retrieval"""
    user = db_manager.get_user(user_id)
    if user:
        return jsonify(user)
    else:
        return jsonify({'error': 'User not found'}), 404

```

### SELECT operations and field selection

Understanding how to retrieve specific data efficiently:

```python
# Advanced SELECT operations
class QueryBuilder:
    """Build complex SELECT queries safely"""
    
    def __init__(self):
        self.conn = get_db_connection()
    
    def select_fields_example(self):
        """Demonstrate field selection strategies"""
        cursor = self.conn.cursor()
        
        # Select specific fields (efficient)
        cursor.execute('''
            SELECT id, username, email 
            FROM users 
            WHERE is_active = 1
        ''')
        active_users = cursor.fetchall()
        
        # Select with aliases for clarity
        cursor.execute('''
            SELECT 
                u.id as user_id,
                u.username,
                u.email,
                u.created_at as registration_date
            FROM users u
            WHERE u.is_active = 1
        ''')
        users_with_aliases = cursor.fetchall()
        
        # Select with calculated fields
        cursor.execute('''
            SELECT 
                username,
                email,
                CASE 
                    WHEN is_active = 1 THEN 'Active'
                    ELSE 'Inactive'
                END as status,
                julianday('now') - julianday(created_at) as days_since_registration
            FROM users
        ''')
        users_with_calculated = cursor.fetchall()
        
        return {
            'active_users': [dict(row) for row in active_users],
            'users_with_aliases': [dict(row) for row in users_with_aliases],
            'users_with_calculated': [dict(row) for row in users_with_calculated]
        }
    
    def filtering_and_ordering(self):
        """Demonstrate WHERE clauses and ORDER BY"""
        cursor = self.conn.cursor()
        
        # Basic filtering
        cursor.execute('''
            SELECT username, email, created_at
            FROM users
            WHERE created_at > date('now', '-30 days')
            ORDER BY created_at DESC
        ''')
        recent_users = cursor.fetchall()
        
        # Multiple conditions
        cursor.execute('''
            SELECT username, email
            FROM users
            WHERE is_active = 1 
              AND email LIKE '%@example.com'
            ORDER BY username ASC
        ''')
        filtered_users = cursor.fetchall()
        
        # Range filtering with parameters
        cursor.execute('''
            SELECT username, created_at
            FROM users
            WHERE created_at BETWEEN ? AND ?
            ORDER BY created_at DESC
            LIMIT ?
        ''', ('2024-01-01', '2024-12-31', 10))
        year_users = cursor.fetchall()
        
        return {
            'recent_users': [dict(row) for row in recent_users],
            'filtered_users': [dict(row) for row in filtered_users],
            'year_users': [dict(row) for row in year_users]
        }
    
    def close(self):
        """Close database connection"""
        self.conn.close()

@app.route('/api/query-examples')
def query_examples():
    """Demonstrate various query patterns"""
    query_builder = QueryBuilder()
    try:
        field_examples = query_builder.select_fields_example()
        filter_examples = query_builder.filtering_and_ordering()
        
        return jsonify({
            'field_selection': field_examples,
            'filtering_ordering': filter_examples
        })
    finally:
        query_builder.close()

```

### GROUP BY and aggregation

Grouping and summarizing data for insights:

```python
# GROUP BY and aggregation examples
class AggregationQueries:
    """Demonstrate aggregation and grouping"""
    
    def __init__(self):
        self.conn = get_db_connection()
    
    def basic_aggregation(self):
        """Basic COUNT, SUM, AVG operations"""
        cursor = self.conn.cursor()
        
        # Count users by status
        cursor.execute('''
            SELECT 
                CASE WHEN is_active = 1 THEN 'Active' ELSE 'Inactive' END as status,
                COUNT(*) as user_count
            FROM users
            GROUP BY is_active
        ''')
        user_counts = cursor.fetchall()
        
        # Posts per user
        cursor.execute('''
            SELECT 
                u.username,
                COUNT(p.id) as post_count,
                COUNT(CASE WHEN p.published = 1 THEN 1 END) as published_count
            FROM users u
            LEFT JOIN posts p ON u.id = p.author_id
            GROUP BY u.id, u.username
            ORDER BY post_count DESC
        ''')
        user_post_stats = cursor.fetchall()
        
        return {
            'user_counts': [dict(row) for row in user_counts],
            'user_post_stats': [dict(row) for row in user_post_stats]
        }
    
    def advanced_grouping(self):
        """Advanced GROUP BY with HAVING"""
        cursor = self.conn.cursor()
        
        # Users with more than 5 posts
        cursor.execute('''
            SELECT 
                u.username,
                COUNT(p.id) as post_count
            FROM users u
            INNER JOIN posts p ON u.id = p.author_id
            GROUP BY u.id, u.username
            HAVING COUNT(p.id) > 5
            ORDER BY post_count DESC
        ''')
        prolific_users = cursor.fetchall()
        
        # Monthly post statistics
        cursor.execute('''
            SELECT 
                strftime('%Y-%m', created_at) as month,
                COUNT(*) as total_posts,
                COUNT(CASE WHEN published = 1 THEN 1 END) as published_posts,
                COUNT(DISTINCT author_id) as unique_authors
            FROM posts
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month DESC
        ''')
        monthly_stats = cursor.fetchall()
        
        return {
            'prolific_users': [dict(row) for row in prolific_users],
            'monthly_stats': [dict(row) for row in monthly_stats]
        }
    
    def close(self):
        self.conn.close()

@app.route('/api/aggregation-examples')
def aggregation_examples():
    """API endpoint for aggregation demonstrations"""
    agg_queries = AggregationQueries()
    try:
        basic_stats = agg_queries.basic_aggregation()
        advanced_stats = agg_queries.advanced_grouping()
        
        return jsonify({
            'basic_aggregation': basic_stats,
            'advanced_grouping': advanced_stats
        })
    finally:
        agg_queries.close()

```

### Table joins and relationships

Understanding how to combine data from multiple tables:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

entity "users" {
  * id : INTEGER (PK)
  --
  username : TEXT (UNIQUE)
  email : TEXT (UNIQUE)
  created_at : TIMESTAMP
  is_active : BOOLEAN
}

entity "posts" {
  * id : INTEGER (PK)
  --
  title : TEXT
  content : TEXT
  author_id : INTEGER (FK)
  category_id : INTEGER (FK)
  published : BOOLEAN
  created_at : TIMESTAMP
}

entity "categories" {
  * id : INTEGER (PK)
  --
  name : TEXT (UNIQUE)
  description : TEXT
}

entity "comments" {
  * id : INTEGER (PK)
  --
  post_id : INTEGER (FK)
  author_id : INTEGER (FK)
  content : TEXT
  created_at : TIMESTAMP
}

users ||--o{ posts : "author_id"
users ||--o{ comments : "author_id"
categories ||--o{ posts : "category_id"
posts ||--o{ comments : "post_id"
@enduml

```

```python
# Table joins demonstration
class JoinQueries:
    """Demonstrate different types of joins"""
    
    def __init__(self):
        self.conn = get_db_connection()
    
    def inner_joins(self):
        """INNER JOIN examples - only matching records"""
        cursor = self.conn.cursor()
        
        # Posts with author information
        cursor.execute('''
            SELECT 
                p.id,
                p.title,
                p.created_at,
                u.username as author,
                u.email as author_email
            FROM posts p
            INNER JOIN users u ON p.author_id = u.id
            WHERE p.published = 1
            ORDER BY p.created_at DESC
        ''')
        published_posts = cursor.fetchall()
        
        # Posts with both author and category
        cursor.execute('''
            SELECT 
                p.title,
                u.username as author,
                c.name as category
            FROM posts p
            INNER JOIN users u ON p.author_id = u.id
            INNER JOIN categories c ON p.category_id = c.id
            WHERE p.published = 1
        ''')
        posts_with_details = cursor.fetchall()
        
        return {
            'published_posts': [dict(row) for row in published_posts],
            'posts_with_details': [dict(row) for row in posts_with_details]
        }
    
    def left_joins(self):
        """LEFT JOIN examples - all records from left table"""
        cursor = self.conn.cursor()
        
        # All users with their post count (including users with no posts)
        cursor.execute('''
            SELECT 
                u.username,
                u.email,
                COUNT(p.id) as post_count
            FROM users u
            LEFT JOIN posts p ON u.id = p.author_id
            GROUP BY u.id, u.username, u.email
            ORDER BY post_count DESC
        ''')
        all_users_with_posts = cursor.fetchall()
        
        # All posts with comment count (including posts with no comments)
        cursor.execute('''
            SELECT 
                p.id,
                p.title,
                u.username as author,
                COUNT(c.id) as comment_count
            FROM posts p
            INNER JOIN users u ON p.author_id = u.id
            LEFT JOIN comments c ON p.id = c.post_id
            GROUP BY p.id, p.title, u.username
            ORDER BY comment_count DESC
        ''')
        posts_with_comments = cursor.fetchall()
        
        return {
            'all_users_with_posts': [dict(row) for row in all_users_with_posts],
            'posts_with_comments': [dict(row) for row in posts_with_comments]
        }

@app.route('/api/join-examples')
def join_examples():
    """API endpoint for join demonstrations"""
    join_queries = JoinQueries()
    try:
        inner_results = join_queries.inner_joins()
        left_results = join_queries.left_joins()
        
        return jsonify({
            'inner_joins': inner_results,
            'left_joins': left_results
        })
    finally:
        join_queries.close()

if __name__ == '__main__':
    app.run(debug=True)

```

## Try it

/// details | Exercise 1: Basic CRUD Operations
    type: question
    open: false

**Scenario**: You need to implement user management for a blog system with proper error handling.

**Tasks**:

1. Write a CREATE operation that prevents duplicate usernames

2. Write a READ operation that retrieves users with their post count

3. Write an UPDATE operation that only modifies provided fields

/// details | Sample Solution
    type: success
    open: false

```python
def create_user_safe(username, email, password):
    """CREATE with duplicate prevention"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check for existing user first
        cursor.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            (username, email)
        )
        if cursor.fetchone():
            return {'error': 'Username or email already exists'}
        
        # Insert new user
        cursor.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            (username, email, generate_password_hash(password))
        )
        conn.commit()
        return {'success': True, 'user_id': cursor.lastrowid}
    
    except sqlite3.Error as e:
        return {'error': f'Database error: {str(e)}'}
    finally:
        conn.close()

def get_users_with_post_count():
    """READ with aggregated data"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            u.id, u.username, u.email,
            COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id
        GROUP BY u.id
        ORDER BY post_count DESC
    ''')
    return [dict(row) for row in cursor.fetchall()]

```

///
///

## Recap

This first part of database concepts covers:

- **CRUD operations** provide the foundation for all database interactions with proper error handling and security

- **SELECT operations** enable efficient data retrieval with field selection, filtering, and ordering

- **GROUP BY and aggregation** allow summarizing and analyzing data patterns

- **Table joins** combine related data from multiple tables using INNER and LEFT JOIN patterns

- **Safe parameterized queries** prevent SQL injection attacks through proper parameter binding

Understanding these SQL fundamentals enables developers to build secure, efficient data access layers for web applications while maintaining data integrity and performance.

### Object-Relational Mapping (ORM) fundamentals

ORMs provide an abstraction layer that maps database tables to Python classes and rows to objects:

```python
# SQLAlchemy ORM example - setting up models
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog_orm.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ORM Models - Classes map to tables
class User(db.Model):
    """User model demonstrating ORM class-to-table mapping"""
    __tablename__ = 'users'
    
    # Columns defined as class attributes
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships - ORM handles joins automatically
    posts = db.relationship('Post', backref='author', lazy=True)
    comments = db.relationship('Comment', backref='author', lazy=True)
    
    def set_password(self, password):
        """Hash and store password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert object to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<User {self.username}>'

class Category(db.Model):
    """Category model"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    
    # One-to-many relationship
    posts = db.relationship('Post', backref='category', lazy=True)

class Post(db.Model):
    """Post model with foreign key relationships"""
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    
    # One-to-many relationship
    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')

class Comment(db.Model):
    """Comment model"""
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# Create tables
with app.app_context():
    db.create_all()

```

### ORM vs Raw SQL comparison

Comparing the same operations using ORM and raw SQL approaches:

```python
# Direct comparison: ORM vs Raw SQL
import sqlite3
from sqlalchemy import text

class DatabaseComparison:
    """Compare ORM and raw SQL approaches"""
    
    def __init__(self):
        self.raw_conn = sqlite3.connect('blog_raw.db')
        self.raw_conn.row_factory = sqlite3.Row
    
    # CREATE operations comparison
    def create_user_raw_sql(self, username, email, password):
        """Raw SQL user creation"""
        cursor = self.raw_conn.cursor()
        try:
            password_hash = generate_password_hash(password)
            cursor.execute('''
                INSERT INTO users (username, email, password_hash) 
                VALUES (?, ?, ?)
            ''', (username, email, password_hash))
            self.raw_conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            return None
    
    def create_user_orm(self, username, email, password):
        """ORM user creation"""
        try:
            user = User(username=username, email=email)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            return user.id
        except Exception:
            db.session.rollback()
            return None
    
    # READ operations comparison
    def get_users_with_post_count_raw(self):
        """Raw SQL with JOIN and aggregation"""
        cursor = self.raw_conn.cursor()
        cursor.execute('''
            SELECT 
                u.id, u.username, u.email,
                COUNT(p.id) as post_count
            FROM users u
            LEFT JOIN posts p ON u.id = p.author_id
            WHERE u.is_active = 1
            GROUP BY u.id, u.username, u.email
            ORDER BY post_count DESC
        ''')
        return [dict(row) for row in cursor.fetchall()]
    
    def get_users_with_post_count_orm(self):
        """ORM equivalent with relationship loading"""
        from sqlalchemy import func
        
        users = db.session.query(
            User.id,
            User.username,
            User.email,
            func.count(Post.id).label('post_count')
        ).outerjoin(Post).filter(
            User.is_active == True
        ).group_by(
            User.id, User.username, User.email
        ).order_by(
            func.count(Post.id).desc()
        ).all()
        
        return [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'post_count': user.post_count
            }
            for user in users
        ]
    
    # Complex query comparison
    def get_recent_posts_with_details_raw(self, days=30):
        """Complex raw SQL query"""
        cursor = self.raw_conn.cursor()
        cursor.execute('''
            SELECT 
                p.id, p.title, p.created_at,
                u.username as author_name,
                c.name as category_name,
                COUNT(cm.id) as comment_count
            FROM posts p
            INNER JOIN users u ON p.author_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN comments cm ON p.id = cm.post_id
            WHERE p.published = 1 
              AND p.created_at > date('now', '-' || ? || ' days')
            GROUP BY p.id, p.title, p.created_at, u.username, c.name
            ORDER BY p.created_at DESC
            LIMIT 10
        ''', (days,))
        return [dict(row) for row in cursor.fetchall()]
    
    def get_recent_posts_with_details_orm(self, days=30):
        """ORM equivalent using relationships"""
        from sqlalchemy import func, and_
        from datetime import datetime, timedelta
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        posts = db.session.query(
            Post.id,
            Post.title,
            Post.created_at,
            User.username.label('author_name'),
            Category.name.label('category_name'),
            func.count(Comment.id).label('comment_count')
        ).join(User).outerjoin(Category).outerjoin(Comment).filter(
            and_(Post.published == True, Post.created_at > cutoff_date)
        ).group_by(
            Post.id, Post.title, Post.created_at, User.username, Category.name
        ).order_by(Post.created_at.desc()).limit(10).all()
        
        return [
            {
                'id': post.id,
                'title': post.title,
                'created_at': post.created_at.isoformat(),
                'author_name': post.author_name,
                'category_name': post.category_name,
                'comment_count': post.comment_count
            }
            for post in posts
        ]

# Performance and trade-offs demonstration
@app.route('/api/comparison-demo')
def comparison_demo():
    """API endpoint demonstrating ORM vs Raw SQL"""
    comparison = DatabaseComparison()
    
    import time
    
    # Time raw SQL query
    start_time = time.time()
    raw_results = comparison.get_recent_posts_with_details_raw()
    raw_time = time.time() - start_time
    
    # Time ORM query
    start_time = time.time()
    orm_results = comparison.get_recent_posts_with_details_orm()
    orm_time = time.time() - start_time
    
    return jsonify({
        'raw_sql': {
            'execution_time': f'{raw_time:.4f}s',
            'result_count': len(raw_results),
            'sample_result': raw_results[0] if raw_results else None
        },
        'orm': {
            'execution_time': f'{orm_time:.4f}s',
            'result_count': len(orm_results),
            'sample_result': orm_results[0] if orm_results else None
        },
        'performance_note': 'Times may vary based on data size and query complexity'
    })

```

### Trade-offs analysis: ORM vs Raw SQL

Understanding when to use each approach:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "ORM Benefits" {
  component "Productivity" as orm_prod
  component "Abstraction" as orm_abs
  component "Portability" as orm_port
  component "Relationships" as orm_rel
}

package "Raw SQL Benefits" {
  component "Performance" as sql_perf
  component "Control" as sql_ctrl
  component "Optimization" as sql_opt
  component "Flexibility" as sql_flex
}

package "Decision Factors" {
  component "Project Size" as factor_size
  component "Team Skills" as factor_skills
  component "Performance Needs" as factor_perf
}

note bottom of orm_prod : Faster development\nLess boilerplate code\nObject-oriented approach
note bottom of orm_abs : Database independence\nAutomatic migrations\nBuilt-in validation
note bottom of orm_port : Multiple DB support\nEasy testing\nConsistent interface
note bottom of orm_rel : Automatic joins\nLazy loading\nRelationship management

note bottom of sql_perf : Direct database access\nMinimal overhead\nOptimized queries
note bottom of sql_ctrl : Exact query control\nCustom functions\nDatabase-specific features
note bottom of sql_opt : Manual optimization\nCustom indexes\nQuery planning
note bottom of sql_flex : Complex queries\nStored procedures\nAdvanced SQL features

note bottom of factor_size : Small/Medium → ORM\nLarge/Complex → Mixed
note bottom of factor_skills : Junior developers → ORM\nSQL experts → Raw SQL
note bottom of factor_perf : Standard CRUD → ORM\nHigh performance → Raw SQL
@enduml

```

```python
# Trade-offs demonstration with practical examples
class ORMTradeoffDemo:
    """Demonstrate ORM vs Raw SQL trade-offs"""
    
    def productivity_comparison(self):
        """Show development speed differences"""
        
        # ORM: Simple and readable
        orm_example = '''
        # ORM - Create user with posts
        user = User(username='john', email='john@example.com')
        db.session.add(user)
        
        post1 = Post(title='First Post', content='Content...', author=user)
        post2 = Post(title='Second Post', content='More content...', author=user)
        
        db.session.add_all([post1, post2])
        db.session.commit()
        
        # Query with relationships
        posts_with_authors = Post.query.join(User).all()
        '''
        
        # Raw SQL: More verbose but explicit
        raw_sql_example = '''
        # Raw SQL - Same operations
        cursor.execute("INSERT INTO users (username, email) VALUES (?, ?)", 
                      ('john', 'john@example.com'))
        user_id = cursor.lastrowid
        
        cursor.execute("INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)",
                      ('First Post', 'Content...', user_id))
        cursor.execute("INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)",
                      ('Second Post', 'More content...', user_id))
        conn.commit()
        
        # Query with join
        cursor.execute("""
            SELECT p.*, u.username, u.email 
            FROM posts p 
            JOIN users u ON p.author_id = u.id
        """)
        '''
        
        return {
            'orm_approach': {
                'code': orm_example.strip(),
                'lines_of_code': len(orm_example.strip().split('\n')),
                'readability': 'High - object-oriented, intuitive',
                'maintenance': 'Easy - relationship changes handled automatically'
            },
            'raw_sql_approach': {
                'code': raw_sql_example.strip(),
                'lines_of_code': len(raw_sql_example.strip().split('\n')),
                'readability': 'Moderate - requires SQL knowledge',
                'maintenance': 'Manual - schema changes need code updates'
            }
        }
    
    def performance_scenarios(self):
        """Analyze performance characteristics"""
        
        scenarios = {
            'simple_crud': {
                'description': 'Basic create, read, update, delete operations',
                'orm_performance': 'Good - minimal overhead',
                'sql_performance': 'Slightly better - direct queries',
                'recommendation': 'Use ORM - productivity benefits outweigh small performance cost'
            },
            'complex_reporting': {
                'description': 'Multi-table joins with aggregations',
                'orm_performance': 'Poor - may generate inefficient queries',
                'sql_performance': 'Excellent - hand-optimized queries',
                'recommendation': 'Use raw SQL - performance critical'
            },
            'bulk_operations': {
                'description': 'Processing thousands of records',
                'orm_performance': 'Poor - object overhead per record',
                'sql_performance': 'Excellent - bulk operations optimized',
                'recommendation': 'Use raw SQL or ORM bulk methods'
            },
            'rapid_prototyping': {
                'description': 'Building MVP or proof of concept',
                'orm_performance': 'Acceptable - fast development',
                'sql_performance': 'Good but slower development',
                'recommendation': 'Use ORM - speed to market important'
            }
        }
        
        return scenarios
    
    def decision_framework(self):
        """Provide framework for choosing approach"""
        
        return {
            'use_orm_when': [
                'Building CRUD applications',
                'Team has limited SQL experience',
                'Database portability is important',
                'Rapid development is priority',
                'Working with object-oriented patterns',
                'Automatic migration management needed'
            ],
            'use_raw_sql_when': [
                'Performance is critical',
                'Complex reporting requirements',
                'Using database-specific features',
                'Team has strong SQL skills',
                'Fine-grained query control needed',
                'Working with legacy database schemas'
            ],
            'hybrid_approach': [
                'Use ORM for standard CRUD operations',
                'Use raw SQL for complex queries and reports',
                'Use ORM for development speed, optimize with SQL later',
                'Consider ORM query compilation to understand generated SQL'
            ]
        }

@app.route('/api/orm-tradeoffs')
def orm_tradeoffs():
    """API endpoint for ORM trade-off analysis"""
    demo = ORMTradeoffDemo()
    
    return jsonify({
        'productivity_comparison': demo.productivity_comparison(),
        'performance_scenarios': demo.performance_scenarios(),
        'decision_framework': demo.decision_framework()
    })

if __name__ == '__main__':
    app.run(debug=True)

```

## Additional exercises

/// details | Exercise 2: ORM Implementation
    type: question
    open: false

**Scenario**: Convert a raw SQL user management system to use SQLAlchemy ORM.

**Tasks**:

1. Design ORM models for User and UserProfile tables

2. Implement the same query using both raw SQL and ORM

3. Analyze the trade-offs for your specific use case

/// details | Sample Solution
    type: success
    open: false

```python
# ORM Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    # One-to-one relationship
    profile = db.relationship('UserProfile', backref='user', uselist=False)

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bio = db.Column(db.Text)
    location = db.Column(db.String(100))

# Query comparison
# Raw SQL:
cursor.execute("""
    SELECT u.username, u.email, p.bio, p.location 
    FROM users u 
    LEFT JOIN user_profiles p ON u.id = p.user_id 
    WHERE u.username LIKE ?
""", ('%john%',))

# ORM equivalent:
users = User.query.join(UserProfile, isouter=True).filter(
    User.username.like('%john%')
).all()

```

**Trade-off analysis**:

- **ORM Benefits**: Automatic relationship handling, type safety, easier testing

- **Raw SQL Benefits**: More explicit, potentially better performance for complex queries

- **Recommendation**: Use ORM for this case - relationship benefits outweigh complexity
///
///

## Summary

Database fundamentals and ORM comparison provide essential backend development skills:

- **CRUD operations** form the foundation with proper error handling and security through parameterized queries

- **SQL queries** enable complex data retrieval using SELECT, WHERE, GROUP BY, and JOIN operations

- **Table relationships** model real-world data connections using foreign keys and proper join strategies

- **ORM mapping** provides productivity benefits by converting between objects and database rows automatically

- **Trade-off analysis** helps developers choose between ORM abstraction and raw SQL control based on project needs

- **Hybrid approaches** allow leveraging ORM productivity while maintaining SQL performance where critical

Understanding both approaches enables developers to make informed decisions about data access patterns while building secure, maintainable web applications.
