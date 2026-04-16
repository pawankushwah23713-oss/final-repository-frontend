"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/navbar";
import Footer from "./component/footer.js";
import { UserProvider } from "./UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white">
        
        <UserProvider>
          <Navbar />

          {/* 🔥 IMPORTANT: content full height lega */}
          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </UserProvider>

      </body>
    </html>
  );
}