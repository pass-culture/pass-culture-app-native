import { SearchResponse } from '@algolia/client-search'

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
import {
  MappedGenreTypes,
  MappedNativeCategories,
  MappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { Venue } from 'features/venue/types'
import { SuggestedPlace } from 'libs/place'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Offer } from 'shared/offer/types'

import { LocationType } from './enums'

interface SelectedDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: string
}

export type LocationFilter =
  | { locationType: LocationType.EVERYWHERE }
  | { locationType: LocationType.AROUND_ME; aroundRadius: number | null }
  | { locationType: LocationType.PLACE; place: SuggestedPlace; aroundRadius: number }
  | { locationType: LocationType.VENUE; venue: Venue }

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
  offerIsFree?: boolean
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
  isOnline?: boolean
  // TODO(EveJulliard): re typer la fonction parseSearchParameters
  // pour supprimer minBookingsThreshold du type SearchState
  minBookingsThreshold?: number
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
  category: SearchGroupNameEnumv2
  nativeCategory: NativeCategoryIdEnumv2 | null
  genreType: string | null
}
export type CategoriesViewData =
  | NativeCategoryResponseModelv2
  | SearchGroupResponseModelv2
  | OfferGenreType

export type MappedData = MappingTree | MappedNativeCategories | MappedGenreTypes

export interface SearchListProps {
  nbHits: number
  hits: Offer[]
  renderItem: ({ item, index }: { item: Offer; index: number }) => JSX.Element
  autoScrollEnabled: boolean
  refreshing: boolean
  onRefresh: (() => void) | null | undefined
  isFetchingNextPage: boolean
  onEndReached: () => void
  userData: SearchResponse<Offer[]>['userData']
  onScroll?: () => void
  onPress?: () => void
}
