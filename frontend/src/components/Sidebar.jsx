import PDFList from "./PDFList.jsx";
import PopulateButton from "./PopulateButton.jsx";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import Uploader from "@/components/Uploader.jsx";
import SessionChanger from "@/components/SessionChanger.jsx";
import {useState} from "react";
export default function AppSidebar({currentSession, sessions, handleCurrentSessionChange, addSession, renameSession, removeSession}) {
    const [pdfs, setPdfs] = useState([])

    const fetchPDFs = async function() {
        try {
            const response = await fetch(
                "http://127.0.0.1:5000/listpdfs"
            );
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const pdfList = await response.json();
            setPdfs(pdfList);
        } catch(error) {
            console.error(error);
        }
    };

    return(
        <Sidebar>
            <SidebarHeader>
                <h1>🤖</h1>
            </SidebarHeader>
            <SidebarContent>
                <PDFList
                    pdfs={pdfs}
                    setPdfs={setPdfs}
                    fetchPDFs={fetchPDFs}
                />
                <SessionChanger
                    currentSession={currentSession}
                    sessions={sessions}
                    handleCurrentSessionChange={handleCurrentSessionChange}
                    addSession={addSession}
                    renameSession={renameSession}
                    removeSession={removeSession}
                />
                <Uploader
                    fetchPDFs={fetchPDFs}
                />
                <PopulateButton />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}