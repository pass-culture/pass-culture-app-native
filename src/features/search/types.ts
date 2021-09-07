import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SuggestedPlace } from 'libs/place'
import { Range } from 'libs/typesUtils/typeHelpers'

import { LocationType } from './enums'

export interface SelectedDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: Date
}

export interface SearchState {
  aroundRadius: number | null
  beginningDatetime: Date | null
  date: SelectedDate | null
  endingDatetime: Date | null
  hitsPerPage: number | null
  geolocation: { latitude: number; longitude: number } | null
  offerCategories: string[]
  offerIsDuo: boolean
  offerIsFree: boolean
  offerIsNew: boolean
  offerTypes: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }
  place: Omit<SuggestedPlace, 'venueId'> | null
  priceRange: Range<number> | null
  locationType: LocationType
  showResults: boolean
  timeRange: Range<number> | null
  tags: string[]
  venueId: number | null
  query: string
}
