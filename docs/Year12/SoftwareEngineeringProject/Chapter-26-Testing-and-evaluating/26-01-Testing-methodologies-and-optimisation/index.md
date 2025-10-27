---
title: "26.1 Testing methodologies and optimisation"
---

# 26.1 Testing methodologies and optimisation

## Why it matters

Testing is critical for delivering reliable software that meets user expectations and requirements. A well-designed testing strategy helps identify defects early, reduces development costs, and ensures software quality before release. Understanding different testing methodologies helps developers choose appropriate approaches for their specific projects and requirements.

## Concepts

### Testing strategies and test-plan development

A comprehensive testing strategy defines how, when, and what to test throughout the software development lifecycle. Test plans document the testing approach, scope, resources, and schedule for a specific project.

Key components of a testing strategy:

- **Test objectives**: What the testing aims to achieve

- **Test scope**: What will and won't be tested

- **Test approaches**: Methods and techniques to be used

- **Test environments**: Hardware, software, and data requirements

- **Test schedule**: Timeline and milestones for testing activities

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "Testing Strategy" {
  [Test Planning]
  [Test Design]
  [Test Execution]
  [Test Reporting]
}

package "Test Types" {
  [Functional Tests]
  [Integration Tests]
  [Non-functional Tests]
  [Acceptance Tests]
}

package "Test Techniques" {
  [Manual Testing]
  [Automated Testing]
  [Path Testing]
  [Boundary Testing]
}

[Test Planning] --> [Test Design] : Define Approach
[Test Design] --> [Test Execution] : Create Test Cases
[Test Execution] --> [Test Reporting] : Generate Results

[Test Design] --> [Functional Tests] : Business Logic
[Test Design] --> [Integration Tests] : Component Interaction
[Test Design] --> [Non-functional Tests] : Performance/Security
[Test Design] --> [Acceptance Tests] : User Requirements

[Test Execution] --> [Manual Testing] : Exploratory Testing
[Test Execution] --> [Automated Testing] : Regression Testing
[Test Execution] --> [Path Testing] : Code Coverage
[Test Execution] --> [Boundary Testing] : Edge Cases

@enduml

```

/// tab | Test Plan Structure
**Test Plan Components**:

1. **Introduction and Scope**

    - Project overview and testing objectives

    - Features to be tested and excluded

    - Test environment requirements

2. **Test Strategy**

    - Testing approach and methodologies

    - Entry and exit criteria for testing phases

    - Risk assessment and mitigation strategies

3. **Test Cases and Procedures**

    - Detailed test cases with expected results

    - Test data requirements and setup procedures

    - Manual and automated test procedures

4. **Resources and Schedule**

    - Testing team roles and responsibilities

    - Testing timeline and milestones

    - Tools and infrastructure requirements
///
///

/// tab | Python Test Plan Generator

```py
from datetime import date, timedelta
from enum import Enum
import json

class TestType(Enum):
    FUNCTIONAL = "functional"
    INTEGRATION = "integration"
    NON_FUNCTIONAL = "non_functional"
    ACCEPTANCE = "acceptance"
    REGRESSION = "regression"

class TestPriority(Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class TestStatus(Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    PASSED = "passed"
    FAILED = "failed"
    BLOCKED = "blocked"

class TestCase:
    def __init__(self, test_id, title, test_type, priority):
        self.test_id = test_id
        self.title = title
        self.test_type = test_type
        self.priority = priority
        self.status = TestStatus.NOT_STARTED
        self.prerequisites = []
        self.test_steps = []
        self.expected_result = ""
        self.actual_result = ""
        self.test_data = []
        self.assigned_to = ""
        self.estimated_duration = 0  # minutes
        self.execution_date = None
    
    def add_prerequisite(self, prerequisite):
        self.prerequisites.append(prerequisite)
    
    def add_test_step(self, step_number, action, expected_result):
        step = {
            "step_number": step_number,
            "action": action,
            "expected_result": expected_result
        }
        self.test_steps.append(step)
    
    def add_test_data(self, data_description, value):
        test_data = {
            "description": data_description,
            "value": value
        }
        self.test_data.append(test_data)
    
    def execute_test(self, actual_result, tester):
        self.status = TestStatus.IN_PROGRESS
        self.actual_result = actual_result
        self.execution_date = date.today()
        
        ## Simple pass/fail logic

        if "pass" in actual_result.lower() or "success" in actual_result.lower():
            self.status = TestStatus.PASSED
        elif "fail" in actual_result.lower() or "error" in actual_result.lower():
            self.status = TestStatus.FAILED
        
        return self.status
    
    def get_summary(self):
        return {
            "test_id": self.test_id,
            "title": self.title,
            "type": self.test_type.value,
            "priority": self.priority.value,
            "status": self.status.value,
            "steps_count": len(self.test_steps),
            "estimated_duration": self.estimated_duration,
            "execution_date": self.execution_date.isoformat() if self.execution_date else None
        }

class TestPlan:
    def __init__(self, project_name, version, test_manager):
        self.project_name = project_name
        self.version = version
        self.test_manager = test_manager
        self.created_date = date.today()
        self.test_cases = []
        self.test_environments = []
        self.entry_criteria = []
        self.exit_criteria = []
        self.risks = []
        self.resources = []
    
    def add_test_case(self, test_case):
        self.test_cases.append(test_case)
    
    def add_entry_criteria(self, criteria):
        self.entry_criteria.append(criteria)
    
    def add_exit_criteria(self, criteria):
        self.exit_criteria.append(criteria)
    
    def add_risk(self, risk_description, mitigation):
        risk = {
            "description": risk_description,
            "mitigation": mitigation,
            "identified_date": date.today()
        }
        self.risks.append(risk)
    
    def get_test_cases_by_type(self, test_type):
        return [tc for tc in self.test_cases if tc.test_type == test_type]
    
    def get_test_cases_by_priority(self, priority):
        return [tc for tc in self.test_cases if tc.priority == priority]
    
    def calculate_test_effort(self):
        total_minutes = sum(tc.estimated_duration for tc in self.test_cases)
        total_hours = total_minutes / 60
        total_days = total_hours / 8  # Assuming 8-hour work days
        
        return {
            "total_minutes": total_minutes,
            "total_hours": round(total_hours, 1),
            "total_days": round(total_days, 1)
        }
    
    def generate_test_summary(self):
        total_tests = len(self.test_cases)
        by_type = {}
        by_status = {}
        by_priority = {}
        
        for test_case in self.test_cases:

            ## Count by type

            test_type = test_case.test_type.value
            by_type[test_type] = by_type.get(test_type, 0) + 1
            
            ## Count by status

            status = test_case.status.value
            by_status[status] = by_status.get(status, 0) + 1
            
            ## Count by priority

            priority = test_case.priority.value
            by_priority[priority] = by_priority.get(priority, 0) + 1
        
        effort = self.calculate_test_effort()
        
        return {
            "project": self.project_name,
            "version": self.version,
            "total_test_cases": total_tests,
            "by_type": by_type,
            "by_status": by_status,
            "by_priority": by_priority,
            "estimated_effort": effort,
            "completion_percentage": round((by_status.get("passed", 0) / max(total_tests, 1)) * 100, 1)
        }

## Example test plan creation

test_plan = TestPlan("Student Portal", "v2.0", "Sarah Johnson")

## Add entry criteria

test_plan.add_entry_criteria("All development features completed")
test_plan.add_entry_criteria("Test environment setup completed")
test_plan.add_entry_criteria("Test data prepared and validated")

## Add exit criteria

test_plan.add_exit_criteria("All high priority test cases passed")
test_plan.add_exit_criteria("No critical or high severity bugs remaining")
test_plan.add_exit_criteria("Performance benchmarks met")

## Create sample test cases

login_test = TestCase("TC001", "User Login Functionality", TestType.FUNCTIONAL, TestPriority.HIGH)
login_test.add_test_step(1, "Navigate to login page", "Login form displays")
login_test.add_test_step(2, "Enter valid credentials", "User successfully logged in")
login_test.add_test_data("Username", "student@school.edu")
login_test.add_test_data("Password", "validpassword123")
login_test.estimated_duration = 15

integration_test = TestCase("TC002", "Database Connection", TestType.INTEGRATION, TestPriority.HIGH)
integration_test.add_test_step(1, "Application startup", "Database connection established")
integration_test.add_test_step(2, "Execute database query", "Data retrieved successfully")
integration_test.estimated_duration = 30

performance_test = TestCase("TC003", "Page Load Performance", TestType.NON_FUNCTIONAL, TestPriority.MEDIUM)
performance_test.add_test_step(1, "Load homepage", "Page loads within 2 seconds")
performance_test.add_test_step(2, "Navigate to student dashboard", "Dashboard loads within 3 seconds")
performance_test.estimated_duration = 45

## Add test cases to plan

test_plan.add_test_case(login_test)
test_plan.add_test_case(integration_test)
test_plan.add_test_case(performance_test)

## Add risk

test_plan.add_risk(
    "Test environment may be unstable",
    "Backup test environment prepared and monitoring implemented"
)

## Generate summary

summary = test_plan.generate_test_summary()
print(f"Test Plan Summary: {summary}")

```

///

### Functional, integration, and non-functional tests

Different types of tests serve different purposes in ensuring software quality. Understanding when and how to apply each type is crucial for comprehensive testing coverage.

/// tab | Test Types Overview
**Functional Tests**:

- Test what the system does (business logic and features)

- Verify user requirements and acceptance criteria

- Include unit tests, component tests, and end-to-end tests

- Focus on correctness of functionality

**Integration Tests**:

- Test how different components work together

- Verify data flow between modules and systems

- Include API testing, database integration, third-party service integration

- Focus on interface and communication correctness

**Non-functional Tests**:

- Test how the system performs (quality attributes)

- Include performance, security, usability, reliability testing

- Verify system meets quality standards and constraints

- Focus on system behaviour under various conditions
///

/// tab | Python Test Framework

```py
import time
import random
from abc import ABC, abstractmethod
from datetime import datetime

class TestResult:
    def __init__(self, test_name, test_type):
        self.test_name = test_name
        self.test_type = test_type
        self.start_time = None
        self.end_time = None
        self.status = "not_started"
        self.error_message = ""
        self.metrics = {}
    
    def start_test(self):
        self.start_time = datetime.now()
        self.status = "running"
    
    def complete_test(self, success, error_message=""):
        self.end_time = datetime.now()
        self.status = "passed" if success else "failed"
        self.error_message = error_message
    
    def get_duration(self):
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        return 0
    
    def add_metric(self, name, value):
        self.metrics[name] = value

class BaseTest(ABC):
    def __init__(self, name):
        self.name = name
        self.result = None
    
    @abstractmethod
    def execute(self):
        pass
    
    def run(self):
        self.result = TestResult(self.name, self.__class__.__name__)
        self.result.start_test()
        
        try:
            success = self.execute()
            self.result.complete_test(success)
        except Exception as e:
            self.result.complete_test(False, str(e))
        
        return self.result

class FunctionalTest(BaseTest):
    def __init__(self, name, test_function, expected_result):
        super().__init__(name)
        self.test_function = test_function
        self.expected_result = expected_result
    
    def execute(self):
        actual_result = self.test_function()
        self.result.add_metric("expected", self.expected_result)
        self.result.add_metric("actual", actual_result)
        return actual_result == self.expected_result

class IntegrationTest(BaseTest):
    def __init__(self, name, components, integration_function):
        super().__init__(name)
        self.components = components
        self.integration_function = integration_function
    
    def execute(self):

        ## Verify all components are available

        for component in self.components:
            if not self.check_component_availability(component):
                self.result.error_message = f"Component {component} not available"
                return False
        
        ## Execute integration test

        result = self.integration_function()
        self.result.add_metric("components_tested", len(self.components))
        return result
    
    def check_component_availability(self, component):

        ## Simulate component availability check

        return random.choice([True, True, True, False])  # 75% availability

class NonFunctionalTest(BaseTest):
    def __init__(self, name, performance_function, threshold, metric_name):
        super().__init__(name)
        self.performance_function = performance_function
        self.threshold = threshold
        self.metric_name = metric_name
    
    def execute(self):
        start_time = time.time()
        result = self.performance_function()
        end_time = time.time()
        
        duration = end_time - start_time
        self.result.add_metric(self.metric_name, duration)
        self.result.add_metric("threshold", self.threshold)
        
        ## Check if performance meets threshold

        if self.metric_name == "response_time":
            return duration <= self.threshold
        elif self.metric_name == "memory_usage":
            return result <= self.threshold
        
        return True

class TestSuite:
    def __init__(self, name):
        self.name = name
        self.tests = []
        self.results = []
    
    def add_test(self, test):
        self.tests.append(test)
    
    def run_all_tests(self):
        self.results = []
        for test in self.tests:
            result = test.run()
            self.results.append(result)
        
        return self.generate_report()
    
    def generate_report(self):
        total_tests = len(self.results)
        passed_tests = len([r for r in self.results if r.status == "passed"])
        failed_tests = len([r for r in self.results if r.status == "failed"])
        
        by_type = {}
        for result in self.results:
            test_type = result.test_type
            by_type[test_type] = by_type.get(test_type, 0) + 1
        
        total_duration = sum(r.get_duration() for r in self.results)
        
        return {
            "suite_name": self.name,
            "total_tests": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": round((passed_tests / max(total_tests, 1)) * 100, 1),
            "by_type": by_type,
            "total_duration_seconds": round(total_duration, 2),
            "failed_tests": [r.test_name for r in self.results if r.status == "failed"]
        }

## Example test implementations

def login_function():

    ## Simulate login process

    time.sleep(0.1)  # Simulate processing time
    return "login_success"

def database_integration():

    ## Simulate database operation

    time.sleep(0.2)
    return random.choice([True, True, False])  # 67% success rate

def performance_function():

    ## Simulate performance test

    time.sleep(random.uniform(0.1, 0.3))
    return True

## Create test suite

suite = TestSuite("Student Portal Test Suite")

## Add functional test

login_test = FunctionalTest("User Login", login_function, "login_success")
suite.add_test(login_test)

## Add integration test

db_test = IntegrationTest("Database Integration", ["database", "auth_service"], database_integration)
suite.add_test(db_test)

## Add non-functional test

perf_test = NonFunctionalTest("Response Time", performance_function, 0.25, "response_time")
suite.add_test(perf_test)

## Run tests and generate report

report = suite.run_all_tests()
print(f"Test Suite Report: {report}")

```

///

### Test data selection for path and boundary testing

Effective test data selection ensures comprehensive coverage of code paths and edge cases. Path testing verifies different execution routes through the code, while boundary testing focuses on input values at the limits of acceptable ranges.

Key principles for test data selection:

- **Equivalence partitioning**: Group inputs into classes that should behave similarly

- **Boundary value analysis**: Test values at the edges of input domains

- **Path coverage**: Ensure all code branches are executed during testing

- **Edge cases**: Test unusual or extreme conditions that might cause failures

/// tab | Test Data Strategies
**Path Testing Data**:

- **Decision points**: Data that exercises different conditional branches

- **Loop boundaries**: Zero iterations, one iteration, maximum iterations

- **Error conditions**: Data that triggers exception handling

- **Normal flow**: Data that follows expected user workflows

**Boundary Testing Data**:

- **Minimum values**: Smallest acceptable inputs

- **Maximum values**: Largest acceptable inputs

- **Just outside bounds**: Invalid inputs that exceed limits

- **Edge transitions**: Values that change system behaviour

**Example boundaries for student grade system**:

- Valid grades: 0-100

- Test values: -1, 0, 1, 49, 50, 51, 99, 100, 101

- Special cases: non-numeric inputs, null values
///

/// tab | Python Test Data Generator

```py
import random
import string
from datetime import date, timedelta
from enum import Enum

class BoundaryType(Enum):
    MIN_VALID = "min_valid"
    MAX_VALID = "max_valid"
    BELOW_MIN = "below_min"
    ABOVE_MAX = "above_max"
    TYPICAL = "typical"

class TestDataGenerator:
    def __init__(self):
        self.generated_data = []
    
    def generate_numeric_boundaries(self, min_val, max_val, data_type="integer"):
        """Generate boundary test values for numeric inputs"""
        boundary_values = []
        
        if data_type == "integer":
            boundary_values = [
                {"value": min_val - 1, "type": BoundaryType.BELOW_MIN, "valid": False},
                {"value": min_val, "type": BoundaryType.MIN_VALID, "valid": True},
                {"value": min_val + 1, "type": BoundaryType.MIN_VALID, "valid": True},
                {"value": (min_val + max_val) // 2, "type": BoundaryType.TYPICAL, "valid": True},
                {"value": max_val - 1, "type": BoundaryType.MAX_VALID, "valid": True},
                {"value": max_val, "type": BoundaryType.MAX_VALID, "valid": True},
                {"value": max_val + 1, "type": BoundaryType.ABOVE_MAX, "valid": False}
            ]
        elif data_type == "float":
            boundary_values = [
                {"value": min_val - 0.1, "type": BoundaryType.BELOW_MIN, "valid": False},
                {"value": min_val, "type": BoundaryType.MIN_VALID, "valid": True},
                {"value": min_val + 0.1, "type": BoundaryType.MIN_VALID, "valid": True},
                {"value": (min_val + max_val) / 2, "type": BoundaryType.TYPICAL, "valid": True},
                {"value": max_val - 0.1, "type": BoundaryType.MAX_VALID, "valid": True},
                {"value": max_val, "type": BoundaryType.MAX_VALID, "valid": True},
                {"value": max_val + 0.1, "type": BoundaryType.ABOVE_MAX, "valid": False}
            ]
        
        self.generated_data.extend(boundary_values)
        return boundary_values
    
    def generate_string_boundaries(self, min_length, max_length):
        """Generate boundary test values for string inputs"""
        boundary_strings = []
        
        ## Generate strings of various lengths

        test_lengths = [0, 1, min_length - 1, min_length, min_length + 1, 
                       max_length - 1, max_length, max_length + 1]
        
        for length in test_lengths:
            if length < 0:
                continue
                
            test_string = ''.join(random.choices(string.ascii_letters, k=length))
            valid = min_length <= length <= max_length
            
            boundary_type = BoundaryType.TYPICAL
            if length < min_length:
                boundary_type = BoundaryType.BELOW_MIN
            elif length > max_length:
                boundary_type = BoundaryType.ABOVE_MAX
            elif length == min_length:
                boundary_type = BoundaryType.MIN_VALID
            elif length == max_length:
                boundary_type = BoundaryType.MAX_VALID
            
            boundary_strings.append({
                "value": test_string,
                "length": length,
                "type": boundary_type,
                "valid": valid
            })
        
        ## Add special characters and edge cases

        special_cases = [
            {"value": "", "length": 0, "type": BoundaryType.BELOW_MIN, "valid": min_length == 0},
            {"value": "   ", "length": 3, "type": BoundaryType.TYPICAL, "valid": min_length <= 3 <= max_length},
            {"value": "test@#$%", "length": 8, "type": BoundaryType.TYPICAL, "valid": min_length <= 8 <= max_length},
            {"value": None, "length": None, "type": BoundaryType.BELOW_MIN, "valid": False}
        ]
        
        boundary_strings.extend(special_cases)
        self.generated_data.extend(boundary_strings)
        return boundary_strings
    
    def generate_date_boundaries(self, start_date, end_date):
        """Generate boundary test values for date inputs"""
        boundary_dates = []
        
        date_before = start_date - timedelta(days=1)
        date_after = end_date + timedelta(days=1)
        middle_date = start_date + (end_date - start_date) / 2
        
        boundary_dates = [
            {"value": date_before, "type": BoundaryType.BELOW_MIN, "valid": False},
            {"value": start_date, "type": BoundaryType.MIN_VALID, "valid": True},
            {"value": start_date + timedelta(days=1), "type": BoundaryType.MIN_VALID, "valid": True},
            {"value": middle_date, "type": BoundaryType.TYPICAL, "valid": True},
            {"value": end_date - timedelta(days=1), "type": BoundaryType.MAX_VALID, "valid": True},
            {"value": end_date, "type": BoundaryType.MAX_VALID, "valid": True},
            {"value": date_after, "type": BoundaryType.ABOVE_MAX, "valid": False}
        ]
        
        self.generated_data.extend(boundary_dates)
        return boundary_dates

class PathTestGenerator:
    def __init__(self):
        self.test_paths = []
    
    def generate_decision_paths(self, conditions):
        """Generate test data to cover different decision paths"""
        paths = []
        
        ## Generate all combinations of true/false for conditions

        num_conditions = len(conditions)
        for i in range(2 ** num_conditions):
            path = {}
            binary = format(i, f'0{num_conditions}b')
            
            for j, condition in enumerate(conditions):
                path[condition] = binary[j] == '1'
            
            paths.append(path)
        
        self.test_paths.extend(paths)
        return paths
    
    def generate_loop_paths(self, loop_variable, min_iterations, max_iterations):
        """Generate test data for loop boundary testing"""
        loop_tests = [
            {"iterations": 0, "description": "No iterations"},
            {"iterations": 1, "description": "Single iteration"},
            {"iterations": min_iterations, "description": "Minimum iterations"},
            {"iterations": max_iterations, "description": "Maximum iterations"},
            {"iterations": max_iterations + 1, "description": "Exceed maximum"}
        ]
        
        return loop_tests

## Example usage for student grade system

def test_grade_validation():
    generator = TestDataGenerator()
    
    ## Generate numeric boundaries for grades (0-100)

    grade_boundaries = generator.generate_numeric_boundaries(0, 100, "integer")
    
    print("Grade Boundary Test Data:")
    for data in grade_boundaries:
        print(f"  Grade: {data['value']}, Type: {data['type'].value}, Valid: {data['valid']}")
    
    ## Generate string boundaries for student names (2-50 characters)

    name_boundaries = generator.generate_string_boundaries(2, 50)
    
    print("\\nName Boundary Test Data:")
    for data in name_boundaries[:5]:  # Show first 5 examples
        print(f"  Name: '{data['value']}', Length: {data['length']}, Valid: {data['valid']}")
    
    ## Generate path tests for grade calculation logic

    path_generator = PathTestGenerator()
    grade_conditions = ["is_numeric", "in_range", "is_passing"]
    decision_paths = path_generator.generate_decision_paths(grade_conditions)
    
    print("\\nDecision Path Test Cases:")
    for i, path in enumerate(decision_paths[:4]):  # Show first 4 paths
        print(f"  Path {i+1}: {path}")

## Run example

test_grade_validation()

```

///

### Developing test cases and acceptance tests

Test cases provide detailed instructions for verifying specific functionality, while acceptance tests ensure the software meets business requirements and user expectations.

Components of effective test cases:

- **Test case ID**: Unique identifier for tracking and reference

- **Test objective**: Clear description of what is being tested

- **Prerequisites**: Conditions that must be met before test execution

- **Test steps**: Detailed actions to perform during testing

- **Expected results**: Anticipated outcomes for each test step

- **Test data**: Specific inputs required for test execution

/// tab | Test Case Structure

**Test Case Template**:

**Test Case Template**:

| Field | Description | Example |
|-------|-------------|---------|
| **Test Case ID** | Unique identifier for tracking | TC_AUTH_001 |
| **Title** | Brief, descriptive name | User Login with Valid Credentials |
| **Objective** | What the test verifies | Verify students can log in with correct credentials |
| **Prerequisites** | Required setup or conditions | User account exists, login page accessible |
| **Test Steps** | Numbered sequence of actions | 1. Navigate to login page<br>2. Enter username<br>3. Enter password<br>4. Click login button |
| **Expected Results** | Anticipated outcomes | User redirected to dashboard, session established |
| **Test Data** | Input values needed | Username: <student@school.edu><br>Password: SecurePass123 |
| **Post-conditions** | System state after test | User logged in, session active |
| **Pass/Fail Criteria** | How to determine success | All steps complete with expected results |

**Acceptance Test Criteria**:

- Directly tied to user stories and requirements

- Written in business language, not technical terms

- Testable and measurable outcomes

- Clear pass/fail criteria

///

/// tab | Python Test Case Builder

```py

from datetime import date
from enum import Enum

class TestStepType(Enum):
    ACTION = "action"
    VERIFICATION = "verification"
    SETUP = "setup"
    CLEANUP = "cleanup"

class AcceptanceCriteria:
    def __init__(self, criteria_id, description, measurement):
        self.criteria_id = criteria_id
        self.description = description
        self.measurement = measurement
        self.is_met = False
        self.evidence = ""
    
    def mark_as_met(self, evidence):
        self.is_met = True
        self.evidence = evidence
    
    def get_summary(self):
        return {
            "id": self.criteria_id,
            "description": self.description,
            "measurement": self.measurement,
            "is_met": self.is_met,
            "evidence": self.evidence
        }

class TestStep:
    def __init__(self, step_number, step_type, action, expected_result):
        self.step_number = step_number
        self.step_type = step_type
        self.action = action
        self.expected_result = expected_result
        self.actual_result = ""
        self.status = "not_executed"
        self.notes = ""
    
    def execute_step(self, actual_result, notes=""):
        self.actual_result = actual_result
        self.notes = notes
        self.status = "passed" if actual_result == self.expected_result else "failed"
        return self.status
    
    def get_summary(self):
        return {
            "step": self.step_number,
            "type": self.step_type.value,
            "action": self.action,
            "expected": self.expected_result,
            "actual": self.actual_result,
            "status": self.status
        }

class DetailedTestCase:
    def __init__(self, test_id, title, objective, module, feature):
        self.test_id = test_id
        self.title = title
        self.objective = objective
        self.module = module
        self.feature = feature
        self.prerequisites = []
        self.test_steps = []
        self.test_data = {}
        self.acceptance_criteria = []
        self.priority = "medium"
        self.estimated_duration = 0
        self.assigned_tester = ""
        self.created_date = date.today()
        self.last_executed = None
        self.execution_status = "not_started"
    
    def add_prerequisite(self, prerequisite):
        self.prerequisites.append(prerequisite)
    
    def add_test_step(self, step_type, action, expected_result):
        step_number = len(self.test_steps) + 1
        step = TestStep(step_number, step_type, action, expected_result)
        self.test_steps.append(step)
        return step
    
    def add_test_data(self, data_name, data_value, description=""):
        self.test_data[data_name] = {
            "value": data_value,
            "description": description
        }
    
    def add_acceptance_criteria(self, criteria):
        self.acceptance_criteria.append(criteria)
    
    def execute_test_case(self):
        self.execution_status = "executing"
        self.last_executed = date.today()
        
        passed_steps = 0
        total_steps = len(self.test_steps)
        
        for step in self.test_steps:

            ## Simulate step execution

            if step.step_type == TestStepType.SETUP:
                step.execute_step(step.expected_result, "Setup completed")
                passed_steps += 1
            elif step.step_type == TestStepType.ACTION:

                ## Simulate action with some chance of failure

                import random
                success = random.choice([True, True, True, False])  # 75% success rate
                result = step.expected_result if success else "Unexpected result"
                step.execute_step(result)
                if success:
                    passed_steps += 1
            elif step.step_type == TestStepType.VERIFICATION:
                step.execute_step(step.expected_result, "Verification completed")
                passed_steps += 1
        
        ## Determine overall test result

        if passed_steps == total_steps:
            self.execution_status = "passed"
        else:
            self.execution_status = "failed"
        
        return self.execution_status
    
    def check_acceptance_criteria(self):
        """Check if all acceptance criteria are met"""
        met_criteria = len([c for c in self.acceptance_criteria if c.is_met])
        total_criteria = len(self.acceptance_criteria)
        
        return {
            "met": met_criteria,
            "total": total_criteria,
            "percentage": round((met_criteria / max(total_criteria, 1)) * 100, 1),
            "all_met": met_criteria == total_criteria
        }
    
    def generate_test_report(self):
        step_summary = [step.get_summary() for step in self.test_steps]
        criteria_summary = [criteria.get_summary() for criteria in self.acceptance_criteria]
        
        return {
            "test_id": self.test_id,
            "title": self.title,
            "objective": self.objective,
            "module": self.module,
            "feature": self.feature,
            "execution_status": self.execution_status,
            "last_executed": self.last_executed.isoformat() if self.last_executed else None,
            "steps": step_summary,
            "acceptance_criteria": criteria_summary,
            "criteria_met": self.check_acceptance_criteria()
        }

## Example: Student login test case

login_test = DetailedTestCase(
    "TC_AUTH_LOGIN_001",
    "Student Login with Valid Credentials",
    "Verify that students can successfully log into the portal with valid credentials",
    "Authentication",
    "Login"
)

## Add prerequisites

login_test.add_prerequisite("Student account exists in the system")
login_test.add_prerequisite("Login page is accessible")
login_test.add_prerequisite("Test database is available")

## Add test data

login_test.add_test_data("username", "student@school.edu", "Valid student email")
login_test.add_test_data("password", "SecurePass123!", "Valid password meeting requirements")

## Add test steps

login_test.add_test_step(TestStepType.SETUP, "Navigate to login page", "Login form displays correctly")
login_test.add_test_step(TestStepType.ACTION, "Enter valid username", "Username accepted in field")
login_test.add_test_step(TestStepType.ACTION, "Enter valid password", "Password masked in field")
login_test.add_test_step(TestStepType.ACTION, "Click login button", "Login process initiates")
login_test.add_test_step(TestStepType.VERIFICATION, "Check redirect to dashboard", "Student dashboard loads")
login_test.add_test_step(TestStepType.VERIFICATION, "Verify user session", "User session established")

## Add acceptance criteria

criteria1 = AcceptanceCriteria("AC_001", "User can login with valid credentials", "Successful redirect to dashboard")
criteria2 = AcceptanceCriteria("AC_002", "Session is maintained after login", "User remains logged in for 30 minutes")
criteria3 = AcceptanceCriteria("AC_003", "Appropriate error handling", "Clear error messages for invalid attempts")

login_test.add_acceptance_criteria(criteria1)
login_test.add_acceptance_criteria(criteria2)
login_test.add_acceptance_criteria(criteria3)

## Execute test and generate report

result = login_test.execute_test_case()
report = login_test.generate_test_report()

print(f"Test Execution Result: {result}")
print(f"Test Report Summary:")
print(f"  Steps executed: {len(report['steps'])}")
print(f"  Execution status: {report['execution_status']}")
print(f"  Criteria assessment: {report['criteria_met']}")

```

///

### Automated vs manual testing approaches

Both automated and manual testing serve important roles in a comprehensive testing strategy. Understanding when to use each approach optimises testing efficiency and effectiveness.

/// tab | Testing Approach Selection
**Automated Testing - Best For**:

- **Regression testing**: Re-running tests after code changes

- **Performance testing**: Load and stress testing scenarios

- **Repetitive tests**: Tests that need frequent execution

- **Data-driven testing**: Testing with large datasets

- **Continuous integration**: Tests that run with every build

**Manual Testing - Best For**:

- **Exploratory testing**: Discovering unexpected issues

- **Usability testing**: Evaluating user experience

- **Ad-hoc testing**: Unstructured investigation

- **Initial test creation**: Developing new test scenarios

- **Complex scenarios**: Tests requiring human judgment

**Decision Factors**:

- Test frequency and repetition requirements

- Complexity of test scenarios

- Available resources and timeline

- Return on investment for automation

- Type of functionality being tested
///

/// tab | Python Test Automation Framework

```py

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AutomatedTestSuite:
    def __init__(self, base_url):
        self.base_url = base_url
        self.driver = None
        self.test_results = []
    
    def setup_driver(self, browser="chrome"):
        """Initialize web driver for automated testing"""
        if browser == "chrome":

            ## In practice, you'd configure ChromeDriver properly

            self.driver = None  # Placeholder for actual driver
        self.log_action("Driver setup completed")
    
    def teardown_driver(self):
        """Clean up web driver resources"""
        if self.driver:
            self.driver.quit()
        self.log_action("Driver teardown completed")
    
    def log_action(self, action, result="success"):
        """Log test actions and results"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {
            "timestamp": timestamp,
            "action": action,
            "result": result
        }
        self.test_results.append(log_entry)
        print(f"[{timestamp}] {action} - {result}")
    
    def automated_login_test(self, username, password):
        """Automated login test scenario"""
        test_name = "Automated Login Test"
        self.log_action(f"Starting {test_name}")
        
        try:

            ## Simulate automated actions

            self.log_action("Navigate to login page")
            time.sleep(0.1)  # Simulate page load
            
            self.log_action(f"Enter username: {username}")
            time.sleep(0.05)
            
            self.log_action("Enter password")
            time.sleep(0.05)
            
            self.log_action("Click login button")
            time.sleep(0.1)
            
            ## Simulate success/failure

            if username == "valid@user.com" and password == "correctpass":
                self.log_action("Login successful - redirected to dashboard")
                return True
            else:
                self.log_action("Login failed - error message displayed", "failure")
                return False
                
        except Exception as e:
            self.log_action(f"Test failed with exception: {str(e)}", "error")
            return False

class ManualTestManager:
    def __init__(self):
        self.manual_tests = []
        self.session_notes = []
    
    def create_exploratory_session(self, feature_area, duration_minutes, tester):
        """Create manual exploratory testing session"""
        session = {
            "session_id": f"EXP_{int(time.time())}",
            "feature_area": feature_area,
            "duration_minutes": duration_minutes,
            "tester": tester,
            "start_time": time.strftime("%Y-%m-%d %H:%M:%S"),
            "findings": [],
            "issues_found": [],
            "test_ideas": []
        }
        
        self.manual_tests.append(session)
        return session
    
    def add_finding(self, session_id, finding_type, description, severity="medium"):
        """Add finding from manual testing session"""
        finding = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "type": finding_type,  # "bug", "usability", "suggestion", "question"
            "description": description,
            "severity": severity,
            "screenshot": f"screenshot_{int(time.time())}.png"
        }
        
        ## Find session and add finding

        for session in self.manual_tests:
            if session["session_id"] == session_id:
                if finding_type == "bug":
                    session["issues_found"].append(finding)
                else:
                    session["findings"].append(finding)
                break
        
        return finding
    
    def generate_session_report(self, session_id):
        """Generate report for manual testing session"""
        session = next((s for s in self.manual_tests if s["session_id"] == session_id), None)
        
        if not session:
            return {"error": "Session not found"}
        
        total_findings = len(session["findings"]) + len(session["issues_found"])
        critical_issues = len([i for i in session["issues_found"] if i["severity"] == "critical"])
        
        return {
            "session_id": session_id,
            "feature_area": session["feature_area"],
            "tester": session["tester"],
            "duration": session["duration_minutes"],
            "total_findings": total_findings,
            "bugs_found": len(session["issues_found"]),
            "critical_issues": critical_issues,
            "usability_insights": len([f for f in session["findings"] if f["type"] == "usability"]),
            "test_coverage": "Good" if total_findings > 3 else "Limited"
        }

class TestStrategy:
    def __init__(self):
        self.automated_suite = None
        self.manual_manager = ManualTestManager()
        self.strategy_recommendations = []
    
    def recommend_test_approach(self, test_scenario):
        """Recommend automated vs manual testing approach"""
        feature = test_scenario.get("feature", "")
        frequency = test_scenario.get("frequency", "once")
        complexity = test_scenario.get("complexity", "medium")
        user_interaction = test_scenario.get("user_interaction", False)
        
        score_automated = 0
        score_manual = 0
        
        ## Frequency scoring

        if frequency in ["daily", "every_build"]:
            score_automated += 3
        elif frequency == "weekly":
            score_automated += 1
        else:
            score_manual += 1
        
        ## Complexity scoring

        if complexity == "simple":
            score_automated += 2
        elif complexity == "complex":
            score_manual += 2
        
        ## User interaction scoring

        if user_interaction:
            score_manual += 2
        else:
            score_automated += 1
        
        ## Generate recommendation

        if score_automated > score_manual:
            recommendation = "automated"
            reason = "High frequency, suitable complexity for automation"
        elif score_manual > score_automated:
            recommendation = "manual"
            reason = "Complex scenarios requiring human judgment"
        else:
            recommendation = "hybrid"
            reason = "Combination of automated and manual testing recommended"
        
        return {
            "feature": feature,
            "recommendation": recommendation,
            "reason": reason,
            "automated_score": score_automated,
            "manual_score": score_manual
        }

## Example usage

def demonstrate_testing_approaches():

    ## Automated testing example

    automated_suite = AutomatedTestSuite("http://localhost:3000")
    automated_suite.setup_driver()
    
    ## Run automated login tests

    test_cases = [
        ("valid@user.com", "correctpass"),
        ("invalid@user.com", "wrongpass"),
        ("", "password"),
        ("user@test.com", "")
    ]
    
    print("=== Automated Test Results ===")
    for username, password in test_cases:
        result = automated_suite.automated_login_test(username, password)
        print(f"Login test for {username}: {'PASSED' if result else 'FAILED'}")
    
    automated_suite.teardown_driver()
    
    ## Manual testing example

    print("\\n=== Manual Test Session ===")
    manual_manager = ManualTestManager()
    
    session = manual_manager.create_exploratory_session(
        "User Dashboard",
        30,
        "Sarah Johnson"
    )
    
    ## Add findings from manual testing

    manual_manager.add_finding(
        session["session_id"],
        "usability",
        "Navigation menu is not intuitive for new users",
        "medium"
    )
    
    manual_manager.add_finding(
        session["session_id"],
        "bug",
        "Page crashes when clicking refresh rapidly",
        "high"
    )
    
    report = manual_manager.generate_session_report(session["session_id"])
    print(f"Manual testing session report: {report}")
    
    ## Strategy recommendation

    print("\\n=== Test Strategy Recommendations ===")
    strategy = TestStrategy()
    
    scenarios = [
        {"feature": "Login functionality", "frequency": "every_build", "complexity": "simple", "user_interaction": False},
        {"feature": "User interface design", "frequency": "once", "complexity": "complex", "user_interaction": True},
        {"feature": "Data validation", "frequency": "weekly", "complexity": "medium", "user_interaction": False}
    ]
    
    for scenario in scenarios:
        recommendation = strategy.recommend_test_approach(scenario)
        print(f"Feature: {recommendation['feature']}")
        print(f"  Recommendation: {recommendation['recommendation']}")
        print(f"  Reason: {recommendation['reason']}")

## Run demonstration

demonstrate_testing_approaches()

```

///

## Practice

/// details | Exercise 1: Test Plan Development
    type: question
    open: false

**Scenario**: You're developing a new feature for the student portal that allows students to submit assignment files. The feature needs comprehensive testing before release.

**Task**: Create a test plan outline covering functional, integration, and non-functional testing requirements.

/// details | Sample Solution
    type: success
    open: false

**Test Plan for Assignment Submission Feature**:

1. **Functional Tests**:

   - File upload validation (supported formats, size limits)

   - Submission confirmation and receipt generation

   - Assignment deadline validation

   - User authentication and authorisation

2. **Integration Tests**:

   - Database storage of submission records

   - Email notification system integration

   - File storage system integration

   - Grade book system updates

3. **Non-functional Tests**:

   - Performance: Upload time for various file sizes

   - Security: File type validation, virus scanning

   - Usability: User interface flow and feedback

   - Reliability: System behaviour under concurrent uploads

4. **Test Data Requirements**:

   - Valid file types: PDF, DOC, TXT (within size limits)

   - Invalid file types: EXE, ZIP, oversized files

   - Edge cases: Zero-byte files, special characters in names

   - Boundary conditions: Files at exact size limits

5. **Acceptance Criteria**:

   - Students can upload files up to 10MB

   - System confirms successful submission

   - Teachers receive notification of submissions

   - Submission history is maintained for students
///
///

/// details | Exercise 2: Automated vs Manual Testing Decision
    type: question
    open: false

**Scenario**: Your team needs to decide which tests to automate for a new student information system. You have limited automation resources and need to prioritise.

**Task**: Categorise the following test scenarios as automated, manual, or hybrid approaches with justification.

**Test Scenarios**:

1. User login functionality

2. Grade calculation algorithms

3. User interface design and layout

4. Database backup and recovery

5. Student data import from CSV files

6. Mobile app responsiveness

7. Performance under 1000 concurrent users

/// details | Sample Solution
    type: success
    open: false

**Testing Approach Recommendations**:

1. **User login functionality - Automated**

   - High frequency testing (every build)

   - Simple, repetitive test steps

   - Critical functionality requiring frequent validation

2. **Grade calculation algorithms - Automated**

   - Mathematical logic suitable for automated verification

   - Large datasets for comprehensive testing

   - Regression testing after algorithm changes

3. **User interface design and layout - Manual**

   - Requires human judgment for visual assessment

   - Usability and aesthetic evaluation needed

   - Exploratory testing for user experience

4. **Database backup and recovery - Automated**

   - Technical process with measurable outcomes

   - Needs frequent validation

   - Can be integrated into CI/CD pipeline

5. **Student data import from CSV - Hybrid**

   - Automated: Data validation and processing logic

   - Manual: File format variations and edge cases

   - Automated for volume testing, manual for exploratory

6. **Mobile app responsiveness - Manual**

   - Multiple device and screen size combinations

   - Visual and interactive assessment required

   - User experience evaluation

7. **Performance under 1000 users - Automated**

   - Load testing requires automated tools

   - Consistent, repeatable test conditions

   - Metrics-based evaluation suitable for automation
///
///

## Recap

Effective testing methodologies and optimisation require strategic planning, appropriate tool selection, and comprehensive coverage. Key principles include:

- **Test strategy development**: Create comprehensive plans covering functional, integration, and non-functional testing requirements

- **Smart test data selection**: Use boundary value analysis and path testing to maximise defect detection with efficient test coverage

- **Detailed test cases**: Develop clear, executable test cases tied directly to requirements and acceptance criteria

- **Balanced automation**: Use automated testing for repetitive, high-frequency tests and manual testing for exploratory and usability scenarios

These testing approaches ensure software quality while optimising resource allocation and maintaining cost-effective testing practices throughout the development lifecycle.
