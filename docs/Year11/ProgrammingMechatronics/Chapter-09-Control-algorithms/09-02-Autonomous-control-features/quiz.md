# 09.02 Autonomous Control Features - Quiz

!!! quiz "Section 9.2 Quiz: Autonomous control features"

    1. What characterizes Level 2 (Partial Autonomy) in mechatronic systems?
        - The system requires human control for every action
        - The system can handle routine operations independently while being supervised by humans {data-correct}
        - The system operates completely without any human oversight
        - The system only provides basic assistance to human operators

    2. Which of the following is the best example of a Level 4 (High Autonomy) system?
        - A remote-controlled robot arm
        - An automatic door that opens when motion is detected
        - An industrial robot that can adapt to different part sizes and orientations {data-correct}
        - A simple automated thermostat

    3. What is the primary purpose of safety interlocks in autonomous systems?
        - To make the system run faster
        - To prevent dangerous operations by automatically checking safety conditions {data-correct}
        - To reduce the cost of the system
        - To improve the user interface

    4. What should a well-designed fallback system do when the primary action fails?
        - Immediately shut down the entire system
        - Try alternative approaches before requesting human assistance {data-correct}
        - Ignore the failure and continue with the original plan
        - Always return to the starting position

    5. In the cleaning robot example, what happens when the autonomy level is set to 0?
        - The robot cleans automatically using advanced algorithms
        - The robot waits for human commands before taking any action {data-correct}
        - The robot only cleans in emergencies
        - The robot operates at maximum speed

    6. Which safety check should have the HIGHEST priority in an autonomous system?
        - Battery level monitoring
        - Obstacle detection
        - Emergency stop status {data-correct}
        - Cleaning efficiency

    7. What is a key advantage of implementing multiple autonomy levels in a mechatronic system?
        - It makes the system more expensive
        - It allows the system to adapt to different situations and user requirements {data-correct}
        - It reduces the need for safety features
        - It eliminates the need for human oversight

    8. When designing fallback actions for "move_forward" in a robot, which sequence makes the most sense?
        - stop_immediately → request_human_help → emergency_shutdown
        - reduce_speed → find_alternate_path → stop_and_wait → request_human_help {data-correct}
        - increase_speed → try_jumping → call_emergency_services
        - ignore_obstacle → continue_forward → hope_for_best
