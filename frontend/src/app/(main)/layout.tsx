import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css"; 

import React from "react";

import HeaderNav from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SideBar from "@/components/common/SideBar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // choose the weights you need
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
        url: "https://github.com/hexeeyy/safc-meeting-scheduler/blob/main/frontend/src/app/favicon.ico",
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
      <body className= "font-poppins bg-green-50">
        <div className="flex min-h-screen flex-col">
          <HeaderNav />
          <main className="flex-grow">{children}</main>
          {/* <SideBar /> */}
          <Footer />
        </div>
      </body>
    </html>
    
  );
}
