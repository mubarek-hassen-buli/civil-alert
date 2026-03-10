"use client";

import React from "react";
import { useReports } from "@/app/hooks/use-reports";
import { useUpdateReportStatus } from "@/app/hooks/use-admin";
import { SlothAlertCard } from "@/components/ui/sloth-alert-card";
import { Badge } from "@/components/ui/badge";

export default function AdminReportsPage() {
  const { data: reports, isLoading } = useReports();
  const updateStatus = useUpdateReportStatus();

  const handleStatusChange = (reportId: string, status: 'pending' | 'verified' | 'removed') => {
    if (confirm(`Are you sure you want to mark this report as ${status.toUpperCase()}?`)) {
      updateStatus.mutate({ reportId, status });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-8 bg-slate-50">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Manage Reports</h1>
        <p className="text-slate-500 font-medium">Review, verify, or remove community reports.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports?.map((report) => (
            <div key={report.id} className="flex flex-col bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <Badge variant="neutral" className={`px-3 py-1 font-bold rounded-full ${
                  report.status === 'verified' ? 'bg-success/10 text-success' :
                  report.status === 'removed' ? 'bg-critical/10 text-critical' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {report.status.toUpperCase()}
                </Badge>
                
                <div className="flex space-x-2">
                  {report.status !== 'verified' && (
                    <button 
                      onClick={() => handleStatusChange(report.id, 'verified')}
                      className="text-xs font-bold text-success hover:bg-success/10 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Verify
                    </button>
                  )}
                  {report.status !== 'removed' && (
                    <button 
                      onClick={() => handleStatusChange(report.id, 'removed')}
                      className="text-xs font-bold text-critical hover:bg-critical/10 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-2 pointer-events-none opacity-80 scale-[0.98] origin-top">
                <SlothAlertCard 
                  id={report.id}
                  author={{
                    avatar: report.profiles?.avatar_url || "https://i.pravatar.cc/150?u=default",
                    name: report.profiles?.full_name || report.profiles?.username || "Anonymous",
                    role: report.category.replace('_', ' ')
                  }}
                  content={report.description}
                  hashtags={[report.category, report.urgency]}
                  imageSrc={report.media_urls?.[0]}
                  realVotes={report.realVotes ?? 0}
                  fakeVotes={report.fakeVotes ?? 0}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
