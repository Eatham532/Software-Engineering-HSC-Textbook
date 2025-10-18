---
title: "9.2 Autonomous control features"
---

# 9.2 Autonomous control features

## Why it matters

Autonomous control is everywhere in modern mechatronic systems. From cruise control in cars to robotic vacuum cleaners, these systems can make decisions and take actions without constant human input. Understanding autonomy levels and safety systems is crucial for building reliable mechatronic devices.

When you design autonomous features, you need to balance independence with safety. The system should be smart enough to handle routine tasks on its own, but also wise enough to ask for help or shut down safely when something unexpected happens.

## Concepts

### Autonomy levels

**Autonomy** refers to how much a system can operate independently without human intervention. Different systems have different levels of autonomy, from simple automated responses to complex decision-making.

Here are the common levels of autonomy in mechatronic systems:

**Level 0: No Autonomy (Manual Control)**

- Human controls everything directly

- System only responds to immediate commands

- Example: Remote-controlled robot arm

**Level 1: Basic Assistance**

- System can perform simple, repetitive tasks

- Human monitors and can override at any time

- Example: Automatic door that opens when motion is detected

**Level 2: Partial Autonomy**

- System can handle routine operations independently

- Human supervises and intervenes when needed

- Example: Robotic lawn mower that follows a programmed pattern

**Level 3: Conditional Autonomy**

- System can make decisions based on sensor data

- Human must be ready to take control when requested

- Example: Self-parking car that handles the parking but asks driver to take over if something unexpected happens

**Level 4: High Autonomy**

- System handles most situations independently

- Human intervention only needed for complex edge cases

- Example: Industrial robot that can adapt to different part sizes and orientations

**Level 5: Full Autonomy**

- System operates completely independently

- No human intervention required under normal conditions

- Example: Fully autonomous spacecraft navigation systems

Let's see how this works in code:

```python-template
class AutonomousSystem:
    def __init__(self, autonomy_level):
        self.autonomy_level = autonomy_level
        self.human_override = False
        self.system_status = "operational"
        self.sensor_data = {}
        
    def process_sensor_input(self, sensor_type, value):
        """Process incoming sensor data"""
        self.sensor_data[sensor_type] = value
        print(f"Sensor update: {sensor_type} = {value}")
        
    def make_decision(self, situation):
        """Make decisions based on autonomy level"""
        if self.human_override:
            return "waiting_for_human"
            
        if self.autonomy_level == 0:
            return "request_human_input"
            
        elif self.autonomy_level == 1:
            # Basic assistance - only handle simple cases
            if situation == "routine_task":
                return "execute_automatically"
            else:
                return "request_human_input"
                
        elif self.autonomy_level >= 2:
            # Partial autonomy and above - handle more situations
            if situation in ["routine_task", "minor_obstacle", "pattern_deviation"]:
                return "execute_automatically"
            else:
                return "request_human_assistance"
                
        elif self.autonomy_level >= 4:
            # High autonomy - handle most situations
            if situation == "critical_failure":
                return "emergency_shutdown"
            else:
                return "execute_automatically"
                
    def demonstrate_autonomy_levels(self):
        """Show how different autonomy levels respond to situations"""
        situations = ["routine_task", "minor_obstacle", "unexpected_object", "critical_failure"]
        
        for level in range(0, 6):
            print(f"\n--- Autonomy Level {level} ---")
            self.autonomy_level = level
            
            for situation in situations:
                decision = self.make_decision(situation)
                print(f"Situation: {situation:20} → Decision: {decision}")

# Demonstrate different autonomy levels
system = AutonomousSystem(autonomy_level=2)
system.demonstrate_autonomy_levels()

```

### Safety interlocks and fallbacks

**Safety interlocks** are automatic systems that prevent dangerous operations. They act like safety nets that catch problems before they cause harm.

**Fallback systems** are backup plans that kick in when the main system fails or encounters something it can't handle.

Think of these as the "safety equipment" of autonomous systems:

```python-template
class SafeAutonomousSystem:
    def __init__(self):
        self.emergency_stop_active = False
        self.safety_interlocks = {
            "temperature": {"max": 80, "current": 25},
            "pressure": {"max": 100, "current": 45},
            "speed": {"max": 50, "current": 0},
            "position": {"safe_zone": (0, 100), "current": 50}
        }
        self.fallback_actions = []
        
    def check_safety_interlocks(self):
        """Check all safety conditions before allowing operation"""
        violations = []
        
        # Temperature check
        temp = self.safety_interlocks["temperature"]
        if temp["current"] > temp["max"]:
            violations.append(f"Temperature too high: {temp['current']}°C > {temp['max']}°C")
            
        # Pressure check
        pressure = self.safety_interlocks["pressure"]
        if pressure["current"] > pressure["max"]:
            violations.append(f"Pressure too high: {pressure['current']} > {pressure['max']}")
            
        # Speed check
        speed = self.safety_interlocks["speed"]
        if speed["current"] > speed["max"]:
            violations.append(f"Speed too high: {speed['current']} > {speed['max']}")
            
        # Position check
        pos = self.safety_interlocks["position"]
        safe_min, safe_max = pos["safe_zone"]
        if not (safe_min <= pos["current"] <= safe_max):
            violations.append(f"Position unsafe: {pos['current']} not in range {safe_min}-{safe_max}")
            
        return violations
        
    def execute_emergency_stop(self, reason):
        """Immediate shutdown for safety"""
        self.emergency_stop_active = True
        print(f"🚨 EMERGENCY STOP: {reason}")
        print("- All motion stopped")
        print("- Power reduced to safe levels")
        print("- Human operator notified")
        
    def try_fallback_action(self, primary_action):
        """Attempt fallback when primary action fails"""
        print(f"Primary action '{primary_action}' failed. Trying fallbacks...")
        
        fallback_plans = {
            "move_forward": ["reduce_speed", "find_alternate_path", "stop_and_wait"],
            "pick_up_object": ["adjust_grip", "change_approach_angle", "request_human_help"],
            "navigate_to_target": ["recalculate_route", "use_backup_sensors", "return_to_safe_position"]
        }
        
        if primary_action in fallback_plans:
            for fallback in fallback_plans[primary_action]:
                print(f"  Trying fallback: {fallback}")
                if self.attempt_action(fallback):
                    print(f"  ✅ Fallback '{fallback}' succeeded!")
                    return True
                else:
                    print(f"  ❌ Fallback '{fallback}' failed.")
        
        print("  All fallbacks exhausted. Requesting human assistance.")
        return False
        
    def attempt_action(self, action):
        """Simulate attempting an action (simplified for demo)"""
        # Simulate success/failure for different actions
        success_rates = {
            "reduce_speed": 0.9,
            "find_alternate_path": 0.7,
            "stop_and_wait": 1.0,  # Always succeeds
            "adjust_grip": 0.6,
            "change_approach_angle": 0.8,
            "request_human_help": 1.0,  # Always succeeds
            "recalculate_route": 0.8,
            "use_backup_sensors": 0.7,
            "return_to_safe_position": 0.95
        }
        
        import random
        return random.random() < success_rates.get(action, 0.5)
        
    def safe_operation_cycle(self, requested_action):
        """Perform an action safely with all checks"""
        print(f"\n🔍 Safety check for action: {requested_action}")
        
        # Step 1: Check safety interlocks
        violations = self.check_safety_interlocks()
        if violations:
            print("❌ Safety violations detected:")
            for violation in violations:
                print(f"   - {violation}")
            self.execute_emergency_stop("Safety interlock violation")
            return False
            
        # Step 2: Check if emergency stop is active
        if self.emergency_stop_active:
            print("❌ Emergency stop is active. Cannot proceed.")
            return False
            
        # Step 3: Attempt the action
        print("✅ Safety checks passed. Attempting action...")
        if self.attempt_action(requested_action):
            print(f"✅ Action '{requested_action}' completed successfully!")
            return True
        else:
            print(f"❌ Action '{requested_action}' failed.")
            # Step 4: Try fallback actions
            return self.try_fallback_action(requested_action)

# Demonstrate safety system
safe_system = SafeAutonomousSystem()

# Simulate some operations
print("=== Safe Operation Demonstration ===")
safe_system.safe_operation_cycle("move_forward")

# Simulate a safety violation
print("\n=== Safety Violation Simulation ===")
safe_system.safety_interlocks["temperature"]["current"] = 95  # Exceed safe temperature
safe_system.safe_operation_cycle("pick_up_object")

# Reset and try again
print("\n=== After Safety Reset ===")
safe_system.safety_interlocks["temperature"]["current"] = 25  # Back to safe temperature
safe_system.emergency_stop_active = False  # Reset emergency stop
safe_system.safe_operation_cycle("navigate_to_target")

```

### Guided example

Let's build a comprehensive autonomous cleaning robot that demonstrates different autonomy levels and safety features:

```python
import random
import time

class AutonomousCleaningRobot:
    def __init__(self, autonomy_level=2):
        # Robot state
        self.autonomy_level = autonomy_level
        self.position = [50, 50]  # x, y coordinates
        self.battery_level = 100
        self.dirt_collected = 0
        self.cleaning_pattern = "random"
        
        # Safety systems
        self.emergency_stop = False
        self.stuck_counter = 0
        self.max_stuck_attempts = 3
        
        # Autonomous features
        self.cleaning_mode = "auto"
        self.home_position = [0, 0]
        self.cleaning_schedule = {"enabled": False, "time": "09:00"}
        
        # Environmental awareness
        self.room_map = self.generate_room_map()
        self.obstacles = [(30, 40), (70, 20), (10, 80)]  # Known obstacles
        
    def generate_room_map(self):
        """Create a simple room map (100x100 grid)"""
        return {
            "width": 100,
            "height": 100,
            "cleaned_areas": set(),
            "dirty_areas": {(x, y) for x in range(20, 80) for y in range(20, 80) if random.random() < 0.3}
        }
        
    def detect_obstacle(self):
        """Simulate obstacle detection"""
        current_pos = tuple(self.position)
        return current_pos in self.obstacles or random.random() < 0.1  # 10% chance of random obstacle
        
    def autonomous_decision_making(self):
        """Make decisions based on autonomy level"""
        print(f"\n🤖 Robot thinking (Autonomy Level {self.autonomy_level})...")
        
        # Level 0: No autonomy - wait for commands
        if self.autonomy_level == 0:
            print("   Waiting for human command...")
            return "wait_for_command"
            
        # Check critical conditions first (all levels)
        if self.battery_level < 20:
            if self.autonomy_level >= 2:
                print("   Low battery detected. Returning to charging station.")
                return "return_to_charge"
            else:
                print("   Low battery. Requesting human assistance.")
                return "request_help"
                
        # Level 1: Basic assistance
        if self.autonomy_level == 1:
            if self.detect_obstacle():
                print("   Obstacle detected. Stopping and requesting help.")
                return "request_help"
            else:
                print("   Continuing basic cleaning pattern.")
                return "clean_forward"
                
        # Level 2+: Partial autonomy and above
        if self.autonomy_level >= 2:
            if self.detect_obstacle():
                if self.stuck_counter < self.max_stuck_attempts:
                    print("   Obstacle detected. Trying to navigate around it.")
                    return "navigate_around_obstacle"
                else:
                    print("   Stuck too many times. Requesting human help.")
                    return "request_help"
                    
            # Check if cleaning is complete
            if len(self.room_map["dirty_areas"]) == 0:
                print("   Room appears clean. Returning home.")
                return "return_home"
                
            # Continue autonomous cleaning
            print("   Continuing autonomous cleaning pattern.")
            return "autonomous_clean"
            
        # Level 4+: High autonomy
        if self.autonomy_level >= 4:
            # Advanced features like scheduling
            if self.cleaning_schedule["enabled"]:
                current_time = "09:00"  # Simplified time check
                if current_time == self.cleaning_schedule["time"]:
                    print("   Scheduled cleaning time. Starting automatic session.")
                    return "start_scheduled_clean"
                    
        return "autonomous_clean"
        
    def execute_action(self, action):
        """Execute the decided action with safety checks"""
        print(f"   Executing: {action}")
        
        # Safety interlock: Emergency stop check
        if self.emergency_stop:
            print("   ❌ Emergency stop active. All actions halted.")
            return False
            
        # Safety interlock: Battery check
        if self.battery_level < 5:
            print("   ❌ Critical battery level. Emergency shutdown.")
            self.emergency_stop = True
            return False
            
        # Execute specific actions
        if action == "clean_forward":
            self.move_and_clean([self.position[0] + 5, self.position[1]])
            
        elif action == "navigate_around_obstacle":
            # Try different directions
            directions = [[0, 5], [5, 0], [0, -5], [-5, 0]]
            for direction in directions:
                new_pos = [self.position[0] + direction[0], self.position[1] + direction[1]]
                if not self.would_hit_obstacle(new_pos):
                    self.move_and_clean(new_pos)
                    self.stuck_counter = 0  # Reset stuck counter
                    return True
            
            self.stuck_counter += 1
            print(f"   Still stuck (attempt {self.stuck_counter})")
            return False
            
        elif action == "autonomous_clean":
            # Smart cleaning pattern
            target = self.find_nearest_dirty_spot()
            if target:
                self.move_and_clean(target)
            else:
                print("   No more dirty spots found.")
                
        elif action == "return_to_charge":
            print("   Navigating to charging station...")
            self.position = [0, 0]  # Simplified - instant return
            self.battery_level = 100
            print("   ✅ Charging complete!")
            
        elif action == "return_home":
            print("   Returning to home position...")
            self.position = self.home_position.copy()
            
        elif action == "request_help":
            print("   📱 Notifying human operator for assistance...")
            print("   Robot status sent to mobile app.")
            
        elif action == "wait_for_command":
            print("   Idle - waiting for manual control...")
            
        # Update battery (cleaning uses energy)
        if action in ["clean_forward", "navigate_around_obstacle", "autonomous_clean"]:
            self.battery_level -= random.randint(1, 3)
            
        return True
        
    def move_and_clean(self, new_position):
        """Move to new position and clean if there's dirt"""
        self.position = new_position
        pos_tuple = tuple(new_position)
        
        if pos_tuple in self.room_map["dirty_areas"]:
            self.room_map["dirty_areas"].remove(pos_tuple)
            self.room_map["cleaned_areas"].add(pos_tuple)
            self.dirt_collected += 1
            print(f"   🧹 Cleaned dirt at {new_position}. Total dirt collected: {self.dirt_collected}")
        
        print(f"   Moved to position {new_position}")
        
    def find_nearest_dirty_spot(self):
        """Find the closest dirty area to clean"""
        if not self.room_map["dirty_areas"]:
            return None
            
        min_distance = float('inf')
        nearest_spot = None
        
        for dirty_spot in self.room_map["dirty_areas"]:
            distance = abs(dirty_spot[0] - self.position[0]) + abs(dirty_spot[1] - self.position[1])
            if distance < min_distance:
                min_distance = distance
                nearest_spot = list(dirty_spot)
                
        return nearest_spot
        
    def would_hit_obstacle(self, position):
        """Check if a position would hit an obstacle"""
        return tuple(position) in self.obstacles
        
    def run_cleaning_cycle(self, steps=5):
        """Run an autonomous cleaning cycle"""
        print(f"🏠 Starting cleaning cycle (Autonomy Level {self.autonomy_level})")
        print(f"   Initial status: Battery {self.battery_level}%, Position {self.position}")
        print(f"   Dirty areas remaining: {len(self.room_map['dirty_areas'])}")
        
        for step in range(steps):
            print(f"\n--- Step {step + 1} ---")
            
            # Make autonomous decision
            action = self.autonomous_decision_making()
            
            # Execute with safety checks
            success = self.execute_action(action)
            
            if not success and action == "request_help":
                print("   Human intervention required. Pausing autonomous operation.")
                break
                
            if self.emergency_stop:
                print("   Emergency stop activated. Cleaning cycle halted.")
                break
                
            # Show current status
            print(f"   Status: Battery {self.battery_level}%, Position {self.position}, Dirt collected: {self.dirt_collected}")
            
            # Brief pause for readability
            time.sleep(0.5)
            
        print(f"\n🏁 Cleaning cycle complete!")
        print(f"   Final status: Battery {self.battery_level}%, Dirt collected: {self.dirt_collected}")
        print(f"   Dirty areas remaining: {len(self.room_map['dirty_areas'])}")

# Demonstrate different autonomy levels
print("=== Autonomy Level Comparison ===")

for level in [1, 2, 4]:
    print(f"\n{'='*50}")
    print(f"Testing Autonomy Level {level}")
    print(f"{'='*50}")
    
    robot = AutonomousCleaningRobot(autonomy_level=level)
    robot.run_cleaning_cycle(steps=3)

```

## Try it

### Exercise 1: Design autonomy levels for different systems

Consider how autonomy levels might work for different mechatronic systems:

```python-exec
def design_autonomy_system(system_type):
    """Design appropriate autonomy levels for different systems"""
    
    autonomy_designs = {
        "smart_thermostat": {
            "level_1": "Respond to manual temperature changes",
            "level_2": "Learn daily patterns and adjust automatically", 
            "level_3": "Optimize for energy efficiency and comfort",
            "level_4": "Coordinate with other smart home devices",
            "safety_features": ["Temperature limits", "Frost protection", "Equipment monitoring"]
        },
        
        "automated_greenhouse": {
            "level_1": "Monitor sensors and alert on issues",
            "level_2": "Automatic watering based on soil moisture",
            "level_3": "Climate control with weather forecast integration", 
            "level_4": "Full crop management with growth optimization",
            "safety_features": ["Water flow limits", "Temperature boundaries", "Chemical safety locks"]
        },
        
        "delivery_drone": {
            "level_1": "Remote pilot control with automated stability",
            "level_2": "Waypoint navigation with obstacle avoidance",
            "level_3": "Route planning with weather adaptation",
            "level_4": "Fleet coordination and dynamic rerouting", 
            "safety_features": ["Geofencing", "Emergency landing", "Battery monitoring", "Collision avoidance"]
        }
    }
    
    if system_type in autonomy_designs:
        design = autonomy_designs[system_type]
        print(f"\n🎯 Autonomy Design for {system_type.replace('_', ' ').title()}:")
        print("   Autonomy Levels:")
        for level in range(1, 5):
            key = f"level_{level}"
            if key in design:
                print(f"   Level {level}: {design[key]}")
        
        print("   Safety Features:")
        for safety_feature in design["safety_features"]:
            print(f"   • {safety_feature}")
    else:
        print(f"Design not available for {system_type}")

# Try different systems
design_autonomy_system("smart_thermostat")
design_autonomy_system("automated_greenhouse") 
design_autonomy_system("delivery_drone")

```

### Exercise 2: Build a safety interlock system

Create a comprehensive safety system for an industrial robot:

```python-template
class IndustrialRobotSafety:
    def __init__(self):
        self.safety_zones = {
            "red_zone": {"description": "No humans allowed during operation", "violation_response": "immediate_stop"},
            "yellow_zone": {"description": "Reduced speed when humans present", "violation_response": "slow_operation"},
            "green_zone": {"description": "Safe for human interaction", "violation_response": "normal_operation"}
        }
        
        self.safety_sensors = {
            "light_curtain": {"status": "clear", "critical": True},
            "pressure_mat": {"status": "clear", "critical": True}, 
            "motion_detector": {"status": "clear", "critical": False},
            "emergency_button": {"status": "normal", "critical": True}
        }
        
        self.operational_limits = {
            "max_speed": 100,  # cm/second
            "max_force": 50,   # Newtons
            "max_reach": 200,  # cm from base
            "temperature_limit": 70  # Celsius
        }
        
        self.current_state = {
            "speed": 0,
            "force": 0, 
            "position": 0,
            "temperature": 25
        }
        
    def check_safety_zones(self, detected_humans):
        """Check if humans are in safe zones"""
        violations = []
        
        for location, zone_type in detected_humans.items():
            zone_info = self.safety_zones.get(zone_type, {})
            
            if zone_type == "red_zone":
                violations.append(f"Human detected in red zone at {location} - CRITICAL")
            elif zone_type == "yellow_zone":
                violations.append(f"Human detected in yellow zone at {location} - CAUTION")
                
        return violations
        
    def check_sensor_status(self):
        """Check all safety sensor status"""
        violations = []
        
        for sensor, info in self.safety_sensors.items():
            if info["status"] != "clear" and info["status"] != "normal":
                severity = "CRITICAL" if info["critical"] else "WARNING"
                violations.append(f"{sensor}: {info['status']} - {severity}")
                
        return violations
        
    def check_operational_limits(self):
        """Check if robot is operating within safe limits"""
        violations = []
        
        if self.current_state["speed"] > self.operational_limits["max_speed"]:
            violations.append(f"Speed exceeded: {self.current_state['speed']} > {self.operational_limits['max_speed']}")
            
        if self.current_state["force"] > self.operational_limits["max_force"]:
            violations.append(f"Force exceeded: {self.current_state['force']} > {self.operational_limits['max_force']}")
            
        if self.current_state["position"] > self.operational_limits["max_reach"]:
            violations.append(f"Reach exceeded: {self.current_state['position']} > {self.operational_limits['max_reach']}")
            
        if self.current_state["temperature"] > self.operational_limits["temperature_limit"]:
            violations.append(f"Temperature exceeded: {self.current_state['temperature']} > {self.operational_limits['temperature_limit']}")
            
        return violations
        
    def comprehensive_safety_check(self, detected_humans=None):
        """Perform complete safety assessment"""
        if detected_humans is None:
            detected_humans = {}
            
        print("🔒 Comprehensive Safety Check")
        print("-" * 40)
        
        all_violations = []
        
        # Check each safety system
        zone_violations = self.check_safety_zones(detected_humans)
        sensor_violations = self.check_sensor_status()
        limit_violations = self.check_operational_limits()
        
        all_violations.extend(zone_violations)
        all_violations.extend(sensor_violations) 
        all_violations.extend(limit_violations)
        
        # Report results
        if not all_violations:
            print("✅ All safety checks passed - Operation authorized")
            return "safe_to_operate"
        else:
            print("❌ Safety violations detected:")
            critical_violations = [v for v in all_violations if "CRITICAL" in v]
            warning_violations = [v for v in all_violations if "WARNING" in v or "CAUTION" in v]
            
            for violation in critical_violations:
                print(f"   🚨 {violation}")
            for violation in warning_violations:
                print(f"   ⚠️  {violation}")
                
            if critical_violations:
                return "emergency_stop"
            else:
                return "restricted_operation"

# Test the safety system
safety_system = IndustrialRobotSafety()

# Test 1: Normal operation
print("=== Test 1: Normal Operation ===")
result = safety_system.comprehensive_safety_check()
print(f"Result: {result}\n")

# Test 2: Human in yellow zone
print("=== Test 2: Human in Caution Zone ===")
result = safety_system.comprehensive_safety_check({"area_B": "yellow_zone"})
print(f"Result: {result}\n")

# Test 3: Critical violations
print("=== Test 3: Critical Safety Violation ===")
safety_system.safety_sensors["emergency_button"]["status"] = "pressed"
safety_system.current_state["speed"] = 150  # Exceed speed limit
result = safety_system.comprehensive_safety_check({"area_A": "red_zone"})
print(f"Result: {result}")

```

## Recap

In this section, you learned about autonomous control features in mechatronic systems:

**Key concepts:**

- **Autonomy levels**: From Level 0 (manual control) to Level 5 (full autonomy), each level defines how much the system can operate independently.

- **Safety interlocks**: Automatic safety systems that prevent dangerous operations by checking conditions before allowing actions.

- **Fallback systems**: Backup plans that activate when primary systems fail, ensuring graceful degradation rather than complete failure.

- **Decision-making frameworks**: Structured approaches for autonomous systems to evaluate situations and choose appropriate actions.

**Why this matters for mechatronics:**

- Autonomous features reduce the need for constant human supervision

- Safety systems prevent accidents and protect both equipment and people

- Fallback mechanisms ensure systems remain operational even when components fail

- Understanding autonomy levels helps you design systems appropriate for their intended use

**Design principles:**

- Start with lower autonomy levels and gradually increase capability

- Always include multiple layers of safety protection

- Plan for failure modes and provide graceful degradation

- Keep humans in the loop for critical decisions

- Test autonomous features extensively before deployment

In the next section, we'll explore algorithmic patterns that implement these autonomous control features.
