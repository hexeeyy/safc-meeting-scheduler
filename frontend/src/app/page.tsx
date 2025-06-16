import React from "react";
import { LoginForm } from "@/components/common/Form";
import BigCalendar from "@/components/calendar/Calendar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
      <BigCalendar />
    </div>
  );
}