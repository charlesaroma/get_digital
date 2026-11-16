/* Voting hooks. Totals refresh every 20 seconds while a page is open, and right after a vote. */
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listNominees } from "../../services/voting/nomineesApi";
import { listPolls } from "../../services/voting/pollsApi";
import { buyVotes, castVote, requestVoteCode } from "../../services/voting/votesApi";
import type { Nominee, Poll } from "../../services/types";
import { siteRoot } from "../keys";

export const pollsQuery = () => queryOptions({ queryKey: [...siteRoot, "polls"], queryFn: ({ signal }) => listPolls({ signal }) });
export const nomineesQuery = () =>
  queryOptions({ queryKey: [...siteRoot, "nominees"], queryFn: ({ signal }) => listNominees({ signal }), refetchInterval: 20_000 });

export const usePolls = () => useQuery(pollsQuery());
export const useNominees = () => useQuery(nomineesQuery());
export const usePoll = (slug: string | undefined) =>
  useQuery({ ...pollsQuery(), select: (polls: Poll[]) => polls.find((p) => p.slug === slug) ?? null });
export const usePollNominees = (pollId: string | undefined) =>
  useQuery({ ...nomineesQuery(), enabled: Boolean(pollId), select: (all: Nominee[]) => all.filter((n) => n.pollId === pollId) });

export const useRequestVoteCode = () => useMutation({ mutationFn: requestVoteCode });

export function useCastVote() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: castVote, onSuccess: () => qc.invalidateQueries({ queryKey: nomineesQuery().queryKey }) });
}

export function useBuyVotes() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: buyVotes, onSuccess: () => qc.invalidateQueries({ queryKey: nomineesQuery().queryKey }) });
}
