from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
import os
import pandas as pd

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

# Enable CORS for all origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Directory to store uploaded files
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route to upload CSV
@app.route('/api/upload', methods=['POST'])
def upload_file():
    print(request)
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    print(file)
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.csv'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        return jsonify({"message": f"File {file.filename} uploaded successfully", "filepath": filepath}), 200
    else:
        return jsonify({"error": "File format not supported. Please upload a CSV file."}), 400

# Route to load CSV and return column names and types
@app.route('/api/load-columns/<filename>', methods=['GET'])
def load_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404
    
    try:
        # Load the CSV file into a DataFrame
        df = pd.read_csv(filepath)
        # Get column names and types
        columns_info = {col: str(df[col].dtype) for col in df.columns}
        return jsonify({"columns": columns_info}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to download saved CSV
@app.route('/api/download-file/<filename>', methods=['GET'])
def download_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    else:
        return jsonify({"error": "File not found"}), 404
    
# Route to download the names of available files
@app.route('/api/files', methods=['GET']) 
def get_files():
    files = os.listdir(UPLOAD_FOLDER)
    return jsonify({"files": files}), 200

if __name__ == '__main__':
    app.run(debug=True)
