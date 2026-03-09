"use client";

import React, { useState, useRef } from "react";
import { 
  MapPin, 
  LayoutGrid, 
  AlertTriangle, 
  UploadCloud, 
  Send,
  X,
  Camera,
  Map,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/app/lib/utils";
import { useReportStore } from "@/app/stores/report-store";
import { useCreateReport } from "@/app/hooks/use-reports";
import { useRouter } from "next/navigation";

// Category mapping: UI id → API category value
const CATEGORY_MAP: Record<string, string> = {
  infrastructure: 'roads',
  safety: 'public_services',
  utilities: 'public_services',
  environmental: 'business',
};

// Urgency mapping: UI value → API urgency value
const URGENCY_MAP: Record<string, string> = {
  low: 'info',
  medium: 'warning',
  critical: 'critical',
};

const categories = [
   { id: "infrastructure", name: "Infrastructure", icon: LayoutGrid, color: "bg-blue-500" },
   { id: "safety", name: "Public Safety", icon: AlertTriangle, color: "bg-red-500" },
   { id: "utilities", name: "Utilities", icon: UploadCloud, color: "bg-orange-500" },
   { id: "environmental", name: "Environment", icon: Map, color: "bg-green-500" },
];

export default function AdvancedCreateReportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const store = useReportStore();
  const createReport = useCreateReport();

  const [urgency, setUrgency] = useState<"low" | "medium" | "critical">("low");
  const [category, setCategory] = useState("infrastructure");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => store.addFile(file));
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // Build FormData for submission
    const formData = new FormData();
    formData.append('title', store.title);
    formData.append('description', store.description);
    formData.append('category', CATEGORY_MAP[category] || 'roads');
    formData.append('urgency', URGENCY_MAP[urgency] || 'info');
    formData.append('city', store.city || 'Default City');
    formData.append('area', store.area || 'downtown');
    if (store.placeName) formData.append('place_name', store.placeName);
    store.files.forEach(file => formData.append('media', file));

    try {
      await createReport.mutateAsync(formData);
      store.reset();
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create report';
      setError(message);
    }
  };

  return (
    <div className="flex w-full min-h-screen justify-between">
      
      {/* FULL WIDTH CENTER COLUMN for Create Flow */}
      <div className="flex-1 max-w-[800px] flex flex-col mx-auto xl:mx-0 pb-20">
         
         <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col flex-1">
            
            {/* Page Header */}
            <div className="flex flex-col space-y-2 mb-10">
               <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 mb-2">
                  <span>Reports</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-primary font-semibold">New Incident</span>
               </div>
               <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Report an Incident</h1>
               <p className="text-lg text-slate-500">Help the community by providing accurate details and media.</p>
            </div>

            {/* Main Form Wrapper */}
            <div className="flex flex-col space-y-10">
               
               {/* STEP 1: What Happened? */}
               <section>
                  <div className="flex items-center space-x-3 mb-5">
                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">1</span>
                     <h2 className="text-xl font-bold text-slate-900">What happened?</h2>
                  </div>
                  
                  <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col space-y-6">
                     
                     {/* Title */}
                     <div className="flex flex-col space-y-2">
                        <label className="text-sm font-bold text-slate-700">Incident Title</label>
                        <Input 
                           placeholder="e.g. Major water main break on 5th Ave" 
                           className="h-14 bg-slate-50 border-slate-200 text-lg px-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                           value={store.title}
                           onChange={(e) => store.setField('title', e.target.value)}
                        />
                     </div>

                     {/* Category Blocks */}
                     <div className="flex flex-col space-y-3">
                        <label className="text-sm font-bold text-slate-700">Category</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           {categories.map(cat => (
                              <div 
                                 key={cat.id}
                                 onClick={() => setCategory(cat.id)}
                                 className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all",
                                    category === cat.id ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200 bg-white"
                                 )}
                              >
                                 <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white", cat.color)}>
                                    <cat.icon className="w-5 h-5" />
                                 </div>
                                 <span className={cn("text-sm font-bold", category === cat.id ? "text-primary" : "text-slate-600")}>{cat.name}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                  </div>
               </section>

               {/* STEP 2: Location & Details */}
               <section>
                  <div className="flex items-center space-x-3 mb-5">
                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">2</span>
                     <h2 className="text-xl font-bold text-slate-900">Location & Details</h2>
                  </div>
                  
                  <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col space-y-6">
                     
                     {/* Interactive Map Picker (Mock) */}
                     <div className="flex flex-col space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                           <span>Pinpoint Location</span>
                           <Button variant="ghost" className="h-8 text-primary hover:bg-primary/5 px-2 font-semibold">Auto-locate me</Button>
                        </label>
                        <div className="w-full h-[280px] rounded-2xl bg-slate-200 relative overflow-hidden ring-1 ring-slate-900/5">
                           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200&h=600" className="w-full h-full object-cover opacity-90" alt="Map mockup" />
                           
                           {/* Search inside map */}
                           <div className="absolute top-4 left-4 right-4">
                              <div className="bg-white rounded-xl flex items-center px-4 py-3 border border-slate-100">
                                 <MapPin className="w-5 h-5 text-primary mr-3" />
                                 <input type="text" placeholder="Search a street or landmark..." className="flex-1 outline-none text-[15px] font-medium placeholder:text-slate-400" />
                              </div>
                           </div>

                           {/* Map Pin */}
                           <div className="absolute top-1/2 left-1/2 -mt-4 -ml-4 bg-primary text-white rounded-full p-2 flex items-center justify-center border-4 border-white">
                              <MapPin className="w-5 h-5" />
                           </div>
                        </div>
                     </div>

                     {/* Description */}
                     <div className="flex flex-col space-y-2">
                        <label className="text-sm font-bold text-slate-700">Detailed Description</label>
                        <textarea 
                           rows={4}
                           placeholder="Describe the incident, potential risks, and any other helpful context..." 
                           className="w-full bg-slate-50 border border-slate-200 text-[15px] p-4 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                           value={store.description}
                           onChange={(e) => store.setField('description', e.target.value)}
                        />
                     </div>

                  </div>
               </section>

               {/* STEP 3: Urgency & Evidence */}
               <section>
                  <div className="flex items-center space-x-3 mb-5">
                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">3</span>
                     <h2 className="text-xl font-bold text-slate-900">Urgency & Evidence</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     {/* Urgency */}
                     <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col space-y-4">
                        <label className="text-sm font-bold text-slate-700">Severity Level</label>
                        <div className="flex flex-col space-y-3">
                           <button 
                              onClick={() => setUrgency("low")}
                              className={cn(
                                 "flex items-center space-x-4 p-4 rounded-xl border-2 transition-all w-full text-left",
                                 urgency === "low" ? "border-success bg-success/5" : "border-slate-100 hover:border-slate-200"
                              )}
                           >
                              <div className="w-4 h-4 rounded-full bg-success ring-4 ring-success/20"></div>
                              <div className="flex flex-col">
                                 <span className="font-bold text-slate-800">Low (Routine)</span>
                                 <span className="text-xs text-slate-500 font-medium">Non-urgent community updates.</span>
                              </div>
                           </button>
                           
                           <button 
                              onClick={() => setUrgency("medium")}
                              className={cn(
                                 "flex items-center space-x-4 p-4 rounded-xl border-2 transition-all w-full text-left",
                                 urgency === "medium" ? "border-warning bg-warning/5" : "border-slate-100 hover:border-slate-200"
                              )}
                           >
                              <div className="w-4 h-4 rounded-full bg-warning ring-4 ring-warning/20"></div>
                              <div className="flex flex-col">
                                 <span className="font-bold text-slate-800">Medium (Warning)</span>
                                 <span className="text-xs text-slate-500 font-medium">Requires attention soon.</span>
                              </div>
                           </button>

                           <button 
                              onClick={() => setUrgency("critical")}
                              className={cn(
                                 "flex items-center space-x-4 p-4 rounded-xl border-2 transition-all w-full text-left",
                                 urgency === "critical" ? "border-critical bg-critical/5" : "border-slate-100 hover:border-slate-200"
                              )}
                           >
                              <div className="w-4 h-4 rounded-full bg-critical ring-4 ring-critical/20"></div>
                              <div className="flex flex-col">
                                 <span className="font-bold text-slate-800">Critical (Emergency)</span>
                                 <span className="text-xs text-slate-500 font-medium">Immediate hazard to public.</span>
                              </div>
                           </button>
                        </div>
                     </div>

                     {/* Media Upload */}
                     <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col">
                        <label className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                           <span>Media Assets</span>
                           <span className="text-xs text-slate-400 font-medium">Required (at least 1)</span>
                        </label>
                        
                        <input
                           ref={fileInputRef}
                           type="file"
                           accept="image/jpeg,image/png,image/webp,video/mp4"
                           multiple
                           onChange={handleFileChange}
                           className="hidden"
                        />

                        <div 
                           className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group p-6 text-center"
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <div className="w-14 h-14 rounded-full bg-white border border-slate-100 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                              <Camera className="w-6 h-6" />
                           </div>
                           <span className="text-[15px] font-bold text-slate-700 mb-1 flex items-center">
                              <UploadCloud className="w-4 h-4 mr-2" /> Upload Photos
                           </span>
                           <span className="text-sm text-slate-500 font-medium">Click to browse. Max 10MB per file.</span>
                        </div>

                        {/* Selected Files Preview */}
                        {store.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {store.files.map((file, index) => (
                              <div key={index} className="flex items-center bg-slate-100 rounded-lg px-3 py-2 text-sm font-medium text-slate-700">
                                <span className="truncate max-w-[120px]">{file.name}</span>
                                <button onClick={() => store.removeFile(index)} className="ml-2 text-slate-400 hover:text-slate-700">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                     </div>

                  </div>
               </section>

               {/* Error Message */}
               {error && (
                 <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium">
                   {error}
                 </div>
               )}

               {/* Action Footer */}
               <div className="flex items-center justify-end pt-6 space-x-4 border-t border-slate-100">
                  <Button variant="ghost" className="text-slate-500 hover:text-slate-900 rounded-full px-6 font-semibold h-12">Save Draft</Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white rounded-full flex items-center space-x-2 h-12 px-8"
                    onClick={handleSubmit}
                    disabled={createReport.isPending}
                  >
                     <span className="font-bold text-[15px]">{createReport.isPending ? 'Submitting...' : 'Submit Report'}</span>
                     <Send className="w-4 h-4 ml-1" />
                  </Button>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
}
