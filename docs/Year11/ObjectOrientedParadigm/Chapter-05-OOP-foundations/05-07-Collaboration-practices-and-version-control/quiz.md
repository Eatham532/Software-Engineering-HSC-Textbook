# 05.07 Collaboration Practices And Version Control - Quiz

!!! quiz "Check your understanding"

    1. Why is object-oriented programming particularly well-suited for team collaboration?

        - It makes programs run faster
        - It creates clear module boundaries and interfaces that allow independent work { data-correct }
        - It requires fewer programmers
        - It eliminates all bugs automatically

    2. What is the main purpose of a pull request in collaborative development?

        - To download code from the internet
        - To propose changes and get them reviewed before merging { data-correct }
        - To delete unwanted files
        - To automatically fix code errors

    3. Which branching strategy involves creating separate branches for each feature?

        - Linear development
        - Feature branch workflow { data-correct }
        - Master-only development
        - No branching at all

    4. What should you do when Git shows merge conflict markers in your code?

        - Delete the entire file
        - Manually resolve conflicts and remove markers { data-correct }
        - Ignore the conflicts
        - Start over with a new repository

    5. Look at this class structure. How does it support team collaboration?

        ```python
        class UserService:
            def create_user(self, username, email): pass
            def authenticate_user(self, email, password): pass

        class PostService:
            def create_post(self, author_id, title, content): pass
            def delete_post(self, post_id, user_id): pass
        ```text

        - Each class can be developed by different team members independently { data-correct }
        - It makes the code run faster
        - It prevents all errors
        - It requires only one programmer

    6. What is the most important aspect of good commit messages?

        - They should be very long
        - They should be descriptive and explain what changed { data-correct }
        - They should include the programmer's name
        - They should be written in all capital letters

    7. What is a key benefit of small, cohesive classes in team development?

        - They use less memory
        - They're easier for team members to understand and modify { data-correct }
        - They automatically prevent bugs
        - They make programs run faster

    8. During code review, what should reviewers focus on?

        - Personal coding style preferences
        - Code quality, potential bugs, and project standards { data-correct }
        - Making changes themselves
        - Criticizing the author personally

    9. What is the purpose of API contracts in collaborative development?

        - To make legal agreements
        - To define clear interfaces that teams can depend on { data-correct }
        - To increase program speed
        - To reduce file sizes

    10. Which practice best supports team collaboration in OOP projects?

        - Writing all code in one large class
        - Avoiding documentation to save time
        - Creating clear interfaces and documenting dependencies { data-correct }
        - Working only on the main branch
