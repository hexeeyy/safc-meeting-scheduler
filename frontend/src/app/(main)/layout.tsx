import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import React from "react";
import HeaderNav from "@/components/common/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SAFC - Meeting Scheduler",
    template: "%s | SAFC Scheduler",
  },
  description: "A smart and easy way to book SAFC meeting rooms.",
  keywords: ["meeting", "scheduler", "SAFC", "room booking"],
  authors: [{ name: "Hexilon Payno", url: "" }],
  openGraph: {
    title: "SAFC - Meeting Scheduler",
    description: "Schedule meetings quickly and efficiently.",
    url: "",
    siteName: "SAFC Scheduler",
    images: [
      {
        url: "https://raw.githubusercontent.com/hexeeyy/safc-meeting-scheduler/main/frontend/src/app/favicon.ico",
        width: 1200,
        height: 630,
        alt: "SAFC Scheduler",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body
        className="bg-gray-50 dark:bg-gray-800/80 backdrop-blur-lg min-h-screen"
        suppressHydrationWarning
      >
        <div className="flex min-h-screen flex-col">
          <HeaderNav />
          <main className="flex-3/4">{children}</main>
        </div>
      </body>
    </html>
  );
}
