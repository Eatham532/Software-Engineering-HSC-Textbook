# Demo: Interactive Quiz Template

This demo shows the interactive quiz template you can reuse from `docs/templates/quiz-template.md`.

Follow these steps:

- Build the site with MkDocs (activate your venv first if you use one).
- Open the Demo -> Interactive Quiz page in the site.

## Live demo quiz

## 01.01 Example Section Title

### Learning outcomes

- Understand a simple Python print
- Read the answer key with the toggle

### Quiz

1. What does print("Hello") do in Python?

	- [ ] A. Compiles the code
	- [x] B. Prints Hello to stdout
	- [ ] C. Returns a string
	- [ ] D. Creates a variable

1. Write a one-line expression to create a list of numbers 0..3.

```python
list(range(4))
```

---

<button class="quiz-toggle" data-target=".quiz-answers">Show answers</button>

<div class="quiz-answers" hidden>

## Answer key

1. B

2. list(range(4))

</div>
