import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const courier = Courier_Prime({
  weight: ['400', '700'],
  variable: "--font-courier",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kortreist Mat - Finn lokal mat nær deg",
  description: "Dropp de dyre dagligvarekjedene. Finn råmelk, lokalhonning, hjemmebakt brød og ferskt kjøtt direkte fra bonden i Oslo-området.",
  keywords: ["lokalmat", "bonde", "råmelk", "honning", "gårdsbutikk", "oslo", "kortreist", "fersk mat"],
  authors: [{ name: "Kortreist Mat" }],
  creator: "Kortreist Mat",
  metadataBase: new URL('https://kortreist-inky.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: 'https://kortreist-inky.vercel.app',
    siteName: 'Kortreist Mat',
    title: 'Kortreist Mat - Finn lokal mat nær deg',
    description: 'Dropp de dyre dagligvarekjedene. Finn råmelk, lokalhonning, hjemmebakt brød og ferskt kjøtt direkte fra bonden.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Kortreist Mat - Finn lokal mat nær deg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kortreist Mat - Finn lokal mat nær deg',
    description: 'Dropp de dyre dagligvarekjedene. Finn råmelk, lokalhonning, hjemmebakt brød og ferskt kjøtt direkte fra bonden.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kortreist" />
        <meta name="theme-color" content="#fbbf24" />
      </head>
      <body
        className={`${courier.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
