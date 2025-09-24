# Year 11 — Programming Mechatronics: Module Plan

Begin with concepts, data, and simulations. Postpone hardware-specific coding until a platform ## Folder naming (mapping to numbered sections)

- Display: numbered titles (e.g., "8.2 Wiring diagrams and power requirements").

- Folders: `docs/Year11/ProgrammingMechatronics/Chapter-0X-Name/Section-0Y-Name/`

  - `index.md`

  - `quiz.md`med. Use PlantUML for wiring and subsystem diagrams.

---

## Chapter 7 — Mechatronics foundations

Covers: applications, computing hardware, and I/O devices. Outcomes: SE-11-03.

### 7.1 Applications of mechatronic systems

- Outcomes: SE-11-03

- Learn: domains, use-cases, constraints (cost, safety, environment).

### 7.2 Computing hardware: CPU, instruction sets, registers

- Outcomes: SE-11-03

- Learn: microcontrollers vs CPUs, high-level opcodes, simple fetch–decode–execute.

### 7.3 Sensors, actuators, and end effectors

- Outcomes: SE-11-03

- Learn: common types, ranges, response time, accuracy, and selection trade-offs.

- Examples to cover explicitly:

  - motion sensors (PIR, accelerometers, encoders)

  - light-level sensors (photocells, photodiodes)

  - hydraulic actuators (basic principles and use-cases)

  - robotic grippers and end-effectors (types and selection criteria)

Exit: students can identify components and describe capabilities/limitations.

---

## Chapter 8 — Data and integration

Covers: device data, wiring/power, accessible design. Outcomes: SE-11-04, SE-11-03, SE-11-05.

### 8.1 Working with device data and diagnostics

- Outcomes: SE-11-04

- Learn: logs, telemetry, units, safe storage; simple CSV logging and reading.

### 8.2 Wiring diagrams and power requirements

- Outcomes: SE-11-03

- Learn: safe wiring diagrams, voltage/current basics, simple power budgeting.

- Determine power, battery and material requirements for typical components (sensors, actuators, controllers) and estimate run-times and safety margins.

### 8.3 Designing accessible mechatronic systems

- Outcomes: SE-11-05

- Learn: inclusive design considerations and examples; usability and safety.

- Determine specialist requirements that influence design and functions of mechatronic systems for people with disability (reach, force limits, alternative interfaces, safety cutouts, maintainability).

Exit: students can interpret device data and draft safe wiring sketches.

---

## Chapter 9 — Control algorithms

Covers: open/closed loop, autonomy, common patterns. Outcomes: SE-11-02.

### 9.1 Open vs closed loop systems

- Outcomes: SE-11-02

- Learn: behaviour differences; feedback concepts; stability at a high level.

### 9.2 Autonomous control features

- Outcomes: SE-11-02

- Learn: autonomy levels; safety interlocks and fallbacks.

### 9.3 Algorithmic patterns for control

- Outcomes: SE-11-02

- Learn: state machines, conceptual PID, basic scheduling.

### 9.4 Mechanical constraints and subsystem composition

- Outcomes: SE-11-02

- Learn: motion constraints and degrees of freedom for mechanical subsystems; how to combine sensors, actuators and end effectors to form viable subsystems; strategies for composing multiple subsystems into a coordinated system.

Exit: students can explain feedback and outline control strategies.

---

## Chapter 10 — Programming and building

Covers: Python simulations, control implementation, integration, UI, and testing. Outcomes: SE-11-06, SE-11-02, SE-11-07.

### 10.1 Simulations and prototypes for testing

- Outcomes: SE-11-06

- Learn: simulate sensor inputs and actuator outputs in Python.

### 10.2 Implementing closed loop control

- Outcomes: SE-11-02, SE-11-07

- Learn: simple control loop in Python; structured functions and parameters.

### 10.3 Integrating sensors and actuators

- Outcomes: SE-11-02

- Learn: interface abstractions in Python; test harnesses.

### 10.4 User interfaces for control

- Outcomes: SE-11-06

- Learn: simple CLI/dashboard mock-ups; clear status and error messaging.

### 10.5 Unit tests for subsystems

- Outcomes: SE-11-06

- Learn: testability patterns; fixtures for simulated devices.

Exit: students can prototype a small control system in Python with tests.

---

## Author deliverables per section

- index.md: explanation, Python example(s), PlantUML diagram(s), practice tasks, recap.

- quiz.md: 3–8 questions using the Markdown-only quiz pattern.

## Folder naming (mapping to numbered sections)

- Display: numbered titles (e.g., “2.2 Wiring diagrams and power requirements”).

- Folders: `docs/Year11/ProgrammingMechatronics/Chapter-0X-Name/Section-0Y-Name/`

  - `index.md`

  - `quiz.md`
