#!/usr/bin/env python3
"""
Script to:
1. Check which webp images match filenames in viewphoto.geojson
2. Rename images to wkcd_xxx.webp format (incremental numbers)
3. Update geojson filename attributes to match new names
"""

import json
from pathlib import Path

# Paths
GEOJSON_PATH = Path(__file__).parent / "viewphoto.geojson"
WEBP_DIR = Path(__file__).parent / "webp"

def main():
    # Load geojson
    print("Loading geojson...")
    with open(GEOJSON_PATH, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)
    
    # Get all filenames from geojson (without extension)
    geojson_filenames = {}
    for feature in geojson_data['features']:
        fid = feature['properties']['fid']
        filename = feature['properties']['filename']
        geojson_filenames[fid] = filename
    
    print(f"Found {len(geojson_filenames)} features in geojson")
    
    # Check which webp files exist and match geojson filenames
    print("\nChecking which webp files exist...")
    existing_files = {}
    missing_files = []
    
    # Get all webp files in directory
    all_webp_files = set()
    for webp_file in WEBP_DIR.glob("*.webp"):
        all_webp_files.add(webp_file.stem)  # filename without extension
    
    for fid, filename in geojson_filenames.items():
        webp_path = WEBP_DIR / f"{filename}.webp"
        if webp_path.exists():
            existing_files[fid] = {
                'old_filename': filename,
                'old_path': webp_path
            }
            # Remove from all_webp_files set to track unreferenced files
            all_webp_files.discard(filename)
        else:
            missing_files.append((fid, filename))
    
    print(f"Found {len(existing_files)} matching webp files")
    if missing_files:
        print(f"Warning: {len(missing_files)} files from geojson not found in webp folder:")
        for fid, filename in missing_files[:10]:  # Show first 10
            print(f"  - fid {fid}: {filename}.webp")
        if len(missing_files) > 10:
            print(f"  ... and {len(missing_files) - 10} more")
    
    # Report webp files not referenced in geojson
    if all_webp_files:
        print(f"\nInfo: {len(all_webp_files)} webp files in folder not referenced in geojson:")
        for filename in sorted(list(all_webp_files))[:10]:  # Show first 10
            print(f"  - {filename}.webp")
        if len(all_webp_files) > 10:
            print(f"  ... and {len(all_webp_files) - 10} more")
        print("  (These will not be renamed)")
    
    # Check if there are any files to rename
    if not existing_files:
        print("\nNo matching files found. Nothing to rename.")
        return
    
    # Sort by fid to ensure consistent ordering
    sorted_fids = sorted(existing_files.keys())
    
    # Create mapping: old_filename -> new_filename (wkcd_xxx)
    rename_mapping = {}
    for idx, fid in enumerate(sorted_fids, start=1):
        old_filename = existing_files[fid]['old_filename']
        new_filename = f"wkcd_{idx:03d}"  # Format: wkcd_001, wkcd_002, etc.
        rename_mapping[fid] = {
            'old_filename': old_filename,
            'new_filename': new_filename,
            'old_path': existing_files[fid]['old_path'],
            'new_path': WEBP_DIR / f"{new_filename}.webp"
        }
    
    # Check if any new filenames already exist (shouldn't happen, but safety check)
    conflicts = []
    for fid, mapping in rename_mapping.items():
        if mapping['new_path'].exists() and mapping['new_path'] != mapping['old_path']:
            conflicts.append((fid, mapping['new_filename']))
    
    if conflicts:
        print(f"\nError: {len(conflicts)} target filenames already exist!")
        for fid, new_filename in conflicts:
            print(f"  - {new_filename}.webp")
        return
    
    # Rename files
    print(f"\nRenaming {len(rename_mapping)} files...")
    for fid, mapping in rename_mapping.items():
        try:
            mapping['old_path'].rename(mapping['new_path'])
            print(f"  {mapping['old_filename']}.webp -> {mapping['new_filename']}.webp")
        except Exception as e:
            print(f"  Error renaming {mapping['old_filename']}.webp: {e}")
            return
    
    # Update geojson
    print("\nUpdating geojson...")
    for feature in geojson_data['features']:
        fid = feature['properties']['fid']
        if fid in rename_mapping:
            feature['properties']['filename'] = rename_mapping[fid]['new_filename']
            print(f"  Updated fid {fid}: {rename_mapping[fid]['old_filename']} -> {rename_mapping[fid]['new_filename']}")
    
    # Save updated geojson
    print("\nSaving updated geojson...")
    with open(GEOJSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(geojson_data, f, indent=1, ensure_ascii=False)
    
    print("\nDone!")
    print(f"Renamed {len(rename_mapping)} files")
    print(f"Updated {len(rename_mapping)} entries in geojson")

if __name__ == "__main__":
    main()

