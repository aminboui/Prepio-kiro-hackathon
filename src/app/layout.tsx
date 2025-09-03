import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Prepio - AI-Powered Coding Challenges",
  description: "Personalized coding challenges with AI-powered feedback to improve your development skills",
  manifest: '/manifest.json',
  icons: {
    icon: ['/icon.svg'],
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#ea580c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}