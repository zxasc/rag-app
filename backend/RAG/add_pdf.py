import os
from flask import jsonify, current_app, request
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './RAG/data'

def main():
    return upload_file()

def check_upload_directory():
    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)

def upload_file():
    check_upload_directory()

    file = request.files['file']
    filename = secure_filename(file.filename)

    if filename.endswith('.pdf'):
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'message': f'File successfully uploaded to {file_path}'}), 200
    else:
        return jsonify({'error': 'Invalid file type. Only PDFs are allowed.'}), 400