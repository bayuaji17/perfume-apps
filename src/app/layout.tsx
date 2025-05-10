import type { Metadata } from "next";
import { Sometype_Mono, Space_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  subsets: ["latin"],
});

const someType = Sometype_Mono({
  variable: "--font-sometype-mono",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zalisma",
  description:
    "'Simplicity is the keynote of all true elegance.' — Coco Chanel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${someType.variable} ${spaceMono.variable} antialiased font-sans`}
      >
        <Provider>
          {/* <Navbar /> */}
          <Toaster
            position="top-center"
            richColors
            expand
            swipeDirections={["top", "right", "bottom", "left"]}
          />
          {children}
        </Provider>
      </body>
    </html>
  );
}
