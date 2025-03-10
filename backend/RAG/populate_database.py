import argparse
import os
import shutil
from typing import List

from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from RAG.get_embedding_function import get_embedding_function
from langchain_community.vectorstores import Chroma

CHROMA_DIR = "./RAG/chroma"
DATA_DIR = "./RAG/data"

def main():
    # Check if database should be cleared
    # clear_database()

    # Create or update the data store
    documents = load_documents()
    chunks = split_documents(documents)
    add_to_chroma(chunks)
    return 200

def load_documents():
    document_loader = PyPDFDirectoryLoader(DATA_DIR)
    return document_loader.load()

def split_documents(documents: List[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return text_splitter.split_documents(documents)

def add_to_chroma(chunks: List[Document]):

    # Load the existing database
    embedding_function = get_embedding_function()
    db = Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embedding_function,
    )

    # Calculate page IDs
    chunks_with_ids = calculate_chunk_ids(chunks)

    # Add or update the documents
    existing_items = db.get(include=[])
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in database: {len(existing_ids)}")

    # Only add documents that aren't already in the database
    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)

    if len(new_chunks):
        print(f"Adding {len(new_chunks)} new documents to chroma.")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, chunk_ids=new_chunk_ids)
        db.persist()
    else:
        print("No new documents to add.")

def calculate_chunk_ids(chunks):

    # Create IDs in a schema: Source : Page : Chunk Index

    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        # Calculate chunk ID
        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        chunk.metadata["id"] = chunk_id

    return chunks

def clear_database():
    if os.path.exists(CHROMA_DIR):
        shutil.rmtree(CHROMA_DIR)

if __name__ == "__main__":
    main()