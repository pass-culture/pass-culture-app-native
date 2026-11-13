import { Offer } from 'shared/offer/types'

export type ConversationMessage = {
  role: 'user' | 'assistant'
  parts: { type: 'text'; text: string }[]
}

export type ParsedSearch = {
  queries: string[]
  nbHits: number
}

export type ParsedCompletion = {
  text: string
  searches: ParsedSearch[]
  offers: Offer[]
  citedOffers: Offer[]
  unknownCitedOfferIds: string[]
}

export type Exchange = {
  id: string
  question: string
  durationInMs?: number
  completion?: ParsedCompletion
  raw?: unknown
  error?: string
}
