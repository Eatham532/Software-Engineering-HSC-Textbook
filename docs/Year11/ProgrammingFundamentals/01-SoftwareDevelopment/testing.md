# Testing & Debugging 🧪

## Making Sure Everything Works Perfectly

Testing and debugging are critical phases that ensure your software works correctly, handles errors gracefully, and provides a reliable experience for users. This phase catches problems before users encounter them.

## StudyBuddy Testing Strategy

### 1. Unit Testing
**Test individual functions and components in isolation**

```python
import unittest
from datetime import datetime, date

class TestStudyBuddy(unittest.TestCase):
    
    def setUp(self):
        """Set up test fixtures before each test"""
        self.app = StudyBuddy("test_user")
    
    def test_add_assignment(self):
        """Test that assignments are added correctly"""
        result = self.app.add_assignment(
            title="Math Quiz", 
            subject="Algebra", 
            due_date=date(2024, 8, 15)
        )
        
        # Verify assignment was added
        self.assertTrue(result["success"])
        self.assertEqual(len(self.app.assignments), 1)
        self.assertEqual(self.app.assignments[0].title, "Math Quiz")
        self.assertEqual(self.app.assignments[0].subject, "Algebra")
    
    def test_overdue_assignments(self):
        """Test finding overdue assignments"""
        # Add an assignment with past due date
        past_date = date(2023, 1, 1)
        self.app.add_assignment("Old Essay", "English", past_date)
        
        overdue = self.app.get_overdue_tasks()
        self.assertEqual(len(overdue), 1)
        self.assertEqual(overdue[0].title, "Old Essay")
    
    def test_invalid_assignment_data(self):
        """Test error handling for invalid inputs"""
        # Test empty title
        result = self.app.add_assignment("", "Math", date(2024, 8, 15))
        self.assertFalse(result["success"])
        self.assertIn("Title is required", result["error"])
        
        # Test past due date  
        past_date = date(2023, 1, 1)
        result = self.app.add_assignment("Test", "Math", past_date)
        self.assertFalse(result["success"])
        self.assertIn("past", result["error"])

if __name__ == '__main__':
    unittest.main()
```

### 2. Integration Testing
**Test how components work together**

```python
class TestIntegration(unittest.TestCase):
    
    def test_calendar_sync_workflow(self):
        """Test complete calendar synchronization"""
        # Setup
        app = StudyBuddy("test_user")
        mock_calendar = MockCalendarAPI()
        integration = CalendarIntegration(mock_calendar)
        
        # Add assignments
        app.add_assignment("Math Test", "Algebra", date(2024, 8, 20))
        app.add_assignment("History Essay", "World History", date(2024, 8, 22))
        
        # Test sync
        result = integration.sync_assignments(app)
        
        # Verify sync worked
        self.assertTrue(result["success"])
        self.assertEqual(result["synced"], 2)
        self.assertEqual(len(mock_calendar.events), 2)
    
    def test_notification_delivery(self):
        """Test that notifications are sent correctly"""
        app = StudyBuddy("test_user")
        notification_service = MockNotificationService()
        
        # Add assignment due tomorrow
        tomorrow = date.today() + timedelta(days=1)
        app.add_assignment("Important Quiz", "Math", tomorrow)
        
        # Trigger notification check
        app.check_and_send_notifications(notification_service)
        
        # Verify notification was sent
        self.assertEqual(len(notification_service.sent_notifications), 1)
        notification = notification_service.sent_notifications[0]
        self.assertIn("Important Quiz", notification.message)
```

### 3. User Acceptance Testing (UAT)
**Real students test the app**

**Testing Process:**
1. Give prototype to 20 students for 1 week
2. Provide specific tasks to complete
3. Observe how they use the app
4. Collect feedback through surveys and interviews

**Sample Test Tasks:**
- Add 5 assignments with different due dates
- Set up notifications for one subject
- Mark 2 assignments as complete
- Try to sync with Google Calendar

**Example Feedback:**
- ✅ "Love the color coding for subjects!"
- ⚠️ "Notifications are too frequent"
- ❌ "Can't figure out how to edit assignments"
- 💡 "Would love to see my streak of completed assignments"

### 4. Performance Testing
**Ensure the app performs well under load**

```python
import time
import concurrent.futures

def test_app_performance():
    """Test app performance with multiple operations"""
    app = StudyBuddy("performance_test_user")
    
    # Test adding many assignments quickly
    start_time = time.time()
    
    for i in range(1000):
        app.add_assignment(
            f"Assignment {i}", 
            f"Subject {i % 10}", 
            date.today() + timedelta(days=i % 30)
        )
    
    end_time = time.time()
    elapsed = end_time - start_time
    
    # Should handle 1000 assignments in under 1 second
    assert elapsed < 1.0, f"Adding assignments took {elapsed:.2f}s (too slow!)"
    
    # Test query performance
    start_time = time.time()
    todays_tasks = app.get_todays_tasks()
    end_time = time.time()
    
    query_time = end_time - start_time
    assert query_time < 0.1, f"Query took {query_time:.2f}s (too slow!)"

def test_concurrent_users():
    """Test app behavior with multiple simultaneous users"""
    def simulate_user(user_id):
        app = StudyBuddy(f"user_{user_id}")
        # Simulate typical user actions
        app.add_assignment("Test Assignment", "Math", date.today() + timedelta(days=1))
        app.get_todays_tasks()
        return len(app.assignments)
    
    # Simulate 100 concurrent users
    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
        futures = [executor.submit(simulate_user, i) for i in range(100)]
        results = [future.result() for future in futures]
    
    # All users should successfully create assignments
    assert all(result == 1 for result in results)
```

## Debugging Techniques

### 1. Print/Log Debugging
**Add logging to understand program flow**

```python
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def add_assignment(self, title, subject, due_date):
    logger.debug(f"Adding assignment: {title}, {subject}, {due_date}")
    
    try:
        if not title:
            logger.warning("Assignment title is empty")
            return {"success": False, "error": "Title is required"}
        
        assignment = Assignment(title, subject, due_date)
        self.assignments.append(assignment)
        
        logger.info(f"Successfully added assignment: {assignment.id}")
        return {"success": True, "assignment": assignment}
        
    except Exception as e:
        logger.error(f"Failed to add assignment: {e}")
        return {"success": False, "error": str(e)}
```

### 2. Interactive Debugging
**Use debugger to step through code**

```python
import pdb

def problematic_function(data):
    # Set breakpoint here
    pdb.set_trace()
    
    # Debug interactively:
    # - Print variables: p variable_name
    # - Step to next line: n
    # - Continue execution: c
    # - Step into function: s
    
    result = process_data(data)
    return result
```

### 3. Error Reproduction
**Create minimal test cases that reproduce bugs**

```python
def test_bug_reproduction():
    """Reproduce the bug where notifications fail for assignments due today"""
    app = StudyBuddy("debug_user")
    
    # Exact steps that cause the bug
    assignment = app.add_assignment("Test", "Math", date.today())
    notifications = app.get_due_notifications()
    
    # This should work but currently fails
    assert len(notifications) == 1, "Assignment due today should trigger notification"
```

## Famous Bug Stories

/// details | Instagram's Launch Day Crisis 📱
    type: example

**Instagram's Launch (October 6, 2010):** The app crashed repeatedly due to unexpected user volume:

- **Problem**: Expected 10,000 users, got 25,000 in the first day
- **Symptoms**: App crashes, slow loading, failed photo uploads
- **Solution**: Emergency server scaling and database optimization
- **Lesson**: Always test with realistic user loads

///

/// details | Pokémon GO's Battery Drain Bug 🔋
    type: example

**Pokémon GO (2016):** Location services drained phone batteries extremely fast:

- **Problem**: GPS polling every 0.5 seconds instead of 5 seconds
- **Impact**: Players' phones died within 2 hours
- **Detection**: User complaints and app store reviews
- **Fix**: Optimized location update frequency and added battery saver mode

///

## Testing Best Practices

### 1. Test Early and Often
- Write tests as you develop features
- Run tests automatically on every code change
- Don't wait until the end to start testing

### 2. Test Real Scenarios
- Use realistic data in your tests
- Test edge cases and error conditions
- Include tests for things that should NOT work

### 3. Automate Testing
```bash
# Run tests automatically with every code change
npm test --watch

# Or with Python
python -m pytest --watch
```

### 4. Monitor in Production
```python
# Track errors and performance in the live app
import sentry_sdk

sentry_sdk.init("YOUR_SENTRY_DSN")

def add_assignment(self, title, subject, due_date):
    try:
        # Normal code here
        pass
    except Exception as e:
        sentry_sdk.capture_exception(e)  # Automatically report errors
        raise
```

---

**Next:** Learn about [Deployment](deployment.md) - getting your app to users
