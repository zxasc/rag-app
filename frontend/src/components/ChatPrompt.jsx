import {Textarea} from "@/components/ui/textarea";
export default function ChatPrompt({ textAreaRef, prompt, onChange }) {
    return (
        <div>
            <Textarea
                ref={textAreaRef}
                // onChange={onChange}
                placeholder="Ask a question..."
                // value={prompt.message}
            />
        </div>
    )
}