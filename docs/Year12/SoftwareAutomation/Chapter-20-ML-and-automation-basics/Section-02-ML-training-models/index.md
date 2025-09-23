# 20.2 ML training models: supervised, unsupervised, semi, reinforcement

## Understanding ML Training Paradigms

!!! builds-on "Builds on"
    This section builds on [20.1 What is AI vs ML (and where RPA/BPA fit)](../Section-01-What-is-AI-vs-ML/index.md).


Machine Learning is fundamentally about learning patterns from data, but the way this learning happens depends on the type of data available and the problem we're trying to solve. Understanding the four main training paradigms is crucial for:

- **Problem Classification**: Determining which approach fits your data and goals

- **Data Requirements**: Understanding what type and amount of data you need

- **Evaluation Strategy**: Knowing how to measure success for each paradigm

- **Resource Planning**: Estimating computational and time requirements

This section explores each training paradigm with practical Python examples, helping you choose the right approach for specific automation and ML challenges.

---

## 1. Supervised Learning

### What is Supervised Learning?

**Definition**: Supervised learning trains models using labeled datasets, where both input features and correct outputs (labels) are provided during training.

**Key Characteristics**:

- **Labeled Data**: Every training example has a known correct answer

- **Prediction Goal**: Learn to predict labels for new, unseen data

- **Clear Evaluation**: Easy to measure accuracy by comparing predictions to true labels

- **Common Applications**: Classification (categories) and regression (continuous values)

### When to Use Supervised Learning

**Best For**:

- Email spam detection (spam/not spam labels)

- Medical diagnosis (symptoms → diagnosis)

- Price prediction (features → price)

- Image recognition (image → object type)

- Customer behavior prediction (features → purchase/no purchase)

**Data Requirements**:

- Large volume of labeled examples

- High-quality, accurate labels

- Representative samples of all scenarios

- Balanced representation of different classes

### Python Example: Supervised Learning

```python
import numpy as np
import random
import statistics
from typing import List, Tuple, Dict
from dataclasses import dataclass
from datetime import datetime

@dataclass
class LabeledExample:
    """A single training example with features and label."""
    features: List[float]
    label: str
    
@dataclass
class TrainingResult:
    """Results from training a supervised model."""
    model_accuracy: float
    training_time: float
    model_parameters: Dict
    predictions_made: int

class SupervisedLearningDemo:
    """
    Demonstrates supervised learning with a simple email spam classifier.
    Uses labeled examples to learn patterns for classification.
    """
    
    def __init__(self):
        self.model_weights = {}
        self.feature_names = [
            'word_count', 'exclamation_marks', 'capital_letters_ratio', 
            'suspicious_words', 'link_count', 'sender_reputation'
        ]
        self.is_trained = False
        self.training_history = []
    
    def create_training_data(self, num_examples: int = 1000) -> List[LabeledExample]:
        """Generate synthetic email data with spam/not_spam labels."""
        training_data = []
        
        print(f"Creating {num_examples} labeled training examples...")
        
        for i in range(num_examples):
            # Randomly decide if this email is spam (40% spam rate)
            is_spam = random.random() < 0.4
            
            if is_spam:
                # Spam emails tend to have certain characteristics
                features = [
                    random.randint(50, 300),           # word_count (shorter)
                    random.randint(3, 15),             # exclamation_marks (more)
                    random.uniform(0.3, 0.8),          # capital_letters_ratio (higher)
                    random.randint(2, 10),             # suspicious_words (more)
                    random.randint(1, 8),              # link_count (more links)
                    random.uniform(0.1, 0.4)           # sender_reputation (lower)
                ]
                label = 'spam'
            else:
                # Normal emails have different characteristics
                features = [
                    random.randint(100, 800),          # word_count (longer)
                    random.randint(0, 3),              # exclamation_marks (fewer)
                    random.uniform(0.05, 0.25),        # capital_letters_ratio (lower)
                    random.randint(0, 2),              # suspicious_words (fewer)
                    random.randint(0, 3),              # link_count (fewer links)
                    random.uniform(0.6, 1.0)           # sender_reputation (higher)
                ]
                label = 'not_spam'
            
            training_data.append(LabeledExample(features, label))
        
        # Print data distribution
        spam_count = sum(1 for ex in training_data if ex.label == 'spam')
        print(f"Training data created: {spam_count} spam, {len(training_data) - spam_count} not spam")
        
        return training_data
    
    def train_model(self, training_data: List[LabeledExample]) -> TrainingResult:
        """Train supervised model using labeled examples."""
        start_time = datetime.now()
        print("Training supervised learning model...")
        
        # Simple approach: calculate average feature values for each class
        spam_features = []
        not_spam_features = []
        
        for example in training_data:
            if example.label == 'spam':
                spam_features.append(example.features)
            else:
                not_spam_features.append(example.features)
        
        # Calculate mean feature values for each class
        self.model_weights = {
            'spam_means': [],
            'not_spam_means': [],
            'thresholds': []
        }
        
        for feature_idx in range(len(self.feature_names)):
            spam_values = [features[feature_idx] for features in spam_features]
            not_spam_values = [features[feature_idx] for features in not_spam_features]
            
            spam_mean = statistics.mean(spam_values)
            not_spam_mean = statistics.mean(not_spam_values)
            threshold = (spam_mean + not_spam_mean) / 2
            
            self.model_weights['spam_means'].append(spam_mean)
            self.model_weights['not_spam_means'].append(not_spam_mean)
            self.model_weights['thresholds'].append(threshold)
        
        self.is_trained = True
        
        # Evaluate on training data
        correct_predictions = 0
        for example in training_data:
            prediction = self.predict(example.features)
            if prediction == example.label:
                correct_predictions += 1
        
        accuracy = correct_predictions / len(training_data)
        training_time = (datetime.now() - start_time).total_seconds()
        
        result = TrainingResult(
            model_accuracy=accuracy,
            training_time=training_time,
            model_parameters=self.model_weights.copy(),
            predictions_made=len(training_data)
        )
        
        self.training_history.append(result)
        
        print(f"Training complete! Accuracy: {accuracy:.2%}, Time: {training_time:.2f}s")
        return result
    
    def predict(self, features: List[float]) -> str:
        """Make prediction for new email based on learned patterns."""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Simple classification: compare features to learned patterns
        spam_score = 0
        not_spam_score = 0
        
        for i, feature_value in enumerate(features):
            spam_mean = self.model_weights['spam_means'][i]
            not_spam_mean = self.model_weights['not_spam_means'][i]
            
            # Distance from each class mean (closer = higher score)
            spam_distance = abs(feature_value - spam_mean)
            not_spam_distance = abs(feature_value - not_spam_mean)
            
            # Closer to spam mean = higher spam score
            if spam_distance < not_spam_distance:
                spam_score += 1
            else:
                not_spam_score += 1
        
        return 'spam' if spam_score > not_spam_score else 'not_spam'
    
    def evaluate_model(self, test_data: List[LabeledExample]) -> Dict[str, float]:
        """Evaluate model performance on test data."""
        if not test_data:
            return {'accuracy': 0.0, 'precision': 0.0, 'recall': 0.0}
        
        true_positives = false_positives = true_negatives = false_negatives = 0
        
        for example in test_data:
            prediction = self.predict(example.features)
            actual = example.label
            
            if prediction == 'spam' and actual == 'spam':
                true_positives += 1
            elif prediction == 'spam' and actual == 'not_spam':
                false_positives += 1
            elif prediction == 'not_spam' and actual == 'not_spam':
                true_negatives += 1
            else:  # prediction == 'not_spam' and actual == 'spam'
                false_negatives += 1
        
        accuracy = (true_positives + true_negatives) / len(test_data)
        precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
        recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'true_positives': true_positives,
            'false_positives': false_positives,
            'true_negatives': true_negatives,
            'false_negatives': false_negatives
        }

# Demonstration
def demonstrate_supervised_learning():
    """Demonstrate supervised learning with email classification."""
    print("Supervised Learning Demonstration")
    print("=" * 40)
    
    classifier = SupervisedLearningDemo()
    
    # Create training data
    training_data = classifier.create_training_data(800)
    test_data = classifier.create_training_data(200)
    
    # Train the model
    training_result = classifier.train_model(training_data)
    
    # Evaluate on test data
    print(f"\nEvaluating on {len(test_data)} test examples...")
    evaluation = classifier.evaluate_model(test_data)
    
    print(f"Test Results:")
    print(f"  Accuracy: {evaluation['accuracy']:.2%}")
    print(f"  Precision: {evaluation['precision']:.2%}")
    print(f"  Recall: {evaluation['recall']:.2%}")
    
    # Test with specific examples
    print(f"\nTesting specific examples:")
    
    # Obvious spam example
    spam_features = [80, 8, 0.6, 5, 4, 0.2]  # Short, lots of !, caps, suspicious words, links, bad reputation
    prediction = classifier.predict(spam_features)
    print(f"Obvious spam features: {prediction}")
    
    # Normal email example
    normal_features = [400, 1, 0.1, 0, 1, 0.9]  # Longer, few !, normal caps, no suspicious words, good reputation
    prediction = classifier.predict(normal_features)
    print(f"Normal email features: {prediction}")
    
    return classifier, evaluation

if __name__ == "__main__":
    demo_classifier, results = demonstrate_supervised_learning()

```

---

## 2. Unsupervised Learning

### What is Unsupervised Learning?

**Definition**: Unsupervised learning finds hidden patterns in data without labeled examples, discovering structure that wasn't explicitly provided.

**Key Characteristics**:

- **No Labels**: Only input features, no "correct answers"

- **Pattern Discovery**: Finds hidden relationships, groups, or structures

- **Exploratory**: Often used to understand data before other analysis

- **Evaluation Challenges**: Success is harder to measure objectively

### When to Use Unsupervised Learning

**Best For**:

- Customer segmentation (group similar customers)

- Market research (find buyer patterns)

- Anomaly detection (identify unusual behavior)

- Data compression (find key features)

- Recommendation systems (group similar items)

**Data Requirements**:

- Large amounts of unlabeled data

- Multiple features/dimensions

- Clean, consistent data format

- Sufficient variety to find meaningful patterns

### Python Example: Unsupervised Learning

```python
import math
import random
from typing import List, Dict, Tuple
from dataclasses import dataclass

@dataclass
class CustomerData:
    """Customer data point for clustering analysis."""
    customer_id: str
    features: List[float]  # age, income, spending_score, online_activity
    cluster: int = -1  # Will be assigned during clustering

class UnsupervisedLearningDemo:
    """
    Demonstrates unsupervised learning with customer segmentation using clustering.
    Finds groups of similar customers without knowing the groups ahead of time.
    """
    
    def __init__(self, num_clusters: int = 3):
        self.num_clusters = num_clusters
        self.cluster_centers = []
        self.is_trained = False
        self.feature_names = ['age', 'income', 'spending_score', 'online_activity']
    
    def create_customer_data(self, num_customers: int = 500) -> List[CustomerData]:
        """Generate synthetic customer data for clustering."""
        customers = []
        
        print(f"Creating {num_customers} customer data points...")
        
        for i in range(num_customers):
            # Create different types of customers with natural groupings
            customer_type = random.choice(['young_tech', 'middle_family', 'senior_conservative'])
            
            if customer_type == 'young_tech':
                # Young, tech-savvy customers
                age = random.randint(22, 35)
                income = random.randint(40000, 80000)
                spending_score = random.randint(70, 95)
                online_activity = random.randint(80, 100)
            elif customer_type == 'middle_family':
                # Middle-aged family customers
                age = random.randint(35, 55)
                income = random.randint(60000, 120000)
                spending_score = random.randint(40, 70)
                online_activity = random.randint(30, 60)
            else:  # senior_conservative
                # Senior, conservative customers
                age = random.randint(55, 75)
                income = random.randint(30000, 90000)
                spending_score = random.randint(20, 50)
                online_activity = random.randint(10, 40)
            
            features = [age, income, spending_score, online_activity]
            customers.append(CustomerData(f"customer_{i:04d}", features))
        
        print(f"Customer data created with natural groupings")
        return customers
    
    def normalize_features(self, customers: List[CustomerData]) -> List[CustomerData]:
        """Normalize features to same scale for better clustering."""
        if not customers:
            return customers
        
        # Calculate min/max for each feature
        num_features = len(customers[0].features)
        feature_mins = [float('inf')] * num_features
        feature_maxs = [float('-inf')] * num_features
        
        for customer in customers:
            for i, value in enumerate(customer.features):
                feature_mins[i] = min(feature_mins[i], value)
                feature_maxs[i] = max(feature_maxs[i], value)
        
        # Normalize to 0-1 range
        normalized_customers = []
        for customer in customers:
            normalized_features = []
            for i, value in enumerate(customer.features):
                range_val = feature_maxs[i] - feature_mins[i]
                if range_val > 0:
                    normalized_value = (value - feature_mins[i]) / range_val
                else:
                    normalized_value = 0
                normalized_features.append(normalized_value)
            
            normalized_customers.append(CustomerData(
                customer.customer_id, 
                normalized_features,
                customer.cluster
            ))
        
        return normalized_customers
    
    def calculate_distance(self, point1: List[float], point2: List[float]) -> float:
        """Calculate Euclidean distance between two points."""
        if len(point1) != len(point2):
            raise ValueError("Points must have same number of dimensions")
        
        sum_squared_differences = sum((a - b) ** 2 for a, b in zip(point1, point2))
        return math.sqrt(sum_squared_differences)
    
    def k_means_clustering(self, customers: List[CustomerData], max_iterations: int = 100) -> List[CustomerData]:
        """Perform K-means clustering to find customer segments."""
        print(f"Starting K-means clustering with {self.num_clusters} clusters...")
        
        # Initialize cluster centers randomly
        self.cluster_centers = []
        for _ in range(self.num_clusters):
            center = [random.random() for _ in range(len(customers[0].features))]
            self.cluster_centers.append(center)
        
        iteration = 0
        converged = False
        
        while iteration < max_iterations and not converged:
            # Assign each customer to nearest cluster
            for customer in customers:
                distances = []
                for center in self.cluster_centers:
                    distance = self.calculate_distance(customer.features, center)
                    distances.append(distance)
                
                # Assign to closest cluster
                closest_cluster = distances.index(min(distances))
                customer.cluster = closest_cluster
            
            # Update cluster centers
            new_centers = []
            for cluster_id in range(self.num_clusters):
                # Find all customers in this cluster
                cluster_customers = [c for c in customers if c.cluster == cluster_id]
                
                if cluster_customers:
                    # Calculate mean position
                    num_features = len(cluster_customers[0].features)
                    new_center = []
                    for feature_idx in range(num_features):
                        feature_values = [c.features[feature_idx] for c in cluster_customers]
                        mean_value = sum(feature_values) / len(feature_values)
                        new_center.append(mean_value)
                    new_centers.append(new_center)
                else:
                    # Keep old center if no customers assigned
                    new_centers.append(self.cluster_centers[cluster_id])
            
            # Check for convergence
            converged = True
            for old_center, new_center in zip(self.cluster_centers, new_centers):
                if self.calculate_distance(old_center, new_center) > 0.001:
                    converged = False
                    break
            
            self.cluster_centers = new_centers
            iteration += 1
            
            print(f"Iteration {iteration}: Cluster centers updated")
        
        self.is_trained = True
        print(f"Clustering complete after {iteration} iterations")
        
        return customers
    
    def analyze_clusters(self, customers: List[CustomerData]) -> Dict[int, Dict]:
        """Analyze the discovered customer clusters."""
        if not self.is_trained:
            raise ValueError("Must perform clustering before analysis")
        
        cluster_analysis = {}
        
        for cluster_id in range(self.num_clusters):
            cluster_customers = [c for c in customers if c.cluster == cluster_id]
            
            if not cluster_customers:
                continue
            
            # Calculate cluster statistics
            num_features = len(cluster_customers[0].features)
            feature_means = []
            feature_stds = []
            
            for feature_idx in range(num_features):
                values = [c.features[feature_idx] for c in cluster_customers]
                mean_val = sum(values) / len(values)
                variance = sum((x - mean_val) ** 2 for x in values) / len(values)
                std_val = math.sqrt(variance)
                
                feature_means.append(mean_val)
                feature_stds.append(std_val)
            
            cluster_analysis[cluster_id] = {
                'size': len(cluster_customers),
                'percentage': len(cluster_customers) / len(customers) * 100,
                'feature_means': dict(zip(self.feature_names, feature_means)),
                'feature_stds': dict(zip(self.feature_names, feature_stds)),
                'center': self.cluster_centers[cluster_id]
            }
        
        return cluster_analysis
    
    def predict_cluster(self, new_customer_features: List[float]) -> int:
        """Predict which cluster a new customer belongs to."""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        distances = []
        for center in self.cluster_centers:
            distance = self.calculate_distance(new_customer_features, center)
            distances.append(distance)
        
        return distances.index(min(distances))

# Demonstration
def demonstrate_unsupervised_learning():
    """Demonstrate unsupervised learning with customer segmentation."""
    print("Unsupervised Learning Demonstration")
    print("=" * 42)
    
    # Create clustering model
    clusterer = UnsupervisedLearningDemo(num_clusters=3)
    
    # Generate customer data
    customers = clusterer.create_customer_data(300)
    
    # Normalize features for better clustering
    normalized_customers = clusterer.normalize_features(customers)
    
    # Perform clustering
    clustered_customers = clusterer.k_means_clustering(normalized_customers)
    
    # Analyze discovered clusters
    analysis = clusterer.analyze_clusters(clustered_customers)
    
    print(f"\nCluster Analysis Results:")
    print("=" * 30)
    
    for cluster_id, stats in analysis.items():
        print(f"\nCluster {cluster_id}: {stats['size']} customers ({stats['percentage']:.1f}%)")
        print(f"Characteristics (normalized):")
        for feature_name, mean_val in stats['feature_means'].items():
            print(f"  {feature_name}: {mean_val:.3f}")
        
        # Interpret cluster based on patterns
        age_norm = stats['feature_means']['age']
        income_norm = stats['feature_means']['income']
        spending_norm = stats['feature_means']['spending_score']
        online_norm = stats['feature_means']['online_activity']
        
        if age_norm < 0.3 and online_norm > 0.7:
            interpretation = "Young, tech-savvy customers"
        elif age_norm > 0.7 and online_norm < 0.4:
            interpretation = "Senior, traditional customers"
        else:
            interpretation = "Middle-aged, moderate customers"
        
        print(f"  Interpretation: {interpretation}")
    
    # Test prediction for new customer
    print(f"\nTesting new customer prediction:")
    new_customer = [0.2, 0.6, 0.8, 0.9]  # Young, moderate income, high spending, very online
    predicted_cluster = clusterer.predict_cluster(new_customer)
    print(f"New customer features (normalized): {new_customer}")
    print(f"Predicted cluster: {predicted_cluster}")
    
    return clusterer, analysis

if __name__ == "__main__":
    demo_clusterer, cluster_results = demonstrate_unsupervised_learning()

```

---

## 3. Semi-Supervised Learning

### What is Semi-Supervised Learning?

**Definition**: Semi-supervised learning combines small amounts of labeled data with large amounts of unlabeled data to improve learning performance beyond what either approach could achieve alone.

**Key Characteristics**:

- **Mixed Data**: Small labeled dataset + large unlabeled dataset

- **Best of Both**: Leverages supervision and pattern discovery

- **Cost Effective**: Reduces labeling requirements

- **Common Reality**: Many real-world scenarios have this data structure

### When to Use Semi-Supervised Learning

**Best For**:

- Medical imaging (few expert-labeled images, many unlabeled scans)

- Social media analysis (some labeled posts, millions unlabeled)

- Fraud detection (few confirmed cases, lots of transaction data)

- Natural language processing (limited labeled text, vast unlabeled corpus)

- Quality control (few labeled defects, many production samples)

**Data Requirements**:

- Small but high-quality labeled dataset

- Large volume of unlabeled data from same domain

- Assumption that unlabeled data follows similar patterns

- Sufficient computational resources for iterative learning

### Python Example: Semi-Supervised Learning

```python
import random
import statistics
from typing import List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class SemiSupervisedExample:
    """Example that may or may not have a label."""
    features: List[float]
    label: Optional[str] = None
    confidence: float = 0.0

class SemiSupervisedLearningDemo:
    """
    Demonstrates semi-supervised learning for document classification.
    Uses a small set of labeled documents plus many unlabeled documents
    to build a better classifier than either alone could achieve.
    """
    
    def __init__(self):
        self.model_weights = {}
        self.feature_names = ['doc_length', 'technical_words', 'formal_language', 'citation_count']
        self.confidence_threshold = 0.7
        self.is_trained = False
    
    def create_mixed_dataset(self, labeled_count: int = 50, unlabeled_count: int = 500) -> List[SemiSupervisedExample]:
        """Create dataset with small labeled portion and large unlabeled portion."""
        dataset = []
        
        print(f"Creating dataset: {labeled_count} labeled + {unlabeled_count} unlabeled examples")
        
        # Create labeled examples (expensive to obtain)
        for i in range(labeled_count):
            doc_type = random.choice(['research', 'news', 'blog'])
            
            if doc_type == 'research':
                features = [
                    random.randint(3000, 8000),        # doc_length (long)
                    random.randint(50, 150),           # technical_words (many)
                    random.uniform(0.7, 1.0),          # formal_language (high)
                    random.randint(15, 50)             # citation_count (many)
                ]
                label = 'academic'
            elif doc_type == 'news':
                features = [
                    random.randint(500, 2000),         # doc_length (medium)
                    random.randint(10, 40),            # technical_words (some)
                    random.uniform(0.5, 0.8),          # formal_language (medium)
                    random.randint(0, 5)               # citation_count (few)
                ]
                label = 'news'
            else:  # blog
                features = [
                    random.randint(200, 1000),         # doc_length (short)
                    random.randint(0, 15),             # technical_words (few)
                    random.uniform(0.1, 0.5),          # formal_language (low)
                    random.randint(0, 2)               # citation_count (rare)
                ]
                label = 'informal'
            
            dataset.append(SemiSupervisedExample(features, label))
        
        # Create unlabeled examples (cheap to obtain)
        for i in range(unlabeled_count):
            # Generate features following similar patterns but without labels
            doc_type = random.choice(['research', 'news', 'blog'])
            
            if doc_type == 'research':
                features = [
                    random.randint(3000, 8000),
                    random.randint(50, 150),
                    random.uniform(0.7, 1.0),
                    random.randint(15, 50)
                ]
            elif doc_type == 'news':
                features = [
                    random.randint(500, 2000),
                    random.randint(10, 40),
                    random.uniform(0.5, 0.8),
                    random.randint(0, 5)
                ]
            else:  # blog
                features = [
                    random.randint(200, 1000),
                    random.randint(0, 15),
                    random.uniform(0.1, 0.5),
                    random.randint(0, 2)
                ]
            
            # No label provided (this is what makes it semi-supervised)
            dataset.append(SemiSupervisedExample(features, None))
        
        labeled_examples = sum(1 for ex in dataset if ex.label is not None)
        print(f"Dataset created: {labeled_examples} labeled, {len(dataset) - labeled_examples} unlabeled")
        
        return dataset
    
    def train_initial_model(self, labeled_examples: List[SemiSupervisedExample]) -> None:
        """Train initial model using only labeled examples."""
        print("Training initial model on labeled data...")
        
        # Group examples by label
        label_groups = {}
        for example in labeled_examples:
            if example.label not in label_groups:
                label_groups[example.label] = []
            label_groups[example.label].append(example.features)
        
        # Calculate mean features for each label
        self.model_weights = {}
        for label, feature_lists in label_groups.items():
            means = []
            for feature_idx in range(len(self.feature_names)):
                values = [features[feature_idx] for features in feature_lists]
                means.append(statistics.mean(values))
            self.model_weights[label] = means
        
        print(f"Initial model trained on {len(labeled_examples)} labeled examples")
        print(f"Labels learned: {list(self.model_weights.keys())}")
    
    def predict_with_confidence(self, features: List[float]) -> Tuple[str, float]:
        """Make prediction and return confidence score."""
        if not self.model_weights:
            raise ValueError("Model must be trained first")
        
        # Calculate distances to each class centroid
        distances = {}
        for label, centroid in self.model_weights.items():
            distance = sum((f - c) ** 2 for f, c in zip(features, centroid)) ** 0.5
            distances[label] = distance
        
        # Closest class wins
        predicted_label = min(distances, key=distances.get)
        closest_distance = distances[predicted_label]
        
        # Convert distance to confidence (closer = higher confidence)
        all_distances = list(distances.values())
        max_distance = max(all_distances)
        
        if max_distance > 0:
            confidence = 1.0 - (closest_distance / max_distance)
        else:
            confidence = 1.0
        
        return predicted_label, confidence
    
    def semi_supervised_training(self, dataset: List[SemiSupervisedExample], iterations: int = 5) -> None:
        """Perform iterative semi-supervised learning."""
        print(f"Starting semi-supervised training for {iterations} iterations...")
        
        # Start with labeled examples only
        labeled_examples = [ex for ex in dataset if ex.label is not None]
        unlabeled_examples = [ex for ex in dataset if ex.label is None]
        
        self.train_initial_model(labeled_examples)
        
        for iteration in range(iterations):
            print(f"\nIteration {iteration + 1}:")
            
            # Predict labels for unlabeled examples
            high_confidence_predictions = []
            
            for example in unlabeled_examples:
                predicted_label, confidence = self.predict_with_confidence(example.features)
                
                # If confidence is high enough, treat as labeled data
                if confidence >= self.confidence_threshold:
                    pseudo_labeled_example = SemiSupervisedExample(
                        example.features, 
                        predicted_label, 
                        confidence
                    )
                    high_confidence_predictions.append(pseudo_labeled_example)
            
            print(f"  High-confidence predictions: {len(high_confidence_predictions)}")
            
            if not high_confidence_predictions:
                print("  No high-confidence predictions - stopping early")
                break
            
            # Retrain model with original labeled data + high-confidence predictions
            combined_labeled = labeled_examples + high_confidence_predictions
            self.train_initial_model(combined_labeled)
            
            # Show confidence distribution
            confidences = [ex.confidence for ex in high_confidence_predictions]
            if confidences:
                avg_confidence = statistics.mean(confidences)
                print(f"  Average confidence: {avg_confidence:.3f}")
        
        self.is_trained = True
        print("Semi-supervised training complete!")
    
    def evaluate_semi_supervised(self, test_data: List[SemiSupervisedExample]) -> Dict[str, float]:
        """Evaluate the semi-supervised model."""
        if not self.is_trained:
            raise ValueError("Model must be trained first")
        
        correct_predictions = 0
        total_predictions = 0
        
        for example in test_data:
            if example.label is not None:  # Only evaluate on labeled test data
                predicted_label, confidence = self.predict_with_confidence(example.features)
                if predicted_label == example.label:
                    correct_predictions += 1
                total_predictions += 1
        
        accuracy = correct_predictions / total_predictions if total_predictions > 0 else 0
        
        return {
            'accuracy': accuracy,
            'correct': correct_predictions,
            'total': total_predictions
        }

# Demonstration
def demonstrate_semi_supervised_learning():
    """Demonstrate semi-supervised learning for document classification."""
    print("Semi-Supervised Learning Demonstration")
    print("=" * 45)
    
    # Create semi-supervised learning system
    semi_learner = SemiSupervisedLearningDemo()
    
    # Create mixed dataset (small labeled + large unlabeled)
    training_data = semi_learner.create_mixed_dataset(labeled_count=30, unlabeled_count=200)
    test_data = semi_learner.create_mixed_dataset(labeled_count=50, unlabeled_count=0)  # All labeled for testing
    
    # Compare supervised vs semi-supervised approaches
    print(f"\nComparison: Supervised vs Semi-Supervised")
    print("-" * 50)
    
    # Supervised baseline (labeled data only)
    labeled_only = [ex for ex in training_data if ex.label is not None]
    semi_learner.train_initial_model(labeled_only)
    supervised_results = semi_learner.evaluate_semi_supervised(test_data)
    
    print(f"Supervised only (labeled data): {supervised_results['accuracy']:.2%} accuracy")
    
    # Semi-supervised approach
    semi_learner.semi_supervised_training(training_data, iterations=3)
    semi_supervised_results = semi_learner.evaluate_semi_supervised(test_data)
    
    print(f"Semi-supervised approach: {semi_supervised_results['accuracy']:.2%} accuracy")
    
    improvement = semi_supervised_results['accuracy'] - supervised_results['accuracy']
    print(f"Improvement: {improvement:.2%}")
    
    # Test specific examples
    print(f"\nTesting specific document types:")
    
    # Academic paper
    academic_features = [5000, 80, 0.9, 25]
    pred_label, confidence = semi_learner.predict_with_confidence(academic_features)
    print(f"Academic paper features: {pred_label} (confidence: {confidence:.2%})")
    
    # Blog post
    blog_features = [400, 5, 0.3, 0]
    pred_label, confidence = semi_learner.predict_with_confidence(blog_features)
    print(f"Blog post features: {pred_label} (confidence: {confidence:.2%})")
    
    return semi_learner, improvement

if __name__ == "__main__":
    demo_learner, accuracy_gain = demonstrate_semi_supervised_learning()

```

---

## 4. Reinforcement Learning

### What is Reinforcement Learning?

**Definition**: Reinforcement learning trains agents to make sequences of decisions by learning from rewards and penalties received from environment interactions.

**Key Characteristics**:

- **Agent-Environment Interaction**: Learning through trial and error

- **Reward-Based**: Feedback comes from success/failure signals

- **Sequential Decisions**: Actions affect future opportunities

- **Delayed Feedback**: Rewards may come long after actions

### When to Use Reinforcement Learning

**Best For**:

- Game playing (chess, Go, video games)

- Robotics control (walking, manipulation)

- Trading algorithms (buy/sell decisions)

- Resource management (traffic control, scheduling)

- Autonomous vehicles (navigation decisions)

**Data Requirements**:

- Environment that provides feedback

- Clear reward/penalty structure

- Ability to take actions and observe results

- Computational resources for exploration

### Python Example: Reinforcement Learning

```python
import random
import statistics
from typing import Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum

class Action(Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

@dataclass
class TradingState:
    """Current state of the trading environment."""
    market_trend: str  # 'up', 'down', 'stable'
    volatility: str    # 'low', 'medium', 'high'
    portfolio_value: float

@dataclass
class Experience:
    """Single experience tuple for learning."""
    state: TradingState
    action: Action
    reward: float
    next_state: TradingState

class ReinforcementLearningDemo:
    """
    Demonstrates reinforcement learning with a simple trading agent
    that learns optimal investment strategies through trial and error.
    """
    
    def __init__(self, learning_rate: float = 0.1, exploration_rate: float = 0.3):
        self.learning_rate = learning_rate
        self.exploration_rate = exploration_rate
        self.q_table = {}  # Q-values for state-action pairs
        self.experience_history = []
        self.episode_rewards = []
    
    def get_state_key(self, state: TradingState) -> str:
        """Convert state to string key for Q-table."""
        return f"{state.market_trend}_{state.volatility}_{state.portfolio_value//1000:.0f}k"
    
    def initialize_q_values(self, state_key: str) -> None:
        """Initialize Q-values for a new state."""
        if state_key not in self.q_table:
            self.q_table[state_key] = {action: 0.0 for action in Action}
    
    def choose_action(self, state: TradingState, training: bool = True) -> Action:
        """Choose action using epsilon-greedy strategy."""
        state_key = self.get_state_key(state)
        self.initialize_q_values(state_key)
        
        # Exploration vs exploitation
        if training and random.random() < self.exploration_rate:
            # Explore: random action
            return random.choice(list(Action))
        else:
            # Exploit: best known action
            q_values = self.q_table[state_key]
            best_action = max(q_values, key=q_values.get)
            return best_action
    
    def calculate_reward(self, action: Action, state: TradingState, next_state: TradingState) -> float:
        """Calculate reward based on action and market outcomes."""
        # Calculate portfolio change
        portfolio_change = next_state.portfolio_value - state.portfolio_value
        base_reward = portfolio_change / state.portfolio_value  # Percentage change
        
        # Adjust reward based on action appropriateness
        if state.market_trend == 'up':
            # Reward aggressive actions in up markets
            if action == Action.AGGRESSIVE:
                return base_reward * 1.2
            elif action == Action.CONSERVATIVE:
                return base_reward * 0.8
        elif state.market_trend == 'down':
            # Reward conservative actions in down markets
            if action == Action.CONSERVATIVE:
                return base_reward * 1.2
            elif action == Action.AGGRESSIVE:
                return base_reward * 0.5  # Penalty for risky moves in bad markets
        
        # Volatility considerations
        if state.volatility == 'high' and action == Action.AGGRESSIVE:
            return base_reward * 0.7  # Penalty for high risk in volatile times
        
        return base_reward
    
    def update_q_value(self, experience: Experience) -> None:
        """Update Q-value using Q-learning algorithm."""
        state_key = self.get_state_key(experience.state)
        next_state_key = self.get_state_key(experience.next_state)
        
        self.initialize_q_values(state_key)
        self.initialize_q_values(next_state_key)
        
        # Q-learning update: Q(s,a) = Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]
        current_q = self.q_table[state_key][experience.action]
        max_next_q = max(self.q_table[next_state_key].values())
        discount_factor = 0.9  # How much we value future rewards
        
        new_q = current_q + self.learning_rate * (
            experience.reward + discount_factor * max_next_q - current_q
        )
        
        self.q_table[state_key][experience.action] = new_q
    
    def create_random_market_state(self) -> TradingState:
        """Generate random market conditions."""
        trends = ['up', 'down', 'stable']
        volatilities = ['low', 'medium', 'high']
        
        trend = random.choice(trends)
        volatility = random.choice(volatilities)
        
        # Portfolio value between 10k and 100k
        portfolio_value = random.uniform(10000, 100000)
        
        return TradingState(trend, volatility, portfolio_value)
    
    def simulate_market_response(self, action: Action, state: TradingState) -> TradingState:
        """Simulate how the market responds to our action."""
        # Base market movement
        if state.market_trend == 'up':
            base_return = random.uniform(0.02, 0.08)  # 2-8% gain
        elif state.market_trend == 'down':
            base_return = random.uniform(-0.08, -0.02)  # 2-8% loss
        else:  # stable
            base_return = random.uniform(-0.02, 0.02)  # -2% to +2%
        
        # Volatility affects the range
        if state.volatility == 'high':
            base_return *= random.uniform(0.5, 2.0)  # More extreme outcomes
        elif state.volatility == 'low':
            base_return *= random.uniform(0.8, 1.2)  # More stable outcomes
        
        # Action affects exposure to market movement
        if action == Action.AGGRESSIVE:
            exposure = 1.5  # Amplified gains/losses
        elif action == Action.CONSERVATIVE:
            exposure = 0.5  # Reduced gains/losses
        else:  # moderate
            exposure = 1.0  # Normal exposure
        
        portfolio_return = base_return * exposure
        new_portfolio_value = state.portfolio_value * (1 + portfolio_return)
        
        # Generate new market state
        new_state = self.create_random_market_state()
        new_state.portfolio_value = new_portfolio_value
        
        return new_state
    
    def train_agent(self, episodes: int = 1000, steps_per_episode: int = 10) -> None:
        """Train the RL agent through market episodes."""
        print(f"Training RL agent for {episodes} episodes...")
        
        for episode in range(episodes):
            episode_reward = 0
            current_state = self.create_random_market_state()
            
            for step in range(steps_per_episode):
                # Choose and execute action
                action = self.choose_action(current_state, training=True)
                next_state = self.simulate_market_response(action, current_state)
                
                # Calculate reward and update Q-values
                reward = self.calculate_reward(action, current_state, next_state)
                
                experience = Experience(current_state, action, reward, next_state)
                self.update_q_value(experience)
                self.experience_history.append(experience)
                
                episode_reward += reward
                current_state = next_state
            
            self.episode_rewards.append(episode_reward)
            
            # Decay exploration rate over time
            if episode % 100 == 0:
                self.exploration_rate *= 0.95
                avg_reward = statistics.mean(self.episode_rewards[-100:])
                print(f"Episode {episode}: Average reward: {avg_reward:.4f}, Exploration: {self.exploration_rate:.3f}")
        
        print("Training complete!")
    
    def evaluate_agent(self, episodes: int = 100) -> Dict[str, float]:
        """Evaluate trained agent performance."""
        print(f"Evaluating agent over {episodes} episodes...")
        
        total_rewards = []
        action_counts = {action: 0 for action in Action}
        
        for episode in range(episodes):
            episode_reward = 0
            current_state = self.create_random_market_state()
            
            for step in range(10):  # 10 steps per episode
                action = self.choose_action(current_state, training=False)  # No exploration
                next_state = self.simulate_market_response(action, current_state)
                reward = self.calculate_reward(action, current_state, next_state)
                
                episode_reward += reward
                action_counts[action] += 1
                current_state = next_state
            
            total_rewards.append(episode_reward)
        
        avg_reward = statistics.mean(total_rewards)
        reward_std = statistics.stdev(total_rewards) if len(total_rewards) > 1 else 0
        
        return {
            'average_reward': avg_reward,
            'reward_std': reward_std,
            'total_episodes': episodes,
            'action_distribution': action_counts,
            'total_actions': sum(action_counts.values())
        }
    
    def show_learned_policy(self) -> None:
        """Display the learned trading policy."""
        print("\nLearned Trading Policy:")
        print("=" * 30)
        
        # Sample various market conditions
        market_conditions = [
            ('up', 'low'), ('up', 'medium'), ('up', 'high'),
            ('down', 'low'), ('down', 'medium'), ('down', 'high'),
            ('stable', 'low'), ('stable', 'medium'), ('stable', 'high')
        ]
        
        for trend, volatility in market_conditions:
            test_state = TradingState(trend, volatility, 50000)  # $50k portfolio
            best_action = self.choose_action(test_state, training=False)
            
            state_key = self.get_state_key(test_state)
            if state_key in self.q_table:
                q_values = self.q_table[state_key]
                max_q = max(q_values.values())
                print(f"Market {trend:>6}, Volatility {volatility:>6}: {best_action.value:>12} (Q={max_q:.3f})")

# Demonstration
def demonstrate_reinforcement_learning():
    """Demonstrate reinforcement learning with trading agent."""
    print("Reinforcement Learning Demonstration")
    print("=" * 42)
    
    # Create and train RL agent
    trading_agent = ReinforcementLearningDemo(learning_rate=0.1, exploration_rate=0.5)
    
    # Train the agent
    trading_agent.train_agent(episodes=500, steps_per_episode=10)
    
    # Evaluate performance
    performance = trading_agent.evaluate_agent(episodes=100)
    
    print(f"\nPerformance Results:")
    print(f"Average reward per episode: {performance['average_reward']:.4f}")
    print(f"Reward standard deviation: {performance['reward_std']:.4f}")
    
    print(f"\nAction Distribution:")
    total_actions = performance['total_actions']
    for action, count in performance['action_distribution'].items():
        percentage = count / total_actions * 100
        print(f"  {action.value}: {count} ({percentage:.1f}%)")
    
    # Show learned policy
    trading_agent.show_learned_policy()
    
    # Show learning progress
    if len(trading_agent.episode_rewards) >= 100:
        early_performance = statistics.mean(trading_agent.episode_rewards[:100])
        late_performance = statistics.mean(trading_agent.episode_rewards[-100:])
        improvement = late_performance - early_performance
        
        print(f"\nLearning Progress:")
        print(f"Early episodes (1-100): {early_performance:.4f} avg reward")
        print(f"Late episodes (last 100): {late_performance:.4f} avg reward")
        print(f"Improvement: {improvement:.4f}")
    
    return trading_agent, performance

if __name__ == "__main__":
    demo_agent, results = demonstrate_reinforcement_learning()

```

---

## Evaluation Methods for Each Paradigm

### Supervised Learning Evaluation

**Metrics**:

- **Accuracy**: Percentage of correct predictions

- **Precision**: True positives / (True positives + False positives)

- **Recall**: True positives / (True positives + False negatives)

- **F1-Score**: Harmonic mean of precision and recall

**Evaluation Strategy**:

- Split data into training/validation/test sets

- Use cross-validation for robust estimates

- Measure performance on unseen test data

### Unsupervised Learning Evaluation

**Metrics**:

- **Silhouette Score**: How well-separated clusters are

- **Inertia**: Within-cluster sum of squared distances

- **Calinski-Harabasz Index**: Ratio of between-cluster to within-cluster variance

**Evaluation Strategy**:

- Visual inspection of clusters

- Domain expert validation

- Use clusters for downstream tasks and measure improvement

### Semi-Supervised Learning Evaluation

**Metrics**:

- Compare to supervised baseline using only labeled data

- Measure improvement from adding unlabeled data

- Evaluate confidence calibration of pseudo-labels

**Evaluation Strategy**:

- Hold out labeled test set

- Compare performance with and without unlabeled data

- Analyze quality of generated pseudo-labels

### Reinforcement Learning Evaluation

**Metrics**:

- **Cumulative Reward**: Total reward over episodes

- **Average Return**: Mean reward per episode

- **Learning Curve**: Improvement over time

- **Policy Stability**: Consistency of learned behavior

**Evaluation Strategy**:

- Monitor training progress over episodes

- Test final policy without exploration

- Compare to random or rule-based baselines

---

## Choosing the Right Paradigm

### Decision Framework

```kroki-mermaid
graph TD
    A[Start: ML Problem] --> B{Do you have labeled data?}
    B -->|Yes, lots| C{Is prediction accuracy critical?}
    B -->|Some labels| D[Consider Semi-Supervised Learning]
    B -->|None| E[Use Unsupervised Learning]
    
    C -->|Yes| F[Use Supervised Learning]
    C -->|Sequential decisions needed| G{Can you define rewards?}
    
    G -->|Yes| H[Use Reinforcement Learning]
    G -->|No| F
    
    D --> I{Is labeling expensive?}
    I -->|Yes| J[Semi-supervised is ideal]
    I -->|No| K[Consider getting more labels for supervised]
    
    E --> L{Looking for patterns or groups?}
    L -->|Patterns/clusters| M[Clustering/dimensionality reduction]
    L -->|Anomalies| N[Anomaly detection]

```

### Quick Reference Guide

| **Problem Type** | **Data Available** | **Best Paradigm** | **Example** |
|------------------|--------------------|--------------------|-------------|
| Classification with many labels | Large labeled dataset | Supervised | Email spam detection |
| Pattern discovery | Unlabeled data | Unsupervised | Customer segmentation |
| Limited labeling budget | Small labeled + large unlabeled | Semi-supervised | Medical image analysis |
| Sequential decision making | Environment with rewards | Reinforcement | Game playing, robotics |
| Fraud detection | Few confirmed cases + lots of transactions | Semi-supervised or Unsupervised | Credit card fraud |
| Recommendation systems | User behavior data | Unsupervised or Supervised | Product recommendations |
| Autonomous control | Simulated environment | Reinforcement | Self-driving cars |

---

## Practice Tasks

### Task 1: Paradigm Selection

For each scenario, identify the most appropriate ML paradigm and justify your choice:

1. **Medical Diagnosis**: 1,000 labeled X-rays, 50,000 unlabeled X-rays

2. **Stock Trading**: Historical price data, ability to simulate trades

3. **Social Media Analysis**: 10 million posts, no labels, want to find trending topics

4. **Quality Control**: 100 defect examples, 10,000 normal products, need to detect defects

### Task 2: Data Requirements Analysis

Design data collection strategies for:

1. **Supervised Learning**: Building a document classifier

2. **Unsupervised Learning**: Market segmentation analysis  

3. **Semi-Supervised Learning**: Voice recognition system

4. **Reinforcement Learning**: Inventory management system

### Task 3: Evaluation Design

Create evaluation metrics and procedures for:

1. Comparing supervised vs semi-supervised approaches

2. Validating unsupervised clustering results

3. Measuring reinforcement learning progress

4. Determining when you have enough training data

### Task 4: Hybrid Approach Design

Design a system that combines multiple paradigms:

1. **Customer Analysis**: Use unsupervised learning to find segments, then supervised learning to predict behavior within segments

2. **Content Moderation**: Use semi-supervised learning to classify content, then reinforcement learning to optimize moderation policies

---

## Recap and Key Takeaways

### Understanding the Paradigms

- **Supervised Learning**: Best when you have lots of labeled examples and need accurate predictions

- **Unsupervised Learning**: Essential for discovering hidden patterns and understanding data structure

- **Semi-Supervised Learning**: Optimal when labeling is expensive but you have lots of unlabeled data

- **Reinforcement Learning**: Necessary for sequential decision-making and learning from environmental feedback

### Data Considerations

- **Quality over Quantity**: Clean, representative data is more valuable than large, messy datasets

- **Labeling Costs**: Consider the expense and effort required to obtain labels

- **Data Distribution**: Ensure training data represents real-world scenarios

- **Evaluation Strategy**: Plan how to measure success before collecting data

### Practical Guidelines

- **Start Simple**: Begin with the paradigm that matches your data and problem most directly

- **Consider Combinations**: Many real-world problems benefit from combining multiple approaches

- **Evaluate Thoroughly**: Use appropriate metrics for each paradigm type

- **Iterate and Improve**: ML systems benefit from continuous refinement and retraining

Understanding these four training paradigms provides the foundation for tackling diverse ML challenges and choosing the right approach for specific automation and intelligence problems.
