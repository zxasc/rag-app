import {
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel, SidebarMenu,
    SidebarMenuAction, SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Input } from "@/components/ui/input"
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {ChevronRight, Trash} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@radix-ui/react-collapsible";
import {Button} from "@/components/ui/button";
import {useRef, useState} from "react";
export default function SessionChanger({currentSession, sessions, handleCurrentSessionChange, addSession, renameSession, removeSession}) {

    const addNameInputRef = useRef(null);

    const handleAddingSession = () => {
        let id = Date.now().toString();
        let newSession = {'name': addNameInputRef.current.value, 'id': id, 'history': []};
        addSession(newSession);
        handleCurrentSessionChange(newSession);
    }

    return (
        <Collapsible className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sm font-bold"
                >
                    <CollapsibleTrigger>
                        Sessions
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sessions.map((session) => (
                                <SidebarMenuItem key={session.id}>
                                    <SidebarMenuButton
                                        onClick={() => handleCurrentSessionChange(session)}
                                    >
                                        {currentSession.id === session.id ? <ChevronRight /> : ""}
                                        {session.name}

                                    </SidebarMenuButton>
                                    <SidebarMenuAction >

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                    <Trash />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    {session.name} will be irreversibly lost.
                                                </DialogDescription>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            className="bg-destructive hover:bg-destructive/80"
                                                            onClick={() => removeSession(session)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button>
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </SidebarMenuAction>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild>
                                    <Dialog>
                                        <DialogTrigger className="flex w-full items-center gap-2 overflow-hidden text-sm p-2">Add a new session...</DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>New Session</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={e => {
                                                handleAddingSession();
                                                e.preventDefault()
                                            }}>
                                                <DialogDescription>
                                                    <Input
                                                        ref={addNameInputRef}
                                                        id="name"
                                                        type="text"
                                                        name="name"
                                                        placeholder="Enter new session name"
                                                    />
                                                </DialogDescription>
                                                <DialogFooter className="mt-2">
                                                    <DialogClose asChild type={"submit"}>
                                                        <Button>Add</Button>
                                                    </DialogClose>
                                                    <DialogClose
                                                        className={"bg-secondary hover:bg-secondary/80"}
                                                        asChild
                                                    >
                                                        <Button>Cancel</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}

