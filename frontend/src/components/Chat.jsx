import Markdown from "react-markdown";

export default function Chat({ history, response, prompt }) {
    return (
        <div className="flex flex-col gap-4 w-screen w-screen max-w-screen-sm md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg p-4 rounded-lg">
            {history.map((item, index) => (
                <Markdown className={item.author === 'you' ? 'bg-primary/30 px-2 py-1.5 rounded-md rounded-br-none w-fit ml-auto' : ''} key={index}>{item.message}</Markdown>
            ))}
        </div>
)
}