"use client";

import { redirect } from "next/navigation";
import { useAuth } from "../src/context/AuthContext";
import DashboardLayout from "../(dashboard)/layout";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) redirect("/login");
  if (user?.role !== "customer") redirect("/");

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
