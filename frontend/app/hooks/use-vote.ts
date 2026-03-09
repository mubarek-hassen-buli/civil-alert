import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

interface VoteCounts {
  realVotes: number;
  fakeVotes: number;
  userVote: 'real' | 'fake' | null;
}

/** Fetches vote counts for a specific report. */
export function useVoteCounts(reportId: string) {
  return useQuery<VoteCounts>({
    queryKey: ['votes', reportId],
    queryFn: async () => {
      const { data } = await api.get(`/reports/${reportId}/vote`);
      return data;
    },
    enabled: !!reportId,
  });
}

/** Casts or toggles a vote on a report with optimistic updates. */
export function useCastVote(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (voteType: 'real' | 'fake') => {
      const { data } = await api.post(`/reports/${reportId}/vote`, {
        vote_type: voteType,
      });
      return data as VoteCounts;
    },

    // Optimistic update: instantly reflect the vote in the UI
    onMutate: async (voteType) => {
      await queryClient.cancelQueries({ queryKey: ['votes', reportId] });

      const previousVotes = queryClient.getQueryData<VoteCounts>(['votes', reportId]);

      queryClient.setQueryData<VoteCounts>(['votes', reportId], (old) => {
        if (!old) return { realVotes: voteType === 'real' ? 1 : 0, fakeVotes: voteType === 'fake' ? 1 : 0, userVote: voteType };

        const wasReal = old.userVote === 'real';
        const wasFake = old.userVote === 'fake';
        const isSameVote = old.userVote === voteType;

        return {
          realVotes: old.realVotes
            + (voteType === 'real' && !isSameVote ? 1 : 0)
            - (isSameVote && wasReal ? 1 : 0)
            - (!isSameVote && wasReal ? 1 : 0),
          fakeVotes: old.fakeVotes
            + (voteType === 'fake' && !isSameVote ? 1 : 0)
            - (isSameVote && wasFake ? 1 : 0)
            - (!isSameVote && wasFake ? 1 : 0),
          userVote: isSameVote ? null : voteType,
        };
      });

      return { previousVotes };
    },

    // Rollback on error
    onError: (_err, _voteType, context) => {
      if (context?.previousVotes) {
        queryClient.setQueryData(['votes', reportId], context.previousVotes);
      }
    },

    // Sync with server response
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', reportId] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
