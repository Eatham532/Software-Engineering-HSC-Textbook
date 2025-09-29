# 13.4 Designing and implementing a PWA

## Why it matters


Progressive Web Apps (PWAs) bridge the gap between web and native mobile applications, providing users with app-like experiences through web browsers. PWAs offer offline functionality, push notifications, and installation capabilities while maintaining the reach and accessibility of web applications. Understanding PWA development enables developers to create engaging, performant applications that work across all devices and network conditions, making them essential for modern web development.

## Concepts

### Service Workers and offline functionality

Service Workers act as a proxy between web applications and the network, enabling offline functionality and background processing:

```python
# Flask backend for PWA with service worker registration
from flask import Flask, render_template, jsonify, request, make_response
import json
import os
from datetime import datetime, timedelta
import sqlite3
import threading
import time

app = Flask(__name__)

# Database setup for offline sync
def init_database():
    """Initialize SQLite database for PWA data"""
    conn = sqlite3.connect('pwa_data.db')
    cursor = conn.cursor()
    
    # Create tables for offline sync
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sync_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            resource TEXT NOT NULL,
            data TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            synced BOOLEAN DEFAULT FALSE
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS app_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT,
            last_modified DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert sample data
    cursor.execute('''
        INSERT OR REPLACE INTO app_data (key, value) VALUES 
        ('app_version', '1.0.0'),
        ('last_sync', ?),
        ('user_preferences', '{"theme": "light", "notifications": true}')
    ''', (datetime.now().isoformat(),))
    
    conn.commit()
    conn.close()

init_database()

class PWAManager:
    """Manage PWA functionality and offline capabilities"""
    
    def __init__(self):
        self.manifest_data = {
            "name": "Python Web App",
            "short_name": "PyWebApp",
            "description": "A Progressive Web App built with Python",
            "start_url": "/",
            "display": "standalone",
            "theme_color": "#000000",
            "background_color": "#ffffff",
            "orientation": "portrait-primary",
            "icons": [
                {
                    "src": "/static/icons/icon-72x72.png",
                    "sizes": "72x72",
                    "type": "image/png"
                },
                {
                    "src": "/static/icons/icon-96x96.png",
                    "sizes": "96x96",
                    "type": "image/png"
                },
                {
                    "src": "/static/icons/icon-128x128.png",
                    "sizes": "128x128",
                    "type": "image/png"
                },
                {
                    "src": "/static/icons/icon-144x144.png",
                    "sizes": "144x144",
                    "type": "image/png"
                },
                {
                    "src": "/static/icons/icon-152x152.png",
                    "sizes": "152x152",
                    "type": "image/png"
                },
                {
                    "src": "/static/icons/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/static/icons/icon-384x384.png",
                    "sizes": "384x384",
                    "type": "image/png"
                },
                {
                    "src": "/static/icons/icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ]
        }
    
    def generate_service_worker(self):
        """Generate service worker JavaScript code"""
        service_worker_code = '''
// Service Worker for PWA functionality
const CACHE_NAME = 'pwa-cache-v1';
const API_CACHE_NAME = 'pwa-api-cache-v1';

// Resources to cache for offline use
const STATIC_CACHE_URLS = [
    '/',
    '/static/css/app.css',
    '/static/js/app.js',
    '/static/icons/icon-192x192.png',
    '/offline.html'
];

// API endpoints to cache
const API_CACHE_URLS = [
    '/api/data',
    '/api/sync'
];

// Install event - cache essential resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => {
                console.log('Caching static resources');
                return cache.addAll(STATIC_CACHE_URLS);
            }),
            caches.open(API_CACHE_NAME).then(cache => {
                console.log('Pre-caching API endpoints');
                return Promise.all(
                    API_CACHE_URLS.map(url => 
                        fetch(url).then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                        }).catch(err => console.log('Pre-cache failed for', url))
                    )
                );
            })
        ])
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle API requests with network-first strategy
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Clone response for caching
                    const responseClone = response.clone();
                    
                    // Cache successful responses
                    if (response.ok) {
                        caches.open(API_CACHE_NAME).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    
                    return response;
                })
                .catch(() => {
                    // Fallback to cache when network fails
                    return caches.match(request).then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // Return offline message for API calls
                        return new Response(
                            JSON.stringify({ 
                                error: 'Offline', 
                                message: 'Data not available offline' 
                            }),
                            { 
                                status: 503,
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                    });
                })
        );
    }
    // Handle static resources with cache-first strategy
    else {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(request).then(response => {
                    // Cache successful responses
                    if (response.ok && request.method === 'GET') {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    
                    return response;
                }).catch(() => {
                    // Fallback to offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                    
                    return new Response('Offline', { status: 503 });
                });
            })
        );
    }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(syncOfflineActions());
    }
});

// Sync offline actions when back online
async function syncOfflineActions() {
    try {
        const response = await fetch('/api/sync/process');
        if (response.ok) {
            console.log('Offline actions synced successfully');
        }
    } catch (error) {
        console.error('Sync failed:', error);
        throw error; // Retry sync later
    }
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Details',
                icon: '/static/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/static/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('PWA Update', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
'''
        return service_worker_code
    
    def get_manifest(self):
        """Get PWA manifest data"""
        return self.manifest_data

pwa_manager = PWAManager()

@app.route('/')
def index():
    """Main PWA application page"""
    return render_template('pwa_index.html')

@app.route('/manifest.json')
def manifest():
    """Serve PWA manifest"""
    response = make_response(jsonify(pwa_manager.get_manifest()))
    response.headers['Content-Type'] = 'application/manifest+json'
    return response

@app.route('/sw.js')
def service_worker():
    """Serve service worker"""
    response = make_response(pwa_manager.generate_service_worker())
    response.headers['Content-Type'] = 'application/javascript'
    response.headers['Service-Worker-Allowed'] = '/'
    return response

@app.route('/offline.html')
def offline_page():
    """Offline fallback page"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Offline - PWA</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background: #f5f5f5;
            }
            .offline-message {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 400px;
                margin: 0 auto;
            }
            .icon { font-size: 48px; margin-bottom: 20px; }
            h1 { color: #333; margin-bottom: 10px; }
            p { color: #666; line-height: 1.5; }
            .retry-btn {
                background: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
            }
            .retry-btn:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <div class="offline-message">
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>It looks like you're not connected to the internet. Some features may be limited, but you can still access cached content.</p>
            <button class="retry-btn" onclick="window.location.reload()">
                Try Again
            </button>
        </div>
        
        <script>
            // Check for connectivity and reload when back online
            window.addEventListener('online', () => {
                window.location.reload();
            });
        </script>
    </body>
    </html>
    '''

```

### Installable app characteristics

Implementing PWA installation prompts and app-like behavior:

```python
# PWA installation and app characteristics
class PWAInstallManager:
    """Manage PWA installation and app-like features"""
    
    def __init__(self):
        self.install_criteria = {
            'manifest': True,
            'service_worker': True,
            'https': True,
            'user_engagement': False
        }
    
    def generate_install_prompt_js(self):
        """Generate JavaScript for install prompt handling"""
        return '''
// PWA Installation Management
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = document.getElementById('install-btn');
        this.setupEventListeners();
        this.checkInstallability();
    }
    
    setupEventListeners() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA install prompt available');
            
            // Prevent default mini-infobar from appearing
            e.preventDefault();
            
            // Store event for later use
            this.deferredPrompt = e;
            
            // Show custom install button
            this.showInstallButton();
        });
        
        // Handle install button click
        if (this.installButton) {
            this.installButton.addEventListener('click', () => {
                this.promptInstall();
            });
        }
        
        // Listen for app installation
        window.addEventListener('appinstalled', (e) => {
            console.log('PWA was installed successfully');
            this.hideInstallButton();
            this.trackInstallation();
        });
        
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone) {
            console.log('PWA is running in standalone mode');
            this.hideInstallButton();
        }
    }
    
    showInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'block';
            this.installButton.innerHTML = `
                <span class="icon">📱</span>
                Install App
            `;
        }
    }
    
    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
        }
    }
    
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            return;
        }
        
        // Show install prompt
        this.deferredPrompt.prompt();
        
        // Wait for user response
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);
        
        if (outcome === 'accepted') {
            console.log('User accepted install prompt');
        } else {
            console.log('User dismissed install prompt');
        }
        
        // Clear the deferred prompt
        this.deferredPrompt = null;
        this.hideInstallButton();
    }
    
    checkInstallability() {
        // Check PWA install criteria
        const criteria = {
            manifest: this.hasManifest(),
            serviceWorker: this.hasServiceWorker(),
            https: this.isHTTPS(),
            engagement: this.hasUserEngagement()
        };
        
        console.log('PWA install criteria:', criteria);
        
        const installable = Object.values(criteria).every(Boolean);
        if (installable) {
            console.log('PWA meets installation criteria');
        } else {
            console.log('PWA does not meet all installation criteria');
        }
        
        return installable;
    }
    
    hasManifest() {
        return document.querySelector('link[rel="manifest"]') !== null;
    }
    
    hasServiceWorker() {
        return 'serviceWorker' in navigator;
    }
    
    isHTTPS() {
        return location.protocol === 'https:' || location.hostname === 'localhost';
    }
    
    hasUserEngagement() {
        // Check if user has interacted with the app
        // This could be tracked via user actions, time spent, etc.
        return localStorage.getItem('user_engaged') === 'true';
    }
    
    trackInstallation() {
        // Track installation for analytics
        fetch('/api/analytics/install', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            })
        }).catch(err => console.log('Install tracking failed:', err));
    }
}

// App-like behavior enhancements
class PWABehavior {
    constructor() {
        this.setupAppLikeBehavior();
        this.setupStatusBar();
        this.setupNavigationHandling();
    }
    
    setupAppLikeBehavior() {
        // Prevent context menu on long press (mobile)
        document.addEventListener('contextmenu', (e) => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                e.preventDefault();
            }
        });
        
        // Prevent text selection in app mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            document.body.style.webkitUserSelect = 'none';
            document.body.style.webkitTouchCallout = 'none';
        }
        
        // Handle pull-to-refresh
        this.setupPullToRefresh();
    }
    
    setupStatusBar() {
        // Set status bar style for iOS
        const statusBarMeta = document.createElement('meta');
        statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
        statusBarMeta.content = 'black-translucent';
        document.head.appendChild(statusBarMeta);
        
        // Adjust content for notch/safe areas
        if (CSS.supports('padding', 'env(safe-area-inset-top)')) {
            document.documentElement.style.setProperty(
                '--safe-area-top', 
                'env(safe-area-inset-top)'
            );
            document.documentElement.style.setProperty(
                '--safe-area-bottom', 
                'env(safe-area-inset-bottom)'
            );
        }
    }
    
    setupNavigationHandling() {
        // Handle back button in standalone mode
        window.addEventListener('popstate', (e) => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                // Custom back button handling
                console.log('Back navigation in standalone mode');
            }
        });
    }
    
    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pulling = false;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (pulling && window.scrollY === 0) {
                currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                
                if (pullDistance > 100) {
                    // Show refresh indicator
                    this.showRefreshIndicator();
                }
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (pulling && currentY - startY > 100) {
                this.refreshApp();
            }
            pulling = false;
            this.hideRefreshIndicator();
        });
    }
    
    showRefreshIndicator() {
        // Show visual refresh indicator
        console.log('Showing refresh indicator');
    }
    
    hideRefreshIndicator() {
        // Hide visual refresh indicator
        console.log('Hiding refresh indicator');
    }
    
    refreshApp() {
        // Refresh app content
        window.location.reload();
    }
}

// Initialize PWA features
document.addEventListener('DOMContentLoaded', () => {
    const installer = new PWAInstaller();
    const behavior = new PWABehavior();
    
    // Track user engagement
    let engagementTimeout = setTimeout(() => {
        localStorage.setItem('user_engaged', 'true');
        console.log('User engagement recorded');
    }, 30000); // 30 seconds
    
    // Cancel engagement tracking if user leaves quickly
    window.addEventListener('beforeunload', () => {
        clearTimeout(engagementTimeout);
    });
});
'''

install_manager = PWAInstallManager()

@app.route('/api/pwa/install-status')
def install_status():
    """Check PWA installation status and criteria"""
    return jsonify({
        'installable': True,
        'criteria': install_manager.install_criteria,
        'recommendations': [
            'Ensure HTTPS is enabled',
            'Add user engagement tracking',
            'Implement background sync',
            'Test on multiple devices'
        ]
    })

@app.route('/api/analytics/install', methods=['POST'])
def track_installation():
    """Track PWA installation analytics"""
    data = request.get_json()
    
    # Store installation data
    conn = sqlite3.connect('pwa_data.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO sync_queue (action, resource, data) 
        VALUES (?, ?, ?)
    ''', ('install_tracked', 'analytics', json.dumps(data)))
    
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'tracked'})

```

### Syncing strategies and background sync

Implementing offline data synchronization:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

rectangle "PWA Sync Architecture" {
  
  rectangle "Client Side" {
    component "Service Worker" as sw
    component "IndexedDB" as idb
    component "Background Sync" as bg_sync
    component "App Interface" as ui
    
    ui -> idb : Store offline data
    idb -> sw : Queue sync actions
    sw -> bg_sync : Register sync events
  }
  
  rectangle "Network Layer" {
    component "Online Detection" as online
    component "Retry Logic" as retry
    component "Conflict Resolution" as conflict
    
    bg_sync -> online : Check connectivity
    online -> retry : Network available
    retry -> conflict : Handle conflicts
  }
  
  rectangle "Server Side" {
    component "Sync API" as sync_api
    component "Conflict Handler" as server_conflict
    component "Data Store" as db
    
    conflict -> sync_api : Send queued data
    sync_api -> server_conflict : Process conflicts
    server_conflict -> db : Persist changes
  }
}
@enduml

```

```python
# Background sync and data synchronization
class PWASyncManager:
    """Manage PWA background synchronization"""
    
    def __init__(self):
        self.sync_strategies = {
            'immediate': self.immediate_sync,
            'background': self.background_sync,
            'conflict_resolution': self.resolve_conflicts
        }
    
    def queue_sync_action(self, action, resource, data):
        """Queue an action for background synchronization"""
        conn = sqlite3.connect('pwa_data.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO sync_queue (action, resource, data) 
            VALUES (?, ?, ?)
        ''', (action, resource, json.dumps(data)))
        
        sync_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return sync_id
    
    def get_pending_syncs(self):
        """Get all pending sync actions"""
        conn = sqlite3.connect('pwa_data.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, action, resource, data, timestamp 
            FROM sync_queue 
            WHERE synced = FALSE 
            ORDER BY timestamp ASC
        ''')
        
        syncs = []
        for row in cursor.fetchall():
            syncs.append({
                'id': row[0],
                'action': row[1],
                'resource': row[2],
                'data': json.loads(row[3]) if row[3] else None,
                'timestamp': row[4]
            })
        
        conn.close()
        return syncs
    
    def mark_sync_completed(self, sync_id):
        """Mark a sync action as completed"""
        conn = sqlite3.connect('pwa_data.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE sync_queue 
            SET synced = TRUE 
            WHERE id = ?
        ''', (sync_id,))
        
        conn.commit()
        conn.close()
    
    def immediate_sync(self, data):
        """Attempt immediate synchronization"""
        try:
            # Simulate network request
            result = self.process_sync_data(data)
            return {'success': True, 'result': result}
        except Exception as e:
            # Queue for background sync if immediate fails
            sync_id = self.queue_sync_action('retry', 'data', data)
            return {'success': False, 'queued': sync_id, 'error': str(e)}
    
    def background_sync(self, sync_data):
        """Process background sync queue"""
        results = []
        pending_syncs = self.get_pending_syncs()
        
        for sync in pending_syncs:
            try:
                result = self.process_sync_data(sync['data'])
                self.mark_sync_completed(sync['id'])
                results.append({
                    'id': sync['id'],
                    'success': True,
                    'result': result
                })
            except Exception as e:
                results.append({
                    'id': sync['id'],
                    'success': False,
                    'error': str(e),
                    'retry_later': True
                })
        
        return results
    
    def resolve_conflicts(self, local_data, server_data):
        """Resolve data conflicts during sync"""
        resolution_strategy = 'server_wins'  # Can be configurable
        
        if resolution_strategy == 'server_wins':
            return server_data
        elif resolution_strategy == 'client_wins':
            return local_data
        elif resolution_strategy == 'merge':
            # Implement merge logic based on data structure
            return self.merge_data(local_data, server_data)
        elif resolution_strategy == 'timestamp':
            # Use most recent data based on timestamp
            local_time = local_data.get('last_modified', 0)
            server_time = server_data.get('last_modified', 0)
            return server_data if server_time > local_time else local_data
    
    def merge_data(self, local_data, server_data):
        """Merge local and server data"""
        # Simple merge strategy - can be customized per data type
        merged = server_data.copy()
        
        # Preserve local changes that don't conflict
        for key, value in local_data.items():
            if key not in server_data:
                merged[key] = value
        
        return merged
    
    def process_sync_data(self, data):
        """Process sync data - simulate server operation"""
        # Simulate processing time
        time.sleep(0.1)
        
        # Return processed result
        return {
            'processed_at': datetime.now().isoformat(),
            'data_id': data.get('id', 'unknown'),
            'status': 'processed'
        }

sync_manager = PWASyncManager()

@app.route('/api/sync/queue', methods=['POST'])
def queue_sync():
    """Queue data for background synchronization"""
    data = request.get_json()
    
    sync_id = sync_manager.queue_sync_action(
        data.get('action', 'update'),
        data.get('resource', 'data'),
        data.get('payload')
    )
    
    return jsonify({
        'sync_id': sync_id,
        'queued': True,
        'message': 'Data queued for background sync'
    })

@app.route('/api/sync/process')
def process_sync():
    """Process pending background sync queue"""
    results = sync_manager.background_sync({})
    
    return jsonify({
        'processed': len(results),
        'successful': len([r for r in results if r['success']]),
        'failed': len([r for r in results if not r['success']]),
        'results': results
    })

@app.route('/api/sync/status')
def sync_status():
    """Get current sync status"""
    pending_syncs = sync_manager.get_pending_syncs()
    
    return jsonify({
        'pending_count': len(pending_syncs),
        'last_sync': datetime.now().isoformat(),
        'pending_actions': [
            {
                'id': sync['id'],
                'action': sync['action'],
                'resource': sync['resource'],
                'timestamp': sync['timestamp']
            }
            for sync in pending_syncs
        ]
    })

# PWA accessibility considerations
class PWAAccessibility:
    """Manage PWA accessibility features"""
    
    def __init__(self):
        self.a11y_features = {
            'keyboard_navigation': True,
            'screen_reader_support': True,
            'high_contrast': True,
            'focus_management': True,
            'aria_labels': True
        }
    
    def generate_accessibility_js(self):
        """Generate JavaScript for accessibility enhancements"""
        return '''
// PWA Accessibility Enhancements
class PWAAccessibility {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupHighContrast();
        this.setupScreenReaderSupport();
    }
    
    setupKeyboardNavigation() {
        // Ensure all interactive elements are keyboard accessible
        document.addEventListener('keydown', (e) => {
            // Handle tab navigation
            if (e.key === 'Tab') {
                this.manageFocusOrder(e);
            }
            
            // Handle escape key
            if (e.key === 'Escape') {
                this.handleEscape();
            }
            
            // Handle enter/space for custom controls
            if (e.key === 'Enter' || e.key === ' ') {
                this.handleActivation(e);
            }
        });
    }
    
    setupFocusManagement() {
        // Track focus for skip links and modal dialogs
        let focusStack = [];
        
        window.pushFocus = (element) => {
            focusStack.push(document.activeElement);
            element.focus();
        };
        
        window.popFocus = () => {
            const previousFocus = focusStack.pop();
            if (previousFocus) {
                previousFocus.focus();
            }
        };
        
        // Focus trap for modals
        window.trapFocus = (container) => {
            const focusableElements = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            container.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        };
    }
    
    setupHighContrast() {
        // Detect and respond to high contrast preferences
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        
        const updateContrast = (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };
        
        prefersHighContrast.addListener(updateContrast);
        updateContrast(prefersHighContrast);
        
        // Manual contrast toggle
        const contrastToggle = document.getElementById('contrast-toggle');
        if (contrastToggle) {
            contrastToggle.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                const isHighContrast = document.body.classList.contains('high-contrast');
                localStorage.setItem('high-contrast', isHighContrast);
                contrastToggle.setAttribute('aria-pressed', isHighContrast);
            });
        }
    }
    
    setupScreenReaderSupport() {
        // Announce important changes to screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
        
        // Announce app state changes
        window.addEventListener('online', () => {
            window.announceToScreenReader('Connection restored. App is now online.');
        });
        
        window.addEventListener('offline', () => {
            window.announceToScreenReader('Connection lost. App is now in offline mode.');
        });
    }
    
    manageFocusOrder(e) {
        // Ensure logical focus order in complex layouts
        const focusableElements = Array.from(document.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Backward navigation
            if (currentIndex === 0) {
                focusableElements[focusableElements.length - 1].focus();
                e.preventDefault();
            }
        } else {
            // Forward navigation
            if (currentIndex === focusableElements.length - 1) {
                focusableElements[0].focus();
                e.preventDefault();
            }
        }
    }
    
    handleEscape() {
        // Close modals/dropdowns with escape key
        const openModal = document.querySelector('.modal.open');
        const openDropdown = document.querySelector('.dropdown.open');
        
        if (openModal) {
            this.closeModal(openModal);
        } else if (openDropdown) {
            this.closeDropdown(openDropdown);
        }
    }
    
    handleActivation(e) {
        const target = e.target;
        
        // Handle custom button-like elements
        if (target.getAttribute('role') === 'button') {
            target.click();
            e.preventDefault();
        }
    }
    
    closeModal(modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        window.popFocus();
    }
    
    closeDropdown(dropdown) {
        dropdown.classList.remove('open');
        dropdown.setAttribute('aria-expanded', 'false');
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
    const a11y = new PWAAccessibility();
    
    // Load saved preferences
    if (localStorage.getItem('high-contrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
});
'''

accessibility_manager = PWAAccessibility()

@app.route('/api/pwa/accessibility')
def accessibility_status():
    """Get PWA accessibility features status"""
    return jsonify({
        'features': accessibility_manager.a11y_features,
        'guidelines_compliance': [
            'WCAG 2.1 AA level compliance',
            'Keyboard navigation support',
            'Screen reader compatibility',
            'High contrast mode',
            'Focus management',
            'ARIA labels and roles'
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

```

## Try it

/// details | Exercise 1: PWA Service Worker Implementation
    type: question
    open: false

**Scenario**: Create a PWA for a note-taking application that works offline.

**Tasks**:

1. Implement a service worker that caches the app shell and user notes

2. Add background sync for notes created while offline

3. Create an offline fallback page with cached notes access

/// details | Sample Solution
    type: success
    open: false

```python
@app.route('/api/notes', methods=['POST'])
def create_note():
    """Create note with offline support"""
    data = request.get_json()
    
    if request.headers.get('X-Offline-Request'):
        # Queue for background sync
        sync_id = sync_manager.queue_sync_action(
            'create_note', 'notes', data
        )
        return jsonify({'queued': True, 'sync_id': sync_id})
    else:
        # Process immediately
        note_id = store_note(data)
        return jsonify({'id': note_id, 'created': True})

# Service worker cache strategy for notes
NOTES_CACHE_STRATEGY = '''
// Cache notes data with versioning
if (url.pathname.startsWith('/api/notes')) {
    event.respondWith(
        caches.open('notes-v1').then(cache => {
            return cache.match(request).then(response => {
                if (response) {
                    // Serve from cache and update in background
                    fetch(request).then(freshResponse => {
                        cache.put(request, freshResponse.clone());
                    });
                    return response;
                }
                return fetch(request).then(freshResponse => {
                    cache.put(request, freshResponse.clone());
                    return freshResponse;
                });
            });
        })
    );
}
'''

```

///
///

## Summary

Progressive Web Apps combine the best of web and native mobile applications:

- **Service Workers** enable offline functionality, background sync, and push notifications through programmable network proxies

- **Installable characteristics** provide app-like installation prompts, standalone display modes, and native app behaviors

- **Background synchronization** ensures data consistency between online and offline states with conflict resolution strategies

- **Accessibility considerations** maintain inclusive design principles through keyboard navigation, screen reader support, and WCAG compliance

- **Performance optimization** leverages caching strategies, asset optimization, and progressive enhancement for fast, reliable experiences

- **Cross-platform compatibility** delivers consistent functionality across different devices, browsers, and operating systems

Understanding PWA development enables developers to create engaging, performant applications that work reliably in any network condition while providing users with native app-like experiences through web technologies.







