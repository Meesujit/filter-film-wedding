// /api/bookings/route.ts
import { auth } from "@/app/auth";
import { bookingService } from "@/app/lib/services/booking-service";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        let bookings;
        
        // Admin can see all bookings
        if (session.user.role === "admin") {
            bookings = await bookingService.getAllBookings();
        } 
        // Customers can only see their own bookings
        else if (session.user.role === "customer") {
            bookings = await bookingService.getBookingsByUserId(session.user.id);
        }
        // Team members can see all bookings (or filter by assigned if needed)
        else if (session.user.role === "team") {
            bookings = await bookingService.getAllBookings();
            // Optional: Filter by assigned team
            // bookings = await bookingService.getBookingsByAssignedTeam(session.user.id);
        }
        else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        console.log("Fetched bookings:", bookings);
        return NextResponse.json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only customers and admins can create bookings
    if (session.user.role !== "customer" && session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const data = await req.json();
        
        // Validate required fields
        if (!data.packageId || !data.eventType || !data.eventName || !data.date || !data.venue) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }
        
        // Create new booking with userId automatically set
        const newBooking = await bookingService.createBooking({
            userId: session.user.id, // Automatically use logged-in user's ID
            packageId: data.packageId,
            eventType: data.eventType,
            eventName: data.eventName,
            date: data.date,
            venue: data.venue,
            status: data.status || 'pending', // Default to pending
            totalAmount: data.totalAmount,
            paidAmount: data.paidAmount || 0, // Default to 0 if not provided
            notes: data.notes || '',
            assignedTeam: data.assignedTeam || [],
        });
        
        return NextResponse.json({ booking: newBooking }, { status: 201 });
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}