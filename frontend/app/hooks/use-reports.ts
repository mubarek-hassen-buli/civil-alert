import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

/** Shape of a report from the API. */
export interface Report {
  id: string;
  author_id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  city: string;
  area: string;
  place_name?: string;
  status: string;
  media_urls: string[];
  thumbnail_url?: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  realVotes?: number;
  fakeVotes?: number;
}

/** Filters for listing reports. */
interface ReportFilters {
  city?: string;
  area?: string;
  category?: string;
  urgency?: string;
  status?: string;
  search?: string;
  sort?: string;
}

/** Fetches a list of reports with optional filters. */
export function useReports(filters: ReportFilters = {}) {
  return useQuery<Report[]>({
    queryKey: ['reports', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const { data } = await api.get(`/reports?${params.toString()}`);
      return data;
    },
  });
}

/** Fetches a single report by ID with vote counts. */
export function useReport(reportId: string) {
  return useQuery<Report>({
    queryKey: ['report', reportId],
    queryFn: async () => {
      const { data } = await api.get(`/reports/${reportId}`);
      return data;
    },
    enabled: !!reportId,
  });
}

/** Creates a new report with media file uploads. */
export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
