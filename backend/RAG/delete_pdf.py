import os

UPLOAD_FOLDER = './RAG/data'

def main(pdf):
    path_to_pdf = UPLOAD_FOLDER + '/' + pdf
    if os.path.exists(path_to_pdf):
        os.remove(path_to_pdf)
    else:
        return "couldn't find file"
    return 'removed'