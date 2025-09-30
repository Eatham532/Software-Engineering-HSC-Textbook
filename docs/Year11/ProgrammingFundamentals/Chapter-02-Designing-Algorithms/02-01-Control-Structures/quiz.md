# 02.01 Control Structures - Quiz

!!! quiz "Check your understanding"

    1. What is the main characteristic of sequence control structure?

        - Steps are executed one after another in a fixed order { data-correct }
        - Steps are repeated multiple times based on a condition
        - Steps are executed only if certain conditions are met
        - Steps can be executed in any order

    1. Look at this flowchart. What type of control structure does it represent?

        ```kroki-flowchart
        flowchart TD
            A[Start] --> B{Temperature > 30°C?}
            B -->|Yes| C[Turn on air conditioning]
            B -->|No| D[Open windows]
            C --> E[End]
            D --> E
        ```

        - Sequence
        - Selection (IF-THEN-ELSE) { data-correct }
        - Iteration (loop)
        - Multiple selection (CASE)

    1. Which type of loop should you use when you know exactly how many times to repeat an action?

        - FOR loop (counted loop) { data-correct }
        - WHILE loop (conditional loop)
        - IF-THEN loop
        - CASE loop

    1. Trace through this algorithm with input numbers 8, 3, 12. What will be the final value of 'result'?

        ```
        ALGORITHM Mystery
        BEGIN
            INPUT a, b, c
            SET result = a

            IF b > result THEN
                SET result = b
            END IF

            IF c > result THEN
                SET result = c
            END IF

            OUTPUT result
        END
        ```

        - 8
        - 3
        - 12 { data-correct }
        - 23

    1. What will this loop output?

        ```
        SET counter = 1
        WHILE counter <= 3 DO
            OUTPUT counter * 2
            SET counter = counter + 1
        END WHILE
        ```

        - 1, 2, 3
        - 2, 4, 6 { data-correct }
        - 2, 4, 6, 8
        - 1, 4, 9

    1. Which control structure is shown in this flowchart?

        ```kroki-flowchart
        flowchart TD
            A[Start] --> B[Set count = 1]
            B --> C{count <= 5?}
            C -->|Yes| D[Print count]
            D --> E[count = count + 1]
            E --> C
            C -->|No| F[End]
        ```

        - Sequence
        - Selection (IF-THEN-ELSE)
        - Iteration (WHILE loop) { data-correct }
        - Multiple selection (CASE)

    1. You want to create an algorithm that processes student grades until the user enters -1 to stop. Which control structure combination would be most appropriate?

        - Only sequence - just process grades in order
        - Only selection - check if grade is valid
        - Selection inside iteration - loop until -1, checking validity each time { data-correct }
        - Only iteration - just repeat the same process

    1. What is the purpose of tracing an algorithm?

        - To make the algorithm run faster
        - To convert it to a programming language
        - To verify it works correctly by following through step-by-step with sample data { data-correct }
        - To create flowcharts from pseudocode
