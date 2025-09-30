# 09.04 Mechanical Constraints And Subsystem Composition - Quiz

!!! quiz "Section 9.4 Quiz: Mechanical constraints and subsystem composition"

    1. What does "degrees of freedom" mean in a mechanical system?
        - The number of joints in the system
        - The number of independent ways the system can move {data-correct}
        - The maximum speed the system can achieve
        - The weight capacity of the system

    2. A 2-joint robot arm operating in a 2D plane has how many degrees of freedom?
        - 1
        - 2 {data-correct}
        - 3
        - 4

    3. Which of the following are important considerations for subsystem composition? (Select all that apply)
        - Clear communication protocols between subsystems {data-correct}
        - Collision avoidance and safety margins {data-correct}
        - Coordinated control authority {data-correct}
        - Using identical components in all subsystems

    4. What is the primary purpose of a safety margin in collision detection?
        - To reduce system cost
        - To prevent mechanical interference between moving parts {data-correct}
        - To increase system speed
        - To simplify programming

    5. In a mobile robot with navigation and manipulation subsystems, what role does the control subsystem play?
        - It replaces all other subsystems
        - It coordinates communication and commands between subsystems {data-correct}
        - It only handles emergency stops
        - It provides power to all components

    6. A robot arm has joint limits of: base (±180°), shoulder (±90°), elbow (0° to 135°). If the shoulder is at 100°, what is the problem?
        - The base angle is too high
        - The shoulder angle exceeds its maximum limit {data-correct}
        - The elbow needs to be adjusted
        - There is no problem

    7. Which coordination strategy helps prevent conflicts between multiple subsystems?
        - Running all subsystems at maximum speed
        - Using a single control authority with clear communication protocols {data-correct}
        - Operating each subsystem independently
        - Eliminating safety checks

    8. What is a key advantage of modular subsystem design in mechatronics?
        - It reduces the total number of components needed
        - It allows individual subsystems to be tested and maintained separately {data-correct}
        - It eliminates the need for coordination between components
        - It makes the system operate faster
