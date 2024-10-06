import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bowlby_One } from "next/font/google";
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const bowlbyOne = Bowlby_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Moods",
  description: "The AI playlist generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bowlbyOne} ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  );
}
