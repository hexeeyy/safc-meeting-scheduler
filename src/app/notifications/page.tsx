import { Notifications } from "@/app/notifications/Notifications";

export default function NotificationPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Notifications />
      </div>
    </div>
  );
}
