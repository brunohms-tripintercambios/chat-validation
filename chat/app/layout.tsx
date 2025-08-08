import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "./component/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Validatação do bot",
  description: "Vamos validar o funcionamento da nossa IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div style={{display: "flex", flexDirection: "row", height: "auto"}}>
          <Sidebar />
          <div style={{flex: "1", margin: "16px"}}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
