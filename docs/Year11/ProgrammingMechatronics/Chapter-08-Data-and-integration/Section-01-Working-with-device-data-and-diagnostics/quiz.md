!!! quiz "Section 8.1 Quiz: Working with device data and diagnostics"

    1. What information should ALWAYS be included with every sensor reading in a mechatronic system?
        - The sensor reading value only
        - Timestamp, sensor ID, value, and units {data-correct}
        - Just the timestamp and value
        - Only the units and sensor ID

    2. In the context of mechatronic systems, what is telemetry?
        - A type of sensor that measures distance
        - The automated collection and transmission of data from remote devices {data-correct}
        - A method for calibrating sensors
        - A programming language for robotics

    3. Which of these is the BEST way to handle units in your code?
        - Don't worry about units, just use numbers
        - Put units in comments only
        - Use descriptive variable names that include the unit (e.g., temp_celsius) {data-correct}
        - Use the same unit for everything to keep it simple

    4. What is a key advantage of using CSV files for storing sensor data?
        - CSV files are encrypted by default
        - CSV files can only store numbers, making them safer
        - CSV files are human-readable and can be processed by many tools {data-correct}
        - CSV files automatically compress the data

    5. Which of these represents good logging practice for a mechatronic system?
        - Log everything possible, even if it's not needed
        - Only log when something goes wrong
        - Log regularly with consistent format, timestamps, and clear identification {data-correct}
        - Use different log formats for different sensors

    6. In the greenhouse monitoring example, what would be a reasonable approach for handling sensor readings that are outside normal ranges?
        - Ignore them completely
        - Delete them from the log file
        - Log them but also trigger an alert or notification {data-correct}
        - Replace them with average values

    7. When designing data storage for a mechatronic system, what should you consider for security?
        - Only technical encryption methods
        - Access control, backup strategies, and data retention policies {data-correct}
        - Just password protection
        - Security isn't important for mechatronic systems

    8. What is the main purpose of the `SensorReading` class in our example code?
        - To control the physical sensors
        - To provide a structured way to store sensor data with metadata {data-correct}
        - To encrypt sensor data
        - To convert between different units automatically
