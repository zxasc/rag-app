import os

from flask import jsonify

UPLOAD_FOLDER = './RAG/data'
def main():
    pdfs = os.listdir(UPLOAD_FOLDER)
    return jsonify(pdfs), 200