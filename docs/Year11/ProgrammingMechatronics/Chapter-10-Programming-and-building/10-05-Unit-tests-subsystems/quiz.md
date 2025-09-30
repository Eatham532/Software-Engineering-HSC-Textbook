# 10.05 Unit Tests Subsystems - Quiz

!!! quiz "Section 10.5 Quiz: Unit Tests for Subsystems"

    1. What is the main purpose of test fixtures in mechatronic testing?
        - To hold physical components in place
        - To provide controlled substitutes for hardware components {data-correct}
        - To measure electrical current
        - To calibrate sensors

    2. Which testing principle ensures that tests produce the same results every time they run?
        - Isolation
        - Repeatability {data-correct}
        - Fast execution
        - Clear assertions

    3. What is dependency injection in the context of testable system design?
        - Injecting power into system components
        - Providing system dependencies through constructor parameters {data-correct}
        - Adding test code directly into production classes
        - Connecting hardware components physically

    4. Mock devices in unit testing should:
        - Be identical to real hardware
        - Provide predictable, controllable behaviour {data-correct}
        - Always return the same values
        - Only work with simple systems

    5. When testing a temperature controller, which scenarios should be included in comprehensive tests?
        - Normal operation within target range {data-correct}
        - Safety limit enforcement {data-correct}
        - Sensor failure handling {data-correct}
        - Only successful temperature control

    6. What is the advantage of testing control logic separately from hardware interfaces?
        - Tests run faster without hardware delays {data-correct}
        - Hardware failures don't affect test results {data-correct}
        - Tests can run without expensive equipment {data-correct}
        - Tests become more complex

    7. Integration tests with multiple fixtures are useful for:
        - Testing individual components in isolation
        - Verifying subsystem interactions work correctly {data-correct}
        - Replacing all unit tests
        - Testing only hardware components

    8. A well-designed mock sensor should be able to:
        - Simulate various failure modes {data-correct}
        - Provide controlled test data {data-correct}
        - Add realistic noise to readings {data-correct}
        - Only return perfect measurements
