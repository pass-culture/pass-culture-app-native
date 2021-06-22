import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SuggestedPlace } from 'libs/place'
import { AlgoliaGeolocation } from 'libs/search'
import { Range } from 'libs/typesUtils/typeHelpers'

import { LocationType } from './enums'

export interface SelectedDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: Date
}

export interface SearchParameters {
  aroundRadius: number | null
  beginningDatetime: Date | null
  date: SelectedDate | null
  endingDatetime: Date | null
  hitsPerPage: number | null
  geolocation: AlgoliaGeolocation | null
  offerCategories: string[]
  offerIsDuo: boolean
  offerIsFree: boolean
  offerIsNew: boolean
  offerTypes: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }
  priceRange: Range<number> | null
  locationType: LocationType
  timeRange: Range<number> | null
  tags: string[]
}

export type SearchState = SearchParameters & {
  place: SuggestedPlace | null
  showResults: boolean
  query: string
}
