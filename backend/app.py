from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

from RAG.populate_database import main as populate_database
from RAG.query_data import main as query_data
from RAG.add_pdf import main as add_pdf
from RAG.list_pdfs import main as list_pdfs
from RAG.delete_pdf import main as delete_pdf

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './RAG/data'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.debug = True

# GETs
@app.get('/query')
def query():
    prompt = request.args.get('prompt')
    session_id = request.args.get('session')
    if prompt:
        response = query_data(prompt, session_id)
        data = {'message': 'success', 'data': response}
        return make_response(jsonify(data), 201)
    else:
        return "You didn't specify a prompt.", 400

@app.get('/populate')
def populate():
    return populate_database()

@app.get('/listpdfs')
def listpdfs():
    return list_pdfs()

# POSTs
@app.post('/upload')
def upload():
    add_pdf()
    return list_pdfs()

@app.delete('/delete')
def delete():
    pdf = request.args.get('pdf_name')
    delete_pdf(pdf)
    return list_pdfs()

if __name__ == '__main__':
    app.run()
