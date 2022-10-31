import { SearchGroupNameEnumv2, SubcategoryIdEnumv2 } from 'api/gen'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SuggestedPlace } from 'libs/place'
import { Range } from 'libs/typesUtils/typeHelpers'
import { SuggestedVenue } from 'libs/venue'

import { LocationType } from './enums'

interface SelectedDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: string
}

export type LocationFilter =
  | { locationType: LocationType.EVERYWHERE }
  | { locationType: LocationType.AROUND_ME; aroundRadius: number | null }
  | { locationType: LocationType.PLACE; place: SuggestedPlace; aroundRadius: number }
  | { locationType: LocationType.VENUE; venue: SuggestedVenue }

export enum SearchView {
  Landing = 'Landing',
  Suggestions = 'Suggestions',
  Results = 'Results',
}

export interface SearchState {
  beginningDatetime: string | null
  date: SelectedDate | null
  endingDatetime: string | null
  hitsPerPage: number | null
  locationFilter: LocationFilter
  offerCategories: SearchGroupNameEnumv2[]
  offerSubcategories: SubcategoryIdEnumv2[]
  offerIsDuo: boolean
  offerIsFree: boolean
  offerIsNew: boolean
  offerTypes: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }
  priceRange: Range<number> | null
  timeRange: Range<number> | null
  tags: string[]
  query: string
  view: SearchView
  noFocus?: boolean
  previousView?: SearchView
  minPrice?: string
  maxPrice?: string
}

export type OfferTypes = keyof SearchState['offerTypes']
