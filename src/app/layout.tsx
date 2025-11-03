import type { Metadata } from "next";
import "./globals.css";
import Header from "../ui/components/Header";
import Footer from "../ui/components/Footer";


export const metadata: Metadata = {
  title: "Black Friday Hotpage",
  description: "Super deals and exclusive offers for Black Friday 2025!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-zinc-950 min-h-screen flex flex-col lg:min-h-screen`}
      >
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
