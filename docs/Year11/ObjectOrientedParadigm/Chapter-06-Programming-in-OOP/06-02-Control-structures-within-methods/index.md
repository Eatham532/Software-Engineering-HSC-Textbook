---
title: "6.2 Control structures within methods"
---

# 6.2 Control structures within methods

## Learning objectives

By the end of this section, you will be able to:

- Use selection (if/elif/else) effectively within class methods

- Apply iteration (for/while loops) appropriately in object-oriented contexts

- Design methods that are short, focused, and cohesive

- Break down complex logic into smaller, manageable methods

- Apply control flow best practices for readable and maintainable code

- Understand when and how to extract complex logic into separate methods

## Selection structures in methods

**Selection structures** (if/elif/else statements) allow methods to make decisions based on object state, parameters, or external conditions.

### Basic selection in methods

```python-exec
class BankAccount:
    """Bank account demonstrating selection structures in methods"""
    
    def __init__(self, account_number, initial_balance=0):
        self.account_number = account_number
        self.balance = initial_balance
        self.is_frozen = False
    
    def withdraw(self, amount):
        """Withdraw money with multiple validation checks"""
        # Selection based on account state
        if self.is_frozen:
            return False, "Account is frozen"
        
        # Selection based on parameter validation
        if amount <= 0:
            return False, "Amount must be positive"
        
        # Selection based on balance check
        if amount > self.balance:
            return False, "Insufficient funds"
        
        # All checks passed - perform withdrawal
        self.balance -= amount
        return True, f"Withdrew ${amount}. Balance: ${self.balance}"
    
    def get_account_status(self):
        """Determine account status using selection"""
        if self.is_frozen:
            return "FROZEN"
        elif self.balance < 0:
            return "OVERDRAWN"
        elif self.balance < 100:
            return "LOW_BALANCE"
        elif self.balance < 1000:
            return "NORMAL"
        else:
            return "HIGH_BALANCE"
    
    def apply_fees(self):
        """Apply different fees based on account status"""
        status = self.get_account_status()
        
        if status == "OVERDRAWN":
            fee = 35
            self.balance -= fee
            return f"Applied overdraft fee: ${fee}"
        elif status == "LOW_BALANCE":
            fee = 5
            self.balance -= fee
            return f"Applied low balance fee: ${fee}"
        else:
            return "No fees applied"

# Usage
account = BankAccount("ACC001", 150)
print(account.withdraw(200))        # (False, 'Insufficient funds')
print(account.get_account_status()) # LOW_BALANCE
print(account.apply_fees())         # Applied low balance fee: $5

```

### Complex selection with multiple conditions

```python-exec
class Student:
    """Student class demonstrating complex selection logic"""
    
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.grades = []
        self.attendance_percentage = 100
        self.assignments_submitted = 0
        self.total_assignments = 0
    
    def calculate_letter_grade(self):
        """Calculate letter grade using complex selection"""
        if not self.grades:
            return "I"  # Incomplete
        
        average = sum(self.grades) / len(self.grades)
        
        # Multiple conditions for grade determination
        if average >= 90 and self.attendance_percentage >= 80:
            return "A"
        elif average >= 80 and self.attendance_percentage >= 75:
            return "B"
        elif average >= 70 and self.attendance_percentage >= 70:
            return "C"
        elif average >= 60 and self.attendance_percentage >= 65:
            return "D"
        else:
            return "F"
    
    def can_graduate(self):
        """Check graduation eligibility with multiple criteria"""
        if not self.grades:
            return False, "No grades recorded"
        
        average = sum(self.grades) / len(self.grades)
        assignment_completion = (self.assignments_submitted / self.total_assignments * 100 
                               if self.total_assignments > 0 else 0)
        
        # Complex boolean logic
        if (average >= 70 and 
            self.attendance_percentage >= 80 and 
            assignment_completion >= 90):
            return True, "Eligible for graduation"
        else:
            issues = []
            if average < 70:
                issues.append(f"Average too low: {average:.1f}% (need 70%)")
            if self.attendance_percentage < 80:
                issues.append(f"Poor attendance: {self.attendance_percentage}% (need 80%)")
            if assignment_completion < 90:
                issues.append(f"Missing assignments: {assignment_completion:.1f}% completed (need 90%)")
            
            return False, "; ".join(issues)
    
    def get_academic_standing(self):
        """Determine academic standing using nested selection"""
        if not self.grades:
            return "PENDING"
        
        average = sum(self.grades) / len(self.grades)
        
        if average >= 85:
            if self.attendance_percentage >= 95:
                return "DEAN'S LIST"
            else:
                return "HONOR ROLL"
        elif average >= 70:
            if self.attendance_percentage >= 80:
                return "GOOD_STANDING"
            else:
                return "PROBATION_WARNING"
        else:
            return "ACADEMIC_PROBATION"

# Usage
student = Student("Alice Johnson", "S12345")
student.grades = [88, 92, 85, 90]
student.attendance_percentage = 95
student.assignments_submitted = 18
student.total_assignments = 20

print(student.calculate_letter_grade())    # A
print(student.get_academic_standing())     # DEAN'S LIST
print(student.can_graduate())              # (True, 'Eligible for graduation')

```

## Iteration structures in methods

**Iteration structures** (for and while loops) allow methods to process collections, repeat operations, or continue until a condition is met.

### For loops in methods

```python-exec
class Inventory:
    """Inventory management demonstrating for loops in methods"""
    
    def __init__(self):
        self.items = {}  # {item_name: quantity}
        self.prices = {}  # {item_name: price}
    
    def add_item(self, name, quantity, price):
        """Add item to inventory"""
        self.items[name] = self.items.get(name, 0) + quantity
        self.prices[name] = price
    
    def calculate_total_value(self):
        """Calculate total inventory value using for loop"""
        total_value = 0
        
        for item_name, quantity in self.items.items():
            if item_name in self.prices:
                item_value = quantity * self.prices[item_name]
                total_value += item_value
        
        return total_value
    
    def find_low_stock_items(self, threshold=10):
        """Find items with low stock using for loop"""
        low_stock = []
        
        for item_name, quantity in self.items.items():
            if quantity < threshold:
                low_stock.append({
                    'name': item_name,
                    'quantity': quantity,
                    'price': self.prices.get(item_name, 0)
                })
        
        return low_stock
    
    def apply_discount(self, discount_percentage):
        """Apply discount to all items using for loop"""
        discount_factor = 1 - (discount_percentage / 100)
        
        for item_name in self.prices:
            self.prices[item_name] *= discount_factor
    
    def generate_report(self):
        """Generate inventory report using for loop"""
        report_lines = ["INVENTORY REPORT", "=" * 40]
        total_items = 0
        total_value = 0
        
        for item_name, quantity in self.items.items():
            price = self.prices.get(item_name, 0)
            item_value = quantity * price
            total_items += quantity
            total_value += item_value
            
            report_lines.append(f"{item_name:20} | Qty: {quantity:3} | ${price:6.2f} | ${item_value:8.2f}")
        
        report_lines.extend([
            "=" * 40,
            f"Total Items: {total_items}",
            f"Total Value: ${total_value:.2f}"
        ])
        
        return "\n".join(report_lines)

# Usage
inventory = Inventory()
inventory.add_item("Laptop", 5, 999.99)
inventory.add_item("Mouse", 25, 29.99)
inventory.add_item("Keyboard", 8, 79.99)

print(f"Total value: ${inventory.calculate_total_value():.2f}")
print("Low stock items:", inventory.find_low_stock_items())
print(inventory.generate_report())

```

### While loops in methods

```python-exec
class NumberProcessor:
    """Demonstrating while loops in methods"""
    
    def __init__(self):
        self.processed_numbers = []
    
    def process_until_condition(self, start_number, condition_func):
        """Process numbers until a condition is met"""
        current = start_number
        iterations = 0
        
        while not condition_func(current) and iterations < 100:  # Safety limit
            self.processed_numbers.append(current)
            current += 1
            iterations += 1
        
        return iterations
    
    def find_first_multiple(self, number, multiple_of):
        """Find first multiple using while loop"""
        candidate = number
        
        while candidate % multiple_of != 0:
            candidate += 1
        
        return candidate
    
    def validate_input_with_retry(self, input_func, validator_func, max_attempts=3):
        """Keep asking for input until valid (with limit)"""
        attempts = 0
        
        while attempts < max_attempts:
            try:
                user_input = input_func()
                if validator_func(user_input):
                    return user_input, True
                else:
                    print("Invalid input, please try again")
            except Exception as e:
                print(f"Error: {e}")
            
            attempts += 1
        
        return None, False

class Queue:
    """Queue implementation demonstrating while loops"""
    
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        """Add item to queue"""
        self.items.append(item)
    
    def dequeue(self):
        """Remove item from queue"""
        if self.items:
            return self.items.pop(0)
        return None
    
    def process_all_items(self, processor_func):
        """Process all items in queue using while loop"""
        processed_count = 0
        
        while self.items:  # Continue while queue is not empty
            item = self.dequeue()
            if item is not None:
                processor_func(item)
                processed_count += 1
        
        return processed_count
    
    def process_until_condition(self, processor_func, stop_condition):
        """Process items until a stop condition is met"""
        processed_items = []
        
        while self.items and not stop_condition():
            item = self.dequeue()
            if item is not None:
                result = processor_func(item)
                processed_items.append(result)
        
        return processed_items

# Usage
processor = NumberProcessor()

# Process numbers until we find one greater than 10
processor.process_until_condition(1, lambda x: x > 10)
print(processor.processed_numbers)  # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Find first multiple of 7 starting from 20
first_multiple = processor.find_first_multiple(20, 7)
print(first_multiple)  # 21

```

## Keeping methods short and cohesive

**Method cohesion** means each method should have a single, clear purpose. Short, focused methods are easier to understand, test, and maintain.

### Breaking down complex methods

```python-template
class OrderProcessor:
    """Demonstrating how to break down complex methods"""
    
    def __init__(self):
        self.orders = []
        self.inventory = {}
        self.customers = {}
    
    # BAD: One large method doing everything
    def process_order_bad(self, customer_id, items):
        """Example of a method that does too much"""
        # Validate customer
        if customer_id not in self.customers:
            return False, "Invalid customer"
        customer = self.customers[customer_id]
        if not customer.get('active', False):
            return False, "Inactive customer"
        
        # Check inventory
        for item_name, quantity in items.items():
            if item_name not in self.inventory:
                return False, f"Item {item_name} not found"
            if self.inventory[item_name] < quantity:
                return False, f"Insufficient stock for {item_name}"
        
        # Calculate pricing
        total = 0
        for item_name, quantity in items.items():
            price = self.get_item_price(item_name)
            total += price * quantity
        
        # Apply discounts
        if customer.get('vip', False):
            total *= 0.9  # 10% VIP discount
        if total > 100:
            total *= 0.95  # 5% bulk discount
        
        # Update inventory
        for item_name, quantity in items.items():
            self.inventory[item_name] -= quantity
        
        # Create order record
        order = {
            'customer_id': customer_id,
            'items': items,
            'total': total,
            'status': 'confirmed'
        }
        self.orders.append(order)
        
        return True, f"Order processed. Total: ${total:.2f}"
    
    # GOOD: Broken down into focused methods
    def process_order_good(self, customer_id, items):
        """Well-structured order processing"""
        # Each step is a separate, focused method
        if not self._validate_customer(customer_id):
            return False, "Customer validation failed"
        
        if not self._check_inventory_availability(items):
            return False, "Inventory check failed"
        
        total = self._calculate_order_total(customer_id, items)
        
        self._update_inventory(items)
        
        order = self._create_order_record(customer_id, items, total)
        
        return True, f"Order processed. Total: ${total:.2f}"
    
    def _validate_customer(self, customer_id):
        """Single responsibility: validate customer"""
        if customer_id not in self.customers:
            return False
        
        customer = self.customers[customer_id]
        return customer.get('active', False)
    
    def _check_inventory_availability(self, items):
        """Single responsibility: check if items are in stock"""
        for item_name, quantity in items.items():
            if item_name not in self.inventory:
                return False
            if self.inventory[item_name] < quantity:
                return False
        return True
    
    def _calculate_order_total(self, customer_id, items):
        """Single responsibility: calculate total with discounts"""
        # Calculate base total
        total = sum(self.get_item_price(name) * qty for name, qty in items.items())
        
        # Apply discounts
        total = self._apply_customer_discounts(customer_id, total)
        total = self._apply_volume_discounts(total)
        
        return total
    
    def _apply_customer_discounts(self, customer_id, total):
        """Apply customer-specific discounts"""
        customer = self.customers[customer_id]
        if customer.get('vip', False):
            total *= 0.9  # 10% VIP discount
        return total
    
    def _apply_volume_discounts(self, total):
        """Apply volume-based discounts"""
        if total > 100:
            total *= 0.95  # 5% bulk discount
        return total
    
    def _update_inventory(self, items):
        """Single responsibility: update inventory quantities"""
        for item_name, quantity in items.items():
            self.inventory[item_name] -= quantity
    
    def _create_order_record(self, customer_id, items, total):
        """Single responsibility: create and store order record"""
        order = {
            'customer_id': customer_id,
            'items': items,
            'total': total,
            'status': 'confirmed'
        }
        self.orders.append(order)
        return order
    
    def get_item_price(self, item_name):
        """Get price for an item"""
        # Simplified - in real system this might query a database
        prices = {'laptop': 999, 'mouse': 25, 'keyboard': 75}
        return prices.get(item_name, 0)

```

### Guidelines for method design

**1. Single Responsibility Principle:**

```python-template
class TextAnalyzer:
    """Example of methods with single responsibilities"""
    
    def __init__(self, text):
        self.text = text
    
    # Good: Each method has one clear purpose
    def count_words(self):
        """Count total words in text"""
        return len(self.text.split())
    
    def count_sentences(self):
        """Count sentences (simplified)"""
        return self.text.count('.') + self.text.count('!') + self.text.count('?')
    
    def find_longest_word(self):
        """Find the longest word"""
        words = self.text.split()
        return max(words, key=len) if words else ""
    
    def get_word_frequency(self):
        """Get frequency count of each word"""
        words = self.text.lower().split()
        frequency = {}
        for word in words:
            frequency[word] = frequency.get(word, 0) + 1
        return frequency
    
    # Good: Combines other methods appropriately
    def generate_summary(self):
        """Generate text summary using other methods"""
        return {
            'word_count': self.count_words(),
            'sentence_count': self.count_sentences(),
            'longest_word': self.find_longest_word(),
            'most_common_words': self._get_top_words(5)
        }
    
    def _get_top_words(self, n):
        """Helper method: get top N most frequent words"""
        frequency = self.get_word_frequency()
        sorted_words = sorted(frequency.items(), key=lambda x: x[1], reverse=True)
        return sorted_words[:n]

```

**2. Keep methods short (generally under 20 lines):**

```python-template
class Calculator:
    """Examples of appropriately sized methods"""
    
    def add(self, a, b):
        """Simple, short method"""
        return a + b
    
    def calculate_compound_interest(self, principal, rate, time, compounds_per_year):
        """Medium-length method with clear steps"""
        # Validate inputs
        if principal <= 0 or rate < 0 or time <= 0 or compounds_per_year <= 0:
            raise ValueError("Invalid input parameters")
        
        # Calculate compound interest
        rate_per_period = rate / compounds_per_year
        total_periods = compounds_per_year * time
        
        # Apply compound interest formula
        amount = principal * (1 + rate_per_period) ** total_periods
        
        return amount
    
    def solve_quadratic(self, a, b, c):
        """Method that's at the upper limit of good length"""
        if a == 0:
            raise ValueError("Coefficient 'a' cannot be zero")
        
        # Calculate discriminant
        discriminant = b**2 - 4*a*c
        
        # Determine number and type of solutions
        if discriminant > 0:
            # Two real solutions
            sqrt_discriminant = discriminant ** 0.5
            x1 = (-b + sqrt_discriminant) / (2*a)
            x2 = (-b - sqrt_discriminant) / (2*a)
            return (x1, x2)
        elif discriminant == 0:
            # One real solution
            x = -b / (2*a)
            return (x,)
        else:
            # Complex solutions
            real_part = -b / (2*a)
            imaginary_part = (abs(discriminant) ** 0.5) / (2*a)
            return (complex(real_part, imaginary_part), complex(real_part, -imaginary_part))

```

### Method extraction techniques

```python-template
class ReportGenerator:
    """Demonstrating method extraction techniques"""
    
    def __init__(self, data):
        self.data = data
    
    # Before extraction: complex method
    def generate_sales_report_before(self):
        """Complex method before extraction"""
        report = []
        
        # Header section
        report.append("SALES REPORT")
        report.append("=" * 50)
        report.append(f"Generated on: {self._get_current_date()}")
        report.append("")
        
        # Calculate totals
        total_sales = 0
        total_orders = len(self.data)
        
        for order in self.data:
            total_sales += order.get('amount', 0)
        
        # Summary section
        average_order = total_sales / total_orders if total_orders > 0 else 0
        report.append(f"Total Orders: {total_orders}")
        report.append(f"Total Sales: ${total_sales:.2f}")
        report.append(f"Average Order: ${average_order:.2f}")
        report.append("")
        
        # Detailed section
        report.append("DETAILED BREAKDOWN")
        report.append("-" * 30)
        
        for order in self.data:
            customer = order.get('customer', 'Unknown')
            amount = order.get('amount', 0)
            date = order.get('date', 'Unknown')
            report.append(f"{date:10} | {customer:20} | ${amount:8.2f}")
        
        return "\n".join(report)
    
    # After extraction: broken into focused methods
    def generate_sales_report_after(self):
        """Well-structured method after extraction"""
        report_sections = []
        
        report_sections.append(self._generate_header())
        report_sections.append(self._generate_summary())
        report_sections.append(self._generate_detailed_breakdown())
        
        return "\n\n".join(report_sections)
    
    def _generate_header(self):
        """Extract header generation"""
        lines = [
            "SALES REPORT",
            "=" * 50,
            f"Generated on: {self._get_current_date()}"
        ]
        return "\n".join(lines)
    
    def _generate_summary(self):
        """Extract summary calculations"""
        totals = self._calculate_totals()
        
        lines = [
            f"Total Orders: {totals['order_count']}",
            f"Total Sales: ${totals['total_sales']:.2f}",
            f"Average Order: ${totals['average_order']:.2f}"
        ]
        return "\n".join(lines)
    
    def _generate_detailed_breakdown(self):
        """Extract detailed breakdown"""
        lines = ["DETAILED BREAKDOWN", "-" * 30]
        
        for order in self.data:
            line = self._format_order_line(order)
            lines.append(line)
        
        return "\n".join(lines)
    
    def _calculate_totals(self):
        """Extract total calculations"""
        total_sales = sum(order.get('amount', 0) for order in self.data)
        total_orders = len(self.data)
        average_order = total_sales / total_orders if total_orders > 0 else 0
        
        return {
            'total_sales': total_sales,
            'order_count': total_orders,
            'average_order': average_order
        }
    
    def _format_order_line(self, order):
        """Extract order formatting"""
        customer = order.get('customer', 'Unknown')
        amount = order.get('amount', 0)
        date = order.get('date', 'Unknown')
        return f"{date:10} | {customer:20} | ${amount:8.2f}"
    
    def _get_current_date(self):
        """Helper method for date formatting"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M")

```

## Practice

/// details | Exercise 1: Implement selection logic
    type: question
    open: false

Create a `GradeCalculator` class with these methods:

- `add_grade(grade)`: Add a grade (0-100) with validation

- `get_letter_grade()`: Return A/B/C/D/F based on average

- `get_status()`: Return "PASSING" (≥60), "FAILING" (<60), or "NO_GRADES"

- `needs_improvement()`: Return True if average is below 70 or has any grade below 50

Use appropriate selection structures in each method.

/// details | Sample Solution
    type: success
    open: false

```python-exec
class GradeCalculator:
    """Grade calculator demonstrating selection structures"""
    
    def __init__(self):
        self.grades = []
    
    def add_grade(self, grade):
        """Add grade with validation using selection"""
        if not isinstance(grade, (int, float)):
            return False, "Grade must be a number"
        
        if grade < 0 or grade > 100:
            return False, "Grade must be between 0 and 100"
        
        self.grades.append(grade)
        return True, f"Grade {grade} added successfully"
    
    def get_letter_grade(self):
        """Calculate letter grade using selection"""
        if not self.grades:
            return "I"  # Incomplete
        
        average = sum(self.grades) / len(self.grades)
        
        if average >= 90:
            return "A"
        elif average >= 80:
            return "B"
        elif average >= 70:
            return "C"
        elif average >= 60:
            return "D"
        else:
            return "F"
    
    def get_status(self):
        """Determine passing status using selection"""
        if not self.grades:
            return "NO_GRADES"
        
        average = sum(self.grades) / len(self.grades)
        
        if average >= 60:
            return "PASSING"
        else:
            return "FAILING"
    
    def needs_improvement(self):
        """Check if student needs improvement using selection"""
        if not self.grades:
            return False
        
        average = sum(self.grades) / len(self.grades)
        
        # Check if average is below 70
        if average < 70:
            return True
        
        # Check if any individual grade is below 50
        for grade in self.grades:
            if grade < 50:
                return True
        
        return False
    
    def get_summary(self):
        """Generate summary using other methods"""
        if not self.grades:
            return "No grades recorded"
        
        average = sum(self.grades) / len(self.grades)
        return {
            'average': round(average, 2),
            'letter_grade': self.get_letter_grade(),
            'status': self.get_status(),
            'needs_improvement': self.needs_improvement(),
            'grade_count': len(self.grades)
        }

# Test the class
calc = GradeCalculator()
calc.add_grade(85)
calc.add_grade(78)
calc.add_grade(92)
calc.add_grade(45)  # Low grade

print(calc.get_summary())
# {'average': 75.0, 'letter_grade': 'C', 'status': 'PASSING', 'needs_improvement': True, 'grade_count': 4}

```

///
///

/// details | Exercise 2: Implement iteration logic
    type: question
    open: false

Create a `WordProcessor` class with these methods:

- `add_text(text)`: Add text to internal storage

- `find_words_longer_than(length)`: Return list of words longer than specified length

- `count_word_frequencies()`: Return dictionary of word frequencies

- `remove_words_containing(substring)`: Remove all words containing the substring

- `get_statistics()`: Return total words, unique words, average word length

Use appropriate iteration structures in each method.

/// details | Sample Solution
    type: success
    open: false

```python-exec
class WordProcessor:
    """Word processor demonstrating iteration structures"""
    
    def __init__(self):
        self.texts = []
    
    def add_text(self, text):
        """Add text to storage"""
        if text and text.strip():
            self.texts.append(text.strip())
            return True
        return False
    
    def _get_all_words(self):
        """Helper method to get all words from all texts"""
        all_words = []
        for text in self.texts:
            words = text.lower().split()
            for word in words:
                # Clean word of punctuation
                cleaned = ''.join(char for char in word if char.isalnum())
                if cleaned:
                    all_words.append(cleaned)
        return all_words
    
    def find_words_longer_than(self, length):
        """Find words longer than specified length using iteration"""
        long_words = []
        all_words = self._get_all_words()
        
        for word in all_words:
            if len(word) > length:
                if word not in long_words:  # Avoid duplicates
                    long_words.append(word)
        
        return long_words
    
    def count_word_frequencies(self):
        """Count word frequencies using iteration"""
        frequencies = {}
        all_words = self._get_all_words()
        
        for word in all_words:
            if word in frequencies:
                frequencies[word] += 1
            else:
                frequencies[word] = 1
        
        return frequencies
    
    def remove_words_containing(self, substring):
        """Remove words containing substring using iteration"""
        removed_count = 0
        substring_lower = substring.lower()
        
        # Process each text
        for i in range(len(self.texts)):
            words = self.texts[i].split()
            filtered_words = []
            
            for word in words:
                if substring_lower not in word.lower():
                    filtered_words.append(word)
                else:
                    removed_count += 1
            
            self.texts[i] = ' '.join(filtered_words)
        
        return removed_count
    
    def get_statistics(self):
        """Calculate statistics using iteration"""
        all_words = self._get_all_words()
        
        if not all_words:
            return {
                'total_words': 0,
                'unique_words': 0,
                'average_length': 0
            }
        
        # Count unique words
        unique_words = set()
        total_length = 0
        
        for word in all_words:
            unique_words.add(word)
            total_length += len(word)
        
        return {
            'total_words': len(all_words),
            'unique_words': len(unique_words),
            'average_length': round(total_length / len(all_words), 2)
        }
    
    def find_most_common_words(self, n=5):
        """Find N most common words using iteration"""
        frequencies = self.count_word_frequencies()
        
        if not frequencies:
            return []
        
        # Convert to list of tuples and sort
        word_freq_pairs = []
        for word, freq in frequencies.items():
            word_freq_pairs.append((word, freq))
        
        # Sort by frequency (descending)
        for i in range(len(word_freq_pairs)):
            for j in range(i + 1, len(word_freq_pairs)):
                if word_freq_pairs[j][1] > word_freq_pairs[i][1]:
                    word_freq_pairs[i], word_freq_pairs[j] = word_freq_pairs[j], word_freq_pairs[i]
        
        return word_freq_pairs[:n]

# Test the class
processor = WordProcessor()
processor.add_text("The quick brown fox jumps over the lazy dog")
processor.add_text("The dog was very lazy and the fox was quick")

print("Long words:", processor.find_words_longer_than(4))
print("Statistics:", processor.get_statistics())
print("Most common:", processor.find_most_common_words(3))
print("Removed 'the':", processor.remove_words_containing("the"))

```

///
///

/// details | Exercise 3: Refactor a complex method
    type: question
    open: false

This method does too much. Refactor it into smaller, focused methods:

```python-template
class StudentManager:
    def process_student_data(self, student_data):
        # Validate student data
        if not student_data.get('name') or not student_data.get('id'):
            return False, "Missing required fields"
        
        # Calculate GPA
        grades = student_data.get('grades', [])
        if grades:
            total = sum(grades)
            gpa = total / len(grades)
        else:
            gpa = 0
        
        # Determine academic status
        if gpa >= 3.5:
            status = "Honor Roll"
        elif gpa >= 2.0:
            status = "Good Standing"
        else:
            status = "Probation"
        
        # Check graduation eligibility
        required_credits = 120
        earned_credits = student_data.get('credits', 0)
        can_graduate = earned_credits >= required_credits and gpa >= 2.0
        
        # Generate report
        report = f"Student: {student_data['name']}\n"
        report += f"ID: {student_data['id']}\n"
        report += f"GPA: {gpa:.2f}\n"
        report += f"Status: {status}\n"
        report += f"Credits: {earned_credits}/{required_credits}\n"
        report += f"Can Graduate: {'Yes' if can_graduate else 'No'}\n"
        
        return True, report

```

**Task**: Break this into focused methods with single responsibilities.

/// details | Sample Solution
    type: success
    open: false

```python-template
class StudentManager:
    """Refactored version with focused methods"""
    
    def process_student_data(self, student_data):
        """Main method that coordinates other methods"""
        # Validation
        if not self._validate_student_data(student_data):
            return False, "Missing required fields"
        
        # Process the data using focused methods
        gpa = self._calculate_gpa(student_data.get('grades', []))
        status = self._determine_academic_status(gpa)
        can_graduate = self._check_graduation_eligibility(student_data, gpa)
        report = self._generate_student_report(student_data, gpa, status, can_graduate)
        
        return True, report
    
    def _validate_student_data(self, student_data):
        """Single responsibility: validate required fields"""
        required_fields = ['name', 'id']
        
        for field in required_fields:
            if not student_data.get(field):
                return False
        
        return True
    
    def _calculate_gpa(self, grades):
        """Single responsibility: calculate GPA from grades"""
        if not grades:
            return 0.0
        
        total = sum(grades)
        return total / len(grades)
    
    def _determine_academic_status(self, gpa):
        """Single responsibility: determine academic status"""
        if gpa >= 3.5:
            return "Honor Roll"
        elif gpa >= 2.0:
            return "Good Standing"
        else:
            return "Probation"
    
    def _check_graduation_eligibility(self, student_data, gpa):
        """Single responsibility: check if student can graduate"""
        required_credits = 120
        earned_credits = student_data.get('credits', 0)
        
        return earned_credits >= required_credits and gpa >= 2.0
    
    def _generate_student_report(self, student_data, gpa, status, can_graduate):
        """Single responsibility: format the report"""
        required_credits = 120
        earned_credits = student_data.get('credits', 0)
        
        lines = [
            f"Student: {student_data['name']}",
            f"ID: {student_data['id']}",
            f"GPA: {gpa:.2f}",
            f"Status: {status}",
            f"Credits: {earned_credits}/{required_credits}",
            f"Can Graduate: {'Yes' if can_graduate else 'No'}"
        ]
        
        return '\n'.join(lines)
    
    # Additional helper methods for extended functionality
    def _get_required_credits(self):
        """Get required credits for graduation"""
        return 120
    
    def _format_gpa(self, gpa):
        """Format GPA for display"""
        return f"{gpa:.2f}"

# Benefits of refactoring:
# 1. Each method has a single, clear responsibility
# 2. Methods are short and easy to understand
# 3. Easy to test individual components
# 4. Easy to modify specific functionality
# 5. Reusable methods can be called from other places

```

///
///

## Recap

- **Selection structures** (if/elif/else) in methods enable decision-making based on object state and parameters

- **Iteration structures** (for/while loops) allow methods to process collections and repeat operations

- **Method cohesion** means each method should have a single, well-defined purpose

- **Short methods** (generally under 20 lines) are easier to understand, test, and maintain

- **Method extraction** breaks complex methods into smaller, focused methods

- **Single Responsibility Principle** ensures each method does one thing well

- **Control flow best practices** include proper validation, clear logic flow, and avoiding deeply nested structures

- **Good method design** balances functionality with readability and maintainability

Well-designed methods with appropriate control structures create classes that are easy to understand, test, and modify. By keeping methods focused and cohesive, you build more maintainable object-oriented systems.
