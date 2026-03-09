import React from "react";
import Image from "next/image";
import { MapPin, Share2, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface AlertCardProps {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  location: string;
  imageSrc: string;
  urgency: "critical" | "warning" | "info";
  confidence: number;
  realVotes: number;
  fakeVotes: number;
}

export function AlertCard({
  id,
  title,
  description,
  timeAgo,
  location,
  imageSrc,
  urgency,
  confidence,
  realVotes,
  fakeVotes,
}: AlertCardProps) {
  
  const getBadgeVariant = (u: string) => {
    switch (u) {
      case "critical": return "critical";
      case "warning": return "warning";
      case "info": return "info";
      default: return "default";
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-xl border border-border overflow-hidden transition-shadow">
      
      {/* Image Container with Badges over it */}
      <Link href={`/reports/${id}`} className="block relative w-full h-48 bg-slate-100 group">
        {/* Render a color block if no actual image src pattern is used for now to stand-in */}
        <div className="absolute inset-0 bg-slate-200">
           {/* If we had actual images, we'd use next/image here */}
           <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <Badge variant={getBadgeVariant(urgency)} className="uppercase text-[10px] tracking-wider">
            {urgency}
          </Badge>
          <Badge variant="neutral" className="bg-slate-900/80 text-white border-0 backdrop-blur-sm text-[10px]">
             {confidence}% Confidence
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Link href={`/reports/${id}`} className="hover:underline">
             <h3 className="font-bold text-slate-900 leading-tight line-clamp-1">{title}</h3>
          </Link>
          <span className="text-xs text-slate-500 whitespace-nowrap">{timeAgo}</span>
        </div>
        
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
          {description}
        </p>
        
        <div className="flex items-center text-xs text-slate-500 mb-4">
           <MapPin className="w-3.5 h-3.5 mr-1" />
           <span className="truncate">{location}</span>
        </div>

        {/* Footer actions */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1.5 text-success hover:bg-success/10 px-2 py-1 -ml-2 rounded transition-colors text-xs font-medium">
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Real ({realVotes})</span>
              </button>
              <button className="flex items-center space-x-1.5 text-critical hover:bg-critical/10 px-2 py-1 rounded transition-colors text-xs font-medium">
                 <XCircle className="w-4 h-4" />
                 <span>Fake ({fakeVotes})</span>
              </button>
           </div>
           
           <button className="text-slate-400 hover:text-primary transition-colors p-1">
              <Share2 className="w-4 h-4" />
           </button>
        </div>
      </div>

    </div>
  );
}
