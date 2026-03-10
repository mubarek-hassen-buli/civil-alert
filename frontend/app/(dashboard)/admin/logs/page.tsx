"use client";

import React, { useEffect, useState } from "react";
import { useModerationLogs } from "@/app/hooks/use-admin";
import api from "@/app/lib/api";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const { data: logs, isLoading: logsLoading } = useModerationLogs();
  
  // Quick manual fetch for users to avoid creating full query hooks just for admin page right now
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Technically we need an admin users endpoint, but for this hackathon we'll just show the concept
        // In a real app we'd have a specific GET /admin/users endpoint
        console.log("Fetching users concept...");
        setLoadingUsers(false);
      } catch (err) {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen p-8 bg-slate-50">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Audit Logs</h1>
        <p className="text-slate-500 font-medium">Review system moderation actions performed by administrators.</p>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
        {logsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Admin</th>
                <th className="px-6 py-4 font-bold">Action</th>
                <th className="px-6 py-4 font-bold">Target</th>
                <th className="px-6 py-4 font-bold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs?.data?.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {log.admin?.full_name || log.admin?.username || 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="neutral" className="bg-slate-100 text-slate-700 border-none font-bold">
                      {log.action.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {log.target_user?.full_name || log.target_report_id || '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {log.reason || '-'}
                  </td>
                </tr>
              ))}
              
              {(!logs?.data || logs.data.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No audit logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
