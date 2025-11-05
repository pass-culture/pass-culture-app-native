import { SearchResponse } from '@algolia/client-search'
import React, { ReactNode } from 'react'
import { ViewToken } from 'react-native'

import {
  GenreType,
  GenreTypeContentModel,
  GTL,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { Venue } from 'features/venue/types'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Offer } from 'shared/offer/types'
import { ColorsType } from 'theme/types'
import { AccessibleIcon } from 'ui/svg/icons/types'
interface SelectedDate {
  option: DATE_FILTER_OPTIONS
  selectedDate: string
}

export type LocationFilter =
  | { locationType: LocationMode.EVERYWHERE }
  | { locationType: LocationMode.AROUND_ME; aroundRadius: number | null }
  | { locationType: LocationMode.AROUND_PLACE; place: SuggestedPlace; aroundRadius: number }

export enum SearchView {
  Landing = 'SearchLanding',
  Results = 'SearchResults',
  Thematic = 'ThematicSearch',
}

export enum GridListLayout {
  GRID = 'Grille',
  LIST = 'Liste',
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
  offerNativeCategories?: NativeCategoryIdEnumv2[] | BooksNativeCategoriesEnum[]
  offerSubcategories: SubcategoryIdEnumv2[]
  offerIsDuo: boolean
  offerIsFree?: boolean
  isDigital: boolean
  priceRange: Range<number> | null
  timeRange: Range<number> | null
  tags: string[]
  query: string
  minPrice?: string
  maxPrice?: string
  defaultMinPrice?: string
  defaultMaxPrice?: string
  searchId?: string
  maxPossiblePrice?: string
  isAutocomplete?: boolean
  isFullyDigitalOffersCategory?: boolean
  minBookingsThreshold?: number
  isFromHistory?: boolean
  venue?: Venue
  gtls?: GTL[]
  calendarFilterId?: CalendarFilterId
}

export type DescriptionContext = {
  category: SearchGroupNameEnumv2
  nativeCategory: NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum | null
  genreType: string | null
}

type VenueUserTitleRule = { venue_playlist_title: string }
type VenueUserData = VenueUserTitleRule | undefined
export type VenuesUserData = VenueUserData[] | undefined

export interface SearchListProps {
  nbHits: number
  hits: SearchOfferHits
  venuesUserData: VenuesUserData
  renderItem: ({ item, index }: { item: Offer; index: number }) => React.JSX.Element
  autoScrollEnabled: boolean
  refreshing: boolean
  onRefresh: (() => void) | null | undefined
  isFetchingNextPage: boolean
  onEndReached: () => void
  userData: SearchResponse<Offer[]>['userData']
  onScroll?: () => void
  onPress?: () => void
  artistSection?: ReactNode
  numColumns?: number
  isGridLayout?: boolean
  shouldDisplayGridList?: boolean
  setGridListLayout?: React.Dispatch<React.SetStateAction<GridListLayout>>
  onViewableItemsChanged?: (info: {
    viewableItems: ViewToken<unknown>[]
    changed: ViewToken<unknown>[]
  }) => void
  onViewableVenuePlaylistItemsChanged?: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
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

export enum BooksNativeCategoriesEnum {
  'ROMANS_ET_LITTERATURE' = 'ROMANS_ET_LITTERATURE',
  'MANGAS' = 'MANGAS',
  'BD_ET_COMICS' = 'BD_ET_COMICS',
  'COMPETENCES_GENERALES' = 'COMPETENCES_GENERALES',
  'LOISIRS_ET_BIEN_ETRE' = 'LOISIRS_ET_BIEN_ETRE',
  'MODE_ET_ART' = 'MODE_ET_ART',
  'SOCIETE_ET_POLITIQUE' = 'SOCIETE_ET_POLITIQUE',
  'THEATRE_POESIE_ET_ESSAIS' = 'THEATRE_POESIE_ET_ESSAIS',
  'TOURISME_ET_VOYAGES' = 'TOURISME_ET_VOYAGES',
}

export type NativeCategoryEnum = NativeCategoryIdEnumv2 | BooksNativeCategoriesEnum

export type MarkedDatesColors = { backgroundColor: ColorsType; textColor: ColorsType }

export type CalendarModalFormData = {
  selectedStartDate?: Date
  selectedEndDate?: Date
  selectedFilterMode?: CalendarFilterId
}

export type CalendarFilterId = 'today' | 'thisWeek' | 'thisWeekend' | 'thisMonth' | 'nextMonth'

export type LayoutButtonProps = {
  layout: GridListLayout
  isSelected: boolean
  onPress: () => void
  Icon: React.FC<AccessibleIcon>
}

export type ThematicPlaylistProps = {
  shouldDisplayVenuesPlaylist: boolean
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
  searchId?: string
}
