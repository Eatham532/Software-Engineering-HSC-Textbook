# 10.4 User interfaces for control

## Why it matters

When you build a mechatronic system, the user interface is how people interact with and understand your device. A well-designed interface can make the difference between a system that's easy to use and one that's confusing or even dangerous.

Good control interfaces provide clear information about what the system is doing, allow users to give commands easily, and most importantly, communicate problems clearly when something goes wrong. Whether it's a simple LED status light or a comprehensive dashboard, the interface is your system's voice.

## Concepts

### Command Line Interfaces (CLI) for control

**Command Line Interfaces** are text-based interfaces where users type commands to control the system. While they might seem old-fashioned, CLIs are powerful for mechatronic systems because they:

- Work over simple communication links (like serial connections)

- Can be automated with scripts

- Provide precise control with detailed parameters

- Are easy to debug and log

Let's build a basic CLI for a robotic arm:

```python
class RoboticArmCLI:
    def __init__(self):
        self.arm_position = {"x": 0, "y": 0, "z": 0}
        self.gripper_closed = False
        self.arm_speed = 50  # Percentage
        self.emergency_stop = False
        self.last_error = None
        
        # Available commands
        self.commands = {
            "move": self.move_arm,
            "grip": self.control_gripper,
            "speed": self.set_speed,
            "status": self.show_status,
            "stop": self.emergency_stop_command,
            "reset": self.reset_system,
            "help": self.show_help
        }
        
    def parse_command(self, command_line):
        """Parse a command line into command and arguments"""
        parts = command_line.strip().split()
        if not parts:
            return None, []
        
        command = parts[0].lower()
        args = parts[1:]
        return command, args
        
    def move_arm(self, args):
        """Move arm to specified position: move x y z"""
        if self.emergency_stop:
            return "❌ Error: Emergency stop active. Use 'reset' first."
            
        if len(args) != 3:
            return "❌ Error: Move command requires 3 coordinates (x y z)"
            
        try:
            new_x, new_y, new_z = map(float, args)
            
            # Safety checks
            if abs(new_x) > 100 or abs(new_y) > 100 or abs(new_z) > 100:
                return "❌ Error: Position out of safe range (-100 to 100)"
                
            # Simulate movement
            self.arm_position = {"x": new_x, "y": new_y, "z": new_z}
            return f"✅ Moving to position: x={new_x}, y={new_y}, z={new_z}"
            
        except ValueError:
            return "❌ Error: Invalid coordinates. Use numbers only."
            
    def control_gripper(self, args):
        """Control gripper: grip open/close"""
        if self.emergency_stop:
            return "❌ Error: Emergency stop active. Use 'reset' first."
            
        if len(args) != 1:
            return "❌ Error: Grip command requires 'open' or 'close'"
            
        action = args[0].lower()
        if action == "open":
            self.gripper_closed = False
            return "✅ Gripper opened"
        elif action == "close":
            self.gripper_closed = True
            return "✅ Gripper closed"
        else:
            return "❌ Error: Grip command must be 'open' or 'close'"
            
    def set_speed(self, args):
        """Set arm movement speed: speed 0-100"""
        if len(args) != 1:
            return "❌ Error: Speed command requires one value (0-100)"
            
        try:
            new_speed = int(args[0])
            if 0 <= new_speed <= 100:
                self.arm_speed = new_speed
                return f"✅ Speed set to {new_speed}%"
            else:
                return "❌ Error: Speed must be between 0 and 100"
        except ValueError:
            return "❌ Error: Speed must be a number"
            
    def show_status(self, args):
        """Show current system status"""
        status_lines = [
            "🤖 Robotic Arm Status:",
            f"   Position: x={self.arm_position['x']}, y={self.arm_position['y']}, z={self.arm_position['z']}",
            f"   Gripper: {'Closed' if self.gripper_closed else 'Open'}",
            f"   Speed: {self.arm_speed}%",
            f"   Emergency Stop: {'🚨 ACTIVE' if self.emergency_stop else '✅ Clear'}"
        ]
        
        if self.last_error:
            status_lines.append(f"   Last Error: {self.last_error}")
            
        return "\n".join(status_lines)
        
    def emergency_stop_command(self, args):
        """Activate emergency stop"""
        self.emergency_stop = True
        return "🚨 EMERGENCY STOP ACTIVATED - All movement halted"
        
    def reset_system(self, args):
        """Reset emergency stop and errors"""
        self.emergency_stop = False
        self.last_error = None
        return "✅ System reset - Emergency stop cleared"
        
    def show_help(self, args):
        """Show available commands"""
        help_text = """
🤖 Robotic Arm Control Commands:
   move x y z    - Move arm to position (x, y, z coordinates)
   grip open/close - Open or close gripper
   speed 0-100   - Set movement speed percentage
   status        - Show current system status
   stop          - Emergency stop (halts all movement)
   reset         - Clear emergency stop and errors
   help          - Show this help message
   exit          - Exit control interface

Examples:
   move 10 20 30    - Move to position x=10, y=20, z=30
   grip close       - Close the gripper
   speed 75         - Set speed to 75%
        """
        return help_text.strip()
        
    def process_command(self, command_line):
        """Process a single command and return the result"""
        command, args = self.parse_command(command_line)
        
        if command is None:
            return "❌ Error: Empty command. Type 'help' for available commands."
            
        if command == "exit":
            return "exit"
            
        if command in self.commands:
            try:
                result = self.commands[command](args)
                return result
            except Exception as e:
                self.last_error = str(e)
                return f"❌ Error: {e}"
        else:
            return f"❌ Error: Unknown command '{command}'. Type 'help' for available commands."
            
    def run_interactive_session(self):
        """Run an interactive CLI session"""
        print("🤖 Robotic Arm Control Interface")
        print("Type 'help' for commands or 'exit' to quit")
        print("-" * 40)
        
        while True:
            try:
                user_input = input("arm> ").strip()
                if not user_input:
                    continue
                    
                result = self.process_command(user_input)
                
                if result == "exit":
                    print("👋 Goodbye!")
                    break
                    
                print(result)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except EOFError:
                print("\n👋 Goodbye!")
                break

# Demonstrate the CLI
arm_cli = RoboticArmCLI()

# Test various commands
test_commands = [
    "help",
    "status", 
    "move 25 30 15",
    "grip close",
    "speed 80",
    "status",
    "move 200 50 25",  # This should fail - out of range
    "stop",
    "move 10 10 10",   # This should fail - emergency stop active
    "reset",
    "status"
]

print("🧪 Testing CLI Commands:")
print("=" * 50)

for cmd in test_commands:
    print(f"\nCommand: {cmd}")
    result = arm_cli.process_command(cmd)
    print(result)

```

### Dashboard interfaces

**Dashboards** provide a visual overview of your system's status. They show multiple pieces of information at once and update in real-time. For mechatronic systems, dashboards typically display:

- Current sensor readings

- System status indicators

- Control buttons or sliders

- Alerts and warnings

- Historical data or trends

Let's create a text-based dashboard for a greenhouse monitoring system:

```python
import time
import random
from datetime import datetime

class GreenhouseDashboard:
    def __init__(self):
        # Sensor data
        self.temperature = 22.5
        self.humidity = 65.0
        self.soil_moisture = 45.0
        self.light_level = 750
        
        # Control systems
        self.heater_on = False
        self.fan_on = False
        self.irrigation_on = False
        self.grow_lights_on = False
        
        # System status
        self.alerts = []
        self.last_update = datetime.now()
        
        # Settings
        self.target_temp = 24.0
        self.target_humidity = 70.0
        self.target_soil_moisture = 60.0
        
    def update_sensors(self):
        """Simulate sensor readings"""
        # Add some random variation to simulate real sensors
        self.temperature += random.uniform(-0.5, 0.5)
        self.humidity += random.uniform(-2.0, 2.0)
        self.soil_moisture += random.uniform(-1.0, 1.0)
        self.light_level += random.uniform(-50, 50)
        
        # Keep values in reasonable ranges
        self.temperature = max(10, min(40, self.temperature))
        self.humidity = max(20, min(95, self.humidity))
        self.soil_moisture = max(0, min(100, self.soil_moisture))
        self.light_level = max(0, min(1000, self.light_level))
        
        self.last_update = datetime.now()
        
    def check_conditions(self):
        """Check for alert conditions"""
        self.alerts.clear()
        
        # Temperature alerts
        if self.temperature < self.target_temp - 3:
            self.alerts.append("🔵 Temperature too low")
        elif self.temperature > self.target_temp + 3:
            self.alerts.append("🔴 Temperature too high")
            
        # Humidity alerts
        if self.humidity < self.target_humidity - 10:
            self.alerts.append("🟡 Humidity too low")
        elif self.humidity > self.target_humidity + 10:
            self.alerts.append("🟡 Humidity too high")
            
        # Soil moisture alerts
        if self.soil_moisture < 30:
            self.alerts.append("🟤 Soil too dry - irrigation needed")
        elif self.soil_moisture > 80:
            self.alerts.append("🟤 Soil too wet - check drainage")
            
        # Light level alerts
        if self.light_level < 300:
            self.alerts.append("🌙 Low light - consider grow lights")
            
    def update_controls(self):
        """Update control systems based on conditions"""
        # Temperature control
        if self.temperature < self.target_temp - 1:
            self.heater_on = True
            self.fan_on = False
        elif self.temperature > self.target_temp + 1:
            self.heater_on = False
            self.fan_on = True
        else:
            self.heater_on = False
            self.fan_on = False
            
        # Irrigation control
        if self.soil_moisture < 50:
            self.irrigation_on = True
        else:
            self.irrigation_on = False
            
        # Grow lights control
        if self.light_level < 400:
            self.grow_lights_on = True
        else:
            self.grow_lights_on = False
            
    def create_progress_bar(self, value, max_value, width=20, target=None):
        """Create a text-based progress bar"""
        percentage = min(100, (value / max_value) * 100)
        filled = int((percentage / 100) * width)
        empty = width - filled
        
        bar = "█" * filled + "░" * empty
        
        # Add target marker if provided
        if target is not None:
            target_pos = int((target / max_value) * width)
            if 0 <= target_pos < width:
                bar_list = list(bar)
                bar_list[target_pos] = "│"
                bar = "".join(bar_list)
        
        return f"[{bar}] {value:.1f}"
        
    def render_dashboard(self):
        """Render the complete dashboard"""
        # Clear screen (simplified)
        print("\n" * 50)  # Scroll up to simulate clear
        
        print("🏡 GREENHOUSE CONTROL DASHBOARD")
        print("=" * 60)
        print(f"Last Update: {self.last_update.strftime('%H:%M:%S')}")
        print()
        
        # Sensor readings section
        print("📊 SENSOR READINGS")
        print("-" * 30)
        
        temp_bar = self.create_progress_bar(self.temperature, 40, target=self.target_temp)
        print(f"🌡️  Temperature: {temp_bar}°C (Target: {self.target_temp}°C)")
        
        humidity_bar = self.create_progress_bar(self.humidity, 100, target=self.target_humidity)
        print(f"💧 Humidity:    {humidity_bar}% (Target: {self.target_humidity}%)")
        
        moisture_bar = self.create_progress_bar(self.soil_moisture, 100, target=self.target_soil_moisture)
        print(f"🌱 Soil Moisture: {moisture_bar}% (Target: {self.target_soil_moisture}%)")
        
        light_bar = self.create_progress_bar(self.light_level, 1000)
        print(f"☀️  Light Level:  {light_bar} lux")
        print()
        
        # Control systems section
        print("🎛️  CONTROL SYSTEMS")
        print("-" * 30)
        
        heater_status = "🔥 ON " if self.heater_on else "⚫ OFF"
        fan_status = "💨 ON " if self.fan_on else "⚫ OFF"
        irrigation_status = "💦 ON " if self.irrigation_on else "⚫ OFF"
        lights_status = "💡 ON " if self.grow_lights_on else "⚫ OFF"
        
        print(f"Heater:      {heater_status}")
        print(f"Fan:         {fan_status}")
        print(f"Irrigation:  {irrigation_status}")
        print(f"Grow Lights: {lights_status}")
        print()
        
        # Alerts section
        print("🚨 ALERTS")
        print("-" * 30)
        if self.alerts:
            for alert in self.alerts:
                print(f"   {alert}")
        else:
            print("   ✅ All systems normal")
        print()
        
        # Status summary
        print("📈 SYSTEM STATUS")
        print("-" * 30)
        active_systems = sum([self.heater_on, self.fan_on, self.irrigation_on, self.grow_lights_on])
        print(f"Active Control Systems: {active_systems}/4")
        print(f"Alert Level: {'🔴 HIGH' if len(self.alerts) >= 3 else '🟡 MEDIUM' if len(self.alerts) >= 1 else '🟢 LOW'}")
        
    def run_dashboard(self, duration=30):
        """Run the dashboard for a specified duration"""
        print("Starting Greenhouse Dashboard...")
        print("Press Ctrl+C to stop")
        
        try:
            start_time = time.time()
            while time.time() - start_time < duration:
                self.update_sensors()
                self.check_conditions()
                self.update_controls()
                self.render_dashboard()
                time.sleep(2)  # Update every 2 seconds
                
        except KeyboardInterrupt:
            print("\n\nDashboard stopped.")

# Create and demonstrate the dashboard
greenhouse = GreenhouseDashboard()

# Show a few dashboard updates
print("🧪 Greenhouse Dashboard Demo:")
print("=" * 50)

for i in range(3):
    print(f"\n--- Update {i+1} ---")
    greenhouse.update_sensors()
    greenhouse.check_conditions()
    greenhouse.update_controls()
    greenhouse.render_dashboard()
    time.sleep(1)

```

### Clear status and error messaging

**Good error messages** are crucial for mechatronic systems. They should be:

- **Clear**: Easy to understand without technical jargon

- **Specific**: Tell exactly what went wrong

- **Actionable**: Suggest what the user should do

- **Visible**: Hard to miss or ignore

Let's build a comprehensive messaging system:

```python
class SystemMessaging:
    def __init__(self):
        self.message_history = []
        self.current_status = "OK"
        
        # Message severity levels
        self.SEVERITY_LEVELS = {
            "INFO": {"symbol": "ℹ️", "color": "blue"},
            "WARNING": {"symbol": "⚠️", "color": "yellow"},
            "ERROR": {"symbol": "❌", "color": "red"},
            "CRITICAL": {"symbol": "🚨", "color": "red"},
            "SUCCESS": {"symbol": "✅", "color": "green"}
        }
        
    def create_message(self, severity, title, description, action=None, code=None):
        """Create a structured message"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        message = {
            "timestamp": timestamp,
            "severity": severity,
            "title": title,
            "description": description,
            "action": action,
            "code": code,
            "id": len(self.message_history) + 1
        }
        
        self.message_history.append(message)
        return message
        
    def format_message(self, message):
        """Format a message for display"""
        severity_info = self.SEVERITY_LEVELS.get(message["severity"], {"symbol": "•", "color": "white"})
        
        # Main message line
        output = f"{severity_info['symbol']} [{message['timestamp']}] {message['title']}"
        
        # Description
        if message["description"]:
            output += f"\n   {message['description']}"
            
        # Suggested action
        if message["action"]:
            output += f"\n   💡 Action: {message['action']}"
            
        # Error code
        if message["code"]:
            output += f"\n   🔍 Code: {message['code']}"
            
        return output
        
    def info(self, title, description=None, action=None):
        """Log an info message"""
        message = self.create_message("INFO", title, description, action)
        return self.format_message(message)
        
    def warning(self, title, description=None, action=None, code=None):
        """Log a warning message"""
        message = self.create_message("WARNING", title, description, action, code)
        return self.format_message(message)
        
    def error(self, title, description=None, action=None, code=None):
        """Log an error message"""
        message = self.create_message("ERROR", title, description, action, code)
        return self.format_message(message)
        
    def critical(self, title, description=None, action=None, code=None):
        """Log a critical error message"""
        message = self.create_message("CRITICAL", title, description, action, code)
        self.current_status = "CRITICAL"
        return self.format_message(message)
        
    def success(self, title, description=None):
        """Log a success message"""
        message = self.create_message("SUCCESS", title, description)
        return self.format_message(message)
        
    def show_recent_messages(self, count=5):
        """Show the most recent messages"""
        recent = self.message_history[-count:] if len(self.message_history) > count else self.message_history
        
        output = f"📝 Recent Messages (showing {len(recent)}):\n"
        output += "-" * 40 + "\n"
        
        for message in recent:
            output += self.format_message(message) + "\n\n"
            
        return output

# Example usage for different mechatronic scenarios
messaging = SystemMessaging()

print("🧪 Testing System Messaging:")
print("=" * 50)

# Scenario 1: Normal operation
print(messaging.info("System startup", "Robotic arm control system initialized"))
print()

print(messaging.success("Calibration complete", "All axes calibrated successfully"))
print()

# Scenario 2: Warning situations
print(messaging.warning(
    "High temperature detected", 
    "Motor temperature is 78°C, approaching safety limit of 80°C",
    "Reduce operation speed or allow cooling time",
    "TEMP_HIGH_001"
))
print()

print(messaging.warning(
    "Low battery level",
    "Battery charge is 15%, system may shut down soon",
    "Connect charger or return to charging station",
    "POWER_LOW_002"
))
print()

# Scenario 3: Error situations
print(messaging.error(
    "Sensor communication failure",
    "Unable to read from pressure sensor on port 3",
    "Check sensor wiring and connections",
    "SENSOR_COMM_003"
))
print()

print(messaging.error(
    "Movement blocked",
    "Obstacle detected in path, cannot complete movement to target position",
    "Clear obstacle or choose alternate path",
    "MOTION_BLOCKED_004"
))
print()

# Scenario 4: Critical situations
print(messaging.critical(
    "Emergency stop activated",
    "Safety interlock triggered due to unexpected object in work area",
    "Remove object and reset safety system before continuing",
    "SAFETY_STOP_005"
))
print()

# Show message history
print(messaging.show_recent_messages())

```

### Guided example

Let's put it all together by building a complete control interface for an automated sorting system:

```python
class SortingSystemInterface:
    def __init__(self):
        self.system = {
            "conveyor_speed": 0,  # 0-100%
            "sorting_arm_position": "home",
            "items_processed": 0,
            "items_sorted": {"red": 0, "blue": 0, "green": 0, "reject": 0},
            "system_running": False,
            "emergency_stop": False
        }
        
        self.messaging = SystemMessaging()
        self.current_item = None
        self.processing_queue = ["red", "blue", "green", "red", "reject", "blue"]
        
    def render_main_display(self):
        """Render the main control display"""
        print("\n" * 30)  # Clear screen
        print("🏭 AUTOMATED SORTING SYSTEM CONTROL")
        print("=" * 60)
        
        # System status header
        status_icon = "🟢" if self.system["system_running"] else "🔴"
        emergency_icon = "🚨" if self.system["emergency_stop"] else "✅"
        
        print(f"System Status: {status_icon} {'RUNNING' if self.system['system_running'] else 'STOPPED'}")
        print(f"Emergency Stop: {emergency_icon} {'ACTIVE' if self.system['emergency_stop'] else 'CLEAR'}")
        print()
        
        # Main controls
        print("🎛️  MAIN CONTROLS")
        print("-" * 20)
        print("1. Start System")
        print("2. Stop System") 
        print("3. Emergency Stop")
        print("4. Reset Emergency")
        print("5. Adjust Speed")
        print()
        
        # Current operation
        print("⚙️  CURRENT OPERATION")
        print("-" * 20)
        print(f"Conveyor Speed: {self.system['conveyor_speed']}%")
        print(f"Sorting Arm: {self.system['sorting_arm_position']}")
        print(f"Current Item: {self.current_item if self.current_item else 'None'}")
        print(f"Items in Queue: {len(self.processing_queue)}")
        print()
        
        # Statistics
        print("📊 SORTING STATISTICS")
        print("-" * 20)
        print(f"Total Processed: {self.system['items_processed']}")
        for color, count in self.system['items_sorted'].items():
            print(f"{color.capitalize():>10}: {count:>3}")
        print()
        
        # Quick actions
        print("⚡ QUICK ACTIONS")
        print("-" * 15)
        print("s - Start/Stop   e - Emergency   r - Reset   q - Quit")
        
    def process_menu_choice(self, choice):
        """Process main menu selections"""
        if choice == "1":
            return self.start_system()
        elif choice == "2":
            return self.stop_system()
        elif choice == "3":
            return self.emergency_stop()
        elif choice == "4":
            return self.reset_emergency()
        elif choice == "5":
            return self.adjust_speed()
        else:
            return self.messaging.warning("Invalid selection", f"'{choice}' is not a valid menu option")
            
    def process_quick_action(self, action):
        """Process quick action keys"""
        if action == "s":
            if self.system["system_running"]:
                return self.stop_system()
            else:
                return self.start_system()
        elif action == "e":
            return self.emergency_stop()
        elif action == "r":
            return self.reset_emergency()
        elif action == "q":
            return "quit"
        else:
            return self.messaging.warning("Unknown action", f"'{action}' is not a recognized quick action")
            
    def start_system(self):
        """Start the sorting system"""
        if self.system["emergency_stop"]:
            return self.messaging.error(
                "Cannot start system",
                "Emergency stop is active",
                "Reset emergency stop first",
                "START_BLOCKED_001"
            )
            
        if self.system["system_running"]:
            return self.messaging.warning("System already running")
            
        self.system["system_running"] = True
        self.system["conveyor_speed"] = 50  # Default speed
        return self.messaging.success("System started", "Sorting operations beginning")
        
    def stop_system(self):
        """Stop the sorting system normally"""
        if not self.system["system_running"]:
            return self.messaging.info("System already stopped")
            
        self.system["system_running"] = False
        self.system["conveyor_speed"] = 0
        self.system["sorting_arm_position"] = "home"
        return self.messaging.info("System stopped", "Normal shutdown completed")
        
    def emergency_stop(self):
        """Activate emergency stop"""
        self.system["emergency_stop"] = True
        self.system["system_running"] = False
        self.system["conveyor_speed"] = 0
        self.system["sorting_arm_position"] = "emergency_position"
        
        return self.messaging.critical(
            "Emergency stop activated",
            "All motion halted immediately for safety",
            "Investigate cause and reset when safe",
            "EMERGENCY_001"
        )
        
    def reset_emergency(self):
        """Reset emergency stop"""
        if not self.system["emergency_stop"]:
            return self.messaging.info("Emergency stop not active")
            
        self.system["emergency_stop"] = False
        self.system["sorting_arm_position"] = "home"
        return self.messaging.success("Emergency reset", "System ready for normal operation")
        
    def adjust_speed(self):
        """Adjust conveyor speed"""
        if not self.system["system_running"]:
            return self.messaging.warning(
                "Cannot adjust speed",
                "System must be running to adjust speed"
            )
            
        print("\n🎚️  Speed Adjustment")
        print(f"Current speed: {self.system['conveyor_speed']}%")
        print("Enter new speed (0-100):")
        
        try:
            new_speed = int(input("Speed: "))
            if 0 <= new_speed <= 100:
                old_speed = self.system["conveyor_speed"]
                self.system["conveyor_speed"] = new_speed
                return self.messaging.success(
                    "Speed adjusted",
                    f"Conveyor speed changed from {old_speed}% to {new_speed}%"
                )
            else:
                return self.messaging.error(
                    "Invalid speed",
                    f"Speed must be between 0 and 100, got {new_speed}"
                )
        except ValueError:
            return self.messaging.error("Invalid input", "Please enter a number")
        except (EOFError, KeyboardInterrupt):
            return self.messaging.info("Speed adjustment cancelled")
            
    def simulate_sorting_operation(self):
        """Simulate processing one item"""
        if not self.system["system_running"] or self.system["emergency_stop"]:
            return None
            
        if not self.processing_queue:
            return self.messaging.info("Queue empty", "No more items to process")
            
        # Get next item
        item_color = self.processing_queue.pop(0)
        self.current_item = item_color
        
        # Simulate processing time based on speed
        processing_time = max(0.5, 2.0 - (self.system["conveyor_speed"] / 100))
        
        # Process the item
        self.system["items_processed"] += 1
        self.system["items_sorted"][item_color] += 1
        
        # Move sorting arm
        self.system["sorting_arm_position"] = f"sorting_{item_color}"
        
        result = self.messaging.success(
            f"Item sorted",
            f"{item_color.capitalize()} item sorted successfully (#{self.system['items_processed']})"
        )
        
        # Return arm to home
        self.system["sorting_arm_position"] = "home"
        self.current_item = None
        
        return result
        
    def run_interface(self):
        """Run the main interface loop"""
        print("🏭 Sorting System Interface Starting...")
        
        last_message = None
        last_auto_process = time.time()
        
        while True:
            self.render_main_display()
            
            # Show last message if any
            if last_message:
                print("\n" + "=" * 60)
                print("📢 SYSTEM MESSAGE:")
                print(last_message)
                print("=" * 60)
                
            # Auto-process items if system is running
            if (self.system["system_running"] and 
                not self.system["emergency_stop"] and 
                time.time() - last_auto_process > 3):  # Process every 3 seconds
                
                auto_result = self.simulate_sorting_operation()
                if auto_result:
                    last_message = auto_result
                last_auto_process = time.time()
                
            print("\nCommand (1-5, s/e/r/q, or Enter for refresh): ", end="")
            
            try:
                user_input = input().strip().lower()
                
                if not user_input:
                    continue  # Just refresh
                    
                if user_input == "q":
                    print("👋 Shutting down interface...")
                    break
                    
                # Check if it's a quick action (single character)
                if len(user_input) == 1 and user_input in "serq":
                    result = self.process_quick_action(user_input)
                    if result == "quit":
                        break
                    last_message = result
                else:
                    # Try processing as menu choice
                    last_message = self.process_menu_choice(user_input)
                    
            except (KeyboardInterrupt, EOFError):
                print("\n👋 Interface terminated.")
                break
            except Exception as e:
                last_message = self.messaging.error("System error", str(e))

# Demonstrate the interface
sorting_interface = SortingSystemInterface()

# Run a quick demo
print("🧪 Sorting System Interface Demo:")
print("=" * 50)

# Simulate some operations
demo_commands = ["1", "5", "75", "s", "e", "r", "2"]
for cmd in demo_commands:
    print(f"\nSimulating command: {cmd}")
    if cmd == "75":
        # Skip speed input simulation for demo
        continue
    elif cmd in "12345":
        result = sorting_interface.process_menu_choice(cmd)
    else:
        result = sorting_interface.process_quick_action(cmd)
    
    if result and result != "quit":
        print(result)
    
    time.sleep(1)

print("\n🎯 Interface demo complete!")

```

## Try it

/// details | Exercise 1: Design a CLI for different mechatronic systems
    type: question
    open: false

Create CLI interfaces for various mechatronic applications. Design commands for drone control, 3D printing, and security systems that include safety-critical commands and example usage sequences.

/// details | Sample Solution
    type: success
    open: false

```python
def design_cli_commands(system_type):
    """Design CLI commands for different mechatronic systems"""
    
    cli_designs = {
        "drone": {
            "commands": [
                "takeoff [height] - Takeoff to specified height (default 10m)",
                "land [location] - Land at current position or specified coordinates", 
                "goto x y z - Fly to coordinates x,y,z",
                "hover [duration] - Hover in place for specified seconds",
                "camera on/off - Control camera recording",
                "battery - Show battery status and flight time remaining",
                "emergency - Emergency landing",
                "status - Show position, altitude, speed, and system status"
            ],
            "safety_commands": ["emergency", "land", "battery"],
            "example_usage": [
                "takeoff 15",
                "goto 100 200 15", 
                "camera on",
                "hover 30",
                "land"
            ]
        },
        
        "3d_printer": {
            "commands": [
                "load filename.gcode - Load G-code file for printing",
                "start - Begin printing loaded file",
                "pause - Pause current print job",
                "resume - Resume paused print job", 
                "stop - Stop current print and return to home",
                "temp hotend/bed temp - Set temperatures",
                "move x y z - Move print head to position",
                "home [axis] - Home all axes or specific axis",
                "status - Show temperatures, progress, and position"
            ],
            "safety_commands": ["stop", "home", "temp"],
            "example_usage": [
                "load test_cube.gcode",
                "temp hotend 200",
                "temp bed 60", 
                "home",
                "start"
            ]
        },
        
        "security_system": {
            "commands": [
                "arm home/away - Arm system for home or away mode",
                "disarm [code] - Disarm system with security code",
                "status zone - Show status of all zones or specific zone",
                "bypass zone_number - Temporarily bypass a zone",
                "test zone_number - Test a specific sensor/zone",
                "history [hours] - Show event history",
                "alert silence - Silence current alarms",
                "config - Enter configuration mode"
            ],
            "safety_commands": ["disarm", "alert", "status"],
            "example_usage": [
                "status",
                "arm away",
                "status zone 3",
                "disarm 1234"
            ]
        }
    }
    
    if system_type in cli_designs:
        design = cli_designs[system_type]
        print(f"\n🎛️  CLI Design for {system_type.replace('_', ' ').title()}")
        print("=" * 50)
        
        print("Available Commands:")
        for cmd in design["commands"]:
            print(f"  {cmd}")
            
        print(f"\nSafety-Critical Commands: {', '.join(design['safety_commands'])}")
        
        print("\nExample Usage Sequence:")
        for i, cmd in enumerate(design["example_usage"], 1):
            print(f"  {i}. {cmd}")
            
    else:
        print(f"CLI design not available for {system_type}")

# Test different CLI designs
for system in ["drone", "3d_printer", "security_system"]:
    design_cli_commands(system)

```

///

///

/// details | Exercise 2: Create status indicators for different conditions
    type: question
    open: false

Build visual status indicators for various system states. Create a status dashboard that shows battery level, connectivity, sensor status, motor status, and safety conditions with appropriate icons and color coding.

/// details | Sample Solution
    type: success
    open: false

```python
class StatusIndicators:
    def __init__(self):
        self.indicators = {
            "battery": {"level": 85, "charging": False},
            "connectivity": {"wifi": True, "bluetooth": False, "cellular": True},
            "sensors": {"temperature": "ok", "pressure": "warning", "motion": "error"},
            "motors": {"left": "running", "right": "stopped", "gripper": "running"},
            "safety": {"emergency_stop": False, "doors_closed": True, "area_clear": True}
        }
        
    def battery_indicator(self):
        """Create battery status indicator"""
        level = self.indicators["battery"]["level"]
        charging = self.indicators["battery"]["charging"]
        
        # Choose battery icon based on level
        if level >= 75:
            icon = "🔋"
        elif level >= 50:
            icon = "🔋"
        elif level >= 25:
            icon = "🪫"
        else:
            icon = "🪫"
            
        # Add charging indicator
        if charging:
            icon += "⚡"
            
        # Color coding
        if level < 20:
            status = "🔴 CRITICAL"
        elif level < 40:
            status = "🟡 LOW"
        else:
            status = "🟢 OK"
            
        return f"{icon} {level}% {status} {'(Charging)' if charging else ''}"
        
    def connectivity_indicator(self):
        """Create connectivity status indicator"""
        wifi = "📶" if self.indicators["connectivity"]["wifi"] else "📵"
        bluetooth = "🔗" if self.indicators["connectivity"]["bluetooth"] else "❌"
        cellular = "📱" if self.indicators["connectivity"]["cellular"] else "📵"
        
        return f"WiFi: {wifi} | Bluetooth: {bluetooth} | Cellular: {cellular}"
        
    def sensor_status_indicator(self):
        """Create sensor status overview"""
        sensors = self.indicators["sensors"]
        status_icons = {"ok": "✅", "warning": "⚠️", "error": "❌", "offline": "⚫"}
        
        status_display = []
        for sensor, status in sensors.items():
            icon = status_icons.get(status, "❓")
            status_display.append(f"{sensor.title()}: {icon}")
            
        return " | ".join(status_display)
        
    def motor_status_indicator(self):
        """Create motor status display"""
        motors = self.indicators["motors"]
        status_icons = {"running": "🟢", "stopped": "🔴", "error": "❌", "maintenance": "🟡"}
        
        motor_display = []
        for motor, status in motors.items():
            icon = status_icons.get(status, "❓")
            motor_display.append(f"{motor.title()}: {icon}")
            
        return " | ".join(motor_display)
        
    def safety_status_indicator(self):
        """Create safety system overview"""
        safety = self.indicators["safety"]
        
        emergency = "🚨 ACTIVE" if safety["emergency_stop"] else "✅ Clear"
        doors = "🟢 Closed" if safety["doors_closed"] else "🔴 Open"
        area = "✅ Clear" if safety["area_clear"] else "⚠️ Occupied"
        
        # Overall safety status
        if safety["emergency_stop"] or not safety["doors_closed"]:
            overall = "🔴 UNSAFE"
        elif not safety["area_clear"]:
            overall = "🟡 CAUTION"
        else:
            overall = "🟢 SAFE"
            
        return f"{overall} | E-Stop: {emergency} | Doors: {doors} | Area: {area}"
        
    def create_status_dashboard(self):
        """Create complete status dashboard"""
        dashboard = []
        dashboard.append("🖥️  SYSTEM STATUS DASHBOARD")
        dashboard.append("=" * 50)
        dashboard.append(f"🔋 Power:     {self.battery_indicator()}")
        dashboard.append(f"📡 Network:   {self.connectivity_indicator()}")
        dashboard.append(f"📊 Sensors:   {self.sensor_status_indicator()}")
        dashboard.append(f"⚙️  Motors:    {self.motor_status_indicator()}")
        dashboard.append(f"🛡️  Safety:    {self.safety_status_indicator()}")
        dashboard.append("=" * 50)
        
        return "\n".join(dashboard)
        
    def simulate_status_changes(self):
        """Simulate various status changes"""
        scenarios = [
            {
                "name": "Normal Operation",
                "changes": {}
            },
            {
                "name": "Low Battery Warning", 
                "changes": {"battery": {"level": 25, "charging": False}}
            },
            {
                "name": "Connectivity Issues",
                "changes": {"connectivity": {"wifi": False, "bluetooth": False, "cellular": True}}
            },
            {
                "name": "Sensor Malfunction",
                "changes": {"sensors": {"temperature": "error", "pressure": "offline", "motion": "ok"}}
            },
            {
                "name": "Emergency Situation",
                "changes": {
                    "safety": {"emergency_stop": True, "doors_closed": False, "area_clear": False},
                    "motors": {"left": "stopped", "right": "stopped", "gripper": "stopped"}
                }
            }
        ]
        
        for scenario in scenarios:
            print(f"\n🎬 Scenario: {scenario['name']}")
            print("-" * 40)
            
            # Apply changes
            for category, updates in scenario["changes"].items():
                if category in self.indicators:
                    self.indicators[category].update(updates)
                    
            # Show dashboard
            print(self.create_status_dashboard())
            
            # Reset for next scenario (simplified)
            self.__init__()

# Demonstrate status indicators
status_system = StatusIndicators()
status_system.simulate_status_changes()

```

///

## Recap

In this section, you learned about creating effective user interfaces for mechatronic control systems:

**Key concepts:**

- **Command Line Interfaces (CLI)**: Text-based interfaces that provide precise control and are easy to automate and debug.

- **Dashboard interfaces**: Visual displays that show multiple pieces of information at once, with real-time updates and clear status indicators.

- **Clear messaging**: Structured approach to system messages that are clear, specific, actionable, and appropriately visible.

- **Status indicators**: Visual and text-based ways to communicate system state, using icons, colors, and progress bars effectively.

**Why this matters for mechatronics:**

- Good interfaces prevent user errors that could damage equipment or cause safety issues

- Clear status information helps operators understand what the system is doing

- Effective error messages help diagnose and fix problems quickly

- Well-designed controls make systems more efficient and easier to use

**Design principles:**

- Make critical information highly visible

- Use consistent symbols and colors across your interface

- Provide clear feedback for every user action

- Include safety features like emergency stops and confirmation dialogs

- Design for your specific users and use cases

- Test interfaces with real users in realistic conditions

**Interface types to consider:**

- Simple LED indicators for basic status

- Text-based CLIs for detailed control and automation

- Dashboard displays for monitoring multiple systems

- Mobile apps for remote control and monitoring

- Voice interfaces for hands-free operation

In the next section, we'll explore how to test these interfaces and the systems they control.







