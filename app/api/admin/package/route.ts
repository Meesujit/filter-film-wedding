import { getServerSession } from "@/app/lib/firebase/server-auth";
import { packageService } from "@/app/lib/services/package-service";
import { NextResponse } from "next/server";

// GET all packages
export async function GET(req: Request) {
    const session = await getServerSession();
    const allowedRoles = ["admin", "customer", "team"];
    if (!session || !allowedRoles.includes(session.role)) {
        return NextResponse.json({ error: `Unauthorized not having required role${session ? `: ${session.role}` : ''}` }, { status: 401 });
    }
    try {
        const packages = await packageService.getAllPackages();
        return NextResponse.json({ packages });
    } catch (error) {
        console.error("Error fetching packages:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const data = await req.json();
        // Create new package
        const newPackage = await packageService.createPackage({
            name: data.name,
            description: data.description,
            price: data.price,
            deliverables: data.deliverables,
            preview: data.preview,
            duration: data.duration,
            popular: data.popular || false,
        });
        return NextResponse.json({ package: newPackage }, { status: 201 });
    } catch (error) {
        console.error("Error creating package:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
