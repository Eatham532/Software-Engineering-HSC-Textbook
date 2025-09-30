# 02.02 Io And Purpose Desk And Peer Checking - Quiz

!!! quiz "Check your understanding"

    1. What are the inputs and outputs of this algorithm?

        ```text
        ALGORITHM ConvertTemperature
        BEGIN
            INPUT celsius
            SET fahrenheit = (celsius * 9 / 5) + 32
            OUTPUT "Temperature in Fahrenheit: " + fahrenheit
        END
        ```text

        - Input: fahrenheit; Output: celsius
        - Input: celsius; Output: "Temperature in Fahrenheit: " + fahrenheit { data-correct }
        - Input: temperature; Output: conversion
        - Input: 9, 5, 32; Output: calculation

    1. What is the purpose of this algorithm?

        ```text
        ALGORITHM FindLargest
        BEGIN
            INPUT num1, num2, num3
            SET largest = num1
            IF num2 > largest THEN
                SET largest = num2
            END IF
            IF num3 > largest THEN
                SET largest = num3
            END IF
            OUTPUT largest
        END
        ```text

        - Add three numbers together
        - Find the smallest of three numbers
        - Find the largest of three numbers { data-correct }
        - Calculate the average of three numbers

    1. In desk checking, what should you do first?

        - Start executing the algorithm line by line
        - Choose specific test input values { data-correct }
        - Create a trace table
        - Write down the expected outputs

    1. Complete this desk check for the temperature converter with input celsius = 0:

        ```text
        ALGORITHM ConvertTemperature
        BEGIN
            INPUT celsius
            SET fahrenheit = (celsius * 9 / 5) + 32
            OUTPUT "Temperature in Fahrenheit: " + fahrenheit
        END
        ```text

        What is the final output?

        - "Temperature in Fahrenheit: 0"
        - "Temperature in Fahrenheit: 32" { data-correct }
        - "Temperature in Fahrenheit: 33"
        - "Temperature in Fahrenheit: 273"

    1. Which of these is NOT a benefit of peer checking?

        - Fresh eyes can spot errors you missed
        - Different perspectives reveal edge cases
        - It automatically fixes all algorithm errors { data-correct }
        - Explaining your logic improves clarity

    1. What should you test when desk checking selection structures?

        - Only the most common case
        - Different branches and boundary values { data-correct }
        - Just the first condition
        - Only invalid inputs

    1. Complete the desk check for this algorithm with input: password = "Test5"

        ```text
        ALGORITHM SimplePasswordCheck
        BEGIN
            INPUT password
            SET length = length of password
            IF length >= 8 THEN
                OUTPUT "Valid length"
            ELSE
                OUTPUT "Too short"
            END IF
        END
        ```text

        What is the output?

        - "Valid length"
        - "Too short" { data-correct }
        - "Test5"
        - No output

    1. When peer checking, what should the reviewer focus on?

        - Only checking for syntax errors
        - Rewriting the entire algorithm
        - Verifying logic, edge cases, and desk check results { data-correct }
        - Only looking at the final output

    1. Why is it important to test boundary values when desk checking?

        - They are the easiest to calculate
        - They often reveal off-by-one errors and edge cases { data-correct }
        - They always produce the same results
        - They don't require trace tables

    1. Complete this trace table for the first two steps:

        ```text
        ALGORITHM CalculateBonus
        BEGIN
            INPUT sales, rate
            SET bonus = sales * rate / 100
            IF bonus > 1000 THEN
                SET bonus = 1000
            END IF
            OUTPUT bonus
        END
        ```text

        **Inputs:** sales = 15000, rate = 8

        | Step | Action | sales | rate | bonus |
        |------|--------|-------|------|-------|
        | 1    | INPUT sales | ? | ? | ? |
        | 2    | INPUT rate | ? | ? | ? |

        - Step 1: sales=15000, rate=undefined, bonus=undefined; Step 2: sales=15000, rate=8, bonus=undefined { data-correct }
        - Step 1: sales=0, rate=0, bonus=0; Step 2: sales=15000, rate=8, bonus=1200
        - Step 1: sales=15000, rate=8, bonus=undefined; Step 2: sales=15000, rate=8, bonus=1200
        - Step 1: sales=15000, rate=8, bonus=1000; Step 2: sales=15000, rate=8, bonus=1000
