"""
Custom Structure Chart Extension for MkDocs
Generates SVG structure charts from a simple text-based syntax.

Structure Chart Elements:
1. Module - Rectangle with name
   - Control Module: Branches to multiple submodules
   - Sub Module: Child of another module
   - Library Module: Reusable, invokable from any module (underlined)
2. Conditional Call - Diamond on connection line
3. Loop - Curved arrow covering multiple modules
4. Data Flow - Arrow with empty circle
5. Control Flow - Arrow with filled circle
6. Physical Storage - Curved rectangle
"""

from markdown.extensions import Extension
from markdown.preprocessors import Preprocessor
import re
import hashlib
from xml.etree import ElementTree as etree


class StructureChartGenerator:
    """Generates SVG structure charts from text definitions."""
    
    # Layout constants
    MODULE_WIDTH = 120
    MODULE_HEIGHT = 50
    MODULE_SPACING_X = 40
    MODULE_SPACING_Y = 80
    LIBRARY_MODULE_COLOR = "#e3f2fd"  # Light blue for library modules
    MODULE_COLOR = "#ffffff"
    STROKE_COLOR = "#333333"
    STORAGE_COLOR = "#fff9c4"  # Light yellow for storage
    
    def __init__(self, chart_def: str):
        """
        Initialize with chart definition.
        
        Args:
            chart_def: Text definition of the structure chart
        """
        self.chart_def = chart_def
        self.modules = {}  # id -> module data
        self.connections = []  # list of connection data
        self.conditionals = []  # list of conditional gates (diamond with multiple outputs)
        self.loops = []  # list of loop definitions
        self.storages = []  # list of storage elements
        self.levels = {}  # level -> list of module ids
        
    def parse(self):
        """Parse the chart definition."""
        lines = self.chart_def.strip().split('\n')
        current_level = 0
        
        for line in lines:
            line = line.rstrip()
            if not line or line.strip().startswith('#'):
                continue
            
            # Calculate indentation level (2 spaces = 1 level)
            indent = len(line) - len(line.lstrip())
            level = indent // 2
            content = line.strip()
            
            # Parse different element types
            if content.startswith('module '):
                self._parse_module(content, level)
            elif content.startswith('library '):
                self._parse_library(content, level)
            elif content.startswith('storage '):
                self._parse_storage(content, level)
            elif content.startswith('conditional '):
                self._parse_conditional(content)
            elif content.startswith('loop '):
                self._parse_loop(content)
            elif '->' in content:
                self._parse_connection(content)
    
    def _parse_module(self, content: str, level: int):
        """Parse a module definition: module id "Label" """
        match = re.match(r'module\s+(\w+)\s+"([^"]+)"', content)
        if match:
            module_id = match.group(1)
            label = match.group(2)
            self.modules[module_id] = {
                'id': module_id,
                'label': label,
                'level': level,
                'type': 'module'
            }
            if level not in self.levels:
                self.levels[level] = []
            self.levels[level].append(module_id)
    
    def _parse_library(self, content: str, level: int):
        """Parse a library module: library id "Label" """
        match = re.match(r'library\s+(\w+)\s+"([^"]+)"', content)
        if match:
            module_id = match.group(1)
            label = match.group(2)
            self.modules[module_id] = {
                'id': module_id,
                'label': label,
                'level': level,
                'type': 'library'
            }
            if level not in self.levels:
                self.levels[level] = []
            self.levels[level].append(module_id)
    
    def _parse_storage(self, content: str, level: int):
        """Parse a storage element: storage id "Label" """
        match = re.match(r'storage\s+(\w+)\s+"([^"]+)"', content)
        if match:
            storage_id = match.group(1)
            label = match.group(2)
            self.storages.append({
                'id': storage_id,
                'label': label,
                'level': level
            })
    
    def _parse_conditional(self, content: str):
        """
        Parse a conditional gate: conditional from to_id1 to_id2 to_id3
        Example: conditional main optionA optionB optionC
        """
        parts = content.split()[1:]  # Skip 'conditional' keyword
        if len(parts) < 2:
            return
        
        from_id = parts[0]
        to_ids = parts[1:]
        
        self.conditionals.append({
            'from': from_id,
            'to_list': to_ids
        })
    
    def _parse_loop(self, content: str):
        """Parse a loop definition: loop over id1 id2 id3"""
        match = re.match(r'loop\s+over\s+(.+)', content)
        if match:
            module_ids = match.group(1).split()
            self.loops.append(module_ids)
    
    def _parse_connection(self, content: str):
        """
        Parse a connection: from -> to [type] [direction] [label]
        Types: data, control, normal
        Direction: forward (default), backward (for arrows pointing opposite to connection)
        Examples:
          a -> b
          a -> b data "user input"
          a -> b data forward "user input"
          a -> b data backward "response"
          a -> b control
          a -> b control backward
        """
        parts = content.split('->')
        if len(parts) != 2:
            return
        
        from_id = parts[0].strip()
        rest = parts[1].strip().split(None, 3)
        
        to_id = rest[0]
        conn_type = 'normal'
        direction = 'forward'  # default direction
        label = ''
        
        if len(rest) > 1:
            conn_type = rest[1]
            if len(rest) > 2:
                # Check if next item is direction or label
                if rest[2] in ['forward', 'backward']:
                    direction = rest[2]
                    if len(rest) > 3:
                        label = rest[3].strip('"')
                else:
                    label = rest[2].strip('"')
        
        self.connections.append({
            'from': from_id,
            'to': to_id,
            'type': conn_type,
            'direction': direction,
            'label': label
        })
    
    def _calculate_positions(self):
        """Calculate x, y positions for all modules based on hierarchy."""
        # Build parent-child relationships from connections AND conditionals
        children = {}  # parent_id -> list of child_ids
        parents = {}   # child_id -> parent_id
        
        for conn in self.connections:
            parent = conn['from']
            child = conn['to']
            if parent not in children:
                children[parent] = []
            children[parent].append(child)
            parents[child] = parent
        
        # Add conditional connections - children go below the conditional parent
        for conditional in self.conditionals:
            parent = conditional['from']
            for child in conditional['to_list']:
                if parent not in children:
                    children[parent] = []
                if child not in children[parent]:  # Avoid duplicates
                    children[parent].append(child)
                if child not in parents:  # Don't override if already has a parent
                    parents[child] = parent
        
        # Find root modules (no parent)
        roots = [mid for mid in self.modules.keys() if mid not in parents]
        
        # Position modules using tree layout
        self._position_tree(roots, children, 0, 0)
    
    def _position_tree(self, module_ids, children, x_offset, y_level):
        """Recursively position modules in a tree structure."""
        if not module_ids:
            return x_offset
        
        current_x = x_offset
        
        for module_id in module_ids:
            if module_id not in self.modules:
                continue
            
            # Get children of this module
            child_ids = children.get(module_id, [])
            
            if child_ids:
                # Position children first to determine width needed
                child_start_x = current_x
                child_end_x = self._position_tree(
                    child_ids, 
                    children, 
                    child_start_x, 
                    y_level + 1
                )
                
                # Center parent over children
                parent_x = (child_start_x + child_end_x - self.MODULE_WIDTH) / 2
                current_x = child_end_x
            else:
                # Leaf node - just place it
                parent_x = current_x
                current_x += self.MODULE_WIDTH + self.MODULE_SPACING_X
            
            # Set position
            self.modules[module_id]['x'] = parent_x
            self.modules[module_id]['y'] = y_level * (self.MODULE_HEIGHT + self.MODULE_SPACING_Y)
            self.modules[module_id]['level'] = y_level
        
        return current_x
    
    def _draw_module(self, module: dict) -> str:
        """Draw a single module as SVG."""
        x, y = module['x'], module['y']
        label = module['label']
        is_library = module['type'] == 'library'
        
        fill_color = self.LIBRARY_MODULE_COLOR if is_library else self.MODULE_COLOR
        
        # Split long labels into multiple lines with better logic
        words = label.split()
        lines = []
        current_line = []
        max_chars = 16  # Maximum characters per line
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            if len(test_line) > max_chars and current_line:
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                current_line.append(word)
        if current_line:
            lines.append(' '.join(current_line))
        
        svg = f'<g class="module" data-module-id="{module["id"]}">\n'
        
        # Add subtle drop shadow for depth
        svg += f'  <rect x="{x + 2}" y="{y + 2}" width="{self.MODULE_WIDTH}" height="{self.MODULE_HEIGHT}" '
        svg += f'fill="#00000020" stroke="none" rx="3"/>\n'
        
        # Main module rectangle
        svg += f'  <rect x="{x}" y="{y}" width="{self.MODULE_WIDTH}" height="{self.MODULE_HEIGHT}" '
        svg += f'fill="{fill_color}" stroke="{self.STROKE_COLOR}" stroke-width="2" rx="3"/>\n'
        
        # Add text (centered, with better vertical spacing)
        line_height = 14
        total_text_height = len(lines) * line_height
        text_start_y = y + (self.MODULE_HEIGHT - total_text_height) / 2 + line_height / 2
        
        for i, line in enumerate(lines):
            line_y = text_start_y + i * line_height
            svg += f'  <text x="{x + self.MODULE_WIDTH / 2}" y="{line_y}" '
            svg += f'text-anchor="middle" dominant-baseline="middle" '
            svg += f'font-family="Arial, sans-serif" font-size="12" fill="{self.STROKE_COLOR}" font-weight="500">{line}</text>\n'
        
        # Add underline for library modules (positioned below text)
        if is_library:
            underline_y = text_start_y + (len(lines) - 1) * line_height + 8
            svg += f'  <line x1="{x + 15}" y1="{underline_y}" x2="{x + self.MODULE_WIDTH - 15}" y2="{underline_y}" '
            svg += f'stroke="{self.STROKE_COLOR}" stroke-width="1.5"/>\n'
        
        svg += '</g>\n'
        return svg
    
    def _draw_connection(self, conn: dict, offset_multiplier: float = 0) -> str:
        """Draw a connection between modules.
        
        Args:
            conn: Connection dictionary with from, to, type, etc.
            offset_multiplier: Multiplier for offsetting multiple arrows (-1, 0, 1, etc.)
        """
        if conn['from'] not in self.modules or conn['to'] not in self.modules:
            return ''
        
        from_module = self.modules[conn['from']]
        to_module = self.modules[conn['to']]
        
        # Tree-like structure: all connections exit from center bottom of parent
        from_center_x = from_module['x'] + self.MODULE_WIDTH / 2
        from_bottom_y = from_module['y'] + self.MODULE_HEIGHT
        
        to_center_x = to_module['x'] + self.MODULE_WIDTH / 2
        to_top_y = to_module['y']
        
        # For parent-child relationships, use simple vertical connection from center
        x1 = from_center_x
        y1 = from_bottom_y
        x2 = to_center_x
        y2 = to_top_y
        
        svg = '<g class="connection">\n'
        
        # Add data/control indicators ALONG the line (back-to-back for multiples)
        if conn['type'] in ['data', 'control']:
            import math
            
            # Calculate line angle and perpendicular
            angle = math.atan2(y2 - y1, x2 - x1)
            perp_angle = angle + math.pi / 2
            
            # Position indicators ALONG the line at different positions for multiples
            # First arrow at 30% along line, second at 50%, third at 70%, etc.
            line_positions = [0.3, 0.5, 0.7, 0.85]
            position_index = min(int(offset_multiplier), len(line_positions) - 1)
            line_position = line_positions[position_index]
            
            # Calculate position along the line
            indicator_center_x = x1 + (x2 - x1) * line_position
            indicator_center_y = y1 + (y2 - y1) * line_position
            
            # Offset slightly to the side so not directly on main line
            side_offset = 12  # Small offset to the side
            indicator_center_x += math.cos(perp_angle) * side_offset
            indicator_center_y += math.sin(perp_angle) * side_offset
            
            # Arrow properties (length is 2x the arrowhead which is ~10px)
            arrow_length = 20  # Total length of the arrow
            
            # Determine arrow direction (forward = same as line, backward = opposite)
            if conn.get('direction', 'forward') == 'backward':
                arrow_angle = angle + math.pi  # Point opposite direction
            else:
                arrow_angle = angle  # Point same direction as line
            
            # Calculate arrow positions
            circle_x = indicator_center_x - math.cos(arrow_angle) * arrow_length / 2
            circle_y = indicator_center_y - math.sin(arrow_angle) * arrow_length / 2
            arrow_tip_x = indicator_center_x + math.cos(arrow_angle) * arrow_length / 2
            arrow_tip_y = indicator_center_y + math.sin(arrow_angle) * arrow_length / 2
            
            # Draw the arrow LINE FIRST (before circles, so circles cover it)
            svg += f'  <line x1="{circle_x}" y1="{circle_y}" x2="{arrow_tip_x}" y2="{arrow_tip_y}" '
            svg += f'stroke="{self.STROKE_COLOR}" stroke-width="1.5" marker-end="url(#small-arrowhead)"/>\n'
            
            if conn['type'] == 'data':
                # Data flow: Circle with arrow (empty circle with white fill)
                # Draw circle AFTER line so it covers the line
                svg += f'  <circle cx="{circle_x}" cy="{circle_y}" r="5" '
                svg += f'fill="white" stroke="{self.STROKE_COLOR}" stroke-width="1.5"/>\n'
                
            elif conn['type'] == 'control':
                # Control flow: Filled circle with arrow (solid circle)
                # Draw filled circle AFTER line so it covers the line
                svg += f'  <circle cx="{circle_x}" cy="{circle_y}" r="5" '
                svg += f'fill="{self.STROKE_COLOR}" stroke="{self.STROKE_COLOR}" stroke-width="1.5"/>\n'
        
        # Draw main connection line (always present) - AFTER arrows so it doesn't cover them
        svg += f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
        svg += f'stroke="{self.STROKE_COLOR}" stroke-width="2" marker-end="url(#arrowhead)"/>\n'
        
        # Add label if present (positioned beside the arrow along the line)
        if conn['label'] and conn['type'] in ['data', 'control']:
            import math
            # Position label next to the arrow indicator
            angle = math.atan2(y2 - y1, x2 - x1)
            perp_angle = angle + math.pi / 2
            
            # Use same position along line as the arrow
            line_positions = [0.3, 0.5, 0.7, 0.85]
            position_index = min(int(offset_multiplier), len(line_positions) - 1)
            line_position = line_positions[position_index]
            
            # Position along the line
            label_line_x = x1 + (x2 - x1) * line_position
            label_line_y = y1 + (y2 - y1) * line_position
            
            # Estimate text width and position to the side
            label_text = conn['label']
            text_width = len(label_text) * 6
            
            # Position label to the side (offset from line)
            # arrow is at 12px to the side, so label goes further out
            label_offset = 12 + 20 + 8 + text_width / 2
            
            label_x = label_line_x + math.cos(perp_angle) * label_offset
            label_y = label_line_y + math.sin(perp_angle) * label_offset
            
            svg += f'  <text x="{label_x}" y="{label_y}" font-family="Arial, sans-serif" '
            svg += f'font-size="10" fill="{self.STROKE_COLOR}" font-style="italic">{label_text}</text>\n'
        elif conn['label']:
            # For connections without data/control, place label to the side
            import math
            angle = math.atan2(y2 - y1, x2 - x1)
            perp_angle = angle + math.pi / 2
            
            mid_x = (x1 + x2) / 2
            mid_y = (y1 + y2) / 2
            label_offset = 15
            label_x = mid_x + math.cos(perp_angle) * label_offset
            label_y = mid_y + math.sin(perp_angle) * label_offset
            
            svg += f'  <text x="{label_x}" y="{label_y}" font-family="Arial, sans-serif" '
            svg += f'font-size="10" fill="{self.STROKE_COLOR}" font-style="italic">{conn["label"]}</text>\n'
        
        svg += '</g>\n'
        return svg
    
    def _draw_loop(self, module_ids: list) -> str:
        """Draw a simple circular loop indicator beneath the parent module."""
        if not module_ids:
            return ''
        
        # Get positions of all modules in loop
        modules = [self.modules[mid] for mid in module_ids if mid in self.modules]
        if not modules:
            return ''
        
        # Find the ACTUAL parent module by checking connections
        parent_module = None
        for conn in self.connections:
            if conn['to'] in module_ids:
                potential_parent = conn['from']
                if potential_parent not in module_ids and potential_parent in self.modules:
                    parent_module = self.modules[potential_parent]
                    break
        
        # Fallback: if no parent found, use the first module's parent level
        if not parent_module:
            loop_level = min(m.get('level', 0) for m in modules)
            if loop_level > 0:
                for mid, m in self.modules.items():
                    if m.get('level', 0) == loop_level - 1:
                        parent_module = m
                        break
        
        if not parent_module:
            parent_module = modules[0]
        
        # Calculate parent module bounds
        parent_center_x = parent_module['x'] + self.MODULE_WIDTH / 2
        parent_bottom_y = parent_module['y'] + self.MODULE_HEIGHT
        
        # Larger, more visible circular loop below the parent module
        loop_radius = 25  # Increased from 15 for better visibility
        loop_center_y = parent_bottom_y + loop_radius + 10  # Moved down more (was +5)
        
        # Draw a circular arc with arrow pointing back up
        svg = '<g class="loop">\n'
        
        # Draw almost a complete circle - start and end near the top
        # Start point (left side, near parent)
        start_x = parent_center_x - loop_radius + 5
        start_y = parent_bottom_y + 8
        
        # End point (right side, near parent - arrow will point here)
        end_x = parent_center_x + loop_radius - 5
        end_y = parent_bottom_y + 8
        
        # Create a large circular arc that shows most of the circle
        svg += f'  <path d="M {start_x},{start_y} '
        # Large arc going around the bottom - sweep flag 1 for clockwise
        # This creates an arc that goes down and around, showing most of the circle
        svg += f'A {loop_radius},{loop_radius} 0 1 1 {end_x},{end_y}" '
        
        svg += f'fill="none" stroke="{self.STROKE_COLOR}" stroke-width="2" '
        svg += 'marker-end="url(#arrowhead)" stroke-dasharray="5,5"/>\n'
        svg += '</g>\n'
        return svg
    
    def _draw_storage(self, storage: dict, position: int) -> str:
        """Draw a storage element (curved rectangle with database styling)."""
        # Position storage elements at the bottom
        max_level = max(self.levels.keys()) if self.levels else 0
        x = -self.MODULE_WIDTH / 2 + position * (self.MODULE_WIDTH + self.MODULE_SPACING_X)
        y = (max_level + 1) * (self.MODULE_HEIGHT + self.MODULE_SPACING_Y)
        
        svg = '<g class="storage">\n'
        
        # Add shadow for depth
        svg += f'  <rect x="{x + 2}" y="{y + 2}" width="{self.MODULE_WIDTH}" height="{self.MODULE_HEIGHT}" '
        svg += 'fill="#00000020" stroke="none" rx="15"/>\n'
        
        # Create a rounded rectangle that looks like a database
        svg += f'  <rect x="{x}" y="{y}" width="{self.MODULE_WIDTH}" height="{self.MODULE_HEIGHT}" '
        svg += f'fill="{self.STORAGE_COLOR}" stroke="{self.STROKE_COLOR}" stroke-width="2" rx="15"/>\n'
        
        # Add a top "cap" line to make it look more like a cylinder/database
        cap_height = 8
        svg += f'  <ellipse cx="{x + self.MODULE_WIDTH / 2}" cy="{y + cap_height}" '
        svg += f'rx="{self.MODULE_WIDTH / 2 - 4}" ry="{cap_height}" '
        svg += f'fill="none" stroke="{self.STROKE_COLOR}" stroke-width="1.5"/>\n'
        
        # Add text (centered)
        svg += f'  <text x="{x + self.MODULE_WIDTH / 2}" y="{y + self.MODULE_HEIGHT / 2 + 3}" '
        svg += 'text-anchor="middle" dominant-baseline="middle" '
        svg += f'font-family="Arial, sans-serif" font-size="12" fill="{self.STROKE_COLOR}" font-weight="500">{storage["label"]}</text>\n'
        svg += '</g>\n'
        return svg
    
    def _draw_conditional(self, conditional: dict) -> str:
        """Draw a conditional gate (diamond) with multiple output connections."""
        if conditional['from'] not in self.modules:
            return ''
        
        from_module = self.modules[conditional['from']]
        from_x = from_module['x'] + self.MODULE_WIDTH / 2
        from_y = from_module['y'] + self.MODULE_HEIGHT
        
        # Position diamond below the from module
        diamond_size = 20
        diamond_x = from_x
        diamond_y = from_y + 30
        
        svg = '<g class="conditional">\n'
        
        # Add shadow for depth
        shadow_offset = 2
        svg += f'  <polygon points="{diamond_x + shadow_offset},{diamond_y - diamond_size + shadow_offset} '
        svg += f'{diamond_x + diamond_size + shadow_offset},{diamond_y + shadow_offset} '
        svg += f'{diamond_x + shadow_offset},{diamond_y + diamond_size + shadow_offset} '
        svg += f'{diamond_x - diamond_size + shadow_offset},{diamond_y + shadow_offset}" '
        svg += 'fill="#00000020" stroke="none"/>\n'
        
        # Draw diamond with gradient-like fill
        svg += f'  <polygon points="{diamond_x},{diamond_y - diamond_size} '
        svg += f'{diamond_x + diamond_size},{diamond_y} '
        svg += f'{diamond_x},{diamond_y + diamond_size} '
        svg += f'{diamond_x - diamond_size},{diamond_y}" '
        svg += f'fill="#ffffcc" stroke="{self.STROKE_COLOR}" stroke-width="2"/>\n'
        
        # Draw line from module to diamond
        svg += f'  <line x1="{from_x}" y1="{from_y}" x2="{diamond_x}" y2="{diamond_y - diamond_size}" '
        svg += f'stroke="{self.STROKE_COLOR}" stroke-width="2"/>\n'
        
        # Draw lines from diamond to each destination module
        for to_id in conditional['to_list']:
            if to_id in self.modules:
                to_module = self.modules[to_id]
                to_x = to_module['x'] + self.MODULE_WIDTH / 2
                to_y = to_module['y']
                
                # Line from diamond to module
                svg += f'  <line x1="{diamond_x}" y1="{diamond_y + diamond_size}" x2="{to_x}" y2="{to_y}" '
                svg += f'stroke="{self.STROKE_COLOR}" stroke-width="2" marker-end="url(#arrowhead)"/>\n'
        
        svg += '</g>\n'
        return svg
    
    def generate_svg(self) -> str:
        """Generate the complete SVG diagram."""
        self.parse()
        self._calculate_positions()
        
        if not self.modules:
            return '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><text x="10" y="50">No modules defined</text></svg>'
        
        # Calculate SVG dimensions
        all_x = [m['x'] for m in self.modules.values()]
        all_y = [m['y'] for m in self.modules.values()]
        
        min_x = min(all_x) - 50
        max_x = max(all_x) + self.MODULE_WIDTH + 50
        min_y = min(all_y) - 80  # Extra space for loops
        max_y = max(all_y) + self.MODULE_HEIGHT + 50
        
        # Add space for storage if present
        if self.storages:
            max_level = max(self.levels.keys()) if self.levels else 0
            max_y = (max_level + 1) * (self.MODULE_HEIGHT + self.MODULE_SPACING_Y) + self.MODULE_HEIGHT + 50
        
        width = max_x - min_x
        height = max_y - min_y
        
        # Build SVG
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{min_x} {min_y} {width} {height}" '
        svg += f'class="structure-chart" style="max-width: 100%; height: auto;">\n'
        
        # Add definitions for markers
        svg += '''<defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#333333"/>
    </marker>
    <marker id="small-arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="2.5" orient="auto">
      <polygon points="0 0, 8 2.5, 0 5" fill="#333333"/>
    </marker>
  </defs>\n'''
        
        # Draw loops first (behind everything)
        for loop_modules in self.loops:
            svg += self._draw_loop(loop_modules)
        
        # Draw conditional gates
        for conditional in self.conditionals:
            svg += self._draw_conditional(conditional)
        
        # Group connections by from/to pair to handle multiple arrows on same line
        connection_groups = {}
        for i, conn in enumerate(self.connections):
            key = (conn['from'], conn['to'])
            if key not in connection_groups:
                connection_groups[key] = []
            connection_groups[key].append((i, conn))
        
        # Draw connections with offsets for duplicates
        for (from_id, to_id), conns in connection_groups.items():
            num_conns = len(conns)
            for idx, (original_idx, conn) in enumerate(conns):
                # Calculate offset index: -1, 0, 1 for 3 connections; -0.5, 0.5 for 2, etc.
                if num_conns == 1:
                    offset_multiplier = 0
                else:
                    # Center the group: for n items, use positions from -(n-1)/2 to +(n-1)/2
                    offset_multiplier = idx - (num_conns - 1) / 2
                
                svg += self._draw_connection(conn, offset_multiplier)
        
        # Draw modules
        for module in self.modules.values():
            svg += self._draw_module(module)
        
        # Draw storage elements
        for i, storage in enumerate(self.storages):
            svg += self._draw_storage(storage, i)
        
        svg += '</svg>'
        return svg


class StructureChartPreprocessor(Preprocessor):
    """Preprocessor to convert structure-chart fenced blocks to SVG."""
    
    def run(self, lines):
        new_lines = []
        in_structure_chart = False
        chart_lines = []
        
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # Check for structure chart fence start
            if line.strip() == '```structure-chart':
                in_structure_chart = True
                chart_lines = []
                i += 1
                continue
            
            # Check for fence end
            if in_structure_chart and line.strip() == '```':
                # Generate SVG
                chart_def = '\n'.join(chart_lines)
                generator = StructureChartGenerator(chart_def)
                svg = generator.generate_svg()
                
                # Generate a unique ID for the diagram
                diagram_id = hashlib.md5(chart_def.encode()).hexdigest()[:8]
                
                # Wrap in diagram container for modal support
                new_lines.append(f'<div class="diagram-container" id="diagram-{diagram_id}">')
                new_lines.append(svg)
                new_lines.append(f'<button class="diagram-expand-btn" onclick="openDiagramModal(\'diagram-{diagram_id}\')">🔍 View Larger</button>')
                new_lines.append('</div>')
                new_lines.append('')
                
                in_structure_chart = False
                chart_lines = []
                i += 1
                continue
            
            # Accumulate chart lines or pass through
            if in_structure_chart:
                chart_lines.append(line)
            else:
                new_lines.append(line)
            
            i += 1
        
        return new_lines


class StructureChartExtension(Extension):
    """MkDocs extension for structure charts."""
    
    def extendMarkdown(self, md):
        md.preprocessors.register(
            StructureChartPreprocessor(md),
            'structure_chart',
            priority=175  # Before fenced_code
        )


def makeExtension(**kwargs):
    return StructureChartExtension(**kwargs)
