import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'

export const HISTORY_KEY = 'search_history'
export const MAX_HISTORY_RESULTS = 20
export const MIN_HISTORY_RESULTS = 2
export const LIST_ITEM_HEIGHT = 130
export const DEFAULT_RADIUS = 50
export const ALL_CATEGORIES_LABEL = 'Toutes les catégories'

export const VENUE_TYPES_BY_SEARCH_GROUP: Partial<
  Record<SearchGroupNameEnumv2, VenueTypeCodeKey[]>
> = {
  [SearchGroupNameEnumv2.LIVRES]: [
    VenueTypeCodeKey.BOOKSTORE,
    VenueTypeCodeKey.DISTRIBUTION_STORE,
    VenueTypeCodeKey.LIBRARY,
  ],
  [SearchGroupNameEnumv2.CINEMA]: [VenueTypeCodeKey.MOVIE],
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: [VenueTypeCodeKey.DISTRIBUTION_STORE],
  [SearchGroupNameEnumv2.MUSIQUE]: [
    VenueTypeCodeKey.RECORD_STORE,
    VenueTypeCodeKey.DISTRIBUTION_STORE,
    VenueTypeCodeKey.CONCERT_HALL,
    VenueTypeCodeKey.FESTIVAL,
  ],
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: [
    VenueTypeCodeKey.FESTIVAL,
    VenueTypeCodeKey.CONCERT_HALL,
  ],
}
