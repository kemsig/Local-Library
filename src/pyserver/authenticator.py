from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_cors import CORS
from pdf2image import convert_from_path
from PIL import Image
import os
from dotenv import load_dotenv
from functools import wraps

# Load .env
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
env_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path=env_path)

PORT = os.getenv("VITE_FLASK_PORT", 5000)
LOGIN_USERNAME=os.getenv("LOGIN_USERNAME", "admin")
LOGIN_PASSWORD=os.getenv("LOGIN_PASSWORD", "admin")

PDF_DIRECTORY=os.path.join(base_dir, "pdfs")
THUMBNAIL_DIRECTORY=os.path.join(base_dir, "thumbnails")

# Start App
app = Flask(__name__)
CORS(app, supports_credentials=True)

# auther
def requires_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if the auth_token exists in cookies
        auth_token = request.cookies.get("auth_token")
        if not auth_token:
            return jsonify({"error": "Unauthorized, please log in"}), 401

        return f(*args, **kwargs)
    return decorated_function

# Route to serve the list of PDF file names
@app.route('/api/pdfs', methods=['GET'])
def get_pdfs():
    print('getting pdfs')
    try:
        # Get the list of PDF filenames in the directory
        pdf_files = [f for f in os.listdir(PDF_DIRECTORY) if f.endswith('.pdf')]
        return jsonify(pdf_files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to generate and serve the PDF thumbnail
@app.route('/api/pdfs/thumbnails/<filename>', methods=['GET'])
@requires_auth
def get_pdf_thumbnail(filename):
    try:
        # Path to the PDF file
        pdf_path = os.path.join(PDF_DIRECTORY, filename)
        
        if not os.path.exists(pdf_path):
            return jsonify({"error": "PDF not found"}), 404
        
        # Check if the thumbnail already exists
        thumbnail_path = os.path.join(THUMBNAIL_DIRECTORY, f"{filename}.png")
        if not os.path.exists(thumbnail_path):
            # Generate thumbnail
            images = convert_from_path(pdf_path, first_page=1, last_page=1, dpi=72)  # Convert only the first page
            thumbnail = images[0]
            # Save the thumbnail as a PNG file
            thumbnail.save(thumbnail_path, "PNG")
        
        # Serve the thumbnail
        return send_from_directory(THUMBNAIL_DIRECTORY, f"{filename}.png")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to serve individual PDFs (requires authentication)
@app.route('/api/pdfs/<filename>', methods=['GET'])
@requires_auth  
def serve_pdf(filename):
    try:
        # Send the requested PDF file
        print(f"Attempting to serve PDF: {filename}")
        pdf_path = os.path.join(PDF_DIRECTORY, filename)
        if os.path.exists(pdf_path):
            return send_from_directory(PDF_DIRECTORY, filename)
        else:
            return jsonify({"error": "PDF not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('username')
    password = data.get('password')
    
    # Mock authentication logic
    if email == LOGIN_USERNAME and password == LOGIN_PASSWORD:
        auth_token = "your_token_here"
        response = make_response(jsonify({"message": "Login successful", "token": auth_token}))
        
        # set cookie
        response.set_cookie("auth_token", auth_token, httponly=True, max_age=3600)  # Expires in 1 hour
        
        return response
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logged out"}))
    response.set_cookie("auth_token", "", expires=0)  # Clear cookie
    return response

if __name__ == '__main__':
    app.run(debug=True, port=PORT)
