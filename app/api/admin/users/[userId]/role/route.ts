
import { userService } from "@/app/lib/services/user-service.server";
import { NextResponse } from "next/server";
import { UserRole } from "@/app/types/user";
import { getServerSession } from "@/app/lib/firebase/server-auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  // ✅ MUST await params in Next 15+
  const { userId } = await context.params;

  const session = await getServerSession();


  // Authentication
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Authorization
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden - Admin only" },
      { status: 403 }
    );
  }

  // Admin cannot update self
  if (session.id === userId) {
    return NextResponse.json(
      { error: "You cannot change your own role" },
      { status: 400 }
    );
  }

  const { role } = await req.json();

  // Admin can ONLY assign team
  if (role !== "team") {
    return NextResponse.json(
      { error: "Admins can only assign team role" },
      { status: 400 }
    );
  }

  try {
    const targetUser = await userService.getUserById(userId);

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Cannot modify another admin
    if (targetUser.role === "admin") {
      return NextResponse.json(
        { error: "You cannot change another admin's role" },
        { status: 400 }
      );
    }

    const updatedUser = await userService.updateUserRole(
      userId,
      "team" as UserRole
    );

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
