import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "antd/dist/reset.css";
import Providers from "./components/AppProviders";
import Navbar from "./components/Navbar";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
           <Navbar />
            <main className="px-6 py-8">
          {children}
        </main>
        </Providers>
      </body>
    </html>
  );
}