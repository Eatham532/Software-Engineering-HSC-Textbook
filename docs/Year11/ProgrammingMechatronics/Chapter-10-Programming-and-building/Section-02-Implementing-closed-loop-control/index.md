# 10.2 Implementing closed loop control

## Why it matters


Closed loop control is the foundation of intelligent mechatronic systems. Unlike open loop systems that blindly execute commands, closed loop systems continuously monitor their output and adjust their behaviour to achieve desired results. This feedback mechanism enables precise control, automatic error correction, and robust operation in changing conditions.

Programming effective control loops requires understanding both the control theory concepts and the practical implementation details. Well-structured Python code makes control systems easier to debug, tune, and maintain throughout their operational life.

## Concepts

### Control loop fundamentals

A closed loop control system consists of four essential components working together in a continuous cycle:

1. **Setpoint** - the desired target value

2. **Sensor** - measures the actual output value

3. **Controller** - calculates the required correction

4. **Actuator** - applies the correction to the system

The **error** is the difference between setpoint and measured value. The controller uses this error to determine the appropriate **control output** that drives the actuator.

```kroki-plantuml
@startuml
!theme plain
skinparam monochrome true
skinparam shadowing false

[Setpoint] --> [Controller] : target value
[Sensor] --> [Controller] : measured value
[Controller] --> [Actuator] : control output
[Actuator] --> [Process] : input
[Process] --> [Output] : system output
[Output] --> [Sensor] : feedback
[Sensor] ..> [Controller] : error = setpoint - measured

note right of [Controller] : Error calculation\nControl algorithm\nOutput limiting
note bottom of [Process] : The physical system\nbeing controlled
@enduml

```

### Proportional control

Proportional control adjusts the control output in direct proportion to the error. The proportional gain (Kp) determines how aggressively the controller responds to errors.

**Control equation**: `output = Kp × error`

Higher gain provides faster response but can cause instability. Lower gain is more stable but slower to reach the setpoint.

```python
# Basic proportional controller implementation
class ProportionalController:
    def __init__(self, kp, output_min=-100, output_max=100):
        self.kp = kp  # Proportional gain
        self.output_min = output_min
        self.output_max = output_max
        
    def calculate_output(self, setpoint, measured_value):
        """Calculate control output based on proportional control"""
        error = setpoint - measured_value
        output = self.kp * error
        
        # Limit output to safe range
        output = max(self.output_min, min(self.output_max, output))
        return output

# Example: Temperature control
temp_controller = ProportionalController(kp=2.0, output_min=0, output_max=100)

# Simulate control loop
setpoint = 25.0  # Target temperature in Celsius
current_temp = 20.0  # Starting temperature

for step in range(5):
    # Calculate control output (heater power percentage)
    heater_power = temp_controller.calculate_output(setpoint, current_temp)
    
    # Simulate temperature change (simplified physics)
    temp_increase = heater_power * 0.01  # 1% per unit power
    current_temp += temp_increase
    
    print(f"Step {step+1}: Temp={current_temp:.1f}°C, Error={setpoint-current_temp:.1f}, Power={heater_power:.1f}%")

```

### PID control

PID (Proportional-Integral-Derivative) control combines three components to achieve better performance than proportional control alone:

- **Proportional (P)**: Responds to current error

- **Integral (I)**: Eliminates steady-state error by accumulating past errors

- **Derivative (D)**: Reduces overshoot by responding to rate of error change

**Control equation**: `output = Kp×error + Ki×∫error×dt + Kd×(derror/dt)`

```python
import time

class PIDController:
    def __init__(self, kp, ki, kd, output_min=-100, output_max=100):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain
        
        self.output_min = output_min
        self.output_max = output_max
        
        # Internal state
        self.previous_error = 0
        self.integral = 0
        self.last_time = time.time()
        
    def calculate_output(self, setpoint, measured_value):
        """Calculate PID control output"""
        current_time = time.time()
        dt = current_time - self.last_time
        
        if dt <= 0:
            dt = 0.001  # Prevent division by zero
            
        # Calculate error
        error = setpoint - measured_value
        
        # Proportional term
        proportional = self.kp * error
        
        # Integral term (accumulated error over time)
        self.integral += error * dt
        integral = self.ki * self.integral
        
        # Derivative term (rate of error change)
        derivative = 0
        if dt > 0:
            derivative = self.kd * (error - self.previous_error) / dt
            
        # Combine PID terms
        output = proportional + integral + derivative
        
        # Apply output limits
        output = max(self.output_min, min(self.output_max, output))
        
        # Store values for next iteration
        self.previous_error = error
        self.last_time = current_time
        
        return output, proportional, integral, derivative
    
    def reset(self):
        """Reset controller state"""
        self.previous_error = 0
        self.integral = 0
        self.last_time = time.time()

# Example: Position control system
position_controller = PIDController(kp=10.0, ki=2.0, kd=1.0, output_min=-50, output_max=50)

# Simulate servo motor position control
target_position = 90  # degrees
current_position = 0  # starting position
velocity = 0  # current velocity

print("PID Position Control Simulation")
print("Step | Position | Error | P-term | I-term | D-term | Output")
print("-" * 65)

for step in range(10):
    # Calculate PID output
    output, p_term, i_term, d_term = position_controller.calculate_output(
        target_position, current_position
    )
    
    # Simulate motor response (simplified dynamics)
    acceleration = output * 0.1  # Motor response
    velocity += acceleration
    velocity *= 0.9  # Friction/damping
    current_position += velocity
    
    error = target_position - current_position
    
    print(f"{step+1:4d} | {current_position:8.1f} | {error:5.1f} | {p_term:6.1f} | {i_term:6.1f} | {d_term:6.1f} | {output:6.1f}")
    
    time.sleep(0.1)  # Simulate time step

```

### Guided example

Let's implement a complete closed loop control system for a simulated robotic arm that needs to maintain a specific angle despite external disturbances.

```kroki-plantuml
@startuml
!theme plain
skinparam monochrome true
skinparam shadowing false

class RobotArmController {
    - pid_controller: PIDController
    - current_angle: float
    - target_angle: float
    - motor_power: float
    + set_target_angle(angle)
    + read_angle_sensor()
    + update_control_loop()
    + apply_motor_power(power)
}

class AngleSensor {
    - noise_level: float
    - measurement_delay: float
    + read_angle(): float
    + calibrate()
}

class ServoMotor {
    - power_limit: float
    - response_time: float
    + set_power(power_percent)
    + get_current_position(): float
}

class Disturbance {
    - force_magnitude: float
    - frequency: float
    + apply_disturbance(): float
}

RobotArmController --> PIDController
RobotArmController --> AngleSensor
RobotArmController --> ServoMotor
RobotArmController ..> Disturbance : affected by
@enduml

```

```python
import math
import random
import time

class RobotArmSimulator:
    """Simulates a robotic arm with realistic physics and disturbances"""
    
    def __init__(self):
        # Physical parameters
        self.angle = 0.0  # Current angle in degrees
        self.velocity = 0.0  # Angular velocity
        self.inertia = 2.0  # Rotational inertia
        self.friction = 0.1  # Friction coefficient
        self.gravity_torque = 5.0  # Gravity effect
        
        # Sensor noise
        self.sensor_noise = 0.5  # degrees
        
    def apply_motor_torque(self, torque):
        """Apply motor torque and update physics"""
        # External disturbances
        disturbance = random.uniform(-2, 2)  # Random external forces
        gravity_effect = self.gravity_torque * math.sin(math.radians(self.angle))
        
        # Calculate total torque
        total_torque = torque - gravity_effect - (self.friction * self.velocity) + disturbance
        
        # Update dynamics
        acceleration = total_torque / self.inertia
        self.velocity += acceleration * 0.01  # 10ms time step
        self.angle += self.velocity * 0.01
        
        # Keep angle in reasonable range
        self.angle = self.angle % 360
        
    def read_angle_sensor(self):
        """Read angle with realistic sensor noise"""
        noise = random.uniform(-self.sensor_noise, self.sensor_noise)
        return self.angle + noise

class RobotArmController:
    """Complete closed loop controller for robotic arm"""
    
    def __init__(self, kp=15.0, ki=5.0, kd=2.0):
        self.pid = PIDController(kp, ki, kd, output_min=-100, output_max=100)
        self.simulator = RobotArmSimulator()
        self.target_angle = 0.0
        self.control_active = False
        
        # Data logging
        self.time_log = []
        self.angle_log = []
        self.target_log = []
        self.output_log = []
        self.error_log = []
        
    def set_target_angle(self, angle):
        """Set new target angle for the arm"""
        self.target_angle = angle
        print(f"Target angle set to: {angle:.1f}°")
        
    def run_control_loop(self, duration_seconds=10):
        """Run the closed loop control for specified duration"""
        self.control_active = True
        self.pid.reset()
        
        start_time = time.time()
        step = 0
        
        print("\nRunning closed loop control...")
        print("Time | Target | Measured | Error | PID Output | Status")
        print("-" * 55)
        
        while self.control_active and (time.time() - start_time) < duration_seconds:
            # Read current angle from sensor
            measured_angle = self.simulator.read_angle_sensor()
            
            # Calculate PID control output
            control_output, p, i, d = self.pid.calculate_output(
                self.target_angle, measured_angle
            )
            
            # Convert control output to motor torque
            motor_torque = control_output * 0.5  # Scale to appropriate torque range
            
            # Apply torque to simulated arm
            self.simulator.apply_motor_torque(motor_torque)
            
            # Log data
            current_time = time.time() - start_time
            error = self.target_angle - measured_angle
            
            self.time_log.append(current_time)
            self.angle_log.append(measured_angle)
            self.target_log.append(self.target_angle)
            self.output_log.append(control_output)
            self.error_log.append(error)
            
            # Print status every 10 steps
            if step % 10 == 0:
                status = "CONVERGING" if abs(error) > 2.0 else "STABLE"
                print(f"{current_time:4.1f} | {self.target_angle:6.1f} | {measured_angle:8.1f} | {error:5.1f} | {control_output:10.1f} | {status}")
            
            step += 1
            time.sleep(0.01)  # 100Hz control loop
            
    def stop_control(self):
        """Stop the control loop"""
        self.control_active = False
        
    def get_performance_metrics(self):
        """Calculate control performance metrics"""
        if not self.error_log:
            return {}
            
        # Steady-state error (average of last 20% of data)
        steady_state_start = int(len(self.error_log) * 0.8)
        steady_state_error = sum(abs(e) for e in self.error_log[steady_state_start:])
        steady_state_error /= len(self.error_log[steady_state_start:])
        
        # Maximum overshoot
        max_overshoot = max(abs(e) for e in self.error_log)
        
        # Settling time (time to reach within 2% of target)
        settling_time = None
        tolerance = self.target_angle * 0.02  # 2% tolerance
        
        for i, error in enumerate(self.error_log):
            if abs(error) <= tolerance:
                settling_time = self.time_log[i]
                break
                
        return {
            'steady_state_error': steady_state_error,
            'max_overshoot': max_overshoot,
            'settling_time': settling_time
        }

# Example usage and testing
if __name__ == "__main__":
    # Create controller
    arm_controller = RobotArmController(kp=15.0, ki=5.0, kd=2.0)
    
    # Test sequence
    print("=== Robotic Arm Closed Loop Control Test ===")
    
    # Test 1: Step response
    print("\nTest 1: Step response to 45°")
    arm_controller.set_target_angle(45.0)
    arm_controller.run_control_loop(duration_seconds=5)
    
    # Test 2: Tracking performance
    print("\nTest 2: Tracking response to 90°")
    arm_controller.set_target_angle(90.0)
    arm_controller.run_control_loop(duration_seconds=3)
    
    # Performance analysis
    metrics = arm_controller.get_performance_metrics()
    print(f"\nPerformance Metrics:")
    print(f"Steady-state error: {metrics['steady_state_error']:.2f}°")
    print(f"Maximum overshoot: {metrics['max_overshoot']:.2f}°")
    print(f"Settling time: {metrics['settling_time']:.2f}s" if metrics['settling_time'] else "Did not settle")

```

### Structured parameter management

Real control systems require careful parameter management for different operating modes, environmental conditions, and performance requirements.

```python
class ControlParameters:
    """Manages PID parameters and operating modes"""
    
    def __init__(self):
        # Default parameter sets for different operating modes
        self.parameter_sets = {
            'precision': {'kp': 25.0, 'ki': 8.0, 'kd': 3.0, 'output_limit': 50},
            'fast': {'kp': 40.0, 'ki': 15.0, 'kd': 5.0, 'output_limit': 100},
            'stable': {'kp': 10.0, 'ki': 2.0, 'kd': 1.0, 'output_limit': 75},
            'low_power': {'kp': 5.0, 'ki': 1.0, 'kd': 0.5, 'output_limit': 25}
        }
        
        self.current_mode = 'stable'
        self.adaptive_enabled = False
        
    def get_parameters(self, mode=None):
        """Get parameters for specified mode"""
        if mode is None:
            mode = self.current_mode
            
        if mode in self.parameter_sets:
            return self.parameter_sets[mode].copy()
        else:
            raise ValueError(f"Unknown parameter mode: {mode}")
            
    def set_mode(self, mode):
        """Change operating mode"""
        if mode in self.parameter_sets:
            self.current_mode = mode
            print(f"Control mode changed to: {mode}")
        else:
            raise ValueError(f"Unknown mode: {mode}")
            
    def tune_parameters(self, mode, **kwargs):
        """Adjust parameters for specific mode"""
        if mode in self.parameter_sets:
            for param, value in kwargs.items():
                if param in self.parameter_sets[mode]:
                    self.parameter_sets[mode][param] = value
                    print(f"Updated {mode}.{param} = {value}")
                    
    def auto_tune_from_performance(self, performance_metrics):
        """Automatically adjust parameters based on performance"""
        if not self.adaptive_enabled:
            return
            
        steady_state_error = performance_metrics.get('steady_state_error', 0)
        overshoot = performance_metrics.get('max_overshoot', 0)
        
        current_params = self.get_parameters()
        
        # Simple auto-tuning logic
        if steady_state_error > 2.0:  # Too much steady-state error
            new_ki = min(current_params['ki'] * 1.2, 20.0)
            self.tune_parameters(self.current_mode, ki=new_ki)
            
        if overshoot > 10.0:  # Too much overshoot
            new_kd = min(current_params['kd'] * 1.1, 10.0)
            new_kp = max(current_params['kp'] * 0.9, 1.0)
            self.tune_parameters(self.current_mode, kd=new_kd, kp=new_kp)

# Enhanced controller with parameter management
class AdaptiveRobotController(RobotArmController):
    """Robot controller with adaptive parameter management"""
    
    def __init__(self):
        # Initialize with default parameters
        params = ControlParameters()
        default_params = params.get_parameters('stable')
        
        super().__init__(
            kp=default_params['kp'],
            ki=default_params['ki'], 
            kd=default_params['kd']
        )
        
        self.param_manager = params
        self.param_manager.adaptive_enabled = True
        
    def change_mode(self, mode):
        """Change control mode and update PID parameters"""
        try:
            new_params = self.param_manager.get_parameters(mode)
            
            # Update PID controller
            self.pid.kp = new_params['kp']
            self.pid.ki = new_params['ki']
            self.pid.kd = new_params['kd']
            self.pid.output_max = new_params['output_limit']
            self.pid.output_min = -new_params['output_limit']
            
            # Reset PID state
            self.pid.reset()
            
            self.param_manager.set_mode(mode)
            
        except ValueError as e:
            print(f"Mode change failed: {e}")
            
    def optimize_performance(self):
        """Analyze recent performance and adjust parameters"""
        metrics = self.get_performance_metrics()
        if metrics:
            print("Analyzing performance...")
            self.param_manager.auto_tune_from_performance(metrics)
            
            # Apply updated parameters
            current_params = self.param_manager.get_parameters()
            self.pid.kp = current_params['kp']
            self.pid.ki = current_params['ki']
            self.pid.kd = current_params['kd']

# Example usage
adaptive_controller = AdaptiveRobotController()

print("Testing different control modes...")

# Test precision mode
adaptive_controller.change_mode('precision')
adaptive_controller.set_target_angle(30.0)
adaptive_controller.run_control_loop(duration_seconds=3)

# Test fast mode  
adaptive_controller.change_mode('fast')
adaptive_controller.set_target_angle(60.0)
adaptive_controller.run_control_loop(duration_seconds=2)

# Optimize based on performance
adaptive_controller.optimize_performance()

```

## Try it

/// details | Exercise 1: Basic proportional controller
    type: question
    open: false

**Task**: Implement a proportional controller for a heating system. The system should maintain a target temperature of 22°C. Test with different Kp values (0.5, 2.0, 5.0) and observe the behaviour.

Starting conditions:

- Current temperature: 18°C

- Heater power range: 0-100%

- Temperature change rate: 0.02°C per % power per time step

/// details | Sample solution
    type: success
    open: false

```python
class HeatingController:
    def __init__(self, kp):
        self.kp = kp
        
    def calculate_power(self, target_temp, current_temp):
        error = target_temp - current_temp
        power = self.kp * error
        return max(0, min(100, power))  # Limit to 0-100%

# Test different gains
target = 22.0
current_temp = 18.0

for kp in [0.5, 2.0, 5.0]:
    controller = HeatingController(kp)
    temp = current_temp
    
    print(f"\nTesting Kp = {kp}")
    for step in range(10):
        power = controller.calculate_power(target, temp)
        temp += power * 0.02  # Temperature change
        error = target - temp
        print(f"Step {step+1}: Temp={temp:.1f}°C, Power={power:.1f}%, Error={error:.1f}")
        
        if abs(error) < 0.1:
            print(f"Target reached in {step+1} steps")
            break

```

**Analysis**: Lower Kp (0.5) responds slowly but stably. Higher Kp (5.0) responds quickly but may overshoot. Kp=2.0 provides a good balance.
///
///

/// details | Exercise 2: PID tuning challenge
    type: question
    open: false

**Task**: A motor position control system has the following characteristics:

- High inertia (slow to start/stop)

- External disturbances (wind, friction)

- Requirement for zero steady-state error

- Maximum allowable overshoot: 5%

Tune a PID controller to meet these requirements. Start with Kp=1.0, Ki=0.1, Kd=0.1 and explain your tuning strategy.

/// details | Sample solution
    type: success
    open: false

**Tuning strategy for high-inertia system:**

1. **Start with Proportional**: Increase Kp until system responds but may oscillate

2. **Add Derivative**: Increase Kd to reduce overshoot and dampen oscillations

3. **Add Integral**: Increase Ki slowly to eliminate steady-state error

4. **Fine-tune**: Adjust all parameters to meet performance requirements

```python
# Recommended parameters for high-inertia system:
controller = PIDController(
    kp=8.0,   # Strong proportional response
    ki=2.0,   # Moderate integral to eliminate steady-state error
    kd=4.0,   # Strong derivative to prevent overshoot
    output_min=-100,
    output_max=100
)

```

**Reasoning**:

- Higher Kd compensates for inertia and prevents overshoot

- Moderate Ki eliminates steady-state error without causing instability

- Kp provides adequate response speed without excessive overshoot
///
///

/// details | Exercise 3: Control loop debugging
    type: question
    open: false

**Task**: A student's PID controller is behaving poorly with these symptoms:

- Very slow response to setpoint changes

- Large steady-state error that never disappears

- Occasional sudden large outputs

Identify potential problems and suggest debugging steps.

/// details | Sample solution
    type: success
    open: false

**Problem analysis and debugging:**

1. **Slow response** → Kp too low

   - Debug: Print proportional term, increase Kp gradually
   
2. **Steady-state error** → Ki too low or integral term not accumulating

   - Debug: Print integral term over time, check Ki value

   - Check: Is integral being reset accidentally?
   
3. **Sudden large outputs** → Several possible causes:

   - Derivative kick from setpoint changes

   - Integral windup

   - Sensor noise affecting derivative term

**Debugging code:**

```python
def debug_pid_output(self, setpoint, measured_value):
    output, p, i, d = self.calculate_output(setpoint, measured_value)
    
    print(f"Debug - P: {p:.2f}, I: {i:.2f}, D: {d:.2f}, Total: {output:.2f}")
    
    # Check for problems
    if abs(d) > 50:
        print("WARNING: Large derivative term - check for sensor noise")
    if abs(i) > 100:
        print("WARNING: Integral windup detected")
    if abs(p) < 1.0:
        print("INFO: Low proportional term - consider increasing Kp")
        
    return output

```

///
///

## Recap

Implementing closed loop control in Python requires understanding both control theory and practical programming techniques:

- **Basic structure**: Continuous cycle of measure, calculate error, compute output, apply correction

- **Proportional control**: Simple and effective for many applications, but may have steady-state error

- **PID control**: Combines proportional, integral, and derivative terms for optimal performance

- **Parameter management**: Structured approach to tuning and adapting control parameters

- **Performance metrics**: Steady-state error, overshoot, and settling time guide controller optimization

Well-structured code with clear separation of concerns makes control systems easier to debug, tune, and maintain. Consider using classes to encapsulate controller logic and parameter management functions.







