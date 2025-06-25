import React from "react";
import Sidebar from "@/components/common/Sidebar";
import BigCalendar from "@/components/calendar/Calendar";

export default function HomePage() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4">
        <BigCalendar />
      </div>
    </main>
  );
}
