# 12.2 Model elements that form a web development system

## Why it matters

Modern web applications are complex systems with multiple interconnected components. Understanding how client-side code, server-side logic, databases, and APIs work together helps developers design scalable, maintainable web solutions. This knowledge forms the foundation for building real-world web applications.

## Concepts

### Client-side (front-end) web programming

The client-side refers to everything that runs in the user's web browser. This includes:

- **HTML**: Structure and content of web pages

- **CSS**: Visual styling and layout

- **JavaScript**: Interactive behaviour and dynamic content

- **Progressive enhancement**: Building experiences that work across different browsers and capabilities

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

rectangle "Web Browser (Client)" {
  component "HTML" as html
  component "CSS" as css
  component "JavaScript" as js
  
  html --> css : styles
  html --> js : behaviour
}

note right of html : Structure and content
note right of css : Visual presentation
note right of js : Interactive features
@enduml

```text

### Server-side (back-end) web programming

The server-side handles requests from clients and processes business logic:

- **Request handling**: Processing HTTP requests from browsers

- **Routing**: Directing requests to appropriate code handlers

- **Business logic**: Core application functionality and data processing

```python
# Simple Python web server example using Flask
from flask import Flask, request, jsonify

app = Flask(__name__)

# Route handling - maps URLs to functions
@app.route('/')
def home():
    return "Welcome to our web application!"

@app.route('/api/user/<user_id>')
def get_user(user_id):
    # Business logic - process the request
    user_data = {
        'id': user_id,
        'name': 'Sample User',
        'email': 'user@example.com'
    }
    return jsonify(user_data)

if __name__ == '__main__':
    app.run(debug=True)

```text

### Database interfaces

Web applications need to store and retrieve data efficiently:

#### SQL-based (relational) databases

- **When to use**: Structured data with clear relationships, need for complex queries

- **Examples**: PostgreSQL, MySQL, SQLite

- **Strengths**: ACID properties, mature ecosystem, standardised query language

#### NoSQL systems

- **When to use**: Flexible data structures, rapid scaling, document-based storage

- **Examples**: MongoDB, Redis, DynamoDB

- **Strengths**: Schema flexibility, horizontal scaling, performance

```python
# Example: Python database interaction
import sqlite3

def get_user_orders(user_id):
    # SQL database example
    conn = sqlite3.connect('shop.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT orders.id, orders.total, products.name 
        FROM orders 
        JOIN products ON orders.product_id = products.id 
        WHERE orders.user_id = ?
    """, (user_id,))
    
    results = cursor.fetchall()
    conn.close()
    return results

```text

### Middleware, APIs, and third-party services

These components connect and extend web applications:

- **Middleware**: Software that sits between different parts of a system, handling cross-cutting concerns like authentication, logging, or data transformation

- **APIs (Application Programming Interfaces)**: Defined ways for different software components to communicate

- **Third-party services**: External services that provide functionality like payments, email, or cloud storage

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

actor User
participant "Client\n(Browser)" as Client
participant "Middleware\n(Authentication)" as Auth
participant "Web Server\n(Python/Flask)" as Server
participant "Database" as DB
participant "Third-party API\n(Payment Service)" as API

User -> Client : Make purchase
Client -> Auth : Send request
Auth -> Server : Authenticated request
Server -> DB : Store order data
Server -> API : Process payment
API -> Server : Payment confirmation
Server -> Client : Success response
Client -> User : Show confirmation
@enduml

```text

/// details | Building a simple web system
    type: info
    open: false

Let's trace how these elements work together in a basic online bookstore:

```python
# Simplified bookstore backend
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Middleware function for logging
@app.before_request
def log_request():
    print(f"Request: {request.method} {request.path}")

# Route for getting book information
@app.route('/api/books/<book_id>')
def get_book(book_id):
    # Database interaction
    conn = sqlite3.connect('bookstore.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT title, author, price FROM books WHERE id = ?", (book_id,))
    book = cursor.fetchone()
    conn.close()
    
    if book:
        return jsonify({
            'title': book[0],
            'author': book[1], 
            'price': book[2]
        })
    else:
        return jsonify({'error': 'Book not found'}), 404

# Route for processing orders (would integrate with payment API)
@app.route('/api/orders', methods=['POST'])
def create_order():
    order_data = request.json
    
    # Business logic: validate order
    if not order_data.get('book_id') or not order_data.get('customer_email'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # In a real app, this would:
    # 1. Save order to database
    # 2. Call payment processing API
    # 3. Send confirmation email
    
    return jsonify({'message': 'Order created successfully', 'order_id': 12345})

```text

The client-side JavaScript would then make requests to these endpoints:

```javascript
// Client-side code (runs in browser)
async function loadBook(bookId) {
    try {
        const response = await fetch(`/api/books/${bookId}`);
        const book = await response.json();
        
        // Update the webpage with book information
        document.getElementById('book-title').textContent = book.title;
        document.getElementById('book-author').textContent = book.author;
        document.getElementById('book-price').textContent = `$${book.price}`;
    } catch (error) {
        console.error('Error loading book:', error);
    }
}

```text

///

## Try it

/// details | Exercise 1: System Architecture Analysis
    type: question
    open: false

**Scenario**: You're designing a social media web application where users can post messages and follow other users.

**Tasks**:

1. Identify what functionality belongs on the client-side vs server-side

2. Decide whether to use SQL or NoSQL for storing user posts and relationships

3. List three middleware components you might need

/// details | Sample Solution
    type: success
    open: false

**Client-side functionality**:

- User interface for creating posts

- Real-time display of new messages

- Profile editing forms

- Image upload previews

**Server-side functionality**:

- User authentication and authorisation

- Post validation and storage

- Following/follower relationship management

- Feed generation algorithms

**Database choice**:

- SQL database for user accounts and relationships (clear structure, ACID properties important)

- Possibly NoSQL for posts and activity feeds (flexible content, high volume)

**Middleware components**:

- Authentication middleware (verify user sessions)

- Rate limiting middleware (prevent spam/abuse)

- Logging middleware (track system usage and errors)
///
///

/// details | Exercise 2: API Design
    type: question
    open: false

**Task**: Design a simple REST API for a library management system. List the endpoints you would need and what each one does.

/// details | Sample Solution
    type: success
    open: false

**Core endpoints**:

- `GET /api/books` - List all books

- `GET /api/books/{id}` - Get specific book details

- `POST /api/books` - Add new book (admin only)

- `PUT /api/books/{id}` - Update book information

- `DELETE /api/books/{id}` - Remove book from system

- `GET /api/users/{id}/loans` - Get user's current loans

- `POST /api/loans` - Check out a book

- `PUT /api/loans/{id}/return` - Return a borrowed book

Each endpoint would handle request validation, database operations, and return appropriate JSON responses.
///
///

## Recap

Web development systems consist of interconnected components that each serve specific purposes:

- **Client-side** handles user interface and interaction using HTML, CSS, and JavaScript

- **Server-side** processes requests, implements business logic, and manages data using languages like Python

- **Databases** store and retrieve data, with SQL databases for structured data and NoSQL for flexible schemas

- **Middleware and APIs** connect components and integrate external services

Understanding how these elements work together enables developers to design efficient, scalable web applications that meet user needs while maintaining good performance and security.







