"use client";

import React from "react";
import { Search, MapPin, Bell, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-10 w-full shrink-0">
      
      {/* Left side actions (Location) */}
      <div className="flex items-center">
        <button className="flex items-center space-x-2 bg-white border border-border rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <MapPin className="w-4 h-4 text-primary fill-primary/20" />
          <span>San Francisco, CA</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>

      {/* Middle Search (Wide) */}
      <div className="flex-1 max-w-xl mx-8 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <Input 
          type="search" 
          placeholder="Search alerts or locations..." 
          className="w-full pl-10 bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        <button className="text-slate-500 hover:text-slate-900 transition-colors relative">
          <Bell className="w-5 h-5 fill-slate-500/10" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-critical rounded-full"></span>
        </button>
        <button className="text-slate-500 hover:text-slate-900 transition-colors">
          <Settings className="w-5 h-5 fill-slate-500/10" />
        </button>
      </div>

    </header>
  );
}
