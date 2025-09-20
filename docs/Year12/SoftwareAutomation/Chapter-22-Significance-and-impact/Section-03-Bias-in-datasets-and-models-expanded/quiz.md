# Section 22.3 Quiz: Bias in Datasets and Models (Expanded)

!!! quiz "Section 22.3 Quiz: Bias in Datasets and Models (Expanded)"

    Test your understanding of bias sources in ML systems, mitigation strategies, and the importance of transparency and accountability in AI development.

    **Time Limit**: 40 minutes  
    **Total Marks**: 40 marks  
    **Question Types**: Multiple choice and short answer

    ---

    1. What is sampling bias in machine learning datasets?
        - When the algorithm samples data too slowly
        - { data-correct } When the training data doesn't represent the target population accurately
        - When there are too many samples in the dataset
        - When the data samples are corrupted or incomplete

    2. Which type of bias occurs when historical data reflects past discrimination?
        - Sampling bias
        - { data-correct } Historical bias
        - Measurement bias
        - Population drift

    3. What is labeler bias in machine learning?
        - Bias in the choice of programming language
        - { data-correct } Inconsistencies and prejudices introduced by human data annotators
        - Bias in the selection of training algorithms
        - Bias in the hardware used for training

    4. What does "population drift" refer to in ML contexts?
        - The physical movement of users
        - { data-correct } Changes in the target population over time that make training data outdated
        - Errors in data transmission
        - Changes in computing hardware

    5. Which mitigation strategy involves collecting data from underrepresented groups?
        - Reweighting existing samples
        - { data-correct } Diverse data collection
        - Algorithmic debiasing
        - Model compression

    6. What is the purpose of fairness-aware metrics in ML evaluation?
        - To measure training speed
        - { data-correct } To assess whether the model treats different groups equitably
        - To reduce computational costs
        - To improve prediction accuracy

    7. What information should be included in a "model card" for transparency?
        - Only the final accuracy metrics
        - { data-correct } Model purpose, training data, limitations, and bias considerations
        - Just the source code
        - Only the deployment instructions

    8. Why is dataset provenance important for addressing bias?
        - It determines the file format
        - { data-correct } It helps identify potential sources of bias in data collection
        - It improves processing speed
        - It reduces storage requirements

    9. What does "measurement bias" typically refer to?
        - Errors in computing hardware
        - { data-correct } Systematic errors in how data is collected or features are defined
        - Problems with internet connectivity
        - Issues with software installation

    10. Which approach helps ensure reproducibility in bias mitigation?
        - Keeping methods secret for competitive advantage
        - { data-correct } Documenting all steps and making code available for review
        - Using the fastest available hardware
        - Minimizing the amount of documentation

    11. **Short Answer (5 marks)**: Explain the difference between individual fairness and group fairness in ML systems. Provide an example where these two concepts might conflict.

        *Expected answer should cover: Individual fairness means similar individuals should receive similar outcomes. Group fairness means different demographic groups should have similar outcomes statistically. Conflict example: loan approvals where individual credit scores might be fair but result in group disparities due to historical economic inequalities.*

    12. **Short Answer (5 marks)**: A facial recognition system has 95% accuracy for light-skinned individuals but only 70% accuracy for dark-skinned individuals. Identify three potential sources of this bias and suggest mitigation strategies for each.

        *Expected answer should cover: Training data bias (insufficient representation of dark-skinned individuals - solution: diverse data collection), algorithmic bias (features optimized for light skin - solution: inclusive feature engineering), measurement bias (poor image quality for darker skin - solution: better sensors/lighting). Mitigation includes balanced datasets, fairness testing, inclusive development teams.*

    13. **Short Answer (10 marks)**: A company is developing an AI hiring system. Describe how historical bias, sampling bias, and labeler bias could each affect this system. For each type of bias, explain the potential impact and propose specific mitigation strategies.

        *Expected answer should cover: Historical bias from past discriminatory hiring decisions reflected in training data (impact: perpetuates discrimination; mitigation: audit historical data, adjust for known biases). Sampling bias from unrepresentative applicant pools (impact: unfair to underrepresented groups; mitigation: diverse recruitment, balanced datasets). Labeler bias from HR professionals rating candidates (impact: subjective biases in evaluation; mitigation: multiple annotators, bias training, structured evaluation criteria).*

    14. **Short Answer (10 marks)**: Explain the concept of "algorithmic accountability" and describe three specific mechanisms organizations can implement to ensure their ML systems are accountable. Discuss the challenges and benefits of each mechanism.

        *Expected answer should cover: Algorithmic accountability means being responsible for AI system outcomes and being able to explain decisions. Mechanisms include: audit trails (challenge: complexity, benefit: traceability), external audits (challenge: cost/expertise, benefit: independent validation), algorithmic impact assessments (challenge: time/resources, benefit: proactive risk identification). Additional mechanisms might include appeals processes, transparency reports, or algorithmic oversight boards.*

    15. **Short Answer (5 marks)**: A medical AI system trained primarily on data from one hospital shows reduced performance when deployed at hospitals in different regions. Analyze this scenario in terms of bias and generalization. What steps should be taken before and after deployment?

        *Expected answer should cover: This represents sampling bias and population drift - the training data doesn't represent the broader population. Before deployment: diverse multi-site training data, validation across different populations, bias testing. After deployment: continuous monitoring, performance tracking across demographics, regular retraining with new data, feedback mechanisms for healthcare providers.*
