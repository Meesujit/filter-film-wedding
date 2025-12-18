import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { DataProvider } from "./src/context/DataContext";
import { AuthProvider } from "./src/context/AuthContext";
import Navbar from "./src/components/common/Navbar";
import Footer from "./src/components/common/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "./auth";


const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Royal Wedding Studio",
  description: "India's premier wedding photography & cinematography studio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <AuthProvider>
            <DataProvider>
              <Navbar />
              {children}
              <Footer />
            </DataProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}