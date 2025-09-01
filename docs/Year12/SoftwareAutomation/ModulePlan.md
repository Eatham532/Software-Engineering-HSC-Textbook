# Year 12 — Software Automation: Module Plan

Build intuition for ML and automation with simple, reproducible Python examples. Prefer from-scratch implementations where practical; introduce libraries with care.

---

## Chapter 1 — ML and automation basics

Covers: definitions, learning models, applications, and simple model design. Outcomes: SE-12-03, SE-12-02.

### 1.1 What is AI vs ML (and where RPA/BPA fit)

- Outcomes: SE-12-03

- Learn: distinguish AI and ML, and where automation tools (including DevOps automation), Robotic Process Automation (RPA) and Business Process Automation (BPA) fit; examples and limits.

- Provide a concise comparison:

  - RPA: rule-driven, task-level automation that simulates user actions (screen-scraping, form-filling, repetitive workflows); typically low-code/agent-based.

  - BPA: process-level automation that redesigns business processes end-to-end, often integrating multiple systems and human approvals; may incorporate RPA and ML components.

  - How ML augments RPA/BPA: intelligent decision points, document classification, anomaly detection.

### 1.2 ML training models: supervised, unsupervised, semi, reinforcement

- Outcomes: SE-12-03

- Learn: when to use each; data needs; brief evaluation notions.

### 1.3 Common ML applications

- Outcomes: SE-12-03

- Learn: data analysis, forecasting, assistants, image recognition; where Python shines.

### 1.4 Design models: decision trees and neural networks

- Outcomes: SE-12-02

- Learn: build/trace simple models conceptually and in code.

Exit: students can categorise ML problems and outline simple models.

---

### 1.5 RPA and BPA: practical considerations

- Outcomes: SE-12-02, SE-12-05

- Learn: implementation examples and constraints for RPA and BPA, including:

  - typical use-cases (invoice processing, data migration, repetitive administrative tasks)

  - tooling and low-code platforms vs custom scripts

  - when to apply RPA vs reengineering the process (BPA)

  - ethical, security and maintainability considerations when automating workflows

## Chapter 2 — Programming for automation

Covers: regression models and a tiny neural network. Outcomes: SE-12-02.

### 2.1 Regression models and core algorithm types in Python

- Outcomes: SE-12-02

- Learn: fit/evaluate models; avoid overfitting; explainability basics.

- Describe types of algorithms associated with ML, including:

  - linear regression (fitting a line/plane to predict continuous values)

  - logistic regression (classification via a sigmoid / probabilistic output)

  - K-nearest neighbour (instance-based learning for classification/regression)

  - (briefly) polynomial regression as an extension to linear models when required

### 2.2 Neural networks: concepts and implementation

- Outcomes: SE-12-02

- Learn: perceptron and tiny MLP demo; training loop intuition.

Exit: students can implement toy models and reason about their behaviour.

---

## Chapter 3 — Significance and impact

Covers: impact, human behaviour, and bias. Outcomes: SE-12-05.

### 3.1 Assessing the impact of automation

- Outcomes: SE-12-05

- Learn: assess the impact of automation on the individual, society and the environment. Including:

  - safety of workers (hazards introduced or removed by automation; reskilling and workplace safety implications)

  - people with disability (accessibility gains or exclusions created by automated systems)

  - the nature and skills required for employment (how roles change; need for new competencies)

  - production efficiency, waste and environmental impacts (resource use, optimisation, and unintended waste)

  - the economy and distribution of wealth (automation's effect on labour markets and wealth concentration)

### 3.2 Human behaviour patterns and their influence on ML/AI development

- Outcomes: SE-12-05

- Learn: explore by implementation how patterns in human behaviour influence ML and AI software development. Including:

  - psychological responses (how people react to automated decisions and interfaces)

  - patterns related to acute stress response (how stress alters behaviour and data patterns)

  - cultural protocols (local norms that influence model design and deployment)

  - belief systems (how underlying beliefs shape user interaction and acceptance)

### 3.3 Bias in datasets and models (expanded)

- Outcomes: SE-12-05

- Learn: investigate the effect of human and dataset source bias in the development of ML and AI solutions. Topics:

  - sources of bias (sampling bias, historical bias, labeler bias, population drift)

  - practical investigations: dataset provenance, missing groups, and measurement bias

  - mitigation strategies (diverse data collection, reweighting, fairness-aware metrics)

  - transparency and accountability (documentation, model cards, reproducibility checks)

Exit: students can discuss impacts, evaluate ethical considerations, and propose mitigation strategies for bias in ML systems.

### 3.2 Human behaviour patterns and ML/AI

- Outcomes: SE-12-05

- Learn: feedback loops, incentives, and unintended consequences.

### 3.3 Bias in datasets and models

- Outcomes: SE-12-05

- Learn: sources of bias; mitigation strategies; transparency.

Exit: students can discuss impacts and evaluate ethical considerations.

---

-## Author deliverables per section

- index.md: explanation, small Python example(s), PlantUML diagram(s), practice tasks, recap.

- quiz.md: 6–10 questions (mix of multiple-choice and short-answer) with an answer key.

## Folder naming (mapping to numbered sections)

- Display: numbered titles (e.g., “2.1 Regression models in Python: linear, polynomial, logistic”).

- Folders: `docs/Year12/SoftwareAutomation/Chapter-0X-Name/Section-0Y-Name/`

  - `index.md`

  - `quiz.md`
