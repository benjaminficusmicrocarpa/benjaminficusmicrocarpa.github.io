# Local Python Web Server Guide

This guide explains how to host a Python web server locally to test HTML files with full access to local files, which is normally blocked when opening HTML files directly in a browser.

## Why Use a Local Web Server?

When you open HTML files directly in a browser (using `file://` protocol), the browser blocks many features for security reasons:
- AJAX requests to local files
- Loading external resources
- Cross-origin requests
- Some JavaScript APIs

Using a local web server allows you to test your HTML files with full functionality.

## Method 1: Python's Built-in HTTP Server (Recommended)

### Python 3.x
```bash
# Navigate to your project directory
cd /path/to/your/project

# Start the server (default port 8000)
python3 -m http.server 8000

# Or specify a different port
python3 -m http.server 9000
```

### Python 2.x (if still using)
```bash
python -m SimpleHTTPServer 8000
```

### Access Your Files
1. Open your terminal/command prompt
2. Navigate to your project directory
3. Run the server command
4. Open your browser and go to: `http://localhost:8000`
5. You'll see a directory listing of your files
6. Click on your HTML file to open it

## Method 2: Using Python with Flask (More Advanced)

If you need more control or want to serve specific files:

```python
# Install Flask first: pip install flask
from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
```

Save this as `server.py` and run:
```bash
python3 server.py
```

## Method 3: Using Python with http.server Module (Custom)

For more control over the server:

```python
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
})

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()
```

Save this as `custom_server.py` and run:
```bash
python3 custom_server.py
```

## Common Ports

- **8000**: Default for Python's built-in server
- **3000**: Common for development servers
- **8080**: Alternative common port
- **5000**: Flask default port

## Troubleshooting

### Port Already in Use
If you get an error that the port is already in use:
```bash
# Try a different port
python3 -m http.server 8080

# Or kill the process using the port (on macOS/Linux)
lsof -ti:8000 | xargs kill -9
```

### Permission Denied
On some systems, you might need to use a port above 1024:
```bash
python3 -m http.server 8080
```

### CORS Issues
If you're still getting CORS errors, make sure you're accessing files through `http://localhost:8000` and not `file://`.

## Security Note

⚠️ **Important**: These servers are for development/testing only. Never use them in production as they serve files without proper security measures.

## Quick Start for This Project

For this specific project, you can run:

```bash
# Navigate to the project root
cd /Users/benjaminlau/benjaminficusmicrocarpa/benjaminficusmicrocarpa.github.io

# Start the server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

This will allow you to test all your HTML files with full functionality, including:
- The tree database application in `db/tree_form_1/`
- Your urban forestry pages
- Any JavaScript that needs to load local files
- AJAX requests to local JSON files

## Stopping the Server

To stop the server, press `Ctrl+C` in the terminal where it's running.
