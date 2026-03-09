import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface Subscription {
  id: string;
  user_id: string;
  city: string;
  area: string | null;
  category: string | null;
  created_at: string;
}

/** Fetches all active subscriptions for the current user. */
export function useSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data } = await api.get('/subscriptions');
      return data;
    },
  });
}

/** Creates a new alert subscription. */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { city: string; area?: string; category?: string }) => {
      const { data } = await api.post('/subscriptions', payload);
      return data as Subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

/** Removes an alert subscription. */
export function useRemoveSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      await api.delete(`/subscriptions/${subscriptionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}
