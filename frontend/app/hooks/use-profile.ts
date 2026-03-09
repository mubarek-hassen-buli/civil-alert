import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string;
  avatar_url: string;
  role: 'user' | 'admin' | 'super_admin';
  trust_score: number;
  city: string | null;
  area: string | null;
  is_banned: boolean;
  created_at: string;
}

/** Fetches the currently authenticated user's profile. */
export function useMyProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/users/me');
      return data;
    },
  });
}

/** Updates the currently authenticated user's profile. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const { data } = await api.patch('/users/me', updates);
      return data as UserProfile;
    },
    onSuccess: (updatedProfile) => {
      // Update the cache with the new profile data
      queryClient.setQueryData(['profile', 'me'], updatedProfile);
      
      // Also invalidate reports to catch any avatar/name changes on posts
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
