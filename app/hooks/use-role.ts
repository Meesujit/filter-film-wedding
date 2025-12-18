"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@/app/types/user";

export function useRole() {
  const { data: session } = useSession();

  return {
    role: session?.user.role,
    isAdmin: session?.user.role === "admin",
    isTeam: session?.user.role === "team" || session?.user.role === "admin",
    isCustomer: !!session?.user.role,
    hasRole: (allowedRoles: UserRole[]) =>
      session?.user.role ? allowedRoles.includes(session.user.role) : false,
  };
}