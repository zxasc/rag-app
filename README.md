# RAG-Powered Document Assistant

A Retrieval-Augmented Generation (RAG) application with a React frontend and Python/Flask backend. Enables AI-powered PDF document querying using Ollama models and ChromaDB.

## Features
- **PDF Management**: Upload/delete PDFs via React frontend
- **Document Processing**: 
  - Automatic text splitting & embedding
  - ChromaDB vector storage
- **AI-Powered Querying**:
  - Context-aware responses using RAG
  - Session-based chat history
- **React Frontend**:
  - Chat interface with session management
  - Sidebar for document/session control
  - Built with shadcn/ui components

## Technologies
**Backend**:
- Python/Flask
- LangChain
- Ollama (llama3:8b & nomic-embed-text models)
- ChromaDB

**Frontend**:
- React
- shadcn/ui component library
- Axios (for API calls)

## Installation

### Prerequisites
- Python 3.12+
- Node.js 18+
- [Ollama](https://ollama.ai/) installed and running
- Download required models:
```bash
  ollama pull llama3:8b
  ollama pull nomic-embed-text
```

### Backend Setup
1. Create a virtual environment
    ```bash
    cd backend
    pip install virtualenv
    virtualenv venv
    source venv/bin/activate
    ```
2. Install dependencies
    ```bash
    pip install -r requirements.txt 
    ```

3. Create required directories
    ```bash
    mkdir -p RAG/data RAG/chroma
    ```

4. Start Flask server
    ```bash
    python app.py
    ```

### Frontend Setup
1. Install dependencies
    ```bash
    cd frontend
    npm install
    ```

2. Start development server:
    ```bash
    npm run dev
    ```

## Usage
1. Upload PDFs:
    - Select and upload your desired PDF
    - PDFs are stored inside `RAG/data`
2. Process Documents
    - Press the Populate button and wait until the database has been populated
3. Query Documents
    - Use the chat interface to talk with the AI

## Project Structure
```
.
├── backend/
│   ├── RAG/
│   │   ├── data/         # Uploaded PDFs
│   │   ├── chroma/       # Vector database 
│   │   └── *.py          # Python modules
│   └── app.py            # Flask server 
├── frontend/             
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks 
│   │   ├── index.css     # Custom hooks 
│   │   ├── main.jsx        
│   │   └── App.jsx       # Main entry point
```