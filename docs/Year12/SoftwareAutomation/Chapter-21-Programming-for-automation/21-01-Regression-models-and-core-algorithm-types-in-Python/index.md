# 21.1 Regression models and core algorithm types in Python

## Why it matters

Understanding core machine learning algorithms is essential for building automation systems that can learn from data and make intelligent decisions. These fundamental algorithms form the backbone of many AI applications, from predicting sales trends to classifying emails as spam.

By implementing these algorithms from scratch in Python, you'll gain deep insight into how machine learning actually works, rather than just calling library functions. This knowledge helps you choose the right algorithm for specific problems and debug issues when they arise.

## Concepts

### Linear regression

Linear regression finds the best straight line through data points to predict continuous values. It's the simplest form of supervised learning and often the starting point for understanding more complex algorithms.

The goal is to find a line `y = mx + b` that minimises the difference between predicted and actual values. In machine learning terms, we're finding parameters (weights) that minimise the cost function.

```python
# Simple linear regression from scratch
import random
import math

def linear_regression(x_data, y_data, learning_rate=0.01, epochs=1000):
    """
    Implement linear regression using gradient descent.
    Returns slope (m) and intercept (b) for y = mx + b
    """
    # Initialize parameters randomly
    m = random.uniform(-1, 1)
    b = random.uniform(-1, 1)
    n = len(x_data)
    
    for epoch in range(epochs):
        # Calculate predictions
        predictions = [m * x + b for x in x_data]
        
        # Calculate gradients
        dm = sum(2 * (pred - actual) * x for pred, actual, x in 
                zip(predictions, y_data, x_data)) / n
        db = sum(2 * (pred - actual) for pred, actual in 
                zip(predictions, y_data)) / n
        
        # Update parameters
        m -= learning_rate * dm
        b -= learning_rate * db
        
        # Print progress every 100 epochs
        if epoch % 100 == 0:
            mse = sum((pred - actual) ** 2 for pred, actual in 
                     zip(predictions, y_data)) / n
            print(f"Epoch {epoch}: MSE = {mse:.4f}")
    
    return m, b

# Example usage: predicting house prices based on size
house_sizes = [50, 75, 100, 125, 150, 175, 200]  # square meters
house_prices = [150, 200, 250, 300, 350, 400, 450]  # thousands

slope, intercept = linear_regression(house_sizes, house_prices)
print(f"\nFinal model: price = {slope:.2f} * size + {intercept:.2f}")

# Make a prediction
new_size = 130
predicted_price = slope * new_size + intercept
print(f"Predicted price for {new_size}m²: ${predicted_price:.0f}k")

```

### Logistic regression

Logistic regression is used for classification problems where you need to predict categories rather than continuous values. Despite its name, it's a classification algorithm that uses the sigmoid function to map any real number to a value between 0 and 1.

```python
def sigmoid(z):
    """Sigmoid activation function"""
    # Clip z to prevent overflow
    z = max(-500, min(500, z))
    return 1 / (1 + math.exp(-z))

def logistic_regression(x_data, y_data, learning_rate=0.1, epochs=1000):
    """
    Implement logistic regression for binary classification.
    y_data should contain 0s and 1s.
    """
    # Initialize parameters
    w = random.uniform(-1, 1)
    b = random.uniform(-1, 1)
    n = len(x_data)
    
    for epoch in range(epochs):
        # Forward pass: calculate predictions
        predictions = [sigmoid(w * x + b) for x in x_data]
        
        # Calculate gradients using cross-entropy loss
        dw = sum((pred - actual) * x for pred, actual, x in 
                zip(predictions, y_data, x_data)) / n
        db = sum(pred - actual for pred, actual in 
                zip(predictions, y_data)) / n
        
        # Update parameters
        w -= learning_rate * dw
        b -= learning_rate * db
        
        # Print progress
        if epoch % 200 == 0:
            # Calculate accuracy
            correct = sum(1 for pred, actual in zip(predictions, y_data)
                         if (pred > 0.5) == (actual == 1))
            accuracy = correct / n
            print(f"Epoch {epoch}: Accuracy = {accuracy:.3f}")
    
    return w, b

# Example: predicting email spam based on word count
word_counts = [1, 3, 5, 8, 12, 15, 20, 25]  # suspicious words
is_spam = [0, 0, 0, 1, 1, 1, 1, 1]  # 0 = not spam, 1 = spam

weight, bias = logistic_regression(word_counts, is_spam)
print(f"\nModel: probability = sigmoid({weight:.2f} * word_count + {bias:.2f})")

# Test prediction
test_count = 10
probability = sigmoid(weight * test_count + bias)
print(f"Email with {test_count} suspicious words: {probability:.1%} spam probability")

```

### K-nearest neighbour

K-nearest neighbour (KNN) is an instance-based learning algorithm that makes predictions by finding the K closest examples in the training data. It's simple but powerful, working for both classification and regression.

```python
def euclidean_distance(point1, point2):
    """Calculate distance between two points"""
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(point1, point2)))

def knn_classify(train_features, train_labels, test_point, k=3):
    """
    Classify a test point using K-nearest neighbours.
    Features can be multi-dimensional.
    """
    # Calculate distances to all training points
    distances = []
    for i, train_point in enumerate(train_features):
        dist = euclidean_distance(train_point, test_point)
        distances.append((dist, train_labels[i]))
    
    # Sort by distance and get k nearest
    distances.sort()
    nearest_k = distances[:k]
    
    # For classification: majority vote
    labels = [label for _, label in nearest_k]
    return max(set(labels), key=labels.count)

def knn_regress(train_features, train_values, test_point, k=3):
    """
    Predict a continuous value using K-nearest neighbours.
    """
    # Calculate distances
    distances = []
    for i, train_point in enumerate(train_features):
        dist = euclidean_distance(train_point, test_point)
        distances.append((dist, train_values[i]))
    
    # Sort by distance and get k nearest
    distances.sort()
    nearest_k = distances[:k]
    
    # For regression: average of nearest values
    values = [value for _, value in nearest_k]
    return sum(values) / len(values)

# Example: classifying flowers based on petal measurements
# Features: [petal_length, petal_width]
flower_features = [
    [1.4, 0.2], [1.3, 0.2], [1.5, 0.3],  # setosa
    [4.2, 1.3], [4.0, 1.2], [4.1, 1.4],  # versicolor
    [5.8, 2.1], [6.0, 2.0], [5.9, 2.2]   # virginica
]
flower_types = ['setosa', 'setosa', 'setosa', 
                'versicolor', 'versicolor', 'versicolor',
                'virginica', 'virginica', 'virginica']

# Classify new flower
new_flower = [4.5, 1.5]
predicted_type = knn_classify(flower_features, flower_types, new_flower, k=3)
print(f"Flower with petals {new_flower} is predicted to be: {predicted_type}")

```

### Polynomial regression

Polynomial regression extends linear regression to capture curved relationships by using polynomial features. It's useful when linear relationships are too simple to capture the pattern in your data.

```python
def create_polynomial_features(x_data, degree):
    """Create polynomial features up to specified degree"""
    features = []
    for x in x_data:
        row = [x ** i for i in range(degree + 1)]  # 1, x, x^2, x^3, ...
        features.append(row)
    return features

def polynomial_regression(x_data, y_data, degree=2, learning_rate=0.001, epochs=2000):
    """
    Implement polynomial regression using gradient descent.
    """
    # Create polynomial features
    features = create_polynomial_features(x_data, degree)
    n_features = degree + 1
    n_samples = len(x_data)
    
    # Initialize weights randomly
    weights = [random.uniform(-0.1, 0.1) for _ in range(n_features)]
    
    for epoch in range(epochs):
        # Calculate predictions
        predictions = []
        for feature_row in features:
            pred = sum(w * f for w, f in zip(weights, feature_row))
            predictions.append(pred)
        
        # Calculate gradients
        gradients = [0] * n_features
        for i in range(n_features):
            gradient = sum(2 * (pred - actual) * features[j][i] 
                          for j, (pred, actual) in enumerate(zip(predictions, y_data)))
            gradients[i] = gradient / n_samples
        
        # Update weights
        weights = [w - learning_rate * g for w, g in zip(weights, gradients)]
        
        # Print progress
        if epoch % 400 == 0:
            mse = sum((pred - actual) ** 2 for pred, actual in 
                     zip(predictions, y_data)) / n_samples
            print(f"Epoch {epoch}: MSE = {mse:.4f}")
    
    return weights

# Example: fitting a curved relationship
x_vals = [1, 2, 3, 4, 5, 6, 7, 8]
y_vals = [2, 3, 7, 12, 20, 31, 45, 62]  # Roughly quadratic

# Fit polynomial of degree 2
poly_weights = polynomial_regression(x_vals, y_vals, degree=2)
print(f"\nPolynomial model coefficients: {[f'{w:.2f}' for w in poly_weights]}")

# Make prediction
def predict_polynomial(x, weights):
    return sum(w * (x ** i) for i, w in enumerate(weights))

test_x = 9
prediction = predict_polynomial(test_x, poly_weights)
print(f"Prediction for x={test_x}: {prediction:.1f}")

```

### Guided example

Let's build a complete system that compares all four algorithms on the same dataset to understand their strengths and weaknesses.

```kroki-plantuml
@startuml
skinparam monochrome true
skinparam shadowing false

start
:Load and prepare data;
:Split into training/test sets;

fork
  :Train Linear Regression;
  :Evaluate on test set;
  :Record MSE and R²;
fork again
  :Train Logistic Regression;
  :Evaluate on test set;
  :Record accuracy;
fork again
  :Train KNN (k=3,5,7);
  :Evaluate on test set;
  :Record best k and accuracy;
fork again
  :Train Polynomial Regression;
  :Try degrees 2,3,4;
  :Evaluate and check overfitting;
end fork

:Compare all models;
:Select best performer;
:Analyze why it performed best;

stop
@enduml

```

```python
def evaluate_model_performance():
    """
    Compare all four algorithms on a synthetic dataset
    """
    import random
    
    # Generate synthetic data with some noise
    random.seed(42)
    
    # Create data with a slight curve
    x_train = [i for i in range(1, 21)]
    y_train = [2 * x + 0.5 * x * x + random.uniform(-5, 5) for x in x_train]
    
    x_test = [i + 0.5 for i in range(21, 26)]
    y_test = [2 * x + 0.5 * x * x + random.uniform(-3, 3) for x in x_test]
    
    print("Comparing ML algorithms on curved data with noise:")
    print("-" * 50)
    
    # 1. Linear regression
    print("1. Linear Regression:")
    m, b = linear_regression(x_train, y_train, epochs=500)
    linear_predictions = [m * x + b for x in x_test]
    linear_mse = sum((pred - actual) ** 2 for pred, actual in 
                    zip(linear_predictions, y_test)) / len(y_test)
    print(f"   Test MSE: {linear_mse:.2f}")
    
    # 2. Polynomial regression (degree 2)
    print("\n2. Polynomial Regression (degree 2):")
    poly_weights = polynomial_regression(x_train, y_train, degree=2, epochs=1000)
    poly_predictions = [predict_polynomial(x, poly_weights) for x in x_test]
    poly_mse = sum((pred - actual) ** 2 for pred, actual in 
                  zip(poly_predictions, y_test)) / len(y_test)
    print(f"   Test MSE: {poly_mse:.2f}")
    
    # 3. KNN regression
    print("\n3. K-Nearest Neighbours (k=3):")
    train_features = [[x] for x in x_train]  # Convert to feature format
    knn_predictions = [knn_regress(train_features, y_train, [x], k=3) for x in x_test]
    knn_mse = sum((pred - actual) ** 2 for pred, actual in 
                 zip(knn_predictions, y_test)) / len(y_test)
    print(f"   Test MSE: {knn_mse:.2f}")
    
    # Summary
    print(f"\nBest performing algorithm:")
    results = [("Linear", linear_mse), ("Polynomial", poly_mse), ("KNN", knn_mse)]
    best = min(results, key=lambda x: x[1])
    print(f"   {best[0]} regression with MSE = {best[1]:.2f}")
    
    return results

# Run the comparison
performance_results = evaluate_model_performance()

```

### Avoiding overfitting

Overfitting occurs when a model learns the training data too well, including noise, making it perform poorly on new data. Here's how to detect and prevent it:

```python
def check_overfitting(x_data, y_data, max_degree=6):
    """
    Demonstrate overfitting with polynomial regression
    """
    n = len(x_data)
    split_point = int(0.7 * n)  # 70% train, 30% validation
    
    x_train = x_data[:split_point]
    y_train = y_data[:split_point]
    x_val = x_data[split_point:]
    y_val = y_data[split_point:]
    
    print("Degree | Train MSE | Validation MSE | Overfitting?")
    print("-" * 50)
    
    for degree in range(1, max_degree + 1):
        # Train model
        weights = polynomial_regression(x_train, y_train, degree=degree, 
                                      learning_rate=0.001, epochs=1000)
        
        # Evaluate on training set
        train_pred = [predict_polynomial(x, weights) for x in x_train]
        train_mse = sum((p - a) ** 2 for p, a in zip(train_pred, y_train)) / len(y_train)
        
        # Evaluate on validation set
        val_pred = [predict_polynomial(x, weights) for x in x_val]
        val_mse = sum((p - a) ** 2 for p, a in zip(val_pred, y_val)) / len(y_val)
        
        # Check for overfitting
        overfitting = "Yes" if val_mse > train_mse * 1.5 else "No"
        
        print(f"   {degree}   |   {train_mse:.3f}   |      {val_mse:.3f}      |     {overfitting}")

# Example usage with noisy quadratic data
x_sample = list(range(1, 21))
y_sample = [x*x + random.uniform(-10, 10) for x in x_sample]
check_overfitting(x_sample, y_sample)

```

## Try it

### Exercise 1: House price prediction

Build and compare different regression models to predict house prices:

/// details | Exercise 1: Problem setup
    type: question
    open: false

**Dataset**: Create a dataset with house features (size, age, bedrooms) and prices.

**Task**: Implement linear regression, polynomial regression, and KNN regression. Compare their performance and explain which works best and why.

**Bonus**: Add a feature that causes overfitting and demonstrate how to detect it.

/// details | Sample solution approach
    type: success
    open: false

```python-exec
# Create synthetic house data
houses = [
    [120, 5, 3, 280],   # [size, age, bedrooms, price_k]
    [85, 12, 2, 195],
    [160, 2, 4, 350],
    # ... add more data
]

# Separate features and targets
features = [house[:3] for house in houses]
prices = [house[3] for house in houses]

# Implement and compare models
# Consider normalizing features for better performance

```

///
///

### Exercise 2: Classification challenge

Create a spam email classifier using different algorithms:

/// details | Exercise 2: Email classification
    type: question
    open: false

**Features**: Word count, capital letters ratio, exclamation marks, link count

**Task**: Implement logistic regression and KNN classification. Create test data and measure accuracy.

**Extension**: Try different k values for KNN and see how it affects performance.

/// details | Implementation hints
    type: success
    open: false

Start with simple features:

- Count of suspicious words ("free", "urgent", "limited")

- Ratio of capital letters to total letters

- Number of exclamation marks

- Binary feature: contains links (0/1)

Create balanced training data with equal spam/not spam examples.
///
///

### Exercise 3: Algorithm selection

Given these scenarios, choose the most appropriate algorithm and justify your choice:

/// details | Exercise 3: Scenario analysis
    type: question
    open: false

**Scenario A**: Predicting student test scores based on study hours (linear relationship expected)

**Scenario B**: Classifying images as "cat" or "dog" with pixel-based features

**Scenario C**: Predicting house prices with complex interactions between location, size, and amenities

**Scenario D**: Recommending products based on past purchase history

For each scenario, consider:

- Type of problem (regression/classification)

- Complexity of relationships

- Amount of training data available

- Need for explainability

/// details | Selection guidelines
    type: success
    open: false

**Linear Regression**: Use when you expect linear relationships and need interpretability.

**Logistic Regression**: Good for binary classification with interpretable features.

**KNN**: Works well when similar inputs should have similar outputs; no training required.

**Polynomial Regression**: Use when you suspect curved relationships but want to keep some interpretability.
///
///

## Recap

This section introduced four fundamental machine learning algorithms that form the foundation of many automation systems:

**Linear regression** finds straight-line relationships in data, perfect for simple predictions like sales forecasting or basic trend analysis.

**Logistic regression** handles yes/no classification problems using the sigmoid function, making it ideal for spam detection or approval systems.

**K-nearest neighbour** makes predictions by finding similar examples, working well when you have good training data and the relationship between features and outcomes is complex.

**Polynomial regression** captures curved relationships while maintaining interpretability, useful when linear models are too simple but you still need to understand how the model works.

Key principles for choosing algorithms:

- Start simple (linear) and add complexity only when needed

- Always split data into training and validation sets

- Watch for overfitting by comparing training and validation performance

- Consider explainability requirements when selecting algorithms

These algorithms prepare you for implementing automation systems that can learn from data and make intelligent decisions in business processes.

See also [20.4 Design models: decision trees and neural networks](../../Chapter-20-ML-and-automation-basics/20-04-Design-models-decision-trees-and-neural-networks/index.md) for conceptual foundations and [21.2 Neural networks: concepts and implementation](../21-02-Neural-networks-concepts-and-implementation/index.md) for more advanced learning algorithms.
