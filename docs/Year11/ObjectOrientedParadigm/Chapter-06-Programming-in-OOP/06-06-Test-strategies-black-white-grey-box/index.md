---
title: "Section 6.6: Test Strategies - Black/White/Grey Box"
---

# Section 6.6: Test Strategies - Black/White/Grey Box

## Learning Objectives

By the end of this section, you will be able to:

- Distinguish between black box, white box, and grey box testing strategies

- Design tests based on specifications (black box approach)

- Design tests based on code structure (white box approach)

- Choose appropriate inputs and expected outcomes for different testing strategies

- Apply boundary value analysis and equivalence partitioning techniques

- Combine testing strategies effectively for comprehensive test coverage

- Understand when to use each testing strategy in object-oriented programming

## Introduction

Different testing strategies focus on different aspects of software quality. The choice of testing strategy affects how you design test cases, what inputs you choose, and how you determine expected outcomes. Understanding these strategies helps you create more effective and comprehensive test suites.

The three main testing strategies are named after the level of visibility into the system's internal workings:

- **Black Box**: No knowledge of internal implementation

- **White Box**: Full knowledge of internal implementation  

- **Grey Box**: Partial knowledge of internal implementation

Each strategy has its strengths and is appropriate for different testing scenarios.

## Black Box Testing

Black box testing focuses on the external behavior of a system without considering its internal implementation. Test cases are designed based on specifications, requirements, and expected functionality.

### Characteristics of Black Box Testing

- **Input-Output Focus**: Tests examine what the system produces for given inputs

- **Specification-Based**: Test cases derived from requirements and user stories

- **Implementation Independent**: Tests remain valid even if internal code changes

- **User Perspective**: Tests reflect how users will actually interact with the system

### Example: Testing a Grade Calculator (Black Box Approach)

**Specification**: "The grade calculator should convert numerical scores (0-100) to letter grades using the standard scale: A (90-100), B (80-89), C (70-79), D (60-69), F (0-59). Invalid inputs should raise appropriate errors."

```python-template
import unittest

class GradeCalculator:
    """Converts numerical scores to letter grades."""
    
    def calculate_grade(self, score):
        """
        Convert numerical score to letter grade.
        
        Args:
            score (float): Numerical score between 0 and 100
            
        Returns:
            str: Letter grade (A, B, C, D, or F)
            
        Raises:
            ValueError: If score is not between 0 and 100
        """
        if not isinstance(score, (int, float)):
            raise ValueError("Score must be a number")
        
        if score < 0 or score > 100:
            raise ValueError("Score must be between 0 and 100")
        
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"


class TestGradeCalculatorBlackBox(unittest.TestCase):
    """Black box tests based on specification only."""
    
    def setUp(self):
        self.calculator = GradeCalculator()
    
    def test_a_grade_range(self):
        """Test A grade range (90-100) based on specification."""
        # Test boundary values and middle values
        self.assertEqual(self.calculator.calculate_grade(90), "A")  # Lower boundary
        self.assertEqual(self.calculator.calculate_grade(95), "A")  # Middle value
        self.assertEqual(self.calculator.calculate_grade(100), "A") # Upper boundary
    
    def test_b_grade_range(self):
        """Test B grade range (80-89) based on specification."""
        self.assertEqual(self.calculator.calculate_grade(80), "B")  # Lower boundary
        self.assertEqual(self.calculator.calculate_grade(85), "B")  # Middle value
        self.assertEqual(self.calculator.calculate_grade(89), "B")  # Upper boundary
    
    def test_c_grade_range(self):
        """Test C grade range (70-79) based on specification."""
        self.assertEqual(self.calculator.calculate_grade(70), "C")
        self.assertEqual(self.calculator.calculate_grade(75), "C")
        self.assertEqual(self.calculator.calculate_grade(79), "C")
    
    def test_d_grade_range(self):
        """Test D grade range (60-69) based on specification."""
        self.assertEqual(self.calculator.calculate_grade(60), "D")
        self.assertEqual(self.calculator.calculate_grade(65), "D")
        self.assertEqual(self.calculator.calculate_grade(69), "D")
    
    def test_f_grade_range(self):
        """Test F grade range (0-59) based on specification."""
        self.assertEqual(self.calculator.calculate_grade(0), "F")   # Lower boundary
        self.assertEqual(self.calculator.calculate_grade(30), "F")  # Middle value
        self.assertEqual(self.calculator.calculate_grade(59), "F")  # Upper boundary
    
    def test_invalid_inputs_based_on_specification(self):
        """Test error handling based on specification."""
        # Negative numbers should raise error
        with self.assertRaises(ValueError):
            self.calculator.calculate_grade(-1)
        
        # Numbers above 100 should raise error
        with self.assertRaises(ValueError):
            self.calculator.calculate_grade(101)
        
        # Non-numeric inputs should raise error
        with self.assertRaises(ValueError):
            self.calculator.calculate_grade("85")
    
    def test_decimal_scores(self):
        """Test decimal scores based on specification."""
        self.assertEqual(self.calculator.calculate_grade(89.5), "B")
        self.assertEqual(self.calculator.calculate_grade(79.9), "C")
        self.assertEqual(self.calculator.calculate_grade(59.9), "F")

```

### Boundary Value Analysis

Black box testing often uses **boundary value analysis** to identify test cases at the edges of input domains:

```python-template
class TestPasswordValidatorBlackBox(unittest.TestCase):
    """Black box testing using boundary value analysis."""
    
    def setUp(self):
        # Specification: Password must be 8-20 characters, contain at least
        # one uppercase, one lowercase, one digit, and one special character
        self.validator = PasswordValidator()
    
    def test_length_boundaries(self):
        """Test password length boundaries."""
        # Just below minimum (7 chars) - should fail
        with self.assertRaises(ValueError):
            self.validator.validate("Abc123!")
        
        # Minimum length (8 chars) - should pass
        self.assertTrue(self.validator.validate("Abc1234!"))
        
        # Maximum length (20 chars) - should pass
        self.assertTrue(self.validator.validate("Abc123!@#$%^&*()1234"))
        
        # Just above maximum (21 chars) - should fail
        with self.assertRaises(ValueError):
            self.validator.validate("Abc123!@#$%^&*()12345")
    
    def test_character_requirements_boundaries(self):
        """Test character requirement boundaries."""
        # No uppercase - should fail
        with self.assertRaises(ValueError):
            self.validator.validate("abc123!@")
        
        # Exactly one uppercase - should pass
        self.assertTrue(self.validator.validate("Abc123!@"))
        
        # No digits - should fail
        with self.assertRaises(ValueError):
            self.validator.validate("Abcdef!@")
        
        # Exactly one digit - should pass
        self.assertTrue(self.validator.validate("Abcdef1!"))

```

### Equivalence Partitioning

**Equivalence partitioning** divides input data into groups that should be processed similarly:

```python-template
class TestEmailValidatorBlackBox(unittest.TestCase):
    """Black box testing using equivalence partitioning."""
    
    def setUp(self):
        self.validator = EmailValidator()
    
    def test_valid_email_equivalence_classes(self):
        """Test different types of valid emails."""
        # Standard email format
        self.assertTrue(self.validator.is_valid("user@domain.com"))
        
        # Email with numbers
        self.assertTrue(self.validator.is_valid("user123@domain.com"))
        
        # Email with dots in username
        self.assertTrue(self.validator.is_valid("first.last@domain.com"))
        
        # Email with subdomain
        self.assertTrue(self.validator.is_valid("user@mail.domain.com"))
    
    def test_invalid_email_equivalence_classes(self):
        """Test different types of invalid emails."""
        # Missing @ symbol
        self.assertFalse(self.validator.is_valid("userdomain.com"))
        
        # Missing domain
        self.assertFalse(self.validator.is_valid("user@"))
        
        # Missing username
        self.assertFalse(self.validator.is_valid("@domain.com"))
        
        # Multiple @ symbols
        self.assertFalse(self.validator.is_valid("user@@domain.com"))
        
        # Invalid characters
        self.assertFalse(self.validator.is_valid("user name@domain.com"))

```

## White Box Testing

White box testing examines the internal structure of code to design test cases. It focuses on testing all paths, conditions, and statements within the implementation.

### Characteristics of White Box Testing

- **Code Structure Focus**: Tests based on the actual implementation

- **Path Coverage**: Ensures all code paths are executed

- **Condition Coverage**: Tests all logical conditions

- **Statement Coverage**: Ensures every line of code is executed

### Example: Testing a Discount Calculator (White Box Approach)

Looking at the implementation to design comprehensive tests:

```python-template
class DiscountCalculator:
    """Calculates discounts based on customer type and order amount."""
    
    def calculate_discount(self, customer_type, order_amount, is_holiday_season=False):
        """
        Calculate discount percentage based on customer and order details.
        
        Args:
            customer_type (str): "regular", "premium", or "vip"
            order_amount (float): Order total amount
            is_holiday_season (bool): Whether it's holiday season
            
        Returns:
            float: Discount percentage (0.0 to 0.5)
        """
        discount = 0.0
        
        # Base discount by customer type
        if customer_type == "regular":
            discount = 0.0
        elif customer_type == "premium":
            discount = 0.1
        elif customer_type == "vip":
            discount = 0.2
        else:
            raise ValueError(f"Invalid customer type: {customer_type}")
        
        # Additional discount for large orders
        if order_amount > 1000:
            discount += 0.1
        elif order_amount > 500:
            discount += 0.05
        
        # Holiday season bonus
        if is_holiday_season:
            discount += 0.05
        
        # Cap maximum discount
        if discount > 0.5:
            discount = 0.5
        
        return discount


class TestDiscountCalculatorWhiteBox(unittest.TestCase):
    """White box tests ensuring all code paths are covered."""
    
    def setUp(self):
        self.calculator = DiscountCalculator()
    
    def test_all_customer_type_paths(self):
        """Test all customer type code paths."""
        # Path 1: Regular customer (discount = 0.0)
        result = self.calculator.calculate_discount("regular", 100)
        self.assertEqual(result, 0.0)
        
        # Path 2: Premium customer (discount = 0.1)
        result = self.calculator.calculate_discount("premium", 100)
        self.assertEqual(result, 0.1)
        
        # Path 3: VIP customer (discount = 0.2)
        result = self.calculator.calculate_discount("vip", 100)
        self.assertEqual(result, 0.2)
        
        # Path 4: Invalid customer type (exception path)
        with self.assertRaises(ValueError):
            self.calculator.calculate_discount("invalid", 100)
    
    def test_all_order_amount_conditions(self):
        """Test all order amount condition branches."""
        # Amount <= 500: no additional discount
        result = self.calculator.calculate_discount("regular", 400)
        self.assertEqual(result, 0.0)
        
        # 500 < amount <= 1000: +0.05 discount
        result = self.calculator.calculate_discount("regular", 600)
        self.assertEqual(result, 0.05)
        
        # Amount > 1000: +0.1 discount
        result = self.calculator.calculate_discount("regular", 1200)
        self.assertEqual(result, 0.1)
    
    def test_holiday_season_condition(self):
        """Test holiday season condition branch."""
        # Without holiday season
        result = self.calculator.calculate_discount("premium", 600, False)
        self.assertEqual(result, 0.15)  # 0.1 + 0.05
        
        # With holiday season
        result = self.calculator.calculate_discount("premium", 600, True)
        self.assertEqual(result, 0.2)   # 0.1 + 0.05 + 0.05
    
    def test_maximum_discount_cap_condition(self):
        """Test the discount cap condition."""
        # Test case that would exceed 0.5 limit
        # VIP (0.2) + large order (0.1) + holiday (0.05) + more = would be > 0.5
        result = self.calculator.calculate_discount("vip", 1500, True)
        self.assertEqual(result, 0.35)  # 0.2 + 0.1 + 0.05 = 0.35 (under cap)
        
        # Create scenario that hits the cap
        # Need to modify method or create extreme case that would exceed 0.5
    
    def test_complex_path_combinations(self):
        """Test combinations of conditions to ensure all paths work together."""
        # VIP customer + large order + holiday season
        result = self.calculator.calculate_discount("vip", 1200, True)
        expected = 0.35  # 0.2 (vip) + 0.1 (large order) + 0.05 (holiday)
        self.assertEqual(result, expected)
        
        # Premium customer + medium order + no holiday
        result = self.calculator.calculate_discount("premium", 750, False)
        expected = 0.15  # 0.1 (premium) + 0.05 (medium order)
        self.assertEqual(result, expected)
        
        # Regular customer + large order + holiday
        result = self.calculator.calculate_discount("regular", 1100, True)
        expected = 0.15  # 0.0 (regular) + 0.1 (large order) + 0.05 (holiday)
        self.assertEqual(result, expected)

```

### Statement and Branch Coverage

White box testing aims for complete coverage:

```python-template
class TestBankAccountWhiteBox(unittest.TestCase):
    """White box testing ensuring statement and branch coverage."""
    
    def test_withdraw_method_all_branches(self):
        """Test all branches in withdraw method."""
        account = BankAccount("Test", 100)
        
        # Branch 1: amount <= 0 (first if condition true)
        with self.assertRaises(ValueError):
            account.withdraw(-10)
        
        with self.assertRaises(ValueError):
            account.withdraw(0)
        
        # Branch 2: amount > balance (second if condition true)
        with self.assertRaises(ValueError):
            account.withdraw(150)
        
        # Branch 3: valid withdrawal (both if conditions false)
        result = account.withdraw(50)
        self.assertEqual(result, 50)
        self.assertEqual(account.balance, 50)
        
        # Ensure transaction history is updated (statement coverage)
        self.assertEqual(len(account.transaction_history), 1)
        self.assertIn("Withdrawal", account.transaction_history[0])

```

## Grey Box Testing

Grey box testing combines elements of both black box and white box testing. Testers have partial knowledge of the internal implementation, which helps design more targeted test cases.

### Characteristics of Grey Box Testing

- **Limited Internal Knowledge**: Some understanding of code structure without full access

- **Strategic Test Design**: Uses internal knowledge to focus on risky areas

- **Integration Focus**: Often used for integration and system testing

- **Risk-Based**: Targets areas most likely to contain defects

### Example: Testing a User Authentication System (Grey Box Approach)

Knowing that the system uses password hashing and session management internally:

```python-template
class TestUserAuthenticationGreyBox(unittest.TestCase):
    """Grey box testing with knowledge of internal security mechanisms."""
    
    def setUp(self):
        self.auth_system = UserAuthenticationSystem()
    
    def test_password_storage_security(self):
        """Test that passwords are not stored in plain text (internal knowledge)."""
        username = "testuser"
        password = "SecurePass123!"
        
        # Create user
        self.auth_system.create_user(username, password)
        
        # Grey box knowledge: passwords should be hashed, not stored plainly
        # We can't see the implementation, but we know hashing is used
        user_data = self.auth_system._get_user_data(username)  # Internal method
        
        # The stored password should not match the original
        self.assertNotEqual(user_data['password_hash'], password)
        
        # But authentication should still work
        self.assertTrue(self.auth_system.authenticate(username, password))
    
    def test_session_timeout_behavior(self):
        """Test session timeout (knowing sessions are used internally)."""
        username = "testuser"
        password = "SecurePass123!"
        
        # Create and login user
        self.auth_system.create_user(username, password)
        session_id = self.auth_system.login(username, password)
        
        # Initially, session should be valid
        self.assertTrue(self.auth_system.is_session_valid(session_id))
        
        # Grey box knowledge: sessions have timeout mechanism
        # Simulate time passing (if system has time-based expiry)
        self.auth_system._advance_time(hours=25)  # Internal method
        
        # Session should now be invalid
        self.assertFalse(self.auth_system.is_session_valid(session_id))
    
    def test_rate_limiting_mechanism(self):
        """Test login rate limiting (knowing it exists internally)."""
        username = "testuser"
        password = "SecurePass123!"
        wrong_password = "WrongPassword"
        
        self.auth_system.create_user(username, password)
        
        # Grey box knowledge: system has rate limiting after failed attempts
        # Make multiple failed login attempts
        for i in range(5):  # Assuming 5 is the limit
            result = self.auth_system.authenticate(username, wrong_password)
            self.assertFalse(result)
        
        # Now even correct password should be temporarily blocked
        result = self.auth_system.authenticate(username, password)
        self.assertFalse(result)  # Should be blocked due to rate limiting
        
        # Verify the blocking is temporary (wait for cooldown)
        self.auth_system._advance_time(minutes=15)  # Internal time advancement
        result = self.auth_system.authenticate(username, password)
        self.assertTrue(result)  # Should work again after cooldown

```

### Integration Testing with Grey Box Approach

```python-template
class TestOrderProcessingGreyBox(unittest.TestCase):
    """Grey box testing for order processing system integration."""
    
    def setUp(self):
        # Grey box knowledge: system uses database transactions
        self.order_system = OrderProcessingSystem()
        self.inventory = InventorySystem()
        self.payment = PaymentSystem()
        
        # Set up test data knowing internal structure
        self.inventory.add_product("PROD001", "Widget", 10.0, 100)
        self.payment.add_test_account("CUST001", 1000.0)
    
    def test_order_rollback_on_payment_failure(self):
        """Test transaction rollback behavior (grey box knowledge)."""
        customer_id = "CUST001"
        product_id = "PROD001"
        quantity = 5
        
        # Grey box knowledge: system uses transactions that can rollback
        original_inventory = self.inventory.get_stock(product_id)
        
        # Simulate payment failure by removing customer funds
        self.payment.set_account_balance(customer_id, 1.0)  # Not enough for order
        
        # Attempt to place order
        with self.assertRaises(PaymentFailureError):
            self.order_system.process_order(customer_id, product_id, quantity)
        
        # Grey box expectation: inventory should be unchanged due to rollback
        current_inventory = self.inventory.get_stock(product_id)
        self.assertEqual(current_inventory, original_inventory)
    
    def test_concurrent_order_handling(self):
        """Test concurrent order processing (knowing internal locking)."""
        # Grey box knowledge: system has concurrency controls
        product_id = "PROD001"
        initial_stock = self.inventory.get_stock(product_id)
        
        # Simulate concurrent orders for same product
        order1_result = self.order_system.process_order("CUST001", product_id, 3)
        order2_result = self.order_system.process_order("CUST002", product_id, 4)
        
        # Both orders should succeed (enough stock)
        self.assertTrue(order1_result.success)
        self.assertTrue(order2_result.success)
        
        # Stock should be correctly decremented
        final_stock = self.inventory.get_stock(product_id)
        expected_stock = initial_stock - 3 - 4
        self.assertEqual(final_stock, expected_stock)

```

## Choosing the Right Testing Strategy

Different scenarios call for different testing strategies:

### When to Use Black Box Testing

- **Requirements Validation**: Ensuring software meets specified requirements

- **User Acceptance Testing**: Verifying system works from user perspective

- **API Testing**: Testing public interfaces without implementation knowledge

- **Regression Testing**: Ensuring changes don't break existing functionality

### When to Use White Box Testing

- **Unit Testing**: Testing individual methods and classes thoroughly

- **Code Coverage**: Ensuring all code paths are executed

- **Security Testing**: Finding vulnerabilities in code logic

- **Performance Optimization**: Identifying bottlenecks in specific code sections

### When to Use Grey Box Testing

- **Integration Testing**: Testing component interactions with some internal knowledge

- **System Testing**: End-to-end testing with architectural awareness

- **Security Testing**: Targeting known security mechanisms

- **Debugging**: Investigating issues with partial system knowledge

## Practice Exercises

/// details | Exercise 1: Black Box Test Design
    type: question
    open: false

Design black box tests for a library fine calculator with this specification:

**Specification**: "Calculate library fines based on days overdue. No fine for 0-7 days. $0.50/day for 8-14 days. $1.00/day for 15-30 days. $2.00/day for 31+ days. Maximum fine is $50.00."
///
///

/// details | Exercise 2: White Box Test Design
    type: question
    open: false

Analyze this code and design white box tests to achieve 100% statement and branch coverage:

```python-template
def calculate_shipping_cost(weight, distance, priority):
    """Calculate shipping cost based on weight, distance, and priority."""
    base_cost = 0.0
    
    # Weight-based cost
    if weight <= 1:
        base_cost = 5.0
    elif weight <= 5:
        base_cost = 10.0
    else:
        base_cost = 15.0 + (weight - 5) * 2.0
    
    # Distance multiplier
    if distance > 1000:
        base_cost *= 2.0
    elif distance > 500:
        base_cost *= 1.5
    
    # Priority adjustment
    if priority == "express":
        base_cost *= 2.0
    elif priority == "overnight":
        base_cost *= 3.0
    elif priority != "standard":
        raise ValueError("Invalid priority level")
    
    return round(base_cost, 2)

```

///
///

/// details | Exercise 3: Grey Box Test Strategy
    type: question
    open: false

You know that a student grading system uses the following internal mechanisms:

- Database transactions for grade updates

- Caching for frequently accessed student records  

- Audit logging for all grade changes

- Grade validation rules in a separate module

Design grey box tests that leverage this internal knowledge to test critical scenarios.
///


## Section Recap

In this section, you learned about three fundamental testing strategies:

1. **Black Box Testing**: Focus on external behavior based on specifications, using techniques like boundary value analysis and equivalence partitioning

2. **White Box Testing**: Examine internal code structure to ensure complete coverage of statements, branches, and paths

3. **Grey Box Testing**: Combine specification knowledge with internal system understanding for targeted, risk-based testing

4. **Strategy Selection**: Choose the appropriate strategy based on testing goals, available information, and the specific aspects of quality you want to verify

Each strategy provides different insights into software quality. Black box testing ensures the system meets user requirements, white box testing verifies implementation correctness, and grey box testing targets high-risk areas with focused precision.

Effective testing often combines all three strategies to achieve comprehensive coverage and confidence in software quality. Understanding when and how to apply each strategy is essential for creating robust, reliable object-oriented systems.
