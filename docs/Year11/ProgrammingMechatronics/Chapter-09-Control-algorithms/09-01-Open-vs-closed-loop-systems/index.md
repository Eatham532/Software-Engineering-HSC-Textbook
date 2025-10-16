---
title: "9.1 Open vs closed loop systems"
---

# 9.1 Open vs closed loop systems

Control systems are the brains of mechatronic systems. They decide what actions to take based on the current situation and desired outcomes. Understanding the difference between open and closed loop systems is fundamental to designing effective control strategies.

## Why it matters

The choice between open and closed loop control affects every aspect of a mechatronic system's performance. Open loop systems are simpler and cheaper but can't adapt to changing conditions. Closed loop systems are more complex but provide better accuracy and can handle disturbances. Most real-world mechatronic systems use a mix of both approaches depending on the specific requirements of each subsystem.

## Concepts

### Open loop systems

An open loop system executes a predetermined sequence of actions without monitoring the results. It's like following a recipe step-by-step without tasting the food until it's finished.

**Key characteristics:**

- No feedback from the output

- Actions based only on the input command

- Cannot correct for disturbances or errors

- Simpler to design and implement

- Lower cost due to fewer sensors

**Common examples:**

- Microwave ovens (heat for a set time regardless of food temperature)

- Washing machines (run predetermined cycles regardless of cleanliness)

- Traffic lights (change on fixed timers regardless of traffic flow)

- 3D printers (follow predetermined paths regardless of actual position)

```python-template
class OpenLoopHeater:
    """Simple open loop heating system"""
    
    def __init__(self):
        self.target_temperature = 20  # Desired temperature
        self.current_power = 0        # Heater power (0-100%)
        self.heating_time = 0         # How long we've been heating
    
    def set_target(self, temperature):
        """Set the desired temperature"""
        self.target_temperature = temperature
    
    def calculate_heating_time(self):
        """Estimate heating time based on temperature difference"""
        # Simple estimation: 1 minute per degree difference
        temp_difference = self.target_temperature - 18  # Assume room starts at 18°C
        return max(0, temp_difference * 60)  # seconds
    
    def start_heating(self):
        """Start the heating cycle"""
        heating_duration = self.calculate_heating_time()
        self.current_power = 100  # Full power
        print(f"Heating at 100% power for {heating_duration} seconds")
        print(f"Target: {self.target_temperature}°C")
        
        # Simulate the heating process
        self.heating_time = heating_duration
        self.current_power = 0  # Turn off after time expires
        print("Heating cycle complete")
    
    def get_status(self):
        """Get current system status"""
        return {
            'target': self.target_temperature,
            'power': self.current_power,
            'heating_time': self.heating_time
        }

# Demonstrate open loop heating
heater = OpenLoopHeater()
heater.set_target(25)
heater.start_heating()
print(f"Status: {heater.get_status()}")

```

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

rectangle "Open Loop System" {
    [Input Command] --> [Controller]
    [Controller] --> [Process/Plant]
    [Process/Plant] --> [Output]
    
    note bottom of [Controller] : No feedback\nfrom output
}

rectangle "Example: Microwave" {
    [Time Setting] --> [Timer Control]
    [Timer Control] --> [Magnetron]
    [Magnetron] --> [Heat Food]
    
    note bottom of [Timer Control] : Heats for set time\nregardless of food temperature
}
@enduml

```

### Closed loop systems

A closed loop system continuously monitors its output and adjusts its actions to achieve the desired result. It's like adjusting the steering wheel while driving to stay in your lane.

**Key characteristics:**

- Feedback from output to input

- Continuous monitoring and adjustment

- Can correct for disturbances and errors

- More complex to design and implement

- Higher cost due to additional sensors

**Common examples:**

- Cruise control (adjusts throttle to maintain speed)

- Thermostats (turn heating on/off to maintain temperature)

- Automatic focus cameras (adjust lens until image is sharp)

- Robotic arms (adjust motor positions to reach target coordinates)

```python-template
class ClosedLoopHeater:
    """Closed loop heating system with temperature feedback"""
    
    def __init__(self):
        self.target_temperature = 20
        self.current_temperature = 18  # Start at room temperature
        self.current_power = 0
        self.max_power = 100
        
        # Control parameters
        self.tolerance = 0.5  # Acceptable error in degrees
        self.power_per_degree = 20  # Power adjustment per degree of error
    
    def read_temperature(self):
        """Simulate reading from temperature sensor"""
        # In real system, this would read from actual sensor
        return self.current_temperature
    
    def set_heater_power(self, power):
        """Set heater power (0-100%)"""
        self.current_power = max(0, min(100, power))
    
    def calculate_error(self):
        """Calculate difference between target and actual temperature"""
        return self.target_temperature - self.current_temperature
    
    def update_control(self):
        """Main control loop - adjusts power based on temperature error"""
        error = self.calculate_error()
        
        if abs(error) <= self.tolerance:
            # Close enough - maintain current power or turn off
            self.set_heater_power(0)
            status = "TARGET REACHED"
        elif error > 0:
            # Too cold - increase power proportional to error
            power = min(self.max_power, error * self.power_per_degree)
            self.set_heater_power(power)
            status = "HEATING"
        else:
            # Too hot - turn off heater
            self.set_heater_power(0)
            status = "COOLING"
        
        return status
    
    def simulate_temperature_change(self):
        """Simulate how temperature changes based on heater power"""
        # Simplified physics: temperature rises with heater power, falls naturally
        heating_effect = self.current_power * 0.01  # Power contributes to temperature
        cooling_effect = (self.current_temperature - 18) * 0.02  # Natural cooling
        
        self.current_temperature += heating_effect - cooling_effect
    
    def run_cycle(self, target, steps=10):
        """Run a complete heating cycle"""
        self.target_temperature = target
        print(f"Target temperature: {target}°C")
        print("Step | Temp  | Error | Power | Status")
        print("-" * 40)
        
        for step in range(steps):
            status = self.update_control()
            error = self.calculate_error()
            
            print(f"{step:4d} | {self.current_temperature:5.1f} | {error:5.1f} | {self.current_power:5.1f} | {status}")
            
            # Simulate temperature change for next iteration
            self.simulate_temperature_change()
            
            # Stop if we've reached the target
            if abs(error) <= self.tolerance and status == "TARGET REACHED":
                break

# Demonstrate closed loop heating
heater = ClosedLoopHeater()
heater.run_cycle(target=25)

```

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

rectangle "Closed Loop System" {
    [Input Command] --> [Controller]
    [Controller] --> [Process/Plant]
    [Process/Plant] --> [Output]
    [Output] --> [Sensor]
    [Sensor] --> [Feedback]
    [Feedback] --> [Controller]
    
    note bottom of [Feedback] : Continuous monitoring\nand adjustment
}

rectangle "Example: Thermostat" {
    [Temperature Setting] --> [Control Logic]
    [Control Logic] --> [Heater]
    [Heater] --> [Room Temperature]
    [Room Temperature] --> [Temperature Sensor]
    [Temperature Sensor] --> [Measured Temperature]
    [Measured Temperature] --> [Control Logic]
    
    note bottom of [Control Logic] : Compares desired vs actual\ntemperature
}
@enduml

```

### Feedback concepts

Feedback is the key difference between open and closed loop systems. It provides information about the system's actual performance compared to the desired performance.

#### Types of feedback

**Negative feedback**: The most common type in control systems. The feedback signal opposes changes, helping to maintain stability.

**Positive feedback**: The feedback signal reinforces changes. This can lead to instability but is useful in some applications like oscillators.

```python-template
class FeedbackDemo:
    """Demonstrate different types of feedback"""
    
    def __init__(self):
        self.value = 10  # Starting value
        self.target = 20  # Desired value
    
    def negative_feedback_step(self, gain=0.1):
        """Negative feedback: moves toward target"""
        error = self.target - self.value
        adjustment = error * gain
        self.value += adjustment
        return self.value
    
    def positive_feedback_step(self, gain=0.1):
        """Positive feedback: amplifies deviation"""
        deviation = self.value - self.target
        adjustment = deviation * gain
        self.value += adjustment
        return self.value
    
    def demonstrate_feedback_types(self):
        """Show how different feedback types behave"""
        # Reset for negative feedback demo
        self.value = 10
        print("Negative Feedback (stabilizing):")
        print("Step | Value | Error")
        print("-" * 20)
        
        for step in range(8):
            error = self.target - self.value
            self.negative_feedback_step(gain=0.3)
            print(f"{step:4d} | {self.value:5.1f} | {error:5.1f}")
        
        print("\nPositive Feedback (destabilizing):")
        print("Step | Value | Deviation")
        print("-" * 22)
        
        # Reset for positive feedback demo
        self.value = 22  # Start slightly above target
        
        for step in range(6):
            deviation = self.value - self.target
            self.positive_feedback_step(gain=0.2)
            print(f"{step:4d} | {self.value:5.1f} | {deviation:9.1f}")

# Demonstrate feedback types
demo = FeedbackDemo()
demo.demonstrate_feedback_types()

```

#### Feedback loops in mechatronic systems

Real mechatronic systems often have multiple feedback loops operating at different speeds and controlling different aspects of the system.

```python-template
class RobotArmJoint:
    """Model of a robot arm joint with position and velocity control"""
    
    def __init__(self):
        self.target_position = 0    # Desired angle in degrees
        self.current_position = 0   # Actual angle in degrees
        self.current_velocity = 0   # Angular velocity in degrees/second
        self.motor_torque = 0       # Applied torque
        
        # Control gains
        self.position_gain = 2.0    # Position control strength
        self.velocity_gain = 0.5    # Velocity damping
        self.max_torque = 100       # Maximum motor torque
    
    def position_control_loop(self):
        """Outer loop: controls position"""
        position_error = self.target_position - self.current_position
        desired_velocity = position_error * self.position_gain
        return desired_velocity
    
    def velocity_control_loop(self, desired_velocity):
        """Inner loop: controls velocity"""
        velocity_error = desired_velocity - self.current_velocity
        torque_command = velocity_error * self.velocity_gain
        
        # Limit torque to motor capabilities
        self.motor_torque = max(-self.max_torque, 
                               min(self.max_torque, torque_command))
        return self.motor_torque
    
    def simulate_physics(self, dt=0.1):
        """Simulate joint motion based on applied torque"""
        # Simplified physics: torque affects acceleration
        acceleration = self.motor_torque * 0.1  # Simplified dynamics
        self.current_velocity += acceleration * dt
        self.current_position += self.current_velocity * dt
        
        # Add some damping
        self.current_velocity *= 0.95
    
    def update(self, dt=0.1):
        """Complete control update cycle"""
        # Outer loop: position control
        desired_velocity = self.position_control_loop()
        
        # Inner loop: velocity control
        self.velocity_control_loop(desired_velocity)
        
        # Physics simulation
        self.simulate_physics(dt)
    
    def move_to(self, target_angle, steps=50):
        """Move joint to target angle and show the process"""
        self.target_position = target_angle
        
        print(f"Moving to {target_angle}° from {self.current_position:.1f}°")
        print("Step | Position | Velocity | Torque")
        print("-" * 35)
        
        for step in range(steps):
            self.update()
            
            if step % 5 == 0:  # Print every 5th step
                print(f"{step:4d} | {self.current_position:8.1f} | "
                      f"{self.current_velocity:8.1f} | {self.motor_torque:6.1f}")
            
            # Stop if close enough to target
            if abs(self.target_position - self.current_position) < 0.1:
                break
        
        print(f"Final position: {self.current_position:.1f}°")

# Demonstrate nested control loops
joint = RobotArmJoint()
joint.move_to(45)

```

### Stability concepts

Stability is a crucial concern in closed loop systems. A stable system returns to its desired state after a disturbance. An unstable system may oscillate or diverge from the target.

#### Factors affecting stability

**Control gain**: How strongly the system responds to errors. Higher gain gives faster response but can cause instability.

**System delays**: Time between control action and system response. Delays make control more difficult.

**Disturbances**: External forces that push the system away from its target state.

```python-template
class StabilityDemo:
    """Demonstrate how different factors affect system stability"""
    
    def __init__(self):
        self.position = 0
        self.velocity = 0
        self.target = 10
        
    def simulate_with_gain(self, gain, steps=20, disturbance=0):
        """Simulate system response with different control gains"""
        self.position = 0
        self.velocity = 0
        
        positions = []
        
        for step in range(steps):
            # Control law: proportional control
            error = self.target - self.position
            control_force = error * gain
            
            # Add disturbance
            if step == 10:  # Disturbance at step 10
                control_force += disturbance
            
            # Simple physics simulation
            acceleration = control_force - self.velocity * 0.1  # Damping
            self.velocity += acceleration * 0.1
            self.position += self.velocity * 0.1
            
            positions.append(self.position)
        
        return positions
    
    def analyze_stability(self):
        """Compare system behavior with different gains"""
        gains = [0.5, 2.0, 5.0, 10.0]
        
        print("Stability Analysis: Response to Step Input")
        print("Gain | Final Position | Oscillation | Stable?")
        print("-" * 45)
        
        for gain in gains:
            positions = self.simulate_with_gain(gain)
            final_pos = positions[-1]
            
            # Check for oscillation (position changes direction multiple times)
            direction_changes = 0
            for i in range(1, len(positions)-1):
                if ((positions[i] - positions[i-1]) * 
                    (positions[i+1] - positions[i]) < 0):
                    direction_changes += 1
            
            oscillating = direction_changes > 3
            stable = abs(final_pos - self.target) < 0.5 and not oscillating
            
            print(f"{gain:4.1f} | {final_pos:13.1f} | "
                  f"{'Yes' if oscillating else 'No':11} | "
                  f"{'Yes' if stable else 'No'}")
        
        print("\nResponse with Disturbance:")
        print("Gain | Recovery Time | Overshoot")
        print("-" * 30)
        
        for gain in [1.0, 3.0, 8.0]:
            positions = self.simulate_with_gain(gain, steps=30, disturbance=5)
            
            # Find recovery time (when system gets within 5% of target)
            recovery_time = None
            max_overshoot = 0
            
            for i, pos in enumerate(positions[10:], 10):  # After disturbance
                if abs(pos - self.target) < 0.5:
                    if recovery_time is None:
                        recovery_time = i - 10
                
                overshoot = max(0, pos - self.target)
                max_overshoot = max(max_overshoot, overshoot)
            
            recovery_str = str(recovery_time) if recovery_time else "No recovery"
            print(f"{gain:4.1f} | {recovery_str:13} | {max_overshoot:8.1f}")

# Demonstrate stability analysis
demo = StabilityDemo()
demo.analyze_stability()

```

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

rectangle "System Stability Factors" {
    rectangle "Control Gain" {
        [Low Gain] --> [Slow Response]
        [High Gain] --> [Fast Response]
        [Very High Gain] --> [Oscillation]
        [Excessive Gain] --> [Instability]
    }
    
    rectangle "System Delays" {
        [Processing Delay]
        [Communication Delay]
        [Mechanical Delay]
        [Sensor Delay]
    }
    
    rectangle "Disturbances" {
        [External Forces]
        [Noise]
        [Parameter Changes]
        [Load Variations]
    }
}

[Low Gain] --> [Stable but Slow]
[High Gain] --> [Fast but Potentially Unstable]
[Processing Delay] --> [Phase Lag]
[External Forces] --> [Steady State Error]

note bottom : Balance between performance\nand stability is key
@enduml

```

### Guided example

Let's design a simple cruise control system to see open and closed loop concepts in practice.

```python-template
class CruiseControlSystem:
    """Complete cruise control system demonstration"""
    
    def __init__(self):
        # Vehicle state
        self.current_speed = 0      # km/h
        self.target_speed = 0       # km/h
        self.throttle_position = 0  # 0-100%
        self.brake_applied = False
        
        # Control parameters
        self.speed_gain = 2.0       # Throttle response to speed error
        self.max_throttle = 100     # Maximum throttle position
        self.speed_tolerance = 2    # Acceptable speed error (km/h)
        
        # System state
        self.cruise_active = False
        self.control_mode = "closed_loop"  # or "open_loop"
    
    def set_cruise_speed(self, speed):
        """Activate cruise control at current speed"""
        self.target_speed = speed
        self.cruise_active = True
        print(f"Cruise control set to {speed} km/h")
    
    def open_loop_control(self):
        """Simple open loop control - fixed throttle position"""
        if self.cruise_active:
            # Estimate throttle needed (very rough approximation)
            estimated_throttle = self.target_speed * 0.8  # 0.8% per km/h
            self.throttle_position = min(self.max_throttle, estimated_throttle)
            return "OPEN_LOOP"
        return "INACTIVE"
    
    def closed_loop_control(self):
        """Closed loop control with speed feedback"""
        if not self.cruise_active:
            self.throttle_position = 0
            return "INACTIVE"
        
        # Calculate speed error
        speed_error = self.target_speed - self.current_speed
        
        if abs(speed_error) <= self.speed_tolerance:
            # Maintain current throttle
            status = "MAINTAINING"
        elif speed_error > 0:
            # Need to speed up
            throttle_increase = speed_error * self.speed_gain
            self.throttle_position = min(self.max_throttle, 
                                       self.throttle_position + throttle_increase)
            status = "ACCELERATING"
        else:
            # Need to slow down
            self.throttle_position = max(0, self.throttle_position - abs(speed_error))
            status = "DECELERATING"
        
        return status
    
    def simulate_vehicle_dynamics(self, hill_grade=0, headwind=0):
        """Simulate how vehicle speed changes"""
        # Simplified vehicle dynamics
        throttle_force = self.throttle_position * 0.3  # Acceleration from throttle
        drag_force = self.current_speed * 0.02         # Air resistance
        hill_force = hill_grade * 2                    # Hill resistance
        wind_force = headwind * 0.1                    # Wind resistance
        
        if self.brake_applied:
            net_force = -5  # Braking force
        else:
            net_force = throttle_force - drag_force - hill_force - wind_force
        
        # Update speed (simplified physics)
        speed_change = net_force * 0.5
        self.current_speed = max(0, self.current_speed + speed_change)
    
    def apply_brake(self):
        """Driver applies brake - deactivates cruise control"""
        self.brake_applied = True
        self.cruise_active = False
        self.throttle_position = 0
        print("Brake applied - cruise control deactivated")
    
    def release_brake(self):
        """Driver releases brake"""
        self.brake_applied = False
    
    def simulate_drive(self, duration=20, hill_grade=0, headwind=0):
        """Simulate a driving scenario"""
        print(f"\nDriving simulation - Hill: {hill_grade:.1f}, Wind: {headwind:.1f}")
        print("Time | Speed | Target | Throttle | Status")
        print("-" * 45)
        
        for time in range(duration):
            # Choose control method
            if self.control_mode == "open_loop":
                status = self.open_loop_control()
            else:
                status = self.closed_loop_control()
            
            # Simulate vehicle response
            self.simulate_vehicle_dynamics(hill_grade, headwind)
            
            # Print status every few seconds
            if time % 2 == 0:
                print(f"{time:4d} | {self.current_speed:5.1f} | "
                      f"{self.target_speed:6.1f} | {self.throttle_position:8.1f} | "
                      f"{status}")
            
            # Simulate driver brake input at time 15
            if time == 15:
                self.apply_brake()
            elif time == 17:
                self.release_brake()
                self.set_cruise_speed(self.target_speed)  # Re-engage cruise

# Demonstrate cruise control comparison
print("=== Cruise Control Comparison ===")

# Test open loop control
car1 = CruiseControlSystem()
car1.control_mode = "open_loop"
car1.current_speed = 50
car1.set_cruise_speed(80)
print("\nOpen Loop Control:")
car1.simulate_drive(duration=10, hill_grade=0.5)  # Uphill

# Test closed loop control
car2 = CruiseControlSystem()
car2.control_mode = "closed_loop"
car2.current_speed = 50
car2.set_cruise_speed(80)
print("\nClosed Loop Control:")
car2.simulate_drive(duration=10, hill_grade=0.5)  # Same uphill

```

## Try it

/// details | Exercise 1: System Classification
    type: question
    open: false

Classify each system as open loop or closed loop, and explain your reasoning:

1. A coffee machine that brews for 5 minutes regardless of coffee strength

2. A robotic vacuum that uses sensors to navigate around obstacles

3. A sprinkler system that waters the garden for 30 minutes every evening

4. An automatic car headlight system that turns on based on ambient light

/// details | Sample Solution
    type: success
    open: false

1. **Open loop** - Fixed timing with no feedback about coffee strength

2. **Closed loop** - Uses sensor feedback to adjust navigation in real-time

3. **Open loop** - Fixed schedule with no feedback about soil moisture or weather

4. **Closed loop** - Uses light sensor feedback to decide when to activate headlights
///
///

/// details | Exercise 2: Control System Design
    type: question
    open: false

Design a simple water level control system for a fish tank. Create Python code that maintains water level between 18-22 cm using a pump and drain valve. Consider:

- How will you measure water level?

- What happens if water level is too high or too low?

- How will you prevent oscillation around the target level?

/// details | Sample Solution
    type: success
    open: false

```python-template
class FishTankController:
    def __init__(self):
        self.current_level = 20  # cm
        self.target_level = 20   # cm
        self.min_level = 18      # cm
        self.max_level = 22      # cm
        
        self.pump_active = False
        self.drain_active = False
        self.tolerance = 0.5     # cm - prevents oscillation
    
    def read_water_level(self):
        """Simulate ultrasonic sensor reading"""
        return self.current_level
    
    def control_update(self):
        """Main control logic"""
        level = self.read_water_level()
        error = self.target_level - level
        
        # Turn off both pump and drain first
        self.pump_active = False
        self.drain_active = False
        
        if level < (self.target_level - self.tolerance):
            # Water too low - turn on pump
            self.pump_active = True
            status = "FILLING"
        elif level > (self.target_level + self.tolerance):
            # Water too high - open drain
            self.drain_active = True
            status = "DRAINING"
        else:
            # Level acceptable - do nothing
            status = "MAINTAINING"
        
        return status
    
    def simulate_water_change(self):
        """Simulate how water level changes"""
        if self.pump_active:
            self.current_level += 0.5  # Pump adds water
        if self.drain_active:
            self.current_level -= 0.3  # Drain removes water
        
        # Natural evaporation
        self.current_level -= 0.05

# Test the system
tank = FishTankController()
tank.current_level = 16  # Start with low water

for step in range(15):
    status = tank.control_update()
    tank.simulate_water_change()
    print(f"Step {step}: Level={tank.current_level:.1f}cm, "
          f"Pump={tank.pump_active}, Drain={tank.drain_active}, "
          f"Status={status}")

```

///
///

/// details | Exercise 3: Stability Analysis
    type: question
    open: false

Modify the closed loop heater example to investigate what happens with different control gains. Test gains of 0.5, 2.0, 5.0, and 10.0. What do you observe about:

- Response time (how quickly it reaches the target)

- Overshoot (how far above target it goes)

- Oscillation (does it settle smoothly or bounce around?)

/// details | Sample Solution
    type: success
    open: false

```python-template
class HeaterStabilityTest:
    def __init__(self, gain):
        self.target_temperature = 25
        self.current_temperature = 18
        self.current_power = 0
        self.gain = gain  # Control gain parameter
    
    def update_control(self):
        error = self.target_temperature - self.current_temperature
        power = error * self.gain
        self.current_power = max(0, min(100, power))
    
    def simulate_temperature(self):
        heating = self.current_power * 0.01
        cooling = (self.current_temperature - 18) * 0.02
        self.current_temperature += heating - cooling
    
    def test_response(self, steps=30):
        temperatures = []
        for step in range(steps):
            self.update_control()
            self.simulate_temperature()
            temperatures.append(self.current_temperature)
        return temperatures

# Test different gains
gains = [0.5, 2.0, 5.0, 10.0]
for gain in gains:
    heater = HeaterStabilityTest(gain)
    temps = heater.test_response()
    
    max_temp = max(temps)
    final_temp = temps[-1]
    overshoot = max(0, max_temp - 25)
    
    print(f"Gain {gain}: Final={final_temp:.1f}°C, "
          f"Overshoot={overshoot:.1f}°C")

```

**Observations:**

- Low gain (0.5): Slow response, no overshoot, very stable

- Medium gain (2.0): Good response time, minimal overshoot

- High gain (5.0): Fast response, some overshoot, mild oscillation

- Very high gain (10.0): Very fast response, large overshoot, strong oscillation
///
///

## Recap

Control systems are fundamental to mechatronic design. Open loop systems execute predetermined actions without feedback - they're simple and cheap but can't adapt to disturbances. Closed loop systems use feedback to continuously adjust their behavior - they're more complex and expensive but provide better accuracy and disturbance rejection.

Key concepts:

- **Open loop**: No feedback, predetermined actions, simple but inflexible

- **Closed loop**: Continuous feedback, adaptive behavior, complex but accurate

- **Feedback**: Information about system output used to adjust control actions

- **Stability**: System's ability to return to desired state after disturbances

The choice between open and closed loop control depends on the application requirements for accuracy, cost, complexity, and environmental conditions. Most real mechatronic systems use a combination of both approaches.

See also [9.2 Autonomous control features](../09-02-Autonomous-control-features/index.md) for advanced control concepts and [10.2 Implementing closed loop control](../../Chapter-10-Programming-and-building/10-02-Implementing-closed-loop-control/index.md) for practical implementation techniques.
