# 13.3 Performance and page-load management

## Why it matters

!!! builds-on "Builds on"
    This section builds on [13.2 Databases: SQL, common queries and ORM comparison](../Section-02-Databases-SQL-common-queries-and-ORM-comparison/index.md).


Web performance directly impacts user experience, search engine rankings, and business outcomes. Studies show that even a 100ms delay in page load time can reduce conversion rates significantly. Understanding performance optimization techniques like caching, compression, asset bundling, and lazy loading enables developers to build fast, responsive web applications that provide excellent user experiences across different devices and network conditions.

## Concepts

### Caching strategies

Caching stores frequently accessed data in faster storage locations to reduce load times:

```python
# Server-side caching implementation with Flask
from flask import Flask, request, jsonify, make_response
import redis
import json
import time
import hashlib
from functools import wraps
from datetime import datetime, timedelta

app = Flask(__name__)

# Redis cache setup
try:
    cache = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    cache_available = True
except:
    cache_available = False
    print("Redis not available, using in-memory cache")

# In-memory cache fallback
memory_cache = {}

class CacheManager:
    """Manage different caching strategies"""
    
    def __init__(self):
        self.default_ttl = 300  # 5 minutes
    
    def set_cache(self, key, value, ttl=None):
        """Set cache value with TTL"""
        ttl = ttl or self.default_ttl
        
        if cache_available:
            cache.setex(key, ttl, json.dumps(value))
        else:
            # In-memory cache with expiration
            expiry = datetime.now() + timedelta(seconds=ttl)
            memory_cache[key] = {'value': value, 'expiry': expiry}
    
    def get_cache(self, key):
        """Get cache value"""
        if cache_available:
            cached = cache.get(key)
            return json.loads(cached) if cached else None
        else:
            # Check in-memory cache
            cached = memory_cache.get(key)
            if cached and datetime.now() < cached['expiry']:
                return cached['value']
            elif cached:
                # Expired, remove from cache
                del memory_cache[key]
            return None
    
    def delete_cache(self, key):
        """Delete cache entry"""
        if cache_available:
            cache.delete(key)
        else:
            memory_cache.pop(key, None)
    
    def cache_key(self, prefix, *args):
        """Generate cache key from arguments"""
        key_data = f"{prefix}:" + ":".join(str(arg) for arg in args)
        return hashlib.md5(key_data.encode()).hexdigest()

cache_manager = CacheManager()

def cache_result(ttl=300, key_prefix="default"):
    """Decorator for caching function results"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = cache_manager.cache_key(
                f"{key_prefix}:{f.__name__}", 
                *args, 
                *sorted(kwargs.items())
            )
            
            # Try to get from cache
            cached_result = cache_manager.get_cache(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = f(*args, **kwargs)
            cache_manager.set_cache(cache_key, result, ttl)
            return result
        return wrapper
    return decorator

# Example: Database query caching
@cache_result(ttl=600, key_prefix="user_stats")
def get_user_statistics():
    """Expensive database operation - cache for 10 minutes"""
    # Simulate database query
    time.sleep(0.5)  # Simulate slow query
    
    return {
        'total_users': 1500,
        'active_users': 1200,
        'new_users_today': 25,
        'generated_at': datetime.now().isoformat()
    }

@cache_result(ttl=1800, key_prefix="post_data")
def get_popular_posts(limit=10):
    """Cache popular posts for 30 minutes"""
    # Simulate expensive aggregation query
    time.sleep(0.3)
    
    return [
        {'id': i, 'title': f'Popular Post {i}', 'views': 1000 - i * 50}
        for i in range(1, limit + 1)
    ]

@app.route('/api/stats')
def stats():
    """Cached statistics endpoint"""
    start_time = time.time()
    data = get_user_statistics()
    execution_time = time.time() - start_time
    
    response = make_response(jsonify({
        'data': data,
        'execution_time': f'{execution_time:.3f}s',
        'cached': execution_time < 0.1  # Likely cached if very fast
    }))
    
    # Add cache headers
    response.headers['Cache-Control'] = 'public, max-age=300'
    response.headers['ETag'] = hashlib.md5(json.dumps(data).encode()).hexdigest()
    
    return response

@app.route('/api/posts/popular')
def popular_posts():
    """Cached popular posts with conditional requests"""
    limit = request.args.get('limit', 10, type=int)
    
    # Generate ETag for conditional requests
    etag_data = f"popular_posts:{limit}"
    etag = hashlib.md5(etag_data.encode()).hexdigest()
    
    # Check If-None-Match header
    if request.headers.get('If-None-Match') == etag:
        return '', 304  # Not Modified
    
    posts = get_popular_posts(limit)
    
    response = make_response(jsonify(posts))
    response.headers['ETag'] = etag
    response.headers['Cache-Control'] = 'public, max-age=1800'
    
    return response

```

### CDN integration and static asset caching

Content Delivery Networks distribute static assets globally for faster access:

```python
# CDN and static asset management
import os
from flask import url_for
from urllib.parse import urljoin

class CDNManager:
    """Manage CDN integration for static assets"""
    
    def __init__(self, app=None):
        self.app = app
        self.cdn_enabled = False
        self.cdn_domain = None
        self.asset_version = None
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize CDN configuration"""
        self.cdn_enabled = app.config.get('CDN_ENABLED', False)
        self.cdn_domain = app.config.get('CDN_DOMAIN', '')
        self.asset_version = app.config.get('ASSET_VERSION', '1.0.0')
        
        # Add template helper
        app.jinja_env.globals['cdn_url'] = self.cdn_url
    
    def cdn_url(self, filename):
        """Generate CDN URL for static assets"""
        if self.cdn_enabled and self.cdn_domain:
            # Use CDN for production
            base_url = f"https://{self.cdn_domain}"
            versioned_filename = f"{filename}?v={self.asset_version}"
            return urljoin(base_url, f"static/{versioned_filename}")
        else:
            # Use local static files for development
            return url_for('static', filename=filename)
    
    def set_cache_headers(self, response, max_age=86400):
        """Set appropriate cache headers for static assets"""
        response.headers['Cache-Control'] = f'public, max-age={max_age}'
        response.headers['Expires'] = (
            datetime.now() + timedelta(seconds=max_age)
        ).strftime('%a, %d %b %Y %H:%M:%S GMT')
        return response

# Configure Flask app for CDN
app.config.update(
    CDN_ENABLED=os.environ.get('CDN_ENABLED', 'false').lower() == 'true',
    CDN_DOMAIN=os.environ.get('CDN_DOMAIN', 'cdn.example.com'),
    ASSET_VERSION=os.environ.get('ASSET_VERSION', '1.0.0')
)

cdn_manager = CDNManager(app)

@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files with cache headers"""
    response = make_response(app.send_static_file(filename))
    
    # Set aggressive caching for versioned assets
    if '?v=' in request.url:
        # Versioned assets can be cached for a year
        cdn_manager.set_cache_headers(response, max_age=31536000)
    else:
        # Non-versioned assets cached for 1 day
        cdn_manager.set_cache_headers(response, max_age=86400)
    
    return response

# Asset bundling and compression
class AssetManager:
    """Manage asset bundling and compression"""
    
    def __init__(self):
        self.bundles = {
            'css': {
                'app': ['styles/main.css', 'styles/components.css'],
                'admin': ['styles/admin.css', 'styles/forms.css']
            },
            'js': {
                'app': ['js/app.js', 'js/components.js'],
                'admin': ['js/admin.js', 'js/charts.js']
            }
        }
    
    def get_bundle_files(self, bundle_type, bundle_name):
        """Get files for a specific bundle"""
        return self.bundles.get(bundle_type, {}).get(bundle_name, [])
    
    def generate_bundle_html(self, bundle_type, bundle_name):
        """Generate HTML for including bundle files"""
        files = self.get_bundle_files(bundle_type, bundle_name)
        html_parts = []
        
        for file_path in files:
            if bundle_type == 'css':
                url = cdn_manager.cdn_url(file_path)
                html_parts.append(f'<link rel="stylesheet" href="{url}">')
            elif bundle_type == 'js':
                url = cdn_manager.cdn_url(file_path)
                html_parts.append(f'<script src="{url}"></script>')
        
        return '\n'.join(html_parts)

asset_manager = AssetManager()

# Add template helpers
@app.context_processor
def inject_asset_helpers():
    return {
        'css_bundle': lambda name: asset_manager.generate_bundle_html('css', name),
        'js_bundle': lambda name: asset_manager.generate_bundle_html('js', name)
    }

```

### Compression techniques

Implementing compression to reduce transfer sizes:

```python
# Compression middleware and techniques
import gzip
import io
from flask import request

class CompressionMiddleware:
    """GZIP compression middleware for Flask"""
    
    def __init__(self, app, compress_level=6, minimum_size=500):
        self.app = app
        self.compress_level = compress_level
        self.minimum_size = minimum_size
        
        # Wrap the WSGI app
        app.wsgi_app = self.wsgi_middleware(app.wsgi_app)
    
    def wsgi_middleware(self, wsgi_app):
        """WSGI middleware for compression"""
        def middleware(environ, start_response):
            # Check if client accepts gzip
            accept_encoding = environ.get('HTTP_ACCEPT_ENCODING', '')
            if 'gzip' not in accept_encoding.lower():
                return wsgi_app(environ, start_response)
            
            # Capture response
            response_data = []
            status = None
            headers = None
            
            def capture_start_response(status_code, response_headers):
                nonlocal status, headers
                status = status_code
                headers = response_headers
                return lambda data: response_data.append(data)
            
            # Get response from app
            app_iter = wsgi_app(environ, capture_start_response)
            
            try:
                # Collect response data
                for data in app_iter:
                    response_data.append(data)
                
                # Combine response data
                response_body = b''.join(response_data)
                
                # Check if compression is worthwhile
                if len(response_body) < self.minimum_size:
                    start_response(status, headers)
                    return [response_body]
                
                # Check content type
                content_type = self.get_header(headers, 'content-type', '')
                if not self.should_compress(content_type):
                    start_response(status, headers)
                    return [response_body]
                
                # Compress response
                compressed_data = self.compress_data(response_body)
                
                # Update headers
                new_headers = self.update_headers(headers, len(compressed_data))
                
                start_response(status, new_headers)
                return [compressed_data]
                
            finally:
                if hasattr(app_iter, 'close'):
                    app_iter.close()
        
        return middleware
    
    def get_header(self, headers, name, default=''):
        """Get header value by name"""
        for header_name, header_value in headers:
            if header_name.lower() == name.lower():
                return header_value
        return default
    
    def should_compress(self, content_type):
        """Check if content type should be compressed"""
        compressible_types = [
            'text/', 'application/json', 'application/javascript',
            'application/xml', 'image/svg+xml'
        ]
        return any(content_type.startswith(ct) for ct in compressible_types)
    
    def compress_data(self, data):
        """Compress data using gzip"""
        buffer = io.BytesIO()
        with gzip.GzipFile(fileobj=buffer, mode='wb', compresslevel=self.compress_level) as f:
            f.write(data)
        return buffer.getvalue()
    
    def update_headers(self, headers, compressed_length):
        """Update headers for compressed response"""
        new_headers = []
        
        for name, value in headers:
            if name.lower() not in ['content-length', 'content-encoding']:
                new_headers.append((name, value))
        
        new_headers.extend([
            ('Content-Encoding', 'gzip'),
            ('Content-Length', str(compressed_length)),
            ('Vary', 'Accept-Encoding')
        ])
        
        return new_headers

# Apply compression middleware
compression = CompressionMiddleware(app)

# Database query optimization for performance
class PerformanceOptimizer:
    """Database and query performance optimization"""
    
    def __init__(self):
        self.query_cache = {}
        self.slow_query_threshold = 0.1  # 100ms
    
    def optimized_user_posts(self, user_id, limit=10):
        """Optimized query with selective loading"""
        cache_key = f"user_posts:{user_id}:{limit}"
        
        # Check cache first
        if cache_key in self.query_cache:
            return self.query_cache[cache_key]
        
        start_time = time.time()
        
        # Simulate optimized database query
        # In reality, this would use database-specific optimizations
        posts = [
            {
                'id': i,
                'title': f'Post {i}',
                'excerpt': f'This is post {i} excerpt...',
                'created_at': (datetime.now() - timedelta(days=i)).isoformat()
            }
            for i in range(1, limit + 1)
        ]
        
        query_time = time.time() - start_time
        
        # Log slow queries
        if query_time > self.slow_query_threshold:
            app.logger.warning(f'Slow query detected: {cache_key} took {query_time:.3f}s')
        
        # Cache result
        self.query_cache[cache_key] = posts
        
        return posts

optimizer = PerformanceOptimizer()

@app.route('/api/performance-demo')
def performance_demo():
    """Demonstrate various performance optimizations"""
    
    # Simulated metrics collection
    metrics = {
        'cache_hit_rate': '85%',
        'average_response_time': '120ms',
        'compression_ratio': '68%',
        'cdn_usage': '92%'
    }
    
    return jsonify({
        'message': 'Performance optimization demo',
        'metrics': metrics,
        'optimizations_applied': [
            'Server-side caching with Redis',
            'CDN for static assets',
            'GZIP compression',
            'Asset bundling and versioning',
            'Optimized database queries'
        ]
    })

```

### Lazy loading and asset bundling

Implementing lazy loading for improved initial page load:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

rectangle "Performance Optimization Flow" {
  
  rectangle "Request Processing" {
    component "Browser Request" as browser
    component "CDN Check" as cdn
    component "Cache Check" as cache
    component "Application Logic" as app
    
    browser -> cdn : Static assets
    browser -> cache : Dynamic content
    cache -> app : Cache miss
  }
  
  rectangle "Response Optimization" {
    component "Compression" as compress
    component "Asset Bundling" as bundle
    component "Lazy Loading" as lazy
    
    app -> compress : Response data
    app -> bundle : CSS/JS files
    app -> lazy : Non-critical resources
  }
  
  rectangle "Delivery" {
    component "Compressed Response" as response
    component "Cached Assets" as cached
    component "Progressive Loading" as progressive
    
    compress -> response
    bundle -> cached
    lazy -> progressive
  }
}
@enduml

```

```python
# Lazy loading and progressive enhancement
class LazyLoadManager:
    """Manage lazy loading of resources"""
    
    def __init__(self):
        self.critical_css = [
            'styles/critical.css',  # Above-the-fold styles
            'styles/typography.css'  # Essential typography
        ]
        
        self.non_critical_css = [
            'styles/animations.css',  # Nice-to-have animations
            'styles/print.css'       # Print styles
        ]
        
        self.critical_js = [
            'js/polyfills.js',      # Essential browser support
            'js/critical.js'        # Core functionality
        ]
        
        self.lazy_js = [
            'js/analytics.js',      # Analytics tracking
            'js/social.js',         # Social media widgets
            'js/comments.js'        # Comment system
        ]
    
    def generate_critical_css_html(self):
        """Generate HTML for critical CSS (inline or high priority)"""
        html_parts = []
        
        for css_file in self.critical_css:
            url = cdn_manager.cdn_url(css_file)
            html_parts.append(f'<link rel="stylesheet" href="{url}">')
        
        return '\n'.join(html_parts)
    
    def generate_lazy_css_html(self):
        """Generate HTML for lazy-loaded CSS"""
        html_parts = []
        
        # Load non-critical CSS after page load
        html_parts.append('<script>')
        html_parts.append('window.addEventListener("load", function() {')
        
        for css_file in self.non_critical_css:
            url = cdn_manager.cdn_url(css_file)
            html_parts.append(f'  var link = document.createElement("link");')
            html_parts.append(f'  link.rel = "stylesheet";')
            html_parts.append(f'  link.href = "{url}";')
            html_parts.append(f'  document.head.appendChild(link);')
        
        html_parts.append('});')
        html_parts.append('</script>')
        
        return '\n'.join(html_parts)
    
    def generate_progressive_js_html(self):
        """Generate HTML for progressive JavaScript loading"""
        html_parts = []
        
        # Critical JS loaded immediately
        for js_file in self.critical_js:
            url = cdn_manager.cdn_url(js_file)
            html_parts.append(f'<script src="{url}"></script>')
        
        # Lazy JS loaded after interaction or timeout
        html_parts.append('<script>')
        html_parts.append('(function() {')
        html_parts.append('  var lazyScripts = [')
        
        for js_file in self.lazy_js:
            url = cdn_manager.cdn_url(js_file)
            html_parts.append(f'    "{url}",')
        
        html_parts.append('  ];')
        html_parts.append('  ')
        html_parts.append('  function loadLazyScripts() {')
        html_parts.append('    lazyScripts.forEach(function(src) {')
        html_parts.append('      var script = document.createElement("script");')
        html_parts.append('      script.src = src;')
        html_parts.append('      script.async = true;')
        html_parts.append('      document.head.appendChild(script);')
        html_parts.append('    });')
        html_parts.append('  }')
        html_parts.append('  ')
        html_parts.append('  // Load after user interaction or 3 seconds')
        html_parts.append('  var events = ["scroll", "click", "keypress"];')
        html_parts.append('  var timeout = setTimeout(loadLazyScripts, 3000);')
        html_parts.append('  ')
        html_parts.append('  events.forEach(function(event) {')
        html_parts.append('    document.addEventListener(event, function() {')
        html_parts.append('      clearTimeout(timeout);')
        html_parts.append('      loadLazyScripts();')
        html_parts.append('      events.forEach(function(e) {')
        html_parts.append('        document.removeEventListener(e, arguments.callee);')
        html_parts.append('      });')
        html_parts.append('    }, { once: true });')
        html_parts.append('  });')
        html_parts.append('})();')
        html_parts.append('</script>')
        
        return '\n'.join(html_parts)

lazy_loader = LazyLoadManager()

# Add template helpers for lazy loading
@app.context_processor
def inject_lazy_loading_helpers():
    return {
        'critical_css': lazy_loader.generate_critical_css_html,
        'lazy_css': lazy_loader.generate_lazy_css_html,
        'progressive_js': lazy_loader.generate_progressive_js_html
    }

# Performance monitoring and profiling
import functools
import cProfile
import pstats
import io

class PerformanceProfiler:
    """Profile application performance"""
    
    def __init__(self):
        self.profiles = {}
        self.enabled = app.config.get('PROFILING_ENABLED', False)
    
    def profile_request(self, f):
        """Decorator to profile request handling"""
        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            if not self.enabled:
                return f(*args, **kwargs)
            
            profiler = cProfile.Profile()
            profiler.enable()
            
            try:
                result = f(*args, **kwargs)
                return result
            finally:
                profiler.disable()
                
                # Store profile data
                s = io.StringIO()
                ps = pstats.Stats(profiler, stream=s)
                ps.sort_stats('cumulative')
                ps.print_stats(10)  # Top 10 functions
                
                profile_data = s.getvalue()
                endpoint = request.endpoint or 'unknown'
                self.profiles[endpoint] = profile_data
        
        return wrapper
    
    def get_profile_report(self, endpoint):
        """Get profile report for endpoint"""
        return self.profiles.get(endpoint, "No profile data available")

profiler = PerformanceProfiler()

@app.route('/debug/profiles')
def show_profiles():
    """Show performance profiles (development only)"""
    if not app.debug:
        return "Profiling only available in debug mode", 404
    
    profiles_html = []
    for endpoint, profile_data in profiler.profiles.items():
        profiles_html.append(f"<h3>{endpoint}</h3>")
        profiles_html.append(f"<pre>{profile_data}</pre>")
    
    return f"<h1>Performance Profiles</h1>{''.join(profiles_html)}"

# Apply profiling to routes
@app.route('/')
@profiler.profile_request
def index():
    return jsonify({'message': 'Hello, optimized world!'})

if __name__ == '__main__':
    app.run(debug=True)

```

## Try it

/// details | Exercise 1: Caching Strategy Implementation
    type: question
    open: false

**Scenario**: Your blog application has slow database queries for popular posts and user statistics.

**Tasks**:

1. Implement a caching decorator for expensive database operations

2. Add appropriate cache invalidation when posts are updated

3. Set proper HTTP cache headers for API responses

/// details | Sample Solution
    type: success
    open: false

```python
def cache_with_invalidation(cache_keys, ttl=300):
    """Cache decorator with invalidation support"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            cache_key = f"{f.__name__}:{':'.join(map(str, args))}"
            
            # Check cache
            cached = cache_manager.get_cache(cache_key)
            if cached:
                return cached
            
            # Execute and cache
            result = f(*args, **kwargs)
            cache_manager.set_cache(cache_key, result, ttl)
            
            # Store cache key for invalidation
            for key in cache_keys:
                cache_manager.add_to_group(key, cache_key)
            
            return result
        return wrapper
    return decorator

@cache_with_invalidation(['posts'], ttl=600)
def get_popular_posts():
    # Expensive database query
    return query_popular_posts()

def invalidate_post_cache():
    """Invalidate post-related caches when posts change"""
    cache_manager.invalidate_group('posts')

```

///
///


!!! next-up "Coming Up"
    Next: [13.4 Designing and implementing a PWA](../Section-04-Designing-and-implementing-a-PWA/index.md) will build on these concepts.

## Summary

Performance and page-load management techniques optimize web application speed and user experience:

- **Caching strategies** reduce server load and response times through server-side caching, CDNs, and HTTP cache headers

- **Compression techniques** minimize transfer sizes using GZIP compression and asset optimization

- **Asset bundling** combines multiple files to reduce HTTP requests and improve loading efficiency

- **Lazy loading** defers non-critical resources to prioritize above-the-fold content and faster initial page loads

- **Profiling tools** identify performance bottlenecks and guide optimization efforts

- **Progressive enhancement** ensures core functionality loads quickly while additional features load in the background

Understanding these optimization techniques enables developers to build fast, responsive web applications that provide excellent user experiences across various network conditions and devices.
