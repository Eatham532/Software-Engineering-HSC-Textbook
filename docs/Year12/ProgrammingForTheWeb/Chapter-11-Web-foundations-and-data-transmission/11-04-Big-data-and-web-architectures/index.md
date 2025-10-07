# 11.4 Big data and web architectures

## Why it matters

Modern web applications handle massive amounts of data and serve millions of users. Understanding how to extract insights from data and design scalable architectures helps you build systems that can grow from handling dozens to millions of users without falling over.

## Concepts

### Data mining and extracting insights

Data mining finds patterns and insights in large datasets. Web applications generate enormous amounts of data from user interactions, and mining this data helps improve services and make business decisions.

```python
import json
from collections import Counter
from datetime import datetime, timedelta

class WebAnalytics:
    """Simple web analytics data mining example."""
    
    def __init__(self):
        # Simulated web server log data
        self.page_views = [
            {"url": "/home", "user_id": "user123", "timestamp": "2024-01-15 10:30:00", "user_agent": "Chrome"},
            {"url": "/products", "user_id": "user456", "timestamp": "2024-01-15 10:35:00", "user_agent": "Firefox"},
            {"url": "/home", "user_id": "user789", "timestamp": "2024-01-15 10:40:00", "user_agent": "Safari"},
            {"url": "/checkout", "user_id": "user123", "timestamp": "2024-01-15 10:45:00", "user_agent": "Chrome"},
            {"url": "/products", "user_id": "user456", "timestamp": "2024-01-15 10:50:00", "user_agent": "Firefox"},
        ]
        
        self.user_sessions = [
            {"user_id": "user123", "session_length": 1200, "pages_visited": 5, "converted": True},
            {"user_id": "user456", "session_length": 800, "pages_visited": 3, "converted": False},
            {"user_id": "user789", "session_length": 300, "pages_visited": 1, "converted": False},
        ]
    
    def find_popular_pages(self):
        """Mine data to find most visited pages."""
        page_counts = Counter(view["url"] for view in self.page_views)
        
        print("=== Popular Pages Analysis ===")
        for page, count in page_counts.most_common():
            print(f"{page}: {count} visits")
        
        return page_counts
    
    def analyze_user_behavior(self):
        """Extract patterns from user behavior data."""
        print("\n=== User Behavior Analysis ===")
        
        # Calculate conversion rate
        total_users = len(self.user_sessions)
        converted_users = sum(1 for session in self.user_sessions if session["converted"])
        conversion_rate = (converted_users / total_users) * 100
        
        print(f"Conversion rate: {conversion_rate:.1f}%")
        
        # Find patterns in successful conversions
        converters = [s for s in self.user_sessions if s["converted"]]
        non_converters = [s for s in self.user_sessions if not s["converted"]]
        
        if converters:
            avg_converter_pages = sum(s["pages_visited"] for s in converters) / len(converters)
            avg_converter_time = sum(s["session_length"] for s in converters) / len(converters)
            
            print(f"Successful users visit {avg_converter_pages:.1f} pages on average")
            print(f"Successful users spend {avg_converter_time:.0f} seconds on average")
    
    def detect_browser_trends(self):
        """Mine browser usage patterns."""
        browser_usage = Counter(view["user_agent"] for view in self.page_views)
        
        print("\n=== Browser Usage Trends ===")
        total_views = len(self.page_views)
        for browser, count in browser_usage.most_common():
            percentage = (count / total_views) * 100
            print(f"{browser}: {percentage:.1f}% of traffic")

# Example usage
analytics = WebAnalytics()
analytics.find_popular_pages()
analytics.analyze_user_behavior()
analytics.detect_browser_trends()

```

### Metadata: data about data

Metadata describes and organizes data, making it easier to find, understand, and use. In web applications, metadata helps with search, categorization, and data management.

```python
class ContentMetadata:
    """Managing metadata for web content."""
    
    def __init__(self):
        self.articles = [
            {
                "id": 1,
                "title": "Getting Started with Python",
                "content": "Python is a beginner-friendly programming language...",
                "metadata": {
                    "author": "Alice Smith",
                    "created_date": "2024-01-10",
                    "tags": ["python", "programming", "beginner"],
                    "category": "tutorial",
                    "reading_time": 5,
                    "difficulty": "easy",
                    "language": "en",
                    "word_count": 500
                }
            },
            {
                "id": 2,
                "title": "Advanced Web Security",
                "content": "Understanding SSL/TLS protocols and certificate management...",
                "metadata": {
                    "author": "Bob Johnson",
                    "created_date": "2024-01-12",
                    "tags": ["security", "web", "ssl", "tls"],
                    "category": "security",
                    "reading_time": 12,
                    "difficulty": "advanced",
                    "language": "en",
                    "word_count": 1200
                }
            }
        ]
    
    def search_by_metadata(self, **criteria):
        """Search content using metadata criteria."""
        results = []
        
        for article in self.articles:
            metadata = article["metadata"]
            matches = True
            
            for key, value in criteria.items():
                if key == "tags":
                    # Check if any search tags match article tags
                    if not any(tag in metadata.get("tags", []) for tag in value):
                        matches = False
                        break
                elif key == "max_reading_time":
                    if metadata.get("reading_time", 0) > value:
                        matches = False
                        break
                elif key == "min_reading_time":
                    if metadata.get("reading_time", 0) < value:
                        matches = False
                        break
                else:
                    if metadata.get(key) != value:
                        matches = False
                        break
            
            if matches:
                results.append(article)
        
        return results
    
    def generate_content_report(self):
        """Use metadata to generate insights about content."""
        print("=== Content Analytics Using Metadata ===")
        
        # Author productivity
        author_counts = {}
        for article in self.articles:
            author = article["metadata"]["author"]
            author_counts[author] = author_counts.get(author, 0) + 1
        
        print("Articles by author:")
        for author, count in author_counts.items():
            print(f"  {author}: {count} articles")
        
        # Difficulty distribution
        difficulties = [article["metadata"]["difficulty"] for article in self.articles]
        difficulty_counts = Counter(difficulties)
        
        print("\nDifficulty distribution:")
        for difficulty, count in difficulty_counts.items():
            print(f"  {difficulty}: {count} articles")
        
        # Average reading time by category
        category_times = {}
        category_counts = {}
        
        for article in self.articles:
            category = article["metadata"]["category"]
            reading_time = article["metadata"]["reading_time"]
            
            if category not in category_times:
                category_times[category] = 0
                category_counts[category] = 0
            
            category_times[category] += reading_time
            category_counts[category] += 1
        
        print("\nAverage reading time by category:")
        for category in category_times:
            avg_time = category_times[category] / category_counts[category]
            print(f"  {category}: {avg_time:.1f} minutes")

# Example usage
content_system = ContentMetadata()

# Search examples
python_articles = content_system.search_by_metadata(tags=["python"])
quick_reads = content_system.search_by_metadata(max_reading_time=10)
security_content = content_system.search_by_metadata(category="security")

print("Python articles:", len(python_articles))
print("Quick reads (≤10 min):", len(quick_reads))
print("Security content:", len(security_content))

content_system.generate_content_report()

```

### Streaming challenges

Streaming data arrives continuously and must be processed in real-time. This creates unique challenges for web applications handling live data feeds, real-time analytics, or user interactions.

```python
import time
import threading
from queue import Queue
from collections import deque

class DataStream:
    """Simulate real-time data streaming challenges."""
    
    def __init__(self, buffer_size=100):
        self.data_queue = Queue()
        self.processed_data = deque(maxlen=buffer_size)
        self.is_streaming = False
        self.dropped_messages = 0
        self.processing_errors = 0
    
    def start_data_stream(self):
        """Simulate incoming data stream."""
        self.is_streaming = True
        
        def generate_data():
            message_id = 1
            while self.is_streaming:
                # Simulate variable data arrival rates
                data = {
                    "id": message_id,
                    "timestamp": time.time(),
                    "value": message_id * 2,
                    "source": "sensor_01"
                }
                
                # Handle queue overflow (common streaming challenge)
                if self.data_queue.qsize() > 50:
                    self.dropped_messages += 1
                    print(f"⚠️  Buffer overflow! Dropped message {message_id}")
                else:
                    self.data_queue.put(data)
                
                message_id += 1
                time.sleep(0.1)  # 10 messages per second
        
        # Start data generation in background thread
        threading.Thread(target=generate_data, daemon=True).start()
        print("📡 Data stream started...")
    
    def process_stream(self, duration=5):
        """Process streaming data with error handling."""
        print(f"🔄 Processing stream for {duration} seconds...")
        
        start_time = time.time()
        processed_count = 0
        
        while time.time() - start_time < duration:
            try:
                if not self.data_queue.empty():
                    data = self.data_queue.get(timeout=1)
                    
                    # Simulate processing time and potential errors
                    if data["value"] % 13 == 0:  # Simulate occasional errors
                        self.processing_errors += 1
                        print(f"❌ Error processing message {data['id']}")
                        continue
                    
                    # Process successfully
                    processed_data = {
                        "id": data["id"],
                        "processed_value": data["value"] * 1.5,
                        "processing_time": time.time()
                    }
                    
                    self.processed_data.append(processed_data)
                    processed_count += 1
                    
                    if processed_count % 10 == 0:
                        print(f"✅ Processed {processed_count} messages")
                
                time.sleep(0.05)  # Simulate processing time
                
            except Exception as e:
                self.processing_errors += 1
                print(f"❌ Processing error: {e}")
        
        self.stop_stream()
        self.print_streaming_stats(processed_count)
    
    def stop_stream(self):
        """Stop the data stream."""
        self.is_streaming = False
        print("🛑 Data stream stopped")
    
    def print_streaming_stats(self, processed_count):
        """Show streaming performance statistics."""
        print(f"\n=== Streaming Performance Report ===")
        print(f"Messages processed: {processed_count}")
        print(f"Messages dropped: {self.dropped_messages}")
        print(f"Processing errors: {self.processing_errors}")
        print(f"Buffer utilization: {len(self.processed_data)} / {self.processed_data.maxlen}")
        
        if processed_count > 0:
            success_rate = ((processed_count) / (processed_count + self.dropped_messages + self.processing_errors)) * 100
            print(f"Success rate: {success_rate:.1f}%")

# Example: streaming challenges demo
stream = DataStream(buffer_size=20)
stream.start_data_stream()
stream.process_stream(duration=3)

```

### Web architecture patterns

Different architectural patterns solve different scaling and complexity challenges. Each has trade-offs in terms of development complexity, scalability, and operational overhead.

```python
class ArchitecturePatterns:
    """Demonstrate different web architecture patterns."""
    
    def monolithic_architecture(self):
        """Single deployable unit containing all functionality."""
        print("=== Monolithic Architecture ===")
        print("Pros:")
        print("  - Simple to develop and deploy initially")
        print("  - Easy to test end-to-end")
        print("  - No network latency between components")
        print("  - Simpler monitoring and debugging")
        
        print("\nCons:")
        print("  - Difficult to scale individual components")
        print("  - Technology lock-in (entire app uses same stack)")
        print("  - Large codebase becomes hard to maintain")
        print("  - Risk of entire system failure")
        
        print("\nBest for:")
        print("  - Small to medium applications")
        print("  - Teams with limited DevOps experience")
        print("  - Applications with tightly coupled features")
    
    def microservices_architecture(self):
        """Multiple small, independent services."""
        print("\n=== Microservices Architecture ===")
        print("Pros:")
        print("  - Independent scaling of services")
        print("  - Different technologies for different services")
        print("  - Fault isolation (one service failure doesn't kill all)")
        print("  - Easier to maintain smaller codebases")
        
        print("\nCons:")
        print("  - Complex deployment and orchestration")
        print("  - Network latency between services")
        print("  - Distributed system debugging challenges")
        print("  - Data consistency across services")
        
        print("\nBest for:")
        print("  - Large applications with distinct domains")
        print("  - Organizations with strong DevOps practices")
        print("  - Applications requiring different scaling patterns")
    
    def serverless_architecture(self):
        """Functions-as-a-Service (FaaS) event-driven approach."""
        print("\n=== Serverless Architecture ===")
        print("Pros:")
        print("  - Pay only for actual usage")
        print("  - Automatic scaling to zero")
        print("  - No server management required")
        print("  - Built-in fault tolerance")
        
        print("\nCons:")
        print("  - Cold start latency")
        print("  - Vendor lock-in concerns")
        print("  - Limited execution time per function")
        print("  - Complex debugging and monitoring")
        
        print("\nBest for:")
        print("  - Event-driven applications")
        print("  - Applications with variable or unpredictable load")
        print("  - Teams wanting to focus on business logic")

# Demonstrate scaling concerns
class ScalingChallenges:
    """Show how different concerns affect architectural choices."""
    
    def demonstrate_scaling_decisions(self):
        """Show decision points for scaling."""
        scenarios = [
            {
                "name": "Startup MVP",
                "users": "< 1,000",
                "recommendation": "Monolithic",
                "reasoning": "Simple deployment, fast development, low operational overhead"
            },
            {
                "name": "Growing SaaS",
                "users": "10,000 - 100,000",
                "recommendation": "Monolithic with caching",
                "reasoning": "Add database scaling and CDN before architectural complexity"
            },
            {
                "name": "Large Enterprise",
                "users": "1M+",
                "recommendation": "Microservices",
                "reasoning": "Independent team scaling, different performance requirements"
            },
            {
                "name": "Event Processing",
                "users": "Variable",
                "recommendation": "Serverless",
                "reasoning": "Unpredictable load, event-driven processing"
            }
        ]
        
        print("=== Scaling Decision Matrix ===")
        for scenario in scenarios:
            print(f"\n{scenario['name']} ({scenario['users']} users):")
            print(f"  Recommended: {scenario['recommendation']}")
            print(f"  Why: {scenario['reasoning']}")

# Example usage
patterns = ArchitecturePatterns()
patterns.monolithic_architecture()
patterns.microservices_architecture()
patterns.serverless_architecture()

scaling = ScalingChallenges()
scaling.demonstrate_scaling_decisions()

```

### Architecture visualization

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "Monolithic Architecture" {
    rectangle "Single Application" as mono {
        component "User Interface"
        component "Business Logic"
        component "Data Access"
        database "Single Database"
    }
    [User Interface] --> [Business Logic]
    [Business Logic] --> [Data Access]
    [Data Access] --> [Single Database]
}

package "Microservices Architecture" {
    rectangle "User Service" as user_svc {
        component "User API"
        database "User DB"
    }
    
    rectangle "Order Service" as order_svc {
        component "Order API"
        database "Order DB"
    }
    
    rectangle "Payment Service" as payment_svc {
        component "Payment API"
        database "Payment DB"
    }
    
    component "API Gateway"
    [API Gateway] --> [User API]
    [API Gateway] --> [Order API]
    [API Gateway] --> [Payment API]
}

package "Serverless Architecture" {
    cloud "Function Platform" {
        component "Auth Function"
        component "Data Function"
        component "Process Function"
    }
    
    component "Event Triggers"
    database "Managed Database"
    
    [Event Triggers] --> [Auth Function]
    [Event Triggers] --> [Data Function]
    [Event Triggers] --> [Process Function]
    
    [Auth Function] --> [Managed Database]
    [Data Function] --> [Managed Database]
    [Process Function] --> [Managed Database]
}
@enduml

```

## Try it

/// details | Exercise 1: Data Mining Analysis
    type: question
    open: false

Create a simple data mining system for a fictional e-commerce website:

1. Generate sample user interaction data (page views, purchases, search queries)

2. Implement functions to find patterns like:

   - Most popular products

   - User behavior leading to purchases

   - Peak usage times

3. Create a simple recommendation system based on the patterns

/// details | Sample Solution
    type: success
    open: false

```python
import random
from datetime import datetime, timedelta
from collections import Counter, defaultdict

class EcommerceAnalytics:
    def __init__(self):
        # Generate sample data
        self.interactions = self.generate_sample_data()
        
    def generate_sample_data(self):
        """Generate realistic e-commerce interaction data."""
        products = ["laptop", "phone", "headphones", "tablet", "mouse", "keyboard"]
        users = [f"user_{i}" for i in range(1, 101)]
        actions = ["view", "add_to_cart", "purchase", "search"]
        
        interactions = []
        base_time = datetime.now() - timedelta(days=30)
        
        for i in range(1000):
            interaction = {
                "user_id": random.choice(users),
                "product": random.choice(products),
                "action": random.choice(actions),
                "timestamp": base_time + timedelta(minutes=random.randint(0, 43200)),
                "value": random.randint(50, 1000) if random.choice(actions) == "purchase" else 0
            }
            interactions.append(interaction)
        
        return interactions
    
    def find_popular_products(self):
        """Identify most popular products."""
        product_popularity = Counter()
        
        for interaction in self.interactions:
            if interaction["action"] in ["view", "purchase"]:
                product_popularity[interaction["product"]] += 1
        
        print("=== Most Popular Products ===")
        for product, count in product_popularity.most_common(5):
            print(f"{product}: {count} interactions")
        
        return product_popularity
    
    def analyze_purchase_behavior(self):
        """Find patterns leading to purchases."""
        user_journeys = defaultdict(list)
        
        # Group interactions by user
        for interaction in self.interactions:
            user_journeys[interaction["user_id"]].append(interaction)
        
        # Analyze successful purchase journeys
        purchase_patterns = []
        
        for user_id, journey in user_journeys.items():
            # Sort by timestamp
            journey.sort(key=lambda x: x["timestamp"])
            
            # Find purchases and preceding actions
            for i, interaction in enumerate(journey):
                if interaction["action"] == "purchase":
                    # Look at actions in the 2 steps before purchase
                    preceding_actions = [j["action"] for j in journey[max(0, i-2):i]]
                    purchase_patterns.append(preceding_actions)
        
        print("\n=== Purchase Journey Patterns ===")
        pattern_counts = Counter(tuple(pattern) for pattern in purchase_patterns)
        
        for pattern, count in pattern_counts.most_common(5):
            print(f"Pattern {' → '.join(pattern)} → purchase: {count} times")
    
    def create_simple_recommendations(self, user_id):
        """Basic recommendation system."""
        # Find what this user has interacted with
        user_products = set()
        for interaction in self.interactions:
            if interaction["user_id"] == user_id:
                user_products.add(interaction["product"])
        
        # Find what other users with similar interests bought
        similar_users = set()
        for interaction in self.interactions:
            if (interaction["product"] in user_products and 
                interaction["user_id"] != user_id):
                similar_users.add(interaction["user_id"])
        
        # Recommend products bought by similar users
        recommendations = Counter()
        for interaction in self.interactions:
            if (interaction["user_id"] in similar_users and 
                interaction["action"] == "purchase" and 
                interaction["product"] not in user_products):
                recommendations[interaction["product"]] += 1
        
        print(f"\n=== Recommendations for {user_id} ===")
        if recommendations:
            for product, score in recommendations.most_common(3):
                print(f"Recommend {product} (confidence: {score})")
        else:
            print("No recommendations available")

# Example usage
analytics = EcommerceAnalytics()
analytics.find_popular_products()
analytics.analyze_purchase_behavior()
analytics.create_simple_recommendations("user_1")

```

///
///

/// details | Exercise 2: Architecture Decision Tool
    type: question
    open: false

Build a simple tool that recommends architecture patterns based on project requirements:

1. Create a questionnaire about project characteristics (team size, expected users, budget, etc.)

2. Implement logic to recommend monolithic, microservices, or serverless

3. Explain the reasoning behind each recommendation

/// details | Sample Solution
    type: success
    open: false

```python
class ArchitectureAdvisor:
    """Tool to recommend web architecture patterns."""
    
    def __init__(self):
        self.scoring_weights = {
            "monolithic": 0,
            "microservices": 0,
            "serverless": 0
        }
    
    def assess_project(self):
        """Gather project information and make recommendations."""
        print("=== Web Architecture Advisor ===")
        print("Answer the following questions to get architecture recommendations:\n")
        
        # Team size assessment
        team_size = self.ask_multiple_choice(
            "What is your team size?",
            ["1-3 developers", "4-10 developers", "10+ developers"],
            [("monolithic", 3), ("monolithic", 2), ("microservices", 3)]
        )
        
        # Expected user load
        user_load = self.ask_multiple_choice(
            "Expected number of users?",
            ["< 1,000", "1,000 - 100,000", "100,000+", "Highly variable/unpredictable"],
            [("monolithic", 3), ("monolithic", 2), ("microservices", 3), ("serverless", 3)]
        )
        
        # Development speed priority
        speed_priority = self.ask_multiple_choice(
            "How important is fast initial development?",
            ["Critical - need MVP quickly", "Important but not critical", "Not a priority"],
            [("monolithic", 3), ("monolithic", 1), ("microservices", 2)]
        )
        
        # Operational complexity tolerance
        ops_complexity = self.ask_multiple_choice(
            "Team's operational/DevOps experience?",
            ["Limited", "Moderate", "Advanced"],
            [("monolithic", 3), ("microservices", 1), ("microservices", 3)]
        )
        
        # Scaling requirements
        scaling_needs = self.ask_multiple_choice(
            "Different parts of your app need different scaling?",
            ["No, everything scales together", "Some parts need more scaling", "Very different scaling needs"],
            [("monolithic", 3), ("microservices", 1), ("microservices", 3)]
        )
        
        # Budget constraints
        budget = self.ask_multiple_choice(
            "Budget for infrastructure and operations?",
            ["Very limited", "Moderate", "Flexible"],
            [("monolithic", 2), ("monolithic", 1), ("serverless", 2)]
        )
        
        return self.make_recommendation()
    
    def ask_multiple_choice(self, question, options, scoring):
        """Ask a multiple choice question and update scores."""
        print(f"{question}")
        for i, option in enumerate(options, 1):
            print(f"  {i}. {option}")
        
        while True:
            try:
                choice = int(input("Enter choice (number): ")) - 1
                if 0 <= choice < len(options):
                    # Update scores based on choice
                    arch_type, points = scoring[choice]
                    self.scoring_weights[arch_type] += points
                    print(f"Selected: {options[choice]}\n")
                    break
                else:
                    print("Please enter a valid choice number.")
            except ValueError:
                print("Please enter a number.")
    
    def make_recommendation(self):
        """Analyze scores and make recommendation."""
        print("=== Architecture Recommendation ===")
        
        # Find highest scoring architecture
        recommended = max(self.scoring_weights.items(), key=lambda x: x[1])
        arch_name, score = recommended
        
        print(f"Recommended Architecture: {arch_name.title()}")
        print(f"Confidence Score: {score}")
        
        # Provide reasoning
        self.explain_recommendation(arch_name)
        
        # Show alternative considerations
        self.show_alternatives()
    
    def explain_recommendation(self, architecture):
        """Explain why this architecture was recommended."""
        explanations = {
            "monolithic": [
                "✓ Simpler to develop and deploy initially",
                "✓ Lower operational complexity",
                "✓ Better for smaller teams and user bases",
                "✓ Faster initial development and testing"
            ],
            "microservices": [
                "✓ Better for large teams and user bases",
                "✓ Independent scaling of components",
                "✓ Technology diversity across services",
                "✓ Fault isolation and resilience"
            ],
            "serverless": [
                "✓ Pay-per-use cost model",
                "✓ Automatic scaling to zero",
                "✓ Reduced operational overhead",
                "✓ Good for variable or event-driven workloads"
            ]
        }
        
        print(f"\nWhy {architecture.title()}?")
        for reason in explanations[architecture]:
            print(f"  {reason}")
    
    def show_alternatives(self):
        """Show when to consider other architectures."""
        print(f"\nConsider alternatives if:")
        
        # Sort architectures by score
        sorted_archs = sorted(self.scoring_weights.items(), key=lambda x: x[1], reverse=True)
        
        for arch, score in sorted_archs[1:]:  # Skip the recommended one
            if arch == "monolithic":
                print(f"  • {arch.title()} if: team is small, simple requirements, need fast delivery")
            elif arch == "microservices":
                print(f"  • {arch.title()} if: large team, complex domain, different scaling needs")
            elif arch == "serverless":
                print(f"  • {arch.title()} if: event-driven, variable load, minimal ops team")

# Interactive example (commented out for demo)
# advisor = ArchitectureAdvisor()
# advisor.assess_project()

# Demo with preset answers
demo_advisor = ArchitectureAdvisor()
demo_advisor.scoring_weights = {"monolithic": 8, "microservices": 5, "serverless": 3}
demo_advisor.make_recommendation()

```

///
///

## Recap

Modern web applications must handle big data challenges and choose appropriate architectural patterns:

**Big Data Concepts:**

- **Data mining** extracts valuable patterns from user interactions and business data

- **Metadata** organizes and describes data, enabling better search and management

- **Streaming data** requires real-time processing with careful attention to buffering, error handling, and performance

**Architecture Patterns:**

- **Monolithic**: Simple, unified deployment good for smaller applications and teams

- **Microservices**: Independent services that scale separately, better for large, complex applications

- **Serverless**: Event-driven functions with automatic scaling, ideal for variable workloads

**Scaling Considerations:**

- Team size and operational expertise

- Expected user load and growth patterns

- Different scaling needs across application components

- Development speed vs operational complexity trade-offs

Understanding these concepts helps you make informed decisions about how to structure applications that can grow from serving hundreds to millions of users.
