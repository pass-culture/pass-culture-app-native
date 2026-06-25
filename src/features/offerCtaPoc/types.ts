// POC — Offer CTA architecture validation.
// Types are intentionally LOCAL and minimal: the pure core must not depend on
// the full `api/gen` graph. This is what makes `resolveOfferCta` testable with
// zero mocks and proves the "pure domain" layer of the RFC.

export type CtaType =
  | 'AUTHENTICATION'
  | 'BOOK_OFFER'
  | 'INSUFFICIENT_CREDIT'
  | 'SOLD_OUT_OFFER'
  | 'SEE_BOOKING'

// Minimal offer/user shapes — only the fields the slice needs.
export type Offer = {
  id: number
  name: string
  priceInCents: number
  isSoldOut: boolean
}

export type UserContext = {
  isLoggedIn: boolean
  hasEnoughCredit: boolean
  // id of an existing booking for this offer, if any
  alreadyBookedOfferId?: number
}

export type ResolveOfferCtaInput = {
  offer: Offer
  user: UserContext
}

// The decision is data, not behaviour: navigation/analytics/i18n live in the
// presentation layer, never here.
export type CtaDecision = {
  type: CtaType
  wording: string
  isDisabled: boolean
}

// Server-shaped data consumed by the orchestration layer (React Query boundary).
export type OfferCtaData = {
  offer: Offer
  user: UserContext
}
