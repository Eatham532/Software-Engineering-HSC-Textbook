# 20.4 Design models: decision trees and neural networks

## Introduction to Model Design

!!! builds-on "Builds on"
    This section builds on [20.3 Common ML applications](../Section-03-Common-ML-applications/index.md).


Machine learning models are the core components that enable computers to make predictions and decisions based on data. Understanding how to design, build, and trace through these models is essential for creating effective automation solutions.

This section focuses on two fundamental model types that are both powerful and interpretable:

- **Decision Trees**: Rule-based models that make decisions through a series of if-then questions

- **Neural Networks**: Mathematical models inspired by biological neurons that learn complex patterns

Both models demonstrate different approaches to machine learning and provide excellent foundations for understanding how ML systems make decisions.

---

## Part 1: Decision Trees

### What are Decision Trees?

**Definition**: A decision tree is a flowchart-like structure where each internal node represents a test on an attribute, each branch represents the outcome of that test, and each leaf node represents a class label or prediction.

**Key Characteristics**:

- **Interpretable**: Easy to understand and explain decisions

- **Rule-based**: Makes decisions through a series of if-then conditions

- **Hierarchical**: Organizes decisions in a tree structure

- **Versatile**: Can handle both classification and regression problems

### Why Decision Trees Excel in Certain Scenarios

**Advantages**:

- **Transparency**: You can trace exactly how a decision was made

- **No preprocessing required**: Handles mixed data types naturally

- **Robust to outliers**: Tree splits are based on sorting, not distance

- **Feature selection**: Automatically identifies important features

**Common Use Cases**:

- Medical diagnosis systems

- Credit approval decisions

- Rule-based automation systems

- Quality control processes

### Conceptual Understanding: How Decision Trees Work

```kroki-plantuml
@startuml
!theme plain
skinparam backgroundColor #FEFEFE
skinparam defaultFontSize 12

rectangle "Email Classification Decision Tree" {
  rectangle "Contains 'urgent'?" as urgent
  rectangle "Contains 'meeting'?" as meeting
  rectangle "From known contact?" as contact
  rectangle "High Priority" as high1
  rectangle "Medium Priority" as medium1
  rectangle "Medium Priority" as medium2
  rectangle "Low Priority" as low
  
  urgent --> medium1 : No
  urgent --> meeting : Yes
  meeting --> high1 : Yes
  meeting --> contact : No
  contact --> medium2 : Yes
  contact --> low : No
}

@enduml
```

### Python Implementation: Building a Decision Tree from Scratch

```python
import random
import math
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from collections import Counter

@dataclass
class DataPoint:
    """Represents a single data point with features and target."""
    features: Dict[str, Any]
    target: str

@dataclass
class TreeNode:
    """Represents a node in the decision tree."""
    feature: Optional[str] = None
    threshold: Optional[Any] = None
    left: Optional['TreeNode'] = None
    right: Optional['TreeNode'] = None
    prediction: Optional[str] = None
    samples: int = 0
    depth: int = 0

class DecisionTreeClassifier:
    """
    A from-scratch implementation of a decision tree classifier.
    Demonstrates the core concepts of tree-based learning.
    """
    
    def __init__(self, max_depth: int = 5, min_samples_split: int = 2):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.root = None
        self.feature_importance = {}
    
    def calculate_entropy(self, targets: List[str]) -> float:
        """Calculate entropy of a set of target values."""
        if not targets:
            return 0
        
        # Count occurrences of each class
        counts = Counter(targets)
        total = len(targets)
        
        # Calculate entropy
        entropy = 0
        for count in counts.values():
            if count > 0:
                probability = count / total
                entropy -= probability * math.log2(probability)
        
        return entropy
    
    def calculate_information_gain(self, data: List[DataPoint], feature: str, threshold: Any) -> float:
        """Calculate information gain for a potential split."""
        # Split data based on feature and threshold
        left_data = []
        right_data = []
        
        for point in data:
            if isinstance(point.features[feature], (int, float)):
                if point.features[feature] <= threshold:
                    left_data.append(point)
                else:
                    right_data.append(point)
            else:
                if point.features[feature] == threshold:
                    left_data.append(point)
                else:
                    right_data.append(point)
        
        # Calculate weighted entropy after split
        total_samples = len(data)
        left_weight = len(left_data) / total_samples
        right_weight = len(right_data) / total_samples
        
        left_targets = [point.target for point in left_data]
        right_targets = [point.target for point in right_data]
        
        weighted_entropy = (left_weight * self.calculate_entropy(left_targets) + 
                          right_weight * self.calculate_entropy(right_targets))
        
        # Information gain = original entropy - weighted entropy
        original_targets = [point.target for point in data]
        original_entropy = self.calculate_entropy(original_targets)
        
        return original_entropy - weighted_entropy
    
    def find_best_split(self, data: List[DataPoint]) -> Tuple[str, Any, float]:
        """Find the best feature and threshold to split on."""
        best_gain = 0
        best_feature = None
        best_threshold = None
        
        # Get all feature names
        if not data:
            return None, None, 0
        
        feature_names = data[0].features.keys()
        
        # Try each feature
        for feature in feature_names:
            # Get unique values for this feature
            feature_values = set(point.features[feature] for point in data)
            
            # Try each unique value as a threshold
            for value in feature_values:
                gain = self.calculate_information_gain(data, feature, value)
                
                if gain > best_gain:
                    best_gain = gain
                    best_feature = feature
                    best_threshold = value
        
        return best_feature, best_threshold, best_gain
    
    def build_tree(self, data: List[DataPoint], depth: int = 0) -> TreeNode:
        """Recursively build the decision tree."""
        targets = [point.target for point in data]
        
        # Create node
        node = TreeNode(samples=len(data), depth=depth)
        
        # Base cases
        if (depth >= self.max_depth or 
            len(data) < self.min_samples_split or 
            len(set(targets)) == 1):
            # Make this a leaf node
            node.prediction = Counter(targets).most_common(1)[0][0]
            return node
        
        # Find best split
        feature, threshold, gain = self.find_best_split(data)
        
        if gain == 0 or feature is None:
            # No good split found, make leaf
            node.prediction = Counter(targets).most_common(1)[0][0]
            return node
        
        # Set node properties
        node.feature = feature
        node.threshold = threshold
        
        # Track feature importance
        if feature not in self.feature_importance:
            self.feature_importance[feature] = 0
        self.feature_importance[feature] += gain * len(data)
        
        # Split data
        left_data = []
        right_data = []
        
        for point in data:
            if isinstance(point.features[feature], (int, float)):
                if point.features[feature] <= threshold:
                    left_data.append(point)
                else:
                    right_data.append(point)
            else:
                if point.features[feature] == threshold:
                    left_data.append(point)
                else:
                    right_data.append(point)
        
        # Recursively build subtrees
        if left_data:
            node.left = self.build_tree(left_data, depth + 1)
        if right_data:
            node.right = self.build_tree(right_data, depth + 1)
        
        return node
    
    def fit(self, data: List[DataPoint]) -> None:
        """Train the decision tree on the given data."""
        print(f"Training decision tree on {len(data)} samples...")
        self.root = self.build_tree(data)
        
        # Normalize feature importance
        total_importance = sum(self.feature_importance.values())
        if total_importance > 0:
            for feature in self.feature_importance:
                self.feature_importance[feature] /= total_importance
        
        print("Training completed!")
    
    def predict_single(self, features: Dict[str, Any]) -> str:
        """Make a prediction for a single data point."""
        if self.root is None:
            raise ValueError("Tree has not been trained yet")
        
        current_node = self.root
        path = []  # Track the decision path
        
        while current_node.prediction is None:
            feature = current_node.feature
            threshold = current_node.threshold
            feature_value = features[feature]
            
            # Record the decision
            if isinstance(feature_value, (int, float)):
                if feature_value <= threshold:
                    path.append(f"{feature} <= {threshold}")
                    current_node = current_node.left
                else:
                    path.append(f"{feature} > {threshold}")
                    current_node = current_node.right
            else:
                if feature_value == threshold:
                    path.append(f"{feature} == '{threshold}'")
                    current_node = current_node.left
                else:
                    path.append(f"{feature} != '{threshold}'")
                    current_node = current_node.right
            
            if current_node is None:
                # Shouldn't happen with proper tree, but safety check
                break
        
        prediction = current_node.prediction if current_node else "Unknown"
        return prediction, path
    
    def predict(self, data: List[Dict[str, Any]]) -> List[str]:
        """Make predictions for multiple data points."""
        predictions = []
        for features in data:
            prediction, _ = self.predict_single(features)
            predictions.append(prediction)
        return predictions
    
    def print_tree(self, node: TreeNode = None, indent: str = "") -> None:
        """Print a text representation of the tree."""
        if node is None:
            node = self.root
        
        if node.prediction is not None:
            print(f"{indent}→ Predict: {node.prediction} (samples: {node.samples})")
        else:
            if isinstance(node.threshold, (int, float)):
                print(f"{indent}├─ {node.feature} <= {node.threshold}?")
            else:
                print(f"{indent}├─ {node.feature} == '{node.threshold}'?")
            
            if node.left:
                print(f"{indent}│  └─ Yes:")
                self.print_tree(node.left, indent + "│     ")
            if node.right:
                print(f"{indent}│  └─ No:")
                self.print_tree(node.right, indent + "      ")

# Demonstration: Email Priority Classification
def create_email_dataset() -> List[DataPoint]:
    """Create a sample dataset for email priority classification."""
    emails = [
        # High priority emails
        DataPoint({"sender": "boss", "contains_urgent": True, "length": 150, "has_deadline": True}, "high"),
        DataPoint({"sender": "client", "contains_urgent": True, "length": 200, "has_deadline": True}, "high"),
        DataPoint({"sender": "boss", "contains_urgent": False, "length": 100, "has_deadline": True}, "high"),
        DataPoint({"sender": "colleague", "contains_urgent": True, "length": 80, "has_deadline": True}, "high"),
        
        # Medium priority emails
        DataPoint({"sender": "colleague", "contains_urgent": False, "length": 120, "has_deadline": True}, "medium"),
        DataPoint({"sender": "client", "contains_urgent": False, "length": 250, "has_deadline": False}, "medium"),
        DataPoint({"sender": "boss", "contains_urgent": False, "length": 50, "has_deadline": False}, "medium"),
        DataPoint({"sender": "colleague", "contains_urgent": True, "length": 30, "has_deadline": False}, "medium"),
        DataPoint({"sender": "external", "contains_urgent": False, "length": 200, "has_deadline": True}, "medium"),
        
        # Low priority emails
        DataPoint({"sender": "newsletter", "contains_urgent": False, "length": 500, "has_deadline": False}, "low"),
        DataPoint({"sender": "external", "contains_urgent": False, "length": 100, "has_deadline": False}, "low"),
        DataPoint({"sender": "colleague", "contains_urgent": False, "length": 20, "has_deadline": False}, "low"),
        DataPoint({"sender": "spam", "contains_urgent": True, "length": 50, "has_deadline": False}, "low"),
        DataPoint({"sender": "external", "contains_urgent": False, "length": 300, "has_deadline": False}, "low"),
    ]
    return emails

def demonstrate_decision_tree():
    """Demonstrate decision tree training and prediction."""
    print("Decision Tree Demonstration")
    print("=" * 40)
    
    # Create dataset
    training_data = create_email_dataset()
    print(f"Created dataset with {len(training_data)} email samples")
    
    # Train decision tree
    tree = DecisionTreeClassifier(max_depth=4, min_samples_split=2)
    tree.fit(training_data)
    
    # Print the tree structure
    print("\nLearned Decision Tree:")
    print("-" * 25)
    tree.print_tree()
    
    # Show feature importance
    print(f"\nFeature Importance:")
    for feature, importance in sorted(tree.feature_importance.items(), key=lambda x: x[1], reverse=True):
        print(f"  {feature}: {importance:.3f}")
    
    # Test predictions
    test_emails = [
        {"sender": "boss", "contains_urgent": True, "length": 75, "has_deadline": True},
        {"sender": "newsletter", "contains_urgent": False, "length": 400, "has_deadline": False},
        {"sender": "colleague", "contains_urgent": False, "length": 150, "has_deadline": True},
    ]
    
    print(f"\nTesting Predictions:")
    print("-" * 20)
    
    for i, email in enumerate(test_emails, 1):
        prediction, path = tree.predict_single(email)
        print(f"\nEmail {i}: {email}")
        print(f"Decision path:")
        for step in path:
            print(f"  → {step}")
        print(f"Predicted priority: {prediction}")
    
    return tree

# Example usage
if __name__ == "__main__":
    demo_tree = demonstrate_decision_tree()
```

### Tracing Through Decision Tree Decisions

Understanding how a decision tree makes predictions is crucial for building trust and debugging models. Let's trace through a specific example:

**Example Email**: `{"sender": "boss", "contains_urgent": True, "length": 75, "has_deadline": True}`

**Decision Path**:

1. **Root Node**: Check if `contains_urgent == True`

   - Yes → Go to left branch

2. **Second Level**: Check if `sender == "boss"`

   - Yes → Go to left branch  

3. **Third Level**: Check if `has_deadline == True`

   - Yes → Go to left branch

4. **Leaf Node**: Predict **"high"** priority

This transparency makes decision trees excellent for:

- **Regulatory compliance**: You can explain every decision

- **Debugging**: Easy to identify why certain predictions are made

- **Feature engineering**: See which features matter most

- **Rule extraction**: Convert trees into human-readable rules

### Advantages and Limitations of Decision Trees

**Advantages**:

- **Interpretability**: Easy to understand and explain

- **No assumptions**: Doesn't assume linear relationships

- **Handles mixed data**: Works with both numerical and categorical features

- **Built-in feature selection**: Automatically identifies important features

- **Robust to outliers**: Splits based on ordering, not exact values

**Limitations**:

- **Overfitting**: Can memorize training data if not constrained

- **Instability**: Small changes in data can create very different trees

- **Bias**: Prefers features with more levels/categories

- **Linear boundaries**: Can't capture complex non-linear relationships well

- **Prediction smoothness**: Creates step-like prediction surfaces

### Real-World Applications

**1. Medical Diagnosis**
```
Patient Age > 65?
├─ Yes: Cholesterol > 240?
│  ├─ Yes: High Risk
│  └─ No: Medium Risk
└─ No: Exercise < 2hrs/week?
   ├─ Yes: Medium Risk
   └─ No: Low Risk
```

**2. Credit Approval**
```
Income > $50,000?
├─ Yes: Credit Score > 700?
│  ├─ Yes: Approve
│  └─ No: Manual Review
└─ No: Debt Ratio < 0.3?
   ├─ Yes: Manual Review
   └─ No: Reject
```

**3. Quality Control**
```
Temperature > 150°C?
├─ Yes: Pressure > 5 PSI?
│  ├─ Yes: Product OK
│  └─ No: Check Pressure System
└─ No: Check Heating System
```

   └─ No: Check Heating System
```

---

## Part 2: Neural Networks

### What are Neural Networks?

**Definition**: Neural networks are computational models inspired by biological neural networks that learn to map inputs to outputs through interconnected nodes (neurons) that process and transmit information.

**Key Characteristics**:

- **Interconnected nodes**: Neurons connected through weighted links
- **Adaptive learning**: Weights adjust based on training data
- **Non-linear processing**: Can capture complex patterns and relationships
- **Parallel processing**: Multiple neurons work simultaneously
- **Universal approximators**: Can theoretically approximate any continuous function

### The Biological Inspiration

Neural networks mimic how biological neurons work:

**Biological Neuron**:
1. **Dendrites** receive signals from other neurons
2. **Cell body** processes incoming signals
3. **Axon** transmits output signal if threshold is reached
4. **Synapses** connect to other neurons with varying strengths

**Artificial Neuron**:
1. **Inputs** receive data from previous layer or external sources
2. **Weighted sum** combines inputs with learned weights
3. **Activation function** determines if neuron "fires"
4. **Output** passes to next layer or produces final result

### The Perceptron: Simplest Neural Network

```kroki-plantuml
@startuml
!theme plain
skinparam backgroundColor #FEFEFE
skinparam defaultFontSize 12

rectangle "Simple Perceptron" {
  circle "x₁" as x1
  circle "x₂" as x2
  circle "x₃" as x3
  circle "..." as dots
  circle "xₙ" as xn
  
  rectangle "Σ\n(Weighted Sum)" as sum
  rectangle "Activation\nFunction" as activation
  circle "Output" as output
  
  x1 -right-> sum : w₁
  x2 -right-> sum : w₂
  x3 -right-> sum : w₃
  dots -right-> sum
  xn -right-> sum : wₙ
  
  sum -right-> activation
  activation -right-> output
}

note bottom
  Output = f(w₁x₁ + w₂x₂ + ... + wₙxₙ + bias)
  where f is the activation function
end note

@enduml
```

### Python Implementation: Perceptron from Scratch

```python
import random
import math
from typing import List, Tuple, Callable
from dataclasses import dataclass

@dataclass
class TrainingExample:
    """Represents a training example with inputs and expected output."""
    inputs: List[float]
    expected_output: float

class Perceptron:
    """
    A simple perceptron implementation for binary classification.
    Demonstrates the fundamental concepts of neural learning.
    """
    
    def __init__(self, num_inputs: int, learning_rate: float = 0.1):
        self.learning_rate = learning_rate
        self.weights = [random.uniform(-1, 1) for _ in range(num_inputs)]
        self.bias = random.uniform(-1, 1)
        self.training_history = []
    
    def activation_function(self, x: float) -> float:
        """Step function: returns 1 if x > 0, else 0."""
        return 1.0 if x > 0 else 0.0
    
    def predict(self, inputs: List[float]) -> float:
        """Make a prediction for given inputs."""
        if len(inputs) != len(self.weights):
            raise ValueError(f"Expected {len(self.weights)} inputs, got {len(inputs)}")
        
        ## Calculate weighted sum

        weighted_sum = sum(w * x for w, x in zip(self.weights, inputs)) + self.bias
        
        ## Apply activation function

        return self.activation_function(weighted_sum)
    
    def get_weighted_sum(self, inputs: List[float]) -> float:
        """Get the weighted sum before activation (for tracing)."""
        return sum(w * x for w, x in zip(self.weights, inputs)) + self.bias
    
    def train_single(self, example: TrainingExample) -> float:
        """Train on a single example and return the error."""
        prediction = self.predict(example.inputs)
        error = example.expected_output - prediction
        
        ## Update weights using perceptron learning rule

        for i in range(len(self.weights)):
            self.weights[i] += self.learning_rate * error * example.inputs[i]
        
        ## Update bias

        self.bias += self.learning_rate * error
        
        return abs(error)
    
    def train(self, training_data: List[TrainingExample], epochs: int = 100) -> None:
        """Train the perceptron on the given data."""
        print(f"Training perceptron for {epochs} epochs...")
        
        for epoch in range(epochs):
            total_error = 0
            
            ## Shuffle training data for better learning

            shuffled_data = training_data.copy()
            random.shuffle(shuffled_data)
            
            ## Train on each example

            for example in shuffled_data:
                error = self.train_single(example)
                total_error += error
            
            ## Record training progress

            accuracy = 1 - (total_error / len(training_data))
            self.training_history.append({
                'epoch': epoch + 1,
                'total_error': total_error,
                'accuracy': accuracy
            })
            
            ## Print progress occasionally

            if (epoch + 1) % 20 == 0 or epoch == 0:
                print(f"Epoch {epoch + 1}: Error = {total_error:.2f}, Accuracy = {accuracy:.3f}")
            
            ## Early stopping if perfect accuracy

            if total_error == 0:
                print(f"Perfect accuracy reached at epoch {epoch + 1}!")
                break
        
        print("Training completed!")
    
    def evaluate(self, test_data: List[TrainingExample]) -> float:
        """Evaluate the perceptron on test data."""
        correct = 0
        for example in test_data:
            prediction = self.predict(example.inputs)
            if prediction == example.expected_output:
                correct += 1
        
        return correct / len(test_data)
    
    def trace_prediction(self, inputs: List[float]) -> Dict[str, any]:
        """Trace through a prediction step by step."""
        weighted_sum = self.get_weighted_sum(inputs)
        prediction = self.predict(inputs)
        
        trace = {
            'inputs': inputs,
            'weights': self.weights.copy(),
            'bias': self.bias,
            'weighted_sum': weighted_sum,
            'activation_input': weighted_sum,
            'prediction': prediction,
            'calculation_steps': []
        }
        
        ## Show detailed calculation

        for i, (input_val, weight) in enumerate(zip(inputs, self.weights)):
            trace['calculation_steps'].append(f"w{i+1} × x{i+1} = {weight:.3f} × {input_val:.3f} = {weight * input_val:.3f}")
        
        trace['calculation_steps'].append(f"bias = {self.bias:.3f}")
        trace['calculation_steps'].append(f"weighted_sum = {weighted_sum:.3f}")
        trace['calculation_steps'].append(f"activation({weighted_sum:.3f}) = {prediction}")
        
        return trace

class MultiLayerPerceptron:
    """
    A simple multi-layer perceptron (neural network) implementation.
    Demonstrates how multiple layers can solve non-linear problems.
    """
    
    def __init__(self, layer_sizes: List[int], learning_rate: float = 0.1):
        self.learning_rate = learning_rate
        self.layer_sizes = layer_sizes
        self.weights = []
        self.biases = []
        
        ## Initialize weights and biases for each layer

        for i in range(len(layer_sizes) - 1):
            input_size = layer_sizes[i]
            output_size = layer_sizes[i + 1]
            
            ## Random weights between layers

            layer_weights = [[random.uniform(-1, 1) for _ in range(input_size)] 
                           for _ in range(output_size)]
            layer_biases = [random.uniform(-1, 1) for _ in range(output_size)]
            
            self.weights.append(layer_weights)
            self.biases.append(layer_biases)
    
    def sigmoid(self, x: float) -> float:
        """Sigmoid activation function."""
        try:
            return 1 / (1 + math.exp(-x))
        except OverflowError:
            return 0 if x < 0 else 1
    
    def sigmoid_derivative(self, x: float) -> float:
        """Derivative of sigmoid function."""
        s = self.sigmoid(x)
        return s * (1 - s)
    
    def forward_pass(self, inputs: List[float]) -> Tuple[List[List[float]], List[List[float]]]:
        """Forward pass through the network, returning activations and weighted sums."""
        activations = [inputs]  # Input layer
        weighted_sums = []
        
        current_activation = inputs
        
        for layer_idx in range(len(self.weights)):
            layer_weights = self.weights[layer_idx]
            layer_biases = self.biases[layer_idx]
            
            next_weighted_sums = []
            next_activations = []
            
            for neuron_idx in range(len(layer_weights)):

                ## Calculate weighted sum for this neuron

                weighted_sum = sum(w * a for w, a in zip(layer_weights[neuron_idx], current_activation))
                weighted_sum += layer_biases[neuron_idx]
                
                ## Apply activation function

                activation = self.sigmoid(weighted_sum)
                
                next_weighted_sums.append(weighted_sum)
                next_activations.append(activation)
            
            weighted_sums.append(next_weighted_sums)
            activations.append(next_activations)
            current_activation = next_activations
        
        return activations, weighted_sums
    
    def predict(self, inputs: List[float]) -> List[float]:
        """Make a prediction for given inputs."""
        activations, _ = self.forward_pass(inputs)
        return activations[-1]  # Return output layer activations
    
    def train_single(self, inputs: List[float], expected_outputs: List[float]) -> float:
        """Train on a single example using backpropagation."""

        ## Forward pass

        activations, weighted_sums = self.forward_pass(inputs)
        
        ## Calculate initial error

        output_layer = activations[-1]
        error = sum((expected - actual) ** 2 for expected, actual in zip(expected_outputs, output_layer))
        
        ## Backward pass (backpropagation)

        deltas = []
        
        ## Calculate deltas for output layer

        output_deltas = []
        for i, (expected, actual, weighted_sum) in enumerate(zip(expected_outputs, output_layer, weighted_sums[-1])):
            delta = (expected - actual) * self.sigmoid_derivative(weighted_sum)
            output_deltas.append(delta)
        deltas.append(output_deltas)
        
        ## Calculate deltas for hidden layers (working backwards)

        for layer_idx in range(len(self.weights) - 2, -1, -1):
            layer_deltas = []
            for neuron_idx in range(len(self.weights[layer_idx])):

                ## Sum weighted deltas from next layer

                weighted_error = sum(self.weights[layer_idx + 1][next_neuron][neuron_idx] * deltas[0][next_neuron]
                                   for next_neuron in range(len(self.weights[layer_idx + 1])))
                
                delta = weighted_error * self.sigmoid_derivative(weighted_sums[layer_idx][neuron_idx])
                layer_deltas.append(delta)
            
            deltas.insert(0, layer_deltas)
        
        ## Update weights and biases

        for layer_idx in range(len(self.weights)):
            for neuron_idx in range(len(self.weights[layer_idx])):
                for weight_idx in range(len(self.weights[layer_idx][neuron_idx])):

                    ## Update weight

                    self.weights[layer_idx][neuron_idx][weight_idx] += (
                        self.learning_rate * deltas[layer_idx][neuron_idx] * activations[layer_idx][weight_idx]
                    )
                
                ## Update bias

                self.biases[layer_idx][neuron_idx] += self.learning_rate * deltas[layer_idx][neuron_idx]
        
        return error

## Demonstration Functions

def create_logical_and_dataset() -> List[TrainingExample]:
    """Create dataset for logical AND function."""
    return [
        TrainingExample([0, 0], 0),
        TrainingExample([0, 1], 0),
        TrainingExample([1, 0], 0),
        TrainingExample([1, 1], 1),
    ]

def create_logical_xor_dataset() -> List[TrainingExample]:
    """Create dataset for logical XOR function (non-linearly separable)."""
    return [
        TrainingExample([0, 0], 0),
        TrainingExample([0, 1], 1),
        TrainingExample([1, 0], 1),
        TrainingExample([1, 1], 0),
    ]

def demonstrate_perceptron():
    """Demonstrate single perceptron learning AND function."""
    print("Perceptron Demonstration: Learning AND Function")
    print("=" * 50)
    
    ## Create training data

    training_data = create_logical_and_dataset()
    
    ## Create and train perceptron

    perceptron = Perceptron(num_inputs=2, learning_rate=0.1)
    print(f"Initial weights: {[f'{w:.3f}' for w in perceptron.weights]}")
    print(f"Initial bias: {perceptron.bias:.3f}")
    
    perceptron.train(training_data, epochs=50)
    
    print(f"\nFinal weights: {[f'{w:.3f}' for w in perceptron.weights]}")
    print(f"Final bias: {perceptron.bias:.3f}")
    
    ## Test the trained perceptron

    print(f"\nTesting trained perceptron:")
    for example in training_data:
        prediction = perceptron.predict(example.inputs)
        print(f"Inputs: {example.inputs} → Prediction: {prediction:.0f}, Expected: {example.expected_output}")
    
    ## Trace through one prediction

    print(f"\nTracing prediction for inputs [1, 1]:")
    trace = perceptron.trace_prediction([1, 1])
    for step in trace['calculation_steps']:
        print(f"  {step}")
    
    return perceptron

def demonstrate_mlp():
    """Demonstrate multi-layer perceptron learning XOR function."""
    print("\nMulti-Layer Perceptron Demonstration: Learning XOR Function")
    print("=" * 60)
    
    ## XOR is not linearly separable, so single perceptron can't learn it

    ## But MLP with hidden layer can!
    
    training_data = create_logical_xor_dataset()
    
    ## Create MLP: 2 inputs → 3 hidden neurons → 1 output

    mlp = MultiLayerPerceptron([2, 3, 1], learning_rate=0.5)
    
    print("Training MLP on XOR function...")
    
    ## Train for more epochs since this is harder

    for epoch in range(1000):
        total_error = 0
        for example in training_data:
            error = mlp.train_single(example.inputs, [example.expected_output])
            total_error += error
        
        if epoch % 200 == 0:
            print(f"Epoch {epoch}: Total Error = {total_error:.4f}")
        
        if total_error < 0.01:  # Good enough
            print(f"Converged at epoch {epoch}!")
            break
    
    ## Test the trained MLP

    print(f"\nTesting trained MLP:")
    for example in training_data:
        prediction = mlp.predict(example.inputs)[0]  # Get first output
        binary_prediction = 1 if prediction > 0.5 else 0
        print(f"Inputs: {example.inputs} → Raw: {prediction:.3f}, Binary: {binary_prediction}, Expected: {example.expected_output}")
    
    return mlp

## Run demonstrations

if __name__ == "__main__":
    demo_perceptron = demonstrate_perceptron()
    demo_mlp = demonstrate_mlp()
```

### Understanding Neural Network Learning

Neural networks learn through a process called **backpropagation**:

**Forward Pass**:
1. **Input layer** receives data
2. **Hidden layers** process information through weighted connections
3. **Output layer** produces predictions
4. **Error calculation** compares predictions to expected outputs

**Backward Pass**:
1. **Error propagation** works backwards through layers
2. **Gradient calculation** determines how to adjust weights
3. **Weight updates** improve future predictions
4. **Iterative improvement** repeats until convergence

### Key Neural Network Concepts

**Activation Functions**:

- **Step Function**: Binary output (0 or 1) - used in perceptrons
- **Sigmoid**: Smooth curve between 0 and 1 - good for probabilities
- **ReLU**: Returns input if positive, 0 otherwise - fast and effective
- **Tanh**: Symmetric around 0, outputs between -1 and 1

**Training Concepts**:

- **Learning Rate**: Controls how big steps to take when updating weights
- **Epochs**: Complete passes through all training data
- **Overfitting**: Model memorizes training data but fails on new data
- **Convergence**: When the model stops improving significantly

### Advantages and Limitations of Neural Networks

**Advantages**:

- **Universal approximation**: Can learn any continuous function
- **Non-linear patterns**: Handles complex relationships
- **Adaptive**: Learns from data without explicit programming
- **Parallel processing**: Can be efficiently computed
- **Versatile**: Works for many different types of problems

**Limitations**:

- **Black box**: Difficult to interpret decisions
- **Data hungry**: Needs lots of training examples
- **Computationally expensive**: Requires significant processing power
- **Hyperparameter sensitive**: Many settings need tuning
- **Local minima**: Can get stuck in suboptimal solutions

### Real-World Neural Network Applications

**1. Image Recognition**
```
Input: Pixel values → Hidden Layers: Feature detection → Output: Object classes
```

**2. Language Translation**
```
Input: Source text → Hidden Layers: Meaning representation → Output: Target text
```

**3. Medical Diagnosis**
```
Input: Symptoms/tests → Hidden Layers: Pattern recognition → Output: Diagnosis probability
```

**4. Recommendation Systems**
```
Input: User preferences → Hidden Layers: Similarity analysis → Output: Recommended items
```

---

## Comparing Decision Trees and Neural Networks

| Aspect | Decision Trees | Neural Networks |
|--------|----------------|-----------------|
| **Interpretability** | High - can trace every decision | Low - "black box" behavior |
| **Training Speed** | Fast | Slower, especially deep networks |
| **Data Requirements** | Works with small datasets | Needs large amounts of data |
| **Handling Non-linearity** | Limited to axis-aligned splits | Excellent at complex patterns |
| **Overfitting Risk** | Moderate - can be controlled | High - needs regularization |
| **Feature Engineering** | Minimal required | Automatic feature learning |
| **Real-time Inference** | Very fast | Fast once trained |
| **Maintenance** | Easy to update rules | Requires retraining |

### When to Choose Each Model

**Use Decision Trees When**:
- Interpretability is crucial (regulatory, medical)
- You have mixed data types (categorical + numerical)
- Quick prototyping is needed
- Domain experts need to understand the logic
- Data is limited or rules-based

**Use Neural Networks When**:
- You have large amounts of data
- Pattern complexity is high (images, speech, text)
- Performance is more important than interpretability
- Automatic feature learning is beneficial
- Non-linear relationships dominate

---

## Practice Tasks

### Task 1: Decision Tree Enhancement
Extend the decision tree implementation to handle:
1. Regression problems (predicting continuous values)
2. Missing values in the dataset
3. Pruning to prevent overfitting
4. Feature importance ranking

### Task 2: Neural Network Expansion
Improve the neural network implementation by adding:
1. Different activation functions (ReLU, tanh)
2. Momentum in weight updates
3. Early stopping to prevent overfitting
4. Validation loss tracking

### Task 3: Model Comparison
Create a comparison study that:
1. Tests both models on the same dataset
2. Measures training time, accuracy, and interpretability
3. Analyzes which performs better under different conditions
4. Visualizes decision boundaries (for 2D data)

### Task 4: Real-World Application
Build a complete system that:
1. Uses decision trees for initial filtering/rules
2. Applies neural networks for complex pattern recognition
3. Combines both approaches for best results
4. Provides explanations for high-stakes decisions

---

## Key Takeaways

1. **Model Selection Matters**: Different problems require different approaches - decision trees for interpretability, neural networks for complexity

2. **Trade-offs are Inevitable**: No model is perfect - you must balance accuracy, interpretability, speed, and maintenance

3. **Understanding Fundamentals**: Knowing how models work internally helps with debugging, optimization, and trust

4. **Practical Implementation**: Building models from scratch deepens understanding of algorithms and their limitations

5. **Real-World Considerations**: Production systems often combine multiple approaches and require careful consideration of interpretability, performance, and maintenance

Both decision trees and neural networks form the foundation of modern machine learning. Decision trees provide interpretable, rule-based reasoning that's easy to understand and debug. Neural networks offer powerful pattern recognition capabilities that can handle complex, non-linear relationships. Understanding both approaches gives you the tools to choose the right model for each specific problem and build more effective automation solutions.
