import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";

const courier = Courier_Prime({
  weight: ['400', '700'],
  variable: "--font-courier",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kortreist Mat - Finn lokal mat nær deg",
  description: "Oversikt over lokale bønder og ferske råvarer i din region.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body
        className={`${courier.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
