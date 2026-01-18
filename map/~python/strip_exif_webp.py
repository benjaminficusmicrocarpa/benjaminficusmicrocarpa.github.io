#!/usr/bin/env python3
"""
Script to strip all EXIF data from WebP images.

Usage:
    python strip_exif_webp.py [directory_path] [--backup]

Options:
    directory_path: Path to directory containing WebP files (default: ./webp)
    --backup: Create backup copies before stripping EXIF
"""

import sys
from pathlib import Path
from PIL import Image
from PIL.ExifTags import TAGS

def strip_exif_from_webp(file_path, backup=False):
    """
    Strip EXIF data from a WebP image file.
    
    Args:
        file_path: Path to the WebP file
        backup: If True, create a backup before modifying
    
    Returns:
        True if successful, False otherwise
    """
    try:
        # Create backup if requested
        if backup:
            backup_path = file_path.with_suffix('.webp.bak')
            if not backup_path.exists():
                import shutil
                shutil.copy2(file_path, backup_path)
        
        # Open the image
        with Image.open(file_path) as img:
            # Get image data
            data = list(img.getdata())
            
            # Create new image without EXIF
            new_img = Image.new(img.mode, img.size)
            new_img.putdata(data)
            
            # Save without EXIF (exif=None removes all metadata)
            new_img.save(file_path, 'WEBP', quality=95, method=6, exif=None)
        
        return True
    except Exception as e:
        print(f"  Error processing {file_path.name}: {e}")
        return False

def main():
    # Parse arguments
    backup_mode = '--backup' in sys.argv
    args = [arg for arg in sys.argv[1:] if arg != '--backup']
    
    # Determine target directory
    if args:
        webp_dir = Path(args[0])
    else:
        # Default to webp folder in same directory as script
        webp_dir = Path(__file__).parent / "webp"
    
    if not webp_dir.exists():
        print(f"Error: Directory not found: {webp_dir}")
        return
    
    if not webp_dir.is_dir():
        print(f"Error: Path is not a directory: {webp_dir}")
        return
    
    # Find all WebP files
    webp_files = list(webp_dir.glob("*.webp"))
    
    if not webp_files:
        print(f"No WebP files found in {webp_dir}")
        return
    
    print(f"Found {len(webp_files)} WebP file(s) in {webp_dir}")
    if backup_mode:
        print("Backup mode: ON (creating .webp.bak files)")
    else:
        print("Backup mode: OFF")
    
    # Process each file
    print("\nStripping EXIF data...")
    success_count = 0
    error_count = 0
    
    for webp_file in webp_files:
        # Skip backup files
        if webp_file.suffix == '.bak' or webp_file.name.endswith('.webp.bak'):
            continue
        
        print(f"  Processing: {webp_file.name}")
        if strip_exif_from_webp(webp_file, backup=backup_mode):
            success_count += 1
        else:
            error_count += 1
    
    # Summary
    print(f"\nDone!")
    print(f"  Successfully processed: {success_count}")
    if error_count > 0:
        print(f"  Errors: {error_count}")

if __name__ == "__main__":
    main()

