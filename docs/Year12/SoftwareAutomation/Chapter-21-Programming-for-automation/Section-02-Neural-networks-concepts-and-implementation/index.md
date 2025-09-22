# 21.2 Neural Networks: Concepts and Implementation

- Outcomes: SE-12-02

## Introduction

!!! builds-on "Builds on"
    This section builds on [21.1 Regression models and core algorithm types in Python](../Section-01-Regression-models-and-core-algorithm-types-in-Python/index.md).


Neural networks form the foundation of modern AI systems by mimicking how biological neurons process information. This section implements neural networks from scratch, starting with the simple perceptron and progressing to multi-layer perceptrons (MLPs) with backpropagation training.

**Key Learning Goals:**

- **Understand** perceptron architecture and learning algorithm

- **Implement** tiny MLP with backpropagation from mathematical principles

- **Develop** training loop intuition through hands-on coding

- **Reason** about neural network behavior and decision-making

```kroki-plantuml
@startuml
!theme plain

package "Neural Network Architecture" {
    
    component [Input Layer]
    component [Hidden Layer 1]
    component [Hidden Layer 2]
    component [Output Layer]
    
    [Input Layer] --> [Hidden Layer 1]
    [Hidden Layer 1] --> [Hidden Layer 2]
    [Hidden Layer 2] --> [Output Layer]
    
    note right of [Input Layer] : Features/Data
    note right of [Hidden Layer 1] : Pattern Detection
    note right of [Hidden Layer 2] : Complex Patterns
    note right of [Output Layer] : Predictions
    
    component [Perceptron]
    component [Binary Classification]
    [Perceptron] --> [Binary Classification]
    note right of [Perceptron]
        Single layer
        Linear decision boundary
        Simple learning rule
    end note
    
    component [Multi-Layer Perceptron]
    component [Non-linear Problems]
    [Multi-Layer Perceptron] --> [Non-linear Problems]
    note right of [Multi-Layer Perceptron]
        Multiple hidden layers
        Backpropagation training
        Universal approximator
    end note
    
    component [Activation Functions]
    component [Non-linearity]
    [Activation Functions] --> [Non-linearity]
    note right of [Activation Functions]
        Sigmoid: σ(x) = 1/(1+e^-x)
        ReLU: max(0, x)
        Tanh: (e^x - e^-x)/(e^x + e^-x)
    end note
    
    component [Training Process]
    component [Weight Updates]
    [Training Process] --> [Weight Updates]
    note right of [Training Process]
        Forward pass
        Loss calculation
        Backward pass
        Gradient descent
    end note
}

package "Training Loop Components" {
    component [Data Batch]
    component [Forward Pass]
    component [Loss Calculation]
    component [Backward Pass]
    component [Weight Update]
    
    [Data Batch] --> [Forward Pass]
    [Forward Pass] --> [Loss Calculation]
    [Loss Calculation] --> [Backward Pass]
    [Backward Pass] --> [Weight Update]
    [Weight Update] --> [Data Batch]
    
    note bottom of [Training Loop Components] : Iterative optimization process
}

@enduml
```

---

## Part 1: Perceptron Implementation

### Mathematical Foundation

The perceptron is the simplest neural network, consisting of a single neuron that learns to classify linearly separable data. It demonstrates the fundamental concepts of neural learning without the complexity of multiple layers.

**Perceptron Architecture:**

- **Inputs**: `x₁, x₂, ..., xₙ` (features)

- **Weights**: `w₁, w₂, ..., wₙ` (learned parameters)

- **Bias**: `b` (threshold adjustment)

- **Output**: `y = f(Σwᵢxᵢ + b)` where `f` is activation function

**Activation Functions:**

- **Step Function**: `f(z) = 1 if z ≥ 0, else 0`

- **Sigmoid**: `f(z) = 1/(1 + e^(-z))` (smooth, differentiable)

**Learning Rule (Perceptron Algorithm):**

- For each training example: `wᵢ = wᵢ + α(target - prediction) * xᵢ`

- Where `α` is the learning rate

### From-Scratch Implementation

```python
import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, List, Dict, Any
import random

class Perceptron:
    """
    Single-layer perceptron implementation from scratch.
    Demonstrates basic neural network concepts and learning.
    """
    
    def __init__(self, learning_rate: float = 0.1, max_epochs: int = 100, activation: str = 'step'):
        """
        Initialize perceptron.
        
        Args:
            learning_rate: Step size for weight updates
            max_epochs: Maximum training iterations
            activation: Activation function ('step' or 'sigmoid')
        """
        self.learning_rate = learning_rate
        self.max_epochs = max_epochs
        self.activation = activation
        self.weights = None
        self.bias = None
        self.training_history = []
        self.trained = False
    
    def _activation_function(self, z: np.ndarray) -> np.ndarray:
        """Apply activation function to input."""
        if self.activation == 'step':
            return np.where(z >= 0, 1, 0)
        elif self.activation == 'sigmoid':

            ## Clip to prevent overflow

            z = np.clip(z, -500, 500)
            return 1 / (1 + np.exp(-z))
        else:
            raise ValueError(f"Unknown activation function: {self.activation}")
    
    def _activation_derivative(self, z: np.ndarray) -> np.ndarray:
        """Compute derivative of activation function."""
        if self.activation == 'step':

            ## Step function derivative is 0 everywhere (except at 0, undefined)

            return np.ones_like(z)  # Use 1 as approximation for learning
        elif self.activation == 'sigmoid':
            sigmoid_output = self._activation_function(z)
            return sigmoid_output * (1 - sigmoid_output)
        else:
            raise ValueError(f"Unknown activation function: {self.activation}")
    
    def _forward_pass(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Perform forward pass through perceptron.
        
        Args:
            X: Input features
            
        Returns:
            Tuple of (linear_output, activated_output)
        """

        ## Linear combination: z = X * w + b

        z = np.dot(X, self.weights) + self.bias
        
        ## Apply activation function

        a = self._activation_function(z)
        
        return z, a
    
    def fit(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """
        Train the perceptron using the perceptron learning algorithm.
        
        Args:
            X: Training features (n_samples, n_features)
            y: Training targets (n_samples,)
            
        Returns:
            Training statistics
        """

        ## Ensure proper shapes

        if X.ndim == 1:
            X = X.reshape(-1, 1)
        
        n_samples, n_features = X.shape
        
        ## Initialize weights and bias randomly

        self.weights = np.random.normal(0, 0.1, n_features)
        self.bias = np.random.normal(0, 0.1)
        
        ## Track training progress

        self.training_history = []
        converged = False
        
        for epoch in range(self.max_epochs):
            total_error = 0
            correct_predictions = 0
            
            ## Process each training example

            for i in range(n_samples):

                ## Forward pass for single example

                x_i = X[i]
                target = y[i]
                
                ## Compute prediction

                z, prediction = self._forward_pass(x_i.reshape(1, -1))
                prediction = prediction[0]  # Extract scalar
                
                ## Compute error

                error = target - prediction
                total_error += abs(error)
                
                if abs(error) < 1e-6:  # Consider very small errors as correct
                    correct_predictions += 1
                
                ## Update weights and bias using perceptron learning rule

                if self.activation == 'step':

                    ## Classic perceptron rule

                    self.weights += self.learning_rate * error * x_i
                    self.bias += self.learning_rate * error
                else:

                    ## Gradient descent for sigmoid

                    derivative = self._activation_derivative(z)[0]
                    self.weights += self.learning_rate * error * derivative * x_i
                    self.bias += self.learning_rate * error * derivative
            
            ## Calculate accuracy

            accuracy = correct_predictions / n_samples
            
            ## Record epoch statistics

            epoch_stats = {
                'epoch': epoch + 1,
                'total_error': total_error,
                'accuracy': accuracy,
                'weights': self.weights.copy(),
                'bias': self.bias
            }
            self.training_history.append(epoch_stats)
            
            ## Check for convergence

            if total_error == 0:
                converged = True
                print(f"Converged after {epoch + 1} epochs")
                break
        
        self.trained = True
        
        return {
            'converged': converged,
            'final_epoch': len(self.training_history),
            'final_accuracy': self.training_history[-1]['accuracy'],
            'final_error': self.training_history[-1]['total_error']
        }
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions on new data."""
        if not self.trained:
            raise ValueError("Perceptron must be trained before making predictions")
        
        if X.ndim == 1:
            X = X.reshape(-1, 1)
        
        _, predictions = self._forward_pass(X)
        return predictions
    
    def decision_boundary_equation(self) -> str:
        """Get human-readable decision boundary equation."""
        if not self.trained or len(self.weights) != 2:
            return "Decision boundary not available"
        
        w1, w2 = self.weights
        b = self.bias
        
        ## Decision boundary: w1*x1 + w2*x2 + b = 0

        ## Solving for x2: x2 = (-w1*x1 - b) / w2
        
        return f"x2 = {-w1/w2:.3f} * x1 + {-b/w2:.3f}"
    
    def get_training_statistics(self) -> Dict[str, List]:
        """Get detailed training statistics."""
        return {
            'epochs': [stats['epoch'] for stats in self.training_history],
            'errors': [stats['total_error'] for stats in self.training_history],
            'accuracies': [stats['accuracy'] for stats in self.training_history]
        }

def demonstrate_perceptron():
    """Demonstrate perceptron with classic examples."""
    print("Perceptron Demonstration")
    print("=" * 25)
    
    ## Example 1: AND Gate

    print("\n1. AND Gate Learning")
    print("-" * 20)
    
    ## AND gate truth table

    X_and = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y_and = np.array([0, 0, 0, 1])
    
    ## Train perceptron

    perceptron_and = Perceptron(learning_rate=0.1, max_epochs=50, activation='step')
    and_stats = perceptron_and.fit(X_and, y_and)
    
    print(f"AND Gate Training:")
    print(f"  Converged: {and_stats['converged']}")
    print(f"  Final accuracy: {and_stats['final_accuracy']:.3f}")
    print(f"  Epochs required: {and_stats['final_epoch']}")
    print(f"  Decision boundary: {perceptron_and.decision_boundary_equation()}")
    
    ## Test predictions

    predictions_and = perceptron_and.predict(X_and)
    print(f"\nAND Gate Results:")
    for i, (inputs, target, pred) in enumerate(zip(X_and, y_and, predictions_and)):
        print(f"  {inputs[0]} AND {inputs[1]} = {target} (predicted: {pred:.0f})")
    
    ## Example 2: OR Gate

    print(f"\n2. OR Gate Learning")
    print("-" * 19)
    
    ## OR gate truth table

    X_or = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y_or = np.array([0, 1, 1, 1])
    
    ## Train perceptron

    perceptron_or = Perceptron(learning_rate=0.1, max_epochs=50, activation='step')
    or_stats = perceptron_or.fit(X_or, y_or)
    
    print(f"OR Gate Training:")
    print(f"  Converged: {or_stats['converged']}")
    print(f"  Final accuracy: {or_stats['final_accuracy']:.3f}")
    print(f"  Epochs required: {or_stats['final_epoch']}")
    print(f"  Decision boundary: {perceptron_or.decision_boundary_equation()}")
    
    ## Example 3: XOR Gate (should fail - not linearly separable)

    print(f"\n3. XOR Gate Learning (Expected to Fail)")
    print("-" * 40)
    
    ## XOR gate truth table

    X_xor = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y_xor = np.array([0, 1, 1, 0])
    
    ## Train perceptron

    perceptron_xor = Perceptron(learning_rate=0.1, max_epochs=100, activation='step')
    xor_stats = perceptron_xor.fit(X_xor, y_xor)
    
    print(f"XOR Gate Training:")
    print(f"  Converged: {xor_stats['converged']}")
    print(f"  Final accuracy: {xor_stats['final_accuracy']:.3f}")
    print(f"  Epochs completed: {xor_stats['final_epoch']}")
    print(f"  Final error: {xor_stats['final_error']}")
    
    predictions_xor = perceptron_xor.predict(X_xor)
    print(f"\nXOR Gate Results (showing limitation):")
    for i, (inputs, target, pred) in enumerate(zip(X_xor, y_xor, predictions_xor)):
        correct = "✓" if abs(target - pred) < 0.5 else "✗"
        print(f"  {inputs[0]} XOR {inputs[1]} = {target} (predicted: {pred:.0f}) {correct}")
    
    print(f"\nPerceptron Limitation: Cannot learn XOR (not linearly separable)")
    print(f"This motivates the need for multi-layer networks!")
    
    ## Example 4: Linearly Separable 2D Data

    print(f"\n4. 2D Classification Problem")
    print("-" * 30)
    
    ## Generate linearly separable 2D data

    np.random.seed(42)
    
    ## Class 0: points around (2, 2)

    class0_x = np.random.normal(2, 0.8, 25)
    class0_y = np.random.normal(2, 0.8, 25)
    
    ## Class 1: points around (5, 5)

    class1_x = np.random.normal(5, 0.8, 25)
    class1_y = np.random.normal(5, 0.8, 25)
    
    ## Combine data

    X_2d = np.column_stack([
        np.concatenate([class0_x, class1_x]),
        np.concatenate([class0_y, class1_y])
    ])
    y_2d = np.concatenate([np.zeros(25), np.ones(25)])
    
    ## Shuffle data

    indices = np.random.permutation(len(y_2d))
    X_2d = X_2d[indices]
    y_2d = y_2d[indices]
    
    ## Train perceptron with sigmoid activation

    perceptron_2d = Perceptron(learning_rate=0.01, max_epochs=200, activation='sigmoid')
    stats_2d = perceptron_2d.fit(X_2d, y_2d)
    
    print(f"2D Classification Training:")
    print(f"  Converged: {stats_2d['converged']}")
    print(f"  Final accuracy: {stats_2d['final_accuracy']:.3f}")
    print(f"  Epochs required: {stats_2d['final_epoch']}")
    
    ## Test on new points

    test_points = np.array([[1, 1], [3, 3], [6, 6], [4, 4]])
    test_predictions = perceptron_2d.predict(test_points)
    
    print(f"\nTest Predictions:")
    for point, pred in zip(test_points, test_predictions):
        class_pred = "Class 1" if pred > 0.5 else "Class 0"
        print(f"  Point {point}: {class_pred} (confidence: {pred:.3f})")
    
    return perceptron_and, perceptron_or, perceptron_xor, perceptron_2d

---

## Part 2: Tiny Multi-Layer Perceptron (MLP) Demo

### Mathematical Foundation

Multi-layer perceptrons extend single perceptrons by adding hidden layers, enabling them to learn non-linear patterns. The key innovation is **backpropagation** - an algorithm that efficiently computes gradients for all weights in the network.

**MLP Architecture:**

- **Input Layer**: Receives features

- **Hidden Layer(s)**: Process and transform features 

- **Output Layer**: Produces final predictions

- **Connections**: Each neuron connects to all neurons in the next layer

**Forward Pass:**

1. `z₁ = W₁X + b₁` (linear transformation)

2. `a₁ = σ(z₁)` (activation function)

3. `z₂ = W₂a₁ + b₂` (second layer)

4. `ŷ = σ(z₂)` (final output)

**Backpropagation Algorithm:**

1. **Forward pass**: Compute predictions

2. **Compute loss**: Compare predictions to targets

3. **Backward pass**: Compute gradients using chain rule

4. **Update weights**: Apply gradient descent

### From-Scratch Implementation

```python
class TinyMLP:
    """
    Tiny Multi-Layer Perceptron implementation from scratch.
    Demonstrates backpropagation and multi-layer learning.
    """
    
    def __init__(self, input_size: int, hidden_size: int, output_size: int, learning_rate: float = 0.1):
        """
        Initialize tiny MLP with one hidden layer.
        
        Args:
            input_size: Number of input features
            hidden_size: Number of neurons in hidden layer
            output_size: Number of output neurons
            learning_rate: Learning rate for gradient descent
        """
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.learning_rate = learning_rate
        
        ## Initialize weights with small random values

        self.W1 = np.random.normal(0, 0.5, (input_size, hidden_size))   # Input to hidden
        self.b1 = np.zeros((1, hidden_size))                            # Hidden layer bias
        self.W2 = np.random.normal(0, 0.5, (hidden_size, output_size))  # Hidden to output
        self.b2 = np.zeros((1, output_size))                            # Output layer bias
        
        ## Track training progress

        self.training_history = []
        self.trained = False
    
    def _sigmoid(self, z: np.ndarray) -> np.ndarray:
        """Sigmoid activation function with numerical stability."""
        z = np.clip(z, -500, 500)  # Prevent overflow
        return 1 / (1 + np.exp(-z))
    
    def _sigmoid_derivative(self, z: np.ndarray) -> np.ndarray:
        """Derivative of sigmoid function."""
        sigmoid_z = self._sigmoid(z)
        return sigmoid_z * (1 - sigmoid_z)
    
    def _relu(self, z: np.ndarray) -> np.ndarray:
        """ReLU activation function."""
        return np.maximum(0, z)
    
    def _relu_derivative(self, z: np.ndarray) -> np.ndarray:
        """Derivative of ReLU function."""
        return np.where(z > 0, 1, 0)
    
    def forward_pass(self, X: np.ndarray) -> Dict[str, np.ndarray]:
        """
        Perform forward pass through the network.
        
        Args:
            X: Input data (batch_size, input_size)
            
        Returns:
            Dictionary containing intermediate values for backpropagation
        """

        ## Ensure X is 2D

        if X.ndim == 1:
            X = X.reshape(1, -1)
        
        ## Layer 1: Input to Hidden

        z1 = np.dot(X, self.W1) + self.b1
        a1 = self._sigmoid(z1)
        
        ## Layer 2: Hidden to Output

        z2 = np.dot(a1, self.W2) + self.b2
        a2 = self._sigmoid(z2)
        
        ## Store intermediate values for backpropagation

        cache = {
            'X': X,
            'z1': z1,
            'a1': a1,
            'z2': z2,
            'a2': a2
        }
        
        return cache
    
    def compute_loss(self, predictions: np.ndarray, targets: np.ndarray) -> float:
        """
        Compute mean squared error loss.
        
        Args:
            predictions: Network predictions
            targets: True target values
            
        Returns:
            Mean squared error
        """
        return np.mean((predictions - targets) ** 2)
    
    def backward_pass(self, cache: Dict[str, np.ndarray], targets: np.ndarray) -> Dict[str, np.ndarray]:
        """
        Perform backward pass (backpropagation) to compute gradients.
        
        Args:
            cache: Forward pass intermediate values
            targets: True target values
            
        Returns:
            Dictionary containing gradients for all parameters
        """

        ## Extract values from cache

        X = cache['X']
        z1 = cache['z1']
        a1 = cache['a1']
        z2 = cache['z2']
        a2 = cache['a2']
        
        m = X.shape[0]  # batch size
        
        ## Ensure targets have correct shape

        if targets.ndim == 1:
            targets = targets.reshape(-1, 1)
        
        ## Output layer gradients (Layer 2)

        dz2 = a2 - targets  # Derivative of MSE w.r.t. z2 (simplified for sigmoid)
        dW2 = np.dot(a1.T, dz2) / m
        db2 = np.mean(dz2, axis=0, keepdims=True)
        
        ## Hidden layer gradients (Layer 1)

        da1 = np.dot(dz2, self.W2.T)
        dz1 = da1 * self._sigmoid_derivative(z1)
        dW1 = np.dot(X.T, dz1) / m
        db1 = np.mean(dz1, axis=0, keepdims=True)
        
        gradients = {
            'dW1': dW1,
            'db1': db1,
            'dW2': dW2,
            'db2': db2
        }
        
        return gradients
    
    def update_weights(self, gradients: Dict[str, np.ndarray]) -> None:
        """
        Update weights using gradient descent.
        
        Args:
            gradients: Computed gradients for all parameters
        """
        self.W1 -= self.learning_rate * gradients['dW1']
        self.b1 -= self.learning_rate * gradients['db1']
        self.W2 -= self.learning_rate * gradients['dW2']
        self.b2 -= self.learning_rate * gradients['db2']
    
    def train_epoch(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        """
        Train for one epoch (one pass through all data).
        
        Args:
            X: Training features
            y: Training targets
            
        Returns:
            Training statistics for this epoch
        """

        ## Forward pass

        cache = self.forward_pass(X)
        predictions = cache['a2']
        
        ## Compute loss

        loss = self.compute_loss(predictions, y)
        
        ## Backward pass

        gradients = self.backward_pass(cache, y)
        
        ## Update weights

        self.update_weights(gradients)
        
        ## Compute accuracy (for classification problems)

        if self.output_size == 1:  # Binary classification
            accuracy = np.mean((predictions > 0.5) == (y > 0.5))
        else:  # Multi-class classification
            predicted_classes = np.argmax(predictions, axis=1)
            true_classes = np.argmax(y, axis=1) if y.shape[1] > 1 else y
            accuracy = np.mean(predicted_classes == true_classes)
        
        return {
            'loss': loss,
            'accuracy': accuracy,
            'predictions': predictions
        }
    
    def fit(self, X: np.ndarray, y: np.ndarray, epochs: int = 100, verbose: bool = True) -> Dict[str, Any]:
        """
        Train the MLP for specified number of epochs.
        
        Args:
            X: Training features
            y: Training targets
            epochs: Number of training epochs
            verbose: Whether to print training progress
            
        Returns:
            Training history and statistics
        """

        ## Ensure proper shapes

        if X.ndim == 1:
            X = X.reshape(-1, 1)
        if y.ndim == 1:
            y = y.reshape(-1, 1)
        
        self.training_history = []
        
        for epoch in range(epochs):

            ## Train one epoch

            epoch_stats = self.train_epoch(X, y)
            
            ## Add epoch number

            epoch_stats['epoch'] = epoch + 1
            
            ## Store training history

            self.training_history.append(epoch_stats)
            
            ## Print progress

            if verbose and (epoch + 1) % max(1, epochs // 10) == 0:
                print(f"Epoch {epoch + 1:3d}/{epochs}: Loss = {epoch_stats['loss']:.4f}, Accuracy = {epoch_stats['accuracy']:.3f}")
        
        self.trained = True
        
        return {
            'training_history': self.training_history,
            'final_loss': self.training_history[-1]['loss'],
            'final_accuracy': self.training_history[-1]['accuracy']
        }
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions on new data."""
        if not self.trained:
            raise ValueError("MLP must be trained before making predictions")
        
        cache = self.forward_pass(X)
        return cache['a2']
    
    def get_weights_info(self) -> Dict[str, Any]:
        """Get information about current weights."""
        return {
            'W1_shape': self.W1.shape,
            'W1_mean': np.mean(self.W1),
            'W1_std': np.std(self.W1),
            'W2_shape': self.W2.shape,
            'W2_mean': np.mean(self.W2),
            'W2_std': np.std(self.W2),
            'total_parameters': self.W1.size + self.b1.size + self.W2.size + self.b2.size
        }

def demonstrate_tiny_mlp():
    """Demonstrate tiny MLP with XOR problem and other examples."""
    print("\nTiny Multi-Layer Perceptron Demonstration")
    print("=" * 41)
    
    ## Example 1: XOR Problem (the classic MLP success story)

    print("\n1. XOR Problem - MLP Success")
    print("-" * 30)
    
    ## XOR data

    X_xor = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y_xor = np.array([[0], [1], [1], [0]])
    
    ## Create and train tiny MLP

    mlp_xor = TinyMLP(input_size=2, hidden_size=4, output_size=1, learning_rate=1.0)
    
    print("Training MLP on XOR problem...")
    training_stats = mlp_xor.fit(X_xor, y_xor, epochs=1000, verbose=False)
    
    print(f"Training completed:")
    print(f"  Final loss: {training_stats['final_loss']:.4f}")
    print(f"  Final accuracy: {training_stats['final_accuracy']:.3f}")
    
    ## Test XOR predictions

    predictions = mlp_xor.predict(X_xor)
    print(f"\nXOR Results:")
    for i, (inputs, target, pred) in enumerate(zip(X_xor, y_xor, predictions)):
        pred_binary = 1 if pred[0] > 0.5 else 0
        correct = "✓" if pred_binary == target[0] else "✗"
        print(f"  {inputs[0]} XOR {inputs[1]} = {target[0]} (predicted: {pred[0]:.3f} → {pred_binary}) {correct}")
    
    ## Show weight information

    weights_info = mlp_xor.get_weights_info()
    print(f"\nNetwork Architecture:")
    print(f"  Hidden layer weights: {weights_info['W1_shape']}")
    print(f"  Output layer weights: {weights_info['W2_shape']}")
    print(f"  Total parameters: {weights_info['total_parameters']}")
    
    ## Example 2: Simple 2D Classification

    print(f"\n2. 2D Non-linear Classification")
    print("-" * 32)
    
    ## Generate non-linearly separable data (circular pattern)

    np.random.seed(42)
    n_samples = 100
    
    ## Inner circle (class 0)

    r_inner = np.random.uniform(0, 1.5, n_samples // 2)
    theta_inner = np.random.uniform(0, 2*np.pi, n_samples // 2)
    x_inner = r_inner * np.cos(theta_inner)
    y_inner = r_inner * np.sin(theta_inner)
    
    ## Outer circle (class 1)

    r_outer = np.random.uniform(2.5, 4, n_samples // 2)
    theta_outer = np.random.uniform(0, 2*np.pi, n_samples // 2)
    x_outer = r_outer * np.cos(theta_outer)
    y_outer = r_outer * np.sin(theta_outer)
    
    ## Combine data

    X_circle = np.column_stack([
        np.concatenate([x_inner, x_outer]),
        np.concatenate([y_inner, y_outer])
    ])
    y_circle = np.concatenate([np.zeros(n_samples // 2), np.ones(n_samples // 2)])
    
    ## Shuffle

    indices = np.random.permutation(n_samples)
    X_circle = X_circle[indices]
    y_circle = y_circle[indices].reshape(-1, 1)
    
    ## Create and train MLP

    mlp_circle = TinyMLP(input_size=2, hidden_size=8, output_size=1, learning_rate=0.5)
    
    print("Training MLP on circular classification...")
    circle_stats = mlp_circle.fit(X_circle, y_circle, epochs=500, verbose=False)
    
    print(f"Training completed:")
    print(f"  Final loss: {circle_stats['final_loss']:.4f}")
    print(f"  Final accuracy: {circle_stats['final_accuracy']:.3f}")
    
    ## Test on specific points

    test_points = np.array([[0, 0], [3, 0], [0, 3], [-2, -2]])
    test_predictions = mlp_circle.predict(test_points)
    
    print(f"\nTest Predictions:")
    for point, pred in zip(test_points, test_predictions):
        class_pred = "Outer" if pred[0] > 0.5 else "Inner"
        print(f"  Point {point}: {class_pred} circle (confidence: {pred[0]:.3f})")
    
    ## Example 3: Function Approximation

    print(f"\n3. Function Approximation")
    print("-" * 26)
    
    ## Generate data for a non-linear function: y = sin(x) + 0.5*cos(2x)

    X_func = np.linspace(-2*np.pi, 2*np.pi, 100).reshape(-1, 1)
    y_func = np.sin(X_func) + 0.5 * np.cos(2 * X_func) + 0.1 * np.random.normal(0, 1, X_func.shape)
    
    ## Normalize inputs for better training

    X_func_norm = (X_func - np.mean(X_func)) / np.std(X_func)
    
    ## Create and train MLP for regression

    mlp_func = TinyMLP(input_size=1, hidden_size=10, output_size=1, learning_rate=0.01)
    
    print("Training MLP for function approximation...")
    func_stats = mlp_func.fit(X_func_norm, y_func, epochs=1000, verbose=False)
    
    print(f"Training completed:")
    print(f"  Final loss: {func_stats['final_loss']:.4f}")
    
    ## Test function approximation

    test_x = np.array([[-1], [0], [1]]) # Normalized test points
    test_predictions = mlp_func.predict(test_x)
    actual_x = test_x * np.std(X_func) + np.mean(X_func)  # Denormalize for display
    
    print(f"\nFunction Approximation Results:")
    for x_norm, x_actual, pred in zip(test_x, actual_x, test_predictions):
        actual_y = np.sin(x_actual) + 0.5 * np.cos(2 * x_actual)
        error = abs(pred[0] - actual_y[0])
        print(f"  x = {x_actual[0]:.2f}: predicted = {pred[0]:.3f}, actual ≈ {actual_y[0]:.3f} (error: {error:.3f})")
    
    return mlp_xor, mlp_circle, mlp_func

---

## Part 3: Training Loop Intuition

### Understanding the Training Process

The training loop is the heart of neural network learning. Understanding how weights evolve, loss decreases, and the network learns patterns is crucial for developing intuition about neural network behavior.

**Training Loop Components:**

1. **Initialization**: Random weights start the process

2. **Forward Pass**: Compute predictions with current weights

3. **Loss Calculation**: Measure prediction error

4. **Backward Pass**: Compute how to adjust weights

5. **Weight Update**: Apply gradient descent

6. **Repeat**: Until convergence or max epochs

### Training Analysis Tools

```python
class TrainingAnalyzer:
    """
    Tools for analyzing and visualizing neural network training.
    Helps build intuition about the learning process.
    """
    
    def __init__(self):
        self.training_logs = []
    
    def log_training_step(self, epoch: int, weights: Dict, gradients: Dict, loss: float, accuracy: float):
        """Log detailed training step information."""
        log_entry = {
            'epoch': epoch,
            'loss': loss,
            'accuracy': accuracy,
            'weights': {k: v.copy() for k, v in weights.items()},
            'gradients': {k: v.copy() for k, v in gradients.items()},
            'weight_norms': {k: np.linalg.norm(v) for k, v in weights.items()},
            'gradient_norms': {k: np.linalg.norm(v) for k, v in gradients.items()}
        }
        self.training_logs.append(log_entry)
    
    def analyze_convergence(self) -> Dict[str, Any]:
        """Analyze convergence patterns in training."""
        if not self.training_logs:
            return {}
        
        losses = [log['loss'] for log in self.training_logs]
        accuracies = [log['accuracy'] for log in self.training_logs]
        
        ## Find convergence point (where loss stops decreasing significantly)

        convergence_epoch = None
        loss_threshold = 0.001  # Minimum loss decrease to consider significant
        
        for i in range(10, len(losses)):
            recent_improvement = losses[i-10] - losses[i]
            if recent_improvement < loss_threshold:
                convergence_epoch = i
                break
        
        ## Analyze weight evolution

        weight_evolution = {}
        for weight_name in self.training_logs[0]['weights'].keys():
            weight_norms = [log['weight_norms'][weight_name] for log in self.training_logs]
            weight_evolution[weight_name] = {
                'initial_norm': weight_norms[0],
                'final_norm': weight_norms[-1],
                'change_ratio': weight_norms[-1] / weight_norms[0] if weight_norms[0] > 0 else 0
            }
        
        return {
            'convergence_epoch': convergence_epoch,
            'final_loss': losses[-1],
            'final_accuracy': accuracies[-1],
            'loss_reduction': losses[0] - losses[-1],
            'weight_evolution': weight_evolution,
            'training_stable': np.std(losses[-10:]) < 0.01 if len(losses) >= 10 else False
        }
    
    def get_training_dynamics(self) -> Dict[str, List]:
        """Get training dynamics for visualization."""
        return {
            'epochs': [log['epoch'] for log in self.training_logs],
            'losses': [log['loss'] for log in self.training_logs],
            'accuracies': [log['accuracy'] for log in self.training_logs],
            'weight_norms': {
                name: [log['weight_norms'][name] for log in self.training_logs]
                for name in self.training_logs[0]['weight_norms'].keys()
            },
            'gradient_norms': {
                name: [log['gradient_norms'][name] for log in self.training_logs]
                for name in self.training_logs[0]['gradient_norms'].keys()
            }
        }

class InstrumentedTinyMLP(TinyMLP):
    """
    Extended TinyMLP with detailed training analysis capabilities.
    Logs training dynamics for educational insight.
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.analyzer = TrainingAnalyzer()
    
    def train_epoch_instrumented(self, X: np.ndarray, y: np.ndarray, epoch: int) -> Dict[str, float]:
        """Enhanced training epoch with detailed logging."""

        ## Forward pass

        cache = self.forward_pass(X)
        predictions = cache['a2']
        
        ## Compute loss

        loss = self.compute_loss(predictions, y)
        
        ## Backward pass

        gradients = self.backward_pass(cache, y)
        
        ## Log before weight update

        weights = {'W1': self.W1, 'b1': self.b1, 'W2': self.W2, 'b2': self.b2}
        
        ## Compute accuracy

        if self.output_size == 1:
            accuracy = np.mean((predictions > 0.5) == (y > 0.5))
        else:
            predicted_classes = np.argmax(predictions, axis=1)
            true_classes = np.argmax(y, axis=1) if y.shape[1] > 1 else y
            accuracy = np.mean(predicted_classes == true_classes)
        
        ## Log training step

        self.analyzer.log_training_step(epoch, weights, gradients, loss, accuracy)
        
        ## Update weights

        self.update_weights(gradients)
        
        return {
            'loss': loss,
            'accuracy': accuracy,
            'predictions': predictions
        }
    
    def fit_with_analysis(self, X: np.ndarray, y: np.ndarray, epochs: int = 100, verbose: bool = True) -> Dict[str, Any]:
        """Train with detailed analysis logging."""
        if X.ndim == 1:
            X = X.reshape(-1, 1)
        if y.ndim == 1:
            y = y.reshape(-1, 1)
        
        self.training_history = []
        
        for epoch in range(epochs):
            epoch_stats = self.train_epoch_instrumented(X, y, epoch + 1)
            epoch_stats['epoch'] = epoch + 1
            self.training_history.append(epoch_stats)
            
            if verbose and (epoch + 1) % max(1, epochs // 10) == 0:
                print(f"Epoch {epoch + 1:3d}/{epochs}: Loss = {epoch_stats['loss']:.4f}, Accuracy = {epoch_stats['accuracy']:.3f}")
        
        self.trained = True
        
        ## Analyze training

        convergence_analysis = self.analyzer.analyze_convergence()
        
        return {
            'training_history': self.training_history,
            'final_loss': self.training_history[-1]['loss'],
            'final_accuracy': self.training_history[-1]['accuracy'],
            'convergence_analysis': convergence_analysis
        }

def demonstrate_training_loop_intuition():
    """Demonstrate training loop dynamics and intuition."""
    print("\nTraining Loop Intuition Demonstration")
    print("=" * 37)
    
    ## Example 1: Weight Evolution During Training

    print("\n1. Weight Evolution Analysis")
    print("-" * 28)
    
    ## Use XOR problem with detailed analysis

    X_xor = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y_xor = np.array([[0], [1], [1], [0]])
    
    ## Create instrumented MLP

    mlp_analyzed = InstrumentedTinyMLP(input_size=2, hidden_size=3, output_size=1, learning_rate=2.0)
    
    print("Training XOR with weight analysis...")
    analysis_results = mlp_analyzed.fit_with_analysis(X_xor, y_xor, epochs=300, verbose=False)
    
    ## Display convergence analysis

    convergence = analysis_results['convergence_analysis']
    print(f"\nConvergence Analysis:")
    print(f"  Converged at epoch: {convergence.get('convergence_epoch', 'Not converged')}")
    print(f"  Final loss: {convergence['final_loss']:.4f}")
    print(f"  Loss reduction: {convergence['loss_reduction']:.4f}")
    print(f"  Training stable: {convergence['training_stable']}")
    
    ## Weight evolution

    print(f"\nWeight Evolution:")
    for weight_name, evolution in convergence['weight_evolution'].items():
        print(f"  {weight_name}: {evolution['initial_norm']:.3f} → {evolution['final_norm']:.3f} "
              f"(ratio: {evolution['change_ratio']:.2f})")
    
    ## Example 2: Learning Rate Impact

    print(f"\n2. Learning Rate Impact")
    print("-" * 24)
    
    learning_rates = [0.1, 1.0, 5.0, 10.0]
    lr_results = {}
    
    for lr in learning_rates:
        mlp_lr = TinyMLP(input_size=2, hidden_size=4, output_size=1, learning_rate=lr)
        
        ## Train with current learning rate

        lr_stats = mlp_lr.fit(X_xor, y_xor, epochs=200, verbose=False)
        
        lr_results[lr] = {
            'final_loss': lr_stats['final_loss'],
            'final_accuracy': lr_stats['final_accuracy'],
            'converged': lr_stats['final_loss'] < 0.1
        }
    
    print("Learning Rate Impact on XOR Learning:")
    print("  LR     | Final Loss | Accuracy | Converged")
    print("  -------|------------|----------|----------")
    for lr, results in lr_results.items():
        converged_str = "Yes" if results['converged'] else "No"
        print(f"  {lr:5.1f}  |   {results['final_loss']:6.3f}   |  {results['final_accuracy']:6.3f}  |    {converged_str}")
    
    ## Example 3: Hidden Layer Size Impact

    print(f"\n3. Hidden Layer Size Impact")
    print("-" * 29)
    
    hidden_sizes = [2, 3, 4, 8, 16]
    size_results = {}
    
    for hidden_size in hidden_sizes:
        mlp_size = TinyMLP(input_size=2, hidden_size=hidden_size, output_size=1, learning_rate=1.0)
        
        size_stats = mlp_size.fit(X_xor, y_xor, epochs=500, verbose=False)
        
        ## Count parameters

        total_params = (2 * hidden_size + hidden_size) + (hidden_size * 1 + 1)
        
        size_results[hidden_size] = {
            'final_loss': size_stats['final_loss'],
            'final_accuracy': size_stats['final_accuracy'],
            'total_params': total_params,
            'converged': size_stats['final_loss'] < 0.1
        }
    
    print("Hidden Layer Size Impact:")
    print("  Size | Params | Final Loss | Accuracy | Converged")
    print("  -----|--------|------------|----------|----------")
    for size, results in size_results.items():
        converged_str = "Yes" if results['converged'] else "No"
        print(f"  {size:3d}  |   {results['total_params']:3d}  |   {results['final_loss']:6.3f}   |  {results['final_accuracy']:6.3f}  |    {converged_str}")
    
    ## Example 4: Training Dynamics Visualization (text-based)

    print(f"\n4. Training Dynamics Analysis")
    print("-" * 31)
    
    ## Get training dynamics from analyzed MLP

    dynamics = mlp_analyzed.analyzer.get_training_dynamics()
    
    ## Show loss progression (every 30 epochs)

    print("Loss Progression (every 30 epochs):")
    epochs = dynamics['epochs']
    losses = dynamics['losses']
    
    step = max(1, len(epochs) // 10)
    print("  Epoch | Loss")
    print("  ------|-------")
    for i in range(0, len(epochs), step):
        print(f"  {epochs[i]:5d} | {losses[i]:.4f}")
    
    ## Weight norm evolution

    print(f"\nWeight Norm Evolution:")
    weight_norms = dynamics['weight_norms']
    
    for weight_name, norms in weight_norms.items():
        initial_norm = norms[0]
        final_norm = norms[-1]
        max_norm = max(norms)
        print(f"  {weight_name}: {initial_norm:.3f} → {final_norm:.3f} (max: {max_norm:.3f})")
    
    ## Example 5: Common Training Issues

    print(f"\n5. Common Training Issues")
    print("-" * 26)
    
    ## Issue 1: Learning rate too high (oscillation)

    print("a) Learning Rate Too High (Oscillation):")
    mlp_oscillate = TinyMLP(input_size=2, hidden_size=4, output_size=1, learning_rate=20.0)
    osc_stats = mlp_oscillate.fit(X_xor, y_xor, epochs=100, verbose=False)
    
    losses_osc = [stats['loss'] for stats in mlp_oscillate.training_history]
    loss_variance = np.var(losses_osc[-20:]) if len(losses_osc) >= 20 else 0
    
    print(f"  Final loss: {osc_stats['final_loss']:.4f}")
    print(f"  Loss variance (last 20 epochs): {loss_variance:.4f}")
    print(f"  Diagnosis: {'Oscillating' if loss_variance > 0.1 else 'Stable'}")
    
    ## Issue 2: Learning rate too low (slow convergence)

    print(f"\nb) Learning Rate Too Low (Slow Convergence):")
    mlp_slow = TinyMLP(input_size=2, hidden_size=4, output_size=1, learning_rate=0.01)
    slow_stats = mlp_slow.fit(X_xor, y_xor, epochs=100, verbose=False)
    
    print(f"  Final loss: {slow_stats['final_loss']:.4f}")
    print(f"  Final accuracy: {slow_stats['final_accuracy']:.3f}")
    print(f"  Diagnosis: {'Needs more epochs' if slow_stats['final_loss'] > 0.5 else 'Adequate'}")
    
    ## Issue 3: Insufficient capacity

    print(f"\nc) Insufficient Network Capacity:")
    mlp_small = TinyMLP(input_size=2, hidden_size=1, output_size=1, learning_rate=1.0)
    small_stats = mlp_small.fit(X_xor, y_xor, epochs=500, verbose=False)
    
    print(f"  Final loss: {small_stats['final_loss']:.4f}")
    print(f"  Final accuracy: {small_stats['final_accuracy']:.3f}")
    print(f"  Diagnosis: {'Insufficient capacity' if small_stats['final_accuracy'] < 0.8 else 'Adequate'}")
    
    return mlp_analyzed, lr_results, size_results

---

## Part 4: Practical Applications and Behavior Reasoning

### Understanding Neural Network Behavior

To effectively use neural networks in automation systems, we must understand how they make decisions, what patterns they learn, and how to interpret their behavior.

**Key Behavioral Concepts:**

- **Feature Learning**: Hidden layers learn useful representations

- **Decision Boundaries**: Networks create complex decision regions

- **Generalization**: Ability to perform well on unseen data

- **Interpretability**: Understanding what the network has learned

### Behavior Analysis Tools

```python
class NetworkBehaviorAnalyzer:
    """
    Tools for understanding and interpreting neural network behavior.
    Helps reason about what networks learn and how they make decisions.
    """
    
    def __init__(self, mlp: TinyMLP):
        self.mlp = mlp
    
    def analyze_hidden_layer_activations(self, X: np.ndarray) -> Dict[str, Any]:
        """
        Analyze what the hidden layer learns by examining activations.
        
        Args:
            X: Input data to analyze
            
        Returns:
            Analysis of hidden layer behavior
        """
        if not self.mlp.trained:
            raise ValueError("MLP must be trained before analysis")
        
        ## Get hidden layer activations

        cache = self.mlp.forward_pass(X)
        hidden_activations = cache['a1']
        
        ## Analyze each hidden neuron

        neuron_analysis = {}
        for i in range(hidden_activations.shape[1]):
            neuron_i_activations = hidden_activations[:, i]
            
            neuron_analysis[f'neuron_{i}'] = {
                'mean_activation': np.mean(neuron_i_activations),
                'activation_range': [np.min(neuron_i_activations), np.max(neuron_i_activations)],
                'activation_variance': np.var(neuron_i_activations),
                'never_activates': np.max(neuron_i_activations) < 0.1,
                'always_saturated': np.min(neuron_i_activations) > 0.9
            }
        
        return {
            'hidden_activations': hidden_activations,
            'neuron_analysis': neuron_analysis,
            'num_dead_neurons': sum(1 for analysis in neuron_analysis.values() 
                                   if analysis['never_activates']),
            'num_saturated_neurons': sum(1 for analysis in neuron_analysis.values() 
                                        if analysis['always_saturated'])
        }
    
    def analyze_weight_patterns(self) -> Dict[str, Any]:
        """Analyze learned weight patterns for insights."""
        if not self.mlp.trained:
            raise ValueError("MLP must be trained before analysis")
        
        ## Input to hidden weights analysis

        W1_analysis = {
            'weight_matrix_shape': self.mlp.W1.shape,
            'weight_statistics': {
                'mean': np.mean(self.mlp.W1),
                'std': np.std(self.mlp.W1),
                'min': np.min(self.mlp.W1),
                'max': np.max(self.mlp.W1)
            },
            'neuron_weight_norms': [np.linalg.norm(self.mlp.W1[:, i]) 
                                   for i in range(self.mlp.W1.shape[1])]
        }
        
        ## Hidden to output weights analysis

        W2_analysis = {
            'weight_vector_shape': self.mlp.W2.shape,
            'weight_statistics': {
                'mean': np.mean(self.mlp.W2),
                'std': np.std(self.mlp.W2),
                'min': np.min(self.mlp.W2),
                'max': np.max(self.mlp.W2)
            }
        }
        
        return {
            'input_to_hidden': W1_analysis,
            'hidden_to_output': W2_analysis
        }
    
    def create_decision_boundary_analysis(self, X: np.ndarray, resolution: int = 50) -> Dict[str, Any]:
        """
        Create a grid analysis to understand decision boundaries.
        
        Args:
            X: Training data to determine grid bounds
            resolution: Grid resolution for analysis
            
        Returns:
            Decision boundary analysis
        """
        if X.shape[1] != 2:
            raise ValueError("Decision boundary analysis only supported for 2D input")
        
        ## Create grid

        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        
        xx, yy = np.meshgrid(
            np.linspace(x_min, x_max, resolution),
            np.linspace(y_min, y_max, resolution)
        )
        
        ## Get predictions for grid points

        grid_points = np.column_stack([xx.ravel(), yy.ravel()])
        predictions = self.mlp.predict(grid_points)
        
        ## Reshape predictions to grid

        prediction_grid = predictions.reshape(xx.shape)
        
        return {
            'x_grid': xx,
            'y_grid': yy,
            'prediction_grid': prediction_grid,
            'decision_boundary_complexity': np.var(prediction_grid)
        }
    
    def interpret_xor_solution(self, X_xor: np.ndarray, y_xor: np.ndarray) -> Dict[str, Any]:
        """
        Specific analysis for XOR problem to understand how MLP solves it.
        
        Args:
            X_xor: XOR input data
            y_xor: XOR target data
            
        Returns:
            Interpretation of XOR solution
        """
        if not self.mlp.trained:
            raise ValueError("MLP must be trained before analysis")
        
        ## Get hidden layer activations for XOR inputs

        cache = self.mlp.forward_pass(X_xor)
        hidden_activations = cache['a1']
        final_outputs = cache['a2']
        
        ## Analyze how each hidden neuron responds to XOR inputs

        neuron_responses = {}
        for i in range(hidden_activations.shape[1]):
            responses = hidden_activations[:, i]
            neuron_responses[f'hidden_neuron_{i}'] = {
                'input_00': responses[0],
                'input_01': responses[1],
                'input_10': responses[2],
                'input_11': responses[3],
                'pattern_type': self._classify_xor_pattern(responses)
            }
        
        return {
            'hidden_responses': neuron_responses,
            'final_outputs': final_outputs.flatten(),
            'solution_interpretation': self._interpret_xor_strategy(neuron_responses)
        }
    
    def _classify_xor_pattern(self, responses: np.ndarray) -> str:
        """Classify the pattern learned by a hidden neuron."""

        ## Check for common XOR decomposition patterns

        if responses[0] < 0.5 and responses[1] > 0.5 and responses[2] > 0.5 and responses[3] < 0.5:
            return "XOR-like"
        elif responses[0] > 0.5 and responses[1] < 0.5 and responses[2] < 0.5 and responses[3] > 0.5:
            return "XNOR-like"
        elif responses[0] < 0.5 and responses[1] > 0.5 and responses[2] > 0.5 and responses[3] > 0.5:
            return "OR-like"
        elif responses[0] < 0.5 and responses[1] < 0.5 and responses[2] < 0.5 and responses[3] > 0.5:
            return "AND-like"
        else:
            return "Complex"
    
    def _interpret_xor_strategy(self, neuron_responses: Dict) -> str:
        """Interpret the overall strategy used to solve XOR."""
        patterns = [info['pattern_type'] for info in neuron_responses.values()]
        
        if 'XOR-like' in patterns or 'XNOR-like' in patterns:
            return "Direct XOR decomposition"
        elif 'OR-like' in patterns and 'AND-like' in patterns:
            return "OR/AND combination strategy"
        else:
            return "Complex non-linear combination"

def demonstrate_behavior_reasoning():
    """Demonstrate neural network behavior analysis and reasoning."""
    print("\nNeural Network Behavior Reasoning")
    print("=" * 35)
    
    ## Example 1: XOR Solution Analysis

    print("\n1. XOR Solution Analysis")
    print("-" * 25)
    
    ## Train MLP on XOR

    X_xor = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y_xor = np.array([[0], [1], [1], [0]])
    
    mlp_xor_analysis = TinyMLP(input_size=2, hidden_size=4, output_size=1, learning_rate=1.5)
    mlp_xor_analysis.fit(X_xor, y_xor, epochs=500, verbose=False)
    
    ## Analyze behavior

    analyzer = NetworkBehaviorAnalyzer(mlp_xor_analysis)
    
    ## Hidden layer activation analysis

    activation_analysis = analyzer.analyze_hidden_layer_activations(X_xor)
    
    print("Hidden Layer Activation Analysis:")
    for neuron_name, analysis in activation_analysis['neuron_analysis'].items():
        print(f"  {neuron_name}:")
        print(f"    Mean activation: {analysis['mean_activation']:.3f}")
        print(f"    Activation range: [{analysis['activation_range'][0]:.3f}, {analysis['activation_range'][1]:.3f}]")
        print(f"    Dead neuron: {analysis['never_activates']}")
        print(f"    Saturated: {analysis['always_saturated']}")
    
    print(f"\nNetwork Health:")
    print(f"  Dead neurons: {activation_analysis['num_dead_neurons']}")
    print(f"  Saturated neurons: {activation_analysis['num_saturated_neurons']}")
    
    ## XOR-specific interpretation

    xor_interpretation = analyzer.interpret_xor_solution(X_xor, y_xor)
    
    print(f"\nXOR Solution Strategy:")
    print(f"  {xor_interpretation['solution_interpretation']}")
    
    print(f"\nHidden Neuron Patterns:")
    for neuron, response in xor_interpretation['hidden_responses'].items():
        print(f"  {neuron}: {response['pattern_type']}")
        print(f"    Responses: [0,0]→{response['input_00']:.2f}, [0,1]→{response['input_01']:.2f}, "
              f"[1,0]→{response['input_10']:.2f}, [1,1]→{response['input_11']:.2f}")
    
    ## Example 2: Weight Pattern Analysis

    print(f"\n2. Weight Pattern Analysis")
    print("-" * 26)
    
    weight_analysis = analyzer.analyze_weight_patterns()
    
    print("Input-to-Hidden Weights:")
    W1_stats = weight_analysis['input_to_hidden']['weight_statistics']
    print(f"  Shape: {weight_analysis['input_to_hidden']['weight_matrix_shape']}")
    print(f"  Mean: {W1_stats['mean']:.3f}, Std: {W1_stats['std']:.3f}")
    print(f"  Range: [{W1_stats['min']:.3f}, {W1_stats['max']:.3f}]")
    
    print(f"\nHidden-to-Output Weights:")
    W2_stats = weight_analysis['hidden_to_output']['weight_statistics']
    print(f"  Shape: {weight_analysis['hidden_to_output']['weight_vector_shape']}")
    print(f"  Mean: {W2_stats['mean']:.3f}, Std: {W2_stats['std']:.3f}")
    print(f"  Range: [{W2_stats['min']:.3f}, {W2_stats['max']:.3f}]")
    
    ## Neuron importance based on weight norms

    neuron_norms = weight_analysis['input_to_hidden']['neuron_weight_norms']
    print(f"\nNeuron Importance (by weight norm):")
    for i, norm in enumerate(neuron_norms):
        importance = "High" if norm > np.mean(neuron_norms) else "Low"
        print(f"  Hidden neuron {i}: {norm:.3f} ({importance})")
    
    ## Example 3: Generalization Analysis

    print(f"\n3. Generalization Analysis")
    print("-" * 27)
    
    ## Test on noisy versions of XOR inputs

    noise_levels = [0.0, 0.1, 0.2, 0.3]
    
    print("Robustness to Input Noise:")
    print("  Noise | Accuracy")
    print("  ------|----------")
    
    for noise_level in noise_levels:

        ## Add noise to XOR inputs

        X_noisy = X_xor + np.random.normal(0, noise_level, X_xor.shape)
        predictions = mlp_xor_analysis.predict(X_noisy)
        
        ## Calculate accuracy

        predicted_classes = (predictions > 0.5).astype(int)
        actual_classes = y_xor.flatten()
        accuracy = np.mean(predicted_classes.flatten() == actual_classes)
        
        print(f"  {noise_level:5.1f} |  {accuracy:6.3f}")
    
    ## Example 4: Decision Boundary Complexity

    print(f"\n4. Decision Boundary Analysis")
    print("-" * 30)
    
    boundary_analysis = analyzer.create_decision_boundary_analysis(X_xor, resolution=20)
    
    print(f"Decision Boundary Complexity: {boundary_analysis['decision_boundary_complexity']:.3f}")
    
    ## Sample some points from decision boundary region

    prediction_grid = boundary_analysis['prediction_grid']
    boundary_points = []
    
    for i in range(prediction_grid.shape[0]):
        for j in range(prediction_grid.shape[1]):
            prediction = prediction_grid[i, j]
            if 0.4 < prediction < 0.6:  # Near decision boundary
                x = boundary_analysis['x_grid'][i, j]
                y = boundary_analysis['y_grid'][i, j]
                boundary_points.append((x, y, prediction))
    
    print(f"Decision boundary points (prediction ≈ 0.5):")
    for x, y, pred in boundary_points[:5]:  # Show first 5
        print(f"  ({x:.2f}, {y:.2f}) → {pred:.3f}")
    
    ## Example 5: Feature Sensitivity Analysis

    print(f"\n5. Feature Sensitivity Analysis")
    print("-" * 32)
    
    ## Test sensitivity to each input feature

    base_input = np.array([[0.5, 0.5]])  # Neutral point
    base_prediction = mlp_xor_analysis.predict(base_input)[0, 0]
    
    feature_sensitivities = []
    perturbation = 0.1
    
    for feature_idx in range(2):

        ## Perturb feature positively

        perturbed_input = base_input.copy()
        perturbed_input[0, feature_idx] += perturbation
        pos_prediction = mlp_xor_analysis.predict(perturbed_input)[0, 0]
        
        ## Perturb feature negatively

        perturbed_input = base_input.copy()
        perturbed_input[0, feature_idx] -= perturbation
        neg_prediction = mlp_xor_analysis.predict(perturbed_input)[0, 0]
        
        ## Calculate sensitivity

        sensitivity = abs(pos_prediction - neg_prediction) / (2 * perturbation)
        feature_sensitivities.append(sensitivity)
        
        print(f"  Feature {feature_idx} sensitivity: {sensitivity:.3f}")
    
    most_important_feature = np.argmax(feature_sensitivities)
    print(f"  Most important feature: {most_important_feature}")
    
    return analyzer, xor_interpretation, weight_analysis

## Main demonstration function

def run_all_neural_network_demonstrations():
    """Run all neural network demonstrations."""
    print("🧠 NEURAL NETWORKS: CONCEPTS AND IMPLEMENTATION")
    print("=" * 50)
    
    ## Perceptron demonstrations

    perceptron_models = demonstrate_perceptron()
    
    ## MLP demonstrations

    mlp_models = demonstrate_tiny_mlp()
    
    ## Training loop intuition

    training_analysis = demonstrate_training_loop_intuition()
    
    ## Behavior reasoning

    behavior_analysis = demonstrate_behavior_reasoning()
    
    print(f"\n{'='*50}")
    print("NEURAL NETWORK DEMONSTRATIONS COMPLETED")
    print("Key concepts demonstrated:")
    print("• Perceptron: single-layer learning with limitations")
    print("• Multi-layer Perceptron: overcoming linear separability")
    print("• Training dynamics: weight evolution and convergence")
    print("• Behavior analysis: understanding what networks learn")
    print("• Practical insights: hyperparameter effects and debugging")
    print("=" * 50)
    
    return {
        "perceptrons": perceptron_models,
        "mlps": mlp_models,
        "training_analysis": training_analysis,
        "behavior_analysis": behavior_analysis
    }

if __name__ == "__main__":
    all_results = run_all_neural_network_demonstrations()
 
 
