import { Hit } from 'instantsearch.js'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2, SubcategoryIdEnum } from 'api/gen'

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

export interface AlgoliaFacetsAnalyticsKey {
  attribute: string
  operator: string
  count: number
}

export interface AlgoliaFacetsAnalyticsNativeCategory extends AlgoliaFacetsAnalyticsKey {
  value: NativeCategoryIdEnumv2
}

export interface AlgoliaFacetsAnalyticsCategory extends AlgoliaFacetsAnalyticsKey {
  value: SearchGroupNameEnumv2
}

export interface AlgoliaFacetsAnalytics {
  ['offer.nativeCategoryId']: AlgoliaFacetsAnalyticsNativeCategory[]
  ['offer.searchGroupNamev2']: AlgoliaFacetsAnalyticsCategory[]
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
