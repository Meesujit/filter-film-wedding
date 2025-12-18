import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  // If there's a callback URL, use it
  if (searchParams.callbackUrl) {
    redirect(searchParams.callbackUrl);
  }

  // Otherwise, redirect based on role
  const role = session.user.role;

  switch (role) {
    case "admin":
      redirect("/admin/dashboard");
    case "team":
      redirect("/team/dashboard");
    case "customer":
      redirect("/customer/dashboard");
    default:
      redirect("/customer/dashboard");
  }
}