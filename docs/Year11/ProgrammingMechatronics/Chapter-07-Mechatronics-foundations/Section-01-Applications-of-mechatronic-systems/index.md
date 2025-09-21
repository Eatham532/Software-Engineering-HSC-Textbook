# 7.1 Applications of mechatronic systems

Mechatronics combines mechanical engineering, electronics, computer science, and control engineering to create intelligent systems that can sense, think, and act. These systems are everywhere in modern life, from the automatic doors at shopping centres to the robotic arms assembling cars.

## Why it matters

Understanding where mechatronic systems are used helps us recognise the scope and importance of this field. Every mechatronic application faces similar challenges: balancing cost against performance, ensuring safety, and working within environmental constraints. By studying real-world applications, we learn to think like engineers who must solve practical problems with limited resources.

## Concepts

### Application domains

Mechatronic systems operate across many industries and environments. Each domain has unique requirements that shape system design.

**Manufacturing and automation**: Factory robots, conveyor systems, and quality control equipment. These systems prioritise precision, speed, and reliability over long periods.

**Transportation**: Anti-lock braking systems (ABS), automatic transmissions, and cruise control in cars. Aircraft autopilots and train signalling systems. These systems must be extremely reliable since human safety depends on them.

**Healthcare**: Robotic surgical assistants, prosthetic limbs, and patient monitoring devices. These systems require high precision and must meet strict safety standards.

**Consumer electronics**: Washing machines that adjust cycle time based on load, smartphones with automatic brightness control, and gaming controllers with force feedback. These systems balance functionality with cost-effectiveness.

**Agriculture**: Automated irrigation systems, GPS-guided tractors, and livestock monitoring. These systems must work reliably in harsh outdoor conditions.

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "Mechatronic Application Domains" {
    [Manufacturing] --> [Robots]
    [Manufacturing] --> [Conveyor Systems]
    [Manufacturing] --> [Quality Control]
    
    [Transportation] --> [ABS Systems]
    [Transportation] --> [Cruise Control]
    [Transportation] --> [Autopilots]
    
    [Healthcare] --> [Surgical Robots]
    [Healthcare] --> [Prosthetics]
    [Healthcare] --> [Monitoring]
    
    [Consumer] --> [Smart Appliances]
    [Consumer] --> [Gaming]
    [Consumer] --> [Mobile Devices]
    
    [Agriculture] --> [Irrigation]
    [Agriculture] --> [GPS Tractors]
    [Agriculture] --> [Livestock Monitoring]
}

note right of [Robots] : High precision\nLong operation
note right of [ABS Systems] : Safety critical\nReal-time response
note right of [Surgical Robots] : Extreme precision\nStrict safety standards
note right of [Smart Appliances] : Cost effective\nUser friendly
note right of [Irrigation] : Weather resistant\nRemote operation
@enduml
```

### Common use-cases

Mechatronic systems typically perform one or more of these functions:

**Monitoring and measurement**: Sensors collect data about the environment or system state. Examples include temperature sensors in air conditioning, pressure sensors in tyres, or cameras in security systems.

**Control and regulation**: Systems maintain desired conditions by adjusting outputs based on sensor feedback. Examples include thermostats controlling heating, cruise control maintaining speed, or robotic arms following programmed paths.

**Automation and assistance**: Systems perform tasks that would otherwise require human intervention. Examples include automatic car parking, robotic vacuum cleaners, or assembly line robots.

**Safety and protection**: Systems prevent dangerous conditions or respond to emergencies. Examples include airbag deployment systems, fire suppression systems, or emergency shutdown mechanisms in industrial equipment.

Let's model a simple automatic door system to see these use-cases in action:

```python
class AutomaticDoor:
    def __init__(self):
        self.is_open = False
        self.motion_detected = False
        self.safety_sensor_blocked = False
    
    def check_motion_sensor(self):
        """Monitoring: detect if someone approaches"""
        # In real system, would read from motion sensor
        return self.motion_detected
    
    def check_safety_sensor(self):
        """Safety: ensure path is clear"""
        # In real system, would read from infrared beam sensor
        return not self.safety_sensor_blocked
    
    def open_door(self):
        """Control: activate door motor"""
        if self.check_safety_sensor():
            self.is_open = True
            print("Door opening...")
        else:
            print("Safety sensor blocked - door cannot open")
    
    def close_door(self):
        """Control: close door after delay"""
        if self.check_safety_sensor():
            self.is_open = False
            print("Door closing...")
        else:
            print("Safety sensor blocked - door cannot close")
    
    def update(self):
        """Automation: main control loop"""
        if self.check_motion_sensor() and not self.is_open:
            self.open_door()
        elif not self.check_motion_sensor() and self.is_open:
            # In real system, would wait a few seconds
            self.close_door()

# Demonstrate the system
door = AutomaticDoor()

# Someone approaches
door.motion_detected = True
door.update()  # Door opens

# Person moves through
door.motion_detected = False
door.update()  # Door closes
```

### Design constraints

Every mechatronic system must balance competing requirements. These constraints shape every design decision.

#### Cost constraints

**Component costs**: Sensors, actuators, and controllers have different price points. A $2 temperature sensor might be adequate for a home thermostat, but a $200 precision sensor might be needed for medical equipment.

**Development costs**: Custom software and hardware take time to develop. Using standard components and proven designs reduces costs but may limit performance.

**Manufacturing costs**: High-volume production reduces per-unit costs but requires large upfront investment. Low-volume systems must use more expensive components and assembly methods.

```python
# Simple cost analysis for a mechatronic system
class ComponentCost:
    def __init__(self, name, base_cost, precision_multiplier=1.0, safety_multiplier=1.0):
        self.name = name
        self.base_cost = base_cost
        self.precision_multiplier = precision_multiplier
        self.safety_multiplier = safety_multiplier
    
    def calculate_cost(self, precision_level, safety_level):
        """Calculate component cost based on requirements"""
        cost = self.base_cost
        cost *= (1 + precision_level * self.precision_multiplier)
        cost *= (1 + safety_level * self.safety_multiplier)
        return cost

# Example: Temperature sensor costs
temp_sensor = ComponentCost("Temperature Sensor", base_cost=5, 
                           precision_multiplier=2.0, safety_multiplier=1.5)

# Basic application (precision=0.1, safety=0.1)
basic_cost = temp_sensor.calculate_cost(0.1, 0.1)
print(f"Basic sensor cost: ${basic_cost:.2f}")

# Medical application (precision=0.8, safety=0.9)
medical_cost = temp_sensor.calculate_cost(0.8, 0.9)
print(f"Medical sensor cost: ${medical_cost:.2f}")

# Industrial application (precision=0.6, safety=0.7)
industrial_cost = temp_sensor.calculate_cost(0.6, 0.7)
print(f"Industrial sensor cost: ${industrial_cost:.2f}")
```

#### Safety constraints

**Risk assessment**: Systems must identify potential failure modes and their consequences. Critical systems require redundancy and fail-safe designs.

**Standards compliance**: Many industries have strict safety standards. Medical devices must meet different standards than automotive systems.

**Human factors**: Systems must be designed so that normal human behaviour doesn't create dangerous situations. Emergency stops must be easily accessible, and error messages must be clear.

#### Environmental constraints

**Operating conditions**: Systems must work reliably in their intended environment. Outdoor systems need weatherproofing, while underwater systems need pressure resistance.

**Power availability**: Battery-powered systems must minimise power consumption. Grid-powered systems must handle power outages gracefully.

**Physical space**: Size and weight limits affect component selection. Aerospace systems require lightweight components, while underground mining equipment must fit through tunnels.

**Maintenance access**: Systems must be designed for repair and replacement. Critical systems may need redundant components or hot-swappable parts.

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

rectangle "Design Constraints" {
    rectangle "Cost" {
        [Component Costs]
        [Development Costs]
        [Manufacturing Costs]
    }
    
    rectangle "Safety" {
        [Risk Assessment]
        [Standards Compliance]
        [Human Factors]
    }
    
    rectangle "Environment" {
        [Operating Conditions]
        [Power Availability]
        [Physical Space]
        [Maintenance Access]
    }
}

[Component Costs] --> [Performance Trade-offs]
[Risk Assessment] --> [Redundancy Requirements]
[Operating Conditions] --> [Component Selection]
[Physical Space] --> [Integration Challenges]

note bottom : All constraints interact - changing one affects others
@enduml
```

### Guided example

Let's design a simple greenhouse monitoring system to see how domains, use-cases, and constraints work together.

**Domain**: Agriculture - specifically controlled environment growing.

**Use-cases**:

- Monitor temperature and humidity

- Control heating and ventilation

- Automate watering based on soil moisture

- Alert operators to problems

**Constraints analysis**:

```python
class GreenhouseSystem:
    def __init__(self):
        # Cost constraint: use affordable sensors
        self.temp_sensor_cost = 15  # Basic digital sensor
        self.humidity_sensor_cost = 20
        self.soil_sensor_cost = 10
        
        # Safety constraint: prevent plant damage
        self.min_temp = 10  # Celsius - protect from frost
        self.max_temp = 35  # Celsius - prevent heat damage
        self.min_humidity = 40  # Percent - prevent wilting
        self.max_humidity = 80  # Percent - prevent fungal growth
        
        # Environmental constraint: outdoor installation
        self.power_available = True  # Grid power available
        self.weather_protection = True  # Sensors in enclosures
        
        # Current readings (simulated)
        self.temperature = 22
        self.humidity = 60
        self.soil_moisture = 45
    
    def check_safety_limits(self):
        """Safety use-case: monitor for dangerous conditions"""
        alerts = []
        
        if self.temperature < self.min_temp:
            alerts.append("ALERT: Temperature too low - risk of frost damage")
        elif self.temperature > self.max_temp:
            alerts.append("ALERT: Temperature too high - risk of heat stress")
        
        if self.humidity < self.min_humidity:
            alerts.append("ALERT: Humidity too low - plants may wilt")
        elif self.humidity > self.max_humidity:
            alerts.append("ALERT: Humidity too high - risk of fungal disease")
        
        return alerts
    
    def calculate_total_cost(self):
        """Cost constraint: keep system affordable"""
        sensor_cost = (self.temp_sensor_cost + 
                      self.humidity_sensor_cost + 
                      self.soil_sensor_cost)
        
        # Add controller and housing costs
        controller_cost = 100  # Basic microcontroller system
        housing_cost = 50      # Weather protection
        
        total = sensor_cost + controller_cost + housing_cost
        return total
    
    def environmental_considerations(self):
        """Environmental constraints: outdoor operation"""
        considerations = []
        
        if not self.weather_protection:
            considerations.append("Need weatherproof sensor housings")
        
        if not self.power_available:
            considerations.append("Need solar panel and battery backup")
        
        considerations.append("Sensors must handle temperature range -10°C to +50°C")
        considerations.append("System must work reliably for months without maintenance")
        
        return considerations

# Demonstrate the system
greenhouse = GreenhouseSystem()

print("=== Greenhouse Monitoring System ===")
print(f"Total system cost: ${greenhouse.calculate_total_cost()}")
print()

print("Current conditions:")
print(f"Temperature: {greenhouse.temperature}°C")
print(f"Humidity: {greenhouse.humidity}%")
print(f"Soil moisture: {greenhouse.soil_moisture}%")
print()

alerts = greenhouse.check_safety_limits()
if alerts:
    for alert in alerts:
        print(alert)
else:
    print("All parameters within safe range")

print()
print("Environmental considerations:")
for consideration in greenhouse.environmental_considerations():
    print(f"- {consideration}")
```

## Try it

/// details | Exercise 1: Application Analysis
    type: question
    open: false

Choose a mechatronic system you use regularly (car, washing machine, smartphone, etc.). Identify:

1. What domain does it belong to?

2. What are its main use-cases?

3. What constraints likely influenced its design?

/// details | Sample Solution: Washing Machine
    type: success
    open: false

**Domain**: Consumer appliances / household automation

**Use-cases**:

- Monitor water level and temperature

- Control wash cycle timing and agitation

- Detect load imbalance and adjust spin speed

- Alert user when cycle is complete

**Constraints**:

- Cost: Must be affordable for average household

- Safety: Must prevent flooding, electrical hazards

- Environment: Must handle vibration, moisture, detergent chemicals

- Physical: Must fit in standard laundry spaces
///
///

/// details | Exercise 2: Constraint Trade-offs
    type: question
    open: false

You're designing a robotic vacuum cleaner. How would these constraints conflict with each other?

- Cost: Keep retail price under $300

- Safety: Never fall down stairs

- Environment: Work on all floor types for 6+ months without service

What compromises would you make?

/// details | Sample Solution
    type: success
    open: false

**Conflicts**:

- Cheap sensors vs reliable stair detection (cost vs safety)

- Durable components vs low cost (environment vs cost)

- Advanced navigation vs simple controls (performance vs cost)

**Compromises**:

- Use basic infrared sensors for stairs instead of expensive LIDAR

- Design for easy user maintenance rather than service-free operation

- Focus on good performance on hard floors, acceptable on carpet

- Use well-tested algorithms rather than cutting-edge AI
///
///

/// details | Exercise 3: System Modelling
    type: question
    open: false

Create a Python class to model a simple security camera system. Include:

- Motion detection capability

- Night vision mode

- Recording when motion detected

- Alert sending when security breach occurs

Consider cost, safety, and environmental constraints in your design.

/// details | Sample Solution
    type: success
    open: false

```python
class SecurityCamera:
    def __init__(self):
        # Cost constraint: basic components
        self.camera_cost = 80
        self.motion_sensor_cost = 15
        self.night_vision_cost = 25
        
        # Safety constraint: reliable detection
        self.motion_sensitivity = 0.7  # Balance false alarms vs missed events
        self.recording_buffer_seconds = 10  # Capture before and after motion
        
        # Environmental constraint: outdoor operation
        self.weather_resistant = True
        self.temperature_range = (-20, 60)  # Celsius
        
        # System state
        self.motion_detected = False
        self.night_mode = False
        self.recording = False
        self.alerts_sent = []
    
    def detect_motion(self, motion_level):
        """Monitor use-case: detect movement"""
        self.motion_detected = motion_level > self.motion_sensitivity
        return self.motion_detected
    
    def start_recording(self):
        """Control use-case: capture evidence"""
        if not self.recording:
            self.recording = True
            print("Recording started")
    
    def stop_recording(self):
        """Control use-case: save storage space"""
        if self.recording:
            self.recording = False
            print("Recording stopped")
    
    def send_alert(self, message):
        """Safety use-case: notify security personnel"""
        self.alerts_sent.append(message)
        print(f"ALERT: {message}")
    
    def update(self, motion_level, light_level):
        """Main control loop"""
        # Adjust for lighting conditions
        self.night_mode = light_level < 0.3
        
        # Check for motion
        if self.detect_motion(motion_level):
            self.start_recording()
            self.send_alert("Motion detected in camera zone")
        else:
            self.stop_recording()
    
    def get_total_cost(self):
        """Cost analysis"""
        return self.camera_cost + self.motion_sensor_cost + self.night_vision_cost

# Test the system
camera = SecurityCamera()
print(f"System cost: ${camera.get_total_cost()}")

# Simulate day operation - no motion
camera.update(motion_level=0.2, light_level=0.8)

# Simulate night operation - motion detected  
camera.update(motion_level=0.9, light_level=0.1)

# Motion stops
camera.update(motion_level=0.1, light_level=0.1)
```
///
///

## Recap

Mechatronic systems operate across diverse domains from manufacturing to healthcare, each with unique requirements. Common use-cases include monitoring, control, automation, and safety functions. Every system must balance three key constraints:

- **Cost**: Component prices, development time, and manufacturing volumes

- **Safety**: Risk assessment, standards compliance, and human factors  

- **Environment**: Operating conditions, power, space, and maintenance needs

Understanding these applications and constraints helps engineers make informed design decisions. The next sections will explore the computing hardware and components that make these systems possible.

See also [8.3 Designing accessible mechatronic systems](../../Chapter-08-Data-and-integration/Section-03-Designing-accessible-mechatronic-systems/) for specific accessibility considerations in system design.
