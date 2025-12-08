import { Activity, SearchGroupNameEnumv2 } from 'api/gen'

export const HISTORY_KEY = 'search_history'
export const MAX_HISTORY_RESULTS = 20
export const MIN_HISTORY_RESULTS = 2
export const DEFAULT_RADIUS = 50
export const ALL_CATEGORIES_LABEL = 'Toutes les catégories'

export const ACTIVITIES_BY_SEARCH_GROUP: Partial<Record<SearchGroupNameEnumv2, Activity[]>> = {
  [SearchGroupNameEnumv2.LIVRES]: [
    Activity.BOOKSTORE,
    Activity.DISTRIBUTION_STORE,
    Activity.LIBRARY,
  ],
  [SearchGroupNameEnumv2.CINEMA]: [Activity.CINEMA],
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: [Activity.DISTRIBUTION_STORE],
  [SearchGroupNameEnumv2.MUSIQUE]: [
    Activity.RECORD_STORE,
    Activity.DISTRIBUTION_STORE,
    Activity.PERFORMANCE_HALL,
    Activity.FESTIVAL,
  ],
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: [Activity.FESTIVAL, Activity.PERFORMANCE_HALL],
}
