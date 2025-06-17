import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/ui/App-sidebar";
import BigCalendar from "@/components/calendar/Calendar";
import HeaderNav from "@/components/common/Header";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
        url: "",
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
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <HeaderNav />
        {/* <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-col md:flex-row">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1 p-4">{children}</div>
          </main>
          <BigCalendar />
        </SidebarProvider> */}
      </body>
    </html>
  );
}
