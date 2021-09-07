import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SuggestedPlace, SuggestedVenue } from 'libs/place'
import { Range } from 'libs/typesUtils/typeHelpers'

import { LocationType } from './enums'

export interface SelectedDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: Date
}

type LocationFilter =
  | { locationType: LocationType.EVERYWHERE }
  | { locationType: LocationType.AROUND_ME; aroundRadius: number | null }
  | { locationType: LocationType.PLACE; place: SuggestedPlace; aroundRadius: number }
  | { locationType: LocationType.VENUE; venue: SuggestedVenue }

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
