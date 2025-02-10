import ChatWindow from "./components/ChatWindow.jsx";
import AppSidebar from "./components/Sidebar.jsx";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger
} from "@/components/ui/sidebar"
import {useEffect, useState} from "react";

function App() {
    const [currentSession, setCurrentSession] = useState({'id': 'testid', 'name': 'test', 'history': []})
    const [sessions, setSessions] = useState([{'id': 'testid', 'name': 'test', 'history': []}, {'id': '3', 'name': 'three', 'history': []}, {'id': '2', 'name': 'two', 'history': []}])

    const handleCurrentSessionChange = (session) => {
        setCurrentSession(session)
    }

    const addSession = (session) => {
        setSessions([...sessions, session])
    }

    const renameSession = (wantedSession, name) => {
        setSessions(sessions.filter((session) => {
            if (session.id === wantedSession.id) {
                session.name = name
            }
        }))
    }

    const removeSession = (removedSession) => {
        let newSessions = sessions.filter((session) => session.id !== removedSession.id)
        if(removedSession.id === currentSession.id) {
            setCurrentSession(newSessions[0])
        }
        setSessions(newSessions)
    }

    return (
        <SidebarProvider className="flex flex-row">
            <AppSidebar
                currentSession={currentSession}
                sessions={sessions}
                handleCurrentSessionChange={handleCurrentSessionChange}
                addSession={addSession}
                renameSession={renameSession}
                removeSession={removeSession}
            />
            <SidebarTrigger className="sticky top-0"/>
            <ChatWindow
                sessions={sessions}
                setSessions={setSessions}
                currentSession={currentSession}
                setCurrentSession={setCurrentSession}
                handleCurrentSessionChange={handleCurrentSessionChange}
            />
        </SidebarProvider>
    )
}

export default App
