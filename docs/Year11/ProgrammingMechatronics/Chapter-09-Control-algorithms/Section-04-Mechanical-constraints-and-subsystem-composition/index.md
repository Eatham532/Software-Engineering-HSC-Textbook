# 9.4 Mechanical constraints and subsystem composition

## Why it matters


Mechatronic systems consist of multiple mechanical, electrical, and software components working together. Understanding how mechanical constraints limit movement and how to effectively combine subsystems is crucial for designing reliable, coordinated systems.

Poor subsystem design can lead to mechanical interference, reduced precision, or system failure. Proper composition strategies ensure that individual components work harmoniously to achieve complex system goals.

## Concepts

### Degrees of freedom and motion constraints

**Degrees of freedom (DOF)** represent the number of independent ways a mechanical system can move. Understanding DOF helps determine what movements are possible and how to control them.

```python
# Example: analyzing degrees of freedom for common mechanisms
class MechanicalSystem:
    def __init__(self, name, dof, constraints):
        self.name = name
        self.dof = dof
        self.constraints = constraints
        
    def describe_motion(self):
        return f"{self.name}: {self.dof} DOF - {self.constraints}"

# Common mechanical systems
systems = [
    MechanicalSystem("Door hinge", 1, "Rotation around single axis"),
    MechanicalSystem("2D robot arm (2 joints)", 2, "X-Y positioning in plane"),
    MechanicalSystem("3D printer head", 3, "X, Y, Z translation"),
    MechanicalSystem("Robot gripper", 1, "Open/close parallel jaws"),
    MechanicalSystem("6-axis robot arm", 6, "Full 3D position + orientation")
]

for system in systems:
    print(system.describe_motion())

```

### Guided example

Let's analyze a robotic arm subsystem and its motion constraints:

```kroki-plantuml
@startuml
!define RECTANGLE class

skinparam monochrome true
skinparam shadowing false

rectangle "Base (Fixed)" as Base
rectangle "Shoulder Joint\n(Rotation)" as Shoulder
rectangle "Elbow Joint\n(Rotation)" as Elbow
rectangle "Wrist Joint\n(Rotation)" as Wrist
rectangle "End Effector\n(Gripper)" as Gripper

Base --> Shoulder : "DOF 1: Base rotation\n(0° to 360°)"
Shoulder --> Elbow : "DOF 2: Shoulder pitch\n(-90° to +90°)"
Elbow --> Wrist : "DOF 3: Elbow bend\n(0° to 135°)"
Wrist --> Gripper : "DOF 4: Wrist rotation\n(-180° to +180°)"

note right of Base
  **Workspace constraints:**
  - Maximum reach: 800mm
  - Minimum reach: 150mm
  - Payload limit: 2kg
  - Speed limit: 50°/sec
end note

@enduml

```

```python
import math

class RobotArmConstraints:
    def __init__(self):
        # Joint limits (degrees)
        self.joint_limits = {
            "base": (-180, 180),
            "shoulder": (-90, 90),
            "elbow": (0, 135),
            "wrist": (-180, 180)
        }
        
        # Physical constraints
        self.max_reach = 800  # mm
        self.min_reach = 150  # mm
        self.max_payload = 2.0  # kg
        self.max_speed = 50  # degrees/second
        
    def check_joint_limits(self, joint_name, angle):
        """Check if joint angle is within safe limits."""
        if joint_name not in self.joint_limits:
            return False
        min_angle, max_angle = self.joint_limits[joint_name]
        return min_angle <= angle <= max_angle
    
    def calculate_reach(self, shoulder_angle, elbow_angle):
        """Calculate end effector reach given joint angles."""
        # Simplified calculation for 2-segment arm
        upper_arm = 400  # mm
        forearm = 400   # mm
        
        # Convert to radians
        shoulder_rad = math.radians(shoulder_angle)
        elbow_rad = math.radians(elbow_angle)
        
        # Calculate end effector position
        x = upper_arm * math.cos(shoulder_rad) + forearm * math.cos(shoulder_rad + elbow_rad)
        y = upper_arm * math.sin(shoulder_rad) + forearm * math.sin(shoulder_rad + elbow_rad)
        
        reach = math.sqrt(x**2 + y**2)
        return reach
    
    def is_position_reachable(self, shoulder_angle, elbow_angle):
        """Check if position is within workspace constraints."""
        if not self.check_joint_limits("shoulder", shoulder_angle):
            return False, "Shoulder angle out of range"
        if not self.check_joint_limits("elbow", elbow_angle):
            return False, "Elbow angle out of range"
            
        reach = self.calculate_reach(shoulder_angle, elbow_angle)
        if reach > self.max_reach:
            return False, f"Position too far: {reach:.1f}mm > {self.max_reach}mm"
        if reach < self.min_reach:
            return False, f"Position too close: {reach:.1f}mm < {self.min_reach}mm"
            
        return True, f"Position reachable: {reach:.1f}mm"

# Example usage
arm = RobotArmConstraints()
result, message = arm.is_position_reachable(45, 90)
print(f"Target position: {message}")

```

### Subsystem composition strategies

Effective mechatronic systems combine multiple subsystems with clear interfaces and responsibilities:

```kroki-plantuml
@startuml
!define RECTANGLE class

skinparam monochrome true
skinparam shadowing false

package "Mobile Robot System" {
    rectangle "Navigation\nSubsystem" as Nav {
        rectangle "GPS/IMU Sensors" as NavSensors
        rectangle "Path Planning" as PathPlan
        rectangle "Obstacle Avoidance" as ObstAvoid
    }
    
    rectangle "Mobility\nSubsystem" as Mobility {
        rectangle "Motor Controllers" as Motors
        rectangle "Wheel Encoders" as Encoders
        rectangle "Drive Logic" as Drive
    }
    
    rectangle "Manipulation\nSubsystem" as Manip {
        rectangle "Robot Arm" as Arm
        rectangle "Gripper" as Grip
        rectangle "Vision System" as Vision
    }
    
    rectangle "Control\nSubsystem" as Control {
        rectangle "Main Controller" as MainCtrl
        rectangle "Safety Monitor" as Safety
        rectangle "Communication" as Comm
    }
}

Nav --> Control : "Target coordinates"
Control --> Mobility : "Movement commands"
Control --> Manip : "Manipulation tasks"
Mobility --> Control : "Position feedback"
Manip --> Control : "Task status"
Safety --> Control : "Emergency stop"

note bottom of Control
  **Coordination principles:**
  - Single control authority
  - Clear communication protocols
  - Failure detection and recovery
  - Modular interfaces
end note

@enduml

```

### Coordination and communication patterns

```python
class SubsystemInterface:
    def __init__(self, name):
        self.name = name
        self.status = "idle"
        self.error_state = None
        
    def get_status(self):
        return {"name": self.name, "status": self.status, "error": self.error_state}
    
    def send_command(self, command):
        raise NotImplementedError("Subclasses must implement send_command")
    
    def emergency_stop(self):
        self.status = "emergency_stop"
        print(f"{self.name}: Emergency stop activated")

class NavigationSubsystem(SubsystemInterface):
    def __init__(self):
        super().__init__("Navigation")
        self.current_position = (0, 0)
        self.target_position = None
        
    def send_command(self, command):
        if command["type"] == "goto":
            self.target_position = command["coordinates"]
            self.status = "navigating"
            return f"Navigating to {self.target_position}"
        elif command["type"] == "stop":
            self.status = "idle"
            return "Navigation stopped"
    
    def update_position(self, x, y):
        self.current_position = (x, y)
        # Check if target reached
        if self.target_position:
            distance = ((x - self.target_position[0])**2 + (y - self.target_position[1])**2)**0.5
            if distance < 0.1:  # Close enough
                self.status = "target_reached"

class MobilitySubsystem(SubsystemInterface):
    def __init__(self):
        super().__init__("Mobility")
        self.wheel_speeds = {"left": 0, "right": 0}
        
    def send_command(self, command):
        if command["type"] == "move":
            self.wheel_speeds = command["speeds"]
            self.status = "moving"
            return f"Moving: {self.wheel_speeds}"
        elif command["type"] == "stop":
            self.wheel_speeds = {"left": 0, "right": 0}
            self.status = "idle"
            return "Mobility stopped"

class SystemCoordinator:
    def __init__(self):
        self.subsystems = {}
        self.emergency_state = False
        
    def register_subsystem(self, subsystem):
        self.subsystems[subsystem.name] = subsystem
        
    def coordinate_movement(self, target_x, target_y):
        """Coordinate navigation and mobility subsystems."""
        if self.emergency_state:
            return "System in emergency state"
            
        nav = self.subsystems.get("Navigation")
        mobility = self.subsystems.get("Mobility")
        
        if not nav or not mobility:
            return "Required subsystems not available"
            
        # Send navigation command
        nav_result = nav.send_command({
            "type": "goto",
            "coordinates": (target_x, target_y)
        })
        
        # Calculate initial movement
        mobility_result = mobility.send_command({
            "type": "move",
            "speeds": {"left": 50, "right": 50}  # Forward movement
        })
        
        return f"Coordination started: {nav_result}, {mobility_result}"
    
    def emergency_stop_all(self):
        """Stop all subsystems immediately."""
        self.emergency_state = True
        for subsystem in self.subsystems.values():
            subsystem.emergency_stop()
        return "All subsystems stopped"
    
    def get_system_status(self):
        """Get status of all subsystems."""
        status = {"emergency": self.emergency_state, "subsystems": {}}
        for name, subsystem in self.subsystems.items():
            status["subsystems"][name] = subsystem.get_status()
        return status

# Example usage
coordinator = SystemCoordinator()
coordinator.register_subsystem(NavigationSubsystem())
coordinator.register_subsystem(MobilitySubsystem())

print("=== System Coordination Example ===")
result = coordinator.coordinate_movement(5.0, 3.0)
print(f"Movement command: {result}")

status = coordinator.get_system_status()
print(f"System status: {status}")

```

### Mechanical interference and collision avoidance

When composing subsystems, it's crucial to prevent mechanical interference:

```python
class CollisionChecker:
    def __init__(self):
        # Define collision zones for different subsystems
        self.collision_zones = {
            "robot_arm": {
                "base_radius": 200,  # mm
                "max_reach": 800,
                "height_range": (0, 1000)
            },
            "mobile_base": {
                "length": 600,  # mm
                "width": 400,
                "height": 200
            }
        }
        
    def check_arm_base_collision(self, arm_position, base_position):
        """Check if robot arm conflicts with mobile base movement."""
        arm_x, arm_y = arm_position
        base_x, base_y = base_position
        
        # Calculate distance between arm and base
        distance = math.sqrt((arm_x - base_x)**2 + (arm_y - base_y)**2)
        
        # Check if arm is within base collision zone
        base_half_length = self.collision_zones["mobile_base"]["length"] / 2
        if distance < base_half_length + 100:  # 100mm safety margin
            return False, "Arm too close to mobile base"
        
        return True, "No collision detected"
    
    def get_safe_zones(self):
        """Return safe operating zones for each subsystem."""
        return {
            "arm_safe_zone": "Outside mobile base + 100mm margin",
            "base_safe_zone": "Clear of arm swing radius + margin",
            "coordination_required": "When both systems operate simultaneously"
        }

# Example usage
checker = CollisionChecker()
safe, message = checker.check_arm_base_collision((300, 200), (0, 0))
print(f"Collision check: {message}")

```

## Try it

### Exercise 1: Degrees of freedom analysis

Analyze the degrees of freedom for a 3-axis CNC machine with X, Y, and Z movement capabilities.

/// details | Exercise 1: Sample Solution
    type: success
    open: false

```python
class CNCMachine:
    def __init__(self):
        self.axes = {
            "X": {"range": (0, 300), "current": 0},  # mm
            "Y": {"range": (0, 200), "current": 0},  # mm
            "Z": {"range": (0, 100), "current": 0}   # mm
        }
        self.total_dof = len(self.axes)
        
    def describe_dof(self):
        print(f"CNC Machine has {self.total_dof} degrees of freedom:")
        for axis, config in self.axes.items():
            range_min, range_max = config["range"]
            print(f"  {axis}-axis: {range_min}mm to {range_max}mm")
        
        print("\nMotion capabilities:")
        print("  - Point-to-point positioning in 3D space")
        print("  - Linear interpolation between points")
        print("  - Complex 3D toolpaths")
        
    def check_position_valid(self, x, y, z):
        positions = {"X": x, "Y": y, "Z": z}
        for axis, pos in positions.items():
            range_min, range_max = self.axes[axis]["range"]
            if not (range_min <= pos <= range_max):
                return False, f"{axis} position {pos} outside range {range_min}-{range_max}"
        return True, "Position within workspace"

cnc = CNCMachine()
cnc.describe_dof()

```

Output shows 3 DOF system with independent linear axes, enabling full 3D positioning within workspace.
///

### Exercise 2: Subsystem composition

Design a pick-and-place robot system with separate vision, arm, and gripper subsystems.

/// details | Exercise 2: Sample Solution
    type: success
    open: false

```python
class VisionSubsystem(SubsystemInterface):
    def __init__(self):
        super().__init__("Vision")
        self.detected_objects = []
        
    def send_command(self, command):
        if command["type"] == "scan":
            # Simulate object detection
            self.detected_objects = [
                {"id": 1, "position": (100, 150), "type": "cube"},
                {"id": 2, "position": (200, 300), "type": "cylinder"}
            ]
            self.status = "objects_detected"
            return f"Found {len(self.detected_objects)} objects"

class GripperSubsystem(SubsystemInterface):
    def __init__(self):
        super().__init__("Gripper")
        self.is_open = True
        self.holding_object = False
        
    def send_command(self, command):
        if command["type"] == "grip":
            self.is_open = False
            self.holding_object = True
            self.status = "gripping"
            return "Object gripped"
        elif command["type"] == "release":
            self.is_open = True
            self.holding_object = False
            self.status = "released"
            return "Object released"

class PickPlaceCoordinator(SystemCoordinator):
    def execute_pick_and_place(self):
        """Coordinate vision, arm, and gripper for pick-and-place task."""
        vision = self.subsystems.get("Vision")
        gripper = self.subsystems.get("Gripper")
        
        # Step 1: Vision scan
        vision.send_command({"type": "scan"})
        objects = vision.detected_objects
        
        if not objects:
            return "No objects detected"
        
        # Step 2: Pick first object
        target = objects[0]
        gripper.send_command({"type": "grip"})
        
        # Step 3: Move to place location (simplified)
        place_location = (400, 400)
        
        # Step 4: Release object
        gripper.send_command({"type": "release"})
        
        return f"Pick and place completed: {target['type']} moved to {place_location}"

# Usage example
coordinator = PickPlaceCoordinator()
coordinator.register_subsystem(VisionSubsystem())
coordinator.register_subsystem(GripperSubsystem())

result = coordinator.execute_pick_and_place()
print(f"Task result: {result}")

```

This demonstrates coordinated operation between subsystems with clear command flow and status tracking.
///

### Exercise 3: Collision avoidance

Implement collision checking for a dual-arm robot system where both arms share a workspace.

/// details | Exercise 3: Sample Solution
    type: success
    open: false

```python
class DualArmCollisionChecker:
    def __init__(self):
        self.arm_configs = {
            "left_arm": {"base_position": (-300, 0), "reach": 600},
            "right_arm": {"base_position": (300, 0), "reach": 600}
        }
        self.safety_margin = 100  # mm
        
    def check_arm_collision(self, left_pos, right_pos):
        """Check if two arm end effectors are too close."""
        distance = math.sqrt((left_pos[0] - right_pos[0])**2 + 
                           (left_pos[1] - right_pos[1])**2)
        
        if distance < self.safety_margin:
            return False, f"Arms too close: {distance:.1f}mm < {self.safety_margin}mm"
        return True, f"Safe distance: {distance:.1f}mm"
    
    def get_safe_workspace_zones(self):
        """Define safe operating zones for each arm."""
        return {
            "left_arm_zone": "X < -50, avoid right workspace",
            "right_arm_zone": "X > 50, avoid left workspace", 
            "shared_zone": "-50 ≤ X ≤ 50, coordination required",
            "safety_protocols": [
                "Coordinate movement in shared zone",
                "Monitor minimum separation distance",
                "Emergency stop if collision imminent"
            ]
        }

checker = DualArmCollisionChecker()
safe, message = checker.check_arm_collision((-100, 200), (150, 200))
print(f"Collision check: {message}")

zones = checker.get_safe_workspace_zones()
print("Safe zones:", zones)

```

This ensures both arms can operate safely without mechanical interference.
///

## Recap

Understanding mechanical constraints and subsystem composition is essential for creating coordinated mechatronic systems. Key concepts include:

- **Degrees of freedom**: The number of independent motions a system can perform

- **Motion constraints**: Physical limits that restrict system movement and operation

- **Subsystem interfaces**: Clear communication protocols between system components  

- **Coordination strategies**: Methods for orchestrating multiple subsystems effectively

- **Collision avoidance**: Preventing mechanical interference between moving parts

- **Safety considerations**: Emergency stops and failure detection across subsystems

Effective subsystem composition requires understanding both the capabilities and limitations of individual components, then designing coordination strategies that enable complex system behaviors while maintaining safety and reliability.

See also [7.3 Sensors, actuators, and end effectors](../../Chapter-07-Mechatronics-foundations/Section-03-Sensors-actuators-end-effectors/index.md) for component selection and [9.3 Algorithmic patterns for control](../Section-03-Algorithmic-patterns-control/index.md) for control strategies.







