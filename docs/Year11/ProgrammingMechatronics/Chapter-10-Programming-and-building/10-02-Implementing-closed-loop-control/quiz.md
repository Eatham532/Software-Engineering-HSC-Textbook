---
title: "10.02 Implementing Closed Loop Control - Quiz"
---

# 10.02 Implementing Closed Loop Control - Quiz

!!! quiz "Section 10.2 Quiz: Implementing closed loop control"

    1. What are the four essential components of a closed loop control system?
        - Setpoint, sensor, controller, actuator {data-correct}
        - Input, output, processor, display
        - Motor, encoder, computer, power supply
        - Algorithm, hardware, software, user interface

    2. In a proportional controller with the equation `output = Kp × error`, what happens when you increase the proportional gain (Kp)?
        - The system responds more slowly but more stably
        - The system responds faster but may become unstable {data-correct}
        - The steady-state error always decreases
        - The system uses less power

    3. What is the main advantage of adding an integral (I) term to a proportional controller?
        - It makes the system respond faster
        - It eliminates steady-state error {data-correct}
        - It prevents overshoot
        - It reduces power consumption

    4. In PID control, what does the derivative (D) term respond to?
        - The current error value
        - The accumulated error over time
        - The rate of change of the error {data-correct}
        - The setpoint value

    5. Which of the following are good practices for implementing control loops in Python? (Select all that apply)
        - Use classes to encapsulate controller logic {data-correct}
        - Apply output limiting to prevent actuator damage {data-correct}
        - Include parameter management for different operating modes {data-correct}
        - Always use the highest possible gain values

    6. A control system has high overshoot but reaches the setpoint quickly. Which PID parameter should you primarily adjust?
        - Increase Kp (proportional gain)
        - Increase Ki (integral gain)
        - Increase Kd (derivative gain) {data-correct}
        - Decrease the setpoint

    7. What is "integral windup" in PID control?
        - When the proportional term becomes too large
        - When the derivative term oscillates
        - When the integral term accumulates to excessive values {data-correct}
        - When the controller output reaches its limit

    8. In the robot arm controller example, why was a gravity compensation term included in the physics simulation?
        - To make the simulation run faster
        - To represent the real-world effect of gravity on arm positioning {data-correct}
        - To reduce the computational complexity
        - To eliminate the need for the integral term
