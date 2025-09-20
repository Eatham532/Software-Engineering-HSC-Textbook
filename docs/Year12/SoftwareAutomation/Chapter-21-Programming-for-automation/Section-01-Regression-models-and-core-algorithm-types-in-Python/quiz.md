# Section 21.1 Quiz: Regression Models and Core Algorithm Types in Python

!!! quiz "Section 21.1 Quiz: Regression Models and Core Algorithm Types in Python"

    Test your understanding of regression models, core algorithms, and Python implementation for automation.

    **Time Limit**: 35 minutes  
    **Total Marks**: 35 marks  
    **Question Types**: Multiple choice and short answer

    ---

    1. What is the primary purpose of linear regression in machine learning?
        - To classify data into discrete categories
        - { data-correct } To predict a continuous numerical value based on input features
        - To group similar data points together
        - To reduce the dimensionality of datasets

    2. In a linear regression equation y = mx + b, what does the 'm' represent?
        - The predicted output value
        - { data-correct } The slope or rate of change
        - The y-intercept
        - The input feature value

    3. Which Python library is most commonly used for implementing machine learning algorithms?
        - NumPy
        - Pandas
        - { data-correct } Scikit-learn
        - Matplotlib

    4. What does R-squared measure in regression analysis?
        - The computational complexity of the model
        - { data-correct } How well the model explains the variance in the data
        - The speed of training the model
        - The number of features used in the model

    5. Which algorithm is best suited for classification problems with clear linear boundaries?
        - K-means clustering
        - { data-correct } Logistic regression
        - Linear regression
        - Principal component analysis

    6. What is the main advantage of decision tree algorithms?
        - They always provide the highest accuracy
        - { data-correct } They are easily interpretable and explainable
        - They work only with numerical data
        - They require no data preprocessing

    7. In Python's scikit-learn, what method is typically used to train a model?
        - predict()
        - transform()
        - { data-correct } fit()
        - score()

    8. What is the purpose of splitting data into training and testing sets?
        - To reduce computational requirements
        - { data-correct } To evaluate model performance on unseen data
        - To speed up the training process
        - To reduce the size of the dataset

    9. Which regression technique is most appropriate when you have many features but suspect only a few are important?
        - Simple linear regression
        - { data-correct } Lasso regression (L1 regularization)
        - Polynomial regression
        - Ridge regression

    10. What is cross-validation used for in machine learning?
        - To clean the data before training
        - { data-correct } To get a more robust estimate of model performance
        - To automatically select the best algorithm
        - To reduce the training time

    11. **Short Answer (5 marks)**: Write a basic Python code snippet using scikit-learn to create and train a linear regression model. Include the necessary imports and show how to make predictions.

        *Expected answer should include: imports (sklearn.linear_model, train_test_split), creating LinearRegression object, fitting with X_train and y_train, making predictions with predict() method, basic structure demonstrating the workflow.*

    12. **Short Answer (5 marks)**: Explain the difference between supervised and unsupervised learning algorithms. Give one example of each type and explain when you would use them.

        *Expected answer should cover: Supervised learning uses labeled data to predict outcomes (examples: regression, classification), unsupervised learning finds patterns in unlabeled data (examples: clustering, dimensionality reduction). Use supervised when you have target variables, unsupervised for exploratory analysis.*

    13. **Short Answer (5 marks)**: A company wants to predict house prices based on features like size, location, and age. Explain why linear regression might be a good starting point, and what steps you would take to implement this in Python.

        *Expected answer should cover: Linear regression appropriate for continuous price prediction, relationship between features and price likely linear. Steps include data preparation, feature selection, train/test split, model training with LinearRegression, evaluation with metrics like R-squared, prediction on new data.*

    14. **Short Answer (5 marks)**: What is overfitting in machine learning, and how can regularization techniques like Ridge and Lasso help prevent it? Explain the key difference between these two regularization methods.

        *Expected answer should cover: Overfitting occurs when model learns training data too specifically, performs poorly on new data. Ridge (L2) shrinks coefficients toward zero, Lasso (L1) can set coefficients exactly to zero for feature selection. Both prevent overfitting by penalizing complex models.*

    15. **Short Answer (10 marks)**: A retail company wants to automate their inventory forecasting using regression models in Python. They have historical sales data, seasonal patterns, promotions, and external factors like weather. Design a complete approach including data preparation, model selection, and evaluation strategy. Explain your choices and potential challenges.

        *Expected answer should cover: Data preparation including handling seasonality, feature engineering for promotions/weather, dealing with trends. Model selection considering multiple regression, time series components, possibly ensemble methods. Evaluation strategy with time-based splits, appropriate metrics for forecasting. Challenges include seasonality handling, external factor integration, model updating strategies.*
