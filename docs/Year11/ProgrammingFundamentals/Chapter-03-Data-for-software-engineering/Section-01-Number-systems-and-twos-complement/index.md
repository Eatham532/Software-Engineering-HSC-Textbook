s# 3.1 Number systems and two's complement

!!! abstract "Learning objectives"
    By the end of this section, you will be able to:
    - Convert between decimal, binary, and hexadecimal number systems
    - Represent negative integers using two's complement
    - Verify conversions using Python's built-in functions

## Why this matters

Computers store everything as bits (0s and 1s). To work effectively with software engineering, we need to understand how computers represent numbers, especially negative values. This knowledge helps when debugging, working with file formats, and understanding data constraints.

## Number systems overview

Different **number systems** (or bases) use different sets of digits to represent the same values:

- **Decimal** (base 10): Uses digits 0-9

- **Binary** (base 2): Uses digits 0-1  

- **Hexadecimal** (base 16): Uses digits 0-9 and letters A-F

The key principle: each position represents a power of the base.

### Decimal example

The number 1,347 in decimal means:

- 1 × 10³ + 3 × 10² + 4 × 10¹ + 7 × 10⁰

- = 1000 + 300 + 40 + 7 = 1,347

## Converting between systems

### Decimal to binary (repeated division)

To convert decimal 45 to binary:

1. Divide by 2, note the remainder

2. Continue with the quotient until it reaches 0

3. Read remainders from bottom to top

```text
45 ÷ 2 = 22 remainder 1
22 ÷ 2 = 11 remainder 0  
11 ÷ 2 = 5  remainder 1
5  ÷ 2 = 2  remainder 1
2  ÷ 2 = 1  remainder 0
1  ÷ 2 = 0  remainder 1
```

Reading bottom to top: **101101₂**

### Binary to decimal (positional values)

To convert 101101₂ to decimal:

```text
Position:  5  4  3  2  1  0
Digit:     1  0  1  1  0  1
Value:     1×2⁵ + 0×2⁴ + 1×2³ + 1×2² + 0×2¹ + 1×2⁰
         = 32 + 0 + 8 + 4 + 0 + 1 = 45
```

### Hexadecimal conversions

Hexadecimal is convenient because each hex digit represents exactly 4 binary bits:

| Hex | Binary | Decimal |
|-----|--------|---------|
| 0   | 0000   | 0       |
| 1   | 0001   | 1       |
| ...  | ...    | ...     |
| 9   | 1001   | 9       |
| A   | 1010   | 10      |
| B   | 1011   | 11      |
| C   | 1100   | 12      |
| D   | 1101   | 13      |
| E   | 1110   | 14      |
| F   | 1111   | 15      |

**Example:** Convert 101101₂ to hex:

1. Group into 4-bit chunks from right: 0010 1101

2. Convert each chunk: 0010 = 2, 1101 = D

3. Result: **2D₁₆**

## Two's complement for negative numbers

**Two's complement** is how computers represent negative integers. It allows the same arithmetic circuits to handle both positive and negative numbers.

### The process

To represent a negative number in two's complement:

1. Start with the positive binary representation

2. **Flip all bits** (0→1, 1→0) - this is called "one's complement"

3. **Add 1** to the result

### Example: -18 in 8-bit two's complement

Start with +18: `00010010`

1. Flip all bits: `11101101`

2. Add 1: `11101110`

So -18 = `11101110` in 8-bit two's complement.

### Understanding the range

For N-bit two's complement:

- **Range:** -2ⁿ⁻¹ to +2ⁿ⁻¹-1

- **8-bit range:** -128 to +127

- **16-bit range:** -32,768 to +32,767

!!! warning "Key insight"
    The most significant bit (leftmost) indicates the sign: 0 = positive, 1 = negative

## Verifying with Python

Python provides built-in functions to work with different number systems:

```python
# Converting decimal to other bases
n = 45
print(bin(n))    # Output: 0b101101 (binary)
print(hex(n))    # Output: 0x2d (hexadecimal)

# Converting back to decimal
print(int('101101', 2))    # Output: 45 (from binary)
print(int('2d', 16))       # Output: 45 (from hex)

# Working with negative numbers and two's complement
# Python handles this automatically, but we can see the bit pattern
neg_18 = -18
# Use bitwise AND with 0xFF to see 8-bit representation
eight_bit_pattern = neg_18 & 0xFF
print(bin(eight_bit_pattern))  # Output: 0b11101110

# Verify this matches our manual calculation
manual_calc = 0b11101110
print(f"Manual: {manual_calc}, Python: {eight_bit_pattern}")
print(f"Are they equal? {manual_calc == eight_bit_pattern}")
```

## Practice activity

Try these conversions by hand, then verify with Python:

1. Convert decimal 67 to binary

2. Convert binary 1100101₂ to decimal  

3. Convert decimal 67 to hexadecimal

4. Find the 8-bit two's complement representation of -25

**Solutions:**

1. 67₁₀ = 1000011₂

2. 1100101₂ = 101₁₀

3. 67₁₀ = 43₁₆

4. -25 = 11100111₂ (8-bit two's complement)

## Summary

- **Binary, decimal, and hexadecimal** are different ways to write the same values

- **Conversion methods:** repeated division (to binary), positional values (from binary), grouping by 4s (binary ↔ hex)

- **Two's complement** represents negative integers by flipping bits and adding 1

- **Python functions:** `bin()`, `hex()`, `int()` help verify manual calculations

Understanding these number systems is essential for working with computer memory, file formats, and debugging low-level issues in software engineering.
