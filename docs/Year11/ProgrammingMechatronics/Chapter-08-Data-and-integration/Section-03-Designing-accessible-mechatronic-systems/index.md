# 8.3 Designing accessible mechatronic systems

## Why it matters

Accessible design ensures that mechatronic systems can be used safely and effectively by people with diverse abilities and needs. When we design systems that work for people with disabilities, we often create solutions that benefit everyone. This approach, called universal design, leads to more robust, flexible, and user-friendly systems.

In mechatronics, accessibility considerations directly impact hardware selection, interface design, control algorithms, and safety systems. Understanding these requirements early in the design process prevents costly redesigns and ensures compliance with accessibility standards.

## Concepts

### Inclusive design principles

Inclusive design starts with understanding the diverse ways people interact with technology. Rather than retrofitting accessibility features, inclusive design considers accessibility from the beginning.

The seven principles of universal design guide mechatronic system development:

1. **Equitable use** - the system is useful to people with diverse abilities

2. **Flexibility in use** - accommodates preferences and abilities  

3. **Simple and intuitive use** - easy to understand regardless of experience

4. **Perceptible information** - communicates effectively to all users

5. **Tolerance for error** - minimises hazards of accidental actions

6. **Low physical effort** - efficient and comfortable to use

7. **Size and space** - appropriate for approach and use

```kroki-plantuml
@startuml
!theme plain
skinparam monochrome true
skinparam shadowing false

package "Accessible Mechatronic System" {
    [Input Interface] --> [Control System]
    [Control System] --> [Output Interface]
    [Control System] --> [Safety Systems]
    
    note top of [Input Interface] : Multiple input methods\n(voice, touch, gesture, switch)
    note right of [Control System] : Adaptive algorithms\nCustomisable responses
    note bottom of [Output Interface] : Multi-modal feedback\n(visual, audio, haptic)
    note left of [Safety Systems] : Emergency stops\nForce limits\nTimeout protection
}
@enduml
```

### Physical accessibility requirements

Physical disabilities affect how users can reach, grasp, and operate controls. Mechatronic systems must accommodate varying ranges of motion, strength, and dexterity.

**Reach limitations** require careful placement of controls and interfaces. The standard reach envelope for wheelchair users differs significantly from standing users. Controls should be positioned between 380mm and 1220mm from the floor, with the optimal range being 600mm to 1000mm.

**Force limitations** affect the maximum pressure users can apply to buttons, levers, or touch interfaces. Many users cannot apply more than 5 pounds (22 Newtons) of force. Some users may have tremors or involuntary movements that require larger target areas and stable activation methods.

```python
# Example: Force-sensitive control with accessibility considerations
class AccessibleControl:
    def __init__(self, max_force_newtons=22):
        self.max_required_force = max_force_newtons
        self.activation_threshold = max_force_newtons * 0.3  # 30% of max
        self.hold_time_required = 0.5  # seconds to prevent accidental activation
        self.last_activation = 0
        
    def check_activation(self, applied_force, current_time):
        """Check if control should activate based on force and timing."""
        if applied_force >= self.activation_threshold:
            if current_time - self.last_activation >= self.hold_time_required:
                self.last_activation = current_time
                return True
        return False
    
    def set_sensitivity(self, user_preference):
        """Allow users to adjust activation threshold."""
        # Range from 10% to 50% of maximum force
        sensitivity = max(0.1, min(0.5, user_preference))
        self.activation_threshold = self.max_required_force * sensitivity

# Example usage
control = AccessibleControl()
control.set_sensitivity(0.2)  # User prefers lighter touch

# Simulate control activation
import time
current_time = time.time()
light_pressure = 5  # Newtons
heavy_pressure = 15  # Newtons

print(f"Light pressure activates: {control.check_activation(light_pressure, current_time)}")
print(f"Heavy pressure activates: {control.check_activation(heavy_pressure, current_time)}")
```

### Alternative interface methods

Traditional interfaces like buttons and joysticks may not work for all users. Mechatronic systems should support multiple input methods.

**Switch interfaces** allow users with limited mobility to control complex systems using simple on/off switches. These can be activated by head movement, eye blinks, or slight hand pressure.

**Voice control** provides hands-free operation but requires robust speech recognition that works with varied speech patterns, including those affected by conditions like cerebral palsy or stroke.

**Eye tracking** enables control through gaze direction, useful for users with severe mobility limitations.

```python
# Example: Multi-modal input system
class MultiModalInput:
    def __init__(self):
        self.input_methods = {
            'switch': False,
            'voice': False, 
            'touch': False,
            'eye_track': False
        }
        self.command_history = []
        
    def register_switch_input(self, switch_id, state):
        """Handle switch-based input (head switch, sip-puff, etc.)"""
        if state and switch_id == 1:  # Primary action switch
            self.add_command('PRIMARY_ACTION')
        elif state and switch_id == 2:  # Navigation switch
            self.add_command('NAVIGATE')
            
    def register_voice_command(self, command_text, confidence):
        """Handle voice input with confidence filtering"""
        if confidence > 0.7:  # Only accept high-confidence recognition
            command = command_text.upper().replace(' ', '_')
            self.add_command(f'VOICE_{command}')
            
    def register_eye_gaze(self, x_position, y_position, dwell_time):
        """Handle eye tracking input"""
        if dwell_time > 1.0:  # Require 1 second dwell for activation
            self.add_command(f'GAZE_{x_position}_{y_position}')
            
    def add_command(self, command):
        """Add command to history and process"""
        self.command_history.append(command)
        print(f"Command received: {command}")
        
# Example usage
input_system = MultiModalInput()

# Simulate different input methods
input_system.register_switch_input(1, True)  # Head switch activated
input_system.register_voice_command("move forward", 0.85)  # High confidence
input_system.register_eye_gaze(320, 240, 1.2)  # Gaze at center for 1.2 seconds

print(f"Command history: {input_system.command_history}")
```

### Guided example

Let's design an accessible robotic arm controller for users with varying physical abilities.

The controller needs to accommodate users who may have:

- Limited reach (wheelchair users)

- Reduced grip strength

- Tremors or involuntary movements

- Visual impairments

- Speech difficulties

```kroki-plantuml
@startuml
!theme plain
skinparam monochrome true
skinparam shadowing false

class AccessibleRobotController {
    - height_adjustable_interface
    - force_adjustable_controls
    - voice_recognition
    - audio_feedback
    - emergency_stop_systems
    + adjust_interface_height()
    + set_force_sensitivity()
    + enable_voice_control()
    + provide_audio_status()
    + trigger_emergency_stop()
}

class SafetyMonitor {
    - force_limits
    - motion_boundaries
    - timeout_settings
    + monitor_force_application()
    + check_motion_limits()
    + handle_timeouts()
}

class MultimodalFeedback {
    - visual_display
    - audio_alerts
    - haptic_feedback
    + display_status()
    + play_audio_cue()
    + provide_vibration()
}

AccessibleRobotController --> SafetyMonitor
AccessibleRobotController --> MultimodalFeedback
@enduml
```

```python
# Accessible robotic arm controller implementation
class AccessibleRobotController:
    def __init__(self):
        self.interface_height = 800  # mm from floor
        self.force_sensitivity = 0.3  # 30% of maximum force
        self.voice_enabled = False
        self.audio_feedback = True
        self.safety_monitor = SafetyMonitor()
        self.feedback_system = MultimodalFeedback()
        
    def adjust_interface_height(self, user_reach_range):
        """Adjust interface based on user's reach capabilities"""
        min_height, max_height = user_reach_range
        # Keep controls within user's comfortable reach
        self.interface_height = min(max_height - 100, max(min_height + 100, 700))
        self.feedback_system.announce(f"Interface adjusted to {self.interface_height}mm")
        
    def set_force_sensitivity(self, user_max_force):
        """Set activation force based on user capabilities"""
        # Use 30% of user's maximum comfortable force
        self.force_sensitivity = user_max_force * 0.3
        self.feedback_system.announce(f"Force sensitivity set to {self.force_sensitivity:.1f}N")
        
    def move_arm(self, direction, force_applied):
        """Move robotic arm with safety checks"""
        if not self.safety_monitor.check_force_safe(force_applied):
            self.feedback_system.alert("Force too high - movement stopped")
            return False
            
        if not self.safety_monitor.check_motion_safe(direction):
            self.feedback_system.alert("Motion boundary reached")
            return False
            
        # Execute movement
        self.feedback_system.announce(f"Moving {direction}")
        return True
        
class SafetyMonitor:
    def __init__(self):
        self.max_safe_force = 50  # Newtons
        self.motion_boundaries = {
            'x': (-500, 500),  # mm
            'y': (-300, 300),
            'z': (0, 600)
        }
        
    def check_force_safe(self, force):
        """Verify applied force is within safe limits"""
        return force <= self.max_safe_force
        
    def check_motion_safe(self, direction):
        """Verify motion stays within safe boundaries"""
        # Simplified check - in practice would track current position
        return True  # Placeholder for actual boundary checking
        
class MultimodalFeedback:
    def __init__(self):
        self.audio_enabled = True
        self.visual_enabled = True
        self.haptic_enabled = True
        
    def announce(self, message):
        """Provide audio feedback for status updates"""
        if self.audio_enabled:
            print(f"🔊 {message}")
            
    def alert(self, warning):
        """Provide multi-modal warning feedback"""
        if self.audio_enabled:
            print(f"⚠️ AUDIO ALERT: {warning}")
        if self.visual_enabled:
            print(f"🚨 VISUAL ALERT: {warning}")
        if self.haptic_enabled:
            print(f"📳 HAPTIC ALERT: {warning}")

# Example usage
controller = AccessibleRobotController()

# Configure for a wheelchair user with limited grip strength
user_reach = (600, 1200)  # mm from floor
user_max_force = 15  # Newtons

controller.adjust_interface_height(user_reach)
controller.set_force_sensitivity(user_max_force)

# Attempt to move the arm
controller.move_arm("forward", 4.5)  # Within safe force limit
controller.move_arm("up", 60)  # Exceeds safe force limit
```

### Safety systems and emergency stops

Safety systems are critical for accessible mechatronic designs. Users with disabilities may have reduced ability to respond quickly to dangerous situations, making robust safety systems essential.

**Emergency stop systems** must be easily accessible and operable with minimal force. Multiple emergency stop methods should be available - large red buttons, voice commands, and automatic timeout systems.

**Force limiting** prevents the system from applying dangerous forces. This is especially important when users have reduced sensation or awareness of applied forces.

**Automatic shutdown** activates when the system detects unusual conditions like loss of user input, sensor failures, or boundary violations.

```python
# Safety system implementation
class EmergencyStopSystem:
    def __init__(self):
        self.stop_buttons = []
        self.voice_stop_enabled = True
        self.auto_timeout = 30  # seconds of inactivity
        self.last_user_input = 0
        self.system_stopped = False
        
    def add_stop_button(self, button_id, location, max_force_required=5):
        """Add an emergency stop button with accessibility requirements"""
        button = {
            'id': button_id,
            'location': location,
            'max_force': max_force_required,  # Newtons
            'size': 'large',  # Minimum 50mm diameter
            'colour': 'red'
        }
        self.stop_buttons.append(button)
        
    def check_voice_stop(self, audio_input):
        """Monitor for voice emergency stop commands"""
        stop_words = ['stop', 'emergency', 'help', 'halt']
        if any(word in audio_input.lower() for word in stop_words):
            self.trigger_emergency_stop('voice')
            return True
        return False
        
    def check_timeout(self, current_time):
        """Check if system should stop due to user inactivity"""
        if current_time - self.last_user_input > self.auto_timeout:
            self.trigger_emergency_stop('timeout')
            return True
        return False
        
    def trigger_emergency_stop(self, trigger_source):
        """Immediately stop all system operations"""
        self.system_stopped = True
        print(f"🛑 EMERGENCY STOP triggered by: {trigger_source}")
        print("🔧 All actuators disabled")
        print("🔊 Audible alarm activated")
        print("💡 Visual warning lights activated")

# Example usage
safety_system = EmergencyStopSystem()

# Add multiple emergency stop buttons for accessibility
safety_system.add_stop_button(1, "left_armrest", max_force_required=3)
safety_system.add_stop_button(2, "right_armrest", max_force_required=3)
safety_system.add_stop_button(3, "head_height", max_force_required=2)  # Head-operated

# Test different stop triggers
import time
current_time = time.time()

safety_system.check_voice_stop("emergency stop now")
safety_system.last_user_input = current_time - 35  # Simulate 35 seconds of inactivity
safety_system.check_timeout(current_time)
```

### Maintainability considerations

Accessible systems must remain accessible throughout their operational life. This requires consideration of maintenance, updates, and long-term usability.

**Accessible maintenance points** ensure that system upkeep doesn't require specialized tools or positions that may be difficult for maintenance staff with disabilities.

**Remote diagnostics** allow troubleshooting without physical access to all system components.

**User-adjustable settings** should be easy to modify as user needs change over time.

## Try it

/// details | Exercise 1: Reach envelope analysis
    type: question
    open: false

**Task**: Calculate the accessible control zone for a mechatronic workstation that must accommodate both standing and wheelchair users.

Given constraints:

- Standing user reach: 1200-1800mm height, 600mm forward reach

- Wheelchair user reach: 600-1200mm height, 500mm forward reach

- All users should be able to reach primary controls

/// details | Sample solution
    type: success
    open: false

**Solution**: The overlapping accessible zone is:

- Height: 600-1200mm (wheelchair user's upper range)

- Forward reach: 500mm maximum (wheelchair user's limit)

- Optimal primary control placement: 700-1000mm height, within 400mm reach

This ensures all users can access critical controls comfortably.
///
///

/// details | Exercise 2: Safety system design
    type: question
    open: false

**Task**: Design an emergency stop system for a robotic assistant that serves users with varying physical abilities. Consider users who may have:

- Limited hand mobility

- Speech impairments  

- Visual impairments

- Cognitive differences affecting emergency response

What redundant stop methods would you implement?

/// details | Sample solution
    type: success
    open: false

**Solution**: Multiple redundant emergency stop methods:

1. **Physical buttons**: Large (50mm+), low-force (2-5N), multiple locations

2. **Voice activation**: Multiple trigger words, low confidence threshold during emergencies

3. **Proximity detection**: Stop if user moves away suddenly

4. **Timeout systems**: Auto-stop after inactivity periods

5. **Remote stop**: Caregiver or supervisor override capability

6. **Gesture recognition**: Simple movements like raised hand

7. **Pressure mats**: Stop if user falls or leaves designated area

Each method should provide audio, visual, and haptic confirmation of stop activation.
///
///

/// details | Exercise 3: Force-sensitive control programming
    type: question
    open: false

**Task**: Write Python code for a control system that automatically adjusts its force sensitivity based on user performance data. The system should:

- Track successful vs. accidental activations

- Adjust sensitivity to minimize false triggers

- Provide feedback to help users understand the current settings

/// details | Sample solution
    type: success
    open: false

```python
class AdaptiveForceControl:
    def __init__(self):
        self.sensitivity = 0.3  # Start at 30% of max force
        self.successful_activations = 0
        self.accidental_activations = 0
        self.adjustment_threshold = 10  # Evaluate after 10 interactions
        
    def record_activation(self, was_intentional):
        """Record whether activation was intentional"""
        if was_intentional:
            self.successful_activations += 1
        else:
            self.accidental_activations += 1
            
        # Adjust sensitivity if we have enough data
        total_activations = self.successful_activations + self.accidental_activations
        if total_activations >= self.adjustment_threshold:
            self.adjust_sensitivity()
            
    def adjust_sensitivity(self):
        """Adjust sensitivity based on success rate"""
        total = self.successful_activations + self.accidental_activations
        success_rate = self.successful_activations / total
        
        if success_rate < 0.7:  # Too many accidents
            self.sensitivity = min(0.8, self.sensitivity + 0.1)
            print(f"Increasing sensitivity to {self.sensitivity:.1f}")
        elif success_rate > 0.95:  # Very few accidents
            self.sensitivity = max(0.1, self.sensitivity - 0.05)
            print(f"Decreasing sensitivity to {self.sensitivity:.1f}")
            
        # Reset counters
        self.successful_activations = 0
        self.accidental_activations = 0

# Example usage
control = AdaptiveForceControl()

# Simulate user learning curve
for i in range(15):
    # Early interactions have more accidents
    intentional = i > 3 and (i % 4 != 0)  # Accidents on multiples of 4, after initial learning
    control.record_activation(intentional)
    print(f"Activation {i+1}: {'Intentional' if intentional else 'Accidental'}")
```
///
///

## Recap

Accessible mechatronic system design requires understanding diverse user needs and implementing inclusive solutions from the beginning. Key considerations include:

- **Physical accessibility**: Accommodate reach limitations, force restrictions, and motor control variations

- **Interface diversity**: Provide multiple input methods including switches, voice, and eye tracking

- **Safety systems**: Implement redundant emergency stops and force limiting appropriate for users with reduced response capabilities

- **Maintainability**: Ensure long-term accessibility through remote diagnostics and user-adjustable settings

Accessible design creates more robust systems that benefit all users while ensuring compliance with accessibility standards and ethical design principles.

## See also

- Section 7.3: Sensors, actuators, and end effectors - for understanding component selection

- Section 9.2: Autonomous control features - for safety interlocks and fallbacks

- Section 10.4: User interfaces for control - for accessible interface design patterns
