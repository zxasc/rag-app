import {useEffect, useState, useMemo} from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu, SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {ChevronRight, Trash} from "lucide-react";
import {Dialog, DialogTrigger, DialogContent,DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

export default function PDFList({pdfs, setPdfs, fetchPDFs}) {
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async function (pdf)  {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/delete?pdf_name=${pdf}`, {
                    method: "DELETE"
                });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const pdfList = await response.json();
            setPdfs(pdfList);
        } catch(error) {
            console.error(error);
        }
    }

    const handleCollapsible = (open) => {
        if (open) {
            fetchPDFs();
        }
        setIsOpen(open);
    }
    
    return(
        <Collapsible className="group/collapsible" open={isOpen} onOpenChange={handleCollapsible}>
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sm font-bold"
                >
                    <CollapsibleTrigger>
                        PDFs
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {pdfs.map((pdf, i) => (
                                <SidebarMenuItem key={i}>
                                    <SidebarMenuButton asChild>
                                        <p className="min-w-0 inline-block">
                                            <span className="truncate">
                                                {pdf}
                                            </span>
                                        </p>
                                    </SidebarMenuButton>
                                    <SidebarMenuAction>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Trash />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    {pdf} will be irreversibly lost.
                                                </DialogDescription>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            className="bg-destructive hover:bg-destructive/80"
                                                            onClick={() => handleDelete(pdf)}
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
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}