import { auth, signIn, signOut } from "@/app/auth";
import Image from "next/image";

export default async function Login () {
  const session = await auth();
  const user = session?.user;

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1>Welcome, {user.name}!</h1>
        <p className="text-lg">Signed in as {user.email}</p>
        <Image  src={user?.image ?? "/avatar-placeholder.png"}   alt="User Image" width={100} height={100} className="rounded-full" />
        <form
          action={async () => {
            "use server";
            await signOut({
              redirectTo: '/',
              redirect: true,
            });
          }}
        >
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-black text-white font-medium hover:opacity-90 transition"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  } 

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: '/overview',
            redirect: true,
          });
        }}
      >
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-black text-white font-medium hover:opacity-90 transition"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
