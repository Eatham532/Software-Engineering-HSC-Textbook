# 1.4 Project management models (Waterfall vs Agile)

## Why it matters

Imagine two different ways to build a treehouse: you could plan everything perfectly upfront and build it step-by-step (Waterfall), or you could build a basic platform first, then add features bit by bit based on what works (Agile). Both approaches have their place in software development, and choosing the right one can make the difference between project success and failure.

Understanding these models helps you pick the best approach for your projects and work effectively in team environments where these methodologies are used.

## What you'll learn

- How Waterfall and Agile approaches differ in execution

- Pros and cons of each methodology

- When to use each model for classroom projects

- How team size and project requirements affect methodology choice

## Waterfall model

The Waterfall model follows a linear, sequential approach where each phase must be completed before moving to the next one. Think of it like a waterfall - water flows down from one level to the next and doesn't flow backwards.

### How Waterfall works

```kroki-mermaid
    flowchart TD
        A[Requirements Analysis] --> B[System Design]
        B --> C[Implementation]
        C --> D[Testing]
        D --> E[Deployment]
        E --> F[Maintenance]

```text

**Phase-by-phase execution:**

1. **Requirements Analysis** - Gather ALL requirements upfront and document them completely

2. **System Design** - Create detailed architecture and design documents

3. **Implementation** - Write all the code according to the design

4. **Testing** - Test the complete system thoroughly

5. **Deployment** - Release the finished product to users

6. **Maintenance** - Fix bugs and add minor enhancements

**Key characteristics:**

- **Sequential phases** - Each phase must finish before the next begins

- **Extensive documentation** - Detailed plans and specifications at each stage

- **Limited client involvement** - Most client interaction happens at the beginning and end

- **Change resistance** - Going back to earlier phases is difficult and expensive

### Waterfall pros and cons

**Advantages:**

- **Clear structure** - Everyone knows what phase they're in and what comes next

- **Predictable timeline** - Easy to estimate completion dates

- **Comprehensive documentation** - Detailed records of all decisions and designs

- **Good for stable requirements** - Works well when you know exactly what you need to build

**Disadvantages:**

- **Inflexible** - Hard to change requirements once development starts

- **Late feedback** - Users don't see working software until the very end

- **Risk of building wrong thing** - Requirements might be misunderstood or change

- **Long development cycles** - Can take months or years before users see results

### When to use Waterfall

Waterfall works best for projects with:

- **Well-defined, stable requirements** that won't change

- **Regulatory compliance** needs requiring extensive documentation

- **Large, complex systems** where integration must be carefully planned

- **Experienced teams** working on familiar technology

- **Fixed budgets and deadlines** where scope is clearly defined

**Classroom example:** Creating a scientific calculator with specific mathematical functions where requirements are clearly defined by curriculum standards.

## Agile model

Agile takes an iterative, flexible approach where software is built in small increments with frequent feedback and adaptation. Think of it like sculpting - you start with a rough shape and gradually refine it based on what you see.

### How Agile works

```kroki-mermaid
flowchart LR
    subgraph Sprint1 [Sprint 1 - 1-4 weeks]
        A1[Plan] --> B1[Design]
        B1 --> C1[Code]
        C1 --> D1[Test]
        D1 --> E1[Review]
    end
    
    subgraph Sprint2 [Sprint 2 - 1-4 weeks]
        A2[Plan] --> B2[Design]
        B2 --> C2[Code]
        C2 --> D2[Test]
        D2 --> E2[Review]
    end
    
    subgraph Sprint3 [Sprint 3 - 1-4 weeks]
        A3[Plan] --> B3[Design]
        B3 --> C3[Code]
        C3 --> D3[Test]
        D3 --> E3[Review]
    end
    
    E1 --> A2
    E2 --> A3

```text

**Sprint-based execution:**

1. **Sprint Planning** - Choose features to build in the next 1-4 weeks

2. **Daily Standups** - Quick team check-ins on progress and blockers

3. **Development** - Build, test, and integrate features continuously

4. **Sprint Review** - Demo working software to stakeholders

5. **Sprint Retrospective** - Reflect on what went well and what to improve

6. **Repeat** - Start the next sprint with new priorities

**Key characteristics:**

- **Short iterations** - Working software delivered every 1-4 weeks

- **Continuous collaboration** - Regular communication with users and stakeholders

- **Adaptability** - Requirements and priorities can change between sprints

- **Working software focus** - Emphasis on functioning code over extensive documentation

### Agile pros and cons

**Advantages:**

- **Flexible and adaptive** - Easy to change direction based on feedback

- **Early and frequent delivery** - Users see working software quickly

- **Reduced risk** - Problems are identified and fixed early

- **High collaboration** - Constant communication with users and team members

- **Continuous improvement** - Team processes get better with each sprint

**Disadvantages:**

- **Less predictable** - Harder to estimate final timeline and scope

- **Requires discipline** - Teams must maintain good practices without heavy process

- **Documentation gaps** - May lack comprehensive documentation

- **Scope creep** - Flexibility can lead to endless feature additions

- **Needs experienced team** - Requires self-organizing, skilled developers

### When to use Agile

Agile works best for projects with:

- **Evolving requirements** where user needs might change

- **Innovation projects** exploring new ideas or technologies

- **Small, cross-functional teams** that can work closely together

- **Frequent user feedback** opportunities

- **Competitive markets** requiring rapid time-to-market

**Classroom example:** Building a student portal where features can be prioritized and refined based on actual student feedback.

## Choosing the right model for classroom projects

### Consider project characteristics

**Use Waterfall when:**

- Assignment requirements are clearly specified and won't change

- You're implementing well-known algorithms or data structures

- The project has a fixed deadline and scope (like exam projects)

- You're working alone or in a large group with formal roles

**Use Agile when:**

- You're building something creative or innovative

- Requirements might evolve as you learn more about the problem

- You can get regular feedback from intended users

- You're working in a small team (2-4 people) with good communication

### Hybrid approaches

Many real projects combine elements of both:

**Agile with Waterfall phases:** Use Waterfall for initial planning and requirements, then Agile for development sprints

**Waterfall with Agile feedback:** Follow Waterfall structure but include regular review points for stakeholder feedback

**Prototyping first:** Build a quick Agile prototype to validate requirements, then use Waterfall for the full implementation

### Practical tips for classroom projects

**For individual projects:**

- Start with clear requirements (Waterfall planning)

- Build in small, testable pieces (Agile development)

- Get feedback from classmates or teachers regularly

- Document your final solution well

**For team projects:**

- Hold a planning meeting to define overall scope (Waterfall)

- Break work into weekly sprints with specific goals (Agile)

- Have daily check-ins via messaging or quick meetings

- Demo progress to each other every week

## Real-world examples

### Waterfall success story

**NASA Apollo program** - Building spacecraft requires extensive planning, testing, and documentation. Changes during development would be extremely costly and dangerous.

### Agile success story

**Spotify** - Music streaming features evolve rapidly based on user behavior and market competition. Quick iterations allow them to test new ideas and adapt quickly.

### When projects fail

**Waterfall failure:** UK's NHS patient record system took years to develop with minimal user input, ultimately failing because requirements had changed and users rejected the final system.

**Agile failure:** Some startups get stuck in "feature creep" where they keep adding new features without ever finishing core functionality.

## Practice exercises

### Foundation practice

/// details | Exercise 1: Model identification
    type: question
    open: false

For each project scenario, decide whether Waterfall or Agile would be more appropriate and explain why:

1. **Banking ATM software** with strict security requirements and regulatory compliance

2. **Mobile game** for teenagers with social features  

3. **Grade calculation system** for your school with specific marking policies

4. **Social media app** competing with existing platforms

/// details | Sample solution
    type: success
    open: false

1. **Banking ATM - Waterfall:** Security requirements are well-defined, regulatory compliance demands extensive documentation, and changes are extremely costly due to security implications.

2. **Mobile game - Agile:** Target audience preferences change quickly, social features need user feedback to succeed, and competitive market requires rapid adaptation.

3. **Grade calculation - Waterfall:** School marking policies are clearly defined, requirements are stable, and accuracy is more important than rapid iteration.

4. **Social media app - Agile:** Highly competitive market, user preferences evolve rapidly, need to test features with real users to see what works.
///
///

/// details | Exercise 2: Planning your approach
    type: question
    open: false

You're assigned a semester-long project to create a "Student Study Tracker" that helps students log study hours and track progress toward goals.

**Tasks:**

1. List the advantages of using Waterfall for this project

2. List the advantages of using Agile for this project  

3. Recommend an approach and justify your choice

4. Outline how you would organize the work using your chosen methodology

/// details | Sample solution
    type: success
    open: false

**Waterfall advantages:**

- Clear semester timeline with defined milestones

- Can plan all features upfront and estimate workload

- Professor can evaluate against predetermined requirements

- Good documentation for final project submission

**Agile advantages:**

- Can test with actual students and get feedback

- Features can be prioritized based on what students actually need

- Working prototype available early for demonstration

- Can adapt if initial ideas don't work well

**Recommendation: Hybrid approach**

- Use Waterfall structure for major milestones (requirements, design, final delivery)

- Use Agile development within each milestone (2-week sprints)

- Get feedback from 3-5 student testers every 2 weeks

- Maintain good documentation throughout for final submission

**Work organization:**

- Week 1-2: Requirements gathering and initial design (Waterfall)

- Weeks 3-14: Six 2-week sprints building features incrementally (Agile)

- Week 15-16: Final integration, documentation, and presentation (Waterfall)
///
///

### Advanced practice

/// details | Exercise 3: Methodology comparison
    type: question
    open: false

Compare how the Grade Calculator project from Section 1.1 would be handled differently under Waterfall vs Agile approaches.

**Consider:**

- Timeline and phases

- Documentation requirements

- Testing approach

- Stakeholder involvement

- Change management

/// details | Comprehensive solution
    type: success
    open: false

**Waterfall approach:**

*Timeline:* 

- Week 1: Complete requirements gathering and documentation

- Week 2: Detailed design and architecture planning  

- Week 3: Implementation of all functions

- Week 4: Comprehensive testing and bug fixes

- Week 5: Deployment and user training

*Documentation:* Detailed requirements document, design specifications, test plans, user manual

*Testing:* Comprehensive test suite developed after implementation, formal test execution phase

*Stakeholder involvement:* Heavy involvement in week 1, minimal until week 5 demonstration

*Change management:* Changes require formal approval and may delay project timeline

**Agile approach:**

*Timeline:*

- Sprint 1: Basic input validation and average calculation

- Sprint 2: Error handling and user interface improvements  

- Sprint 3: Additional features based on user feedback

- Sprint 4: Polish and final enhancements

*Documentation:* Lightweight user stories, minimal design docs, focus on working code

*Testing:* Test-driven development, continuous testing throughout each sprint

*Stakeholder involvement:* Regular demos every 1-2 weeks, continuous feedback incorporation

*Change management:* Changes welcomed and incorporated in next sprint planning

**Trade-offs:**

- Waterfall provides more predictability and documentation

- Agile delivers working software faster and adapts to changing needs

- For a simple calculator, Waterfall might be overkill but provides good learning structure

- Agile would be better if requirements might evolve (e.g., adding weighted grades, different grading scales)
///
///

## Recap

**Choose your project management approach based on your project's needs:**

**Waterfall** works best when:

- Requirements are clear and stable

- Extensive documentation is needed  

- Timeline and budget are fixed

- Working with large teams or formal processes

**Agile** works best when:

- Requirements might change or evolve

- Rapid feedback and iteration are valuable

- Small, collaborative teams can work closely together

- Innovation and experimentation are important

**For classroom projects:** Consider a hybrid approach that combines Waterfall planning with Agile development sprints. This gives you structure while maintaining flexibility to adapt and improve.

**Remember:** The methodology is a tool to help you succeed, not a rigid rule. Adapt it to fit your project's specific needs and constraints.



