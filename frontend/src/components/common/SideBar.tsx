import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function SideBar() {
  return (
    <div>
    <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger/>
    </SidebarProvider>
    </div>
  )
}
