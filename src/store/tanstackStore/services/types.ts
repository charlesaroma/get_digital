/* Domain types (the contract with the API) */
export interface Partner { id: string; name: string; description: string; url: string; position: number; active: boolean }
export interface BlogCategory { id: string; name: string; slug: string; position: number }
/** readMinutes is optional until the CMS provides it. */
export interface BlogPost { id: string; slug: string; title: string; categoryId: string; author: string; excerpt: string; image: string | null; status: "draft" | "published"; publishedAt: string; readMinutes?: number }
export interface PressRelease { id: string; slug: string; title: string; location: string; publishedAt: string; readMinutes: number; summary: string; url: string | null }
export interface Settings { brand: string; tagline: string; legalName: string; address: string; poBox?: string; email: string; socials: { id: string; label: string; url: string }[] }

export interface Poll { id: string; slug: string; title: string; description: string; opensAt: string; closesAt: string; status: "draft" | "open" | "closed"; votesPerPerson: number }
export interface Nominee { id: string; pollId: string; name: string; bio: string; image: string | null; position: number }
export interface Vote { id: string; pollId: string; nomineeId: string; voterKey: string; createdAt: string }
export interface EventItem { id: string; slug: string; title: string; venue: string; startsAt: string; description: string; image: string | null; status: "draft" | "published" | "ended" }
export interface TicketType { id: string; eventId: string; name: string; price: number; currency: string; capacity: number; sold: number; position: number; active: boolean }
export interface TicketOrder { id: string; eventId: string; ticketTypeId: string; name: string; email: string; quantity: number; paid: boolean; createdAt: string }

/* Forms the public site sends */
export interface ContactMessageInput { name: string; email: string; phone?: string; message: string }
export interface CourseRegistrationInput { name: string; email: string; phone: string; town: string; role: string; consent: boolean }
export interface SubmitResult { id: string; receivedAt: string }
