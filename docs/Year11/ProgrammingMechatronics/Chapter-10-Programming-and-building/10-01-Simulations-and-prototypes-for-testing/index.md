---
title: "10.1 Simulations and prototypes for testing"
---

# 10.1 Simulations and prototypes for testing

## Why it matters

Building and testing mechatronic systems with real hardware is expensive, time-consuming, and sometimes dangerous. A faulty control algorithm could damage expensive motors, or incorrect sensor handling might cause a robotic arm to move unpredictably. Simulation allows you to develop, test, and refine your control logic safely before connecting to real devices.

Python simulations are particularly valuable in mechatronics because they let you model sensor behaviour, test control algorithms, and validate system responses without physical hardware. You can simulate everything from simple temperature sensors to complex multi-axis robotic systems, allowing rapid prototyping and iterative development.

Professional mechatronic engineers routinely use simulation for system design, testing edge cases, and training operators. The simulation skills you develop here form the foundation for advanced tools like MATLAB/Simulink, ROS (Robot Operating System), and dedicated mechatronic simulation platforms.

## Concepts

### Sensor simulation fundamentals

Sensor simulation involves creating Python functions or classes that mimic the behaviour of real sensors. This includes not only the basic measurement function, but also realistic characteristics like noise, drift, response time, and measurement ranges.

Real sensors have limitations and quirks that affect system design:

```python
import random
import time
import math

class TemperatureSensor:
    def __init__(self, sensor_id, base_temp=20.0):
        self.sensor_id = sensor_id
        self.base_temp = base_temp
        self.noise_level = 0.2  # ±0.2°C noise
        self.drift_rate = 0.01  # 0.01°C per reading drift
        self.reading_count = 0
        
    def read_temperature(self):
        """Simulate realistic temperature sensor reading"""
        # Add random noise
        noise = random.uniform(-self.noise_level, self.noise_level)
        
        # Add cumulative drift
        drift = self.drift_rate * self.reading_count
        
        # Calculate reading
        reading = self.base_temp + noise + drift
        self.reading_count += 1
        
        # Simulate sensor response delay
        time.sleep(0.1)  # 100ms response time
        
        return round(reading, 1)
    
    def calibrate(self, known_temp):
        """Reset drift by calibrating to known temperature"""
        self.base_temp = known_temp
        self.reading_count = 0
        print(f"Sensor {self.sensor_id} calibrated to {known_temp}°C")

# Test the sensor simulation
temp_sensor = TemperatureSensor("TEMP_01", 22.5)

print("Temperature readings over time:")
for i in range(5):
    temp = temp_sensor.read_temperature()
    print(f"Reading {i+1}: {temp}°C")

```

Key aspects of realistic sensor simulation:

- **Noise**: Random variations in readings due to electrical interference

- **Drift**: Gradual change in sensor calibration over time

- **Response time**: Delay between measurement request and result

- **Range limits**: Sensors have minimum and maximum measurable values

- **Resolution**: Sensors can only measure to a certain precision

### Actuator simulation patterns

Actuator simulation models how motors, servos, and other output devices respond to control signals. Unlike sensors (which provide data), actuators change the physical world, so simulation must track position, velocity, and state changes over time.

```python
import math
import time

class ServoMotor:
    def __init__(self, servo_id, initial_angle=0):
        self.servo_id = servo_id
        self.current_angle = initial_angle
        self.target_angle = initial_angle
        self.max_speed = 180  # degrees per second
        self.resolution = 1   # 1 degree precision
        self.moving = False
        
    def set_angle(self, target_angle):
        """Command servo to move to target angle"""
        # Clamp to valid servo range (0-180 degrees)
        target_angle = max(0, min(180, target_angle))
        
        if abs(target_angle - self.current_angle) > self.resolution:
            self.target_angle = target_angle
            self.moving = True
            print(f"Servo {self.servo_id}: Moving to {target_angle}°")
        else:
            print(f"Servo {self.servo_id}: Already at target position")
    
    def update(self, dt):
        """Update servo position based on elapsed time"""
        if not self.moving:
            return
        
        # Calculate how far we can move in this time step
        max_movement = self.max_speed * dt
        
        # Calculate required movement
        angle_diff = self.target_angle - self.current_angle
        
        if abs(angle_diff) <= max_movement:
            # We can reach the target this step
            self.current_angle = self.target_angle
            self.moving = False
            print(f"Servo {self.servo_id}: Reached target {self.target_angle}°")
        else:
            # Move as far as possible toward target
            direction = 1 if angle_diff > 0 else -1
            self.current_angle += direction * max_movement
            print(f"Servo {self.servo_id}: Moving... now at {self.current_angle:.1f}°")
    
    def get_angle(self):
        """Get current servo angle"""
        return round(self.current_angle, 1)
    
    def is_moving(self):
        """Check if servo is currently moving"""
        return self.moving

# Test servo simulation
servo = ServoMotor("SERVO_01", 90)
servo.set_angle(45)

# Simulate time passing
for step in range(10):
    servo.update(0.1)  # 100ms time steps
    if not servo.is_moving():
        break
    time.sleep(0.1)

```

Essential features of actuator simulation:

- **State tracking**: Current position, velocity, and target values

- **Movement constraints**: Speed limits, acceleration curves, range limits

- **Time-based updates**: Position changes over time, not instantly

- **Feedback**: Status information about movement completion

- **Realistic delays**: Motors take time to reach target positions

### System integration simulation

Real mechatronic systems involve multiple sensors and actuators working together. System simulation combines individual component simulations into coordinated behaviour, often with feedback loops where sensor readings influence actuator commands.

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

class SystemSimulation {
    - sensors: dict
    - actuators: dict
    - control_loop_active: bool
    + add_sensor(sensor): void
    + add_actuator(actuator): void
    + run_control_loop(): void
    + step_simulation(dt): void
}

class SensorInterface {
    <<abstract>>
    + read_value(): float
    + get_sensor_id(): string
}

class ActuatorInterface {
    <<abstract>>
    + set_command(value): void
    + update(dt): void
    + get_status(): dict
}

class TemperatureSensor {
    - base_temp: float
    - noise_level: float
    + read_value(): float
}

class HeatingElement {
    - power_level: float
    - max_power: float
    + set_power(power): void
    + update(dt): void
    + get_heat_output(): float
}

SystemSimulation --> SensorInterface : manages
SystemSimulation --> ActuatorInterface : manages
TemperatureSensor ..|> SensorInterface
HeatingElement ..|> ActuatorInterface

note right of SystemSimulation : Coordinates all components\nand runs control loops
@enduml

```

Here's a practical example - a temperature control system:

```python
import time
import threading
from datetime import datetime

class TemperatureControlSystem:
    def __init__(self):
        self.temperature_sensor = TemperatureSensor("TEMP_01", 20.0)
        self.heating_element = HeatingElement("HEAT_01")
        self.target_temperature = 25.0
        self.control_active = False
        self.data_log = []
        
    def start_control_loop(self):
        """Start the temperature control system"""
        self.control_active = True
        control_thread = threading.Thread(target=self._control_loop)
        control_thread.daemon = True
        control_thread.start()
        print("Temperature control system started")
    
    def stop_control_loop(self):
        """Stop the temperature control system"""
        self.control_active = False
        self.heating_element.set_power(0)
        print("Temperature control system stopped")
    
    def set_target_temperature(self, target):
        """Set the desired temperature"""
        self.target_temperature = target
        print(f"Target temperature set to {target}°C")
    
    def _control_loop(self):
        """Main control loop - runs in separate thread"""
        while self.control_active:
            # Read current temperature
            current_temp = self.temperature_sensor.read_temperature()
            
            # Simple proportional control
            error = self.target_temperature - current_temp
            
            # Calculate heating power (0-100%)
            if error > 0:
                # Need heating
                power = min(100, error * 20)  # 20% power per degree error
            else:
                # Too hot or at target
                power = 0
            
            # Apply heating
            self.heating_element.set_power(power)
            
            # Log data
            self.data_log.append({
                'timestamp': datetime.now(),
                'temperature': current_temp,
                'target': self.target_temperature,
                'heating_power': power,
                'error': error
            })
            
            # Update heating element simulation
            self.heating_element.update(1.0)  # 1 second update
            
            # Add heat to environment (affects sensor)
            heat_added = self.heating_element.get_heat_output()
            self.temperature_sensor.base_temp += heat_added * 0.1
            
            print(f"Temp: {current_temp}°C, Target: {self.target_temperature}°C, "
                  f"Error: {error:+.1f}°C, Power: {power:.0f}%")
            
            time.sleep(1)  # Control loop period

class HeatingElement:
    def __init__(self, element_id):
        self.element_id = element_id
        self.power_level = 0.0  # 0-100%
        self.max_heat_output = 2.0  # degrees per second at 100% power
        
    def set_power(self, power_percent):
        """Set heating power as percentage (0-100)"""
        self.power_level = max(0, min(100, power_percent))
    
    def update(self, dt):
        """Update heating element state"""
        # In real system, this might include heating lag, efficiency curves, etc.
        pass
    
    def get_heat_output(self):
        """Calculate current heat output"""
        return (self.power_level / 100.0) * self.max_heat_output

# Demonstration
control_system = TemperatureControlSystem()
control_system.start_control_loop()

# Let it run for a few control cycles
time.sleep(10)

# Change target temperature
control_system.set_target_temperature(30.0)
time.sleep(10)

control_system.stop_control_loop()

```

### Guided example: robotic arm simulation

Let's build a comprehensive simulation of a simple 2-axis robotic arm. This example demonstrates how to combine multiple actuators with position feedback and coordinate system transformations.

```python
import math
import matplotlib.pyplot as plt

class RoboticArm:
    def __init__(self):
        # Arm geometry
        self.link1_length = 100  # mm
        self.link2_length = 80   # mm
        
        # Joint servos
        self.joint1 = ServoMotor("JOINT_1", 90)  # Base rotation
        self.joint2 = ServoMotor("JOINT_2", 45)  # Elbow angle
        
        # End effector position
        self.end_x = 0
        self.end_y = 0
        
        self._update_end_position()
    
    def move_to_angles(self, joint1_angle, joint2_angle):
        """Command arm to move to specific joint angles"""
        print(f"Moving arm to angles: J1={joint1_angle}°, J2={joint2_angle}°")
        self.joint1.set_angle(joint1_angle)
        self.joint2.set_angle(joint2_angle)
    
    def move_to_position(self, target_x, target_y):
        """Move end effector to target X,Y position using inverse kinematics"""
        # Calculate required joint angles
        angles = self._inverse_kinematics(target_x, target_y)
        
        if angles:
            joint1_angle, joint2_angle = angles
            print(f"Moving to position ({target_x}, {target_y})")
            self.move_to_angles(joint1_angle, joint2_angle)
        else:
            print(f"Position ({target_x}, {target_y}) is unreachable")
    
    def update(self, dt):
        """Update arm simulation"""
        # Update joint positions
        self.joint1.update(dt)
        self.joint2.update(dt)
        
        # Recalculate end effector position
        self._update_end_position()
    
    def _update_end_position(self):
        """Calculate end effector position from joint angles (forward kinematics)"""
        j1_rad = math.radians(self.joint1.get_angle())
        j2_rad = math.radians(self.joint2.get_angle())
        
        # Position of elbow joint
        elbow_x = self.link1_length * math.cos(j1_rad)
        elbow_y = self.link1_length * math.sin(j1_rad)
        
        # Position of end effector
        self.end_x = elbow_x + self.link2_length * math.cos(j1_rad + j2_rad)
        self.end_y = elbow_y + self.link2_length * math.sin(j1_rad + j2_rad)
    
    def _inverse_kinematics(self, target_x, target_y):
        """Calculate joint angles needed to reach target position"""
        # Distance from base to target
        distance = math.sqrt(target_x**2 + target_y**2)
        
        # Check if target is reachable
        max_reach = self.link1_length + self.link2_length
        min_reach = abs(self.link1_length - self.link2_length)
        
        if distance > max_reach or distance < min_reach:
            return None  # Unreachable
        
        # Calculate joint angles using law of cosines
        cos_j2 = (distance**2 - self.link1_length**2 - self.link2_length**2) / (2 * self.link1_length * self.link2_length)
        j2_rad = math.acos(cos_j2)
        
        # Calculate j1 angle
        angle_to_target = math.atan2(target_y, target_x)
        angle_correction = math.atan2(self.link2_length * math.sin(j2_rad), 
                                     self.link1_length + self.link2_length * math.cos(j2_rad))
        j1_rad = angle_to_target - angle_correction
        
        # Convert to degrees
        j1_deg = math.degrees(j1_rad)
        j2_deg = math.degrees(j2_rad)
        
        return (j1_deg, j2_deg)
    
    def get_status(self):
        """Get current arm status"""
        return {
            'joint1_angle': self.joint1.get_angle(),
            'joint2_angle': self.joint2.get_angle(),
            'end_x': round(self.end_x, 1),
            'end_y': round(self.end_y, 1),
            'moving': self.joint1.is_moving() or self.joint2.is_moving()
        }
    
    def plot_arm(self):
        """Visualize current arm position"""
        j1_rad = math.radians(self.joint1.get_angle())
        j2_rad = math.radians(self.joint2.get_angle())
        
        # Calculate joint positions
        base_x, base_y = 0, 0
        elbow_x = self.link1_length * math.cos(j1_rad)
        elbow_y = self.link1_length * math.sin(j1_rad)
        
        # Plot arm segments
        plt.figure(figsize=(8, 6))
        plt.plot([base_x, elbow_x], [base_y, elbow_y], 'b-', linewidth=3, label='Link 1')
        plt.plot([elbow_x, self.end_x], [elbow_y, self.end_y], 'r-', linewidth=3, label='Link 2')
        
        # Plot joints
        plt.plot(base_x, base_y, 'ko', markersize=8, label='Base')
        plt.plot(elbow_x, elbow_y, 'go', markersize=6, label='Elbow')
        plt.plot(self.end_x, self.end_y, 'ro', markersize=6, label='End Effector')
        
        # Plot workspace circle
        circle = plt.Circle((0, 0), self.link1_length + self.link2_length, 
                           fill=False, linestyle='--', alpha=0.3)
        plt.gca().add_patch(circle)
        
        plt.grid(True, alpha=0.3)
        plt.axis('equal')
        plt.legend()
        plt.title(f'Robotic Arm Position\nJ1: {self.joint1.get_angle():.1f}°, J2: {self.joint2.get_angle():.1f}°')
        plt.xlabel('X Position (mm)')
        plt.ylabel('Y Position (mm)')
        plt.show()

# Demonstration
arm = RoboticArm()

# Test sequence: move to different positions
test_positions = [
    (150, 50),   # Reachable position
    (100, 100),  # Reachable position
    (0, 180),    # Maximum reach
    (250, 100),  # Unreachable position
]

for target_x, target_y in test_positions:
    print(f"\n--- Moving to ({target_x}, {target_y}) ---")
    arm.move_to_position(target_x, target_y)
    
    # Simulate movement
    for step in range(20):
        arm.update(0.1)
        status = arm.get_status()
        
        if not status['moving']:
            print(f"Movement complete. End effector at ({status['end_x']}, {status['end_y']})")
            break
        
        time.sleep(0.1)
    
    # Uncomment to show arm position plot
    # arm.plot_arm()

```

## Try it

### Exercise 1: Multi-sensor environment simulation

Create a comprehensive environmental monitoring simulation that combines multiple sensor types with realistic behaviour patterns.

/// details | Task requirements
    type: question
    open: false

Build a greenhouse environment simulator that includes:

1. Temperature sensor with seasonal and daily temperature cycles

2. Humidity sensor that correlates with temperature changes

3. Light sensor that follows day/night cycles and weather patterns

4. Soil moisture sensors that decrease over time and increase with watering events

5. A weather system that affects all sensors (rain, clouds, sunny periods)

/// details | Sample solution
    type: success
    open: false

```python
import math
import random
import time
from datetime import datetime, timedelta

class EnvironmentSimulator:
    def __init__(self):
        self.start_time = datetime.now()
        self.current_time = self.start_time
        
        # Environmental state
        self.weather_state = "sunny"  # sunny, cloudy, rainy
        self.weather_change_timer = 0
        
        # Sensors
        self.temp_sensor = AdvancedTemperatureSensor()
        self.humidity_sensor = HumiditySensor()
        self.light_sensor = LightSensor()
        self.soil_sensors = [
            SoilMoistureSensor(f"SOIL_{i+1}") for i in range(3)
        ]
        
        self.watering_system = WateringSystem()
        
    def step_simulation(self, dt_minutes=1):
        """Advance simulation by dt_minutes"""
        self.current_time += timedelta(minutes=dt_minutes)
        
        # Update weather system
        self._update_weather(dt_minutes)
        
        # Calculate environmental conditions
        base_temp = self._calculate_base_temperature()
        light_level = self._calculate_light_level()
        humidity_level = self._calculate_humidity(base_temp)
        
        # Update sensors
        self.temp_sensor.update_environment(base_temp, self.weather_state)
        self.humidity_sensor.update_environment(humidity_level, self.weather_state)
        self.light_sensor.update_environment(light_level, self.weather_state)
        
        # Update soil moisture
        for soil_sensor in self.soil_sensors:
            # Moisture decreases over time
            soil_sensor.evaporate(dt_minutes)
            
            # Rain adds moisture
            if self.weather_state == "rainy":
                soil_sensor.add_water(random.uniform(0.5, 2.0))
        
        return self._get_all_readings()
    
    def _update_weather(self, dt_minutes):
        """Update weather state"""
        self.weather_change_timer += dt_minutes
        
        # Weather changes every 30-120 minutes
        if self.weather_change_timer > random.uniform(30, 120):
            weather_options = ["sunny", "cloudy", "rainy"]
            self.weather_state = random.choice(weather_options)
            self.weather_change_timer = 0
            print(f"Weather changed to: {self.weather_state}")
    
    def _calculate_base_temperature(self):
        """Calculate base temperature with daily and seasonal cycles"""
        # Time since start (in hours)
        elapsed = (self.current_time - self.start_time).total_seconds() / 3600
        
        # Daily cycle (24 hour period)
        daily_temp = 5 * math.sin(2 * math.pi * elapsed / 24 - math.pi/2)
        
        # Seasonal variation (approximate)
        seasonal_temp = 10 * math.sin(2 * math.pi * elapsed / (24 * 365))
        
        base_temp = 20 + daily_temp + seasonal_temp
        
        # Weather modifications
        if self.weather_state == "cloudy":
            base_temp -= 2
        elif self.weather_state == "rainy":
            base_temp -= 5
        
        return base_temp
    
    def _calculate_light_level(self):
        """Calculate light level based on time and weather"""
        elapsed_hours = (self.current_time - self.start_time).total_seconds() / 3600
        hour_of_day = (elapsed_hours % 24)
        
        if 6 <= hour_of_day <= 18:  # Daytime
            # Bell curve for daylight
            daylight_factor = math.exp(-((hour_of_day - 12) / 4) ** 2)
            base_light = 50000 * daylight_factor  # Max 50,000 lux
        else:  # Nighttime
            base_light = 50  # Moonlight/artificial lighting
        
        # Weather effects
        if self.weather_state == "cloudy":
            base_light *= 0.3
        elif self.weather_state == "rainy":
            base_light *= 0.1
        
        return base_light
    
    def _calculate_humidity(self, temperature):
        """Calculate humidity based on temperature and weather"""
        # Higher temperatures generally mean lower relative humidity
        base_humidity = 80 - (temperature - 20) * 2
        
        # Weather effects
        if self.weather_state == "rainy":
            base_humidity = min(95, base_humidity + 20)
        elif self.weather_state == "sunny":
            base_humidity = max(30, base_humidity - 10)
        
        return max(20, min(100, base_humidity))
    
    def water_plants(self, zone=None):
        """Trigger watering system"""
        if zone is None:
            # Water all zones
            for i, soil_sensor in enumerate(self.soil_sensors):
                water_amount = random.uniform(10, 20)
                soil_sensor.add_water(water_amount)
                print(f"Watered zone {i+1}: +{water_amount:.1f}% moisture")
        else:
            # Water specific zone
            if 0 <= zone < len(self.soil_sensors):
                water_amount = random.uniform(10, 20)
                self.soil_sensors[zone].add_water(water_amount)
                print(f"Watered zone {zone+1}: +{water_amount:.1f}% moisture")
    
    def _get_all_readings(self):
        """Get readings from all sensors"""
        readings = {
            'timestamp': self.current_time,
            'weather': self.weather_state,
            'temperature': self.temp_sensor.read_temperature(),
            'humidity': self.humidity_sensor.read_humidity(),
            'light': self.light_sensor.read_light(),
            'soil_moisture': [sensor.read_moisture() for sensor in self.soil_sensors]
        }
        return readings

class AdvancedTemperatureSensor(TemperatureSensor):
    def update_environment(self, base_temp, weather):
        self.base_temp = base_temp
        
        # Weather affects sensor readings
        if weather == "rainy":
            self.noise_level = 0.5  # More noise in wet conditions
        else:
            self.noise_level = 0.2

class HumiditySensor:
    def __init__(self):
        self.base_humidity = 60.0
        self.noise_level = 2.0
        
    def update_environment(self, base_humidity, weather):
        self.base_humidity = base_humidity
    
    def read_humidity(self):
        noise = random.uniform(-self.noise_level, self.noise_level)
        reading = self.base_humidity + noise
        return max(0, min(100, round(reading, 1)))

class LightSensor:
    def __init__(self):
        self.base_light = 1000.0
        self.noise_level = 50.0
        
    def update_environment(self, base_light, weather):
        self.base_light = base_light
    
    def read_light(self):
        noise = random.uniform(-self.noise_level, self.noise_level)
        reading = self.base_light + noise
        return max(0, round(reading, 0))

class SoilMoistureSensor:
    def __init__(self, sensor_id):
        self.sensor_id = sensor_id
        self.moisture_level = 50.0  # Start at 50%
        self.evaporation_rate = 0.2  # % per minute
        
    def evaporate(self, dt_minutes):
        """Moisture decreases over time"""
        self.moisture_level -= self.evaporation_rate * dt_minutes
        self.moisture_level = max(0, self.moisture_level)
    
    def add_water(self, amount):
        """Add water to soil"""
        self.moisture_level += amount
        self.moisture_level = min(100, self.moisture_level)
    
    def read_moisture(self):
        noise = random.uniform(-1.0, 1.0)
        reading = self.moisture_level + noise
        return max(0, min(100, round(reading, 1)))

class WateringSystem:
    def __init__(self):
        self.last_watering = None
    
    def should_water(self, soil_readings):
        """Determine if watering is needed"""
        avg_moisture = sum(soil_readings) / len(soil_readings)
        return avg_moisture < 30  # Water if average below 30%

# Run simulation
simulator = EnvironmentSimulator()

print("Starting greenhouse environment simulation...")
print("=" * 60)

for hour in range(48):  # Run for 48 hours
    readings = simulator.step_simulation(60)  # 1 hour steps
    
    # Check if watering is needed
    watering_system = WateringSystem()
    if watering_system.should_water(readings['soil_moisture']):
        simulator.water_plants()
    
    # Print hourly summary
    print(f"Hour {hour+1:2d} | {readings['weather']:6} | "
          f"Temp: {readings['temperature']:5.1f}°C | "
          f"Humidity: {readings['humidity']:5.1f}% | "
          f"Light: {readings['light']:8.0f} lux | "
          f"Soil: {readings['soil_moisture'][0]:5.1f}%")
    
    time.sleep(0.1)  # Brief pause for readability

```

///
///

### Exercise 2: Actuator coordination simulation

Build a simulation of a pick-and-place robot that coordinates multiple actuators to perform complex tasks.

/// details | Task requirements
    type: question
    open: false

Create a pick-and-place robot simulation with:

1. A 2-axis robotic arm (base rotation and reach extension)

2. A gripper actuator (open/close with pressure feedback)

3. A conveyor belt actuator (variable speed control)

4. Coordinate system transforms between robot base and conveyor

5. A complete pick-and-place sequence with error checking

/// details | Sample solution
    type: success
    open: false

```python
import math
import time
import random

class PickAndPlaceRobot:
    def __init__(self):
        # Robot components
        self.base_servo = ServoMotor("BASE", 0)      # 0-360° rotation
        self.reach_actuator = LinearActuator("REACH", 200)  # 100-300mm reach
        self.gripper = GripperActuator("GRIPPER")
        self.conveyor = ConveyorBelt("CONVEYOR")
        
        # Robot geometry
        self.base_height = 100  # mm above conveyor
        self.gripper_offset = 50  # mm from reach actuator center
        
        # Current robot state
        self.current_x = 0
        self.current_y = 0
        self.current_z = self.base_height
        self.holding_object = False
        
        # Task sequence state
        self.task_active = False
        self.task_step = 0
        
    def move_to_position(self, x, y, z=None):
        """Move robot end effector to target position"""
        if z is None:
            z = self.base_height  # Default height
        
        # Convert Cartesian to polar coordinates
        distance_2d = math.sqrt(x**2 + y**2)
        angle = math.degrees(math.atan2(y, x))
        
        # Check if position is reachable
        if not self._is_reachable(distance_2d, z):
            print(f"Position ({x}, {y}, {z}) is not reachable")
            return False
        
        # Calculate required actuator positions
        required_reach = distance_2d - self.gripper_offset
        required_angle = angle % 360
        
        # Command actuators
        print(f"Moving to position ({x}, {y}, {z})")
        self.base_servo.set_angle(required_angle)
        self.reach_actuator.set_position(required_reach)
        
        return True
    
    def _is_reachable(self, distance_2d, z):
        """Check if position is within robot workspace"""
        min_reach = self.reach_actuator.min_position + self.gripper_offset
        max_reach = self.reach_actuator.max_position + self.gripper_offset
        
        if distance_2d < min_reach or distance_2d > max_reach:
            return False
        
        if z < 0 or z > self.base_height + 100:  # Height limits
            return False
        
        return True
    
    def pick_object(self, x, y):
        """Execute pick sequence at specified location"""
        print(f"Starting pick sequence at ({x}, {y})")
        
        # Step 1: Move above target
        if not self.move_to_position(x, y, self.base_height + 50):
            return False
        
        self._wait_for_movement()
        
        # Step 2: Open gripper
        self.gripper.open_gripper()
        time.sleep(1)
        
        # Step 3: Lower to pick height
        if not self.move_to_position(x, y, 10):  # 10mm above conveyor
            return False
        
        self._wait_for_movement()
        
        # Step 4: Close gripper
        success = self.gripper.close_gripper()
        if success:
            self.holding_object = True
            print("Object picked successfully")
        else:
            print("Failed to pick object")
            return False
        
        # Step 5: Lift object
        self.move_to_position(x, y, self.base_height + 50)
        self._wait_for_movement()
        
        return True
    
    def place_object(self, x, y):
        """Execute place sequence at specified location"""
        if not self.holding_object:
            print("No object to place")
            return False
        
        print(f"Starting place sequence at ({x}, {y})")
        
        # Step 1: Move above target
        if not self.move_to_position(x, y, self.base_height + 50):
            return False
        
        self._wait_for_movement()
        
        # Step 2: Lower to place height
        if not self.move_to_position(x, y, 20):  # 20mm above conveyor
            return False
        
        self._wait_for_movement()
        
        # Step 3: Open gripper
        self.gripper.open_gripper()
        self.holding_object = False
        print("Object placed successfully")
        
        # Step 4: Retract
        self.move_to_position(x, y, self.base_height + 50)
        self._wait_for_movement()
        
        return True
    
    def _wait_for_movement(self):
        """Wait for all actuators to reach target positions"""
        while (self.base_servo.is_moving() or 
               self.reach_actuator.is_moving()):
            self.update_robot(0.1)
            time.sleep(0.1)
    
    def update_robot(self, dt):
        """Update all robot actuators"""
        self.base_servo.update(dt)
        self.reach_actuator.update(dt)
        self.gripper.update(dt)
        self.conveyor.update(dt)
        
        # Update current position
        self._calculate_current_position()
    
    def _calculate_current_position(self):
        """Calculate current end effector position"""
        angle_rad = math.radians(self.base_servo.get_angle())
        total_reach = self.reach_actuator.get_position() + self.gripper_offset
        
        self.current_x = total_reach * math.cos(angle_rad)
        self.current_y = total_reach * math.sin(angle_rad)
    
    def run_pick_and_place_cycle(self, pick_locations, place_locations):
        """Run complete pick and place cycle"""
        print("Starting pick and place cycle")
        
        for i, (pick_pos, place_pos) in enumerate(zip(pick_locations, place_locations)):
            print(f"\n--- Cycle {i+1} ---")
            
            # Move conveyor to position object
            self.conveyor.run_forward(2.0)  # Run for 2 seconds
            time.sleep(3)
            self.conveyor.stop()
            
            # Pick object
            if self.pick_object(pick_pos[0], pick_pos[1]):
                # Place object
                self.place_object(place_pos[0], place_pos[1])
            
            # Return to home position
            self.move_to_position(0, 200, self.base_height + 50)
            self._wait_for_movement()
        
        print("Pick and place cycle complete")

class LinearActuator:
    def __init__(self, actuator_id, initial_position):
        self.actuator_id = actuator_id
        self.current_position = initial_position
        self.target_position = initial_position
        self.min_position = 100  # mm
        self.max_position = 300  # mm
        self.max_speed = 50      # mm/s
        self.moving = False
    
    def set_position(self, target_position):
        """Command actuator to move to target position"""
        target_position = max(self.min_position, min(self.max_position, target_position))
        
        if abs(target_position - self.current_position) > 1:  # 1mm tolerance
            self.target_position = target_position
            self.moving = True
            print(f"Linear actuator {self.actuator_id}: Moving to {target_position}mm")
    
    def update(self, dt):
        """Update actuator position"""
        if not self.moving:
            return
        
        distance_to_target = self.target_position - self.current_position
        max_movement = self.max_speed * dt
        
        if abs(distance_to_target) <= max_movement:
            self.current_position = self.target_position
            self.moving = False
            print(f"Linear actuator {self.actuator_id}: Reached target {self.target_position}mm")
        else:
            direction = 1 if distance_to_target > 0 else -1
            self.current_position += direction * max_movement
    
    def get_position(self):
        return round(self.current_position, 1)
    
    def is_moving(self):
        return self.moving

class GripperActuator:
    def __init__(self, gripper_id):
        self.gripper_id = gripper_id
        self.is_open = True
        self.grip_pressure = 0  # 0-100%
        self.has_object = False
    
    def open_gripper(self):
        """Open gripper"""
        self.is_open = True
        self.grip_pressure = 0
        self.has_object = False
        print(f"Gripper {self.gripper_id}: Opening")
    
    def close_gripper(self):
        """Close gripper and attempt to grip object"""
        self.is_open = False
        
        # Simulate object detection
        object_present = random.random() > 0.1  # 90% success rate
        
        if object_present:
            self.grip_pressure = random.uniform(30, 80)
            self.has_object = True
            print(f"Gripper {self.gripper_id}: Closed, gripping object (pressure: {self.grip_pressure:.0f}%)")
            return True
        else:
            self.grip_pressure = 100  # Full pressure, no object
            self.has_object = False
            print(f"Gripper {self.gripper_id}: Closed, no object detected")
            return False
    
    def update(self, dt):
        """Update gripper state"""
        pass  # Gripper is instantaneous in this simulation

class ConveyorBelt:
    def __init__(self, belt_id):
        self.belt_id = belt_id
        self.speed = 0  # mm/s
        self.direction = 1  # 1 = forward, -1 = reverse
        self.max_speed = 100  # mm/s
    
    def run_forward(self, speed=None):
        """Start conveyor moving forward"""
        if speed is None:
            speed = self.max_speed * 0.5  # 50% speed default
        
        self.speed = min(speed, self.max_speed)
        self.direction = 1
        print(f"Conveyor {self.belt_id}: Running forward at {self.speed}mm/s")
    
    def run_reverse(self, speed=None):
        """Start conveyor moving reverse"""
        if speed is None:
            speed = self.max_speed * 0.5
        
        self.speed = min(speed, self.max_speed)
        self.direction = -1
        print(f"Conveyor {self.belt_id}: Running reverse at {self.speed}mm/s")
    
    def stop(self):
        """Stop conveyor"""
        self.speed = 0
        print(f"Conveyor {self.belt_id}: Stopped")
    
    def update(self, dt):
        """Update conveyor state"""
        pass  # Position tracking would go here

# Demonstration
robot = PickAndPlaceRobot()

# Define pick and place locations
pick_positions = [(150, 100), (180, 80), (200, 120)]
place_positions = [(100, -150), (120, -150), (140, -150)]

# Run demonstration
robot.run_pick_and_place_cycle(pick_positions, place_positions)

```

///
///

### Exercise 3: Real-time control simulation with visualization

Create a dynamic simulation that shows real-time sensor feedback and actuator response with simple graphical visualization.

/// details | Task requirements
    type: question
    open: false

Build a real-time pendulum balance control system with:

1. A pendulum with physics simulation (gravity, momentum, friction)

2. An angle sensor that measures pendulum position

3. A servo motor that applies corrective torque

4. A PID controller to maintain balance

5. Real-time plotting of angle, control signal, and system performance

/// details | Sample solution
    type: success
    open: false

```python
import math
import time
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from collections import deque
import threading

class PendulumSimulation:
    def __init__(self):
        # Physical parameters
        self.length = 1.0        # Pendulum length (m)
        self.mass = 1.0          # Pendulum mass (kg)
        self.gravity = 9.81      # Gravity (m/s²)
        self.friction = 0.05     # Damping coefficient
        
        # State variables
        self.angle = math.radians(15)  # Initial angle (rad)
        self.angular_velocity = 0      # Initial angular velocity (rad/s)
        
        # Control system
        self.angle_sensor = AngleSensor()
        self.control_motor = ControlMotor()
        self.pid_controller = PIDController(kp=50, ki=5, kd=8)
        
        # Data logging
        self.time_data = deque(maxlen=1000)
        self.angle_data = deque(maxlen=1000)
        self.control_data = deque(maxlen=1000)
        self.target_data = deque(maxlen=1000)
        
        # Simulation control
        self.running = False
        self.start_time = None
    
    def step_physics(self, dt):
        """Update pendulum physics"""
        # Calculate torque from gravity
        gravity_torque = -self.mass * self.gravity * self.length * math.sin(self.angle)
        
        # Calculate control torque from motor
        control_torque = self.control_motor.get_current_torque()
        
        # Calculate friction torque
        friction_torque = -self.friction * self.angular_velocity
        
        # Total torque
        total_torque = gravity_torque + control_torque + friction_torque
        
        # Calculate angular acceleration (τ = I * α, where I = m * L²)
        moment_of_inertia = self.mass * self.length**2
        angular_acceleration = total_torque / moment_of_inertia
        
        # Update velocity and position
        self.angular_velocity += angular_acceleration * dt
        self.angle += self.angular_velocity * dt
        
        # Keep angle in reasonable range for visualization
        while self.angle > math.pi:
            self.angle -= 2 * math.pi
        while self.angle < -math.pi:
            self.angle += 2 * math.pi
    
    def step_control(self, dt):
        """Update control system"""
        # Read sensor
        measured_angle = self.angle_sensor.read_angle(self.angle)
        
        # Calculate control signal
        target_angle = 0  # Try to balance at vertical
        control_signal = self.pid_controller.calculate(target_angle, measured_angle, dt)
        
        # Apply control to motor
        self.control_motor.set_torque(control_signal)
        
        # Log data
        current_time = time.time() - self.start_time
        self.time_data.append(current_time)
        self.angle_data.append(math.degrees(measured_angle))
        self.control_data.append(control_signal)
        self.target_data.append(math.degrees(target_angle))
    
    def run_simulation(self, duration=30):
        """Run simulation for specified duration"""
        self.running = True
        self.start_time = time.time()
        
        dt = 0.01  # 10ms time steps
        
        while self.running and (time.time() - self.start_time) < duration:
            # Update physics
            self.step_physics(dt)
            
            # Update control system
            self.step_control(dt)
            
            # Real-time delay
            time.sleep(dt)
        
        self.running = False
    
    def start_simulation_thread(self):
        """Start simulation in background thread"""
        sim_thread = threading.Thread(target=self.run_simulation)
        sim_thread.daemon = True
        sim_thread.start()
        return sim_thread
    
    def stop_simulation(self):
        """Stop simulation"""
        self.running = False
    
    def get_current_state(self):
        """Get current pendulum state for visualization"""
        return {
            'angle': self.angle,
            'angular_velocity': self.angular_velocity,
            'control_torque': self.control_motor.get_current_torque(),
            'pid_output': self.pid_controller.last_output if hasattr(self.pid_controller, 'last_output') else 0
        }

class AngleSensor:
    def __init__(self):
        self.noise_level = math.radians(0.5)  # ±0.5° noise
        self.resolution = math.radians(0.1)   # 0.1° resolution
    
    def read_angle(self, true_angle):
        """Read angle with realistic sensor characteristics"""
        # Add noise
        noise = random.uniform(-self.noise_level, self.noise_level)
        
        # Apply resolution limit
        measured = true_angle + noise
        quantized = round(measured / self.resolution) * self.resolution
        
        return quantized

class ControlMotor:
    def __init__(self):
        self.max_torque = 10.0  # Maximum torque (N⋅m)
        self.current_torque = 0.0
        self.response_time = 0.05  # 50ms response time
        self.target_torque = 0.0
    
    def set_torque(self, target_torque):
        """Set target torque (with limits)"""
        self.target_torque = max(-self.max_torque, min(self.max_torque, target_torque))
    
    def update(self, dt):
        """Update motor response (first-order lag)"""
        torque_error = self.target_torque - self.current_torque
        self.current_torque += torque_error * (dt / self.response_time)
    
    def get_current_torque(self):
        """Get current motor torque"""
        return self.current_torque

class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain
        
        self.integral = 0
        self.last_error = 0
        self.last_output = 0
    
    def calculate(self, setpoint, measurement, dt):
        """Calculate PID control output"""
        error = setpoint - measurement
        
        # Proportional term
        proportional = self.kp * error
        
        # Integral term
        self.integral += error * dt
        integral_term = self.ki * self.integral
        
        # Derivative term
        derivative = (error - self.last_error) / dt if dt > 0 else 0
        derivative_term = self.kd * derivative
        
        # Calculate output
        output = proportional + integral_term + derivative_term
        
        # Update for next iteration
        self.last_error = error
        self.last_output = output
        
        return output

class PendulumVisualizer:
    def __init__(self, simulation):
        self.simulation = simulation
        
        # Create figure with subplots
        self.fig, (self.ax1, self.ax2) = plt.subplots(1, 2, figsize=(12, 6))
        
        # Pendulum animation subplot
        self.ax1.set_xlim(-1.5, 1.5)
        self.ax1.set_ylim(-1.5, 1.5)
        self.ax1.set_aspect('equal')
        self.ax1.grid(True, alpha=0.3)
        self.ax1.set_title('Pendulum Position')
        
        # Initialize pendulum graphics
        self.pendulum_line, = self.ax1.plot([], [], 'b-', linewidth=3)
        self.pendulum_bob, = self.ax1.plot([], [], 'ro', markersize=15)
        self.pivot_point, = self.ax1.plot([0], [0], 'ko', markersize=10)
        
        # Data plotting subplot
        self.ax2.set_xlim(0, 30)
        self.ax2.set_ylim(-50, 50)
        self.ax2.grid(True, alpha=0.3)
        self.ax2.set_title('Control System Response')
        self.ax2.set_xlabel('Time (s)')
        self.ax2.set_ylabel('Angle (°) / Control Signal')
        
        # Initialize data plots
        self.angle_line, = self.ax2.plot([], [], 'b-', label='Angle', linewidth=2)
        self.control_line, = self.ax2.plot([], [], 'r-', label='Control Signal', linewidth=1)
        self.target_line, = self.ax2.plot([], [], 'g--', label='Target', linewidth=1)
        self.ax2.legend()
    
    def animate(self, frame):
        """Animation update function"""
        if not self.simulation.running:
            return self.pendulum_line, self.pendulum_bob, self.angle_line, self.control_line, self.target_line
        
        state = self.simulation.get_current_state()
        angle = state['angle']
        
        # Update pendulum visualization
        x = self.simulation.length * math.sin(angle)
        y = -self.simulation.length * math.cos(angle)
        
        self.pendulum_line.set_data([0, x], [0, y])
        self.pendulum_bob.set_data([x], [y])
        
        # Update data plots
        if len(self.simulation.time_data) > 0:
            self.angle_line.set_data(list(self.simulation.time_data), list(self.simulation.angle_data))
            self.control_line.set_data(list(self.simulation.time_data), list(self.simulation.control_data))
            self.target_line.set_data(list(self.simulation.time_data), list(self.simulation.target_data))
            
            # Update x-axis limits to follow data
            if self.simulation.time_data[-1] > 30:
                self.ax2.set_xlim(self.simulation.time_data[-1] - 30, self.simulation.time_data[-1])
        
        return self.pendulum_line, self.pendulum_bob, self.angle_line, self.control_line, self.target_line
    
    def start_animation(self):
        """Start real-time animation"""
        ani = animation.FuncAnimation(self.fig, self.animate, interval=50, blit=True)
        plt.show()
        return ani

# Run the simulation
print("Starting pendulum balance control simulation...")
print("The system will try to balance the pendulum at vertical position.")

sim = PendulumSimulation()
visualizer = PendulumVisualizer(sim)

# Start simulation in background
sim_thread = sim.start_simulation_thread()

# Start visualization (this blocks until window is closed)
try:
    ani = visualizer.start_animation()
except KeyboardInterrupt:
    print("Simulation stopped by user")
finally:
    sim.stop_simulation()

print("Simulation complete!")

```

Note: This example requires matplotlib for visualization. For the basic curriculum, you could create a simpler text-based version that prints periodic status updates instead of live plotting.
///
///

## Recap

Simulation and prototyping form the backbone of safe, efficient mechatronic system development. In this section, you learned how to:

- **Model sensor behaviour** with realistic noise, drift, and response characteristics

- **Simulate actuator dynamics** including speed limits, position tracking, and movement coordination

- **Build integrated systems** that combine multiple sensors and actuators with feedback loops

- **Create test harnesses** for validating control algorithms before hardware deployment

- **Implement physics simulations** for dynamic systems like pendulums and robotic arms

Key principles for mechatronic simulation:

1. **Start simple, add complexity gradually** - begin with basic sensor/actuator models, then add realistic behaviour

2. **Include realistic constraints** - speed limits, noise, delays, and range restrictions make simulations valuable

3. **Test edge cases** - simulation lets you safely explore failure modes and extreme conditions

4. **Validate against known results** - verify your simulation matches expected behaviour for simple cases

5. **Design for testability** - structure your code so individual components can be tested in isolation

The examples demonstrated progression from simple sensor simulation to complex multi-actuator coordination. The exercises explored environmental systems, robotic coordination, and real-time control - all essential patterns for mechatronic engineering.

Simulation skills transfer directly to hardware programming, where the same abstraction patterns and control logic apply. Next, you'll learn about implementing closed-loop control systems, where simulation becomes crucial for tuning control parameters safely.
