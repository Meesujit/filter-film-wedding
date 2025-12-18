import { auth } from "@/app/auth";
import { packageService } from "@/app/lib/services/package-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ packageId: string }> }
) {
  const session = await auth();

  if (!session || !["admin", "customer"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { packageId } = await context.params;

    const pkg = await packageService.getPackageById(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ package: pkg });
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ packageId: string }> }
) {
  const session = await auth();

  if (!session || !["admin", "customer"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { packageId } = await context.params;
    const updates = await req.json();

    const updatedPackage = await packageService.updatePackage(
      packageId,
      updates
    );

    if (!updatedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ package: updatedPackage });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ packageId: string }> }
) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { packageId } = await context.params;

    const success = await packageService.deletePackage(packageId);
    if (!success) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
