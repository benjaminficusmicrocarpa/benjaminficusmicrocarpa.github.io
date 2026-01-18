#!/usr/bin/env python3
"""
Script to export Cloudflare Images list with filename, image ID, and image scale in JSON format.

Usage:
    python export_cloudflare_images.py [output_file]

Options:
    output_file: Path to output JSON file (default: cloudflare_images.json)
"""

import sys
import json
import requests
from pathlib import Path
from typing import List, Dict

# Cloudflare API credentials
ACCOUNT_ID = "17133841c4ac43c421229cc9fd7ba347"
API_TOKEN = "DMeW9ZW637HztwMNwzBUmBZcSBCKpy1SVGkmSE1L"

# API endpoint
BASE_URL = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/images/v1"

def fetch_image_details(image_id: str, headers: Dict) -> Dict:
    """
    Fetch detailed information for a specific image including dimensions.
    
    Args:
        image_id: The Cloudflare image ID
        headers: Request headers with authorization
    
    Returns:
        Dictionary with image details including scale/dimensions
    """
    url = f"{BASE_URL}/{image_id}"
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if data.get("success", False):
            image = data.get("result", {})
            return {
                "width": image.get("width"),
                "height": image.get("height"),
                "file_size": image.get("file_size"),
                "variants": image.get("variants", [])
            }
    except Exception as e:
        print(f"  Warning: Could not fetch details for image {image_id}: {e}")
    
    return {}

def fetch_all_images() -> List[Dict]:
    """
    Fetch all images from Cloudflare Images API with pagination support.
    
    Returns:
        List of image dictionaries containing filename, image ID, and scale
    """
    all_images = []
    page = 1
    per_page = 100  # Maximum per page according to Cloudflare API
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    print("Fetching images from Cloudflare...")
    
    while True:
        # API endpoint with pagination
        url = f"{BASE_URL}?page={page}&per_page={per_page}"
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            
            # Check if request was successful
            if not data.get("success", False):
                print(f"Error: API returned success=false")
                if "errors" in data:
                    for error in data["errors"]:
                        print(f"  {error}")
                break
            
            # Extract images from result
            images = data.get("result", {}).get("images", [])
            
            if not images:
                # No more images
                break
            
            # Process each image
            for image in images:
                image_id = image.get("id", "")
                filename = image.get("filename", "")
                
                # Check if dimensions are already in the list response
                width = image.get("width")
                height = image.get("height")
                
                # If not in list response, fetch detailed information
                if not width or not height:
                    details = fetch_image_details(image_id, headers)
                    width = details.get("width") or width
                    height = details.get("height") or height
                
                # Calculate scale (width x height) or use dimensions
                scale = None
                if width and height:
                    scale = f"{width}x{height}"
                else:
                    scale = "unknown"
                
                image_info = {
                    "filename": filename,
                    "image_id": image_id,
                    "scale": scale,
                    "width": width,
                    "height": height
                }
                all_images.append(image_info)
            
            print(f"  Fetched page {page}: {len(images)} images (total: {len(all_images)})")
            
            # Check if there are more pages
            result_info = data.get("result", {})
            if len(images) < per_page:
                # Last page
                break
            
            page += 1
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching page {page}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    print(f"  Error details: {error_data}")
                except:
                    print(f"  Status code: {e.response.status_code}")
            break
        except Exception as e:
            print(f"Unexpected error on page {page}: {e}")
            break
    
    return all_images

def main():
    # Parse output file argument
    if len(sys.argv) > 1:
        output_file = Path(sys.argv[1])
    else:
        # Default to same directory as script
        output_file = Path(__file__).parent / "cloudflare_images.json"
    
    # Fetch all images
    images = fetch_all_images()
    
    if not images:
        print("\nNo images found or error occurred.")
        return
    
    # Prepare output data - simplified format with just filename, image_id, and scale
    simplified_images = [
        {
            "filename": img["filename"],
            "image_id": img["image_id"],
            "scale": img["scale"]
        }
        for img in images
    ]
    
    output_data = {
        "total_images": len(simplified_images),
        "images": simplified_images
    }
    
    # Write to JSON file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"\nSuccessfully exported {len(images)} images to: {output_file}")
        print(f"  Total images: {len(images)}")
        
    except Exception as e:
        print(f"\nError writing to file: {e}")
        return
    
    # Also print a sample of the data
    if simplified_images:
        print("\nSample entry:")
        print(json.dumps(simplified_images[0], indent=2))

if __name__ == "__main__":
    main()

