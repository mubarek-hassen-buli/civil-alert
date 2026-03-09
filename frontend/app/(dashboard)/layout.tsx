import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center min-h-screen w-full bg-white relative selection:bg-primary/20">
      
      <div className="flex w-full max-w-[1280px]">
        {/* 1. Left Sidebar - Fixed */}
        <div className="hidden lg:flex w-[280px] shrink-0 h-screen sticky top-0 border-r border-slate-100 z-20">
          <Sidebar />
        </div>

        {/* 2 & 3. Main Content Area */}
        <div className="flex flex-1 w-full min-w-0">
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </div>
      
    </div>
  );
}
