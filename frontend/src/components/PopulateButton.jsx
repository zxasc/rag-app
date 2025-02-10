import {useState} from "react";
import {Button} from "@/components/ui/button";
import {SidebarGroup} from "@/components/ui/sidebar";

export default function PopulateButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleButtonClick = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/populate');
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SidebarGroup title="Populate">
            { !isLoading && <Button onClick={() => handleButtonClick()}>Populate</Button> }
            { isLoading && <p>Populating...</p> }
        </SidebarGroup>
    )
}