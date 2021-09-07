import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SuggestedPlace } from 'libs/place'
import { Range } from 'libs/typesUtils/typeHelpers'

import { LocationType } from './enums'

export interface SelectedDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: Date
}

interface LocationFilter {
  aroundRadius: number | null
  // user location
  geolocation: { latitude: number; longitude: number } | null
  place: Omit<SuggestedPlace, 'venueId'> | null
  locationType: LocationType
  venueId: number | null
}

export interface SearchState {
  beginningDatetime: Date | null
  date: SelectedDate | null
  endingDatetime: Date | null
  hitsPerPage: number | null
  locationFilter: LocationFilter
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
  showResults: boolean
  timeRange: Range<number> | null
  tags: string[]
  query: string
}
