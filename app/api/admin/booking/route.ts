// /api/admin/booking/route.ts
import { getServerSession } from "@/app/lib/firebase/server-auth";
import { bookingService } from "@/app/lib/services/booking-service";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        let bookings;
        
        // Admin can see all bookings
        if (session.role === "admin") {
            bookings = await bookingService.getAllBookings();
        } 
        // Customers can only see their own bookings
        else if (session.role === "customer") {
            bookings = await bookingService.getBookingsByUserId(session.id);
        }
        // Team members can ONLY see bookings assigned to them
        else if (session.role === "team") {
            bookings = await bookingService.getBookingsByAssignedTeam(session.id);
        }
        else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
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
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only customers and admins can create bookings
    if (session.role !== "customer" && session.role !== "admin") {
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
        
        // Create new booking - NO assignedTeam during creation
        const newBooking = await bookingService.createBooking({
            userId: session.id,
            packages: data.packages,
            eventType: data.eventType,
            eventName: data.eventName,
            startDate: data.startDate,
            endDate: data.endDate,
            venue: data.venue,
            status: 'pending', // Always pending for new bookings
            totalAmount: data.totalAmount,
            paidAmount: data.paidAmount || 0,
            notes: data.notes || '',
            assignedTeam: [], // Always empty - admin assigns later
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