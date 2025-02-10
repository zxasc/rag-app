import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SidebarGroup} from "@/components/ui/sidebar";

export default function Uploader({fetchPDFs}) {

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        console.log("File changed:", event.target.files);
        const selectedFile = event.target.files[0]; // Access the first file (if multiple files are uploaded, adjust accordingly)
        setFile(selectedFile);
    };
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            console.log("Upload result:", result);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            fetchPDFs();
        }
    };

    return (
        <SidebarGroup>
            <form
                className="flex flex-col gap-4"
                action="http://localhost:5000/upload"
                onSubmit={(e) => {
                    uploadFile(file);
                    e.preventDefault();
                }}
            >
                <Input
                    id="pdfinput"
                    accept=".pdf"
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    className="grid w-full max-w-sm items-center gap-1.5"
                />
                <Button type="submit">
                    Upload
                </Button>

            </form>
        </SidebarGroup>
    )
}