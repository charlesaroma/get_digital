/* Domain types (the contract with the API) */

/** Rich text as plain blocks, so the dashboard editor and the site agree without HTML. */
export type BodyBlock =
  | { type: "p" | "h2" | "h3" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

export interface Partner { id: string; name: string; description: string; url: string; logo?: string | null; position: number; active: boolean }
export interface BlogCategory { id: string; name: string; slug: string; position: number }
export interface BlogPost {
  id: string; slug: string; title: string; categoryId: string; author: string; excerpt: string;
  image: string | null; imageAlt?: string; tags?: string[];
  status: "draft" | "published"; publishedAt: string; updatedAt?: string;
  body?: BodyBlock[];
}
export interface MediaContact { name: string; role: string; email: string }
export interface PressRelease {
  id: string; slug: string; kind?: string; title: string; location: string; publishedAt: string; readMinutes: number;
  summary: string; image: string | null; imageAlt: string | null; url: string | null;
  contacts?: MediaContact[]; body?: BodyBlock[];
}
export interface Settings { brand: string; tagline: string; legalName: string; address: string; poBox?: string; email: string; socials: { id: string; label: string; url: string }[] }

/* Legal pages */
export interface LegalSection { id: string; heading: string; body: BodyBlock[] }
export interface LegalDoc { slug: string; title: string; summary: string; updatedAt: string; sections: LegalSection[] }

/* Voting */
export interface PollCategory { id: string; name: string; description: string }
export interface VipPackage { id: string; name: string; price: number; instantVotes: number; dailyVotes: number; perks: string[]; label?: string; ticketTypeId?: string }
export interface Poll {
  id: string; slug: string; title: string; summary: string; description: string;
  image: string | null; imageAlt?: string;
  /** draft: admin only. scheduled: shown as coming soon. open: voting. closed: results once published. */
  status: "draft" | "scheduled" | "open" | "closed";
  featured: boolean;
  opensAt: string; closesAt: string; resultsAt: string; resultsPublished: boolean;
  showLiveCounts: boolean;
  freeVotes: { perCategory: number; period: "day" | "campaign" };
  /** Boost: buy extra votes at a set price per vote. */
  boost: { enabled: boolean; pricePerVote?: number; currency?: string; min?: number; max?: number; quick?: number[] };
  /** VIP voter: one payment gives instant votes, extra votes every day until voting closes, and an event ticket. */
  vip: { enabled: boolean; currency?: string; packages?: VipPackage[] };
  categories: PollCategory[];
  eventSlug?: string;
}
export interface Nominee {
  id: string; pollId: string; categoryId: string; slug: string; name: string; headline: string; town: string; bio: string;
  image: string | null; votes: number; position: number; winner: boolean;
}
export interface Vote { id: string; pollId: string; categoryId: string; nomineeId: string; voterKey: string; channel: "phone" | "email"; kind: "free" | "boost" | "vip"; createdAt: string }

export interface VoteCodeInput { pollId: string; contact: string }
export interface VoteCodeResult { sentTo: string; channel: "phone" | "email"; expiresInSeconds: number; demoCode?: string }
export interface CastVoteInput { pollId: string; categoryId: string; nomineeId: string; contact: string; code: string }
export interface CastVoteResult { voteId: string; nomineeId: string; votes: number; nextFreeVoteAt: string | null }
/** A paid vote order. The browser never decides if it is paid: the payment provider tells the server. */
export interface PaidVoteInput { pollId: string; nomineeId: string; kind: "boost" | "vip"; votes?: number; packageId?: string; name: string; email: string; method: PaymentMethod; phone?: string }
export interface PaidVoteResult { reference: string; nomineeId: string; kind: "boost" | "vip"; amount: number; added: number; votes: number; dailyVotes?: number; ticketCode?: string }

/* Events and tickets */
export type PaymentMethod = "mtn" | "airtel" | "card" | "free";
export interface AgendaItem { time: string; title: string }
export interface Speaker { name: string; role: string }
export interface EventItem {
  id: string; slug: string; title: string; summary: string; category: string; featured: boolean;
  status: "draft" | "published" | "ended";
  startsAt: string; endsAt: string; venue: string; address: string; city: string;
  image: string | null; imageAlt?: string; organiser: string; ageNote?: string;
  description: BodyBlock[]; agenda: AgendaItem[]; speakers: Speaker[]; voteSlug?: string;
}
export interface TicketType {
  id: string; eventId: string; name: string; description: string; perks: string[];
  price: number; currency: string; capacity: number; sold: number; maxPerOrder: number; position: number; active: boolean;
}
export interface IssuedTicket { code: string; ticketTypeId: string; checkedInAt: string | null }
export interface TicketOrder {
  id: string; reference: string; eventId: string; items: { ticketTypeId: string; quantity: number }[];
  name: string; email: string; phone: string; total: number; currency: string; paymentMethod: PaymentMethod;
  status: "pending" | "paid" | "confirmed" | "refunded" | "cancelled"; createdAt: string; tickets: IssuedTicket[];
}
export interface TicketOrderInput {
  eventId: string; items: { ticketTypeId: string; quantity: number }[];
  name: string; email: string; phone: string; paymentMethod: PaymentMethod; consent: boolean;
}

/* Forms the public site sends */
export interface ContactMessageInput { name: string; email: string; phone?: string; message: string }
export interface CourseRegistrationInput { name: string; email: string; phone: string; town: string; role: string; consent: boolean }
export interface SubmitResult { id: string; receivedAt: string }

/* Admin */
export interface StaffSession { id: string; name: string; email: string; role: "owner" | "editor"; permissions: string[]; token: string }
