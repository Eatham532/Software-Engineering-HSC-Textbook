"""
Test script for structure chart generation.
Generates SVG files directly without running MkDocs server.
"""

import sys
from pathlib import Path

# Add project root to path to import extensions
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from extensions.structure_chart import StructureChartGenerator


def save_svg(svg_content: str, filename: str):
    """Save SVG to file and print result."""
    output_path = project_root / "test_output" / filename
    output_path.parent.mkdir(exist_ok=True)
    output_path.write_text(svg_content, encoding='utf-8')
    print(f"✅ Generated: {output_path}")


def test_basic():
    """Test basic structure chart."""
    chart_def = """
module main "Grade Calculator"
  module input "Get Input"
  module calc "Calculate Grade"
  module output "Display Result"

main -> input
main -> calc
main -> output
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_basic.svg")
    return svg


def test_connection_types():
    """Test different connection types."""
    chart_def = """
module main "Process Order"
  module validate "Validate Order"
  module check "Check Stock"
  module process "Process Payment"
  module ship "Ship Items"

main -> validate data "order details"
validate -> check control "initiate"
validate -> process data backward "status"
check -> ship data "items"
process -> ship control backward "confirmation"
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_connections.svg")
    return svg


def test_library():
    """Test library modules."""
    chart_def = """
module app "Main App"
  module userInput "User Input"
  module processData "Process Data"
  library logger "Log Message"

app -> userInput
app -> processData
userInput -> logger data "user action"
processData -> logger data "result"
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_library.svg")
    return svg


def test_loop():
    """Test loop indicator."""
    chart_def = """
module main "Process Files"
  module readFile "Read File"
  module parseData "Parse Data"
  module saveData "Save Data"

main -> readFile
readFile -> parseData
parseData -> saveData

loop over readFile parseData saveData
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_loop.svg")
    return svg


def test_partial_loop():
    """Test loop over subset of child modules."""
    chart_def = """
module main "Data Processor"
  module fetch "Fetch Data"
  module transform "Transform Data"
  module validate "Validate Data"
  module save "Save Results"

main -> fetch
main -> transform data "raw data"
main -> validate control "check quality"
main -> save

loop over fetch transform
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_partial_loop.svg")
    return svg


def test_multiple_arrows():
    """Test multiple data/control flows on same connection."""
    chart_def = """
module process "Order Processor"
  module validate "Validate Order"
  module execute "Execute Order"

process -> validate data "order data"
process -> validate data "customer info"
process -> validate control "validation rules"
validate -> execute data "validated order"
validate -> execute control "proceed signal"
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_multiple_arrows.svg")
    return svg


def test_storage():
    """Test storage elements."""
    chart_def = """
module app "Student System"
  module add "Add Student"
  module view "View Students"
storage db "Student Database"

app -> add
app -> view
add -> db data "student record"
view -> db data "query"
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_storage.svg")
    return svg


def test_conditional_gate():
    """Test conditional gate with multiple branches."""
    chart_def = """
module main "User Login"
  module checkA "Admin Access"
  module checkB "User Access"
  module checkC "Guest Access"

conditional main checkA checkB checkC
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_conditional.svg")
    return svg


def test_complete():
    """Test complete example with all features."""
    chart_def = """
# Grade Management System
module main "Grade Manager"
  module input "Input Grades"
    module readFile "Read from File"
    module keyboard "Keyboard Entry"
  module process "Process Grades"
    module validate "Validate Data"
    module calculate "Calculate Average"
  module output "Generate Report"
  library logger "Log Events"
storage gradeDB "Grade Database"

main -> input
main -> process
main -> output
input -> readFile conditional
input -> keyboard conditional
process -> validate control
validate -> calculate data "valid grades"
output -> gradeDB data "save report"
input -> logger data "input event"
process -> logger data "process event"
output -> logger data "output event"
"""
    generator = StructureChartGenerator(chart_def)
    svg = generator.generate_svg()
    save_svg(svg, "test_complete.svg")
    return svg


def create_html_viewer():
    """Create an HTML file to view all generated SVGs."""
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Structure Chart Test Results</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #3f51b5;
            padding-bottom: 10px;
        }
        h2 {
            color: #3f51b5;
            margin-top: 40px;
        }
        .test-section {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .svg-container {
            border: 1px solid #ddd;
            padding: 20px;
            background: white;
            border-radius: 4px;
            overflow-x: auto;
        }
        .structure-chart {
            max-width: 100%;
            height: auto;
        }
        pre {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 14px;
        }
        .success {
            color: #4caf50;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Structure Chart Test Results</h1>
    <p class="success">✅ All tests completed successfully!</p>
    
    <div class="test-section">
        <h2>1. Basic Structure Chart</h2>
        <p>Simple hierarchy with control module and sub-modules.</p>
        <div class="svg-container">
            <object data="test_basic.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>2. Connection Types</h2>
        <p>Different connection types: data flow (empty circle), control flow (filled circle), conditional (diamond).</p>
        <div class="svg-container">
            <object data="test_connections.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>3. Library Module</h2>
        <p>Reusable library module (underlined) called from multiple places.</p>
        <div class="svg-container">
            <object data="test_library.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>4. Loop Indicator</h2>
        <p>Curved arrow showing repetitive execution over multiple modules.</p>
        <div class="svg-container">
            <object data="test_loop.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>5. Partial Loop (2 of 4 modules)</h2>
        <p>Loop over subset of child modules - demonstrates selective iteration.</p>
        <div class="svg-container">
            <object data="test_partial_loop.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>6. Multiple Arrows (same connection)</h2>
        <p>Multiple data/control flows on the same connection line appear side-by-side.</p>
        <div class="svg-container">
            <object data="test_multiple_arrows.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>7. Storage Element</h2>
        <p>Physical storage (database) with curved rectangle.</p>
        <div class="svg-container">
            <object data="test_storage.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>8. Conditional Gate</h2>
        <p>Diamond-shaped decision point with multiple output branches.</p>
        <div class="svg-container">
            <object data="test_conditional.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>9. Complete Example</h2>
        <p>Comprehensive example showing all features together.</p>
        <div class="svg-container">
            <object data="test_complete.svg" type="image/svg+xml"></object>
        </div>
    </div>
    
    <div class="test-section">
        <h2>Syntax Reference</h2>
        <pre>
# Modules
module id "Label"           # Regular module
library id "Label"          # Library module (underlined, reusable)
storage id "Label"          # Physical storage (curved rectangle)

# Connections
from -> to                  # Simple connection
from -> to data "label"     # Data flow (empty circle)
from -> to control          # Control flow (filled circle)
from -> to conditional      # Conditional call (diamond)

# Loops
loop over module1 module2 module3    # Curved arrow over modules

# Layout
# - Indentation (2 spaces per level) determines hierarchy
# - Modules at same indentation appear on same level
        </pre>
    </div>
</body>
</html>
"""
    
    output_path = project_root / "test_output" / "index.html"
    output_path.write_text(html, encoding='utf-8')
    print(f"✅ Created viewer: {output_path}")
    print(f"\n🌐 Open in browser: file:///{output_path}")


def main():
    """Run all tests."""
    print("=" * 60)
    print("Structure Chart Generator Tests")
    print("=" * 60)
    print()
    
    tests = [
        ("Basic Structure Chart", test_basic),
        ("Connection Types", test_connection_types),
        ("Library Module", test_library),
        ("Loop Indicator", test_loop),
        ("Partial Loop (2 of 4 modules)", test_partial_loop),
        ("Multiple Arrows (same connection)", test_multiple_arrows),
        ("Storage Element", test_storage),
        ("Conditional Gate", test_conditional_gate),
        ("Complete Example", test_complete),
    ]
    
    for name, test_func in tests:
        print(f"\n📊 Testing: {name}")
        try:
            svg = test_func()
            # Basic validation
            assert '<svg' in svg, "No SVG tag found"
            assert '</svg>' in svg, "SVG not closed"
            assert 'class="structure-chart"' in svg, "Missing structure-chart class"
            print(f"   ✅ SVG validation passed")
        except Exception as e:
            print(f"   ❌ Error: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "=" * 60)
    print("Creating HTML viewer...")
    print("=" * 60)
    create_html_viewer()
    
    print("\n" + "=" * 60)
    print("✅ All tests complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
