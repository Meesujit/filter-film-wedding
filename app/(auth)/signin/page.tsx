// app/(auth)/login/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import SignInForm from "@/app/src/components/auth/singin-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams;

  // If already logged in, redirect to appropriate dashboard
  if (session) {
    const redirectUrl = getDashboardByRole(session.user.role);
    redirect(redirectUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Please sign in to continue
          </p>
        </div>
        
        {params.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {getErrorMessage(params.error)}
          </div>
        )}

        <SignInForm callbackUrl={params.callbackUrl} />
      </div>
    </div>
  );
}

function getDashboardByRole(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "team":
      return "/team/dashboard";
    case "customer":
      return "/customer/dashboard";
    default:
      return "/customer/dashboard";
  }
}

function getErrorMessage(error: string): string {
  switch (error) {
    case "OAuthSignin":
      return "Error occurred during sign in. Please try again.";
    case "OAuthCallback":
      return "Error occurred during callback. Please try again.";
    case "OAuthCreateAccount":
      return "Could not create account. Please try again.";
    case "EmailCreateAccount":
      return "Could not create account. Please try again.";
    case "Callback":
      return "Error occurred during callback. Please try again.";
    case "OAuthAccountNotLinked":
      return "Email already associated with another account.";
    case "EmailSignin":
      return "Check your email for the sign in link.";
    case "CredentialsSignin":
      return "Invalid credentials. Please check your email and password.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      return "An error occurred. Please try again.";
  }
}