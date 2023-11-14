import { SearchResponse } from '@algolia/client-search'
import { FunctionComponent } from 'react'

import {
  GenreType,
  GenreTypeContentModel,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { Venue } from 'features/venue/types'
import { SuggestedPlace } from 'libs/place'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Offer } from 'shared/offer/types'
import { RenderItemProps } from 'ui/components/OptimizedList/types'

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
  isFullyDigitalOffersCategory?: boolean
  // TODO(EveJulliard): re typer la fonction parseSearchParameters
  // pour supprimer minBookingsThreshold du type SearchState
  minBookingsThreshold?: number
  includeDigitalOffers?: boolean
  isFromHistory?: boolean
}

export type UserData = {
  message: string
}

export type DescriptionContext = {
  category: SearchGroupNameEnumv2
  nativeCategory: NativeCategoryIdEnumv2 | null
  genreType: string | null
}

type VenueUserTitleRule = { venue_playlist_title: string }
type VenueUserData = VenueUserTitleRule | undefined
export type VenuesUserData = VenueUserData[] | undefined

export interface SearchListProps {
  nbHits: number
  hits: SearchOfferHits
  venuesUserData: VenuesUserData
  renderItem: FunctionComponent<RenderItemProps<Offer, unknown>>
  autoScrollEnabled: boolean
  refreshing: boolean
  onRefresh?: VoidFunction
  isFetchingNextPage: boolean
  onEndReached: VoidFunction
  userData: SearchResponse<Offer[]>['userData']
  onPress?: VoidFunction
}

export type CreateHistoryItem = {
  query: string
  nativeCategory?: NativeCategoryIdEnumv2
  category?: SearchGroupNameEnumv2
}

export type Highlighted<TItem> = TItem & {
  _highlightResult: {
    query: {
      value: string
    }
  }
}

export type HistoryItem = CreateHistoryItem & {
  createdAt: number
  label: string
  nativeCategoryLabel?: string
  categoryLabel?: string
}
