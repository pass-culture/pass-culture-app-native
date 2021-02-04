import { GeoCoordinates } from 'react-native-geolocation-service'

import { DATE_FILTER_OPTIONS } from 'libs/algolia/enums/filtersEnums'
import { SuggestedPlace } from 'libs/place'
import { Range } from 'libs/typesUtils/typeHelpers'

export type AlgoliaGeolocation = Pick<GeoCoordinates, 'longitude' | 'latitude'>

interface AlgoliaDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: Date
}

export enum LocationType {
  AROUND_ME = 'AROUND_ME',
  EVERYWHERE = 'EVERYWHERE',
  PLACE = 'PLACE',
}

/**
 * See Algolia doc on numericFilters and facetFilters
 *
 * [['A', 'B'], 'C'] <=> (A OR B) AND C
 */
export type FiltersArray = string[][]

export interface ParsedAlgoliaParameters {
  hitsPerPage: number | null
  aroundRadius: number | null
  offerCategories: string[]
  tags: string[]
  offerIsDuo: boolean
  offerIsFree: boolean
  offerIsNew: boolean
  offerTypes: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }
  beginningDatetime: Date | null
  endingDatetime: Date | null
  priceRange: Range<number> | null
  locationType: LocationType
  geolocation: AlgoliaGeolocation | null
  place?: SuggestedPlace | null
}

export interface ExtraAlgoliaParameters {
  date: AlgoliaDate | null
  keywords: string
  page: number
  timeRange: Range<number> | null
}
export type FetchAlgoliaParameters = ParsedAlgoliaParameters & Partial<ExtraAlgoliaParameters>
