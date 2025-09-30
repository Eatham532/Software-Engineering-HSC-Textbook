# 02.03 Pseudocode And Flowcharts - Quiz

!!! quiz "Check your understanding"

    1. What is the correct pseudocode pattern for a simple IF statement?

        - IF condition THEN statements END
        - IF condition THEN statements END IF { data-correct }
        - IF (condition) { statements }
        - IF condition: statements

    1. Complete this pseudocode to calculate the area of a rectangle:

        ```
        ALGORITHM CalculateRectangleArea
        BEGIN
            INPUT length
            INPUT width
            _______________
            OUTPUT area
        END
        ```

        - area = length * width
        - SET area = length * width { data-correct }
        - CALCULATE area = length * width
        - LET area = length * width

    1. What shape represents a decision/condition in a flowchart?

        - Rectangle
        - Oval
        - Diamond { data-correct }
        - Circle

    1. Which PlantUML syntax correctly represents a decision in an activity diagram?

        - {age >= 18} then (yes) else (no)
        - if (age >= 18?) then (yes) else (no) { data-correct }
        - decision (age >= 18) yes/no
        - choice: age >= 18 | yes | no

    1. What's wrong with this pseudocode?

        ```
        IF score>=90 THEN grade="A" ELSE IF score>=80 THEN grade="B" END IF
        ```

        - Missing SET keywords
        - Poor formatting and indentation
        - Multiple actions on one line
        - All of the above { data-correct }

    1. Complete this pseudocode for counting from 1 to 10:

        ```
        ALGORITHM CountToTen
        BEGIN
            SET count = 1
            ________________
                OUTPUT count
                SET count = count + 1
            ________________
        END
        ```

        - WHILE count <= 10 DO ... END WHILE { data-correct }
        - FOR count = 1 TO 10 DO ... END FOR
        - REPEAT count <= 10 ... UNTIL
        - LOOP count <= 10 ... END LOOP

    1. Convert this natural language to pseudocode:

        "Ask for two numbers, multiply them together, and display the result."

        - GET num1, num2; SHOW num1 * num2
        - INPUT num1, num2; OUTPUT num1 * num2
        - INPUT num1; INPUT num2; SET result = num1 * num2; OUTPUT result { data-correct }
        - READ num1, num2; PRINT num1 * num2

    1. In PlantUML activity diagrams, what represents the start and end of the algorithm?

        - (start) and (end)
        - begin and finish
        - start and stop { data-correct }
        - :start: and :stop:

    1. What's the best way to represent this logic in pseudocode?

        "If it's raining AND you don't have an umbrella, get wet. Otherwise, stay dry."

        - IF raining AND no umbrella THEN get wet ELSE stay dry END IF
        - IF isRaining = true AND hasUmbrella = false THEN OUTPUT "get wet" ELSE OUTPUT "stay dry" END IF { data-correct }
        - IF (raining) AND (not umbrella) { get wet } ELSE { stay dry }
        - IF weather = rain AND umbrella = no THEN wet = yes ELSE dry = yes END IF

    1. Which of these is NOT a benefit of using pseudocode before writing actual code?

        - Focus on logic without syntax details
        - Easier to communicate with non-programmers
        - Automatically generates working code { data-correct }
        - Helps identify logic errors early

    1. Complete this PlantUML activity diagram for a simple login system:

        ```kroki-plantuml
        start
        :INPUT username;
        :INPUT password;
        if (___________?) then (yes)
          :OUTPUT "Login successful";
        else (no)
          :OUTPUT "Invalid credentials";
        endif
        stop
        ```

        - username = "admin" AND password = "secret" { data-correct }
        - credentials valid
        - login correct
        - username AND password

    1. What's the difference between pseudocode and actual programming code?

        - Pseudocode uses natural language structure without specific syntax rules { data-correct }
        - Pseudocode can't represent complex algorithms
        - Programming code is always longer than pseudocode
        - There is no difference
