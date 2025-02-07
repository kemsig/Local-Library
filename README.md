# Local Library

## Overview
Local Library is a web-based application that allows users to browse and view PDF documents stored on a local server. The frontend is built with React (Vite) and communicates with a Flask backend to fetch and display PDFs.

## Features
- Browse a collection of PDFs stored on a local server
- Search for PDFs by name
- View PDFs in a full-screen viewer
- Thumbnail previews for each PDF
- User authentication (optional)

## Tech Stack
### Frontend:
- React (Vite)
- TypeScript
- Tailwind CSS
- Lucide React (icons)

### Backend:
- Flask
- Flask-CORS

## Installation
### Prerequisites
- Node.js & npm (for frontend)
- Python & pip (for backend)
- Git

### Clone the Repository
```sh
git clone <repository-url>
cd LocalLibrary
```

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```sh
   flask run --host=0.0.0.0 --port=5000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the frontend root:
   ```sh
   VITE_FLASK_SERVER_IP=http://localhost:5000
   ```
4. Start the React application:
   ```sh
   npm run dev
   ```

## Usage
1. Ensure the Flask backend is running.
2. Start the frontend and open the provided local development URL.
3. Browse and search for PDFs.
4. Click on a PDF to view it in fullscreen mode.

## Environment Variables
Create a `.env` file in the frontend directory to store environment variables:
```sh
VITE_FLASK_SERVER_IP=http://localhost:5000
```

## Contribution
1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Commit and push your changes.
4. Open a pull request.

## License
This project is licensed under the MIT License.

