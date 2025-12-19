import { auth } from "@/app/auth";
import { galleryService } from "@/app/lib/services/gallery-service";
import { NextResponse } from "next/server";

// GET all galleries
export async function GET() {
    const session = await auth();
    const allowedRoles = ["admin", "customer", "team"];
    if (!session || !allowedRoles.includes(session.user.role)) {
        return NextResponse.json({ error: `Unauthorized not having required role${session ? `: ${session.user.role}` : ''}` }, { status: 401 });
    }
    try {
        const galleries = await galleryService.getAllGalleries();
        console.log("Fetched galleries:", galleries);
        return NextResponse.json({ galleries });
    } catch (error) {
        console.error("Error fetching galleries:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const data = await req.json();
        // Create new gallery
        const newGallery = await galleryService.createGallery({
            type: data.type,
            url: data.url,
            thumbnail: data.thumbnail,
            title: data.title,
            category: data.category,
            eventType: data.eventType,
        });
        return NextResponse.json({ gallery: newGallery }, { status: 201 });
    }
    catch (error) {
        console.error("Error creating gallery:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}