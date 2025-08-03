# Number Systems

## Binary, Decimal, and Hexadecimal

Computers use different number systems to represent and process data. Understanding these systems is fundamental to programming and computer science.

### The Three Essential Number Systems

#### Binary (Base 2)
- **Uses only digits**: 0 and 1
- **Each position represents**: Powers of 2 (1, 2, 4, 8, 16, 32, ...)
- **Why important**: This is how computers actually store and process all information

#### Decimal (Base 10)
- **Uses digits**: 0-9
- **Each position represents**: Powers of 10 (1, 10, 100, 1000, ...)
- **Why important**: This is the number system humans naturally use

#### Hexadecimal (Base 16)
- **Uses symbols**: 0-9 and A-F (where A=10, B=11, C=12, D=13, E=14, F=15)
- **Each position represents**: Powers of 16 (1, 16, 256, 4096, ...)
- **Why important**: Compact way to represent binary data (common in programming)

## Number System Conversions

### Binary to Decimal
Convert 1101₂ to decimal:
```
Position values: 8  4  2  1
Binary digits:   1  1  0  1
                 ↓  ↓  ↓  ↓
Calculation: (1×8) + (1×4) + (0×2) + (1×1) = 8 + 4 + 0 + 1 = 13₁₀
```

### Decimal to Binary
Convert 19₁₀ to binary using division by 2:
```
19 ÷ 2 = 9 remainder 1
 9 ÷ 2 = 4 remainder 1
 4 ÷ 2 = 2 remainder 0
 2 ÷ 2 = 1 remainder 0
 1 ÷ 2 = 0 remainder 1
 
Reading remainders bottom to top: 10011₂
```

### Decimal to Hexadecimal
Convert 255₁₀ to hexadecimal:
```
255 ÷ 16 = 15 remainder 15 (F in hex)
 15 ÷ 16 = 0  remainder 15 (F in hex)
 
Result: FF₁₆
```

### Hexadecimal to Decimal
Convert 2A₁₆ to decimal:
```
Position values: 16¹  16⁰
Hex digits:       2    A(10)
                  ↓    ↓
Calculation: (2×16) + (10×1) = 32 + 10 = 42₁₀
```

## Real-World Applications

### Where You See These Number Systems

**Binary:**
- CPU instructions and machine code
- Digital circuit design
- Network protocols and data transmission

**Hexadecimal:**
- Memory addresses: `0x7FFF5AB0`
- Color codes in web design: `#FF5733` (red-orange)
- MAC addresses: `00:1B:44:11:3A:B7`
- File signatures and checksums

**Decimal:**
- User interfaces and human-readable data
- Mathematical calculations
- Business logic and accounting

### StudyBuddy Example
In our StudyBuddy app:
- **User sees**: Assignment due date as "March 15, 2025" (human-friendly)
- **App stores**: Unix timestamp `1742169600` (decimal)
- **Computer processes**: Binary representation for calculations
- **Developer debugs**: Hexadecimal memory addresses `0x1A4F2C80`

## Two's Complement for Negative Numbers

Computers use **two's complement** to represent negative numbers in binary.

### How Two's Complement Works

1. **Write the positive number in binary**
2. **Invert all bits** (0→1, 1→0)
3. **Add 1** to the result

### Example: Convert -5 to 8-bit Two's Complement

```
Step 1: 5 in 8-bit binary: 00000101
Step 2: Invert all bits:    11111010
Step 3: Add 1:             11111011

Result: -5 = 11111011 in two's complement
```

### Why Two's Complement?

- **Simplifies arithmetic**: Addition and subtraction use the same circuits
- **Single zero representation**: Unlike sign-magnitude, there's only one way to represent 0
- **Hardware efficiency**: No special cases for negative number operations

### Range of Values
In 8-bit two's complement:
- **Positive numbers**: 0 to 127 (00000000 to 01111111)
- **Negative numbers**: -1 to -128 (11111111 to 10000000)

## Practice Exercises

1. Convert 42₁₀ to binary and hexadecimal
2. Convert 1010₂ to decimal and hexadecimal  
3. Convert A7₁₆ to binary and decimal
4. Represent -12 in 8-bit two's complement
5. What decimal number does 11110000₂ represent in two's complement?

## Key Takeaways

- **Binary is fundamental**: All computer data is ultimately stored in binary
- **Hexadecimal is practical**: Provides a compact, readable way to represent binary data
- **Conversions are essential**: Programmers frequently convert between number systems
- **Two's complement is universal**: Standard method for representing negative integers
- **Context matters**: The same bit pattern can represent different values depending on interpretation

---

**Next:** Learn about [Data Types](data-types.md) to understand how different kinds of information are stored and used in programs.
