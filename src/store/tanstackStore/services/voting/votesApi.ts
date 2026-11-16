/* votesApi: one time code, cast a free vote, buy support votes.
   The real rules (one voter per phone or email, vote limits, open and close times, payment
   confirmation) live on the server. Dummy mode imitates them so the flow can be tried end to end. */
import polls from "@/data/polls.json";
import { ApiError, http, mockApi, useMockApi } from "../api";
import type {
  CastVoteInput, CastVoteResult, PaidVoteInput, PaidVoteResult, Poll, VoteCodeInput, VoteCodeResult,
} from "../types";
import { dummyNominees } from "./nomineesApi";

const DEMO_CODE = "123456";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UG_PHONE = /^(\+?256|0)7\d{8}$/;
const used = new Map<string, number>();

const normalise = (contact: string) => contact.trim().toLowerCase().replace(/[\s()-]/g, "");
const channelOf = (contact: string) => (EMAIL.test(contact.trim()) ? "email" : "phone") as "email" | "phone";
const pollOf = (id: string) => (polls as Poll[]).find((p) => p.id === id);
const periodKey = (poll: Poll) => (poll.freeVotes.period === "day" ? new Date().toISOString().slice(0, 10) : "all");
const tomorrow = () => {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.toISOString();
};

function assertOpen(poll: Poll | undefined): asserts poll is Poll {
  const now = Date.now();
  if (!poll || poll.status !== "open" || now < Date.parse(poll.opensAt) || now > Date.parse(poll.closesAt)) {
    throw new ApiError(409, "poll_closed", "Voting is not open for this campaign.");
  }
}

export const requestVoteCode = (input: VoteCodeInput) =>
  useMockApi
    ? mockApi<VoteCodeResult>(() => {
        assertOpen(pollOf(input.pollId));
        const c = normalise(input.contact);
        if (!EMAIL.test(c) && !UG_PHONE.test(c)) throw new ApiError(422, "bad_contact", "Enter a Ugandan mobile number or an email address.");
        return { sentTo: input.contact.trim(), channel: channelOf(c), expiresInSeconds: 600, demoCode: DEMO_CODE };
      }, 700)
    : http.post<VoteCodeResult>("votes/code", input);

export const castVote = (input: CastVoteInput) =>
  useMockApi
    ? mockApi<CastVoteResult>(() => {
        const poll = pollOf(input.pollId);
        assertOpen(poll);
        if (input.code.trim() !== DEMO_CODE) throw new ApiError(422, "bad_code", "That code is not right. Check the message and try again.");
        const key = `${normalise(input.contact)}|${poll.id}|${input.categoryId}|${periodKey(poll)}`;
        const count = used.get(key) ?? 0;
        if (count >= poll.freeVotes.perCategory) {
          throw new ApiError(429, "limit_reached", poll.freeVotes.period === "day"
            ? "You have used today's free vote in this category. Come back tomorrow."
            : "You have already voted in this category.");
        }
        const nominee = dummyNominees.find((n) => n.id === input.nomineeId);
        if (!nominee) throw new ApiError(404, "not_found", "Nominee not found.");
        used.set(key, count + 1);
        nominee.votes += 1;
        return { voteId: `v_${Date.now()}`, nomineeId: nominee.id, votes: nominee.votes, nextFreeVoteAt: poll.freeVotes.period === "day" ? tomorrow() : null };
      }, 800)
    : http.post<CastVoteResult>("votes", input);

/** Boost votes or a VIP package. Real mode: the server creates the order and returns the payment
    provider's page; votes are added when the provider confirms. Dummy mode adds them after a pause. */
export const buyVotes = (input: PaidVoteInput) =>
  useMockApi
    ? mockApi<PaidVoteResult>(() => {
        const poll = pollOf(input.pollId);
        assertOpen(poll);
        const nominee = dummyNominees.find((n) => n.id === input.nomineeId);
        if (!nominee) throw new ApiError(404, "not_found", "Nominee not found.");
        const reference = `GDV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        if (input.kind === "vip") {
          const pack = poll.vip.packages?.find((p) => p.id === input.packageId);
          if (!poll.vip.enabled || !pack) throw new ApiError(422, "bad_package", "This VIP package is not available.");
          nominee.votes += pack.instantVotes;
          return { reference, nomineeId: nominee.id, kind: "vip", amount: pack.price, added: pack.instantVotes, votes: nominee.votes, dailyVotes: pack.dailyVotes, ticketCode: `${reference}-T1` };
        }
        const n = Math.trunc(input.votes ?? 0);
        const { enabled, pricePerVote = 0, min = 1, max = 10000 } = poll.boost;
        if (!enabled || n < min || n > max) throw new ApiError(422, "bad_quantity", `Choose between ${min} and ${max} votes.`);
        nominee.votes += n;
        return { reference, nomineeId: nominee.id, kind: "boost", amount: n * pricePerVote, added: n, votes: nominee.votes };
      }, 1800)
    : http.post<PaidVoteResult>("votes/orders", input);
