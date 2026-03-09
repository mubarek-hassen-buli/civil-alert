"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  CheckSquare, 
  Users, 
  Box,
  CreditCard,
  Settings,
  HelpCircle,
  AlertTriangle,
  LogOut
} from "lucide-react";
import { cn } from "@/app/lib/utils";

// Mapping navigation items based on the new sidebar design logic, adapted to CivicAlerts
const navItems = [
  { name: "Home", href: "/dashboard", icon: Home, count: 10 },
  { name: "Reports", href: "/reports", icon: CheckSquare },
  { name: "Users", href: "/users", icon: Users, count: 2 },
  { name: "Agencies", href: "/agencies", icon: Box },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full h-full flex flex-col pt-8 pb-6 px-4 overflow-y-auto no-scrollbar">
      
      {/* Brand */}
      <div className="flex items-center space-x-3 px-4 mb-10">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold pb-0.5">
          S
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">CivicAlerts</span>
      </div>

      {/* Global Search inside Sidebar (from new design) */}
      <div className="px-4 mb-6">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="search" 
            placeholder="Search..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '/reports');

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-3 rounded-2xl text-[15px] font-medium transition-all group",
                isActive 
                  ? "bg-slate-50 text-primary font-semibold shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={cn("w-[22px] h-[22px]", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </div>
              {item.count && (
                 <span className={cn("px-2.5 py-0.5 text-xs font-semibold rounded-full border", isActive ? "border-primary/20 text-primary bg-primary/5" : "border-slate-200 text-slate-400 bg-white")}>
                   {item.count}
                 </span>
              )}
            </Link>
          )
        })}
      </div>



      {/* User Info Bottom */}
      <div className="mt-auto px-4 flex items-center justify-between pt-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Azunyan U. Wu" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">Alex Johnson</span>
            <span className="text-xs text-slate-500 font-medium">Basic Member</span>
          </div>
        </div>
        <button className="text-primary hover:bg-primary/5 p-2 rounded-xl transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 5v14l8-7zM2 5h8M2 19h8"/></svg>
        </button>
      </div>

    </div>
  );
}
