"use client";

import React, { useState } from "react";
import { Smile, Mic, Send, Paperclip } from "lucide-react";
import { SlothAlertCard } from "@/components/ui/sloth-alert-card";
import { ProfileSidebar } from "@/components/layout/profile-sidebar";
import Link from "next/link";

// MOCK DATA MAPPED TO NEW STRUCTURE
const MOCK_POSTS = [
  {
    id: "1",
    author: {
      avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
      name: "X_AE_A-13",
      role: "City Planner, CivicAlerts",
    },
    content: "Major water main rupture has been detected at the intersection of 5th Avenue and Market Street. Initial pressure drop was recorded at 09:12 AM PST.",
    hashtags: ["critical", "watermain", "downtown", "traffic"],
    imageSrc: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800&h=450",
    realVotes: 128,
    fakeVotes: 12,
  },
  {
    id: "2",
    author: {
      avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
      name: "Amanda D. Gray",
      role: "Local Resident",
    },
    content: "Grid optimization scheduled for the 400-block of Industrial Way. Power expected to be stable but please be cautious around the construction zones.",
    hashtags: ["powergrid", "update", "industrial"],
    realVotes: 42,
    fakeVotes: 2,
  },
  {
    id: "3",
    author: {
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      name: "Mai Sakurajima Senpai",
      role: "Traffic Monitor",
    },
    content: "Dangerous driving conditions on the Golden Gate Bridge due to localized dense fog. Visibility is currently near zero. Drive safely!",
    hashtags: ["fog", "goldengate", "safety", "alert"],
    imageSrc: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800&h=450",
    realVotes: 340,
    fakeVotes: 45,
  }
];

export default function DashboardHomeFeed() {
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");

  return (
    <div className="flex w-full min-h-screen justify-between">
      
      {/* CENTER COLUMN: Main Feed */}
      <div className="flex-1 max-w-[640px] flex flex-col min-h-screen border-r border-slate-100 mx-auto xl:mx-0">
        <div className="px-4 py-4 sm:px-6 sm:py-6 flex flex-col flex-1">
         
         {/* Top Tabs */}
         <div className="flex items-center w-full border-b border-slate-200 mb-6 relative">
            <button 
               onClick={() => setActiveTab("foryou")}
               className={`flex-1 pb-4 text-[15px] font-semibold transition-colors relative ${activeTab === "foryou" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
            >
               For You
               {activeTab === "foryou" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full"></div>
               )}
            </button>
            <button 
               onClick={() => setActiveTab("following")}
               className={`flex-1 pb-4 text-[15px] font-semibold transition-colors relative ${activeTab === "following" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
            >
               Following
               {activeTab === "following" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full"></div>
               )}
            </button>
         </div>

         {/* Call to Create Report */}
         <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8">
            <div className="flex flex-col hidden sm:flex">
               <span className="text-[15px] font-bold text-slate-800">Notice an issue in your area?</span>
               <span className="text-sm text-slate-500 font-medium tracking-tight">Help keep the community informed.</span>
            </div>
            <Link 
               href="/reports/create"
               className="bg-primary hover:bg-primary/90 text-white font-semibold text-[14px] flex items-center px-5 py-2.5 rounded-full transition-colors sm:w-auto w-full justify-center"
            >
               <span className="mr-1.5">+</span>
               <span>Create Report</span>
            </Link>
         </div>

         {/* Feed List */}
         <div className="flex flex-col flex-1">
            {MOCK_POSTS.map(post => (
               <SlothAlertCard key={post.id} {...post} />
            ))}
         </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Persistent Profile Details */}
      <div className="hidden xl:flex w-[350px] shrink-0 h-screen sticky top-0 flex-col overflow-y-auto no-scrollbar pt-6 px-4 pb-6">
         <ProfileSidebar />
      </div>

    </div>
  );
}
