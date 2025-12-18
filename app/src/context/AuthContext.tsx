"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type Role = "admin" | "customer" | "team";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  signin: () => void;
  logout: () => void;
  isAdmin: boolean;
  isCustomer: boolean;
  isTeam: boolean;
  role: Role | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const user = session?.user ?? null;

  const value = useMemo<AuthContextType>(() => {
    const role = (user?.role as Role) ?? null;

    return {
      user,
      status,
      isAuthenticated: !!user,
      role,

      isAdmin: role === "admin",
      isCustomer: role === "customer",
      isTeam: role === "team",

      signin: () => {
        signIn("google", {
          callbackUrl: "/signin", // role-based redirect handled elsewhere
        });
      },

      logout: () => {
        signOut({ callbackUrl: "/" });
      },
    };
  }, [user, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
