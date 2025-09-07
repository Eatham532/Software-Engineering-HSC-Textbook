# Algorithmic Design Strategies

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Apply divide and conquer as an algorithmic design strategy
    - Apply backtracking as an algorithmic design strategy
    - Identify when each strategy is most appropriate
    - Develop algorithms using these strategies
    - Analyse the effectiveness of different design approaches

## Introduction

When solving complex problems, programmers use different **algorithmic design strategies** to break down the problem into manageable pieces. These strategies provide systematic approaches to algorithm development, making it easier to solve difficult problems efficiently.

The NSW Software Engineering syllabus focuses on two key strategies:

- **Divide and Conquer:** Break a problem into smaller subproblems, solve each separately, then combine the results

- **Backtracking:** Explore potential solutions by trying different paths and backing up when a path leads to a dead end

## Divide and Conquer

Divide and conquer is a problem-solving strategy that works by:

1. **Divide:** Break the original problem into smaller subproblems of the same type

2. **Conquer:** Solve the subproblems recursively (or solve base cases directly)

3. **Combine:** Merge the solutions of subproblems to solve the original problem

### When to use divide and conquer

Divide and conquer works best when:

- The problem can be broken into similar smaller problems

- The subproblems are independent (can be solved separately)

- There's a clear way to combine solutions

- The problem has a recursive structure

### Example 1: Finding the maximum value in a list

Instead of checking every element one by one, we can use divide and conquer:

```kroki-mermaid
    flowchart TD
        A["Find max in [8, 3, 9, 1, 7, 5]"] --> B["Split into two halves"]
        B --> C["Find max in [8, 3, 9]"]
        B --> D["Find max in [1, 7, 5]"]
        C --> E["Split [8, 3, 9]"]
        D --> F["Split [1, 7, 5]"]
        E --> G["max([8]) = 8"]
        E --> H["max([3, 9]) = 9"]
        F --> I["max([1]) = 1"]
        F --> J["max([7, 5]) = 7"]
        G --> K["max(8, 9) = 9"]
        H --> K
        I --> L["max(1, 7) = 7"]
        J --> L
        K --> M["max(9, 7) = 9"]
        L --> M
        M --> N["Final answer: 9"]
```

**Algorithm:**

```text
ALGORITHM FindMaxDivideConquer(list, start, end)
BEGIN
    // Base case: only one element
    IF start = end THEN
        RETURN list[start]
    END IF
    
    // Divide: find the middle point
    SET middle = (start + end) / 2
    
    // Conquer: recursively find max in both halves
    SET leftMax = FindMaxDivideConquer(list, start, middle)
    SET rightMax = FindMaxDivideConquer(list, middle + 1, end)
    
    // Combine: return the larger of the two maximums
    IF leftMax > rightMax THEN
        RETURN leftMax
    ELSE
        RETURN rightMax
    END IF
END
```

### Example 2: Merge Sort

Merge sort is a classic divide and conquer algorithm for sorting:

```kroki-mermaid
    flowchart TD
        A["[38, 27, 43, 3, 9, 82, 10]"] --> B["Divide"]
        B --> C["[38, 27, 43, 3]"]
        B --> D["[9, 82, 10]"]
        C --> E["[38, 27]"]
        C --> F["[43, 3]"]
        D --> G["[9, 82]"]
        D --> H["[10]"]
        E --> I["[38]"]
        E --> J["[27]"]
        F --> K["[43]"]
        F --> L["[3]"]
        G --> M["[9]"]
        G --> N["[82]"]
        
        I --> O["[27, 38]"]
        J --> O
        K --> P["[3, 43]"]
        L --> P
        M --> Q["[9, 82]"]
        N --> Q
        
        O --> R["[3, 27, 38, 43]"]
        P --> R
        Q --> S["[9, 10, 82]"]
        H --> S
        
        R --> T["[3, 9, 10, 27, 38, 43, 82]"]
        S --> T
```

**Algorithm:**

```text
ALGORITHM MergeSort(list)
BEGIN
    // Base case: list with 0 or 1 element is already sorted
    IF length of list ≤ 1 THEN
        RETURN list
    END IF
    
    // Divide: split list into two halves
    SET middle = length of list / 2
    SET left = first half of list (0 to middle-1)
    SET right = second half of list (middle to end)
    
    // Conquer: recursively sort both halves
    SET sortedLeft = MergeSort(left)
    SET sortedRight = MergeSort(right)
    
    // Combine: merge the sorted halves
    RETURN Merge(sortedLeft, sortedRight)
END

ALGORITHM Merge(left, right)
BEGIN
    SET result = empty list
    SET i = 0, j = 0
    
    // Compare elements and merge in sorted order
    WHILE i < length of left AND j < length of right DO
        IF left[i] ≤ right[j] THEN
            ADD left[i] to result
            SET i = i + 1
        ELSE
            ADD right[j] to result
            SET j = j + 1
        END IF
    END WHILE
    
    // Add remaining elements
    WHILE i < length of left DO
        ADD left[i] to result
        SET i = i + 1
    END WHILE
    
    WHILE j < length of right DO
        ADD right[j] to result
        SET j = j + 1
    END WHILE
    
    RETURN result
END
```

## Backtracking

Backtracking is a systematic way to explore all possible solutions to a problem by:

1. **Try:** Make a choice and move forward

2. **Check:** Test if this choice leads to a valid solution

3. **Backtrack:** If the choice doesn't work, undo it and try a different option

4. **Repeat:** Continue until you find a solution or exhaust all possibilities

### When to use backtracking

Backtracking is ideal for:

- Problems with multiple possible solutions

- Constraint satisfaction problems

- Puzzles and games

- Finding optimal paths

- Decision trees with multiple branches

### Example 1: N-Queens Problem

The N-Queens problem asks: "Can you place N queens on an N×N chessboard so that no two queens attack each other?"

```kroki-mermaid
    flowchart TD
        A["Start with empty 4×4 board"] --> B["Try placing Queen 1 in row 1"]
        B --> C["Place in column 1"]
        C --> D["Try placing Queen 2 in row 2"]
        D --> E["Column 1? No - attacked by Queen 1"]
        E --> F["Column 2? No - diagonal attack"]
        F --> G["Column 3? Yes - place Queen 2"]
        G --> H["Try placing Queen 3 in row 3"]
        H --> I["Column 1? No - attacked"]
        I --> J["Column 2? No - attacked"]
        J --> K["Column 3? No - attacked"]
        K --> L["Column 4? No - attacked"]
        L --> M["No valid position - backtrack"]
        M --> N["Remove Queen 2, try column 4"]
        N --> O["Continue searching..."]
```

**Algorithm:**

```text
ALGORITHM SolveNQueens(board, row, n)
BEGIN
    // Base case: all queens placed successfully
    IF row = n THEN
        RETURN true (solution found)
    END IF
    
    // Try placing a queen in each column of this row
    FOR col = 0 TO n-1 DO
        IF IsSafe(board, row, col, n) THEN
            // Place queen
            SET board[row][col] = 1
            
            // Recursively place remaining queens
            IF SolveNQueens(board, row + 1, n) THEN
                RETURN true
            END IF
            
            // Backtrack: remove queen if placement doesn't work
            SET board[row][col] = 0
        END IF
    END FOR
    
    // No valid placement found in this row
    RETURN false
END

ALGORITHM IsSafe(board, row, col, n)
BEGIN
    // Check if placing a queen at (row, col) is safe
    
    // Check column
    FOR i = 0 TO row-1 DO
        IF board[i][col] = 1 THEN
            RETURN false
        END IF
    END FOR
    
    // Check diagonal (top-left to bottom-right)
    SET i = row - 1, j = col - 1
    WHILE i ≥ 0 AND j ≥ 0 DO
        IF board[i][j] = 1 THEN
            RETURN false
        END IF
        SET i = i - 1, j = j - 1
    END WHILE
    
    // Check diagonal (top-right to bottom-left)
    SET i = row - 1, j = col + 1
    WHILE i ≥ 0 AND j < n DO
        IF board[i][j] = 1 THEN
            RETURN false
        END IF
        SET i = i - 1, j = j + 1
    END WHILE
    
    RETURN true
END
```

### Example 2: Maze Solving

Find a path from start to end in a maze:

```kroki-mermaid
    flowchart TD
        A["Start at entrance"] --> B["Try moving right"]
        B --> C["Hit wall - backtrack"]
        C --> D["Try moving down"]
        D --> E["Valid path - continue"]
        E --> F["Try moving right again"]
        F --> G["Hit wall - backtrack"]
        G --> H["Try moving down"]
        H --> I["Continue until exit found"]
```

**Algorithm:**

```text
ALGORITHM SolveMaze(maze, x, y, solution)
BEGIN
    // Base case: reached the destination
    IF x = endX AND y = endY THEN
        SET solution[x][y] = 1
        RETURN true
    END IF
    
    // Check if current position is valid
    IF IsSafeMove(maze, x, y) THEN
        // Mark current cell as part of solution
        SET solution[x][y] = 1
        
        // Try moving in all four directions
        // Right
        IF SolveMaze(maze, x + 1, y, solution) THEN
            RETURN true
        END IF
        
        // Down
        IF SolveMaze(maze, x, y + 1, solution) THEN
            RETURN true
        END IF
        
        // Left
        IF SolveMaze(maze, x - 1, y, solution) THEN
            RETURN true
        END IF
        
        // Up
        IF SolveMaze(maze, x, y - 1, solution) THEN
            RETURN true
        END IF
        
        // Backtrack: no path found through this cell
        SET solution[x][y] = 0
        RETURN false
    END IF
    
    RETURN false
END

ALGORITHM IsSafeMove(maze, x, y)
BEGIN
    // Check boundaries and if cell is open
    IF x ≥ 0 AND x < rows AND y ≥ 0 AND y < cols THEN
        IF maze[x][y] = 1 THEN  // 1 = open path, 0 = wall
            RETURN true
        END IF
    END IF
    RETURN false
END
```

## Comparing Design Strategies

| Aspect | Divide and Conquer | Backtracking |
|--------|-------------------|--------------|
| **Approach** | Break problem into smaller pieces | Try solutions systematically |
| **When to use** | Independent subproblems | Multiple possible solutions |
| **Structure** | Usually recursive | Recursive with choice exploration |
| **Efficiency** | Often very efficient | Can be slow (explores many paths) |
| **Examples** | Merge sort, binary search | N-Queens, Sudoku, maze solving |
| **Memory use** | Recursive stack | Stack for backtracking |

## Choosing the Right Strategy

### Use Divide and Conquer when:

- Problem can be split into independent subproblems

- Subproblems are of the same type as original

- You can efficiently combine solutions

- Examples: sorting, searching, mathematical calculations

### Use Backtracking when:

- Multiple valid solutions exist

- You need to explore different possibilities

- Constraints must be satisfied

- Examples: puzzles, games, optimization problems

## Practice Problems

### Problem 1: Binary Search (Divide and Conquer)

Design an algorithm to find a target value in a sorted array using divide and conquer.

**Hint:** Compare the target with the middle element, then search only half of the array.

### Problem 2: Sudoku Solver (Backtracking)

Design an algorithm to solve a 9×9 Sudoku puzzle using backtracking.

**Hint:** Try placing digits 1-9 in empty cells, backtrack when constraints are violated.

### Problem 3: Finding All Permutations (Backtracking)

Design an algorithm to find all possible arrangements of the letters in a word.

**Hint:** Choose a letter for each position, backtrack when you've used all letters.

## Summary

**Algorithmic design strategies provide structured approaches to problem-solving:**

**Divide and Conquer:**

- Breaks problems into smaller, independent subproblems

- Solves subproblems recursively

- Combines solutions efficiently

- Great for problems with recursive structure

**Backtracking:**

- Systematically explores all possible solutions

- Makes choices and undoes them if they don't work

- Builds solutions incrementally

- Perfect for constraint satisfaction problems

**Key takeaway:** Choose your strategy based on the problem structure - divide and conquer for decomposable problems, backtracking for exploring multiple possibilities.

!!! tip "Next Section"
    In Section 2.3, we'll learn about developing structured algorithms using pseudocode and flowcharts, and how to use subprograms effectively.
