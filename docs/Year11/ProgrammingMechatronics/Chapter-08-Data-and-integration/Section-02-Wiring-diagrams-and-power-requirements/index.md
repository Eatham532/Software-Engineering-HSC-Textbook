# 8.2 Wiring diagrams and power requirements

## Why it matters

!!! builds-on "Builds on"
    This section builds on [8.1 Working with device data and diagnostics](../Section-01-Working-with-device-data-and-diagnostics/index.md).


Mechatronic systems combine electrical, mechanical, and software components. Poor wiring design can lead to system failure, component damage, or safety hazards. Understanding power requirements ensures your system operates reliably within safe limits and helps you select appropriate batteries and components.

In real-world applications, inadequate power planning can cause brownouts, overheating, or shortened battery life. Safe wiring practices prevent short circuits, electrical fires, and equipment damage.

## Concepts

### Basic electrical principles

Electrical systems operate on three fundamental quantities:

- **Voltage (V)**: electrical potential difference, measured in volts

- **Current (I)**: flow of electrical charge, measured in amperes (amps)

- **Power (P)**: rate of energy consumption, measured in watts

The relationship between these is given by **Ohm's Law** and the **Power equation**:

```
V = I × R    (Ohm's Law, where R is resistance in ohms)
P = V × I    (Power equation)
```

```python
# Basic electrical calculations
def calculate_power(voltage, current):
    """Calculate power consumption given voltage and current."""
    return voltage * current

def calculate_current(power, voltage):
    """Calculate current draw given power and voltage."""
    return power / voltage

# Example: LED strip requiring 12V and consuming 24W
voltage = 12  # volts
power = 24    # watts
current = calculate_current(power, voltage)
print(f"Current draw: {current:.2f} amps")  # Output: Current draw: 2.00 amps
```

### Guided example

Let's calculate the power requirements for a simple robotic arm system:

```python
# Component power requirements (typical values)
components = {
    "microcontroller": {"voltage": 5, "current": 0.5},    # 2.5W
    "servo_motor": {"voltage": 6, "current": 1.5},        # 9W
    "ultrasonic_sensor": {"voltage": 5, "current": 0.015}, # 0.075W
    "led_strip": {"voltage": 12, "current": 0.8}          # 9.6W
}

total_power = 0
for component, specs in components.items():
    power = specs["voltage"] * specs["current"]
    total_power += power
    print(f"{component}: {power:.3f}W")

print(f"\nTotal system power: {total_power:.3f}W")
```

### Safe wiring practices

Creating clear wiring diagrams prevents errors and enables troubleshooting:

```kroki-plantuml
@startuml
!define RECTANGLE class

skinparam monochrome true
skinparam shadowing false

rectangle "Battery\n12V 2Ah" as Battery
rectangle "Voltage Regulator\n12V → 5V" as VReg
rectangle "Microcontroller\n5V" as MCU
rectangle "Servo Motor\n6V" as Servo
rectangle "Ultrasonic Sensor\n5V" as Sensor

Battery --> VReg : "12V (Red wire)"
Battery --> Servo : "6V (Red wire)"
VReg --> MCU : "5V (Red wire)"
VReg --> Sensor : "5V (Red wire)"

Battery --> MCU : "GND (Black wire)"
Battery --> Servo : "GND (Black wire)"
Battery --> Sensor : "GND (Black wire)"

MCU --> Servo : "PWM Signal (Yellow wire)"
MCU --> Sensor : "Trigger/Echo (Blue wires)"

note right of Battery
  Fuse: 3A
  Safety margin: 20%
end note

@enduml
```

Key wiring safety principles:

1. **Colour coding**: Red for positive, black for ground, other colours for signals

2. **Fusing**: Protect circuits with appropriately rated fuses

3. **Wire gauge**: Use wires that can handle the expected current

4. **Strain relief**: Secure connections to prevent wire pulling

5. **Isolation**: Keep high and low voltage circuits separated

### Power budgeting and battery selection

Calculate total system power and add safety margins:

```python
def calculate_battery_requirements(components, safety_margin=0.2, efficiency=0.85):
    """
    Calculate battery requirements for a mechatronic system.
    
    Args:
        components: dict of component specs (voltage, current)
        safety_margin: additional power headroom (default 20%)
        efficiency: system efficiency factor (default 85%)
    """
    
    # Calculate total power consumption
    total_power = sum(specs["voltage"] * specs["current"] 
                     for specs in components.values())
    
    # Add safety margin and account for inefficiency
    actual_power = total_power * (1 + safety_margin) / efficiency
    
    # Battery calculations (assuming 12V system)
    battery_voltage = 12
    current_draw = actual_power / battery_voltage
    
    return {
        "component_power": total_power,
        "actual_power": actual_power,
        "current_draw": current_draw,
        "recommended_battery_voltage": battery_voltage
    }

# Example usage
requirements = calculate_battery_requirements(components)
print(f"Component power: {requirements['component_power']:.2f}W")
print(f"Actual power needed: {requirements['actual_power']:.2f}W")
print(f"Battery current draw: {requirements['current_draw']:.2f}A")
```

### Runtime estimation

Estimate how long your system will operate on battery power:

```python
def estimate_runtime(battery_capacity_ah, current_draw_a, discharge_factor=0.8):
    """
    Estimate battery runtime.
    
    Args:
        battery_capacity_ah: battery capacity in amp-hours
        current_draw_a: system current draw in amps
        discharge_factor: usable battery capacity (80% for safety)
    """
    usable_capacity = battery_capacity_ah * discharge_factor
    runtime_hours = usable_capacity / current_draw_a
    return runtime_hours

# Example: 2Ah battery with 1.5A current draw
battery_capacity = 2.0  # amp-hours
current_draw = 1.5      # amps
runtime = estimate_runtime(battery_capacity, current_draw)
print(f"Estimated runtime: {runtime:.1f} hours")
```

## Try it

### Exercise 1: Power calculation

Design a power budget for a mobile robot with these components:

- Raspberry Pi (5V, 2.5A)

- Two DC motors (12V, 1.5A each)

- Camera module (5V, 0.25A)

- WiFi module (3.3V, 0.15A)

/// details | Exercise 1: Sample Solution
    type: success
    open: false

```python
mobile_robot = {
    "raspberry_pi": {"voltage": 5, "current": 2.5},
    "motor_left": {"voltage": 12, "current": 1.5},
    "motor_right": {"voltage": 12, "current": 1.5},
    "camera": {"voltage": 5, "current": 0.25},
    "wifi_module": {"voltage": 3.3, "current": 0.15}
}

requirements = calculate_battery_requirements(mobile_robot)
print(f"Total component power: {requirements['component_power']:.2f}W")
print(f"With safety margin and efficiency: {requirements['actual_power']:.2f}W")
print(f"12V battery current draw: {requirements['current_draw']:.2f}A")
```

Output:
```
Total component power: 40.00W
With safety margin and efficiency: 56.47W
12V battery current draw: 4.71A
```

For this system, you'd need a 12V battery rated for at least 5A continuous current.
///

### Exercise 2: Battery selection

Using the mobile robot from Exercise 1, determine the minimum battery capacity needed for 2 hours of operation.

/// details | Exercise 2: Sample Solution
    type: success
    open: false

```python
# From Exercise 1: current draw is 4.71A
current_draw = 4.71  # amps
target_runtime = 2   # hours

# Calculate minimum battery capacity
# Using 80% discharge factor for battery safety
min_capacity = (current_draw * target_runtime) / 0.8
print(f"Minimum battery capacity: {min_capacity:.1f}Ah")

# Check with actual runtime calculation
actual_runtime = estimate_runtime(min_capacity, current_draw)
print(f"Actual runtime with {min_capacity:.1f}Ah battery: {actual_runtime:.1f} hours")
```

Output:
```
Minimum battery capacity: 11.8Ah
Actual runtime with 11.8Ah battery: 2.0 hours
```

You would need at least a 12Ah battery to achieve 2 hours of runtime safely.
///

### Exercise 3: Wiring diagram

Create a wiring plan for the mobile robot, including proper fusing and voltage regulation.

/// details | Exercise 3: Sample Solution
    type: success
    open: false

**Wiring Plan:**

1. **Main battery**: 12V, 12Ah with 10A fuse at positive terminal

2. **Voltage regulators**: 

   - 12V → 5V regulator for Raspberry Pi and camera (5A capacity)

   - 12V → 3.3V regulator for WiFi module (1A capacity)

3. **Motor connections**: Direct 12V connection with 2A fuses per motor

4. **Wire gauge**: 

   - Main power: 14 AWG (good for 15A)

   - 5V lines: 18 AWG (good for 7A)

   - Signal lines: 22 AWG

**Safety features:**

- Individual fuses for each power rail

- Strain relief on all connections

- Emergency stop switch on main power

- Clear labelling of all connections
///

## Recap

Understanding electrical fundamentals and safe wiring practices is essential for reliable mechatronic systems. Key takeaways:

- **Power calculation**: Use P = V × I to determine component power requirements

- **Safety margins**: Add 20% headroom and account for system efficiency

- **Battery sizing**: Consider runtime requirements and safe discharge limits

- **Wiring safety**: Use proper colour coding, fusing, and wire gauge selection

- **Documentation**: Create clear wiring diagrams for troubleshooting and maintenance

Proper power planning and wiring design prevent system failures and ensure safe operation. Always test your calculations with real components and measure actual power consumption to validate your estimates.

See also [7.3 Sensors, actuators, and end effectors](../../Chapter-07-Mechatronics-foundations/Section-03-Sensors-actuators-end-effectors/index.md) for component specifications and [8.1 Working with device data and diagnostics](../Section-01-Working-with-device-data-and-diagnostics/index.md) for monitoring power consumption.
