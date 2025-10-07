# 10.5 Unit tests for subsystems

## Why it matters

Testing mechatronic subsystems presents unique challenges: hardware components are expensive, potentially dangerous, and may not be available during development. Unit testing with simulated devices allows developers to verify control logic, validate safety features, and ensure system reliability without requiring physical hardware.

Testability patterns and fixtures enable systematic verification of subsystem behaviour, making it possible to catch bugs early, document expected behaviour, and maintain confidence when making changes to complex control systems.

## Concepts

### Unit testing fundamentals for mechatronics

Unit testing verifies that individual components or subsystems behave correctly in isolation. For mechatronic systems, this means testing control logic separately from hardware interfaces.

**Key principles**:

- **Isolation**: test each subsystem independently

- **Repeatability**: tests produce consistent results

- **Fast execution**: tests run quickly without hardware delays

- **Clear assertions**: tests specify expected behaviour precisely

**Challenges in mechatronic testing**:

- Hardware dependencies make testing slow and expensive

- Real sensors produce noisy, variable data

- Actuators have physical constraints and safety implications

- Timing-dependent behaviour is difficult to reproduce

### Test fixtures: simulating physical devices

Test fixtures provide controlled, predictable substitutes for hardware components. They enable testing without physical devices while maintaining realistic behaviour patterns.

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "Production System" {
    [Control Logic] --> [Real Sensor]
    [Control Logic] --> [Real Actuator]
    [Real Sensor] --> [Physical Environment]
    [Real Actuator] --> [Physical Environment]
}

package "Test Environment" {
    [Control Logic] --> [Mock Sensor]
    [Control Logic] --> [Mock Actuator]
    [Mock Sensor] --> [Simulated Environment]
    [Mock Actuator] --> [Simulated Environment]
    [Test Framework] --> [Mock Sensor]
    [Test Framework] --> [Mock Actuator]
    [Test Framework] --> [Simulated Environment]
}

note right of [Test Framework] : Controls simulated\nenvironment and device\nbehaviour for testing
note left of [Control Logic] : Same logic tested\nin both environments
@enduml

```

### Guided example: temperature control system testing

Let's test a temperature control system that manages heating based on sensor readings and safety limits.

```python
# temperature_controller.py - The system under test
class TemperatureController:
    def __init__(self, sensor, heater, safety_limit=80.0):
        self.sensor = sensor
        self.heater = heater
        self.safety_limit = safety_limit
        self.target_temperature = 20.0
        self.is_enabled = False
        
    def set_target(self, temperature):
        """Set the target temperature"""
        if 10 <= temperature <= 70:
            self.target_temperature = temperature
            return True
        return False
    
    def enable(self):
        """Enable the controller"""
        self.is_enabled = True
    
    def disable(self):
        """Disable the controller"""
        self.is_enabled = False
        self.heater.set_power(0)  # Ensure heater is off
    
    def update(self):
        """Main control loop - call regularly"""
        if not self.is_enabled:
            return
            
        # Read current temperature
        current_temp = self.sensor.read_temperature()
        
        # Safety check - emergency shutdown if too hot
        if current_temp >= self.safety_limit:
            self.disable()
            raise SafetyException(f"Temperature {current_temp}°C exceeds safety limit {self.safety_limit}°C")
        
        # Simple proportional control
        error = self.target_temperature - current_temp
        
        if error > 0:  # Need heating
            power = min(100, error * 10)  # Proportional gain of 10
            self.heater.set_power(power)
        else:  # Too hot or at target
            self.heater.set_power(0)
    
    def get_status(self):
        """Get current system status"""
        return {
            'enabled': self.is_enabled,
            'target': self.target_temperature,
            'current': self.sensor.read_temperature(),
            'heater_power': self.heater.get_power()
        }

class SafetyException(Exception):
    """Raised when safety limits are exceeded"""
    pass

```

Now let's create test fixtures for the sensor and heater:

```python
# test_fixtures.py - Mock devices for testing
class MockTemperatureSensor:
    def __init__(self, initial_temperature=20.0):
        self._temperature = initial_temperature
        self._noise_level = 0.0
        self._failure_mode = None
        
    def read_temperature(self):
        """Read temperature with optional noise and failure simulation"""
        if self._failure_mode == "disconnected":
            raise ConnectionError("Sensor disconnected")
        elif self._failure_mode == "invalid_reading":
            return float('nan')
        
        # Add noise if configured
        import random
        noise = random.uniform(-self._noise_level, self._noise_level)
        return self._temperature + noise
    
    def set_temperature(self, temperature):
        """Set the simulated temperature (for testing)"""
        self._temperature = temperature
    
    def add_noise(self, noise_level):
        """Add random noise to readings"""
        self._noise_level = noise_level
    
    def simulate_failure(self, failure_type):
        """Simulate sensor failures"""
        self._failure_mode = failure_type
    
    def clear_failure(self):
        """Clear simulated failures"""
        self._failure_mode = None

class MockHeater:
    def __init__(self):
        self._power = 0.0
        self._total_energy = 0.0
        self._failure_mode = None
        
    def set_power(self, power_percentage):
        """Set heater power (0-100%)"""
        if self._failure_mode == "stuck_on":
            return  # Ignore commands when stuck
        elif self._failure_mode == "no_response":
            raise ConnectionError("Heater not responding")
        
        self._power = max(0, min(100, power_percentage))
        
    def get_power(self):
        """Get current power setting"""
        return self._power
    
    def get_total_energy(self):
        """Get total energy consumed (for testing efficiency)"""
        return self._total_energy
    
    def simulate_failure(self, failure_type):
        """Simulate heater failures"""
        self._failure_mode = failure_type
        if failure_type == "stuck_on":
            self._power = 100.0  # Stuck at full power
    
    def clear_failure(self):
        """Clear simulated failures"""
        self._failure_mode = None

```

### Comprehensive unit tests

```python
# test_temperature_controller.py - Unit tests using fixtures
import unittest
from temperature_controller import TemperatureController, SafetyException
from test_fixtures import MockTemperatureSensor, MockHeater

class TestTemperatureController(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures before each test"""
        self.sensor = MockTemperatureSensor(initial_temperature=20.0)
        self.heater = MockHeater()
        self.controller = TemperatureController(self.sensor, self.heater)
    
    def test_initial_state(self):
        """Test controller starts in correct initial state"""
        status = self.controller.get_status()
        self.assertFalse(status['enabled'])
        self.assertEqual(status['target'], 20.0)
        self.assertEqual(status['current'], 20.0)
        self.assertEqual(status['heater_power'], 0)
    
    def test_target_temperature_validation(self):
        """Test target temperature range validation"""
        # Valid temperatures should be accepted
        self.assertTrue(self.controller.set_target(25.0))
        self.assertEqual(self.controller.target_temperature, 25.0)
        
        # Invalid temperatures should be rejected
        self.assertFalse(self.controller.set_target(5.0))   # Too low
        self.assertFalse(self.controller.set_target(80.0))  # Too high
        self.assertEqual(self.controller.target_temperature, 25.0)  # Unchanged
    
    def test_enable_disable(self):
        """Test controller enable/disable functionality"""
        # Start disabled
        self.assertFalse(self.controller.is_enabled)
        
        # Enable
        self.controller.enable()
        self.assertTrue(self.controller.is_enabled)
        
        # Disable should turn off heater
        self.heater.set_power(50)  # Set some power
        self.controller.disable()
        self.assertFalse(self.controller.is_enabled)
        self.assertEqual(self.heater.get_power(), 0)
    
    def test_heating_control(self):
        """Test proportional heating control"""
        self.controller.set_target(30.0)
        self.sensor.set_temperature(20.0)  # 10°C below target
        self.controller.enable()
        
        self.controller.update()
        
        # Should apply proportional heating (error * 10)
        expected_power = 10 * 10  # 10°C error * gain of 10
        self.assertEqual(self.heater.get_power(), min(100, expected_power))
    
    def test_no_heating_when_at_target(self):
        """Test heater turns off when at target temperature"""
        self.controller.set_target(25.0)
        self.sensor.set_temperature(25.0)
        self.controller.enable()
        
        self.controller.update()
        
        self.assertEqual(self.heater.get_power(), 0)
    
    def test_no_heating_when_too_hot(self):
        """Test heater turns off when above target"""
        self.controller.set_target(25.0)
        self.sensor.set_temperature(30.0)  # Above target
        self.controller.enable()
        
        self.controller.update()
        
        self.assertEqual(self.heater.get_power(), 0)
    
    def test_safety_limit_enforcement(self):
        """Test emergency shutdown at safety limit"""
        self.controller.set_target(30.0)
        self.controller.enable()
        
        # Simulate temperature exceeding safety limit
        self.sensor.set_temperature(85.0)
        
        with self.assertRaises(SafetyException) as context:
            self.controller.update()
        
        # Controller should be disabled and heater off
        self.assertFalse(self.controller.is_enabled)
        self.assertEqual(self.heater.get_power(), 0)
        self.assertIn("safety limit", str(context.exception))
    
    def test_disabled_controller_ignores_updates(self):
        """Test disabled controller doesn't control heater"""
        self.controller.set_target(40.0)
        self.sensor.set_temperature(20.0)
        # Keep controller disabled
        
        self.controller.update()
        
        self.assertEqual(self.heater.get_power(), 0)
    
    def test_power_limiting(self):
        """Test heater power is limited to 100%"""
        self.controller.set_target(50.0)
        self.sensor.set_temperature(10.0)  # Large error
        self.controller.enable()
        
        self.controller.update()
        
        # Even with large error, power should not exceed 100%
        self.assertEqual(self.heater.get_power(), 100)

class TestTemperatureControllerWithFailures(unittest.TestCase):
    """Test controller behaviour with simulated device failures"""
    
    def setUp(self):
        self.sensor = MockTemperatureSensor(initial_temperature=20.0)
        self.heater = MockHeater()
        self.controller = TemperatureController(self.sensor, self.heater)
    
    def test_sensor_disconnection(self):
        """Test handling of sensor connection failure"""
        self.controller.enable()
        self.sensor.simulate_failure("disconnected")
        
        with self.assertRaises(ConnectionError):
            self.controller.update()
    
    def test_sensor_invalid_reading(self):
        """Test handling of invalid sensor data"""
        self.controller.enable()
        self.sensor.simulate_failure("invalid_reading")
        
        # Controller should handle NaN readings gracefully
        # Implementation detail: this might raise an exception or use a default
        with self.assertRaises((ValueError, TypeError)):
            self.controller.update()
    
    def test_heater_failure(self):
        """Test detection of heater communication failure"""
        self.controller.set_target(30.0)
        self.controller.enable()
        self.heater.simulate_failure("no_response")
        
        with self.assertRaises(ConnectionError):
            self.controller.update()
    
    def test_sensor_noise_handling(self):
        """Test controller stability with noisy sensor readings"""
        self.controller.set_target(25.0)
        self.controller.enable()
        self.sensor.add_noise(0.5)  # ±0.5°C noise
        
        # Run multiple updates with noise
        power_readings = []
        for _ in range(10):
            self.sensor.set_temperature(24.0)  # Slightly below target
            self.controller.update()
            power_readings.append(self.heater.get_power())
        
        # Power should be generally consistent despite noise
        avg_power = sum(power_readings) / len(power_readings)
        self.assertGreater(avg_power, 5)  # Should be heating
        self.assertLess(avg_power, 20)    # But not too much

# Test runner
if __name__ == '__main__':
    # Run all tests
    unittest.main(verbosity=2)

```

### Testability patterns

Designing systems for testability requires specific architectural patterns that separate concerns and enable dependency injection.

#### Dependency injection pattern

```python
class RobotArm:
    """Example of dependency injection for testability"""
    
    def __init__(self, motor_controller, position_sensor, safety_monitor):
        # Dependencies injected at construction
        self.motor = motor_controller
        self.sensor = position_sensor
        self.safety = safety_monitor
        self.current_position = 0.0
        self.target_position = 0.0
        
    def move_to(self, target_position):
        """Move arm to target position with safety checks"""
        if not self.safety.is_position_safe(target_position):
            raise SafetyException(f"Target position {target_position} is not safe")
        
        self.target_position = target_position
        self._execute_move()
    
    def _execute_move(self):
        """Internal move execution logic"""
        self.current_position = self.sensor.read_position()
        error = self.target_position - self.current_position
        
        if abs(error) < 0.1:  # Close enough
            self.motor.stop()
        elif error > 0:
            self.motor.move_forward(min(100, abs(error) * 50))
        else:
            self.motor.move_backward(min(100, abs(error) * 50))

# Mock implementations for testing
class MockMotorController:
    def __init__(self):
        self.current_command = "stop"
        self.power_level = 0
    
    def move_forward(self, power):
        self.current_command = "forward"
        self.power_level = power
    
    def move_backward(self, power):
        self.current_command = "backward"
        self.power_level = power
    
    def stop(self):
        self.current_command = "stop"
        self.power_level = 0

class MockPositionSensor:
    def __init__(self, position=0.0):
        self._position = position
    
    def read_position(self):
        return self._position
    
    def set_position(self, position):
        self._position = position

class MockSafetyMonitor:
    def __init__(self):
        self.safe_range = (-100, 100)
    
    def is_position_safe(self, position):
        return self.safe_range[0] <= position <= self.safe_range[1]
    
    def set_safe_range(self, min_pos, max_pos):
        self.safe_range = (min_pos, max_pos)

# Test using dependency injection
def test_robot_arm_movement():
    """Test robot arm with injected mock dependencies"""
    motor = MockMotorController()
    sensor = MockPositionSensor(position=10.0)
    safety = MockSafetyMonitor()
    
    arm = RobotArm(motor, sensor, safety)
    
    # Test normal movement
    arm.move_to(20.0)
    assert motor.current_command == "forward"
    assert motor.power_level > 0
    
    # Test safety limits
    safety.set_safe_range(-50, 50)
    try:
        arm.move_to(100.0)  # Outside safe range
        assert False, "Should have raised SafetyException"
    except SafetyException:
        pass  # Expected

```

### Integration testing with fixture orchestration

```python
# test_system_integration.py - Testing multiple subsystems together
class GreenhouseIntegrationTest(unittest.TestCase):
    """Integration tests using multiple coordinated fixtures"""
    
    def setUp(self):
        # Create an integrated mock environment
        self.environment = MockGreenhouseEnvironment()
        
        # Create subsystem fixtures
        self.temp_sensor = MockTemperatureSensor(20.0)
        self.humidity_sensor = MockHumiditySensor(60.0)
        self.fan = MockFan()
        self.heater = MockHeater()
        
        # Connect fixtures to environment
        self.environment.add_sensor(self.temp_sensor)
        self.environment.add_sensor(self.humidity_sensor)
        self.environment.add_actuator(self.fan)
        self.environment.add_actuator(self.heater)
        
        # Create system under test
        self.greenhouse_controller = GreenhouseController(
            temp_sensor=self.temp_sensor,
            humidity_sensor=self.humidity_sensor,
            fan=self.fan,
            heater=self.heater
        )
    
    def test_coordinated_climate_control(self):
        """Test temperature and humidity control working together"""
        # Set targets
        self.greenhouse_controller.set_temperature_target(25.0)
        self.greenhouse_controller.set_humidity_target(70.0)
        
        # Simulate hot, dry conditions
        self.environment.set_conditions(temperature=30.0, humidity=40.0)
        
        # Run control cycle
        self.greenhouse_controller.update()
        
        # Should activate fan for cooling and humidity
        self.assertGreater(self.fan.get_speed(), 0)
        # Should not heat when too hot
        self.assertEqual(self.heater.get_power(), 0)
    
    def test_system_recovery_after_failure(self):
        """Test system behaviour during and after component failure"""
        self.greenhouse_controller.enable()
        
        # Simulate sensor failure
        self.temp_sensor.simulate_failure("disconnected")
        
        # System should detect failure and enter safe mode
        self.greenhouse_controller.update()
        self.assertTrue(self.greenhouse_controller.is_in_safe_mode())
        
        # Restore sensor
        self.temp_sensor.clear_failure()
        
        # System should recover
        self.greenhouse_controller.update()
        self.assertFalse(self.greenhouse_controller.is_in_safe_mode())

class MockGreenhouseEnvironment:
    """Orchestrates multiple fixtures to simulate realistic environment"""
    
    def __init__(self):
        self.sensors = []
        self.actuators = []
        self.temperature = 20.0
        self.humidity = 60.0
    
    def add_sensor(self, sensor):
        self.sensors.append(sensor)
    
    def add_actuator(self, actuator):
        self.actuators.append(actuator)
    
    def set_conditions(self, temperature=None, humidity=None):
        """Update environmental conditions"""
        if temperature is not None:
            self.temperature = temperature
            # Update all temperature sensors
            for sensor in self.sensors:
                if hasattr(sensor, 'set_temperature'):
                    sensor.set_temperature(temperature)
        
        if humidity is not None:
            self.humidity = humidity
            # Update all humidity sensors
            for sensor in self.sensors:
                if hasattr(sensor, 'set_humidity'):
                    sensor.set_humidity(humidity)
    
    def simulate_time_step(self, dt=1.0):
        """Simulate environmental dynamics over time"""
        # Simple thermal model
        heating_effect = sum(
            actuator.get_power() * 0.01 
            for actuator in self.actuators 
            if hasattr(actuator, 'get_power')
        )
        
        cooling_effect = sum(
            actuator.get_speed() * 0.005
            for actuator in self.actuators
            if hasattr(actuator, 'get_speed')
        )
        
        self.temperature += (heating_effect - cooling_effect) * dt
        
        # Update sensors with new conditions
        self.set_conditions(self.temperature, self.humidity)

```

## Try it

/// details | Exercise 1: sensor validation testing
    type: question
    open: false

Create unit tests for a pressure sensor that must validate readings are within expected ranges and handle sensor failures gracefully.

Requirements:

- Normal range: 0-1000 kPa

- Must detect readings outside physical limits

- Must handle sensor disconnection

- Must provide default safe reading during failures

/// details | Sample Solution
    type: success
    open: false

```python
class PressureSensor:
    def __init__(self, min_pressure=0, max_pressure=1000):
        self.min_pressure = min_pressure
        self.max_pressure = max_pressure
        self.last_valid_reading = 0
        
    def read_pressure(self):
        # Implementation would read from actual hardware
        pass
    
    def validate_reading(self, raw_reading):
        if raw_reading < self.min_pressure or raw_reading > self.max_pressure:
            raise ValueError(f"Pressure {raw_reading} outside valid range")
        return raw_reading
    
    def get_safe_reading(self):
        try:
            reading = self.read_pressure()
            validated = self.validate_reading(reading)
            self.last_valid_reading = validated
            return validated
        except (ConnectionError, ValueError):
            return self.last_valid_reading  # Return last known good value

class MockPressureSensor(PressureSensor):
    def __init__(self):
        super().__init__()
        self._pressure = 500
        self._connected = True
    
    def read_pressure(self):
        if not self._connected:
            raise ConnectionError("Sensor disconnected")
        return self._pressure
    
    def set_pressure(self, pressure):
        self._pressure = pressure
    
    def disconnect(self):
        self._connected = False

class TestPressureSensor(unittest.TestCase):
    def setUp(self):
        self.sensor = MockPressureSensor()
    
    def test_valid_readings(self):
        self.sensor.set_pressure(500)
        self.assertEqual(self.sensor.get_safe_reading(), 500)
    
    def test_invalid_high_reading(self):
        self.sensor.set_pressure(1500)  # Above max
        # Should return last valid (0 initially)
        self.assertEqual(self.sensor.get_safe_reading(), 0)
    
    def test_disconnected_sensor(self):
        self.sensor.set_pressure(300)
        self.sensor.get_safe_reading()  # Store valid reading
        self.sensor.disconnect()
        # Should return last valid reading
        self.assertEqual(self.sensor.get_safe_reading(), 300)

```

///

/// details | Exercise 2: actuator control testing
    type: question
    open: false

Design tests for a servo motor controller that must handle position commands, speed limits, and safety boundaries.

Requirements:

- Position range: -180 to +180 degrees

- Maximum speed: 90 degrees/second

- Must reject commands outside safe range

- Must stop immediately on safety signal

/// details | Sample Solution
    type: success
    open: false

```python
class ServoController:
    def __init__(self, min_angle=-180, max_angle=180, max_speed=90):
        self.min_angle = min_angle
        self.max_angle = max_angle
        self.max_speed = max_speed
        self.current_position = 0
        self.target_position = 0
        self.is_moving = False
        self.emergency_stop = False
    
    def move_to(self, target_angle):
        if self.emergency_stop:
            return False
        if not (self.min_angle <= target_angle <= self.max_angle):
            return False
        self.target_position = target_angle
        self.is_moving = True
        return True
    
    def emergency_stop_activate(self):
        self.emergency_stop = True
        self.is_moving = False
    
    def update(self, dt):
        if not self.is_moving or self.emergency_stop:
            return
        
        error = self.target_position - self.current_position
        if abs(error) < 1:  # Close enough
            self.is_moving = False
            return
        
        # Calculate movement step with speed limit
        max_step = self.max_speed * dt
        step = min(max_step, abs(error)) * (1 if error > 0 else -1)
        self.current_position += step

class TestServoController(unittest.TestCase):
    def setUp(self):
        self.servo = ServoController()
    
    def test_valid_move_command(self):
        self.assertTrue(self.servo.move_to(90))
        self.assertEqual(self.servo.target_position, 90)
        self.assertTrue(self.servo.is_moving)
    
    def test_invalid_move_command(self):
        self.assertFalse(self.servo.move_to(200))  # Outside range
        self.assertEqual(self.servo.target_position, 0)  # Unchanged
        self.assertFalse(self.servo.is_moving)
    
    def test_emergency_stop(self):
        self.servo.move_to(90)
        self.servo.emergency_stop_activate()
        self.assertFalse(self.servo.is_moving)
        self.assertFalse(self.servo.move_to(45))  # Commands rejected

```

///

/// details | Exercise 3: system integration test
    type: question
    open: false

Create an integration test for a conveyor belt system with multiple sensors and actuators working together.

Components:

- Speed sensor (encoder)

- Safety sensor (light curtain)

- Motor controller

- Emergency stop button

/// details | Sample Solution
    type: success
    open: false

```python
class ConveyorSystem:
    def __init__(self, speed_sensor, safety_sensor, motor, estop_button):
        self.speed_sensor = speed_sensor
        self.safety_sensor = safety_sensor
        self.motor = motor
        self.estop_button = estop_button
        self.target_speed = 0
        self.enabled = False
    
    def start(self, speed):
        if self.estop_button.is_pressed():
            return False
        if not self.safety_sensor.is_clear():
            return False
        self.target_speed = speed
        self.enabled = True
        return True
    
    def stop(self):
        self.enabled = False
        self.target_speed = 0
        self.motor.set_speed(0)
    
    def update(self):
        # Emergency stop override
        if self.estop_button.is_pressed():
            self.stop()
            return
        
        # Safety sensor check
        if not self.safety_sensor.is_clear():
            self.stop()
            return
        
        # Speed control
        if self.enabled:
            current_speed = self.speed_sensor.read_speed()
            error = self.target_speed - current_speed
            adjustment = error * 0.1  # Simple proportional control
            new_speed = current_speed + adjustment
            self.motor.set_speed(max(0, min(100, new_speed)))

class TestConveyorIntegration(unittest.TestCase):
    def setUp(self):
        self.speed_sensor = MockSpeedSensor()
        self.safety_sensor = MockSafetySensor(clear=True)
        self.motor = MockMotor()
        self.estop = MockEstopButton(pressed=False)
        
        self.conveyor = ConveyorSystem(
            self.speed_sensor, self.safety_sensor, 
            self.motor, self.estop
        )
    
    def test_normal_operation(self):
        # Should start successfully
        self.assertTrue(self.conveyor.start(50))
        self.conveyor.update()
        self.assertGreater(self.motor.current_speed, 0)
    
    def test_safety_sensor_stops_system(self):
        self.conveyor.start(50)
        self.safety_sensor.set_clear(False)  # Block sensor
        self.conveyor.update()
        self.assertEqual(self.motor.current_speed, 0)
        self.assertFalse(self.conveyor.enabled)
    
    def test_emergency_stop_override(self):
        self.conveyor.start(50)
        self.estop.press()
        self.conveyor.update()
        self.assertEqual(self.motor.current_speed, 0)
        self.assertFalse(self.conveyor.enabled)

```

///

## Recap

Unit testing mechatronic subsystems requires specialized approaches to handle hardware dependencies and ensure reliable system behaviour:

**Test fixtures**: mock devices provide controlled, predictable substitutes for hardware components, enabling fast and repeatable testing without physical devices.

**Testability patterns**: dependency injection and interface abstraction separate control logic from hardware implementation, making systems easier to test and maintain.

**Comprehensive testing**: covers normal operation, edge cases, failure scenarios, and safety requirements to ensure robust system behaviour.

**Integration testing**: coordinates multiple fixtures to test subsystem interactions and system-level behaviour in realistic scenarios.

**Benefits**: early bug detection, documented behaviour, confidence in changes, and reduced reliance on expensive hardware for development and testing.

Effective testing strategies enable reliable mechatronic systems by validating control logic, safety features, and system integration before deploying to physical hardware.

See also [10.1 Simulations and prototypes for testing](../10-01-Simulations-and-prototypes-for-testing/index.md) for simulation-based testing approaches.
