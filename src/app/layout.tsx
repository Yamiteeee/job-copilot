import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Your exact logo component translated into an optimized dynamic data URI string
const logoSvgIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="rgba(6, 78, 59, 0.2)" stroke="rgba(6, 95, 70, 0.8)" stroke-width="1"/><text x="16" y="21" font-family="monospace" font-weight="900" font-size="16" fill="%2334d399" text-anchor="middle">⚡</text><circle cx="26" cy="6" r="2" fill="%2310b981"/></svg>`;

export const metadata: Metadata = {
  title: "AI Job Copilot",
  description: "Automated Job Search Optimization Match Engine & Pipelines",
  icons: {
    // Dynamically renders your exact component design inside the browser tab block
    icon: logoSvgIcon, 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}