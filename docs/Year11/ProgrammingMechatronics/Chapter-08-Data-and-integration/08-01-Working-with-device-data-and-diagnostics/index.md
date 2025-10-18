---
title: "8.1 Working with device data and diagnostics"
---

# 8.1 Working with device data and diagnostics

## Why it matters

Mechatronic systems generate continuous streams of data from sensors, actuators, and controllers. This data tells us what's happening in real-time and provides a historical record for troubleshooting, maintenance, and performance optimisation. Without proper data handling, even the most sophisticated robotic arm or automated production line becomes a "black box" when problems occur.

Understanding how to collect, store, and analyse device data is essential for building reliable mechatronic systems. Whether you're monitoring temperature in a greenhouse automation system or tracking motor performance in a robotic vehicle, the ability to work with device data separates hobby projects from professional engineering solutions.

## Concepts

### Device logs and telemetry

Device logs are timestamped records of system events, sensor readings, and operational status. They capture both routine operations (sensor readings every second) and significant events (motor overheating, emergency stops).

Telemetry refers to the automated collection and transmission of data from remote devices. In mechatronics, this might include sending motor speed data from a robot to a central monitoring system, or transmitting greenhouse sensor readings to a farm management application.

```python
import datetime

# Simple logging example
def log_sensor_reading(sensor_name, value, unit):
    timestamp = datetime.datetime.now()
    log_entry = f"{timestamp}: {sensor_name} = {value} {unit}"
    print(log_entry)
    return log_entry

# Simulate temperature sensor readings
log_sensor_reading("temp_greenhouse_1", 24.5, "°C")
log_sensor_reading("humidity_greenhouse_1", 68, "%")
log_sensor_reading("soil_moisture_bed_A", 420, "analog_value")

```

Key characteristics of good device logs:

- **Timestamps**: Every entry needs a precise time reference

- **Clear identification**: Which sensor or component generated the data

- **Units**: Always specify measurement units to avoid confusion

- **Consistent format**: Standardised structure for easy processing

### Units and measurement standards

Mechatronic systems work with diverse measurements: temperature in Celsius, distance in millimetres, pressure in pascals, electrical current in amperes. Mixing units or losing track of what units you're using leads to serious errors.

```python
# Bad: unclear units
motor_speed = 1500  # RPM? degrees per second? unclear!

# Good: explicit units
motor_speed_rpm = 1500
servo_angle_degrees = 45
distance_mm = 250.5

# Even better: use descriptive variable names
greenhouse_temp_celsius = 22.4
soil_moisture_percent = 67

```

For complex systems, consider creating unit-aware data structures:

```python-template
class SensorReading:
    def __init__(self, value, unit, sensor_id):
        self.value = value
        self.unit = unit
        self.sensor_id = sensor_id
        self.timestamp = datetime.datetime.now()
    
    def __str__(self):
        return f"{self.sensor_id}: {self.value} {self.unit} at {self.timestamp}"

# Usage
temp_reading = SensorReading(23.8, "°C", "greenhouse_temp_01")
print(temp_reading)

```

### Safe storage considerations

Device data often contains sensitive information about system performance, locations, or operational patterns. Safe storage involves both technical security (encryption, access control) and practical reliability (backup strategies, data integrity).

For mechatronic systems, consider:

- **Local vs cloud storage**: Local storage for real-time control, cloud for analysis

- **Data retention**: How long to keep historical data before archiving

- **Access control**: Who can read operational data vs system configuration

- **Backup strategies**: Multiple copies of critical calibration and configuration data

```python
import json
import os

class SecureDataLogger:
    def __init__(self, log_directory):
        self.log_directory = log_directory
        # Ensure directory exists and has appropriate permissions
        os.makedirs(log_directory, mode=0o750, exist_ok=True)
    
    def write_reading(self, sensor_data):
        # Create daily log files for better organisation
        today = datetime.date.today()
        filename = f"sensor_log_{today}.json"
        filepath = os.path.join(self.log_directory, filename)
        
        # Append to existing file or create new one
        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "data": sensor_data
        }
        
        # Safe file writing: write to temp file, then rename
        temp_filepath = filepath + ".tmp"
        with open(temp_filepath, 'a') as f:
            json.dump(log_entry, f)
            f.write('\n')
        
        os.rename(temp_filepath, filepath)

```

### Guided example: greenhouse monitoring system

Let's build a simple greenhouse monitoring system that demonstrates proper device data handling. Our system will track temperature, humidity, and soil moisture, logging everything to CSV files for later analysis.

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

class GreenhouseMonitor {
    - sensors: dict
    - log_file: string
    + \_\_init\_\_(log_file)
    + add_sensor(sensor_id, sensor_type)
    + read_all_sensors(): dict
    + log_readings(readings)
    + get_latest_reading(sensor_id): float
}

class SensorReading {
    + timestamp: datetime
    + sensor_id: string
    + value: float
    + unit: string
    + \_\_init\_\_(sensor_id, value, unit)
}

class CSVLogger {
    - filename: string
    + \_\_init\_\_(filename)
    + write_header(headers)
    + write_reading(reading_data)
    + read_all_data(): list
}

GreenhouseMonitor --> SensorReading : creates
GreenhouseMonitor --> CSVLogger : uses
@enduml

```

Here's the implementation:

```python
import csv
import datetime
import random

class SensorReading:
    def __init__(self, sensor_id, value, unit):
        self.sensor_id = sensor_id
        self.value = value
        self.unit = unit
        self.timestamp = datetime.datetime.now()
    
    def to_dict(self):
        return {
            'timestamp': self.timestamp.isoformat(),
            'sensor_id': self.sensor_id,
            'value': self.value,
            'unit': self.unit
        }

class GreenhouseMonitor:
    def __init__(self, log_file):
        self.log_file = log_file
        self.sensors = {}
        self.setup_csv_logging()
    
    def setup_csv_logging(self):
        """Create CSV file with headers if it doesn't exist"""
        try:
            with open(self.log_file, 'x', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(['timestamp', 'sensor_id', 'value', 'unit'])
        except FileExistsError:
            pass  # File already exists, which is fine
    
    def add_sensor(self, sensor_id, sensor_type):
        """Register a new sensor with the monitoring system"""
        self.sensors[sensor_id] = sensor_type
        print(f"Added {sensor_type} sensor: {sensor_id}")
    
    def simulate_reading(self, sensor_id):
        """Simulate sensor readings for demonstration"""
        sensor_type = self.sensors.get(sensor_id)
        
        if sensor_type == "temperature":
            return round(random.uniform(18.0, 28.0), 1)
        elif sensor_type == "humidity":
            return round(random.uniform(50.0, 80.0), 1)
        elif sensor_type == "soil_moisture":
            return round(random.uniform(30.0, 70.0), 1)
        else:
            return 0.0
    
    def read_all_sensors(self):
        """Read current values from all registered sensors"""
        readings = []
        
        for sensor_id, sensor_type in self.sensors.items():
            value = self.simulate_reading(sensor_id)
            
            # Determine appropriate unit
            if sensor_type == "temperature":
                unit = "°C"
            elif sensor_type == "humidity":
                unit = "%"
            elif sensor_type == "soil_moisture":
                unit = "%"
            else:
                unit = "unknown"
            
            reading = SensorReading(sensor_id, value, unit)
            readings.append(reading)
        
        return readings
    
    def log_readings(self, readings):
        """Write sensor readings to CSV file"""
        with open(self.log_file, 'a', newline='') as f:
            writer = csv.writer(f)
            for reading in readings:
                writer.writerow([
                    reading.timestamp.isoformat(),
                    reading.sensor_id,
                    reading.value,
                    reading.unit
                ])
    
    def get_recent_data(self, hours=24):
        """Read recent data from CSV file"""
        cutoff_time = datetime.datetime.now() - datetime.timedelta(hours=hours)
        recent_readings = []
        
        try:
            with open(self.log_file, 'r', newline='') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    timestamp = datetime.datetime.fromisoformat(row['timestamp'])
                    if timestamp >= cutoff_time:
                        recent_readings.append(row)
        except FileNotFoundError:
            print(f"Log file {self.log_file} not found")
        
        return recent_readings

# Demonstration usage
if __name__ == "__main__":
    # Create monitoring system
    monitor = GreenhouseMonitor("greenhouse_data.csv")
    
    # Register sensors
    monitor.add_sensor("temp_01", "temperature")
    monitor.add_sensor("humid_01", "humidity")
    monitor.add_sensor("soil_bed_a", "soil_moisture")
    monitor.add_sensor("soil_bed_b", "soil_moisture")
    
    # Simulate data collection over time
    print("\nCollecting sensor data...")
    for i in range(5):
        readings = monitor.read_all_sensors()
        monitor.log_readings(readings)
        
        print(f"Reading {i+1}:")
        for reading in readings:
            print(f"  {reading.sensor_id}: {reading.value} {reading.unit}")
        print()
    
    # Analyse recent data
    print("Recent 24-hour data summary:")
    recent_data = monitor.get_recent_data(24)
    print(f"Total readings collected: {len(recent_data)}")
    
    # Simple analysis: average temperature
    temp_readings = [float(row['value']) for row in recent_data 
                    if row['sensor_id'] == 'temp_01']
    if temp_readings:
        avg_temp = sum(temp_readings) / len(temp_readings)
        print(f"Average temperature: {avg_temp:.1f}°C")

```

## Try it

### Exercise 1: Data logging expansion

Extend the greenhouse monitoring system to include additional sensor types and improve the data analysis capabilities.

/// details | Task requirements
    type: question
    open: false

Add support for:

1. Light intensity sensors (measured in lux)

2. CO2 concentration sensors (measured in ppm)

3. A method to calculate hourly averages for each sensor

4. Alert detection for out-of-range values

/// details | Sample solution
    type: success
    open: false

```python-template
class EnhancedGreenhouseMonitor(GreenhouseMonitor):
    def __init__(self, log_file):
        super().__init__(log_file)
        self.alert_thresholds = {
            'temperature': (15.0, 30.0),  # min, max in °C
            'humidity': (40.0, 85.0),     # min, max in %
            'light': (1000, 50000),       # min, max in lux
            'co2': (300, 1500)            # min, max in ppm
        }
    
    def simulate_reading(self, sensor_id):
        """Enhanced simulation with more sensor types"""
        sensor_type = self.sensors.get(sensor_id)
        
        if sensor_type == "light":
            return round(random.uniform(5000, 45000), 0)
        elif sensor_type == "co2":
            return round(random.uniform(400, 1200), 0)
        else:
            return super().simulate_reading(sensor_id)
    
    def check_alerts(self, readings):
        """Check if any readings are outside normal ranges"""
        alerts = []
        
        for reading in readings:
            sensor_type = self.sensors.get(reading.sensor_id)
            if sensor_type in self.alert_thresholds:
                min_val, max_val = self.alert_thresholds[sensor_type]
                if reading.value < min_val or reading.value > max_val:
                    alerts.append(f"ALERT: {reading.sensor_id} = {reading.value} {reading.unit} "
                                f"(normal range: {min_val}-{max_val})")
        
        return alerts
    
    def calculate_hourly_averages(self, hours=1):
        """Calculate average values for the past N hours"""
        recent_data = self.get_recent_data(hours)
        
        # Group by sensor_id
        sensor_groups = {}
        for row in recent_data:
            sensor_id = row['sensor_id']
            if sensor_id not in sensor_groups:
                sensor_groups[sensor_id] = []
            sensor_groups[sensor_id].append(float(row['value']))
        
        # Calculate averages
        averages = {}
        for sensor_id, values in sensor_groups.items():
            if values:
                averages[sensor_id] = {
                    'average': sum(values) / len(values),
                    'count': len(values),
                    'unit': self.get_sensor_unit(sensor_id)
                }
        
        return averages
    
    def get_sensor_unit(self, sensor_id):
        """Get the appropriate unit for a sensor"""
        sensor_type = self.sensors.get(sensor_id)
        units = {
            'temperature': '°C',
            'humidity': '%',
            'soil_moisture': '%',
            'light': 'lux',
            'co2': 'ppm'
        }
        return units.get(sensor_type, 'unknown')

# Test the enhanced system
enhanced_monitor = EnhancedGreenhouseMonitor("enhanced_greenhouse.csv")
enhanced_monitor.add_sensor("light_01", "light")
enhanced_monitor.add_sensor("co2_01", "co2")
enhanced_monitor.add_sensor("temp_01", "temperature")

# Collect data and check for alerts
readings = enhanced_monitor.read_all_sensors()
alerts = enhanced_monitor.check_alerts(readings)
enhanced_monitor.log_readings(readings)

for alert in alerts:
    print(alert)

```

///
///

### Exercise 2: CSV data analysis

Write functions to analyse the collected greenhouse data and generate summary reports.

/// details | Task requirements
    type: question
    open: false

Create functions to:

1. Find the minimum and maximum values for each sensor over a time period

2. Identify time periods when values were outside normal ranges

3. Calculate daily summaries (min, max, average) for each sensor type

4. Export summary data to a new CSV file

/// details | Sample solution
    type: success
    open: false

```python
import pandas as pd
from datetime import datetime, timedelta

class GreenhouseAnalyser:
    def __init__(self, csv_file):
        self.csv_file = csv_file
    
    def load_data(self):
        """Load and parse CSV data"""
        try:
            df = pd.read_csv(self.csv_file)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            return df
        except FileNotFoundError:
            print(f"Data file {self.csv_file} not found")
            return pd.DataFrame()
    
    def get_sensor_statistics(self, sensor_id, days=7):
        """Get min, max, average for a specific sensor"""
        df = self.load_data()
        if df.empty:
            return None
        
        # Filter by sensor and time period
        cutoff = datetime.now() - timedelta(days=days)
        sensor_data = df[(df['sensor_id'] == sensor_id) & 
                        (df['timestamp'] >= cutoff)]
        
        if sensor_data.empty:
            return None
        
        return {
            'sensor_id': sensor_id,
            'min_value': sensor_data['value'].min(),
            'max_value': sensor_data['value'].max(),
            'avg_value': sensor_data['value'].mean(),
            'unit': sensor_data['unit'].iloc[0],
            'reading_count': len(sensor_data)
        }
    
    def find_out_of_range_periods(self, sensor_id, min_threshold, max_threshold):
        """Find periods when sensor values were outside thresholds"""
        df = self.load_data()
        sensor_data = df[df['sensor_id'] == sensor_id].copy()
        
        # Mark out-of-range readings
        sensor_data['out_of_range'] = (
            (sensor_data['value'] < min_threshold) | 
            (sensor_data['value'] > max_threshold)
        )
        
        # Find consecutive out-of-range periods
        out_of_range_periods = []
        start_time = None
        
        for _, row in sensor_data.iterrows():
            if row['out_of_range'] and start_time is None:
                start_time = row['timestamp']
            elif not row['out_of_range'] and start_time is not None:
                out_of_range_periods.append({
                    'start': start_time,
                    'end': row['timestamp'],
                    'duration_minutes': (row['timestamp'] - start_time).total_seconds() / 60
                })
                start_time = None
        
        return out_of_range_periods
    
    def generate_daily_summary(self):
        """Generate daily summary statistics for all sensors"""
        df = self.load_data()
        if df.empty:
            return pd.DataFrame()
        
        # Add date column
        df['date'] = df['timestamp'].dt.date
        
        # Group by date and sensor_id, calculate statistics
        daily_summary = df.groupby(['date', 'sensor_id']).agg({
            'value': ['min', 'max', 'mean', 'count'],
            'unit': 'first'
        }).round(2)
        
        # Flatten column names
        daily_summary.columns = ['min_value', 'max_value', 'avg_value', 'reading_count', 'unit']
        daily_summary = daily_summary.reset_index()
        
        return daily_summary
    
    def export_summary_report(self, output_file):
        """Export comprehensive summary to CSV"""
        daily_summary = self.generate_daily_summary()
        
        if not daily_summary.empty:
            daily_summary.to_csv(output_file, index=False)
            print(f"Summary report exported to {output_file}")
            return True
        else:
            print("No data available for summary report")
            return False

# Example usage
analyser = GreenhouseAnalyser("greenhouse_data.csv")

# Get statistics for temperature sensor
temp_stats = analyser.get_sensor_statistics("temp_01", days=7)
if temp_stats:
    print(f"Temperature statistics (7 days):")
    print(f"  Min: {temp_stats['min_value']}{temp_stats['unit']}")
    print(f"  Max: {temp_stats['max_value']}{temp_stats['unit']}")
    print(f"  Average: {temp_stats['avg_value']:.1f}{temp_stats['unit']}")
    print(f"  Readings: {temp_stats['reading_count']}")

# Find periods when temperature was out of acceptable range
out_of_range = analyser.find_out_of_range_periods("temp_01", 18.0, 25.0)
print(f"\nFound {len(out_of_range)} out-of-range periods")

# Export daily summary
analyser.export_summary_report("greenhouse_daily_summary.csv")

```

Note: This solution uses pandas for easier data manipulation. For the basic curriculum, you could implement similar functionality using only built-in Python CSV operations, though it would require more code.
///
///

### Exercise 3: Real-time monitoring dashboard

Create a simple text-based dashboard that displays current sensor readings and recent trends.

/// details | Task requirements
    type: question
    open: false

Build a dashboard that:

1. Shows current readings from all sensors

2. Displays colour-coded status (normal/warning/alert)

3. Shows simple trend indicators (rising/falling/stable)

4. Updates every few seconds

5. Includes timestamp of last update

/// details | Sample solution
    type: success
    open: false

```python
import time
import os
from datetime import datetime, timedelta

class MonitoringDashboard:
    def __init__(self, monitor):
        self.monitor = monitor
        self.previous_readings = {}
        self.alert_thresholds = {
            'temp_01': (18.0, 26.0),
            'humid_01': (50.0, 80.0),
            'soil_bed_a': (40.0, 70.0),
            'soil_bed_b': (40.0, 70.0)
        }
    
    def get_status_indicator(self, sensor_id, value):
        """Get status indicator based on thresholds"""
        if sensor_id in self.alert_thresholds:
            min_val, max_val = self.alert_thresholds[sensor_id]
            if value < min_val or value > max_val:
                return "🔴 ALERT"
            elif value < min_val * 1.1 or value > max_val * 0.9:
                return "🟡 WARN"
            else:
                return "🟢 OK"
        return "🔵 UNKNOWN"
    
    def get_trend_indicator(self, sensor_id, current_value):
        """Compare with previous reading to show trend"""
        if sensor_id in self.previous_readings:
            previous = self.previous_readings[sensor_id]
            diff = current_value - previous
            
            if abs(diff) < 0.5:  # Stable threshold
                return "→ STABLE"
            elif diff > 0:
                return "↗ RISING"
            else:
                return "↘ FALLING"
        return "— NEW"
    
    def clear_screen(self):
        """Clear terminal screen"""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def display_dashboard(self):
        """Display current dashboard"""
        self.clear_screen()
        
        print("=" * 60)
        print("🏠 GREENHOUSE MONITORING DASHBOARD")
        print("=" * 60)
        print(f"Last Update: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 60)
        
        # Get current readings
        readings = self.monitor.read_all_sensors()
        
        # Display each sensor
        for reading in readings:
            status = self.get_status_indicator(reading.sensor_id, reading.value)
            trend = self.get_trend_indicator(reading.sensor_id, reading.value)
            
            print(f"{reading.sensor_id:15} | {reading.value:6.1f} {reading.unit:3} | {status:10} | {trend}")
            
            # Update previous readings
            self.previous_readings[reading.sensor_id] = reading.value
        
        print("-" * 60)
        print("Legend: 🟢 Normal | 🟡 Warning | 🔴 Alert | ↗ Rising | ↘ Falling | → Stable")
        print("Press Ctrl+C to exit")
        print("=" * 60)
    
    def run_continuous(self, update_interval=5):
        """Run dashboard with automatic updates"""
        try:
            while True:
                self.display_dashboard()
                time.sleep(update_interval)
        except KeyboardInterrupt:
            print("\nDashboard stopped by user")

# Run the dashboard
if __name__ == "__main__":
    # Create monitor and dashboard
    monitor = GreenhouseMonitor("dashboard_demo.csv")
    monitor.add_sensor("temp_01", "temperature")
    monitor.add_sensor("humid_01", "humidity")
    monitor.add_sensor("soil_bed_a", "soil_moisture")
    monitor.add_sensor("soil_bed_b", "soil_moisture")
    
    dashboard = MonitoringDashboard(monitor)
    
    print("Starting greenhouse monitoring dashboard...")
    print("The dashboard will update every 5 seconds.")
    print("Press Ctrl+C to stop.")
    time.sleep(2)
    
    dashboard.run_continuous(update_interval=5)

```

///
///

## Recap

Device data forms the foundation of intelligent mechatronic systems. In this section, you learned how to:

- **Capture device data** with proper timestamps, units, and identification

- **Implement logging systems** that safely store sensor readings and system events

- **Work with CSV files** for data persistence and analysis

- **Handle units consistently** to avoid measurement errors

- **Design secure storage** considering both technical and practical requirements

Key principles for device data management:

1. Always include timestamps and units with every measurement

2. Use consistent, descriptive naming for sensors and data fields

3. Implement safe file operations to prevent data corruption

4. Plan for data analysis from the beginning - structure your logs for easy processing

5. Consider storage requirements and retention policies early in design

The greenhouse monitoring example demonstrated how these concepts work together in a practical system. The exercises explored data analysis, real-time monitoring, and system expansion - all essential skills for building robust mechatronic systems.

Next, you'll learn about wiring diagrams and power requirements, where proper documentation becomes critical for safe system construction and maintenance.
