import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "MyFlightBook — The World's Favorite Free Pilot Logbook",
    template: "%s | MyFlightBook",
  },
  description:
    "MyFlightbook is the most popular digital pilot logbook worldwide. Track flights, stay current, and securely access your logbook from anywhere. Free forever.",
  keywords: [
    "digital pilot logbook",
    "flight logging app",
    "online logbook",
    "pilot logbook",
    "free logbook for pilots",
    "FAA logbook",
    "aviation logbook",
    "EASA logbook",
  ],
  openGraph: {
    title: "MyFlightBook — The World's Favorite Free Pilot Logbook",
    description:
      "Track flights, stay current, and access your logbook from anywhere. Trusted by 100,000+ pilots worldwide.",
    type: "website",
    locale: "en_US",
    siteName: "MyFlightBook",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyFlightBook — Free Digital Pilot Logbook",
    description:
      "The world's most popular free pilot logbook. 26M+ flights logged.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise-overlay">
        <Header />
        <main style={{ paddingTop: 'var(--header-height)' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
