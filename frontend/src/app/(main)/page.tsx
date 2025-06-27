import React from "react";
import Sidebar from "@/components/common/Sidebar";
import BigCalendar from "@/components/calendar/Calendar";

export default function HomePage() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1 h-full w-full overflow-auto">
        <BigCalendar />
      </div>
    </main>
  );
}
