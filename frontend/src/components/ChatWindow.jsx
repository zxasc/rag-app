import Chat from "./Chat.jsx";
import ChatPrompt from "./ChatPrompt.jsx";
import {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";

export default function ChatWindow({sessions, setSessions, currentSession, setCurrentSession, handleCurrentSessionChange}) {

    const [response, setResponse] = useState({'author': 'ai', 'message': ''})
    const [prompt, setPrompt] = useState({'author': 'you', 'message': ''})
    const [history, setHistory] = useState([]);
    const textAreaRef = useRef(null);
    useEffect(() => {
        if (prompt.message !== '') {
            fetchQueryResponse();
        }
    }, [prompt])

    useEffect(() => {
        setHistory(currentSession.history)
    }, [currentSession])

    const updateHistoryAndSession = (message, author) => {
        const newMessage = {'author': author, 'message': message}
        const newHistory = [...history, newMessage];
        const newSessions = sessions.map(session => {
            if(session.id === currentSession.id) {
                session.history = newHistory;
            }
            return session;
        })

        setHistory(newHistory);
        setCurrentSession((prevSession) => ({
            ...prevSession,
            'history': newHistory
        }));

        setSessions(newSessions);
    }

    const fetchQueryResponse = async function() {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/query?prompt=${encodeURIComponent(prompt.message)}&session=${encodeURIComponent(currentSession.id)}`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            let stringResponse = JSON.stringify(data.data, null, 2);
            stringResponse = stringResponse.replace(/\\"/g, '"')
                .replace(/\\n/g, '\n')
                .replace(/\\&/g, '&');
            stringResponse = stringResponse.substring(1, stringResponse.length - 1);
            setResponse({...response, 'message': stringResponse});
            updateHistoryAndSession(stringResponse, 'ai');
        } catch (error) {
            console.error(error);
            setResponse({...response, 'message': 'Error fetching data.'});
        }
    }

    const handleQuery = () => {
        let message = textAreaRef.current.value;
        textAreaRef.current.value = '';
        setPrompt({...prompt, 'message': message});
        updateHistoryAndSession(message, 'you')
    }

    return(
        <div className="mx-auto flex justify-center flex-col gap-4 px-4 mt-4 pt-0">

            <Chat
                history={history}
                response={response}
                prompt={prompt}
            />
            <div className="sticky bottom-0 flex flex-col gap-4 py-4 bg-background">
                <ChatPrompt
                    textAreaRef={textAreaRef}
                    prompt={prompt}
                />
                <Button
                    onClick={handleQuery}
                >
                    Query
                </Button>
            </div>
        </div>
    )


}