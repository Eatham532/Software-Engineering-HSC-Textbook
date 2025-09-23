# 7.2 Computing hardware: CPU, instruction sets, registers

## Why it matters

!!! builds-on "Builds on"
    This section builds on [7.1 Applications of mechatronic systems](../Section-01-Applications-of-mechatronic-systems/index.md).


When building mechatronic systems, you need to understand how the "brain" of your system works. Whether you're using a simple microcontroller or a more powerful CPU, knowing how these computing components process instructions helps you write better code and choose the right hardware for your project.

Understanding the basics of how processors work—from fetching instructions to executing them—gives you insight into why some operations are fast while others take more time. This knowledge becomes crucial when designing real-time control systems where timing matters.

## Concepts

### Microcontrollers vs CPUs

**CPUs (Central Processing Units)** are the powerful processors found in computers, phones, and tablets. They're designed to handle many different tasks at once and can run complex operating systems like Windows or Linux.

**Microcontrollers** are much simpler computing devices designed for specific tasks. They're like tiny computers that include:

- A simple processor (CPU core)

- Memory for storing programs and data

- Input/output pins to connect sensors and actuators

- Often built-in timers and communication features

Here's a comparison:

| Feature | CPU | Microcontroller |
|---------|-----|----------------|
| Power | High performance | Low power |
| Cost | Expensive | Inexpensive |
| Complexity | Very complex | Simple |
| Best for | General computing | Specific control tasks |
| Examples | Intel i7, AMD Ryzen | Arduino Uno, Raspberry Pi Pico |

In mechatronics, microcontrollers are often preferred because they:

- Use less power (important for battery-operated devices)

- Start up instantly (no operating system to load)

- Are more reliable in harsh environments

- Cost much less than full CPUs

### Instruction sets and opcodes

Every processor understands a specific set of instructions called an **instruction set**. These instructions are the basic operations the processor can perform.

**Opcodes** (operation codes) are the numerical codes that represent these instructions. Think of them as the processor's vocabulary—each opcode tells the processor to do something specific.

Here are some common types of instructions that processors understand:

```python
# These Python operations correspond to basic processor instructions:

# Arithmetic operations
result = 5 + 3        # ADD opcode
difference = 10 - 4   # SUBTRACT opcode
product = 6 * 7       # MULTIPLY opcode

# Data movement
x = 42               # LOAD opcode (move value to memory)
y = x                # COPY opcode (copy value between locations)

# Comparison and branching
if x > 10:           # COMPARE opcode followed by BRANCH opcode
    print("Large")   # CALL opcode (call a function)

# Logical operations
flag = True and False  # AND opcode
result = not flag      # NOT opcode

```

Different processor families have different instruction sets:

- **RISC** (Reduced Instruction Set Computer): Simple instructions that execute quickly

- **CISC** (Complex Instruction Set Computer): More complex instructions that can do more in one step

Most microcontrollers use RISC designs because they're simpler and more efficient.

### Registers and the fetch-decode-execute cycle

**Registers** are tiny, super-fast memory locations inside the processor. They're like the processor's workspace—where it keeps the data it's currently working on.

Common types of registers include:

- **Accumulator**: Stores results of calculations

- **Program Counter**: Keeps track of which instruction to execute next

- **Instruction Register**: Holds the current instruction being executed

- **Status Register**: Stores flags about the last operation (like whether it resulted in zero)

The **fetch-decode-execute cycle** is how processors work through their instructions:

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

start
:Fetch instruction from memory;
:Decode instruction to understand what to do;
:Execute the instruction;
:Update program counter to next instruction;
stop
@enduml

```

Let's trace through a simple example:

```python
# This Python code: x = 5 + 3
# Might translate to these processor steps:

# 1. FETCH: Get "LOAD 5" instruction from memory
# 2. DECODE: Understand this means "put 5 in accumulator"
# 3. EXECUTE: Move 5 into accumulator register

# 4. FETCH: Get "ADD 3" instruction from memory  
# 5. DECODE: Understand this means "add 3 to accumulator"
# 6. EXECUTE: Add 3 to the value in accumulator (5 + 3 = 8)

# 7. FETCH: Get "STORE x" instruction from memory
# 8. DECODE: Understand this means "save accumulator to variable x"
# 9. EXECUTE: Copy 8 from accumulator to memory location for x

```

This cycle repeats millions or billions of times per second, depending on the processor's speed (measured in MHz or GHz).

### Guided example

Let's simulate how a simple microcontroller might process instructions for a mechatronic system:

```python
class SimpleProcessor:
    """A simplified model of how a microcontroller processes instructions"""
    
    def __init__(self):
        # Registers (processor's internal memory)
        self.accumulator = 0  # Main working register
        self.program_counter = 0  # Which instruction we're on
        self.status_flags = {'zero': False, 'negative': False}
        
        # Memory (where our program and data live)
        self.memory = [0] * 100  # 100 memory locations
        self.program = []  # List of instructions
    
    def load_program(self, instructions):
        """Load a program into memory"""
        self.program = instructions
        self.program_counter = 0
    
    def fetch(self):
        """Fetch the next instruction"""
        if self.program_counter < len(self.program):
            instruction = self.program[self.program_counter]
            self.program_counter += 1
            return instruction
        return None
    
    def decode_and_execute(self, instruction):
        """Decode and execute an instruction"""
        parts = instruction.split()
        opcode = parts[0]
        
        if opcode == "LOAD":
            # Load a value into the accumulator
            value = int(parts[1])
            self.accumulator = value
            print(f"LOAD {value}: Accumulator = {self.accumulator}")
            
        elif opcode == "ADD":
            # Add a value to the accumulator
            value = int(parts[1])
            self.accumulator += value
            print(f"ADD {value}: Accumulator = {self.accumulator}")
            
        elif opcode == "STORE":
            # Store accumulator value to memory
            address = int(parts[1])
            self.memory[address] = self.accumulator
            print(f"STORE {address}: Memory[{address}] = {self.accumulator}")
            
        elif opcode == "COMPARE":
            # Compare accumulator with a value
            value = int(parts[1])
            self.status_flags['zero'] = (self.accumulator == value)
            self.status_flags['negative'] = (self.accumulator < value)
            print(f"COMPARE {value}: Zero={self.status_flags['zero']}, Negative={self.status_flags['negative']}")
    
    def run_program(self):
        """Run the loaded program"""
        print("Starting program execution...")
        print(f"Initial state: Accumulator = {self.accumulator}")
        print()
        
        while True:
            instruction = self.fetch()
            if instruction is None:
                break
            
            print(f"Step {self.program_counter}: {instruction}")
            self.decode_and_execute(instruction)
            print()
        
        print("Program completed!")
        print(f"Final accumulator value: {self.accumulator}")

# Example: Calculate the sum of sensor readings
processor = SimpleProcessor()

# Program to add three sensor readings: 25, 30, 15
sensor_program = [
    "LOAD 25",      # Load first sensor reading
    "ADD 30",       # Add second sensor reading  
    "ADD 15",       # Add third sensor reading
    "STORE 10",     # Store total in memory location 10
    "COMPARE 70"    # Check if total equals expected value
]

processor.load_program(sensor_program)
processor.run_program()

# Check what we stored in memory
print(f"Total sensor reading stored in memory: {processor.memory[10]}")

```

When you run this simulation, you'll see exactly how the processor moves through each instruction:

```text
Starting program execution...
Initial state: Accumulator = 0

Step 1: LOAD 25
LOAD 25: Accumulator = 25

Step 2: ADD 30
ADD 30: Accumulator = 55

Step 3: ADD 15
ADD 15: Accumulator = 70

Step 4: STORE 10
STORE 10: Memory[10] = 70

Step 5: COMPARE 70
COMPARE 70: Zero=True, Negative=False

Program completed!
Final accumulator value: 70
Total sensor reading stored in memory: 70

```

This shows how even a simple calculation like adding sensor readings involves multiple fetch-decode-execute cycles.

## Try it

/// details | Exercise 1: Motor control sequence
    type: question
    open: false

Create a program that controls a motor based on sensor input. Extend the `SimpleProcessor` class to include:

- A `READ_SENSOR` instruction that reads from a sensor by ID

- A `SET_MOTOR` instruction that sets motor speed

- A `JUMP_IF_ZERO` instruction for conditional branching

Test your program with different sensor readings to see how the motor control changes.

/// details | Sample Solution
    type: success
    open: false

```python
# Extend our processor to handle motor control
class MechatronicProcessor(SimpleProcessor):
    def __init__(self):
        super().__init__()
        self.motor_speed = 0
        self.sensor_value = 0
    
    def decode_and_execute(self, instruction):
        """Extended instruction set for mechatronics"""
        parts = instruction.split()
        opcode = parts[0]
        
        # Handle basic instructions from parent class
        if opcode in ["LOAD", "ADD", "STORE", "COMPARE"]:
            super().decode_and_execute(instruction)
            
        # New mechatronic instructions
        elif opcode == "READ_SENSOR":
            # Simulate reading from a sensor
            sensor_id = int(parts[1])
            # In real hardware, this would read from actual sensor
            test_values = {1: 45, 2: 78, 3: 23}  # Simulated sensor readings
            self.accumulator = test_values.get(sensor_id, 0)
            print(f"READ_SENSOR {sensor_id}: Accumulator = {self.accumulator}")
            
        elif opcode == "SET_MOTOR":
            # Set motor speed based on accumulator value
            self.motor_speed = self.accumulator
            print(f"SET_MOTOR: Motor speed = {self.motor_speed}")
            
        elif opcode == "JUMP_IF_ZERO":
            # Conditional jump based on status flags
            if self.status_flags['zero']:
                target = int(parts[1])
                self.program_counter = target
                print(f"JUMP_IF_ZERO {target}: Jumping to instruction {target}")
            else:
                print(f"JUMP_IF_ZERO {target}: Not jumping (zero flag is False)")

# Create a motor control program
mechatronic_processor = MechatronicProcessor()

# Program: Read temperature sensor, set motor speed accordingly
motor_program = [
    "READ_SENSOR 1",    # Read temperature sensor (sensor ID 1)
    "COMPARE 50",       # Compare with threshold of 50 degrees
    "JUMP_IF_ZERO 6",   # If temp equals 50, jump to instruction 6
    "LOAD 100",         # If temp != 50, set high motor speed
    "SET_MOTOR",        # Apply motor speed
    "STORE 20",         # Store speed value in memory
    "LOAD 0",           # If temp == 50, set motor speed to 0
    "SET_MOTOR"         # Apply motor speed
]

mechatronic_processor.load_program(motor_program)
mechatronic_processor.run_program()

```

Try modifying the sensor readings in the `test_values` dictionary and see how the program flow changes.
///

/// details | Exercise 2: Instruction timing analysis
    type: question
    open: false

Different instructions take different amounts of time to execute. Create a `TimedProcessor` class that tracks clock cycles for each instruction:

- `LOAD`: 1 cycle

- `ADD`: 1 cycle  

- `STORE`: 2 cycles (memory access is slower)

- `COMPARE`: 1 cycle

- `MULTIPLY`: 4 cycles (multiplication is complex)

Compare the timing of two approaches to calculate `5 * 4`:

1. Adding 5 four times

2. Using multiplication directly

/// details | Sample Solution
    type: success
    open: false

```python
class TimedProcessor(SimpleProcessor):
    def __init__(self):
        super().__init__()
        self.clock_cycles = 0
        
        # Different instructions take different amounts of time
        self.instruction_timing = {
            'LOAD': 1,      # 1 clock cycle
            'ADD': 1,       # 1 clock cycle  
            'STORE': 2,     # 2 clock cycles (memory access is slower)
            'COMPARE': 1,   # 1 clock cycle
            'MULTIPLY': 4   # 4 clock cycles (multiplication is complex)
        }
    
    def decode_and_execute(self, instruction):
        """Execute instruction and track timing"""
        parts = instruction.split()
        opcode = parts[0]
        
        # Execute the instruction
        if opcode == "MULTIPLY":
            value = int(parts[1])
            self.accumulator *= value
            print(f"MULTIPLY {value}: Accumulator = {self.accumulator}")
        else:
            super().decode_and_execute(instruction)
        
        # Add timing cost
        cycles = self.instruction_timing.get(opcode, 1)
        self.clock_cycles += cycles
        print(f"  (Took {cycles} clock cycles, total: {self.clock_cycles})")

# Compare execution times of different approaches
timed_processor = TimedProcessor()

# Approach 1: Multiple additions
print("Approach 1: Adding repeatedly")
program1 = ["LOAD 5", "ADD 5", "ADD 5", "ADD 5", "STORE 10"]
timed_processor.load_program(program1)
timed_processor.run_program()
time1 = timed_processor.clock_cycles

print(f"\nApproach 1 took {time1} clock cycles")
print("=" * 40)

# Approach 2: Using multiplication
timed_processor = TimedProcessor()  # Reset processor
print("Approach 2: Using multiplication")
program2 = ["LOAD 5", "MULTIPLY 4", "STORE 10"]
timed_processor.load_program(program2)
timed_processor.run_program()
time2 = timed_processor.clock_cycles

print(f"\nApproach 2 took {time2} clock cycles")
print(f"Difference: {abs(time1 - time2)} clock cycles")

```

This demonstrates why understanding instruction timing is important for real-time mechatronic systems.
///

## Recap

In this section, you learned about the computing hardware that powers mechatronic systems:

**Key concepts:**

- **Microcontrollers vs CPUs**: Microcontrollers are simpler, lower-power processors designed for specific control tasks, while CPUs are more powerful and general-purpose.

- **Instruction sets**: The vocabulary of operations that a processor can understand and execute, represented by opcodes.

- **Registers**: Fast internal memory locations where the processor keeps data it's currently working on.

- **Fetch-decode-execute cycle**: The fundamental process by which processors work through instructions one by one.

**Why this matters for mechatronics:**

- Understanding processor capabilities helps you choose the right hardware for your project

- Knowing about instruction timing helps you write code that meets real-time requirements

- Understanding how processors work helps you debug timing-sensitive control systems

- Register knowledge helps you optimize code for better performance

In the next section, we'll explore the sensors and actuators that connect your computing hardware to the physical world.

**See also:**

- Section 8.1: Working with device data and diagnostics

- Section 10.2: Implementing closed loop control
