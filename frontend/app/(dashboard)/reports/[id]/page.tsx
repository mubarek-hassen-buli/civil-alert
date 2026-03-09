"use client";

import React from "react";
import { useParams } from "next/navigation";
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ShieldAlert,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useReport } from "@/app/hooks/use-reports";

export default function AdvancedReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const { data: report, isLoading, isError } = useReport(reportId);

  // Format time ago helper
  const timeAgo = report?.created_at
    ? new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '2 hours ago';

  // Use API data or fallback values
  const title = report?.title || 'Major water main rupture at the intersection of 5th Avenue and Market Street';
  const description = report?.description || 'A significant water main break occurred earlier this morning, causing extensive flooding across the intersection of 5th Avenue and Market Street.';
  const heroImage = report?.media_urls?.[0] || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1200&h=800';
  const authorName = report?.profiles?.full_name || report?.profiles?.username || 'X_AE_A-13';
  const authorAvatar = report?.profiles?.avatar_url || 'https://i.pravatar.cc/150?u=a04258a2462d826712d';
  const urgency = report?.urgency || 'critical';
  const area = report?.area || 'Downtown District';
  const placeName = report?.place_name || '5th Avenue & Market St';
  const realVotes = report?.realVotes ?? 2400;
  const fakeVotes = report?.fakeVotes ?? 128;
  const confidenceScore = report?.confidence_score ?? 98;

  if (isLoading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen justify-between bg-white">
      
      {/* CENTER COLUMN: Main Detail Flow */}
      <div className="flex-1 max-w-[800px] flex flex-col mx-auto xl:mx-0 border-r border-slate-100 pb-20">
         
         <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col flex-1">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8">
               <Link href="/dashboard" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100">
                  <ChevronLeft className="w-5 h-5" />
               </Link>
               <div className="flex space-x-2">
                  <Button variant="outline" className="h-10 w-10 p-0 rounded-full border-slate-200 text-slate-500 hover:text-slate-900">
                     <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="h-10 w-10 p-0 rounded-full border-slate-200 text-slate-500 hover:text-slate-900">
                     <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="h-10 w-10 p-0 rounded-full border-slate-200 text-slate-500 hover:text-slate-900">
                     <MoreHorizontal className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            {/* Core Report Content */}
            <div className="flex flex-col space-y-6">
               
               {/* Badges & Meta */}
               <div className="flex items-center justify-between">
                   <div className="flex space-x-2">
                      <Badge variant="critical" className="px-3 py-1 bg-critical text-white rounded-full font-bold">{urgency.toUpperCase()}</Badge>
                      <Badge variant="neutral" className="px-3 py-1 bg-slate-100 text-slate-700 border-none rounded-full font-bold">#{reportId?.slice(0, 8)}</Badge>
                   </div>
                   <div className="flex items-center text-sm font-semibold text-slate-500">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {timeAgo}
                   </div>
                </div>

               {/* Title */}
               <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                   {title}
                </h1>

               {/* Author Block */}
               <div className="flex items-center space-x-3 py-2">
                   <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                      <img src={authorAvatar} alt="Author" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                         <span className="font-bold text-slate-900 text-[15px]">{authorName}</span>
                         <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-slate-500">{report?.category?.replace('_', ' ') || 'City Planner, CivicAlerts'}</span>
                   </div>
                </div>

               {/* Massive Image Header */}
               <div className="relative w-full h-[400px] md:h-[500px] rounded-[24px] overflow-hidden bg-slate-100 ring-1 ring-slate-900/5 mt-4">
                   <img src={heroImage} className="w-full h-full object-cover" alt="Incident Hero" />
                  
                  {/* Floating Location Chip */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <MapPin className="w-5 h-5" />
                        </div>
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">{placeName}</span>
                            <span className="text-xs font-semibold text-slate-500">{area}</span>
                         </div>
                     </div>
                     <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-9 px-4 text-xs">
                        View Map
                     </Button>
                  </div>
               </div>

               {/* Detailed Body Paragraphs */}
               <div className="pt-6 text-lg text-slate-700 leading-relaxed font-medium space-y-5">
                   <p>{description}</p>
                </div>

               {/* Interaction Action Bar */}
               <div className="flex items-center space-x-6 py-6 border-y border-slate-100 mt-8">
                  <div className="flex items-center space-x-2 text-slate-500 hover:text-primary cursor-pointer transition-colors group">
                     <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center">
                        <ThumbsUp className="w-5 h-5" />
                     </div>
                      <span className="font-bold">{realVotes >= 1000 ? (realVotes / 1000).toFixed(1) + 'k' : realVotes}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors group">
                     <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                     </div>
                      <span className="font-bold">{fakeVotes}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 hover:text-critical cursor-pointer transition-colors group">
                     <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-critical/10 flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5" />
                     </div>
                     <span className="font-bold text-sm">Flag Issue</span>
                  </div>
               </div>
               
               {/* Comments Section (Stub) */}
               <div className="pt-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Discussion</h3>
                  <div className="flex space-x-4 mb-8">
                     <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
                     <div className="flex-1">
                        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 min-h-[50px] flex items-center px-4 text-slate-400 font-medium">
                           Add a comment to the discussion...
                        </div>
                        <div className="flex justify-end mt-2">
                           <Button className="rounded-full h-9 px-5 bg-primary text-white font-semibold text-sm">Post Comment</Button>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>

      {/* RIGHT COLUMN: Floating Contextual Validations */}
      <div className="hidden xl:flex w-[350px] shrink-0 h-screen sticky top-0 flex-col overflow-y-auto no-scrollbar pt-6 px-6 pb-6 border-l border-slate-100/50 bg-slate-50/30">
         
         <div className="flex flex-col space-y-6">
            
            {/* Validation Meter */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col">
               <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">System Status</h2>
               </div>
               
               <div className="flex flex-col space-y-2 mb-6">
                  <div className="flex justify-between items-end">
                     <span className="text-[15px] font-bold text-slate-900">Confidence Meter</span>
                      <span className="text-[15px] font-bold text-primary">{Math.round(confidenceScore)}% Verified</span>
                   </div>
                   <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${confidenceScore}%` }}></div>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-2">Data corroborated by 12 independent sensors and 5 citizen reports.</p>
               </div>

               <Button className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-12 text-[15px]">
                  Submit Official Vote
               </Button>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col">
               <h2 className="text-[17px] font-bold text-slate-900 mb-8 tracking-tight">Timeline</h2>
               
               <div className="flex flex-col space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
                  
                  {/* Event 1 */}
                  <div className="relative flex items-start space-x-4">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-4 border-primary flex items-center justify-center text-primary z-10"></div>
                     <div className="flex flex-col pt-1">
                        <span className="text-[15px] font-bold text-slate-900">Sensor Anomaly</span>
                        <span className="text-xs text-slate-500 font-semibold mt-1">Today · 09:12 AM</span>
                     </div>
                  </div>

                  {/* Event 2 */}
                  <div className="relative flex items-start space-x-4 opacity-70">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-4 border-slate-200 z-10"></div>
                     <div className="flex flex-col pt-1">
                        <span className="text-[15px] font-bold text-slate-700">Citizen Report Logged</span>
                        <span className="text-xs text-slate-500 font-semibold mt-1">Today · 09:15 AM</span>
                     </div>
                  </div>

                  {/* Event 3 */}
                  <div className="relative flex items-start space-x-4 opacity-70">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-4 border-slate-200 z-10"></div>
                     <div className="flex flex-col pt-1">
                        <span className="text-[15px] font-bold text-slate-700">DPW Dispatched</span>
                        <span className="text-xs text-slate-500 font-semibold mt-1">Today · 09:30 AM</span>
                     </div>
                  </div>

               </div>
            </div>

         </div>
      </div>

    </div>
  );
}
