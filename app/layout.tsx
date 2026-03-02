import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "antd/dist/reset.css";
import Providers from "@/components/AppProviders";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "QStack",
  description: "Modern Developer Q&A Platform",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 pt-24 pr-6 pb-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}