import { OfferCtaApiResponse } from 'features/offerCtaPoc/adapters/offerCtaResponseToData'

// Deterministic scenarios driving both the demo screen and the data hook.
// These are RAW API DTOs (`OfferCtaApiResponse`): the query returns them and
// `select` adapts them to the domain shape (`OfferCtaData`). This mirrors a
// real backend response so the React Query boundary is realistic.

export type Scenario =
  | 'BOOKABLE'
  | 'INSUFFICIENT_CREDIT'
  | 'SOLD_OUT'
  | 'ALREADY_BOOKED'
  | 'NOT_LOGGED_IN'

const baseOffer = { id: 1, title: 'Concert de POC', price: 1500, soldOut: false }

export const SCENARIOS: Record<Scenario, OfferCtaApiResponse> = {
  BOOKABLE: {
    offer: baseOffer,
    viewer: { authenticated: true, hasEnoughCredit: true, existingBookingOfferId: null },
  },
  INSUFFICIENT_CREDIT: {
    offer: baseOffer,
    viewer: { authenticated: true, hasEnoughCredit: false, existingBookingOfferId: null },
  },
  SOLD_OUT: {
    offer: { ...baseOffer, soldOut: true },
    viewer: { authenticated: true, hasEnoughCredit: true, existingBookingOfferId: null },
  },
  ALREADY_BOOKED: {
    offer: baseOffer,
    viewer: { authenticated: true, hasEnoughCredit: true, existingBookingOfferId: 42 },
  },
  NOT_LOGGED_IN: {
    offer: baseOffer,
    viewer: { authenticated: false, hasEnoughCredit: false, existingBookingOfferId: null },
  },
}

export const SCENARIO_LABELS: Record<Scenario, string> = {
  BOOKABLE: 'Réservable',
  INSUFFICIENT_CREDIT: 'Crédit insuffisant',
  SOLD_OUT: 'Épuisée',
  ALREADY_BOOKED: 'Déjà réservée',
  NOT_LOGGED_IN: 'Non connecté',
}
