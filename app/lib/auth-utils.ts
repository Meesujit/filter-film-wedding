import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/app/types/user";

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized");
  }
  
  return session;
}

export async function checkRole(role: UserRole) {
  const session = await auth();
  return session?.user.role === role;
}

export async function isAdmin() {
  return checkRole("admin");
}

export async function isTeam() {
  const session = await auth();
  return session?.user.role === "team" || session?.user.role === "admin";
}