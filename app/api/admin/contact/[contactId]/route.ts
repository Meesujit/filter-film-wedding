import { getServerSession } from "@/app/lib/firebase/server-auth";
import { contactService } from "@/app/lib/services/contact-service";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();
    const allowedRoles = ["admin", "customer", "team"];
    if (!session || !allowedRoles.includes(session.role)) {
        return NextResponse.json({ error: `Unauthorized not having required role${session ? `: ${session.role}` : ''}` }, { status: 401 });
    }
    try {
        const messages = await contactService.getAllMessages();
        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const success = await contactService.deleteAllMessages();
        if (success) {
            return NextResponse.json({ message: "All contact messages deleted." });
        } else {
            return NextResponse.json(
                { error: "Failed to delete contact messages." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error deleting all contact messages:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const data = await req.json();
        const updatedMessage = await contactService.updateMessage(data.id, data.updates);
        if (updatedMessage) {
            return NextResponse.json({ message: updatedMessage });
        }
        else {
            return NextResponse.json(
                { error: "Contact message not found." },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Error updating contact message:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}   