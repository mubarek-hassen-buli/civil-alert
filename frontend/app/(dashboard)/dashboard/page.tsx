"use client";

import React, { useState } from "react";
import { SlothAlertCard } from "@/components/ui/sloth-alert-card";
import { ProfileSidebar } from "@/components/layout/profile-sidebar";
import Link from "next/link";
import { useReports, Report } from "@/app/hooks/use-reports";

// Fallback mock data used when API is unreachable
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

/** Transforms an API report into the shape expected by SlothAlertCard. */
function mapReportToCard(report: Report) {
  return {
    id: report.id,
    author: {
      avatar: report.profiles?.avatar_url || "https://i.pravatar.cc/150?u=default",
      name: report.profiles?.full_name || report.profiles?.username || "Anonymous",
      role: report.category.replace('_', ' '),
    },
    content: report.description,
    hashtags: [report.category, report.urgency, report.area],
    imageSrc: report.media_urls?.[0],
    realVotes: report.realVotes ?? 0,
    fakeVotes: report.fakeVotes ?? 0,
  };
}

export default function DashboardHomeFeed() {
  const [selectedArea, setSelectedArea] = useState<string>("downtown");

  // Fetch reports from API, filtered by area (unless "citywide")
  const areaFilter = selectedArea === "citywide" ? {} : { area: selectedArea };
  const { data: apiReports, isLoading, isError } = useReports(areaFilter);

  // Use API data if available, otherwise fall back to mock data
  const displayPosts = apiReports && apiReports.length > 0
    ? apiReports.map(mapReportToCard)
    : MOCK_POSTS;

  return (
    <div className="flex w-full min-h-screen justify-between">
      
      {/* CENTER COLUMN: Main Feed */}
      <div className="flex-1 max-w-[640px] flex flex-col min-h-screen border-r border-slate-100 mx-auto xl:mx-0">
        <div className="px-4 py-4 sm:px-6 sm:py-6 flex flex-col flex-1">
         
         {/* Area Selection Header */}
         <div className="flex items-center justify-between w-full mb-8 relative">
            <div className="flex flex-col">
               <span className="text-xl font-extrabold text-slate-900 tracking-tight">Active Reports</span>
               <span className="text-[13px] text-slate-500 font-medium">Monitoring activity in your selected area</span>
            </div>
            
            <div className="relative">
               <select 
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-800 text-[14px] font-bold py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:border-slate-300 transition-colors"
               >
                  <option value="downtown">Downtown District</option>
                  <option value="uptown">Uptown Suburbs</option>
                  <option value="industrial">Industrial Zone</option>
                  <option value="citywide">Citywide (All)</option>
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
               </div>
            </div>
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

         {/* Loading State */}
         {isLoading && (
           <div className="flex items-center justify-center py-12">
             <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
           </div>
         )}

         {/* Feed List */}
         <div className="flex flex-col flex-1">
            {displayPosts.map(post => (
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
