import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Be_Vietnam_Pro } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "Consolidate Dashboard",
  description: "A Web3 dashboard for consolidating assets across multiple chains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${beVietnamPro.variable}`} suppressHydrationWarning={true}>
        <Providers>
          <div className="min-h-screen bg-[#BEF3B8]">
            <Navbar />
            <div className="flex h-[calc(100vh-3.5rem)]">
              <Sidebar />
              <main className="flex-1 p-6 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
