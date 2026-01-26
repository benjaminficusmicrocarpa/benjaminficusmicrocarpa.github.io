#!/usr/bin/env python3
"""
Script to format tree-density-hong-kong.json:
1. Format scientific names according to ICNafp by wrapping in <i></i> tags
2. Add index field to each item
"""

import json
import sys
from pathlib import Path


def format_scientific_name(species_name):
    """
    Format scientific name according to ICNafp by wrapping in <i></i> tags.
    The entire scientific name should be italicized.
    """
    if not species_name or not isinstance(species_name, str):
        return species_name
    
    # Remove any existing HTML tags to avoid double-wrapping
    species_name = species_name.strip()
    
    # If already wrapped in tags, return as is
    if species_name.startswith('<i>') and species_name.endswith('</i>'):
        return species_name
    
    # Wrap the entire scientific name in <i></i> tags
    return f'<i>{species_name}</i>'


def process_json_file(input_file, output_file):
    """
    Process JSON file to format scientific names and add indices.
    """
    try:
        # Read input JSON
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Process each item
        for index, item in enumerate(data, start=1):
            # Format scientific name
            if 'Species' in item:
                item['Species'] = format_scientific_name(item['Species'])
            
            # Add index (1-based)
            item['index'] = index
        
        # Write output JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Successfully processed {len(data)} species entries.")
        print(f"Output written to: {output_file}")
        
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found.", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in '{input_file}': {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error processing file: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    """Main function."""
    script_dir = Path(__file__).parent
    input_file = script_dir / 'tree-density-hong-kong.json'
    output_file = script_dir / 'tree-density-hong-kong.json'  # Overwrite original
    
    # Confirm overwrite
    if input_file.exists():
        process_json_file(input_file, output_file)
    else:
        print(f"Error: Input file '{input_file}' not found.", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()








