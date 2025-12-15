import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import WhatsAppButton from "../common/WhatsAppButton";


export default function MainLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};


