import type { Metadata } from "next";
import { Bangers } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Der Dümmste Fliegt",
  description: "A German Game created by a Social Media Personality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bangers.className} antialiased`}
      >
        {children}
        <Toaster richColors/>
      </body>
    </html>
  );
}
