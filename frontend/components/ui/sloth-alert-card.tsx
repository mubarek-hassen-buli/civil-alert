import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreVertical, ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlothAlertCardProps {
  id: string;
  author: {
    avatar: string;
    name: string;
    role: string;
  };
  content: string;
  hashtags: string[];
  imageSrc?: string;
  realVotes: number;
  fakeVotes: number;
}

export function SlothAlertCard({
  id,
  author,
  content,
  hashtags,
  imageSrc,
  realVotes,
  fakeVotes
}: SlothAlertCardProps) {
  return (
    <div className="bg-white rounded-[24px] p-6 border border-slate-100 flex flex-col mb-6">
      
      {/* Header: User Info */}
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
               <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
               <span className="text-[15px] font-bold text-slate-900 tracking-tight">{author.name}</span>
               <span className="text-[13px] text-slate-500">{author.role}</span>
            </div>
         </div>
         <button className="text-slate-400 hover:text-slate-600 p-1">
            <MoreVertical className="w-5 h-5" />
         </button>
      </div>

      {/* Content text */}
      <Link href={`/reports/${id}`} className="flex flex-col mb-4 hover:opacity-80 transition-opacity">
         <p className="text-[15px] text-slate-700 leading-relaxed mb-1">
            {content}
         </p>
         <div className="flex flex-wrap gap-1.5 mt-1">
            {hashtags.map(tag => (
               <span key={tag} className="text-primary hover:underline cursor-pointer text-[14px] font-medium">#{tag}</span>
            ))}
         </div>
      </Link>

      {/* Large Image Media */}
      {imageSrc && (
         <Link href={`/reports/${id}`} className="w-full h-[320px] rounded-[20px] overflow-hidden mb-5 bg-slate-100 relative ring-1 ring-slate-900/5 block hover:opacity-95 transition-opacity">
            <img src={imageSrc} alt="Post media" className="w-full h-full object-cover" />
         </Link>
      )}

      {/* Footer Metrics & Actions */}
      <div className="flex items-center justify-between pt-1">
         <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-slate-500 hover:text-success transition-colors group">
               <div className="p-1.5 rounded-full group-hover:bg-success/10 transition-colors">
                 <ThumbsUp className="w-[18px] h-[18px]" />
               </div>
               <span className="text-[14px] font-bold text-slate-700 group-hover:text-success">{realVotes} Real</span>
            </button>
            <button className="flex items-center space-x-2 text-slate-500 hover:text-critical transition-colors group">
               <div className="p-1.5 rounded-full group-hover:bg-critical/10 transition-colors">
                 <ThumbsDown className="w-[18px] h-[18px]" />
               </div>
               <span className="text-[14px] font-bold text-slate-700 group-hover:text-critical">{fakeVotes} Fake</span>
            </button>
         </div>
         
         <button className="text-slate-400 hover:text-primary transition-colors p-1.5">
            <Bookmark className="w-[20px] h-[20px]" />
         </button>
      </div>

    </div>
  );
}
