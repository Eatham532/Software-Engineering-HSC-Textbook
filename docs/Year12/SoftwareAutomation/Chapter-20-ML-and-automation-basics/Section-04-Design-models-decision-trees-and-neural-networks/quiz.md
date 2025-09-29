# Section 20.4 Quiz: Design Models Decision Trees and Neural Networks# Quiz: Design Models - Decision Trees and Neural Networks



!!! quiz "Section 20.4 Quiz: Design Models Decision Trees and Neural Networks"## Instructions



    Test your understanding of decision trees, neural networks, and model design principles in machine learning.- Answer all questions



    **Time Limit**: 35 minutes  - For coding questions, trace through the logic step by step

    **Total Marks**: 35 marks  

    **Question Types**: Multiple choice and short answer- Show your working for calculation questions



        ---- Explain your reasoning for design decisions



    1. What is the main advantage of decision trees as a machine learning model?---

        - They always produce the most accurate predictions

        - { data-correct } They are easy to interpret and understand## Part A: Decision Trees (25 marks)

        - They work only with numerical data

        - They require the least amount of training data### Question 1: Entropy and Information Gain (8 marks)



    2. In a decision tree, what does each internal node represent?Given this dataset for email classification:

        - A final prediction or classification result

        - { data-correct } A decision point based on a feature value| Email | Word "urgent" | Word "meeting" | Priority |

        - A connection between different trees|-------|---------------|----------------|----------|

        - A training data sample| 1     | Yes           | No             | High     |

| 2     | No            | Yes            | Low      |

    3. What is the purpose of "pruning" in decision tree models?| 3     | Yes           | Yes            | High     |

        - To remove irrelevant features from the dataset| 4     | No            | No             | Low      |

        - { data-correct } To reduce overfitting by removing unnecessary branches| 5     | Yes           | No             | High     |

        - To speed up the training process| 6     | No            | Yes            | Low      |

        - To convert the tree into a neural network

**a)** Calculate the entropy of the entire dataset (2 marks)

    4. Which statement best describes how neural networks process information?

        - They follow a series of if-then rules like decision trees**b)** Calculate the information gain for splitting on "Word urgent" (3 marks)

        - { data-correct } They transform inputs through layers of interconnected nodes

        - They store all training examples and compare new inputs to them**c)** Calculate the information gain for splitting on "Word meeting" (3 marks)

        - They use statistical formulas to calculate probabilities

### Question 2: Decision Tree Construction (7 marks)

    5. What is the role of "weights" in a neural network?

        - They determine how much training data to useUsing the dataset from Question 1:

        - { data-correct } They control the strength of connections between neurons

        - They specify the number of layers in the network**a)** Which attribute should be chosen for the root node? Explain your reasoning (2 marks)

        - They set the learning rate for training

**b)** Draw the complete decision tree for this dataset (3 marks)

    6. Why do neural networks typically require more training data than decision trees?

        - Neural networks are more complex algorithms**c)** Trace through the prediction process for a new email with "urgent=Yes, meeting=Yes" (2 marks)

        - { data-correct } They have many parameters that need to be learned

        - They process data more slowly### Question 3: Code Analysis (5 marks)

        - They are less accurate with small datasets

Examine this decision tree prediction code:

    7. What is "deep learning" in the context of neural networks?

        - Learning very detailed patterns in data```python

        - { data-correct } Using neural networks with many hidden layersdef predict_email_priority(urgent, meeting):

        - Training for a very long time    if urgent == "Yes":

        - Learning from very large datasets        if meeting == "Yes":

            return "High"

    8. Which type of problem is better suited for decision trees rather than neural networks?        else:

        - Image recognition tasks            return "High"

        - { data-correct } Problems where you need to explain the reasoning behind decisions    else:

        - Processing natural language text        if meeting == "Yes":

        - Recognizing patterns in audio signals            return "Low"

        else:

    9. What is the main challenge when training deep neural networks?            return "Low"

        - They require specialized hardware to run```

        - { data-correct } They can be difficult to train and may get stuck in poor solutions

        - They only work with structured numerical data**a)** What is the equivalent decision tree structure? (2 marks)

        - They always overfit to the training data

**b)** Simplify this code to make it more efficient (2 marks)

    10. In model design, what does "bias-variance tradeoff" refer to?

        - The balance between training time and accuracy**c)** What accuracy would this achieve on the training data from Question 1? (1 mark)

        - { data-correct } The balance between underfitting and overfitting

        - The choice between different algorithms### Question 4: Advantages and Limitations (5 marks)

        - The split between training and testing data

**a)** List three key advantages of decision trees for business applications (3 marks)

    11. **Short Answer (5 marks)**: Explain how a decision tree makes a prediction for a new data point. Walk through the process from the root node to a final prediction.

**b)** Describe two major limitations and how they might be addressed (2 marks)

        *Expected answer should cover: Starting at root node, evaluating decision criteria based on feature values, following branches based on true/false outcomes, continuing down the tree until reaching a leaf node, final prediction comes from the majority class or average value in that leaf.*

---

    12. **Short Answer (5 marks)**: Compare decision trees and neural networks in terms of interpretability, training requirements, and performance on different types of data. When would you choose one over the other?

## Part B: Neural Networks (25 marks)

        *Expected answer should cover: Decision trees are interpretable, require less data, good for structured problems with clear rules. Neural networks are black boxes, need more data and computation, better for complex patterns like images/text. Choose trees for explainable decisions, neural networks for complex pattern recognition.*

### Question 5: Perceptron Fundamentals (8 marks)

    13. **Short Answer (5 marks)**: A company wants to build a model to approve or reject loan applications. They need to be able to explain their decisions to customers and regulators. Which model type would you recommend and why? What specific considerations should they keep in mind?

Consider a perceptron with:

        *Expected answer should cover: Recommend decision trees due to interpretability requirements. Considerations include feature selection (relevant to loan decisions), avoiding discriminatory features, ensuring fairness across different groups, regulatory compliance, ability to provide clear explanations to rejected applicants.*

- Weights: w₁ = 0.5, w₂ = -0.3

    14. **Short Answer (5 marks)**: Explain what causes overfitting in both decision trees and neural networks. Describe one technique for preventing overfitting in each model type.

- Bias: b = 0.1

        *Expected answer should cover: Overfitting occurs when models learn training data too specifically. In decision trees: caused by growing too deep, prevented by pruning or limiting depth. In neural networks: caused by too many parameters relative to data, prevented by regularization, dropout, or early stopping.*

- Step activation function (output 1 if sum > 0, else 0)

    15. **Short Answer (10 marks)**: A medical research team wants to analyze patient data to predict treatment outcomes. They have two options: a decision tree model that is 85% accurate but easily interpretable, or a neural network that is 95% accurate but acts as a "black box." Discuss the tradeoffs and considerations that should influence their choice. Consider ethical, practical, and regulatory aspects.

**a)** Calculate the output for inputs [1, 1] (2 marks)

        *Expected answer should cover: Medical context requires interpretability for doctor trust and patient explanation. Higher accuracy could save lives but lack of interpretability poses risks. Considerations include: regulatory requirements for medical AI, physician acceptance, patient rights to understand decisions, potential bias detection, liability issues, integration with medical workflow, ability to improve medical knowledge through interpretable insights.*
**b)** Calculate the output for inputs [0, 1] (2 marks)

**c)** What logic function does this perceptron approximate? (2 marks)

**d)** Show the weight update process if the expected output for [1, 1] was 0 and learning rate is 0.1 (2 marks)

### Question 6: Multi-Layer Networks (7 marks)

**a)** Explain why a single perceptron cannot learn the XOR function (2 marks)

**b)** Describe the minimum network architecture needed to solve XOR (2 marks)

**c)** Explain the role of hidden layers in neural networks (3 marks)

### Question 7: Training Process (5 marks)

**a)** List the four main steps of backpropagation in order (2 marks)

**b)** Explain what happens during the "forward pass" (1.5 marks)

**c)** Explain what happens during the "backward pass" (1.5 marks)

### Question 8: Activation Functions (5 marks)

Match each activation function with its best use case:

**Functions:**

1. Step function

2. Sigmoid

3. ReLU

4. Tanh

**Use Cases:**
a) Modern deep networks (fast training)
b) Binary classification output
c) Hidden layers needing symmetric output
d) Traditional perceptrons

**Answer:** (1 mark each, 1 mark for explanation)

---

## Part C: Model Comparison and Selection (25 marks)

### Question 9: Comparative Analysis (10 marks)

Complete this comparison table:

| Aspect | Decision Trees | Neural Networks |
|--------|----------------|-----------------|
| Training Speed | | |
| Interpretability | | |
| Data Requirements | | |
| Overfitting Risk | | |
| Real-time Performance | | |

(2 marks per row)

### Question 10: Scenario-Based Selection (8 marks)

For each scenario, choose the most appropriate model (Decision Tree, Neural Network, or Both) and justify your choice:

**a)** A bank needs to explain loan rejection decisions to customers (2 marks)

**b)** A tech company wants to recognize handwritten digits (2 marks)

**c)** A hospital needs to diagnose rare diseases from symptoms (2 marks)

**d)** An e-commerce site wants to detect fraudulent transactions (2 marks)

### Question 11: Hybrid Approach Design (7 marks)

**a)** Describe a real-world scenario where combining decision trees and neural networks would be beneficial (3 marks)

**b)** Design the architecture for such a hybrid system (2 marks)

**c)** Explain how the two models would interact and complement each other (2 marks)

---

## Part D: Implementation and Problem-Solving (25 marks)

### Question 12: Code Implementation (10 marks)

Write pseudocode for a function that:

- Takes a trained decision tree and neural network

- Makes predictions using both models

- Returns the final prediction based on confidence scores

**Requirements:**

- Handle cases where models disagree

- Include confidence thresholds

- Provide reasoning for the final decision

(5 marks for logic, 3 marks for structure, 2 marks for edge cases)

### Question 13: Performance Optimization (8 marks)

**a)** List three techniques to prevent overfitting in decision trees (3 marks)

**b)** List three techniques to improve neural network training (3 marks)

**c)** Explain how to evaluate model performance fairly (2 marks)

### Question 14: Real-World Application (7 marks)

Design a complete machine learning solution for automated email prioritization:

**a)** Define the problem scope and requirements (2 marks)

**b)** Choose appropriate features and data representation (2 marks)

**c)** Select and justify your modeling approach (2 marks)

**d)** Describe your evaluation strategy (1 mark)

---

## Bonus Questions (5 marks)

### Question 15: Advanced Concepts (5 marks)

**a)** Explain the concept of ensemble methods and how they relate to decision trees (2 marks)

**b)** Describe what "deep learning" means in the context of neural networks (2 marks)

**c)** Name one current limitation of both decision trees and neural networks that research is trying to address (1 mark)

---

## Answer Guidelines

### Marking Rubric

**Excellent (90-100%):** 

- Comprehensive understanding demonstrated

- All calculations correct with clear working

- Insightful analysis and reasoning

- Code is efficient and well-structured

**Good (75-89%):**

- Solid understanding with minor gaps

- Most calculations correct

- Good reasoning with some insight

- Code works with minor issues

**Satisfactory (60-74%):**

- Basic understanding demonstrated

- Some calculation errors but method correct

- Basic reasoning provided

- Code has logical structure but may have bugs

**Needs Improvement (<60%):**

- Limited understanding shown

- Major calculation or conceptual errors

- Little reasoning provided

- Code is incomplete or fundamentally flawed

### Study Tips

1. **Practice calculations** by hand before using code

2. **Trace through algorithms** step by step

3. **Understand trade-offs** between different approaches

4. **Consider real-world constraints** in your solutions

5. **Explain your reasoning** clearly and concisely

### Additional Resources

- Revisit the entropy calculation examples

- Practice with the provided Python implementations

- Review the comparison tables between models

- Understand when to use each type of model

---

**Total: 100 marks + 5 bonus marks**

**Time allocation:** 

- Part A: 30 minutes

- Part B: 30 minutes  

- Part C: 30 minutes

- Part D: 40 minutes

- Bonus: 10 minutes

**Recommended approach:**

1. Read all questions first

2. Start with topics you're most confident about

3. Show all working for calculations

4. Leave time to review your answers

5. Attempt bonus questions if time permits
