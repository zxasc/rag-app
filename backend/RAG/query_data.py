from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.chat_history import BaseChatMessageHistory
from langchain.chains import create_history_aware_retriever
from langchain.chains import create_retrieval_chain
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import OllamaLLM
from langchain_chroma import Chroma

from RAG.get_embedding_function import get_embedding_function

CHROMA_DIR = "./RAG/chroma"

contextualize_q_system_prompt = """Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."""

qa_system_prompt = """
You are a friendly senior software engineer, who is excellent at both coding and searching through documentation. If you don't have an answer from the provided information, just say so, but also provide an answer based on your extensive programming knowledge.
Answer the question based on your extensive programming knowledge and the following context: {context}
"""

# Prepare chat history
store = {}

def main(query_text, session_id):
    response = query_rag(query_text, session_id)
    return response

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def query_rag(query_text, session_id='test'):

    # Prepare the database
    embedding_function = get_embedding_function()
    db = Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embedding_function,
    )

    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 5})
    # retrieved_docs = retriever.get_relevant_documents(query_text)
    # context_text = "\n\n---\n\n".join([doc.page_content for doc in retrieved_docs])
    # prompt = prompt_template.format(context=context_text, question=query_text)

    model = OllamaLLM(model="llama3.1:8b")

    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    history_aware_retriever = create_history_aware_retriever(
        model, retriever, contextualize_q_prompt
    )

    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    question_answer_chain = create_stuff_documents_chain(model, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    conversational_rag_chain = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )

    result = conversational_rag_chain.invoke(
        {"input": query_text},
        config = {
            "configurable": {"session_id": session_id}
        },
    )

    print(result)
    return result["answer"]

if __name__ == "__main__":
    main()
