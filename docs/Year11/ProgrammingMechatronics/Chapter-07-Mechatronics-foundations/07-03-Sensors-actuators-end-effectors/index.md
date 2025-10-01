# 7.3 Sensors, actuators, and end effectors

## Why it matters

Mechatronic systems interact with the physical world through three key types of components: sensors that gather information about the environment, actuators that create movement or force, and end effectors that perform the final task. Understanding their characteristics and trade-offs is essential for designing effective systems.

Each component has specific capabilities and limitations that affect system performance. Response time, accuracy, operating range, and cost all influence which components to select for a particular application.

## Concepts

### Sensors: gathering information from the environment

Sensors convert physical phenomena into electrical signals that computers can process. They act as the "eyes and ears" of mechatronic systems, providing crucial data for decision-making.

Key characteristics to consider:

- **Range**: the minimum and maximum values the sensor can detect

- **Accuracy**: how close the measured value is to the true value

- **Precision**: how repeatable measurements are

- **Response time**: how quickly the sensor reacts to changes

- **Resolution**: the smallest change the sensor can detect

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "Motion Sensors" {
    [PIR Sensor] --> [Movement Detection]
    [Accelerometer] --> [Acceleration/Tilt]
    [Encoder] --> [Position/Speed]
}

package "Light Sensors" {
    [Photocell] --> [Light Level]
    [Photodiode] --> [Precise Light]
}

[Movement Detection] --> [Digital Signal]
[Acceleration/Tilt] --> [Analog Signal]
[Position/Speed] --> [Digital Pulses]
[Light Level] --> [Analog Signal]
[Precise Light] --> [Analog Signal]

[Digital Signal] --> [Microcontroller]
[Analog Signal] --> [ADC] 
[Digital Pulses] --> [Microcontroller]
[ADC] --> [Microcontroller]
@enduml

```

### Motion sensors

**PIR (Passive Infrared) sensors** detect changes in infrared radiation, commonly used for motion detection:

- Range: typically 3-7 metres

- Response time: 1-3 seconds

- Accuracy: good for presence detection, poor for precise location

- Use cases: security systems, automatic lighting, occupancy detection

**Accelerometers** measure acceleration forces in one or more axes:

- Range: ±2g to ±16g (where g = 9.8 m/s²)

- Response time: milliseconds

- Accuracy: high precision for orientation and vibration

- Use cases: tilt detection, impact sensing, gesture recognition

**Encoders** track rotational or linear position by counting pulses:

- Range: unlimited (continuous counting)

- Response time: microseconds

- Accuracy: extremely high for position and speed

- Use cases: motor control, robotics, CNC machines

### Light-level sensors

**Photocells (LDR - Light Dependent Resistor)** change resistance based on light intensity:

- Range: darkness to bright sunlight

- Response time: 10-100 milliseconds

- Accuracy: good for general light levels, poor for precise measurements

- Use cases: automatic lighting, camera exposure, solar trackers

**Photodiodes** generate current proportional to light intensity:

- Range: very low to high light levels

- Response time: microseconds

- Accuracy: excellent linearity and precision

- Use cases: optical communication, precision light measurement, laser detection

### Guided example: sensor selection

A greenhouse monitoring system needs to track plant growth conditions. Let's compare sensor options:

For **light monitoring**:

- Photocell: adequate for day/night detection, low cost

- Photodiode: better for precise light intensity measurements needed for optimal plant growth

For **movement detection** (pest monitoring):

- PIR sensor: good for detecting larger animals

- Accelerometer: better for detecting vibrations from smaller pests

```python
# Simulating sensor readings for greenhouse monitoring
import random
import time

class GreenhouseSensor:
    def __init__(self, sensor_type, min_range, max_range, response_time):
        self.sensor_type = sensor_type
        self.min_range = min_range
        self.max_range = max_range
        self.response_time = response_time  # in seconds
        
    def read_value(self):
        """Simulate reading a sensor value"""
        # Add some realistic noise to the reading
        base_value = random.uniform(self.min_range, self.max_range)
        noise = random.uniform(-0.05, 0.05) * base_value
        return base_value + noise
    
    def get_characteristics(self):
        return {
            'type': self.sensor_type,
            'range': f"{self.min_range} - {self.max_range}",
            'response_time': f"{self.response_time}s"
        }

# Create different sensor types
photocell = GreenhouseSensor("Photocell", 0, 1000, 0.05)  # 0-1000 lux
photodiode = GreenhouseSensor("Photodiode", 0, 10000, 0.000001)  # 0-10000 lux
pir_sensor = GreenhouseSensor("PIR", 0, 1, 2.0)  # binary detection

# Compare sensor readings
print("Greenhouse Sensor Comparison:")
print(f"Photocell: {photocell.get_characteristics()}")
print(f"Reading: {photocell.read_value():.1f} lux")

print(f"\nPhotodiode: {photodiode.get_characteristics()}")
print(f"Reading: {photodiode.read_value():.1f} lux")

print(f"\nPIR: {pir_sensor.get_characteristics()}")
print(f"Motion detected: {pir_sensor.read_value() > 0.5}")

```

### Actuators: creating movement and force

Actuators convert electrical signals into physical motion or force. They enable mechatronic systems to interact with and modify their environment.

Key characteristics:

- **Force/torque output**: how much force or rotational force they can generate

- **Speed**: how fast they can move

- **Precision**: how accurately they can position

- **Power consumption**: how much energy they require

- **Durability**: how long they last under repeated use

### Hydraulic actuators

Hydraulic actuators use pressurised fluid to create linear or rotational motion. They excel in applications requiring high force output.

**Basic principles**:

- Pressurised hydraulic fluid (usually oil) flows through valves

- Pressure differences across pistons create force

- Force = Pressure × Piston Area

**Characteristics**:

- Force output: extremely high (thousands of Newtons)

- Speed: moderate (depends on flow rate)

- Precision: good with proper control systems

- Power consumption: high (requires hydraulic pump)

**Use cases**:

- Construction equipment (excavators, bulldozers)

- Industrial presses and lifting equipment

- Aircraft control surfaces

- Heavy-duty robotics

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

package "Hydraulic System" {
    [Hydraulic Pump] --> [High Pressure Line]
    [High Pressure Line] --> [Control Valve]
    [Control Valve] --> [Hydraulic Cylinder]
    [Hydraulic Cylinder] --> [Low Pressure Line]
    [Low Pressure Line] --> [Reservoir]
    [Reservoir] --> [Hydraulic Pump]
    
    [Control Valve] <-- [Electronic Controller]
    [Hydraulic Cylinder] --> [Piston Rod]
    [Piston Rod] --> [Load/End Effector]
}

note top of [Electronic Controller] : Receives commands\nfrom main system
note right of [Hydraulic Cylinder] : Force = Pressure × Area
note bottom of [Load/End Effector] : High force output\nfor heavy tasks
@enduml

```

### End effectors: performing the final task

End effectors are the "hands" of mechatronic systems - the components that directly interact with objects or perform the intended task.

### Robotic grippers and selection criteria

Grippers are the most common type of end effector, designed to grasp and manipulate objects.

**Types of grippers**:

1. **Parallel jaw grippers**: Two fingers move in parallel

   - Good for: cylindrical objects, consistent shapes

   - Force: moderate to high

   - Precision: high

2. **Angular grippers**: Fingers rotate to close

   - Good for: varied object sizes, delicate items

   - Force: moderate

   - Precision: very high

3. **Vacuum grippers**: Use suction to hold objects

   - Good for: flat surfaces, lightweight items

   - Force: low to moderate

   - Precision: depends on surface quality

4. **Magnetic grippers**: Use magnets for ferrous materials

   - Good for: metal objects, simple on/off operation

   - Force: high for magnetic materials

   - Precision: moderate

**Selection criteria**:

- **Object characteristics**: size, weight, shape, material, surface texture

- **Required precision**: how accurately must objects be positioned

- **Operating environment**: temperature, humidity, contamination

- **Cycle time**: how fast must the gripper operate

- **Safety requirements**: fail-safe behaviour, force limits

### Guided example: gripper selection for assembly line

An electronics assembly line needs to pick up circuit boards and place them in test fixtures.

**Requirements analysis**:

- Objects: Rectangular PCBs, 100mm × 80mm, 50g weight

- Precision: ±0.5mm positioning accuracy

- Environment: Clean room, no moisture

- Cycle time: 2 seconds per operation

- Safety: Must not damage delicate components

**Gripper comparison**:

```python
class RoboticGripper:
    def __init__(self, gripper_type, max_force, precision, cycle_time, cost):
        self.gripper_type = gripper_type
        self.max_force = max_force  # in Newtons
        self.precision = precision  # in mm
        self.cycle_time = cycle_time  # in seconds
        self.cost = cost  # relative cost 1-10
        
    def evaluate_suitability(self, required_force, required_precision, required_speed):
        """Evaluate how well this gripper meets requirements"""
        force_ok = self.max_force >= required_force
        precision_ok = self.precision <= required_precision
        speed_ok = self.cycle_time <= required_speed
        
        score = sum([force_ok, precision_ok, speed_ok])
        return {
            'suitable': score == 3,
            'score': score,
            'details': {
                'force': force_ok,
                'precision': precision_ok,
                'speed': speed_ok
            }
        }
    
    def get_characteristics(self):
        return {
            'type': self.gripper_type,
            'max_force': f"{self.max_force}N",
            'precision': f"±{self.precision}mm",
            'cycle_time': f"{self.cycle_time}s",
            'relative_cost': self.cost
        }

# Define gripper options for PCB handling
grippers = [
    RoboticGripper("Parallel Jaw", 50, 0.1, 1.5, 6),
    RoboticGripper("Angular", 30, 0.05, 2.0, 8),
    RoboticGripper("Vacuum", 20, 0.3, 1.0, 4),
    RoboticGripper("Magnetic", 100, 0.5, 1.2, 3)
]

# Requirements for PCB handling
required_force = 5  # Light grip needed (50g PCB)
required_precision = 0.5  # ±0.5mm positioning
required_speed = 2.0  # 2 second cycle time

print("Gripper Selection Analysis for PCB Assembly:")
print(f"Requirements: Force ≥{required_force}N, Precision ≤{required_precision}mm, Speed ≤{required_speed}s")
print()

for gripper in grippers:
    evaluation = gripper.evaluate_suitability(required_force, required_precision, required_speed)
    characteristics = gripper.get_characteristics()
    
    print(f"{gripper.gripper_type} Gripper:")
    print(f"  Characteristics: {characteristics}")
    print(f"  Suitability Score: {evaluation['score']}/3")
    print(f"  Suitable: {'Yes' if evaluation['suitable'] else 'No'}")
    if not evaluation['suitable']:
        failed_requirements = [req for req, ok in evaluation['details'].items() if not ok]
        print(f"  Failed requirements: {', '.join(failed_requirements)}")
    print()

# Recommendation logic
suitable_grippers = [g for g in grippers if g.evaluate_suitability(required_force, required_precision, required_speed)['suitable']]

if suitable_grippers:
    # Choose based on best precision for delicate PCBs
    best_gripper = min(suitable_grippers, key=lambda g: g.precision)
    print(f"Recommendation: {best_gripper.gripper_type} gripper")
    print(f"Reason: Best precision (±{best_gripper.precision}mm) among suitable options")
else:
    print("No grippers meet all requirements - specifications need revision")

```

### Trade-offs in component selection

Real-world component selection involves balancing competing requirements:

**Performance vs Cost**:

- Higher precision sensors/actuators cost more

- Budget constraints may require accepting lower performance

**Speed vs Accuracy**:

- Faster response often means less precision

- Safety-critical applications may prioritise accuracy over speed

**Power vs Capability**:

- More powerful actuators consume more energy

- Battery-powered systems need efficient components

**Simplicity vs Flexibility**:

- Simple components are more reliable but less adaptable

- Complex systems offer more features but more failure modes

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

@startmindmap
* Component Selection
** Performance
*** Accuracy
*** Speed
*** Range
*** Resolution
** Cost
*** Initial Purchase
*** Installation
*** Maintenance
*** Power Consumption
** Reliability
*** Durability
*** Environmental Tolerance
*** Failure Modes
** Integration
*** Compatibility
*** Size Constraints
*** Interface Requirements
@endmindmap
@enduml

```

## Try it

### Exercise 1: sensor selection for smart home

Design a sensor system for a smart home security setup. Consider these requirements:

- Detect motion in three rooms (living room, kitchen, bedroom)

- Monitor light levels for automatic lighting

- Detect door/window opening

- Budget: moderate

- Must work reliably for 2+ years

/// details | Sample Solution
    type: success
    open: false

**Recommended sensors**:

1. **Motion detection**: PIR sensors

   - Cost-effective for room-sized areas

   - Reliable 3-7m range covers typical rooms

   - 2-3 second response time acceptable for security

2. **Light monitoring**: Photocells

   - Adequate accuracy for day/night detection

   - Low cost fits budget

   - Simple integration with lighting controls

3. **Door/window monitoring**: Magnetic reed switches

   - Binary open/closed detection sufficient

   - Very reliable, long-lasting

   - Minimal power consumption

**Trade-offs made**:

- Chose PIR over accelerometers (cost vs precision)

- Chose photocells over photodiodes (cost vs accuracy)

- Prioritised reliability over advanced features
///

### Exercise 2: actuator selection for greenhouse

A greenhouse needs automated window opening for temperature control:

- Windows weigh 15kg each

- Must open/close within 30 seconds

- Operate in humid conditions

- Precise positioning not critical

- Must fail safe (remain closed if power lost)

/// details | Sample Solution
    type: success
    open: false

**Recommended actuator**: Linear electric actuator with manual override

**Reasoning**:

- Force requirement: 15kg × 9.8m/s² = 147N (manageable for electric actuator)

- Speed: 30-second operation time is moderate (not demanding)

- Environment: Electric actuators handle humidity better than pneumatic

- Fail-safe: Spring-loaded return mechanism keeps windows closed

- Cost: More economical than hydraulic for this force range

**Alternative considered**: Hydraulic actuator

- Pros: Higher force capability, very reliable

- Cons: Higher cost, complexity of hydraulic system overkill for 147N requirement
///

### Exercise 3: end effector design

Design an end effector for a recycling robot that must:

- Sort plastic bottles from mixed waste

- Handle bottles of various sizes (0.5L to 2L)

- Work in dusty environment

- Gentle enough not to crush bottles

- Process 60 bottles per minute

/// details | Sample Solution
    type: success
    open: false

**Recommended end effector**: Soft parallel jaw gripper with vision guidance

**Design features**:

- **Parallel jaws**: Good for cylindrical bottle shapes

- **Soft gripping surfaces**: Rubber/foam pads prevent crushing

- **Adjustable jaw spacing**: Handles 0.5L to 2L bottle range

- **Force limiting**: Pneumatic control with pressure regulation

- **Vision system**: Camera identifies bottle size for jaw adjustment

**Cycle time calculation**:

- 60 bottles/minute = 1 bottle/second

- Allows for: identify (0.3s) + position (0.4s) + grip & move (0.3s)

**Environmental considerations**:

- Sealed actuators protect from dust

- Easy-clean surfaces for maintenance

- Robust construction for industrial use
///

## Recap

Sensors, actuators, and end effectors are the interface between digital control systems and the physical world. Key selection criteria include:

**Sensors**: range, accuracy, response time, and cost determine suitability for gathering environmental data.

**Actuators**: force output, speed, precision, and power consumption must match application requirements.

**End effectors**: must be chosen based on object characteristics, required precision, and operating environment.

**Trade-offs**: performance, cost, reliability, and integration complexity must be balanced for practical systems.

Understanding these characteristics enables informed component selection that meets functional requirements within budget and reliability constraints.

See also [8.2 Wiring diagrams and power requirements](../../Chapter-08-Data-and-integration/08-02-Wiring-diagrams-and-power-requirements/index.md) for electrical integration considerations.
