import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface ModerationLog {
  id: string;
  admin_id: string;
  action: string;
  target_user_id: string | null;
  target_report_id: string | null;
  reason: string | null;
  created_at: string;
  admin: {
    full_name: string;
    username: string;
  };
  target_user: {
    full_name: string;
    username: string;
  } | null;
}

/** Fetches audit logs for admins. */
export function useModerationLogs(page = 1, limit = 50) {
  return useQuery<{ data: ModerationLog[]; total: number }>({
    queryKey: ['admin', 'logs', page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/admin/moderation/logs?page=${page}&limit=${limit}`);
      return data;
    },
  });
}

/** Updates a user's ban status (admin only). */
export function useToggleUserBan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isBanned, reason }: { userId: string; isBanned: boolean; reason?: string }) => {
      const { data } = await api.patch(`/admin/moderation/users/${userId}/ban`, { is_banned: isBanned, reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

/** Updates a report's status (admin only). */
export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status, reason }: { reportId: string; status: 'pending' | 'verified' | 'removed'; reason?: string }) => {
      const { data } = await api.patch(`/reports/${reportId}/status`, { status, reason });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}
