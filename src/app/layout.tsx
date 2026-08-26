import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Village — Keep Your Knowledge Where It Belongs",
  description: "Capture what your experienced team members know before it walks out the door. Workflows, knowledge articles, and expert attribution — built for small teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-gray-50 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
