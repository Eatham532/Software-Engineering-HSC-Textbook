# 10.3 Integrating sensors and actuators

Real mechatronic systems combine multiple sensors and actuators that must work together seamlessly. The key to successful integration is creating clean interfaces that hide the complexity of individual devices while providing a consistent way to interact with them. This section shows how to build flexible, testable systems using interface abstractions.

## Why it matters


Building mechatronic systems device by device leads to tangled, hard-to-debug code. Each sensor and actuator has different connection methods, data formats, and timing requirements. Without proper abstractions, your control logic becomes mixed with device-specific details, making it difficult to test, maintain, or upgrade components.

Interface abstractions solve these problems by providing a standard way to interact with all devices. This makes your system modular, testable, and adaptable to different hardware configurations.

## Concepts

### Interface abstractions

An interface abstraction defines what operations a device can perform without specifying how those operations work internally. This allows you to write control logic that works with any device that implements the interface.

**Benefits of abstractions:**

- **Modularity**: Replace devices without changing control logic

- **Testability**: Use simulated devices during development

- **Maintainability**: Clear separation between device drivers and application logic

- **Flexibility**: Support different hardware configurations

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import time
import random

class Sensor(ABC):
    """Abstract base class for all sensors"""
    
    def __init__(self, name: str):
        self.name = name
        self.last_reading_time = 0
        self.is_connected = True
    
    @abstractmethod
    def read_value(self) -> float:
        """Read the current sensor value"""
        pass
    
    @abstractmethod
    def get_units(self) -> str:
        """Get the units for this sensor's readings"""
        pass
    
    def get_status(self) -> Dict[str, Any]:
        """Get sensor status information"""
        return {
            'name': self.name,
            'connected': self.is_connected,
            'last_reading': self.last_reading_time,
            'units': self.get_units()
        }
    
    def is_reading_fresh(self, max_age_seconds: float = 1.0) -> bool:
        """Check if the last reading is recent enough"""
        return (time.time() - self.last_reading_time) < max_age_seconds

class Actuator(ABC):
    """Abstract base class for all actuators"""
    
    def __init__(self, name: str):
        self.name = name
        self.current_command = 0
        self.is_enabled = True
        self.last_command_time = 0
    
    @abstractmethod
    def set_output(self, value: float) -> bool:
        """Set the actuator output value"""
        pass
    
    @abstractmethod
    def get_output_range(self) -> tuple:
        """Get the minimum and maximum output values"""
        pass
    
    def get_status(self) -> Dict[str, Any]:
        """Get actuator status information"""
        return {
            'name': self.name,
            'enabled': self.is_enabled,
            'current_command': self.current_command,
            'last_command_time': self.last_command_time,
            'output_range': self.get_output_range()
        }
    
    def emergency_stop(self):
        """Immediately stop the actuator"""
        self.is_enabled = False
        self.set_output(0)
        print(f"EMERGENCY STOP: {self.name}")

# Example concrete implementations
class TemperatureSensor(Sensor):
    """Temperature sensor implementation"""
    
    def __init__(self, name: str, sensor_type: str = "digital"):
        super().__init__(name)
        self.sensor_type = sensor_type
        self.calibration_offset = 0
    
    def read_value(self) -> float:
        """Simulate reading temperature"""
        if not self.is_connected:
            raise RuntimeError(f"Sensor {self.name} is not connected")
        
        # Simulate temperature reading with some noise
        base_temp = 22.0  # Room temperature
        noise = random.uniform(-0.5, 0.5)
        temperature = base_temp + noise + self.calibration_offset
        
        self.last_reading_time = time.time()
        return temperature
    
    def get_units(self) -> str:
        return "°C"
    
    def calibrate(self, known_temperature: float):
        """Calibrate sensor against known temperature"""
        current_reading = self.read_value()
        self.calibration_offset = known_temperature - current_reading
        print(f"Calibrated {self.name}: offset = {self.calibration_offset:.2f}°C")

class ServoMotor(Actuator):
    """Servo motor implementation"""
    
    def __init__(self, name: str, min_angle: float = 0, max_angle: float = 180):
        super().__init__(name)
        self.min_angle = min_angle
        self.max_angle = max_angle
        self.current_position = (min_angle + max_angle) / 2
    
    def set_output(self, angle: float) -> bool:
        """Set servo angle"""
        if not self.is_enabled:
            return False
        
        # Clamp angle to valid range
        angle = max(self.min_angle, min(self.max_angle, angle))
        
        self.current_command = angle
        self.current_position = angle  # Assume perfect positioning
        self.last_command_time = time.time()
        
        print(f"{self.name}: Moving to {angle:.1f}°")
        return True
    
    def get_output_range(self) -> tuple:
        return (self.min_angle, self.max_angle)
    
    def get_current_position(self) -> float:
        """Get the current servo position"""
        return self.current_position

# Demonstrate the abstractions
def demo_abstractions():
    """Show how abstractions enable flexible code"""
    
    # Create different types of sensors and actuators
    sensors = [
        TemperatureSensor("Room Temp"),
        TemperatureSensor("CPU Temp")
    ]
    
    actuators = [
        ServoMotor("Pan Servo", -90, 90),
        ServoMotor("Tilt Servo", 0, 180)
    ]
    
    print("=== Device Status ===")
    
    # Same code works with any sensor type
    for sensor in sensors:
        try:
            value = sensor.read_value()
            units = sensor.get_units()
            print(f"{sensor.name}: {value:.1f} {units}")
        except RuntimeError as e:
            print(f"Error reading {sensor.name}: {e}")
    
    print()
    
    # Same code works with any actuator type
    for actuator in actuators:
        min_val, max_val = actuator.get_output_range()
        test_value = (min_val + max_val) / 2
        success = actuator.set_output(test_value)
        print(f"{actuator.name}: Command successful = {success}")

demo_abstractions()

```

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

abstract class Sensor {
    + name: string
    + last_reading_time: float
    + is_connected: bool
    + {abstract} read_value(): float
    + {abstract} get_units(): string
    + get_status(): dict
    + is_reading_fresh(): bool
}

abstract class Actuator {
    + name: string
    + current_command: float
    + is_enabled: bool
    + {abstract} set_output(value): bool
    + {abstract} get_output_range(): tuple
    + get_status(): dict
    + emergency_stop(): void
}

class TemperatureSensor {
    + sensor_type: string
    + calibration_offset: float
    + read_value(): float
    + get_units(): string
    + calibrate(temp): void
}

class ServoMotor {
    + min_angle: float
    + max_angle: float
    + current_position: float
    + set_output(angle): bool
    + get_output_range(): tuple
    + get_current_position(): float
}

class PressureSensor {
    + pressure_range: tuple
    + read_value(): float
    + get_units(): string
}

class StepperMotor {
    + steps_per_revolution: int
    + current_step: int
    + set_output(steps): bool
    + get_output_range(): tuple
}

Sensor <|-- TemperatureSensor
Sensor <|-- PressureSensor
Actuator <|-- ServoMotor
Actuator <|-- StepperMotor

note top of Sensor : Abstract interface ensures\nall sensors work the same way
note top of Actuator : Abstract interface ensures\nall actuators work the same way
@enduml

```

### Device managers

A device manager coordinates multiple sensors and actuators, handling initialization, error recovery, and coordinated operations.

```python
class DeviceManager:
    """Manages a collection of sensors and actuators"""
    
    def __init__(self):
        self.sensors: Dict[str, Sensor] = {}
        self.actuators: Dict[str, Actuator] = {}
        self.error_count = 0
        self.last_update_time = 0
    
    def add_sensor(self, sensor: Sensor):
        """Add a sensor to the system"""
        self.sensors[sensor.name] = sensor
        print(f"Added sensor: {sensor.name}")
    
    def add_actuator(self, actuator: Actuator):
        """Add an actuator to the system"""
        self.actuators[actuator.name] = actuator
        print(f"Added actuator: {actuator.name}")
    
    def read_all_sensors(self) -> Dict[str, float]:
        """Read values from all connected sensors"""
        readings = {}
        
        for name, sensor in self.sensors.items():
            try:
                value = sensor.read_value()
                readings[name] = value
            except RuntimeError as e:
                print(f"Sensor error ({name}): {e}")
                self.error_count += 1
                readings[name] = None
        
        self.last_update_time = time.time()
        return readings
    
    def set_actuator(self, name: str, value: float) -> bool:
        """Set an actuator to a specific value"""
        if name not in self.actuators:
            print(f"Actuator '{name}' not found")
            return False
        
        actuator = self.actuators[name]
        return actuator.set_output(value)
    
    def emergency_stop_all(self):
        """Emergency stop for all actuators"""
        print("EMERGENCY STOP - All actuators stopping")
        for actuator in self.actuators.values():
            actuator.emergency_stop()
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        sensor_status = {name: sensor.get_status() 
                        for name, sensor in self.sensors.items()}
        actuator_status = {name: actuator.get_status() 
                          for name, actuator in self.actuators.items()}
        
        return {
            'sensors': sensor_status,
            'actuators': actuator_status,
            'error_count': self.error_count,
            'last_update': self.last_update_time,
            'total_devices': len(self.sensors) + len(self.actuators)
        }
    
    def run_diagnostics(self) -> bool:
        """Run system diagnostics"""
        print("Running system diagnostics...")
        all_good = True
        
        # Test all sensors
        for name, sensor in self.sensors.items():
            if not sensor.is_connected:
                print(f"❌ Sensor {name} is disconnected")
                all_good = False
            elif not sensor.is_reading_fresh():
                print(f"⚠️  Sensor {name} has stale readings")
                all_good = False
            else:
                print(f"✅ Sensor {name} is working correctly")
        
        # Test all actuators
        for name, actuator in self.actuators.items():
            if not actuator.is_enabled:
                print(f"❌ Actuator {name} is disabled")
                all_good = False
            else:
                print(f"✅ Actuator {name} is working correctly")
        
        return all_good

# Demonstrate device management
def demo_device_manager():
    """Show device manager coordinating multiple devices"""
    
    # Create device manager
    manager = DeviceManager()
    
    # Add devices
    manager.add_sensor(TemperatureSensor("Ambient"))
    manager.add_sensor(TemperatureSensor("Motor"))
    manager.add_actuator(ServoMotor("Camera Pan", -180, 180))
    manager.add_actuator(ServoMotor("Camera Tilt", -45, 90))
    
    # Read all sensors
    print("\n=== Sensor Readings ===")
    readings = manager.read_all_sensors()
    for name, value in readings.items():
        if value is not None:
            sensor = manager.sensors[name]
            units = sensor.get_units()
            print(f"{name}: {value:.1f} {units}")
    
    # Control actuators
    print("\n=== Actuator Control ===")
    manager.set_actuator("Camera Pan", 45)
    manager.set_actuator("Camera Tilt", 30)
    
    # Run diagnostics
    print("\n=== System Diagnostics ===")
    system_ok = manager.run_diagnostics()
    print(f"System status: {'OK' if system_ok else 'ERRORS DETECTED'}")

demo_device_manager()

```

### Test harnesses

Test harnesses allow you to develop and test control logic without physical hardware. They simulate device behavior and can inject faults to test error handling.

```python
class MockSensor(Sensor):
    """Simulated sensor for testing"""
    
    def __init__(self, name: str, value_range: tuple = (0, 100), units: str = "units"):
        super().__init__(name)
        self.min_value, self.max_value = value_range
        self.units_string = units
        self.simulated_value = (self.min_value + self.max_value) / 2
        self.noise_level = 0.1
        self.fault_mode = None  # Can be 'disconnected', 'frozen', 'noisy'
    
    def read_value(self) -> float:
        """Simulate sensor reading with configurable behavior"""
        if self.fault_mode == 'disconnected':
            self.is_connected = False
            raise RuntimeError("Sensor disconnected")
        
        if self.fault_mode == 'frozen':
            # Return same value every time
            pass
        elif self.fault_mode == 'noisy':
            # Add extra noise
            noise = random.uniform(-self.noise_level * 10, self.noise_level * 10)
            self.simulated_value += noise
        else:
            # Normal operation with small noise
            noise = random.uniform(-self.noise_level, self.noise_level)
            self.simulated_value += noise
        
        # Keep value in range
        self.simulated_value = max(self.min_value, 
                                 min(self.max_value, self.simulated_value))
        
        self.last_reading_time = time.time()
        return self.simulated_value
    
    def get_units(self) -> str:
        return self.units_string
    
    def set_simulated_value(self, value: float):
        """Set the sensor's simulated value"""
        self.simulated_value = value
    
    def inject_fault(self, fault_type: str):
        """Inject a fault for testing error handling"""
        self.fault_mode = fault_type
        print(f"Injected fault '{fault_type}' into {self.name}")
    
    def clear_fault(self):
        """Clear any injected faults"""
        self.fault_mode = None
        self.is_connected = True
        print(f"Cleared faults from {self.name}")

class MockActuator(Actuator):
    """Simulated actuator for testing"""
    
    def __init__(self, name: str, output_range: tuple = (0, 100)):
        super().__init__(name)
        self.min_output, self.max_output = output_range
        self.simulated_position = 0
        self.fault_mode = None  # Can be 'stuck', 'disabled', 'slow'
        self.response_time = 0.1  # Seconds to reach commanded position
    
    def set_output(self, value: float) -> bool:
        """Simulate actuator movement with configurable behavior"""
        if not self.is_enabled or self.fault_mode == 'disabled':
            return False
        
        if self.fault_mode == 'stuck':
            # Actuator doesn't move
            print(f"{self.name}: Stuck - cannot move to {value}")
            return False
        
        # Clamp to valid range
        value = max(self.min_output, min(self.max_output, value))
        self.current_command = value
        
        if self.fault_mode == 'slow':
            # Simulate slow movement
            print(f"{self.name}: Moving slowly to {value}")
        else:
            # Normal movement
            self.simulated_position = value
        
        self.last_command_time = time.time()
        return True
    
    def get_output_range(self) -> tuple:
        return (self.min_output, self.max_output)
    
    def get_current_position(self) -> float:
        """Get simulated current position"""
        return self.simulated_position
    
    def inject_fault(self, fault_type: str):
        """Inject a fault for testing"""
        self.fault_mode = fault_type
        if fault_type == 'disabled':
            self.is_enabled = False
        print(f"Injected fault '{fault_type}' into {self.name}")
    
    def clear_fault(self):
        """Clear any injected faults"""
        self.fault_mode = None
        self.is_enabled = True
        print(f"Cleared faults from {self.name}")

class TestHarness:
    """Test harness for mechatronic systems"""
    
    def __init__(self):
        self.test_devices = {}
        self.test_results = []
    
    def create_mock_sensor(self, name: str, value_range: tuple, units: str) -> MockSensor:
        """Create a mock sensor for testing"""
        sensor = MockSensor(name, value_range, units)
        self.test_devices[name] = sensor
        return sensor
    
    def create_mock_actuator(self, name: str, output_range: tuple) -> MockActuator:
        """Create a mock actuator for testing"""
        actuator = MockActuator(name, output_range)
        self.test_devices[name] = actuator
        return actuator
    
    def run_test_scenario(self, name: str, test_function):
        """Run a test scenario and record results"""
        print(f"\n--- Running Test: {name} ---")
        try:
            test_function()
            result = "PASS"
            print(f"✅ Test {name}: PASSED")
        except Exception as e:
            result = "FAIL"
            print(f"❌ Test {name}: FAILED - {e}")
        
        self.test_results.append({'name': name, 'result': result})
    
    def inject_random_faults(self):
        """Inject random faults for stress testing"""
        fault_types = ['disconnected', 'frozen', 'noisy', 'stuck', 'disabled', 'slow']
        
        for device in self.test_devices.values():
            if random.random() < 0.3:  # 30% chance of fault
                fault = random.choice(fault_types)
                if hasattr(device, 'inject_fault'):
                    device.inject_fault(fault)
    
    def clear_all_faults(self):
        """Clear all injected faults"""
        for device in self.test_devices.values():
            if hasattr(device, 'clear_fault'):
                device.clear_fault()
    
    def print_test_summary(self):
        """Print summary of all test results"""
        print("\n=== Test Summary ===")
        passed = sum(1 for result in self.test_results if result['result'] == 'PASS')
        total = len(self.test_results)
        
        for result in self.test_results:
            status = "✅" if result['result'] == 'PASS' else "❌"
            print(f"{status} {result['name']}: {result['result']}")
        
        print(f"\nTotal: {passed}/{total} tests passed")

# Example test scenarios
def demo_test_harness():
    """Demonstrate testing with mock devices"""
    
    harness = TestHarness()
    
    # Create test devices
    temp_sensor = harness.create_mock_sensor("Temperature", (15, 35), "°C")
    pressure_sensor = harness.create_mock_sensor("Pressure", (900, 1100), "hPa")
    servo = harness.create_mock_actuator("Position Servo", (0, 180))
    
    # Create system under test
    manager = DeviceManager()
    manager.add_sensor(temp_sensor)
    manager.add_sensor(pressure_sensor)
    manager.add_actuator(servo)
    
    def test_normal_operation():
        """Test system under normal conditions"""
        readings = manager.read_all_sensors()
        assert all(v is not None for v in readings.values()), "All sensors should work"
        
        success = manager.set_actuator("Position Servo", 90)
        assert success, "Actuator should respond to commands"
    
    def test_sensor_failure():
        """Test system response to sensor failures"""
        temp_sensor.inject_fault('disconnected')
        readings = manager.read_all_sensors()
        
        # Should handle disconnected sensor gracefully
        assert readings["Temperature"] is None, "Disconnected sensor should return None"
        assert readings["Pressure"] is not None, "Other sensors should still work"
    
    def test_actuator_failure():
        """Test system response to actuator failures"""
        servo.inject_fault('stuck')
        success = manager.set_actuator("Position Servo", 45)
        assert not success, "Stuck actuator should return False"
    
    def test_error_recovery():
        """Test system recovery after faults are cleared"""
        harness.clear_all_faults()
        
        readings = manager.read_all_sensors()
        assert all(v is not None for v in readings.values()), "All sensors should work after recovery"
        
        success = manager.set_actuator("Position Servo", 135)
        assert success, "Actuator should work after recovery"
    
    # Run test scenarios
    harness.run_test_scenario("Normal Operation", test_normal_operation)
    harness.run_test_scenario("Sensor Failure", test_sensor_failure)
    harness.run_test_scenario("Actuator Failure", test_actuator_failure)
    harness.run_test_scenario("Error Recovery", test_error_recovery)
    
    # Print results
    harness.print_test_summary()

demo_test_harness()

```

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "Test Environment" {
    class TestHarness {
        + test_devices: dict
        + test_results: list
        + create_mock_sensor(): MockSensor
        + create_mock_actuator(): MockActuator
        + run_test_scenario(): void
        + inject_random_faults(): void
    }
    
    class MockSensor {
        + simulated_value: float
        + noise_level: float
        + fault_mode: string
        + inject_fault(): void
        + clear_fault(): void
        + set_simulated_value(): void
    }
    
    class MockActuator {
        + simulated_position: float
        + fault_mode: string
        + response_time: float
        + inject_fault(): void
        + clear_fault(): void
    }
}

package "Production Environment" {
    class RealSensor {
        + hardware_interface: object
        + calibration_data: dict
        + read_hardware(): float
    }
    
    class RealActuator {
        + hardware_interface: object
        + control_parameters: dict
        + send_command(): bool
    }
}

TestHarness --> MockSensor : creates
TestHarness --> MockActuator : creates
MockSensor --|> Sensor : implements
MockActuator --|> Actuator : implements
RealSensor --|> Sensor : implements
RealActuator --|> Actuator : implements

note top of TestHarness : Enables testing without\nphysical hardware
note bottom of "Production Environment" : Same interfaces work\nwith real devices
@enduml

```

### Guided example

Let's build a complete environmental monitoring system that demonstrates sensor/actuator integration with proper abstractions and testing.

```python
class EnvironmentalController:
    """Complete environmental control system"""
    
    def __init__(self):
        self.device_manager = DeviceManager()
        self.control_parameters = {
            'target_temperature': 22.0,
            'target_humidity': 60.0,
            'temperature_tolerance': 1.0,
            'humidity_tolerance': 5.0
        }
        self.control_enabled = True
        self.emergency_mode = False
    
    def setup_devices(self, use_mock_devices: bool = False):
        """Set up sensors and actuators"""
        if use_mock_devices:
            # Use mock devices for testing
            temp_sensor = MockSensor("Temperature", (15, 35), "°C")
            humidity_sensor = MockSensor("Humidity", (30, 90), "%RH")
            heater = MockActuator("Heater", (0, 100))  # 0-100% power
            fan = MockActuator("Fan", (0, 100))        # 0-100% speed
            
            # Set initial conditions
            temp_sensor.set_simulated_value(20.0)
            humidity_sensor.set_simulated_value(70.0)
        else:
            # Use real devices (would connect to actual hardware)
            temp_sensor = TemperatureSensor("Temperature")
            humidity_sensor = TemperatureSensor("Humidity")  # Simplified for demo
            heater = ServoMotor("Heater", 0, 100)
            fan = ServoMotor("Fan", 0, 100)
        
        self.device_manager.add_sensor(temp_sensor)
        self.device_manager.add_sensor(humidity_sensor)
        self.device_manager.add_actuator(heater)
        self.device_manager.add_actuator(fan)
    
    def read_environment(self) -> Dict[str, float]:
        """Read current environmental conditions"""
        return self.device_manager.read_all_sensors()
    
    def calculate_control_actions(self, readings: Dict[str, float]) -> Dict[str, float]:
        """Calculate what actuator outputs should be"""
        actions = {}
        
        if readings.get("Temperature") is None or readings.get("Humidity") is None:
            # Missing sensor data - use safe defaults
            actions["Heater"] = 0
            actions["Fan"] = 30  # Low ventilation
            return actions
        
        temp = readings["Temperature"]
        humidity = readings["Humidity"]
        target_temp = self.control_parameters['target_temperature']
        target_humidity = self.control_parameters['target_humidity']
        
        # Temperature control
        temp_error = target_temp - temp
        if abs(temp_error) <= self.control_parameters['temperature_tolerance']:
            heater_power = 0  # Temperature OK
        elif temp_error > 0:
            # Too cold - turn on heater
            heater_power = min(100, temp_error * 20)  # Proportional control
        else:
            # Too hot - no heating
            heater_power = 0
        
        # Humidity control (simplified - fan for dehumidification)
        humidity_error = humidity - target_humidity
        if abs(humidity_error) <= self.control_parameters['humidity_tolerance']:
            fan_speed = 20  # Minimum ventilation
        elif humidity_error > 0:
            # Too humid - increase fan
            fan_speed = min(100, 20 + humidity_error * 2)
        else:
            # Too dry - minimum fan
            fan_speed = 10
        
        actions["Heater"] = heater_power
        actions["Fan"] = fan_speed
        
        return actions
    
    def apply_control_actions(self, actions: Dict[str, float]):
        """Apply calculated control actions to actuators"""
        if not self.control_enabled:
            # Control disabled - turn everything off
            actions = {name: 0 for name in actions}
        
        for actuator_name, value in actions.items():
            success = self.device_manager.set_actuator(actuator_name, value)
            if not success:
                print(f"Warning: Failed to control {actuator_name}")
    
    def check_safety_limits(self, readings: Dict[str, float]) -> bool:
        """Check if readings are within safe limits"""
        if readings.get("Temperature") is not None:
            temp = readings["Temperature"]
            if temp < 10 or temp > 40:
                print(f"SAFETY ALERT: Temperature {temp:.1f}°C is outside safe range!")
                return False
        
        if readings.get("Humidity") is not None:
            humidity = readings["Humidity"]
            if humidity > 95:
                print(f"SAFETY ALERT: Humidity {humidity:.1f}% is too high!")
                return False
        
        return True
    
    def run_control_cycle(self):
        """Execute one complete control cycle"""
        # Read sensors
        readings = self.read_environment()
        
        # Check safety
        if not self.check_safety_limits(readings):
            self.emergency_mode = True
            self.device_manager.emergency_stop_all()
            return False
        
        # Calculate and apply control
        if not self.emergency_mode:
            actions = self.calculate_control_actions(readings)
            self.apply_control_actions(actions)
            
            # Print status
            print(f"Temp: {readings.get('Temperature', 'N/A'):.1f}°C, "
                  f"Humidity: {readings.get('Humidity', 'N/A'):.1f}%, "
                  f"Heater: {actions.get('Heater', 0):.0f}%, "
                  f"Fan: {actions.get('Fan', 0):.0f}%")
        
        return True
    
    def reset_emergency(self):
        """Reset emergency mode"""
        self.emergency_mode = False
        print("Emergency mode reset")

# Demonstrate the complete system
def demo_environmental_system():
    """Show complete environmental control system"""
    
    print("=== Environmental Control System Demo ===")
    
    # Create and set up system
    controller = EnvironmentalController()
    controller.setup_devices(use_mock_devices=True)
    
    # Get mock devices for testing
    temp_sensor = controller.device_manager.sensors["Temperature"]
    humidity_sensor = controller.device_manager.sensors["Humidity"]
    
    print("\n--- Normal Operation ---")
    # Run a few control cycles
    for cycle in range(5):
        print(f"Cycle {cycle + 1}:")
        controller.run_control_cycle()
        time.sleep(0.1)  # Small delay for demo
    
    print("\n--- Sensor Fault Simulation ---")
    # Inject sensor fault
    temp_sensor.inject_fault('disconnected')
    controller.run_control_cycle()
    
    # Clear fault and continue
    temp_sensor.clear_fault()
    controller.run_control_cycle()
    
    print("\n--- Safety Limit Test ---")
    # Simulate dangerous temperature
    temp_sensor.set_simulated_value(45)  # Dangerous temperature
    controller.run_control_cycle()
    
    # Reset and continue
    controller.reset_emergency()
    temp_sensor.set_simulated_value(22)  # Normal temperature
    controller.run_control_cycle()
    
    print("\n--- System Diagnostics ---")
    system_ok = controller.device_manager.run_diagnostics()
    print(f"Final system status: {'OK' if system_ok else 'ERRORS'}")

demo_environmental_system()

```

## Try it

/// details | Exercise 1: Device Interface Design
    type: question
    open: false

Design abstract interfaces for a `LightSensor` and `LEDActuator`. Your interfaces should include:

- Methods for reading light levels and setting LED brightness

- Status checking and error handling

- Units and ranges

Then create concrete implementations that simulate the devices.

/// details | Sample Solution
    type: success
    open: false

```python
class LightSensor(Sensor):
    """Light sensor interface"""
    
    def __init__(self, name: str):
        super().__init__(name)
        self.light_level = 50  # Simulated lux value
    
    def read_value(self) -> float:
        """Read light level in lux"""
        if not self.is_connected:
            raise RuntimeError(f"Light sensor {self.name} disconnected")
        
        # Simulate light reading with some variation
        variation = random.uniform(-5, 5)
        self.light_level = max(0, min(1000, self.light_level + variation))
        self.last_reading_time = time.time()
        return self.light_level
    
    def get_units(self) -> str:
        return "lux"

class LEDActuator(Actuator):
    """LED actuator interface"""
    
    def __init__(self, name: str):
        super().__init__(name)
        self.brightness = 0  # 0-100%
    
    def set_output(self, brightness: float) -> bool:
        """Set LED brightness (0-100%)"""
        if not self.is_enabled:
            return False
        
        brightness = max(0, min(100, brightness))
        self.brightness = brightness
        self.current_command = brightness
        self.last_command_time = time.time()
        
        print(f"{self.name}: Brightness set to {brightness:.1f}%")
        return True
    
    def get_output_range(self) -> tuple:
        return (0, 100)
    
    def get_brightness(self) -> float:
        return self.brightness

```

///
///

/// details | Exercise 2: Test Harness Development
    type: question
    open: false

Create a test harness for a simple line-following robot with:

- Two light sensors (left and right)

- Two motors (left and right wheels)

- Test scenarios for normal operation, sensor failure, and motor failure

/// details | Sample Solution
    type: success
    open: false

```python
class LineFollowingRobot:
    """Simple line following robot"""
    
    def __init__(self, device_manager: DeviceManager):
        self.device_manager = device_manager
        self.base_speed = 50  # Base motor speed
    
    def follow_line(self):
        """Basic line following algorithm"""
        readings = self.device_manager.read_all_sensors()
        
        left_light = readings.get("Left Light", 0)
        right_light = readings.get("Right Light", 0)
        
        if left_light is None or right_light is None:
            # Sensor failure - stop
            self.device_manager.set_actuator("Left Motor", 0)
            self.device_manager.set_actuator("Right Motor", 0)
            return "SENSOR_ERROR"
        
        # Calculate steering based on light difference
        light_diff = left_light - right_light
        
        left_speed = self.base_speed - light_diff
        right_speed = self.base_speed + light_diff
        
        # Apply speeds
        left_ok = self.device_manager.set_actuator("Left Motor", left_speed)
        right_ok = self.device_manager.set_actuator("Right Motor", right_speed)
        
        if not (left_ok and right_ok):
            return "MOTOR_ERROR"
        
        return "FOLLOWING"

def test_line_following():
    """Test the line following robot"""
    harness = TestHarness()
    
    # Create test devices
    left_sensor = harness.create_mock_sensor("Left Light", (0, 100), "lux")
    right_sensor = harness.create_mock_sensor("Right Light", (0, 100), "lux")
    left_motor = harness.create_mock_actuator("Left Motor", (0, 100))
    right_motor = harness.create_mock_actuator("Right Motor", (0, 100))
    
    # Set up robot
    manager = DeviceManager()
    manager.add_sensor(left_sensor)
    manager.add_sensor(right_sensor)
    manager.add_actuator(left_motor)
    manager.add_actuator(right_motor)
    
    robot = LineFollowingRobot(manager)
    
    def test_straight_line():
        # Equal light on both sensors - should go straight
        left_sensor.set_simulated_value(50)
        right_sensor.set_simulated_value(50)
        status = robot.follow_line()
        assert status == "FOLLOWING"
    
    def test_turn_left():
        # More light on right - should turn left
        left_sensor.set_simulated_value(30)
        right_sensor.set_simulated_value(70)
        status = robot.follow_line()
        assert status == "FOLLOWING"
    
    def test_sensor_failure():
        left_sensor.inject_fault('disconnected')
        status = robot.follow_line()
        assert status == "SENSOR_ERROR"
    
    harness.run_test_scenario("Straight Line", test_straight_line)
    harness.run_test_scenario("Turn Left", test_turn_left)
    harness.run_test_scenario("Sensor Failure", test_sensor_failure)
    harness.print_test_summary()

test_line_following()

```

///
///

/// details | Exercise 3: System Integration
    type: question
    open: false

Integrate the environmental controller with additional safety features:

- Add a smoke detector sensor

- Add an emergency ventilation actuator

- Modify the safety check to handle smoke detection

- Test the complete emergency response

/// details | Sample Solution
    type: success
    open: false

```python
class SmokeSensor(MockSensor):
    """Smoke detector sensor"""
    
    def __init__(self, name: str):
        super().__init__(name, (0, 1), "alarm")  # 0 = no smoke, 1 = smoke
        self.set_simulated_value(0)  # Start with no smoke
    
    def is_smoke_detected(self) -> bool:
        """Check if smoke is detected"""
        return self.read_value() > 0.5

class EmergencyVentilation(MockActuator):
    """Emergency ventilation system"""
    
    def __init__(self, name: str):
        super().__init__(name, (0, 1))  # 0 = off, 1 = on
    
    def activate_emergency(self):
        """Activate emergency ventilation"""
        return self.set_output(1)

# Enhanced environmental controller
class SafeEnvironmentalController(EnvironmentalController):
    """Environmental controller with enhanced safety features"""
    
    def setup_safety_devices(self):
        """Add safety devices to the system"""
        smoke_sensor = SmokeSensor("Smoke Detector")
        emergency_vent = EmergencyVentilation("Emergency Ventilation")
        
        self.device_manager.add_sensor(smoke_sensor)
        self.device_manager.add_actuator(emergency_vent)
    
    def check_safety_limits(self, readings: Dict[str, float]) -> bool:
        """Enhanced safety check including smoke detection"""
        # Check original safety limits
        if not super().check_safety_limits(readings):
            return False
        
        # Check for smoke
        if readings.get("Smoke Detector") is not None:
            smoke_level = readings["Smoke Detector"]
            if smoke_level > 0.5:
                print("FIRE ALERT: Smoke detected! Activating emergency ventilation!")
                self.device_manager.set_actuator("Emergency Ventilation", 1)
                return False
        
        return True

# Test the enhanced system
def test_enhanced_safety():
    """Test enhanced safety features"""
    controller = SafeEnvironmentalController()
    controller.setup_devices(use_mock_devices=True)
    controller.setup_safety_devices()
    
    # Get smoke sensor for testing
    smoke_sensor = controller.device_manager.sensors["Smoke Detector"]
    
    print("Testing enhanced safety system...")
    
    # Normal operation
    controller.run_control_cycle()
    
    # Simulate smoke detection
    print("\nSimulating smoke detection...")
    smoke_sensor.set_simulated_value(1.0)  # Smoke detected
    controller.run_control_cycle()
    
    print("Enhanced safety test complete")

test_enhanced_safety()

```

///
///


## Recap

Successful mechatronic system integration requires three key components: interface abstractions that provide consistent ways to interact with diverse hardware, device managers that coordinate multiple components and handle errors gracefully, and test harnesses that enable development and validation without physical hardware.

Key principles:

- **Abstract interfaces**: Hide device complexity behind standard operations

- **Device managers**: Coordinate multiple devices and handle system-level concerns  

- **Test harnesses**: Enable testing with simulated devices and fault injection

- **Error handling**: Graceful degradation when components fail

- **Modularity**: Easily swap components without changing control logic

These patterns make mechatronic systems more reliable, maintainable, and testable. They separate hardware concerns from control logic, making it easier to develop complex systems incrementally.

See also [10.5 Unit tests for subsystems](../Section-05-Unit-tests-subsystems/index.md) for comprehensive testing strategies and [9.4 Mechanical constraints and subsystem composition](../../Chapter-09-Control-algorithms/Section-04-Mechanical-constraints-and-subsystem-composition/index.md) for understanding how to compose multiple subsystems effectively.







