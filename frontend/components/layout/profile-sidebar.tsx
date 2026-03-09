"use client";

import React from "react";
import { CheckCircle2, Phone, Mail, Globe, MapPin, MoreVertical } from "lucide-react";
import { useMyProfile } from "@/app/hooks/use-profile";

export function ProfileSidebar() {
  const { data: profile, isLoading } = useMyProfile();

  const fullName = profile?.full_name || 'Anonymous User';
  const username = profile?.username ? `@${profile.username}` : '@user';
  const avatar = profile?.avatar_url || 'https://i.pravatar.cc/150?u=default';
  const city = profile?.city || 'Location Unknown';
  const trustScore = profile?.trust_score ?? 50;
  return (
    <div className="w-full flex flex-col no-scrollbar">
      
      {/* Top Profile Card */}
      <div className="flex flex-col items-center justify-center py-6 bg-white rounded-[24px] border border-slate-100 shadow-sm mb-6">
         
         <div className="relative mb-4">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden ring-4 ring-white shadow-soft bg-slate-200">
               <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-2 w-5 h-5 bg-success rounded-full ring-4 ring-white"></div>
         </div>

         <h2 className="text-xl font-bold text-slate-900 mb-1 truncate max-w-[90%] text-center">{fullName}</h2>
         <span className="text-sm font-medium text-slate-500 mb-2 truncate">{username}</span>
         
         <div className="flex items-center text-xs text-slate-500 mb-8 font-medium">
            <span>{city}</span>
            <span className="ml-1 text-[10px]">📍</span>
         </div>

         <div className="flex items-center w-full px-8 justify-between">
            <div className="flex flex-col items-center">
               <span className="text-xl font-bold text-slate-900">{trustScore.toFixed(1)}</span>
               <span className="text-[13px] text-slate-500 font-medium text-primary">Trust Score</span>
            </div>
            <div className="w-px h-10 bg-slate-200 mx-2"></div>
            <div className="flex flex-col items-center">
               <span className="text-xl font-bold text-slate-900">0</span>
               <span className="text-[13px] text-slate-500 font-medium">Reports</span>
            </div>
            <div className="w-px h-10 bg-slate-200 mx-2"></div>
            <div className="flex flex-col items-center">
               <span className="text-xl font-bold text-slate-900">0</span>
               <span className="text-[13px] text-slate-500 font-medium">Votes</span>
            </div>
         </div>
      </div>

      <div className="px-2 flex flex-col space-y-8 pb-8">
         
         <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
               <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">Biography</h3>
               <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-4 h-4" />
               </button>
            </div>
            <p className="text-[14px] leading-relaxed text-slate-600 mb-2">
               Active community member working to improve local infrastructure and public services.
            </p>
         </div>




      </div>

    </div>
  );
}
