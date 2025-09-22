# 4.4 Using Standard Modules

## What Are Standard Modules?

!!! builds-on "Builds on"
    This section builds on [4.2 Data Structures in Python (Required Set)](../Section-02-Data-Structures-in-Python/index.md).


Python comes with a rich collection of **standard modules** (also called the "standard library") - pre-written code that provides useful functionality without you having to write it from scratch. Think of modules as toolboxes containing specialized tools for specific tasks.

Instead of reinventing the wheel, you can import these modules and use their functions to:

- Perform complex mathematical calculations

- Generate random numbers

- Work with dates and times

- Handle file operations

- Process text and data

This section focuses on two essential modules: `math` and `random`.

## The Math Module

### Importing and Basic Usage

The `math` module provides mathematical functions and constants that go beyond basic arithmetic.

```python
import math

# Basic usage - access functions with math.function_name()
print(f"Square root of 16: {math.sqrt(16)}")
print(f"Value of pi: {math.pi}")
print(f"Value of e: {math.e}")

# Calculate the area of a circle
radius = 5
area = math.pi * math.pow(radius, 2)
print(f"Area of circle with radius {radius}: {area:.2f}")
```

### Essential Math Functions

```python
import math

def demonstrate_math_functions():
    """Demonstrate commonly used math module functions."""
    
    # Power and root functions
    print("=== Power and Root Functions ===")
    print(f"2 to the power of 8: {math.pow(2, 8)}")
    print(f"Square root of 64: {math.sqrt(64)}")
    print(f"Cube root of 27: {math.pow(27, 1/3):.2f}")
    
    # Rounding functions
    print("\n=== Rounding Functions ===")
    value = 4.7
    print(f"Original value: {value}")
    print(f"Floor (round down): {math.floor(value)}")
    print(f"Ceiling (round up): {math.ceil(value)}")
    print(f"Truncate (remove decimal): {math.trunc(value)}")
    
    # Trigonometric functions (angles in radians)
    print("\n=== Trigonometric Functions ===")
    angle_degrees = 45
    angle_radians = math.radians(angle_degrees)
    print(f"Angle: {angle_degrees} degrees = {angle_radians:.4f} radians")
    print(f"sin({angle_degrees}°): {math.sin(angle_radians):.4f}")
    print(f"cos({angle_degrees}°): {math.cos(angle_radians):.4f}")
    print(f"tan({angle_degrees}°): {math.tan(angle_radians):.4f}")
    
    # Logarithmic functions
    print("\n=== Logarithmic Functions ===")
    print(f"Natural log of 10: {math.log(10):.4f}")
    print(f"Log base 10 of 100: {math.log10(100)}")
    print(f"Log base 2 of 8: {math.log2(8)}")
    
    # Constants
    print("\n=== Mathematical Constants ===")
    print(f"Pi (π): {math.pi}")
    print(f"Euler's number (e): {math.e}")
    print(f"Tau (2π): {math.tau}")

demonstrate_math_functions()
```

### Practical Math Applications

```python
import math

def calculate_distance(x1, y1, x2, y2):
    """Calculate distance between two points using the distance formula."""
    
    # Distance formula: √[(x₂-x₁)² + (y₂-y₁)²]
    distance = math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2))
    return distance

def calculate_compound_interest(principal, rate, time, compounds_per_year):
    """Calculate compound interest using the compound interest formula."""
    
    # Formula: A = P(1 + r/n)^(nt)
    # A = final amount, P = principal, r = annual rate, n = compounds per year, t = time
    
    rate_decimal = rate / 100  # Convert percentage to decimal
    exponent = compounds_per_year * time
    base = 1 + (rate_decimal / compounds_per_year)
    
    final_amount = principal * math.pow(base, exponent)
    interest_earned = final_amount - principal
    
    return final_amount, interest_earned

def physics_projectile_motion(initial_velocity, angle_degrees, gravity=9.81):
    """Calculate projectile motion parameters."""
    
    # Convert angle to radians
    angle_radians = math.radians(angle_degrees)
    
    # Calculate components of initial velocity
    vx = initial_velocity * math.cos(angle_radians)
    vy = initial_velocity * math.sin(angle_radians)
    
    # Calculate maximum height: h = (vy²) / (2g)
    max_height = math.pow(vy, 2) / (2 * gravity)
    
    # Calculate time of flight: t = (2 * vy) / g
    flight_time = (2 * vy) / gravity
    
    # Calculate range: R = vx * t
    range_distance = vx * flight_time
    
    return max_height, flight_time, range_distance

# Demonstrate practical applications
print("=== Practical Math Applications ===")

# Distance calculation
point1 = (0, 0)
point2 = (3, 4)
dist = calculate_distance(point1[0], point1[1], point2[0], point2[1])
print(f"Distance from {point1} to {point2}: {dist:.2f} units")

# Compound interest
principal = 1000
rate = 5  # 5% annual interest
time = 3  # 3 years
compounds = 12  # Monthly compounding

final, interest = calculate_compound_interest(principal, rate, time, compounds)
print(f"\nInvestment: ${principal}")
print(f"Interest rate: {rate}% annually, compounded {compounds} times per year")
print(f"After {time} years: ${final:.2f}")
print(f"Interest earned: ${interest:.2f}")

# Projectile motion
velocity = 20  # m/s
angle = 45  # degrees

height, time_flight, range_dist = physics_projectile_motion(velocity, angle)
print(f"\nProjectile motion (v₀={velocity} m/s, θ={angle}°):")
print(f"Maximum height: {height:.2f} meters")
print(f"Flight time: {time_flight:.2f} seconds")
print(f"Range: {range_dist:.2f} meters")
```

## The Random Module

### Importing and Basic Random Numbers

The `random` module generates pseudo-random numbers for simulations, games, and testing.

```python
import random

def demonstrate_random_basics():
    """Demonstrate basic random number generation."""
    
    print("=== Basic Random Numbers ===")
    
    # Random float between 0.0 and 1.0
    print(f"Random float [0.0, 1.0): {random.random():.4f}")
    
    # Random integer in a range
    dice_roll = random.randint(1, 6)  # Includes both 1 and 6
    print(f"Dice roll (1-6): {dice_roll}")
    
    # Random integer from range (excludes upper bound)
    lottery_number = random.randrange(1, 50)  # 1 to 49
    print(f"Lottery number (1-49): {lottery_number}")
    
    # Random float in a range
    temperature = random.uniform(20.0, 30.0)
    print(f"Random temperature (20-30°C): {temperature:.1f}")
    
    # Random choice from a list
    colors = ["red", "green", "blue", "yellow", "purple"]
    chosen_color = random.choice(colors)
    print(f"Random color: {chosen_color}")
    
    # Multiple random choices (with replacement)
    sample_colors = random.choices(colors, k=3)
    print(f"Random sample (with replacement): {sample_colors}")
    
    # Multiple random choices (without replacement)
    unique_colors = random.sample(colors, 3)
    print(f"Random sample (without replacement): {unique_colors}")

demonstrate_random_basics()
```

### Random Module Functions

```python
import random

def demonstrate_random_functions():
    """Demonstrate various random module functions."""
    
    print("=== Random Module Functions ===")
    
    # Shuffling a list
    deck = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    print(f"Original deck: {deck}")
    
    shuffled_deck = deck.copy()  # Don't modify original
    random.shuffle(shuffled_deck)
    print(f"Shuffled deck: {shuffled_deck}")
    
    # Random sampling without replacement
    hand = random.sample(deck, 5)
    print(f"Random hand (5 cards): {hand}")
    
    # Weighted random choices
    fruits = ["apple", "banana", "orange"]
    weights = [1, 3, 2]  # Banana 3x more likely than apple
    
    print(f"\nWeighted choices (apple:1, banana:3, orange:2):")
    selections = random.choices(fruits, weights=weights, k=10)
    for fruit in fruits:
        count = selections.count(fruit)
        print(f"{fruit}: {count} times")
    
    # Setting random seed for reproducible results
    print(f"\n=== Reproducible Random Numbers ===")
    random.seed(42)  # Set seed
    print("First sequence:")
    for i in range(5):
        print(f"  {random.randint(1, 100)}")
    
    random.seed(42)  # Reset to same seed
    print("Second sequence (same seed):")
    for i in range(5):
        print(f"  {random.randint(1, 100)}")

demonstrate_random_functions()
```

### Practical Random Applications

```python
import random
import math

def password_generator(length=8, include_symbols=True):
    """Generate a random password."""
    
    lowercase = "abcdefghijklmnopqrstuvwxyz"
    uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    digits = "0123456789"
    symbols = "!@#$%^&*"
    
    # Build character set
    chars = lowercase + uppercase + digits
    if include_symbols:
        chars += symbols
    
    # Generate password
    password = ""
    for i in range(length):
        password += random.choice(chars)
    
    return password

def simulate_dice_rolling(num_dice=2, num_rolls=1000):
    """Simulate rolling dice and analyze results."""
    
    results = {}
    
    # Roll dice many times
    for roll in range(num_rolls):
        total = 0
        for die in range(num_dice):
            total += random.randint(1, 6)
        
        if total in results:
            results[total] += 1
        else:
            results[total] = 1
    
    # Display results
    print(f"=== Dice Rolling Simulation ({num_dice} dice, {num_rolls} rolls) ===")
    for total in sorted(results.keys()):
        count = results[total]
        percentage = (count / num_rolls) * 100
        bar = "█" * int(percentage / 2)  # Visual bar
        print(f"Sum {total:2d}: {count:4d} times ({percentage:5.1f}%) {bar}")

def monte_carlo_pi_estimation(num_points=10000):
    """Estimate π using Monte Carlo method."""
    
    points_in_circle = 0
    
    for i in range(num_points):
        # Generate random point in unit square [-1, 1] x [-1, 1]
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)
        
        # Check if point is inside unit circle
        distance_from_origin = math.sqrt(x*x + y*y)
        if distance_from_origin <= 1:
            points_in_circle += 1
    
    # Estimate π: ratio of points in circle to total points × 4
    pi_estimate = 4 * points_in_circle / num_points
    actual_pi = math.pi
    error = abs(pi_estimate - actual_pi)
    
    print(f"=== Monte Carlo π Estimation ===")
    print(f"Points used: {num_points}")
    print(f"Points in circle: {points_in_circle}")
    print(f"Estimated π: {pi_estimate:.6f}")
    print(f"Actual π: {actual_pi:.6f}")
    print(f"Error: {error:.6f}")

def create_quiz_generator():
    """Generate random math quiz questions."""
    
    def generate_question():
        """Generate a single random math question."""
        
        question_types = ["addition", "subtraction", "multiplication", "division"]
        question_type = random.choice(question_types)
        
        if question_type == "addition":
            a = random.randint(10, 99)
            b = random.randint(10, 99)
            question = f"{a} + {b}"
            answer = a + b
        
        elif question_type == "subtraction":
            a = random.randint(50, 99)
            b = random.randint(10, 49)
            question = f"{a} - {b}"
            answer = a - b
        
        elif question_type == "multiplication":
            a = random.randint(2, 12)
            b = random.randint(2, 12)
            question = f"{a} × {b}"
            answer = a * b
        
        else:  # division
            # Ensure exact division
            answer = random.randint(2, 12)
            b = random.randint(2, 12)
            a = answer * b
            question = f"{a} ÷ {b}"
        
        return question, answer
    
    # Generate a quiz
    print("=== Random Math Quiz ===")
    num_questions = 5
    correct_answers = 0
    
    for i in range(num_questions):
        question, correct_answer = generate_question()
        print(f"\nQuestion {i + 1}: {question} = ?")
        
        try:
            user_answer = int(input("Your answer: "))
            if user_answer == correct_answer:
                print("Correct! ✓")
                correct_answers += 1
            else:
                print(f"Incorrect. The answer is {correct_answer}")
        except ValueError:
            print(f"Invalid input. The answer is {correct_answer}")
    
    percentage = (correct_answers / num_questions) * 100
    print(f"\nQuiz complete! Score: {correct_answers}/{num_questions} ({percentage:.0f}%)")

# Demonstrate practical applications
print("=== Practical Random Applications ===")

# Password generation
print("Generated passwords:")
for i in range(3):
    pwd = password_generator(10, True)
    print(f"  {pwd}")

print()

# Dice simulation
simulate_dice_rolling(2, 1000)

print()

# Monte Carlo π estimation
monte_carlo_pi_estimation(50000)

print()

# Interactive quiz (uncomment to run)
# create_quiz_generator()
```

## Combining Math and Random Modules

### Statistical Analysis Tools

```python
import math
import random

def generate_sample_data(size=100, mean=50, std_dev=15):
    """Generate sample data using normal distribution approximation."""
    
    data = []
    for i in range(size):
        # Use Box-Muller transform to approximate normal distribution
        u1 = random.random()
        u2 = random.random()
        
        # Generate standard normal value
        z = math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2)
        
        # Scale to desired mean and standard deviation
        value = mean + (z * std_dev)
        data.append(value)
    
    return data

def calculate_statistics(data):
    """Calculate basic statistics for a dataset."""
    
    n = len(data)
    
    # Mean
    mean = sum(data) / n
    
    # Median
    sorted_data = sorted(data)
    if n % 2 == 0:
        median = (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2
    else:
        median = sorted_data[n//2]
    
    # Standard deviation
    variance = sum((x - mean) ** 2 for x in data) / n
    std_dev = math.sqrt(variance)
    
    # Min and max
    minimum = min(data)
    maximum = max(data)
    
    return {
        "mean": mean,
        "median": median,
        "std_dev": std_dev,
        "min": minimum,
        "max": maximum,
        "count": n
    }

def create_histogram(data, num_bins=10):
    """Create a simple text histogram."""
    
    minimum = min(data)
    maximum = max(data)
    bin_width = (maximum - minimum) / num_bins
    
    # Initialize bins
    bins = [0] * num_bins
    
    # Count data points in each bin
    for value in data:
        bin_index = int((value - minimum) / bin_width)
        if bin_index >= num_bins:  # Handle edge case for maximum value
            bin_index = num_bins - 1
        bins[bin_index] += 1
    
    # Display histogram
    print("Histogram:")
    max_count = max(bins)
    scale_factor = 50 / max_count if max_count > 0 else 1
    
    for i in range(num_bins):
        bin_start = minimum + i * bin_width
        bin_end = bin_start + bin_width
        count = bins[i]
        bar_length = int(count * scale_factor)
        bar = "█" * bar_length
        
        print(f"{bin_start:6.1f}-{bin_end:6.1f}: {count:3d} {bar}")

# Demonstrate statistical analysis
print("=== Statistical Analysis Demo ===")

# Generate sample data (student test scores)
test_scores = generate_sample_data(200, 75, 12)  # Mean=75, StdDev=12

# Calculate and display statistics
stats = calculate_statistics(test_scores)
print("Test Score Statistics:")
print(f"Count: {stats['count']}")
print(f"Mean: {stats['mean']:.2f}")
print(f"Median: {stats['median']:.2f}")
print(f"Standard Deviation: {stats['std_dev']:.2f}")
print(f"Range: {stats['min']:.1f} - {stats['max']:.1f}")

print()

# Create histogram
create_histogram(test_scores, 12)
```

### Game Development Examples

```python
import math
import random

def create_number_guessing_game():
    """Enhanced number guessing game using both modules."""
    
    # Generate random target with weighted probability
    # Favor numbers in the middle range
    if random.random() < 0.6:  # 60% chance for middle range
        target = random.randint(25, 75)
    else:  # 40% chance for edges
        if random.random() < 0.5:
            target = random.randint(1, 24)
        else:
            target = random.randint(76, 100)
    
    print("=== Enhanced Number Guessing Game ===")
    print("I'm thinking of a number between 1 and 100!")
    
    attempts = 0
    max_attempts = int(math.ceil(math.log2(100))) + 2  # Optimal + 2 bonus
    
    while attempts < max_attempts:
        attempts += 1
        
        try:
            guess = int(input(f"Attempt {attempts}/{max_attempts} - Enter your guess: "))
            
            if guess == target:
                score = max_attempts - attempts + 1
                print(f"🎉 Congratulations! You found {target} in {attempts} attempts!")
                print(f"Score: {score}/{max_attempts}")
                break
            
            # Calculate distance and give hints
            distance = abs(guess - target)
            
            if distance <= 3:
                hint = "Very close! 🔥"
            elif distance <= 10:
                hint = "Close! 😊"
            elif distance <= 20:
                hint = "Getting warmer 🙂"
            else:
                hint = "Far away 🥶"
            
            direction = "higher" if guess < target else "lower"
            print(f"Try {direction}! {hint}")
            
        except ValueError:
            print("Please enter a valid number!")
            attempts -= 1  # Don't count invalid input
    
    else:
        print(f"😔 Game over! The number was {target}")

def create_simple_rpg_battle():
    """Simple RPG battle system using random and math."""
    
    print("=== Simple RPG Battle ===")
    
    # Player stats
    player = {
        "name": "Hero",
        "hp": 100,
        "max_hp": 100,
        "attack": 20,
        "defense": 5
    }
    
    # Enemy stats
    enemy = {
        "name": "Goblin",
        "hp": 60,
        "max_hp": 60,
        "attack": 15,
        "defense": 2
    }
    
    turn = 1
    
    while player["hp"] > 0 and enemy["hp"] > 0:
        print(f"\n--- Turn {turn} ---")
        print(f"{player['name']}: {player['hp']}/{player['max_hp']} HP")
        print(f"{enemy['name']}: {enemy['hp']}/{enemy['max_hp']} HP")
        
        # Player attack
        base_damage = player["attack"]
        
        # Critical hit chance (10%)
        if random.random() < 0.1:
            damage = int(base_damage * 2)
            print(f"🔥 Critical hit! {player['name']} attacks for {damage} damage!")
        else:
            # Random damage variation (±20%)
            variation = random.uniform(0.8, 1.2)
            damage = int(base_damage * variation)
            print(f"{player['name']} attacks for {damage} damage!")
        
        # Apply defense
        actual_damage = max(1, damage - enemy["defense"])
        enemy["hp"] = max(0, enemy["hp"] - actual_damage)
        
        if enemy["hp"] == 0:
            print(f"🎉 {enemy['name']} defeated!")
            break
        
        # Enemy attack
        base_damage = enemy["attack"]
        variation = random.uniform(0.8, 1.2)
        damage = int(base_damage * variation)
        actual_damage = max(1, damage - player["defense"])
        player["hp"] = max(0, player["hp"] - actual_damage)
        
        print(f"{enemy['name']} attacks for {actual_damage} damage!")
        
        if player["hp"] == 0:
            print(f"💀 {player['name']} defeated!")
            break
        
        turn += 1
        
        # Add delay for dramatic effect
        input("Press Enter to continue...")
    
    # Calculate experience gained
    if enemy["hp"] == 0:
        base_exp = 50
        bonus_exp = max(0, 100 - (turn * 5))  # Bonus for quick victory
        total_exp = base_exp + bonus_exp
        print(f"Experience gained: {total_exp} XP")

# Run demonstrations
print("Number Guessing Game:")
# create_number_guessing_game()  # Uncomment to play

print("\nRPG Battle Demo:")
# create_simple_rpg_battle()  # Uncomment to play
```

## Pure Functions and Best Practices

### Writing Pure Functions

A **pure function** is one that:

1. Always returns the same output for the same input

2. Has no side effects (doesn't modify global variables or state)

```python
import math
import random

# GOOD: Pure function using math module
def calculate_circle_area(radius):
    """Pure function - same input always gives same output."""
    if radius < 0:
        return 0
    return math.pi * math.pow(radius, 2)

# AVOID: Impure function that uses random internally
def unreliable_calculation(x):
    """Impure function - same input can give different outputs."""
    random_factor = random.random()  # This makes it unpredictable
    return x * random_factor

# BETTER: Pure function that accepts randomness as parameter
def reliable_calculation_with_factor(x, factor):
    """Pure function - randomness comes from outside."""
    return x * factor

# BETTER: Separate random generation from calculation
def generate_random_factor():
    """Separate function for random generation."""
    return random.random()

def demonstrate_pure_functions():
    """Demonstrate pure vs impure functions."""
    
    print("=== Pure vs Impure Functions ===")
    
    # Pure function - consistent results
    radius = 5
    area1 = calculate_circle_area(radius)
    area2 = calculate_circle_area(radius)
    print(f"Pure function - Area of circle (r={radius}): {area1:.2f}")
    print(f"Pure function - Area of circle (r={radius}): {area2:.2f}")
    print(f"Results are identical: {area1 == area2}")
    
    # Impure function - inconsistent results
    value = 10
    result1 = unreliable_calculation(value)
    result2 = unreliable_calculation(value)
    print(f"\nImpure function - Result 1: {result1:.4f}")
    print(f"Impure function - Result 2: {result2:.4f}")
    print(f"Results are identical: {result1 == result2}")
    
    # Better approach - pure function with external randomness
    factor = generate_random_factor()
    result3 = reliable_calculation_with_factor(value, factor)
    result4 = reliable_calculation_with_factor(value, factor)
    print(f"\nPure function with factor {factor:.4f}:")
    print(f"Result 1: {result3:.4f}")
    print(f"Result 2: {result4:.4f}")
    print(f"Results are identical: {result3 == result4}")

demonstrate_pure_functions()
```

### Module Import Best Practices

```python
# GOOD: Import entire modules
import math
import random

# GOOD: Import specific functions when you only need a few
from math import sqrt, pi, sin, cos
from random import randint, choice

# AVOID: Import everything with *
# from math import *  # Don't do this - pollutes namespace

def demonstrate_import_styles():
    """Demonstrate different import styles and their trade-offs."""
    
    print("=== Import Styles ===")
    
    # Using full module names (clearest)
    angle = 45
    angle_rad = math.radians(angle)
    sine_value = math.sin(angle_rad)
    print(f"Using math.sin(): sin({angle}°) = {sine_value:.4f}")
    
    # Using imported functions (more concise)
    sine_value2 = sin(angle_rad)
    print(f"Using imported sin(): sin({angle}°) = {sine_value2:.4f}")
    
    # Random examples
    dice1 = random.randint(1, 6)  # Full module name
    dice2 = randint(1, 6)         # Imported function
    
    colors = ["red", "blue", "green"]
    color1 = random.choice(colors)  # Full module name
    color2 = choice(colors)         # Imported function
    
    print(f"Dice rolls: {dice1}, {dice2}")
    print(f"Colors chosen: {color1}, {color2}")

demonstrate_import_styles()
```

## Common Patterns and Applications

### Scientific Computing Patterns

```python
import math
import random

def create_data_analysis_toolkit():
    """Common patterns for data analysis using math and random."""
    
    def normalize_data(data, target_min=0, target_max=1):
        """Normalize data to a specific range."""
        
        if not data:
            return []
        
        data_min = min(data)
        data_max = max(data)
        
        if data_max == data_min:
            return [target_min] * len(data)
        
        normalized = []
        for value in data:
            # Scale to [0, 1] first
            scaled = (value - data_min) / (data_max - data_min)
            # Then scale to target range
            final_value = target_min + scaled * (target_max - target_min)
            normalized.append(final_value)
        
        return normalized
    
    def calculate_correlation(x_data, y_data):
        """Calculate correlation coefficient between two datasets."""
        
        if len(x_data) != len(y_data) or len(x_data) < 2:
            return None
        
        n = len(x_data)
        
        # Calculate means
        x_mean = sum(x_data) / n
        y_mean = sum(y_data) / n
        
        # Calculate correlation coefficient
        numerator = sum((x_data[i] - x_mean) * (y_data[i] - y_mean) for i in range(n))
        
        x_variance = sum((x - x_mean) ** 2 for x in x_data)
        y_variance = sum((y - y_mean) ** 2 for y in y_data)
        
        denominator = math.sqrt(x_variance * y_variance)
        
        if denominator == 0:
            return None
        
        return numerator / denominator
    
    def bootstrap_sampling(data, num_samples=1000, sample_size=None):
        """Perform bootstrap sampling for statistical analysis."""
        
        if sample_size is None:
            sample_size = len(data)
        
        bootstrap_means = []
        
        for i in range(num_samples):
            # Sample with replacement
            sample = random.choices(data, k=sample_size)
            sample_mean = sum(sample) / len(sample)
            bootstrap_means.append(sample_mean)
        
        # Calculate confidence interval (approximation)
        bootstrap_means.sort()
        lower_index = int(0.025 * num_samples)  # 2.5th percentile
        upper_index = int(0.975 * num_samples)  # 97.5th percentile
        
        confidence_interval = (bootstrap_means[lower_index], bootstrap_means[upper_index])
        
        return bootstrap_means, confidence_interval
    
    # Demonstrate the toolkit
    print("=== Data Analysis Toolkit Demo ===")
    
    # Generate sample data
    original_data = [random.uniform(10, 100) for _ in range(50)]
    
    # Normalize data
    normalized = normalize_data(original_data, 0, 10)
    print(f"Original range: {min(original_data):.2f} to {max(original_data):.2f}")
    print(f"Normalized range: {min(normalized):.2f} to {max(normalized):.2f}")
    
    # Create correlated data for correlation test
    x_values = list(range(20))
    y_values = [x * 2 + random.uniform(-5, 5) for x in x_values]  # Linear with noise
    
    correlation = calculate_correlation(x_values, y_values)
    print(f"Correlation coefficient: {correlation:.4f}")
    
    # Bootstrap sampling
    sample_data = [random.uniform(45, 55) for _ in range(30)]
    bootstrap_means, ci = bootstrap_sampling(sample_data, 1000)
    
    actual_mean = sum(sample_data) / len(sample_data)
    bootstrap_estimate = sum(bootstrap_means) / len(bootstrap_means)
    
    print(f"Actual mean: {actual_mean:.4f}")
    print(f"Bootstrap estimate: {bootstrap_estimate:.4f}")
    print(f"95% Confidence Interval: ({ci[0]:.4f}, {ci[1]:.4f})")

create_data_analysis_toolkit()
```

## Summary

Standard modules extend Python's capabilities without requiring external libraries:

### Math Module Key Functions

- **Power/Root**: `pow()`, `sqrt()`

- **Rounding**: `floor()`, `ceil()`, `trunc()`

- **Trigonometry**: `sin()`, `cos()`, `tan()`, `radians()`, `degrees()`

- **Logarithms**: `log()`, `log10()`, `log2()`

- **Constants**: `pi`, `e`, `tau`

### Random Module Key Functions

- **Basic Random**: `random()`, `randint()`, `uniform()`

- **Choices**: `choice()`, `choices()`, `sample()`

- **Manipulation**: `shuffle()`

- **Control**: `seed()`

### Best Practices

1. **Import appropriately**: Use full module names for clarity

2. **Prefer pure functions**: Keep randomness separate from calculations

3. **Combine modules**: Use both math and random for complex applications

4. **Document dependencies**: Make module usage clear in your code

These modules provide the foundation for scientific computing, game development, simulations, and data analysis in Python.

---

**Cross-reference**: This section builds on the subprogram concepts from [Chapter 2 Section 5](../../Chapter-02-Designing-Algorithms/Section-05-Subprograms-Procedures-and-Functions/index.md) and uses control structures from [Section 4.1](../Section-01-Control-Structures-in-Python/index.md). Next, we'll learn debugging techniques in [Section 4.5](../Section-05-Debugging-Tools-and-Techniques/index.md).
