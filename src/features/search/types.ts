import {
  GenreType,
  GenreTypeContentModel,
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { CategoriesModalView, DATE_FILTER_OPTIONS } from 'features/search/enums'
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

export type OfferGenreType = { key: GenreType } & GenreTypeContentModel

export interface SearchState {
  beginningDatetime?: string
  date: SelectedDate | null
  endingDatetime?: string
  hitsPerPage: number | null
  locationFilter: LocationFilter
  offerCategories: SearchGroupNameEnumv2[]
  offerGenreTypes?: OfferGenreType[]
  offerNativeCategories?: NativeCategoryIdEnumv2[]
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
  searchId?: string
  maxPossiblePrice?: string
  isAutocomplete?: boolean
}

export type OfferTypes = keyof SearchState['offerTypes']

export type UserData = {
  message: string
}

export type CategoriesModalFormProps = {
  category: SearchGroupResponseModelv2
  nativeCategory: NativeCategoryResponseModelv2 | null
  genreType: OfferGenreType | null
  currentView: CategoriesModalView
}

export type DescriptionContext = {
  selectedCategory: SearchGroupResponseModelv2
  selectedNativeCategory: NativeCategoryResponseModelv2 | null
  selectedGenreType: OfferGenreType | null
}
export type CategoriesViewData =
  | NativeCategoryResponseModelv2
  | SearchGroupResponseModelv2
  | OfferGenreType
