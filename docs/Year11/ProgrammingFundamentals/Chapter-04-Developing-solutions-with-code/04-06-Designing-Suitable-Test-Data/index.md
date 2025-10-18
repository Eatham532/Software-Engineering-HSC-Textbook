---
title: "4.6 Designing Suitable Test Data"
---

# 4.6 Designing Suitable Test Data

## What is Test Data?

**Test data** is the input you use to check whether your program works correctly. Good test data helps you find bugs before your users do and ensures your program handles all possible situations properly.

Think of test data like quality control in manufacturing - you wouldn't sell a product without testing it first. The same principle applies to software: you need to test your code with carefully chosen inputs to make sure it works correctly.

## Why Test Data Design Matters

### The Cost of Poor Testing

```python-exec
def calculate_discount(price, discount_percent):
    """Calculate discounted price - what could go wrong?"""
    discounted_amount = price * (discount_percent / 100)
    final_price = price - discounted_amount
    return final_price

# If we only test with "normal" data:
print(calculate_discount(100, 10))  # 90.0 - looks good!
print(calculate_discount(50, 20))   # 40.0 - works fine!

# But what happens with edge cases?
print(calculate_discount(100, 0))    # 100.0 - zero discount, okay
print(calculate_discount(100, 100))  # 0.0 - 100% discount, hmm...
print(calculate_discount(100, 150))  # -50.0 - customer gets money back?!
print(calculate_discount(-10, 10))   # -9.0 - negative price?
print(calculate_discount(100, -10))  # 110.0 - negative discount increases price?

```

Without proper test data design, bugs like these can make it into production!

### Benefits of Good Test Data

1. **Find bugs early** - Cheaper and easier to fix

2. **Build confidence** - Know your code works in all situations

3. **Prevent regressions** - Make sure fixes don't break other things

4. **Document expected behavior** - Tests show how the code should work

## Types of Test Data

### Normal/Typical Data

**Normal data** represents the most common inputs your program will receive.

```python-exec
def calculate_bmi(weight_kg, height_m):
    """Calculate Body Mass Index."""
    if height_m <= 0:
        return None
    
    bmi = weight_kg / (height_m * height_m)
    return round(bmi, 1)

# Normal test data - typical adult values
normal_test_cases = [
    # (weight, height, expected_bmi)
    (70, 1.75, 22.9),    # Average adult
    (60, 1.60, 23.4),    # Petite adult
    (85, 1.80, 26.2),    # Larger adult
    (55, 1.65, 20.2),    # Light adult
]

print("=== Normal Data Tests ===")
for weight, height, expected in normal_test_cases:
    result = calculate_bmi(weight, height)
    status = "✓ PASS" if abs(result - expected) < 0.1 else "✗ FAIL"
    print(f"BMI({weight}kg, {height}m) = {result} (expected {expected}) {status}")

```

### Boundary/Edge Data

**Boundary data** tests the limits of what your program should handle.

```python-exec
def grade_assignment(score):
    """Convert numeric score to letter grade."""
    if score < 0 or score > 100:
        return "Invalid"
    elif score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

# Boundary test data - test the edges of ranges
boundary_test_cases = [
    # Test the boundaries of each grade range
    (0, "F"),      # Bottom boundary
    (59, "F"),     # Just below D
    (60, "D"),     # Bottom of D range
    (69, "D"),     # Top of D range
    (70, "C"),     # Bottom of C range
    (79, "C"),     # Top of C range
    (80, "B"),     # Bottom of B range
    (89, "B"),     # Top of B range
    (90, "A"),     # Bottom of A range
    (100, "A"),    # Top boundary
    
    # Invalid boundaries
    (-1, "Invalid"),   # Just below valid range
    (101, "Invalid"),  # Just above valid range
]

print("\n=== Boundary Data Tests ===")
for score, expected in boundary_test_cases:
    result = grade_assignment(score)
    status = "✓ PASS" if result == expected else "✗ FAIL"
    print(f"grade({score}) = '{result}' (expected '{expected}') {status}")

```

### Extreme Data

**Extreme data** tests very large, very small, or unusual values.

```python-exec
def calculate_compound_interest(principal, rate, years):
    """Calculate compound interest over time."""
    if principal <= 0 or rate < 0 or years < 0:
        return None
    
    # A = P(1 + r)^t
    final_amount = principal * ((1 + rate/100) ** years)
    return round(final_amount, 2)

# Extreme test data
extreme_test_cases = [
    # Very small values
    (0.01, 0.1, 1, 0.01),        # Tiny principal
    (100, 0.001, 1, 100.001),    # Tiny interest rate
    
    # Very large values
    (1000000, 5, 10, 1628894.63),  # Large principal
    (100, 50, 5, 759.375),         # High interest rate
    (100, 5, 50, 1146.74),         # Many years
    
    # Zero values
    (100, 0, 10, 100),           # Zero interest
    (100, 5, 0, 100),            # Zero years
    
    # Edge case: exactly 1 year, 1% interest
    (100, 1, 1, 101),
]

print("\n=== Extreme Data Tests ===")
for principal, rate, years, expected in extreme_test_cases:
    result = calculate_compound_interest(principal, rate, years)
    if result is not None:
        status = "✓ PASS" if abs(result - expected) < 0.01 else "✗ FAIL"
        print(f"compound_interest({principal}, {rate}%, {years}y) = {result} (expected {expected}) {status}")
    else:
        print(f"compound_interest({principal}, {rate}%, {years}y) = None (invalid input)")

```

### Invalid/Error Data

**Invalid data** tests how your program handles bad input.

```python
def parse_student_id(student_id):
    """Parse student ID format: 'STU' + 6 digits (e.g., 'STU123456')."""
    
    # Check if string
    if not isinstance(student_id, str):
        return {"valid": False, "error": "Student ID must be a string"}
    
    # Check length
    if len(student_id) != 9:
        return {"valid": False, "error": "Student ID must be 9 characters long"}
    
    # Check prefix
    if not student_id.startswith("STU"):
        return {"valid": False, "error": "Student ID must start with 'STU'"}
    
    # Check if remaining characters are digits
    number_part = student_id[3:]
    if not number_part.isdigit():
        return {"valid": False, "error": "Student ID must end with 6 digits"}
    
    return {"valid": True, "id": student_id, "number": int(number_part)}

# Invalid/Error test data
invalid_test_cases = [
    # Wrong types
    (123456, "Student ID must be a string"),
    (None, "Student ID must be a string"),
    (["STU123456"], "Student ID must be a string"),
    
    # Wrong length
    ("STU12345", "Student ID must be 9 characters long"),    # Too short
    ("STU1234567", "Student ID must be 9 characters long"),  # Too long
    ("", "Student ID must be 9 characters long"),           # Empty
    
    # Wrong prefix
    ("ABC123456", "Student ID must start with 'STU'"),
    ("stu123456", "Student ID must start with 'STU'"),      # Lowercase
    ("123456789", "Student ID must start with 'STU'"),
    
    # Wrong number format
    ("STU12345A", "Student ID must end with 6 digits"),     # Letter in number
    ("STUABCDEF", "Student ID must end with 6 digits"),     # All letters
    ("STU123 45", "Student ID must end with 6 digits"),     # Space in number
    ("STU123.45", "Student ID must end with 6 digits"),     # Decimal point
]

print("\n=== Invalid Data Tests ===")
for test_id, expected_error in invalid_test_cases:
    result = parse_student_id(test_id)
    if not result["valid"]:
        status = "✓ PASS" if result["error"] == expected_error else "✗ FAIL"
        print(f"parse_student_id({repr(test_id)}) = Invalid: {result['error']} {status}")
    else:
        print(f"parse_student_id({repr(test_id)}) = Valid (UNEXPECTED!) ✗ FAIL")

# Valid test cases for comparison
valid_test_cases = ["STU123456", "STU000001", "STU999999"]
print("\n=== Valid Data Tests ===")
for test_id in valid_test_cases:
    result = parse_student_id(test_id)
    if result["valid"]:
        print(f"parse_student_id('{test_id}') = Valid: {result['id']} ✓ PASS")
    else:
        print(f"parse_student_id('{test_id}') = Invalid: {result['error']} ✗ FAIL")

```

## Test Data Design Strategies

### Equivalence Partitioning

**Equivalence partitioning** groups similar inputs together and tests one example from each group.

```python-exec
def categorize_age(age):
    """Categorize person by age group."""
    if age < 0:
        return "Invalid"
    elif age < 13:
        return "Child"
    elif age < 20:
        return "Teenager"
    elif age < 65:
        return "Adult"
    else:
        return "Senior"

# Equivalence partitions:
# 1. Invalid: age < 0
# 2. Child: 0 <= age < 13
# 3. Teenager: 13 <= age < 20
# 4. Adult: 20 <= age < 65
# 5. Senior: age >= 65

equivalence_test_cases = [
    # Test one value from each partition
    (-5, "Invalid"),    # Partition 1: Invalid ages
    (7, "Child"),       # Partition 2: Children
    (16, "Teenager"),   # Partition 3: Teenagers
    (35, "Adult"),      # Partition 4: Adults
    (70, "Senior"),     # Partition 5: Seniors
    
    # Test boundaries between partitions
    (0, "Child"),       # Boundary: Invalid/Child
    (12, "Child"),      # Boundary: Child/Teenager
    (13, "Teenager"),   # Boundary: Child/Teenager
    (19, "Teenager"),   # Boundary: Teenager/Adult
    (20, "Adult"),      # Boundary: Teenager/Adult
    (64, "Adult"),      # Boundary: Adult/Senior
    (65, "Senior"),     # Boundary: Adult/Senior
]

print("\n=== Equivalence Partitioning Tests ===")
for age, expected in equivalence_test_cases:
    result = categorize_age(age)
    status = "✓ PASS" if result == expected else "✗ FAIL"
    print(f"categorize_age({age}) = '{result}' (expected '{expected}') {status}")

```

### Decision Table Testing

**Decision table testing** systematically tests all combinations of conditions.

```python-exec
def determine_shipping_cost(weight, distance, express, member):
    """
    Determine shipping cost based on:
    - weight: <= 1kg or > 1kg
    - distance: <= 100km or > 100km  
    - express: True or False
    - member: True or False
    """
    
    # Base cost
    if weight <= 1:
        base_cost = 5
    else:
        base_cost = 10
    
    # Distance modifier
    if distance > 100:
        base_cost *= 1.5
    
    # Express modifier
    if express:
        base_cost *= 2
    
    # Member discount
    if member:
        base_cost *= 0.9  # 10% discount
    
    return round(base_cost, 2)

# Decision table - all combinations of conditions
# Weight | Distance | Express | Member | Expected Cost
decision_table_tests = [
    # Light weight (≤1kg)
    (0.5, 50,  False, False, 5.0),     # Base case
    (0.5, 50,  False, True,  4.5),     # + Member discount
    (0.5, 50,  True,  False, 10.0),    # + Express
    (0.5, 50,  True,  True,  9.0),     # + Express + Member
    (0.5, 150, False, False, 7.5),     # + Long distance
    (0.5, 150, False, True,  6.75),    # + Long distance + Member
    (0.5, 150, True,  False, 15.0),    # + Long distance + Express
    (0.5, 150, True,  True,  13.5),    # + Long distance + Express + Member
    
    # Heavy weight (>1kg)
    (2.0, 50,  False, False, 10.0),    # Base case
    (2.0, 50,  False, True,  9.0),     # + Member discount
    (2.0, 50,  True,  False, 20.0),    # + Express
    (2.0, 50,  True,  True,  18.0),    # + Express + Member
    (2.0, 150, False, False, 15.0),    # + Long distance
    (2.0, 150, False, True,  13.5),    # + Long distance + Member
    (2.0, 150, True,  False, 30.0),    # + Long distance + Express
    (2.0, 150, True,  True,  27.0),    # + Long distance + Express + Member
]

print("\n=== Decision Table Tests ===")
print("Weight | Distance | Express | Member | Result | Expected | Status")
print("-" * 65)

for weight, distance, express, member, expected in decision_table_tests:
    result = determine_shipping_cost(weight, distance, express, member)
    status = "✓ PASS" if abs(result - expected) < 0.01 else "✗ FAIL"
    print(f"{weight:6.1f} | {distance:8.0f} | {express:7} | {member:6} | {result:6.2f} | {expected:8.2f} | {status}")

```

## Creating Comprehensive Test Suites

### Student Grade Processing Example

```python-exec
def process_student_grades(student_data):
    """
    Process student grade data and return summary.
    
    Input: List of dictionaries with 'name' and 'scores' keys
    Output: Dictionary with statistics and grade distribution
    """
    
    if not student_data:
        return {"error": "No student data provided"}
    
    total_students = len(student_data)
    all_scores = []
    grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
    
    for student in student_data:
        # Validate student record
        if not isinstance(student, dict):
            continue
        if 'name' not in student or 'scores' not in student:
            continue
        if not student['scores']:  # Empty scores list
            continue
        
        # Calculate average
        scores = student['scores']
        average = sum(scores) / len(scores)
        all_scores.append(average)
        
        # Assign letter grade
        if average >= 90:
            grade_counts["A"] += 1
        elif average >= 80:
            grade_counts["B"] += 1
        elif average >= 70:
            grade_counts["C"] += 1
        elif average >= 60:
            grade_counts["D"] += 1
        else:
            grade_counts["F"] += 1
    
    if not all_scores:
        return {"error": "No valid student records found"}
    
    class_average = sum(all_scores) / len(all_scores)
    
    return {
        "class_average": round(class_average, 2),
        "total_students": len(all_scores),
        "grade_distribution": grade_counts,
        "highest_average": max(all_scores),
        "lowest_average": min(all_scores)
    }

def test_student_grade_processing():
    """Comprehensive test suite for student grade processing."""
    
    print("=== Comprehensive Test Suite: Student Grade Processing ===\n")
    
    # Test 1: Normal data
    print("Test 1: Normal Data")
    normal_data = [
        {"name": "Alice", "scores": [92, 88, 95]},
        {"name": "Bob", "scores": [87, 91, 84]},
        {"name": "Charlie", "scores": [76, 79, 73]}
    ]
    result = process_student_grades(normal_data)
    expected_avg = (91.67 + 87.33 + 76.0) / 3  # Approximately 85
    print(f"Class average: {result['class_average']} (expected ~85)")
    print(f"Grade distribution: {result['grade_distribution']}")
    print("✓ PASS\n" if 84 <= result['class_average'] <= 86 else "✗ FAIL\n")
    
    # Test 2: Boundary data - grade boundaries
    print("Test 2: Boundary Data - Grade Boundaries")
    boundary_data = [
        {"name": "Student90", "scores": [90, 90, 90]},  # Exactly A
        {"name": "Student89", "scores": [89, 89, 89]},  # Just below A
        {"name": "Student80", "scores": [80, 80, 80]},  # Exactly B
        {"name": "Student79", "scores": [79, 79, 79]},  # Just below B
        {"name": "Student60", "scores": [60, 60, 60]},  # Exactly D
        {"name": "Student59", "scores": [59, 59, 59]},  # Just below D (F)
    ]
    result = process_student_grades(boundary_data)
    expected_grades = {"A": 1, "B": 1, "C": 1, "D": 1, "F": 1}
    print(f"Grade distribution: {result['grade_distribution']}")
    print(f"Expected: {expected_grades}")
    print("✓ PASS\n" if result['grade_distribution'] == expected_grades else "✗ FAIL\n")
    
    # Test 3: Edge cases - single student, single score
    print("Test 3: Edge Cases - Single Student")
    single_data = [{"name": "OnlyStudent", "scores": [85]}]
    result = process_student_grades(single_data)
    print(f"Single student average: {result['class_average']}")
    print("✓ PASS\n" if result['class_average'] == 85 else "✗ FAIL\n")
    
    # Test 4: Invalid data - empty list
    print("Test 4: Invalid Data - Empty List")
    result = process_student_grades([])
    print(f"Empty list result: {result}")
    print("✓ PASS\n" if "error" in result else "✗ FAIL\n")
    
    # Test 5: Invalid data - malformed records
    print("Test 5: Invalid Data - Malformed Records")
    invalid_data = [
        {"name": "ValidStudent", "scores": [85, 90]},
        {"name": "NoScores"},  # Missing scores
        {"wrong_key": "value"},  # Missing name and scores
        {"name": "EmptyScores", "scores": []},  # Empty scores
        "not_a_dict",  # Not even a dictionary
    ]
    result = process_student_grades(invalid_data)
    print(f"Malformed data result: {result}")
    print(f"Should only count 1 valid student")
    print("✓ PASS\n" if result['total_students'] == 1 else "✗ FAIL\n")
    
    # Test 6: Extreme data - very high/low scores
    print("Test 6: Extreme Data - High and Low Scores")
    extreme_data = [
        {"name": "Perfect", "scores": [100, 100, 100]},
        {"name": "Failing", "scores": [0, 5, 10]},
        {"name": "Mixed", "scores": [100, 0, 50]}
    ]
    result = process_student_grades(extreme_data)
    print(f"Extreme data class average: {result['class_average']}")
    print(f"Highest: {result['highest_average']}, Lowest: {result['lowest_average']}")
    print("✓ PASS\n" if result['highest_average'] == 100 and result['lowest_average'] == 5 else "✗ FAIL\n")

# Run the comprehensive test suite
test_student_grade_processing()

```

## Test Data Documentation

### Creating Test Cases

```python-exec
class TestCase:
    """Structured test case documentation."""
    
    def __init__(self, test_id, description, input_data, expected_output, category):
        self.test_id = test_id
        self.description = description
        self.input_data = input_data
        self.expected_output = expected_output
        self.category = category
        self.result = None
        self.passed = None
    
    def __str__(self):
        status = "PASS" if self.passed else "FAIL" if self.passed is False else "NOT RUN"
        return f"[{self.test_id}] {self.description} - {status}"

def calculate_letter_grade(percentage):
    """Convert percentage to letter grade."""
    if percentage < 0 or percentage > 100:
        return "Invalid"
    elif percentage >= 90:
        return "A"
    elif percentage >= 80:
        return "B"
    elif percentage >= 70:
        return "C"
    elif percentage >= 60:
        return "D"
    else:
        return "F"

# Documented test cases
test_cases = [
    # Normal data tests
    TestCase("TC001", "Typical A grade", 95, "A", "normal"),
    TestCase("TC002", "Typical B grade", 85, "B", "normal"),
    TestCase("TC003", "Typical C grade", 75, "C", "normal"),
    TestCase("TC004", "Typical D grade", 65, "D", "normal"),
    TestCase("TC005", "Typical F grade", 45, "F", "normal"),
    
    # Boundary tests
    TestCase("TC006", "A grade boundary", 90, "A", "boundary"),
    TestCase("TC007", "Just below A", 89.9, "B", "boundary"),
    TestCase("TC008", "B grade boundary", 80, "B", "boundary"),
    TestCase("TC009", "Just below B", 79.9, "C", "boundary"),
    TestCase("TC010", "Perfect score", 100, "A", "boundary"),
    TestCase("TC011", "Minimum score", 0, "F", "boundary"),
    
    # Invalid data tests
    TestCase("TC012", "Negative percentage", -10, "Invalid", "invalid"),
    TestCase("TC013", "Over 100 percent", 110, "Invalid", "invalid"),
    TestCase("TC014", "Just over 100", 100.1, "Invalid", "invalid"),
    TestCase("TC015", "Just under 0", -0.1, "Invalid", "invalid"),
]

def run_test_suite(test_cases, function_to_test):
    """Run a documented test suite."""
    
    print("=== Test Suite Results ===")
    print(f"Testing function: {function_to_test.__name__}")
    print(f"Total test cases: {len(test_cases)}\n")
    
    results_by_category = {}
    
    for test_case in test_cases:
        # Run the test
        test_case.result = function_to_test(test_case.input_data)
        test_case.passed = test_case.result == test_case.expected_output
        
        # Group by category
        if test_case.category not in results_by_category:
            results_by_category[test_case.category] = []
        results_by_category[test_case.category].append(test_case)
    
    # Report results by category
    total_passed = 0
    total_tests = len(test_cases)
    
    for category, tests in results_by_category.items():
        print(f"\n--- {category.upper()} TESTS ---")
        category_passed = 0
        
        for test in tests:
            status_symbol = "✓" if test.passed else "✗"
            print(f"{status_symbol} {test.test_id}: {test.description}")
            print(f"   Input: {test.input_data}")
            print(f"   Expected: {test.expected_output}, Got: {test.result}")
            
            if test.passed:
                category_passed += 1
                total_passed += 1
        
        print(f"\nCategory summary: {category_passed}/{len(tests)} passed")
    
    # Overall summary
    print(f"\n=== OVERALL RESULTS ===")
    print(f"Total passed: {total_passed}/{total_tests}")
    print(f"Success rate: {(total_passed/total_tests)*100:.1f}%")
    
    if total_passed == total_tests:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed - check implementation")

# Run the documented test suite
run_test_suite(test_cases, calculate_letter_grade)

```


## Summary

Designing suitable test data is crucial for creating reliable software:

### Key Principles

1. **Test all types of data**: Normal, boundary, extreme, and invalid

2. **Use systematic approaches**: Equivalence partitioning and decision tables

3. **Document your tests**: Make them repeatable and understandable

4. **Test early and often**: Find bugs before they become expensive

### Test Data Categories

- **Normal Data**: Typical, expected inputs

- **Boundary Data**: Values at the edges of valid ranges

- **Extreme Data**: Very large, small, or unusual values

- **Invalid Data**: Bad inputs that should be rejected

### Testing Strategies

- **Equivalence Partitioning**: Group similar inputs and test representatives

- **Decision Table Testing**: Test all combinations of conditions

- **Comprehensive Test Suites**: Combine multiple strategies for thorough coverage

### Best Practices

- Plan your test data before writing code

- Include both positive and negative test cases

- Document expected outcomes clearly

- Automate test execution when possible

- Review and update tests as requirements change

Remember: Good test data design prevents bugs from reaching users and saves time in the long run!
