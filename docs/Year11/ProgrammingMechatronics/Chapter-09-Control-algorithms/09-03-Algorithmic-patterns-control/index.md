# 9.3 Algorithmic patterns for control

## Why it matters

Control systems require structured approaches to manage complex behaviours and respond to changing conditions. Three fundamental algorithmic patterns form the foundation of most mechatronic control systems: state machines for managing discrete behaviours, PID controllers for continuous regulation, and scheduling algorithms for coordinating multiple tasks.

These patterns provide proven solutions to common control challenges, making systems more predictable, maintainable, and robust. Understanding when and how to apply each pattern is essential for designing effective mechatronic systems.

## Concepts

### State machines: managing discrete behaviours

State machines model systems that exist in distinct states and transition between them based on events or conditions. They're particularly useful for systems with clearly defined operating modes.

**Key components**:

- **States**: distinct conditions or modes the system can be in

- **Transitions**: rules for moving from one state to another

- **Events**: triggers that cause transitions

- **Actions**: activities performed when entering, exiting, or while in a state

**Benefits**:

- Clear, visual representation of system behaviour

- Predictable responses to events

- Easy to test and debug

- Natural fit for many mechatronic applications

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

[*] --> Idle

Idle --> Starting : power_on / initialize()
Starting --> Running : startup_complete / start_main_loop()
Running --> Paused : pause_button / save_state()
Paused --> Running : resume_button / restore_state()
Running --> Stopping : stop_button / begin_shutdown()
Paused --> Stopping : stop_button / begin_shutdown()
Stopping --> Idle : shutdown_complete / cleanup()

Running : entry / enable_motors()
Running : do / monitor_sensors()
Running : exit / disable_motors()

Paused : entry / hold_position()
Paused : do / flash_status_led()

note right of Running : Main operational state\nwith continuous monitoring
note left of Paused : Temporary halt\nwith state preservation
@enduml

```

### Guided example: conveyor belt state machine

A conveyor belt system has several operational states based on safety sensors and user commands.

```python
from enum import Enum
import time

class ConveyorState(Enum):
    STOPPED = "stopped"
    STARTING = "starting"
    RUNNING = "running"
    STOPPING = "stopping"
    ERROR = "error"

class ConveyorBelt:
    def __init__(self):
        self.state = ConveyorState.STOPPED
        self.speed = 0
        self.emergency_stop = False
        self.safety_sensor = True  # True = clear, False = blocked
        self.start_time = 0
        
    def handle_event(self, event, data=None):
        """Process events and handle state transitions"""
        print(f"Current state: {self.state.value}, Event: {event}")
        
        # Emergency stop overrides all other logic
        if event == "emergency_stop":
            self._transition_to(ConveyorState.ERROR)
            return
            
        # State-specific event handling
        if self.state == ConveyorState.STOPPED:
            if event == "start_button" and self.safety_sensor:
                self._transition_to(ConveyorState.STARTING)
            elif event == "start_button" and not self.safety_sensor:
                print("Cannot start: safety sensor blocked")
                
        elif self.state == ConveyorState.STARTING:
            if event == "startup_complete":
                self._transition_to(ConveyorState.RUNNING)
            elif event == "stop_button":
                self._transition_to(ConveyorState.STOPPED)
                
        elif self.state == ConveyorState.RUNNING:
            if event == "stop_button":
                self._transition_to(ConveyorState.STOPPING)
            elif event == "safety_blocked":
                self._transition_to(ConveyorState.STOPPING)
                
        elif self.state == ConveyorState.STOPPING:
            if event == "stop_complete":
                self._transition_to(ConveyorState.STOPPED)
                
        elif self.state == ConveyorState.ERROR:
            if event == "reset_button" and self.safety_sensor:
                self._transition_to(ConveyorState.STOPPED)
    
    def _transition_to(self, new_state):
        """Handle state transition with entry/exit actions"""
        print(f"Transitioning from {self.state.value} to {new_state.value}")
        
        # Exit actions for current state
        if self.state == ConveyorState.RUNNING:
            print("Exiting RUNNING: disabling motor")
            
        # Entry actions for new state
        if new_state == ConveyorState.STARTING:
            print("Entering STARTING: gradual speed increase")
            self.start_time = time.time()
            self.speed = 0.1
            
        elif new_state == ConveyorState.RUNNING:
            print("Entering RUNNING: full speed operation")
            self.speed = 1.0
            
        elif new_state == ConveyorState.STOPPING:
            print("Entering STOPPING: gradual speed decrease")
            
        elif new_state == ConveyorState.STOPPED:
            print("Entering STOPPED: motor off")
            self.speed = 0
            
        elif new_state == ConveyorState.ERROR:
            print("Entering ERROR: emergency shutdown")
            self.speed = 0
            self.emergency_stop = True
            
        self.state = new_state
    
    def update(self):
        """Called regularly to handle time-based transitions"""
        if self.state == ConveyorState.STARTING:
            # Automatic transition after startup delay
            if time.time() - self.start_time > 2.0:
                self.handle_event("startup_complete")
                
        elif self.state == ConveyorState.STOPPING:
            # Simulate gradual deceleration
            if self.speed > 0:
                self.speed = max(0, self.speed - 0.1)
            else:
                self.handle_event("stop_complete")
    
    def get_status(self):
        return {
            'state': self.state.value,
            'speed': self.speed,
            'emergency_stop': self.emergency_stop,
            'safety_clear': self.safety_sensor
        }

# Demonstrate state machine operation
conveyor = ConveyorBelt()

print("=== Conveyor Belt State Machine Demo ===")
print(f"Initial status: {conveyor.get_status()}")

# Normal startup sequence
print("\n--- Normal Startup ---")
conveyor.handle_event("start_button")
print(f"Status: {conveyor.get_status()}")

# Simulate startup completion
time.sleep(0.1)  # Brief pause for demo
conveyor.update()  # This would normally be called by a timer
conveyor.handle_event("startup_complete")  # Manual trigger for demo
print(f"Status: {conveyor.get_status()}")

# Normal shutdown
print("\n--- Normal Shutdown ---")
conveyor.handle_event("stop_button")
conveyor.handle_event("stop_complete")  # Manual trigger for demo
print(f"Status: {conveyor.get_status()}")

# Emergency scenario
print("\n--- Emergency Stop ---")
conveyor.handle_event("start_button")
conveyor.handle_event("startup_complete")
conveyor.handle_event("emergency_stop")
print(f"Status: {conveyor.get_status()}")

```

### PID control: continuous regulation

PID (Proportional-Integral-Derivative) controllers provide smooth, continuous regulation of system variables by calculating corrections based on error analysis.

**Components**:

- **Proportional (P)**: responds to current error magnitude

- **Integral (I)**: responds to accumulated error over time

- **Derivative (D)**: responds to rate of error change

**Control equation**:

```
output = Kp × error + Ki × ∫error dt + Kd × (d_error/dt)

```

**Conceptual understanding**:

- **P term**: immediate correction proportional to how far off you are

- **I term**: correction for persistent offset (eliminates steady-state error)

- **D term**: dampening to prevent overshoot and oscillation

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "PID Controller" {
    [Setpoint] --> [Error Calculator]
    [Sensor Reading] --> [Error Calculator]
    [Error Calculator] --> [Proportional]
    [Error Calculator] --> [Integral]
    [Error Calculator] --> [Derivative]
    
    [Proportional] --> [Summer]
    [Integral] --> [Summer]
    [Derivative] --> [Summer]
    
    [Summer] --> [Output Limiter]
    [Output Limiter] --> [Plant/System]
    [Plant/System] --> [Sensor Reading]
}

note bottom of [Proportional] : Kp × error
note bottom of [Integral] : Ki × ∫error dt
note bottom of [Derivative] : Kd × d_error/dt
note right of [Plant/System] : The system being controlled\n(motor, heater, etc.)
@enduml

```

### Guided example: temperature control PID

A heating system needs to maintain a target temperature using PID control.

```python
import time
import math

class PIDController:
    def __init__(self, kp, ki, kd, setpoint=0):
        # PID coefficients
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain  
        self.kd = kd  # Derivative gain
        
        # Control variables
        self.setpoint = setpoint
        self.previous_error = 0
        self.integral = 0
        self.previous_time = time.time()
        
        # Output limits
        self.output_min = 0
        self.output_max = 100
        
    def update(self, measured_value):
        """Calculate PID output based on current measurement"""
        current_time = time.time()
        dt = current_time - self.previous_time
        
        # Calculate error
        error = self.setpoint - measured_value
        
        # Proportional term
        proportional = self.kp * error
        
        # Integral term (accumulated error over time)
        self.integral += error * dt
        integral_term = self.ki * self.integral
        
        # Derivative term (rate of error change)
        if dt > 0:
            derivative = (error - self.previous_error) / dt
        else:
            derivative = 0
        derivative_term = self.kd * derivative
        
        # Calculate total output
        output = proportional + integral_term + derivative_term
        
        # Apply output limits
        output = max(self.output_min, min(self.output_max, output))
        
        # Store values for next iteration
        self.previous_error = error
        self.previous_time = current_time
        
        return output, {
            'error': error,
            'proportional': proportional,
            'integral': integral_term,
            'derivative': derivative_term,
            'total_output': output
        }
    
    def set_tuning(self, kp, ki, kd):
        """Update PID tuning parameters"""
        self.kp = kp
        self.ki = ki
        self.kd = kd
    
    def reset(self):
        """Reset integral and derivative terms"""
        self.integral = 0
        self.previous_error = 0
        self.previous_time = time.time()

class HeatingSystem:
    """Simulate a heating system with thermal dynamics"""
    def __init__(self):
        self.temperature = 20.0  # Start at room temperature
        self.ambient_temp = 20.0
        self.thermal_mass = 0.95  # How slowly temperature changes
        self.heat_efficiency = 0.5  # How effectively heat input raises temp
        
    def apply_heat(self, heat_percentage):
        """Apply heat and update temperature (simplified physics)"""
        # Heat input effect
        heat_input = heat_percentage / 100.0 * self.heat_efficiency
        
        # Cooling toward ambient temperature
        cooling = (self.temperature - self.ambient_temp) * 0.02
        
        # Update temperature with thermal mass
        temp_change = heat_input - cooling
        self.temperature += temp_change * (1 - self.thermal_mass)
        
        return self.temperature

# Demonstrate PID temperature control
print("=== PID Temperature Control Demo ===")

# Create PID controller and heating system
# PID tuning: start with P-only, then add I and D
pid = PIDController(kp=2.0, ki=0.1, kd=0.5, setpoint=50.0)
heater = HeatingSystem()

print(f"Target temperature: {pid.setpoint}°C")
print(f"Starting temperature: {heater.temperature:.1f}°C")
print()

# Simulate control loop
for step in range(20):
    # Get current temperature
    current_temp = heater.temperature
    
    # Calculate PID output
    heat_output, debug_info = pid.update(current_temp)
    
    # Apply heat to system
    new_temp = heater.apply_heat(heat_output)
    
    # Display results every few steps
    if step % 3 == 0:
        print(f"Step {step:2d}: Temp={current_temp:5.1f}°C, "
              f"Error={debug_info['error']:5.1f}, "
              f"Heat={heat_output:5.1f}%, "
              f"P={debug_info['proportional']:5.1f}, "
              f"I={debug_info['integral']:5.1f}, "
              f"D={debug_info['derivative']:5.1f}")
    
    # Small delay to simulate real-time
    time.sleep(0.01)

print()
print(f"Final temperature: {heater.temperature:.1f}°C")
print(f"Temperature error: {abs(pid.setpoint - heater.temperature):.1f}°C")

# Demonstrate the effect of different tuning
print("\n=== PID Tuning Comparison ===")
tuning_sets = [
    {"name": "P-only", "kp": 3.0, "ki": 0.0, "kd": 0.0},
    {"name": "PI", "kp": 2.0, "ki": 0.1, "kd": 0.0},
    {"name": "PID", "kp": 2.0, "ki": 0.1, "kd": 0.5}
]

for tuning in tuning_sets:
    # Reset system
    heater.temperature = 20.0
    pid.reset()
    pid.set_tuning(tuning["kp"], tuning["ki"], tuning["kd"])
    
    # Run for 10 steps
    final_error = 0
    for _ in range(10):
        heat_output, debug_info = pid.update(heater.temperature)
        heater.apply_heat(heat_output)
        final_error = abs(debug_info['error'])
    
    print(f"{tuning['name']:6s}: Final error = {final_error:.1f}°C")

```

### Basic scheduling: coordinating multiple tasks

Scheduling algorithms determine when and in what order different control tasks execute. This is crucial for systems with multiple sensors, actuators, and control loops.

**Common scheduling patterns**:

1. **Round-robin**: each task gets equal time slices

2. **Priority-based**: important tasks run first

3. **Rate-monotonic**: tasks with higher frequencies get higher priority

4. **Cooperative**: tasks voluntarily yield control

### Guided example: multi-sensor monitoring scheduler

A greenhouse monitoring system must coordinate multiple sensors and control loops.

```python
import time
from dataclasses import dataclass
from enum import Enum
from typing import List, Callable

class TaskPriority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

@dataclass
class ScheduledTask:
    name: str
    function: Callable
    priority: TaskPriority
    frequency_hz: float  # How often to run (times per second)
    last_run: float = 0
    execution_time: float = 0  # Average execution time
    
    @property
    def period(self):
        """Time between executions in seconds"""
        return 1.0 / self.frequency_hz
    
    def is_ready(self, current_time):
        """Check if this task should run now"""
        return (current_time - self.last_run) >= self.period
    
    def execute(self, current_time):
        """Run the task and record timing"""
        start_time = time.time()
        try:
            result = self.function()
            self.last_run = current_time
            self.execution_time = time.time() - start_time
            return result
        except Exception as e:
            print(f"Task {self.name} failed: {e}")
            return None

class TaskScheduler:
    def __init__(self):
        self.tasks: List[ScheduledTask] = []
        self.running = False
        self.cycle_count = 0
        
    def add_task(self, task: ScheduledTask):
        """Add a task to the scheduler"""
        self.tasks.append(task)
        # Sort by priority (highest first), then by frequency
        self.tasks.sort(key=lambda t: (-t.priority.value, -t.frequency_hz))
    
    def run_cycle(self):
        """Execute one scheduler cycle"""
        current_time = time.time()
        self.cycle_count += 1
        
        executed_tasks = []
        
        # Priority-based scheduling with frequency constraints
        for task in self.tasks:
            if task.is_ready(current_time):
                result = task.execute(current_time)
                executed_tasks.append({
                    'name': task.name,
                    'priority': task.priority.name,
                    'execution_time': task.execution_time * 1000,  # ms
                    'result': result
                })
        
        return executed_tasks
    
    def get_status(self):
        """Get scheduler status and task information"""
        current_time = time.time()
        task_status = []
        
        for task in self.tasks:
            time_since_last = current_time - task.last_run
            time_until_next = max(0, task.period - time_since_last)
            
            task_status.append({
                'name': task.name,
                'priority': task.priority.name,
                'frequency': task.frequency_hz,
                'last_run': f"{time_since_last:.2f}s ago",
                'next_run': f"{time_until_next:.2f}s",
                'avg_execution': f"{task.execution_time * 1000:.1f}ms"
            })
        
        return {
            'cycle_count': self.cycle_count,
            'total_tasks': len(self.tasks),
            'tasks': task_status
        }

# Greenhouse monitoring system tasks
class GreenhouseMonitor:
    def __init__(self):
        self.temperature = 22.0
        self.humidity = 65.0
        self.light_level = 500
        self.soil_moisture = 0.7
        self.fan_speed = 0
        self.heater_power = 0
        
    def read_temperature(self):
        """High-frequency temperature monitoring"""
        # Simulate sensor reading with small variations
        import random
        self.temperature += random.uniform(-0.1, 0.1)
        return {'temperature': round(self.temperature, 1)}
    
    def read_humidity(self):
        """Medium-frequency humidity monitoring"""
        import random
        self.humidity += random.uniform(-0.5, 0.5)
        self.humidity = max(30, min(90, self.humidity))  # Clamp to realistic range
        return {'humidity': round(self.humidity, 1)}
    
    def control_climate(self):
        """Climate control based on current readings"""
        # Simple control logic
        if self.temperature < 20:
            self.heater_power = min(100, self.heater_power + 10)
        elif self.temperature > 25:
            self.heater_power = max(0, self.heater_power - 10)
            
        if self.humidity > 80:
            self.fan_speed = min(100, self.fan_speed + 20)
        elif self.humidity < 60:
            self.fan_speed = max(0, self.fan_speed - 20)
            
        return {
            'heater_power': self.heater_power,
            'fan_speed': self.fan_speed
        }
    
    def check_soil_moisture(self):
        """Low-frequency soil monitoring"""
        import random
        self.soil_moisture += random.uniform(-0.02, 0.01)
        self.soil_moisture = max(0.2, min(1.0, self.soil_moisture))
        return {'soil_moisture': round(self.soil_moisture, 2)}
    
    def safety_check(self):
        """Critical safety monitoring"""
        issues = []
        if self.temperature > 35:
            issues.append("TEMPERATURE_TOO_HIGH")
        if self.temperature < 5:
            issues.append("TEMPERATURE_TOO_LOW")
        if self.humidity > 95:
            issues.append("HUMIDITY_CRITICAL")
            
        return {'safety_issues': issues}

# Create greenhouse monitor and scheduler
greenhouse = GreenhouseMonitor()
scheduler = TaskScheduler()

print("=== Greenhouse Monitoring Scheduler Demo ===")

# Add tasks with different priorities and frequencies
tasks = [
    ScheduledTask("Safety Check", greenhouse.safety_check, TaskPriority.CRITICAL, 10.0),
    ScheduledTask("Temperature", greenhouse.read_temperature, TaskPriority.HIGH, 5.0),
    ScheduledTask("Climate Control", greenhouse.control_climate, TaskPriority.HIGH, 2.0),
    ScheduledTask("Humidity", greenhouse.read_humidity, TaskPriority.MEDIUM, 1.0),
    ScheduledTask("Soil Moisture", greenhouse.check_soil_moisture, TaskPriority.LOW, 0.2)
]

for task in tasks:
    scheduler.add_task(task)

print("Scheduler configured with tasks:")
status = scheduler.get_status()
for task_info in status['tasks']:
    print(f"  {task_info['name']:15s}: {task_info['priority']:8s} priority, "
          f"{task_info['frequency']:4.1f} Hz")

print("\n=== Running Scheduler Cycles ===")

# Run scheduler for several cycles
for cycle in range(8):
    executed = scheduler.run_cycle()
    
    if executed:
        print(f"\nCycle {cycle + 1}:")
        for task_exec in executed:
            print(f"  {task_exec['name']:15s}: {task_exec['execution_time']:5.1f}ms "
                  f"({task_exec['priority']} priority)")
            if task_exec['result']:
                result_str = str(task_exec['result'])[:50]  # Truncate long results
                print(f"    Result: {result_str}")
    
    # Simulate real-time delays
    time.sleep(0.15)

print("\n=== Final Scheduler Status ===")
final_status = scheduler.get_status()
print(f"Total cycles executed: {final_status['cycle_count']}")
print("Task execution summary:")
for task_info in final_status['tasks']:
    print(f"  {task_info['name']:15s}: last run {task_info['last_run']}, "
          f"next in {task_info['next_run']}, "
          f"avg time {task_info['avg_execution']}")

```

## Try it

### Exercise 1: state machine design

Design a state machine for an automatic door system with the following requirements:

- States: Closed, Opening, Open, Closing, Blocked

- Sensors: motion detector, safety beam, door position

- Events: motion detected, safety beam broken, timer expired, manual override

/// details | Sample Solution
    type: success
    open: false

**State machine design**:

**States and transitions**:

- **Closed** → Opening: motion detected AND safety beam clear

- **Opening** → Open: door fully open (position sensor)

- **Open** → Closing: timer expired (5 seconds) AND no motion

- **Closing** → Closed: door fully closed (position sensor)

- **Closing** → Blocked: safety beam broken

- **Blocked** → Opening: safety beam clear

- **Any state** → Closed: manual override

**Entry/exit actions**:

- **Opening**: start motor forward, start safety monitoring

- **Open**: stop motor, start timer

- **Closing**: start motor reverse, monitor safety beam

- **Blocked**: stop motor, sound alarm

- **Closed**: stop motor, disable timer

**Safety considerations**:

- Safety beam overrides all automatic movement

- Manual override always works regardless of sensors

- Motor stops immediately when entering Blocked state
///

### Exercise 2: PID tuning analysis

A robotic arm position control system uses PID control. Given these observations, suggest tuning adjustments:

- **P-only (Kp=5)**: reaches 90% of target quickly but has 10% steady-state error

- **PI (Kp=5, Ki=0.5)**: eliminates steady-state error but oscillates around target

- **PID (Kp=5, Ki=0.5, Kd=2)**: stable but very slow to reach target

/// details | Sample Solution
    type: success
    open: false

**Analysis and recommendations**:

**P-only issues**: Steady-state error indicates insufficient gain OR need for integral term

- Solution: Add integral term to eliminate steady-state error

**PI oscillation**: Too much integral gain causing overshoot and hunting

- Solution: Reduce Ki from 0.5 to 0.1-0.2, or reduce Kp slightly

**PID sluggishness**: High derivative gain is over-dampening the system

- Solution: Reduce Kd from 2 to 0.5-1.0

**Recommended tuning**:

- Start with Kp=4, Ki=0.2, Kd=0.8

- Fine-tune by observing step response

- Increase Kp for faster response (watch for overshoot)

- Increase Ki only if steady-state error persists

- Adjust Kd to balance speed vs stability
///

### Exercise 3: scheduling optimisation

A manufacturing robot has these control tasks:

- **Vision processing**: 20ms execution time, needs 10 Hz

- **Motion control**: 2ms execution time, needs 50 Hz  

- **Safety monitoring**: 1ms execution time, needs 100 Hz

- **Data logging**: 5ms execution time, needs 1 Hz

Design a scheduling strategy that ensures all tasks meet their timing requirements.

/// details | Sample Solution
    type: success
    open: false

**Timing analysis**:

- Safety: 1ms every 10ms (10% CPU)

- Motion: 2ms every 20ms (10% CPU)  

- Vision: 20ms every 100ms (20% CPU)

- Logging: 5ms every 1000ms (0.5% CPU)

- **Total CPU usage**: ~40.5%

**Recommended strategy**: Rate-monotonic priority scheduling

1. **Highest priority**: Safety (100 Hz) - most frequent, safety-critical

2. **High priority**: Motion (50 Hz) - time-critical for smooth movement

3. **Medium priority**: Vision (10 Hz) - important but can tolerate some jitter

4. **Low priority**: Logging (1 Hz) - least time-critical

**Implementation approach**:

- Use interrupt-driven scheduling for safety monitoring

- Run motion control in main control loop

- Execute vision processing when motion control is idle

- Perform data logging during low-activity periods

**Verification**: Ensure worst-case execution time for all higher-priority tasks doesn't exceed the period of any lower-priority task
///


## Recap

Three algorithmic patterns form the foundation of mechatronic control systems:

**State machines**: manage discrete behaviours through clearly defined states, transitions, and events. Essential for systems with distinct operating modes and complex logic.

**PID controllers**: provide smooth, continuous regulation by combining proportional, integral, and derivative responses to error. Critical for maintaining precise control of continuous variables.

**Scheduling algorithms**: coordinate multiple tasks by determining execution order and timing. Necessary for systems with multiple sensors, actuators, and control requirements.

**Pattern selection**: choose based on the nature of control requirements - discrete vs continuous, single vs multiple tasks, simple vs complex logic.

**Integration**: real systems often combine all three patterns, using state machines for mode management, PID for continuous control, and scheduling for task coordination.

Understanding these patterns enables the design of robust, predictable, and maintainable control systems that can handle complex mechatronic applications.

See also [10.2 Implementing closed loop control](../../Chapter-10-Programming-and-building/10-02-Implementing-closed-loop-control/index.md) for practical implementation techniques.
