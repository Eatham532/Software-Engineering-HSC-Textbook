---
title: "10.03 Integrating Sensors And Actuators - Quiz"
---

# 10.03 Integrating Sensors And Actuators - Quiz

!!! quiz "Section 10.3 Quiz: Integrating sensors and actuators"

    1. What is the main purpose of interface abstractions in mechatronic systems?
        - To make devices more expensive
        - To hide device complexity behind standard operations {data-correct}
        - To make systems run faster
        - To reduce the number of devices needed

    2. Which method is required in all Sensor abstract class implementations?
        - get_status()
        - is_reading_fresh()
        - read_value() {data-correct}
        - emergency_stop()

    3. What happens when an actuator's emergency_stop() method is called?
        - The actuator moves to maximum position
        - The actuator is disabled and output set to zero {data-correct}
        - The actuator speed increases
        - Nothing - it's just a placeholder method

    4. What is a key advantage of using a DeviceManager class?
        - It eliminates the need for sensors
        - It coordinates multiple devices and handles errors centrally {data-correct}
        - It makes actuators move faster
        - It reduces power consumption

    5. In the test harness, what is the purpose of MockSensor and MockActuator classes?
        - To replace real devices permanently
        - To enable testing without physical hardware {data-correct}
        - To make devices more reliable
        - To reduce system cost

    6. What does "inject_fault" functionality allow you to test?
        - Normal system operation only
        - How the system handles device failures {data-correct}
        - Device manufacturing quality
        - Power consumption optimization

    7. In the environmental controller example, what happens when a sensor reading is None?
        - The system crashes
        - The control system uses safe default values {data-correct}
        - All actuators are set to maximum
        - The system ignores all other sensors

    8. Which of these is NOT a benefit of proper device abstraction?
        - Easier testing with mock devices
        - Ability to swap hardware without changing control logic
        - Faster device response times {data-correct}
        - Better error handling and system reliability
