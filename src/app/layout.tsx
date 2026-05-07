import type { Metadata } from "next";
import { Inter, Instrument_Serif, Great_Vibes } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-instrument",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Just After Work — When Work Ends, The Real Game Begins",
  description:
    "JAW is the meeting point for professionals who thrive beyond the 9-to-5. Stylish venues, crafted cocktails, and curated networking.",
  openGraph: {
    title: "Just After Work",
    description: "Unwind. Connect. Enjoy — Just After Work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable} ${greatVibes.variable} dark`}>
      <body className="bg-bg text-text-primary min-h-screen flex flex-col">
        <Navbar />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
