import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Mike Perez — Designer & Builder",
  description:
    "Product designer and builder. Currently at Apple. Designing AI-native interfaces for the next generation of creative tools.",
  openGraph: {
    title: "Mike Perez — Designer & Builder",
    description:
      "Product designer and builder. Currently at Apple. Designing AI-native interfaces for the next generation of creative tools.",
    url: "https://mikeperez.design",
    siteName: "Mike Perez",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mike Perez — Designer & Builder",
    description:
      "Product designer and builder. Currently at Apple. Designing AI-native interfaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <Navbar />
          <div className="flex-1 pt-16">
            {children}
          </div>
          <Footer />
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
