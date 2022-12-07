import { Hit } from 'instantsearch.js'

import { SearchGroupNameEnumv2, SubcategoryIdEnum } from 'api/gen'

interface Offer {
  dates?: number[]
  isDigital?: boolean
  isDuo?: boolean
  isEducational?: boolean
  name?: string
  prices?: number[]
  subcategoryId?: SubcategoryIdEnum
  thumbUrl?: string
  searchGroupName?: SearchGroupNameEnumv2
}

export interface Geoloc {
  lat?: number | null
  lng?: number | null
}

export interface AlgoliaHit {
  offer: Offer
  _geoloc: Geoloc
  objectID: string
}

export interface AlgoliaFacetsAnalyticsCategory {
  attribute: string
  operator: string
  value: SearchGroupNameEnumv2
  count: number
}

export interface AlgoliaFacetsAnalytics {
  [key: string]: AlgoliaFacetsAnalyticsCategory[]
}

export interface AlgoliaFacets {
  analytics: AlgoliaFacetsAnalytics
}

export interface AlgoliaIndexInfos {
  exact_nb_hits: number
  facets: AlgoliaFacets
}

export type AlgoliaSuggestionHit = Hit<{
  query: string
  [key: string]: AlgoliaIndexInfos
}>

export interface HighlightResultAttribute {
  query: HighlightResult
}

export interface HighlightResult {
  fullyHighlighted: boolean
  matchLevel: string
  matchedWords: string[]
  value: string
}

export interface AlgoliaVenue {
  objectID: string
  city: string
  name: string
  offerer_name: string
  venue_type: string
  description: string
  audio_disability: boolean | null
  mental_disability: boolean | null
  motor_disability: boolean | null
  visual_disability: boolean | null
  email: string | null
  phone_number: string | null
  website: string | null
  facebook: string | null
  twitter: string | null
  instagram: string | null
  snapchat: string | null
  banner_url: string | null
  _geoloc: Geoloc
}
