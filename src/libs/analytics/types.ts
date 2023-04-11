import { AmplitudeEvent } from 'libs/amplitude/events'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

export type AnalyticsProvider = {
  disableCollection: () => Promise<void> | void
  enableCollection: () => Promise<void> | void
  logScreenView: (screenName: string) => Promise<void> | void
  logEvent: (
    eventName: { firebase?: AnalyticsEvent; amplitude?: AmplitudeEvent },
    params?: Record<string, unknown>
  ) => Promise<void> | void
} & typeof logEventAnalytics

type BaseThematicHome = {
  homeEntryId: string
  from?: never
  moduleId?: never
  moduleListId?: never
}

type CategoryBlockThematicHome = BaseThematicHome & {
  from: 'category_block'
  moduleId: string
  moduleListId: string
}

type HighlightThematicBlockThematicHome = BaseThematicHome & {
  from: 'highlight_thematic_block'
  moduleId: string
  moduleListId?: never
}

export type ChangeSearchLocationParam =
  | { type: 'place' | 'everywhere' | 'aroundMe' }
  | { type: 'venue'; venueId: number | null }

export type ConsultHomeParams =
  | BaseThematicHome
  | CategoryBlockThematicHome
  | HighlightThematicBlockThematicHome

export type OfferAnalyticsData = {
  offerId?: number
}

export type OfferIdOrVenueId = { offerId: number } | { venueId: number }

export type PerformSearchState = {
  searchLocationFilter: string
  searchView: string
  searchId?: string
  searchDate?: string
  searchIsAutocomplete?: boolean
  searchMaxPrice?: string
  searchMinPrice?: string
  searchCategories?: string
  searchGenreTypes?: string
  searchOfferIsDuo?: boolean
  searchOfferIsFree?: boolean
  searchNativeCategories?: string
  searchQuery?: string
  searchTimeRange?: string
}
