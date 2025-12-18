import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { userService } from "@/app/lib/services/user-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Optional: Add credentials provider if needed
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Implement your own credential validation logic here
        if (!credentials?.email) return null;
        
        const user = await userService.getUserByEmail(credentials.email as string);
        return user ? {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        } : null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Check if user exists in Drive database
      let dbUser = await userService.getUserByEmail(user.email);

      // If user doesn't exist, create them with default 'customer' role
      if (!dbUser) {
        dbUser = await userService.createUser({
          email: user.email,
          name: user.name || undefined,
          image: user.image || undefined,
          role: 'customer', // Default role for new users
        });
      }

      // Attach user ID and role for later use
      user.id = dbUser.id;
      user.role = dbUser.role;

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Handle updates (when session is updated)
      if (trigger === "update" && session) {
        // Fetch fresh user data from Drive
        const dbUser = await userService.getUserById(token.id as string);
        if (dbUser) {
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "team" | "customer";
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
});