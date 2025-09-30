# 09.03 Algorithmic Patterns Control - Quiz

!!! quiz "Section 9.3 Quiz: Algorithmic Patterns for Control"

    1. In a state machine, what triggers a transition from one state to another?
        - Actions
        - Events {data-correct}
        - States
        - Variables

    2. Which component of a PID controller responds to the current magnitude of error?
        - Proportional (P) {data-correct}
        - Integral (I)
        - Derivative (D)
        - Setpoint

    3. What is the main purpose of the Integral (I) term in a PID controller?
        - Prevent overshoot
        - Respond to current error
        - Eliminate steady-state error {data-correct}
        - Reduce oscillation

    4. A conveyor belt system needs to transition from "Running" to "Stopping" when which events occur?
        - Stop button pressed {data-correct}
        - Safety sensor blocked {data-correct}
        - Start button pressed
        - Speed sensor reading

    5. In task scheduling, what does "rate-monotonic" priority assignment mean?
        - All tasks get equal priority
        - Tasks with higher frequencies get higher priority {data-correct}
        - Tasks with longer execution times get higher priority
        - Tasks are assigned random priorities

    6. Which PID tuning problem is indicated by a system that oscillates around the setpoint?
        - Proportional gain too low
        - Integral gain too high {data-correct}
        - Derivative gain too low
        - Setpoint too high

    7. State machines are most appropriate for controlling systems that:
        - Have continuous variables only
        - Exist in distinct operating modes {data-correct}
        - Require precise mathematical calculations
        - Never change behaviour

    8. In a multi-task control system, which tasks should typically receive the highest scheduling priority?
        - Data logging tasks
        - User interface updates
        - Safety monitoring tasks {data-correct}
        - File operations
