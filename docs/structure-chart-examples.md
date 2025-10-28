# Structure Chart Examples

This page demonstrates the custom structure chart syntax and capabilities.

## Basic Example

A simple structure chart with a control module and sub-modules:

```structure-chart
module main "Grade Calculator"
  module input "Get Input"
  module calc "Calculate Grade"
  module output "Display Result"

main -> input
main -> calc
main -> output
```

## With Connection Types

Shows different types of connections (data flow, control flow, conditional):

```structure-chart
module main "Process Order"
  module validate "Validate Order"
  module check "Check Stock"
  module process "Process Payment"
  module ship "Ship Items"

main -> validate data "order details"
validate -> check control
validate -> process conditional
check -> ship data "items"
```

## Library Modules

Library modules are shown with an underline and can be called from multiple places:

```structure-chart
module app "Main App"
  module userInput "User Input"
  module processData "Process Data"
  library logger "Log Message"

app -> userInput
app -> processData
userInput -> logger data "user action"
processData -> logger data "result"
```

## With Loop

A loop indicator shows repetitive execution:

```structure-chart
module main "Process Files"
  module readFile "Read File"
  module parseData "Parse Data"
  module saveData "Save Data"

main -> readFile
readFile -> parseData
parseData -> saveData

loop over readFile parseData saveData
```

## With Storage

Physical storage elements (databases, files):

```structure-chart
module app "Student System"
  module add "Add Student"
  module view "View Students"
storage db "Student Database"

app -> add
app -> view
add -> db data "student record"
view -> db data "query"
```

## Complete Example

A comprehensive example showing all features:

```structure-chart
# Grade Management System
module main "Grade Manager"
  module input "Input Grades"
  module calc "Calculate Average"
  module validate "Validate Data"
  module report "Generate Report"
  library util "Utility Functions"
storage gradeDB "Grade Database"

main -> input
main -> validate conditional
input -> calc data "grades"
calc -> validate control
validate -> report data "validated grades"
input -> util data "format check"
calc -> util data "math operations"
report -> gradeDB data "save results"

loop over input calc validate
```

## Syntax Reference

### Modules

```text
module id "Label"           # Regular module
library id "Label"          # Library module (underlined, reusable)
storage id "Label"          # Physical storage (curved rectangle)
```

### Connections

```text
from -> to                  # Simple connection
from -> to data "label"     # Data flow (empty circle)
from -> to control          # Control flow (filled circle)
from -> to conditional      # Conditional call (diamond)
```

### Loops

```text
loop over module1 module2 module3    # Curved arrow over modules
```

### Layout

- Indentation (2 spaces per level) determines hierarchy
- Modules at the same indentation appear on the same level
- Parent-child relationships are shown through connections
